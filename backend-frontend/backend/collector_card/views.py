import asyncio
import random

from django.db import transaction
from django.db.models import Q
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, get_object_or_404, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

from apple_cards.pass_update import send_push_token
from base.sender import voucher_created, collector_updated
from campaign.models import Campaign
from collector_card.models import CollectorCard, LogsCollector
from collector_card.serializers import CollectorCardSerializer, LogsCollectorSerializer
from customer_user_profile.models import CustomerUserProfile
from model_logs.models import LogsCollectorCard
from pass_update_register.models import AppleDevice, ApplePass
from teams_request.models import TeamsRequest
from voucher_card.models import VoucherCard, VoucherType
from voucher_card.serializers import VoucherSerializer

from datetime import timedelta


def code_generator(length=15):
    numbers = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    return ''.join(random.choice(numbers) for _ in range(length))


class CollectorValidateView(CreateAPIView):
    """
    API for validate collector card (Add stamps, points, check if it is collected, if collected create voucher)
    """

    def post(self, request, *args, **kwargs):
        # user = request.user

        # Retrieve request data
        data = request.data

        # Check if requester is from business team
        business_owner_id = data.get('business_owner_id', None)

        # Safely fetch the related objects, returning 404 if not found
        campaign = get_object_or_404(Campaign, id=data.get('campaign_id'))
        customer_user_profile = get_object_or_404(CustomerUserProfile, secret_key=data.get('secret_key'))

        # Retrieve the value count from data, assuming it could be None
        value_count = data.get('value_count')

        # Retrieve Team Request id if it is provided
        # team_request_id = data.get('request_id', None)

        # Validate if value_count is provided
        if not value_count:
            return Response('Missing required value count', status=status.HTTP_400_BAD_REQUEST)

        # Check if the campaign is active
        if not self.is_campaign_active(campaign):
            return Response('This Campaign is no longer available!', status=status.HTTP_400_BAD_REQUEST)

        # Check if the user making the request owns the campaign or is a team member
        if not self.is_user_owner(campaign, request.user) and not self.is_user_in_team(campaign, request.user,
                                                                                       business_owner_id):
            return Response('You have no permission!', status=status.HTTP_400_BAD_REQUEST)

        # If requester is business owner it checks if user requests data from he's personal profile
        if self.is_user_owner(campaign, request.user) and business_owner_id:
            return Response({'message': "You don't have permission to use this voucher."},
                            status=status.HTTP_401_UNAUTHORIZED)

        # Check if campaign still exists or is not active

        # Try to get or create a collector, and handle it appropriately based on creation status
        with transaction.atomic():
            collector, created = CollectorCard.objects.get_or_create(
                campaign=campaign,
                customer_user_profile=customer_user_profile,
                business_user_profile=campaign.business_user_profile,
                is_collected=False,
                date_expired=campaign.ending_date,
                defaults={'value_added': value_count, 'value_counted': value_count, 'value_goal': campaign.value_goal}
            )

        # If the collector was found, not created
        if not created:
            collector.value_added = float(value_count)
            collector.value_counted += float(value_count)
            collector.save(update_fields=['value_added', 'value_counted'])

            LogsCollectorCard.objects.create(customer_user_profile=customer_user_profile,
                                             value_added=float(value_count), value_counted=collector.value_counted,
                                             value_goal=campaign.value_goal, action='update', collector_card=collector)

            # If apple device is registered for updates, we send push notification and updating update tag.
            if AppleDevice.objects.filter(apple_pass__serial_number=collector.serial_nr).exists():
                apple_pass = ApplePass.objects.get(serial_number=collector.serial_nr)
                apple_pass.last_updated = code_generator()
                apple_pass.save()
                apple_device = AppleDevice.objects.get(apple_pass=apple_pass)
                # push notification
                asyncio.run(send_push_token(apple_device.push_token, apple_pass.pass_type_id))

                # Check if collector's total is now above the campaign goal
            if float(collector.value_counted) >= float(campaign.value_goal):
                self.collect_voucher(collector, customer_user_profile.secret_key)
                return Response('You reached the goal of the campaign and got the voucher', status=status.HTTP_200_OK)

            # Send updated collector to customer wia websockets
            collector = CollectorCardSerializer(collector).data
            collector_updated(customer_user_profile.secret_key, collector)
            return Response('Value was added to your collector', status=status.HTTP_200_OK)
        else:
            LogsCollectorCard.objects.create(customer_user_profile=customer_user_profile,
                                             value_added=float(value_count), value_counted=collector.value_counted,
                                             value_goal=campaign.value_goal, action='create', collector_card=collector)

            if float(collector.value_counted) >= float(campaign.value_goal):
                self.collect_voucher(collector, customer_user_profile.secret_key)
                LogsCollectorCard.objects.create(customer_user_profile=customer_user_profile,
                                                 value_added=float(value_count), value_counted=collector.value_counted,
                                                 value_goal=campaign.value_goal, action='update',
                                                 collector_card=collector)
                return Response('You reached the goal of the campaign and got the voucher', status=status.HTTP_200_OK)

            # If the collector was created
            collector = CollectorCardSerializer(collector).data
            collector_updated(customer_user_profile.secret_key, collector)
            return Response('New collector was created', status=status.HTTP_201_CREATED)

    # Helper method to determine if a campaign is active
    def is_campaign_active(self, campaign):
        if campaign.ending_date and campaign.ending_date <= timezone.now().date():
            campaign.is_active = False
            campaign.save()
            return False
        elif campaign.is_active is False:
            return False
        return True

    # Helper method to check if the requesting user is the owner of the campaign
    def is_user_owner(self, campaign, user):
        return campaign.business_user_profile == user.business_user_profile

    # Helper method to check if the requesting user is the in business team
    def is_user_in_team(self, campaign, user, business_owner_id):
        # Check if the user making the request owns the campaign or is a team member
        return campaign.business_user_profile.user.id == business_owner_id and TeamsRequest.objects.filter(
            receiver=user,
            requester=campaign.business_user_profile.user,
            status='accepted').exists()

    # Helper method to handle the logic of collecting a voucher
    def collect_voucher(self, collector, secret_key):
        collector.is_collected = True
        collector.save()
        voucher_type = VoucherType.objects.get(id=2)
        voucher = VoucherCard.objects.create(
            business_id=collector.campaign.business_user_profile.user.id,
            campaign=collector.campaign,
            business_user_profile=collector.campaign.business_user_profile,
            customer_user_profile=collector.customer_user_profile,
            collector_card=collector,
            expiration_date=collector.campaign.ending_date,
            date_expired=collector.campaign.ending_date,
            voucher_type=voucher_type,
        )
        voucher = VoucherSerializer(voucher).data
        voucher_created(secret_key, voucher)


