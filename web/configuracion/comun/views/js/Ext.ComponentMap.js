/**
 * @class Ext.ComponentMap
 * @extends Ext.Component
 * @author Ing. Alberto Mesa Martínez
 */
Ext.ComponentMap = Ext.extend(Ext.Component, {
    perfil: window.parent.UCID.portal.perfil,
    defaultIcon: '/configuracion/comun/views/images/ptorojo.png',
    titleWindow: '',
    iconField: 'imagen',
    labelField: '',
    project: 'erpintegracion',
    autoCreate: false,
    showWindow: false,
    readOnly: false,
    constructor: function (params) {
        this.addEvents(
            /**
             * @event windowbeforeshow
             * Se dispara antes que la ventana general del componente GIS se muestre.
             * Si el listener devuelve <tt>false</tt> la ventana no se muestra.
             */
            'windowbeforeshow',
            /**
             * @event windowshow
             * Se dispara despues de que la ventana general del componente GIS se muestra.
             */
            'windowshow',
            /**
             * @event windowclose
             * Se dispara despues de que la ventana general del componente GIS se cierra.
             */
            'windowclose',
            /**
             * @event capture
             * Se dispara despues que se ubica un nuevo punto en el mapa.
             * @param {Number} coordenada x del punto en el mapa.
             * @param {Number} coordenada y del punto en el mapa.
             * @param {String} ruta de la imagen del punto.
             * @param {String} nombre del punto.
             */
            'capture'
        );

        Ext.apply(this, params);
        if (this.autoCreate) {
            this.createMap();
        }
    },
    createMap: function (config) {
        var mask = new Ext.LoadMask(Ext.getBody());
        var _this = this;
        Ext.apply(this, config);

        //Directorio comun donde se ubican los ficheros js y css
        //var commonDir = 'configuracion/clientesyproveedores/views/js/clientesyproveedores/';
        var commonDir = '/configuracion/comun/views/js/';

        this.cmpGIS = new GIS({
            project: this.project,
            commonDir: commonDir,
            indexURL: '/gis/index.php/mapa/displayGenesig',
            iframeLoadedTime: 5000,
            plugins: [
                {
                    name: 'locatePoint', //Nombre del plugin,
                    static: ['AjaxPlugins.locatePoint.js']  //Arreglo de cadenas que no son mas que las direcciones relativas de los ficheros js y css del plugin
                }
            ],
            ventana: {
                border: false,
                maximized: true,
                buttons: [{
                    iconCls: 'salir',
                    text: 'Salir',
                    //tooltip: this.etiquetas.lbTtCancelar,
                    handler: function () {
                        _this.cmpGIS.window.close();
                    }
                }],
                listeners: {
                    beforeshow: function () {
                        _this.fireEvent('windowbeforeshow');
                    },
                    show: function () {
                        _this.fireEvent('windowshow');
                    },
                    close: function () {
                        _this.fireEvent('windowclose');
                    }
                }
            }
        });

        this.cmpGIS.on(
            {
                scope: this,
                iframeLoaded: function () {
                    this.cmpGIS.AjaxPlugins.locatePoint.EVT_MANAGER.on({
                        scope: this,
                        capture: function (obj) {
                            this.fireEvent('capture', obj);
                        }
                    });

                    this.cmpGIS.Genesig.getView().addToolBarButton({
                        text: "",
                        icon: 'gis_localizar',
                        ttip: _this.titleWindow || 'Localizar punto',
                        id: 'btnDistra',
                        handler: function () {
                            _this.cmpGIS.AjaxPlugins.locatePoint.show(_this);
                        }
                    });

                    if (this.showWindow) {
                        this.cmpGIS.AjaxPlugins.locatePoint.show(this);
                    }
                }
            }
        );

        this.cmpGIS.show();
    },
    reloadMap: function (msg) {
        this.cmpGIS.Genesig.ajax.trigger("Layers.LayerShowHide", {}, {msg: msg || 'Actualizando la vista del mapa'});
    }
})