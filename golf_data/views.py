import csv
from django.shortcuts import render, redirect
from .forms import UploadCSVForm
from .models import Data


def home(request):
    shot_data = Data.objects.all()

    clubs = list(set([data.club for data in shot_data]))

    def custom_sort(club):
        if club == 'D':
            return (0, club)
        elif 'W' in club:
            return (1, club)
        else:
            return (2, club)
    
    clubs.sort(key=custom_sort)

    # File upload logic
    if request.method == 'POST':
        form = UploadCSVForm(request.POST, request.FILES)
        if form.is_valid():
            csv_file = request.FILES['csv_file']
            decoded_file = csv_file.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file)
            for row in reader:
                Data.objects.create(
                    shot_number=int(row['Shot #']),
                    club=row['Club'],
                    strokes_gained=float(row['Strokes Gained']) if row['Strokes Gained'] != '--' else None,
                    carry_distance_range=float(row['Carry Dist. Range (yd)']) if row['Carry Dist. Range (yd)'] != '--' else None,
                    carry_distance_premium=float(row['Carry Dist. Premium (yd)']) if row['Carry Dist. Premium (yd)'] != '--' else None,
                    flat_carry_distance_range=float(row['Flat Carry Dist. Range (yd)']) if row['Flat Carry Dist. Range (yd)'] != '--' else None,
                    flat_carry_distance_premium=float(row['Flat Carry Dist. Premium (yd)']) if row['Flat Carry Dist. Premium (yd)'] != '--' else None,
                    total_distance_range=float(row['Total Dist. Range (yd)']) if row['Total Dist. Range (yd)'] != '--' else None,
                    total_distance_premium=float(row['Total Dist. Premium (yd)']) if row['Total Dist. Premium (yd)'] != '--' else None,
                    flat_total_distance_range=float(row['Flat Total Dist. Range (yd)']) if row['Flat Total Dist. Range (yd)'] != '--' else None,
                    flat_total_distance_premium=float(row['Flat Total Dist. Premium (yd)']) if row['Flat Total Dist. Premium (yd)'] != '--' else None,
                    apex_range=float(row['Apex (ft)']) if row['Apex (ft)'] != '--' else None,
                    apex_premium=float(row['Apex (ft) Premium']) if row['Apex (ft) Premium'] != '--' else None,
                    ball_speed_range=float(row['Ball Speed (mph)']) if row['Ball Speed (mph)'] != '--' else None,
                    ball_speed_premium=float(row['Ball Speed (mph) Premium']) if row['Ball Speed (mph) Premium'] != '--' else None,
                    launch_direction=row['Launch Direction'].replace('°', '') if row['Launch Direction'] != '--' else None,
                    launch_angle=float(row['Launch Angle (deg)'].replace('°', '')) if row['Launch Angle (deg)'] != '--' else None,
                    from_center=row['From Centre (yd)'],
                    curve=row['Curve'],
                    prox_to_hole=float(row['Prox to Hole (yd)']) if row['Prox to Hole (yd)'] != '--' else None,
                    target=row['Target (yd)']
                )
            return redirect('home')  # Redirect back to the home page
    else:
        form = UploadCSVForm()

    context = {
        'form': form,
        'shot_data': shot_data,
        'clubs': clubs
    }
        
    return render(request, 'home.html', context)