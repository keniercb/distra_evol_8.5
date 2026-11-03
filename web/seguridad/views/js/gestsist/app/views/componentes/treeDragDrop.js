/**
 * Created by lilianne on 23/01/15.
 */

Ext.require([
    'Ext.tree.*',
    'Ext.data.*',
    'Ext.tip.*'
]);

Ext.define('Conf.view.gestsist.treeDragDrop', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.treeDD',
    mixins: {
        treeFilter: 'Conf.lib.TreeFilter'
    },
    initComponent: function () {

        this.treeStore = Ext.create('Conf.store.StoreTree');

        this.store = this.treeStore;
        this.title = perfil.etiquetas.titleTree; //'Sistemas registrados';
        this.border = false;
        this.id = 'treeDD';
        this.name = 'treeDD';
        this.autoScroll = true;
        this.useArrows = true;
        this.viewConfig = {
            plugins: {
                ptype: 'treeviewdragdrop'
            },
            loadingText: perfil.etiquetas.cargando //'Cargando'
        };
        this.menu = Ext.widget('panelMenuIzquierdo');
        this.dockedItems = [ this.menu ];
        this.collapsible = true;
        this.collapseMode = 'mini';
        this.collapsed = false;
        this.split = true;
        this.animCollapse = true;
        this.hideCollapseTool = true;
        this.region = 'west';
        this.height = '100%';
        this.width = '23%';


        this.callParent(arguments);
    }
});


