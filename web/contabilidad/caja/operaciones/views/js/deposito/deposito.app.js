/**
 * Created by furet on 13/10/15.
 */
Ext.namespace('Caja.Deposito');

Ext.QuickTips.init();

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function (options, success, response) {
        var responseText = Ext.decode(response.responseText);
        Ext.Msg.wait(responseText.lbCargando, responseText.lbEspere);
        this.loadDataIni(responseText);
        //----------------------
        Ext.Msg.wait(responseText.lbCargando, responseText.lbEspere);
        Ext.Ajax.request({
            url: 'loadDataIni',
            scope: this,
            callback: function (options, success, response) {
                if (success) {
                    var response = Ext.decode(response.responseText);
                    fechaContable = response.dataFecha.fechacontable;
                    periodoActual = response.dataFecha.nombre;
                    fechaInicio = response.dataFecha.inicio;
                    fechaFin = response.dataFecha.fin;
                    ejercicioActual = response.ejercicio;

                    if (response.aperturado !=1) {
                        panelDeposito.disable();
                        mostrarMensaje(1, responseText.lbCargaInicial, function (btn) {
                            if (btn == 'ok' || btn == 'cencel')
                                panelDeposito.disable();
                        });
                        return;
                    }

                    panelDeposito.lfdPeriodo.setText('Fecha contable: ' + fechaContable);
                    // panelDeposito.lfdPeriodo.setText('Per\u00EDodo actual: ' + periodoActual + ' desde ' + fechaInicio + ' hasta ' + fechaFin + '|' + 'Fecha contable: ' + fechaContable);
                    panelDeposito.btnFondo.fireEvent('click');
                }
            }
        });
        //---------------------------
    }
});
//-----------------------------------------------------------------------------
this.loadDataIni = function (idioma) {
    var caja = {
        idcaja: '',
        denominacion: ''
    };

    var fondo = {
        idfondo: '',
        denominacion: '',
        idmoneda: '',
    };

    Caja.Deposito.Caja = caja;
    Caja.Deposito.Fondo = fondo;

    new Caja.Deposito.Viewport({
        idioma: idioma,
        perfil: window.parent.perfil
    });
}
//-----------------------------------------------------------
Caja.Deposito.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function (params) {

        panelDeposito = new Caja.Deposito.PanelDeposito({
            idioma: params.idioma,
            perfil: params.perfil,
            scope: this,
            region: 'center'
        });

        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            items: [panelDeposito]
        });

        this.initGlobalsKeys();
        this.initEventos();
        this.initFunctions();

        Caja.Deposito.Viewport.superclass.constructor.call(this, params);
    },
    initGlobalsKeys: function () {

        this.keyMap = new Ext.KeyMap(document, [
            {
                key: "i",
                alt: true,
                scope: this,
                fn: function () {
                    panelDeposito.btnAddDeposito.fireEvent('click');
                }
            }, {
                key: "m",
                alt: true,
                scope: this,
                fn: function (n, e) {
                    e.preventDefault();
                    if (!panelDeposito.btnModDeposito.disabled)
                        panelDeposito.btnModDeposito.fireEvent('click');
                }
            }, {
                key: "x",
                alt: true,
                scope: this,
                fn: function () {
                    if (!panelDeposito.btnCancelDeposito.disabled)
                        panelDeposito.btnCancelDeposito.fireEvent('click');
                }
            }, {
                key: 'f',
                alt: true,
                scope: this,
                fn: function () {
                    if (!panelDeposito.btnConfDeposito.disabled)
                        panelDeposito.btnConfDeposito.fireEvent('click');
                }
            }, {
                key: "t",
                alt: true,
                scope: this,
                fn: function () {
                    if (!panelDeposito.btnContatabDeposito.disabled)
                        panelDeposito.btnContatabDeposito.fireEvent('click');
                }
            }, {
                key: "b",
                alt: true,
                scope: this,
                fn: function () {
                    if (!panelDeposito.btnBuscar.disabled)
                        panelDeposito.btnBuscar.fireEvent('click');
                }
            }
        ]);
    },
    initEventos: function () {
        panelDeposito.rowaction.on({
            scope: this,
            action: function (grid, recordarray, icon, rowindex, colindex) {
                this.fShowReporteComprobante();
            },
            beforeaction: function (grid, rowIndex) {
            }
        });

        //this.panelDeposito.btnFondo.fireEvent('click');
    },
    initFunctions: function () {
        this.loadMask = function () {
            //lMask = new Ext.LoadMask(this.body, {
            lMask = new Ext.LoadMask(Ext.getBody(), {
                msg: this.idioma.lbCargando
            });
            lMask.show();
        };

        this.fShowReporteComprobante = function () {
            // Ext.Msg.wait(scope.etiquetas.lbCargando, scope.etiquetas.lbEspere);
            Ext.Msg.wait('Cargando...', 'Espere');
            var arrayIdCmp = panelDeposito.smDeposito.getSelected().json.arrayIdCmp;

            Ext.Ajax.request({
                url: "/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/registrodecomprobantes/" + 'obtenerDatosImprimirReporte',
                params: {
                    reporteParams: Ext.encode(arrayIdCmp)
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if(responseData.dataSources.length > 0) {
                        fOpenWindowReportCmp({
                            datoGeneral: {
                                reporte: '100',
                                titulo: 'Comprobante de operaciones',
                            },
                            datoCuerpo: responseData.dataSources
                        });
                    }
                    Ext.MessageBox.hide();
                }
            });
        };

        fOpenWindowReportCmp = function (datosReporte) {
            defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
            var printView = new SCFPrintView(datosReporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
            printView.show();
        };
    }
});