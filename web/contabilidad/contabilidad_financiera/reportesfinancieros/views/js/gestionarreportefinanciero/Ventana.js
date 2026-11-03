Ext.namespace('Contabilidad.Reporte.Ventana');

Contabilidad.Reporte.Ventana.View = Ext.extend(Ext.Window, {
    layout: 'fit',
    height: 500,
    width: 500,
    closeAction: 'destroy',
    modal: true,
    constrain: true,
    accion: 'adicionar',
    autoValidate: false,
    initComponent: function () {

        this.crearCuerpo();

        this.crearBotones();

        this.controllerGen = new Contabilidad.Reporte.Ventana.Controller({
            view: this
        });

        this.controllerGen.inicializarEventos();

        this.etiquetas = this.etiquetas || {};

        Contabilidad.Reporte.Ventana.View.superclass.initComponent.call(this);

    },

    crearCuerpo: function () {

    },

    esValida: function () {
        return true;
    },

    crearBotones: function () {

        this.defaultButton = this.btnCancelar = new Ext.Button({
            text: this.etiquetas.lbBtnCancelar,
            tooltip: this.etiquetas.lbTtCancelar,
            minWidth: 80,
            iconCls: 'cancelar',
            accion: 'cancelar'
        });

        this.btnAplicar = new Ext.Button({
            text: this.etiquetas.lbBtnAplicar,
            tooltip: this.etiquetas.lbTtAplicar,
            iconCls: 'aplicar',
            minWidth: 80,
            disabled: true,
            accion: 'aplicar'
        });

        this.btnAceptar = new Ext.Button({
            text: this.etiquetas.lbBtnAceptar,
            tooltip: this.etiquetas.lbTtAceptar,
            iconCls: 'aceptar',
            minWidth: 80,
            disabled: true,
            accion: 'aceptar'
        });

        this.buttons = [this.btnCancelar, this.btnAplicar, this.btnAceptar];

        //Eliminando boton aplicar en caso que la accion sea distinto de adicionar
        if (this.accion != 'adicionar') {
            this.buttons.splice(1, 1);
        }
    }
});

Contabilidad.Reporte.Ventana.Controller = function (params) {

    Ext.apply(this, params);

    this.inicializarEventos = function () {

        this.view.on({
            scope: this,
            show: function () {
                var task = {
                    scope: this,
                    run: this.comprobarVentana,
                    interval: 100
                }

                if (this.view.accion == 'adicionar' && this.view.primercampo) {
                    this.view.primercampo.focus(false, 100);
                }

                Ext.TaskMgr.start(task);
            },
            close: function () {
                this.view.closed = true;
            },
            destroy: function () {
                this.view.closed = true;
            },
            hide: function () {
                this.view.closed = true;
            }
        });

        this.view.btnCancelar.on({
            scope: this,
            click: function () {
                this.view.close();
            }
        });
    }

    this.comprobarVentana = function () {
        if (this.view.closed) {
            return false;
        }
        this.habilitarBotones(this.view.esValida());
    }

    this.habilitarBotones = function (valid) {
        this.view.btnAceptar.setDisabled(!valid);
        this.view.btnAplicar.setDisabled(!valid);
    }


};
