perfil = new Object();
perfil.etiquetas = Object();
var tpBasePlan, identidadselected = null, maskPlanTree;
objci = {};
var eshoja = 0, hoja = 0, consolidado, idelemsel = null, identidadmodelo = null,
        iniciaTreePanel = function() {

    btnAyuda = new Ext.Toolbar.Button({
        id: 'btnAyudaPlan',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        text: 'Ayuda',
        tooltip: "Mostrar ayuda de la funcionalidad <b>(Alt+H)</b>"

    });


    tpBasePlan = new Ext.tree.TreePanel({
        autoScroll: true,
        layout: 'fit',
        height: 200,
        border: false,
        contextMenu: contextMenuBase,
        listeners: {
            click: function(n, e) {
                pModelo.enable();

                if (!objci.acciones.rector) {

                    //-----------Grupo de condiciones para valdiar los permisos del componente---------------- 
                    if (puedeguardar == 0) {

                        Ext.getCmp('btnGuardar').hide();

                    }
                    if (puedeadicionar == 0) {
                        Ext.getCmp('addplan').hide();
                        Ext.getCmp('addmodelo').hide();
                        Ext.getCmp('btnAdicionarInds').hide();

                    }
                    if (puedeeliminar == 0) {
                        Ext.getCmp('delplan').hide();
                        Ext.getCmp('delmodelo').hide();
                        Ext.getCmp('btnEliminarInds').hide();

                    }
                    if (puedemodificar == 0) {
                        Ext.getCmp('modplan').hide();
                        Ext.getCmp('modmodelo').hide();

                    }

                    //----------- Termina el grupo de condiciones para valdiar los permisos del componente----------------

                    Ext.getCmp('menuAprobAjuste').hide();
                }



                if (treesel != n.id) {
                    treesel = n.id;
                    nodo = n;
                    if (n.leaf == true && n.idplan != n.idpadre) {
                        pModelo.enable();
                        identidadmodelo = n.attributes.DatEntidadmodelo[0].identidadmodelo
                    }

                    idelemsel = n.id;
                    tipoModel = n.attributes.idtipomodelo;
                    idtipodoc = n.attributes.tipo;
                    switch (n.attributes.tipo) {
                        case 2:
                            pcm.layout.setActiveItem('pModelo');
                            cargarconfgrid();
                            pModelo.doLayout();
                            break;
                        case 3:
                            pcm.layout.setActiveItem('pModelo');
                            cargarconfgrid();
                            pModelo.doLayout();

                            break;
                        default:
                            pcm.layout.setActiveItem('pComentario');
                            gpComent.getStore().load({
                                params: {
                                    start: 0,
                                    limit: 20
                                }
                            });
                            break;
                    }

                } else {
                    if (n.attributes.tipo == 2)
                        cargarconfgrid();
                }



            },
            contextmenu: function(n, e) {

                if (global_tree == 2) {
                    n.select();
                    var c = n.getOwnerTree().contextMenu;
                    c.contextNode = n;
                    upMenuDerTree(n);
                    c.showAt(e.getXY());
                }
            }
        },
        loader: loaderTreeBase,
        root: {nodeType: 'async',
            id: '0',
            text: 'Planes',
            tipo: 0,
            //checked: false,
            leaf: false
        }
    });
    tpBasePlan.on('expand', function() {

    })

    tpBaseEstructura = new Ext.tree.TreePanel({
        autoScroll: true,
        layout: 'fit',
        height: 200,
        border: false,
        id: 'tpestructura',
        tbar: [
            {
                iconCls: 'icon-expand-all',
                tooltip: 'Expandir todas las entidades',
                icon: perfil.dirImg + 'expand-all.gif',
                handler: function() {
                    tpBaseEstructura.root.expand(true);
                }
            },
            {
                iconCls: 'icon-collapse-all',
                tooltip: 'Colapsar todas las entidades',
                icon: perfil.dirImg + 'collapse-all.gif',
                handler: function() {
                    tpBaseEstructura.root.collapse(true);
                }
            },
            {
                iconCls: 'icon-collapse-all',
                tooltip: 'Refrescar todas las entidades',
                icon: perfil.dirImg + 'table_refresh.png',
                handler: function() {
                    actualizarArbol(tpBaseEstructura);
                }
            },
            '-',
            {
                xtype: 'textfield',
                emptyText: 'Filtrar entidad...',
                width: 110,
                id: 'idfiltroent',
                listeners: {
                    specialkey: function(t, e) {
                        if (e.getKey() == '13') {
                            buscarNodo(tpBaseEstructura);

                        }
                    }
                }
            }
        ],
        listeners: {
            click: function(n, e) {
                cbEjercicio.enable();
                tpBaseEstructura.getSelectionModel().select(n);
                identidadselected = n.id;
                if (n.leaf) {
                    eshoja = 1;
                } else {
                    eshoja = 0;
                }
                bandera = 1;
                if ((n.id != 0) && (objci.acciones.rector)) {
                    loaderTreeBase.baseParams.identidad = identidadselected;
                    titulo = 'Planes: ' + '(' + n.text + ')';
                    pt.setTitle(titulo);
                    pt.expand(true);
                    tpBasePlan.getRootNode().reload();
                }
                else if ((n.attributes._parent != n.id) && (!objci.acciones.rector)) {
                    loaderTreeBase.baseParams.identidad = identidadselected;
                    titulo = 'Planes: ' + '(' + n.text + ')';
                    pt.setTitle(titulo);
                    pt.expand();
                    tpBasePlan.getRootNode().reload();
                }

            }

        },
        loader: loaderTreeBaseEstructura,
        root: new Ext.tree.AsyncTreeNode({
            text: 'Entidades',
            tipo: 0,
            expanded: true,
            id: '0'
        })

    });

}


function mostrarComentarios() {
    pcm.layout.setActiveItem('pComentario');
    gpComent.getStore().reload();
}


function mostrarPresupuesto() {
    if (treesel != null) {
        pcm.layout.setActiveItem('pAsociadoaPresupuesto');
        Ext.Ajax.request({
            url: 'getgridinterfaces',
            params: {
                idmodelo: treesel
            },
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.cm) {
                    for (var index = 0; index < responseData.cm.length; index++) {
                        if (responseData.cm[index].header == 'Formato') {
                            responseData.cm[index].header = 'UM';
                            responseData.cm[index].hidden = true;
                        }
                    }
                    reconfigurarPresupuesto(responseData);
                }
                else {
                    reconfigurarPresupuesto();
                }
            }
        });
    }
    else
    {
        mostrarMensaje(1, "Antes de ejecutar la acción  'Ver presupuesto' debe seleccionar al menos uno de los planes.");
    }
}


function buscarNodo(tree) {

    buscarNodoTreeX(tree, identidadselected, 'idfiltroent');
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


