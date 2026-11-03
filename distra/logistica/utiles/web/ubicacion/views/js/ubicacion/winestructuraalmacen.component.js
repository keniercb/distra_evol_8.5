Ext.ns('LOG.lb.ubicacion');

/**
 * 
 * @type LOG.util.Window
 */
LOG.lb.ubicacion.winEstructuraAlmacen = Ext.extend(LOG.util.Window, {
    maximized: true,
    usarAceptar: false,
    usarAplicar: false,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        LOG.lb.ubicacion.winEstructuraAlmacen.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa los componentes de la ventana.
     * @returns {undefined}
     */
    initComponent: function() {
        this.panelProductos = new LOG.lb.ubicacion.panelProductos({idioma: this.idioma});
        this.panelProductos.init();
        this.panelInferior = LOG.util.UIManager.initPanel({
            region: 'south',
            layout: 'fit',
            title: this.idioma.tlProductosUbicados,
            titleCollapse: true,
            collapsible: true,
            collapseMode: 'mini',
            animCollapse: false,
            collapsed: true,
            animate: true,
            split: true,
            hidden: true,
            height: 200,
            minHeight: 150,
            items: [this.panelProductos.view()]
        });

        this.panelSuperior = LOG.util.UIManager.initPanel({
            region: 'north',
            layout: 'fit',
            tbar: [
                new Ext.form.Label({
                    html: String.format('<b>{0}:</b> -', this.idioma.lbNombreUbicacion),
                    id: 'idnombre',
                    scope: this,
                    setValue: function(v) {
                        delete this['html'];
                        if (this.rendered) {
                            this.el.dom.innerHTML = String.format('<b>{0}:</b> {1}', this.scope.idioma.lbNombreUbicacion, v);
                        }
                        return this;
                    }
                })/*, '-',new Ext.form.Label({
                    html: String.format('<b>{0}:</b> -', this.idioma.lbEstadoUbicacion),
                    id: 'idestado',
                    scope: this,
                    setValue: function(v) {
                        delete this['html'];
                        if (this.rendered) {
                            this.el.dom.innerHTML = String.format('<b>{0}:</b> {1}', this.scope.idioma.lbEstadoUbicacion, v);
                        }
                        return this;
                    }
                })*/
            ]
        });
        
        this.organigrama = new Ext.LOG.Organigrama({
            moduloRaiz: {
                idestructuraubicacion: this.iddeposito,
                denomestructuraubicacion: this.nomDeposito
            },
            region: 'center',
            modelo: this.modelo,
            st: this.panelProductos.getStorePrincipal(),
            panel: this.panelInferior
        });
        
        this.items = [this.organigrama, this.panelSuperior, this.panelInferior];
        LOG.lb.ubicacion.winEstructuraAlmacen.superclass.initComponent.call(this);
        Ext.apply(this.listaBotones.getItem(0), {
            text: this.idioma.lbBtnCerrar
        });
    }
});


/**
 * Plantilla tipo panel para mostrar los productos del area o la ubicacion.
 * @type LOG.util.UITemplate
 */
LOG.lb.ubicacion.panelProductos = Ext.extend(LOG.util.UITemplate, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.formaVisualizacion = 'panel';
        config.idGridPrincipal = 'idproducto';
        config.autoSelect = false;
        config.modoSeleccion = 1;
        config.autoLoad = false;
        config.urlBusquedaGridPrincipal = 'cargarProductosUbicacion';
        config.busquedaBasica = true;
        LOG.lb.ubicacion.panelProductos.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa las columnas del panel.
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.cgCodigoDenom,
            autoExpand: true,
            dataIndex: 'text',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCategoria,
            width: 100,
            dataIndex: 'nomcategoria',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 60,
            dataIndex: 'umedida',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantidadUbicada,
            width: 120,
            dataIndex: 'existencia_area',
            align: 'right',
            default: true
        }));
        this.addGridColumn({
            header: this.idioma.cgAlmacenamiento,
            width: 100,
            dataIndex: 'especial',
            default: true,
            renderer: function(_v, _mD, _r) {
                if (_r.get('municion') == 1) {
                    _mD.css = 'icondistra-partida';
                    _mD.attr = 'ext:qtip="' + _this.idioma.ttClmMunicion + '"';
                } else if (_r.get('equipo') == 1) {
                    _mD.css = 'icondistra-numeroserie';
                    _mD.attr = 'ext:qtip="' + _this.idioma.ttClmNorSerie + '"';
                } else if (_r.get('tienelote') == 1) {
                    _mD.css = 'icondistra-lote';
                    _mD.attr = 'ext:qtip="' + _this.idioma.ttClmLote + '"';
                } else {
                    _mD.css = 'icondistra-producto';
                    _mD.attr = 'ext:qtip="' + _this.idioma.ttClmProducto + '"';
                }
            }
        });
        this.addGridColumn({dataIndex: 'municion'});
        this.addGridColumn({dataIndex: 'equipo'});
        this.addGridColumn({dataIndex: 'tienelote'});
    }
});