Ext.define('OfertaNegocio.controller.EditOferta', {
    extend: 'CRM.core.controller.Base',
    refs: [
        {ref: 'OfertaNegocio', selector: 'gpofertanegocio'},
        {ref: 'WinEditOferta', selector: 'wineditoferta'},
        {ref: 'WindowOfertaNegocio', selector: 'windowofertanegocio'},
        {ref: 'DocumentosAdicionales', selector: 'fpofertadocadicionales'},
        {ref: 'hitoPago', selector: 'GridHitoPago'},
        {ref: 'producto', selector: 'gridproducto'}
    ],
    init: function () {
        var me = this;

        me.getLang();

        me.listen({
            store: {
                '#hitoStoreOferta': {
                    loaddata: this.setOriginalValue,
                    addall: function (store) {
                        this.calcTotal(store)
                    },
                    add: function (store, record) {
                        record[0].dirty = true;
                    },
                    remove: function (store, record) {
                        this.onRemove(store, record)
                    },
                    removeall: function (store) {
                        this.calcTotal(store)
                    },
                    update: function (store) {
                        this.calcTotal(store)
                    }
                },
                '#indicadorStoreOferta': {
                    loaddata: this.setOriginalValue,
                    addall: function (store) {
                        this.calcTotal(store)
                    },
                    add: function (store, record) {
                        record[0].dirty = true;
                    },
                    remove: function (store, record) {
                        this.onRemove(store, record)
                    },
                    removeall: function (store) {
                        this.calcTotal(store)
                    },
                    update: function (store) {
                        this.calcTotal(store)
                    }
                },
            },
            component: {
                "windowofertanegocio": {
                    show: this.winShow
                },
                "wineditoferta button[action=cerrar]": {
                    click: this.closeWinEditOferta
                },
                "windowofertanegocio button[action=acept]": {
                    click: this.saveOferta
                },
                "windowofertanegocio button[action=apply]": {
                    click: this.saveOferta
                },
                "wineditoferta fileuploadfield": {
                    change: this.changeFileUploadDocumento,
                    reset: this.resetFileUploadDocumento
                },
                "wineditoferta button[action=showfile]": {
                    click: this.showDocumento
                },
                "wineditoferta button[action=delfile]": {
                    click: this.deleteDocumento
                },
                'wineditoferta combobox[localId],wineditoferta pickerfield[localId]': {
                    select: this.selectCombo,
                    change: this.changeCombo
                }

            }
        });
    },
    winShow: function (win, eOpts) {
        Ext.TaskManager.start({
            run: this.checkWindow.bind(this, win),
            interval: 100,
            scope: this
        });
    },
    checkWindow: function (win) {
        var self = this,
            dataform = win.customForm,
            pagoForm = win.formaPago,
            docForm = win.docForm,
            invaliddataform = dataform.hasInvalidField(),
            invalidpagoForm = pagoForm.hasInvalidField(),
            invaliddocForm = docForm.hasInvalidField(),
            invalidWindow = invaliddataform || invalidpagoForm || invaliddocForm,
            dirtydataform = dataform.isDirty(),
            dirtypagoform = pagoForm.isDirty(),
            dirtydocform = docForm.isDirty(),
            dirtyWindow = dirtydataform || dirtypagoform || dirtydocform;
        if (win.action == 'add') {
            if (win.btnAplicar) win.btnAplicar.setDisabled(invalidWindow);
            if (win.btnAceptar) win.btnAceptar.setDisabled(invalidWindow);
        } else {
            if (win.btnAceptar) win.btnAceptar.setDisabled(invalidWindow || !dirtyWindow);
        }
    },
    closeWinEditOferta: function () {
        this.getWinEditOferta().hide();
    },
    changeFileUploadDocumento: function (field, value) {
        var me = this,
            row = field.up('panel[rowDocument=true]'),
            btnDelete = row.down('button[action=delfile]'),
            tfNombre = row.down('textfield');

        btnDelete[(value) ? 'show' : 'hide']();

        tfNombre.allowBlank = false;
        if (!tfNombre.getValue()) {
            tfNombre.markInvalid(tfNombre.blankText);
        }

        if (value)
            field.up('form').insertRow();
    },
    resetFileUploadDocumento: function (field) {
        var me = this,
            row = field.up('panel[rowDocument=true]');

        row.down('button[action=showfile]').hide();
        row.down('button[action=delfile]').hide();
    },
    deleteDocumento: function (btn) {
        var me = this,
            row = btn.up('panel[rowDocument=true]'),
            file = row.down('fileuploadfield');

        mostrarMensaje(2, this.etiquetas.msgConfirmDelFileDocumento, function (response) {
            if (response === 'ok') {
                file.reset();
                btn.up('form').deleteRow(row.itemId)
            }
        });
    },
    onSelectSolicitud: function (record) {
        var win = this.getWinEditOferta();
        win.hfCliente.setValue(record.get('idclienteproveedor'));
        win.tfCliente.setValue(record.get('clienteproveedor'));
        win.tfSector.setValue(record.get('sector'));
        win.tfAreaResponsable.setValue(record.get('arearesponsable'));
        win.tfResponsable.setValue(record.get('responsable'));
        win.hfSolicitud.setValue(record.get('idsolicitud'));
    },
    getHitos: function () {
        var grid = this.getHitoPago(),
            store = this.getHitoPago().getStore(),
            cant = store.getCount(),
            modificados = [],
            eliminados = [];
        Ext.each(store.getNewRecords(), function (valor) {
            valor.data.indicadores = null;
            modificados.push(valor.data);
        });
        Ext.each(store.getModifiedRecords(), function (valor) {
            valor.data.indicadores = null;
            if (modificados.indexOf(valor.data) == -1)
                modificados.push(valor.data);
        });
        Ext.each(store.getRemovedRecords(), function (valor) {
            eliminados.push(valor.get('idhito'));
        });
        if (grid.datosLoad.length != cant) {
            Ext.each(grid.datosLoad, function (valor) {
                var exist = false;
                Ext.each(store.getRange(), function (valor2) {
                    if (valor.idhito == valor2.data.idhito) {
                        exist = true;
                    }
                });
                if (!exist) eliminados.push(valor.idhito);
            })
        }
        return {
            modificados: modificados,
            eliminados: eliminados
        }
    },
    getProductos: function () {
        var grid = this.getProducto(),
            store = this.getProducto().getStore(),
            cant = store.getCount(),
            modificados = new Array(),
            eliminados = new Array();
        Ext.each(store.getRange(), function (valor) {
            modificados.push(valor.data);
        });
        Ext.each(store.getRemovedRecords(), function (valor) {
            eliminados.push(valor.get('idindicadorcontrato'));
        });
        if (grid.datosLoad.length != cant) {
            Ext.each(grid.datosLoad, function (valor) {
                var exist = false;
                Ext.each(store.getRange(), function (valor2) {
                    if (valor.idindicadorcontrato == valor2.data.idindicadorcontrato) {
                        exist = true;
                    }
                });
                if (!exist) eliminados.push(valor.idindicadorcontrato);
            })
        }
        return {
            eliminados: eliminados,
            guardados: modificados
        };
    },
    saveOferta: function (btn) {
        var me = this,
            win = this.getWindowOfertaNegocio(),
            dataForm = win.customForm,
            pagoForm = win.formaPago,
            docForm = win.docForm,
            hitos = me.getHitos(),
            productos = me.getProductos(),
            notificarinicial=this.application.notificarinicial;
            storeOferta = me.getOfertaNegocio().getStore();
        var params = Ext.merge(dataForm.getForm().getValues(), {
            delfile: Ext.encode(docForm.getRemovedRecords()),
            editfile: Ext.encode(docForm.getModifiedRecords())
        });
        Ext.merge(params, pagoForm.getForm().getValues());
        Ext.merge(params, {
            productos: Ext.encode(productos),
            hitos: Ext.encode(hitos)
        });
        Ext.MessageBox.show({
            msg: me.etiquetas.msgSaveDataOferta,
            title: me.etiquetas.lbTitleWait,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        docForm.submit({
            url: UtilsFn.buildUrl({action: (win.action == 'add') ? 'adicionarOfertaNegocio' : 'modificarOfertaNegocio'}, me),
            params: {values: Ext.encode(params)},
            success: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);
                if (response.success) {
                    mostrarMensaje(1, me.etiquetas[(win.action == 'add') ? 'msgSuccessInsertOferta' : 'msgSuccessUpdateOferta']);
                    if(win.action=='add'){
                        var actual=notificarinicial[params['cliente']==1?'ofertanegocio':'ofertanegocioproveedor'];
                        if(actual && actual['notificar']=='1')
                            me.enviarCorreo({
                                destinatarios: actual['notificaciones'],
                                cuerpo: 'Se ha insertado una nueva '+actual['denominacion'].toLowerCase()+' con número <b style="color:#3158a0">'
                                    +params['numero']+'</b> y nombre <b style="color:#3158a0">'+params['nombre']+'</b>'
                            })
                    }
                    if (btn.action == 'apply') {
                        dataForm.getForm().reset();
                        pagoForm.getForm().reset();
                        docForm.getForm().reset();
                        pagoForm.hitopago.getStore().removeAll();
                        pagoForm.indicadores.getStore().removeAll();
                        pagoForm.hitopago.setDisabled(false);
                        pagoForm.indicadores.setDisabled(false);
                        win.nombre.focus();
                    } else
                        win.close();
                    storeOferta.load();
                } else {
                    mostrarMensaje(6, 'Comprobar errores de validacion');
                }
            },
            failure: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);
                if (response['code'] == 1)
                    mostrarMensaje(6, me.etiquetas.msgNumeroOfertaExiste);
            },
            scope: me
        });
    },
    selectCombo: function (combo, records) {
        var me = this,
            form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);

        if (hiddenField) {
            hiddenField.setValue(records[0].data[combo.localId]);
        }
    },
    changeCombo: function (combo, value, oldvalue) {
        var me = this,
            form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);

        if (hiddenField && Ext.isEmpty(value)) {
            hiddenField.setValue('');
        }
    },
    showDocumento: function (btn) {
        var url = btn.up('panel[rowDocument=true]').down('fileuploadfield').urlfile;
        if (url) {
            window.open(url);
        } else {
            mostrarMensaje(1, this.etiquetas.msgErrorNoFile);
        }
    },
    setOriginalValue: function (store) {
        var me = this,
            cant = store.getCount(),
            records = store.getRange(0, cant - 1),
            temp = new Array();
        Ext.each(records, function (record) {
            //se marcan como dirty para adcionarselos al suplemento del contrato
            if (me.getWindowOfertaNegocio())
                if (me.getWindowOfertaNegocio().addsuplemento) {
                    record.dirty = true;
                }
            temp.push(record.data);
        }, this);
        store.originalValue = Ext.encode(temp);
    },
    calcTotal: function (store) {
        var cant = store.getCount(),
            records = store.getRange(),
            total = 0,
            valores = {};
        var temp = this.obtenerEncodeStore(records);
        if (store.originalValue && store.originalValue != temp) {
            store.grid.up('window').formaPago.hfdirtygrids.setValue('dirty');
            store.isDirty = true;
        } else {
            store.grid.up('window').formaPago.hfdirtygrids.reset();
            store.grid.up('window').formaPago.fireEvent('validitychange');
            store.isDirty = false;
        }
    },
    onRemove: function (store, record) {
        var id = store.proxy.reader.idProperty,
            records = store.getRange();
        if (!store.removedRecords) {
            store.removedRecords = new Array();
        }
        if (record.data[id]) {
            store.removedRecords.push(record.data);
        }
        var temp = this.obtenerEncodeStore(records);
        if (store.originalValue && store.originalValue != temp) {
            store.grid.up('window').formaPago.hfdirtygrids.setValue('dirty');
            store.isDirty = true;
        } else {
            store.grid.up('window').formaPago.hfdirtygrids.reset();
            store.grid.up('window').formaPago.fireEvent('validitychange');
            store.isDirty = false;
        }
    },
    obtenerEncodeStore: function (records) {
        var temp = [];
        Ext.each(records, function (record) {
            temp.push(record.data);
        }, this);
        return Ext.encode(temp);
    }
});



