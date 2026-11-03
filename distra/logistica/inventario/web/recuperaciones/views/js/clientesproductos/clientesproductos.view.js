Ext.ns('Ext.erp.clientesproductos');
Ext.erp.clientesproductos = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    listaBotonesDeposito: undefined,
    idioma: undefined,


    constructor: function (config) {
        var _this = this;

        this.frame = true;
        this.idioma = log.inv.clientesproductos.Idioma;
        this.dirController = '/logistica/inventario/recuperaciones/index.php/clientesproductos/';
        /*------------Barra con botones---------------*/
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesDeposito = new LOG.util.List();
        this.addToolbarButtonPanel(LOG.util.UIManager.createBtn({ //boton Mostrar reportes
            text: _this.idioma.btnMostrar,
            tooltip: _this.idioma.ttBtnMostrar,
            iconCls:'mostrar',
            sufijo:'Listado',
            title:'',
            handler: _this.showReport.createDelegate(this,[{sufijo:'Listado',title:''}]),
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('RB')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButtonPanel(LOG.util.UIManager.createBtn({ //boton Resumen
            text: _this.idioma.btnResumen,
            tooltip: _this.idioma.ttBtnResumen,
            iconCls:'modificar',
            sufijo:'Resumen',
            title:'Resumen de',
            handler: _this.showReport.createDelegate(this,[{sufijo:'Resumen',title:'Resumen de'}])
        }));
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonLimpiar({
                text: _this.idioma.btnLimpiar,
                tooltip: _this.idioma.ttBtnLimpiar,
                handler: function () {
                    _this.botonLimpiar();
                }
        }));
        this.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'l',
                    fn: function () {
                        _this.botonLimpiar();
                    }
                },
                {
                    alt: true,
                    ctrl:true,
                    key: 'm',
                    fn: function () {
                        _this.showReport({sufijo:'Listado',title:''});
                    }
                }
            ]);

        this.addToolbarButtonPanel('->');
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({id:'idClientesproductos'}));
        this.addToolbarButtonDeposito('->');
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbDepositos
        }));
        /*this.comboDepositos = new LOG.util.ComboBox({ //---combobox Depositos
            valueField: 'iddeposito',
            displayField: 'deposito',
            hiddenName: 'deposito',
            editable: false,
            url: _this.dirController + 'cargardepositos'
        });*/
        this.comboDepositos = new LOG.util.LovCombo({
            mode:'local',
            url: _this.dirController + 'cargardepositos',
            displayField:'deposito',
            valueField:'iddeposito',
            autoLoad: true
        });
        this.addToolbarButtonDeposito(this.comboDepositos);

        /*------------Fieldset Rango Fecha---------------*/

        this.dfDesdeCP = new Ext.form.DateField({ //---datefield Desde
            fieldLabel: _this.idioma.dfDesde,
            name: 'desdecp',
            vtype: 'daterange',
            id: 'desdecp',
            endDateField: 'hastacp',
            editable: false
        });
        this.dfHastaCP = new Ext.form.DateField({ //---datefield Hasta
            fieldLabel: _this.idioma.dfHasta,
            name: 'hastacp',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastacp',
            startDateField: 'desdecp',
            editable: false
        });
        this.dfDesdeCP.endDateField = this.dfHastaCP.id; //-------validacion de fecha
        this.dfHastaCP.startDateField = this.dfDesdeCP.id;

        this.clsFecha = LOG.util.UIManager.initColumnForm({ //columnForm de la fecha
            columnas: 2
        });
        this.clsFecha.addComponent(this.dfDesdeCP);
        this.clsFecha.addComponent(this.dfHastaCP);
        this.fsRangoFecha = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsRangoFecha,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            items: [this.clsFecha]
        });

        /*---------------Fieldset con grid Selecionar Cliente-------------*/


        var listaCliente = new LOG.util.List();
        var checkCliente = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        listaCliente.add(checkCliente);
        listaCliente.add({
            header: _this.idioma.gcCliente,
            width: 250,
            dataIndex: 'nombre',
            default: true
        });

        var clsCliente = LOG.util.UIManager.proccessColumns(listaCliente);
        var cmCliente = new Ext.grid.ColumnModel(clsCliente.columns);
        var smCliente = checkCliente;
        _this.stCliente = new Ext.data.Store({
            idItem: 'self',
            reader: new Ext.data.JsonReader({
                id: 'id',
                totalProperty: 'cantidad',
                root: 'datos',
                fields: [
                    {
                        name: 'nombre'
                    },
                    {
                        name: 'idclientesproveedores'
                    }
                ]
            })
        });
        smCliente.on({
            'rowselect': function () {
                if (smCliente.getSelections().length >= 1) {
                    _this.btnElimCliente.enable();
                } else {
                    _this.btnElimCliente.disable();
                }
            },
            'rowdeselect': function () {
                if (smCliente.getSelections().length >= 1) {
                    _this.btnElimCliente.enable();
                } else {
                    _this.btnElimCliente.disable();
                }
            }
        });

        this.btnSelecCliente = LOG.util.Prototipos.botonAdicionar({
            text: _this.idioma.botonAdicionar,
            tooltip: _this.idioma.ttBtnAddCliente,
            disabled: true,
            handler: function () {
                var ventanaClientes = new Ext.erp.ventanaClientes({
                    urlBusquedaGridPrincipal: 'cargarClientes'
                });
                ventanaClientes.init();
                ventanaClientes.getVistaPrincipal().title = _this.idioma.tlVentanaClientes;
                ventanaClientes.view();
                ventanaClientes.getGridPrincipal().store.load();
                var botonAceptar = ventanaClientes.getVistaPrincipal().listaBotones.getItem(2);
                ventanaClientes.getGridPrincipal().getSelectionModel().on({
                    'rowselect': function () {
                        if (ventanaClientes.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    },
                    'rowdeselect': function () {
                        if (ventanaClientes.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    }
                });
                botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
                    var records = ventanaClientes.getGridPrincipal().getSelectionModel().getSelections();
                    _this.addRecords(_this.stCliente, records);

                });


            }
        });
        this.btnElimCliente = LOG.util.Prototipos.botonEliminar({
            text: _this.idioma.btnEliminar,
            tooltip: _this.idioma.ttBtnElimCliente,
            disabled: true,
            handler: function () {
                var seleccion = smCliente.getSelections();
                for (var i = 0; i < seleccion.length; i++) {
                    _this.stCliente.remove(seleccion[i]);
                }
                if (_this.stCliente.getCount() == 0) {
                    _this.btnElimCliente.setDisabled(true);
                }
            }
        });
        this.tbCliente = new LOG.util.UIManager.initToolbar({
            items: [this.btnSelecCliente, this.btnElimCliente]
        });

        var gridCliente = LOG.util.UIManager.initGrid(cmCliente, _this.stCliente, smCliente, {
            tbar: this.tbCliente,
            height: 160,
            bbar: null,
            expanded: clsCliente.expanded
        });

        this.fsSelecCliente = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsSelecCliente,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            height: 195,
            items: [gridCliente]
        });

        /*---------------Fieldset con grid Selecionar Suministrador-------------*/
        var listaSumin = new LOG.util.List();
        var checkSumin = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        listaSumin.add(checkSumin);
        listaSumin.add({
            header: _this.idioma.gcSuministrador,
            width: 250,
            dataIndex: 'nombre',
            default: true
        });

        var clsSumin = LOG.util.UIManager.proccessColumns(listaSumin);
        var cmSumin = new Ext.grid.ColumnModel(clsSumin.columns);
        var smSumin = checkSumin;

        var recSumin = Ext.data.Record.create(clsSumin.fields);
        _this.stSumin = new Ext.data.Store({
            idItem: 'self',
            reader: new Ext.data.JsonReader({
                id: 'id',
                totalProperty: 'cantidad',
                root: 'datos'
            }, recSumin)
        });
        smSumin.on({
            'rowselect': function () {
                if (smSumin.getSelections().length >= 1) {
                    _this.btnElimSumin.enable();
                } else {
                    _this.btnElimSumin.disable();
                }
            },
            'rowdeselect': function () {
                if (smSumin.getSelections().length >= 1) {
                    _this.btnElimSumin.enable();
                } else {
                    _this.btnElimSumin.disable();
                }
            }
        });
        this.btnSelecSumin = LOG.util.Prototipos.botonAdicionar({
            text: _this.idioma.botonAdicionar,
            tooltip: _this.idioma.ttBtnAddSumin,
            disabled: true,
            handler: function () {
                var ventanaClientes = new Ext.erp.ventanaClientes({
                    urlBusquedaGridPrincipal: 'cargarProveedores'
                });
                ventanaClientes.init();
                ventanaClientes.getVistaPrincipal().title = _this.idioma.tlVentanaProveedores;
                ventanaClientes.view();
                ventanaClientes.getGridPrincipal().store.load();
                var botonAceptar = ventanaClientes.getVistaPrincipal().listaBotones.getItem(2);
                ventanaClientes.getGridPrincipal().getSelectionModel().on({
                    'rowselect': function () {
                        if (ventanaClientes.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    },
                    'rowdeselect': function () {
                        if (ventanaClientes.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    }
                });
                botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
                    var records = ventanaClientes.getGridPrincipal().getSelectionModel().getSelections();
                    _this.addRecords(_this.stSumin, records);
                });

            }
        });
        this.btnElimSumin = LOG.util.Prototipos.botonEliminar({
            text: _this.idioma.btnEliminar,
            tooltip: _this.idioma.ttBtnElimSumin,
            disabled: true,
            handler: function () {
                var seleccion = smSumin.getSelections();
                for (var i = 0; i < seleccion.length; i++) {
                    _this.stSumin.remove(seleccion[i]);
                }
                if (_this.stSumin.getCount() == 0) {
                    _this.btnElimSumin.setDisabled(true);
                }
            }
        });
        this.tbSumin = new LOG.util.UIManager.initToolbar({
            items: [this.btnSelecSumin, this.btnElimSumin]
        });

        var gridSumin = LOG.util.UIManager.initGrid(cmSumin, _this.stSumin, smSumin, {
            tbar: this.tbSumin,
            bbar: null,
            height:180,
            expanded: clsSumin.expanded
        });


        this.fsSelecSumin = new Ext.form.FieldSet({ //fieldset Seleccionar Suministrador
            title: _this.idioma.fsSelecSumin,
            style: '-moz-border-radius:5px;height:98%',
            labelAlign: 'top',
            region:'center',
            layout:'fit',
            autoHeight:true,
            items: [gridSumin]
        });


        /*---------------Fieldset con grid Selecionar Producto-------------*/
        var listaProd = new LOG.util.List();
        var checkProd = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        listaProd.add(checkProd);
        listaProd.add({
            header: _this.idioma.gcCodigo,
            width: 80,
            dataIndex: 'codigo',
            default: true
        });
        listaProd.add({
            header: (typeof esminfar !== 'undefined' && esminfar) ? _this.idioma.cgNroPieza : _this.idioma.gcNroPieza,
            width: 140,
            hidden: (typeof confArmamento !== 'undefined' && confArmamento) ? true : false,
            dataIndex: 'codigoproveedor',
            default: true
        });
        listaProd.add({
            header: _this.idioma.gcDenominacion,
            width: 250,
            dataIndex: 'denominacion',
            default: true
        });

        var clsProd = LOG.util.UIManager.proccessColumns(listaProd);
        var cmProd = new Ext.grid.ColumnModel(clsProd.columns);
        var smProd = checkProd;
        _this.stProd = new Ext.data.Store({
            idItem: 'diff',
            reader: new Ext.data.JsonReader({
                id: 'id',
                totalProperty: 'cantidad',
                root: 'datos',
                fields: [
                    {
                        name: 'idproducto'
                    },
                    {
                        name: 'codigo'
                    },
                    {
                        name: 'codigoproveedor'
                    },
                    {
                        name: 'denominacion'
                    }
                ]
            })
        });


        this.btnSelecProd = LOG.util.Prototipos.botonAdicionar({
            text: _this.idioma.botonAdicionar,
            tooltip: _this.idioma.ttBtnAddProd,
            handler: function () {
                /*var winProductos = new LOG.lb.producto.View({
                    idioma: _this.idioma,
                    _parent: _this,
                    parametros: {
                        idestructura: _this.comboDepositos.getValue()
                    },
                    doAction: function (i) {
                        var record = winProductos.getGridPrincipal().getSelectionModel().getSelections();
                        _this.addRecords(_this.stProd, record);
                    }
                });
                winProductos.init();
                winProductos.busquedaAvanzada = false;
                winProductos.getVistaPrincipal().buttons[1].setVisible(false);
                winProductos.getVistaPrincipal().width = 750;
                winProductos.getVistaPrincipal().height = 350;
                _this.vistaProductos = winProductos.view();
                _this.vistaProductos.show();*/
                LOG.inv.maestroproductos.Loader.init(function () {
                    var params = _this.collectRecords(_this.stProd.data.items, 'producto');
                    var v = new LOG.lb.maestroproductos.UIProductos({
                        tipo: 1,
                        parametros: params,
                        usarAplicar: true,
                        doAction: function (i) {
                            var self = this;
                            var record = [];

                            Ext.each(i, function (obj) {
                                record.push(obj);
                            });
                            _this.stProd.on({
                                'add':function(store,r,i){
                                    LOG.util.UIManager.apply(self.parametros,_this.collectRecords(_this.stProd.data.items, 'producto'));
                                    self.panelProductos.getStorePrincipal().reload();
                                }
                            });

                            LOG.util.UIManager.apply(this.parametros,_this.collectRecords(_this.stProd.data.items, 'producto'));
                            _this.stProd.add(record);
                            if(_this.stProd.length > 0){
                                this.close();
                            }
                        }
                    });
                    v.show();
                });

            }
        });
        this.btnElimProd = LOG.util.Prototipos.botonEliminar({
            text: _this.idioma.btnEliminar,
            tooltip: _this.idioma.ttBtnElimProd,
            disabled: true,
            handler: function () {
                var selecciones = smProd.getSelections();
                for (var i = 0; i < selecciones.length; i++) {
                    _this.stProd.remove(selecciones[i]);
                    // _this.btnElimProd.setDisabled(true);
                }
                if (_this.stProd.getCount() == 0) {
                    _this.btnElimProd.setDisabled(true);
                }
            }
        });

        this.tbProd = new LOG.util.UIManager.initToolbar({
            items: [this.btnSelecProd, this.btnElimProd]
        });
        var gridProd = LOG.util.UIManager.initGrid(cmProd, _this.stProd, smProd, {
            tbar: this.tbProd,
            bbar: null,
            height:180,
            expanded: clsProd.expanded
        });

        smProd.on({
            'rowselect': function () {
                _this.btnElimProd.setDisabled(false);
            },
            'rowdeselect': function () {
                _this.btnElimProd.setDisabled(true);
            }
        });

        this.fsSelecProd = new Ext.form.FieldSet({
            title: _this.idioma.fsSelecProd,
            style: '-moz-border-radius:5px;height:98%',
            labelAlign: 'top',
            region:'west',
            autoHeight:true,
            layout:'fit',
            items: [gridProd]
        });

        /*------------Fieldset con checks---------------*/
        this.chPendientes = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chPendientes,
            height: 20,
            name:  _this.idioma.chPendientes,
         //   report: 'Pendientes',
            report: 'ProductosDistribucion',
            procedencia :'- Cliente:',
            tipoCliente:1,
            estados:'5',
            hideLabel: true,
            // style: 'margin:0px 0px 0px 0px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    var cont = 0;
                    var chgrItems = _this.chgrClientes.items;
                    for (var i = 0; i <= chgrItems.length - 1; i++) {
                        if (chgrItems[i].checked) {
                            cont++;
                        }
                    }
                    if (cont != 0) {
                        _this.btnSelecCliente.enable();
                    } else {
                        _this.btnSelecCliente.disable();
                    }
                }
            }
        });
        this.chAsignados = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chAsignados,
            height: 20,
            name: _this.idioma.chAsignados,
            report: 'ProductosDistribucion',
            procedencia :'- Cliente:',
            tipoCliente:1,
            estados:'1',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    var cont = 0;
                    var chgrItems = _this.chgrClientes.items;
                    for (var i = 0; i <= chgrItems.length - 1; i++) {
                        if (chgrItems[i].checked) {
                            cont++;
                        }
                    }
                    if (cont != 0) {
                        _this.btnSelecCliente.enable();
                    } else {
                        _this.btnSelecCliente.disable();
                    }
                }
            }
        });
        this.chAprobados = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chAprobados,
            height: 20,
            name: _this.idioma.chAprobados,
            report: 'ProductosDistribucion',
            procedencia :'- Cliente:',
            tipoCliente:1,
            estados:'2',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    var cont = 0;
                    var chgrItems = _this.chgrClientes.items;
                    for (var i = 0; i <= chgrItems.length - 1; i++) {
                        if (chgrItems[i].checked) {
                            cont++;
                        }
                    }
                    if (cont != 0) {
                        _this.btnSelecCliente.enable();
                    } else {
                        _this.btnSelecCliente.disable();
                    }
                }
            }
        });
        this.chAprobadosProc = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chAprobadosProc,
            height: 20,
            name: _this.idioma.chAprobadosProc,
            report: 'ProductosDistribucion',
            procedencia :'- Cliente:',
            tipoCliente:1,
            estados:'4',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    var cont = 0;
                    var chgrItems = _this.chgrClientes.items;
                    for (var i = 0; i <= chgrItems.length - 1; i++) {
                        if (chgrItems[i].checked) {
                            cont++;
                        }
                    }
                    if (cont != 0) {
                        _this.btnSelecCliente.enable();
                    } else {
                        _this.btnSelecCliente.disable();
                    }
                }
            }
        });
        this.chAprobadosNoProc = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chAprobadosNoProc,
            height: 20,
            name: _this.idioma.chAprobadosNoProc,
            report: 'ProductosDistribucion',
            procedencia :'- Cliente:',
            tipoCliente:1,
            estados:'5',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    var cont = 0;
                    var chgrItems = _this.chgrClientes.items;
                    for (var i = 0; i <= chgrItems.length - 1; i++) {
                        if (chgrItems[i].checked) {
                            cont++;
                        }
                    }
                    if (cont != 0) {
                        _this.btnSelecCliente.enable();
                    } else {
                        _this.btnSelecCliente.disable();
                    }
                }
            }
        });
        this.chPropuestosCancelar = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chPropuestosCancelar,
            height: 20,
            name: _this.idioma.chPropuestosCancelar,
            report: 'ProductosDistribucion',
            procedencia :'- Cliente:',
            tipoCliente:1,
            estados:'3',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    var cont = 0;
                    var chgrItems = _this.chgrClientes.items;
                    for (var i = 0; i <= chgrItems.length - 1; i++) {
                        if (chgrItems[i].checked) {
                            cont++;
                        }
                    }
                    if (cont != 0) {
                        _this.btnSelecCliente.enable();
                    } else {
                        _this.btnSelecCliente.disable();
                    }
                }
            }
        });
        this.chRecepcionadosContab = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chRecepcionadosContab,
            height: 20,
            name:  _this.idioma.chRecepcionadosContab,
            hideLabel: true,
            report: 'DocumentosInventario',
            tipoCliente:2,
            procedencia :'- Proveedor:',
            estados:'{4}',
            tipodocumento:'recepcionLog',
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    var contSumin = 0;
                    var contAjustados = 0;
                    var chgrItemsSumin = _this.chgrSumin.items;
                    var chgrItemsAjustados = _this.chgrAjustados.items;
                    for (var i = 0; i <= chgrItemsSumin.length - 1; i++) {
                        if (chgrItemsSumin[i].checked) {
                            contSumin++;
                        }
                    }
                    for (var i = 0; i <= chgrItemsAjustados.length - 1; i++) {
                        if (chgrItemsAjustados[i].checked) {
                            contAjustados++;
                        }
                    }
                    if (contSumin != 0 && contAjustados != 0) {
                        _this.btnSelecSumin.disable();
                    } else if (contSumin != 0 && contAjustados == 0) {
                        _this.btnSelecSumin.enable();
                    }
                    if (contSumin == 0 && contAjustados == 0) {
                        _this.btnSelecSumin.disable();
                    }
                }
            }
        });
        this.chRecepcionadosNoContab = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chRecepcionadosNoContab,
            height: 20,
            name:_this.idioma.chRecepcionadosNoContab,
            report: 'DocumentosInventario',
            procedencia :'- Proveedor:',
            tipoCliente:2,
            estados:'{1,2,3}',
            tipodocumento:'recepcionLog',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    var cont = 0;
                    var contSumin = 0;
                    var contAjustados = 0;
                    var chgrItemsSumin = _this.chgrSumin.items;
                    var chgrItemsAjustados = _this.chgrAjustados.items;
                    for (var i = 0; i <= chgrItemsSumin.length - 1; i++) {
                        if (chgrItemsSumin[i].checked) {
                            contSumin++;
                        }
                    }
                    for (var i = 0; i <= chgrItemsAjustados.length - 1; i++) {
                        if (chgrItemsAjustados[i].checked) {
                            contAjustados++;
                        }
                    }
                    if (contSumin != 0 && contAjustados != 0) {
                        _this.btnSelecSumin.disable();
                    } else if (contSumin != 0 && contAjustados == 0) {
                        _this.btnSelecSumin.enable();
                    }
                    if (contSumin == 0 && contAjustados == 0) {
                        _this.btnSelecSumin.disable();
                    }
                }
            }
        });
        this.chDevueltosContab = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chDevueltosContab,
            height: 20,
            name: _this.idioma.chDevueltosContab,
            report: 'DocumentosInventario',
            procedencia :'- Cliente:',
            estados:'{4}',
            tipoCliente:null,
            tipodocumento:'valedev',
            hideLabel: true

        });
        this.chDevueltosNoContab = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chDevueltosNoContab,
            height: 20,
            name: _this.idioma.chDevueltosNoContab,
            report: 'DocumentosInventario',
            procedencia :'- Cliente:',
            tipoCliente:null,
            estados:'{1,2,3}',
            tipodocumento:'valedev',
            hideLabel: true

        });
        this.chAjustadosContab = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chAjustadosContab,
            height: 20,
            name: _this.idioma.chAjustadosContab,
            report: 'DocumentosInventario',
            procedencia :null,
            tipoCliente:null,
            estados:'{4}',
            tipodocumento:'ajusteLog',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);

                    var contSumin = 0;
                    var contAjustados = 0;
                    var chgrItemsSumin = _this.chgrSumin.items;
                    var chgrItemsAjustados = _this.chgrAjustados.items;
                    for (var i = 0; i <= chgrItemsSumin.length - 1; i++) {
                        if (chgrItemsSumin[i].checked) {
                            contSumin++;
                        }
                    }
                    for (var i = 0; i <= chgrItemsAjustados.length - 1; i++) {
                        if (chgrItemsAjustados[i].checked) {
                            contAjustados++;
                        }
                    }
                    if (contSumin != 0 && contAjustados != 0) {
                        _this.btnSelecSumin.disable();
                    } else if (contSumin != 0 && contAjustados == 0) {
                        _this.btnSelecSumin.enable();
                    }

                }
            }
        });
        this.chEntregadosContab = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chEntregadosContab,
            height: 20,
            name: _this.idioma.chEntregadosContab,
            esvale: 1,
            report: 'DocumentosInventario',
            procedencia :'- Cliente:',
            tipoCliente:1,
            estados:'{4}',
            tipodocumento:'valeLog',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    var cont = 0;
                    var chgrItems = _this.chgrClientes.items;
                    for (var i = 0; i <= chgrItems.length - 1; i++) {
                        if (chgrItems[i].checked) {
                            cont++;
                        }
                    }
                    if (cont != 0) {
                        _this.btnSelecCliente.enable();
                    } else {
                        _this.btnSelecCliente.disable();
                    }
                }
            }
        });
        this.chEntregadosNoContab = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chEntregadosNoContab,
            height: 20,
            name: _this.idioma.chEntregadosNoContab,
            esvale: 1,
            report: 'DocumentosInventario',
            procedencia :'- Cliente:',
            tipoCliente:1,
            estados:'{1,2,3}',
            tipodocumento:'valeLog',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    var cont = 0;
                    var chgrItems = _this.chgrClientes.items;
                    for (var i = 0; i <= chgrItems.length - 1; i++) {
                        if (chgrItems[i].checked) {
                            cont++;
                        }
                    }
                    if (cont != 0) {
                        _this.btnSelecCliente.enable();
                    } else {
                        _this.btnSelecCliente.disable();
                    }
                }
            }
        });
        this.chTransfContab = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chTransfContab,
            height: 20,
            name: _this.idioma.chTransfContab,
            report: 'DocumentosInventario',
            procedencia :'- Cliente:',
            tipoCliente:1,
            estados:'{4}',
            tipodocumento:'transferenciaLog',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    var cont = 0;
                    var chgrItems = _this.chgrClientes.items;
                    for (var i = 0; i <= chgrItems.length - 1; i++) {
                        if (chgrItems[i].checked) {
                            cont++;
                        }
                    }
                    if (cont != 0) {
                        _this.btnSelecCliente.enable();
                    } else {
                        _this.btnSelecCliente.disable();
                    }
                }
            }

        });
        this.chTransfNoContab = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chTransfNoContab,
            height: 20,
            name: _this.idioma.chTransfNoContab,
            report: 'DocumentosInventario',
            procedencia :'- Cliente:',
            tipoCliente:1,
            estados:'{1,2,3}',
            tipodocumento:'transferenciaLog',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    var cont = 0;
                    var chgrItems = _this.chgrClientes.items;
                    for (var i = 0; i <= chgrItems.length - 1; i++) {
                        if (chgrItems[i].checked) {
                            cont++;
                        }
                    }
                    if (cont != 0) {
                        _this.btnSelecCliente.enable();
                    } else {
                        _this.btnSelecCliente.disable();
                    }
                }
            }

        });
        this.chAjustadosNoContab = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chAjustadosNoContab,
            height: 20,
            name: _this.idioma.chAjustadosNoContab,
            report: 'DocumentosInventario',
            procedencia :null,
            tipoCliente:null,
            estados:'{1,2,3}',
            tipodocumento:'ajusteLog',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);

                    var contSumin = 0;
                    var contAjustados = 0;
                    var chgrItemsSumin = _this.chgrSumin.items;
                    var chgrItemsAjustados = _this.chgrAjustados.items;
                    for (var i = 0; i <= chgrItemsSumin.length - 1; i++) {
                        if (chgrItemsSumin[i].checked) {
                            contSumin++;
                        }
                    }
                    for (var i = 0; i <= chgrItemsAjustados.length - 1; i++) {
                        if (chgrItemsAjustados[i].checked) {
                            contAjustados++;
                        }
                    }
                    if (contSumin != 0 && contAjustados != 0) {
                        _this.btnSelecSumin.disable();
                    } else if (contSumin != 0 && contAjustados == 0) {
                        _this.btnSelecSumin.enable();
                    }
                }
            }
        });
        
        this.chFacturasDetalle = new Ext.form.Checkbox({ //checkbox
            boxLabel: 'Facturados no contabilizados',
            height: 25,
            name: 'Facturados no contabilizados',
            report: 'FacturasInventario',
            procedencia :null,
            tipoCliente:1,
            estados:'{1,2}',
            reporte: 1,
            tipodocumento:'facturaLog',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);

                    var contSumin = 0;
                    var contAjustados = 0;
                    var chgrItemsSumin = _this.chgrSumin.items;
                    var chgrItemsAjustados = _this.chgrAjustados.items;
                    for (var i = 0; i <= chgrItemsSumin.length - 1; i++) {
                        if (chgrItemsSumin[i].checked) {
                            contSumin++;
                        }
                    }
                    for (var i = 0; i <= chgrItemsAjustados.length - 1; i++) {
                        if (chgrItemsAjustados[i].checked) {
                            contAjustados++;
                        }
                    }
                    if (contSumin != 0 && contAjustados != 0) {
                        _this.btnSelecSumin.disable();
                    } else if (contSumin != 0 && contAjustados == 0) {
                        _this.btnSelecSumin.enable();
                    }
                }
            }
        });
        
        this.chFacturasDetalleCont = new Ext.form.Checkbox({ //checkbox
            boxLabel: 'Facturados contabilizados',
            height: 25,
            name: 'Facturados contabilizados',
            report: 'FacturasInventario',
            procedencia :null,
            tipoCliente:1,
            estados:'{4}',
            reporte: 1,
            tipodocumento:'facturaLog',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);

                    var contSumin = 0;
                    var contAjustados = 0;
                    var chgrItemsSumin = _this.chgrSumin.items;
                    var chgrItemsAjustados = _this.chgrAjustados.items;
                    for (var i = 0; i <= chgrItemsSumin.length - 1; i++) {
                        if (chgrItemsSumin[i].checked) {
                            contSumin++;
                        }
                    }
                    for (var i = 0; i <= chgrItemsAjustados.length - 1; i++) {
                        if (chgrItemsAjustados[i].checked) {
                            contAjustados++;
                        }
                    }
                    if (contSumin != 0 && contAjustados != 0) {
                        _this.btnSelecSumin.disable();
                    } else if (contSumin != 0 && contAjustados == 0) {
                        _this.btnSelecSumin.enable();
                    }
                }
            }
        });
        
        //conciliacion
        this.chFacturas = new Ext.form.Checkbox({ //checkbox
            boxLabel: 'Facturas',
            height: 25,
            name: 'Facturas',
            report: 'FacturasConciliacion',
            procedencia :null,
            tipoCliente:1,
            estados:'{4}',
            reporte: 1,
            tipodocumento:'facturaLog',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);

                    var contSumin = 0;
                    var contAjustados = 0;
                    var chgrItemsSumin = _this.chgrSumin.items;
                    var chgrItemsAjustados = _this.chgrAjustados.items;
                    for (var i = 0; i <= chgrItemsSumin.length - 1; i++) {
                        if (chgrItemsSumin[i].checked) {
                            contSumin++;
                        }
                    }
                    for (var i = 0; i <= chgrItemsAjustados.length - 1; i++) {
                        if (chgrItemsAjustados[i].checked) {
                            contAjustados++;
                        }
                    }
                    if (contSumin != 0 && contAjustados != 0) {
                        _this.btnSelecSumin.disable();
                    } else if (contSumin != 0 && contAjustados == 0) {
                        _this.btnSelecSumin.enable();
                    }
                }
            }
        });
        
        this.valesordenes = new Ext.form.Checkbox({ //checkbox
            boxLabel: 'Vales talleres',
            height: 25,
            name: 'Vales talleres',
            report: 'ValesConciliacion',
            procedencia :null,
            tipoCliente:null,
            estados:'{4}',
            reporte: 3,
            tipodocumento:'valeLog',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);

                    var contSumin = 0;
                    var contAjustados = 0;
                    var chgrItemsSumin = _this.chgrSumin.items;
                    var chgrItemsAjustados = _this.chgrAjustados.items;
                    for (var i = 0; i <= chgrItemsSumin.length - 1; i++) {
                        if (chgrItemsSumin[i].checked) {
                            contSumin++;
                        }
                    }
                    for (var i = 0; i <= chgrItemsAjustados.length - 1; i++) {
                        if (chgrItemsAjustados[i].checked) {
                            contAjustados++;
                        }
                    }
                    if (contSumin != 0 && contAjustados != 0) {
                        _this.btnSelecSumin.disable();
                    } else if (contSumin != 0 && contAjustados == 0) {
                        _this.btnSelecSumin.enable();
                    }
                }
            }
        });
        this.transferencia = new Ext.form.Checkbox({ //checkbox
            boxLabel: 'Transferencias',
            height: 25,
            name: 'Transferencias',
            report: 'TransferenciasConciliacion',
            procedencia :null,
            tipoCliente:null,
            estados:'{4}',
            reporte: 2,
            tipodocumento:'transferenciaLog',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);

                    var contSumin = 0;
                    var contAjustados = 0;
                    var chgrItemsSumin = _this.chgrSumin.items;
                    var chgrItemsAjustados = _this.chgrAjustados.items;
                    for (var i = 0; i <= chgrItemsSumin.length - 1; i++) {
                        if (chgrItemsSumin[i].checked) {
                            contSumin++;
                        }
                    }
                    for (var i = 0; i <= chgrItemsAjustados.length - 1; i++) {
                        if (chgrItemsAjustados[i].checked) {
                            contAjustados++;
                        }
                    }
                    if (contSumin != 0 && contAjustados != 0) {
                        _this.btnSelecSumin.disable();
                    } else if (contSumin != 0 && contAjustados == 0) {
                        _this.btnSelecSumin.enable();
                    }
                }
            }
        });
        this.recepcion = new Ext.form.Checkbox({ //checkbox
            boxLabel: 'Recepciones',
            height: 25,
            name: 'Recepcion',
            report: 'RecepcionConciliacion',
            procedencia :null,
            tipoCliente:null,
            estados:'{4}',
            reporte: 4,
            tipodocumento:'recepcionLog',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);

                    var contSumin = 0;
                    var contAjustados = 0;
                    var chgrItemsSumin = _this.chgrSumin.items;
                    var chgrItemsAjustados = _this.chgrAjustados.items;
                    for (var i = 0; i <= chgrItemsSumin.length - 1; i++) {
                        if (chgrItemsSumin[i].checked) {
                            contSumin++;
                        }
                    }
                    for (var i = 0; i <= chgrItemsAjustados.length - 1; i++) {
                        if (chgrItemsAjustados[i].checked) {
                            contAjustados++;
                        }
                    }
                    if (contSumin != 0 && contAjustados != 0) {
                        _this.btnSelecSumin.disable();
                    } else if (contSumin != 0 && contAjustados == 0) {
                        _this.btnSelecSumin.enable();
                    }
                }
            }
        });
        this.devolucion = new Ext.form.Checkbox({ //checkbox
            boxLabel: 'Devoluciones',
            height: 25,
            name: 'Devoluciones',
            report: 'DevolucionConciliacion',
            procedencia :null,
            tipoCliente:null,
            estados:'{4}',
            reporte: 5,
            tipodocumento:'valedev',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);

                    var contSumin = 0;
                    var contAjustados = 0;
                    var chgrItemsSumin = _this.chgrSumin.items;
                    var chgrItemsAjustados = _this.chgrAjustados.items;
                    for (var i = 0; i <= chgrItemsSumin.length - 1; i++) {
                        if (chgrItemsSumin[i].checked) {
                            contSumin++;
                        }
                    }
                    for (var i = 0; i <= chgrItemsAjustados.length - 1; i++) {
                        if (chgrItemsAjustados[i].checked) {
                            contAjustados++;
                        }
                    }
                    if (contSumin != 0 && contAjustados != 0) {
                        _this.btnSelecSumin.disable();
                    } else if (contSumin != 0 && contAjustados == 0) {
                        _this.btnSelecSumin.enable();
                    }
                }
            }
        });



        /*------------------checkgroups usar en las validaciones--------------*/
        this.chgrEstadoProd = new Ext.form.CheckboxGroup({ //checkgroup
            items: [this.chPendientes,
                this.chAsignados,
                this.chAprobados,
                this.chAprobadosProc,
                this.chAprobadosNoProc,
                this.chPropuestosCancelar,
                this.chEntregadosContab,
                this.chEntregadosNoContab,
                this.chRecepcionadosContab,
                this.chRecepcionadosNoContab,
                this.chAjustadosContab,
                this.chAjustadosNoContab,
                this.chDevueltosContab,
                this.chDevueltosNoContab,
                this.chTransfContab,
                this.chTransfNoContab,
                this.chFacturas,
                this.valesordenes,
                this.transferencia,
                this.recepcion,
                this.devolucion,
                this.chFacturasDetalle,
                this.chFacturasDetalleCont
            ]
        });
        this.chgrClientes = new Ext.form.CheckboxGroup({ //checkgroup Clientes
            items: [this.chPendientes,
                this.chAsignados,
                this.chAprobados,
                this.chAprobadosProc,
                this.chAprobadosNoProc,
                this.chPropuestosCancelar,
                this.chEntregadosContab,
                this.chEntregadosNoContab,
                this.chTransfContab,
                this.chTransfNoContab,
                this.chFacturas,
                this.valesordenes,
                this.transferencia,
                this.recepcion,
                this.devolucion,
                this.chFacturasDetalle,
                this.chFacturasDetalleCont
            ]
        });
        this.chgrSumin = new Ext.form.CheckboxGroup({ //checkgroup Suministradores
            items: [this.chRecepcionadosContab,
                this.chRecepcionadosNoContab
            ]
        });
        this.chgrAjustados = new Ext.form.CheckboxGroup({ //checkgroup prod ajustados
            items: [this.chAjustadosContab,
                this.chAjustadosNoContab
            ]
        });


        this.clsEstadoProd = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });

        this.clsEstadoProd.addComponent(this.chAsignados);
        this.clsEstadoProd.addComponent(this.chRecepcionadosContab);
        this.clsEstadoProd.addComponent(this.chEntregadosContab);
        this.clsEstadoProd.addComponent(this.chAprobados);
        this.clsEstadoProd.addComponent(this.chRecepcionadosNoContab);
        this.clsEstadoProd.addComponent(this.chEntregadosNoContab);
        this.clsEstadoProd.addComponent(this.chAprobadosProc);
        this.clsEstadoProd.addComponent(this.chDevueltosContab);
        this.clsEstadoProd.addComponent(this.chTransfContab);
        this.clsEstadoProd.addComponent(this.chAprobadosNoProc);
        this.clsEstadoProd.addComponent(this.chDevueltosNoContab);
        this.clsEstadoProd.addComponent(this.chTransfNoContab);
        this.clsEstadoProd.addComponent(this.chPropuestosCancelar);
        this.clsEstadoProd.addComponent(this.chAjustadosContab);
        this.clsEstadoProd.addComponent(this.chAjustadosNoContab);
        this.clsEstadoProd.addComponent(this.chFacturasDetalle);
        this.clsEstadoProd.addComponent(this.chFacturasDetalleCont);
        this.clsEstadoGeneral = LOG.util.UIManager.initColumnForm({
            columnas: 5
        });
        this.clsEstadoGeneral.addComponent(this.chFacturas);
        this.clsEstadoGeneral.addComponent(this.valesordenes);
        this.clsEstadoGeneral.addComponent(this.transferencia);
        this.clsEstadoGeneral.addComponent(this.recepcion);
        this.clsEstadoGeneral.addComponent(this.devolucion);
        
        this.fsEstadoGeneral = new Ext.form.FieldSet({ //fieldset Estado producto
            title: 'Datos generales',
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            labelWidth: 165,
            items: [this.clsEstadoGeneral],
            height: 65
        });
        
                
        this.fsEstadoProd = new Ext.form.FieldSet({ //fieldset Estado producto
            title: _this.idioma.fsEstadoProd,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            labelWidth: 165,
            items: [this.clsEstadoProd, this.fsEstadoGeneral],
            height: 287
        });

        this.clsGeneral = LOG.util.UIManager.initColumnForm({ //columnForm de la fecha
            columnas: 2,
            region:'center'
        });
        this.clsGeneral.addComponent(this.fsRangoFecha);
        this.clsGeneral.addComponent(this.fsEstadoProd);
        this.clsGeneral.addComponent(this.fsSelecCliente);
        this.clsGeneral.addComponent(this.fsSelecProd);
        this.clsGeneral.addComponent(this.fsSelecSumin);
        this.clsGeneral.getColumn(0).columnWidth = 0.4;
        this.clsGeneral.getColumn(1).columnWidth = 0.6;
        this.clsGeneral.anchor = '101.3%';

        this.fpCentral = LOG.util.UIManager.initForm({ //formulario General
            id:'formularioCentralClientesProd',
            region: 'center',
            style: '-moz-border-radius:20px',
            items: [this.clsGeneral]
        });
        /* -------configuracion de la vista---------*/
        config.layout = 'border';
        config.items = [
            {
                region: 'north',
                tbar: [this.listaBotonesVentanaToolbar.getArray()],
                bbar:  [this.listaBotonesDeposito.getArray()]
            },
            this.fpCentral
        ];
        Ext.erp.clientesproductos.superclass.constructor.call(this, config);
    },
    collectRecords: function(records,tipogrid){
        var idSeleccionados = [];
        var parametros = {};
        Ext.each(records, function (rec) {
            if (rec.data.idindicador) {
                idSeleccionados.push(rec.data.idindicador);
            }
        });
        parametros.idseleccionados = Ext.encode(idSeleccionados);
        if(tipogrid == 'producto'){return parametros;}
        else{return idSeleccionados}

    },
    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addToolbarButtonDeposito: function (b, f) {
        this.listaBotonesDeposito.add(LOG.util.UIManager.reconfigureButton(b));
    },
    showReport: function (btn) {
        var contItems = 0;
        var _this=this;
        _this.reports = [];
        var chgrItems = _this.chgrEstadoProd.items;
        var stringClientes = "";
        var stringSumin = "";
        var stringIndicador = "";
        var depositos = "";
        _this.entidades=[];
        _this.entidadesCheck=[];
        for (var i = 0; i < _this.stCliente.data.items.length; i++) {
            if (i != _this.stCliente.data.items.length - 1) {
                stringClientes += _this.stCliente.data.items[i].data.idclientesproveedores + ",";
            } else {
                stringClientes += _this.stCliente.data.items[i].data.idclientesproveedores + "";
            }
        }
        stringClientes = "{" + stringClientes + "}";
        if(stringClientes== "{}") {
            stringClientes = null;
        }

        for (var i = 0; i < _this.stSumin.data.items.length; i++) {
            if (i != _this.stSumin.data.items.length - 1) {
                stringSumin += _this.stSumin.data.items[i].data.idclientesproveedores + ",";
            } else {
                stringSumin += _this.stSumin.data.items[i].data.idclientesproveedores + "";
            }
        }
        stringSumin = "{" + stringSumin + "}";
        if(stringSumin== "{}") {
            stringSumin = null;
        }

        for (var i = 0; i < _this.stProd.data.items.length; i++) {
            if (i != _this.stProd.data.items.length - 1) {
                stringIndicador += _this.stProd.data.items[i].data.idindicador + ",";
            } else {
                stringIndicador += _this.stProd.data.items[i].data.idindicador + "";
            }
        }
        stringIndicador = "{" + stringIndicador + "}";
        if(stringIndicador== "{}") {
            stringIndicador = null;
        }

        if(this.comboDepositos.view){

            for(var i=0; i < this.comboDepositos.view.store.data.items.length; i++) {
                if (this.comboDepositos.view.store.data.items[i].data.checked) {
                    _this.entidadesCheck.push(this.comboDepositos.view.store.data.items[i].data.iddeposito);
                }
                _this.entidades.push(_this.comboDepositos.view.store.data.items[i].data.iddeposito);
            }
            if(_this.entidadesCheck.length > 0){
                depositos = "{" + _this.entidadesCheck.join() + "}";
            }else{
                depositos = "{" + _this.entidades.join() + "}";
            }
        }else{
            for(var i=0; i < this.comboDepositos.store.data.items.length; i++) {
                _this.entidades.push(_this.comboDepositos.store.data.items[i].data.iddeposito);
            }
            depositos = "{" + _this.entidades.join() + "}";
        }

        for (var i = 0; i <= chgrItems.length - 1; i++) {
            if (chgrItems[i].checked) {
                contItems++;
            }
        }
        if (contItems == 0) {
            mostrarMensaje(1, _this.idioma.msgAlerta);
        } else {
            for (var i = 0; i <= chgrItems.length - 1; i++) {
                if (chgrItems[i].checked) {
                    _this.reports.push(
                        {
                            dirReport: '/distra/logistica/inventario/recuperaciones/ClientesProductos/'+ chgrItems[i].report + ((alternativa)? 'Dual' : '') + btn.sufijo,
                            name: chgrItems[i].name,
                            isList:true,
                            params: {
                                fechainicio: (_this.dfDesdeCP.getValue()) ? _this.dfDesdeCP.getValue().format('d-m-Y') : null,
                                fechafin: (_this.dfHastaCP.getValue()) ? _this.dfHastaCP.getValue().format('d-m-Y') : null,
                                arraycliente: (chgrItems[i].tipoCliente == 1) ?  stringClientes : (chgrItems[i].tipoCliente == 2) ? stringSumin : null,
                                arraysuministrador: stringSumin,
                                arraydeposito:depositos,
                                arrayestado:chgrItems[i].estados,
                                arrayindicador: stringIndicador,
                                idestructura: idEntidad,
                                procedencia:chgrItems[i].procedencia,
                                idsubsistema: _this.comboDepositos.store.reader.jsonData.idsubsistema,
                                monedaalternativa:monedaalternativa ? monedaalternativa : null,
                                monedacontable:monedacontable ? monedacontable : null,
                                tipodocumento:chgrItems[i].tipodocumento,
                                title: btn.title + ' Productos ' + chgrItems[i].boxLabel,
                                esvale: chgrItems[i].esvale ? chgrItems[i].esvale : 0,
                                reporte: chgrItems[i].reporte ? chgrItems[i].reporte : 0,
                            }
                        }
                    );

                }
            }
            _this.tipoReportes = new LOG.util.Report({
                reports: _this.reports
            });
            _this.tipoReportes.view();
        }
    },
    botonLimpiar: function () {
        var _this=this;
        _this.dfDesdeCP.setValue(null);
        _this.dfHastaCP.setValue(null);
        _this.dfDesdeCP.setMaxValue(null);
        _this.dfHastaCP.setMinValue(null);
        for (var i = 0; i < _this.chgrEstadoProd.items.length; i++) {
            _this.chgrEstadoProd.items[i].setValue(false);
        }
        _this.stCliente.removeAll();
        _this.stProd.removeAll();
        _this.stSumin.removeAll();
        _this.comboDepositos.clearValue();
    },
    addRecords: function (store, records) {
        var _this = this;
        Ext.each(records, function (record, index) {
            if (!_this.existsRecord(store, record)) {
                var recordType;
                if (store.idItem === 'diff') {
                    recordType = new store.recordType({
                        idproducto: record.get('idproducto'),
                        codigoproveedor: record.get('codigoproveedor'),
                        codigo: record.get('codigo'),
                        denominacion: record.get('denominacion')
                    });
                } else if (store.idItem === 'self') {
                    recordType = new store.recordType({
                        idclientesproveedores: record.get('idclientesproveedores'),
                        nombre: record.get('nombre')
                    });
                }
                store.add(recordType);
            }
        });

    },
    existsRecord: function (store, record) {
        var flags = false;
        Ext.each(store.data.items, function (nRecord, index) {
            if (store.idItem === 'diff') {
                if ( nRecord.get('idproducto') === record.get('idproducto')) {
                    flags = true;
                }
            } else if (store.idItem === 'self') {
                if (nRecord.get('idclientesproveedores') === record.get('idclientesproveedores')) {
                    flags = true;
                }
            }
        });
        return flags;
    }
});

/*-----------ventana de seleccionde clientes y suministradores---------------*/
Ext.erp.ventanaClientes = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma = log.inv.clientesproductos.Idioma;
        config.dirController = '/logistica/utiles/plugin/index.php/sistemasexternos';
        config.modoSeleccion = 3;
        config.autoSelect = false;
        config.autoLoad = false;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'ventana';
        config = Ext.apply(_this, config);
        Ext.erp.ventanaClientes.superclass.constructor.call(this, config);
        _this.concepto = this.idioma.clientes;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimpleC;

    },
    init: function () {
        var _this = this;
        Ext.erp.ventanaClientes.superclass.init.call(this);

        _this.getVistaPrincipal().width = 500;
        _this.getVistaPrincipal().height = 400;
        _this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).disable();


    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: _this.idioma.gcCliente,
            width: 200,
            dataIndex: 'nombre',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.gcTipoCliente,
            width: 150,
            dataIndex: 'tipocliente',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idclientesproveedores'
        });

    },
    render: function () {
        var _this = this;
        var p = Ext.erp.ventanaClientes.superclass.render.call(this);
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                st.baseParams.criterio = st.baseParams.criterio;
            }
        });
        return p;
    }
});
