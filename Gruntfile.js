"use strict"

module.exports = function(grunt) {

    grunt.initConfig({
        shell: {
            runTests: {
                command: "gjs-console test/testRequire.js -I ./",
                options: { stdout: true, stderr: true }
            }
        },
        watch: {
            test: {
                files: ["./require.js", "./test/*.js"],
                tasks: ["shell:runTests"],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("watch-test", ["shell:runTests", "watch:test"]);

};