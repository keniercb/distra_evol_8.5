Ext.ns('LOG.lb.producto');
LOG.lb.producto.Model = Ext.extend(LOG.util.Model, {
    constructor: function(config) {
        config.urlController = '/logistica/utiles/producto/index.php/producto/';
        config.urlAccionGuardar = 'adicionarProducto';
        config.urlAccionEliminar = 'eliminarProducto';
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'idproducto',
            primary: true
        });
        config.fields.push({
            name: 'minimo'
        });
        config.fields.push({
            name: 'maximo'
        });
        config.fields.push({
            name: 'cantidad',
            type: LOG.util.DataTypes.TYPE_FLOAT
        });
        config.fields.push({
            name: 'preciocontable'
        });
		config.fields.push({
            name: 'precioalternativo'
        });
        config.fields.push({
            name: 'categoria'
        });
        config.fields.push({
            name: 'fechafabricacion'
        });
        config.fields.push({
            name: 'fechavencimiento'
        });
        if (farmacia == 1) {
            config.fields.push({
                name: 'numerolote'
            });
            config.fields.push({
                name: 'fechavencelote'
            });
        }
        
        config.fields.push({
            name: 'idindicador'
        });
        config.fields.push({
            name: 'idunidadmedida'
        });
         config.fields.push({
            name: 'idumedida'
        });
        
        LOG.lb.documento.Model.superclass.constructor.call(this, config);
    },
    isValid: function() {
        var _this = this;
        var v = LOG.lb.documento.Model.superclass.isValid.call(this);
        if (v && this.minimo >= this.maximo && this.minimo != 0 && this.maximo != 0) {
            this.basicForm.items.each(function(field) {
                if (field.isFormField) {
                    var n = field.getName();
                    if (n == 'minimo' || n == 'maximo') {
                        field.markInvalid(_this.idioma.msgErrorMinimoMaximo);
                    }
                }
            });

            v = false;
        }
       /* if (v && !this.sm.hasSelection()) {
           // mostrarMensaje(1, this.idioma.msgSelectObjeto);
            v = false;
        }*/
        return v;
    }

});