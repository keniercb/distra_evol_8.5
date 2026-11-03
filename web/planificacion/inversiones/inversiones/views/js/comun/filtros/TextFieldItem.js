/*
 * Ext JS Library 2.1
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.menu.TextFieldItem = Ext.extend(Ext.menu.BaseItem, {
    itemCls : "x-menu-item",
    hideOnClick: false,
   text:'',
    initComponent: function(){
      Ext.menu.TextFieldItem.superclass.initComponent.call(this);
    	this.addEvents('keyup');
    },
    
    onRender: function(container){
       
        var s = container.createChild({
        	cls: this.itemCls,
        	html: '<img src="' + this.icon + '" class="x-menu-item-icon" style="margin: 3px 3px 2px 2px;" />'
        });
        
        Ext.apply(this.config, {width: 125});
        this.editor.render(s);
        
        this.el = s;
        this.relayEvents(this.editor.el, ["keyup"]);
        
      if(Ext.isGecko) {
    			s.setStyle('overflow', 'auto');
        }
			
     Ext.menu.TextFieldItem.superclass.onRender.call(this, container);
    },
    
    getValue: function(){
    	return this.editor.getValue();
    },
    
    setValue: function(value){
	    	this.editor.setValue(value);
    },
    
    isValid: function(preventMark){
    	return this.editor.isValid(preventMark);
    },
    
   loadConfig:function(xtype,idTextField,anchor,fieldLabel,disabled,maskRe,regex,strEmptyText){

   this.editor = this.editor ||
    new Ext.form.TextField({
        xtype:xtype, //'numberfield',
        id:idTextField,//'preciototal',
        anchor:anchor, //'95%',
        fieldLabel:fieldLabel,//'asd',
        disabled:disabled,
        maskRe:maskRe,
        regex:regex,
       enableKeyEvents:true,
       emptyText:strEmptyText //'0.00'
    });
    if(this.text) {
	this.editor.setValue(this.text);
      }      
}
});