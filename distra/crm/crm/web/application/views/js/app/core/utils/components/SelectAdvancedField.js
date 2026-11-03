Ext.define('Ext.ux.SelectAdvancedField', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.selectadvancedfield',
    validationEvent: false,
    validateOnBlur: true,
    selectOnFocus: true,
    hasSearch: false,
    searchOnClick: true,
    trigger1Cls: 'x-form-clear-trigger',
    trigger2Cls: 'x-form-search-trigger',
    trigger3Cls: 'x-form-trigger-first',
    clearTooltip: 'Limpiar filtro',
    searchTooltip: 'Buscar elementos',
    emptyText: 'Criterio a buscar...',
    enableKeyEvents: true,
    editable:false,
    width: 150,
    fnOnClear: Ext.emptyFn,
    fnOnSearch: Ext.emptyFn,
    initComponent: function (config) {
        Ext.apply(this, config);
        if (!this.id) { // definiendo un id si no fue definido en la configuracion
            var alreadyExist = Ext.DomQuery.select('span img[class*=x-form-search-trigger]');
            this.id = 'x-form-search' + (alreadyExist.length + 1);
        }


        if (!document.getElementById('style-searchfield')) {
            //agregando los estilos del componente
            var styleLeaf = document.createElement('style');
            styleLeaf.id = 'style-searchfield';
            styleLeaf.innerHTML = ".x-form-clear-trigger {background-image: url(../../views/images/clear.png) !important;}" +
            ".x-form-search-trigger {background-image: url(../../views/images/search.png) !important;}";

            document.body.appendChild(styleLeaf);
        }

        this.callParent();

        this.on({
            render: function () {
                this.triggers = this.triggerEl.elements;

                Ext.create('Ext.tip.ToolTip', {
                    target: this.getTriggerCmp(this.triggers[0]).dom,
                    html: this.clearTooltip
                });

                Ext.create('Ext.tip.ToolTip', {
                    target: this.getTriggerCmp(this.triggers[1]).dom,
                    html: this.searchTooltip
                });

                this.hideTrigger1();
                this.hideTrigger1(1);
            },
            specialkey: {
                fn: function (f, e) {
                    if (e.getKey() == e.ENTER || e.getKey() == 13) {
                        f.onTrigger2Click();
                    }
                    if (e.getKey() == e.ESC || e.getKey() == 27) {
                        e.stopEvent();
                        f.onTrigger1Click();
                    }
                },
                scope: this
            },
            keyup: function (f, e) {
                this.isValid();
                if (e.getKey() == e.BACKSPACE || e.getKey() == 8 || e.getKey() == e.DELETE || e.getKey() == 46) {
                    if (f.getRawValue().length == 0) {
                        this.onTrigger1Click();
                    }
                } else if (this.getRawValue().length > 0) {
                    this.showTrigger1();
                    if(!this.searchOnClick)this.showTrigger1(1);
                }
            },
            change: function (f, e) {
                this.isValid();
                if (this.getRawValue().length > 0) {
                    this.showTrigger1();
                    if(!this.searchOnClick)this.showTrigger1(1);
                }else{
                    this.onTrigger1Click();
                }
            },
            select: function(){
                if(this.searchOnClick)this.onTrigger2Click();
            },
            onclick1: this.onClick1,
            onclick2: this.onClick2
        });
    },
    onTrigger1Click: function () {
        this.fireEvent('onclick1',this);
    },
    onTrigger2Click: function () {
        this.fireEvent('onclick2',this);
    },
    onClick1:function(){
        this.focus();
        this.hideTrigger1();
        this.hideTrigger1(1);
        if (this.hasSearch) {
            this.el.dom.value = '';
            this.reset();
            if (typeof (this.fnOnClear) == 'function') {
                this.fnOnClear();
            }
            this.fireEvent('clear', this);
            this.hasSearch = false;
        } else {
            this.el.dom.value = '';
            this.reset();
        }
    },
    onClick2:function(){
        var v = this.getRawValue();
        if (v.length < 1) {
            this.onTrigger1Click();
            return;
        }
        this.hasSearch = true;
        this.showTrigger1();
        // this.setValue(this.getValue().trim());
        if (typeof (this.fnOnSearch) == 'function') {
            this.fnOnSearch();
        }
        this.fireEvent('search', this);
    },
    hideTrigger1: function (pos) {
        if (!pos) {
            pos = 0;
        }
        if (this.triggers[pos].dom.offsetParent) {
            Ext.get(this.triggers[pos].dom.offsetParent).hide();
            this.triggers[pos].dom.offsetParent.setAttribute('style', 'width: 17px; visibility: hidden;position:absolute');
        }
    },
    showTrigger1: function (pos) {
        if (!pos) {
            pos = 0;
        }
        Ext.get(this.triggers[pos].dom.offsetParent).show();
        this.triggers[pos].dom.offsetParent.setAttribute('style', 'width: 17px;');
    },
    getTriggerCmp: function (el) {
        return Ext.get(el.dom.offsetParent);
    },
    reset: function () {
        this.hideTrigger1();
        this.callParent();
    }
});
