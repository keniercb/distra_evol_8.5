agregarmodificarsolicitudes711 = function () {
    
}
//accion =1 adicionar =2 modificar
function winFp(accion) {
    offset = 0;
    
   h=850;
   h1=1000;
   w=1000;
   productossel =[];
   solseleccionadas =[];
   solconsolidar =[];
   textoAntecendetes = '';
    prod =[];
    auxcons =[];
    var servsol = [];
    btnCancelarSol = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarSol',
        tooltip: perfil.etiquetas.lbTtCancenlarSol,
        text: 'Cancelar',
        handler: function () {
                ventanaCrud.destroy();
        }
    });

    btnAplicarSol = new Ext.Button({
        iconCls: 'aplicar',
        id: 'btnAplicarSol',
        disabled: true,
        text: 'Aplicar',
        tooltip: perfil.etiquetas.lbTtAplicarSol,
        handler: function () {
            if (pfinal.getForm().isValid()) {
                AdicionarModificar(accion, 0);
            } else {
                mostrarMensaje(2, 'Existen campos vacíos o con valores incorrectos.');
            }
        }
    });

    btnAceptarSol = new Ext.Button({
        iconCls: 'aceptar',
        disabled: true,
        id: 'btnAceptarSol',
        text: 'Aceptar',
        tooltip: perfil.etiquetas.lbTtAceptarSol,
        handler: function () {
            if (pfinal.getForm().isValid()) {
                AdicionarModificar(accion, 1);
            } else {
                mostrarMensaje(2, 'Existen campos vacíos o con valores incorrectos.')
            }
        }
    });
    
    //Elementos del primer tab1 
    stSioNo = new Ext.data.SimpleStore({
        fields: ['decision', 'bol'],
        data : [['Sí', true],['No', false]]
        });
        
    cbConsolidada = new Ext.form.ComboBox({
        id: 'idcbConsolidada',
        //emptyText: 'Seleccione',
        width: 50,
        disabled: false,
        store: stSioNo,
        fieldLabel: 'Consolidada',
        displayField: 'decision',
        valueField: 'bol',
        typeAhead: true,
        anchor: '80%',
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                bol=rec.data.bol;
                if(bol==true){
                    pacon=1;
                    gpSolConsolidar.enable();
                    stSolConsolidar.reload();
                    chkConsolidar.hide();
                    tabsolicitud.setActiveTab('Datos de productos');
                }else{
                    pacon=0;
                    gpSolConsolidar.disable();
                    stSolConsolidar.removeAll()
                    chkConsolidar.show();
                }
            }
        }
    });
    
    cbConsolidada.setValue(false);
    
    NombreCliente = new Ext.form.TextField({
        //disabled: true,
        fieldLabel: 'Nombre del Cliente',
        //readOnly: true,
        allowBlank: false,
        width: 200,
        anchor: '80%',
        value: 'DIP MARIEL'
    });
    
    EmpresaCliente = new Ext.form.TextField({
        disabled: true,
        fieldLabel: 'Procedencia',
        readOnly: true,
        allowBlank: false,
        width: 200,
        anchor: '80%',
        value: denom_ent
    });
    
    Codigo = new Ext.form.TextField({
        disabled: true,
        fieldLabel: 'Código',
        readOnly: true,
        allowBlank: false,
        width: 200,
        anchor: '80%',
        value: cc
    });

    EmpresaImport = new Ext.form.TextField({
        disabled: true,
        fieldLabel: 'Importadora',
        readOnly: true,
        allowBlank: false,
        width: 200,
        anchor: '80%',
        value: empimp
    });
    
    stTareas = new Ext.data.Store({
        url: 'listarProductos',
        autoLoad: true,
        listeners: {
            beforeload: function () {
                stTareas.baseParams.idplan711 = idplan711;
                stTareas.baseParams.tipo = 2;
            },
            load: function (mi, record, obj) {
                if(smSolicitudes711.getSelected()){
                    cbTareas.setValue(smSolicitudes711.getSelected().data.iddatostarea);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "iddepreciacionequipo"
        }, [{
                name: 'idproducto711'
            }, {
                name: 'codigocup'
            }, {
                name: 'suministro'
            }, {
                name: 'precio'
            }, {
                name: 'unidadmedida'
            }, {
                name: 'numeropieza'
            }])
    });
    
    cbTareas = new Ext.form.ComboBox({
        id: 'idcbTareas',
        emptyText: 'Seleccione',
        width: 200,
        disabled: false,
        store: stTareas,
        fieldLabel: 'Destino final',
        displayField: 'suministro',
        valueField: 'idproducto711',
        typeAhead: true,
        anchor: '80%',
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
        }
    });
    
    stGrupoComercial = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stGrupoComercial.baseParams.uri = 20;
            },
            load: function (t) {
                if(accion == 2){
                    cbGrupoComercial.setValue(smSolicitudes711.getSelected().data.iddatosgrupcomercial);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });
    
    cbGrupoComercial = new Ext.form.ComboBox({
        id: 'idcbGrupoComercial',
        emptyText: 'Seleccione',
        width: 200,
        disabled: false,
        store: stGrupoComercial,
        fieldLabel: 'Grupo comercial',
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '80%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
    
    stCodigoCUPDunas = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stCodigoCUPDunas.baseParams.uri = 24;
            },
            load: function (t) {
                 if(accion == 2){
                    cbCodigoCUPDunas.setValue(smSolicitudes711.getSelected().data.idcodigocupdunas);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });
    
    cbCodigoCUPDunas = new Ext.form.ComboBox({
        id: 'idcbCodigoCUPDunas',
        emptyText: 'Seleccione',
        width: 200,
        disabled: false,
        store: stCodigoCUPDunas,
        fieldLabel: 'Codigo CUP Dunas',
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '80%',
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
    
    stIndicadorAsociado = new Ext.data.Store({
        url: 'listarProductos',
        //autoLoad: true,
        listeners: {
            beforeload: function () {
                stIndicadorAsociado.baseParams.idplan711 = idplan711;
                stIndicadorAsociado.baseParams.tipo = 1;
            },
            load: function (mi, record, obj) {
                if(smSolicitudes711.getSelected()){
                    cbTareas.setValue(smSolicitudes711.getSelected().data.iddatostarea);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "iddepreciacionequipo"
        }, [{
                name: 'idproducto711'
            }, {
                name: 'codigocup'
            }, {
                name: 'suministro'
            }, {
                name: 'precio'
            }, {
                name: 'unidadmedida'
            }, {
                name: 'numeropieza'
            }])
    });
        
    cbIndicadorAsociado = new Ext.form.TextField({
        disabled: true,
        fieldLabel: 'Indicador',
        readOnly: true,
        allowBlank: false,
        width: 200,
        anchor: '80%',
        value: inn
    });
    /*
    stSolConsolidar = new Ext.data.Store({
        url: 'listarSolicitudes711',
        listeners: {
            beforeload: function () {
                gpSolConsolidar.getSelectionModel().suspendEvents();
                stSolConsolidar.removeAll();
                stSolConsolidar.baseParams.start = offset;
                stSolConsolidar.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                //stSolicitudes711.baseParams.identidad = identidadselectedPlanes;
                stSolConsolidar.baseParams.idempimp = cbEmpresasImp.getValue();
                stSolConsolidar.baseParams.idcc = cbCC.getValue();
                stSolConsolidar.baseParams.tipoplan = tipoplan;
                stSolConsolidar.baseParams.idsolicitud711 = idsolp;                
                stSolConsolidar.baseParams.esconsolidada = escon;
                stSolConsolidar.baseParams.paraconsolidar = true;                
                stSolConsolidar.baseParams.pacon = pacon;                
            },
            load: function (st, rec, obj) {
                //if(idsolp!=null){
                    ChequearSol(rec);
                //}				
		chkConsolidar.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idsolicitud711'
            }, {
                name: 'nosolicitud'
            }, {
                name: 'iddatosempimp'
            }, {
                name: 'iddatoscc'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripciongeneral'
            }, {
                name: 'totalgeneral'
            }, {
                name: 'identidadcliente'
            }, {
                name: 'identidaddestino'
            },{
                name: 'situacionpedido'
            },{
                name: 'idsp'
            },{
                name: 'nopedido'
            }, {
                name: 'fechapresped'
            }, {
                name: 'aperturacredito'
            }, {
                name: 'gerente'
            }, {
                name: 'antecedentes'
            }, {
                name: 'lugarentrega'
            }, {
                name: 'suministrototal'
            }, {
                name: 'otrosgastos'
            }, {
                name: 'idespecialista'
            }, {
                name: 'idgerente'
            }, {
                name: 'iddirector'
            }, {
                name: 'idcodigodecc'
            }, {
                name: 'valorreal'
            }, {
                name: 'iddatosff'
            }, {
                name: 'montoff'
            }, {
                name: 'estaconsolidada'
            }, {
                name: 'esconsolidada'
            }, {
                name: 'iddatostarea'
            }, {
                name: 'iddirectorecon'
            }, {
                name: 'idespecialistacs'
            }, {
                name: 'idcomprador'
            }, {
                name: 'idtiposolicitudplan'
            }, {
                name: 'nombreentidad'
            }, {
                name: 'codigoaprob'
            } 
        ]
                )
    });
   
    checkSolConsolidar = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (Sel, rowIndex,record) {
                auxcons=[];
                auxcons[0]=record.data.idsolicitud711;
                auxcons[1]=''+record.data.nosolicitud + ': \n' +record.data.antecedentes+'';
                valaux=false;
                for (j = 0; j < solseleccionadas.length; j++) {
                    if(record.data.idsolicitud711==solseleccionadas[j][0]){
                        valaux=true;
                    }
                }
               if(valaux==false)
                    solseleccionadas.push(auxcons);
            },
            rowdeselect: function (Sel, rowIndex,record) {
                auxmio =[]; 
                for (j = 0; j < solseleccionadas.length; j++) {
                    if(record.data.idsolicitud711 != solseleccionadas[j][0]){
                        auxmio.push(solseleccionadas[j]);
                    }
                }
                solseleccionadas =[]; 
                solseleccionadas = auxmio; 
            },
            selectionchange: function () {
                 btnConsolidar.enable(); 
                 btnVerificarConsolidado.enable();
            } 
        }
    });
    
    cmSolConsolidar = new Ext.grid.ColumnModel([checkSolConsolidar,
        {
            header: "No.Solicitud",
            dataIndex: 'nosolicitud',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Entidad",
            dataIndex: 'nombreentidad',
            width: 200,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Descripción general",
            dataIndex: 'descripciongeneral',
            id: 'expandir',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Total general",
            dataIndex: 'totalgeneral',
            width: 100,
            renderer: RenderaddCommas,
            sortable: true
        }
    ]);
    
    filtrosSolConsolidar = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'nosolicitud'
            }, {
                type: 'string',
                dataIndex: 'nombreentidad'
            }, {
                type: 'string',
                dataIndex: 'descripciongeneral'
            }/*, {
                type: 'numeric',
                dataIndex: 'totalgeneral'
            }]
    /*});
    
    btnLimpiarGpSC = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        disabled: false,
        handler: function () {
            filtrosSolConsolidar.clearFilters();
        }
    });
    
    btnConsolidar = new Ext.Button({
        handler: function () {
            ConsolidarSeleccionados(1);
        },
        tooltip: 'Consolidar seleccionados',
        disabled: true,
        iconCls: 'guardar',
    });
    
    btnVerificarConsolidado = new Ext.Button({
        handler: function () {
            ConsolidarSeleccionados(2);
        },
        tooltip: 'Revisar consolidados',
        disabled: true,
        iconCls: 'comprobante'
    });
    
    gpSolConsolidar = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stSolConsolidar,
        sm: checkSolConsolidar,
        disabled: true,
        region: 'center',
        width: '100%',
        height: window.innerHeight-225,
        autoExpandColumn: 'expandir',
        cm: cmSolConsolidar,
        title: 'Solicitudes a consolidar',
        tbar: [btnConsolidar,btnVerificarConsolidado],
        bbar: new Ext.PagingToolbar({
            pageSize: 50, 
            store: stSolConsolidar,
            displayInfo: true,
            items: [btnLimpiarGpSC],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        plugins: filtrosSolConsolidar,
        loadMask: {
            msg: 'Cargando ...'
        },
        listeners: {
            
        }
    });
    
    chkConsolidar = new Ext.form.Checkbox({
        align: 'right',
        fieldLabel: 'Solicitud para consolidar',
        listeners: {
            check: function (ck, t) {
            }
        }
    });*/
	
    pDatosTab1 = new Ext.Panel({
        //id: 'pDatosGen',
        frame: true,
        //layout: 'fit',
//        width: w,
        height: window.innerHeight-125,
        defaults:{labelAlign:'top'},
        items: [{
                layout: 'column',
                items: [/*{
                        columnWidth: 0.1,
                        layout: 'form',
                        items: cbConsolidada
                    },*/ {
                        columnWidth: 1,
                        layout: 'form',
                        items: NombreCliente
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: EmpresaCliente
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: Codigo
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: cbTareas
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: EmpresaImport
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: cbCodigoCUPDunas
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: cbGrupoComercial
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: cbIndicadorAsociado
                    }/*, {
                        columnWidth: 1,
                        layout: 'form',
                        items: gpSolConsolidar
                    }, {
                        columnWidth: 1,
                        labelAlign:'right',
			labelWidth: 150,
                        layout: 'form',
                        items: chkConsolidar
                    }*/
                ]

            }]
    });
    
    if(cc.indexOf('100')==-1){
        cbIndicadorAsociado.fieldLabel='';
        cbIndicadorAsociado.hideLabel=true;
        cbIndicadorAsociado.hide();
    }else{
        stIndicadorAsociado.reload();
        cbIndicadorAsociado.fieldLabel='Indicador';
    }
    
    //fin del tab1
    
    //Incicio del tab2
    DescripGen = new Ext.form.TextField({
        disabled: false,
        fieldLabel: 'Descripción General',
        readOnly: false,
        allowBlank: false,
        width: '100%',
    });
    
    stProductos1 = new Ext.data.Store({
        url: 'listarProductosSeleccionados',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idproducto711'
            }, {
                name: 'codigocup'
            }, {
                name: 'suministro'
            }, {
                name: 'precio'
            }, {
                name: 'cantidad'
            },{
                name: 'valor'
            },{
                name: 'trimestre1'
            },{
                name: 'trimestre2'
            },{
                name: 'trimestre3'
            },{
                name: 'trimestre4'
            }, {
                name: 'descrip'
            }, {
                name: 'descripcion'
            },{
                name: 'urlimagen'
            },{
                name: 'nombreimg'
            }, {
                name: 'unidadmedida'
            }, {
                name: 'numeropieza'
            }
        ]),
        listeners: {
            beforeload: function (store, record, options) {
                Ext.Ajax.timeout = 6400000;
                stProductos1.removeAll();
                stProductos1.baseParams.idempimp = cbEmpresasImp.getValue();
                stProductos1.baseParams.productossel = Ext.encode(productossel);                
                stProductos1.baseParams.idsolp = idsolp;                
            },
            load: function (store, record, options) {
                if (accion == 2) {
                    CargarModificarProd(store);
                }
            }
        }
    });
    
    stProductosLista = new Ext.data.SimpleStore({
        fields: [{
                name: 'idproducto711'
            }, {
                name: 'codigocup'
            }, {
                name: 'suministro'
            }, {
                name: 'precio'
            }, {
                name: 'cantidad'
            },{
                name: 'valor'
            },{
                name: 'trimestre1'
            },{
                name: 'trimestre2'
            },{
                name: 'trimestre3'
            },{
                name: 'trimestre4'
            }, {
                name: 'descrip'
            }, {
                name: 'descripcion'
            },{
                name: 'urlimagen'
            },{
                name: 'nombreimg'
            }, {
                name: 'unidadmedida'
            }, {
                name: 'numeropieza'
            }
        ]
    });
        
    cmProductos1 = new Ext.grid.ColumnModel([
        new Ext.grid.RowNumberer(),{
            header: "Descripción de suministro",
            dataIndex: 'suministro',
            width: 370,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Numero de Pieza",
            tooltip: "Numero de Pieza",
            dataIndex: 'numeropieza',
            id: 'expandir',
            width: 50,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "UM",
            dataIndex: 'descrip',
            width: 50,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Precio",
            tooltip: "Precio",
            dataIndex: 'precio',
            width: 100,
            align: 'rigth',
            renderer: RenderaddCommas,
            editor: new Ext.form.TextField({
                id: 'precioeditable',
                allowNegative: true,
                regex: /^\s*-?((\d{1,3}(\,(\d){3})*)|\d*)(.\d{1,6})?\?*$/,
                allowBlank: false,
                maxLength: 30,
                listeners: {
                    change: function (me, nv, ov) {
                        me.setValue(addCommas(nv));
                    }
                }
            })
        },{
            header: "Cantidad",
            tooltip: "Cantidad",
            dataIndex: 'cantidad',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                decimalPrecision: 6,
                allowBlank: false,
                maxLength: 30
            })
        },{
            header: "Valor",
            dataIndex: 'valor',
            id: 'expandir',
            width: 100,
            renderer: RenderaddCommas,
            sortable: true
        },{
            header: "I",
            tooltip: "I",
            dataIndex: 'trimestre1',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                decimalPrecision: 6,
                allowBlank: false,
                maxLength: 19
            })
        },{
            header: "II",
            tooltip: "II",
            dataIndex: 'trimestre2',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                decimalPrecision: 6,
                allowBlank: false,
                maxLength: 19
            })
        },{
            header: "III",
            tooltip: "III",
            dataIndex: 'trimestre3',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                decimalPrecision: 6,
                allowBlank: false,
                maxLength: 19
            })
        },{
            header: "IV",
            tooltip: "IV",
            dataIndex: 'trimestre4',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                decimalPrecision: 6,
                allowBlank: false,
                maxLength: 19
            })
        },{
            header: "Descripción",
            tooltip: "Descripción",
            dataIndex: 'descripcion',
            width: 150,
            align: 'rigth',
            renderer: crearToolTip
        }
    ]);
    
    smProductos1 = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            beforerowselect: function (sm, y, z, record) {
                btnDelProductos.enable();
                btnDescripcion.enable();
                btnActPreciosHijas.enable();
            }
