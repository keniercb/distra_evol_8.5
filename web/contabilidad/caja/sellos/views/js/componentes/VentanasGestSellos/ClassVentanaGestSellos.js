Ext.namespace('Ext.ClassVentanaGestSellos');
Ext.ClassVentanaGestSellos = Ext.extend(Ext.Component, {
    lmask: undefined,
    url: undefined,
    etiquetas: undefined,
    tipoVentana: undefined, // 1-entrada 2-anticipo 3-liquidacion
    tipoAccion: undefined, // 'add', 'mod' o 'liq'(solo el anticipo se puede liquidar)
    objVentana: undefined,
    datosAMod: undefined,
    constructor: function (params) {
        var scope = this;
        this.url = params.url;
        this.etiquetas = params.etiquetas;
        this.tipoVentana = params.tipoVentana;
        this.tipoAccion = params.tipoAccion;
        this.datosAMod = params.datosAMod;

        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        perfil = window.parent.perfil;
        this.loadMessageBox();

        if (this.tipoVentana == 1) {
            if (!document.getElementById('UIVentanaEntradaSello')) {
                this.loadJs("/contabilidad/caja/sellos/views/js/componentes/VentanasGestSellos/UIVentanaEntradaSello", 'UIVentanaEntradaSello', function () {
                    scope.init(new Ext.UIVentanaEntradaSello(params));
                });
            } else {
                scope.init(new Ext.UIVentanaEntradaSello(params));
            }
        } else if (this.tipoVentana == 2 || this.tipoVentana == 3) {
            if (!document.getElementById('UIVentanaAnticipoSello')) {
                this.loadJs("/contabilidad/caja/sellos/views/js/componentes/VentanasGestSellos/UIVentanaAnticipoSello", 'UIVentanaAnticipoSello', function () {
                    Ext.Ajax.request({
                        method: "POST",
                        params: {
                            idCajaFondo: params.idCajaFondo
                        },
                        url: scope.url + "getSaldoFondo",
                        callback: function (options, success, response) {
                            params.SaldoFondo = Ext.decode(response.responseText);
                            scope.init(new Ext.UIVentanaAnticipoSello(params));
                        }
                    });
                });
            } else {
                Ext.Ajax.request({
                    method: "POST",
                    params: {
                        idCajaFondo: params.idCajaFondo
                    },
                    url: scope.url + "getSaldoFondo",
                    callback: function (options, success, response) {
                        params.SaldoFondo = Ext.decode(response.responseText);
                        scope.init(new Ext.UIVentanaAnticipoSello(params));
                    }
                });
            }
        } else {
            //algo salio mal
            return mostrarMensaje(1, '???');
        }

        return Ext.ClassVentanaGestSellos.superclass.constructor.call(this);
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
    }, //manera de ocultarlo Ext.MessageBox.hide();
    loadMask: function (message) {
        this.lmask = new Ext.LoadMask(Ext.getBody(), {
            msg: message
        }).show();
    },
    init: function (vista) {
        this.objVentana = vista;
        Ext.MessageBox.hide();
        this.objVentana.show(Ext.getBody());
        this.loadDataComponent(this);
    },
    loadDataComponent: function (scope) //fireeve
    {
        scope.addEvents('success');
        scope.objVentana.on('success', function (flag) {
            scope.fireEvent('success', flag);
        });
    },
});
