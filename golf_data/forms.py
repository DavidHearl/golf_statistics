from django import forms

class UploadCSVForm(forms.Form):
    csv_file = forms.FileField()
    source_name = forms.CharField(max_length=100)