from django.db.models import Q, Count, Sum
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
import jwt
from django.db import transaction

from datetime import date, timedelta, datetime

from rest_framework.response import Response

from base.sender import voucher_created, collector_updated
from campaign.models import Campaign
from campaign.serializers import CampaignSerializer, CampaignSerializerInBusinessProfile
from business_user_profile.models import BusinessUserProfile
from collector_card.models import LogsCollector, CollectorCard
from collector_card.serializers import LogsCollectorSerializer, CollectorCardSerializer
from model_logs.models import LogsCollectorCard
from project.permissions import IsCampaignOwner
from teams_request.models import TeamsRequest

from django.utils import timezone

from voucher_card.models import VoucherType, VoucherCard
from voucher_card.serializers import VoucherSerializer


class ListCreateApiCampaignView(ListCreateAPIView):
    """
    API view to list and create campaigns for a business user
    """
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticated]  # Ensures that only authenticated users can access this view

    def get_queryset(self):
        """
        Return campaigns specifically for the logged-in business user
        """
        # Efficient retrieval of the customer's profile with a one-time database query
        business_user_profile = BusinessUserProfile.objects.get(user=self.request.user)
        return Campaign.objects.filter(business_user_profile=business_user_profile).order_by('date_created')

    def perform_create(self, serializer):
        """
        Automatically assigns the logged-in user's business profile to the new campaign.
        """
        business_user_profile = BusinessUserProfile.objects.get(user=self.request.user)
        serializer.save(business_user_profile=business_user_profile)


class ListOpenCampaignsForTeamsView(ListAPIView):
    """
    API view to list and create campaigns for a customer user profile.
    """
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticated]  # Ensures that only authenticated users can access this view

    def get_queryset(self):
        """
        Return campaigns specifically for the logged-in user's customer profile.
        """
        # Efficient retrieval of the customer's profile with a one-time database query
        team_user = self.request.user
        business_id = self.kwargs['pk']
        business_user_profile = BusinessUserProfile.objects.get(user__id=business_id)
        today = date.today()
        now = timezone.now()
        # day_ago = now - timedelta(hours=24)
        # two_days_ago = now - timedelta(hours=48)
        last_seven_days = now - timedelta(hours=168)
        one_week_ago = now - timedelta(hours=336)
        if TeamsRequest.objects.filter(requester=business_user_profile.user, receiver=team_user,
                                       status='accepted').exists():
            return Campaign.objects.filter(Q(business_user_profile=business_user_profile) &
                                           Q(ending_date__gt=today) & Q(is_active=True) |
                                           Q(business_user_profile=business_user_profile) &
                                           Q(ending_date__isnull=True) & Q(is_active=True)).annotate(
                participants=Count('collectors__customer_user_profile', distinct=True),
                last_seven_days_participants=Count(
                    'collectors__customer_user_profile',
                    filter=Q(collectors__logs_collectors__date_created__gt=last_seven_days),
                    distinct=True
                ),
                one_week_ago_participants=Count(
                    'collectors__customer_user_profile',
                    filter=Q(collectors__logs_collectors__date_created__range=(one_week_ago, last_seven_days)),
                    distinct=True
                ),
                value=Sum('collectors__logs_collectors__value_added', distinct=True),
                last_seven_days_value=Sum(
                    'collectors__logs_collectors__value_added',
                    filter=Q(collectors__logs_collectors__date_created__gt=last_seven_days), distinct=True
                ),
                one_week_ago_value=Sum(
                    'collectors__logs_collectors__value_added',
                    filter=Q(collectors__logs_collectors__date_created__range=(one_week_ago, last_seven_days)),
                    distinct=True
                ),
                vouchers_issued=Count('voucher_card', distinct=True),
                last_seven_days_vouchers_issued=Count(
                    'voucher_card',
                    filter=Q(voucher_card__date_created__gt=last_seven_days),
                    distinct=True
                ),
                one_week_ago_vouchers_issued=Count(
                    'voucher_card',
                    filter=Q(voucher_card__date_created__range=(one_week_ago, last_seven_days)),
                    distinct=True
                ),
            ).order_by('-date_created')
        else:
            return Response('You have no permission.', status=status.HTTP_403_FORBIDDEN)


