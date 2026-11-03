var validate = {
    actions: new Array(),
    buttons: new Array(),
    accionesPermitidas: undefined,
    cargarAcciones: function (callBackFn) {
        Ext.Ajax.request({
            url: 'cargaracciones',
            method: 'POST',
            scope: this,
            params: {
                idfuncionalidad: window.frameElement.id
            },
            callback: function (opts, success, response) {
                if (success) {
                    var grantedActions = Ext.decode(response.responseText);
                    this.accionesPermitidas = grantedActions;
                    if (typeof callBackFn === 'function') {
                        callBackFn(opts, success, response);
                    }
                }
            }
        });
    },
    setPermisos: function (fn, scope, flagMostrar, flagCTALL, flagHabilitar) {
        var fun = function (opts, success, response) {
            var grantedActions = Ext.decode(response.responseText);
            var codMsg = grantedActions.codMsg;
            if (!codMsg) {
                for (var k in grantedActions) {
                    this.actions[k] = grantedActions[k].abreviatura;
                }
                for (var button in this.buttons) {
                    if (this.actions.indexOf(this.buttons[button].abreviatura) > -1 || (flagCTALL ? (this.actions.indexOf('ct') > -1 || this.actions.indexOf('all') > -1) : false)) {
                        if (button >= 0) {
                            if (flagMostrar) {
                                this.buttons[button].setVisible(true);
                            }
                            if (flagHabilitar) {
                                this.buttons[button].enable();
                            }
                        }
                    }
                }

            }
        }.bind(this);
        this.cargarAcciones(fun);
    },
    addButton: function (button) {
        this.buttons.push(button);
    },
    hideAllButtons: function () {
        for (var button in this.buttons) {
            if (button >= 0) {
                this.buttons[button].hide();
            }
        }
    },
    disableAllButtons: function () {
        for (var button in this.buttons) {
            if (button >= 0) {
                this.buttons[button].disable();
            }
        }
    },
    //primer flag pa que no muestre los botones, la segunda para no conciderar los ct y la tercera para no habilitar los botones
    checkPermisos: function (flagMostrar = true, flagCTALL = true, flagHabilitar = true) {
        if (!isNaN(window.frameElement.id)) {
            this.hideAllButtons();
            if (flagHabilitar) {
                this.disableAllButtons();
            }
            this.setPermisos(undefined, undefined, flagMostrar, flagCTALL, flagHabilitar);
        }
    },
    checkByAbreviatura: function (abreviatura) {
        if (this.accionesPermitidas.length) {
            for (var acciones in this.accionesPermitidas) {
                if (this.accionesPermitidas[acciones].abreviatura === abreviatura) {
                    return true;
                }
            }
        }
        return false;
    }
};
