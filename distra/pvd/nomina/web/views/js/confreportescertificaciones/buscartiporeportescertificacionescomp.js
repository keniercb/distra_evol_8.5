/**
 Uso:Componente para realizar la busqueda de los tipos de reportes y certificaciones.

 * ---------------------------------------------

 * 28 de Marzo de 2013 |   Nomina
 *

 * @extends Ext.Panel
 * @xtype
 * @autor   Linea Capital Humano - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */
Ext.ns('Pvd.Nomina.TiposReportesyCertificaciones');
Ext.QuickTips.init();
Pvd.Nomina.TiposReportesyCertificaciones.Utils = function () {
    return {
        loadMask: function (msj, cmp) {
            var componente = (!cmp) ? Ext.getBody() : cmp.body;
            this.lMask = new Ext.LoadMask(componente, {
                msg: msj
            });
            this.lMask.show();
        },
        hideMask: function () {
            this.lMask.hide();
        }
    }
};
var utils = new Pvd.Nomina.TiposReportesyCertificaciones.Utils();

/*Componente*/
Pvd.Nomina.TiposReportesyCertificaciones.BuscarTipoReportesyCertificaciones = Ext.extend(Ext.Panel, {
    region: (this.region ? this.region : 'west'),
    layout: (this.layout ? this.layout : 'border'),
    frame: false,
    split: (this.split ? this.split : true),
    cantidadPorPagina: (this.cantidadPorPagina ? this.cantidadPorPagina : 20),
    mostrarVariables: (this.mostrarVariables ? this.mostrarVariables : null),
    initComponent: function () {
        this.seleccion = null;

        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar' + this.id,
            allowBlank: true,
            minLength: 3,
            enableKeyEvents: true,
            width: 160,
            emptyText: 'Criterio a buscar...',
            listeners: {
                specialkey: function (t, e) {
                    if (e.keyCode == 13) this.btnBuscar.handler();
                }.createDelegate(this)
            }
        });
        this.btnBuscar = new Ext.Button({
            disabled: false,
            id: 'btnBuscar' + this.id,
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar (<b>Alt+B</b>)',
            handler: function () {
            }
        });

        //Store para cargar los tipos de reportes y certificaciones
        this.stTiposRepCert = null;
        if (this.mostrarVariables) {
            this.stTiposRepCert = new Ext.data.GroupingStore({
                url: '/pvd/nomina/index.php/confreportescertificaciones/obtenerconfiguracionesreportescertificaciones',
                baseParams: {variables: (this.mostrarVariables ? 1 : null)},
                reader: new Ext.data.JsonReader(
                    {
                        totalProperty: "cantidad",
                        autoLoad: true,
                        root: "datos",
                        id: "idvariablesconfreportescertificaciones"
                    },
                    [{name: 'idconfreportescertificaciones'}
                        , {name: 'denominacion'}
                        , {name: 'nivel'}
                        , {name: 'obligatorioprocesarlo'}
                        , {name: 'aprobacionelementos'}
                        , {name: 'aplicaren'}
                        , {name: 'idvariablesconfreportescertificaciones'}
                        , {name: 'denominacionvariable'}
                        , {name: 'mesessnc'}
                        , {name: 'tiposeleccionpersonas'}
                        ,{name: 'comportamientoreportesc4'}
                    ]),
                sortInfo: {field: 'denominacionvariable', direction: "ASC"},
                groupField: 'denominacion'
            });

        } else {
            this.stTiposRepCert = new Ext.data.Store({
                url: '/pvd/nomina/index.php/confreportescertificaciones/obtenerconfiguracionesreportescertificaciones',
                params: {variables: (this.mostrarVariables ? 1 : null)},
                reader: new Ext.data.JsonReader(
                    {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idconfreportescertificaciones"},
                    [{name: 'idconfreportescertificaciones'}
                        , {name: 'denominacion'}
                        , {name: 'nivel'}
                        , {name: 'obligatorioprocesarlo'}
                        , {name: 'aprobacionelementos'}
                        , {name: 'aplicaren'}
                        , {name: 'deresultados'}
                        ,{name: 'comportamientoreportesc4'}
                        , {name: 'mesessnc'}
                        , {name: 'tiposeleccionpersonas'}
                    ])
            });
        }

        this.cmTipoRepCert = null;
        if (this.mostrarVariables) {
            this.cmTipoRepCert = new Ext.grid.ColumnModel([{
                id: 'idconfreportescertificaciones',
                header: "idconfreportescertificaciones",
                dataIndex: 'idconfreportescertificaciones',
                hidden: true,
                hideable: false
            }, {
                header: "Reporte",
                dataIndex: 'denominacion',
                width: 300,
                hidden: true,
                hideable: false
            }, {
                header: "Nivel",
                dataIndex: 'nivel',
                width: 100,
                hidden: true,
                hideable: false
            }, {
                header: "Obligatorio procesar",
                dataIndex: 'obligatorioprocesarlo',
                width: 130,
                hidden: true,
                hideable: false
            }, {
                header: "Aprobar elementos",
                dataIndex: 'aprobacionelementos',
                width: 130,
                hidden: true,
                hideable: false
            }, {
                header: "Aplicar en",
                dataIndex: 'aplicaren',
                width: 100,
                hidden: true,
                hideable: false
            }, {
                header: "idvariablesconfreportescertificaciones",
                dataIndex: 'idvariablesconfreportescertificaciones',
                width: 100,
                hidden: true,
                hideable: false
            }, {
                header: "Campos del reporte",
                dataIndex: 'denominacionvariable',
                width: 300,
                hideable: false
            }
            ]);
        } else {
            this.cmTipoRepCert = new Ext.grid.ColumnModel([{
                id: 'idconfreportescertificaciones',
                header: "idconfreportescertificaciones",
                dataIndex: 'idconfreportescertificaciones',
                hidden: true,
                hideable: false
            }, {
                header: "Denominaci&oacute;n",
                dataIndex: 'denominacion',
                width: 300
            }, {
                header: "Nivel",
                dataIndex: 'nivel',
                width: 100,
                hidden: true,
                hideable: false
            }, {
                header: "Obligatorio procesar",
                dataIndex: 'obligatorioprocesarlo',
                width: 130,
                hidden: true,
                hideable: false
            }, {
                header: "Aprobar elementos",
                dataIndex: 'aprobacionelementos',
                width: 130,
                hidden: true,
                hideable: false
            }, {
                header: "Aplicar en",
                dataIndex: 'aplicaren',
                width: 100,
                hidden: true,
                hideable: false
            }
            ]);
        }
        this.cmTipoRepCert.defaultSortable = true;

        this.gpTipoRepCert = null;
        if (this.mostrarVariables) {
            this.gpTipoRepCert = new Ext.grid.GridPanel({
                region: 'center',
                layout: 'fit',
                store: this.stTiposRepCert,
                autoScroll: true,
                cm: this.cmTipoRepCert,
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect: true,
                    listeners: {
                        rowselect: function (sel, i, r) {
                            this.fireEvent('seleccion', sel, r);
                        }.createDelegate(this)
                    }

                }),
                width: 600,
                height: 300,
                border: false,
                hideBorders: true,
                view: new Ext.grid.GroupingView({
                    forceFit: true,
                    groupTextTpl: '{text}'
                }),
                viewConfig: {forceFit: true},
                loadMask: {msg: 'Cargando...'},
                tbar: [this.tfbuscar, '', this.btnBuscar],
                bbar: new Ext.PagingToolbar({
                    pageSize: this.cantidadPorPagina,
                    store: this.stTiposRepCert,
                    displayInfo: true,
                    displayMsg: 'Mostrando  {0} - {1} de {2}',
                    emptyMsg: "0 Resultado a mostrar"
                })
            });
        } else {
            this.gpTipoRepCert = new Ext.grid.GridPanel({
                region: 'center',
                layout: 'fit',
                store: this.stTiposRepCert,
                autoScroll: true,
                cm: this.cmTipoRepCert,
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect: true,
                    listeners: {
                        rowselect: function (sel, i, r) {
                            this.fireEvent('seleccion', sel, r);
                        }.createDelegate(this)
                    }

                }),
                width: 600,
                height: 300,
                border: false,
                hideBorders: true,
                viewConfig: {forceFit: true},
                loadMask: {msg: 'Cargando...'},
                tbar: [this.tfbuscar, '', this.btnBuscar],
                bbar: new Ext.PagingToolbar({
                    pageSize: this.cantidadPorPagina,
                    store: this.stTiposRepCert,
                    displayInfo: true,
                    displayMsg: 'Mostrando  {0} - {1} de {2}',
                    emptyMsg: "0 Resultado a mostrar"
                })
            });
        }

        this.btnBuscar.on('click', function () {
            this.stTiposRepCert.removeAll();
            this.stTiposRepCert.load({
                params: {
                    start: 0,
                    limit: this.cantidadPorPagina,
                    criterio: this.tfbuscar.getValue()
                }
            });
        }.createDelegate(this));

        //this.tbar = [this.tfbuscar, '', this.btnBuscar];
        this.items = [this.gpTipoRepCert];

        Pvd.Nomina.TiposReportesyCertificaciones.BuscarTipoReportesyCertificaciones.superclass.initComponent.call(this);
    },
    Cargar: function () {
        this.stTiposRepCert.removeAll();
        this.stTiposRepCert.load({params: {start: 0, limit: this.cantidadPorPagina}});
    },
    getSeleccion: function () {
        if (this.gpTipoRepCert.getSelectionModel().hasSelection()) {
            return this.gpTipoRepCert.getSelectionModel().getSelected();
        } else return null;
    },
    limpiarSeleccion: function () {
        if (this.gpTipoRepCert.getSelectionModel().hasSelection()) {
            return this.gpTipoRepCert.getSelectionModel().clearSelections();
        } else return null;
    }

});
