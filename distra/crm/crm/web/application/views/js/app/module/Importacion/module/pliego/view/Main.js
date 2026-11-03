Ext.define('Pliego.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mainpliego',
    closable:true,
    border: false,
    layout: 'border',
    bodyStyle: {
        padding: '0px 0px 0px 5px',
        background: '#DFE9F6'
    },
    requires:[
        'Ext.ux.form.field.ToggleSlide',
    ],
    initComponent: function () {
        this.createBody();
        this.callParent();
    },
    createBody: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.title ='Pliego';

        // me.panelOfertas=Ext.create('Ext.panel.Panel',{
        //     title: 'Ofertas/Reofertas',
        //     region: 'west',
        //     minWidth: 200,
        //     width: 250,
        //     maxWidth: 600,
        //     collapsible:true,
        // });
        var panelOfertas=Ext.create('Pliego.view.PanelOfertas',{
            itemId: 'panelofertas',
            region: 'west',
            minWidth: 290,
            width: 315,
            maxWidth: 600,
            resizable:true,
            collapsible:true,
            layout: 'border'
        });
        function showTooltip (value, meta) {
            if (value) meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }

        var gridPrincipalVistaOfertas=Ext.create('Pliego.view.GridPrincipal',{
            title: 'General'
        });

        var tabVistaOferta=Ext.create('Ext.tab.Panel',{
            title: 'Datos de ofertas',
            itemId: 'tabvistaoferta',
            region: 'south',
            minHeight: 200,
            height: window.innerHeight*0.5,
            maxHeight:window.innerHeight*0.7,
            resizable:true,
            collapsible:true,
            collapsed: true
        });

        this.items = [
            panelOfertas,
            gridPrincipalVistaOfertas,
            tabVistaOferta
        ];
    }
});