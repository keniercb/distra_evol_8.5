Ext.defineApp = function(name, config) {
    Ext.onReady(function() {
        if (config.main) {
            Ext.QuickTips.init();
            config.main();
        }
    });
};
Ext.Msg.buttonText = {
    ok: "Aceptar",
    cancel: "Cancelar",
    yes: "Aceptar",
    no: "Cancelar"
};
//String overrides
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

//Ext Components overrides
Ext.override(Ext.Button, {
    setIcon: function(url) {
        if (this.rendered) {
            var btnEl = this.getEl().child(this.buttonSelector);
            btnEl.setStyle('background-image', 'url(' + url + ')');
        }
    }
});

Ext.override(Ext.form.Field, {
    markInvalid: function(msg) {
        if (!this.rendered || this.preventMark) {
            return;
        }
        var markEl = this.markEl || this.el;
        markEl.addClass(this.invalidClass);
        msg = msg || this.invalidText;
        switch (this.msgTarget) {
            case 'qtip':
                markEl.dom.qtip = msg;
                markEl.dom.qclass = 'x-form-invalid-tip';
                if (Ext.QuickTips) {
                    Ext.QuickTips.enable();
                }
                break;
            case 'title':
                markEl.dom.title = msg;
                break;
            case 'under':
                if (!this.errorEl) {
                    var elp = this.getErrorCt();
                    if (!elp) {
                        markEl.dom.title = msg;
                        break;
                    }
                    this.errorEl = elp.createChild({cls: 'x-form-invalid-msg'});
                    this.errorEl.setWidth(elp.getWidth(true) - 20);
                }
                this.errorEl.update(msg);
                Ext.form.Field.msgFx[this.msgFx].show(this.errorEl, this);
                break;
            case 'side':
                if (!this.errorIcon) {
                    var elp = this.getErrorCt();
                    if (!elp) {
                        markEl.dom.title = msg;
                        break;
                    }
                    this.errorIcon = elp.createChild({cls: 'x-form-invalid-icon'});
                }
                this.alignErrorIcon();
                this.errorIcon.dom.qtip = msg;
                this.errorIcon.dom.qclass = 'x-form-invalid-tip';
                this.errorIcon.show();
                this.on('resize', this.alignErrorIcon, this);
                break;
            default:
                var t = Ext.getDom(this.msgTarget);
                t.innerHTML = msg;
                t.style.display = this.msgDisplay;
                break;
        }
        this.fireEvent('invalid', this, msg);
    },
    clearInvalid: function() {
        if (!this.rendered || this.preventMark) {
            return;
        }
        var markEl = this.markEl || this.el;
        markEl.removeClass(this.invalidClass);
        switch (this.msgTarget) {
            case 'qtip':
                markEl.dom.qtip = '';
                break;
            case 'title':
                markEl.dom.title = '';
                break;
            case 'under':
                if (this.errorEl) {
                    Ext.form.Field.msgFx[this.msgFx].hide(this.errorEl, this);
                } else {
                    markEl.dom.title = '';
                }
                break;
            case 'side':
                if (this.errorIcon) {
                    this.errorIcon.dom.qtip = '';
                    this.errorIcon.hide();
                    this.un('resize', this.alignErrorIcon, this);
                } else {
                    markEl.dom.title = '';
                }
                break;
            default:
                var t = Ext.getDom(this.msgTarget);
                t.innerHTML = '';
                t.style.display = 'none';
                break;
        }
        this.fireEvent('valid', this);
    },
    alignErrorIcon: function() {
        this.errorIcon.alignTo(this.markEl || this.el, 'tl-tr', [2, 0]);
    }
});

