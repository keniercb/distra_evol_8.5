Ext.define('BaseModule.controller.SelectWindow', {
    extend: 'Ext.app.Controller',

    init: function () {
        this.listen({
            component: {
                'selectwindow centergrid': {
                    'selectionchange': this.onItemSelect
                },
                'selectwindow button[action]': {
                    click: this.onClickAction
                },
                'selectwindow': {
                    addselected: this.onAddSelected,
                    destroy:this.onDestroy
                }
            }
        });
    },
    onClickAction: function (btn) {
        switch (btn.action) {
            case 'acept':
                this.onAcept(btn);
                break;
            case 'cancel':
                this.onCancel(btn);
                break;
        }
    },
    onAcept: function (btn) {
        var window = btn.up('window'),
            field = window.field,
            grid = window.down('centergrid'),
            records = grid.getSelectionModel().getSelection();

        if (!window.fireEvent('beforeaddselected', window, grid, field, records)) {
            return;
        }

        window.fireEvent('addselected', window, grid, field, records);
        window.close();
    },
    onCancel: function (btn) {
        btn.up('selectwindow').close();
    },
    onDestroy:function(window){
        window.field.focus();
        if(window.field.xtype == "cmbselectfield" && Ext.isEmpty(window.field.getValue())){
            window.field.expand();
        }
    },
    onItemSelect: function (sm, records) {
        var count = records.length,
            window = sm.view.up('window');

        if (count == 1 || (window.multiSelect && count > 1)) {
            window.btnAceptar.enable();
        } else {
            window.btnAceptar.disable();
        }
    },
    onAddSelected: function (window, grid, field, records) {
        if (field.xtype && (field.xtype == "selectfield" || field.xtype == "cmbselectfield") && field.up('form')) {
            var idproperty = grid.getStore().getProxy().reader.idProperty,
                nameproperty = field.realColumn ? field.realColumn.split('.')[1] : field.mapping.split('.')[1],
                form = field.up('form'),
                values = {};

            values[field.name] = new Array();
            values[field.localId] = new Array();

            Ext.each(records, function (record) {
                values[field.name].push(record.data[nameproperty]);
                values[field.localId].push(record.data[idproperty]);
            });

            field.setValue(values[field.name]);

            var hiddenField = form.getForm().findField(field.localId);
            if (hiddenField) {
                hiddenField.multiSelect = field.multiSelect;
                hiddenField.setValue(values[field.localId]);
            }
            window.fireEvent('afteraddselected', window, grid, field, records);
        }
    },
    showWindow: function (field) {
        var model = field.realColumn ? field.realColumn.split('.') : field.mapping.split('.'),
            window = Ext.create('BaseModule.view.SelectWindow',{
                field: field,
                multiSelect: field.multiSelect,
                modelName: model[0]
            }),
            grid = window.down('centergrid');

        window.show();

        if (model.length != 1) {
            grid.fireEvent('onadded', grid);
        }
        return grid;
    }
});

