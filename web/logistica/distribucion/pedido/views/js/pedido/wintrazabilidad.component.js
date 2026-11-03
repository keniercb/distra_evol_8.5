Ext.ns('LOG.dist.pedido');

/**
 * 
 * @type LOG.util.Window
 */

LOG.dist.pedido.winTrazabilidad  = Ext.extend(LOG.util.Window, {
    maximized: true,
    usarAceptar: false,
    usarAplicar: false,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        LOG.dist.pedido.winTrazabilidad .superclass.constructor.call(this, config);
    },
    /**
     * Inicializa los componentes de la ventana.
     * @returns {undefined}
     */
    initComponent: function() {
        this.panelProductos = new LOG.dist.pedido.panelProductos({idioma: this.idioma});
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
                // new Ext.form.Label({
                //     html: String.format('<b>{0}:</b> -', 'No. del pedido'),
                //     id: 'idnombre',
                //     scope: this,
                //     setValue: function(v) {
                //         delete this['html'];
                //         if (this.rendered) {
                //             this.el.dom.innerHTML = String.format('<b>{0}:</b> {1}', 'No. del pedido', v);
                //         }
                //         return this;
                //     }
                // })
                /*, '-',new Ext.form.Label({
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
                idestructuraubicacion: this.iddocumento,
                denomestructuraubicacion: this.datos
            },
            region: 'center',
            modelo: this.modelo,
            st: this.panelProductos.getStorePrincipal(),
            panel: this.panelInferior
        });
        
        this.items = [this.organigrama, this.panelSuperior, this.panelInferior];
        LOG.dist.pedido.winTrazabilidad .superclass.initComponent.call(this);
        Ext.apply(this.listaBotones.getItem(0), {
            text: this.idioma.lbBtnCerrar
        });
    }
});


/**
 * Plantilla tipo panel para mostrar los productos del area o la ubicacion.
 * @type LOG.util.UITemplate
 */
LOG.dist.pedido.panelProductos = Ext.extend(LOG.util.UITemplate, {
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
        config.urlBusquedaGridPrincipal = 'cargarProductos';
        config.busquedaBasica = true;
        LOG.dist.pedido.panelProductos.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa las columnas del panel.
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            header: 'Código',
            dataIndex: 'codigo',
            width: 150,
            default: true
        });
        this.addGridColumn({
            header: 'Denominación',
            autoExpand: true,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 150,
            dataIndex: 'umedida',
            default: true
        });
        this.addGridColumn({
            header: 'Cantidad',
            width: 150,
            dataIndex: 'cantidad',
            default: true
        });
        this.addGridColumn({
            header: 'Precio',
            width: 150,
            dataIndex: 'precio',
            default: true
        });
    }
});