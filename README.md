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

After a bug is submited, you can track our progress and make sure everything is fixed.

&nbsp;

## Suggesting features

Navigate to the *Issues* tab at the top and create a new issue.

Make sure you put `[SUGGESTION]` at the beginning of your title.

Make a descriptive but concise title and write a brief couple sentences about your suggestion.
When you're done, just submit. 

After a suggestion is submited, you can track out progress and see your idea come to life!

&nbsp;

## Contributing

### Development

This is the full code of the Django app (except the actual secret key, which is replaced by a django default).

If you already have Django installed, you can start a local development server directly from this repo by running this command:
```
python manage.py runserver
```

&nbsp;

### Implementation

This app is implemented with a vanilla HTML, CSS, and JS frontend with a Django backend and Postgres database, all hosted on Heroku.

`tuesapp` is the actual app and `landing` is the landing page. The following details are about `tuesapp`:

The frontend is templated HTML, with one template for each page and a central base template with nav items.

The CSS and JS are split similarly, with a few central files and various other files for each page.

The landing page is not yet implemented, but will be done with static HTML, CSS, and JS.

### Pull requests

The title of a pull request should briefly describe your changes at a high level.
If you added a button in the dashboard, just put `Added a {name} button to dashboard`

The description of a pull request should explain why something was added, removed, or changed.
This time, you can include any other information you think necessary.

If your pull request addresses an issue, be sure to provide a link to the issue in the pull request.

Sometimes, your pull request may not be up to our standards.
Don't worry, we will always explain what was wrong and how it can be fixed.
You can always submit another pull request

## License

Tuesday - The Smart Work Management Tool

Copyright © 2022 Jeffrey Lu

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
