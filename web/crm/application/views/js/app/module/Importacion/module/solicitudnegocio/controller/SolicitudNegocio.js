Ext.define('SolicitudNegocioImportacion.controller.SolicitudNegocio', {
    extend: 'CRM.core.controller.Base',
    views: ['SolicitudNegocio'],
    refs: [
        {ref: 'SolicitudNegocio', selector: 'gpsolicitudnegocioimportacion'},
        {ref: 'WinEditSolicitud', selector: 'wineditsolicitudimportacion'},
        {ref: 'WinDetallesSolicitud', selector: 'windetallessalocitudimportacion'},
        {ref: 'WinEstadoTrazas', selector: 'winestadotrazasimportacion'},
        {ref: 'DocumentosAdicionales', selector: 'fpsolicituddocadicionalesimportacion'}
    ],
    requires: [
        'GestionContratoImportacion.view.GridEstadoTrazas'
    ],
    init: function () {
        var me = this;

        me.getLang();

        me.listen({
            component: {
                "gpsolicitudnegocioimportacion": {
                    render: this.onRenderSolicitud,
                    itemcontextmenu: this.showContextMenu,
                    afterrender: this.grantActions,
                    /*render: function (grid) {
                        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);
                    },*/
                    itemdblclick: this.showWinDetallesSolicitud
                },
                'gpsolicitudnegocioimportacion searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                "gpsolicitudnegocioimportacion button[action=addsolicitud],gpsolicitudnegocioimportacion menuitem[action=addsolicitud], menu[itemId=contextMenuSolicitudImportacion] menuitem[action=addsolicitud]": {
                    click: this.showWinEditSolicitud
                },
                "gpsolicitudnegocioimportacion button[action=modsolicitud],gpsolicitudnegocioimportacion menuitem[action=modsolicitud], menu[itemId=contextMenuSolicitudImportacion] menuitem[action=modsolicitud]": {
                    click: this.showWinEditSolicitud
                },
                "gpsolicitudnegocioimportacion button[action=addsolicitudinterna],gpsolicitudnegocioimportacion menuitem[action=addsolicitudinterna], menu[itemId=contextMenuSolicitudImportacion] menuitem[action=addsolicitudinterna]": {
                    click: this.showWinEditSolicitudInterna
                },
                "gpsolicitudnegocioimportacion button[action=elimsolicitud],gpsolicitudnegocioimportacion menuitem[action=elimsolicitud], menu[itemId=contextMenuSolicitudImportacion] menuitem[action=elimsolicitud]": {
                    click: this.eliminarSolicitud
                },
                "gpsolicitudnegocioimportacion button[action=detallesolicitud],gpsolicitudnegocioimportacion menuitem[action=detallesolicitud], menu[itemId=contextMenuSolicitudImportacion] menuitem[action=detallesolicitud]": {
                    click: this.showWinDetallesSolicitud
                },
                "gpsolicitudnegocioimportacion button[action=estadotrazassolicitud],gpsolicitudnegocioimportacion menuitem[action=estadotrazassolicitud], menu[itemId=contextMenuSolicitudImportacion] menuitem[action=estadotrazassolicitud]": {
                    click: this.showWinEstadoTrazas
                },
                "gpsolicitudnegocioimportacion button[action=crearcontrademanda],gpsolicitudnegocioimportacion menuitem[action=crearcontrademanda], menu[itemId=contextMenuSolicitudImportacion] menuitem[action=crearcontrademanda]": {
                    click: this.showWinEditSolicitud
                },
                "gpsolicitudnegocioimportacion button[action=clearfilters]": {
                    click: this.limpiarTodosLosFiltros
                },
                "menuitem[action=mostrarofertas]": {
                    click: this.mostrarOfertas
                },
                "wineditsolicitudimportacion button[action=aceptar]": {
                    click: this.saveSolicitud
                },
                "wineditsolicitudimportacion button[action=aplicar]": {
                    click: this.saveSolicitud
                },
                "wineditsolicitudimportacion button[action=cerrar]": {
                    click: this.closeWinEditSolicitud
                },
                "gpsolicitudnegocioimportacion button[action=exportarExcel],gpsolicitudnegocioimportacion menuitem[action=exportarExcel], menu[itemId=contextMenuSolicitudImportacion] menuitem[action=exportarExcel]": {
                    click: this.exportarExcel
                },
                "gpsolicitudnegocioimportacion button[action=exportarWord],gpsolicitudnegocioimportacion menuitem[action=exportarWord], menu[itemId=contextMenuSolicitudImportacion] menuitem[action=exportarWord]": {
                    click: this.exportarWord
                },
                'wineditsolicitudimportacion combobox[localId],wineditsolicitudimportacion pickerfield[localId]': {
                    select: this.selectCombo,
                    change: this.changeCombo
                },
                "wineditsolicitudimportacion fileuploadfield": {
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
                "wineditsolicitudimportacion button[action=showfile]": {
                    click: this.showFile
                },
                "wineditsolicitudimportacion button[action=delfile]": {
                    click: this.delFile
                },
                "windetallessalocitudimportacion button[action=cerrar]": {
                    click: this.closeWinDetallesSolicitud
                },
                "winestadotrazasimportacion  button[action=cerrar]": {
                    click: this.closeWinEstadoTrazas
                },
                'wineditsolicitudimportacion, windetallessalocitudimportacion, winestadotrazasimportacion': {
                    beforeshow: function () {
                        if(this.application.keyMap)
                            this.application.keyMap.disable();
                    },
                    close: function () {
                        if(this.application.keyMap)
                            this.application.keyMap.enable();
                    }
                },
                'wineditsolicitudimportacion combobox[name=idpadre]': {
                    select: me.selectSolicitudNegocio
                },
                'wineditsolicitudimportacion combobox[name=idtipolineaselect]': {
                    select: me.selectTipoLinea,
                    change: me.changeTipoLinea,
                },
                'wineditsolicitudimportacion combobox[name=idlineaselect]': {
                    select: me.selectLineaDemanda,
                    change: me.changeLineaDemanda
                },
                'wineditsolicitudimportacion grid[itemId=griddemandas]': {
                    selectionchange: me.seleccionarDemanda
                },
                'wineditsolicitudimportacion button[action=agregardemanda]': {
                    click: me.agregarDemanda
                },
                'wineditsolicitudimportacion button[action=quitardemanda]': {
                    click: me.quitarDemanda
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
        var me = this, cliente = true, context = button.context, tipo = button.tipo,idclientesproveedores='',
            height = button.heightWin, width = 850,
            recordSelected = this.getSolicitudNegocio().getSelectionModel().getSelection(),
            title = button.tooltip, filtros = button.filtros, verMotivo = false;
        console.log('importacion:', button, button.up('grid'))
        if (button.action == 'modsolicitud') {
            tipo = parseInt(recordSelected[0].get('cliente'));
            idclientesproveedores = recordSelected[0].get('idclienteproveedor');
            if (recordSelected[0].get('cliente') == '1') {
                context = 'cliente';
                title = me.etiquetas.lbModificarSNCliente;
                height = 475;
            } else if (recordSelected[0].get('cliente') == '2') {
                context = 'proveedor';
                title = me.etiquetas.lbModificarSNProveedor;
                height = 645;
            } else if (recordSelected[0].get('cliente') == '3') {
                if (recordSelected[0].get('idpadre')) verMotivo = true;
                context = 'cliente';
                title = me.etiquetas.lbModificarSNDemanda;
                height = 330;
                filtros = {'idnaturaleza': me.application.idnaturaleza};
            } else if (recordSelected[0].get('cliente') == '4') {
                context = 'proveedor';
                title = me.etiquetas.lbModificarSNImportacion;
                height = 476;
            }
        }
        // else if (button.action == 'crearcontrademanda') {
        //     verMotivo=true;
        //     tipo=parseInt(recordSelected[0].get('cliente'));
        //     context='cliente';
        //     title = me.etiquetas.lbBtnContraDemanda;
        //     height=330;
        //     filtros={'idnaturaleza': me.application.idnaturaleza};
        // }
        // console.log('filtros:', filtros)
        var win = Ext.create('SolicitudNegocioImportacion.view.WinEditSolicitud', {
            action: button.action,
            title: title,
            cliente: cliente,
            idclientesproveedores: idclientesproveedores,
            context: context,
            tipo: tipo,
            height: 515,
            // height: window.innerHeight*0.8,
            minHeight: 515,
            maxHeight: 650,
            width: window.innerWidth*0.8,
            minWidth: 900,
            maxWidth: 1200,
            resizable: true,
            // resizeHandles: 'w e',
            idsolicitud: button.action == 'modsolicitud' ? recordSelected[0].get('idsolicitud') : -1,
//             gestordocumentalactivo: me.application.gestordocumental.activo
            gestordocumentalactivo: me.application.gestordocumental ? me.application.gestordocumental.activo : false,
            idnaturaleza: me.application.idnaturaleza,
            filtros: filtros,
            idestadosolicitud: me.application.idestadosolicitud,
            verMotivo: verMotivo,
            monedasentidad: this.application.monedasentidad
        });
        win.setActionInsert(button.action != 'modsolicitud');
        win.show();
        if (tipo == '4' && !me.application.idestadosolicitud) {
            win.sfsolicituddemanda.setReadOnly(true);
            win.sfsolicituddemanda.setEditable(false);
            // mostrarMensaje(8, me.etiquetas.msgNoConfiguradoEstadoInsertar);
            var tip = Ext.create('Ext.tip.ToolTip', {
                target: win.sfsolicituddemanda.getEl(),
                html: me.etiquetas.msgNoConfiguradoEstadoInsertar,
                autoDestroy: true
            });
            tip.showBy(win.sfsolicituddemanda.getEl(), 't');
        }
        if (button.action == 'addsolicitud') {
            win.sfsector.Lmask = new Ext.LoadMask(win.sfsector.el, {msg: me.etiquetas.msgCargandoValorporDefecto});
            win.cmbarea.Lmask = new Ext.LoadMask(win.cmbarea.el, {msg: me.etiquetas.msgCargandoValorporDefecto});
            win.sfsector.Lmask.show();
            win.cmbarea.Lmask.show();
            // sessionStorage.setItem('lily', false);
            me.cargarValoresPorDefecto(win);
            // if (tipo == '3' || tipo == '4') {
            me.cargarNumeroConsecutivo(tipo);
            // }
        } else {
            var cloneRecord = recordSelected[0].copy();
            Ext.data.Model.id(cloneRecord);
            cloneRecord.set('idlinea', null);
            cloneRecord.set('idtipolinea', null);
            cloneRecord.set('idpadre', null);

            if (win.tipo == 4) {
                // if (win.panelProveedores.stLeft.isLoading()) {
                //     Ext.Ajax.abort(win.panelProveedores.stLeft.proxy.activeRequest);
                //     delete win.panelProveedores.stLeft.proxy.activeRequest;
                // }
                win.panelProveedores.stLeft.proxy.extraParams.idlinea = recordSelected[0].get('idlinea');
                win.panelProveedores.stLeft.load();
                me.cargarCombo(win.sflineaSelect, recordSelected[0], 'idlinea', 'linea');
                win.sflineaSelect.ultimoValor = recordSelected[0].get('idlinea');
                me.changeLinea(recordSelected[0].get('idlinea'), recordSelected[0].get('idsolicitud'));
                win.sftipolineaSelect.getStore().proxy.extraParams.idlinea = recordSelected[0].get('idlinea');
                win.filtros = {
                    'idnaturaleza': win.idnaturaleza,
                    'node': recordSelected[0].get('idlinea')
                }
            }
            win.loadValues(cloneRecord);
            win.down('#objeto').setValue(cloneRecord.get('objeto'));
            win.sflinea.getStore().proxy.extraParams.idclienteproveedor = cloneRecord.get('idclienteproveedor');
            win.sflinea.getStore().proxy.extraParams.soloLineas = true;
            win.sftipolinea.getStore().proxy.extraParams.idclienteproveedor = cloneRecord.get('idclienteproveedor');
            me.cargarCombo(win.sflinea, recordSelected[0], win.sflinea.name, 'linea'
                           );
            me.cargarCombo(win.sftipolinea, recordSelected[0], win.sftipolinea.name, null, {
                // 'idclienteproveedor': recordSelected[0].get('idclienteproveedor'),
                'idlinea': recordSelected[0].get('idlinea')
            });
            win.down('#descripcion').originalValue = recordSelected[0].get('descripcion');
            win.down('#descripcion').setValue(recordSelected[0].get('descripcion'));
            win.gpareasimpl.getStore().proxy.extraParams = {idsolicitud: recordSelected[0].get('idsolicitud')};
            win.gpareasimpl.getStore().load();
            var cargandoDatosAdicionales = true;
            win.gridProductoServicios.maskL = new Ext.LoadMask(
                win.gridProductoServicios.getEl(), {msg: this.etiquetas.msgLoading});
            win.gridProductoServicios.maskL.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'obtenerProductoServicio'}, ModuleMgr.get('SolicitudNegocioImportacion')),
                params: {idsolicitud: recordSelected[0].get('idsolicitud')},
                success: function (response) {
                    cargandoDatosAdicionales = false;
                    if (win.gridProductoServicios.maskL) win.gridProductoServicios.maskL.hide();
                    var datos = Ext.decode(response.responseText);
                    // if(button.action == 'crearcontrademanda'){
                    //     datos.datos.forEach(function(x){
                    //         x['idindicadorcontrato']='';
                    //     })
                    // }
                    win.gridProductoServicios.getStore().loadData(datos.datos);
                    if (win.tipo == 4) win.gridProductoServiciosFinal.getStore().loadData(datos.datos);
                },
                failure: function (response) {
                    cargandoDatosAdicionales = false;
                    if (win.gridProductoServicios.maskL) win.gridProductoServicios.maskL.hide();
                }
            });

            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'getSolicitudDocs'}, ModuleMgr.get('SolicitudNegocioImportacion')),
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

    cargarNumeroConsecutivo: function (tipo) {
        console.log('cargarNumeroConsecutivo2', tipo)
        var me = this, win = me.getWinEditSolicitud();
        if (win.tfNumero && win.tfNumero.isVisible()) {
            win.tfNumero.maskL = new Ext.LoadMask(
                win.tfNumero.getEl(), {msg: this.etiquetas.msgLoading});
            win.tfNumero.maskL.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'obtenerConsecutivo'}, ModuleMgr.get('SolicitudNegocioImportacion')),
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
    cargarCombo: function (campo, recordSelected, atributo, rawValue, extraParams, extraFunction) {
        console.log('cargarcombo', campo.name, recordSelected.get(campo.name), atributo, recordSelected.get(atributo))
        if (recordSelected.get(atributo)) {
            if (rawValue) campo.setRawValue(recordSelected.get(rawValue));
            campo.mask = new Ext.LoadMask(campo, {msg: this.etiquetas.msgLoading});
            campo.mask.show();
            if (extraParams) campo.getStore().proxy.extraParams = extraParams;
            campo.getStore().load({
                callback: function (records, operation, success) {
                    console.log('callback:', recordSelected.get(campo.name), records)
                    campo.mask.hide();
                    campo.select(recordSelected.get(atributo));
                    campo.setDisabled(false);
                    // win.sflinea.fireEvent('change', win.sflinea);
                    campo.resetOriginalValue();
                    if (extraFunction && typeof extraFunction == 'function') extraFunction.call();
                }
            });
        }
    },
    cargarValoresPorDefecto: function (win) {
        var me = this;
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'obtenerConfiguracionPorDefecto'}, ModuleMgr.get('GestionContratoImportacion')),
            success: function (response) {
                var datos = Ext.decode(response.responseText);
                win.sfsector.Lmask.hide();
                win.cmbarea.Lmask.hide();
                if (datos[0] && win) {
                    win.sfsector.setValue(datos[0]['sector']);
                    win.hfsector.setValue(datos[0]['idsector']);
                    win.sfclienteproveedor.setValue(datos[0]['clienteproveedor']);
                    win.hfclienteproveedor.setValue(datos[0]['idclientesproveedores']);
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
            url: UtilsFn.buildUrl({action: 'getConfiguracionEstados'}, me),
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
                console.log(info);
                this.application.gestordocumental = info.datos.conf;
                this.application.idestadosolicitud = info.datos.conf.solicituddemandalista;
                this.application.idnaturaleza = info.datos.naturaleza;
                this.application.monedasentidad = info.datos.monedasconfig;
                this.application.estadolistodemanda = info.datos.estadolistodemanda;
                this.application.comite = {
                    transitions: info.datos.transitions
                };
                // me.getSolicitudNegocio().down('#addsolicituddemanda').filtros={'idnaturaleza': info.datos.naturaleza};
                // this.application.planificacion = info.datos.planificacion;
                // this.application.idestadosolicitud = info.datos.estadosolicitud;
                // me.getSolicitudNegocio().getStore().load();
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
        // console.log('modified:', modified)
        // console.log('removed:', removed)
        // console.log('store.removeItems:', store.removeItems)
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
    obtenerDemandas: function () {
        var me = this,
            win = me.getWinEditSolicitud(), seleccionados = [], nuevos = [], eliminado = [];
        if (win.gridDemandas) {
            win.gridDemandas.getStore().getRange().forEach(function (x) {
                if (x.get('seleccionado')) seleccionados.push(x.get('idsolicitud'));
            })
        }
        return seleccionados;
    },
    saveSolicitud: function (btn) {
        var me = this,
            win = me.getWinEditSolicitud(),
            storeSolicitud = me.getSolicitudNegocio().getStore(),
            docForm = win.down('form[tabId=datosadicionales]'),
            params = Ext.merge(win.getValues(), {
                objeto: win.down('#objeto').getValue(),
                delfile: Ext.encode(docForm.getRemovedRecords()),
                editfile: Ext.encode(docForm.getModifiedRecords()),
                proveedores: me.obtenerProveedores(),
                cliente: win.tipo,
                idclienteproveedor: win.idclientesproveedores,
                productosservicios: me.obtenerProductosServicios(),
                demandas: me.obtenerDemandas()
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

                    if (btn.action == 'aplicar') {
                        win.resetComponents();
                        me.cargarNumeroConsecutivo(win.tipo);
                    } else
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
        Ext.create('SolicitudNegocioImportacion.view.WinDetallesSolicitud').show(recordSelected);
    },
    closeWinDetallesSolicitud: function () {
        this.getWinDetallesSolicitud().close();
    },
    getWinEstadoTrazas: function () {
        return Ext.create('SolicitudNegocioImportacion.view.WinEstadoTrazas')
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
            itemId: 'contextMenuSolicitudImportacion',
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
            store: Ext.create('OfertaNegocioImportacion.store.OfertaNegocio', {
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'getOfertasNegocio'}, ModuleMgr.get('OfertaNegocioImportacion')),
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
                        Ext.create('OfertaNegocioImportacion.view.WinDetallesOferta').show(cloneRecord);
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
                                    Ext.create('GestionContratoImportacion.view.DetailsWindow').show(record);
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
    selectSolicitudNegocio: function (combo, records) {
        console.log('select', combo.getValue())
        var me = this,
            win = me.getWinEditSolicitud(),
            form = combo.up('form');
        if (combo.getValue()) {
            if (records.length > 0) {
                console.log('record', records)
                win.cmbarea.setValue(records[0].data.arearesponsable);
                win.hfarea.setValue(records[0].data.idarearesponsable);
                win.tfNombre.setValue(records[0].data.nombre);
                // me.hflinea.setValue(records[0].data.idlinea);
                me.cargarCombo(win.sflinea, records[0], win.sflinea.name, 'linea'
                    // 'idclienteproveedor': records[0].get('idclienteproveedor'),
                    // 'soloLineas': true
                );
                me.cargarCombo(win.sftipolinea, records[0], win.sftipolinea.name, 'tipolinea', {
                    // 'idclienteproveedor': records[0].get('idclienteproveedor'),
                    'idlinea': records[0].get('idlinea')
                });
                // win.sflinea.setValue(records[0].data.linea);
                // me.hftipolinea.setValue(records[0].data.idtipolinea);
                // win.sftipolinea.setValue(records[0].data.tipolinea);
                // me.down('form').getForm().loadRecord(records[0]);
                win.panelProveedores.stLeft.proxy.extraParams.idlinea = records[0].data.idlinea;
                win.panelProveedores.stLeft.load();
            }
            var cargandoDatosAdicionales = true;
            win.gridProductoServicios.on('render', function (yo) {
                if (cargandoDatosAdicionales) {
                    win.gridProductoServicios.maskL = new Ext.LoadMask(
                        win.gridProductoServicios.down('tabpanel'), {msg: this.etiquetas.msgLoading});
                    win.gridProductoServicios.maskL.show();
                }
            });
            var maskWin = new Ext.LoadMask(
                win.el, {msg: this.etiquetas.msgCargandoDatosSolicitud});
            maskWin.show();
            Ext.Ajax.request({
                params: {idsolicitud: parseInt(records[0].get('idsolicitud'))},
                url: UtilsFn.buildUrl({action: 'obtenerProductoServicio'}, ModuleMgr.get('SolicitudNegocioImportacion')),
                callback: function (options, success, response) {
                    var datos = Ext.decode(response.responseText);
                    cargandoDatosAdicionales = false;
                    if (win.gridProductoServicios.maskL) win.gridProductoServicios.maskL.hide();
                    maskWin.hide();
                    datos.datos.forEach(function (x) {
                        x['idindicadorcontrato'] = '';
                        x['precio'] = '';
                        x['preciodivisa'] = '';
                    });
                    win.gridProductoServicios.getStore().dataCargada = datos.datos;
                    win.gridProductoServicios.getStore().loadData(datos.datos);
                    // win.gridProductoServicios.fireEvent('update', win.gridProductoServicios);
                    // win.formaPago.indicadores.datosIndicadoresSolicitud=datos.datos;
                    win.gridProductoServicios.getStore().dataCargada = win.gridProductoServicios.getStore().getRange();
                    // win.gridProductoServicios.cambiarMontosPorHitosIndicadores();
                    // win.formaPago.calcularTotalMontosIndicadoresDetallados();
                }
            });
        } else {
            // form.queryBy(function(x){
            //     if(x.name!='numero'){
            //         x.reset();
            //     }
            // });
            // form.getForm().findField('clienteproveedor').filters= {
            //     idtipo: win.context == 'cliente' ? 1 : 2,
            //     idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun,
            // }
            // form.getForm().findField('clienteproveedor').getStore().load();
        }
    },
    crearContrademanda: function () {
        var me = this;
    },
    changeTipoLinea: function (yo) {
        var me = this,
            win = me.getWinEditSolicitud();

        var pos = yo.store.findExact('idtipolinea', yo.getValue());
        // var record = yo.findRecordByValue(yo.getValue());
        // console.log('change:', pos, yo.getValue())
        if (pos == -1) {
            win.sftipolinea.setValue('');
        }
    },
    selectTipoLinea: function (yo) {
        var me = this,
            win = me.getWinEditSolicitud();
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
    changeLineaDemanda: function (yo) {
        console.log('changeLineaDemanda:', yo.getValue())
        var me = this,
            win = me.getWinEditSolicitud();
        var pos = yo.store.findExact('idindicador', yo.getValue());
        // var record = yo.findRecordByValue(yo.getValue());
        // console.log('change:', pos, yo.getValue())
        win.sftipolineaSelect.setDisabled(pos == -1);
        if (pos == -1) {
            win.sftipolineaSelect.getStore().proxy.extraParams.idlinea = null;
            win.filtros = {'idnaturaleza': me.idnaturaleza,}
            win.sftipolineaSelect.getStore().load();
        }
        // yo.fireEvent('select', yo);
    },
    selectLineaDemanda: function (yo) {
        console.log('selectLineaDemanda:', yo.getValue())
        var me = this,
            win = me.getWinEditSolicitud();
        if (yo.getValue()) {
            // win.sflinea.setValue(yo.getValue());
            if (win.gridProductoServiciosFinal.getStore().getCount() > 0) {
                var dialog = Ext.create('Ext.window.MessageBox', {
                    buttonAlign: 'center',
                    buttons: [
                        {
                            text: 'Aceptar',
                            iconCls: 'aceptar',
                            handler: function () {
                                me.changeLinea(yo.getValue());
                                yo.ultimoValor = yo.getValue();
                                dialog.close();
                            }
                        },
                        {
                            text: 'Cancelar',
                            iconCls: 'cancelar',
                            handler: function () {
                                yo.setValue(yo.ultimoValor)
                                dialog.close();
                            }
                        }
                    ]
                });
                dialog.show({
                    title: me.etiquetas.lbConfirmacion,
                    msg: 'Ya existen productos agregados si continua con está acción eston serán eliminados. ¿Desea continuar?',
                    icon: Ext.MessageBox.QUESTION,
                });
            } else {
                me.changeLinea(yo.getValue());
                yo.ultimoValor = yo.getValue();
            }
            win.sftipolineaSelect.getStore().proxy.extraParams.idlinea = yo.getValue();
            win.filtros = {
                'idnaturaleza': win.idnaturaleza,
                'node': yo.getValue()
            }
            win.panelProveedores.stLeft.proxy.extraParams.idlinea = yo.getValue();

        } else {
            win.sftipolineaSelect.getStore().proxy.extraParams.idlinea = null;
            win.filtros = {'idnaturaleza': win.idnaturaleza,}
            win.panelProveedores.stLeft.proxy.extraParams.idlinea = null;
        }
        win.sftipolineaSelect.setDisabled(!yo.getValue());
        win.sftipolineaSelect.setValue('');
        win.sftipolineaSelect.getStore().load();

        win.panelProveedores.stLeft.load();
    },
    changeLinea: function (idlinea, marcarSeleccionados) {
        console.log('changeLinea', idlinea, marcarSeleccionados);
        var me = this,
            win = me.getWinEditSolicitud();
        win.sflinea.setValue(idlinea);
        win.sflinea.setRawValue('');
        win.sflinea.mask2 = new Ext.LoadMask(win.sflinea, {msg: this.etiquetas.msgLoading});
        win.sflinea.mask2.show();
        win.sflinea.getStore().load({
            callback: function (records, operation, success) {
                win.sflinea.mask2.hide();
                if (success) win.sflinea.setValue(idlinea);
            }
        })
        win.gridDemandas.setDisabled(false);
        win.gridDemandas.getStore().proxy.extraParams['filter[2][field]'] = 'idlinea';
        win.gridDemandas.getStore().proxy.extraParams['filter[2][data][type]'] = 'idlinea';
        win.gridDemandas.getStore().proxy.extraParams['filter[2][data][value]'] = idlinea;
        if(win.action=='modsolicitud' && this.application.estadolistodemanda)
            win.gridDemandas.getStore().proxy.extraParams['filter[1][data][value]'] =
            '['+this.application.idestadosolicitud+','+this.application.estadolistodemanda+']';
        win.gridDemandas.getStore().load({
            callback: function (records, operation, success) {
                if (marcarSeleccionados) {
                    win.gridDemandas.mask = new Ext.LoadMask(win.gridDemandas, {msg: 'Obteniendo seleccionados...'});
                    win.gridDemandas.mask.show();
                    Ext.Ajax.request({
                        url: UtilsFn.buildUrl({action: 'obtenerDemandasSeleccionadas'}, ModuleMgr.get('SolicitudNegocioImportacion')),
                        params: {idsolicitud: marcarSeleccionados},
                        success: function (response) {
                            // console.log('obtenerDemandasSeleccionadas')
                            if (win.gridDemandas.mask) win.gridDemandas.mask.hide();
                            var datos = Ext.decode(response.responseText);
                            win.gridDemandas.getStore().getRange().forEach(function (x) {
                                datos.forEach(function (y) {
                                    if (x.get('idsolicitud') == y['iddemanda']) x.set('seleccionado', true);
                                })
                            })
                        }
                    });
                }
            }
        });
        win.gridProductoServiciosSelect.getStore().removeAll();
        win.gridProductoServiciosFinal.getStore().removeAll();
        win.gridProductoServicios.getStore().removeAll();
        win.gridProductoServiciosSelect.setTitle('Productos de la demanda');
        win.gridProductoServiciosSelect.setDisabled(true);
    },
    validateButtons: function (selected) {
        var me = this,
            win = me.getWinEditSolicitud();
        win.down('#agregardemanda').setDisabled(selected.get('seleccionado'));
        win.down('#quitardemanda').setDisabled(!selected.get('seleccionado'));
    },
    agregarDemanda: function () {
        console.log('Agregar demanda')
        var me = this,
            win = me.getWinEditSolicitud(),
            storeFinal = win.gridProductoServiciosFinal.getStore(),
            storeOriginal = win.gridProductoServicios.getStore(),
            select = win.gridDemandas.getSelectionModel().getSelection()[0];
        select.set('seleccionado', true);
        console.log('win.gridProductoServiciosSelect.getStore().getRange()', win.gridProductoServiciosSelect.getStore().getRange())
        win.gridProductoServiciosSelect.getStore().getRange().forEach(function (x) {
            var hallado = false;
            storeFinal.getRange().forEach(function (y) {
                if (x.get('codigo') == y.get('codigo')) {
                    hallado = true;
                    y.set('cantidad', parseFloat(y.get('cantidad')) + parseFloat(x.get('cantidad')));
                }
            });
            if (!hallado) {
                storeFinal.add(x);
                storeOriginal.add(x);
            }
        });
        me.validateButtons(select);
    },
    quitarDemanda: function () {
        console.log('Quitar demanda')
        var me = this,
            win = me.getWinEditSolicitud(),
            storeFinal = win.gridProductoServiciosFinal.getStore(),
            storeOriginal = win.gridProductoServicios.getStore(),
            select = win.gridDemandas.getSelectionModel().getSelection()[0];
        select.set('seleccionado', false)
        win.gridProductoServiciosSelect.getStore().getRange().forEach(function (x) {
            cont = 0;
            storeFinal.getRange().forEach(function (y) {
                if (x.get('idindicador') == y.get('idindicador')) {
                    if (x.get('cantidad') == y.get('cantidad')) {
                        storeFinal.remove(y);
                        storeOriginal.remove(y);
                    } else if (y.get('cantidad') > x.get('cantidad')) {
                        var cant = y.get('cantidad');
                        y.set('cantidad', parseFloat(cant) - parseFloat(x.get('cantidad')));
                        storeOriginal.getAt(cont).set('cantidad', parseFloat(cant) - parseFloat(x.get('cantidad')));
                    }
                }
                cont++;
            })
        })
        me.validateButtons(select);
    },
    seleccionarDemanda: function (sm, selected) {
        var me = this,
            win = me.getWinEditSolicitud(),
            storeP = win.gridProductoServiciosSelect.getStore();
        win.gridProductoServiciosSelect.setTitle('Productos de la demanda');
        win.down('#agregardemanda').setDisabled(true);
        win.down('#quitardemanda').setDisabled(true);
        if (selected.length == 0) {
            storeP.removeAll();
            win.gridProductoServiciosSelect.setDisabled(true);
        } else if (selected.length == 1) {

            win.gridProductoServiciosSelect.setTitle('Productos de la demanda: ' + selected[0].get('nombre'));
            if (Ext.Ajax.isLoading()) {
                // Ext.Ajax.abort();
                //     Ext.Ajax.abort(storeP.proxy.activeRequest);
                //     delete storeP.proxy.activeRequest;
            }
            win.gridProductoServiciosSelect.setDisabled(false);
            console.log('isLoading', Ext.Ajax.isLoading())
            win.gridProductoServiciosSelect.setLoading('Cargando...');
            Ext.Ajax.request({
                autoAbort: true,
                params: {
                    idsolicitud: parseInt(selected[0].get('idsolicitud')),
                    notmarcocontractual: true
                },
                url: UtilsFn.buildUrl({action: 'obtenerProductoServicio'}, ModuleMgr.get('SolicitudNegocioImportacion')),
                callback: function (options, success, response) {
                    if(success){
                        win.validateButtons(selected[0])
                        // if(!selected[0].get('seleccionado'))me.down('#agregardemanda').setDisabled(false);
                        // if(selected[0].get('seleccionado'))me.down('#quitardemanda').setDisabled(false);
                        win.gridProductoServiciosSelect.setLoading(false);
                        var datos = Ext.decode(response.responseText);
                        datos.datos.forEach(function (x) {
                            x['idindicadorcontrato'] = '';
                            // x['precio'] = '';
                            // x['preciodivisa'] = '';
                        });
                        storeP.loadData(datos.datos);
                        // storePO.loadData(datos.datos);
                        storeP.dataCargada = storeP.getRange();
                    }
                }
            });
        } else {
            storeP.removeAll();
            // storePO.removeAll();
            me.gridProductoServiciosSelect.setDisabled(true);
        }
    },
    exportarExcel: function(button){
        var me=this, grid=button.up('grid'),
            record=grid.getSelectionModel().getLastSelected();
        window.open(window.location.origin + '/crm/importacion/index.php/solicitudnegocioimportacion/exportarExcelSolicitudImp?idsolicitud='+record.get('idsolicitud'))
    },
    exportarWord: function(button){
        var me=this, grid=button.up('grid'),
            record=grid.getSelectionModel().getLastSelected();
        window.open(window.location.origin + '/crm/importacion/index.php/solicitudnegocioimportacion/exportarWordSolicitudImp?idsolicitud='+record.get('idsolicitud'))
    }
});
