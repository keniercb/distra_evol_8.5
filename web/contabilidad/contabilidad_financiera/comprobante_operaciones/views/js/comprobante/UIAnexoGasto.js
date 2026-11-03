Ext.namespace('Ext.UIAnexoGasto');
Ext.UIAnexoGasto.wRegistroGastoAnexo = Ext.extend(Ext.Window, {
    constructor: function(scope, params)
    {
        scope.btnCancelar = new Ext.Button({
            text: scope.etiquetas.btnCancelar,
            tooltip: scope.etiquetas.tpCancelar,
            id: 'btnCancelar',
            tabIndex: 109,
              iconCls: 'cancelar',
            scope: this
        });

        scope.btnAceptarGasto = new Ext.Button({
            text: scope.etiquetas.btnAceptar,
            tooltip: scope.etiquetas.tpAceptar,
            id: 'btnAceptarGasto',
            tabIndex: 108,
              iconCls: 'aceptar',
            scope: this
        });

        Ext.applyIf(params, {
            constrain: true,
            id: 'wRegistroGastoAnexo',
            plain: true,
            monitorResize: true,
            closable: false,
            modal: true,
            resizable: false,
            layout: 'border',
            items: [this.regionNorthGasto(scope), scope.gpGasto = new Ext.UIAnexoGasto.gpGasto(scope)],
            buttons: [scope.btnCancelar, scope.btnAceptarGasto]
        });
        scope.lMask = Ext.UIAnexoGasto.loadMask(scope, Ext.getBody());
        return Ext.UIAnexoGasto.wRegistroGastoAnexo.superclass.constructor.call(this, params);
    },
    regionNorthGasto: function(scope)
    {
        scope.cbxCentroGasto = new Ext.form.ComboBox({
            emptyText: scope.etiquetas.textSeleccione,
            fieldLabel: scope.fieldLabel1,
            id: 'cbxCentroGasto',
            tabIndex: 100,
            valueField: 'idcentrogrupo',
            displayField: 'text',
            hiddenName: 'idcentrogrupo',
            maskRe: /[0-9.X|-]$/,
            enableKeyEvents: true,
            editable: true,
            selectOnFocus: true,
            typeAhead: true,
            triggerAction: 'all',
            mode: 'local',
            anchor: '100%',
            tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>',
            store: scope.stObjetoGasto = new Ext.data.Store({
                reader: new Ext.data.JsonReader({}, [{
                    name: 'idcentrogrupo'
                }, {
                    name: 'text'
                }, {
                    name: 'concat'
                },
                {
                    name: 'tipo'
                }
                ])
            })
        });
        scope.cbxElementoGasto = new Ext.form.ComboBox({
            emptyText: scope.etiquetas.textSeleccione,
            fieldLabel: scope.fieldLabel2,
            id: 'cbxElementoGasto',
            tabIndex: 101,
            valueField: 'idelementoobjeto',
            displayField: 'text',
            hiddenName: 'idelementoobjeto',
            disabled: true,
            maskRe: /[0-9.X|-]$/,
            enableKeyEvents: true,
            editable: true,
            selectOnFocus: true,
            typeAhead: true,
            triggerAction: 'all',
            mode: 'local',
            anchor: '100%',
            tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>',
            store: scope.stElementoGasto = new Ext.data.Store({
                url: scope.url + 'cargarElementosGastos',
                reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    root: "datos"
                }, [{
                    name: 'text'
                }, {
                    name: 'idelementoobjeto'
                }, {
                    name: 'directivo'
                },
                {
                    name: 'tipo'
                }
                ])
            })
        });

        scope.nfCantHombres = new Ext.form.NumberField({
            fieldLabel: scope.etiquetas.lbCantHombres,
            id: "nfCantHombres",
            maskRe: /[0-9]$/,
            allowBlank: false,
            enableKeyEvents: true,
            tabIndex: 102,
            allowDecimals: false,
            anchor: '100%',
            allowNegative: false,
            maxLength: 19,
            style: 'text-align:right'
        });

        scope.nfImporteGasto = new Ext.form.NumberField({
            fieldLabel: scope.etiquetas.lbImporte,
            id: "nfImporteGasto",
            enableKeyEvents: true,
            tabIndex: 103,
            allowBlank: false,
            allowDecimals: true,
            anchor: '100%',
            allowNegative: false,
            maxLength: 19,
            style: 'text-align:right'
        });

        scope.btnAdicionarGasto = new Ext.Button({
            text: scope.etiquetas.btnAdicionar,
            enableToggle: true,
            tabIndex: 104,
            tooltip: scope.etiquetas.tpAdicionar,
            id: 'btnAdicionar',
              iconCls: 'adicionar',
            scope: this
        });

        scope.btnCancelarModificacion = new Ext.Button({
            text: scope.etiquetas.btnCancelar,
            tabIndex: 105,
            hidden: true,
            tooltip: scope.etiquetas.tpCancelarModificacion,
            id: 'btnCancelarModificacion',
              iconCls: 'cancelar',
            scope: this
        });

        scope.pnlAlignBtn = {
            monitorResize: true,
            layout: 'form',
            border: false,
            hideBorders: true,
            bodyBorder: false,
            bodyStyle: 'padding:0 0 18px 0'
        };

        scope.pnlAlignBtnAdicionar = {
            autoWidth: true,
            layout: 'form',
            bodyStyle: 'padding:0 5px 0 0',
            labelAlign: 'top',
            items: [scope.pnlAlignBtn, scope.btnAdicionarGasto]
        };

        scope.pnlAlignBtnCancelarModificacion = {
            autoWidth: true,
            layout: 'form',
            bodyStyle: 'padding:0 5px 0 0',
            labelAlign: 'top',
            items: [scope.pnlAlignBtn, scope.btnCancelarModificacion]
        };

        scope.pnlRegionNorthGasto = new Ext.form.FormPanel({
            border: false,
            hideBorders: true,
            bodyBorder: false,
            frame: true,
            region: 'north',
            hidden: (scope.editable) ? false : true,
            height: (scope.editable) ? 65 : 0,
            items: [{
                layout: 'column',
                bodyStyle: 'padding:0 5px 0 5px',
                border: false,
                hideBorders: true,
                bodyBorder: false,
                items: [
                {
                    columnWidth: .3,
                    layout: 'form',
                    bodyStyle: 'padding:0 10px 0 0',
                    labelAlign: 'top',
                    items: scope.cbxCentroGasto
                }, {
                    columnWidth: .3,
                    layout: 'form',
                    bodyStyle: 'padding:0 10px 0 0',
                    labelAlign: 'top',
                    items: scope.cbxElementoGasto
                }, {
                    columnWidth: .2,
                    layout: 'form',
                    bodyStyle: 'padding:0 10px 0 0',
                    labelAlign: 'top',
                    items: scope.nfImporteGasto
                }, scope.pnlAlignBtnAdicionar, scope.pnlAlignBtnCancelarModificacion
                ]
            }]
        });

        if (scope.cantHombres)
            scope.pnlRegionNorthGasto.getComponent(0).insert(2, {
                columnWidth: .2,
                layout: 'form',
                bodyStyle: 'padding:0 10px 0 0',
                labelAlign: 'top',
                items: scope.nfCantHombres
            });

        return  scope.pnlRegionNorthGasto;
    }
});

