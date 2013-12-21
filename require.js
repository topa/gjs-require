
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
const dirname = function () {
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
};

/**
 * @param {string} searchPath
 * @param {string} requirePath
 * @returns {*}
 * @throws Error
 */
const require = function(searchPath, requirePath) {
    let splitRequirePath;
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

        let hasJSPostfix = requirePath.search(".js") > -1;

        if (!hasJSPostfix) {
            requirePath += ".js";
        }

        let fileOrFolder = _createFile(searchPath, requirePath);

        if (_exists(fileOrFolder) && _isFileOrFolder(fileOrFolder)) {
            let fileOrFolderPath = fileOrFolder.get_path();

            splitRequirePath = fileOrFolderPath.split("/");
            requireFileName = splitRequirePath.pop();
            requireFileName = requireFileName.replace(".js", "");
            searchPath = splitRequirePath.join("/");
        }

        imports.searchPath.unshift(searchPath);

        required = imports[requireFileName];

        imports.searchPath.shift();

        return required;
    }

    throw new Error("(require) Unable to require "+searchPath + requirePath+". File not found or no global module.");
};

/**
 * Injects a magic var __dirname, dirname and require to window/global;
 */
const injectGlobal = function() {

    Object.defineProperty(window, "__dirname", {
        get: dirname,
        enumerable: false,
        configurable: false
    });

    window.dirname = dirname;

    window.require = require;
};

/**
 * @param {string} searchPath
 * @param {string} requirePath
 * @returns {Gio.File}
 * @protected
 */
function _createFile(searchPath, requirePath) {
    let file = Gio.File.new_for_path(searchPath + "/" + requirePath);

    return file;
}

/**
 * @TODO Add link to Gio.FileType-consts
 * @param {Gio.File} fileOrFolder
 * @returns {number}
 * @protected
 */
function _getFileType(fileOrFolder) {
    let fileInfo = fileOrFolder.query_info('standard::type', Gio.FileQueryInfoFlags.NONE, null);
    let fileType = fileInfo.get_file_type();

    return fileType;
}

/**
 * @param {Gio.File} file
 * @returns {boolean}
 * @protected
 */
function _isFileOrFolder(file) {
    let fileType = _getFileType(file);
    let isFileOrFolder = ((fileType === Gio.FileType.REGULAR) || (fileType === Gio.FileType.DIRECTORY));

    return isFileOrFolder;
}

/**
 * @param {Gio.File} fileOrFolder
 * @returns {boolean}
 * @protected
 */
function _exists(fileOrFolder) {
    let exists = fileOrFolder.query_exists(null);

    return exists;
}