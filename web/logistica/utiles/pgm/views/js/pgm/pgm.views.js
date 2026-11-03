Ext.ns('LOG.lb.PGM');

LOG.lb.PGM.ViewProductos = Ext.extend(Ext.Window, {
    mostrarAlamcenados: false,
    mostraActivosFijos: true,
    urlControlador: '/logistica/utiles/pgm/index.php/existenciasws/',
    constructor: function (config) {
        LOG.lb.PGM.ViewProductos.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        var _this = this;
        this.tpProductos = new Ext.TabPanel({
            activeTab: 0,
            region: 'center',
            plain: true
        });
        this.tpProductos.on({
            'tabchange': function (tp, tab) {
                _this.btnAceptar.disable();
                if (_this.tpProductos.getActiveTab().getSm().hasSelection()) {
                    _this.tpProductos.getActiveTab().getSm().clearSelections();
                }
            }
        });
        if (this.mostrarAlamcenados) {
            this.tpProductos.add(this.initTabMA());
        }
        if (this.mostraActivosFijos) {
            this.tpProductos.add(this.initTabAFT());
        }
        LOG.lb.PGM.ViewProductos.superclass.initComponent.call(_this);

        Ext.apply(_this, {
            layout: 'fit',
            width: 850,
            height: 480,
            floating: true,
            constrain: true,
            resizable: false,
            title: LOG.lb.PGM.lbWinTitle,
            closeAction: 'close',
            plain: true,
            buttons: [new Ext.Button({
                text: LOG.util.Idioma.lbBtnCerrar,
                iconCls: 'cancelar',
                handler: function () {
                    _this.close();
                }
            }), _this.btnAceptar = new Ext.Button({
                text: LOG.util.Idioma.lbBtnAceptar,
                iconCls: 'aceptar',
                disabled: true,
                handler: function () {
                    _this.fireEvent('triggeraction', _this.tpProductos.getActiveTab().getSm().getSelected());
                    _this.close();
                }
            })]
        });
        _this.add(this.tpProductos);
        _this.addEvents({'triggeraction': true});
    },
    initTabMA: function () {
        var _this = this;
        this.stProductosMA = new Ext.data.GroupingStore({
            url: this.urlControlador + 'loadStore',
            baseParams: {query_store: 'MA', idEntidad: this.identidades},
            autoLoad: {params: {start: 0, limit: 30}},
            sortInfo: {field: 'id', direction: "ASC"},
            groupField: 'almacen',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                idProperty: 'id',
                fields: [
                    'id', 'denom', 'um', 'categoria', 'existencia', 'disponible', 'almacen', 'idindicador', 'denominacion'
                ]
            })
        });
        var _sm = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        _sm.on({
            'selectionchange': function () {
                _this.btnAceptar.disable();
                if (_sm.hasSelection()) {
                    _this.btnAceptar.enable();
                }
            }
        });
        this.gpProductosMA = new Ext.grid.GridPanel({
            store: this.stProductosMA,
            columns: [
                {
                    header: LOG.lb.PGM.lbColProducto,
                    width: 260,
                    sortable: true,
                    id: 'denom',
                    dataIndex: 'denom'
                },
                {
                    header: LOG.lb.PGM.lbColUM,
                    width: 50,
                    sortable: true,
                    dataIndex: 'um'
                },
                {
                    header: LOG.lb.PGM.lbColCat,
                    width: 100,
                    sortable: true,
                    dataIndex: 'categoria'
                },
                this.createColumn({
                    header: LOG.lb.PGM.lbColCant,
                    width: 75,
                    sortable: true,
                    dataIndex: 'existencia'
                }, '0,000.000000'),
                this.createColumn({
                    header: LOG.lb.PGM.lbColDisp,
                    width: 75,
                    sortable: true,
                    dataIndex: 'disponible'
                }, '0,000.000000'),
                {
                    header: LOG.lb.PGM.lbColAlm,
                    width: 100,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'almacen'
                }
            ],
            stripeRows: true,
            sm: _sm,
            stateful: true,
            loadMask: {
                store: this.stProductosMA
            },
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
            }),
            region: 'center',
            autoExpandColumn: 'denom',
            bbar: new Ext.PagingToolbar({
                store: this.stProductosMA,
                pageSize: 30,
                displayInfo: true
            }),
        });
        return new Ext.Panel({
            title: LOG.lb.PGM.lbTpAlmacen,
            layout: 'border',
            visible: this.mostrarAlamcenados,
            items: [this.getPanelAvanzada(this.stProductosMA), this.gpProductosMA],
            getSm: function () {
                return _sm;
            }
        });
    },
    initTabAFT: function () {
        var _this = this;
        this.stProductosME = new Ext.data.GroupingStore({
            url: this.urlControlador + 'loadStore',
            baseParams: {query_store: 'ME', idEntidad: this.identidades},
            autoLoad: {params: {start: 0, limit: 30}},
            sortInfo: {field: 'id', direction: "ASC"},
            groupField: 'arearesp',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                idProperty: 'id',
                fields: [
                    'id', 'tipomedio', 'nroinv', 'estado', 'nroserie', 'arearesp', 'idindicador', 'denominacion'
                ]
            })
        });
        var _sm = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        _sm.on({
            'selectionchange': function () {
                _this.btnAceptar.disable();
                if (_sm.hasSelection()) {
                    _this.btnAceptar.enable();
                }
            }
        });
        this.gpProductosME = new Ext.grid.GridPanel({
            store: this.stProductosME,
            region: 'center',
            columns: [
                {
                    header: LOG.lb.PGM.lbColProducto,
                    width: 260,
                    sortable: true,
                    id: 'tipomedio',
                    dataIndex: 'tipomedio'
                },
                {
                    header: LOG.lb.PGM.lbColNoInv,
                    width: 100,
                    sortable: true,
                    dataIndex: 'nroinv'
                },
                {
                    header: LOG.lb.PGM.lbColNoSer,
                    width: 100,
                    sortable: true,
                    dataIndex: 'nroserie'
                },
                {
                    header: LOG.lb.PGM.lbColEstado,
                    width: 100,
                    sortable: true,
                    dataIndex: 'estado'
                },
                {
                    header: LOG.lb.PGM.lbColAR,
                    width: 100,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'arearesp'
                }
            ],
            stripeRows: true,
            stateful: true,
            loadMask: {
                store: this.stProductosME
            },
            sm: _sm,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
            }),
            autoExpandColumn: 'denom',
            bbar: new Ext.PagingToolbar({
                store: this.stProductosME,
                pageSize: 30,
                displayInfo: true
            }),
        });
        return new Ext.Panel({
            title: LOG.lb.PGM.lbTpExplotacion,
            layout: 'border',
            visible: this.mostraActivosFijos,
            items: [this.getPanelAvanzada(this.stProductosME), this.gpProductosME],
            getSm: function () {
                return _sm;
            }
        });
    },
    createColumn: function (config, format) {
        config.renderFn = config.renderer || function (v) {
                return v;
            };
        config.renderer = function (v, m, r) {
            var value = config.renderFn.createDelegate(config, [v, m, r]).call();
            var length = value.length - 1;
            var flag = false;
            var pos = value.indexOf('.');
            while (value[length] == '0' && length > (pos + 3)) {
                length--;
                flag = true;
            }
            if (flag) {
                var inc = value[length] == '0' ? 0 : 1;
                return value.substring(0, length + inc);
            }
            return value;
        };
        return config;
    },
    getPanelAvanzada: function (store) {
        var txtCriterio, cbProducto, cbEntidad, cbEspecialidad;
        return new Ext.Panel({
            title: LOG.util.Idioma.lbBtnBuscarAvz,
            collapsible: true,
            animCollapse: false,
            region: 'north',
            frame: true,
            collapsed: true,
            split: true,
            layout: 'column',
            height: 170,
            defaults: {
                columnWidth: .5,
                layout: 'form',
                labelAlign: 'top'
            },
            items: [
                {
                    items: [
                        txtCriterio = new Ext.form.TextField({
                            fieldLabel: LOG.lb.PGM.lbCodigo,
                            name: 'codigo',
                            anchor: '98%'
                        })]
                }, {
                    items: [
                        cbProducto = new Ext.form.ComboBox({
                            fieldLabel: LOG.lb.PGM.lbDenom,
                            mode: 'remote',
                            name: 'id',
                            typeAhead: true,
                            forceSelection: true,
                            triggerAction: 'all',
                            pageSize: 10,
                            anchor: '98%',
                            displayField: 'denom',
                            valueField: 'id',
                            store: new Ext.data.Store({
                                url: this.urlControlador + 'loadStore',
                                autoLoad: {params: {start: 0, limit: 10}},
                                baseParams: {query_store: 'SURT'},
                                reader: new Ext.data.JsonReader({
                                    root: 'datos',
                                    idProperty: 'id',
                                    totalProperty: 'cantidad',
                                    fields: [
                                        'id', 'denom'
                                    ]
                                })
                            })
                        })
                    ]
                }, {
                    items: [
                        cbEntidad = new Ext.form.ComboBox({
                            fieldLabel: LOG.lb.PGM.lbEntidad,
                            mode: 'local',
                            name: 'almacen',
                            anchor: '98%',
                            displayField: 'denom',
                            typeAhead: true,
                            forceSelection: true,
                            triggerAction: 'all',
                            valueField: 'id',
                            store: new Ext.data.Store({
                                url: this.urlControlador + 'loadStore',
                                autoLoad: true,
                                baseParams: {query_store: 'ALM', idEntidad: this.identidades},
                                reader: new Ext.data.JsonReader({
                                    root: 'datos',
                                    idProperty: 'id',
                                    fields: [
                                        'id', 'denom'
                                    ]
                                })
                            })
                        })]
                }, {
                    items: [
                        cbEspecialidad = new Ext.form.ComboBox({
                            fieldLabel: LOG.lb.PGM.lbEspec,
                            mode: 'local',
                            name: 'especialidad',
                            displayField: 'denom',
                            typeAhead: true,
                            forceSelection: true,
                            triggerAction: 'all',
                            valueField: 'id',
                            anchor: '98%',
                            store: new Ext.data.Store({
                                url: this.urlControlador + 'loadStore',
                                autoLoad: true,
                                baseParams: {query_store: 'ESP', idEntidad: this.identidades},
                                reader: new Ext.data.JsonReader({
                                    root: 'datos',
                                    idProperty: 'id',
                                    fields: [
                                        'id', 'denom'
                                    ]
                                })
                            })
                        })]
                }
            ],
            buttons: [new Ext.Button({
                text: LOG.util.Idioma.lbBtnBuscar,
                iconCls: 'buscar',
                handler: function () {
                    store.load({
                        params: {
                            start: 0,
                            limit: 30,
                            criterio: txtCriterio.getValue(),
                            idEntidad: cbEntidad.getValue(),
                            idEspecialidad: cbEspecialidad.getValue(),
                            idIndicador: cbProducto.getValue(),
                        }
                    })
                }
            }), new Ext.Button({
                text: LOG.util.Idioma.lbBtnLimpiar,
                iconCls: 'limpiar',
                handler: function () {
                    store.load({
                        params: {
                            start: 0,
                            limit: 30
                        }
                    });
                    txtCriterio.reset();
                    cbProducto.reset();
                    cbEntidad.reset();
                    cbEspecialidad.reset();
                }
            })]
        })
    }
});