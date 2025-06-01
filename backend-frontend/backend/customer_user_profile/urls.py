from django.urls import path

from customer_user_profile.customerFeedView import GetFollowedBusinessesForFeedView, SearchBusinessView, \
    GetBusinessesForMaps

urlpatterns = [
    path('user/followed-businesses/', GetFollowedBusinessesForFeedView.as_view(), name='Get followed businesses'),
    path('user/search-businesses/', SearchBusinessView.as_view(), name='Search for businesses'),
    path('user/map-businesses/', GetBusinessesForMaps.as_view(), name='Search for businesses'),

]
