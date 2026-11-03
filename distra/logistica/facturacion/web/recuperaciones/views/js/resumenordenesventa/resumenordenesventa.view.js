Ext.ns('Ext.erp.resumenordenesventa');
Ext.erp.resumenordenesventa = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.idioma = LOG.util.UIManager.apply(LOG.fac.Recuperaciones.Idioma, log.fac.resumenordenesventa.Idioma);
        this.dirController = '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/';

        /*------------Barra con botones---------------*/
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.listaBotonesDeposito = new LOG.util.List();
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttBtnImprimir,
            text: _this.idioma.btnImprimir,
            handler: function () {
                _this.getReportes(_this)
            },
            controlFn: function (b, _caller) {
                //if (_caller.grantedAction('RB')) {
                    //b.setVisible(true);
                    b.disable();
                LOG.util.UIManager.encadenaFn(_this.gdClientePlazo.storePrincipal, 'fireEvent', function (e, st, rd) {
                    if (e == 'add') {
                        _this.listaBotonesVentanaToolbar.arrayData[0].enable();
                    }
                    if (e == 'remove') {
                        if (st.data.length > 0) {
                            _this.listaBotonesVentanaToolbar.arrayData[0].enable();
                        } else {
                            _this.listaBotonesVentanaToolbar.arrayData[0].disable();
                        }
                    }

                }, 'WINCLIENTES');
                    /*LOG.util.UIManager.encadenaFn(_this.gdProducto.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 || _this.dfDesde.getValue() || _this.dfHasta.getValue()) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        } else {
                            b.disable();
                        }
                    });*/
                //} else {
                   // b.setVisible(false);
               // }
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
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({id:'idResumenOrdenesVenta'}));

        this.addToolbarButtonDeposito('->');

        this.comboOperaciones = new LOG.util.LovCombo({ //---combobox Tipo de producto
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            hiddenName: 'subsistema',
            editable: false,
            url: '/logistica/facturacion/facturacion/factura/index.php/gestionarfactura/cargarSubsistemas',
            listeners: {
                select: function(cmb, rd) {
                    _this.idsubsistema = rd.json.idsubsistema;
                    if (_this.idsubsistema != 10) {
                        _this.comboDepositos.disable();
                        _this.comboDepositos.clearValue();
                    } else {
                        _this.comboDepositos.enable();
                    }
                }
            }
        });

        this.comboDepositos = new LOG.util.LovCombo({//---combobox Tipo de producto
            url: '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/cargardepositos',
            valueField: 'iddeposito',
            displayField: 'deposito',
            hiddenName: 'deposito',
            mode: 'remote',
            disabled: true,
            editable: false,
            listeners: {
                'select': function (df, value) {
                        _this.listaBotonesVentanaToolbar.arrayData[0].enable();
                }
            }
        });
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbOperaciones
        }));
        this.addToolbarButtonDeposito(' ');
        this.addToolbarButtonDeposito(this.comboOperaciones);
        this.addToolbarButtonDeposito('-');
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbDepositos
        }));
        this.addToolbarButtonDeposito(this.comboDepositos);


        /*--------------Fieldset RangoFecha-----------------*/
        this.dfDesde = new Ext.form.DateField({ //---datefield Desde
            fieldLabel: _this.idioma.dfDesdeDoc,
            name: 'iddesderesumen',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'iddesderesumen',
            endDateField: 'idhastaresumen',
            editable: false,
            listeners: {
                'select': function (df, value) {
                    if (value && _this.comboDepositos.getValue())
                        _this.listaBotonesVentanaToolbar.arrayData[0].enable();
                }
            }
        });
        this.dfHasta = new Ext.form.DateField({ //---datefield Hasta
            fieldLabel: _this.idioma.dfHastaDoc,
            name: 'idhastaresumen',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'idhastaresumen',
            startDateField: 'iddesderesumen',
            editable: false,
            listeners: {
                'select': function (df, value) {
                    if (value && _this.comboDepositos.getValue())
                        _this.listaBotonesVentanaToolbar.arrayData[0].enable();
                }
            }
        });
        this.dfDesde.endDateField = this.dfHasta.id; //-------validacion de fecha
        this.dfHasta.startDateField = this.dfDesde.id;

        this.clsFecha = LOG.util.UIManager.initColumnForm({ //columnForm de la fecha
            columnas: 3
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

        /*--------------Fieldset Clientes-----------------*/
        this.fsClientePlazo = new Ext.form.FieldSet({
            layout: 'border',
            region: 'center',
            title: this.idioma.fsSelecCliente,
            //height: 220
        });
        this.gdClientePlazo = new LOG.fac.Recuperaciones.gdGeneric({
            idioma: this.idioma,
            region: 'center',
            type: 'clientes',
            tltWinAdd: this.idioma.ttWinAddCliente,
            header: this.idioma.gcCliente,
            ttBtnAdd: this.idioma.ttAddClient,
            ttBtnDel: this.idioma.ttElimClient,
            idItem:'cliente'
        });
        this.btnSelecClientePlazo = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnAdicionar,
            tooltip: _this.idioma.ttAddSumin,
            iconCls: 'adicionar',
            handler: function () {
                _this.recordClientesPlazo = _this.gdClientePlazo.storePrincipal.data.items;
                var idclientes = [];

                Ext.each(_this.recordClientesPlazo, function (rec) {
                    if (rec.data.idclientesproveedores) {
                        idclientes.push(rec.data.idclientesproveedores);
                    }
                });

                var ventanaClientes = new Ext.erp.ventanaClientes({
                    idclientesproveedores: Ext.encode(idclientes),
                    tipocliente: 'cliente',
                    concepto: 'cliente(s)',
                    urlBusquedaGridPrincipal: 'cargarClientesProveedores',
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
                ventanaClientes.init();

                ventanaClientes.getVistaPrincipal().title = _this.idioma.tlventanaClientes;
                ventanaClientes.view();
                ventanaClientes.getGridPrincipal().store.load();
                var botonAceptar = ventanaClientes.getVistaPrincipal().listaBotones.getItem(2);

                /* ventanaClientes.getGridPrincipal().getSelectionModel().on({
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
                 });*/
                botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
                    var records = ventanaClientes.getGridPrincipal().getSelectionModel().getSelections();
                    _this.addRecords(_this.gdClientePlazo.storePrincipal, records);

                });


            }
        });
        this.btnElimClientePlazo = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnEliminar,
            tooltip:  _this.idioma.ttElimSumin,
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                var seleccion = [];
                Ext.each(_this.gdClientePlazo.smGridPrincipal.selections.items, function(otro){
                    seleccion.push(otro);
                });
                Ext.each(seleccion, function(selected){
                    _this.gdClientePlazo.storePrincipal.remove(selected);
                });
                if (_this.gdClientePlazo.storePrincipal.getCount() == 0) {
                    _this.btnElimClientePlazo.setDisabled(true);
                }
            }
        });
        this.gdClientePlazo.addToolbarButton(this.btnSelecClientePlazo);
        this.gdClientePlazo.addToolbarButton(this.btnElimClientePlazo);
        this.gdClientePlazo.init();
        this.fsClientePlazo.add(this.gdClientePlazo.view());

        /* *//*--------------Fieldset Productos-----------------*//*
        this.fsProducto = new Ext.form.FieldSet({
            layout: 'border',
            title: this.idioma.fsSelecProducto,
            height: 220
        });
        this.gdProducto = new LOG.fac.Recuperaciones.gdGeneric({
            idioma: this.idioma,
            type: 'productos',
            tltWinAdd: this.idioma.ttWinAddProductos,
            header: this.idioma.gcProducto,
            ttBtnAdd: this.idioma.ttAddProduct,
            ttBtnDel: this.idioma.ttElimProduct,
            idItem:'producto'
        });

        this.btnSelecProd = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnAdicionar,
            iconCls: 'adicionar',
            tooltip:  _this.idioma.ttAddProd,
            handler: function () {
                LOG.inv.maestroproductos.Loader.init(function () {
                    var params = _this.collectRecords();
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
                            _this.gdProducto.storePrincipal.on({
                                'add':function(store,r,i){
                                    LOG.util.UIManager.apply(self.parametros,_this.collectRecords());
                                    self.panelProductos.getStorePrincipal().reload();
                                }
                            });

                            LOG.util.UIManager.apply(this.parametros,_this.collectRecords());
                            _this.gdProducto.storePrincipal.add(record);
                            if(_this.gdProducto.storePrincipal.length > 0){
                                this.close();
                            }
                        }
                    });
                    v.show();
                });
                *//*var winProductos = new LOG.lb.producto.View({
                    idioma: _this.idioma,
                    _parent: _this,
                    parametros: {
                        idestructura: _this.comboDepositos.getValue()
                    },
                    doAction: function (i) {
                        var record = winProductos.getGridPrincipal().getSelectionModel().getSelections();
                        _this.addRecords(_this.gdProducto.storePrincipal, record);

                    }
                });
                winProductos.init();
                winProductos.busquedaAvanzada = false;
                winProductos.getVistaPrincipal().buttons[1].setVisible(false);
                winProductos.getVistaPrincipal().width = 750;
                winProductos.getVistaPrincipal().height = 350;
                _this.vistaProductos = winProductos.view();
                _this.vistaProductos.show();*//*

            }
        });
        this.btnElimProd = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnEliminar,
            iconCls: 'eliminar',
            tooltip:  _this.idioma.ttElimProd,
            disabled: true,
            handler: function () {
                var seleccion = [];
                Ext.each(_this.gdProducto.smGridPrincipal.selections.items, function(otro){
                    seleccion.push(otro);
                });
                Ext.each(seleccion, function(selected){
                    _this.gdProducto.storePrincipal.remove(selected);
                });
                if (_this.gdProducto.storePrincipal.getCount() == 0) {
                    _this.btnElimProd.setDisabled(true);
                }
            }

        });
        this.gdProducto.addToolbarButton(this.btnSelecProd);
        this.gdProducto.addToolbarButton(this.btnElimProd);
        this.gdProducto.init();
        this.fsProducto.add(this.gdProducto.view());


        *//*--------------Fieldset Transportadores-----------------*//*
        this.fsTrans = new Ext.form.FieldSet({
            layout: 'border',
            title: this.idioma.fsSelecTrans,
            height: 220
        });
        this.gdTrans = new LOG.fac.Recuperaciones.gdGeneric({
            idioma: this.idioma,
            tltWinAdd: this.idioma.tlventanaTrans,
            header: this.idioma.tlventanaTrans,
            ttBtnAdd: this.idioma.ttAddTrans,
            ttBtnDel: this.idioma.ttElimTrans,
            idItem:'cliente'
        });
        this.btnSelecTrans = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnAdicionar,
            tooltip: _this.idioma.ttAddTrans,
            iconCls: 'adicionar',
            handler: function () {
                _this.recordTrans = _this.gdTrans.storePrincipal.data.items;
                var idclientes = [];

                Ext.each(_this.recordTrans, function (rec) {
                    if (rec.data.idclientesproveedores) {
                        idclientes.push(rec.data.idclientesproveedores);
                    }
                });
                var ventanaClientes = new Ext.erp.ventanaClientes({
                    idclientesproveedores: Ext.encode(idclientes),
                    tipocliente: 'proveedor',
                    concepto: 'transportador(es)',
                    urlBusquedaGridPrincipal: 'cargarClientesProveedores',
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
                ventanaClientes.init();

                ventanaClientes.getVistaPrincipal().title = _this.idioma.tlventanaTrans;
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
                    _this.addRecords(_this.gdTrans.storePrincipal, records);

                });


            }
        });
        this.btnElimTrans = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnEliminar,
            tooltip:  _this.idioma.ttElimTrans,
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                var seleccion = [];
                Ext.each(_this.gdTrans.smGridPrincipal.selections.items, function(otro){
                    seleccion.push(otro);
                });
                Ext.each(seleccion, function(selected){
                    _this.gdTrans.storePrincipal.remove(selected);
                });
                if (_this.gdTrans.storePrincipal.getCount() == 0) {
                    _this.btnElimTrans.setDisabled(true);
                }
            }
        });
        this.gdTrans.addToolbarButton(this.btnSelecTrans);
        this.gdTrans.addToolbarButton(this.btnElimTrans);
        this.gdTrans.init();
        this.fsTrans.add(this.gdTrans.view());

        *//*--------------Fieldset Servicios-----------------*//*
        this.fsServ = new Ext.form.FieldSet({
            layout: 'border',
            title: this.idioma.fsSelecServ,
            height: 220
        });
        this.gdServ = new LOG.fac.Recuperaciones.gdGeneric({
            idioma: this.idioma,
            tltWinAdd: this.idioma.tlventanaServ,
            header: this.idioma.tlventanaServ,
            ttBtnAdd: this.idioma.ttAddServ,
            ttBtnDel: this.idioma.ttElimServ,
            idItem:'servicio',
            type:'servicios'
        });
        this.btnSelecServ = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnAdicionar,
            tooltip: _this.idioma.ttAddServ,
            iconCls: 'adicionar',
            handler: function () {
                _this.recordServ = _this.gdServ.storePrincipal.data.items;
                var idServSeleccionados = [];

                Ext.each(_this.recordServ, function (rec) {
                    if (rec.data.idindicador) {
                        idServSeleccionados.push(rec.data.idindicador);
                    } else {
                        idServSeleccionados.push(rec.data.idactividad);
                    }
                });

                _this.windowSA = new Ext.erp.winServActv({
                    idioma: _this.idioma
                });
                _this.windowSA.addTabToTemplete(new Ext.erp.GridServActiv({
                    idioma: _this.idioma,
                    title: _this.idioma.tlServiciosNomenclador,
                    idComponent: 0,
                    concepto: _this.idioma.conceptoServicios,
                    idseleccionados: (idServSeleccionados.length) ?Ext.encode(idServSeleccionados):null,
                    textBusquedaSimple: _this.idioma.fdCriterio
                }));
                _this.windowSA.addTabToTemplete(new Ext.erp.GridServActiv({
                    idioma: _this.idioma,
                    title: _this.idioma.tlActividades,
                    idComponent: 1,
                    concepto: _this.idioma.conceptoActividades,
                    idseleccionados: (idServSeleccionados.length) ?Ext.encode(idServSeleccionados):null,
                    textBusquedaSimple: _this.idioma.fdCriterio
                }));
                _this.windowSA.init();

                _this.winAddDocumento = _this.windowSA.view({
                    title: _this.idioma.tlVentanaServicios,
                    width: 800,
                    height: 400,
                    constrain: true
                });
                _this.winAddDocumento.show();
                _this.windowSA.on({
                    'tabchange': function() {
                        var tab = _this.windowSA.getSelectedTabIndex();
                        var selecServ = _this.windowSA.getTemplateByIndex(0).getSmPrincipal().getSelections();
                        var selecAct = _this.windowSA.getTemplateByIndex(1).getSmPrincipal().getSelections();

                        if (tab == 0 && selecServ.length > 0){
                            _this.winAddDocumento.listaBotones.arrayData[1].enable()
                        }
                        if (tab == 1 && selecAct.length > 0){
                            _this.winAddDocumento.listaBotones.arrayData[1].enable()
                        }
                    }
                });
                _this.winAddDocumento.listaBotones.arrayData[1].hide();
                _this.winAddDocumento.listaBotones.arrayData[2].disable();
                _this.windowSA.getTemplateByIndex(0).getGridPrincipal().getSelectionModel().on('selectionchange', function(sm) {
                    if(sm.getSelections().length > 0){
                        _this.winAddDocumento.listaBotones.arrayData[1].enable();
                        _this.winAddDocumento.listaBotones.arrayData[2].enable();
                    }else{
                        _this.winAddDocumento.listaBotones.arrayData[1].disable();
                        _this.winAddDocumento.listaBotones.arrayData[2].disable();
                    }
                });
                _this.windowSA.getTemplateByIndex(1).getGridPrincipal().getSelectionModel().on('selectionchange', function(sm) {
                    if(sm.getSelections().length > 0){
                        _this.winAddDocumento.listaBotones.arrayData[1].enable();
                        _this.winAddDocumento.listaBotones.arrayData[2].enable();
                    }else{
                        _this.winAddDocumento.listaBotones.arrayData[1].disable();
                        _this.winAddDocumento.listaBotones.arrayData[2].disable();
                    }
                });

                _this.winAddDocumento.aceptarFn = function() {
                    var seleccionServicios = _this.windowSA.getTemplateByIndex(0).getSmPrincipal().getSelections();
                    var seleccionActividades = _this.windowSA.getTemplateByIndex(1).getSmPrincipal().getSelections();
                    if (_this.windowSA.getSelectedTabIndex() == 0 && seleccionServicios.length > 0) {
                        var record = [];
                        Ext.each(seleccionServicios, function (obj) {
                            record.push(obj);
                        });
                        _this.gdServ.storePrincipal.add(record);
                        this.close();
                    }
                    else if (_this.windowSA.getSelectedTabIndex() == 1 && seleccionActividades.length > 0) {
                        var record = [];
                        Ext.each(seleccionActividades, function (obj) {

                            record.push(obj);
                        });
                        _this.gdServ.storePrincipal.add(record);
                        this.close();
                    }
                };

            }
        });
        this.btnElimServ = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnEliminar,
            tooltip:  _this.idioma.ttElimServ,
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                var seleccion = [];
                Ext.each(_this.gdServ.smGridPrincipal.selections.items, function(otro){
                    seleccion.push(otro);
                });
                Ext.each(seleccion, function(selected){
                    _this.gdServ.storePrincipal.remove(selected);
                });
                if (_this.gdServ.storePrincipal.getCount() == 0) {
                    _this.btnElimServ.setDisabled(true);
                }
            }
        });
        this.gdServ.addToolbarButton(this.btnSelecServ);
        this.gdServ.addToolbarButton(this.btnElimServ);
        this.gdServ.init();
        this.fsServ.add(this.gdServ.view());*/

        this.clsGeneralPlazo = LOG.util.UIManager.initColumnForm({ //columnForm General
            columnas: 2,
            height: 100,
            region: 'north'
        });
        this.clsGeneralPlazo.addComponent(this.fsRangoFecha);

        this.fpCentralPlazo = LOG.util.UIManager.initPanel({ //formulario General
            id:'formularioCentralResumenOrdenesVentas',
            region: 'center',
            layout: 'border',
            items: [this.clsGeneralPlazo, this.fsClientePlazo]
        });

        this.fpNortePlazo = LOG.util.UIManager.initPanel({ //formulario General
            id:'formularioCentralFacturasPlazo',
            region: 'center',
            layout: 'border',
            items: [this.fpCentralPlazo]
        });
        /* -------configuracion de la vista---------*/
        config.layout = 'border';
        config.items = [
            {
                region: 'north',
                tbar: [this.listaBotonesVentanaToolbar.getArray()],
                bbar: [this.listaBotonesDeposito.getArray()]
            },
            this.fpNortePlazo
        ];

        Ext.erp.resumenordenesventa.superclass.constructor.call(this, config);

        this.listaBotonesVentanaToolbar.each(function(b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
    },
    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addToolbarButtonDeposito: function (b, f) {
        this.listaBotonesDeposito.add(LOG.util.UIManager.reconfigureButton(b));
    },
    arrayToString: function(store) {
        var stringGeneric = "";
        for (var i = 0; i < store.data.items.length; i++) {
            if (i != store.data.items.length - 1) {
                stringGeneric += (store.data.items[i].data.idclientesproveedores )? store.data.items[i].data.idclientesproveedores + "," : store.data.items[i].data.idindicador + ",";
            } else {
                stringGeneric += (store.data.items[i].data.idclientesproveedores )? store.data.items[i].data.idclientesproveedores + "" : store.data.items[i].data.idindicador + "";
            }
        }
        stringGeneric = "{" + stringGeneric + "}";
        if(stringGeneric== "{}") {
            stringGeneric = null;
        }
        return stringGeneric;
    },
    getReportes: function (_this) {
        var depositos = "";
        _this.entidades=[];
        _this.entidadesCheck=[];
        if(this.comboDepositos.view && this.comboDepositos.getValue()){
            for(var i=0; i < this.comboDepositos.view.store.data.items.length; i++) {
                if (this.comboDepositos.view.store.data.items[i].data.checked) {
                    _this.entidadesCheck.push(this.comboDepositos.view.store.data.items[i].data.iddeposito);
                }
                _this.entidades.push(_this.comboDepositos.view.store.data.items[i].data.iddeposito);
            }
            if(_this.entidadesCheck.length > 0){
                depositos = "{" + _this.entidadesCheck.join() + "}";
                //depositos =  _this.entidadesCheck.join();
            }
            else{
                //    depositos = "{" + _this.entidades.join() + "}";
                depositos = null;
            }
        } else{
            for(var i=0; i < this.comboDepositos.store.data.items.length; i++) {
                _this.entidades.push(_this.comboDepositos.store.data.items[i].data.iddeposito);
            }
            //depositos = "{" + _this.entidades.join() + "}";
            depositos = null;
        }
        var cadenaIdsT = "";
        var cadenaIdsC = "";
        var cadenaFinal = "";
        /*for (var i = 0; i < _this.gdTrans.storePrincipal.data.items.length; i++) {
            if (i != _this.gdTrans.storePrincipal.data.items.length - 1) {
                cadenaIdsT += _this.gdTrans.storePrincipal.data.items[i].data.idclientesproveedores + "," ;
            } else {
                cadenaIdsT += _this.gdTrans.storePrincipal.data.items[i].data.idclientesproveedores + "" ;
            }
        }*/
        for (var i = 0; i < _this.gdClientePlazo.storePrincipal.data.items.length; i++) {
            if (i != _this.gdClientePlazo.storePrincipal.data.items.length - 1) {
                cadenaIdsC += _this.gdClientePlazo.storePrincipal.data.items[i].data.idclientesproveedores + "," ;
            } else {
                cadenaIdsC += _this.gdClientePlazo.storePrincipal.data.items[i].data.idclientesproveedores + "" ;
            }
        }

        if(cadenaIdsC && cadenaIdsT)
        {
            cadenaFinal +=  cadenaIdsC+",";
        }else if (cadenaIdsC && !cadenaIdsT)
        {
            cadenaFinal +=  cadenaIdsC;
        }
        if(cadenaIdsT)
        {
            cadenaFinal += cadenaIdsT;
        }
        cadenaFinal="{"+ cadenaFinal +"}"
        if(cadenaFinal== "{}") {
            cadenaFinal = null;
        }

        this.tipoReportes =  new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/facturacion/encomil/ResumenOrdenesVentaModel',
                    isList: true,
                    params: {
                        fechainicio: (_this.dfDesde.getValue()) ? _this.dfDesde.getValue().format('d-m-Y') : null,
                        fechafin: (_this.dfHasta.getValue()) ? _this.dfHasta.getValue().format('d-m-Y') : null,
                        idestructura: idEntidad,
                        //arrayidnomoperaciones: (_this.comboOperaciones.getValue())? "{" + _this.comboOperaciones.getValue() + "}": null,
                        idnomoperaciones: (_this.comboOperaciones.getValue()) ? _this.comboOperaciones.getValue() : null,
                        /*arrayproducto: _this.arrayToString(_this.gdProducto.storePrincipal),
                        arrayservicio: _this.arrayToString(_this.gdServ.storePrincipal),*/
                        arraycliente: cadenaFinal,
                        arraydeposito: depositos,
                    }

                }
            ]
        });
        this.tipoReportes.view();
    },
    collectRecords: function() {
        /*var _this = this;
        _this.recordProd = _this.gdProducto.storePrincipal.data.items;
        var idProdSeleccionados = [];
        var parametros = {};

        Ext.each(_this.recordProd, function (rec) {
            if (rec.data.idindicador) {
                idProdSeleccionados.push(rec.data.idindicador);
            }
        });
        parametros.idseleccionados = Ext.encode(idProdSeleccionados);
        return parametros;*/
    },
    btnLimpiar: function() {
        var _this=this;
        _this.dfDesde.setValue(null);
        _this.dfHasta.setValue(null);
        _this.dfDesde.setMaxValue(null);
        _this.dfHasta.setMinValue(null);
        _this.comboDepositos.clearValue();
        _this.comboDepositos.disable();
        _this.comboOperaciones.clearValue();
    },
    addRecords: function (store, records) {
        var _this = this;
        Ext.each(records, function (record, index) {
            if (!_this.existsRecord(store, record)) {
                var recordType;
                if (store.idItem === 'producto') {
                    recordType = new store.recordType({
                        idproducto: record.get('idproducto'),
                        codigoproveedor: record.get('codigoproveedor'),
                        codigo: record.get('codigo'),
                        denominacion: record.get('denominacion')
                    });
                } else if (store.idItem === 'cliente') {
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
            if (store.idItem === 'producto') {
                if ( nRecord.get('idproducto') === record.get('idproducto')) {
                    flags = true;
                }
            }
        });
        return flags;
    }
});
