var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('controlcomponentes', cargarInterfaz);

function cargarInterfaz() {

    btnAdd = new Ext.Button({
        handler: function() {
            bAdicionar();
        },
        text: perfil.etiquetas.lbBtnAdicionar,
        id: 'btnAdd',
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnAdd
    });

    btnMod = new Ext.Button({
        handler: function() {

        },
        text: perfil.etiquetas.lbBtnModificar,
        id: 'btnMod',
        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnMod
    });

    btnDel = new Ext.Button({
        handler: function() {

        },
        text: perfil.etiquetas.lbBtnEliminar,
        id: 'btnEli',
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnDel
    });

    btnUnoDerecha = new Ext.Button({
        handler: function() {

        },
        style: 'margin-left:5px;margin-top:55px;',
        id: 'btnunoderecha',
        icon: perfil.dirImg + 'siguiente.png',
        iconCls: 'btn'
    });

    btnTodosDerecha = new Ext.Button({
        handler: function() {
        },
        style: 'margin-left:5px;margin-top:10px;',
        id: 'btntodosderecha',
        icon: perfil.dirImg + 'ultimapagina.png',
        iconCls: 'btn'
    });

    btnUnoIzquierda = new Ext.Button({
        handler: function() {
        },
        style: 'margin-left:5px;margin-top:25px;',
        id: 'btnunoizquierda',
        icon: perfil.dirImg + 'anterior.png',
        iconCls: 'btn'
    });

    btnTodosIzquierda = new Ext.Button({
        handler: function() {
        },
        style: 'margin-left:5px;margin-top:10px;',
        id: 'btntodosizquierda',
        icon: perfil.dirImg + 'primerapagina.png',
        iconCls: 'btn'
    });

    btnEliminar = new Ext.Button({
        handler: function() {
            eliminarEntSel();
        },
        id: 'btneliminar',
        text: perfil.etiquetas.lbBtnEliminar,
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnDel
    });





    trComponentes = new Ext.tree.TreePanel({
        autoScroll: true,
        margins: '1 1 1 1',
        region: 'west',
        title: perfil.etiquetas.lbComponentes,
        width: 205,
        collapsible: true,
        listeners: {
            click: function(n, e) {
            }
        },
        split: true,
        root: new Ext.tree.AsyncTreeNode({
            text: 'Componentes',
            tipo: 0,
            expanded: true,
            id: '0'
        }),
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'listarGruposNom'
        })
    });


    loadertpEstructuraCB = new Ext.tree.TreeLoader({
        dataUrl: 'ListarEntidades',
        listeners: {
            beforeload: function(tl, n) {
                this.baseParams = {
                    idEstructuraPadre: n.attributes.idEstructuraPadre,
                    valor: Ext.getCmp('idfiltroent').getValue()
                };
            }
        }
    });


    var rPlantillaAddCond = new Ext.data.Record.create({
        name: 'id'
    }, {
        name: 'denominacion'
    });

    tpEstructuraCB = new Ext.tree.TreePanel({
        autoScroll: true,
        title: 'Entidades',
        region: 'west',
        id: 'tpEstructuraCB',
        width: 250,
        height: 190,
        border: false,
        collapsible: true,
        split: true,
        tbar: [{
                iconCls: 'icon-expand-all',
                tooltip: 'Expandir todas las entidades',
                icon: perfil.dirImg + 'expand-all.gif',
                handler: function() {
                    tpEstructuraCB.root.expand(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: 'Colapsar todas las entidades',
                icon: perfil.dirImg + 'collapse-all.gif',
                handler: function() {
                    tpEstructuraCB.root.collapse(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: 'Refrescar todas las entidades',
                icon: perfil.dirImg + 'table_refresh.png',
                handler: function() {
                    actualizararbolCB(tpEstructuraCB);
                }
            }, '-', {
                xtype: 'textfield',
                emptyText: 'Filtrar entidad...',
                width: 110,
                id: 'idfiltroent',
                listeners: {
                    specialkey: function(t, e) {
                        if (e.getKey() == '13') {
                            actualizararbolCB(tpEstructuraCB);

                        }
                    }
                }
            }],
        listeners: {
            checkchange: function(nodo, chequeado) {

                var existeid = existeEnGrid(nodo.attributes.id);
                if (!existeid) {
                    chequeados = tpEstructuraCB.getChecked();
                    var denominacion;
                    for (var i = 0; i < chequeados.length; i++) {
                        denominacion += chequeados[i].text + ',';
                    }

                    tpEstructuraCB.suspendEvents();
                    if (chequeado) {
                        var rAddFila = new rPlantillaAddCond({
                            id: nodo.attributes.id,
                            denominacion: nodo.text
                        });
                        stListado.add(rAddFila);
                    }


                    tpEstructuraCB.resumeEvents();
                }
                if (nodo.attributes.checked == false) {
                    eliminarFila(nodo.attributes.id);
                }
            }
        },
        loader: loadertpEstructuraCB,
        root: new Ext.tree.AsyncTreeNode({
            text: 'Economía',
            tipo: 0,
            expanded: true,
            id: '900000235'
        })
    });





    stPermisos = new Ext.data.GroupingStore({
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "campos",
            id: "idespecialidad"
        }, [{
                name: 'idespecialidad'
            }, {
                name: 'especialidad'
            },
            {
                name: 'Adicionar'
            }, {
                name: 'Modificar'
            }, {
                name: 'Eliminar'
            }, {
                name: 'accion'
            }]),
        sortInfo: {
            field: 'idespecialidad',
            direction: "ASC"
        },
        groupField: 'accion',
        listeners: {
            beforeload: function(st)
            {

            },
            load: function(st)
            {

            }
        }

    });

    smPermisos = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    gpPermisos = new Ext.grid.GridPanel({
        frame: true,
        iconCls: 'icon-grid',
        margins: '3 3 3 3',
        region: 'center',
        title: 'Permisos y Acciones',
        autoExpandColumn: 'expandir',
        store: stPermisos,
        loadMask: {
            msg: 'Cargando permisos...'
        },
        sm: smPermisos,
        columns: [
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idespecialidad'
            }, {
                header: 'Especialidad',
                sortable: false,
                dataIndex: 'especialidad',
                width: 300
            },
            {
                header: 'Adicionar',
                dataIndex: 'adicionar',
                sortable: false,
                width: 100
            },
            {
                header: 'Modificar',
                dataIndex: 'modificar',
                sortable: false,
                width: 100
            },
            {
                header: 'Eliminar',
                dataIndex: 'eliminar',
                sortable: false,
                width: 100
            }
        ],
        view: new Ext.grid.GroupingView({
            forceFit: true,
            groupTextTpl: '<center>{text} ({[values.rs.length]} {[values.rs.length > 1 ? "permisos" : "permiso"]})</center>'
        }),
        tbar: [btnAdd, btnMod, btnDel]
    });





    vpCC = new Ext.Viewport({
        layout: 'fit',
        items: [{
                layout: 'border',
                items: [trComponentes, gpPermisos]
            }]
    });



    gpEstadosSinA = new Ext.grid.GridPanel({
        iconCls: 'icon-grid',
        region: 'west',
        width: 370,
        height: 10,
        border: false,
        title: 'Estados sin asociar',
        store: stPermisos,
        loadMask: {
            msg: 'Cargando permisos...'
        },
        sm: smPermisos,
        columns: [
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idestado'
            }, {
                header: 'Denominación',
                sortable: false,
                dataIndex: 'denominacion',
                width: 330
            }
        ]
    });


    gpEstadosA = new Ext.grid.GridPanel({
        iconCls: 'icon-grid',
        region: 'east',
        width: 370,
        height: 10,
        border: false,
        title: 'Estados asociados',
        store: stPermisos,
        loadMask: {
            msg: 'Cargando permisos...'
        },
        sm: smPermisos,
        columns: [
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idestadosa'
            }, {
                header: 'Denominación',
                sortable: false,
                dataIndex: 'denominacionea',
                width: 330
            }
        ]

    });

    pbtn = new Ext.Panel({
        id: 'pbtn',
        border: false,
        region: 'center',
        frame: true,
        anchor: '100%',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: [btnUnoDerecha, btnTodosDerecha, btnUnoIzquierda, btnTodosIzquierda]
                    }]
            }]
    });

    stListado = new Ext.data.SimpleStore({
        fields: [
            {
                name: 'id'
            }, {
                name: 'denominacion'
            }]
    });

    gpListado = new Ext.grid.GridPanel({
        frame: true,
        iconCls: 'icon-grid',
        region: 'center',
        border: false,
        title: 'Listado de entidades seleccionadas',
        store: stListado,
        loadMask: {
            msg: 'Cargando permisos...'
        },
        sm: smPermisos,
        columns: [
            {
                hidden: true,
                hideable: false,
                dataIndex: 'iddeno'
            }, {
                header: 'Denominacion',
                sortable: false,
                dataIndex: 'denominacion',
                width: 500
            }
        ],
        tbar: [btnEliminar]
    });

    pregionnorth = new Ext.Panel({
        id: 'pregionnorth',
        region: 'north',
        height: 200,
        border: false,
        layout: 'border',
        items: [gpEstadosSinA, pbtn, gpEstadosA]
    });

    pregionsouth = new Ext.Panel({
        id: 'pregionsouth',
        region: 'south',
        height: 260,
        border: false,
        layout: 'border',
        items: [tpEstructuraCB, gpListado]
    });

    fscentro = new Ext.form.FieldSet({
        id: 'fscentro',
        region: 'center',
        title: 'Permisos',
        defaultType: 'textfield',
        items: [{
                fieldLabel: 'Field 1',
                name: 'field1'
            }]
    });


    pgeneral = new Ext.Panel({
        border: false,
        layout: 'border',
        items: [pregionnorth, fscentro, pregionsouth]
    });

    winAdd = new Ext.Window({
        closeAction: 'hide',
        layout: 'fit',
        constrain: true,
        width: 800,
        height: 600,
        items: [pgeneral]

                ,
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                text: perfil.etiquetas.lbBtnCancelar,
                tooltip: perfil.etiquetas.lbTtBtnCancelar,
                handler: function() {

                }
            }, {
                icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'btn',
                id: 'btnaplicar',
                text: perfil.etiquetas.lbAplicar,
                tooltip: perfil.etiquetas.lbTtBtnAplicar,
                handler: function() {


                }
            }, {
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                text: perfil.etiquetas.lbBtnAceptar,
                tooltip: perfil.etiquetas.lbTTBtnAceptar,
                handler: function() {


                }
            }]
    });
}


