Ext.ns('Ext.erp');
Ext.erp.wingestDenomGener = Ext.extend(Ext.Window, {
    constructor: function(config) {

        Ext.apply(this, config);
        var _this = this;
        this.layout = 'fit';
        this.modal = true;
        this.width = 300;
        this.autoValidate = (_this.opcion == 'modif') ? false : true;
        this.constrain = true;
        this.listeners = {
            'show': function() {
                if (_this.opcion == 'modif') {
                    _this.form.getForm().loadRecord(_this.record);
                    _this.form.getForm().items.each(function(field) {
                        field.originalValue = field.getValue();
                    });
                }
            }
        }
        _this.textArea = new Ext.form.TextArea({
            fieldLabel: _this.idioma.lbDenominacion,
            name: 'denominacion',
            anchor: '100%',
            allowBlank: false,
            regexText: _this.idioma.lbValorIncorrectoTextArea,
            regex: /^([a-zA-ZáéíóúñüÑ0-9-_/.\s]+ ?[a-zA-ZáéíóúñüÑ0-9-_/.\s]*)+$/,
            maskRe: /^([a-zA-ZáéíóúñüÑ0-9-_/.\s]+ ?[a-zA-ZáéíóúñüÑ0-9-_/.\s]*)+$/,
            maxLength: 50,
            //value: _this.valueText,
            listeners: {
                'valid': function(field) {
                    field.valido = true;
                    if (field.getValue().charAt(0) == ' ' || field.getValue().charAt(field.getValue().length - 1) == ' ') {
                        field.markInvalid(_this.idioma.lbValorIncorrectoTextArea);
                        field.valido = false;
                    } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                        field.markInvalid(_this.idioma.lbValorIncorrectoTextArea);
                        field.valido = false;
                    } else {
                        for (var i = 0; i < field.getValue().length; i++) {
                            var char = field.getValue().charAt(i);
                            if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                if ((i + 1) >= field.getValue().length) {
                                    field.markInvalid(_this.idioma.lbValorIncorrectoTextArea);
                                    field.valido = false;
                                } else {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbValorIncorrectoTextArea);
                                        field.valido = false;
                                    }
                                }
                            }

                        }
                    }
                },
                'render': function(field) {
                    field.focus(false, 1000);
                }
            }
        });
        _this.form = new Ext.FormPanel({
            frame: true,
            labelAlign: 'top',
            autoHeight: true,
            items: [_this.textArea],
            listeners: {
                'clientvalidation': function(fp, valid) {
                    var checkdirty = false;
                    fp.getForm().items.each(function(field) {
                        if (field.isDirty() && valid) {
                            checkdirty = true;
                            _this.habilitarbotonesWinGest();
                        }
                    });
                    if (!checkdirty) {
                        _this.desabilitarbotonesWinGest();
                    }
                }
            }
        });
        this.items = [_this.form];
        Ext.erp.wingestDenomGener.superclass.constructor.apply(this, arguments);
    }, habilitarbotonesWinGest: function() {
        this.btnAplicarWinGestAgrupa.enable();
        this.btnAceptarWinGestAgrupa.enable();
    },
    desabilitarbotonesWinGest: function() {
        this.btnAplicarWinGestAgrupa.disable();
        this.btnAceptarWinGestAgrupa.disable();
    }
});