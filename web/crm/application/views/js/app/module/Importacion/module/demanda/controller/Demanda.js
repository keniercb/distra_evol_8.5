Ext.define('Demanda.controller.Demanda', {
    extend: 'CRM.core.controller.Base',
    views: ['Demanda'],
    refs: [
        {ref: 'Demanda', selector: 'gpdemanda'},
        {ref: 'WinEditDemanda', selector: 'wineditdemanda'},
        {ref: 'WinDetallesDemanda', selector: 'windetallesdemanda'},
        {ref: 'WinEstadoTrazas', selector: 'winestadotrazas'},
        {ref: 'WindowHistorialDemanda', selector: 'windowhistorialdemanda'},
        {ref: 'DocumentosAdicionales', selector: 'fpdemandadocadicionales'}
    ],
    requires: [
        'GestionContratoImportacion.view.GridEstadoTrazas',
        'Demanda.view.WinEditDemanda',
        'Demanda.view.WindowHistorialDemanda'
    ],
    init: function () {
        var me = this;

        me.getLang();

        me.listen({
            store: {
                '#Demanda': {
                    load: this.afterLoadDemandas,
                    beforeload: function () {
                        this.getDemanda().getSelectionModel().clearSelections();
                    }
                }
            },
            component: {
                "gpdemanda": {
                    render: this.onRenderDemanda,
                    itemcontextmenu: this.showContextMenu,
                    afterrender: this.grantActions,
                    /*render: function (grid) {
                        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);
                    },*/
                    itemdblclick: this.showWinDetallesDemanda
                },
                'gpdemanda searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                "gpdemanda button[action=adddemanda], menuitem[action=adddemanda]": {
                    click: this.showWinEditDemanda
                },
                "gpdemanda button[action=moddemanda], menuitem[action=moddemanda]": {
                    click: this.showWinEditDemanda
                },
                // "gpdemanda button[action=addsolicitudinterna], menuitem[action=addsolicitudinterna]": {
                //     click: this.showWinEditSolicitudInterna
                // },
                "gpdemanda button[action=elimdemanda], menuitem[action=elimdemanda]": {
                    click: this.eliminarDemanda
                },
                "gpdemanda button[action=crearcontrademanda], menuitem[action=crearcontrademanda]": {
                    click: this.showWinEditDemanda
                },
                "gpdemanda button[action=detalledemanda], menuitem[action=detalledemanda]": {
                    click: this.showWinDetallesDemanda
                },
                "gpdemanda button[action=estadotrazasdemanda], menuitem[action=estadotrazasdemanda]": {
                    click: this.showWinEstadoTrazas
                },
                "gpdemanda button[action=historialdemanda], menuitem[action=historialdemanda]": {
                    click: this.showWinHistorialDemanda
                },
                "gpdemanda button[action=marcocontractual], menuitem[action=marcocontractual]": {
                    click: this.marcoContractual
                },
                "gpdemanda button[action=clearfilters]": {
                    click: this.limpiarTodosLosFiltros
                },
                // "menuitem[action=mostrarofertas]": {
                //     click: this.mostrarOfertas
                // },
                "wineditdemanda button[action=aceptar]": {
                    click: this.saveDemanda
                },
                "wineditdemanda button[action=aplicar]": {
                    click: this.saveDemanda
                },
                "wineditdemanda button[action=cerrar]": {
                    click: this.closeWinEditDemanda
                },
                'wineditdemanda combobox[localId],wineditdemanda pickerfield[localId]': {
                    select: this.selectCombo,
                    change: this.changeCombo
                },
                "wineditdemanda fileuploadfield": {
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
                "wineditdemanda button[action=showfile]": {
                    click: this.showFile
                },
                "wineditdemanda button[action=delfile]": {
                    click: this.delFile
                },
                "windetallesdemanda button[action=cerrar]": {
                    click: this.closeWinDetallesDemanda
                },
                "winestadotrazas  button[action=cerrar]": {
                    click: this.closeWinEstadoTrazas
                },
                "windowhistorialdemanda  button[action=cerrar]": {
                    click: this.closeWinHistorialDemanda
                },
                'wineditdemanda, windetallesdemanda, winestadotrazas': {
                    beforeshow: function () {
                        if(this.application.keyMap)
                            this.application.keyMap.disable();
                    },
                    close: function () {
                        if(this.application.keyMap)
                            this.application.keyMap.enable();
                    }
                },
                'wineditdemanda combobox[name=idpadre]': {
                    select: me.selectDemanda
                },

            }
        });
    },

    afterLoadDemandas: function () {
        var me = this;
        var grid = me.getDemanda();
        console.log('afterLoadDemandas', grid.extrafields)
        if (!grid.extrafields) {
            this.addExtraColumns(grid);
        }
    },

    addExtraColumns: function (grid) {
        var store = grid.getStore(),
            fields = store.model.getFields(),
            jsondata = store.proxy.reader.jsonData;
        console.log('fields', fields)
        console.log('jsondata', jsondata)
        extrafields = grid.extrafields = jsondata.monedaentidad,
            console.log('extrafields', extrafields)
        data = jsondata.datos,
            console.log('data', data)
        columns = grid.columns,
            console.log('columns', columns)
        newfields = [],
            newcolumns = [],
            pos = -1;

        Ext.each(columns, function (column, index) {
            if (extrafields && extrafields.length != 0) {
                if (column.dataIndex == 'montototal') {
                    pos = index;
                }
                newcolumns.push(column.initialConfig);
            } else {
                newcolumns.push(column.initialConfig);
            }
        });

        if (pos != -1) {
            newcolumns = this.insertarColumnasMonedas(newcolumns, extrafields, pos, grid);
            grid.reconfigure(null, newcolumns);
        }
    },

    insertarColumnasMonedas: function (newcolumns, extrafields, pos, grid) {
        Ext.each(extrafields, function (field) {
            campos = grid.getStore().model.getFields();
            campos.push({name: 'montomoneda_' + field.codigoiso.toLowerCase()+'_'+field.idmoneda});
            grid.getStore().model.setFields(campos);
            newcolumns.splice(pos, 0, {
                dataIndex: 'montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda,
                // dataIndex: 'montomoneda_' + field.codigoiso.toLowerCase(),
                text: field.codigoiso.toUpperCase(),
                width: 80,
                align: 'right',
                filter: {
                    type: 'numeric'
                },
                renderer: function (value, meta) {
                    if (Ext.isEmpty(value)) {
                        value = 0;
                    }
                    value = Ext.util.Format.number(value, '0.000,00/i');
                    meta.tdAttr = 'data-qtip="' + value + '"';

                    return value;
                },
                summaryType: function (records, dataindex, b) {
                    var total = 0;
                    records.forEach(function (x) {
                        if (x.get(dataindex))
                            total += parseFloat(x.get(dataindex));
                    });
                    return total;
                }
            });
            pos++;
        });
        return newcolumns;
    },

    onSearch: function (field, data) {
        var me = this,
            grid = me.getDemanda();
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
        if (this.getDemanda().getStore().proxy.extraParams['filtrogeneral[0][field]']) {
            this.getDemanda().getStore().proxy.extraParams = {};
            this.getDemanda().getStore().load();
        }
    },
    limpiarTodosLosFiltros: function () {
        var grid = this.getDemanda(),
            actives = grid.filters.getFilterData().length,
            generalFilt = this.getDemanda().getStore().proxy.extraParams['filtrogeneral[0][field]'];
        grid.getStore().proxy.extraParams = {};
        grid.down('searchfield').reset();
        grid.filters.clearFilters();
        if (generalFilt && actives == 0) grid.getStore().load();
    },


    onSearch: function (field, data) {
        var me = this,
            grid = me.getDemanda();
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
        if (this.getDemanda().getStore().proxy.extraParams['filtrogeneral[0][field]']) {
            this.getDemanda().getStore().proxy.extraParams = {};
            this.getDemanda().getStore().load();
        }
    },
    limpiarTodosLosFiltros: function () {
        var grid = this.getDemanda(),
            actives = grid.filters.getFilterData().length,
            generalFilt = this.getDemanda().getStore().proxy.extraParams['filtrogeneral[0][field]'];
        grid.getStore().proxy.extraParams = {};
        grid.down('searchfield').reset();
        grid.filters.clearFilters();
        if (generalFilt && actives == 0) grid.getStore().load();
    },
    showWinEditDemanda: function (button) {
        var me = this, cliente = true, context = button.context, tipo = button.tipo, height = button.heightWin,
            recordSelected = this.getDemanda().getSelectionModel().getSelection(),
            title = button.tooltip, filtros = button.filtros, verMotivo = false;
        // console.log(button.action, button.action == 'crearcontrademanda')
        if (button.action == 'moddemanda') {
            var cloneRecord = recordSelected[0].copy();
            Ext.data.Model.id(cloneRecord);
            tipo = parseInt(recordSelected[0].get('cliente'));
            // if (recordSelected[0].get('cliente') == '1') {
            //     context='cliente';
            //     title = me.etiquetas.lbModificarDCliente;
            //     height=475;
            // } else if (recordSelected[0].get('cliente') == '2'){
            //     context='proveedor';
            //     title = me.etiquetas.lbModificarDProveedor;
            //     height=645;
            // } else
            if (recordSelected[0].get('cliente') == '3') {
                if (recordSelected[0].get('idpadre')) verMotivo = 'true';
                // console.log('verMotivo', verMotivo)
                context = 'importacion';
                title = me.etiquetas.lbModificarDemanda;
                height = 430;
                filtros = {'idnaturaleza': me.application.idnaturaleza};
            }
            // console.log(recordSelected[0])
            // console.log(recordSelected[0].get('objeto'))
            // else if (recordSelected[0].get('cliente') == '4'){
            //     context='proveedor';
            //     title = me.etiquetas.lbModificarSNImportacion;
            //     height=576;
            // }
            cloneRecord.set('idpadre', recordSelected[0].get('idpadre'));
            // console.log(cloneRecord.get('idpadre'))
        }
        if (button.action == 'crearcontrademanda') {
            verMotivo = true;
            tipo = parseInt(recordSelected[0].get('cliente'));
            context = 'importacion';
            title = me.etiquetas.lbBtnContraDemanda;
            height = 430;
        }
        console.log('CONTEXT:', context)
        var win = Ext.create('Demanda.view.WinEditDemanda', {
            action: button.action,
            title: title,
            cliente: cliente,
            context: context,
            tipo: tipo,
            height: height,
            idsolicitud: button.action == 'moddemanda' ? recordSelected[0].get('idsolicitud') : -1,
//             gestordocumentalactivo: me.application.gestordocumental.activo
            gestordocumentalactivo: me.application.gestordocumental ? me.application.gestordocumental.activo : false,
            idnaturaleza: me.application.idnaturaleza,
            filtros: filtros,
            idestadodemanda: me.application.idestadodemanda,
            verMotivo: verMotivo,
            monedasentidad: this.application.monedasentidad
        })

        // console.log('filtros demanda:', filtros)
        // var win = Ext.create('Demanda.view.WinEditDemanda', {

        win.setActionInsert(button.action != 'moddemanda');
        win.show();
        // if (tipo=='4' && !me.application.idestadosolicitud) {
        //     win.sfsolicituddemanda.setReadOnly(true);
        //     win.sfsolicituddemanda.setEditable(false);
        //     // mostrarMensaje(8, me.etiquetas.msgNoConfiguradoEstadoInsertar);
        //     var tip = Ext.create('Ext.tip.ToolTip', {
        //         target: win.sfsolicituddemanda.getEl(),
        //         html: me.etiquetas.msgNoConfiguradoEstadoInsertar,
        //         autoDestroy: true
        //     });
        //     tip.showBy(win.sfsolicituddemanda.getEl(), 't');
        // }
        if (button.action == 'crearcontrademanda') {
            filtros = {'idnaturaleza': me.application.idnaturaleza};
            win.down('#objeto').enable();
            me.cargarNumeroConsecutivo(tipo, win);
            // obj= me.getWinEditDemanda().down('#objeto').enabled();
            // console.log(win.down('#objeto').getValue())
        }
        if (button.action == 'adddemanda') {
            win.sfsector.Lmask = new Ext.LoadMask(win.sfsector.el, {msg: me.etiquetas.msgCargandoValorporDefecto});
            win.cmbarea.Lmask = new Ext.LoadMask(win.cmbarea.el, {msg: me.etiquetas.msgCargandoValorporDefecto});
            win.sfsector.Lmask.show();
            win.cmbarea.Lmask.show();
            me.cargarValoresPorDefecto(win);
            console.log('ventana de adicionar demanda', win)
            if (tipo == '3') {
                me.cargarNumeroConsecutivo(tipo, win);
            }
        } else {
            var cloneRecord = recordSelected[0].copy();
            Ext.data.Model.id(cloneRecord);
            cloneRecord.set('idlinea', null);
            cloneRecord.set('idtipolinea', null);
            // cloneRecord.set('idpadre', null);


            if (button.action == 'crearcontrademanda') {
                cloneRecord.set('idsolicitud', null);
                cloneRecord.set('objeto', null);
                // console.log('recordSelected[0].get(\'idsolicitud\')', recordSelected[0].get('idsolicitud'))
                cloneRecord.set('idpadre', recordSelected[0].get('idsolicitud'));
                // console.log(cloneRecord.get('idpadre'))
            }
            // if(win.tipo==4){
            //     if (win.panelProveedores.stLeft.isLoading()) {
            //         Ext.Ajax.abort(win.panelProveedores.stLeft.proxy.activeRequest);
            //         delete win.panelProveedores.stLeft.proxy.activeRequest;
            //     }
            //     win.panelProveedores.stLeft.proxy.extraParams.idlinea=recordSelected[0].get('idlinea');
            //     win.panelProveedores.stLeft.load();
            // }
            cloneRecord.set('idpadre', cloneRecord.get('idpadre'))
            // console.log(cloneRecord.get('idpadre'))
            // cloneRecord.set('idpadre', cloneRecord.raw.idpadre)
            win.loadValues(cloneRecord);
            win.down('#objeto').setValue(cloneRecord.get('objeto'));
            win.sflinea.getStore().proxy.extraParams.idclienteproveedor = cloneRecord.get('idclienteproveedor');
            win.sflinea.getStore().proxy.extraParams.soloLineas = true;
            win.sftipolinea.getStore().proxy.extraParams.idclienteproveedor = cloneRecord.get('idclienteproveedor');
            // if (button.action != 'crearcontrademanda') me.cargarCombo(win.sfdemanda, recordSelected[0]);
            // me.cargarCombo(win.sflinea, recordSelected[0], win.sflinea.name, 'linea');
            // me.cargarCombo(win.sfdemanda, recordSelected[0]);
            me.cargarCombo(win.sflinea, recordSelected[0], win.sflinea.name, 'linea'
                // {
                // 'idclienteproveedor': recordSelected[0].get('idclienteproveedor'),
                // 'soloLineas': true
                //  }
            );
            me.cargarCombo(win.sftipolinea, recordSelected[0], win.sftipolinea.name, null, {
                // 'idclienteproveedor': recordSelected[0].get('idclienteproveedor'),
                'idlinea': recordSelected[0].get('idlinea')
            });
            win.down('#descripcion').originalValue = recordSelected[0].get('descripcion');
            win.down('#descripcion').setValue(recordSelected[0].get('descripcion'));
            // win.gpareasimpl.getStore().proxy.extraParams = {idsolicitud: recordSelected[0].get('idsolicitud')};
            // win.gpareasimpl.getStore().load();
            var cargandoDatosAdicionales = true;
            win.gridProductoServicios.maskL = new Ext.LoadMask(
                win.gridProductoServicios.getEl(), {msg: this.etiquetas.msgLoading});
            win.gridProductoServicios.maskL.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'obtenerProductoServicio'}, ModuleMgr.get('Demanda')),
                params: {idsolicitud: recordSelected[0].get('idsolicitud')},
                success: function (response) {
                    cargandoDatosAdicionales = false;
                    if (win.gridProductoServicios.maskL) win.gridProductoServicios.maskL.hide();
                    var datos = Ext.decode(response.responseText);
                    if (button.action == 'crearcontrademanda') {
                        datos.datos.forEach(function (x) {
                            x['idindicadorcontrato'] = '';
                        })
                    }
                    win.gridProductoServicios.getStore().loadData(datos.datos);
                },
                failure: function (response) {
                    cargandoDatosAdicionales = false;
                    if (win.gridProductoServicios.maskL) win.gridProductoServicios.maskL.hide();
                }
            });

            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'getDemandaDocs'}, ModuleMgr.get('Demanda')),
                params: {idespaciotrabajo: recordSelected[0].get('idespaciotrabajo')},
                success: function (response) {
                    var datos = Ext.decode(response.responseText);
                    // console.log('datos:', datos)
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
        var me = this, win = me.getWinEditDemanda();
        if (win.tfNumero && win.tfNumero.isVisible()) {
            win.tfNumero.maskL = new Ext.LoadMask(
                win.tfNumero.getEl(), {msg: this.etiquetas.msgLoading});
            win.tfNumero.maskL.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'obtenerConsecutivo'}, ModuleMgr.get('Demanda')),
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
        // console.log('cargarcombo', campo.name, recordSelected.get(campo.name), atributo, recordSelected.get(atributo))
        if (recordSelected.get(atributo)) {
            if (rawValue) campo.setRawValue(recordSelected.get(rawValue));
            campo.mask = new Ext.LoadMask(campo, {msg: this.etiquetas.msgLoading});
            campo.mask.show();
            if (extraParams) campo.getStore().proxy.extraParams = extraParams;
            campo.getStore().load({
                callback: function (records, operation, success) {
                    // console.log('callback:', recordSelected.get(campo.name), records)
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
                    win.cmbarea.setValue(datos[0]['nombrearea']);
                    win.hfarea.setValue(datos[0]['idarea']);
                }
            },
            failure: function (response) {
                mostrarMensaje(7, 'No han podido cargarse los datos.')
            }
        });
    },
    // showWinEditSolicitudInterna: function (button) {
    //     // var win=Ext.create();
    // },
    closeWinEditDemanda: function () {
        this.getWinEditDemanda().close();
    },
    onRenderDemanda: function () {
        var me = this, grid = this.getDemanda();
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
                // console.log(info);
                this.application.gestordocumental = info.datos.conf;
                this.application.idestadosolicitud = info.datos.conf.solicituddemandalista;
                this.application.idnaturaleza = info.datos.naturaleza;
                this.application.monedasentidad = info.datos.monedasconfig;
                this.application.comite = {
                    transitions: info.datos.transitions
                };
                me.getDemanda().down('#adddemanda').filtros = {'idnaturaleza': info.datos.naturaleza};
                // this.application.planificacion = info.datos.planificacion;
                // this.application.idestadosolicitud = info.datos.estadosolicitud;
                me.getDemanda().getStore().load();
            },
            scope: me
        });
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);
    },
    obtenerProveedores: function () {
        var me = this, win = me.getWinEditDemanda(), nuevos = [], eliminado = [], olds = [];
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
        var me = this, win = me.getWinEditDemanda(), nuevos = [], eliminado = [];
        var store = win.gridProductoServicios.getStore(),
            all = win.gridProductoServicios.getStore().getRange(),
            newRecords = win.gridProductoServicios.getStore().getNewRecords(),
            modified = win.gridProductoServicios.getStore().getModifiedRecords(),
            removed = win.gridProductoServicios.getStore().getRemovedRecords();

        modified.forEach(function (m) {
            if (nuevos.indexOf(m.data) == -1)
                nuevos.push(m.data);
        });
        store.removeItems.forEach(function (r) {
            console.log('r', r)
            if (eliminado.indexOf(r.data) == -1)
                eliminado.push(r.data);
        });
        return {'nuevos': nuevos, 'eliminados': eliminado};
    },
    obtenerMontoTotal: function () {
        var me = this, win = me.getWinEditDemanda(), prod = [], montoTotal = 0;
        var store = win.gridProductoServicios.getStore();
        prod = store.data.items;
        for (var i = 0, len = prod.length; i < len; i++) {
            Ext.Object.each(prod, function(key, value){
                if(/^montomoneda_/.test(key)){
                    montoTotal += value;
                }
            })
            // montoTotal += prod[i].data.precio;
        }
        return montoTotal;
    },
    saveDemanda: function (btn) {
        var me = this,
            win = me.getWinEditDemanda(),
            storeDemanda = me.getDemanda().getStore(),
            docForm = win.down('form[tabId=datosadicionales]'),
            params = Ext.merge(win.getValues(), {
                objeto: win.down('#objeto').getValue(),
                delfile: Ext.encode(docForm.getRemovedRecords()),
                editfile: Ext.encode(docForm.getModifiedRecords()),
                proveedores: me.obtenerProveedores(),
                cliente: win.tipo,
                productosservicios: me.obtenerProductosServicios(),
                montototal: me.obtenerMontoTotal(),
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
            url: UtilsFn.buildUrl({action: (win.getActionInsert()) ? 'adicionarDemanda' : 'modificarDemanda'}, me),
            params: {values: Ext.encode(params)},
            success: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);

                if (response.success) {
                    mostrarMensaje(1, me.etiquetas[(win.getActionInsert()) ? 'msgSuccessInsertDemanda' : 'msgSuccessUpdateDemanda']);

                    if (btn.action == 'aplicar') {
                        win.resetComponents();
                        me.cargarNumeroConsecutivo(win.tipo);
                    }

                    else
                        win.close();

                    storeDemanda.load();
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
            hiddenField = form.getForm().findField(combo.localId);
            // storeAreasImpl = me.getWinEditDemanda().gpareasimpl.getStore();
        // if (storeAreasImpl.find('idestructura', records[0].data[combo.localId]) != -1) {
        //     mostrarMensaje(6, me.etiquetas.msgErrorAreaImplicadaEqualResponsable);
        // } else
        if (hiddenField && hiddenField.name == 'idclienteproveedor') {
            hiddenField.setValue(records[0].data['idclientesproveedores']);
        } else if (hiddenField) {
            hiddenField.setValue(records[0].data[combo.localId]);
        }
    },
    changeCombo: function (combo, value, oldvalue) {
        var me = this,
            form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);
            // storeAreasImpl = me.getWinEditDemanda().gpareasimpl.getStore();

        // if (storeAreasImpl.find('area', value) != -1) {
        //     combo.setValue(oldvalue);
        // }
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
    eliminarDemanda: function () {
        var me = this,
            sm = me.getDemanda().getSelectionModel();
        me.application.keyMap.disable();
        mostrarMensaje(2, me.etiquetas.msgElimDemanda, function (response) {
            if (response === 'ok') {
                var ids = [];
                sm.getSelection().forEach(function (x) {
                    ids.push(x.get('idsolicitud'));
                });

                Ext.MessageBox.show({
                    msg: me.etiquetas.msgElimDataDemanda,
                    title: me.etiquetas.lbTitleWait,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'eliminarDemanda'}, me),
                    params: {values: Ext.encode(ids)},
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        me.application.keyMap.enable();
                        var info = Ext.decode(response.responseText);

                        if (info.success) {
                            mostrarMensaje(1, me.etiquetas.msgSuccessDeleteDemanda);
                            me.getDemanda().getStore().load();
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
    showWinDetallesDemanda: function () {
        var recordSelected = this.getDemanda().getSelectionModel().getSelection()[0];
        Ext.create('Demanda.view.WinDetallesDemanda').show(recordSelected);
    },
    closeWinDetallesDemanda: function () {
        this.getWinDetallesDemanda().close();
    },
    getWinEstadoTrazas: function () {
        return Ext.create('SolicitudNegocioImportacion.view.WinEstadoTrazas')
    },
    showWinEstadoTrazas: function () {
        var win = this.getWinEstadoTrazas(),
            recordSelected = this.getDemanda().getSelectionModel().getSelection()[0],
            store = win.items.first().getStore();

        win.setTitle(this.etiquetas.titleWinEstadoTrazas + ' #' + recordSelected.get('idsolicitud'));
        win.show();

        store.removeAll();
        store.load({params: {idsolicitud: recordSelected.get('idsolicitud')}})
    },

    showWinHistorialDemanda: function (cmp) {
        var me = this,
            data = me.getDemanda().getSelectionModel().getLastSelected().data;
        // idfuncionalidad = this.application.securityData.idfuncionalidad;
        // showModHistorico = this.actions[idfuncionalidad]['btnModHitorico'];

        Ext.create('Demanda.view.WindowHistorialDemanda', {
            width: window.innerWidth * 0.9,
            idsolicitud: data.idsolicitud,

            // showModHistorico: showModHistorico
        }).show();
    },

    closeWinEstadoTrazas: function () {
        this.getWinEstadoTrazas().close();
    },
    closeWinHistorialDemanda: function () {
        this.getWinHistorial().close();
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
        console.log('tbar',tbar)

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
                if (x.xtype == 'button' && ['help', 'cambiarestadodemanda', 'adddemanda', '', undefined, null].indexOf(x.action) == -1) {
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
    // mostrarOfertas: function (button) {
    //     var me = this,
    //         grids = this.getSolicitudNegocio(),
    //         select = grids.getSelectionModel().getSelection();
    //
    //     function mostrarTooltipColumna(value, meta) {
    //         if (value)
    //             meta.tdAttr = 'data-qtip="' + value + '"';
    //         return value;
    //     }
    //
    //     var grid = Ext.create('Ext.grid.Panel', {
    //         viewConfig: {
    //             stripeRows: false,
    //             getRowClass: function (record, rowIndex, rowParams, store) {
    //                 if (record.get('idcontrato')) return 'escontrato';
    //                 return '';
    //             }
    //         },
    //         store: Ext.create('OfertaNegocioImportacion.store.OfertaNegocio', {
    //             autoLoad: true,
    //             proxy: {
    //                 type: 'ajax',
    //                 url: UtilsFn.buildUrl({action: 'getOfertasNegocio'}, ModuleMgr.get('OfertaNegocioImportacion')),
    //                 actionMethods: {read: 'POST'},
    //                 reader: {
    //                     root: 'datos',
    //                     totalProperty: 'cantidad',
    //                     successProperty: 'success'
    //                 },
    //                 extraParams: {idsolicitud: select[0].get('idsolicitud')}
    //             },
    //         }),
    //         columns: [
    //             {text: me.etiquetas.lbNumero, dataIndex: 'numero', width: 50, renderer: mostrarTooltipColumna},
    //             {text: me.etiquetas.lbFieldNombre, dataIndex: 'nombre', flex: 1, renderer: mostrarTooltipColumna},
    //             {
    //                 text: me.etiquetas.lbFieldClienteProveedor,
    //                 dataIndex: 'clienteproveedor',
    //                 flex: 1,
    //                 renderer: mostrarTooltipColumna
    //             },
    //             {
    //                 text: 'Monto', dataIndex: 'montototal', width: 90,
    //                 renderer: function (value, meta, record) {
    //                     if (value) {
    //                         meta.tdAttr = 'data-qtip="' + Ext.util.Format.number(value, '0.000,00/i') + '"';
    //                     }
    //
    //                     return Ext.util.Format.number(value, '0.000,00/i');
    //                 }
    //             },
    //             {
    //                 text: me.etiquetas.lbFieldCliente, dataIndex: 'cliente', width: 55, minWidth: 55,
    //                 renderer: function (value, meta) {
    //                     meta.innerCls = value == '1' ? "icondistra-perfilusuario" :
    //                         "icondistra-servicio";
    //                     meta.tdAttr = 'data-qtip="' + (value == '1' ? me.etiquetas.lbFieldCliente :
    //                         me.etiquetas.lbFieldProveedor) + '"';
    //                 }
    //             },
    //             {
    //                 text: me.etiquetas.lbEstado, width: 100, dataIndex: 'estado',
    //                 renderer: function (value, meta) {
    //                     meta.innerCls = "icondistra-" + meta.record.data.estadoicon;
    //                     meta.tdAttr = 'data-qtip="' + value + '"';
    //                     return value;
    //                 }
    //             }
    //         ],
    //         selModel: Ext.create('Ext.selection.RowModel', {
    //             listeners: {
    //                 selectionchange: function (sm, records) {
    //                     grid.down('#detallesoferta').setDisabled(records.length != 1);
    //                     grid.down('#vercontrato').setDisabled(records.length != 1 || !records[0].get('idcontrato'));
    //                 }
    //             }
    //         }),
    //         tbar: [
    //             {
    //                 text: me.etiquetas.lbBtnDetalles,
    //                 tooltip: me.etiquetas.ttipWinDetallesOferta,
    //                 iconCls: 'icondistra-detalles',
    //                 itemId: 'detallesoferta',
    //                 disabled: true,
    //                 handler: function () {
    //                     var recordSelected = grid.getSelectionModel().getSelection()[0];
    //                     var cloneRecord = recordSelected.copy();
    //                     Ext.data.Model.id(cloneRecord);
    //                     Ext.Object.each(cloneRecord.data, function (key, value) {
    //                         if (key != 'idsolicitud' && (value == '' || value == undefined)) {
    //                             cloneRecord.set(key, '<span style="color:gray">No definido</span>')
    //                         }
    //                         if (key == 'idsolicitud' && value) {
    //                             cloneRecord.set(key, '# ' + value + ' - ')
    //                         }
    //                     })
    //                     Ext.create('OfertaNegocioImportacion.view.WinDetallesOferta').show(cloneRecord);
    //                 }
    //             },
    //             {
    //                 text: me.etiquetas.lbVerContrato,
    //                 tooltip: me.etiquetas.qtipVerContrato,
    //                 iconCls: 'icondistra-detalles',
    //                 itemId: 'vercontrato',
    //                 disabled: true,
    //                 handler: function () {
    //                     var record = grid.getSelectionModel().getSelection()[0];
    //                     if (record.get('idcontrato')) {
    //                         me.cargandoDatosContrato = record.get('idcontrato');
    //                         var mask = new Ext.LoadMask(grid.down('#vercontrato').el,
    //                             {msg: me.etiquetas.msgCargando});
    //                         mask.show();
    //                         Ext.Ajax.request({
    //                             url: UtilsFn.buildUrl({action: 'obtenerDatosContrato'}, ModuleMgr.get('ReporteContratacion')),
    //                             params: {idcontrato: record.get('idcontrato')},
    //                             success: function (response) {
    //                                 mask.hide();
    //                                 me.cargandoDatosContrato = null;
    //                                 var datos = Ext.decode(response.responseText);
    //                                 record = {
    //                                     data: datos,
    //                                     getData: function () {
    //                                         return datos
    //                                     },
    //                                     get: function (field) {
    //                                         return datos[field];
    //                                     }
    //                                 };
    //                                 Ext.create('GestionContratoImportacion.view.DetailsWindow').show(record);
    //                             },
    //                             failure: function (response) {
    //                                 mask.hide();
    //                                 me.cargandoDatosContrato = null;
    //                                 mostrarMensaje(7, 'No han podido cargarse los datos.')
    //                             }
    //                         });
    //                     }
    //                 }
    //             }
    //         ]
    //     });
    //     var win = Ext.create('Ext.window.Window', {
    //         title: me.etiquetas.lbOfertasnegocioAsociadas,
    //         width: window.innerWidth * 0.9,
    //         height: 500,
    //         layout: 'fit',
    //         items: grid,
    //         buttons: [
    //             {
    //                 text: 'Cerrar',
    //                 iconCls: 'icondistra-cerrar',
    //                 handler: function () {
    //                     win.close();
    //                 }
    //             }
    //         ]
    //     });
    //     win.show();
    // },
    grantActions: function (grid) {
        this.validateGrantedActions({container: grid});
    },
    selectDemanda: function (combo, records) {
        // console.log('select')
        var me = this,
            win = me.getWinEditDemanda(),
            form = combo.up('form');
        if (combo.getValue()) {
            if (records.length > 0) {
                // console.log('record', records)
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
                url: UtilsFn.buildUrl({action: 'obtenerProductoServicio'}, ModuleMgr.get('Demanda')),
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
    // crearContrademanda: function () {
    //     var me = this;
    // },
    marcoContractual: function (button) {
        var me = this,
            gridDemandas = button.up('grid'),
            selectedDemanda = button.up('grid').getSelectionModel().getSelection()[0];
        me.cargadoContrato = false;
        me.cargadoProductosDemandas = false;
        Ext.define('TextDinero',
            {
                extend: 'Ext.form.field.Text',
                alias: 'widget.textdinero',
                labelAlign: 'top',
                itemId: 'total',
                width: 100,
                readOnly: true,
                fieldStyle: "text-align:right;",
                value: '0,00'
            }
        )
        var win = Ext.create('Ext.window.Window', {
            title: me.etiquetas.ttipBtnMarcoContractual,
            height: window.innerHeight * 0.8,
            width: window.innerWidth * 0.9,
            modal: true,
            constrain: true,
            maximizable: true,
            maximized: true,
            // layout: {
            //     type: 'vbox',
            //     align : 'stretch',
            //     pack  : 'start',
            // },
            layout: 'border',
            // topBar: false,
            items: [
                Ext.create('GestionContratoImportacion.view.gridContratos', {
                    region: 'center',
                    flex: 1,
                    selType: 'checkboxmodel',
                    columnasVisibles: [
                        'numerocontrato', 'numero', 'clienteproveedor', 'montototal', 'fechafirma',
                        'estadoinicial', 'fechafin',
                        // 'nombrearea', 'sector', 'tipocontrato','fechainicio',
                        // 'vigente', 'contratomarco', 'cliente'
                    ],
                    filtrosFijos: {
                        'cliente': {'type': 'list', 'value': [2]},
                        'contratomarco': {'type': 'boolean', 'value': true},
                        // 'contratomarco': {'type': 'list', 'value': '[1]'},
                        'vigente': {'type': 'boolean', 'value': true},
                        'accion_estado': {'type': 'other', 'value': 'sign'}
                        // 'ci.idlinea': {'type': 'int', 'value': selectedDemanda.get('idlinea')},
                    }
                }),
                {
                    xtype: 'container',
                    itemId: 'montos',
                    region: 'south',
                    hidden: true,
                    dock: 'bottom',
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'start',
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            title: 'Demanda',
                            margin: '0 5 5 5',
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Monto total',
                                    labelAlign: 'top',
                                    itemId: 'montoDemanda',
                                    labelWidth: 50,
                                    width: 100,
                                    readOnly: true,
                                    fieldStyle: "text-align:right;",
                                    value: '0,00'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Contrato',
                            margin: '0 5 5 0',
                            flex: 1,
                            defaults: {margin: '3 2'},
                            layout: {
                                type: 'hbox',
                                // align : 'stretch',
                            },
                            items: [
                                {
                                    xtype: 'textdinero',
                                    fieldLabel: 'Total',
                                    itemId: 'total',
                                    value: '0,00'
                                },
                                {
                                    xtype: 'textdinero',
                                    fieldLabel: 'Disponible',
                                    itemId: 'montoDisponible',
                                    value: '0,00',
                                    listeners: {
                                        change: function (yo) {
                                            console.log('change', me.toNumber(win.down('#montoDemanda').getValue()) > me.toNumber(yo.getValue()), me.toNumber(win.down('#montoDemanda').getValue()), yo.getValue(), me.toNumber(yo.getValue()))
                                            if (win.down('#montos').isVisible()) {
                                                win.down('#falta').setValue('0,00');
                                                win.down('#holgura').setValue('0,00');
                                                if (win.down('#montoDemanda').getValue()) {
                                                    win.down('#seleccionarcontratos').setDisabled(me.toNumber(yo.getValue()) <= 0)
                                                    // || win.down('#gridContratos').getSelectionModel().getCount()==0);
                                                    if (me.toNumber(win.down('#montoDemanda').getValue()) > me.toNumber(yo.getValue())) {
                                                        yo.removeCls('fieldcorrectoleft');
                                                        yo.addCls('fieldincorrectoleft');
                                                        win.down('#contrato').removeCls('fieldcorrectoright');
                                                        win.down('#contrato').addCls('fieldincorrectoright');
                                                        win.down('#falta').setValue(
                                                            Ext.util.Format.number(
                                                                me.toNumber(win.down('#montoDemanda').getValue()) -
                                                                me.toNumber(yo.getValue())
                                                                , '0.000,00/i')
                                                        );
                                                        console.log('falta: ', me.toNumber(win.down('#montoDemanda').getValue()), yo.getValue())
                                                        // win.down('#seleccionarcontratos').setDisabled(true);
                                                        // win.down('#suplementar').setDisabled(true);
                                                        // win.down('#crearcontrato').setDisabled(true);
                                                    } else {
                                                        yo.removeCls('fieldincorrectoleft');
                                                        yo.addCls('fieldcorrectoleft');
                                                        win.down('#contrato').removeCls('fieldincorrectoright');
                                                        win.down('#contrato').addCls('fieldcorrectoright');
                                                        win.down('#holgura').setValue(
                                                            Ext.util.Format.number(
                                                                me.toNumber(yo.getValue()) -
                                                                me.toNumber(win.down('#montoDemanda').getValue())
                                                                , '0.000,00/i'));
                                                        console.log('holgura: ', me.toNumber(win.down('#montoDemanda').getValue()), yo.getValue())
                                                        // win.down('#seleccionarcontratos').setDisabled(false);
                                                        // win.down('#suplementar').setDisabled(false);
                                                        // win.down('#crearcontrato').setDisabled(false);
                                                    }

                                                } else {
                                                    // win.down('#seleccionarcontratos').setDisabled(true);
                                                    // win.down('#suplementar').setDisabled(true);
                                                    // win.down('#crearcontrato').setDisabled(false);
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'textdinero',
                                    fieldLabel: 'Falta',
                                    itemId: 'falta',
                                },
                                {
                                    xtype: 'textdinero',
                                    fieldLabel: 'Holgura',
                                    itemId: 'holgura',
                                },
                                {
                                    xtype: 'textdinero',
                                    fieldLabel: 'Vigencia restante',
                                    labelAlign: 'top',
                                    width: 110,
                                    itemId: 'vigencia',
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Contratos',
                                    labelAlign: 'top',
                                    itemId: 'contrato',
                                    flex: 1,
                                    readOnly: true,
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'vbox',
                                        pack: 'end',
                                        // align : 'stretch',
                                    },
                                    items: [
                                        // {
                                        //     xtype: 'button',
                                        //     text: 'Suplementar',
                                        //     tooltip: 'Suplementar el contrato seleccionado',
                                        //     itemId: 'suplementar',
                                        //     action: 'createsupl',
                                        //     iconCls: 'duplicar',
                                        //     disabled: true,
                                        //     margin: '0 0 2 0',
                                        //     handler: function (yo) {
                                        //         // var controller = ModuleMgr.get('GestionContratoImportacion');
                                        //         // var maincontratacion = controller.getController('MainContratacion');
                                        //         // console.log(maincontratacion)
                                        //         // maincontratacion.application.gestordocumental=win.gestordocumental;
                                        //         // maincontratacion.application.planificacion=win.planificacion;
                                        //         // maincontratacion.application.modulopersona=win.modulopersona;
                                        //         // maincontratacion.application.idestadoofertalisto=win.idestadoofertalisto;
                                        //         var selected=win.down('#gridContratos').getSelectionModel().getSelection()[0]
                                        //         win.down('#createsupl').tipocontrato=selected.get('contratomarco')=='1'?'contratoMarco':'contratoCliente';
                                        //         me.maincontratacion.winContrato(win.down('#createsupl'));
                                        //     }
                                        // },
                                        // {
                                        //     xtype: 'button',
                                        //     iconCls: 'actualizar',
                                        //     tooltip: 'Volver a calcular montos disponibles',
                                        //     itemId: 'recalculardisponible',
                                        //     // margin: '18 0 0 0',
                                        //     handler: function () {
                                        //         me.cargarDatosMarcoContractual();
                                        //     }
                                        // },
                                        {
                                            xtype: 'button',
                                            text: 'Seleccionar',
                                            iconCls: 'seleccion',
                                            tooltip: 'Seleccionar contratos para crearles contratos espec�ficos',
                                            itemId: 'seleccionarcontratos',
                                            action: 'seleccionarcontratos',
                                            margin: '18 0 0 0',
                                            disabled: true,
                                            handler: function () {
                                                var selected = win.down('#gridContratos').getSelectionModel().getSelection();
                                                win.down('#tabcontratos').setVisible(true);
                                                win.down('#panelbotones').setVisible(true);
                                                console.log(win.down('#tabcontratos').getTabBar().items.length)
                                                console.log(win.down('#tabcontratos').getTabBar().items.items.length)
                                                selected.forEach(function (x) {
                                                    if (!win.down('#tabcontratos').down('#contrato_' + x.get('idcontrato'))) {
                                                        // win.down('#tabcontratos').add(
                                                        var panelContrato = Ext.create('Ext.panel.Panel', {
                                                            title: x.get('nombre'),
                                                            itemId: 'contrato_' + x.get('idcontrato'),
                                                            closable: true,
                                                            anchor: '100%',
                                                            datosContrato: x,
                                                            layout: 'border',
                                                            // layout: {
                                                            //     type: 'vbox',
                                                            //     align: 'stretch'
                                                            // },
                                                            descartar: true,
                                                            listeners: {
                                                                close: function (yo) {
                                                                    console.log('close', win.down('#tabcontratos').getTabBar().items.length)
                                                                    if (win.down('#tabcontratos').getTabBar().items.length <= 1) {
                                                                        win.down('#tabcontratos').setVisible(false);
                                                                        win.down('#panelbotones').setVisible(false);
                                                                        win.down('#productosdemanda').getStore().getRange().forEach(function(x){
                                                                            x.set('activo', null);
                                                                            win.down('#productosdemanda').getView().getRowClass(x);
                                                                        })
                                                                    }
                                                                },
                                                                beforeclose: function (yo) {
                                                                    if (yo.down('#productoscontrato').getStore().getCount() > 0 && yo.descartar) {
                                                                        var dialog = Ext.create('Ext.window.MessageBox', {
                                                                            buttonAlign: 'center',
                                                                            buttons: [
                                                                                {
                                                                                    text: 'Aceptar',
                                                                                    iconCls: 'aceptar',
                                                                                    handler: function () {
                                                                                        var items = yo.down('#productoscontrato').getStore().getRange();
                                                                                        win.down('#productosdemanda').getStore().add(items);
                                                                                        yo.down('#productoscontrato').getStore().remove(items);
                                                                                        dialog.close();
                                                                                        yo.close();
                                                                                    }
                                                                                },
                                                                                {
                                                                                    text: 'Cancelar',
                                                                                    iconCls: 'cancelar',
                                                                                    handler: function () {
                                                                                        dialog.close();
                                                                                    }
                                                                                }
                                                                            ]
                                                                        });
                                                                        dialog.show({
                                                                            title: me.etiquetas.lbConfirmacion,
                                                                            msg: 'El contrato seleccionado ya tiene productos asignados.<br>¿Está seguro que quiere cerrar?',
                                                                            icon: Ext.MessageBox.QUESTION,
                                                                        });
                                                                        return false;
                                                                    }

                                                                }
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'toolbar',
                                                                    dock: 'top',
                                                                    region: 'north',
                                                                    items: [
                                                                        {
                                                                            xtype: 'textdinero',
                                                                            fieldLabel: 'Disponible total',
                                                                            itemId: 'montoDisponibleTotalContrato',
                                                                            value: Ext.util.Format.number(me.toNumber(x.get('montototal')) - me.toNumber(x.get('montofacturado')), '0.000,00/i')
                                                                        },
                                                                        {
                                                                            xtype: 'textdinero',
                                                                            fieldLabel: 'Disponible',
                                                                            itemId: 'montoDisponibleContrato',
                                                                            cls: 'fieldcorrectoleft',
                                                                            value: Ext.util.Format.number(me.toNumber(x.get('montototal')) - me.toNumber(x.get('montofacturado')), '0.000,00/i'),
                                                                            listeners: {
                                                                                change: function (yo) {
                                                                                    if (me.toNumber(yo.getValue()) >= 0) {
                                                                                        yo.removeCls('fieldincorrectoleft');
                                                                                        yo.addCls('fieldcorrectoleft');
                                                                                        // panelContrato.down('#crearcontrato').setDisabled(false);
                                                                                    } else {
                                                                                        yo.removeCls('fieldcorrectoleft');
                                                                                        yo.addCls('fieldincorrectoleft');
                                                                                        // panelContrato.down('#crearcontrato').setDisabled(true);
                                                                                    }
                                                                                    panelContrato.down('#crearcontrato').comprobarValidez();

                                                                                }
                                                                            }
                                                                        },
                                                                        {
                                                                            xtype: 'textdinero',
                                                                            fieldLabel: 'Importe',
                                                                            itemId: 'montoTotalContrato',
                                                                            listeners: {
                                                                                change: function (yo) {
                                                                                    panelContrato.down('#montoDisponibleContrato').setValue(
                                                                                        Ext.util.Format.number(
                                                                                            me.toNumber(panelContrato.down('#montoDisponibleTotalContrato').getValue()) -
                                                                                            me.toNumber(panelContrato.down('#montoTotalContrato').getValue()), '0.000,00/i')
                                                                                    )
                                                                                }
                                                                            }
                                                                        },
                                                                        '->',
                                                                        {
                                                                            xtype: 'button',
                                                                            text: 'Crear contrato',
                                                                            tooltip: 'Crear contrato espec&iacute;fico a partir de marco',
                                                                            itemId: 'crearcontrato',
                                                                            action: 'crearcontrato',
                                                                            iconCls: 'nuevo',
                                                                            disabled: true,
                                                                            comprobarValidez: function (yo) {
                                                                                if (me.toNumber(panelContrato.down('#montoDisponibleContrato').getValue()) >= 0 &&
                                                                                    panelContrato.down('#productoscontrato').getStore().getCount() > 0) {
                                                                                    panelContrato.down('#crearcontrato').setDisabled(false);
                                                                                } else {
                                                                                    panelContrato.down('#crearcontrato').setDisabled(true);
                                                                                }
                                                                            },
                                                                            // hidden: true,
                                                                            margin: '20 0 0 0',
                                                                            handler: function (yo) {
                                                                                // var controller = ModuleMgr.get('GestionContratoImportacion');
                                                                                // var maincontratacion = controller.getController('MainContratacion');
                                                                                console.log('maincontratacion')
                                                                                // maincontratacion.application.gestordocumental=win.gestordocumental;
                                                                                // maincontratacion.application.planificacion=win.planificacion;
                                                                                // maincontratacion.application.modulopersona=win.modulopersona;
                                                                                // maincontratacion.application.idestadoofertalisto=win.idestadoofertalisto;
                                                                                var wincontrato = me.maincontratacion.winContrato(win.down('#crearcontratohidden')),
                                                                                    form = wincontrato.customForm.getForm(),
                                                                                    selected = win.down('#contrato_' + x.get('idcontrato')).datosContrato,
                                                                                    indicadores = win.down('#contrato_' + x.get('idcontrato')).down('#productoscontrato').getStore().getRange();
                                                                                wincontrato.btnAplicar.setVisible(false);
                                                                                wincontrato.btnAceptar.on('click', function (button) {
                                                                                    // console.log('CLICKKK')
                                                                                    wincontrato.on('destroy', function (aux) {
                                                                                        if (wincontrato.idcontrato) {
                                                                                            win.creadoContrato = true;
                                                                                            Ext.Ajax.request({
                                                                                                url: UtilsFn.buildUrl({action: 'guardarMarcoContractual'}, me),
                                                                                                params: {
                                                                                                    idcontrato: wincontrato.idcontrato,
                                                                                                    idsolicitud: selectedDemanda.get('idsolicitud')
                                                                                                },
                                                                                                success: function (response) {
                                                                                                    var datos = Ext.decode(response.responseText);
                                                                                                    panelContrato.descartar = false;
                                                                                                    panelContrato.close();
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            mostrarMensaje(7, 'No ha podido guardarse el contrato.');
                                                                                        }
                                                                                    })

                                                                                })
                                                                                form.findField('idlinea').setValue(selected.get('idlinea'));
                                                                                form.findField('linea').setValue(selected.get('linea'));
                                                                                form.findField('idclienteproveedor').setValue(selected.get('idclienteproveedor'));
                                                                                form.findField('clienteproveedor').setValue(selected.get('clienteproveedor'));
                                                                                if (selected.get('contratomarco') == '1') {
                                                                                    form.findField('idcontratomarco').setValue(selected.get('idcontrato'));
                                                                                    form.findField('denominacioncontratomarco').setValue(selected.get('numero'));
                                                                                }
                                                                                wincontrato.formaPago.tabpanel.setActiveTab(wincontrato.formaPago.indicadores);
                                                                                form.findField('nombreoferta').setDisabled(true);
                                                                                form.findField('clienteproveedor').setDisabled(false);
                                                                                form.findField('denominacioncontratomarco').setDisabled(false);
                                                                                form.findField('tipolinea').setDisabled(false);
                                                                                wincontrato.formaPago.indicadores.getStore().loadData(indicadores);
                                                                            }
                                                                        },

                                                                    ]
                                                                },
                                                                Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto', {
                                                                    itemId: 'productoscontrato',
                                                                    editGrid: false,
                                                                    totales: true,
                                                                    sinAcciones: true,
                                                                    sinToolbar: true,
                                                                    autoScroll: true,
                                                                    region: 'center',
                                                                    visibleColumns: ['codigo', 'denominacion', 'cantidad', 'total', 'importe', 'tipo'],
                                                                })
                                                            ]
                                                        });
                                                        // );
                                                        win.down('#tabcontratos').add(panelContrato);
                                                        win.down('#contrato_' + x.get('idcontrato')).down('#productoscontrato').getStore().on('datachanged', function (yo, records) {
                                                            // console.log('datachangeee')
                                                            var total = 0;
                                                            yo.getRange().forEach(function (y) {
                                                                total += me.toNumber(y.get('importe'));
                                                            });
                                                            win.down('#contrato_' + x.get('idcontrato')).down('#montoTotalContrato').setValue(total);
                                                            panelContrato.down('#crearcontrato').comprobarValidez();
                                                        })
                                                        win.down('#contrato_' + x.get('idcontrato')).down('#productoscontrato').getStore().on('update', function (yo, records) {
                                                            // console.log('update', yo, records)
                                                            var total = 0;
                                                            yo.getRange().forEach(function (y) {
                                                                total += me.toNumber(y.get('importe'));
                                                            });
                                                            win.down('#contrato_' + x.get('idcontrato')).down('#montoTotalContrato').setValue(total);
                                                            panelContrato.down('#crearcontrato').comprobarValidez();
                                                        })
                                                        win.down('#contrato_' + x.get('idcontrato')).down('#productoscontrato').getSelectionModel().on('selectionchange', function (yo, records) {
                                                            win.down('#quitar').setDisabled(records.length == 0);
                                                        });
                                                    }
                                                    win.down('#tabcontratos').setActiveTab(win.down('#tabcontratos').down('#contrato_' + x.get('idcontrato')));
                                                });

                                            }
                                        }
                                    ]
                                },

                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    title: 'Crear contratos',
                    itemId: 'tabcrearcontrato',
                    region: 'south',
                    resizable: true,
                    collapsible: true,
                    height: (window.innerHeight * 0.8) * 0.5,
                    minHeight: 150,
                    // hidden: true,
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                    },
                    items: [
                        Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto', {
                            title: 'Productos/Servicios de la demanda',
                            itemId: 'productosdemanda',
                            // width: (window.innerWidth*0.9)*0.5,
                            minWidth: 400,
                            flex: 1,
                            editGrid: false,
                            totales: true,
                            sinAcciones: true,
                            sinToolbar: true,
                            selType: 'checkboxmodel',
                            reordenarItems: false,
                            visibleColumns: ['codigo', 'denominacion', 'cantidad', 'total', 'importe', 'tipo'],
                            // padding: '0 15 0 0'
                        }),
                        {
                            xtype: 'panel',
                            bodyStyle: 'background:#DFE9F6;',
                            itemId: 'panelbotones',
                            hidden: true,
                            layout: {
                                type: 'vbox',
                                align: 'stretch',
                                pack: 'center'
                            },
                            defaults: {
                                xtype: 'button',
                                margin: '1 2',
                                ui: 'default-toolbar-small',
                            },
                            items: [
                                {
                                    iconCls: 'icondistra-desplazardoblederecha icon-medium',
                                    tooltip: 'Adicionar todos',
                                    handler: function () {
                                        console.log(win.down('#tabcontratos').getActiveTab())
                                        if(win.down('#tabcontratos').getActiveTab()) {
                                            var activeTab=win.down('#tabcontratos').getActiveTab(),
                                                items=me.comprobarExistenciaProductos(activeTab, win.down('#productosdemanda').getStore().getRange());
                                            activeTab.down('#productoscontrato').getStore().add(items['validos']);
                                            win.down('#productosdemanda').getStore().remove(items['validos']);
                                            me.calcularImporteTotal(activeTab.down('#productoscontrato').getStore().getRange(), activeTab.down('#montoTotalContrato'));
                                            if(items['invalidos'].length>0){
                                                var prod=[];
                                                items['invalidos'].forEach(function(x){
                                                    prod.push(x.get('codigo'));
                                                })
                                                mostrarMensaje(8, 'No se han adicionado por no estar contemplados en el contrato los siguentes productos:<br>'+
                                                prod.toString()+'.');
                                            }
                                        }
                                    }
                                },
                                {
                                    iconCls: 'icondistra-siguiente icon-medium',
                                    tooltip: 'Adicionar seleccionados',
                                    itemId: 'adicionar',
                                    disabled: true,
                                    handler: function(){
                                        if(win.down('#tabcontratos').getActiveTab()) {
                                            // var items = win.down('#productosdemanda').getSelectionModel().getSelection();
                                            var activeTab=win.down('#tabcontratos').getActiveTab(),
                                                items=me.comprobarExistenciaProductos(activeTab, win.down('#productosdemanda').getSelectionModel().getSelection());
                                            activeTab.down('#productoscontrato').getStore().add(items['validos']);
                                            win.down('#productosdemanda').getStore().remove(items['validos']);
                                            me.calcularImporteTotal(activeTab.down('#productoscontrato').getStore().getRange(), activeTab.down('#montoTotalContrato'))
                                            if(items['invalidos'].length>0){
                                                var prod=[];
                                                items['invalidos'].forEach(function(x){
                                                    prod.push(x.get('codigo'));
                                                })
                                                mostrarMensaje(8, 'No se han adicionado por no estar contemplados en el contrato los siguentes productos:<br>'+
                                                    prod.toString()+'.');
                                            }
                                        }
                                    }
                                },
                                {
                                    iconCls: 'icondistra-anterior icon-medium',
                                    tooltip: 'Quitar seleccionados',
                                    itemId: 'quitar',
                                    disabled: true,
                                    handler: function() {
                                        if (win.down('#tabcontratos').getActiveTab()) {
                                            var items = win.down('#tabcontratos').getActiveTab().down('#productoscontrato').getSelectionModel().getSelection();
                                            win.down('#productosdemanda').getStore().add(items);
                                            win.down('#tabcontratos').getActiveTab().down('#productoscontrato').getStore().remove(items);
                                            me.calcularImporteTotal([], win.down('#tabcontratos').getActiveTab().down('#montoTotalContrato'))
                                            win.down('#productosdemanda').reordenar();
                                        }
                                    }
                                },
                                {
                                    iconCls: 'icondistra-desplazardobleizq icon-medium',
                                    tooltip: 'Quitar todos',
                                    handler: function() {
                                        if (win.down('#tabcontratos').getActiveTab()) {
                                            var items = win.down('#tabcontratos').getActiveTab().down('#productoscontrato').getStore().getRange();
                                            win.down('#productosdemanda').getStore().add(items);
                                            win.down('#tabcontratos').getActiveTab().down('#productoscontrato').getStore().removeAll();
                                            me.calcularImporteTotal([], win.down('#tabcontratos').getActiveTab().down('#montoTotalContrato'))
                                            win.down('#productosdemanda').reordenar();
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'tabpanel',
                            itemId: 'tabcontratos',
                            hidden: true,
                            // maxWidth: (window.innerHeight*0.8),
                            minTabWidth: 30,
                            minWidth: (window.innerWidth*0.9)*0.3,
                            flex:1,
                            listeners:{
                                tabchange: function(tab, newtab, oldtab){
                                    console.log('tabchange')
                                    win.down('#productosdemanda').getStore().getRange().forEach(function(x){
                                        x.set('activo', newtab.datosContrato.get('codigosproductos').indexOf(x.get('codigo'))!=-1);
                                        win.down('#productosdemanda').getView().getRowClass(x);
                                    });
                                    // win.down('#productosdemanda').getView().getRowClass(win.down('#productosdemanda').getStore().getRange()[1]);
                                }
                            }
                        }
                    ]
                }
            ],
            buttons: [
                {
                    text: me.etiquetas.lbBtnCerrar,
                    iconCls: 'icondistra-cerrar',
                    tooltip: me.etiquetas.qtipCerrar,
                    action: 'cerrar',
                    handler: function () {
                        win.close();
                    }
                }
            ],
            listeners: {
                close: function (yo) {
                    console.log('close:', win.creadoContrato)
                    if (win.creadoContrato && win.down('#productosdemanda').getStore().getCount() == 0) {
                        Ext.Ajax.request({
                            url: UtilsFn.buildUrl({action: 'guardarEstadoMarcoContractual'}, me),
                            params: {
                                'idsolicitud': selectedDemanda.get('idsolicitud')
                            },
                            success: function (response) {
                                var datos = Ext.decode(response.responseText);
                                if (datos.success) {
                                    mostrarMensaje(1, 'La demanda ha sido satisfecha completamente.')
                                    gridDemandas.getStore().load();
                                }
                            },
                            failure: function () {
                                mostrarMensaje(7, 'No se ha podido cambiar el estado de la oferta.')
                            }
                        })
                    }
                }
            }
        });

        var gridContrato = win.down('#gridContratos');
        win.down('#productosdemanda').getSelectionModel().on('selectionchange', function (yo, records) {
            win.down('#adicionar').setDisabled(records.length == 0);
        })
        gridContrato.getSelectionModel().on('selectionchange', function (yo, records) {
            // win.down('#suplementar').setDisabled(true);
            // win.down('#crearcontrato').setDisabled(true);
            win.down('#seleccionarcontratos').setDisabled(records.length == 0);
            if (records.length > 0) {
                var montototal = 0, facturado = 0, contratos = [];
                records.forEach(function (x) {
                    montototal += me.toNumber(x.get('montototal'));
                    facturado += me.toNumber(x.get('montofacturado'));
                    contratos.push('(' + x.get('numerocontrato') + ') - ' + x.get('nombre'));
                });
                console.log('ToTal:', montototal)
                console.log('Facturado:', facturado)
                win.down('#montoDisponible').setValue(Ext.util.Format.number(montototal-facturado, '0.000,00/i'));
                win.down('#total').setValue(Ext.util.Format.number(montototal, '0.000,00/i'));
                win.down('#contrato').setValue(contratos.join(' | '));
                win.down('#vigencia').setValue(
                    (records.length==1?(records[0].get('cumplimientoobligaciones')=='1'?'Al cumplimiento':
                        (records[0].get('diasrestantesvigencia')==10000000000000000000?'No vigente':records[0].get('diasrestantesvigencia')+ ' días')):'(Varias selecciones)'));
                // if (records[0].get('montofacturado'))
                //     win.down('#montoDisponible').setValue(Ext.util.Format.number(
                //         me.toNumber(records[0].get('montototal')) -
                //         me.toNumber(records[0].get('montofacturado'))
                //         , '0.000,00/i'));
                if(records.length==1 && win.down('#montoDemanda').getValue()){
                    // if(me.toNumber(win.down('#montoDemanda').getValue()) < me.toNumber(win.down('#montoDisponible').getValue()))
                    //     win.down('#seleccionarcontratos').setDisabled(false);
                    // win.down('#crearcontrato').setDisabled(false);
                    // win.down('#suplementar').setDisabled(false);
                }
            }else{
                win.down('#montoDisponible').setValue('0,00');
                win.down('#total').setValue('0,00');
                win.down('#contrato').setValue('');
                win.down('#vigencia').setValue('');
                win.down('#montoDisponible').removeCls('fieldcorrectoleft');
                win.down('#montoDisponible').removeCls('fieldincorrectoleft');
                win.down('#contrato').removeCls('fieldcorrectoright');
                win.down('#contrato').removeCls('fieldincorrectoright');
            }
        });
        gridContrato.getStore().on('load', function(yo, records, success) {
            if (success) {
                me.cargadoContrato=true;
                me.cargarDatosMarcoContractual(win, selectedDemanda);
            }
        })
        win.show(null, function(){
            win.down('#topBar').add({
                disabled: true,
                hidden: true,
                itemId: 'crearcontratohidden',
                action: 'add',
                // suplemento: false,
                // addsuplemento: false,
                tipocontrato: 'contratoCliente', //contratoCliente
                context: 'importacion',
                text: 'Crear contrato',
            });
            win.down('#topBar').add({
                disabled: true,
                hidden: true,
                itemId: 'createsupl',
                action: 'createsupl',
                suplemento: true,
                addsuplemento: true,
                tipocontrato: 'contratoMarco', //contratoCliente
                context: 'importacion',
                text: 'Crear suplemento',
            });
            var controller = ModuleMgr.get('GestionContratoImportacion');
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'getConfiguraciones'}, controller),
                scope: this,
                callback: function (options, success, response) {
                    var response = Ext.decode(response.responseText);
                    me.maincontratacion = controller.getController('MainContratacion');
                    me.maincontratacion.application.gestordocumental=response.contractdoc[0];
                    me.maincontratacion.application.planificacion=response.planificacion;
                    me.maincontratacion.contabilidad = response.contabilidad.archivo && response.contabilidad.aperturado == 1 && response.contabilidad.confhabilitado;
                    me.maincontratacion.application.modulopersona=response.configuracion['activopersona']=='1';
                    me.maincontratacion.application.idestadoofertalisto=response.configuracion['idestadoofertalisto'];
                    // win.gestordocumental = response.contractdoc[0];
                    // win.estructura = response.estructura;
                    // win.planificacion = response.planificacion;
                    // win.contabilidad = response.contabilidad.archivo && response.contabilidad.aperturado == 1 && response.contabilidad.confhabilitado;
                    // win.modulopersona = response.configuracion['activopersona']=='1';
                    // win.idestadoofertalisto = response.configuracion['idestadoofertalisto'];
                }
            })
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'obtenerProductoServicio'}, ModuleMgr.get('Demanda')),
                params: {
                    idsolicitud: selectedDemanda.get('idsolicitud'),
                    notmarcocontractual: true
                },
                callback: function (options, success, response) {
                    if (success) {

                        var info = Ext.decode(response.responseText);
                        console.log('info:', info, win.down('#productosdemanda'))

                        if (info.datos.length > 0) {
                            for(var i in info.datos){
                                info.datos[i]['idindicadorcontrato']='';
                            }
                            win.down('#productosdemanda').getStore().loadData(info.datos);
                        }
                        me.cargadoProductosDemandas=true;
                        me.cargarDatosMarcoContractual(win, selectedDemanda);
                        // else{
                        //     me.fsProductosServicios.setVisible(false);
                        // }
                    }
                }
            });
        });
    },
    toNumber: function(valor){
        if(Ext.isEmpty(valor)){
            return parseFloat(0);
        }else if(typeof valor=='string' && valor.indexOf(',')!=-1) {
            return parseFloat(valor.replace(/\./g,'').replace(',', '.'))
        }else{
            return parseFloat(valor);
        }
    },
    getNombreLimite: function(nombre, limite){
        return nombre.substring(0, limite)+(nombre.length>limite?'...':'');
    },
    calcularImporteTotal: function(records, campo){
        var me=this;
        var total=0;
        records.forEach(function(y){
            total+=me.toNumber(y.get('precio'))*me.toNumber(y.get('cantidad'));
        });
        console.log('total:', total, records)
        campo.setValue(Ext.util.Format.number(total, '0.000,00/i'));
    },
    cargarDatosMarcoContractual: function(win, selectedDemanda){
        var me=this, idcontratos = [], idindicadores=[];
        console.log('cargarDatosMarcoContractual:',me.cargadoContrato, me.cargadoProductosDemandas)
        if(me.cargadoContrato && me.cargadoProductosDemandas) {
            console.log('so whatt???')
            win.down('#gridContratos').getStore().getRange().forEach(function (x) {
                idcontratos.push(x.get('idcontrato'));
            })
            win.down('#productosdemanda').getStore().getRange().forEach(function (x) {
                idindicadores.push(x.get('idindicador'));
            });
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'comprobarMarco'}, me),
                params: {
                    iddemanda: selectedDemanda.get('idsolicitud'),
                    idcontratos: Ext.encode(idcontratos),
                    idindicadores: Ext.encode(idindicadores),
                },
                callback: function (options, success, response) {
                    var response = Ext.decode(response.responseText);
                    var panelmontos = win.down('#montos'), gridContrato=win.down('#gridContratos');
                    gridContrato.getSelectionModel().deselectAll();
                    panelmontos.setVisible(true);
                    if (response['totalDemanda'])
                        win.down('#montoDemanda').setValue(Ext.util.Format.number(parseFloat(response['totalDemanda']), '0.000,00/i'));
                    gridContrato.getStore().getRange().forEach(function (x) {
                        x.set('montofacturado', response['facturasContratos'][x.get('idcontrato')] ? response['facturasContratos'][x.get('idcontrato')] : 0)
                        x.set('codigosproductos', response['productosContratos'][x.get('idcontrato')] ? response['productosContratos'][x.get('idcontrato')] : [])
                    })
                    if (gridContrato.getSelectionModel().getSelection().length > 0) {
                        if (response['facturasContratos'][gridContrato.getSelectionModel().getSelection()[0].get('idcontrato')])
                            win.down('#montoDisponible').setValue(
                                response['facturasContratos'][gridContrato.getSelectionModel().getSelection()[0].get('idcontrato')])
                    }
                    win.down('#montos').setVisible(true);
                }
            });
        }
    },
    comprobarExistenciaProductos: function(activeTab, items){
        var result={'validos': [], 'invalidos': []};
        items.forEach(function(x){
            if(activeTab.datosContrato.get('codigosproductos').indexOf(x.get('codigo'))!=-1){
                result['validos'].push(x);
            }else{
                result['invalidos'].push(x);
            }
        })
        return result;
    }

});
