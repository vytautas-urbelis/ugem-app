from django.db import models

from django.contrib.auth import get_user_model

User = get_user_model()


# Create your models here.
class TeamsRequest(models.Model):
    ACTION_CHOICES = (
        ('deleted', 'Deleted'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('pending', 'Pending'),
    )

    status = models.CharField(max_length=12, choices=ACTION_CHOICES)
    requester = models.ForeignKey(User, related_name='sent_requests',
                                  on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='requests', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted = models.OneToOneField(User, related_name='deleted_requests', on_delete=models.SET_NULL, null=True,
                                   blank=True)

    def __str__(self):
        return f'{self.requester} invited {self.receiver}, status: {self.status}'
