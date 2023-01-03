from django.http import HttpResponse, HttpResponseServerError, HttpResponseRedirect, Http404
from django.views.decorators.http import require_http_methods
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from allauth.socialaccount.models import SocialAccount

from .models import User

import json

import datetime

# DEVELOPMENT PURPOSES ONLY
@login_required
def setSampleData(request):
	"""
	Sets current logged-in user's data with sample data
	Returns "Good" HTTPResponse if successful
	"""
	# Pretend the page doesn't exist if not admin
	if not request.user.is_superuser:
		return Http404()
	
	# Generate sample data
	SAMPLE = generate_sample_data()

	# Get UID
	uid = SocialAccount.objects.filter(user=request.user).first().uid
	name = request.user.username

	# Attempt to update an existing user, creates a new user otherwise
	try:
		user = User.objects.get(uid=uid)
		user.app_data = SAMPLE
	except:
		user = User(uid=uid, name=name, app_data=SAMPLE)

	# Update user in model
	user.save()

	# Return
	return HttpResponse("Good")


@login_required
@require_http_methods(["GET"])
def main(request):
	"""
	Returns the main app page with the current logged-in user's data
	"""
	# Dev mode
	if not request.user.is_superuser:
		return HttpResponseRedirect("/")

	uid = SocialAccount.objects.filter(user=request.user).first().uid

	# Attempt to find user and get data, creates a new blank user otherwise
	is_new = False
	try:
		user = User.objects.get(uid=uid)
		data = user.app_data
	except:
		name = request.user.username
		data = generate_sample_data()
		user = User(uid=uid, name=name, app_data=data)
		user.save()

		is_new = True
	
	# Return
	return render(request, "base.html", {"data": data, "is_new": is_new})


@login_required
@require_http_methods(["GET"])
def getUser(request):
	"""
	Gets the current logged-in user's data
	Returns HTTPResponse with user's data if successful, ServerError response if not
	"""
	uid = SocialAccount.objects.filter(user=request.user).first().uid

	# Attempt to find user and return data
	try:
		user = User.objects.get(uid=uid)
		return HttpResponse(user.app_data)
	except:
		return HttpResponseServerError("Invalid Request: User does not exist")


@login_required
@require_http_methods(["POST"])
def updateUser(request):
	"""
	Replaces current logged-in user's data with data present in the request
	Returns "Good" HTTPResponse if successful, ServerError response if not
	"""
	# Convert request data to dict
	data = valid_post(request, ["appData"])
	
	# Throw error if the request is empty
	if not data:
		return HttpResponseServerError("Invalid POST Request: Missing required data: "+str(request.body))

	# Save user
	uid = SocialAccount.objects.filter(user=request.user).first().uid
	name = request.user.username

	# Attempt to update an existing user, creates a new user otherwise
	try:
		user = User.objects.get(uid=uid)
		user.app_data = data["appData"]
	except:
		user = User(uid=uid, name=name, app_data=data["appData"])

	user.save()

	# Return
	return HttpResponse("Good")


@login_required
@require_http_methods(["POST"])
def deleteData(request):
	"""
	Deletes current logged-in user's data
	Returns "Good" HTTPResponse if successful, ServerError response if not
	"""
	# Save user
	uid = SocialAccount.objects.filter(user=request.user).first().uid
	name = request.user.username

	# Attempt to update an existing user, creates a new user otherwise
	try:
		user = User.objects.get(uid=uid)
	except:
		return HttpResponseServerError(f"Invalid POST Request: User with uid {uid} and name {name} not found")
	
	# Delete user's data
	user.delete()

	return HttpResponse("Good")


def valid_post(request, keys):
	"""
	Determines of a post body is valid
	Returns parsed object if valid and False if not
	"""
	data = json.loads(request.body)
	for key in keys:
		if key not in data:
			return False
	return data

def generate_sample_data():
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
	settings = '{"scoreType":0, "workloadLimit":1.5, "dataCollection":false, "betaFeatures":false, "defaultLinks":false, "showCompleted":false}'

	# Combined sample data
	return json.dumps(
		{"tasks": tasks, "events": events, "links": links, "settings": settings}
	)
