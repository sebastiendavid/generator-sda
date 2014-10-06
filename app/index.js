'use strict';
var util = require('util'); // jshint ignore:line
var path = require('path'); // jshint ignore:line
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var _s = require('underscore.string');

var SdaGenerator = yeoman.generators.Base.extend({
    initializing: function() {
        this.pkg = require('../package.json');
    },

    prompting: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the unreal Sda generator!'
        ));

        var prompts = [{
            name: 'projectName',
            message: 'Set a name for your project',
            default: 'foobar'
        }, {
            name: 'projectVersion',
            message: 'Set a version for your project',
            default: '1.0.0'
        }];

        this.prompt(prompts, function(props) {
            this.projectName = _s.slugify(props.projectName);
            this.projectVersion = props.projectVersion;
            done();
        }.bind(this));
    },

    writing: {
        app: function() {
            this.dest.mkdir('src');
            this.dest.mkdir('src/css');
            this.dest.mkdir('src/js');

            this.template('_package.json', 'package.json');
            this.template('_bower.json', 'bower.json');

            this.src.copy('README.md', 'README.md');
            this.src.copy('gulpfile.js', 'gulpfile.js');
            this.src.copy('src/index.html', 'src/index.html');
            this.src.copy('src/css/index.css', 'src/css/index.css');
            this.src.copy('src/js/index.js', 'src/js/index.js');
        },

        projectfiles: function() {
            this.src.copy('editorconfig', '.editorconfig');
            this.src.copy('jshintrc', '.jshintrc');
            this.src.copy('gitignore', '.gitignore');
        }
    },

    end: function() {
        this.installDependencies();
    }
});

module.exports = SdaGenerator;
