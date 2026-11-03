Ext.ns('Ext.erp.docemitidosrecibidos');
Ext.erp.docemitidosrecibidos = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    idioma: undefined,

    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.idioma = log.inv.docemitidosrecibidos.Idioma;
        this.dirController = '/logistica/inventario/recuperaciones/index.php/docemitidosrecibidos/';

        /*------------Barra con botones---------------*/
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesDeposito = new LOG.util.List();
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttBtnImprimir,
            text: _this.idioma.btnImprimir,
            handler: function () {
                _this.getReportes(_this)
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('RB')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonLimpiar({
            tooltip: _this.idioma.ttBtnLimpiar,
            text: _this.idioma.btnLimpiar,
            handler: function () {
                _this.btnLimpiar();
            }
        }));
        this.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'l',
                    fn: function () {
                        _this.btnLimpiar();
                    }
                },
                {
                    alt: true,
                    key: 'p',
                    fn: function () {
                        _this.getReportes(_this)

                    }
                }
            ]);
        this.addToolbarButtonPanel('->');
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({id:'idDocEmitidosRecibidos'}));

        this.addToolbarButtonDeposito('->');
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbDepositos
        }));

        /*this.comboDepositos = new LOG.util.ComboBox({ //---combobox Tipo de producto
            valueField: 'iddeposito',
            displayField: 'deposito',
            hiddenName: 'deposito',
            editable: false,
            url: _this.dirController + 'cargardepositos'
        });*/
        this.comboDepositos = new LOG.util.LovCombo({
            mode:'remote',
            url: _this.dirController + 'cargardepositos',
            displayField:'deposito',
            valueField:'iddeposito'
        });
        this.addToolbarButtonDeposito(this.comboDepositos);


        /*------------Fieldset Rango Fecha---------------*/

        this.dfDesde = new Ext.form.DateField({ //---datefield Desde
            fieldLabel: _this.idioma.dfDesdeDoc,
            name: 'desdedoc',
            vtype: 'daterange',
            id: 'desdedoc',
            endDateField: 'hastadoc',
            editable: false
        });
        this.dfHasta = new Ext.form.DateField({ //---datefield Hasta
            fieldLabel: _this.idioma.dfHastaDoc,
            name: 'hastadoc',
            vtype: 'daterange',
            id: 'hastadoc',
            startDateField: 'desdedoc',
            editable: false
        });
        /*this.dfDesde.endDateField = this.dfHasta.id; //-------validacion de fecha
        this.dfHasta.startDateField = this.dfDesde.id;*/

        this.clsFecha = LOG.util.UIManager.initColumnForm({ //columnForm de la fecha
            columnas: 2
        });
        this.clsFecha.addComponent(this.dfDesde);
        this.clsFecha.addComponent(this.dfHasta);

        this.fsRangoFecha = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsRangoFecha,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight:true,
            items: [this.clsFecha]
        });


        /*---------------Fieldset con grid Selecionar Cliente/Suministrador-------------*/

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
            tooltip:  _this.idioma.ttAddSumin,
            handler: function () {
                var ventanaClientesSumin = new Ext.erp.ventanaClientesSumin({
                    cliente: 'clienteproveedor',
                    urlBusquedaGridPrincipal: 'cargarClientes',
                    initDefaultColumns: function(){
                        this.addGridColumn({
                            header: _this.idioma.gcCliente,
                            width: 200,
                            dataIndex: 'nombre',
                            default: true
                        });
                        this.addGridColumn({
                            header: _this.idioma.gcTipoCliente,
                            width: 300,
                            dataIndex: 'tipocliente',
                            default: true
                        });
                        this.addGridColumn({
                            dataIndex: 'idclientesproveedores'
                        });
                    }
                });
                ventanaClientesSumin.init();

                ventanaClientesSumin.getVistaPrincipal().title = _this.idioma.tlventanaClientesSumin;
                ventanaClientesSumin.view();
                ventanaClientesSumin.getGridPrincipal().store.load();
                var botonAceptar = ventanaClientesSumin.getVistaPrincipal().listaBotones.getItem(2);
                ventanaClientesSumin.getGridPrincipal().getSelectionModel().on({
                    'rowselect': function () {
                        if (ventanaClientesSumin.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    },
                    'rowdeselect': function () {
                        if (ventanaClientesSumin.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    }
                });
                botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
                    var records = ventanaClientesSumin.getGridPrincipal().getSelectionModel().getSelections();
                    _this.addRecords(_this.stCliente, records);

                });


            }
        });
        this.btnElimCliente = LOG.util.Prototipos.botonEliminar({
            text: _this.idioma.btnEliminar,
            tooltip:  _this.idioma.ttElimSumin,
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
            style: '-moz-border-radius:5px',
            bbar: null,
            height: 385,
            expanded: clsCliente.expanded
        });

        this.fsSelecCliente = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsSelecCliente,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            height: 421,
            items: [gridCliente]
        });


        /*---------------Fieldset con grid Selecionar Transportador-------------*/
        var listaTrans = new LOG.util.List();
        var checkTrans = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        listaTrans.add(checkTrans);
        listaTrans.add({
            header: _this.idioma.gcTransportador,
            width: 250,
            dataIndex: 'nombre',
            default: true
        });

        var clsTrans = LOG.util.UIManager.proccessColumns(listaTrans);
        var cmTrans = new Ext.grid.ColumnModel(clsTrans.columns);
        var smTrans = checkTrans;

        var recTrans = Ext.data.Record.create(clsTrans.fields);
        _this.stTrans = new Ext.data.Store({
            idItem: 'self',
            reader: new Ext.data.JsonReader({
                id: 'id',
                totalProperty: 'cantidad',
                root: 'datos'
            }, recTrans)
        });
        smTrans.on({
            'rowselect': function () {
                if (smTrans.getSelections().length >= 1) {
                    _this.btnElimTrans.enable();
                } else {
                    _this.btnElimTrans.disable();
                }
            },
            'rowdeselect': function () {
                if (smTrans.getSelections().length >= 1) {
                    _this.btnElimTrans.enable();
                } else {
                    _this.btnElimTrans.disable();
                }
            }
        });
        this.btnSelecTrans = LOG.util.Prototipos.botonAdicionar({
            text: _this.idioma.botonAdicionar,
            tooltip: _this.idioma.ttAddTrans,
            handler: function () {
                var ventanaProveedores = new Ext.erp.ventanaClientesSumin({
                    cliente: 'proveedor',
                    urlBusquedaGridPrincipal: 'cargarClientes',
                    initDefaultColumns: function(){
                        this.addGridColumn({
                            header: _this.idioma.gcCliente,
                            width: 200,
                            dataIndex: 'nombre',
                            default: true
                        });
                        this.addGridColumn({
                            header: _this.idioma.gcTipoCliente,
                            width: 300,
                            dataIndex: 'tipocliente',
                            default: true
                        });
                        this.addGridColumn({
                            dataIndex: 'idclientesproveedores'
                        });
                    }

                });
                ventanaProveedores.init();
                ventanaProveedores.getVistaPrincipal().title = _this.idioma.tlventanaTrans;
                ventanaProveedores.view();
                ventanaProveedores.getGridPrincipal().store.load();
                var botonAceptar = ventanaProveedores.getVistaPrincipal().listaBotones.getItem(2);
                ventanaProveedores.getGridPrincipal().getSelectionModel().on({
                    'rowselect': function () {
                        if (ventanaProveedores.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    },
                    'rowdeselect': function () {
                        if (ventanaProveedores.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    }
                });
                botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
                    var records = ventanaProveedores.getGridPrincipal().getSelectionModel().getSelections();
                    _this.addRecords(_this.stTrans, records);
                });

            }
        });
        this.btnElimTrans = LOG.util.Prototipos.botonEliminar({
            text: _this.idioma.btnEliminar,
            tooltip:_this.idioma.ttElimTrans,
            disabled: true,
            handler: function () {
                var seleccion = smTrans.getSelections();
                for (var i = 0; i < seleccion.length; i++) {
                    _this.stTrans.remove(seleccion[i]);
                }
                if (_this.stTrans.getCount() == 0) {
                    _this.btnElimTrans.setDisabled(true);
                }
            }
        });
        this.tbTrans = new LOG.util.UIManager.initToolbar({
            items: [this.btnSelecTrans, this.btnElimTrans]
        });

        var gridTrans = LOG.util.UIManager.initGrid(cmTrans, _this.stTrans, smTrans, {
            tbar: this.tbTrans,
            height:180,
            bbar: null,
            expanded: clsTrans.expanded

        });


        this.fsSelecTrans = new Ext.form.FieldSet({ //fieldset Seleccionar Suministrador
            title: _this.idioma.fsSelecTrans,
            style: '-moz-border-radius:5px;',
            labelAlign: 'top',
            autoHeight:true,
            items: [gridTrans]
        });

        /*------------Fieldset Tipo de Documento---------------*/

        this.gridTipoDoc = new Ext.erp.ventanaTipoDoc({bbarVisible:false});
        this.gridTipoDoc.init();

        this.fsSelecTipoDoc = new Ext.form.FieldSet({ //fieldset Seleccionar Documento
            title: _this.idioma.fsSelecTipoDoc,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight: true,
            items: [this.gridTipoDoc.view()]
        });

        this.clsGeneral = LOG.util.UIManager.initColumnForm({ //columnForm General
            columnas: 2
        });
        this.clsGeneral.addComponent(this.fsRangoFecha);
        this.clsGeneral.addComponent(this.fsSelecTipoDoc);
        this.clsGeneral.addComponent(this.fsSelecCliente);
        this.clsGeneral.addComponent(this.fsSelecTrans);
        this.clsGeneral.getColumn(0).columnWidth = 0.4;
        this.clsGeneral.getColumn(1).columnWidth = 0.6;
        this.clsGeneral.anchor = '101.3%';

        this.fpCentral = LOG.util.UIManager.initForm({ //formulario General
            id:'formularioCentralDocEmitidos',
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
                bbar: [this.listaBotonesDeposito.getArray()]
            },
            this.fpCentral
        ];

        Ext.erp.docemitidosrecibidos.superclass.constructor.call(this, config);

    },
    existsRecord: function (store, record) {
        var flags = false;
        Ext.each(store.data.items, function (nRecord, index) {
            if (store.idItem === 'diff') {
                if (nRecord.get('idproducto') === record.get('idproducto')) {
                    flags = true;
                }
            } else if (store.idItem === 'self') {
                if (nRecord.get('idclientesproveedores') === record.get('idclientesproveedores')) {
                    flags = true;
                }
            }
        });
        return flags;
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
    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addToolbarButtonDeposito: function (b, f) {
        this.listaBotonesDeposito.add(LOG.util.UIManager.reconfigureButton(b));
    },

    getReportes: function (_this) {
        var stringClientes = "";
        var stringTrans = "";
        var stringTipoDoc = "";
        var depositos = "";
        _this.entidades=[];
        _this.entidadesCheck=[];
        var selecciones = _this.gridTipoDoc.getGridPrincipal().getSelectionModel().getSelections();
        console.info(selecciones);
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

        for (var i = 0; i < _this.stTrans.data.items.length; i++) {
            if (i != _this.stTrans.data.items.length - 1) {
                stringTrans += _this.stTrans.data.items[i].data.idclientesproveedores + ",";
            } else {
                stringTrans += _this.stTrans.data.items[i].data.idclientesproveedores + "";
            }
        }
        stringTrans = "{" + stringTrans + "}";
        if(stringTrans== "{}") {
            stringTrans = null;
        }

        for (var i = 0; i < selecciones.length; i++) {
            if (i != selecciones.length - 1) {
                stringTipoDoc += selecciones[i].json.iddocumentos + ",";
            } else {
                stringTipoDoc += selecciones[i].json.iddocumentos + "";
            }
        }
        stringTipoDoc = "{" + stringTipoDoc + "}";
        if(stringTipoDoc== "{}") {
            stringTipoDoc = null;
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
                depositos = "*";
            }
        } else {
            depositos = "*";
        }
        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/inventario/recuperaciones/DocumentosEmitidosRecibidos',
                    name: 'DocumentosEmitidosRecibidosListado', 
                    isList:true,
                    params: {
                        fechainicio: (_this.dfDesde.getValue()) ? _this.dfDesde.getValue().format('d-m-Y') : null,
                        fechafin: (_this.dfHasta.getValue()) ? _this.dfHasta.getValue().format('d-m-Y') : null,
                        arraydeposito: depositos,
                        arraycliente: stringClientes,
                        arraytransportador: stringTrans,
                        arraydocumento: stringTipoDoc,
                        idsubsistema:_this.gridTipoDoc.storePrincipal.reader.jsonData.idsubsistema,
                        idestructura: idEntidad,
                        monedacontable : monedacontable || null,
                        monedaalternativa : monedaalternativa || null,
                        start : 0,
                        limit : null
                    }

                }
            ]
        });
        this.tipoReportes.view();
    },
    btnLimpiar: function(){
        var _this=this;
        _this.dfDesde.setValue(null);
        _this.dfHasta.setValue(null);
        _this.dfDesde.setMaxValue(null);
        _this.dfHasta.setMinValue(null);
        _this.stCliente.removeAll();
        _this.stTrans.removeAll();
		_this.gridTipoDoc.getGridPrincipal().getSelectionModel().clearSelections();
        _this.comboDepositos.clearValue();
    }
});

