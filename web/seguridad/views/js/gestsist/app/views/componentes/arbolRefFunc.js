/**
 * Created by lily on 11/02/15.
 */
Ext.define('Conf.view.gestsist.arbolRefFunc', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.arbolRefFunc',

    initComponent: function () {

        this.arbolStore = Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url: 'cargarReferenciaFuncionalidades'
            },
            root: {
                text: perfil.etiquetas.textroot1,//'Aplicaciones',
                id: '0',
                expanded: true
            }
        });

        this.store = this.arbolStore;
        this.title = perfil.etiquetas.titleArbolReferencia;//'Árbol de Referencias';
        this.border = false;
        this.id = 'arbolRefFun';
        this.name = 'arbolRefFun';
        this.autoScroll = true;
        this.useArrows = true;
        this.viewConfig = {
            loadingText: perfil.etiquetas.cargando//'Cargando'
        };
        this.width = 285;
        this.height = '100%';
        this.callParent(arguments);
    }
});
