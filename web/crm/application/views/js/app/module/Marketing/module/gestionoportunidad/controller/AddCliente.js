Ext.define('GestionOportunidad.controller.AddCliente', {
    extend: 'Ext.app.Controller',

    refs: [{ref: 'MainWindow', selector: 'go_mainwindow'},
        {ref: 'addCliente', selector: 'go_addcliente'},
        {ref: 'clienteGrid', selector: 'clientgrid'}
    ],

    init: function () {
        var me = this;
        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {
                'go_addcliente gridpanel': {
                    selectionchange: this.onSelectionChange
                },
                'go_addcliente button[action]': {
                    click: this.onClickAction
                },
                'go_addcliente searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                }
            }
        });
    },

    onSelectionChange: function (sm, records) {
        var btn = this.getAddCliente().btnAceptar;
        if (records.length > 0) {
            btn.enable();
        } else {
            btn.disable();
        }
    },

    onClickAction: function (btn) {
        if (btn.action != 'acept') {
            return;
        }
        var store = this.getClienteGrid().getStore(),
            records = this.getAddCliente().custom.getSelectionModel().getSelection();

        Ext.each(records, function (record) {
            if (store.find('idclientesproveedores', record.data.idclientesproveedores) == -1) {
                store.add(record.data);
            }
        });
        this.getAddCliente().close();
    },
    onSearch: function (field) {
        var value = field.getValue(),
            filtro = {
                filtronomb:value
            };
        this.getAddCliente().custom.getStore().load({
            params: {
                filtro: Ext.encode(filtro)
            }
        })
    },
    onClear: function (field) {
        this.getAddCliente().custom.getStore().load();
    }


});

