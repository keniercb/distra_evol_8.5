
Ext.ns('Ext.erp.trabajosrealizados');
Ext.erp.trabajosrealizados = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    idioma: undefined,
    idsubsistema: undefined,
    facturacionaperturado: false,
    inventarioaperturado: false,
    constructor: function (config) {
        var _this = this;

        this.frame = true;
        this.idioma = Log.tall.trabajosrealizados.Idioma;
        this.dirController = '/logistica/talleres/recuperaciones/index.php/trabajosrealizados';

        /*------------Barra con botones---------------*/
        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.addToolbarButtonPanel(LOG.util.UIManager.createBtn({ //boton Mostrar reportes
            text: _this.idioma.btnMostrar,
            tooltip:this.idioma.ttBtnMostrar,
            iconCls:'mostrar',
            disabled: true,
            facturacion:_this.facturacionaperturado,
            handler: function () {
                _this.getReportes()
            }
        }));

        this.addToolbarButtonPanel(LOG.util.Prototipos.botonLimpiar({
            text: _this.idioma.btnLimpiar,
            tooltip:this.idioma.ttBtnLimpiar,
            disabled: true,
            handler: function () {
                _this.customTriggerClear();
            }
        }));
        this.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    ctrl:true,
                    key: 'm',
                    fn: function () {
                        _this.getReportes();
                    }
                },
                {
                    alt: true,
                    key: 'l',
                    fn: function () {
                        _this.customTriggerClear();
                    }
                }
            ]);

        this.addToolbarButtonPanel('->');
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({
            id:'ayudatrabajosrealizados'
        }));


        /*------------Fieldset Rango Fecha---------------*/

        this.dfDesdeTR = new Ext.form.DateField({ //---datefield Desde
            fieldLabel: _this.idioma.dfDesde,
            name: 'desdecp',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeSubCP',
            endDateField: 'hastaSubCP',
            editable: false
        });
        this.dfHastaTR = new Ext.form.DateField({ //---datefield Hasta
            fieldLabel: _this.idioma.dfHasta,
            name: 'hastacp',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaSubCP',
            endDateField: 'desdeSubCP',
            editable: false
        });
        this.dfDesdeTR.endDateField = this.dfHastaTR.id; //-------validacion de fecha
        this.dfHastaTR.startDateField = this.dfDesdeTR.id;

        this.clsFecha = LOG.util.UIManager.initColumnForm({ //columnForm de la fecha
            columnas: 2
        });
        this.clsFecha.addComponent(this.dfDesdeTR);
        this.clsFecha.addComponent(this.dfHastaTR);
        this.fsRangoFecha = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsRangoFecha,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            items: [this.clsFecha]
        });

        /*---------------Fieldset con grid Selecionar Servicio-------------*/

        var listaServicio = new LOG.util.List();
        //var checkServicio = new Ext.grid.CheckboxSelectionModel({
        var checkServicio = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        listaServicio.add(checkServicio);
        listaServicio.add({
            header: _this.idioma.gcServicio,
            width: 300,
            dataIndex: 'denominacion',
            default: true
        });

        var clsServicio = LOG.util.UIManager.proccessColumns(listaServicio);
        var cmServicio = new Ext.grid.ColumnModel(clsServicio.columns);
        var smServicio = checkServicio;
        _this.stServicio = new Ext.data.Store({
            idItem: 'Ser',
            reader: new Ext.data.JsonReader({
                id: 'id',
                totalProperty: 'cantidad',
                root: 'datos',
                fields: [
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'idactividad'
                    }
                ]
            })
        });
        smServicio.on({
            'rowselect': function () {
                if (smServicio.getSelections().length >= 1) {
                    _this.btnElimServicio.enable();
                } else {
                    _this.btnElimServicio.disable();
                }
            },
            'rowdeselect': function () {
                if (smServicio.getSelections().length >= 1) {
                    _this.btnElimServicio.enable();
                } else {
                    _this.btnElimServicio.disable();
                }
            }
        });

        this.btnSelecServicio = LOG.util.Prototipos.botonAdicionar({
            text: _this.idioma.botonAdicionar,
            tooltip:this.idioma.ttBtnAdiconarServicio,
            disabled: true,
            handler: function () {
                var ventanaEmergente = new Ext.erp.ventanaEmergente({
                    concepto :_this.idioma.ttBtnBuscarServicios,
                    initDefaultColumns: function(){
                        this.addGridColumn({
                            header: _this.idioma.gcDenomServicio,
                            width: 300,
                            dataIndex: 'denominacion',
                            default: true
                        });
                        this.addGridColumn({
                            dataIndex: 'idactividad',
                            hidden : true
                        });
                    }
                });
                ventanaEmergente.init();
                ventanaEmergente.getVistaPrincipal().title = _this.idioma.tlSeleccionarServicio;
                /*---------cargando servicios-------*/

                ventanaEmergente.view();
                ventanaEmergente.getStorePrincipal().on('beforeload',function(st,obj){
                    Ext.apply(obj.params,{origen:'servicio', nivel:2, excluirdocumentoorigen: 3}) ;
                });
                ventanaEmergente.getStorePrincipal().load();
                var botonAceptar = ventanaEmergente.getVistaPrincipal().listaBotones.getItem(2);
                ventanaEmergente.getGridPrincipal().getSelectionModel().on({
                    'rowselect': function () {
                        if (ventanaEmergente.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    },
                    'rowdeselect': function () {
                        if (ventanaEmergente.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    }
                });
                botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
                    var records = ventanaEmergente.getGridPrincipal().getSelectionModel().getSelections();
                    _this.addRecords(_this.stServicio, records);

                });
            }
        });
        this.btnElimServicio = LOG.util.Prototipos.botonEliminar({
            text: _this.idioma.btnEliminar,
            tooltip:this.idioma.ttBtnEliminarServicio,
            disabled: true,
            handler: function () {
                var seleccion = smServicio.getSelections();
                for (var i = 0; i < seleccion.length; i++) {
                    _this.stServicio.remove(seleccion[i]);
                }
                if (_this.stServicio.getCount() == 0) {
                    _this.btnElimServicio.setDisabled(true);
                }
            }
        });
        this.tbCliente = new LOG.util.UIManager.initToolbar({
            items: [this.btnSelecServicio, this.btnElimServicio]
        });

        var gridCliente = LOG.util.UIManager.initGrid(cmServicio, _this.stServicio, smServicio, {
            tbar: this.tbCliente,
            height: 160,
            bbar: null,
            singleSelect:false,
            expanded: clsServicio.expanded
        });

        this.fsSelecServicio = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsSelecServicio,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            height: 195,
            items: [gridCliente]
        });

        /*---------------Fieldset con grid Selecionar Tecnico-------------*/
        var listaTec = new LOG.util.List();
        //var checkTec = new Ext.grid.CheckboxSelectionModel({
        var checkTec = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        listaTec.add(checkTec);
        listaTec.add({
            header: _this.idioma.gcTecnico,
            width: 300,
            dataIndex: 'nombreapellidos',
            default: true
        });

        var clsTec = LOG.util.UIManager.proccessColumns(listaTec);
        var cmTec = new Ext.grid.ColumnModel(clsTec.columns);
        var smTec = checkTec;

        var recTec = Ext.data.Record.create(clsTec.fields);
        _this.stTec = new Ext.data.Store({
            idItem: 'Tec',
            reader: new Ext.data.JsonReader({
                id: 'id',
                totalProperty: 'cantidad',
                root: 'datos',
                fields: [
                    {
                        name: 'idpersona'
                    },
                    {
                        name: 'nombreapellidos'
                    }
                ]
            }, recTec)
        });
        smTec.on({
            'rowselect': function () {
                if (smTec.getSelections().length >= 1) {
                    _this.btnElimTec.enable();
                } else {
                    _this.btnElimTec.disable();
                }
            },
            'rowdeselect': function () {
                if (smTec.getSelections().length >= 1) {
                    _this.btnElimTec.enable();
                } else {
                    _this.btnElimTec.disable();
                }
            }
        });
        this.btnSelecTec = LOG.util.Prototipos.botonAdicionar({
            text: _this.idioma.botonAdicionar,
            tooltip:this.idioma.ttBtnAdiconarTecnico,
            disabled: true,
            handler: function () {
                var ventanaEmergente = new Ext.erp.ventanaEmergente({
                    concepto: _this.idioma.ttBtnBuscarTecnicos,
                        initDefaultColumns: function(){
                            this.addGridColumn({
                                header: _this.idioma.gcTecnico,
                                width: 300,
                                dataIndex: 'nombreapellidos',
                                default: true
                            });
                            this.addGridColumn({
                                dataIndex: 'idpersona',
                                hidden : true
                            });
                    }
                });
                ventanaEmergente.init();
                ventanaEmergente.getVistaPrincipal().title = _this.idioma.tlSeleccionarTecnico;
                /*---------cargando tecnicos-------*/

                ventanaEmergente.view();
                ventanaEmergente.getStorePrincipal().on('beforeload',function(st,obj){
                    Ext.apply(obj.params,{origen:'tecnico'}) ;
                });
                ventanaEmergente.getStorePrincipal().load();
                var botonAceptar = ventanaEmergente.getVistaPrincipal().listaBotones.getItem(2);
                ventanaEmergente.getGridPrincipal().getSelectionModel().on({
                    'rowselect': function () {
                        if (ventanaEmergente.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    },
                    'rowdeselect': function () {
                        if (ventanaEmergente.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    }
                });
                botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
                    var records = ventanaEmergente.getGridPrincipal().getSelectionModel().getSelections();
                    _this.addRecords(_this.stTec, records);
                });

            }
        });
        this.btnElimTec = LOG.util.Prototipos.botonEliminar({
            text: _this.idioma.btnEliminar,
            tooltip:this.idioma.ttBtnEliminarTecnico,
            disabled: true,
            handler: function () {
                var seleccion = smTec.getSelections();
                for (var i = 0; i < seleccion.length; i++) {
                    _this.stTec.remove(seleccion[i]);
                }
                if (_this.stTec.getCount() == 0) {
                    _this.btnElimTec.setDisabled(true);
                }
            }
        });
        this.tbTec = new LOG.util.UIManager.initToolbar({
            items: [this.btnSelecTec, this.btnElimTec]
        });

        var gridTec = LOG.util.UIManager.initGrid(cmTec, _this.stTec, smTec, {
            tbar: this.tbTec,
            bbar: null,
            height:180,
            expanded: clsTec.expanded
        });


        this.fsSelecTec = new Ext.form.FieldSet({ //fieldset Seleccionar Suministrador
            title: _this.idioma.fsSelecTecnico,
            style: '-moz-border-radius:5px;height:98%',
            labelAlign: 'top',
            region:'center',
            layout:'fit',
            autoHeight:true,
            items: [gridTec]
        });

        /*---------------Fieldset con grid Selecionar Producto-------------*/
        var listaMedios = new LOG.util.List();
        //var checkProd = new Ext.grid.CheckboxSelectionModel({
        var checkProd = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        listaMedios.add(checkProd);
        listaMedios.add({
            header: _this.idioma.gcMedio,
            width: 300,
            dataIndex: 'descripcionmarcamodelo',
            default: true
        });
        listaMedios.add({
            dataIndex: 'idmedio',
            hidden:true,
            default: true
        });

        var clsMedios = LOG.util.UIManager.proccessColumns(listaMedios);
        var cmMedios = new Ext.grid.ColumnModel(clsMedios.columns);
        var smMedios = checkProd;
        _this.stMedios = new Ext.data.Store({
            idItem: 'diff',
            reader: new Ext.data.JsonReader({
                id: 'idmedio',
                totalProperty: 'cantidad',
                root: 'datos',
                fields: [
                    {
                        name: 'idmedio'
                    },
                    {
                        name: 'descripcionmarcamodelo'
                    }
                ]
            })
        });

        this.btnSelecMedios = LOG.util.Prototipos.botonAdicionar({
            disabled: true,
            text: _this.idioma.botonAdicionar,
            tooltip:this.idioma.ttBtnAdiconarMedios,
            handler: function () {
                var ventanaEmergente = new Ext.erp.ventanaEmergente({
                    concepto:_this.idioma.ttBtnBuscarMedios,
                    initDefaultColumns: function(){
                        this.addGridColumn({
                            header: _this.idioma.gcDenomServicio,
                            width: 300,
                            dataIndex: 'descripcionmarcamodelo',
                            default: true
                        });
                        this.addGridColumn({
                            header:'Identificador',
                            width: 300,
                            dataIndex: 'atributoidentificador',
                            default: true
                        });
                        this.addGridColumn({
                            dataIndex: 'idmedio',
                            hidden : true
                        });
                    }
                });
                ventanaEmergente.init();
                ventanaEmergente.getVistaPrincipal().title = _this.idioma.tlSeleccionarMedio;
                /*---------cargando productos-------*/
                ventanaEmergente.view();
                ventanaEmergente.getStorePrincipal().on('beforeload',function(st,obj){
                    Ext.apply(obj.params,{origen:'producto'}) ;
                });
                ventanaEmergente.getStorePrincipal().load();
                var botonAceptar = ventanaEmergente.getVistaPrincipal().listaBotones.getItem(2);
                ventanaEmergente.getGridPrincipal().getSelectionModel().on({
                    'rowselect': function () {
                        if (ventanaEmergente.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    },
                    'rowdeselect': function () {
                        if (ventanaEmergente.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                            botonAceptar.enable();
                        } else {
                            botonAceptar.disable();
                        }
                    }
                });
                botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
                    var records = ventanaEmergente.getGridPrincipal().getSelectionModel().getSelections();
                    _this.addRecords(_this.stMedios, records);
                });

            }
        });
        this.btnElimMedios = LOG.util.Prototipos.botonEliminar({
            text: _this.idioma.btnEliminar,
            tooltip:this.idioma.ttBtnEliminarMedios,
            disabled: true,
            handler: function () {
                var selecciones = smMedios.getSelections();
                for (var i = 0; i < selecciones.length; i++) {
                    _this.stMedios.remove(selecciones[i]);
                    // _this.btnElimMedios.setDisabled(true);
                }
                if (_this.stMedios.getCount() == 0) {
                    _this.btnElimMedios.setDisabled(true);
                }
            }
        });

        this.tbMedios = new LOG.util.UIManager.initToolbar({
            items: [this.btnSelecMedios, this.btnElimMedios]
        });
        var gridMedios = LOG.util.UIManager.initGrid(cmMedios, _this.stMedios, smMedios, {
            tbar: this.tbMedios,
            bbar: null,
            height:180,
            expanded: clsMedios.expanded,
            modoSelection: 2
        });

        smMedios.on({
            'rowselect': function () {
                _this.btnElimMedios.setDisabled(false);
            },
            'rowdeselect': function () {
                _this.btnElimMedios.setDisabled(true);
            }
        });

        this.fsSelecMedios = new Ext.form.FieldSet({
            title: _this.idioma.fsSelecMedios,
            style: '-moz-border-radius:5px;height:98%',
            labelAlign: 'top',
            region:'west',
            autoHeight:true,
            layout:'fit',
            items: [gridMedios]
        });

        /*------------Fieldset con checks---------------*/
        this.chIngresos = new Ext.form.Checkbox({
            boxLabel: _this.idioma.chIngresos,
            height: 40,
            name: _this.idioma.chIngresos,
            report: 'Ingresos',
            estado:'{2}',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _this.validarBotones();
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (checked  || _this.chEgresos.checked || _this.chFacturas.checked) {
                        _this.btnSelecMedios.enable();
                    } else {
                        _this.btnSelecMedios.disable();
                    }

                }
            }
        });
        this.chFacturas = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chFacturas,
            height: 40,
            name: _this.idioma.chFacturas,
            report: 'Facturas',
            estado:'{9}',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _this.validarBotones();
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (checked  || _this.chEgresos.checked || _this.chIngresos.checked) {
                        _this.btnSelecMedios.enable();
                    } else {
                        _this.btnSelecMedios.disable();
                    }

                }
            }
        });
        this.chEgresos = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chEgresos,
            height: 40,
            name: _this.idioma.chEgresos,
            report: 'Egresos',
            estado:'{9}',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                'check': function (_checkbox, checked) {
                    _this.validarBotones();
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (checked  || _this.chFacturas.checked || _this.chIngresos.checked) {
                        _this.btnSelecMedios.enable();
                    } else {
                        _this.btnSelecMedios.disable();
                    }

                }
            }
        });
        this.chServicios = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chServicios,
            height: 40,
            name:  _this.idioma.chServicios,
            report: 'Servicios',
            estado:'{}',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _this.validarBotones();
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (checked) {
                        _this.btnSelecServicio.enable();
                    } else {
                        _this.btnSelecServicio.disable();
                    }


                }
            }
        });
        this.chTrabajoTec = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chTrabajoTec,
            height: 40,
            name:  _this.idioma.chTrabajoTec,
            report: 'Tecnicos',
            estado:'{}',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _this.validarBotones();
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (checked ) {
                        _this.btnSelecTec.enable();
                    } else {
                        _this.btnSelecTec.disable();
                    }

                }
            }
        });
        this.chValesOrd = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chValesOrd,
            height: 40,
            name:  _this.idioma.chValesOrd,
            report: 'Vales',
            estado:'{}',
            hideLabel: true,
            listeners: {
                'check': function (_checkbox, checked) {
                    _this.validarBotones();
                }
            }
        });




        /*------------------checkgroups usar en las validaciones--------------*/
        this.chgrEstadoProd = new Ext.form.CheckboxGroup({ //checkgroup
            items: [this.chIngresos,
                this.chFacturas,
                this.chEgresos,
                this.chServicios,
                this.chTrabajoTec,
                this.chValesOrd
            ]
        });
        this.clsCentroCosto = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.comboEstado = new LOG.util.LovCombo({
            fieldLabel: 'Estado',
            hiddenName: 'estado',
            valueField: 'idestado',
            displayField: 'estado',
            editable: false,
            mode: 'local',
            minChars: 1,
            store: new Ext.data.SimpleStore({
                fields: ['idestado', 'estado'],
                data: [
                    [1, LOG.lb.documento.Estado[1]],
                    [2, LOG.lb.documento.Estado[2]],
                    [9, LOG.lb.documento.Estado[9]],
                    [4, LOG.lb.documento.Estado[4]]
                ]
            }),
            getXType:function(){
               return 'combobox';
            }
        });
        
        this.clsCentroCosto.addComponent(this.comboEstado);
        this.comboCentroCosto = new LOG.util.ComboBox({
            autoLoad:true,
            mode:'local',
            fieldLabel: 'Centro de Costo',
            name: 'idcentrocosto',
            url: '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarComboCentroCosto',
            valueField: 'idcentrogrupo',
            displayField: 'text',
            pageSize:10,
            queryParam:'criterio',
            width: '98%',
            validarEnFormBasico:true,
            campo: true,
            resizable:true
        });
        this.clsCentroCosto.addComponent(this.comboCentroCosto);
        this.fsCentroCosto = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: 'Otros datos',
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            items: [this.clsCentroCosto]
        });
        this.clsOpcionesFiltro = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.clsOpcionesFiltro.addComponent(this.chIngresos);
        this.clsOpcionesFiltro.addComponent(this.chEgresos);
        this.clsOpcionesFiltro.addComponent(this.chServicios);
        this.clsOpcionesFiltro.addComponent(this.chTrabajoTec);
        this.clsOpcionesFiltro.addComponent(this.chValesOrd);

        Ext.Ajax.request({
            url: '/logistica/talleres/recuperaciones/index.php/trabajosrealizados/estaAperturadoSubsistema',
            method:'GET',
            callback: function(rd,o, r){
                var temp = Ext.decode(r.responseText);
                _this.idsubsistema =  temp.idsubsistema;
                _this.facturacionaperturado = temp.facturacionaperturado;
                _this.inventarioaperturado = temp.inventarioaperturado;
                if (_this.facturacionaperturado)
                {
                    _this.clsOpcionesFiltro.addComponent(_this.chFacturas);
                    _this.clsOpcionesFiltro.doLayout();
                }

            }
        });


        this.clsOpcionesFiltro.getColumn(0).columnWidth = 0.25;
        this.fsOpcionesFiltro = new Ext.form.FieldSet({ //fieldset Estado producto
            title: _this.idioma.fsCriteriosRec,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            labelWidth: 165,
            items: [this.clsOpcionesFiltro],
            height: 195
        });

        this.clsGeneral = LOG.util.UIManager.initColumnForm({ //columnForm de la fecha
            columnas: 2,
            region:'center'
        });
        this.clsGeneral.addComponent(this.fsRangoFecha);
        this.clsGeneral.addComponent(this.fsCentroCosto);
        this.clsGeneral.addComponent(this.fsSelecServicio);
        this.clsGeneral.addComponent(this.fsOpcionesFiltro);
        this.clsGeneral.addComponent(this.fsSelecMedios);
        this.clsGeneral.addComponent(this.fsSelecTec);
        this.clsGeneral.getColumn(0).columnWidth = 0.4;
        this.clsGeneral.getColumn(1).columnWidth = 0.6;
        this.clsGeneral.anchor = '101.3%';

        this.fpCentral = LOG.util.UIManager.initForm({ //formulario General
            id:'formularioCentral',
            region: 'center',
            style: '-moz-border-radius:20px',
            items: [this.clsGeneral]
        });
              /* -------configuracion de la vista---------*/
        config.layout = 'border';
        config.items = [
            {
                region: 'north',
                tbar: [this.listaBotonesVentanaToolbar.getArray()]
            },
            this.fpCentral
        ];
        Ext.erp.trabajosrealizados.superclass.constructor.call(this, config);


    },

    validarBotones: function() {
        var _this = this;
        if(_this.chIngresos.getValue() || _this.chFacturas.getValue() || _this.chEgresos.getValue() || _this.chServicios.getValue() || _this.chTrabajoTec.getValue() || _this.chValesOrd.getValue()) {
            _this.listaBotonesVentanaToolbar.getItem(0).enable();
            _this.listaBotonesVentanaToolbar.getItem(1).enable();
        } else {
            _this.listaBotonesVentanaToolbar.getItem(0).disable();
            _this.listaBotonesVentanaToolbar.getItem(1).disable();
        }
    },

    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));

    },
    getReportes: function () {
        var _this = this;

        var desdeTR = (_this.dfDesdeTR.getValue()) ? _this.dfDesdeTR.getValue().format('d-m-Y') : null;
        var hastaTR = (_this.dfHastaTR.getValue()) ? _this.dfHastaTR.getValue().format('d-m-Y') : null;
        var contItems = 0;
        _this.reports = [];
        var chgrItems = _this.chgrEstadoProd.items;
        var stringServ = "";
        var stringTec = "";
        var stringMed = "";
        for (var i = 0; i < _this.stServicio.data.items.length; i++) {
            if (i != _this.stServicio.data.items.length - 1) {
                stringServ += _this.stServicio.data.items[i].data.idactividad + ",";
            } else {
                stringServ += _this.stServicio.data.items[i].data.idactividad + "";
            }
        }
        stringServ = "{" + stringServ + "}";
        if(stringServ== "{}") {
            stringServ = null;
        }

        for (var i = 0; i < _this.stTec.data.items.length; i++) {
            if (i != _this.stTec.data.items.length - 1) {
                stringTec += _this.stTec.data.items[i].data.idpersona + ",";
            } else {
                stringTec += _this.stTec.data.items[i].data.idpersona + "";
            }
        }
        stringTec = "{" + stringTec + "}";
        if(stringTec== "{}") {
            stringTec = null;
        }

        for (var i = 0; i < _this.stMedios.data.items.length; i++) {
            if (i != _this.stMedios.data.items.length - 1) {
                stringMed += _this.stMedios.data.items[i].data.idmedio + ",";
            } else {
                stringMed += _this.stMedios.data.items[i].data.idmedio + "";
            }
        }
        stringMed = "{" + stringMed + "}";
        if(stringMed== "{}") {
            stringMed = null;
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
                            dirReport: '/distra/logistica/talleres/recuperaciones/TrabajosRealizados/'+ chgrItems[i].report,
                            name: chgrItems[i].name,
                            isList:true,
                            params: {
                                fechainicio: desdeTR,
                                fechafin: hastaTR,
                                arraymedio:stringMed,
                                arraytecnico:stringTec,
                                arrayservicio:stringServ,
                                estadodocumento:chgrItems[i].estado,
                                iddocs:window.iddocs,
                                monedacontable: (window.monedacontable) ? window.monedacontable : null,
                                monedaalternativa: (window.monedaalternativa) ? window.monedaalternativa : null,
                                idestructura:idEntidad,
                                idsubsistema: _this.idsubsistema,
                                inventario: _this.inventarioaperturado ? 1 : 2,
                                idcentrocosto:this.comboCentroCosto.getValue() ? this.comboCentroCosto.getValue() : null,                               
        	                      arrayestados: (this.comboEstado.getValue()) ? '{'+this.comboEstado.getValue()+'}' : '{9}',
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
    addRecords: function (store, records) {
        var _this = this;
        Ext.each(records, function (record, index) {
            if (!_this.existsRecord(store, record)) {
                var recordType;
                if (store.idItem === 'diff') {
					console.debug()
                    recordType = new store.recordType({
                        idmedio: record.get('idmedio'),
                        descripcionmarcamodelo: record.get('descripcionmarcamodelo')
                    });
                } else if (store.idItem === 'Tec') {
                    recordType = new store.recordType({
                        idpersona: record.get('idpersona'),
                        nombreapellidos: record.get('nombreapellidos')
                    });
                } else if (store.idItem === 'Ser') {
                    recordType = new store.recordType({
                        idactividad: record.get('idactividad'),
                        denominacion: record.get('denominacion')
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
                if ( nRecord.get('idmedio') === record.get('idmedio')) {
                    flags = true;
                }
            } else if (store.idItem === 'Tec') {
                if (nRecord.get('idpersona') === record.get('idpersona')) {
                    flags = true;
                }
            }else if (store.idItem === 'Ser') {
                if (nRecord.get('idactividad') === record.get('idactividad')){
                    flags = true;
                }
            }
        });
        return flags;
    },
    customTriggerClear: function () {
        var _this = this;
        _this.dfDesdeTR.setValue(null);
        _this.dfHastaTR.setValue(null);
        _this.chIngresos.setValue(false);
        _this.chEgresos.setValue(false);
        _this.chFacturas.setValue(false);
        _this.chTrabajoTec.setValue(false);
        _this.chServicios.setValue(false);
        _this.chValesOrd.setValue(false);
        _this.stServicio.removeAll();
        _this.stMedios.removeAll();
        _this.stTec.removeAll();
    }
});

/*-----------ventana de seleccionde clientes y suministradores---------------*/

Ext.erp.ventanaEmergente = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    servicios: undefined,
    tecnicos: undefined,
    productos: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma = Log.tall.trabajosrealizados.Idioma;
        this.dirController = '/logistica/talleres/recuperaciones/index.php/trabajosrealizados';
        this. urlBusquedaGridPrincipal =  'getTrabajosRealizados';
        config.modoSeleccion = 3;
        config.autoLoad = false;
        this.autoSelect = false;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'ventana';
        config = Ext.apply(_this, config);
        Ext.erp.ventanaEmergente.superclass.constructor.call(this, config);
    },
    init: function () {
        var _this = this;
        Ext.erp.ventanaEmergente.superclass.init.call(this);
        _this.getVistaPrincipal().width = 500;
        _this.getVistaPrincipal().height = 400;
        _this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).disable();
    },
    render: function () {
        var _this = this;
        var p = Ext.erp.ventanaEmergente.superclass.render.call(this);
        _this.getStorePrincipal().on({
            beforeload: function(st, obj){
                obj.callback =  function(resp){
                    if(resp.length == 0){
                        if(obj.params.criterio){
                            mostrarMensaje(1, LOG.util.Idioma.msgNoResultados);
                        }
                        else
                          mostrarMensaje(1, LOG.util.Idioma.msgNoMostrarResultados);
                    }
                    //if (grid.getStore().filtrado) {
                    //    mostrarMensaje(1, LOG.util.Idioma.msgNoResultados);
                    //} else {
                    //    mostrarMensaje(1, LOG.util.Idioma.msgNoMostrarResultados);
                    //}
                }
            }
        });
        return p;
    },

    setServicios : function(r){
        this.servicios = r;
    },
    setTecnicos : function(r){
        this.tecnicos = r;
    },
    setProductos : function(r){
        this.productos = r;
    }
});
