from django.http import HttpResponse, HttpResponseServerError
from django.views.decorators.http import require_http_methods
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist

from allauth.socialaccount.models import SocialAccount

from .models import User

import json

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
		return user.app_data
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
