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
                src: ["build", "test/tmp", "**/*~", "**/.*~"]
            }
        },

        jshint: {
            all: [
                "src/**/*.js", "!src/server/node_modules/**/*.js",
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
                src: ["test/**/*.js", "!test/blanket.js"]
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
            }
        },

        set_app_mode: {
            config: {
                expected_modes: ["dev", "staging", "prod"],
                files: [{
                    src: "src/server/config.{{MODE}}.js",
                    dest: "build/out/server"
                }]
            }
        },

        mkdir: {
            logs: {
                options: {
                    create: ["build/out/server/logs"]
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
                        " * (C) <%= grunt.template.today('yyyy') %> <%= pkg.author %>\n" +
                        " */\n"
                },
                files: {
                    src: ["build/**/*.js"]
                }
            },

            css: {
                options: {
                    banner: "/*\n" +
                        " * <%= pkg.name %> - version <%= pkg.version %>:<%= mode %> - " +
                        "<%= grunt.template.today('yyyy-mm-dd') %>\n" +
                        " * <%= pkg.description %>\n" +
                        " * (C) <%= grunt.template.today('yyyy') %> <%= pkg.author %>\n" +
                        " */\n"
                },
                files: {
                    src: ["build/**/*.css"]
                }
            },

            html: {
                options: {
                    banner: "<!--\n" +
                        " <%= pkg.name %> - version <%= pkg.version %>:<%= mode %> - " +
                        "<%= grunt.template.today('yyyy-mm-dd') %>\n" +
                        " <%= pkg.description %>\n" +
                        " (C) <%= grunt.template.today('yyyy') %> <%= pkg.author %>\n" +
                        "-->\n"
                },
                files: {
                    src: ["build/**/*.html"]
                }
            },

            sh: {
                options: {
                    banner: "#!/bin/bash\n" +
                        "# <%= pkg.name %> - version <%= pkg.version %>:<%= mode %> - " +
                        "<%= grunt.template.today('yyyy-mm-dd') %>\n" +
                        "# <%= pkg.description %>\n" +
                        "# (C) <%= grunt.template.today('yyyy') %> <%= pkg.author %>\n"
                },
                files: {
                    src: ["build/**/*.sh"]
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
                commitMessage: "Release v%VERSION%:" + (mode ? mode : "bump-only"),
                commitFiles: ["package.json", "src/client/bower.json", "src/server/package.json"],
                createTag: false,
                push: false
            }
        },

        compress: {
            main: {
                options: {
                    archive: "build/dist/ses-<%= pkg.version %>-<%= mode %>.tar.gz",
                    mode: "tgz",
                    pretty: true
                },
                files: [{
                    cwd: "build/out",
                    expand: true,
                    src: ["**"],
                    dest: "dist/"
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
        });
        grunt.task.run("git-describe");
    });

    grunt.registerTask("test", ["jshint", "mochaTest"]);

    if (mode === "dev") {
        var build_tasks = [
            "clean", "test", "copy", "set_app_mode", "mkdir", "usebanner", "write_ver", "compress"
        ];
    } else {
        var build_tasks = [
            "clean", "test", "bump", "copy", "set_app_mode", "mkdir", "usebanner", "write_ver",
            "compress"
        ];
    }
    grunt.registerTask("build", build_tasks);
};
