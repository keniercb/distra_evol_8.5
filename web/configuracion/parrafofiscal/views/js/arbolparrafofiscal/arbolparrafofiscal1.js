var perfil = window.parent.UCID.portal.perfil
//perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('gestionarparrafofiscal', function () {
    cargarInterfaz();
});
Ext.QuickTips.init();
var win2, win3;
var lMask;
var flag_spacio = false;
var idcriterio = 0;
var stformato;
var nodoactual = null;
var nodoactual = null;
var comboParent = null;
if (window.idcomboiframe) comboParent = window.parent.Ext.getCmp(window.idcomboiframe);

function cargarInterfaz() {
    // *** TreePanel **/
    var treeLoader = new Ext.tree.TreeLoader({
        dataUrl: 'cargararbol'
    });
    /*treeLoader.on('load', function(This, node, response){
     //lMask.hide();
     }, this);*/
    var trEE = new Ext.tree.TreePanel({
        width: 200,
        autoScroll: true,
        layoutConfig: {
            animate: true
        },
        region: 'west',
        enableDD: true,
        loader: treeLoader
    });
    // Crear nodo padre del arbol
    var nodoPadre = new Ext.tree.AsyncTreeNode({
        text: perfil.etiquetas.lbRootArbol,
        draggable: false,
        id: '0',
        expanded: true
    });
    //Crear lista de hijos
    trEE.setRootNode(nodoPadre);
    // /Madando a que se expanda la raiz
    trEE.show();
    var nodo, collapse = true;
    trEE.on('click', function (node, e) {
        nodoactual = node.attributes.id;
        btnAdicionar.enable();

        if (node.attributes.id != 0) {
            btnModificar.enable();
            fpDetalles.getForm().loadRecord(dameNodeInfo(node));
            if (node.attributes.leaf == 1)
                btnEliminar.enable();
            else
                btnEliminar.disable();
        }
        else {
            fpDetalles.getForm().reset();
            btnModificar.disable();
            btnEliminar.disable();
        }
    }, this);
    /** ***************************viewport****************************************************** */
    var vpPrinc = new Ext.Viewport({
        layout: 'fit',
        id: 'id',
        items: [trEE],
        autoScroll: true
    });

    function actualizarTree(node, verificaHoja) {
        var nodeLoad;
        (verificaHoja && node.isLeaf())
            ? nodeLoad = nodoPadre
            : nodeLoad = node;
        treeLoader.load(nodeLoad, function () {
            nodeLoad.expand();
        });
    }

    function loadMask(message) {
        lMask = new Ext.LoadMask(Ext.getBody(), {msg: message});
        lMask.show();
    }

    treeLoader.on('load', function (yo, node, response) {

        responseData = Ext.decode(response.responseText);
        new Ext.tree.TreeSorter(trEE,
            {
                sortType: function (node) {
                    return parseInt(node.attributes.clavecuenta);
                }
            });
        if (responseData.codigo == 1) {
            window.parent.mostrarMensaje(responseData.codigo, responseData.mensaje);
        }
        else if (responseData.codigo == 3) {
            window.parent.mostrarMensaje(responseData.codigo, responseData.mensaje);
        }

    }, this);

    if (comboParent) Ext.UCID.integraInterfaz(trEE, comboParent);
};
//cargarInterfaz();