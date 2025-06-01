import random

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import jwt

from apple_cards.pass_update import update_customer_card, update_collector_card_stamps, \
    update_collector_card_points
from collector_card.models import CollectorCard
from customer_user_profile.models import CustomerUserProfile
from pass_update_register.models import AppleDevice, ApplePass


def code_generator(length=15):
    numbers = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    return ''.join(random.choice(numbers) for _ in range(length))


# Create your views here.
class CardRegisterEndpoint(APIView):
    """
    post:
    Create a new session for a user. Sends back tokens and user.
    """
    permission_classes = []

    def post(self, request, *args, **kwargs):
        # decoded = jwt.decode(token, options={"verify_signature": False})

        try:
            token = request.headers.get('Authorization')
            decoded = jwt.decode(token.split(' ')[1], options={"verify_signature": False})
            user_id = decoded['customer_id']
            customer = CustomerUserProfile.objects.get(user_id=user_id)
            secret_key = customer.secret_key
            jwt.decode(token.split(' ')[1], secret_key, algorithms="HS256")
            return self.check_and_register()

        except CollectorCard.DoesNotExist:
            return Response({'message': 'Request Not Authorized'}, status=status.HTTP_401_UNAUTHORIZED)

    def check_and_register(self):
        if AppleDevice.objects.filter(
                device_library_id=self.kwargs['deviceLibraryIdentifier'],
                apple_pass__serial_number=self.kwargs['serialNumber']).exists():
            return Response({'message': 'Serial Number Already Registered for Device'},
                            status=status.HTTP_200_OK)

        device_object = AppleDevice.objects.get_or_create(
            device_library_id=self.kwargs['deviceLibraryIdentifier'],
            push_token=self.request.data['pushToken']
        )

        apple_pass = ApplePass.objects.create(
            serial_number=self.kwargs['serialNumber'],
            pass_type_id=self.kwargs['passTypeIdentifier'],
        )

        apple_pass.apple_device.set([device_object[0]])

        return Response({'message': 'Registration Successful'}, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        try:
            token = request.headers.get('Authorization')
            decoded = jwt.decode(token.split(' ')[1], options={"verify_signature": False})
            user_id = decoded['customer_id']
            customer = CustomerUserProfile.objects.get(user_id=user_id)
            secret_key = customer.secret_key
            jwt.decode(token.split(' ')[1], secret_key, algorithms="HS256")
            apple_pass = ApplePass.objects.get(serial_number=self.kwargs['serialNumber'])
            apple_pass.delete()
            return Response({'message': 'Device Unregistered'}, status=status.HTTP_200_OK)
        except CollectorCard.DoesNotExist:
            return Response({'message': 'Request Not Authorized'}, status=status.HTTP_401_UNAUTHORIZED)


class CheckForUpdate(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        last_update = self.request.query_params.get('passesUpdatedSince', '')

        passes = ApplePass.objects.filter(apple_device__device_library_id=self.kwargs['deviceLibraryIdentifier'],
                                          pass_type_id=self.kwargs['passTypeIdentifier']).exclude(
            last_updated=last_update).values_list('serial_number', flat=True)
        if passes:
            update_tag = code_generator()
            for passe in passes:
                apple_pass = ApplePass.objects.get(serial_number=passe)
                apple_pass.last_updated = update_tag
                apple_pass.save()
            return Response({"serialNumbers": passes, "lastUpdated": update_tag}, status=status.HTTP_200_OK)

        return Response('No Matching Passes', status=status.HTTP_204_NO_CONTENT)


class GetUpdatedPass(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):

        try:
            token = request.headers.get('Authorization')
            decoded = jwt.decode(token.split(' ')[1], options={"verify_signature": False})
            user_id = decoded['customer_id']
            customer_user_profile = CustomerUserProfile.objects.get(user_id=user_id)
            secret_key = customer_user_profile.secret_key
            jwt.decode(token.split(' ')[1], secret_key, algorithms="HS256")
            return self.create_and_update_pass(customer_user_profile)

        except CollectorCard.DoesNotExist:
            return Response({'message': 'Request Not Authorized'}, status=status.HTTP_401_UNAUTHORIZED)

    def create_and_update_pass(self, customer_user_profile):
        if self.kwargs['passTypeIdentifier'] == 'pass.ch.swiftybee':
            updated_pass = update_customer_card(customer_user_profile)
        elif self.kwargs['passTypeIdentifier'] == 'pass.ch.swiftybee.collector':
            collector_card = CollectorCard.objects.get(serial_nr=self.kwargs['serialNumber'])

            # If collector type is Stamps
            if collector_card.campaign.collector_type.id == 1:
                updated_pass = update_collector_card_stamps(collector_card)

            # If collector type is Stamps
            elif collector_card.campaign.collector_type.id == 2:
                updated_pass = update_collector_card_points(collector_card, 'Points')

            # If collector type is Stamps
            elif collector_card.campaign.collector_type.id == 3:
                updated_pass = update_collector_card_points(collector_card, 'CHF')
        else:
            return Response({"message": "Bad pass type identifier."}, status=status.HTTP_400_BAD_REQUEST)
        return updated_pass
