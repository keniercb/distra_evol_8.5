Ext.define('OfertaNegocioImportacion.controller.EditOferta', {
    extend: 'CRM.core.controller.Base',
    refs: [
        {ref: 'OfertaNegocio', selector: 'gpofertanegocioimportacion'},
        {ref: 'WinEditOferta', selector: 'wineditofertaimportacion'},
        {ref: 'WindowOfertaNegocio', selector: 'windowofertanegocioimportacion'},
        {ref: 'WindowOferta', selector: 'windowofertaimportacion'},
        {ref: 'DocumentosAdicionales', selector: 'fpofertadocadicionalesimportacion'},
        {ref: 'hitoPago', selector: 'GridHitoPagoimportacion'},
        {ref: 'producto', selector: 'gridproductoimportacion'}
    ],
    init: function () {
        var me = this;

        me.getLang();

        me.listen({
            store: {
                '#hitoStoreOfertaImportacion': {
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
                '#indicadorStoreOfertaImportacion': {
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
                "windowofertanegocioimportacion": {
                    show: this.winShow
                },
                "windowofertaimportacion": {
                    show: this.winShow
                },
                "wineditofertaimportacion button[action=cerrar]": {
                    click: this.closeWinEditOferta
                },
                "windowofertanegocioimportacion button[action=acept]": {
                    click: this.saveOferta
                },
                "windowofertanegocioimportacion button[action=apply]": {
                    click: this.saveOferta
                },
                "windowofertaimportacion button[action]": {
                    click: this.clickButtonOfertaWindow
                },
                "windowofertaimportacion combo[name=idsolicitud]": {
                    select: this.selectSolicitudOferta
                },
                "wineditofertaimportacion fileuploadfield": {
                    change: this.changeFileUploadDocumento,
                    reset: this.resetFileUploadDocumento
                },
                "wineditofertaimportacion button[action=showfile]": {
                    click: this.showDocumento
                },
                "wineditofertaimportacion button[action=delfile]": {
                    click: this.deleteDocumento
                },
                'wineditofertaimportacion combobox[localId],wineditoferta pickerfield[localId]': {
                    select: this.selectCombo,
                    change: this.changeCombo
                }
            }
        });
    },
    winShow: function (win, eOpts) {
        console.log('mostrar window:', win)
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
            invalidWindow = invaliddataform || invalidpagoForm,
            dirtydataform = dataform.isDirty(),
            dirtypagoform = pagoForm.isDirty(),
            dirtydocform = docForm.isDirty(),
            dirtyWindow = dirtydataform || dirtypagoform;
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
    getHitos: function (win) {
        var grid = win.down('GridHitoPago'),
            store = grid.getStore(),
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
    getProductos: function (win) {
        var grid = win.down('gridproductoimportacion'),
            store = grid.getStore(),
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

    cargarNumeroAutomatico: function (win, tipo, codigolinea) {
        // console.log('codigoooooooooooo', codigolinea)
        var me = this;
        var mask = new Ext.LoadMask(win.numero, {msg: me.etiquetas.msgCargandoConsecutivo});
        mask.show();
        win.btnGenerarConsecutivo.setDisabled(true);
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getNumeroOfertaAutomatico'}, me),
            params: {tipo: tipo, codigolinea: codigolinea},
            callback: function (options, success, response) {
                mask.hide();
                var datos = Ext.decode(response.responseText);
                win.numero.setValue(datos);
                win.numero.clearInvalid();
                win.btnGenerarConsecutivo.setVisible(false);
                win.btnGenerarConsecutivo.setDisabled(false);
                win.numero.consecutivoActual = datos;
            }
        });
    },
    getDatosContenedores: function(win){
        var result = [];
        win.down('#gridtiposcontenedores').getStore().getRange().forEach(function(x){
            result.push(x.data);
        })
        return result;
    },

    saveOferta: function (btn) {
        var me = this,
            win = btn.up('window'),
            // win = this.getWindowOfertaNegocio(),
            dataForm = win.customForm,
            pagoForm = win.formaPago,
            docForm = win.docForm,
            // hitos = me.getHitos(win),
            productos = me.getProductos(win),
            storeOferta = me.getOfertaNegocio().getStore(),
            datoscontenedores=me.getDatosContenedores(win);
        let gastos = {...pagoForm.getForm().getValues()};

        delete gastos['idcondicionpago'];
        delete gastos['condicionpago'];
        delete gastos['idmediodepago'];
        delete gastos['mediopago'];
        delete gastos['dirtygrids'];
        delete gastos['modelName'];
        delete gastos['searchproductos'];
        var params = Ext.merge(dataForm.getForm().getValues(), {
            delfile: Ext.encode(docForm.getRemovedRecords()),
            editfile: Ext.encode(docForm.getModifiedRecords()),
            datoscontenedores: datoscontenedores,
            cobros: Ext.encode(gastos)
        });
        Ext.merge(params, pagoForm.getForm().getValues());
        Ext.merge(params, {
            productos: Ext.encode(productos),
            // hitos: Ext.encode(hitos),
            add: win.action
        });
        Ext.MessageBox.show({
            msg: me.etiquetas.msgSaveDataOferta,
            title: me.etiquetas.lbTitleWait,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        // console.log('params',params)
        docForm.submit({
            url: UtilsFn.buildUrl({action: (win.action == 'mod') ? 'modificarOfertaNegocio' : 'adicionarOfertaNegocio'}, me),
            params: {values: Ext.encode(params)},
            // waitMsg: me.etiquetas.msgSaveDataOferta,
            success: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);
                if (response.success) {
                    mostrarMensaje(1, me.etiquetas[(win.action == 'add') ? 'msgSuccessInsertOferta' : 'msgSuccessUpdateOferta']);
                    if (btn.action == 'apply') {
                        dataForm.getForm().reset();
                        pagoForm.getForm().reset();
                        docForm.getForm().reset();
                        pagoForm.hitopago.getStore().removeAll();
                        pagoForm.indicadores.getStore().removeAll();
                        pagoForm.hitopago.setDisabled(false);
                        pagoForm.indicadores.setDisabled(false);
                        win.nombre.focus();
                        if(win.action == 'add')
                            me.cargarNumeroAutomatico(win, win.tipo, codigoLinea)
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
                if (response['code'] == 1) {
                    mostrarMensaje(6, me.etiquetas.msgNumeroOfertaExiste);
                    win.numero.markInvalid(me.etiquetas.msgNumeroOfertaExiste);
                    if (params['tipo'] == 1 || params['tipo'] == 3)
                        win.btnGenerarConsecutivo.setVisible(true);
                }
            },
            scope: me
        });
    },

    selectCombo: function (combo, records) {
        var me = this,
            form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);

        if (hiddenField) {
            if(hiddenField.name=='idclienteproveedor')
                hiddenField.setValue(records[0].data['idclientesproveedores'])
            else
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
        var me = this, 
            win = me.getWindowOferta(),
            cant = store.getCount(),
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
        // total = records.reduce((a, b)=> a + 
        //     ((parseFloat(b.get('monto'))*parseFloat(b.get('cantidad'))) || 0)
        // , 0);
        // console.log(win.down('#gridindicadores').monedasentidad)
        // total = records.reduce((a, b)=> a + 
        //     (win.down('#gridindicadores').monedasentidad.reduce((c, d)=>c + 
        //         ((parseFloat(b.get('montomoneda_'+d.codigoiso.toLowerCase())) || 0)*parseFloat(b.get('cantidad'))), 0)  || 0)
        // , 0);
        records.forEach(function (x) {
            var suma=0;
            if(win.down('#gridindicadores').monedasentidad)
                win.down('#gridindicadores').monedasentidad.forEach(function(field){
                    var tipomoneda='montomoneda_';
                    if(x.get('fechaconversion'))tipomoneda='montomonedaconversion_';
                    suma+=parseFloat(x.get(tipomoneda+field.codigoiso.toLowerCase() + '_' + field.idmoneda))*parseFloat(x.get('cantidad'));
                })
            else
                suma=parseFloat(x.get('monto'))*parseFloat(x.get('cantidad'));
            total += suma;
        });
        // console.log('totttl', total)
        win.down('#importeproductos').setValue(total);
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
    },
    clickButtonOfertaWindow: function (button) {
        var me = this;
        switch (button.action) {
            case 'acept':
                me.saveOferta(button);
                break;
            // me.saveOfertaSolicitud();break;
            case 'apply':
                me.saveOferta(button);
                break;
            // me.saveOfertaSolicitud();break;
        }
    },
    saveOfertaSolicitud: function () {
        var me = this,
            win = this.getWindowOferta(),
            dataForm = win.customForm,
            pagoForm = win.formaPago,
            docForm = win.docForm,
            hitos = me.getHitos(win),
            productos = me.getProductos(win),
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
        // console.log('params:', params)
        docForm.submit({
            url: UtilsFn.buildUrl({action: (win.action == 'add') ? 'adicionarOferta' : 'modificarOferta'}, me),
            params: {values: Ext.encode(params)},
            // waitMsg: me.etiquetas.msgSaveDataOferta,
            success: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);
                if (response.success) {
                    mostrarMensaje(1, me.etiquetas[(win.action == 'add') ? 'msgSuccessInsertOferta' : 'msgSuccessUpdateOferta']);
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
                // Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);
                if (response['code'] == 1) {
                    mostrarMensaje(6, me.etiquetas.msgNumeroOfertaExiste);
                    win.numero.markInvalid(me.etiquetas.msgNumeroOfertaExiste);
                }
            },
            scope: me
        });
    },
    selectSolicitudOferta: function (combo, records) {
        var me = this,
            win = me.getWindowOferta();
        console.log('Records', records);
        if (combo.getValue()) {
            // win.nombre.setValue(records[0].get('nombre'));
            win.linea.setValue(records[0].get('linea'));
            win.tipolinea.setValue(records[0].get('tipolinea'));
            win.codigolinea.setValue(records[0].get('codigolinea'));
            // console.log('codigo linea', records[0].get('codigolinea'));
            if(win.action == 'add')
                me.cargarNumeroAutomatico(win, win.tipo, records[0].get('codigolinea'));
            // console.log(win)
            var mask = new Ext.LoadMask(
                win.sfclienteproveedor, {msg: this.etiquetas.msgCargandoDatosSolicitud});
            mask.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'cargarProveedoresSolicitud'}, ModuleMgr.get('SolicitudNegocioImportacion')),
                params: {idsolicitud: combo.getValue()},
                callback: function (options, success, response) {
                    mask.hide();
                    var info = Ext.decode(response.responseText);
                    var ids = [];
                    info.datos.forEach(function (x) {
                        ids.push(x.idclientesproveedores);
                    })
                    win.sfclienteproveedor.filters.idclientesproveedores = ids;
                    if (me.hfclienteproveedor != null)
                        if (ids.indexOf(me.hfclienteproveedor.value) == -1) {
                            me.hfclienteproveedor.setValue('');
                            me.sfclienteproveedor.setValue('');
                        }
                }
            });

        }
    }

});



