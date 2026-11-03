/**
 * Created by kmilo on 16/6/2018.
 */

Ext.define('CheckIntegrity.view.detallesHistorial', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.detallesHistorial',
    region: 'east',
    border: false,
    margins: '5 5 5 5',
    width: '60%',
    layout: 'fit',
    initComponent: function () {
        this.items = [{
            xtype: 'textarea',
            value: Zeolides.etiquetas.lbDetalles,
            style: 'margin:0' // Remove default margin
        }];
        this.callParent(arguments);
    },
});