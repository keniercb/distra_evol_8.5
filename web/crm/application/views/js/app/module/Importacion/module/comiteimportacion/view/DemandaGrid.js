Ext.define('ComiteImportacion.view.DemandaGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.co_demandagrid',
    region: 'center',
    selType: 'checkboxmodel',
    requires: [
        'Ext.ux.grid.FiltersFeature'
    ],
    proceso:"solicituddemanda",
    initComponent: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(me);
        this.title = this.title || this.etiquetas.titleDemanda || "Demanda";
        this.store = Ext.create('ComiteImportacion.store.SolicitudPago');
        this.store.proxy.extraParams.aliasproceso = this.proceso;
        this.store.proxy.extraParams.idcomite = this.idcomite;
        this.selModel = {mode: 'MULTI'};
        this.frame = false;
        this.margin = false;
        this.border = false;
        this.emptyText = this.etiquetas.msgNoDataLoaded;
        this.features = [
            {
                ftype: 'grouping',
                groupByText: 'Agrupar por esta columna',
                groupHeaderTpl: ['Fecha: {name:this.format}', {
                    format: function (name) {
                        if (typeof name == 'object') {
                            return Ext.Date.format(name, 'd/m/Y');
                        }
                        return name;
                    }
                }]
            },
            {
                ftype: 'filters',
                menuFilterText: this.etiquetas.lbbusqueda,
                local: false
            }
        ];

        //COLUMNAS
        this.columns = [];

        this.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: this.store,
                dock: 'bottom',
                pageNumb: true,
                displayInfo: true
            }
        ];

        this.searchfield = Ext.create('Ext.ux.SearchField', {
            flex: 1,
            maxWidth: 250,
            minWidth: 150,
            searchTooltip: this.etiquetas.qtipSearch.get('Solicitud'),
            keyMap: [
                {
                    key: 'l',
                    alt: true,
                    ctrl: false,
                    event: 'onclick1'
                },
                {
                    key: 'b',
                    alt: true,
                    ctrl: false,
                    event: 'onclick2'
                }
            ]
        });

        /*this.otherfilters = Ext.create('Ext.Button', {
            text: 'filtros',
            iconCls: 'icondistra-filtrar',
            action: 'filtrar',
            menu: new Ext.menu.Menu({
                plain: true,
                items: Ext.create('ComiteImportacion.view.FpFiltrosOferta'),
                pressTreeCombo: false,
                listeners: {
                    beforehide: function (comp) {
                        if (comp.pressTreeCombo) {
                            comp.pressTreeCombo = false;
                            return false;
                        }
                    }
                }
            })
        });*/

        this.tbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: true,
            items: [
                '->',
                this.searchfield/*,
                this.otherfilters*/
            ]
        });


        this.callParent();
    },
    showTooltip: function (value, meta, record, row, col) {
        if (value)
            meta.tdAttr = 'data-qtip="' + value + '"';
        return value;
    },
    showIcon: function (value, meta, record, row, col) {
        var column = this.columnManager.columns[col],
            rol = column['dataIndex'].split('-')[1];
        if (Ext.isArray(value)) {
            var states = this.countStates(value),
                html = "<div style='margin-left: 15%;'>";
            for (var k in states) {
                html += "<div style='float: left;font-weight: bold'> " + states[k]['count'] + " </div><div style='float: left;' class= \"icondistra-" + states[k]['icon'] + "\"></div>";
            }
            html += "</div>";
            return html;
        } else {
            var estado = record.data['estado-' + rol];
            meta.innerCls = "icondistra-" + value;
            if (estado) {
                meta.tdAttr = 'data-qtip="' + estado + '"';
            }
        }
    },

    countStates: function (array) {
        var states = {};
        Ext.each(array, function (r) {
            if (!states[r.idestado]) {
                states[r.idestado] = {
                    icon: r['NomEstado']['icono'],
                    count: parseInt(1)
                };
            } else {
                states[r.idestado]['count'] = parseInt(states[r.idestado]['count'] + 1);
            }
        });
        return states;
    }
});
