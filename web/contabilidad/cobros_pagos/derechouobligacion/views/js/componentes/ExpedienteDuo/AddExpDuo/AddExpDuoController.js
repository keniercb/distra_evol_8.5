Ext.namespace('Ext.AddExpDuo');
Ext.AddExpDuo.Controller = Ext.extend(Ext.Component, {
    fechaInicioPeriodo: undefined,
    fechaContablePeriodo: undefined,
    fechaFinPeriodo: undefined,
    view: undefined,
    constructor: function(params)
    {
        this.crearSetsAndGets();

        this.setView(params.view);
        this.setFechasPeriodoContable(
            params.fechaInicial,
            params.fechaActual,
            params.fechaFin,
        );

        this.loadDataComponent();

        Ext.AddExpDuo.Controller.superclass.constructor.call(this);

        this.addEvents('addExpDuo');
    },
    loadDataComponent: function()
    {
        this.initializeClass();
    },
    initializeClass: function () {
        var view = this.getView();
        var model = view.getModel();
        this.initializeFunctions(view, model);
        this.initializeEvents(view, model);

        // this.cargarDatos();
        // this.createFormSteps();
    },
    initializeEvents: function(view, model) {

    },
    initializeFunctions: function(view, model) {
        var me = this;

        this.funcionesGenerales = function () {
            this.loadMessageBox = function (msg = 'Cargando...', title = 'Por favor espere...') {
                Ext.MessageBox.show({
                    title: title,
                    msg: msg,
                    width: 300,
                    progress: true,
                    closable: false
                });
                var f = function (v) {
                    return function () {
                        var i = v / 11;
                        Ext.MessageBox.updateProgress(i);
                    };
                };
                for (var i = 1; i < 12; i++)
                    setTimeout(f(i), i * 500);
            };

            this.hideMessageBox = function () {
                Ext.MessageBox.hide();
            };

        };

        this.funcionesForm = function () {

            this.cargarDatos = function (datosMod) {
                if (datosMod) {
                    view.getCbTipoDoc().setValue(datosMod.tipoDoc);
                    view.getDfFecha().setValue(datosMod.fecha);
                    view.getDfFechaVencimiento().setValue(datosMod.fechavencimiento);
                    view.getTfDescripcion().setValue(datosMod.descripcion);
                    view.getFufDocumento().disable();
                    view.getFufDocumento().button.disable();
                    view.getFufDocumento().fileInput.remove();
                }
            };

            this.createFormSteps = function (btns) {
                me.formSteps = new CON.Util.FormSteps({
                    arrForm: view.getFormExp(),
                    arrBtn: btns
                });

                me.formSteps.on({
                    scope: this,
                    Crear: function (fnCrear, cerrarVentana) {
                        me.fireEvent('addExpDuo', view.getFormExp());
                    }
                });
            };
        };

        this.funcionesGenerales.call(this);
        this.funcionesForm.call(this);
    },
    crearSetsAndGets: function () {

        this.setFechasPeriodoContable = function (fechaInicial, fechaActual, fechaFin) {
            this.fechaInicioPeriodo = fechaInicial;
            this.fechaContablePeriodo = fechaActual;
            this.fechaFinPeriodo = fechaFin;
        };

        this.getPeriodoConFechaInicial = function () {
            return this.fechaInicioPeriodo;
        };

        this.getPeriodoConFechaActual = function () {
            return this.fechaContablePeriodo;
        };

        this.getPeriodoConFechaFin = function () {
            return this.fechaFinPeriodo;
        };

        this.setView = function (view) {
            this.view = view;
        };

        this.getView = function () {
            return this.view;
        };

    }
});