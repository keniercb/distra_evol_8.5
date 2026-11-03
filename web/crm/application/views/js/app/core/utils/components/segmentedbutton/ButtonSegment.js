/**
 * @class Ext.ux.container.ButtonSegment
 * @extends Ext.container.ButtonGroup
 * 
 * @author Harald Hanek (c) 2011-2012,
 * modified: Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 */

Ext.define('CRM.ux.segmentedbutton.ButtonSegment', {
    extend: 'Ext.container.ButtonGroup',
    alias: 'widget.buttonsegment',

    baseCls: Ext.baseCSSPrefix + 'sbtn',

    buttonCls: Ext.baseCSSPrefix + 'sbtn',
    
    unstyled: true,
    
    frame: false,
    
    initComponent: function()
    {
        var me = this;
        this.createCss();
        
        me.callParent(arguments);
        
        me.activeItem = (me.activeItem + 1 > me.items.length) ? 0 : me.activeItem;
        
        me.items.each(function(el, c)
        {
            if(me.items.length === 1)
                el.addCls(me.buttonCls +'-single');
            else
            {
                var cls = c == 0 ? me.buttonCls +'-first' : (c == me.items.length - 1 ? me.buttonCls +'-last' : me.buttonCls +'-item');
                el.addCls(cls);
            }
        });

    },

    onBeforeAdd: function(component)
    {
        /* NO BORRAR ESTA DECLARACION PORQUE ES NECESARIA */
        var me = this;
        if(!this.items.length){
            component.addCls(this.buttonCls +'-single');
        } else {
            me.items.each(function(el, c)
            {
                el.removeCls([me.buttonCls +'-single',  me.buttonCls +'-first', me.buttonCls +'-last'])
                var cls = c == 0 ? me.buttonCls +'-first' : me.buttonCls +'-item';
                el.addCls(cls);
            });
            component.addCls(this.buttonCls +'-last')
        }

    },

    createCss: function(){
        var style = document.createElement('style');
        style.innerHTML = ".x-sbtn .x-btn{margin-right: 0px;margin-left: 0px;} " +
        ".x-sbtn .x-sbtn-first{-moz-border-radius: 3px 0px 0px 3px;-webkit-border-radius: 3px 0px 0px 3px;" +
        "-o-border-radius: 3px 0px 0px 3px;-ms-border-radius: 3px 0px 0px 3px;" +
        "-khtml-border-radius: 3px 0px 0px 3px;border-radius: 3px 0px 0px 3px;margin-left: 0px;} " +
        ".x-sbtn .x-sbtn-last{-moz-border-radius: 0px 3px 3px 0px;-webkit-border-radius: 0px 3px 3px 0px;" +
        "-o-border-radius: 0px 3px 3px 0px;-ms-border-radius: 0px 3px 3px 0px;-khtml-border-radius: 0px 3px 3px 0px;" +
        "border-radius: 0px 3px 3px 0px;border-left: none;margin-right: 0px;} .x-sbtn .x-sbtn-item{-moz-border-radius: 0px;" +
        "-webkit-border-radius: 0px;-o-border-radius: 0px;-ms-border-radius: 0px;-khtml-border-radius: 0px;" +
        "border-radius: 0px;border-left: none;} .x-sbtn .x-sbtn-item td.x-frame-tl,.x-sbtn .x-sbtn-item td.x-frame-ml," +
        ".x-sbtn .x-sbtn-item td.x-frame-bl,.x-sbtn .x-sbtn-item td.x-frame-tr,.x-sbtn .x-sbtn-item td.x-frame-mr," +
        ".x-sbtn .x-sbtn-item td.x-frame-br{display: none;} .x-sbtn .x-sbtn-item td.x-frame-tc,.x-sbtn .x-sbtn-item td.x-frame-mc," +
        ".x-sbtn .x-sbtn-item td.x-frame-bc{padding-right: 3px;padding-left: 3px;border-right: 1px solid #D1D1D1;}" +
        ".x-sbtn .x-sbtn-last td.x-frame-tl,.x-sbtn .x-sbtn-last td.x-frame-ml,.x-sbtn .x-sbtn-last td.x-frame-bl{display: none;}" +
        ".x-sbtn .x-sbtn-last td.x-frame-tc,.x-sbtn .x-sbtn-last td.x-frame-mc,.x-sbtn .x-sbtn-last td.x-frame-bc{padding-left: 3px;}" +
        ".x-sbtn .x-sbtn-first td.x-frame-tr,.x-sbtn .x-sbtn-first td.x-frame-mr,.x-sbtn .x-sbtn-first td.x-frame-br{display: none;}" +
        ".x-sbtn .x-sbtn-first td.x-frame-tc,.x-sbtn .x-sbtn-first td.x-frame-mc,.x-sbtn .x-sbtn-first td.x-frame-bc{padding-right: 3px;border-right: 1px solid #D1D1D1;}" +
        ".x-sbtn .x-sbtn-single{ }";
        document.body.appendChild(style);
    }
});