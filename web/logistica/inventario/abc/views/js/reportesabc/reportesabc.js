Ext.ns('Ext.log.abc');
Ext.QuickTips.init();
Ext.log.abc.ReportesABC = {

    init: function (idioma, perfil) {
        var self = this;

        this.loaderReportes = new Ext.tree.TreeLoader({
            url: 'obtenerreportes'
        });

        this.nodoRaiz = new Ext.tree.AsyncTreeNode({
            id  : 'idrootReportesABC',
            text: 'Reportes'
        });

        this.treeMenu = new Ext.tree.TreePanel({
            title: 'Reportes ABC',
            region: 'west',
            id: 'idmenuReportesABC',
            width: '20%',
            split:true,
            collapsible: true,
            rootVisible: false,
            autoScroll: true,
            titleCollapse: true,
            loader: this.loaderReportes,
            root: this.nodoRaiz,
            listeners: {
                click : function(nodo, e){
                    if(!self.tpReportesABC.getItem('reporte-'+nodo.id)){
                        /*Ext.Ajax.request({
                            url: '/logistica/inventario/abc/index.php/reportesabc/visualizarreporte',
                            method: 'POST',
                            params: {
                                idreporte: nodo.attributes.idreporte
                            },
                            callback: function (options, success, response) {
                                var respuesta = Ext.decode(response.responseText);
                                console.log(respuesta);

                            }.createDelegate(this)
                        });*/

                        self.tpReportesABC.add({
                            id: 'reporte-'+nodo.id,
                            title: nodo.text,
                            height: 600,
                            width: 800,
                            layout: 'fit',
                            closable: true,
                            /*html:"<div height='100%' class=\"contenedoriframereportesabc\">\n" +
                                "<iframe height='100%' width='100%' class=\"responsive-iframereportesabc\" src="+
                                respuesta+"></iframe>\n" +
                                "</div>"*/

                            html:"<div height='100%' class=\"contenedoriframereportesabc\">\n" +
                                "            <iframe height='100%' width='100%' class=\"responsive-iframereportesabc\" src="+
                                nodo.attributes.servidor
                                +"/ReportServer.html#inlinereport/id:"+
                                nodo.attributes.idreporte
                                +"&type:configpreview&user:administrador&apikey:1QaZ2WsX3EdC4RfV5tGB\"></iframe>\n" +
                                "            </div>"
                        });
                        self.tpReportesABC.setActiveTab('reporte-'+nodo.id);
                        self.tpReportesABC.doLayout();

                    }else{
                        self.tpReportesABC.setActiveTab('reporte-'+nodo.id);
                        self.tpReportesABC.doLayout();
                    }
                }.createDelegate(this)
    }
        });

        this.tpReportesABC = new Ext.TabPanel({
            id: 'idtabpanelReportesABC',
            region: 'center',
            enableTabScroll: true,
            defaults: {
                autoScroll: true
            },
            resizeTabs: true,
            width: '80%',
            split:true,
            minTabWidth: 115,
            tabWidth: 320,
            resizeTabs: true,
            frame: true,
            activeTab: 0,
            layoutOnTabChange: true
        });


        new Ext.Viewport({
            layout: 'border',
            items: [this.treeMenu,this.tpReportesABC]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('reportesabc', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];
    var interfaz = Ext.log.abc.ReportesABC;
    interfaz.init(idioma, perfil);

});
