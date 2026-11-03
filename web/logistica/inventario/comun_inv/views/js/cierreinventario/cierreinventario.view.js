Ext.ns('log.lb.cierreinventario');

log.lb.cierreinventario.View = Ext.extend(Log.lb.cierre.View, {
    usuarios: undefined,
    documentos: undefined,
    periodo: undefined,
    fechaContable: undefined,
    constructor: function (config) {
        
        config.idioma ={};
        LOG.util.UIManager.apply(config.idioma, Log.lb.cierre.Idioma);

        this.dirController = '/logistica/inventario/comun_inv/index.php/gestcierreinventario';
        this.urlBusquedaGridPrincipal = 'cargarDocumentosPendiente';
        this.modoSeleccion = 1;
        this.idayuda = 'idCierreInv';
        this.autoShow = false;
        this.busquedaBasica = true;
        log.lb.cierreinventario.View.superclass.constructor.call(this, config);
    },

    initDefaultColumns: function () {
        log.lb.cierreinventario.View.superclass.initDefaultColumns.call(this);
        var _this = this;
        this.insertGridColumn({
            header: this.idioma.cgProductos,
            width: 90,
            dataIndex: 'cantproductos',
            default: true
        },3);
        
        this.addGridColumn({
            header: this.idioma.lbDepositos,
            width: 100,
            dataIndex: 'deposito',
            default: true
        });
    },

    initDefaultButtons : function (){
        log.lb.cierreinventario.View.superclass.initDefaultButtons.call(this);
        var  _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
            text: 'Configurar dep\xf3sitos',
            iconCls: 'configuracion',
            tooltip: 'Configurar dep\xf3sitos',
            handler: function () {
                Ext.getBody().mask('Configurando fecha de los dep\xf3sitos.');
                Ext.Ajax.request({
                    url: 'configurarAlmacenes',
                    method: 'POST',
                    callback: function (opt, scs, resp) {
                        Ext.getBody().unmask();
                    }
                });
            },
            controlFn: function (b, _caller) {
                b.setVisible(false);
                b.disable();
                if(_caller.grantedAction('Rconfigurardeposito')){
                    b.setVisible(true);
                    b.enable();
                }
            }
        }));

    }

    
});