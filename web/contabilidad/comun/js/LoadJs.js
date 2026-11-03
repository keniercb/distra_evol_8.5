var requireJS = {
    loadJs: function (jsSrc, id = null, onload = function () {}) {
        if (id ? document.getElementById(id) : false) {
            if (typeof onload === 'function') {
                onload.call();
            }
            return;
        }
        if (typeof jsSrc === 'string') {
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            if (id != null) {
                tagScript.setAttribute("id", id);
            }
            tagScript.setAttribute("src", jsSrc + ".js");
            tagScript.onload = onload;
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    },
    loadJsArray: function (jsSrc, callbackFunction) {
        if (jsSrc instanceof Array) {
            jsSrc.sort(function (a, b) {
                if (typeof a.async === 'undefined' && typeof b.async === 'undefined') {
                    return 0;
                } else if (a.async === b.async) {
                    return 0;
                } else if (a.async === false && (typeof b.async === 'undefined' || b.async === true)) {
                    return 1;
                } else if (b.async === false && (typeof a.async === 'undefined' || a.async === true)) {
                    return -1;
                }
                return 0;
            });
            var fn;
            if (typeof callbackFunction === 'function') {
                var cantidadJs = jsSrc.length;
                var cantidadJsCargados = 0;
                fn = callbackFunction.createInterceptor(function () {
                    cantidadJsCargados++;
                    if (cantidadJsCargados === cantidadJs) {
                        return true;
                    } else {
                        return false;
                    }
                }, this);
            }
            jsSrc.forEach(function (item, index, array) {
                if (typeof item.url === 'string' && (typeof item.id === 'string' || typeof item.id === 'undefined')) {
                    if (typeof item.async === 'undefined' || item.async) {
                        this.loadJs(item.url, item.id, fn);
                    } else {
                        this.loadJsSync(item.url, item.id, fn);
                    }
                }
            }, this);
        }
    },
    loadJsSync: function (jsSrc, id = null, onload = function () {}) {
        if (id ? document.getElementById(id) : false) {
            if (typeof onload === 'function') {
                onload.call();
            }
            return;
        }
        var req = new XMLHttpRequest();
        req.open("GET", jsSrc + ".js", false);
        req.onload = onload;
        req.send(null);
        if (req.status === 200) {
            var headElement = document.getElementsByTagName("head")[0];
            var newScriptElement = document.createElement("script");
            newScriptElement.setAttribute("type", "text/javascript");
            if (id != null) {
                newScriptElement.setAttribute("id", id);
            }
            newScriptElement.text = req.responseText;
            headElement.appendChild(newScriptElement);
        }
    }
};
