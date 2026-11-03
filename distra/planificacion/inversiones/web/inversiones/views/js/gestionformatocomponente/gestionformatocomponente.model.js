Ext.ns('Gestionar.formato');

Gestionar.formato.Modelo = {
    init: function() {
        _this = this;

        _this.store_gestionar_formato = new Ext.data.Store({
            url: 'cargarFormatosComponentes',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: "total"
            }, [{
                    name: 'idformatoetapa'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'activado'
                }, {
                    name: 'aprobado'
                }, {
                    name: 'uso'
                }
            ])
        });

        _this.store_gestionar_componentes = new Ext.data.Store({
            url: 'cargarComponentes',
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [{
                    name: 'idetapa'
                }, {
                    name: 'idformatoetapa'
                }, {
                    name: 'orden'
                }, {
                    name: 'idflujotrabajo'
                }, {
                    name: 'denominacion',
                    mapping: 'NomNombreetapa.denominacion'
                }, {
                    name: 'orden'
                }, {
                    name: 'idnombreetapa'
                }, {
                    name: 'etapa',
                    mapping: 'DatFlujotrabajo.denominacion'
                }
            ])
        });

        _this.stAsocComponentes = new Ext.data.Store({
            url: 'cargarComponenteByidformatocomponente',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: "total"
            }, [{
                    name: 'idnombreetapa'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'idflujotrabajo'
                }
            ]),
            baseParams: {
            }
        });

        _this.stFlujoTrabajo = new Ext.data.Store({
            url: 'cargarFlujoTrabajo',
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [{
                    name: 'idflujotrabajo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }
            ])
        });

        _this.store_gestionar_elementos = new Ext.data.Store({
            url: 'cargarElementoByidetapa',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: "total"
            }, [{
                    name: 'idelemento'
                }, {
                    name: 'idetapa'
                }, {
                    name: 'denelemento'
                }, {
                    name: 'documento'
                }, {
                    name: 'idtipomodelo'
                }, {
                    name: 'denominacion'
                }
            ]),
            baseParams: {
            }
        });

        _this.stTipomodelo = new Ext.data.Store({
            url: 'cargarTipoModelo',
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [{
                    name: 'idtipomodelo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'idetapa'
                }, {
                    name: 'documento'
                }, {
                    name: 'tipomodelo'
                }
            ])
        });

        /*_this.stDocumento = new Ext.data.Store({
            //url: 'cargarDocAsociados', //este se usaba en la antigua programacion
            url: '/planificacion/planmeta/index.php/clasificaciondeinversiones/cargarDocPrimarios',
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [{
                    name: 'iddocumentos'
                }, {
                    name: 'denominacion'
                }
            ])
        });*/

        _this.stDocumento = new Ext.data.Store({
            //url: 'cargarDocPrimariosElemeto', //este se usaba en la antigua programacion
            url: '/planificacion/inversiones/index.php/clasificaciondeinversiones/cargarDocPrimarios',
            reader: new Ext.data.JsonReader({
                root: 'data',
                id:'iddoc'
            }, [{
                name: 'iddocumentos'
            },{
                name: 'iddoc'
            }, {
                name: 'denominacion'
            }, {
                name: 'checked'
            }
            ])

        });
    }
};