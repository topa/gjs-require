gjs-require
===========

node-like require for gjs/gnome-shell-extensions

Motivation
===============
We're currently writing an extension ([gignx](https://github.com/topa/gignx)) for the great gnome-shell. But we dislike <code>imports</code> and <code>misc.extensionUtils.getCurrentExtension()</code> because it
 - feels weird
 - encourages heavy, long, unreadable and unmaintainable files
 - makes structuring of your extension unnecessary hard
 - has no IDE-Support

But for us the most important reason: We need to run code idependently from extension context, so that we can create automated unit-tests.

Important Notes
===============

At this stage this small lib is very hacky and under heavy development. It is still possible that gjs-require won't work for your extension. However it works for us here: https://github.com/topa/gignx.
Please note that we don't know in case you use gjs-require in your extension if it could be rejected. Give it a try, and let us know.

How to use
==========

Import gjs-require in the very first line of each script which lies under your extensions root folder, e.g. extension.js, prefs.js or each script that maybe used as entry-point.
gjs.require will be injected in global namespace and you can just write <code>require("./lib/bli/bla/blub")</code>;

```javascript
imports.misc.extensionUtils.getCurrentExtension().imports.require;

const Gio = require("gi/Gio");
const Soup = require("gi/Soup");

const Lang = require("lang");

const parseParams = require("misc/params/parse");
const ExtensionUtils = require("misc/extensionUtils");


const ChildClass = require(__dirname + "./child/class");
const ParentClass = require(__dirname + "../../parent/class);
const SiblingClass = require(__dirname + "./class")


```

Running tests
=============

You need [node](http://nodejs.org/) and [npm](https://npmjs.org/) (which is part of node). Then run <code>npm install</code> which will install some grunt-tasks locally.
You need also to install grunt-cli globally: <code> npm install -g grunt-cli</code>.

``` shell

grunt watch-test

```


Quirks
======

- gjs-require must be placed in extenion's rool folder like extension.js.
- It is not really possible to require relative. You will always need <code>__dirname</code>. However writing a require path like this <code>require(__dirname + "../relative")</code> is supported.
