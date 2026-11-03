Ext.namespace('Ext.ClassAdicionarDuo');

Ext.ClassAdicionarDuo = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    nombreCliente: undefined,
    nombreFecha: undefined,
    action: undefined,
    titulo: undefined,
    dataDoc: undefined,
    msgExisteDuo: undefined,
    idDuo: undefined,
    opCuentaGasto: 0,
    factorConversion: undefined,
    tasaCompra: undefined,
    importeOperacion: '',
    importeContable: '',
    sumaTotal: 0,
    idespecialidad: undefined,
    objClassAnexoGasto: undefined,
    cantOpExcepcionales: undefined,
    arrAnexoOperaciones: [],
    etiquetas: undefined,
    fechaContable: undefined,
    url: undefined,
    confEspecialidad: false,
    confFechaRecepcion: true,
    constructor: function (etiquetas, params)
    {
        scope = this;
        this.etiquetas = etiquetas;
        Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbMsgLoadData);
        Ext.apply(this, params);
        this.tipoDuo = params.tipoDuo;
        this.action = params.action;
        this.idDuo = params.idDuo;
        this.dataDoc = params.dataDoc;
        this.url = params.url;
        this.confEspecialidad = params.confEspecialidad;
        this.confFechaRecepcion = params.confFechaRecepcion;
        this.classParams = params;
        this.factorConversion;
        this.tasaCompra;

        if (this.tipoDuo == 1)
        {
            this.nombreCliente = scope.etiquetas.lbCliente;//'Cliente';
            this.nombreFecha = scope.etiquetas.lbFechaEntrega;//'Fecha de entrega';
            this.msgExisteDuo = scope.etiquetas.lbMsgExisteDerecho;
            this.titulo = (this.action == 1) ? scope.etiquetas.lbAddDerecho : scope.etiquetas.lbModDerecho;
        }
        else if (this.tipoDuo == 2)
        {
            this.nombreCliente = scope.etiquetas.lbProveedor;//'Proveedor';
            this.nombreFecha = scope.etiquetas.lbFechaRecibo;//'Fecha de recibo';
            this.msgExisteDuo = scope.etiquetas.lbMsgExisteObligacion;
            this.titulo = (this.action == 1) ? scope.etiquetas.lbAddObligacion : scope.etiquetas.lbModObligacion;
        }
        else if (this.tipoDuo == 3)
        {
            this.nombreFecha = scope.etiquetas.lbFechaEntrega;//'Fecha de entrega';
            this.msgExisteDuo = scope.etiquetas.lbMsgExisteDerechoF;
            this.titulo = (this.action == 1) ? scope.etiquetas.lbAddDerechoF : scope.etiquetas.lbModDerechoF;
        }
        else if (this.tipoDuo == 4)
        {
            this.nombreFecha = scope.etiquetas.lbFechaRecibo;//'Fecha de recibo';
            this.msgExisteDuo = scope.etiquetas.lbMsgExisteObligacionF;
            this.titulo = (this.action == 1) ? scope.etiquetas.lbAddObligacionF : scope.etiquetas.lbModObligacionF;
        }

        this.stAddClienteProveedor = new Ext.data.Store({
            url: this.url + 'cargarcliente',
            sortInfo: {
                field: 'nombre',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'idclien'
            }, [{
                    name: 'idcliente',
                    mapping: 'idcliente'
                }, {
                    name: 'abreviatura',
                    mapping: 'abreviatura'
                }, {
                    name: 'nombre',
                    mapping: 'nombre'
                }, {
                    name: 'opeExcepional',
                    mapping: 'opeExcepional'
                }
            ])
        });

        this.stAddCondicionPago = new Ext.data.Store({
            url: this.url + 'loadDataCondPago',
            sortInfo: {
                field: 'denominacion',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'idcondpago'
            }, [{
                    name: 'idcondicionpago'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'plazo'
                }, {
                    name: 'dpp'
                }, {
                    name: 'mora'
                }, {
                    name: 'activo'
                }, {
                    name: 'iva'
                }
            ])
        });

        this.stAddCuenta = new Ext.data.Store({
            url: this.url + 'loadDataCuenta',
            sortInfo: {
                field: 'nombre',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'id'
            }, [{
                    name: 'idcuenta'
                }, {
                    name: 'nombre',
                    mapping: 'text'
                }, {
                    name: 'idnaturaleza'
                }
            ])
        });

        this.stAddTipoDoc = new Ext.data.Store({
            url: this.url + 'loadDataTipoDoc',
            sortInfo: {
                field: 'denominacion',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'iddoc'
            }, [{
                    name: 'iddoc',
                    mapping: 'iddoc'
                }, {
                    name: 'denominacion',
                    mapping: 'denominacion'
                }
            ])
        });

        this.stAddOperacion = new Ext.data.Store({
            url: this.url + 'loadDataOperacion',
            sortInfo: {
                field: 'denominacion',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'idopera'
            }, [{
                    name: 'idoperacion',
                    mapping: 'idoperacion'
                }, {
                    name: 'denominacion',
                    mapping: 'denominacion'
                }, {
                    name: 'codigoCuenta',
                    mapping: 'codigoCuenta'
                }, {
                    name: 'debitocredito',
                    mapping: 'debitocredito'
                }, {
                    name: 'idtipocuenta',
                    mapping: 'idtipocuenta'
                }, {
                    name: 'idcuenta',
                    mapping: 'idcuenta'
                }, {
                    name: 'nombrecuenta',
                    mapping: 'nombrecuenta'
                }, {
                    name: 'cuentagasto',
                    mapping: 'cuentagasto'
                }
            ]),
            listeners: {
                load: {
                    scope: this,
                    fn: function (st) {
                        this.stAddGridOperaciones.removeAll();
                        if (st.getCount() == 0) {
                            this.cbAddOperacion.disable();
                            mostrarMensaje(1, scope.etiquetas.lbMsgNoExisteOperaciones);
                        }
                        else if (st.getCount() == 1) {
                            this.fLoadOneData(this.cbAddOperacion, st, 'idoperacion', 'denominacion');
                            this.opCuentaGasto = st.getAt(0).get('cuentagasto');
                        }
                        else if (st.getCount() > 1)
                            this.cbAddOperacion.enable();
                    }
                }
            }
        });

        this.stAddMoneda = new Ext.data.Store({
            url: this.url + 'loadDataMoneda',
            sortInfo: {
                field: 'codigoiso',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'idmon'
            }, [{
                    name: 'idnommoneda',
                    mapping: 'idnommoneda'
                }, {
                    name: 'codigoiso',
                    mapping: 'codigoiso'
                }, {
                    name: 'nombremoneda',
                    mapping: 'nombremoneda'
                }, {
                    name: 'idnommonedaentidad',
                    mapping: 'idnommonedaentidad'
                }, {
                    name: 'isMonCont',
                    mapping: 'isMonCont'
                }, {
                    name: 'identidad',
                    mapping: 'identidad'
                }
            ])
        });

        this.stAddTasa = new Ext.data.Store({
            url: this.url + 'loadDataTasa',
            reader: new Ext.data.JsonReader({
                id: 'idtas'
            }, [{
                    name: 'descripcion',
                    mapping: 'nombretasa'
                }, {
                    name: 'factordeconversion',
                    mapping: 'factordeconversion'
                }, {
                    name: 'mostrar'
                }, {
                    name: 'compra',
                    mapping: 'compra'
                }, {
                    name: 'idtasa',
                    mapping: 'idtasa'
                }
            ]),
            listeners: {
                load: {
                    scope: this,
                    fn: function (st) {
                        if (st.getCount() == 0)
                        {
                            mostrarMensaje(1, scope.etiquetas.lbMsgNoExisteTasa);
                            this.cbAddTasa.disable();
                        }
                        else if (st.getCount() == 1) {
                            this.fLoadOneData(this.cbAddTasa, st, 'idtasa', 'mostrar');
                            scope.factorConversion = st.getAt(0).get('factordeconversion');
                            scope.tasaCompra = st.getAt(0).get('compra');
                        }
                        else
                            this.cbAddTasa.enable();
                    }
                }
            }
        });
        this.stAddNumeroContrato = new Ext.data.Store({
            url: this.url + 'loadDataContratos',
            reader: new Ext.data.JsonReader({
                id: 'idcont'
            }, [{
                    name: 'numerocontrato',
                    mapping: 'numerocontrato'
                }, {
                    name: 'idcontrato',
                    mapping: 'idcontrato'
                }
            ]),
            listeners: {
                load: {
                    scope: this,
                    fn: function (st) {
                        if (st.getCount() == 0)
                        {
                            mostrarMensaje(1, scope.etiquetas.lbMsgNoExisteContrato);
                            this.cbAddNumeroContrato.disable();
                        }
                        else if (st.getCount() == 1)
                            this.fLoadOneData(this.cbAddNumeroContrato, st, 'idcontrato', 'numerocontrato');
                        else
                            this.cbAddNumeroContrato.enable();
                    }
                }
            }
        });

        //sm del grig de operaciones
        this.smAddGridOperaciones = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.stAddGridOperaciones = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
            }, [{
                    name: 'operacion'
                }, {
                    name: 'idoperacion'
                }, {
                    name: 'idoperacioncontable'
                }, {
                    name: 'moneda'
                }, {
                    name: 'importe',
                    type: 'float'
                }, {
                    name: 'anexo'
                }, {
                    name: 'idanexo'
                }, {
                    name: 'factordeconversion'
                }, {
                    name: 'compra'
                }, {
                    name: 'importecontable',
                    type: 'float'
                }, {
                    name: 'cuenta'
                }, {
                    name: 'idcuenta'
                }, {
                    name: 'codigoCuenta'
                }, {
                    name: 'importaux',
                    type: 'float'
                }
            ])
        });

        this.wAdicionarDuo = new Ext.UIAdicionarDuo(this);
        this.initializeEvents(this);
        this.initializeFunctions(this);

        Ext.Ajax.request({
            url: this.url + 'loadDataAddDuo',
            method: 'POST',
            params: {
                idDuo: this.idDuo,
                tipoduo: this.tipoDuo,
                iddoc: (this.action == 2) ? this.dataDoc.data.iddoc : ''
            },
            callback: function (options, success, response)
            {
                responseData = Ext.decode(response.responseText);
                var mensaje = '';
                var mostrar = '<br> ' + scope.etiquetas.lbNoEjecAction + '<br> <br>';
                if (scope.tipoDuo == 1 || scope.tipoDuo == 2) {
                    if (!responseData.clienteProv.length)
                        mensaje += ('- ' + ((scope.tipoDuo == 1) ? scope.etiquetas.lbNoClientesConf : scope.etiquetas.lbNoProveedorConf) + '<br>');
                }
                else if (scope.tipoDuo == 3 || scope.tipoDuo == 4) {
                    if (!responseData.parrafoFiscal.length)
                        mensaje += '- ' + (scope.etiquetas.lbNoParrafosConf) + '<br>';
                }
                if (!responseData.condicionPago.length)
                    mensaje += '- ' + scope.etiquetas.lbNoCondicionPagoConf + '<br> ';
                else {
                    activo = false;
                    for (var i = 0; i < responseData.condicionPago.length; i++) {
                        if (responseData.condicionPago[i].activo == 1) {
                            condPago = responseData.condicionPago[i];
                            activo = true;
                            break;
                        }
                    }
                    if (!activo)
                        mensaje += '- ' + scope.etiquetas.lbNoCondicionPagoActiva + '<br> ';
                }

                if (!responseData.cuentas.length)
                    mensaje += '- ' + scope.etiquetas.lbNoCuentasConf + '<br> ';
                if (!responseData.tipoDocumentos.length)
                    mensaje += '- ' + scope.etiquetas.lbNoTipoDocConf + '<br> ';
                if (!responseData.monedas.length)
                    mensaje += '- ' + scope.etiquetas.lbNoMonedasConf + '<br> ';
                if (scope.confEspecialidad && !responseData.especialidades.length)
                    mensaje += '- ' + scope.etiquetas.lbNoEspecialidadConf + '<br> ';

                if (mensaje != '') {
                    mostrar += mensaje;
                    mostrarMensaje(1, mostrar, function (btn) {
                        scope.fireEvent('closeAdicionar', true);
                    });
                }
                else {
                    Ext.CONT.Componentes.HideBox('msgbIniciando');
                    scope.wAdicionarDuo.show(Ext.getBody(), function ()
                    {
                        scope.wAdicionarDuo.maximize(true);
                        scope.wAdicionarDuo.doLayout(true);
                        scope.loadDataComponent(responseData, condPago);
                    });
                }
            }
        });

        return Ext.ClassAdicionarDuo.superclass.constructor.call(this);
    },
    loadDataComponent: function (data, condPago)
    {
        if (scope.tipoDuo == 1 || scope.tipoDuo == 2)
            this.stAddClienteProveedor.loadData(data.clienteProv);
        else if (scope.tipoDuo == 3 || scope.tipoDuo == 4)
            Ext.getCmp('gpParrafo').getStore().loadData(data.parrafoFiscal);

        this.stAddCuenta.loadData(data.cuentas);
        this.stAddTipoDoc.loadData(data.tipoDocumentos);
        this.stAddCondicionPago.loadData(data.condicionPago);
        this.stAddMoneda.loadData(data.monedas);
        if (scope.confEspecialidad)
            Ext.getCmp('gpEspecialidad').getStore().loadData(data.especialidades);

        if (this.stAddMoneda.getCount() == 1)
            this.stAddTasa.loadData(data.tasas);
        if (data.operaciones.length)
            this.stAddOperacion.loadData(data.operaciones);

        scope.dfAddFechaEmision.setMinValue(data.periodo['inicio']);
        scope.dfAddFechaEntrega.setMinValue(data.periodo['inicio']);
        scope.dfAddFechaRecepcion.setMinValue(data.periodo['inicio']);
        scope.fechaContable = data.fechacontable;

        //CLIENTE-PROVEEDOR
        if (this.stAddClienteProveedor.getCount() == 1) {
            scope.fLoadOneData(scope.cbAddClienteProveedor, this.stAddClienteProveedor, 'idcliente', 'nombre');
            this.cantOpExcepcionales = this.stAddClienteProveedor.getAt(0).get('opeExcepional');
            this.stAddNumeroContrato.loadData(data.contratos);
        }
        else
            scope.cbAddClienteProveedor.enable();

        if (this.stAddNumeroContrato.getCount() <= 1) {
            scope.cbAddNumeroContrato.disable();
            if (this.stAddNumeroContrato.getCount() == 1) {
                scope.fLoadOneData(scope.cbAddNumeroContrato, this.stAddNumeroContrato, 'idcontrato', 'numerocontrato');
            }
        }
        else
            scope.cbAddNumeroContrato.enable();

        //ESPECIALIDAD
        if (scope.confEspecialidad) {
            if (Ext.getCmp('gpEspecialidad').getStore().getCount() == 1) {
                store = Ext.getCmp('gpEspecialidad').getStore();
                scope.cbAddEspecialidad.setValue(scope.jrEspecialidad.jsonData[0]['especialidad']);
                scope.cbAddEspecialidad.fSelect.values.push(scope.jrEspecialidad.jsonData[0]['idespecialidad']);
                scope.cbAddEspecialidad.fSelect.display.push(scope.jrEspecialidad.jsonData[0]['especialidad']);
            }
//                scope.fLoadOneData(scope.cbAddEspecialidad, Ext.getCmp('gpEspecialidad').getStore(), 'idespecialidad', 'text');
            else
                scope.cbAddEspecialidad.enable();
        }
        //CUENTA
        if (this.stAddCuenta.getCount() == 1)
            scope.fLoadOneData(scope.cbAddCuenta, this.stAddCuenta, 'idcuenta', 'nombre');
        else
            scope.cbAddCuenta.enable();

        //TIPO DOCUMENTO
        if (this.stAddTipoDoc.getCount() == 1)
            scope.fLoadOneData(scope.cbAddTipoDoc, this.stAddTipoDoc, 'iddoc', 'denominacion');
        else
            scope.cbAddTipoDoc.enable();

        //CONDICION DE PAGO
        if (this.stAddCondicionPago.getCount() == 1)
            scope.fLoadOneData(scope.cbAddCondicionPago, this.stAddCondicionPago, 'idcondicionpago', 'denominacion');
        else {
            scope.cbAddCondicionPago.enable();
            scope.cbAddCondicionPago.setValue(condPago.idcondicionpago);
            scope.cbAddCondicionPago.setRawValue(scope.stAddCondicionPago.getAt(scope.stAddCondicionPago.find('idcondicionpago', scope.cbAddCondicionPago.getValue())).data.denominacion);
        }

        //MONEDA
        if (this.stAddMoneda.getCount() == 1) {
            scope.fLoadOneData(scope.cbAddMoneda, this.stAddMoneda, 'idnommonedaentidad', 'codigoiso');
            //TASA
            if (this.stAddTasa.getCount() == 0) {
                mostrarMensaje(1, scope.etiquetas.lbMsgNoExisteTasa);
                scope.cbAddTasa.disable();
            }
            else if (this.stAddTasa.getCount() == 1) {
                scope.fLoadOneData(scope.cbAddTasa, this.stAddTasa, 'idtasa', 'mostrar');
                scope.factorConversion = this.stAddTasa.getAt(0).get('factordeconversion');
                scope.tasaCompra = this.stAddTasa.getAt(0).get('compra');
            }
            else
                scope.cbAddTasa.enable();
        }
        //OPERACION
        if (this.stAddCuenta.getCount() == 1 && this.stAddTipoDoc.getCount() == 1) {
            if (this.stAddOperacion.getCount() == 0) {
                scope.cbAddOperacion.disable();
                mostrarMensaje(1, scope.etiquetas.lbMsgNoExisteOperaciones);
            }
            else if (this.stAddOperacion.getCount() == 1) {
                scope.fLoadOneData(scope.cbAddOperacion, this.stAddOperacion, 'idoperacion', 'denominacion');
                this.opCuentaGasto = this.stAddOperacion.getAt(0).get('cuentagasto');
            }
            else if (this.stAddOperacion.getCount() > 1)
                scope.cbAddOperacion.enable();
        }
        //EN CASO DE QUE SE VAYA A MODIFICAR
        if (this.action == 2)
        {
            if (scope.tipoDuo == 1 || scope.tipoDuo == 2) {
                scope.cbAddClienteProveedor.setValue(this.dataDoc.data.idcliente);
                scope.cbAddClienteProveedor.setRawValue(this.dataDoc.data.nombrecliente);
            }
            else if (scope.tipoDuo == 3 || scope.tipoDuo == 4) {
                if (this.dataDoc.data.idcliente) {
                    store = Ext.getCmp('gpParrafo').getStore();
                    indexActual = store.find('idparrafofiscal', this.dataDoc.data.idcliente);
                    scope.cbAddParrafoFiscal.setValue(scope.jrParrafoFiscal.jsonData[indexActual]['descripcion']);
                    scope.cbAddParrafoFiscal.fSelect.values.push(scope.jrParrafoFiscal.jsonData[indexActual]['idparrafofiscal']);
                    scope.cbAddParrafoFiscal.fSelect.display.push(scope.jrParrafoFiscal.jsonData[indexActual]['descripcion']);
                }
            }

            if (scope.confEspecialidad && this.dataDoc.data.idespecialidad) {
                store = Ext.getCmp('gpEspecialidad').getStore();
                indexActual = store.find('idespecialidad', this.dataDoc.data.idespecialidad);
                scope.cbAddEspecialidad.setValue(scope.jrEspecialidad.jsonData[indexActual]['especialidad']);
                scope.cbAddEspecialidad.fSelect.values.push(scope.jrEspecialidad.jsonData[indexActual]['idespecialidad']);
                scope.cbAddEspecialidad.fSelect.display.push(scope.jrEspecialidad.jsonData[indexActual]['especialidad']);
            }

            scope.cbAddCuenta.setValue(this.dataDoc.data.idcuenta);
            scope.cbAddCuenta.setRawValue(this.dataDoc.data.text);

            scope.cbAddTipoDoc.setValue(this.dataDoc.data.iddoc);
            scope.cbAddTipoDoc.setRawValue(this.dataDoc.data.denominacion);

            scope.cbAddCondicionPago.setValue(this.dataDoc.data.idcondicionpago);
            scope.cbAddCondicionPago.setRawValue(scope.stAddCondicionPago.getAt(scope.stAddCondicionPago.find('idcondicionpago', scope.cbAddCondicionPago.getValue())).data.denominacion);

            scope.dfAddFechaEmision.setValue(this.dataDoc.data.fechaemision);
            scope.dfAddFechaEntrega.setValue(this.dataDoc.data.fechaentrega);

            scope.tfAddNumeroDocumento.setValue(this.dataDoc.data.numerodocumento);

            if (this.dataDoc.data.idcontrato) {
                scope.cbAddNumeroContrato.setValue(this.dataDoc.data.idcontrato);
                scope.cbAddNumeroContrato.setRawValue(this.dataDoc.data.numerocontrato);
            } else {
                scope.cbAddNumeroContrato.disable();
                scope.ckbAddExcepcional.setValue(true);
            }

            if (this.dataDoc.data.fecharecepcion)
                scope.dfAddFechaRecepcion.setValue(this.dataDoc.data.fecharecepcion);
            else if (scope.tipoDuo == 2 || scope.tipoDuo == 4) {
                scope.dfAddFechaRecepcion.disable();
                scope.ckbAddServicio.setValue(true);
            }
            scope.tfAddComentario.setValue(this.dataDoc.data.comentario);

            operaciones = data.gridOperaciones;
            if (operaciones != null) {
                var cantidad = operaciones.length;

                var rec = new Ext.data.Record.create([
                    {
                        name: 'operacion'
                    }, {
                        name: 'idoperacion'
                    }, {
                        name: 'idoperacioncontable'
                    }, {
                        name: 'moneda'
                    }, {
                        name: 'idmoneda'
                    }, {
                        name: 'importe'
                    }, {
                        name: 'anexo'
                    }, {
                        name: 'idanexo'
                    }, {
                        name: 'factordeconversion'
                    }, {
                        name: 'compra'
                    }, {
                        name: 'importecontable',
                        type: 'float'
                    }, {
                        name: 'cuenta'
                    }, {
                        name: 'idcuenta'
                    }, {
                        name: 'codigoCuenta'
                    }, {
                        name: 'importaux'
                    }, {
                        name: 'idtasa'
                    }, {
                        name: 'idregistroanexo'
                    }
                ]);

                for (var i = 0; i < cantidad; i++) {
                    var agregoper = new rec({
                        operacion: operaciones[i].operacion,
                        idoperacion: operaciones[i].idoperacion,
                        idoperacioncontable: operaciones[i].idoperacioncontable,
                        moneda: operaciones[i].moneda,
                        idmoneda: operaciones[i].idmoneda,
                        importaux: parseFloat(operaciones[i].importemb),
                        importe: parseFloat(operaciones[i].importemo),
                        iva: parseFloat(operaciones[i].importemo) - parseFloat(operaciones[i].importemb),
                        factordeconversion: operaciones[i].factordeconversion,
                        compra: operaciones[i].compra,
                        anexo: operaciones[i].anexo,
                        idtasa: operaciones[i].idtasa,
                        idcuenta: operaciones[i].idcuenta,
                        codigoCuenta: operaciones[i].nombrecuenta,
                        importecontable: parseFloat(operaciones[i].importemb),
                        idoperFind: operaciones[i].idoperacioncontable + operaciones[i].idmoneda + operaciones[i].idtasa
                    });

                    scope.gpAddGridOperaciones.getStore().add(agregoper);
                }
                scope.tfAddImporteTotal.setValue(scope.fSaldo(this.stAddGridOperaciones.sum('importecontable')));
            }
        }

        combo = (scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.cbAddClienteProveedor : scope.cbAddParrafoFiscal;

        if (!combo.disabled)
            combo.focus(true, 1000);
        else if (!scope.cbAddCuenta.disabled)
            scope.cbAddCuenta.focus(true, 1000);
        else if (scope.confEspecialidad && !scope.cbAddEspecialidad.disabled)
            scope.cbAddEspecialidad.focus(true, 1000);
        else if (!scope.cbAddTipoDoc.disabled)
            scope.cbAddTipoDoc.focus(true, 1000);
        else if (!scope.cbAddCondicionPago.disabled)
            scope.cbAddCondicionPago.focus(true, 1000);
        else
            scope.tfAddNumeroDocumento.focus(true, 1000);

    },
    loadMessageBox: function (msg)
    {
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
    initializeEvents: function (scope)
    {
        this.btnAddNuevo.on('click', function (component)
        {
            scope.fResetFields();
        });

        this.btnAddGuardar.on('click', function (component)
        {
            scope.fGuardarDatosDuo();
        });

        this.btnAddConfirmar.on('click', function (component)
        {
            scope.fConfirmarDuo();
        });

        this.btnAddOpAdicionar.on('click', function (component)
        {
            scope.fGestionarOperacion('ADD');
        });

        this.btnAddOpModificar.on('click', function (component)
        {
            scope.fGestionarOperacion('MOD');
        });

        this.btnAddOpEliminar.on('click', function (component)
        {
            scope.fGestionarOperacion('DEL');
        });

        this.btnAddOpCancelar.on('click', function (component)
        {
            scope.fGestionarOperacion('CANC');
        });

        this.addEvents('closeAdicionar');
        this.btnAddCerrar.on('click', function (component)
        {
            scope.wAdicionarDuo.close();
            scope.fireEvent('closeAdicionar', true);
        });

        this.addEvents('contabilizarAdicionar');
        this.btnAddContabilizar.on('click', function (component)
        {
            scope.fireEvent('contabilizarDuo', scope.idDuo);
        });

        this.ckbAddExcepcional.on('check', function ()
        {
            if (scope.ckbAddExcepcional.getValue() == true) {
                scope.cbAddNumeroContrato.reset();
                scope.cbAddNumeroContrato.setDisabled(true);
            }
            else {
                if (scope.stAddNumeroContrato.getCount() > 1) {
                    scope.cbAddNumeroContrato.setDisabled(false);
                    scope.cbAddNumeroContrato.focus();
                }
                else if (scope.stAddNumeroContrato.getCount() == 1) {
                    scope.cbAddNumeroContrato.setValue(scope.stAddNumeroContrato.getAt(0).get('idcontrato'));
                    scope.cbAddNumeroContrato.setRawValue(scope.stAddNumeroContrato.getAt(0).get('numerocontrato'));
                }
            }
        });

        this.ckbAddServicio.on('check', function ()
        {
            if (scope.ckbAddServicio.getValue() == true) {
                scope.dfAddFechaRecepcion.reset();
                scope.dfAddFechaRecepcion.setDisabled(true);
            }
            else {
                scope.dfAddFechaRecepcion.setDisabled(false);
                scope.dfAddFechaRecepcion.focus();
            }
        });

        this.cbAddClienteProveedor.on('select', function ()
        {
            this.cantOpExcepcionales = scope.stAddClienteProveedor.getAt(scope.stAddClienteProveedor.find('idcliente', scope.cbAddClienteProveedor.getValue())).data.opeExcepional;
            scope.fCargarContratos();
        });

        this.cbAddCuenta.on('select', function ()
        {
            if (scope.cbAddTipoDoc.getValue() && scope.cbAddCuenta.getValue())
                scope.fCargarOperaciones();
        });

        this.cbAddTipoDoc.on('select', function ()
        {
            if (scope.cbAddTipoDoc.getValue() && scope.cbAddCuenta.getValue())
                scope.fCargarOperaciones();
        });

        this.dfAddFechaEmision.on('change', function (thiscomp, newvalue, oldvalue)
        {
            scope.dfAddFechaRecepcion.setMinValue(newvalue);
            scope.dfAddFechaEntrega.setMinValue(newvalue);
        });

        this.dfAddFechaEntrega.on('change', function (thiscomp, newvalue, oldvalue)
        {
            scope.dfAddFechaRecepcion.setMinValue(newvalue);
            scope.dfAddFechaEmision.setMaxValue(newvalue);
        });

        this.dfAddFechaRecepcion.on('change', function (thiscomp, newvalue, oldvalue)
        {
            scope.dfAddFechaEntrega.setMaxValue(newvalue);
            scope.dfAddFechaEmision.setMaxValue(newvalue);
        });

        this.cbAddMoneda.on('select', function ()
        {
            if (scope.cbAddMoneda.getValue())
                scope.fCargarTasas();
        });

        this.cbAddTasa.on('select', function ()
        {
            dataTasa = scope.stAddTasa.getAt(scope.stAddTasa.find('idtasa', scope.cbAddTasa.getValue())).data;
            scope.factorConversion = dataTasa.factordeconversion;
            scope.tasaCompra = dataTasa.compra;
        });

        scope.cbAddOperacion.on('select', function ()
        {
            this.opCuentaGasto = scope.stAddOperacion.getAt(scope.stAddOperacion.find('idoperacion', scope.cbAddOperacion.getValue())).data.cuentagasto;
        });

        scope.smAddGridOperaciones.on('beforerowselect', function (smodel, rowIndex, keepExisting, record)
        {
            scope.btnAddOpAdicionar.disable();
            scope.btnAddOpModificar.enable();
            scope.btnAddOpEliminar.enable();
        }, this);

        scope.smAddGridOperaciones.on('rowselect', function (smodel, rowIndex, keepExisting, record)
        {
            scope.btnAddOpAdicionar.disable();
            scope.btnAddOpModificar.enable();
            scope.btnAddOpEliminar.enable();
            scope.btnAddOpCancelar.enable();

            //validar que si existe una sola operacion en el combo y es distinta a la que estoy seleccionando en el grid mostrar mensaje diciendo que no se puede modificar.
            scope.cbAddOperacion.setValue(scope.smAddGridOperaciones.getSelected().data.idoperacioncontable);
            scope.cbAddOperacion.setRawValue(scope.smAddGridOperaciones.getSelected().data.operacion);
            //validar que si existe una sola moneda en el combo y es distinta a la que estoy seleccionando en el grid mostrar mensaje diciendo que no se puede modificar.
            scope.cbAddMoneda.setValue(scope.smAddGridOperaciones.getSelected().data.idmoneda);
            scope.cbAddMoneda.setRawValue(scope.smAddGridOperaciones.getSelected().data.moneda);
            //validar que si existe una sola tasa en el combo y es distinta a la que estoy seleccionando en el grid mostrar mensaje diciendo que no se puede modificar.
            scope.cbAddTasa.setValue(scope.smAddGridOperaciones.getSelected().data.idtasa);
            scope.cbAddTasa.setRawValue(scope.smAddGridOperaciones.getSelected().data.compra);

            scope.factorConversion = scope.smAddGridOperaciones.getSelected().data.factordeconversion;
            scope.tasaCompra = scope.smAddGridOperaciones.getSelected().data.compra;

            scope.tfAddImporte.setValue(scope.smAddGridOperaciones.getSelected().data.importaux);
        }, this);

        scope.cbAddClienteProveedor.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                if (scope.confEspecialidad && !scope.cbAddEspecialidad.disabled)
                    scope.cbAddEspecialidad.focus(true, 10);
                else if (!scope.cbAddCuenta.disabled)
                    scope.cbAddCuenta.focus(true, 10);
                else if (!scope.cbAddTipoDoc.disabled)
                    scope.cbAddTipoDoc.focus(true, 10);
                else if (!scope.cbAddCondicionPago.disabled)
                    scope.cbAddCondicionPago.focus(true, 10);
                else
                    scope.tfAddNumeroDocumento.focus(true, 10);
            }
            else
                scope.fClearValue(e, this);
        });

        scope.cbAddParrafoFiscal.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                if (scope.confEspecialidad && !scope.cbAddEspecialidad.disabled)
                    scope.cbAddEspecialidad.focus(true, 10);
                else if (!scope.cbAddCuenta.disabled)
                    scope.cbAddCuenta.focus(true, 10);
                else if (!scope.cbAddTipoDoc.disabled)
                    scope.cbAddTipoDoc.focus(true, 10);
                else if (!scope.cbAddCondicionPago.disabled)
                    scope.cbAddCondicionPago.focus(true, 10);
                else
                    scope.tfAddNumeroDocumento.focus(true, 10);
            }
            else
                scope.fClearValue(e, this);
        });

        scope.cbAddEspecialidad.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                if (!scope.cbAddCuenta.disabled)
                    scope.cbAddCuenta.focus(true, 10);
                else if (!scope.cbAddTipoDoc.disabled)
                    scope.cbAddTipoDoc.focus(true, 10);
                else if (!scope.cbAddCondicionPago.disabled)
                    scope.cbAddCondicionPago.focus(true, 10);
                else
                    scope.tfAddNumeroDocumento.focus(true, 10);
            }
            else
                scope.fClearValue(e, this);
        });

        scope.cbAddCuenta.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                if (!scope.cbAddTipoDoc.disabled)
                    scope.cbAddTipoDoc.focus(true, 10);
                else if (!scope.cbAddCondicionPago.disabled)
                    scope.cbAddCondicionPago.focus(true, 10);
                else
                    scope.tfAddNumeroDocumento.focus(true, 10);
            }
            else
                scope.fClearValue(e, this);
        });

        scope.cbAddTipoDoc.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                if (!scope.cbAddCondicionPago.disabled)
                    scope.cbAddCondicionPago.focus(true, 10);
                scope.tfAddNumeroDocumento.focus(true, 10);
            } else
                scope.fClearValue(e, this);
        });

        scope.cbAddCondicionPago.on('keypress', function (t, e) {
            if (e.getKey() == 13)
                scope.tfAddNumeroDocumento.focus(true, 10);
            else
                scope.fClearValue(e, this);
        });

        scope.tfAddNumeroDocumento.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                if (!scope.cbAddNumeroContrato.disabled)
                    scope.cbAddNumeroContrato.focus(true, 10);
                else
                    scope.dfAddFechaEmision.focus(true, 10);
            }
        });

        scope.cbAddNumeroContrato.on('keypress', function (t, e) {
            if (e.getKey() == 13)
                scope.dfAddFechaEmision.focus(true, 10);
        });

        scope.dfAddFechaEmision.on('keypress', function (t, e) {
            if (e.getKey() == 13)
                scope.dfAddFechaEntrega.focus(true, 10);
            scope.fSetDefaultDate(e, this);
        });

        scope.dfAddFechaEntrega.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                if (!scope.dfAddFechaRecepcion.disabled)
                    scope.dfAddFechaRecepcion.focus(true, 10);
                else
                    scope.tfAddComentario.focus(true, 10);
            }
            scope.fSetDefaultDate(e, this);
        });

        scope.dfAddFechaRecepcion.on('keypress', function (t, e) {
            if (e.getKey() == 13)
                scope.tfAddComentario.focus(true, 10);
            scope.fSetDefaultDate(e, this);
        });

        scope.tfAddComentario.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                if (!scope.cbAddOperacion.disabled)
                    scope.cbAddOperacion.focus(true, 10);
                else if (!scope.cbAddMoneda.disabled)
                    scope.cbAddMoneda.focus(true, 10);
                else if (!scope.cbAddTasa.disabled)
                    scope.cbAddTasa.focus(true, 10);
                else
                    scope.tfAddImporte.focus(true, 10);
            }
        });

        scope.cbAddOperacion.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                if (!scope.cbAddMoneda.disabled)
                    scope.cbAddMoneda.focus(true, 10);
                else if (!scope.cbAddTasa.disabled)
                    scope.cbAddTasa.focus(true, 10);
                else
                    scope.tfAddImporte.focus(true, 10);
            }
            else
                scope.fClearValue(e, this);
        });

        scope.cbAddMoneda.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                if (!scope.cbAddTasa.disabled)
                    scope.cbAddTasa.focus(true, 10);
                else
                    scope.tfAddImporte.focus(true, 10);
            }
            else
                scope.fClearValue(e, this);
        });

        scope.cbAddTasa.on('keypress', function (t, e) {
            if (e.getKey() == 13)
                scope.tfAddImporte.focus(true, 10);
            else
                scope.fClearValue(e, this);
        });

        scope.tfAddImporte.on('keypress', function (t, e) {
            if (e.getKey() == 13)
                scope.fGestionarOperacion('ADD');
        });

        scope.tfAddImporte.on('blur', function (tf) {
            tf.setValue(scope.fSaldo(tf.getValue()));
        });
    },
    initializeFunctions: function (scope)
    {
        //fireevent a Confirmar en ClassGestionarDuo
        this.fConfirmarDuo = function ()
        {
            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbConfirmando);
            var arrayIdDuo = [];
            arrayIdDuo.push(scope.idDuo);
            Ext.Ajax.request({
                url: scope.url + 'confirmarDuo',
                method: 'POST',
                params: {
                    arrayIdDuo: Ext.encode(arrayIdDuo)
                },
                callback: function (options, success, response)
                {
                    responseData = Ext.decode(response.responseText);
                    respuesta = responseData;//.valor;
                    if (parseInt(respuesta) == 1) {
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        mostrarMensaje(1, scope.etiquetas.lbConfirmadoSatisf);
                        scope.btnAddConfirmar.disable();
                        scope.btnAddContabilizar.enable();
                    }
                    else
                        mostrarMensaje(1, scope.etiquetas.lbError);
                }
            });
        };

        this.fShowWindow = function ()
        {
            if (Ext.MessageBox)
                Ext.CONT.Componentes.HideBox('msgbIniciando');
            scope.wAdicionarDuo.show(Ext.getBody(), function ()
            {
                scope.wAdicionarDuo.maximize(true);
                scope.wAdicionarDuo.doLayout(true);
            });
        };

        this.fCargarOperaciones = function ()
        {
            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbMsgLoadOperaciones);
            this.cbAddOperacion.reset();
            this.stAddOperacion.load({
                params: {
                    iddoc: scope.cbAddTipoDoc.getValue(),
                    idcuenta: scope.cbAddCuenta.getValue(),
                    tipoduo: scope.tipoDuo
                },
                callback: function (record, success, response)
                {
                    Ext.CONT.Componentes.HideBox('msgbIniciando');
                    if (this.getCount()) {
                        scope.tfAddNumeroDocumento.focus(true, 10);
                    } else {
                        mostrarMensaje(1, scope.etiquetas.lbMsgNoExisteOperaciones, function (btn) {
                            if (btn == 'ok')
                                scope.cbAddTipoDoc.focus(true, 10);
                        });
                    }
                }
            });
        };

        this.fResetFields = function ()
        {
            scope.idDuo = '';
            if (scope.tipoDuo == 1 || scope.tipoDuo == 2) {
                if (scope.stAddClienteProveedor.getCount() > 1)
                    scope.cbAddClienteProveedor.enable();
            } else if (scope.tipoDuo == 3 || scope.tipoDuo == 4) {
                if (Ext.getCmp('gpParrafo').getStore().getCount() > 1)
                    scope.cbAddParrafoFiscal.enable();
            }

            if (scope.confEspecialidad) {
                if (Ext.getCmp('gpEspecialidad').getStore().getCount() > 1)
                    scope.cbAddEspecialidad.enable();
            }

            if (scope.stAddCuenta.getCount() > 1)
                scope.cbAddCuenta.enable();

            if (scope.stAddTipoDoc.getCount() > 1)
                scope.cbAddTipoDoc.enable();

            if (scope.stAddCondicionPago.getCount() > 1)
                scope.cbAddCondicionPago.enable();

            if (scope.stAddMoneda.getCount() > 1)
                scope.cbAddMoneda.enable();

            if (scope.stAddOperacion.getCount() > 1)
                scope.cbAddOperacion.enable();

            scope.stAddGridOperaciones.removeAll();
            scope.gpAddGridOperaciones.enable();
            scope.btnAddGuardar.enable();
            scope.tfAddComentario.enable();
            scope.tfAddImporteTotal.reset();
            scope.ckbAddExcepcional.reset();
            scope.ckbAddExcepcional.enable();
            scope.tfAddNumeroDocumento.reset();
            scope.tfAddNumeroDocumento.enable();
            scope.dfAddFechaEmision.reset();
            scope.dfAddFechaEmision.enable();
            scope.dfAddFechaEmision.setMinValue('');
            scope.dfAddFechaEmision.setMaxValue('');
            scope.dfAddFechaEntrega.reset();
            scope.dfAddFechaEntrega.enable();
            scope.dfAddFechaEntrega.setMinValue('');
            scope.dfAddFechaEntrega.setMaxValue('');
            scope.dfAddFechaRecepcion.reset();
            scope.dfAddFechaRecepcion.enable();
            scope.dfAddFechaRecepcion.setMinValue('');
            scope.dfAddFechaRecepcion.setMaxValue('');
            scope.btnAddOpAdicionar.enable();

            if (this.tipoDuo == 2) {
                scope.ckbAddServicio.reset();
                scope.ckbAddServicio.enable();
            }

            if (scope.stAddNumeroContrato.getCount() > 1)
                scope.cbAddNumeroContrato.enable();
            if (!scope.cbAddNumeroContrato.getValue())
                scope.cbAddNumeroContrato.reset();

            scope.btnAddConfirmar.disable();
            scope.btnAddContabilizar.disable();
            scope.tfAddImporte.reset();
            scope.tfAddImporte.enable();
        };

        this.fLoadOneData = function (combo, store, id, name)
        {
            combo.disable();
            combo.setValue(store.getAt(0).get(id));
            combo.setRawValue(store.getAt(0).get(name));
        };

        this.fGestionarOperacion = function (action)
        {
            if (scope.cbAddOperacion.getValue() != '' && scope.cbAddMoneda.getValue() != '' && scope.cbAddTasa.getValue() != '' && scope.tfAddImporte.getValue() != '')
            {
                this.opCuentaGasto = this.stAddOperacion.getAt(this.stAddOperacion.find('idoperacion', scope.cbAddOperacion.getValue())).data.cuentagasto;
                debCred = this.stAddOperacion.getAt(this.stAddOperacion.find('idoperacion', scope.cbAddOperacion.getValue())).data.debitocredito;
                idCuentaOperacion = this.stAddOperacion.getAt(this.stAddOperacion.find('idoperacion', scope.cbAddOperacion.getValue())).data.idcuenta;
                nombreCuentaOperacion = this.stAddOperacion.getAt(this.stAddOperacion.find('idoperacion', scope.cbAddOperacion.getValue())).data.nombrecuenta;

                if (action == 'CANC')
                {
                    scope.btnAddOpAdicionar.enable();
                    scope.btnAddOpModificar.disable();
                    scope.btnAddOpEliminar.disable();
                    scope.btnAddOpCancelar.disable();

                    this.smAddGridOperaciones.clearSelections();
                    scope.cbAddOperacion.reset();
                    scope.cbAddOperacion.focus();
                    scope.tfAddImporte.reset();
                }
                else if (action == 'DEL')
                {
                    this.stAddGridOperaciones.remove(this.smAddGridOperaciones.getSelected());
                    scope.btnAddOpAdicionar.enable();
                    scope.btnAddOpModificar.disable();
                    scope.btnAddOpEliminar.disable();
                }
                else
                {
                    if (this.opCuentaGasto)
                    {
                        creditoOriginal = scope.tfAddImporte.getValue();
                        importeOriginal = scope.tfAddImporte.getValue();

                        var indexAnexo = this.stAddGridOperaciones.find('idoperFind', scope.cbAddOperacion.getValue() + scope.cbAddMoneda.getValue() + scope.cbAddTasa.getValue())
                        arrAnexos = (indexAnexo > -1) ? {
                            dataStore: this.stAddGridOperaciones.getAt(indexAnexo).data.anexo
                        } : {};

                        this.objClassAnexoGasto = new Ext.ClassAnexoGasto(scope.gpAddGridOperaciones.getEl().dom, true, this.opCuentaGasto, idCuentaOperacion, nombreCuentaOperacion, 0, debCred, 0, 0, importeOriginal, creditoOriginal, arrAnexos);

                        // listValues = datos anexo
                        // importe = importe del desglose del anexo
                        // updateImporte = si es la primera cuenta de la operacion entonces true
                        // flagCredito = credito = true/debito = false
                        this.objClassAnexoGasto.addListener('sendingData', function (listValues, importe, updateImporte, flagCredito)
                        {
                            impOperacion = 0;
                            impContable = 0;
                            arrayAnexo = listValues;

                            Ext.CONT.Componentes.HideBox('msgbIniciando');

                            impContable = (impOperacion / parseFloat(scope.factorConversion)) * parseFloat(scope.tasaCompra);
                            var index = this.stAddGridOperaciones.find('idoperFind', scope.cbAddOperacion.getValue() + scope.cbAddMoneda.getValue() + scope.cbAddTasa.getValue());

                            if (index > -1)
                            {
                                if (action == 'MOD')
                                    impOperacion = parseFloat(importe);
                                else
                                    impOperacion = parseFloat(this.stAddGridOperaciones.getAt(index).data.importe) + parseFloat(importe);

                                impContable = (impOperacion / parseFloat(scope.factorConversion)) * parseFloat(scope.tasaCompra);
                            }
                            else
                            {
                                impOperacion = importe;
                                impContable = (impOperacion / parseFloat(scope.factorConversion)) * parseFloat(scope.tasaCompra);
                            }

                            if (listValues != '')
                            {
                                this.arrAnexoOperaciones.push(arrayAnexo);
                                this.fAdicionarOperacion(impOperacion, impContable, idCuentaOperacion, nombreCuentaOperacion, arrayAnexo);
                            }

                        }, this);

                        this.objClassAnexoGasto.addListener('close', function () {
                            scope.btnAddOpAdicionar.enable();
                            scope.cbAddOperacion.focus();
                        });
                    }
                    else
                    {
                        impOperacion = 0;
                        impContable = 0;
                        arrayAnexo = '';

                        var index = this.stAddGridOperaciones.find('idoperFind', scope.cbAddOperacion.getValue() + scope.cbAddMoneda.getValue() + scope.cbAddTasa.getValue());

                        if (index > -1)
                        {
                            if (action == 'MOD')
                                impOperacion = parseFloat(scope.tfAddImporte.getValue());
                            else
                                impOperacion = parseFloat(this.stAddGridOperaciones.getAt(index).data.importe) + parseFloat(scope.tfAddImporte.getValue());

                            impContable = (impOperacion / parseFloat(scope.factorConversion)) * parseFloat(scope.tasaCompra);
                        }
                        else
                        {
                            impOperacion = parseFloat(scope.tfAddImporte.getValue());
                            impContable = (impOperacion / parseFloat(scope.factorConversion)) * parseFloat(scope.tasaCompra);
                        }

                        this.fAdicionarOperacion(impOperacion, impContable, idCuentaOperacion, nombreCuentaOperacion, arrayAnexo);
                    }

                    scope.btnAddOpModificar.disable();
                    scope.btnAddOpEliminar.disable();
                    scope.btnAddOpCancelar.disable();
                }

                (this.stAddGridOperaciones.getCount() != 0) ? scope.cbAddCondicionPago.disable() : scope.cbAddCondicionPago.enable();

                scope.tfAddImporteTotal.setValue(scope.fSaldo(this.stAddGridOperaciones.sum('importecontable')));
            }
            else
            {
                scope.cbAddOperacion.isValid();
                scope.cbAddMoneda.isValid();
                scope.cbAddTasa.isValid();
                scope.tfAddImporte.isValid();
                mostrarMensaje(1, scope.etiquetas.lbValIncorrectos, function (btn) {
                    if (btn == 'ok') {
                        if (!scope.cbAddOperacion.getValue())
                            scope.cbAddOperacion.focus(true, 10);
                        else if (!scope.cbAddMoneda.getValue())
                            scope.cbAddMoneda.focus(true, 10);
                        else if (!scope.cbAddTasa.getValue())
                            scope.cbAddTasa.focus(true, 10);
                        else if (!scope.tfAddImporte.getValue())
                            scope.tfAddImporte.focus(true, 10);
                    }
                });
            }
        };

        this.fAdicionarOperacion = function (impOperacion, impContable, idCuentaOperacion, nombreCuentaOperacion, arrayAnexo)
        {
            // asi cojo el valor del iva (HACERLO EN EL SELECTION DEL COMBO Y EN EL ENTER)
            porcientoIVA = scope.stAddCondicionPago.getAt(scope.stAddCondicionPago.find('idcondicionpago', scope.cbAddCondicionPago.getValue())).data.iva;
            if (porcientoIVA == 0)
                valorIVA = 0;
            else
                valorIVA = parseFloat(impOperacion) * parseFloat(porcientoIVA) / 100;
            importeMo = impOperacion + valorIVA;
            var rec = new Ext.data.Record.create([
                {
                    name: 'operacion'
                }, {
                    name: 'idoperacion'
                }, {
                    name: 'moneda'
                }, {
                    name: 'anexo'
                }, {
                    name: 'idanexo'
                }, {
                    name: 'idmoneda'
                }, {
                    name: 'importe'
                }, {
                    name: 'importemo'
                }, {
                    name: 'iva'
                }, {
                    name: 'compra'
                }, {
                    name: 'factordeconversion'
                }, {
                    name: 'idtasa'
                }, {
                    name: 'importecontable'
                }, {
                    name: 'cuenta'
                }, {
                    name: 'idcuenta'
                }, {
                    name: 'codigoCuenta'
                }, {
                    name: 'importaux'
                }, {
                    name: 'idregistroanexo'
                }
            ]);

            var index = this.stAddGridOperaciones.find('idoperFind', scope.cbAddOperacion.getValue() + scope.cbAddMoneda.getValue() + scope.cbAddTasa.getValue());

            agreg = new rec({
                operacion: scope.cbAddOperacion.getRawValue(),
                idoperacioncontable: scope.cbAddOperacion.getValue(),
                idoperacion: (index > -1) ? this.stAddGridOperaciones.getAt(index).data.idoperacion : '',
                moneda: scope.cbAddMoneda.getRawValue(),
                anexo: arrayAnexo, // SE GUARDAN LOS ANEXOS DE ESTA OPERACION
                idmoneda: scope.cbAddMoneda.getValue(),
                importe: importeMo,
                iva: valorIVA,
                importaux: parseFloat(impOperacion), // * parseFloat(scope.factorConversion),
                importecontable: importeMo, //este importecontable es para el sum del grid
                compra: scope.cbAddTasa.getRawValue(),
                idtasa: scope.cbAddTasa.getValue(),
                factordeconversion: parseFloat(scope.factorConversion),
                idcuenta: idCuentaOperacion,
                codigoCuenta: nombreCuentaOperacion,
                idoperFind: scope.cbAddOperacion.getValue() + scope.cbAddMoneda.getValue() + scope.cbAddTasa.getValue()
            });

            if (index > -1)
            {
                this.stAddGridOperaciones.remove(this.stAddGridOperaciones.getAt(index));
                this.stAddGridOperaciones.insert(index, agreg);
            }
            else
                scope.gpAddGridOperaciones.getStore().add(agreg);

            scope.tfAddImporteTotal.setValue(scope.fSaldo(this.stAddGridOperaciones.sum('importe')));

            scope.btnAddOpAdicionar.enable();
            scope.tfAddImporte.reset();
            scope.tfAddImporte.focus();
        };

        this.fGuardarDatosDuo = function ()
        {
            if (scope.fpAddDuo.getForm().isValid() && scope.tfAddComentario.isValid())
            {
                if (this.stAddGridOperaciones.getCount() != 0)
                {
                    if (scope.ckbAddExcepcional.getValue() == false && scope.cbAddNumeroContrato.getValue() == '')
                        scope.cbAddNumeroContrato.markInvalid(scope.etiquetas.lbFactExcepcional);
                    else
                    {
                        if (this.cantOpExcepcionales > 0 && scope.ckbAddExcepcional.getValue() == true)
                            this.comprobarOpExcepcionales();
                        else
                            this.fGuardarDatos();
                    }
                }
                else
                    mostrarMensaje(1, scope.etiquetas.lbNoOperGrid);
            }
            else
            {
                if (!scope.tfAddComentario.isValid())
                    scope.tfAddComentario.markInvalid(scope.etiquetas.lbBlankText);
                mostrarMensaje(1, scope.etiquetas.lbValIncorrectos);
            }
        };

        this.fCargarTasas = function ()
        {
            scope.cbAddTasa.reset();
            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbMsgLoadTasa);
            this.stAddTasa.load({
                params: {
                    idmoneda: scope.cbAddMoneda.getValue()
                },
                callback: function (options, success, response) {
                    Ext.CONT.Componentes.HideBox('msgbIniciando');
                }
            });
        };

        this.fCargarContratos = function ()
        {
            scope.cbAddNumeroContrato.reset();
            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbMsgLoadContrato);
            this.stAddNumeroContrato.load({
                params: {
                    idcliente: scope.cbAddClienteProveedor.getValue()
                },
                callback: function (options, success, response) {
                    Ext.CONT.Componentes.HideBox('msgbIniciando');
                }
            });
        };

        this.comprobarOpExcepcionales = function ()
        {
            Ext.Msg.show({
                title: scope.etiquetas.lbBtnCerrar,
                buttons: Ext.Msg.YESNO,
                msg: ((scope.tipoDuo == 1 || scope.tipoDuo == 3) ? scope.etiquetas.lbCantOperExcepD : scope.etiquetas.lbCantOperExcepO) + scope.cantOpExcepcionales + '<br>' + scope.etiquetas.lbContinuar,
                icon: Ext.MessageBox.QUESTION,
                fn: scope.fAccionesExcepcional
            });
        };

        this.fAccionesExcepcional = function (btn)
        {
            if (btn == 'yes') //SI VOY A ADICIONAR UNA FACTURA EXCEPCIONAL
                scope.fGuardarDatos();
        };

        this.fGuardarDatos = function ()
        {
            var arrOperaciones = [];
            for (var i = 0; i < this.stAddGridOperaciones.getCount(); i++)
                arrOperaciones.push(this.stAddGridOperaciones.getAt(i).data);

            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbGuardando);
            Ext.Ajax.request({
                url: this.url + 'addDuo',
                method: 'POST',
                params: {
                    tipoduo: this.tipoDuo,
                    idDuo: scope.idDuo,
                    idcliente: (this.tipoDuo == 1 || this.tipoDuo == 2) ? scope.cbAddClienteProveedor.getValue() : Ext.getCmp('cbxParrafo').fSelect.values,
                    idcuenta: scope.cbAddCuenta.getValue(),
                    //adicionarlo al params de otra manera
                    //crear el params y si lleva especialidad add al params los valores de la especialidad
                    textespecialidad: scope.cbAddEspecialidad.getRawValue(),
                    idespecialidad: Ext.getCmp('cbxEspecialidad').fSelect.values,
                    idtipodocumento: scope.cbAddTipoDoc.getValue(),
                    idcondicionpago: scope.cbAddCondicionPago.getValue(),
                    numerodocumento: scope.tfAddNumeroDocumento.getValue(),
                    idcontrato: scope.cbAddNumeroContrato.getValue(),
                    fechaemision: scope.dfAddFechaEmision.getRawValue(),
                    fechaentrega: scope.dfAddFechaEntrega.getRawValue(),
                    fecharecepcion: scope.dfAddFechaRecepcion.getRawValue(),
                    comentario: scope.tfAddComentario.getValue(),
                    operaciones: Ext.encode(arrOperaciones),
                    importemb: scope.tfAddImporteTotal.getValue()
                },
                callback: function (options, success, response)
                {
                    Ext.CONT.Componentes.HideBox('msgbIniciando');
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 10)
                    {
                        scope.idDuo = responseData.respuesta;
                        scope.btnAddGuardar.disable();
                        scope.btnAddConfirmar.enable();
                        scope.gpAddGridOperaciones.disable();
                        scope.tfAddComentario.disable();
                        scope.tfAddImporteTotal.disable();
                        scope.cbAddCuenta.disable();
                        scope.cbAddOperacion.disable();
                        scope.cbAddTasa.disable();
                        if (scope.confEspecialidad)
                            scope.cbAddEspecialidad.disable();
                        scope.cbAddTipoDoc.disable();
                        scope.cbAddCondicionPago.disable();
                        scope.cbAddClienteProveedor.disable();
                        scope.tfAddNumeroDocumento.disable();
                        scope.cbAddNumeroContrato.disable();
                        scope.dfAddFechaEmision.disable();
                        scope.dfAddFechaRecepcion.disable();
                        scope.dfAddFechaEntrega.disable();
                        scope.ckbAddExcepcional.disable();
                        scope.cbAddOperacion.disable();
                        scope.cbAddMoneda.disable();
                        scope.cbAddTasa.disable();
                        scope.tfAddImporte.disable();
                        scope.btnAddOpAdicionar.disable();
                        scope.btnAddOpModificar.disable();
                        scope.btnAddOpEliminar.disable();
                        scope.btnAddOpCancelar.disable();
                        if (scope.tipoDuo == 2 || scope.tipoDuo == 4)
                            scope.ckbAddServicio.disable();

                        mostrarMensaje(1, (scope.action == 1) ? scope.etiquetas.lbGuardadoSatisf : scope.etiquetas.lbModificadoSatisf);
                    }
                    else
                        mostrarMensaje(1, scope.msgExisteDuo);
                }
            });
        };

        this.createToolTip = function (v, m, r)
        {
            m.attr = ' ext:qtip="';
            if (!Ext.isEmpty(r.data.operacion))
                m.attr += '<b>' + scope.etiquetas.lbOperacion + ': </b>' + r.data.operacion + '</br>';
            if (!Ext.isEmpty(r.data.moneda))
                m.attr += '<b>' + scope.etiquetas.lbMoneda + ': </b>' + r.data.moneda + '</br>';
            if (!Ext.isEmpty(r.data.compra))
                m.attr += '<b>' + scope.etiquetas.lbTasa + ': </b>' + r.data.compra + '</br>';
            if (!isNaN(parseFloat(r.data.importe)))
                m.attr += '<b>' + scope.etiquetas.lbImporte + ': </b>' + r.data.importe + '</br>';
            if (!Ext.isEmpty(r.data.importecontable))
                m.attr += '<b>' + scope.etiquetas.lbImporteContable + ': </b>' + r.data.importecontable + '</br>';
            m.attr += '"';
            return v;
        };

        this.fSaldo = function (v) {
            if (v == '')
                return '0.00';
            v = (Math.round((v - 0) * 100)) / 100;
            v = (v < 0) ? v * (-1) : v;
            if (isNaN(v))
                return '0.00';
            return v.toFixed(2);
        };

        this.fClearValue = function (e, combo, rango)
        {
            if ((e.getKey() == 8) || (e.getKey() == 46)) // suprimir y borrar
                combo.clearValue();
            return;
        };

        this.fSetDefaultDate = function (e, datefield)
        {
            if (e.getKey() == 13) // Enter
            {
                if (!datefield.getValue())
                    datefield.setValue(scope.fechaContable);
            }
            return;
        };
    }
});