Ext.namespace('Ext.contabilidad.util.UI');
Ext.contabilidad.util.UI.ComboGrid = Ext.extend(Ext.form.ComboBox, {
    constructor: function(scope, params)
    {
        scope.hiddeninput = new Ext.form.Hidden();
        
        Ext.apply(this, params, {
            allowBlank: false,
            forceSelection: true,
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            enableKeyEvents: true,
            anchor: '98%',
            selectedClass: '',
            editable: false,
            store: new Ext.data.SimpleStore({
                fields: [],
                data: [[]]
            }),
            onSelect: Ext.emptyFn,
            lazyRender: true,
            emptyText: 'Seleccione...',
            blankText: 'Este campo es obligatorio.',
            tpl: '<div id = \"datos\" style = \"height:' + params.Height + 'px; !important;\"></div>'
        });
        return Ext.contabilidad.util.UI.ComboGrid.superclass.constructor.call(this);
    }
});