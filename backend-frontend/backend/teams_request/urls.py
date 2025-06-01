from django.urls import path

from teams_request.views import TeamsRequestView, TeamsRequestUpdateView, MyTeams

urlpatterns = [
    path('teams-request/', TeamsRequestView.as_view(), name='create, get requests'),
    path('teams-request/update/<int:pk>', TeamsRequestUpdateView.as_view(), name='update request'),
    path('teams-request/my-teams/', MyTeams.as_view(), name='get teams the user is in'),

]
