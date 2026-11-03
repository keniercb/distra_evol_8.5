//Ext.ns('Gestionar.adicionarinversiones');


//Gestionar.adicionarinversiones.Modelo = {
Utilidades.Cmp.modeloVentanaInversiones = function(opciones) {
    var _this = this;
    this.idOrganismo = opciones.idOrganismo;

    this.init = function() {

        this.stFormapropiedad = new Ext.data.Store({
            //url: '/planificacion/planmeta/index.php/inversiones/listarComboFormaPropiedad',
            url: '/planificacion/inversiones/index.php/inversiones/listarComboFormaPropiedad',
            reader: new Ext.data.JsonReader({
                    root: 'data'
                },
                [{
                    name: 'denominacion'
                }, {
                    name: 'idformapropiedad'
                }])
        });

        _this.stGrupoObra = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarGrupoObra',
            reader: new Ext.data.JsonReader({
                    root: 'data'
                },
                [{
                    name: 'denominacion'
                }, {
                    name: 'idgrupoobra'
                }])
        });

        _this.stEstado = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarEstado',
            reader: new Ext.data.JsonReader({
                    root: 'data'
                },
                [{
                    name: 'denominacion'
                }, {
                    name: 'idestadoplaninversion'
                }])
        });

        _this.stSectorEstrategico = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarSectorEstrategico',
            reader: new Ext.data.JsonReader({
                    root: 'data'
                },
                [{
                    name: 'denominacion'
                }, {
                    name: 'idsectorestrategico'
                }])
        });

        _this.stObjetivo = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            displayText: 'Objetivo',
            //url: '/planificacion/planmeta/index.php/inversiones/listarComboObjetivo',
            url: '/planificacion/inversiones/index.php/inversiones/cargarDatosNomInversion',
            //autoLoad: true,
            baseParams:{
                idNomInversion: 7,
            },
            reader: this.jrSEctor = new Ext.data.JsonReader({
                id: 'idobjetivo',
                root: 'data'
            }, [{
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'text'
            }, {
                name: 'idobjetivo'
            }, {
                name: 'denominacion'
            }, {
                name: 'codigo',
                mapping: 'text'
            }])
        });

        this.stPrograma = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboProgramada',
            reader: new Ext.data.JsonReader({
                    id: 'idprogramada',
                    root: 'data'
                },
                [{
                    name: 'denominacion'
                }, {
                    name: 'idprogramada'
                }])
        });

        this.stClasificacion = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboClasificacion',
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

        this.stEfecto = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboEfecto',
            reader: new Ext.data.JsonReader({
                    root: 'data'
                },
                [{
                    name: 'denominacion'
                }, {
                    name: 'idefectocomercial'
                }])
        });

        this.stTipoInversion = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboTipoInversion',
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

        this.stDesempeno = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboDesempenno',
            reader: new Ext.data.JsonReader({
                    root: 'data'
                },
                [{
                    name: 'denominacion'
                }, {
                    name: 'iddatdesempenno'
                }])
        });
        this.stDesempeno.reload();

        this.stCaracteristica = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboCaracteristica',
            // autoload: true,
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

        this.stMedioAmbiente = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboMedioAmbiente',
            // autoload: true,
            reader: new Ext.data.JsonReader({
                    id: 'idmedioambiente',
                    root: 'data'
                },
                [{
                    name: 'denominacion'
                }, {
                    name: 'idmedioambiente'
                }])
        });

        this.stImportacion = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarLiquidos',
            reader: new Ext.data.JsonReader({
                    root: 'data'
                },
                [{
                    name: 'denominacion'
                }, {
                    name: 'iderogacionliquido'
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

        this.stMonedas = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarMoneda',
            reader: new Ext.data.JsonReader({
                    id: 'idmoneda',
                    root: 'data'
                },
                [{
                    name: 'denominacion'
                }, {
                    name: 'idmoneda'
                }])
        });

        this.stPresupuesto = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarPresupuesto',
            reader: new Ext.data.JsonReader({
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
                }, {
                    name: 'idpresanteproy'
                }])
        });

        this.store_Financiamiento = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarFinanciamiento',
            reader: new Ext.data.JsonReader({
                    root: 'data',
                    autoload: true,
                },
                [{
                    name: 'valor'
                },{
                    name: 'valorprueba'
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
                }, {
                    name: 'idfinanciamiento'
                }, {
                    name: 'porcientointeres'
                }, {
                    name: 'plazoamortizacion'
                }, {
                    name: 'gracia'
                }])
        });

        this.stFinancista = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarFinancista',
            reader: new Ext.data.JsonReader({
                    root: 'data'
                },
                [{
                    name: 'denominaciontipo'
                }, {
                    name: 'idfinancista'
                }])
        });

        this.stTipoFinan = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarTipoFinan',
            reader: new Ext.data.JsonReader({
                    root: 'data'
                },
                [{
                    name: 'denominaciontipo'
                }, {
                    name: 'idtipofinanciamiento'
                }])
        });


    }
};