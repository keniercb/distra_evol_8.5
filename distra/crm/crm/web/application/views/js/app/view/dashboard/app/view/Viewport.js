/**
 * @class Ext.app.Portal
 * @extends Object
 * A portal layout application class.
 */

Ext.define('Dashboard.view.Viewport', {

    extend: 'Ext.container.Viewport',
    requires: [
        'Dashboard.view.core.PortalPanel',
        'Dashboard.view.core.PortalColumn'
    ],
    initComponent: function () {
        var content = '<div class="portlet-content">' + 'Example' + '</div>';

        Ext.apply(this, {
            id: 'app-viewport',
            layout: {
                type: 'border',
                padding: '0 5 5 5' // pad the layout from the window edges
            },
            items: [{
                xtype: 'container',
                region: 'center',
                layout: 'border',
                items: [{
                    id: 'app-portal-container',
                    xtype: 'panel',
                    region: 'center',
                    border:false,
                    autoScroll:true,
                    items: [{
                        id: 'app-portal',
                        xtype: 'portalpanel',
                        region: 'center',
                        border:false,
                        items: [{
                            id: 'col-a-1',
                            items: []
                        }, {
                            id: 'col-a-2',
                            items: []
                        }, {
                            id: 'col-a-3',
                            items: []
                        }]
                    }]
                }]
            }]
        });
        this.callParent(arguments);
    }
});
