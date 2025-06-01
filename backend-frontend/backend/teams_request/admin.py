from django.contrib import admin

from teams_request.models import TeamsRequest


@admin.register(TeamsRequest)
class TeamsRequestAdmin(admin.ModelAdmin):
    list_display = ['status', 'requester', 'receiver', 'created_at', 'updated_at', 'deleted']
