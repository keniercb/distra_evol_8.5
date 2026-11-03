/**
 * Jorge Luis Cuellar Mondeja
 */
Ext.ns('Ext.erp')

Ext.QuickTips.init();

Ext.erp.mainNomDinamicos = {
    init: function () {
        var compNomDinamicos = new Ext.erp.compNomDinamicos({
            region: 'center',
            listeners: {
                'show': function (cmp) {

                    var vp = new Ext.Viewport({
                        layout: 'border',
                        items: [cmp]
                    });
                }
            }
        });
    }
};

Ext.erp.mainNomDinamicos.init();