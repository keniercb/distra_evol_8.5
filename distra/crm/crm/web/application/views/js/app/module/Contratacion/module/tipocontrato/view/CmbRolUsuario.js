Ext.define('TipoContrato.view.CmbRolUsuario', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.cmbRolUsuario',
    displayField: 'denominacion',
    valueField: 'idrol',
    allowBlank: false,
    typeAhead: false,
    queryMode: 'local',
    enableKeyEvents: true,
    forceSelection: true,
    listeners: {
        'keyup': function() {
            var me = this;
            this.store.clearFilter();
            this.store.filterBy(function (record) {
                return record.get(me.displayField).toLowerCase().indexOf(me.getRawValue().toLowerCase()) != -1;
            });
        },
        'expand': function () {
            this.store.clearFilter();
        }
    },

    initComponent: function(){
        var me = this;
        me.etiquetas = LangMgr.getLang(this);

        me.emptyText = me.etiquetas.lbSeleccione;
        me.store  = Ext.create('TipoContrato.store.RolUsuario');

        me.callParent();
    }
});