Ext.namespace('Ext.EstandarCodigoBarras');
Ext.EstandarCodigoBarras.model = Ext.extend(Ext.util.Observable, {
    url: '',
    constructor: function () {
        Ext.EstandarCodigoBarras.model.superclass.constructor.call(this);
    },
    getStoreGridPrincipal: function () {
        if (!this.stGridPrincipal) {
            this.crearStoreGridPrincipal();
        }
        return this.stGridPrincipal;
    },
    crearStoreGridPrincipal: function () {
        this.stGridPrincipal = new Ext.data.Store({
            url: this.url + 'cargarEstandaresCodigoBarra',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: 'idestandarcodigobarra'
                },
                [
                    {name: 'idestandarcodigobarra'},
                    {name: 'denominacion'},
                    {name: 'bandera'},
                    {name: 'formato'},
                    {name: 'sequenciaporentidad'},
                    {name: 'secuenciaactual'},
                ]
            )
        });
    },
    addModEstandarCodigoBarras: function (datos, callback) {
        Ext.Ajax.request({
            method: "POST",
            url: "addModEstandarCodigoBarras",
            params: datos,
            scope: this,
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (typeof callback === 'function') {
                    callback.call(this, responseData);
                }
            }
        });
    },
    eliminarEstandarCodigoBarras: function (datos, callback) {
        Ext.Ajax.request({
            method: "POST",
            url: "eliminarEstandarCodigoBarras",
            params: datos,
            scope: this,
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (typeof callback === 'function') {
                    callback.call(this, responseData);
                }
            }
        });
    },
    setearSequenciaEstandarCodigoBarras: function (datos, callback) {
        Ext.Ajax.request({
            method: "POST",
            url: "setearSequenciaEstandarCodigoBarras",
            params: datos,
            scope: this,
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (typeof callback === 'function') {
                    callback.call(this, responseData);
                }
            }
        });
    },
    probarEstandarCodigoBarras: function (datos, callback) {
        Ext.Ajax.request({
            method: "POST",
            url: "probarEstandarCodigoBarras",
            params: datos,
            scope: this,
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (typeof callback === 'function') {
                    callback.call(this, responseData);
                }
            }
        });
    }
});