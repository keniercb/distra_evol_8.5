/**
 * Interfaz para nomencladores de persona
 *
 * @author Ing. Javier Rodríguez López
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('Ext.pvd.persona.nomenclador');

Ext.pvd.persona.nomenclador.View = {

    init: function (perfil, lang, model) {
        var self = this;
        this.tfSearch = new Ext.form.TriggerField({
            emptyText: 'Criterio a buscar...',
            width: 180,
            enableKeyEvents: true,
            triggerClass: 'x-form-search-trigger'
        });

        this.tpNomenclador = new Ext.tree.TreePanel({
            id: 'nom-tree',
            title: 'Listado de nomencladores',
            region: 'west',
            margins: '5 0 5 5',
            cmargins: '5 5 5 5',
            width: '25%',
            collapsible: true,
            split: true,
            expanded: true,
            autoScroll: true,
            rootVisible: false,
            tbar: [this.tfSearch],
            root: new Ext.tree.AsyncTreeNode({
                text: 'Nomencladores',
                draggable: false,
                expandable: true,
                expanded: true
            }),
            loader: model.tlNomenclador,
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.tpNomenclador.fireEvent('enter-key', self.tpNomenclador);
                    }
                }
            ]
        });
        this.dvInicio = new Ext.DataView({
            autoHeight: true,
            frame: true,
            store: model.storeInicio,
            overClass: 'x-view-over',
            itemSelector: 'div.thumb-wrap',
            tpl: new Ext.XTemplate('<tpl for=".">', '<div class="images-view thumb-wrap" id="{denominacion}">', '<dd ext:idnodo="{idnomenclador}"><img src="{imagen}" title="{denominacion}"/>', '<div>', '<h4>{denominacion}</h4>', '<p>{descripcion}</p>', '</div>', '</dd>', '</div>', '</tpl>')
        });

        this.tbpCenter = new Ext.TabPanel({
            region: 'center',
            margins: '5 5 5 0',
            width: '75%',
            activeTab: 0,
            enableTabScroll: true,
            plugins: new Ext.TabPanel.TabCloseMenu(),
            items: [
                {
                    layout: 'fit',
                    title: 'Inicio',
                    id: 'home',
                    iconCls: 'inicio',
                    autoScroll: true,
                    cls: 'images-view',
                    items: this.dvInicio
                }
            ]
        });

        var vp = new Ext.Viewport({
            layout: 'border',
            items: [this.tpNomenclador, this.tbpCenter]
        });

    }
};

var perfil = window.parent.parent.UCID.portal.perfil;
Ext.QuickTips.init();
labels = Object();

UCID.portal.cargarEtiquetas('nomenclador', function (perfil, lang) {
    //Escogiendo la configuración del lang según la versión del MT.
    lang = (lang) ? lang : perfil.etiquetas;

    //Inicializando el model
    var model = Ext.pvd.persona.nomenclador.Model;
    model.init(perfil);

    //Inicializando la view.
    var view = Ext.pvd.persona.nomenclador.View;
    view.init(perfil, lang, model);

    //Inicializar controlador.
    var controller = Ext.pvd.persona.nomenclador.Controller;
    controller.init(perfil, lang, view, model);
});