//            ,
//            rowdeselect :function (sm, y, z, record) {
//                btnDelProductos.disable();
//                btnDescripcion.disable();
//            }
        }
    });
    
    btnLimpiarProd = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        id: 'btntodos',
        disabled: false,
        handler: function () {
            filtrosProductos1.clearFilters();
        }
    });
    
    
    btnAddProductos = new Ext.Button({
        handler: function () {
            crearIUAddIndicadores();
        },
        tooltip: 'Adicionar productos',
        disabled: false,
        iconCls: 'adicionar',
    });
    
    btnDelProductos = new Ext.Button({
        handler: function () {
            EliminarSeleccionProducto();
        },
        tooltip: 'Eliminar producto',
        disabled: true,
        iconCls: 'eliminar',
    }); 
    
    btnDescripcion = new Ext.Button({
        handler: function () {
            winDescripcion();
        },
        tooltip: 'Agregar especificaciones técnicas',
        disabled: true,
        iconCls: 'modificar',
    });    
    
    btnImportarProdCUP = new Ext.Button({
        handler: function () {
            ImportarProd(1);
        },
        tooltip: 'Importar productos por código CUP',
        //disabled: true,
        iconCls: 'importar',
    });

    btnImportarProdNump = new Ext.Button({
        handler: function () {
            ImportarProd(2);
        },
        tooltip: 'Importar productos por número de pieza',
        //disabled: true,
        iconCls: 'importar',
    });
    
    btnImportarPrecNump = new Ext.Button({
        handler: function () {
            ImportarProd(3);
        },
        tooltip: 'Actualizar precios por número de pieza',
        hidden: true,
        iconCls: 'importar',
    });
    
    btnActPreciosHijas = new Ext.Button({
        handler: function () {
            WpPrecioConsolidados();
        },
        tooltip: 'Actualizar precios en las solicitudes consolidadas',
        disabled: true,
        hidden: true,
        iconCls: 'actualizar',
    });
    
    totalgeneralFOB = new Ext.form.TextField({
        allowNegative: true,
        value: 0,
        //decimalPrecision: 2,
        //regex: /^\s*-?((\d{1,3}(\,(\d){3})*)|\d*)(.\d{1,2})?\?*$/,
        allowBlank: false,
        maxLength: 30,
        with : '100',
        readOnly: true,
        listeners: {
//            change: function (me, nv, ov) {
//                //console.log(nv);
//                me.setValue(addCommas(nv));
//            }
        }
    });
    
    porcientodeGastosFLete = new Ext.form.NumberField({
        allowNegative: true,
        decimalPrecision: 5,
        allowBlank: false,
        maxLength: 19,
        maxValue: 100,
        minValue: 0,
        allowBlank: false,
                with : '50',
                value: 5,
        listeners: {
            change: function (me, nv, ov) {
                total = 0;
                auxv='';
                for (i = 0; i < gpProductos1.getStore().data.items.length; i++) {
                    auxv = ''+gpProductos1.getStore().data.items[i].data.valor;
                    total += parseFloat(auxv.replace(/,/g,''));
                }
                totalgeneralFOB.setValue(addCommas(parseFloat(total).toFixed(6)));
                valorporcientoflete = porcientodeGastosFLete.getValue() / 100;
                otrof = (parseFloat(total) * parseFloat(valorporcientoflete)).toFixed(6);
                valorporcientoseguro = porcientodeGastosSeguridad.getValue() / 100;
                otroS = (parseFloat(total) * parseFloat(valorporcientoseguro)).toFixed(6);
                totalg= (parseFloat(total)+ parseFloat(otrof) +parseFloat(otroS)).toFixed(6);
                totalgeneral.setValue(addCommas(totalg));
                ActualizarListProd();
            }
        }
    });
    
    porcientodeGastosSeguridad = new Ext.form.NumberField({
        allowNegative: true,
        decimalPrecision: 5,
        allowBlank: false,
        maxLength: 19,
        maxValue: 100,
        minValue: 0,
        allowBlank: false,
                with : '50',
                value: 2,
        listeners: {
            change: function (me, nv, ov) {
                total = 0;
                auxv='';
                for (i = 0; i < gpProductos1.getStore().data.items.length; i++) {
                    auxv = ''+gpProductos1.getStore().data.items[i].data.valor;
                    total += parseFloat(auxv.replace(/,/g,''));
                }
                totalgeneralFOB.setValue(addCommas(parseFloat(total).toFixed(6)));
                valorporcientoflete = porcientodeGastosFLete.getValue() / 100;
                otrof = (parseFloat(total) * parseFloat(valorporcientoflete)).toFixed(6);
                valorporcientoseguro = porcientodeGastosSeguridad.getValue() / 100;
                otroS = (parseFloat(total) * parseFloat(valorporcientoseguro)).toFixed(6);
                totalg= (parseFloat(total)+ parseFloat(otrof) +parseFloat(otroS)).toFixed(6);
                totalgeneral.setValue(addCommas(totalg));
                ActualizarListProd();
            }
        }
    });
    
    gpProductos1 = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stProductos1,
        sm: smProductos1,
        disabled: false,
        region: 'center',
        width: '100%',
        height: window.innerHeight-225,
        autoExpandColumn: 'expandir',
        cm: cmProductos1,
        title: 'Suministros a importar',
        tbar: [btnAddProductos,'-',btnDelProductos, '-',btnDescripcion,'-',btnImportarProdCUP, '-',btnImportarProdNump,'-',btnImportarPrecNump,'-',btnActPreciosHijas ],
        bbar: new Ext.PagingToolbar({
            store: stProductos1,
            displayInfo: true,
            items: ['->','Total en suministro:',totalgeneralFOB,'-','Flete %:', porcientodeGastosFLete, '-','Seguro %:', porcientodeGastosSeguridad],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        //plugins: filtrosProductos1,
//        loadMask: {
//            msg: 'Cargando ...'
//        },
        listeners: {
            celldblclick: function (me, row_id, col_id) {
                gpProductos1.getColumnModel().setEditable(col_id, true);

            },
            afteredit: function (e) {
                evalor='';
                if (e.field == 'cantidad') {
                    evalor=''+e.record.data.precio;
                    valor = (parseFloat(e.record.data.cantidad) * parseFloat(evalor.replace(/,/g, ''))).toFixed(6);
                    smProductos1.selectRow(e.row);
                    smProductos1.getSelected().data.valor = addCommas(valor);
                    smProductos1.getSelected().commit();
                    smProductos1.selectNext();
                }
                if (e.field == 'precio') {
                    evalor=''+e.record.data.precio;
                    valor = (parseFloat(e.record.data.cantidad) * parseFloat(evalor.replace(/,/g, ''))).toFixed(6);
                    smProductos1.selectRow(e.row);
                    smProductos1.getSelected().data.valor = addCommas(valor);
                    smProductos1.getSelected().commit();
                    smProductos1.selectNext();
                }
                total =0;
                auxv='';
                for (i = 0; i < gpProductos1.getStore().data.items.length; i++) {
                    auxv=''+gpProductos1.getStore().data.items[i].data.valor;
                    total += parseFloat(auxv.replace(/,/g,''));
                }
                totalgeneralFOB.setValue(addCommas(total.toFixed(6)));
                valorporcientoflete = porcientodeGastosFLete.getValue() / 100;
                otrof = (parseFloat(total) * parseFloat(valorporcientoflete)).toFixed(6);
                valorporcientoseguro = porcientodeGastosSeguridad.getValue() / 100;
                otroS = (parseFloat(total) * parseFloat(valorporcientoseguro)).toFixed(6);
                totalg= (parseFloat(total)+ parseFloat(otrof) +parseFloat(otroS)).toFixed(6);
                totalgeneral.setValue(addCommas(totalg));
                ActualizarListProd();
            }
        }
    });
    
    totalgeneral = new Ext.form.TextField({
        allowNegative: true,
        fieldLabel: 'Total general',
        value: 0,
        //decimalPrecision: 2,
        //regex: /^\s*-?((\d{1,3}(\,(\d){3})*)|\d*)(.\d{1,2})?\?*$/,
        allowBlank: false,
        maxLength: 30,
        with : '100',
        readOnly: true,
        listeners: {
//            change: function (me, nv, ov) {
//                //console.log(nv);
//                me.setValue(addCommas(nv));
//            }
        }
    });
    
    pDatosTab2 = new Ext.Panel({
        frame: true,
//        width: w,
        height: window.innerHeight-125,
        //layout: 'fit',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: DescripGen
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: gpProductos1
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: totalgeneral
                    }
                ]

            }]
    });
    //fin del tab2
    
    //Inicio del tab3
    AntecedenteCompra = new Ext.form.TextArea({
        //id: 'AntecedenteCompra',
        allowBlank: false,
        fieldLabel: 'Antecedentes de compra',
        emptyText: 'Antecedentes',
        width: '100%',
//        layout: 'fit',
        height: window.innerHeight-250, 
    });
    
    LugarEntrega = new Ext.form.TextField({
        disabled: false,
        fieldLabel: 'Lugar de entrega',
        readOnly: false,
        allowBlank: false,
        width: '100%',
        value: direccdest
    });
    
    textServiciosSol= new Ext.form.Label({
        text: 'Servicios solicitados:'
    });
        
    pServiciosSol = new Ext.Panel({
        width: 1000,
        height: 450,
        items: {
                    xtype:'checkboxgroup',
                    id: 'checkservsol',
                    listeners: {
                        change: function(field, newValue){
                            //console.log(newValue);
                        }
                    },
                    items: [{
                        boxLabel: 'Garantía',
                        name: 'fav-garantia',
                        inputValue: '5045'
                    },{
                        boxLabel: 'Post venta',
                        name: 'fav-postventa',
                        inputValue: '5046'
                    },{
                        boxLabel: 'Asistencia técnica',
                        name: 'fav-asistencia',
                        inputValue: '5047'
                    },{
                        boxLabel: 'Documentación',
                        name: 'fav-documentacion',
                        inputValue: '5048'
                    }]
            }
    });
    
    pDatosTab3 = new Ext.Panel({
        //id: 'pDatosTab3',
        frame: true,
//        width: w,
        height: window.innerHeight-125,
        //layout: 'fit',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: AntecedenteCompra
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: LugarEntrega
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        //items: textServiciosSol
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: textServiciosSol
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: pServiciosSol
                    }
                ]

            }]
    });
    //fin del tab3

    //Inicio del tab4
    textRC= new Ext.form.Label({
        text: 'Representantes del cliente:'
    });
    
    stDirector = new Ext.data.Store({
        autoLoad: true,
        url: 'listarPersonas',
        listeners: {
            beforeload: function () {
                stDirector.baseParams.tipopers = 1;
                stDirector.baseParams.identidad = identidadselectedPlanes;
            },
            load: function (t) {
                direct = t.data.items[0].data.idpersonadel711;
                Director.setValue(t.data.items[0].data.nombreapell);
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idpersonadel711"
        }, [{
                name: 'idpersonadel711'
            }, {
                name: 'nombreapell'
            }]
                )
    });
      
    Director = new Ext.form.TextField({
        disabled: true,
        fieldLabel: 'Representante del consumidor',
        readOnly: true,
        allowBlank: false,
        width: 200,
        anchor: '80%',
    });
    
    stDirectorEcon = new Ext.data.Store({
        autoLoad: true,
        url: 'listarPersonas',
        listeners: {
            beforeload: function () {
                stDirectorEcon.baseParams.tipopers = 5;
                stDirectorEcon.baseParams.identidad = identidadselectedPlanes;
            },
            load: function (t) {
                directecon = t.data.items[0].data.idpersonadel711;
                DirectorEconomico.setValue(t.data.items[0].data.nombreapell);
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idpersonadel711"
        }, [{
                name: 'idpersonadel711'
            }, {
                name: 'nombreapell'
            }]
                )
    });
    
    DirectorEconomico = new Ext.form.TextField({
        disabled: true,
        fieldLabel: 'Representante del suministrador',
        readOnly: true,
        allowBlank: false,
        width: 200,
        anchor: '80%',
    });
    
    stEspecialista = new Ext.data.Store({
        autoLoad: true,
        url: 'listarPersonas',
        listeners: {
            beforeload: function () {
                stEspecialista.baseParams.tipopers = 2;
                stEspecialista.baseParams.identidad = identidadselectedPlanes;
            },
            load: function (t) {
                if (accion == 2) {
                    if (smSolicitudes711.getSelected().data.identidaddestino) {
                        cbEspecialista.setValue(smSolicitudes711.getSelected().data.idespecialista);
                    }
                }
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idpersonadel711"
        }, [{
                name: 'idpersonadel711'
            }, {
                name: 'nombreapell'
            }]
                )
    });
    
    cbEspecialistaEmpAprueba = new Ext.form.ComboBox({
        id: 'idcbEspecialistaEmpAprueba',
        emptyText: 'Seleccione',
        width: 200,
        disabled: false,
        store: stEspecialista,
        fieldLabel: 'Especialista que solicita la oferta',
        displayField: 'nombreapell',
        valueField: 'idpersonadel711',
        typeAhead: true,
        anchor: '80%',
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
        }
    });
    
    textRS= new Ext.form.Label({
        text: 'Representantes del suministrador:'
    });
    
    stEspecialistaSuministrador = new Ext.data.Store({
        autoLoad: true,
        url: 'listarPersonas',
        listeners: {
            beforeload: function () {
                stEspecialistaSuministrador.baseParams.tipopers = 4;
                //stEspecialistaSuministrador.baseParams.identidad = identidadselectedPlanes;
            },
            load: function (t) {
                if (accion == 2) {
                    if (smSolicitudes711.getSelected().data.identidaddestino) {
                        cbEspecialistaSuministrador.setValue(smSolicitudes711.getSelected().data.idespecialista);
                    }
                }
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idpersonadel711"
        }, [{
                name: 'idpersonadel711'
            }, {
                name: 'nombreapell'
            }]
                )
    });
    
    cbEspecialistaSuministrador = new Ext.form.ComboBox({
        id: 'idcbEspecialistaSuministrador',
        emptyText: 'Seleccione',
        width: 200,
        disabled: false,
        store: stEspecialistaSuministrador,
        fieldLabel: 'Especialista de control y seguimiento',
        displayField: 'nombreapell',
        valueField: 'idpersonadel711',
        typeAhead: true,
        anchor: '80%',
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
        }
    });
    
    stEspecialistaComprador = new Ext.data.Store({
        //autoLoad: true,
        url: 'listarPersonas',
        listeners: {
            beforeload: function () {
                stEspecialistaComprador.baseParams.tipopers = 6;
                //stEspecialistaSuministrador.baseParams.identidad = identidadselectedPlanes;
            },
            load: function (t) {
                if (accion == 2) {
                    if (smSolicitudes711.getSelected().data.identidaddestino) {
                        cbEspecialistaComprador.setValue(smSolicitudes711.getSelected().data.idespecialista);
                    }
                    cargandoDatosAModificar(accion);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idpersonadel711"
        }, [{
                name: 'idpersonadel711'
            }, {
                name: 'nombreapell'
            }]
                )
    });
    
    cbEspecialistaComprador = new Ext.form.ComboBox({
        id: 'idcbEspecialistaComprador',
        emptyText: 'Seleccione',
        width: 200,
        disabled: false,
        store: stEspecialistaComprador,
        fieldLabel: 'Comprador',
        displayField: 'nombreapell',
        valueField: 'idpersonadel711',
        typeAhead: true,
        anchor: '80%',
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        loadingText: 'Cargando...',
        allowBlank: true,
        listeners: {
        }
    });
    
    pDatosTab4 = new Ext.Panel({
        frame: true,
        width: w,
        height: window.innerHeight-125,
        //layout: 'fit',
        items: [/*{
                        columnWidth: 1,
                        layout: 'form',
                        items: textRS
                    },{
                        columnWidth: 1,
                        layout: 'form',
                        //items: 
                    }, {
                layout: 'column',
                items: [ {
                        columnWidth: 1,
                        layout: 'form',
                        items: 
                        {
                            layout:'column',
                            items:[
                                {
                                columnWidth: 0.9,
                                layout: 'form',
                                items: [cbEspecialistaSuministrador]
                            }
                            ]
                        }
                                
                    },{
                        columnWidth: 1,
                        layout: 'form',
                        items: 
                        {
                            layout:'column',
                            items:[
                                {
                                columnWidth: 0.9,
                                layout: 'form',
                                items: [cbEspecialistaComprador]
                            }
                            ]
                        }
                                
                    },{
                        columnWidth: 1,
                        layout: 'form',
                        //items: 
                    },{
                        columnWidth: 1,
                        layout: 'form',
                        items: textRC
                    },*/ {
                        columnWidth: 1,
                        layout: 'form',
                        items: 
                        {
                            layout:'column',
                            items:[
                                {
                                columnWidth: 0.9,
                                layout: 'form',
                                items: [Director]
                            }
                            ]
                        }
                                
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: 
                        {
                            layout:'column',
                            items:[
                                {
                                columnWidth: 0.9,
                                layout: 'form',
                                items: [DirectorEconomico]
                            }
                            ]
                        }
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: 
                        {
                            layout:'column',
                            items:[
                                {
                                columnWidth: 0.9,
                                layout: 'form',
                                items: [cbEspecialistaEmpAprueba]
                            }
                            ]
                        }
                                
                    //}
                //]

            }]
    });
    //fin del tab4
    
    //TabPanel General
    tabsolicitud = new Ext.TabPanel({
        activeTab: 0,
        //layout: 'fit',
        plain:true,
        defaults:{autoScroll: true},
        items: [{
                title: 'Datos Generales',
                layout: 'fit',
                html: "<div id = 'datosgen' ></div>",
                items: [pDatosTab1]
            }, {
                title: 'Datos de productos',
                layout: 'fit',
                id: 'productos',
                html: "<div id = 'productos' ></div>",
                items: [pDatosTab2]
            },{
                title: 'Datos complementarios',
                layout: 'fit',
                html: "<div id = 'datoscomplementarios' ></div>",
                items: [pDatosTab3]
            },{
                title: 'Representantes',
                layout: 'fit',
                html: "<div id = 'representantes' ></div>",
                items: [pDatosTab4]
            }
        ],
        listeners: {
             tabchange : function (panel,tab){
                 tab.doLayout(true);
                 if(tab.id== 'productos'){
                     stProductosLista.removeAll();
                     stProductosLista.loadData(prod);
                     gpProductos1.reconfigure(stProductosLista, cmProductos1);
                 }
             }
        }
    });

    pfinal = new Ext.FormPanel({
        id: 'pfinal',
//        layout: 'fit',
        frame: true,
        items: [tabsolicitud]
    });
    ventanaCrud = null;
    if(accion==1){
        idsolp=null;
        escon=null;
        prod=[];
        ventanaCrud = new Ext.Window({
            title: 'Adicionar Solicitud 711',
            //id: 'ventanaCrud',
            maximized : true,
            constrain: true,
            layout: 'fit',
            resizable: false,
            frame: true,
            modal: true,
            buttons: [btnCancelarSol/*, btnAplicarSol*/, btnAceptarSol],
            items: [pfinal],
            closeAction: 'destroy',
            listeners: {
                beforeshow: function () {
                }
            }
        });
    }
    if(accion==2){
        ventanaCrud = new Ext.Window({
            title: 'Modificar Solicitud 711',
            //id: 'ventanaCrud',
            maximized : true,
            constrain: true,
            layout: 'fit',
            resizable: false,
            frame: true,
            modal: true,
            buttons: [btnCancelarSol, btnAceptarSol],
            items: [pfinal],
            closeAction: 'destroy',
            listeners: {
                beforeshow: function () {
                }
            }
        });
        //cbConsolidada.disable();
        //gpSolConsolidar.disable();
        if(!btnAdicionar711.isVisible()){
            btnAceptarSol.hide();
        }
        if(rec.data.idsp == '5023'){
            btnImportarPrecNump.show();
        }
    }
    /*if(btnAprobar.hidden == true){
       //cbConsolidada.disable();
       gpSolConsolidar.hide();
    }*/
    mymask.show();
    ventanaCrud.show();
    stEspecialistaComprador.reload();
    if(accion==1){
        mymask.hide();
    }
}

