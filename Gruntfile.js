"use strict";

module.exports = function(grunt) {
    var _ = require("underscore");
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    var mode = grunt.option("mode") || grunt.option("mode", "dev"); // default to dev

    grunt.initConfig({
        // Configuration files and variables
        pkg: grunt.file.readJSON("package.json"),
        mode: mode,

        // Plugin tasks
        clean: {
            all: {
                src: ["build", "test/out", "test/tmp", "**/*~", "**/.*~"]
            }
        },

        jshint: {
            all: [
                "src/**/*.js",
                "!src/server/node_modules/**/*.js",
                "!src/client/bower_components/**/*.js"
            ],
            options: {
                jshintrc: ".jshintrc",
            },
        },

        mochaTest: {
            test: {
                options: {
                    reporter: "spec",
                    clearRequireCache: true,
                    require: "test/blanket"
                },
                src: [
                    "test/**/*.js",
                    "!test/blanket.js",
                    "!test/out/server/node_modules/**/*.js",
                    "!test/out/client/bower_components/**/*.js"
                ]
            }
        },

        // TODO: Fix grunt-contrib-copy/tasks/copy.js - mode not set and defaults to false, default it to true
        copy: {
            build: {
                cwd: "src",
                src: ["**"],
                dest: "build/out",
                expand: true,
                mode: true
            },
            test: {
                cwd: "src",
                src: ["**"],
                dest: "test/out",
                expand: true,
                mode: true
            }
        },

        set_app_mode: {
            build: {
                expected_modes: ["dev", "staging", "prod"],
                files: [{
                    src: "src/server/config.{{MODE}}.js",
                    dest: "build/out/server"
                }, {
                    src: "src/scripts/pm2/simple-error-server.{{MODE}}.json",
                    dest: "build/out/scripts/pm2"
                }]
            },
            test: {
                expected_modes: ["dev", "staging", "prod"],
                files: [{
                    src: "src/server/config.{{MODE}}.js",
                    dest: "test/out/server"
                }, {
                    src: "src/scripts/pm2/simple-error-server.{{MODE}}.json",
                    dest: "test/out/scripts/pm2"
                }]
            }
        },

        mkdir: {
            build: {
                options: {
                    create: ["build/out/server/logs"]
                }
            },
            test: {
                options: {
                    create: ["test/out/server/logs"]
                }
            }
        },

        usebanner: {
            js: {
                options: {
                    banner: "/*\n" +
                        " * <%= pkg.name %> - version <%= pkg.version %>:<%= mode %> - " +
                        "<%= grunt.template.today('yyyy-mm-dd') %>\n" +
                        " * <%= pkg.description %>\n" +
                        " * (C) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
                        " */\n"
                },
                files: {
                    src: ["build/out/**/*.js", "test/out/**/*.js"]
                }
            },

            css: {
                options: {
                    banner: "/*\n" +
                        " * <%= pkg.name %> - version <%= pkg.version %>:<%= mode %> - " +
                        "<%= grunt.template.today('yyyy-mm-dd') %>\n" +
                        " * <%= pkg.description %>\n" +
                        " * (C) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
                        " */\n"
                },
                files: {
                    src: ["build/out/**/*.css", "test/out/**/*.css"]
                }
            },

            html: {
                options: {
                    banner: "<!--\n" +
                        " <%= pkg.name %> - version <%= pkg.version %>:<%= mode %> - " +
                        "<%= grunt.template.today('yyyy-mm-dd') %>\n" +
                        " <%= pkg.description %>\n" +
                        " (C) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
                        "-->\n"
                },
                files: {
                    src: ["build/out/**/*.html", "test/out/**/*.html"]
                }
            },

            sh: {
                options: {
                    banner: "#!/bin/bash\n" +
                        "# <%= pkg.name %> - version <%= pkg.version %>:<%= mode %> - " +
                        "<%= grunt.template.today('yyyy-mm-dd') %>\n" +
                        "# <%= pkg.description %>\n" +
                        "# (C) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n"
                },
                files: {
                    src: ["build/out/**/*.sh", "test/out/**/*.sh"]
                }
            }
        },

        "git-describe": {
            "options": {
                "failOnError": true
            },
            "main": {}
        },

        bump: {
            options: {
                files: ["package.json", "src/client/bower.json", "src/server/package.json"],
                updateConfigs: ["pkg"],
                commit: true,
                commitMessage: "Release v%VERSION%",
                commitFiles: ["package.json", "src/client/bower.json", "src/server/package.json"],
                createTag: false,
                push: false
            }
        },

        compress: {
            main: {
                options: {
                    archive: "build/dist/ses-<%= pkg.version %>-<%= mode %>-" +
                        "<%= grunt.template.today('yyyymmdd-HHMM') %>.tar.gz",
                    mode: "tgz",
                    pretty: true
                },
                files: [{
                    cwd: "build/out",
                    expand: true,
                    src: ["**"],
                    dest: "ses/"
                }]
            }
        }
    });

    grunt.registerTask("write_ver", function() {
        grunt.event.once("git-describe", function(rev) {
            grunt.file.write("build/out/version.json", JSON.stringify({
                version: grunt.config("pkg.version") + (mode ? ":" + mode : ""),
                revision: rev.object + (rev.dirty ? rev.dirty : "-clean") + (rev.tag ? "---" + rev.tag : ""),
                date: grunt.template.today()
            }));
            grunt.file.write("test/out/version.json", JSON.stringify({
                version: grunt.config("pkg.version") + (mode ? ":" + mode : ""),
                revision: rev.object + (rev.dirty ? rev.dirty : "-clean") + (rev.tag ? "---" + rev.tag : ""),
                date: grunt.template.today()
            }));
        });
        grunt.task.run("git-describe");
    });

    grunt.registerTask("assemble", ["copy", "set_app_mode", "mkdir", "usebanner", "write_ver"]);
    grunt.registerTask("test", ["jshint", "mochaTest"]);
    grunt.registerTask("build", ["clean", "assemble", "compress", "test"]);
    grunt.registerTask("test_build", ["clean", "copy:test", "set_app_mode:test", "mkdir:test", "test"]);

    grunt.registerTask("broken_build", ["clean", "assemble", "test", "compress"])
};
