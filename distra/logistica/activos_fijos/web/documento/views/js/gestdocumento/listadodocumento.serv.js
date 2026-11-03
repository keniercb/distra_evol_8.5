Ext.ns('Ext.aft');

Ext.aft.WinListadoDocumentos = Ext.extend(Ext.Window, {
    height: 400,
    width: 800,
    modal:true,
    closeAction: 'close',
    resizable: true,
    /*
     * estado en que estan los documentos que se quiere mostrar
     */
    idestadoPorDefecto:null,
    /**
     *  Arreglo que contiene los ids de las columnas ocultas en el componente
     */
    columnasOcultar: [],
    /**
     *  Arreglo que contiene los ids de los componentes de interfaz ocultos sssss
     */
    cmpOcultar: [],
    /*
     * Arreglo de operaciones por las cuales quiere que filtre el componente 
     */
    operaciones: [],
    /*
     * Variable para saber de donde se esta llamando el cmp, y segun este se contruye el filtro para los documentos
     */
    regOperativo: false,
    /*
     * identificador del area donde se esta trabajando
     */
    idarearesp: null,
    /*
     * identificador del padre del arear donde se esta trabajando
     */
    idestructurapadre: null,
    /*
     * tipo de area seleccionada, "Entidad, Area de responsabilidad, Otra"
     */
    tipo_area_seleccionada: 'entidad',
    /*
     * Parametros por defecto para filtrar en el store del grid.
     */
    validar_usuario:false,
    /*
     * parametro para que el store cargue solo
     * los documentos que son el usuario autenticado
     * que pertenecen al usuario auntenticado
     */
    filtros: {},
    constructor: function(config) {
        var _this = this;
        _this.idioma = LOG.aft.documento.Idioma;
        this.layout = 'border';
        this.title = _this.idioma.lbListadoDocumentos;
        Ext.apply(this, config);
        this.initGrid();
        this.buttons = [
            {
                iconCls: 'cancelar',
                text: _this.idioma.lbBtnCancelar,
                tooltip: _this.idioma.lbTtBtnCancelar,
                handler: function() {
                    _this.close();
                }
            },
            {
                iconCls: 'aceptar',
                text: _this.idioma.lbBtnAceptar,
                tooltip: _this.idioma.lbTtBtnAceptar,
                handler: function() {
                    if (_this.grid.getSelectionModel().hasSelection()) {
                        _this.doAction(_this.grid.getSelectionModel().getSelected().data.iddocumento);
                        _this.close();
                    } else {
                        mostrarMensaje(1, "Debe seleccionar un documento.");
                    }
                }
            }
        ];
        //this.show();
        Ext.aft.WinListadoDocumentos.superclass.constructor.call(this, arguments);
    },
    initGrid: function() {

        var _this = this;
        this.grid = new Ext.aft.getGridDocumentoServs({
            idioma: _this.idioma,
            operaciones: _this.operaciones,
            denomarearesp: _this.denomarearesp,
            idarearesp: _this.idarearesp,
            cargarArbolCompleto: _this.cargarArbolCompleto,
            identidad: _this.identidad,
            entidad: _this.entidad,
            validar_usuario:_this.validar_usuario,
            idestructurapadre: _this.idestructurapadre,
            tipo_area_seleccionada: _this.tipo_area_seleccionada,
            columnasOcultar: _this.columnasOcultar,
            idestadoPorDefecto:_this.idestadoPorDefecto,
            filtros: _this.filtros,
            listeners: {
                'render': function() {
                    _this.configurarGrid();
                }
            }
        });
        this.items = [_this.grid];
    },
    configurarGrid: function() {
        var _this = this;
        if (_this.cmpOcultar.length > 0) {
            for (var i = 0; i < _this.cmpOcultar.length; i++) {
                Ext.getCmp(_this.cmpOcultar[i]).hide();
            }
        }

    },
    getGrid: function() {
        return this.grid;
    }
});