from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, EmergencyContact

class EmergencyContactInline(admin.TabularInline):
    """
    Allows editing of emergency contacts directly within the user admin page.
    """
    model = EmergencyContact
    extra = 1  # Number of empty forms to display

class CustomUserAdmin(UserAdmin):
    """
    Custom user admin configuration that includes emergency contacts.
    """
    inlines = (EmergencyContactInline,)
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Contact Info', {'fields': ('phone',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Contact Info', {'fields': ('phone',)}),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(EmergencyContact)