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
                this.setWindowFocus();
            }
        });
    }),
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
        if (!first || !last) {
            return;
        }

        last.getEl().addKeyMap([
            {
                key: Ext.EventObject.TAB,
                stopEvent: true,
                fn: function () {
                    first.focus(true, true);
                }
            }
        ]);

        first.getEl().addKeyMap({
            key: Ext.EventObject.TAB,
            shift: true,
            stopEvent: true,
            fn: function () {
                last.focus();
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