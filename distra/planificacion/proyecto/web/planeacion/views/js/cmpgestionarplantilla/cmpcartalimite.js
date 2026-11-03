Utilidades.Cmp.Cmpcartalimite = function (opcionesConfig) {
    var _this = this;
    this.WinCL2 = function (idproyecto, objestructura) {

        this.btnCerrar = new Ext.Button({
            handler: function () {
                _this.WinGenerarCL.destroy();
            },
            text: 'Cerrar',
            //disabled: true,
            iconCls: 'cerrar',
            tooltip: 'Cerrar ventana'
        });

        //Elementos tab1
        this.btnAdicionarCL2 = new Ext.Button({
            handler: function () {
                accionventana = 1;
                _this.ADDCL2(accionventana, idproyecto);
            },
            tooltip: 'Adicionar CL2',
            disabled: false,
            //hidden: true,
            iconCls: 'adicionar'
        });

        this.btnModificarCL2 = new Ext.Button({
            handler: function () {
                accionventana = 2;
                _this.ADDCL2(accionventana);
            },
            tooltip: 'Modificar CL2',
            disabled: true,
            //hidden: true,
            iconCls: 'modificar'
        });
        
        this.btnEliminarCL2 = new Ext.Button({
            handler: function () {
                //EliminarProducto();
            },
            tooltip: 'Eliminar CL2',
            disabled: true,
            iconCls: 'eliminar'
        });
        
        this.btnGenerarCL1 = new Ext.Button({
            handler: function () {
                accionventana = 1;
                _this.ADDCL1(accionventana);
            },
            tooltip: 'Generar CL1',
            disabled: false,
            iconCls: 'adicionar'
        });
        
        this.filtrosCL = new Ext.grid.GridFilters({
            filters: [{
                    type: 'numeric',
                    dataIndex: 'consecutivo'
                }, {
                    type: 'string',
                    dataIndex: 'numcontrato'
                }]
        });   
    
        this.cmCL = new Ext.grid.ColumnModel([
            {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcl'
                }, {
                    header: 'Número de CL',
                    tooltip: 'Número de carta límite',
                    sortable: true,
                    dataIndex: 'consecutivo',
                    //renderer: crearToolTip
                }, {
                    id: 'expandir',
                    header: 'Número de contrato',
                    tooltip: 'Número de contrato',
                    sortable: true,
                    dataIndex: 'numcontrato',
                    //renderer: crearToolTip
                }
        ]);
        
        this.stCL = new Ext.data.Store({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerCL2',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idproyecto = idproyecto;
                }
            },
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idcl2',
                root: "campos"
            }, [{
                name: 'idcl2'
            }, {
                name: 'consecutivo'
            }, {
                name: 'numcontrato'
            }])
        });
        
        this.smCL = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    _this.idtareaseleccionada = record.data.idelemento;
                },
                rowdeselect: function (sm, indiceFila, record) {
                }
            }
        });
        //Grid gestion gpGpProductos
        this.gpCL = new Ext.grid.GridPanel({
            frame: true,
            autoExpandColumn: 'expandir',
            region: 'center',
            layout: 'fit',
            store: _this.stCL,
            sm: _this.smCL,
            cm: _this.cmCL,
            //md: menuConfigAtributo,
            loadMask: {
                //store: stGpProductos
            },
            bbar: new Ext.PagingToolbar({
                store: _this.stCL,
                displayInfo: true,
                //items: [],
                listeners: {
                    beforechange: function (p, e) {
                        offset = e.start;
                    }
                }
            }),
            plugins: _this.filtrosCL
        });
        
        this.panelGeneral = new Ext.Panel({
            frame: true,
            region: 'center',
            layout: 'border',
            autoWidth: true,
            height: 50,
            items: [_this.gpCL],
            tbar: [_this.btnAdicionarCL2, _this.btnModificarCL2, _this.btnEliminarCL2, _this.btnGenerarCL1]
        });
        
        //Elementos tab2
        this.btnModificarCL1 = new Ext.Button({
            handler: function () {
                accionventana = 2;
                _this.ADDCL2(accionventana);
            },
            tooltip: 'Modificar CL1',
            disabled: true,
            //hidden: true,
            iconCls: 'modificar'
        });
        
        this.btnEliminarCL1 = new Ext.Button({
            handler: function () {
                //EliminarProducto();
            },
            tooltip: 'Eliminar CL2',
            disabled: true,
            iconCls: 'eliminar'
        });
        
        this.filtrosCL1 = new Ext.grid.GridFilters({
            filters: [{
                    type: 'numeric',
                    dataIndex: 'consecutivo'
                }, {
                    type: 'string',
                    dataIndex: 'numcontrato'
                }]
        });   
    
        this.cmCL1 = new Ext.grid.ColumnModel([
            {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcl'
                }, {
                    header: 'Número de CL',
                    tooltip: 'Número de carta límite',
                    sortable: true,
                    dataIndex: 'consecutivo',
                    //renderer: crearToolTip
                }, {
                    id: 'expandir',
                    header: 'Número de contrato',
                    tooltip: 'Número de contrato',
                    sortable: true,
                    dataIndex: 'numcontrato',
                    //renderer: crearToolTip
                }
        ]);
        
        this.stCL1 = new Ext.data.Store({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerCL1',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idproyecto = idproyecto;
                }
            },
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idcl2',
                root: "campos"
            }, [{
                name: 'idcl2'
            }, {
                name: 'consecutivo'
            }, {
                name: 'numcontrato'
            }])
        });
        
        this.smCL1 = new Ext.grid.RowSelectionModel({
            singleSelect: true,
//            listeners: {
//                rowselect: function (sm, indiceFila, record) {
//                    _this.idtareaseleccionada = record.data.idelemento;
//                },
//                rowdeselect: function (sm, indiceFila, record) {
//                }
//            }
        });
        //Grid gestion gpGpProductos
        this.gpCL1 = new Ext.grid.GridPanel({
            frame: true,
            autoExpandColumn: 'expandir',
            region: 'center',
            layout: 'fit',
            store: _this.stCL1,
            sm: _this.smCL1,
            cm: _this.cmCL1,
            //md: menuConfigAtributo,
            loadMask: {
                //store: stGpProductos
            },
            bbar: new Ext.PagingToolbar({
                store: _this.stCL1,
                displayInfo: true,
                //items: [],
                listeners: {
                    beforechange: function (p, e) {
                        offset = e.start;
                    }
                }
            }),
            plugins: _this.filtrosCL1
        });
        
        this.panelGeneralCL1 = new Ext.Panel({
            frame: true,
            region: 'center',
            layout: 'border',
            autoWidth: true,
            height: 50,
            items: [_this.gpCL1],
            tbar: [_this.btnModificarCL1, _this.btnEliminarCL1]
        });
        
        //Elementos tab3
        this.btnAdicionarCL3 = new Ext.Button({
            handler: function () {
                accionventana = 1;
                _this.ADDCL2(accionventana);
            },
            tooltip: 'Adicionar CL3',
            disabled: false,
            //hidden: true,
            iconCls: 'adicionar'
        });

        this.btnModificarCL3 = new Ext.Button({
            handler: function () {
                accionventana = 2;
                _this.ADDCL2(accionventana);
            },
            tooltip: 'Modificar CL3',
            disabled: true,
            //hidden: true,
            iconCls: 'modificar'
        });
        
        this.btnEliminarCL3 = new Ext.Button({
            handler: function () {
                //EliminarProducto();
            },
            tooltip: 'Eliminar CL3',
            disabled: true,
            iconCls: 'eliminar'
        });
        
        this.filtrosCL3 = new Ext.grid.GridFilters({
            filters: [{
                    type: 'numeric',
                    dataIndex: 'consecutivo'
                }, {
                    type: 'string',
                    dataIndex: 'numcontrato'
                }]
        });   
    
        this.cmCL3 = new Ext.grid.ColumnModel([
            {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcl'
                }, {
                    header: 'Número de CL',
                    tooltip: 'Número de carta límite',
                    sortable: true,
                    dataIndex: 'consecutivo',
                    //renderer: crearToolTip
                }, {
                    id: 'expandir',
                    header: 'Número de contrato',
                    tooltip: 'Número de contrato',
                    sortable: true,
                    dataIndex: 'numcontrato',
                    //renderer: crearToolTip
                }
        ]);
        
        this.stCL3 = new Ext.data.Store({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerCL2',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idproyecto = idproyecto;
                }
            },
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idcl2',
                root: "campos"
            }, [{
                name: 'idcl2'
            }, {
                name: 'consecutivo'
            }, {
                name: 'numcontrato'
            }])
        });
        
        this.smCL3 = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    _this.idtareaseleccionada = record.data.idelemento;
                },
                rowdeselect: function (sm, indiceFila, record) {
                }
            }
        });
        //Grid gestion gpGpProductos
        this.gpCL3 = new Ext.grid.GridPanel({
            frame: true,
            autoExpandColumn: 'expandir',
            region: 'center',
            layout: 'fit',
            store: _this.stCL3,
            sm: _this.smCL3,
            cm: _this.cmCL3,
            //md: menuConfigAtributo,
            loadMask: {
                //store: stGpProductos
            },
            bbar: new Ext.PagingToolbar({
                store: _this.stCL3,
                displayInfo: true,
                //items: [],
                listeners: {
                    beforechange: function (p, e) {
                        offset = e.start;
                    }
                }
            }),
            plugins: _this.filtrosCL3
        });
        
        this.panelGeneralCL3 = new Ext.Panel({
            frame: true,
            region: 'center',
            layout: 'border',
            autoWidth: true,
            height: 50,
            items: [_this.gpCL3],
            tbar: [_this.btnAdicionarCL3, _this.btnModificarCL3, _this.btnEliminarCL3]
        });
        
        //Elementos tab4
        this.btnAdicionarCL4 = new Ext.Button({
            handler: function () {
                accionventana = 1;
                _this.ADDCL2(accionventana);
            },
            tooltip: 'Adicionar CL4',
            disabled: false,
            //hidden: true,
            iconCls: 'adicionar'
        });

        this.btnModificarCL4 = new Ext.Button({
            handler: function () {
                accionventana = 2;
                _this.ADDCL2(accionventana);
            },
            tooltip: 'Modificar CL3',
            disabled: true,
            //hidden: true,
            iconCls: 'modificar'
        });
        
        this.btnEliminarCL4 = new Ext.Button({
            handler: function () {
                //EliminarProducto();
            },
            tooltip: 'Eliminar CL3',
            disabled: true,
            iconCls: 'eliminar'
        });
        
        this.filtrosCL4 = new Ext.grid.GridFilters({
            filters: [{
                    type: 'numeric',
                    dataIndex: 'consecutivo'
                }, {
                    type: 'string',
                    dataIndex: 'numcontrato'
                }]
        });   
    
        this.cmCL4 = new Ext.grid.ColumnModel([
            {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcl'
                }, {
                    header: 'Número de CL',
                    tooltip: 'Número de carta límite',
                    sortable: true,
                    dataIndex: 'consecutivo',
                    //renderer: crearToolTip
                }, {
                    id: 'expandir',
                    header: 'Número de contrato',
                    tooltip: 'Número de contrato',
                    sortable: true,
                    dataIndex: 'numcontrato',
                    //renderer: crearToolTip
                }
        ]);
        
        this.stCL4 = new Ext.data.Store({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerCL2',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idproyecto = idproyecto;
                }
            },
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idcl2',
                root: "campos"
            }, [{
                name: 'idcl2'
            }, {
                name: 'consecutivo'
            }, {
                name: 'numcontrato'
            }])
        });
        
        this.smCL4 = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    _this.idtareaseleccionada = record.data.idelemento;
                },
                rowdeselect: function (sm, indiceFila, record) {
                }
            }
        });
        //Grid gestion gpGpProductos
        this.gpCL4 = new Ext.grid.GridPanel({
            frame: true,
            autoExpandColumn: 'expandir',
            region: 'center',
            layout: 'fit',
            store: _this.stCL4,
            sm: _this.smCL4,
            cm: _this.cmCL4,
            //md: menuConfigAtributo,
            loadMask: {
                //store: stGpProductos
            },
            bbar: new Ext.PagingToolbar({
                store: _this.stCL4,
                displayInfo: true,
                //items: [],
                listeners: {
                    beforechange: function (p, e) {
                        offset = e.start;
                    }
                }
            }),
            plugins: _this.filtrosCL4
        });
        
        this.panelGeneralCL4 = new Ext.Panel({
            frame: true,
            region: 'center',
            layout: 'border',
            autoWidth: true,
            height: 50,
            items: [_this.gpCL4],
            tbar: [_this.btnAdicionarCL4, _this.btnModificarCL4, _this.btnEliminarCL4]
        });
        
         //TabPanel General
        this.tabCL = new Ext.TabPanel({
            activeTab: 0,
            width: 950,
            height: 540,
            //layout: 'fit',
            plain: true,
            defaults: {autoScroll: true},
            items: [{
                    title: 'CL Constructor-Inversión',
                    layout: 'fit',
                    html: "<div id = 'datosgen' ></div>",
                    items: [_this.panelGeneral]
                }, {
                    title: 'CL Registro de Carta Límite',
                    layout: 'fit',
                    html: "<div id = 'productos' ></div>",
                    items: [_this.panelGeneralCL1]
                }, {
                    title: 'CL Desviación',
                    layout: 'fit',
                    html: "<div id = 'datoscomplementarios' ></div>",
                    items: [_this.panelGeneralCL3]
                }, {
                    title: 'CL Cambio de material',
                    layout: 'fit',
                    html: "<div id = 'representantes' ></div>",
                    items: [_this.panelGeneralCL4]
                }
            ],
            listeners: {
                tabchange: function (panel, tab) {
                    tab.doLayout(true);
                }
            }
        });

        this.WinGenerarCL = new Ext.Window({
            title: 'Generar cartas límites',
            layout: 'fit',
            constrain: true,
            //tbar: [],
            closable: true,
            graggable: false,
            modal: true,
            width: 950,
            height: 550,
            //usarKeymap: true,
            //botonesKeymap: [_this.btnAyuda],
            buttons: [_this.btnCerrar],
            items: _this.tabCL,
            listeners: {
                close: function () {
                }
            }
        });
        _this.WinGenerarCL.doLayout();
        _this.WinGenerarCL.show();
    };
    
    this.ADDCL2 = function (accion, idproyecto) {
        this.btnCerrarADD = new Ext.Button({
            handler: function () {
                _this.WinADDCL.destroy();
            },
            text: 'Cerrar',
            //disabled: true,
            iconCls: 'cerrar',
            tooltip: 'Cerrar ventana'
        });

        this.btnAceptarCL2 = new Ext.Button({
            handler: function () {
                accionventana = 1;
                _this.WinCL2(accionventana);
            },
            text: 'Aceptar',
            tooltip: 'Adicionar CL',
            disabled: false,
            //hidden: true,
            iconCls: 'adicionar'
        });
        
        this.filtrosADDCL = new Ext.grid.GridFilters({
            filters: [{
                    type: 'numeric',
                    dataIndex: 'orden'
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                },{
                    type: 'string',
                    dataIndex: 'unidadmedida'
                },{
                    type: 'numeric',
                    dataIndex: 'cantidad'
                },{
                    type: 'string',
                    dataIndex: 'observacion'
                }]
        });    
    
        this.cmADDCL = new Ext.grid.ColumnModel([
            {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idmanterial'
                }, {
                    header: 'N/O',
                    tooltip: 'Número de orden',
                    sortable: true,
                    dataIndex: 'consecutivo',
                    width: 30,
                    //renderer: crearToolTip
                }, {
                    header: 'Descripción material',
                    tooltip: 'Descripción material',
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 200,
                    //renderer: crearToolTip
                }, {
                    header: 'U/M',
                    tooltip: 'Unidad de medidad',
                    sortable: true,
                    dataIndex: 'unidadmedida',
                    //renderer: crearToolTip
                }, {
                    id: 'expandir',
                    header: 'Observación',
                    tooltip: 'Observación',
                    sortable: true,
                    dataIndex: 'observacion',
                    //renderer: crearToolTip
                }
        ]);
        
        this.stADDCL = new Ext.data.Store({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerMaterialesCL2',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idproyecto = idproyecto;
                }
            },
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idcl2',
                root: "campos"
            }, [{
                name: 'idcl2'
            }, {
                name: 'consecutivo'
            }, {
                name: 'numcontrato'
            }])
        });
        this.smADDCL = new Ext.grid.RowSelectionModel({
            singleSelect: true
//            listeners: {
//                rowselect: function (sm, indiceFila, record) {
//                    _this.idtareaseleccionada = record.data.idelemento;
//                },
//                rowdeselect: function (sm, indiceFila, record) {
//                }
//            }
        });
        //Grid gestion gpGpProductos
        this.gpADDCL = new Ext.grid.GridPanel({
            frame: true,
            autoExpandColumn: 'expandir',
            region: 'center',
            layout: 'fit',
            width: 820,
            height: 330,
            store: _this.stADDCL,
            sm: _this.smADDCL,
            cm: _this.cmADDCL,
            //md: menuConfigAtributo,
            loadMask: {
                //store: stGpProductos
            },
            bbar: new Ext.PagingToolbar({
                store: _this.stADDCL,
                displayInfo: true,
                //items: [],
                listeners: {
                    beforechange: function (p, e) {
                        offset = e.start;
                    }
                }
            }),
            plugins: _this.filtrosADDCL
        });
        
