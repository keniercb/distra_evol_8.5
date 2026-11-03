Ext.namespace('Ext.ClassTraspasoAvanzadoDuo');
Ext.ClassTraspasoAvanzadoDuo = Ext.extend(Ext.Component, {
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
    cm: undefined,
    constructor: function(etiquetas, params)
    {
        this.etiquetas = etiquetas;
        this.tipoDuo = params.tipoDuo;
        this.url = params.url;
        this.cuentas = params.cuentas;
        this.idcuentas = params.idcuentas;
        this.numerosDoc = params.numerosDoc;
//        this.arrayIdDuo = params.arrayIdDuo;
        this.arrayDuo = params.arrayDuoTraspaso;
        this.fechaContable = params.fechaContable;
        scope = this;

        this.stLeftGrid = new Ext.data.GroupingStore({
            groupField: 'estructuracomun',
            reader: new Ext.data.JsonReader({
                id: 'reader',
                root: 'datos'
            }, [{
                    name: 'idderechouobligacion'
                }, {
                    name: 'numero'
                }, {
                    name: 'idestructuracomun'
                }, {
                    name: 'estructuracomun'
                }, {
                    name: 'idestadodocumento'
                }, {
                    name: 'id'
                }, {
                    name: 'importemb',
                    type: 'float'
                }, {
                    name: 'idcuenta'
                }, {
                    name: 'concatcta'
                }, {
                    name: 'text'
                }, {
                    name: 'idcliente'
                }, {
                    name: 'nombrecliente'
                }, {
                    name: 'abreviatura'
                }, {
                    name: 'text'
                }
            ]),
            sortInfo: {field: 'numero', direction: "ASC"}
        });

        this.stRightGrid = new Ext.data.GroupingStore({
            groupField: 'estructuracomun',
            reader: new Ext.data.JsonReader({
                id: 'reader',
                root: 'datos'
            }, [{
                    name: 'idderechouobligacion'
                }, {
                    name: 'numero'
                }, {
                    name: 'idestructuracomun'
                }, {
                    name: 'estructuracomun'
                }, {
                    name: 'idestadodocumento'
                }, {
                    name: 'id'
                }, {
                    name: 'importemb',
                    type: 'float'
                }, {
                    name: 'idcuenta'
                }, {
                    name: 'concatcta'
                }, {
                    name: 'text'
                }, {
                    name: 'idcliente'
                }, {
                    name: 'nombrecliente'
                }, {
                    name: 'abreviatura'
                }, {
                    name: 'text'
                }
            ]),
            sortInfo: {field: 'numero', direction: "ASC"}
        });

        this.stTraspCliente = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                id: 'reader'
            }, [{
                    name: 'idcliente'
                }, {
                    name: 'nombrecliente'
                }, {
                    name: 'abreviatura'
                }
            ])
        });

        this.wTraspDuo = new Ext.UITraspasoAvanzadoDuo(this);
        this.initializeEvents(this);
        this.initHotKeys(this);
        this.initializeFunctions(this);
        scope.loadDataComponent();

        return Ext.ClassTraspasoAvanzadoDuo.superclass.constructor.call(this);
    },
    loadDataComponent: function()
    {
        Ext.Ajax.request({
            url: scope.url + 'loadDataTraspaso',
            method: 'POST',
            params: {
                tipoduo: this.tipoDuo
            },
            callback: function(options, success, response)
            {
                responseData = Ext.decode(response.responseText);
                scope.fShowWindow(responseData, scope);
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
    initHotKeys: function(scope) {
        //teclas calientes	
        scope.hotKeys = new Ext.KeyMap(Ext.getDoc(), [{
                // ACEPTAR
                key: Ext.EventObject.ENTER,
                fn: function() {
                    if (!scope.btnTraspAceptar.disabled) {
                        scope.btnTraspAceptar.handler.call();
                    }
                }
            }, {
                // CERRAR
                key: Ext.EventObject.ESC,
                fn: function() {
                    scope.btnTraspAvanzadoCerrar.handler.call();
                }
            }, {
                // SELECCIONAR
                key: Ext.EventObject.NUM_PLUS,
                fn: function() {
                    if (!scope.btnAgregarTodos.disabled) {
                        scope.btnAgregarTodos.handler.call();
                    }
                }
            }, {
                // DESELECCIONAR
                key: Ext.EventObject.NUM_MINUS,
                fn: function() {
                    if (!scope.btnRemoveTodos.disabled) {
                        scope.btnRemoveTodos.handler.call();
                    }
                }
            }
        ]);
    },
    initializeEvents: function(scope)
    {
        this.addEvents('closeTraspasoAvanzado');
        this.addEvents('contabilizar');
//         this.addEvents('contabilizado');
//         this.addEvents('aceptarTraspaso');

        scope.smLeftGrid.on({
            rowselect: function(sm, rowIndex, record) {
                scope.btnAgregarTodos.setText(scope.etiquetas.lbAdd);
                
                /* PARA DD */
                var selections = sm.getSelections();
                var array = [];
                for (var i = 0; i < selections.length; i++) {
                    array.push('<b>Documento:</b> <i>' + selections[i].json.numero + '</i>, <b>Cuenta:</b> <i>' + selections[i].json.text + '</i>, <b>Importe:</b> <i>' + selections[i].json.importemb.toFixed(2) + '</i>');
                }
                var text = "<p style='border-bottom: 1px solid #EDEDED; border-bottom-left-radius: 5%;border-bottom-right-radius: 5%;border-top: 1px solid #EDEDED; border-top-left-radius: 5%;border-top-right-radius: 5%;'>" + array.join("<br>") + "</p>";
                scope.leftGrid.ddText = text;
            },
            rowdeselect: function(sm, rowIndex, record) {
                if (sm.hasSelection()) {
                    scope.btnAgregarTodos.setText(scope.etiquetas.lbAdd);
                } else {
                    scope.btnAgregarTodos.setText(scope.etiquetas.lbAddAll);
                }
            }
        });
        scope.smRightGrid.on({
            rowselect: function(sm, rowIndex, record) {
                scope.btnRemoveTodos.setText(scope.etiquetas.lbRemove);
                
                /* PARA DD */
                var selections = sm.getSelections();
                var array = [];
                for (var i = 0; i < selections.length; i++) {
                    array.push('<b>Documento:</b> <i>' + selections[i].json.numero + '</i>, <b>Cuenta:</b> <i>' + selections[i].json.text + '</i>, <b>Importe:</b> <i>' + selections[i].json.importemb.toFixed(2) + '</i>');
                }
                var text = "<p style='border-bottom: 1px solid #EDEDED; border-bottom-left-radius: 5%;border-bottom-right-radius: 5%;border-top: 1px solid #EDEDED; border-top-left-radius: 5%;border-top-right-radius: 5%;'>" + array.join("<br>") + "</p>";
                scope.rightGrid.ddText = text;
            },
            rowdeselect: function(sm, rowIndex, record) {
                if (sm.hasSelection()) {
                    scope.btnRemoveTodos.setText(scope.etiquetas.lbRemove);
                } else {
                    scope.btnRemoveTodos.setText(scope.etiquetas.lbRemoveAll);
                }
            }
        });
        scope.stLeftGrid.on({
            load: function(store, records, options) {
                scope.lbdisponibles.el.textContent = scope.etiquetas.lbCantDisponibles.replace('<#>', store.getCount());
                scope.tfSearchLeftGrid.setDisabled(records.length === 0);

                /* PARA EL DD */
                scope.rightGridDropTargetEl = scope.rightGrid.getView().el.dom.childNodes[0].childNodes[1];
                scope.rightGridDropTarget = new Ext.dd.DropTarget(scope.rightGridDropTargetEl, {
                    ddGroup: 'leftGridDDGroup',
                    copy: true,
                    notifyDrop: function(ddSource, e, data) {
                        function addRow(record, index, allItems) {
                            var foundItem = scope.stRightGrid.find('idderechouobligacion', record.json.idderechouobligacion);

                            if (foundItem == -1) {
                                ddSource.grid.store.remove(record);
                                ddSource.grid.getView().refresh(true);

                                scope.stRightGrid.addSorted(record);
                            }
                        }
                        Ext.each(ddSource.dragData.selections, addRow);
                        return(true);
                    }
                });

                scope.leftGridDropTargetEL = scope.leftGrid.getView().el.dom.childNodes[0].childNodes[1];
                scope.leftGridDropTarget = new Ext.dd.DropTarget(scope.leftGridDropTargetEL, {
                    ddGroup: 'rightGridDDGroup',
                    copy: true,
                    notifyDrop: function(ddSource, e, data) {

                        function addRow(record, index, allItems) {
                            var foundItem = scope.stLeftGrid.find('idderechouobligacion', record.json.idderechouobligacion);
                            if (foundItem == -1) {
                                ddSource.grid.store.remove(record);
                                ddSource.grid.getView().refresh(true);

                                scope.stLeftGrid.addSorted(record);
                            }
                        }
                        Ext.each(ddSource.dragData.selections, addRow);
                        return(true);
                    }
                });
                /* FIN PARA EL DD */
            },
            add: function(store, records, index) {
                scope.lbdisponibles.el.textContent = scope.etiquetas.lbCantDisponibles.replace('<#>', store.getCount());
                scope.tfSearchLeftGrid.setDisabled(store.getCount() === 0);
                scope.btnRemoveTodos.setText(scope.etiquetas.lbRemoveAll);
                //scope.leftGrid.getView().refresh(true);
            },
            remove: function(store, record, index) {
                scope.lbdisponibles.el.textContent = scope.etiquetas.lbCantDisponibles.replace('<#>', store.getCount());
                scope.tfSearchLeftGrid.setDisabled(store.getCount() === 0);
                //scope.leftGrid.getView().refresh(true);
            }
        });

        scope.stRightGrid.on({
            add: function(store, records, index) {
                scope.lbseleccionados.el.textContent = scope.etiquetas.lbCantSeleccionados.replace('<#>', store.getCount());
                scope.tfSearchRightGrid.setDisabled(store.getCount() === 0);
                scope.btnAgregarTodos.setText(scope.etiquetas.lbAddAll);
                //scope.leftGrid.getView().refresh(true);

                scope.btnTraspAceptar.setDisabled(!(scope.cbTraspEntidadO.isValid() && scope.cbTraspEntidadD.isValid())); // activar el aceptar SSi es un origen y destino valido
            },
            remove: function(store, record, index) {
                scope.lbseleccionados.el.textContent = scope.etiquetas.lbCantSeleccionados.replace('<#>', store.getCount());
                scope.tfSearchRightGrid.setDisabled(store.getCount() === 0);
                scope.btnTraspAceptar.setDisabled(store.getCount() === 0);
                //scope.rightGrid.getView().refresh(true);
            }
        });

        this.btnTraspAceptar.on('enable', function() {
            this.focus();
        })

        this.tfSearchLeftGrid.on({
            keyup: function(field, event) {
                var pattern = this.getValue().toLowerCase();
                scope.stLeftGrid.filterBy(function(record, id) {
                    return (record.json.numero.toString().toLowerCase().indexOf(pattern) !== -1
                            || record.json.text.toString().toLowerCase().indexOf(pattern) !== -1 || record.json.importemb.toString().toLowerCase().indexOf(pattern) !== -1);
                });
                scope.lbdisponibles.el.textContent = scope.etiquetas.lbCantDisponibles.replace('<#>', scope.stLeftGrid.getCount());
            }
        });
        this.tfSearchRightGrid.on({
            keyup: function(field, event) {
                var pattern = this.getValue().toLowerCase();
                scope.stRightGrid.filterBy(function(record, id) {
                    return (record.json.numero.toString().toLowerCase().indexOf(pattern) !== -1
                            || record.json.text.toString().toLowerCase().indexOf(pattern) !== -1 || record.json.importemb.toString().toLowerCase().indexOf(pattern) !== -1);
                });
                scope.lbseleccionados.el.textContent = scope.etiquetas.lbCantSeleccionados.replace('<#>', scope.stRightGrid.getCount());
            }
        });

        Ext.getCmp('gpEntidadO').getSelectionModel().on({
            'selectionchange': function() {
                scope.cbTraspEntidadD.validate();
                scope.btnBuscar.setDisabled(!(!Ext.isEmpty(scope.cbTraspEntidadO.getValue()) && scope.cbTraspCliente.isValid()));
                scope.btnTraspAceptar.setDisabled(!(scope.cbTraspEntidadO.isValid() && scope.cbTraspEntidadD.isValid() && scope.stRightGrid.getCount() > 0));
            }
        });

        Ext.getCmp('gpEntidadD').getSelectionModel().on({
            'selectionchange': function() {
                scope.cbTraspEntidadO.validate();
                scope.btnTraspAceptar.setDisabled(!(scope.cbTraspEntidadO.isValid() && scope.cbTraspEntidadD.isValid() && scope.stRightGrid.getCount() > 0));
            }
        });

        scope.cbTraspCliente.on({
            select: function(field, record, index) {
                scope.btnBuscar.setDisabled(!(!Ext.isEmpty(scope.cbTraspEntidadO.getValue()) && scope.cbTraspCliente.isValid()));
            }
        });

        this.btnTraspAvanzadoCerrar.setHandler(function(component) {
            scope.loadMessageBox(scope.mascPrincipal);
            scope.wTraspDuo.close();
            scope.fireEvent('closeTraspasoAvanzado', true);
        });

        this.btnTraspAceptar.setHandler(function(component) {
            scope.showWindowTrasp();
//            scope.fShowWindowAceptarTrasp();
        }, scope);

        this.btnBuscar.on('click', function(component)
        {
            scope.reset();
            scope.fLoadDataDuoTrasp();
        });

        this.btnAgregarTodos.setHandler(function(component) {
            scope.fAddDuoTrasp();
        });

        this.btnRemoveTodos.setHandler(function(component) {
            scope.fDelDuoTrasp();
        });
    },
    initializeFunctions: function(scope)
    {
        this.reset = function(fullReset) {
            if (fullReset) {
                scope.stRightGrid.removeAll();
            }
            scope.stLeftGrid.removeAll();
        };
        this.createActionColumn = function(value, metadata, record, rowIndex, colIndex, store) {
            return "<img class ='addRec' src='" + perfil.dirImg + 'adicionar.png' + "' alt='Agregar' onclick='scope.fAddDuoTrasp(" + record.data.idderechouobligacion + ")'/>";
        };

        this.createDelActionColumn = function(value, metadata, record, rowIndex, colIndex, store) {
            return "<img class ='addRec' src='" + perfil.dirImg + 'eliminar.png' + "' alt='Agregar' onclick='scope.fDelDuoTrasp(" + record.data.idderechouobligacion + ")'/>";
        };

        this.fAddDuoTrasp = function(idDuo) {
            if (idDuo) {
                indexActual = scope.stLeftGrid.find('idderechouobligacion', idDuo);
                var newRecord = scope.stLeftGrid.getAt(indexActual);
                scope.stLeftGrid.remove(newRecord);
                scope.leftGrid.getView().refresh(true);

                var foundItem = scope.stRightGrid.find('idderechouobligacion', newRecord.json.idderechouobligacion);
                /* Ya existe el record? */
                if (foundItem === -1) {
                    scope.stRightGrid.addSorted(newRecord);
                }
            } else {
                var array = scope.smLeftGrid.hasSelection() ? scope.smLeftGrid.getSelections() : scope.stLeftGrid.getRange(0, scope.stLeftGrid.getCount() - 1);
                var diffArray = [];
                for (var i = 0; i < array.length; i++) {
                    scope.stLeftGrid.remove(array[i]);
                    scope.leftGrid.getView().refresh(true);

                    var foundItem = scope.stRightGrid.find('idderechouobligacion', array[i].json.idderechouobligacion);
                    if (foundItem === -1) {
                        diffArray.push(array[i]);
                    }
                    //scope.stRightGrid.addSorted(array[i]); /* Esto aqui se desecha porque cuando son mucho elementos se ralentiza  */
                }
                /* con esto se adicionan varios record mas rapido pero hay que forzar al gris a que reagrupe */
                scope.stRightGrid.add(diffArray);
                //scope.stRightGrid.groupBy('estructuracomun', true);
                scope.rightGrid.getView().refresh(true);
            }
            if (scope.smLeftGrid.hasSelection()) {
                scope.btnAgregarTodos.setText(scope.etiquetas.lbAdd);
            } else {
                scope.btnAgregarTodos.setText(scope.etiquetas.lbAddAll);
            }
        };

        this.fDelDuoTrasp = function(idDuo) {
            var allowsEst = Ext.getCmp('cbxEntidadO').fSelect.values;
            if (idDuo) {
                indexActual = scope.stRightGrid.find('idderechouobligacion', idDuo);
                var newRecord = scope.stRightGrid.getAt(indexActual);
                scope.stRightGrid.remove(newRecord);
                scope.rightGrid.getView().refresh(true);

                var foundItem = scope.stLeftGrid.find('idderechouobligacion', newRecord.json.idderechouobligacion);
                /* Ya existe el record y la factura pertenece a una de las estructuras seleccionadas? */
                if (foundItem === -1 && allowsEst.indexOf(newRecord.json.idestructuracomun) !== -1) {
                    scope.stLeftGrid.addSorted(newRecord);
                }
            } else {
                var array = scope.smRightGrid.hasSelection() ? scope.smRightGrid.getSelections() : scope.stRightGrid.getRange(0, scope.stRightGrid.getCount() - 1);
                var diffArray = [];
                for (var i = 0; i < array.length; i++) {
                    scope.stRightGrid.remove(array[i]);
                    scope.rightGrid.getView().refresh(true);
                    var foundItem = scope.stLeftGrid.find('idderechouobligacion', array[i].json.idderechouobligacion);
                    if (foundItem === -1 && allowsEst.indexOf(array[i].json.idestructuracomun) !== -1) {
                        diffArray.push(array[i]);
                    }
                    //scope.stLeftGrid.addSorted(array[i]); /* Esto aqui se desecha porque cuando son mucho elementos se ralentiza  */
                }
                /* con esto se adicionan varios record mas rapido pero hay que forzar al gris a que reagrupe */
                scope.stLeftGrid.add(diffArray);
                //scope.stLeftGrid.groupBy('estructuracomun', true);
                scope.leftGrid.getView().refresh(true);
            }
            if (scope.smRightGrid.hasSelection()) {
                scope.btnRemoveTodos.setText(scope.etiquetas.lbRemove);
            } else {
                scope.btnRemoveTodos.setText(scope.etiquetas.lbRemoveAll);
            }
        };

        this.fLoadDataDuoTrasp = function(parametros) {
            scope.loadMessageBox(scope.mascPrincipal);
            Ext.Ajax.request({
                method: "POST",
                url: scope.url + 'loadDataDuoTrasp',
                params: {
                    tipoduo: scope.tipoDuo,
                    limit: 10000,
                    arrayidestructura: Ext.encode(Ext.getCmp('cbxEntidadO').fSelect.values),
                    idcliente: scope.cbTraspCliente.getValue(),
                    idEstadoDocumento: 4
                },
                callback: function(options, success, response) {
                    Ext.MessageBox.hide();
                    responseData = Ext.decode(response.responseText);
                    scope.stLeftGrid.loadData(responseData);
                }
            });
        };

        this.fShowWindow = function(data, scope)
        {
            scope.wTraspDuo.show(Ext.getBody(), function()
            {
                scope.wTraspDuo.maximize(true);
                scope.wTraspDuo.doLayout(true);
                if (data.dataClientes)
                    scope.stTraspCliente.loadData(data.dataClientes);
                Ext.getCmp('gpEntidadO').getStore().loadData(data.entidadOrigen);
                Ext.getCmp('gpEntidadD').getStore().loadData(data.entidadDestino);
                scope.idEstructuraActual = data.Actual;
                if (Ext.MessageBox)
                    Ext.MessageBox.hide();
            });
        };

        this.fShowWindowAceptarTrasp = function(idmodelo, idoperacion)
        {
            var arrayIdDuo = new Array();
            var arrayIdCuentas = new Array();
            //seleccionar todos los idderechouobligacion que se van a traspasar
            for (var i = 0; i < scope.stRightGrid.getCount(); i++) {
                arrayIdDuo.push(scope.stRightGrid.data.items[i].data.idderechouobligacion);
                arrayIdCuentas.push(scope.stRightGrid.data.items[i].data.idcuenta);
            }
            scope.loadMessageBox(scope.mascPrincipal);
            scope.btnTraspAceptar.disable();
            scope.reset(true);
            idEstructuraDestino = Ext.getCmp('cbxEntidadD').fSelect.values[0];
            arrayIdEstructuraOrigen = Ext.getCmp('cbxEntidadO').fSelect.values;
            tipoContabilizacion = (idEstructuraDestino == scope.idEstructuraActual) ? 1 : 2;

            Ext.Ajax.request({
                method: "POST",
                url: scope.url + "loadDataComprobanteTraspaso",
                params: {
                    //pasarle los otros parametros necesarios para buscar lso datos del comprobante
                    tipoDuo: scope.tipoDuo,
                    arrayIdDuo: Ext.encode(arrayIdDuo),
                    arrayIdCuenta: Ext.encode(arrayIdCuentas),
                    idEstructuraDestino: idEstructuraDestino,
//                    arrayIdEstructuraOrigen: Ext.encode(arrayIdEstructuraOrigen),
                    tipoContabilizacion: tipoContabilizacion,
                    idmodelo: idmodelo,
                    idoperacion: idoperacion,
                    idcliente: scope.cbTraspCliente.getValue()
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    // si existe la cuenta en el otro CC 
                    if (responseData.dataComprobante) { //0 = no existe la cuenta, 1 = existe la cuenta
                        //aki hacer fireEvent a fShowComprobante() que va a estar en ClassGestionarDuo
                        parametros = {
                            url: "addTraspasoAvanzadoDuo",
                            tipoDuo: scope.tipoDuo,
                            arrayIdDuo: arrayIdDuo,
                            arrayIdCuenta: arrayIdCuentas,
                            idEstructuraActual: scope.idEstructuraActual,
                            idEstructuraDestino: idEstructuraDestino,
                            arrayIdEstructuraOrigen: arrayIdEstructuraOrigen,
                            fechaTraspaso: scope.fechaContable,
                            tipoContabilizacion: tipoContabilizacion
                        };
//                        tipoContabilizacion = 2;
                        actionContabiliza = 'traspasoavanzado';
                        //scope.wTraspDuo.close();
                        scope.fireEvent('contabilizar', {actionContabiliza: actionContabiliza, dataComprobante: responseData.dataComprobante, idObjeto: responseData.idObjeto, detalle: responseData.detalle, observacion: responseData.observacion, tipoContabilizacion: tipoContabilizacion, parametros: parametros});
                    } else {
                        Ext.MessageBox.hide();
                        mostrarMensaje(1, ((arrayIdCuentas.length > 1) ? scope.etiquetas.lbNoExistenCtasEnEntidad : scope.etiquetas.lbNoExisteCtaEnEntidad) + '</br>' + scope.etiquetas.lbSelOtraEntidad);
                        scope.btnTraspAvanzadoCerrar.focus();
                    }
                }
            });
        };
        //
        this.showWindowTrasp = function() {
            scope.btnCerrarOperacionTraspaso = new Ext.Button({
                id: 'cerrarOperacionTraspaso',
                text: scope.etiquetas.lbBtnCerrar, //'Cerrar',
                tooltip: scope.etiquetas.tooltipCloseAdd, //'Cerrar',
//                icon: perfil.dirImg + 'cerrar.png',
                iconCls: 'cerrar',
                scope: this
            });

            scope.btnAdicionarOperacionTraspaso = new Ext.Button({
                id: 'adicionarOperacionTraspaso',
                text: scope.etiquetas.lbBtnAceptar, //'Nuevo',
                tooltip: scope.etiquetas.lbBtnAceptar, //'Nuevo',
//                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                scope: this
            });
            scope.btnAdicionarOperacionTraspaso.on('click', function(){
                scope.fShowWindowAceptarTrasp(idmodelo, idoperacion);
            });
            
            this.stAddOperacion = new Ext.data.Store({//PASARLE EL BEFORELOAD DEL ORIGINAL
                url: this.url + 'loadDataOperacion',
                autoLoad: true,
                sortInfo: {
                    field: 'denominacion',
                    direction: "ASC"
                },
                reader: new Ext.data.JsonReader({
                    id: 'idoperaciones'
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
            
            scope.cbOperacionTraspaso = new Ext.form.ComboBox({
                id: 'cbOperacionTraspaso',
                fieldLabel: 'Operacion',
                anchor: '100%',
                store: scope.stAddOperacion,
                name: 'idnomoperaciones',
                valueField: 'idnomoperaciones',
                hiddenName: 'idnomoperaciones',
                displayField: 'denominacion',
                emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
                disabledClass: 'disabled-component',
                editable: true,
                forceSelection: true,
                allowBlank: false,
                resizable: true,
                //typeAhead : true,
                triggerAction: 'all',
                mode: 'local',
                maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
                selectOnFocus: true,
                enableKeyEvents: true
            });
            scope.cbOperacionTraspaso.on('select', function(combo, record, index){
                idmodelo = record.data.idmodelo;
                idoperacion = record.data.idnomoperaciones;
            });

            scope.windowOperacionTraspaso = new Ext.Window({
                id: 'windowOperacionTraspaso',
                layout: 'fit',
                width: 340,
                title: 'Operaciones',
                height: 110,
                resizable: false,
//                defaultButton: 'btncanc',
                bodyStyle: 'padding:7px 7px 7px',
                closeAction: 'close',
                modal: true,
                border: true,
                frame: true,
                items: [scope.cbOperacionTraspaso],
                buttons: [scope.btnCerrarOperacionTraspaso, scope.btnAdicionarOperacionTraspaso]
            });
            scope.windowOperacionTraspaso.show();
        };
    }
});
