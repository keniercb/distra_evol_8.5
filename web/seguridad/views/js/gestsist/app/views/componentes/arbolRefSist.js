/**
 * Created by lily on 18/02/15.
 */
Ext.define('Conf.view.gestsist.arbolRefSist', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.arbolRefSist',

    initComponent: function () {

        this.arbolStore = Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url: 'cargarArbolSistemaFisico'
            },
            root: {
                text: perfil.etiquetas.textroot,//'Subsistemas',
                id: 'root',
                expanded: true
            }
        });

        this.store = this.arbolStore;
        this.title = perfil.etiquetas.titleArbolReferencia; //'Árbol de Referencias';
        this.border = false;
        this.id = 'arbolRefSist';
        this.name = 'arbolRefSist';
        this.autoScroll = true;
        this.useArrows = true;
        this.viewConfig = {
            loadingText: perfil.etiquetas.cargando //'Cargando'
        };
        this.width = 285;
        this.height = '100%';
        this.callParent(arguments);
    }
});
