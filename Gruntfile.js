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
            },
            mmtest_ng: {
                files: {
                    'build/mmtest_ng/olmm.min.js': 'build/mmtest_ng/olmm.js'
                }
            }
        },
        // перед выполнением конкатенации, нужно удалить старые файлы
        clean: {
            build: [
                'build/mmtest/olmm.js',
                'build/mmtest_ng/olmm.js'
            ]
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
            },

            // для examples/mmtest_ng.html
            mmtest_ng: {
                src: [
                    'jquery-1.10.2.js',
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
                    'actions/click.js',
                    'plugins/mmtest_ng.js'
                ],
                dest: 'build/mmtest_ng/olmm.js'
            }
        }
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

    grunt.registerTask('mmtest_ng', [
        'clean',
        'concat:mmtest_ng',
        'uglify:mmtest_ng'
    ])
};
