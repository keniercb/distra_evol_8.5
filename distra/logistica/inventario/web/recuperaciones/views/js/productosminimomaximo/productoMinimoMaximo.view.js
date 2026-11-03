Ext.ns('Ext.erp.productominimomaximo');
Ext.erp.productominimomaximo = Ext.extend(LOG.util.UITemplate, {

    constructor: function(config) {
        var _this = this;
        config.dirController = '/logistica/inventario/recuperaciones/index.php/productominimomaximo';
        config.urlBusquedaGridPrincipal = 'getProductoMinORMax';
        config.busquedaBasica = true;
        config.modoSeleccion = 1;
        config.autoLoad = false;
        config.formaVisualizacion = 'panel';
        config.idioma = {};
        config.autoShow = true;
        Ext.erp.productominimomaximo.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, LOG.inv.productominimomaximo.Idioma);
        _this.concepto = this.idioma.productos;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimple;

    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 80,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 200,
            dataIndex: 'denomproducto',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 90,
            dataIndex: 'abreviaturaunidadmedida',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgExistencia,
            width: 120,
            align: 'right',
            dataIndex: 'cantidad',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgDiferencia,
            width: 120,
            align: 'right',
            dataIndex: 'diferencia',
            default: true,
            renderer:function(val){
                if(val < 0){
                    return '<span style="color:red;">' + val + '</span>';
                }
                return val;
            }
        }));
    },
    render: function(){
       var _this = this;
       var p = Ext.erp.productominimomaximo.superclass.render.call(this)
           this.gridFilter.btnLimpiar.on({
               'click':function(){
                   _this.comboDepositos.reset();
                   for(var i=0; i < _this.comboDepositos.store.data.items.length; i++) {
                       _this.comboDepositos.store.data.items[i].set('checked',false);
                   }

                   for (var i = 0; i < _this.comboDepositos.store.data.items.length; i++) {
                       _this.entidades.push(_this.comboDepositos.store.data.items[i].id);
                   }
                   var ents = '{' + _this.entidades.join() + '}';
                   _this.storePrincipal.on('beforeload', function (store) {
                       store.initBaseParams = {
                           idestructura: ents,
                           start: 0,
                           limit: null,
                           valor: 1
                       };
                   });

                   _this.getStorePrincipal().reload();
               }
           });
        return p;
    }
});