Ext.override(Ext.form.Checkbox, {
    getValue: function() {
        if (this.rendered) {
            return this.el.dom.checked;
        }
        return this.checked;
    },
    onRender: function(ct, position) {
        Ext.form.Checkbox.superclass.onRender.call(this, ct, position);
        if (this.inputValue !== undefined) {
            this.el.dom.value = this.inputValue;
        }
        this.el.removeClass(this.baseCls);
        //this.el.addClass('x-hidden');
        this.innerWrap = this.el.wrap({
            //tabIndex: this.tabIndex,
            cls: this.baseCls + '-wrap-inner'
        });
        this.wrap = this.innerWrap.wrap({
            cls: this.baseCls + '-wrap'
        });
        /*this.imageEl = this.innerWrap.createChild({
         tag: 'img',
         src: Ext.BLANK_IMAGE_URL,
         cls: this.baseCls
         });*/
        if (this.boxLabel) {
            this.labelEl = this.innerWrap.createChild({
                tag: 'label',
                htmlFor: this.el.id,
                cls: 'x-form-cb-label',
                html: this.boxLabel
            });
        }
        //this.imageEl = this.innerWrap.createChild({
        //tag: 'img',
        //src: Ext.BLANK_IMAGE_URL,
        //cls: this.baseCls
        //}, this.el);
        if (this.checked) {
            this.setValue(true);
        } else {
            this.checked = this.el.dom.checked;
        }
        this.originalValue = this.checked;
        this.markEl = this.innerWrap;
    },
    afterRender: function() {
        Ext.form.Checkbox.superclass.afterRender.call(this);
        this.wrap[this.checked ? 'addClass' : 'removeClass'](this.checkedCls);
        //this.imageEl[this.checked ? 'addClass' : 'removeClass'](this.checkedCls);
    },
    focus : function(selectText, delay) {
        if(delay){
            this.focus.defer(typeof delay == 'number' ? delay : 10, this, [selectText, false]);
            return;
        }
        if(this.rendered){
            // console.log(this); // changed
            // not needed for checkbox -- if(selectText === true){
            	this.el.dom.focus();
            //}
        }
        return this;
    },
    initCheckEvents: function() {
        //this.innerWrap.removeAllListeners();
        this.innerWrap.addClassOnOver(this.overCls);
        this.innerWrap.addClassOnClick(this.mouseDownCls);
        this.innerWrap.on('click', this.onClick, this);
        this.innerWrap.on('keyup', this.onKeyUp, this);
        if (this.validationEvent !== false) {
            this.el.on(this.validationEvent, this.validate, this, {
                buffer: this.validationDelay
            });
        }
    },
    onFocus: function(e) {
        Ext.form.Checkbox.superclass.onFocus.call(this, e);
        //this.el.addClass(this.focusCls);
        this.innerWrap.addClass(this.focusCls);
    },
    onBlur: function(e) {
        Ext.form.Checkbox.superclass.onBlur.call(this, e);
        //this.el.removeClass(this.focusCls);
        this.innerWrap.removeClass(this.focusCls);
    },
    onClick: function(e) {
        if (e.getTarget().htmlFor != this.el.dom.id) {
            if (e.getTarget() != this.el.dom) {
                this.el.focus();
            }
            if (!this.disabled && !this.readOnly) {
                this.toggleValue();
            }
        }
        //e.stopEvent();
    },
    onEnable: Ext.form.Checkbox.superclass.onEnable,
    onDisable: Ext.form.Checkbox.superclass.onDisable,
    onKeyUp: undefined,
    setValue: function(v) {
        var checked = this.checked;
        this.checked = (v === true || v === 'true' || v == '1' || String(v).toLowerCase() == 'on');
        if (this.rendered) {
            this.el.dom.checked = this.checked;
            this.el.dom.defaultChecked = this.checked;
            this.wrap[this.checked ? 'addClass' : 'removeClass'](this.checkedCls);
            //this.imageEl[this.checked ? 'addClass' : 'removeClass'](this.checkedCls);
        }
        if (checked != this.checked) {
            this.fireEvent("check", this, this.checked);
            if (this.handler) {
                this.handler.call(this.scope || this, this, this.checked);
            }
        }
    },
    getResizeEl: function() {
        //if(!this.resizeEl){
        //this.resizeEl = Ext.isSafari ? this.wrap : (this.wrap.up('.x-form-element', 5) || this.wrap);
        //}
        //return this.resizeEl;
        return this.wrap;
    },
    markInvalid: Ext.form.Checkbox.superclass.markInvalid,
    clearInvalid: Ext.form.Checkbox.superclass.clearInvalid,
    validationEvent: 'click',
    validateOnBlur: false,
    validateValue: function(value) {
        if (this.vtype) {
            var vt = Ext.form.VTypes;
            if (!vt[this.vtype](value, this)) {
                this.markInvalid(this.vtypeText || vt[this.vtype + 'Text']);
                return false;
            }
        }
        if (typeof this.validator == "function") {
            var msg = this.validator(value);
            if (msg !== true) {
                this.markInvalid(msg);
                return false;
            }
        }
        return true;
    }
});

