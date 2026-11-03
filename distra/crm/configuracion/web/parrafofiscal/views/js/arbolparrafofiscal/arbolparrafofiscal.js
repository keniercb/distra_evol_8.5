//Ext.QuickTips.init();
//var perfil = window.parent.UCID.portal.perfil
//perfil.etiquetas = Object();
//UCID.portal.cargarEtiquetas('gestusuario',cargarInterfaz);
var tpArbolCuenta, comboParent, treeload;

if (window.idcomboiframe) comboParent = window.parent.Ext.getCmp(window.idcomboiframe);

// function CargarInterfaz
function cargarInterfaz() {
    treeload = new Ext.tree.TreeLoader({
        dataUrl: 'cargararbol'
    });

    tpArbolCuenta = new Ext.tree.TreePanel({
        autoScroll: true,
        enableDD: false,
        border: false,
        root: new Ext.tree.AsyncTreeNode({
            text: 'P�rrafos fiscales',
            draggable: false,
            id: '0',
            expanded: true
        }),
        margins: '2 2 2 2',
        loader: treeload
    });
    padreCuentas = new Ext.tree.AsyncTreeNode({
        text: 'P&aacute;rrafos fiscales',
        draggable: false,
        id: '0',
        leaf: false
    });// Nodo padre del arbol
    tpArbolCuenta.setRootNode(padreCuentas);//crear la lista de hijos
    /***    ViewPort    ***/
    var vpArbolCuenta = new Ext.Viewport({
        layout: 'fit',
        items: tpArbolCuenta
    });
    padreCuentas.on('beforeexpand', function (Node, deep, anim) {
        new Ext.tree.TreeSorter(tpArbolCuenta, {
            //folderSort: true,
            sortType: function (node) {
                return parseInt(node.attributes.clavecuenta);
            }
        });
    })
    padreCuentas.expand(false, true);
    tpArbolCuenta.show();

    treeload.on('load', function (yo, node, response) {
        responseData = Ext.decode(response.responseText);
        new Ext.tree.TreeSorter(tpArbolCuenta, {
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

    if (comboParent) Ext.UCID.integraInterfaz(tpArbolCuenta, comboParent);
}// Endof cargarInterfaz
cargarInterfaz();
