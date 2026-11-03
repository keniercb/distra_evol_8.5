Ext.define('TipoContrato.view.Configuracion', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.configuracion',
    layout: 'border',
    plugins: Ext.create('CRM.plugins.ComponentElementEvent'),

    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);

        this.configElemento = Ext.create('TipoContrato.view.ConfigElemento');
        this.pnlConfigElementoContrato = Ext.create('Ext.panel.Panel', {
            title: '<span class="icondistra-configuracion"></span>' + me.etiquetas.lbConfigElemento,
            region: 'east',
            collapsed: true,
            width: 350,
            split: true,
            collapsible: true,
            border: false,
            layout: 'border',
            items: [
                this.configElemento
            ]
        });

        this.elementoContrato = Ext.create('TipoContrato.view.ElementoContrato', {
            region: 'center',
            border: false,
            flex: 0.5
        });

        this.btnCancelar = Ext.create('Ext.Button', {
            text: me.etiquetas.cancelar,
            tooltip: me.etiquetas.tpcancelarCfg,
            action: 'cancelC',
            disabled: true,
            hidden:true,
            selector: 'cancelElementoContrato',
            iconCls: 'icondistra-cancelar',
            keyMap: {
                key: 'x',
                alt: true,
                ctrl: true,
                event: 'click'
            }
        });

        this.btnGuardar = Ext.create('Ext.Button', {
            text: me.etiquetas.guardar,
            action: 'saveC',
            disabled: true,
            hidden:true,
            iconCls: 'icondistra-guardar',
            selector: 'saveElementoContrato',
            listeners: {
                render: function () {
                    var tp = Ext.create('Ext.tip.ToolTip', {
                        html: me.etiquetas.tpguardarCfg,
                        target: me.btnGuardar.getEl(),
                        listeners: {
                            beforeshow: function (me2, eOpts) {
                                me2.targetXY[1] = me2.targetXY[1] - 55;
                            }
                        }
                    });
                }
            },
            keyMap: {
                key: 'g',
                alt: true,
                ctrl: true,
                event: 'click'
            }
        });

        this.pnlConfiguracion = Ext.create('Ext.panel.Panel', {
            region: 'center',
            layout: 'border',
            border: false,
            title: me.etiquetas.lbElementosContrato,
            items: [
                this.elementoContrato,
                this.pnlConfigElementoContrato]

        });

        this.items = [this.pnlConfiguracion];
        this.bbar = ['->', this.btnCancelar, this.btnGuardar];

        this.callParent();
    }
});