class ListOpenCampaignsView(ListAPIView):
    """
    API view to list open campaigns for business user
    """
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        business_user_profile = BusinessUserProfile.objects.get(user=self.request.user)
        today = date.today()
        now = timezone.now()
        # day_ago = now - timedelta(hours=24)
        # two_days_ago = now - timedelta(hours=48)
        last_seven_days = now - timedelta(hours=168)
        one_week_ago = now - timedelta(hours=336)

        queryset = Campaign.objects.filter(
            Q(business_user_profile=business_user_profile) &
            (Q(ending_date__gt=today) | Q(ending_date__isnull=True)) &
            Q(is_active=True)
        ).annotate(
            participants=Count('collectors__customer_user_profile', distinct=True),
            last_seven_days_participants=Count(
                'collectors__customer_user_profile',
                filter=Q(collectors__logs_collectors__date_created__gt=last_seven_days),
                distinct=True
            ),
            one_week_ago_participants=Count(
                'collectors__customer_user_profile',
                filter=Q(collectors__logs_collectors__date_created__range=(one_week_ago, last_seven_days)),
                distinct=True
            ),
            value=Sum('collectors__logs_collectors__value_added', distinct=True),
            last_seven_days_value=Sum(
                'collectors__logs_collectors__value_added',
                filter=Q(collectors__logs_collectors__date_created__gt=last_seven_days),
                distinct=True
            ),
            one_week_ago_value=Sum(
                'collectors__logs_collectors__value_added',
                filter=Q(collectors__logs_collectors__date_created__range=(one_week_ago, last_seven_days)),
                distinct=True
            ),
            vouchers_issued=Count('voucher_card', distinct=True),
            last_seven_days_vouchers_issued=Count(
                'voucher_card',
                filter=Q(voucher_card__date_created__gt=last_seven_days),
                distinct=True
            ),
            one_week_ago_vouchers_issued=Count(
                'voucher_card',
                filter=Q(voucher_card__date_created__range=(one_week_ago, last_seven_days)),
                distinct=True
            ),
        ).order_by('-date_created')

        return queryset


class ListSpecificBusinessOpenCampaignsView(ListAPIView):
    """
    API view to list specific business open campaigns for customer user when he is in business profile on app
    """
    serializer_class = CampaignSerializerInBusinessProfile
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        business_id = self.kwargs['pk']
        business_user_profile = BusinessUserProfile.objects.get(user_id=business_id)
        today = date.today()

        queryset = Campaign.objects.filter(
            Q(business_user_profile=business_user_profile) &
            (Q(ending_date__gt=today) | Q(ending_date__isnull=True)) &
            Q(is_active=True)
        ).order_by('-date_created')

        return queryset

    def get(self, request, *args, **kwargs):
        serializer = CampaignSerializerInBusinessProfile(self.get_queryset(), many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListClosedCampaignsView(ListAPIView):
    """
    API view to list closed campaign for business user
    """
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticated]  # Ensures that only authenticated users can access this view

    def get_queryset(self):
        """
        Return campaigns specifically for the logged-in user's customer profile.
        """
        # Efficient retrieval of the customer's profile with a one-time database query
        business_user_profile = BusinessUserProfile.objects.get(user=self.request.user)
        today = date.today()
        return Campaign.objects.filter(Q(business_user_profile=business_user_profile) &
                                       Q(ending_date__lte=today) |
                                       Q(business_user_profile=business_user_profile) &
                                       Q(is_active=False)).order_by('-date_created')


class ReadUpdateDeleteCampaignView(RetrieveUpdateDestroyAPIView):
    """
    API view to read, update, and delete a single campaign, ensuring that the user is authenticated and is the owner of the campaign.
    """
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticated, IsCampaignOwner]


