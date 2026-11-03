Ext.define('Seguimiento.controller.Main', {
    extend: 'CRM.core.controller.Base',

    views: ['Main'],

    refs: [
        {ref: 'mainPanel', selector: 's_main'},
        {ref: 'WindowSeguimiento', selector: 's_seguimientowindow'},
        {ref: 'WindowFactura', selector: 's_facturawindow'},
        {ref: 'GridFactura', selector: 's_gridfactura'},
        {ref: 'ContratosGrid', selector: 'gridContratosImportacion'},
        {ref: 'GridSeguimiento', selector: 's_seguimientogrid'},
        {ref: 'WindowSeleccionarContrato', selector: 's_windowseleccioncontrato'}
    ],

    init: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            store: {
                '#s_stContratos': {
                    // load: this.afterLoadContratos,
                    beforeload: function () {
                        var grid = this.getContratosGrid(),
                            sm = grid.getSelectionModel();
                        grid.getSelectionModel().clearSelections();
                        grid.fireEvent('selectionchange', sm, []);
                    }
                },
                '#s_st_facturas': {
                    load: function (yo, record, success) {
                        if (success) {
                            if (me.getWindowSeguimiento()) {
                                me.getWindowSeguimiento().down('#facturasvalido').resetOriginalValue();
                                me.sumarImportes();
                                me.getWindowSeguimiento().down('#totalesAPagar').queryBy(function (x) {
                                    if (Ext.isFunction(x.resetOriginalValue))
                                        x.resetOriginalValue();
                                });
                            }
                        }
                    },
                    datachanged: function () {
                        win = me.getWindowSeguimiento()
                        if (win.down('#gridfactura').getStore().loadFInish)
                            win.down('#facturasdirty').setValue('dirty')
                        me.sumarImportes();
                    },
                    update: function () {
                        win = me.getWindowSeguimiento()
                        if (win.down('#gridfactura').getStore().loadFInish)
                            win.down('#facturasdirty').setValue('dirty')
                    }
                },
                '#s_stSeguimiento': {
                    beforeload: function () {
                        var grid = this.getGridSeguimiento(),
                            sm = grid.getSelectionModel();
                        grid.getSelectionModel().clearSelections();
                        grid.fireEvent('selectionchange', sm, []);
                        grid.btnAdicionarA.setDisabled(true);
                        if (me.getWindowSeguimiento()) {
                            me.getWindowSeguimiento().mask = new Ext.LoadMask(
                                me.getWindowSeguimiento().down('#tabfacturas').el, {msg: this.etiquetas.msgLoading});
                            me.getWindowSeguimiento().mask.show();
                        }
                    },
                    load: function (yo, records, success) {
                        me.getGridSeguimiento().btnAdicionarA.setDisabled(
                            me.getContratosGrid().getSelectionModel().getSelection().length != 1
                        );
                        if (yo.proxy.reader.jsonData)
                            me.getGridSeguimiento().montos = yo.proxy.reader.jsonData.montos;
                        if (me.getWindowSeguimiento()) {
                            if (yo.proxy.reader.jsonData) {
                                me.getWindowSeguimiento().montos = yo.proxy.reader.jsonData.montos;
                                me.sumarImportes();
                            }
                            if (me.getWindowSeguimiento().mask) {
                                me.getWindowSeguimiento().mask.hide();
                                me.getWindowSeguimiento().mask = null;
                            }
                        }
                    }
                },
                '#s_stSeleccionContratos': {
                    load: function (store, records, success) {
                        var me = this;
                        if (success) {
                            records.forEach(function (x) {
                                if (x.get('idcontrato') == me.getWindowSeguimiento().down('#idcontrato').getValue())
                                    store.remove(x);
                            });
                        }
                    }
                }
            },
            component: {
                's_main': {
                    afterrender: this.grantActions
                },
                's_main gridContratosImportacion': {
                    render: function (grid) {
                        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);
                    },
                    selectionchange: this.selectContrato,
                    itemdblclick: this.mostrarDetallesContrato
                },
                's_windowseleccioncontrato s_contratosgrid': {
                    selectionchange: this.selectContratoWindow,
                },
                's_main gridContratosImportacion button[action], s_main gridContratosImportacion menuitem[action]': {
                    click: this.onClickActionContratoGrid,
                },
                's_main s_seguimientogrid': {
                    render: function (grid) {
                        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);
                    },
                    selectionchange: this.ButtonEnabled,
                    // select:this.ButtonEnabled,
                    itemdblclick: this.mostrarDetalles,
                    itemcontextmenu: this.itemContextMenu
                },
                's_seguimientowindow s_gridfactura': {
                    selectionchange: this.selectFactura
                },
                's_seguimientogrid button[action]': {
                    click: this.onClickActionGridSeguimiento
                },
                's_seguimientogrid menuitem[action]': {
                    click: this.onClickActionGridSeguimiento
                },
                's_seguimientogrid actioncolumn': {
                    click: function(btn, gridView, rowIndex, colIndex, column, e){
                        var rec = btn.up('grid').getStore().getAt(rowIndex);
                        if(rec.data.cantpenalidades>0) {
                            me.verPenalizaciones(rec);
                        }
                    }
                },
                's_gridfactura button[action],s_gridfactura menuitem[action]': {
                    click: this.onClickActionGridFactura
                },
                's_seguimientowindow': {
                    render: this.comprobarValidez,
                    beforeshow: function () {
                        this.application.keyMap.disable();
                    },
                    close: function () {
                        this.application.keyMap.enable();
                    }
                },
                's_seguimientowindow button[action], s_seguimientowindow menuitem[action]': {
                    click: this.onClickSeguimientoWindow
                },
                's_facturawindow': {
                    render: this.comprobarValidez
                },
                's_facturawindow button[action]': {
                    click: this.onClickFacturaWindow
                },
                's_seguimientowindow combobox[localId],s_seguimientowindow pickerfield[localId]': {
                    select: this.selectArea
                },
                's_seguimientowindow combobox[itemId=mediopago]': {
                    select: this.selectMedioPago
                },
                's_windowseleccioncontrato button[action]': {
                    click: this.onClickSeleccionarContrato
                },
                'windetallesseguimiento': {
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
                }
            }
        });
    },

    comprobarValidez: function (window) {
        window.down('form').on('validitychange', function (form, valido) {
            if (window.caso == 'add') {
                window.btnAplicar.setDisabled(!valido);
                window.btnAceptar.setDisabled(!valido);
            } else if (window.caso == 'mod') {
                window.btnAceptar.setDisabled(!valido || !form.isDirty());
            }
        });
        if (window.caso == 'mod') {
            window.down('form').on('dirtychange', function (form, dirty) {
                window.btnAceptar.setDisabled(!dirty);
            });
        }
    },

    selectArea: function (combo, records) {
        var me = this;
        this.getWindowSeguimiento().down('#idarea').setValue(
            records[0].data[combo.localId]);
        var mask = new Ext.LoadMask(me.getWindowSeguimiento().down('#codigo').el,
            {msg: this.etiquetas.msgGenerandoCodigo});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'obtenerNumeroCodigo'}, me),
            params: {
                idarea: Ext.encode(records[0].data[combo.localId])
            },
            success: function (response) {
                mask.hide();
                var data = Ext.decode(response.responseText);
                me.getWindowSeguimiento().down('#codigo').setValue(data);
            },
            failure: function (response) {
                mask.hide();
                mostrarMensaje(6, me.etiquetas.msgErrorGenerandoCodigo);
            }
        });
    },

    selectMedioPago: function (combo, records) {
        this.getWindowSeguimiento().down('#idformapago').setValue(
            records[0].data['idmediodepago']);
    },

    onClickActionContratoGrid: function (button) {
        var me = this, grid = me.getContratosGrid();
        switch (button.action) {
            case 'detallescontrato':
                me.mostrarDetallesContrato();
                break;
            case 'clearfilters':
                grid.filters.clearFilters();
                break;
        }
    },

    mostrarDetallesContrato: function () {
        var me = this, grid = me.getContratosGrid();
        var record = grid.getSelectionModel().getSelection()[0];
        Ext.create('GestionContratoImportacion.view.DetailsWindow').show(record);
    },

    selectContrato: function (sm, records) {
        var me = this;
        var storeS = me.getGridSeguimiento().getStore();
        // if (storeS.isLoading()) {
        //     Ext.Ajax.abort(storeS.proxy.activeRequest);
        //     delete storeS.proxy.activeRequest;
        // }
        if (records.length == 0)
            me.getGridSeguimiento().btnAdicionarA.setDisabled(true);
        // me.getContratosGrid().btnDetails.setDisabled(records.length != 1);
        if (records.length == 1) {
            me.getGridSeguimiento().setTitle(me.etiquetas.lbTitleSeguimiento +
                ' (' + me.etiquetas.lbContrato + ': ' + (records[0].get('numero') ?
                    records[0].get('numerocontrato') : records[0].get('nombre')) + ')');
            me.getGridSeguimiento().getStore().proxy.extraParams.idcontrato = records[0].get('idcontrato')
            me.getGridSeguimiento().getStore().load();
        } else {
            me.getGridSeguimiento().setTitle(me.etiquetas.lbTitleSeguimiento);
            me.getGridSeguimiento().getStore().proxy.extraParams.idcontrato = null;
            me.getGridSeguimiento().getStore().removeAll();
        }
    },

    selectContratoWindow: function (sm, records) {
        var me = this;
        // me.getContratosGrid().btnDetails.setDisabled(records.length != 1);
        if (me.getSeleccionarContratoWindow()) {
            me.getSeleccionarContratoWindow().btnAceptar.setDisabled(records.length != 1);
        }
    },

    ButtonEnabled: function (sm, records) {

        var me = this;
        var grid = me.getGridSeguimiento();
        var accion = '';
        var len = records.length;
        // grid.btnModificarA.setDisabled(len != 1 || !this.isActionAccess('edit', records, grid))
        // grid.btnEliminarA.setDisabled(len == 0 || !this.isActionAccess('del', records, grid))
        grid.btnModificarA.setDisabled(len != 1);
        grid.btnEliminarA.setDisabled(len == 0);
        grid.btnDetailA.setDisabled(records.length != 1);
        grid.btnTrazasA.setDisabled(records.length != 1);
        grid.btnChangeStateA.setDisabled(records.length != 1);
        grid.btnPenalizacion.setDisabled(records.length != 1);
        me.createMenu();
    },

    isActionAccess: function (action, select, grid) {
        var me = this, result = true;
        if (Ext.isEmpty(select))
            return false;

        select.forEach(function (x) {
            var estados = grid.getStore().proxy.reader.jsonData.estados;
            var estadoConfig = estados[x.get('idestado')];
            if (!estadoConfig) {
                result = false;
                return false;
            }
            if (estadoConfig && estadoConfig.acciones.indexOf(action) == -1) {
                result = false;
                return false;
            }
        });
        return result;
    },

    createMenu: function () {
        var grid = this.getGridSeguimiento(),
            menu = grid.btnChangeStateA.menu,
            estados = this.getNextStates(),
            record = grid.getSelectionModel().getSelection()[0];

        menu.removeAll();
        Ext.each(estados, function (estado) {
            if (this.checkTransition(record.data.idestado, estado.idestado)) {
                menu.add({
                    text: estado.nombre,
                    iconCls: estado.icono,
                    tooltip: this.etiquetas.lbCambiarEstado + estado.nombre,
                    idestado: estado.idestado,
                    notificar: estado.notificar,
                    action: 'changestate'
                });
            }
        }, this);
        grid.btnChangeStateA.setDisabled(menu.items.length == 0);
    }
    ,

    getNextStates: function () {
        var grid = this.getGridSeguimiento(),
            store = grid.getStore(),
            record = grid.getSelectionModel().getSelection()[0],
            estados = [];

        if (!record || !record.data.idestado) {
            return;
        }
        var datos = store.proxy.reader.jsonData.estados,
            transiciones = [];
        if (datos[record.data.idestado])
            transiciones = datos[record.data.idestado]['transiciones'];
        Ext.each(transiciones, function (transicion) {
            var aux = datos[transicion['idestado']];
            aux['notificar'] = transicion['notificar'];
            estados.push(aux);
        });
        return estados;
    }
    ,

    selectFactura: function (sm, records) {
        var me = this;
        me.getGridFactura().down('#modificar').setDisabled(records.length == 0 || records.length > 1)
        me.getGridFactura().down('#eliminar').setDisabled(!records.length)
    }
    ,

    onClickActionGridSeguimiento: function (cmp) {
        var me = this;
        console.log('acciones seguimiento:', cmp.action)
        switch (cmp.action) {
            case 'adicionarA':
                this.seguimientoWindow('add', me.etiquetas.lbAddA);
                break;
            case 'trazasA':
                this.createWindowVertrazasS(cmp);
                break;
            case 'modificarA':
                this.seguimientoWindow('mod', me.etiquetas.lbModA);
                break;
            case 'detallesA':
                this.mostrarDetalles();
                break;
            case 'eliminarA':
                this.eliminarSeguimiento();
                break;
            case 'changestate':
                this.cambiarEstado(cmp);
                break;
            case 'addpenalizacionA':
                me.openWindowPenalizacion();
                break;
            case 'clearfilters':
                me.getGridSeguimiento().filters.clearFilters();
                break;
        }
    }
    ,

    seguimientoWindow: function (caso, title) {
        var me = this,
            selected = me.getContratosGrid().getSelectionModel().getSelection();
        var win = Ext.create('Seguimiento.view.WindowSeguimiento', {
            detalles: caso == 'det',
            caso: caso,
            action: caso,
            title: title,
            idcontrato: selected[0].get('idcontrato'),
            extrafields: me.getContratosGrid().extrafields,
            monedas_contrato: selected.length > 0 ? selected[0].get('monedas') : [],
            montos: me.getGridSeguimiento().montos,
        });
        win.show(null, function () {
            win.down('#gridpedidosseguimiento').getSelectionModel().on('selectionchange', function(yo, records){
                win.down('#generarfacturas').setDisabled(records.length==0);
                win.down('#detallepedidoseguimiento').setDisabled(records.length!=1);
            });
            if (selected.length > 0) {
                if (caso != 'add') {
                    var selected2 = me.getGridSeguimiento().getSelectionModel().getSelection();
                    selected2[0].data.contrato = selected[0].get('numerocontrato') ?
                        selected[0].get('numerocontrato') + ' - ' + selected[0].get('nombre') :
                        selected[0].get('nombre');
                    win.down('#gridfactura').getStore().proxy.extraParams.idarribo = selected2[0].get('idarribo');
                    win.down('#gridfactura').getStore().load({
                        callback: function () {
                            setTimeout(function () {
                                win.down('#gridfactura').getStore().loadFInish = true
                                var productos=win.down('#gridfactura').getStore().proxy.reader.jsonData.productos;
                                if(productos){
                                    if(productos.length>0)win.down('#tabproductos').setDisabled(false);
                                    win.down('#gridproductos').getStore().loadData(productos);
                                    win.down('#gridproductos').getStore().fireEvent('loaddata', win.down('#gridproductos').getStore());
                                }
                            }, 1000)
                        }
                    });
                    var cloneRecord = selected2[0].copy();
                    Ext.data.Model.id(cloneRecord);
                    cloneRecord.data.mediopago = null;
                    win.down('form').loadRecord(cloneRecord);

                    var mask = new Ext.LoadMask(win.down('#mediopago').getEl(), {msg: me.etiquetas.msgLoading});
                    mask.show();
                    win.down('#mediopago').getStore().load({
                        callback: function () {
                            mask.hide();
                            win.down('#mediopago').setValue(cloneRecord.get('idformapago'));
                            win.down('#mediopago').resetOriginalValue();
                        }
                    });
                    me.obtenerDatosHitosProductos(selected[0].get('idcontrato'), selected2[0].get('idarribo'));
                } else {
                    win.down('#idcontrato').setValue(selected[0].get('idcontrato'));
                    selected[0].get('numerocontrato') ?
                        win.down('#contrato').setValue(selected[0].get('numerocontrato') + ' - ' + selected[0].get('nombre')) :
                        win.down('#contrato').setValue(selected[0].get('nombre'));
                    me.obtenerDatosHitosProductos(selected[0].get('idcontrato'), null);
                }
                if (caso == 'det') {
                    win.btnAceptar.setVisible(false);
                    win.btnAplicar.setVisible(false);
                    win.btnCancelar.setText('Cerrar');
                    win.btnCancelar.setIconCls('icondistra-cerrar');
                    win.down('form').queryBy(function (campo) {
                        if (Ext.isFunction(campo.setReadOnly))
                            campo.setReadOnly(true);
                        if (campo.allowBlank == false) {
                            campo.labelEl.dom.innerHTML = campo.getFieldLabel() + ':';
                            campo.allowBlank = true;
                            if (Ext.isFunction(campo.validate)) campo.validate();
                        }
                    });

                }
                else {
                    setTimeout(function () {
                        win.down('#descripcion').focus();
                    }, 1000)

                }
            }
            win.doLayout();

        });
    },
    createWindowVertrazasS: function (cmp) {
        var grid = cmp.up('gridpanel'),
            record = grid.getSelectionModel().getSelection()[0];
        var win = Ext.create('Seguimiento.view.TrazasS', {
            title: this.etiquetas.lbTrazasA,
            // record: record
        }).show();
        var store = win.items.first().getStore();
        // store.load();
        store.load({params: {idarribo: record.get('idarribo')}});
    }
    ,

    eliminarSeguimiento: function () {
        var me = this;
        me.application.keyMap.disable();
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    handler: function () {
                        var grid = me.getGridSeguimiento(),
                            selected = grid.getSelectionModel().getSelection(),
                            idarribos = [];
                        selected.forEach(function (x) {
                            idarribos.push(
                                {'id': x.get('idarribo'), 'codigo': x.get('codigo')})
                        });
                        dialog.close();
                        Ext.MessageBox.show({
                            msg: me.etiquetas.msgEliminandoA,
                            wait: true,
                            waitConfig: {interval: 200}
                        });
                        Ext.Ajax.request({
                            url: UtilsFn.buildUrl({action: 'eliminarArribo'}, me),
                            params: {
                                idarribos: Ext.encode(idarribos)
                            },
                            success: function (response) {
                                me.application.keyMap.enable();
                                Ext.MessageBox.hide();
                                grid.getStore().load();
                                mostrarMensaje(1, me.etiquetas.msgEliminar);
                            },
                            failure: function (response) {
                                me.application.keyMap.enable();
                                Ext.MessageBox.hide();
                            }
                        });
                    }
                },
                {
                    text: 'Cancelar',
                    iconCls: 'cancelar',
                    handler: function () {
                        dialog.close();
                        me.application.keyMap.enable();
                    }
                }
            ]
        });
        dialog.show({
            title: me.etiquetas.lbConfirmacion,
            msg: me.etiquetas.msgEliminarA,
            icon: Ext.MessageBox.QUESTION,
        });

    }
    ,

    cambiarEstado: function (cmp) {
        var me = this,
            grid = this.getGridSeguimiento(),
            record = grid.getSelectionModel().getSelection()[0],
            idestado = cmp.idestado;
        mostrarMensaje(2, me.etiquetas.msgCambiarEstado, function (response) {
            if (response === 'ok') {
                Ext.MessageBox.show({
                    msg: me.etiquetas.lbGuardando,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'cambiarEstado'}, me),
                    params: {
                        idestado: idestado,
                        idarribo: record.data.idarribo,
                        responseCfg: {
                            action: 'edit',
                            gen: 'm',
                            concept: me.etiquetas.lbEstado,
                            count: 1
                        }
                    },
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        if (success) {
                            grid.getStore().load();
                        }
                    }
                });
            }
        });
    }
    ,

    mostrarDetalles: function () {
        var grid = this.getGridSeguimiento(),
            record = grid.getSelectionModel().getSelection()[0],
            selectedContrato=this.getContratosGrid().getSelectionModel().getSelection();
        record.data.contrato = selectedContrato[0].get('numerocontrato') ?
            selectedContrato[0].get('numerocontrato') + ' - ' + selectedContrato[0].get('nombre') :
            selectedContrato[0].get('nombre');
        Ext.create('Seguimiento.view.DetailsWindow').show(record);
    }
    ,

    onClickFacturaWindow: function (button) {
        var me = this;
        if (button.action == 'acept') {
            var windowF = button.up('window');
            windowF.btnAceptar.setDisabled(button.action != 'acept');
            windowF.btnAplicar.setDisabled(button.action != 'acept');
            // console.log('windowF',windowF)
            if (me.getGridFactura()) {
                var store = me.getGridFactura().getStore();
                if (store.find('numero',
                        windowF.down('form').down('#numero').getValue()) != -1 &&
                    windowF.down('#numero').isDirty()) {
                    windowF.down('#numero').markInvalid(me.etiquetas.msgNumeroFacturaExiste);
                    mostrarMensaje(6, me.etiquetas.msgNumeroFacturaExiste);
                } else {

                    var datos = windowF.down('form').getForm().getValues();
                    datos.archivo = windowF.archivo.getValue();

                    var doc = Ext.clone(windowF.archivo);
                    if (windowF.caso == 'mod') {
                        var select = me.getGridFactura().selModel.getSelection()[0];
                        if (doc.getValue().indexOf('fakepath') != -1) {
                            me.getWindowSeguimiento().down('#documentos_adjuntados').add(doc);
                            datos.archivoid = doc.name;
                            var document = me.getWindowSeguimiento().down('#documentos_adjuntados').query('filefield[name=' + select.get('archivoid') + ']');
                            if (document.length != 0)
                                me.getWindowSeguimiento().down('#documentos_adjuntados').remove(document[0]);
                        }
                        select.set(datos);
                    } else {
                        me.getWindowSeguimiento().down('#documentos_adjuntados').add(doc);
                        datos.archivoid = doc.name;
                        store.add(datos);
                    }
                    me.sumarImportes();

                    windowF.close();
                }
            }
        } else if (button.action == 'showfile') {
            var selected = me.getGridFactura().selModel.getSelection(),
                url = selected[0].get('archivo');
            if (url) {
                window.open(url);
            } else {
                mostrarMensaje(6, me.etiquetas.msgErrorNoFile);
            }
        }
    }
    ,

    obtenerDatosHitosProductos: function (idcontrato, idarribo) {
        // GestionContratoImportacion
        var me = this,
            winseguimiento = me.getWindowSeguimiento(),
            cargandoDatosAdicionales = true;
        winseguimiento.down('#gridpedidosseguimiento').on('render', function () {
            if (cargandoDatosAdicionales) {
                winseguimiento.down('#gridpedidosseguimiento').maskL = new Ext.LoadMask(
                    winseguimiento.down('#gridpedidosseguimiento'), {msg: me.etiquetas.msgLoading});
                winseguimiento.down('#gridpedidosseguimiento').maskL.show();
            }
        });

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getDatosAdicionales'}, ModuleMgr.get('Seguimiento')),
            params: {
                idcontrato: idcontrato,
                idarribo: idarribo
            },
            scope: this,
            callback: function (options, success, response) {
                cargandoDatosAdicionales = false;

                if (winseguimiento.down('#gridpedidosseguimiento').maskL) winseguimiento.down('#gridpedidosseguimiento').maskL.hide();
                var response = Ext.decode(response.responseText);

                winseguimiento.down('#comparar').setDisabled(false);
                winseguimiento.down('#compararcontrato').setDisabled(false);

                if(winseguimiento.down('#gridpedidosseguimiento') && response.data && response.data['pedidos']){
                    var pedidos=me.obtenerPedidosConFactura();
                    response.data['pedidos'].forEach(function (x) {
                        // if(pedidos.indexOf(x['idpedido'])==-1)
                        var productos=Ext.decode(x['productos']),
                            montototal=0, canttotal=0;
                        x['cantprod'] = productos.length;
                        productos.forEach(function(y){
                            montototal+=parseFloat(y['precio'])*y['cantidad'];
                            canttotal+=y['cantidad'];
                        });
                        x['montototal'] = montototal;
                        x['canttotalprod'] = canttotal;
                        x['estilo'] = pedidos.indexOf(x['idcontratopedido'])!=-1?'eliminado':'';
                    });
                    winseguimiento.down('#gridpedidosseguimiento').getStore().loadData(response.data['pedidos']);
                }

                // if (response.data['productos']) {
                winseguimiento.productoscontrato=response.data['productos'];
                // }
                if (response.data && winseguimiento.down('#productos')) {
                    if (response.data['productos']) {
                        var store = winseguimiento.down('#productos').store;
                        Ext.each(response.data['productos'], function (value, key) {
                            response.data['productos'][key]['datos_json_encode'] = value['datos_json'];
                            response.data['productos'][key]['datos_json'] = Ext.decode(value['datos_json']);
                        });
                        store.loadData(response.data['productos']);
                        winseguimiento.down('#productos').datosLoad = response.data['productos'];
                        store.fireEvent('loaddata', store);
                        store.fireEvent('update', store);
                        if (datosseguimiento && datosseguimiento.data.indicadores != 'null') {
                            var producto = Ext.decode(datosseguimiento.data.producto);
                            if (producto != null && producto.length > 0) {
                                if (winseguimiento.down('#tabproductos').rendered) {
                                    store.getRange().forEach(function (x) {
                                        if (producto.indexOf(parseInt(x.get('idindicadorcontrato'))) != -1) {
                                            winseguimiento.down('#productos').getSelectionModel().select(x, true);
                                        }
                                    });
                                } else {
                                    winseguimiento.down('#tabproductos').on('render', function () {
                                        store.getRange().forEach(function (x) {
                                            if (producto.indexOf(parseInt(x.get('idindicadorcontrato'))) != -1) {
                                                winseguimiento.down('#productos').getSelectionModel().select(x, true);
                                            }
                                        });
                                    });
                                }

                            }
                        }
                    }
                }
            }
        });
    },

    sumarImportes: function () {
        var me = this,
            totalescontainer = me.getWindowSeguimiento().down('#totalesAPagar');
        totalescontainer.queryBy(function (x) {
            if (Ext.isFunction(x.setValue))
                x.setValue(0);
        });
        me.getGridFactura().getStore().getRange().forEach(function (obj) {
            Ext.Object.each(obj.data, function (key, value) {
                if (key.indexOf('importe_') == 0) {
                    var moneda = key.split('importe_')[1];
                    var campo = totalescontainer.down('#importepagar' + moneda);
                    if (campo && value) {
                        campo.setValue(
                            parseFloat(campo.getValue()) + parseFloat(value)
                        );
                    }
                }
            })
        });

        totalescontainer.queryBy(function (x) {
            if (Ext.isFunction(x.setValue))
                x.setValue(Ext.util.Format.currency(x.getValue()));
        });

    }
    ,

    onClickSeguimientoWindow: function (button) {
        var me = this, window = button.up('window'),
            form = window.down('form').getForm(), facmodi = [], facdel = [], facturas = {},
            pedidos = [], productos = {guardados: [], eliminados: []};
        if (button.action == 'acept' || button.action == 'apply') {
            // var productos = me.getProductos();
            window.down('#gridpedidosseguimiento').getSelectionModel().getSelection().forEach(function(x){
                pedidos.push(x.get('idcontratopedido'));
            });
            if (me.getGridFactura()) {
                var store = me.getGridFactura().getStore();
                store.getModifiedRecords().forEach(function (obj) {
                    var monedas = [];
                    window.extrafields.forEach(function (valor) {
                        Ext.Object.each(obj.data, function (key, value) {
                            if (value && key == 'importe_' + valor['codigoiso'].toLowerCase()) {
                                monedas.push({
                                    'moneda': valor['codigoiso'],
                                    'idmoneda': valor['idmoneda'],
                                    'valor': value,
                                });
                            }
                        });
                    });
                    var datos=obj.data;
                    datos['monedas']=monedas;
                    facmodi.push(datos);
                    // facmodi.push({
                    //     'idfacturaarribo': obj.get('idfacturaarribo'),
                    //     'numero': obj.get('numero'),
                    //     'archivo': obj.get('archivo'),
                    //     'monedas': monedas,
                    //     'archivoid': obj.get('archivoid'),
                    //     'idnodoarchivo': obj.get('idnodoarchivo'),
                    // });
                });
                store.getRemovedRecords().forEach(function (obj) {
                    facdel.push({
                        'idfacturaarribo': obj.get('idfacturaarribo'),
                        'idnodoarchivo': obj.get('idnodoarchivo'),
                    });
                });
                facturas = {'modificadas': facmodi, 'eliminadas': facdel};
            }
            window.down('#gridproductos').getStore().getRange().forEach(function(x){
                productos['guardados'].push(x.data);
            })
            if (form.isValid()) {
                Ext.MessageBox.show({
                    msg: me.etiquetas.lbGuardando,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });
                form.submit({
                    url: UtilsFn.buildUrl({action: 'guardarArribo'}, me),
                    params: {
                        pedidos: pedidos.toString(),
                        productos: Ext.encode(productos),
                        facturas: Ext.encode(facturas)
                    },
                    success: function (form, action) {
                        Ext.MessageBox.hide();
                        var json = Ext.JSON.decode(action.response.responseText);
                        if (!json.gestordoc && json.archivos > 0)
                            mostrarMensaje(8, me.etiquetas.msgNoGuardarDocumentogestorDoc);
                        if (button.action == 'acept') {
                            window.close();
                        } else {
                            me.getGridFactura().getStore().removeAll();
                            var contrato = window.down('#contrato').getValue(),
                                idcontrato = window.down('#idcontrato').getValue();
                            form.reset();
                            window.down('#contrato').setValue(contrato);
                            window.down('#idcontrato').setValue(idcontrato);
                            window.down('#documentos_adjuntados').removeAll();
                            form.clearInvalid();
                        }
                        mostrarMensaje(1, window.caso == 'add' ? me.etiquetas.msgAdicionar : me.etiquetas.msgModificar);
                        me.getGridSeguimiento().getStore().load();
                    },
                    failure: function (form, action) {
                        Ext.MessageBox.hide();
                    }
                });
            } else {
                mostrarMensaje(6, me.etiquetas.msgFormularioInvalido);
            }
        } else if (button.action == 'detallescontrato') {
            me.onClickActionContratoGrid(button);
        } else if (button.action == 'seleccioncontrato') {
            Ext.create('Seguimiento.view.WindowSeleccionarContrato').show();
        } else if (button.action == 'generarfacturas') {
            me.generarFacturasAutomaticamente();
        } else if (button.action == 'compararcontrato') {
            me.comparar(button);
        } else if (button.action == 'compararpedido') {
            me.comparar(button);
        } else if(button.action=='volverpedidos'){
            me.volverPedidos(button);
        } else if (button.action == 'detallepedidoseguimiento') {
            var grid=button.up('window').down('#gridpedidosseguimiento');
            grid.fireEvent('itemdblclick', grid, grid.getSelectionModel().getSelection()[0]);
        }
    },

    getProductos: function () {
        var grid = this.getWindowSeguimiento().down('#productos');
        store = grid.store,
            cant = store.data.items[0].data.cantidad,
            modificados = new Array();

        Ext.each(store.getNewRecords(), function (valor) {
            modificados.push(valor.data);
        });
        Ext.each(store.getModifiedRecords(), function (valor) {
            if (modificados.indexOf(valor.data) == -1) {
                var cloneRecord = valor.copy();
                Ext.data.Model.id(cloneRecord);
                cloneRecord.data.datos_json = Ext.decode(cloneRecord.data.datos_json);
                modificados.push(cloneRecord.data);
            }
        });
        return {
            guardados: modificados
        };
    },

    existeCodigo: function (codigo, idarribo) {
        var me = this, existe = false;
        me.getGridSeguimiento().getStore().getRange().forEach(function (obj) {
            if (obj.get('codigo') == codigo && obj.get('idarribo') != idarribo) existe = true;
        });
        return existe;
    }
    ,

    generarFacturasAutomaticamente: function () {
        var me = this,
            gridfactura = me.getGridFactura(),
            tabPanel = me.getWindowSeguimiento().down('#tabpanel');
        if (gridfactura.getStore().getCount() > 0) {
            var dialog = Ext.create('Ext.window.MessageBox', {
                buttonAlign: 'center',
                buttons: [
                    {
                        text: 'Aceptar',
                        iconCls: 'aceptar',
                        handler: function () {
                            me.generarFacturas();
                            dialog.close();
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
                msg: 'Ya existen facturas insertadas si continua estas se perder&aacute;n.<br>' +
                '¿Est&aacute; seguro que desea continuar?',
                icon: Ext.MessageBox.QUESTION,
            });
        } else {
            me.generarFacturas();
        }
    }
    ,

    generarFacturas: function () {
        var me = this,
            seguimientoWindow = me.getWindowSeguimiento(),
            gridfactura = me.getGridFactura(),
            storeFacturas = gridfactura.getStore(),
            tabPanel = seguimientoWindow.down('#tabpanel'),
            gridActivo = seguimientoWindow.down('#gridpedidosseguimiento'),
            cont = 0, exists=[];
        storeFacturas.removeAll();
        //x.get('estilo')=='eliminado'
        gridActivo.getSelectionModel().getSelection().forEach(function (x) {
            if(x.get('estilo')=='eliminado'){
                exists.push(x.get('descripcion'))
            }else{
                cont++;
                var datos = {
                    'numero': cont,
                    'importecup': x.get('montototal'),
                    'importecuc': 0
                };
                storeFacturas.add(datos);
                storeFacturas.fireEvent('datachanged', storeFacturas);
            }
        });
        if(cont>0){
            tabPanel.down('#tabfacturas').setDisabled(false);
            tabPanel.setActiveTab('tabfacturas');
            tabPanel.down('#tabpedido').setDisabled(true);
        }
        if(exists.length>0)
            mostrarMensaje(7, 'Ya se encuentran adicionados a otros arribos los siguientes pedidos:<br>-'+
                exists.join('<br>-'));

    },

    onClickSeleccionarContrato: function (button) {
        var me = this, window = button.up('window');
        switch (button.action) {
            case 'acept':
                if (me.getWindowSeguimiento()) {
                    var win = me.getWindowSeguimiento(),
                        selected = window.down('grid').getSelectionModel().getSelection();
                    win.down('#idcontrato').setValue(selected[0].get('idcontrato'));
                    selected[0].get('numerocontrato') ?
                        win.down('#contrato').setValue(selected[0].get('numerocontrato') + ' - ' + selected[0].get('nombre')) :
                        win.down('#contrato').setValue(selected[0].get('nombre'));
                    me.getMainPanel().down('#contratosgrid').getSelectionModel().select(selected[0]);
                    win.monedas_contrato = selected[0].get('monedas');
                    win.configurarMontos();
                    me.sumarImportes();
                }
                window.close();
                break;
        }
    },

    onClickActionGridFactura: function (cmp) {
        var me = this;
        switch (cmp.action) {
            case 'detfactura':
                this.WindowFactura('det', me.etiquetas.lbDetFactura);
                break;
            case 'addfactura':
                this.WindowFactura('add', me.etiquetas.lbAddFactura);
                break;
            case 'modfactura':
                this.WindowFactura('mod', me.etiquetas.lbModFactura);
                break;
            case 'delfactura':
                this.delFactura();
                break;
        }
    }
    ,

    WindowFactura: function (caso, title) {
        var me = this, gridfactura = me.getGridFactura(), windowseguimiento = me.getWindowSeguimiento(),
            selected = gridfactura.selModel.getSelection();
        var win = Ext.create('Seguimiento.view.WindowFactura', {
            detalles: caso == 'det',
            title: title,
            caso: caso,
            extrafields: gridfactura.extrafields,
            monedas_contrato: gridfactura.monedas_contrato,
            totales: gridfactura.up('window').down('#totalesAPagar'),
            montos: windowseguimiento.montos,
            selected: selected,
            gridfactura: gridfactura
        });
        win.show(null, function () {
            if (caso != 'add' && selected.length == 1) {
                win.down('form').loadRecord(selected[0]);
                if (selected[0].get('archivoNombre')) {
                    win.archivo.setRawValue(selected[0].get('archivoNombre'));
                    if (selected[0].get('idespaciotrabajo') && selected[0].get('archivo'))
                        win.down('#mostrarArchivo').setVisible(true);
                }
                if (gridfactura.getStore().proxy.reader.jsonData)
                    if (gridfactura.getStore().proxy.reader.jsonData.gestordoc == false && !selected[0].get('selected')) {
                        mostrarMensaje(1, me.etiquetas.msgNoDocumentogestorDoc);
                    }
            } else if (caso == 'add') {
            }
        });
    }
    ,

    delFactura: function () {
        var me = this;
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    handler: function () {
                        var selected = me.getGridFactura().selModel.getSelection();
                        me.getGridFactura().getStore().remove(selected);
                        me.sumarImportes();

                        selected.forEach(function (x) {
                            if (me.getWindowSeguimiento().down('#documentos_adjuntados').query('filefield[name=doc_' + x.get('numero') + ']').length > 0) {
                                me.getWindowSeguimiento().down('#documentos_adjuntados').remove(
                                    me.getWindowSeguimiento().down('#documentos_adjuntados').query('filefield[name=doc_' + x.get('numero') + ']')[0]
                                );
                            }
                        });
                        dialog.close();
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
            msg: me.etiquetas.msgEliminarFactura,
            icon: Ext.MessageBox.QUESTION,
        });
    }
    ,

    afterLoadContratos: function (store, records, success) {
        if (success) {
            var grid = this.getContratosGrid();
            if (!grid.extrafields) {
                this.addExtraColumns(grid);
            }
        }
    }
    ,

    addExtraColumns: function (grid) {
        var store = grid.getStore();
        fields = store.model.getFields(),
            jsondata = store.proxy.reader.jsonData,
            extrafields = grid.extrafields = jsondata.monedasentidad,
            data = jsondata.data,
            columns = grid.columns,
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
            newcolumns = this.insertColumnsCoins(newcolumns, extrafields, pos);
            var width = grid.getWidth() + (extrafields.length * 80);
            grid.reconfigure(null, newcolumns);
        }
    }
    ,

    insertColumnsCoins: function (newcolumns, extrafields, pos) {
        Ext.each(extrafields, function (field) {
            newcolumns.splice(pos, 0, {
                dataIndex: 'montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda,
                text: field.codigoiso.toUpperCase(),
                width: 70,
                minWidth: 50,
                align: 'right',
                groupable: false,
                filter: {
                    type: 'numeric'
                },
                renderer: function (value, meta) {
                    if (Ext.isEmpty(value)) {
                        value = 0;
                    }
                    value = Ext.util.Format.currency(value);
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
    }
    ,

    grantActions: function (panel) {
        this.validateGrantedActions({container: panel});
        this.loadConf(panel);
    }
    ,

    loadConf: function (panel) {
        var mask = new Ext.LoadMask(this.getMainPanel(), {msg: this.etiquetas.msgLoading});
        mask.show();
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getConfiguraciones'}, this),
            scope: this,
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                this.application.comite = {
                    transitions: response.transitions
                };
                mask.hide();
                panel.down('gridContratosImportacion').getStore().load();
            }
        });
    }
    ,

    checkTransition: function (idestadoinicial, idestadofinal) {
        var exist = false,
            comite = this.application.comite,
            activo = this.application.crm.activeModules.Comite;
        if (activo == "true" && comite && comite.transitions) {
            for (var k in comite.transitions) {
                var transition = comite.transitions[k];
                if (transition.idestadoinicial == idestadoinicial && transition.idestadofinal == idestadofinal &&
                    transition.aliasproceso == 'seguimiento') {
                    exist = true;
                }
            }
        }

        if (!exist) {
            return true;
        }
        return false;
    },
    volverPedidos: function(btn){
        var me=this, grid = btn.up('grid'), tabpanel=grid.up('#tabpanel');
        if(grid.getStore().getCount()>0){
            var dialog = Ext.create('Ext.window.MessageBox', {
                buttonAlign: 'center',
                buttons: [
                    {
                        text: 'Aceptar',
                        iconCls: 'aceptar',
                        handler: function () {
                            grid.getStore().removeAll();
                            tabpanel.down('#tabpedido').setDisabled(false);
                            tabpanel.setActiveTab('tabpedido');
                            tabpanel.down('#tabfacturas').setDisabled(true);
                            dialog.close();
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
                msg: 'Si elige continuar se perderan todas las facturas registradas.',
                icon: Ext.MessageBox.QUESTION,
            });
        }else{
            grid.getStore().removeAll();
            tabpanel.down('#tabpedido').setDisabled(false);
            tabpanel.setActiveTab('tabpedido');
            tabpanel.down('#tabfacturas').setDisabled(true);
        }

    },
    itemContextMenu: function(view, list, node, rowIndex, e){
        var me=this,
            grid=view.up('grid'),
            selected = grid.getStore().getAt(rowIndex),
            // selected = grid.getSelectionModel().getLastSelected(),
            items=[];
        e.stopEvent();
        grid.down('#tbarseguimiento').items.items.forEach(function(x){
            if(!x.isHidden() && !x.isDisabled() && (x.xtype=='button' || x.xtype=='menuitem') &&
                ['adicionarA', 'cambiarestado'].indexOf(x.selector)==-1){
                if(!x.menu) {
                    var config=me.crearCopia(x);
                    if(config)items.push(config);
                }else{
                    x.menu.items.items.forEach(function(y){
                        if(!y.isHidden() && !y.isDisabled()){
                            var config=me.crearCopia(y);
                            if(config)items.push(config);
                        }
                    })
                }
            }
        });
        if(selected.get('cantpenalidades')>0){
            items.push({
                xtype: 'menuitem',
                text: 'Ver penalidades',
                iconCls: 'detalles',
                handler: function(){
                    me.verPenalizaciones(selected);
                }
            })
        }
        if(items.length>0){
            grid.contextMenu = Ext.create('Ext.menu.Menu', {
                plain: true,
                items: items
            });
        }
        if (grid.contextMenu.items.length > 0)
            grid.contextMenu.showAt(e.getXY());
    },
    crearCopia: function(x){
        var me=this;
        var config = me.cloneObject(x.initialConfig);
        // console.log('config:', config)
        if (config) {
            config.xtype = 'menuitem';
            config.id = 'menu' + (config.id || Ext.id());
            config.disabled = x.isDisabled();
            config.hidden = x.isHidden();
            return config;
        }
        return null;
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
    obtenerPedidosConFactura: function(){
        var me=this, grid=me.getGridSeguimiento(), pedidos=[];
        grid.getStore().getRange().forEach(function(x){
            if(x.get('pedidos'))
                pedidos=pedidos.concat(x.get('pedidos').split(','))
        });
        return pedidos;
    },
    verPenalizaciones: function(selected){
        // alert('Tiene penalizaciones. Seguro seguro');
        var me=this;
        var win=Ext.create('Ext.window.Window',{
            title: 'Penalizaciones del arribo',
            layout: 'fit',
            modal: true,
            width: window.innerWidth*0.8,
            height: 400,
            items:[
                Ext.create('Penalizaciones.view.Penalizaciones',{
                    closable: false,
                    selType: 'rowmodel'
                })
            ],
            buttons:[
                {
                    text: me.etiquetas.lbBtnCerrar,
                    iconCls: 'icondistra-cerrar',
                    tooltip: me.etiquetas.qtipCerrar,
                    action: 'cerrar',
                    handler: function(){win.close()}
                }
            ]
        });
        win.show(null, function(){
            var grid=win.down('grid');
            // grid.title='';

            with(grid.getStore()){
                // if(isLoading()){
                //     Ext.Ajax.abort(proxy.activeRequest);
                //     delete proxy.activeRequest;
                // }
                proxy.extraParams['filter[0][field]'] = 'idarribo';
                proxy.extraParams['filter[0][data][type]'] = 'number';
                proxy.extraParams['filter[0][data][value]'] = selected.get('idarribo');
                load();
            }
            grid.dockedItems.getAt(0).setVisible(false);
            grid.dockedItems.getAt(2).setVisible(false);
            grid.dockedItems.getAt(4).setVisible(false);
        });
    },
    openWindowPenalizacion: function(){
        var me=this, grid=me.getGridSeguimiento(), selected=grid.getSelectionModel().getSelection();
        var win=Ext.create('Penalizaciones.view.WinEditPenalizacion',{
            width: 850,
            height: null,
            // height: 200,
            action: 'add',
            title: 'Adicionar penalización',
            modificar: false
        });
        win.show();
        me.ajustesVentanaPenalidad(win, selected);
        win.down('#btnaceptar').on('click',function(){
            win.on('close', function(){grid.getStore().load();})
        });
        win.down('#btnaplicar').on('click',function(){
            win.on('close', function(){grid.getStore().load();});
            win.down('form').getForm().findField('idtipopenalidad').on('change', function(yo){
                setTimeout(function(){
                    if(!yo.getValue() && !win.down('form').getForm().findField('idcontrato').getValue()) {
                        me.ajustesVentanaPenalidad(win, selected);
                    }
                }, 300)
            });
        });
    },
    ajustesVentanaPenalidad: function(win, selected){
        var mask = new Ext.LoadMask(win.down('form'), {msg: this.etiquetas.msgLoading});
        mask.show();
        win.down('form').getForm().findField('idarribo').getStore().on('load', function(){
            mask.hide();
        });
        win.down('form').getForm().findField('idarribo').getStore().load();
        win.down('form').getForm().findField('idarribo').setDisabled(false);
        win.down('form').getForm().findField('idtipopenalidad').setDisabled(false);
        win.down('form').getForm().findField('idcontrato').setReadOnly(true);
        win.down('form').getForm().findField('idarribo').setReadOnly(true);
        win.down('form').getForm().findField('idcontrato').setValue(selected[0].get('idcontrato'));
        win.down('form').getForm().findField('idarribo').setValue(selected[0].get('idarribo'));
    },
    comparar: function(button){
        console.log('COmparar')
        var me=this,
            // extrafields: me.getContratosGrid().extrafields,
            // win=Ext.create('Ext.window.Window', {
            win=Ext.create('Ext.ux.CustomWindow', {
                title: 'Comparar',
                width: window.innerWidth*0.95,
                height: window.innerHeight*0.95,
                minHeight: 450,
                // modal: true,
                // resizable: false,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [
                    {
                        xtype: 'toolbar',
                        items:[
                            {
                                text: 'Comparar',
                                tooltip: 'Comparar los productos con los recibidos',
                                iconCls: 'comparar',
                                itemId: 'comparar',
                                disabled: true,
                                handler: function(){
                                    var mask = new Ext.LoadMask(win, {msg: me.etiquetas.msgLoading});
                                    mask.show();
                                    var storeencontrato=win.down('#encontrato').getStore(),
                                        storerecibido=win.down('#recibido').getStore(),
                                        encontrato=storeencontrato.getRange(),
                                        faltantes=[], correctos=[], incorrectos=[], nuevos=[], cambios=[];
                                    storerecibido.getRange().forEach(function(x){
                                        x.set('estilo', null);
                                    })
                                    encontrato.forEach(function(x){
                                        var record=storerecibido.findRecord('codigo', x.get('codigo').trim(), 0, false, true, true);
                                        if(record){
                                            var detalles='',
                                                cantidad_correcta=x.get('cantidad')==record.get('cantidad'),
                                                montos_correctos=true;
                                            if(!cantidad_correcta) {
                                                if(x.get('cantidad')>record.get('cantidad')){
                                                    detalles += '<br><span style="color: #d79655">La cantidad solicitada es mayor que la recibida. (' +
                                                        x.get('cantidad') + ' / ' + record.get('cantidad') + ')</span>';
                                                }else {
                                                    detalles += '<br><span style="color: #ff5651">La cantidad solicitada es menor que la recibida. (' +
                                                        x.get('cantidad') + ' / ' + record.get('cantidad') + ')</span>';
                                                }
                                            }else{
                                                detalles +='<br><span style="color: green">Coinciden las cantidades ('+x.get('cantidad')+')</span>';
                                            }
                                            Ext.Object.each(x.data, function(key, value){
                                                if (key.indexOf('montomoneda_') == 0) {
                                                    if(value!=0) {
                                                        if (value != record.get(key)) {
                                                            montos_correctos = false;
                                                            detalles += '<br><span style="color: #d79655">Los montos ' + key.split('_')[1].toUpperCase() + ' no coinciden. (' +
                                                                Ext.util.Format.number(value, '0.000,00/i') + ' / ' + Ext.util.Format.number(record.get(key), '0.000,00/i') + ')</span>';
                                                        } else {
                                                            detalles += '<br><span style="color: green">Los montos ' + key.split('_')[1].toUpperCase() + ' coinciden (' +
                                                                Ext.util.Format.number(value, '0.000,00/i') + ')</span>';
                                                        }
                                                    }
                                                    // else{
                                                    //     if(record.get(key)!=0)
                                                    //         detalles += '<br><span style="color: #d79655">No se enviaron los montos ' + key.split('_')[1].toUpperCase() +
                                                    //             ' aunque existen en la petición original. (' + Ext.util.Format.number(record.get(key), '0.000,00/i') + ')</span>';
                                                    // }
                                                }
                                            })

                                            if(!cantidad_correcta || !montos_correctos){
                                                x.set('detalles', '<span style="color: green">Coincide el código con el producto recibido #'+record.get('numero')+'. ('+x.get('codigo')+')</span>'+detalles);
                                                if(x.get('cantidad')<record.get('cantidad')){
                                                    x.set('estilo', 'incorrecto');
                                                    record.set('estilo', 'incorrecto');
                                                    incorrectos.push(x.data);
                                                }else{
                                                    x.set('estilo', 'regular');
                                                    record.set('estilo', 'regular');
                                                    cambios.push(x.data);
                                                }
                                                // if(montos_correctos && x.get('cantidad')>record.get('cantidad')){
                                                //     x.set('estilo', 'regular');
                                                //     record.set('estilo', 'regular');
                                                //     cambios.push(x.data);
                                                // }else{
                                                //     x.set('estilo', 'incorrecto');
                                                //     record.set('estilo', 'incorrecto');
                                                //     incorrectos.push(x.data);
                                                // }
                                            }else{
                                                x.set('estilo', 'correcto');
                                                x.set('detalles', '<span style="color: green">Coincide el código con el producto recibido #'+record.get('numero')+'. ('+x.get('codigo')+')</span>'+detalles);
                                                record.set('estilo', 'correcto');
                                                correctos.push(x.data);
                                            }
                                        }else{
                                            x.set('estilo', 'eliminado');
                                            x.set('detalles', '<span style="color: grey">No se halla su código entre los recibidos. ('+x.get('codigo')+')</span>')
                                            faltantes.push(x.data);
                                        }
                                    })
                                    storerecibido.getRange().forEach(function(x){
                                        console.log(x.get('denominacion'), x.get('estilo'), x.get('estilo')=='', x.get('estilo')==null)
                                        if(x.get('estilo')==null){
                                            x.set('estilo', 'contractcolor')
                                            x.set('detalles', '<b style="color: black">El código de este producto no coincide con ninguno de los solicitados.</b>')
                                            nuevos.push(x.data);
                                        }
                                        // else if(x.get('estilo')===''){
                                        //     x.set('estilo', null)
                                        // }
                                    })
                                    var tabpanel=win.down('#tabpanel');
                                    me.cerrarTabsSeparados(win);
                                    console.log(correctos.length, cambios.length, incorrectos.length, faltantes.length, nuevos.length)
                                    if(correctos.length){
                                        if(!win.down('#correctos'))
                                            tabpanel.add({
                                                title: '<b style="color:green">Correctos ('+correctos.length+')</b>',
                                                itemId: 'tabcorrectos',
                                                // closable: true,
                                                items: [
                                                    Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto',{
                                                        itemId: 'correctos',
                                                        flex: 1,
                                                        editGrid: false,
                                                        sinAcciones: true,
                                                        monedasentidad: button.up('window').extrafields,
                                                        buttonExp: true,
                                                        indicadorStoreId: 'storecorrectos',
                                                        visibleColumns: ['numero', 'codigo', 'denominacion', 'cantidad',
                                                            'total', 'importe', 'tipo', 'monedas'],
                                                        listeners: {
                                                            itemdblclick: function(yo, record){
                                                                win.down('#detallescomparacion').fireEvent('click');
                                                            },
                                                            selectionchange: function(yo, records){
                                                                win.down('#detallescomparacion').setDisabled(records.length!=1);
                                                            }
                                                        }
                                                    }),
                                                ],
                                            });
                                        win.down('#correctos').getStore().loadData(correctos);
                                        win.down('#correctos').getStore().fireEvent('loaddata', win.down('#correctos').getStore());
                                    }
                                    if(cambios.length){
                                        if(!win.down('#cambios'))
                                            tabpanel.add({
                                                title: '<b style="color:#d79655">Con cambios ('+cambios.length+')</b>',
                                                itemId: 'tabcambios',
                                                // closable: true,
                                                items: [
                                                    Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto',{
                                                        itemId: 'cambios',
                                                        flex: 1,
                                                        editGrid: false,
                                                        sinAcciones: true,
                                                        monedasentidad: button.up('window').extrafields,
                                                        buttonExp: true,
                                                        indicadorStoreId: 'storecambios',
                                                        visibleColumns: ['numero', 'codigo', 'denominacion', 'cantidad',
                                                            'total', 'importe', 'tipo', 'monedas'],
                                                        listeners: {
                                                            itemdblclick: function(yo, record){
                                                                win.down('#detallescomparacion').fireEvent('click');
                                                            },
                                                            selectionchange: function(yo, records){
                                                                win.down('#detallescomparacion').setDisabled(records.length!=1);
                                                            }
                                                        }
                                                    }),
                                                ]
                                            });
                                        win.down('#cambios').getStore().loadData(cambios);
                                        win.down('#cambios').getStore().fireEvent('loaddata', win.down('#cambios').getStore());
                                    }
                                    if(incorrectos.length){
                                        if(!win.down('#incorrectos'))
                                            tabpanel.add({
                                                title: '<b style="color:#ff5651">Incorrectos ('+incorrectos.length+')</b>',
                                                itemId: 'tabincorrectos',
                                                // closable: true,
                                                items: [
                                                    Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto',{
                                                        itemId: 'incorrectos',
                                                        flex: 1,
                                                        editGrid: false,
                                                        sinAcciones: true,
                                                        monedasentidad: button.up('window').extrafields,
                                                        buttonExp: true,
                                                        indicadorStoreId: 'storeincorrectos',
                                                        visibleColumns: ['numero', 'codigo', 'denominacion', 'cantidad',
                                                            'total', 'importe', 'tipo', 'monedas'],
                                                        listeners: {
                                                            itemdblclick: function(yo, record){
                                                                win.down('#detallescomparacion').fireEvent('click');
                                                            },
                                                            selectionchange: function(yo, records){
                                                                win.down('#detallescomparacion').setDisabled(records.length!=1);
                                                            }
                                                        }
                                                    }),
                                                ]
                                            });
                                        // console.log('Incorrectos:', incorrectos)
                                        win.down('#incorrectos').getStore().loadData(incorrectos);
                                        win.down('#incorrectos').getStore().fireEvent('loaddata', win.down('#incorrectos').getStore());
                                    }
                                    if(faltantes.length){
                                        if(!win.down('#faltantes'))
                                            tabpanel.add({
                                                title: '<b style="color:grey">Faltantes ('+faltantes.length+')</b>',
                                                itemId: 'tabfaltantes',
                                                // closable: true,
                                                items: [
                                                    Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto',{
                                                        itemId: 'faltantes',
                                                        flex: 1,
                                                        editGrid: false,
                                                        sinAcciones: true,
                                                        monedasentidad: button.up('window').extrafields,
                                                        buttonExp: true,
                                                        indicadorStoreId: 'storefaltantes',
                                                        visibleColumns: ['numero', 'codigo', 'denominacion', 'cantidad',
                                                            'total', 'importe', 'tipo', 'monedas'],
                                                        listeners: {
                                                            itemdblclick: function(yo, record){
                                                                win.down('#detallescomparacion').fireEvent('click');
                                                            },
                                                            selectionchange: function(yo, records){
                                                                win.down('#detallescomparacion').setDisabled(records.length!=1);
                                                            }
                                                        }
                                                    })
                                                ]
                                            });
                                        win.down('#faltantes').getStore().loadData(faltantes);
                                        win.down('#faltantes').getStore().fireEvent('loaddata', win.down('#faltantes').getStore());
                                    }
                                    if(nuevos.length){
                                        if(!win.down('#nuevos'))
                                            tabpanel.add({
                                                title: '<b style="color:black">Nuevos ('+nuevos.length+')</b>',
                                                itemId: 'tabnuevos',
                                                // closable: true,
                                                items: [
                                                    Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto',{
                                                        itemId: 'nuevos',
                                                        flex: 1,
                                                        editGrid: false,
                                                        sinAcciones: true,
                                                        monedasentidad: button.up('window').extrafields,
                                                        buttonExp: true,
                                                        indicadorStoreId: 'storenuevos',
                                                        visibleColumns: ['numero', 'codigo', 'denominacion', 'cantidad',
                                                            'total', 'importe', 'tipo', 'monedas'],
                                                        listeners: {
                                                            itemdblclick: function(yo, record){
                                                                win.down('#detallescomparacion').fireEvent('click');
                                                            },
                                                            selectionchange: function(yo, records){
                                                                win.down('#detallescomparacion').setDisabled(records.length!=1);
                                                            }
                                                        }
                                                    }),
                                                ]
                                            });
                                        win.down('#nuevos').getStore().loadData(nuevos);
                                        win.down('#nuevos').getStore().fireEvent('loaddata', win.down('#nuevos').getStore());
                                    }
                                    win.btnAceptar.setDisabled(false);
                                    mask.hide();
                                }
                            },
                            {
                                text: 'Detalles',
                                tooltip: 'Detalles de la comparación',
                                itemId: 'detallescomparacion',
                                iconCls: 'detalles',
                                disabled: true,
                                listeners: {
                                    click: function(){
                                        var selected=win.down('#tabpanel').getActiveTab().down('grid').getSelectionModel().getLastSelected();
                                        // console.log('oo:', selected.get('detalles'), ':',
                                        //     selected.data.detalles, ':',selected.raw.detalles, ':')
                                        if(selected) {
                                            var win2 = Ext.create('Ext.window.Window', {
                                                title: 'Detalles',
                                                width: 450,
                                                height: 150,
                                                layout: 'fit',
                                                modal: true,
                                                items: [
                                                    {
                                                        xtype: 'panel',
                                                        bodyStyle: 'padding: 8',
                                                        html: selected.get('detalles') ? selected.get('detalles') : 'No se ha realizado ninguna comparación aún.'
                                                    }
                                                ],
                                                buttons: [{
                                                    text: me.etiquetas.lbBtnCerrar,
                                                    iconCls: 'icondistra-cerrar',
                                                    tooltip: me.etiquetas.qtipCerrar,
                                                    handler: function () {
                                                        win2.close();
                                                    }
                                                }]
                                            })
                                            win2.show();
                                        }
                                    }
                                }
                            },
                            '->',
                            Ext.create('Ext.button.Button',{
                                text: 'Leyenda',
                                iconCls: 'inf',
                                menu: Ext.create('Ext.menu.Menu',{
                                    plain: true,
                                    bodyStyle: 'background:#DFE9F6;',
                                    style: 'background:#DFE9F6;',
                                    defaults:{
                                        // bodyStyle: 'background:#DFE9F6;',
                                        style: 'background:#DFE9F6;',
                                        xtype: 'label',
                                        styleHtmlContent: true,
                                        // padding: 1,
                                    },
                                    items: [
                                        {
                                            html: '<span class="correcto"><h2 style="font-size: 14px" class="x-grid-cell">&nbsp;Correcto&nbsp;</h2></span>'
                                        },
                                        {
                                            html: '<span class="regular"><h2 style="font-size: 14px" class="x-grid-cell">&nbsp;Con cambios&nbsp;</h2></span>'
                                        },
                                        {
                                            html: '<span class="incorrecto"><h2 style="font-size: 14px" class="x-grid-cell">&nbsp;Incorrecto&nbsp;</h2></span>'
                                        },
                                        {
                                            html: '<span class="eliminado"><h2 style="font-size: 14px" class="x-grid-cell">&nbsp;No existe&nbsp;</h2></span>'
                                        },
                                        {
                                            html: '<span class="contractcolor"><h2 style="font-size: 14px" class="x-grid-cell">&nbsp;Nuevo&nbsp;</h2></span>'
                                        }
                                    ]
                                })
                            })
                        ]
                    },
                    {
                        xtype: 'tabpanel',
                        itemId: 'tabpanel',
                        flex:1,
                        items:[
                            {
                                title: '<b>Vista General</b>',
                                itemId: 'vistageneral',
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch'
                                },
                                items:[
                                    Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto',{
                                        title: 'En contrato',
                                        itemId: 'encontrato',
                                        flex: 1,
                                        editGrid: false,
                                        sinAcciones: true,
                                        monedasentidad: button.up('window').extrafields,
                                        visibleColumns: ['numero', 'codigo', 'denominacion', 'cantidad',
                                            'total', 'importe', 'tipo', 'monedas'],
                                        listeners: {
                                            itemdblclick: function(yo, record){
                                                win.down('#detallescomparacion').fireEvent('click');
                                            },
                                            selectionchange: function(yo, records){
                                                win.down('#detallescomparacion').setDisabled(records.length!=1);
                                            }
                                        }
                                    }),
                                    Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto',{
                                        title: 'Recibido',
                                        itemId: 'recibido',
                                        flex: 1,
                                        editGrid: false,
                                        sinAcciones: true,
                                        buttonImp: true,
                                        monedasentidad: button.up('window').extrafields,
                                        comprobarProductos: false,
                                        visibleColumns: ['numero', 'codigo', 'denominacion', 'cantidad',
                                            'total', 'importe', 'tipo', 'monedas'],
                                    })
                                ]
                            }
                        ],
                        listeners:{
                            tabchange: function(yo, newtab){
                                win.down('#detallescomparacion').setDisabled(true);
                                // console.log(yo.getActiveTab().items.first())
                                // console.log(yo.getActiveTab().items.first().getSelectionModel())
                                yo.getActiveTab().items.first().fireEvent('selectionchange',
                                    yo.getActiveTab().items.first().getSelectionModel(),
                                    yo.getActiveTab().items.first().getSelectionModel().getSelection())
                            }
                        }
                    },
                ],
                // buttons: [{
                //     text: me.etiquetas.lbBtnCerrar,
                //     iconCls: 'icondistra-cerrar',
                //     tooltip: me.etiquetas.qtipCerrar,
                //     handler: function () {
                //         win.close();
                //     }
                // }]
            });
        // console.log('yayay', win.down('#recibido').btnImp)
        // win.down('#recibido').btnImp.on('click', function(){
        //     me.cerrarTabsSeparados(win);
        // })

        win.show(null, function(){
            win.down('#recibido').getStore().on('datachanged', function(){me.cerrarTabsSeparados(win);})
            if(button.action=='compararcontrato'){
                win.down('#encontrato').getStore().loadData(button.up('window').productoscontrato);
            }else{
                var selected=button.up('window').down('#gridpedidosseguimiento').getSelectionModel().getSelection(),
                    productos=[];
                selected.forEach(function(x){
                    productos=productos.concat(Ext.decode(x.get('productos')));
                })
                win.down('#encontrato').getStore().loadData(productos);
            }
            win.down('#encontrato').getStore().fireEvent('loaddata', win.down('#encontrato').getStore());
            // console.log(win.down('#encontrato').monedasUsadas)
            if(win.down('#encontrato').monedasUsadas){
                win.down('#recibido').monedasUsadas=win.down('#encontrato').monedasUsadas;
            }

            win.down('#recibido').getStore().on('datachanged', function(yo){
                // console.log('datatata', yo.getCount(), yo.getRange().length)
                win.down('#comparar').setDisabled(yo.getCount()==0);
            })
            win.btnAceptar.setHandler(function(){
                var msg='Va a aceptar todos los productos recibidos.';
                if(win.down('#cambios') && win.down('#cambios').getStore().getCount()>0){
                    msg+='<br><span style="color:#d79655">-Hay '+win.down('#cambios').getStore().getCount()+' producto(s) con cambio(s).</span>';
                }
                if(win.down('#incorrectos') && win.down('#incorrectos').getStore().getCount()>0){
                    msg+='<br><span style="color:#ff5651">-Hay '+win.down('#incorrectos').getStore().getCount()+' producto(s) incorrecto(s).</span>';
                }
                if(win.down('#faltantes') && win.down('#faltantes').getStore().getCount()>0){
                    msg+='<br><span style="color:grey">-No se encuentra(n) '+win.down('#faltantes').getStore().getCount()+' producto(s).</span>';
                }
                if(win.down('#nuevos') && win.down('#nuevos').getStore().getCount()>0){
                    msg+='<br><b style="color:black">-Hay '+win.down('#nuevos').getStore().getCount()+' producto(s) nuevo(s).</b>';
                }
                var dialog = Ext.create('Ext.window.MessageBox', {
                    buttonAlign: 'center',
                    buttons: [
                        {
                            text: 'Aceptar',
                            iconCls: 'aceptar',
                            handler: function () {

                                var montototal=0,
                                    productos=win.down('#recibido').getStore().getRange(),
                                    storegridproductos=button.up('window').down('#gridproductos').getStore();
                                productos.forEach(function(x){
                                    win.down('#recibido').monedasUsadas.forEach(function(field){
                                        montototal+=parseFloat(x.get('montomoneda_'+field.codigoiso.toLowerCase() + '_' + field.idmoneda))*parseFloat(x.get('cantidad'));
                                    })
                                });
                                button.up('window').down('#tabproductos').setDisabled(false);
                                // me.agregarProductosNuevos(storegridproductos.getRange(), productos);
                                storegridproductos.loadData(me.agregarProductosNuevos(storegridproductos.getRange(), productos));
                                storegridproductos.fireEvent('loaddata', button.up('window').down('#gridproductos').getStore());
                                button.up('window').down('tabpanel').setActiveTab(button.up('window').down('#tabproductos'));

                                var gridfactura=button.up('window').down('s_gridfactura');
                                button.up('window').down('#tabpanel').setActiveTab('tabfacturas');
                                gridfactura.down('#addfactura').fireEvent('click', gridfactura.down('#addfactura'));
                                button.up('window').down('tabpanel').setActiveTab(button.up('window').down('#tabfacturas'));
                                var winfactura=me.getWindowFactura();
                                console.log('YA', winfactura)
                                if(winfactura){
                                    console.log('yayayvv', montototal, montototal.toString().replace('.',','), win.down('#recibido').monedasUsadas)

                                    win.down('#recibido').monedasUsadas.forEach(function(x){
                                        // console.log(x['codigoiso'])
                                        if(winfactura.down('#importe_'+x['codigoiso'].toLowerCase())) {
                                            winfactura.down('#importe_' + x['codigoiso'].toLowerCase()).setValue(montototal);
                                            console.log(
                                                winfactura.down('#importe_' + x['codigoiso'].toLowerCase()).maxValue>
                                                winfactura.down('#importe_' + x['codigoiso'].toLowerCase()).getValue(),
                                                winfactura.down('#importe_' + x['codigoiso'].toLowerCase()).maxValue,
                                                winfactura.down('#importe_' + x['codigoiso'].toLowerCase()).getValue())
                                        }
                                    })

                                }
                                win.close();
                                dialog.close();
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
                    msg: msg,
                    width: 350,
                    icon: Ext.MessageBox.QUESTION,
                });
            });
        });
    },
    cerrarTabsSeparados: function(win){
        if(win.down('#tabcorrectos'))win.down('#tabcorrectos').close();
        if(win.down('#tabcambios'))win.down('#tabcambios').close();
        if(win.down('#tabincorrectos'))win.down('#tabincorrectos').close();
        if(win.down('#tabfaltantes'))win.down('#tabfaltantes').close();
        if(win.down('#tabnuevos'))win.down('#tabnuevos').close();
    },
    agregarProductosNuevos: function(productosactuales, productosnuevos){
        if(productosactuales.length==0){
            return productosnuevos;
        }else{
            var productosfinal=[];
            productosactuales.forEach(function(x){
                productosfinal.push(x.data);
            });
            productosnuevos.forEach(function(x){
                var finded=false;
                Ext.each(productosactuales, function(y){
                    if (x.get('codigo').trim()==y.get('codigo').trim()){
                        finded=true;
                        return false;
                    }
                })
                if(!finded)productosfinal.push(x);
            })
            console.log('productosfinal:', productosfinal)
            return productosfinal;
        }
        
    }
});
