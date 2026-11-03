Ext.namespace('Ext.UIMotivoCancelacion');
Ext.UIMotivoCancelacion.WindowUIMotivoCancelacion = Ext.extend(Ext.Window, {
    lmask: undefined,
    url: '',
    etiquetas: undefined,
    pregunta: '',
    numeros: '',
    constructor: function (params) {
        this.url = params.url;
        // this.etiquetas = params.etiquetas;
        this.pregunta = params.pregunta;
        this.numeros = params.numero;
        this.stMotivoCancelacion = params.store;
        Ext.apply(this, {
            autoValidate: true,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.30,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            title: 'Cancelar',
            listeners: {
                scope: this,
                show: function () {
                },
                close: function () {
                }
            }
        });
        this.initializeClass(this);
        return Ext.UIMotivoCancelacion.WindowUIMotivoCancelacion.superclass.constructor.call(this);
    },
    loadMask: function (message) {
        this.lmask = new Ext.LoadMask(this.body, {
            msg: message
        }).show();
    },
    initializeClass: function (scope) {
        this.createButtons(scope);
        this.createForm(scope);
        this.initFunctions(scope);
        this.initEventos(scope);
    },
    createButtons: function (scope) {
        scope.btnCancelar = new Ext.Button({
            id:'idbtnCancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'/*scope.etiquetas.lbToolCancelar*/,
            text: 'Cancelar',
            iconCls: 'cancelar',
            disabled: false
        });

        scope.btnAceptar = new Ext.Button({
            id:'idbtnAceptar',
            tooltip: 'Guardar datos y cerrar ventana'/*scope.etiquetas.lbToolAceptar*/,
            text: 'Aceptar',
            iconCls: 'aceptar',
            disabled: true
        });

        scope.buttons = [scope.btnCancelar, scope.btnAceptar];
    },
    createForm: function (scope) {

        scope.cbMotivoCancelacion = new Ext.form.ComboBox({
            allowBlank: false,
            fieldLabel: 'Motivo',
            store: scope.stMotivoCancelacion,
            valueField: 'idmotivocancelacion',
            displayField: 'descripcion',
            typeAhead: true,
            forceSelection: true,
            anchor: '100%',
            mode: 'local',
            resizable: false,
            triggerAction: 'all',
            enableKeyEvents: true
        });

        scope.formUIMotivoCancelacion = new Ext.FormPanel({
            frame: true,
            layout: 'form',
            autoHeight: true,
            border: false,
            labelAlign: 'top',
            items: [{
                html: '<div style="font-size: 10pt">' + scope.pregunta + '<br>' + '<br>' + scope.numeros + '<br><br>' + '</div>'
            }, {
                layout: 'column',
                items: [
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [scope.cbMotivoCancelacion]
                    }
                ]
            }
                ]
        });

        scope.items = [scope.formUIMotivoCancelacion];
    },
    initFunctions: function (scope) {

    },
    initEventos: function (scope) {

        scope.addEvents('motivocancelacion');

        scope.btnCancelar.setHandler(function () {
            scope.close();
        });

        scope.btnAceptar.setHandler(function () {
            scope.fireEvent('motivocancelacion', scope.cbMotivoCancelacion.getValue(), scope.cbMotivoCancelacion.getRawValue());
        });

        // scope.cbMotivoCancelacion.on({
        //     valid: function (fiedl) {
        //         scope.btnAceptar.enable();
        //     },
        //     invalid: function (field, msg) {
        //         scope.btnAceptar.disable();
        //     }
        // });
    },
});