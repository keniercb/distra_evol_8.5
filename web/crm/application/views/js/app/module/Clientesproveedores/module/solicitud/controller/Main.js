Ext.define('Solicitud.controller.Main', {
    extend: 'Ext.app.Controller',

    views: ['MainGrid'],

    refs: [{ref: 'MainGrid', selector: 'scp_maingrid'}],

    init: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {
                'scp_maingrid': {
                    selectionchange: this.enableButtons
                },
                'scp_maingrid button[action],scp_maingrid menuitem[action]': {
                    click: this.onClickAction
                }
            }
        });
    },

    enableButtons: function (sm, records) {
        var cant = sm.getCount(),
            grid = this.getMainGrid(),
            flag = cant != 1;

        grid.btnDetalles.setDisabled(flag);
        grid.btnCambiarEstado.setDisabled(flag);
        if (!flag) {
            console.log(records[0].data);
            grid.btnAprobar.setDisabled(records[0].data.estado == 1);
            grid.btnRechazar.setDisabled(records[0].data.estado == 2);
        }
    },

    onClickAction: function (btn) {
        switch (btn.action) {
            case 'acept':
                this.changeState(btn);
                break;
            case 'deny':
                this.changeState(btn);
                break;
            case 'detail':
                this.showDetails(btn);
                break;
        }
    },

    changeState: function (btn) {
        var me = this,
            grid = btn.up('scp_maingrid'),
            record = grid.getSelectionModel().getSelection()[0],
            id = record.data.idsolicitud,
            value = btn.value;
        mostrarMensaje(2, this.etiquetas.msgCambiarEstado, function (response) {
            if (response === 'ok') {

                Ext.MessageBox.show({
                    msg: me.etiquetas.msgCambiandoEstado,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'setEstadoSolicitud'}, me),
                    params: {
                        idsolicitud: id,
                        estado: value
                    },
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        if (success) {
                            grid.getStore().load();
                        }
                    }
                });
            }
        });


    },

    showDetails: function (btn) {
        var record = btn.up('scp_maingrid').getSelectionModel().getSelection()[0];
        console.log(record);
        Ext.create('Solicitud.view.WinDetalles').show(record);
    }


});
