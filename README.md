Social-Feed

Practice project implementing OAuth 2.0 authentication and email flows via Nodemailer. This repository describes how to use the Social-Feed API using the Postman collection, including authentication, environment setup, and endpoint reference.

Collection: Social-Feed
Goal: Demonstrate OAuth 2.0 login/verification, CRUD for users, posts, comments, reactions, profiles, and notifications, plus transactional emails (via Nodemailer).
Base URL: 
http://localhost:8000
Swagger UI: 
http://localhost:8000/api
Contents

Quick Start
Swagger UI
OAuth 2.0 Authentication Workflow
Email (Nodemailer) Behavior
Environments and Variables
Folders and Endpoints
AUTH
USER
PROFILE
POST
COMMENTS
Reactions
Notifications
Common Workflows
Testing and Automation in Postman
Troubleshooting
License
Quick Start

Start your API server on 
http://localhost:8000
.
Explore the API at Swagger UI: 
http://localhost:8000/api
.
Open the Postman collection “Social-Feed”.
(Optional) Create an environment with:
baseUrl = 
http://localhost:8000
authToken =
Run the auth flow:
AUTH > REGISTER (optional)
AUTH > LOGIN
AUTH > Verify CODE (if your flow requires a one-time code)
Use the Bearer token from LOGIN to call protected endpoints.
Tip: Store the token in an environment variable (authToken) and set collection/folder Authorization to inherit it.

OAuth 2.0 Authentication Workflow Auth endpoints:

POST /authentication/register — Create a new user.
POST /authentication/login — Authenticate and receive access token.
POST /authentication/verify — Verify OTP or login code if required by your OAuth flow.
POST /authentication/logout — Invalidate session/token.
Typical sequence:

Register (if needed).
Login to obtain an access token (JWT or opaque).
If your flow uses a second step, verify the code with /authentication/verify.
Send Authorization: Bearer with protected requests.
Logout when done.
Email (Nodemailer) Behavior

The project uses Nodemailer for transactional emails (e.g., verification codes, notifications).
Ensure your SMTP credentials and sender configuration are set in your server environment (e.g., .env).
If you expect an email (verification, notification) but don’t receive it:
Check SMTP creds and host/port/secure settings.
Verify from/to addresses and spam folder.
Confirm the server route that triggers the email completed successfully (2xx).
Environments and Variables Recommended Postman environment variables:

baseUrl = 
http://localhost:8000
authToken = Bearer token from LOGIN
userId, postId, commentId, notificationId, reactionId = frequently used identifiers
Usage tips:

Set Authorization as “Bearer Token” with {{authToken}} or inherit from parent.
Prefer variables in paths and queries (e.g., {{baseUrl}}/users/{{userId}}/details).
Folders and Endpoints Replace placeholders with IDs returned by your server.

AUTH

POST /authentication/register — Create a new user.
POST /authentication/login — Authenticate and receive access token.
POST /authentication/verify — Verify OTP or login code (if used).
POST /authentication/logout — Invalidate session/token.
USER

GET /users — Get all users.
PATCH /users/{id} — Update user.
GET /users/{id}/details — Get user by ID with details.
GET /users/current — Get the authenticated user.
DELETE /users/{id} — Delete user.
GET /users/name?firstname=Test — Search users by first name.
PROFILE

GET /profile — Retrieve own profile.
POST /profile — Create own profile.
PATCH /profile — Update own profile.
DELETE /profile — Delete own profile.
POST

POST /posts — Create a post.
DELETE /posts/{id} — Delete a post.
GET /posts/own/{id} — Get own post by ID.
GET /posts/own — Get all own posts.
PUT /posts/own/{id} — Update own post.
COMMENTS

POST /comments — Add a comment.
GET /comments/{id} — Get a comment.
PATCH /comments/{id} — Update a comment.
DELETE /comments/{id} — Delete a comment.
Reactions

POST /reactions — Create a reaction.
PATCH /reactions/{id} — Update a reaction.
DELETE /reactions/{id} — Delete a reaction.
Notifications

POST /notifications — Create a notification.
GET /notifications — Get own notifications.
DELETE /notifications/{id} — Delete a notification.
PUT /notifications/{id} — Update a notification.
Common Workflows

Onboarding and Profile Setup
AUTH > REGISTER
AUTH > LOGIN (store token)
PROFILE > create profile
USER > get current user
Posting and Commenting
POST > create post
COMMENTS > add comment with post reference
Reactions > create reaction for a post/comment
Managing Notifications and Emails
Notifications > get own notifications
Notifications > update or delete notification
Check mailbox for any email notifications (if your server sends them)
Testing and Automation in Postman

Use collection/folder-level auth; requests inherit by default.
Add Tests to validate status codes and payloads.
Use the Collection Runner for workflows (e.g., AUTH → POST → COMMENTS).
Monitors can run smoke tests on a schedule.
Example test: pm.test("Status is 200", () => { pm.response.to.have.status(200); });

Troubleshooting

Swagger UI not loading

Verify OpenAPI docs at /api (
http://localhost:8000/api
).
Check server logs and route configuration.
401 Unauthorized

Ensure Bearer token is set and not expired.
Re-run LOGIN; complete /authentication/verify if required.
404 Not Found

Confirm IDs and that you’re using “own” routes when applicable.
Confirm baseUrl.
400/422 Validation

Ensure required fields are provided and Content-Type is correct.
Nodemailer emails not received

Confirm SMTP config and credentials.
Check spam/junk and from/to addresses.
Verify the server route that triggers the email executed successfully.
