/*
 * Nomencladores.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.MovimientosLaborales
 * @uses Pvd.MovimientosLaborales.Nomencladores
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.MovimientosLaborales.Nomencladores');
Ext.QuickTips.init();

Pvd.MovimientosLaborales.Nomencladores.Vista = {
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
            defaults: {autoScroll: true},
            activeTab: 0,
            items: [{
                title: 'Inicio',
                id: 'inicio',
                layout: 'fit',
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

        new Ext.Viewport({
            layout: 'border',
            items: [this.tpMenuNomencladores, this.tabPanel]
        });
    }
};

UCID.portal.cargarEtiquetas('nomencladores', function(perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;
    let modelo = Pvd.MovimientosLaborales.Nomencladores.Modelo;
    modelo.init();
    let vista = Pvd.MovimientosLaborales.Nomencladores.Vista;
    vista.init(idioma, modelo);
    Pvd.MovimientosLaborales.Nomencladores.Controlador.init(idioma, vista, modelo);
});