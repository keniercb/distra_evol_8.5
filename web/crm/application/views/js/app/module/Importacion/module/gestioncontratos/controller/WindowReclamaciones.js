Ext.define('GestionContratoImportacion.controller.WindowReclamaciones', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'GridReclamacionContratacion', selector: 'gridreclamacioncontratacionimportacion'},
        {ref: 'WinDetallesReclamacion', selector: 'windetallesreclamacionimportacion'}
    ],
    requires: [
        'Reclamaciones.view.WinDetallesReclamacion',
    ],


    init: function () {
        this.getLang();

        this.listen({
            store: {
                '#stReclamacionImportacion': {
                    beforeload: function () {
                        this.getGridReclamacionContratacion().getSelectionModel().clearSelections();
                    }
                }
            },
            component: {
                'WindowReclamacionesimportacion': {
                    beforeshow: function () {
                        this.application.keyMap.disable();
                    },
                    close: function () {
                        this.application.keyMap.enable();
                    }
                },
                'gridreclamacioncontratacionimportacion': {
                    selectionchange: this.enableButton,
                },
                'gridreclamacioncontratacionimportacion button[action=detallereclamacion], menuitem[action= detallereclamacion]':{
                   click: this.showWinDetallesReclamacion
                }
            }
        });
    },

    showWinDetallesReclamacion: function () {
        var record = this.getGridReclamacionContratacion().getSelectionModel().getSelection()[0];
        Ext.create('Reclamaciones.view.WinDetallesReclamacion').show(record);
    },

    enableButton: function () {
        var grid = this.getGridReclamacionContratacion(),
            selection = grid.getSelectionModel().getSelection();

        if (selection.length == 1) {
            grid.btnDetalles.enable();
        } else {
            grid.btnDetalles.disable();
        }
    },
});