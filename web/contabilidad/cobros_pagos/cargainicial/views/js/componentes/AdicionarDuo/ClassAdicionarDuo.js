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
    importeOperacion: '',
    importeContable: '',
    sumaTotal: 0,
    idespecialidad: undefined,
    objClassAnexoGasto: undefined,
    cantOpExcepcionales: undefined,
    etiquetas: undefined,
    fechaContable: undefined,
    arrIdOperBorrar: [],
    url: undefined,
    confEspecialidad: false,
    confFechaRecepcion: true,
    msgAddMod: undefined,
    idOperacion: undefined,
    adiciono: false,

    //oldFechaEmision: undefined,

    constructor: function(etiquetas, params)
    {
        scope = this;
        this.etiquetas = etiquetas;
        Ext.apply(this, params);
        this.tipoDuo = params.tipoDuo;
        this.action = params.action;
        this.idDuo = params.idDuo;
        this.dataDoc = params.dataDoc;
        this.url = params.url;
        this.confEspecialidad = params.confEspecialidad;
        this.classParams = params;
        this.index;
        this.idOperacion;
        this.confFechaRecepcion = params.confFechaRecepcion;
        this.titulo = ((this.action == 1) ? scope.etiquetas.tlAddDuo : scope.etiquetas.tlModDuo).replace('<#tipoDuo>', this.textDuo.toLowerCase());
        this.adiciono;

        //this.oldFechaEmision;

        if (this.tipoDuo == 1)
        {
            this.nombreCliente = scope.etiquetas.lbCliente;//'Cliente';
            this.nombreFecha = scope.etiquetas.lbFechaEntrega;//'Fecha de entrega';
            this.msgExisteDuo = scope.etiquetas.lbMsgExisteDerecho;
            this.msgAddMod = scope.etiquetas.msgCPC;
        }
        else if (this.tipoDuo == 2)
        {
            this.nombreCliente = scope.etiquetas.lbProveedor;//'Proveedor';
            this.nombreFecha = scope.etiquetas.lbFechaRecibo;//'Fecha de recibo';
            this.msgExisteDuo = scope.etiquetas.lbMsgExisteObligacion;
            this.msgAddMod = scope.etiquetas.msgCPP;
        }
        else if (this.tipoDuo == 3)
        {
            this.nombreFecha = scope.etiquetas.lbFechaEntrega;//'Fecha de entrega';
            this.msgExisteDuo = scope.etiquetas.lbMsgExisteDerechoF;
            this.msgAddMod = scope.etiquetas.msgCF;
        }
        else if (this.tipoDuo == 4)
        {
            this.nombreFecha = scope.etiquetas.lbFechaRecibo;//'Fecha de recibo';
            this.msgExisteDuo = scope.etiquetas.lbMsgExisteObligacionF;
            this.msgAddMod = scope.etiquetas.msgPF;
        }

        //this.etiquetas = etiquetas;
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
                // root: 'datos',
                totalProperty: 'cantidad'
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
                    name: 'plazo'},
                {
                    name: 'idclienteproveedorcobropago'
                }, {
                    name: 'idcuenta'
                // }, {
                //     name: 'nombrecuenta'
                // }, {
                //     name: 'idmoneda'
                // }, {
                //     name: 'codigoiso'
                // }, {
                //     name: 'dpp'
                // }, {
                //     name: 'mora'
                // }, {
                //     name: 'activo'
                }
            ])
        });

