module.exports = function(grunt){
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    
	var mode = grunt.option("mode") || "development";
	
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
    	}
    });

    grunt.registerTask("build:development", 
		["clean:total", "copy:build", "copy:config_development", "mkdir:logs", "clean:tidy"]);
    grunt.registerTask("build:staging", 
		["clean:total", "copy:build", "copy:config_staging", "mkdir:logs", "clean:tidy"]);
    grunt.registerTask("build:production", 
		["clean:total", "copy:build", "copy:config_production", "mkdir:logs", "clean:tidy"]);
};