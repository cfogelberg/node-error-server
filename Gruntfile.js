module.exports = function(grunt){
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    
	var app_info = grunt.file.readJSON("app_info.json") || {};
	var banner = {
		js: "/*\n" + 
		" * <%= app_info.name %> - version <%= app_info.version %> - <%= grunt.template.today('yyyy-mm-dd') %>\n" +
		" * <%= app_info.description %>\n" +
		" * (C) <%= grunt.template.today('yyyy') %> <%= app_info.author %>\n" + 
		" */\n",
		
		css: "/*\n" + 
		" * <%= app_info.name %> - version <%= app_info.version %> - <%= grunt.template.today('yyyy-mm-dd') %>\n" +
		" * <%= app_info.description %>\n" +
		" * (C) <%= grunt.template.today('yyyy') %> <%= app_info.author %>\n" +
		" */\n",
		
		html: "<!--\n" + 
		" <%= app_info.name %> - version <%= app_info.version %> - <%= grunt.template.today('yyyy-mm-dd') %>\n" +
		" <%= app_info.description %>\n" +
		" (C) <%= grunt.template.today('yyyy') %> <%= app_info.author %>\n" + 
		"-->\n",
		
		sh: "#!/bin/bash\n" +
		"# <%= app_info.name %> - version <%= app_info.version %> - <%= grunt.template.today('yyyy-mm-dd') %>\n" +
		"# <%= app_info.description %>\n" +
		"# (C) <%= grunt.template.today('yyyy') %> <%= app_info.author %>\n"
	};
	
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
	    
	    clean: {
			total: {
			    src: [ "build" ]
			},
			
			tidy: {
				src: [ "build/server/config.*.js" ]	
			}
    	},
        
	    copy: {
	        build: {
		        cwd: "src",
		        src: [ "**" ],
		        dest: "build",
		        expand: true
	        },
	    
    		config_development: {
    			nonull: true,
    			cwd: "src",
				src: "src/server/config.development.js",
				dest: "build/server/config.js"
    		},
	    
    		config_staging: {
    			nonull: true,
    			cwd: "src",
				src: "src/server/config.staging.js",
				dest: "build/server/config.js"
    		},
	    
    		config_production: {
    			nonull: true,
    			cwd: "src",
				src: "src/server/config.production.js",
				dest: "build/server/config.js"
    		}
    	},
    	
    	mkdir: {
    		logs: {
    			options: {
    				create: [ "build/server/logs" ]
    			}
    		}
    	},
    	
    	app_info: app_info,
    	banner: banner,
    	usebanner: {
    		js: {
    			options: {
    				banner: "<%= banner.js %>"
    			},
    			files: {
    				src: [ "build/**/*.js" ]
    			}
    		},
    		
    		css: {
    			options: {
    				banner: "<%= banner.css %>"
    			},
    			files: {
    				src: [ "build/**/*.css" ]
    			}
    		},
    		
    		html: {
    			options: {
    				banner: "<%= banner.html %>"
    			},
    			files: {
    				src: [ "build/**/*.html" ]
    			}
    		},
    		
    		sh: {
    			options: {
    				banner: "<%= banner.sh %>"
    			},
    			files: {
    				src: [ "build/**/*.sh" ]
    			}
    		}
    	}
    });

    grunt.registerTask("build:development", 
		["clean:total", "copy:build", "copy:config_development", "mkdir:logs", "usebanner", "clean:tidy"]);
    grunt.registerTask("build:staging", 
		["clean:total", "copy:build", "copy:config_staging", "mkdir:logs", "usebanner", "clean:tidy"]);
    grunt.registerTask("build:production", 
		["clean:total", "copy:build", "copy:config_production", "mkdir:logs", "usebanner", "clean:tidy"]);
};
