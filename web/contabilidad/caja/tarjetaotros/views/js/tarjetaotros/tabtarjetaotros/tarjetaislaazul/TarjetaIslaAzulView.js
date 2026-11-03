Ext.namespace('Ext.TarjetaIslaAzul');
Ext.TarjetaIslaAzul.View = Ext.extend(Ext.Component, {
    etiquetas: undefined,
    Model: undefined,
    constructor: function(model, params)
    {
        this.setModel(model);
        Ext.apply(this, params);
        // this.setEtiquetas(params.etiquetas);
        this.initializeView();
        Ext.TarjetaIslaAzul.View.superclass.constructor.call(this);
    },
    setModel: function (model) {
        this.Model = model;
    },
    getModel: function () {
        return this.Model;
    },
    setEtiquetas: function (etiquetas) {
        this.etiquetas = etiquetas;
    },
    getEtiquetas: function () {
        return this.etiquetas;
    },
    initializeView: function () {
        this.initializeFunctions();
        this.initializeGets();
        this.initializeItems();
    },
    initializeItems: function () {
        var model = this.getModel();
        var me = this;

        this.searchField = new Ext.Cont.SearchField({
            width: (Ext.lib.Dom.getViewWidth() - 10) * 0.1,
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda ]*$/,
            scope: this,
            // fnOnSearch: function () {
            //     me.searchTarjeta(me.searchField.getRawValue());
            // },
            // fnOnClear: function () {
            //     me.searchTarjeta('');
            // }
        });

        this.cbEstado = new Ext.form.ComboBox({
            store: model.getStoreEstado(),
            width: 110,
            style: 'margin:0 0 0 0',
            tpl: '<tpl for="."><div ext:qtip="{estado}" class="x-combo-list-item"><img style="margin-right:5px;" src= {srcImg}>{estado}</div></tpl>',
            emptyText: 'Seleccionar...',//self.perfil.etiquetas.lbSeleccionar,
            displayField: 'estado',
            triggerAction: 'all',
            value: 1,
            valueField: 'id',
            hiddenName: 'id',
            mode: 'local',
            typeAhead: true,
            editable: false,
            resizable: true,
            forceSelection: true,
            selectOnFocus: true
        });

        this.smTarjeta = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.columns = [
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idtarjeta'
            }, {
                header: this.idioma.lbTarjeta,
                sortable: true,
                hideable: true,
                width: 15,
                dataIndex: 'numero'
            },
            {
                sortable: true,
                width: 5,
                header: this.idioma.lbEstado,
                hideable: true,
                dataIndex: 'activo',
                align: 'center',
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    if (value == 1) {
                        metaData.attr = 'ext:qtip="' + '<b>Activa</b>"';
                        metaData.css = 'icondistra-true verde';
                    } else {
                        metaData.attr = 'ext:qtip="' + '<b>Inactiva</b>"';
                        metaData.css = 'icondistra-false rojo';
                    }
                }
            },
            {
                sortable: true,
                width: 10,
                header: this.idioma.lbFechaVence,
                hideable: true,
                dataIndex: 'fechavence'
            }
        ];

        this.toolBar = [this.searchField, '-', this.cbEstado, '->'/*, Caja.Componentes.cbEjercicio, '-', Caja.Componentes.cbPeriodo*/];

        this.pagToolTarjeta = new Ext.Cont.PagingToolbar({
            pageSize: 15,
            store: model.getStoreTarjeta(),
            displayInfo: true
        });
    },
    initializeFunctions: function () {

    },
    initializeGets: function () {
        this.getSearchField = function () {
            return this.searchField;
        };
        this.getSmTarjeta = function () {
            return this.smTarjeta;
        };
        this.getColumns = function () {
            return this.columns;
        };
        this.getToolBar = function () {
            return this.toolBar;
        };

        this.getPagToolTarjeta = function () {
            return this.pagToolTarjeta;
        };

        this.getCbEstado = function () {
            return this.cbEstado;
        };
    }
});
