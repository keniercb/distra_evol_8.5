window.Ax = window.Ax ? window.Ax : {};
Ax.env = 'dev';
Ax.isExt = false;
Ax.lang = {
    defaultLang: 'es',
    es: {
        confirm: 'Confirmacion',
        needUpgrade: 'La librería HighchartsJS necesita ser actualizada para un funcionamiento óptimo del componente. Desea actualizarla?'
    },
    en: {
        confirm: 'Confirm',
        needUpgrade: 'The HighchartsJS library needs to be updated for optimal operation of the component. Do you autorize that?'
    }
}
Ax.Highcharts = {
    version: '4.2.3',
    jquery: {
        version: "2.2.2"
    },
    upgrade: function(fn){
        var FileLocation = Ax.servicesLocation + 'lib/highcharts/upgrade.js';
        Ax.includeJs(FileLocation, fn);
    },
    exist: function () {
        return (window.Highcharts && typeof window.Highcharts == 'object') ? true : false;
    },
    needUpgrade: function (version) {
        if(!version){
            return false;
        }
        var currentVersion = version.split('.');
        var requiredVersion = Ax.Highcharts.version.split('.');
        return parseFloat(requiredVersion.join('')) > parseFloat(currentVersion.join(''));
    },
    prepareUpgrade: function () {
        window.HighchartsOldestVersion = Ax.Highcharts.getCurrentVersion();
        window.Highcharts = undefined;
    },
    getCurrentVersion: function () {
        return window.Highcharts;
    },
    getOlderVersion: function () {
        return window.HighchartsOldestVersion;
    },
    revert: function () {
        if (window.HighchartsOldestVersion) {
            window.Highcharts = Ax.Highcharts.getOlderVersion();
            window.HighchartsOldestVersion = undefined;
            Ax.Highcharts.version = window.Highcharts.version;
        }
        return window.Highcharts;
    }
}
Ax.dependencies = 0;
Ax.ReadyFunctions = [];
Ax.servicesLocation = document.currentScript.src.replace('core.js', '');
Ax.ns = function (namespace) {
    var names = namespace.split('.');
    if (!window[names[0]]) {
        window[names[0]] = {};
    }
    var baseNs = window[names[0]];
    for (var i = 1; i < names.length; i++) {
        if (!baseNs[names[i]]) {
            baseNs[names[i]] = {};
        }
        baseNs = baseNs[names[i]];
    }
    return baseNs;
}
Ax.onReady = function (fn, extIntegration, skipUpgrade, skipHighchartsInclusion) {
    extIntegration = window.Ext && typeof window.Ext == 'object';
    if (typeof  fn == 'function') {
        if (!skipUpgrade && Ax.Highcharts.exist()) {
            if (Ax.Highcharts.needUpgrade(window.Highcharts.version)) {
                Ax.EventManager.trigger('ax.need-upgrade', {
                    currentVersion: window.Highcharts.version,
                    upgradeVersion: Ax.Highcharts.version
                });
                Ax.confirm(Ax.lang[Ax.lang.defaultLang]['confirm'], Ax.lang[Ax.lang.defaultLang]['needUpgrade'], function () {
                    Ax.Highcharts.prepareUpgrade();
                    Ax.onReady(fn, extIntegration, true);
                }, function () {
                    Ax.Highcharts.version = window.Highcharts.version;
                    Ax.onReady(fn, extIntegration, true, true);
                });
                return true;
            }else{
                Ax.Highcharts.prepareUpgrade();
            }
        }
        if (extIntegration) {
            Ax.isExt = true;
        } else {
            Ax.isExt = false;
        }
        Ax.ReadyFunctions.push(fn);
        if (!skipHighchartsInclusion) {
            if (Ax.isExt) {
                Ax.includeJs(Ax.servicesLocation + 'services/ax-ext-chart-services.js');
            } else {
                Ax.includeJs(Ax.servicesLocation + 'services/ax-chart-services.js');
            }
        } else {
            if (Ax.Highcharts.exist()) {
                if (Ax.isExt) {
                    Ax.includeJs(Ax.servicesLocation + 'services/ax-ext-chart-services-no-highcharts.js');
                } else {
                    Ax.includeJs(Ax.servicesLocation + 'services/ax-chart-services-no-highcharts.js');
                }
            }
        }
    }
    if (Ax.dependencies == 0) {
        Ax.ready = true;
        while (Ax.ReadyFunctions[0]) {
            var fnExec = Ax.ReadyFunctions.pop();
            if (Ax.isExt) {
                Ext.onReady(function () {
                    fnExec();
                });
            } else {
                fnExec();
            }
        }
    }
}
Ax.ReadyExecution = function () {
    Ax.dependencies--;
    Ax.onReady();
}
Ax.includeJs = function (file, onloadFn) {
    var type = 'script';
    var jsElement = document.createElement(type);
    jsElement.src = file;
    if (onloadFn && typeof onloadFn == 'function') {
        jsElement.onload = function () {
            onloadFn();
            Ax.ReadyExecution();
        };
    } else {
        jsElement.onload = function () {
            Ax.ReadyExecution();
        };
        jsElement.onerror = function () {
            Ax.ReadyExecution();
        };
    }
    Ax.dependencies++;
    document.body.appendChild(jsElement);
}
Ax.includeCss = function (file) {
    var type = 'link';
    var cssElement = document.createElement(type);
    cssElement.href = file;
    cssElement.rel = "stylesheet";
    cssElement.type = "text/css";
    cssElement.media = "screen";
    document.body.appendChild(cssElement);
}

