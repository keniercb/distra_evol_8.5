Ext.ns('Pvd.Nomina.Configuracion.General');
Ext.QuickTips.init();

//Vista del componente Configurar variables globales.
Pvd.Nomina.Configuracion.General.Vista = {
    init: function (perfil, idioma, modelo) {
        /*this.ventanaAdicionarAfiliacion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioPeriodos],
            buttons: [this.btnCancelarPeriodo, this.btnAplicarPeriodo, this.btnAceptarPeriodo]
        });*/

        //Nodo raíz del árbol de configuraciones.
        this.nodoRaiz = new Ext.tree.AsyncTreeNode({
            id  : 'root',
            text: 'Configuraciones',
            expanded: true
        });

        //Arbol donde se listan las configuraciones
        this.arbolConfiguraciones = new Ext.tree.TreePanel({
            id         : 'arbolconfiguraciones',
            title      : '',
            region     : 'west',
            collapsible: true,
            autoScroll : true,
            split      : true,
            border     : false,
            rootVisible: true,
            width      : '100%',
            loader     : modelo.loaderArbolConfiguraciones,
            root       : this.nodoRaiz,
        });

        //Panel de configuraciones
        this.pConfiguraciones = new Ext.Panel({
            title: 'Listado de configuraciones',
            region: 'west',
            layout: 'fit',
            width: 350,
            height: '100%',
            collapsible: true,
            split: true,
            items: [this.arbolConfiguraciones]
        });

        //TabPanel
        this.tabPanel = new Ext.TabPanel({
            id             : 'idtabpanel',
            region         : 'center',
            enableTabScroll: true,
            defaults       : {
                autoScroll: true
            },
            resizeTabs     : true,
            width          : '100%',
            minTabWidth    : 115,
            tabWidth       : 320,
            frame          : true

        });

        //Vista general
        new Ext.Viewport({
            layout: 'border',
            items : [this.pConfiguraciones, this.tabPanel]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('confgeneral', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Configuracion.General.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Pvd.Nomina.Configuracion.General.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Configuracion.General.Controlador.init(idioma, vista, modelo);
});