function SeleccionarProductos(){
    offsetproductos=0;
    
    btnCancelarSel = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarSel',
        tooltip: perfil.etiquetas.lbTtCancenlarSol,
        text: 'Cancelar',
        handler: function () {
            ventanaProductos.hide()
        }
    });
    
    btnAceptarSel = new Ext.Button({
        iconCls: 'aceptar',
        disabled: true,
        id: 'btnAceptarSel',
        text: 'Aceptar',
        tooltip: perfil.etiquetas.lbTtAceptarSol,
        handler: function () {
            SeleccionProductos();
            ventanaProductos.hide();
        }
    });
    
    btnAdicionarProd = new Ext.Button({
        iconCls: 'adicionar',
        id: 'btnAdicionarProd',
        text: 'Adicionar producto',
        tooltip: 'Adicionar producto',
        //disabled: false,
        handler: function () {
            winFpProductos();
        }
    });
    
    btnLimpiarProductosSel = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarProductosSel',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        handler: function () {
            filtrosProductosSel.clearFilters();
        }
    });
    
    //Parte para seleccionar productos
    checkProductosSel = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                if (checkProductosSel.getSelections().length >= 1) {
                    btnAceptarSel.enable();
                    //Ext.getCmp('btnaceptarasoc').enable();
                }

            },
            rowdeselect: function () {
                if (checkProductosSel.getSelections().length < 1) {
                    btnAceptarSel.disable();
                    //Ext.getCmp('btnaceptarasoc').disable();
                }

            }
        }
    });

    cmProductosSel = new Ext.grid.ColumnModel([checkProductosSel,
        {
            header: 'Código CUP',
            tooltip: 'Código CUP',
            width: 80,
            sortable: true,
            dataIndex: 'codigocup',
            renderer: crearToolTip
        }, {
            width: 150,
            id: 'expandir',
            sortable: true,
            header: 'Suministro',
            tooltip: 'Suministro',
            dataIndex: 'suministro',
            renderer: crearToolTip
        },{
            header: 'Número de Pieza',
            tooltip: 'Número de Pieza',
            width: 80,
            sortable: true,
            dataIndex: 'numeropieza',
            renderer: crearToolTip
        }, {
            width: 50,
            header: 'Unidad de medida',
            tooltip: 'Unidad de medida',
            dataIndex: 'unidadmedida',
            align: 'right',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: 'Precio',
            tooltip: 'Precio',
            width: 80,
            sortable: true,
            dataIndex: 'precio',
            align: 'right',
            renderer: crearToolTip
        }, {
            header: 'Cantidad',
            tooltip: 'Cantidad',
            width: 80,
            sortable: true,
            dataIndex: 'cantidad',
            align: 'right',
            renderer: crearToolTip
        }]);
    
    filtrosProductosSel = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'codigocup'
            }, {
                type: 'string',
                dataIndex: 'suministro'
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'string',
                dataIndex: 'unidadmedida'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'cantidad'
            }]
    });
    mymask.show();
    stProductosSel = new Ext.data.Store({
        url: 'listarProductos',
        autoLoad: true,
        listeners: {
            beforeload: function () {
                stProductosSel.baseParams.start = offsetproductos;
                stProductosSel.baseParams.idempimp = cbEmpresasImp.getValue();
                stProductosSel.baseParams.idcc = cbCC.getValue();
                stProductosSel.baseParams.idplan711 = idplan711;
            },
            load: function (mi, record) {
//                cambiarTituloFiltrar(gpProductosSel, filtrosProductosSel, perfil.etiquetas.lbGridEquip);
//                stact = record.length;
                //controlarObjetosEquipoiacion();
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "iddepreciacionequipo"
        }, [{
                name: 'idproducto711'
            }, {
                name: 'codigocup'
            }, {
                name: 'suministro'
            }, {
                name: 'precio'
            }, {
                name: 'unidadmedida'
            }, {
                name: 'numeropieza'
            }, {
                name: 'cantidad'
            }])
    });
    
    gpProductosSel = new Ext.grid.GridPanel({
        id: 'gpProductosSel',
        store: stProductosSel,
        plugins: filtrosProductosSel,
        sm: checkProductosSel,
        cm: cmProductosSel,
        frame: true,
        layout: 'fit',
        autoExpandColumn: 'expandir',
        height: 400,
        width: 500,
        margins: '2 2 2 2',
        //anchor: '95%',
        title: perfil.etiquetas.lbGridEquip,
        bbar: new Ext.PagingToolbar({
            store: stProductosSel,
            displayInfo: true,
            items: ['-', btnLimpiarProductosSel],
            listeners: {
                beforechange: function (p, e) {
                    offsetproductos = e.start;
                }
            }
        })
    });
    //fin del panel de productos  
    
    ventanaProductos = null;
    ventanaProductos = new Ext.Window({
        title: 'Seleccionar productos',
        width: 500,
        constrain: true,
        layout: 'fit',
        height: 400,
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnAdicionarProd, btnCancelarSel, btnAceptarSel],
        items: [gpProductosSel],
        closeAction: 'destroy',
        listeners: {
            beforeshow: function () {
            }
        }
    });
    filtrosProductosSel.clearFilters();
    if(cc.indexOf('100')==-1){
        btnAdicionarProd.hide();
    }
    ventanaProductos.show();
}

