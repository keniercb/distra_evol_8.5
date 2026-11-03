agregarmodificarsolicitudes711 = function () {
    stSP = new Ext.data.Store({
        //autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stSP.baseParams.uri = 4;
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

    cbSP = new Ext.form.ComboBox({
        id: 'idcbSP',
        emptyText: 'Seleccione',
        width: 100,
        disabled: false,
        store: stSP,
        fieldLabel: 'Situación del pedido',
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
            }
        }
    });
}
//accion =1 adicionar =2 modificar
function winFp(accion) {
       h=800;
   h1=1000;
   w=1000;
    productossel = [];
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
    
    montototalmod = new Ext.form.Label({
        //id: 'idmontototalrr',
        text: 'Monto disponible: '+ montototal.text
    });

    //Elementos del primer tab1   
    CodigoReup = new Ext.form.TextField({
        disabled: true,
        fieldLabel: 'Codigo REUP',
        readOnly: true,
        allowBlank: false,
        width: 200,
        anchor: '80%',
        value: codigoreup
    });

    EmpresaCliente = new Ext.form.TextField({
        disabled: true,
        fieldLabel: 'Cliente',
        readOnly: true,
        allowBlank: false,
        width: 200,
        anchor: '80%',
        value: denom_ent
    });

    EmpresaImport = new Ext.form.TextField({
        disabled: true,
        fieldLabel: 'Empresa Importadora',
        readOnly: true,
        allowBlank: false,
        width: 200,
        anchor: '80%',
        value: empimp
    });

    ConceptoCompra = new Ext.form.TextField({
        disabled: true,
        fieldLabel: 'Concepto de Compra',
        readOnly: true,
        allowBlank: false,
        width: 200,
        anchor: '80%',
        value: cc
    });

//    FuenteFinan = new Ext.form.TextField({
//        disabled: true,
//        fieldLabel: 'Fuente de Financiamiento',
//        readOnly: true,
//        allowBlank: false,
//        width: 200,
//        anchor: '80%',
//        value: ff
//    });
    //para el modificar de aqui
    stTipoFuentesFMOd = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stTipoFuentesFMOd.baseParams.uri = 1;
            },
            load: function (t) {
                   FuenteFinan.setValue(cbFF.getValue()); 
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
    
    FuenteFinan = new Ext.form.ComboBox({
        id: 'idcbFFMOd',
        emptyText: 'Seleccione',
        width: 200,
        anchor: '80%',
        //disabled: true,
        store: stTipoFuentesFMOd,
        displayField: 'denominacion',
        fieldLabel: 'Fuente de Financiamiento',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                mymask.show();
                stMontoTotalMod.reload();
            }
        }
    });
    
    stMontoTotalMod = new Ext.data.Store({
        //autoLoad: false,
        url: 'MontoTotal',
        reader: new Ext.data.JsonReader({
            root: "data"
        }, [{
                name: 'montototal'
            }]
                ),
        listeners: {
            beforeload: function () {
                stMontoTotalMod.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                stMontoTotalMod.baseParams.identidad = identidadselectedPlanes;
                stMontoTotalMod.baseParams.idempimp = cbEmpresasImp.getValue();
                stMontoTotalMod.baseParams.idcc = cbCC.getValue();
                stMontoTotalMod.baseParams.idff = FuenteFinan.getValue();
                stMontoTotalMod.baseParams.tipoplan = tipoplan;
            },
            load: function (t) {
                mymask.hide();
                monto = parseFloat(t.reader.jsonData.data[0].montototal);
                montototalmod.setText('Monto disponible: '+addCommas(monto));
            }
        }
    });
    //hasta aqui
    
    stCodigodeCC = new Ext.data.Store({
        url: 'ListarCodigoCC',
        autoLoad: true,
        listeners: {
            beforeload: function () {
                stCodigodeCC.baseParams.idempimp = cbEmpresasImp.getValue();
                stCodigodeCC.baseParams.idcc = cbCC.getValue();
                stCodigodeCC.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                stCodigodeCC.baseParams.identidad = identidadselectedPlanes;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idcodigodecc"
        }, [{
                name: 'idcodigodecc'
            }, {
                name: 'codigo'
            }]
                )
    });

    CodigodeCC = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        width: 200,
        disabled: false,
        store: stCodigodeCC,
        fieldLabel: 'Crédito financiero',
        displayField: 'codigo',
        valueField: 'idcodigodecc',
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

    pDatosTab1 = new Ext.Panel({
        //id: 'pDatosGen',
        frame: true,
        layout: 'fit',
//        width: 1000,
        height: window.innerHeight-125,
        defaults: {labelAlign: 'top'},
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 0.5,
                        layout: 'form',
                        items: CodigoReup
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: EmpresaCliente
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: EmpresaImport
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: cbGrupoComercial
                    }
                    , {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: ConceptoCompra
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: CodigodeCC
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: FuenteFinan
                    }
                ]

            }]
    });
    //fin del tab1

    //Incicio del tab2
    DescripGen = new Ext.form.TextField({
        disabled: false,
        fieldLabel: 'Descripción General',
        readOnly: false,
        allowBlank: false,
        width: 300,
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
            }, {
                name: 'valor'
            }, {
                name: 'trimestre1'
            }, {
                name: 'trimestre2'
            }, {
                name: 'trimestre3'
            }, {
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
            }, {
                name: 'valor'
            }, {
                name: 'trimestre1'
            }, {
                name: 'trimestre2'
            }, {
                name: 'trimestre3'
            }, {
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
        }, {
            header: "Precio",
            tooltip: "Precio",
            dataIndex: 'precio',
            width: 100,
            align: 'rigth',
            renderer: RenderaddCommas,
            editor: new Ext.form.TextField({
                id: 'precioeditable',
                readOnly: true,
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
        }, {
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
        }, {
            header: "Valor",
            dataIndex: 'valor',
            id: 'expandir',
            width: 100,
            renderer: RenderaddCommas,
            sortable: true
        }, {
            header: "I",
            tooltip: "I",
            dataIndex: 'trimestre1',
            width: 60,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                decimalPrecision: 6,
                allowBlank: false,
                maxLength: 30
            })
        }, {
            header: "II",
            tooltip: "II",
            dataIndex: 'trimestre2',
            width: 60,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                decimalPrecision: 6,
                allowBlank: false,
                maxLength: 30
            })
        }, {
            header: "III",
            tooltip: "III",
            dataIndex: 'trimestre3',
            width: 60,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                decimalPrecision: 6,
                allowBlank: false,
                maxLength: 30
            })
        }, {
            header: "IV",
            tooltip: "IV",
            dataIndex: 'trimestre4',
            width: 60,
            align: 'rigth',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                decimalPrecision: 6,
                allowBlank: false,
                maxLength: 30
            })
        }, {
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
    
    textporcientodeGastos = new Ext.form.Label({
        text: 'Varlor de cálculo de otros gastos:'
    });

    porcientodeGastos = new Ext.form.NumberField({
        allowNegative: true,
        decimalPrecision: 2,
        allowBlank: false,
        maxLength: 19,
        maxValue: 100,
        minValue: 0,
        allowBlank: false,
                with : '50',
                value: 7
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
        tbar: [btnAddProductos, '-', btnDelProductos, '-',btnDescripcion,'-',btnImportarProdCUP,'-',btnImportarPrecNump,'-', btnImportarProdNump ],
        bbar: new Ext.PagingToolbar({
            store: stProductos1,
            displayInfo: true,
            items: [btnLimpiarProd, '-', textporcientodeGastos, porcientodeGastos],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        //plugins: filtrosProductos1,
        loadMask: {
            msg: 'Cargando ...'
        },
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
                sumintotal = 0;
                auxv='';
                for (i = 0; i < gpProductos1.getStore().data.items.length; i++) {
                    auxv = ''+gpProductos1.getStore().data.items[i].data.valor;
                    sumintotal += parseFloat(auxv.replace(/,/g,''));
                }
                suministro.setValue(addCommas(parseFloat(sumintotal).toFixed(6)));
                valorporciento = porcientodeGastos.getValue() / 100;
                otrog = (parseFloat(sumintotal) * parseFloat(valorporciento)).toFixed(6);
                otrosgastos.setValue(addCommas(otrog));
                totalg = parseFloat(parseFloat(otrog) + parseFloat(sumintotal)).toFixed(6);
                totalgeneral.setValue(addCommas(totalg));
                ActualizarListProd();
            }
        }
    });

    suministro = new Ext.form.TextField({
        allowNegative: true,
        fieldLabel: 'Suministro total',
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

    otrosgastos = new Ext.form.TextField({
        allowNegative: true,
        fieldLabel: 'Otros gastos',
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
//        width: 1000,
        height: window.innerHeight-125,
        layout: 'fit',
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
                        columnWidth: 0.3,
                        layout: 'form',
                        items: suministro
                    }, {
                        columnWidth: 0.3,
                        layout: 'form',
                        items: otrosgastos
                    }
                    , {
                        columnWidth: 0.3,
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
        height: window.innerHeight-225,
    });

    LugarEntrega = new Ext.form.TextField({
        disabled: false,
        fieldLabel: 'Lugar de entrega',
        readOnly: false,
        allowBlank: false,
        width: '100%',
        value: direccdest
    });

    textServiciosSol = new Ext.form.Label({
        text: 'Servicios solicitados:'
    });

    pServiciosSol = new Ext.Panel({
        width: 1000,
        height: 450,
        items: {
            xtype: 'checkboxgroup',
            id: 'checkservsol',
            items: [{
                    boxLabel: 'Garantía',
                    name: 'fav-garantia',
                    inputValue: '5045'
                }, {
                    boxLabel: 'Post venta',
                    name: 'fav-postventa',
                    inputValue: '5046'
                }, {
                    boxLabel: 'Asistencia técnica',
                    name: 'fav-asistencia',
                    inputValue: '5047'
                }, {
                    boxLabel: 'Documentación',
                    name: 'fav-documentacion',
                    inputValue: '5048'
                }]
        }
    });

    pDatosTab3 = new Ext.Panel({
        //id: 'pDatosTab3',
        frame: true,
//        width: 1000,
        height: window.innerHeight-125,
        layout: 'fit',
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
    textRC = new Ext.form.Label({
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
        fieldLabel: 'Director(a) general',
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
        fieldLabel: 'Director(a) económico',
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

    textRS = new Ext.form.Label({
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
        autoLoad: true,
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
        items: [{
                columnWidth: 1,
                layout: 'form',
                items: textRS
            }, {
                columnWidth: 1,
                layout: 'form',
                //items: 
            }, {
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items:
                                {
                                    layout: 'column',
                                    items: [
                                        {
                                            columnWidth: 0.9,
                                            layout: 'form',
                                            items: [cbEspecialistaSuministrador]
                                        }
                                    ]
                                }

                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items:
                                {
                                    layout: 'column',
                                    items: [
                                        {
                                            columnWidth: 0.9,
                                            layout: 'form',
                                            items: [cbEspecialistaComprador]
                                        }
                                    ]
                                }

                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        //items: 
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: textRC
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items:
                                {
                                    layout: 'column',
                                    items: [
                                        {
                                            columnWidth: 0.9,
                                            layout: 'form',
                                            items: [Director]
                                        }
                                    ]
                                }

                    }, {
                        columnWidth: 0.9,
                        layout: 'form',
                        items: DirectorEconomico
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items:
                                {
                                    layout: 'column',
                                    items: [
                                        {
                                            columnWidth: 0.9,
                                            layout: 'form',
                                            items: [cbEspecialistaEmpAprueba]
                                        }
                                    ]
                                }

                    }
                ]

            }]
    });
    //fin del tab4

    //TabPanel General
    tabsolicitud = new Ext.TabPanel({
        activeTab: 0,
        //layout: 'fit',
        plain: true,
        defaults: {autoScroll: true},
        items: [{
                title: 'Datos Generales',
                layout: 'fit',
                html: "<div id = 'datosgen' ></div>",
                items: [pDatosTab1]
            }, {
                title: 'Datos de productos',
                layout: 'fit',
                html: "<div id = 'productos' ></div>",
                items: [pDatosTab2]
            }, {
                title: 'Datos complementarios',
                layout: 'fit',
                html: "<div id = 'datoscomplementarios' ></div>",
                items: [pDatosTab3]
            }, {
                title: 'Representantes',
                layout: 'fit',
                html: "<div id = 'representantes' ></div>",
                items: [pDatosTab4]
            }
        ],
        listeners: {
            tabchange: function (panel, tab) {
                tab.doLayout(true);
            }
        }
    });

    pfinal = new Ext.FormPanel({
        id: 'pfinal',
//        layout: 'fit',
        frame: true,
        items: [tabsolicitud],
        listeners: {
        }
    });
    ventanaCrud = null;
    if (accion == 1) {
        ventanaCrud = new Ext.Window({
            title: 'Adicionar Solicitud 711',
            //id: 'ventanaCrud',
            maximized : true,
            constrain: true,
            layout: 'fit',
            resizable: false,
            frame: true,
            modal: true,
            buttons: [montototalmod,btnCancelarSol/*, btnAplicarSol*/, btnAceptarSol],
            items: [pfinal],
            closeAction: 'destroy',
            listeners: {
                beforeshow: function () {
                }
            }
        });
    }
    if (accion == 2) {
        //cargandoDatosAModificar();
        ventanaCrud = new Ext.Window({
            title: 'Modificar Solicitud 711',
            //id: 'ventanaCrud',
            maximized : true,
            constrain: true,
            layout: 'fit',
            resizable: false,
            frame: true,
            modal: true,
            buttons: [montototalmod,btnCancelarSol, btnAceptarSol],
            items: [pfinal],
            closeAction: 'destroy',
            listeners: {
                beforeshow: function () {
                }
            }
        });
        if(!btnAdicionar711.isVisible()){
            btnAceptarSol.hide();
        }
        if(rec.data.idsp == '5023'){
            btnImportarPrecNump.show();
        }
    }
    mymask.show();
    ventanaCrud.show();
    if (accion == 1) {
        mymask.hide();
    }
}

function SeleccionarProductos() {
    offsetproductos = 0;

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
        }, {
            header: 'Código de Pieza',
            tooltip: 'Código de Pieza',
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
            }])
    });

    gpProductosSel = new Ext.grid.GridPanel({
//        loadMask: {
//            msg: perfil.etiquetas.lbCargando
//        },
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
    ventanaProductos.show();
}

function AdicionarModificar(accion, band) {
    //Datos a enviar
    //Datos del tab1 Datos Genereles
    var idempcliente = identidadselectedPlanes;
    var idempimp = cbEmpresasImp.getValue();
    var grcomercial = cbGrupoComercial.getValue();
    var idcc = cbCC.getValue();
    var idcodigodecc = CodigodeCC.getValue();
    var idff = FuenteFinan.getValue();

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
    var suminist = parseFloat(suministro.getValue().replace(/,/g,''));
    var otrosg = parseFloat(otrosgastos.getValue().replace(/,/g,''));
    var totalg = parseFloat(totalgeneral.getValue().replace(/,/g,''));
    var montott = parseFloat(monto);

    //Datos del Tab3 Datos Complementarios
    var antecedentes = AntecedenteCompra.getValue();
    var lugarent = LugarEntrega.getValue();
    //var servsol = [];
    if (Ext.getCmp('checkservsol').items.items) {
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

    var idsol = null;
    if (accion == 2) {
        idsol = smSolicitudes711.getSelected().data.idsolicitud711;
        montott = parseFloat(parseFloat(montott) + parseFloat(smSolicitudes711.getSelected().data.totalgeneral)).toFixed(6);
    }
    if (iddirector == null || iddirectorecon == null || idespecialista == null) {
        mostrarMensaje(2, 'La solicitud no se puede realizar pues falta asociarle a la empresa alguno de los representantes');
    } if(suminist==0 || productosencero==true){
        if(productos.length==0){
            mostrarMensaje(2, 'La solicitud no se puede realizar si no hay productos asociados');
        }else{
            mostrarMensaje(2, 'La solicitud no se puede realizar pues el(los) producto(s) '+cadenaproducto+' contiene valores en cero');
        }
        
    }else {
        if (montott >= suminist) {
            //Entro aqui mienstras el monto disponible sea mayor o igual al valor del pedido
            mymask.show();
            Ext.Ajax.request({
                url: 'adicionarModificarSolicitud',
                params: {
                    idejercicio: cbEjercicioPlanes.getValue(),
                    ejercicio: cbEjercicioPlanes.getRawValue(),
                    idempcliente: idempcliente,
                    nombreentidad: denom_ent,
                    idempimp: idempimp,
                    idgrupcom: grcomercial,
                    idcc: idcc,
                    idcodigodecc: idcodigodecc,
                    idff: idff,
                    //Datos del Tab2 Datos de Productos
                    productos: Ext.encode(productos),
                    descripgen: descripgen,
                    suminist: suminist,
                    otrosg: otrosg,
                    totalg: totalg,
                    //Datos del Tab3 Datos Complementarios
                    antecedentes: antecedentes,
                    lugarent: lugarent,
                    servsol: Ext.encode(servsol),
                    //Datos del Tab4 Representantes
                    iddirector: iddirector,
                    iddirectorecon: iddirectorecon,
                    idespecialista: idespecialista,
                    idespecialistacs: idespecialistacs,
                    idcomprador: idcomprador,
                    //Otra informacion accion= si es add o mod
                    accion: accion,
                    tipoplan: tipoplan,
                    idsolicitud711: idsol
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(1, 'La operación se ha realizado satisfactoriamente');
                        listarSolicitudes();
                        stMontoTotal.reload();
                        if (band == 1) {
                            ventanaCrud.destroy();
                        }
                    } else {
                        mostrarMensaje(2, 'Ha ocurrido un error.');
                    }
                    mymask.hide();
                }
            });
        } else {
            mostrarMensaje(2, 'La solicitud no se puede realizar con el monto total disponible');
        }
    }

}

function ActualizarListProd() {
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
}

function SeleccionProductos() {
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
    //console.log(prodindmaestros);
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
    prod = [];
    auxL = gpProductos1.getStore().data.items.length;
    auxL1 = smProductos1.getSelections();
    console.log(auxL1);
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
                    sumintotal += parseFloat(auxv.replace(/,/g, ''));
        }
    }
    suministro.setValue(addCommas(parseFloat(sumintotal).toFixed(6)));
    valorporciento = porcientodeGastos.getValue() / 100;
    otrog = (parseFloat(sumintotal) * parseFloat(valorporciento)).toFixed(6);
    otrosgastos.setValue(addCommas(otrog));
    totalg = parseFloat(parseFloat(otrog) + parseFloat(sumintotal)).toFixed(6);
    totalgeneral.setValue(addCommas(totalg));
    stProductosLista.removeAll();
    stProductosLista.loadData(prod);
    gpProductos1.reconfigure(stProductosLista, cmProductos1);
    btnDelProductos.disable();
    btnDescripcion.disable();

}

