Ext.define('SolicitudNegocio.controller.SolicitudNegocio', {
    extend: 'CRM.core.controller.Base',
    views: ['SolicitudNegocio'],
    refs: [
        {ref: 'SolicitudNegocio', selector: 'gpsolicitudnegocio'},
        {ref: 'WinEditSolicitud', selector: 'wineditsolicitud'},
        {ref: 'WinDetallesSolicitud', selector: 'windetallessalocitud'},
        {ref: 'WinEstadoTrazas', selector: 'winestadotrazas'},
        {ref: 'DocumentosAdicionales', selector: 'fpsolicituddocadicionales'}
    ],
    requires: [
        'SolicitudNegocio.view.SolicitudNegocio',
    ],

    init: function () {
        var me = this;

        me.getLang();

        me.listen({

            component: {
                "gpsolicitudnegocio": {
                    // select: this.buttonEnable,
                    // deselect: this.buttonEnable,
                    render: this.onRenderSolicitud,
                    itemcontextmenu: this.showContextMenu,
                    afterrender: this.grantActions,
                    /*render: function (grid) {
                        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);
                    },*/
                    itemdblclick: this.showWinDetallesSolicitud
                },
                'gpsolicitudnegocio searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                "gpsolicitudnegocio button[action=addsolicitud],gpsolicitudnegocio menuitem[action=addsolicitud], menu[itemId=contextMenuSolicitudNegocio] menuitem[action=addsolicitud]": {
                    click: this.showWinEditSolicitud
                },
                "gpsolicitudnegocio button[action=modsolicitud],gpsolicitudnegocio menuitem[action=modsolicitud], menu[itemId=contextMenuSolicitudNegocio] menuitem[action=modsolicitud]": {
                    click: this.showWinEditSolicitud
                },
                "gpsolicitudnegocio button[action=addsolicitudinterna],gpsolicitudnegocio menuitem[action=addsolicitudinterna], menu[itemId=contextMenuSolicitudNegocio] menuitem[action=addsolicitudinterna]": {
                    click: this.showWinEditSolicitudInterna
                },
                "gpsolicitudnegocio button[action=elimsolicitud],gpsolicitudnegocio menuitem[action=elimsolicitud], menu[itemId=contextMenuSolicitudNegocio] menuitem[action=elimsolicitud]": {
                    click: this.eliminarSolicitud
                },
                "gpsolicitudnegocio button[action=verDictamenes],gpsolicitudnegocio menuitem[action=verDictamenes], menu[itemId=contextMenuSolicitudNegocio] menuitem[action=verDictamenes]": {
                    click: this.showverdictamen,
                },
                "gpsolicitudnegocio button[action=detallesolicitud],gpsolicitudnegocio menuitem[action=detallesolicitud], menu[itemId=contextMenuSolicitudNegocio] menuitem[action=detallesolicitud]": {
                    click: this.showWinDetallesSolicitud
                },
                "gpsolicitudnegocio button[action=estadotrazassolicitud],gpsolicitudnegocio menuitem[action=estadotrazassolicitud], menu[itemId=contextMenuSolicitudNegocio] menuitem[action=estadotrazassolicitud]": {
                    click: this.showWinEstadoTrazas
                },
                "gpsolicitudnegocio button[action=clearfilters]": {
                    click: this.limpiarTodosLosFiltros
                },
                "menuitem[action=mostrarofertas]": {
                    click: this.mostrarOfertas
                },
                "wineditsolicitud button[action=aceptar]": {
                    click: this.saveSolicitud
                },
                "wineditsolicitud button[action=aplicar]": {
                    click: this.saveSolicitud
                },
                "wineditsolicitud button[action=cerrar]": {
                    click: this.closeWinEditSolicitud
                },
                'wineditsolicitud combobox[localId],wineditsolicitud pickerfield[localId]': {
                    select: this.selectCombo,
                    change: this.changeCombo
                },
                'wineditsolicitud combobox[name=clienteproveedor]': {
                    select: this.selectCliente
                },
                "wineditsolicitud fileuploadfield": {
                    change: function (field, value) {
                        var row = field.up('panel[rowDocument=true]'),
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
                    reset: function (field) {
                        var row = field.up('panel[rowDocument=true]');

                        row.down('button[action=showfile]').hide();
                        row.down('button[action=delfile]').hide();
                    }
                },
                "wineditsolicitud button[action=showfile]": {
                    click: this.showFile
                },
                "wineditsolicitud button[action=delfile]": {
                    click: this.delFile
                },
                "windetallessalocitud button[action=cerrar]": {
                    click: this.closeWinDetallesSolicitud
                },
                "winestadotrazas  button[action=cerrar]": {
                    click: this.closeWinEstadoTrazas
                },
                'wineditsolicitud': {
                    beforeshow: function () {
                        if(this.application.keyMap)
                            this.application.keyMap.disable();
                    },
                    close: function () {
                        if(this.application.keyMap)
                            this.application.keyMap.enable();
                    }
                },
                'windetallessalocitud': {
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
                'winestadotrazas': {
                    beforeshow: function () {
                        if(this.application.keyMap)
                            this.application.keyMap.disable();
                    },
                    close: function () {
                        if(this.application.keyMap)
                            this.application.keyMap.enable();
                    }
                }
            }
        });
    },
    onSearch: function (field, data) {
        var me = this,
            grid = me.getSolicitudNegocio();
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
        if (this.getSolicitudNegocio().getStore().proxy.extraParams['filtrogeneral[0][field]']) {
            this.getSolicitudNegocio().getStore().proxy.extraParams = {};
            this.getSolicitudNegocio().getStore().load();
        }
    },
    limpiarTodosLosFiltros: function () {
        var grid = this.getSolicitudNegocio(),
            actives = grid.filters.getFilterData().length,
            generalFilt = this.getSolicitudNegocio().getStore().proxy.extraParams['filtrogeneral[0][field]'];
        grid.getStore().proxy.extraParams = {};
        grid.down('searchfield').reset();
        grid.filters.clearFilters();
        if (generalFilt && actives == 0) grid.getStore().load();
    },
    showWinEditSolicitud: function (button) {
        var me = this, cliente = true, context = button.context, tipo = button.tipo, height = button.heightWin,
            recordSelected = this.getSolicitudNegocio().getSelectionModel().getSelection(),
            title = button.tooltip;
        console.log('contratacion:', button, button.up('grid'))
        if (button.action == 'modsolicitud') {
            context = parseInt(recordSelected[0].get('cliente'));
            if (recordSelected[0].get('cliente') == '1') {
                context = 'cliente';
                title = me.etiquetas.lbModificarSNCliente;
                height = 392;
            } else if (recordSelected[0].get('cliente') == '2') {
                context = 'proveedor';
                title = me.etiquetas.lbModificarSNProveedor;
                height = 558;
            } else if (recordSelected[0].get('cliente') == '3') {
                context = 'cliente';
                title = me.etiquetas.lbModificarSNImportacion;
                height = 242;
            }
        }

        var win = Ext.create('SolicitudNegocio.view.WinEditSolicitud', {
            action: button.action,
            title: title,
            cliente: cliente,
            tipo: tipo,
            context: context,
            height: height,
            idsolicitud: button.action == 'modsolicitud' ? recordSelected[0].get('idsolicitud') : -1,
            gestordocumentalactivo: me.application.gestordocumental ? me.application.gestordocumental.activo : false,
            repositorioclientes: me.application.gestordocumental ? me.application.gestordocumental.repositorioclientes : false
        });
        win.setActionInsert(button.action == 'addsolicitud');

        if (button.action == 'addsolicitud') {
            win.show();
            win.sfsector.Lmask = new Ext.LoadMask(win.sfsector.el, {msg: me.etiquetas.msgCargandoValorporDefecto});
            win.cmbarea.Lmask = new Ext.LoadMask(win.cmbarea.el, {msg: me.etiquetas.msgCargandoValorporDefecto});
            win.sfsector.Lmask.show();
            win.cmbarea.Lmask.show();
            me.cargarValoresPorDefecto(win);
            me.cargarNumeroConsecutivo(tipo);
        } else {
            win.show();
            win.loadValues(recordSelected[0]);
            win.down('#descripcion').originalValue = recordSelected[0].get('descripcion');
            win.down('#descripcion').setValue(recordSelected[0].get('descripcion'));
            win.gpareasimpl.getStore().proxy.extraParams = {idsolicitud: recordSelected[0].get('idsolicitud')};
            win.gpareasimpl.getStore().load();
            var cargandoDatosAdicionales = true;
            win.gridProductoServicios.maskL = new Ext.LoadMask(
                win.gridProductoServicios.getEl(), {msg: this.etiquetas.msgLoading});
            win.gridProductoServicios.maskL.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'obtenerProductoServicio'}, ModuleMgr.get('SolicitudNegocio')),
                params: {idsolicitud: recordSelected[0].get('idsolicitud')},
                success: function (response) {
                    cargandoDatosAdicionales = false;
                    if (win.gridProductoServicios.maskL) win.gridProductoServicios.maskL.hide();
                    var datos = Ext.decode(response.responseText);
                    win.gridProductoServicios.getStore().loadData(datos.datos);
                },
                failure: function (response) {
                    cargandoDatosAdicionales = false;
                    if (win.gridProductoServicios.maskL) win.gridProductoServicios.maskL.hide();
                }
            })

            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'getSolicitudDocs'}, ModuleMgr.get('SolicitudNegocio')),
                params: {idespaciotrabajo: recordSelected[0].get('idespaciotrabajo')},
                success: function (response) {
                    var datos = Ext.decode(response.responseText);
                    console.log('datos:', datos)
                    if (datos.length > 0)
                        win.docAdicionales.loadDocuments(datos);
                },
                failure: function (response) {
                    cargandoDatosAdicionales = false;
                    if (win.gridProductoServicios.maskL) win.gridProductoServicios.maskL.hide();
                }
            })
        }
        if (win.panelProveedores) {
            win.panelProveedores.rightGrid.getStore().load();
            win.panelProveedores.leftGrid.getStore().load();
        }
    },
    cargarValoresPorDefecto: function (win) {
        var me = this;
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'obtenerConfiguracionPorDefecto'}, ModuleMgr.get('GestionContrato')),
            success: function (response) {
                var datos = Ext.decode(response.responseText);
                win.sfsector.Lmask.hide();
                win.cmbarea.Lmask.hide();
                if (datos[0] && win) {
                    win.sfsector.setValue(datos[0]['sector']);
                    win.hfsector.setValue(datos[0]['idsector']);
                    win.cmbarea.setValue(datos[0]['nombrearea']);
                    win.hfarea.setValue(datos[0]['idarea']);
                }
            },
            failure: function (response) {
                mostrarMensaje(7, 'No han podido cargarse los datos.')
            }
        });
    },
    showWinEditSolicitudInterna: function (button) {
        // var win=Ext.create();
    },
    closeWinEditSolicitud: function () {
        this.getWinEditSolicitud().close();
    },
    onRenderSolicitud: function () {
        var me = this, grid = this.getSolicitudNegocio();
        var mask = new Ext.LoadMask(
            grid, {msg: this.etiquetas.msgCargandoConfiguracionPermisos});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getConfiguracionPermisos'}, me),
            callback: function (options, success, response) {
                mask.hide();
                var info = Ext.decode(response.responseText);
                // this.application.comite = {
                //     transitions: info.datos.transitions
                // };
                // if (!grid.extrafields) this.addExtraColumns(grid, info.datos.monedasconfig);
                // me.configEstados = info.datos.estados;
                // me.configSolicitud = info.datos.config;
                // grid.getStore().load();
                // console.log(info);
                this.application.gestordocumental = info.gestordoc;
                this.application.notificarinicial = info.notificarinicial;
                // this.application.idestadosolicitud = info.datos.estadosolicitud;
            },
            scope: me
        });
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);
    },
    obtenerProveedores: function () {
        var me = this, win = me.getWinEditSolicitud(), nuevos = [], eliminado = [], olds = [];
        if (win && win.panelProveedores) {
            var store = win.panelProveedores.rightGrid.getStore(),
                all = win.panelProveedores.rightGrid.getStore().getRange(),
                newRecords = win.panelProveedores.rightGrid.getStore().getNewRecords(),
                modified = win.panelProveedores.rightGrid.getStore().getModifiedRecords(),
                removed = win.panelProveedores.rightGrid.getStore().getRemovedRecords();
            all.forEach(function (x) {
                if (store.idsOriginals.indexOf(x.get('idclientesproveedores')) == -1) {
                    nuevos.push(x.get('idclientesproveedores'));
                } else {
                    olds.push(x.get('idclientesproveedores'));
                }
            })
            store.originals.forEach(function (x) {
                if (olds.indexOf(x['idclientesproveedores']) == -1) eliminado.push(x['idsolicitudnegocioproveedor'])
            });
            return {'nuevos': nuevos, 'eliminados': eliminado};
        }
        return null;
    },
    obtenerProductosServicios: function () {
        var me = this, win = me.getWinEditSolicitud(), nuevos = [], eliminado = [];
        var store = win.gridProductoServicios.getStore(),
            all = win.gridProductoServicios.getStore().getRange(),
            newRecords = win.gridProductoServicios.getStore().getNewRecords(),
            modified = win.gridProductoServicios.getStore().getModifiedRecords(),
            removed = win.gridProductoServicios.getStore().getRemovedRecords();
        console.log('modified:', modified)
        console.log('removed:', removed)
        console.log('store.removeItems:', store.removeItems)
        modified.forEach(function (m) {
            if (nuevos.indexOf(m.data) == -1)
                nuevos.push(m.data);
        });
        store.removeItems.forEach(function (r) {
            if (eliminado.indexOf(r.get('idindicadorcontrato')) == -1)
                eliminado.push(r.get('idindicadorcontrato'));
        });
        return {'nuevos': nuevos, 'eliminados': eliminado};
    },
    saveSolicitud: function (btn) {
        var me = this,
            win = me.getWinEditSolicitud(),
            storeSolicitud = me.getSolicitudNegocio().getStore(),
            docForm = win.down('form[tabId=datosadicionales]'),
            notificarinicial=this.application.notificarinicial;
            params = Ext.merge(win.getValues(), {
                descripcion: win.down('#descripcion').getValue(),
                delfile: Ext.encode(docForm.getRemovedRecords()),
                editfile: Ext.encode(docForm.getModifiedRecords()),
                proveedores: me.obtenerProveedores(),
                cliente: win.tipo,
                productosservicios: me.obtenerProductosServicios()
            });
        Ext.MessageBox.show({
            msg: me.etiquetas.msgSaveDataSolicitud,
            title: me.etiquetas.lbTitleWait,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        console.log('params', params)
        docForm.submit({
            url: UtilsFn.buildUrl({action: (win.getActionInsert()) ? 'adicionarSolicitudNegocio' : 'modificarSolicitudNegocio'}, me),
            params: {values: Ext.encode(params)},
            success: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);

                if (response.success) {
                    mostrarMensaje(1, me.etiquetas[(win.getActionInsert()) ? 'msgSuccessInsertSolicitud' : 'msgSuccessUpdateSolicitud']);
                    if(win.getActionInsert()){
                        var actual=notificarinicial[params['cliente']==1?'solicitudnegocio':'solicitudnegocioproveedor'];
                        if(actual && actual['notificar']=='1')
                            me.enviarCorreo({
                                destinatarios: actual['notificaciones'],
                                cuerpo: 'Se ha insertado una nueva '+actual['denominacion'].toLowerCase()+' con número <b style="color:#3158a0">'
                                    +params['numero']+'</b> y nombre <b style="color:#3158a0">'+params['nombre']+'</b>'
                            })
                    }
                    if (btn.action == 'aplicar') {
                        win.resetComponents();
                        me.cargarNumeroConsecutivo(win.tipo);
                    }else
                        win.close();

                    storeSolicitud.load();
                } else {
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
            hiddenField = form.getForm().findField(combo.localId),
            storeAreasImpl = me.getWinEditSolicitud().gpareasimpl.getStore();
        if (storeAreasImpl.find('idestructura', records[0].data[combo.localId]) != -1) {
            mostrarMensaje(6, me.etiquetas.msgErrorAreaImplicadaEqualResponsable);
        } else if (hiddenField) {
            hiddenField.setValue(records[0].data[combo.localId]);
        }
    },
    changeCombo: function (combo, value, oldvalue) {
        var me = this,
            form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId),
            storeAreasImpl = me.getWinEditSolicitud().gpareasimpl.getStore();

        if (storeAreasImpl.find('area', value) != -1) {
            combo.setValue(oldvalue);
        }
        if (hiddenField && Ext.isEmpty(value)) {
            hiddenField.setValue('');
        }
    },
    showFile: function (btn) {
        var url = btn.up('panel[rowDocument=true]').down('fileuploadfield').urlfile;
        if (url) {
            //window.open(url);
			window.open('/crm/contratacion/index.php/gestioncontrato/getDocumentos?idnodo='+url);
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
    eliminarSolicitud: function () {
        var me = this,
            sm = me.getSolicitudNegocio().getSelectionModel();
        me.application.keyMap.disable();
        mostrarMensaje(2, me.etiquetas.msgElimSolicitud, function (response) {
            if (response === 'ok') {
                var ids = [];
                sm.getSelection().forEach(function (x) {
                    ids.push(x.get('idsolicitud'));
                });

                Ext.MessageBox.show({
                    msg: me.etiquetas.msgElimDataSolicitud,
                    title: me.etiquetas.lbTitleWait,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'eliminarSolicitudNegocio'}, me),
                    params: {values: Ext.encode(ids)},
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        me.application.keyMap.enable();
                        var info = Ext.decode(response.responseText);

                        if (info.success) {
                            mostrarMensaje(1, me.etiquetas.msgSuccessDeleteSolicitud);
                            me.getSolicitudNegocio().getStore().load();
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
    showWinDetallesSolicitud: function () {
        var recordSelected = this.getSolicitudNegocio().getSelectionModel().getSelection()[0];
        Ext.create('SolicitudNegocio.view.WinDetallesSolicitud').show(recordSelected);
    },
    closeWinDetallesSolicitud: function () {
        this.getWinDetallesSolicitud().close();
    },
    getWinEstadoTrazas: function () {
        return Ext.create('SolicitudNegocio.view.WinEstadoTrazas')
    },
    showWinEstadoTrazas: function () {
        var win = this.getWinEstadoTrazas(),
            recordSelected = this.getSolicitudNegocio().getSelectionModel().getSelection()[0],
            store = win.items.first().getStore();

        win.setTitle(this.etiquetas.titleWinEstadoTrazas + ' #' + recordSelected.get('idsolicitud'));
        win.show();

        store.removeAll();
        store.load({params: {idsolicitud: recordSelected.get('idsolicitud')}})
    },
    closeWinEstadoTrazas: function () {
        this.getWinEstadoTrazas().close();
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
                if (!config.hidden) {
                    if (x.selector == 'mostrarofertas') {
                        config.hidden = select[0].get('cantofertas') == 0 || select[0].get('cantofertas') == null;
                    }
                }
                if (!config.hidden)
                    items.push(config);
            }
        });
        if (tbar) {
            tbar.forEach(function (x) {
                if (x.xtype == 'button' && ['help', 'cambiarestadosolicitud', 'addsolicitud', '', undefined, null].indexOf(x.action) == -1) {
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
            itemId: 'contextMenuSolicitudNegocio',
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
    mostrarOfertas: function (button) {
        var me = this,
            grids = this.getSolicitudNegocio(),
            select = grids.getSelectionModel().getSelection();

        function mostrarTooltipColumna(value, meta) {
            if (value)
                meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }

        var grid = Ext.create('Ext.grid.Panel', {
            viewConfig: {
                stripeRows: false,
                getRowClass: function (record, rowIndex, rowParams, store) {
                    if (record.get('idcontrato')) return 'escontrato';
                    return '';
                }
            },
            store: Ext.create('OfertaNegocio.store.OfertaNegocio', {
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'getOfertasNegocio'}, ModuleMgr.get('OfertaNegocio')),
                    actionMethods: {read: 'POST'},
                    reader: {
                        root: 'datos',
                        totalProperty: 'cantidad',
                        successProperty: 'success'
                    },
                    extraParams: {idsolicitud: select[0].get('idsolicitud')}
                },
            }),
            columns: [
                {text: me.etiquetas.lbNumero, dataIndex: 'numero', width: 50, renderer: mostrarTooltipColumna},
                {text: me.etiquetas.lbFieldNombre, dataIndex: 'nombre', flex: 1, renderer: mostrarTooltipColumna},
                {
                    text: me.etiquetas.lbFieldClienteProveedor,
                    dataIndex: 'clienteproveedor',
                    flex: 1,
                    renderer: mostrarTooltipColumna
                },
                {
                    text: 'Monto', dataIndex: 'montototal', width: 90,
                    renderer: function (value, meta, record) {
                        if (value) {
                            meta.tdAttr = 'data-qtip="' + Ext.util.Format.number(value, '0.000,00/i') + '"';
                        }

                        return Ext.util.Format.number(value, '0.000,00/i');
                    }
                },
                {
                    text: me.etiquetas.lbFieldCliente, dataIndex: 'cliente', width: 55, minWidth: 55,
                    renderer: function (value, meta) {
                        meta.innerCls = value == '1' ? "icondistra-perfilusuario" :
                            "icondistra-servicio";
                        meta.tdAttr = 'data-qtip="' + (value == '1' ? me.etiquetas.lbFieldCliente :
                            me.etiquetas.lbFieldProveedor) + '"';
                    }
                },
                {
                    text: me.etiquetas.lbEstado, width: 100, dataIndex: 'estado',
                    renderer: function (value, meta) {
                        meta.innerCls = "icondistra-" + meta.record.data.estadoicon;
                        meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }
            ],
            selModel: Ext.create('Ext.selection.RowModel', {
                listeners: {
                    selectionchange: function (sm, records) {
                        grid.down('#detallesoferta').setDisabled(records.length != 1);
                        grid.down('#vercontrato').setDisabled(records.length != 1 || !records[0].get('idcontrato'));
                    }
                }
            }),
            tbar: [
                {
                    text: me.etiquetas.lbBtnDetalles,
                    tooltip: me.etiquetas.ttipWinDetallesOferta,
                    iconCls: 'icondistra-detalles',
                    itemId: 'detallesoferta',
                    disabled: true,
                    handler: function () {
                        var recordSelected = grid.getSelectionModel().getSelection()[0];
                        var cloneRecord = recordSelected.copy();
                        Ext.data.Model.id(cloneRecord);
                        Ext.Object.each(cloneRecord.data, function (key, value) {
                            if (key != 'idsolicitud' && (value == '' || value == undefined)) {
                                cloneRecord.set(key, '<span style="color:gray">No definido</span>')
                            }
                            if (key == 'idsolicitud' && value) {
                                cloneRecord.set(key, '# ' + value + ' - ')
                            }
                        })
                        Ext.create('OfertaNegocio.view.WinDetallesOferta').show(cloneRecord);
                    }
                },
                {
                    text: me.etiquetas.lbVerContrato,
                    tooltip: me.etiquetas.qtipVerContrato,
                    iconCls: 'icondistra-detalles',
                    itemId: 'vercontrato',
                    disabled: true,
                    handler: function () {
                        var record = grid.getSelectionModel().getSelection()[0];
                        if (record.get('idcontrato')) {
                            me.cargandoDatosContrato = record.get('idcontrato');
                            var mask = new Ext.LoadMask(grid.down('#vercontrato').el,
                                {msg: me.etiquetas.msgCargando});
                            mask.show();
                            Ext.Ajax.request({
                                url: UtilsFn.buildUrl({action: 'obtenerDatosContrato'}, ModuleMgr.get('ReporteContratacion')),
                                params: {idcontrato: record.get('idcontrato')},
                                success: function (response) {
                                    mask.hide();
                                    me.cargandoDatosContrato = null;
                                    var datos = Ext.decode(response.responseText);
                                    record = {
                                        data: datos,
                                        getData: function () {
                                            return datos
                                        },
                                        get: function (field) {
                                            return datos[field];
                                        }
                                    };
                                    Ext.create('GestionContrato.view.DetailsWindow').show(record);
                                },
                                failure: function (response) {
                                    mask.hide();
                                    me.cargandoDatosContrato = null;
                                    mostrarMensaje(7, 'No han podido cargarse los datos.')
                                }
                            });
                        }
                    }
                }
            ]
        });
        var win = Ext.create('Ext.window.Window', {
            title: me.etiquetas.lbOfertasnegocioAsociadas,
            width: window.innerWidth * 0.9,
            height: 500,
            layout: 'fit',
            items: grid,
            buttons: [
                {
                    text: 'Cerrar',
                    iconCls: 'icondistra-cerrar',
                    handler: function () {
                        win.close();
                    }
                }
            ]
        });
        win.show();
    },
    grantActions: function (grid) {
        this.validateGrantedActions({container: grid});
    },

    showverdictamen: function () {
        var grid = this.getSolicitudNegocio(),
            store = grid.getStore(),
            record = grid.getSelectionModel().getSelection()[0];
            id = record.data.idsolicitud;

        Ext.create('Comite.view.OpinionsWindow', {
            title: this.etiquetas.lbVerDictamenes,
            params: {
                id: id,
                tipo: 3,
                todos: 1,
                proceso: 'solicitudnegocio'
            },
            data: record.data
        }).show();
    },

    buttonEnable: function () {
        var me = this,
            grid = me.getSolicitudNegocio(),
            selection = grid.getSelectionModel().getSelection(),
            len = selection.length;
        // console.log('gpsolicitudnegocio:', grid.down('#dictamenes'));
        grid.down('#dictamenes').setDisabled(len != 1);
    },
    selectCliente: function(combo, records){
        var me=this, win=combo.up('window');
        if(records.length>0){
            win.sfsector.setValue(records[0].get('sector'));
            win.hfsector.setValue(records[0].get('idsector'));
        }
    },
    cargarNumeroConsecutivo: function (tipo) {
        console.log('cargarNumeroConsecutivo2', tipo)
        var me = this, win = me.getWinEditSolicitud();
        if (win.tfNumero && win.tfNumero.isVisible()) {
            win.tfNumero.maskL = new Ext.LoadMask(
                win.tfNumero.getEl(), {msg: this.etiquetas.msgLoading});
            win.tfNumero.maskL.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'obtenerConsecutivo'}, ModuleMgr.get('SolicitudNegocio')),
                params: {tipo: tipo},
                success: function (response) {
                    win.tfNumero.maskL.hide();
                    var datos = Ext.decode(response.responseText);
                    // console.log('datos:', datos)
                    win.tfNumero.setValue(datos);
                },
                failure: function (response) {
                    win.numero.setDisabled(false);
                }
            })
        }
    },
});
