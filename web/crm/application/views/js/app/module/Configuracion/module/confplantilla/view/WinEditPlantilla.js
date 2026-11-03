Ext.define('ConfPlantilla.view.WinEditPlantilla', {
    extend: 'Ext.window.Window',
    alias: 'widget.wineditplantilla',
    frame: false,
    margin: false,
    border: false,
    width: 1000,
    closable : true,
    closeAction: 'hide',
    modal: true,
    actionInsert: true,
    resizable: false,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.initBody();

        me.initButtons();

        me.callParent();

        Ext.TaskManager.start({
            run: this.checkWindow.bind(me),
            interval: 100,
            scope: this
        });
    },
    initBody: function(){
        var me = this;

        me.formPlantilla = Ext.create('Ext.form.Panel', {
            border: false,
            bodyStyle : {padding: '10px 10px 10px 10px'},
            frame: true,
            fieldDefaults: {
                labelAlign: 'top'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: me.etiquetas.lbDenominacion,
                name: 'denominacion',
                regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
                regexText: me.etiquetas.validationOnlyAlphaSpacer,
                maxLength: 100,
                maxLengthText: me.etiquetas.validationMaxLength_100,
                allowBlank: false,
                blankText: me.etiquetas.vBlankText,
            },{
                xtype: 'label',
                text: me.etiquetas.lbEstructura+':',
                margin: '5 0 0 0'
            }, Ext.create('ConfPlantilla.view.DvEstructura'),{
                xtype: 'hidden',
                name: 'idplantilla',
                value: 0
            }]
        });

        me.items = [me.formPlantilla];
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
        me.setTitle( me.etiquetas[(me.actionInsert)?'titleWinAdicionarPlantilla':'titleWinModificarPlantilla'] );
        me.down('button[action=aplicar]').setVisible(me.actionInsert);
    },
    resetComponents: function(){
        var me = this,
            dataview = me.formPlantilla.items.get(2).down('dataview');

        me.formPlantilla.getForm().reset();
        me.formPlantilla.down('field:first').focus(false, 500);
        dataview.getStore().removeAll();
    },
    loadValues: function(val){
        var me = this,
            estrucStore = me.formPlantilla.items.get(2).down('dataview').getStore();

        me.formPlantilla.getForm().loadRecord(val);
        estrucStore.loadData(val.get('estructura'));
    },
    getValues: function(){
        var me = this,
            values,
            dataview = me.formPlantilla.items.get(2).down('dataview'),
            estruc = new Array();

        dataview.getStore().each(function(record){
            estruc.push(record.getData());
        }, this);

        values = me.formPlantilla.getForm().getValues();
        values.estructura = estruc;

        return values;
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
    },
    checkWindow: function () {
        var me= this,
            form = me.formPlantilla.getForm(),
            dataview = me.formPlantilla.items.get(2).down('dataview'),
            invalid = form.hasInvalidField() ||  dataview.getStore().getCount() == 0;

        me.down('button[action=aplicar]').setDisabled(invalid);
        me.down('button[action=aceptar]').setDisabled(invalid);
    }
});
