Ext.define('PerfilesClientes.view.Cuestionario', {
    extend: 'Ext.ux.ComboFieldSet',
    alias: 'widget.Cuestionario',

    initComponent: function () {
        this.createInitialConfig();
        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        console.log(me.index)
        me.checkBoxEditCuestionario = Ext.create('Ext.form.field.Checkbox', {
            //xtype: 'checkboxfield',
            action: 'editcuestionario',
            boxLabel: me.etiquetas.lbEditarCuestionario,
            name: 'editarcuestionario' + me.index
        });
        me.checkBoxGuardarCuestionarioComo = Ext.create('Ext.form.field.Checkbox', {
            //xtype: 'checkboxfield',
            disabled: true,
            action: 'guardarcuestionariocomo',
            boxLabel: me.etiquetas.lbGuardarCuestionarioComo,
            name: 'guardarcuestionariocomo' + me.index
        });
        me.newNameCuestionario = Ext.create('Ext.form.field.Text', {
            //xtype: 'textfield',
            name: 'newcuestionario' + me.index,
            disabled: true,
            allowBlank: true,
            width: 300
        });
        me.btnAddPregunta = Ext.create('Ext.button.Button', {
            //xtype: 'button',
            iconCls: 'adicionar',
            tooltip: me.etiquetas.lbAddPregunta,
            margin: '3 0 0 5',
            action: 'addPregunta',
            width: 21,
            disabled: true,
            height: 21,
            border: 0
        });
        me.myPanel = Ext.create('Ext.panel.Panel', {
            bodyStyle: 'background:#DFE9F6;',
            border: false,
            layout: 'column',
            disabled: true,
            defaults: {
                columnWidth: 1
            },
            margin: 0,
            items: [],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'label',
                    text: me.etiquetas.lbPregunta
                }, '->', {
                    xtype: 'label',
                    text: me.etiquetas.lbRespuestas
                }]
            }, {
                xtype: 'toolbar',
                dock: 'bottom',
                items: [
                    me.checkBoxEditCuestionario,
                    '-',
                    me.checkBoxGuardarCuestionarioComo,
                    me.newNameCuestionario,
                    '->',
                    me.btnAddPregunta
                ]
            }]
        });
        me.hfcuestionario = Ext.create('Ext.form.field.Hidden', {
            name: 'idcuestionario' + me.index
        });
        me.cmbCuestionario = Ext.create('Ext.ux.CmbSelectField', {
            //xtype: 'cmbselectfield',
            name: 'cuestionario' + me.index,
            mapping: 'NomCuestionarioperfil.nombre',
            localId: 'idcuestionario',
            module: 'NomClienteProveedor',
            displayField: 'cuestionario',
            valueField: 'idcuestionario',
            noactions: false,
            allowBlank: false,
            width: 300,
            forceSelection: true,
            context: 'perfilesclientesmainwindowcuestionario',
            /*filters: {
             idtipo: 1,
             idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun
             },*/
            controller: 'perfilesclientesmainwindow'
        });
        me.title = me.etiquetas.lbCuestionario;
        me.collapsible = true;
        me.labelAlign = 'top';
        me.layout = 'column';
        me.columnWidth = 1;
        //margin: '5 0 10 0',
        me.border = true;
        //height: 360,
        me.autoScroll = true;
        //collapsed: me.action == 'add',
        //cls: 'images-view',
        me.xtypejojo = 'panel';
        me.otherjojo = true;
        me.cfgjojo = {
            bodyStyle: 'background:#DFE9F6;',
            border: false,
            //margin: '3 0 0 0',
            items: [
                me.hfcuestionario,
                me.cmbCuestionario,
                {
                    xtype: 'button',
                    iconCls: 'icondistra-adicionar',
                    action: 'addCuestionario',
                    width: 21,
                    height: 21,
                    border: 0,
                    tooltip: this.etiquetas.lbAddCuestionario,
                    margin: '0 0 0 5'
                },
                {
                    xtype: 'button',
                    iconCls: 'icondistra-eliminar',
                    action: 'delCuestionario',
                    width: 21,
                    height: 21,
                    border: 0,
                    hide: true,
                    tooltip: this.etiquetas.lbDelCuestionario,
                    margin: '0 0 0 5'
                }
            ]
        };
        me.layout = 'column';
        me.defaults = {
            bodyStyle: 'background:#DFE9F6;',
            margin: '0 5 0 5',
            columnWidth: 1,
            layout: 'column',
            border: false
        };
        me.items = [
            me.myPanel
        ];
    }
});
