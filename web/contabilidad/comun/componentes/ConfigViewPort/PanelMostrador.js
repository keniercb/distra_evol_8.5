Ext.ns('Ext.Contabilidad');

Ext.Contabilidad.PanelMostrador = Ext.extend(Ext.TabPanel, {
    region: 'center',
    frame: true,
    minTabWidth: 135,
    tabWidth: 210,
    enableTabScroll: true,
    layoutOnTabChange: true,
    sufijoTab: 'tab',
    constructor: function () {
        Ext.Contabilidad.PanelMostrador.superclass.constructor.call(this);
        this.crearFunciones();
    },
    adicionarItem: function (item) {
        this.selectTab(item);
    },
    crearFunciones: function () {
        var _this = this;

        this.selectTab = function (nodo) {
            var idTab = this.sufijoTab + nodo.id;

            var neededTab = this.getItem(idTab);

            if (neededTab) {
                this.activate(neededTab);
            } else {
                this.addTab(nodo, idTab);
            }
        };

        this.addTab = function (nodo, idTab) {
            _this.add(new nodo.itemm({id: idTab})).show();
            // _this.doLayout();

        };

    },
});