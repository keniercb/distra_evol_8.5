Ext.ns('Ext.erp.ofertasrealizadas');
Ext.erp.ofertasrealizadas = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    idioma: undefined,

    constructor: function (config) {
        var _this =this;
        this.frame = true;
        this.idioma = LOG.util.UIManager.apply(LOG.fac.Recuperaciones.Idioma, log.fac.ofertasrealizadas.Idioma);
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
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({id:'idOfertasRealizadas'}));

        this.addToolbarButtonDeposito('->');
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbOperaciones
        }));
        this.comboDepositos = new LOG.util.ComboBox({ //---combobox Tipo de producto
            valueField: 'iddeposito',
            displayField: 'deposito',
            hiddenName: 'deposito',
            editable: false,
            autoLoad:false,
            url: '/logistica/facturacion/facturacion/recuperaciones/index.php/recuperaciones/cargardepositos'
        });

        this.comboOperaciones = new LOG.util.LovCombo({ //---combobox Tipo de producto
            valueField: 'idnomoperaciones',
            displayField: 'denominacion',
            hiddenName: 'subsistema',
            editable: false,
            autoLoad:false,
            url:  '/logistica/facturacion/facturacion/factura/index.php/gestionarfactura/cargarSubsistemas'
        });
        this.cmbEstructuras = new LOG.util.LovCombo({
            fieldLabel: 'Entidades',
            url:'getEstructuras',
            name:'idestructura',
            displayField : 'denominacion',
            valueField : 'idestructura',
            minChars:3,
            resizable:true,
            hidden: (!_this.grantedAction('REntidades')) ? true : false
        });

        this.addToolbarButtonDeposito(this.comboOperaciones);
        this.addToolbarButtonDeposito('-');
        this.addToolbarButtonDeposito(new Ext.form.Label({
            text: _this.idioma.cbEstructuras
        }));
        this.addToolbarButtonDeposito(this.cmbEstructuras);



        /*--------------Fieldset RangoFecha-----------------*/
        this.dfDesde = new Ext.form.DateField({ //---datefield Desde
            fieldLabel: _this.idioma.dfDesdeDoc,
            name: 'desdedoc',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeOfertas',
            endDateField: 'hastaOfertas',
            editable: false
        });
        this.dfHasta = new Ext.form.DateField({ //---datefield Hasta
            fieldLabel: _this.idioma.dfHastaDoc,
            name: 'hastadoc',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaOfertas',
            startDateField: 'desdeOfertas',
            editable: false
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
        this.fsCliente = new Ext.form.FieldSet({
            layout: 'border',
            title: this.idioma.fsSelecCliente,
            height: 220
        });
        this.gdCliente = new LOG.fac.Recuperaciones.gdGeneric({
            idioma: this.idioma,
            tltWinAdd: this.idioma.ttWinAddCliente,
            header: this.idioma.gcCliente,
            ttBtnAdd: this.idioma.ttAddClient,
            ttBtnDel: this.idioma.ttElimClient,
            idItem:'cliente'
        });
        this.btnSelecCliente = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnAdicionar,
            tooltip: _this.idioma.ttAddSumin,
            iconCls: 'adicionar',
            handler: function () {
                _this.recordClientes = _this.gdCliente.storePrincipal.data.items;
                var idclientes = [];

                Ext.each(_this.recordClientes, function (rec) {
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
                    _this.addRecords(_this.gdCliente.storePrincipal, records);

                });

            }
        });
        this.btnElimCliente = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnEliminar,
            tooltip:  _this.idioma.ttElimSumin,
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                var seleccion = [];
                Ext.each(_this.gdCliente.smGridPrincipal.selections.items, function(otro){
                    seleccion.push(otro);
                });
                Ext.each(seleccion, function(selected){
                    _this.gdCliente.storePrincipal.remove(selected);
                });
                if (_this.gdCliente.storePrincipal.getCount() == 0) {
                    _this.btnElimCliente.setDisabled(true);
                }
            }
        });
        this.gdCliente.addToolbarButton(this.btnSelecCliente);
        this.gdCliente.addToolbarButton(this.btnElimCliente);
        this.gdCliente.init();
        this.fsCliente.add(this.gdCliente.view());

        /*--------------Fieldset Organismos-----------------*/
        this.fsOrganismo = new Ext.form.FieldSet({
            layout: 'border',
            title: this.idioma.fsSelecOrganismo,
            height: 220
        });

        this.gdOrganismo = new LOG.fac.Recuperaciones.gdGeneric({
            idioma: this.idioma,
            tltWinAdd: this.idioma.ttWinAddOrganimso,
            header: this.idioma.gcOrganismo,
            ttBtnAdd: this.idioma.ttAddOrganismo,
            ttBtnDel: this.idioma.ttElimOrganismo,
            idItem:'idorganismo',
        });

        this.btnSelecOrganismo = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnAdicionar,
            tooltip: _this.idioma.ttAddOrganismo,
            iconCls: 'adicionar',
            handler: function () {
                // _this.recordOrganismo = _this.gdOrganismo.storePrincipal.data.items;
                // var idorganismos = [];

                // Ext.each(_this.recordOrganismo, function (rec) {
                //     if (rec.data.idorganismos) {
                //         idorganismos.push(rec.data.idorganismos);
                //     }
                // });

                var ventanaOrganismos = new Ext.erp.ventanaClientes({
                   // idorganismos: Ext.encode(idorganismos),
                    tipoorganismo: 'organismo',
                    concepto: 'organismo(s)',
                    urlBusquedaGridPrincipal: 'cargaroganismos',
                    initDefaultColumns: function(){
                         this.addGridColumn({
                            width: 200,
                            dataIndex: 'idorganismo',
                            default: true,
                            hidden: true,
                        });
                        this.addGridColumn({
                            header: _this.idioma.gcOrganismo,
                            width: 200,
                            dataIndex: 'nombre',
                            default: true
                        });
                       
                    }
                });
                ventanaOrganismos.init();
                ventanaOrganismos.getVistaPrincipal().title = _this.idioma.tlventanaOrganismos;
                ventanaOrganismos.view();
                ventanaOrganismos.getGridPrincipal().store.load();
                var botonAceptar = ventanaOrganismos.getVistaPrincipal().listaBotones.getItem(2);

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
                    var records = ventanaOrganismos.getGridPrincipal().getSelectionModel().getSelections();
                    _this.addRecords(_this.gdOrganismo.storePrincipal, records);
                });


            }
        });
        this.btnElimOrganismo = LOG.util.Prototipos.botonGeneral({
            text: _this.idioma.btnEliminar,
            tooltip:  _this.idioma.ttElimOrganismo,
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                var seleccion = [];
                Ext.each(_this.gdOrganismo.smGridPrincipal.selections.items, function(otro){
                    seleccion.push(otro);
                });
                Ext.each(seleccion, function(selected){
                    _this.gdOrganismo.storePrincipal.remove(selected);
                });
                if (_this.gdOrganismo.storePrincipal.getCount() == 0) {
                    _this.btnElimOrganismo.setDisabled(true);
                }
            }
        });
        this.gdOrganismo.addToolbarButton(this.btnSelecOrganismo);
        this.gdOrganismo.addToolbarButton(this.btnElimOrganismo);
        this.gdOrganismo.init();
        this.fsOrganismo.add(this.gdOrganismo.view());
        /*--------------Fieldset Usuario y estado de documento-----------------*/
        this.clsCriterioBusqueda = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        this.fsCriterioBusqueda = new Ext.form.FieldSet({
            title: this.idioma.fsCriterioBusqueda,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight:true,
            items: [this.clsCriterioBusqueda]
        });
        var data = [
            [ 1,LOG.lb.documento.Estado[1]],
            [ 2,LOG.lb.documento.Estado[2]],
            [ 3,LOG.lb.documento.Estado[3]],
           // [ 4,LOG.lb.documento.Estado[4]],
           //[ 7,LOG.lb.documento.Estado[7]],
            [ 10,LOG.lb.documento.Estado[10]],
        ];

        this.cmbEstado = new LOG.util.LovCombo({
            name: 'estado',
            fieldLabel: this.idioma.lbCbEstado,
            mode: 'local',
            forceSelection:true,
            emptyText:this.idioma.emptyTextCmb,
            valueField: 'idestado',
            displayField: 'estado',
            store:  new Ext.data.SimpleStore({
                fields: ['idestado','estado'],
                data: data
            }),
            width: 200
        });
        this.cmbUsuarios = new LOG.lb.documento.ComboUsuarios({
            fieldLabel: this.idioma.lbCbCreadoPor,
            campo: 'idusuario',
            emptyText:this.idioma.emptyTextCmb,
            alias: 'aperturaLog',
            subsistema: 10,
            hiddenName: 'idusuario'
        });
        this.clsCriterioBusqueda.addComponent(this.cmbUsuarios);
        this.clsCriterioBusqueda.addComponent(this.cmbEstado);
        this.fsCriterioBusqueda.add(this.clsCriterioBusqueda);

        /*--------------Fieldset Productos-----------------*/
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
                    var params = _this.collectRecords(_this.gdProducto.storePrincipal.data.items, 'producto');
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
                                    LOG.util.UIManager.apply(self.parametros,_this.collectRecords(_this.gdProducto.storePrincipal.data.items, 'producto'));
                                    self.panelProductos.getStorePrincipal().reload();
                                }
                            });

                            LOG.util.UIManager.apply(this.parametros,_this.collectRecords(_this.gdProducto.storePrincipal.data.items, 'producto'));
                            _this.gdProducto.storePrincipal.add(record);
                            if(_this.gdProducto.storePrincipal.length > 0){
                                this.close();
                            }
                        }
                    });
                    v.show();
                });

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


        /*--------------Fieldset Servicios-----------------*/
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
                /*_this.recordServ = _this.gdServ.storePrincipal.data.items;
                var idServSeleccionados = [];

                Ext.each(_this.recordServ, function (rec) {
                    if (rec.data.idindicador) {
                        idServSeleccionados.push(rec.data.idindicador);
                    } else {
                        idServSeleccionados.push(rec.data.idactividad);
                    }
                });*/

                var idServSeleccionados = _this.collectRecords(_this.gdServ.storePrincipal.data.items, 'servicio');
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
                /*_this.windowSA.addTabToTemplete(new Ext.erp.GridServActiv({
                    idioma: _this.idioma,
                    title: _this.idioma.tlActividades,
                    idComponent: 1,
                    concepto: _this.idioma.conceptoActividades,
                    idseleccionados: (idServSeleccionados.length) ?Ext.encode(idServSeleccionados):null,
                    textBusquedaSimple: _this.idioma.fdCriterio
                }));*/
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
                        //var selecAct = _this.windowSA.getTemplateByIndex(1).getSmPrincipal().getSelections();

                        if (tab == 0 && selecServ.length > 0){
                            _this.winAddDocumento.listaBotones.arrayData[1].enable()
                        }
                        /*if (tab == 1 && selecAct.length > 0){
                            _this.winAddDocumento.listaBotones.arrayData[1].enable()
                        }*/
                    }
                });
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
                /*_this.windowSA.getTemplateByIndex(1).getGridPrincipal().getSelectionModel().on('selectionchange', function(sm) {
                    if(sm.getSelections().length > 0){
                        _this.winAddDocumento.listaBotones.arrayData[1].enable();
                        _this.winAddDocumento.listaBotones.arrayData[2].enable();
                    }else{
                        _this.winAddDocumento.listaBotones.arrayData[1].disable();
                        _this.winAddDocumento.listaBotones.arrayData[2].disable();
                    }
                });*/
                _this.winAddDocumento.aceptarFn = function() {
                    var seleccionServicios = _this.windowSA.getTemplateByIndex(0).getSmPrincipal().getSelections();
                   // var seleccionActividades = _this.windowSA.getTemplateByIndex(1).getSmPrincipal().getSelections();
                    if (_this.windowSA.getSelectedTabIndex() == 0 && seleccionServicios.length > 0) {
                        var record = [];
                        Ext.each(seleccionServicios, function (obj) {
                            record.push(obj);
                        });
                        _this.gdServ.storePrincipal.on({
                            'add':function(store,r,i){
                                LOG.util.UIManager.apply(_this.windowSA.getActiveTemplate().idseleccionados,_this.collectRecords(_this.gdServ.storePrincipal.data.items, 'servicio'));
                                _this.windowSA.getActiveTemplate().getStorePrincipal().reload();
                            }
                        });

                        LOG.util.UIManager.apply(_this.windowSA.getActiveTemplate().idseleccionados,_this.collectRecords(_this.gdServ.storePrincipal.data.items, 'servicio'));
                        _this.gdServ.storePrincipal.add(record);
                        if(_this.gdServ.storePrincipal.length > 0){
                            this.close();
                        }
                    }
                    /*else if (_this.windowSA.getSelectedTabIndex() == 1 && seleccionActividades.length > 0) {
                        var record = [];
                        Ext.each(seleccionActividades, function (obj) {
                            for (var j = 0; j < _this.gdServ.storePrincipal.data.items.length; j++) {
                                if (_this.gdServ.storePrincipal.data.items[j].data.codigo == obj.data.codigo) {
                                    Ext.MessageBox.alert(_this.idioma.lbInformacion, _this.idioma.msgRedundancia);
                                }
                            }
                            record.push(obj);
                        });
                        _this.gdServ.storePrincipal.add(record);
                        this.close();
                    }*/
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
        this.fsServ.add(this.gdServ.view());


        /*-------------ColumnForm General----*/
        this.clsGeneral = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.clsGeneral.addComponent(this.fsRangoFecha);
        this.clsGeneral.addComponent(this.fsCriterioBusqueda);
        this.clsGeneral.addComponent(this.fsOrganismo);
        this.clsGeneral.addComponent(this.fsCliente);
        this.clsGeneral.addComponent(this.fsProducto);
        this.clsGeneral.addComponent(this.fsServ);

        this.clsGeneral.getColumn(0).columnWidth = 0.4;
        this.clsGeneral.getColumn(1).columnWidth = 0.6;
        this.clsGeneral.anchor = '101.3%';

        this.fpCentral = LOG.util.UIManager.initForm({ //formulario General
            id:'formularioCentralOfertas',
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
        Ext.erp.ofertasrealizadas.superclass.constructor.call(this, config);

        this.comboOperaciones.getStore().load({
            params:{oferta:1}
        });
    },
    ventanaServicios: function (a) {
        //var _this = this;
        alert(a)

    },
    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    addToolbarButtonDeposito: function (b, f) {
        this.listaBotonesDeposito.add(LOG.util.UIManager.reconfigureButton(b));
    },
    arrayToString: function(store){
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
        var cadenaIndicadores = "";
        for (var i = 0; i < _this.gdProducto.storePrincipal.data.items.length; i++) {
            if (i != _this.gdProducto.storePrincipal.data.items.length - 1) {
                cadenaIndicadores += _this.gdProducto.storePrincipal.data.items[i].data.idindicador + ",";
            } else {
                cadenaIndicadores += _this.gdProducto.storePrincipal.data.items[i].data.idindicador + "";
            }
        }
        for (var i = 0; i < _this.gdServ.storePrincipal.data.items.length; i++) {
            if (cadenaIndicadores == "") {
                cadenaIndicadores += _this.gdServ.storePrincipal.data.items[i].data.idindicador;
            } else {
                cadenaIndicadores += "," + _this.gdServ.storePrincipal.data.items[i].data.idindicador;
            }
        }
        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/facturacion/recuperaciones/OfertasRealizadas',
                    isList: true,
                    params: {
                        iddoc: iddocOfert,
                        fechainicio: (_this.dfDesde.getValue()) ? _this.dfDesde.getValue().format('d-m-Y') : null,
                        fechafin: (_this.dfHasta.getValue()) ? _this.dfHasta.getValue().format('d-m-Y') : null,
                        idestructuras : (_this.cmbEstructuras.getValue()) ? "{"+ _this.cmbEstructuras.getValue() +"}" : "{"+ idEntidad +"}",
                        //idestructura: idEntidad,
                        arrayidnomoperaciones: (_this.comboOperaciones.getValue()) ? "{" + _this.comboOperaciones.getValue() + "}" : null,
                        creadopor: (_this.cmbUsuarios.value) ? _this.cmbUsuarios.value : null,
                        arrayestado: (_this.cmbEstado.getValue()) ? "{" + _this.cmbEstado.getValue() + "}" : "{3}",
                        arrayidorganismo: _this.arrayToString(_this.gdOrganismo.storePrincipal),
                        arraycliente: _this.arrayToString(_this.gdCliente.storePrincipal),//cadenaFinal,
                        arraytransportador: null,
                        arrayindicador: (cadenaIndicadores != "") ? "{" + cadenaIndicadores + "}" : null,
                        arraydeposito: null,
                        servicio: null
                    }

                }
            ]
        });
        this.tipoReportes.view();

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
    grantedAction: function(idAccion) {
        var existe = false;
        Ext.each(acciones_reportes, function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    btnLimpiar: function(){
        var _this=this;
        _this.dfDesde.setValue(null);
        _this.dfHasta.setValue(null);
        _this.dfDesde.setMaxValue(null);
        _this.dfHasta.setMinValue(null);
        _this.cmbEstado.clearValue();
        _this.comboOperaciones.clearValue();
        _this.cmbUsuarios.clearValue();
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
                } else if(store.idItem === 'idorganismo') {
                    recordType = new store.recordType({
                        idclientesproveedores: record.get('idorganismo'),
                        nombre: record.get('nombre')
                    });
                }else if (store.idItem === 'cliente') {
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
            } else if (store.idItem === 'cliente') {
                if (nRecord.get('idclientesproveedores') === record.get('idclientesproveedores')) {
                    flags = true;
                }
            }
        });
        return flags;
    }

});