class BusinessAndSpecificUserUncollectedCollector(ListCreateAPIView):
    """
    API view to get specific collector which is in validation process.
    Is used when business scan customer card to get collector according to specific campaign.
    """
    serializer_class = CollectorCardSerializer
    permission_classes = [IsAuthenticated]  # Define appropriate permissions or keep empty if intentional

    def get_queryset(self):
        # Overriding the default queryset to filter collectors based on the campaign ID and secret key.
        secret_key = self.request.data.get('secret_key', None)
        campaign_id = self.request.data.get('campaign_id', None)
        campaign = get_object_or_404(Campaign, id=campaign_id)
        if not secret_key or not campaign_id:
            return CollectorCard.objects.none()  # Return an empty queryset if secret key is not provided

        return CollectorCard.objects.filter(customer_user_profile__secret_key=secret_key,
                                            campaign=campaign, is_collected=False)

    def post(self, request, *args, **kwargs):
        # Custom list method to handle the request and respond appropriately.
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response('No collectors exist for the given criteria.', status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CustomerUsersAllCampaignCollectors(ListAPIView):
    """
    API view to get all collector cards for customer user
    """
    serializer_class = CollectorCardSerializer
    permission_classes = [IsAuthenticated]  # Define appropriate permissions or keep empty if intentional

    def get_queryset(self):
        user = self.request.user
        customer_user_profile = CustomerUserProfile.objects.get(user=user)
        search = self.request.query_params.get('search', False)
        now = timezone.now()
        three_days_ago = now - timedelta(hours=72)

        if search:
            return CollectorCard.objects.filter(
                Q(customer_user_profile=customer_user_profile) &
                Q(is_collected=False) & Q(date_expired__gte=three_days_ago) &
                (Q(campaign__name__icontains=search) | Q(
                    business_user_profile__business_name__icontains=search))).order_by('-date_created')

        return CollectorCard.objects.filter(Q(customer_user_profile=customer_user_profile) &
                                            Q(is_collected=False) &
                                            Q(date_expired__gte=three_days_ago)).order_by('-date_created')

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CustomerCollectorLogs(ListAPIView):
    """This will be used later on"""
    # API view to list all collectors for a customer.
    serializer_class = LogsCollectorSerializer
    permission_classes = [IsAuthenticated]  # Define appropriate permissions or keep empty if intentional

    def get_queryset(self):
        user = self.request.user
        customer_user_profile = CustomerUserProfile.objects.get(user=user)
        collector_id = self.kwargs.get('collector_id')
        collector = CollectorCard.objects.get(id=collector_id)

        return LogsCollector.objects.filter(
            Q(collector=collector) & Q(collector__customer_user_profile=customer_user_profile)
        ).order_by('date_created')
        # return CollectorCard.objects.filter(customer_user_profile=customer_user_profile, is_collected=False)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
