/**
 * Created by lily on 4/02/15.
 */
Ext.define('Conf.view.gestsist.panelGrid', {
    extend: "Ext.panel.Panel",
    alias: 'widget.panelGrid',

    initComponent: function () {
        this.border = false;
        this.id = 'panelGrid';
        this.name = 'panelGrid';
        this.title = 'Listado de acciones';
        this.region = 'center';
        this.layout = 'border';
        this.tbar = [
            {
                disabled: true,
                id: 'addAccion',
                text: 'Adicionar',
                tooltip: perfil.etiquetas.adicionarAccion,//'Adicionar',
                nextTab: 'deleteAccion',
                prevTab: 'btnAyuda',
                iconCls: 'adicionar',
                action:  'insertarAccion'
            },
            {
                disabled: true,
                id: 'deleteAccion',
                text: 'Eliminar',
                tooltip: perfil.etiquetas.eliminarAccion,//'Eliminar',
                nextTab: 'cajaTextoGrid',
                prevTab: 'addAccion',
                iconCls: 'eliminar',
                action: 'eliminarAccion'
            }
        ];
        this.gridacciones = Ext.widget('gridEditorActions');
        this.items = [this.gridacciones];
        this.callParent(arguments);
    }
});

