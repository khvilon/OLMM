/**
 * Файл конфигурации сборки Grunt
 */
module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            oolm: {
                files: {
                    'build/olmm.min.js' : 'build/olmm.js'
                }
            }
        },
        // перед выполнением конкатенации, нужно удалить старые файлы
        clean: {
            build: ["build/olmm.js"]
        },

        concat: {
            js: {
                src: [
                    'OpenLayers/build/ol.js',
                    'apps/core.js',
                    'actions/edit.js',
                    'actions/select.js',
                    'presets/styles.js',
                    'presets/layers.js',
                    'presets/sources.js',
                    'utils/line.js',
                    'utils/fit.js',
                    'utils/wkt.js',
                    'utils/geojson.js',
                    'utils/transform.js',
                    'plugins/mmtest_ng.js'
                ],
                dest: 'build/olmm.js'
            }
        },
    });

    // Load plugins here.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Register tasks here.
    grunt.registerTask('default',
        [
            'clean',
            'concat',
            'uglify'
        ]);
};
