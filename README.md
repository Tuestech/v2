# Tuesday
Tuesday is a web app that helps students manage and prioritize tasks.

## Table of contents

[New contributors](#New-contributors)

[Reporting bugs](#Reporting-bugs)

[Suggesting features](#Suggesting-features)

[Contributing](#Contributing)
 - [Development](#Development)
 - [Implementation](#Implementation)
 - [Pull requests](#Pull-requests)
 - [Privacy and Security](#Privacy-and-Security)

[License](#License)

&nbsp;

## New-contributors

This README is designed to be beginner-friendly so anyone can contribute.

Syntax is not very strict and will likely be corrected when code or issues are reviewed.

It's recommended to have some experience with either Django or vanilla front-end web development before working on this project.

&nbsp;

## Reporting bugs

Navigate to the *Issues* tab at the top and create a new issue.

Make sure you put `[BUG]` at the beginning of your title.

Make a descriptive but concise title and write a brief couple sentences about a bug you found.
When you're done, just submit. 

After a bug is submitted, you can track our progress and make sure everything is fixed.

&nbsp;

## Suggesting features

Navigate to the *Issues* tab at the top and create a new issue.

Make sure you put `[SUGGESTION]` at the beginning of your title.

Make a descriptive but concise title and write a brief couple sentences about your suggestion.
When you're done, just submit. 

After a suggestion is submitted, you can track out progress and see your idea come to life!

&nbsp;

## Contributing

### Development

This is the full code of the Django app (except the actual secret key, which is replaced by a django default).

Running this app requires [Python](https://www.python.org/downloads/) and a few libraries.

In the environment you would like to work in, run the following commands:
```
pip install Django
pip install django-allauth
```

Run this to set up the local database:
```
python manage.py migrate
```

Now, you need to create a local superuser.
Note that these credentials are stored locally so they don't need to be particularly secure.
Run the following command and follow the instructions:
```
python manage.py createsuperuser
```

Make the static files with this command:
```
python manage.py collectstatic
```

Start the local server with this command:
```
python manage.py runserver
```

Open your web browser and go to `http://127.0.0.1:8000/admin`.
This should open the login to the admin site.
Use your credentials from before the log in.

Now, navigate to `Social applications` on the left menu and add your Google OAuth credentials (Just client ID and client secret).
If you don't have these credentials yet, check out [this help page](https://support.google.com/cloud/answer/6158849?hl=en) to get them.

Once you're done with the admin page, you must log out with the link in the top right.

Now, go to `http://127.0.0.1:8000/setsample/`.
You should be prompted to sign in with Google.
Note that the Google sign-in page wil redirect you to `https://...` instead of `http://...`.
This is easily remedied by changing the url when this issue occurs.
If the page says `Good`, your dev environment is all set up!

To restart the local server once you've made changes, run these 2 command again:
```
python manage.py collectstatic
python manage.py runserver
```

&nbsp;

### Implementation

This app is implemented with a templated HTML, vanilla CSS, and vanilla JS frontend with a Django backend and PostgreSQL database, all hosted on Heroku.

`tuesapp` is the actual app and `landing` is the landing page.

`tuesapp` is implemented as follows:

The frontend is templated HTML, with one template for each page and a central base template with nav items.

The CSS and JS are split similarly, with a few central files and various other files for each page.

`landing` is implemented as follows:

The entire landing page is static HTML, CSS, and JS.

&nbsp;

### Pull requests

The title of a pull request should briefly describe your changes at a high level.
If you added a button in the dashboard, just put `Added a {name} button to dashboard`

The description of a pull request should explain in more detail what it is you changed.
Here, you can include any additional information that may be necessary for the reviewer,
such as the reasoning behind the changes or the issues that the changes intend to address.

If your pull request addresses an issue, be sure to provide a link to the issue in the pull request.

Upon review, we will either approve and merge your code or reject your request.
If your pull request is rejected, make sure you read the comments to understand why we rejected it.
It's possible we suggested minor revisions that, if fixed, can change the approval status of your request.

&nbsp;

### Privacy and Security

Privacy and security are among our top priorities. Please take care to ensure users and their data are protected to a high standard.

When contributing, check that your contribution follows the [privacy policy](https://tues.tech/privacy/) in its entirety.
Do not unnecessarily use 3rd party services, especially when user data is involved.

Security for both the user and the application must also be maintained.
Do not make hardcoded private keys and avoid changes to the authentication system unless absolutely necessary for functionality or improving security.

All contributions will be checked for privacy and security issues and, if they're found, rejected from merging with the main branch.

&nbsp;

## License

Tuesday - The Smart Work Management Tool

Copyright © 2024 Jeffrey Lu

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