function AdicionarModificar(accion, band){
    //Datos a enviar
    //Datos del tab1 Datos Genereles
    var idempcliente = identidadselectedPlanes;
    var idempimp = cbEmpresasImp.getValue();
    var grcomercial = cbGrupoComercial.getValue();
    var idcc = cbCC.getValue();
    var idtarea = cbTareas.getValue();
    var nombrecliente = NombreCliente.getValue();
    //var esconsolidada = cbConsolidada.getValue();
    
    //Datos del Tab2 Datos de Productos
    var productos = [];
    var productosencero=false;
    var cadenaproducto='';
    for (i = 0; i < gpProductos1.getStore().data.items.length; i++) {
        productos.push(gpProductos1.getStore().data.items[i].data);
        if(gpProductos1.getStore().data.items[i].data.valor==0){
            productosencero=true;
            cadenaproducto+=gpProductos1.getStore().data.items[i].data.suministro+' Precio: '+
                            gpProductos1.getStore().data.items[i].data.precio+' Cantidad: '+
                            gpProductos1.getStore().data.items[i].data.cantidad+' Valor: '+
                            gpProductos1.getStore().data.items[i].data.valor+' , fila: '+(i+1);
        }
    }
    var descripgen = DescripGen.getValue();
    stri = ''+totalgeneral.getValue();
    var suminist = parseFloat(totalgeneralFOB.getValue().replace(/,/g,''));
    var totalg = parseFloat(stri.replace(/,/g,''));
    var flete = porcientodeGastosFLete.getValue();
    var seguro = porcientodeGastosSeguridad.getValue();
    var montott = parseFloat(monto);
        
    //Datos del Tab3 Datos Complementarios
    var antecedentes = AntecedenteCompra.getValue();
    var lugarent = LugarEntrega.getValue();
    //var servsol = [];
    if(Ext.getCmp('checkservsol').items.items) {
        if (Ext.getCmp('checkservsol').items.items.length > 0) {
            servsol = [];
            for (i = 0; i < Ext.getCmp('checkservsol').items.items.length; i++) {
                if (Ext.getCmp('checkservsol').items.items[i].checked == true) {
                    servsol.push(Ext.getCmp('checkservsol').items.items[i].inputValue);
                }
            }
        }
    }
    
    //Datos del Tab4 Representantes
    var iddirector = direct;
    var iddirectorecon = directecon;
    var idespecialista = cbEspecialistaEmpAprueba.getValue();
    var idespecialistacs = cbEspecialistaSuministrador.getValue();
    var idcomprador = cbEspecialistaComprador.getValue();
    var indicador = cbIndicador.getValue();
    var idcodigocupdunas = cbCodigoCUPDunas.getValue();
    //var paraconsolidar = chkConsolidar.getValue();
	
    var idsol =null;
    if(accion==2){
        idsol = smSolicitudes711.getSelected().data.idsolicitud711;
        montott=parseFloat(parseFloat(montott)+parseFloat(smSolicitudes711.getSelected().data.totalgeneral)).toFixed(6);
    }
//    if(iddirector==null||iddirectorecon==null){
//        mostrarMensaje(2, 'La solicitud no se puede realizar pues falta asociarle a la empresa alguno de los representantes');
//    }
    if(totalg==0 || productosencero==true){
        if(productos.length==0){
            mostrarMensaje(2, 'La solicitud no se puede realizar si no hay productos asociados');
        }else{
            mostrarMensaje(2, 'La solicitud no se puede realizar pues el(los) producto(s) '+cadenaproducto+' contiene valores en cero');
        }
        
    }else {
        if (montott >= totalg /*|| esconsolidada == true*/) {
            //Entro aqui mienstras el monto disponible sea mayor o igual al valor del pedido
            mymask.show();
            Ext.Ajax.request({
                url: 'adicionarModificarSolicitud',
                params: {
                    idejercicio: cbEjercicioPlanes.getValue(),
                    ejercicio: cbEjercicioPlanes.getRawValue(),
                    idempcliente : idempcliente,
                    nombrecliente : nombrecliente,
                    nombreentidad : denom_ent,
                    idempimp : idempimp,
                    idgrupcom : grcomercial,
                    idcc : idcc,
                    idtarea: idtarea,
                    idcodigocupdunas: idcodigocupdunas,
                    //esconsolidada: esconsolidada,
		    //paraconsolidar: paraconsolidar,
                    //Datos del Tab2 Datos de Productos
                    productos : Ext.encode(productos),
                    descripgen : descripgen,
                    totalg : totalg,
                    suminist: suminist,
                    flete : flete,
                    seguro : seguro,
                    indicador: indicador,
                    //Datos del Tab3 Datos Complementarios
                    antecedentes : antecedentes,
                    lugarent : lugarent,
                    servsol : Ext.encode(servsol),
                    //Datos del Tab4 Representantes
                    iddirector : iddirector,
                    iddirectorecon : iddirectorecon,
                    idespecialista : idespecialista,
                    idespecialistacs : idespecialistacs,
                    idcomprador : idcomprador,                
                    //Otra informacion accion= si es add o mod
                    accion : accion,
                    tipoplan : tipoplan,
                    idsolicitud711 : idsol,
                    //lista si se va a consolidar
                    //solconsolidar: Ext.encode(solconsolidar)
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(1, 'La operación se ha realizado satisfactoriamente');
                        //listarSolicitudes();
                        stSolicitudes711.reload();
                        stMontoTotal.reload();
                        if (band == 1) {
                            //ventanaCrud.hide();
                            ventanaCrud.destroy();
                        }
                    } else {
                        mostrarMensaje(2, 'Ha ocurrido un error.');
                    }
                    mymask.hide();
                }
            });
        } else {
            mostrarMensaje(2, 'La solicitud no se puede realizar con monto total disponible');
        }
    }
    
}

