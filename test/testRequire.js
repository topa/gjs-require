imports.require;
const JSUnit = require("jsUnit");


function testSanity() {
    JSUnit.assertTrue("It should be a function", typeof JSUnit.gjstestRun == "function");
    JSUnit.assertTrue("It should expose JSUNit's .isBlank()", JSUnit.isBlank(""));
    JSUnit.assertEquals("It should expose JSUnit's .trim()", JSUnit.trim(" A "), "A");
}

function testPwd() {
    let expectedPathSplitter = "gjs-require/test";
    let pwd = require.pwd();
    let pwdLength = pwd.length;
    let index = pwd.search(expectedPathSplitter);
    let expectedIndex = pwdLength - expectedPathSplitter.length;

    JSUnit.assertEquals("It should be 'gjs-require/test'", index, expectedIndex);
}

// @TODO
function testRequireSibling() {
//    let origin = require("./test/siblingDummy").whereAreYou();
//    let origin = require("./siblingDummy").whereAreYou();
//    JSUnit.assertEquals("It should import siblings", origin, "sibling");
}

// @TODO
//function testRequireInChildFolder() {
//    let origin = require("./childfolder/childFolderDummy").whereAreYou();
//    JSUnit.assertEquals("It should import siblings", origin, "child");
//}

// @TODO
//function testRequireInParentFolder() {
//    let origin = require("../parentDummy").whereAreYou();
//    JSUnit.assertEquals("It should import siblings", origin, "parent");
//}

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

// @TODO Error: Requiring St, version none: Typelib file for namespace 'St' (any version) not found
//function testRequireGiSt() {
//    JSUnit.assertNotUndefined("It should import gi.St", require("gi/St").Side.Top);
//}

// @TODO Error: Requiring ShellJS, version none: Typelib file for namespace 'ShellJS' (any version) not found
function testRequireMisc() {
    JSUnit.assertNotUndefined("It should import misc", require("misc"));
    JSUnit.assertTrue("It should import misc.params.parse", typeof require("misc/params/parse") == "function");
    JSUnit.assertTrue("It should also import misc.params.parse", typeof require("misc/params").parse == "function");
//    JSUnit.assertTrue(
//        "It should import misc.extensionUtils",
//        typeof require("misc/extensionUtils/getCurrentExtension") == "function"
//    )
}

JSUnit.gjstestRun(this, JSUnit.setUp, JSUnit.tearDown);