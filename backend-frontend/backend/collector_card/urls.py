from django.urls import path

from collector_card.views import CollectorValidateView, BusinessAndSpecificUserUncollectedCollector, \
    CustomerUsersAllCampaignCollectors, CustomerCollectorLogs

urlpatterns = [
    # Business user validates collector by adding points or stamps
    path('collector-card/validate/', CollectorValidateView.as_view(), name='checks in collector (add points)'),

    # Customer user gets its collectors in account section, cards tab
    path('collector-card/customer/', CustomerUsersAllCampaignCollectors.as_view(),
         name='customer gets all collectors'),

    # # Business user gets all specific user collectors according his active campaigns
    # path('collector-card/customer-to-validate/', CustomerUsersSpecificCampaignCollectors.as_view(),
    #      name='customer gets specific campaign collectors'),

    path('collector-card/business/', BusinessAndSpecificUserUncollectedCollector.as_view(),
         name='customer and specific users collectors'),

    path('collector-card/collector-logs/<int:collector_id>', CustomerCollectorLogs.as_view(),
         name='customer collector logs'),

]
