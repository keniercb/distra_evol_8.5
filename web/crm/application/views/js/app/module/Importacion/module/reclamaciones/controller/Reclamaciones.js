Ext.define('Reclamaciones.controller.Reclamaciones', {
    extend: 'CRM.core.controller.Base',
    views: ['Reclamaciones'],
    refs: [
        {ref: 'Reclamaciones', selector: 'gpreclamaciones'},
        {ref: 'WinEditReclamacion', selector: 'wineditreclamacion'},
        {ref: 'WinDetallesReclamacion', selector: 'windetallesreclamacion'},
        {ref: 'anexos', selector: 'fpreclamacionesanexos'}
    ],
    requires: [
        'Reclamaciones.view.Reclamaciones',
        'Reclamaciones.view.WinEditReclamacion',
        'Reclamaciones.view.WinDetallesReclamacion',
        'GestionContratoImportacion.view.GestorDocumental.Window',
        'Nomencladores.view.GridToGrid',
        'Reclamaciones.view.SignWindow'
    ],
    init: function () {
        var me = this;
        me.arrayContextos = ['cliente', 'proveedor', 'extranjera']
        this.etiquetas = LangMgr.getLang(this);
        // me.getLang();

        me.listen({
            store: {
                '#Reclamaciones': {
                    load: this.afterLoadReclamaciones,
                    beforeload: function () {
                        this.getReclamaciones().getSelectionModel().clearSelections();
                    }
                }
            },
            component: {
                "gpreclamaciones": {
                    // render: this.onRenderReclamacion,
                    selectionchange: this.onSelectionChangeReclamaciones,
                    itemcontextmenu: this.showContextMenu,
                    afterrender: this.grantActions,
                    render: function (grid) {
                        this.loadConf(grid)
                    },
                    itemdblclick: this.showWinDetallesReclamacion,
                },
                'gpreclamaciones searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                "fpreclamacionesanexos fileuploadfield": {
                    change: this.changeFileUploadDocumento,
                    reset: this.resetFileUploadDocumento
                },
                "fpreclamacionesanexos button[action=delfile]": {
                    click: this.deleteDocumento
                },
                "gpreclamaciones button[action=addreclamacion], menuitem[action=addreclamacion]": {
                    click: this.showWinEditReclamacion
                },
                "gpreclamaciones button[action=modreclamacion], menuitem[action=modreclamacion]": {
                    click: this.showWinEditReclamacion
                },
                "gpreclamaciones button[action=delreclamacion], menuitem[action=delreclamacion]": {
                    click: this.eliminarReclamacion
                },
                "gpreclamaciones button[action=cambiarestado], menuitem[action=cambiarestado]": {
                    click: this.changeEstado
                },
                "gpreclamaciones button[action=vertrazasreclamacion], menuitem[action=vertrazasreclamacion]": {
                    click: this.showWinEstadoTrazas
                },
                "gpreclamaciones button[action=detallereclamacion], menuitem[action=detallereclamacion]": {
                    click: this.showWinDetallesReclamacion
                },
                "gpreclamaciones button[action=clearfilters]": {
                    click: this.limpiarTodosLosFiltros
                },

                "wineditreclamacion button[action=aceptar]": {
                    click: this.saveReclamacion
                },
                "wineditreclamacion button[action=aplicar]": {
                    click: this.saveReclamacion
                },
                "wineditreclamacion button[action=cerrar]": {
                    click: this.closeWinEditReclamacion
                },
                'wineditreclamacion combobox[localId],wineditreclamacion pickerfield[localId]': {
                    select: this.selectCombo,
                    change: this.changeCombo
                },
                "windetallesreclamacion button[action=cerrar]": {
                    click: this.closeWinDetallesReclamacion
                },
                'windetallesreclamacion': {
                    beforeshow: function () {
                        if (this.application.keyMap) {
                            this.application.keyMap.disable();
                        }

                    },
                    close: function () {
                        if (this.application.keyMap) {
                            this.application.keyMap.enable();
                        }
                    }
                },
                'signwindowreclamaciones datefield[name=fechafirma]': {
                    change: function (field) {
                        var window = field.up('window'),
                            btn = window.btnAcept;
                        if (field.getValue() && field.isValid()) {
                            btn.enable();
                        } else {
                            btn.disable();
                        }
                    }
                },
                'signwindowreclamaciones button[action=acept]': {
                    click: function (btn) {
                        var window = btn.up('window'),
                            config = window.config,
                            fecha = window.fechafirma.getValue();
                        if (config && config.action && fecha) {
                            config.fechafirma = fecha;
                            this.changeEstado(config);
                            window.close();
                        }
                    }
                }
            }
        });
    },

    loadConf: function (grid) {
        var me = this;

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getConfiguraciones'}, this),
            scope: this,
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                this.application.gestordocumental = response;
            }
        });
    },


    getSiguienteEstado: function () {
        var grid = this.getReclamaciones(),
            store = grid.getStore(),
            record = grid.getSelectionModel().getSelection()[0],
            estados = [];

        if (!record || !record.data.idestado) {
            return;
        }
        var datos = store.proxy.reader.jsonData.estados_reclamacion;

        if (datos[record.data.idestado]) {
            var transiciones = datos[record.data.idestado]['transiciones'];
            Ext.each(transiciones, function (transicion) {
                var aux = datos[transicion['idestado']];
                aux['notificar'] = transicion['notificar'];
                estados.push(aux);
            });
        }
        return estados;
    },

    checkTransition: function (idestadoinicial, idestadofinal) {
        var exist = false,
            comite = this.application.comite,
            activo = this.application.crm.activeModules.Comite;
        if (activo == "true" && comite && comite.transitions) {
            for (k in comite.transitions) {
                var transition = comite.transitions[k];
                if (transition.idestadoinicial == idestadoinicial && transition.idestadofinal == idestadofinal) {
                    exist = true;
                }
            }
        }

        if (!exist) {
            return true;
        }
        return false;
    },

    crearMenuEstado: function () {
        var me = this,
            grid = me.getReclamaciones(),
            menuEstado = grid.down('#menuestado').menu,
            estados = this.getSiguienteEstado(),
            record = grid.getSelectionModel().getSelection()[0];
        menuEstado.removeAll();

        Ext.each(estados, function (estado) {
            if (this.checkTransition(record.data.idestado, estado.idestado)) {
                menuEstado.add({
                    text: estado.nombre,
                    iconCls: estado.icono,
                    tooltip: this.etiquetas.lbCambiarEstado,
                    idestado: estado.idestado,
                    notificar: estado.notificar,
                    action: 'cambiarestado',
                    actions: estado.acciones
                });
            }
        }, this);

        if ((menuEstado.items.length) != 0) grid.down('button[action=cambiarestadoreclamacion]').setDisabled(false);
        else if ((menuEstado.items.length) == 0) {
            grid.down('button[action=cambiarestadoreclamacion]').setDisabled(true);
        }
    },


    afterLoadReclamaciones: function () {
        var grid = this.getReclamaciones(),
            grid2 = grid.items.items[1];
        // if (!grid.extrafields) {
        this.addExtraColumns(grid);
        // }
    },

    onSelectionChangeReclamaciones: function (sm, select) {
        var me = this,
            gpreclamaciones = me.getReclamaciones(),
            // selection = gpreclamaciones.getSelectionModel().getSelection(),
            menuEstado = gpreclamaciones.down('#menuestado').menu,
            tamaño = select.length;

        if (tamaño == 0) {
            gpreclamaciones.down('button[action=delreclamacion]').setDisabled(true);
            gpreclamaciones.down('button[action=modreclamacion]').setDisabled(true);
            gpreclamaciones.down('button[action=detallereclamacion]').setDisabled(true);
            gpreclamaciones.down('button[action=vertrazasreclamacion]').setDisabled(true);
            gpreclamaciones.down('button[action=cambiarestadoreclamacion]').setDisabled(true);

        }
        else if (tamaño != 1) {
            gpreclamaciones.down('button[action=modreclamacion]').setDisabled(true);
            gpreclamaciones.down('button[action=detallereclamacion]').setDisabled(true);
            gpreclamaciones.down('button[action=vertrazasreclamacion]').setDisabled(true);
            gpreclamaciones.down('button[action=cambiarestadoreclamacion]').setDisabled(true);
            gpreclamaciones.down('button[action=delreclamacion]').setDisabled(false);
        }
        else if (tamaño == 1) {
            gpreclamaciones.down('button[action=modreclamacion]').setDisabled(false);
            gpreclamaciones.down('button[action=detallereclamacion]').setDisabled(false);
            gpreclamaciones.down('button[action=vertrazasreclamacion]').setDisabled(false);
            // gpreclamaciones.down('button[action=cambiarestadoreclamacion]').setDisabled(false);
            gpreclamaciones.down('button[action=delreclamacion]').setDisabled(false);
            me.crearMenuEstado();
        }
        else {
            menuEstado.removeAll();
        }

    },

    addExtraColumns: function (grid) {
        var store = grid.getStore(),
            fields = store.model.getFields(),
            jsondata = store.proxy.reader.jsonData,
            data = jsondata.data,
            columns = grid.columns,
            newfields = [],
            newcolumns = [],
            pos = -1;

        Ext.each(columns, function (column, index) {
            newcolumns.push(column.initialConfig);
        });

    },

    onSearch: function (field, data) {
        var me = this,
            grid = me.getReclamaciones();
        grid.getStore().filters.removeAtKey(field.atributo);
        if (field.getValue() != '') {
            grid.getStore().proxy.extraParams = {
                'filtrogeneral[0][field]': 'general',
                'filtrogeneral[0][data][type]': 'string',
                'filtrogeneral[0][data][value]': field.getValue(),
            };
        }
        grid.getStore().load();
    },
    onClear: function (field) {
        if (this.getReclamaciones().getStore().proxy.extraParams['filtrogeneral[0][field]']) {
            this.getReclamaciones().getStore().proxy.extraParams = {};
            this.getReclamaciones().getStore().load();
        }
    },
    changeFileUploadDocumento: function (field, value) {
        var me = this,
            row = field.up('panel[rowDocument=true]'),
            btnDelete = row.down('button[action=delfile]'),
            textfield = row.down('textfield');

        btnDelete[(value) ? 'show' : 'hide']();
        textfield.allowBlank = false;
        if (!textfield.getValue()) {
            textfield.markInvalid(textfield.blankText);
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

        mostrarMensaje(2, this.etiquetas.msgConfirmDelFile, function (response) {
            if (response === 'ok') {
                file.reset();
                btn.up('form').deleteRow(row.itemId)
            }
        });
    },

    limpiarTodosLosFiltros: function () {
        var grid = this.getReclamaciones(),
            actives = grid.filters.getFilterData().length,
            generalFilt = this.getReclamaciones().getStore().proxy.extraParams['filtrogeneral[0][field]'];
        grid.getStore().proxy.extraParams = {};
        grid.down('searchfield').reset();
        grid.filters.clearFilters();
        if (generalFilt && actives == 0) grid.getStore().load();
    },
    showWinEditReclamacion: function (button) {
        var me = this, cliente = true, context = button.context, tipo = button.tipo,
            height = button.heightWin, width = 850,
            gdactivo = (this.application.gestordocumental && this.application.gestordocumental.activo == "1") ? true : false;

        recordSelected = this.getReclamaciones().getSelectionModel().getSelection(),
            title = button.tooltip,
            filtros = button.filtros;

        if (button.action == 'modreclamacion') {
            tipo = parseInt(recordSelected[0].get('tipo'));
            if (recordSelected[0].get('tipo') == '0') {
                context = 'cliente';
                title = me.etiquetas.lbModificarRNCliente;
                height = 475;
            } else if (recordSelected[0].get('tipo') == '1') {
                context = 'proveedor';
                title = me.etiquetas.lbModificarRNProveedor;
                height = 475;
            } else if (recordSelected[0].get('tipo') == '2') {
                context = 'extranjera';
                title = me.etiquetas.lbModificarRE;
                height = 475;
            }
        }

        var win = Ext.create('Reclamaciones.view.WinEditReclamacion', {
            action: button.action,
            context: context,
            tipo: tipo,
            title: title,
            height: height,
            deshabilitarproductos: (button.action == 'addreclamacion'),
            width: width,
            idreclamacion: button.action == 'modreclamacion' ? recordSelected[0].get('idreclamacion') : -1,
            gestordocumental: gdactivo,
            idnaturaleza: me.application.idnaturaleza,
            filtros: filtros,
            // idestadosolicitud: me.application.idestadosolicitud,
            // verMotivo: verMotivo
        });
        win.setActionInsert(button.action != 'modreclamacion');
        win.show();
        if (button.action == 'addreclamacion') {
            me.cargarNumeroConsecutivo();
        }
        else {
            var cloneRecord = recordSelected[0].copy();
            Ext.data.Model.id(cloneRecord);
            cloneRecord.set('idlinea', null);
            cloneRecord.set('idtipolinea', null);

            win.loadValues(cloneRecord);
            win.sflinea.getStore().proxy.extraParams.idclientesproveedores = cloneRecord.get('idclientesproveedores');
            win.sftipolinea.getStore().proxy.extraParams.idclientesproveedores = cloneRecord.get('idclientesproveedores');

            win.gridProducto.stRight.proxy.extraParams.idreclamacion = recordSelected[0].get('idreclamacion');
            win.gridProducto.stRight.proxy.extraParams.accion = recordSelected[0].get('reclamaciones');

            win.gridProducto.stRight.load();

            win.sftiporeclamacion.getStore().proxy.extraParams.idtiporeclamacion = cloneRecord.get('idtiporeclamacion');
            win.sfcliente.getStore().proxy.extraParams.idcliente = cloneRecord.get('idcliente');
            win.sfproveedor.getStore().proxy.extraParams.idproveedor = cloneRecord.get('idproveedor');

            if (cloneRecord.get('idproveedor') != "" && cloneRecord.get('idproveedor') != null) {
                win.sflinea.setDisabled(false);
                if (win.context == 'cliente') {
                    win.sflinea.getStore().proxy.extraParams = {'idcliente': cloneRecord.get('idcliente'),}
                    win.sflinea.getStore().load();
                }
                else {
                    win.sflinea.getStore().proxy.extraParams = {'idproveedor': cloneRecord.get('idproveedor'),}
                    win.sflinea.getStore().load();
                }
            }

            if (cloneRecord.get('idindicador') != "" && cloneRecord.get('idindicador') != null) {
                win.sftipolinea.setDisabled(false);
            }

            me.cargarCombo(win.sflinea, recordSelected[0], 'idindicador', 'linea');
            me.cargarCombo(win.sftipolinea, recordSelected[0], win.sftipolinea.name, null, {
                'idlinea': recordSelected[0].get('idlinea')
            });
            me.cargarCombo(win.sftiporeclamacion, recordSelected[0], win.sftiporeclamacion.name, 'tiporeclamacion');
            me.cargarCombo(win.sfcliente, recordSelected[0], win.sfcliente.name, 'cliente');
            me.cargarCombo(win.sfproveedor, recordSelected[0], win.sfproveedor.name, 'proveedor');
            me.cargarCombo(win.sfcontrato, recordSelected[0], win.sfcontrato.name, 'contrato');

            win.down('#motivo').originalValue = recordSelected[0].get('motivo');
            win.down('#motivo').setValue(recordSelected[0].get('motivo'));


            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'getReclamacionDocs'}, ModuleMgr.get('Reclamaciones')),
                params: {idespaciotrabajo: recordSelected[0].get('idespaciotrabajo')},
                success: function (response) {
                    var datos = Ext.decode(response.responseText);
                    if (datos.length > 0)
                        win.docAdicionales.loadDocuments(datos);
                },
                failure: function (response) {
                    cargandoAnexos = false;
                    if (win.gridProducto.maskL) win.gridProducto.maskL.hide();
                }
            })
        }
    },

    cargarNumeroConsecutivo: function () {
        var me = this, win = me.getWinEditReclamacion();
        if (win.tfNumero && win.tfNumero.isVisible()) {
            win.tfNumero.maskL = new Ext.LoadMask(
                win.tfNumero.getEl(), {msg: this.etiquetas.msgLoading});
            win.tfNumero.maskL.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'obtenerConsecutivo'}, ModuleMgr.get('Reclamaciones')),
                // params: {tipo: tipo},
                success: function (response) {
                    win.tfNumero.maskL.hide();
                    var datos = Ext.decode(response.responseText);
                    win.tfNumero.setValue(datos);
                },
                failure: function (response) {
                    win.numero.setDisabled(false);
                }
            })
        }
    }
    ,
    cargarCombo: function (campo, recordSelected, atributo, rawValue, extraParams, extraFunction) {
        // console.log('cargarcombo', campo.name, recordSelected.get(campo.name), atributo, recordSelected.get(atributo))
        console.log('recordSelected',recordSelected)
        console.log('recordSelected.get(campo.name)', recordSelected.get(campo.name))
        console.log('recordSelected.get(atributo)', recordSelected.get(atributo))
        if (recordSelected.get(atributo)) {
            if (rawValue) campo.setRawValue(recordSelected.get(rawValue));
            campo.mask = new Ext.LoadMask(campo, {msg: this.etiquetas.msgLoading});
            campo.mask.show();
            if (extraParams) campo.getStore().proxy.extraParams = extraParams;
            campo.getStore().load({
                callback: function (records, operation, success) {
                    campo.mask.hide();
                    campo.select(recordSelected.get(atributo));
                    campo.setDisabled(false);
                    // win.sflinea.fireEvent('change', win.sflinea);
                    campo.resetOriginalValue();
                    if (extraFunction && typeof extraFunction == 'function') extraFunction.call();
                }
            });
        }
    }
    ,
