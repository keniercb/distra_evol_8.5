Ext.ns('LOG.inv.entrada.aprobarDocumento');
LOG.inv.entrada.aprobarDocumento.View = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 1;
        this.busquedaBasica = true;
        this.urlBusquedaGridPrincipal = 'cargarProductosDocumento';
        LOG.util.UIManager.apply(config.idioma, LOG.lb.documento.Idioma);
        LOG.inv.entrada.aprobarDocumento.View.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = config.idioma.tlVentanaAprobar;
        this.getVistaPrincipal().width = 550;
        this.getVistaPrincipal().height = 350;
        this.getVistaPrincipal().resizable = false;
    },
    init: function() {
        LOG.inv.entrada.aprobarDocumento.View.superclass.init.call(this);
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAprobar({}));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'cancelar',
            text: this.idioma.lbBtnNoAprobar
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttBtnImprimir,
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirListado
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo
                })
            ]
        }));

        this.getVistaPrincipal().listaBotones.getItem(1).hidden = true;
        this.getVistaPrincipal().listaBotones.getItem(2).hidden = true;
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.gcCodigo,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcDenominacion,
            width: 250,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcUM,
            width: 80,
            dataIndex: 'um',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.gcExistencia,
            width: 80,
            dataIndex: 'existencia',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.gcDisponible,
            width: 80,
            dataIndex: 'disponible',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.gcCantidad,
            width: 80,
            dataIndex: 'cantidad',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: this.idioma.gcPrecio,
            width: 100,
            dataIndex: 'precio',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.gcImporte,
            width: 100,
            dataIndex: 'importe',
            default: true
        }));
        this.addGridColumn({
            dataIndex: 'controlfirma',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idnodo',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'iddoc',
            default: true
        });
    }
});