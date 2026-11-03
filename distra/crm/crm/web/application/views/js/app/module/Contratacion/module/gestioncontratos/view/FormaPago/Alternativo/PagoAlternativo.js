Ext.define('GestionContrato.view.FormaPago.Alternativo.PagoAlternativo', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.PagoAlternativo',
    dock: 'top',
    layout: 'column',
    border: false,
    bodyStyle: 'background:#DFE9F6;',
    columnWidth: 1,
    autoScroll: true,

    initComponent: function () {
        this.createInitialConfig();
        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;

        me.hidden = me.valueCheckHitoPago;
        me.etiquetas = LangMgr.getLang(me);
        me.btnAddMoneda = Ext.create('Ext.button.Button', {
            iconCls: 'icondistra-adicionar icon-medium',
            action: 'addmoneda',
            tooltip: me.etiquetas.lbAdd + ' ' + me.etiquetas.lbMoneda.toLowerCase(),
            width: 21,
            height: 21,
            margin: '3 0 0 5'
        });
        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            style: "background-color: transparent; background-image: none;",
            items: ['->', {
                xtype: 'label',
                text: me.etiquetas.lbMoneda
            }, '->', '->', {
                xtype: 'label',
                text: me.etiquetas.lbTasa
            }, '->', '->', {
                xtype: 'label',
                text: me.etiquetas.lbMonto
            }, '->'/*, '->'*/]
        }, {
            xtype: 'toolbar',
            dock: 'bottom',
            style: "background-color: transparent; background-image: none;",
            items: ['->', me.btnAddMoneda]
        }];
    },
    reset: function () {
        var length = this.items.length - 1;
        while (length != 0) {
            this.remove(this.getComponent(length));
            length--;
        }
        this.getComponent(0).reset();
    }
});
