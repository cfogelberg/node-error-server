# NODE ERROR SERVER

A simple Node.js server for displaying rich error pages when the main server is down.

## Building and deploying

Build and deploy using Grunt, the application is copied to the `build` directory for distribution after building

Command                 | Notes
------------------------|--------------------------------------------------------------------------------
grunt clean:total       | Removes the built application files (if any)
grunt build:development | Builds application in development mode
grunt build:staging     | Bumps build number and commits updated files then builds application
grunt build:production  | Bumps build number and commits updated files then builds application
grunt bump:patch        | Increments patch version and commits updated files, does not build application
grunt bump:minor        | Increments minor version and commits updated files, does not build application
grunt bump:major        | Increments major version and commits updated files, does not build application

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