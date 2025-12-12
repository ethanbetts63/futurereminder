from django.contrib.sitemaps import Sitemap
from django.urls import reverse

class StaticViewSitemap(Sitemap):
    """
    Sitemap for static pages and frontend-routed articles.
    """
    protocol = 'https'

    def items(self):
        # This list contains the names of the URL patterns for static pages
        # and the full paths for frontend-only routes like articles.
        return [
            '/',
            '/login',
            '/event-gate',
            '/articles/letter-to-future-self',
            '/articles/vaccine-boosters',
            '/articles/iud-expiration',
            '/articles/anniversary-reminders',
            '/articles/subscription-renewal',
            '/articles/visa-expiry',
            '/articles/reminder-apps-ranked',
        ]

    def location(self, item):
        # For items that are full paths, return them directly.
        # For others, you might use reverse(), but here we handle all as paths.
        return item

    def changefreq(self, item):
        if item.startswith('/articles/'):
            return 'monthly'
        if item == '/':
            return 'monthly'
        return 'yearly'

    def priority(self, item):
        if item.startswith('/articles/'):
            return 0.9
        if item == '/':
            return 1.0
        return 0.8