Ax.isDate = function (value) {
    var dateFormat;
    if (value) {
        if (toString.call(value) === '[object Date]') {
            return true;
        }
        if (typeof value.replace === 'function') {
            value.replace(/^\s+|\s+$/gm, '');
        }
        dateFormat = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
        return dateFormat.test(value);
    }
    return false;
}

Ax.isNumber = function (value) {
    return !isNaN(parseFloat(value)) && !Ax.isDate(value);
}

Ax.isString =  function(object) {
    return typeof object == "string";
};

Ax.parseDate = function (date, format) {
    moment.locale(Ax.Charts.chartDefaultOptions.locale)
    if (typeof date !== 'string') {
        return date.format(format);
    } else {
        date = moment(date, Ax.Charts.chartDefaultOptions.dateFormat);
        return Ax.parseDate(date, format);
    }
}

Ax.EventManager = {
    events: {},
    on: function (name, fn) {
        if (!Ax.EventManager.events[name]) {
            Ax.EventManager.events[name] = [];
        }
        if (typeof fn == 'function') {
            Ax.EventManager.events[name].push(fn);
        }
    },
    trigger: function (eventName, params) {
        if (Ax.EventManager.events[eventName]) {
            for (var i = 0; i < Ax.EventManager.events[eventName].length; i++) {
                if (typeof Ax.EventManager.events[eventName][i] == 'function') {
                    if (Ax.EventManager.events[eventName][i](params) === false) {
                        return false;
                    }
                }
            }
        }
    }
}

Ax.apply = function (baseObject, objectToApply) {
    if (!baseObject) {
        baseObject = {};
    }
    if (baseObject && typeof baseObject == 'object') {
        if (objectToApply && typeof objectToApply == 'object') {
            for (var i in objectToApply) {
                if (i != 'length') {
                    baseObject[i] = objectToApply[i];
                }
            }
        }
    }
    return baseObject;
}

Ax.clone = function(baseObject, objectToApply){
    if (!baseObject) {
        baseObject = {};
    }
    if (baseObject && typeof baseObject == 'object') {
        if (objectToApply && typeof objectToApply == 'object') {
            for (var i in objectToApply) {
                if (i != 'length') {
                    baseObject[i] = Ax.getVal(objectToApply, i);
                }
            }
        }
    }
    return baseObject;
}

Ax.getVal = function(object, property){
    if(object && typeof object == 'object'){
        return object[property];
    }
    return undefined;
}

Ax.throwError = function (error, errorObject) {
    Ax.EventManager.trigger('ax-chart-error', errorObject);
    Ax.EventManager.trigger('ax-' + error, errorObject);
    return true;
}

Ax.confirm = function (title, message, okFn, cancelFn) {
    if (window.Ext) {
        Ext.Msg.confirm(title, message, function (btn, text) {
            if (btn == 'yes') {
                if (typeof okFn == 'function') {
                    okFn();
                }
            } else {
                if (typeof cancelFn == 'function') {
                    cancelFn();
                }
            }
        });
    } else {
        var confirmAction = window.confirm(message);
        if (confirmAction) {
            if (typeof okFn == 'function') {
                okFn();
            }
        } else {
            if (typeof cancelFn == 'function') {
                cancelFn();
            }
        }
    }
}
