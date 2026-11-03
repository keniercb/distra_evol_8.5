Ext.ns("Ext.components.CmpReccomplejas");
Ext.components.CmpReccomplejas.cbDatosMapa = Ext.extend(Ext.form.ComboBox, {
    initComponent: function() {
        var self = this;
        this.store = new Ext.data.SimpleStore({
            fields: ['idmostrar', 'idmetadato', 'campo', 'text', 'qtip'],
            data: this.data,
            id: 'idmostrar'
        });
        Ext.components.CmpReccomplejas.cbDatosMapa.superclass.initComponent.call(this);

        this.getStore = function() {
            return self.store;
        }
    }
});

Ext.components.CmpReccomplejas.WinSelectFieldsMap = Ext.extend(Ext.Window, {
    layout: 'fit',
    modal: true,
    height: 150,
    width: 350,
    closable: true,
    resizable: false,
    initComponent: function() {
        var self = this;
        this.title = this.idioma.lbWinSelectFieldsMap;

        var btnAceptar = new Ext.Button({
            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'btn',
            text: this.idioma.lbBtnAceptar,
            handler: function() {
                //if (self.pForm.getForm().isValid()) {
                self.showMap();
                self.close();
                //}
            }
        });

        var btnCancelar = new Ext.Button({
            text: self.idioma.lbBtnCancelar,
            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'btn',
            handler: function() {
                self.close();
            }
        });

        var stCbCampos = new Ext.data.Store({
            url: '/reccomplejas/index.php/reccomplejas/getCamposGeoespaciales',
            baseParams: {
                idconfiguracion: self.parent.idconfiguracion
            },
            reader: new Ext.data.JsonReader({
                //root: 'datos'
            }, [{
                    name: 'idcampogeoespacial'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }])
        });

        var cbCampo = new Ext.form.ComboBox({
            fieldLabel: self.idioma.fldenominacion,
            typeAhead: true,
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            displayField: 'denominacion',
            hiddenName: 'idcampogeoespacial',
            valueField: 'idcampogeoespacial',
            allowBlank: false,
            tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            store: stCbCampos
        });

        this.pForm = new Ext.form.FormPanel({
            layout: 'form',
            frame: true,
            width: 300,
            items: [cbCampo]
        });
		this.keys=[
			{
				key:Ext.EventObject.ENTER,
				fn:function(){
					btnAceptar.handler();
				}	
			},{	
				key:'x',
				alt:true,
				fn:function(){
					btnCancelar.handler();
				}
			}
		];
        this.items = [this.pForm];
        this.buttons = [btnCancelar, btnAceptar];
        Ext.components.CmpReccomplejas.WinSelectFieldsMap.superclass.initComponent.call(this);

        this.showMap = function() {
            var arrCondiciones = self.parent.obtenerCondicionesAEvaluar();

            /*var idmostrar = cbCoordX.getValue();
             console.info(idmostrar);
             var coordX = cbCoordX.getStore().getById(idmostrar);
             console.info(coordX);*/

            var win = new mapControls.View({
                //idCapa: 'nueva', // identificador de la capa que se va a marcar cuando cargue el mapa
                //idMapa: 'mapa1',
                perfil: perfil,
                // lugar donde estara centrado el mapa cuando cargue definido por la latitud y la longitud y el zoom
                lon: '-81',
                lat: '23',
                zoom: 6,
                // Capa a mostrar para la carga de cache
                layer: 'DATOSSIG',
                layerRef: 'DATOSSIG-referencia',
//                resolutions:[0.250000,
//                 0.034467577934265137,
//                 0.030203788967132568,
//                 0.027233788967132568,
//                 0.017233788967132568,
//                 0.0086168944835662842,
//                 0.0060168944835662842,
//                 0.0050168944835662842,
//                 0.0043084472417831421,
//                 0.0033084472417831421,
//                 0.002154223620891571,
//                 0.001373,
//                 0.001010,
//                 0.000110,
//                 0.000093,
//                 0.000076,
//                 0.000019,
//                 0.000017,
//                 0.000015,
//                 0.000001
//                 ],
                // Tamano de las imagenes
                tileSize: new OpenLayers.Size(256, 256),
                // definicion de los plugins que son tecnologias que van a ser cargados o no
                pluginsLoad: {
                    ConsultarArea: 0,
                    Consulta: 0,
                    fleetControl: 0,
                    omsGoogleLayer: 0
                },
                // propiedades de la ventana que se va a construir que contendra el mapa
                properties: {
                    title: 'Mapa',
                    closable: true,
                    minimizable: false,
                    maximizable: false,
                    shadow: false,
                    resizable: false,
                    iconCls: 'icon_map',
                }
            });
            win.show();
            //win.maximize();
            //PVD.mostrarMascara('idmskshowmap', self.idioma.lbporfavorespere, 'Buscando datos');
            Ext.Ajax.request({
                url: '/reccomplejas/index.php/reccomplejas/obtenerReporteGeoespacial',
                method: 'POST',
                params: {
                    idconfiguracion: self.parent.idconfiguracion,
                    idcampogeoespacial: cbCampo.getValue(),
                    condiciones: Ext.encode(arrCondiciones)
                },
                callback: function(options, success, response) {
                    var result = Ext.decode(response.responseText);
                    var _this = this;
                    this.layer = null;

                    //if (!win.getMap().getLayerById("layer")) {
                    var layerOptions = {
                        styleMap: new OpenLayers.StyleMap({//Estilo por defecto para la capa de entidades
                            "default": new OpenLayers.Style({
                                label: "${label}",
                                externalGraphic: "${imagen}",
                                fontColor: "red",
                                fontSize: "12px",
                                fontFamily: "Courier New, monospace",
                                fontWeight: "bold",
                                fillColor: "#ff0066",
                                fillOpacity: 1,
                                labelOutlineColor: "white",
                                labelXOffset: 0,
                                labelYOffset: -14,
                                labelOutlineWidth: 2,
                                strokeColor: "#0010e3",
                                strokeOpacity: 1,
                                strokeWidth: 2,
                                strokeLinecap: "round",
                                strokeDashstyle: "solid",
                                pointRadius: 12,
                                pointerEvents: "visiblePainted",
                                cursor: "inherit"
                            })
                        })
                    };

                    _this.layer = new OpenLayers.Layer.Vector("Puntos", layerOptions);
                    _this.layer.id = "layer";
                    win.getMap().addLayer(_this.layer);
                    //}

                    var arrFeatures = new Array();
                    Ext.each(result.datos, function(elem) {
                        //console.info(elem);
                        var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(elem._120, elem._119), {
//                            identificadorO: respuesta[i].identificadorO,
//                            identificadorFila: respuesta[i].identificadorFila,
                            imagen: elem._114,
                            label: elem._111,
//                            escalaMinima: respuesta[i].escalaMinima,
//                            escalaMaxima: respuesta[i].escalaMaxima
                        });
                        arrFeatures.push(feature);
                    });
                    this.layer.addFeatures(arrFeatures);
                    PVD.ocultarMascara('idmskshowmap');
                }
            });
        }
    }
});
