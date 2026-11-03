Ext.ns('LOG.fac.configuracionpuntoventa');
LOG.fac.configuracionpuntoventa.winAdicionarcajero = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        this.xtypesEvtents = {
            checkbox: {
                evt: ['check']
            },
            combobox: {
                evt: ['select']
            },
            combousuariosdoc: {
                evt: ['select']
            },
            combo: {
                evt: ['select']
            },
            combotipodoc: {
                evt: ['select']
            },
            combologistica: {
                evt: ['select']
            },
            trigger: {
                evt: ['change']
            },
            combonomenclador: {
                evt: ['select']
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
            },
            treecombologistica: {
                evt: ['select']
            }
        };
        var me = this;
        LOG.util.UIManager.apply(this, config);
        this.width = 400;
        this.height = 150;
        this.resizable = false;
        this.usarAplicar = false;
        this.idComponent = 'wAddCaja';
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/'
        });
        this.idcajero = config.idcajero
        LOG.fac.configuracionpuntoventa.winAdicionarcajero.superclass.constructor.call(this, config);
        this.ventanaAdicionar();
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function () {
                var params = {
                    datos: Ext.encode(me.getParams()),
                    action: this.action,
                    cajero: true
                };
                me.modelo.salvar(params, function () {
                    me.close();
                    me._parent.getStorePrincipal().reload();
                });
            }
        });
        //if (this.action === 'mod') {
        this.bindForm(me.pMain);
        this.filloutData();
        //}
    },
    ventanaAdicionar: function () {
        var me = this;

        this.clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 3,

        });
        this.tfDenominacion = new LOG.util.Prototipos.inputTexto({
            name: 'denominacion',
            fieldLabel: me.idioma.tfDenominacion,
            maxLength: '15',
            minLength: '1',
            regex: LOG.util.Regex.cadena,
            allowBlank: false,
            listeners: {
                keyup: function(){

                }
            }
        });
        this.tfPinsecreto = new LOG.util.Prototipos.inputTexto({
            name: 'pinsecreto',
            fieldLabel: me.idioma.tfPin,
            maxLength: '15',
            minLength: '1',
            regex: LOG.util.Regex.cadena,
            allowBlank: false,
            listeners: {
                keyup: function(){

                }
            }
        });
        this.cmbTipo = new LOG.util.ComboBox({
            name: 'tipo',
            valueField: 'tipo',
            displayField: 'descripcion',
            fieldLabel: me.idioma.tfTipo,
            autoLoad: true,
            allowBlank: false,
            editable: false,
            store: new Ext.data.SimpleStore({
                fields: ['tipo', 'descripcion'],
                data: [
                    [1, me.idioma.lbCajero],
                    [5, me.idioma.lbCajeroSup]
                ]
            }),
            listeners: {
                select: function(cmb, rd) {

                }
            }
        });

        this.clsSuperior.addComponent(this.tfDenominacion);
        this.clsSuperior.addComponent(this.tfPinsecreto);
        this.clsSuperior.addComponent(this.cmbTipo);

        this.clsSuperior.getColumn(0).columnWidth = 0.40;
        this.clsSuperior.getColumn(1).columnWidth = 0.25;
        this.clsSuperior.getColumn(2).columnWidth = 0.35;
        this.clsSuperior.getColumn(0).getComponent(0).anchor = '97%';
        this.clsSuperior.getColumn(1).getComponent(0).anchor = '97%';
        this.clsSuperior.getColumn(2).getComponent(0).anchor = '97%';

        this.fsDatosCajero = new Ext.form.FieldSet({
            items: [this.clsSuperior]
        });

        this.pMain = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [this.fsDatosCajero]
        });
        this.add(this.pMain);
    },
    getParams: function () {
        var params = {};
        var _this = this;
        if (_this.tfPinsecreto.isValid()) {
            params.pinsecreto = _this.tfPinsecreto.getValue();
        }
        if (_this.tfDenominacion.isValid()) {
            params.denominacion = _this.tfDenominacion.getValue();
        }
        if (_this.cmbTipo.isValid()) {
            params.tipo = _this.cmbTipo.getValue();
        }
        if (_this.action == 'mod'){
            var selected = this._parent.getSmPrincipal().getSelected();
            params.action = 'mod';
            params.idcajero = selected.data.idcajero;
        }
        return params;
    },
    filloutData: function () {
        var _this = this;
        if(_this.idcajero){
            var selected = _this._parent.getSmPrincipal().getSelected();
            this.pMain.getForm().loadRecord(new Ext.data.Record(selected.json));
        }
    },
    bindForm: function(basicForm) {
        var _scope = this;
        this.basicForm = basicForm.getForm();
        Ext.apply(this.basicForm, {
            loadRecord: function(record) {
                this.setValues(record.data);
                _scope.setDefaulFormValues();
                return this;
            }
        });
        this.basicForm.items.each(function(field) {
            if (field.isFormField) {
                if (_scope.xtypesEvtents[field.getXType()]
                    && _scope.xtypesEvtents[field.getXType()]['evt'] == 'keyup'
                    && !field.enableKeyEvents)
                {
                    field.enableKeyEvents = true;
                }
                LOG.util.UIManager.encadenaFn(field, 'fireEvent', function(e) {
                    if ((_scope.xtypesEvtents[field.getXType()]
                        && e == _scope.xtypesEvtents[field.getXType()]['evt'])
                        || e == 'blur') {
                        _scope[field.getName()] = field.getValue();
                        if (_scope.isValid()) {
                            _scope.habilitarBotones();
                        } else {
                            _scope.habilitarBotones(true);
                        }
                    }
                    if (_scope.xtypesEvtents[field.getXType()]
                        && _scope.xtypesEvtents[field.getXType()]['evt'] == 'check')
                    {
                        _scope[field.getName()] = 0;
                        if(field.getValue() == true){
                            _scope[field.getName()] = 1;
                        }
                    }
                });
            }
        });
    },
    setDefaulFormValues: function() {
        if (!this.basicForm) {
            return;
        }
        this.basicForm.items.each(function(field) {
            field.originalValue = field.getValue();
        });
    },
    isValid: function() {
        var _this = this;
        if (_this.idcajero) {
            return this.basicForm.isValid() && this.basicForm.isDirty();
        } else {
            return this.basicForm.isValid();
        }
    },
    habilitarBotones: function(enabled){
        var _this = this;
        _this.listaBotones.getItem(2).setDisabled(enabled || false);
    }
});