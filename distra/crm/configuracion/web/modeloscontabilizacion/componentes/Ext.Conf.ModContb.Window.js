/**
 * Componente con la estructura base de las ventanas.
 * @class Ext.Conf.ModContb.Window
 * @extends Ext.Window
 * @category Componente
 * @author Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @version 1.0
 */
Ext.ns('Ext.Conf.ModContb');
Ext.Conf.ModContb.Window = Ext.extend(Ext.Window, {
    closable: true,
    modal: true,
    closeAction: 'destroy',
    width: 300,
    height: 300,
    perfil: window.parent.perfil,
    onEsc: Ext.emptyFn,
    firstElement: undefined,
    lastElement: undefined,
    autoValidate: false,
    constrain: true,
    constructor: function (config) {
        var scope = this;

        this.action = config.action || 'adicionar';

        this.idioma = config.idioma;

        this.addEvents('windowValid', 'cancel');

        this.buttons = this.CreateButtons(scope);

        this.defaultButton = this.btncancelar;

        this.inicializarEventos(this);

        Ext.Conf.ModContb.Window.superclass.constructor.call(this, config);
    },
    //Crea los botones de la ventana
    CreateButtons: function (scope) {
        this.lastElement = this.btnaceptar = new Ext.Button({
            text: scope.idioma.btnaceptar || 'Accept',
            minWidth: 80,
            tooltip: scope.idioma.tooltipbtnaceptar || 'Save data and close window',
            iconCls: 'aceptar',
            disabled: true
        });

        this.btnaplicar = new Ext.Button({
            text: scope.idioma.btnaplicar || 'Apply',
            minWidth: 80,
            iconCls: 'aplicar',
            tooltip: scope.idioma.tooltipbtnaplicar || 'Save data and clear fields',
            disabled: true
        });

        this.btncancelar = new Ext.Button({
            text: scope.idioma.btncancelar || 'Cancel',
            minWidth: 80,
            iconCls: 'cancelar',
            id: 'idcancelar',
            tooltip: scope.idioma.tooltipbtncancelar || 'Close window without saving data'
        });

        var buttons = [this.btncancelar, this.btnaceptar];

        if (scope.action == 'adicionar') {
            buttons.splice(1, 0, this.btnaplicar);
        }
        return buttons;
    },
    //Inicializa los eventos de la ventana
    inicializarEventos: function () {
        this.on(
            {
                windowValid: function (valid) {
                    if (!valid) {
                        this.btnaceptar.disable();
                        this.btnaplicar.disable();
                    } else {
                        this.btnaceptar.enable();
                        this.btnaplicar.enable();
                    }
                },
                show: function () {
                    var scope = this;
                    if (this.action == 'modificar') {
                        this.focus();
                    } else {
                        setTimeout(function () {
                            scope.firstElement.focus();
                        }, 10);
                    }
                }
            }
        );

        this.btncancelar.on(
            {
                scope: this,
                click: function (btn) {
                    this.fireEvent('cancel');
                    this.destroy();
                }
            }
        )
    }
});