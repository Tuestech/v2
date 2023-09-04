from django.db import models

class User(models.Model):
	app_data = models.TextField()
	uid = models.CharField(max_length=255, primary_key=True)
	name = models.CharField(max_length=255)
	metadata = models.TextField(default="")

	def __str__(self):
		return f"<User uid='{self.uid}' name='{self.name}' meta='{self.metadata}'>"
