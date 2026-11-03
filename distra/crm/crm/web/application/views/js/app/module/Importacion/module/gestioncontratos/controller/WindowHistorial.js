Ext.define('GestionContratoImportacion.controller.WindowHistorial', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'GridHistorialContratacion', selector: 'gridhistorialcontratacionimportacion'}
    ],

    init: function () {
        this.getLang();

        this.listen({
            store: {
                '#stHistorialImportacion': {
                    load: this.onLoadHistorial,
                    beforeload: function () {
                        this.getGridHistorialContratacion().getSelectionModel().clearSelections();
                    }
                }
            },
            component: {
                'windowhistorialimportacion': {
                    beforeshow: function () {
                        this.application.keyMap.disable();
                    },
                    close: function () {
                        this.application.keyMap.enable();
                    }
                },
                'gridhistorialcontratacionimportacion': {
                    itemdblclick: this.onDbClickGridHistorial,
                    selectionchange: this.enableButton
                }
            }
        });
    },

    onClickAction: function (cmp) {
        var me = this;
        console.log('cmp.action',cmp.action)
        switch (cmp.action) {
            case 'detail':
                this.createDetail(cmp);
                break;
        }
    },

    createDetail: function (cmp) {
        var grid = cmp.up('gridpanel'),
            record = grid.getSelectionModel().getSelection()[0];
        console.log('record',record)
        Ext.create('GestionContratoImportacion.view.DetailsWindow').show(record);
    },


    onDbClickGridHistorial: function (gridView, record, item, rowIndex, colIndex, column, e) {
        var btn = this.getGridHistorialContratacion().btnDetails;
        btn.fireEvent('click', btn);
    },

    enableButton: function (sm) {
        var grid = this.getGridHistorialContratacion(),
            records = sm.getSelection();

        if (records.length == 1) {
            grid.btnDetails.enable();
            // grid.btnMod.enable();
        } else {
            grid.btnDetails.disable();
            // grid.btnMod.disable();
        }
    },

    onLoadHistorial: function (store) {
        var data = store.proxy.reader.jsonData.monedasentidad;
        this.getGridHistorialContratacion().extrafields = data;
    }
});