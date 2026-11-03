var defectoExcederse = '#FFF4c2',
    defectoExcedido = '#ffe2e2',
    defectoDias = 30;
Ext.define('GestionContratoImportacion.controller.MainContratacion', {
    extend: 'CRM.core.controller.Base',
    views: ['MainGridContratacion'],
    refs: [
        {ref: 'MainContratacion', selector: 'co_gcmainContratacionimportacion'},
        {ref: 'MainGridContratacion', selector: 'co_contratosgridContratacionimportacion'},
        {ref: 'mainWindow', selector: 'co_mainwindowContratacionimportacion'},
        {ref: 'hitoPago', selector: 'GridHitoPagoimportacion'},
        {ref: 'producto', selector: 'gridproductoimportacion'},
        {ref: 'vehiculo', selector: 'gridvehiculosimportacion'},
        {ref: 'gridHistorial', selector: 'gridhistorialcontratacionimportacion'},
        {ref: 'ConfigPorDefecto', selector: 'configpordefectowindowimportacion'},
        {ref: 'GpAreaConPermiso', selector: 'gpareaconpermisoimportacion'},
        {ref: 'WinContratoEstadoTrazas', selector: 'wincontratoestadotrazasimportacion'},
        // {ref: 'WinInsertArea', selector: 'wininsertarea'},
        {ref: 'gridReclamacion', selector: 'gridreclamacioncontratacionimportacion'},
        {ref: 'GridPedidos', selector: 'gridpedidosimportacion'},
        {ref: 'wingrafica', selector: 'wincontratograficaimportacion'},
        // {ref: 'GpAreasImplicadas', selector: 'gpareasimplicadas'},
        // {ref: 'WinInsertArea', selector: 'wininsertarea'},
        // {ref: 'WinEditSolicitud', selector: 'wineditsolicitud'},
        {ref: 'WindowModificarNumero', selector: 'windowmodificarnumeroimportacion'},
        // {ref: 'WinEditSolicitud', selector: 'wineditsolicitud'}
        {ref: 'WindowGestionarDocumentos', selector: 'windowgestionardocumentosimportacion'},
    ],

    requires: [
        'GestionContratoImportacion.view.GridEstadoTrazas',
        'GestionContratoImportacion.controller.AreasConPermiso',
        'CRM.ux.segmentedbutton.ButtonSegment',
        'GestionContratoImportacion.view.MainWindowContratacion',
        'GestionContratoImportacion.view.MainGridContratacion',
        'GestionContratoImportacion.view.GestorDocumental.Window',
        'GestionContratoImportacion.view.DetailsWindow',
        'GestionContratoImportacion.view.SignWindow',
        'GestionContratoImportacion.view.DocumentWindow',
        'GestionContratoImportacion.view.GridHistorialContratacion',
        'GestionContratoImportacion.view.GridReclamacionContratacion',
        'GestionContratoImportacion.view.WindowHistorial',
        'GestionContratoImportacion.view.WindowReclamaciones',
        'GestionContratoImportacion.view.GpAreaConPermiso',
        // 'SolicitudNegocioImportacion.view.WinEditSolicitud'
    ],

    init: function () {
        var me = this;
        me.arrayContratoDestino = [null, null, 'cliente', 'proveedor', 'importacion'];
        this.getLang();

        this.listen({
            store: {
                '#stContratosImportacion': {
                    load: this.afterLoadContratos,
                    beforeload: function () {
                        this.getMainGridContratacion().getSelectionModel().clearSelections();
                    }
                }
            },
            component: {
                'co_gcmainContratacionimportacion': {
                    destroy: this.onDestroy
                },
                'co_contratosgridContratacionimportacion': {
                    select: this.buttonEnable,
                    deselect: this.buttonEnable,
                    itemdblclick: this.onDbClickGridContrato,
                    itemcontextmenu: this.itemContextMenu,
                    afterrender: this.grantActions,
                    render: function (grid) {
                        this.ObtenerConfigVigencia(grid);
                        this.renderGrid(grid);
                    }
                },
                'co_contratosgridContratacionimportacion button[action],GridHistorialContratacionimportacion  button[action], co_windoweliminarimportacion  button[action]': {
                    click: this.onClickAction
                },
                'co_contratosgridContratacionimportacion menuitem[action=gestdoc]': {
                    beforerender: function (item) {
                        if (!this.application.gestordocumental || this.application.gestordocumental.activo != 1) {
                            item.hide();
                        }
                    }
                },
                'co_contratosgridContratacionimportacion menuitem[action]': {
                    click: this.onClickAction,
                    beforerender: function (item) {
                        var comiteinactivo = this.application.crm.activeModules.Comite == "false";
                        if (item.action == 'opinions' && comiteinactivo) {
                            item.hide();
                        }
                    }
                },
                'co_contratosgridContratacionimportacion actioncolumn': {
                    click: this.onClickActionColumn
                },
                'co_contratosgridContratacionimportacion searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                'menuitem[gridcontractimp]': {
                    click: this.onClickAction,
                    select: this.buttonEnable
                },
                'configpordefectowindowimportacion': {
                    afterrender: this.checkDirtyPorDefecto
                },
                'configpordefectowindowimportacion button[action=acept]': {
                    click: this.guardarConfiguracionPorDefecto
                },
                // 'co_mainwindowContratacion,configformatonumcontrato_view, configpordefectowindow, wincontratoestadotrazas, windetallescontrato, windetallesreclamacion': {
                'co_mainwindowContratacionimportacion,configformatonumcontrato_viewimportacion, configpordefectowindowimportacion, wincontratoestadotrazas, windetallescontrato, windetallesreclamacion': {
                    beforeshow: function (win) {
                        // console.log('beforeshow', win.xtype)
                        if (this.application.keyMap)
                            this.application.keyMap.disable();
                    },
                    close: function () {
                        if (this.application.keyMap)
                            this.application.keyMap.enable();
                    }
                },
                'windowmodificarnumeroimportacion, windowhistorialimportacion,co_windoweliminarimportacion,wincontratograficaimportacion,estadoscuentawindowimportacion,documentwindowimportacion,configvigenciawindowimportacion,signwindowimportacion': {
                    beforeshow: function (win) {
                        // console.log('beforeshow', win.xtype)
                        if (this.application.keyMap)
                            this.application.keyMap.disable();
                    },
                    close: function () {
                        if (this.application.keyMap)
                            this.application.keyMap.enable();
                    }
                },
                'signwindowimportacion datefield[name=fechafirma]': {
                    change: function (field) {
                        var window = field.up('window'),
                            btn = window.btnAcept;
                        if (!window.suplemento && field.getValue() && field.isValid()) {
                            btn.enable();
                            var fecha_inicial = Ext.clone(field.getValue()),
                                unidadTiempo=window.unidadTiempo.getValue(),
                                vigencia=window.vigencia.getValue();
                            if (unidadTiempo == 1) {
                                fecha_inicial.setDate(fecha_inicial.getDate() + vigencia);
                            } else if (unidadTiempo == 2) {
                                // fecha_inicial.setMonth(fecha_inicial.getMonth() + vigencia);
                                fecha_inicial.setDate(fecha_inicial.getDate() + vigencia * 7);
                            } else if (unidadTiempo == 3) {
                                fecha_inicial.setMonth(fecha_inicial.getMonth() + vigencia);
                                // fecha_inicial.setFullYear(fecha_inicial.getFullYear()+me.vigencia.getValue());
                            }
                            window.fechaFin.setValue(Ext.Date.format(fecha_inicial, 'd/m/Y'));
                        } else {
                            btn.disable();
                            window.fechaFin.reset();
                        }
                    }
                },
                'signwindowimportacion button[action=acept]': {
                    click: function (btn) {
                        var window = btn.up('window'),
                            config = window.config,
                            fecha = window.fechafirma.getValue();
                        if (config && config.action && fecha) {
                            config.fechafirma = fecha;
                            config.fechafin = window.fechaFin.getValue();
                            this.changeEstado(config);
                            window.close();
                        }
                    }
                },
                'documentwindowimportacion form': {
                    validitychange: function (form, valid) {
                        var window = Ext.ComponentQuery.query('documentwindowimportacion')[0],
                            btn = window.btnAcept;
                        if (valid) {
                            btn.enable();
                        } else {
                            btn.disable();
                        }
                    }
                },
                'documentwindowimportacion button[action=acept]': {
                    click: function (btn) {
                        var window = btn.up('window'),
                            form = window.form,
                            config = window.config,
                            params = {
                                idcontrato: config.idcontrato,
                                idestado: config.idestado,
                                responseCfg: {
                                    action: 'edit',
                                    gen: 'm',
                                    concept: me.etiquetas.lbEstado,
                                    count: 1
                                }
                            };
                        if (config && config.action) {
                            this.addDocument(form, params, 'cambiarestado', function () {
                                window.close();
                            });
                        } else {
                            this.addDocument(form, params, 'guardardocumento', function () {
                                mostrarMensaje(1, 'El documento ha sido guardado satisfactoriamente.');
                                window.close();
                            });
                        }
                    }
                },
                'configvigenciawindowimportacion': {
                    show: this.winShow,
                    close: this.winClose
                },
                'configvigenciawindowimportacion button[action=acept]': {
                    click: this.guardarConfiguracionVigencia,
                },
                'co_contratosgridContratacionimportacion pickerfield[name=filtroarea]': {
                    onclick2: this.clearFilterEntity,
                    onclick3: function (cmb) {
                        this.filterByEntity(cmb);
                        this.filterByEntity(cmb);
                    }
                },
				'co_contratosgridContratacionimportacion toggleslidefield[itemId=selectarea]': {
                    afterrender: this.renderBuscarArea,
                    change: this.changeArea
                },
                'heredarwindow[itemId=cambiarareaimportacion] button[action=acept]': {
                    click: this.guardarCambioArea
                },
                'windowmodificarnumeroimportacion button[action=acept]': {
                    click: me.saveModificarNumeroContrato
                },
                'windowgestionardocumentosimportacion button[action=acept]': {
                    click: me.saveDocumentosContrato
                }
            }
        });

        Ext.Ajax.on({
            requestcomplete: function (conn, response, options, eOpts) {
                if (options.url && options.url.indexOf('cargarcontrato') != -1) {
                    var resultParams = [
                        {datatype: 'int', name: 'dominio', value: 1},
                        {datatype: 'string', name: 'numero', value: undefined},
                        {datatype: 'string', name: 'nombre', value: undefined},
                        {datatype: 'string', name: 'clienteproveedor', value: undefined},
                        {datatype: 'int', name: 'vigente', value: undefined},
                        {datatype: 'int', name: 'marco', value: undefined},
                        {datatype: 'int', name: 'cliente', value: undefined},
                    ];
                    if (options.params) {
                        var encontrados = [];
                        Ext.Object.each(options.params, function (key, value) {
                            if (key.indexOf('filter') != -1) {
                                if (key.indexOf('field') != -1) {
                                    var aux = key.split('['),
                                        num = parseInt(aux[1].split(']')[0]);
                                    encontrados.push({name: value, numero: num})
                                }
                            }
                        });
                        Ext.each(resultParams, function (value, key) {
                            encontrados.forEach(function (x) {
                                if (x['name'] == value['name']) {
                                    resultParams[key]['value'] = options.params['filter[' + x['numero'] + '][data][value]']
                                }
                            })
                        });
                    }
                    me.filtros = resultParams;
                }
            }
        });
    },

    winShow: function (win, eOpts) {
        var self = this;
        var form = win.down('form');
        this.activeWindows = true;
        form.on('validitychange', function (yo, valid) {
            console.log('validitychange', valid)
            valido = form.getForm().isDirty() && valid;
            win.disableButtons(!valido);
        });
    },

    checkDirtyPorDefecto: function (win) {
        win.down('form').on('dirtychange', function (yo, dirty) {
            win.btnAceptar.setDisabled(!dirty);
        })
    },

    guardarConfiguracionPorDefecto: function (button) {
        var me = this,
            win = button.up('window'),
            form = win.down('form').getForm(),
            params = form.getValues();
        if (form.isValid()) {
            Ext.MessageBox.show({
                msg: me.etiquetas.lbGuardandoConfiguracion,
                width: 300,
                wait: true,
                waitConfig: {interval: 200}
            });
            form.submit({
                url: UtilsFn.buildUrl({action: 'guardarConfValoresPorDefecto'}, me),
                params: params,
                success: function (form, action) {
                    Ext.MessageBox.hide();
                    mostrarMensaje(1, me.etiquetas.msgGuardadaConfValoresPorDefecto);
                    win.close();
                },
                failure: function (form, action) {
                    Ext.MessageBox.hide();
                }
            });
        } else {
            mostrarMensaje(1, 'no es valido');
        }
    },

    winClose: function (win) {
        document.getElementById('cssVigenciaAExcederse').innerHTML =
            '.vigencia_a_excederse .x-grid-cell, .vigencia_a_excederse input{' +
            '    background: ' + win.down('#colorfilaaexcederse').guardado + ' !important;' +
            '}'
        document.getElementById('cssVigenciaExcedida').innerHTML =
            '.vigencia_excedida .x-grid-cell, .vigencia_excedida input{' +
            '    background: ' + win.down('#colorfilaexpiracion').guardado + ' !important;' +
            '}'
    },

    guardarConfiguracionVigencia: function (button) {
        var me = this,
            win = button.up('window'),
            form = win.down('form').getForm();
        if (form.isValid()) {
            Ext.MessageBox.show({
                msg: me.etiquetas.lbGuardandoConfiguracion,
                width: 300,
                wait: true,
                waitConfig: {interval: 200}
            });
            form.submit({
                url: UtilsFn.buildUrl({action: 'guardarConfiguracionVigencia'}, me),
                success: function (form, action) {
                    Ext.MessageBox.hide();
                    win.down('#colorfilaaexcederse').guardado = win.down('#colorfilaaexcederse').getValue();
                    win.down('#colorfilaexpiracion').guardado = win.down('#colorfilaexpiracion').getValue();
                    win.gridContrato.diasvencimiento = win.down('#cantidaddiasaviso').getValue();
                    mostrarMensaje(1, me.etiquetas.msgGuardadaConfVigencia);
                    if (win.down('#cantidaddiasaviso').isDirty()) win.gridContrato.getStore().load();
                    win.close();
                },
                failure: function (form, action) {
                    Ext.MessageBox.hide();
                }
            });
        } else {
            mostrarMensaje(1, 'no es valido');
        }
    },

    grantActions: function (grid) {
        this.validateGrantedActions({container: grid});
        this.loadConf(grid);
    },

    ObtenerConfigVigencia: function (grid) {
        var me = this;
        var colorAExederse = defectoExcederse,
            colorExcedido = defectoExcedido,
            diasvencimiento = defectoDias;
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'obtenerConfiguracionVigencia'}, me),
            success: function (response) {
                var response = Ext.decode(response.responseText);
                if (response.length) {
                    colorAExederse = response[0].colorprecaucion;
                    colorExcedido = response[0].colorexpirado;
                    diasvencimiento = response[0].diasvencimiento;
                }
                grid.diasvencimiento = diasvencimiento;
                // OJO
                // if (grid.diasvencimientoaux != grid.diasvencimiento)
                //     grid.getStore().reload();
                var cssVigenciaAExcederse = document.createElement('style');
                cssVigenciaAExcederse.id = 'cssVigenciaAExcederse';
                cssVigenciaAExcederse.innerHTML =
                    '.vigencia_a_excederse .x-grid-cell, .vigencia_a_excederse input' +
                    '{background: ' + colorAExederse + ' !important;}';
                document.body.appendChild(cssVigenciaAExcederse);
                var cssVigenciaExcedida = document.createElement('style');
                cssVigenciaExcedida.id = 'cssVigenciaExcedida';
                cssVigenciaExcedida.innerHTML =
                    '.vigencia_excedida .x-grid-cell, .vigencia_excedida input' +
                    '{background: ' + colorExcedido + ' !important;}';
                document.body.appendChild(cssVigenciaExcedida);

            },
            failure: function () {

            }
        });
    },

    itemContextMenu: function (view, list, node, rowIndex, e) {
        var me = this,
            grid = this.getMainGridContratacion(),
            store = grid.getStore(),
            tbar = grid.dockedItems.items[2].items.items,
            selection = grid.getSelectionModel().getSelection();
            len = selection.length,
            items = [],
            sm = view.up('grid').getSelectionModel();
        // console.log(' store', store)
        // console.log(' selection', selection)
        // console.log(' selection[0].data', selection[0].raw.cantreclamaciones)
        if (sm.getCount() <= 1)
            sm.select(list);
        var select = sm.getSelection();
        e.stopEvent();
        grid.down('#accionesContextMenu').items.items.forEach(function (x) {
            var config = me.cloneObject(x.initialConfig);
            if (config) {
                config.id = 'menu' + (config.id || Ext.id());
                config.hidden = x.isHidden();
                config.disabled = x.isDisabled();
                if (!config.hidden) {
                    if (config.selector == 'detallesoferta') {
                        config.hidden = !grid.getSelectionModel().getSelection()[0].get('idoferta');
                        config.text = me.cargandoDatosOferta == select[0].get('idoferta') ? me.etiquetas.msgCargandoDatos : me.etiquetas.lbVerOferta;
                        config.disabled = me.cargandoDatosOferta;
                    }
                }
                if (!config.hidden)
                    items.push(config);
            }
        });
        if (tbar) {
            tbar.forEach(function (x) {
                if (x.xtype == 'button' && ['help', '', undefined, null].indexOf(x.action) == -1) {
                    var config = me.cloneObject(x.initialConfig);
                    if (config) {
                        config.xtype = undefined;
                        config.id = 'menu' + (config.id || Ext.id());
                        config.hidden = x.isDisabled() || x.isHidden();
                        config.disabled = x.isDisabled();
                        config.gridcontractimp = true;
                        if (!config.hidden)
                            items.push(config);
                    }
                }
            });
        }

        if (this.application.contabilidad)
            items.push({
                    text: 'Ver estado de cuenta',
                    action: 'verestadocuenta',
                    iconCls: 'cuentabancaria',
                    gridcontractimp: true,
                    disabled: false
                },
                {
                    text: 'Ver reclamaciones',
                    action: 'reclamacion',
                    iconCls: 'reclamacion',
                    gridcontractimp: true,
                    hidden: len != 1 || selection[0].raw.cantreclamaciones == 0
                }
            );

        var contextMenu = Ext.create('Ext.menu.Menu', {
            plain: true,
            items: items
        });

        if (contextMenu.items.length > 0)
            contextMenu.showAt(e.getXY());
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

    checkState: function (btn) {
        var me = this,
            actions = btn.actions,
            grid = this.getMainGridContratacion(),
            record = grid.getSelectionModel().getSelection()[0];
        btn.idcontrato = record.get('idcontrato');
        mostrarMensaje(2, me.etiquetas.msgCambiarEstado, function (response) {
            if (response === 'ok') {
                if (actions.indexOf('sign') != -1) {
                    me.createSignWindow(btn);
                } else if (actions.indexOf('document') != -1) {
                    me.createDocumentWindow(btn);
                } else {
                    me.changeEstado(btn);
                }
            }
        });
    },

    changeEstado: function (btn) {
        var me = this,
            grid = this.getMainGridContratacion(),
            record = grid.getSelectionModel().getSelection()[0];
        Ext.MessageBox.show({
            msg: me.etiquetas.lbGuardando,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'cambiarestado'}, me),
            params: {
                idcontrato: record.data.idcontrato,
                idestado: btn.idestado,
                fechafirma: btn.fechafirma,
                fechafin: btn.fechafin,
                idtransicion: btn.idtransicion,
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
                        mostrarMensaje(1, result.datos.nuevoestado?'El contrato ha cambiado de estado satisfactoriamente.':
                            'Usted ha hecho su voto al cambio de estado. <br>Se han realizado '+
                            result.datos.obligatoriosefectuados+' de '+result.datos.cantidadrolesobligatorios+' votos obligatorios.');
                        var grid = me.getMainGridContratacion();
                        if(result.datos.nuevoestado) {
                            grid.getStore().load();
                            // if (btn.notificar == 1)
                            //     me.notify(result['data']['roles'], result['data']['contrato']);

                            if (btn.notificar == 1) {
                                me.enviarCorreo({
                                    idcontrato: record.data.idcontrato,
                                    idestado: btn.idestado,
                                    idtransicion: btn.idtransicion,
                                    modelName: 'GestioncontratoModel'
                                });
                            }
                        }
                    } else {
                        mostrarMensaje(2, result['msg']);
                    }
                }
            }
        });
    },

    addDocument: function (form, params, action, fn) {
        var me = this;
        form = form.getForm();
        if (action && form && form.isValid()) {
            Ext.MessageBox.show({
                msg: me.etiquetas.lbGuardando,
                width: 300,
                wait: true,
                waitConfig: {interval: 200}
            });
            form.submit({
                url: UtilsFn.buildUrl({action: action}, me),
                params: params,
                success: function (form, action) {
                    Ext.MessageBox.hide();
                    var grid = me.getMainGridContratacion();
                    grid.getStore().load();
                    if (fn && typeof fn == 'function') {
                        fn.call();
                    }
                },
                failure: function () {
                    Ext.MessageBox.hide();
                }
            });
        }
    },

    afterLoadContratos: function (store) {
        var grid = this.getMainGridContratacion(),
            grid2 = grid.items.items[1];
        grid.down('#contratos').setValue(store.proxy.reader.jsonData.totales['contratos']);
        grid.down('#suplementos').setValue(store.proxy.reader.jsonData.totales['suplementos']);
        this.buttonEnable();
        if (!grid.extrafields) {
            this.addExtraColumns(grid);
        }
    },

    addExtraColumns: function (grid) {
        var store = grid.getStore();
        fields = store.model.getFields(),
            jsondata = store.proxy.reader.jsonData;
        // console.log('jsondata', jsondata)
        extrafields = grid.extrafields = jsondata.monedasentidad;
        // console.log('extrafields', extrafields)
        data = jsondata.data,
            // console.log('data', data)
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
            newcolumns = this.insertarColumnasMonedas(newcolumns, extrafields, pos);
            grid.reconfigure(null, newcolumns);
        }
    },

    insertarColumnasMonedas: function (newcolumns, extrafields, pos) {
        Ext.each(extrafields, function (field) {
            newcolumns.splice(pos, 0, {
                dataIndex: 'montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda,
                // dataIndex: 'montomoneda_' + field.codigoiso.toLowerCase(),
                text: field.codigoiso.toUpperCase(),
                width: 80,
                align: 'right',
                filter: {
                    type: 'numeric'
                },
                renderer: function (value, meta, record) {
                    if (Ext.isEmpty(value)) {
                        value = 0;
                    }
                    var extra='',
                        inc=record.get('incremento_'+field.codigoiso.toLowerCase()+'_'+field.idmoneda);
                    if(inc){
                        extra='<br><u>'+(inc>=0?'+':'')+Ext.util.Format.currency(inc)+'</u> ('+
                            Ext.util.Format.currency((parseFloat(value)-(parseFloat(inc))))+(inc>=0?' +':' ')+Ext.util.Format.currency(inc)+')';
                    }
                    value = Ext.util.Format.currency(value);
                    meta.tdAttr = 'data-qtip="' + value + extra + '"';

                    return value;
                },
                summaryType: function (records, dataindex, b) {
                    var total = 0;
                    records.forEach(function (x) {
                        if (x.get(dataindex)){
                            if(x.get('contratomarco') == "1" ||
                                (x.get('contratomarco') == "0" && !x.get('idcontratomarco')))
                                total += parseFloat(x.get(dataindex));
                        }
                    });
                    return total;
                }
            });
            pos++;
        });
        return newcolumns;
    },

    buttonEnable: function () {
        var me = this,
            grid = me.getMainGridContratacion(),
            acciones,
            selection = grid.getSelectionModel().getSelection(),
            len = selection.length,
            menustate = grid.btnChangeState.menu;

        if (len == 1) {
            acciones = JSON.parse(selection[0].data.acciones);

            for (var i in acciones) {
                switch (acciones[i]) {
                    case 'edit':
                        grid.btnMod.setDisabled(!(len == 1) ||
                            selection[0].get('idestructuracomun')!=this.application.estructura.idestructura);
                        break;
                    // case 'reclamacion':
                    //     grid.btnReclamaciones.setDisabled(!(len == 1) || selection[0].data.cantreclamaciones <= 0);
                    //     break;
                    case 'del':
                        grid.btnDel.setDisabled(!(len > 0) ||
                            selection[0].get('idestructuracomun')!=this.application.estructura.idestructura);
                        break;
                    case 'createsupl':
                        grid.btnCreateSupl.setDisabled(!(len == 1));
                        break;
                    case 'historial':
                        grid.btnHistorial.setDisabled(!(len == 1) || (selection[0].data.idcontrato == selection[0].data.idpadre));
                        break;
                    case 'facturar':
                        grid.btnFacturar.setDisabled(!(len == 1));
                        break;
                    case 'print':
                        if (selection[0].data.proforma) {
                            grid.btnPrint.setDisabled(!(len == 1));
                        }
                        break;
                }
            }
            grid.btnDetails.setDisabled(false);
            grid.btnOpinion.setDisabled(false);
            grid.btnAdjuntarDocumento.setDisabled(false);
            grid.btnTrazas.setDisabled(false);
            grid.btnGraficar.setDisabled(false);
            grid.btnCambiarArea.setDisabled(false);
            grid.btnModificarNumero.setDisabled(false);
            grid.btnAjusteMonetario.setDisabled(false);
            grid.btnLimpiarEspacioTrabajo.setDisabled(false);
            grid.btnArreglarEstado.setDisabled(selection[0].get('idestado'));
            grid.btnGestionarDocumentos.setDisabled(false);
            // grid.btnReclamaciones.setDisabled(false);

            // if (selection[0].data.cantreclamaciones > 0) {
            //     grid.btnReclamaciones.setDisabled(false);
            // } else {
            //     grid.btnReclamaciones.setDisabled(true);
            // }
            grid.btnCambiarArea.setDisabled(false);
//             grid.btnImprimir.setDisabled(false);
            me.createMenuState();
        } else if (len == 0) {
            grid.btnCambiarArea.setDisabled(true);
            grid.btnMod.setDisabled(true);
            grid.btnDel.setDisabled(true);
            grid.btnCreateSupl.setDisabled(true);
            grid.btnHistorial.setDisabled(true);
            // grid.btnReclamaciones.setDisabled(true);
            grid.btnPrint.setDisabled(true);
            grid.btnChangeState.setDisabled(true);
            grid.btnDetails.setDisabled(true);
            grid.btnOpinion.setDisabled(true);
            grid.btnAdjuntarDocumento.setDisabled(true);
            grid.btnTrazas.setDisabled(true);
            grid.btnGraficar.setDisabled(true);
            grid.btnModificarNumero.setDisabled(true);
            grid.btnAjusteMonetario.setDisabled(true);
            grid.btnLimpiarEspacioTrabajo.setDisabled(true);
            grid.btnArreglarEstado.setDisabled(true);
            grid.btnGestionarDocumentos.setDisabled(true);
//             grid.btnImprimir.setDisabled(true);
            menustate.removeAll();
        } else {
            grid.btnCambiarArea.setDisabled(false);
            grid.btnMod.setDisabled(true);
            grid.btnCreateSupl.setDisabled(true);
            grid.btnHistorial.setDisabled(true);
            grid.btnPrint.setDisabled(true);
            grid.btnChangeState.setDisabled(true);
            grid.btnDetails.setDisabled(true);
            grid.btnOpinion.setDisabled(true);
            grid.btnAdjuntarDocumento.setDisabled(true);
            grid.btnTrazas.setDisabled(true);
            grid.btnGraficar.setDisabled(false);
            grid.btnModificarNumero.setDisabled(true);
            grid.btnAjusteMonetario.setDisabled(false);
            grid.btnLimpiarEspacioTrabajo.setDisabled(false);
            grid.btnGestionarDocumentos.setDisabled(true);
            var cumple = selection.every(function(x){return x.get('idestado')==0})
            grid.btnArreglarEstado.setDisabled(!cumple);
            // grid.btnReclamaciones.setDisabled(true);
//             grid.btnImprimir.setDisabled(true);
            menustate.removeAll();
            for (var i in selection) {
                acciones = JSON.parse(selection[i].data.acciones);
                var del = false;
                for (var j in acciones) {
                    if (acciones[j] == 'del' &&
                        selection[i].get('idestructuracomun')==this.application.estructura.idestructura) {
                        del = true;
                        break;
                    }
                }
                if (!del) {
                    grid.btnDel.setDisabled(true);
                    return;
                }
            }
            grid.btnDel.setDisabled(false);
        }
    },

    createMenuState: function () {
        var me = this,
            grid = me.getMainGridContratacion(),
            menu = grid.btnChangeState.menu,
            estados = this.getNextStates(),
            record = grid.getSelectionModel().getSelection()[0];
        menu.removeAll();
        Ext.each(estados, function (estado) {
            if (this.checkTransition(record.data.idestado, estado.idestado)) {
                menu.add({
                    text: estado.nombre,
                    iconCls: estado.icono,
                    tooltip: this.etiquetas.lbChangeState,
                    idestado: estado.idestado,
                    idtransicion: estado.idtransicion,
                    notificar: estado.notificar,
                    action: 'changestate',
                    actions: estado.acciones
                });
            }
        }, this);

        grid.btnChangeState.setDisabled(menu.items.length == 0);
    },

    getNextStates: function () {
        var grid = this.getMainGridContratacion(),
            store = grid.getStore(),
            record = grid.getSelectionModel().getSelection()[0],
            estados = [];

        if (!record || !record.data.idestado) {
            return;
        }
        var datos=null;
        if (record.data.cliente == 2) {
            var datos = store.proxy.reader.jsonData.estados_importacion;
        }

        if (record.data.cliente == 0) {
            var datos = store.proxy.reader.jsonData.estados_proveedor;
        }
        if (record.data.cliente==1 || datos==null) {
            var datos = store.proxy.reader.jsonData.estados_cliente;
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

    renderGrid: function (grid) {
        if (grid.getComponent(0).filters) {
            grid.getComponent(0).filters.createFilters();
        }
        if (grid.getComponent(1).filters) {
            grid.getComponent(1).filters.createFilters();
        }
        grid.module = 'GestionContratoImportacion';
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);
    },

    onSearch: function (field, data) {
        var me = this,
            grid = me.getMainGridContratacion(),
            filters = grid.getComponent(0).filters;

        // filters.getFilter('numerocontrato').setActive(true);
        // filters.getFilter('numerocontrato').setValue(field.getValue());
        with(grid.getStore()){
            proxy.extraParams['filter[100][field]']='general';
            proxy.extraParams['filter[100][data][type]']='other';
            proxy.extraParams['filter[100][data][value]']=field.getValue();
            load();
        }
    },

    onClear: function (field) {
        var me = this,
            grid = me.getMainGridContratacion(),
            filters = grid.getComponent(0).filters,
            numero = filters.getFilter('numero'),
            numerocontrato = filters.getFilter('numerocontrato'),
            nombre = filters.getFilter('nombre');

        // numero.setValue();
        // numerocontrato.setValue();
        // nombre.setValue();
        // numero.setActive(false);
        // numerocontrato.setActive(false);
        // nombre.setActive(false);
        with(grid.getStore()) {
            delete proxy.extraParams['filter[100][field]'];
            delete proxy.extraParams['filter[100][data][type]'];
            delete proxy.extraParams['filter[100][data][value]'];
            load();
        }
    },

    onDestroy: function () {
        this.loading = false;
    },

    onClickAction: function (cmp) {
        console.log('onClickAction', cmp.action, cmp)
        var me = this, arrayContextos = ['proveedor', 'cliente', 'importacion'];
        switch (cmp.action) {
            case 'add':
                this.winContrato(cmp);
                break;
            case 'edit':
                var modelGrid = me.getMainGridContratacion().getSelectionModel().getSelection()[0]['data'],
                    cmp2 = Ext.merge({
                        suplemento: modelGrid.idcontrato != modelGrid.idpadre,
                        addsuplemento: false,
                        tipocontrato: (modelGrid.contratomarco ? 'contratoMarco' : 'contrato'),
                        context: arrayContextos[modelGrid.cliente] //(modelGrid.cliente ? 'cliente' : 'proveedor')
                    }, cmp);
                me.winContrato(cmp2);
                break;
            case 'del':
                this.delContract(cmp);
                break;
            case 'desactivar':
                this.activardesactivarContrato(cmp, false);
                break;
            case 'activar':
                this.activardesactivarContrato(cmp, true);
                break;
            case 'detail':
                this.createDetail(cmp);
                // this.createDetail(cmp.up('gridpanel').getSelectionModel().getSelection()[0]);
                break;
            case 'createsupl':
                console.log('llega')
                var modelGrid2 = cmp.up('grid').getSelectionModel().getSelection()[0]['data'];
                if (modelGrid2.fechafirma) {
                    var cmp3 = Ext.merge({
                        suplemento: true,
                        addsuplemento: true,
                        tipocontrato: (modelGrid2.contratomarco ? 'contratoMarco' : 'contrato'),
                        context: arrayContextos[modelGrid2.cliente] //(modelGrid2.cliente ? 'cliente' : 'proveedor')
                    }, cmp);
                    me.winContrato(cmp3);
                } else {
                    mostrarMensaje(1, me.etiquetas.msgSuplementoFirma);
                }
                break;
            case 'imprimir':
                this.printContract(cmp);
                break;
            case 'imprimirDetalles':
                this.printContract2(cmp);
                break;
            case 'historial':
                this.showContractRecord(cmp);
                break;
            case 'vertrazas':
                this.showWinVerTrazas(cmp);
                break;
            case 'reclamacion':
                this.showWinVerReclamaciones(cmp);
                break;
            case 'confignum':
                this.showConfigNum();
                break;
            case 'configvigencia':
                this.showConfigVigencia(cmp);
                break;
            case 'eliminarBD':
                this.openWinEliminarBD(cmp);
                break;
            case 'gestdoc':
                this.openGestorDocumetal();
                break;
            case 'changestate':
                this.checkState(cmp);
                break;
            case 'opinions':
                this.showOpinions(cmp);
                break;
            case 'detallesoferta':
                this.detallesOferta(cmp);
                break;
            case 'porDefecto':
                this.porDefecto(cmp);
                break;
            case 'cambiarArea':
                this.showWinCambiarArea(cmp);
                break;
            case 'vertrazas':
                this.showWinVerTrazas(cmp);
                break;
            case 'graficar':
                this.showWinGrafica(cmp);
                break;
            case 'verestadocuenta':
                var grid = me.getMainGridContratacion(),
                    selected = grid.getSelectionModel().getSelection(),
                    idclientes = '';
                selected.forEach(function (x) {
                    idclientes += x.get('idclienteproveedor') + ',';
                });
                idclientes = idclientes.substring(0, idclientes.length - 1);
                var wind = Ext.create('GestionContratoImportacion.view.EstadosCuentaWindow', {
                    idclienteproveedor: idclientes
                });
                wind.show()
                break;
            case 'adjuntardocumento':
                me.createDocumentWindow({
                    idcontrato: me.getMainGridContratacion().getSelectionModel().getSelection()[0].data.idcontrato,
                    idestado: 1
                });
//                 Ext.create('GestionContratoImportacion.view.DocumentWindow').show();
                break;
            case 'modificarnumerocontrato':
                me.modificarNumeroContrato(cmp); break;
            case 'ajustemonetario':
                me.ajusteMonetario(cmp); break;
            case 'limpiarespacio':
                me.limpiarEspacio(cmp); break;
            case 'arreglarestado':
                this.arreglarEstado(cmp);break;
            case 'gestionardocumentos':
                me.openGestionarDocumentos();
                break;
            case 'clearfilters':
                with(me.getMainGridContratacion()){
                    down('searchfield').reset();
                    down('searchfield').fireEvent('clear', down('searchfield'));
                    down('searchcmbarea').reset();
                    up('viewport').doLayout();
                    for (var i = 0; i < items.length; i++) {
                        if (getComponent(i).filters)
                            getComponent(i).filters.clearFilters();
                    }
                }
                break;
        }
    },

    porDefecto: function () {
        var me = this, grid = me.getMainGridContratacion();
        var win = Ext.create('GestionContratoImportacion.view.ConfigPorDefectoWindow');
        win.show(null, function () {
            var mask = new Ext.LoadMask(win.el, {msg: me.etiquetas.msgLoading});
            mask.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'obtenerConfiguracionPorDefecto'}, me),
                success: function (response) {
                    mask.hide();
                    var datos = Ext.decode(response.responseText);
                    win.down('form').getForm().loadRecord({
                        getData: function () {
                            return datos[0];
                        }
                    });
                },
                failure: function (response) {
                    mask.hide();
                    mostrarMensaje(6, 'No han podido cargarse los datos.')
                }
            });
        });
    },

    showWinCambiarArea: function (button) {
        var me = this;
        var win = Ext.create('BaseModule.view.HeredarWindow', {
            title: 'Cambiar área',
            itemId: 'cambiarareaimportacion',
            grid: button.up('treepanel'),
            gridprincipal: me.getMainGridContratacion()
        }).show();
    },


    showWinEstadoTrazas: function () {
        var win = this.getWinContratoEstadoTrazas(),
            recordSelected = this.getGestionContrato().getSelectionModel().getSelection()[0],
            store = win.items.first().getStore();

        win.setTitle(this.etiquetas.titleWinEstadoTrazas + ' #' + recordSelected.get('numero'));
        win.show();

        store.removeAll();
        store.load({params: {idoferta: recordSelected.get('idoferta')}})
    },

    showWinVerReclamaciones: function () {
        var me = this,
            data = me.getMainGridContratacion().getSelectionModel().getLastSelected().data;

        Ext.create('GestionContratoImportacion.view.WindowReclamaciones', {
            width: window.innerWidth * 0.9,
            idcontrato: data.idcontrato
        }).show();
    },

    showWinVerTrazas: function () {
        var recordSelected = this.getMainGridContratacion().getSelectionModel().getSelection()[0];
        var win = Ext.create('GestionContratoImportacion.view.WinContratoEstadoTrazas'),
            store = win.items.first().getStore();
        win.setTitle(this.etiquetas.titleWinVerTrazas + ' #' + recordSelected.get('numero'));
        win.show();
        store.removeAll();
        store.load({params: {idcontrato: recordSelected.get('idcontrato')}});
    },

    showWinGrafica: function () {
        var me = this;
        var recordSelected = this.getMainGridContratacion().getSelectionModel().getSelection();
        var temp = [];
        var idcontratos = [];
        for (var i in recordSelected) {
            idcontratos.push(recordSelected[i].data.idcontrato)
            temp.push({
                'idcontrato': recordSelected[i].data.idcontrato,
                'montos': recordSelected[i].data.montototal,
                'numeroContrato': recordSelected[i].get('numerocontrato'),
                'Ejecutado': 0,
                'No Ejecutado': 0
            })
        }
        var win = Ext.create('GestionContratoImportacion.view.WinContratoGrafica', {
                idcontratos: idcontratos
            }),
            store = win.items.first().getStore();
        win.setTitle(this.etiquetas.titleWinGrafica);
        store.loadData(temp);
        win.show(null, function () {
            mask = new Ext.LoadMask(win, {msg: me.etiquetas.msgLoading});
            mask.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'cargarhitoscontrato'}, ModuleMgr.get('GestionContratoImportacion')),
                params: {
                    'idcontrato': Ext.encode(idcontratos)
                },
                success: function (response) {
                    mask.hide()
                    datos = Ext.decode(response.responseText);
                    $idcontratos = me.idcontratos,
                        $montototal = 0,
                        $ejecutado = 0,
                        $noEjecutado = 0,
                        $idcontrat = 0
                    var valores = win.down('chart').store.getRange();//para coger los valores del store
                    for (var i in valores) {
                        $idcontrat = valores[i].get('idcontrato');
                        for (var j in datos['data']) {
                            if (datos['data'][j].idcontrato == $idcontrat && datos['data'][j].inicial == '1') {
                                $noEjecutado += datos['data'][j].monto;
                            }
                        }
                        $montototal = valores[i].get('montos');
                        $ejecutado = $montototal - $noEjecutado;
                        valores[i].set('Ejecutado', $ejecutado);
                        valores[i].set('No Ejecutado', $noEjecutado);
                        $noEjecutado = 0
                    }
                    win.down('chart').store.loadData();
                },
                failure: function () {
                    mask.hide()
                }
            });
        });

    },

    detallesOferta: function () {
        var me = this, grid = me.getMainGridContratacion(),
            record = grid.getSelectionModel().getSelection()[0];
        if (record.get('idoferta')) {
            me.cargandoDatosOferta = record.get('idoferta');
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'getOfertasNegocio'}, ModuleMgr.get('OfertaNegocioImportacion')),
                params: {
                    'filter[0][field]': 'ofern.idoferta',
                    'filter[0][data][type]': 'list',
                    'filter[0][data][value]': '[' + record.get('idoferta') + ']',
                },
                success: function (response) {
                    me.cargandoDatosOferta = null;
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
                    Ext.create('OfertaNegocioImportacion.view.WinDetallesOferta').show(record);
                },
                failure: function (response) {
                    me.cargandoDatosOferta = null;
                    mostrarMensaje(6, 'No han podido cargarse los datos.')
                }
            });
        }
    },

    showConfigVigencia: function (button) {
        var me = this, colorAExederse = defectoExcederse,
            colorExcedido = defectoExcedido,
            diasvencimiento = defectoDias,
            win = Ext.create('GestionContratoImportacion.view.ConfigVigenciaWindow', {
                gridContrato: button.up('grid'),
                defectoExcederse: defectoExcederse,
                defectoExcedido: defectoExcedido,
                defectoDias: defectoDias,
            });
        win.show(null, function () {
                var mask = new Ext.LoadMask(win.el, {msg: this.etiquetas.msgLoading});
                mask.show();
                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'obtenerConfiguracionVigencia'}, me),
                    success: function (response, opts) {
                        mask.hide();
                        var response = Ext.decode(response.responseText), idconfig = '';
                        if (response.length) {
                            colorAExederse = response[0].colorprecaucion;
                            colorExcedido = response[0].colorexpirado;
                            diasvencimiento = response[0].diasvencimiento;
                            idconfig = response[0].idcontratoexpiracionvigencia;
                        }
                        win.down('#cantidaddiasaviso').guardado = diasvencimiento;
                        win.down('#cantidaddiasaviso').setValue(diasvencimiento);
                        win.down('#cantidaddiasaviso').resetOriginalValue();
                        win.down('#colorfilaaexcederse').guardado = colorAExederse;
                        win.down('#colorfilaaexcederse').setValue(colorAExederse);
                        win.down('#colorfilaaexcederse').resetOriginalValue();
                        win.down('#colorfilaexpiracion').guardado = colorExcedido;
                        win.down('#colorfilaexpiracion').setValue(colorExcedido);
                        win.down('#colorfilaexpiracion').resetOriginalValue();
                        win.down('#idconfig').setValue(idconfig);
                        if (colorAExederse == null) win.down('#activadoexpiracion').setValue(false);
                        if (colorExcedido == null) win.down('#activadoexpirado').setValue(false);
                        if (colorAExederse == win.defectoExcederse &&
                            colorExcedido == win.defectoExcedido && diasvencimiento == win.defectoDias)
                            win.down('#defecto').setValue(true);
                        win.btnAceptar.setDisabled(true);
                    },
                    failure: function (response, opts) {
                        mask.hide();
                    }
                });
            }
        );
    },

    onClickActionColumn: function (btn, gridView, rowIndex, colIndex, column, e) {
        var me = this,
            columns = me.getMainGridContratacion().columnManager.getColumns(),
            col = 0;
        for (var i in columns) {
            if (!columns[i].locked) {
                col++;
            }
        }
        me.getMainGridContratacion().getSelectionModel().select(rowIndex);
        var modelGrid = me.getMainGridContratacion().getSelectionModel().getLastSelected().data,
            acciones = JSON.parse(modelGrid.acciones),
            action = false;
        switch (colIndex) {
            case col - 2:
                for (var j in acciones) {
                    if (acciones[j] == 'edit') {
                        action = true;
                        break;
                    }
                }
                if (!action) {
                    return;
                }
                var cmp = {
                    action: 'edit',
                    suplemento: modelGrid.idcontrato != modelGrid.idpadre,
                    addsuplemento: false,
                    tipocontrato: (modelGrid.contratomarco ? 'contratoMarco' : 'contrato'),
                    context: (modelGrid.cliente ? 'cliente' : 'proveedor')
                };
                me.winContrato(cmp);
                break;
            case col - 1:
                for (var j in acciones) {
                    if (acciones[j] == 'del') {
                        action = true;
                        break;
                    }
                }
                if (!action) {
                    return;
                }
                me.delContract();
                break;
        }
    },

    onDbClickGridContrato: function (gridView, record, item, rowIndex, colIndex, column, e) {
        var grid=this.getMainGridContratacion(), btn = grid.btnDetails;
        grid.getSelectionModel().select(record, false, true);
        btn.fireEvent('click', btn);
    },

    winContrato: function (cmp) {
        var me = this,
            gdactivo = this.application.gestordocumental && this.application.gestordocumental.activo == 1 ? true : false,
            plactivo = this.application.planificacion.activo,
            modulopersona = this.application.modulopersona,
            numero_manual= this.application.numero_manual,
            idestadoofertalisto = this.application.idestadoofertalisto,
            grid = cmp.up('grid') ? cmp.up('grid') : me.getMainGridContratacion(),
            acciones=this.actions[this.application.securityData['idfuncionalidad']],
            mainwindow = Ext.create('GestionContratoImportacion.view.MainWindowContratacion' + (cmp.context == 'importacion' ? 'Importacion' : ''), {
                etiquetas: me.etiquetas,
                concept: me.etiquetas.lbContrato,
                action: cmp.action,
                tipocontrato: cmp.tipocontrato,
                context: cmp.context,
                suplemento: cmp.suplemento,
                addsuplemento: cmp.addsuplemento,
                valueCheckHitoPago: true,
                gestordocumental: gdactivo,
                planificacion: plactivo,
                extrafields: grid.extrafields,
                grid: grid,
                modulopersona: modulopersona,
                idestadoofertalisto: idestadoofertalisto,
                acciones: acciones,
                numero_manual: numero_manual,
                // height: cmp.context=='importacion'?490:450,
                show_by_resource: me.application.show_by_resource,
                mostrar_montototal: me.application.mostrar_montototal,
                _this: me
            });
        //
        // console.log('this', this);
        // sessionStorage.setItem('tipo', 'checkbox');

        mainwindow.show(null, function () {
            if (cmp.action == 'edit' || cmp.action == 'createsupl') {
                var record = grid.getSelectionModel().getSelection()[0];
                var cloneRecord = record.copy();
                Ext.data.Model.id(cloneRecord);
                console.log('cloneRecord:', cloneRecord)
                mainwindow.nombre.modNombre = true;
                mainwindow.customForm.getForm().loadRecord(record);
                mainwindow.formProforma.getForm().loadRecord(record);
                mainwindow.formaPago.getForm().loadRecord(record);
                mainwindow.formaPago.changeIncrement=true;
                // mainwindow.formAreasConPermiso.getStore().proxy.extraParams = {idcontrato: record.get('idcontrato')};
                // mainwindow.formAreasConPermiso.getStore().load();
                // if(record.get('idoferta')){
                // mainwindow.sfofertanegocio.mask = new Ext.LoadMask(mainwindow.sfofertanegocio, {msg: this.etiquetas.msgLoading});
                // mainwindow.sfofertanegocio.mask.show();
                // mainwindow.sfofertanegocio.setRawValue(cloneRecord.get('nombreoferta'));
                // mainwindow.sfofertanegocio.getStore().load({
                //     callback: function (records, operation, success) {
                //         // mainwindow.sfofertanegocio.mask.hide();
                //         mainwindow.sfofertanegocio.setValue(idoferta);
                //         mainwindow.sfofertanegocio.setRawValue(cloneRecord.get('nombreoferta'));
                //         // win.sflinea.fireEvent('change', win.sflinea);
                //         mainwindow.sfofertanegocio.resetOriginalValue();
                //     }
                // });
                // }
                if (record.data.vigencia == 0) {
                    mainwindow.vigencia.setValue('');
                    mainwindow.fechaFin.setReadOnly(false);
                } else {
                    mainwindow.vigencia.setDisabled(false);
                    mainwindow.unidadTiempo.setDisabled(false);
                }
                if (!mainwindow.addsuplemento && mainwindow.suplemento) {
                    mainwindow.objetosuplemento.setValue(record.data.objetosuplemento);
                    mainwindow.objetosuplemento.resetOriginalValue();
                }
                mainwindow.numerojson = Ext.decode(record.data.numerojson);
                if(me.getVehiculo() && !me.getVehiculo().isHidden())me.cargarVehiculos(record.data.idcontrato);
                if (mainwindow.formaPago.calcularTotalMontos() !=
                    (mainwindow.formaPago.calcularTotalMontosHitos() +
                        mainwindow.formaPago.calcularTotalMontosIndicadores()))
                    Ext.each(mainwindow.extrafields, function (field, index) {
                        var actual = mainwindow.down('#montomoneda_' + field.codigoiso.toLowerCase());
                        if (actual) {
                            actual.resetOriginalValue();
                        }
                    });

                if (record.data.registropago) {
                    me.cargarRegistroPago(mainwindow, JSON.parse(record.data.registropago))
                }
                if (mainwindow.sfproforma.getValue()) {
                    var len = me.addDynamicFormModContrato(mainwindow, JSON.parse(record.data.elemento));
                }
                if (cmp.action == 'createsupl') {
                    mainwindow.fechafirma.setValue('');
                    mainwindow.fechaFin.setValue('');
                }
                if(cmp.action=='createsupl')mainwindow.fechafirma.setValue('');
                setTimeout(function () {
                    mainwindow.focus();
                }, 10);
                if (record.data.idlinea) mainwindow.sftipolinea.setDisabled(false);
                if (record.data.idlinea) mainwindow.sfclienteproveedor.setDisabled(false);
                me.getDatosAdicionales(record.data.idcontrato);
            } else {
                setTimeout(function () {
                    mainwindow.nombre.focus();
                }, 10);
                var mask = new Ext.LoadMask(mainwindow.cmbreponsable.el, {msg: this.etiquetas.msgLoading});
                mask.show();
                me.getResponsiblePerson(mainwindow, function () {
                    mask.hide();
                });
                mainwindow.fechafirma.setDisabled(true);
                // mainwindow.sfsector.Lmask = new Ext.LoadMask(mainwindow.sfsector.el, {msg: me.etiquetas.msgCargandoValorporDefecto});
                mainwindow.sftipocontrato.Lmask = new Ext.LoadMask(mainwindow.sftipocontrato.el, {msg: me.etiquetas.msgCargandoValorporDefecto});
                mainwindow.cmbarea.Lmask = new Ext.LoadMask(mainwindow.cmbarea.el, {msg: me.etiquetas.msgCargandoValorporDefecto});
                // mainwindow.sfsector.Lmask.show();
                mainwindow.sftipocontrato.Lmask.show();
                mainwindow.cmbarea.Lmask.show();
                me.cargarValoresPorDefecto(mainwindow);

            }
            mainwindow.center();
            mainwindow.doLayout();
            mainwindow.formaPago.doLayout();

        });
        return mainwindow;
    },

    cargarVehiculos: function(idcontrato){
        var me=this, vehiculo=me.getVehiculo(), cargandoDatosW=true;
        vehiculo.on('render', function(yo){
            if(cargandoDatosW){
                vehiculo.maskLW= new Ext.LoadMask(
                    vehiculo, {msg: this.etiquetas.msgLoading});
                vehiculo.maskLW.show();
            }
        });

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getVehiculosContrato'}, this),
            params: {
                // vehiculos: record.get('vehiculos').substring(1, record.get('vehiculos').length-1)
                // vehiculos: idvehiculos?idvehiculos:'-1'
                idcontrato: idcontrato
            },
            success: function (response) {
                cargandoDatosW=false;
                if(vehiculo.maskLW)vehiculo.maskLW.hide();
                var response = Ext.decode(response.responseText);
                vehiculo.store.loadData(response);
                vehiculo.datosLoad = response;
            }
        });
    },

    cargarValoresPorDefecto: function (win) {
        var me = this;
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'obtenerConfiguracionPorDefecto'}, me),
            success: function (response) {
                var datos = Ext.decode(response.responseText);
                // win.sfsector.Lmask.hide();
                win.sftipocontrato.Lmask.hide();
                win.cmbarea.Lmask.hide();
                if (datos[0] && win) {
                    win.sfsector.setValue(datos[0]['sector']);
                    win.hfsector.setValue(datos[0]['idsector']);
                    win.sftipocontrato.setValue(datos[0]['tipocontrato']);
                    win.hftipocontrato.setValue(datos[0]['idtipocontrato']);
                    win.cmbarea.setValue(datos[0]['nombrearea']);
                    win.hfarea.setValue(datos[0]['idarea']);
                }
            },
            failure: function (response) {
                mostrarMensaje(6, 'No han podido cargarse los datos.')
            }
        });
    },

    cargarRegistroPago: function (mainwindow, registroPago) {

        var pagoAlternativo = registroPago['alternativo'],
            hitos = registroPago['hitos'],
            store = this.getHitoPago().getStore();
        if (Array.isArray(pagoAlternativo) && pagoAlternativo.length > 0) {
            for (var i in pagoAlternativo) {
                var moneda = this.application.getFormaPagoContratacionController().addCmpMoneda(mainwindow.formaPago.pagoAlternativo.btnAddMoneda);
                moneda.moneda.setValue(Ext.create('GestionContratoImportacion.model.Moneda', pagoAlternativo[i]['moneda']));
                if (!pagoAlternativo[i]['tasaDisable']) {
                    moneda.tasa.setDisabled(false);
                    moneda.tasa.getStore().load({
                        params: {
                            idmonedaentidad: pagoAlternativo[i]['moneda']['idmonedaentidad']
                        }
                    });
                    moneda.tasa.setValue(Ext.create('GestionContratoImportacion.model.Tasa', pagoAlternativo[i]['tasa']));
                    moneda.tasa['valueModels'] = [{data: pagoAlternativo[i]['tasa']}];
                }
                moneda.montoAlternativo.setDisabled(false);
                moneda.montoAlternativo.setValue(pagoAlternativo[i]['montoAlternativo']);
            }
        }

        if (hitos && hitos.length) {
            store.loadData(hitos);
            store.originalValue = Ext.encode(hitos);
            store.fireEvent('loaddata', store);
        } else {
            store.originalValue = '[]';
            store.fireEvent('loaddata', store);
        }
    },

    addDynamicFormModContrato: function (win, record) {
        var me = this,
            form = win.formDynamic,
            itemsPanel = this.searchComponent(record, form);
        if (itemsPanel.length > 0) {
            var panel = {
                xtype: 'panel',
                labelAlign: 'top',
                bodyStyle: 'background:#DFE9F6;',
                layout: 'column',
                columnWidth: 1,
                border: false,
                id: 'paneldel',
                flex: 1,
                items: itemsPanel
            };
            form.add(panel);
            /*if (!win.maximized) {
             win.setHeight(540);
             win.center();
             }*/
        } else {/*
         if (!win.maximized) {
         win.setHeight(475);
         win.center();
         }*/
            // mostrarMensaje(1, me.etiquetas.msgElementosNoExiste);
        }
        win.setAutoScroll(true);
        return itemsPanel.length;
    },

    searchComponent: function (arrayComponent, form) {
        var me = this,
            xtype = 'textfield',
            itemsPanel = new Array();
        for (var i in arrayComponent) {
            var itemsCmp = arrayComponent[i].items,
                items = new Array();
            for (var k in itemsCmp) {
                var cmp = itemsCmp[k];

//                 cmp.xtype = 'fieldset';
                var ee = me.getCmp(cmp);
                if (cmp.items) {
                    var items2 = new Array();
                    for (var j in cmp.items) {
                        items2.push(form.createCmp(me.getCmp(cmp.items[j])));
                    }
                    if (items2.length > 0) {
                        var fieldSet2 = Ext.create('Ext.ux.ComboFieldSet', {
                            title: itemsCmp[k].title,
                            htmlvalue: itemsCmp[k].htmlvalue,
                            collapsible: true,
                            collapsed: items2.length == 0,
                            labelAlign: 'top',
                            layout: 'column',
                            columnWidth: 1,
                            border: true,
                            xtypejojo: 'toolbar',
                            otherjojo: true,
                            cfgjojo: {
                                bodyStyle: 'background:#DFE9F6;',
                                border: false,
                                margin: 0,
                                style: "background-color: transparent; background-image: none;",
                                defaults: {
                                    width: 19,
                                    height: 19
                                },
                                items: [
                                    {
                                        xtype: 'button',
                                        iconCls: 'icondistra-vistaprevia icon-small',
                                        action: 'vistaprevia',
                                        tooltip: this.etiquetas.lbVistaPrevia + " " + itemsCmp[k].title.toLowerCase()
                                    }, {
                                        xtype: 'button',
                                        iconCls: 'icondistra-modificar icon-small',
                                        action: 'modificar',
                                        tooltip: this.etiquetas.lbModificarElemento + " " + itemsCmp[k].title.toLowerCase()
                                    }, {
                                        xtype: 'button',
                                        iconCls: 'icondistra-eliminar icon-small',
                                        action: 'eliminar',
                                        tooltip: this.etiquetas.lbEliminarElemento + " " + itemsCmp[k].title.toLowerCase()
                                    }
                                ]
                            },
                            defaults: {
                                bodyStyle: 'background:#DFE9F6;',
                                margin: '0 5 5 5',
                                columnWidth: 0.5,
                                layout: 'hbox',
                                border: false
                            },
                            items: items2
                        });
                        items.push(form.createCmp(fieldSet2));
                    }
                } else {
                    items.push(form.createCmp(ee));
                }
            }
            // if (true) {
            var fieldSet = Ext.create('Ext.ux.ComboFieldSet', {
                xtype: arrayComponent[i].xtype,
                title: arrayComponent[i].title,
                htmlvalue: arrayComponent[i].htmlvalue,
                clausula: arrayComponent[i].clausula,
                tipo: arrayComponent[i].tipo,
                collapsible: true,
                collapsed: items.length == 0,
                labelAlign: 'top',
                layout: 'column',
                columnWidth: 1,
                xtypejojo: 'toolbar',
                otherjojo: true,
                cfgjojo: {
                    bodyStyle: 'background:#DFE9F6;',
                    border: false,
                    margin: 0,
                    style: "background-color: transparent; background-image: none;",
                    defaults: {
                        width: 19,
                        height: 19
                    },
                    items: [{
                        xtype: 'button',
                        iconCls: 'icondistra-adicionar icon-small',
                        action: 'add',
                        tooltip: this.etiquetas.lbAdd + " " + this.etiquetas.titleClausulaS.toLowerCase(),
                        hidden: !(arrayComponent[i].clausula)
                    }, {
                        xtype: 'button',
                        iconCls: 'icondistra-vistaprevia icon-small',
                        action: 'vistaprevia',
                        tooltip: this.etiquetas.lbVistaPrevia + " " + arrayComponent[i].title.toLowerCase(),
                        hidden: arrayComponent[i].clausula
                    }, {
                        xtype: 'button',
                        iconCls: 'icondistra-modificar icon-small',
                        action: 'modificar',
                        tooltip: this.etiquetas.lbModificarElemento + " " + arrayComponent[i].title.toLowerCase(),
                        hidden: arrayComponent[i].clausula
                    }, {
                        xtype: 'button',
                        iconCls: 'icondistra-eliminar icon-small',
                        action: 'eliminar',
                        tooltip: this.etiquetas.lbEliminarElemento + " " + arrayComponent[i].title.toLowerCase()
                    }
                    ]
                },
                defaults: {
                    bodyStyle: 'background:#DFE9F6;',
                    margin: '0 5 5 5',
                    columnWidth: 0.5,
                    layout: 'hbox',
                    border: false
                },
                items: items
            });
            itemsPanel.push(fieldSet);
            // }
        }
        return itemsPanel;
    },

    getCmp: function (cmp) {
        var xtype = cmp.xtype || 'textfield';
        cmp.xtype = xtype;
        if (cmp.tipo == 'container') {
            cmp.title = cmp.denominacion;
        } else {
            cmp.fieldLabel = cmp.denominacion;
            cmp.name = cmp.denominacion;
            cmp.originalValue = cmp.value;
            cmp.allowBlank = cmp.obligatorio == "true" ? false : cmp.obligatorio == "false" ? true : !cmp.obligatorio;
        }
        if (xtype == 'htmleditor') {
            cmp.enableVar = false;
            cmp.enableSourceEdit = false;
        }
        if (cmp.cfg && !Ext.Object.isEmpty(Ext.isObject(cmp.cfg) ? cmp.cfg : Ext.decode(cmp.cfg))) {
            var cfg = Ext.isObject(cmp.cfg) ? cmp.cfg : Ext.decode(cmp.cfg);
            for (var i in cfg) {
                if (i == 'maskRe' || i == 'regex') {
                    cmp[i] = new RegExp(cfg[i]);
                } else {
                    cmp[i] = cfg[i] == 'true' ? true : cfg[i] == 'false' ? false : cfg[i];
                }
            }
        }
        if (cmp.event && !Ext.Object.isEmpty(Ext.isObject(cmp.event) ? cmp.event : Ext.decode(cmp.event))) {
            var event = Ext.isObject(cmp.event) ? cmp.event : Ext.decode(cmp.event),
                object = new Object();
            for (var i in event) {
                object[i] = Ext.decode(event[i]);
            }
            cmp['listeners'] = object;
        }
        if (cmp.fuente) {
            cmp.fuente = Ext.isObject(cmp.fuente) ? cmp.fuente : Ext.decode(cmp.fuente);
        }
        return cmp;
    },

    delContract: function (cmp) {
        var me = this,
            selection = cmp.up('grid').getSelectionModel().getSelection(),
            arrayDel = new Array();
        if (selection.length > 0) {
            me.application.keyMap.disable();
            mostrarMensaje(2, me.etiquetas.msgEliminar + (selection.length > 1 ? me.etiquetas.msgContratoP : me.etiquetas.msgContratoS), function (response) {
                if (response === 'ok') {
                    for (var i in selection) {
                        arrayDel.push({idcontrato: selection[i].data.idcontrato, nombre: selection[i].data.nombre})
                    }
                    Ext.MessageBox.show({
                        msg: me.etiquetas.lbGuardando,
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200}
                    });
                    Ext.Ajax.request({
                        url: UtilsFn.buildUrl({action: 'delcontrato'}, me),
                        params: {
                            arrayDel: arrayDel ? Ext.encode(arrayDel) : arrayDel,
                            responseCfg: {
                                action: 'del',
                                gen: 'm',
                                concept: selection.length == 1 ? me.etiquetas.lbContract.getSingular().get() : me.etiquetas.lbContract.getPlural().get(),
                                count: selection.length
                            }
                        },
                        success: function (response, opts) {
                            Ext.MessageBox.hide();
                          cmp.up('grid').getStore().load();
                            me.application.keyMap.enable();
                        },
                        failure: function (response, opts) {
                            Ext.MessageBox.hide();
                            me.application.keyMap.enable();
                        }
                    });
                }
                me.application.keyMap.enable();
            });
        }
    },

    printContract: function (cmp) {
        var me = this,
            data = me.getMainGridContratacion().getSelectionModel().getLastSelected().data,
            idcontrato = data.idcontrato,
            numero = me.etiquetas.lbNumeroReporte + data.numero,
            idplantilla = data.idplantilla;
        // Ext.create('Ext.ux.Report', {
        //     nombrereporte: 'crmCartaVertical',
        //     idplantilla: idplantilla,
        //     params: [
        //         {name: 'idcontrato', value: idcontrato, datatype: 'int'},
        //         {name: 'ncontrato', value: numero, datatype: 'string'},
        //     ]
        // }).show();

        Ext.create('Ext.ux.JasperReport', {
            title: 'Vista previa de la proforma',
            typeRequest: 'auto',
            typeFormat: 'PDF',
            content: 'application/pdf',
            paginated: false,
            isAttachment: false,
            name: 'crmCartaVertical',
            description: 'Contrato',
            isList: true,
            params: {
                idcontrato: idcontrato,
                ncontrato: numero,
            },
            dirReport: '/reports/crm/crmCartaVertical',
            uiSearch: {}
            // }]
        });
    },

    printContract2: function (cmp) {
        var me = this,
            grid = me.getMainGridContratacion(),
            //contratosdata=grid.getSelectionModel().getSelection(),
            contratosdata = grid.getStore().getRange(),
            iddominio = window.parent.UCID.portal.perfil.iddominio,
            idcontratos = [];
        contratosdata.forEach(function (x) {
            // idcontratos += x.get('idcontrato') + ',';
            idcontratos.push(x.get('idcontrato'));
        });
//         console.log('cambio7:', idcontratos.slice(0, -1))
//         grid.up('viewport').doLayout();
//         this.filtros.push({name: 'dominio', value: iddominio, datatype: 'int'});
//         Ext.create('Ext.ux.Report', {
//             nombrereporte: 'crmContratosGrid',
//             params: [{name: 'idcontratos', value: idcontratos.slice(0, -1), datatype: 'string'}],
//             // params: this.filtros,
//         }).show();

        Ext.create('Ext.ux.JasperReport', {
            title: 'Vista de contratos',
            typeRequest: 'auto',
            typeFormat: 'PDF',
            content: 'application/pdf',
            paginated: false,
            isAttachment: false,
            name: 'crmContratosGrid',
            description: 'Contrato',
            isList: true,
            params: {
                idcontratos: idcontratos.toString()
            },
            dirReport: '/reports/crm/crmContratosGrid',
            uiSearch: {}
            // }]
        });
    },

    showContractRecord: function (cmp) {
        var me = this,
            data = me.getMainGridContratacion().getSelectionModel().getLastSelected().data,
            idfuncionalidad = this.application.securityData.idfuncionalidad,
            showModHistorico = this.actions[idfuncionalidad]['btnModHitorico'];

        Ext.create('GestionContratoImportacion.view.WindowHistorial', {
            width: window.innerWidth * 0.9,
            idcontrato: data.idcontrato,
            showModHistorico: showModHistorico
        }).show();
    },

    showConfigNum: function () {
        Ext.create('ConfigFormatoNumContrato.view.Main', {modal: true, closeAction: 'destroy'}).show();
    },

    getFile: function (window, id, fn) {
        var me = this;
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getFile'}, this),
            params: {
                iddocument: id
            },
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                response = response[0];
                window.fileupload.fireEvent('seturl', window.fileupload, response.url);
                if (fn && typeof fn == 'function') {
                    fn.call();
                }
            }
        });
    },

    getResponsiblePerson: function (window, fn) {
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getPersonaPerfil'}, this),
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                if (response.data) {
                    window.cmbreponsable.setValue(response.data.nombreapellidos);
                    window.hfresponsable.setValue(response.data.idpersona);
                }
                if (fn && typeof fn == 'function') {
                    fn.call();
                }
            }
        });
    },

    getAreaResponsable: function (window, idarea) {
        var me = this;
        var mask3 = new Ext.LoadMask(window.cmbarea.el, {msg: this.etiquetas.msgLoading});
        mask3.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getAreaResponsable'}, this),
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

    getDatosAdicionales: function (idcontrato) {
        var window = this.getMainWindow(),
            pagoForm = window.formaPago,
            docForm = window.docForm,
            formAreasImplicadas = window.formAreasImplicadas,
            gridvehiculo=window.tabVehiculos,
            gridclientesasociados=window.tabClientesAsociados,
            gridPedidos=this.getGridPedidos(),
            tabhitosadicional=window.down('#tabhitosadicional');
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
        if(formAreasImplicadas)
            formAreasImplicadas.on('render', function (yo) {
                if (cargandoDatosAdicionales) {
                    formAreasImplicadas.maskL = new Ext.LoadMask(
                        formAreasImplicadas, {msg: this.etiquetas.msgLoading});
                    formAreasImplicadas.maskL.show();
                }
            });
        if(gridclientesasociados)
            gridclientesasociados.on('render', function (yo) {
                if (cargandoDatosAdicionales) {
                    gridclientesasociados.maskL = new Ext.LoadMask(
                        gridclientesasociados, {msg: this.etiquetas.msgLoading});
                    gridclientesasociados.maskL.show();
                }
            });
        if(gridPedidos)
            gridPedidos.on('render', function (yo) {
                if (cargandoDatosAdicionales) {
                    gridPedidos.maskL = new Ext.LoadMask(
                        gridPedidos, {msg: this.etiquetas.msgLoading});
                    gridPedidos.maskL.show();
                }
            });
        if(tabhitosadicional)
            tabhitosadicional.on('render', function (yo) {
                if (cargandoDatosAdicionales) {
                    tabhitosadicional.maskL = new Ext.LoadMask(
                        tabhitosadicional, {msg: this.etiquetas.msgLoading});
                    tabhitosadicional.maskL.show();
                }
            });
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getDatosAdicionales'}, this),
            params: {
                idcontrato: idcontrato
            },
            scope: this,
            callback: function (options, success, response) {
                // console.log('aaaa')
                cargandoDatosAdicionales = false;
                if (pagoForm.maskL) pagoForm.maskL.hide();
                if (docForm.maskL) docForm.maskL.hide();
                if(gridvehiculo && gridvehiculo.maskL)gridvehiculo.maskL.hide();
                if (formAreasImplicadas && formAreasImplicadas.maskL) formAreasImplicadas.maskL.hide();
                if (gridclientesasociados && gridclientesasociados.maskL) gridclientesasociados.maskL.hide();
                if (gridPedidos && gridPedidos.maskL) gridPedidos.maskL.hide();
                if (tabhitosadicional && tabhitosadicional.maskL) tabhitosadicional.maskL.hide();
                var response = Ext.decode(response.responseText),
                    anexos = response.data['anexos'];
                console.info('response:', response);
                if (response.data && this.getProducto()) {
                    console.log('trabajo');
                    if (response.data['productos']) {
                        var store = this.getProducto().getStore();
                        Ext.each(response.data['productos'], function (value, key) {
                            response.data['productos'][key]['datos_json_encode'] = value['datos_json'];
                            response.data['productos'][key]['datos_json'] = Ext.decode(value['datos_json']);
                        });
                        console.log('Aqui', response.data['productos']);
                        console.log('store', store);
                        store.loadData(response.data['productos']);
                        this.getProducto().datosLoad = response.data['productos'];
                        store.fireEvent('loaddata', store);
                        // store.fireEvent('update', store);
                        if (response.data['productos'].length > 0)
                            this.getMainWindow().formaPago.tabpanel.setActiveTab(this.getProducto());
                    }

                    /*  if (anexos && anexos.length != 0) {
                          window.docForm.loadDocuments(anexos);
                      }*/

                }
                if (response.data && this.getHitoPago()) {
                    var storeh = this.getHitoPago().store;
                    var final=[];
                    if(window.addsuplemento){
                        response.data['hitos'].forEach(function(x){
                            if(x['inicial']=='1')final.push(x);
                        });
                    }else{
                        final=response.data['hitos'];
                    }
                    storeh.loadData(final);
                    this.getHitoPago().datosLoad = final;
                    storeh.fireEvent('loaddata', storeh);
                    storeh.fireEvent('update', storeh);
                }
                // console.log('esta::', tabhitosadicional)
                if(response.data && tabhitosadicional){
                    console.log('esta::', response.data['hitos'])
                    window.down('#gridhitosadicional').getStore().loadData(response.data['hitos']);
                }

                // if (response.data && this.getGpAreaConPermiso()) {
                //
                //     var store = this.getGpAreaConPermiso().getStore();
                //     var conpermiso = response.data['conPermiso'];
                //
                //     for (var i = 0; i < conpermiso.length; i++) {
                //         store.add({
                //             'idarea': 'new_' + Ext.id(),
                //             'idestructura': conpermiso[i].idestructura,
                //             'area': conpermiso[i].denominacion
                //         });
                //     }
                //
                // }

                if(response.data && gridclientesasociados){
                    var storeCA=gridclientesasociados.getStore();
                    storeCA.loadData(response.data['clientesasociados']);
                    // this.getHitoPago().datosLoad = response.data['hitos'];
                }
                if (response.data && window.down('#gridareasimplicadas')) {
                    var store = window.down('#gridareasimplicadas').getStore();
                    var implicadas = response.data['implicadas'];
                    store.loadData(implicadas);
                    // for (var i = 0; i < implicadas.length; i++) {
                    //     store.add({
                    //         // 'idarea': 'new_' + Ext.id(),
                    //         'idarea': implicadas[i]['idarea'],
                    //         'idestructura': implicadas[i].idestructura,
                    //         'denominacion': implicadas[i].denominacion,
                    //         'ruta': implicadas[i].ruta,
                    //
                    //     });
                    // }
                }

                if(gridPedidos && response.data && response.data['pedidos']){
                    response.data['pedidos'].forEach(function (x) {
                        var productos=Ext.decode(x['productos']),
                            montototal=0, canttotal=0;
                        x['cantprod'] = productos.length;
                        productos.forEach(function(y){
                            montototal+=parseFloat(y['precio'])*y['cantidad'];
                            canttotal+=y['cantidad'];
                        })
                        x['montototal'] = montototal;
                        x['canttotalprod'] = canttotal;
                    });
                    gridPedidos.getStore().loadData(response.data['pedidos']);
                }

                if (anexos && anexos.length != 0 && docForm) {
                    // for(var i in anexos){
                    //     if(anexos[i]['idnodo']==){
                    //
                    //     }
                    // }
                    console.log('whatttt')
                    docForm.loadDocuments(anexos);
                }


            }
        });
    },

    openGestorDocumetal: function () {
        Ext.create('GestionContratoImportacion.view.GestorDocumental.Window').show();
    },

    loadConf: function (grid) {
        var me = this,
            mask = new Ext.LoadMask(this.getMainGridContratacion(), {msg: this.etiquetas.msgLoading});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getConfiguraciones'}, this),
            scope: this,
            callback: function (options, success, response) {
                mask.hide();
                var response = Ext.decode(response.responseText);
                this.application.comite = {
                    transitions: response.transitions
                };
                this.application.gestordocumental = response.contractdoc[0];
                this.application.estructura = response.estructura;
                this.application.planificacion = response.planificacion;
                this.application.contabilidad = response.contabilidad.archivo && response.contabilidad.aperturado == 1 && response.contabilidad.confhabilitado;
                this.application.modulopersona = response.configuracion['activopersona'] == '1';
                this.application.idestadoofertalisto = response.configuracion['idestadoofertalisto'];
                this.application.numero_manual = response.config_file['numero_manual']=='true';
                this.application.show_by_resource = response.config_file['show_by_resource']=='true';
                this.application.mostrar_montototal = response.config_file['mostrar_montototal']=='true';
                this.application.notificarinicial=response.notificarinicial;

                var grid1 = grid.items.items[0],
                    grid2 = grid.items.items[1],
                    cantFiltros = 0;
                if(response.config_file['mostrar_montototal']=='true'){
                    grid2.columns.forEach(function(x){
                        if(x.dataIndex=='montototal') {
                            x.hidden=false;
                            x.hideable=true;
                            x.initialConfig.hidden=false;
                            x.initialConfig.hideable=true;
                            x.setVisible(true);
                        }
                    })
                }
                Ext.Object.each(response.filtros[0], function (key, value) {
                    if (key.indexOf('filtro') != -1 && value) {
                        switch (key) {
                            case 'idvigenciafiltro':
                                if (grid2.filters.getFilter('vigente')) {
                                    grid2.filters.getFilter('vigente').init();
                                    grid2.filters.getFilter('vigente').setActive(true);
                                    grid2.filters.getFilter('vigente').setValue(value);
                                    cantFiltros++;
                                }
                                break;
                            case 'idclientefiltro':
                                if (grid2.filters.getFilter('cliente')) {
                                    grid2.filters.getFilter('cliente').init();
                                    grid2.filters.getFilter('cliente').setActive(true);
                                    grid2.filters.getFilter('cliente').setValue(value);
                                }
                                break;
                            case 'idtipocontratofiltro':
                                if (grid2.filters.getFilter('tipocontrato')) {
                                    grid2.filters.getFilter('tipocontrato').init();
                                    grid2.filters.getFilter('tipocontrato').setActive(true);
                                    grid2.filters.getFilter('tipocontrato').setValue(parseInt(value));
                                    cantFiltros++;
                                }
                                break;
                            case 'idestadofiltro':
                                if (grid2.filters.getFilter('estadoinicial')) {
                                    grid2.filters.getFilter('estadoinicial').init();
                                    grid2.filters.getFilter('estadoinicial').setActive(true);
                                    grid2.filters.getFilter('estadoinicial').setValue(value);
                                    cantFiltros++;
                                }
                                break;
                            case 'nombreareafiltro':
                                if (grid2.filters.getFilter('nombrearea')) {
                                    grid2.filters.getFilter('nombrearea').init();
                                    grid2.filters.getFilter('nombrearea').setActive(true);
                                    grid2.filters.getFilter('nombrearea').setValue(value);
                                    cantFiltros++;
                                }
                                break;

                        }
                    }
                });
                if (cantFiltros == 0) {
                    grid.getStore().load();
                }
                if(response.check && response.check.length>0){
                    mostrarMensaje(8, 'Posibles problemas: <br>-'+response.check.join('<br>-')+'Contacte al administrador.');
                }
            }
        });
    },
    //Valida si está configurada una transicion para el contrato
    //y si esta no se controla en el comite de aprobacion
    checkTransition: function (idestadoinicial, idestadofinal) {
        var exist = false,
            comite = this.application.comite,
            activo = this.application.crm.activeModules.Comite;
        if (activo == "true" && comite && comite.transitions) {
            for (k in comite.transitions) {
                var transition = comite.transitions[k];
                if (transition.idestadoinicial == idestadoinicial && transition.idestadofinal == idestadofinal &&
                    (transition.aliasproceso == 'mdContrato' || transition.aliasproceso == 'mdcontratoproveedor')) {
                    exist = true;
                }
            }
        }

        if (!exist) {
            return true;
        }
        return false;
    },

    createDetail: function (cmp) {
        var me = this;
        // var grid = me.getMainGridContratacion(),
        var grid = cmp.up('grid') || me.getMainGridContratacion(),
            record = grid.getSelectionModel().getSelection()[0];
        Ext.create('GestionContratoImportacion.view.DetailsWindow', {
            suplemento: record.data.idcontrato != record.data.idpadre,
        }).show(record);
    },
    createSignWindow: function (config) {
        var me = this, selected = me.getMainGridContratacion().getSelectionModel().getSelection()[0];
        var win = Ext.create('GestionContratoImportacion.view.SignWindow', {
            config: config
        });
        win.show(null, function () {
            win.unidadTiempo.setValue(selected.get('unidadtiempo'));
            win.vigencia.setValue(selected.get('vigencia'));
            win.fechafirma.fireEvent('change', win.fechafirma)
        });
    },

    createDocumentWindow: function (config) {
        Ext.create('GestionContratoImportacion.view.DocumentWindow', {
            config: config
        }).show();
    },

    showOpinions: function () {
        var grid = this.getMainGridContratacion(),
            store = grid.getStore(),
            record = grid.getSelectionModel().getSelection()[0],
            tipo = 1,
            id = record.data.idcontrato;

        Ext.create('Comite.view.OpinionsWindow', {
            title: this.etiquetas.lbOpinions,
            params: {
                id: id,
                tipo: tipo,
                todos: 1,
                proceso: 'contrato'
            },
            data: record.data
        }).show();
    },

    notify: function (role, contract) {
        if (!role || !Ext.isArray(role) || !contract || (Ext.isArray(role) && role.length == 0)) {
            return;
        }
        var msg = "El contrato " + contract['numero'] + " ha cambiado de estado",
            subject = "Cambio de estado";
        Ext.Ajax.request({
            url: '/crm/application/index.php/notification/notify',
            params: {
                role: Ext.encode(role),
                msg: msg,
                subject: subject,
                entity: contract['idarea']
            },
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                if (!response) {
                    return;
                }
                if (response.code == 1 && response.success) {
                    mostrarMensaje(1, 'Los usuarios que intervienen en los proximos estados del contrato han sido notificados via correo.');
                }
            }
        });
    },

    filterByEntity: function (cmb) {
        var grid = cmb.up('grid'),
            gridnormal = grid.getComponent(1),
            filter = gridnormal.filters.getFilter('idarea'),
            value = cmb.idValue;
        filter.init();
        filter.setValue(value);
        filter.setActive(true);
    },

    clearFilterEntity: function (cmb) {
        var grid = cmb.up('grid'),
            gridnormal = grid.getComponent(1),
            filter = gridnormal.filters.getFilter('idarea');
        filter.setValue([]);
        filter.setActive(false);
        cmb.tree.selModel.deselectAll();
    },

    openWinEliminarBD: function(btn){
        var me=this,
            win=Ext.create('GestionContratoImportacion.view.WindowEliminar');
        win.show(null, function(){

        })
    },

    activardesactivarContrato:function(btn, activar){
        var me = this,
            selection = btn.up('grid').getSelectionModel().getSelection(),
            arrayDel = new Array();
        if (selection.length > 0) {
            me.application.keyMap.disable();
            mostrarMensaje(2, (activar?me.etiquetas.msgActvar:me.etiquetas.msgEliminar) + (selection.length > 1 ? me.etiquetas.msgContratoP : me.etiquetas.msgContratoS), function (response) {
                if (response === 'ok') {
                    for (var i in selection) {
                        arrayDel.push({idcontrato: selection[i].data.idcontrato, nombre: selection[i].data.nombre})
                    }
                    Ext.MessageBox.show({
                        msg: me.etiquetas.lbGuardando,
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200}
                    });
                    Ext.Ajax.request({
                        url: UtilsFn.buildUrl({action: (activar?'activarcontrato':'desactivarcontrato')}, me),
                        params: {
                            arrayDel: arrayDel ? Ext.encode(arrayDel) : arrayDel,
                            // responseCfg: {
                            //     action: 'del',
                            //     gen: 'm',
                            //     concept: selection.length == 1 ? me.etiquetas.lbContract.getSingular().get() : me.etiquetas.lbContract.getPlural().get(),
                            //     count: selection.length
                            // }
                        },
                        success: function (response, opts) {
                            Ext.MessageBox.hide();
                            var response = Ext.decode(response.responseText);

                            if(response.success){
                                mostrarMensaje(1,
                                    (selection.length==1?me.etiquetas.msgEnunContratoS:me.etiquetas.msgEnunContratoP)+
                                    (activar?'activado':'eliminado')+(selection.length==1?'':'s')+' satisfactoriamente.')
                                btn.up('grid').getStore().load();
                                // if(me.getMainGridContratacion())
                                //     me.getMainGridContratacion().getStore().load();
                            }
                            me.application.keyMap.enable();
                        },
                        failure: function (response, opts) {
                            Ext.MessageBox.hide();
                            me.application.keyMap.enable();
                        }
                    });
                }
                me.application.keyMap.enable();
            });
        }
    },
    modificarNumeroContrato: function(btn){
        var me = this,
            selection = btn.up('grid').getSelectionModel().getSelection()[0];
        var win=Ext.create('GestionContratoImportacion.view.WindowModificarNumero',{
            // width: 200,
            // height: 100,
            // minWidth: 200,
        });
        win.show(null, function(){
            win.down('form').on('dirtychange', function(yo, dirty){
                win.down('#acept').setDisabled(!dirty || yo.hasInvalidField());
            })
            win.down('form').on('validitychange', function(yo, valid){
                win.down('#acept').setDisabled(!valid || !yo.isDirty());
            })
            var mask = new Ext.LoadMask(win.el, {msg: me.etiquetas.msgLoading});
            mask.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'cargarElementosNumeroContrato'}, me),
                params: {
                    // cliente: selection.get('cliente'),
                    contratodestino: me.arrayContratoDestino.indexOf(window.context)
                },
                success: function(response){
                    mask.hide();
                    var response = Ext.decode(response.responseText),
                        elementos=response.data,
                        numerojson=Ext.decode(selection.get('numerojson')),
                        valoreselementos=numerojson['numero'],
                        posiciones=[];;
                    // response.data.forEach(function(x){
                    // win.down('#idcontrato').setValue(selection.get('idcontrato'));
                    win.down('form').getForm().loadRecord(selection);

                    for(var i=0; i < elementos.length; i++){
                        if(['3','6','7','8'].indexOf(elementos[i]['tipo'])!=-1){
                            var maxLength=elementos[i]['tipoinfo']['longitud'],
                                cerosIzquierda=elementos[i]['tipoinfo']['incluircerosizquierda'];
                            win.down('#elementos').add({
                                xtype: 'textfield',
                                width: 45,
                                fieldStyle: "text-align:right;",
                                margin: '0 2 0 0',
                                maskRe: /^([\d]+(\d*)?)+$/,
                                regex: /^([\d]+(\d*)?)+$/,
                                regexText: me.etiquetas.msgValidationOnlyNumber,
                                enforceMaxLenght: true,
                                minLength: cerosIzquierda?maxLength:1,
                                // maxLength: maxLength<valoreselementos[i].length?valoreselementos[i].length:maxLength,
                                // minValue: ,
                                name: 'consecutivo-'+elementos[i]['idformatonumcontratoelemento'],
                                value: valoreselementos[i],
                                pos: i,
                                numerojson: numerojson,
                                listeners: {
                                    change: function (yo, value) {
                                        var numjson = Ext.decode(win.down('#numerojson').getValue());
                                        numjson['numero'][yo.pos] = value;
                                        win.down('#numerojson').setValue(Ext.encode(numjson));
                                        // if (cerosIzquierda && parseInt(value)!=0) {
                                        //     if (value.length < maxLength)
                                        //         yo.setValue(Ext.String.leftPad(value, maxLength, '0'));
                                        // }
                                    },
                                    blur: function (yo) {
                                        if (cerosIzquierda && parseInt(yo.getValue())!=0) {
                                            if (yo.getValue().length < maxLength)
                                                yo.setValue(Ext.String.leftPad(yo.getValue(), maxLength, '0'));
                                        }
                                    }
                                }
                                // validator: function(){
                                //     if(elementos[i]['tipoinfo']['incluircerosizquierda']){
                                //         if(value.length<elementos[i]['tipoinfo']['longitud'])
                                //             return Ext.String.leftPad(value, maxLength, '0')
                                //     }
                                // }
                            });
                            posiciones.push(i);
                        }else{
                            win.down('#elementos').add({
                                xtype: 'displayfield',
                                value: valoreselementos[i]
                            });
                        }
                    };
                    if(suplemento!=0){
                        win.down('#elementos').add({
                            xtype: 'displayfield',
                            value: ' / ',
                            margin: '0 5 0 5'
                        });
                        win.down('#elementos').add({
                            xtype: 'numberfield',
                            width: 45,
                            minValue: 1,
                            name: 'suplemento',
                            margin: '0 2 0 0',
                            allowExponential: false,
                            allowDecimal: false,
                            value: suplemento,
                            listeners:{
                                change: function (yo, value) {
                                    var numjson = Ext.decode(win.down('#numerojson').getValue());
                                    numjson['suplemento'] = value;
                                    win.down('#numerojson').setValue(Ext.encode(numjson));
                                },
                            }
                        });
                    }
                    win.down('#posiciones').setValue(posiciones.toString());
                    win.down('#posiciones').resetOriginalValue();
                },
                failure: function(){
                    mask.hide();
                }
            })
        });
    },
    saveModificarNumeroContrato: function(btn){
        var me=this, win=me.getWindowModificarNumero();
        Ext.MessageBox.show({
            msg: me.etiquetas.lbGuardando,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        win.down('form').getForm().submit({
            url: UtilsFn.buildUrl({action: 'modificarNumeroContrato'}, me),
            success: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);
                if(response.success){
                    mostrarMensaje(1, 'El n&uacute;mero del contrato ha sido modificado satisfactoriamente.');
                    win.close();
                    me.getMainGridContratacion().getStore().load();
                }else{
                    // var griderrores=win.down('#errores');
                    // griderrores.setVisible(true);
                    // griderrores.getStore().loadRecords(response.errores);
                    console.log('aqui pues')

                }
            },
            failure: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);
                var messageWindow=Ext.create('Ext.window.Window',{
                    title: 'Confirmaci&oacute;n',
                    layout: 'fit',
                    width: 400,
                    // height: 150,
                    items: Ext.create('Ext.panel.Panel',{
                        bodyStyle: 'background:#DFE9F6;',
                        border:false,
                        padding: 8,
                        html: response.detalles+'<br><b style="text-align:center">¿Est&aacute; seguro que desea continuar?</b>'
                    }),
                    buttonAlign: 'center',
                    buttons:[
                        {
                            text: me.etiquetas.lbBtnCancel,
                            tooltip: me.etiquetas.qtipCancel,
                            iconCls: 'cancelar',
                            listeners: {
                                click: function () {
                                    messageWindow.close();
                                }
                            }
                        },
                        {
                            text: me.etiquetas.lbBtnAccept,
                            tooltip: me.etiquetas.qtipAccept,
                            iconCls: 'aceptar',
                            handler: function(){
                                win.down('#ignoreErrors').setValue('1');
                                messageWindow.close();
                                me.saveModificarNumeroContrato(btn);
                            }
                        }
                    ]
                }).show();
                // var messageWindow=Ext.create('Ext.window.Window',{
                //     layout: 'fit',
                //     width: 400,
                //     height: 200,
                //     items: Ext.create('Ext.grid.Panel',{
                //         // xtype: 'grid',
                //         // title: 'Advertencias',
                //         itemId: 'errores',
                //         anchor: '100%',
                //         height: 90,
                //         // hidden:true,
                //         store: Ext.create('Ext.data.Store',{
                //             fields: ['tipo', 'mensaje', 'detalles'],
                //             data: response.errores
                //         }),
                //         columns:[
                //             {text: 'Mensaje', dataIndex: 'mensaje', flex: 1}
                //         ],
                //         listeners:{
                //             itemdblclick: function(yo, record){
                //                 console.log('record.get(detalles)', record.get('detalles'))
                //                 verDetalles(record.get('detalles'))
                //             }
                //         }
                //     })
                // });
                // messageWindow.show(null, function(){
                //
                // });
            }
        })
    },

    ajusteMonetario: function(btn){
        var me=this, grid = this.getMainGridContratacion(),
            items=[], contable_codigoiso=null, demas=[];
        grid.extrafields.forEach(function(x){
            if(x.tipomoneda=='0'){
                contable_codigoiso=x.codigoiso;
            }else{
                demas.push(x)
            }
        })
        demas.forEach(function(x){
            items.push({
                xtype: 'moneyfield',
                fieldLabel: 'Tasa de cambio '+x['codigoiso']+' a '+contable_codigoiso,
                itemId: x['codigoiso']+'_a_'+contable_codigoiso,
                name: x['codigoiso']+'_a_'+contable_codigoiso,
                labelWidth: 170,
                width: 250,
                minValue: 0,
                margin: 10,
                decimalPrecision: 2,
                allowExponential:false,
                decimalSeparator: ',',
            });
        })
        var win=Ext.create('Ext.window.Window', {
            title: 'Ajuste monetario',
            constrain: true,
            modal:true,
            // padding: 10,
            items: [
                {
                    xtype: 'form',
                    frame:true,
                    items:items,
                }
            ],

            // [
            //     {
            //         xtype: 'numberfield',
            //         fieldLabel:'Tasa de cambio',
            //         // labelAlign: 'top',
            //         labelWidth: 100,
            //         width: 200,
            //         itemId: 'tasa',
            //         minValue: 0,
            //         margin: 10,
            //         decimalPrecision: 2,
            //         allowExponential:false,
            //         // enableKeyEvents: true,
            //         // maskRe: /^([\d].,)+$/,
            //         decimalSeparator: ',',
            //     }
            // ],
            buttons:[
                {
                    text: me.etiquetas.lbBtnCancel,
                    tooltip: me.etiquetas.qtipCancel,
                    iconCls: 'cancelar',
                    listeners: {
                        click: function () {
                            win.close();
                        }
                    }
                },
                {
                    text: me.etiquetas.lbBtnAccept,
                    tooltip: me.etiquetas.qtipAccept,
                    iconCls: 'aceptar',
                    handler: function(){
                        var values=win.down('form').getForm().getValues();
                        Ext.Ajax.request({
                            url: UtilsFn.buildUrl({action: 'realizarAjusteMonetario'}, me),
                            params: values,
                            success: function(response){
                                var response = Ext.decode(response.responseText);
                                if(response.success){
                                    mostrarMensaje(1, 'El ajuste ha sido realizado satisfactoriamente.');
                                    win.close();
                                    btn.up('grid').getStore().load();
                                }else{
                                    mostrarMensaje(6, 'ha ocurrido un error.');
                                }
                            },
                            failure: function(response){
                                mostrarMensaje(6, 'ha ocurrido un error.');
                            }
                        })
                    }
                }
            ]
        });
        win.show();
    },
    limpiarEspacio: function(btn){
        var me=this, grid= btn.up('grid');
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    handler: function () {
                        Ext.MessageBox.show({
                            msg: 'Guardando',
                            wait: true,
                            waitConfig: {interval: 200}
                        });
                        Ext.Ajax.request({
                            url: UtilsFn.buildUrl({action: 'limpiarEspacioTrabajo'}, me),
                            params: {
                                idcontrato:grid.getSelectionModel().getSelection()[0].get('idcontrato')},
                            success: function (response) {
                                Ext.MessageBox.hide();
                                var response = Ext.decode(response.responseText);
                                if (response.success) {
                                    mostrarMensaje(1, 'El ajuste ha sido realizado satisfactoriamente.');
                                    dialog.close();
                                    grid.getStore().load();
                                } else {
                                    mostrarMensaje(6, 'ha ocurrido un error.');
                                }
                            },
                            failure: function (response) {
                                Ext.MessageBox.hide();
                                mostrarMensaje(6, 'ha ocurrido un error.');
                            }
                        })
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
        })
        dialog.show({
            title:'Confirmación',
            msg: '¿Está seguro que desea eliminar el espacio de trabajo del contrato seleccionado?',
            icon: Ext.MessageBox.QUESTION,
        });
    },

    guardarCambioArea: function (button) {
        var me = this, winheredar = button.up('window'),
            // grid = this.getMainGridContratacion(),
            // record = grid.getSelectionModel().getSelection()[0];
            idscontratos = [];
        var recordSelect = winheredar.gridprincipal.getSelectionModel().getSelection();
        for (var i in recordSelect) {
            idscontratos.push(recordSelect[i].data.idcontrato)
        }
        console.log('idscontratos', idscontratos)
        Ext.MessageBox.show({
            msg: me.etiquetas.lbGuardando,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        winheredar.down('#form_heredar').submit({
            url: UtilsFn.buildUrl({action: 'guardarCambioArea'}, ModuleMgr.get('GestionContratoImportacion')),
            params: {
                idestructura: winheredar.down('#tree_estructura').getSelectionModel().getSelection()[0].get('id'),
                idscontratos: Ext.encode(idscontratos)
            },
            success: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);
                if (response['success'] == true) {
                    if (response['code'] == 1) {
                        mostrarMensaje(1, me.etiquetas.msgCambiarArea);
                        if (winheredar.grid) winheredar.grid.getStore().load();
                        if (winheredar.gridprincipal) winheredar.gridprincipal.getStore().load();
                        winheredar.close();
                    }
                    // else if (response['code'] == 2) {
                    //     mostrarMensaje(8, me.etiquetas.msgSinTC);
                    // }
                    else if (response['code'] == 3) {
                        mostrarMensaje(8, me.etiquetas.msgEntidadActual);
                    }
                } else {
                    mostrarMensaje(6, response['msg'])
                }
            },
            failure: function (form, action) {
                Ext.MessageBox.hide();
//                     mostrarMensaje(7, 'Ha ocurrido un error.')
            }
        });
    },
    arreglarEstado: function(btn){
        var me=this, grid= btn.up('grid'), idscontrato=[];
        grid.getSelectionModel().getSelection().forEach(function(x){
            idscontrato.push(x.get('idcontrato'));
        })
        // Ext.MessageBox.show({
        //     msg: 'Guardando',
        //     wait: true,
        //     waitConfig: {interval: 200}
        // });
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'arreglarEstado'}, me),
            params: {
                idcontratos: Ext.encode(idscontrato)
            },
            success: function (response) {
                // Ext.MessageBox.hide();
                var response = Ext.decode(response.responseText);
                if (response.success) {
                    mostrarMensaje(1, 'Se ha insertado el estado satisfactoriamente.');
                    grid.getStore().load();
                } else {
                    // mostrarMensaje(7, (response.msg?response.msg:'Ha ocurrido un error.'));
                }
            },
            failure: function (response) {
                Ext.MessageBox.hide();
                mostrarMensaje(6, 'ha ocurrido un error.');
            }
        })
    },
    renderBuscarArea: function(yo){
        var me=this;
        yo.tip=Ext.create('Ext.tip.ToolTip', {
            target: yo.getEl(),
            html: 'Buscar por área responsable'
        });
        yo.tip.showBy(yo.getEl());
    },
    changeArea: function(yo){
        var me=this;
        yo.tip=Ext.create('Ext.tip.ToolTip', {
            target: yo.getEl(),
            html: 'Buscar por '+(yo.getValue()==='true'?'área responsable':'área creadora')
        });
        yo.tip.showBy(yo.getEl());
    },
    openGestionarDocumentos: function(){
        var me = this,
            win = Ext.create('GestionContratoImportacion.view.WindowGestionarDocumentos'),
            docForm = win.items.first(),
            record = me.getMainGridContratacion().getSelectionModel().getSelection()[0],
            cargandoDatosAdicionales = true;
        console.log('before SHow')
        docForm.on('render', function (yo) {
            if (cargandoDatosAdicionales) {
                docForm.maskL = new Ext.LoadMask(
                    win, {msg: 'Cargando...'});
                docForm.maskL.show();
            }
        });
        win.show(null, function(){
            console.log('SHow window', record.get('idcontrato'))
            win.down('#idcontrato').setValue(record.get('idcontrato'));
            var checkValid = function(yo){
                console.log('checkValid', yo.isDirty(), yo.hasInvalidField())
                win.down('#acept').setDisabled(!(yo.isDirty() && !yo.hasInvalidField()))
            }

            // win.items.first().setTitle(null);
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'getDatosAdicionales'}, me),
                params: {
                    idcontrato: record.data.idcontrato
                },
                scope: this,
                callback: function (options, success, response) {
                    if (docForm.maskL) docForm.maskL.hide();
                    var response = Ext.decode(response.responseText),
                        anexos = response.data['anexos'];
                    if (anexos && anexos.length != 0 && docForm){
                        docForm.loadDocuments(anexos);
                    }
                    docForm.on('validitychange', checkValid)
                    docForm.on('dirtychange', checkValid)
                }
            })
        });
    },
    saveDocumentosContrato: function(){
        var me = this,
            win = me.getWindowGestionarDocumentos(),
            docForm = win.items.first();
        Ext.MessageBox.show({
            msg: 'Guardando documentos...',
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        docForm.submit({
            url: UtilsFn.buildUrl({action: 'guardarDocumentos'}, this),
            params: {
                idcontrato: win.down('#idcontrato').getValue(),
                delfile: Ext.encode(docForm.getRemovedRecords()),
                editfile: Ext.encode(docForm.getModifiedRecords())
            },
            submitEmptyText: false,
            // waitMsg: me.etiquetas.lbGuardando,
            success: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);
                if(response.success){
                    mostrarMensaje(1, 'Los documentos han sido guardados satisfactoriamente.');
                    win.close();
                }else{
                    mostrarMensaje(6, 'Ha ocurrido un error guardando los documentos.sss')
                }
            },failure: function (form, action) {
                Ext.MessageBox.hide();
                mostrarMensaje(6, 'Ha ocurrido un error guardando los documentos. fail')
            }
        })
    }
});