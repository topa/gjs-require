imports.require;
const JSUnit = require("jsUnit");

function setUp() {

}

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

function tearDown() {

}

JSUnit.gjstestRun(this, setUp, tearDown);