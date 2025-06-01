from django.contrib import admin

from customer_card.models import CustomerCard, CardType


@admin.register(CustomerCard)
class CustomerCardAdmin(admin.ModelAdmin):
    list_display = ['customer_user_profile']


@admin.register(CardType)
class CardTypeAdmin(admin.ModelAdmin):
    list_display = ['type']
