from django.http import HttpResponse, HttpResponseServerError, HttpResponseRedirect
from django.views.decorators.http import require_http_methods
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist

from allauth.socialaccount.models import SocialAccount

from .models import User

import json

import datetime

# DEVELOPMENT PURPOSES ONLY
@login_required
def setSampleData(request):
	# Days
	def days_after(n):
		return (datetime.datetime.now() + datetime.timedelta(days=n)).strftime("%Y-%m-%d")

	# Task sample data
	tasks = f'[["Task 1","Class","{days_after(0)}","{days_after(3)}",10,"https://example.com"],["Task 2","Class","{days_after(0)}","{days_after(2)}",80,"https://example.com"],["Task 3","Class 3","{days_after(1)}","{days_after(8)}",60,"https://example.com"]]'

	# Events sample data
	# No sample data because it's not implemented in frontend yet
	events = '[]'

	# Links sample data
	# No sample data because it's not implemented in frontend yet
	links = '[["Google", "https://www.google.com"]]'

	# Settings sample data
	# No sample data because it's not implemented in frontend yet
	settings = '{"scoreType": 0}'

	# Combined sample data
	SAMPLE = json.dumps(
		{"tasks": tasks, "events": events, "links": links, "settings": settings}
	)

	# Get UID
	uid = SocialAccount.objects.filter(user=request.user).first().uid
	name = request.user.username

	# Attempt to update an existing user, creates a new user otherwise
	try:
		user = User.objects.get(uid=uid)
		user.app_data = SAMPLE
	except ObjectDoesNotExist:
		user = User(uid=uid, name=name, app_data=SAMPLE)

	# Update user in model
	user.save()

	# Return
	return HttpResponse("Good")

@login_required
@require_http_methods(["GET"])
def main(request):
	# Dev mode
	if not request.user.is_superuser:
		return HttpResponseRedirect("/")

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

# Determines of a post body is valid
# Returns parsed object if valid and False if not
def valid_post(request, keys):
	data = json.loads(request.body)
	for key in keys:
		if key not in data:
			return False
	return data
