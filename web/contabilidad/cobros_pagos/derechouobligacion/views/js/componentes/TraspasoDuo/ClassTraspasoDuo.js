Ext.namespace('Ext.ClassTraspasoDuo');
Ext.ClassTraspasoDuo = Ext.extend(Ext.Component, {
    etiquetas: undefined,
    tipoDuo: undefined,
    url: undefined,
    cuentas: undefined,
    idcuentas: undefined,
    numerosDoc: undefined,
    arrayIdDuo: undefined,
    arrayDuo: undefined,
    fechaContable: undefined,
    periodoActual: undefined,
    idCentroCosto: undefined,
    idEstructuraCCosto: undefined,
    idEstructuraDestino: undefined,
    idEstructuraActual: undefined,
    constructor: function(etiquetas, params)
    {
        this.etiquetas = etiquetas;
        this.tipoDuo = params.tipoDuo;
        this.url = params.url;
        this.cuentas = params.cuentas;
        this.idcuentas = params.idcuentas;
        this.numerosDoc = params.numerosDoc;
        this.arrayIdDuo = params.arrayIdDuo;
        this.arrayDuo = params.arrayDuoTraspaso;
        this.fechaContable = params.fechaContable;
//        this.periodoActual = params.periodoActual;
        scope = this;

        this.wTraspasoDuo = new Ext.UITraspasoDuo(this);
        this.initializeEvents(this);
        this.initializeFunctions(this);

//        Ext.Ajax.request({
//            url: scope.url + 'loadDataTraspasoDuo',
//            method: 'POST',
//            params: {
//                tipoduo: this.tipoDuo
//            },
//            callback: function(options, success, response)
//            {
//                responseData = Ext.decode(response.responseText);
//                    scope.loadDataComponent(responseData, this.action);
//            }
//        });
        scope.loadDataComponent();

        return Ext.ClassTraspasoDuo.superclass.constructor.call(this);
    },
    loadDataComponent: function(data, action)
    {
        Ext.Ajax.request({
            url: scope.url + 'loadTreeEntidades',
            method: 'POST',
            params: {
                tipoduo: this.tipoDuo
            },
            callback: function(options, success, response)
            {
                responseData = Ext.decode(response.responseText);
                scope.fShowWindow(responseData);
            }
        });
    },
    loadMessageBox: function(msg)
    {
        Ext.MessageBox.show({
            title: scope.etiquetas.lbMsgEspere,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function(v) {
            return function() {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    },
    initializeEvents: function(scope)
    {
        this.addEvents('closeTraspaso');
        this.addEvents('contabilizar');
        this.addEvents('contabilizado');
        this.addEvents('aceptarTraspaso');

        this.btnTraspasoCerrar.on('click', function(component)
        {
            scope.wTraspasoDuo.close();
            scope.fireEvent('closeTraspaso', true);
        });

        this.btnTraspasoAceptar.on('click', function(component)
        {
            scope.fShowWindowAceptarTraspaso();
        });

        scope.dfTraspasoFecha.on('keypress', function(t, e) {
            if (e.getKey() == 13) {
                if (!this.getValue())
                    this.setValue(scope.fechaContable);
            }
        });
    },
    initializeFunctions: function(scope)
    {
        this.fShowWindow = function(data)
        {
            scope.wTraspasoDuo.show(Ext.getBody(), function()
            {
                scope.wTraspasoDuo.doLayout(true);
//                scope.dfTraspasoFecha.setRawValue(scope.fechaContable);
//                scope.dfTraspasoFecha.setMinValue(scope.fechaContable);
//                scope.dfTraspasoFecha.setMaxValue(scope.fechaContable);
//                scope.dfTraspasoFecha.focus(true, 10);
                Ext.getCmp('gpEntidad').getStore().loadData(data);
                scope.idEstructuraActual = data.Actual;
                if (Ext.MessageBox)
                    Ext.MessageBox.hide();
            });
        };

        this.fShowWindowAceptarTraspaso = function()
        {
            scope.idEstructuraDestino = Ext.getCmp('cbxEntidad').fSelect.values[0];
            message = scope.etiquetas.lbNoTraspRazones + '<br>';
//            focusField = '';
//            if (!scope.dfTraspasoFecha.getValue() || !Ext.getCmp('cbxEntidad').fSelect.values || !scope.arrayIdDuo || !scope.idcuentas) {
//                if (!Ext.getCmp('ccnae').fGetSelections().length > 0)
            /*if (scope.idEstructuraActual == scope.idEstructuraDestino) {
             
             } else*/ if (!Ext.getCmp('cbxEntidad').fSelect.values || !scope.arrayIdDuo || !scope.idcuentas || scope.idEstructuraActual == scope.idEstructuraDestino) {
                if (!Ext.getCmp('cbxEntidad').fSelect.values)
                    message += '- ' + scope.etiquetas.lbSelecEntidad + '<br>';

                if (scope.idEstructuraActual == scope.idEstructuraDestino)
                    message = '- ' + scope.etiquetas.lbSelecDifEntidad + '<br>';

//                if (!scope.dfTraspasoFecha.getValue()) {
//                    message += '- ' + scope.etiquetas.lbSelecFecha + '<br>';
////                    focusField = scope.dfTraspasoFecha;
//                }

                if (!scope.arrayIdDuo || !scope.idcuentas)
                    message += '- ' + scope.etiquetas.lbNoSelecDoc + '<br>';

                mostrarMensaje(1, message, function(btn) {
                    scope.dfTraspasoFecha.focus(true, 10);
                });
            } else {
//                scope.idCentroCosto = Ext.getCmp('ccnae').fGetSelections()[0].attributes.id;
//                nombreCentroCosto = Ext.getCmp('ccnae').fGetSelections()[0].attributes.text;
//                scope.idEstructuraDestino = Ext.getCmp('ccnae').fGetSelections()[0].attributes.idestructura;

                Ext.Msg.show({
                    title: scope.etiquetas.lbBtnTraspaso,
                    buttons: Ext.Msg.OKCANCEL,
                    msg: scope.etiquetas.lbActionTraspaso + '<b>' + '"' + scope.cbTraspasoEntidad.getRawValue() + '"' + '</b>' + '</br>' + scope.etiquetas.lbContinuar,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
                        if (btn == 'ok') {
                            scope.loadMessageBox(scope.mascPrincipal);
                            tipoContabilizacion = 2;

                            Ext.Ajax.request({
                                method: "POST",
                                url: scope.url + "loadDataComprobanteTraspaso",
                                params: {
                                    //pasarle los otros parametros necesarios para buscar lso datos del comprobante
                                    tipoDuo: scope.tipoDuo,
                                    arrayIdDuo: Ext.encode(scope.arrayIdDuo),
                                    arrayIdCuenta: Ext.encode(scope.idcuentas),
//                                    idCentroCosto: scope.idCentroCosto,
                                    idEstructuraDestino: scope.idEstructuraDestino,
                                    tipoContabilizacion: tipoContabilizacion
                                },
                                callback: function(options, success, response) {
                                    responseData = Ext.decode(response.responseText);
                                    // si existe la cuenta en el otro CC 
                                    if (responseData.dataComprobante) { //0 = no existe la cuenta, 1 = existe la cuenta
                                        //aki hacer fireEvent a fShowComprobante() que va a estar en ClassGestionarDuo
                                        parametros = {
                                            url: "addTraspasoDuo",
                                            tipoDuo: scope.tipoDuo,
                                            arrayIdDuo: scope.arrayIdDuo,
                                            arrayIdCuenta: scope.idcuentas,
//                                            idCentroCosto: scope.idCentroCosto,
//                                            idEstructuraCCosto: scope.idEstructuraDestino,
                                            idEstructuraDestino: scope.idEstructuraDestino,
                                            fechaTraspaso: scope.fechaContable,
                                            tipoContabilizacion: tipoContabilizacion
                                        };

//                                        tipoContabilizacion = 2;
                                        actionContabiliza = 'traspaso';
                                        scope.wTraspasoDuo.close();
                                        scope.fireEvent('contabilizar', {actionContabiliza: actionContabiliza, dataComprobante: responseData.dataComprobante, idObjeto: responseData.idObjeto, detalle: responseData.detalle, observacion: responseData.observacion, tipoContabilizacion: tipoContabilizacion, parametros: parametros});
                                    } else {
                                        Ext.MessageBox.hide();
                                        mostrarMensaje(1, ((scope.idcuentas.length > 1) ? scope.etiquetas.lbNoExistenCtasEnEntidad : scope.etiquetas.lbNoExisteCtaEnEntidad) + '</br>' + scope.etiquetas.lbSelOtraEntidad);
                                    }
                                }
                            });
                        }
                    }
                });
            }
        };
    }
});
