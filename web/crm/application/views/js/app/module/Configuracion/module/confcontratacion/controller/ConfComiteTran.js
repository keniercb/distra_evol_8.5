Ext.define('ConfContratacion.controller.ConfComiteTran', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'mainForm', selector: 'confcomitetran'},
        {ref: 'trasitionPanel', selector: 'trasitionpanel'},
        {ref: 'mainTree', selector: 'confwesterntree'},
    ],

    init: function () {
        var me = this;
        this.getLang();
        this.activeForm = 0;
        this.listen({
            store: {
                '#stConfTransitions': {
                    add: function (store, records) {
                        store.fireEvent('change', store, records, 'add');
                    },
                    remove: function (store, record) {
                        store.fireEvent('change', store, [record], 'remove');
                    },
                    change: this.onChangeTransition
                }
            },
            component: {
                'confcomitetran': {
                    render: this.loadConf,
                    show: this.startTask,
                    hide: function () {
                        this.activeForm--;
                    },
                    destroy: function () {
                        this.activeForm--;
                    }
                },
                'confcomitetran button[action]': {
                    click: this.onClickAction
                },
                'selectwindow[context=Comite]': {
                    addselected: this.onAddSelected
                },
                'trasitionpanel gridpanel[name=gpTransition],trasitionpanel gridrules': {
                    selectionchange: this.onSelectGrid
                }
            }
        });
    },

    onClickAction: function (btn) {
        if (!btn.action) {
            return;
        }
        switch (btn.action) {
            case 'addtransition':
                this.showSelectWindow(btn);
                break;
            case 'deltransition':
                this.delTransition();
                break;
            case 'addrule':
                this.showWindowRules(btn);
                break;
            case 'editrule':
                this.showWindowRules(btn);
                break;
            case 'delrule':
                this.delRules();
                break;
            case 'save':
                this.save();
                break;
            case 'cancel':
                this.cancel();
                break;
        }
    },

    onSelectGrid: function (sm, records) {
        var grid = sm.view.up('gridpanel');
        if (records.length > 1) {
            grid.btnDel.enable();
            if (grid.btnEdit) {
                grid.btnEdit.disable();
            }
        } else if (records.length == 1) {
            grid.btnDel.enable();
            if (grid.btnEdit) {
                grid.btnEdit.enable();
            }
        } else {
            grid.btnDel.disable();
            if (grid.btnEdit) {
                grid.btnEdit.disable();
            }
        }

        if (grid.name == 'gpTransition') {
            var gridRules = this.getTrasitionPanel().gpRules,
                stRules = gridRules.getStore();
            if (sm.getCount() == 1) {
                gridRules.enable();
                var reglas = records[0].data.reglas;
                if (!Ext.isArray(reglas)) {
                    reglas = Ext.decode(reglas);
                }
                stRules.loadData(reglas);
            } else {
                stRules.removeAll();
                gridRules.disable();
            }
        }
    },

    showSelectWindow: function (btn) {
        Ext.merge(btn, {
            mapping: 'NomTransicion.nombreestadoinicial',
            multiSelect: true,
            module: 'Nomencladores'
        });

        var win = Ext.create('BaseModule.view.SelectWindow', {
            field: btn,
            multiSelect: btn.multiSelect,
            modelName: 'NomTransicion',
            context: 'Comite',
            width: window.innerWidth*0.95,
            height: window.innerHeight*0.9
        }),
        grid = win.down('centergrid');

        win.show();

        grid.fireEvent('onadded', grid);

        //ModuleMgr.get('BaseModule').getSelectWindowController().showWindow(btn);
    },

    onAddSelected: function (window, grid, field, records) {
        var stTranstion = this.getTrasitionPanel().stTransition,
            stRol = this.getTrasitionPanel().stRol;

        Ext.each(records, function (record) {
            record.data.reglas = new Array();
            this.addTransition(record.data);
        }, this);
    },

    addTransition: function (transition) {
        var stTranstion = this.getTrasitionPanel().stTransition,
            stRol = this.getTrasitionPanel().stRol,
            id = transition.idtransicion,
            value = new Array();
        //console.log(transition);
        if (stTranstion.find('idtransicion', id) == -1) {
            if (!Ext.isArray(transition.reglas)) {
                transition.reglas = Ext.decode(transition.reglas);
            }
            stTranstion.add(transition);
            value.push(transition);
            if (Ext.isArray(transition.roles) && transition.roles.length != 0) {
                Ext.each(transition.roles, function (rol) {
                    var pos = stRol.findBy(function (record) {
                        if (record.data.idrol == rol.idrol && record.data.nombreproceso == transition.nombreproceso) {
                            return true;
                        }
                    });
                    if (pos == -1) {
                        rol['nombreproceso'] = transition.nombreproceso;
                        stRol.add(rol);
                    }
                }, this);
            }
        }
    },

    delTransition: function () {
        var grid = this.getTrasitionPanel().gpTransition,
            store = grid.getStore(),
            records = grid.getSelectionModel().getSelection(),
            msg = this.etiquetas.msgDelConfirm;

        if (records.length == 1) {
            msg = msg.getSingular('f').get(this.etiquetas.textNomTransicion.toLowerCase());
        } else {
            msg = msg.getPlural('f').get(this.etiquetas.textPlNomTransicion.toLowerCase());
        }

        Ext.Msg.grid = grid;
        Ext.Msg.show({
            title: this.etiquetas.titleConfirm,
            msg: msg,
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn === 'ok') {
                    store.remove(records);
                }
            }
        });
    },

    onChangeTransition: function (store, records, action) {
        var stRol = this.getTrasitionPanel().stRol,
            roles = stRol.getRange(),
            transitions = store.getRange();

        if (action == 'remove') {
            Ext.each(roles, function (rol) {
                var exist = false;
                Ext.each(transitions, function (transition) {
                    if (this.contains(transition.data.roles, rol.data)) {
                        exist = true;
                    }
                }, this);
                if (!exist) {
                    stRol.remove(rol);
                }
            }, this);
        }


    },
    //Determina si un arreglo contiene un objeto determinado
    contains: function (array, object) {
        var exist = false;
        Ext.each(array, function (item) {
            var cont = 0,
                equal = 0;
            for (k in item) {
                if (item[k] != object[k]) {
                    equal++;
                }
            }
            if (cont == equal) {
                exist = true;
            }
        });
        return exist;
    },

    loadConf: function (form) {
        var mask = new Ext.LoadMask(this.getMainForm().el, {msg: this.etiquetas.msgLoading});
        mask.show();
        this.getTrasitionPanel().storeComboComite.load({
            scope: this,
            callback: function () {
                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'loadConfComite'}, this),
                    scope: this,
                    callback: function (options, success, response) {
                        var response = Ext.decode(response.responseText);
                        if (response.transitions) {
                            this.getTrasitionPanel().stTransition.removeAll();
                            Ext.each(response.transitions, function (transition) {
                                this.addTransition(transition);
                            }, this);
                        }
                        this.getTrasitionPanel().stTransition.originalValue = this.getCurrentValue();
                        this.startTask(form);
                        mask.hide();
                    }
                });
            }
        });

    },

    save: function () {
        var msg = this.etiquetas.msgWait,
            gen = 'f',
            concept = 'configuraci&oacute;n',
            transitions = this.getTransitions();
        // console.log('Transitions', transitions)
        Ext.MessageBox.show({
            title: this.etiquetas.lbTitleWait,
            msg: msg.getSingular(gen).get(concept),
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'saveConfComite'}, this),
            params: {
                transitions: Ext.encode(transitions),
                responseCfg: {
                    action: 'save',
                    gen: gen,
                    concept: concept,
                    count: 1
                }
            },
            scope: this,
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                this.loadConf();
            }
        });
    },

    cancel: function () {
        this.loadConf();
    },

    getTransitions: function () {
        var store = this.getTrasitionPanel().gpTransition.getStore(),
            records = store.getRange(),
            transitions = new Array();
        // console.log('RECEIEI:', records)
        Ext.each(records, function (record) {
            var reglas = Ext.isArray(record.data.reglas) ? record.data.reglas : new Array();
            transitions.push({
                id: record.data.idtransicion,
                idcomite: record.data.idcomite,
                reglas: reglas
            });
        });
        return transitions;
    },

    showWindowRules: function (btn) {
        var action = 'add',
            gridtransition = this.getTrasitionPanel().gpTransition,
            transition = gridtransition.getSelectionModel().getSelection()[0];
        if (btn.action != 'addrule') {
            action = 'edit';
            var grid = btn.up('gridpanel'),
                store = grid.getStore(),
                smrecord = grid.getSelectionModel().getSelection()[0],
                index = store.findBy(function (strecord) {
                    if (strecord.id == smrecord.id) {
                        return true;
                    }
                }, this);
            smrecord.index = index;
        }

        Ext.create('ConfContratacion.view.WindowRule', {
            action: action,
            record: smrecord,
            transition: transition
        }).show();
    },

    delRules: function () {
        var transition = this.getTrasitionPanel().gpTransition.getSelectionModel().getSelection()[0],
            grid = this.getTrasitionPanel().gpRules,
            store = grid.getStore(),
            smrecords = grid.getSelectionModel().getSelection(),
            msg = this.etiquetas.msgDelConfirm;

        if (smrecords.length == 1) {
            msg = msg.getSingular('f').get('Regla');
        } else {
            msg = msg.getPlural('f').get('Reglas');
        }

        Ext.Msg.grid = grid;
        Ext.Msg.show({
            title: this.etiquetas.titleConfirm,
            msg: msg,
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn === 'ok') {
                    for (var i = smrecords.length - 1; i >= 0; i--) {
                        var index = store.findBy(function (strec) {
                            if (strec.id == smrecords[i].id) {
                                return true;
                            }
                        }, this);
                        if (index != -1) {
                            transition.data.reglas.splice(index, 1);
                        }
                    }
                    store.loadData(transition.data.reglas);
                }
            }
        });
    },

    startTask: function (form) {
        this.activeForm++;
        Ext.TaskManager.start({
            run: this.checkForm.bind(this, form),
            interval: 100,
            scope: this
        });
    },

    checkForm: function (form) {
        if (this.activeForm != 0) {
            var stTransition = form.transitionPanel.gpTransition.getStore(),
                currentValue = this.getCurrentValue();
            if (stTransition.originalValue != currentValue) {
                form.btnSave.enable();
            } else {
                form.btnSave.disable();
            }
        } else {
            return false;
        }
    },

    getCurrentValue: function () {
        var form = this.getMainForm(),
            stTransition = form.transitionPanel.gpTransition.getStore(),
            records = stTransition.getRange(),
            value = new Array();

        Ext.each(records, function (record) {
            value.push(record.data);
        });

        return Ext.encode(value);
    }
});