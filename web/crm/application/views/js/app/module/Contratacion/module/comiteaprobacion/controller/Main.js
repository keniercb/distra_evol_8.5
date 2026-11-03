Ext.define('Comite.controller.Main', {
    extend: 'CRM.core.controller.Base',
    views: ['Main'],

    refs: [
        {ref: 'mainGrid', selector: 'co_comitemaingrid'},
        {ref: 'mainPanel', selector: 'co_comitemain'},
        {ref: 'ofertaGrid', selector: 'co_comiteoofertagrid'},
        {ref: 'rolWindow', selector: 'rolopinionwindow'},
        {ref: 'solicitudGrid', selector: 'co_comiteosolicitudgrid'},
    ],

    init: function () {
        var me = this;
        this.etiquetas = LangMgr.getLang(this);
        this.idusuario = window.perfil.idusuario;

        this.listen({
            store: {
                '#stComiteContrato': {
                    metachange: this.setColumns
                },
                '#stComiteOffer': {
                    metachange: this.setColumns
                },
                '#stComiteSolicitudNegocio': {
                    metachange: this.setColumns
                },
                '#stComiteSolicitudPago': {
                    metachange: this.setColumns
                }
            },
            component: {
                'co_comitemain': {
                    afterrender: function () {
                        this.grantActions();
                    }
                },
                'co_comitemaingrid,co_comiteoofertagrid,co_comiteosolicitudgrid,co_comitesolicitudpagogrid': {
                    render: this.renderGrid,
                    selectionchange: this.buttonEnable,
                    activate: this.activateGrid,
                    deactivate: this.activateGrid,
                    itemdblclick: function () {
                        var btn = this.getMainPanel().btnDetails;
                        btn.fireEvent('click', btn);
                    }

                },
                'co_comitemaingrid searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                'co_comitemain button[action],co_comitemain menuitem[action]': {
                    click: this.onclickAction
                },
                'rolopinionwindow': {
                    destroy: this.onCloseWindow
                },
                'co_comitemain combobox[itemId=comboprocesos]': {
                    change: this.getProcesos
                },
                'co_comitemain pickerfield[name=filtroarea]': {
                    onclick2: this.clearFilterEntity,
                    onclick3: function(cmb){this.filterByEntity(cmb);this.filterByEntity(cmb);}
                }
            }
        });
    },

    renderGrid: function (grid) {
        if (grid.filters) {
            grid.filters.createFilters();
        }
        grid.module = 'Comite';
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);
    },

    onclickAction: function (btn) {

        switch (btn.action) {
            case 'details':
                this.showDetails(btn);
                break;
            case 'opinions':
                this.showOpinions(btn);
                break;
            case 'changestate':
                this.changeState(btn);
                break;
            case 'historial':
                this.mostrarHistorial(btn);
                break;
        }
    },

    onSearch: function (field, data) {
        var me = this,
            grid = me.getMainGrid(),
            filter = new Array();
        filter.push({
            field: 'nombre',
            data: {value: field.getValue(), type: 'string'}
        });
        grid.getStore().proxy.extraParams = {
            'filter2': Ext.encode(filter)
        };
        grid.getStore().load();
    },

    onClear: function (field) {
        if (this.getMainGrid().getStore().proxy.extraParams.filter2) {
            this.getMainGrid().getStore().proxy.extraParams = {};
            this.getMainGrid().getStore().load();
        }
    },

    onCloseWindow: function () {
        var grid = this.getActiveGrid();
        grid.getStore().load();
    },

    activateGrid: function (grid) {
        var sm = grid.getSelectionModel(),
            records = sm.getSelection();
        grid.fireEvent('selectionchange', sm, records);
    },

    grantActions: function (cmp, eOpts) {
        this.validateGrantedActions({container: this.getMainPanel()});
    },

    buttonEnable: function (sm, records) {
        var me = this,
            panel = me.getMainPanel(),
            len = records.length,
            menu = panel.btnChangeState.menu;

        if (len == 1) {
            panel.btnOpinion.enable();
            panel.btnDetails.enable();
            this.createMenu(records);
        } else if (len != 1) {
            panel.btnDetails.disable();
            panel.btnOpinion.disable();
            menu.removeAll();
            panel.btnChangeState.disable();
        }
    },

    setColumns: function (store, meta) {
        var columns = new Array(),
            grid = this.getGridByStore(store);
        if (!grid) {
            return;
        }
        Ext.each(meta.columns, function (column) {
            if (column.renderer) {
                column.renderer = typeof grid[column.renderer] == 'function' ? grid[column.renderer] : Ext.EmptyFn
            }
            if (column.header) {
                var header = column.header;
                column.header = this.etiquetas['lb' + header] || header;
                if (!column.tooltip) {
                    column.tooltip = this.etiquetas['tp' + header] || column.header;
                }
            }
            columns.push(column)
        }, this);
        grid.reconfigure(null, columns);
    },

    getGridByStore: function (store) {
        var proceso = store.proxy.extraParams.aliasproceso,
            grid = this.getMainPanel().down('gridpanel[proceso=' + proceso + ']');
        return grid;
    },

    changeState: function (btn) {
        var grid = this.getActiveGrid(),
            store = grid.getStore(),
            record = grid.getSelectionModel().getSelection()[0],
            me = this,
            tipo = 1,
            id = record.data.idcontrato;

        switch (grid.proceso) {
            case "ofertanegocio":
                tipo = 2;
                id = record.data.idoferta;
                break;
            case "ofertanegocioproveedor":
                tipo = 2;
                id = record.data.idoferta;
                break;
            case "solicitudnegocio":
                tipo = 3;
                id = record.data.idsolicitud;
                break;
            case "solicitudnegocioproveedor":
                tipo = 3;
                id = record.data.idsolicitud;
                break;
            case "solicitudnegocioimportacion":
                tipo = 3;
                id = record.data.idsolicitud;
                break;
            case "solicitudpago":
                tipo = 4;
                id = record.data.idsolicitudpago;
                break;
        }

        Ext.create('Comite.view.RolOpinionWindow', {
            title: me.etiquetas.titleaddDictamen + ' : ' + btn.text,
            params: {
                idestado: btn.idestado,
                id: id,
                tipo: tipo,
                idusuario: this.idusuario,
                aliasproceso: grid.proceso
            }
        }).show();
    },

    createMenu: function (records) {
        var panel = this.getMainPanel(),
            menu = panel.btnChangeState.menu,
            estados = this.getNextStates();

        menu.removeAll();
        Ext.each(estados, function (estado) {
            menu.add({
                text: estado.nombre,
                iconCls: estado.icono,
                tooltip: this.etiquetas.lbChangeState,
                idestadoanterior: records[0].data.idestado,
                idestado: estado.idestado,
                idcontrato: records[0].data.idcontrato,
                action: 'changestate'
            });
        }, this);

        if (menu.items.length > 0) {
            panel.btnChangeState.enable();
        } else {
            panel.btnChangeState.disable();
        }
    },

    getNextStates: function () {
        var grid = this.getActiveGrid(),
            store = grid.getStore(),
            record = grid.getSelectionModel().getSelection()[0],
            datos = [],
            estados = [],
            transiciones = [];

        if (!record) {
            return;
        }

        if (parseInt(record.raw.cliente) == 0 || parseInt(record.raw.cliente) == 2) {
            datos = store.proxy.reader.jsonData.estados_proveedor;
        }

        if (record.raw.cliente == 1) {
            datos = store.proxy.reader.jsonData.estados_cliente;
        }
        console.log('datos00:', datos)
        if(Ext.isEmpty(datos)){
            var datos = store.proxy.reader.jsonData.estados;
        }
console.log('record', record)
console.log('datos:', datos)
console.log('datos[record.data.idestado]11:', datos[record.data.idestado])
        if(datos[record.data.idestado]){
            transiciones = datos[record.data.idestado]['transiciones'];
        }

        Ext.each(transiciones, function (transicion) {
            aux=datos[transicion['idestado']];
            aux['notificar']=transicion['notificar'];
            estados.push(aux);
            // estados.push(datos[transicion]);
        });
        return estados;
    },

    getActiveGrid: function () {
        var query = Ext.ComponentQuery.query('co_comitemain tabpanel'),
            grid = query[0].getActiveTab();
        return grid
    },

    showOpinions: function () {
        var grid = this.getActiveGrid(),
            store = grid.getStore(),
            record = grid.getSelectionModel().getSelection()[0],
            tipo = 1,
            id = record.data.idcontrato;

        switch (grid.proceso) {
            case "ofertanegocio":
                tipo = 2;
                id = record.data.idoferta;
                break;
            case "ofertanegocioproveedor":
                tipo = 2;
                id = record.data.idoferta;
                break;
            case "solicitudnegocio":
                tipo = 3;
                id = record.data.idsolicitud;
                break;
            case "solicitudnegocioproveedor":
                tipo = 3;
                id = record.data.idsolicitud;
                break;
            case "solicitudnegocioimportacion":
                tipo = 3;
                id = record.data.idsolicitud;
                break;
            case "solicitudpago":
                tipo = 4;
                id = record.data.idsolicitudpago;
                break;
        }

        let traductor = {
            'mdContrato': 'contrato',
            'ofertanegocio': 'oferta',
            'ofertanegocioproveedor': 'oferta',
            'solicitudofertaimportacion': 'solicitudnegocio',
            'solicitudnegocio': 'solicitudnegocio',
            'solicitudnegocioproveedor': 'solicitudnegocio',
            'solicitudpago': 'solicitudpago'
        }

        Ext.create('Comite.view.OpinionsWindow', {
            title: this.etiquetas.lbOpinions,
            params: {
                id: id,
                tipo: tipo,
                proceso: traductor[grid.proceso]
            },
            data: record.data
        }).show();
    },

    showDetails: function () {
        var grid = this.getActiveGrid(),
            record = grid.getSelectionModel().getSelection()[0];

        switch (grid.proceso) {
            case "ofertanegocio":
                Ext.create('OfertaNegocio.view.WinDetallesOferta').show(record);
                break;
            case "ofertanegocioproveedor":
                Ext.create('OfertaNegocio.view.WinDetallesOferta').show(record);
                break;
            case "solicitudnegocio":
                Ext.create('SolicitudNegocio.view.WinDetallesSolicitud').show(record);
                break;
            case "solicitudnegocioproveedor":
                Ext.create('SolicitudNegocio.view.WinDetallesSolicitud').show(record);
                break;
            case "solicitudnegocioimportacion":
                Ext.create('SolicitudNegocio.view.WinDetallesSolicitud').show(record);
                break;
            case "solicitudpago":
                Ext.create('SolicitudPago.view.DetailsWindow').show(record);
                break;
            default :
                Ext.create('GestionContrato.view.DetailsWindow').show(record);
                break;
        }
    },

    getProcesos: function () {
        var me=this, comite = this.getMainPanel().combo.getValue();
        Ext.MessageBox.show({
            msg: 'Cargando procesos',
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        Ext.Ajax.request({
            scope: this,
            params: {
                comite: comite
            },
            url: UtilsFn.buildUrl({action: 'obtenerProcesos'}, this),
            callback: function (options, success, response) {
                var result = Ext.decode(response.responseText);
                Ext.MessageBox.hide();
                
                me.getMainPanel().down('tabpanel').removeAll();
                if (result.length != 0) {
                    this.addComponentByProceso(result);
                }else{
                    mostrarMensaje(7, 'No existen procesos configurados para este comit&eacute;.');
                }
            }
        });
    },

    addComponentByProceso: function (procesos) {
        var tabpanel = this.getMainPanel().down('tabpanel');
        console.log('procesos', procesos)
        // tabpanel.removeAll();
        Ext.each(procesos, function (proceso) {
            var id = proceso['aliasproceso'],
                nombre = proceso['nombreproceso'],
                idcomite = proceso['idcomite'];
            switch (id) {
                case 'solicitudnegocio':
                    tabpanel.add(Ext.create('Comite.view.SolicitudGrid', {
                        title: nombre,
                        proceso: id,
                        idcomite: idcomite
                    }));
                    break;
                case 'solicitudnegocioproveedor':
                    tabpanel.add(Ext.create('Comite.view.SolicitudGrid', {
                        title: nombre,
                        proceso: id,
                        idcomite: idcomite
                    }));
                    break;
                case 'solicitudnegocioimportacion':
                    tabpanel.add(Ext.create('Comite.view.SolicitudGrid', {
                        title: nombre,
                        proceso: id,
                        idcomite: idcomite
                    }));
                    break;
                case 'ofertanegocio':
                    console.log('ofertanegocio')
                    tabpanel.add(Ext.create('Comite.view.OfertaGrid', {
                        title: nombre,
                        proceso: id,
                        idcomite: idcomite
                    }));
                    break;
                case 'ofertanegocioproveedor':
                    console.log('ofertanegocioproveedor')
                    tabpanel.add(Ext.create('Comite.view.OfertaGrid', {
                        title: nombre,
                        proceso: id,
                        idcomite: idcomite
                    }));
                    break;
                case 'mdContrato':
                    tabpanel.add(Ext.create('Comite.view.MainGrid', {
                        title: nombre,
                        proceso: id,
                        idcomite: idcomite
                    }));
                    break;
                case 'mdcontratoproveedor':
                    tabpanel.add(Ext.create('Comite.view.MainGrid', {
                        title: nombre,
                        proceso: id,
                        idcomite: idcomite
                    }));
                    break;
                case 'solicitudpago':
                    tabpanel.add(Ext.create('Comite.view.SolicitudPagoGrid', {
                        title: nombre,
                        proceso: id,
                        idcomite: idcomite
                    }));
                    break;
            }
        }, this);
        if (tabpanel.items.length != 0) {
            tabpanel.setActiveTab(0);
        }
    },

    onSelectComite: function () {

    },

    onChangeComite: function () {

    },

    filterByEntity: function (cmb) {
        var grid = cmb.up('grid'),
            filter = grid.filters.getFilter('idarea'),
            value = cmb.idValue;

        filter.init();
        filter.setValue(value);
        filter.setActive(true);
    },

    clearFilterEntity: function (cmb) {
        var grid = cmb.up('grid'),
            filter = grid.filters.getFilter('idarea');
        filter.setValue([]);
        filter.setActive(false);
        cmb.tree.selModel.deselectAll();
    },

    mostrarHistorial: function(btn){
        var me = this,
            grid = this.getActiveGrid(),
            store = grid.getStore(),
            record = grid.getSelectionModel().getSelection()[0],
            tipo = 1,
            id = record.data.idcontrato;

        switch (grid.proceso) {
            case "ofertanegocio":
                tipo = 2;
                id = record.data.idoferta;
                break;
            case "ofertanegocioproveedor":
                tipo = 2;
                id = record.data.idoferta;
                break;
            case "solicitudnegocio":
                tipo = 3;
                id = record.data.idsolicitud;
                break;
            case "solicitudnegocioproveedor":
                tipo = 3;
                id = record.data.idsolicitud;
                break;
            case "solicitudnegocioimportacion":
                tipo = 3;
                id = record.data.idsolicitud;
                break;
            case "solicitudpago":
                tipo = 4;
                id = record.data.idsolicitudpago;
                break;
        }

    }
});