/**
 * @Created with PhpStorm.
 * @Author: Roberto León Socarrás
 * @package Beta
 * @subpackage Wand
 * @Date: 3/3/16
 * @Version:1.0
 */


Ext.ns('Misitio.Funciones');
Misitio.Funciones.VentanaNomencladoresSimples = function (parametros) {

    var identificadorconfiguracion = parametros.identificadorconfiguracion;
    var variables = {
        nodomarcado: -1
    };

    //Nodo raíz del árbol de configuraciones.
    var nodoRaiz = new Ext.tree.AsyncTreeNode({
        id: 'rootNomencladoresSimples' + parametros.id,
        text: 'Nomencladores',
        expanded: true
    });

    var loaderArbolConcepto = new Ext.tree.TreeLoader({
        id: 'loaderArbolNomencladoresSimples' + parametros.id,
        url: '/metadatos/metaconfig/index.php/metaconfig/gestionarAccionesGenericas',
        baseParams: {
            metodo: 'cargarNomencladoresSimples',
            identificadorconfiguracion: identificadorconfiguracion
        }
    });


    //Arbol donde se listan las configuraciones
    var arbolConcepto = new Ext.tree.TreePanel({
        id: 'ArbolNomencladoresSimples' + parametros.id,
        title: '',
        region: 'west',
        collapsible: true,
        autoScroll: true,
        split: true,
        border: false,
        //frame: true,
        rootVisible: true,
        width: '100%',
        loader: loaderArbolConcepto,

    });
    arbolConcepto.setRootNode(nodoRaiz);
    //arbolConcepto.expandAll();


    //Panel de configuraciones
    var pConceptos = new Ext.Panel({
        id: 'pNomencladoresSimples' + parametros.id,
        title: 'Listado de nomencladores',
        region: 'west',
        layout: 'fit',
        width: screen.width * 0.20,
        height: '100%',
        collapsible: true,
        split: true,
        items: [arbolConcepto]
    });

    //TabPanel
    var tabPanelConceptos = new Ext.TabPanel({
        id: 'tabPanelNomencladoresSimples' + parametros.id,
        region: 'center',
        margins: '0 0 0 0',
        height: '100%',
        width: '80%',
        layoutOnTabChange: true,
        defaults: {
            autoScroll: true
        },
        activeTab: 0,
        enableTabScroll: true,
        items: [{
            title: 'Inicio',
            id: 'inicioNomencladoresSimples' + parametros.id,
            layout: 'fit',
            tabTip: 'Inicio',
            cls: 'menureporte-principalTab',
            html: '<div class="info-container"><div class="info"><p>Por favor seleccione uno o varios elementos del men&uacute.</p><hr/></div></div>'
        }],


    });


    var pPrincipal = new Ext.Panel({
        id: 'pPrincipalNomencladoresSimples' + parametros.id,
        layout: 'border',
        collapsible: true,
        split: true,
        items: [pConceptos, tabPanelConceptos]
    });


    var pConceptosGenericos = null;
    arbolConcepto.on('click', function (node, e) {
        variables.nodomarcado = node.id;
        cargarConfiguracion(node);
    });


    function cargarConfiguracion(node) {
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Espere..."});

        var respuesta = new Array();

        if (document.getElementById('tabPanelConceptosconfig' + node.attributes.identificador) == null && node.attributes.leaf == true) {

            myMask.show();


            var configuracionMensajes = {
                femenino: node.attributes.femenino,
                numero: [node.attributes.singular, node.attributes.plural]
            };
            var nuevo = new Misitio.Panel_Gestion.GestionNomenclador({
                nombre: node.attributes.text,
                configuracionMensajes: configuracionMensajes,
                id: 'NomencladoresSimples' + node.id,
                region: 'center',
                tabla: node.attributes.nombretabla,
                idtabla: node.attributes.idtabla
            });

            tabPanelConceptos.add({
                title: node.text,
                id: 'tabPanelConceptosconfig' + node.attributes.identificador,
                tabTip: node.attributes.descripcion,
                autoScroll: true,
                idpanel: nuevo.id,
                height: '100%',
                closable: true,
                layout: 'fit',
                items: [nuevo],
                listeners: {
                    activate: function (p) {
                        p.doLayout();
                    }
                    , beforedestroy: function (p) {
                        Ext.getCmp(p.idpanel).ventanaGestion.destroy();
                    }
                }
            });

                tabPanelConceptos.activate('tabPanelConceptosconfig' + node.attributes.identificador);
                myMask.hide();



        } else {
            tabPanelConceptos.activate('tabPanelConceptosconfig' + node.attributes.identificador);
        }


    }

    return pPrincipal;
};

