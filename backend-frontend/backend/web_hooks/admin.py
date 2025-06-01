from django.contrib import admin

from web_hooks.models import RevenueCatEvent


@admin.register(RevenueCatEvent)
class BusinessUserProfileAdmin(admin.ModelAdmin):
    list_display = ['event_timestamp', 'type', 'period_type', 'app_user_id', 'original_app_user_id', 'currency',
                    'price']
