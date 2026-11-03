Ext.ns('LOG.inv.entrada.registrarDiferencia');

LOG.inv.entrada.registrarDiferencia.Model = Ext.extend(LOG.util.Model, {
    /**
     * Arreglo de valores de calidad.
     */
    arrayCalidad: null,
    /**
     * Cantidad del movimeinto que genera la diferencia.
     */
    cantidadmaxima: 0,
    /**
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.arrayCalidad = new Array();
        config.urlAccionGuardar = 'registrarDiferencias';
        config.fields = [
            {name: 'idmovimiento'},
            {name: 'signo'},
            {name: 'cantidaddiferencia'},
            {name: 'preciodiferencia'},
            {name: 'importediferencia'},
            {name: 'preciodiferenciaalt'},
            {name: 'importediferenciaalt'},
            {name: 'calidad'}
        ];
        LOG.inv.entrada.registrarDiferencia.Model.superclass.constructor.call(this, config);
    },
    /**
     * Adiciona o elimina un record a la lista de calidad.
     * @param {Record.data} c
     * @param {Boolean} borrar [Opcional]
     * @returns {Record.data}
     */
    actualizarListaCalidad: function(c, borrar) {
        var currentIndex = -1, suma = 0, error = false;
        Ext.apply(c, {eliminar: borrar});
        currentIndex = this.getIndex(c, function(cantidad) {
            if (cantidad == 0) {
                error = true;
            }
            suma += (borrar ? 0 : cantidad);
        });
        if (currentIndex == -1) {
            suma += c.cantidaddiferencia || 0;
            if (suma > this.cantidadmaxima) {
                c.cantidaddiferencia = c.cantidaddiferencia - (suma - this.cantidadmaxima);
            }
            this.arrayCalidad[this.arrayCalidad.length] = c;
        } else {
            if (borrar) {
                this.arrayCalidad.remove(c);
            } else {
                if (suma > this.cantidadmaxima) {
                    c.cantidaddiferencia = c.cantidaddiferencia - (suma - this.cantidadmaxima);
                }
                this.arrayCalidad[currentIndex] = c;
            }
        }
        this.calidad = this.arrayCalidad;
        this.habilitarBotones((!c.idcalidad || c.cantidaddiferencia == 0 || error) ? true : !this.isValid());
        return c.cantidaddiferencia;
    },
    /**
     * Devuelve la posición del objeto en el arreglo en caso de existir, de lo contrario -1.
     * @param {Object} obj
     * @param {function} _fn
     * @returns {Integer}
     */
    getIndex: function(obj, _fn) {
        var currentIndex = -1;
        Ext.each(this.arrayCalidad, function(_c, index) {
            if (typeof _fn == 'function') {
                _fn.createDelegate(_c, [_c.cantidaddiferencia]).call();
            }
            if (_c.idcalidad == obj.idcalidad) {
                currentIndex = index;
            }
        });
        return currentIndex;
    },
    resetearLista: function() {
        this.arrayCalidad = new Array();
        this.calidad = this.arrayCalidad;
        this.habilitarBotones(!this.isValid());
    },
    isValid: function() {
        return (this.basicForm.isValid() && this.basicForm.isDirty()) || (this.basicForm.isValid() && this.arrayCalidad.length > 0);
    }
});