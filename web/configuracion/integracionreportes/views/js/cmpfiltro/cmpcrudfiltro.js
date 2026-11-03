Utilidades.Cmp.objCmpCrudFiltro = function (opcionesConfig) {
    var _this = this;
    var html = '';
    var btnaplicar = false;
    var change = false;
    _this.posteliminar = false;
    _this.valorpordefecto = null;
    Ext.QuickTips.init();

    _this.barraProgreso = new BarraEstado();
    //componente para el manejo de los mensajes de errores de texto regido
    _this.objValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    _this.crearWinCrudFiltro = function (parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas) {
        var accion = parametros.accion;
        var accionreporte = parametros.accionreporte;
        var st = parametros.st;
        var sm = parametros.sm;
        var tipo = (parametros.hasOwnProperty('tipo')) ? parametros.tipo : null;
        var nombretipo = (parametros.hasOwnProperty('nombretipo')) ? parametros.nombretipo : '';
        var idreporte = parametros.idreporte;
        var arrayidfiltros = parametros.arrayidfiltros;

        _this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacion',
            fieldLabel: 'Denominación',
            maxLength: 100,
            maxLengthText: 'El tamaño máximo requerido es 100 caracteres.',
            regex: _this.objValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.objValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            prevTab: '',
            nextTab: '',
            allowBlank: false,
            selectOnFocus: true,
            anchor: '99%',
            readOnly: false,
            value: (tipo == 6) ? 'Estructura' : '',
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                'render': function (c) {
                    if (accion == 'Modificar') {
                        c.getEl().on('keyup', function () {

                        }, c);
                    }
                }
            }
        });

        _this.tfnombreparametro = new Ext.form.TextField({
            id: 'tfnombreparametro',
            fieldLabel: 'Nombre del parámetro',
            maxLength: 50,
            maxLengthText: 'El tamaño máximo requerido es 50 caracteres.',
            regex: _this.objValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.objValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            prevTab: '',
            nextTab: '',
            allowBlank: false,
            selectOnFocus: true,
            anchor: '99%',
            readOnly: false,
            value: (tipo == 6) ? 'idestructura' : '',
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                'render': function (c) {
                    if (accion == 'Modificar') {
                        c.getEl().on('keyup', function () {

                        }, c);
                    }
                }
            }
        });

        _this.nforden = new Ext.form.NumberField({
            fieldLabel: 'Orden',
            id: 'nforden',
            maxValue: 99,
            allowDecimals: false,
            maxText: 'Solo admite números enteros positivos entre 0 y 99.',
            readOnly: false,
            regexText: 'Solo admite números enteros positivos entre 0 y 99.',
            allowNegative: false,
            value: 0,
            anchor: '99%',
            allowBlank: false,
            listeners: {
                change: function (el, nv, ov) {
                    if (nv != '') {
                    }
                },
                'render': function (c) {
                    c.getEl().on('keyup', function () {

                    }, c);

                }
            }
        });

        _this.nfanchocolumna = new Ext.form.NumberField({
            fieldLabel: 'Ancho de la columna (%)',
            id: 'nfanchocolumna',
            maxValue: 99,
            allowDecimals: false,
            maxText: 'Solo admite números enteros positivos entre 0 y 99.',
            readOnly: false,
            regexText: 'Solo admite números enteros positivos entre 0 y 99.',
            allowNegative: false,
            value: 99,
            anchor: '99%',
            allowBlank: false,
            listeners: {
                change: function (el, nv, ov) {
                    if (nv != '') {
                    }
                },
                'render': function (c) {
                    c.getEl().on('keyup', function () {

                    }, c);

                }
            }
        });

        _this.fsconfvisual = new Ext.form.FieldSet({
            id: 'fsconfvisual',
            title: 'Configuración visual',
            collapsible: true,
            autoHeight: true,
            columnWidth: 1,
            layout: 'fit',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [_this.nforden]
                }, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [_this.nfanchocolumna]
                }]
            }]
        });

        //Solo para el tipo estructura
        _this.chestructuracompleta = new Ext.form.Checkbox({
            boxLabel: 'Visualizar toda la estructura',
            checked: false,
            name: 'chestructuracompleta',
            inputValue: 1,
            labelSeparator: '',
            listeners: {
                check: function (check, checked) {
                }
            }
        });

        _this.fpCrudFiltro = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            autoHeight: (tipo == 4) ? false : true,
            autoScroll: true,
            keys: [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    _this.btnAceptarCrudFiltro.handler.call(this);
                }
            }], items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.99,
                    layout: 'form',
                    items: [_this.tfdenominacion]
                }, {
                    columnWidth: 1,
                    layout: 'fit',
                    items: [{
                        frame: false,
                        items: [{
                            layout: 'column',
                            items: [{
                                columnWidth: 0.5,
                                layout: 'form',
                                items: [_this.tfnombreparametro]
                            }, (tipo == 6) ? {
                                columnWidth: 0.5,
                                layout: 'form',
                                bodyStyle: 'padding:0 0 0 5px',
                                items: [_this.chestructuracompleta]
                            } : []]
                        }]
                    }]
                }]
            }, (tipo != 6) ? _this.fsconfvisual : []],
            listeners: {
                'clientvalidation': function (fm, valid) {
                    if (valid) {
                        _this.btnAceptarCrudFiltro.enable();
                        _this.btnAplicarCrudFiltro.enable();
                    } else {
                        _this.btnAceptarCrudFiltro.disable();
                        _this.btnAplicarCrudFiltro.disable();
                    }
                    //Modificar
                    if (accion == 'Modificar') {
                    }
                }
            }
        });

        if (tipo == 1) { //texto
            _this.nflongitudminima = new Ext.form.NumberField({
                fieldLabel: 'Longutid mínima',
                id: 'nflongitudminima',
                maxValue: 255,
                maxText: 'Solo admite números enteros positivos entre 0 y 255.',
                readOnly: false,
                regexText: 'Solo admite números enteros positivos entre 0 y 255.',
                allowNegative: false,
                value: 0,
                anchor: '99%',
                allowBlank: false,
                allowDecimals: false,
                listeners: {
                    change: function (el, nv, ov) {
                        if (nv != '') {
                        }
                    },
                    'render': function (c) {
                        c.getEl().on('keyup', function () {
                            _this.tfvalorpordefecto.minLength = _this.nflongitudminima.getValue();
                            _this.tfvalorpordefecto.minLengthText = 'El tamaño mínimo requerido es ' + _this.nflongitudminima.getValue() + ' caracteres.';
                            _this.tfvalorpordefecto.validate();
                        }, c);
                    }
                }
            });

            _this.nflongitudmaxima = new Ext.form.NumberField({
                fieldLabel: 'Longitud máxima',
                id: 'nflongitudmaxima',
                maxValue: 255,
                maxText: 'Solo admite números enteros positivos entre 0 y 255.',
                readOnly: false,
                regexText: 'Solo admite números enteros positivos entre 0 y 255.',
                allowNegative: false,
                value: 255,
                anchor: '99%',
                allowBlank: false,
                allowDecimals: false,
                listeners: {
                    change: function (el, nv, ov) {
                        if (nv != '') {
                        }
                    },
                    'render': function (c) {
                        c.getEl().on('keyup', function () {
                            _this.tfvalorpordefecto.maxLength = _this.nflongitudmaxima.getValue();
                            _this.tfvalorpordefecto.maxLengthText = 'El tamaño máximo requerido es ' + _this.nflongitudmaxima.getValue() + ' caracteres.';
                            _this.tfvalorpordefecto.validate();
                        }, c);
                    }
                }
            });

            _this.tfvalorpordefecto = new Ext.form.TextField({
                id: 'valorpordefecto',
                fieldLabel: 'Valor por defecto',
                maxLength: _this.nflongitudmaxima.getValue(),
                minLength: _this.nflongitudminima.getValue(),
                maxLengthText: 'El tamaño máximo requerido es ' + _this.nflongitudmaxima.getValue() + ' caracteres.',
                minLengthText: 'El tamaño mínimo requerido es ' + _this.nflongitudminima.getValue() + ' caracteres.',
                regex: _this.objValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.objValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                prevTab: '',
                nextTab: '',
                allowBlank: true,
                selectOnFocus: true,
                anchor: '99%',
                readOnly: false,
                listeners: {
                    change: function (field, newValue, oldValue) {
                        change = true;
                    },
                    'render': function (c) {
                        c.getEl().on('keyup', function () {
                            _this.valorpordefecto = _this.tfvalorpordefecto.getValue();
                        }, c);

                    }
                }
            });

            _this.fstexto = new Ext.form.FieldSet({
                id: 'fstexto',
                title: 'Configuración de parámetros',
                collapsible: true,
                autoHeight: true,
                columnWidth: 1,
                layout: 'fit',
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [_this.nflongitudminima]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [_this.nflongitudmaxima]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [_this.tfvalorpordefecto]
                    }]
                }]
            });
            _this.fpCrudFiltro.add(_this.fstexto);
        }

        if (tipo == 2) { //numerico
            _this.nfvalorminimo = new Ext.form.NumberField({
                fieldLabel: 'Valor mínimo',
                id: 'nfvalorminimo',
                maxValue: 100000000,
                maxText: 'Solo admite números enteros positivos entre 0 y 100 000 000.',
                readOnly: false,
                regexText: 'Solo admite números enteros positivos entre 0 y 100 000 000.',
                allowNegative: false,
                value: 0,
                anchor: '99%',
                allowBlank: false,
                allowDecimals: false,
                listeners: {
                    change: function (el, nv, ov) {
                        if (nv != '') {
                        }
                    },
                    'render': function (c) {
                        c.getEl().on('keyup', function () {
                            _this.nfvalorpordefecto.minValue = _this.nfvalorminimo.getValue();
                            _this.nfvalorpordefecto.minText = 'Solo admite números enteros positivos entre ' + _this.nfvalorminimo.getValue() + ' y ' + _this.nfvalormaximo.getValue() + '.';
                            _this.nfvalorpordefecto.regexText = 'Solo admite números enteros positivos entre ' + _this.nfvalorminimo.getValue() + ' y ' + _this.nfvalormaximo.getValue() + '.';
                            _this.nfvalorpordefecto.validate();
                        }, c);
                    }
                }
            });

            _this.nfvalormaximo = new Ext.form.NumberField({
                fieldLabel: 'Valor máximo',
                id: 'nfvalormaximo',
                maxValue: 100000000,
                maxText: 'Solo admite números enteros positivos entre 0 y 100 000 000.',
                readOnly: false,
                regexText: 'Solo admite números enteros positivos entre 0 y 100 000 000.',
                allowNegative: false,
                value: 100000000,
                anchor: '99%',
                allowBlank: false,
                allowDecimals: false,
                listeners: {
                    change: function (el, nv, ov) {
                        if (nv != '') {
                        }
                    },
                    'render': function (c) {
                        c.getEl().on('keyup', function () {
                            _this.nfvalorpordefecto.maxValue = _this.nfvalormaximo.getValue();
                            _this.nfvalorpordefecto.maxText = 'Solo admite números enteros positivos entre ' + _this.nfvalorminimo.getValue() + ' y ' + _this.nfvalormaximo.getValue() + '.';
                            _this.nfvalorpordefecto.regexText = 'Solo admite números enteros positivos entre ' + _this.nfvalorminimo.getValue() + ' y ' + _this.nfvalormaximo.getValue() + '.';
                            _this.nfvalorpordefecto.validate();
                        }, c);
                    }
                }
            });

            _this.nfvalorpordefecto = new Ext.form.NumberField({
                fieldLabel: 'Valor por defecto',
                id: 'valorpordefecto',
                maxValue: _this.nfvalormaximo.getValue(),
                minValue: _this.nfvalorminimo.getValue(),
                maxText: 'Solo admite números enteros positivos entre ' + _this.nfvalorminimo.getValue() + ' y ' + _this.nfvalormaximo.getValue() + '.',
                minText: 'Solo admite números enteros positivos entre ' + _this.nfvalorminimo.getValue() + ' y ' + _this.nfvalormaximo.getValue() + '.',
                readOnly: false,
                regexText: 'Solo admite números enteros positivos entre ' + _this.nfvalorminimo.getValue() + ' y ' + _this.nfvalormaximo.getValue() + '.',
                allowNegative: false,
                anchor: '99%',
                allowBlank: true,
                allowDecimals: false,
                listeners: {
                    change: function (el, nv, ov) {
                        if (nv != '') {
                        }
                    },
                    'render': function (c) {
                        c.getEl().on('keyup', function () {
                            _this.valorpordefecto = _this.nfvalorpordefecto.getValue();
                        }, c);
                    }
                }
            });

            _this.fsnumerico = new Ext.form.FieldSet({
                id: 'fsnumerico',
                title: 'Configuración de parámetros',
                collapsible: true,
                autoHeight: true,
                columnWidth: 1,
                layout: 'fit',
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [_this.nfvalorminimo]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [_this.nfvalormaximo]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [_this.nfvalorpordefecto]
                    }]
                }]
            });
            _this.fpCrudFiltro.add(_this.fsnumerico);
        }

        if (tipo == 3) { //fecha
            _this.dffechadefault = new Ext.form.DateField({
                id: 'valorpordefecto',
                fieldLabel: 'Otra fecha',
                readOnly: false,
                allowBlank: true,
                invalidText: _this.objValidaciones.ObtenerMsjErrorTextoRegido('fecha2'),
                format: 'Y-m-d',
                anchor: '99%',
                menuListeners: {
                    select: function (df, date) {
                        this.setValue(date);
                        _this.rhoy.setValue(false);
                        _this.rprimerdiames.setValue(false);
                        _this.rultimodiames.setValue(false);
                        _this.valorpordefecto = date.toISOString().slice(0, 10);
                    }
                },
                listeners: {
                    change: function (field, newValue, oldValue) {
                    },
                    'render': function (c) {
                        c.getEl().on('keyup', function () {
                            if (this.isValid()) {
                                _this.rhoy.setValue(false);
                                _this.rprimerdiames.setValue(false);
                                _this.rultimodiames.setValue(false);
                                _this.valorpordefecto = this.getValue().toISOString().slice(0, 10);
                            }
                        }, c);
                    }, blur: function (c) {
                        _this.valorpordefecto = this.getValue().toISOString().slice(0, 10);
                    }
                }
            });
            _this.rhoy = new Ext.form.Radio({
                boxLabel: 'Día actual',
                name: 'rfechadefault',
                inputValue: 'hoy',
                checked: false,
                listeners: {
                    check: function (chb, check) {
                        if (check) {
                            _this.dffechadefault.reset();
                            _this.valorpordefecto = 'hoy';
                        }
                    }
                }
            });
            _this.rprimerdiames = new Ext.form.Radio({
                boxLabel: 'Primer día del mes',
                name: 'rfechadefault',
                inputValue: 'primerdiames',
                checked: false,
                listeners: {
                    check: function (chb, check) {
                        if (check) {
                            _this.dffechadefault.reset();
                            _this.valorpordefecto = 'primerdiames';
                        }
                    }
                }
            });
            _this.rultimodiames = new Ext.form.Radio({
                boxLabel: 'Último día del mes',
                name: 'rfechadefault',
                inputValue: 'ultimodiames',
                checked: false,
                listeners: {
                    check: function (chb, check) {
                        if (check) {
                            _this.dffechadefault.reset();
                            _this.valorpordefecto = 'ultimodiames';
                        }
                    }
                }
            });

            _this.fsfecha = new Ext.form.FieldSet({
                id: 'fsfecha',
                title: 'Valor por defecto',
                collapsible: true,
                columnWidth: 1,
                height: 110,
                layout: 'fit',
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: 0.5,
                        items: [_this.rhoy, _this.rprimerdiames, _this.rultimodiames]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [_this.dffechadefault]
                    }]
                }]
            });
            _this.fpCrudFiltro.add(_this.fsfecha);
        }

        if (tipo == 4) { //nomenclador
            _this.tfcampomostrar = new Ext.form.TextField({
                id: 'tfcampomostrar',
                fieldLabel: 'Valor a mostrar',
                maxLength: 100,
                maxLengthText: 'El tamaño máximo requerido es 100 caracteres.',
                regex: _this.objValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.objValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                allowBlank: false,
                selectOnFocus: true,
                anchor: '99%',
                readOnly: false,
                listeners: {
                    change: function (field, newValue, oldValue) {
                        change = true;
                    },
                    'render': function (c) {
                        if (accion == 'Modificar') {
                            c.getEl().on('keyup', function () {

                            }, c);
                        }
                    }
                }
            });

            _this.tfcampovalor = new Ext.form.TextField({
                id: 'tfcampovalor',
                fieldLabel: 'Id del campo',
                maxLength: 100,
                maxLengthText: 'El tamaño máximo requerido es 100 caracteres.',
                regex: _this.objValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.objValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                allowBlank: false,
                selectOnFocus: true,
                anchor: '99%',
                readOnly: false,
                listeners: {
                    change: function (field, newValue, oldValue) {
                        change = true;
                    },
                    'render': function (c) {
                        if (accion == 'Modificar') {
                            c.getEl().on('keyup', function () {

                            }, c);
                        }
                    }
                }
            });

            _this.chpaginado = new Ext.form.Checkbox({
                boxLabel: 'Paginado',
                checked: false,
                name: 'chpaginado',
                inputValue: 1,
                labelSeparator: '',
                listeners: {
                    check: function (check, checked) {
                    }
                }
            });

            _this.rcodigosql = new Ext.form.Radio({
                boxLabel: 'Código SQL',
                name: 'rcodigosql',
                inputValue: 1,
                checked: true,
                allowBlank: false,
                listeners: {
                    check: function (chb, check) {
                        if (check) {
                            _this.rservicio.setValue(false);
                            _this.taservicio.disable();
                            _this.taservicio.allowBlank = true;
                            _this.taservicio.validate();

                            _this.rcodigosql.setValue(true);
                            _this.tacodigosql.enable();
                            _this.tacodigosql.allowBlank = false;
                            _this.tacodigosql.validate();
                        }
                    },
                    focus: function (el) {
                    }
                }
            });

            _this.rservicio = new Ext.form.Radio({
                boxLabel: 'Servicio',
                name: 'rservicio',
                inputValue: 1,
                checked: false,
                allowBlank: true,
                listeners: {
                    check: function (chb, check) {
                        if (check) {
                            _this.rservicio.setValue(true);
                            _this.taservicio.enable();
                            _this.taservicio.allowBlank = false;
                            _this.taservicio.validate();

                            _this.rcodigosql.setValue(false);
                            _this.tacodigosql.disable();
                            _this.tacodigosql.allowBlank = true;
                            _this.tacodigosql.validate();
                        }
                    },
                    focus: function (el) {
                    }
                }
            });

            _this.rdenviarid = new Ext.form.Radio({
                boxLabel: 'Enviar id del campo',
                name: 'rdenviarid',
                inputValue: 1,
                checked: true,
                allowBlank: true,
                listeners: {
                    check: function (chb, check) {
                        if (check) {
                            _this.rdenviardenominacion.setValue(false);
                        }
                    },
                    focus: function (el) {
                    }
                }
            });

            _this.rdenviardenominacion = new Ext.form.Radio({
                boxLabel: 'Enviar valor del campo',
                name: 'rdenviardenominacion',
                inputValue: 1,
                checked: false,
                allowBlank: true,
                listeners: {
                    check: function (chb, check) {
                        if (check) {
                            _this.rdenviarid.setValue(false);
                        }
                    },
                    focus: function (el) {
                    }
                }
            });

            _this.tacodigosql = new Ext.form.TextArea({
                id: 'tacodigosql',
                name: 'tacodigosql',
                maxLength: 1000,
                minLength: 1,
                maxLengthText: 'El tamaño máximo requerido es 1000 caracteres.',
                allowBlank: false,
                width: '99%',
                height: 100,
                preventScrollbars: true,
                listeners: {
                    render: function (ta) {
                    },
                    show: function (ta) {
                    }
                }
            });


            _this.taservicio = new Ext.form.TextArea({
                name: 'taservicio',
                disabled: true,
                maxLength: 255,
                minLength: 1,
                maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
                allowBlank: true,
                width: '99%',
                height: 100,
                preventScrollbars: true
            });

            _this.fsnomenclador = new Ext.form.FieldSet({
                id: 'fsnomenclador',
                title: 'Configuración de parámetros',
                collapsible: true,
                columnWidth: 1,
                height: 140,
                layout: 'fit',
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [_this.tfcampovalor]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [_this.tfcampomostrar]
                    }, {
                        columnWidth: 0.5,
                        layout: 'fit',
                        items: [_this.rdenviarid]
                    }, {
                        columnWidth: 0.5,
                        layout: 'fit',
                        items: [_this.rdenviardenominacion]
                    }, {
                        columnWidth: 0.5,
                        layout: 'fit',
                        bodyStyle: 'padding:10px 0 0 0',
                        items: [_this.chpaginado]
                    }]
                }]
            });

            _this.fsfuentedatos = new Ext.form.FieldSet({
                id: 'fsfuentedatos',
                collapsible: true,
                columnWidth: 1,
                //height: 280, //con el servicio
                height: 160,
                title: 'Fuente de los datos',
                items: [{
                    layout: 'column',
                    items: _this.rcodigosql
                }, {
                    layout: 'column',
                    items: _this.tacodigosql
                }/*, {
                    layout: 'column',
                    bodyStyle: 'padding:5px 0 0 0',
                    items: _this.rservicio
                }, {
                    layout: 'column',
                    items: _this.taservicio
                }*/]
            });
            _this.fpCrudFiltro.add(_this.fsnomenclador);
            _this.fpCrudFiltro.add(_this.fsfuentedatos);
        }

        if (tipo == 5) { //variable
            _this.stvariableglobal = _this.crearStoreVariableGlobal();

            _this.cbvariableglobal = new Ext.form.ComboBox({
                id: 'cbvariableglobal',
                fieldLabel: 'Variable global',
                store: _this.stvariableglobal,
                displayField: 'denominacion',
                typeAhead: true,
                allowBlank: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                valueField: 'valorpordefecto',
                hiddenName: 'valorpordefecto',
                anchor: '99%',
                emptyText: 'Seleccione',
                disabled: false,
                editable: false,
                listeners: {
                    change: function (field, newValue, oldValue) {
                    },
                    select: function (combo, record) {
                        _this.valorpordefecto = record.data.valorpordefecto;
                    }
                }
            });

            _this.fsvariableglobal = new Ext.form.FieldSet({
                id: 'fsvariableglobal',
                title: 'Valor por defecto',
                collapsible: true,
                columnWidth: 1,
                height: 85,
                layout: 'fit',
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [_this.cbvariableglobal]
                    }]
                }]
            });
            _this.fpCrudFiltro.add(_this.fsvariableglobal);
        }

        _this.btnAplicarCrudFiltro = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            hidden: false,
            id: 'btnAplicarCrudFiltro',
            disabled: true,
            prevTab: '',
            nextTab: '',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
                btnaplicar = true;
                _this.gestionarCrudFiltro(parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas);
            }
        });

        _this.btnAceptarCrudFiltro = new Ext.Button({
            iconCls: 'aceptar ',
            text: 'Aceptar ',
            hidden: false,
            id: 'btnAceptarCrudFiltro',
            disabled: true,
            prevTab: '',
            nextTab: '',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                btnaplicar = false;
                _this.gestionarCrudFiltro(parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas);
            }
        });

        _this.btnCancelarCrudFiltro = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            id: 'btnCancelarCrudFiltro',
            nextTab: '',
            handler: function () {
                if (sm.hasSelection()) sm.clearSelections();
                _this.winCrudFiltro.destroy();
                btnaplicar = false;
            }
        });

        if (_this.winCrudFiltro) _this.winCrudFiltro.destroy();

        _this.winCrudFiltro = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: (accion == 'Adicionar') ? accion + ' filtro tipo: ' + nombretipo : accion + ' filtro ',
            width: 400,
            defaultButton: 1,
            height: 415,
            autoHeight: (tipo == 4) ? false : true,
            autoScroll: true,
            resizable: false,
            autoValidate: true,
            validateDefault: true,
            listeners: {
                beforeshow: function (win) {
                },
                destroy: function () {
                    btnaplicar = false;
                },
                beforedestroy: function () {
                    if (btnaplicar && accionreporte != 'Adicionar')
                        postAccionesGestionar(1, 'Cancelar-Cerrar');
                    _this.valorpordefecto = null;
                },
                render: function (win) {
                    win.focus();
                }
            },
            buttons: [_this.btnCancelarCrudFiltro, _this.btnAplicarCrudFiltro, _this.btnAceptarCrudFiltro
            ],
            items: _this.fpCrudFiltro
        });

        _this.winCrudFiltro.on('beforeshow', function () {
            _this.tfdenominacion.focus(true, 700);
        });
        _this.winCrudFiltro.doLayout();
        _this.winCrudFiltro.show();
        _this.tfdenominacion.focus(false, 1024);

        switch (accion) {
            case 'Adicionar': {
                _this.tfdenominacion.focus(false, 1024);
                if (tipo == 6) _this.btnAplicarCrudFiltro.setVisible(false);
            }
                break;
            case 'Modificar': {
                _this.tfdenominacion.focus(false, 1024);
                _this.btnAplicarCrudFiltro.setVisible(false);
                _this.barraProgreso.show('Cargando datos');
                _this.winCrudFiltro.disable();
                if (accionreporte == 'Adicionar') {
                    var records = sm.getSelections()[0].data;
                    _this.barraProgreso.hide();
                    _this.tfdenominacion.setValue(records.denominacion);
                    _this.tfnombreparametro.setValue(records.nombreparametro);
                    _this.nforden.setValue(records.orden);
                    _this.nfanchocolumna.setValue(records.anchocolumna);
                    tipo = records.tipo;
                    if (tipo == 1) { //texto
                        _this.nflongitudminima.setValue(records.longitudminima);
                        _this.nflongitudmaxima.setValue(records.longitudmaxima);
                        _this.tfvalorpordefecto.setValue(records.valorpordefecto);
                    } else if (tipo == 2) { //numero
                        _this.nfvalorminimo.setValue(records.valorminimo);
                        _this.nfvalormaximo.setValue(records.valormaximo);
                        _this.nfvalorpordefecto.setValue(records.valorpordefecto);
                    } else if (tipo == 3) { //fecha
                        var valorpordefecto = records.valorpordefecto;
                        if (valorpordefecto) {
                            if (valorpordefecto == 'hoy')
                                _this.rhoy.setValue(true);
                            else if (valorpordefecto == 'primerdiames')
                                _this.rprimerdiames.setValue(true);
                            else if (valorpordefecto == 'ultimodiames')
                                _this.rultimodiames.setValue(true)
                            else _this.dffechadefault.setValue(valorpordefecto);
                        }
                    } else if (tipo == 4) { //nomenclador
                        _this.tfcampomostrar.setValue(records.nomdenominacion);
                        _this.tfcampovalor.setValue(records.nomidentificador);
                        _this.chpaginado.setValue(records.paginado);
                        var fuentedatos = records.tipofuentedatos;
                        if (fuentedatos == '1') {
                            _this.rcodigosql.setValue(true);
                            _this.tacodigosql.setValue(records.sentenciasql);
                        } else {
                            _this.rservicio.setValue(true);
                            _this.rcodigosql.setValue(false);
                            _this.taservicio.setValue(records.nomservicio);
                            _this.taservicio.enable();
                            _this.tacodigosql.disable();
                        }
                        var enviarid = records.enviarid;
                        if (enviarid == '1') _this.rdenviarid.setValue(true);
                        else {
                            _this.rdenviarid.setValue(false);
                            _this.rdenviardenominacion.setValue(true);
                        }
                    } else if (tipo == 5) { //variable
                        var valorpordefecto = records.valorpordefecto;
                        if (valorpordefecto) {
                            _this.cbvariableglobal.setValue(valorpordefecto);
                        }
                    } else if (tipo == 6) { //estructura
                        _this.chestructuracompleta.setValue(records.estructuracompleta);
                    }
                    _this.winCrudFiltro.enable();
                } else {
                    Ext.Ajax.request({
                        url: '/configuracion/integracionreportes/index.php/cmpfiltro/cargarFormularioFiltro',
                        params: {
                            idfiltro: arrayidfiltros[0],
                            tipo: tipo
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                _this.barraProgreso.hide();
                                mostrarMensaje(1, 'La configuración que usted quiere modificar ya no se encuentra en los registros.');
                                _this.winCrudFiltro.destroy();
                                postAccionesGestionar();
                            } else if (responseData.mensaje == 1) {
                                _this.barraProgreso.hide();
                                _this.tfdenominacion.setValue(responseData.data[0].denominacion);
                                _this.tfnombreparametro.setValue(responseData.data[0].nombreparametro);
                                _this.nforden.setValue(responseData.data[0].orden);
                                _this.nfanchocolumna.setValue(responseData.data[0].anchocolumna);
                                tipo = responseData.data[0].tipo;
                                if (tipo == 1) { //texto
                                    _this.nflongitudminima.setValue(responseData.data[0].longitudminima);
                                    _this.nflongitudmaxima.setValue(responseData.data[0].longitudmaxima);
                                    _this.tfvalorpordefecto.setValue(responseData.data[0].valorpordefecto);
                                } else if (tipo == 2) { //numero
                                    _this.nfvalorminimo.setValue(responseData.data[0].valorminimo);
                                    _this.nfvalormaximo.setValue(responseData.data[0].valormaximo);
                                    _this.nfvalorpordefecto.setValue(responseData.data[0].valorpordefecto);
                                } else if (tipo == 3) { //fecha
                                    var valorpordefecto = responseData.data[0].valorpordefecto;
                                    if (valorpordefecto) {
                                        if (valorpordefecto == 'hoy')
                                            _this.rhoy.setValue(true);
                                        else if (valorpordefecto == 'primerdiames')
                                            _this.rprimerdiames.setValue(true);
                                        else if (valorpordefecto == 'ultimodiames')
                                            _this.rultimodiames.setValue(true)
                                        else _this.dffechadefault.setValue(valorpordefecto);
                                    }
                                } else if (tipo == 4) { //nomenclador
                                    _this.tfcampovalor.setValue(responseData.data[0].nomidentificador);
                                    _this.tfcampomostrar.setValue(responseData.data[0].nomdenominacion);
                                    _this.chpaginado.setValue(responseData.data[0].paginado);
                                    var fuentedatos = responseData.data[0].tipofuentedatos;
                                    if (fuentedatos == '1') {
                                        _this.rcodigosql.setValue(fuentedatos);
                                        _this.tacodigosql.setValue(responseData.data[0].sentenciasql);
                                    } else {
                                        _this.rservicio.setValue(true);
                                        _this.rcodigosql.setValue(false);
                                        _this.taservicio.setValue(responseData.data[0].nomservicio);
                                        _this.taservicio.enable();
                                        _this.tacodigosql.disable();
                                    }
                                    var enviarid = responseData.data[0].enviarid;
                                    if (enviarid == '1') _this.rdenviarid.setValue(true);
                                    else {
                                        _this.rdenviarid.setValue(false);
                                        _this.rdenviardenominacion.setValue(true);
                                    }
                                } else if (tipo == 5) { //variable
                                    var valorpordefecto = responseData.data[0].valorpordefecto;
                                    if (valorpordefecto) {
                                        _this.cbvariableglobal.setValue(valorpordefecto);
                                    }
                                } else if (tipo == 6) { //estructura
                                    _this.chestructuracompleta.setValue(responseData.data[0].estructuracompleta);
                                }
                                _this.winCrudFiltro.enable();
                            } else if (responseData.mensaje == 2) {
                                _this.barraProgreso.hide();
                                mostrarMensaje(1, 'Debe seleccionar un filtro.');
                                _this.winCrudFiltro.destroy();
                                postAccionesGestionar();
                            } else if (responseData.hasOwnProperty('codMsg') && responseData.codMsg == 3)
                                mostrarMensaje(1, responseData.mensaje);
                            else mostrarMensaje(1, 'Ha ocurrido un error. Contacte al administrador.');
                        }
                    });
                }
            }
                break;
        }
    }
    //Adicionar y modificar filtros
    _this.gestionarCrudFiltro = function (parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas) {
        var accion = parametros.accion
        var accionreporte = parametros.accionreporte;
        var tipo = parametros.tipo;
        var waitMsg = 'Guardando datos del filtro';
        var postaccion = '';
        var url = '';
        var arrayidfiltros = parametros.arrayidfiltros;
        if (accion == 'Adicionar') {
            url = 'adicionarFiltro';
            postaccion = 'adicionado';
        } else if (accion == 'Modificar') {
            var idfiltro = arrayidfiltros[0];
            url = 'modificarFiltro';
            postaccion = 'modificado';
        }
        parametros.url = url;
        parametros.postaccion = postaccion;
        parametros.waitMsg = waitMsg;
        parametros.idfiltro = idfiltro;
        if (_this.fpCrudFiltro.getForm().isValid()) {
            var valid = 1;
            if (tipo == 1 && (parseInt(_this.nflongitudminima.getValue()) >= parseInt(_this.nflongitudmaxima.getValue()))) {
                mostrarMensaje(1, 'La longitud mínima debe ser menor que la longitud máxima.');
                valid = -1;
            } else if (tipo == 2 && (parseInt(_this.nfvalorminimo.getValue()) >= parseInt(_this.nfvalormaximo.getValue()))) {
                mostrarMensaje(1, 'El valor mínimo debe ser menor que el valor máximo.');
                valid = -1;
            } else if (tipo == 4 && _this.rcodigosql.getValue()) {
                valid = _this.validarCodigoSql(_this.tacodigosql.getValue());
            }
            if (valid == 1) {
                if (accionreporte == 'Adicionar') {
                    _this.gestionarCrudFiltroCliente(parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas);
                } else {
                    _this.gestionarCrudFiltroServidor(parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas);
                }
            }
        }
    };
    //Eliminar Filtro
    _this.eliminarFiltro = function (parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas) {
        var sm = parametros.sm;
        var st = parametros.st;
        var accion = parametros.accion;
        var accionreporte = parametros.accionreporte;
        var arrayidfiltros = parametros.arrayidfiltros;
        var mensaje = '', mensajemascara = '', mensajeconfirmacion0 = '', mensajeconfirmacion1 = '',
            mensajeconfirmacion2 = '';
        if (sm.getSelections().length > 1) {
            mensaje = '¿Está seguro que quiere eliminar los filtros seleccionados?';
            mensajemascara = 'Eliminando filtros';
            mensajeconfirmacion0 = 'Los filtros que usted quiere eliminar ya no se encuentran en los registros.';
            mensajeconfirmacion1 = 'Los filtros han sido eliminados satisfactoriamente.';
            mensajeconfirmacion2 = 'Algunos de los filtros que usted quiere eliminar ya no se encuentran en los registros.';
        } else {
            mensaje = '¿Está seguro que quiere eliminar el filtro seleccionado?';
            mensajemascara = 'Eliminando filtro';
            mensajeconfirmacion0 = 'El filtro que usted quiere eliminar ya no se encuentra en los registros.';
            mensajeconfirmacion1 = 'El filtro ha sido eliminado satisfactoriamente.';
        }
        mostrarMensaje(2, mensaje, eliminar);

        function eliminar(btnPresionado) {
            if (btnPresionado == 'ok') {
                _this.barraProgreso.show(mensajemascara);
                if (accionreporte == 'Adicionar') {
                    var arrayrecords = sm.getSelections();
                    var totalrecords = arrayrecords.length;
                    var arrayfiltros = st.getRange();
                    var totalfiltros = arrayfiltros.length;
                    for (var i = 0; i < totalrecords; i++) {
                        for (var j = 0; j < totalfiltros; j++) {
                            if (arrayrecords[i].data.idfiltro == arrayfiltros[j].data.idfiltro)
                                st.remove(arrayfiltros[j]);
                        }
                    }
                    mostrarMensaje(1, mensajeconfirmacion1);
                    actualizarEstadoBarraHerramientas();
                    _this.barraProgreso.hide();
                } else {
                    Ext.Ajax.request({
                        url: '/configuracion/integracionreportes/index.php/cmpfiltro/eliminarFiltro',
                        params: {
                            arrayidfiltros: Ext.encode(arrayidfiltros)
                        },
                        callback: function (options, success, response) {
                            _this.barraProgreso.hide();
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                mostrarMensaje(1, mensajeconfirmacion0);
                                postAccionesGestionar(0, 'Eliminar');
                            } else if (responseData.mensaje == 1) {
                                mostrarMensaje(1, mensajeconfirmacion1);
                                postAccionesGestionar(1, 'Eliminar');
                            } else if (responseData.mensaje == 2) {
                                mostrarMensaje(1, mensajeconfirmacion2);
                                postAccionesGestionar(1, 'Eliminar');
                            } else if (responseData.hasOwnProperty('codMsg') && responseData.codMsg == 3)
                                mostrarMensaje(1, responseData.mensaje);
                            else mostrarMensaje(1, 'Ha ocurrido un error. Contacte al administrador.');
                            actualizarEstadoBarraHerramientas();
                        }
                    });
                }
            } else {
                if (sm.hasSelection()) {
                    sm.clearSelections();
                }
            }
        }
    };

    _this.gestionarCrudFiltroServidor = function (parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas) {
        _this.barraProgreso.show(parametros.waitMsg);
        var url = parametros.url;
        _this.fpCrudFiltro.getForm().submit({
            url: '/configuracion/integracionreportes/index.php/cmpfiltro/' + url,
            params: {
                idfiltro: parametros.idfiltro,
                tipo: parametros.tipo,
                idreporte: parametros.idreporte
            },
            failure: function (form, action) {
                _this.barraProgreso.hide();
                if (action.result.mensaje == -1) {
                    mostrarMensaje(1, 'Ha ocurrido un error. Contacte con el administrador');
                } else if (action.result.mensaje == 0) {
                    if (accion == 'Modificar') {
                        mostrarMensaje(1, 'El filtro que quiere modificar ya existe.');
                    } else
                        mostrarMensaje(1, 'El filtro que quiere adicionar ya existe.');
                } else if (action.result.mensaje == 1) {
                    var postaccion = parametros.postaccion;
                    mostrarMensaje(1, 'El filtro ha sido ' + postaccion + ' satisfactoriamente.');
                    if (!btnaplicar) {
                        _this.winCrudFiltro.destroy();
                        postAccionesGestionar(action.result.mensaje, parametros.accion);
                    } else {
                        _this.fpCrudFiltro.getForm().reset();
                        _this.valorpordefecto = null;
                    }
                    actualizarEstadoBarraHerramientas();
                } else if (action.result.mensaje == 2) {
                    mostrarMensaje(1, 'El filtro que usted quiere modificar ya no se encuentra en los registros.');
                    _this.winCrudFiltro.destroy();
                    postAccionesGestionar(action.result.mensaje, accion);
                } else if (action.result.mensaje == 3) {
                    mostrarMensaje(1, 'Faltan campos obligatorios por llenar.');
                } else if (action.result.mensaje == 4) {
                    mostrarMensaje(1, 'Debe seleccionar un filtro.');
                } else if (action.result.mensaje == 5) {
                    mostrarMensaje(1, 'Solo se puede adicionar un filtro de tipo: Estructura.');
                    _this.winCrudFiltro.destroy();
                } else if (action.result.mensaje == 6) {
                    mostrarMensaje(1, 'Ya existe un filtro con el nombre del parámetro.');
                } else mostrarMensaje(1, action.result.mensaje);
            }
        });
    }

    _this.gestionarCrudFiltroCliente = function (parametros, postAccionesGestionar, actualizarEstadoBarraHerramientas) {
        var accion = parametros.accion;
        var st = parametros.st;
        var sm = parametros.sm;
        var tipo = parseInt(parametros.tipo);
        if (accion == 'Adicionar' || accion == 'Modificar') {
            var arrayfiltros = [];
            var filtroRecord = Ext.data.Record.create([
                {
                    name: 'id'
                }, {
                    name: 'idfiltro'
                }, {
                    name: 'idreporte'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'orden'
                }, {
                    name: 'anchocolumna'
                }, {
                    name: 'nombreparametro'
                }, {
                    name: 'tipo'
                }, {
                    name: 'denominaciontipo'
                }, {
                    name: 'longitudminima'
                }, {
                    name: 'longitudmaxima'
                }, {
                    name: 'valorminimo'
                }, {
                    name: 'valormaximo'
                }, {
                    name: 'nomidentificador'
                }, {
                    name: 'nomdenominacion'
                }, {
                    name: 'tipofuentedatos'
                }, {
                    name: 'paginado'
                }, {
                    name: 'sentenciasql'
                }, {
                    name: 'nomservicio'
                }, {
                    name: 'enviarid'
                }, {
                    name: 'valorpordefecto'
                }, {
                    name: 'estructuracompleta'
                }
            ]);
            var denominaciontipo = [];
            denominaciontipo[1] = 'Texto';
            denominaciontipo[2] = 'Numérico';
            denominaciontipo[3] = 'Fecha';
            denominaciontipo[4] = 'Nomenclador';
            denominaciontipo[5] = 'Variable global';
            denominaciontipo[6] = 'Estructura';
            var id = Math.random() * 99999999;
            var filtroCliente = new filtroRecord({
                id: id,
                idfiltro: id,
                denominacion: _this.tfdenominacion.getValue(),
                orden: _this.nforden.getValue(),
                anchocolumna: _this.nfanchocolumna.getValue(),
                nombreparametro: _this.tfnombreparametro.getValue(),
                tipo: tipo,
                denominaciontipo: denominaciontipo[tipo],
                longitudminima: (_this.nflongitudminima) ? _this.nflongitudminima.getValue() : null,
                longitudmaxima: (_this.nflongitudmaxima) ? _this.nflongitudmaxima.getValue() : null,
                valorminimo: (_this.nfvalorminimo) ? _this.nfvalorminimo.getValue() : null,
                valormaximo: (_this.nfvalormaximo) ? _this.nfvalormaximo.getValue() : null,
                nomidentificador: (_this.tfcampovalor) ? _this.tfcampovalor.getValue() : null,
                nomdenominacion: (_this.tfcampomostrar) ? _this.tfcampomostrar.getValue() : null,
                sentenciasql: (_this.tacodigosql) ? _this.tacodigosql.getValue() : null,
                nomservicio: (_this.taservicio) ? _this.taservicio.getValue() : null,
                tipofuentedatos: (_this.rcodigosql && _this.rcodigosql.getValue() == '1') ? 1 : 0,
                paginado: (_this.chpaginado && _this.chpaginado.getValue() == '1') ? 1 : 0,
                enviarid: (_this.rdenviarid && _this.rdenviarid.getValue() == '1') ? 1 : 0,
                valorpordefecto: _this.valorpordefecto,
                estructuracompleta: (_this.chestructuracompleta && _this.chestructuracompleta.getValue() == '1') ? 1 : 0,
            });
            if (accion == 'Adicionar') {
                arrayfiltros.push(filtroCliente);
                st.add(arrayfiltros);
                arrayfiltros = [];
                mostrarMensaje(1, 'El filtro ha sido adicionado satisfactoriamente.');
                if (!btnaplicar) {
                    _this.winCrudFiltro.destroy();
                } else {
                    _this.fpCrudFiltro.getForm().reset();
                    _this.valorpordefecto = null;
                }
            } else { //Modificar
                var arrayrecords = sm.getSelections();
                var record = arrayrecords[0];
                arrayfiltros.push(filtroCliente);
                st.add(arrayfiltros);
                st.remove(record);
                arrayfiltros = [];
                var postaccion = parametros.postaccion;
                mostrarMensaje(1, 'El filtro ha sido ' + postaccion + ' satisfactoriamente.');
                _this.winCrudFiltro.destroy();
            }
            actualizarEstadoBarraHerramientas();
        } else {
            if (sm.hasSelection()) {
                if (accion == 'Eliminar') _this.eliminarFiltro(parametros);
            } else mostrarMensaje(1, 'Debe seleccionar al menos un filtro.');
            actualizarEstadoBarraHerramientas();
        }
    }

    _this.crearWinParametros = function (parametros, obtenerUrlReporte) {
        var st = parametros.st;
        var sm = parametros.sm;
        var cantrecord = st.getCount();
        var accion = parametros.accion;
        var estructura = parametros.estructura;

        _this.fpVistaPFiltro = new Ext.FormPanel({
            id: 'fpVistaPFiltro',
            labelAlign: 'top',
            frame: true,
            autoScroll: true,
            autoHeight: (cantrecord > 4) ? false : true,
            keys: [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    _this.btnAceptarVistaPFiltro.handler.call(this);
                }
            }],
            listeners: {
                'clientvalidation': function (fm, valid) {
                    if (valid) {
                        if (estructura.mostrarestructura) {
                            if (_this.objestructura.idEstructura && _this.objestructura.idEstructura != 'nodo2')
                                _this.btnAceptarVistaPFiltro.enable();
                            else _this.btnAceptarVistaPFiltro.disable();
                        } else _this.btnAceptarVistaPFiltro.enable();
                    } else _this.btnAceptarVistaPFiltro.disable();
                }
            }
        });
        _this.addItemsFormVistaP1Columna(parametros);

        _this.btnAceptarVistaPFiltro = new Ext.Button({
            iconCls: 'aceptar ',
            text: 'Aceptar ',
            hidden: false,
            disabled: true,
            id: 'btnAceptarVistaPFiltro',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                if (_this.fpVistaPFiltro.getForm().isValid()) {
                    var datosfiltros = _this.fpVistaPFiltro.getForm().getValues();
                    var idestructura = (estructura.mostrarestructura && _this.objestructura.idEstructura && _this.objestructura.idEstructura != 'nodo2') ? _this.objestructura.idEstructura : '';
                    obtenerUrlReporte(parametros.formatoreporte, datosfiltros, idestructura);
                    _this.winVistaPFiltro.destroy();
                } else mostrarMensaje(1, 'El formulario contiene datos erróreos.');
            }
        });

        _this.btnCancelarVistaPFiltro = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            id: 'btnCancelarVistaPFiltro',
            nextTab: '',
            handler: function () {
                if (sm && sm.hasSelection()) sm.clearSelections();
                _this.winVistaPFiltro.destroy();
            }
        });

        if (estructura.mostrarestructura) {
            _this.pFiltro = new Ext.Panel({
                title: 'Filtros',
                id: 'pFiltro',
                layout: 'fit',
                collapsible: false,
                collapsed: false,
                region: 'center',
                items: _this.fpVistaPFiltro,
                disabled: true
            });

            //objeto del componente "Gestionar Estructura"
            _this.objestructura = new Utilidades.Cmp.Cmpgestionarestructura({
                estructuracompleta: estructura.estructuracompleta
            });

            _this.tpEstructuras = _this.objestructura.CrearArbolEstructura(null, null, _this.pFiltro, _this.fpVistaPFiltro);

            _this.pEstructura = new Ext.Panel({
                title: 'Estructuras',
                id: 'pEstructura',
                layout: 'fit',
                collapsible: false,
                collapsed: false,
                width: 300,
                region: 'west',
                margins: '3 3 3 3',
                items: _this.tpEstructuras
            });

            _this.pVistaPFiltro = new Ext.Panel({
                layout: 'border',
                items: [_this.pFiltro, _this.pEstructura]
            });
        }

        if (_this.winVistaPFiltro) {
            _this.winVistaPFiltro.destroy();
        }
        _this.winVistaPFiltro = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: (accion == 'Vista') ? 'Vista previa de los filtros' : 'Filtros ',
            width: (estructura.mostrarestructura) ? 650 : 350,
            defaultButton: 1,
            height: (estructura.mostrarestructura) ? 400 : 270,
            autoHeight: (cantrecord > 4 || estructura.mostrarestructura) ? false : true,
            autoScroll: (estructura.mostrarestructura) ? false : true,
            resizable: false,
            autoValidate: true,
            validateDefault: true,
            listeners: {
                beforeshow: function (win) {
                },
                destroy: function () {
                },
                beforedestroy: function () {
                },
                render: function (w) {
                    w.focus();
                }
            },
            buttons: [_this.btnCancelarVistaPFiltro, _this.btnAceptarVistaPFiltro],
            items: (estructura.mostrarestructura) ? _this.pVistaPFiltro : _this.fpVistaPFiltro
        });
        if (accion == 'Vista') {
            _this.btnCancelarVistaPFiltro.setText('Cerrar');
            _this.btnAceptarVistaPFiltro.hide();
        }
        _this.winVistaPFiltro.doLayout();
        _this.winVistaPFiltro.show();
    }

    _this.addItemsFormVistaP1Columna = function (parametros) {
        var st = parametros.st;
        var filtros = st.getRange();
        var cant = filtros.length;
        var arrayitems = [];
        for (var i = 0; i < cant; i++) {
            if (filtros[i].data.tipo != 6) {
                var items = {
                    layout: 'column',
                    items: [{
                        columnWidth: 0.99,
                        layout: 'form',
                        items: [_this.crearCampo(filtros[i].data)]
                    }]
                }
                _this.fpVistaPFiltro.add(items);
            } else this.fpVistaPFiltro.add({});
        }
    }

    _this.addItemsFormVistaP2Columnas = function (parametros) {
        var st = parametros.st;
        var filtros = st.getRange();
        var cant = filtros.length;
        for (var i = 0; i < cant; i += 2) {
            var items = {
                columnWidth: 1,
                layout: 'fit',
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [_this.crearCampo(filtros[i].data)]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [(filtros[i + 1]) ? _this.crearCampo(filtros[i + 1].data) : []]
                    }]
                }]
            }
            _this.fpVistaPFiltro.add(items);
        }
    }

    _this.crearCampo = function (parametros) {
        if (parametros.tipo == 1) return _this.crearCampoTexto(parametros);
        else if (parametros.tipo == 2) return _this.crearCampoNumero(parametros);
        else if (parametros.tipo == 3) return _this.crearCampoFecha(parametros);
        else if (parametros.tipo == 4) return _this.crearCampoNomenclador(parametros);
        else if (parametros.tipo == 5) return _this.crearCampoComboVariable(parametros);
        else return null;
    }

    _this.crearCampoTexto = function (parametros) {
        var tftexto = new Ext.form.TextField({
            id: parametros.idfiltro,
            fieldLabel: parametros.denominacion,
            maxLength: parametros.longitudmaxima,
            maxLengthText: 'El tamaño máximo requerido es ' + parametros.longitudmaxima + ' caracteres.',
            minLength: parametros.longitudminima,
            minLengthText: 'El tamaño mínimo requerido es ' + parametros.longitudminima + ' caracteres.',
            regex: _this.objValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.objValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            selectOnFocus: true,
            anchor: parametros.anchocolumna + '%',
            readOnly: false,
            value: parametros.valorpordefecto,
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                'render': function (c) {
                }
            }
        });
        return tftexto;
    }

    _this.crearCampoNumero = function (parametros) {
        var nfnumero = new Ext.form.NumberField({
            fieldLabel: parametros.denominacion,
            id: parametros.idfiltro,
            maxValue: parseInt(parametros.valormaximo),
            minValue: parseInt(parametros.valorminimo),
            allowDecimals: false,
            readOnly: false,
            maxText: 'Solo admite números enteros positivos entre ' + parametros.valorminimo + ' y ' + parametros.valormaximo + '.',
            minText: 'Solo admite números enteros positivos entre ' + parametros.valorminimo + ' y ' + parametros.valormaximo + '.',
            regexText: 'Solo admite números enteros positivos entre ' + parametros.valorminimo + ' y ' + parametros.valormaximo + '.',
            allowNegative: false,
            //value: parametros.valorminimo,
            value: parametros.valorpordefecto,
            anchor: parametros.anchocolumna + '%',
            allowBlank: false,
            listeners: {
                change: function (el, nv, ov) {
                    if (nv != '') {
                    }
                },
                'render': function (c) {
                }
            }
        });
        return nfnumero;
    }

    _this.crearCampoFecha = function (parametros) {
        var date = new Date();
        var fecha = '';
        if (parametros.valorpordefecto == 'hoy')
            fecha = date.toISOString().slice(0, 10);
        else if (parametros.valorpordefecto == 'primerdiames')
            fecha = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
        else if (parametros.valorpordefecto == 'ultimodiames')
            fecha = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().slice(0, 10);
        else
            fecha = parametros.valorpordefecto;
        var dffecha = new Ext.form.DateField({
            fieldLabel: parametros.denominacion,
            id: parametros.idfiltro,
            readOnly: false,
            allowBlank: false,
            invalidText: _this.objValidaciones.ObtenerMsjErrorTextoRegido('fecha2'),
            //format: 'd/m/Y',
            format: 'Y-m-d',
            value: fecha,
            anchor: parametros.anchocolumna + '%',
            menuListeners: {
                select: function (df, date) {
                    this.setValue(date);
                }
            },
            listeners: {
                change: function (field, newValue, oldValue) {
                },
                'render': function (c) {
                }
            }
        });
        return dffecha;
    }

    _this.crearCampoNomenclador = function (parametros) {
        var store = new Ext.data.Store({
            id: 'store' + parametros.idfiltro,
            autoLoad: false,
            url: '/configuracion/integracionreportes/index.php/cmpfiltro/cargarDatosNomenclador',
            baseParams: {
                idfiltro: parametros.idfiltro,
                tipo: parametros.tipo,
                tipofuentedatos: parametros.tipofuentedatos
            },
            reader: new Ext.data.JsonReader(
                {
                    totalProperty: 'total',
                    root: 'data',
                    id: parametros.nomidentificador
                }, [{
                    name: parametros.nomidentificador
                }, {
                    name: parametros.nomdenominacion
                }]
            ),
            listeners: {
                beforeload: function () {
                },
                'load': function (store, records, options) {
                    if (store.getCount() == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    }
                }
            }
        });

        //var cmbnomenclador = new Ext.form.LovCombo({
        var cmbnomenclador = new Ext.form.ComboBox({
            fieldLabel: parametros.denominacion,
            id: parametros.idfiltro,
            emptyText: 'Seleccione',
            store: store,
            valueField: parametros.nomidentificador,
            displayField: parametros.nomdenominacion,
            hiddenName: (parametros.enviarid == '1') ? parametros.nomidentificador : '',
            triggerAction: 'all',
            allowBlank: false,
            loadingText: 'Cargando datos',
            forceSelection: true,
            mode: 'remote',
            anchor: parametros.anchocolumna + '%',
            pageSize: (parametros.paginado == '1') ? 100 : 0,
            editable: false,
            typeAhead: true,
            listeners: {
                expand: function (combo) {
                    store.reload({
                        callback: function (record, options, success) {
                        }
                    });
                },
                change: function (field, newValue, oldValue) {
                }
            }
        });
        return cmbnomenclador;
    }

    _this.crearCampoComboVariable = function (parametros) {
        var stvariableglobal = _this.crearStoreVariableGlobal();

        var cbvariableglobal = new Ext.form.ComboBox({
            id: parametros.idfiltro,
            fieldLabel: parametros.denominacion,
            store: stvariableglobal,
            displayField: 'denominacion',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            valueField: 'valor',
            hiddenName: parametros.nombreparametro,
            anchor: parametros.anchocolumna + '%',
            emptyText: 'Seleccione',
            disabled: false,
            editable: false
        });
        if (parametros.valorpordefecto) {
            var valor = '';
            var store = stvariableglobal.getRange();
            var cant = store.length;
            for (var i = 0; i < cant; i++) {
                if (store[i].data.valorpordefecto == parametros.valorpordefecto) {
                    valor = store[i].data.valor;
                    break;
                }
            }
            cbvariableglobal.setValue(valor);
        }
        return cbvariableglobal;
    }

    _this.validarCodigoSql = function (codigosql) {
        codigosql = codigosql.toLowerCase();
        var result = -1;
        var nomidentificador = (_this.tfcampovalor) ? _this.tfcampovalor.getValue().toLowerCase().toString() : '';
        var nomdenominacion = (_this.tfcampomostrar) ? _this.tfcampomostrar.getValue().toLowerCase().toString() : '';

        if (codigosql.search('select') == -1) mostrarMensaje(1, 'Error de sintaxis. Falta la palabra SELECT en el código SQL.');
        else if (codigosql.search(nomidentificador) == -1) mostrarMensaje(1, 'Error de sintaxis. Falta el Id del campo: ' + nomidentificador + ', en el código SQL.');
        else if (codigosql.search(nomdenominacion) == -1) mostrarMensaje(1, 'Error de sintaxis. Falta el Valor del campo:  ' + nomdenominacion + ', en el código SQL.');
        else if (codigosql.search('from') == -1) mostrarMensaje(1, 'Error de sintaxis. Falta la palabra FROM en el código SQL.');
        else if (codigosql.search('limit') != -1) mostrarMensaje(1, 'Error de sintaxis. Debe quitar la palabra LIMIT del código SQL.');
        else if (codigosql.search('offset') != -1) mostrarMensaje(1, 'Error de sintaxis. Debe quitar la palabra OFFSET del código SQL.');
        else result = 1;
        return result;
    }

    _this.crearStoreVariableGlobal = function () {
        var variable = window.perfil;
        var stvariableglobal = new Ext.data.SimpleStore({
            fields: ['valorpordefecto', 'valor', 'denominacion'],
            data: [
                ['usuario', variable.usuario, 'Usuario'],
                ['idusuario', variable.idusuario, 'Id. Usuario'],
                ['idestructura', variable.idestructuracomun, 'Id. Estructura']
            ]
        });
        var record = Ext.data.Record.create([{
            name: 'valorpordefecto'
        }, {
            name: 'valor'
        }, {
            name: 'denominacion'
        }]);
        if (variable.idpersona) {
            stvariableglobal.add(new record({
                valorpordefecto: 'idpersona',
                valor: variable.idpersona,
                denominacion: 'Id. Persona'
            }));
        }
        if (variable.idrol) {
            stvariableglobal.add(new record({
                valorpordefecto: 'idrol',
                valor: variable.idrol,
                denominacion: 'Id. Rol'
            }));
        }
        if (variable.iddominio) {
            stvariableglobal.add(new record({
                valorpordefecto: 'iddominio',
                valor: variable.iddominio,
                denominacion: 'Id. Dominio'
            }));
        }
        return stvariableglobal;
    }
}