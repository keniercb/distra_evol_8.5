/* 
 * Componente compatible con Genesig para agregarlo desde el marco de trabajo. 
 */
AjaxPlugins.estructura = {
    arregloDeEstructuras : [],
    description: 'Este plugin sera annadido a Genesig desde el marco de trabajo Zeolides',
    msg: function() {
        //AjaxPlugins.CartoMessages.mostrarMensaje(1,AjaxPlugins.zeolides.description);		
        var pluginWindow = new Ext.Window({
            title: 'Zeolides',
            width: 300,
            height: 400
        });

        pluginWindow.show();
    },
    /**
     *  Manejador de eventos
     */
    EVT_MANAGER: new Ext.util.Observable(),
    /**
     * Subcriccion a eventos
     */
    on: function(evt, fn, scope) {
        AjaxPlugins.estructura.EVT_MANAGER.on(evt, fn, scope);
    },
    init: function() {

    },
    
    hideLayerPanel : function () {
        //TODO
        /*objView.getComponents().este.collapse();
        /*console.log(objView.getComponents());
        console.log(objView.getViewPort());*/
    },
    
    representarEstructura : function (arreglo){
        var options = {
            /* styleMap: new OpenLayers.StyleMap({
             "default": _this.pointsLayerStyle,
             "select": _this.pointsLayerStyleHover,
             "temporary": _this.pointsLayerStyleTemporary
             }),
             parent: _this.layersContainerFoldersNode,
             rendererOptions: {zIndexing: true} // Para ordenar (traer al frente la seleccionada)*/
        };
        var pointsLayerObject = Genesig.addvectorLayer('estructuraLayer', 'Estructuras', options);
        pointsLayerObject.removeAllFeatures();
        this.arregloDeEstructuras = arreglo;
        var features = [];
        // POINT(lon lat)
        for (var i = 0; i < this.arregloDeEstructuras.length; i++) {
            features.push(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(this.arregloDeEstructuras[i].longitud, this.arregloDeEstructuras[i].latitud), {
                idestructura: this.arregloDeEstructuras[i].idestructura
            }, {
                externalGraphic: '/logistica/inventario/replicadatos/views/images/marker-gold.png',
                graphicWidth: 20,
                graphicHeight: 20,
                label: this.arregloDeEstructuras[i].denominacion,
                labelAlign: 'b',
                strokeWidth: 1,
                strokeLinecap: 'round'
            }));
        }
        pointsLayerObject.addFeatures(features);
    }
};

AjaxPlugins.initializablePlugins.push(AjaxPlugins.estructura);