Ext.override(Ext.KeyMap, {
    addBinding: function(config) {
        if (Ext.isArray(config)) {
            for (var i = 0, len = config.length; i < len; i++) {
                this.addBinding(config[i]);
            }
            return;
        }
        var keyCode = config.key,
                shift = config.shift,
                ctrl = config.ctrl,
                alt = config.alt,
                fn = config.fn || config.handler,
                scope = config.scope;
        if (config.stopEvent) {
            this.stopEvent = config.stopEvent;
        }
        if (typeof keyCode == "string") {
            var ks = [];
            var keyString = keyCode.toUpperCase();
            for (var j = 0, len = keyString.length; j < len; j++) {
                ks.push(keyString.charCodeAt(j));
            }
            keyCode = ks;
        }
        var keyArray = Ext.isArray(keyCode);
        var handler = function(e) {
            if (((shift === undefined) || (shift === e.shiftKey)) &&
                    ((ctrl === undefined) || (ctrl === e.ctrlKey)) &&
                    ((alt === undefined) || (alt === e.altKey))) {
                var k = e.getKey();
                if (keyArray) {
                    for (var i = 0, len = keyCode.length; i < len; i++) {
                        if (keyCode[i] == k) {
                            if (this.stopEvent) {
                                e.stopEvent();
                            }
                            fn.call(scope || window, k, e);
                            return;
                        }
                    }
                } else {
                    if (k == keyCode) {
                        if (this.stopEvent) {
                            e.stopEvent();
                        }
                        fn.call(scope || window, k, e);
                    }
                }
            }
        };
        this.bindings.push(handler);
    }
});

//Array overrides
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

//mixeds
Util = {
    fToolTipShow: function(component, text) {
        component.ttp = (!component.ttp) ? new Ext.ToolTip({
            target: component.getEl(),
            autoHeight: true,
            autoWidth: true,
            autoHide: true,
            maxWidth: 200,
            anchor: 'left',
            title: text,
            trackMouse: true
        }) : component.ttp.setTitle(text);
    },
    str2Boolean: function(string) {
        if (string == null)
            return false;
        if (typeof string === 'boolean')
            return string;
        if (typeof string === 'undefined')
            return false;
        switch (string.toLowerCase()) {
            case 'true' :
            case 'yes':
            case '1':
            case 'on':
                return true;
            case 'false':
            case 'no' :
            case '0':
            case null:
            case 'off':
                return false;
            default:
                return Boolean(string);
        }
    }
};



function ucfirst(str) {
    var firstLetter = str.substr(0, 1);
    return firstLetter.toUpperCase() + str.substr(1);
}

function isDefined(variable) {
    return (typeof (window[variable]) == "undefined") ? false : true;
}




/**
 * @name mostrarMensaje
 * @see Sobreescribiendo la función mostrarMensaje de ucid-all.js, añadiéndole el parámetro scope.
 */
