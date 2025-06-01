from django.contrib import admin
from .models import Newsletter


@admin.register(Newsletter)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ['email', 'date']
