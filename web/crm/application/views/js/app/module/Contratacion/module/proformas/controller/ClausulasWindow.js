Ext.define('Proformas.controller.ClausulasWindow', {
    extend: 'Ext.app.Controller',

    refs: [{
        ref: '',
        selector: ''
    }],

    activeWindows: 0,       //contador de ventanas abiertas

    init: function () {

        this.listen({
            component: {
                'clausulaswindow': {
                    'show': this.onShow,
                    'destroy': this.onDestroy,
                    'beforeshow': this.onBeforeShow
                },
                'clausulaswindow selectfield': {
                    select: this.onSelectField,
                    clear: this.onClearField
                },
                'clausulaswindow button[action]': {
                    click: this.onClickAction
                }
            }
        });

    },
    onShow: function (window) {
        console.log('show, a que si')
        var form = window.down('customform'),
            _this = this;
        form.action = window.action;

        if (window.action == 'edit') {
            var sm = window.grid.getSelectionModel();

            form.loadRecord(sm.getLastSelected());
            window.tipo.disable();

            setTimeout(function () {
                window.focus();
            }, 10);

        } else {
            var basicForm = form.getForm(),
                filter = basicForm.getFields().filter('first', true);

            this.firstField = filter.items[0];

            setTimeout(function () {
                _this.firstField.focus();
            }, 10);
        }

        this.activeWindows++;

        Ext.TaskManager.start({
            run: this.checkWindow.bind(this, form),
            interval: 100,
            scope: this
        });
    },
    onDestroy: function (win) {
        var grid = win.grid;

        if (!grid) {
            return;
        }

        var cmps = Ext.ComponentQuery.query('grid[id=' + grid.id + '] button[keyMap],grid[id=' + grid.id + '] searchfield[keyMap]');

        for (k in cmps) {
            if (Ext.isBoolean(cmps[k].currentstate)) {
                cmps[k].setDisabled(cmps[k].currentstate);
                cmps[k].currentstate = false;
            }
        }

        this.activeWindows--;
    },
    onBeforeShow: function (win) {
        if (win.tipocontrato) {
            win.contenido.disableBtnAddElement(false);
            win.contenido.tipocontrato = win.tipocontrato;
        }else{
            win.contenido.disableBtnAddElement(true);
        }

        var grid = win.grid;

        if (!grid) {
            return;
        }

        var cmps = Ext.ComponentQuery.query('grid[id=' + grid.id + '] button[keyMap],grid[id=' + grid.id + '] searchfield[keyMap]');

        for (k in cmps) {
            cmps[k].currentstate = !cmps[k].disabled ? false : true;
            cmps[k].disable();
        }
    },
    onClickAction: function (btn) {
        switch (btn.action) {
            case 'acept':
                this.onSave(btn);
                break;
            case 'apply':
                this.onSave(btn);
                break;
        }
    },
    onSave: function (btn) {
        var me = this,
            window = btn.up('clausulaswindow'),
            form = window.down('form'),
            values = form.getForm().getValues();
        // console.log('values:', values)
        var grid = window.grid;
        delete values['modelName'];
        // console.log('yeeejaaaa', grid)
        if (grid) {
            var store = grid.getStore();
            var pos = store.findExact('idclausula', values['idclausula']);
            // console.log('fields:', pos, store.getAt(pos))
            // console.log('else:', values)
            if (pos != -1) {
                var record = store.getAt(pos);
                for (k in values) {
                    var v = values[k].replace(/^(<br>)*|(<br>)*$/g, '');
                    if (k == 'contenido' && window.action != 'edit') {
                        record.set(k, record.get(k) + '<br><br>' + v);
                    } else if(k!='orden'){
                        record.set(k, v);
                    }
                }
            } else {
                values['contenido'] = values['contenido'].replace(/^(<br>)*|(<br>)*$/g, '');
                store.add(values);
            }
        }

        window.fireEvent('addclausula', window, values);

        if (btn.action == 'apply') {
            form.getForm().reset();
            window.orden.setValue(parseInt(window.orden.getValue())+1);
            window.orden.resetOriginalValue();
        } else {
            window.close();
        }
    },
    onSelectField: function (field) {
        console.log('que cosaaa')
        ModuleMgr.get('BaseModule').getSelectWindowController().showWindow(field);
    },
    onClearField: function (field) {
        console.log('cleeear')
        var form = field.up('form').getForm(),
            fieldIds = form.findField(field.localId);
        fieldIds.setValue('');
    },
    showWindow: function (cmp, tipocontrato, config) {
        var config = typeof config == 'object' ? config : {},
            window = Ext.create('Proformas.view.ClausulasWindow', Ext.Object.merge({
                action: cmp.action,
                grid: cmp.customgrid || cmp.up('customgrid'),
                tipocontrato: tipocontrato
            }, config));

        window.show();
    },
    checkWindow: function (form) {
        if (this.activeWindows != 0) {
            var bForm = form.getForm(),
                window = form.up('clausulaswindow'),
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
