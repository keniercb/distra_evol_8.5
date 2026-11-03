var winAddNorma, apl = false;

if (!winAddNorma) {
    Declara()
}
winAddNorma.show();

function Declara() {//Inicio de declaracion

    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };

 stCmbUM = new Ext.data.Store({
        url: 'cargarunidadmedida',
        listeners: {
            load: function() {
                flag5 = true;
                //                mostrarVentana();
            }
        },
        //        autoLoad : true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }])
    });
    
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
   filtrosindicadores = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            },
            {
                type: 'string',
                dataIndex: 'denominacion'
            },
            {
                type: 'string',
                dataIndex: 'numeropieza'
            },{
                 type: 'listado',
                dataIndex: 'umedida', 
                idcombo: 'idumedidaindicadores',
               urlcb: '../gestmodelo/cargarunidadmedida',
                mode: 'remote',
                idstore: 'idstumedidaindicadores',
                valueFieldcb: 'idunidadmedida',
                st: stCmbUM,
               //displayFieldcb: 'nombreum',
                 displayFieldcb: 'denominacionunidadmedida',
                autoload: false 
                /*type: 'listado',
                dataIndex: 'denoum',
                idcombo: 'cbFiltroUM',
                urlcb: 'cargarUM',
                //            idstore : 'stcbFiltroUM',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stCmbUM,
                autoload: false,
                mode: 'local'*/    
            },
            /*{
                type: 'listado',
                dataIndex: 'umedida',
                idcombo: 'idumedidaindicadores',
                urlcb: 'cargarunidadmedida',
                idstore: 'idstumedidaindicadores',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'nombreum',
                                
            }*/
            /*{
                type: 'listado',
                dataIndex: 'denoum',
                idcombo: 'cbFiltroUM',
                urlcb: 'cargarUM',
                //            idstore : 'stcbFiltroUM',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stCmbUM,
                autoload: false,
                mode: 'local'
            },*/
            {
                type: 'numeric',
                dataIndex: 'precio'
            }
            ,
            {/*temporal arreglar el listar para que liste centros de balance*/
                type: 'listado',
                dataIndex: 'centrobalance',
                idcombo: 'idcbcentrobalancenorma',
                urlcb: 'listarCentroBalance',
                idstore: 'idstcentrobalancenorma',
                valueFieldcb: 'identidaddatosnomenclador',
                displayFieldcb: 'centrobalance'
            }
        ]
    });


    checkColumnAddNorma = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            'selectionchange': function() {
                if (!checkColumnAddNorma.hasSelection()) {
                    Ext.getCmp('btnaceptaraddnorma').disable();
                    Ext.getCmp('btnaplicaraddnorma').disable();
                }
                else {
                    Ext.getCmp('btnaceptaraddnorma').enable();
                    Ext.getCmp('btnaplicaraddnorma').enable();
                }
            },
            'rowdeselect': function() {
                cmGpAddNorma.setColumnHeader(0, '');
                cmGpAddNorma.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
            }
        }

    });

    cmGpAddNorma = new Ext.grid.ColumnModel([
        checkColumnAddNorma,
        {
            id: 'mscolumn',
            header: perfil.etiquetas.lbCodigo,
            width: 100,
            sortable: false,
            dataIndex: 'codigo'
        },
        {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'denominacion'
        }, {
            id: 'umedida',
            header: perfil.etiquetas.lbUnidadMedida,
            sortable: true,
            dataIndex: 'umedida'
        },
        {
            id: 'precio',
            header: perfil.etiquetas.lbPrecio,
            width: 80,
            sortable: true,
            dataIndex: 'precio'
                    //renderer:seisdecimales
        }, {
            header: perfil.etiquetas.lbNumPieza,
            width: 120,
            sortable: true,
            dataIndex: 'numeropieza'

        }, {
            id: 'centrobalance',
            header: perfil.etiquetas.lbCentroBalance,
            sortable: true,
            dataIndex: 'centrobalance'
        }

    ]);

    smGpAddNorma = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    stGpAddNorma = new Ext.data.Store({
        url: 'listarIndicadores',
        listeners: {
            load: function() {
                siexisteIndEnModeloFiltrado();
                // Ext.getBody().unmask();
            },
            beforeload: function() {
                setTituloFiltrar();
                this.baseParams.identidadmodelo = tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo;
                this.baseParams.idejercicio=cbEjercicio.getValue();

            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idindicador'
        }, [{
                name: 'idindicador'
            }, {
                name: 'denominacion'
            }, {
                name: 'codigo'
            }, {
                name: 'estado'
            }, {
                name: 'idformato'
            }, {
                name: 'idcentrobalance'
            }, {
                name: 'centrobalance'
            }, {
                name: 'precio'
            }, {
                name: 'umedida'
            }, {
                name: 'numeropieza'//,
                        //mapping:'NomIndicadormaterial.numeropieza'
            },{
                name: 'idunidadmedida'
            },{
                name: 'denominacionunidadmedida'
            }])
    });

    stComboUniMed = new Ext.data.Store({
        url: 'cargarunidadmedida',
        reader: new Ext.data.JsonReader({
            id: 'idunidadmedida',
            root: 'data'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'nombreum'
            }])
    });

    cmUidMed = new Ext.form.ComboBox({
        store: stComboUniMed,
        width: 100,
        fieldLabel: perfil.etiquetas.lbUnidadMedida,
        emptyText: perfil.etiquetas.lbSeleccione,
        valueField: 'idunidadmedida',
        displayField: 'nombreum',
        id: 'cmUidMed',
        mode: 'remote',
        //editable:false,
        anchor: '95%',
        triggerAction: 'all',
        enableKeyEvents: true,
        listeners: {
            select: function() {
                habilitaBusqueda(true);
            }
        }
    });


    cbEspecialidadNorma = new Ext.form.ComboBox({
        id: 'cbEspecialidadNorma',
        emptyText: perfil.etiquetas.lbSeleccione,
        store: new Ext.data.Store({
            url: 'listarEspecialidades',
            reader: new Ext.data.JsonReader({
                id: 'idespecialidad',
                root: 'data'
            }, [{
                    name: 'idespecialidad'
                }, {
                    name: 'denespecialidad'
                }]),
            listeners: {
                load: function(x, y, z) {
                }
            }
        }),
        valueField: 'idespecialidad',
        displayField: 'denespecialidad',
        mode: 'remote',
        editable: false,
        triggerAction: 'all',
        width: 120,
        fieldLabel: 'Especialidad',
        enableKeyEvents: true,
        listeners: {
            select: function() {
                habilitaBusqueda(true);
            }
        }
    });

    gpAddNorma = new Ext.grid.GridPanel({
        store: stGpAddNorma,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        cm: cmGpAddNorma,
        sm: checkColumnAddNorma,
        autoExpandColumn: 'expandir',
        region: 'center',
        plugins: filtrosindicadores,
        id: 'gpAddNorma',
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stGpAddNorma,
            items: [{
                    xtype: 'tbseparator'
                },
                {
                    xtype: 'tbbutton',
                    text: perfil.etiquetas.lbLimpiarFiltros,
                    id: 'btntodos',
                    icon: perfil.dirImg + 'limpiar.png',
                    disabled: false,
                    iconCls: 'btn',
                    handler: function() {
                        filtrosindicadores.clearFilters();
                        stGpAddNorma.reload();
                    }
                }],
            displayInfo: true
        })

    });

    winAddNorma = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        width: 950,
        layout: 'fit',
        items: gpAddNorma,
        height: 500,
        title: perfil.etiquetas.lbAdicionarIndicador,
        listeners: {
            show: function() {
                stGpAddNorma.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
            },
            hide: function() {
                // filtrosindicadores.clearFilters();
            }
        },
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                id: 'idcancel',
                tooltip: 'Cerrar ventana sin guardar los datos (Alt+X)',
                text: perfil.etiquetas.lbBtnCancelar,
                handler: function() {
                    if (apl == true) {
                        stGpGestModelo.reload();
                        apl = false;
                    }
                    winAddNorma.hide();
                    checkColumnAddNorma.clearSelections();
                    cmGpAddNorma.setColumnHeader(0, '');
                    cmGpAddNorma.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');

                }
            }, {
                icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'btn',
                tooltip: 'Guardar datos y limpiar los campos (Ctrl+Alt+P)',
                disabled: true,
                id: 'btnaplicaraddnorma',
                text: perfil.etiquetas.lbBtnAplicar,
                handler: function() {
                    apl = true;
                    adicionarIndicadores();
                    checkColumnAddNorma.clearSelections();
                    cmGpAddNorma.setColumnHeader(0, '');
                    cmGpAddNorma.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                }
            }, {
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                disabled: true,
                tooltip: 'Guardar datos y cerrar ventana (Enter)',
                id: 'btnaceptaraddnorma',
                text: perfil.etiquetas.lbBtnAceptar,
                handler: function() {
                  //  alert('1233');
                    adicionarIndicadores();
                    winAddNorma.hide();
                    checkColumnAddNorma.clearSelections();
                    cmGpAddNorma.setColumnHeader(0, '');
                    cmGpAddNorma.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                }
            }]
    });

