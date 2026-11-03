/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Conf.ModContb.GestModeloGrid
 * @extends Ext.grid.GridPanel
 */
Ext.namespace('Ext.Conf.ModContb.GestModeloGrid');
Ext.Conf.ModContb.GestModeloGrid = Ext.extend(Ext.grid.GridPanel, {
    idioma: {},
    perfil: {},
    //Functions
    constructor: function (params) {
        this.addEvents('rowaction');
        var _this = this;

        this.sf = new Ext.Cont.SearchField({
            id: 'sf' + params.identificador,
            width: 250,
            emptyText: params.idioma.emptyText || 'Criterio a buscar...',
            searchTooltip: params.idioma.searchTooltip || 'Buscar elementos <b>(Alt+B)</b>',
            clearTooltip: params.idioma.clearTooltip || 'Limpiar filtro <b>(Alt+L)</b>',
            regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
            regexText: params.idioma.regexTextLetrasNumeros,
            maxLength: 255,
            fnOnSearch: function () {
                _this.search();
            },
            fnOnClear: function () {
                _this.clear();
            }
        });

        var rowaction = this.rowaction = new Ext.grid.RowActions({
            id: 'ra' + params.identificador,
            actions: [{
                id: 'modificar',
                tooltip: params.idioma.lbtooltipMod,
                iconCls: 'icondistra-modificar',
                hide: actionValidate.actions['modificar'] ? false : true
            }, {
                id: 'eliminar',
                tooltip: params.idioma.lbtooltipEli,
                iconCls: 'icondistra-eliminar',
                hide: actionValidate.actions['eliminar'] ? false : true,
                marginLeft: 1
            }]
        });
        var idsubsistema = params.identificador.substring(4);
        rowaction.on('action', function (grid, record, action, rowIndex, colIndex, e) {
            grid.fireEvent('rowaction', grid, record, action, rowIndex, colIndex, e);
        });
        Ext.apply(this, params);
        var config = {
            id: params.identificador,
            border: false,
            loadMask: true,
            sm: new Ext.grid.RowSelectionModel({id: 'sm' + params.identificador, singleSelect: false}),
            stripeRows: true,
            autoScroll: true,
            viewConfig: {
                forceFit: true,
                emptyText: params.idioma.lbNoResults
            }
        };

        if (params.idComponente != 3) {
            config.tbar = [this.sf];
        }

        Ext.apply(this, config);

        //Construccion del grid de acuerdo al componente en Modelos de contabilización
        //En estas condiciones se configuran las propiedades diferentes del grid para cada componente
        /*
         * 1-----> Gestionar modelo
         * 2-----> Configuración ------> Gestionar clasificadores ---> Adicionar
         * 3-----> Configuración ------> Gestionar clasificadores ---> Información de los campos contables
         * 4-----> Configuración ------> Gestionar campos contables
         * 5-----> Configuración ------> Gestionar valores contables
         * -1----> Esto significa que no ha especificado el componente
         */

        if (params.idComponente === 1 || params.idComponente === -1) {
            Ext.apply(this, {
                store: this.store = new Ext.data.Store({
                    id: 'st' + params.identificador,
                    url: 'load',
                    baseParams: {
                        idsubsistema: idsubsistema
                    },
                    reader: new Ext.data.JsonReader({
                        totalProperty: 'total',
                        root: 'data',
                        id: 'idmodelo'
                    }, [
                        {name: 'idmodelo'},
                        {name: 'codigo'},
                        {name: 'nombre'},
                        {name: 'descripcion'},
                        {name: 'estado'}
                    ])
                }),
                columns: [
                    {
                        header: params.idioma.lbheaderCod,
                        width: 150,
                        sortable: true,
                        dataIndex: 'codigo',
                        fixed: true,
                        resizable: true
                    },
                    {
                        header: params.idioma.lbheaderNom,
                        width: 150,
                        sortable: true,
                        dataIndex: 'nombre',
                        fixed: false,
                        resizable: true
                    },
                    {
                        id: 'descripcion',
                        header: params.idioma.lbheaderDesc,
                        width: 250,
                        sortable: true,
                        dataIndex: 'descripcion'
                    },
                    {
                        header: params.idioma.lbheaderEst,
                        width: 80,
                        sortable: true,
                        dataIndex: 'estado',
                        align: 'center',
                        fixed: true,
                        resizable: true,
                        renderer: function (val) {
                            if (val) {
                                return '<span style="color:green;">' + 'Activo' + '</span>';
                            } else {
                                return '<span style="color:red;">' + 'Inactivo' + '</span>';
                            }
                        }
                    },
                    rowaction
                ],
                bbar: new Ext.Cont.PagingToolbar({
                    id: 'paging' + params.identificador,
                    pageSize: 20,
                    store: this.store,
                    grid: this,
                    displayInfo: true,
                    displayMsg: params.idioma.lbDisplayMsg || 'Mostrando {0} - {1} de {2}',
                    emptyMsg: params.idioma.lbNoResults || '0 Resultado a mostrar',
                }),
                autoExpandColumn: 'descripcion',
                plugins: [this.rowaction]
            });
        }
        else if (params.idComponente === 2) {
            this.store = new Ext.data.Store({
                id: 'st' + params.identificador,
                url: 'load',
                baseParams: {idsubsistema: params.idsubsistema},
                reader: new Ext.data.JsonReader({
                    totalProperty: 'total',
                    root: 'data',
                    id: 'rd' + params.identificador
                }, [
                    {name: 'idclasificador'},
                    {name: 'nombre'},
                    {name: 'descripcion'},
                    {name: 'rutafichero', mapping: 'ruta'},
                    {name: 'referenciaclase'},
                    {name: 'idsubsistema'},
                    {name: 'idestructuracomun'}
                ])
            });
            Ext.apply(this, {
                store: this.store,
                columns: [
                    {header: params.idioma.headerClf1, width: 200, sortable: true, dataIndex: 'nombre'},
                    {
                        id: 'descripcion',
                        header: params.idioma.headerClf2,
                        width: 250,
                        sortable: true,
                        dataIndex: 'descripcion'
                    },
                    {header: params.idioma.headerClf3, width: 160, sortable: true, dataIndex: 'referenciaclase'},
                    {
                        id: 'rutafile',
                        header: params.idioma.headerClf4,
                        width: 100,
                        sortable: true,
                        dataIndex: 'rutafichero'
                    },
                    rowaction
                ],
                bbar: new Ext.Cont.PagingToolbar({
                    id: 'paging' + params.identificador,
                    pageSize: 20,
                    store: this.store,
                    grid: this,
                    displayInfo: true,
                    displayMsg: params.idioma.lbDisplayMsg || 'Mostrando {0} - {1} de {2}',
                    emptyMsg: params.idioma.lbNoResults || 'No existen datos que mostrar'
                }),
                autoExpandColumn: 'rutafile',
                plugins: [rowaction]
            });
        }
        else if (params.idComponente === 3) {
            Ext.apply(this, {
                store: this.store = new Ext.data.Store({
                    id: 'st' + params.identificador,
                    url: 'cargarcampos',
                    reader: new Ext.data.JsonReader({
                        totalProperty: 'campos.total',
                        root: 'campos.data',
                        id: 'rd' + params.identificador
                    }, [
                        {name: 'idcampo'},
                        {name: 'nombrealternativo', mapping: 'nombre'},
                        {name: 'idcalsificador'},
                        {name: 'tipo'},
                        {name: 'referencia'},
                        {name: 'idsubsistema'},
                        {name: 'idestructuracomun'}
                    ])
                }),
                columns: [
                    {
                        id: 'alt',
                        header: params.idioma.headerClfCampos1,
                        width: 400,
                        sortable: true,
                        dataIndex: 'nombrealternativo'
                    },
                    {
                        id: 'ref',
                        header: params.idioma.headerClfCampos2,
                        width: 600,
                        sortable: true,
                        dataIndex: 'referencia'
                    }
                ],
                autoExpandColumn: 'alt'
            });
        }
        else if (params.idComponente === 4) {
            Ext.apply(this, {
                store: this.store = new Ext.data.Store({
                    id: 'st' + params.identificador,
                    url: 'load',
                    baseParams: {
                        idsubsistema: idsubsistema
                    },
                    reader: new Ext.data.JsonReader({
                        totalProperty: 'total',
                        root: 'data',
                        id: 'rd' + params.identificador
                    }, [
                        {name: 'idcampo'},
                        {name: 'nombre'},
                        {name: 'idclasificador'},
                        {name: 'tipo'},
                        {name: 'referencia'},
                        {name: 'idsubsistema'},
                        {name: 'idestructuracomun'},
                        {name: 'ruta'}
                    ])
                }),
                columns: [
                    {id: 'alt', header: 'Nombre alternativo', width: 400, sortable: true, dataIndex: 'nombre'},
                    {
                        id: 'ref', header: 'Referencia', width: 500, sortable: true, dataIndex: 'referencia',
                        renderer: function (value, metaData, record, rowIndex, colIndex) {
                            var tipo = record.data.tipo;
                            switch (tipo) {
                                case '1':
                                case '3':
                                    var ref = record.data.referencia.split('.');
                                    var msg = '<b>Tipo:</b> <i><#descip#></i>,  <b><#var1#></b> '
                                            + '<i><#ref1#></i>,  <b><#var2#></b> <i><#ref2#></i>',
                                        descripcion = (tipo == 1) ? 'campo de una tabla' : 'funcionalidad',
                                        var1 = (tipo == 1) ? 'tabla:' : 'clase:',
                                        var2 = (tipo == 1) ? 'campo:' : 'funcionalidad:';
                                    return msg.replace('<#descip#>', descripcion).replace('<#ref1#>', ref[0])
                                        .replace('<#ref2#>', ref[1]).replace('<#var1#>', var1).replace('<#var2#>', var2);
                                    break;
                                case '5':
                                case '6':
                                    var ref = (tipo == 5) ? record.data.referencia.split('.') : record.data.referencia,
                                        valor = (tipo == 5) ? ref[1] : ref;
                                    return '<b>Tipo:</b> variable' + ', <b>valor:</b> <i>' + valor + '</i>';
                                    break;
                                default:
                                    return value;
                            }
                        }
                    },
                    rowaction
                ],
                autoExpandColumn: 'alt',
                bbar: new Ext.Cont.PagingToolbar({
                    id: 'paging' + params.identificador,
                    pageSize: 20,
                    store: this.store,
                    grid: this,
                    displayInfo: true,
                    displayMsg: params.idioma.lbDisplayMsg || 'Mostrando {0} - {1} de {2}',
                    emptyMsg: params.idioma.lbNoResults || 'No existen datos que mostrar'
                }),
                plugins: [this.rowaction]
            });
        }
        else if (params.idComponente === 5) {
            Ext.apply(this, {
                store: this.store = new Ext.data.Store({
                    id: 'st' + params.identificador,
                    url: 'load',
                    baseParams: {
                        idsubsistema: idsubsistema
                    },
                    reader: new Ext.data.JsonReader({
                        totalProperty: 'total',
                        root: 'data',
                        id: 'rd' + params.identificador
                    }, [
                        {name: 'idvalorcontable'},
                        {name: 'nombre'},
                        {name: 'tipo'},
                        {name: 'sustitucion'},
                        {name: 'referencia'},
                        {name: 'ruta'},
                        {name: 'concat'},
                    ])
                }),
                columns: [
                    {id: 'nombre', header: 'Nombre', sortable: true, dataIndex: 'nombre'},
                    {
                        header: 'Referencia', width: 150, sortable: true, dataIndex: 'referencia',
                        renderer: function (value, metaData, record, rowIndex, colIndex) {
                            var tipo = record.data.tipo;
                            switch (tipo) {
                                case '1':
                                case '2':
                                    var ref = record.data.referencia.split('.');
                                    var descripcion = (tipo == 1) ? params.idioma.tplcampoTbl :
                                            params.idioma.lbrdfuncionalidad.toLowerCase(),

                                        var1 = (tipo == 1) ? params.idioma.tpltabla :
                                        params.idioma.lbcmbclase.toLowerCase() + ':',

                                        var2 = (tipo == 1) ? params.idioma.lbcmbcampo.toLowerCase() + ':' :
                                        params.idioma.lbrdfuncionalidad.toLowerCase() + ':';
                                    return params.idioma.tplRendererRefCases1_2.replace('<#descip#>', descripcion).replace('<#ref1#>', ref[0])
                                        .replace('<#ref2#>', ref[1]).replace('<#var1#>', var1).replace('<#var2#>', var2);
                                    break;
                                case '3':
                                    return params.idioma.tplRendererRefCase3 + record.data.concat;
                                    break;
                                case '5':
                                case '6':
                                    var ref = (tipo == 5) ? record.data.referencia.split('.') : record.data.referencia,
                                        valor = (tipo == 5) ? ref[1] : ref;
                                    return params.idioma.tplRendererRefCases5_6.replace('<#valor#>', valor);
                                    break;
                                default:
                                    return value;
                            }
                        }
                    },
                    new Ext.grid.CheckColumn({
                        header: 'Sustituci&oacute;n',
                        dataIndex: 'sustitucion',
                        width: 20,
                        align: 'center',
                        sortable: true
                    }),
                    rowaction
                ],
                bbar: new Ext.Cont.PagingToolbar({
                    id: 'paging' + params.identificador,
                    pageSize: 20,
                    store: this.store,
                    grid: this,
                    displayInfo: true,
                    displayMsg: params.idioma.lbDisplayMsg || 'Mostrando {0} - {1} de {2}',
                    emptyMsg: params.idioma.lbNoResults || 'No existen datos que mostrar'
                }),
                autoExpandColumn: 'nombre',
                plugins: [this.rowaction]
            });
        }

        this.store.on(
            {
                scope: this,
                load: function (store) {
                    if (store.getCount() == 0) {
                        var message = (!Ext.isEmpty(store.baseParams.filter)) ? this.idioma.lbNoDataResults : this.idioma.lbNoResults;
                        mostrarMensaje(1, message);
                    }
                }
            }
        );

        Ext.Conf.ModContb.GestModeloGrid.superclass.constructor.call(this);
    },
    search: function () {
        var filtro = this.sf.getValue();
        this.store.baseParams.filter = filtro;
        if (this.store.baseParams.limit && this.store.baseParams.limit != 0) {
            this.store.baseParams.start = 0;
            this.store.baseParams.limit = 20;
        }
        this.store.load();
    },
    clear: function () {
        this.store.baseParams.filter = '';
        if (this.store.baseParams.limit && this.store.baseParams.limit != 0) {
            this.store.baseParams.start = 0;
            this.store.baseParams.limit = 20;
        }
        this.store.load();
    }
});

Ext.grid.CheckColumn = function (config) {
    Ext.applyIf(this, config);
    if (!this.id) {
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype = {
    init: function (grid) {
        this.grid = grid;
        this.grid.on('render', function () {
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },
    onMouseDown: function (e, t) {
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
        }
    },
    renderer: function (v, p, record) {
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
    }
};




