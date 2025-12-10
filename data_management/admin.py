from django.contrib import admin
from .models import FAQ

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'pages')
    search_fields = ('question', 'answer')
    list_filter = ('pages',)