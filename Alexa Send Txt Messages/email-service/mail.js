// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const google = require('googleapis');
const client = require('./client');
const loki = require('lokijs');

const auth = client.oAuth2Client;

const db = new loki();
const contactdb = db.addCollection('contacts')

const people = google.people({
  version: 'v1',
  auth: auth
});

// function me(tokens) {
//   people.people.get({
//     'resourceName': 'people/me',
//     'requestMask.includeField': ['person.names', 'person.emailAddresses']
//   }, function (err, me) {
//     if (err) {
//       console.error(err);
//       process.exit();
//       return;
//     }

//     console.log(me);
//     process.exit();
//   });
// }

function list(tokens) {
  people.people.connections.list({
    'resourceName': 'people/me',
    'requestMask.includeField': ['person.names', 'person.emailAddresses'],
    'pageSize': 500
  }, function (err, me) {
    if (err) {
      console.error(err);
      process.exit();
      return;
    }

    //Load Name and Email Address
    var people = Object.keys(me);
    people.forEach(function (person) {
      var contacts = [];
      var items = Object.keys(me[person]);
      items.forEach(function (item) {
        var value = me[person][item];
        if (value.emailAddresses !== undefined) {
          var contact = new Object();
          contact = {
            name: value.names[0].displayName.toLowerCase(),
            email: value.emailAddresses[0].value.toLowerCase()
          }
          contacts.push(contact);
          contactdb.insert(contact)
        }
      });
    });

//Look up a person
lookupEmail('Jay');
    process.exit();
  });
}

//A function to look up a person
function  lookupEmail(name) {
    var result = contactdb.find({ 'name': { '$contains': name.toLowerCase() } });
    //console.log('results = ' + result.length);
    if (result.length > 1) {
      console.log('More than one name returned');
    } else if (result.length > 0) {
      console.log(result[0].email);
    } else {
      console.log('Not found');
    }
}

const scopes = [
  'https://www.googleapis.com/auth/plus.login',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/user.emails.read'
];

if (module === require.main) {
  client.execute(scopes, function (tokens) {
    //me(tokens);
    list(tokens);
  });
}
