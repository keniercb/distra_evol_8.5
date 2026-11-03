Ext.ns('Gestionar.adicionarinversiones');


Gestionar.adicionarinversiones.Modelo = {
    init: function() {
        _this = this;

        _this.stClasificacion = new Ext.data.Store({
            url: '/planificacion/planmeta/index.php/inversiones/listarComboClasificacion',
            autoload: true,
            reader: new Ext.data.JsonReader({
                id: 'idtipoinversion',
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'idtipoinversion'
                }])
        });
        _this.stTipoFinan = new Ext.data.Store({
            url: '/planificacion/planmeta/index.php/inversiones/listarTipoFinan',
            reader: new Ext.data.JsonReader({
                id: 'idtipofinanciamiento',
                root: 'data'
            },
            [{
                    name: 'denominaciontipo'
                }, {
                    name: 'idtipofinanciamiento'
                }])
        });
        _this.stFinancista = new Ext.data.Store({
            url: '/planificacion/planmeta/index.php/inversiones/listarFinancista',
            reader: new Ext.data.JsonReader({
                id: 'idfinancista',
                root: 'data'
            },
            [{
                    name: 'denominaciontipo'
                }, {
                    name: 'idfinancista'
                }])
        });
        _this.stMonedas = new Ext.data.Store({
            url: '/planificacion/planmeta/index.php/inversiones/listarMoneda',
            reader: new Ext.data.JsonReader({
                id: 'idmoneda',
                root: 'data'
            }, [{
                    name: 'denominacion'
                }, {
                    name: 'idmoneda'
                }
            ])
        });

        _this.stPresupuesto = new Ext.data.Store({
            url: '/planificacion/planmeta/index.php/inversiones/listarPresupuesto',
            reader: new Ext.data.JsonReader({
                id: 'idpresupuesto',
                root: 'data',
            },
                    [{
                            name: 'denominacion'
                        }, {
                            name: 'idpresupuesto'
                        }, {
                            name: 'valor'
                        }, {
                            name: 'moneda'
                        }, {
                            name: 'denominacion'
                        }, {
                            name: 'idmonedaentidad'
                        }, {
                            name: 'idinversion'
                        }])
        });
        _this.store_Financiamiento = new Ext.data.Store({
            url: '/planificacion/planmeta/index.php/inversiones/listarFinanciamiento',
            reader: new Ext.data.JsonReader({
                id: 'idfinanciamiento',
                root: 'data',
            },
                    [{
                            name: 'valor'
                        }, {
                            name: 'moneda'
                        }, {
                            name: 'idfinancista'
                        }, {
                            name: 'idtipofinanciamiento'
                        }, {
                            name: 'financi'
                        }, {
                            name: 'tipo'
                        }, {
                            name: 'idmonedaentidad'
                        }])
        });


        _this.stTipoInversion = new Ext.data.Store({
            url: '/planificacion/planmeta/index.php/inversiones/listarComboTipoInversion',
            autoload: true,
            reader: new Ext.data.JsonReader({
                id: 'idtipoinversionprograma',
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'idtipoinversionprograma'
                }])
        });
        _this.stCaracteristica = new Ext.data.Store({
            url: '/planificacion/planmeta/index.php/inversiones/listarComboCaracteristica',
            autoload: true,
            reader: new Ext.data.JsonReader({
                id: 'idcaracteristica',
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'idcaracteristica'
                }])
        });
        _this.stFormapropiedad = new Ext.data.Store({
            url: '/planificacion/planmeta/index.php/inversiones/listarComboFormaPropiedad',
            autoload: true,
            reader: new Ext.data.JsonReader({
                id: 'idformapropiedad',
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'idformapropiedad'
                }])
        });
        _this.stObjetivo = new Ext.data.Store({
            url: '/planificacion/planmeta/index.php/inversiones/listarComboObjetivo',
            autoload: true,
            reader: new Ext.data.JsonReader({
                id: 'idobjetivo',
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'idobjetivo'
                }])
        });
        _this.stEfecto = new Ext.data.Store({
            url: '/planificacion/planmeta/index.php/inversiones/listarComboEfecto',
            autoload: true,
            reader: new Ext.data.JsonReader({
                id: 'idefectocomercial',
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'idefectocomercial'
                }])
        });
    }
};