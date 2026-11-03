Ext.ns('Maestro.ConfigurarReporte.view');

Maestro.ConfigurarReporte.view.TbarModule = Ext.extend( Ext.Toolbar, {
	initComponent: function() {
		var me = this,
			idiom = Maestro.ConfigurarReporte.idiom;

		me.btnInsert = new Ext.Button({
			text: idiom.lbBtnInsert,
            tooltip: idiom.lbBtnTtpInsertModule,
            iconCls : 'adicionar',
        });

        me.btnUpdate = new Ext.Button({
			text: idiom.lbBtnUpdate,
            tooltip: idiom.lbBtnTtpUpdatetModule,
            iconCls : 'modificar',
        });

        me.btnDelete = new Ext.Button({
			text: idiom.lbBtnDelete,
            tooltip: idiom.lbBtnTtpDeletetModule,
            iconCls : 'eliminar',
        });

        me.items = [me.btnInsert, me.btnUpdate, me.btnDelete/*,{
            text:'btnprueba',
            handler: function(){
                var aux = new Maestro.Example.WinAnalisis();
                aux.show();
            }
        }*/];

		Maestro.ConfigurarReporte.view.TbarModule.superclass.initComponent.call(this);
    },
    setEnableBtn: function(enableInsert, enableUpdate, enableDelete){
    	this.btnInsert[(enableInsert)?'enable':'disable']();
        this.btnUpdate[(enableUpdate)?'enable':'disable']();
        this.btnDelete[(enableDelete)?'enable':'disable']();
    }
});