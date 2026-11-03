Ext.ns('LOG.lb.documento');

LOG.lb.documento.VentanaProductos = Ext.extend(LOG.lb.producto.View, {
    _parent: undefined,
    constructor: function(config) {
        LOG.lb.documento.VentanaProductos.superclass.constructor.call(this, config);
        this.autoLoad = false;
        this.autoLoadProd = false;
    },
    doAction: function(r) {
        var _this = this;
        if (_this._parent != undefined) {
            var _productos = new Array();
            Ext.each(r, function(rec) {
                _productos.push(rec.get('idproducto'));
            });

            if (_this._parent.modelo.iddocumento == null) {
                _this._parent.modelo.salvar({
                    idestructuracomun: _this._parent.idDeposito,
                    idproductos: Ext.encode(_productos)
                }, function(resp) {
                    _this.postSalvar.createDelegate(_this, [resp]).call();
                });
            } else {
                _this._parent.modelo.adicionarMovimientos({
                    idproductos: Ext.encode(_productos)
                }, function(resp) {
                    _this.postSalvar.createDelegate(_this, [resp]).call();
                });
            }
        }
    },
    postSalvar: function(r) {        
        var _scope = this._parent.winGestionarDocumento;
        _scope.cargarProductos();        
        if (_scope.record == null) {
            _scope.record = {};
            Ext.apply(_scope.record, {
                data: {
                    iddocumento: r.iddocumento,
                    estado: "1"
                }
            });

        } else {
            _scope.record.data.estado = "1";
        }
        _scope.getTitleDocumento(_scope.record.data.iddocumento);
        _scope.listaBotonesVentana.each(function(b) {
            LOG.util.UIManager.applyKey(b, _scope);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_scope, [b, _scope]).call();
            }
        }, _scope);

        _scope.modelo.getStore().reload();
    }
});
