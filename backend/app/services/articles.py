from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
import xml.etree.ElementTree as ET
from urllib.parse import urlparse

import httpx
from sqlalchemy.orm import Session

from app.models import Article

RSS_URL = "https://blog.rafnixg.dev/rss.xml"


class _PlainText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts: list[str] = []

    def handle_data(self, data: str):
        self.parts.append(data)


def _text(item: ET.Element, tag: str) -> str:
    node = item.find(tag)
    return " ".join("".join(node.itertext()).split()) if node is not None else ""


def sync_articles(db: Session) -> int:
    response = httpx.get(RSS_URL, timeout=20, follow_redirects=True)
    response.raise_for_status()
    root = ET.fromstring(response.content)
    items = root.findall("./channel/item")
    count = 0
    for item in items:
        url = _text(item, "link")
        title = _text(item, "title")
        guid = _text(item, "guid") or url
        description = _text(item, "description")
        parsed_url = urlparse(url)
        if not guid or not title or parsed_url.scheme != "https" or parsed_url.hostname != "blog.rafnixg.dev":
            continue
        parser = _PlainText()
        parser.feed(description)
        description = " ".join("".join(parser.parts).split())
        raw_date = _text(item, "pubDate")
        try:
            date_added = parsedate_to_datetime(raw_date).astimezone(timezone.utc)
        except (TypeError, ValueError):
            date_added = datetime.now(timezone.utc)
        article = db.get(Article, guid)
        if article is None:
            article = Article(
                id=guid,
                title=title,
                brief=description[:5000],
                url=url,
                date_added=date_added,
                visible=True,
                sort_order=count,
            )
            db.add(article)
        else:
            article.title = title
            article.brief = description[:5000]
            article.url = url
            article.date_added = date_added
        count += 1
    db.commit()
    return count
