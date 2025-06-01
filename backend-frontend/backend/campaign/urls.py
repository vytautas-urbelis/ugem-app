from django.urls import path

from campaign.views import ListCreateApiCampaignView, ReadUpdateDeleteCampaignView, \
    ListOpenCampaignsView, ListClosedCampaignsView, Last48HoursVisitsView, ListOpenCampaignsForTeamsView, \
    ListSpecificBusinessOpenCampaignsView, SelfScanCampaignView

urlpatterns = [
    path('campaign/', ListCreateApiCampaignView.as_view(), name='create, get logged in business campaigns'),
    path('campaign/open/', ListOpenCampaignsView.as_view(), name='get logged in business open campaigns'),
    path('campaign/customer/open/<int:pk>', ListSpecificBusinessOpenCampaignsView.as_view(),
         name='get specific business open campaigns for customer which is visiting business profile on app'),
    path('campaign/teams/open/<int:pk>', ListOpenCampaignsForTeamsView.as_view(),
         name='get teams business open campaigns'),
    path('campaign/closed/', ListClosedCampaignsView.as_view(), name='get logged in business closed campaigns'),
    path('campaign/<int:pk>', ReadUpdateDeleteCampaignView.as_view(),
         name='update, delete logged in business campaigns'),
    path('campaign/visits/last48/<int:pk>', Last48HoursVisitsView.as_view(),
         name='get last 48 hours scanned qr (checkins)'),
    path('self-scan/', SelfScanCampaignView.as_view(), name='self scan campaigns'),
    # path('campaign/customer/<str:secret_key>', ListEndUsersCampaignsView.as_view(), name='Get all End Users campaigns'),

]
