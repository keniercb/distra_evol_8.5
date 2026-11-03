Ext.namespace('Ext.ImportOperEnzona');
Ext.ImportOperEnzona = Ext.extend(Ext.Component, {
    url: undefined,
    etiquetas: undefined,
    model: undefined,
    view: undefined,
    constructor: function(params)
    {
        this.crearSetsAndGets();
        this.initializeFunctions();
        this.setPerfil(window.parent.perfil);

        this.loadDataComponent(params);

        Ext.ImportOperEnzona.superclass.constructor.call(this);
        this.addEvents('extraido');
    },
    loadDataComponent: function(params)
    {
        this.winImportCmp = new SCFPrintData(new Object(), "/contabilidad/comun/SCFPrintView/", {
            reportType: "DISTRA_OPERACIONES_ENZONA",
            typeAction: 'import',

        }, /*{
            tools: [{
                id: 'search',
                qtip: 'Documentos enviados',
                handler: this.handlerTool
            }]
        }*/ {});
        var me = this;
        this.winImportCmp.fpPrintView.getForm().on({
            actioncomplete: function (form, action) {
            },
            actionfailed: function (form, action) {
                var respData = Ext.decode(action.response.responseText);
                if (respData.cod === 1) {
                    me.fireEvent('extraido', respData.datos);
                } else if (respData.cod === -1) {
                    mostrarMensaje(1, 'Algo paso.');
                } else if (respData.cod === -2) {
                    mostrarMensaje(1, 'No se obtenieron datos del excel.');
                }
                me.winImportCmp.close();
            }
        });
        this.winImportCmp.show();
        this.winImportCmp.doLayout();
        // winImportCmp.on({
        //     'show': function() {
        //         // self.map.disable();
        //     },
        //     'close': function() {
        //         //self.map.enable();
        //         // this.stRegistroComprobantes.load();
        //     }
        // });

        this.initializeClass();
    },
    initializeClass: function () {
        this.initializeEvents();
        this.initializeFunctions();
    },
    initializeEvents: function() {

    },
    initializeFunctions: function() {

        this.show = function () {
            // view.show();
        }

        this.funcionesGenerales = function () {
            this.loadMessageBox = function (msg = 'Cargando...', title = 'Por favor espere...') {
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
            };

            this.hideMessageBox = function () {
                Ext.MessageBox.hide();
            };

        };

        this.funcionesComponente = function () {
            this.handlerTool = function () {
                var a = new Ext.WinConfImportEnzona();
                a.show();
            };
        };

        this.funcionesGenerales.call(this);
        this.funcionesComponente.call(this);
    },
    crearSetsAndGets: function () {

        this.setFechasPeriodoContable = function (fechaInicial, fechaActual, fechaFin) {
            this.fechaInicioPeriodo = fechaInicial;
            this.fechaContablePeriodo = fechaActual;
            this.fechaFinPeriodo = fechaFin;
        };

        this.getPeriodoConFechaInicial = function () {
            return this.fechaInicioPeriodo;
        };

        this.getPeriodoConFechaActual = function () {
            return this.fechaContablePeriodo;
        };

        this.getPeriodoConFechaFin = function () {
            return this.fechaFinPeriodo;
        };

        this.setEtiquetas = function (etiquetas) {
            this.etiquetas = etiquetas;
        };

        this.getEtiquetas = function () {
            return this.etiquetas;
        };

        this.setUrl = function (url) {
            this.url = url;
        };

        this.getUrl = function () {
            return this.url;
        };

        this.setPerfil = function (perfil) {
            this.perfil = perfil;
        };

        this.getPerfil = function () {
            return this.perfil;
        };

        this.setModel = function (model) {
            this.model = model;
        };

        this.getModel = function () {
            return this.model;
        };

        this.setView = function (view) {
            this.view = view;
        };

        this.getView = function () {
            return this.view;
        };

    },
});