//stGpAddNorma.load();

}//Fin de Declaracion

map = new Ext.KeyMap(Ext.getDoc(), [
    {
        key: 'Xx',
        alt: true,
        fn: function() {
            if (winAddNorma) {
                if (!Ext.getCmp('idcancel').hidden)
                {
                    if (!Ext.getCmp('idcancel').disabled) {
                        winAddNorma.hide();
                        checkColumnAddNorma.clearSelections();
                        cmGpAddNorma.setColumnHeader(0, '');
                        cmGpAddNorma.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                    }
                }
            }
        }
    }
    , {
        key: 'Pp',
        alt: true,
        Ctrl: true,
        fn: function() {
            if (!Ext.getCmp('btnaplicaraddnorma').hidden)
            {
                if (!Ext.getCmp('btnaplicaraddnorma').disabled) {
                    adicionarIndicadores();
                    checkColumnAddNorma.clearSelections();
                    cmGpAddNorma.setColumnHeader(0, '');
                    cmGpAddNorma.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                }
            }
        }

    }, {
        key: 13,
        fn: function() {
            if (!Ext.getCmp('btnaceptaraddnorma').hidden)
            {
                if (!Ext.getCmp('btnaceptaraddnorma').disabled) {
                    adicionarIndicadores();
                    checkColumnAddNorma.clearSelections();
                    cmGpAddNorma.setColumnHeader(0, '');
                    cmGpAddNorma.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
                }
            }

        }
    }
]);

