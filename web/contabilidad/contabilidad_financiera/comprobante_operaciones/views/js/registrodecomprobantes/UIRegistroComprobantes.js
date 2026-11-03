Ext.ns('Ext.UIRegistroComprobantes');
Ext.UIRegistroComprobantes.ViewPort = Ext.extend(Ext.Viewport, {
    constructor: function (scope, params) {
        Ext.applyIf(this, {
            renderTo: document.body,
            layout: 'fit'
        });
        return Ext.UIRegistroComprobantes.ViewPort.superclass.constructor.call(this, params);
    }
});

Ext.UIRegistroComprobantes.loadMask = function (body, msg) {
    return new Ext.LoadMask(body, {
        msg: msg
    });
};

Ext.UIRegistroComprobantes.menuActions = Ext.extend(Ext.menu.Menu, {
    constructor: function (scope) {
        Ext.apply(this, {
            shadow: true,
            items: [
                scope.btnNewUIComprobanteTipoOperaciones = new Ext.menu.Item({
                    text: scope.etiquetas.btnNewUIComprobanteTipo,
                    tabIndex: 304,
                    iconCls: 'nuevo'
                }),
                scope.btnOpenUIComprobante = new Ext.menu.Item({
                    text: scope.etiquetas.btnOpenUIComprobante,
                    tabIndex: 305,
                    iconCls: 'abrir'
                }),
                scope.btnAnularUIComprobante = new Ext.menu.Item({
                    text: scope.etiquetas.btnAnularUIComprobante,
                    tabIndex: 306,
                    iconCls: 'anular'
                }),
                scope.btnDuplicateUIComprobante = new Ext.menu.Item({
                    text: scope.etiquetas.btnDuplicateUIComprobante,
                    tabIndex: 307,
                    iconCls: 'duplicar'
                }),
                scope.btnInvertUIComprobante = new Ext.menu.Item({
                    text: scope.etiquetas.btnInvertUIComprobante,
                    tabIndex: 308,
                    iconCls: 'invertir'
                }),
                scope.btnChangeStateUIComprobante = new Ext.menu.Item({
                    text: scope.etiquetas.btnChangeStatusComprobante,
                    tabIndex: 309,
                    iconCls: 'asentar'
                }),
                scope.btnChangeNumberUIComprobante = new Ext.menu.Item({
                    text: scope.etiquetas.btnChangeStateUIComprobante,
                    tabIndex: 310,
                    hidden: true,
                    iconCls: 'numeroserie'
                }),
                scope.btnExportarComprobante = new Ext.menu.Item({
                    text: scope.etiquetas.btnExportar,
                    tabIndex: 311,
                    hidden: true,
                    iconCls: 'exportar'
                }),
                scope.btnViewReportUIComprobante = new Ext.menu.Item({
                    text: scope.etiquetas.btnViewReportUIComprobante,
//                      icon: perfil.dirImg + 'vistareporte.png',
                    iconCls: 'vistareporte',
                    tabIndex: 312
                })]
        });
        return Ext.UIRegistroComprobantes.menuActions.superclass.constructor.call(this);
    }
});

