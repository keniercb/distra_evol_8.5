Ext.ns("Ext.components.GridResultadoBusqueda");
Ext.components.CmpReccomplejas.GridResultadoBusqueda = Ext.extend(Ext.grid.GridPanel, {
    margins: '5 5 5 5',
    region: 'center',
    loadMask: {
        msg: 'Cargando...'
    },
    initComponent: function() {
        var self = this;
        var flagFirst = false;
        this.cantElementsByPage = this.limite ? this.limite : 18;
        this.idioma = Ext.idioma.es.cmpreccomplejas.reccomplejas.etiquetas;
        this.idconfiguracion = -1;

        this.columns = [{
            dataIndex: 'aux',
            sortable: true,
            header: self.idioma.lbLoadColums,
            width:140
        }];
        this.store = new Ext.data.Store({
            url: '/reccomplejas/index.php/reccomplejas/getDatosBusqueda',
            reader : new Ext.data.JsonReader({
                root : 'datos',
                totalProperty : 'cantidad'
            }, [{
                name: 'aux'
            }])
        });
        this.bbar = new Ext.PagingToolbar({
            pageSize: self.cantElementsByPage,
            store: self.store,
            displayInfo: true,
            displayMsg: self.idioma.lbDisplayMsgGrid,
            emptyMsg: self.idioma.lbEmptyMsg
        });

        this.cargaInicial = function (){
            PVD.mostrarMascara('idmskconfigbusqueda',self.idioma.lbporfavorespere, self.idioma.lbLoadConfigBusqueda);
            Ext.Ajax.request({
                url: '/reccomplejas/index.php/reccomplejas/getColumnasBusqueda',
                method:'POST',
                params: {
                    idbusqueda: self.idbusqueda
                },
                callback: function (options, success, response) {
                    if(success) {
                        var result = Ext.util.JSON.decode(response.responseText);
                        PVD.ocultarMascara('idmskconfigbusqueda');

                        var columnModel = new Ext.grid.ColumnModel(result.columnas);
                        var plantilla = new Ext.data.Record.create(result.indices);
                        self.idconfiguracion = result.idconfiguracion;

                        var myReader = new Ext.data.JsonReader({
                            totalProperty: "cantidad",
                            root: "datos"
                        }, plantilla);
                        //Store usado por la accion de Buscar
                        var stReporteAux = new Ext.data.Store({
                            url: '/reccomplejas/index.php/reccomplejas/cargarInterfazReporte',
                            reader: myReader,
                            baseParams: {
                                idconfiguracion: self.idconfiguracion,
                                idbusqueda: self.idbusqueda
                            }
                        });
                        stReporteAux.on('load', function(store, records, options){
                            self.fireEvent('load',store,records,options);
                        });
                        stReporteAux.on('beforeload', function(store, options){
                            self.fireEvent('beforeload',store,options);
                        });
                        self.reconfigure(stReporteAux, columnModel);

                        stReporteAux.load({
                            params:{
                                'limit':self.cantElementsByPage,
                                'start':0
                            }
                        });
                        self.getBottomToolbar().unbind(self.getStore());
                        self.getBottomToolbar().bind(stReporteAux);
                        self.doLayout();
                    }
                }
            });
        }
        // if(flagFirst == false){
        // self.on('afterlayout', function(container, layout){
        this.cargaInicial();
        // flagFirst = true;
        // });
        //}

        Ext.components.CmpReccomplejas.GridResultadoBusqueda.superclass.initComponent.call(this);
    }
});
Ext.reg('CmpReccomplejas_GridResultadoBusqueda', Ext.components.CmpReccomplejas.GridResultadoBusqueda);