from django.contrib import admin

from pass_update_register.models import ApplePass, AppleDevice


# Register your models here.
@admin.register(AppleDevice)
class PassUpdateRegisterAdmin(admin.ModelAdmin):
    list_display = ['device_library_id']


@admin.register(ApplePass)
class DeviceUpdateRegisterAdmin(admin.ModelAdmin):
    list_display = ['pass_type_id', 'serial_number', 'last_updated']
