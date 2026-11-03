Ext.define('OfertaNegocio.view.GpOfertaEstadoTrazas', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gpofertaestadotrazas',
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);

        me.store = Ext.create('OfertaNegocio.store.OfertaEstadoTrazas');

        function mostrarTooltip(value, meta){
            if (value)
                meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }

        me.columns = [
            {
                text: me.etiquetas.lbEstado,
                sortable: false,
                // align: 'center',
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
                // align: 'center',
                fixed: true,
                width: 100,
                dataIndex: 'usuario',
                renderer:mostrarTooltip
            },{
                text: me.etiquetas.lbNombreUsuario,
                sortable: false,
                flex: 1,
                dataIndex: 'nombreapellidos',
                renderer:mostrarTooltip
            },{
                text: me.etiquetas.lbAreaUsuario,
                sortable: false,
                flex: 1,
                dataIndex: 'area',
                renderer:mostrarTooltip
            },{
                text: me.etiquetas.lbFechaEstado,
                sortable: false,
                fixed: true,
                width: 100,
                align: 'center',
                dataIndex: 'fechainicio',
                renderer:mostrarTooltip
            },{
                text: me.etiquetas.lbDuracionEstado,
                sortable: false,
                align: 'center',
                fixed: true,
                width: 100,
                dataIndex: 'duracionestado',
                renderer:function(value, meta){
                    meta.tdAttr = 'data-qtip="' + value +' '+ me.etiquetas.lbUTDay + '"';
                    return value +' '+ me.etiquetas.lbUTDay
                }
            }
        ];

        this.callParent();
    }
});