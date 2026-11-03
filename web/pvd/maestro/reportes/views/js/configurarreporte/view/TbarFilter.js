Ext.ns('Maestro.ConfigurarReporte.view');

Maestro.ConfigurarReporte.view.TbarFilter = Ext.extend( Ext.Toolbar, {
	initComponent: function() {
		var me = this,
			idiom = Maestro.ConfigurarReporte.idiom;

		me.btnInsert = new Ext.Button({
			text: idiom.lbBtnInsert,
            tooltip: idiom.lbBtnTtpInsertFilter,
            iconCls : 'adicionar',
            menu: me.getMenuFilter()
        });

        me.btnUpdate = new Ext.Button({
			text: idiom.lbBtnUpdate,
            tooltip: idiom.lbBtnTtpUpdatetFilter,
            iconCls : 'modificar',
        });

        me.btnDelete = new Ext.Button({
			text: idiom.lbBtnDelete,
            tooltip: idiom.lbBtnTtpDeleteFilter,
            iconCls : 'eliminar',
        });

        me.items = [me.btnInsert, me.btnUpdate, me.btnDelete];

		Maestro.ConfigurarReporte.view.TbarFilter.superclass.initComponent.call(this);
    },
    setEnableBtn: function(enableInsert, enableUpdate, enableDelete){
    	this.btnInsert[(enableInsert)?'enable':'disable']();
        this.btnUpdate[(enableUpdate)?'enable':'disable']();
        this.btnDelete[(enableDelete)?'enable':'disable']();
    },
    getMenuFilter: function(){
        var me = this,
        idiom = Maestro.ConfigurarReporte.idiom;

        me.menuTypes = new Ext.menu.Menu({
            items: [
                {
                    text: idiom.lbActionFilterText,
                    filterType: 1,
                },{
                    text: idiom.lbActionFilterDate,
                    filterType: 2,
                },{
                    text: idiom.lbActionFilterNumeric,
                    filterType: 3,
                },{
                    text: idiom.lbActionFilterNomenclador,
                    filterType: 4,
                },{
                    text: idiom.lbActionFilterEstructura,
                    filterType: 5,
                }
            ]
        });

        return me.menuTypes;
    },
});