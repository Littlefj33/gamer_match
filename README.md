# GamerMatch

CS 554 Final Project

Welcome to GamerMatch! This is a web application for connecting fellow gamers, ensuring you never game alone again!

Let's get started

First, Setup ImageMagick

Second, Setup Docker

Third, Seed
Run redis
Start the application
Register a new user on /auth/register. The username MUST be "admin", all other information is custom
Go to /profile
Press the Seed Database button
Sign out of the admin account
Register your own user
Go to /profile
Copy and paste this steamID into the textbox and click the button to link the account

Fourth, General Usage
While signed in or not, anyone can go to the homepage and view the list of trending games
With your newly linked account you can perform multiple actions

Find matches with other users based on Achievements, Hours Played, and/or Shared Games
Achievements
Click the Achievements button to reveal a filter
Choose a Match Type and enter a game that you own (try "I Achieved" for "Warframe")

Hours Played
Click the Hours Played button to reveal a filter
Enter a game that you own (try "Counter-Strike 2")

Shared Games
Click the Shared Games button to retrieve a list of users with the same games as you

Friends (View, Request, Accept/Decline)
As you are on the Match page, you can request friends based on the matches made.
Click on "+ Add Friend" for any user you want
Click on the Friends button or redirect yourself to /friends to view your sent requests
If you click on the name of the user you sent a request to, it will redirect you to /profile/username and you can view their information there
(you can view any friend's profile by clicking on their name!)
If you have any incoming requests, you can either accept or decline them by clicking the respective button
