imports.require.injectGlobal();

const Require = imports.require;
const JSUnit = require("jsUnit");

function testSanity() {
    JSUnit.assertTrue("It should expose JSUnit's gjstestRun", typeof JSUnit.gjstestRun == "function");
    JSUnit.assertTrue("It should expose JSUnit's .isBlank()", JSUnit.isBlank(""));
    JSUnit.assertEquals("It should expose JSUnit's .trim()", JSUnit.trim(" A "), "A");
}

function testInjectGlobal() {
    JSUnit.assertEquals("It should be the same require", Require.require, require);
    JSUnit.assertEquals("It should be the same pwd", Require.pwd, pwd);
    JSUnit.assertEquals("It should be the same dir name", __dirname, Require.pwd());
}

function testPwd() {
    let expectedPathSplitter = "gjs-require/test/";
    let pwdLength = pwd().length;
    let index = pwd().search(expectedPathSplitter);
    let expectedIndex = pwdLength - expectedPathSplitter.length;

    JSUnit.assertEquals("It should be 'gjs-require/test/'", index, expectedIndex);
}

function test__dirname() {
    let expectedPathSplitter = "gjs-require/test/";
    let dirnameLength = __dirname.length;
    let index = __dirname.search(expectedPathSplitter);
    let expectedIndex = dirnameLength - expectedPathSplitter.length;

    JSUnit.assertEquals("It should be 'gjs-require/test/'", index, expectedIndex);
}


function testRequireSibling() {
    let origin = require(__dirname, "siblingDummy").whereAreYou();
    JSUnit.assertEquals("It should import siblings", origin, "sibling");
}

function testRequireSiblingDotSlash() {
    let origin = require(__dirname, "./siblingDummy").whereAreYou();
    JSUnit.assertEquals("It should import siblings", origin, "sibling");
}

function testRequireSiblingJSPostfix() {
    let origin = require(__dirname, "siblingDummy.js").whereAreYou();
    JSUnit.assertEquals("It should import siblings", origin, "sibling");
}

function testRequireInChildFolder() {
    let origin = require(__dirname, "childfolder/childFolderDummy").whereAreYou();
    JSUnit.assertEquals("It should import siblings", origin, "child");
}

function testRequireInChildFolderDotSlash() {
    let origin = require(__dirname, "./childfolder/childFolderDummy").whereAreYou();
    JSUnit.assertEquals("It should import siblings", origin, "child");
}

function testRequireInChildFolderDotSlashJSPostfix() {
    let origin = require(__dirname, "./childfolder/childFolderDummy.js").whereAreYou();
    JSUnit.assertEquals("It should import siblings", origin, "child");
}

function testRequireInParentFolder() {
    let origin = require(__dirname, "../parentDummy").whereAreYou();
    JSUnit.assertEquals("It should import siblings", origin, "parent");
}


function testRequireInParentFolderDotSlash() {
    let origin = require(__dirname, "./../parentDummy").whereAreYou();
    JSUnit.assertEquals("It should import siblings", origin, "parent");
}

function testRequireInParentFolderDotSlashJSPostfix() {
    let origin = require(__dirname, "./../parentDummy.js").whereAreYou();
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