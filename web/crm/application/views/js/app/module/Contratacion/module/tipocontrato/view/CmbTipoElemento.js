Ext.define('TipoContrato.view.CmbTipoElemento', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.cmbTipoElemento',
    width: 340,
    displayField: 'humanlabel',
    allowBlank: false,
    valueField: 'humanlabel',
    typeAhead: false,
    queryMode: 'local',
    enableKeyEvents: true,
    forceSelection: true,
    listeners: {
        'keyup': function() {
            var me = this;
            this.store.clearFilter();
            this.store.filterBy(function (record) {
                var tipo = me.up().up().getSelectionModel().getLastSelected().parentNode.data.tipo;
                if (tipo == '' || tipo == 'container') {
                    return (record.get(me.displayField).toLowerCase().indexOf(me.getRawValue().toLowerCase()) != -1);
                } else {
                    return (record.get(me.displayField).toLowerCase().indexOf(me.getRawValue().toLowerCase()) != -1 && record.get('tipo') == 'widget');
                }
            });
        },
        'expand' : function() {
            var me = this;
            var tipo = me.up().up().getSelectionModel().getLastSelected().parentNode.data.tipo;
            if (me.valueModels[0] && tipo == 'widget' && me.valueModels[0].data.tipo == 'container') {
                me.reset();
                me.markInvalid(me.etiquetas.lbElmentoEx);
            }
            this.store.clearFilter();
            this.store.filterBy(function (record) {
                if (tipo == '' || tipo == 'container') {
                    return true;
                } else {
                    return (record.get('tipo') == 'widget');
                }
            });
        }
    },
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);

        me.emptyText = me.etiquetas.lbSeleccione;
        me.store  = Ext.create('TipoContrato.store.CmbTipoElemento');
        me.store.load();

        me.callParent();
    }

});