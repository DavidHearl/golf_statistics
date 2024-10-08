# Generated by Django 3.2.21 on 2024-10-08 14:22

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Data',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('source_name', models.CharField(max_length=100)),
                ('shot_number', models.IntegerField()),
                ('club', models.CharField(max_length=5)),
                ('strokes_gained', models.FloatField()),
                ('carry_distance_range', models.IntegerField()),
                ('carry_distance_premium', models.IntegerField()),
                ('flat_carry_distance_range', models.IntegerField()),
                ('flat_carry_distance_premium', models.IntegerField()),
                ('total_distance_range', models.IntegerField()),
                ('total_distance_premium', models.IntegerField()),
                ('flat_total_distance_range', models.IntegerField()),
                ('flat_total_distance_premium', models.IntegerField()),
                ('apex_range', models.IntegerField()),
                ('apex_premium', models.IntegerField()),
                ('ball_speed_range', models.IntegerField()),
                ('ball_speed_premium', models.IntegerField()),
                ('launch_direction', models.CharField(max_length=5)),
                ('launch_angle', models.FloatField()),
                ('from_center', models.CharField(max_length=5)),
                ('curve', models.CharField(max_length=5)),
                ('prox_to_hole', models.FloatField()),
                ('target', models.CharField(max_length=5)),
            ],
        ),
    ]
