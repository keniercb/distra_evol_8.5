Ext.define('ReporteContratacion.view.FechaTrigger',{
    extend: 'Ext.form.field.Date',
    anchor: '100%',
    editable:false,
    width:140,
    limpiarButton:true,
    // maxValue: new Date(),
    trigger2Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    afterRender: function(){
        // this.triggerCell.item(0).setDisplayed(false);
        this.triggerCell.item(1).setDisplayed(false);
    },
    onTrigger2Click : function(){
        // this.triggerCell.item(0).setDisplayed(false);
        this.triggerCell.item(1).setDisplayed(false);
        this.reset()
    },
    // listeners: {
    //      'select': function( field, value, eOpts ){
    //          field.triggerCell.item(1).setDisplayed(true);
    //      }
    // },
    initComponent: function(){
        var self = this;

        if(self.itemId==null)self.itemId=self.parametro;
        if(self.limpiarButton)
            self.on('change', function( yo, valor ){
                // yo.triggerCell.item(0).setDisplayed(valor!=null);
                yo.triggerCell.item(1).setDisplayed(valor!=null);
            });
        self.callParent();
    }

});