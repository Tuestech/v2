from django.http import HttpResponse
from django.shortcuts import render

def index(request):
	return render(request, "landing.html")

def privacy(request):
	return render(request, "privacy.html")