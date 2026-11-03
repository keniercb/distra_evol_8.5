/**
 * Yadrian Aguila Ferran
 * Fichero encargado de Asociar reporte con la especialidad
 **/
Ext.ns('Ext.erp');
Ext.erp.TabAsociarReporteToEspecialidad = new Ext.extend(Ext.FormPanel, {
    constructor: function (config) {
        var _this = this;

        this.title = config.etiquetas.lbTpAsociarReportesToEspecialidad;
        this.frame = true;
        this.bodyStyle = 'padding: 10px';
        this.listeners = {
            'activate': function () {
                _this.stEspecialidad.load();
            }
        };


        _this.urlControladora = '/logistica/activos_fijos/configuracion/index.php/confparametrosgenerales/';
        _this.stEspecialidad = new Ext.data.Store({
            url: _this.urlControladora + 'cargarEspecialidad',
            reader: new Ext.data.JsonReader({
                id: "idespecialidad",
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idespecialidad'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'rector'
                }
            ]),
            listeners: {
                'beforeload': function (store, options) {
                    //store.baseParams.denominacion = _this.tfDenominacion.getValue();
                    store.baseParams.limit = _this.gridReportes.getBottomToolbar().cbPageSize.getValue();
                }
            }
        });

        _this.stReportes = new Ext.data.Store({
            url: _this.urlControladora + 'cargarReportes',
            reader: new Ext.data.JsonReader({
                id: "idreporte",
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'idreporte'
                },
                {
                    name: 'denominacion'
                }
            ]),
            listeners: {
                'beforeload': function (store, options) {
                    store.baseParams.idespecialidad = _this.smEspecialidad.getSelected().get('idespecialidad');
                    store.baseParams.limit = _this.gridEspecialidad.getBottomToolbar().cbPageSize.getValue();
                }
            }
        });
        _this.btnActivar = new Ext.Button({
            text: config.etiquetas.btnActivarTransp,
            tooltip: config.etiquetas.lbTtBtnActivarTransp,
            iconCls: 'aplicar',
            disabled: true,
            listeners: {
                'click': function () {
                    _this.activarEspecialidad();
                }
            }
        });

        _this.smEspecialidad = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        _this.smEspecialidad.on(
            'rowselect', function (sm, record) {
                _this.btnActivar.enable();
                _this.stReportes.load();
            }
        );
        _this.smEspecialidad.on(
            'rowdeselect', function (sm, record) {
                _this.btnActivar.disable();
            });
        _this.cmEspecialidad = [new Ext.grid.RowNumberer({
            header: 'N\xBA.',
            width: 30
        }), {
            id: 'denominacion',
            header: config.etiquetas.lbDenominacion,
            dataIndex: 'denominacion'
        }, {
            id: 'rector',
            width: 100,
            header: config.etiquetas.lbRector,
            dataIndex: 'rector',
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'activo';
                } else {
                    metaData.css = 'inactivo';
                }
            }
        }];
        _this.gridEspecialidad = new Ext.grid.GridPanel({
            height: 350,
            autoExpandColumn: 'denominacion',
            loadMask: true,
            store: _this.stEspecialidad,
            sm: _this.smEspecialidad,
            columns: _this.cmEspecialidad,
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: _this.stEspecialidad
                //displayInfo: true
            })
        });
        _this.smReportes = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });
        _this.gridReportes = new Ext.grid.GridPanel({
            height: 350,
            autoExpandColumn: 'denominacion',
            store: _this.stReportes,
            loadMask: true,
            sm: _this.smReportes,
            columns: [new Ext.grid.RowNumberer({
                header: 'N\xBA.',
                width: 30
            }), _this.smReportes, {
                id: 'denominacion',
                header: config.etiquetas.lbDenominacion,
                dataIndex: 'denominacion'
            }],
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: _this.stReportes
                //displayInfo: true
            })
        });
        this.layout = 'column',
            this.items = [
                {
                    columnWidth: .5,
                    layout: 'form',
                    items: [
                        {
                            xtype: 'fieldset',
                            anchor: '95%',
                            layout: 'fit',
                            style: '-moz-border-radius:5px',
                            title: config.etiquetas.lbTEspecialidad,
                            tbar: ['->', _this.btnActivar],
                            autoHeight: true,
                            items: [_this.gridEspecialidad]
                        }
                    ]
                },
                {
                    columnWidth: .5,
                    layout: 'form',
                    style: 'margin-left: 1px;',
                    items: [
                        {
                            xtype: 'fieldset',
                            anchor: '95%',
                            layout: 'fit',
                            style: '-moz-border-radius:5px;',
                            title: config.etiquetas.lbTReportes,
                            tbar: ['->', {text: '', disabled: true}],
                            autoHeight: true,
                            items: [_this.gridReportes]
                        }
                    ]

                }

            ];

        Ext.erp.TabAsociarReporteToEspecialidad.superclass.constructor.apply(this, arguments);
    },
    activarEspecialidad: function (config) {
        var _this = this;
        Ext.Ajax.request({
            url: _this.urlControladora + 'activarEspecialidad',
            method: 'POST',
            params: {
                datos: Ext.encode(datosR)

            },
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);
                if (rd.CodMsg == 1) {
                    mostrarMensaje(1, config.etiquetas.msgParametrosGuardados);
                    config.grid.getStore().load();
                } else if (rd.CodMsg == 2) {
                    mostrarMensaje(3, config.etiquetas.msgParametrosGuardadosN);

                } else {
                    mostrarMensaje(3, config.etiquetas.msgParametrosGuardadosNo);
                }
            }
        });
    },
    activarReportes: function (config) {
        var _this = this;
        Ext.Ajax.request({
            url: _this.urlControladora + 'activarReportes',
            method: 'POST',
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);
            }
        });

    }
})