function ActualizarListProd(){
    prod =[];
    auxL= gpProductos1.getStore().data.items.length;
    for (var i = 0; i < auxL; i++) {
        prod.push([
            gpProductos1.getStore().data.items[i].data.idproducto711,
            gpProductos1.getStore().data.items[i].data.codigocup,
            gpProductos1.getStore().data.items[i].data.suministro,
            gpProductos1.getStore().data.items[i].data.precio,
            gpProductos1.getStore().data.items[i].data.cantidad,
            gpProductos1.getStore().data.items[i].data.valor,
            gpProductos1.getStore().data.items[i].data.trimestre1,
            gpProductos1.getStore().data.items[i].data.trimestre2,
            gpProductos1.getStore().data.items[i].data.trimestre3,
            gpProductos1.getStore().data.items[i].data.trimestre4,
            gpProductos1.getStore().data.items[i].data.descrip,
            gpProductos1.getStore().data.items[i].data.descripcion,
            gpProductos1.getStore().data.items[i].data.urlimagen,
            gpProductos1.getStore().data.items[i].data.nombreimag,
            gpProductos1.getStore().data.items[i].data.unidadmedida,
            gpProductos1.getStore().data.items[i].data.numeropieza
        ]);
    }
    stProductosLista.removeAll();
    stProductosLista.loadData(prod);
    gpProductos1.reconfigure(stProductosLista, cmProductos1);
    btnActPreciosHijas.disable();
    
}

