Ext.define('Facturacion.controller.MainWindow', {
    extend: 'Ext.app.Controller',

    refs: [{ref: 'mainWindow', selector: 'fac_mainwindow'},
        {ref: 'hitoGrid', selector: 'fac_hitogrid'}],

    init: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            store: {},
            component: {
                'fac_datewindow': {
                    show: this.onShow,
                    close: function () {
                        this.showedWindow = false;
                    }
                },
                'fac_areawindow': {
                    show: me.onShowAreaWindow
                },
                'fac_areawindow combobox[localId], fac_areawindow pickerfield[localId]': {
                    select: me.onSelectCombo
                },
                'fac_datewindow button[action],fac_documentwindow button[action], fac_areawindow button[action]': {
                    click: this.onClickAction
                }
            }
        });
    },

    onShow: function (window) {
        this.showedWindow = true;
        Ext.TaskManager.start({
            run: this.checkWindow.bind(this, window),
            interval: 100,
            scope: this
        });
        if (window.record) {
            var record = window.record;
            window.form.getForm().loadRecord(record);
            window.fechaestimada.setMinValue(record.get('fechafirma'));
        }
    },
    onShowAreaWindow: function(win){
        win.down('form').on('validitychange', function (yo, valid) {
            win.btnAcept.setDisabled(!valid);
        });
    },
    onSelectCombo: function (combo, records) {
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);
        if (hiddenField) {
            hiddenField.setValue(records[0].data[combo.localId]);
        }
    },
    onClickAction: function (btn) {
        var me = this,
            datewindow = btn.up('fac_datewindow'),
            documentwindow = btn.up('fac_documentwindow'),
            areawindow = btn.up('fac_areawindow');
        switch (btn.action) {
            case 'acept':
                if (datewindow) {
                    me.editDate(btn);
                }
                if (documentwindow) {
                    me.saveDocumentState(btn);
                }
                if (areawindow) {
                    me.editArea(btn);
                }
                break;
        }
    },

    editDate: function (btn) {
        var me = this,
            window = btn.up('window'),
            form = window.down('form'),
            grid = me.getHitoGrid();
        form.getForm().submit({
            url: UtilsFn.buildUrl({action: 'modificarFechaEstimada'}, ModuleMgr.get('Facturacion')),
            submitEmptyText: false,
            waitMsg: me.etiquetas.lbGuardando,
            success: function (form, action) {
                var response = Ext.decode(action.response.responseText);
                if (response.code == 1) {
                    mostrarMensaje(1, me.etiquetas.msgFechaModificada);
                }
                grid.getStore().load();
                window.close();
            }
        });
    },

    checkWindow: function (window) {
        if (!this.showedWindow) {
            return false;
        }
        var form = window.form.getForm(),
            btn = window.btnAcept;
        if (form.isValid() && form.isDirty()) {
            btn.enable();
        } else {
            btn.disable();
        }
    },

    saveDocumentState: function (cmp) {
        console.log('saveDocumentState')
        var me = this,
            window = cmp.up('window'),
            form = window.form,
            grid = me.getHitoGrid(),
            record = grid.getSelectionModel().getSelection()[0],
            idhitos = this.getHitosSeleccionados(),
            params = {
                idcontrato: record.data.idcontrato,
                idhitos: Ext.encode(idhitos),
                idestado: window.cmp.idestado,
                responseCfg: {
                    action: 'edit',
                    gen: 'm',
                    concept: me.etiquetas.lbEstado,
                    count: 1
                }
            };

        if (form && form.isValid()) {

            Ext.MessageBox.show({
                msg: me.etiquetas.lbGuardando,
                width: 300,
                wait: true,
                waitConfig: {interval: 200}
            });

            form.submit({
                url: UtilsFn.buildUrl({action: 'cambiarEstado'}, me),
                params: params,
                success: function (form, action) {
                    Ext.MessageBox.hide();

                    window.close();

                    var info = Ext.decode(action.response.responseText);
                    if (info.success) {
                        mostrarMensaje(1, info.datos.nuevoestado ? 'La obligación financiera ha cambiado de estado satisfactoriamente.' :
                            'Usted ha hecho su voto al cambio de estado. <br>Se han realizado ' +
                            info.datos.obligatoriosefectuados + ' de ' + info.datos.cantidadrolesobligatorios + ' votos obligatorios.');
                        if (info.datos.nuevoestado) {
                            grid.getStore().load();
                            if (window.cmp.notificar == 1) {
                                me.enviarCorreo({
                                    idhitos: Ext.encode(idhitos),
                                    idestado: window.cmp.idestado,
                                    idtransicion: window.cmp.idtransicion,
                                    modelName: 'GestionfacturasModel'
                                });
                            }
                        }
                    }
                },
                failure: function () {
                    Ext.MessageBox.hide();
                }
            });
        }


    },

    getHitosSeleccionados: function () {
        var grid = this.getHitoGrid(),
            records = grid.getSelectionModel().getSelection(),
            idhitos = [];
        Ext.each(records, function (record) {
            idhitos.push(record.data.idhito);
        });
        return idhitos;
    },
    editArea: function(btn){
        var me=this,
            win = btn.up('window'),
            form = win.down('form'),
            grid = me.getHitoGrid();
        Ext.MessageBox.show({
            msg: me.etiquetas.lbGuardando,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        form.submit({
            url: UtilsFn.buildUrl({action: 'modificarArea'}, me),
            success: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);
                if (response.code == 1) {
                    mostrarMensaje(1, (grid.getSelectionModel().getSelection().length==1?
                        me.etiquetas.msgFechaModificada:me.etiquetas.msgFechaModificadas));
                    win.close();
                    grid.getStore().load();
                }
            },
            failure: function () {
                Ext.MessageBox.hide();
            }
        });
    }


});
