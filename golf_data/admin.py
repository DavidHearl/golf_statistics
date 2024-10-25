from django.contrib import admin
from .models import *


class DataAdmin(admin.ModelAdmin):
    list_display = ('club', 'carry_distance_range', 'ball_speed_range','launch_angle', 'total_distance_range', 'ball_speed_range', 'source_name')


admin.site.register(Data, DataAdmin)
