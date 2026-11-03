Ext.define('PerfilesClientes.controller.Main', {
    extend: 'Ext.app.Controller',
    //views: ['Main'],

    refs: [
        {ref: 'PanelDataView', selector: 'PanelDataView'},
        {ref: 'DataViewPerfil', selector: 'DataViewPerfil'}
    ],

    init: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);

        this.listen({
            component: {
                'PanelDataView DataViewPerfil': {
                    //itemclick: this.itemClickDataView,
                    select: this.controlButton,
                    deselect: this.controlButton
                },
                'PanelDataView button[action]': {
                    click: this.actionButton
                }
            }
        });
    },

    controlButton: function (dataview, record, eOpts) {
        this.enableAccion(this.getPanelDataView().myDataView.getSelectionModel().getSelection().length);
    },

    enableAccion: function (selection) {
        this.getPanelDataView().btnMod.setDisabled(!(selection == 1));
        this.getPanelDataView().btnDel.setDisabled(!(selection > 0));

    },

    itemClickDataView: function (medataview, record, item, index, e, eOpts) {
        console.log(medataview, record, item, index, e, eOpts)

    },

    actionButton: function (cmp) {//console.log(cmp, this.getPanelDataView().myDataView.getSelectionModel().getLastSelected().data)
        var me = this;

        switch (cmp.action) {
            case 'add':
                me.winPerfilCliente(cmp);
                break;
            case 'edit':
                me.winPerfilCliente(cmp);
                break;
            case 'del':
                this.delPerfil();
                break;
        }
    },

    winPerfilCliente: function (cmp) {
        var me = this,
            cfg = {
                action: cmp.action,
                concept: me.etiquetas.lbPerfil,
                dataview: cmp.action == 'add' ? null : null/*me.getPanelDataView().myDataView.getSelectionModel().getLastSelected().data*/
            }, win = Ext.create('PerfilesClientes.view.WindowPerfil', cfg);
        if (cmp.action == 'edit') {
            me.application.getWindowPerfilController().chargeAlways = false;
        }
        win.show(null, function () {
            if (cmp.action == 'add') {
                win.comboFieldSetCliente.collapse();
                win.cmpCuestionario.collapse();
            } else {
                var data = me.getPanelDataView().myDataView.getSelectionModel().getLastSelected().data;
                //console.log('data', data)
                win.cmbCliente.getStore().load(function (records, operation, success) {
                    win.hfclienteproveedor.setValue(data.idclientesproveedores);
                    win.hfclienteproveedor.resetOriginalValue();
                    for (var i in records) {
                        if (parseInt(records[i].data.idclientesproveedores) == parseInt(data.idclientesproveedores)) {
                            win.cmbCliente.select(records[i]);
                            win.cmbCliente.resetOriginalValue();
                            break;
                        }
                    }
                    /*win.cmbCliente.setValue(data.idclientesproveedores);
                     win.cmbCliente.setRawValue(data.nombre);*/
                });
                var lenCuestionario = data.cuestionario.length;
                while (lenCuestionario-- > 1) {
                    me.application.getWindowPerfilController().addCuestionario();
                }
                var itemsForm = win.customForm.items.items,
                    lenForm = itemsForm.length;
                for (var j = 1, i = 0; j < lenForm; j++, i++) {
                    itemsForm[j].cmbCuestionario.getStore().load();
                    itemsForm[j].cmbCuestionario.setValue(data.cuestionario[i].nombre);
                    itemsForm[j].cmbCuestionario.setRawValue(data.cuestionario[i].nombre);
                    //itemsForm[j].cmbCuestionario.transformOriginalValue(data.cuestionario[i].nombre);
                    itemsForm[j].cmbCuestionario.valueModels = [{'data': data.cuestionario[i]}];
                    itemsForm[j].myPanel.setDisabled(false);
                    me.application.getWindowPerfilController().makePreguntaRespuesta(itemsForm[j], data.cuestionario[i].preguntarespuesta, true, j == lenForm-1);
                }
                /*win.cmpCuestionario.cmbCuestionario.getStore().load(function (records, operation, success) {
                    //win.cmpCuestionario.cmbCuestionario.select(data.cuestionario[0]);
                    win.cmpCuestionario.cmbCuestionario.setValue(data.cuestionario[0].nombre);
                    win.cmpCuestionario.cmbCuestionario.setRawValue(data.cuestionario[0].nombre);
                    win.cmpCuestionario.cmbCuestionario.valueModels = [{'data': data.cuestionario[0]}];
                    win.cmpCuestionario.cmbCuestionario.resetOriginalValue();
                    win.cmpCuestionario.hfcuestionario.setValue(data.cuestionario[0].idcuestionario);
                    win.cmpCuestionario.hfcuestionario.resetOriginalValue();
                    me.application.getWindowPerfilController().makePreguntaRespuesta(win.cmpCuestionario, data.preguntarespuesta, true);
                });*/
                //me.application.getWindowPerfilController().chargeAlways = true;
            }
        });
    },

    delPerfil: function () {
        var me = this,
            selection = me.getPanelDataView().myDataView.getSelectionModel().getSelection(),
            arrayDel = new Array();
        if (selection.length > 0) {
            mostrarMensaje(2, me.etiquetas.msgEliminar + (selection.length > 1 ? me.etiquetas.msgPerfilP : me.etiquetas.msgPerfilS), function (response) {
                if (response === 'ok') {
                    for (var i in selection) {
                        arrayDel.push({idclienteproveedor: selection[i].data.idclientesproveedores})
                    }
                    Ext.MessageBox.show({
                        msg: (selection.length > 1 ? me.etiquetas.lbDelP : me.etiquetas.lbDelS),
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200}
                    });
                    Ext.Ajax.request({
                        url: UtilsFn.buildUrl({action: 'delperfil'}, me),
                        params: {arrayDel: arrayDel ? Ext.encode(arrayDel) : arrayDel},
                        success: function (response, opts) {
                            Ext.MessageBox.hide();
                            me.getPanelDataView().myDataView.getStore().load();
                        },
                        failure: function (response, opts) {
                            Ext.MessageBox.hide();
                        }
                    });
                }
            });
        }
    }

});