# Generated by Django 5.0.3 on 2025-02-04 14:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customer_user_profile', '0003_alter_customeruserprofile_agreed_tos_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='customeruserprofile',
            name='device_id',
            field=models.CharField(blank=True, null=True),
        ),
    ]
