Ext.ns('LOG.lb.lote');
/**
 * Ventana adicionar lote.
 * @type LOG.util.UITemplate
 */
LOG.lb.lote.adicionarLote = Ext.extend(LOG.util.UITemplate, {
    dirController: '/logistica/utiles/lote/index.php/lote',
    urlBusquedaGridPrincipal: 'cargarUbicacionesLote',
    /**
     * Funci�n que se ejecuta luego de la acci�n guardar.
     */
    _postSalvarFn: Ext.emptyFn,
    /**
     * Identificador del grid pricipal de lote.
     */
    idGridPrincipal: 'idlote',
    /**
     * Objeto con los parámetros adicionales para realizar la búsqueda.
     */
    parametros: {},
    /**
     * Objeto con los parámetros adicionales para guardar.
     */
    datos: {},
    /**
     * Determina si se afecta la cantidad disponible del lote.
     */
    afectaLote: false,
    /**
     * Determina si se actualiza el movimiento.
     */
    actualizarMov: true,
    /**
     * Determina si se afecta la cantidad disponible del producto.
     */
    afectaProducto: false,
    /**
     * Determina si usa la dualidad monetaria.
     */
    usaMonedas: false,
    /**
     * Tipo de operación (compra o venta) para la canversión de entre monedas
     * (0 - no toma en cuenta la operación, 1 - para la venta y 2 - para la compra).
     */
    compraVenta: 0,
    stMovimiento : null,
    smMovimiento : null,
    /**
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.idioma = LOG.util.UIManager.apply(LOG.lb.lote.Idioma, LOG.util.Idioma);
        this.formaVisualizacion = 'ventana';
        this.concepto = config.idioma.ttBtnBuscarLote;
        this.busquedaBasica = true;
        this.textBusquedaSimple = config.idioma.lbBuscar;
        this.autoLoad = false;
        this.autoSelect = false;
        var url = config.dirController ? config.dirController + '/' : null;
        this.modelo = new LOG.lb.lote.Model({
            idioma: config.idioma,
            urlController: url
        });
        LOG.lb.lote.adicionarLote.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = config.idioma.tlAdicionarLote;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().setSize(700, 400);
    },
    /**
     * Inicializa los botones de la ventana.
     * @returns {undefined}
     */
    initDefaultButtons: function() {
        var _this = this;
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(0), {
            text: _this.idioma.lbBtnCerrar,
            key: {
                key: 'X',
                ctrl: true,
                alt: true
            }
        });
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        LOG.util.UIManager.apply(this.getVistaPrincipal(), {
            aceptarFn: function() {
                Ext.apply(_this.datos, {
                    idmovimiento: _this.idmovimiento,
                    iddocumento: _this.iddocumento,
                    signo: _this.signo,
                    afectaLote: _this.afectaLote || null,
                    actualizarMov: _this.actualizarMov || null,
                    afectaProducto: _this.afectaProducto || null,
                    usaMonedas: _this.usaMonedas || null,
                    compraVenta: _this.compraVenta,
                    collection: true
                });
                _this.modelo.salvarMovimiento({
                    editable: _this.gridEditable,
                    datos: _this.datos
                }, _this._postSalvarFn);
            }
        });
    },
    /**
     * Inicializa las columnas del grid.
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        this.addGridColumn({dataIndex: 'idlote'});
        this.addGridColumn({dataIndex: 'idproducto'});
        this.addGridColumn({dataIndex: 'idubicacion'});
        this.addGridColumn({
            header: this.idioma.cgNroLote,
            width: 80,
            dataIndex: 'numero',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUbicacion,
            hidden: true,
            dataIndex: 'descripcion',
            agrupador: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaFabricacion,
            width: 100,
            dataIndex: 'fechafabricacion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaVencimiento,
            width: 100,
            dataIndex: 'fechavencimiento',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgExistencia,      
            width: 80,
            dataIndex: 'existencia',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgDisponible,
            width: 80,
            dataIndex: 'disponible',
            align: 'right',
            default: true
        }));
    },
    /**
     * Renderiza los componente y reprograma los eventos.
     * @returns {Vista principal}
     */
    render: function() {
        var render = LOG.lb.lote.adicionarLote.superclass.render.call(this);
        var _this = this;
        this.getStorePrincipal().on({
            beforeload: function() {
                _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                this.initBaseParams.idproducto = _this.idproducto;
                this.initBaseParams.idmovimiento = _this.idmovimiento;
                this.initBaseParams.ubicaciones = _this.ubicaciones ? _this.ubicaciones : null;
                Ext.apply(this.initBaseParams, _this.parametros);
                this.commitChanges();
            }
        });
        this.getSmPrincipal().on({
            selectionchange: function() {
                if (this.getCount() > 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                } else {
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        });
        this.getStorePrincipal().load();
        return render;
    }
});
