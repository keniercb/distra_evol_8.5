Ext.namespace('Ext.ClassAdicionarMov');

Ext.ClassAdicionarMov = Ext.extend(Ext.Component, {
    tipoMovGen: undefined,
    nombreCliente: undefined,
    nombreFecha: undefined,
    dataDoc: undefined,
    msgExisteMovGen: undefined,
    idMovGen: undefined,
    opCuentaGasto: 0,
    factorConversion: undefined,
    idTrabajadorCliente: undefined,
    trabajadorCliente: 0,
    idMoneda: undefined,
    tasaCompra: undefined,
    importeOperacion: '',
    importeContable: '',
    sumaTotal: 0,
    objClassAnexoGasto: undefined,
    cantOpExcepcionales: undefined,
    arrAnexoOperaciones: [],
    etiquetas: undefined,
    fechaContable: undefined,
    idFondo: undefined,
    idCaja: undefined,
    idCajaFondo: undefined,
    dataLiquidar: [],
    arrayEliminarInstrum: [],
    arrayEliminarOtrasOper: [],
    url: undefined,
    confFechaRecepcion: true,
    idDocumento: null,
    scopeGestionarMov: null,
    constructor: function (etiquetas, params) {
        this.initializeKeyMap(this);
        scope = this;
        this.TaskFormValidation = TaskFormValidation;
        this.etiquetas = etiquetas;
        this.loadMessageBox(scope.etiquetas.lbMsgLoadData);//'Cargando datos para adicionar.');
        Ext.apply(this, params);
        this.cargaInicial = params.cargaInicial;
        this.tipoMovimiento = params.tipoMovimiento;
        this.action = params.action;
        this.idMovGen = params.idMovGen;
        this.idDoc = params.idDoc;
        this.idPersona = params.idPersona;
        this.tipoPersona = params.tipoPersona;
        this.dataDoc = params.dataDoc;
        this.url = params.url;
        this.idFondo = params.idFondo;
        this.idCaja = params.idCaja;
        this.idCajaFondo = params.idCajaFondo;
        this.idFormaPago = params.idFormaPago;
        this.idMoneda = params.idMoneda;
        this.confFechaRecepcion = params.confFechaRecepcion;
        this.classParams = params;
        this.factorConversion;
        this.tasaCompra;
        this.scopeGestionarMov = params.scopeGestionarMov;
        this.arrayEliminarInstrum = [];
        this.arrayEliminarOtrasOper = [];
        this.idDocumento = null;
        this.verInfo = params.verInfo;
        this.titulo = (this.action == 1) ? scope.etiquetas.lbAddMovGen : scope.etiquetas.lbModMovGen;
        if (this.tipoMovGen == 1) {
            this.nombreCliente = scope.etiquetas.lbCliente;//'Cliente';
            this.nombreFecha = scope.etiquetas.lbFechaEntrega;//'Fecha de entrega';
            this.msgExisteMovGen = scope.etiquetas.lbMsgExisteMovGen;
            //this.titulo = (this.action == 1) ? scope.etiquetas.lbAddMovGen : scope.etiquetas.lbModMovGen;
        }

        this.stAddTrabajadorCliente = new Ext.data.Store({
            url: this.url + 'loadDataTrabajadorCliente',
            sortInfo: {
                field: 'nombre',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                root: 'resultado',
                totalProperty: 'cantidad',
                id: 'cliente'
            }, [{
                name: 'idcliente'
            }, {
                name: 'nombre'
            }, {
                name: 'trabajador'
            }
            ])
        });

        this.stOtrasOperaciones = new Ext.data.Store({
            url: this.url + 'loadDataCbOperaciones',
            sortInfo: {
                field: 'denominacion',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                name: 'idoperacion'
            }, {
                name: 'denominacion'
            }, {
                name: 'arraycuenta'
            }, {
                name: 'arrayIdCuenta'
            }, {
                name: 'idtipomovimientocaja'
            }
            ])
        });

        this.stCuentaOper = new Ext.data.Store({
            // url: this.url + 'loadDataOtrasOper',
            sortInfo: {
                field: 'nomcuenta',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                // root: 'datos',
            }, [{
                name: 'nomcuenta'
            }, {
                name: 'idcuenta'
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
            ])
        });

        this.stAddBanco = new Ext.data.Store({
            url: this.url + 'loadDataBanco',
            sortInfo: {
                field: 'nombre',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'idbanco'
            }, [{
                name: 'idbanco'
            }, {
                name: 'nombre'
            }
            ])
        });

        this.smAddGridInstrumentos = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.stAddGridInstrumentos = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            }, [{
                name: 'idInstrumento'
            }, {
                name: 'iddocumento'
            }, {
                name: 'fechaRecepcion'
            }, {
                name: 'fechaEmision'
            }, {
                name: 'idFormaPago'
            }, {
                name: 'formaPago'
            }, {
                name: 'idBanco'
            }, {
                name: 'numeroIntrumento'
            }, {
                name: 'observacion'
            }, {
                name: 'importeIntrumento'
            }, {
                name: 'liquidaciones'
            }, {
                name: 'otrasOperaciones'
            }, {
                name: 'idestadodoc'
            }, {
                name: 'nomestado',
                defaultValue: 'Guardado',
            }, {
                name: 'hideCancel',
                defaultValue: true,
            }, {
                name: 'refInstrumento'
            }])
        });
        this.stAddGridInstrumentos.sort('idInstrumento');

        this.smAddGridLiquidacionInst = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.stAddGridLiquidacionInst = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            }, [{
                name: 'idoperacioncp'
            }, {
                name: 'idoperacioncontable',
                mapping: 'idoperacioncontable'
            }, {
                name: 'numeroduo'
            }, {
                name: 'fechaemision',
                mapping: 'fechaemision'
            }, {
                name: 'estado'
            }, {
                name: 'idliquidacion'
            }, {
                name: 'idmovimientocaja'
            }, {
                name: 'comentario'
            }, {
                name: 'importeOriginal'
            }, {
                name: 'importemo'
            }, {
                name: 'importeliquidado'
            }, {
                name: 'last_liquidarimp',
                type: 'float',
                defaultValue: 0
            }, {
                name: 'liquidarimp',
                type: 'float'
            }, {
                name: 'nombrecuentaduo'
            }, {
                name: 'iva',
                type: 'float'
            }, {
                name: 'idderechouobligacion'
            }
            ]),
            sortInfo: {
                field: 'fechaemision',
                direction: 'ASC'
            }
        });

        this.smAddGridOtrasOper = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.stAddGridOtrasOper = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            }, [{
                name: 'idoperacion'
            }, {
                name: 'idmovimientocaja'
            }, {
                name: 'importe'
            }, {
                name: 'observacion'
            }, {
                name: 'idtipomovimientocaja'
            }, {
                name: 'idanticipo'
            }, {
                name: 'idcuenta'
            }, {
                name: 'nomcuenta'
            }])
        });

        scope = this;
        Ext.Ajax.request({
            url: this.url + 'loadDataAddMovGen',
            method: 'POST',
            params: {
                idMovGen: this.idMovGen,
                idcajafondo: this.idcajafondo,
                idMoneda: this.idMoneda,
                idPersona: this.idPersona,
                tipoPersona: this.tipoPersona,
                accionL: scope.action,
                tipoMovimiento: scope.tipoMovimiento,
                tipoDuo: (scope.tipoMovimiento == 1) ? 2 : 1 //1-Cliente, 2-Proveedor
            },
            callback: function (options, success, response) {
                scope.stAddTrabajadorCliente.baseParams.persona = 0;
                var responseData = Ext.decode(response.responseText);
                var mensaje = '';
                var mostrar = '<br> ' + scope.etiquetas.lbNoEjecAction + '<br> <br>';

                //scope.titulo = scope.titulo + " recbido por: " + responseData.datos.datosUsuario.fullname + " hoy " + responseData.datos.fechacontable;
                if (mensaje != '') {
                    mostrar += mensaje;
                    mostrarMensaje(1, mostrar, function (btn) {
                        scope.fireEvent('closeAdicionar', true);
                    });
                } else {
                    scope.wAdicionarMovGen = new Ext.UIAdicionarMov(scope);
                    scope.initializeEvents(scope);
                    scope.initializeFunctions(scope);
                    Ext.MessageBox.hide();
                    scope.wAdicionarMovGen.show(Ext.getBody(), function () {
                        scope.wAdicionarMovGen.maximize(true);
                        scope.wAdicionarMovGen.doLayout(true);
                        scope.loadDataComponent(responseData.datos);

                        //Validar la activacion del boton guardar
                        var formArray = new Array();
                        formArray.push(scope.fpAddMovGen);

                        // var gridArray = new Array();
                        // gridArray.push(scope.gpAddGridLiquidacionInst);
                        // gridArray.push(scope.gpAddGridOtrasOper);

                        // var fieldArray = new Array();

                        var arrbotones = new Array();
                        arrbotones.push(scope.btnAddAplicar);
                        arrbotones.push(scope.btnAddGuardar);

                        // scope.TaskFormValidation.startTaskValidation(scope.action, formArray, arrbotones/*, gridArray, fieldArray*/);
                        if (scope.action == 1) {
                            scope.createFormSteps('add');
                        } else {
                            scope.createFormSteps('mod');
                        }
                    });
                }
            }
        });

        return Ext.ClassAdicionarMov.superclass.constructor.call(this);
    },
    loadDataComponent: function (data) {
        scope.cbAcreedorDeudor.focus(true, true);
        //---Se debe setear estos valos en el modificar antes de cargar los demas datos
        if (this.action == 2) {
            scope.cbAcreedorDeudor.setValue(this.dataDoc.data.tipoPersona);
        }
        //---------------------------
        if (data.dataBanco.length)
            scope.stAddBanco.loadData(data.dataBanco);
        if (data.dataLiquidar.datos) {
            scope.stAddGridLiquidacionInst.loadData(data.dataLiquidar);
            scope.dataLiquidar = data.dataLiquidar;
            scope.stAddGridLiquidacionInst.sort('numeroduo', 'DESC');
        }
        if (data.dataCbOperaciones.datos) {
            this.stOtrasOperaciones.loadData(data.dataCbOperaciones);
        }
        if (data.dataInstrumento.datos) {
            scope.stAddGridInstrumentos.loadData(data.dataInstrumento);
            //Seleccionar la primera fila
            scope.smAddGridInstrumentos.selectRow(0);
        }

        //Ext.getCmp('fsAnticipo').setTitle(scope.etiquetas.lbTituloAnticipo.replace('<#moneda>', data.dataMoneda));

        //CLIENTE-TRABAJADOR
        if (this.stAddTrabajadorCliente.getCount() == 1)
            scope.fLoadOneData(scope.cbAddTrabajadorCliente, this.stAddTrabajadorCliente, 'idcliente', 'nombre');
        else {
            //scope.cbAddTrabajadorCliente.enable();
            if (scope.tipoMovimiento == 1) {//Si es de Egreso(Salida) Solo puede pagar con efectivo.
                scope.tipoMovimiento.fieldLabel = scope.etiquetas.lbRecibidoPor
            }
        }

        if (scope.tipoMovimiento == 1) {//Si es de 1-Egreso(Salida) Solo puede pagar con efectivo.
            scope.tfAddInstNumero.disable();
            scope.cbAddInstBanco.disable();
            scope.tfAddInstNumero.reset();
            scope.cbAddInstBanco.reset();
            scope.tfAddInstNumero.setVisible(false);
            scope.cbAddInstBanco.setVisible(false);
            scope.btnAddLimpiarInstrumento.setVisible(false);
        } else {
            if (scope.idFormaPago == '1') {
                scope.tfAddInstNumero.disable();
                scope.cbAddInstBanco.disable();
                scope.tfAddInstNumero.reset();
                scope.cbAddInstBanco.reset();
                scope.tfAddInstNumero.setVisible(false);
                scope.cbAddInstBanco.setVisible(false);
                scope.btnAddLimpiarInstrumento.setVisible(false);
            }
        }

        //EN CASO DE QUE SE VAYA A MODIFICAR
        if (this.action == 2) {
            scope.cbAddTrabajadorCliente.setValue(this.dataDoc.data.idPersona);
            scope.cbAddTrabajadorCliente.setRawValue(this.dataDoc.data.nombrePersona);
            scope.cbAcreedorDeudor.disable();
            scope.cbAddTrabajadorCliente.disable();

            scope.tfAddComentarioMovGen.setValue(this.dataDoc.data.comentario);
            scope.tfAddNumeroMovGen.setValue(this.dataDoc.data.numero);
            scope.dfAddFechaEmisionMovGen.setValue(this.dataDoc.data.fecha);

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

                    scope.gpAddGridInstrumentos.getStore().add(agregoper);
                }
                scope.tfAddImporteTotal.setValue(scope.fSaldo(this.stAddGridInstrumentos.sum('importecontable')));
            }
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
    initializeEvents: function (scope) {

        // this.btnAddAplicar.on('click', function (component) {
        //     if (!scope.gpAddGridInstrumentos.getSelectionModel().hasSelection() && (cleanComa(scope.tfAddImporteTotalLiquidar.getValue()) > 0 || scope.tfAddImporteTotalOtrasOper.getValue() > 0)) {
        //         scope.btnAddRegistrarInstrumento.fireEvent('click');
        //     }
        //     if (scope.tfAddComentarioMovGen.getValue() == "")
        //         scope.tfAddComentarioMovGen.markInvalid(scope.etiquetas.lbBlankText);
        //     else if (scope.tfAddImporteTotalMovGen.getValue() > 0) {
        //         scope.fGuardarDatosMovGen(true);
        //     } else {
        //         mostrarMensaje(1, scope.etiquetas.lbInvalidImporte);
        //     }
        // });

        // this.btnAddGuardar.on('click', function (component) {
        //     if (!scope.gpAddGridInstrumentos.getSelectionModel().hasSelection() && (cleanComa(scope.tfAddImporteTotalLiquidar.getValue()) > 0 || scope.tfAddImporteTotalOtrasOper.getValue() > 0)) {
        //         scope.btnAddRegistrarInstrumento.fireEvent('click');
        //     }
        //     if (scope.tfAddComentarioMovGen.getValue() == "")
        //         scope.tfAddComentarioMovGen.markInvalid(scope.etiquetas.lbBlankText);
        //     else if (scope.tfAddImporteTotalMovGen.getValue() > 0) {
        //         scope.fGuardarDatosMovGen(false);
        //     } else {
        //         mostrarMensaje(1, scope.etiquetas.lbInvalidImporte);
        //     }
        // });

        this.rowEditor.on({
            scope: this,
            afteredit: function (editor, grid, changes, record, rowIndex) {
                scope.importeTotalOtrasOper();
                scope.recordedit = null;
            },
            beforeedit: function (roweditor, grid, record, rowIndex) {
                // return false;//Para que no deje editar
                if (scope.verInfo == true)//No dejar editar el rowEditor si viene Vista Info en true
                    return false;
                //-----------------------------------------
                scope.recordedit = record;
                scope.cbxCuenta.disable();
                if (record.data.idoperacion != '' && !scope.cargaInicial) {
                    var index = scope.stOtrasOperaciones.find('idoperacion', record.data.idoperacion);
                    if (index >= 0) {
                        scope.stCuenta.baseParams.arrayIdCuenta = Ext.encode(scope.stOtrasOperaciones.getAt(index).data.arrayIdCuenta);
                        scope.cbxCuenta.load();
                    }
                }
            }
        });

        scope.cbxCuenta.getStore().on({
            load: function () {
                var record = scope.recordedit;
                if (scope.cbOtrasOperaciones.getValue() == record.data.idoperacion)
                    scope.cbxCuenta.setValue(record.data.idcuenta, record.data.nomcuenta);
                scope.cbxCuenta.enable();
            }
        });

        this.btnAddConfirmar.on('click', function (component) {
            scope.scopeGestionarMov.fShowConfirmarMov(scope.idDocumento);
            scope.btnAddConfirmar.setDisabled(true);
            scope.btnAddContabilizar.setDisabled(false);
        });

        this.btnAddActualizar.on('click', function (component) {
            scope.gpAddGridInstrumentos.getSelectionModel().clearSelections();
            scope.fLoadDataLiquidar();
        });

        this.btnAddRegistrarInstrumento.on('click', function (btn) {
            if (!scope.fpAddMovGen.getForm().isValid()) {
                mostrarMensaje(1, scope.etiquetas.lbValIncorrectos);
            } else if (cleanComa(scope.tfAddImporteTotalLiquidar.getValue()) == 0 && scope.tfAddImporteTotalOtrasOper.getValue() == 0) {
                mostrarMensaje(1, scope.etiquetas.lbRegistOperInst);
            } else if (scope.tfAddInstImporte.getValue() != '' && parseFloat(scope.tfAddInstImporte.getValue()).toFixed(2) != parseFloat(parseFloat(scope.tfAddImporteTotalLiquidar.getValue()) + parseFloat(scope.tfAddImporteTotalOtrasOper.getValue())).toFixed(2)) {
                mostrarMensaje(1, scope.etiquetas.lbImporteCorrecDesglo);
            } else {
                // if (scope.fpAddMovGen.getForm().isValid() && (cleanComa(scope.tfAddImporteTotalLiquidar.getValue()) > 0 || scope.tfAddImporteTotalOtrasOper.getValue() > 0)) {
                scope.fAddIntrumento();
                scope.btnAddRegistrarInstrumento.disable();
                scope.fResetValuesIntrumento(true);
                scope.btnAddOtrasOper.disable();
            }
        });

        this.btnAddLimpiarInstrumento.on('click', function (btn) {
            scope.fResetValuesIntrumento(false);
            scope.btnAddOtrasOper.enable();
            scope.btnAddRegistrarInstrumento.enable();
            scope.cbAddInstBanco.allowBlank = false;
            scope.tfAddInstNumero.allowBlank = false;
            scope.tfAddInstImporte.allowBlank = false;
        });

        this.smAddGridInstrumentos.on('rowselect', function (smodel, rowIndex, record) {
            scope.btnAddRegistrarInstrumento.enable();
            scope.fSetValuesIntrumento(false);
            scope.btnAddOtrasOper.enable();
            scope.gpAddGridInstrumentos.getView().addRowClass(rowIndex, "negrita");
        });

        this.smAddGridInstrumentos.on('rowdeselect', function (smodel, rowIndex, record) {
            scope.btnAddRegistrarInstrumento.disable();
            scope.btnAddOtrasOper.disable();
            scope.fResetValuesIntrumento(true);
            scope.gpAddGridInstrumentos.getView().removeRowClass(rowIndex, "negrita");
        });

        this.cbAcreedorDeudor.on({
            'select': function (cb) {
                scope.cbAddTrabajadorCliente.reset();
                scope.cbAddTrabajadorCliente.enable();
                scope.stAddTrabajadorCliente.removeAll();
                //scope.stOtrasOperaciones.removeAll();
                scope.stAddGridOtrasOper.removeAll();
                scope.stAddGridInstrumentos.removeAll();
                scope.stAddGridLiquidacionInst.removeAll();
                scope.stAddTrabajadorCliente.baseParams.tipoAcreedorDeudor = cb.getValue();
                scope.stAddTrabajadorCliente.load();
            }
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

        this.cbAddTrabajadorCliente.on('select', function (component) {
            scope.btnAddActualizar.enable();
            scope.btnAddRegistrarInstrumento.enable();
            scope.dataLiquidar = [];
            scope.stAddGridLiquidacionInst.removeAll();
            //scope.stOtrasOperaciones.removeAll();
            scope.stAddGridInstrumentos.removeAll();
            scope.stAddGridOtrasOper.removeAll();
            scope.tfAddImporteTotalLiquidar.reset();
            scope.tfAddImporteTotalOtrasOper.reset();
            //----
            if (!scope.cargaInicial) {
                scope.fLoadDataLiquidar();
                scope.stOtrasOperaciones.load({
                    params: {
                        'tipoMovimiento': scope.tipoMovimiento,
                        'idmoneda': scope.idMoneda,
                        'idclienteproveedor': scope.cbAcreedorDeudor.getValue() != 1 ? scope.cbAddTrabajadorCliente.getValue() : null,
                    }
                });
            }
            //---------
        });

        this.addEvents('closeAdicionar');
        this.btnAddCerrar.on('click', function (component) {
            scope.wAdicionarMovGen.close();
            scope.fireEvent('closeAdicionar', true);
        });

        //this.addEvents('contabilizarAdicionar');
        this.btnAddContabilizar.on('click', function (component) {
            scope.scopeGestionarMov.fShowContabilizarMov(scope.idDocumento);
            scope.btnAddConfirmar.setDisabled(true);
            scope.btnAddContabilizar.setDisabled(true);
        });

        scope.cbAddOperacion.on('select', function () {
            this.opCuentaGasto = scope.stAddOperacion.getAt(scope.stAddOperacion.find('idoperacion', scope.cbAddOperacion.getValue())).data.cuentagasto;
        });

        scope.smAddGridLiquidacionInst.on('beforerowselect', function (smodel, rowIndex, keepExisting, record) {
            scope.btnAddOpAdicionar.disable();
            scope.btnAddOpModificar.enable();
            scope.btnAddOpEliminar.enable();
        }, this);

        scope.smAddGridLiquidacionInst.on('rowselect', function (smodel, rowIndex, keepExisting, record) {
            scope.btnAddOpAdicionar.disable();
            scope.btnAddOpModificar.enable();
            scope.btnAddOpEliminar.enable();
            scope.btnAddOpCancelar.enable();

            //validar que si existe una sola operacion en el combo y es distinta a la que estoy seleccionando en el grid mostrar mensaje diciendo que no se puede modificar.
            scope.cbAddOperacion.setValue(scope.smAddGridLiquidacionInst.getSelected().data.idoperacioncontable);
            scope.cbAddOperacion.setRawValue(scope.smAddGridLiquidacionInst.getSelected().data.operacion);
            scope.factorConversion = scope.smAddGridLiquidacionInst.getSelected().data.factordeconversion;
            scope.tasaCompra = scope.smAddGridLiquidacionInst.getSelected().data.compra;
        }, this);

        scope.cbAddRecibidoPor.on('keypress', function (t, e) {
            if (e.getKey() == 13)
                scope.dfAddFechaEmisionMovGen.focus(true, 10);
        });

        scope.dfAddFechaEmisionMovGen.on('keypress', function (t, e) {
            if (e.getKey() == 13)
                scope.fSetDefaultDate(e, this);
        });

        scope.tfAddComentarioMovGen.on('keypress', function (t, e) {
            if (e.getKey() == 13) {
                if (!scope.cbAddOperacion.disabled)
                    scope.cbAddOperacion.focus(true, 10);
            }
        });

        scope.rowActionOper.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    mostrarMensaje(2, scope.etiquetas.lbPregEliminarOper, function (btnPress) {
                        if (btnPress === 'ok') {
                            scope.eliminarOperacion();
                        }
                    });
                    break;
            }
        });
        //-------
        scope.rowActionInst.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    mostrarMensaje(2, scope.etiquetas.lbPregEliminarIntrum, function (btnPress) {
                        if (btnPress === 'ok') {
                            scope.eliminarInstrumento();
                        }
                    });
                    break;
                case 'cancelar':
                    var numInst = record.data.numeroIntrumento;
                    var lbPregCancelarInst = String.format(scope.etiquetas.lbPregCancelarInst, numInst);
                    mostrarMensaje(2, lbPregCancelarInst, function (btnPress) {
                        if (btnPress === 'ok') {
                            scope.cancelarInstrumento(record.data.iddocumento, numInst, record.data.idestadodoc, record);
                        }
                    }.bind(this));
                    break;
            }
        });
        //-----------
        scope.wAdicionarMovGen.on({
            scope: this,
            hide: function () {
                keyMap.enable();
            }, show: function () {
                keyMap.disable();
                //Mostrar Vista Informativa sin dejar modificar si no esta guardado
                if (scope.verInfo) {//Solo Vista Informativa
                    scope.wAdicionarMovGen.setTitle('Información del movimiento');
                    scope.btnAddGuardar.setVisible(false);
                    scope.btnAddLimpiarInstrumento.setVisible(false);
                    scope.btnAddRegistrarInstrumento.setVisible(false);
                    scope.tfAddComentarioMovGen.disable();
                    scope.dfAddFechaEmisionMovGen.disable();
                    scope.smAddGridLiquidacionInst.lock();
                    scope.smAddGridOtrasOper.lock();
                    scope.btnAddOtrasOper.setVisible(false);
                    scope.btnAddActualizar.setVisible(false);
                }
            }
        });

        scope.smGridLiquidacionInst.on({
            scope: this,
            selectionchange: function (sel) {
                scope.importeTotalLiquidar();
            },
            rowselect: function (sm, index, record) {
                if (!record.data.liquidarimp) {
                    if (record.json.liquidarimp && record.json.idliquidacion) {
                        var liq = record.data.importeOriginal - (record.data.importeliquidado - record.json.liquidarimp);
                    } else {
                        var liq = record.data.importeOriginal - record.data.importeliquidado;
                    }
                    record.set('liquidarimp', parseFloat(liq.toFixed(2)));
                }
            },
            rowdeselect: function (sm, index, record) {
                record.set('liquidarimp', 0);
            }
        });

        scope.gpAddGridLiquidacionInst.on({
            beforeedit: function (obj) {
                if (obj.field == 'liquidarimp') {
                    if (obj.record.json.liquidarimp && obj.record.json.idliquidacion) {
                        var liq = obj.record.data.importeOriginal - (obj.record.data.importeliquidado - obj.record.json.liquidarimp);
                    } else {
                        var liq = obj.record.data.importeOriginal - obj.record.data.importeliquidado;
                    }
                    scope.tfAddImpLiquidar.maxValue = parseFloat(liq.toFixed(2));
                    if (!obj.record.data.liquidarimp) {
                        obj.record.set('liquidarimp', parseFloat(liq.toFixed(2)));
                        scope.smGridLiquidacionInst.selectRow(obj.row, true);
                    }
                }
            },
            afteredit: function (obj) {
                scope.importeTotalLiquidar();
                if (obj.value == 0) {
                    scope.smGridLiquidacionInst.deselectRow(obj.row);
                }
            },
            render: function () {
                if (scope.gpAddGridLiquidacionInst.hasListener('rowmousedown')) {
                    scope.gpAddGridLiquidacionInst.events['rowmousedown'].clearListeners();
                }
                // scope.gpAddGridLiquidacionInst.on('rowmousedown', function (g, rowIndex, e) {
                //     var sm = g.getSelectionModel();
                //     if(e.button !== 0 || sm.isLocked()){
                //         return;
                //     };
                //     var view = g.getView();
                //     if(e.shiftKey && sm.last !== false){
                //         var last = sm.last;
                //         sm.selectRange(last, rowIndex, !e.ctrlKey);
                //         sm.last = last; // reset the last
                //         view.focusRow(rowIndex);
                //     }else{
                //         var isSelected = sm.isSelected(rowIndex);
                //         if(e.ctrlKey && isSelected){
                //             sm.deselectRow(rowIndex);
                //         }else if(!isSelected || sm.getCount() > 1){
                //             sm.selectRow(rowIndex, !e.ctrlKey || e.shiftKey);
                //             view.focusRow(rowIndex);
                //         }
                //     }
                // });
            }
        });

        scope.stAddGridInstrumentos.on({
            scope: this,
            load: function () {
                scope.gridInstrumentosAfterEdit();
            },
            add: function () {
                scope.gridInstrumentosAfterEdit();
            },
            clear: function () {
                scope.gridInstrumentosAfterEdit();
            },
            remove: function () {
                scope.gridInstrumentosAfterEdit();
            }
        });
    },
    initializeFunctions: function (scope) {
        this.fShowWindow = function () {
            if (Ext.MessageBox)
                Ext.MessageBox.hide();
            scope.wAdicionarMovGen.show(Ext.getBody(), function () {
                scope.wAdicionarMovGen.maximize(true);
                scope.wAdicionarMovGen.doLayout(true);
            });
        };

        this.fCargarOperaciones = function () {
            this.loadMessageBox(scope.etiquetas.lbMsgLoadOperaciones);
            this.cbAddOperacion.reset();
            this.stAddOperacion.load({
                params: {
                    iddoc: scope.cbAddTipoDoc.getValue(),
                    cargaInicial: scope.cargaInicial
                },
                callback: function (record, success, response) {
                    if (this.getCount()) {
                        Ext.MessageBox.hide();
                    } else {
                        mostrarMensaje(1, scope.etiquetas.lbMsgNoExisteOperaciones, function (btn) {
                            if (btn == 'ok')
                                scope.cbAddTipoDoc.focus(true, 10);
                        });
                    }
                }
            });
        };

        this.fResetFields = function () {

            scope.idMovGen = '';

            scope.cbAcreedorDeudor.enable();
            scope.cbAddTrabajadorCliente.enable();
            scope.cbAcreedorDeudor.reset();
            scope.cbAddTrabajadorCliente.reset();
            scope.tfAddComentarioMovGen.reset();

            if (scope.tfAddNumeroMovGen.rendered)
                scope.tfAddNumeroMovGen.reset();

            scope.tfAddImporteTotalMovGen.reset();

            //if (scope.stAddOperacion.getCount() > 1)
            //    scope.cbAddOperacion.enable();

            scope.stAddGridInstrumentos.removeAll();
            scope.stAddGridLiquidacionInst.removeAll();
            scope.stAddGridOtrasOper.removeAll();

            scope.gpAddGridInstrumentos.enable();
            scope.btnAddGuardar.enable();
            scope.tfAddComentarioMovGen.enable();
            scope.btnAddOtrasOper.enable();
            scope.dfAddFechaEmisionMovGen.reset();
            scope.dfAddFechaEmisionMovGen.enable();
            //scope.dfAddFechaEmisionMovGen.setMinValue('');
            //scope.dfAddFechaEmisionMovGen.setMaxValue('');
            scope.btnAddOpAdicionar.enable();

            if (this.tipoMovGen == 2) {
                scope.ckbAddServicio.reset();
                scope.ckbAddServicio.enable();
            }

            scope.tfAddInstComentario.reset();

            scope.btnAddConfirmar.disable();
            scope.btnAddContabilizar.disable();
        };

        this.fLoadOneData = function (combo, store, id, name) {
            combo.disable();
            combo.setValue(store.getAt(0).get(id));
            combo.setRawValue(store.getAt(0).get(name));
        };

        this.fLoadDataLiquidar = function () {
            scope.idTrabajadorCliente = scope.cbAddTrabajadorCliente.getValue();
            if (scope.tipoMovimiento == 1)//Si es de Egreso(Salida) Solo puede pagar con efectivo.
                this.loadMessageBox(scope.etiquetas.lbMsgLoadCxPLiquidar);
            else this.loadMessageBox(scope.etiquetas.lbMsgLoadCxcLiquidar);
            Ext.Ajax.request({
                url: this.url + 'loadDataLiquidar',
                method: 'POST',
                params: {
                    idMoneda: scope.idMoneda,
                    idPersona: scope.idTrabajadorCliente,
                    tipoPersona: scope.cbAcreedorDeudor.getValue(),
                    accionL: scope.action,
                    tipoDuo: (scope.tipoMovimiento == 1) ? 2 : 1 //1-Cliente, 2-Proveedor
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    Ext.MessageBox.hide();
                    if (responseData.cantidad == 0) {
                        if (scope.tipoMovimiento == 1)//Si es de Egreso(Salida) Solo puede pagar con efectivo.
                            mostrarMensaje(1, scope.etiquetas.NoExistenCxPLiquidar);
                        else
                            mostrarMensaje(1, scope.etiquetas.NoExistenCxcLiquidar);
                        scope.btnAddLiquidarTodo.disable();
                    } else {
                        scope.btnAddLiquidarTodo.enable();
                        scope.stAddGridLiquidacionInst.loadData(responseData);
                        scope.dataLiquidar = responseData;
                    }
                }
            });
        };

        this.fGestionarOperacion = function (action) {
        };

        this.fAdicionarOperacion = function (impOperacion, impContable, idCuentaOperacion, nombreCuentaOperacion, arrayAnexo) {
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

            var index = this.stAddGridInstrumentos.find('idoperFind', scope.cbAddOperacion.getValue());

            agreg = new rec({
                operacion: scope.cbAddOperacion.getRawValue(),
                idoperacioncontable: scope.cbAddOperacion.getValue(),
                idoperacion: (index > -1) ? this.stAddGridInstrumentos.getAt(index).data.idoperacion : '',
                anexo: arrayAnexo, // SE GUARDAN LOS ANEXOS DE ESTA OPERACION
                importe: importeMo,
                iva: valorIVA,
                importaux: parseFloat(impOperacion), // * parseFloat(scope.factorConversion),
                importecontable: importeMo, //este importecontable es para el sum del grid
                compra: scope.cbAddTasa.getRawValue(),
                idtasa: scope.cbAddTasa.getValue(),
                factordeconversion: parseFloat(scope.factorConversion),
                idcuenta: idCuentaOperacion,
                codigoCuenta: nombreCuentaOperacion,
                idoperFind: scope.cbAddOperacion.getValue()
            });

            if (index > -1) {
                this.stAddGridInstrumentos.remove(this.stAddGridInstrumentos.getAt(index));
                this.stAddGridInstrumentos.insert(index, agreg);
            } else
                scope.gpAddGridInstrumentos.getStore().add(agreg);

            scope.tfAddImporteTotal.setValue(scope.fSaldo(this.stAddGridInstrumentos.sum('importe')));

            scope.btnAddOpAdicionar.enable();
        };

        this.fGuardarDatosMovGen = function (aplicar, fnCallBack) {
            if (/*scope.fpAddMovGen.getForm().isValid() && */scope.tfAddComentarioMovGen.isValid()) {
                if (this.stAddGridInstrumentos.getCount() > 0) {
                    this.fGuardarDatos(aplicar, fnCallBack);
                } else
                    mostrarMensaje(1, scope.etiquetas.lbNoOperGrid);
            } else {
                if (!scope.tfAddComentarioMovGen.isValid())
                    scope.tfAddComentarioMovGen.markInvalid(scope.etiquetas.lbBlankText);
                mostrarMensaje(1, scope.etiquetas.lbValIncorrectos);
            }
        };

        this.fCargarContratos = function () {
            scope.cbAddRecibidoPor.reset();
            this.loadMessageBox(scope.etiquetas.lbMsgLoadContrato); //'Cargando tasas asociadas a la moneda seleccionada...');
            this.stAddNumeroContrato.load({
                params: {
                    idcliente: scope.cbAddTrabajadorCliente.getValue()
                },
                callback: function (options, success, response) {
                    Ext.MessageBox.hide();
                }
            });
        };

        this.comprobarOpExcepcionales = function () {
            Ext.Msg.show({
                title: scope.etiquetas.lbBtnCerrar,
                buttons: Ext.Msg.YESNO,
                msg: ((scope.tipoMovGen == 1 || scope.tipoMovGen == 3) ? scope.etiquetas.lbCantOperExcepD : scope.etiquetas.lbCantOperExcepO) + scope.cantOpExcepcionales + '<br>' + scope.etiquetas.lbContinuar,
                icon: Ext.MessageBox.QUESTION,
                fn: scope.fAccionesExcepcional
            });
        };

        this.fAccionesExcepcional = function (btn) {
            if (btn == 'yes') //SI VOY A ADICIONAR UNA FACTURA EXCEPCIONAL
                scope.fGuardarDatos();
        };

        this.fGuardarDatos = function (aplicar, fnCallBack) {
            var arrayInstrumento = [];
            for (var i = 0; i < this.stAddGridInstrumentos.getCount(); i++) {
                arrayInstrumento.push(this.stAddGridInstrumentos.getAt(i).data);
            }
            this.loadMessageBox(scope.etiquetas.lbGuardando);//'Guardando.');

            Ext.Ajax.request({
                url: this.url + 'addMovGen',
                method: 'POST',
                params: {
                    tipoMovimiento: this.tipoMovimiento,
                    cargaInicial: scope.cargaInicial,
                    idDocumento: this.idDoc,
                    idMovimiento: this.idMovGen,
                    idPersona: scope.cbAddTrabajadorCliente.getValue(),
                    tipoPersona: scope.cbAcreedorDeudor.getValue(),
                    comentario: scope.tfAddComentarioMovGen.getValue(),
                    numeroDoc: scope.tfAddNumeroMovGen.getValue(),
                    fechaMovimiento: scope.dfAddFechaEmisionMovGen.getRawValue(),
                    idCaja: scope.idCaja,
                    idCajaFondo: scope.idCajaFondo,
                    idMoneda: scope.idMoneda,
                    instrumentos: Ext.encode(arrayInstrumento),
                    //otrasOperaciones: Ext.encode(otrasOperaciones),
                    importeTotal: scope.tfAddImporteTotalMovGen.getValue(),
                    arrayEliminarInstrum: Ext.encode(scope.arrayEliminarInstrum),
                    arrayEliminarOtrasOper: Ext.encode(scope.arrayEliminarOtrasOper)
                },
                callback: function (options, success, response) {
                    Ext.MessageBox.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == 1) {
                        scope.idDocumento = responseData.idDocumento;
                        scope.btnAddRegistrarInstrumento.disable();
                        scope.fResetValuesIntrumento(true);
                        scope.arrayEliminarInstrum = new Array();
                        scope.arrayEliminarOtrasOper = new Array();
                        if (!aplicar) {
                            scope.wAdicionarMovGen.close();
                            scope.fireEvent('closeAdicionar', true);
                        } else {
                            // scope.fResetFields();
                        }
                        if (typeof fnCallBack === 'function') {
                            fnCallBack(responseData.idDocumento);
                        }
                        //scope.btnAddGuardar.setDisabled(true);
                        //scope.btnAddConfirmar.setDisabled(false);
                        mostrarMensaje(1, (scope.action == 1) ? scope.etiquetas.lbGuardadoSatisf : scope.etiquetas.lbModificadoSatisf);
                    }
                    if (responseData.codMg == -3) {
                        mostrarMensaje(1, scope.etiquetas.lbMsgNoExistenOper);
                        return;
                    }
                    if (responseData.codMg == -2) {
                        mostrarMensaje(1, scope.etiquetas.lbMsgNoExistenTalonario);
                        return;
                    }
                    if (responseData.codMg == -1) {
                        mostrarMensaje(1, scope.etiquetas.msgOcurrioUnError);
                        return;
                    }
                    if (responseData.codMg == -4) {
                        mostrarMensaje(1, scope.etiquetas.msgNoSaldo);
                        return;
                    }
                    if (responseData.codMg == -5) {//No puede pagar mas de 500
                        mostrarMensaje(1, scope.etiquetas.msgMaxImporte500);
                        return;
                    }
                    if (responseData.codMg == -6) {//Ya existe el numero de instrumento
                        mostrarMensaje(1, String.format(scope.etiquetas.msgExistNumInst, responseData.numero));
                        return;
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

        this.importeTotalOtrasOper = function () {
            var totalImporte = 0;
            for (var i = 0; i < scope.stAddGridOtrasOper.getCount(); i++) {
                if ((scope.stAddGridOtrasOper.getAt(i).data.importe != '' && scope.stAddGridOtrasOper.getAt(i).data.idcuenta != '') || (scope.cargaInicial && scope.stAddGridOtrasOper.getAt(i).data.idoperacion))
                    totalImporte += parseFloat(scope.stAddGridOtrasOper.getAt(i).data.importe);
            }
            scope.tfAddImporteTotalOtrasOper.setValue(parseFloat(totalImporte).toFixed(2));
        };

        this.importeTotalLiquidar = function () {
            var totalImporte = 0;
            // for (var i = 0; i < scope.stAddGridLiquidacionInst.getTotalCount(); i++) {
            //     if (scope.stAddGridLiquidacionInst.getAt(i).data.liquidarimp != "") {
            //         totalImporte += parseFloat(scope.stAddGridLiquidacionInst.getAt(i).data.liquidarimp);
            //     }
            // }
            // scope.tfAddImporteTotalLiquidar.setValue(parseFloat(totalImporte).toFixed(2));
            var records = scope.smGridLiquidacionInst.getSelections();
            records.forEach(function (item, i) {
                if (item.data.liquidarimp != "") {
                    totalImporte += parseFloat(item.data.liquidarimp);
                }
            });
            scope.tfAddImporteTotalLiquidar.setValue(parseFloat(totalImporte).toFixed(2));
        };

        this.importeTotalIntrumento = function () {
            var totalImporte = 0;
            for (var i = 0; i < scope.stAddGridInstrumentos.getCount(); i++) {
                totalImporte += parseFloat(scope.stAddGridInstrumentos.getAt(i).data.importeIntrumento);
            }
            scope.tfAddImporteTotalMovGen.setValue(parseFloat(totalImporte).toFixed(2));
        };

        this.fAddIntrumento = function () {
            var idInstrumento = null;
            var idDocumento = null;
            var refInstrumento = null;
            if (scope.smAddGridInstrumentos.getSelected()) {
                idInstrumento = this.smAddGridInstrumentos.getSelected().data.idInstrumento;
                idDocumento = this.smAddGridInstrumentos.getSelected().data.iddocumento;
                refInstrumento = this.smAddGridInstrumentos.getSelected().data.refInstrumento;
            } else {
                refInstrumento = scope.idFormaPago + scope.tfAddInstNumero.getValue();
                var index = scope.stAddGridInstrumentos.find('refInstrumento', refInstrumento);
                if (index >= 0) {
                    mostrarMensaje(1, String.format(scope.etiquetas.msgExistNumInst, scope.tfAddInstNumero.getValue()));
                    return;
                }
            }

            var data = new Array();
            var liquidaciones = new Array();
            var instrumento = {
                refInstrumento: refInstrumento,
                idInstrumento: idInstrumento,
                iddocumento: idDocumento,
                idFormaPago: scope.idFormaPago,// scope.cbAddInstFormaPago.getValue(),
                formaPago: scope.idFormaPago == 1 ? 'Efectivo' : 'Cheque',
                idBanco: scope.cbAddInstBanco.getValue(),
                numeroIntrumento: scope.tfAddInstNumero.getValue(),
                observacion: scope.tfAddInstComentario.getValue(),
                importeIntrumento: parseFloat(scope.tfAddImporteTotalLiquidar.getValue()) + parseFloat(scope.tfAddImporteTotalOtrasOper.getValue())
            };
            //Conformar Liquidaciones
            // if (scope.stAddGridLiquidacionInst.getCount())
            //     scope.stAddGridLiquidacionInst.commitChanges();

            var recordsLiq = scope.smGridLiquidacionInst.getSelections();
            var arrIdDuoSelected = [];
            recordsLiq.forEach(function (item, i) {
                arrIdDuoSelected.push(item.data.idderechouobligacion);
            });
            var record;

            for (var i = 0; i < scope.stAddGridLiquidacionInst.getCount(); i++) {
                record = scope.stAddGridLiquidacionInst.getAt(i);
                if ((arrIdDuoSelected.includes(record.data.idderechouobligacion)) || record.data.idmovimientocaja) {
                    if (!scope.haySaldoDuo(
                        refInstrumento, record.data.idderechouobligacion, record.data.importeOriginal,
                        record.data.importeliquidado, record.data.liquidarimp
                    )) {
                        mostrarMensaje(1, "El importe a liquidar sobrepasa lo que se puede liquidar.");
                        return;
                    }
                    var liquidacion = {
                        numeroduo: record.data.numeroduo,
                        nombrecuentaduo: record.data.nombrecuentaduo,
                        fechaemision: record.data.fechaemision,
                        importeOriginal: record.data.importeOriginal,
                        idderechouobligacion: record.data.idderechouobligacion,
                        liquidarimp: record.data.liquidarimp,
                        importeliquidado: record.data.importeliquidado,
                        idoperacioncontable: record.data.idoperacioncontable,
                        liquidado: (record.data.importeliquidado == record.data.importemo) ? 1 : 0,
                        idoperacioncp: record.data.idoperacioncp,
                        idliquidacion: record.data.idliquidacion,
                        idmovimientocaja: record.data.idmovimientocaja
                    };
                    if (record.data.idmovimientocaja && arrIdDuoSelected.includes(record.data.idderechouobligacion)) {
                        liquidacion.liquidarimp = record.data.liquidarimp;
                    } else if (record.data.idmovimientocaja) {
                        liquidacion.liquidarimp = 0;
                    }
                    liquidaciones.push(liquidacion);
                }
            }

            instrumento.liquidaciones = liquidaciones;
            //Conformar Otras Operacion
            // if (scope.stAddGridOtrasOper.getCount())
            //     scope.stAddGridOtrasOper.commitChanges();
            var otrasOperaciones = new Array();
            var storeCbOperacion = scope.cbOtrasOperaciones.store;
            for (var i = 0; i < scope.stAddGridOtrasOper.getCount(); i++) {
                if (storeCbOperacion) {
                    var index = storeCbOperacion.find('idoperacion', scope.stAddGridOtrasOper.getAt(i).data.idoperacion);
                    var dataOperacion = storeCbOperacion.getAt(index).data;
                }
                var operacion = {
                    idoperacion: scope.stAddGridOtrasOper.getAt(i).data.idoperacion,
                    importe: scope.stAddGridOtrasOper.getAt(i).data.importe,
                    idmovimientocaja: scope.stAddGridOtrasOper.getAt(i).data.idmovimientocaja,
                    idtipomovimientocaja: dataOperacion.idtipomovimientocaja,
                    observacion: scope.stAddGridOtrasOper.getAt(i).data.observacion,
                    //Si es un anticipos necesito el idanticipo para modificarlo
                    idanticipo: scope.stAddGridOtrasOper.getAt(i).data.idanticipo,
                    idcuenta: scope.stAddGridOtrasOper.getAt(i).data.idcuenta,
                    nomcuenta: scope.stAddGridOtrasOper.getAt(i).data.nomcuenta
                };
                otrasOperaciones.push(operacion);
            }
            instrumento.otrasOperaciones = otrasOperaciones;

            var indexIntrumento = scope.stAddGridInstrumentos.find('refInstrumento', refInstrumento);
            if (indexIntrumento == -1) {//Si no esta Adicionar en el Grid Intrumentos
                data.push(instrumento);
                scope.stAddGridInstrumentos.loadData({datos: data}, true);
            } else {
                var record = scope.stAddGridInstrumentos.getAt(indexIntrumento);
                if (scope.tfAddInstImporte.getValue() != '' && (parseFloat(scope.tfAddImporteTotalLiquidar.getValue()) + parseFloat(scope.tfAddImporteTotalOtrasOper.getValue())) > 0) {
                    if (!scope.smAddGridInstrumentos.getSelected()) {
                        if (!Ext.isEmpty(operacion)) {
                            record.data.otrasOperaciones.push(operacion);
                        }
                        if (!Ext.isEmpty(liquidacion)) {
                            record.data.liquidaciones.push(liquidacion);
                        }
                        record.data.importeIntrumento = parseFloat(record.data.importeIntrumento) + parseFloat(scope.tfAddImporteTotalLiquidar.getValue()) + parseFloat(scope.tfAddImporteTotalOtrasOper.getValue());
                        scope.gpAddGridInstrumentos.getView().refresh();
                    } else {
                        data.push(instrumento);
                        scope.stAddGridInstrumentos.remove(record);
                        scope.stAddGridInstrumentos.loadData({datos: data}, true);
                    }
                }
                scope.smAddGridInstrumentos.selectRow(indexIntrumento);
            }
        };

        this.fSetValuesIntrumento = function () {
            //Cargar datos generales del intrumento
            scope.cbAddInstBanco.setValue(scope.smAddGridInstrumentos.getSelected().data.idBanco);
            scope.tfAddInstNumero.setValue(scope.smAddGridInstrumentos.getSelected().data.numeroIntrumento);
            scope.tfAddInstClaveConformacion.setValue(this.smAddGridInstrumentos.getSelected().data.clave);
            scope.tfAddInstComentario.setValue(scope.smAddGridInstrumentos.getSelected().data.observacion);
            scope.tfAddInstImporte.setValue(parseFloat(scope.smAddGridInstrumentos.getSelected().data.importeIntrumento).toFixed(2));
            //---
            if (scope.idFormaPago == 1) {
                scope.tfAddInstNumero.disable();
                scope.cbAddInstBanco.disable();
                scope.tfAddInstNumero.reset();
                scope.cbAddInstBanco.reset();
            } else if (!scope.verInfo) {//Si no es Vista Info enable
                scope.cbAddInstBanco.enable();
                scope.tfAddInstNumero.enable();
                scope.tfAddInstImporte.enable();
            } else {//Mostrar Vista Info disable
                scope.cbAddInstBanco.disable();
                scope.tfAddInstNumero.disable();
                scope.tfAddInstImporte.disable();
            }
            //Cargar datos de la liquidaciones
            scope.stAddGridLiquidacionInst.removeAll();

            if (scope.dataLiquidar.datos)
                scope.stAddGridLiquidacionInst.loadData(scope.dataLiquidar);

            if (this.smAddGridInstrumentos.getSelected().data.liquidaciones.length) {
                for (var i = 0; i < scope.smAddGridInstrumentos.getSelected().data.liquidaciones.length; i++) {
                    var indexLiq = scope.stAddGridLiquidacionInst.find('idderechouobligacion', scope.smAddGridInstrumentos.getSelected().data.liquidaciones[i].idderechouobligacion);
                    if (indexLiq != -1) {
                        var record = scope.stAddGridLiquidacionInst.getAt(indexLiq);
                        scope.stAddGridLiquidacionInst.remove(record);
                    }
                }
                scope.stAddGridLiquidacionInst.loadData({datos: this.smAddGridInstrumentos.getSelected().data.liquidaciones}, true);
                this.smAddGridInstrumentos.getSelected().data.liquidaciones.forEach(function (item, i) {
                    var index = scope.stAddGridLiquidacionInst.find('idderechouobligacion', item.idderechouobligacion);
                    if (index != -1) {
                        scope.smGridLiquidacionInst.selectRow(index, true);
                    }
                });
                scope.gpAddGridLiquidacionInst.getView().refresh();
            }
            scope.stAddGridLiquidacionInst.sort('numeroduo', 'DESC');
            //Cargar datos de otras operaciones
            scope.stAddGridOtrasOper.removeAll();
            if (this.smAddGridInstrumentos.getSelected().data.otrasOperaciones.length) {
                scope.stAddGridOtrasOper.loadData({datos: this.smAddGridInstrumentos.getSelected().data.otrasOperaciones});
            }
        };

        this.fResetValuesIntrumento = function (allowBlank) {
            scope.cbAddInstBanco.allowBlank = allowBlank;
            scope.tfAddInstNumero.allowBlank = allowBlank;
            scope.tfAddInstImporte.allowBlank = allowBlank;
            //---------------------------
            scope.cbAddInstBanco.reset();
            scope.tfAddInstNumero.reset();
            scope.tfAddInstImporte.reset();
            scope.tfAddInstComentario.reset();
            scope.tfAddImporteTotalLiquidar.reset();
            scope.tfAddImporteTotalOtrasOper.reset();
            //Volver a cargar las liquidaciones originales
            if (scope.dataLiquidar.datos)
                scope.stAddGridLiquidacionInst.loadData(scope.dataLiquidar);
            else scope.stAddGridLiquidacionInst.removeAll();
            scope.stAddGridOtrasOper.removeAll();
            scope.gpAddGridInstrumentos.getSelectionModel().clearSelections();
            scope.gpAddGridLiquidacionInst.getSelectionModel().clearSelections();
            scope.gpAddGridLiquidacionInst.getView().refresh();
            scope.gpAddGridOtrasOper.getView().refresh();
        };

        this.eliminarInstrumento = function () {
            var selectRecord = scope.smAddGridInstrumentos.getSelected();
            if (selectRecord.data.iddocumento) {
                scope.arrayEliminarInstrum.push(selectRecord.data.iddocumento);
            }
            scope.stAddGridInstrumentos.remove(selectRecord);
            scope.btnAddRegistrarInstrumento.disable();
            scope.fResetValuesIntrumento(false);
            scope.importeTotalIntrumento();
        };

        this.limpiarCampos = function () {
            scope.cbAcreedorDeudor.reset();
            scope.cbAddTrabajadorCliente.reset();
            scope.tfAddNumeroMovGen.reset();
            scope.tfAddComentarioMovGen.reset();
            scope.dfAddFechaEmisionMovGen.reset();
            scope.stAddGridInstrumentos.removeAll();
            // scope.btnAddRegistrarInstrumento.disable();
            scope.btnAddOtrasOper.enable();
            scope.fResetValuesIntrumento(false);
            scope.importeTotalIntrumento();
        };

        this.desabilitarCamposForm = function (flag) {
            if (flag) {
                scope.panelContenedor.disable();
                scope.panelContenedor.el._mask.removeClass('ext-el-mask');
                scope.panelContenedor.el._mask.addClass('my-disable-mask');
            } else {
                scope.panelContenedor.enable();
            }
        };

        this.eliminarOperacion = function () {
            var selectRecord = scope.smAddGridOtrasOper.getSelected();
            if (selectRecord.data.idmovimientocaja) {
                scope.arrayEliminarOtrasOper.push({
                    'idmovimientocaja': selectRecord.data.idmovimientocaja,
                    'idanticipo': selectRecord.data.idanticipo
                });
            }
            scope.stAddGridOtrasOper.remove(selectRecord);
            scope.importeTotalOtrasOper();
            scope.fAddIntrumento();
        };

        this.cancelarInstrumento = function (idDocInst, numeroInst, idestadodoc, record/*idmotivo, fecha*/) {
            var params = {
                // idmotivo: idmotivo,
                // fecha: fecha,
                tipoContabilizacion: 2,
                descripcion: String.format(scope.etiquetas.lbDesCmpCancelInst, numeroInst, scope.scopeGestionarMov.smGestionarMov.getSelected().data.numero),
                idDocInst: idDocInst,
                record: record
            };
            if (idestadodoc == 6) {//6-Posteado
                params.contabilizado = 1;
                var windowCancelar = new Ext.UIGestionarMov.windowCancelar(scope, record.data.fechaRecepcion, params);
                windowCancelar.show();
                //scope.scopeGestionarMov.fLoadDataComprobante(params);
            } else {
                params.contabilizado = 0;
                scope.scopeGestionarMov.fGuardarCancelOtros(params)
            }
        };
        // refInstrumento - id del grid; importeLiquidado
        // importeLiquidado - importe que ya se a liquidado del total del duo;
        // importeALiquidar - importe que se quiere liquidar
        // importeTotal - saldo total del duo
        this.haySaldoDuo = function (refInstrumento, idDuo, importeTotal, importeLiquidado, importeALiquidar) {
            var indexIntrumento = scope.stAddGridInstrumentos.find('refInstrumento', refInstrumento);
            var allRecords = scope.stAddGridInstrumentos.getRange();
            var saldoLiquidado = 0;
            allRecords.forEach(function (item, i) {
                item.data.liquidaciones.forEach(function (liq, i) {
                    if (liq.idderechouobligacion == idDuo) {
                        saldoLiquidado += liq.liquidarimp;
                    }
                });
            });
            if (indexIntrumento !== -1) {
                var record = scope.stAddGridInstrumentos.getAt(indexIntrumento);
                var importeARestar = 0;
                record.data.liquidaciones.forEach(function (item, i) {
                    if (item.idderechouobligacion == idDuo) {
                        importeARestar += item.liquidarimp;
                    }
                });
                if (parseFloat(saldoLiquidado + importeALiquidar - importeARestar).toFixed(2) * 1 > importeTotal) {
                    return false;
                } else {
                    return true;
                }
                return true;
            } else {
                if ((/*importeLiquidado + */saldoLiquidado + importeALiquidar) > importeTotal) {
                    return false;
                } else {
                    return true;
                }
            }
        };

        this.createFormSteps = function (tipoAccion) {
            this.formSteps = new Ext.FormSteps(scope.fpAddMovGen, scope.wAdicionarMovGen.buttons);
            this.formSteps.on({
                scope: this,
                Nuevo: function (fnNuevo) {
                    this.desabilitarCamposForm(false);
                    this.limpiarCampos();
                    fnNuevo.call();
                },
                Crear: function (fnCrear, cerrarVentana) {
                    var fn = function (id) {
                        this.desabilitarCamposForm(true);
                        fnCrear.call(undefined, id);
                    }.bind(this);

                    if (!scope.gpAddGridInstrumentos.getSelectionModel().hasSelection() && (cleanComa(scope.tfAddImporteTotalLiquidar.getValue()) > 0 || scope.tfAddImporteTotalOtrasOper.getValue() > 0)) {
                        scope.btnAddRegistrarInstrumento.fireEvent('click');
                    }
                    if (scope.tfAddComentarioMovGen.getValue() == "")
                        scope.tfAddComentarioMovGen.markInvalid(scope.etiquetas.lbBlankText);
                    else if (scope.tfAddImporteTotalMovGen.getValue() > 0) {
                        scope.fGuardarDatosMovGen(!cerrarVentana, fn);
                    } else {
                        mostrarMensaje(1, scope.etiquetas.lbInvalidImporte);
                    }

                },
                Confirmar: function (fnConfirmar, id) {
                    scope.scopeGestionarMov.fShowConfirmarMov(id, fnConfirmar);
                },
                Postear: function (fnPostear, id) {
                    var fn = fnPostear;
                    if (tipoAccion == 'mod') {
                        fn = fnPostear.createSequence(function () {
                            scope.wAdicionarMovGen.close();
                            scope.fireEvent('closeAdicionar', true);
                        }, this);
                    }

                    scope.scopeGestionarMov.fShowContabilizarMov(id, fn);

                },
            });
        };

        this.gridInstrumentosAfterEdit = function () {
            var recordscheck = [];
            var records = scope.gpAddGridInstrumentos.getStore().getRange();
            //si esta desordenado puede causar que falle lo que intento hacer mas abajo en el otro comentario
            records.sort(function (a, b) {
                return a.data.idInstrumento - b.data.idInstrumento;
            });
            records.forEach(function (item, i) {
                //esto es pa poder saber si han sido modificados
                recordscheck.push(
                    '' + item.get('idInstrumento') + '@' + Ext.encode(item.get('liquidaciones'))
                    + '@' + Ext.encode(item.get('otrasOperaciones'))
                );
            });
            scope.checkGpInstrumentos.setValue(recordscheck.toString());
        };

    },
    initializeKeyMap: function (scope) {
        var keyMapAdd = new Ext.KeyMap(document, [
            {
                key: Ext.EventObject.ESC,//ESCAPE Cerrar ventana
                alt: false,
                fn: function () {
                    scope.wAdicionarMovGen.close();
                    scope.fireEvent('closeAdicionar', true);
                    keyMapAdd.disable();
                }
            }
        ]);
    }
});
