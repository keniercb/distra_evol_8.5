Ext.define('TipoContrato.view.ToolBar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.toolBar',
    flex: 1,
    border: false,
    enableOverflow: true,

    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);

        this.btnAdd = Ext.create('Ext.Button', {
            text: me.etiquetas.lbAdicionar,
            tooltip: me.context == 'treeTC' ? me.etiquetas.tpAdicionarTC : me.etiquetas.tpAdicionarETC,
            action: 'add',
            iconCls: 'icondistra-adicionar',
            disabled: false,
            hidden: true,
            selector: 'add' + this.selector,
            context: this.context,
            keyMap: me.context == 'treeTC' ? {
                key: 'i',
                alt: true,
                ctrl: false,
                event: 'click'
            } : {
                key: 'i',
                alt: true,
                ctrl: true,
                event: 'click'
            }
        });
        this.btnDel = Ext.create('Ext.Button', {
            text: me.etiquetas.lbEliminar,
            tooltip: me.context == 'treeTC' ? me.etiquetas.tpEliminarTCSP : me.etiquetas.tpEliminarETCSP,
            action: 'del',
            iconCls: 'icondistra-eliminar',
            disabled: true,
            hidden: true,
            selector: 'del' + this.selector,
            context: this.context,
            keyMap: me.context == 'treeTC' ? {
                key: Ext.EventObject.DELETE,
                event: 'click'
            } : {
                key: Ext.EventObject.DELETE,
                alt: true,
                event: 'click'
            }
        });

        this.btnHeredar = Ext.create('Ext.Button', {
            text: me.etiquetas.heredar,
            tooltip: me.context == 'treeTC' ? me.etiquetas.tpHeredarTC : me.etiquetas.tpHeredarETC,
            disabled: false,
            // hidden: true,
            action: 'heredarTC',
            selector: 'heredarTC',
            iconCls: 'icondistra-heredar',
            context: this.context,
        });

        this.btnUsar = Ext.create('Ext.Button', {
            text: me.etiquetas.lbUsar,
            tooltip: me.context == 'treeTC' ? me.etiquetas.tpUsar : me.etiquetas.tpUsar,
            disabled: true,
            // hidden: true,
            action: 'usarTC',
            selector: 'usarTC',
            iconCls: 'icondistra-usarentidad verde',
            context: this.context,
        });

        this.btnNoUsar = Ext.create('Ext.Button', {
            text: me.etiquetas.lbNoUsar,
            tooltip: me.context == 'treeTC' ? me.etiquetas.tpNoUsar : me.etiquetas.tpNoUsar,
            disabled: true,
            // hidden: true,
            action: 'nousarTC',
            selector: 'nousarTC',
            iconCls: 'icondistra-usarentidad rojo',
            context: this.context,
        });
        this.btnExpandir = Ext.create('Ext.Button', {
            tooltip: me.etiquetas.lbExpandir,
            action: 'expandir',
            iconCls: 'icondistra-expandir',
            disabled: false,
            context: this.context
        });
        this.btnContraer = Ext.create('Ext.Button', {
            tooltip: me.etiquetas.lbContraer,
            action: 'contraer',
            iconCls: 'icondistra-contraer',
            disabled: false,
            context: this.context
        });


        this.buscar = Ext.create('Ext.ux.SearchField', {
            clearTooltip: me.context == 'treeTC' ? me.etiquetas.lbLimpiarFiltro : me.etiquetas.lbLimpiarFiltroETC,
            searchTooltip: me.context == 'treeTC' ? me.etiquetas.lbBuscar : me.etiquetas.lbBuscarETC,
            emptyText: me.etiquetas.lbCriterioBusqueda,
            maxLength: 255,
            maskRe: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,]*)+$/,
            regex: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,]*)+$/,
            context: this.context,
            keyMap: me.context == 'treeTC' ? [] : [
                {
                    key: 'l',
                    alt: true,
                    ctrl: false,
                    event: 'onclick1'
                },
                {
                    key: 'b',
                    alt: true,
                    ctrl: false,
                    event: 'onclick2'
                }
            ]
        });

        if (me.context == 'treeTC') {
            this.buscar.width = 145
        } else {
            this.buscar.width = 250
        }

        this.btnHelp = Ext.create('Ext.Button', {
            xtype: 'button',
            iconCls: 'ayuda',
            action: 'help',
            refhelp: 'conf_tp_tipocontrato',
            text: this.etiquetas.lbBtnhelp,
            tooltip: this.etiquetas.qtipHistoric
        });

        var items;
        if (me.context == 'treeEC') {
            items = [this.btnAdd, this.btnDel, '->', this.buscar, '-', this.btnHelp]
        } else {
            items = [this.btnAdd, this.btnDel, this.btnUsar, this.btnNoUsar, '->', this.buscar]
        }

        this.items = items;

        this.callParent();
    }
});