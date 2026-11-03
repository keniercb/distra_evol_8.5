LOG.aft.planes.adicionar = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        this.idioma = config.idioma;
        this.scope = config.scope;
        this.layout = 'fit';
        LOG.aft.planes.adicionar.superclass.constructor.call(this, config);
        this.setTitle(this.idioma.titleVentana);
        this.width = 400;
        this.height = 130;
        this.modelo = new Ext.LOG.planes.Model({
            idioma: this.idioma,
            scope: this.scope
        });
        this.panelViewAdd();
    },
    initComponent: function(config) {
        var _this = this;
        LOG.aft.planes.adicionar.superclass.initComponent.call(this);
        LOG.util.UIManager.apply(this.listaBotones.getItem(1), {
            disabled: true,
            handler: function() {
                var _this = this;
                _this.onAdicionarClik(true);
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function() {
                var _this = this;
                _this.onAdicionarClik(false);
            }
        });
    },
    onAdicionarClik: function(aplicar) {
        var _this = this;
        var FechaActual = new Date();
        var ano = FechaActual.getFullYear();
        //console.info(_this.panelADD.getForm().isValid());return;
        if (_this.panelADD.getForm().isValid())
        {
            if (_this.ano.getValue() < ano) {
                mostrarMensaje(1, 'El año no puede ser menor a la fecha actual.');
                return false;
            }
            var params = {
                ano: _this.ano.getValue(),
                plan: _this.plan.getValue(),
                estado: 1,
                idespecialidad: _this.scope.cmbEspecialidad.getValue(),
                idestructura: _this.scope.comboAreaResp.getValue(), //_this.idestructura,
                aplicar: (aplicar) ? 'aplicar' : false
            };
            _this.modelo.enviarDatos(params, _this)
        } else
            mostrarMensaje(1, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s)');

    },
    panelViewAdd: function() {
        var _this = this;
        var clsPanelAdd = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.ano = new LOG.util.Prototipos.inputTexto({
            anchor: '95%',
            maxLength: '4',
            minLength: '4',
            fieldLabel: _this.idioma.lbAnno,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            allowBlank: false,
        });
        clsPanelAdd.addComponent(this.ano);
        this.plan = new LOG.util.Prototipos.inputTexto({
            anchor: '95%',
            maxLength: '19',
            fieldLabel: _this.idioma.lbPlan,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            allowBlank: false
        });
        clsPanelAdd.addComponent(this.plan);
        this.panelADD = new LOG.util.UIManager.initForm({
            region: 'center',
            width: 400,
            layout: 'form',
            autoHeight: true,
            frame: true,
            items: [clsPanelAdd],
            listeners: {
                'clientvalidation': function(fp, valid) {
                    var checkdirty = false;
                    fp.getForm().items.each(function(field) {                        
                        if (field.isDirty() && valid) {
                            checkdirty = true;
                            _this.listaBotones.getItem(2).enable();
                            _this.listaBotones.getItem(1).enable();
                        }
                    });
                    if (!checkdirty) {
                        _this.listaBotones.getItem(2).disable();
                        _this.listaBotones.getItem(1).disable();

                    }
                }
            }
        });
        _this.add(this.panelADD);
    }
});
