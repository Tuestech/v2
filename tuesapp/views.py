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
	SAMPLE = '[["Task 1","Class","2022-06-28T22:55:20.978Z","2022-06-28T22:55:20.000Z",10,"https://example.com"],["Task 2","Class","2022-06-28T22:55:26.115Z","2022-06-28T22:55:26.000Z",70,"https://example.com"],["Task 3","Class 2","2022-06-28T22:55:30.000Z","2022-06-28T22:55:30.000Z",70,"https://example.com"]]'

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
	uid = SocialAccount.objects.filter(user=request.user).first().uid

	# Attempt to find user and get data, creates a new blank user otherwise
	try:
		user = User.objects.get(uid=uid)
		data = user.app_data
	except ObjectDoesNotExist:
		name = request.user.username
		user = User(uid=uid, name=name, app_data="")
		data = ""
	return render(request, "base.html", {"data": data})

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
