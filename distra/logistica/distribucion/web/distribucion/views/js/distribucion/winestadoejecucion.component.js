Ext.ns('LOG.dist.distribucion');

LOG.dist.distribucion.winEstadoEjecucion = Ext.extend(LOG.util.UITemplate, {
    record: undefined,
    constructor: function(config) {
        config.idioma = LOG.util.UIManager.apply(LOG.dist.distribucion.Idioma, LOG.util.Idioma);
        this.busquedaBasica = true;
        this.dirController = '/logistica/distribucion/distribucion/index.php/distribucion';
        this.urlBusquedaGridPrincipal = 'cargarDocumentosGenerados';
        this.textBusquedaSimple = config.idioma.lbCampoBusquedaEstadoEjecucion;
        this.autoLoad = false;
        this.concepto = config.idioma.lbCampoBusquedaEstadoEjecucion;
        this.modoSeleccion = 1;
        this.autoSelect = false;
        this.formaVisualizacion = 'ventana';
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma);
        this.record = config.record;
        LOG.dist.distribucion.winEstadoEjecucion.superclass.constructor.call(this, config);
        this.setTitulo();
        if (!config.pedido) {
            this.modelo = new LOG.dist.distribucion.Model({
                idioma: config.idioma
            });
        }
    },
    init: function() {
        var _this = this;
        LOG.dist.distribucion.winEstadoEjecucion.superclass.init.call(this);

        LOG.util.UIManager.apply(_this.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({
            text: 'Cerrar'
        }, true));
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
        this.getVistaPrincipal().maximized = true;
        this.getVistaPrincipal().resizable = false;
    },
    render: function() {
        var _this = this;
        var render = LOG.dist.distribucion.winEstadoEjecucion.superclass.render.call(this);

        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            iddocumento: (_this.datos.iddocumento) ? _this.datos.iddocumento : -1
        });

        this.getStorePrincipal().load();
        return render;
    },
    initDefaultColumns: function() {
        var _this = this;

        this.addGridColumn({
            header: _this.idioma.cgEntregarA,
            dataIndex: 'cliente',
            default: true,
            autoExpand: true,
            agrupador: true
        });

        this.addGridColumn({
            header: _this.idioma.cgTipoDocumento,
            width: 180,
            dataIndex: 'tipodocumento',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgNumeroDocumento,
            width: 100,
            dataIndex: 'nrodoc',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgNroRef,
            width: 100,
            dataIndex: 'numeroref',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgEstado,
            width: 100,
            dataIndex: 'estado',
            default: true,
            renderer: function(v) {
                return LOG.lb.documento.Estado[v];
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgFechaEmision,
            width: 100,
            dataIndex: 'fechacontable',
            default: true
        });

        this.addGridColumn({dataIndex: 'idcliente'});

        this.addGridColumn({dataIndex: 'iddocumentocliente'});

        this.addGridColumn({dataIndex: 'iddocumento'});

        this.addGridColumn({dataIndex: 'iddoc'});
    },
    setTitulo: function () {
        var _this = this;
        this.getVistaPrincipal().setTitle(String.format(this.idioma.tlVentanaEstadoEjecucion, this.record.data.nrodoc, this.record.data.fechacontable, LOG.lb.documento.Estado[this.record.data.estado]));
    }
});