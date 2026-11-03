
mapControls.View = function(params) {
    var idCapa = params.idCapa;
    var idMapa = params.idMapa;

    var extComponent = {};
    var properties = params.properties;
    Ext.QuickTips.init();

	this.idioma = Ext.idioma.es.cmpreccomplejas.reccomplejas.etiquetas;


    var EVT_MANAGER = new Ext.util.Observable();
    EVT_MANAGER.addEvents({
        "featurecreate": true,
        "beforedelete": true,
        "beforeinsertfeatures": true,
        "beforeupdate": true,
        "oncancel": true
    });


    /**
     * Devuelve el manejador de eventos
     * 
     * */
    this.getEventManager = function() {
        return EVT_MANAGER;
    };

    /**
     *	Muetra la ventana 
     */
    this.show = function() {

        var pbLoad = new Ext.ProgressBar({
            text: self.idioma.lbGridLoadMask,
            id: 'pbar2',
            cls: 'custom'
        });
        var wnLoad = new Ext.Window({
            title: self.idioma.lbGridLoadMask,
            layout: 'fit',
            width: 300,
            height: 50,
            closable: false,
            resizable: false,
            modal: true,
            items: [pbLoad],
            closeAction: 'hide',
            listeners: {
                show: function() {
                    pbLoad.text = self.idioma.lbGridLoadMask;
                    pbLoad.wait({
                        interval: 200,
                        increment: 15,
                        fn: function() {
                        }
                    });

                },
                hide: function() {
                    pbLoad.reset();
                }
            }
        });

        var tabs = new Ext.Panel({
            tbar: new Ext.Toolbar({
                id: 'tbpsuperior',
                buttons: [{
                        text: self.idioma.MsgWait
                    }],
                listeners: {
                    render: function(th) {
                        th.getEl().dom.innerHTML = "<div id='_MODpanelControl' class='olControlPanel' style='width: 100%; height:20px;'></div><span id='spBtnAyudaCapa' style='float: right;margin-top:-20px;'></span>";
                        /*var btnAyudaCarac = new Ext.Button({
                            id: 'btnAyudaCarac',
                            renderTo: 'spBtnAyudaCapa',
                            tooltip: "Mostrar Ayuda de la funcionalidad",
                            icon: perfil.dirImg + 'ayuda.png',
                            iconCls: 'btn',
                            text: "Ayuda",
                            handler: function() {
                                var title = 'Ayuda de trabajo del subsistema de representación';
                                //var referencia = 'gestrepresentacion';gestrepresentacionzs
                                var referencia = 'gestrepresentacionzs';
                                help.show(title, referencia);
                            }
                        });*/
                    }
                }
            }),
            bbar: new Ext.Toolbar({
                id: 'tbpinferior',
                buttons: [{
                        text: self.idioma.MsgWait
                    }],
                listeners: {
                    render: function(th) {
                        th.getEl().dom.innerHTML = "<div id='general' style='width: 100%; height:16px;'><span id='floatGeo' style='position: absolute;text-align: left; width: 100%'> Coordenadas(units): _ / _</span><span id='divEscalaFloat' style='position: absolute;text-align: center; width: 100%'>Escala 1ewrwfdasf:</span><span id='divCapaSeleccionada' style='position: absolute;text-align: right; width: 99%'>Seleccionada:  </span></div>";
                    }
                }
            }),
            region: 'center',
            margins: '3 3 3 0',
            layout: 'fit',
            items: [{
                    html: "<div id='" + ((params.idMapa) ? params.idMapa : "map") + "' style='width:100%;height:100%'> </div> "
                }],
            listeners: {
                resize: function() {
                    if (_this.mapa)
                    {
                        wnLoad.show();
                        setTimeout(
                                function() {
                                    _this.mapa.getMapa().updateSize();
                                    wnLoad.hide();
                                }, 1000);


                    }
                }
            }
        });


        var tabcontrol = new Ext.TabPanel({
            id: 'tabcontrol',
            region: 'center',
            activeTab: 0,
            enableTabScroll: true,
            layoutOnTabChange: true,
            items: [{
                    xtype: 'panel',
                    id: 'pLoadLayers',
                    title: self.idioma.lbGridLoadMask
                }],
            listeners: {
                tabchange: function() {
                    //if( Plugins != undefined && Plugins.Layers != undefined )
                    ;
                }
            }

        });
        var panelControlCapas = new Ext.Panel({
            region: 'west',
            id: 'paneltabcontrol',
            split: true,
            collapsible: true,
            collapsed: false,
            collapseMode: 'mini',
            layout: 'fit',
            title: self.idioma.titleControlMapas,
            width: 200,
            items: [tabcontrol]
        });


        var localizator = new Ext.Panel({
            region: 'east',
            id: 'Localizador',
            split: true,
            layout: 'fit',
            title: self.idioma.titleLocalizador,
            width: 200,
            collapsible: true /*,
             items : Localizador.init(_this.mapa.getMapa())*/
        });
        params.proprties = params.proprties ? params.proprties : {};
        extComponent = new Ext.Window({
            id: params.proprties.id ? params.proprties.id : '_mapWindow',
            layout: 'border',
            modal: params.properties.modal ? true : false,
            iconCls: params.properties.iconCls ? params.properties.iconCls : '',
            title: (params.properties.title != undefined) ? params.properties.title : "Representación de entidades",
            width: (params.properties.width != undefined) ? params.properties.width : '85%',
            height: (params.properties.height != undefined) ? params.properties.height : 550,
            minHeight: (params.properties.minHeight != undefined) ? params.properties.minHeight : 500,
            closable: (params.properties.closable != undefined) ? params.properties.closable : true,
            minimizable: (params.properties.minimizable != undefined) ? params.properties.minimizable : true,
            maximizable: (params.properties.maximizable != undefined) ? params.properties.maximizable : true,
            closeAction: 'destroy',
            listeners: {
                resize: function() {
                    if (_this.mapa)
                        _this.mapa.getMapa().updateSize();
                },
                move: function() {
                    if (_this.mapa)
                        _this.mapa.getMapa().updateSize();
                },
                show: function(cmp) {
                    cmp.keys = new Ext.KeyMap(cmp.getEl(), {
                        key: Ext.EventObject.DELETE,
                        fn: function() {
                            alert(cmp.title);
                        },
                        scope: this,
                        stopEvent: true
                    });
                    params.filter = {
                        layers: params.filter
                    };
                    params.idMap = params.idMapa;
                    params.idcapa = params.idCapa;
                    params.mapView = _this;
                    _this.mapa = new mapControls.OpenLayersControls(params
                            /*{
                             idMap : (params.idMapa)
                             ? params.idMapa
                             : "map",
                             idcapa: idCapa,
                             perfil : params.perfil,
                             filter : {layers : params.filter}
                             }*/);
                    
                    _this.mapa.getCapas().on('selectLayer', function(layer, nodeLayer) {
                        EVT_MANAGER.fireEvent('activateLayer', layer, nodeLayer);
                    });

                    _this.mapa.on('deletefeature', function(data) {
                        EVT_MANAGER.fireEvent('beforedelete', {
                            id: data.id,
                            layer: data.capaid,
                            nameLayer: data.nombrec
                        });
                    });

                    _this.mapa.on('featurecreate', function(feature) {
                        EVT_MANAGER.fireEvent('featurecreate', feature);
                    });

                    _this.mapa.on("featuremodify", function(feature) {


                        // si es nueva no ejecutar el triger
                        if (feature.state && feature.state == "Insert")
                            return false;
                        var arrayPoints = [];
                        var points = feature.geometry.getVertices();
                        var geometria = "";
                        for (var k in points)
                            if (typeof(points[k]) != "function")
                                if (points[k].x && points[k].y)
                                    arrayPoints.push({
                                        x: points[k].x,
                                        y: points[k].y
                                    });
                        switch (feature.geometry.CLASS_NAME) {
                            case "OpenLayers.Geometry.Polygon":
                                arrayPoints.push(arrayPoints[0]);
                                geometria = "polygon";
                                break;
                            case "OpenLayers.Geometry.Point":
                                geometria = "point";
                                break;
                            case "OpenLayers.Geometry.LineString":
                                geometria = "polyline";
                                break;
                        }


                        var a = [8];
                        if (feature.style.fontSize != undefined)
                            a = feature.style.fontSize.split("px");

                        var symbol = feature.style.externalGraphic;
                        var URL = GIS_CONFIG.gis_url;
                        symbol = symbol.split(URL);
                        if (symbol[1] != undefined)
                            symbol = symbol[1];
                        else
                            symbol = '';

                        EVT_MANAGER.fireEvent("beforeupdate", {
                            vertices: arrayPoints,
                            type: geometria,
                            attributes: {
                                label: feature.style.label,
                                dataId: feature.id,
                                area: feature.area,
                                perimeter: feature.perimetro
                            },
                            labelStyle: {
                                angle: 0,
                                color: feature.style.fontColor,
                                outlineColor: feature.style.fontColor,
                                size: a[0],
                                // propios de openlayers
                                labelYOffset: feature.style.labelYOffset,
                                labelXOffset: feature.style.labelXOffset,
                                fontWeight: feature.style.fontWeight,
                                labelAlign: feature.style.labelAlign,
                                fontFamily: feature.style.fontFamily,
                                fontStyle: feature.style.fontStyle,
                                fontSize: feature.style.fontSize,
                                fontOpacity: feature.style.fontOpacity
                            },
                            scale: {
                                maxscale: feature.style.classmaxscale,
                                minscale: feature.style.classminscale
                            },
                            style: {
                                angle: 0,
                                color: feature.style.fillColor,
                                outlineColor: feature.style.strokeColor,
                                size: 16,
                                symbol: symbol,
                                graphicHeight: feature.style.graphicHeight,
                                graphicWidth: feature.style.graphicWidth,
                                graphicOpacity: feature.style.graphicOpacity,
                                pointRadius: feature.style.pointRadius,
                                strokeOpacity: feature.style.strokeOpacity, // opacidad linea
                                fillOpacity: feature.style.fillOpacity, // opaxcidad del fondo
                                strokeWidth: feature.style.strokeWidth, // ancho de linea
                                strokeDashstyle: feature.style.strokeDashstyle, // [dot | dash | dashdot | longdash | longdashdot | solid] // estilo de linea
                                strokeLinecap: feature.style.strokeLinecap // estilo del trazado de la linea   [butt | round | square]

                            },
                            operation: 'update',
                            id: feature.id,
                            layer: feature.layer.attributes.id,
                            nameLayer: feature.layer.attributes.name
                        });
                    });
                    cmp.doLayout();

                    tabcontrol.add(_this.mapa.getTreeLayer());
                    tabcontrol.add(Plugins.Layers.Arbol);
                    tabcontrol.remove('pLoadLayers');
                    tabcontrol.doLayout();
                    tabcontrol.setActiveTab(0);
                    var object = document.getElementById('idTablaInferior');
                    //if( object )
                    //	object.parentNode.className = '';
                    cmp.doLayout();

                },
                close: function(cmp) {
                    activeDelete = false;
                }
            },
            //items    : [tabcontrol, tabs, localizator],
            items: [panelControlCapas, tabs, localizator]
        });

        extComponent.show();
        Ext.WindowMgr.unregister(extComponent);
        _this.getEventManager().fireEvent('show', _this)
    };

    /**
     * Funcion que busca las geometrias insertadas en la capa seleccionada y ejecuta el evento before insert para que los subscritos decidan que hacer con estas
     * 
     * */
    this.insertFeatures = function()
    {
        var features = _this.mapa.getNewFeatures();
        var arrayPolygon = [];
        for (var i in features) {
            if (typeof(features[i]) != "function" && features[i].layer != undefined)
            {
                var feature = features[i];
                var arrayPoints = Array();
                var points = features[i].geometry.getVertices();
                for (var k in points)
                    if (typeof(points[k]) != "function")
                        if (points[k].x && points[k].y)
                            arrayPoints.push({
                                x: points[k].x,
                                y: points[k].y
                            });

                var geometria = "";
                switch (feature.geometry.CLASS_NAME) {
                    case "OpenLayers.Geometry.Polygon":
                        arrayPoints.push(arrayPoints[0]);
                        geometria = "polygon";
                        break;
                    case "OpenLayers.Geometry.Point":
                        geometria = "point";
                        break;
                    case "OpenLayers.Geometry.LineString":
                        geometria = "polyline";
                        break;
                }

                var a = feature.style.fontSize.split("px");
                var symbol = feature.style.externalGraphic;
                var URL = GIS_CONFIG.gis_url;
                symbol = symbol.split(URL);

                if (symbol[1] != undefined)
                    symbol = symbol[1];
                else
                    symbol = '';


                var minscale = feature.style.classminscale != undefined ? feature.style.classminscale : 1;
                var maxscale = feature.style.classmaxscale != undefined ? feature.style.classmaxscale : parseInt(feature.layer.map.getScale()) + 1;
                arrayPolygon.push({
                    vertices: arrayPoints,
                    type: geometria,
                    attributes: {
                        label: feature.style.label,
                        dataId: feature.id,
                        area: feature.area,
                        perimeter: feature.perimetro
                    },
                    labelStyle: {
                        angle: 0,
                        color: feature.style.fontColor,
                        outlineColor: feature.style.fontColor,
                        size: a[0],
                        // propios de openlayers
                        labelYOffset: feature.style.labelYOffset,
                        labelXOffset: feature.style.labelXOffset,
                        fontWeight: feature.style.fontWeight,
                        labelAlign: feature.style.labelAlign,
                        fontFamily: feature.style.fontFamily,
                        fontStyle: feature.style.fontStyle,
                        fontSize: feature.style.fontSize,
                        fontOpacity: feature.style.fontOpacity
                    },
                    scale: {
                        maxscale: maxscale,
                        minscale: minscale
                    },
                    style: {
                        angle: 0,
                        color: feature.style.fillColor,
                        outlineColor: feature.style.strokeColor,
                        size: 16,
                        symbol: symbol,
                        graphicHeight: feature.style.graphicHeight,
                        graphicWidth: feature.style.graphicWidth,
                        graphicOpacity: feature.style.graphicOpacity,
                        pointRadius: feature.style.pointRadius,
                        strokeOpacity: feature.style.strokeOpacity, // opacidad linea
                        fillOpacity: feature.style.fillOpacity, // opaxcidad del fondo
                        strokeWidth: feature.style.strokeWidth, // ancho de linea
                        strokeDashstyle: feature.style.strokeDashstyle, // [dot | dash | dashdot | longdash | longdashdot | solid] // estilo de linea
                        strokeLinecap: feature.style.strokeLinecap // estilo del trazado de la linea   [butt | round | square]

                    },
                    operation: 'insert',
                    id: feature.id,
                    layer: feature.layer.attributes.id,
                    nameLayer: feature.layer.attributes.name
                });
            }
        }

        EVT_MANAGER.fireEvent("beforeinsertfeatures", arrayPolygon);

    };

    /**
     *	registra una funcion al manejador de eventos
     */
    this.on = function(evt, fn, scope) {
        EVT_MANAGER.on(evt, fn, scope);
    };


    /**
     * obtener las features que estan insertadas nuevas
     */
    this.getNewFeatures = function() {
        return _this.mapa.getNewFeatures();
    };

    /**
     * obtener las features que estan insertadas nuevas
     */
    this.deleteNewFeaturesById = function(idFeature) {
        var aux = [];
        var flag = false;
        var features = _this.mapa.getNewFeatures();
        for (var i in features) {
            if (typeof(features[i]) != "function") {
                if (features[i].id != idFeature)
                {
                    aux.push(features[i]);
                }
                else
                    flag = true;
            }
        }
        // reasignar el arreglo sin la geometria
        features = aux;
        return flag;

    };

    /**
     *	Devuelve la cantidad de features insertadas
     */
    this.countFeatures = function()
    {
        var features = _this.mapa.getNewFeatures();
        var arrayPolygon = Array();
        for (var i in features) {
            if (typeof(features[i]) != "function") {
                var objPoligon = new Polygon();
                var arrayPoints = Array();
                var points = features[i].geometry.getVertices();
                for (var k in points)
                    if (typeof(points[i]) != "function")
                        if (points[k].x && points[k].y)
                            arrayPoints.push({
                                x: points[k].x,
                                y: points[k].y
                            });
                arrayPoints.push(arrayPoints[0]);
                objPoligon.set({
                    'vertices': arrayPoints,
                    layer: features[i].layer.attributes.id,
                    nameLayer: features[i].layer.attributes.name
                });
                arrayPolygon.push(objPoligon);
            }
        }
        return arrayPolygon;
    };

    /**
     *	Actuualiza el dibujo del mapa
     */
    this.refresh = function() {
        _this.mapa.refresh();
    };

    /**
     *	Recarga las geometrias en el arbol de capas de la capa id
     */
    this.reloadNode = function(id) {
        _this.mapa.getCapas().reloadNode(id);
    };

    /**
     *	Recarga las geometrias en el arbol de capas de la capa id
     */
    this.removeNodeFromLayer = function(layer, id) {
        _this.mapa.getCapas().removeNodeFromLayer(layer, id);
    };

    /**
     * eliminar las features que estan insertadas
     */
    this.resetFeatures = function() {
        _this.mapa.resetFeatures();
    };

    /**
     * devuelve el objeto  mapa
     */
    this.getMap = function() {
        return _this.mapa.getMapa();
    };
    /**
     Devuelve el los controles
     */
    this.getMapControls = function() {
        return _this.mapa.getMapControls();
    };

    /**
     *	Devuelve el los controles
     */
    this.addMapControl = function(control) {
        _this.mapa.addMapControl(control);
    };

    /**
     *	Devuelve el los controles
     */
    this.getLocalizador = function(   ) {
        return _this.mapa.getLocalizador();
    };

    /**
     *	Asigna un nuevo filtro a una capa
     */
    this.setFilter = function(layer, filter) {
        return _this.mapa.setFilter(layer, filter);
    };
    /**
     Anade un nuevo filtro a una capa
     */
    this.addFilterToLayer = function(layer, newfilter) {
        return _this.mapa.addFilterToLayer(layer, newfilter);
    };

    /**
     *	Asigna un nuevo filtro a una capa
     */
    this.setFilterGlobal = function(filter) {
        return _this.mapa.setFilterGlobal(filter);
    };

    /**
     * Ordenada recargar el arbol de capas de edicion
     * 
     * */
    this.reloadTreeLayer = function() {
        _this.mapa.getCapas().reloadTreeLayer();
    };

    /**
     *	Obtener el panel de las herramientas
     */
    this.getPanel = function() {
        return _this.mapa.getPanel();
    };

    /**
     *	Max le vantana 
     */
    this.maximize = function() {
        extComponent.maximize();
        _this.mapa.getMapa().updateSize();
    };

    /**
     *	Recarga las geometrias en el arbol de capas de la capa id
     */
    this.getActiveLayerNode = function() {
        _this.mapa.getCapas().getActiveLayerNode();
    };

    /**
     * Devuelve la ventana completa donde se trabaja con el mapa
     * */
    this.getVentana = function() {
        return extComponent;
    };


    /**
     * Devuelve la ventana completa donde se trabaja con el mapa
     * */
    this.getMapId = function() {
        return idMapa;
    };
    var _this = this;
}
