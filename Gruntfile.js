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
            gis: {
                files: {
                    'build/gis/olmm.min.js': 'build/gis/olmm.js'
                }
            },
            ways: {
                files: {
                    'build/ways/olmm.min.js': 'build/ways/olmm.js'
                }
            },
            platon: {
                files: {
                    'build/platon/olmm.min.js': 'build/platon/olmm.js'
                }
            },
            smk: {
                files: {
                    'build/smk/olmm.min.js': 'build/smk/olmm.js'
                }
            },
            dashboard: {
                files: {
                    'build/dashboard/olmm.min.js': 'build/dashboard/olmm.js'
                }
            },
            tso: {
                files: {
                    'build/tso/olmm.min.js': 'build/tso/olmm.js'
                }
            },
            sc: {
                files: {
                    'build/sc/olmm.min.js': 'build/sc/olmm.js'
                }
            }
        },
        // перед выполнением конкатенации, нужно удалить старые файлы
        clean: {
            build: [
                'build/mmtest/olmm.js',
                'build/mmtest_ng/olmm.js',
                'build/gis/olmm.js',
                'build/ways/olmm.js',
                'build/platon/olmm.js',
                'build/snk/olmm.js',
                'build/dashboard/olmm.js',
                'build/tso/olmm.js',
                'build/sc/olmm.js'
            ]
        },

        concat: {
            // Для примера mmtest.html
            mmtest: {
                src: [
                    'OpenLayers/build/ol.js',
                    'apps/core.js',
                    'interactions/edit.js',
                    'presets/styles.js',
                    'utils/layer.js',

                    'utils/source.js',
                    'utils/geojson.js',
                    'utils/points.js',
                    'utils/map.js',

                    'utils/transform.js',
                    'plugins/mmtest.js'
                ],
                dest: 'build/mmtest/olmm.js'
            },

            // для examples/mmtest_ng.html
            mmtest_ng: {
                src: [
                    'apps/core.js',
                    'interactions/edit.js',
                    'interactions/select.js',
                    'presets/styles.js',
                    'utils/layer.js',
                    'utils/source.js',
                    'utils/map.js',
                    'utils/geojson.js',
                    'utils/transform.js',
                    'utils/projections.js',
                    'interactions/click.js',
                    'interactions/add.js',
                    'plugins/mmtest_ng.js'
                ],
                dest: 'build/mmtest_ng/olmm.js'
            },

            gis: {
                src: [
                    'jquery-1.10.2.js',
                    'openlayers/ol.js',

                    'apps/core.js',
                    'apps/gis.js',

                    'interactions/base.js',
                    'interactions/add.js',
                    'interactions/select.js',
                    'interactions/click.js',
                    'interactions/drag.js',
                    'interactions/edit.js',
                    'interactions/delete.js',

                    'utils/layer.js',
                    'utils/source.js',
                    'utils/cursor.js',
                    'utils/feature.js',
                    'utils/geojson.js',
                    'utils/transform.js',
                    'utils/cluster.js',
                    'utils/map.js',
                    'utils/style.js'
                ],
                dest: 'build/gis/olmm.js'
            },

            sc: {
                src: [
                    'openlayers/ol.js',

                    'apps/core.js',
                    'apps/sc.js',

                    'interactions/base.js',
                    'interactions/select.js',
                    'interactions/click.js',

                    'utils/cluster.js',
                    'utils/layer.js',
                    'utils/source.js',
                    'utils/cursor.js',
                    'utils/feature.js',
                    'utils/geojson.js',
                    'utils/transform.js',
                    'utils/cluster.js',
                    'utils/map.js',
                    'utils/style.js'
                ],
                dest: 'build/sc/olmm.js'
            },

            ways: {
                src: [
                    'openlayers/ol.js',

                    'apps/core.js',
                    'apps/ways.js',

                    'apps/core.js',

                    'interactions/base.js',
                    'interactions/add.js',
                    'interactions/edit.js',
                    'interactions/select.js',
                    'interactions/click.js',
                    'interactions/delete.js',

                    'utils/layer.js',
                    'utils/source.js',
                    'utils/feature.js',
                    'utils/points.js',
                    'utils/fit.js',
                    'utils/style.js',
                    'utils/map.js',
                    'utils/geojson.js',
                    'utils/cursor.js',
                    'utils/transform.js'
                ],
                dest: 'build/ways/olmm.js'
            },

            platon: {
                src: [
                    'openlayers/ol.js',

                    'apps/core.js',
                    'apps/platon.js',

                    'interactions/click.js',
                    'interactions/hover.js',

                    'utils/overlay.js',
                    'utils/layer.js',
                    'utils/source.js',
                    'utils/feature.js',
                    'utils/style.js',
                    'utils/map.js',
                    'utils/geojson.js',
                    'utils/cursor.js',
                    'utils/transform.js'
                ],
                dest: 'build/platon/olmm.js'
            },

            smk: {
                src: [
                    'openlayers/ol.js',

                    'apps/core.js',
                    'apps/smk.js',

                    'interactions/base.js',
                    'interactions/add.js',
                    'interactions/select.js',
                    'interactions/click.js',
                    'interactions/delete.js',

                    'utils/layer.js',
                    'utils/source.js',
                    'utils/feature.js',
                    'utils/points.js',
                    'utils/style.js',
                    'utils/map.js',
                    'utils/geojson.js',
                    'utils/cursor.js',
                    'utils/transform.js'
                ],
                dest: 'build/smk/olmm.js'
            },

            dashboard: {
                src: [
                    'openlayers/ol.js',

                    'apps/core.js',
                    'apps/dashboard.js',

                    'utils/layer.js',
                    'utils/source.js',
                    'utils/feature.js',
                    'utils/points.js',
                    'utils/style.js',
                    'utils/map.js',
                    'utils/geojson.js',
                    'utils/cursor.js',
                    'utils/transform.js'
                ],
                dest: 'build/dashboard/olmm.js'
            },

            tso: {
                src: [
                    'openlayers/ol.js',

                    'apps/core.js',
                    'apps/tso.js',

                    'interactions/base.js',
                    'interactions/add.js',
                    'interactions/select.js',
                    'interactions/click.js',
                    'interactions/delete.js',

                    'utils/layer.js',
                    'utils/source.js',
                    'utils/feature.js',
                    'utils/points.js',
                    'utils/style.js',
                    'utils/map.js',
                    'utils/geojson.js',
                    'utils/cursor.js',
                    'utils/transform.js'
                ],
                dest: 'build/tso/olmm.js'
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

    grunt.registerTask('gis', [
        'clean',
        'concat:gis',
        'uglify:gis'
    ]);

    grunt.registerTask('ways', [
        'clean',
        'concat:ways',
        'uglify:ways'
    ]);

    grunt.registerTask('platon', [
        'clean',
        'concat:platon',
        'uglify:platon'
    ]);

    grunt.registerTask('smk', [
        'clean',
        'concat:smk',
        'uglify:smk'
    ]);

    grunt.registerTask('dashboard', [
        'clean',
        'concat:dashboard',
        'uglify:dashboard'
    ]);

    grunt.registerTask('tso', [
        'clean',
        'concat:tso',
        'uglify:tso'
    ]);

    grunt.registerTask('sc', [
        'clean',
        'concat:sc',
        'uglify:sc'
    ]);
};
