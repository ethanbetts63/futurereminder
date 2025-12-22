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
            '/articles',
            '/articles/letter-to-future-self',
            '/articles/vaccine-boosters',
            '/articles/iud-expiration',
            '/articles/anniversary-reminders',
            '/articles/subscription-renewal',
            '/articles/visa-expiry',
            '/articles/reminder-apps-ranked',
            '/articles/caring-for-roses-seasonal-guide',
            '/articles/caring-for-hydrangeas-seasonal-guide',
            '/articles/caring-for-lavender-seasonal-guide',
            '/articles/caring-for-crepe-myrtle-seasonal-guide',
            '/articles/caring-for-azaleas-seasonal-guide',
            '/articles/caring-for-cherry-trees-seasonal-guide',
            '/articles/caring-for-apple-trees-seasonal-guide',
            '/articles/caring-for-peonies-seasonal-guide',
            '/articles/caring-for-blueberry-bushes-seasonal-guide',
            '/articles/tax-season-2026',
            '/articles/best-daily-reminder-apps',
            '/articles/best-free-reminder-apps',
            '/articles/best-email-reminder-apps',
            '/articles/best-text-message-reminder-apps',
            '/articles/best-medication-reminder-apps',
            '/articles/best-bill-and-subscription-reminder-apps',
        ]

    def location(self, item):
        # For items that are full paths, return them directly.
        # For others, you might use reverse(), but here we handle all as paths.
        return item

    def changefreq(self, item):
        if item == '/articles':
            return 'monthly'
        if item.startswith('/articles/'):
            return 'monthly'
        if item == '/':
            return 'weekly'
        return 'monthly'

    def priority(self, item):
        if item == '/articles':
            return 0.8
        if item.startswith('/articles/'):
            return 0.9
        if item == '/':
            return 1.0
        return 0.7
