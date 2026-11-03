var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('puntpresupuesto', cargarInterfaz);
var sm, winComun, treeclick;
var gestor, gestorOLD, identidad, valor, hoja, is_leaf, idfiltroentidad, idconftiponomesp;

btnAyuda = new Ext.Toolbar.Button({
    id: 'btnAyuda',
    icon: perfil.dirImg + 'ayuda.png',
    iconCls: 'btn',
    tooltip: 'Ayuda (Alt + H)',
    text: 'Ayuda',
    handler: function() {
        mostrarAyuda('definir anteproyecto de presupuesto');
    }
});


myMask = new Ext.LoadMask(Ext.getBody(), {
    msg: perfil.etiquetas.msgEspera
});
btnLimpiar = new Ext.Toolbar.Button({
    id: 'btnLimpiar',
    icon: perfil.dirImg + 'limpiar.png',
    iconCls: 'btn',
    tooltip: 'Limpiar(Alt + L)',
    text: perfil.etiquetas.lbLimpiar,
    handler: function() {
        Ext.getCmp('idtipobalance').clearValue();
        Ext.getCmp('idsubtipobalance').clearValue();
        Ext.getCmp('totalraciones').reset();
        Ext.getCmp('subtotalraciones').reset();
        Ext.getCmp('chktodos').reset();

    }
});
btnrecargar = new Ext.Toolbar.Button({
    id: 'btnrecargar',
    icon: perfil.dirImg + 'actualizar.png',
    iconCls: 'btn',
    tooltip: 'Actalizar',
    text: perfil.etiquetas.lbRecargar,
    handler: function() {



    }


});

treeLoader = new Ext.tree.TreeLoader({
    dataUrl: 'cargarEntidades',
    listeners: {
        load: function() {
            if (is_leaf) {
                grid.getStore().reload({
                    params:
                            {
                                hoja: hoja,
                                start: 0,
                                limit: 20,
                                idconftiponomesp: idconftiponomesp,
                                identidad: idenhojatidad
                            }
                });
            }

        },
        beforeload: function(tree, node, res) {
            tree.baseParams.valor = Ext.getCmp('idfiltroentidad').getValue();
        }

    }
});

tbar : [{
        iconCls: 'icon-expand-all',
        tooltip: 'Expandir todas las entidades',
        icon: perfil.dirImg + 'expand-all.gif',
        handler: function() {
            tpEntidades.root.expand(true);
        }
    }, {
        iconCls: 'icon-collapse-all',
        tooltip: 'Colapsar todas las entidades',
        icon: perfil.dirImg + 'collapse-all.gif',
        handler: function() {
            tpEntidades.root.collapse(true);
        }
    }, {
        iconCls: 'icon-collapse-all',
        tooltip: 'Refrescar todas las entidades',
        icon: perfil.dirImg + 'table_refresh.png',
        handler: function() {
            actualizararbol(tpEntidades);
        }
    }, '-', {
        xtype: 'textfield',
        emptyText: 'Filtrar entidad...',
        width: 110,
        id: 'idfiltroentidad',
        listeners: {
            specialkey: function(t, e) {
                if (e.getKey() == '13') {
                    buscarNodo(tpEntidades);
                }
            }
        }
    }];
root:new Ext.tree.AsyncTreeNode({
    text: "Entidades",
    tipo: 0,
    expanded: false,
    editable: false,
    draggable: true,
    expandable: true,
    id: '0'
});

personas = [
    ['101010', 'Administraci�n de Viviendas', '70000', '67.3', '40000', '60000'],
    ['101010', 'Actividades de Defensa', '80000', '87.4', '60000', '77000'],
    ['101010', 'Educaci�n General Media', '100000', '91.3', '70000', '70000'],
    ['101010', 'Educaci�n Superior', '86000', '77.8', '85000', '85000'],
];
//creando el repositorio de datos  
store = new Ext.data.SimpleStore({
    fields: [
        {name: 'cuenta'},
        {name: 'NAE'},
        {name: 'cant'},
        {name: 'porc'},
        {name: 'cantR'},
        {name: 'cantF'}
    ]
});
store.loadData(personas);




// *** Acceso directo alias
var frm = Ext.form;
// *** Column Model del Grid
var cm = new Ext.grid.ColumnModel([
    {
        id: 'denominacion',
        header: "Cuenta",
        dataIndex: 'cuenta',
        width: 100,
        sortable: true
    }, {
        header: "NAE",
        dataIndex: 'NAE',
        width: 200,
        sortable: true
    }, {
        header: "Cant. Actual",
        dataIndex: 'cant',
        width: 100,
        sortable: true

    }, {
        header: "Porciento (%)",
        dataIndex: 'porc',
        width: 100,
        sortable: true

    }, {
        header: "Cant. Restante",
        dataIndex: 'cantR',
        width: 100,
        sortable: true
    }, {
        header: "Cant. Final",
        dataIndex: 'cantF',
        width: 100,
        sortable: true
    }]);



paginado = new Ext.PagingToolbar({
    pageSize: 20,
    store: store,
    id: 'paginado',
    displayInfo: true

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
    width: 850,
    disabled: true,
    height: 600,
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
    width: 400,
    height: 500,
    items: [tpEntidades, grid],
    tbar: ['->', btnLimpiar, btnAyuda]


});



myView = new Ext.Viewport({
    layout: 'fit',
    items: pAux
});

function mostrarAyuda(opcion) {
    var urlayuda = "../../../comun/templates/Ayuda/presupuesto/" + opcion + ".html";
    window.open(urlayuda, "Ayuda", "width=650,height=400,menubar=yes,scrollbars=yes,resizable=yes");
}

function actualizarArbol(arbol, valor) {
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
function buscarNodo(tree) {

    buscarNodoTreeX(tree, identidadselected, 'idfiltroentidad');
}

function buscarNodoTreeX(trEnt, idselected, idcampobusq) {
    var rootNode = null;
    var idRootNode = null;
    if (idselected == null) {
        idRootNode = trEnt.getRootNode().firstChild.id;
        rootNode = trEnt.getNodeById(idRootNode);
        trEnt.getSelectionModel().select(rootNode);
    }
    else {
        if (idRootNode == null)
            idRootNode = idselected;
        rootNode = trEnt.getNodeById(idRootNode);
    }

    function contarCoinc(t1, t2) {
        var cont = 0;
        for (var index = 0; index < t1.length && index < t2.length; index++) {
            if (t1.charAt(index).toLowerCase() == t2.charAt(index).toLowerCase()) {
                cont++;
            } else {
                break;
            }
        }
        return cont;
    }
    ;
    var idmayor = -1;
    var cantConincMayor = 0;
    var node = null;
    rootNode.eachChild(function(n) {
        var cont = null;
        cont = contarCoinc(n.attributes.text, Ext.getCmp(idcampobusq).getValue());
        if (cont > cantConincMayor) {
            cantConincMayor = cont;
            idmayor = n.id;
            node = n;
        }
    }, null, null);
    if (node != null)
        trEnt.getSelectionModel().select(node);

}
