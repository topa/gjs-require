imports.require.injectGlobal();

const Require = imports.require;
const JSUnit = require("jsUnit");

function test_sanity() {
    JSUnit.assertTrue("It should expose JSUnit's gjstestRun", typeof JSUnit.gjstestRun == "function");
    JSUnit.assertTrue("It should expose JSUnit's .isBlank()", JSUnit.isBlank(""));
    JSUnit.assertEquals("It should expose JSUnit's .trim()", JSUnit.trim(" A "), "A");
}

function test_injectGlobal() {
    JSUnit.assertEquals("It should be the same require", Require.require, require);
    JSUnit.assertEquals("It should be the same pwd", Require.dirname, dirname);
    JSUnit.assertEquals("It should be the same dir name", __dirname, Require.dirname());
}

function test_dirname() {
    let expectedPathSplitter = "gjs-require/test/";
    let pwdLength = dirname().length;
    let index = dirname().search(expectedPathSplitter);
    let expectedIndex = pwdLength - expectedPathSplitter.length;

    JSUnit.assertEquals("It should be 'gjs-require/test/'", index, expectedIndex);
}

function test___dirname() {
    let expectedPathSplitter = "gjs-require/test/";
    let dirnameLength = __dirname.length;
    let index = __dirname.search(expectedPathSplitter);
    let expectedIndex = dirnameLength - expectedPathSplitter.length;

    JSUnit.assertEquals("It should be 'gjs-require/test/'", index, expectedIndex);
}


function test_require_sibling() {
    let siblingPath = require(__dirname, "siblingModule").whereAreYou();
    JSUnit.assertEquals("It should require siblings", siblingPath, __dirname);
}

function test_require_sibling_with_dot_slash() {
    let siblingPath = require(__dirname, "./siblingModule").whereAreYou();
    JSUnit.assertEquals("It should require siblings defined relative to __driname", siblingPath, __dirname);
}

function test_require_sibling_with_js_postfix() {
    let siblingPath = require(__dirname, "siblingModule.js").whereAreYou();
    JSUnit.assertEquals("It should require siblings with '.js' as postfix", siblingPath, __dirname);
}

function test_require_from_child_folder() {
    let childPath = require(__dirname, "child/module").whereAreYou();
    JSUnit.assertEquals("It should require child modules", childPath, __dirname + "child/");
}

function test_require__from_child_folder_with_dot_slash() {
    let childPath = require(__dirname, "./child/module").whereAreYou();
    JSUnit.assertEquals("It should require child modules defined relative to __dirname", childPath, __dirname + "child/");
}

function test_require_from_child_folder_with_dot_slash_and_js_postfix() {
    let childPath = require(__dirname, "./child/module.js").whereAreYou();
    JSUnit.assertEquals("It should require child modules with '.js' as postfix", childPath, __dirname + "child/");
}

function test_require_from_parent_folder() {
    let parentPath = require(__dirname, "../parentModule").whereAreYou();
    JSUnit.assertEquals("It should require modules from a parent folder", parentPath, __dirname.replace("test/", ""));
}

function test_require_from_parent_folder_with_dot_slash() {
    let parentPath = require(__dirname, "./../parentModule").whereAreYou();
    JSUnit.assertEquals(
        "It should require modules from parent folder defined relative to __dirname",
        parentPath,
        __dirname.replace("test/", "")
    );
}

function test_require_from_parent_folder_with_dot_slash_and_js_as_postfix() {
    let parentPath = require(__dirname, "./../parentModule.js").whereAreYou();
    JSUnit.assertEquals(
        "It should require parent modules with '.js' as postfix",
        parentPath, __dirname.replace("test/", "")
    );
}

function test_require_global_module_lang() {
    JSUnit.assertNotUndefined("It should require global module lang", require("lang").Class);
}

function test_require_global_module_mainloop() {
    JSUnit.assertTrue("If should require global module mainloop", typeof require("mainloop").timeout_add == "function");
}

function test_require_global_module_gi() {
    JSUnit.assertNotUndefined("It should require global module gi", require("gi").Soup);
}

function test_require_gi_GObject() {
    JSUnit.assertNotUndefined("It should require global module gi.GObject", require("gi/GObject").Class);
}

function test_require_gi_Gio() {
    JSUnit.assertTrue(
        "It should require global module go.Gio.SettingsSchemaSource",
        typeof require("gi/Gio/SettingsSchemaSource").get_default == "function"
    );
}

function test_require_gi_Gtk() {
    JSUnit.assertTrue(
        "It should require global module gi.Gtk.IconTheme.get_default()",
        typeof require("gi/Gtk/IconTheme").get_default == "function"
    );
}

function tearDown() {
    imports.searchPath = [];
}

JSUnit.gjstestRun(this, JSUnit.setUp, tearDown);