from django.http import HttpResponse, HttpResponseServerError
from django.views.decorators.http import require_http_methods
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist

from allauth.socialaccount.models import SocialAccount

from .models import User

import json

# DEVELOPMENT PURPOSES ONLY
@login_required
def setSampleData(request):
	# Sample Data
	SAMPLE = '[{"name":"Task 1","course":"Class","start":"2022-06-28T22:28:47.393Z","end":"2022-06-28T22:28:47.000Z","progress":90,"link":"https://example.com"},{"name":"Task 2","course":"Class","start":"2022-06-28T22:32:36.139Z","end":"2022-06-28T22:32:36.000Z","progress":30,"link":"https://example.com"},{"name":"Task 3","course":"Class 2","start":"2022-06-28T22:32:45.000Z","end":"2022-06-28T22:32:45.000Z","progress":50,"link":"https://example.com"}]'

	# Get UID
	uid = SocialAccount.objects.filter(user=request.user).first().uid
	name = request.user.username

	# Attempt to update an existing user, creates a new user otherwise
	try:
		user = User.objects.get(uid=uid)
		user.app_data = SAMPLE
	except ObjectDoesNotExist:
		user = User(uid=uid, name=name, app_data=SAMPLE)

	user.save()

	# Return
	return HttpResponse("Good")

@login_required
@require_http_methods(["GET"])
def main(request):
	return render(request, "base.html")

@login_required
@require_http_methods(["GET"])
def getUser(request):
	uid = SocialAccount.objects.filter(user=request.user).first().uid

	# Attempt to find user and return data
	try:
		user = User.objects.get(uid=uid)
		return HttpResponse(user.app_data)
	except ObjectDoesNotExist:
		return HttpResponseServerError("Invalid Request: User does not exist")

@login_required
@require_http_methods(["POST"])
def updateUser(request):
	# Convert request data to dict
	data = valid_post(request, ["appData"])
	
	# Throw error if the request is missing required data
	if not data:
		return HttpResponseServerError("Invalid POST Request: Missing required data: "+str(request.body))

	# Save user
	uid = SocialAccount.objects.filter(user=request.user).first().uid
	name = request.user.username

	# Attempt to update an existing user, creates a new user otherwise
	try:
		user = User.objects.get(uid=uid)
		user.app_data = data["appData"]
	except ObjectDoesNotExist:
		user = User(uid=uid, name=name, app_data=data["appData"])

	user.save()

	# Return
	return HttpResponse("Good")

def valid_post(request, keys):
	data = json.loads(request.body)
	for key in keys:
		if key not in data:
			return False
	return data
