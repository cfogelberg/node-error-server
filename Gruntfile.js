module.exports = function(grunt){
	var _ = require("underscore");
	
	var build_tasks = _.filter(grunt.cli.tasks, function(arg) {
		return arg.indexOf("build:") !== -1;
	});
	var build_modes = _.map(build_tasks, function(task) {
		return task.substring(task.indexOf(":") + 1);
	});
	if(build_modes.length > 1) {
		grunt.log.error("Multiple build tasks specified: " + JSON.stringify(build_tasks));
	}
	else {
		var build_mode = build_modes[0];
	}
	
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
	
    grunt.initConfig({
    	// Configuration files and variables
        pkg: grunt.file.readJSON("package.json"),
    	app_info: grunt.file.readJSON("app_info.json"),
    	build_mode: build_mode,
    	
    	// Plugin tasks
	    clean: {
			total: {
			    src: [ "build" ]
			},
			
			tidy: {
				src: [ "build/server/config.*.js", "build/scripts/simple-error-server.*.override" ]	
			}
    	},
        
    	// TODO: Fix grunt-contrib-copy/tasks/copy.js - mode not set and defaults to false, default it to true
	    copy: {
	        build: {
		        cwd: "src",
		        src: [ "**" ],
		        dest: "build",
		        expand: true,
		        mode: true
	        },
	    
    		config_dev: {
    			nonull: true,
    			cwd: "src",
				src: "src/server/config.dev.js",
				dest: "build/server/config.js",
				mode: true
    		},
	    
    		config_staging: {
    			nonull: true,
    			cwd: "src",
				src: "src/server/config.staging.js",
				dest: "build/server/config.js",
				mode: true
    		},
	    
    		config_prod: {
    			nonull: true,
    			cwd: "src",
				src: "src/server/config.prod.js",
				dest: "build/server/config.js",
				mode: true
    		},
    		
    		override_dev: {
    			nonull: true,
    			cwd: "src",
				src: "src/scripts/simple-error-server.dev.override",
				dest: "build/scripts/simple-error-server.override",
				mode: true
    		},
    		
    		override_staging: {
    			nonull: true,
    			cwd: "src",
				src: "src/scripts/simple-error-server.staging.override",
				dest: "build/scripts/simple-error-server.override",
				mode: true
    		},
    		
    		override_prod: {
    			nonull: true,
    			cwd: "src",
				src: "src/scripts/simple-error-server.prod.override",
				dest: "build/scripts/simple-error-server.override",
				mode: true
    		}
    	},
    	
    	mkdir: {
    		logs: {
    			options: {
    				create: [ "build/server/logs" ]
    			}
    		}
    	},
    	
    	usebanner: {
    		js: {
    			options: {
    				banner: "/*\n" + 
		    	    		" * <%= app_info.name %> - version <%= app_info.version %>:<%= build_mode %> - " +
		        				"<%= grunt.template.today('yyyy-mm-dd') %>\n" +
			        		" * <%= app_info.description %>\n" +
			        		" * (C) <%= grunt.template.today('yyyy') %> <%= app_info.author %>\n" + 
			        		" */\n"
    			},
    			files: {
    				src: [ "build/**/*.js" ]
    			}
    		},
    		
    		css: {
    			options: {
    				banner: "/*\n" + 
		    	    		" * <%= app_info.name %> - version <%= app_info.version %>:<%= build_mode %> - " +
			        			"<%= grunt.template.today('yyyy-mm-dd') %>\n" +
			        		" * <%= app_info.description %>\n" +
			        		" * (C) <%= grunt.template.today('yyyy') %> <%= app_info.author %>\n" +
			        		" */\n"
    			},
    			files: {
    				src: [ "build/**/*.css" ]
    			}
    		},
    		
    		html: {
    			options: {
    				banner: "<!--\n" + 
		    	    		" <%= app_info.name %> - version <%= app_info.version %>:<%= build_mode %> - " +
			        			"<%= grunt.template.today('yyyy-mm-dd') %>\n" +
			        		" <%= app_info.description %>\n" +
			        		" (C) <%= grunt.template.today('yyyy') %> <%= app_info.author %>\n" + 
			        		"-->\n"
    			},
    			files: {
    				src: [ "build/**/*.html" ]
    			}
    		},
    		
    		sh: {
    			options: {
    				banner: "#!/bin/bash\n" +
				    		"# <%= app_info.name %> - version <%= app_info.version %>:<%= build_mode %> - " +
				    			"<%= grunt.template.today('yyyy-mm-dd') %>\n" +
				    		"# <%= app_info.description %>\n" +
				    		"# (C) <%= grunt.template.today('yyyy') %> <%= app_info.author %>\n"
    			},
    			files: {
    				src: [ "build/**/*.sh" ]
    			}
    		}
    	},
    	
    	"git-describe": {
			"options": {
				"failOnError": true
			},
			"main": {
			}
    	},
    	
    	bump: {
    		options: {
    			files: [ "package.json", "app_info.json", "src/client/bower.json", "src/server/package.json" ],
    			updateConfigs: [ "pkg", "app_info" ],
    			commit: true,
    			commitMessage: "Release v%VERSION%:" + (build_mode ? build_mode : "bump-only"),
    			commitFiles: [ "package.json", "app_info.json", "src/client/bower.json", "src/server/package.json" ],
    			createTag: false,
    			push: false
    		}
    	}
    });
    
    grunt.registerTask("version", function() {
    	grunt.event.once("git-describe", function(rev) {
    		grunt.file.write("build/version.json", JSON.stringify({
    		    version: grunt.config("pkg.version") + (build_mode ? ":" + build_mode : ""),
    		    revision: rev.object + (rev.dirty ? rev.dirty : "-clean") + (rev.tag ? "---" + rev.tag : ""),
    		    date: grunt.template.today()
		    }));
    	});
    	grunt.task.run("git-describe");
    });

    grunt.registerTask("build:dev", ["clean:total", "copy:build", "copy:config_dev", "copy:override_dev", 
         "mkdir:logs", "usebanner", "version", "clean:tidy"]);
    grunt.registerTask("build:staging", ["clean:total", "bump:build", "copy:build", "copy:config_staging", 
         "copy:override_staging", "mkdir:logs", "usebanner", "version", "clean:tidy"]);
    grunt.registerTask("build:prod", ["clean:total", "bump:build", "copy:build", "copy:config_prod", 
          "copy:override_prod", "mkdir:logs", "usebanner", "version", "clean:tidy"]);
};