//        this.stAddCuenta = new Ext.data.Store({
//            url: this.url + 'cargararbolcuenta',
//            sortInfo: {
//                field: 'nombre',
//                direction: "ASC"
//            },
//            reader: new Ext.data.JsonReader({
//                id: 'id'
//            }, [{
//                    name: 'idcuenta'
//                }, {
//                    name: 'nombre',
//                    mapping: 'text'
//                }, {
//                    name: 'idnaturaleza'
//                }
//            ])
//        });

        this.stAddCuenta = new Ext.data.Store({
            url: this.url + 'loadDataCuenta',
            sortInfo: {
                field: 'nombrecuenta',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'id'
            }, [{
                    name: 'idcuenta'
                }, {
                    name: 'nombrecuenta'
                }, {
                    name: 'idnaturaleza'
                }, {
                    name: 'concatcta'
                },{
                    name: 'idcondicionpago',
                    mapping: 'idterminodepago'
                }, {
                    name: 'denominacion',
                    mapping: 'nombreterminodepago'
                }, {
                    name: 'idclienteproveedor'
                }, {
                name: 'plazo'},
                {
                    name: 'idclienteproveedorcobropago'
                    // }, {
                    //     name: 'idcuenta'
                    // }, {
                    //     name: 'nombrecuenta'
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
                }
            ])
        });

        this.stAddClasificadorCuenta = new Ext.data.Store({
            url: this.url + 'cargarCuentas',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'cuenta', mapping: 'id'},
                {name: 'denominacion', mapping: 'text'}
            ])
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
            sortInftotalPropertyo: {
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
                name: 'idmodelo',
                mapping: 'idmodelo'
            }
            ])
        });

        this.stAddMoneda = new Ext.data.Store({
            url: this.url + 'cargarmoneda',
            sortInfo: {
                field: 'codigoiso',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'idmon'
            }, [{
                    name: 'idmoneda',
                    mapping: 'idmoneda'
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
                }, {
                    //Ahora está cargando el id tasa de tipo (Tasa fija)
                    name: 'idtasa'
                }, {
                    //Ahora está cargando el id (Tasa fija)
                    name: 'idtipotasa'
                }
            ])
        });

        //sm del grig de operaciones
        this.smAddGridOperaciones = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.stAddGridOperaciones = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
            }, [{
                    name: 'idoperacion'
                }, {
                    name: 'moneda'
                }, {
                    name: 'idmoneda'
                }, {
                    name: 'importeoriginal'
                }, {
                    name: 'importecontable'
                }, {
                    name: 'liquidadomo'
                }, {
                    name: 'liquidadomb'
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
                idCliente: (this.action == 2) ? this.dataDoc.data.idcliente : '',
                tipoduo: this.tipoDuo,
                iddoc: (this.action == 2) ? this.dataDoc.data.iddoc : ''
            },
            callback: function (options, success, response) {
                Ext.getBody().unmask();
                responseData = Ext.decode(response.responseText);
                var mensaje = '';
                var mostrar = '<br> ' + scope.etiquetas.lbNoEjecAction + '<br> <br>';
                // if (scope.tipoDuo == 1 || scope.tipoDuo == 2) {
                //     if (responseData.clienteProv.cantidad == 0)
                //         mensaje += ('- ' + ((scope.tipoDuo == 1) ? scope.etiquetas.lbNoClientesConf : scope.etiquetas.lbNoProveedorConf) + '<br>');
                // }
                // else if (scope.tipoDuo == 3 || scope.tipoDuo == 4) {
                //     if (!responseData.parrafoFiscal.length)
                //         mensaje += '- ' + (scope.etiquetas.lbNoParrafosConf) + '<br>';
                // }
                // if (!responseData.condicionPago.length)
                //     mensaje += '- ' + scope.etiquetas.lbNoCondicionPagoConf + '<br> ';
                // else {
                //     activo = false;
                //     for (var i = 0; i < responseData.condicionPago.length; i++) {
                //         if (responseData.condicionPago[i].activo == 1) {
                //             condPago = responseData.condicionPago[i];
                //             activo = true;
                //             break;
                //         }
                //     }
                //     if (!activo)
                //         mensaje += '- ' + scope.etiquetas.lbNoCondicionPagoActiva + '<br> ';
                // }

//                if (!responseData.cuentas.length)
//                    mensaje += '- ' + scope.etiquetas.lbNoCuentasConf + '<br> ';
                if (!responseData.tipoDocumentos.length)
                    mensaje += '- ' + scope.etiquetas.lbNoTipoDocConf + '<br> ';
                // if (!responseData.monedas.length)
                //     mensaje += '- ' + scope.etiquetas.lbNoMonedasConf + '<br> ';
                if (scope.confEspecialidad && !responseData.especialidades.length)
                    mensaje += '- ' + scope.etiquetas.lbNoEspecialidadConf + '<br> ';

                if (mensaje != '') {
                    mostrar += mensaje;
                    mostrarMensaje(1, mostrar, function(btn) {
                        scope.fireEvent('closeAdicionar', true);
                    });
                }
                else {
//                    scope.fShowWindow();
//                    scope.loadDataComponent(responseData, this.action);
                    Ext.MessageBox.hide();
                    scope.wAdicionarDuo.show(Ext.getBody(), function()
                    {
//                        scope.wAdicionarDuo.maximize(true);
//                        scope.wAdicionarDuo.doLayout(true);
                        scope.loadDataComponent(responseData);
                        // scope.loadDataComponent(responseData, condPago);

                    });
                }
            }
        });

        return Ext.ClassAdicionarDuo.superclass.constructor.call(this);
    },
    loadDataComponent: function(data)
    // loadDataComponent: function(data, condPago)
    {
        // scope.fCargarOperaciones();

        // if (scope.tipoDuo == 1 || scope.tipoDuo == 2)
        //     this.stAddClienteProveedor.loadData(data.clienteProv);
        // else if (scope.tipoDuo == 3 || scope.tipoDuo == 4)
        //     Ext.getCmp('gpParrafo').getStore().loadData(data.parrafoFiscal);
        //
//        this.stAddCuenta.loadData(data.cuentas);
        this.stAddTipoDoc.loadData(data.tipoDocumentos);
        if (this.stAddTipoDoc.getCount() == 1)
            this.stAddOperacion.loadData(data.operaciones);

        if (scope.confEspecialidad)
            Ext.getCmp('gpEspecialidad').getStore().loadData(data.especialidades);
        
        scope.dfAddFechaEmision.setValue(data.fechacontable);
        scope.dfAddFechaEmision.setMaxValue(data.fechacontable);
        scope.dfAddFechaEntrega.setMaxValue(data.fechacontable);
        scope.dfAddFechaRecepcion.setMaxValue(data.fechacontable);
        scope.fechaContable = data.fechacontable;
        
        //CLIENTE-PROVEEDOR
        // if (this.stAddClienteProveedor.getCount() == 1) {
        //     scope.fLoadOneData(scope.cbAddClienteProveedor, this.stAddClienteProveedor, 'idcliente', 'nombre');
        //     this.cantOpExcepcionales = this.stAddClienteProveedor.getAt(0).get('opeExcepional');
        // }
        // else
        //     scope.cbAddClienteProveedor.enable();
        
        //ESPECIALIDAD
        if (scope.confEspecialidad) {
            if (Ext.getCmp('gpEspecialidad').getStore().getCount() == 1) {
                scope.fLoadOneData(scope.cbAddEspecialidad, Ext.getCmp('gpEspecialidad').getStore(), 'idespecialidad', 'text');
                scope.oldEspecialidad = scope.jrEspecialidad.jsonData[0]['idespecialidad'];
            }
            else
                scope.cbAddEspecialidad.enable();
        }
        //CUENTA
        if (this.stAddCuenta.getCount() == 1)
            scope.fLoadOneData(scope.cbAddCuenta, this.stAddCuenta, 'idcuenta', 'nombre');
//        else
//            scope.cbAddCuenta.enable();
        
        //TIPO DOCUMENTO
        if (this.stAddTipoDoc.getCount() == 1)
            scope.fLoadOneData(scope.cbAddTipoDoc, this.stAddTipoDoc, 'iddoc', 'denominacion');
        else
            scope.cbAddTipoDoc.enable();

        //CONDICION DE PAGO
        // if (this.stAddCondicionPago.getCount() == 1)
        //     scope.fLoadOneData(scope.cbAddCondicionPago, this.stAddCondicionPago, 'idcondicionpago', 'denominacion');
        // else {
        //     scope.cbAddCondicionPago.enable();
        //     scope.cbAddCondicionPago.setValue(condPago.idcondicionpago);
        //     scope.cbAddCondicionPago.setRawValue(scope.stAddCondicionPago.getAt(scope.stAddCondicionPago.find('idcondicionpago', scope.cbAddCondicionPago.getValue())).data.denominacion);
        // }
        
        //MONEDA
        if (this.stAddMoneda.getCount() == 1)
            scope.fLoadOneData(scope.cbAddMoneda, this.stAddMoneda, 'idnommonedaentidad', 'codigoiso');
        
        //EN CASO DE QUE SE VAYA A MODIFICAR
        if (this.action == 2)
        {
            scope.cbAddCondicionPago.disable();
            //scope.cbAddCuenta.disable();
            scope.cbAddMoneda.disable();
            if (scope.tipoDuo == 1 || scope.tipoDuo == 2) {
                scope.stAddClienteProveedor.loadData(data.clienteProv);
                scope.cbAddClienteProveedor.setValue(this.dataDoc.data.idcliente);
                scope.cbAddClienteProveedor.setRawValue(this.dataDoc.data.nombrecliente);
                scope.oldClienteProveedor = this.dataDoc.data.idcliente;
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

            scope.stAddCuenta.loadData(scope.stAddClienteProveedor.getAt(scope.stAddClienteProveedor.find('idcliente', scope.cbAddClienteProveedor.getValue())).data.cobrospagos);
            scope.cbAddCuenta.setValue(this.dataDoc.data.idcuenta);
            scope.cbAddCuenta.setRawValue(this.dataDoc.data.text);
            scope.oldCuenta = this.dataDoc.data.idcuenta;

            scope.stAddCondicionPago.loadData(scope.stAddClienteProveedor.data.items[0].data.cobrospagos);
            scope.oldCondicionPago = this.dataDoc.data.idcondicionpago;
            scope.cbAddCondicionPago.setValue(scope.stAddCuenta.getAt(scope.stAddCuenta.find('idcuenta', this.dataDoc.data.idcuenta)).data.idcondicionpago);
            scope.cbAddCondicionPago.setRawValue(scope.stAddCuenta.getAt(scope.stAddCuenta.find('idcuenta', this.dataDoc.data.idcuenta)).data.denominacion);

            if (scope.confEspecialidad && this.dataDoc.data.idespecialidad) {
                store = Ext.getCmp('gpEspecialidad').getStore();
                indexActual = store.find('idespecialidad', this.dataDoc.data.idespecialidad);
                scope.cbAddEspecialidad.setValue(scope.jrEspecialidad.jsonData[indexActual]['especialidad']);
                scope.cbAddEspecialidad.fSelect.values.push(scope.jrEspecialidad.jsonData[indexActual]['idespecialidad']);
                scope.cbAddEspecialidad.fSelect.display.push(scope.jrEspecialidad.jsonData[indexActual]['especialidad']);
                scope.oldEspecialidad = this.dataDoc.data.idespecialidad;
            }

            // scope.cbAddCuenta.setValue(this.dataDoc.data.idcuenta);
            // scope.cbAddCuenta.setRawValue(this.dataDoc.data.text);
            // scope.oldCuenta = this.dataDoc.data.idcuenta;

            scope.stAddOperacion.baseParams.iddocumento = this.dataDoc.data.iddoc;
            scope.stAddOperacion.baseParams.denominacion = this.dataDoc.data.denominacion;

//             if(scope.tipoDuo == 1 || scope.tipoDuo == 2) {
//                 // scope.fCargarCuentas(this.dataDoc);
// //                scope.cbAddCuenta.setValue(this.dataDoc.data.idcuenta);
// //                scope.cbAddCuenta.setRawValue(this.dataDoc.data.text);
//             } else {
//                 scope.cbAddClasificadorCuenta.setValue(this.dataDoc.data.idcuenta);
//                 scope.cbAddClasificadorCuenta.setRawValue(this.dataDoc.data.text);
//             }
            
            scope.cbAddTipoDoc.setValue(this.dataDoc.data.iddoc);
            scope.cbAddTipoDoc.setRawValue(this.dataDoc.data.denominacion);
            scope.oldTipoDocumento = this.dataDoc.data.iddoc;

            // scope.cbAddCondicionPago.setValue(this.dataDoc.data.idcondicionpago);
            // scope.cbAddCondicionPago.setRawValue(scope.stAddCondicionPago.getAt(scope.stAddCondicionPago.find('idcondicionpago', scope.cbAddCondicionPago.getValue())).data.denominacion);
            // scope.oldCondicionPago = this.dataDoc.data.idcondicionpago;

            scope.dfAddFechaEmision.setValue(this.dataDoc.data.fechaemision);
            scope.oldFechaEmision = this.dataDoc.data.fechaemision;
//            scope.dfAddFechaEntrega.setValue(this.dataDoc.data.fechaentrega);

            scope.tfAddNumeroDocumento.setValue(this.dataDoc.data.numero);
            scope.oldNumeroDocumento = this.dataDoc.data.numero;
            
            if (this.dataDoc.data.numerocontrato != null) {
                scope.tfAddNumeroContrato.setValue(this.dataDoc.data.numerocontrato);
                scope.oldNumeroContrato = this.dataDoc.data.numerocontrato;
            }
//            else {
//                scope.tfAddNumeroContrato.disable();
////                scope.ckbAddExcepcional.setValue(true);
//            }
            
//            if (this.dataDoc.data.fecharecepcion)
//                scope.dfAddFechaRecepcion.setValue(this.dataDoc.data.fecharecepcion);
//            else if (scope.tipoDuo == 2 || scope.tipoDuo == 4) {
//                scope.dfAddFechaRecepcion.disable();
//                scope.ckbAddServicio.setValue(true);
//            }
            scope.tfAddComentario.setValue(this.dataDoc.data.comentario);
            scope.oldDetalle = this.dataDoc.data.comentario;

            operaciones = data.gridOperaciones;
            scope.cbAddOperacion.setValue(data.gridOperaciones[0].idoperacioncontable);
            scope.cbAddOperacion.setRawValue(data.gridOperaciones[0].denominacion);
            scope.oldOperacion = data.gridOperaciones[0].idoperacioncontable;
            
            scope.cbAddMoneda.setValue(data.gridOperaciones[0].idmoneda);
            scope.cbAddMoneda.setRawValue(data.gridOperaciones[0].moneda);
            scope.oldMoneda = data.gridOperaciones[0].idmoneda;
            
            scope.tfAddImporteOriginal.setValue(data.gridOperaciones[0].importemo);
            scope.oldImporteO = data.gridOperaciones[0].importemo;

            scope.tfAddImporteContable.setValue(data.gridOperaciones[0].importemb);
            scope.oldImporteC = data.gridOperaciones[0].importemb;
            
            scope.tfAddLiquidadoOriginal.setValue(data.gridOperaciones[0].liquidadomo);
            scope.oldLiquidadoO = data.gridOperaciones[0].liquidadomo

            scope.tfAddLiquidadoContable.setValue(data.gridOperaciones[0].liquidadomb);
            scope.oldLiquidadoC = data.gridOperaciones[0].liquidadomb;
            
            scope.idOperacion = data.gridOperaciones[0].idoperacion;
            
            if (operaciones != null) {
                var cantidad = operaciones.length;

                var rec = new Ext.data.Record.create([
                    {
                        name: 'idoperacion'
                    }, {
                        name: 'moneda'
                    }, {
                        name: 'idmoneda'
                    }, {
                        name: 'importeoriginal'
                    }, {
                        name: 'importecontable'
                    }, {
                        name: 'liquidadomo'
                    }, {
                        name: 'liquidadomb'
                    }
                ]);

                for (var i = 0; i < cantidad; i++)
                {
                    var agregoper = new rec({
                        idoperacion: operaciones[i].idoperacion,
                        moneda: operaciones[i].moneda,
                        idmoneda: operaciones[i].idmoneda,
                        importeoriginal: (operaciones[i].importemo) ? parseFloat(operaciones[i].importemo) : '0.00',
                        importecontable: (operaciones[i].importemb) ? parseFloat(operaciones[i].importemb) : '0.00',
                        liquidadomo: (operaciones[i].liquidadomo) ? parseFloat(operaciones[i].liquidadomo) : '0.00',
                        liquidadomb: (operaciones[i].liquidadomb) ? parseFloat(operaciones[i].liquidadomb) : '0.00',
                        importe: parseFloat(operaciones[i].importemo),
                        idcuenta: operaciones[i].idcuenta,
                        codigoCuenta: operaciones[i].nombrecuenta,
                        importaux: parseFloat(operaciones[i].importemb),
                        idoperFind: operaciones[i].idmoneda
                    });

                    scope.gpAddGridOperaciones.getStore().add(agregoper);
                }
                scope.tfAddImporteTotal.setValue(scope.fSaldo(this.stAddGridOperaciones.sum('importecontable')));
                scope.tfAddLiquidadoTotal.setValue(scope.fSaldo(this.stAddGridOperaciones.sum('liquidadomb')));
            }
        }

        combo = (scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.cbAddClienteProveedor : scope.cbAddParrafoFiscal;

        if (!combo.disabled)
            combo.focus(true, 1000);
        else if (!scope.cbAddCuenta.disabled)
            scope.cbAddCuenta.focus(true, 1000);
//        else if (scope.confEspecialidad && !scope.cbAddEspecialidad.disabled)
//            scope.cbAddEspecialidad.focus(true, 1000);
        else if (!scope.cbAddTipoDoc.disabled)
            scope.cbAddTipoDoc.focus(true, 1000);
        else if (!scope.cbAddCondicionPago.disabled)
            scope.cbAddCondicionPago.focus(true, 1000);
        else
            scope.tfAddNumeroDocumento.focus(true, 1000);

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
        this.btnAddNuevo.on('click', function(component)
        {
            //scope.fGuardarDatosDuo('apl');
            scope.fResetFields('new');
        });

        this.btnAddGuardar.on('click', function(component)
        {
            scope.fGuardarDatosDuo('add');
        });

        this.btnAddAddOp.on('click', function(component)
        {
            scope.fGestionarOperacion('ADD');
        });

        this.btnAddModOp.on('click', function(component)
        {
            scope.fGestionarOperacion('MOD');
        });

        this.btnAddDelOp.on('click', function(component)
        {
            scope.fGestionarOperacion('DEL');
        });

        this.btnAddCancOp.on('click', function(component)
        {
            scope.fGestionarOperacion('CANC');
        });

        this.addEvents('closeAdicionar');
        this.btnAddCerrar.on('click', function(component)
        {
            scope.wAdicionarDuo.close();
            scope.fireEvent('closeAdicionar', true, scope.adiciono);
        });

        this.ckbAddExcepcional.on('check', function()
        {
            if (scope.ckbAddExcepcional.getValue() == true) {
                scope.tfAddNumeroContrato.reset();
                scope.tfAddNumeroContrato.setDisabled(true);
            }
            else
                scope.tfAddNumeroContrato.setDisabled(false);
            scope.tfAddNumeroContrato.focus();
        });

        this.ckbAddServicio.on('check', function()
        {
            if (scope.ckbAddServicio.getValue() == true) {
                scope.dfAddFechaRecepcion.reset();
                scope.dfAddFechaRecepcion.setDisabled(true);
            }
            else
                scope.dfAddFechaRecepcion.setDisabled(false);
            scope.dfAddFechaRecepcion.focus();
        });

        // this.cbAddClienteProveedor.on('select', function(combo, record, index)
        // {
            // scope.fCargarCuentas(record);
            // if (scope.cbAddClienteProveedor.getValue()) {
            //     this.cantOpExcepcionales = scope.stAddClienteProveedor.getAt(scope.stAddClienteProveedor.find('idcliente', scope.cbAddClienteProveedor.getValue())).data.opeExcepional;
            // }
        // });

        this.dfAddFechaEmision.on('change', function(thiscomp, newvalue, oldvalue) {
            scope.dfAddFechaRecepcion.setMinValue(newvalue);
            scope.dfAddFechaEntrega.setMinValue(newvalue);
        });

        this.dfAddFechaEntrega.on('change', function(thiscomp, newvalue, oldvalue) {
            scope.dfAddFechaRecepcion.setMinValue(newvalue);
            scope.dfAddFechaEmision.setMaxValue(newvalue);
        });

        this.dfAddFechaRecepcion.on('change', function(thiscomp, newvalue, oldvalue) {
            scope.dfAddFechaEntrega.setMaxValue(newvalue);
            scope.dfAddFechaEmision.setMaxValue(newvalue);
        });

        scope.smAddGridOperaciones.on('beforerowselect', function(smodel, rowIndex, keepExisting, record)
        {
            scope.btnAddAddOp.disable();
            scope.btnAddModOp.enable();
            scope.btnAddDelOp.enable();
        }, this);

        scope.smAddGridOperaciones.on('rowselect', function(smodel, rowIndex, keepExisting, record)
        {
            scope.index = rowIndex;
            scope.btnAddAddOp.disable();
            scope.btnAddModOp.enable();
            scope.btnAddDelOp.enable();
            scope.btnAddCancOp.enable();

            scope.cbAddMoneda.setValue(scope.smAddGridOperaciones.getSelected().data.idmoneda);
            scope.cbAddMoneda.setRawValue(scope.smAddGridOperaciones.getSelected().data.moneda);

            scope.tfAddImporteOriginal.setValue(scope.smAddGridOperaciones.getSelected().data.importeoriginal);
            scope.tfAddImporteContable.setValue(scope.smAddGridOperaciones.getSelected().data.importecontable);
            scope.tfAddLiquidadoOriginal.setValue(scope.smAddGridOperaciones.getSelected().data.liquidadomo);
            scope.tfAddLiquidadoContable.setValue(scope.smAddGridOperaciones.getSelected().data.liquidadomb);
        }, this);

        scope.cbAddClienteProveedor.on('keypress', function(t, e) {
            if (e.getKey() == 13) {
//                if (scope.confEspecialidad && !scope.cbAddEspecialidad.disabled)
//                    scope.cbAddEspecialidad.focus(true, 10);
       /*else */if (!scope.cbAddCuenta.disabled)
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

        scope.cbAddParrafoFiscal.on('keypress', function(t, e) {
            if (e.getKey() == 13) {
//                if (scope.confEspecialidad && !scope.cbAddEspecialidad.disabled)
//                    scope.cbAddEspecialidad.focus(true, 10);
       /*else */if (!scope.cbAddCuenta.disabled)
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

//        scope.cbAddEspecialidad.on('keypress', function(t, e) {
//            if (e.getKey() == 13) {
//                if (!scope.cbAddCuenta.disabled)
//                    scope.cbAddCuenta.focus(true, 10);
//                else if (!scope.cbAddTipoDoc.disabled)
//                    scope.cbAddTipoDoc.focus(true, 10);
//                else if (!scope.cbAddCondicionPago.disabled)
//                    scope.cbAddCondicionPago.focus(true, 10);
//                else
//                    scope.tfAddNumeroDocumento.focus(true, 10);
//            }
//            else
//                scope.fClearValue(e, this);
//        });

        scope.cbAddCuenta.on('keypress', function(t, e) {
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

        scope.cbAddTipoDoc.on('keypress', function(t, e) {
            if (e.getKey() == 13) {
                if (!scope.cbAddCondicionPago.disabled)
                    scope.cbAddCondicionPago.focus(true, 10);
                scope.tfAddNumeroDocumento.focus(true, 10);
            } else
                scope.fClearValue(e, this);
        });

        scope.cbAddCondicionPago.on('keypress', function(t, e) {
            if (e.getKey() == 13)
                scope.tfAddNumeroDocumento.focus(true, 10);
            else
                scope.fClearValue(e, this);
        });

        scope.tfAddNumeroDocumento.on('keypress', function(t, e) {
            if (e.getKey() == 13) {
                if (!scope.tfAddNumeroContrato.disabled)
                    scope.tfAddNumeroContrato.focus(true, 10);
                else
                    scope.dfAddFechaEmision.focus(true, 10);
            }
        });

        scope.tfAddNumeroContrato.on('keypress', function(t, e) {
            if (e.getKey() == 13)
                scope.dfAddFechaEmision.focus(true, 10);
        });

        scope.dfAddFechaEmision.on('keypress', function(t, e) {
            if (e.getKey() == 13)
                scope.dfAddFechaEntrega.focus(true, 10);
        });

        scope.dfAddFechaEntrega.on('keypress', function(t, e) {
            if (e.getKey() == 13) {
                if (!scope.dfAddFechaRecepcion.disabled)
                    scope.dfAddFechaRecepcion.focus(true, 10);
                else
                    scope.tfAddComentario.focus(true, 10);
            }
        });

        scope.dfAddFechaRecepcion.on('keypress', function(t, e) {
            if (e.getKey() == 13)
                scope.tfAddComentario.focus(true, 10);
        });

        scope.tfAddComentario.on('keypress', function(t, e) {
            if (e.getKey() == 13) {
                if (!scope.cbAddMoneda.disabled)
                    scope.cbAddMoneda.focus(true, 10);
                else
                    scope.tfAddImporteOriginal.focus(true, 10);
            }
        });

        scope.cbAddMoneda.on('keypress', function(t, e) {
            if (e.getKey() == 13)
                scope.tfAddImporteOriginal.focus(true, 10);
        });

        scope.tfAddImporteOriginal.on('keypress', function(t, e) {
            if (e.getKey() == 13)
                scope.tfAddImporteContable.focus(true, 10);
        });

        scope.tfAddImporteContable.on('keypress', function(t, e) {
            if (e.getKey() == 13)
                scope.tfAddLiquidadoOriginal.focus(true, 10);
        });

        scope.tfAddLiquidadoOriginal.on('keypress', function(t, e) {
            if (e.getKey() == 13)
                scope.tfAddLiquidadoContable.focus(true, 10);
        });

        scope.tfAddLiquidadoContable.on('keypress', function(t, e) {
            if (e.getKey() == 13)
                scope.fGestionarOperacion('ADD');
        });

        // Validar los campos en caso de que se modifique
        scope.dfAddFechaEmision.on('blur', function(df) {
            if (scope.oldFechaEmision != df.getRawValue())
                scope.btnAddGuardar.enable();
            else if (scope.oldClienteProveedor != scope.cbAddClienteProveedor.getValue() || scope.oldTipoDocumento != scope.cbAddTipoDoc.getValue() ||
                scope.oldCondicionPago != scope.cbAddCondicionPago.getValue() || scope.oldNumeroDocumento != scope.tfAddNumeroDocumento.getValue() ||
                scope.oldNumeroContrato != scope.tfAddNumeroContrato.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue() || scope.oldMoneda != scope.cbAddMoneda.getValue() ||
                scope.oldImporteO != scope.tfAddImporteOriginal.getValue() || scope.oldImporteC != scope.tfAddImporteContable.getValue() || scope.oldLiquidadoO != scope.tfAddLiquidadoOriginal.getValue() ||
                scope.oldLiquidadoC != scope.tfAddLiquidadoContable.getValue() || scope.oldOperacion != scope.cbAddOperacion.getValue())
                    scope.btnAddGuardar.enable();
            else
                scope.btnAddGuardar.disable();
        });

        scope.cbAddClienteProveedor.on({
            scope: scope,
            // beforeselect: function(combo, record, index) {
            //     var cuentascliente = record.data.cobrospagos;
            //     var mensaje = (scope.tipoDuo == 1) ? scope.etiquetas.lbMsgNoCuentaCliente : scope.etiquetas.lbMsgNoCuentaProveedor;
            //
            //     if(cuentascliente.length == 0) {
            //         mostrarMensaje(1, mensaje);
            //         return false;
            //     }
            //     else {
            //         for (var i = 0, long = cuentascliente.length; i < long; i++) {
            //             if (scope.tipoDuo == 1 && cuentascliente[i].idclasificacion == 2) {
            //                 return true;
            //             }
            //             else if (scope.tipoDuo == 2 && cuentascliente[i].idclasificacion == 1) {
            //                 return true;
            //             }
            //         }
            //     }
            //
            //     // mostrarMensaje(1, mensaje);
            //     // return false;
            // },
            select: function(combo, record, index) {
                if (this.action == 2) {
                    scope.cbAddCondicionPago.enable();
                    scope.cbAddMoneda.enable();
//                    scope.cbAddTasa.enable();
                }
                    scope.cbAddCuenta.enable();

                scope.cbAddCondicionPago.reset();
                scope.stAddCondicionPago.removeAll();
                scope.cbAddCuenta.reset();
                scope.stAddCuenta.removeAll();
                scope.cbAddMoneda.reset();
                scope.stAddMoneda.removeAll();
                // scope.cbAddTasa.reset();
                // scope.stAddTasa.removeAll();
                scope.stAddCuenta.loadData(scope.stAddClienteProveedor.getAt(scope.stAddClienteProveedor.find('idcliente', scope.cbAddClienteProveedor.getValue())).data.cobrospagos);

                if (this.stAddCuenta.getCount() == 1){
                    scope.fLoadOneData(scope.cbAddCuenta, this.stAddCuenta, 'idcuenta', 'nombrecuenta');
                    scope.cbAddCuenta.fireEvent('select', scope.cbAddCuenta);
                }
                
                // scope.stAddCondicionPago.loadData(scope.stAddClienteProveedor.getAt(scope.stAddClienteProveedor.find('idcliente', scope.cbAddClienteProveedor.getValue())).data.cobrospagos);
                //
                // if (this.stAddCondicionPago.getCount() == 1){
                //     scope.fLoadOneData(scope.cbAddCondicionPago, this.stAddCondicionPago, 'idcondicionpago', 'denominacion');
                //     scope.cbAddCondicionPago.fireEvent('select', scope.cbAddCondicionPago);
                // }
            }
        });

        scope.cbAddCuenta.on({
            scope: scope,
            select: function(combo, record, index) {
                scope.fSetearCombosPorClienteSeleccionado(scope.cbAddCondicionPago, scope.stAddCondicionPago, scope.cbAddCuenta, scope.stAddCuenta, 'idcondicionpago', 'denominacion', 'idcuenta')
                // scope.fSetearCombosPorClienteSeleccionado(scope.cbAddCuenta, scope.stAddCuenta, scope.cbAddCondicionPago, scope.stAddCondicionPago, 'idcuenta', 'nombrecuenta', 'idclienteproveedorcobropago')
                scope.fSetearCombosPorClienteSeleccionado(scope.cbAddMoneda, scope.stAddMoneda, scope.cbAddCuenta, scope.stAddCuenta, 'idmoneda', 'codigoiso', 'idcuenta')
//                this.fCargarTasas();
            }
        });

        scope.cbAddClienteProveedor.on('select', function(combo) {
            if (scope.oldClienteProveedor != combo.getValue())
                scope.btnAddGuardar.enable();
            else if (scope.dfAddFechaEmision.getRawValue() != scope.oldFechaEmision || scope.oldTipoDocumento != scope.cbAddTipoDoc.getValue() ||
                scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values ||
                scope.oldCondicionPago != scope.cbAddCondicionPago.getValue() || scope.oldNumeroDocumento != scope.tfAddNumeroDocumento.getValue() ||
                scope.oldNumeroContrato != scope.tfAddNumeroContrato.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue() || scope.oldMoneda != scope.cbAddMoneda.getValue() ||
                scope.oldImporteO != scope.tfAddImporteOriginal.getValue() || scope.oldImporteC != scope.tfAddImporteContable.getValue() || scope.oldLiquidadoO != scope.tfAddLiquidadoOriginal.getValue() ||
                scope.oldLiquidadoC != scope.tfAddLiquidadoContable.getValue() || scope.oldOperacion != scope.cbAddOperacion.getValue())
                    scope.btnAddGuardar.enable();
            else
                scope.btnAddGuardar.disable();
        });

        scope.cbAddTipoDoc.on('select', function(combo) {
            if (scope.oldTipoDocumento != combo.getValue())
                scope.btnAddGuardar.enable();
            else if (scope.dfAddFechaEmision.getRawValue() != scope.oldFechaEmision || scope.oldClienteProveedor != scope.cbAddClienteProveedor.getValue() ||
                scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values ||
                scope.oldCondicionPago != scope.cbAddCondicionPago.getValue() || scope.oldNumeroDocumento != scope.tfAddNumeroDocumento.getValue() ||
                scope.oldNumeroContrato != scope.tfAddNumeroContrato.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue() || scope.oldMoneda != scope.cbAddMoneda.getValue() ||
                scope.oldImporteO != scope.tfAddImporteOriginal.getValue() || scope.oldImporteC != scope.tfAddImporteContable.getValue() || scope.oldLiquidadoO != scope.tfAddLiquidadoOriginal.getValue() ||
                scope.oldLiquidadoC != scope.tfAddLiquidadoContable.getValue() || scope.oldOperacion != scope.cbAddOperacion.getValue())
                    scope.btnAddGuardar.enable();
            else
                scope.btnAddGuardar.disable();
        });

        // scope.cbAddCondicionPago.on({
        //     scope: scope,
        //     select: function(combo, record, index) {
        //         scope.fSetearCombosPorClienteSeleccionado(scope.cbAddCondicionPago, scope.stAddCondicionPago, scope.cbAddCuenta, scope.stAddCuenta, 'idcondicionpago', 'denominacion', 'idcuenta')
        //         // scope.fSetearCombosPorClienteSeleccionado(scope.cbAddCuenta, scope.stAddCuenta, scope.cbAddCondicionPago, scope.stAddCondicionPago, 'idcuenta', 'nombrecuenta', 'idclienteproveedorcobropago')
        //         scope.fSetearCombosPorClienteSeleccionado(scope.cbAddMoneda, scope.stAddMoneda, scope.cbAddCuenta, scope.stAddCuenta, 'idmoneda', 'codigoiso', 'idcuenta')
        //         // this.fCargarTasas();
        //     }
        // });

        scope.cbAddCondicionPago.on('select', function(combo) {
            if (scope.oldCondicionPago != combo.getValue())
                scope.btnAddGuardar.enable();
            else if (scope.dfAddFechaEmision.getRawValue() != scope.oldFechaEmision || scope.oldClienteProveedor != scope.cbAddClienteProveedor.getValue() ||
                scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values ||
                scope.oldTipoDocumento != scope.cbAddTipoDoc.getValue() || scope.oldNumeroDocumento != scope.tfAddNumeroDocumento.getValue() ||
                scope.oldNumeroContrato != scope.tfAddNumeroContrato.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue() || scope.oldMoneda != scope.cbAddMoneda.getValue() ||
                scope.oldImporteO != scope.tfAddImporteOriginal.getValue() || scope.oldImporteC != scope.tfAddImporteContable.getValue() || scope.oldLiquidadoO != scope.tfAddLiquidadoOriginal.getValue() ||
                scope.oldLiquidadoC != scope.tfAddLiquidadoContable.getValue() || scope.oldOperacion != scope.cbAddOperacion.getValue())
                    scope.btnAddGuardar.enable();
            else
                scope.btnAddGuardar.disable();
        });

        scope.cbAddEspecialidad.on('select', function (combo) {
            if (scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values)
                scope.btnAddGuardar.enable();
            else if (scope.tfAddNumeroDocumento.getRawValue() != scope.oldNumeroDocumento || scope.oldFechaEmision != scope.dfAddFechaEmision.getRawValue() ||
                scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values ||
                scope.oldClienteProveedor != scope.cbAddClienteProveedor.getValue() || scope.oldTipoDocumento != scope.cbAddTipoDoc.getValue() ||
                scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values ||
                scope.oldNumeroContrato != scope.tfAddNumeroContrato.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue() || /*scope.oldMoneda != scope.cbAddMoneda.getValue() ||*/
                scope.oldOperacion != scope.cbAddOperacion.getValue() || scope.oldImporte != scope.tfAddImporte.getValue() || scope.oldFechaEntrega != scope.dfAddFechaEntrega.getRawValue())
                scope.btnAddGuardar.enable();
            else
                scope.btnAddGuardar.disable();
        });

        scope.tfAddNumeroDocumento.on('keyup', function(field) {
            if (scope.oldNumeroDocumento != field.getValue())
                scope.btnAddGuardar.enable();
            else if (scope.dfAddFechaEmision.getRawValue() != scope.oldFechaEmision || scope.oldClienteProveedor != scope.cbAddClienteProveedor.getValue() ||
                scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values ||
                scope.oldTipoDocumento != scope.cbAddTipoDoc.getValue() || scope.oldCondicionPago != scope.cbAddCondicionPago.getValue() ||
                scope.oldNumeroContrato != scope.tfAddNumeroContrato.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue() || scope.oldMoneda != scope.cbAddMoneda.getValue() ||
                scope.oldImporteO != scope.tfAddImporteOriginal.getValue() || scope.oldImporteC != scope.tfAddImporteContable.getValue() || scope.oldLiquidadoO != scope.tfAddLiquidadoOriginal.getValue() ||
                scope.oldLiquidadoC != scope.tfAddLiquidadoContable.getValue() || scope.oldOperacion != scope.cbAddOperacion.getValue())
                    scope.btnAddGuardar.enable();
            else
                scope.btnAddGuardar.disable();
        });

        scope.tfAddNumeroContrato.on('keyup', function(field) {
            if (scope.oldNumeroContrato != field.getValue())
                scope.btnAddGuardar.enable();
            else if (scope.dfAddFechaEmision.getRawValue() != scope.oldFechaEmision || scope.oldClienteProveedor != scope.cbAddClienteProveedor.getValue() ||
                scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values ||
                scope.oldTipoDocumento != scope.cbAddTipoDoc.getValue() || scope.oldCondicionPago != scope.cbAddCondicionPago.getValue() ||
                scope.oldNumeroDocumento != scope.tfAddNumeroDocumento.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue() || scope.oldMoneda != scope.cbAddMoneda.getValue() ||
                scope.oldImporteO != scope.tfAddImporteOriginal.getValue() || scope.oldImporteC != scope.tfAddImporteContable.getValue() || scope.oldLiquidadoO != scope.tfAddLiquidadoOriginal.getValue() ||
                scope.oldLiquidadoC != scope.tfAddLiquidadoContable.getValue() || scope.oldOperacion != scope.cbAddOperacion.getValue())
                    scope.btnAddGuardar.enable();
            else
                scope.btnAddGuardar.disable();
        });

        scope.tfAddComentario.on('keyup', function(field) {
            if (scope.oldDetalle != field.getValue())
                scope.btnAddGuardar.enable();
            else if (scope.dfAddFechaEmision.getRawValue() != scope.oldFechaEmision || scope.oldClienteProveedor != scope.cbAddClienteProveedor.getValue() ||
                scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values ||
                scope.oldTipoDocumento != scope.cbAddTipoDoc.getValue() || scope.oldCondicionPago != scope.cbAddCondicionPago.getValue() ||
                scope.oldNumeroDocumento != scope.tfAddNumeroDocumento.getValue() || scope.oldNumeroContrato != scope.tfAddNumeroContrato.getValue() || scope.oldMoneda != scope.cbAddMoneda.getValue() ||
                scope.oldImporteO != scope.tfAddImporteOriginal.getValue() || scope.oldImporteC != scope.tfAddImporteContable.getValue() || scope.oldLiquidadoO != scope.tfAddLiquidadoOriginal.getValue() ||
                scope.oldLiquidadoC != scope.tfAddLiquidadoContable.getValue() || scope.oldOperacion != scope.cbAddOperacion.getValue())
                    scope.btnAddGuardar.enable();
            else
                scope.btnAddGuardar.disable();
        });

        scope.cbAddMoneda.on('beforeselect', function(combo, record, index) {
            if(!record.data.idtasa) {
                mostrarMensaje(1, scope.etiquetas.msgNoTasaFijaConf);
                return false;
            }
        });
        
        scope.cbAddCuenta.on({
            scope: scope,
            select: function(combo) {
                if (scope.oldClienteProveedor == scope.cbAddClienteProveedor.getValue() && scope.oldCuenta != combo.getValue())
                    scope.btnAddGuardar.enable();
                else if (scope.dfAddFechaEmision.getRawValue() != scope.oldFechaEmision || scope.oldClienteProveedor != scope.cbAddClienteProveedor.getValue() ||
                    scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values ||
                        scope.oldTipoDocumento != scope.cbAddTipoDoc.getValue() || scope.oldNumeroDocumento != scope.tfAddNumeroDocumento.getValue() ||
                        scope.oldNumeroContrato != scope.tfAddNumeroContrato.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue() ||
                        scope.oldImporteO != scope.tfAddImporteOriginal.getValue() || scope.oldImporteC != scope.tfAddImporteContable.getValue() || scope.oldLiquidadoO != scope.tfAddLiquidadoOriginal.getValue() ||
                        scope.oldLiquidadoC != scope.tfAddLiquidadoContable.getValue() || scope.oldOperacion != scope.cbAddOperacion.getValue() || scope.oldMoneda != scope.cbAddMoneda.getValue())
                    scope.btnAddGuardar.enable();
                else
                    scope.btnAddGuardar.disable();
            }
        });
        
        scope.cbAddMoneda.on('select', function(combo) {
            if (scope.oldMoneda != combo.getValue())
                scope.btnAddGuardar.enable();
            else if (scope.dfAddFechaEmision.getRawValue() != scope.oldFechaEmision || scope.oldClienteProveedor != scope.cbAddClienteProveedor.getValue() ||
                scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values ||
                scope.oldTipoDocumento != scope.cbAddTipoDoc.getValue() || scope.oldNumeroDocumento != scope.tfAddNumeroDocumento.getValue() ||
                scope.oldNumeroContrato != scope.tfAddNumeroContrato.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue() ||
                scope.oldImporteO != scope.tfAddImporteOriginal.getValue() || scope.oldImporteC != scope.tfAddImporteContable.getValue() || scope.oldLiquidadoO != scope.tfAddLiquidadoOriginal.getValue() ||
                scope.oldLiquidadoC != scope.tfAddLiquidadoContable.getValue() || scope.oldOperacion != scope.cbAddOperacion.getValue())
                    scope.btnAddGuardar.enable();
            else
                scope.btnAddGuardar.disable();
        });

        this.cbAddTipoDoc.on('select', function () {
            if (scope.cbAddTipoDoc.getValue())
                scope.fCargarOperaciones();
        });

        scope.tfAddImporteOriginal.on('keyup', function(field) {
            if (scope.oldImporteO != field.getValue())
                scope.btnAddGuardar.enable();
            else if (scope.dfAddFechaEmision.getRawValue() != scope.oldFechaEmision || scope.oldClienteProveedor != scope.cbAddClienteProveedor.getValue() ||
                scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values ||
                scope.oldTipoDocumento != scope.cbAddTipoDoc.getValue() || scope.oldCondicionPago != scope.cbAddCondicionPago.getValue() ||
                scope.oldNumeroDocumento != scope.tfAddNumeroDocumento.getValue() || scope.oldNumeroContrato != scope.tfAddNumeroContrato.getValue() || scope.oldMoneda != scope.cbAddMoneda.getValue() ||
                scope.oldImporteC != scope.tfAddImporteContable.getValue() || scope.oldLiquidadoO != scope.tfAddLiquidadoOriginal.getValue() ||
                scope.oldLiquidadoC != scope.tfAddLiquidadoContable.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue() || scope.oldOperacion != scope.cbAddOperacion.getValue())
                    scope.btnAddGuardar.enable();
            else
                scope.btnAddGuardar.disable();
        });

        scope.tfAddImporteContable.on('keyup', function(field) {
            if (scope.oldImporteC != field.getValue())
                scope.btnAddGuardar.enable();
            else if (scope.dfAddFechaEmision.getRawValue() != scope.oldFechaEmision || scope.oldClienteProveedor != scope.cbAddClienteProveedor.getValue() ||
                scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values ||
                scope.oldTipoDocumento != scope.cbAddTipoDoc.getValue() || scope.oldCondicionPago != scope.cbAddCondicionPago.getValue() ||
                scope.oldNumeroDocumento != scope.tfAddNumeroDocumento.getValue() || scope.oldNumeroContrato != scope.tfAddNumeroContrato.getValue() || scope.oldMoneda != scope.cbAddMoneda.getValue() ||
                scope.oldImporteO != scope.tfAddImporteOriginal.getValue() || scope.oldLiquidadoO != scope.tfAddLiquidadoOriginal.getValue() ||
                scope.oldLiquidadoC != scope.tfAddLiquidadoContable.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue() || scope.oldOperacion != scope.cbAddOperacion.getValue())
                    scope.btnAddGuardar.enable();
            else
                scope.btnAddGuardar.disable();
        });

        scope.tfAddLiquidadoOriginal.on('keyup', function(field) {
            if (scope.oldLiquidadoO != field.getValue())
                scope.btnAddGuardar.enable();
            else if (scope.dfAddFechaEmision.getRawValue() != scope.oldFechaEmision || scope.oldClienteProveedor != scope.cbAddClienteProveedor.getValue() ||
                scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values ||
                scope.oldTipoDocumento != scope.cbAddTipoDoc.getValue() || scope.oldCondicionPago != scope.cbAddCondicionPago.getValue() ||
                scope.oldNumeroDocumento != scope.tfAddNumeroDocumento.getValue() || scope.oldNumeroContrato != scope.tfAddNumeroContrato.getValue() || scope.oldMoneda != scope.cbAddMoneda.getValue() ||
                scope.oldImporteO != scope.tfAddImporteOriginal.getValue() || scope.oldImporteC != scope.tfAddImporteContable.getValue() ||
                scope.oldLiquidadoC != scope.tfAddLiquidadoContable.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue() || scope.oldOperacion != scope.cbAddOperacion.getValue())
                    scope.btnAddGuardar.enable();
            else
                scope.btnAddGuardar.disable();
        });

        scope.tfAddLiquidadoContable.on('keyup', function(field) {
            if (scope.oldLiquidadoC != field.getValue())
                scope.btnAddGuardar.enable();
            else if (scope.dfAddFechaEmision.getRawValue() != scope.oldFechaEmision || scope.oldClienteProveedor != scope.cbAddClienteProveedor.getValue() ||
                scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values ||
                scope.oldTipoDocumento != scope.cbAddTipoDoc.getValue() || scope.oldCondicionPago != scope.cbAddCondicionPago.getValue() ||
                scope.oldNumeroDocumento != scope.tfAddNumeroDocumento.getValue() || scope.oldNumeroContrato != scope.tfAddNumeroContrato.getValue() || scope.oldMoneda != scope.cbAddMoneda.getValue() ||
                scope.oldImporteO != scope.tfAddImporteOriginal.getValue() || scope.oldImporteC != scope.tfAddImporteContable.getValue() ||
                scope.oldLiquidadoO != scope.tfAddLiquidadoOriginal.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue() || scope.oldOperacion != scope.cbAddOperacion.getValue())
                    scope.btnAddGuardar.enable();
            else
                scope.btnAddGuardar.disable();
        });

        scope.cbAddOperacion.on('select', function(combo) {
            if (scope.oldOperacion != combo.getValue())
                scope.btnAddGuardar.enable();
            else if (scope.dfAddFechaEmision.getRawValue() != scope.oldFechaEmision || scope.oldClienteProveedor != scope.cbAddClienteProveedor.getValue() ||
                scope.oldEspecialidad != Ext.getCmp('cbxEspecialidad').fSelect.values ||
                scope.oldTipoDocumento != scope.cbAddTipoDoc.getValue() || scope.oldCondicionPago != scope.cbAddCondicionPago.getValue() ||
                scope.oldNumeroDocumento != scope.tfAddNumeroDocumento.getValue() || scope.oldNumeroContrato != scope.tfAddNumeroContrato.getValue() || scope.oldMoneda != scope.cbAddMoneda.getValue() ||
                scope.oldImporteO != scope.tfAddImporteOriginal.getValue() || scope.oldImporteC != scope.tfAddImporteContable.getValue() ||
                scope.oldLiquidadoO != scope.tfAddLiquidadoOriginal.getValue() || scope.oldDetalle != scope.tfAddComentario.getValue())
                scope.btnAddGuardar.enable();
            else
                scope.btnAddGuardar.disable();
        });


    },
    initializeFunctions: function(scope)
    {
        this.fShowWindow = function()
        {
            if (Ext.MessageBox)
                Ext.MessageBox.hide();
            scope.wAdicionarDuo.show(Ext.getBody(), function()
            {
                scope.wAdicionarDuo.maximize(true);
                scope.wAdicionarDuo.doLayout(true);
            });
        };

        this.fCargarOperaciones = function()
        {
            this.stAddOperacion.load({
                params: {
                    iddocumento: scope.cbAddTipoDoc.getValue(),
                    tipoduo: scope.tipoDuo
                },
                callback: function(record, success, response)
                {
                    if (scope.stAddOperacion.getCount() == 0) {
                        mostrarMensaje(1, 'No existen operaciones configuradas para el tipo de documento selecionado.');
                    }
                }
            });
        };

        this.fResetFields = function()
        {
            scope.fGuardarDatosDuo('apl');

            scope.dfAddFechaEmision.enable();
            scope.dfAddFechaEmision.setMinValue('');
            scope.dfAddFechaEmision.setMaxValue('');

            scope.cbAddClienteProveedor.reset();
            scope.cbAddClienteProveedor.enable();
            
            scope.cbAddCuenta.reset();
            
            scope.cbAddTipoDoc.reset();
            scope.cbAddTipoDoc.enable();
            
            scope.tfAddNumeroContrato.reset();
            scope.tfAddNumeroContrato.enable();
            
            scope.tfAddNumeroDocumento.reset();
            scope.tfAddNumeroDocumento.enable();
            
            scope.tfAddComentario.reset();
            scope.tfAddComentario.enable();
            
            scope.cbAddMoneda.reset();
            scope.cbAddMoneda.enable();
            
            scope.tfAddImporteOriginal.reset();
            scope.tfAddImporteOriginal.enable();
            
            scope.tfAddImporteContable.reset();
            scope.tfAddImporteContable.enable();
            
            scope.tfAddLiquidadoOriginal.reset();
            scope.tfAddLiquidadoOriginal.enable();
            
            scope.tfAddLiquidadoContable.reset();
            scope.tfAddLiquidadoContable.enable();
            
            scope.btnAddAddOp.enable();


            //
//            if (scope.tipoDuo == 1 || scope.tipoDuo == 2) {
//                if (scope.stAddClienteProveedor.getCount() > 1)
//                    scope.cbAddClienteProveedor.enable();
//            } else if (scope.tipoDuo == 3 || scope.tipoDuo == 4) {
//                if (Ext.getCmp('gpParrafo').getStore().getCount() > 1)
//                    scope.cbAddParrafoFiscal.enable();
//            }
//
////            if (scope.confEspecialidad) {
////                if (Ext.getCmp('gpEspecialidad').getStore().getCount() > 1)
////                    scope.cbAddEspecialidad.enable();
////            }
//
////            if (scope.stAddCuenta.getCount() > 1)
////                scope.cbAddCuenta.enable();
//
//            if (scope.stAddTipoDoc.getCount() > 1)
//                scope.cbAddTipoDoc.enable();
//
//            if (scope.stAddCondicionPago.getCount() > 1)
//                scope.cbAddCondicionPago.enable();
//
//            if (scope.stAddMoneda.getCount() > 1)
//                scope.cbAddMoneda.enable();
//
//            scope.stAddGridOperaciones.removeAll();
//            scope.gpAddGridOperaciones.enable();
//            scope.btnAddGuardar.enable();
//            scope.tfAddComentario.enable();
//            scope.tfAddImporteTotal.reset();
////            scope.ckbAddExcepcional.reset();
////            scope.ckbAddExcepcional.enable();
//            scope.tfAddNumeroDocumento.reset();
//            scope.tfAddNumeroDocumento.enable();
//            scope.dfAddFechaEmision.reset();
//            scope.dfAddFechaEmision.enable();
//            scope.dfAddFechaEmision.setMinValue('');
//            scope.dfAddFechaEmision.setMaxValue('');
////            scope.dfAddFechaEntrega.reset();
////            scope.dfAddFechaEntrega.enable();
////            scope.dfAddFechaEntrega.setMinValue('');
////            scope.dfAddFechaEntrega.setMaxValue('');
////            scope.dfAddFechaRecepcion.reset();
////            scope.dfAddFechaRecepcion.enable();
////            scope.dfAddFechaRecepcion.setMinValue('');
////            scope.dfAddFechaRecepcion.setMaxValue('');
//            scope.btnAddAddOp.enable();
//
////            if (this.tipoDuo == 2) {
////                scope.ckbAddServicio.reset();
////                scope.ckbAddServicio.enable();
////            }
//
//            scope.tfAddNumeroContrato.enable();
//            if (!scope.tfAddNumeroContrato.getValue())
//                scope.tfAddNumeroContrato.reset();
//
//            scope.tfAddImporteOriginal.reset();
//            scope.tfAddImporteOriginal.enable();
//            scope.tfAddImporteContable.reset();
//            scope.tfAddImporteContable.enable();
//            scope.tfAddLiquidadoOriginal.reset();
//            scope.tfAddLiquidadoOriginal.enable();
//            scope.tfAddLiquidadoContable.reset();
//            scope.tfAddLiquidadoContable.enable();
        };

        this.fLoadOneData = function(combo, store, id, name)
        {
            combo.disable();
            combo.setValue(store.getAt(0).get(id));
            combo.setRawValue(store.getAt(0).get(name));
        };

        this.fSetearCombosPorClienteSeleccionado = function (setCombo, setStore, getCombo, getStore, id, name, idBusqueda) {
            arrCuentas = new Array();
            arrayData = new Array();
            arrayData[0] = new Array();
            arrayData[0][id] = getStore.getAt(getStore.find(idBusqueda, getCombo.getValue())).data[id];//id;
            arrayData[0][name] = getStore.getAt(getStore.find(idBusqueda, getCombo.getValue())).data[name];//name;
            setStore.loadData(arrayData);
            setCombo.setValue(getStore.getAt(getStore.find(idBusqueda, getCombo.getValue())).data[id]);
            setCombo.setRawValue(getStore.getAt(getStore.find(idBusqueda, getCombo.getValue())).data[name]);
        };
        
        this.fCargarCuentas = function(record)
        {
            scope.cbAddCuenta.reset();
            
            if (record.data.cobrospagos.length > 0) {
                
                if (record.data.cobrospagos.length == 1) {
                    scope.cbAddCuenta.setValue(record.data.cobrospagos[0].idcuenta);
                    scope.cbAddCuenta.setRawValue(record.data.cobrospagos[0].nombrecuenta);
                    scope.cbAddCuenta.setDisabled(true);
                }
                else {
                    var arrcuentas = new Array();
                    for (var i = 0, long = record.data.cobrospagos.length; i < long; i++) {
                        //Filtrando por la cuenta por cobrar
                        //En cobros y pagos la cuenta por cobrar es 1
                        //En datos maestros la clasificacion de la cuenta por pagar es 2
                        if (scope.tipoDuo == 1 && record.data.cobrospagos[i].idclasificacion == 2) {
                            arrcuentas.push({
                                idcuenta: record.data.cobrospagos[i].idcuenta,
                                text: record.data.cobrospagos[i].nombrecuenta
                            });
                        }
                        else if (scope.tipoDuo == 2 && record.data.cobrospagos[i].idclasificacion == 1) {
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
                    }
                    else if (arrcuentas.length == 0) {
                        var mensaje = (scope.tipoDuo == 1) ? scope.etiquetas.lbMsgNoCuentaCliente : scope.etiquetas.lbMsgNoCuentaProveedor;
                        mostrarMensaje(1, mensaje);
                        scope.cbAddClienteProveedor.reset();
                        scope.cbAddClienteProveedor.focus(true, true);
                    }
                    else {
                        this.stAddCuenta.loadData(arrcuentas);
                        scope.cbAddCuenta.setDisabled(false);
                        
                        if(this.action == 2) {
                            scope.cbAddCuenta.setValue(record.data.idcuenta);
//                            scope.cbAddCuenta.setRawValue(record.data.text);
                        }
                    }
                }
                
                scope.cbAddCuenta.focus(true, true);
            }
            else {
                var mensaje = (scope.tipoDuo == 1) ? scope.etiquetas.lbMsgNoCuentaCliente : scope.etiquetas.lbMsgNoCuentaProveedor;
                mostrarMensaje(1, mensaje);
                scope.cbAddClienteProveedor.reset();
                scope.cbAddClienteProveedor.focus(true, true);
            }
        };

        this.fGestionarOperacion = function(action)
        {
            if (scope.cbAddMoneda.getValue() != '' && scope.tfAddImporteOriginal.getValue() != '' && scope.tfAddImporteContable.getValue() != '')
            {
                if (action == 'CANC')
                {
                    scope.btnAddAddOp.enable();
                    scope.btnAddModOp.disable();
                    scope.btnAddDelOp.disable();
                    scope.btnAddCancOp.disable();

                    this.smAddGridOperaciones.clearSelections();
                    scope.tfAddImporteOriginal.reset();
                }
                else if (action == 'DEL')
                {
                    if (this.smAddGridOperaciones.getSelected().data.idoperacion)
                        scope.arrIdOperBorrar.push(this.smAddGridOperaciones.getSelected().data.idoperacion);
                    this.stAddGridOperaciones.remove(this.smAddGridOperaciones.getSelected());
                    scope.btnAddAddOp.enable();
                    scope.btnAddModOp.disable();
                    scope.btnAddDelOp.disable();
                }
                else
                {
                    // if (parseFloat(scope.tfAddImporteContable.getValue()) < parseFloat(scope.tfAddImporteOriginal.getValue()))
                    // {
                    //     mostrarMensaje(1, scope.etiquetas.lbImpOrigMayorContable, function() {
                    //         scope.tfAddImporteOriginal.focus(true, 10);
                    //         scope.tfAddImporteOriginal.markInvalid(scope.etiquetas.lbImpOrigMayorContable);
                    //     });
                    //
                    // }
                    // else if (parseFloat(scope.tfAddLiquidadoContable.getValue()) < parseFloat(scope.tfAddLiquidadoOriginal.getValue()))
                    // {
                    //     mostrarMensaje(1, scope.etiquetas.lbLiqOrigMayorContable, function() {
                    //         scope.tfAddLiquidadoOriginal.focus(true, 10);
                    //         scope.tfAddLiquidadoOriginal.markInvalid(scope.etiquetas.lbLiqOrigMayorContable);
                    //     });
                    //
                    // }
                    // else if ((parseFloat(scope.tfAddImporteOriginal.getValue()) < parseFloat(scope.tfAddLiquidadoOriginal.getValue())) || (parseFloat(scope.tfAddImporteContable.getValue()) < parseFloat(scope.tfAddLiquidadoContable.getValue())))
                    if ((parseFloat(scope.tfAddImporteOriginal.getValue()) < parseFloat(scope.tfAddLiquidadoOriginal.getValue())) || (parseFloat(scope.tfAddImporteContable.getValue()) < parseFloat(scope.tfAddLiquidadoContable.getValue())))
                    {
                        if (parseFloat(scope.tfAddImporteOriginal.getValue()) < parseFloat(scope.tfAddLiquidadoOriginal.getValue()))
                        {
                            mostrarMensaje(1, scope.etiquetas.lbImpMoMayorLiqMo, function() {
                                scope.tfAddImporteOriginal.markInvalid(scope.etiquetas.lbImpMoMayorLiqMo);
                                scope.tfAddLiquidadoOriginal.markInvalid(scope.etiquetas.lbLiqOMenorImpO);
                            });
                        }
                        if (parseFloat(scope.tfAddImporteContable.getValue()) < parseFloat(scope.tfAddLiquidadoContable.getValue()))
                        {
                            mostrarMensaje(1, scope.etiquetas.lbImpCMayorLiqC);
                                scope.tfAddImporteContable.markInvalid(scope.etiquetas.lbImpCMayorLiqC);
                                scope.tfAddLiquidadoContable.markInvalid(scope.etiquetas.lbLiqCMenorImpC);
                            }
                    } else {
                        impOriginal = 0;
                        impContable = 0;
                        liqOriginal = 0;
                        liqContable = 0;
                        arrayAnexo = '';

                        var index = this.stAddGridOperaciones.find('idoperFind', scope.cbAddMoneda.getValue());

                        if (index > -1)
                        {
                            if (action == 'MOD') {
                                impOriginal = parseFloat(scope.tfAddImporteOriginal.getValue());
                                impContable = parseFloat(scope.tfAddImporteContable.getValue());
                                if (scope.tfAddLiquidadoOriginal.getValue())
                                    liqOriginal = parseFloat(scope.tfAddLiquidadoOriginal.getValue());
                                if (scope.tfAddLiquidadoContable.getValue())
                                    liqContable = parseFloat(scope.tfAddLiquidadoContable.getValue());
                            } else {
                                impOriginal = parseFloat(this.stAddGridOperaciones.getAt(index).data.importeoriginal) + parseFloat(scope.tfAddImporteOriginal.getValue());
                                impContable = parseFloat(this.stAddGridOperaciones.getAt(index).data.importecontable) + parseFloat(scope.tfAddImporteContable.getValue());
                                if (scope.tfAddLiquidadoOriginal.getValue())
                                    liqOriginal = parseFloat(this.stAddGridOperaciones.getAt(index).data.liquidadomo) + parseFloat(scope.tfAddLiquidadoOriginal.getValue());
                                else
                                    liqOriginal = parseFloat(this.stAddGridOperaciones.getAt(index).data.liquidadomo);
                                if (scope.tfAddLiquidadoContable.getValue())
                                    liqContable = parseFloat(this.stAddGridOperaciones.getAt(index).data.liquidadomb) + parseFloat(scope.tfAddLiquidadoContable.getValue());
                                else
                                    liqContable = parseFloat(this.stAddGridOperaciones.getAt(index).data.liquidadomb);
                            }
                        }
                        else
                        {
                            impOriginal = parseFloat(scope.tfAddImporteOriginal.getValue());
                            impContable = parseFloat(scope.tfAddImporteContable.getValue());
                            if (scope.tfAddLiquidadoOriginal.getValue())
                                liqOriginal = parseFloat(scope.tfAddLiquidadoOriginal.getValue());
                            if (scope.tfAddLiquidadoContable.getValue())
                                liqContable = parseFloat(scope.tfAddLiquidadoContable.getValue());
                        }

                        this.fAdicionarOperacion(impOriginal, impContable, liqOriginal, liqContable);

                        scope.btnAddModOp.disable();
                        scope.btnAddDelOp.disable();
                        scope.btnAddCancOp.disable();
                    }
                }

                scope.tfAddImporteTotal.setValue(scope.fSaldo(this.stAddGridOperaciones.sum('importecontable')));
                scope.tfAddLiquidadoTotal.setValue(scope.fSaldo(this.stAddGridOperaciones.sum('liquidadomb')));
            }
            else
            {
                scope.cbAddMoneda.isValid();
                scope.tfAddImporteOriginal.isValid();
                scope.tfAddImporteContable.isValid();
                mostrarMensaje(1, scope.etiquetas.lbValIncorrectos, function(btn) {
                    if (btn == 'ok') {
                        if (!scope.cbAddMoneda.getValue())
                            scope.cbAddMoneda.focus(true, 10);
                        else if (!scope.tfAddImporteOriginal.getValue())
                            scope.tfAddImporteOriginal.focus(true, 10);
                    }
                });
            }
        };

        this.fAdicionarOperacion = function(impOriginal, impContable, liqOriginal, liqContable)
        {
            var rec = new Ext.data.Record.create([
                {
                    name: 'idoperacion'
                }, {
                    name: 'moneda'
                }, {
                    name: 'idmoneda'
                }, {
                    name: 'importeoriginal'
                }, {
                    name: 'importecontable'
                }, {
                    name: 'liquidadomo'
                }, {
                    name: 'liquidadomb'
                }
            ]);

            var index = this.stAddGridOperaciones.find('idoperFind', scope.cbAddMoneda.getValue());

            agreg = new rec({
                idoperacion: (scope.smAddGridOperaciones.hasSelection()) ? this.stAddGridOperaciones.getAt(scope.index).data.idoperacion : '',
                moneda: scope.cbAddMoneda.getRawValue(),
                idmoneda: scope.cbAddMoneda.getValue(),
                importeoriginal: parseFloat(scope.tfAddImporteOriginal.getValue()),//impOriginal,
                importecontable: parseFloat(scope.tfAddImporteContable.getValue()),//impContable,
                liquidadomo: (scope.tfAddLiquidadoOriginal.getValue()) ? parseFloat(scope.tfAddLiquidadoOriginal.getValue()) : 0.00,//liqOriginal,
                liquidadomb: (scope.tfAddLiquidadoOriginal.getValue()) ? parseFloat(scope.tfAddLiquidadoContable.getValue()) : 0.00,//liqContable,
                importaux: impOriginal,
                idoperFind: scope.cbAddMoneda.getValue()
            });

            if (scope.smAddGridOperaciones.hasSelection())
            {
                this.stAddGridOperaciones.remove(this.stAddGridOperaciones.getAt(scope.index));
                this.stAddGridOperaciones.insert(scope.index, agreg);
            }
            else {
                scope.gpAddGridOperaciones.getStore().add(agreg);
            }
            scope.tfAddImporteTotal.setValue(scope.fSaldo(this.stAddGridOperaciones.sum('importecontable')));
            scope.tfAddLiquidadoTotal.setValue(scope.fSaldo(this.stAddGridOperaciones.sum('liquidadomb')));

            scope.btnAddAddOp.enable();
            scope.tfAddImporteOriginal.reset();
            scope.tfAddImporteContable.reset();
            scope.tfAddLiquidadoOriginal.reset();
            scope.tfAddLiquidadoContable.reset();
            (scope.cbAddMoneda.disabled) ? scope.tfAddImporteOriginal.focus() : scope.cbAddMoneda.focus();
        };

        this.fGuardarDatosDuo = function(accion)
        {
            if (scope.fpAddDuo.getForm().isValid() && scope.tfAddComentario.isValid())
            {
//                if (this.stAddGridOperaciones.getCount() != 0)
//                {
//                 if (scope.ckbAddExcepcional.getValue() == false && scope.tfAddNumeroContrato.getValue() == '')
//                     scope.tfAddNumeroContrato.markInvalid(scope.etiquetas.lbFactExcepcional);
//                 else
//                 {
                    if (this.cantOpExcepcionales > 0 && scope.ckbAddExcepcional.getValue() == true)
                        this.comprobarOpExcepcionales();


                    // if (parseFloat(scope.tfAddImporteContable.getValue()) < parseFloat(scope.tfAddImporteOriginal.getValue()))
                    // {
                    //     mostrarMensaje(1, scope.etiquetas.lbImpOrigMayorContable, function() {
                    //         scope.tfAddImporteOriginal.focus(true, 10);
                    //         scope.tfAddImporteOriginal.markInvalid(scope.etiquetas.lbImpOrigMayorContable);
                    //     });
                    //
                    // }
                    // else if (parseFloat(scope.tfAddLiquidadoContable.getValue()) < parseFloat(scope.tfAddLiquidadoOriginal.getValue()))
                    // {
                    //     mostrarMensaje(1, scope.etiquetas.lbLiqOrigMayorContable, function() {
                    //         scope.tfAddLiquidadoOriginal.focus(true, 10);
                    //         scope.tfAddLiquidadoOriginal.markInvalid(scope.etiquetas.lbLiqOrigMayorContable);
                    //     });
                    //
                    // }

                    else if ((parseFloat(scope.tfAddImporteOriginal.getValue()) < parseFloat(scope.tfAddLiquidadoOriginal.getValue())) || (parseFloat(scope.tfAddImporteContable.getValue()) < parseFloat(scope.tfAddLiquidadoContable.getValue())))
                    {
                        if (parseFloat(scope.tfAddImporteOriginal.getValue()) < parseFloat(scope.tfAddLiquidadoOriginal.getValue()))
                        {
                            mostrarMensaje(1, scope.etiquetas.lbImpMoMayorLiqMo, function() {
                                scope.tfAddImporteOriginal.markInvalid(scope.etiquetas.lbImpMoMayorLiqMo);
                                scope.tfAddLiquidadoOriginal.markInvalid(scope.etiquetas.lbLiqOMenorImpO);
                            });
                        }
                        if (parseFloat(scope.tfAddImporteContable.getValue()) < parseFloat(scope.tfAddLiquidadoContable.getValue()))
                        {
                            mostrarMensaje(1, scope.etiquetas.lbImpCMayorLiqC);
                                scope.tfAddImporteContable.markInvalid(scope.etiquetas.lbImpCMayorLiqC);
                                scope.tfAddLiquidadoContable.markInvalid(scope.etiquetas.lbLiqCMenorImpC);
                        }
                    }
                    else
                        this.fGuardarDatos(accion);
                // }
//                }
//                else
//                    mostrarMensaje(1, scope.etiquetas.lbNoOperGrid);
            }
            else
            {
                if (!scope.tfAddComentario.isValid())
                    scope.tfAddComentario.markInvalid(scope.etiquetas.lbBlankText);
                mostrarMensaje(1, scope.etiquetas.lbValIncorrectos);
            }
        };

        this.comprobarOpExcepcionales = function()
        {
            Ext.Msg.show({
                title: scope.etiquetas.lbBtnCerrar,
                buttons: Ext.Msg.YESNO,
                msg: ((scope.tipoDuo == 1 || scope.tipoDuo == 3) ? scope.etiquetas.lbCantOperExcepD : scope.etiquetas.lbCantOperExcepO) + scope.cantOpExcepcionales + '<br>' + scope.etiquetas.lbContinuar,
                icon: Ext.MessageBox.QUESTION,
                fn: scope.fAccionesExcepcional
            });
        };

        this.fAccionesExcepcional = function(btn)
        {
            if (btn == 'yes') //SI VOY A ADICIONAR UNA FACTURA EXCEPCIONAL
                scope.fGuardarDatos();
        };

        this.fGuardarDatos = function(accion)
        {
            var arrOperaciones = [];
            var index = scope.cbAddMoneda.store.find('idmoneda', scope.cbAddMoneda.getValue());
            // var idtasa = scope.cbAddMoneda.store.getAt(index).data.idtasa;

            arrOperaciones.push({
                idoperacion: (this.action == 2) ? scope.idOperacion : '',
                idoperacioncontable: scope.cbAddOperacion.getValue(),
                idmoneda: scope.cbAddMoneda.getValue(),
                // idtasa: idtasa,
                importeoriginal: scope.tfAddImporteContable.getValue(),
                importecontable: scope.tfAddImporteContable.getValue(),
                liquidadomo: scope.tfAddLiquidadoContable.getValue(),
                liquidadomb: scope.tfAddLiquidadoContable.getValue(),

                importaux: parseFloat(scope.tfAddImporteOriginal.getValue()),
                idoperFind: scope.cbAddMoneda.getValue()
            });

            this.loadMessageBox(this.msgAddMod/*scope.etiquetas.lbGuardando*/);//'Guardando.');

            Ext.Ajax.request({
                url: this.url + ((this.action == 1) ? 'addDuo' : 'modDuo'),
                method: 'POST',
                params: {
                    tipoduo: this.tipoDuo,
                    idDuo: scope.idDuo,
                    idcliente: (this.tipoDuo == 1 || this.tipoDuo == 2) ? scope.cbAddClienteProveedor.getValue() : Ext.getCmp('cbxParrafo').fSelect.values,
                    idcuenta: (this.tipoDuo == 1 || this.tipoDuo == 2) ? scope.cbAddCuenta.getValue() : scope.cbAddClasificadorCuenta.getValue(),
                    textespecialidad: scope.cbAddEspecialidad.getRawValue(),
                    idespecialidad: Ext.getCmp('cbxEspecialidad').fSelect.values,
                    idtipodocumento: scope.cbAddTipoDoc.getValue(),
                    // idcondicionpago: scope.stAddCondicionPago.getAt(scope.stAddCondicionPago.find('idclienteproveedorcobropago', scope.cbAddCondicionPago.getValue())).data.idcondicionpago,
                    idcondicionpago: scope.cbAddCondicionPago.getValue(),
                    // idclienteproveedorcobropago: scope.cbAddCondicionPago.getValue(),
                    plazo: scope.stAddCuenta.getAt(scope.stAddCuenta.find('idcuenta', scope.cbAddCuenta.getValue())).data.plazo,
                    // plazo: scope.stAddCondicionPago.getAt(scope.stAddCondicionPago.find('idcuenta', scope.cbAddCondicionPago.getValue())).data.plazo,
                    numero: scope.tfAddNumeroDocumento.getValue(),
                    numerocontrato: scope.tfAddNumeroContrato.getValue(),
                    fechaemision: scope.dfAddFechaEmision.getRawValue(),
                    fechaentrega: scope.dfAddFechaEmision.getRawValue(),
                    fecharecepcion: scope.dfAddFechaRecepcion.getRawValue(),
                    comentario: scope.tfAddComentario.getValue(),
                    importemb: scope.tfAddImporteContable.getValue(),//scope.tfAddImporteTotal.getValue(),
                    liquidadomb: scope.tfAddLiquidadoContable.getValue(),//scope.tfAddLiquidadoTotal.getValue(),
                    idopborrar: Ext.encode(scope.arrIdOperBorrar),
                    operaciones: Ext.encode(arrOperaciones),
//                    arrOperacionesPrueba: Ext.encode(arrOperacionesPrueba)
                },
                callback: function(options, success, response)
                {
                    Ext.MessageBox.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codM == 1)
                    {
                        scope.adiciono = true;
                        if (accion === 'add') {
                            scope.wAdicionarDuo.close();
                            scope.fireEvent('closeAdicionar', true, scope.adiciono);

                            scope.idDuo = responseData.respuesta;
                            scope.btnAddGuardar.disable();
                            scope.gpAddGridOperaciones.disable();
                            scope.tfAddComentario.disable();
                            scope.tfAddImporteTotal.disable();
                            scope.cbAddCuenta.disable();
//                        if (scope.confEspecialidad)
//                            scope.cbAddEspecialidad.disable();
                            scope.cbAddTipoDoc.disable();
                            scope.cbAddClienteProveedor.disable();
                            scope.tfAddNumeroDocumento.disable();
                            scope.tfAddNumeroContrato.disable();
                            scope.dfAddFechaEmision.disable();
                            scope.dfAddFechaRecepcion.disable();
                            scope.dfAddFechaEntrega.disable();
                            scope.ckbAddExcepcional.disable();
                            scope.cbAddMoneda.disable();
                            scope.tfAddImporteOriginal.disable();
                            scope.tfAddImporteContable.disable();
                            scope.tfAddLiquidadoOriginal.disable();
                            scope.tfAddLiquidadoContable.disable();
                            scope.btnAddAddOp.disable();
                            scope.btnAddModOp.disable();
                            scope.btnAddDelOp.disable();
                            scope.btnAddCancOp.disable();
                            if (scope.tipoDuo == 2 || scope.tipoDuo == 4)
                                scope.ckbAddServicio.disable();
                        }

                        mostrarMensaje(1, scope.etiquetas.msgActionSuccess.replace('<#artDuo>', scope.artTexto).replace('<#tipoDuo>', scope.textDuo.toLowerCase()).replace('<#accion>', scope.actionText.toLowerCase()));
                    }
                    else
                        mostrarMensaje(1, scope.msgExisteDuo);
                }
            });
        };

        this.createToolTip = function(v, m, r)
        {
            m.attr = 'ext:qtip="' +
                    '<b>' + scope.etiquetas.lbMoneda + ': </b>' + r.data.moneda + '</br>' +
                    '<b>' + scope.etiquetas.lbImporteOriginal + ': </b>' + r.data.importeoriginal + '</br>' +
                    '<b>' + scope.etiquetas.lbImporteContable + ': </b>' + r.data.importecontable + '</br>' +
                    '<b>' + scope.etiquetas.lbLiquidadoOriginal + ': </b>' + r.data.liquidadomo + '</br>' +
                    '<b>' + scope.etiquetas.lbLiquidadoContable + ': </b>' + r.data.liquidadomb + '</br>' +
                    '"';

            return v;
        };

        this.fSaldo = function(v) {
            if (v == '')
                return '0.00';
            v = (Math.round((v - 0) * 100)) / 100;
            v = (v < 0) ? v * (-1) : v;
            if (isNaN(v))
                return '0.00';
            return v.toFixed(2);
        };

        this.fClearValue = function(e, combo, rango)
        {
            if ((e.getKey() == 8) || (e.getKey() == 46)) // suprimir y borrar
            {
                combo.clearValue();
                if (rango == 'Ejercicio') {
                    scope.cbBuscarPeriodo.clearValue();
                    scope.fLoadDateInicioFin('', '');
                }
                else if (rango == 'Periodo')
                    scope.fLoadDateInicioFin('', '');
            }
            return;
        };
    }
});