
const Gio = imports.gi.Gio;

/**
 * /usr/local/share/gjs-1.0 and /usr/lib64/gjs-1.0 are by default in imports.searchPath
 * on my Fedora 19 machine,but these folder does not exist or are empty.
 */

let gnomeShellJSLibs = [
    "/usr/share/gnome-shell/js",
    "/usr/share/gnome-shell/js/extensionPrefs",
    "/usr/share/gnome-shell/js/gdm",
    "/usr/share/gnome-shell/js/misc",
    "/usr/share/gnome-shell/js/perf",
    "/usr/share/gnome-shell/js/ui",
    "/usr/share/gnome-shell/js/ui/components",
    "/usr/share/gnome-shell/js/ui/status"
];

let gjsLibs = [
    "/usr/share/gjs-1.0",
    "/usr/share/gjs-1.0/tweener"
];

let gnomeExtensionFrameworks = gnomeShellJSLibs.concat(gjsLibs);


for (let i = 0; gnomeExtensionFrameworks.length > i; i++) {
    let framework = gnomeExtensionFrameworks[i];

    if (imports.searchPath.indexOf(framework) === -1) {
        imports.searchPath.push(framework);
    }
}

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
 * @param {string} requirePath
 * @returns {function|Function|Object}
 */
function require(requirePath) {
    let isAbsolute = requirePath.search("/") == 0;
    let isGi = requirePath.search("gi") == 0;
    let isMisc = requirePath.search("misc") == 0;
    let splittedPath = requirePath.split("/");
    let requiredObjectName = splittedPath.pop();
    let requiredFilename = splittedPath.pop();
    let requiredObject;
    let _requirePath = splittedPath.join("/");

    if (!isAbsolute && !isGi && !isMisc) {
        let currentFilePath = pwd();
        _requirePath = Gio.File.new_for_path(currentFilePath+"/"+_requirePath).get_path();
    }


    if (isGi) {
        if (!requiredFilename || requiredFilename == "gi") {
            requiredObject = imports.gi[requiredObjectName];
        } else {
            requiredObject = imports.gi[requiredFilename][requiredObjectName];
        }
    }

    if (isMisc) {
        if (!requiredFilename || requiredFilename == "misc") {
            requiredObject = imports.misc[requiredObjectName];
        } else {
            requiredObject = imports.misc[requiredFilename][requiredObjectName];
        }
    }

    if (!isGi && !isMisc) {
        imports.searchPath.unshift(_requirePath);
        if (!requiredFilename) {
            requiredObject = imports[requiredObjectName];
        } else {
            requiredObject = imports[requiredFilename][requiredObjectName];
        }
        imports.searchPath.shift(); // clean up and don't pollute search path.
    }


    return requiredObject;
}

require.pwd = pwd;

window.require = require;