Ext.define('Demanda.controller.WindowHistorialDemanda', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'GridHistorialDemanda', selector: 'gridhistorialdemanda'},
        {ref: 'WinDetallesDemanda', selector: 'windetallesdemanda'},
    ],

    requires: [
        'Demanda.view.GridHistorialDemanda',
        'Demanda.view.WinDetallesDemanda'
    ],
    init: function () {
        this.getLang();

        this.listen({
            store: {
                '#stHistorialDemanda': {
                    load: this.onLoadHistorial,
                    beforeload: function () {
                        this.getGridHistorialDemanda().getSelectionModel().clearSelections();
                    }
                }
            },
            component: {
                'windowhistorialdemanda': {
                    beforeshow: function () {
                        this.application.keyMap.disable();
                    },
                    close: function () {
                        this.application.keyMap.enable();
                    }
                },
                'gridhistorialdemanda': {
                    // itemdblclick: this.onDbClickGridHistorial,

                    selectionchange: this.enableButton,
                    // select: this.enableButton,
                    // deselect: this.enableButton,
                },
                "gridhistorialdemanda button[action=detaildemanda], menuitem[action=detaildemanda]": {
                    click: this.createDetail
                }
            }
        });
    },

    // onClickAction: function (cmp) {
    //     alert(hhh)
    //     var me = this;
    //     switch (cmp.action) {
    //         case 'detail':
    //             this.createDetail(cmp);
    //             break;
    //     }
    // },

    createDetail: function (cmp) {
        var grid = cmp.up('gridpanel'),
            record = grid.getSelectionModel().getSelection()[0];
        Ext.create('Demanda.view.WinDetallesDemanda').show(record);
    },


    // onDbClickGridHistorial: function (gridView, record, item, rowIndex, colIndex, column, e) {
    //     var btn = this.getGridHistorialDemanda().btnDetails;
    //     btn.fireEvent('click', btn);
    // },

    enableButton: function (sm) {
        var grid = this.getGridHistorialDemanda(),
            records = sm.getSelection();
        if (records.length == 1) {
            grid.btnDetails.enable();
        } else {
            grid.btnDetails.disable();
        }
    },

});