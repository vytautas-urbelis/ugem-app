from django.contrib import admin

from promotion.models import Promotion


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'image', 'vouchers_amount', 'business_user_profile']
