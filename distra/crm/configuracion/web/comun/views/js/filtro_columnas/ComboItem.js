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
    initComponent: function () {
        Ext.menu.ComboItem.superclass.initComponent.call(this);
        this.addEvents('keyup');
    },

    onRender: function (container) {
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

    getValue: function () {
        return this.editor.getValue();
    },

    setValue: function (value) {
        this.editor.setValue(value);
    },

    isValid: function (preventMark) {
        return this.editor.isValid(preventMark);
    },

    loadConfig: function (idcb, urlcb, idstore, valueFieldcb, displayFieldcb, st, obj, numeropeticiones, mascara, storegrid, width, autoload, mode) {
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
                }, [
                    {
                        name: valueFieldcb
                    },
                    {
                        name: displayFieldcb
                    }
                ]),
                listeners: {
                    load: function (x, y, z) {
                        if (typeof(contador) != "undefined") {
                            contador ++;
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
            })
        }
        this.editor = this.editor || new Ext.form.ComboBox({
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
            listeners: {
                select: function () {
                    obj.setActive(obj.isActivatable());
                    obj.fireEvent("update", obj);
                }
            }
        });
        if (this.text) {
            this.editor.setValue(this.text);
        }

    }
});
