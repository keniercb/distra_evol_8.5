/**
 * Created by kmilo on 16/6/2018.
 */

Ext.define('CheckIntegrity.view.tabHistorial', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tabHistorial',
    title: Zeolides.etiquetas.tittleHistorial,
    layout: 'border',
    initComponent: function () {
        this.items = [
            { xtype: 'gridHistorial' },
            { xtype: 'detallesHistorial' }
        ];
        this.callParent(arguments);
    }
});