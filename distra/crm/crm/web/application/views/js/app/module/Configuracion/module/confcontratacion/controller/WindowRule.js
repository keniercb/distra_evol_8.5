Ext.define('ConfContratacion.controller.WindowRule', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'mainForm', selector: 'confcomitetran'},
        {ref: 'trasitionPanel', selector: 'trasitionpanel'},
        {ref: 'window', selector: 'windowrule'},
    ],

    init: function () {
        var me = this;
        this.getLang();
        this.listen({
            component: {
                'windowrule combobox[localId]': {
                    select: this.selectCombo,
                    change: this.changeCombo
                },
                'windowrule': {
                    show: this.onShowWindow,
                    destroy: function () {
                        this.activeWindows--;
                    }
                },
                'windowrule button[action]': {
                    click: this.onClickAction
                }
            }
        });
    },

    onSelectRuleType: function (combo) {
        var form = combo.up('form'),
            window = combo.up('window'),
            hiddenField = form.getForm().findField(combo.localId),
            value = hiddenField ? hiddenField.getValue() : '';
        if (value) {
            var col2 = Ext.ComponentQuery.query('[selector=col2]')[0];
            var col3 = Ext.ComponentQuery.query('[selector=col3]')[0];
            if (value == 2 || value == 3 || value == 4) {
                col2.disable();
                col2.hide();
                col3.enable();
                col3.show();
            } else {
                col3.disable();
                col3.hide();
                col2.enable();
                col2.show();
            }

            if (value == 3 || value == 4) {
                window.nfvalue.setMaxValue();
            } else if (value == 2) {
                window.nfvalue.setMaxValue(window.maxCantRol);
            }
        }
    },

    selectCombo: function (combo, records) {
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);
        if (hiddenField) {
            hiddenField.setValue(records[0].data[combo.localId]);
        }
        if (combo.name == 'tiporegla') {
            this.onSelectRuleType(combo);
        }
    },

    changeCombo: function (combo, value) {
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);

        if (hiddenField && Ext.isEmpty(value)) {
            hiddenField.setValue('');
        }
        if (combo.name == 'tiporegla') {
            this.onSelectRuleType(combo);
        }
    },

    onShowWindow: function (window) {
        var proceso = window.transition ? window.transition.data.nombreproceso : null;
        if(proceso){
            this.getTrasitionPanel().stRol.filter('nombreproceso',proceso);
        }
        var records = this.getTrasitionPanel().stRol.getRange();
        this.getTrasitionPanel().stRol.clearFilter();

        window.maxCantRol = records.length;
        window.stRol.loadData(records);
        window.nfvalue.setMaxValue(window.maxCantRol);

        if (window.action == 'edit' && window.record) {
            window.form.getForm().loadRecord(window.record);
        }

        this.activeWindows++;

        Ext.TaskManager.start({
            run: this.checkWindow.bind(this, window.form),
            interval: 100,
            scope: this
        });
    },

    onClickAction: function (btn) {
        switch (btn.action) {
            case 'acept':
            case 'apply':
                this.saveRule(btn.action);
                break;
        }
    },

    saveRule: function (action) {
        var window = this.getWindow(),
            form = window.form.getForm(),
            values = form.getValues(),
            transition = this.getTrasitionPanel().gpTransition.getSelectionModel().getSelection()[0],
            stRules = this.getTrasitionPanel().gpRules.getStore();

        if (window.action == 'add') {
            if (!Ext.isArray(transition.data.reglas)) {
                transition.data.reglas = new Array();
            }
            transition.data.reglas.push(values);
        } else {
            transition.data.reglas[window.record.index] = values;
        }
        stRules.loadData(transition.data.reglas);

        if (action == 'acept') {
            this.getWindow().destroy();
        } else {
            form.reset();
        }
    },

    checkWindow: function (form) {
        if (this.activeWindows != 0) {
            var bForm = form.getForm(),
                window = form.up('window'),
                invalid = bForm.hasInvalidField(),
                change = bForm.isDirty();

            if (form.action == 'edit') {
                invalid = invalid || !change;
            }
            window.disableButtons(invalid);
        } else {
            return false;
        }
    }
});