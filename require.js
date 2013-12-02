
const Gio = imports.gi.Gio;

/**
 * /usr/local/share/gjs-1.0 and /usr/lib64/gjs-1.0 are by default in imports.searchPath
 * on my Fedora 19 machine,but these folder does not exist or are empty.
 */

let gnomeShellJSLibs = {
    "extensionPrefs": "/usr/share/gnome-shell/js/",
    "gdm": "/usr/share/gnome-shell/js/",
    "misc": "/usr/share/gnome-shell/js/",
    "perf": "/usr/share/gnome-shell/js/",
    "ui": "/usr/share/gnome-shell/js/",
    "ui/components": "/usr/share/gnome-shell/js/ui/",
    "ui/status": "/usr/share/gnome-shell/js/ui/"
};


let globalLibs = [
    "gi", "extensionPrefs", "gdm", "misc", "perf", "ui/components", "ui/status", "ui",
    "tweener", "cairo", "format", "getttext", "jsUnit", "lang", "mainloop", "promise", "signals"
];


/**
 * @see /usr/share/gnome-shell/js/misc/extensionUtils
 * @see http://stackoverflow.com/questions/10093102/how-to-set-a-including-path-in-the-gjs-code
 * @returns {string}
 */
function pwd() {
    let stack = (new Error()).stack;
    let stackLine = stack.split('\n')[1];
    if (!stackLine)
        throw new Error('Could not find current file');

    let match = new RegExp('@(.+):\\d+').exec(stackLine);
    if (!match)
        throw new Error('Could not find current file');

    let path = match[1];
    let file = Gio.File.new_for_path(path);

    return file.get_parent().get_path();
}

/**
 * @param {string} path
 * @returns {boolean}
 */
function isGlobalModule(path) {
    let splitPath = path.split("/");
    let module = splitPath[0];

    return globalLibs.indexOf(module) > -1;
}

/**
 * @param {string} path
 * @returns {boolean}
 */
function isPathAbsolute(path) {
    return path.search("/") === 0;
}

/**
 * @param {string} path
 * @returns {boolean}
 */
function isPathRelative(path) {
    return path.search(".") === 0;
}

/**
 * @param {string} path
 * @returns {string}
 */
function resolvePath(path) {
    return Gio.File.new_for_path(pwd()+"/"+path).get_path();
}

/**
 * @param {string} requirePath
 * @returns {*}
 * @throws Error
 */
function require(requirePath) {
    let searchPath;
    let splitRequirePath;
    let requiredName;
    let requireFileName;
    let required;

    if (isGlobalModule(requirePath)) {

        splitRequirePath = requirePath.split("/");
        let currentSplitterName = splitRequirePath[0];

        // create search path
        searchPath = gnomeShellJSLibs[currentSplitterName]

        // temporary add searchPath of required
        imports.searchPath.unshift(searchPath);

        required = imports[currentSplitterName]
        for (let i = 1; splitRequirePath.length > i; i++) {
            currentSplitterName = splitRequirePath[i];
            required = required[currentSplitterName];
        }

        // clean up searchPath
        imports.searchPath.shift();

        return required;
    }

    if (isPathAbsolute(requirePath) || isPathRelative(requirePath)) {

        let resolvedRequirePath = resolvePath(requirePath);
        splitRequirePath = resolvedRequirePath.split("/");
        requiredName = splitRequirePath.pop();
        requireFileName = splitRequirePath.pop();

        // create search path
        searchPath = (splitRequirePath.length === 0) ? "./" : splitRequirePath.join("/");
        // temporary add searchPath of required
        imports.searchPath.unshift(searchPath);

        required = imports[requireFileName][requiredName];

        // clean up searchPath
        imports.searchPath.shift();

        return required;
    }

    throw new Error("(require) Unable to require "+requirePath+". File not found or no global module.");
}

require.pwd = pwd;
require.resolvePath = resolvePath;
require.isPathAbsolute = isPathAbsolute;
require.isPathRelative = isPathRelative;

window.require = require;