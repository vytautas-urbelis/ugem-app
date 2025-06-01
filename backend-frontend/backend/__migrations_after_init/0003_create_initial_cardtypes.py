from django.db import migrations


def create_card_types(apps, schema_editor):
    CardType = apps.get_model('customer_card', 'CardType')
    CardType.objects.create(type='Regular')
    CardType.objects.create(type='Gold')
    CardType.objects.create(type='Platinum')


class Migration(migrations.Migration):
    dependencies = [
        ('customer_card', '0002_initial'),
    ]

    operations = [
        migrations.RunPython(create_card_types),
    ]
