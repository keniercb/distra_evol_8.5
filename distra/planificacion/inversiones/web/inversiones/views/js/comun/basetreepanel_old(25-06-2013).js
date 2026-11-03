perfil = new Object();
perfil.etiquetas = Object();
var tpBasePlan, identidadselected = null, maskPlanTree;
objci = {};
var eshoja=0, hoja = 0,consolidado,idelemsel=null,identidadmodelo=null,
        
                    

iniciaTreePanel = function () {
    /*
         Ext.getBody().mask(perfil.etiquetas.lbEspere);

         Ext.Ajax.request({
         url: 'cargaInicial',
         callback: function (options,success,response){
         objci = Ext.decode(response.responseText);
         if(!objci.codMsg){
         console.log(objci);
         }
         else{mostrarMensaje(3,perfil.etiquetas.msgErrorAction)}
         }
         });
         */

    btnAyuda = new Ext.Toolbar.Button({
        id:'btnAyuda',
        icon:perfil.dirImg + 'ayuda.png',
        iconCls:'btn',
        text:'Ayuda',
        tooltip:"Mostrar ayuda de la funcionalidad <b>(Alt+H)</b>",
        handler:function () {
            mostrarAyuda('gestionar_plan');
        }
    });


    tpBasePlan = new Ext.tree.TreePanel({
        autoScroll:true,
        layout:'fit',
        height:200,
        border:false,
        contextMenu:contextMenuBase,
        listeners:{
            click:function (n, e) {
                if (treesel != n.id) {
                    treesel = n.id;
                    nodo = n;
                    idelemsel = n.id;
                    identidadmodelo=n.attributes.DatEntidadmodelo[0].identidadmodelo
                    tipoModel = n.attributes.idtipomodelo;
                    idtipodoc = n.attributes.tipo;
                      switch (n.attributes.tipo) {
                        case 2:
                            pcm.layout.setActiveItem('pModelo');                                
                            cargarconfgrid();
                            pModelo.doLayout();

                            //                                console.log(Ext.getCmp('gpModelo').colModel.getColumnById('colNaerf'));
                            break;
                        case 3:
                            pcm.layout.setActiveItem('pModelo');
                            cargarconfgrid();
                            pModelo.doLayout();

                            //                                console.log(Ext.getCmp('gpModelo').colModel.getColumnById('colNaerf'));
                            break;
                        default:
                            pcm.layout.setActiveItem('pComentario');
                            gpComent.getStore().load({
                                params:{
                                    start:0,
                                    limit:20
                                }
                            });
                            break;
                    }

                }else{
                    if(n.attributes.tipo==2)
                        cargarconfgrid(); 
                }
                    
            //tpBaseEstructura.expand(true);
            //ptestructuras.enable();

            },
            contextmenu:function (n, e) {
                if (global_tree == 2) {
                    if (treesel != n.id) {
                        tpBasePlan.fireEvent('click', n);
                    }
                    n.select();
                    var c = n.getOwnerTree().contextMenu;
                    c.contextNode = n;
                    upMenuDerTree(n);
                    c.showAt(e.getXY());
                }
            }
        },
        loader:loaderTreeBase,
        root:new Ext.tree.AsyncTreeNode({
            text:perfil.etiquetas.titPlanes,
            tipo:0,
            expanded:true,
            //listeners : {append: function( tr, th, newNod, newPos){console.log(newNod); newNod.qtip='amed'} },
            id:'0'
        })
    });


    tpBaseEstructura = new Ext.tree.TreePanel({
        autoScroll:true,
        layout:'fit',
        height:200,
        border:false,
        id: 'tpestructura',
        //contextMenu:contextMenuBase,
        tbar:[
        {
            iconCls:'icon-expand-all',
            tooltip:'Expandir todas las entidades',
            icon:perfil.dirImg + 'expand-all.gif',
            handler:function () {
                tpBaseEstructura.root.expand(true);
            }
        },
        {
            iconCls:'icon-collapse-all',
            tooltip:'Colapsar todas las entidades',
            icon:perfil.dirImg + 'collapse-all.gif',
            handler:function () {
                tpBaseEstructura.root.collapse(true);
            }
        },
        {
            iconCls:'icon-collapse-all',
            tooltip:'Refrescar todas las entidades',
            icon:perfil.dirImg + 'table_refresh.png',
            handler:function () {
                actualizarArbol(tpBaseEstructura);
            }
        },
        '-',
        {
            xtype:'textfield',
            emptyText:'Filtrar entidad...',
            width:110,
            id:'idfiltroent',
            listeners:{
                specialkey:function (t, e) {
                    if (e.getKey() == '13') {
                        buscarNodo(tpBaseEstructura);

                    }
                }
            }
        }
        ],
        listeners:{
            click:function (n, e) {
                tpBaseEstructura.getSelectionModel().select(n);
                identidadselected = n.id;
                 if(n.leaf){
                   eshoja=1;
               }
                bandera = 1;
                if ((n.id != 0) && (objci.acciones.rector)) {
                    loaderTreeBase.baseParams.identidad = identidadselected;
                    titulo = 'Planes: ' + '(' + n.text + ')';
                    pt.setTitle(titulo);
                    pt.expand(true);
                    loaderTreeBase.load(tpBasePlan.getRootNode());
                    }
                else if ((n.attributes._parent != n.id) && (!objci.acciones.rector)) {
                    loaderTreeBase.baseParams.identidad = identidadselected;
                    titulo = 'Planes: ' + '(' + n.text + ')';
                    pt.setTitle(titulo);
                    pt.expand();
                    loaderTreeBase.load(tpBasePlan.getRootNode());
                }       
                                
            }

        },

        loader:loaderTreeBaseEstructura,
        root:new Ext.tree.AsyncTreeNode({
            text:'Entidades',
            tipo:0,
            expanded:true,
            id:'0'
        })

    });

}


