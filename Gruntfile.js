module.exports = function(grunt) {

	var version = "0.1.2"
	
	var inputFolder = "./docs"
	var tempFolder = "./temp"
	var archiveFolder = "./archive"
	var outputFolder = "../mithril"
	
	var guideLayout = "guide"
	var guide = [
		"auto-redrawing",
		"compiling-templates",
		"comparison",
		"components",
		"getting-started",
		"installation",
		"integration",
		"practices",
		"refactoring",
		"routing",
		"tools",
		"web-services"
	]
	var apiLayout = "api"
	var api = [
		"change-log",
		"roadmap",
		"how-to-read-signatures",
		"mithril",
		"mithril.computation",
		"mithril.deferred",
		"mithril.module",
		"mithril.prop",
		"mithril.redraw",
		"mithril.render",
		"mithril.request",
		"mithril.route",
		"mithril.sync",
		"mithril.trust",
		"mithril.withAttr",
		"mithril.xhr"
	]
	
	
	
	var md2htmlTasks = {}
	var makeTasks = function(layout, pages) {
		pages.map(function(name) {
			md2htmlTasks[name] = {
				options: {layout: inputFolder + "/layout/" + layout + ".html"},
				files: [{src: [inputFolder + "/" + name + ".md"], dest: tempFolder + "/" + name + ".html"}]
			}
		})
	}
	makeTasks("guide", guide)
	makeTasks("api", api)
	
	var currentVersionArchiveFolder = archiveFolder + "/v" + version
	grunt.initConfig({
		md2html: md2htmlTasks,
		uglify: {
			options: {banner: "/*\nMithril v" + version + "\nhttp://github.com/lhorie/mithril.js\n(c) Leo Horie\nLicense: MIT\n*/", sourceMap: true},
			mithril: {src: "mithril.js", dest: currentVersionArchiveFolder + "/mithril.min.js"}
		},
		concat: {
			test: {src: ["mithril.js", "./tests/test.js", "./tests/mock.js", "./tests/mithril-tests.js"], dest: currentVersionArchiveFolder + "/mithril-tests.js"}
		},
		zip: {
			distribution: {
				cwd: currentVersionArchiveFolder + "/",
				src: [currentVersionArchiveFolder + "/mithril.min.js", currentVersionArchiveFolder + "/mithril.min.map"],
				dest: currentVersionArchiveFolder + "/mithril.min.zip"
			}
		},
		replace: {
			options: {force: true, patterns: [{match: /\.md/g, replacement: ".html"}, {match: /\$version/g, replacement: version}]},
			links: {expand: true, flatten: true, src: [tempFolder + "/**/*.html"], dest: currentVersionArchiveFolder + "/"},
			index: {src: inputFolder + "/layout/index.html", dest: currentVersionArchiveFolder + "/index.html"},
			commonjs: {expand: true, flatten: true, src: [inputFolder + "/layout/*.json"], dest: currentVersionArchiveFolder},
		},
		copy: {
			style: {src: inputFolder + "/layout/style.css", dest: currentVersionArchiveFolder + "/style.css"},
			pages: {src: inputFolder + "/layout/pages.json", dest: currentVersionArchiveFolder + "/pages.json"},
			lib: {expand: true, cwd: inputFolder + "/layout/lib/", src: "./**", dest: currentVersionArchiveFolder + "/lib/"},
			tools: {expand: true, cwd: inputFolder + "/layout/tools/", src: "./**", dest: currentVersionArchiveFolder + "/tools/"},
			comparisons: {expand: true, cwd: inputFolder + "/layout/comparisons/", src: "./**", dest: currentVersionArchiveFolder + "/comparisons/"},
			publish: {expand: true, cwd: currentVersionArchiveFolder, src: "./**", dest: outputFolder},
			archive: {expand: true, cwd: currentVersionArchiveFolder, src: "./**", dest: outputFolder + "/archive/v" + version}
		},
		execute: {
			tests: {src: [currentVersionArchiveFolder + "/mithril-tests.js"]}
		},
		clean: {
			options: {force: true},
			generated: [tempFolder]
		},
		watch: {
			files: ["./**/*"],
			tasks: ["build"]
		}
	});
	
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks('grunt-execute');
	grunt.loadNpmTasks("grunt-md2html");
	grunt.loadNpmTasks("grunt-replace");
	grunt.loadNpmTasks('grunt-zip');

	grunt.registerTask("build", ["test", "uglify", "zip", "md2html", "replace", "copy", "clean"]);
	grunt.registerTask("test", ["concat", "execute"]);
	grunt.registerTask("default", ["build", "watch"]);

};
