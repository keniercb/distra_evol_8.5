Ext.namespace('Caja.Reportes.CbFondo');
Caja.Reportes.CbFondo = Ext.extend(Ext.form.ComboBox,{
    constructor : function(listenersCombo, listenerStore)
    {
        var stfondo = Ext.apply({
            url: 'getFondos',
            root: 'data',
            totalProperty: "total",
            fields: [
                {name: 'idcajafondo'},
                {name: 'denominacion'},
            ],
            autoLoad: false
        }, listenerStore);

        this.stFondo = new Ext.data.JsonStore(stfondo);

        Ext.apply(this, listenersCombo, {
            disabledClass: 'disabled-component',
            store: this.stFondo,
            valueField: 'idcajafondo',
            displayField: 'denominacion',
            fieldLabel: 'Fondo',
            anchor: '100%',
            triggerAction: 'all',
            mode: 'local',
            readOnly: true,
            editable: false,
            allowBlank: false,
            forceSelection: true,
            enableKeyEvents: true,
            selectOnFocus: true
        });

        Caja.Reportes.CbFondo.superclass.constructor.call(this);
        this.crearFunciones();
    },
    crearFunciones: function () {
        this.getStore = function () {
            return this.stFondo;
        }
    }
});