// cargarValoresPorDefecto: function (win) {
//     var me = this;
//     Ext.Ajax.request({
//         url: UtilsFn.buildUrl({action: 'obtenerConfiguracionPorDefecto'}, ModuleMgr.get('GestionContratoImportacion')),
//         success: function (response) {
//             var datos = Ext.decode(response.responseText);
//             win.sfsector.Lmask.hide();
//             win.cmbarea.Lmask.hide();
//             if (datos[0] && win) {
//                 win.sfsector.setValue(datos[0]['sector']);
//                 win.hfsector.setValue(datos[0]['idsector']);
//                 win.cmbarea.setValue(datos[0]['nombrearea']);
//                 win.hfarea.setValue(datos[0]['idarea']);
//             }
//         },
//         failure: function (response) {
//             mostrarMensaje(7, 'No han podido cargarse los datos.')
//         }
//     });
// },

    closeWinEditReclamacion: function () {
        this.getWinEditReclamacion().close();
    },
    obtenerProductos: function () {
        var me = this, win = me.getWinEditReclamacion(), nuevos = [], eliminado = [];
        var store = win.gridProducto.stRight,
            newRecords = store.getNewRecords(),
            modified = store.getModifiedRecords(),
            removed = store.getRemovedRecords();
        store.data.items.forEach(function (m) {
            if ('nuevos.indexOf(m.data) == -1', store.data.items)
                nuevos.push(m.data);
        });
        removed.forEach(function (r) {
            if (eliminado.indexOf(r.get('idindicadorreclamacion')) == -1)
                eliminado.push(r.get('idindicadorreclamacion'));
        });
        return {'nuevos': nuevos, 'eliminados': eliminado};
    },

    saveReclamacion: function (btn) {
        var me = this;
        win = me.getWinEditReclamacion(),
            form = win.down('#principal'),
            storeReclamacion = me.getReclamaciones().getStore(),
            docForm = win.docAdicionales,
            params = Ext.merge(form.getValues(), {
                tipo: me.arrayContextos.indexOf(win.context),
                delfile: Ext.encode(docForm.getRemovedRecords()),
                editfile: Ext.encode(docForm.getModifiedRecords())
            });
        console.log('form', form)
        console.log('params', params)

        Ext.MessageBox.show({
            msg: me.etiquetas.msgSaveDataReclamacion,
            title: me.etiquetas.lbTitleWait,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        docForm.submit({
            url: UtilsFn.buildUrl({action: (win.getActionInsert()) ? 'adicionarReclamacion' : 'modificarReclamacion'}, me),
            submitEmptyText: false,
            params: {values: Ext.encode(params), productos: Ext.encode(me.obtenerProductos())},
            success: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);

                if (response.success) {
                    mostrarMensaje(1, me.etiquetas[(win.getActionInsert()) ? 'msgSuccessInsertReclamacion' : 'msgSuccessUpdateReclamacion']);

                    if (btn.action == 'aplicar') {
                        win.resetComponents();
                        me.cargarNumeroConsecutivo();
                    } else
                        win.close();

                    storeReclamacion.load();
                } else {
                    mostrarMensaje(6, 'Comprobar errores de validacion');
                }

            },
            failure: function (form, action) {
                Ext.MessageBox.hide();
            },
            scope: me
        });
    }
    ,
    selectCombo: function (combo, records) {
        var me = this,
            form = combo.up('form'),
            hiddenField = null;
        switch (combo.name) {
            case 'cliente':
                hiddenField = form.getForm().findField('idcliente');
                break;
            case 'proveedor':
                hiddenField = form.getForm().findField('idproveedor');
                break;
            // case 'linea':
            //     hiddenField = form.getForm().findField('idindicador');
            //     break;
            default:
                hiddenField = form.getForm().findField(combo.localId);
        }
        if (hiddenField) {
            hiddenField.setValue(records[0].data[combo.localId]);
        }
    }
    ,
    changeCombo: function (combo, value, oldvalue) {
        var me = this,
            form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);

        if (hiddenField && Ext.isEmpty(value)) {
            hiddenField.setValue('');
        }
    }
    ,
    showFile: function (btn) {
        var url = btn.up('panel[rowDocument=true]').down('fileuploadfield').urlfile;
        if (url) {
            window.open(url);
        } else {
            mostrarMensaje(1, this.etiquetas.msgErrorNoFile);
        }
    }
    ,
    delFile: function (btn) {
        var me = this,
            row = btn.up('panel[rowDocument=true]'),
            file = row.down('fileuploadfield');

        mostrarMensaje(2, this.etiquetas.msgConfirmDelFile, function (response) {
            if (response === 'ok') {
                file.reset();
                btn.up('form').deleteRow(row.itemId)
            }
        });
    }
    ,
    eliminarReclamacion: function () {
        var me = this,
            sm = me.getReclamaciones().getSelectionModel();
        me.application.keyMap.disable();
        mostrarMensaje(2, me.etiquetas.msgElimReclamacion, function (response) {
            if (response === 'ok') {
                Ext.MessageBox.show({
                    msg: me.etiquetas.msgElimDataReclamacion,
                    title: me.etiquetas.lbTitleWait,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                var ids = [];
                sm.getSelection().forEach(function (x) {
                    ids.push(x.get('idreclamacion'));
                });

                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'eliminarReclamacion'}, me),
                    params: {values: Ext.encode(ids)},
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        me.application.keyMap.enable();
                        var info = Ext.decode(response.responseText);
                        if (info.success) {
                            mostrarMensaje(1, me.etiquetas.msgSuccessDeleteReclamacion);
                            me.getReclamaciones().getStore().load();
                        } else
                            mostrarMensaje(6, 'Error incorporar mensaje');

                    },
                    scope: this
                });
            } else if (response == 'cancel') {
                me.application.keyMap.enable();
            }
        });
    },
    showWinDetallesReclamacion: function () {
        var recordSelected = this.getReclamaciones().getSelectionModel().getSelection()[0];
        Ext.create('Reclamaciones.view.WinDetallesReclamacion').show(recordSelected);
    }
    ,
    closeWinDetallesReclamacion: function () {
        this.getWinDetallesReclamacion().close();
    },

    showContextMenu: function (view, record, item, index, e, eOpts) {
        e.stopEvent();
        var grid = view.up('grid'),
            sm = view.up('grid').getSelectionModel();
        if (sm.getCount() <= 1)
            sm.select(record);
        this.createContextMenu(grid, grid.columns);
        if (grid.contextMenu.items.length > 0)
            grid.contextMenu.showAt(e.getXY());
    }
    ,
    createContextMenu: function (grid, columns) {
        var me = this,
            select = grid.getSelectionModel().getSelection(),
            items = [],
            tbar = grid.dockedItems.items[3].items.items;
        grid.down('#accionesContextMenu').items.items.forEach(function (x) {
            var config = me.cloneObject(x.initialConfig);
            if (config) {
                config.id = 'menu' + (config.id || Ext.id());
                config.hidden = x.isHidden();
                config.disabled = x.isDisabled();
                if (!config.hidden)
                    items.push(config);
            }
        });
        if (tbar) {
            tbar.forEach(function (x) {
                if (x.xtype == 'button' && ['help', 'addreclamacion', '', undefined, null].indexOf(x.action) == -1) {
                    var config = me.cloneObject(x.initialConfig);
                    if (config) {
                        config.xtype = undefined;
                        config.id = 'menu' + (config.id || Ext.id());
                        config.hidden = x.isDisabled() || x.isHidden();
                        config.disabled = x.isDisabled();
                        if (!config.hidden)
                            items.push(config);
                    }
                }
            });
        }
        grid.contextMenu = Ext.create('Ext.menu.Menu', {
            plain: true,
            items: items
        });
    }
    ,
    cloneObject: function (obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        var me = this,
            temp = obj.constructor();
        if (temp)
            for (var key in obj) {
                temp[key] = me.cloneObject(obj[key]);
            }
        return temp;
    }
    ,

    grantActions: function (grid) {
        this.validateGrantedActions({container: grid});
    }
    ,

    changeTipoLinea: function (yo) {
        var me = this,
            win = me.getWinEditReclamacion();
        var pos = yo.store.findExact('idtipolinea', yo.getValue());
        if (pos == -1) {
            win.sftipolinea.setValue('');
        }
    }
    ,
    selectTipoLinea: function (yo) {
        var me = this,
            win = me.getWinEditReclamacion();
        win.sftipolinea.mask = new Ext.LoadMask(win.sftipolinea, {msg: this.etiquetas.msgLoading});
        win.sftipolinea.mask.show();
        win.sftipolinea.setValue(yo.getValue());
        win.sftipolinea.setRawValue('');
        win.sftipolinea.getStore().load({
            callback: function (records, operation, success) {
                win.sftipolinea.mask.hide();
                if (success) win.sftipolinea.setValue(yo.getValue());
            }
        })
    },

    changeEstado: function (btn) {
        var me = this;
        var grid = this.getReclamaciones();
        record = grid.getSelectionModel().getSelection()[0];

        Ext.MessageBox.show({
            msg: me.etiquetas.lbGuardando,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'cambiarEstadoReclamacion'}, me),
            params: {
                idreclamacion: record.data.idreclamacion,
                idestado: btn.idestado,
                fechafirma: btn.fechafirma,
                responseCfg: {
                    action: 'edit',
                    gen: 'm',
                    concept: me.etiquetas.lbEstado,
                    count: 1
                }
            },
            callback: function (options, success, response) {
                var result = Ext.decode(response.responseText);
                Ext.MessageBox.hide();
                if (success) {
                    if (result.success) {
                        var grid = me.getReclamaciones();
                        grid.getStore().load();
                        // if (btn.notificar == 1)
                        //     me.notify(result['data']['roles'], result['data']['contrato']);
                    } else {
                        mostrarMensaje(2, result['msg']);
                    }
                }
            }
        });
    },
    showWinEstadoTrazas: function () {
        var recordSelected = this.getReclamaciones().getSelectionModel().getSelection()[0];
        var win = Ext.create('Reclamaciones.view.WinReclamacionEstadoTrazas'),
            store = win.items.first().getStore();
        win.setTitle(this.etiquetas.titleWinVerTrazas + ' # ' + recordSelected.get('numero'));
        win.show();
        store.removeAll();
        store.load({params: {idreclamacion: recordSelected.get('idreclamacion')}});
    },
})
;
