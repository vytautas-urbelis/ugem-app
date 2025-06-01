from django.db import migrations


def create_collector_types(apps, schema_editor):
    collector_type = apps.get_model('campaign', 'CollectorType')
    collector_type.objects.create(name='Stamps')
    collector_type.objects.create(name='Points')


class Migration(migrations.Migration):
    dependencies = [
        ('campaign', '0002_initial'),
    ]

    operations = [
        migrations.RunPython(create_collector_types),
    ]