function SeleccionProductos(){
    prod =[];
    auxL= gpProductos1.getStore().data.items.length;
    for (var i = 0; i < auxL; i++) {
        prod.push([
            gpProductos1.getStore().data.items[i].data.idproducto711,
            gpProductos1.getStore().data.items[i].data.codigocup,
            gpProductos1.getStore().data.items[i].data.suministro,
            gpProductos1.getStore().data.items[i].data.precio,
            gpProductos1.getStore().data.items[i].data.cantidad,
            gpProductos1.getStore().data.items[i].data.valor,
            gpProductos1.getStore().data.items[i].data.trimestre1,
            gpProductos1.getStore().data.items[i].data.trimestre2,
            gpProductos1.getStore().data.items[i].data.trimestre3,
            gpProductos1.getStore().data.items[i].data.trimestre4,
            gpProductos1.getStore().data.items[i].data.descrip,
            gpProductos1.getStore().data.items[i].data.descripcion,
            gpProductos1.getStore().data.items[i].data.urlimagen,
            gpProductos1.getStore().data.items[i].data.nombreimag,
            gpProductos1.getStore().data.items[i].data.unidadmedida,
            gpProductos1.getStore().data.items[i].data.numeropieza
        ]);
    }
    for (i = 0; i < prodindmaestros.length; i++) {
        prod.push([
            prodindmaestros[i][0],
            prodindmaestros[i][1],
            prodindmaestros[i][2],
            prodindmaestros[i][3],
            0,
            0,
            null,
            null,
            null,
            null,
            prodindmaestros[i][4],
            null,
            null,
            null,
            null,
            prodindmaestros[i][5]
        ]);
    }
    
    stProductosLista.removeAll();
    stProductosLista.loadData(prod);
    gpProductos1.reconfigure(stProductosLista, cmProductos1);
}

function EliminarSeleccionProducto() {
    prod =[];
    total =0;
    auxL= gpProductos1.getStore().data.items.length;
    auxL1 = smProductos1.getSelections();
    //console.log(auxL1);
    sumintotal = 0;
    for (var i = 0; i < auxL; i++) { 
        band1 = false;
        for (var j = 0; j < auxL1.length; j++) {
            if (gpProductos1.getStore().data.items[i].data.idproducto711 == auxL1[j].data.idproducto711) {
                band1 = true;
                break;
            }
        }
        if(band1==false){
            prod.push([
                        gpProductos1.getStore().data.items[i].data.idproducto711,
                        gpProductos1.getStore().data.items[i].data.codigocup,
                        gpProductos1.getStore().data.items[i].data.suministro,
                        gpProductos1.getStore().data.items[i].data.precio,
                        gpProductos1.getStore().data.items[i].data.cantidad,
                        gpProductos1.getStore().data.items[i].data.valor,
                        gpProductos1.getStore().data.items[i].data.trimestre1,
                        gpProductos1.getStore().data.items[i].data.trimestre2,
                        gpProductos1.getStore().data.items[i].data.trimestre3,
                        gpProductos1.getStore().data.items[i].data.trimestre4,
                        gpProductos1.getStore().data.items[i].data.descrip,
                        gpProductos1.getStore().data.items[i].data.descripcion,
                        gpProductos1.getStore().data.items[i].data.urlimagen,
                        gpProductos1.getStore().data.items[i].data.nombreimag,
                        gpProductos1.getStore().data.items[i].data.unidadmedida,
                        gpProductos1.getStore().data.items[i].data.numeropieza
                    ]);
                auxv = gpProductos1.getStore().data.items[i].data.valor + '';
                total += parseFloat(auxv.replace(/,/g, ''));
        }
            
    }
    
    totalgeneral.setValue(addCommas(total.toFixed(6)));
    stProductosLista.removeAll();
    stProductosLista.loadData(prod);
    gpProductos1.reconfigure(stProductosLista, cmProductos1);
    btnDelProductos.disable();
    btnDescripcion.disable();
}


function cargandoDatosAModificar(accion){
    
    solicitud = smSolicitudes711.getSelected().data;
    escon = solicitud.esconsolidada;
    totalgeneral.setValue(addCommas(solicitud.totalgeneral));
    NombreCliente.setValue(solicitud.nombrecliente);
    porcientodeGastosFLete.setValue(solicitud.flete);
    porcientodeGastosSeguridad.setValue(solicitud.seguro);
    AntecedenteCompra.setValue(solicitud.antecedentes);
    LugarEntrega.setValue(solicitud.lugarentrega);
    DescripGen.setValue(solicitud.descripciongeneral);
    //idsolp= smSolicitudes711.getSelected().data.idsolicitud711;
    //cbConsolidada.setValue(solicitud.esconsolidada);
    //chkConsolidar.setValue(solicitud.paraconsolidar);
    //cbGrupoComercial.reset();
    //cbGrupoComercial.setValue(solicitud.iddatosgrupcomercial);
    
    cbEspecialistaEmpAprueba.setValue(solicitud.idespecialista);
    cbEspecialistaSuministrador.setValue(solicitud.idespecialistacs);
    cbEspecialistaComprador.setValue(solicitud.idcomprador);    
    //cbIndicadorAsociado.setValue(solicitud.idproductoindicador);

    stlistarServicEnSol = new Ext.data.Store({
        autoLoad: true,
        url: 'listarServicEnSol',
        listeners: {
            beforeload: function () {
                stlistarServicEnSol.baseParams.idsolicitud711= smSolicitudes711.getSelected().data.idsolicitud711
                //stEspecialistaSuministrador.baseParams.identidad = identidadselectedPlanes;
            },
            load: function (t, rec) {
                for(i =0; i<rec.length; i++){
                    for(j =0; j < Ext.getCmp('checkservsol').items.length; j++){
                        if(Ext.getCmp('checkservsol').items[j].inputValue==rec[i].data.iddatosservsol){
                            Ext.getCmp('checkservsol').items[j].checked=true;
                            servsol.push(rec[i].data.iddatosservsol);
                        }
                    }
                }
                //cbGrupoComercial.setValue(solicitud.iddatosgrupcomercial);
                //cbIndicadorAsociado.setValue(solicitud.idproductoindicador);
                //cbCodigoCUPDunas.setValue(solicitud.idcodigocupdunas);
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
                root: "lista",
                //id: "idpersonadel711" idsolicitudservsol, idsolicitud711, iddatosservsol, nom_datosnomenclador.denominacion
            }, [{
                name: 'idsolicitudservsol'
            }, {
                name: 'iddatosservsol'
            }]
        )
    });
    stProductos1.reload();
    if(escon==true){
        stSolConsolidar.reload();
        if(accion!=2) {
            gpSolConsolidar.enable();
        }
        btnAddProductos.hide();
        //gpSolConsolidar.getSelectionModel().selectAll();
    }
//    if(solicitud.idsp == "5023"){
//        Ext.getCmp('precioeditable').readOnly=false;
//        if(escon==true){
//            Ext.getCmp('precioeditable').readOnly=true;
//            btnActPreciosHijas.show();
//        }
//    }
    
}

