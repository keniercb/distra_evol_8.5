/**
 * Created by adrian on 19/11/14.
 */
Ext.define('Controlpanel.view.treeRepositorio', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.treeRepo',
    mixins: {
        treeFilter: 'Controlpanel.lib.TreeFilter'
    },

    initComponent: function () {

        this.treeStore = Ext.create('Ext.data.TreeStore', {

            proxy: {
                type: 'ajax',
                url: 'cargarxmlRepositorio'

            },
            root: {
                text: Zeolides.etiquetas.textRootTreeRepo,
                id: 'src',
                expanded: true,
                children: []
            },
            folderSort: true,
            sorters: [{
                property: 'text',
                direction: 'ASC'
            }]
        });

        this.id = 'treePack',
        this.name = 'treePack',
        this.width = 298,
        this.height = 310,
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
                width: 153,
                maskRe: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ0-9])+([a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\d\_\-]*))$/,
                enableKeyEvents: true,
                listeners: {
                    keydown: function (textField,eventObject){
                        var ok = textField.getValue().length < 30;
                        var key = eventObject.getKey();

                        if(key == 8 || key == 46 || key == 35 || key == 36 || key == 37 || key == 39){
                            textField.enableKeyEvents = true;
                            return;
                        }
                        else if(!ok){
                            eventObject.stopEvent();
                            return ;
                        }
                        else if(eventObject.ctrlKey && key == 86){
                            eventObject.stopEvent();
                            return ;
                        }
                    }
                }


            }, {
                //text: 'Buscar',
                iconCls: 'limpiar',
                disabled: true,
                tooltip: 'Limpiar filtro <b>(Ctrl+Alt+L)</b>',
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