//        this.Obra = new Ext.form.Label({
//            text: 'Obra:',
//            style: 'font-weight:bold;'
//        });
        
        this.Obra = new Ext.form.TextField({
            //disabled: true,
            emptyText: 'Seleccione',
            fieldLabel: 'Hito/Obra',
            readOnly: true,
            allowBlank: true,
            width: 200, flex: 1,
            anchor: '90%',
            hidden: false,
            listeners: {
                render: function (yo) {
                    yo.getEl().on('click', function () {
                        _this.SeleccionarHito(idproyecto);
                    });
                }
            }
        });

        this.NoConsecutivo = new Ext.form.Label({
            text: 'No:',
            style: 'font-weight:bold;'
        });
        this.NoContrato = new Ext.form.Label({
            text: 'No Contrato:',
            style: 'font-weight:bold;'
        });
        this.Especialidad = new Ext.form.Label({
            text: 'Especialidad:',
            style: 'font-weight:bold;'
        });

        this.CodigoMEP = new Ext.form.Label({
            text: 'Codigo MEP:',
            style: 'font-weight:bold;'
        });

        this.COdigoProyecto = new Ext.form.Label({
            text: 'Código Proyecto:',
            style: 'font-weight:bold;'
        });

        this.Constructor = new Ext.form.TextField({
            fieldLabel: '<span style=\"font-weight: bold;\">Constructor</span>',
            allowBlank: false,
            width: 200,
            anchor: '80%',
        });
        
        this.ElaboradoPor = new Ext.form.Label({
            text: 'Elaborado Por:',
            style: 'font-weight:bold;'
        });
        this.RevisadoPor = new Ext.form.Label({
            text: 'Revisado Por:',
            style: 'font-weight:bold;'
        });
        this.AprobadoPor = new Ext.form.Label({
            text: 'Aprobado Por:',
            style: 'font-weight:bold;'
        });
        
        this.FechaElab = new Ext.form.DateField({
            fieldLabel: '<span style=\"font-weight: bold;\">Fecha Elaboración</span>',
            allowBlank: false,
            width: 100,
            anchor: '80%',
        });
    
        this.panelGeneralADD = new Ext.Panel({
            frame: true,
            region: 'center',
            //layout: 'border',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: 1,
                            layout: 'form',
                            items: _this.Obra
                        },{
                            columnWidth: 0.3,
                            layout: 'form',
                            items: _this.NoContrato
                        },{
                            columnWidth: 0.3,
                            layout: 'form',
                            items: _this.Especialidad
                        },{
                            columnWidth: 0.3,
                            layout: 'form',
                            items: _this.NoConsecutivo
                        },{
                            columnWidth: 0.5,
                            layout: 'form',
                            items: _this.CodigoMEP
                        },{
                            columnWidth: 0.5,
                            layout: 'form',
                            items: _this.COdigoProyecto
                        },{
                            columnWidth: 1,
                            layout: 'form',
                            items: _this.Constructor
                        }, {
                            columnWidth: 1,
                            layout: 'form',
                            items: _this.gpADDCL
                        }, {
                            columnWidth: 0.3,
                            layout: 'form',
                            items: _this.ElaboradoPor
                        }, {
                            columnWidth: 0.3,
                            layout: 'form',
                            items: _this.RevisadoPor
                        }, {
                            columnWidth: 0.3,
                            layout: 'form',
                            items: _this.AprobadoPor
                        }, {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: _this.FechaElab
                        }
                    ]

                }]
        });

        this.WinADDCL = new Ext.Window({
            title: 'Generar Carta Límite',
            layout: 'fit',
            constrain: true,
            //tbar: [],
            closable: true,
            graggable: false,
            modal: true,
            width: 850,
            height: 550,
            //usarKeymap: true,
            //botonesKeymap: [_this.btnAyuda],
            buttons: [_this.btnCerrarADD, _this.btnAceptarCL2],
            items: _this.panelGeneralADD,
            listeners: {
                close: function () {
                }
            }
        });
        _this.WinADDCL.doLayout();
        _this.WinADDCL.show();
        
    };
    
    this.ADDCL1 = function (accion) {
        this.btnCerrarADD1 = new Ext.Button({
            handler: function () {
                _this.WinADDCL1.destroy();
            },
            text: 'Cerrar',
            //disabled: true,
            iconCls: 'cerrar',
            tooltip: 'Cerrar ventana'
        });

        this.btnAceptarCL1 = new Ext.Button({
            handler: function () {
                accionventana = 1;
                _this.WinCL1(accionventana);
            },
            text: 'Aceptar',
            tooltip: 'Adicionar CL',
            disabled: false,
            //hidden: true,
            iconCls: 'adicionar'
        });
        
        this.filtrosADDCL1 = new Ext.grid.GridFilters({
            filters: [{
                    type: 'numeric',
                    dataIndex: 'orden'
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                },{
                    type: 'string',
                    dataIndex: 'unidadmedida'
                },{
                    type: 'numeric',
                    dataIndex: 'cantidad'
                },{
                    type: 'string',
                    dataIndex: 'observacion'
                }]
        });    
    
        this.cmADDCL1 = new Ext.grid.ColumnModel([
            {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idmanterial'
                }, {
                    header: 'N/O',
                    tooltip: 'Número de orden',
                    sortable: true,
                    dataIndex: 'consecutivo',
                    width: 30,
                    //renderer: crearToolTip
                }, {
                    header: 'Descripción material',
                    tooltip: 'Descripción material',
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 200,
                    //renderer: crearToolTip
                }, {
                    header: 'U/M',
                    tooltip: 'Unidad de medidad',
                    sortable: true,
                    dataIndex: 'unidadmedida',
                    //renderer: crearToolTip
                }, {
                    id: 'expandir',
                    header: 'Observación',
                    tooltip: 'Observación',
                    sortable: true,
                    dataIndex: 'observacion',
                    //renderer: crearToolTip
                }
        ]);
        
        this.stADDCL1 = new Ext.data.Store({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerMaterialesCL2',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idproyecto = idproyecto;
                }
            },
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idcl2',
                root: "campos"
            }, [{
                name: 'idcl2'
            }, {
                name: 'consecutivo'
            }, {
                name: 'numcontrato'
            }])
        });
        this.smADDCL1 = new Ext.grid.RowSelectionModel({
            singleSelect: true
//            listeners: {
//                rowselect: function (sm, indiceFila, record) {
//                    _this.idtareaseleccionada = record.data.idelemento;
//                },
//                rowdeselect: function (sm, indiceFila, record) {
//                }
//            }
        });
        //Grid gestion gpGpProductos
        this.gpADDCL1 = new Ext.grid.GridPanel({
            frame: true,
            autoExpandColumn: 'expandir',
            region: 'center',
            layout: 'fit',
            width: 820,
            height: 330,
            store: _this.stADDCL1,
            sm: _this.smADDCL1,
            cm: _this.cmADDCL1,
            //md: menuConfigAtributo,
            loadMask: {
                //store: stGpProductos
            },
            bbar: new Ext.PagingToolbar({
                store: _this.stADDCL1,
                displayInfo: true,
                //items: [],
                listeners: {
                    beforechange: function (p, e) {
                        offset = e.start;
                    }
                }
            }),
            plugins: _this.filtrosADDCL
        });
        
        this.Obra1 = new Ext.form.Label({
            text: 'Nombre y código de la obra:',
            style: 'font-weight:bold;'
        });
        this.ElaboradoPor1 = new Ext.form.Label({
            text: 'Elaborado Por:',
            style: 'font-weight:bold;'
        });
        this.RevisadoPor1 = new Ext.form.Label({
            text: 'Revisado Por:',
            style: 'font-weight:bold;'
        });
        this.AprobadoPor1 = new Ext.form.Label({
            text: 'Aprobado Por:',
            style: 'font-weight:bold;'
        });
        
        this.FechaElab1 = new Ext.form.DateField({
            fieldLabel: '<span style=\"font-weight: bold;\">Fecha Elaboración</span>',
            allowBlank: false,
            width: 100,
            anchor: '80%',
        });
    
        this.panelGeneralADD1 = new Ext.Panel({
            frame: true,
            region: 'center',
            //layout: 'border',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: 1,
                            layout: 'form',
                            items: _this.Obra1
                        }, {
                            columnWidth: 1,
                            layout: 'form',
                            items: _this.gpADDCL1
                        }, {
                            columnWidth: 0.3,
                            layout: 'form',
                            items: _this.ElaboradoPor1
                        }, {
                            columnWidth: 0.3,
                            layout: 'form',
                            items: _this.RevisadoPor1
                        }, {
                            columnWidth: 0.3,
                            layout: 'form',
                            items: _this.AprobadoPor1
                        }, {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: _this.FechaElab1
                        }
                    ]

                }]
        });
        
