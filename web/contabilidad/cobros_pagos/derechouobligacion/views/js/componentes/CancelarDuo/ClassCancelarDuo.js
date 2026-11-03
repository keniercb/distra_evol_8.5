Ext.namespace('Ext.ClassCancelarDuo');
Ext.ClassCancelarDuo = Ext.extend(Ext.Component, {
    etiquetas: undefined,
    cInicial: undefined,
    numeros: undefined,
    tipoDuo: undefined,
    arrayIdDuo: undefined,
    estadoDoc: undefined,
    url: undefined,
    constructor: function (etiquetas, params) {
        this.etiquetas = etiquetas;
        scope = this;
        Ext.apply(this, params);
        this.cInicial = params.cInicial;
        this.arrayIdDuo = params.arrayIdDuo;
        this.numeros = params.arrayNumCancelar;
        this.tipoDuo = params.tipoDuo;
        this.estadoDoc = params.estadoDoc;
        this.tipoDuo = params.tipoDuo;
        this.url = params.url;

        this.stCancelarMotivo = new Ext.data.Store({
            url: scope.url + 'cargarmotivocancelacion',
            sortInfo: {
                field: 'descripcion',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'idmotivocancelacion'
            }, [{
                    name: 'idmotivocancelacion'
                },
                {
                    name: 'descripcion'
                }
            ])
        });

        //        this.stCancelarOperacion = new Ext.data.Store({
        //            url: scope.url + 'cargaroperacioncancelacion',
        //            reader: new Ext.data.JsonReader({
        //                id: 'idoperacion'
        //            }, [{
        //                    name: 'idoperacion'
        //                },
        //                {
        //                    name: 'denominacion'
        //                }
        //            ])
        //        });

        // this.wCancelarDuo = new Ext.UICancelarDuo(this);
        this.wCancelarDuo = new CON.Util.WindowMotivoCancelacion({
            fechaDoc: this.fechaDoc,
            fechaFin: this.fechaFin,
            fechaContable: this.fechaContable,
            fechaInicial: this.fechaInicial,
        });
        this.initializeEvents(this);
        this.initializeFunctions(this);

        Ext.Ajax.request({
            url: scope.url + 'loadDataCancelDuo',
            method: 'POST',
            params: {
                tipoduo: this.tipoDuo,
                idestado: this.estadoDoc,
                arrayIdDuo: Ext.encode(this.arrayIdDuo)
            },
            callback: function (options, success, response) {
                Ext.getBody().unmask();
                responseData = Ext.decode(response.responseText);
                if (responseData.motivos == '') {
                    mostrarMensaje(1, scope.etiquetas.lbNoMotCancel);
                } else if (responseData.cod == -1) {
                    mostrarMensaje(1, 'El estado del documento ha cambiado.');
                } else if (responseData.cod == -2) {
                    mostrarMensaje(1, 'El estado del documento ha cambiado.');
                } else if (responseData.cod == 1) {
                    scope.loadDataComponent(responseData, this.action);

                }
            }
        });

        return Ext.ClassCancelarDuo.superclass.constructor.call(this);
    },
    loadDataComponent: function (data, action) {
        // scope.fShowWindow();
        this.wCancelarDuo.show();

        //        this.stCancelarOperacion.loadData(data.operaciones);
        // this.stCancelarMotivo.loadData(data.motivos);

        //Motivos de cancelacion
        // if (this.stCancelarMotivo.getCount() == 1) {
        //     scope.cbCancelarMotivo.disable();
        //     scope.cbCancelarMotivo.setValue(this.stCancelarMotivo.getAt(0).get('idmotivocancelacion'));
        //     scope.cbCancelarMotivo.setRawValue(this.stCancelarMotivo.getAt(0).get('descripcion'));
        // } else
        //     scope.cbCancelarMotivo.enable();

        //Operaciones de cancelacion
        //        if (this.stCancelarOperacion.getCount() == 1) {
        //            scope.cbCancelarOperacion.disable();
        //            scope.cbCancelarOperacion.setValue(this.stCancelarOperacion.getAt(0).get('idoperacion'));
        //            scope.cbCancelarOperacion.setRawValue(this.stCancelarOperacion.getAt(0).get('denominacion'));
        //        }
        //        else
        //            scope.cbCancelarOperacion.enable();

        /*if (!scope.cbCancelarMotivo.disabled)
            scope.cbCancelarMotivo.focus(true, 1000);
        else
            scope.dfCancelarFecha.focus(true, 1000);*/
    },
    loadMessageBox: function (msg) {
        Ext.MessageBox.show({
            title: scope.etiquetas.lbMsgEspere,
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
    initializeEvents: function (scope) {
        this.addEvents('closeCancelar');
        this.addEvents('cancelarDuo');
        scope.wCancelarDuo.on({
            'CerrarVentana': function () {
                scope.fireEvent('closeCancelar', true);
            },
            'AceptarMotivo': function (idmotivo, motivo, fecha) {
                scope.fCancelarDuo(idmotivo, motivo, fecha);
            }
        });
        // this.btnCancelarCerrar.on('click', function (component) {
        //     scope.wCancelarDuo.close();
        //     scope.fireEvent('closeCancelar', true);
        // });

        // this.btnCancelarAceptar.on('click', function (component) {
        //     if (scope.cbCancelarMotivo.isValid() /* && scope.dfCancelarFecha.isValid()*/ ) {
        //         //                if (scope.cInicial == 1) {
        //         //                    if (scope.cbCancelarOperacion.isValid())
        //         //                        scope.fCancelarDuo();
        //         //                }
        //         //                else
        //         scope.fCancelarDuo();
        //     } else
        //         mostrarMensaje(1, scope.etiquetas.lbValIncorrectos);
        // });

        // scope.cbCancelarMotivo.on('select', function (t, e) {
        //     scope.btnCancelarAceptar.enable();
        // });

        // scope.cbCancelarMotivo.on('keypress', function (t, e) {
        //     if (e.getKey() == 13) {
        //         if (!scope.dfCancelarFecha.disabled)
        //             scope.dfCancelarFecha.focus(true, 10);
        //     }
        // });
    },
    //CREAR EN GESTIONARDUO FUNCTION PARA GUARDAR CANCEL
    //            Ext.Ajax.request({
    //                                            url: scope.url + 'cancelarDuo',
    //                                            method: 'POST',
    //                                            params: {
    //                                                motivo: scope.cbCancelarMotivo.getValue(),
    //                                                cInicial: scope.cInicial,
    //                                                arrayIdDuo: Ext.encode(scope.arrayIdDuo),
    //                                                tipoDuo: scope.tipoDuo,
    //                                                estadoDoc: scope.estadoDoc,
    //                                                fecha: scope.dfCancelarFecha.getRawValue(),
    //                                                idoperacion: scope.cbCancelarOperacion.getValue(),
    //                                                descripcion: descripcion_comprobante,
    //                                                detalle: detalle,
    //                                                fechaCO: fecha_comprobante
    //                                            },
    //                                            callback: function(options, success, response)
    //                                            {
    //                                                responseData = Ext.decode(response.responseText);
    //                                                respuesta = responseData.valor;
    //                                                arrayNumCO = responseData.numCO;
    //                                                if (respuesta == 1 || respuesta == '1')
    //                                                    scope.fireEvent('cancelarDuo', arrayNumCO);
    //                                            }
    //                                        });
    initializeFunctions: function (scope) {
        this.fCancelarDuo = function (idmotivo, motivo, fecha) {
            scope.wCancelarDuo.close();
            if (scope.estadoDoc == 4) {
                parametros = {
                    url: "cancelarDuo",
                    tipoDuo: scope.tipoDuo,
                    arrayIdDuo: scope.arrayIdDuo,
                    motivo: idmotivo,
                    nomMotivo: motivo,
                    cInicial: scope.cInicial,
                    estadoDoc: scope.estadoDoc,
                    fecha: fecha
                    //                    idoperacion: scope.cbCancelarOperacion.getValue()
                };
                tipoContabilizacion = 2;
                actionContabiliza = 'cancelarContabilizado';
                scope.fireEvent('cancelarContabilizado', {
                    actionContabiliza: actionContabiliza,
                    tipoContabilizacion: tipoContabilizacion,
                    parametros: parametros
                });
            } else {
                scope.loadMessageBox(scope.etiquetas.lbCancelando);
                Ext.Ajax.request({
                    url: scope.url + 'cancelarDuo',
                    method: 'POST',
                    params: {
                        tipoDuo: scope.tipoDuo,
                        arrayIdDuo: Ext.encode(scope.arrayIdDuo),
                        motivo: idmotivo,
                        cInicial: scope.cInicial,
                        estadoDoc: scope.estadoDoc,
                        fecha: fecha
                        //                        idoperacion: scope.cbCancelarOperacion.getValue()
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        respuesta = responseData.valor;
                        if (parseInt(respuesta) == 1)
                            scope.fireEvent('cancelarDuo');
                        //                            scope.fireEvent('cancelarDuo', '');
                        else
                            mostrarMensaje(1, scope.etiquetas.lbError);
                    }
                });
            }
        };

        //this.fCancelarDuo = function()
        //        {
        //            scope.wCancelarDuo.close();
        //            if (scope.estadoDoc == 4)
        //            {
        //                Ext.Ajax.request({
        //                    url: scope.url + 'obtenerDatosComprobante',
        //                    method: 'POST',
        //                    params: {
        //                        arrayIdDuo: Ext.encode(scope.arrayIdDuo),
        //                        idoperacion: scope.cbCancelarOperacion.getValue()
        //                    },
        //                    callback: function(options, success, response)
        //                    {
        //                        responseData = Ext.decode(response.responseText);
        //                        var comprobante = responseData;
        //                        wi_comprobante = new Ext.UCID.WinIframe({
        //                            title: 'Comprobante tipo de operaciones',
        //                            id: 'idcomprobante',
        //                            idIframe: 'idWinIframeComp',
        //                            url: scope.url + 'mostrarComprobanteTipo',
        //                            params: {
        //                                co: comprobante,
        //                                opcion: 1, //cancelar
        //                                motivo: scope.cbCancelarOperacion.getRawValue()
        //                            },
        //                            modal: true,
        //                            closable: false,
        //                            listeners: {
        //                                'hide': function(t)
        //                                {
        //                                    if (cancelar == true)
        //                                    {
        //                                        cancelar = false;
        //                                        scope.loadMessageBox(scope.etiquetas.lbCancelando);
        //                                        Ext.Ajax.request({
        //                                            url: scope.url + 'cancelarDuo',
        //                                            method: 'POST',
        //                                            params: {
        //                                                motivo: scope.cbCancelarMotivo.getValue(),
        //                                                cInicial: scope.cInicial,
        //                                                arrayIdDuo: Ext.encode(scope.arrayIdDuo),
        //                                                tipoDuo: scope.tipoDuo,
        //                                                estadoDoc: scope.estadoDoc,
        //                                                fecha: scope.dfCancelarFecha.getRawValue(),
        //                                                idoperacion: scope.cbCancelarOperacion.getValue(),
        //                                                descripcion: descripcion_comprobante,
        //                                                detalle: detalle,
        //                                                fechaCO: fecha_comprobante
        //                                            },
        //                                            callback: function(options, success, response)
        //                                            {
        //                                                responseData = Ext.decode(response.responseText);
        //                                                respuesta = responseData.valor;
        //                                                arrayNumCO = responseData.numCO;
        //                                                if (respuesta == 1 || respuesta == '1')
        //                                                    scope.fireEvent('cancelarDuo', arrayNumCO);
        //                                            }
        //                                        });
        //                                    }
        //                                }
        //                            }
        //                        });
        //                        wi_comprobante.show();
        //                        wi_comprobante.doLayout();
        //                        wi_comprobante.maximize();
        //                    }
        //                });
        //            }
        //            else
        //            {
        //                scope.loadMessageBox(scope.etiquetas.lbCancelando);
        //                Ext.Ajax.request({
        //                    url: scope.url + 'cancelarDuo',
        //                    method: 'POST',
        //                    params: {
        //                        motivo: scope.cbCancelarMotivo.getValue(),
        //                        cInicial: scope.cInicial,
        //                        arrayIdDuo: Ext.encode(scope.arrayIdDuo),
        //                        tipoDuo: scope.tipoDuo,
        //                        estadoDoc: scope.estadoDoc,
        //                        fecha: scope.dfCancelarFecha.getRawValue(),
        //                        idoperacion: scope.cbCancelarOperacion.getValue()
        //                    },
        //                    callback: function(options, success, response)
        //                    {
        //                        responseData = Ext.decode(response.responseText);
        //                        respuesta = responseData.valor;
        //                        if (parseInt(respuesta) == 1)
        //                            scope.fireEvent('cancelarDuo');
        ////                            scope.fireEvent('cancelarDuo', '');
        //                        else
        //                            mostrarMensaje(1, scope.etiquetas.lbError);
        //                    }
        //                });
        //            }
        //        };

        this.fShowWindow = function () {
            scope.wCancelarDuo.show(Ext.getBody(), function () {
                scope.wCancelarDuo.doLayout(true);
                if (Ext.MessageBox)
                    Ext.MessageBox.hide();
            });
        };
    }
});
