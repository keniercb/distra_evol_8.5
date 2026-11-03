Ext.define('TipoContrato.view.GridCompartimentacion', {
    extend: 'TipoContrato.view.Tree',
    alias: 'widget.gridCompartimentacion',
    iconCls: 'icondistra-compartimentacion',
    rootVisible: true,
    hidden:true,

    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);
        me.columns = [
            Ext.create('Ext.tree.Column', {
                text: me.etiquetas.lbElementosContrato,
                dataIndex: 'denominacion',
                flex: 0.7,
                editor: Ext.create('Ext.form.field.Text', {
                    allowBlank: false,
                    selectOnFocus: true,
                    allowOnlyWhitespace: false,
                    maxLength: 255,
                    maskRe: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,]*)+$/,
                    regex: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,]*)+$/,
                    regexText: me.etiquetas.lbAlfanumerico
                })
            }),

            {dataIndex: 'idelemento', hidden: true, hideable: false},

            Ext.create('Ext.ux.ColumnComponent', {
                text: me.etiquetas.lbObligatorio,
                dataIndex: 'obligatorio',
                flex: 0.1,
                align: 'center',
                renderer: function (name, meta, record) {
                    if (!record.isRoot()) {
                        return Ext.create('Ext.ux.form.field.ToggleSlide', {
                            onText: me.etiquetas.lbSi,
                            offText: me.etiquetas.lbNo,
                            value: Boolean(name),
                            idColumn: 'obligatorio'
                        });
                    }
                    return null;
                }
            }),

            Ext.create('Ext.ux.ColumnComponent', {
                text: me.etiquetas.lbVisibilidad,
                dataIndex: 'visibilidad',
                flex: 0.1,
                align: 'center',
                renderer: function (enabled) {
                    return Ext.create('Ext.ux.form.field.ToggleSlide', {
                        onText: me.etiquetas.lbSi,
                        offText: me.etiquetas.lbNo,
                        value: Boolean(enabled),
                        idColumn: 'visibilidad'
                    });
                }
            }),

            Ext.create('Ext.ux.ColumnComponent', {
                text: me.etiquetas.lbGestionar,
                dataIndex: 'gestionar',
                flex: 0.1,
                align: 'center',
                renderer: function (name, meta, record) {
                    if (record.isRoot()) {
                        return Ext.create('Ext.ux.form.field.ToggleSlide', {
                            onText: me.etiquetas.lbSi,
                            offText: me.etiquetas.lbNo,
                            value: Boolean(name),
                            idColumn: 'gestionar'
                        });
                    }
                    return null;
                }
            })
        ];

        this.lbRolusuario = Ext.create('Ext.form.Label', {
            text: me.etiquetas.lbRolUsuario,
            margins: '0 0 0 5'
        });

        this.cmbRolUsuario = Ext.create('TipoContrato.view.CmbRolUsuario');

        this.btnExpandir = Ext.create('Ext.Button', {
            tooltip: me.etiquetas.lbExpandir,
            action: 'expandir',
            iconCls: 'icondistra-expandir',
            disabled: false,
            context: 'treeEC'
        });

        this.btnContraer = Ext.create('Ext.Button', {
            tooltip: me.etiquetas.lbContraer,
            action: 'contraer',
            iconCls: 'icondistra-contraer',
            disabled: false,
            context: 'treeEC'
        });

        this.buscar = Ext.create('Ext.ux.SearchField', {
            clearTooltip: me.etiquetas.lbLimpiarFiltroETC,
            searchTooltip: me.etiquetas.lbBuscarETC,
            context: 'treeC',
            emptyText: me.etiquetas.lbCriterioBusqueda,
            disabled: true,
            maxLength: 255,
            maskRe: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,]*)+$/,
            regex: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,]*)+$/,
            keyMap: [
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

        this.btnHelp = Ext.create('Ext.Button', {
            xtype: 'button',
            iconCls: 'ayuda',
            action: 'help',
            hidden: true,
            disabled: true,
            refhelp: 'conf_tp_compartimentacion',
            text: me.etiquetas.lbBtnhelp,
            tooltip: me.etiquetas.qtipHistoric
        });

        this.tbar = [this.lbRolusuario, this.cmbRolUsuario, '->', this.btnExpandir, this.btnContraer, this.buscar, this.btnHelp];

        this.callParent();
    }
});