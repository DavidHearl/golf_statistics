# Generated by Django 3.2.21 on 2024-10-25 07:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('golf_data', '0004_auto_20241008_1705'),
    ]

    operations = [
        migrations.AlterField(
            model_name='data',
            name='source_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
