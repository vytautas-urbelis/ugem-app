from django.contrib import admin

from .models import CollectorCard


@admin.register(CollectorCard)
class CollectorCardAdmin(admin.ModelAdmin):
    list_display = ['value_counted', 'date_created', 'is_collected', 'campaign', 'customer_user_profile',
                    'business_user_profile']