function ConsolidarSeleccionados(accion){
    stProdConsolidados = new Ext.data.SimpleStore({
        fields: [{
                name: 'idproducto711'
            }, {
                name: 'codigocup'
            }, {
                name: 'suministro'
            }, {
                name: 'precio'
            }, {
                name: 'cantidad'
            },{
                name: 'valor'
            },{
                name: 'trimestre1'
            },{
                name: 'trimestre2'
            },{
                name: 'trimestre3'
            },{
                name: 'trimestre4'
            }, {
                name: 'descrip'
            }, {
                name: 'descripcion'
            },{
                name: 'urlimagen'
            },{
                name: 'nombreimg'
            },{
                name: 'unidadmedida'
            },{
                name: 'numeropieza'
            }            
        ]
    });
    if(gpSolConsolidar.getSelectionModel().getCount()==0){
        mostrarMensaje(1, 'Debe tener seleccionado al menos una solicitud para consolidar');
    }else{
        prod = [];
        solconsolidar = [];
        textoAntecendetes = '';
        for (i = 0; i < solseleccionadas.length; i++) {
            solconsolidar.push(solseleccionadas[i][0]);
            textoAntecendetes = textoAntecendetes + '' + solseleccionadas[i][1] + ' \n';
        }
        
        mymask.show();
        Ext.Ajax.request({
            url: 'listarProdEnSol',
            params: {
                solconsolidar: Ext.encode(solconsolidar),
                accion: accion
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                lista = responseData.data;
                if(accion==2){ 
                    var consol = [];
                    consol= solconsolidar;
                    if(lista.length > 0){
                        mostrarMensaje(2, 'La consolidación que desea realizar presenta problemas, se exportará un excel con los posible errores'); 
                        setTimeout(function(){
                            mymask.hide();
                            var win = window.open('listarProdEnSol?accion='+3+'&solconsolidar='+Ext.encode(consol));
                        }, 5000);
                        
                    }else{
                        mymask.hide();
                        mostrarMensaje(2, 'La consolidación que desea realizar no presenta problemas'); 
                    }
                    solconsolidar = [];
                }
                if(accion==1){
                    auxtotal = 0;
                    for (i = 0; i < lista.length; i++) {
                        prod.push([
                            lista[i].idproducto711,
                            lista[i].codigocup,
                            lista[i].suministro,
                            lista[i].precio,
                            lista[i].cantidad,
                            parseFloat(parseFloat(lista[i].precio) * parseFloat(lista[i].cantidad)).toFixed(6),
                            lista[i].trimestre1,
                            lista[i].trimestre2,
                            lista[i].trimestre3,
                            lista[i].trimestre4,
                            lista[i].unidadmedida,
                            lista[i].descripcion,
                            lista[i].urlimagen,
                            lista[i].nombreimg,
                            lista[i].unidadmedida,
                            lista[i].numeropieza
                        ]);
                        auxtotal += parseFloat(lista[i].precio) * parseFloat(lista[i].cantidad);
                    }
                    //console.log(prod);
                    totalgeneral.setValue(addCommas(auxtotal.toFixed(6)));
                    mymask.hide();
                    AntecedenteCompra.setValue(textoAntecendetes);
                    btnAddProductos.hide();
                    btnConsolidar.disable();
                    stProdConsolidados.removeAll();
                    stProdConsolidados.loadData(prod);
                    gpProductos1.reconfigure(stProdConsolidados, cmProductos1);
                }
            }
        });
    }

}

function winFpProductos(accion) {

    btnCancelarAdd = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarAdd',
        tooltip: perfil.etiquetas.lbTtCancenlarAdd,
        text: perfil.etiquetas.lbtnCancelarAdd,
        handler: function () {
            ventanaCrudProd.destroy();
        }
    });

    btnAplicarAdd = new Ext.Button({
        // icon: perfil.dirImg + 'aplicar.png',
        iconCls: 'aplicar',
        disabled: true,
        id: 'btnAplicarAdd',
        text: perfil.etiquetas.lbtnAplicarAdd,
        tooltip: perfil.etiquetas.lbTtAplicarAdd,
        handler: function () {
            if (pfinalP.getForm().isValid()) {
                mymask.show();
                AdicionarProductos(accion, 1);
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageErrorForm)
            }
        }
    });

    btnAceptarAdd = new Ext.Button({
        // icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        disabled: true,
        id: 'btnAceptarAdd',
        text: perfil.etiquetas.lbtnAceptarAdd,
        tooltip: perfil.etiquetas.lbTtAceptarAdd,
        handler: function () {
            if (pfinalP.getForm().isValid()) {
                mymask.show();
                AdicionarProductos(accion, 2);
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageErrorForm)
            }
        }
    });

//*****Elementos de la ventana para adicionar personas**********
    stUnidaMedida = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stUnidaMedida.baseParams.uri = 7;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });

    cbUnidaMedida = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        id: '111cbUnidaMedida ',
        fieldLabel: 'Unida de Medida',
        store: stUnidaMedida,
        displayField: 'denominacion',
        valueField: 'iddatos',
        triggerAction: 'all',
        loadingText: 'Cargando datos...',
        allowBlank: false,
        selectOnFocus: false,
        blankText: 'Este campo es obligatorio',
        readOnly: true,
        mode: 'local',
        width: 200,
        listeners: {
            select: function (cb, rec, num) {

            }
        }
    });

    stEmpresaImp2 = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stEmpresaImp2.baseParams.uri = 3;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });

    cbEmpresasImp2 = new Ext.form.ComboBox({
        //id: 'idcbEmpresasImp',
        emptyText: 'Seleccione',
        fieldLabel: 'Empresa importadora',
        width: 200,
        store: stEmpresaImp2,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        loadingText: 'Cargando...',
        disabled: accion == 2 ? true : false,
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
            }

        }
    });

    Denominacion = new Ext.form.TextField({
        fieldLabel: 'Denominación',
        allowBlank: false,
        width: 200,
        anchor: '80%'
                //value: codigoreup
    });

    Precio = new Ext.form.NumberField({
        fieldLabel: 'Precio',
        allowNegative: true,
        decimalPrecision: 2,
        allowBlank: false,
        maxLength: 19,
        width: 200
                //value: codigoreup
    });

    CodigoCUP = new Ext.form.TextField({
        fieldLabel: 'Código CUP',
        allowBlank: false,
        width: 200,
        //disabled: accion == 2 ? true : false
        //anchor: '80%',
        //value: codigoreup
    });

    CodigoPieza = new Ext.form.TextField({
        fieldLabel: 'Número de pieza',
        allowBlank: true,
        width: 200
        //disabled: accion == 2 ? true : false
        //anchor: '80%',
        //value: codigoreup
    });

    var h = 300;
    pfinalP = new Ext.FormPanel({
        id: 'pfinalP',
        frame: true,
        defaults: {labelAlign: 'top'},
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: [cbEmpresasImp2]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: Denominacion
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: cbUnidaMedida
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: Precio
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: CodigoCUP
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: CodigoPieza
                    }]

            }]
    });
    ventanaCrudProd = null;
    ventanaCrudProd = new Ext.Window({
        title: 'Adicionar producto',
        id: 'ventanaCrudProd',
        width: 525,
        constrain: true,
        layout: 'fit',
        height: h,
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCancelarAdd, btnAplicarAdd, btnAceptarAdd],
        items: [pfinalP],
        listeners: {
            beforeshow: function () {
            }
        }
    });
    ventanaCrudProd.show();
}

function AdicionarProductos(accion, band) {
    var id = null;
    ccup=CodigoCUP.getValue();
    if (accion == 2) {
        id = smGpProductos.getSelected().data.idproducto711;
    }
    //si los conceptos de compra son iguales
    Ext.Ajax.request({
        url: 'adicionarProductos',
        params: {
            um: cbUnidaMedida.getValue(),
            idempimp: cbEmpresasImp2.getValue(),
            denom: Denominacion.getValue(),
            precio: Precio.getValue(),
            codigocup: ccup,
            idproducto711: id,
            numeropieza: CodigoPieza.getValue(),
            accion: accion,
            tipo: 0
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                var postaccion = 'adicionado';
                mostrarMensaje(1, 'El producto se ha ' + postaccion + ' satisfactoriamente');
                cbUnidaMedida.reset();
                cbEmpresasImp2.reset();
                Denominacion.reset();
                Precio.reset();
                CodigoCUP.reset();
                CodigoPieza.reset();                
                stProductosSel.reload();
                DameProdCodigoCUP(ccup);
                mymask.hide();
                if (band == 2) {
                    ventanaCrudProd.destroy();
                }
            } else {
                mostrarMensaje(2, responseData.mensaje);
            }
        }
    });
    
}

function DameProdCodigoCUP(codigo){
    Ext.Ajax.request({
        url: 'listarProductos711',
        params: {
            codigocup: codigo,
            tipo:0
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == "1") {
                result=responseData.data;
                AgregarDesdeAdicionar(result);                
            } else {
                mostrarMensaje(2, 'Error en la búsqueda');
            }
        }
    });
}

function AgregarDesdeAdicionar(tipo) {
    auxListaProd =[];
    auxL= gpProductos1.getStore().data.items.length;
    for (var i = 0; i < auxL; i++) {
        auxListaProd.push([
            gpProductos1.getStore().data.items[i].data.idproducto711,
            gpProductos1.getStore().data.items[i].data.codigocup,
            gpProductos1.getStore().data.items[i].data.suministro,
            gpProductos1.getStore().data.items[i].data.precio,
            gpProductos1.getStore().data.items[i].data.cantidad,
            gpProductos1.getStore().data.items[i].data.valor,
            gpProductos1.getStore().data.items[i].data.trimestre1,
            gpProductos1.getStore().data.items[i].data.trimestre2,
            gpProductos1.getStore().data.items[i].data.trimestre3,
            gpProductos1.getStore().data.items[i].data.trimestre4,
            gpProductos1.getStore().data.items[i].data.descrip
        ]);
    }
        auxListaProd.push([
            tipo[0].idproducto711,
            tipo[0].codigocup,
            tipo[0].denominacion,
            tipo[0].precio,
            0,
            0,
            null,
            null,
            null,
            null,
            tipo[0].um
        ]);
    
    stProductosLista.removeAll();
    stProductosLista.loadData(auxListaProd);
    gpProductos1.reconfigure(stProductosLista, cmProductos1);
    
}

