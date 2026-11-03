Ext.define('GestionCampanna.controller.AddProducto', {
    extend: 'Ext.app.Controller',

    refs: [
        {ref: 'addProducto', selector: 'addproducto'},
        {ref: 'productGrid', selector: 'productgrid'}
    ],

    init: function () {

        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {
                'addproducto searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                'addproducto button[action]': {
                    click: this.onSave
                },
                'addproducto gridpanel': {
                    selectionchange: this.onSelectionChange
                }
            }
        });
    },

    onSave: function (btn) {
        var store = this.getProductGrid().getStore(),
            window = this.getAddProducto(),
            records = window.grid.getSelectionModel().getSelection();

        Ext.each(records, function (record) {
            store.add(GestionCampanna.model.CampannaProducto.create({
                denominacion: record.data.denominacion,
                tipo: record.data.tipo,
                idproducto: record.data.idindicador
            }));
        });
        window.close();
    },

    onSearch: function (field) {
        var grid = this.getAddProducto().grid;
        grid.getStore().load({
            params: {
                denominacion: field.getValue()
            }
        });
    },

    onClear: function () {
        var grid = this.getAddProducto().grid;
        grid.getStore().load();
    },

    onSelectionChange: function (sm, records) {
        var btn = this.getAddProducto().btnAceptar;
        if (records.length > 0) {
            btn.enable();
        } else {
            btn.disable();
        }
    }


});

