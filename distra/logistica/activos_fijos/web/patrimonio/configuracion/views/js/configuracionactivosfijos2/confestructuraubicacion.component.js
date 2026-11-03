/**
 * Created by yoendy on 1/12/2016.
 */
Ext.ns('Ext.erp');
Ext.ns('Ext.aft.Conf');

Ext.aft.Conf.EstructuraUbicacion = Ext.extend(Ext.erp.estructuraubicacion,{

    constructor: function (config) {
        this.title = config.idioma.titleTabEstructuraUbicacionPanel;
        Ext.apply(this, config);
        Ext.aft.Conf.EstructuraUbicacion.superclass.constructor.call(this, config);
        this.panelOeste.destroy();
        var _this = this;
        //_this.tbar = [];
        this.treeLoader.on('beforeload', function(loader, nodo, fnCallBack){
            loader.baseParams.idestructuraubic = nodo.attributes.idestructuraubic;
            _this.tpEstructuras.enable();
            loader.baseParams.tipo = '2';

            if (nodo.attributes.idformato) {
                var idformato = nodo.attributes.idformato;
                var record = _this.stFormato.getAt(_this.stFormato.find('idformato', idformato));
                loader.baseParams.nivel = record.data.ultimo_nivel;
            }
        });
        Ext.getCmp("configuracionubicacion").setVisible(false);
        _this.cmbOpcion.setVisible(false);

        this.on('activate', function(){
            _this.cmbOpcion.setValue('2');
            _this.cmbOpcion.disable();
            _this.cmbOpcion.fireEvent('select');
        });


    }
});