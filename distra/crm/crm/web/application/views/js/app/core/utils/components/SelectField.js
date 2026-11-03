Ext.define('Ext.ux.SelectField', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.selectfield',
    validationEvent: false,
    validateOnBlur: true,
    selectOnFocus: true,
    trigger1Cls: 'x-form-clear-trigger',
    trigger2Cls: 'x-form-choose-trigger',
    clearTooltip: 'Quitar elementos',
    chooseTooltip: 'Seleccionar elementos',
    enableKeyEvents: true,
    multiSelect: false,
    fnOnClear: Ext.emptyFn,
    fnOnSelect: Ext.emptyFn,
    defaultValues: [],
    navigateKeys: [9, 27, 35, 36, 37, 38, 39, 40],
    initComponent: function (config) {
        Ext.apply(this, config);
        if (!this.id) { // definiendo un id si no fue definido en la configuracion
            var alreadyExist = Ext.DomQuery.select('span img[class*=x-form-search-trigger]');
            this.id = 'x-form-search' + (alreadyExist.length + 1);
        }

        if(!document.getElementById('style-selectfield')){

            //agregando los estilos del componente
            var styleLeaf = document.createElement('style');
            styleLeaf.id = 'style-selectfield';

            styleLeaf.innerHTML = ".x-form-choose-trigger" +
            "{background-image: url(../../views/images/choose-trigger.gif) !important;}";

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
                    html: this.chooseTooltip
                });

                this.hideTrigger1();
            },
            keydown: function (f, e) {
                if (e.getKey() == e.ENTER || e.getKey() == 13) {
                    f.onTrigger2Click();
                } else if (this.navigateKeys.indexOf(e.getKey()) == -1) {
                    e.stopEvent();
                }
            },
            keyup: function (f, e) {
                if (f.getRawValue().length == 0) {
                    this.onTrigger1Click();
                }
            },
            change: this.onChangeValue
        });
    },
    onTrigger1Click: function () {
        if(!this.fireEvent('beforeclear',this)){
            return;
        }
        this.hideTrigger1();
        this.el.dom.value = '';
        this.setValue('');
        if (typeof (this.fnOnClear) == 'function') {
            this.fnOnClear();
        }
        this.fireEvent('clear', this);
        this.isValid();
    },
    onTrigger2Click: function () {
        if(!this.fireEvent('beforeselect',this)){
            return;
        }
        if (typeof (this.fnOnSelect) == 'function') {
            this.fnOnSelect();
        }
        this.fireEvent('select', this);
    },
    hideTrigger1: function (pos) {
        if (!pos) {
            pos = 0;
        }
        Ext.get(this.triggers[pos].dom.offsetParent).hide();
        this.triggers[pos].dom.offsetParent.setAttribute('style', 'width: 17px; visibility: hidden;position:absolute');
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
        this.callParent(arguments);
    },
    onChangeValue: function (field, newValue, oldValue, eOpts) {
        if (newValue) {
            this.showTrigger1();
        }
    },
    setValue: function (value) {
        var oldValue = !Ext.isEmpty(this.getValue()) ? this.getValue().split(',') : '';

        if(this.multiSelect && !Ext.isEmpty(value) && Ext.isArray(oldValue)){
            for (k in value) {
                if (oldValue.indexOf(value[k]) == -1) {
                    oldValue.push(value[k]);
                }
            }
            value = oldValue;
        }

        this.callParent(arguments);
    }
});
