# SIMPLE ERROR SERVER

SES is a simple Node.js server for displaying rich error pages and logging page displays to the
database.

It was created as a fallback app to redirect to for better logging and a nicer UX when a primary
Node server fails. Error information can be saved to a database for diagnosis. Mailgun integration
for email notification of server errors is included, but requires a Mailgun or Rackspace account.

I have also used this web app as a best practices learning exercise for developing, building and
deploying web apps. All feedback, suggestions and questions are welcome,
[cfogelberg@gmail.com](mailto:cfogelberg@gmail.com) is the best email to reach me on.

## Using SES

By default, SES supports three error routes:

- /dberror.html ("Oh snap! The database server has encountered an error.")
- /servererror.html ("Oh snap! The server has encountered an error.")
- /error.html ("Oh snap! There has been an error.")

For each of these routes the server will save a log message and send an email. A request to
/monit.html will generate a 200 response for monitoring purposes but no log message or email. Any
other route will generate an "unknown error", which will also generate a log message and email. The
client code could be extended easily to use AJAX to send other information from the visitor which
might be useful for diagnostics, e.g. resolution.

## Bumping, building and testing SES

Build and version bump SES using Grunt. A deployable archive is created in the `build/dist`
directory by the build task. To automatically and consistently update version numbers use the bump
tasks. Because SES uses grunt-set-app-mode the application must be built before the tests can be
run. To build just for tests and then test, use `grunt test_build`.

Command                     | Notes
----------------------------|---------------------------------------------------------------------
grunt clean                 | Removes the `build` directory
grunt test                  | Runs jshint and mocha tests
grunt bump:patch            | Increments patch version and commits updated files
grunt bump:minor            | Increments minor version and commits updated files
grunt bump:major            | Increments major version and commits updated files
grunt build                 | Builds application with run mode configuration "development"
grunt build --mode=dev      | Ditto
grunt build --mode=staging  | Builds application with run mode configuration "development"
grunt build --mode=prod     | Builds application with run mode configuration "development"
grunt test_build --mode=... | Builds application just for tests with specified run mode
grunt test                  | Executes tests

## Deploying SES

SES requires Node >= 0.10.0, pm2 >= 0.9.6 and mongodb >= 2.4.10. Optionally, you can also use monit
for system-level monitoring of a running SES server.

### SES configuration and run modes

pm2 configuration is specified in the file `scripts/simple-error-server.json`.

To help ensure that only the production-configured code is run in a production environment, and
likewise for other run modes, SES uses the grunt-set-app-mode plugin to include the correct
runtime configuration file. This file specifies database log and email configuration and also the
server portIt is specified for each run mode in the `server/config.*.js` files. On server start the
expected run mode must be specified and this is checked against the config file. To listen on a port
less than 1024 either run the server as root (a bad idea) or use iptables to redirect.

### Installation

Uncompress `build/dist/ses-*.tar.gz` to the desired location

To use monit  copy `scripts/monit/simple-error-server.monit` to `/etc/monit/conf.d`. The default
provided monit file is set up for use with upstart, not pm2. You will need to customise this file
for your system.

## Running SES

SES is run using pm2. To start the server, `cd server` and run
`pm2 start ../scripts/pm2/simple-error-server.json`.

See the pm2 [documentation](https://github.com/Unitech/pm2#table-of-contents) for other useful
commands.

## Contributing to SES

Contributions to SES are very welcome. For version control, SES uses uses a simplified version of
the gitflow model - see [here](http://nvie.com/posts/a-successful-git-branching-model/) for
details.

## Changelog

v0.1.0 - initial release, MVP
v1.0.0 - updated build, deployment and run; JSHint; Monit

## License

Copyright (C) 2014 Christo Fogelberg

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without imitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