//        this.panelGeneralADD = new Ext.Panel({
//            frame: true,
//            region: 'center',
//            layout: 'border',
//            autoWidth: true,
//            height: 60,
//            items: [_this.gpADDCL],
//        });

        this.WinADDCL1 = new Ext.Window({
            title: 'Generar CL1 Registro de carta límite',
            layout: 'fit',
            constrain: true,
            //tbar: [],
            closable: true,
            graggable: false,
            modal: true,
            width: 850,
            height: 550,
            //usarKeymap: true,
            //botonesKeymap: [_this.btnAyuda],
            buttons: [_this.btnCerrarADD1, _this.btnAceptarCL1],
            items: _this.panelGeneralADD1,
            listeners: {
                close: function () {
                }
            }
        });
        _this.WinADDCL1.doLayout();
        _this.WinADDCL1.show();
        
    };
    
    this.ADDCL3 = function (accion) {
        
        this.btnCerrarADD3 = new Ext.Button({
            handler: function () {
                _this.WinADDCL3.destroy();
            },
            text: 'Cerrar',
            //disabled: true,
            iconCls: 'cerrar',
            tooltip: 'Cerrar ventana'
        });

        this.btnAceptarCL3 = new Ext.Button({
            handler: function () {
                accionventana = 1;
                _this.WinCL2(accionventana);
            },
            text: 'Aceptar',
            tooltip: 'Adicionar CL',
            disabled: false,
            //hidden: true,
            iconCls: 'adicionar'
        });
        
        this.filtrosADDCL3 = new Ext.grid.GridFilters({
            filters: [{
                    type: 'numeric',
                    dataIndex: 'orden'
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                },{
                    type: 'string',
                    dataIndex: 'unidadmedida'
                },{
                    type: 'numeric',
                    dataIndex: 'cantidad'
                },{
                    type: 'string',
                    dataIndex: 'observacion'
                }]
        });    
    
        this.cmADDCL3 = new Ext.grid.ColumnModel([
            {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idmanterial'
                }, {
                    header: 'N/O',
                    tooltip: 'Número de orden',
                    sortable: true,
                    dataIndex: 'consecutivo',
                    width: 30,
                    //renderer: crearToolTip
                }, {
                    header: 'Descripción material',
                    tooltip: 'Descripción material',
                    sortable: true,
                    dataIndex: 'denominacion',
                    width: 200,
                    //renderer: crearToolTip
                }, {
                    header: 'U/M',
                    tooltip: 'Unidad de medidad',
                    sortable: true,
                    dataIndex: 'unidadmedida',
                    //renderer: crearToolTip
                }, {
                    id: 'expandir',
                    header: 'Observación',
                    tooltip: 'Observación',
                    sortable: true,
                    dataIndex: 'observacion',
                    //renderer: crearToolTip
                }
        ]);
        
        this.stADDCL3 = new Ext.data.Store({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerMaterialesCL2',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idproyecto = idproyecto;
                }
            },
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idcl2',
                root: "campos"
            }, [{
                name: 'idcl2'
            }, {
                name: 'consecutivo'
            }, {
                name: 'numcontrato'
            }])
        });
        this.smADDCL3 = new Ext.grid.RowSelectionModel({
            singleSelect: true
//            listeners: {
//                rowselect: function (sm, indiceFila, record) {
//                    _this.idtareaseleccionada = record.data.idelemento;
//                },
//                rowdeselect: function (sm, indiceFila, record) {
//                }
//            }
        });
        //Grid gestion gpGpProductos
        this.gpADDCL3 = new Ext.grid.GridPanel({
            frame: true,
            autoExpandColumn: 'expandir',
            region: 'center',
            layout: 'fit',
            width: 820,
            height: 330,
            store: _this.stADDCL3,
            sm: _this.smADDCL3,
            cm: _this.cmADDCL3,
            //md: menuConfigAtributo,
            loadMask: {
                //store: stGpProductos
            },
            bbar: new Ext.PagingToolbar({
                store: _this.stADDCL3,
                displayInfo: true,
                //items: [],
                listeners: {
                    beforechange: function (p, e) {
                        offset = e.start;
                    }
                }
            }),
            plugins: _this.filtrosADDCL3
        });
        
        this.Obra = new Ext.form.Label({
            text: 'Obra:',
            style: 'font-weight:bold;'
        });

        this.NoConsecutivo = new Ext.form.Label({
            text: 'No:',
            style: 'font-weight:bold;'
        });
        this.NoContrato = new Ext.form.Label({
            text: 'No Contrato:',
            style: 'font-weight:bold;'
        });
        this.Especialidad = new Ext.form.Label({
            text: 'Especialidad:',
            style: 'font-weight:bold;'
        });

        this.CodigoMEP = new Ext.form.Label({
            text: 'Codigo MEP:',
            style: 'font-weight:bold;'
        });

        this.Entidad = new Ext.form.Label({
            text: 'Código Proyecto:',
            style: 'font-weight:bold;'
        });

        this.Constructor = new Ext.form.TextField({
            fieldLabel: '<span style=\"font-weight: bold;\">Constructor</span>',
            allowBlank: false,
            width: 200,
            anchor: '80%',
        });
        
        this.ElaboradoPor = new Ext.form.Label({
            text: 'Elaborado Por:',
            style: 'font-weight:bold;'
        });
        this.RevisadoPor = new Ext.form.Label({
            text: 'Revisado Por:',
            style: 'font-weight:bold;'
        });
        this.AprobadoPor = new Ext.form.Label({
            text: 'Aprobado Por:',
            style: 'font-weight:bold;'
        });
        
        this.FechaElab = new Ext.form.DateField({
            fieldLabel: '<span style=\"font-weight: bold;\">Fecha Elaboración</span>',
            allowBlank: false,
            width: 100,
            anchor: '80%',
        });
    
        this.panelGeneralADD = new Ext.Panel({
            frame: true,
            region: 'center',
            //layout: 'border',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: 1,
                            layout: 'form',
                            items: _this.Obra
                        },{
                            columnWidth: 0.3,
                            layout: 'form',
                            items: _this.NoContrato
                        },{
                            columnWidth: 0.3,
                            layout: 'form',
                            items: _this.Especialidad
                        },{
                            columnWidth: 0.3,
                            layout: 'form',
                            items: _this.NoConsecutivo
                        },{
                            columnWidth: 0.5,
                            layout: 'form',
                            items: _this.CodigoMEP
                        },{
                            columnWidth: 0.5,
                            layout: 'form',
                            items: _this.COdigoProyecto
                        },{
                            columnWidth: 1,
                            layout: 'form',
                            items: _this.Constructor
                        }, {
                            columnWidth: 1,
                            layout: 'form',
                            items: _this.gpADDCL
                        }, {
                            columnWidth: 0.3,
                            layout: 'form',
                            items: _this.ElaboradoPor
                        }, {
                            columnWidth: 0.3,
                            layout: 'form',
                            items: _this.RevisadoPor
                        }, {
                            columnWidth: 0.3,
                            layout: 'form',
                            items: _this.AprobadoPor
                        }, {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: _this.FechaElab
                        }
                    ]

                }]
        });
        
