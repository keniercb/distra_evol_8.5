Ext.Conf.ModContb.WinSelectSubsistExport = Ext.extend(Ext.Window, {
	modal: true,
    closeAction: 'destroy',
    constrain: true,
    resizable:false,
    layout: 'fit',
    border : false,
	height: 370,
	width: 250,
    initComponent: function(){
		var me = this;
		
		me.title = me.idioma.titleWinExportSubsistema;
		
        me.initButtons();

        me.initGridSubsystems();

        Ext.Conf.ModContb.WinSelectSubsistExport.superclass.initComponent.call(this);
		
		me.on('show', function(){
			me.subsystemGrid.getSelectionModel().clearSelections();
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
    initGridSubsystems: function(){
        var me = this;
		
		me.subsystemStore = new Ext.data.SimpleStore({
			fields: [
			   {name: 'idsubsystem'},
			   {name: 'denominacion'},
			]
		});
		
		me.subsystemStore.loadData(me.listData);
		
		var sm = new Ext.grid.CheckboxSelectionModel();
		
		me.subsystemGrid = new Ext.grid.GridPanel({
			store: me.subsystemStore,
			sm: sm,
			viewConfig : {
				forceFit: true,
				deferEmptyText: me.idioma.emptyDataGrid,
				emptyText : me.idioma.emptyDataGrid,
			},
			columns: [
				sm,
				{header: me.idioma.lbColSubsistema, sortable: true, dataIndex: 'denominacion'},
			],
			stripeRows: true,
		});
		
		sm.on('selectionchange', function(sm){
			this.btnAccept[(sm.getCount()>0)?'enable':'disable']();
		}, this);
		
		me.items = [me.subsystemGrid];
    }
});