var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/Spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

var requireConf = window.requirescriptconf,
    path,
    hasOwn = Object.prototype.hasOwnProperty,
    paths = requireConf.paths,
    vendors = [],
    modules = [],
    i = 0,
    length;

for (path in paths) {
    if (hasOwn.call(paths, path)) {
        if (path.indexOf('<%= _.slugify(modulePrefix) %>-') > -1) {
            modules.push(path);
        } else {
            vendors.push(path);
        }
    }
}

var getDeps = function (modules) {
    var i,
        length,
        deps = [];

    for (i = 0, length = modules.length; i < length; i++) {
        deps.push(modules[i]);
    }

    for (i = 0, length = vendors.length; i < length; i++) {
        deps.push(vendors[i]);
    }

    return deps;
};

length = modules.length;

for (; i < length; i++) {
    requireConf.shim[modules[i]] = {
        deps: vendors
    };
}

requireConf.baseUrl = '/base/app';
requireConf.deps = tests;
requireConf.callback = window.__karma__.start;

requirejs.config(requireConf);