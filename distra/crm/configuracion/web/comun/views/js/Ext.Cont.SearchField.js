/* 
 * Campo de texto para realizar b&uacute;squeda simples.
 * Nota importante #1: Es necesario pasarle las dos funciones que realizar&aacute; al buscar y limpiar.
 * Nota importante #2: Para evitar que la tecla escape no cierre una ventana y permita borrar debe pasarle a esa ventana la siguiente propiedad <code>onEsc: Ext.emptyFn</code>
 * 
 * @author Ing. Miguel D&iacute;az Riveaux & Ing. Rodain Terrer Molina & Ing. Alexis Rodr&iacute;guez Reyes.
 * @package ERP Cuba.
 * @subpackage Contabilidad y Finanzas. 
 * @namespace Ext.Cont.SearchField
 * @copyright XETID.
 * @version 1.0-0
 */
Ext.QuickTips.init();
if (!Ext.Cont)
    Ext.namespace('Ext.Cont');
Ext.Cont.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    validationEvent: false,
    validateOnBlur: true,
    selectOnFocus: true,
    hasSearch: false,
    hideTrigger1: true,
    trigger1Class: 'x-form-clear-trigger',
    trigger2Class: 'x-form-search-trigger',
    clearTooltip: 'Limpiar filtro <b>(Alt+L)</b>',
    searchTooltip: 'Buscar elementos <b>(Alt+B)</b>',
    emptyText: 'Criterio a buscar...',
    enableKeyEvents: true,
    fnOnClear: Ext.emptyFn,
    fnOnSearch: Ext.emptyFn,
    initComponent: function (config) {
        var style = document.createElement("link");
        style.type = "text/css";
        style.rel = "stylesheet";
        style.href = "/configuracion/comun/views/css/searchField.css";
        document.getElementsByTagName("head")[0].appendChild(style);
        Ext.apply(this, config);
        if (!this.id) { // definiendo un id si no fue definido en la configuracion
            var alreadyExist = Ext.DomQuery.select('span img[class*=x-form-search-trigger]');
            this.id = 'x-form-search' + (alreadyExist.length + 1);
        }
        Ext.Cont.SearchField.superclass.initComponent.call(this);
        this.triggerConfig.cn[0].qtip = this.clearTooltip;
        this.triggerConfig.cn[1].qtip = this.searchTooltip;
        this.on({
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
                var value = f.getRawValue(),
                    regex = /^\s+$/g,
                    valid = this.isValid();
                if (valid) {
                    if (regex.test(value)) {
                        f.markInvalid('El valor de este campo es inválido.');
                    } else {
                        f.clearInvalid();
                    }
                }

                if (e.getKey() == e.BACKSPACE || e.getKey() == 8 || e.getKey() == e.DELETE || e.getKey() == 46) {
                    this.validate();
                    if (value.length < 1) {
                        this.onTrigger1Click();
                    }
                } else if (value && !(e.getKey() == e.ENTER || e.getKey() == 13) && !(e.getKey() == e.ESC || e.getKey() == 27) && (e.getKey() != e.TAB || e.getKey() != 9)) {
                    this.triggers[0].show();
                }
            }
        });
    },
    onTrigger1Click: function () {
        this.triggers[0].hide();
        if (this.hasSearch) {
            this.el.dom.value = '';
            this.reset();
            this.hasSearch = false;
            if (typeof (this.fnOnClear) == 'function') {
                this.fnOnClear();
                this.triggerBlur();
                this.blur();
                this.focus();
            }
        } else {
            this.el.dom.value = '';
            this.reset();
            this.triggerBlur();
            this.blur();
            this.focus();
            this.hasSearch = false;
        }
    },
    onTrigger2Click: function () {
        this.setValue(this.getValue().trim());
        var v = this.getRawValue();
        if (!this.isValid()) {
            return;
        }
        if (v.length < 1) {
            this.onTrigger1Click();
            return;
        }
        this.hasSearch = true;
        this.triggers[0].show();
        if (typeof (this.fnOnSearch) == 'function') {
            this.fnOnSearch();
        }
    }
});
Ext.reg('searchfield', Ext.Cont.SearchField);