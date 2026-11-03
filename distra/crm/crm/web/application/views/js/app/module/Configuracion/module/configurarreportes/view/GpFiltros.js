Ext.define('Reportes.view.GpFiltros', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gpfiltros',
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.store = Ext.create('Reportes.store.Filtros');

        me.columns = [
            {
                text: me.etiquetas.lbDenominacion,
                sortable: false,
                flex: 1,
                dataIndex: 'denominacion'
            },{
                text: me.etiquetas.lbTipoFiltro,
                sortable: false,
                fixed: true, width: 100,
                dataIndex: 'tipo',
                renderer : me.formatTypeFilter,
                align: 'center',
                scope: this
            },{
                text: me.etiquetas.lbNombreParametro,
                sortable: false,
                fixed: true, width: 100,
                dataIndex: 'nombreparametro'
            },{
                text: me.etiquetas.lbOrdenMostrar,
                sortable: false,
                fixed: true, align: 'center', width: 50,
                dataIndex: 'orden'
            }

        ];

        me.tbar= [
            {
                text: me.etiquetas.lbBtnAdd,
                iconCls: 'icondistra-adicionar',
                tooltip: me.etiquetas.ttipBtnAdicionarFiltro,
                action: 'addfiltro',
                menu: [{
                    text: me.etiquetas.lbActionFilterText,
                    filterType: 1,
                },{
                    text: me.etiquetas.lbActionFilterDate,
                    filterType: 2,
                },{
                    text: me.etiquetas.lbActionFilterNumeric,
                    filterType: 3,
                },{
                    text: me.etiquetas.lbActionFilterNomenclador,
                    filterType: 4,
                },{
                    text: me.etiquetas.lbActionFilterEstructura,
                    filterType: 5,
                }]
            },{
                text: me.etiquetas.lbBtnMod,
                iconCls: 'icondistra-modificar',
                tooltip: me.etiquetas.ttipBtnModificarFiltro,
                action: 'modfiltro',
                disabled: true
            },
            {
                text: me.etiquetas.lbBtnDel,
                iconCls: 'icondistra-eliminar',
                tooltip: me.etiquetas.ttipBtnEliminarFiltro,
                action: 'elimfiltro',
                disabled: true
            }
        ];

        me.callParent();
    },
    formatTypeFilter: function(val){
        var me = this;

        switch(val){
            case 1: return me.etiquetas.lbActionFilterText;break;
            case 2 : return me.etiquetas.lbActionFilterDate;break;
            case 3 : return me.etiquetas.lbActionFilterNumeric;break;
            case 4 : return me.etiquetas.lbActionFilterNomenclador;break;
            case 5 : return me.etiquetas.lbActionFilterEstructura;break;
        }
    }
});
