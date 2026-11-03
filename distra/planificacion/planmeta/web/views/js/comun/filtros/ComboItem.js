/*
 * Ext JS Library 2.1 Copyright(c) 2006-2008, Ext JS, LLC. licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.menu.ComboItem = Ext.extend(Ext.menu.BaseItem, {
    itemCls: "x-menu-item",
    hideOnClick: false,
    text: '',
    contador: 0,
    initComponent: function() {
        Ext.menu.ComboItem.superclass.initComponent.call(this);
        this.addEvents('keyup');
    },
    onRender: function(container) {
        var s = container.createChild({
            cls: this.itemCls
                    // html: '<img src="' + this.icon + '"
                    // class="x-menu-item-icon" style="margin: 3px 3px 2px
                    // 2px;" />'
        });

        Ext.apply(this.config, {
            width: 125
        });
        this.editor.render(s);

        this.el = s;
       this.relayEvents(this.editor.el, ["keyup"]);

        if (Ext.isGecko) {
            s.setStyle('overflow', 'auto');
        }

        // Ext.menu.EditableItem.superclass.onRender.call(this,
        // container);
    },
    getValue: function() {
        return this.editor.getValue();
    },
     ocultar: function() {
         //console.log(this.editor);
    },
    setValue: function(value) {
        this.editor.setValue(value);
    },
    isValid: function(preventMark) {
        return this.editor.isValid(preventMark);
    },
    loadConfig: function(idcb, urlcb, idstore, valueFieldcb, displayFieldcb, st,
            obj, tpl, numeropeticiones, mascara, storegrid, width, autoload, mode,multiple) {
        if (idstore == undefined) {
            store = st;
        } else {
            store = new Ext.data.Store({
                method: 'POST',
                url: urlcb,
                autoLoad: (autoload == undefined) ? true : autoload,
                reader: new Ext.data.JsonReader({
                    id: idstore,
                    root: 'data'
                }, [{
                        name: valueFieldcb
                    }, {
                        name: displayFieldcb
                    }]),
                listeners: {
                    load: function(x, y, z) {
                        if (typeof (contador) != "undefined") {
                            contador++;
                            if (numeropeticiones && mascara) {
                                if (contador == numeropeticiones) {
                                    mascara.hide();
                                    if (storegrid) {
                                        storegrid.reload({
                                            params: {
                                                start: 0,
                                                limit: 20
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
        this.editor = this.editor || (multiple==1) ? new Ext.ux.form.LovCombo({
        //xtype: 'combo',
        displayField: displayFieldcb,
        id: idcb,
        valueField: valueFieldcb,
        store: store,
        autoCreate: true,
        typeAhead: true,
        //hiddenName: 'sustimp',
        //triggerAction: 'all',
        //editable: true,
        //allowBlank: false,
        //listWidth: 350,
        anchor: '95%',
        mode: (mode != undefined) ? mode : 'local',
        // tabIndex: 17,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
                select: function(record, index) {
                        obj.ocultar(this);    
                        obj.setActive(true);
                        obj.fireEvent("update", obj);

                }
            }
    }):new Ext.form.ComboBox({
            id: idcb,
            emptyText: 'Seleccione..',
            store: store,
            valueField: valueFieldcb,
            displayField: displayFieldcb,
            anchor: '95%',
            mode: (mode != undefined) ? mode : 'local',
            editable: true,
            width: width != undefined ? width : 150,
            triggerAction: 'all',
            typeAhead: true,
            forceSelection: true,
            validateOnBlur: true,
            selectOnFocus: true,
            tpl: tpl,
            listeners: {
                select: function(record, index) {
//console.info(record)
//console.info(index)
//console.info(this)
//record.set(this.checkField, !record.get(this.checkField));
//                    if(obj.multiple){
//                        alert('dedede')
//Modificar esto para que marque los itms seleccionados
                        // .toggle checked field
//                        record.set(this.checkField, !record.get(this.checkField));
//
//                        // display full list
//                        if (this.store.isFiltered()) {
//                            this.doQuery(this.allQuery);
//                        }
//
//                        // set (update) value and fire
//                        this.fireEvent('select', this, record, index); //event
//                        this.setValue(this.getCheckedValue());
//                    }else {
                        obj.setActive(obj.isActivatable());
                        obj.fireEvent("update", obj);
//                    }
                }
            },
            loadingText: 'Cargando...'
        });
        if (this.text) {
            this.editor.setValue(this.text);
        }

    }
});