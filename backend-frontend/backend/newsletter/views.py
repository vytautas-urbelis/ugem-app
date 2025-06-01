from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

from newsletter.models import Newsletter
from newsletter.serializers import NewsletterSerializer


# Create your views here.
class SubscribeNewsletterView(CreateAPIView):
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = ()

    def create(self, request, *args, **kwargs):
        email = request.data.get('email', False)
        if not email:
            return Response({'error': 'No email provided'}, status=status.HTTP_400_BAD_REQUEST)
        if Newsletter.objects.filter(email=email).exists():
            return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)
        newsletter = Newsletter.objects.create(email=email)
        newsletter.save()
        return Response({'email': email}, status=status.HTTP_201_CREATED)
