Ext.ns('LOG.lb.numeroserie');

/**
 * Componente para la gestión de lotes.
 */
LOG.lb.numeroserie.Model = Ext.extend(LOG.util.Model, {
    /**
     * Determina si se guarda los datos de la lista de numeros de serie.
     * @type Boolean
     */
    guargarLista: false,
    /**
     * Lista de numeros de serie editados.
     * @type LOG.util.List()
     */
    listaNroserie: null,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.listaNroserie = new LOG.util.List();
        config.urlController = '/logistica/utiles/producto/index.php/numeroserie/';
        config.urlAccionGuardar = 'adicionarNumeroserie';
        config.urlAccionEliminar = 'eliminarNumeroserie';
        config.fields = [
            {
                name: 'idmovnumeroserie',
                primary: true
            },
            {name: 'idnroserie'},
            {name: 'idproducto'},
            {name: 'idmovimiento'},
            {name: 'nroserie'},
            {name: 'annofabricacion'},
            {name: 'idestructuraubicacion'},
            {name: 'numero'},
            {name: 'annoconservacion'},
            {name: 'idconservacion'},
            {name: 'idmarca'},
            {name: 'idmodelo'},
            {name: 'nropieza'},
            {name: 'cantidad'}
        ];
        LOG.lb.numeroserie.Model.superclass.constructor.call(this, config);
    },
    /**
     * Funcion para adicionar un numero de serie al grid cuando este fue editado
     * @param {Object} n
     * @returns {undefined}
     */
    adicionarProducto: function(n) {
        var currentIndex = -1;
        this.listaNroserie.each(function(_n, index) {
            if (_n.idmovnumeroserie == n.idmovnumeroserie) {
                currentIndex = index;
            }
        });
        var nModel = null;
        if (currentIndex == -1) {
            nModel = new LOG.util.Model({
                fields: [{
                        name: 'idmovnumeroserie',
                        primary: true
                    },
                    {name: 'idnroserie'},
                    {name: 'idproducto'},
                    {name: 'idmovimiento'},
                    {name: 'nroserie'},
                    {name: 'idestructuraubicacion'},
                    {name: 'annofabricacion'},
                    {name: 'numero'},
                    {name: 'annoconservacion'},
                    {name: 'idconservacion'},
                    {name: 'idmarca'},
                    {name: 'idmodelo'},
                    {name: 'nropieza'}
                ]
            });
        } else {
            nModel = this.listaNroserie.getItem(currentIndex);
        }
        nModel.apply(n);
        this.listaNroserie.setItem(nModel, currentIndex);
        this.habilitarBotones(!this.isValid());
    },
    /**
     * 
     * @param {Object} parametros
     * @param {function} _fn
     * @param {function} _fnFail
     * @returns {undefined}
     */
    salvar: function(parametros, _fn, _fnFail, msgMostrar) {
        this.guargarLista = parametros.lista || false;
        LOG.lb.numeroserie.Model.superclass.salvar.call(this, parametros, _fn, _fnFail, msgMostrar);
    },
    /**
     * 
     * @param {type} o
     * @returns {Array.encode._o}
     */
    encode: function(o) {
        var obj = {};
        if (this.guargarLista) {
            obj.series = new Array();
            this.listaNroserie.each(function(_n) {
                obj.series.push(_n.encode());
            });
        } else {
            obj = LOG.lb.numeroserie.Model.superclass.encode.call(this, o);
        }
        return obj;
    },
    /**
     * Resetea la lista de numeros de serie.
     * @returns {undefined}
     */
    resetList: function() {
        this.listaNroserie.deleteAll();
        this.guargarLista = false;
    },
    /**
     * Verifica si los datos a guardar son correctos.
     * @returns {Boolean}
     */
    isValid: function() {
        if (this.guargarLista) {
            return this.isValidList();
        }
        if (this.basicForm) {
            return LOG.lb.numeroserie.Model.superclass.isValid.call(this);
        }
        return true;
    },
    /**
     * Verifica si la lista de numeros de serie tiene datos.
     * @returns {Boolean}
     */
    isValidList: function() {
        return this.listaNroserie.count() > 0;
    },
    /**
     * Establece los valores actuales de los campos del formulario como valores por defecto.
     * @returns {undefined}
     */
    setDefaulFormValues: function() {
        if (this.guargarLista) {
            return;
        }
        LOG.lb.numeroserie.Model.superclass.setDefaulFormValues.call(this);
    }
});