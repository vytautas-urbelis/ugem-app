from django.contrib import admin
from .models import Campaign, CollectorType, StampDesign


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ['name', 'value_goal', 'beginning_date', 'ending_date', 'color', 'self_scann_amount']


@admin.register(CollectorType)
class CollectorTypeAdmin(admin.ModelAdmin):
    list_display = ['name']


@admin.register(StampDesign)
class StampDesignAdmin(admin.ModelAdmin):
    list_display = ['name']
