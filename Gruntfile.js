/**
 * Файл конфигурации сборки Grunt
 */
module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            mmtest: {
                files: {
                    'build/mmtest/olmm.min.js' : 'build/mmtest/olmm.js'
                }
            }
        },
        // перед выполнением конкатенации, нужно удалить старые файлы
        clean: {
            build: ["build/olmm.js"]
        },

        concat: {
            // Для примера mmtest.html
            mmtest: {
                src: [
                    'OpenLayers/build/ol.js',
                    'apps/core.js',
                    'actions/edit.js',

                    'presets/styles.js',
                    'presets/layers.js',
                    'presets/sources.js',

                    'utils/line.js',
                    'utils/wkt.js',
                    'utils/geojson.js',

                    'utils/points.js',
                    'utils/fit.js',

                    'utils/transform.js',
                    'plugins/mmtest.js'
                ],
                dest: 'build/mmtest/olmm.js'
            }
        },
    });

    // Load plugins here.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Сборка для всех тестов
    grunt.registerTask('default',
        [
            'clean',
            'concat',
            'uglify'
        ]);

    // Сборка теста mmtest.html
    // Запуск: `grunt mmtest`
    grunt.registerTask('mmtest', [
            'clean',
            'concat:mmtest',
            'uglify:mmtest'
        ]);
};