Ext.UIRegistroComprobantes.pnlContenedor = Ext.extend(Ext.Panel, {
    constructor: function (scope) {
        Ext.applyIf(this, {
            layout: 'fit',
            border: false,
            items: [scope.gpRegistroComprobantes = this.fGetGridComprobantes(scope)]
        });
        return this;
    },
    fGetGridComprobantes: function (scope) {
        scope.searchField = new Ext.Cont.SearchField({
            width: 120,
            maskRe: /^[0-9]*$/,
            scope: this,
            emptyText: 'Número a buscar...',
            fnOnSearch: function () {
                //scope.ptRegistroComprobantes.changePage(0);
                scope.stRegistroComprobantes.baseParams.start = 0;
                scope.stRegistroComprobantes.baseParams.params = Ext.encode({arrayIdNumeroComprobantes: [scope.searchField.getRawValue()], searchNum: 1});
                scope.stRegistroComprobantes.load();
            },
            fnOnClear: function () {
                scope.stRegistroComprobantes.baseParams.params = null;
                scope.stRegistroComprobantes.load();
            }
        });

        scope.btnBuscarComprobantes = new Ext.Button({
            text: scope.etiquetas.lbBtnBusquedaAvanzada,
            tooltip: scope.etiquetas.lbTtBusquedaAvanzada,
            tabIndex: 312,
            hidden: true,
            disabled: true,
            iconCls: 'buscaravanzada'
        });
        scope.dmPasarFecha = new Ext.menu.DateMenu({
            id: 'dateMenu',
            format: 'd/m/Y'
        });
        scope.btnPasarFecha = new Ext.Button({
            text: scope.etiquetas.lbPasarDia,
            tooltip: scope.etiquetas.lbTtPasarDia,
            hidden: true,
            iconCls: 'calendario',
            menu: scope.dmPasarFecha
        });
        scope.btnMenuComprobante = new Ext.Button({
            id: 'btnMenuComprobante',
            text: scope.etiquetas.btnComprobante,
            tooltip: scope.etiquetas.tpMenuComprobante,
            tabIndex: 300,
            iconCls: 'comprobante',
            disabled: true,
            menu: scope.menuActions = new Ext.UIRegistroComprobantes.menuActions(scope)
        });
        scope.btnGraficarComprobantes = new Ext.Button({
            text: scope.etiquetas.btnGraficar,
            tooltip: scope.etiquetas.tpGraficarComprobantes,
            tabIndex: 313,
            hidden: true,
            disabled: true,
            iconCls: 'graficar'
        });
        scope.btnImportar = new Ext.Button({
            text: scope.etiquetas.lbBtnImportar,
            tooltip: scope.etiquetas.lbTtImportar,
            hidden: true,
            tabIndex: 314,
            iconCls: 'importar'
        });
        scope.btnAgruparCmp = new Ext.Button({
            text: scope.etiquetas.btnAgruparCmp,
            tooltip: scope.etiquetas.tpAgruparCmp,
            tabIndex: 313,
            disabled: true,
            icon: '/contabilidad/comun/images/collapse-all.gif',
            iconCls: 'btn',
            handler: function () {
                var columnModel = scope.gpRegistroComprobantes.getColumnModel();
                var index = columnModel.getIndexById('subsistema');
                scope.stRegistroComprobantes.groupBy('subsistema');
                columnModel.setHidden(index, true);
            }
        });
        scope.btnDesagruparCmp = new Ext.Button({
            text: scope.etiquetas.btnDesagruparCmp,
            tooltip: scope.etiquetas.tpDesagruparCmp,
            tabIndex: 313,
            disabled: true,
            icon: '/contabilidad/comun/images/expand-all.gif',
            iconCls: 'btn',
            handler: function () {
                var columnModel = scope.gpRegistroComprobantes.getColumnModel();
                var index = columnModel.getIndexById('subsistema');
                scope.stRegistroComprobantes.clearGrouping();
                columnModel.setHidden(index, false);
            }
        });
        scope.btnAyuda = new Ext.Button({
            id: 'btnHelpRegCmp',
            iconCls: 'ayuda',
            text: scope.etiquetas.lbbtnAyuda,
            tooltip: scope.etiquetas.lbttipHelp
        });
        scope.stRegistroComprobantes = new Ext.data.GroupingStore({
            url: 'cargarComprobantes',
            baseParams: {
                limit: 20,
                params: undefined
            },
            reader: new Ext.data.JsonReader({
                    id: 'reader',
                    totalProperty: 'total',
                    root: 'datos'
                },
                [{
                    name: 'id',
                    mapping: 'idComprobante'
                },
                    {
                        name: 'idComprobante'
                    },
                    {
                        name: 'numeroComprobante',
                        type: 'int'
                    },
                    {
                        name: 'fechaEmision'
                    },
                    {
                        name: 'fechaSistema'
                    },
                    {
                        name: 'descripcion'
                    },
                    {
                        name: 'observacion'
                    },
                    {
                        name: 'version'
                    },
                    {
                        name: 'idUsuario'
                    },
                    {
                        name: 'usuario'
                    },
                    {
                        name: 'idEstadoComprobante'
                    },
                    {
                        name: 'denominacionEstado'
                    },
                    {
                        name: 'idTipoComprobante'
                    },
                    {
                        name: 'tipoComprobante'
                    },
                    {
                        name: 'cierreoApertura'
                    },
                    {
                        name: 'creadoEnContabilidad'
                    },
                    {
                        name: 'idSubsistema',
                        type: 'int'
                    },
                    {
                        name: 'subsistema'
                    },
                    {
                        name: 'idEstructurae'
                    },
                    {
                        name: 'denominacionEntidad'
                    }
                ]),
            sortInfo: {
                field: "numeroComprobante",
                direction: "ASC"
            },
            groupField: 'subsistema'
        });
        return new Ext.grid.GridPanel({
            frame: false,
            border: false,
            autoScroll: true,
            stripeRows: true,
            iconCls: 'icon-grid',
            sm: scope.smComprobante,
            autoExpandColumn: 'descripcion',
            store: scope.stRegistroComprobantes,
            cm: new Ext.grid.ColumnModel([
                {
                    header: scope.etiquetas.lbNoComprobante,
                    tooltip: scope.etiquetas.lbTtNoComprobante,
                    width: 60,
                    sortable: true,
                    dataIndex: 'numeroComprobante',
                    type: 'int'
                }, {
                    id: 'descripcion',
                    header: scope.etiquetas.dataIndexobservacion,
                    tooltip: scope.etiquetas.lbTtObservacion,
                    width: 400,
                    sortable: true,
                    dataIndex: 'observacion'
                }, {
                    header: scope.etiquetas.dataIndexdenominacionEstado,
                    tooltip: scope.etiquetas.lbTtEstado,
                    width: 100,
                    sortable: true,
                    dataIndex: 'denominacionEstado'
                }, {
                    header: scope.etiquetas.lbCreadoCont,
                    tooltip: scope.etiquetas.lbTtCreadoCont,
                    width: 55,
                    align: 'center',
                    sortable: true,
                    dataIndex: 'creadoEnContabilidad',
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        if (record.data.creadoEnContabilidad == 1) {
                            metaData.attr = 'ext:qtip="' + '<b>' + scope.etiquetas.lbCreadoInt + '</b>"';
                            return '<img qtip="<b>' + scope.etiquetas.lbCreadoInt + '</b>" src= /contabilidad/comun/images/checkgreen.png>';
                        } else {
                            metaData.attr = 'ext:qtip="' + '<b>' + scope.etiquetas.lbCreadoExt + '</b>"';
                            return '<img qtip="<b>' + scope.etiquetas.lbCreadoExt + '</b>" src= /contabilidad/comun/images/checkblue.png>';
                        }
                    }
                }, {
                    header: scope.etiquetas.dataIndexfechaEmision,
                    tooltip: scope.etiquetas.lbTtFechaCont,
                    width: 80,
                    sortable: true,
                    dataIndex: 'fechaEmision'
                }, {
                    header: scope.etiquetas.dataIndexfechaSistema,
                    tooltip: scope.etiquetas.lbTtFechaSist,
                    width: 80,
                    sortable: true,
                    dataIndex: 'fechaSistema'
                }, {
                    header: scope.etiquetas.dataIndexusuario,
                    tooltip: scope.etiquetas.lbTtUsuario,
                    width: 100,
                    sortable: true,
                    dataIndex: 'usuario'
                }, {
                    header: scope.etiquetas.dataIndexdenominacionEntidad,
                    tooltip: scope.etiquetas.lbTtEntidad,
                    width: 215,
                    sortable: true,
                    dataIndex: 'denominacionEntidad'
                }, {
                    id: 'subsistema',
                    header: scope.etiquetas.dataIndex,
                    tooltip: scope.etiquetas.lbTtSubsistema,
                    hidden: true,
                    width: 100,
                    sortable: true,
                    dataIndex: 'subsistema'
                }
            ]),
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text} ({[values.rs.length]} {[(values.rs.length > 1) ? "Comprobantes" : "Comprobante"]})'
            }),
            tbar: scope.tbGpComprobantes = new Ext.Toolbar({
                hidden: false,
                items: [scope.btnMenuComprobante, scope.btnPasarFecha, scope.btnBuscarComprobantes, scope.btnGraficarComprobantes, scope.btnImportar, '-', scope.searchField, '->', scope.lbInformacionPeriodo = new Ext.form.Label({
                    text: '...',
                    style: 'font-size:13px;'
                }), new Ext.Toolbar.Separator(), scope.btnAyuda]
            }),
            bbar: scope.ptRegistroComprobantes = new Ext.Cont.PagingToolbar({
                pageSize: 20,
                clearFilter: true,
                displayInfo: true,
                displayMsg: scope.etiquetas.lbDisplayMsg,
                scope: this,
                tabIndex: 314,
                store: scope.stRegistroComprobantes,
                emptyMsg: scope.etiquetas.msgptRegistroComprobantes,
                btnsConfig: [scope.btnAgruparCmp, scope.btnDesagruparCmp]
            })
        });
    }
});

Ext.UIRegistroComprobantes.winExportarComprobante = Ext.extend(Ext.Window, {
    constructor: function (scope, params) {
        Ext.applyIf(this, {
            title: scope.etiquetas.lbTtlExportar,
            animateTarget: 'btnMenuComprobante',
            id: 'winExportCmp',
            layout: 'fit',
            width: 400,
            heigth: 240,
            modal: true,
            closeAction: 'hide',
            constrain: true,
            defaultButton: 0,
            buttons: [{
                id: 'btnCancelarExportar',
                iconCls: 'cancelar',
                text: scope.etiquetas.btnCancelar,
                tooltip: scope.etiquetas.lbTtCancelar,
                scope: this,
                handler: function () {
//                        this.hide();
                }
            }, {
                id: 'btnAceptarExportar',
                iconCls: 'aceptar',
                text: scope.etiquetas.btnAceptar,
                tooltip: scope.etiquetas.lbTtAceptar,
                handler: function () {
                }
            }]
        });
        return Ext.UIRegistroComprobantes.winExportarComprobante.superclass.constructor.call(this, params);
    }
});