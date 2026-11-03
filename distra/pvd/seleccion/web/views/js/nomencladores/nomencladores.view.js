/*
 * Nomencladores.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Nomencladores
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Seleccion.Nomencladores');

Ext.QuickTips.init();
 
///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.Seleccion.Nomencladores.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function(idioma, modelo) {

        this.tpMenuNomencladores = new Ext.tree.TreePanel({
            title: 'Listado de nomencladores',
            collapsible: true,
            split: true,
            minSize: 175,
            maxSize: 350,
            margins: '0 0 0 0',
            cmargins: '0 0 0 0',
            width: '20%',
            region: 'west',
            animate: true,
            autoScroll: true,
            loader: modelo.tlMenu,
            containerScroll: true,
            rootVisible: false,
            layout: 'fit',
            root: new Ext.tree.AsyncTreeNode({
                text: 'Raiz',
                id: 'idmenu'
            })
        });

        this.tabPanel = new Ext.TabPanel({
            region: 'center',
            margins: '0 0 0 0',
            height: '100%',
            width: '80%',
            defaults:{autoScroll:true},
            activeTab: 0,
            items: [{
                title: 'Inicio',
                id: 'inicio',
                layout: 'fit',
                //iconCls: 'inicio',
                tabTip: 'Inicio',
                cls: 'menureporte-principalTab',
                html: '<div class="info-container"><div class="info"><p>Por favor seleccione uno o varios elementos del men&uacute.</p><hr/></div></div>'
            }],
            listeners: {
                activate: function (p) {
                    p.doLayout();
                }
            }
        });
       
        //Vista general
        new Ext.Viewport({
            layout: 'border',
            items: [this.tpMenuNomencladores, this.tabPanel]
        });
	}
};

	//Inicializando la vista.
	UCID.portal.cargarEtiquetas('nomencladores', function(perfil, idioma){
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;
    
    //Inicializando el modelo
    var modelo = Pvd.Seleccion.Nomencladores.Modelo;
    modelo.init();
    
    //Inicializando la vista.
    var vista = Pvd.Seleccion.Nomencladores.Vista;
    vista.init(idioma, modelo);
    
    //Inicializar controlador.
    Pvd.Seleccion.Nomencladores.Controlador.init(idioma, vista, modelo);
});
