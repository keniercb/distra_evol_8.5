LOG.dist.pedido.Model = Ext.extend(LOG.lb.documento.Model, {

    listaProductosExtras: undefined,
    listaServiciosExtras: undefined,

    constructor: function (config) {
        var _this= this;
        this.listaProductosExtras = new LOG.util.List();
        this.listaServiciosExtras = new LOG.util.List();
        this.gridModificado = false;

        config.fields = [
            {
                name: 'iddocumento'
            },
            {
                name: 'idcontrato'
            },
            {
                name: 'idclientesproveedores'
            },
            {
                name: 'idcliente'
            },
            {
                name: 'cliente'
            },
            {
                name: 'fechavencimiento'
            },
            {
                name: 'observaciones'
            },
            {
                name: 'estadopedido'
            },
            {
                name: 'denomtipopedido'
            }
        ];
        LOG.dist.pedido.Model.superclass.constructor.call(this, config);
    },

    adicionarReclamo: function (idpedido, idtiporeclamoentidad, descripcion, fechasugerida, st) {
        var _this = this;
        Ext.getBody().mask(_this.idioma.msgSalvandoObjeto, 'x-mask-loading');
        Ext.Ajax.request({
            url: 'reclamarPedido',
            method: 'POST',
            params: {
                descripcion: descripcion,
                fechasugerida: fechasugerida,
                idtiporeclamo: idtiporeclamoentidad,
                idpedido: idpedido
            },
            callback: function (options, success, response) {
                Ext.getBody().unmask();
                st.reload();
                responseData = Ext.decode(response.responseText);
                if (responseData.success) {
                    mostrarMensaje(1,_this.idioma.msgAddReclamo);
                } else {
                    mostrarMensaje(3, _this.idioma.msgErrorReclamo);
                }
            }
        });
    },

    eliminarProducto: function (lista, st) {
        var _this = this;
        mostrarMensaje(2, _this.idioma.lbMsgConfirmarEliminarProductoServicio, function (btn) {
            if (btn == 'ok') {
                Ext.getBody().mask(_this.idioma.msgEliminandoProductoServicio, 'x-mask-loading');
                Ext.Ajax.request({
                    url: 'eliminarProducto',
                    method: 'POST',
                    params: {
                        idproducto: Ext.encode(lista)
                    },
                    callback: function (options, success, response) {
                        Ext.getBody().unmask();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.success) {
                            st.load();
                            mostrarMensaje(1,_this.idioma.msgEliminarProductoServicio);
                        } else {
                            mostrarMensaje(3, _this.idioma.msgErrorProductoServicio);
                        }
                    }
                });
            }
        });
    },

    adicionarProducto: function (iddocumento, listaProd, servicio ,st) {
        var _this = this;
        Ext.getBody().mask(_this.idioma.msgAdicionandoProductoServicio, 'x-mask-loading');
        Ext.Ajax.request({
            url: 'addProducto',
            method: 'POST',
            params: {
                idpedido: iddocumento,
                productos: Ext.encode(listaProd.getArray()),
                servicio: servicio
            },
            callback: function (options, success, response) {
                Ext.getBody().unmask();
                responseData = Ext.decode(response.responseText);
                if (responseData.success) {
                    st.load();
                    mostrarMensaje(1,_this.idioma.msgAddProductoServicio);
                } else {
                    mostrarMensaje(3, _this.idioma.msgErrorAddProductoServicio);
                }
            }
        });
    },

    eliminarReclamo: function (idreclamopedido, st) {
        var _this = this;
        mostrarMensaje(2, _this.idioma.lbMsgConfirmarEliminarReclamo, function (btn) {
            if (btn == 'ok') {
                Ext.getBody().mask(_this.idioma.msgEliminandoReclamo, 'x-mask-loading');
                Ext.Ajax.request({
                    url: 'eliminarReclamo',
                    method: 'POST',
                    params: {
                        idreclamopedido: Ext.encode(idreclamopedido)
                    },
                    callback: function (options, success, response) {
                        Ext.getBody().unmask();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.success) {
                            st.load();
                            mostrarMensaje(1,_this.idioma.msgEliminarReclamo);
                        } else {
                            mostrarMensaje(3, _this.idioma.msgErrorEliminarReclamo);
                        }
                    }
                });
            }
        });


    },

    cerrarPedido: function (idpedido, st) {
        var _this = this;
        mostrarMensaje(2,_this.idioma.lbMsgConfirmarCerrar, function (btn) {
            if (btn == 'ok') {
                Ext.getBody().mask(_this.idioma.msgCerrando, 'x-mask-loading');
                Ext.Ajax.request({
                    url: 'cerrarPedido',
                    method: 'POST',
                    params: {
                        iddocumento: idpedido
                    },
                    callback: function (options, success, response) {
                        Ext.getBody().unmask();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.success) {
                            st.load();
                            mostrarMensaje(1,_this.idioma.lbMsgCerrarOk);
                           
                        } else {
                            mostrarMensaje(3, _this.idioma.lbMsgErrorCerrar);
                            
                        }
                    }
                });
            }
        });
    },

    reset: function() {
        LOG.dist.pedido.Model.superclass.reset.call(this);
        this.listaProductosExtras.deleteAll();
        this.listaServiciosExtras.deleteAll();
    },

    isValid: function(){
            return (LOG.lb.documento.Model.superclass.isValid.call(this) ||
            this.gridModificado);
    }
});
