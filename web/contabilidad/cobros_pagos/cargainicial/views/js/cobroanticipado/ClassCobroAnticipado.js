Ext.namespace('Ext.ClassCobroAnticipadoCI');
Ext.ClassCobroAnticipadoCI = Ext.extend(Ext.Component,
    {
        objCobroAnticipadoCI : undefined,
        url: '/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/Anticipo/GestionarAnticipo/',
        constructor : function()
        {
            Ext.QuickTips.init();
            Ext.Ajax.timeout = 6000000;
            this.loadJsArray([
                this.url + 'ModelGestionarAnticipo',
                this.url + 'ViewGestionarAnticipo',
                this.url + 'ControllerGestionarAnticipo',
            ], false);
            var parametros = {
                url: this.url,
                loadJs: this.loadJs,
                loadJsArray: this.loadJsArray,
                loadJsSync: this.loadJsSync,
                tipoDuo: 3,
                flujoNormal: 0,
            };
            this.objCobroAnticipadoCI = new Ext.GestionarAnticipo.Controller(parametros);
        },
        loadJs: function (jsSrc, id = null, onload = function () {}) {
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
        loadJsArray: function (jsSrc, async = true) {
            if (jsSrc instanceof Array) {
                jsSrc.forEach(function (item, index, array) {
                    if (typeof item === 'string') {
                        if (async === true) {
                            this.loadJs(item);
                        } else {
                            this.loadJsSync(item);
                        }
                    }
                }, this);
            }
        },
        loadJsSync: function (jsSrc, id = null) {
            var req = new XMLHttpRequest();
            req.open("GET", jsSrc + ".js", false);
            req.send(null);

            var headElement = document.getElementsByTagName("head")[0];
            var newScriptElement = document.createElement("script");
            newScriptElement.setAttribute("type", "text/javascript");
            if (id != null) {
                newScriptElement.setAttribute("id", id);
            }
            newScriptElement.text = req.responseText;
            headElement.appendChild(newScriptElement);
        }
    });

new Ext.ClassCobroAnticipadoCI();