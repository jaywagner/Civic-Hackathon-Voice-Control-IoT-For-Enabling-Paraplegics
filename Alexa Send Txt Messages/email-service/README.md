To run the node component. For testing purposes you need to 

node mail.js

It also requires to set up the Google account with specific authority. You need 'client_id' and 'client_secret' and then add to secret.json

Go to Google API Manger

>> Credentials

Specify a name: Web client

Restrictions:
  Authorized Javascript origins - 'http://localhost'

  Authorized redirect URIs - add two(2) entries: 'http://localhost:8000' and 'http://localhost:8000/oauth2callback'


Then you need to enable from Dashboard the following:

Google People API
Gmail API

