Ext.ns('Maestro.ConfigurarReporte.view');

Maestro.ConfigurarReporte.view.CrudFilter = Ext.extend(Ext.Window, {
	modal: true,
    closeAction: 'hide',
    constrain: true,
    resizable:false,
    layout: 'fit',
    border : false,
    width: 500,
    height: 450,
    initComponent: function(){
        var me = this,
            viewsRequired = (me.required)?me.required.views : null;

        me.title= Maestro.ConfigurarReporte.idiom.blTitleListFilter;
        
        me.initButtons();

        this.addEvents('resetWinElements');

        me.items = [viewsRequired.listfilter];

        Maestro.ConfigurarReporte.view.CrudFilter.superclass.initComponent.call(this);
    },
    initButtons: function(){
        var me = this,
            idiom = Maestro.ConfigurarReporte.idiom;

        me.btnClose = new Ext.Button({
            iconCls : 'cerrar', 
            text : idiom.lbBtnCerrar,
            tooltip : idiom.lbTtpBtnCerrar,
        });

        me.buttons = [me.btnClose];
    },
    show: function(idreporte){
        Maestro.ConfigurarReporte.view.CrudFilter.superclass.show.call(this);
        this.fireEvent('resetWinElements', idreporte);
    }
});