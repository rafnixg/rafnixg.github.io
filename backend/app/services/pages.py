"""Sanitize administrator-authored rich text before publication."""

import nh3


def clean_html(value: str) -> str:
    return nh3.clean(
        value,
        tags={"p", "br", "strong", "em", "u", "s", "h2", "h3", "blockquote", "ul", "ol", "li", "a", "img"},
        attributes={"a": {"href", "title"}, "img": {"src", "alt", "title"}},
        url_schemes={"https", "mailto"},
        link_rel="noopener noreferrer",
    )
