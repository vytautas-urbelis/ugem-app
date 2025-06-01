from insights.views import CustomersPointsMoneyCountView, CustomersStampsCountView, CustomersVisitsCountView, \
    NotClaimedVouchersView
from django.urls import path

urlpatterns = [
    path('insights/stamps/<int:campaign_id>/', CustomersStampsCountView.as_view(), name='Get users stamps count'),
    path('insights/points/<int:campaign_id>/', CustomersPointsMoneyCountView.as_view(),
         name='Get users points money count'),
    path('insights/visits/<int:campaign_id>/', CustomersVisitsCountView.as_view(), name='Get users visits count'),
    path('insights/vouchers/<int:campaign_id>/', NotClaimedVouchersView.as_view(), name='Get unclaimed vouchers'),

]
