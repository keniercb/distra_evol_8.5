/* 
 * Clase que implementa un fitro generico para los grids incorporando las acciones de los botones  * 
 */
Ext.ns('Ext.aft.grid');
Ext.aft.grid.GridFilter = Ext.extend(Ext.util.Observable, {
    searchTipText: 'Introduzca el criterio a buscar..',
    constructor: function (config) {
        Ext.apply(this, config);
        Ext.aft.grid.GridFilter.superclass.constructor.call(this, config);
        this.init();
    },
    init: function () {
        var _this = this;
        this.store = _this.grid.getStore();
        this.btnLimpiar = new Ext.Toolbar.Button({
            text: 'Limpiar',
            iconCls: 'limpiar',
            handler: function () {
                _this.onTriggerClear();
            }
        });
        this.btnFiltar = new Ext.Toolbar.Button({
            text: 'Buscar',
            iconCls: 'buscar',
            handler: function () {
                _this.onTriggerSearch();
            }
        });
        this.tfBusqueda = new Ext.form.TextField({
            width: 200,
            emptyText: 'Criterio a buscar...'
        });

        this.tfBusqueda.on('render', function () {
            this.tfBusqueda.el.dom.qtip = this.searchTipText;
            var map = new Ext.KeyMap(this.tfBusqueda.el, [
                {
                    key: Ext.EventObject.ENTER, scope: this, fn: this.onTriggerSearch
                },
                {
                    key: Ext.EventObject.ESC, scope: this, fn: this.onTriggerClear
                }
            ]);
            map.stopEvent = true;
        }, this, {single: true});

        var tb = new Ext.Toolbar({
            items: [this.tfBusqueda, '-', this.btnFiltar, '-', this.btnLimpiar]
        });
        this.grid.topToolbar = tb;
    },
    onTriggerClear: function () {
        this.tfBusqueda.setValue('');
        this.tfBusqueda.blur();
        this.store.reload({
            params: {
                start: 0
            }
        });
    },
    onTriggerSearch: function () {
        if (this.tfBusqueda.getValue() == '') {
            return;
        }
        this.store.reload({
            params: {
                criterio: this.tfBusqueda.getValue(),
                start: 0
            }
        });
    }
});


