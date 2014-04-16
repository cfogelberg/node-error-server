# SIMPLE ERROR SERVER

A simple Node.js server for displaying rich error pages when the main server is down.

## Building and deploying

Build and deploy using Grunt, the application is copied to the `build` directory for deployment after building

Command             | Notes
--------------------|--------------------------------------------------------------------------------
grunt clean:total   | Removes the built application files (if any)
grunt build:dev     | Builds application in development mode
grunt build:staging | Bumps build number and commits updated files then builds application
grunt build:prod    | Bumps build number and commits updated files then builds application
grunt bump:patch    | Increments patch version and commits updated files, does not build application
grunt bump:minor    | Increments minor version and commits updated files, does not build application
grunt bump:major    | Increments major version and commits updated files, does not build application

## Running

There are two ways of running SES. In a terminal:

1. Execute the shell script `src/server/nodemon-server.sh`

With upstart and monit (this is more robust than using nodemon and the terminal):

1. Update the `simple-error-server.*.override` files as needed
2. Copy `build/*` to `/var/node/simple-error-server`, `chown -R` to match the user in `simple-error-server.conf`
3. Copy `scripts/simple-error-server.conf` and `scripts/simple-error-server.override` to `/etc/init`
4. `sudo initctl reload-configuration`
5. `sudo start simple-error-server``

## Version control

Simple Error Server uses a simplified version of the gitflow model - see 
http://nvie.com/posts/a-successful-git-branching-model/ for details

## Backstory

This is only the second Node.js application I've built. Although it's quite a bit simpler than the first I'm
sure there are plenty of strange or silly things that I've done. All feedback, suggestions and questions are
welcome - `cfogelberg@gmail.com` is the best email to reach me on.

Overall, simple-error-server is a very simple thing with functionality that is more restricted than even a
general web server. This means that some parts of it feel a little bit over-engineered. E.g. the `config.*.js`
operation mode arrangement. However, I've found this very useful in a production server because it stops me
accidentally starting a production server build in staging or vice versa.
t
Likewise, the logger and mailing utilities are a bit complex for the use case, but they're robust. The secret
agenda behind this project is that I hope to use it as the stub for my future Node.js apps as well, and the
code architecture worked pretty well in the more complex application I originally developed it (borrowed it)
for. This application had several dozen end points and some complex customer workflows and most of my work on
the simple-error-server server code has been just stripping things out.

Hopefully I'll be able to put this other application on github sometime soon as well, and there you can see a 
whole basket of other mistakes I've made (it turns out grunt is much nicer for building than Ant and shell 
scripts...).

## License

Copyright (C) 2014 Christo Fogelberg

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of 
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO 
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
IN THE SOFTWARE.