class SelfScanCampaignView(ListCreateAPIView):
    # serializer_class = UseVoucherSerializer
    queryset = Campaign.objects.all()
    permission_classes = [IsAuthenticated]

    # Helper method to determine if a campaign is active
    def is_campaign_active(self, campaign):
        if campaign.ending_date and campaign.ending_date <= timezone.now().date():
            campaign.is_active = False
            campaign.save()
            return False
        return True

    # Helper method to check if the requesting user is the owner of the campaign
    # def is_user_owner(self, campaign, user):
    #     return campaign.business_user_profile == user.business_user_profile
    #
    # # Helper method to check if the requesting user is the in business team
    # def is_user_in_team(self, campaign, user, business_owner_id):
    #     # Check if the user making the request owns the campaign or is a team member
    #     return campaign.business_user_profile.user.id == business_owner_id and TeamsRequest.objects.filter(
    #         receiver=user,
    #         requester=campaign.business_user_profile.user,
    #         status='accepted').exists()

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
        return voucher

    def post(self, request, *args, **kwargs):
        Campaign_token = request.data.get('campaign_token', None)
        customer_user_profile = request.user.customer_user_profile

        # Decode the voucher token without verifying the signature to extract user_id and voucher_id
        try:
            decoded = jwt.decode(Campaign_token, options={"verify_signature": False})
            campaign_id = decoded.get('campaign_id')
            # business_id = decoded.get('business_id')
        except jwt.DecodeError:
            return Response({'message': 'Invalid campaign token.'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the customer user profile based on the user_id from the token

        # Verify the token using the user's secret key
        campaign = Campaign.objects.get(pk=campaign_id)
        secret_key = campaign.secret_key

        value_count = campaign.self_scann_amount

        try:
            jwt.decode(Campaign_token, secret_key, algorithms="HS256")
        except jwt.InvalidSignatureError:
            return Response({'message': 'Invalid voucher token signature.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the campaign is active
        if not self.is_campaign_active(campaign):
            return Response('This Campaign is no longer available!', status=status.HTTP_400_BAD_REQUEST)

        # Try to get or create a collector, and handle it appropriately based on creation status
        with transaction.atomic():
            collector, created = CollectorCard.objects.get_or_create(
                campaign=campaign,
                customer_user_profile=customer_user_profile,
                business_user_profile=campaign.business_user_profile,
                is_collected=False,
                date_expired=campaign.ending_date,
                defaults={'value_added': value_count, 'value_counted': value_count,
                          'value_goal': campaign.value_goal}
            )

        # If the collector was found, not created
        if not created:
            collector.value_added = float(value_count)
            collector.value_counted += float(value_count)
            collector.save(update_fields=['value_added', 'value_counted'])

            LogsCollectorCard.objects.create(customer_user_profile=customer_user_profile,
                                             value_added=float(value_count), value_counted=collector.value_counted,
                                             value_goal=campaign.value_goal, action='update',
                                             collector_card=collector)

            # Check if collector's total is now above the campaign goal
            if float(collector.value_counted) >= float(campaign.value_goal):
                voucher = self.collect_voucher(collector, customer_user_profile.secret_key)
                return Response({'type': 'voucher', 'voucher': voucher}, status=status.HTTP_200_OK)

            # Send updated collector to customer wia websockets
            collector = CollectorCardSerializer(collector).data
            collector_updated(customer_user_profile.secret_key, collector)
            return Response({'type': 'collector', 'collector': collector, 'amount': value_count}, status=status.HTTP_200_OK)
        else:
            LogsCollectorCard.objects.create(customer_user_profile=customer_user_profile,
                                             value_added=float(value_count), value_counted=collector.value_counted,
                                             value_goal=campaign.value_goal, action='create',
                                             collector_card=collector)

            if float(collector.value_counted) >= float(campaign.value_goal):
                voucher = self.collect_voucher(collector, customer_user_profile.secret_key)
                LogsCollectorCard.objects.create(customer_user_profile=customer_user_profile,
                                                 value_added=float(value_count),
                                                 value_counted=collector.value_counted,
                                                 value_goal=campaign.value_goal, action='update',
                                                 collector_card=collector)
                return Response({'type': 'voucher', 'voucher': voucher}, status=status.HTTP_200_OK)

            # If the collector was created
            collector = CollectorCardSerializer(collector).data
            collector_updated(customer_user_profile.secret_key, collector)
            return Response({'type': 'collector', 'collector': collector, 'amount': value_count}, status=status.HTTP_201_CREATED)


# This will be used later for insights
class Last48HoursVisitsView(ListAPIView):
    """
    API view to list logs for a specific campaign within specific time frames.
    """
    serializer_class = LogsCollectorSerializer
    permission_classes = [IsAuthenticated]  # Ensures that only authenticated users can access this view

    def list(self, request, *args, **kwargs):
        """
        Override list method to return custom response.
        """
        queryset = self.get_queryset()
        return Response(queryset)

    def get_queryset(self):
        """
        Return counts of logs for the given campaign within specific time frames.
        """
        campaign = Campaign.objects.get(id=self.kwargs['pk'])
        now = datetime.now()
        time_frames = {
            '48_hours_ago': now - timedelta(hours=48),
            '44_hours_ago': now - timedelta(hours=44),
            '40_hours_ago': now - timedelta(hours=40),
            '36_hours_ago': now - timedelta(hours=36),
            '32_hours_ago': now - timedelta(hours=32),
            '28_hours_ago': now - timedelta(hours=28),
            '24_hours_ago': now - timedelta(hours=24),
            '20_hours_ago': now - timedelta(hours=20),
            '16_hours_ago': now - timedelta(hours=16),
            '12_hours_ago': now - timedelta(hours=12),
            '8_hours_ago': now - timedelta(hours=8),
            'last_4_hours': now - timedelta(hours=4),
        }

        # Get log counts based on the time frames
        logs_48_hours_ago = LogsCollector.objects.filter(collector__campaign=campaign,
                                                         date_created__gte=time_frames['48_hours_ago'],
                                                         date_created__lt=time_frames['44_hours_ago']).count()
        logs_44_hours_ago = LogsCollector.objects.filter(collector__campaign=campaign,
                                                         date_created__gte=time_frames['44_hours_ago'],
                                                         date_created__lt=time_frames['40_hours_ago']).count()
        logs_40_hours_ago = LogsCollector.objects.filter(collector__campaign=campaign,
                                                         date_created__gte=time_frames['40_hours_ago'],
                                                         date_created__lt=time_frames['36_hours_ago']).count()
        logs_36_hours_ago = LogsCollector.objects.filter(collector__campaign=campaign,
                                                         date_created__gte=time_frames['36_hours_ago'],
                                                         date_created__lt=time_frames['32_hours_ago']).count()
        logs_32_hours_ago = LogsCollector.objects.filter(collector__campaign=campaign,
                                                         date_created__gte=time_frames['32_hours_ago'],
                                                         date_created__lt=time_frames['28_hours_ago']).count()
        logs_28_hours_ago = LogsCollector.objects.filter(collector__campaign=campaign,
                                                         date_created__gte=time_frames['28_hours_ago'],
                                                         date_created__lt=time_frames['24_hours_ago']).count()
        logs_24_hours_ago = LogsCollector.objects.filter(collector__campaign=campaign,
                                                         date_created__gte=time_frames['24_hours_ago'],
                                                         date_created__lt=time_frames['20_hours_ago']).count()
        logs_20_hours_ago = LogsCollector.objects.filter(collector__campaign=campaign,
                                                         date_created__gte=time_frames['20_hours_ago'],
                                                         date_created__lt=time_frames['16_hours_ago']).count()
        logs_16_hours_ago = LogsCollector.objects.filter(collector__campaign=campaign,
                                                         date_created__gte=time_frames['16_hours_ago'],
                                                         date_created__lt=time_frames['12_hours_ago']).count()
        logs_12_hours_ago = LogsCollector.objects.filter(collector__campaign=campaign,
                                                         date_created__gte=time_frames['12_hours_ago'],
                                                         date_created__lt=time_frames['8_hours_ago']).count()
        logs_8_hours_ago = LogsCollector.objects.filter(collector__campaign=campaign,
                                                        date_created__gte=time_frames['8_hours_ago'],
                                                        date_created__lt=time_frames['last_4_hours']).count()
        logs_last_4_hours = LogsCollector.objects.filter(collector__campaign=campaign,
                                                         date_created__gte=time_frames['last_4_hours']).count()

        # Combine all counts into one dictionary
        combined_logs = {
            '48_hours_ago': logs_48_hours_ago,
            '44_hours_ago': logs_44_hours_ago,
            '40_hours_ago': logs_40_hours_ago,
            '36_hours_ago': logs_36_hours_ago,
            '32_hours_ago': logs_32_hours_ago,
            '28_hours_ago': logs_28_hours_ago,
            '24_hours_ago': logs_24_hours_ago,
            '20_hours_ago': logs_20_hours_ago,
            '16_hours_ago': logs_16_hours_ago,
            '12_hours_ago': logs_12_hours_ago,
            '8_hours_ago': logs_8_hours_ago,
            'last_4_hours': logs_last_4_hours
        }

        return combined_logs