Ext.UIAnexoGasto.loadMask = function(scope, body)
{
    return new Ext.LoadMask(body, {
        msg: scope.etiquetas.lMask
    });
};

Ext.UIAnexoGasto.gpGasto = Ext.extend(Ext.grid.GridPanel, {
    constructor: function(scope, params)
    {
        scope.btnModificarPaseGasto = new Ext.Button({
            text: scope.etiquetas.btnModificar,
            tooltip: scope.etiquetas.tpModificar,
            tabIndex: 106,
            id: "btnModificarPaseGasto",
              iconCls: 'modificar',
            scope: this
        });

        scope.btnEliminarPaseGasto = new Ext.Button({
            text: scope.etiquetas.btnEliminar,
            tooltip: scope.etiquetas.tpEliminar,
            tabIndex: 107,
            id: "btnEliminarPaseGasto",
              iconCls: 'eliminar',
            scope: this
        });

        scope.textbarPorciento = (scope.partida > 0) ? new Ext.Toolbar.TextItem({
            text: '<b>' + parseFloat(scope.porciento) + '%</b>'
        }) : {
            xtype: 'tbspacer'
        };

        scope.textbarImporteAl = (scope.partida > 0) ? new Ext.Toolbar.TextItem({
            text: scope.etiquetas.lbImporteOriginal + ((scope.credito == true) ? scope.etiquetas.lbCredito : scope.etiquetas.lbDebito)
        }) : {
            xtype: 'tbspacer'
        };

        scope.textbarImportePorciento = (scope.partida > 0) ? new Ext.Toolbar.TextItem({
            text: "<b>" + formatoMonedaABS((scope.importeOriginal * parseFloat(scope.porciento)) / 100) + "</b>"
        }) : {
            xtype: 'tbspacer'
        };

        Ext.applyIf(params || this, {
            id: 'gpGasto',
            region: 'center',
            bodyStyle: 'padding:0 5px 0 5px',
            autoExpandColumn: 'col1',
            autoScroll: true,
            border: false,
            hideBorders: true,
            bodyBorder: false,
            iconCls: 'icon-grid',
            viewConfig: {
                forceFit: true
            },
            tbar: scope.tbGasto = new Ext.Toolbar({
                hidden: true,
                items: [
                scope.btnModificarPaseGasto,
                scope.btnEliminarPaseGasto
                ]
            }),
            bbar: ["->", new Ext.menu.Separator({}), new Ext.Toolbar.TextItem({
                text: scope.etiquetas.lbImporteOriginal + ((scope.creditoOriginal == true) ? scope.etiquetas.lbCredito : scope.etiquetas.lbDebito)
            }),
            {
                xtype: 'tbspacer'
            }, scope.nfImporteOriginal = new Ext.Toolbar.TextItem({
                text: "<b>" + formatoMonedaABS(scope.importeOriginal) + "</b>"
            }), new Ext.menu.Separator({}),
            {
                xtype: 'tbspacer'
            },
            {
                xtype: 'tbspacer'
            },
            {
                xtype: 'tbspacer'
            },
            {
                xtype: 'tbspacer'
            },
            new Ext.menu.Separator({
                hidden: (scope.partida > 0) ? false : true
            }), scope.textbarPorciento,
            {
                xtype: 'tbspacer'
            }, scope.textbarImporteAl,
            {
                xtype: 'tbspacer'
            }, scope.textbarImportePorciento,
            new Ext.menu.Separator({
                hidden: (scope.partida > 0) ? false : true
            }),
            {
                xtype: 'tbspacer'
            },
            {
                xtype: 'tbspacer'
            },
            {
                xtype: 'tbspacer'
            },
            {
                xtype: 'tbspacer'
            },
            new Ext.menu.Separator({}),
            new Ext.Toolbar.TextItem({
                text: scope.etiquetas.lbSumaControl
            }),
            {
                xtype: 'tbspacer'
            }, scope.nfImporteTotal = new Ext.form.Label({
                html: "<b>" + formatoMonedaABS(scope.sumaControl) + "</b>"
            }), new Ext.menu.Separator({})],
            sm: scope.smGasto = new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            cm: this.getColumnsGasto(scope),
            store: this.getStoreGasto(scope)
        });
        return Ext.UIAnexoGasto.gpGasto.superclass.constructor.call(this, params);
    },
    getColumnsGasto: function(scope)
    {
        return new Ext.grid.ColumnModel([
        {
            header: scope.fieldLabel1,
            id: 'col1',
            dataIndex: 'col1'
        },
        {
            header: scope.fieldLabel2,
            dataIndex: 'col2',
            width: 60
        },
        {
            header: scope.etiquetas.lbCantHombres,
            dataIndex: 'cantHombres',
            hidden: (scope.cantHombres) ? false : true,
            width: 30
        },
        {
            header: scope.etiquetas.lbImporte,
            tooltip: scope.etiquetas.tpImporte,
            resizable: false,
            menuDisabled: true,
            dataIndex: 'importeFormat',
            align: 'right',
            width: 30,
            renderer: function(value)
            {
                return formatoMonedaABS(value);
            }
        }]);
    },
    getStoreGasto: function(scope)
    {
        return scope.stGasto = new Ext.data.Store({
            url: scope.url + 'cargarRegistroAnexoAlPase',
            sort: 'col1',
            reader: new Ext.data.JsonReader({}, [{
                name: 'idregistroanexo'
            }, {
                name: 'col1'
            }, {
                name: 'col2'
            }, {
                name: 'idCol1'
            }, {
                name: 'idCol2'
            }, {
                name: 'cantHombres'
            }, {
                name: 'importeFormat'
            }, {
                name: 'importe'
            }
            ])
        });
    }
});