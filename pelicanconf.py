#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals
from datetime import datetime

AUTHOR = 'Rafnix Guzmán'
SITEURL = 'https://rafnixg.github.io'
SITENAME = 'Rafnixg - Bitácora de un programador autodidacta(a los golpes)'
SITETITLE = 'Rafnixg'
SITESUBTITLE = 'Bitácora de un programador autodidacta(a los golpes)'
SITEDESCRIPTION = 'Rafnixg - Bitácora de un programador autodidacta(a los golpes)'
# SITELOGO = ''
# FAVICON = '/images/favicon.ico'

BROWSER_COLOR = '#333333'
ROBOTS = 'index, follow'

PYGMENTS_STYLE = 'monokai'
THEME = 'theme/Flex/'

PATH = 'content'
STATIC_PATHS = ['images','extra']

PLUGIN_PATHS = ['pelican-plugins']
PLUGINS = ["neighbors","sitemap",]
# PLUGINS = ["representative_image","neighbors","sitemap",]

TIMEZONE = 'America/Lima'

I18N_TEMPLATES_LANG = 'es'
DEFAULT_LANG = 'es'
OG_LOCALE = 'es_ES'
LOCALE = 'es_ES'

DATE_FORMATS = {
    'en': '%B %d, %Y',
    }

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = 'feeds/all.atom.xml'
FEED_ALL_RSS = 'feeds/all.rss.xml'
CATEGORY_FEED_ATOM = 'feeds/{slug}.atom.xml'
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = 'feeds/{slug}.rss.xml'
RSS_FEED_SUMMARY_ONLY = False

USE_FOLDER_AS_CATEGORY = False
MAIN_MENU = True
HOME_HIDE_TAGS = True

SOCIAL = (('github', 'https://github.com/rafnixg'),
         ('linkedin','https://www.linkedin.com/in/rafnixg/'),
         ('twitter','https://twitter.com/rafnixg'),
        )
CC_LICENSE = {
    'name': 'Creative Commons Attribution-ShareAlike',
        'version': '4.0',
            'slug': 'by-sa'
            }

DEFAULT_PAGINATION = 10
COPYRIGHT_YEAR = datetime.now().year

DISQUS_SITENAME = "rafnixg-blog"
GOOGLE_ANALYTICS = "UA-140411474-1"
# ADD_THIS_ID = 'ra-55adbb025d4f7e55'
# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = True
CUSTOM_CSS = 'static/custom.css'

USE_LESS = True

SITEMAP = {
    'format': 'xml',
    'priorities': {
        'articles': 0.5,
        'indexes': 0.5,
        'pages': 0.5
    },
    'changefreqs': {
        'articles': 'monthly',
        'indexes': 'daily',
        'pages': 'monthly'
    },
    'exclude': []
}