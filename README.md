# UBI Driver application

## To run:

1. Clone repo
2. run npm install
3. run bower install
4. Refer to the Gruntfile.js for your desired initial build task, however "grunt dev" is a good starting point
5. View the project on localhost

## Notes:

- Only for examinging code, API endpoints are internal only
- Project has been worked on by on person over a long period of time

## Features

- Large scale architecture for handling Highcharts using Services for APIs & Chart configs
- Many tools being used in this project for automated testing written in Jasmine, ran with Karma. These tests had to be runnable by Bamboo to fit into our buildcycle, as well they are monitored using a j-unit code coverage package
- Quick theme switching based off of client in client.conf.json, can be changed with a simple grunt task using "replace" package. This functionality is not yet completed.
