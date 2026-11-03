/**
 * @class aprobarSolicitudentrega
 * (Descripcion de la clase, objetivo)
 * 
 * @package Inventario
 * @subpackage Salida
 * @author Osmel A. Larduet Hechavarría
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('LOG.inv.salida.aprobarSolicitudentrega');
LOG.inv.salida.aprobarSolicitudentrega.View = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        config.formaVisualizacion = 'ventana';
        config.modoSleccion = 1;
        config.busquedaBasica = true;
        config.urlBusquedaGridPrincipal = 'cargarProductosDocumento';
        LOG.util.UIManager.apply(config.idioma, LOG.lb.documento.Idioma);
        LOG.inv.salida.aprobarSolicitudentrega.View.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = config.idioma.tlVentanaAprobar1;
        this.getVistaPrincipal().width = 750;
        this.getVistaPrincipal().height = 350;
        this.getVistaPrincipal().resizable = false;
    },
    init: function() {
        LOG.inv.salida.aprobarSolicitudentrega.View.superclass.init.call(this);
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAprobar({
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'cancelar',
            text: this.idioma.lbBtnNoAprobar
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttBtnImprimir,
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirListado,
                    handler: function() {
                        this.imprimirListadoDocumento()
                    }
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    handler: function() {
                        this.imprimirModeloDocumento()
                    }
                })
            ]
        }));
        this.getVistaPrincipal().listaBotones.getItem(0).text = this.idioma.lbBtnCerrar;
        this.getVistaPrincipal().listaBotones.getItem(1).hidden = true;
        this.getVistaPrincipal().listaBotones.getItem(2).hidden = true;
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 80,
            dataIndex: 'um',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgExistencia,
            width: 80,
            dataIndex: 'existencia',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDisponible,
            width: 80,
            dataIndex: 'disponible',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCantidad,
            width: 80,
            dataIndex: 'cantidad',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPrecio,
            width: 100,
            dataIndex: 'precio',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgImporte,
            width: 100,
            dataIndex: 'importe',
            default: true
        });
    }
});

