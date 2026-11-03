/*
 * Ext JS Library 2.1
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
//String
Ext.grid.filter.String_adaptadoFilter = Ext.extend(Ext.grid.filter.Filter, {
	updateBuffer: 500,	
     icon: '/lib/ExtJS/temas/default/images/iconos/find.png',
        	
	init: function() {	   
		var value = this.value = new Ext.menu.TextFieldItem({icon: this.icon});
	        value.on('keyup', this.onKeyUp, this);
                /*NUEVO*/
	        value.loadConfig(
                this.xtype,
                this.idTextField,
                this.anchor,
                this.fieldLabel,
                this.disabled,
                this.maskRe,
                this.regex,
                this.strEmptyText
            );                
		this.menu.add(value);		
		this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
	},
	
	onKeyUp: function(event) {
            
		if(event.getKey() == event.ENTER){
			this.menu.hide(false);                        
			return;
		}
                
                if(event.getKey() == event.ESC){
			return;
		}
		if(event.getKey() == event.DELETE){
		     this.value.setValue('');                    
		}

		if(event.getKey() == event.BACKSPACE){
                     //this.value.setValue('');
		}
           this.updateTask.delay(this.updateBuffer);
	},
	
	isActivatable: function() {
			return this.value.getValue().length > 0;
	},
	
	fireUpdate: function() {		
		if(this.active) {
			this.fireEvent("update", this);    }
		this.setActive(this.isActivatable());
	},
	
	setValue: function(value) {
		this.value.setValue(value);
		this.fireEvent("update", this);
	},
	
	getValue: function() {
		return this.value.getValue();
	},
	
	serialize: function() {	
		var args = {type: 'string', value: this.getValue()};
		this.fireEvent('serialize', args, this);
		return args;
	},
	
	validateRecord: function(record) {
		var val = record.get(this.dataIndex);
		if(typeof val != "string") {
			return this.getValue().length == 0;
    }
		return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
	}
});