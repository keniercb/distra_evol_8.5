Ext.define('Facturacion.controller.Main', {
    extend: 'CRM.core.controller.Base',

    views: ['Main', 'HitoGrid'],

    refs: [
        {ref: 'mainPanel', selector: 'fac_main'},
        {ref: 'contratoGrid', selector: 'fac_contratogrid'},
        {ref: 'hitoGrid', selector: 'fac_hitogrid'},
        {ref: 'productoGrid', selector: 'fac_productogrid'}
    ],

    init: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            store: {
                '#fac_stContratos': {
                    load: this.afterLoadContratos,
                    beforeload: function () {
                        var grid = me.getContratoGrid();
                        if(grid) {
                            var sm = grid.getSelectionModel();
                            grid.getSelectionModel().clearSelections();
                            grid.fireEvent('selectionchange', sm);
                        }
                    }
                },
                '#fac_stHito': {
                    load: this.afterLoadHitos,
                    beforeload: this.beforeLoadHitos
                }
            },
            component: {
                'fac_main': {
                    afterrender: this.grantActions
                },
                'fac_contratogrid': {
                    selectionchange: this.selectContrato,
                    render: this.onRenderContratoGrid
                },
                'fac_main button[action],fac_main menuitem[action]': {
                    click: this.onClickAction
                },
                'fac_hitogrid': {
                    render: this.onRenderHitoGrid,
                    selectionchange: this.selectHito,
                    itemdblclick: function(){
                        var btn = this.getHitoGrid().btnDetails;
                        btn.fireEvent('click', btn);
                    }
                },
                'window': {
                    show: function () {
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
                'fac_contratogrid checkbox': {
                    change: this.filtrarPorHitosFacturar
                },
                'windetalleshito button[action=contractdetail]':{
                    click: me.obtenerDetallesContrato
                },
                'fpdocumentosadicionales button[action=showfile]':{
                    click: me.showFile
                }
            }
        });
    },

    onClickAction: function (cmp) {
        var me = this;
        console.log('cmp.actions:', cmp.action)
        switch (cmp.action) {
            case 'contractdetail':
                this.createContractDetail(cmp);
                break;
            case 'changestate':
                this.changeState(cmp);
                break;
            case 'hitodetail':
                this.createHitoDetail(cmp);
                break;
            case 'edit':
                this.createWindowEditDate(cmp);
                break;
            case 'traza':
                this.createWindowVertrazas(cmp);
                break;
            case 'generaractaaceptacion':
                this.generarActaAceptacion(cmp);
                break;
            case 'generarinicioproyecto':
                this.generarInicioProyecto(cmp);
                break;
            case 'generariniciosoporteproyecto':
                this.generarInicioSoporteProyecto(cmp);
                break;
            case 'generarordenproduccion':
                this.generarordenproduccion(cmp);
                break;
            case 'modificarServicio':
                this.modificarServicio(cmp);
                break;
            case 'modificararearesponsable':
                this.modificarAreaResponsable(cmp);
                break;
            case 'clearfilters':
                this.clearFilters(cmp);
                break;
            case 'modificarardocumentos':
                this.modificarardocumentos(cmp);
                break;
            case 'limpiarespaciotrabajo':
                this.limpiarespaciotrabajo(cmp);
                break;
        }
    },

    createContractDetail: function (cmp) {
        var gridcont = this.getContratoGrid();
		var me=this,
            grid = cmp.up('gridpanel'),
			
            record = grid.getSelectionModel().getSelection()[0],
            numerocontrato=gridcont.getSelectionModel().getSelection()[0].get('numerocontrato');
        fields=grid.getStore().model.getFields();
        fields.push('numerocontrato');
        grid.getStore().model.setFields(fields);
        record.set('numerocontrato', numerocontrato);
        Ext.create('GestionContrato.view.DetailsWindow').show(record);

    },

    createHitoDetail: function (cmp) {
        var grid = cmp.up('gridpanel'),
            record = grid.getSelectionModel().getSelection()[0],
            modulos=this.application.crm.activeModules;
        Ext.create('Facturacion.view.DetailsWindow'
            ,{idcontrato:record.data.idcontrato, showDesgloses: modulos['DesgloseContrato']=='true'}
        ).show(record);
    },

    selectContrato: function (sm) {
        var grid = this.getContratoGrid(),
            total = sm.getCount();
        grid.btnDetails.setDisabled(total != 1);
        grid.btnGenerar.setDisabled(total == 0);
        grid.btnModificarServicio.setDisabled(total != 1);
        this.loadData();
    },

    selectHito: function (sm, records) {
       // console.log('queee')
        var grid = this.getHitoGrid(),
            total = sm.getCount(),
            gridcontrato = this.getContratoGrid(),
            totalcontrato = gridcontrato.getSelectionModel().getCount();
            //record = grid.getSelectionModel().getSelection()[0];
        grid.btnDetails.setDisabled(total != 1);
        grid.btnGenerar.setDisabled(total == 0 || totalcontrato == 0);
       // var inicial=true;
       // if(total>0){
          //  inicial=grid.getSelectionModel().getSelection().some(function(x){
            //    return x.get('inicial')==1;
          //  })
       // }
        // console.log('inicial', inicial)
        grid.btnEdit.setDisabled(total == 0);
        // grid.btnEdit.setDisabled(total != 1 || record.data.inicial != 1);
        grid.btnVerTrazas.setDisabled(total != 1);
        grid.btnAreaResponsable.setDisabled(total == 0);
        grid.btnModificarDocumentos.setDisabled(total != 1);
        grid.btnLimpiarEspacioTrabajo.setDisabled(total != 1);
        this.createMenu();

    },

    loadData: function () {
        var sm = this.getContratoGrid().getSelectionModel(),
            records = sm.getSelection(),
            idcontratos = [];

        Ext.each(records, function (record) {
            idcontratos.push(record.data.idcontrato);
        });
        this.loadDataHito(idcontratos);
    },

    loadDataHito: function (idcontratos) {
        var gridcontrato=this.getContratoGrid(),
            grid = this.getHitoGrid(),
            paging = grid.down('pagingtoolbar'),
            store = grid.getStore();
        if (idcontratos.length == 0) {
            store.proxy.extraParams.idcontratos = null;
            store.removeAll();
        } else {
            store.proxy.extraParams.idcontratos = Ext.encode(idcontratos);
            with(store.proxy){
                extraParams['filter[50][field]']='fechafin';
                extraParams['filter[50][data][type]']='date';
                extraParams['filter[50][data][comparison]']='gt';
                extraParams['filter[50][data][value]']=gridcontrato.down('#fechainicio').getValue();
                extraParams['filter[51][field]']='fechafin';
                extraParams['filter[51][data][type]']='date';
                extraParams['filter[51][data][comparison]']='lt';
                extraParams['filter[51][data][value]']=gridcontrato.down('#fechafin').getValue();
            }
            paging.moveFirst();
        }
    },

    beforeLoadHitos: function (store) {
        var grid = this.getHitoGrid(),
            sm = grid.getSelectionModel();
        grid.getSelectionModel().clearSelections();
        grid.fireEvent('selectionchange', sm);
        /*if (!store.proxy.extraParams.idcontratos) {
            grid.el.unmask();
            return false;
        }*/
    },

    afterLoadContratos: function () {
        var grid = this.getContratoGrid();
        if (!grid.extrafields) {
            this.addExtraColumns(grid);
        }
        if (grid.filters.filters.keys.length == 0) {
            grid.filters.createFilters();
        }
    },

    addExtraColumns: function (grid) {
        var store = grid.getStore(),
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
            }
            newcolumns.push(column.initialConfig);
        });

        if (pos != -1) {
            newcolumns = this.insertColumnsCoins(newcolumns, extrafields, pos);
            var width = grid.getWidth() + (extrafields.length * 80);
            grid.reconfigure(null, newcolumns);
            //grid.setWidth(width);
        }
    },

    insertColumnsCoins: function (newcolumns, extrafields, pos) {
        Ext.each(extrafields, function (field) {
            newcolumns.splice(pos, 0, {
                dataIndex: 'montomoneda_' + field.codigoiso.toLowerCase()+'_'+field.idmoneda,
                text: field.codigoiso.toUpperCase(),
                tooltip: field.codigoiso.toUpperCase(),
                width: 80,
                minWidth: 60,
                align: 'right',
                groupable: false,
                // hidden: true,
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
    },

    afterLoadHitos: function (store, records, success) {
        var grid = this.getHitoGrid();
        if (!grid.extrafields) {
            this.addExtraColumns(grid);
        }
        if (grid.filters.filters.keys.length == 0) {
            grid.filters.createFilters();
        }
        if(success){
            records.forEach(function(x){
                x.get('pago').forEach(function(y){
                    x.set('montomoneda_'+y['moneda'].toLowerCase()+'_'+y['idmoneda'], parseFloat(y['monto']))
                });
            })
        }
    },

    createMenu: function () {
        var grid = this.getHitoGrid(),
            menu = grid.btnChangeState.menu,
            estados = this.getNextStates(),
            total = grid.getSelectionModel().getCount();

        menu.removeAll();
        Ext.each(estados, function (estado) {
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
        }, this);

        grid.btnChangeState.setDisabled(menu.items.length == 0);
    },

    getNextStates: function () {
        var grid = this.getHitoGrid(),
            store = grid.getStore(),
            records = grid.getSelectionModel().getSelection(),
            idestado = null,
            idcontrato = null,
            estados = [];

        Ext.each(records, function (record) {
            if (!idestado) {
                idestado = record.data.idestado;
            }
            if (!idcontrato) {
                idcontrato = record.data.idcontrato;
            }
            if (record.data.idestado != idestado || record.data.idcontrato != idcontrato) {
                idestado = null;
                return false;
            }
        });

        if (!records || !idestado) {
            return;
        }

        var datos = store.proxy.reader.jsonData.estados,
            transiciones = datos[idestado] ? datos[idestado]['transiciones'] : [];
        Ext.each(transiciones, function (transicion) {
            var aux=datos[transicion['idestado']];
            aux['notificar'] = transicion['notificar'];
            aux['idtransicion']=transicion['idtransicion'];
            estados.push(aux);
        });
        return estados;
    },

    changeState: function (cmp) {
        var me = this,
            actions = cmp.actions;
        mostrarMensaje(2, me.etiquetas.msgCambiarEstado, function (response) {
            if (response === 'ok') {
                if (actions.indexOf('document') != -1) {
                    me.createWindowDocument(cmp);
                } else {
                    me.saveState(cmp);
                }
            }
        });
    },

    saveState: function (cmp) {
        console.log('saveState', cmp)
        var me = this,
            grid = this.getHitoGrid(),
            idhitos = this.getHitosSeleccionados();

        Ext.MessageBox.show({
            msg: me.etiquetas.lbGuardando,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'cambiarEstado'}, me),
            params: {
                idestado: cmp.idestado,
                idhitos: Ext.encode(idhitos),
                idtransicion: cmp.idtransicion,
                responseCfg: {
                    action: 'edit',
                    gen: 'm',
                    concept: me.etiquetas.lbEstado,
                    count: 1
                }
            },
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var info = Ext.decode(response.responseText);
                if (success) {
                    mostrarMensaje(1, info.datos.nuevoestado?'La obligación financiera ha cambiado de estado satisfactoriamente.':
                        'Usted ha hecho su voto al cambio de estado. <br>Se han realizado '+
                        info.datos.obligatoriosefectuados+' de '+info.datos.cantidadrolesobligatorios+' votos obligatorios.');
                    if(info.datos.nuevoestado){
                        grid.getStore().load();

                        if (cmp.notificar == 1) {
                            me.enviarCorreo({
                                idhitos: Ext.encode(idhitos),
                                idestado: cmp.idestado,
                                idtransicion: cmp.idtransicion,
                                modelName: 'GestionfacturasModel'
                            });
                        }
                    }
                }
            }
        });
    },

    createWindowDocument: function (cmp) {
        Ext.create('Facturacion.view.DocumentWindow', {
            cmp: cmp
        }).show();
    },

    createWindowEditDate: function (cmp) {
        var grid = cmp.up('gridpanel'),
            records = grid.getSelectionModel().getSelection();
        var win=Ext.create('Facturacion.view.DateWindow', {
            // record: record
        })
        win.show(null, function(){
            if(records.length==1){
                win.fechaestimada.setValue(records[0].data.fechafin);
            }
            var idhitos=[];
            records.forEach(function(x){
                idhitos.push(x.get('idhito'));
            });
            win.idhito.setValue(idhitos.toString())
        });
    },

    grantActions: function (grid) {
        this.validateGrantedActions({container: grid});
    },

    onRenderContratoGrid: function (grid) {
        this.createKeyMap(grid);
        this.loadData();
    },

    onRenderHitoGrid: function (grid) {
        this.createKeyMap(grid);
    },

    createKeyMap: function (grid) {
        grid.module = 'Facturacion';
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);
    },

    clearFilters: function (btn) {
        btn.up('grid').filters.clearFilters();
        btn.up('grid').cbListofacturar.setValue(false);
    },

    createWindowVertrazas: function (cmp) {
        var grid = cmp.up('gridpanel'),
            record = grid.getSelectionModel().getSelection()[0];
        var win = Ext.create('Facturacion.view.VerTrazas', {
            title: this.etiquetas.lbTrazasHito,
            // record: record
        }).show();
        var store = win.items.first().getStore();
        // store.load();
        store.load({params: {idhito: record.get('idhito')}});
    },


    generarActaAceptacion: function (cmp) {
        var me = this,
            data = me.getHitoGrid().getSelectionModel().getSelection(),
            idcontrato = data[0].get('idcontrato'),
            // idplantilla = data.idplantilla;
            idhitos = '';
        Ext.each(data, function (x) {
            idhitos += x.get('idhito') + ',';
        });
        idhitos = idhitos.substring(0, idhitos.length - 1)

         var config = {
            typeRequest: 'auto',
            typeFormat: 'PDF',
            content: 'application/pdf',
            paginated: false,
            isAttachment: false,
            // reports: [{
            name: 'crmDictamenesCartaVertical',
            description: 'Contrato',
            isList: true,
            params: {
                idcontrato : idcontrato
            },
            dirReport: '/reports/crm/crmActaAceptacionCartaVertical',
            // dirReport: '/reports/crm/crmActaAceptacion',
            // dirReport: '/distra/crm/oferta_de_negocio/crmOfertaComercial',
            uiSearch: {}
            // }]
        };
        Ext.create('Ext.ux.JasperReport', config);
    },
    generarInicioProyecto: function (cmp) {
        var me = this,
            data = me.getContratoGrid().getSelectionModel().getSelection(),
            idcontrato = data[0].get('idcontrato').toString();
        // idplantilla = data.idplantilla;

         var config = {
            typeRequest: 'auto',
            typeFormat: 'PDF',
            content: 'application/pdf',
            paginated: false,
            isAttachment: false,
            // reports: [{
            name: 'crmDictamenesCartaVertical',
            description: 'Contrato',
            isList: true,
            params: {
                idcontrato : idcontrato
            },
            dirReport: '/reports/crm/crmInicioProyecto',
            // dirReport: '/reports/crm/crmActaAceptacion',
            // dirReport: '/distra/crm/oferta_de_negocio/crmOfertaComercial',
            uiSearch: {}
            // }]
        };
        Ext.create('Ext.ux.JasperReport', config);
    },

    generarInicioSoporteProyecto: function (cmp) {
        var me = this,
            data = me.getContratoGrid().getSelectionModel().getSelection(),
            idcontrato = data[0].get('idcontrato').toString();
        // idplantilla = data.idplantilla;

         var config = {
            typeRequest: 'auto',
            typeFormat: 'PDF',
            content: 'application/pdf',
            paginated: false,
            isAttachment: false,
            // reports: [{
            name: 'crmDictamenesCartaVertical',
            description: 'Contrato',
            isList: true,
            params: {
                idcontrato : idcontrato
            },
            dirReport: '/reports/crm/crmInicioSoporteTecnicoCartaVertical',
            // dirReport: '/reports/crm/crmActaAceptacion',
            // dirReport: '/distra/crm/oferta_de_negocio/crmOfertaComercial',
            uiSearch: {}
            // }]
        };
        Ext.create('Ext.ux.JasperReport', config);
    },

    generarordenproduccion: function (cmp) {
        var me = this,
            data = me.getContratoGrid().getSelectionModel().getSelection(),
            idcontrato = data[0].get('idcontrato').toString();
        // idplantilla = data.idplantilla;
        var config = {
            typeRequest: 'auto',
            typeFormat: 'PDF',
            content: 'application/pdf',
            paginated: false,
            isAttachment: false,
            // reports: [{
            name: 'crmDictamenesCartaVertical',
            description: 'Contrato',
            isList: true,
            params: {
                idcontrato : idcontrato
            },
            dirReport: '/reports/crm/crmordenProduccion',
            // dirReport: '/reports/crm/crmActaAceptacion',
            // dirReport: '/distra/crm/oferta_de_negocio/crmOfertaComercial',
            uiSearch: {}
            // }]
        };
        Ext.create('Ext.ux.JasperReport', config);
    },


    getHitosSeleccionados: function () {
        var grid = this.getHitoGrid(),
            records = grid.getSelectionModel().getSelection(),
            idhitos = [];
        Ext.each(records, function (record) {
            idhitos.push(record.data.idhito);
        });
        return idhitos;
    },

    filtrarPorHitosFacturar: function (field, value) {
        var store = this.getContratoGrid().getStore();
        store.proxy.extraParams.listofactura = value ? true : null;
        store.load();
    },

    modificarServicio: function(){
        var me=this;
        var win=Ext.create('Ext.window.Window',{
            title: me.etiquetas.lbListaHitos,
            modal:true,
            constrain: true,
            width: 1000,
            height:500,
            layout:'fit',
            items:[
                Ext.create('GestionContrato.view.FormaPago.Hito.GridHitoPago',{
                    sinAcciones: true,
                    selType: 'checkboxmodel',
                    dockedItems:[
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    text: me.etiquetas.lbModificarServicios,
                                    tooltip: me.etiquetas.lbModificarServicios,
                                    itemId:'modificarservicioshitos',
                                    iconCls: 'icondistra-modificar',
                                    disabled:true,
                                    handler: function (yo) {
                                        var seleccionado=yo.up('grid').getSelectionModel().getSelection();
                                        var winprod = Ext.create('Ext.ux.CustomWindow', {
                                            title:'Modificar servicios',
//                                             modal:true,
                                            layout: 'fit',
                                            height: 400,
                                            width: 1000,
                                            items: Ext.create('GestionContrato.view.FormaPago.Producto.GridProducto',{
                                                sinAcciones: true,
                                                // editGrid: false,
                                                context: 'cliente',
                                                features:[
                                                    {
                                                        ftype: 'grouping',
                                                        groupByText: 'Agrupar por esta columna',
                                                        enableNoGroups: false,
                                                        enableGroupingMenu: false,
                                                        groupHeaderTpl: ['Hito: {name}']
                                                    }
                                                ],
                                                dockedItems:[
                                                    {
                                                        xtype: 'toolbar',
                                                        dock: 'top',
                                                        itemId: 'toolbar_top',
                                                        hidden:true,
                                                        items:[
                                                            {
                                                                xtype: 'combo',
                                                                fieldLabel: 'Sustituir todos con:',
                                                                labelWidth: 110,
                                                                width: 450,
                                                                displayField: 'denominacion',
                                                                valueField: 'denominacion',
                                                                pageSize: 20,
                                                                mode: 'remote',
                                                                queryParam: 'denominacion',
                                                                store: Ext.create('GestionContrato.store.Producto', {
                                                                    pageSize: 20,
                                                                    // storeId: 'stProductoTTT',
                                                                    filters: [{property: 'tipo', value: 2}]
                                                                }),
                                                                listeners: {
                                                                    select: function (yo, records) {
                                                                        winprod.down('grid').getStore().getRange().forEach(function(x){
                                                                            x.set('denominacion', yo.getValue());
                                                                            x.raw.idindicador=records[0].get('idindicador');
                                                                        })
                                                                        winprod.btnAceptar.setDisabled(false);
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ],
                                                listeners:{
                                                    render:function(grid){
                                                        var fields=grid.getStore().model.getFields();
                                                        fields.push('nombrehito');
                                                        grid.getStore().model.setFields(fields);
                                                        grid.getStore().groupField='nombrehito';
                                                        var columnas=grid.columns;
                                                        columnas[1].editor={
                                                            xtype: 'combo',
                                                            displayField:'denominacion',
                                                            valueField: 'denominacion',
                                                            pageSize: 20,
                                                            mode: 'remote',
                                                            queryParam: 'denominacion',
                                                            allowBlank:false,
                                                            closeAction: 'destroy',
                                                            store: Ext.create('Ext.data.Store', {
                                                                model: 'GestionContrato.model.Producto',
                                                                remoteSort: true,
                                                                pageSize: 20,
                                                                proxy: {
                                                                    type: 'ajax',
                                                                    url: UtilsFn.buildUrl({action: 'getProducto'}, ModuleMgr.get('GestionContrato')),
                                                                    actionMethods: {
                                                                        read: 'POST'
                                                                    },
                                                                    extraParams: {
                                                                        idtipoprecio: -1, tipo: 2
                                                                    },
                                                                    reader: {
                                                                        root: 'data',
                                                                        totalProperty: 'total',
                                                                        successProperty: 'success'
                                                                    }
                                                                }
                                                            }),
                                                            listeners:{
                                                                select: function(yo, records){
                                                                    winprod.btnAceptar.setDisabled(false);
                                                                    grid.getSelectionModel().getLastSelected().raw.idindicador=records[0].get('idindicador');
                                                                }
                                                            }
                                                        };
                                                        columnas[2].editor=null;
                                                        columnas[4].editor=null;
                                                        columnas[5].editor=null;
                                                        columnas.unshift({text: 'Hito', dataIndex: 'nombrehito',
                                                        renderer: function(value, meta){
                                                            meta.tdAttr = 'data-qtip="' + value + '"';
                                                            return value;
                                                        }});
                                                        grid.reconfigure(grid.getStore(), columnas);
                                                        grid.getView().refresh();

                                                    }
                                                }
                                            }),

                                        });
                                        winprod.show(null, function(){
                                            var final=[];
                                            if(seleccionado.length>1)winprod.down('#toolbar_top').setVisible(true);
                                            console.log('seleccionado:', seleccionado)
                                            seleccionado.forEach(function(x){
                                                datos=x.data.indicadores.slice();
                                                datos.forEach(function(y){
                                                    y['nombrehito']='#'+x.data.numero+' - '+x.data.descripcion;
                                                })
                                                final=final.concat(datos);
                                            });
                                            console.log('ind:', final)
                                            winprod.down('grid').getStore().loadData(final);
                                                // seleccionado.data.indicadores
                                            // );
                                            console.log('sto:', winprod.down('grid').getStore().getRange())
                                            winprod.btnAceptar.setHandler(function(){
                                                var indicadores=[], todo=[];
                                                winprod.down('grid').getStore().getRange().forEach(function(x){
                                                    todo.push(x.data);
                                                    indicadores.push({'indicadores': x.get('idindicadorcontrato'), 'denominacion': x.get('denominacion'), 'idindicador': x.raw.idindicador})
                                                });
                                                Ext.MessageBox.show({
                                                    msg: me.etiquetas.lbGuardandoDatos,
                                                    width: 300,
                                                    wait: true,
                                                    waitConfig: {interval: 200}
                                                });
                                                Ext.Ajax.request({
                                                    url: UtilsFn.buildUrl({action: 'modificarServicios'}, me),
                                                    params: {
                                                        indicadores: Ext.encode(indicadores)
                                                    },
                                                    callback: function (options, success, response) {
                                                        Ext.MessageBox.hide();
                                                        // win.down('grid').getStore().loadData();
                                                        seleccion=me.getContratoGrid().getSelectionModel().getSelection()[0];
                                                        win.down('grid').getSelectionModel().deselectAll();
                                                        win.down('grid').getStore().removeAll();
                                                        me.loadHitos(win, seleccion.get('idcontrato'));
                                                        // seleccionado.set('indicadores', todo);
                                                        mostrarMensaje(1,me.etiquetas.msgServiciosModificados);
                                                        winprod.close();
                                                    }
                                                });
                                            });
                                        });
                                    }
                                }
                            ]
                        }
                    ]
                })
            ],
            buttons:[
                {
                    text: me.etiquetas.lbCerrar,
                    tooltip: me.etiquetas.lbCerrar,
                    iconCls: 'cerrar',
                    handler: function(){
                        win.close();
                    }
                }
            ],
            listeners:{
                render:function(yo){
                    var grid=yo.down('grid'),
                        seleccion=me.getContratoGrid().getSelectionModel().getSelection()[0];
                    grid.getSelectionModel().on('selectionchange', function(sm, records){
                        grid.down('#modificarservicioshitos').setDisabled(records.length==0);
                    })
                    me.loadHitos(yo, seleccion.get('idcontrato'));
                }
            }
        });
        win.show();
    },
    loadHitos: function(yo, idcontrato){
        var me=this, grid=yo.down('grid');
        var mask = new Ext.LoadMask(yo, {msg: me.etiquetas.msgLoading});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getDatosAdicionales'}, ModuleMgr.get('GestionContrato')),
            params: {
                idcontrato: idcontrato
            },
            scope: this,
            callback: function (options, success, response) {
                mask.hide();
                var response = Ext.decode(response.responseText);
                if (response.data){
                    var storeh = grid.store;
                    storeh.loadData(response.data['hitos']);
                    grid.datosLoad = response.data['hitos'];
                    storeh.fireEvent('loaddata', storeh);
                    storeh.fireEvent('update', storeh);
                }
            }
        });
    },
    obtenerDetallesContrato:function (button){
        var me=this, win=button.up('window');

        if(win.idcontrato){
            var mask = new Ext.LoadMask(button,
                {msg: this.etiquetas.lbCargando});
            mask.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'obtenerDatosContrato'}, ModuleMgr.get('ReporteContratacion')),
                params:{idcontrato:win.idcontrato},
                success: function (response) {
                    mask.hide();
                    var datos=Ext.decode(response.responseText);
                    record={
                        data:datos,
                        getData:function(){return datos},
                        get:function(field){return datos[field];}
                    };
                    Ext.create('GestionContrato.view.DetailsWindow').show(record);
                },
                failure:function(response){
                    mask.hide();
                    mostrarMensaje(7, 'No han podido cargarse los datos.')
                }
            });

        }
    },
    modificarAreaResponsable: function(){
        var me=this,
            hitogrid=me.getHitoGrid(),
            selected=hitogrid.getSelectionModel().getSelection(),
            idhitos=[],
            win=Ext.create('Facturacion.view.AreaWindow');
        selected.forEach(function(x){
            idhitos.push(x.get('idhito'));
        })
        win.show(null, function(){
            win.idhito.setValue(idhitos.toString());
            if(selected.length==1){
                win.idarea.setValue(selected[0].get('idarea'));
                win.cmbarea.setValue(selected[0].get('nombrearea'));
            }
        })
    },

    modificarardocumentos: function(cmp){
        var me=this,
            hitogrid=me.getHitoGrid(),
            selected=hitogrid.getSelectionModel().getSelection();
        console.log('que pasa', selected)
        var win=Ext.create('Ext.ux.CustomWindow',{
            title: 'Documentos',
            resizable:false,
            width: 500,
            minWidth: 500,
            height: null,
            minHeight: null,
            items:[
                Ext.create('Ext.ux.CustomForm',{
                    layout: 'fit',
                    bodyStyle: 'background:#DFE9F6',
                    items: [
                        {xtype: 'textfield', hidden: true, name: 'idhito'},
                        {xtype: 'textfield', hidden: true, name: 'idcontrato'},
                        Ext.create('GestionContrato.view.DocumentosAdicionales',{
                            itemId: 'documentos'
                        })
                    ]
                })

            ]
        })
        win.show(null, function(){
            var form=win.down('form');
            form.getForm().findField('idhito').setValue(selected[0].get('idhito'));
            form.getForm().findField('idcontrato').setValue(selected[0].get('idcontrato'));
            // win.down('#documentos').setTitle(false);
            // win.down('#documentos').title=false;
            form.on('validitychange', function(yo, valid){
                console.log('validitychange', valid)
                win.btnAceptar.setDisabled(!valid);
            })
            form.on('dirtychange', function(yo, dirty){
                console.log('dirtychange', dirty)
                win.btnAceptar.setDisabled(!dirty);
            })
            win.btnAceptar.setHandler(function(){
                var params=win.down('form').getForm().getValues();
                Ext.merge(params,{
                    delfile: Ext.encode(win.down('#documentos').getRemovedRecords()),
                    editfile: Ext.encode(win.down('#documentos').getModifiedRecords())
                })
                form.getForm().submit({
                    url: UtilsFn.buildUrl({action: 'guardarDocumentosHitos'}, me),
                    params: params,
                    submitEmptyText: false,
                    waitMsg: me.etiquetas.lbGuardandoDatos,
                    success: function (form, action) {
                        var response = Ext.decode(action.response.responseText);
                        win.close();
                    }
                })
            });
            // anexos=[{url: 'offf', nombre: 'ejemplo',idnodo: 'ads'}];
            // win.down('#documentos').loadDocuments(anexos);
            var mask = new Ext.LoadMask(win.down('#documentos'), {msg: me.etiquetas.msgLoading});
            mask.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'obtenerDocumentos'}, me),
                params: {
                    idhito: selected[0].get('idhito')
                },
                callback: function (options, success, response) {
                    mask.hide();
                    var response = Ext.decode(response.responseText);
                    win.down('#documentos').loadDocuments(response);
                }
            });
        });
    },
    showFile: function(btn){
        var me=this,
            idfile = btn.up('panel[rowDocument=true]').down('fileuploadfield').idfile,
            urlfile = btn.up('panel[rowDocument=true]').down('fileuploadfield').urlfile,
            nombre = btn.up('panel[rowDocument=true]').down('fileuploadfield').nombre;
        console.log('showfileeeee')
        if (urlfile) {
            // window.open(urlfile);
			 window.open('/crm/contratacion/index.php/gestioncontrato/getDocumentos?idnodo='+idfile);
            // window.open('/crm/contratacion/index.php/gestioncontrato/getDocumento?idnodo='+idfile);
            // window.open('/crm/contratacion/index.php/gestioncontrato/getArchivo?idnodo=' + idfile);
        } else {
            mostrarMensaje(1, this.etiquetas.msgErrorNoFile);
        }
        console.log('showFile')
    },
    limpiarespaciotrabajo:function(btn) {
        var me=this,
            hitogrid=me.getHitoGrid(),
            selected=hitogrid.getSelectionModel().getSelection();
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
                                idhito: selected[0].get('idhito')},
                            success: function (response) {
                                Ext.MessageBox.hide();
                                var response = Ext.decode(response.responseText);
                                if (response.success) {
                                    mostrarMensaje(1, 'El ajuste ha sido realizado satisfactoriamente.');
                                    dialog.close();
                                    hitogrid.getStore().load();
                                } else {
                                    mostrarMensaje(7, 'ha ocurrido un error.');
                                }
                            },
                            failure: function (response) {
                                Ext.MessageBox.hide();
                                mostrarMensaje(7, 'Ha ocurrido un error.');
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
            msg: '¿Está seguro que desea eliminar el espacio de trabajo del hito seleccionado?',
            icon: Ext.MessageBox.QUESTION,
        });
    }

});
