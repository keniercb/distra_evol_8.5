/**
 Esta clase muestra la ubicacion de un producto por areas existentes
 * @copyright XETID
 * @author División Gestión de Entidades
 * @version 1.0
 */
Ext.ns('LOG.inv.submayor');

LOG.inv.submayor.ubicacionarea = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    idGridPrincipal: 'idubicacionproducto',
    parametros: undefined,
    constructor: function (config) {
        config.idioma = LOG.util.UIManager.apply(LOG.inv.submayor.Idioma, LOG.util.Idioma);
        this.modoSeleccion = 1;
        this.busquedaBasica = true;
        this.panelBotonesVisible = false;
        this.busquedaAvanzada = true;
        this.autoShow = false;
        this.widthAvanzada = '32%';
        this.urlBusquedaGridPrincipal = 'datosGridUbicacionPorArea';
        this.concepto = config.idioma.ubicaciones;
        LOG.inv.submayor.ubicacionarea.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({dataIndex: 'idubicacionproducto'});
        
        this.addGridColumn({
            header: _this.idioma.cgUbicacion,
            width: 200,
            dataIndex: 'area',
            default: true,
            autoExpand: true
        });
        this.addGridColumn({
            header: _this.idioma.cgNaturaleza,
            width: 125,
            dataIndex: 'denominacionnat',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgExistencia,
            width: 110,
            align: 'right',
            dataIndex: 'cantidad',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgDisponibilidad,
            width: 110,
            align: 'right',
            dataIndex: 'disponible',
            default: true
        }));
    },
    init: function () {
        var _this = this;
        LOG.inv.submayor.ubicacionarea.superclass.init.call(this);
        LOG.util.UIManager.apply(this.getVistaPrincipal(), {
            onShow: function () {
                LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, _this.parametros);
                _this.onShowHandler();
            },
            aceptarFn: function () {
                if (typeof _this.doAction == 'function') {
                    if (!_this.getGridPrincipal().getSelectionModel().hasSelection()) {
                        return;
                    }
                    _this.doAction.createDelegate(_this, [_this.getGridPrincipal().getSelectionModel().getSelections()]).call();
                }
            }
        });

    },
    render: function () {
        var _this = this;
        var _res = LOG.inv.submayor.ubicacionarea.superclass.render.call(this);
        if (this.iddeposito && this.idproducto) {
            this.getStorePrincipal().load();
        }
        return _res;
    },
    habilitarBotones: function () {
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        if (this.getGridPrincipal().getSelectionModel().hasSelection()) {
            this.getVistaPrincipal().listaBotones.getItem(2).enable();
        }
    },
    onShowHandler: function () {
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, this.parametros);
        this.getStorePrincipal().reload();
    }
});


