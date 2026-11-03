/**
 * @autor Ernesto Herrera Morales
 * @description Un PagingToolbar para un store local.
 */
Ext.ux.data.LocalPagingToolbar = Ext.extend(Ext.PagingToolbar, {    
    initComponent: function(){        
        Ext.ux.data.LocalPagingToolbar.superclass.initComponent.call(this);
    },
    updateInfo : function(){
        if(this.displayEl){
            var count = this.store.getCount();
            var msg = count == 0 ?
                this.emptyMsg :
                String.format(
                    this.displayMsg,
                    this.cursor+1, this.cursor+count, count
                );
            this.displayEl.update(msg);
        }
    }
})
