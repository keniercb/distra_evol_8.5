Ext.define('PerfilesClientes.controller.WindowPerfil', {
    extend: 'Ext.app.Controller',

    refs: [
        {ref: 'PanelDataView', selector: 'PanelDataView'},
        {ref: 'DataViewPerfil', selector: 'DataViewPerfil'},
        {ref: 'WindowPerfil', selector: 'WindowPerfil'}
    ],

    init: function () {
        var me = this;
        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {
                'WindowPerfil': {
                    show: this.winShow,
                    hide: this.hideWin
                },
                'WindowPerfil cmbselectfield': {
                    change: this.changeValueSelect
                },
                'WindowPerfil button[action]': {
                    click: this.actionButton
                },
                'WindowPerfil checkboxfield[action]': {
                    change: this.actionCheckBox
                }
            }
        });
        me.chargeAlways = true;
    },

    winShow: function (win, eOpts) {
        var form = win.down('customform');
        this.activeWindows = true;
        Ext.TaskManager.start({
            run: this.checkWindow.bind(this, form, win),
            interval: 100,
            scope: this
        });
    },

    hideWin: function (win, eOpts) {
        this.activeWindows = false;
    },

    checkWindow: function (form, win) {
        if (this.activeWindows) {//console.log(win.formDynamic)
            var bForm = form.getForm(),
                invalid = bForm.hasInvalidField(),
                change = bForm.isDirty();
            if (win.action == 'edit') {
                invalid = invalid || !change;
            }
            win.disableButtons(invalid);
        } else {
            return false;
        }
    },

    actionCheckBox: function (cmp) {
        console.log('checkbox', cmp.up().up().up())
        var me = this,
            winperfil = me.getWindowPerfil(),
            cmpCuestionario = cmp.up().up().up();
        if (cmp.action == 'editcuestionario') {
            items = cmpCuestionario.myPanel.items.items;
            if (cmp.getValue()) {
                cmpCuestionario.checkBoxGuardarCuestionarioComo.setDisabled(false);
                cmpCuestionario.btnAddPregunta.setDisabled(false);
                cmpCuestionario.newNameCuestionario.setDisabled(!cmpCuestionario.checkBoxGuardarCuestionarioComo.getValue());
                for (var i in items) {
                    items[i].cmbPregunta.setDisabled(false);
                    items[i].btnDelPregunta.setDisabled(false);
                    items[i].cmbRespuesta.setDisabled(!items[i].cmbPregunta.getValue());
                }
            } else {
                me.recargarCuestionario(winperfil, cmpCuestionario.legend.items.items[2].items.items[1], cmpCuestionario);
                cmpCuestionario.checkBoxGuardarCuestionarioComo.setDisabled(true);
                cmpCuestionario.btnAddPregunta.setDisabled(true);
                cmpCuestionario.newNameCuestionario.setDisabled(true);
                console.log('winperfil.cmpCuestionario', cmpCuestionario.legend.items.items[2].items.items[1])
            }
        } else if (cmp.action == 'guardarcuestionariocomo') {
            if (cmp.getValue()) {
                cmpCuestionario.newNameCuestionario.allowBlank = false;
                cmpCuestionario.newNameCuestionario.setDisabled(false);
                console.log(cmpCuestionario.newNameCuestionario)
            } else {
                cmpCuestionario.newNameCuestionario.allowBlank = true;
                cmpCuestionario.newNameCuestionario.setDisabled(true);
            }
        }
    },

    changeValueSelect: function (cmbSelectField, newValue, oldValue, eOpts) {
        //console.log('change cmbselectfield', this.getDataViewPerfil().getStore(), cmbSelectField, newValue, oldValue, eOpts)
        if (cmbSelectField.valueModels && newValue && (newValue != oldValue)) {
            var me = this,
                winperfil = me.getWindowPerfil();
            me.getWindowPerfil().disableButtons(false);
            switch (cmbSelectField.context) {
                case 'perfilesclientesmainwindowclienteproveedor':
                {
                    winperfil.myDataView.getStore().loadRawData(cmbSelectField.displayTplData);
                    winperfil.comboFieldSetCliente.expand(!cmbSelectField.getValue());
                    break;
                }
                case 'perfilesclientesmainwindowcuestionario':
                {
                    console.log(cmbSelectField.up().up().up())
                    cmbSelectField.up().up().up().myPanel.setDisabled(false);
                    console.log(me.chargeAlways)
                    if (me.chargeAlways) {
                        me.recargarCuestionario(winperfil, cmbSelectField, cmbSelectField.up().up().up());
                    }
                    break;
                }
                case 'perfilesclientesmainwindowpregunta':
                {
                    var panel = cmbSelectField.up('panel');
                    panel.cmbRespuesta.filters = {idtiporespuesta: parseInt(cmbSelectField.valueModels[0].data.idtiporespuesta)};
                    panel.cmbRespuesta.setDisabled(false);
                    panel.cmbRespuesta.getStore().load();
                    break;
                }
            }
        }
    },

    destroyPreguntas: function (cmpCuestionario) {
        if (cmpCuestionario.myPanel.items && cmpCuestionario.myPanel.items.items.length > 0) {
            var f;
            while (f = cmpCuestionario.myPanel.items.first()) {
                f.destroy();
            }
            cmpCuestionario.checkBoxEditCuestionario.setValue(false);
        }
    },

    recargarCuestionario: function (winperfil, cmbSelectField, cmpCuestionario) {
        var me = this;
        me.destroyPreguntas(cmpCuestionario);
        var mask = new Ext.LoadMask(winperfil.el, {
            msg: me.etiquetas.msgLoading
        });
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'cargarpreguntas'}, me),
            params: {idcuestionario: cmbSelectField.valueModels[0].data.idcuestionario},
            success: function (response, opts) {
                var result = Ext.decode(response.responseText);
                me.makePreguntaRespuesta(cmpCuestionario, result, false);
                mask.hide();
            },
            failure: function (response, opts) {
                mask.hide();
            }
        });
    },

    makePreguntaRespuesta: function (cmpCuestionario, result, respuesta, lastItem) {
        //console.log(cmpCuestionario, result, respuesta, lastItem)
        for (var i in result) {
            var itemPanelPregunta = Ext.create('PerfilesClientes.view.PreguntaRespuesta', {index: cmpCuestionario.index + cmpCuestionario.myPanel.items.items.length});
            itemPanelPregunta.cmbPregunta.getStore().load();
            itemPanelPregunta.cmbPregunta.setValue(result[i].pregunta);
            itemPanelPregunta.cmbPregunta.setRawValue(result[i].pregunta);
            itemPanelPregunta.cmbPregunta.setDisabled(true);
            itemPanelPregunta.cmbPregunta['valueModels'] = [{'data': result[i]}];
            //itemPanelPregunta.cmbPregunta.transformOriginalValue(result[i].pregunta);
            itemPanelPregunta.hfpregunta.setValue(result[i].idpregunta);
            //itemPanelPregunta.hfpregunta.transformOriginalValue(result[i].idpregunta);
            itemPanelPregunta.cmbRespuesta.filters = {idtiporespuesta: parseInt(result[i].idtiporespuesta)};
            if (respuesta) {
                itemPanelPregunta.cmbRespuesta.getStore().load();
                itemPanelPregunta.hfrespuesta.setValue(result[i].idrespuesta);
                //itemPanelPregunta.hfrespuesta.transformOriginalValue(result[i].idrespuesta);
                itemPanelPregunta.cmbRespuesta.setValue(result[i].respuesta);
                itemPanelPregunta.cmbRespuesta.setRawValue(result[i].respuesta);
                itemPanelPregunta.cmbRespuesta.valueModels = [{'data': result[i]}];
                //itemPanelPregunta.cmbRespuesta.transformOriginalValue(result[i].respuesta);
            }
            cmpCuestionario.myPanel.add(itemPanelPregunta);
        }
        if (cmpCuestionario.myPanel.items && cmpCuestionario.myPanel.items.length == 0) {
            var firstitem = Ext.create('PerfilesClientes.view.PreguntaRespuesta', {index: cmpCuestionario.index + cmpCuestionario.myPanel.items.items.length});
            firstitem.cmbRespuesta.setDisabled(true);
            cmpCuestionario.checkBoxEditCuestionario.setValue(true);
            firstitem.btnDelPregunta.setDisabled(!cmpCuestionario.checkBoxEditCuestionario.getValue());
            cmpCuestionario.myPanel.add(firstitem);
        }
        cmpCuestionario.expand();
        if (lastItem) {
            var me = this;
            Ext.TaskManager.start({
                run: function () {
                    if (!Ext.Ajax.isLoading()) {
                       /* me.getWindowPerfil().customForm.getForm().getFields().findBy(function (f) {
                            f.initValue();
                        });*/
                        me.getWindowPerfil().customForm.getForm().setValues(me.getWindowPerfil().customForm.getForm().getValues());
                        me.chargeAlways = true;
                        return false;
                    }
                },
                interval: 100,
                scope: this
            });
            /*setTimeout(function () {
                me.getWindowPerfil().customForm.getForm().getFields().findBy(function(f) {
                    f.initValue();
                });
            }, 50);*/
        }
    },

    actionButton: function (cmp) {
        console.log(cmp.up().up().up())
        var me = this,
            winperfil = me.getWindowPerfil();
        switch (cmp.action) {
            case 'addPregunta':
            {
                var itemPanelPregunta = Ext.create('PerfilesClientes.view.PreguntaRespuesta', {index: cmp.up().up().up().index + cmp.up().up().up().myPanel.items.items.length});
                itemPanelPregunta.cmbRespuesta.setDisabled(true);
                itemPanelPregunta.btnDelPregunta.setDisabled(!cmp.up().up().up().checkBoxEditCuestionario.getValue());
                cmp.up().up().up().myPanel.add(itemPanelPregunta);
                break;
            }
            case 'btnDelPregunta':
            {
                mostrarMensaje(2, me.etiquetas.msgDelPregunta, function (response) {
                    if (response === 'ok') {
                        cmp.up('panel').destroy();
                    }
                });
                break;
            }
            case 'addCuestionario':
            {
                me.addCuestionario();
                break;
            }
            case 'delCuestionario':
            {
                mostrarMensaje(2, me.etiquetas.msgDelCuestionario, function (response) {
                    if (response === 'ok') {
                        cmp.up().up().up().destroy();
                    }
                });
                break;
            }
            case 'acept':
            {
                me.saveData(cmp.action, winperfil);
                break;
            }
            case 'apply':
            {
                me.saveData(cmp.action, winperfil);
                break;
            }
        }
    },

    addCuestionario: function () {
        this.getWindowPerfil().customForm.add(Ext.create('PerfilesClientes.view.Cuestionario',{index: this.getWindowPerfil().customForm.items.items.length}));
    },

    saveData: function (action, winperfil) {
        var me = this,
            arrayCuestionario = new Array(),
            itemsForm = winperfil.customForm.items.items,
            lenForm = itemsForm.length;
        for (var j = 1; j < lenForm; j++) {
            var items = itemsForm[j].myPanel.items.items,
                preguntaRespuesta = new Array();
            for (var i in items) {
                preguntaRespuesta.push({
                    'idpregunta': parseInt(items[i].cmbPregunta.valueModels[0].data.idpregunta),
                    'idrespuesta': parseInt(items[i].cmbRespuesta.valueModels[0].data.idrespuesta)
                });
            }console.log(itemsForm[j].cmbCuestionario)
            arrayCuestionario.push({
                'idcuestionario': parseInt(itemsForm[j].cmbCuestionario.valueModels[0].data.idcuestionario),
                'cuestionario': itemsForm[j].cmbCuestionario.getValue(),
                'editarcuestionario': itemsForm[j].checkBoxEditCuestionario.getValue(),
                'guardarcuestionariocomo': itemsForm[j].checkBoxGuardarCuestionarioComo.getValue(),
                'newcuestionario': itemsForm[j].newNameCuestionario.getValue(),
                'preguntaRespuesta': preguntaRespuesta
            });
        }
        if (winperfil.action == 'add') {
            winperfil.customForm.submit({
                url: UtilsFn.buildUrl({action: 'addperfil'}, me),
                params: {
                    arrayCuestionario: Ext.encode(arrayCuestionario)
                },
                submitEmptyText: false,
                waitMsg: me.etiquetas.lbGuardando,
                success: function (form, actionback) {
                    me.getDataViewPerfil().getStore().load();
                    if (action == 'acept') {
                        winperfil.destroy();
                    } else {
                        //me.destroyPreguntas(winperfil);
                        winperfil.customForm.getForm().reset();
                        winperfil.comboFieldSetCliente.collapse();
                        winperfil.cmpCuestionario.collapse();
                        //winperfil.cmbCliente.reset();
                        //winperfil.cmpCuestionario.cmbCuestionario.reset();
                        //winperfil.myDataView.getStore().loadRawData(null);
                        //winperfil.cmpCuestionario.myPanel.setDisabled(true);
                    }
                }
            });
        } else if (winperfil.action == 'edit') {
            winperfil.customForm.submit({
                url: UtilsFn.buildUrl({action: 'modperfil'}, me),
                params: {
                    arrayCuestionario: Ext.encode(arrayCuestionario)
                },
                submitEmptyText: false,
                waitMsg: me.etiquetas.lbGuardando,
                success: function (form, actionback) {
                    me.getDataViewPerfil().getStore().load();
                    winperfil.destroy();
                }
            });
        }
    }

})
;