Ext.define('OfertaNegocioImportacion.controller.OfertaNegocioImportacion', {
    extend: 'CRM.core.controller.Base',
    views: ['OfertaNegocio'],
    configEstados: null,
    configOferta: null,
    refs: [
        {ref: 'OfertaNegocioImportacion', selector: 'gpofertanegocioimportacion'},
        {ref: 'WinEditOferta', selector: 'wineditofertaimportacion'},
        {ref: 'WindowOfertaNegocio', selector: 'windowofertanegocioimportacion'},
        {ref: 'WindowOferta', selector: 'windowofertaimportacion'},
        {ref: 'WinDetallesOferta', selector: 'windetallesofertaimportacion'},
        {ref: 'WinOfertaEstadoTrazas', selector: 'winofertaestadotrazasimportacion'},
        {ref: 'FpFiltrosOferta', selector: 'fpfiltrosofertaimportacion'},
    ],
    requires: [
        'GestionContratoImportacion.view.GridEstadoTrazas'
    ],
    init: function () {
        var me = this;

        me.getLang();

        this.etiquetas = LangMgr.getLang(this);

        me.listen({
            component: {
                "gpofertanegocioimportacion": {
                    render: this.onRenderOferta,
                    afterrender: this.grantActions,
                    selectionchange: this.onSelectionChangeOferta,
                    itemcontextmenu: this.showContextMenu,
                    itemdblclick: this.showWinDetallesOferta
                },
                "gpofertanegocioimportacion button[action], gpofertanegocioimportacion menuitem[action], menu[itemId=contextMenuOfertaImportacion] menuitem[action]": {
                    click: this.onClickButtonAction,
                },
                'gpofertanegocioimportacion searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                'fpfiltrosofertaimportacion combobox[localId],fpfiltrosofertaimportacion pickerfield[localId]': {
                    select: this.selectCombo,
                    change: this.changeCombo
                },
                'windowofertanegocioimportacion combobox[localId], windowofertanegocioimportacion pickerfield[localId]': {
                    select: this.selectComboWindow
                },
                'windowofertaimportacion combobox[localId], windowofertaimportacion pickerfield[localId]': {
                    select: this.selectComboWindow
                },
                'windowofertanegocioimportacion combobox[name=solicitud]': {
                    select: this.selectSolicitudNegocio,
                    change: this.changeSolicitudNegocio
                },
                'windowofertaimportacion combobox[name=solicitud]': {
                    select: this.selectSolicitudNegocio,
                    change: this.changeSolicitudNegocio
                },
                'windowofertanegocioimportacion combobox[name=mediopago]': {
                    select: this.selectComboMulti,
                    change: this.changeComboMulti
                },
                'windowofertaimportacion combobox[name=mediopago]': {
                    select: this.selectComboMulti,
                    change: this.changeComboMulti
                },
                'windowofertaimportacion combobox[localIdMulti]': {
                    select: this.selectComboMulti,
                    change: this.changeComboMulti
                },
                "windowofertanegocioimportacion button[action=showfile]": {
                    click: this.showFile
                },
                "windowofertanegocioimportacion button[action=delfile]": {
                    click: this.delFile
                },
                "windowofertaimportacion button[action=aplicartasa]": {
                    click: this.aplicarTasa
                },
                "windowofertaimportacion button[action=cambiartasa]": {
                    click: this.cambiarTasa
                },
                'windowofertanegocioimportacion textfield[name=nombre]': {
                    keydown: function (yo) {
                        yo.modNombre = true
                    },
                },
                'windowofertanegocioimportacion, windowofertaimportacion, windetallesofertaimportacion, winofertaestadotrazasimportacion': {
                    beforeshow: function () {
                        if (this.application.keyMap)
                            this.application.keyMap.disable();
                    },
                    close: function () {
                        if (this.application.keyMap)
                            this.application.keyMap.enable();
                    }
                },
                "windowofertanegocioimportacion button[action=generarnumero]": {
                    click: function (button) {
                        this.cargarNumeroAutomatico(button.up('window'), button.up('window').tipo);
                    }
                },
                "windowofertaimportacion button[action=generarnumero]": {
                    click: function (button) {
                        this.cargarNumeroAutomatico(button.up('window'), button.up('window').tipo);
                    }
                },
                "windowofertaimportacion panel[itemId=tabdescuentosgastos] moneyfield": {
                    change: this.calcularMontoTotal
                },
                "windowofertaimportacion moneyfield[itemId=tasa]": {
                    change: this.changeTasa
                },
                "windowofertaimportacion combo[itemId=moneda]": {
                    change: this.changeMonedaTasa
                }
            }
        });
    },
    onClickButtonAction: function (button) {
        var me = this;
        console.log('ONCLICK:', button.action)
        switch (button.action) {
            case 'addoferta':
                me.showWinEditOferta(button);
                break;
            case 'addofertasolicitud': //no se esta usando
                me.showWindowOferta(button);
                break;
            case 'duplicate':
                me.showWinEditOferta(button);
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
            data = me.getOfertaNegocioImportacion().getSelectionModel().getLastSelected().data,
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
        var grid = this.getOfertaNegocioImportacion(),
            actives = grid.filters.getFilterData().length,
            generalFilt = grid.getStore().proxy.extraParams['filtrogeneral[0][field]'];
        grid.getStore().proxy.extraParams = {};
        grid.down('searchfield').reset();
        grid.filters.clearFilters();
        if (actives == 0 && generalFilt) grid.getStore().load();
    },
    selectComboWindow: function (combo, records) {
        console.log('combo', combo)
        var me = this,
            win = combo.up('window');
        me.selectCombo(combo, records);
        if (combo.localId == 'idclienteproveedor') {
            if (!win.nombre.modNombre)
                win.nombre.setValue(win.sfclienteproveedor.getValue())
        }
        // if (combo.name == 'idsolicitud') me.selectSolicitudNegocio(combo, records);
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
        var me = this, grid = this.getOfertaNegocioImportacion();
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
                this.application.idestadosolicitud = info.datos.config.idestadosolicitudinsertar;
                this.application.idestadosolicitudofertainsertar = info.datos.config.idestadosolicitudofertainsertar;
            },
            scope: me
        });
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);
    },
    onSelectionChangeOferta: function (sm, select) {
        var gpoferta = this.getOfertaNegocioImportacion(),
            cantEstados = this.updateBtnCambiarEstado(select, gpoferta);
        // console.log('select:', select)
        gpoferta.down('button[action=modoferta]').setDisabled(select.length != 1 || !this.isActionAccess('edit', select, gpoferta));
        gpoferta.down('button[action=elimoferta]').setDisabled(select.length == 0 || !this.isActionAccess('del', select, gpoferta));
        gpoferta.down('button[action=detalleoferta]').setDisabled(select.length != 1);
        gpoferta.down('button[action=estadotrazas]').setDisabled(select.length != 1);
        gpoferta.down('button[action=cambiarestado]').setDisabled(select.length != 1 || cantEstados == 0);
        gpoferta.down('button[action=printofertacomercial]').setDisabled(select.length != 1);
        if (gpoferta.down('button[selector=crearReoferta]'))
            gpoferta.down('button[selector=crearReoferta]').setDisabled(select.length != 1 || (select.length == 1 &&
                (select[0].get('estadoinicial') == '0' || select[0].get('idpadre')!=null)));
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
            menu = this.getOfertaNegocioImportacion().down('button[action=cambiarestado]').menu;

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
        var datos = [];
        if (record.data.cliente == '3') {
            datos = grid.getStore().proxy.reader.jsonData.estados_compra;
        }
        if (record.data.cliente == '1' || datos.length == 0) {
            datos = grid.getStore().proxy.reader.jsonData.estados_cliente;
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
            sm = me.getOfertaNegocioImportacion().getSelectionModel(),
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
                            console.log('info.datos.nuevoestado:', info.datos.nuevoestado)
                            if(info.datos.nuevoestado) {
                                me.getOfertaNegocioImportacion().getStore().load();

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
            grid = this.getOfertaNegocioImportacion(),
            title = me.etiquetas.lbAdicionarOfertaNegocioCliente,
            tipo = 3, add = true, context = 'importacion';
        var gestordoc = this.application.gestordocumental &&
            this.application.gestordocumental.activo == 1 ? true : false,
            plactivo = this.application.planificacion.activo;
        if (button.itemId == 'modoferta') {
            add = false;
            title = me.etiquetas.lbAdicionarOfertaNegocioCliente;
        }
        var win = Ext.create('OfertaNegocioImportacion.view.WindowOferta', {
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
        console.log(ModuleMgr.get('OfertaNegocioImportacion'))
        var me = this, actionAdd = button.getItemId() != 'modoferta',
            grid = this.getOfertaNegocioImportacion(),
            title = me.etiquetas.lbAdicionarOfertaCompra,
            tipo = 3, add = 'add', context = 'importacion';
        if (button.itemId == 'addoferta') {
            title = me.etiquetas.lbAdicionarOfertaCompra;
            tipo = 3;
            context = 'importacion';
        } else if (button.itemId == 'modoferta') {
            add = 'mod';
            title = me.etiquetas.lbModificarOfertaCompra;
        } else if (button.itemId == 'crearreoferta') {
            add='duplicate';
            title = 'Adicionar reoferta';
        }
        var gestordoc = this.application.gestordocumental &&
            this.application.gestordocumental.activo == 1 ? true : false,
            plactivo = this.application.planificacion.activo;
        if (tipo == 3) {
            var win = Ext.create('OfertaNegocioImportacion.view.WindowOferta', {
                title: title,
                width: 1160,
                // width: 1160,
                extrafields: grid.extrafields,
                context: context,
                gestordocumental: gestordoc,
                planificacion: plactivo,
                tipo: tipo,
                action: add,
                idestadosolicitud: me.application.idestadosolicitudofertainsertar
            });
        } else {
            var win = Ext.create('OfertaNegocioImportacion.view.WindowOfertaNegocio', {
                title: title,
                extrafields: grid.extrafields,
                context: context,
                gestordocumental: gestordoc,
                planificacion: plactivo,
                tipo: tipo,
                action: add,
                idestadosolicitud: me.application.idestadosolicitud
            });
        }

        // var win = this.getWinEditOferta(title, grid.extrafields);
        // win.setActionInsert(actionAdd);
        win.show(null, function () {
            win.doLayout();
            // win.nombre.focus();
            setTimeout(function () {
                win.nombre.focus();
            }, 1000)
            if (!me.application.idestadosolicitud) {
                win.sfsolicitudnegocio.setReadOnly(true);
                // mostrarMensaje(8, me.etiquetas.msgNoConfiguradoEstadoInsertar);
                var tip = Ext.create('Ext.tip.ToolTip', {
                    target: win.sfsolicitudnegocio.getEl(),
                    html: me.etiquetas.msgNoConfiguradoEstadoInsertar,
                    autoDestroy: true
                });
                tip.showBy(win.sfsolicitudnegocio.getEl(), 't');
            }
            console.log('win.action:', win.action, 'win.context:', win.context)
            if (win.action == 'add') {
                if (tipo == '1' || tipo == '3')
                    me.cargarNumeroAutomatico(win, tipo);
                if (tipo != '3') {
                    win.sfsector.Lmask = new Ext.LoadMask(win.sfsector.el, {msg: me.etiquetas.msgCargandoValorporDefecto});
                    win.cmbarea.Lmask = new Ext.LoadMask(win.cmbarea.el, {msg: me.etiquetas.msgCargandoValorporDefecto});
                    win.sfsector.Lmask.show();
                    win.cmbarea.Lmask.show();
                    me.cargarValoresPorDefecto(win);
                }

                // me.getAreaResponsable(win, 100000852);
            }
            // if (win.action == 'addoferta') {
            //     alert(reoferta)
            //     me.cargarNumeroAutomatico(win, tipo);
            // }

            if (win.action != 'add') {
                var dataForm = win.customForm,
                    pagoForm = win.formaPago,
                    docForm = win.docForm,
                    gridcontenedores = win.down('#gridtiposcontenedores'),
                    record = grid.getSelectionModel().getSelection()[0].copy(),
                    idsolicitud = record.get('idsolicitud'),
                    idoferta = record.data.idoferta;
                Ext.data.Model.id(record);
                // record.data.idsolicitud = null;
                if (win.action == 'duplicate') {
                    me.cargarNumeroReoferta(win, tipo, idsolicitud, record.data.numero);
                    record.data.idofertanegociosolicitud = null;
                    record.data.idpadre=idsolicitud;
                    record.data.nombre='Reoferta - '+record.data.nombre;
                    win.numero.markInvalid('Seleccione un nuevo número para la reoferta');
                }
                // if(win.action=='duplicate')record.data.idoferta=null;

                console.log('records', record)
                dataForm.loadRecord(record);
                // win.sfsolicitudnegocio.setValue(idsolicitud);
                win.sfsolicitudnegocio.setRawValue(record.get('solicitud'));
                
                // win.sfsolicitudnegocio.mask = new Ext.LoadMask(win.sfsolicitudnegocio, {msg: this.etiquetas.msgLoading});
                // win.sfsolicitudnegocio.mask.show();
                win.sfsolicitudnegocio.setReadOnly(true);
                // if (records[0].get('idproveedores')) {
                //     dataForm.getForm().findField('clienteproveedor').filters = {
                //         idtipo: win.context == 'cliente' ? 1 : 2,
                //         idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun,
                //         idclientesproveedores: records[0].get('idproveedores')
                //     };
                //     dataForm.getForm().findField('clienteproveedor').getStore().load()
                // }
                // win.sfsolicitudnegocio.getStore().load({
                //     callback: function (records, operation, success) {
                //         win.sfsolicitudnegocio.mask.hide();
                //         console.log('666', record.get('solicitud'), idsolicitud)
                //         // win.sfsolicitudnegocio.setValue(idsolicitud);
                //         // win.sfsolicitudnegocio.setRawValue(record.get('solicitud'));
                //         win.sfsolicitudnegocio.resetOriginalValue();
                //         console.log('after:', win.sfsolicitudnegocio.getValue(), win.sfsolicitudnegocio.getRawValue())
                //         if (tipo == 3) {
                //             var newrecord = win.sfsolicitudnegocio.getStore().findRecord('idsolicitud', idsolicitud)
                //             if(newrecord){
                //                 win.linea.setValue(newrecord.get('linea'));
                //                 win.tipolinea.setValue(newrecord.get('tipolinea'));
                //                 if (records[0].get('idproveedores')) {
                //                     dataForm.getForm().findField('clienteproveedor').filters = {
                //                         idtipo: win.context == 'cliente' ? 1 : 2,
                //                         idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun,
                //                         idclientesproveedores: records[0].get('idproveedores')
                //                     };
                //                     dataForm.getForm().findField('clienteproveedor').getStore().load()
                //                 }
                //             }
                //         }
                //         // console.log( 'record.get(\'puertoorigen\')',record.get('puertoorigen'))
                //     }
                // });

                // win.sfclienteproveedor.getStore().load();
                if (win.sfsector) win.sfsector.getStore().load();
                if(record.get('cobros'))
                    pagoForm.getForm().setValues(Ext.decode(record.get('cobros')));
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
                gridcontenedores.on('render', function (yo) {
                    if (cargandoDatosAdicionales) {
                        gridcontenedores.maskL = new Ext.LoadMask(
                            gridcontenedores, {msg: me.etiquetas.msgLoading});
                        gridcontenedores.maskL.show();
                    }
                });
                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'getDatosAdicionales'}, me),
                    params: {idoferta: idoferta},
                    callback: function (options, success, response) {
                        cargandoDatosAdicionales = false;
                        if (pagoForm.maskL) pagoForm.maskL.hide();
                        if (docForm.maskL) docForm.maskL.hide();
                        if (gridcontenedores.maskL) gridcontenedores.maskL.hide();
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
                                        // pagoForm.hitopago.setDisabled(true);
                                    }
                                }
                            if (info.anexos && info.anexos.length != 0 && docForm)
                                docForm.loadDocuments(info.anexos);
                            if(info.datoscontenedores && info.datoscontenedores.length>0)
                                gridcontenedores.getStore().loadData(info.datoscontenedores);
                        }
                    }
                });
                // if (win.formaPago.calcularTotalMontos() !=
                //     (win.formaPago.calcularTotalMontosHitos() +
                //         win.formaPago.calcularTotalMontosIndicadores()))
                //     Ext.each(win.extrafields, function (field, index) {
                //         var actual = win.down('#montomoneda_' + field.codigoiso.toLowerCase());
                //         if (actual) {
                //             // actual.introducidoManual = true;
                //             // actual.addCls('introducidomanual');
                //             // mainwindow.down('#montomoneda_'+field.codigoiso.toLowerCase()).addCls('tooltiphito');
                //             actual.tip = Ext.create('Ext.tip.ToolTip', {
                //                 target: actual.getEl(),
                //                 html: me.etiquetas.msgHitosNoSuperarMonto,
                //                 autoDestroy: true,
                //                 // anchor:'top'
                //             });
                //             actual.tip.showBy(actual.getEl(), 't');
                //         }
                //     });
                
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
            url: UtilsFn.buildUrl({action: 'obtenerConfiguracionPorDefecto'}, ModuleMgr.get('GestionContratoImportacion')),
            success: function (response) {
                // mask.hide();
                var datos = Ext.decode(response.responseText);
                if (win.tipo != '3') {
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
                }
            },
            failure: function (response) {
                // mask.hide();
                mostrarMensaje(7, 'No han podido cargarse los datos.')
            }
        });
    },
    cargarNumeroAutomatico: function (win, tipo, codigolinea) {
        var me = this;
        // console.log('pulga', tipo);
        // console.log('codigo Linea', codigolinea);
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
                win.nombre.setValue('Oferta #'+datos);
                win.nombre.modNombre = true
            }
        })
        // console.log('ver', codigolinea)
        ;
    },
    cargarNumeroReoferta: function (win, tipo, idsolicitud, numero) {
        var me = this;
        // console.log('pulga', tipo);
        // console.log('codigo Linea', codigolinea);
        var mask = new Ext.LoadMask(win.numero, {msg: me.etiquetas.msgCargandoConsecutivo});
        mask.show();
        win.btnGenerarConsecutivo.setDisabled(true);
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getNumeroReofertaAutomatico'}, me),
            params: {
                tipo: tipo,
                idsolicitud: idsolicitud,
                numero: numero
            },
            callback: function (options, success, response) {
                mask.hide();
                var datos = Ext.decode(response.responseText);
                win.numero.setValue(datos);
                win.numero.clearInvalid();
                win.btnGenerarConsecutivo.setVisible(false);
                win.btnGenerarConsecutivo.setDisabled(false);
                win.numero.consecutivoActual = datos;
            }
        })
        // console.log('ver', codigolinea)
        ;
    },
    getAreaResponsable: function (window, idarea) {
        var me = this;
        var mask3 = new Ext.LoadMask(window.cmbarea.el, {msg: this.etiquetas.msgLoading});
        mask3.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getAreaResponsable'}, ModuleMgr.get('GestionContratoImportacion')),
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
        var win = Ext.create('OfertaNegocioImportacion.view.WindowOfertaNegocio', {
            title: title, extrafields: extrafields
        });
        return win;
        // if(!this.wineditoferta){
        //     this.wineditoferta = new Ext.create('OfertaNegocioImportacion.view.WinEditOferta');
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
            sm = me.getOfertaNegocioImportacion().getSelectionModel();
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
                            me.getOfertaNegocioImportacion().getStore().load();
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
        var grid=this.getOfertaNegocioImportacion(), recordSelected = grid.getSelectionModel().getSelection()[0];
        // console.info('recordSelected:', recordSelected)
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
        Ext.create('OfertaNegocioImportacion.view.WinDetallesOferta',{
            extrafields: grid.extrafields,
        }).show(cloneRecord);
    },
    getWinDetallesOferta: function () {
        if (!this.windetallesoferta) {
            this.windetallesoferta = new Ext.create('OfertaNegocioImportacion.view.WinDetallesOferta');
        }
        return this.windetallesoferta;
    },
    closeWinDetallesOferta: function () {
        this.getWinDetallesOferta().close();
    },
    showWinEstadoTrazas: function () {
        var win = this.getWinOfertaEstadoTrazas(),
            recordSelected = this.getOfertaNegocioImportacion().getSelectionModel().getSelection()[0],
            store = win.items.first().getStore();

        win.setTitle(this.etiquetas.titleWinEstadoTrazas + ' #' + recordSelected.get('numero'));
        win.show();

        store.removeAll();
        store.load({params: {idoferta: recordSelected.get('idoferta')}})
    },
    getWinOfertaEstadoTrazas: function () {
        if (!this.winestadotrazas) {
            this.winestadotrazas = new Ext.create('OfertaNegocioImportacion.view.WinOfertaEstadoTrazas');
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
            if(combo.name=='clienteproveedor'){
                hiddenField.setValue(records[0].data['idclientesproveedores']);
            }else
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
        console.log('selectComboMulti oferta negocio')
        if (hiddenField) {
            // if(valores!='')valores+=',';
            records.forEach(function (x) {
                valores += x.get(combo.localIdMulti) + ','
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
            grid = me.getOfertaNegocioImportacion();
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
        if (this.getOfertaNegocioImportacion().getStore().proxy.extraParams['filtrogeneral[0][field]']) {
            this.getOfertaNegocioImportacion().getStore().proxy.extraParams = {};
            this.getOfertaNegocioImportacion().getStore().load();
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
            win = combo.up('window'),
            form = combo.up('form');
        // console.log('SELECT');
        if (combo.getValue()) {
            // console.log('DATA:', records[0].data);
            Ext.Object.each(records[0].data, function (key, value) {
                // console.log(key, ' : ', value, '>', form.getForm().findField(key))
                if (['idsolicitud', 'numero', 'nombre'].indexOf(key) == -1 && form.getForm().findField(key) && value) {
                    // console.info('existe!!!', key,  value)
                    // console.log(['idclienteproveedor', 'clienteproveedor'].indexOf(key) != -1, win.context == 'proveedor',
                    //             !(['idclienteproveedor', 'clienteproveedor'].indexOf(key) != -1 && win.context == 'proveedor'))
                    // if (!(['idclienteproveedor', 'clienteproveedor'].indexOf(key) != -1 && win.context == 'proveedor')) {
                    if (['idclienteproveedor', 'clienteproveedor'].indexOf(key) === -1) {
                        form.getForm().findField(key).setValue(value);
                        // form.getForm().findField(key).setReadOnly(true);
                    }
                    if (key == 'descripcion'){
                        console.log('DESC')
                        form.getForm().findField(key).setValue(
                            value.replace(/<[\/\-,;:="'\s\w]*>/gi, '').replace('&nbsp;', '').replace(/&aacute;/gi, 'á').replace(/&eacute;/gi, 'é').replace(/&iacute;/gi, 'í').replace(/&oacute;/gi, 'ó').replace(/&uacute;/gi, 'ú'));
                    }
                }
                if (key == 'idarearesponsable' && form.getForm().findField('idarea'))
                    form.getForm().findField('idarea').setValue(value);
                if (key == 'idproveedores' && value) {
                    form.getForm().findField('clienteproveedor').filters = {
                        idtipo: win.context == 'cliente' ? 1 : 2,
                        idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun,
                        idclientesproveedores: value
                    };
                    form.getForm().findField('clienteproveedor').getStore().load()
                }
                // console.log('key', key, value)
                if (key == 'codigo') {
                    console.log('COD')
                    // me.cargarNumeroAutomatico(win, win.tipo, value)
                }
            });
            // win.nombre.modNombre = true
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
                url: UtilsFn.buildUrl({action: 'obtenerProductoServicio'}, ModuleMgr.get('SolicitudNegocioImportacion')),
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
                    me.calcularMontoTotal();
                    // win.formaPago.cambiarMontosPorHitosIndicadores();
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
            win = combo.up('window'),
            form = combo.up('form');
console.log('change', value)
        if (value=='') {
    console.log('llega aqui', combo.getValue(), combo.findRecord('nombre', combo.getValue()))
            form.queryBy(function (x) {
                if (Ext.isFunction(x.reset) && ['nombre','numero', 'objeto', 'responsable', 'idresponsable', 'idsolicitud'].indexOf(x.name) == -1) {
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
        //     store = this.getOfertaNegocioImportacion().getStore(),
        //     filters = [];
        // store.clearFilter(true);
        // for(i in values){
        //     if(!Ext.isEmpty(values[i]))
        //         filters.push({property:i, value: values[i]});
        // }
        // store.addFilter(filters);
    },
    limpiarFiltrosOfertas: function () {
        var store = this.getOfertaNegocioImportacion().getStore();
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
        grid.down('#accionesContextMenu').items.items.forEach(function (x) {
            var config = me.cloneObject(x.initialConfig);
            if (config) {
                config.id = 'menu' + (config.id || Ext.id());
                config.hidden = x.isHidden();
                config.disabled = x.isDisabled();
                if (!config.hidden) {
                    if (x.selector == 'crearcontrato') {
                        config.hidden = !me.isActionAccess('createcontrato', select, grid) || select[0].get('idcontrato') != undefined;
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
            // renderTo: grid.getEl(),
            plain: true,
            itemId: 'contextMenuOfertaImportacion',
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
    crearContratoDeOferta: function () {
        var me=this;
        console.log('???', me.maincontratacion)
        var controller = ModuleMgr.get('GestionContratoImportacion');
        if(!me.maincontratacion) {
            var maskWin = new Ext.LoadMask(
                me.getOfertaNegocioImportacion().el, {msg: 'Cargando configuracion de contrato'});
            maskWin.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'getConfiguraciones'}, controller),
                scope: this,
                callback: function (options, success, response) {
                    maskWin.hide();
                    var response = Ext.decode(response.responseText);
                    me.maincontratacion = controller.getController('MainContratacion');
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
                    me.crearVentanaContrato(me.getOfertaNegocioImportacion().getSelectionModel().getSelection()[0]);
                }
            })
        }else{
            me.crearVentanaContrato(me.getOfertaNegocioImportacion().getSelectionModel().getSelection()[0]);
        }
    },
    crearVentanaContrato: function(select){
        var me=this,
            wincontrato = me.maincontratacion.winContrato(me.getOfertaNegocioImportacion().down('#crearcontratohidden')),
            form = wincontrato.customForm.getForm(),
            storeOfertas=form.findField('nombreoferta').getStore();
        var maskWin = new Ext.LoadMask(
            wincontrato.el, {msg: 'Cargando datos de la oferta'});
        maskWin.show();
        storeOfertas.load({
            callback: function(records, oper, success){
                maskWin.hide();
                if(success){
                    var index=storeOfertas.findExact('idoferta', select.get('idoferta'));
                    if(index!=-1){
                        form.findField('nombreoferta').select(storeOfertas.getAt(index));
                        form.findField('nombreoferta').fireEvent('select', form.findField('nombreoferta'), [storeOfertas.getAt(index)]);
                    }else{
                        mostrarMensaje(7, 'No se puede hacer un contrato de la oferta seleccionada. <br>' +
                            'Revise los datos e int&eacute;ntelo de nuevo.')
                        wincontrato.close();
                    }
                }
            }
        });
    },
    crearContratoDeOferta1: function () {
        var me = this,
            grid = me.getOfertaNegocioImportacion(),
            selects = grid.getSelectionModel().getSelection();
        if (selects.length > 0) {
            var record = selects[0],
                gestordoc = this.application.gestordocumental &&
                this.application.gestordocumental.activo == 1 ? true : false,
                plactivo = this.application.planificacion.activo,
                // modulopersona=this.application.modulopersona,
                // idestadoofertalisto=this.application.idestadoofertalisto,
                context='cliente',
                cloneRecord = record.copy();
            if(record.get('cliente')==2){context='proveedor'}else if(record.get('cliente')==2){context='importacion'}
            Ext.data.Model.id(cloneRecord);
            cloneRecord.set('nombrearea', cloneRecord.get('arearesponsable'))
            cloneRecord.set('nombrepersona', cloneRecord.get('nombreresponsable'))
            cloneRecord.set('numero', '')
            cloneRecord.set('fechafirma', '')
            cloneRecord.set('vigencia', '')
            cloneRecord.set('nombreoferta', record.get('nombre'))
            // cloneRecord.set('idoferta', record.get('idoferta'))
            var win = Ext.create('GestionContratoImportacion.view.MainWindowContratacion'+(record.get('cliente')=='3'?'Importacion':''), {
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
                numeroparametros: {'cliente': record.get('cliente'), 'idsector': record.get('idsector')}
            });
            win.show(null, function () {
                win.doLayout();
                var dataForm = win.customForm,
                    pagoForm = win.formaPago,
                    docForm = win.docForm;
                dataForm.add({
                    xtype: 'hidden',
                    name: 'idoferta'
                });
                dataForm.loadRecord(cloneRecord);
                pagoForm.loadRecord(cloneRecord);
                docForm.loadRecord(cloneRecord);

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
        var me = this, grid = me.getOfertaNegocioImportacion(),
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
                    Ext.create('GestionContratoImportacion.view.DetailsWindow').show(record);
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
        var me = this, grid = me.getOfertaNegocioImportacion(),
            record = grid.getSelectionModel().getSelection()[0];
        if (record.get('idsolicitud')) {
            me.cargandoDatosSolicitud = record.get('idsolicitud');
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'obtenerDatosSolicitud'}, ModuleMgr.get('OfertaNegocioImportacion')),
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
                    Ext.create('SolicitudNegocioImportacion.view.WinDetallesSolicitud').show(record);
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
    calcularMontoTotal: function(){
        // console.log('change', yo)
        var me = this, win = me.getWindowOferta(), total = 0;
        win.down('#tabdescuentosgastos').query('moneyfield').forEach(function(x){
            // console.log('->',x.name)
            if(x.minus)
                total = total - x.getValue();
            else
                total += x.getValue();
        })
        // console.log('total:', total)
        win.down('#montototal').setValue(total);
        if(win.down('#tasa').getValue())
            win.down('#montototalalternativa').setValue(win.down('#montototal').getValue()*win.down('#tasa').getValue());
    },
    changeTasa: function(){
        var me = this, win = me.getWindowOferta();
        console.log(!win.down('#tasa').getValue() || !win.down('#moneda').getValue(), 
                    !win.down('#tasa').getValue(), !win.down('#moneda').getValue(),
                   win.down('#tasa').getValue(),win.down('#moneda').getValue())
        win.down('#buttonAplicarTasa').setDisabled(!win.down('#tasa').getValue() || !win.down('#moneda').getValue());
    },
    changeMonedaTasa: function(){
        var me = this, win = me.getWindowOferta();
        win.down('#montototalalternativa').setFieldLabel('Monto total '+win.down('#moneda').getRawValue());
        win.down('#tasa').setDisabled(!win.down('#moneda').getRawValue());
        me.changeTasa();
    },
    aplicarTasa: function(){
        var me = this, win = me.getWindowOferta();
        win.down('#montototalalternativa').setValue(
            win.down('#montototal').getValue()*
            win.down('#tasa').getValue());
        win.down('#buttonCambiarTasa').setDisabled(false);
        win.down('#tasa').setReadOnly(true);
    },
    cambiarTasa: function(){
        var me = this, win = me.getWindowOferta();
        win.down('#montototalalternativa').setValue(0);
        win.down('#buttonCambiarTasa').setDisabled(true);
        win.down('#tasa').setReadOnly(false);
    }
});
