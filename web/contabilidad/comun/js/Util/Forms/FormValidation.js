Ext.namespace('CON.Util.FormValidation');
CON.Util.FormValidation = Ext.extend(Object, {
    xtypesEvtents: undefined,
    comprobacionAdicional: undefined,
    arrButton: undefined,
    arrFormPanel: undefined,
    constructor: function (arrFormPanel, arrButton, comprobacionAdicional) {
        this.crearSetAndGet();
        this.initializeFunctions();
        this.crearTiposPermitidos();
        this.asignarForms(arrFormPanel);
        this.asignarBtns(arrButton);
        this.setComprobacionAdicional(comprobacionAdicional);
        this.crearValidacion();

    },
    crearValidacion: function () {
        var scope = this;
        var forms = this.getArrFormPanel();
        var tipos = this.getTiposPermitidos();
        if (forms.length > 1) {
            var funcadd = function (formActual, valid) {
                if (valid) {
                    var valido = true;
                    for (var i = 0; i < forms.length; i++) {
                        if (formActual.id != forms[i].id || formActual.id == undefined) {
                            if (!scope.isValid(forms[i], false)) {
                                valido = false;
                                break;
                            }
                        }
                    }
                    return valido;
                } else {
                    return false;
                }
            };
            this.setComprobacionAdicional(funcadd);
        }
        this.asignarValorInicial();
        forms.forEach(function (form, i) {
            form.cascade(function () {
                if (tipos[this.getXType()]) {
                    scope.accionesAdicionales(tipos, this);
                    var fn = scope.crearFuncComprobar(tipos, this, form);
                    this['fireEvent'] = this['fireEvent'].createSequence(fn);
                }
            });
        });

    },
    initializeFunctions: function () {

        this.habilitarBotones = function (habilitar) {
            this.getArrBtns().forEach(function (button, i) {
                button.setDisabled(!habilitar);
            });
        };

        this.isValid = function (form, ejecFunc = true) {
            var valor = this.obtenerValorActual();
            var valorInicial = this.obtenerValorInicial();
            var condicion;
            var valid = form.getForm().isValid();
            var fn = this.getComprobacionAdicional();
            if (typeof fn === 'function' && ejecFunc) {
                condicion = (valorInicial !== valor && valid && fn(form, valid));
            } else {
                condicion = (valorInicial !== valor && valid);
            }
            return condicion;
        };

        this.accionesAdicionales = function (tipos, cmp) {
            if (tipos[cmp.getXType()]['evt'] == 'keyup'
                && !cmp.enableKeyEvents)
            {
                cmp.enableKeyEvents = true;
                cmp.initEvents();
            }
        };

        this.crearFuncComprobar = function (tipos, cmp, form) {
            var scope = this;
            return function (e) {
                if (tipos[cmp.getXType()]['evt'] == e || e == 'blur') {
                    scope.comprobarFormulario(form);
                }
            };
        };

        this.asignarValorInicial = function () {
            var forms = this.getArrFormPanel();
            forms[0].valorInicial = this.obtenerValorActual();
            this.comprobarFormulario(forms[0]);
        };

        this.obtenerValorInicial = function () {
            var forms = this.getArrFormPanel();
            return forms[0].valorInicial;
        };

        this.obtenerValorActual = function () {
            var forms = this.getArrFormPanel();
            var valor = '';
            var temp = [];
            forms.forEach(function (form, i) {
                valor = valor + form.getForm().getValues(true) + '@';
                temp.push(valor);
                valor = '';
            });
            return temp.toString();
        };

        this.comprobarFormulario = function (form) {
            if (this.isValid(form)) {
                this.habilitarBotones(true);
            } else {
                this.habilitarBotones(false);
            }
        };

    },
    crearSetAndGet: function () {

        this.crearTiposPermitidos = function () {
            this.xtypesEvtents = {
                checkbox: {
                    evt: ['check']
                },
                combobox: {
                    evt: ['select']
                },
                combo: {
                    evt: ['select']
                },
                trigger: {
                    evt: ['change']
                },
                textarea: {
                    evt: ['keyup']
                },
                textfield: {
                    evt: ['keyup']
                },
                numberfield: {
                    evt: ['keyup']
                },
                radio: {
                    evt: ['check']
                },
                field: {
                    evt: ['keyup']
                },
                datefield: {
                    evt: ['select']
                }
            };
        };
        this.getTiposPermitidos = function () {
            return this.xtypesEvtents;
        };

        this.setArrBtns = function (arrButton) {
            this.arrButton = arrButton;
        };
        this.getArrBtns = function () {
            return this.arrButton;
        };

        this.asignarBtns = function (arrButton) {
            if (arrButton instanceof Array) {
                for (var i = 0; i < arrButton.length; i++) {
                    if (!(arrButton[i] instanceof Ext.Button)) {
                        //console.log('Los elementos del arreglo debe ser una instancia de Ext.Button');
                        return false;
                    }
                }
                this.setArrBtns(arrButton);
                return true;
            } else {
                //console.log('El segundo parametro debe ser un arreglo');
                return false;
            }
        };

        this.setArrFormPanel = function (arrFormPanel) {
            this.arrFormPanel = arrFormPanel;
        };
        this.getArrFormPanel = function () {
            return this.arrFormPanel;
        };

        this.asignarForms = function (arrFormPanel) {
            if (arrFormPanel instanceof Array) {
                for (var i = 0; i < arrFormPanel.length; i++) {
                    if (!(arrFormPanel[i] instanceof Ext.FormPanel)) {
                        //console.log('Los elementos del arreglo debe ser una instancia de Ext.Button');
                        return false;
                    }
                }
                this.setArrFormPanel(arrFormPanel);
                if (arrFormPanel.length > 1) {
                    var fn = function (fpanel, valid) {
                        for (var i = 0; i < arrFormPanel.length; i++) {
                            if (fpanel.getId() != arrFormPanel[i].getId()) {
                                if (!forms[i].getForm().isValid()) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    };
                    this.setComprobacionAdicional(fn);
                }
                return true;
            } else {
                //console.log('El segundo parametro debe ser un arreglo');
                return false;
            }
        };

        this.setComprobacionAdicional = function (comprobacionAdicional) {
            this.comprobacionAdicional = comprobacionAdicional;
        };
        this.getComprobacionAdicional = function () {
            return this.comprobacionAdicional;
        };

    }
});
