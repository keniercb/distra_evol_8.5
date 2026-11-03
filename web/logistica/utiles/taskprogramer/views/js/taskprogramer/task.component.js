Ext.ns('LOG.lb.task');

LOG.lb.task.VentanaAddTask = Ext.extend(LOG.util.Window, {
    idioma: undefined,
    modelo: undefined,
    record:undefined,
    constructor: function (config) {
        var _this = this;
        config.idioma = LOG.util.UIManager.apply(config.idioma, LOG.lb.taskprogramer.Idioma);
        LOG.lb.task.VentanaAddTask.superclass.constructor.call(this, config);
        this.modelo.addActionButton(this.listaBotones.getItem(2));
        this.modelo.addActionButton(this.listaBotones.getItem(1));
        this.listaBotones.getItem(1).handler = function () {
            _this.scope = _this;
            _this.onAplicarHandler();
            _this.basicFormulario.getForm().reset();
        }

    },
    initComponent: function () {
        var _this = this;
        LOG.lb.task.VentanaAddTask.superclass.initComponent.call(this);
        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'center'
        });
        this.tfDenominacion = new Ext.form.TextField({
            fieldLabel: _this.idioma.lbDenominacion,
            allowBlank: false,
            name: 'denominacion'
        });
        this.tfClase = new Ext.form.TextField({
            fieldLabel: _this.idioma.lbClase,
            allowBlank: false,
            name: 'clase'
        });
        var cls1 = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        cls1.addComponent(_this.tfDenominacion);
        var cls2 = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        cls2.addComponent(_this.tfClase);
        this.basicFormulario = new LOG.util.UIManager.initForm();
        this.basicFormulario.add(cls1);
        this.basicFormulario.add(cls2);
        this.modelo.bindForm(this.basicFormulario);
        this.panelGeneral.add(_this.basicFormulario);
        this.add(_this.panelGeneral);
    },
    aceptarFn: function () {
        this.modelo.salvar({}, function (resp) {
        }, function (resp) {
        });
    },
    onAplicarHandler: function () {
        var _this = this;
        LOG.lb.task.VentanaAddTask.superclass.onAplicarHandler.call(this);
    },
    prepareForm: function (d) {
        var _this = this;
        if (this.basicFormulario) {
            this.modelo.bindForm(this.basicFormulario);
            this.basicFormulario.getForm().loadRecord(d);
            this.modelo.idnomtarea = d.data.idnomtarea;
        }
    }


});



