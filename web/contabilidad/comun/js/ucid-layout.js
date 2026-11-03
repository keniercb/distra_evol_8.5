/*
 *
 * @author Alejandro Mengana Perez
 * @package Portal
 * @subpackage Portal
 * @copyright UCID-ERP Cuba
 * @version 1.0-0
 */
Ext.ns('Ext.layout');

Ext.layout.CenterLayout = Ext.extend(Ext.layout.FitLayout, {
	// private
    setItemSize : function(item, size){
        this.container.addClass('layout-center');
        item.addClass('layout-center-item');
        if(item && size.height > 0){
            if(item.width){
                size.width = item.width;
            }
            item.setSize(size);
        }
    }
});
Ext.Container.LAYOUTS['center'] = Ext.layout.CenterLayout;



Ext.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize:true,

    // private
    isValidParent : function(c, target){
        return c.getEl().dom.parentNode == this.innerCt.dom;
    },

    // private
    onLayout : function(ct, target){
        var rs = ct.items.items, len = rs.length, r, i;

        if(!this.innerCt){
            target.addClass('row-layout-ct');
            this.innerCt = target.createChild({cls:'x-row-inner'});
        }
        this.renderAll(ct, this.innerCt);

        var size = target.getViewSize();

        if(size.width < 1 && size.height < 1){ // display none?
            return;
        }

        var h = size.height - target.getPadding('tb'),
            ph = h;

        this.innerCt.setSize({height:h});
        
        // some rows can be percentages while others are fixed
        // so we need to make 2 passes
        
        for(i = 0; i < len; i++){
            r = rs[i];
            if(!r.rowHeight){
                ph -= (r.getSize().height + r.getEl().getMargins('tb'));
            }
        }

        ph = ph < 0 ? 0 : ph;

        for(i = 0; i < len; i++){
            r = rs[i];
            if(r.rowHeight){
                r.setSize({height: Math.floor(r.rowHeight*ph) - r.getEl().getMargins('tb')});
            }
        }
    }
    
    /**
     * @property activeItem
     * @hide
     */
});
Ext.Container.LAYOUTS['row'] = Ext.layout.RowLayout;
