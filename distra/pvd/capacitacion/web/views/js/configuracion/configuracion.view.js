/**
 * @name configuracion.view - Vista de la interfaz.
 * @package   Pvd.Capacitacion
 * @uses      Pvd.Capacitacion.Configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 *            Eddy Santana Navarro
 * @version   1.0
 */
Ext.ns('Pvd.Capacitacion.Configuracion');
Ext.QuickTips.init();
Pvd.Capacitacion.Configuracion.Vista = {
    init: function(idioma, modelo) {
        //Menú
        this.tpMenu = new Ext.tree.TreePanel({
            title: idioma.tpMenu_title,
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
            containerScroll: true,
            rootVisible: false,
            layout: 'fit',
            root: modelo.root
        });

        //TabPanel para las configuraciones
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
                cls: 'menureporte-principalTab',
                html: '<div class="info-container"><div class="info"><p>Por favor seleccione una o varias configuraciones del men&uacute.</p><hr/></div></div>',
                tabTip: 'Inicio'
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
            items: [this.tpMenu, this.tabPanel]
        });
    }
};

UCID.portal.cargarEtiquetas('configuracion', function(perfil, idioma){
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Capacitacion.Configuracion.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Capacitacion.Configuracion.Vista;
    vista.init(idioma, modelo);

    //Cargando acciones de la vista
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

    //Inicializar controlador.
    Pvd.Capacitacion.Configuracion.Controlador.init(idioma, vista, modelo);
});
