/**
 * Created by john on 13/05/15.
 */

/**
 * Script con los campos(fields ) extendidos
 * requires : [
 *      _ExtBase(dev).js,
 *      ExtExtends.js
 *  ]
 */

(function(_) {

    var cls = _.Class,
            reg = Ext.reg,
            comps = _.Components,
            fields = comps.fields,
            facade = _.FacadeFactory,
            utils = _.Utils;

    Ext.form.Field.prototype.msgTarget = 'qtip';

    comps.baseField = cls({
        $extend: _.boxComponent,
        blankText: "Este campo es obligatorio.",
        tooltip: '',
        allowBlank: false,
        defaultResize: true,
        autoFocus: false,
        adjustSizeByErr: true,
        initComponent: function() {
            if (this.autoFocus) {
                this.on('afterrender', this.fnAutoFocus, this);
            }

            if (this.msgTarget == 'side' && this.adjustSizeByErr) {
                this.on('invalid', this.widthSetByErrorInvalid, this);
                this.on('valid', this.widthSetByErrorValid, this);
                this.on('resize', this.widthSetByErrorResize, this);
            }
        },
        widthSetByErrorInvalid: function() {
            if (this.msgTarget == 'side' && !this.widthSetByError && this.getWidth() > 18) {
                this.setWidth(this.getWidth() - 18);
                this.widthSetByError = true;
            }
        },
        widthSetByErrorValid: function() {
            if (this.msgTarget == 'side' && this.widthSetByError) {
                this.widthSetByError = false;
                this.setWidth(this.getWidth() + 18);
            }
        },
        widthSetByErrorResize: function() {
            if (this.widthSetByError) {
                this.widthSetByError = false;
                this.setWidth(this.getWidth() - 18);
                this.widthSetByError = true;
            }
        },
        fnResize: function() {
            if (this.defaultResize) {
                this.defaultResize = false;
                this.setWidth(this.adjustSizeByErr ? this.getWidth() - 28 : this.getWidth());
                this.defaultResize = true;
            }
        },
        fnAutoFocus: function() {
            this.focus(null, 500);
        },
        onRender: function() {
            this.initToolTip();
            if (this.hidden) {
                this.hide();
            }
        },
        initToolTip: function() {
            if ((this.tooltip) || (this.toolTip)) {
                Ext.QuickTips.register({
                    target: this.id,
                    constrainPosition: true,
                    text: (this.tooltip) || (this.toolTip)
                });
            }
        },
        getXType: function() {
            return 'field';
        },
        setFieldLabel: function(fieldLabel) {
            if (this.fieldLabel !== undefined && this.ownerCt && this.ownerCt.layout.getLabelStyle) {
                var label = (this.container.dom.previousSibling && String(this.container.dom.previousSibling.tagName).toLowerCase() == 'label') ? (this.container.dom.previousSibling) : null;
                if (label) {
                    label.innerHTML = fieldLabel + this.ownerCt.layout.labelSeparator;
                    this.fieldLabel = fieldLabel;
                    return label;
                }
            }
            return undefined;
        },
        hide: function() {
            //fields.numberField.superclass.hide.call(this);
            if (this.container && this.ownerCt)
                this.container.dom.parentNode.style.display = 'none';
        },
        show: function() {
            //fields.numberField.superclass.show.call(this);
            if (this.container && this.ownerCt)
                this.container.dom.parentNode.style.display = '';
        }
    });

    fields.displayField = cls({
        $extend: Ext.form.Field,
        validationEvent: false,
        validateOnBlur: false,
        defaultAutoCreate: {tag: "div"},
        fieldClass: "x-form-display-field",
        htmlEncode: false,
        initEvents: Ext.emptyFn,
        isValid: function() {
            return true;
        },
        validate: function() {
            return true;
        },
        getRawValue: function() {
            var v = this.rendered ? this.el.dom.innerHTML : Ext.value(this.value, '');
            if (v === this.emptyText) {
                v = '';
            }
            if (this.htmlEncode) {
                v = Ext.util.Format.htmlDecode(v);
            }
            return v;
        },
        getValue: function() {
            return this.getRawValue();
        },
        getName: function() {
            return this.name;
        },
        setRawValue: function(v) {
            if (this.htmlEncode) {
                v = Ext.util.Format.htmlEncode(v);
            }
            return this.rendered ? (this.el.dom.innerHTML = (Ext.isEmpty(v) ? '' : v)) : (this.value = v);
        },
        setValue: function(v) {
            this.setRawValue(v);
            return this;
        }
    });

    fields.simpleField = cls({
        $extend: Ext.form.TextField,
        $implement: comps.baseField,
        blankText: "Este campo es obligatorio.",
        render: function() {
            fields.simpleField.superclass.render.apply(this, arguments);
            fields.simpleField.$implement.render.apply(this, arguments);
        },
        initComponent: function() {
            fields.simpleField.superclass.initComponent.call(this);//se hace referencia a la ultima clase de las cuales se heredan.
            fields.simpleField.$implement.initComponent.call(this);//se hace referencia a la ultima clase de las cuales se heredan.
        },
        onRender: function() {
            fields.simpleField.superclass.onRender.apply(this, arguments);
            fields.simpleField.$implement.onRender.call(this);
        },
        hide: function() {
            fields.simpleField.superclass.hide.call(this);
            fields.simpleField.$implement.hide.call(this);
        },
        show: function() {
            fields.simpleField.superclass.show.call(this);
            fields.simpleField.$implement.show.call(this);
        }
    });
    reg('simpleField', fields.simpleField);

    fields.fieldDenom = cls({
        $extend: fields.simpleField,
        maskRe: comps.txtEstandar.maskReExps.denominacion,
        regex: comps.txtEstandar.regExps.denominacion,
        adjustSizeByErr: true,
        regexText: comps.txtEstandar.regexText.denominacion,
        minLengthText: "El tama&#241;o m&#237;nimo requerido es {0} caracteres.",
        maxLengthText: "El tama&#241;o m&#225;ximo requerido es {0} caracteres.",
        allowBlank: false,
        autoFocus: true,
        text: "Denominaci&oacute;n",
        fieldLabel: "Denominaci&oacute;n",
        maxLength: 255,
        enableKeyEvents: true,
        defaultResize: true
    });
    reg('fieldDenom', fields.fieldDenom);

    fields.fieldDescripcion = cls({
        $extend: Ext.form.TextArea,
        $implement: comps.baseField,
        blankText: "Descripci&oacute;n",
        allowBlank: true,
        height: 70,
        adjustSizeByErr: true,
        text: "Descripci&oacute;n",
        fieldLabel: "Descripci&oacute;n",
        maxLength: 500,
        maxLengthText: "El tama&#241;o m&#225;ximo requerido es {0} caracteres.",
        enableKeyEvents: true,
        defaultResize: true,
        render: function() {
            fields.fieldDescripcion.superclass.render.apply(this, arguments);
            fields.fieldDescripcion.$implement.render.apply(this, arguments);
        },
        initComponent: function() {
            fields.fieldDescripcion.superclass.initComponent.call(this);
            fields.fieldDescripcion.$implement.initComponent.call(this);
        },
        onRender: function() {
            fields.fieldDescripcion.superclass.onRender.apply(this, arguments);
            fields.fieldDescripcion.$implement.onRender.call(this);
        },
        hide: function() {
            fields.fieldDescripcion.superclass.hide.call(this);
            fields.fieldDescripcion.$implement.hide.call(this);
        },
        show: function() {
            fields.fieldDescripcion.superclass.show.call(this);
            fields.fieldDescripcion.$implement.show.call(this);
        }
    });
    reg('fieldDescripcion', fields.fieldDescripcion);

    fields.fieldPasswd = cls({
        $extend: fields.simpleField,
        minLength: 4,
        allowBlank: false,
        maskRe: comps.txtEstandar.regExps.passwd,
        regex: comps.txtEstandar.regExps.passwd,
        minLengthText: 'El tama&ntilde;o m&iacute;nimo para este campo es de {0} caracteres.',
        fieldLabel: 'Contrase&ntilde;a',
        inputType: 'password',
        maxLength: 30
    });
    reg('fieldPasswd', fields.fieldPasswd);

    fields.fieldsPasswd = cls({
        $extend: Ext.util.Observable,
        passwd: null,
        confirmPasswd: null,
        constructor: function(config) {
            var me = this,
                    utils = _.Utils,
                    fncheckType = utils.checkDataType,
                    cfg = fncheckType(config, {}),
                    flsConfig = fncheckType(cfg.fieldsConfig, {}),
                    passwdConfig = fncheckType(cfg.passwdConfig, {}),
                    confirmPasswdConfig = fncheckType(cfg.confirmPasswdConfig, {}),
                    fldsConfig = utils.apply({}, flsConfig),
                    configCfPwsd = utils.apply({
                        fieldLabel: 'Confirmar contrase&ntilde;a',
                        blankText: 'Este campo es obligatorio',
                        invalidText: 'La contrase&ntilde;a escrita no corresponde. Escriba la nueva contrase&ntilde;a en ambos cuadros de texto.',
                        isValid: function() {
                            var v = me.passwd.isValid() && fields.fieldPasswd.prototype.isValid.call(this);

                            if (v) {
                                v = me.passwd.getValue() == this.getValue();
                                if (!v) {
                                    this.markInvalid();
                                }

                            }
                            this.flgValid = v;
                            return v;
                        },
                        clearInvalid: function() {
                            if (this.flgValid) {
                                fields.fieldPasswd.prototype.clearInvalid.apply(this, arguments);
                            }
                        }
                    }, flsConfig);


            this.passwd = new fields.fieldPasswd(utils.apply(fldsConfig, passwdConfig));

            this.confirmPasswd = new fields.fieldPasswd(utils.apply(confirmPasswdConfig, configCfPwsd));
        },
        getFields: function() {
            return {
                password: this.passwd,
                confirmPassword: this.confirmPasswd
            }
        },
        isValid: function() {
            return this.confirmPasswd.isValid();
        },
        getValue: function() {
            return this.passwd.getValue();
        },
        isDirty: function() {
            return this.passwd.isDirty();
        },
        getXType: function() {
            return 'fieldsPasswd';
        },
        on: function() {
            this.passwd.on.apply(this, arguments);
            this.confirmPasswd.on.apply(this, arguments);
        },
        getFieldsContainerConfig: function() {
            var flds = this.getFields();
            return {
                layout: 'form',
                items: [
                    flds.password,
                    flds.confirmPassword
                ]
            }
        }
    });
    reg('fieldsPasswd', fields.fieldsPasswd);

    fields.triggerField = cls({
        $extend: Ext.form.TriggerField,
        $implement: comps.baseField,
        allowblank: false,
        render: function() {
            fields.triggerField.superclass.render.apply(this, arguments);
            fields.triggerField.$implement.render.apply(this, arguments);
        },
        initComponent: function() {
            fields.triggerField.superclass.initComponent.call(this);//se hace referencia a la ultima clase de las cuales se heredan.
            fields.triggerField.$implement.initComponent.call(this);//se hace referencia a la ultima clase de las cuales se heredan.
        },
        onRender: function() {
            fields.triggerField.superclass.onRender.apply(this, arguments);
            fields.triggerField.$implement.onRender.call(this);
        },
        hide: function() {
            fields.triggerField.superclass.hide.call(this);
            fields.triggerField.$implement.hide.call(this);
        },
        show: function() {
            fields.triggerField.superclass.show.call(this);
            fields.triggerField.$implement.show.call(this);
        }
    });
    reg('triggerField', fields.triggerField);

    fields.twinTriggerField = cls({
        $extend: fields.triggerField,
        initComponent: function() {
            fields.twinTriggerField.superclass.initComponent.call(this);

            this.triggerConfig = {
                tag: 'span', cls: 'x-form-twin-triggers', cn: [
                    {tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger1Class},
                    {tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger1Class}
                ]};
        },
        getTrigger: function(index) {
            return this.triggers[index];
        },
        initTrigger: function() {
            var ts = this.trigger.select('.x-form-trigger', true);
            this.wrap.setStyle('overflow', 'hidden');
            var triggerField = this;
            ts.each(function(t, all, index) {
                t.hide = function() {
                    var w = triggerField.wrap.getWidth();
                    this.dom.style.display = 'none';
                    triggerField.el.setWidth(w - triggerField.trigger.getWidth());
                };
                t.show = function() {
                    var w = triggerField.wrap.getWidth();
                    this.dom.style.display = '';
                    triggerField.el.setWidth(w - triggerField.trigger.getWidth());
                };
                var triggerIndex = 'Trigger' + (index + 1);

                if (this['hide' + triggerIndex]) {
                    t.dom.style.display = 'none';
                }
                this.mon(t, 'click', this['on' + triggerIndex + 'Click'], this, {preventDefault: true});
                t.addClassOnOver('x-form-trigger-over');
                t.addClassOnClick('x-form-trigger-click');
            }, this);
            this.triggers = ts.elements;
        },
        onTrigger1Click: Ext.emptyFn,
        onTrigger2Click: Ext.emptyFn
    });
    reg('twinTriggerField', fields.twinTriggerField);

    fields.colorField = cls({
        $extend: Ext.form.TriggerField,
        showHexValue: false,
        triggerClass: 'x-form-color-trigger',
        defaultAutoCreate: {tag: "input", type: "text", size: "10",
            autocomplete: "off", maxlength: "6"},
        lengthText: "La longitud del color debe ser de 3 o 6 caracteres.",
        blankText: "El color debe estar en formato hexadecimal",
        regexText: "El color debe estar en formato hexadecimal",
        defaultColor: 'FFFFFF',
        maskRe: /[a-f0-9]/i,
        regex: /[a-f0-9]/i,
        curColor: 'ffffff',
        initComponent: function() {

            fields.colorField.superclass.initComponent.call(this);

            this.addEvents('click', 'change', 'select');

        },
        onChange: function(field, newVal, oldVal) {

            alert(newVal);

        },
        onRender: function(ct, position) {

            fields.colorField.superclass.onRender.call(this, ct, position);

            this.handleRender();

        },
        validateValue: function(value) {

            if (!this.showHexValue) {

                return true;

            }

            if (value.length < 1) {

                this.el.setStyle({
                    'background-color': '#' + this.defaultColor

                });

                if (!this.allowBlank) {

                    this.markInvalid(String.format(this.blankText, value));

                    return false

                }

                return true;

            }

            if (value.length != 3 && value.length != 6) {

                this.markInvalid(String.format(this.lengthText, value));

                return false;

            }

            this.setColor(value);

            return true;

        },
        validateBlur: function() {

            return !this.menu || !this.menu.isVisible();

        },
        markInvalid: function(msg) {

            fields.colorField.superclass.markInvalid.call(this, msg);

            this.el.setStyle({
                'background-image': 'url(../lib/resources/images/default/grid/invalid_line.gif)'

            });

        },
        getValue: function() {

            return this.curColor || this.defaultValue || "FFFFFF";

        },
        setValue: function(hex) {

            fields.colorField.superclass.setValue.call(this, hex);

            if (this.rendered)
                this.setColor(hex);

        },
        setColor: function(hex) {

            this.curColor = hex;



            this.el.setStyle({
                'background-color': '#' + hex,
                'background-image': 'none'

            });

            if (!this.showHexValue) {

                this.el.setStyle({
                    'text-indent': '-100px'

                });

                if (Ext.isIE) {

                    this.el.setStyle({
                        'margin-left': '100px'

                    });

                }

            }

        },
        handleRender: function() {

            this.setDefaultColor();

        },
        setDefaultColor: function() {

            this.setValue(this.defaultColor);

        },
        menuListeners: {
            select: function(m, d) {

                this.setValue(d);

            },
            show: function() { // retain focus styling

                this.onFocus();

            },
            hide: function() {

                this.focus();

                var ml = this.menuListeners;

                this.menu.un("select", ml.select, this);

                this.menu.un("show", ml.show, this);

                this.menu.un("hide", ml.hide, this);

            }

        },
        handleSelect: function(palette, selColor) {

            this.setValue(selColor);

            this.fireEvent("click", this, selColor);

            this.fireEvent("change", this, selColor);

            this.fireEvent("select", this, selColor);

        },
        onTriggerClick: function() {

            if (this.disabled) {

                return;

            }

            if (this.menu == null) {

                this.menu = new Ext.menu.ColorMenu();

                this.menu.palette.on('select', this.handleSelect, this);

            }

            this.menu.on(Ext.apply({}, this.menuListeners, {
                scope: this

            }));

            this.menu.show(this.el, "tl-bl?");

        }
    });
    reg('colorField', fields.colorField);

    fields.simpleComboBox = cls({
        $extend: Ext.form.ComboBox,
        $implement: comps.baseField,
        triggerAction: 'all',
        blankText: "Este campo es obligatorio.",
        initComponent: function() {
            fields.simpleComboBox.superclass.initComponent.call(this);//se hace referencia a la ultima clase de las cuales se heredan.
            fields.simpleComboBox.$implement.initComponent.call(this);
        },
        onRender: function() {
            fields.simpleComboBox.superclass.onRender.apply(this, arguments);
            fields.simpleComboBox.$implement.onRender.call(this);
        },
        hide: function() {
            fields.simpleComboBox.superclass.hide.call(this);
            fields.simpleComboBox.$implement.hide.call(this);
        },
        render: function() {
            fields.simpleComboBox.superclass.render.apply(this, arguments);
            fields.simpleComboBox.$implement.render.apply(this, arguments);
        },
        show: function() {
            fields.simpleComboBox.superclass.show.call(this);
            fields.simpleComboBox.$implement.show.call(this);
        },
        getXType: function() {
            return 'combobox';
        }
    });
    reg('simplecombobox', fields.simpleComboBox);

    fields.localComboBox = cls({
        $extend: fields.simpleComboBox,
        typeAhead: true,
        forceSelection: true,
        mode: 'local',
        selectOnFocus: true,
        defaultResize: false,
        triggerAction: 'all',
        enableKeyEvents: true,
        status: true,
        statusLastSelecText: false,
        invalidText: "El valor en este campo es inv&#225;lido.",
        constructor: function(config) {
            config.typeAhead = true;
            config.forceSelection = true;
            config.mode = 'local';
            config.selectOnFocus = true;
            config.triggerAction = 'all';
            config.enableKeyEvents = true;
            config.editable = config.editable === false ? false : true;

            fields.localComboBox.superclass.constructor.call(this, config);
        },
        initComponent: function() {
            this.on({
                afterrender: this.afterrenderFn,
                //resize: this.adjustSizeByErrFn,
                keyup: this.fireKeyUp,
                beforeselect: this.fireSelectEvent,
                scope: this
            });

            fields.localComboBox.superclass.initComponent.call(this);
        },
        fireKeyUp: function() {
            var val = this.getRawValue();
            if (this.forceSelection) {
                var val = this.getRawValue();
                var rec = this.findRecord(this.displayField, val);
                if (!rec) {
                    this.markInvalid(this.invalidText);
                }
                else if (val != this.lastSelectionText) {
                    var text = (this.fieldLabel) ? (this.fieldLabel) : ('elemento');
                    this.markInvalid('Confirme la selecci&oacute;n');
                }
                else {
                    this.clearInvalid();
                }
            }
            if (val.length > 0)
                this.status = false;
            else
                this.status = true;
        },
        fireSelectEvent: function() {
            this.status = true;
        },
        beforeBlur: function() {
            var val = this.getRawValue();
            if (this.forceSelection) {
                if (val.length > 0 && val != this.emptyText) {
                    if (!this.status && val != this.lastSelectionText && !this.statusLastSelecText) {
                        this.clearValue();
                    }
                    else
                        this.el.dom.value = Ext.isDefined(this.lastSelectionText) ? this.lastSelectionText : '';

                    this.applyEmptyText();
                }
                else {
                    this.clearValue();
                }
            }
            else {
                var rec = this.findRecord(this.displayField, val);
                if (rec) {
                    val = rec.get(this.valueField || this.displayField);
                }
                this.clearValue();
            }

            this.status = true;
        },
        validate: function() {
            if (this.fireEvent('beforevalidation', arguments) !== false) {
                var valid = fields.localComboBox.superclass.validate.call(this);
                this.fireEvent('validation', arguments);
                return valid;
            }
        },
        validateValue: function(value) {
            if (Ext.isFunction(this.validator)) {
                var msg = this.validator(value);
                if (msg !== true) {
                    this.markInvalid(msg);
                    return false;
                }
            }
            if (value.length < 1 || value === this.emptyText) { // if it's blank
                if (this.allowBlank) {
                    this.clearInvalid();
                    return true;
                }
                else {
                    this.markInvalid(this.blankText);
                    return false;
                }
            }
            if (value.length < this.minLength) {
                this.markInvalid(String.format(this.minLengthText, this.minLength));
                return false;
            }
            if (value.length > this.maxLength) {
                this.markInvalid(String.format(this.maxLengthText, this.maxLength));
                return false;
            }
            if (this.vtype) {
                var vt = Ext.form.VTypes;
                if (!vt[this.vtype](value, this)) {
                    this.markInvalid(this.vtypeText || vt[this.vtype + 'Text']);
                    return false;
                }
            }
            if (this.regex && !this.regex.test(value)) {
                this.markInvalid(this.regexText);
                return false;
            }
            if (!this.status)
                return false;
            return true;
        },
        afterrenderFn: function() {
            //this.initToolTip();
            this.loadStore();
        },
        loadStore: function() {
            if (this.store && this.store.proxy) {
                this.store.load();
            }
        }
    });
    reg('localComboBox', fields.localComboBox);

    fields.numberField = cls({
        $extend: Ext.form.NumberField,
        $implement: comps.baseField,
        nanText: 'Solo admite n&uacute;meros.',
        invalidText: 'Solo admite n&uacute;meros.',
        blankText: "Este campo es obligatorio.",
        initComponent: function() {
            fields.numberField.superclass.initComponent.call(this);//se hace referencia a la ultima clase de las cuales se heredan.
            fields.numberField.$implement.initComponent.call(this);
        },
        onRender: function() {
            fields.numberField.superclass.onRender.apply(this, arguments);
            fields.numberField.$implement.onRender.call(this);
        },
        validateValue: function(value) {

            if (!this.allowNegative && !this.allowDecimals) {
                this.invalidText = 'Solo admite n&uacute;meros enteros positivos';
            }
            else if (!this.allowNegative) {
                this.invalidText = 'Solo admite n&uacute;meros positivos';
            }
            else if (!this.allowDecimals) {
                this.invalidText = 'Solo admite n&uacute;meros enteros';
            }
            else {
                this.invalidText = 'El valor introducido no es un n&uacute;mero v&aacute;lido';
            }

            //var maskReAux = /^[-]?[0-9]+[.]?[0-9]+$/;
            var string = '[0-9]+';

            if (this.allowNegative)
                string = '[-]?' + string;
            if (this.allowDecimals)
                string += '([.]?[0-9]+)?';

            string = '^' + string + '$';
            var maskReAux = new RegExp(string);

            if (value && !maskReAux.test(value)) {
                this.markInvalid();
                return false;
            }

            return fields.numberField.superclass.validateValue.call(this, value);
        },
        hide: function() {
            fields.numberField.superclass.hide.call(this);
            fields.numberField.$implement.hide.call(this);
        },
        show: function() {
            fields.numberField.superclass.show.call(this);
            fields.numberField.$implement.show.call(this);
        },
        filterKeys: function(e) {
            var charCode = e.getCharCode();
            if (charCode == e.BACKSPACE || charCode == e.LEFT || charCode == e.RIGHT) {
                return;
            }

            var fromCharCode = String.fromCharCode(charCode);

            //Si se desea que no permita copiar en forefox comentariar este if.
            if (e.ctrlKey || e.isSpecialKey()) {
                return;
            }

            if (!this.maskRe.test(fromCharCode)) {
                e.stopEvent();
                return;
            }
        },
        render: function() {
            fields.numberField.superclass.render.apply(this, arguments);
            fields.numberField.$implement.render.apply(this, arguments);
        }
    });
    reg('numberField', fields.numberField);

    fields.Spinner = cls({
        $extend: Ext.util.Observable,
        incrementValue: 1,
        alternateIncrementValue: 5,
        triggerClass: 'x-form-spinner-trigger',
        splitterClass: 'x-form-spinner-splitter',
        alternateKey: Ext.EventObject.shiftKey,
        defaultValue: 0,
        accelerate: false,
        constructor: function(config) {
            fields.Spinner.superclass.constructor.call(this, config);
            Ext.apply(this, config);
            this.mimicing = false;
        },
        init: function(field) {
            this.field = field;

            field.afterMethod('onRender', this.doRender, this);
            field.afterMethod('onEnable', this.doEnable, this);
            field.afterMethod('onDisable', this.doDisable, this);
            field.afterMethod('afterRender', this.doAfterRender, this);
            field.afterMethod('onResize', this.doResize, this);
            field.afterMethod('onFocus', this.doFocus, this);
            field.beforeMethod('onDestroy', this.doDestroy, this);

        },
        doRender: function(ct, position) {
            if (this.field.rendered) {
                var el = this.el = this.field.getEl();
                var f = this.field;

                if (!f.wrap) {
                    f.wrap = this.wrap = el.wrap({
                        cls: "x-form-field-wrap"
                    });
                }
                else {
                    this.wrap = f.wrap.addClass('x-form-field-wrap');
                }

                this.trigger = this.wrap.createChild({
                    tag: "img",
                    src: Ext.BLANK_IMAGE_URL,
                    cls: "x-form-trigger " + this.triggerClass
                });

                if (!f.width) {
                    this.wrap.setWidth(el.getWidth() + this.trigger.getWidth());
                }

                this.splitter = this.wrap.createChild({
                    tag: 'div',
                    cls: this.splitterClass,
                    style: 'width:13px; height:2px;'
                });
                this.splitter.setRight((Ext.isIE) ? 1 : 2).setTop(10).show();

                this.proxy = this.trigger.createProxy('', this.splitter, true);
                this.proxy.addClass("x-form-spinner-proxy");
                this.proxy.setStyle('left', '0px');
                this.proxy.setSize(14, 1);
                this.proxy.hide();
                this.dd = new Ext.dd.DDProxy(this.splitter.dom.id, "SpinnerDrag", {
                    dragElId: this.proxy.id
                });

                this.initTrigger();
                this.initSpinner();
            } else {
                this.field.on('afterrender', function() {
                    this.doRender(ct, position);
                }, this)
            }
        },
        doAfterRender: function() {
            var y;
            if (Ext.isIE && this.el.getY() != (y = this.trigger.getY())) {
                this.el.position();
                this.el.setY(y);
            }
        },
        doEnable: function() {
            if (this.wrap) {
                this.wrap.removeClass(this.field.disabledClass);
            }
        },
        doDisable: function() {
            if (this.wrap) {
                this.wrap.addClass(this.field.disabledClass);
                this.el.removeClass(this.field.disabledClass);
            }
        },
        doResize: function(w, h) {
            if (this.field.rendered) {
                if (typeof w == 'number') {
                    this.el.setWidth(this.field.adjustWidth('input', w - this.trigger.getWidth()));
                }
                this.wrap.setWidth(this.el.getWidth() + this.trigger.getWidth());
            } else {
                this.field.on('afterrender', function() {
                    this.doResize(w, h);
                }, this);
            }

        },
        doFocus: function() {
            if (!this.mimicing) {
                this.wrap.addClass('x-trigger-wrap-focus');
                this.mimicing = true;
                Ext.get(Ext.isIE ? document.body : document).on("mousedown", this.mimicBlur, this, {
                    delay: 10
                });
                this.el.on('keydown', this.checkTab, this);
            }
        },
        // private
        checkTab: function(e) {
            if (e.getKey() == e.TAB) {
                this.triggerBlur();
            }
        },
        // private
        mimicBlur: function(e) {
            if (!this.wrap.contains(e.target) && this.field.validateBlur(e)) {
                this.triggerBlur();
            }
        },
        // private
        triggerBlur: function() {
            this.mimicing = false;
            Ext.get(Ext.isIE ? document.body : document).un("mousedown", this.mimicBlur, this);
            this.el.un("keydown", this.checkTab, this);
            this.field.beforeBlur();
            this.wrap.removeClass('x-trigger-wrap-focus');
            this.field.onBlur.call(this.field);
        },
        initTrigger: function() {
            this.trigger.addClassOnOver('x-form-trigger-over');
            this.trigger.addClassOnClick('x-form-trigger-click');
        },
        initSpinner: function() {
            this.field.addEvents({
                'spin': true,
                'spinup': true,
                'spindown': true
            });

            this.keyNav = new Ext.KeyNav(this.el, {
                "up": function(e) {
                    e.preventDefault();
                    this.onSpinUp();
                },
                "down": function(e) {
                    e.preventDefault();
                    this.onSpinDown();
                },
                "pageUp": function(e) {
                    e.preventDefault();
                    this.onSpinUpAlternate();
                },
                "pageDown": function(e) {
                    e.preventDefault();
                    this.onSpinDownAlternate();
                },
                scope: this
            });

            this.repeater = new Ext.util.ClickRepeater(this.trigger, {
                accelerate: this.accelerate
            });
            this.field.mon(this.repeater, "click", this.onTriggerClick, this, {
                preventDefault: true
            });

            this.field.mon(this.trigger, {
                mouseover: this.onMouseOver,
                mouseout: this.onMouseOut,
                mousemove: this.onMouseMove,
                mousedown: this.onMouseDown,
                mouseup: this.onMouseUp,
                scope: this,
                preventDefault: true
            });

            this.field.mon(this.wrap, "mousewheel", this.handleMouseWheel, this);

            this.dd.setXConstraint(0, 0, 10)
            this.dd.setYConstraint(1500, 1500, 10);
            this.dd.endDrag = this.endDrag.createDelegate(this);
            this.dd.startDrag = this.startDrag.createDelegate(this);
            this.dd.onDrag = this.onDrag.createDelegate(this);
        },
        onMouseOver: function() {
            if (this.disabled) {
                return;
            }
            var middle = this.getMiddle();
            this.tmpHoverClass = (Ext.EventObject.getPageY() < middle) ? 'x-form-spinner-overup' : 'x-form-spinner-overdown';
            this.trigger.addClass(this.tmpHoverClass);
        },
        //private
        onMouseOut: function() {
            this.trigger.removeClass(this.tmpHoverClass);
        },
        //private
        onMouseMove: function() {
            if (this.disabled) {
                return;
            }
            var middle = this.getMiddle();
            if (((Ext.EventObject.getPageY() > middle) && this.tmpHoverClass == "x-form-spinner-overup") ||
                    ((Ext.EventObject.getPageY() < middle) && this.tmpHoverClass == "x-form-spinner-overdown")) {
            }
        },
        //private
        onMouseDown: function() {
            if (this.disabled) {
                return;
            }
            var middle = this.getMiddle();
            this.tmpClickClass = (Ext.EventObject.getPageY() < middle) ? 'x-form-spinner-clickup' : 'x-form-spinner-clickdown';
            this.trigger.addClass(this.tmpClickClass);
        },
        //private
        onMouseUp: function() {
            this.trigger.removeClass(this.tmpClickClass);
        },
        //private
        onTriggerClick: function() {
            if (this.disabled || this.el.dom.readOnly) {
                return;
            }
            var middle = this.getMiddle();
            var ud = (Ext.EventObject.getPageY() < middle) ? 'Up' : 'Down';
            this['onSpin' + ud]();
        },
        //private
        getMiddle: function() {
            var t = this.trigger.getTop();
            var h = this.trigger.getHeight();
            var middle = t + (h / 2);
            return middle;
        },
        //private
        //checks if control is allowed to spin
        isSpinnable: function() {
            if (this.disabled || this.el.dom.readOnly) {
                Ext.EventObject.preventDefault(); //prevent scrolling when disabled/readonly
                return false;
            }
            return true;
        },
        handleMouseWheel: function(e) {
            //disable scrolling when not focused
            if (this.wrap.hasClass('x-trigger-wrap-focus') == false) {
                return;
            }

            var delta = e.getWheelDelta();
            if (delta > 0) {
                this.onSpinUp();
                e.stopEvent();
            }
            else
            if (delta < 0) {
                this.onSpinDown();
                e.stopEvent();
            }
        },
        //private
        startDrag: function() {
            this.proxy.show();
            this._previousY = Ext.fly(this.dd.getDragEl()).getTop();
        },
        //private
        endDrag: function() {
            this.proxy.hide();
        },
        //private
        onDrag: function() {
            if (this.disabled) {
                return;
            }
            var y = Ext.fly(this.dd.getDragEl()).getTop();
            var ud = '';

            if (this._previousY > y) {
                ud = 'Up';
            } //up
            if (this._previousY < y) {
                ud = 'Down';
            } //down
            if (ud != '') {
                this['onSpin' + ud]();
            }

            this._previousY = y;
        },
        //private
        onSpinUp: function() {
            if (this.isSpinnable() == false) {
                return;
            }
            if (Ext.EventObject.shiftKey == true) {
                this.onSpinUpAlternate();
                return;
            }
            else {
                this.spin(false, false);
            }
            this.field.fireEvent("spin", this);
            this.field.fireEvent("spinup", this);
        },
        //private
        onSpinDown: function() {
            if (this.isSpinnable() == false) {
                return;
            }
            if (Ext.EventObject.shiftKey == true) {
                this.onSpinDownAlternate();
                return;
            }
            else {
                this.spin(true, false);
            }
            this.field.fireEvent("spin", this);
            this.field.fireEvent("spindown", this);
        },
        //private
        onSpinUpAlternate: function() {
            if (this.isSpinnable() == false) {
                return;
            }
            this.spin(false, true);
            this.field.fireEvent("spin", this);
            this.field.fireEvent("spinup", this);
        },
        //private
        onSpinDownAlternate: function() {
            if (this.isSpinnable() == false) {
                return;
            }
            this.spin(true, true);
            this.field.fireEvent("spin", this);
            this.field.fireEvent("spindown", this);
        },
        spin: function(down, alternate) {
            var v = parseFloat(this.field.getValue());
            var incr = (alternate == true) ? this.alternateIncrementValue : this.incrementValue;
            (down == true) ? v -= incr : v += incr;

            v = (isNaN(v)) ? this.defaultValue : v;
            v = this.fixBoundries(v);
            this.field.setRawValue(v);
        },
        fixBoundries: function(value) {
            var v = value;

            if (this.field.minValue != undefined && v < this.field.minValue) {
                v = this.field.minValue;
            }
            if (this.field.maxValue != undefined && v > this.field.maxValue) {
                v = this.field.maxValue;
            }

            return this.fixPrecision(v);
        },
        // private
        fixPrecision: function(value) {
            var nan = isNaN(value);
            if (!this.field.allowDecimals || this.field.decimalPrecision == -1 || nan || !value) {
                return nan ? '' : value;
            }
            return parseFloat(parseFloat(value).toFixed(this.field.decimalPrecision));
        },
        doDestroy: function() {
            if (this.trigger) {
                this.trigger.remove();
            }
            if (this.wrap) {
                this.wrap.remove();
                delete this.field.wrap;
            }

            if (this.splitter) {
                this.splitter.remove();
            }

            if (this.dd) {
                this.dd.unreg();
                this.dd = null;
            }

            if (this.proxy) {
                this.proxy.remove();
            }

            if (this.repeater) {
                this.repeater.purgeListeners();
            }
        }
    });

    fields.spinnerField = cls({
        $extend: fields.numberField,
        deferHeight: true,
        autoSize: Ext.emptyFn,
        onBlur: Ext.emptyFn,
        adjustSize: Ext.BoxComponent.prototype.adjustSize,
        blankText: "Este campo es obligatorio.",
        constructor: function(config) {
            var spinnerConfig = utils.applyTo({}, config, 'incrementValue,alternateIncrementValue,accelerate,defaultValue,triggerClass,splitterClass');

            var spl = this.spinner = new fields.Spinner(spinnerConfig);

            var plugins = config.plugins
                    ? (Ext.isArray(config.plugins)
                            ? config.plugins.push(spl)
                            : [config.plugins, spl])
                    : spl;

            fields.spinnerField.superclass.constructor.call(this, Ext.apply(config, {plugins: plugins}));
        },
        onShow: function() {
            if (this.wrap) {
                this.wrap.dom.style.display = '';
                this.wrap.dom.style.visibility = 'visible';
            }
        },
        onHide: function() {
            this.wrap.dom.style.display = 'none';
        },
        getResizeEl: function() {
            return this.wrap;
        },
        getPositionEl: function() {
            return this.wrap;
        },
        alignErrorIcon: function() {
            if (this.wrap) {
                this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
            }
        },
        validateBlur: function() {
            return true;
        }
    });
    reg('spinnerfield', fields.spinnerField);

    fields.dateField = cls({
        $extend: Ext.form.DateField,
        $implement: comps.baseField,
        blankText: "Este campo es obligatorio.",
        menuListeners: {
            select: function(m, d) {
                this.setValue(d);
                this.fireEvent('select', m, d);
            },
            show: function() {
                this.onFocus();
            },
            hide: function() {
                this.focus.defer(10, this);
                var ml = this.menuListeners;
                this.menu.un("select", ml.select, this);
                this.menu.un("show", ml.show, this);
                this.menu.un("hide", ml.hide, this);
            }
        },
        render: function() {
            fields.dateField.superclass.render.apply(this, arguments);
            fields.dateField.$implement.render.apply(this, arguments);
        },
        initComponent: function() {

            if (Ext.isChrome === true) {
                var allRules = Ext.util.CSS.getRules(false);
                var xDatePickerRule = allRules['.x-date-picker'];

                if (xDatePickerRule && xDatePickerRule.style.width != '185px') {
                    xDatePickerRule.style.width = '185px';
                }
            }

            fields.dateField.superclass.initComponent.call(this);//se hace referencia a la ultima clase de las cuales se heredan.
            fields.dateField.$implement.initComponent.call(this);
        },
        hide: function() {
            fields.dateField.superclass.hide.call(this);
            fields.dateField.$implement.hide.call(this);
        },
        show: function() {
            fields.dateField.superclass.show.call(this);
            fields.dateField.$implement.show.call(this);
        },
        getXType: function() {
            return 'datefield';
        },
        onRender: function() {
            fields.dateField.superclass.onRender.apply(this, arguments);
            fields.dateField.$implement.onRender.call(this);
        }
    });
    reg('dateField', fields.dateField);

    fields.FileUploadField = cls({
        $extend: Ext.form.TextField,
        $implement: comps.baseField,
        blankText: "Este campo es obligatorio.",
        buttonOnly: false,
        buttonOffset: 3,
        Tipo: '',
        buttonCfg: {
            iconCls: 'gis_abrir'
        },
        readOnly: true,
        autoSize: Ext.emptyFn,
        render: function() {
            fields.FileUploadField.superclass.render.apply(this, arguments);
            fields.FileUploadField.$implement.render.apply(this, arguments);
        },
        fileselectedfn: function() {
        },
        initComponent: function() {
            Ext.applyIf(this, {
                labelwidth: 100,
                emptyText: 'Agrege un archivo ' + this.Tipo,
                fieldLabel: this.Tipo,
                allowBlank: false,
                invalidText: 'Agrege un fichero del formato especificado.',
                blankText: 'Debe seleccionar un archivo.',
                validator: function(/*value*/) {
                    /* re = value.split('.');
                     if(re.length>1)
                     if(re[1] == this.Tipo.toLowerCase() || re[1] == this.Tipo.toUpperCase())*/
                    return true;
                    //return false;
                }
            });

            fields.FileUploadField.superclass.initComponent.call(this);
            fields.FileUploadField.$implement.initComponent.call(this);

            this.addEvents('fileselected');
        },
        // private
        onRender: function(ct, position) {
            fields.FileUploadField.superclass.onRender.call(this, ct, position);

            this.wrap = this.el.wrap({cls: 'x-form-field-wrap x-form-file-wrap'});
            this.el.addClass('x-form-file-text');
            this.el.dom.removeAttribute('name');
            this.createFileInput();

            var btnCfg = Ext.applyIf(this.buttonCfg || {}, {
                text: this.buttonText
            });
            this.button = new Ext.Button(Ext.apply(btnCfg, {
                renderTo: this.wrap,
                cls: 'x-form-file-btn' + (btnCfg.iconCls ? ' x-btn-icon' : '')
            }));

            if (this.buttonOnly) {
                this.el.hide();
                this.wrap.setWidth(this.button.getEl().getWidth());
            }

            this.bindListeners();
            this.resizeEl = this.positionEl = this.wrap;
            this.on('fileselected', function() {
                this.fileselectedfn();
            });
        },
        bindListeners: function() {
            var _this = this;
            this.fileInput.on({
                scope: this,
                mouseenter: function() {
                    this.button.addClass(['x-btn-over', 'x-btn-focus'])
                },
                mouseleave: function() {
                    this.button.removeClass(['x-btn-over', 'x-btn-focus', 'x-btn-click'])
                },
                mousedown: function() {
                    this.button.addClass('x-btn-click')
                },
                mouseup: function() {
                    this.button.removeClass(['x-btn-over', 'x-btn-focus', 'x-btn-click'])
                },
                change: function() {
                    var v = _this.fileInput.dom.value;
                    _this.setValue(v);
                    _this.fireEvent('fileselected', _this, v);
                }
            });
        },
        createFileInput: function() {
            this.fileInput = this.wrap.createChild({
                id: this.getFileInputId(),
                name: this.name || this.getId(),
                cls: 'x-form-file',
                tag: 'input',
                type: 'file',
                size: 1
            });
        },
        reset: function() {
            this.fileInput.remove();
            this.createFileInput();
            this.bindListeners();
            fields.FileUploadField.superclass.reset.call(this);
        },
        // private
        getFileInputId: function() {
            return this.id + '-file';
        },
        // private
        onResize: function(w, h) {
            fields.FileUploadField.superclass.onResize.call(this, w, h);

            this.wrap.setWidth(w);

            if (!this.buttonOnly) {
                this.el.setWidth(this.wrap.getWidth() - this.button.getEl().getWidth() - this.buttonOffset);
            }
        },
        // private
        onDestroy: function() {
            fields.FileUploadField.superclass.onDestroy.call(this);
            Ext.destroy(this.fileInput, this.button, this.wrap);
        },
        onDisable: function() {
            fields.FileUploadField.superclass.onDisable.call(this);
            this.doDisable(true);
        },
        onEnable: function() {
            fields.FileUploadField.superclass.onEnable.call(this);
            this.doDisable(false);

        },
        // private
        doDisable: function(disabled) {
            this.fileInput.dom.disabled = disabled;
            this.button.setDisabled(disabled);
        },
        // private
        preFocus: Ext.emptyFn,
        // private
        alignErrorIcon: function() {
            this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
        },
        hide: function() {
            fields.FileUploadField.superclass.hide.call(this);
            if (this.container)
                this.container.dom.parentNode.style.display = 'none';
        },
        show: function() {
            fields.FileUploadField.superclass.show.call(this);
            if (this.container)
                this.container.dom.parentNode.style.display = '';
        }
    });
    reg('gis_fileuploadfield', fields.FileUploadField);

})(ExtExtend);
