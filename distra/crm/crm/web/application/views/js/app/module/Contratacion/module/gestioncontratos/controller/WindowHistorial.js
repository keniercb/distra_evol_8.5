Ext.define('GestionContrato.controller.WindowHistorial', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'gridHistorial', selector: 'GridHistorialContratacion'}
    ],

    init: function () {
        this.getLang();

        this.listen({
            store: {
                '#stHistorial': {
                    load: this.onLoadHistorial,
                    beforeload: function () {
                        this.getGridHistorial().getSelectionModel().clearSelections();
                    }
                }
            },
            component: {
                'windowhistorial': {
                    beforeshow: function () {
                        this.application.keyMap.disable();
                    },
                    close: function () {
                        this.application.keyMap.enable();
                    }
                },
                'GridHistorialContratacion': {
                    itemdblclick: this.onDbClickGridHistorial,
                    selectionchange: this.enableButton
                }
            }
        });
    },

    onClickAction: function (cmp) {
        var me = this;

        switch (cmp.action) {
            case 'detail':
                this.createDetail(cmp);
                break;
        }
    },

    createDetail: function (cmp) {
        var grid = cmp.up('gridpanel'),
            record = grid.getSelectionModel().getSelection()[0];
        Ext.create('GestionContrato.view.DetailsWindow').show(record);
    },


    onDbClickGridHistorial: function (gridView, record, item, rowIndex, colIndex, column, e) {
        var btn = this.getGridHistorial().btnDetails;
        btn.fireEvent('click', btn);
    },

    enableButton: function (sm) {
        var grid = this.getGridHistorial(),
            records = sm.getSelection();

        if (records.length == 1) {
            grid.btnDetails.enable();
            // grid.btnMod.enable();
        } else {
            grid.btnDetails.disable();
            // grid.btnMod.disable();
        }
    },

    onLoadHistorial: function(store){
        var data = store.proxy.reader.jsonData.monedasentidad;
        this.getGridHistorial().extrafields = data;
    }
});