from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin


@admin.register(User)
class UserAdmin(UserAdmin):
    readonly_fields = ('date_joined',)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_business')}
         ),
    )
    list_display = ('email', 'date_joined', 'is_business')
    ordering = ('email',)
