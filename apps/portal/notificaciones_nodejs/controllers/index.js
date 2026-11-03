/**
 * Created by ariam on 6/06/14.
 */
var fs = require('fs'),
    models = require('../models'),
    lodash = require('lodash'),
    path = require('path'),
    Controllers = require('controllers-rep'),
    ctr = {}

var ctrs = new Controllers({
    classMethods: {

    }
});



fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach(function (file) {
        var controller = ctrs.importController(__dirname, file);
        ctr[controller.name] = controller
    });

Object.keys(ctr).forEach(function (ctrName) {
    if ('associate' in ctr[ctrName]) {
        var controllers = {}
        for (var controllerName in ctr) {
            if (controllerName != ctrName) {
                controllers[controllerName] = ctr[controllerName]
            }
        }
        ctr[ctrName].associate(controllers, models)
    }
});

module.exports = lodash.extend({
    ctrs: ctrs,
    Controllers: Controllers
}, ctr);
