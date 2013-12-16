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
    JSUnit.assertEquals("It should import siblings", siblingPath, __dirname);
}

function test_require_sibling_with_dot_slash() {
    let siblingPath = require(__dirname, "./siblingModule").whereAreYou();
    JSUnit.assertEquals("It should import siblings defined relative to __driname", siblingPath, __dirname);
}

function test_require_sibling_with_js_postfix() {
    let siblingPath = require(__dirname, "siblingModule.js").whereAreYou();
    JSUnit.assertEquals("It should import siblings with '.js' as postfix", siblingPath, __dirname);
}

function test_require_from_child_folder() {
    let childPath = require(__dirname, "child/module").whereAreYou();
    JSUnit.assertEquals("It should import childs", childPath, __dirname + "child/");
}

function test_require__from_child_folder_with_dot_slash() {
    let childPath = require(__dirname, "./child/module").whereAreYou();
    JSUnit.assertEquals("It should import childs", childPath, __dirname + "child/");
}

function test_require_from_child_folder_with_dot_slash_and_js_postfix() {
    let childPath = require(__dirname, "./child/module.js").whereAreYou();
    JSUnit.assertEquals("It should import childs", childPath, __dirname + "child/");
}

function testRequireInParentFolder() {
    let origin = require(__dirname, "../parentModule").whereAreYou();
    JSUnit.assertEquals("It should import siblings", origin, "parent");
}


function testRequireInParentFolderDotSlash() {
    let origin = require(__dirname, "./../parentModule").whereAreYou();
    JSUnit.assertEquals("It should import siblings", origin, "parent");
}

function testRequireInParentFolderDotSlashJSPostfix() {
    let origin = require(__dirname, "./../parentModule.js").whereAreYou();
    JSUnit.assertEquals("It should import siblings", origin, "parent");
}

function testRequireLang() {
    JSUnit.assertNotUndefined("It should import lang", require("lang").Class);
}

function testRequireMainloop() {
    JSUnit.assertTrue("If should import mainloop", typeof require("mainloop").timeout_add == "function");
}

function testRequireGi() {
    JSUnit.assertNotUndefined("It should import gi", require("gi").Soup);
    JSUnit.assertNotUndefined("It should import gi", require("gi").Gtk);
}

function testRequireGiGObject() {
    JSUnit.assertNotUndefined("It should import gi.GObject", require("gi/GObject").Class);
}

function testRequireGiGio() {
    JSUnit.assertNotUndefined("It should import gi.Gio", require("gi/Gio"));
    JSUnit.assertTrue(
        "It should import go.Gio.SettingsSchemaSource",
        typeof require("gi/Gio/SettingsSchemaSource").get_default == "function"
    );
}

function testRequireGiGtk() {
    JSUnit.assertNotUndefined("It should import gi.Gtk", require("gi/Gtk").IconTheme);
    JSUnit.assertTrue(
        "It should import gi.Gtk.IconTheme.get_default()",
        typeof require("gi/Gtk/IconTheme").get_default == "function"
    );
}

function testRequireMisc() {
    JSUnit.assertNotUndefined("It should import misc", require("misc"));
    JSUnit.assertTrue("It should import misc.params.parse", typeof require("misc/params/parse") == "function");
    JSUnit.assertTrue("It should also import misc.params.parse", typeof require("misc/params").parse == "function");
}

function tearDown() {
    imports.searchPath = [];
}

JSUnit.gjstestRun(this, JSUnit.setUp, tearDown);