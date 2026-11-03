Ext.define('GestionCampanna.controller.AddCliente', {
    extend: 'Ext.app.Controller',

    views: ['AddCliente'],

    refs: [{ref: 'AddCliente', selector: 'addcliente'},
        {ref: 'AddActividad', selector: 'addactividad'},
        {ref: 'clienteGrid', selector: 'gc_clientegrid'}
    ],

    init: function () {

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {
                'addcliente button[action]': {
                    click: this.onClickAction
                },
                'addcliente grid': {
                    selectionchange: this.onSelectionChange
                },
                'addcliente searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                }
            }
        });
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
    onSelectionChange: function (sm, records) {
        var button = this.getAddCliente().btnAceptar;

        if (records.length > 0) {
            button.enable();
        } else {
            button.disable();
        }
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
    onClear: function () {
        this.getAddCliente().custom.getStore().load();
    }


});