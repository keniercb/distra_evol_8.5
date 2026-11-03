Ext.namespace('Ext.ClassReplicarReporte');
Ext.ClassReplicarReporte = Ext.extend(Ext.Component, {
    lmask: undefined,
    View: undefined,
    reportesReplicar: [],
    constructor: function(datos)
    {
        this.reportesReplicar = datos;

        this.loadDataComponent();

        Ext.ClassReplicarReporte.superclass.constructor.call(this);
    },
    loadMessageBox: function (msg = 'Cargando...', title = 'Por favor espere...') {
        Ext.MessageBox.show({
            title: title,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });//manera de ocultarlo Ext.MessageBox.hide();
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
        if (!(this.lmask instanceof Ext.LoadMask && message === undefined)) {
            this.lmask = new Ext.LoadMask(Ext.getBody(), {
                msg: message ? message : 'Cargando...'
            });
        }
        this.lmask.show();
    },
    hideMask: function () {
        if (this.lmask instanceof Ext.LoadMask) {
            this.lmask.hide();
        }
    },
    loadDataComponent: function()
    {
        // Ext.Ajax.request({
        //     scope: this,
        //     method: "POST",
        //     url: "cargardatos",
        //     callback: function (options, success, response) {
        //         this.initializeClass();
        //     }
        // });
        this.initializeClass();
    },
    initializeClass: function () {
        this.View = new Ext.UIReplicarReporte();
        this.initializeDataIni();
        this.initializeEvents();
        this.initializeFunctions();
        this.View.show();
    },
    initializeDataIni: function () {

    },
    initializeEvents: function()
    {
        this.View.smTreeEntidad.on({
            scope: this,
            selectionchange: function (sm, index, record) {
                var records = sm.getSelections();
                if (records.length > 0) {
                    this.View.btnAceptar.enable();
                } else {
                    this.View.btnAceptar.disable();
                }
            }
        });

        this.View.btnAceptar.on({
            scope: this,
            click: function () {
                var records = this.View.smTreeEntidad.getSelections();
                var arrDatos = new Array();
                Ext.each(records, function (record) {
                    arrDatos.push({
                        'reportes': record.json.reportes,
                        'idestructurae': record.data.idestructurae,
                        'text': record.data.text,
                        'estructuraActual': record.json.estructuraActual
                    });
                });
                this.replicarEstados(arrDatos);
            }
        });

    },
    initializeFunctions: function()
    {
        this.replicarEstados = function (arrDatos) {
            var view =  this.View;
            var mensaje = 'Esta seguro que desea replicar los estados financieros?';
            var mensaje1 = "Los siguientes estados financieros ya se encuentran replicados:<br>";
            var a = '';
            var estructurasReplicar = [];
            var agrupador = [];
            var repor = [];
            var inc;
            var flag = true;

            for (var i = 0; i < this.reportesReplicar.length; i++) {
                repor = [];
                for (var j = 0; j < arrDatos.length; j++) {
                    if (!arrDatos[j].estructuraActual) {
                        inc = arrDatos[j].reportes.includes(
                            this.reportesReplicar[i].codigo + ' ' + this.reportesReplicar[i].denominacion
                        );
                        if (inc) {
                            repor.push(arrDatos[j].text);
                        }
                        estructurasReplicar.push(arrDatos[j].idestructurae);
                    }
                }
                agrupador.push({
                    arrEstructura: repor,
                    reporte: this.reportesReplicar[i].codigo + ' ' + this.reportesReplicar[i].denominacion
                });
            }

            for (var i = 0; i < agrupador.length; i++) {
                mensaje1 += '<b>' + agrupador[i].reporte + '</b>: ';
                for (var j = 0; j < agrupador[i].arrEstructura.length; j++) {
                    flag = false;
                    mensaje1 += agrupador[i].arrEstructura[j];
                    if (agrupador[i].arrEstructura.length -1 === j) {
                        if (!agrupador[i].length -1 === i) {
                            mensaje1 += '<br>';
                        }
                    } else {
                        mensaje1 += ', ';
                    }
                }
            }

            var me = this;
            mostrarMensaje(2, flag ? mensaje : mensaje1, function (btn) {
                if (btn == 'ok') {
                    // me.mostrarMensajeEspera(titulo, texto);
                    me.loadMessageBox();
                    Ext.Ajax.request({
                        url: 'replicarReporteFinanciero',
                        params: {
                            arrIdestructurae: Ext.encode(estructurasReplicar),
                            reportesReplicar: Ext.encode(me.reportesReplicar),
                        },
                        callback: function (options, success, respuesta) {
                            var respuesta = Ext.decode(respuesta.responseText);
                            // me.view.grid.getStore().load();
                            Ext.MessageBox.hide();
                            view.close();
                            if (success && respuesta.codMsg == 1) {
                                mostrarMensaje(1, 'Los estados financieros han sido replicados satisfactoriamente.');
                            }
                        }
                    })
                }
            });
        };

    }
});