Ext.define('NomClienteProveedor.view.CmbClasificacion', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.cmbclasificacion',

    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        me.fieldLabel = me.etiquetas.lbtipo;
        me.displayField = 'name';
        me.width = 500;
        me.labelWidth = 130;
        me.store = Ext.create('Ext.data.Store', {
            fields: [
                {name: 'tipo', type: 'int'},
                {name: 'denominacion', type: 'string'},
                {name: 'descripcion', type: 'string'}
            ],
            data: [
                {"tipo": "0", "denominacion": me.etiquetas.lbtipoEstado, descripcion: me.etiquetas.qtipTipoEstado},
            ]
        });
        me.queryMode = 'local';
        me.listConfig = {
            getInnerTpl: function () {
                return '<div data-qtip="{descripcion}">{descripcion}</div>';
            }
        };
        this.callParent();
    }
});