function mostrarComentarios() {
    pcm.layout.setActiveItem('pComentario');
    gpComent.getStore().reload();
}


function mostrarPresupuesto() {
    storeAsociadoaPresupuesto.reload({
        params:{
            start:0,
            limit:20
        }
    });
    pcm.layout.setActiveItem('pAsociadoaPresupuesto');
    
   
}

function mostrarAyuda(referencia, title) {
    var title = 'Gestionar Plan';
    var referencia = '13';//esto puede ser el id del bot�n o cualquier cosa que lo identifique
    help.show(title, referencia);
}

function buscarNodo(tree) {

    buscarNodoTreeX(tree,identidadselected,'idfiltroent');
}

function buscarNodoTreeX(trEnt,idselected,idcampobusq){
    
    var rootNode = null;
    var idRootNode= null;
    if(idselected == null){
        idRootNode = trEnt.getRootNode().firstChild.id;
        rootNode = trEnt.getNodeById( idRootNode ) ;
        trEnt.getSelectionModel().select(rootNode);
    }
    else{
        if(idRootNode == null)
            idRootNode = idselected;
        rootNode = trEnt.getNodeById( idRootNode ) ;
    }        

    function contarCoinc(t1,t2){
        var cont = 0;
        for(var index = 0; index<t1.length && index < t2.length ; index++){
            if(t1.charAt(index).toLowerCase() == t2.charAt(index).toLowerCase()){
                cont++;     
            }else{
                break;
            }
        }
        return cont;
    };                         
    var idmayor = -1;
    var cantConincMayor = 0;                        
    var node = null;
    rootNode.eachChild(function(n){
        var cont = null;
        cont = contarCoinc( n.attributes.text,Ext.getCmp(idcampobusq).getValue());        
        if(cont > cantConincMayor){
            cantConincMayor = cont;
            idmayor =  n.id;  
            node  = n;
        }                   
    },null,null);                         
    if(node != null)
        trEnt.getSelectionModel().select(node); 
    
}

function actualizarArbol(arbol, valor) {
    if (arbol.getSelectionModel().getSelectedNode() != undefined) {
        if (!arbol.getSelectionModel().getSelectedNode().leaf) {
            arbol.getSelectionModel().getSelectedNode().reload({
                params:{
                    valor:valor
                }
            });
        }
    } else
        arbol.root.reload({
            params:{
                valor:valor
            }
        });
}