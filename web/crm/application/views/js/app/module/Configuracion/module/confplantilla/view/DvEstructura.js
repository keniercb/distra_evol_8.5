Ext.define('ConfPlantilla.view.DvEstructura', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dvestructura',
    layout: 'fit',
    height: 400,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.tbar= [
            {
                text: me.etiquetas.lbBtnAdicionar,
                iconCls: 'icondistra-adicionar',
                tooltip: me.etiquetas.ttipBtnAdicionarEstructura,
                action: 'addestructura',
                menu: [{
                    text: me.etiquetas.lbActionCompText,
                    estructType: 1
                },{
                    text: me.etiquetas.lbActionCompImagen,
                    estructType: 2
                }]
            },{
                text: me.etiquetas.lbBtnModificar,
                iconCls: 'icondistra-modificar',
                tooltip: me.etiquetas.ttipBtnModificarEstructura,
                action: 'modestructura',
                disabled: true
            },
            {
                text: me.etiquetas.lbBtnEliminar,
                iconCls: 'icondistra-eliminar',
                tooltip: me.etiquetas.ttipBtnEliminarEstructura,
                action: 'elimestructura',
                disabled: true
            }
        ];

        me.items = {
            xtype: 'dataview',
            autoScroll: true,
            store: Ext.create('ConfPlantilla.store.Estructura'),
            tpl: me.getTplInfo(),
            itemSelector: 'div.pr-item',
            selectedItemCls: 'pr-item-selected',
            overItemCls: 'pr-item-over'
        };

        me.callParent();
    },
    getTplInfo: function(){
        var me = this;
        return new Ext.XTemplate(
            '<div class="pr-documentbody"><div>'+me.etiquetas.lbCuerpoReporte+'</div></div>',
            '<tpl for=".">',
                '<div class="pr-item pr-item-posicion-{posicion} pr-item-region-{region}">',
                    '<tpl if="tipo == 1">',
                        '<div class="pr-text">{texto}</div>',
                    '<tpl else>',
                        '<img class="pr-img-{posicion}" src="data:image/jpg;base64,{img}"/>',
                    '</tpl>',
                '</div>',
            '</tpl>'
        );
    },
});
