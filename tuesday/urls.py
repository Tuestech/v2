from django.contrib import admin
from django.urls import path
from django.urls import include
from tuesapp import views as app_views
from landing import views as landing_views

urlpatterns = [
	path('admin/', admin.site.urls),
	path('', landing_views.index, name="index"),
	path('app/', app_views.main, name="app"),
	path('updateuser/', app_views.updateUser),
	path('getuser/', app_views.getUser),
	path('setsample/', app_views.setSampleData),
	path('accounts/', include('allauth.urls')),
]
