from voucher_card.models import VoucherCard, VoucherType
from django.contrib import admin


@admin.register(VoucherCard)
class VoucherAdmin(admin.ModelAdmin):
    list_display = ['date_created', 'voucher_type', 'customer_user_profile', 'campaign', 'promotion']


@admin.register(VoucherType)
class VoucherTypeAdmin(admin.ModelAdmin):
    list_display = ['type']
