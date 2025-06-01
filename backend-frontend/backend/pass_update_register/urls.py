from django.urls import path

from pass_update_register.views import CardRegisterEndpoint, CheckForUpdate, GetUpdatedPass

urlpatterns = [
    path(
        'v1/devices/<str:deviceLibraryIdentifier>/registrations/<str:passTypeIdentifier>/<str:serialNumber>',
        CardRegisterEndpoint.as_view(), name='register apple pass for update'),
    path(
        'v1/devices/<str:deviceLibraryIdentifier>/registrations/<str:passTypeIdentifier>',
        CheckForUpdate.as_view(), name='Check if there is an update'),
    path(
        'v1/passes/<str:passTypeIdentifier>/<str:serialNumber>',
        GetUpdatedPass.as_view(), name='Get updated pass')

]
