Ext.define('ConfPlantilla.view.Main', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gpplantilla',
    closable: true,
    selType: 'checkboxmodel',
    initComponent: function() {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.title = me.etiquetas.moduleName;
        me.store = Ext.create('ConfPlantilla.store.Plantilla');

        me.selModel = {mode: 'MULTI'};

        me.columns = [{
                text: me.etiquetas.lbDenominacion,
                sortable: false,
                flex: 1,
                dataIndex: 'denominacion'
            }
        ];

        me.searchfield = Ext.create('Ext.ux.SearchField', {
            width: 250,
            searchTooltip: this.etiquetas.qtipSearch.get(me.etiquetas.lbPlantillaSing),
            clearTooltip: this.etiquetas.qtipCleanFilter,
            keyMap: [
                {
                    key: 'l',
                    alt: true,
                    ctrl: false,
                    event: 'clear'
                },
                {
                    key: 'b',
                    alt: true,
                    event: 'search'
                }
            ]
        });

        me.tbar= [
            {
                text: me.etiquetas.lbBtnAdd,
                iconCls: 'icondistra-adicionar',
                tooltip: me.etiquetas.qtipAdd.get(me.etiquetas.lbPlantillaSing),
                action: 'addplantilla',
                keyMap: {
                    key: 'i',
                    alt: true,
                    event: 'click'
                }
            },{
                text: me.etiquetas.lbBtnMod,
                iconCls: 'icondistra-modificar',
                tooltip: me.etiquetas.qtipMod.get(me.etiquetas.lbPlantillaSing),
                action: 'modplantilla',
                disabled: true,
                keyMap: {
                    key: 'm',
                    alt: true,
                    event: 'click'
                }
            },{
                text: me.etiquetas.lbBtnDel,
                iconCls: 'icondistra-eliminar',
                tooltip: me.etiquetas.qtipDel.get(me.etiquetas.lbPlantillaSing),
                action: 'elimplantilla',
                disabled: true,
                keyMap: {
                    key: Ext.EventObject.DELETE,
                    event: 'click'
                }
            }, '|',{
                text: me.etiquetas.lbBtnVistaPrevia,
                iconCls: 'icondistra-vistaprevia',
                tooltip: me.etiquetas.ttipBtnVistaPrevia,
                action: 'vistaprevia',
                disabled: true
            }, '->', me.searchfield, {
                iconCls: 'ayuda',
                action: 'help',
                text: me.etiquetas.lbBtnhelp,
                // refhelp: 'dat_contrato',
                tooltip: me.etiquetas.qtipHelp
            }
        ];

        me.callParent();
    }
});
