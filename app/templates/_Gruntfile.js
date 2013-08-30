module.exports = function (grunt) {
    'use strict';

    var requireJsonConf = function () {
        return grunt.file.readJSON('app/conf/deps.json');
    };

    var requirejsConf = function () {
        var conf = requireJsonConf();
        conf.baseUrl = 'app';
        conf.name = "<%= _.slugify(modulePrefix) %>-main";
        conf.include = ['require-lib'];
        conf.exculde = [];
        conf.stubModules = ['<%= _.slugify(modulePrefix) %>-text'];
        conf.inlineText = true;
        conf.skipModuleInsertion = false;
        conf.optimizeCss = 'none';
        conf.optimize = 'uglify2';
        conf.preserveLicenseComments = false;
        conf.findNestedDependencies = true;
        /*
        conf.fileExclusionRegExp = /(^\.)|(^css$)|(^img$)|(^less$)|(^i18n$)/;
        conf.logLevel = 0;
        */
        return conf;
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            uglify: {
                options: (function () {
                    var opt = requirejsConf();
                    opt.out = 'dist/js/<%%= pkg.name %>-<%%= pkg.version %>.min.js';
                    opt.uglify2 = {};
                    return opt;
                })()
            },
            beautify: {
                options: (function () {
                    var opt = requirejsConf();
                    opt.out = 'dist/js/<%%= pkg.name %>-<%%= pkg.version %>.js';
                    opt.uglify2 = {
                        output: {
                            beautify: true
                        },
                        compress: {
                            sequences: false,
                            global_defs: {
                                DEBUG: false
                            }
                        },
                        warnings: true,
                        mangle: false
                    };
                    return opt;
                })()
            }
        },

        less: {
            uglify: {
                options: {
                    paths: ['app'],
                    yuicompress: true
                },
                files: {
                    'dist/css/<%%= pkg.name %>-<%%= pkg.version %>.min.css': 'app/styles/main.less'
                }
            },
            beautify: {
                options: {
                    paths: ['app'],
                    compress: false,
                    yuicompress: false
                },
                files: {
                    'dist/css/<%%= pkg.name %>-<%%= pkg.version %>.css': 'app/styles/main.less'
                }
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: ['dist']
                }]
            }
        },

        jade: {
            compile: {
                options: {
                    data: {
                        env: 'production',
                        version: '<%%= pkg.version %>',
                        min: '.min'
                    }
                },
                files: {
                    'dist/index.html': ['app/templates/index.jade']
                }
            }
        },

        requirescriptconf: {
            generate: {
                conf: requireJsonConf(),
                filepath: 'dist/require.partial.conf.js'
            }
        },

        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true,
                basePath: '../'
            }
        },

        express: {
            dev: {
                options: {
                    background: false,
                    script: 'start.js'
                }
            },
            prod: {
                options: {
                    args: ['prod'],
                    background: false,
                    script: 'start.js'
                }
            },
            casper: {
                options: {
                    args: ['prod', 'port=5555'],
                    background: true,
                    script: 'start.js'
                }
            }
        },

        casperjs: {
            files: ['test/itg/main.js']
        },

        trim: {
            content: {
                files: ['dist/js/<%%= pkg.name %>-<%%= pkg.version %>.min.js']
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'app/scripts/**/*.js', 'test/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-casperjs-plugin');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('requirescriptconf', 'generate the script for requireJs conf', function () {
        var config = grunt.config('requirescriptconf.generate'),
            script = 'window.requirescriptconf = ' + JSON.stringify(config.conf) + ';';

        grunt.file.write(config.filepath, script, {
            encoding: 'utf8'
        });
    });

    grunt.registerTask('trimfiles', 'trim the content of files', function () {
        var config = grunt.config('trim.content'),
            i = 0,
            length = config.files.length;

        for (; i < length; i++) {
            var content = grunt.file.read(config.files[i], {
                encoding: 'utf8'
            });

            grunt.file.write(config.files[i], content.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '), {
                encoding: 'utf8'
            });
        }
    });

    grunt.registerTask('compile:beautify', ['requirejs:beautify']);
    grunt.registerTask('compile:uglify', ['requirejs:uglify', 'trimfiles']);
    grunt.registerTask('compile', ['jshint:all', 'compile:beautify', 'compile:uglify', 'less']);
    grunt.registerTask('test', ['requirescriptconf', 'karma:unit']);
    grunt.registerTask('itg', ['express:casper', 'casperjs', 'express:prod:stop']);
    grunt.registerTask('testitg', ['compile:uglify', 'less', 'itg']);
    grunt.registerTask('serverdev', ['express:dev']);
    grunt.registerTask('serverprod', ['express:prod']);
    grunt.registerTask('default', ['compile']);

};