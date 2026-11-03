if (!document.getElementById('common-style')) {
    //agregando los estilos del componente
    var styleLeaf = document.createElement('style');
    styleLeaf.id = 'common-style';
    //alineando en el centro, los iconos de la fuente en las filas de un grid
    styleLeaf.innerHTML = "tr [class*=\"icondistra-\"]{vertical-align:middle;text-align: center;}";

    document.body.appendChild(styleLeaf);
}

Ext.override(Ext.form.TextField, {
    validateValue: function (A) {
        if (A.length < 1 || A === this.emptyText) {
            if (this.allowBlank) {
                this.clearInvalid();
                return true
            } else {
                this.markInvalid(this.blankText);
                return false
            }
        }
        if (A.length < this.minLength) {
            this.markInvalid(String.format(this.minLengthText, this.minLength));
            return false
        }
        if (A.length > this.maxLength) {
            this.markInvalid(String.format(this.maxLengthText, this.maxLength));
            return false
        }
        if (this.vtype) {
            var C = Ext.form.VTypes;
            if (!C[this.vtype](A, this)) {
                this.markInvalid(this.vtypeText || C[this.vtype + "Text"]);
                return false
            }
        }
        if (typeof this.validator == "function") {
            var B = this.validator(A);
            if (B !== true) {
                this.markInvalid(B);
                return false
            }
        }
        if (this.regex && !this.regex.test(A)) {
            this.markInvalid(this.regexText);
            return false
        }
        return true
    }
});

Ext.override(Ext.Window, {
    initComponent: Ext.Window.prototype.initComponent.createInterceptor(function () {
        if (!this.autoValidate) {
            this.autoValidate = false;
        }
        if (this.autoFocus == false) {
            return;
        }
        if (this.buttons) {
            this.setDefaultFocus();
        }
        this.on({
            show: function () {
                var dialog = Ext.MessageBox.getDialog();
                if (dialog && this.id == dialog.id) {
                    this.setDialogFocus();
                } else {
                    this.setWindowFocus();
                }
            }
        });
    }),
    setDialogFocus: function () {
        var me = this;
        if (this.focused) {
            return;
        }
        Ext.EventManager.on(this.el, 'keydown', function (e) {
            me.focused = true;
            if (e.getKey() == Ext.EventObject.TAB) {
                var target = e.getTarget();
                while (target && target.nodeType === 1 && target !== document.body) {
                    var cmp = Ext.getCmp(target.id);
                    if (cmp && (cmp.text == 'Cancelar' || cmp.text == 'Cancel')) {
                        var dialog = Ext.MessageBox.getDialog(),
                            btncancel = dialog.buttons[dialog.buttons.length - 1];
                        for (var k = 0; k < dialog.buttons.length; k++) {
                            var btnacept = dialog.buttons[k];
                            if (!btnacept.hidden) {
                                break;
                            }
                        }
                        if (btnacept && cmp.id == btncancel.id) {
                            e.preventDefault();
                            btnacept.focus();
                        }
                        break;
                    }
                    target = target.parentNode;
                }
            }
        });
    },
    setWindowFocus: function () {
        var count = 0,
            me = this,
            first = me.firstElement,
            last = me.buttons ? me.buttons[me.buttons.length - 1] : null;
        for (k in this.buttons) {
            if (this.buttons[k].hidden == false) {
                count++;
            }
        }
        if (this.firstElement && count == 3) {
            this.firstElement.focus(false, 100);
        }
        if (me.focused || !first || !last) {
            return;
        }
        Ext.EventManager.on(this.el, 'keydown', function (e) {
            me.focused = true;
            if (e.getKey() == Ext.EventObject.TAB) {
                var target = e.getTarget();
                while (target && target.nodeType === 1 && target !== document.body) {
                    var cmp = Ext.getCmp(target.id);
                    if (cmp) {
                        if (cmp == last && e.shiftKey != true) {
                            e.preventDefault();
                            first.focus(true);
                        }
                        if (cmp == first && e.shiftKey == true) {
                            e.preventDefault();
                            last.focus(true);
                        }
                        break;
                    }
                    target = target.parentNode;
                }
            }
        });
    },
    setDefaultFocus: function () {
        for (k in this.buttons) {
            var first = this.buttons[k];
            if (!first.hidden) {
                this.defaultButton = first.id;
                break;
            }
        }
    }
});

Ext.override(Ext.ToolTip, {
    autoHide: true
});

Ext.override(Ext.Toolbar, {
    height: 26
});

Ext.override(Ext.grid.GridPanel, {
    initComponent: Ext.grid.GridPanel.prototype.initComponent.createInterceptor(function () {
        if (typeof this.loadMask == 'string') {
            this.loadMask = {
                msg: this.loadMask
            }
        }
    })
});