function AdicionarProductosALista(str){
    //auxLista = [];
    auxL= gpProductos1.getStore().data.items.length;
    for (var i = 0; i < auxL; i++) {
        auxListaProd.push([
            gpProductos1.getStore().data.items[i].data.idproducto711,
            gpProductos1.getStore().data.items[i].data.codigocup,
            gpProductos1.getStore().data.items[i].data.suministro,
            gpProductos1.getStore().data.items[i].data.precio,
            gpProductos1.getStore().data.items[i].data.cantidad,
            gpProductos1.getStore().data.items[i].data.valor,
            gpProductos1.getStore().data.items[i].data.trimestre1,
            gpProductos1.getStore().data.items[i].data.trimestre2,
            gpProductos1.getStore().data.items[i].data.trimestre3,
            gpProductos1.getStore().data.items[i].data.trimestre4,
            gpProductos1.getStore().data.items[i].data.descrip
        ]);
    }

    stProductosLista.removeAll();    
    stProductosLista.loadData(auxListaProd);
    gpProductos1.reconfigure(stProductosLista, cmProductos1);
}

function winDescripcion() {

    btnCancelarAdd = new Ext.Button({
        iconCls: 'cancelar',
        id: 'btnCancelarAdd',
        tooltip: perfil.etiquetas.lbTtCancenlarAdd,
        text: perfil.etiquetas.lbtnCancelarAdd,
        handler: function () {
            ventanaCrudProd.destroy();
        }
    });

    btnAceptarAdd = new Ext.Button({
        // icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'aceptar',
        disabled: true,
        id: 'btnAceptarAdd',
        text: perfil.etiquetas.lbtnAceptarAdd,
        tooltip: perfil.etiquetas.lbTtAceptarAdd,
        handler: function () {
            if (pfinalP.getForm().isValid()) {
                mymask.show();
                if(Ext.getCmp('form-file').getValue()!=''){
                    pfinalP.getForm().submit(
                        {
                            url: 'importarfichero',
                            timeout: 1800000, //milisegundos = 30 min
                            method: 'POST',
                            params: {
                                idconcepto: 1
                            },
                            failure: function (form, action) {
                                if (action.result.cod == 1 ) {
                                    urlimagen=action.result.data[0];
                                    nombreimag=action.result.data[1];
                                    descripcion=Descripcion.getValue();
                                    SalvarDescripcionProducto(descripcion, urlimagen, nombreimag);
                                }else{
                                    mostrarMensaje(3, 'Ha ocurrido un problema con la imagen a importar');
                                }

                            }
                        }
                    );
                }else{
                    urlimagen='';
                    nombreimag = '';
                    descripcion = Descripcion.getValue();
                    SalvarDescripcionProducto(descripcion, urlimagen, nombreimag);
                }
                
            } else {
                mostrarMensaje(2, perfil.etiquetas.lbMessageErrorForm)
            }
        }
    });
    
    btnMostraImg = new Ext.Button({
        iconCls: 'ver',
        id: 'btnMostraImg',
        tooltip: 'Mostrar imagen',
        text: 'Mostrar imagen',
        hidden: true,
        handler: function () {
            winVistaImagen();
        }
    });

//*****Elementos de la ventana para adicionar personas**********
    Descripcion = new Ext.form.TextArea({
        allowBlank: false,
        hideLabel: true,
        width: 395,
        height:250
    });
    
    NombreImagen = new Ext.form.Label({
        text: 'Imagen asociada'
    });
    
    DireccionAlmacenadaImg= new Ext.form.Label({
        text: '',
        hidden: true
    });
    
    btnSubirFoto = new Ext.Button({
        iconCls: 'importar',
        id: 'btnCancelarAdd',
        tooltip: perfil.etiquetas.lbTtCancenlarAdd,
        text: perfil.etiquetas.lbtnCancelarAdd,
        handler: function () {
            winDescripcion2();
        }
    });

    pfinalP = new Ext.FormPanel({
        id: 'pfinalP',
        frame: true,
        fileUpload: true,
        defaults: {labelAlign: 'top'},
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: Descripcion
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'fileuploadfield',
                                fieldLabel: 'Importar',
                                id: 'form-file',
                                emptyText: 'Seleccione',
                                name: 'file',
                                anchor: '100%',
                                width: 200,
                                buttonCfg: {
                                    text: '',
                                    iconCls: 'btn',
                                    icon: perfil.dirImg
                                },
                                allowBlank: true
                            }]
                    },{
                        columnWidth: 0.5,
                        layout: 'form',
                        items: btnMostraImg
                    }
                ]

            }]
    });
    ventanaCrudProd = null;
    ventanaCrudProd = new Ext.Window({
        title: 'Especificaciones técnicas',
        id: 'ventanaCrudProd',
        width: 425,
        constrain: true,
        layout: 'fit',
        height: 425,
        resizable: false,
        frame: true,
        modal: true,
        buttons: [btnCancelarAdd, btnAceptarAdd],
        items: [pfinalP],
        listeners: {
            beforeshow: function () {
            }
        }
    });
    Descripcion.setValue(smProductos1.getSelected().data.descripcion);
    NombreImagen.setText('Imagen asociada: '+smProductos1.getSelected().data.nombreimg);
    DireccionAlmacenadaImg.setText(smProductos1.getSelected().data.urlimagen);
    
    ventanaCrudProd.show();
    if(smProductos1.getSelected().data.urlimagen!=null){
        btnMostraImg.show();
    }
}

function SalvarDescripcionProducto(descripcion, urlimagen, nombreimag) {
    //console.log(urlimagen);
    //console.log(nombreimag);
    smProductos1.getSelected().data.descripcion = descripcion;
    smProductos1.getSelected().data.urlimagen = urlimagen;
    smProductos1.getSelected().data.nombreimag = nombreimag;
    mymask.hide();
    prod = [];
    auxL = gpProductos1.getStore().data.items.length;
    for (var i = 0; i < auxL; i++) {
        prod.push([
            gpProductos1.getStore().data.items[i].data.idproducto711,
            gpProductos1.getStore().data.items[i].data.codigocup,
            gpProductos1.getStore().data.items[i].data.suministro,
            gpProductos1.getStore().data.items[i].data.precio,
            gpProductos1.getStore().data.items[i].data.cantidad,
            gpProductos1.getStore().data.items[i].data.valor,
            gpProductos1.getStore().data.items[i].data.trimestre1,
            gpProductos1.getStore().data.items[i].data.trimestre2,
            gpProductos1.getStore().data.items[i].data.trimestre3,
            gpProductos1.getStore().data.items[i].data.trimestre4,
            gpProductos1.getStore().data.items[i].data.descrip,
            gpProductos1.getStore().data.items[i].data.descripcion,
            gpProductos1.getStore().data.items[i].data.urlimagen,
            gpProductos1.getStore().data.items[i].data.nombreimag,
            gpProductos1.getStore().data.items[i].data.unidadmedida,
            gpProductos1.getStore().data.items[i].data.numeropieza
        ]);
    }
    stProductosLista.removeAll();
    stProductosLista.loadData(prod);
    gpProductos1.reconfigure(stProductosLista, cmProductos1);
    ventanaCrudProd.destroy();
}

function CargarModificarProd(str){
    mymask.show();
    prod = [];
    auxL1= str.reader.jsonData.data.length;
    for (var i = 0; i < auxL1; i++) {
        prod.push([
            str.reader.jsonData.data[i].idproducto711,
            str.reader.jsonData.data[i].codigocup,
            str.reader.jsonData.data[i].suministro,
            str.reader.jsonData.data[i].precio,
            str.reader.jsonData.data[i].cantidad,
            str.reader.jsonData.data[i].valor,
            str.reader.jsonData.data[i].trimestre1,
            str.reader.jsonData.data[i].trimestre2,
            str.reader.jsonData.data[i].trimestre3,
            str.reader.jsonData.data[i].trimestre4,
            str.reader.jsonData.data[i].descrip,
            str.reader.jsonData.data[i].descripcion,
            str.reader.jsonData.data[i].urlimagen,
            str.reader.jsonData.data[i].nombreimag,
            str.reader.jsonData.data[i].unidadmedida,
            str.reader.jsonData.data[i].numeropieza
        ]);
    }
    mymask.hide();
    stProductosLista.removeAll();
    stProductosLista.loadData(prod);
    gpProductos1.reconfigure(stProductosLista, cmProductos1);
    
}

function ChequearSol(rec){
    gpSolConsolidar.enable();
    recselec =[];
    if(solseleccionadas.length==0){
        auxcons=[];
        solseleccionadas=[];
        for (i = 0; i < rec.length; i++) {
            if(rec[i].data.estaconsolidada==true){
                recselec.push(i);
                auxcons[0] = rec[i].data.idsolicitud711;
                auxcons[1] = '' + rec[i].data.nosolicitud + ': \n' + rec[i].data.antecedentes + '';
                solseleccionadas.push(auxcons);
                solconsolidar.push(rec[i].data.idsolicitud711);
            }
        }
        gpSolConsolidar.getSelectionModel().resumeEvents();
        gpSolConsolidar.getSelectionModel().selectRows(recselec);
    }else{
        
        for (i = 0; i < rec.length; i++) {
            for (j = 0; j < solseleccionadas.length; j++) {
                if(rec[i].data.idsolicitud711==solseleccionadas[j][0]){
                    recselec.push(i);
                }
            }
        }
        gpSolConsolidar.getSelectionModel().selectRows(recselec);
        gpSolConsolidar.getSelectionModel().resumeEvents();
    }
    
}

function winVistaImagen() {
  window.open('http://'+smProductos1.getSelected().data.urlimagen,"Vista previa imagen", "width=300, height=200"); 
}