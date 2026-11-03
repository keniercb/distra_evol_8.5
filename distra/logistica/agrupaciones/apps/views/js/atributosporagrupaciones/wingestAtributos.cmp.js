Ext.ns('Ext.erp');
Ext.erp.wingestAtributo = Ext.extend(Ext.Window, {
    constructor: function(config) {
        var _this = this;
//        Ext.apply(Ext.form.VTypes, {
//            daterange: function(val, field) {
//                var date = field.parseDate(val);
//                if (!date) {
//                    return;
//                }
//                if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
//                    var start = _this.fechainicio;//Ext.getCmp(field.startDateField);
//                    start.setMaxValue(date);
//                    start.validate();
//                    this.dateRangeMax = date;
//                } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
//                    var end = _this.fechafin;//Ext.getCmp(field.endDateField);
//                    end.setMinValue(date);
//                    end.validate();
//                    this.dateRangeMin = date;
//                }
//                return true;
//            }
//        });
        Ext.apply(this, config);
        this.modal = true;
        this.layout = 'fit';
        this.width = 650;
        this.autoHeight = true;
        this.constrain = true;
        this.autoValidate = (_this.opcion == 'modif') ? false : true;
        var record = '';
        if (_this.opcion == 'modif') {
            var indexRecord = _this.GridPanel.getStore().find('idatributo', _this.panelTree.getNodoSeleccionado().attributes.idatributo);
            record = _this.GridPanel.getStore().getAt(indexRecord);
            console.info(record);
        }
        this.listeners = {
            'show': function() {
                if (_this.opcion == 'modif') {
                    _this.formPanel.getForm().loadRecord(record);
                    var valCheckvaloresnulos = (record.data.permitenulo == 0) ? 1 : 0;
                    var valChecknivelnomeclador = (record.data.nivelnomenclador == 1) ? 1 : 0;
                    _this.chekvaloresnulos.setValue(valCheckvaloresnulos);
                    _this.cheknivelnomenclador.setValue(valChecknivelnomeclador);
                    _this.comboNomenclador.setValue(record.data.idtablanomdinamico);
                    _this.formPanel.getForm().items.each(function(field) {
                        field.originalValue = field.getValue();
                    });
                }
            }
        }
        this.txtfielDdenominacion = new Ext.form.TextField({
            fieldLabel: _this.idioma.lbDenominacion,
            name: 'denominacion',
            anchor: '95%',
            allowBlank: false,
            xtype: 'textfield',
            regexText: _this.idioma.lbValorIncorrectoDenomAtributo,
            regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9\%\s\/\"\,\.]+([_/\s\/]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9\%\(\)\"\,\.]+)$/,
            /*regex: /^([a-zA-Z0-9\s\(\)\/\_ÁÉÝÓÚÑáéíúóñ]+ ?[a-zA-Z0-9\ s\(\)\/\_ÁÉÝÓÚÑáéíúóñ?]*){1,50}$/,
             maskRe: /^([a-zA-Z0-9\s\(\)\/\_ÁÉÝÓÚÑáéíúóñ]+ ?[a-zA-Z0-9\s\(\)\/\_ÁÉÝÓÚÑáéíúóñ?]*){1,50}$/,*/
            maxLength: 50,
            minLength: 2,
            minLengthText: _this.idioma.lbMinTextDenominacion,
            maxLengthText: _this.idioma.lbMaxTextDenominacion,
            listeners: {
                'render': function(field) {
                    field.focus(false, 1000);
                }
            }
        });
        this.cmbtipodato = new Ext.form.ComboBox({
            displayField: 'denominacion',
            name: 'idtipodato',
            valueField: 'idtipodato',
            hiddenName: 'idtipodato',
            triggerAction: 'all',
            anchor: '95%',
            fieldLabel: _this.idioma.lbTipoDato,
            forceSelection: true,
            allowBlank: false,
            mode: 'local',
            store: new Ext.data.Store({
                url: 'getTiposDatos',
                autoLoad: true,
                reader: new Ext.data.JsonReader({
                    totalProperty: "total",
                    root: "data",
                    //id: "idtipodato"
                }, [
                    {
                        name: 'idtipodato'
                    },
                    {
                        name: 'denominacion'
                    }
                ]),
                listeners: {
                    'load': function(st, rd, op) {
                        if (_this.opcion == 'modif') {
                            _this.cmbtipodato.setValue(record.data.idtipodato);
                            _this.cmbtipodato.fireEvent('select', _this.cmbtipodato);
                            _this.cargarDatos(record);
                        } else {
                            _this.cmbtipodato.setValue(st.getAt(0).data.idtipodato);
                            _this.cmbtipodato.fireEvent('select', _this.cmbtipodato);
                        }
                    }
                }
            }),
            listeners: {
                select: function(cmb) {
                    _this.configurarFormulario(cmb.getValue());
                }
            }
        });
        this.cheknivelnomenclador = new Ext.form.Checkbox({
            inputValue: '1',
            boxLabel: _this.idioma.lbNivelNomenclador,
            name: 'nivelnomenclador',
            hidden: _this.globalHide,
            //checked: (_this.opcion == 'modif' && record.data.nivelnomenclador == 1) ? true : _this.globalDefault,
            hideLabel: true,
            style: 'margin-top: 20px;'
        });
        this.chekvaloresnulos = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbValoresNulos,
            hidden: _this.valoresNulosHide,
            name: 'permitenulo',
            hideLabel: true,
            //checked: (_this.opcion == 'modif' && record.data.permitenulo == 0) ? true : false,
            inputValue: '-1',
            style: 'margin-top: 10px;'
        });
        this.txtfielLongitud = new Ext.form.TextField({
            fieldLabel: _this.idioma.lbLongitud,
            name: 'longitud',
            minValue: 1,
            hidden: true,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            anchor: '95%',
            enableKeyEvents: true,
            validator: function() {
                if (_this.cmbtipodato.getValue() == 1) {
                    if (_this.txtfielLongitud.getValue() <= 19) {
                        return true;
                    } else {
                        return _this.idioma.lbValorMax.replace('_', 19);
                    }
                }
                if (_this.cmbtipodato.getValue() == 2) {
                    if (_this.txtfielLongitud.getValue() <= 50) {
                        return true;
                    } else {
                        return _this.idioma.lbValorMax.replace('_', 50);
                    }
                }
                if (_this.cmbtipodato.getValue() == 6) {
                    if (_this.txtfielLongitud.getValue() <= 255) {
                        return true;
                    } else {
                        return _this.idioma.lbValorMax.replace('_', 255);
                    }
                }

            },
            //value: (_this.opcion == 'modif') ? record.data.longitud : null,
            listeners: {
                'change': function(cmp) {
                    if (cmp.isValid()) {
                        var longitud = cmp.getRawValue();
                        var valor = '';

                        if (_this.numberfieldlimiteInferior.isVisible()) {
                            for (var i = 0; i < longitud - 1; i++) {
                                valor += '9';
                            }
                            if (longitud == 1) {
                                _this.numberfieldlimiteInferior.maxLength = longitud;
                                _this.numberfieldlimiteInferior.maxLengthText = "El tama&ntilde;o m\xe1ximo requerido es 1 d&iacute;gito(s.";

                                _this.numberfieldlimiteInferior.maxValue = valor + '8';
                                _this.numberfieldlimiteInferior.maxText = _this.idioma.lbValorMax.replace('_', valor + '8');

                                _this.numerfieldlimiteSuperior.maxLength = longitud;
                                _this.numerfieldlimiteSuperior.maxLengthText = "El tama&ntilde;o m\xe1ximo requerido es 1 d&iacute;gito(s.",
                                        _this.numerfieldlimiteSuperior.maxValue = valor + '9';
                                _this.numerfieldlimiteSuperior.maxText = _this.idioma.lbValorMax.replace('_', valor + '9');
                            } else {
                                _this.numberfieldlimiteInferior.maxLength = longitud;
                                _this.numberfieldlimiteInferior.maxLengthText = _this.idioma.lbLongitudMax.replace('_', longitud);

                                _this.numberfieldlimiteInferior.maxValue = valor + '8';
                                _this.numberfieldlimiteInferior.maxText = _this.idioma.lbValorMax.replace('_', valor + '8');

                                _this.numerfieldlimiteSuperior.maxLength = longitud;
                                _this.numerfieldlimiteSuperior.maxLengthText = _this.idioma.lbLongitudMax.replace('_', longitud);

                                _this.numerfieldlimiteSuperior.maxValue = valor + '9';
                                _this.numerfieldlimiteSuperior.maxText = _this.idioma.lbValorMax.replace('_', valor + '9');
                            }
                            _this.numberfieldlimiteInferior.enable();
                        }
                    }
                }
            }
        });
        this.comboExpresionesReg = new Ext.form.ComboBox({
            displayField: 'denominacion',
            xtype: 'combo',
            hidden: true,
            name: 'idexpresionregular',
            valueField: 'idexpresionregular',
            triggerAction: 'all',
            readOnly: true,
            hiddenName: 'idexpresionregular',
            mode: 'remote',
            anchor: '95%',
            fieldLabel: _this.idioma.lbExpRegular,
            editable: false,
            store: new Ext.data.Store({
                url: 'getExpresiones',
                autoLoad: true,
                reader: new Ext.data.JsonReader({
                    root: "data",
                    id: "idexpresionregular"
                }, [
                    {
                        name: 'idexpresionregular'
                    },
                    {
                        name: 'denominacion'
                    }
                ])
            })
        });
        this.numberfieldlimiteInferior = new Ext.form.NumberField({
            fieldLabel: _this.idioma.lbLimitInferior,
            name: 'limiteinferior',
            disabled: true,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            minValue: 0,
            hidden: true,
            anchor: '95%',
            enableKeyEvents: true,
            listeners: {
                'change': function(cmp) {
                    var valor = parseInt(cmp.getRawValue());

                    _this.numerfieldlimiteSuperior.minValue = valor;
                    _this.numerfieldlimiteSuperior.minText = _this.idioma.lbValorMin.replace('_', valor);

                    _this.numerfieldlimiteSuperior.enable();
                }
            }
        });
        this.numerfieldlimiteSuperior = new Ext.form.NumberField({
            fieldLabel: _this.idioma.lbLimitSuperior,
            name: 'limitesuperior',
            hidden: true,
            maskRe: /^([1-9]+ ?[0-9]*)+$/,
            regex: /^([1-9]+ ?[0-9]*)+$/,
            disabled: true,
            minValue: 1,
            anchor: '95%'
        });
        this.chekdecimal = new Ext.form.Checkbox({
            fieldLabel: _this.idioma.lbDecimal,
            hidden: true,
            name: 'decimal',
            inputValue: '1',
            listeners: {
                'check': function(th, ch) {
                    Ext.getCmp('cprecision').hide(); // XXX
                    if (ch)
                        Ext.getCmp('cprecision').show(); // XXX
                }
            }

        });
        this.numberFieldprecision = new Ext.form.NumberField({
            fieldLabel: _this.idioma.lbPrecision,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            maxLength: 1,
            hidden: true,
            name: 'precision',
            maxLengthText: "El tama&ntilde;o m\xe1ximo requerido es 1 d&iacute;gito(s.",
            maxText: _this.idioma.lbValorMax.replace('_', 6),
            minValue: 0,
            maxValue: 6,
            width: 50
                    //value: (_this.opcion == 'modif') ? record.data.precision : null
        });

        this.comboNomenclador = new Ext.form.ComboBox({
            displayField: 'alias',
            valueField: 'idtabla',
            hiddenName: 'tabla',
            name: 'tftabla',
            hidden: true,
            //name: 'idtablanomdinamico',
            fieldLabel: _this.idioma.lbTablas,
            triggerAction: 'all',
            forceSelection: true,
            allowBlank: false,
            mode: 'local',
            anchor: '95%',
            listeners: {
                'select': function(combo, record, index) {
                    _this.idtablaNom = combo.getValue();
                }
            },
            store: new Ext.data.Store({
                autoLoad: true,
                url: 'getTablas',
                reader: new Ext.data.JsonReader({
                    root: "data"
                }, [
                    {
                        name: 'idtabla'
                    },
                    {
                        name: 'tabla'
                    },
                    {
                        name: 'alias'
                    }
                ]),
                listeners: {
                    'load': function() {
                        if ((_this.opcion == 'modif') && record.data.idtablanomdinamico) {
                            _this.comboNomenclador.setValue(record.data.idtablanomdinamico);
                        }
                    }
                }})
        });
//        this.fechainicio = new Ext.form.DateField({
//            fieldLabel: _this.idioma.lbFechaInicio,
//            format: 'd/m/Y',
//            //id: 'fecha_inicio',
//            name: 'fecha_inicio',
//            anchor: '95%',
//            vtype: 'daterange',
//            endDateField: 'fecha_fin'
//        });
//        this.fechafin = new Ext.form.DateField({
//            fieldLabel: _this.idioma.lbFechaFin,
//            format: 'd/m/Y',
//            //id: 'fecha_fin',
//            name: 'fecha_fin',
//            vtype: 'daterange',
//            startDateField: 'fecha_inicio',
//            anchor: '95%'
//        });
        this.formPanel = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            autoHeight: true,
            bodyStyle: 'padding:5px 5px 0',
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
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .70,
                            layout: 'form',
                            items: [
                                _this.txtfielDdenominacion,
                                _this.cheknivelnomenclador,
                            ]
                        },
                        {
                            columnWidth: .30,
                            layout: 'form',
                            items: [
                                _this.cmbtipodato
                            ]
                        },
                        {
                            columnWidth: 1,
                            layout: 'form',
                            items: [
                                _this.chekvaloresnulos,
                                new Ext.form.FieldSet({
                                    layout: 'column',
                                    id: 'fs_fieldset',
                                    autoHeight: true,
                                    items: [
                                        {
                                            columnWidth: .33,
                                            id: 'clongitud',
                                            hidden: true,
                                            layout: 'form',
                                            listeners: {
                                                'hide': function() {
                                                    _this.txtfielLongitud.hide();
                                                },
                                                'show': function() {
                                                    _this.txtfielLongitud.show();
                                                }
                                            },
                                            items: [
                                                _this.txtfielLongitud,
                                                {
                                                    layout: 'column',
                                                    items: [
                                                        {
                                                            columnWidth: .5,
                                                            id: 'cdecimal',
                                                            hidden: true,
                                                            layout: 'form',
                                                            listeners: {
                                                                'hide': function() {
                                                                    _this.chekdecimal.hide();
                                                                },
                                                                'show': function() {
                                                                    _this.chekdecimal.show();
                                                                }
                                                            },
                                                            items: [_this.chekdecimal]
                                                        },
                                                        {
                                                            columnWidth: .5,
                                                            id: 'cprecision',
                                                            hidden: true,
                                                            layout: 'form',
                                                            listeners: {
                                                                'hide': function() {
                                                                    _this.numberFieldprecision.hide();
                                                                },
                                                                'show': function() {
                                                                    _this.numberFieldprecision.show();
                                                                }
                                                            },
                                                            items: [
                                                                _this.numberFieldprecision
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            columnWidth: .60,
                                            id: 'ccmbtabla',
                                            hidden: true,
                                            layout: 'form',
                                            listeners: {
                                                'hide': function() {
                                                    _this.comboNomenclador.hide();
                                                },
                                                'show': function() {
                                                    _this.comboNomenclador.show();
                                                }
                                            },
                                            items: [
                                                _this.comboNomenclador
                                            ]
                                        },
                                        {
                                            columnWidth: .40,
                                            id: 'ccmbcampovf',
                                            hidden: true,
                                            layout: 'form'
                                        },
                                        {
                                            columnWidth: 0.66,
                                            id: 'rgex',
                                            hidden: true,
                                            layout: 'form',
                                            listeners: {
                                                'hide': function() {
                                                    _this.comboExpresionesReg.hide();
                                                },
                                                'show': function() {
                                                    _this.comboExpresionesReg.show();
                                                }
                                            },
                                            items: [
                                                _this.comboExpresionesReg
                                            ]
                                        },
                                        {
                                            columnWidth: 0.33,
                                            id: 'mini',
                                            hidden: true,
                                            layout: 'form',
                                            listeners: {
                                                'hide': function() {
                                                    _this.numberfieldlimiteInferior.hide();
                                                },
                                                'show': function() {
                                                    _this.numberfieldlimiteInferior.show();
                                                }
                                            },
                                            items: [
                                                _this.numberfieldlimiteInferior
                                            ]
                                        },
                                        {
                                            columnWidth: 0.33,
                                            id: 'maxi',
                                            hidden: true,
                                            layout: 'form',
                                            listeners: {
                                                'hide': function() {
                                                    _this.numerfieldlimiteSuperior.hide();
                                                },
                                                'show': function() {
                                                    _this.numerfieldlimiteSuperior.show();
                                                }
                                            },
                                            items: [
                                                _this.numerfieldlimiteSuperior
                                            ]
                                        },
//                                        {
//                                            columnWidth: 0.33,
//                                            id: 'fini',
//                                            hidden: true,
//                                            layout: 'form',
//                                            items: (!_this.fechasHide) ? _this.fechainicio : ''
//                                        },
//                                        {
//                                            columnWidth: 0.33,
//                                            id: 'ffin',
//                                            hidden: true,
//                                            layout: 'form',
//                                            items: (!_this.fechasHide) ? _this.fechafin : ''
//                                        },
                                        {
                                            columnWidth: 0.33,
                                            id: 'idHideAtributo',
                                            xtype: 'hidden',
                                            name: 'idatributo'
                                        }/*,
                                         {
                                         columnWidth: 0.33,
                                         id: 'idHideAgrupacion',
                                         xtype:'hidden',
                                         name:'idagrupacion'
                                         }*/
                                    ]
                                })
                            ]
                        }
                    ]
                }
            ]
        });
        this.btnAceptarWinGestAtri = new Ext.Button({
            iconCls: 'aceptar',
            text: _this.idioma.lbBtnAceptar,
            tooltip: _this.idioma.lbTtBtnAceptar,
            handler: function() {
                _this.adicionarNuevoAtributoDin(_this.opcion);
            }
        });
        this.btnAplicarWinGestAtri = new Ext.Button({
            iconCls: 'aplicar',
            text: _this.idioma.lbBtnAplicar,
            tooltip: _this.idioma.lbTtBtnAplicar,
            hidden: (_this.opcion == 'modif'),
            handler: function() {
                _this.adicionarNuevoAtributoDin('apli');
            }
        });
        this.btnCancelarWinGestAtri = new Ext.Button({
            iconCls: 'cancelar',
            text: _this.idioma.lbBtnCancelar,
            tooltip: _this.idioma.lbTtBtnCancelar,
            handler: function() {
                _this.close();
            }
        });

        this.buttons = [_this.btnCancelarWinGestAtri, _this.btnAplicarWinGestAtri, _this.btnAceptarWinGestAtri];

        this.items = [_this.formPanel];

        Ext.erp.wingestAtributo.superclass.constructor.apply(this, arguments);
    },
    /*
     *  Función para cargar los datos en caso de modificar
     */
    cargarDatos: function(record) {
        var _this = this;
        if (record.data.decimal) {
            _this.chekdecimal.setValue(true);
            _this.chekdecimal.fireEvent('check', true, _this.chekdecimal);
        }

        Ext.getCmp('idHideAtributo').setValue(record.data.idatributo);

    },
    /*
     *  Función para adicionar un nuevo atributo dinámico
     */
    adicionarNuevoAtributoDin: function(option) {
        var _this = this;
        var nodoAgrupacion = _this.panelTree.getNodoSeleccionado();
        var denominacion = _this.txtfielDdenominacion.getValue();
        var cadena = _this.panelPadre.trimvalores(denominacion);
        var result = _this.GridPanel.getStore().find('denominacion', cadena);

        if (result == -1 || (option == 'modif')) {

            if (_this.txtfielLongitud.getValue().length <= 0 && _this.cmbtipodato.getValue() != 3) {
                _this.txtfielLongitud.setValue(19);
            }
            if (_this.formPanel.getForm().isValid()) {
                if (!_this.numberFieldprecision.getValue) {
                    _this.numberFieldprecision.setValue(null);
                }

                _this.formPanel.getForm().submit({
                    url: 'adicionarAtributo',
                    params: {
                        idagrupacion: nodoAgrupacion.attributes.idagrupacion
                    },
                    waitMsg: (option == 'modif') ? _this.idioma.lbWaitMsgModificar : _this.idioma.lbWaitMsgInsertar,
                    success: function(form, action) {

                        var resp = Ext.decode(action.response.responseText);

                        mostrarMensaje(1, (option != 'modif') ? _this.idioma.lbGuardarOk : _this.idioma.lbModificarOk);
                        if (option != 'modif') {
                            if (!nodoAgrupacion.isLeaf()) {
                                nodoAgrupacion.getLoader().load(nodoAgrupacion, function() {
                                    nodoAgrupacion.expand();
                                });
                            } else {
                                var nodoPadre = nodoAgrupacion.parentNode;
                                nodoPadre.getLoader().load(nodoPadre, function() {
                                    nodoPadre.expand();
                                });
                            }
                        } else {
                            var nodoPadre = nodoAgrupacion.parentNode;
                            nodoPadre.getLoader().load(nodoPadre, function() {
                                nodoPadre.expand();
                            });

                        }
                        _this.GridPanel.getStore().load();
                        if (option == 'apli') {
                            _this.formPanel.getForm().reset();
                            _this.formPanel.getForm().clearInvalid();
                        } else
                        {
                            _this.close();
                        }

                    },
                    failure: function(form, action) {
                        var resp = Ext.decode(action.response.responseText);
                        if (resp.codigoMsg == 2) {
                            mostrarMensaje(1, (option == 'modif') ? _this.idioma.lbModificarUso+ resp.denominaciones : _this.idioma.lbGuardarError);
                        } else {
                            mostrarMensaje(1, _this.idioma.lbGuardarError);
                        }
                    }

                });
            } else {
                mostrarMensaje(1, _this.idioma.lbCamposIncorrectos);
            }
        } else {
            mostrarMensaje(1, _this.idioma.lbGuardarCampoDuplicado);
        }
    },
    habilitarbotonesWinGest: function() {
        this.btnAplicarWinGestAtri.enable();
        this.btnAceptarWinGestAtri.enable();
    },
    desabilitarbotonesWinGest: function() {
        this.btnAplicarWinGestAtri.disable();
        this.btnAceptarWinGestAtri.disable();
    },
    /*
     *  Función para configurar el formulario de la ventana en dependencia del tipo de atributo dinámico que se
     *  quiera adicionar
     */
    configurarFormulario: function(op) {
        var _this = this;
        this.comboExpresionesReg.disable();
        Ext.getCmp('rgex').hide();

        this.txtfielLongitud.disable();
        Ext.getCmp('clongitud').hide();
        Ext.getCmp('cdecimal').hide();
        this.chekdecimal.hide();
        Ext.getCmp('cprecision').hide();
        this.numberfieldlimiteInferior.disable();
        Ext.getCmp('mini').hide();
        this.numerfieldlimiteSuperior.disable();
        Ext.getCmp('maxi').hide();
        this.txtfielLongitud.disable();
        Ext.getCmp('clongitud').hide();
//        if (this.fechainicio)
//            this.fechainicio.disable();
//        Ext.getCmp('fini').hide();
//        if (this.fechafin);
//        this.fechafin.disable();
//        Ext.getCmp('ffin').hide();
        this.comboNomenclador.disable();
        Ext.getCmp('ccmbtabla').hide();
        Ext.getCmp('ccmbcampovf').hide();

        // numero: 1 texto: 2 date: 3 chkbob: 4 nomenclador: 5
        if (op == 1) {
            Ext.getCmp('maxi').show();
            Ext.getCmp('cdecimal').show();
            //Ext.getCmp('limite_superior').enable();
            Ext.getCmp('mini').show();
            this.chekdecimal.show();
            //Ext.getCmp('limite_inferior').enable();
            Ext.getCmp('clongitud').show();
            _this.txtfielLongitud.enable();
            _this.txtfielLongitud.maxLength = 2;
            _this.txtfielLongitud.maxLengthText = _this.idioma.lbLongitudMax.replace('_', 2);
            _this.txtfielLongitud.validate();
        }
        if (op == 2) {
            Ext.getCmp('rgex').show();
            this.comboExpresionesReg.enable();
            Ext.getCmp('clongitud').show();
            this.txtfielLongitud.enable();
            this.txtfielLongitud.maxLength = 2;
            this.txtfielLongitud.maxLengthText = _this.idioma.lbLongitudMax.replace('_', 2);
            this.txtfielLongitud.validate();
        }
        if (op == 5) {
            Ext.getCmp('ccmbtabla').show();
            this.comboNomenclador.enable();
            Ext.getCmp('ccmbcampovf').show();
        }
        if (op == 6) {
            Ext.getCmp('clongitud').show();
            this.txtfielLongitud.enable();
            this.txtfielLongitud.maxLength = 3;
            this.txtfielLongitud.maxLengthText = _this.idioma.lbLongitudMax.replace('_', 3);
            this.txtfielLongitud.validate();
        }
        _this.doLayout();
    }
});
