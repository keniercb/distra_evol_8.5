Ext.define('Reportes.view.WinEditModulo', {
    extend: 'Ext.window.Window',
    alias: 'widget.wineditmodulo',
    frame: false,
    margin: false,
    border: false,
    width: 350,
    closable : true,
    closeAction: 'hide',
    modal: true,
    actionInsert: true,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.initBody();

        me.initButtons();

        me.callParent();

        me.formModulo.on('validitychange', function(form, valid){
            me.down('button[action=aplicar]').setDisabled(!valid);
            me.down('button[action=aceptar]').setDisabled(!valid);
        }, me);
    },
    initBody: function(){
        var me = this;

        me.formModulo = Ext.create('Ext.form.Panel', {
            border: false,
            bodyStyle : {padding: '10px 10px 10px 10px'},
            frame: true,
            fieldDefaults: {
                labelAlign: 'top'
            },
            layout: 'column',
            items: [{
                xtype: 'textfield',
                columnWidth: 0.4,
                margin: '0 10 0 0',
                fieldLabel: me.etiquetas.lbIdentificador,
                name: 'identificador',
                anchor: '90%',
                regex: /^[0-9a-zA-Z]+$/,
                regexText: me.etiquetas.vAlphanum,
                maxLength: 50,
                maxLengthText: me.etiquetas.validationMaxLength_50,
                allowBlank: false,
                blankText: me.etiquetas.vBlankText
            },{
                xtype: 'textfield',
                columnWidth: 0.6,
                fieldLabel: me.etiquetas.lbDenominacion,
                name: 'denominacion',
                anchor: '90%',
                regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
                regexText: me.etiquetas.validationOnlyAlphaSpacer,
                maxLength: 150,
                maxLengthText: me.etiquetas.validationMaxLength_150,
                allowBlank: false,
                blankText: me.etiquetas.vBlankText,
            },{
                xtype: 'hidden',
                name: 'idmodulo',
                value: 0
            }]
        });

        me.items = [me.formModulo];
    },

    initButtons: function(){
        var me = this;

        me.buttons = [
            {
                text: me.etiquetas.lbBtnCancel,
                iconCls: 'icondistra-cancelar',
                tooltip: me.etiquetas.qtipCancel,
                action: 'cerrar'
            },{
                text: me.etiquetas.lbBtnApply,
                iconCls: 'icondistra-aplicar',
                tooltip: me.etiquetas.qtipApply,
                disabled: true,
                action: 'aplicar'
            },{
                text: me.etiquetas.lbBtnAccept,
                iconCls: 'icondistra-aceptar',
                tooltip: me.etiquetas.qtipAccept,
                disabled: true,
                action: 'aceptar'
            }
        ];
    },
    initState: function(){
        var me = this;
        me.setTitle( me.etiquetas[(me.actionInsert)?'titleWinAdicionarModulo':'titleWinModificarModulo'] );
        me.down('button[action=aplicar]').setVisible(me.actionInsert);
    },
    resetComponents: function(){
        var me = this;
        me.formModulo.getForm().reset();
        me.formModulo.down('field:first').focus(false, 500);
    },
    loadValues: function(val){
        var me = this;
        me.formModulo.getForm().loadRecord(val);
    },
    setActionInsert: function(action){
        this.actionInsert = !!action;
    },
    getActionInsert: function(){
        return this.actionInsert;
    },
    show:function(){
        var me = this;

        me.initState();

        me.callParent();

        me.resetComponents();
    }
});