/*-----------ventana de seleccion de clientes y suministradores---------------*/

Ext.erp.ventanaClientesSumin = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;

        this.idioma = log.inv.docemitidosrecibidos.Idioma;
        config.modoSeleccion = 3;
        config.autoLoad = false;
        config.autoSelect = false;
        config.busquedaBasica = true;
        /*config.urlBusquedaGridPrincipal = 'cargarClientesProveedores';
        this.dirController = '/logistica/inventario/recuperaciones/index.php/docemitidosrecibidos';*/
        this.dirController =  '/logistica/utiles/plugin/index.php/sistemasexternos';
        config.formaVisualizacion = 'ventana';
        config = Ext.apply(_this, config);
        Ext.erp.ventanaClientesSumin.superclass.constructor.call(this, config);
        _this.concepto = this.idioma.clientes;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimpleC;


    },
    init: function () {
        var _this = this;
        Ext.erp.ventanaClientesSumin.superclass.init.call(this);
        _this.getVistaPrincipal().width = 500;
        _this.getVistaPrincipal().height = 400;
        _this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).disable();
    },
    initDefaultColumns: function () {
        var _this = this;

    },
    render: function () {
        var _this = this;
        var p = Ext.erp.ventanaClientesSumin.superclass.render.call(this);
        /* Ext.Ajax.request({
             url: '/logistica/inventario/recuperaciones/index.php/docemitidosrecibidos/cargarClientesProveedores',
             params: {
                 cliente: _this.cliente
             },
             method: 'POST'
         });*/

        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                st.baseParams.cliente = _this.cliente;
                st.baseParams.criterio = st.baseParams.criterio;
                st.baseParams.start = 0;
                st.baseParams.limit = 30;
            }
        });
        return p;
    }
});

