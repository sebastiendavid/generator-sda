'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var SdaGenerator = module.exports = function SdaGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(SdaGenerator, yeoman.generators.Base);

SdaGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    // have Yeoman greet the user.
    console.log(this.yeoman);

    var prompts = [
        {
            name: 'projectName',
            message: 'Chose a name for your project',
            default: 'sda-project'
        },
        {
            name: 'projectVersion',
            message: 'Set a version for your project',
            default: '1.0.0'
        },
        {
            name: 'modulePrefix',
            message: 'Set a module prefix for the requireJS modules',
            default: 'sda-project'
        }
    ];

    this.prompt(prompts, function (props) {
        this.projectName = props.projectName;
        this.projectVersion = props.projectVersion;
        this.modulePrefix = props.modulePrefix;

        cb();
    }.bind(this));
};

SdaGenerator.prototype.app = function app() {
    this.mkdir('app');
    this.mkdir('app/conf');
    this.mkdir('app/scripts');
    this.mkdir('app/scripts/main');
    this.mkdir('app/scripts/router');
    this.mkdir('app/styles');
    this.mkdir('app/templates');

    this.mkdir('test');
    this.mkdir('test/itg');
    this.mkdir('test/unit');

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('_Gruntfile.js', 'Gruntfile.js');
    this.copy('_README.md', 'README.md');
    this.copy('start.js', 'start.js');

    this.copy('_deps.json', 'app/conf/deps.json');

    this.copy('_main.js', 'app/scripts/main.js');
    this.copy('_App.js', 'app/scripts/main/App.js');
    this.copy('_MainView.js', 'app/scripts/main/MainView.js');
    this.copy('ContentRegion.js', 'app/scripts/main/ContentRegion.js');
    this.copy('_Router.js', 'app/scripts/router/Router.js');
    this.copy('_RoutesController.js', 'app/scripts/router/RoutesController.js');

    this.copy('main.less', 'app/styles/main.less');

    this.copy('_index.jade', 'app/templates/index.jade');
    this.copy('main.html', 'app/templates/main.html');

    this.copy('karma.conf.js', 'test/karma.conf.js');
    this.copy('_require.conf.js', 'test/require.conf.js');
    this.copy('_appSpec.js', 'test/unit/appSpec.js');
    this.copy('_mainCasper.js', 'test/itg/main.js');
};

SdaGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('gitignore', '.gitignore');
    this.copy('bowerrc', '.bowerrc');
};
