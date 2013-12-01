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

At this stage this small lib is very very very hacky, under heavy development and still a prove of concept. It is quite likely that gjs-require won't work for your extension. However it works for us here: https://github.com/topa/gignx.
Please note that it is quite possible if you use gjs-require your extension will be rejected if. If you give it a try, please let us know.

How to use
==========

Import gjs-require in the very first line of each script which lies under your extensions root folder, e.g. extension.js, prefs.js or each script that maybe used as entry-point.
gjs.require will be injected in global namespace and you can just write <code>require("./lib/bli/bla/blub")</code>;

```
imports.misc.extensionUtils.getCurrentExtension().imports.require;

const Gio = require("gi/Gio");
const Soup = require("gi/Soup");

const Lang = require("lang");

const parseParams = require("misc/params/parse");
const ExtensionUtils = require("misc/extensionUtils");

// ...

```

Quirks
======

- require.js must be placed in extenion's rool folder like extension.js.