function   modificarEstadoIndicador(val) {
    if (val == 1)
        return 'Si';
    return 'No';
}

function siexisteIndEnModeloFiltrado() {
    if ((filtrosindicadores.getFiltrosActivos().length > 0) && (stGpAddNorma.getCount() == 0))
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);

}

function adicionarIndicadores() {
    var indicadores = new Array();
   var msg = Ext.MessageBox.show({
        title: perfil.etiquetas.lbEspere,
        msg: 'Adicionando indicador(es).',
        width: 250,
        wait: true,
        progress: true,
        closable: false

    });
    if (checkColumnAddNorma.hasSelection())
        for (p in checkColumnAddNorma.getSelections())
        {
            if (checkColumnAddNorma.getSelections()[p].id)
                indicadores.push(checkColumnAddNorma.getSelections()[p].id);
        }
        
    Ext.Ajax.request({
        url: 'adicionarindicadores',
        params: {
            idmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.idmodelo,
            indicadores: Ext.encode(indicadores),
            identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo,
            idejercicio: cbEjercicio.getValue()
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg != 1) {
                mostrarMensaje(3, perfil.etiquetas.msgErrorAction, recargarindplanes);
                //console.log(apl);
               // apl=true;
                //if (apl) {
                //       alert('3333333');
                 //   mostrarMensaje(1, "El(Los) indicador(es) ha(n) sido adicionado(s) satisfactoriamente.");
               // } /*else
                //    mostrarMensaje(1, "El(Los) indicador(es) ha(n) sido adicionado(s) satisfactoriamente.", recargarindplanes);*/



            }
            msg.hide();
           stGpGestModelo.reload();
            
           /* else
                mostrarMensaje(3, perfil.etiquetas.msgErrorAction, recargarindplanes);*/
        }
    });
}
function recargarindplanes() {
    stGpGestModelo.reload()
}
function setTituloFiltrar() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosindicadores.getFiltrosActivos() == undefined || filtrosindicadores.getFiltrosActivos().length == 0) {
        winAddNorma.setTitle(perfil.etiquetas.lbAdicionarIndicador);
    } else {
        for (i = 0; i < filtrosindicadores.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "denominacion") {//
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "codigo") {//
                aux = perfil.etiquetas.lbCodigo;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "precio") {//
                aux = perfil.etiquetas.lbPrecio;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "umedida") {//
                aux = perfil.etiquetas.lbUnidadMedida;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "numeropieza") {
                aux = perfil.etiquetas.lbNumPieza;
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "centrobalance") {
                aux = perfil.etiquetas.lbCentroBalance;
            }
            if (i == filtrosindicadores.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        winAddNorma.setTitle(perfil.etiquetas.lbAdicionarIndicador + ' / ' + perfil.etiquetas.lbFiltradoPor + filtrado_por);
        filtrado_por = "";
    }
}
