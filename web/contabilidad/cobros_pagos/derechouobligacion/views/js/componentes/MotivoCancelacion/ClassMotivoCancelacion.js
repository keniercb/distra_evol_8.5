Ext.namespace('Ext.ClassMotivoCancelacion');
Ext.ClassMotivoCancelacion = Ext.extend(Ext.Component, {
    lmask: undefined,
    url: '',
    ventana: undefined,
    constructor: function(params)
    {

        this.url = params.url;
        this.pregunta = params.pregunta;
        this.numero = params.numero;
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        perfil = window.parent.perfil;
        var scope = this;

        this.stMotivoCancelacion = new Ext.data.Store({
            url: 'cargarMotivoCancelacion',
            autoload: false,
            reader: new Ext.data.JsonReader({
                root: 'motivos',
                idProperty: 'idmotivocancelacion',
            }, [
                {
                    name: 'idmotivocancelacion'
                },
                {
                    name: 'descripcion'
                },
            ]),
        });

        scope.loadMessageBox();
        if (!document.getElementById('UIMotivoCancelacion')) {
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/MotivoCancelacion/UIMotivoCancelacion", 'UIMotivoCancelacion', function () {
                scope.inicializar();
            });
        } else {
            scope.inicializar();
        }

        return Ext.ClassMotivoCancelacion.superclass.constructor.call(this);
    },
    loadJs: function (jsSrc, id = null, onload = function () {}) {
        if (jsSrc != null) {
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
    loadMessageBox: function (msg = 'Cargando...', title = 'Por favor espere...') {
        Ext.MessageBox.show({
            title: title,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function (v) {
            return function () {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    },
    loadMask: function (message) {
        this.lmask = new Ext.LoadMask(Ext.getBody(), {
            msg: message
        }).show();
    },
    inicializar: function ()
    {
        this.ventana = new Ext.UIMotivoCancelacion.WindowUIMotivoCancelacion({
            url: this.url,
            pregunta: this.pregunta,
            numero: this.numero,
            store: this.stMotivoCancelacion
        });
        this.loadDataComponent(this);
    },
    loadDataComponent: function(scope)
    {
        Ext.Ajax.request({
            method: "POST",
            url: this.url + "motivocancelacion",
            callback: function (options, success, response) {
                var motivos = Ext.decode(response.responseText);
                scope.stMotivoCancelacion.loadData(motivos);
                scope.initializeClass();
                Ext.MessageBox.hide();
                scope.ventana.show();
            }
        });
    },
    initializeClass: function () {
        this.initializeEvents(this);
        this.initializeFunctions(this);
    },
    initializeEvents: function(scope)
    {
        scope.addEvents('motivocancelacion');

        scope.ventana.on('motivocancelacion', function (idmotivo, motivo) {
            scope.fireEvent('motivocancelacion', idmotivo, motivo);
            scope.ventana.close();
        });

        scope.addEvents('close');

        scope.ventana.on('close', function (idmotivo, motivo) {
            scope.fireEvent('close', idmotivo, motivo);
        });
    },
    initializeFunctions: function(scope)
    {

    }
});