Ext.ns('LOG.lb.Enzona');
LOG.lb.Enzona.View = Ext.extend(LOG.util.Window, {
    idCmp: null,
    modelo: null,
    winHistorial: null,
    winQR: null,
    monto: 0.00,
    pendiente: 0.00,
    pagado: 0.00,
    moneda: 'cup',
    descripcion: '',
    comercio: '',
    key: '',
    secret: '',
    modal: false,
    /**
     *
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function (config) {
        var _this = this;
        var pnPago = undefined;
        var btnPago = undefined;
        var btnVPago = undefined;
        var btnCierre = undefined;
        var _config = {
            resizable: false,
            closable: false,
            width: 380,
            height: 190,
            buttons: [
                btnVPago = LOG.util.Prototipos.botonGeneral({
                    text: LOG.lb.Enzona.Idioma.lbHistoriaP,
                    hidden: true,
                    iconCls: 'historial',
                }), btnPago = LOG.util.Prototipos.botonGeneral({
                    text: LOG.lb.Enzona.Idioma.lbMontoPago,
                    iconCls: 'acreditar',

                }), btnCierre = LOG.util.Prototipos.botonGeneral({
                    text: LOG.lb.Enzona.Idioma.lbFinish,
                    iconCls: 'salir',
                    disabled: true,
                    handler: function () {
                        _this.close();
                        _this.winHistorial.close();
                    }
                })],
            title: LOG.lb.Enzona.Idioma.tituloQRWin + ' ' + config.moneda.toUpperCase(),
            items: [
                pnPago = LOG.util.UIManager.initColumnForm({
                    frame: true,
                    region: 'center',
                    height: 120
                })
            ],
        };

        pnPago.addComponent(new Ext.form.DisplayField({
            value: LOG.lb.Enzona.Idioma.lbMonto + ': ' + config.monto,
            style: "color: green; font-weight: bold; font-size: 13px;",
        }));
        pnPago.addComponent(this.displayPdt = new Ext.form.DisplayField({
            value: LOG.lb.Enzona.Idioma.lbMontoPPago + ': ' + config.monto,
            style: "color: red; font-weight: bold; font-size: 13px;",
        }));

        pnPago.addComponent(this.displayPagg = new Ext.form.DisplayField({
            value: LOG.lb.Enzona.Idioma.lbMontoPagado + ': ' + _this.pagado,
            style: "color: blue; font-weight: bold; font-size: 13px;",
        }));
        pnPago.addComponent(this.txtPago = LOG.util.Prototipos.inputDecimal({
            fieldLabel: LOG.lb.Enzona.Idioma.lbMontoPago + ' ' + config.moneda.toUpperCase(),
            value: config.monto,
            decimalPrecision: 2,
            labelStyle: "color: green; font-weight: bold; font-size: 13px;",
            style: 'text-align: right'
        }));

        /*var task = {
            run: function(){
               alert('asdsadsad');
            },
            interval: 1000 //1 second
        }
        Ext.TaskMgr.start(task);*/
        btnPago.handler = function () {
            if (_this.pagado + _this.txtPago.getValue() > _this.monto) {
                mostrarMensaje(6, LOG.lb.Enzona.Idioma.msgErrorPago);
                return;
            }
            if (_this.winQR == null) {
                _this.winQR = new LOG.lb.Enzona.QRView({
                    aceptarFn: function () {
                        this.pendiente = this.pendiente - this.txtPago.getValue();
                        this.pagado = this.pagado + this.txtPago.getValue();
                        this.txtPago.setValue(this.pendiente);
                        this.displayPdt.setValue(LOG.lb.Enzona.Idioma.lbMontoPPago + ': ' + this.pendiente);
                        this.displayPagg.setValue(LOG.lb.Enzona.Idioma.lbMontoPagado + ': ' + this.pagado);
                        if (this.pendiente == 0) {
                            btnPago.disable();
                            btnCierre.enable();
                        }
                    },
                    socpeFn: _this
                });
            }
            _this.winQR.show();
            _this.winQR.loadQrPayment(_this.txtPago.getValue(), _this.moneda, _this.descripcion, _this.comercio, _this.key, _this.secret);
        }
        btnVPago.handler = function () {

        }
        config = LOG.util.UIManager.apply(config, _config);
        LOG.lb.Enzona.View.superclass.constructor.call(this, config);
        this.pendiente = this.monto;
        this.modal = false;
    },
});
LOG.lb.Enzona.QRView = Ext.extend(LOG.util.Window, {
    aceptarFn: function () {
    },
    socpeFn: undefined,
    constructor: function (config) {
        var _this = this;
        this.socpeFn = this.socpeFn || this;
        this.idCmp = Ext.id();
        this.modelo = new LOG.util.Model({
            idioma: LOG.lb.Enzona.Idioma,
            urlController: '/logistica/utiles/enzonaservices/index.php/enzona/'
        });
        this.pagosView = new LOG.lb.Enzona.PagosView({
            baseParams: {

            }
        });
        this.pagosView.init();
        var panelQR = LOG.util.UIManager.initPanel({
            region: 'west',
            width: 210,
            frame: true,
            layout: 'border',
            items: [
                {
                    region: 'north',
                    height: 270,
                    xtype: 'fieldset',
                    /*title: LOG.lb.Enzona.Idioma.tituloQRWinP,*/
                    items: [LOG.util.UIManager.initPanel({
                        region: 'center',
                        html: '<img id="' + this.idCmp + '_qr" style="width: 100%; height: 100%;">'
                    })],
                    buttons: [LOG.util.Prototipos.botonGeneral({
                        text: LOG.lb.Enzona.Idioma.lbActQr,
                        iconCls: 'sincronizar',
                        handler: function () {
                            _this.loadQrPayment(LOG.lb.Enzona.objParamsQR.monto, LOG.lb.Enzona.objParamsQR.isomoneda, LOG.lb.Enzona.objParamsQR.descipcionpago
                                , LOG.lb.Enzona.objParamsQR.comercio, LOG.lb.Enzona.objParamsQR.key, LOG.lb.Enzona.objParamsQR.secret);
                        }
                    }), this.btnValidPago = LOG.util.Prototipos.botonGeneral({
                        text: LOG.lb.Enzona.Idioma.lbValidate,
                        iconCls: 'mediosdepagocrm',
                        disabled: true,
                        handler: function () {
                            _this.modelo.cargaInicial({
                                url: '/logistica/utiles/enzonaservices/index.php/enzona/verifyPayment',
                                uuid: LOG.lb.Enzona.uuid,
                            }, function (r, rd) {
                                if (rd.isvalid == 0) {
                                    mostrarMensaje(6, LOG.lb.Enzona.Idioma.msgErrorValidandoPagoQR)
                                    return;
                                }
                                mostrarMensaje(1, LOG.lb.Enzona.Idioma.msgPagoAceptado + ' ' + rd.operation, function () {
                                    if (typeof _this.aceptarFn == 'function') {
                                        _this.aceptarFn.createDelegate(_this.socpeFn, [true, rd.operation, rd.transactionId]).call();
                                    }
                                });
                                _this.close();
                            }, LOG.lb.Enzona.Idioma.msgValidandoPagoQR);
                        }
                    })],
                },
                LOG.util.UIManager.initPanel({
                    region: 'center',
                    html: ''
                })
            ],
        });
        var task = {
            run: function () {
                _this.pagosView.storePrincipal.reload({});
            },
            interval: 30000 //1 second
        }
        //Ext.TaskMgr.start(task);
        var _config = {
            resizable: false,
            width: /*650*/225,
            height: 325,
            title: LOG.lb.Enzona.Idioma.tituloQRWinPago,
            buttons: [],
            items: [panelQR, _this.pagosView.view({ border: true, frame: true })],
        };
        config = LOG.util.UIManager.apply(config, _config);
        LOG.lb.Enzona.QRView.superclass.constructor.call(this, config);
        this.modal = false;
    },
    loadQrPayment: function (monto, moneda, desc, comercio, key, secret, iddocumento, tipo) {
        var _this = this;
        document.getElementById(_this.idCmp + '_qr').src = "data:image/png;base64, " + LOG.lb.Enzona.base64Img;
        _this.btnValidPago.disable();
        LOG.lb.Enzona.objParamsQR = {
            url: '/logistica/utiles/enzonaservices/index.php/enzona/qr',
            monto: monto,
            isomoneda: moneda,
            comercio: comercio,
            descipcionpago: desc,
            key: key,
            secret: secret,
            iddocumento: iddocumento,
            type :  tipo
        }
        this.modelo.cargaInicial(LOG.lb.Enzona.objParamsQR, function (r, rd) {
            if (rd.fallido == 0) {
                document.getElementById(_this.idCmp + '_qr').src = "data:image/png;base64, " + rd.qr;
                _this.btnValidPago.enable();
                LOG.lb.Enzona.uuid = rd.uuid;
            } else {
                mostrarMensaje(1, LOG.lb.Enzona.Idioma.msgErrorQR)
            }
        }, LOG.lb.Enzona.Idioma.msgQR)
    }
});

LOG.lb.Enzona.PagosView = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'panel',
    modoSeleccion: 1,
    bbarVisible: false,
    panelBotonesVisible: false,
    dirController: '/logistica/utiles/enzonaservices/index.php/enzona',
    urlBusquedaGridPrincipal: 'getPayments',
    constructor: function (config) {
        LOG.lb.Enzona.PagosView.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: 'Valor',
            dataIndex: '',
            width: 120,
            default: true
        });
    }

});
LOG.lb.Enzona.uuid = '';
LOG.lb.Enzona.objParamsQR = {};
LOG.lb.Enzona.base64Img = "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"
