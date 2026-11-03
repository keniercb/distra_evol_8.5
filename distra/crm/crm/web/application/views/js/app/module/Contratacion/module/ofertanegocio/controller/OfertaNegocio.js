Ext.define('OfertaNegocio.controller.OfertaNegocio', {
    extend: 'CRM.core.controller.Base',
    views: ['OfertaNegocio'],
    configEstados: null,
    configOferta: null,
    refs: [
        {ref: 'OfertaNegocio', selector: 'gpofertanegocio'},
        {ref: 'WinEditOferta', selector: 'wineditoferta'},
        {ref: 'WindowOfertaNegocio', selector: 'windowofertanegocio'},
        {ref: 'WinDetallesOferta', selector: 'windetallesoferta'},
        {ref: 'WinOfertaEstadoTrazas', selector: 'winofertaestadotrazas'},
        {ref: 'FpFiltrosOferta', selector: 'fpfiltrosoferta'},
    ],
    requires: [
        'OfertaNegocio.view.OfertaNegocio',
    ],
    init: function () {
        var me = this;

        me.getLang();

        this.etiquetas = LangMgr.getLang(this);

        me.listen({
            component: {
                "gpofertanegocio": {
                    select: this.buttonEnable,
                    deselect: this.buttonEnable,
                    render: this.onRenderOferta,
                    afterrender: this.grantActions,
                    selectionchange: this.onSelectionChangeOferta,
                    itemcontextmenu: this.showContextMenu,
                    itemdblclick: this.showWinDetallesOferta
                },
                "gpofertanegocio button[action], gpofertanegocio menuitem[action], menu[itemId=contextMenuOfertaNegocio] menuitem[action]": {
                    click: this.onClickButtonAction,
                },
                'gpofertanegocio searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                'fpfiltrosoferta combobox[localId],fpfiltrosoferta pickerfield[localId]': {
                    select: this.selectCombo,
                    change: this.changeCombo
                },
                'windowofertanegocio combobox[localId], windowofertanegocio pickerfield[localId]': {
                    select: this.selectComboWindow
                },
                'windowofertanegocio combobox[name=idsolicitud]': {
                    select: this.selectSolicitudNegocio,
                    change: this.changeSolicitudNegocio
                },
                'windowofertanegocio combobox[name=mediopago]': {
                    select: this.selectComboMulti,
                    change: this.changeComboMulti
                },
                "windowofertanegocio button[action=showfile]": {
                    click: this.showFile
                },
                "windowofertanegocio button[action=delfile]": {
                    click: this.delFile
                },
                'windowofertanegocio textfield[name=nombre]': {
                    keydown: function (yo) {
                        yo.modNombre = true
                    },
                },
                'windowofertanegocio': {
                    beforeshow: function () {
                        if (this.application.keyMap)
                            this.application.keyMap.disable();
                    },
                    close: function () {
                        if (this.application.keyMap)
                            this.application.keyMap.enable();
                    }
                },
                'windetallesoferta': {
                    beforeshow: function () {
                        if (this.application.keyMap)
                            this.application.keyMap.disable();
                    },
                    close: function () {
                        if (this.application.keyMap)
                            this.application.keyMap.enable();
                    }
                },
                'winofertaestadotrazas': {
                    beforeshow: function () {
                        if (this.application.keyMap)
                            this.application.keyMap.disable();
                    },
                    close: function () {
                        if (this.application.keyMap)
                            this.application.keyMap.enable();
                    }
                },
                'windowofertanegocio combobox[name=clienteproveedor]': {
                    select: this.selectCliente
                },
            }
        });
    },
    onClickButtonAction: function (button) {
        var me = this;
        console.log('button oferta')
        switch (button.action) {
            case 'addoferta':
                me.showWinEditOferta(button);
                break;
            case 'addofertanueva':
                me.showWindowOferta(button);
                break;
            case 'modoferta':
                me.showWinEditOferta(button);
                break;
            case 'elimoferta':
                me.eliminarOferta();
                break;
            case 'detalleoferta':
                me.showWinDetallesOferta();
                break;
            case 'verdictamen':
                me.showverdictamen();
                break;
            case 'estadotrazas':
                me.showWinEstadoTrazas();
                break;
            case 'cerrar':
                me.closeWinEstadoTrazas();
                break;
            case 'buscar':
                me.filtrarOfertas();
                break;
            case 'limpiar':
                me.limpiarFiltrosOfertas();
                break;
            case 'clearfilters':
                me.limpiarTodosLosFiltros();
                break;
            case 'crearcontrato':
                me.crearContratoDeOferta();
                break;
            case 'vercontrato':
                me.verDetallesContrato(button);
                break;
            case 'versolicitud':
                me.verDetallesSolicitud(button);
                break;
            case 'printofertacomercial':
                me.printOfertaComercial(button);
                break;
        }
    },
    printOfertaComercial: function (cmp) {
        var me = this,
            data = me.getOfertaNegocio().getSelectionModel().getLastSelected().data,
            idoferta = data.idoferta,
            idpersona = window.perfil.idpersona;
        var config = {
            usuario: 'administrador',
            clave: 'admin123',
            nombrereporte: 'crmOfertaComercial',//'crmContratos
            orientacion: 'Vertical',
            tipohoja: 'Carta',
            formato: "PDF",
//             idplantilla: idplantilla,
            url: 'http://10.12.163.220:8080/Distra_Server/ServiceReport', //'service_crm' es la alternativa a 'ServiceReport' para pasar la configuraci�n de la base de datos,
            params: [
                {name: 'idoferta', value: idoferta, datatype: 'int'},
                {name: 'idpersona', value: idpersona, datatype: 'int'},
            ]
        };
        Ext.create('Ext.ux.Report', config).show();
    },

    limpiarTodosLosFiltros: function () {
        var grid = this.getOfertaNegocio(),
            actives = grid.filters.getFilterData().length,
            generalFilt = grid.getStore().proxy.extraParams['filtrogeneral[0][field]'];
        grid.getStore().proxy.extraParams = {};
        grid.down('searchfield').reset();
        grid.filters.clearFilters();
        if (actives == 0 && generalFilt) grid.getStore().load();
    },
    selectComboWindow: function (combo, records) {
        var me = this,
            win = me.getWindowOfertaNegocio();
        me.selectCombo(combo, records);
        switch (combo.localId) {
            case 'idsolicitudnegocio':
                me.selectSolicitudNegocio(combo, records);
                break;
            case 'idclienteproveedor':
                if (!win.nombre.modNombre)
                    win.nombre.setValue(win.sfclienteproveedor.getValue())
                break;
        }
    },
    addExtraColumns: function (grid, extrafields) {
        var store = grid.getStore(),
            fields = store.model.getFields(),
            columns = grid.columns,
            newfields = [],
            newcolumns = [],
            pos = -1;
        grid.extrafields = extrafields;
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
                dataIndex: 'montomoneda_' + field.codigoiso.toLowerCase()+'_'+field.idmoneda,
                sortable: false,
                text: field.codigoiso.toUpperCase(),
                width: 80,
                align: 'right',
                renderer: function (value, meta) {
                    if (Ext.isEmpty(value)) {
                        value = 0;
                    }
                    value = Ext.util.Format.currency(value);
                    meta.tdAttr = 'data-qtip="' + value + '"';

                    return value;
                }
            });
            pos++;
        });
        return newcolumns;
    },
    onRenderOferta: function () {
        var me = this, grid = this.getOfertaNegocio();
        var mask = new Ext.LoadMask(
            grid, {msg: this.etiquetas.msgCargandoConfiguracionPermisos});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getConfiguracionPermisos'}, me),
            callback: function (options, success, response) {
                mask.hide();
                var info = Ext.decode(response.responseText);
                this.application.comite = {
                    transitions: info.datos.transitions
                };
                if (!grid.extrafields) this.addExtraColumns(grid, info.datos.monedasconfig);
                // me.configEstadosCliente = info.datos.estados_cliente;
                // me.configEstadosProveedor = info.datos.estados_proveedor;
                me.configOferta = info.datos.config;
                grid.getStore().load();
                this.application.gestordocumental = info.datos.gestordoc;
                this.application.planificacion = info.datos.planificacion;
                this.application.idestadosolicitud = info.datos.estadosolicitud;
                this.application.idestadoofertalisto = info.datos.configcontrato.idestadoofertalisto;
                this.application.notificarinicial = info.datos.notificarinicial;
            },
            scope: me
        });
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);
    },
    onSelectionChangeOferta: function (sm, select) {
        var gpoferta = this.getOfertaNegocio(),
            cantEstados = this.updateBtnCambiarEstado(select, gpoferta);

        gpoferta.down('button[action=modoferta]').setDisabled(select.length != 1 || !this.isActionAccess('edit', select, gpoferta));
        gpoferta.down('button[action=elimoferta]').setDisabled(select.length == 0 || !this.isActionAccess('del', select, gpoferta));
        gpoferta.down('button[action=detalleoferta]').setDisabled(select.length != 1);
        gpoferta.down('button[action=estadotrazas]').setDisabled(select.length != 1);
        gpoferta.down('button[action=cambiarestado]').setDisabled(select.length != 1 || cantEstados == 0);
        gpoferta.down('button[action=printofertacomercial]').setDisabled(select.length != 1 || cantEstados == 0);
    },
    isActionAccess: function (action, select, grid) {
        var me = this, result = true;
        if (Ext.isEmpty(select))
            return false;

        select.forEach(function (x) {
//             console.log(x)
            if (x.get('cliente') == '2') {
                var estados = grid.getStore().proxy.reader.jsonData.estados_proveedor;
            }
            if (x.get('cliente') || estados.length == 0) {
                var estados = grid.getStore().proxy.reader.jsonData.estados_cliente;
            }
            var estadoConfig = estados[x.get('idestado')];
            if (estadoConfig && estadoConfig.acciones.indexOf(action) == -1) {
                result = false;
                return false;
            }
        });
        return result;
    },
    updateBtnCambiarEstado: function (select, grid) {

        var me = this,
            menu = this.getOfertaNegocio().down('button[action=cambiarestado]').menu;

        // menu.items.each(function (btn, index) {
        //     menu.remove(btn);
        // });
        menu.removeAll();

        if (!Ext.isEmpty(select)) {

            var estados = this.getNextStates(select[0], grid);
            Ext.each(estados, function (estado) {
                if (this.checkTransition(select[0].get('idestado'), estado.idestado)) {
                    menu.add({
                        text: estado.nombre,
                        idestado: estado.idestado,
                        idtransicion: estado.idtransicion,
                        notificar: estado.notificar,
                        iconCls: estado.icono,
                        handler: me.onChangeEstado,
                        scope: me
                    });
                }
            }, this);
        }
        return menu.items.getCount();
    },

    getNextStates: function (record, grid) {
        var me = this,
            estados = [];

        if (!record || !record.data.idestado) {
            return;
        }
        if (record.data.cliente == '2') {
            var datos = grid.getStore().proxy.reader.jsonData.estados_proveedor;
        }
        if (record.data.cliente == '1' || !datos) {
            var datos = grid.getStore().proxy.reader.jsonData.estados_cliente;
        }
        if (datos[record.data.idestado]) {
            var transiciones = datos[record.data.idestado]['transiciones'];
            Ext.each(transiciones, function (transicion) {
                var aux = datos[transicion['idestado']];
                aux['notificar'] = transicion['notificar'];
                aux['idtransicion']=transicion['idtransicion'];
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
                if (transition.idestadoinicial == idestadoinicial && transition.idestadofinal == idestadofinal &&
                    (transition.aliasproceso == 'ofertanegocio' || transition.aliasproceso == 'ofertanegocioproveedor')) {
                    exist = true;
                }
            }
        }
        if (!exist) {
            return true;
        }
        return false;
    },

    onChangeEstado: function (btn) {
        var me = this,
            sm = me.getOfertaNegocio().getSelectionModel(),
            values = {
                idoferta: sm.getSelection()[0].get('idoferta'),
                idestado: btn.idestado,
                idtransicion: btn.idtransicion,
            };

        mostrarMensaje(2, me.etiquetas.msgCambiarEstadoOferta, function (response) {
            if (response === 'ok') {
                Ext.MessageBox.show({
                    msg: me.etiquetas.msgCambiandoEstadoOferta,
                    title: me.etiquetas.lbTitleWait,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'cambiarOfertaEstado'}, me),
                    params: {values: Ext.encode(values)},
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        var info = Ext.decode(response.responseText);

                        if (info.success) {
                            // mostrarMensaje(1, me.etiquetas.msgSuccessCambiadoEstadoOferta);
                            mostrarMensaje(1, info.datos.nuevoestado?me.etiquetas.msgSuccessCambiadoEstadoOferta:
                                'Usted ha hecho su voto al cambio de estado. <br>Se han realizado '+
                                info.datos.obligatoriosefectuados+' de '+info.datos.cantidadrolesobligatorios+' votos obligatorios.');
                            if(info.datos.nuevoestado) {
                                me.getOfertaNegocio().getStore().load();

                                if (btn.notificar == 1) {
                                    values['modelName'] = 'OfertaNegocioEstadoDService';
                                    me.enviarCorreo(values);
                                }
                            }
                        } else
                            mostrarMensaje(6, 'Error incorporar mensaje');

                    },
                    scope: me
                });
            }
        });
    },
    showWindowOferta: function (button) {
        var me = this, actionAdd = button.getItemId() != 'modoferta',
            grid = this.getOfertaNegocio(),
            title = me.etiquetas.lbAdicionarOfertaNegocioCliente,
            tipo = 2, add = true, context = 'proveedor';
        var gestordoc = this.application.gestordocumental &&
            this.application.gestordocumental.activo == 1 ? true : false,
            plactivo = this.application.planificacion.activo;
        var win = Ext.create('OfertaNegocio.view.WindowOferta', {
            title: title,
            extrafields: grid.extrafields,
            context: context,
            gestordocumental: gestordoc,
            planificacion: plactivo,
            tipo: tipo,
            action: add ? 'add' : 'mod',
            idestadosolicitud: me.application.idestadosolicitud
        });
        win.show();
    },
    showWinEditOferta: function (button) {
        var me = this, actionAdd = button.getItemId() != 'modoferta',
            grid = this.getOfertaNegocio(),
            title = me.etiquetas.lbAdicionarOfertaNegocioCliente,
            tipo = 1, add = true, context = 'cliente';
        if (button.itemId == 'addofertacliente') {
            title = me.etiquetas.lbAdicionarOfertaNegocioCliente;
        } else if (button.itemId == 'addofertaproveedor') {
            title = me.etiquetas.lbAdicionarOfertaNegocioProveedor;
            tipo = 2;
            context = 'proveedor';
        } else if (button.itemId == 'modoferta') {
            add = false;
            var record = grid.getSelectionModel().getSelection()[0];
            tipo = parseInt(record.get('cliente'));
            if (record.get('cliente') == '1') {
                title = me.etiquetas.lbModificarOfertaNegocioCliente;
            } else {
                title = me.etiquetas.lbAdicionarOfertaNegocioProveedor;
                context = 'proveedor';
            }
        }
        var gestordoc = this.application.gestordocumental &&
            this.application.gestordocumental.activo == 1 ? true : false,
            plactivo = this.application.planificacion.activo;
        var win = Ext.create('OfertaNegocio.view.WindowOfertaNegocio', {
            title: title,
            extrafields: grid.extrafields,
            context: context,
            gestordocumental: gestordoc,
            planificacion: plactivo,
            tipo: tipo,
            action: add ? 'add' : 'mod',
            idestadosolicitud: me.application.idestadosolicitud
        });
        // var win = this.getWinEditOferta(title, grid.extrafields);
        // win.setActionInsert(actionAdd);
        win.show(null, function () {
            win.doLayout();
            // win.nombre.focus();
            setTimeout(function () {
                win.nombre.focus();
            }, 1000)
            if (!me.application.idestadosolicitud) {
                win.sfsolicitudnegocio.setDisabled(true);
                // mostrarMensaje(8, me.etiquetas.msgNoConfiguradoEstadoInsertar);
                var tip = Ext.create('Ext.tip.ToolTip', {
                    target: win.sfsolicitudnegocio.getEl(),
                    html: me.etiquetas.msgNoConfiguradoEstadoInsertar,
                    autoDestroy: true
                });
                tip.showBy(win.sfsolicitudnegocio.getEl(), 't');
            }
            if (win.action == 'add' && win.context == 'cliente') {
                me.cargarNumeroAutomatico(win);
                win.sfsector.Lmask = new Ext.LoadMask(win.sfsector.el, {msg: me.etiquetas.msgCargandoValorporDefecto});
                win.cmbarea.Lmask = new Ext.LoadMask(win.cmbarea.el, {msg: me.etiquetas.msgCargandoValorporDefecto});
                win.sfsector.Lmask.show();
                win.cmbarea.Lmask.show();
                me.cargarValoresPorDefecto(win);
                // me.getAreaResponsable(win, 100000852);
            }

            if (win.action == 'mod') {
                var dataForm = win.customForm,
                    pagoForm = win.formaPago,
                    docForm = win.docForm,
                    record = grid.getSelectionModel().getSelection()[0].copy(),
                    idsolicitud = record.get('idsolicitud');
                Ext.data.Model.id(record);
                record.data.idsolicitud = null;

                // win.sfsolicitudnegocio.setRawValue(record.get('solicitud'));
                dataForm.loadRecord(record);
                win.sfsolicitudnegocio.mask = new Ext.LoadMask(win.sfsolicitudnegocio, {msg: this.etiquetas.msgLoading});
                win.sfsolicitudnegocio.mask.show();
                win.sfsolicitudnegocio.getStore().load({
                    callback: function (records, operation, success) {
                        win.sfsolicitudnegocio.mask.hide();
                        win.sfsolicitudnegocio.setValue(idsolicitud);
                        win.sfsolicitudnegocio.resetOriginalValue();
                    }
                });
                win.sfclienteproveedor.getStore().load();
                win.sfsector.getStore().load();
                pagoForm.loadRecord(record);
                docForm.loadRecord(record);
                // var mask= new Ext.LoadMask(
                //     win, {msg: this.etiquetas.msgLoading});
                // mask.show();
                var cargandoDatosAdicionales = true;
                pagoForm.on('render', function (yo) {
                    if (cargandoDatosAdicionales) {
                        // pagoForm.down('tabpanel').setLoading({msg: "Cargando..."});

                        pagoForm.maskL = new Ext.LoadMask(
                            pagoForm.down('tabpanel'), {msg: this.etiquetas.msgLoading});
                        pagoForm.maskL.show();
                    }
                });
                docForm.on('render', function (yo) {
                    if (cargandoDatosAdicionales) {
                        docForm.maskL = new Ext.LoadMask(
                            docForm, {msg: this.etiquetas.msgLoading});
                        docForm.maskL.show();
                    }
                });
                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'getDatosAdicionales'}, me),
                    params: {idoferta: record.get('idoferta')},
                    callback: function (options, success, response) {
                        cargandoDatosAdicionales = false;
                        if (pagoForm.maskL) pagoForm.maskL.hide();
                        if (docForm.maskL) docForm.maskL.hide();
                        // pagoForm.hitopago.setLoading(false);
                        var info = Ext.decode(response.responseText);
                        if (info) {
                            if (info.hitos.length > 0 || info.indicadores.length > 0)
                                if (info.hitos.length > 0) {
                                    if (pagoForm.hitopago) {
                                        pagoForm.hitopago.datosLoad = info.hitos;
                                        pagoForm.hitopago.getStore().loadData(info.hitos);
                                        pagoForm.hitopago.getStore().fireEvent('loaddata', pagoForm.hitopago.getStore());
                                        pagoForm.indicadores.setDisabled(true);
                                    }
                                } else {
                                    if (pagoForm.indicadores) {
                                        pagoForm.indicadores.datosLoad = info.indicadores;
                                        pagoForm.indicadores.getStore().loadData(info.indicadores);
                                        pagoForm.indicadores.getStore().fireEvent('loaddata', pagoForm.indicadores.getStore());
                                        pagoForm.indicadores.up('tabpanel').setActiveTab(pagoForm.indicadores);
                                        pagoForm.hitopago.setDisabled(true);
                                    }
                                }
                            if (info.anexos && info.anexos.length != 0 && docForm)
                                docForm.loadDocuments(info.anexos);
                        }
                    }
                });
                if (win.formaPago.calcularTotalMontos() !=
                    (win.formaPago.calcularTotalMontosHitos() +
                        win.formaPago.calcularTotalMontosIndicadores()))
                    Ext.each(win.extrafields, function (field, index) {
                        var actual = win.down('#montomoneda_' + field.codigoiso.toLowerCase());
                        if (actual) {
                            actual.introducidoManual = true;
                            actual.addCls('introducidomanual');
                            // mainwindow.down('#montomoneda_'+field.codigoiso.toLowerCase()).addCls('tooltiphito');
                            actual.tip = Ext.create('Ext.tip.ToolTip', {
                                target: actual.getEl(),
                                html: me.etiquetas.msgHitosNoSuperarMonto,
                                autoDestroy: true,
                                // anchor:'top'
                            });
                            actual.tip.showBy(actual.getEl(), 't');
                        }
                    });
                // dataForm.queryBy(function(x){
                //     if(Ext.isFunction(x.getValue))
                //         console.log('name:',x.name, 'value:', x.getValue())
                // });
                // pagoForm.queryBy(function(x){
                //     if(Ext.isFunction(x.getValue))
                //         console.log('name:',x.name, 'value:', x.getValue())
                // })
            }

        });
    },
    cargarValoresPorDefecto: function (win) {
        var me = this;
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'obtenerConfiguracionPorDefecto'}, ModuleMgr.get('GestionContrato')),
            success: function (response) {
                // mask.hide();
                var datos = Ext.decode(response.responseText);
                win.sfsector.Lmask.hide();
                win.cmbarea.Lmask.hide();
                if (datos[0] && win) {
                    win.sfsector.setValue(datos[0]['sector']);
                    win.hfsector.setValue(datos[0]['idsector']);
                    win.cmbarea.setValue(datos[0]['nombrearea']);
                    win.hfarea.setValue(datos[0]['idarea']);
                    // win.customForm.getForm().loadRecord({getData:function(){
                    //         return datos[0];
                    //     }});
                }
            },
            failure: function (response) {
                // mask.hide();
                mostrarMensaje(7, 'No han podido cargarse los datos.')
            }
        });
    },
    cargarNumeroAutomatico: function (win) {
        var me = this;
        var mask = new Ext.LoadMask(win.numero, {msg: me.etiquetas.msgCargandoConsecutivo});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getNumeroOfertaAutomatico'}, me),
            callback: function (options, success, response) {
                mask.hide();
                var datos = Ext.decode(response.responseText);
                win.numero.setValue(datos);
            }
        });
    },
    getAreaResponsable: function (window, idarea) {
        var me = this;
        var mask3 = new Ext.LoadMask(window.cmbarea.el, {msg: this.etiquetas.msgLoading});
        mask3.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getAreaResponsable'}, ModuleMgr.get('GestionContrato')),
            params: {idarea: idarea},
            callback: function (options, success, response) {
                mask3.hide();
                var response = Ext.decode(response.responseText);
                if (response.length > 0) {
                    window.hfarea.setValue(idarea);
                    window.cmbarea.setValue(response[0].denominacion);
                }
            }
        });
    },
    getWinEditOferta: function (title, extrafields) {
        var me = this;
        var win = Ext.create('OfertaNegocio.view.WindowOfertaNegocio', {
            title: title, extrafields: extrafields
        });
        return win;
        // if(!this.wineditoferta){
        //     this.wineditoferta = new Ext.create('OfertaNegocio.view.WinEditOferta');
        //     this.wineditoferta.down('field[name=solicitud]').storeSolicitud.on('beforeload',function(store1, oper){
        //         oper.filters.push(new Ext.util.Filter({
        //             property: 'idestado',
        //             value : me.configOferta['idestadosolicitudinsertar']
        //         }));
        //     }, me);
        // }
        // return this.wineditoferta;
    },
    eliminarOferta: function () {
        var me = this,
            sm = me.getOfertaNegocio().getSelectionModel();
        me.application.keyMap.disable();
        mostrarMensaje(2, me.etiquetas.msgElimOferta, function (response) {
            if (response === 'ok') {

                Ext.MessageBox.show({
                    msg: me.etiquetas.msgElimDataOferta,
                    title: me.etiquetas.lbTitleWait,
                    width: 350,
                    wait: true,
                    waitConfig: {interval: 200}
                });
                var ids = [];
                sm.getSelection().forEach(function (x) {
                    ids.push(x.get('idoferta'));
                });
                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'eliminarOfertaNegocio'}, me),
                    params: {values: Ext.encode(ids)},
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        me.application.keyMap.enable();
                        var info = Ext.decode(response.responseText);

                        if (info.success) {
                            mostrarMensaje(1, me.etiquetas.msgSuccessDeleteOferta);
                            me.getOfertaNegocio().getStore().load();
                        } else
                            mostrarMensaje(6, me.etiquetas.msgErrorElimDataOferta);

                    },
                    scope: this
                });
            } else if (response == 'cancel') {
                me.application.keyMap.enable();
            }
        });
    },
    showWinDetallesOferta: function () {
        var recordSelected = this.getOfertaNegocio().getSelectionModel().getSelection()[0];
        // console.info('recordSelected:', recordSelected)
        var cloneRecord = recordSelected.copy();
        Ext.data.Model.id(cloneRecord);
        Ext.Object.each(cloneRecord.data, function (key, value) {
            if (key != 'idsolicitud' && (value == '' || value == undefined)) {
                cloneRecord.set(key, '<i style="color:gray">No definido</i>')
            }
            if (key == 'idsolicitud' && value) {
                cloneRecord.set(key, '# ' + value + ' - ')
            }
        })
        Ext.create('OfertaNegocio.view.WinDetallesOferta').show(cloneRecord);
    },

    showverdictamen: function () {
        var grid = this.getOfertaNegocio(),
            store = grid.getStore(),
            record = grid.getSelectionModel().getSelection()[0],
            tipo = 2,
            id = record.data.idoferta;

        Ext.create('Comite.view.OpinionsWindow', {
            title: this.etiquetas.lbVerDictamenes,
            params: {
                id: id,
                tipo: tipo,
                todos: 1,
                proceso: 'ofertanegocio'
            },
            data: record.data
        }).show();
    },

    buttonEnable: function () {
        var me = this,
            grid = me.getOfertaNegocio(),
            selection = grid.getSelectionModel().getSelection(),
            len = selection.length;
        // console.log('gpsolicitudnegocio:', grid.down('#dictamenes'));
        grid.down('#dictamenes').setDisabled(len != 1);
        grid.down('#modoferta').setDisabled(len != 1);
        grid.down('#deloferta').setDisabled(len != 1);
        grid.down('#detoferta').setDisabled(len != 1);
        grid.down('#trazaoferta').setDisabled(len != 1);
        grid.down('#estado').setDisabled(len != 1);
        grid.down('#imprimir').setDisabled(len != 1);
    },

    getWinDetallesOferta: function () {
        if (!this.windetallesoferta) {
            this.windetallesoferta = new Ext.create('OfertaNegocio.view.WinDetallesOferta');
        }
        return this.windetallesoferta;
    },
    closeWinDetallesOferta: function () {
        this.getWinDetallesOferta().close();
    },
    showWinEstadoTrazas: function () {
        var win = this.getWinOfertaEstadoTrazas(),
            recordSelected = this.getOfertaNegocio().getSelectionModel().getSelection()[0],
            store = win.items.first().getStore();

        win.setTitle(this.etiquetas.titleWinEstadoTrazas + ' #' + recordSelected.get('numero'));
        win.show();

        store.removeAll();
        store.load({params: {idoferta: recordSelected.get('idoferta')}})
    },
    getWinOfertaEstadoTrazas: function () {
        if (!this.winestadotrazas) {
            this.winestadotrazas = new Ext.create('OfertaNegocio.view.WinOfertaEstadoTrazas');
        }
        return this.winestadotrazas;
    },
    closeWinEstadoTrazas: function () {
        this.getWinOfertaEstadoTrazas().hide();
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
    selectComboMulti: function (combo, records) {
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localIdMulti), valores = '';
        if (hiddenField) {
            // if(valores!='')valores+=',';
            records.forEach(function (x) {
                valores += x.get('idmediodepago') + ','
            });
            // console.info('selectComboMulti respuesta:', valores.substr(0, valores.length-1))
            hiddenField.setValue(valores.substr(0, valores.length - 1));
        }
    },
    changeComboMulti: function (combo, value) {
        // console.info('changeComboMulti:')
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localIdMulti);
        if (hiddenField && Ext.isEmpty(value)) {
            hiddenField.setValue('');
        }
    },
    onSearch: function (field, data) {
        var me = this,
            grid = me.getOfertaNegocio();
        grid.getStore().filters.removeAtKey(field.atributo);
        if (field.getValue() != '') {
            // var filter= new Ext.util.Filter({
            //     id: field.atributo,
            //     property: field.atributo,
            //     value: field.getValue(),
            //     'store': grid.getStore()
            // });
            grid.getStore().proxy.extraParams = {
                'filtrogeneral[0][field]': 'general',
                'filtrogeneral[0][data][type]': 'string',
                'filtrogeneral[0][data][value]': field.getValue(),
                // 'filtrogeneral': Ext.encode([{
                //     field: 'general',
                //     data: {value: field.getValue(), type: 'string'}
                // }])
            };
        }
        // grid.columns.forEach(function(x){
        //     console.log('x', x)
        //     if(x.dataIndex=='nombre'  || x.dataIndex=='numero'){
        //         console.log('x.text:', x.text)
        //         x.addCls('ux-filtered-column');
        //     }
        // });
        // grid.filters.getFilter('nombre').setActive(true);
        grid.getStore().load();
    },
    onClear: function (field) {
        if (this.getOfertaNegocio().getStore().proxy.extraParams['filtrogeneral[0][field]']) {
            this.getOfertaNegocio().getStore().proxy.extraParams = {};
            this.getOfertaNegocio().getStore().load();
            // grid.columns.forEach(function(x){
            //     if(x.dataIndex=='nombre'  || x.dataIndex=='numero'){
            //         x.render();
            //         x.removeCls('ux-filtered-column');
            //     }
            // });
        }
    },
    selectSolicitudNegocio: function (combo, records) {
        var me = this,
            win = me.getWindowOfertaNegocio(),
            form = combo.up('form');
        if (combo.getValue()) {
            console.log('tambien llega aquIIIII')
            Ext.Object.each(records[0].data, function (key, value) {
                if (['idsolicitud', 'numero'].indexOf(key) == -1 && form.getForm().findField(key) && value) {
                    // console.info('existe!!!', key, key=='idarearesponsable', value)
                    if (!(['idclienteproveedor', 'clienteproveedor'].indexOf(key) != -1 && win.context == 'proveedor')) {
                        form.getForm().findField(key).setValue(value);
                        // form.getForm().findField(key).setReadOnly(true);
                    }
                    if (key == 'descripcion')
                        form.getForm().findField(key).setValue(
                            value.replace(/<[\/\-,;:="'\s\w]*>/gi, '').replace('&nbsp;', '').replace(/&aacute;/gi, 'á').replace(/&eacute;/gi, 'é').replace(/&iacute;/gi, 'í').replace(/&oacute;/gi, 'ó').replace(/&uacute;/gi, 'ú'));
                }
                if (key == 'idarearesponsable')
                    form.getForm().findField('idarea').setValue(value);
                if (key == 'idproveedores' && value) {
                    form.getForm().findField('clienteproveedor').filters = {
                        idtipo: win.context == 'cliente' ? 1 : 2,
                        idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun,
                        idclientesproveedores: value
                    };
                    form.getForm().findField('clienteproveedor').getStore().load()
                }
            });
            win.nombre.modNombre = true
            var cargandoDatosAdicionales = true;
            win.formaPago.on('render', function (yo) {
                if (cargandoDatosAdicionales) {
                    win.formaPago.maskL = new Ext.LoadMask(
                        win.formaPago.down('tabpanel'), {msg: this.etiquetas.msgLoading});
                    win.formaPago.maskL.show();
                }
            });
            var maskWin = new Ext.LoadMask(
                win.el, {msg: this.etiquetas.msgCargandoDatosSolicitud});
            maskWin.show();
            Ext.Ajax.request({
                params: {idsolicitud: parseInt(records[0].get('idsolicitud'))},
                url: UtilsFn.buildUrl({action: 'obtenerProductoServicio'}, ModuleMgr.get('SolicitudNegocio')),
                callback: function (options, success, response) {
                    var datos = Ext.decode(response.responseText);
                    cargandoDatosAdicionales = false;
                    if (win.formaPago.maskL) win.formaPago.maskL.hide();
                    maskWin.hide();
                    datos.datos.forEach(function (x) {
                        x['idindicadorcontrato'] = ''
                    });
                    win.formaPago.indicadores.getStore().dataCargada = datos.datos;
                    win.formaPago.indicadores.getStore().loadData(datos.datos);
                    // win.formaPago.indicadores.datosIndicadoresSolicitud=datos.datos;
                    win.formaPago.indicadores.getStore().dataCargada = win.formaPago.indicadores.getStore().getRange();
                    win.formaPago.cambiarMontosPorHitosIndicadores();
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
    changeSolicitudNegocio: function (combo, value) {
        var me = this,
            win = me.getWindowOfertaNegocio(),
            form = combo.up('form');

        if (!combo.findRecord('nombre', combo.getValue())) {
            form.queryBy(function (x) {
                if (Ext.isFunction(x.reset) && ['numero', 'objeto', 'responsable', 'idresponsable', 'idsolicitud'].indexOf(x.name) == -1) {
                    // console.log('RESETEARRR', x.name)
                    x.reset();
                }
            })
            form.getForm().findField('clienteproveedor').filters = {
                idtipo: win.context == 'cliente' ? 1 : 2,
                idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun,
            }

            var store = form.getForm().findField('clienteproveedor').getStore();
            store.proxy.extraParams['filter[3][field]'] = null;
            store.proxy.extraParams['filter[3][data][type]'] = null;
            store.proxy.extraParams['filter[3][data][value]'] = null;
            store.proxy.extraParams['filter[3][data][null]'] = null;
            form.getForm().findField('clienteproveedor').getStore().load();
            if (win.formaPago.indicadores.getStore().dataCargada) {
                win.formaPago.indicadores.getStore().remove(win.formaPago.indicadores.getStore().dataCargada);
                win.formaPago.indicadores.getStore().dataCargada = null;
            }
            // win.formaPago.indicadores.datosIndicadoresSolicitud=null;
        }
    },
    filtrarOfertas: function () {
        // var values = this.getFpFiltrosOferta().getForm().getValues(),
        //     store = this.getOfertaNegocio().getStore(),
        //     filters = [];
        // store.clearFilter(true);
        // for(i in values){
        //     if(!Ext.isEmpty(values[i]))
        //         filters.push({property:i, value: values[i]});
        // }
        // store.addFilter(filters);
    },
    limpiarFiltrosOfertas: function () {
        var store = this.getOfertaNegocio().getStore();
        this.getFpFiltrosOferta().getForm().reset();
        store.clearFilter();
    },
    showContextMenu: function (view, record, item, index, e, eOpts) {
        var grid = view.up('grid');
        sm = view.up('grid').getSelectionModel();
        if (sm.getCount() <= 1) {
            sm.select(record);
        }
        e.stopEvent();
        // if (!grid.noactions) {

        this.createContextMenu(grid, grid.columns);
        if (grid.contextMenu.items.length > 0)
            grid.contextMenu.showAt(e.getXY());
        // }
    },
    createContextMenu: function (grid, columns) {
        var me = this,
            select = grid.getSelectionModel().getSelection(),
            items = [];
        console.log(select[0].get('idestado'),me.application.idestadoofertalisto)
        grid.down('#accionesContextMenu').items.items.forEach(function (x) {
            var config = me.cloneObject(x.initialConfig);
            if (config) {
                config.id = 'menu' + (config.id || Ext.id());
                config.hidden = x.isHidden();
                config.disabled = x.isDisabled();
                if (!config.hidden) {
                    if (x.selector == 'crearcontrato') {
                        config.hidden = /*!me.isActionAccess('createcontrato', select, grid) || */select[0].get('idcontrato') != undefined || select[0].get('idestado')!=me.application.idestadoofertalisto;
                    } else if (x.selector == 'vercontrato') {
                        config.hidden = !select[0].get('idcontrato');
                        config.text = me.cargandoDatosContrato == select[0].get('idcontrato') ? me.etiquetas.msgCargandoDatos : me.etiquetas.lbVerContrato;
                        config.disabled = me.cargandoDatosContrato;
                    } else if (x.selector == 'versolicitud') {
                        config.hidden = !select[0].get('idsolicitud');
                        config.text = me.cargandoDatosSolicitud == select[0].get('idsolicitud') ? me.etiquetas.msgCargandoDatos : me.etiquetas.lbVerSolicitud;
                        config.disabled = me.cargandoDatosSolicitud;
                    }
                }
                if (!config.hidden)
                    items.push(config);
            }
        })
        var actions = new Array(),
            tbar = grid.dockedItems.items[3].items.items;
        if (tbar) {
            //adicionar botones al contextmenu
            for (var i = 0; i < tbar.length; i++) {
                if (tbar[i].xtype == 'button' && ['help', 'cambiarestado', '', undefined, null].indexOf(tbar[i].action) == -1) {
                    var config = me.cloneObject(tbar[i].initialConfig);
                    if (config) {
                        config.xtype = undefined;
                        config.id = 'menu' + (config.id || Ext.id());
                        config.hidden = tbar[i].isDisabled() || tbar[i].isHidden();
                        config.disabled = tbar[i].isDisabled();
                        if (!config.hidden)
                            items.push(config);
                        actions.push(config.action);
                    }

                }
            }
        }
        grid.contextMenu = Ext.create('Ext.menu.Menu', {
            plain: true,
            itemId: 'contextMenuOfertaNegocio',
            items: items
            // items: [{text:'aaaaa'}]
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
    adecuarRecord: function () {
        var cloneRecord = record.copy();
        Ext.data.Model.id(cloneRecord);
        cloneRecord.set('nombrearea', cloneRecord.get('arearesponsable'))
        cloneRecord.set('nombrepersona', cloneRecord.get('nombreresponsable'))
        cloneRecord.get('hitos')['eliminados'] = [];
        cloneRecord.get('hitos').forEach(function (x) {

        });
    },
    crearContratoDeOferta1: function () {
        var me=this;
        console.log('???', me.maincontratacion)
        var controller = ModuleMgr.get('GestionContrato');
        if(!me.maincontratacion) {
            var maskWin = new Ext.LoadMask(
                me.getOfertaNegocio().el, {msg: 'Cargando configuracion de contrato'});
            maskWin.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'getConfiguraciones'}, controller),
                scope: this,
                callback: function (options, success, response) {
                    maskWin.hide();
                    var response = Ext.decode(response.responseText);
                    me.maincontratacion = controller.getController('MainContratacion');
                    me.maincontratacion.validateGrantedActions();
                    me.maincontratacion.application.gestordocumental = response.contractdoc[0];
                    me.maincontratacion.application.planificacion = response.planificacion;
                    me.maincontratacion.contabilidad = response.contabilidad.archivo && response.contabilidad.aperturado == 1 && response.contabilidad.confhabilitado;
                    me.maincontratacion.application.modulopersona = response.configuracion['activopersona'] == '1';
                    me.maincontratacion.application.idestadoofertalisto = response.configuracion['idestadoofertalisto'];
                    // win.gestordocumental = response.contractdoc[0];
                    // win.estructura = response.estructura;
                    // win.planificacion = response.planificacion;
                    // win.contabilidad = response.contabilidad.archivo && response.contabilidad.aperturado == 1 && response.contabilidad.confhabilitado;
                    // win.modulopersona = response.configuracion['activopersona']=='1';
                    // win.idestadoofertalisto = response.configuracion['idestadoofertalisto'];
                    me.crearVentanaContrato(me.getOfertaNegocio().getSelectionModel().getSelection()[0]);
                }
            })
        }else{
            me.crearVentanaContrato(me.getOfertaNegocio().getSelectionModel().getSelection()[0]);
        }
    },
    crearVentanaContrato: function(select){
        // console.log('ACCIONES OFERTA:', this.actions, this.application.securityData, this.application.securityData['idfuncionalidad'])
        // console.log('final oferta:', this.actions[this.application.securityData['idfuncionalidad']])
        var me=this,
            cmp=me.getOfertaNegocio().down('#crearcontratohidden'),
            cmp2 = Ext.merge({
                context: (select.get('cliente')==1 ? 'cliente' : 'proveedor')
            }, cmp),
            wincontrato = me.maincontratacion.winContrato(cmp2),
            form = wincontrato.customForm.getForm();
            // storeOfertas=form.findField('nombreoferta').getStore();
            console.log(wincontrato);
        form.findField('idoferta').setValue(select.get('idoferta'));
        form.findField('nombreoferta').setValue(select.get('nombre'));
        // form.findField('nombreoferta').select(storeOfertas.getAt(index));
        form.findField('nombreoferta').fireEvent('select', form.findField('nombreoferta'), [select]);

        // var maskWin = new Ext.LoadMask(
        //     wincontrato.el, {msg: 'Cargando datos de la oferta'});
        // maskWin.show();
        // storeOfertas.load({
        //     callback: function(records, oper, success){
        //         maskWin.hide();
        //         if(success){
        //             // var index=storeOfertas.findExact('idoferta', select.get('idoferta'));
        //             // if(index!=-1){
        //                 form.findField('idoferta').setValue(select.get('idoferta'));
        //                 form.findField('nombreoferta').setValue(select.get('nombre'));
        //                 // form.findField('nombreoferta').select(storeOfertas.getAt(index));
        //                 form.findField('nombreoferta').fireEvent('select', form.findField('nombreoferta'), [select]);
        //             // }else{
        //             //     mostrarMensaje(7, 'No se puede hacer un contrato de la oferta seleccionada. <br>' +
        //             //         'Revise los datos e int&eacute;ntelo de nuevo.')
        //             //     wincontrato.close();
        //             // }
        //         }
        //     }
        // });
    },
    crearContratoDeOferta: function () {
        var me = this,
            grid = me.getOfertaNegocio(),
            selects = grid.getSelectionModel().getSelection();
        if (selects.length > 0) {
            var record = selects[0],
                gestordoc = this.application.gestordocumental &&
                this.application.gestordocumental.activo == 1 ? true : false,
                plactivo = this.application.planificacion.activo,
                cloneRecord = record.copy();
            acciones=this.actions[this.application.securityData['idfuncionalidad']];
            Ext.data.Model.id(cloneRecord);
            cloneRecord.set('nombrearea', cloneRecord.get('arearesponsable'));
            cloneRecord.set('nombrepersona', cloneRecord.get('nombreresponsable'));
            cloneRecord.set('numero', '');
            cloneRecord.set('fechafirma', '');
            cloneRecord.set('vigencia', '');
            // cloneRecord.set('idoferta', cloneRecord.get('idoferta'));
            cloneRecord.set('nombreoferta', cloneRecord.get('nombre'));
            console.log('cloneRecord', cloneRecord)
            var win = Ext.create('GestionContrato.view.MainWindowContratacion', {
                etiquetas: me.etiquetas,
                title: 'Crear contrato a partir de oferta',
                concept: 'Contrato',
                action: 'add',
                context: record.get('cliente') == '1' ? 'cliente' : 'proveedor',
                suplemento: null,
                addsuplemento: null,
                gestordocumental: gestordoc,
                planificacion: plactivo,
                extrafields: grid.extrafields,
                grid: grid,
                acciones: acciones,
                numeroparametros: {'cliente': record.get('cliente'), 'idsector': record.get('idsector'), 'especifico': 0}
            });
            win.show(null, function () {
                win.doLayout();
                var dataForm = win.customForm,
                    pagoForm = win.formaPago,
                    docForm = win.docForm;
                // dataForm.add({
                //     xtype: 'hidden',
                //     name: 'idoferta'
                // });
                dataForm.loadRecord(cloneRecord);
                pagoForm.loadRecord(cloneRecord);
                docForm.loadRecord(cloneRecord);
                dataForm.getForm().findField('nombreoferta').setReadOnly(true);
                dataForm.getForm().findField('nombreoferta').setValue(cloneRecord.get('nombre'));
                dataForm.getForm().findField('idoferta').setValue(cloneRecord.get('idoferta'));
                dataForm.getForm().findField('idarea').setValue(cloneRecord.get('idarea'));
                dataForm.getForm().findField('idsector').setValue(cloneRecord.get('idsector'));

                // win.sfsector.getStore().load({
                //     callback: function(){
                //         // win.sfsector.setValue(cloneRecord.get('sector'));
                //         win.sfsector.fireEvent('select',
                //             win.sfsector, [win.sfsector.findRecord('denominacion', win.sfsector.getValue())]);
                //     }
                // })
                var cargandoDatosAdicionales = true;
                pagoForm.on('render', function (yo) {
                    if (cargandoDatosAdicionales) {
                        pagoForm.maskL = new Ext.LoadMask(
                            pagoForm.down('tabpanel'), {msg: this.etiquetas.msgLoading});
                        pagoForm.maskL.show();
                    }
                });
                docForm.on('render', function (yo) {
                    if (cargandoDatosAdicionales) {
                        docForm.maskL = new Ext.LoadMask(
                            docForm, {msg: this.etiquetas.msgLoading});
                        docForm.maskL.show();
                    }
                });
                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'getDatosAdicionales'}, me),
                    params: {idoferta: record.get('idoferta')},
                    callback: function (options, success, response) {
                        cargandoDatosAdicionales = false;
                        if (pagoForm.maskL) pagoForm.maskL.hide();
                        if (docForm.maskL) docForm.maskL.hide();
                        // pagoForm.hitopago.setLoading(false);
                        var info = Ext.decode(response.responseText);
                        if (info) {
                            if (info.hitos.length > 0 || info.indicadores.length > 0)
                                if (info.hitos.length > 0) {
                                    info.hitos.forEach(function (x) {
                                        x['idhito'] = '';
                                        for (var i = 0; i < x.pago.length; i++) {
                                            x.pago[i]['idmonedahito'] = ''
                                        }
                                        for (var j = 0; j < x.indicadores.length; j++) {
                                            x.indicadores[j]['idindicadorcontrato'] = ''
                                        }
                                    });
                                    pagoForm.hitopago.datosLoad = info.hitos;
                                    pagoForm.hitopago.getStore().loadData(info.hitos);
                                    pagoForm.hitopago.getStore().fireEvent('loaddata', pagoForm.hitopago.getStore());
                                    pagoForm.indicadores.setDisabled(true);
                                } else {
                                    info.indicadores.forEach(function (x) {
                                        x['idindicadorcontrato'] = '';
                                    });
                                    pagoForm.indicadores.datosLoad = info.indicadores;
                                    pagoForm.indicadores.getStore().loadData(info.indicadores);
                                    pagoForm.indicadores.getStore().fireEvent('loaddata', pagoForm.indicadores.getStore());
                                    pagoForm.indicadores.up('tabpanel').setActiveTab(pagoForm.indicadores);
                                    pagoForm.hitopago.setDisabled(true);
                                }
                            if (info.anexos && info.anexos.length != 0)
                                docForm.loadDocuments(info.anexos);
                        }
                    }
                });

            });
        }

    },
    verDetallesContrato: function (button) {
        var me = this, grid = me.getOfertaNegocio(),
            record = grid.getSelectionModel().getSelection()[0];
        if (record.get('idcontrato')) {
            me.cargandoDatosContrato = record.get('idcontrato');
            // var mask = new Ext.LoadMask(grid.el,
            //     {msg: this.etiquetas.msgCargandoDatosContrato});
            // mask.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'obtenerDatosContrato'}, ModuleMgr.get('ReporteContratacion')),
                params: {idcontrato: record.get('idcontrato')},
                success: function (response) {
                    // mask.hide();
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
                    // mask.hide();
                    me.cargandoDatosContrato = null;
                    mostrarMensaje(7, 'No han podido cargarse los datos.')
                }
            });
        }
    },
    verDetallesSolicitud: function () {
        var me = this, grid = me.getOfertaNegocio(),
            record = grid.getSelectionModel().getSelection()[0];
        if (record.get('idsolicitud')) {
            me.cargandoDatosSolicitud = record.get('idsolicitud');
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'obtenerDatosSolicitud'}, ModuleMgr.get('OfertaNegocio')),
                params: {idsolicitud: record.get('idsolicitud')},
                success: function (response) {
                    // mask.hide();
                    me.cargandoDatosSolicitud = null;
                    var datos = Ext.decode(response.responseText);
                    record = {
                        data: datos.datos[0],
                        getData: function () {
                            return datos.datos[0]
                        },
                        get: function (field) {
                            return datos.datos[0][field];
                        }
                    };
                    Ext.create('SolicitudNegocio.view.WinDetallesSolicitud').show(record);
                },
                failure: function (response) {
                    // mask.hide();
                    me.cargandoDatosSolicitud = null;
                    mostrarMensaje(7, 'No han podido cargarse los datos.')
                }
            });

        }
    },
    grantActions: function (grid) {
        this.validateGrantedActions({container: grid});
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
    selectCliente: function(combo, records){
        var me=this, win=combo.up('window');
        if(records.length>0){
            win.sfsector.setValue(records[0].get('sector'));
            win.hfsector.setValue(records[0].get('idsector'));
        }
    }
});
