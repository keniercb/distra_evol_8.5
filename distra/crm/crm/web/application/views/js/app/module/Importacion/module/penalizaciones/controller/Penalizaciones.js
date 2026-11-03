Ext.define('Penalizaciones.controller.Penalizaciones', {
    extend: 'CRM.core.controller.Base',
    views: ['Penalizaciones'],
    refs: [
        {ref: 'Penalizaciones', selector: 'gppenalizaciones'},
        {ref: 'WinEditPenalizacion', selector: 'wineditpenalizacion'},
        {ref: 'WinDetallesPenalizacion', selector: 'windetallespenalizacion'},
        {ref: 'anexos', selector: 'fppenalizacionesanexos'}
    ],
    requires: [
        'Penalizaciones.view.Penalizaciones',
        'Penalizaciones.view.WinEditPenalizacion',
        'Penalizaciones.view.WinDetallesPenalizacion',
        'GestionContratoImportacion.view.GestorDocumental.Window',
        'Nomencladores.view.GridToGrid',
    ],
    init: function () {
        var me = this;
        me.arrayContextos = ['penalidad']
        this.etiquetas = LangMgr.getLang(this);
        me.listen({
            store: {
                '#Penalizaciones': {
                    load: this.afterLoadPenalizaciones,
                    beforeload: function () {
                        this.getPenalizaciones().getSelectionModel().clearSelections();
                    }
                }
            },
            component: {
                "gppenalizaciones": {
                    selectionchange: this.onSelectionChangePenalizaciones,
                    itemcontextmenu: this.showContextMenu,
                    afterrender: this.grantActions,
                    render: function (grid) {
                        this.loadConf(grid)
                    },
                    itemdblclick: this.showWinDetallesPenalizacion,
                },
                'gppenalizaciones searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                "fpPenalizacionesanexos fileuploadfield": {
                    change: this.changeFileUploadDocumento,
                    reset: this.resetFileUploadDocumento
                },
                "fpPenalizacionesanexos button[action=delfile]": {
                    click: this.deleteDocumento
                },
                "gppenalizaciones button[action=addpenalizacion], menuitem[action=addpenalizacion]": {
                    click: this.showWinEditPenalizacion
                },
                "gppenalizaciones button[action=modpenalizacion], menuitem[action=modpenalizacion]": {
                    click: this.showWinEditPenalizacion
                },
                "gppenalizaciones button[action=delpenalizacion], menuitem[action=delpenalizacion]": {
                    click: this.eliminarPenalizacion
                },
                "gppenalizaciones button[action=cambiarestadop], menuitem[action=cambiarestadop]": {
                    click: this.changeEstado
                },
                "gppenalizaciones button[action=vertrazaspenalizacion], menuitem[action=vertrazaspenalizacion]": {
                    click: this.showWinEstadoTrazas
                },
                "gppenalizaciones button[action=detallepenalizacion], menuitem[action=detallepenalizacion]": {
                    click: this.showWinDetallesPenalizacion
                },
                "gppenalizaciones button[action=clearfilters]": {
                    click: this.limpiarTodosLosFiltros
                },
                "wineditpenalizacion button[action=aceptar]": {
                    click: this.savePenalizacion
                },
                "wineditpenalizacion button[action=aplicar]": {
                    click: this.savePenalizacion
                },
                "wineditpenalizacion button[action=cerrar]": {
                    click: this.closeWinEditPenalizacion
                },
                'wineditpenalizacion combobox[localId],wineditpenalizacion pickerfield[localId]': {
                    select: this.selectCombo,
                    change: this.changeCombo
                },
                "windetallespenalizacion button[action=cerrar]": {
                    click: this.closeWinDetallesPenalizacion
                },
                'windetallespenalizacion': {
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
        var grid = this.getPenalizaciones(),
            store = grid.getStore(),
            record = grid.getSelectionModel().getSelection()[0],
            estados = [];

        if (!record || !record.data.idestado) {
            return;
        }
        var datos = store.proxy.reader.jsonData.estados_penalizacion;

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
            grid = me.getPenalizaciones(),
            menuEstado = grid.down('#menuestado').menu;
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
                    action: 'cambiarestadop',
                    actions: estado.acciones
                });
            }
        }, this);

        if ((menuEstado.items.length) != 0) grid.down('button[action=cambiarestadopenalizacion]').setDisabled(false);
        else if ((menuEstado.items.length) == 0) {
            grid.down('button[action=cambiarestadopenalizacion]').setDisabled(true);
        }
    },


    afterLoadPenalizaciones: function () {
        var grid = this.getPenalizaciones();
        this.addExtraColumns(grid);
    },

    onSelectionChangePenalizaciones: function (sm, select) {
        var me = this,
            gppenalizaciones = me.getPenalizaciones(),
            menuEstado = gppenalizaciones.down('#menuestado').menu,
            tamaño = select.length;
        // console.log('TAMAÑO',tamaño)
        // console.log('MENU ESTADO',menuEstado)

        if (tamaño == 0) {
            gppenalizaciones.down('button[action=delpenalizacion]').setDisabled(true);
            gppenalizaciones.down('button[action=modpenalizacion]').setDisabled(true);
            gppenalizaciones.down('button[action=detallepenalizacion]').setDisabled(true);
            gppenalizaciones.down('button[action=vertrazaspenalizacion]').setDisabled(true);
            gppenalizaciones.down('button[action=cambiarestadopenalizacion]').setDisabled(true);

        }
        else if (tamaño != 1) {
            gppenalizaciones.down('button[action=modpenalizacion]').setDisabled(true);
            gppenalizaciones.down('button[action=detallepenalizacion]').setDisabled(true);
            gppenalizaciones.down('button[action=vertrazaspenalizacion]').setDisabled(true);
            gppenalizaciones.down('button[action=cambiarestadopenalizacion]').setDisabled(true);
            gppenalizaciones.down('button[action=delpenalizacion]').setDisabled(false);
        }
        else if (tamaño == 1) {
            gppenalizaciones.down('button[action=modpenalizacion]').setDisabled(false);
            gppenalizaciones.down('button[action=detallepenalizacion]').setDisabled(false);
            gppenalizaciones.down('button[action=vertrazaspenalizacion]').setDisabled(false);
            gppenalizaciones.down('button[action=delpenalizacion]').setDisabled(false);
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
            grid = me.getPenalizaciones();
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
        if (this.getPenalizaciones().getStore().proxy.extraParams['filtrogeneral[0][field]']) {
            this.getPenalizaciones().getStore().proxy.extraParams = {};
            this.getPenalizaciones().getStore().load();
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
        var grid = this.getPenalizaciones(),
            actives = grid.filters.getFilterData().length,
            generalFilt = this.getPenalizaciones().getStore().proxy.extraParams['filtrogeneral[0][field]'];
        grid.getStore().proxy.extraParams = {};
        grid.down('searchfield').reset();
        grid.filters.clearFilters();
        if (generalFilt && actives == 0) grid.getStore().load();
    },
    showWinEditPenalizacion: function (button) {
        var me = this, modificar = false,
            height = button.heightWin, width = 850,
            gdactivo = (this.application.gestordocumental && this.application.gestordocumental.activo == "1") ? true : false;

        recordSelected = this.getPenalizaciones().getSelectionModel().getSelection(),
        title = button.tooltip;

        if (button.action == 'modpenalizacion') {
            modificar = true;
        }

        var win = Ext.create('Penalizaciones.view.WinEditPenalizacion', {
            action: button.action,
            title: title,
            height: height,
            width: width,
            idpenalidad: button.action == 'modpenalizacion' ? recordSelected[0].get('idpenalidad') : -1,
            gestordocumental: gdactivo,
            idnaturaleza: me.application.idnaturaleza,
            modificar: modificar
        });

        win.setActionInsert(button.action != 'modpenalizacion')
        win.show();

        if (button.action != 'addpenalizacion') {
            cloneRecord = recordSelected[0].copy();
            Ext.data.Model.id(cloneRecord);
            win.loadValues(cloneRecord);

            console.log('cloneRecord', cloneRecord)

            win.sftipopenalidad.getStore().proxy.extraParams.idtipopenalidad = cloneRecord.get('idtipopenalidad');

            me.cargarCombo(win.sfcontrato, recordSelected[0], win.sfcontrato.name, 'contrato');
            me.cargarCombo(win.sfarribo, recordSelected[0], win.sfarribo.name, 'arribo');
            me.cargarCombo(win.sftipopenalidad, recordSelected[0], win.sftipopenalidad.name, 'tipopenalidad');

            var mask = new Ext.LoadMask(win.down('form'), {msg: this.etiquetas.msgLoading});
            mask.show();
            win.down('form').getForm().findField('idarribo').getStore().on('load', function(){
                mask.hide();
            });

            if (gdactivo) {
                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'getPenalizacionDocs'}, ModuleMgr.get('Penalizaciones')),
                    params: {idespaciotrabajo: recordSelected[0].get('idespaciotrabajo')},
                    success: function (response) {
                        var datos = Ext.decode(response.responseText);
                        if (datos.length > 0)
                            win.docAdicionales.loadDocuments(datos);
                    },
                    failure: function (response) {
                        cargandoAnexos = false;
                    }
                })
            }
        }
    },

    cargarCombo: function (campo, recordSelected, atributo, rawValue, extraParams, extraFunction) {

        // console.log('cargarcombo', campo.name, recordSelected.get(campo.name), atributo, recordSelected.get(atributo))

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
                    campo.resetOriginalValue();
                    if (extraFunction && typeof extraFunction == 'function') extraFunction.call();
                }
            });
        }
    },

    closeWinEditPenalizacion: function () {
        this.getWinEditPenalizacion().close();
    },

    savePenalizacion: function (btn) {
        var me = this;
        win = me.getWinEditPenalizacion(),
            form = win.down('#principal'),
            storePenalizacion = me.getPenalizaciones();
        Ext.MessageBox.show({
            msg: me.etiquetas.msgSaveDataPenalizacion,
            title: me.etiquetas.lbTitleWait,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        params=form.getValues();
        console.log('params', params)

        form.submit({
            url: UtilsFn.buildUrl({action: (win.getActionInsert()) ? 'adicionarPenalizacion' : 'modificarPenalizacion'}, me),
            submitEmptyText: false,
            params: {values: Ext.encode(params)},
            success: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);

                if (response.success) {
                    mostrarMensaje(1, me.etiquetas[(win.getActionInsert()) ? 'msgSuccessInsertPenalizacion' : 'msgSuccessUpdatePenalizacion']);

                    if (btn.action == 'aplicar') win.resetComponents();
                    else if (btn.action == 'aceptar') win.close();
                    if(storePenalizacion)
                        storePenalizacion.getStore().load();
                }
                else {
                    mostrarMensaje(6, 'Comprobar errores de validacion');
                }
            },

            failure: function (form, action) {
                 Ext.MessageBox.hide();
            },
            scope: me
        });
    },
    selectCombo: function (combo, records) {
        var me = this,
            form = combo.up('form'),
            hiddenField = null;

        console.log('COMBO', combo)
        console.log('RECORDS', records)

        switch (combo.name) {
            case 'cliente':
                hiddenField = form.getForm().findField('idcliente');
                break;
            default:
                hiddenField = form.getForm().findField(combo.localId);
        }
        if (hiddenField) {
            console.log('entra')
            hiddenField.setValue(records[0].data[combo.localId]);
            console.log('hiddenField', hiddenField)
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
    showFile: function (btn) {
        var url = btn.up('panel[rowDocument=true]').down('fileuploadfield').urlfile;
        if (url) {
            window.open(url);
        } else {
            mostrarMensaje(1, this.etiquetas.msgErrorNoFile);
        }
    },
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
    },
    eliminarPenalizacion: function () {
        var me = this,
            sm = me.getPenalizaciones().getSelectionModel(),
            selection = me.getPenalizaciones().getSelectionModel().getSelection();
        me.application.keyMap.disable();
        mostrarMensaje(2, me.etiquetas.msgElimPenalizacion + (selection.length > 1 ? me.etiquetas.msgPenalidadP : me.etiquetas.msgPenalidadS), function (response) {
            if (response === 'ok') {
                Ext.MessageBox.show({
                    msg: me.etiquetas.msgElimDataPenalizacion,
                    title: me.etiquetas.lbTitleWait,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                var ids = [];
                sm.getSelection().forEach(function (x) {
                    ids.push(x.get('idpenalidad'));
                });

                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'eliminarPenalizacion'}, me),
                    params: {values: Ext.encode(ids)},
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        me.application.keyMap.enable();
                        var info = Ext.decode(response.responseText);
                        if (info.success) {
                            mostrarMensaje(1, me.etiquetas.msgSuccessDeletePenalizacion);
                            me.getPenalizaciones().getStore().load();
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
    showWinDetallesPenalizacion: function () {
        var recordSelected = this.getPenalizaciones().getSelectionModel().getSelection()[0];
        Ext.create('Penalizaciones.view.WinDetallesPenalizacion').show(recordSelected);
    },
    closeWinDetallesPenalizacion: function () {
        this.getWinDetallesPenalizacion().close();
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
    },
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
                if (x.xtype == 'button' && ['help', 'addpenalizacion', '', undefined, null].indexOf(x.action) == -1) {
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
    },
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
    },

    grantActions: function (grid) {
        this.validateGrantedActions({container: grid});
    },
    changeEstadoAction: function (btn, observacion) {
        var me = this;
        var grid = me.getPenalizaciones();
        record = grid.getSelectionModel().getSelection()[0];

        Ext.MessageBox.show({
            msg: me.etiquetas.lbGuardando,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'cambiarEstadoPenalizacion'}, me),
            params: {
                idpenalidad: record.data.idpenalidad,
                idestado: btn.idestado,
                fechafirma: btn.fechafirma,
                observacion: observacion,
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
                        var grid = me.getPenalizaciones();
                        grid.getStore().load();
                    } else {
                        mostrarMensaje(2, result['msg']);
                    }
                }
            }
        });
    },
    showWinEstadoTrazas: function () {
        var recordSelected = this.getPenalizaciones().getSelectionModel().getSelection()[0];
        var win = Ext.create('Penalizaciones.view.WinPenalizacionEstadoTrazas'),
            store = win.items.first().getStore();
        win.setTitle(this.etiquetas.titleWinVerTrazas);
        win.show();
        store.removeAll();
        store.load({params: {idpenalidad: recordSelected.get('idpenalidad')}});
    },
    showWinHistorico: function () {
        var recordSelected = this.getPenalizaciones().getSelectionModel().getSelection()[0];
        var win = Ext.create('Penalizaciones.view.WindowHistorico'),
            store = win.items.first().getStore();
        win.setTitle(this.etiquetas.titleWinHistorico);
        win.show();
        store.removeAll();
        store.load({params: {idpenalidad: recordSelected.get('idpenalidad')}});
    },

    changeEstado: function(btn){
        var me=this;
        console.log('btn:', btn)
        if(btn.actions.indexOf('justificar')!=-1){
            var win=Ext.create('Ext.window.Window',{
                title: 'Agregar causa',
                layout: 'fit',
                modal: true,
                resizable: true,
                width: 500,
                items:[
                    {
                        xtype: 'form',
                        bodyStyle: {
                            padding: '5px 10px 10px 10px',
                            background: '#DFE9F6'
                        },
                        items:[
                            {
                                xtype: 'textarea',
                                fieldLabel: 'Causa',
                                labelAlign: 'top',
                                itemId: 'causa',
                                name: 'causa',
                                allowBlank: false,
                                anchor: '100%'
                            }
                        ],
                        buttons:[
                            {
                                text: 'Cancelar',
                                iconCls: 'cancelar',
                                tooltip: 'cancelar',
                                handler: function(){
                                    win.close();
                                }
                            },
                            {
                                text: 'Aceptar',
                                iconCls: 'aceptar',
                                tooltip: 'aceptar',
                                formBind: true,
                                handler: function(){
                                    me.changeEstadoAction(btn, win.down('#causa').getValue());
                                    win.close();
                                }
                            }
                        ]
                        // listeners:{
                        //     validitychange: function(yo, valid){
                        //
                        //     }
                        // }
                    }
                ]
            });
            win.show();
        }else{
            mostrarMensaje(2, me.etiquetas.msgCambiarEstado, function (response) {
                if (response === 'ok') {
                    me.changeEstadoAction(btn, null);
                }
            });
        }
    }
});
