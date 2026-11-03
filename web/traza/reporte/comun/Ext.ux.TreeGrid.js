/**
 * Created by me on 20/01/16.
 */
Ext.define('Ext.ux.TreeGrid', {
    extend: 'Ext.tree.Panel',

    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*'
    ],
    xtype: 'tree-grid',
    useArrows: true,
    rootVisible: true,
    multiSelect: false,
    singleExpand: false,

    initComponent: function() {
        this.callParent();
    }
});
