import jwt
from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.response import Response

from customer_card.models import CustomerCard
from customer_card.serializers import CustomerCardSerializer
from customer_user_profile.models import CustomerUserProfile


# Create your views here.
class GetCustomerCard(ListAPIView):
    serializer_class = CustomerCardSerializer

    def get_queryset(self):
        return CustomerCard.objects.filter(customer_user_profile__user=self.request.user)


class VerifyCustomerView(CreateAPIView):
    serializer_class = CustomerCardSerializer

    def post(self, request, *args, **kwargs):
        card_token = request.data['card_token']
        try:
            decoded = jwt.decode(card_token, options={"verify_signature": False})
            user_id = decoded['user_id']
            customer_user_profile = CustomerUserProfile.objects.get(user_id=user_id)
            secret_key = customer_user_profile.secret_key
            jwt.decode(card_token, secret_key, algorithms="HS256")

        except CustomerUserProfile.DoesNotExist:
            return Response({'message': 'The Qr Code Is Broken'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({"secret_key": secret_key}, status=status.HTTP_200_OK)
