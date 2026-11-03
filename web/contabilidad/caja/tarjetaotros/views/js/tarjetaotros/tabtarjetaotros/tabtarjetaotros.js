Ext.namespace('Ext.Caja.TabTarjetaOtros');
Ext.Caja.TabTarjetaOtros = Ext.extend(Ext.TabPanel, {
    constructor: function (params) {
        this.initializeFunctions();
        Ext.apply(this, {
            activeTab: 0,
            region: 'center',
            // height: 250,
            defaults: {
                autoScroll: true
            },
            border: false,
            items: this.crearTabs(params)
        });

        Ext.Caja.TabTarjetaOtros.superclass.constructor.call(this);

        this.addEvents({
            'deshabilitar': true,
            'habilitar': true,
        });
    },
    crearTabs: function (params) {
        this.islaazul = new Ext.TarjetaIslaAzul.Controller(params);
        this.islaazul.on({
            scope: this,
            deshabilitar: function () {
                this.fireEvent('deshabilitar');
            },
            habilitar: function (activo) {
                this.fireEvent('habilitar', activo);
            },
        });
        return [
            {
                // id: element.idconf,
                title: 'Tarjeta isla azul',
                layout: 'fit',
                items: this.islaazul
            },
        ];
    },
    initializeFunctions: function () {

        this.getGridActive = function () {
            var active = this.getActiveTab();
            return active.items.items[0];
        };

        this.cargar = function (idcaja) {
            var active = this.getActiveTab();
            active.items.items[0].idcaja = idcaja;
            active.items.items[0].tmodel.getStoreTarjeta().load();
            // console.log(active.items.items[0]);
        };


    }
});