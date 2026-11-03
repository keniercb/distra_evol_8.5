/*
 * Ext JS Library 2.1
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
//String
Ext.grid.filter.ListadoFilter = Ext.extend(Ext.grid.filter.Filter, {
    updateBuffer: 500,
     text: '',
     mult : 0,
//    icon: '/img/relleno.png',

    init: function() {

        var value = this.value = new Ext.menu.ComboItem();
        value.on('keyup', this.onKeyUp, this);
     

        value.loadConfig(
                this.idcombo,
                this.urlcb,
                this.idstore,
                this.valueFieldcb,
                this.displayFieldcb,
                this.st,
                this,
                this.tpl,
                this.numeropeticiones,
                this.mascara,
                this.storegrid,
                this.width,
                this.autoload,
                this.mode,
                this.multiple = this.mult
                );

        this.menu.add(value);

        this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
    },
    onKeyUp: function(event) {
        if (event.getKey() == event.ENTER) {
            this.menu.hide(false);
            return;
        }
        if (event.getKey() == event.DELETE) {
            this.value.setValue('');
        }
        if (event.getKey() == event.BACKSPACE) {
            this.value.setValue('');
        }
        this.updateTask.delay(this.updateBuffer);
    },
    isActivatable: function() {
        return this.value.getValue().length > 0;
    },
    fireUpdate: function() {
        if (this.active) {
            this.fireEvent("update", this);
        }
        this.setActive(this.isActivatable());
    },
    setValue: function(value) {
        this.value.setValue(value);
        this.fireEvent("update", this);
    },
    ocultar:function(combo)
    {
       combo.list.hide();
    },
    getValue: function() {
        return this.value.getValue();
    },
    serialize: function() {
        var args = {
            type: 'string',
            value: this.getValue()
        };
        this.fireEvent('serialize', args, this);
        return args;
    },
    validateRecord: function(record) {
        var val = record.get(this.dataIndex);
        if (typeof val != "string") {
            return this.getValue().length == 0;
        }
        return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
    }/*
    mostrar: function(){
          this.menu.hide(false);
    }*/
});
