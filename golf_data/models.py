from django.db import models

class Data(models.Model):
    source_name = models.CharField(max_length=100, null=True, blank=True)
    shot_number = models.IntegerField()
    club = models.CharField(max_length=5)
    strokes_gained = models.FloatField(null=True, blank=True)
    carry_distance_range = models.FloatField()
    carry_distance_premium = models.FloatField()
    flat_carry_distance_range = models.FloatField()
    flat_carry_distance_premium = models.FloatField()
    total_distance_range = models.FloatField()
    total_distance_premium = models.FloatField()
    flat_total_distance_range = models.FloatField()
    flat_total_distance_premium = models.FloatField()
    apex_range = models.FloatField()
    apex_premium = models.FloatField()
    ball_speed_range = models.FloatField()
    ball_speed_premium = models.FloatField()
    launch_direction = models.CharField(max_length=5, null=True, blank=True)
    launch_angle = models.FloatField()
    from_center = models.CharField(max_length=5)
    curve = models.CharField(max_length=5)
    prox_to_hole = models.FloatField(null=True, blank=True)
    target = models.CharField(max_length=5, null=True, blank=True)

    def __str__(self):
        return self.club + ' - ' + str(self.carry_distance_range) + ' - ' + str(self.total_distance_range)
