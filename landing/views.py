from django.http import HttpResponse
from django.shortcuts import render

def index(request):
	return render(request, "landing.html")

def privacy(request):
	return render(request, "privacy.html")

def truck_simulator(request):
	return render(request, "truck_simulator.html")