//        this.panelGeneralADD = new Ext.Panel({
//            frame: true,
//            region: 'center',
//            layout: 'border',
//            autoWidth: true,
//            height: 60,
//            items: [_this.gpADDCL],
//        });

        this.WinADDCL = new Ext.Window({
            title: 'Generar Carta Límite',
            layout: 'fit',
            constrain: true,
            //tbar: [],
            closable: true,
            graggable: false,
            modal: true,
            width: 850,
            height: 550,
            //usarKeymap: true,
            //botonesKeymap: [_this.btnAyuda],
            buttons: [_this.btnCerrarADD, _this.btnAceptarCL2],
            items: _this.panelGeneralADD,
            listeners: {
                close: function () {
                }
            }
        });
        _this.WinADDCL.doLayout();
        _this.WinADDCL.show();
        
    };
    
    this.SeleccionarHito = function(idproyecto) {
        hito = null;
        empdestino = null;

        this.btnCancelarSel = new Ext.Button({
            iconCls: 'cancelar',
            //id: 'btnCancelarSel',
            tooltip: perfil.etiquetas.lbTtCancenlarSol,
            text: 'Cancelar',
            handler: function () {
                _this.ventanaHitos.hide();
            }
        });

        this.btnAceptarSel = new Ext.Button({
            iconCls: 'aceptar',
            disabled: false,
            //id: 'btnAceptarSel',
            text: 'Aceptar',
            tooltip: perfil.etiquetas.lbTtAceptarSol,
            handler: function () {
                _this.Obra.setValue(hito);
                _this.ventanaHitos.hide();
            }
        });

        this.filtrosHitos = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string',
                    dataIndex: 'denominacion'
                }]
        });    
    
        this.cmHitos = new Ext.grid.ColumnModel([
            {
                    header: 'Denominación',
                    tooltip: 'Denominación hito',
                    sortable: true,
                    dataIndex: 'denominacion',
                    id: 'expandir',
                    //width: 200
                }
        ]);
        
        this.stHitos = new Ext.data.Store({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerHitos',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idproyecto = idproyecto;
                }
            },
            reader: new Ext.data.JsonReader({
                id: 'idhitos',
                root: "campos"
            }, [{
                name: 'idhitos'
            }, {
                name: 'denominacion'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'autor'
            }])
        });
        
        this.smHitos = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    hito = record.data.idhitos;
                }
            }
        });
        //Grid gestion de hitos
        this.gpHitos = new Ext.grid.GridPanel({
            frame: true,
            autoExpandColumn: 'expandir',
            //region: 'center',
            layout: 'fit',
            width: 300,
            height: 340,
            store: _this.stHitos,
            sm: _this.smHitos,
            cm: _this.cmHitos,
            //md: menuConfigAtributo,
            loadMask: {
                //store: stGpProductos
            },
            bbar: new Ext.PagingToolbar({
                store: _this.stHitos,
                displayInfo: true,
                //items: [],
                listeners: {
                    beforechange: function (p, e) {
                        offset = e.start;
                    }
                }
            }),
            plugins: _this.filtrosHitos
        });

        this.pHitos = new Ext.Panel({
            //id: 'pAsocEstruc',
            //region: 'east',
            split: true,
            layout: 'fit',
            //title: perfil.etiquetas.lbGestionarCategoriaEstrc,
            width: 350,
            //height: 380,
            items: [_this.gpHitos]
        });
        //fin estructuras  

        //this.ventanaHitos = null;
        this.ventanaHitos = new Ext.Window({
            title: 'Seleccionar hito para CL2',
            width: 400,
            constrain: true,
            layout: 'form',
            height: 420,
            resizable: false,
            frame: true,
            modal: true,
            autoScroll: true,
            buttons: [_this.btnCancelarSel, _this.btnAceptarSel],
            items: [_this.pHitos],
            closeAction: 'destroy',
            listeners: {
                beforeshow: function () {
                }
            }
        });
        _this.ventanaHitos.doLayout();
        _this.ventanaHitos.show();
    }
};


