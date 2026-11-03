Ext.namespace('Ext.ClassAdicionarDuo');

Ext.ClassAdicionarDuo = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    aperturado: undefined,
    nombreCliente: undefined,
    nombreFecha: undefined,
    action: undefined,
    titulo: undefined,
    dataDoc: undefined,
    msgExisteDuo: undefined,
    idDuo: undefined,
    opCuentaGasto: 0,
    opTipoCuenta: 0,
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
    confEspecialidad: true,
    msgAddMod: undefined,
    idclienteproveedor: -1,
    idcuenta: undefined,
    idMoneda: undefined,
    idCuenta: undefined,
    concatCta: undefined,
    idModelo: undefined,
    idOperacion: undefined,
    contador: 0,
    adiciono: false,
    lmask: undefined,
    fechaPeriodoInicio: undefined,
    fechaPeriodoFin: undefined,
    constructor: function (etiquetas, params) {
        scope = this;
        this.etiquetas = etiquetas;
        Ext.apply(this, params);
        this.tipoDuo = params.tipoDuo;
        this.aperturado = params.aperturado;
        this.action = params.action;
        this.idDuo = params.idDuo;
        this.dataDoc = params.dataDoc;
        this.url = params.url;
        this.confEspecialidad = params.confEspecialidad;
        this.classParams = params;
        this.factorConversion;
        this.tasaCompra;
        this.index;
        this.idMoneda;
        this.idCuenta;
        this.concatCta;
        this.idcuenta;
        this.idModelo;
        this.idOperacion;
        this.contador;
        this.adiciono;
        this.actionAplicar;
        this.plazoDias;
        if (this.action == 1) {
            this.titulo = scope.etiquetas.tlAddDuo.replace('<#tipoDuo>', this.textDuo.toLowerCase());
        } else if (this.action == 2) {
            this.titulo = scope.etiquetas.tlModDuo.replace('<#tipoDuo>', this.textDuo.toLowerCase());
        } else if (this.action == 3) {
            this.titulo = 'Ver ' + this.textDuo.toLowerCase();
        }

        if (this.tipoDuo == 1) {
            this.nombreCliente = scope.etiquetas.lbCliente;
            this.nombreFecha = scope.etiquetas.lbFechaEntrega;
            this.msgExisteDuo = scope.etiquetas.lbMsgExisteDerecho;
            // this.titulo = (this.action == 1) ? scope.etiquetas.lbAddDerecho : scope.etiquetas.lbModDerecho;
            this.msgAddMod = scope.etiquetas.msgCPC;
        } else if (this.tipoDuo == 2) {
            this.nombreCliente = scope.etiquetas.lbProveedor;
            this.nombreFecha = scope.etiquetas.lbFechaRecibo;
            this.msgExisteDuo = scope.etiquetas.lbMsgExisteObligacion;
            // this.titulo = (this.action == 1) ? scope.etiquetas.lbAddObligacion : scope.etiquetas.lbModObligacion;
            this.msgAddMod = scope.etiquetas.msgCPP;
        }/* else if (this.tipoDuo == 3) {
            this.nombreFecha = scope.etiquetas.lbFechaEntrega;
            this.msgExisteDuo = scope.etiquetas.lbMsgExisteDerechoF;
            this.titulo = (this.action == 1) ? scope.etiquetas.lbAddDerechoF : scope.etiquetas.lbModDerechoF;
            this.msgAddMod = scope.etiquetas.msgCF;
        } else if (this.tipoDuo == 4) {
            this.nombreFecha = scope.etiquetas.lbFechaRecibo;
            this.msgExisteDuo = scope.etiquetas.lbMsgExisteObligacionF;
            this.titulo = (this.action == 1) ? scope.etiquetas.lbAddObligacionF : scope.etiquetas.lbModObligacionF;
            this.msgAddMod = scope.etiquetas.msgPF;
        }*/

        this.stAddClienteProveedor = new Ext.data.Store({
            url: this.url + 'loadDataClientes',
            baseParams: {
                tipoDuo: this.tipoDuo
            },
            sortInfo: {
                field: 'nombrecliente',
                direction: "DESC"
            },
            reader: new Ext.data.JsonReader({
                id: 'idclien',
                totalProperty: 'cantidad',
                root: 'datos'
            }, [{
                name: 'idcliente',
                mapping: 'idcliente'
            }, {
                name: 'abreviatura',
                mapping: 'abreviatura'
            }, {
                name: 'nombrecliente',
                mapping: 'nombrecliente'
            }, {
                name: 'opeExcepional',
                mapping: 'opeExcepional'
            }, {
                name: 'nombre',
                mapping: 'nombre'
            }, {
                name: 'cobrospagos'
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
                name: 'idclienteproveedor'
            }, {
                name: 'plazo'
            }, {
                name: 'idclienteproveedorcobropago'
            }, {
                name: 'idcuenta'
            }])
        });

        this.stAddNumeroContrato = new Ext.data.Store({
            url: this.url + 'loadContrato',
            /*sortInfo: {
                field: 'denominacion',
                direction: "ASC"
            },*/
            reader: new Ext.data.JsonReader({
                id: 'idcontrato',
                totalProperty: 'cant',
                root: 'datos'
            }, [{
                name: 'idcontrato'
            }, {
                name: 'numerocontrato'
            }, {
                name: 'nombrecontrato'
            }, {
                name: 'idclienteproveedor'
            }])
        });

        this.stAddCuenta = new Ext.data.Store({
            url: this.url + 'loadDataCuenta',
            sortInfo: {
                field: 'nombrecuenta',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'id'
            }, [{
                name: 'idcuenta'
            }, {
                name: 'nombrecuenta',
                mapping: 'text'
            }, {
                name: 'idnaturaleza'
            }, {
                name: 'concatcta'
            }, {
                name: 'idcondicionpago',
                mapping: 'idterminodepago'
            }, {
                name: 'denominacion',
                mapping: 'nombreterminodepago'
            }, {
                name: 'idclienteproveedor'
            }, {
                name: 'plazo'
            }, {
                name: 'idclienteproveedorcobropago'
            }, {
                name: 'idmoneda'
            }, {
                name: 'codigoiso'
            }, {
                name: 'dpp'
            }, {
                name: 'mora'
            }, {
                name: 'activo'
            }])
        });

        this.stAddParrafoFiscal = new Ext.data.Store({
            url: this.url + 'loadTreeParrafoFiscal',
            sortInfo: {
                field: 'text',
                direction: "ASC"
            },
            reader: scope.jrParrafoFiscal = new Ext.data.JsonReader({
                id: 'idparrafofiscal'
            }, [{
                name: 'text',
                mapping: 'descripcion'
            }, {
                name: 'codigo',
                mapping: 'descripcion'
            }, {
                name: 'idparrafofiscal'
            }])
        });

        this.stAddTipoDoc = new Ext.data.Store({
            url: this.url + 'cargardocumento',
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
                name: 'idnomoperaciones',
                mapping: 'idnomoperaciones'
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
            }, {
                name: 'arrayCuentaMixta',
                mapping: 'arrayCuentaMixta'
            }, {
                name: 'idmodelo',
                mapping: 'idmodelo'
            }
            ]),
            listeners: {
                load: {
                    scope: this,
                    fn: function (st) {
                        if (this.action == 1)
                            this.stAddGridOperaciones.removeAll();
                        if (st.getCount() == 0) {
                            this.cbAddOperacion.disable();
                            mostrarMensaje(1, scope.etiquetas.lbMsgNoExisteOperaciones);
                        } else if (st.getCount() == 1) {
                            this.cbAddOperacion.enable();
                            // this.cbAddOperacion.fireEvent('select', this.cbAddOperacion, st.getAt(0));
                            // if (!st.getAt(0).get('cuentagasto'))
                            // this.fLoadOneData(this.cbAddOperacion, st, 'idnomoperaciones', 'denominacion');
                            this.opCuentaGasto = st.getAt(0).get('cuentagasto');
                            this.opTipoCuenta = st.getAt(0).get('idtipocuenta');
                        } else if (st.getCount() > 1)
                            this.cbAddOperacion.enable();
                    }
                }
            }
        });

        this.stAddMoneda = new Ext.data.Store({
            url: this.url + 'cargarmoneda',
            reader: new Ext.data.JsonReader({
                id: 'idmon'
            }, [{
                name: 'codigoiso',
                mapping: 'codigoiso'
            }, {
                name: 'idmoneda',
                mapping: 'idmoneda'
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
                        if (st.getCount() == 0) {
                            mostrarMensaje(1, scope.etiquetas.lbMsgNoExisteTasa);
                            this.cbAddTasa.disable();
                        } else if (st.getCount() == 1) {
                            this.fLoadOneData(this.cbAddTasa, st, 'idtasa', 'mostrar');
                            scope.factorConversion = st.getAt(0).get('factordeconversion');
                            scope.tasaCompra = st.getAt(0).get('compra');
                        } else
                            this.cbAddTasa.enable();
                    }
                }
            }
        });

        //sm del grig de operaciones
        this.smAddGridOperaciones = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.stAddGridOperaciones = new Ext.data.Store({
            reader: new Ext.data.JsonReader({}, [{
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
            scope: this,
            url: this.url + 'loadDataAddDuo',
            method: 'POST',
            params: {
                idDuo: this.idDuo,
                idCliente: (this.action == 1) ? '' : this.dataDoc.data.idcliente,
                esClienteProv: (this.action == 1) ? '' : [(this.dataDoc.data.idtipoderechouobligacion == 1) ? true : false],
                tipoduo: this.tipoDuo,
                iddoc: (this.action == 1) ? '' : this.dataDoc.data.iddoc
            },
            callback: function (options, success, response) {
                Ext.getBody().unmask();
                responseData = Ext.decode(response.responseText);
                this.cuentasUsadas = responseData.cuentasUsadasEnCobroOPago;
                var mensaje = '';
                var mostrar = '<br> ' + scope.etiquetas.lbNoEjecAction + '<br> <br>';
                if (scope.tipoDuo == 1 || scope.tipoDuo == 2) {
                    if (responseData.clienteProv != null) {
                        if (responseData.clienteProv.cantidad == 0) {
                            mensaje += ('- ' + ((scope.tipoDuo == 1) ? scope.etiquetas.lbNoClientesConf : scope.etiquetas.lbNoProveedorConf) + '<br>');
                        }
                    }
                } else if (scope.tipoDuo == 3 || scope.tipoDuo == 4) {
                    if (!responseData.parrafoFiscal.length) {
                        mensaje += '- ' + (scope.etiquetas.lbNoParrafosConf) + '<br>';
                    }
                }
                if (!responseData.tipoDocumentos.length)
                    mensaje += '- ' + scope.etiquetas.lbNoTipoDocConf + '<br> ';
                if (!responseData.monedas.length)
                    mensaje += '- ' + scope.etiquetas.lbNoMonedasConf + '<br> ';
                if (mensaje != '') {
                    mostrar += mensaje;
                    mostrarMensaje(1, mostrar, function (btn) {
                        scope.fireEvent('closeAdicionar', true);
                    });
                } else {
                    if (responseData.gridOperaciones.length) {
                        if (responseData.gridOperaciones[0].anexo.length) {
                            var dataAnexo = {
                                idoperacion: responseData.gridOperaciones[0].idoperacioncontable,
                                anexo: responseData.gridOperaciones[0].anexo
                            };
                            scope.arrAnexoOperaciones.push(dataAnexo);
                            scope.tfAddImporte.disable();
                            // scope.btnAddCuentaGasto.setVisible(true);
                            // scope.btnAddCuentaGasto.disable();
                            scope.stAddOperacion.load();
                        }
                    }

                    Ext.MessageBox.hide();
                    scope.wAdicionarDuo.show(Ext.getBody(), function () {
                        scope.loadDataComponent(responseData);
                        scope.cbAddTipoDoc.focus(true, 10);
                    });
                }
            }
        });

        return Ext.ClassAdicionarDuo.superclass.constructor.call(this);
    },
    loadDataComponent: function (data) {
        scope.fpAddDuo.getForm().isValid();
        scope.loadMask();
        this.stAddTipoDoc.loadData(data.tipoDocumentos);
        if (this.stAddTipoDoc.getCount() == 1)
            this.stAddOperacion.loadData(data.operaciones);

        if (scope.confEspecialidad)
            Ext.getCmp('gpEspecialidad').getStore().loadData(data.especialidades);

        scope.dfAddFechaEmision.setValue(data.fechacontable);
        scope.dfAddFechaEntrega.setValue(data.fechacontable);
        scope.dfAddFechaEmision.setMaxValue(data.fechacontable);
        scope.dfAddFechaEntrega.setMinValue(data.fechacontable);
        scope.dfAddFechaEntrega.setMaxValue(data.periodo['fin']);
        scope.dfAddFechaRecepcion.setMaxValue(data.periodo['fin']);
        scope.fechaContable = data.fechacontable;
        scope.fechaPeriodoInicio = data.periodo['inicio'];
        scope.fechaPeriodoFin = data.periodo['fin'];

        if (this.stAddClienteProveedor.getCount() == 1) {
            scope.fLoadOneData(scope.cbAddClienteProveedor, this.stAddClienteProveedor, 'idcliente', 'nombrecliente');
            scope.cantOpExcepcionales = this.stAddClienteProveedor.getAt(0).get('opeExcepional');
        } else
            scope.cbAddClienteProveedor.enable();

        if (scope.confEspecialidad) {
            if (Ext.getCmp('gpEspecialidad').getStore().getCount() == 1) {
                store = Ext.getCmp('gpEspecialidad').getStore();
                scope.cbAddEspecialidad.setValue(scope.jrEspecialidad.jsonData[0]['especialidad']);
                scope.cbAddEspecialidad.fSelect.values.push(scope.jrEspecialidad.jsonData[0]['idespecialidad']);
                scope.cbAddEspecialidad.fSelect.display.push(scope.jrEspecialidad.jsonData[0]['especialidad']);
                scope.oldEspecialidad = scope.jrEspecialidad.jsonData[0]['idespecialidad'];
            }
        }

        if (this.stAddTipoDoc.getCount() == 1)
            scope.fLoadOneData(scope.cbAddTipoDoc, this.stAddTipoDoc, 'iddoc', 'denominacion');
        else
            scope.cbAddTipoDoc.enable();

        if (this.stAddMoneda.getCount() == 1) {
            scope.fLoadOneData(scope.cbAddMoneda, this.stAddMoneda, 'idmoneda', 'codigoiso');

            if (this.stAddTasa.getCount() == 0) {
                mostrarMensaje(1, scope.etiquetas.lbMsgNoExisteTasa);
            } else if (this.stAddTasa.getCount() == 1) {
                scope.fLoadOneData(scope.cbAddTasa, this.stAddTasa, 'idtasa', 'mostrar');
                scope.factorConversion = this.stAddTasa.getAt(0).get('factordeconversion');
                scope.tasaCompra = this.stAddTasa.getAt(0).get('compra');
            } else {
                // scope.cbAddTasa.enable();
            }
        }

        if (this.stAddCuenta.getCount() == 1 && this.stAddTipoDoc.getCount() == 1) {
            if (this.stAddOperacion.getCount() == 0) {
                scope.cbAddOperacion.disable();
                mostrarMensaje(1, scope.etiquetas.lbMsgNoExisteOperaciones);
            } else if (this.stAddOperacion.getCount() == 1) {
                scope.fLoadOneData(scope.cbAddOperacion, this.stAddOperacion, 'idoperacioncontable', 'denominacion');
                this.opCuentaGasto = this.stAddOperacion.getAt(0).get('cuentagasto');
                this.opTipoCuenta = this.stAddOperacion.getAt(0).get('idtipocuenta');
            }
        }

        //EN CASO DE QUE SE VAYA A MODIFICAR
        if (this.action == 2 || this.action == 3) {
            scope.cbAddCondicionPago.disable();
            scope.cbAddCuenta.disable();
            scope.cbAddMoneda.disable();
            // scope.cbAddTasa.disable();

            scope.plazoDias = this.dataDoc.data.plazo;
            scope.cbAddTipoDoc.setValue(this.dataDoc.data.iddoc);
            scope.cbAddTipoDoc.setRawValue(this.dataDoc.data.denominacion);
            scope.oldTipoDocumento = this.dataDoc.data.iddoc;

            if (this.dataDoc.data.idtipoderechouobligacion == 1) {
                scope.ckbAddClienteProv.setValue(true);
                scope.ckbAddTrabajador.setValue(false);
                scope.ckbAddFisco.setValue(false);
            } else if (this.dataDoc.data.idtipoderechouobligacion == 2) {
                scope.ckbAddTrabajador.setValue(false);
                scope.ckbAddClienteProv.setValue(false);
                scope.ckbAddFisco.setValue(true);
            } else if (this.dataDoc.data.idtipoderechouobligacion == 3) {
                scope.ckbAddTrabajador.setValue(true);
                scope.ckbAddClienteProv.setValue(false);
                scope.ckbAddFisco.setValue(false);
            }

            scope.tfAddNumeroDocumento.setValue(this.dataDoc.data.numero);
            scope.oldNumeroDocumento = this.dataDoc.data.numero;

            scope.dfAddFechaEmision.setValue(this.dataDoc.data.fechaemision);
            scope.oldFechaEmision = this.dataDoc.data.fechaemision;

            scope.dfAddFechaEntrega.setValue(this.dataDoc.data.fechaentrega);
            scope.oldFechaEntrega = this.dataDoc.data.fechaentrega;

            // if (this.dataDoc.data.numerocontrato && this.dataDoc.data.idcontrato) {
            //     scope.stAddNumeroContrato.removeAll();
            //     scope.stAddNumeroContrato.baseParams.idclienteproveedor = this.dataDoc.data.idcliente;
            //     var cliente = (this.tipoDuo == 1) ? 1 : 0;
            //     scope.stAddNumeroContrato.baseParams.cliente = cliente;
            //     scope.stAddNumeroContrato.load({
            //         callback: function(){
            //             scope.cbAddNumeroContrato.setValue(scope.dataDoc.data.idcontrato);
            //             scope.cbAddNumeroContrato.setRawValue(scope.dataDoc.data.numerocontrato);
            //
            //             scope.oldNumeroContrato = scope.dataDoc.data.idcontrato;
            //         }
            //     });
            //
            //     //scope.tfAddNumeroContrato.setValue(this.dataDoc.data.numerocontrato);
            //     //scope.oldNumeroContrato = this.dataDoc.data.numerocontrato;
            // }

            if (scope.tipoDuo == 1 || scope.tipoDuo == 2) {
                scope.stAddClienteProveedor.loadData(data.clienteProv);
                scope.cbAddClienteProveedor.setValue(this.dataDoc.data.idcliente);
                scope.cbAddClienteProveedor.setRawValue(this.dataDoc.data.nombrecliente);
                scope.oldClienteProveedor = this.dataDoc.data.idcliente;
            } else if (scope.tipoDuo == 3 || scope.tipoDuo == 4) {
                if (this.dataDoc.data.idcliente) {
                    store = Ext.getCmp('gpParrafo').getStore();
                    indexActual = store.find('idparrafofiscal', this.dataDoc.data.idcliente);
                    scope.cbAddParrafoFiscal.setValue(scope.jrParrafoFiscal.jsonData[indexActual]['descripcion']);
                    scope.cbAddParrafoFiscal.fSelect.values.push(scope.jrParrafoFiscal.jsonData[indexActual]['idparrafofiscal']);
                    scope.cbAddParrafoFiscal.fSelect.display.push(scope.jrParrafoFiscal.jsonData[indexActual]['descripcion']);
                    scope.oldParrafoFiscal = this.dataDoc.data.idcliente;
                }
            }

            if (scope.confEspecialidad && this.dataDoc.data.idespecialidad) {
                store = Ext.getCmp('gpEspecialidad').getStore();
                indexActual = store.find('idespecialidad', this.dataDoc.data.idespecialidad);
                scope.cbAddEspecialidad.setValue(scope.jrEspecialidad.jsonData[indexActual]['especialidad']);
                scope.cbAddEspecialidad.fSelect.values.push(scope.jrEspecialidad.jsonData[indexActual]['idespecialidad']);
                scope.cbAddEspecialidad.fSelect.display.push(scope.jrEspecialidad.jsonData[indexActual]['especialidad']);
                scope.oldEspecialidad = this.dataDoc.data.idespecialidad;
            }

            scope.tfAddComentario.setValue(this.dataDoc.data.comentario);
            scope.oldDetalle = this.dataDoc.data.comentario;

            // scope.stAddOperacion.baseParams.iddocumento = this.dataDoc.data.iddoc;
            // scope.stAddOperacion.baseParams.denominacion = this.dataDoc.data.denominacion;
            // scope.stAddOperacion.baseParams.tipoduo = scope.tipoDuo;
            scope.stAddOperacion.load({
                scope: this,
                params: {
                    iddocumento: this.dataDoc.data.iddoc,
                    denominacion: this.dataDoc.data.denominacion,
                    tipoduo: scope.tipoDuo
                },
                callback: function (record, options, success) {
                    scope.cbAddOperacion.setValue(data.gridOperaciones[0].idoperacioncontable);
                    scope.cbAddOperacion.setRawValue(data.gridOperaciones[0].operacion);
                    if (record.length) {
                        var cuentagasto = scope.stAddOperacion.getAt(scope.stAddOperacion.find('idnomoperaciones', scope.cbAddOperacion.getValue())).data.cuentagasto;
                        var arrayCuentaMixta = scope.stAddOperacion.getAt(scope.stAddOperacion.find('idnomoperaciones', scope.cbAddOperacion.getValue())).data.arrayCuentaMixta;
                    }
                    scope.fAnexoGasto(cuentagasto, arrayCuentaMixta);
                    scope.lmask.hide();
                }
            });

            var dataDoc = this.dataDoc.data;
            scope.oldNumeroContrato = dataDoc.idcontrato;

            // if(this.dataDoc.data.idcontrato) {
            // if(data.gridOperaciones[0].idcontrato) {
            scope.stAddNumeroContrato.baseParams.idclienteproveedor = scope.cbAddClienteProveedor.getValue();
            var cliente = (scope.tipoDuo == 1) ? 1 : 0;
            scope.stAddNumeroContrato.baseParams.cliente = cliente;
            scope.stAddNumeroContrato.load({
                callback: function () {
                    scope.cbAddNumeroContrato.setValue(dataDoc.idcontrato);
                    // scope.cbAddNumeroContrato.setRawValue(dataDoc.numerocontrato);
                }
            });
            // }

            operaciones = data.gridOperaciones;
            //scope.cbAddOperacion.setValue(data.gridOperaciones[0].idoperacioncontable);
            //scope.cbAddOperacion.setRawValue(data.gridOperaciones[0].operacion);
            scope.oldOperacion = data.gridOperaciones[0].idoperacioncontable;

            scope.cbAddMoneda.setValue(data.gridOperaciones[0].idmoneda);
            scope.cbAddMoneda.setRawValue(data.gridOperaciones[0].moneda);
            scope.oldMoneda = data.gridOperaciones[0].idmoneda;

            // scope.cbAddTasa.setValue(data.gridOperaciones[0].idtasa);
            // scope.cbAddTasa.setRawValue(data.gridOperaciones[0].compra);
            //scope.tfAddLiquidado.setValue(data.gridOperaciones[0].liquidadomo);
            scope.tfAddLiquidado.setValue(formatoMoneda(data.gridOperaciones[0].liquidadomo));
            scope.oldLiquidado = data.gridOperaciones[0].liquidadomo;

            scope.tfAddImporte.setValue(data.gridOperaciones[0].importemo);
            scope.tfAddImporte.setRawValue(formatoMoneda(data.gridOperaciones[0].importemo));
            scope.oldImporte = data.gridOperaciones[0].importemo;

            scope.idOperacion = data.gridOperaciones[0].idoperacion;

            if (operaciones != null) {
                var cantidad = operaciones.length;

                var rec = new Ext.data.Record.create(
                    [{
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
                        importe: parseFloat(operaciones[i].importemo),
                        factordeconversion: operaciones[i].factordeconversion,
                        compra: operaciones[i].compra,
                        anexo: operaciones[i].anexo,
                        idtasa: operaciones[i].idtasa,
                        idcuenta: operaciones[i].idcuenta,
                        codigoCuenta: operaciones[i].nombrecuenta,
                        importecontable: parseFloat(operaciones[i].importemb),
                        importaux: parseFloat(operaciones[i].importemb),
                        idoperFind: operaciones[i].idoperacioncontable + operaciones[i].idmoneda + operaciones[i].idtasa
                    });
                    scope.gpAddGridOperaciones.getStore().add(agregoper);
                }
                scope.tfAddImporteTotal.setValue(scope.fSaldo(this.stAddGridOperaciones.sum('importecontable')));
            }

            combo = (scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.cbAddClienteProveedor : scope.cbAddParrafoFiscal;

            scope.oldCuenta = this.dataDoc.data.idcuenta;
            scope.cbAddCuenta.setValue(this.dataDoc.data.idcuenta, this.dataDoc.data.text);
            if (scope.ckbAddClienteProv.checked == true || scope.ckbAddFisco.checked == true) {
                scope.oldCondicionPago = this.dataDoc.data.idcondicionpago;
                scope.cbAddCondicionPago.setValue(this.dataDoc.data.idcondicionpago);
                scope.cbAddCondicionPago.setRawValue(this.dataDoc.data.condicionpago);
            } else {
                scope.cbAddCondicionPago.disable();
            }
            if (this.action == 3) {
                scope.fpAddDuo.cascade(function () {
                    this.disabledClass = 'disabled-component';
                });

                scope.fpAddDuo.disable();
            }
        } else {
            scope.lmask.hide();
        }
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
    loadMask: function (message = 'Cargando...') {
        this.lmask = new Ext.LoadMask(this.wAdicionarDuo.body, {
            msg: message
        });
        this.lmask.show();
    },
    initializeEvents: function (scope) {
        this.btnAddCuentaGasto.on('click', function (component) {
            var cuentagasto = scope.stAddOperacion.getAt(scope.stAddOperacion.find('idnomoperaciones', scope.cbAddOperacion.getValue())).data.cuentagasto;
            var arrayCuentaMixta = scope.stAddOperacion.getAt(scope.stAddOperacion.find('idnomoperaciones', scope.cbAddOperacion.getValue())).data.arrayCuentaMixta;
            scope.fAnexoGasto(cuentagasto, arrayCuentaMixta);
        });

        this.btnAddNuevo.on('click', function (component) {
            scope.fResetFields();
        });

        this.btnAddAplicar.on('click', function (component) {
            scope.actionAplicar = true;
            scope.fGuardarDatosDuo();
        });

        this.btnAddGuardar.on('click', function (component) {
            scope.fGuardarDatosDuo();
        });

        this.btnAddConfirmar.on('click', function (component) {
            scope.fConfirmarDuo();
        });

        this.btnAddOpAdicionar.on('click', function (component) {
            scope.fGestionarOperacion('ADD');
        });

        this.btnAddOpModificar.on('click', function (component) {
            scope.fGestionarOperacion('MOD');
        });

        this.btnAddOpEliminar.on('click', function (component) {
            scope.fGestionarOperacion('DEL');
        });

        this.btnAddOpCancelar.on('click', function (component) {
            scope.fGestionarOperacion('CANC');
        });

        this.addEvents('closeAdicionar');
        this.btnAddCerrar.on('click', function (component) {
            scope.wAdicionarDuo.close();
            scope.fireEvent('closeAdicionar', true, scope.adiciono);
        });

        scope.wAdicionarDuo.on('close', function () {
            scope.fireEvent('closeAdicionar', true, scope.adiciono);
        });

        this.addEvents('contabilizarDuo');
        this.btnAddContabilizar.on('click', function (component) {
            scope.fireEvent('contabilizarDuo', scope.idDuo);
            scope.btnAddContabilizar.disable();
        });

        this.ckbAddClienteProv.on('check', function () {
            scope.cbAddNumeroContrato.clearValue();
            scope.cbAddNumeroContrato.store.removeAll();
            if (scope.ckbAddClienteProv.getValue() == true) {
                scope.cbAddCondicionPago.enable();
                scope.cbAddCondicionPago.reset();
                scope.stAddCondicionPago.removeAll();
                scope.ckbAddTrabajador.setValue(false);
                scope.ckbAddFisco.setValue(false);
                scope.stAddClienteProveedor.baseParams.esClienteProv = scope.ckbAddClienteProv.getValue();
                scope.stAddClienteProveedor.baseParams.tipoDuo = scope.tipoDuo;
                scope.cbAddClienteProveedor.reset();
                scope.stAddClienteProveedor.removeAll();
                scope.stAddClienteProveedor.load({
                    params: {
                        start: 0,
                        limit: 10
                    }
                });
                scope.cbAddCuenta.reset();
                scope.stAddCuenta.removeAll();
            } else if (scope.ckbAddClienteProv.getValue() == false && scope.ckbAddTrabajador.getValue() == false && scope.ckbAddFisco.getValue() == false) {
                scope.ckbAddTrabajador.setValue(true);
            }
        });

        this.ckbAddFisco.on('check', function () {
            scope.cbAddNumeroContrato.clearValue();
            scope.cbAddNumeroContrato.store.removeAll();
            if (scope.ckbAddFisco.getValue() == true) {
                scope.cbAddCondicionPago.enable();
                scope.cbAddCondicionPago.reset();
                scope.stAddCondicionPago.removeAll();
                scope.ckbAddTrabajador.setValue(false);
                scope.ckbAddClienteProv.setValue(false);
                scope.stAddClienteProveedor.baseParams.esClienteProv = true;
                scope.stAddClienteProveedor.baseParams.tipoDuo = (scope.tipoDuo == 1) ? 5 : 6;
                scope.cbAddClienteProveedor.reset();
                scope.stAddClienteProveedor.removeAll();
                scope.stAddClienteProveedor.load({
                    params: {
                        start: 0,
                        limit: 10
                    }
                });
                scope.cbAddCuenta.reset();
                scope.stAddCuenta.removeAll();
            } else if (scope.ckbAddClienteProv.getValue() == false && scope.ckbAddTrabajador.getValue() == false && scope.ckbAddFisco.getValue() == false) {
                scope.ckbAddClienteProv.setValue(true);
            }
        });

        this.ckbAddTrabajador.on('check', function () {
            scope.cbAddNumeroContrato.clearValue();
            scope.cbAddNumeroContrato.store.removeAll();
            if (scope.ckbAddTrabajador.getValue() == true) {
                scope.cbAddCondicionPago.disable();
                scope.cbAddCondicionPago.reset();
                scope.stAddCondicionPago.removeAll();
                scope.ckbAddClienteProv.setValue(false);
                scope.ckbAddFisco.setValue(false);
                scope.stAddClienteProveedor.baseParams.esClienteProv = scope.ckbAddClienteProv.getValue();
                scope.stAddClienteProveedor.baseParams.tipoDuo = scope.tipoDuo;
                scope.cbAddClienteProveedor.reset();
                scope.stAddClienteProveedor.removeAll();
                scope.stAddClienteProveedor.load({
                    params: {
                        start: 0,
                        limit: 10
                    }
                });
                scope.cbAddCuenta.reset();
                scope.stAddCuenta.removeAll();
                scope.stAddCuenta.baseParams.arrayIdCuenta = '';
                scope.stAddCuenta.baseParams.esClienteProv = scope.ckbAddClienteProv.getValue();
                scope.cbAddCuenta.load();
            } else if (scope.ckbAddClienteProv.getValue() == false && scope.ckbAddTrabajador.getValue() == false && scope.ckbAddFisco.getValue() == false) {
                scope.ckbAddClienteProv.setValue(true);
            }
        });

        this.ckbAddExcepcional.on('check', function () {
            scope.cbAddNumeroContrato.clearValue();
            scope.cbAddNumeroContrato.store.removeAll();
            if (scope.ckbAddExcepcional.getValue() == true) {
                //scope.tfAddNumeroContrato.reset();
                //scope.tfAddNumeroContrato.setDisabled(true);
                scope.cbAddNumeroContrato.store.removeAll();
                scope.cbAddNumeroContrato.clearValue();
                scope.cbAddNumeroContrato.setDisabled(true);
            } else {
                //scope.tfAddNumeroContrato.setDisabled(false);
                //scope.tfAddNumeroContrato.focus();
                scope.cbAddNumeroContrato.setDisabled(false);
                scope.cbAddNumeroContrato.focus();
            }
        });

        this.ckbAddServicio.on('check', function () {
            scope.cbAddNumeroContrato.clearValue();
            scope.cbAddNumeroContrato.store.removeAll();
            if (scope.ckbAddServicio.getValue() == true) {
                scope.dfAddFechaRecepcion.reset();
                scope.dfAddFechaRecepcion.setDisabled(true);
            } else {
                scope.dfAddFechaRecepcion.setDisabled(false);
                scope.dfAddFechaRecepcion.focus();
            }
        });

        scope.stAddClienteProveedor.on({
            scope: scope,
            load: function (combo, record, index) {
                Ext.Msg.hide();
                if (record.length == 0) {
                    if (scope.ckbAddClienteProv.getValue()) {
                        if (scope.tipoDuo == 1)
                            mensaje = 'No existen clientes configurados en la entidad.'
                        else
                            mensaje = 'No existen proveedores configurados en la entidad.'
                    }
                    if (scope.ckbAddFisco.getValue())
                        mensaje = 'No existen órganos del presupuesto del estado configurados en la entidad.'
                    if (scope.ckbAddTrabajador.getValue())
                        mensaje = 'No existen trabajadores configurados en la entidad.'
                    mostrarMensaje(1, mensaje);
                }
            },
            beforeload: function (combo, record, index) {
                // Ext.Msg.wait('Cargando...', 'Por favor espere...');
            }
        });

        scope.cbAddClienteProveedor.on({
            scope: scope,
            focus: function (combo, record, index) {
                scope.stAddClienteProveedor.baseParams.esClienteProv = (scope.ckbAddFisco.getValue()) ? true : scope.ckbAddClienteProv.getValue();
            },
            beforeselect: function (combo, record, index) {
                var cuentascliente = record.data.cobrospagos;
                var mensaje = (scope.tipoDuo == 1) ? scope.etiquetas.lbMsgNoCuentaCliente : scope.etiquetas.lbMsgNoCuentaProveedor;

                if (scope.ckbAddClienteProv.getValue()) {
                    if (cuentascliente.length == 0) {
                        mostrarMensaje(1, mensaje);
                        return false;
                    } else {
                        for (var i = 0, long = cuentascliente.length; i < long; i++) {
                            if (scope.tipoDuo == 1 && cuentascliente[i].idclasificacion == 2) {
                                return true;
                            } else if (scope.tipoDuo == 2 && cuentascliente[i].idclasificacion == 1) {
                                return true;
                            }
                        }
                    }
                }
            },
            select: function (combo, record, index) {
                if (this.action == 2) {
                    if (scope.ckbAddClienteProv.getValue())
                        scope.cbAddCondicionPago.enable();
                    scope.cbAddCuenta.enable();
                    // scope.cbAddTasa.enable();
                }

                scope.cbAddCondicionPago.reset();
                scope.stAddCondicionPago.removeAll();
                scope.cbAddCuenta.reset();
                scope.cbAddMoneda.reset();
                scope.stAddMoneda.removeAll();
                // scope.cbAddTasa.reset();
                scope.stAddTasa.removeAll();

                var arrCtasClienteProv = [];

                if (scope.ckbAddClienteProv.getValue() || scope.ckbAddFisco.getValue()) {
                    arrCtasClienteProv = scope.stAddClienteProveedor.getAt(scope.stAddClienteProveedor.find('idcliente', scope.cbAddClienteProveedor.getValue())).data.cobrospagos;

                    var arrayIdCuenta = [];

                    for (var i = 0; i < arrCtasClienteProv.length; i++) {
                        arrayIdCuenta.push(arrCtasClienteProv[i].idcuenta);
                    }
                    scope.stAddCuenta.baseParams.arrayIdCuenta = Ext.encode(arrayIdCuenta);
                    scope.stAddCuenta.baseParams.cobrospagos = Ext.encode(arrCtasClienteProv);
                    scope.cbAddCuenta.load();

                    scope.stAddNumeroContrato.removeAll();
                    scope.stAddNumeroContrato.baseParams.idclienteproveedor = scope.cbAddClienteProveedor.getValue();
                    var cliente = (scope.tipoDuo == 1) ? 1 : 0;
                    scope.stAddNumeroContrato.baseParams.cliente = cliente;
                    scope.stAddNumeroContrato.load();

                }

                if (this.stAddCuenta.getCount() == 1) {
                    scope.fLoadOneData(scope.cbAddCuenta, this.stAddCuenta, 'idcuenta', 'nombrecuenta');
                    scope.fLoadOneData(scope.cbAddCuenta, this.stAddCuenta, 'idcuenta', 'nombrecuenta');
                    scope.cbAddCuenta.fireEvent('select', scope.cbAddCuenta);
                }
            }
        });

        scope.cbAddCuenta.on({
            scope: scope,
            select: function (combo, record, index) {
                //Para validar el anexo que depende de la moneda del cliente
                if (this.cbAddMoneda.getValue() != record.data.idmoneda) {
                    this.cbAddOperacion.reset();
                    scope.arrAnexoOperaciones = [];
                }
                //------------------
                if (scope.ckbAddClienteProv.getValue() == true || scope.ckbAddFisco.getValue() == true) {
                    scope.plazoDias = scope.cbAddCuenta.getStore().getAt(scope.cbAddCuenta.getStore().find('idcuenta', scope.cbAddCuenta.getValue())).data.plazo;
                    scope.fSetearCombosPorClienteSeleccionado(scope.cbAddCondicionPago, scope.stAddCondicionPago, scope.cbAddCuenta, scope.stAddCuenta, 'idcondicionpago', 'denominacion', 'idcuenta')
                }

                scope.fSetearCombosPorClienteSeleccionado(scope.cbAddMoneda, scope.stAddMoneda, scope.cbAddCuenta, scope.stAddCuenta, 'idmoneda', 'codigoiso', 'idcuenta')
                // this.fCargarTasas();
            },
            beforeselect: function (attributes, index) {
                if (scope.cuentasUsadas.includes(attributes.data.idcuenta)) {
                    var msg = scope.tipoDuo == 2 ? 'cuentas por cobrar.' : 'cuentas por pagar.';
                    mostrarMensaje(1, 'La cuenta ' + attributes.data.concatcta + ' esta en uso en ' + msg);
                    return false;
                } else if (/^(696|699)/.test(attributes.data.concatcta)) {
                    var msg = scope.tipoDuo == 2 ? ' no es una cuenta por pagar. Por favor rectifique la misma en el proveedor.'
                        : ' no es una cuenta por cobrar. Por favor rectifique la misma en el cliente.';
                    mostrarMensaje(1, 'La cuenta ' + attributes.data.concatcta + msg);
                    return false;
                }
            }
        });

        this.cbAddTipoDoc.on('select', function () {
            if (scope.cbAddTipoDoc.getValue())
                scope.fCargarOperaciones();
        });

        this.dfAddFechaEmision.on('change', function (thiscomp, newvalue, oldvalue) {
            var dateparts = scope.fechaPeriodoInicio.split("/");
            if (newvalue >= new Date(dateparts[2], dateparts[1] -1, dateparts[0])) {
                scope.dfAddFechaRecepcion.setMinValue(newvalue);
                scope.dfAddFechaEntrega.setMinValue(newvalue);
            } else {
                scope.dfAddFechaRecepcion.setMinValue(scope.fechaPeriodoInicio);
                scope.dfAddFechaEntrega.setMinValue(scope.fechaPeriodoInicio);
            }
        });

        this.dfAddFechaEntrega.on('change', function (thiscomp, newvalue, oldvalue) {
            scope.dfAddFechaRecepcion.setMinValue(newvalue);
            scope.dfAddFechaEmision.setMaxValue(newvalue);
        });

        this.dfAddFechaRecepcion.on('change', function (thiscomp, newvalue, oldvalue) {
            scope.dfAddFechaEntrega.setMaxValue(newvalue);
            scope.dfAddFechaEmision.setMaxValue(newvalue);
        });

        this.cbAddTasa.on('select', function () {
            dataTasa = scope.stAddTasa.getAt(scope.stAddTasa.find('idtasa', scope.cbAddTasa.getValue())).data;
            scope.factorConversion = dataTasa.factordeconversion;
            scope.tasaCompra = dataTasa.compra;
        });

        scope.cbAddOperacion.on({
            select: function (combo, record, index) {
                scope.idModelo = record.data.idmodelo;
                // if (scope.tipoDuo == 2 && record.data.cuentagasto) {
                if (record.data.cuentagasto) {
                    if (scope.aperturado) {
                        scope.desgloseAnexoGasto(record.data.cuentagasto, record.data.arrayCuentaMixta);
                        scope.tfAddImporte.reset();
                        // scope.tfAddImporte.disable();
                        // scope.objAnexoGasto.addBtnSetDisable(false);
                        // scope.btnAddCuentaGasto.setVisible(true);
                        scope.wAdicionarDuo.doLayout();
                    }
                } else {
                    // scope.tfAddImporte.enable();
                    scope.tfAddImporte.reset();
                    // scope.btnAddCuentaGasto.setVisible(false);
                    if (scope.objAnexoGasto) {
                        scope.objAnexoGasto.addBtnSetDisable();
                        scope.objAnexoGasto.cleanGrid();
                        mostrarMensaje(1, 'No existe modelo configurado para la operación seleccionada.');
                    }
                    scope.wAdicionarDuo.doLayout();
                }
            },
            deselect: function () {
                if (scope.objAnexoGasto) {
                    scope.objAnexoGasto.addBtnSetDisable(true);
                    scope.objAnexoGasto.cleanGrid();
                }
            }
        });

        scope.smAddGridOperaciones.on('beforerowselect', function (smodel, rowIndex, keepExisting, record) {
            scope.btnAddOpAdicionar.disable();
            scope.btnAddOpModificar.enable();
            scope.btnAddOpEliminar.enable();
        }, this);

        scope.smAddGridOperaciones.on('rowselect', function (smodel, rowIndex, keepExisting, record) {
            scope.index = rowIndex;
            scope.btnAddOpAdicionar.disable();
            scope.btnAddOpModificar.enable();
            scope.btnAddOpEliminar.enable();
            scope.btnAddOpCancelar.enable();
            scope.cbAddOperacion.setValue(scope.smAddGridOperaciones.getSelected().data.idoperacioncontable);
            scope.cbAddOperacion.setRawValue(scope.smAddGridOperaciones.getSelected().data.operacion);
            scope.cbAddMoneda.setValue(scope.smAddGridOperaciones.getSelected().data.idmoneda);
            scope.cbAddMoneda.setRawValue(scope.smAddGridOperaciones.getSelected().data.moneda);
            // scope.cbAddTasa.setValue(scope.smAddGridOperaciones.getSelected().data.idtasa);
            // scope.cbAddTasa.setRawValue(scope.smAddGridOperaciones.getSelected().data.compra);
            scope.factorConversion = scope.smAddGridOperaciones.getSelected().data.factordeconversion;
            scope.tasaCompra = scope.smAddGridOperaciones.getSelected().data.compra;
            scope.tfAddImporte.setValue(scope.smAddGridOperaciones.getSelected().data.importe);
        }, this);

        scope.cbAddParrafoFiscal.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                if (!scope.cbAddTipoDoc.disabled)
                    scope.cbAddTipoDoc.focus(true, 10);
                else if (!scope.cbAddCondicionPago.disabled)
                    scope.cbAddCondicionPago.focus(true, 10);
                else
                    scope.tfAddNumeroDocumento.focus(true, 10);
            } else
                scope.fClearValue(e, this);
        });

        scope.cbAddTipoDoc.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                scope.tfAddNumeroDocumento.focus(true, 10);
            } else
                scope.fClearValue(e, this);
        });

        scope.tfAddNumeroDocumento.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                scope.dfAddFechaEmision.focus(true, 10);
            }
        });

        scope.dfAddFechaEmision.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                if (!scope.cbAddClienteProveedor.disabled)
                    scope.cbAddClienteProveedor.focus(true, 10);
                else if (!scope.cbAddCondicionPago.disabled)
                    scope.cbAddCondicionPago.focus(true, 10);
                else {
                    //scope.tfAddNumeroContrato.focus(true, 10);
                    scope.cbAddNumeroContrato.focus(true, 10);
                }
            } else {
                scope.fClearValue(e, this);
                scope.fSetDefaultDate(e, this);
            }
        });

        scope.cbAddClienteProveedor.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                if (!scope.cbAddCondicionPago.disabled)
                    scope.cbAddCondicionPago.focus(true, 10);
                else {
                    //scope.tfAddNumeroContrato.focus(true, 10);
                    scope.cbAddNumeroContrato.focus(true, 10);
                }
            } /*else
                scope.fClearValue(e, this);*/
        });
        scope.cbAddClienteProveedor.on('select', function (t, e) {
            if (!scope.cbAddCondicionPago.disabled)
                scope.cbAddCuenta.focus(true, 10);
            else {
                //scope.tfAddNumeroContrato.focus(true, 10);
                scope.cbAddNumeroContrato.focus(true, 10);
            }
        });

        scope.cbAddCondicionPago.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                //scope.tfAddNumeroContrato.focus(true, 10);
                scope.cbAddNumeroContrato.focus(true, 10);
            } else
                scope.fClearValue(e, this);
        });
        scope.cbAddCondicionPago.on('select', function (t, e) {
            //scope.tfAddNumeroContrato.focus(true, 10);
            scope.cbAddNumeroContrato.focus(true, 10);
        });

        /*scope.tfAddNumeroContrato.on('keypress', function (t, e) {
            if (e.getKey() == 13)
                scope.tfAddComentario.focus(true, 10);
        });*/
        scope.cbAddNumeroContrato.on('keypress', function (t, e) {
            if (e.getKey() == 13)
                scope.tfAddComentario.focus(true, 10);
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
            } else
                scope.fClearValue(e, this);
        });
        scope.cbAddOperacion.on('select', function (t, e) {
            if (!scope.cbAddMoneda.disabled)
                scope.cbAddMoneda.focus(true, 10);
            else if (!scope.cbAddTasa.disabled)
                scope.cbAddTasa.focus(true, 10);
            else
                scope.tfAddImporte.focus(true, 10);
        });

        scope.cbAddMoneda.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                if (!scope.cbAddTasa.disabled)
                    scope.cbAddTasa.focus(true, 10);
                else
                    scope.tfAddImporte.focus(true, 10);
            } else
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
                scope.fGuardarDatosDuo();
        });

        scope.tfAddImporte.on('blur', function (tf) {
            tf.setValue(scope.fSaldo(tf.getValue()));
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

        scope.dfAddFechaEntrega.on('blur', function (df) {
            scope.fValidarCamposDuo();
        });

        scope.dfAddFechaRecepcion.on('blur', function (df) {
            scope.fValidarCamposDuo();
        });

        scope.dfAddFechaEmision.on('blur', function (df) {
            scope.fValidarCamposDuo();
        });

        scope.cbAddTipoDoc.on('select', function (combo) {
            scope.fValidarCamposDuo();
        });

        scope.cbAddCuenta.on('select', function (combo) {
            scope.fValidarCamposDuo();
        });

        scope.tfAddNumeroDocumento.on('keyup', function (combo) {
            scope.fValidarCamposDuo();
        });

        scope.cbAddClienteProveedor.on('select', function (combo) {
            scope.fValidarCamposDuo();
        });

        scope.cbAddCondicionPago.on('select', function (combo) {
            scope.fValidarCamposDuo();
        });

        scope.cbAddEspecialidad.on('change', function (combo) {
            scope.fValidarCamposDuo();
        });

        /*scope.tfAddNumeroContrato.on('keyup', function (combo) {
            scope.fValidarCamposDuo();
        });*/
        scope.cbAddNumeroContrato.on('select', function (combo) {
            scope.fValidarCamposDuo();
        });

        scope.tfAddComentario.on('keyup', function (combo) {
            scope.fValidarCamposDuo();
        });

        scope.cbAddOperacion.on('select', function (combo) {
            scope.fValidarCamposDuo();
        });

        scope.tfAddImporte.on('keyup', function (combo) {
            scope.fValidarCamposDuo();
        });

        scope.tfAddLiquidado.on('keyup', function (combo) {
            scope.fValidarCamposDuo();
        });

        scope.cbAddMoneda.on('select', function (combo) {
            scope.fValidarCamposDuo();
        });

        if (scope.objAnexoGasto) {
            scope.cbAddOperacion.reset = scope.cbAddOperacion.reset.createSequence(function () {
                scope.objAnexoGasto.addBtnSetDisable();
                scope.objAnexoGasto.cleanGrid();
            });

            scope.objAnexoGasto.addListener('save', function (listAnexoGasto, importeGasto) {
                var dataAnexo = scope.arrAnexoOperaciones.filter(function (obj) {
                    return obj.idoperacion === scope.cbAddOperacion.getValue();
                })[0];

                if (dataAnexo) {
                    dataAnexo.anexo = listAnexoGasto;
                } else {
                    var dataAnexo = {
                        idoperacion: scope.cbAddOperacion.getValue(),
                        anexo: listAnexoGasto
                    };
                    scope.arrAnexoOperaciones.push(dataAnexo);
                }

                scope.tfAddImporte.setValue(importeGasto);
                scope.tfAddImporte.setRawValue(importeGasto);
                scope.fValidarCamposDuo();
            });
        }
    },
    initializeFunctions: function (scope) {
        this.fConfirmarDuo = function () {
            this.loadMessageBox(scope.etiquetas.lbConfirmando);
            var arrayIdDuo = [];
            arrayIdDuo.push(scope.idDuo);
            Ext.Ajax.request({
                url: scope.url + 'confirmarDuo',
                method: 'POST',
                params: {
                    arrayIdDuo: Ext.encode(arrayIdDuo)
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    respuesta = responseData;
                    if (parseInt(respuesta) == 1) {
                        Ext.MessageBox.hide();
                        mostrarMensaje(1, scope.etiquetas.msgActionSuccess.replace('<#artDuo>', scope.artTexto).replace('<#tipoDuo>', scope.textDuo.toLowerCase()).replace('<#accion>', (scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.etiquetas.actConfirF.toLowerCase() : scope.etiquetas.actConfirM.toLowerCase()));
                        scope.btnAddConfirmar.disable();
                        scope.btnAddContabilizar.enable();
                    } else
                        mostrarMensaje(1, scope.etiquetas.lbError);
                }
            });
        };

        this.fShowWindow = function () {
            if (Ext.MessageBox)
                Ext.MessageBox.hide();
            scope.wAdicionarDuo.show(Ext.getBody(), function () {
                scope.wAdicionarDuo.maximize(true);
                scope.wAdicionarDuo.doLayout(true);
            });
        };

        this.fCargarOperaciones = function () {
            scope.loadMask();
            var idmodelo;
            this.cbAddOperacion.reset();
            this.stAddOperacion.load({
                params: {
                    iddocumento: scope.cbAddTipoDoc.getValue(),
                    tipoduo: scope.tipoDuo
                },
                callback: function (record, success, response) {
                    if (record.length != 0) {
                        idmodelo = record[0].data.idmodelo;
                        if (record.length) {
                            scope.tfAddNumeroDocumento.focus(true, 10);
                        } else {
                            mostrarMensaje(1, scope.etiquetas.lbMsgNoExisteOperaciones, function (btn) {
                                if (btn == 'ok')
                                    scope.cbAddTipoDoc.focus(true, 10);
                            });
                        }
                    } else {
                        mostrarMensaje(1, 'No existen operaciones configuradas para el tipo de documento selecionado.');
                    }
                    scope.lmask.hide();
                }
            });
        };

        this.fResetFields = function () {
            scope.arrAnexoOperaciones = [];
            scope.cbAddTipoDoc.enable();
            scope.tfAddNumeroDocumento.reset();
            scope.tfAddNumeroDocumento.enable();
            scope.tfAddComentario.reset();
            scope.tfAddComentario.enable();
            scope.cbAddClienteProveedor.reset();
            scope.cbAddClienteProveedor.enable();
            scope.cbAddCuenta.reset();
            scope.cbAddCuenta.enable();
            scope.cbAddEspecialidad.reset();
            scope.cbAddEspecialidad.enable();
            // scope.ckbAddClienteProv.enable();
            // scope.ckbAddTrabajador.enable();
            // scope.ckbAddFisco.enable();
            // scope.ckbAddTrabajador.setValue(false);
            // scope.ckbAddFisco.setValue(false);
            // scope.ckbAddClienteProv.setValue(true);
            //scope.tfAddNumeroContrato.reset();
            //scope.tfAddNumeroContrato.enable();
            scope.cbAddNumeroContrato.store.removeAll();
            scope.cbAddNumeroContrato.clearValue();
            scope.cbAddNumeroContrato.enable();

            scope.dfAddFechaEmision.enable();
            scope.cbAddCondicionPago.enable();
            // scope.cbAddTasa.enable();
            scope.tfAddImporte.reset();
            scope.tfAddImporte.enable();
            scope.tfAddLiquidado.reset();
            scope.tfAddLiquidado.enable();
            scope.cbAddOperacion.reset();
            scope.cbAddOperacion.enable();
            scope.btnAddConfirmar.disable();
            scope.btnAddContabilizar.disable();
            if (scope.objAnexoGasto){
                scope.objAnexoGasto.cleanGrid();
                scope.objAnexoGasto.addBtnSetDisable();
            }

            scope.ckbAddExcepcional.enable();
            scope.ckbAddClienteProv.enable();
            scope.ckbAddTrabajador.enable();
        };

        this.fLoadOneData = function (combo, store, id, name) {
            combo.setValue(store.getAt(0).get(id));
            combo.setRawValue(store.getAt(0).get(name));
        };

        this.fSetearCombosPorClienteSeleccionado = function (setCombo, setStore, getCombo, getStore, id, name, idBusqueda) {
            arrCuentas = new Array();
            arrayData = new Array();
            arrayData[0] = new Array();
            arrayData[0][id] = getStore.getAt(getStore.find(idBusqueda, getCombo.getValue())).data[id];
            arrayData[0][name] = getStore.getAt(getStore.find(idBusqueda, getCombo.getValue())).data[name];
            setStore.loadData(arrayData);
            setCombo.setValue(getStore.getAt(getStore.find(idBusqueda, getCombo.getValue())).data[id]);
            setCombo.setRawValue(getStore.getAt(getStore.find(idBusqueda, getCombo.getValue())).data[name]);
        };

        this.fCargarCuentas = function (record) {
            scope.cbAddCuenta.reset();

            if (record.data.cobrospagos.length > 0) {

                if (record.data.cobrospagos.length == 1) {
                    scope.cbAddCuenta.setValue(record.data.cobrospagos[0].idcuenta);
                    scope.cbAddCuenta.setRawValue(record.data.cobrospagos[0].nombrecuenta);
                    scope.cbAddCuenta.setDisabled(true);
                } else {
                    var arrcuentas = new Array();
                    for (var i = 0, long = record.data.cobrospagos.length; i < long; i++) {
                        if (scope.tipoDuo == 1 && record.data.cobrospagos[i].idclasificacion == 2) {
                            arrcuentas.push({
                                idcuenta: record.data.cobrospagos[i].idcuenta,
                                text: record.data.cobrospagos[i].nombrecuenta
                            });
                        } else if (scope.tipoDuo == 2 && record.data.cobrospagos[i].idclasificacion == 1) {
                            arrcuentas.push({
                                idcuenta: record.data.cobrospagos[i].idcuenta,
                                text: record.data.cobrospagos[i].nombrecuenta
                            });
                        }
                    }

                    if (arrcuentas.length == 1) {
                        scope.cbAddCuenta.setValue(arrcuentas[0].idcuenta);
                        scope.cbAddCuenta.setRawValue(arrcuentas[0].text);
                        scope.cbAddCuenta.setDisabled(true);
                    } else if (arrcuentas.length == 0) {
                        var mensaje = (scope.tipoDuo == 1) ? scope.etiquetas.lbMsgNoCuentaCliente : scope.etiquetas.lbMsgNoCuentaProveedor;
                        mostrarMensaje(1, mensaje);
                        scope.cbAddClienteProveedor.reset();
                        scope.cbAddClienteProveedor.focus(true, true);
                    } else {
                        this.stAddCuenta.loadData(arrcuentas);
                        scope.cbAddCuenta.setDisabled(false);

                        if (this.action == 2) {
                            scope.cbAddCuenta.setValue(record.data.idcuenta);
                        }
                    }
                }

                scope.cbAddCuenta.focus(true, true);
            } else {
                var mensaje = (scope.tipoDuo == 1) ? scope.etiquetas.lbMsgNoCuentaCliente : scope.etiquetas.lbMsgNoCuentaProveedor;
                mostrarMensaje(1, mensaje);
                scope.cbAddClienteProveedor.reset();
                scope.cbAddClienteProveedor.focus(true, true);
            }
        };

        this.fGestionarOperacion = function (action) {
            if (scope.cbAddOperacion.getRawValue() != '' && scope.cbAddMoneda.getValue() != ''/* && scope.cbAddTasa.getValue() != ''*/ && scope.tfAddImporte.getValue() != '') {
                if (action == 'CANC') {
                    scope.btnAddOpAdicionar.enable();
                    scope.btnAddOpModificar.disable();
                    scope.btnAddOpEliminar.disable();
                    scope.btnAddOpCancelar.disable();

                    this.smAddGridOperaciones.clearSelections();
                    scope.cbAddOperacion.reset();
                    scope.cbAddOperacion.focus();
                    scope.tfAddImporte.reset();
                } else if (action == 'DEL') {
                    this.stAddGridOperaciones.remove(this.smAddGridOperaciones.getSelected());
                    scope.btnAddOpAdicionar.enable();
                    scope.btnAddOpModificar.disable();
                    scope.btnAddOpEliminar.disable();
                    scope.tfAddImporte.reset();

                } else if (action == 'ADD' || action == 'MOD') {
                    this.fAdicionarOperacion();
                }

                scope.tfAddImporteTotal.setValue(scope.fSaldo(this.stAddGridOperaciones.sum('importecontable')));
            } else {
                scope.cbAddOperacion.isValid();
                scope.cbAddMoneda.isValid();
                // scope.cbAddTasa.isValid();
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

        this.fAdicionarOperacion = function () {
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

            agreg = new rec({
                idoperacion: (scope.smAddGridOperaciones.hasSelection()) ? this.stAddGridOperaciones.getAt(scope.index).data.idoperacion : '',
                operacion: scope.cbAddOperacion.getRawValue(),
                idoperacioncontable: scope.cbAddOperacion.getValue(),
//                idoperacion: (index > -1) ? this.stAddGridOperaciones.getAt(index).data.idoperacion : '',
                moneda: scope.cbAddMoneda.getRawValue(),
//                anexo: arrayAnexo, // SE GUARDAN LOS ANEXOS DE ESTA OPERACION
                idmoneda: scope.cbAddMoneda.getValue(),
                importe: scope.tfAddImporte.getValue(),
//                importaux: impOperacion * parseFloat(scope.factorConversion),
                compra: /*scope.cbAddTasa.getRawValue()*/ '',
                idtasa: /*scope.cbAddTasa.getValue()*/ '',
                factordeconversion: parseFloat(scope.factorConversion),
                importecontable: /*scope.cbAddTasa.getRawValue() * */scope.tfAddImporte.getValue()
            });

            if (scope.smAddGridOperaciones.hasSelection()) {
                this.stAddGridOperaciones.remove(this.stAddGridOperaciones.getAt(scope.index));
                this.stAddGridOperaciones.insert(scope.index, agreg);
            } else
                scope.gpAddGridOperaciones.getStore().add(agreg);

            scope.tfAddImporteTotal.setValue(scope.fSaldo(this.stAddGridOperaciones.sum('importecontable')));

            scope.btnAddOpAdicionar.enable();
            scope.tfAddImporte.focus();
        };

        this.fGuardarDatosDuo = function () {
            if (scope.fpAddDuo.getForm().isValid() && scope.tfAddComentario.isValid() && scope.tfAddImporte.getValue() > 0) {
                if (!scope.aperturado) {
                    if (parseFloat(scope.tfAddImporte.getValue()) < parseFloat(scope.tfAddLiquidado.getValue())) {
                        mostrarMensaje(1, scope.etiquetas.lbLiqMayorImporte);
                        scope.tfAddImporte.markInvalid();
                        scope.tfAddLiquidado.markInvalid();
                    } else
                        this.fGuardarDatos();
                } else
                    this.fGuardarDatos();
            } else {
                if (!scope.tfAddComentario.isValid())
                    scope.tfAddComentario.markInvalid(scope.etiquetas.lbBlankText);

                mostrarMensaje(1, scope.etiquetas.lbValIncorrectos);
            }
        };

        this.fValidarCamposDuo = function (action) {
            if (scope.fpAddDuo.getForm().isValid() && scope.tfAddImporte.getValue() > 0) {
                if (scope.action == 1) {
                    if (!scope.aperturado) {
                        scope.btnAddAplicar.enable();
                    }
                    scope.btnAddGuardar.enable();
                } else if (scope.action == 2) {
                    scope.fValidarModificarDatosDuo();
                }
            } else {
                if (!scope.aperturado) {
                    scope.btnAddAplicar.disable();
                }
                scope.btnAddGuardar.disable();
            }
        };

        this.fValidarModificarDatosDuo = function (action) {
            if (scope.oldTipoDocumento != scope.cbAddTipoDoc.getValue()
                || scope.oldFechaEmision != scope.dfAddFechaEmision.getRawValue()
                || scope.oldFechaEntrega != scope.dfAddFechaEntrega.getRawValue()
                || scope.oldParrafoFiscal != scope.cbAddParrafoFiscal.getValue()
                || (scope.oldCuenta != scope.cbAddCuenta.getValue() && scope.oldClienteProveedor != scope.cbAddClienteProveedor.getValue())
                || scope.oldCondicionPago != scope.cbAddCondicionPago.getValue()
                || scope.oldNumeroDocumento != scope.tfAddNumeroDocumento.getValue()
                || scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values
                || scope.oldNumeroContrato != scope.cbAddNumeroContrato.getValue()
                || scope.oldDetalle != scope.tfAddComentario.getValue()
                || scope.oldOperacion != scope.cbAddOperacion.getValue()
                || scope.oldImporte != scope.tfAddImporte.getValue()
                || scope.oldLiquidado != scope.tfAddLiquidado.getValue()
            )
                scope.btnAddGuardar.enable();
            else
                scope.btnAddGuardar.disable();
        };

        this.fValidarBotonesGuardarDatosDuo = function (action) {
            var arrbotones = new Array();
            arrbotones.push(scope.btnAddGuardar);
            var fieldArray = new Array();
            fieldArray.push(scope.tfAddNumeroDocumento);
            //fieldArray.push(scope.tfAddNumeroContrato);
            fieldArray.push(scope.cbAddNumeroContrato);
            fieldArray.push(scope.tfAddImporte);
            fieldArray.push(scope.dfAddFechaEmision);
            fieldArray.push(scope.dfAddFechaEntrega);
            fieldArray.push(scope.cbAddClienteProveedor);
            fieldArray.push(scope.cbAddCuenta);
            fieldArray.push(scope.cbAddEspecialidad);
            fieldArray.push(scope.cbAddTipoDoc);
            fieldArray.push(scope.cbAddCondicionPago);
            fieldArray.push(scope.cbAddOperacion);
            fieldArray.push(scope.cbAddMoneda);
            // fieldArray.push(scope.cbAddTasa);
            fieldArray.push(scope.tfAddComentario);
        };

        this.fCargarTasas = function () {
            // scope.cbAddTasa.reset();
            if (scope.contador != 0)
                this.loadMessageBox(scope.etiquetas.lbMsgLoadTasa);

            scope.contador++;
            this.stAddTasa.load({
                params: {
                    idmoneda: scope.cbAddMoneda.getValue()
                },
                callback: function (options, success, response) {
                    Ext.MessageBox.hide();
                    responseData = Ext.decode(response.responseText);
                }
            });
        };

        this.cargarModelo = function (idmodelo) {
            Ext.Ajax.request({
                url: 'loadDataModelos',
                method: 'POST',
                params: {
                    idmodelo: idmodelo
                },
                callback: function (options, success, response) {
                    Ext.MessageBox.hide();
                    responseData = Ext.decode(response.responseText);
                }
            });
        };

        this.desgloseAnexoGasto = function (arrayCuenta, arrayCuentaMixta) {
            creditoOriginal = scope.tfAddImporte.getValue();
            importeOriginal = scope.tfAddImporte.getValue();

            var indexAnexo = this.stAddGridOperaciones.find('idoperFind', scope.cbAddOperacion.getValue() + scope.cbAddMoneda.getValue() + scope.cbAddTasa.getValue());
            arrAnexos = (indexAnexo > -1) ? {dataStore: this.stAddGridOperaciones.getAt(indexAnexo).data.anexo} : {};
            scope.fAnexoGasto(arrayCuenta, arrayCuentaMixta);
        };

        this.comprobarOpExcepcionales = function () {
            Ext.Msg.show({
                title: scope.etiquetas.lbBtnCerrar,
                buttons: Ext.Msg.YESNO,
                msg: ((scope.tipoDuo == 1 || scope.tipoDuo == 3) ? scope.etiquetas.lbCantOperExcepD : scope.etiquetas.lbCantOperExcepO) + scope.cantOpExcepcionales + '<br>' + scope.etiquetas.lbContinuar,
                icon: Ext.MessageBox.QUESTION,
                fn: scope.fAccionesExcepcional
            });
        };

        this.fAccionesExcepcional = function (btn) {
            if (btn == 'yes') //SI VOY A ADICIONAR UNA FACTURA EXCEPCIONAL
                scope.fGuardarDatos();
        };

        this.fGuardarDatos = function () {
            var arrOperaciones = [];
            var dataAnexo = scope.arrAnexoOperaciones.filter(function (obj) {
                return obj.idoperacion === scope.cbAddOperacion.getValue();
            })[0];

            arrOperaciones.push({
                idoperacion: (this.action == 2) ? scope.idOperacion : '',
                idoperacioncontable: scope.cbAddOperacion.getValue(),
                idmoneda: scope.cbAddMoneda.getValue(),
                idtasa: /*scope.cbAddTasa.getValue()*/ '',
                importe: scope.tfAddImporte.getValue(),
                importecontable: /*scope.cbAddTasa.getRawValue() * */scope.tfAddImporte.getValue(),
                liquidado: scope.tfAddLiquidado.getValue(),
                anexoGasto: dataAnexo
            });

            this.loadMessageBox(this.msgAddMod);

            if (scope.ckbAddClienteProv.getValue())
                clasificacion = 1;
            else if (scope.ckbAddTrabajador.getValue())
                clasificacion = 3;
            else if (scope.ckbAddFisco.getValue())
                clasificacion = 2;

            Ext.Ajax.request({
                url: this.url + 'addDuo',
                method: 'POST',
                params: {
                    tipoduo: this.tipoDuo,
                    cargainicial: (this.aperturado) ? 0 : 1,
                    liquidado: scope.tfAddLiquidado.getValue(),
                    idDuo: (this.action == 2) ? scope.idDuo : '',
                    esClienteProv: scope.ckbAddClienteProv.getValue(),
                    idcliente: (this.tipoDuo == 1 || this.tipoDuo == 2) ? scope.cbAddClienteProveedor.getValue() : Ext.getCmp('cbxParrafo').fSelect.values,
                    idcuenta: scope.cbAddCuenta.getValue(),
                    textespecialidad: scope.cbAddEspecialidad.getRawValue(),
                    idespecialidad: Ext.getCmp('cbxEspecialidad').fSelect.values,
                    idtipodocumento: scope.cbAddTipoDoc.getValue(),
                    clasificacion: clasificacion,
                    idcondicionpago: scope.cbAddCondicionPago.getValue(),
                    plazo: scope.plazoDias,
                    numero: scope.tfAddNumeroDocumento.getValue(),
                    //numerocontrato: scope.tfAddNumeroContrato.getValue(),
                    numerocontrato: scope.cbAddNumeroContrato.getRawValue(),
                    idcontrato: scope.cbAddNumeroContrato.getValue(),
                    fechaemision: scope.dfAddFechaEmision.getRawValue(),
                    fechaentrega: scope.dfAddFechaEntrega.getRawValue(),
                    fecharecepcion: scope.dfAddFechaRecepcion.getRawValue(),
                    comentario: scope.tfAddComentario.getValue(),
                    estadodoc: (this.action == 2) ? scope.dataDoc.json.idestadodocumento : 2,
                    operaciones: Ext.encode(arrOperaciones),
                    importemb: scope.tfAddImporte.getValue(),
                    idMoneda: scope.cbAddMoneda.getValue(),
                    idmodelo: scope.idModelo
                },
                callback: function (options, success, response) {
                    Ext.MessageBox.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codM == 1) {
                        scope.adiciono = true;
                        scope.idDuo = responseData.respuesta;
                        if (!scope.aperturado) {
                            scope.btnAddGuardar.disable();
                        }

                        if (scope.actionAplicar == true) {
                            scope.actionAplicar = false;
                            scope.btnAddAplicar.disable();
                            scope.fResetFields();
                        } else if (!scope.aperturado) {
                            scope.wAdicionarDuo.close();
                            scope.fireEvent('closeAdicionar', true, scope.adiciono);
                        } else {
                            scope.btnAddGuardar.disable();

                            if (scope.action == 2 && scope.dataDoc.json.idestadodocumento == 3) {
                                scope.btnAddConfirmar.disable();
                                scope.btnAddContabilizar.enable();
                            } else
                                scope.btnAddConfirmar.enable();

                            if (scope.objAnexoGasto) {
                                // scope.objAnexoGasto.cleanGrid();
                                scope.objAnexoGasto.addBtnSetDisable();
                            }
                            scope.gpAddGridOperaciones.disable();
                            scope.tfAddComentario.disable();
                            scope.tfAddImporteTotal.disable();
                            scope.cbAddOperacion.disable();
                            // scope.cbAddTasa.disable();
                            if (scope.confEspecialidad)
                                scope.cbAddEspecialidad.disable();
                            scope.cbAddTipoDoc.disable();
                            scope.cbAddCondicionPago.disable();
                            scope.cbAddClienteProveedor.disable();
                            scope.tfAddNumeroDocumento.disable();
                            scope.tfAddNumeroContrato.disable();
                            scope.cbAddNumeroContrato.disable();
                            scope.dfAddFechaEmision.disable();
                            scope.dfAddFechaRecepcion.disable();
                            scope.dfAddFechaEntrega.disable();
                            scope.ckbAddExcepcional.disable();
                            scope.ckbAddClienteProv.disable();
                            scope.ckbAddTrabajador.disable();
                            scope.ckbAddFisco.disable();
                            scope.cbAddOperacion.disable();
                            scope.cbAddMoneda.disable();
                            scope.cbAddCuenta.disable();
                            // scope.cbAddTasa.disable();
                            scope.tfAddImporte.disable();
                            if (!scope.aperturado)
                                scope.tfAddLiquidado.disable();
                            scope.btnAddOpAdicionar.disable();
                            scope.btnAddOpModificar.disable();
                            scope.btnAddOpEliminar.disable();
                            scope.btnAddOpCancelar.disable();
                            if (scope.tipoDuo == 2 || scope.tipoDuo == 4)
                                scope.ckbAddServicio.disable();

                        }
                        mostrarMensaje(1, scope.etiquetas.msgActionSuccess.replace('<#artDuo>', scope.artTexto).replace('<#tipoDuo>', scope.textDuo.toLowerCase()).replace('<#accion>', scope.actionText.toLowerCase()));
                        if (scope.ckbAddExcepcional.getValue() == true) {
                            // Incrementando la cantidad de operaciones excepcionales para el deudor seleccionado
                            var cliente = scope.stAddClienteProveedor.getAt(scope.stAddClienteProveedor.find('idcliente', scope.cbAddClienteProveedor.getValue()));
                            cliente.data.opeExcepional = scope.cantOpExcepcionales + 1;
                            cliente.json.opeExcepional = scope.cantOpExcepcionales + 1;
                        }
                    } else if (responseData.codM == -1) {
                        mostrarMensaje(1, 'El numero de obligacion ya se encuentra registrado.');
                    } else if (responseData.codM == -2) {
                        mostrarMensaje(1, scope.etiquetas.lbMsgNoExisteTasa);
                    } else {
                        mostrarMensaje(1, scope.msgExisteDuo);
                    }
                }
            });
        };

        this.createToolTip = function (v, m, r) {
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

        this.fClearValue = function (e, combo, rango) {
            if ((e.getKey() == 8) || (e.getKey() == 46)) // suprimir y borrar
                combo.clearValue();
            return;
        };

        this.fSetDefaultDate = function (e, datefield) {
            if (e.getKey() == 13) // Enter
            {
                if (!datefield.getValue())
                    datefield.setValue(scope.fechaContable);
            }
            return;
        };

        this.fAnexoGasto = function (arrayCuenta, arrayCuentaMixta) {
            if (this.objAnexoGasto) {
                var dataAnexo = scope.arrAnexoOperaciones.filter(function (obj) {
                    return obj.idoperacion === scope.cbAddOperacion.getValue();
                })[0];

                // this.objAnexoGasto = new Ext.AnexoGasto({
                //     arrayCuenta: arrayCuenta,
                //     dataAnexo: dataAnexo ? dataAnexo.anexo : [],
                //     idMoneda: this.cbAddMoneda.getValue(),
                //     scope: this
                // });

                this.objAnexoGasto.loadData(arrayCuenta, dataAnexo ? dataAnexo.anexo : [], this.cbAddMoneda.getValue(), arrayCuentaMixta);
            }
        }
    }
});