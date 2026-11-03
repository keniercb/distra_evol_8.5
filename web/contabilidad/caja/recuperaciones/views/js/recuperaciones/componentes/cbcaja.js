Ext.namespace('Caja.Reportes.CbCaja');
Caja.Reportes.CbCaja = Ext.extend(Ext.form.ComboBox,{
    constructor : function(listenersCombo, listenerStore)
    {
        var stcaja = Ext.apply({
            url: 'cargarCaja',
            method: 'POST',
            reader: new Ext.data.JsonReader({
                // root: 'data',
            }, [{
                name: 'nombrecaja'
            }, {
                name: 'idcaja'
            }]),
            autoLoad: false
        }, listenerStore);

        this.stCaja = new Ext.data.Store(stcaja);

        this.stCaja.on({
            scope: this,
            load: function (st, records, opt) {
                if (records.length === 1) {
                    this.setValue(records[0].get('idcaja'));
                    this.fireEvent('select', this, records[0], 0);
                }
            }
        });

        Ext.apply(this, listenersCombo, {
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            forceSelection: true,
            emptyText: 'Seleccione...',
            fieldLabel: 'Caja',
            store: this.stCaja,
            valueField: 'idcaja',
            displayField: 'nombrecaja',
            hiddenName: 'idcaja',
            mode: 'local',
            allowBlank: false,
            triggerAction: 'all',
            enableKeyEvents: true,
            anchor: '100%'
        });


        Caja.Reportes.CbCaja.superclass.constructor.call(this);
        this.crearFunciones();
    },
    crearFunciones: function () {
        this.getStore = function () {
            return this.stCaja;
        }
    }
});