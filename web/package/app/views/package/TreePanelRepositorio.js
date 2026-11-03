/**
 * Created by adrian on 19/11/14.
 */
Ext.define('Packed.view.treeRepositorio', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.treeRepo',
    mixins: {
        treeFilter: 'Packed.lib.TreeFilter'
    },

    initComponent: function () {

        this.treeStore = Ext.create('Ext.data.TreeStore', {

            proxy: {
                type: 'ajax',
                url: 'getRepositories'

            },
            root: {
                text: Zeolides.etiquetas.textRootTreeRepo,
                id: 'src',
                expanded: false,
                children: []
            },
            folderSort: true,
            sorters: [{
                property: 'text',
                direction: 'ASC'
            }]
        });

        this.id = 'treeSvn',
        this.name = 'treeSvn',
        this.width = 485,
        this.height = 310,
        this.emptyText = 'No existen datos que mostrar.',
        this.store = this.treeStore,
        this.viewConfig = {
                loadingText: Zeolides.etiquetas.textCargando
            },
        this.dockedItems = [
            {
            xtype: 'toolbar',
            items:[{ xtype: 'textfield',
                name: 'filtroTree',
                id: 'filtroTree',
                emptyText : Zeolides.etiquetas.emptyTextSearch,
                width: 153

            }, {
                //text: 'Buscar',
                iconCls: 'limpiar',
                disabled: true,
                tooltip: 'Limpiar filtro <b>(Alt+L)</b>',
                name: 'btnLimpiarTree',
                id: 'btnLimpiarTree',
                action: 'limpiarFiltroTree'
            }/*, {
             text: 'Limpiar',
             iconCls: 'limpiar',
             tooltip: 'Limpiar filtro <b>(Alt+L)</b>',
             name: 'btnLimpiarTree',
             id: 'btnLimpiarTree',
             action: 'limpiarFiltroTree'
             }*/]}
            ];

        this.callParent(arguments);
    }
});