/*---------------template Tipo Doc----------------*/

Ext.erp.ventanaTipoDoc = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma = log.inv.docemitidosrecibidos.Idioma;
        config.dirController = '/logistica/inventario/recuperaciones/index.php/docemitidosrecibidos';
        config.urlBusquedaGridPrincipal = 'cargarTipoDoc';
        config.modoSeleccion = 3;
        config.autoSelect = false;
        //config.autoLoad = true;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'panel';
        config = Ext.apply(_this, config);
        Ext.erp.ventanaTipoDoc.superclass.constructor.call(this, config);
        _this.concepto = this.idioma.tipoDoc;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimple;


    },
    init: function () {
        var _this = this;
        Ext.erp.ventanaTipoDoc.superclass.init.call(this);
        _this.getVistaPrincipal().width = '100%';
        _this.getVistaPrincipal().height = 254;

    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: _this.idioma.gcDocumento,
            width: 250,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'iddoc'
        });

    },
    render: function () {
        var _this = this;
        var p = Ext.erp.ventanaTipoDoc.superclass.render.call(this);
        /*_this.storePrincipal.load();
        _this.storePrincipal.on({
            'beforeload': function (st) {
                _this.getGridPrincipal().getSelectionModel().clearSelections()
            }
        });*/
        return p;
    }
});
