/**
 * Файл конфигурации сборки Grunt
 */
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            mmtest: {
                files: {
                    'build/mmtest/olmm.min.js': 'build/mmtest/olmm.js'
                }
            },
            mmtest_ng: {
                files: {
                    'build/mmtest_ng/olmm.min.js': 'build/mmtest_ng/olmm.js'
                }
            },
            gis_layers: {
                files: {
                    'build/gis/olmm.min.js': 'build/gis/olmm.js'
                }
            },
            ways: {
                files: {
                    'build/ways/olmm.min.js': 'build/ways/olmm.js'
                }
            }
        },
        // перед выполнением конкатенации, нужно удалить старые файлы
        clean: {
            build: [
                'build/mmtest/olmm.js',
                'build/mmtest_ng/olmm.js',
                'build/gis/olmm.js',
                'build/ways/olmm.js'
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
                    'apps/core.js',
                    'actions/edit.js',
                    'actions/select.js',
                    'presets/styles.js',
                    'presets/layers.js',
                    'presets/sources.js',
                    'utils/fit.js',
                    'utils/geojson.js',
                    'utils/transform.js',
                    'utils/projections.js',
                    'actions/click.js',
                    'actions/add.js',
                    'plugins/mmtest_ng.js'
                ],
                dest: 'build/mmtest_ng/olmm.js'
            },

            gis_layers: {
                src: [
                    'jquery-1.10.2.js',
                    'OpenLayers/build/ol-debug.js',
                    'apps/core.js',
                    'actions/add.js',
                    'presets/layers.js',
                    'presets/sources.js',
                    'utils/fit.js',
                    'utils/geojson.js',
                    'utils/transform.js',
                    'utils/map.js',
                    'utils/style.js',
                    'plugins/gis.js'
                ],
                dest: 'build/gis/olmm.js'
            },

            ways: {
                src: [
                    'OpenLayers/build/ol-debug.js',
                    'apps/core.js',
                    'actions/click.js',
                    'presets/layers.js',
                    'presets/sources.js',
                    'utils/fit.js',
                    'utils/map.js',
                    'utils/geojson.js',
                    'utils/transform.js',
                    'plugins/ways.js'
                ],
                dest: 'build/ways/olmm.js'
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
    ]);

    grunt.registerTask('gis_layers', [
        'clean',
        'concat:gis_layers',
        'uglify:gis_layers'
    ]);

    grunt.registerTask('ways', [
        'clean',
        'concat:ways',
        'uglify:ways'
    ])
};
