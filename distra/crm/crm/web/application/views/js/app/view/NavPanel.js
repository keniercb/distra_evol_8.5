Ext.define('CRM.view.NavPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.column_navpanel',

    border: false,
    layout: 'border',
    split: true,
    collapsed: false,

    // esto es lo viejo para cuando solo esta el acordion
    //border: false,
    //layout: 'accordion',
    //split: true,
    //activeItem: 0,
    //collapsed: false,

    initComponent: function () {
        this.getLang();

        this.title = '<span class="icondistra-vermapa"></span>' + this.etiquetas.lbNavegacion;
        this.pinned = true;

        this.searchfield = Ext.create('Ext.ux.SearchField', {
            flex: 1,
            searchTooltip: this.etiquetas.lbSearchModules,
            clearTooltip: this.etiquetas.lbClearFilter
        });
        this.tbar = [
            this.searchfield,
            '-',
            {
                xtype: 'button',
                iconCls: 'icondistra-anclar',
                action: 'showpin',
                enableToggle: true,
                tooltip: this.etiquetas.qtipShowPin
            },
            {
                xtype: 'button',
                iconCls: 'icondistra-guardar',
                hidden: true,
                action: 'savepin',
                tooltip: this.etiquetas.qtipSavePin
            }
        ];

        this.tools = [
            {type: 'pin', tooltip: this.etiquetas.qtipUnpinNavbar},
            {type: 'unpin', tooltip: this.etiquetas.qtipPinNavbar, hidden:true}
        ];

        /* apartir de aqui fue que se agrego para poner el date picker*/
        this.items = [Ext.create('Ext.panel.Panel', {
                region: 'center',
                layout: 'accordion',
                activeItem: 0,
                border: false,
                items: this.items
            })]

        this.callParent();
    }
});
