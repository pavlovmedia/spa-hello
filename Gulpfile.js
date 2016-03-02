'use strict';

var gulp = require('gulp');
var requireDir = require('require-dir');

global.projectOverrides = {
    title: 'Hello Example',
    htmlLanguage: 'en',
    htmlCharset: 'UTF-8',
    projectVersion: '1.0.0-SNAPSHOT',
    ngBrowserifyDeps: []
};

requireDir('node_modules/swf-ng-kit/src/gulp/tasks');
requireDir('node_modules/swf-swagger-kit/gulp');