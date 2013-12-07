
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
    "ui/status": "/usr/share/gnome-shell/js/ui/",
    "tweener": "/usr/share/gjs-1.0/",
    "cairo": "/usr/share/gjs-1.0/",
    "format": "/usr/share/gjs-1.0/",
    "getttext": "/usr/share/gjs-1.0/",
    "jsUnit": "/usr/share/gjs-1.0/",
    "lang": "/usr/share/gjs-1.0/",
    "mainloop": "/usr/share/gjs-1.0/",
    "promise": "/usr/share/gjs-1.0/",
    "signals": "/usr/share/gjs-1.0/"
};


let globalLibs = [
    "gi", "extensionPrefs", "gdm", "misc", "perf", "ui/components", "ui/status", "ui",
    "tweener", "cairo", "format", "getttext", "jsUnit", "lang", "mainloop", "promise", "signals" // /usr/share/gjs-1.0/
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

    return file.get_parent().get_path() + "/";
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
 * @param {string} searchPath
 * @param {string} requirePath
 * @returns {string}
 */
function resolvePath(searchPath, requirePath) {
//    let isPwd = path.search(__dirname) === 0;

//    if (isPwd) {
//        path = path.replace(__dirname, "");
//    }

    return Gio.File.new_for_path(searchPath+"/"+requirePath).get_path();
}

/**
 * @param {string} searchPath
 * @param {string} requirePath
 * @returns {*}
 * @throws Error
 */
function require(searchPath, requirePath) {
    let splitRequirePath;
    let requiredName;
    let requireFileName;
    let required;
    let isGlobalModule;

    if (!requirePath && searchPath) {
        isGlobalModule = true;
        requirePath = searchPath;
    }

    if (isGlobalModule) {

        splitRequirePath = requirePath.split("/");
        let currentSplitterName = splitRequirePath[0];

        // create search path
        searchPath = gnomeShellJSLibs[currentSplitterName];

        // temporary add searchPath of required
        imports.searchPath.unshift(searchPath);

        required = imports[currentSplitterName];
        for (let i = 1; splitRequirePath.length > i; i++) {
            currentSplitterName = splitRequirePath[i];
            required = required[currentSplitterName];
        }

        // clean up searchPath
        imports.searchPath.shift();

        return required;
    }

    if (!isGlobalModule) {

        // /home/topa/Workspace/gjs-require/node_modules/grunt/lib/grunt/cli/myModule
        // /home/topa/Workspace/gjs-require/node_modules/grunt/lib/grunt/cli
        // /home/topa/Workspace/gjs-require/node_modules/grunt/lib/grunt/cli.js
        // /home/topa/Workspace/gjs-require/node_modules/grunt/lib/grunt/folder1/folder2

        let hasJSPostfix = requirePath.search(".js") > -1;

        if (!hasJSPostfix) {
            requirePath += ".js";
        }

        let requiredFileOrFolder = Gio.File.new_for_path(searchPath + "/" + requirePath);
        let fullRequirePath = requiredFileOrFolder.get_path();
        let isFolder;
        let isFile;
        let isModule;

        splitRequirePath = fullRequirePath.split("/");

        if (requiredFileOrFolder.query_exists(null)) {
            let requiredInfo = requiredFileOrFolder.query_info('standard::type', Gio.FileQueryInfoFlags.NONE, null);
            let fileType = requiredInfo.get_file_type();

            isFile = fileType === Gio.FileType.REGULAR;
            isFolder = fileType === Gio.FileType.DIRECTORY;
        } else {
            // module or does not exist
            let tmpSplitRequirePath = Array.prototype.slice.call(fullRequirePath, 0);
            tmpSplitRequirePath.pop();
            let tmoFullRequirePath = tmpSplitRequirePath.join("/");
            let tmpRequiredFileOrFolder =  Gio.File.new_for_path(tmoFullRequirePath);

            if (tmpRequiredFileOrFolder.query_exists(null)) {
                isModule = true;
            } else {
                throw new Error("Does not exists");
            }
        }


        if (isModule) {
            requiredName = splitRequirePath.pop();
            requireFileName = splitRequirePath.pop().replace(".js", "");
            searchPath = splitRequirePath.join("/");
        }

        if (isFile || isFolder) {
            requireFileName = splitRequirePath.pop().replace(".js", "");
            searchPath = splitRequirePath.join("/");
        }

        imports.searchPath.unshift(searchPath);

        if (isModule) {
            required = imports[requireFileName][requiredName];
        } else {
            required = imports[requireFileName];
        }

        imports.searchPath.shift();

        return required;
    }

    throw new Error("(require) Unable to require "+requirePath+". File not found or no global module.");
}

require.pwd = pwd;

Object.defineProperty(window, "__dirname", {
    get: pwd,
    enumerable: false,
    configurable: false
});

window.require = require;