Ext.Conf.ModContb.WinImportModelo = Ext.extend(Ext.Window, {
	modal: true,
    closeAction: 'hide',
    constrain: true,
    autoHeight: true,
    resizable:false,
    layout: 'fit',
    border : false,
    initComponent: function(){
		var me = this;
		
		me.title = me.idioma.titleWinImportModelo;
		
        me.initButtons();

        me.initForm();

        Ext.Conf.ModContb.WinImportModelo.superclass.initComponent.call(this);
		
		me.on('show', function(){
			me.form.getForm().reset();
		}, me);
    },
    initButtons: function(){
        var me = this;

        me.btnCancel = new Ext.Button({
            iconCls : 'cancelar', 
            text : me.idioma.btncancelar,
            tooltip : me.idioma.tooltipbtncancelar,
        });

        me.btnAccept = new Ext.Button({
            iconCls : 'aceptar', 
            text : me.idioma.btnaceptar,
			disabled: true,
            tooltip : me.idioma.tooltipbtnaceptar,
        });

        me.buttons = [me.btnCancel, me.btnAccept];
    },
    initForm: function(){
        var me = this;
		
		this.form = new Ext.FormPanel({
			fileUpload: true,
			frame : true,
            labelAlign: 'top',
            bodyStyle : {padding: '10px 10px 10px 10px'},
            width :250,
            autoHeight : true,
			items : [
				{
					xtype: 'fileuploadfield',
					emptyText: me.idioma.emptydUploadField,
					fieldLabel: me.idioma.lbUploadField,
					name: 'modelos',
					anchor: '100%',
					regex : /\.(json)$/i,
					regexText: me.idioma.errorMsgInvalidUploadField,
					allowBlank: false,
					blankText: me.idioma.msgInvalido,
					buttonCfg: {
						text: '',
						//iconCls: 'upload-icon'
					}
				}
			]
		});
		me.items = [me.form];
    }
});