/*mostrarMensaje = function(tipo, msg, fn, detalle) {
    var buttons = new Array(Ext.MessageBox.OK, Ext.MessageBox.OKCANCEL, Ext.MessageBox.OK);
    var title = new Array('Informaci&oacute;n', 'Confirmaci&oacute;n', 'Error');
    var icons = new Array(Ext.MessageBox.INFO, Ext.MessageBox.QUESTION, Ext.MessageBox.ERROR);
    //con switch por si surgen nuevos tipos de mensajes
    //para los de tipo 4 y 5 se puede hacer con IF-ELSE con menos codigo en caso de que no vayan a surgir nuevos tipos de mensajes
    switch (tipo)
    {
        case 4:
            if (!winError)
            {
                winError = new Ext.Window({
                    title: ' ERROR ',
                    modal: true,
                    width: 400,
                    minWidth: 300,
                    buttonAlign: 'center',
                    autoHeight: true,
                    closeAction: 'hide',
                    bodyBorder: false,
                    layout: 'fit',
                    defaults: {
                        frame: true,
                        border: false
                    },
                    items: new Ext.Panel({
                        frame: true,
                        monitorResize: true,
                        autoHeight: true,
                        layout: 'column',
                        items: [{
                                columnWidth: .2,
                                items: {
                                    style: 'margin:2px 0px 0px 2px;',
                                    html: '<div id="iconoERROR" class="iconoERROR></div>'
                                }
                            }, {
                                columnWidth: .7,
                                items: {
                                    xtype: 'panel',
                                    autoHeight: true,
                                    html: '<div id="pMSG">' + msg + '</div>'
                                }
                            }, {
                                columnWidth: 1,
                                items: new Ext.form.FieldSet({
                                    autoScroll: true,
                                    layout: 'form',
                                    title: ' Detalles : ',
                                    autoWidth: true,
                                    html: '<div id="pDetalle">' + detalle + '</div>',
                                    autoHeight: true,
                                    collapsed: true,
                                    collapsible: true
                                })
                            }]
                    }),
                    buttons: [{
                            text: 'OK',
                            handler: function() {
                                winError.hide();
                                if (typeof (fn) == 'function')
                                    fn();
                            }
                        }]
                });
            }
            winError.show(Ext.getBody());
            document.getElementById("pMSG").innerHTML = msg;
            document.getElementById("pDetalle").innerHTML = detalle;
            break;
        case 5:
            if (winConfirmDetalles)
                winConfirmDetalles.destroy();
                winConfirmDetalles = new Ext.Window({
                title: ' Confirmaci&oacute;n ',
                modal: true,
                width: 400,
                minWidth: 300,
                buttonAlign: 'center',
                autoHeight: true,
                closeAction: 'hide',
                bodyBorder: false,
                layout: 'fit',
                defaults: {
                    frame: true,
                    border: false
                },
                items: new Ext.Panel({
                    frame: true,
                    monitorResize: true,
                    autoHeight: true,
                    layout: 'column',
                    items: [{
                            columnWidth: .2,
                            items: {
                                style: 'margin:2px 0px 0px 2px;',
                                html: '<div id="iconoCONFIRM" class="iconoCONFIRM></div>'
                            }
                        }, {
                            columnWidth: .7,
                            items: {
                                xtype: 'panel',
                                autoHeight: true,
                                html: '<div id="pMSGcd">' + msg + '</div>'
                            }
                        }, {
                            columnWidth: 1,
                            items: new Ext.form.FieldSet({
                                autoScroll: true,
                                layout: 'form',
                                title: ' Detalles : ',
                                autoWidth: true,
                                html: '<div id="cDetalle">' + detalle + '</div>',
                                autoHeight: true,
                                collapsed: true,
                                collapsible: true
                            })
                        }, {
                            columnWidth: 1,
                            items: {
                                xtype: 'panel',
                                autoHeight: true,
                                html: '<div>Oprima <b>Cancelar</b> para abortar o <b>Aceptar</b> para proseguir con la operaci&oacute;n</div>'
                            }
                        }]
                }),
                buttons: [
                    {
                        text: 'Cancelar',
                        handler: function()
                        {
                            winConfirmDetalles.hide();
                        }
                    },
                    {
                        text: 'Aceptar',
                        handler: function()
                        {
                            winConfirmDetalles.hide();
                            if (typeof (fn) == 'function')
                                fn();
                        }
                    }
                ]
            });
            winConfirmDetalles.show(Ext.getBody());
            document.getElementById("pMSGcd").innerHTML = msg;
            document.getElementById("cDetalle").innerHTML = detalle;
            break;
        case 6:
            var styleLeaf = document.createElement('style');
            styleLeaf.innerHTML = "" +
                    ".msg .x-box-mc {font-size: 9px;}" +
                    "#msg-error , #msg-div{position: absolute;left: 40%;top: 10px;width: 300px;z-index: 20000;}" +
                    'div#imgError{background: url("/lib/UCID/images/error.png") no-repeat left;width: 40px;height: 40px;float: left;margin: -25px 0px 0px -25px;}' +
                    'div#imgOk{background: url("/lib/UCID/images/ok.png") no-repeat left;width: 40px;height: 40px;float: left;margin: -25px 0px 0px -25px;}' +
                    "#msg-error .msg {border-radius: 6px;-moz-border-radius: 6px;background: #F6F6F6;border: 2px solid #CC3333;margin-top: 10px;padding: 10px 15px;color: #990000;box-shadow: 2px 2px 15px #CC3333;}" +
                    "#msg-error .msg h3, .msg p {margin: 0 0 8px;font-size: 12px;font-family: helvetica, tahoma, verdana, sans-serif;}" +
                    "#msg-div .msg {border-radius: 6px;-moz-border-radius: 6px;background: #F6F6F6;border: 2px solid #3764A0;margin-top: 10px;padding: 10px 15px;color: #04408c;box-shadow: 2px 2px 15px #3764A0;}" +
                    "#msg-div .msg h3, .msg p {margin: 0 0 8px;font-size: 12px;font-family: helvetica, tahoma, verdana, sans-serif;}"
                    ;
            document.body.appendChild(styleLeaf);
            var msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-error'}, true);
            var mensaje = Ext.DomHelper.append(msgCt, '<div class="msg"><div id="imgError"></div><h3>Error</h3><p>' + msg + '</p></div>', true);
            mensaje.slideIn('t').pause(4).ghost("t", {remove: true});
            break;
        case 7:
            var styleLeaf = document.createElement('style');
            styleLeaf.innerHTML = "" +
                    ".msg .x-box-mc {font-size: 9px;}" +
                    "#msg-error , #msg-div{position: absolute;left: 40%;top: 10px;width: 300px;z-index: 20000;}" +
                    'div#imgError{background: url("/lib/UCID/images/error.png") no-repeat left;width: 40px;height: 40px;float: left;margin: -25px 0px 0px -25px;}' +
                    'div#imgOk{background: url("/lib/UCID/images/ok.png") no-repeat left;width: 40px;height: 40px;float: left;margin: -25px 0px 0px -25px;}' +
                    "#msg-error .msg {border-radius: 6px;-moz-border-radius: 6px;background: #F6F6F6;border: 2px solid #CC3333;margin-top: 10px;padding: 10px 15px;color: #990000;box-shadow: 2px 2px 15px #CC3333;}" +
                    "#msg-error .msg h3, .msg p {margin: 0 0 8px;font-size: 12px;font-family: helvetica, tahoma, verdana, sans-serif;}" +
                    "#msg-div .msg {border-radius: 6px;-moz-border-radius: 6px;background: #F6F6F6;border: 2px solid #3764A0;margin-top: 10px;padding: 10px 15px;color: #04408c;box-shadow: 2px 2px 15px #3764A0;}" +
                    "#msg-div .msg h3, .msg p {margin: 0 0 8px;font-size: 12px;font-family: helvetica, tahoma, verdana, sans-serif;}"
                    ;
            document.body.appendChild(styleLeaf);
            var msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
            //<h3>Informaci&oacute;n</h3>
            var mensaje = Ext.DomHelper.append(msgCt, '<div class="msg"><div id="imgOk"></div><h3>Informaci&oacute;n</h3><p>' + msg + '</p></div>', true);
            mensaje.slideIn('t').pause(4).ghost("t", {remove: true});
            break;
        default:
            Ext.MessageBox.show({
                title: title[tipo - 1],
                msg: msg,
                buttons: buttons[tipo - 1],
                icon: icons[tipo - 1],
                fn: fn
            });
    }
}*/

