# import jwt
from django.contrib.auth import get_user_model

import datetime
from django.utils.timezone import make_aware

from rest_framework import status
from rest_framework.generics import ListCreateAPIView
# from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response

from project.permissions import IsRevCat
from web_hooks.models import RevenueCatEvent
from web_hooks.serializers import EventSerializer

User = get_user_model()


class AcceptRevenueCatHook(ListCreateAPIView):
    permission_classes = [IsRevCat]

    # permission_classes = []

    def post(self, request, *args, **kwargs):
        data = request.data["event"]
        id = data['id']

        event = RevenueCatEvent.objects.filter(event_id=id).first()

        if event:
            return Response(status=status.HTTP_200_OK)

        user_id = data['app_user_id']
        if user_id.startswith("android"):
            user_id = int(user_id.replace('android_', ''))
        elif user_id.startswith("ios"):
            user_id = int(user_id.replace('ios_', ''))

        user = User.objects.get(id=user_id)
        if data['type'] == 'INITIAL_PURCHASE' or data['type'] == 'RENEWAL':
            user.business_user_profile.subscription = True
            user.business_user_profile.save()
        if data['type'] == 'EXPIRATION':
            user.business_user_profile.subscription = False
            user.business_user_profile.save()

        data['user'] = user_id
        data['event_id'] = data.pop('id')
        data['event_timestamp'] = data.pop('event_timestamp_ms')
        data['purchased_at'] = data.pop('purchased_at_ms')
        data['expiration_at'] = data.pop('expiration_at_ms')
        serializer = EventSerializer(data=data)

        # Convert timestamps to datetime
        for field in ['event_timestamp', 'purchased_at', 'expiration_at']:
            if field in data:
                timestamp = data[field]
                if timestamp:  # Ensure it's not null
                    # Convert seconds or milliseconds to datetime
                    if len(str(timestamp)) > 10:  # Milliseconds
                        timestamp = int(timestamp) / 1000
                    data[field] = make_aware(datetime.datetime.fromtimestamp(timestamp))

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