function bAdicionar() {
    winAdd.show('btnAdd');
}

function eliminarEntSel() {
    var resultadogp = gpListado.getSelectionModel().getSelections();
    for (var i = 0; i < resultadogp.length; i++) {
        gpListado.getStore().remove(resultadogp[i]);
        tpEstructuraCB.getNodeById(resultadogp[i].data.id).getUI().toggleCheck(false);
    }
}

function actualizararbolCB(arbol, valor) {

    if (arbol.getSelectionModel().getSelectedNode() != undefined) {
        if (!arbol.getSelectionModel().getSelectedNode().leaf) {
            arbol.getSelectionModel().getSelectedNode().reload({
                params: {
                    valor: valor
                }
            });
        }
    } else
        arbol.root.reload({
            params: {
                valor: valor
            }
        });
}

function existeEnGrid(nodoid) {
    var resultadogp = gpListado.getStore().data.items;
    for (var i = 0; i < resultadogp.length; i++) {
        if (resultadogp[i].data.id == nodoid) {
            return true;
        }
    }
    return false;
}

function eliminarFila(nodoid) {
    var resultadogp = gpListado.getStore().data.items;
    for (var i = 0; i < resultadogp.length; i++) {
        if (resultadogp[i].data.id == nodoid) {
            gpListado.getStore().remove(resultadogp[i]);
        }
    }
}
