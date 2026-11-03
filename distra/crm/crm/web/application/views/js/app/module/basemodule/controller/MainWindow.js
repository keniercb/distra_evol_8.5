Ext.define('BaseModule.controller.MainWindow', {
    extend: 'Ext.app.Controller',

    refs: [{
        ref: 'mainWindow',
        selector: 'mainwindow'
    }, {
        ref: 'globalPanel',
        selector: 'globalpanel'
    }, {
        ref: 'customForm',
        selector: 'customform'
    }, {
        ref: 'selectWindow',
        selector: 'selectwindow'
    }],

    activeWindows: 0,       //contador de ventanas abiertas

    init: function () {
        this.listen({
            component: {
                'mainwindow': {
                    'beforeshow': this.onBeforeShow,
                    'show': this.onShow,
                    'destroy': this.onDestroy
                },
                'window': {
                    afterrender: this.addToKeyMap,
                    render: this.setFocus
                },
                'mainwindow selectfield': {
                    select: this.onSelectField,
                    clear: this.onClearField
                },
                'window cmbselectfield[localId]': {
                    select: this.onSelectCmbSelectField,
                    blur: this.onBlurCmbSelectField,
                    reset: this.onResetCmbSelect
                },
                'mainwindow combobox[localId]': {
                    select: this.onSelectCmbSelectField,
                    blur: this.onBlurCmbSelectField,
                    reset: this.onResetCmbSelect
                },
                'mainwindow button[action],boundlist pagingtoolbar button[action]': {
                    click: this.onClickAction
                },
                'form': {
                    beforeaction: this.onBeforeSubmit
                }
            }
        });
    },
    onShow: function (window) {
        var sm = window.mainlist.xtype == "centergrid" ? window.mainlist.getSelectionModel() : {},
            form = window.down('customform');

        if (form) {
            if (window.action == 'edit' && sm) {
                form.loadRecord(sm.getLastSelected());

                setTimeout(function () {
                    window.focus();
                }, 10);

            } else {
                var _this = this,
                    basicForm = form.getForm(),
                    filter = basicForm.getFields().filter('first', true);

                this.firstField = filter.items[0];

                setTimeout(function () {
                    _this.firstField.focus();
                }, 10);

                this.applyDefaultsValues(basicForm, window.mainlist);
            }

            this.activeWindows++;
            // console.log(form);
            Ext.TaskManager.start({
                run: this.checkWindow.bind(this, form),
                interval: 100,
                scope: this
            });
        }
    },
    onDestroy: function (win) {
        var grid = win.mainlist;

        if (!grid) {
            return;
        }
        //En caso que se haya levantado la ventana a través de un cmbselectfield
        if (grid.field) {
            grid.field.focus();
            grid.field.expand();
            grid.field.store.load();
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
        var grid = win.mainlist;

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
            case 'add':
                var field = btn.up('cmbselectfield');
                this.onAddnew(btn, field);
                break;
            case 'more':
                var field = btn.up('cmbselectfield');
                if(field.onMore && typeof field.onMore == 'function'){
                    field.onMore.call(this,field);
                }else{
                    this.onSelectField(field);
                }
                break;
        }
    },
    onSave: function (btn) {
        var window = btn.up('mainwindow'),
            form = window.down('form'),
            action = form.action !== 'edit' ? 'insertValues' : 'modifyValues',
            module = btn.up('mainwindow').module,
            concept = window.concept,
            gen = window.mainlist.gen,
            url = UtilsFn.buildUrl({action: action}, ModuleMgr.get(module)),
            msg = this.etiquetas.msgWait;

        Ext.MessageBox.show({
            title: this.etiquetas.lbTitleWait,
            msg: msg.getSingular(gen).get(concept),
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        form.submit({
            url: url,
            scope: this,
            params: {
                responseCfg: {
                    action: form.action,
                    gen: gen,
                    concept: concept,
                    count: 1
                }
            },
            success: function (form, action) {
                /*
                 * En caso que se haya levantado la ventana a partir
                 * de un grid y no de un cmbselectfield
                 */
                if (window.mainlist.store) {
                    window.mainlist.store.load();
                }
                if (btn.action == 'acept') {
                    window.destroy();
                } else {
                    form.reset();
                    this.firstField.focus();
                }
            },
            failure: function (form, action) {
                if (Ext.MessageBox.isVisible()) {
                    Ext.MessageBox.hide();
                }
            }
        });
    },
    onSelectField: function (field) {
        field.form = field.up('customform');
        this.application.getSelectWindowController().showWindow(field);
    },
    onSelectCmbSelectField: function (field, records) {

        var form = field.up('form'),
            idproperty = field.store.getProxy().reader.idProperty,
            hiddenField = form.getForm().findField(field.localId);
        console.log('combo:', field.localId, hiddenField)
        if (hiddenField && records) {
            // hiddenField.multiSelect = field.multiSelect;
            if(field.multiSelect){
                var valores='';
                records.forEach(function(x){
                    valores+=x.get(idproperty)+',';
                })
                hiddenField.setValue(valores.substr(0, valores.length - 1));
            }else{
                hiddenField.setValue(records[0].data[idproperty]);
            }
        }
        field.fireEvent('addselected', false, false, field, records);
    },
    onBlurCmbSelectField: function (field) {
        var localid = field.localId,
            form = field.up('form').getForm();

        if (localid) {
            var hdfield = form.findField(localid);

            if (!hdfield) {
                return;
            }

            if (!hdfield.getValue()) {
                if (!field.allowBlank) {
                    field.setValue('');
                    field.setRawValue('');
                    field.markInvalid(field.blankText);
                }
            } else {
                if (field.getValue() || !field.allowBlank) {
                    field.setValue(field.trueValue);
                    field.setRawValue(field.trueValue);
                }
            }
        }
    },
    onResetCmbSelect: function (field) {
        var localid = field.localId,
            form = field.up('form').getForm();

        if (localid) {
            var hdfield = form.findField(localid);

            if (!hdfield) {
                return;
            }

            hdfield.setValue('');
        }
        field.trueValue = '';
    },
    onClearField: function (field) {
        var form = field.up('form').getForm(),
            fieldIds = form.findField(field.localId);
        fieldIds.setValue('');
    },
    onAddnew: function (btn, field) {
        console.log('onaddnew')
        var module = field.module || 'Nomencladores',
            modelName = field.modelName,
            etiquetas = LangMgr.getLang(module) || this.etiquetas,
            concept = (etiquetas['text' + modelName] || 'element').toLowerCase();

        Ext.MessageBox.show({
            title: etiquetas.lbTitleWait,
            msg: etiquetas.msgLoadingForm,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        Ext.Ajax.request({
            scope: this,
            params: {
                modelName: modelName,
                noData: 1
            },
            url: UtilsFn.buildUrl({action: 'getModel'}, ModuleMgr.get(module)),
            success: function (response, options) {
                var response = Ext.decode(response.responseText),
                    conf = response.metaData.entity_conf;
                btn.action = 'add';
                btn.modelName = modelName;
                console.log('Columnas getModel:', response.metaData.columns)
                //propiedad mainlist simulando un centergrid real
                btn.mainlist = {
                    module: module,
                    concept: concept,
                    gen: conf.gen,
                    refhelp: conf.refhelp,
                    formConfiguration: response.metaData.columns,
                    contHidden: 0,
                    field: field,
                    etiquetas: etiquetas,
                    defaultValues: field.defaultValues
                };
                this.showWindow(btn);
                Ext.MessageBox.hide();
            }
        });
    },
    showWindow: function (cmp) {
        var grid = cmp.mainlist || cmp.up('centergrid');
        this.etiquetas = grid.etiquetas || this.etiquetas;
        var form = this.createForm(cmp),
            config = {
                action: cmp.action,
                mainlist: grid,
                module: grid.module,
                concept: grid.concept,
                etiquetas: grid.etiquetas,
                btnApply: cmp.btnApply,
                refhelp: cmp.action + '_' + grid.refhelp
            };
        console.log(grid.module)
        try {
            var win=Ext.create(grid.module + '.view.MainWindow', config);
            win.show(null, function () {
                if (this.autoCreateForm) {
                    this.add(form);
                }
                this.center();
                if(win.getHeight()>window.innerHeight)
                    win.setHeight(window.innerHeight);
            });
        } catch (e) {
            var win=Ext.create('BaseModule.view.MainWindow', config);
            win.show(null, function () {
                this.add(form);
                this.center();
                if(win.getHeight()>window.innerHeight)
                    win.setHeight(window.innerHeight);
            });
        }
    },
    onBeforeSubmit: function (form, action, options) {
        var items = form.getFields().items;
        for (k in items) {
            var value = items[k].getValue();
            items[k].enable();
            if (Ext.isString(value) && !Ext.isEmpty(value) && value.indexOf('[{\"') == -1) {
                value = value.replace(/^((<br>)|(\s<br>)|(&nbsp;))*|((<br>)|(\s<br>)|(&nbsp;))*$/g, '');
                items[k].setValue(value.trim());
            }
        }
    },
    createForm: function (cmp) {
        var grid = cmp.mainlist || cmp.up('centergrid'),
            configuration = grid.formConfiguration,//arreglo con las configuraciones.
            cant = configuration.length,//cantidad de elementos.
            noVisible = grid.contHidden,//cantidad de elementos ocultos.
            form = Ext.create('Ext.ux.CustomForm', {
                autoScroll:true,
                action: cmp.action,
                modelName: cmp.modelName
            }),
            _this = this;//contexto de la controladora.
        Ext.each(configuration, function (field) {
            var xtype = '', //xtype de los elementos.
                inColumn = true;//si el elemento se adiciona en una columna
// console.log('form.registertypes:', form.registertypes)
            //verificar si el xtype esta registrado en el classmanager
            if (field.xtype && field.xtype != 'datecolumn' && (form.registerxtypes.indexOf(field.xtype) != -1 || Ext.ClassManager.getNameByAlias('widget.' + field.xtype))) {
                xtype = field.xtype;
                field.hidden = false;
            } else if (field.descr) {
                xtype = 'textarea';
                field.hidden = false;
            } else if (field.localId && _this.getLocalid(configuration, field.localId)) {
                xtype = 'cmbselectfield';
                field.hidden = false;
            } else if (field.localIdMulti && _this.getLocalid(configuration, field.localIdMulti)) {
                xtype = 'cmbselectfield';
                field.hidden = false;
                field.multiSelect = true;
            }else if (field.identifier || field.hidden) {
                xtype = 'hiddenfield';
            } else if (form.registertypes[field.dataType]) {
                xtype = form.registertypes[field.dataType];
                field.hidden = false;
            }
            if (xtype) {
                if (field.inColumn === false
                    || ((form.notColumnXtypes.indexOf(field.xtype) != -1 || field.descr) && Ext.isEmpty(field.inColumn))
                    || cant - noVisible == 1
                ) {
                    inColumn = false;
                }
                var label = field.header || field.text,
                    label = _this.etiquetas[label] || label,
                    item = {
                        fieldLabel: label,
                        xtype: xtype,
                        allowBlank: !field.noNull,
                        maxLength: field.length,
                        anchor: '99%',
                        name: field.dataIndex,
                        inColumn: inColumn,
                        enableKeyEvents: true,
                        modelName: form.modelName
                    };

                if (field.dataType == 'boolean') {
                    //item.labelAlign = 'left';
                    item.style = 'margin: 0px 0px 10px 5px';
                    item.labelStyle = 'margin-bottom: 5px;';
                }

                item = _this.mergeObjects(field, item);

                if (xtype != 'hiddenfield' && xtype != 'hidden' && !form.firstField) {
                    item.first = true;
                    form.firstField = true;
                }

                form.addItem(form.createCmp(item));

            }
        });
        console.log('FORM', form)
        return form;
    },
    getLocalid: function (configurations, localid) {
        var filter = Ext.Array.filter(configurations, function (item) {
            if (item['dataIndex'] == localid) {
                return true;
            }
        });
        return filter.length != 0 ? true : false;
    },
    mergeObjects: function (obj1, obj2) {
        for (key in obj2) {
            obj1[key] = obj2[key];
        }
        return obj1;
    },
    checkWindow: function (form) {
        if (this.activeWindows != 0) {
            var bForm = form.getForm(),
                window = form.up('mainwindow'),
                invalid = bForm.hasInvalidField(),
                change = bForm.isDirty();

            if (form.action == 'edit') {
                invalid = invalid || !change;
            }
            window.disableButtons(invalid);
        } else {
            return false;
        }
    },
    applyDefaultsValues: function (form, grid) {
        var values = grid.defaultValues;
        if (values) {
            if (!Ext.isArray(values)) {
                values = [values];
            }
            for (k in values) {
                var field = form.findField(values[k]['field']);
                field.setValue(values[k]['value']);
                field.setDisabled(values[k]['disabled']);
            }
        }
    },
    addToKeyMap: function (win) {
        var tools = Ext.ComponentQuery.query('window[id=' + win.id + '] tool[keyMap]');

        if (!win.keyMap) {
            win.keyMap = new Ext.util.KeyMap({
                target: Ext.getBody()
            });
        }

        for (k in tools) {
            var component = tools[k];
            if (component.keyMap) {

                if (win && win.keyMap) {
                    var keymap = component.keyMap;
                    if (!Ext.isArray(keymap)) {
                        keymap = [keymap];
                    }
                    for (k in keymap) {
                        var binding = keymap[k];

                        binding.fn = function (component) {
                            Ext.EventObject.preventDefault();
                            component.fireEvent(this.event, component);
                        }.bind(binding, component);

                        win.keyMap.addBinding(binding);
                    }
                }
            }
        }
    },
    setFocus: function (window) {
        window.focusbtn = Ext.ComponentQuery.query('window[id=' + window.id + '] toolbar[dock=bottom] button[activeUI=default-small]');
        window.firstfocus = Ext.ComponentQuery.query('window[id=' + window.id + '] [first]');

        Ext.EventManager.on(window.el, 'keydown', function (e) {
            if (e.getKey() == Ext.EventObject.TAB || e.getKey() == 9) {
                var target = e.getTarget(),
                    btncancelar = window.focusbtn[0],
                    btnsiguiente = window.focusbtn[1],
                    btnultimo = window.focusbtn[window.focusbtn.length - 1],
                    firstfield = window.firstfocus[window.firstfocus.length - 1];
                while (target && target.nodeType === 1 && target !== document.body) {
                    var cmp = Ext.getCmp(target.id);
                    if (cmp) {
                        if (firstfield && btncancelar == cmp && btnsiguiente.disabled && e.shiftKey != true) {
                            e.preventDefault();
                            firstfield.focus(true);
                        }
                        if (firstfield == cmp && btnultimo.disabled && e.shiftKey == true) {
                            e.preventDefault();
                            btncancelar.focus(true);
                        }
                        break;
                    }
                    target = target.parentNode;
                }
            }
        }, window);
    }
});
