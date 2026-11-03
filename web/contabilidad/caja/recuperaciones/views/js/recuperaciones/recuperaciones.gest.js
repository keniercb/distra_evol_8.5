Ext.namespace('Caja.Reportes.gest');
Caja.Reportes.gest = Ext.extend(Ext.Component,
{
    perfil : undefined,
    etiquetas : undefined,
    url : '',
    arrreportes : [],
    reporteActual : undefined,
    constructor : function()
    {
        Ext.QuickTips.init();
        this.perfil = window.parent.perfil;
        var me = this;
        Caja.Reportes.gest.superclass.constructor.call(this);
        requireJS.loadJsArray([
            {
                url: "/contabilidad/caja/recuperaciones/views/js/recuperaciones/reportes/reciboefectivo",
                id: 'reciboefectivo',
            },
            {
                url: "/contabilidad/caja/recuperaciones/views/js/recuperaciones/reportes/antliqgastosviaje",
                id: 'antliqgastosviaje',
            },
            {
                url: "/contabilidad/caja/recuperaciones/views/js/recuperaciones/reportes/arqueoefectivocaja",
                id: 'arqueoefectivocaja',
            },
            {
                url: "/contabilidad/caja/recuperaciones/views/js/recuperaciones/reportes/controlanticiposjustificar",
                id: 'controlanticiposjustificar',
            },
            {
                url: "/contabilidad/caja/recuperaciones/views/js/recuperaciones/reportes/reembfondospagosmenores",
                id: 'reembfondospagosmenores',
            },
            {
                url: "/contabilidad/caja/recuperaciones/views/js/recuperaciones/reportes/valepagosmenores",
                id: 'valepagosmenores',
            },
            {
                url: "/contabilidad/caja/recuperaciones/views/js/recuperaciones/reportes/submayorconsumocombustible",
                id: 'submayorconsumocombustible',
            },
            {
                url: "/contabilidad/caja/recuperaciones/views/js/recuperaciones/componentes/cbfondo",
                id: 'cmpcbfondo',
            },
            {
                url: "/contabilidad/caja/recuperaciones/views/js/recuperaciones/componentes/cbestados",
                id: 'cmpcbestados',
            },
            {
                url: "/contabilidad/caja/recuperaciones/views/js/recuperaciones/componentes/cbdocumentos",
                id: 'cmpcbdocumentos',
            },
            {
                url: "/contabilidad/caja/recuperaciones/views/js/recuperaciones/componentes/cbcaja",
                id: 'cmpcbcaja',
            },
            {
                url: "/contabilidad/caja/recuperaciones/views/js/recuperaciones/reportes/submayortarjetacombustible",
                id: 'cmpcbsubmayortarjetacombustible',
            },
        ], function () {
            validate.cargarAcciones(function () {
                Ext.Ajax.request({
                    method: "POST",
                    url: "cargaretiquetas",
                    callback: function(options, success, response)
                    {
                        me.etiquetas = Ext.decode(response.responseText);
                        me.model = Caja.Reportes.Model;
                        me.model.init();

                        me.view = Caja.Reportes.View;
                        me.view.init(me.perfil, me.etiquetas, me.model);

                        me.controller = Caja.Reportes.Controller;
                        me.controller.init(me.etiquetas, me.view, me.model);

                        me.cargarEventos();
                        me.cargarFunciones();
                        me.cargarReportes();
                    }
                });

            });
        });
    },
    inicializarReportes: function () {
        this.arrreportes = [
            new Caja.Reportes.ReciboEfectivo(),
            new Caja.Reportes.AntLiqGAstosViaje(),
            new Caja.Reportes.ValePagosMenores(),
            new Caja.Reportes.ArqueoEfectivoCaja(),
            new Caja.Reportes.ReembolsoFondoPagosMenores(),
            new Caja.Reportes.ControlAnticiposJustificar(),
            new Caja.Reportes.SubMayorConsumoCombustible(),
            new Caja.Reportes.SubMayorTarjetaCombustible,
        ];
    },
    cargarReportes: function () {
        this.inicializarReportes();
        for (var i = 0; i < this.arrreportes.length; i++) {
            if (validate.checkByAbreviatura(this.arrreportes[i].abreviatura) || this.arrreportes[i].abreviatura === undefined) {
                this.annadirReporte(this.arrreportes[i].getRecord());
            }
        }
    },
    cargarEventos: function () {
        var me = this;

        me.view.cbReportes.on({
            beforeselect: function (field, record, index) {
                if (this.getValue() != record.data.idreporte) {
                    // scope.fAddComponent(record.data.idreporte);
                    var reporte = me.obtenerReporteByIdReporte(record.data.idreporte);
                    me.reporteActual = reporte;
                    if (reporte) {
                        me.fAddComponentReport(reporte);
                    }
                    me.view.gpDatosReporte.getStore().removeAll();
                    me.view.gpDatosReporte.getColumnModel().setConfig([]);
                    me.view.btnVistaPreliminar.hide();
                }
            }
        });

        me.view.cbxEntidad.on({
            blur: function (cb) {
                if (me.reporteActual) {
                    me.reporteActual.cambioSeleccionEstructura(cb.fSelect.values);
                }
            }
        });

        me.view.btnAceptar.on('click', function () {
            me.fAceptoReporte();
        });

    },
    cargarFunciones: function () {
        var me = this;

        this.obtenerReporteByIdReporte = function (idreporte) {
            for (var i = 0; i < this.arrreportes.length; i++) {
                if (this.arrreportes[i].idreporte === idreporte) {
                    return this.arrreportes[i];
                }
            }
            return false;
        };

        this.annadirReporte = function (config) {
            var record = new this.model.recordT(config);
            this.model.stReportes.add(record);
        };

        this.fAddComponentReport = function (reporte) {
            if (me.view.pReportes.items.length > 1) {
                for (var i = 1; i < me.view.pReportes.items.length; i++) {
                    me.delComponentCascade(me.view.pReportes.getComponent(i));
                }
            }
            me.generateFilterComponentes(reporte);
        };

        this.delComponentCascade = function (component) {
            if (component.items.length > 0) {
                for (var i = component.items.length - 1; i >= 0; i--) {
                    component.remove(i, true);
                }
            }
        };

        this.generateFilterComponentes = function (reporte) {
            var arrayFilterComp = reporte.crearFilterComponents(
                // this.getIdcaja,
                this.getEstructuras,
                this.getFechaInicio,
                this.getFechaFin
            );
            me.renderFilters(arrayFilterComp);

        };

        this.renderFilters = function (cmpFilters) {
            if (cmpFilters.length > 0) { //Si existen filtros para el reporte
                var arr = this.picarArrEnChunks(cmpFilters);
                for (var i = 0; i < arr.length; i++) {
                    var panel = new Ext.Panel({
                        id: 'pDown',
                        labelAlign: 'top',
                        layout: 'column'
                    });
                    for (var j = 0; j < arr[i].length; j++) {
                        panel.add(
                            {
                                layout: 'form',
                                columnWidth: .20,
                                labelAlign: 'top',
                                style: 'margin:0 0 0 10',
                                items: [arr[i][j]]
                            }
                        );
                    }
                    me.view.pReportes.add(panel);
                }
                me.view.pReportes.doLayout(true);
            }
        };

        this.picarArrEnChunks = function (arr) {
            var arrPicado = [];
            var longitud_pedazos = 5

            for (var i = 0; i < arr.length; i+= longitud_pedazos) {
                var pedazo = arr.slice(i, i + longitud_pedazos);
                arrPicado.push(pedazo);
            }
            return arrPicado;
        };

        // this.getIdcaja = function () {
        //     return me.view.idCaja;
        // };

        this.getEstructuras = function () {
            return me.view.cbxEntidad.fSelect.values;
        };

        this.getFechaInicio = function () {
            return me.view.fechaInicio.getRawValue();
        };

        this.getFechaFin = function () {
            return me.view.fechaFin.getRawValue();
        };

        this.fAceptoReporte = function () {
            var idreporte = me.view.cbReportes.getValue();
            var reporte = me.reporteActual;
            if (me.view.pReportes.getForm().isValid() && reporte.isValid()) {
                me.view.btnVistaPreliminar.show();
                if (reporte.tipoReporte === 'normal') {
                    this.reportesNormales(reporte);
                } else if (reporte.tipoReporte === 'jasper') {
                    this.reportesJasper(reporte);
                }
            }
        };

        this.reportesNormales = function (reporte) {
            me.view.btnVistaPreliminar.show();
            var params = this.getParams();
            var reportParams = reporte.getParams();
            Ext.apply(params, reportParams);
            // params.idEstado = Ext.encode(view.cbxEstado.fSelect.values);
            // params.idCajaFondo = this.idCajaFondo;
            // params.nomFondo = view.cbFondo.getRawValue();

            Ext.Msg.wait('Buscando datos del reporte.', 'Por favor espere...');
            Ext.Ajax.request({
                method: "POST",
                params: params,
                url: "cargarDatosReporte",
                callback: function (options, success, response) {
                    var responseDataReporte = Ext.decode(response.responseText);
                    me.controller.responseDataReporte = responseDataReporte;
                    Ext.Msg.hide();
                    me.view.btnVistaPreliminar.disable();
                    if (reporte.drawGrid) {
                        me.fDrawGridPanel(reporte, responseDataReporte.datos);
                        if (responseDataReporte.datos && responseDataReporte.datos.length > 0) {
                            me.view.btnVistaPreliminar.enable();
                        } else {
                            mostrarMensaje(1, me.etiquetas.lbNoDatosPorCriterios);
                        }
                    }
                    // me.view.btnVistaPreliminar.enable();//Quitar
                }
            });
        };

        this.reportesJasper = function (reporte) {
            reporte.generarReporte(this.getParams());
        };

        this.getParams = function () {
            var params = {
                arrayIdEstructurae: Ext.encode(me.view.cbxEntidad.fSelect.values),
                idReporte: me.view.cbReportes.getValue(),
                fechainicio: me.view.fechaInicio.getRawValue(),
                fechafin: me.view.fechaFin.getRawValue(),
                // idCaja: this.getIdcaja(),
            };
            return params;
        };

        this.fDrawGridPanel = function (reporte, viewdata) {
            var store = reporte.crearStoreGrid(viewdata);
            var cm = reporte.crearColumnModel();

            this.reconfigureGridReporte(store, cm);
        };

        this.reconfigureGridReporte = function (store, cm) {
            me.view.pGeneral.add(me.view.pnlSouth);
            me.view.pGeneral.doLayout();

            me.view.gpDatosReporte.reconfigure(
                store,
                cm
            );
        };

    }
});

new Caja.Reportes.gest();