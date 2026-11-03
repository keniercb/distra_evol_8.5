Ext.namespace('Ext.AddModEstandarCodigoBarras');
Ext.AddModEstandarCodigoBarras.controller = Ext.extend(Ext.util.Observable, {
    tamannoCodigoBarras: [8, 12, 13, 14, 18],
    constructor: function (view, window) {
        Ext.AddModEstandarCodigoBarras.controller.superclass.constructor.call(this);
        this.addEvents('aceptar');
        this.view = view;
        this.crearEventos(view, window);
    },
    crearEventos: function (view, window) {
        let _this = this;
        window.getBtnAceptar().setHandler(this.onClickAceptar, this);

        view.nfBandera.on({
            scope: this,
            keyup: function () {
                this.actualizarLongitud(view);
            }
        });

        view.tfFormato.on({
            scope: this,
            keyup: function () {
                this.actualizarLongitud(view);
            }
        });

        view.tfFormato.validator = function (value) {
            if (!_this.isLengthCodigoBarrasCorrecto.call(_this, value.length + view.nfBandera.getValue().toString().length)) {
                return 'El tamaño del codigo debe ser alguno de: ' + _this.tamannoCodigoBarras.join(', ')
            }
        }
    },
    onClickAceptar: function (btn) {
        if (this.isValid()) {
            let datos = this.view.getFormulario().getForm().getValues();
            this.fireEvent('aceptar', datos);
        }
        console.log('Click aceptar');
    },
    isValid: function () {
        return this.view.getFormulario().getForm().isValid();
    },
    isLengthCodigoBarrasCorrecto: function (length) {
        return this.tamannoCodigoBarras.includes(length);
    },
    actualizarLongitud: function (view) {
        let bandera = view.nfBandera.getValue();
        let formato = view.tfFormato.getValue();
        view.nfLongitud.setValue(bandera.toString().length + formato.length);
    }
});