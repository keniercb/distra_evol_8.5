var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('puntpresupuesto', cargarInterfaz);
var sm, winComun, treeclick;
var gestor, gestorOLD, identidad, valor, hoja, is_leaf, idfiltroentidad, idconftiponomesp;

function cargarInterfaz() {

    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...',
        removeMask: false
    });
    btnAyuda = new Ext.Toolbar.Button({
        id: 'btnAyudapun',
        // icon:perfil.dirImg  + 'ayuda.png',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad <b>(Alt+H)</b>'//,
                // text :perfil.etiquetas.lbBtnAyuda
//         handler: function (opcion) {
//            mostrarAyuda('Puntualización del anteproyecto de presupuesto');
//        }



    });


    myMask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.msgEspera
    });
    btnLimpiar = new Ext.Toolbar.Button({
        id: 'btnLimpiar',
        // icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbTtLimpiar,
        //text: perfil.etiquetas.lbBtnLimpiar,
        handler: function() {
            limpiarFiltros();

        }
    });
    btnrecargar = new Ext.Toolbar.Button({
        id: 'btnrecargar',
        // icon: perfil.dirImg + 'actualizar.png',
        iconCls: 'actualizar',
        tooltip: 'Actalizar',
        //text: perfil.etiquetas.lbRecargar,
        handler: function() {

        }


    });
    tpEntidades = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false
            });
    tpEntidades.btnBuscar.setText("");
    tpEntidades.btnLimpiar.setText("");
    tpEntidades = tpEntidades.items.items[0];
    tpEntidades.getRootNode().expand();
    tpEntidades.region = 'west';
    tpEntidades.width = 200;
    tpEntidades.addListener('click', function(n) {
        if (n.text != "Estructuras") {
            is_leaf = n.leaf;
            Ext.getCmp('griddatos').enable();
        } else {
            Ext.getCmp('griddatos').disable();
        }
    });

    /******TECLAS CALIENTES***************/
    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Hh',
            alt: true,
            fn: function() {
                mostrarAyuda('Puntualización del anteproyecto de presupuesto');
            }
        },
        {
            key: 'Ll',
            alt: true,
            fn: function() {
            }
        }
    ]);


    /******FIN DE LAS TECLAS CALIENTES***************/
    personas = [
        ['101010', 'Administración de Viviendas', '70000', '67.3', '40000', '60000'],
        ['101010', 'Actividades de Defensa', '80000', '87.4', '60000', '77000'],
        ['101010', 'Educación General Media', '100000', '91.3', '70000', '70000'],
        ['101010', 'Educación Superior', '86000', '77.8', '85000', '85000'],
    ];
    //creando el repositorio de datos  
    store = new Ext.data.SimpleStore({
        fields: [
            {
                name: 'cuenta'
            },
            {
                name: 'NAE'
            },
            {
                name: 'cant'
            },
            {
                name: 'porc'
            },
            {
                name: 'cantR'
            },
            {
                name: 'cantF'
            }
        ]
    });
    store.loadData(personas);

    //LIMPIAR FILTROS
    function limpiarFiltros() {
        grid.getStore().reload();
    }


    // *** Acceso directo alias
    var frm = Ext.form;
    // *** Column Model del Grid
    var cm = new Ext.grid.ColumnModel([
        {
            id: 'denominacion',
            header: "Cuenta",
            dataIndex: 'cuenta',
            tooltip: 'Cuenta',
            width: 100,
            sortable: true,
            renderer: crearToolTip
        }, {
            header: "NAE",
            dataIndex: 'NAE',
            width: 200,
            sortable: true,
            tooltip: 'Nivel de actividad ecónomica',
            renderer: crearToolTip
        }, {
            header: "Cant. Actual",
            dataIndex: 'cant',
            width: 100,
            align: 'right',
            tooltip: 'Cantidad Actual',
            sortable: true,
            renderer: crearToolTip

        }, {
            header: "Porciento (%)",
            dataIndex: 'porc',
            align: 'right',
            tooltip: 'Porciento',
            width: 100,
            sortable: true,
            renderer: crearToolTip

        }, {
            header: "Cant. Restante",
            dataIndex: 'cantR',
            width: 100,
            align: 'right',
            tooltip: 'Cantidad Restante',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: "Cant. Final",
            dataIndex: 'cantF',
            align: 'right',
            width: 100,
            tooltip: 'Cantidad Final',
            sortable: true,
            renderer: crearToolTip
        }]);



    paginado = new Ext.PagingToolbar({
        pageSize: 20,
        store: store,
        id: 'paginado',
        displayInfo: true,
        items: [btnLimpiar]

    });

    sm = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
        }
    });



    // *** Definicion del grid editable
    grid = new Ext.grid.EditorGridPanel({
        title: '',
        master_column_id: 'exp',
        root_title: perfil.etiquetas.lbDenominacion,
        disabled: true,
        region: 'center',
        autoExpandColumn: 'denominacion',
        store: store,
        cm: cm,
        sm: sm,
        id: 'griddatos',
        listeners: {
            afteredit: function(e) {

            }
        },
        frame: true,
        tbars:
                ['->', btnrecargar, {
                        xtype: 'tbtext',
                        text: perfil.etiquetas.lbSubtotalraciones
                    }],
        bbar: paginado
    });




    pAux = new Ext.Panel({
        layout: 'border',
        items: [tpEntidades, grid],
        tbar: ['->', btnAyuda]


    });



    myView = new Ext.Viewport({
        layout: 'fit',
        items: pAux
    });
} //fin de la funcion cargarInterfaz






//function mostrarAyuda(referencia,title){
//    var title = 'Puntualización del anteproyecto de presupuesto ';
//    var referencia = 'btnAyuda';//esto puede ser el id del boton o cualquier cosa que lo identifique
//    help.show(title,referencia);
//}




function actualizararbol(arbol, valor) {

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

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}
