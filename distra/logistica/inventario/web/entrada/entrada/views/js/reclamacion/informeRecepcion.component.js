Ext.ns('LOG.inv.entrada.informeRecepcion');
LOG.inv.entrada.informeRecepcion.View = Ext.extend(LOG.util.UITemplate, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.concepto = config.idioma.ttBtnBuscarInf;
        this.autoLoad = false;
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 1;
        this.busquedaBasica = true;
        this.dirController = '/logistica/inventario/entrada/entrada/index.php/reclamacion';
        this.urlBusquedaGridPrincipal = 'cargarDocRecepcion';
        LOG.inv.entrada.informeRecepcion.View.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = config.idioma.tlVentanaInfRecepcion;
        this.getVistaPrincipal().width = 550;
        this.getVistaPrincipal().height = 350;
        this.getVistaPrincipal().resizable = false;
    },
    /**
     * Inicializa y configura los botones de la interfaz.
     * @returns {undefined}
     */
    initDefaultButtons: function() {
        var _this = this;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        this.getVistaPrincipal().aceptarFn = function() {
            _this.aceptarFn.createDelegate(_this, [_this.getSmPrincipal().getSelected().json]).call();
        };
    },
    /**
     * Inicializa las columnas del grid.
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        this.addGridColumn({dataIndex: 'iddocumento'});
        this.addGridColumn({
            header: this.idioma.cgNroDoc,
            width: 150,
            dataIndex: 'nrodoc',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgEstdoDoc,
            width: 150,
            dataIndex: 'estado',
            default: true,
            renderer: function(v, _mD, _r) {
                _r.json.idoperacionrec = _r.json.idoperacion;
                return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            header: this.idioma.cgFechaCreado,
            width: 150,
            dataIndex: 'fechacontable',
            default: true
        });
    },
    /**
     * Configura los eventos y renderiza la vista.
     * @returns {vistaPricipal}
     */
    render: function() {
        var _this = this;
        var render = LOG.inv.entrada.informeRecepcion.View.superclass.render.call(this);
        LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function(e) {
            if (e == 'beforeload') {
                _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                this.initBaseParams.idestructura = this.baseParams.idestructura = _this.idestructura;
                this.initBaseParams.estado = this.baseParams.estado = 4;
            }
        }, '_st');
        LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function(e) {
            if (e == 'selectionchange') {
                _this.getVistaPrincipal().listaBotones.getItem(2).setDisabled(this.getCount() != 1);
            }
        }, 'seleccion');
        this.getStorePrincipal().load();
        return render;
    }
});