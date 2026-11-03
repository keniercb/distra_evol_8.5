Ext.ns('LOG.lb.nomdinamicos');
LOG.lb.nomdinamicos.Model = Ext.extend(LOG.util.Model , {
    constructor: function(config) {
        config.urlAccionGuardar = 'adicionarNomDinamico';
        config.urlAccionEliminar = 'eliminarNomDinamicos';
        config.urlController = '/logistica/utiles/nomdinamicos/index.php/nomdinamicos/';
        config.fields = [{
                name: 'idtiponomenclador',
                primary: true
            },
            {name: 'denominacion'},
            {name: 'propiedades'},
            {name: 'activo'}
        ];
        LOG.lb.nomdinamicos.Model.superclass.constructor.call(this,config);
    }
});





LOG.lb.nomdinamicos.ModelDatos = Ext.extend(LOG.util.Model , {
    /**
     * Lista de nomencladores.
     * @type type
     */
    listaNomencladores: undefined,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.listaNomencladores = new LOG.util.List();
        config.urlAccionGuardar = 'adicionarDatoNom';
        config.urlAccionEliminar = 'eliminarDatoNom';
        config.urlController = '/logistica/utiles/nomdinamicos/index.php/nomdinamicos/';
        config.fields = [{
                name: 'idnomenclador',
                primary: true
            }
        ];
        LOG.lb.nomdinamicos.ModelDatos.superclass.constructor.call(this,config);
    },
    /**
     * Funcion para adicionar un nomenclador al grid cuando este fue editado.
     * @param {Object} n
     * @returns {undefined}
     */
    adicionarNomenclador: function(n) {
        var currentIndex = -1;
        this.listaNomencladores.each(function(_n, index) {
            if ((n.idnomenclador && _n.idnomenclador == n.idnomenclador) || _n.idtemp == n.idtemp) {
                currentIndex = index;
            }
        });
        var pModel = null;
        if (currentIndex == -1) {
            var pModel = new LOG.util.Model({
                fields: [{
                        name: 'idnomenclador',
                        primary: true
                    },
                    {name: 'idtiponomenclador'},
                    {name: 'denominacion'},
                    {name: 'referencia'},
                    {name: 'fechaini'},
                    {name: 'fechafin'},
                    {name: 'idtemp'}
                ]
            });
        } else {
            pModel = this.listaNomencladores.getItem(currentIndex);
        }

        pModel.apply(n);
        this.listaNomencladores.setItem(pModel, currentIndex);
        this.habilitarBotones();
    },
    /**
     *
     * @param {Object} o
     * @returns {Object}
     */
    encode: function (o) {
        var objDoc = LOG.lb.nomdinamicos.ModelDatos.superclass.encode.call(this, o);
        objDoc.nomencladores = new Array();
        this.listaNomencladores.each(function(_n) {
            objDoc.nomencladores.push(_n.encode());
        });
        return objDoc;
    },
    reset: function () {
        LOG.lb.nomdinamicos.ModelDatos.superclass.reset.call(this);
        this.listaNomencladores.deleteAll();
    },
    /**
     * 
     * @returns {Boolean}
     */
    isValid: function() {
        return this.listaNomencladores.count() > 0;
    },
    /**
     * 
     * @returns {undefined}
     */
    setDefaulFormValues: function () {
        this.listaNomencladores.deleteAll();
    }
});
