Ext.ns('LOG.lb.atributosdinamicos');

LOG.lb.atributosdinamicos.ventanaAddAtributos = Ext.extend(LOG.util.Window, {
    resizable: false,
    width: 650,
    height: 170,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.idioma = Ext.apply(config.idioma, LOG.lb.atributosdinamicos.Idioma);
        config.title = config.idioma.tlAddAtributo;
        LOG.lb.atributosdinamicos.ventanaAddAtributos.superclass.constructor.call(this, config);
        this.modelo.addActionButton(this.listaBotones.getItem(2));
        this.modelo.addActionButton(this.listaBotones.getItem(1));
        this.asociados = config.asociados;
        this.desasociados = config.desasociados;
        this.reocordsAgrupacion = config.reocordsAgrupacion;
    },
    /**
     * Inicializa los componentes de la ventana.
     * @returns {undefined}
     */
    initComponent: function() {
        var _this = this;
        LOG.lb.atributosdinamicos.ventanaAddAtributos.superclass.initComponent.call(this);
        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'center'
        });

        // Componentes basicos (Nombre y Tipo).
        var clsBasico = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.cbTipoDato = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbTipoDato,
            hiddenName: 'tipodato',
            valueField: 'tipodato',
            displayField: 'denominacion',
            editable: false,
            mode: 'local',
            allowBlank: false,
            store: new Ext.data.SimpleStore({
                fields: ['tipodato', 'denominacion'],
                data: [
                    [1, _this.idioma.lbTipoTexto],
                    [2, _this.idioma.lbTipoNumerico],
                    [3, _this.idioma.lbTipoBooleano],
                    [4, _this.idioma.lbTipoFecha],
                    [5, _this.idioma.lbTipoNomenclador]
                ]
            }),
            listeners: {
                select: function(cb, _r) {
                    if (_this.modelo.tipodato != _r.data.tipodato) {
                        _this.setView(_r.data.tipodato);
                    }
                }
            }
        });
        this.tfDenominacion = LOG.util.Prototipos.inputTexto({
            fieldLabel: this.idioma.lbDenominacion,
            allowBlank: false,
            name: 'nombre'
        });
        clsBasico.addComponent(this.tfDenominacion);
        clsBasico.addComponent(this.cbTipoDato);
        clsBasico.getColumn(0).columnWidth = 0.7;
        clsBasico.getColumn(1).columnWidth = 0.3;
        var clsCheckObligatorio = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        
        // CheckBox Obligatorio.
        this.checkObligatorio = new Ext.form.Checkbox({
            boxLabel: this.idioma.lbObligatorio,
            name: 'obligatorio',
            hideLabel: true
        });
        clsCheckObligatorio.addComponent(this.checkObligatorio);


        // Componentes para el tipo cadena de caracteres.
        this.clsCadena = new LOG.util.UIManager.initColumnForm({
            columnas: 2,
            hidden: true
        });

        this.tfLongitud = LOG.util.Prototipos.inputEntero({
            fieldLabel: this.idioma.lbLongitud,
            minValue: 1,
            maxValue: 255,
            anchor: '90%',
            name: 'longitud',
            tipo: 1,
            campo: true
        });
        this.cbExpresionReg = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbExpresionReg,
            minChars: 1,
            resizable: true,
            url: '/logistica/utiles/atribdinamicos/index.php/atributosdinamicos/cargarComboExpresionReg',
            hiddenName: 'idexpresionregular',
            displayField: 'denominacion',
            valueField: 'idexpresionregular',
            mode: 'local',
            tipo: 1,
            campo: true
        });
        this.cbExpresionReg.store.on({
            load: function() {
                if (_this.record && _this.record.data.idexpresionregular) {
                    _this.cbExpresionReg.setValue(_this.record.data.idexpresionregular);
                }
            }
        });
        this.checkMultilinea = new Ext.form.Checkbox({
            boxLabel: this.idioma.lbMultilinea,
            name: 'multilinea',
            hideLabel: true,
            tipo: 1,
            campo: true
        });

        this.clsCadena.addComponent(this.tfLongitud);
        this.clsCadena.addComponent(this.cbExpresionReg);
        this.clsCadena.addComponent(this.checkMultilinea);
        this.clsCadena.getColumn(0).columnWidth = 0.3;
        this.clsCadena.getColumn(1).columnWidth = 0.7;

        // Componente para el tipo numerico.
        this.clsNumerico = new LOG.util.UIManager.initColumnForm({
            columnas: 3,
            hidden: true
        });

        this.tfLongitud1 = LOG.util.Prototipos.inputEntero({
            fieldLabel: this.idioma.lbLongitud,
            name: 'longitud1',
            minValue: 1,
            maxLength: 2,
            anchor: '90%',
            tipo: 2,
            campo: true,
            listeners: {
                keyup: function(tf, e) {
                    if (tf.isValid() && tf.getValue() != '') {
                        //calcular valor maximo
                        var longitud = tf.getRawValue();
                        var valor = '';
                        for (var i = 0; i < longitud - 1; i++) {
                            valor += '9';
                        }
                        _this.nfLimInferior.maxLength = longitud;
                        _this.nfLimInferior.maxLengthText = _this.idioma.lbLongitudMax.replace('_', longitud);
                        _this.nfLimInferior.maxValue = valor + '8';
                        _this.nfLimInferior.maxText = _this.idioma.lbValorMax.replace('_', valor + '8');
                        _this.nfLimSuperior.maxLength = longitud;
                        _this.nfLimSuperior.maxLengthText = _this.idioma.lbLongitudMax.replace('_', longitud);
                        _this.nfLimSuperior.maxValue = valor + '9';
                        _this.nfLimSuperior.maxText = _this.idioma.lbValorMax.replace('_', valor + '9');
                    }
                }
            }
        });
        this.nfLimInferior = LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbLimInferior,
            name: 'limiteinf',
            minValue: 1,
            anchor: '90%',
            tipo: 2,
            campo: true,
            listeners: {
                keyup: function(tf, e) {
                    if (tf.isValid() && tf.getValue() != '') {
                        var valor = parseInt(tf.getRawValue());
                        _this.nfLimSuperior.minValue = valor;
                        _this.nfLimSuperior.minText = _this.idioma.lbValorMin.replace('_', valor);
                    }
                }
            }
        });
        this.nfLimSuperior = LOG.util.Prototipos.inputEntero({
            fieldLabel: this.idioma.lbLimSuperior,
            name: 'limitesup',
            minValue: 1,
            anchor: '90%',
            tipo: 2,
            campo: true
        });
        this.checkDecimal = new Ext.form.Checkbox({
            boxLabel: this.idioma.lbDecimal,
            hideLabel: true,
            name: 'decimal',
            tipo: 2,
            campo: true,
            listeners: {
                check: function(_ck, _v) {
                    if (_v) {
                        _this.nfPrecision.enable();
                    } else {
                        _this.nfPrecision.disable();
                        _this.nfPrecision.reset();
                    }
                }
            }
        });
        this.nfPrecision = LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbPrecision,
            name: 'precision',
            minValue: 1,
            maxLength: 2,
            disabled: true,
            tipo: 2,
            campo: true
        });
        this.clsNumerico.addComponent(this.tfLongitud1);
        this.clsNumerico.addComponent(this.nfLimInferior);
        this.clsNumerico.addComponent(this.nfLimSuperior);
        this.clsNumerico.addComponent(this.checkDecimal);
        this.clsNumerico.addComponent(this.nfPrecision);


        // Componente para el tipo Nomenclador.
        this.clsNomenclador = new LOG.util.UIManager.initColumnForm({
            columnas: 1,
            hidden: true
        });

        this.cbNomencladores = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbNomencladores,
            minChars: 1,
            url: '/logistica/utiles/atribdinamicos/index.php/atributosdinamicos/cargarComboNomencladores',
            hiddenName: 'idtiponomenclador',
            displayField: 'denominacion',
            valueField: 'idtiponomenclador',
            mode: 'local',
            resizable: true,
            allowBlank: false,
            tipo: 5,
            campo: true
        });
        this.cbNomencladores.store.on({
            load: function() {
                if (_this.record && _this.record.data.idtiponomenclador) {
                    _this.cbNomencladores.setValue(_this.record.data.idtiponomenclador);
                }
            }
        });

        this.clsNomenclador.addComponent(this.cbNomencladores);

        // Panel con todas las Propiedades.
        this.panelPropiedades = new Ext.form.FieldSet({
            anchor: '99%',
            items: [this.clsCadena, this.clsNumerico, this.clsNomenclador],
            hidden: true
        });
        this.basicFormulario = LOG.util.UIManager.initForm();
        this.basicFormulario.add(clsBasico, clsCheckObligatorio, this.panelPropiedades);
        this.modelo.bindForm(this.basicFormulario);
        this.panelGeneral.add(this.basicFormulario);
        this.add(this.panelGeneral);
    },
    /**
     * Prepara la vista de la ventana correspondiente al tipo de dato.
     * @param {Numeric} tipo
     * @returns {undefined}
     */
    setView: function(tipo) {
        this.checkObligatorio.setVisible(tipo != 3);
        switch (tipo) {
            case 1: // Cadena de caracteres.
                this.panelPropiedades.show();
                this.clsCadena.show();
                this.clsNumerico.hide();
                this.clsNomenclador.hide();
                this.setSize(650, 270);
                break;
            case 2: // Numerico.
                this.panelPropiedades.show();
                this.clsCadena.hide();
                this.clsNumerico.show();
                this.clsNomenclador.hide();
                this.setSize(650, 290);
                break;
            case 5: // Nomenclador.
                this.panelPropiedades.show();
                this.clsCadena.hide();
                this.clsNumerico.hide();
                this.clsNomenclador.show();
                this.setSize(650, 240);
                break;
            default:
                this.panelPropiedades.hide();
                this.setSize(650, tipo == 3 ? 140 : 170);
                break;
        }
        Ext.each(this.panelPropiedades.find('campo', true), function(item) {
            if (item.tipo == tipo) {
                item.enable();
            } else {
                item.disable();
                item.setValue(null);
                this.modelo[item.getName()] = null;
            }
        }, this);
        this.panelPropiedades.doLayout();
    },
    aceptarFn: function() {
        var _this = this;
        this.modelo.salvar({idagrupacion: this.idagrupacion}, function() {
            _this.modelo.reset();
        });
    },
    closeFn: function() {
        this.modelo.reset();
    },
    prepareForm: function(d) {
        if (this.basicFormulario) {
            this.record = d;
            this.basicFormulario.getForm().loadRecord(d);
            this.modelo.loadRecord();
            this.setView(parseInt(d.data.tipodato));
            this.modelo.setDefaulFormValues();
        }
    }
});