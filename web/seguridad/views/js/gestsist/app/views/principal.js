/**
 * Created by lilianne on 23/01/15.
 */
Ext.define('Conf.view.gestsist.Principal' ,{
    extend: 'Ext.panel.Panel',
    alias : 'widget.principal',

    initComponent: function() {
        this.id = 'principal';
        this.PanelWest = Ext.widget('treeDD');
        this.PanelDerecho = Ext.widget('panelDerecho');
        this.layout  = 'border';
        this.region = 'center'
        this.items = [

            this.PanelWest,
            this.PanelDerecho

        ];

        this.callParent(arguments);
    }
});
