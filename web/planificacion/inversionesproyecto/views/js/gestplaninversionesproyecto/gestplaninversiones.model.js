Ext.ns('Gestionar.planinversiones');

Gestionar.planinversiones.Modelo = {
    init: function() {
        _this = this;

        _this.stCbejercicio = new Ext.data.Store({
            url: 'listarEjercicios',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: "data",
                id: 'idejercicio'
            }, [{
                    name: 'idejercicio'
                }, {
                    name: 'ejercicio'
                }, {
                    name: 'idestado'
                }
            ])
        });
        _this.loaderTreeinversiones = new Ext.tree.TreeLoader({
            dataUrl: 'cargarTreeNomencladores',
            autoLoad: true,
            listeners: {
                beforeload: function(tree, node, res) {
                    tree.baseParams.valor = Ext.getCmp('idfiltroent').getValue();
                },
                load: function(tree, node, res) {

                }
            }
        });

        _this.stIinversiones = new Ext.data.Store({
            url: 'cargarInversiones',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: "total"
            }, [{
                    name: 'idinversion'
                }, {
                    name: 'codigo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'clasificacion'
                }, {
                    name: 'tipoinv'
                }, {
                    name: 'caracteristicas'
                }, {
                    name: 'medioambiente'
                }, {
                    name: 'forma'
                }, {
                    name: 'provincia'
                }, {
                    name: 'fechafin'
                }, {
                    name: 'fechainicio'
                }, {
                    name: 'objetivo'
                }, {
                    name: 'efecto'
                }, {
                    name: 'fasttrack'
                }, {
                    name: 'equipos'
                }, {
                    name: 'plan'
                }, {
                    name: 'financista'
                }, {
                    name: 'tipofinanciamiento'
                }, {
                    name: 'idcumplimientoinversion'
                }, {
                    name: 'idetapainversion'
                }, {
                    name: 'documento'
                }, {
                    name: 'programa'
                }, {
                    name: 'idmedioambiente'
                }, {
                    name: 'cuadrada'
                }, {
                    name: 'idformapropiedad'
                }, {
                    name: 'idobjetivo'
                }, {
                    name: 'idtipoinversion'
                }, {
                    name: 'idefectocomercial'
                }, {
                    name: 'idtipoinversionprograma'
                }, {
                    name: 'idprograma'
                }, {
                    name: 'idcaracteristica'
                }, {
                    name: 'iddatdesempenno'
                }, {
                    name: 'analpostinversiones'
                }, {
                    name: 'observaciones'
                }, {
                    name: 'idprovincia'
                }, {
                    name: 'idgrupoobra'
                }, {
                    name: 'grupoobra'
                }, {
                    name: 'estadoplan'
                }, {
                    name: 'idestadoplaninversion'
                }, {
                    name: 'sector'
                }, {
                    name: 'idsectorestrategico'
                }, {
                    name: 'preparacion'
                }, {
                    name: 'nompreparacion'
                }, {
                    name: 'cartera'
                }, {
                    name: 'factibilidad'
                }, {
                    name: 'estructura'
                }, {
                    name: 'idestadoaprobacion'
                }, {
                    name: 'idestadoinversion'
                }
            ])
        });

        _this.stEquipos = new Ext.data.Store({
            url: 'cargarEquipos',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            }, [{
                    name: 'codigo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'precio'
                }, {
                    name: 'preciodivisa'
                }, {
                    name: 'idunidadmedida'
                }, {
                    name: 'idcentrobalance'
                }, {
                    name: 'cantidad'
                }, {
                    name: 'importe'
                }, {
                    name: 'importedivisa'
                }, {
                    name: 'adquirir'
                }, {
                    name: 'comprar'
                }, {
                    name: 'numeropieza'
                }, {
                    name: 'viaadq'
                }, {
                    name: 'orgrect'
                }, {
                    name: 'idetapaequipos'
                }, , {
                    name: 'idetapa'
                }])
        });


        _this.stReporte = new Ext.data.SimpleStore({
            fields: ['idreporte', 'reporte'],
            data: [[0, 'Reporte Habitaciones'], [1, 'Reporte Vivienda'],
                [2, 'Reporte Demanda de Equipos'],
                [3, 'Reporte Acreedor Inversión'],
                [4, 'Reporte Inversión Acreedor'],
                [5, 'Reporte Resumen inversiones en MP'],
                [10, 'Reporte Resumen inversiones en MUSD'],
                [6, 'Emisión de Inversión'],
                [7, 'Reporte Construcción y Montaje por Constructor'],
                [13, 'Reporte Construcción y Montaje por Constructor XLS'],
                [8, 'Reporte Construcción y Montaje'],
                [15, 'Reporte Construcción y Montaje (EXCEL)'],
                [9, 'Emisión de equipos automotores'],
                [12, 'Reporte equipos automotores (XLS)'],
                [14, 'Reporte equipos automotores Excel'],
                [11, 'Reporte Maqueta'], [16, 'Reporte Componente'],
                [17, 'Reporte balance de equipos automotor'],
                [18, 'Reporte Resumen inversiones en MP (EXCEL)'],
                [19, 'Reporte Componente (EXCEL)']]
        });
        _this.stMonedaAuto = new Ext.data.SimpleStore({
            fields: ['idmonedaauto', 'moneda'],
            data: [[1, 'MP'], [2, 'USD']]

        });

        _this.stDenomInversion = new Ext.data.Store({
            url: 'cargarDenominacionInversion',
            reader: new Ext.data.JsonReader({
                id: 'idinversion',
                root: 'data'
            },
            [{
                    name: 'idinversion'
                }, {
                    name: 'denominacion'
                }])
        });
        _this.storgSatisface = new Ext.data.Store({
            url: 'listarOrgSatisfa',
            reader: new Ext.data.JsonReader({
                id: 'idorganosatisface',
                root: 'data'
            },
            [{
                    name: 'idorganosatisface'
                }, {
                    name: 'denominacion'
                }])
        });
        _this.stConstructor = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/cargarConstructores',
            reader: new Ext.data.JsonReader({
                id: 'idconstructor',
                root: 'datos'
            },
            [{
                    name: 'idconstructor'
                }, {
                    name: 'denomconstructor'
                }])
        });
        _this.stOrganismo = new Ext.data.Store({
            url: 'cargarOrganismos',
            reader: new Ext.data.JsonReader({
                id: 'idorganismo',
                root: 'data'
            },
            [{
                    name: 'idorganismo'
                }, {
                    name: 'organismo'
                }])
        });

        _this.stOrganosatisface = new Ext.data.Store({
            url: 'listarOrganoSatisface',
            reader: new Ext.data.JsonReader({
                id: 'idorganosatisface',
                root: 'data'
            },
            [{
                    name: 'idorganosatisface'
                }, {
                    name: 'denominacion'
                }])
        });
        _this.stEntidad = new Ext.data.Store({
            url: 'cargarEntidades',
            // autoload: true,
            reader: new Ext.data.JsonReader({
                id: 'identidad',
                root: 'data'
            },
            [{
                    name: 'identidad'
                }, {
                    name: 'entidad'
                }])
        });
        _this.stMoneda = new Ext.data.Store({
            url: 'listarMoneda',
            reader: new Ext.data.JsonReader({
                id: 'idmoneda',
                root: 'data'
            },
            [{
                    name: 'idmoneda'
                }, {
                    name: 'nombremoneda'
                }])
        });
        _this.stCredito = new Ext.data.Store({
            url: '/planificacion/planmeta/index.php/inversiones/listarTipoFinan',
            reader: new Ext.data.JsonReader({
                id: 'idtipofinanciamiento',
                root: 'data'
            },
            [{
                    name: 'idtipofinanciamiento'
                }, {
                    name: 'denominaciontipo'
                }])
        });

        _this.stAddEquipos = new Ext.data.Store({
            url: 'listarIndicadeores',
            reader: new Ext.data.JsonReader({
                root: "data"
            }, [{
                    name: 'idindicador'
                }, {
                    name: 'codigo'
                }, {
                    name: 'nrpieza'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'unidadmedida'
                }, {
                    name: 'preciomn'
                }, {
                    name: 'preciomlc'
                }, {
                    name: 'centrobalance'
                }, {
                    name: 'naturaleza'
                }
            ])
        });

        _this.stVerfinan = new Ext.data.Store({
            url: 'cargarFinanciamiento',
            reader: new Ext.data.JsonReader({
                root: "data"
            }, [{
                    name: 'idfinanciamiento'
                }, {
                    name: 'tipo'
                }, {
                    name: 'financi'
                }, {
                    name: 'valor'
                }, {
                    name: 'moneda'
                }, {
                    name: 'gracia'
                }, {
                    name: 'plazoamortizacion'
                }, {
                    name: 'porcientointeres'
                }
            ])
        });

        _this.stClasificacion = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboClasificacion',
            // autoload: true,
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
        _this.stClasificacion.reload();

        _this.stTipoFinan = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarTipoFinan',
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
            url: '/planificacion/inversiones/index.php/inversiones/listarFinancista',
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
            url: '/planificacion/inversiones/index.php/inversiones/listarMoneda',
            reader: new Ext.data.JsonReader({
                //id: 'idmoneda',
                root: 'data'
            }, [{
                    name: 'denominacion'
                }, {
                    name: 'idmoneda'
                }
            ])
        });

        _this.stProgramaP = new Ext.data.Store({
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
        _this.stProgramaP.reload();

        _this.stPresupuesto = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarPresupuesto',
            reader: new Ext.data.JsonReader({
                id: 'idpresupuesto',
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'idpresanteproy'
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
            url: '/planificacion/inversiones/index.php/inversiones/listarFinanciamiento',
            reader: new Ext.data.JsonReader({
                id: 'idfinanciamiento',
                root: 'data'
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

        _this.store_Erogacion = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarLiquidos',
            reader: new Ext.data.JsonReader({
                id: 'iderogacion',
                root: 'data'
            },
            [{
                    name: 'valor'
                }, {
                    name: 'moneda'
                }, {
                    name: 'iderogacionliquido'
                }])
        });


        _this.stTipoInversion = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboTipoInversion',
            // autoload: true,
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
        _this.stTipoInversion.reload();

        _this.stCaracteristica = new Ext.data.Store({
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
        _this.stCaracteristica.reload();
        _this.stMedioAmbiente = new Ext.data.Store({
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
        });//stMedioAmbiente
        _this.stMedioAmbiente.reload();
        _this.stFormapropiedad = new Ext.data.Store({
            url: 'listarComboFormaPropiedad',
//            autoload: true,
            reader: new Ext.data.JsonReader({
                id: 'idformapropiedad',
                root: 'data'
            }, [{
                    name: 'denominacion'
                }, {
                    name: 'idformapropiedad'
                }])
        });
        _this.stFormapropiedad.reload();
        _this.stComponentes = new Ext.data.Store({
            url: 'getElementos',
//            autoload: true,
            reader: new Ext.data.JsonReader({
                id: 'idnombreetapa',
//                root: 'data'
            }, [{
                    name: 'idnombreetapa'
                }, {
                    name: 'denominacion'
                },
                {
                    name: 'idetapa'
                }])

        });
        _this.stObjetivo = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboObjetivo',
            //autoload: true,
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
        _this.stObjetivo.reload();

        _this.stEfecto = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboEfecto',
            // autoload: true,
            reader: new Ext.data.JsonReader({
                id: 'idefectocomercial',
                root: 'data'
            }, [{
                    name: 'denominacion'
                }, {
                    name: 'idefectocomercial'
                }])
        });
        _this.stEfecto.reload();


        _this.stEstado = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboEfecto',
            // autoload: true,
            reader: new Ext.data.JsonReader({
                id: 'idestado',
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'idestado'
                }])
        });
        _this.stEstado.reload();

        _this.stDesempenno = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboDesempenno',
            // autoload: true,
            reader: new Ext.data.JsonReader({
                id: 'iddatdesempenno',
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'iddatdesempenno'
                }])
        });
        _this.stDesempenno.reload();

        _this.stProvinciaConstructor = new Ext.data.Store({
            url: 'listarProvincias',
            // autoload: true,
            reader: new Ext.data.JsonReader({
                id: 'idprovincia',
                root: 'data'
            },
            [{
                    name: 'provincia'
                }, {
                    name: 'idprovincia'
                }])
        });
        _this.stNiveles = new Ext.data.SimpleStore({
            fields: ['idnivel', 'nivel'],
            data: [[1, 'Genérico'], [2, 'Subgenérico'], [3, 'Específico'], [4, 'Surtido']]

        });

        /* _this.stMonedaRD = new Ext.data.Store({
         url: 'listarMonedaAux',
         // autoload: true,
         reader: new Ext.data.JsonReader({
         root: 'data'
         },
         [{
         name: 'denominacion'
         }, {
         name: 'idmoneda'
         }])
         });*/
        _this.stMonedaRD = new Ext.data.SimpleStore({
            fields: ['idmoneda', 'denominacion'],
            data: [[9900000103, 'Peso Cubano'], [9900000046, 'Peso Convertible']]

        });
        _this.stTamanoLetra = new Ext.data.SimpleStore({
            fields: ['idtamano', 'tamano'],
            data: [[8, '8'], [9, '9'], [10, '10'], [11, '11'], [12, '12'], [13, '13'], [14, '14']]

        });
        _this.stTipoLetra = new Ext.data.SimpleStore({
            fields: ['idletra', 'tipoLetra'],
            data: [[8, 'Arial'], [9, 'Tahoma'], [10, 'Calibri'], [11, 'Verdana'], [12, 'Times New Roman']]
        });

        _this.stComprarPlan = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboComprar',
            reader: new Ext.data.JsonReader({
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'idcomprar'
                }])
        });
        _this.stAdquirirexcel = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboAdquisicion',
            reader: new Ext.data.JsonReader({
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'idadquisicion'
                }])
        });
        _this.stModeloPlan = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/listarComboModelo',
            reader: new Ext.data.JsonReader({
                id: 'identidadmodelo',
                root: 'data'
            },
            [{
                    name: 'identidadmodelo'
                }, {
                    name: 'denominacion'
                }])
        });



    }
};