function cargandoDatosAModificar() {
    solicitud = smSolicitudes711.getSelected().data;
    suministro.setValue(addCommas(solicitud.suministrototal));
    otrosgastos.setValue(addCommas(solicitud.otrosgastos));
    totalgeneral.setValue(addCommas(solicitud.totalgeneral));
    AntecedenteCompra.setValue(solicitud.antecedentes);
    LugarEntrega.setValue(solicitud.lugarentrega);
    DescripGen.setValue(solicitud.descripciongeneral);
    idsolp = smSolicitudes711.getSelected().data.idsolicitud711;
    CodigodeCC.reset();
    CodigodeCC.setValue(solicitud.idcodigodecc);
    cbGrupoComercial.reset();

    cbEspecialistaEmpAprueba.setValue(solicitud.idespecialista);
    cbEspecialistaSuministrador.setValue(solicitud.idespecialistacs);
    cbEspecialistaComprador.setValue(solicitud.idcomprador);

    stlistarServicEnSol = new Ext.data.Store({
        autoLoad: true,
        url: 'listarServicEnSol',
        listeners: {
            beforeload: function () {
                stlistarServicEnSol.baseParams.idsolicitud711 = smSolicitudes711.getSelected().data.idsolicitud711
                //stEspecialistaSuministrador.baseParams.identidad = identidadselectedPlanes;
            },
            load: function (t, rec) {
                for (i = 0; i < rec.length; i++) {
                    for (j = 0; j < Ext.getCmp('checkservsol').items.length; j++) {
                        if (Ext.getCmp('checkservsol').items[j].inputValue == rec[i].data.iddatosservsol) {
                            Ext.getCmp('checkservsol').items[j].checked = true;
                            servsol.push(rec[i].data.iddatosservsol);
                        }
                    }
                }
                cbGrupoComercial.setValue(solicitud.iddatosgrupcomercial);
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
    mymask.show();
    stProductos1.reload();
    
    if(solicitud.idsp == "5023"){
        Ext.getCmp('precioeditable').readOnly=false;
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
    ccup = CodigoCUP.getValue();
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

function DameProdCodigoCUP(codigo) {
    Ext.Ajax.request({
        url: 'listarProductos711',
        params: {
            codigocup: codigo,
            tipo: 0
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == "1") {
                result = responseData.data;
                AgregarDesdeAdicionar(result);
            } else {
                mostrarMensaje(2, 'Error en la búsqueda');
            }
        }
    });
}

function AgregarDesdeAdicionar(tipo) {
    auxListaProd = [];
    auxL = gpProductos1.getStore().data.items.length;
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

function AdicionarProductosALista(str) {
    //auxLista = [];
    auxL = gpProductos1.getStore().data.items.length;
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
        title: 'Describir producto',
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
    console.log(urlimagen);
    console.log(nombreimag);
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

function CargarModificarProd(str) {
    mymask.show();
    auxListaProd = [];
    auxL1 = str.reader.jsonData.data.length;
    for (var i = 0; i < auxL1; i++) {
        auxListaProd.push([
            str.reader.jsonData.data[i].idproducto711,
            str.reader.jsonData.data[i].codigocup,
            str.reader.jsonData.data[i].suministro,
            str.reader.jsonData.data[i].precio,
            str.reader.jsonData.data[i].cantidad,
            addCommas(str.reader.jsonData.data[i].valor),
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
    stProductosLista.loadData(auxListaProd);
    gpProductos1.reconfigure(stProductosLista, cmProductos1);

}

function winVistaImagen() {
  window.open('http://'+smProductos1.getSelected().data.urlimagen,"Vista previa imagen", "width=300, height=200"); 
}

