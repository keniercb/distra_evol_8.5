Ext.define('SolicitudNegocio.view.GpEstadoTrazas', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gpestadotrazas',
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);

        me.store = Ext.create('SolicitudNegocio.store.EstadoTrazas');

        me.columns = [
            {
                text: me.etiquetas.lbEstado,
                sortable: false,
                fixed: true,
                width: 120,
                dataIndex: 'estado',
                renderer: function (value, meta) {
                    meta.innerCls = "icondistra-" +  meta.record.data.iconoestado;
                    if (value)meta.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },{
                text: me.etiquetas.lbUsuario,
                sortable: false,
                fixed: true,
                width: 80,
                dataIndex: 'usuario'
            },{
                text: me.etiquetas.lbNombreUsuario,
                sortable: false,
                flex: 1,
                dataIndex: 'nombreapellidos'
            },{
                text: me.etiquetas.lbAreaUsuario,
                sortable: false,
                flex: 1,
                dataIndex: 'area'
            },{
                text: me.etiquetas.lbFechaEstado,
                sortable: false,
                fixed: true,
                width: 100,
                dataIndex: 'fechainicio'
            },{
                text: me.etiquetas.lbDuracionEstado,
                sortable: false,
                align: 'center',
                fixed: true,
                width: 100,
                dataIndex: 'duracionestado',
                renderer:function(value, meta){
                    meta.tdAttr = 'data-qtip="' + value +''+ me.etiquetas.lbUTDay + '"';
                    return value +' '+ me.etiquetas.lbUTDay
                }
            }
        ];

        this.callParent();
    }
});