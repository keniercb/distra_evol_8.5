Ext.namespace('Ext.AddModEstandarCodigoBarras');
Ext.AddModEstandarCodigoBarras.window = Ext.extend(Ext.Window, {
    autoValidate: false,
    modal: true,
    constrain: true,
    width: Ext.lib.Dom.getViewWidth() * 0.50,
    closeAction: 'destroy',
    frame: true,
    resizable: false,
    title: 'Adicionar Estandar de codigo de barras',
    layout: 'fit',
    idEstandarCodigoBarras: undefined,
    constructor: function () {
        this.crearBtn();
        this.view = new Ext.AddModEstandarCodigoBarras.view();
        this.controller = new Ext.AddModEstandarCodigoBarras.controller(this.view, this);
        this.buttons = [this.getBtnCancelar(), this.getBtnAceptar()];
        this.items = [this.view];
        Ext.AddModEstandarCodigoBarras.window.superclass.constructor.call(this);
        this.addEvents('aceptar');

        this.controller.on({
            scope: this,
            aceptar: function (datos) {
                datos.idestandarcodigobarra = this.idEstandarCodigoBarras;
                this.fireEvent('aceptar', datos);
                this.close();
            }
        });
    },
    getBtnCancelar: function () {
        return this.btnCancelar;
    },
    getBtnAceptar: function () {
        return this.btnAceptar;
    },
    crearBtn: function () {
        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            selectOnFocus: true,
            text: 'Cancelar',
            scope: this,
            handler: function () {
                this.close();
            }
        });
        
        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
        });
    },
    loadDatosAModificar: function (datos) {
        this.idEstandarCodigoBarras = datos.idestandarcodigobarra;
        this.view.getFormulario().getForm().setValues(datos);
        this.controller.actualizarLongitud(this.view);
    }
});