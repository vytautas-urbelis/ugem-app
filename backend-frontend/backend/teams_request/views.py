from django.db.models import Q
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, UpdateAPIView, get_object_or_404
from rest_framework.response import Response

from teams_request.models import TeamsRequest
from teams_request.serializers import TeamsRequestSerializer

from django.contrib.auth import get_user_model

User = get_user_model()


class TeamsRequestView(ListCreateAPIView):
    serializer_class = TeamsRequestSerializer
    queryset = TeamsRequest.objects.all()

    def post(self, request, *args, **kwargs):
        receiver_email = request.data['receiver']
        user = self.request.user
        if not User.objects.filter(email=receiver_email).exists():
            return Response('No user found.', status=status.HTTP_400_BAD_REQUEST)

        invited_user = User.objects.get(email=receiver_email)
        if invited_user.customer_user_profile.is_verified:
            if TeamsRequest.objects.filter(receiver=invited_user, requester=user).exists():
                request_to_create = TeamsRequest.objects.get(receiver=invited_user, requester=user)
                if request_to_create.status == 'accepted' or request_to_create.status == 'pending':
                    return Response('Status cannot be changed.', status=status.HTTP_400_BAD_REQUEST)
                else:
                    request_to_create.status = 'pending'
                    request_to_create.deleted = None
                    request_to_create.save()
                    data = TeamsRequestSerializer(request_to_create).data
                    return Response(data, status=status.HTTP_201_CREATED)

            TeamsRequest.objects.create(status='pending', receiver=invited_user,
                                        requester=user)
            return self.retrieve_requests(self.request)

        else:
            return Response('No user found.', status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        return self.retrieve_requests(self.request)

    def retrieve_requests(self, request):
        user = request.user
        # Fetch all relevant TeamsRequests in a single query
        team_requests = TeamsRequest.objects.filter(
            Q(receiver=user) | Q(requester=user),
            status__in=['pending', 'accepted']
        ).select_related('receiver', 'requester')

        # Initialize lists to categorize requests
        incoming = []
        outgoing = []
        my_teams = []
        my_team_members = []

        # Categorize the requests
        for req in team_requests:
            if req.status == 'pending':
                if req.receiver == user:
                    incoming.append(req)
                else:
                    outgoing.append(req)
            elif req.status == 'accepted':
                if req.receiver == user:
                    my_teams.append(req)
                else:
                    my_team_members.append(req)

        # Serialize the categorized requests
        incoming_data = TeamsRequestSerializer(incoming, many=True).data
        outgoing_data = TeamsRequestSerializer(outgoing, many=True).data
        my_teams_data = TeamsRequestSerializer(my_teams, many=True).data
        my_team_members_data = TeamsRequestSerializer(my_team_members, many=True).data

        # Return the response with categorized data
        return Response(
            {
                'incoming': incoming_data,
                'outgoing': outgoing_data,
                'my_teams': my_teams_data,
                'my_team_members': my_team_members_data
            },
            status=status.HTTP_200_OK
        )

    # def retrieve_requests(self, request):
    #     incoming_requests = TeamsRequest.objects.filter(Q(receiver=request.user, status='pending'))
    #     incoming = TeamsRequestSerializer(incoming_requests, many=True).data
    #     outgoing_requests = TeamsRequest.objects.filter(Q(requester=request.user, status='pending'))
    #     outgoing = TeamsRequestSerializer(outgoing_requests, many=True).data
    #     incoming_accepted_requests = TeamsRequest.objects.filter(Q(receiver=request.user, status='accepted'))
    #     my_teams = TeamsRequestSerializer(incoming_accepted_requests, many=True).data
    #     outgoing_accepted_requests = TeamsRequest.objects.filter(Q(requester=request.user, status='accepted'))
    #     my_team_members = TeamsRequestSerializer(outgoing_accepted_requests, many=True).data
    #
    #     return Response(
    #         {'incoming': incoming, 'outgoing': outgoing, 'my_teams': my_teams, 'my_team_members': my_team_members},
    #         status=status.HTTP_200_OK)


class TeamsRequestUpdateView(UpdateAPIView):
    serializer_class = TeamsRequestSerializer
    queryset = TeamsRequest.objects.all()

    def patch(self, request, *args, **kwargs):
        user = self.request.user
        request_id = kwargs['pk']
        status_to_change = request.data['status']
        request_to_modify = get_object_or_404(TeamsRequest, id=request_id)
        if user == request_to_modify.requester:
            if status_to_change == 'deleted':
                request_to_modify.status = status_to_change
                request_to_modify.save()
                data = TeamsRequestSerializer(request_to_modify).data
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response('Status cannot be changed.', status=status.HTTP_400_BAD_REQUEST)
        elif user == request_to_modify.receiver:
            if status_to_change == 'deleted':
                request_to_modify.status = status_to_change
                request_to_modify.deleted = user
                request_to_modify.save()
                data = TeamsRequestSerializer(request_to_modify).data
                return Response(data, status=status.HTTP_200_OK)
            elif status_to_change == 'accepted' and request_to_modify.status == 'pending':
                request_to_modify.status = status_to_change
                request_to_modify.save()
                data = TeamsRequestSerializer(request_to_modify).data
                return Response(data, status=status.HTTP_200_OK)
            elif status_to_change == 'rejected' and request_to_modify.status == 'pending':
                request_to_modify.status = status_to_change
                request_to_modify.save()
                data = TeamsRequestSerializer(request_to_modify).data
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response('Status cannot be changed.', status=status.HTTP_400_BAD_REQUEST)


class MyTeams(ListCreateAPIView):
    serializer_class = TeamsRequestSerializer
    queryset = TeamsRequest.objects.all()

    def get(self, request, *args, **kwargs):
        user = self.request.user
        incoming_requests = TeamsRequest.objects.filter(Q(receiver=user, status='accepted'))
        incoming = TeamsRequestSerializer(incoming_requests, many=True).data
        return Response(incoming, status=status.HTTP_200_OK)
