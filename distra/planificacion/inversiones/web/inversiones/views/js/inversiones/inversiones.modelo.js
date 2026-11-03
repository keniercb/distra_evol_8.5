Ext.ns('Gestionar.inversiones');


Gestionar.inversiones.Modelo = {
    init: function() {
        var vista = Gestionar.inversiones.Vista;
        _this = this;

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

        _this.simstTipoexcel = new Ext.data.SimpleStore({
            fields: [
                {name: 'tipoexcel'},
                {name: 'nombreexcel'}
            ]
        });

        _this.loaderDatosNomencl = new Ext.tree.TreeLoader({
            dataUrl: 'cargarDatosNomencladores',
            autoLoad: true
        });
        _this.stClasificacion = new Ext.data.Store({
            url: 'listarComboClasificacion',
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
            url: 'listarTipoFinan',
            reader: new Ext.data.JsonReader({
                root: 'data'
            },
            [{
                    name: 'denominaciontipo'
                }, {
                    name: 'idtipofinanciamiento'
                }])
        });
        _this.stFinancista = new Ext.data.Store({
            url: 'listarFinancista',
            reader: new Ext.data.JsonReader({
                root: 'data'
            },
            [{
                    name: 'denominaciontipo'
                }, {
                    name: 'idfinancista'
                }])
        });
        _this.stMonedasEValor = new Ext.data.Store({
            //url: 'listarMoneda',
            url: 'listarTodosDatosMoneda',
            reader: new Ext.data.JsonReader({
                id: 'idmonedaentidad',
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'idmonedaentidad'
                }, {
                   name: 'moneda'
            }])
        });

        _this.stMonedas = new Ext.data.Store({
            url: 'listarMoneda',
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

        _this.stImportacion = new Ext.data.Store({
            url: 'listarLiquidos',
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

        _this.stPresupuesto = new Ext.data.Store({
            url: 'listarPresupuesto',
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
        _this.store_Financiamiento = new Ext.data.Store({
            url: 'listarFinanciamiento',
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
        _this.store_Financiamiento1 = new Ext.data.Store({
            url: 'listarFinanciamiento',
            reader: new Ext.data.JsonReader({
                root: 'data',
                autoload: true
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
                }])
        });


        _this.stCambioEstado = new Ext.data.Store({
            url: 'listarEstados',
            reader: new Ext.data.JsonReader({
                root: 'data'
            },
            [{
                    name: 'deno'
                }, {
                    name: 'idestadosft'
                }, {
                    name: 'idestadoflujotrabajo'
                }, {
                    name: 'idflujotrabajo'
                }]),
            listeners: {
                load: function(t, n, e) {
                    if (t.getCount() == 0) {
                        mostrarMensaje(1, perfil.etiquetas.tlCambio);
                    }
                }
            },
        });


        _this.stModelo = new Ext.data.Store({
            url: 'listarComboModelo',
            reader: new Ext.data.JsonReader({
                id: 'idequipoplan',
                root: 'data'
            },
            [{
                    name: 'idequipoplan'
                }, {
                    name: 'denominacion'
                }])
        });

        _this.store_addEquipos = new Ext.data.Store({
            url: 'listarIndicadores',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'idindicador'
                }, {
                    name: 'codigo'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'preciomn'
                }, {
                    name: 'preciomlc'
                }, {
                    name: 'donante'
                }, {
                    name: 'idejercicio'
                }, {
                    name: 'idumedida'
                }, {
                    name: 'denoum'
                }, {
                    name: 'abreviaturaum'
                }, {
                    name: 'numeropieza'
                }, {
                    name: 'preciodivisa'
                }, {
                    name: 'precio'
                }, {
                    name: 'naturaleza'
                }, {
                    name: 'idnaturaleza'
                }, {
                    name: 'idcentrobalance'
                }, {
                    name: 'denocentrobalance'
                }, {
                    name: 'identidad'
                }])
        });
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
                }])
        });
        _this.store_gequipos = new Ext.data.Store({
            url: 'CargarEquipos',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                //id: 'idindicador'
                id: 'idetapaequipos'
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
                    name: 'denominacion'
                }, {
                    name: 'codigo'
                }, {
                    name: 'numeropieza'
                }, {
                    name: 'idetapaequipos'
                }, {
                    name: 'idindicador'
                }, {
                    name: 'idadquisicion'
                }, {
                    name: 'idcomprar'
                }, {
                    name: 'via'
                }, {
                    name: 'orgrect'
                }, {
                    name: 'observaciones'
                }, {
                    name: 'adquirir'
                }, {
                    name: 'comprar'
                }, {
                    name: 'identidadmodelo'
                }, {
                    name: 'idequipoplan'
                }, {
                    name: 'pais'
                }, {
                    name: 'idcomprarpais'
                }])
        });
        _this.stConstructoresEtapa = new Ext.data.Store({
            url: 'cargarConstructoresByidetapa',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'total'
            }, [{
                    name: 'idconstructor'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'denomdpt'
                }, {
                    name: 'iddpt'
                }, {
                    name: 'idetapinverconsprov'
                }, {
                    name: 'idetapainversion'
                }
            ])
        });
        _this.stConstructores = new Ext.data.Store({
            url: 'cargarConstructores',
            reader: new Ext.data.JsonReader({
                root: 'data'
               // totalProperty: 'total'
            }, [{
                    name: 'idconstructor'
                }, {
                    name: 'denomconstructor'
                }
            ])
        });
		
        _this.stnuevo = new Ext.data.SimpleStore({
            fields: ['idnuevo', 'nuevo'],
            data: [[1, 'Si'], [0, 'No']]
        });

        _this.stDpt = new Ext.data.SimpleStore({
            fields: ['idProv', 'Provincia']
        });

        _this.stdonante = new Ext.data.SimpleStore({
            fields: ['iddonante', 'donacion'],
            data: [
                [1, 'Si'],
                [0, 'No']]
        });


        _this.store_gestionar_parametros = new Ext.data.Store({
            url: 'listarDatos',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'total'
            }, [{
                    name: 'header'
                }, {
                    name: 'dataIndex'
                }])
        });
        _this.store_gestionar_inversiones = new Ext.data.Store({
            url: ' cargarInversiones',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                id: 'idinversion'
            }, [{
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
                    name: 'forma'
                }, {
                    name: 'provincia'
                }, {
                    name: 'idprovincia'
                }, {
                    name: 'fechainicio'
                }, {
                    name: 'fechafin'
                }, {
                    name: 'objetivo'
                }, {
                    name: 'efecto'
                }, {
                    name: 'idestadoaprobacion'
                }, {
                    name: 'fasttrack'
                }, {
                    name: 'idinversion'
                }, {
                    name: 'nomestado'
                }, {
                    name: 'nomestadoce'
                }, {
                    name: 'idcaracteristica'
                }, {
                    name: 'idestadoinversion'
                }, {
                    name: 'idtipoinversion'
                }, {
                    name: 'idestadoce'
                }, {
                    name: 'idefectocomercial'
                }, {
                    name: 'idformapropiedad'
                }, {
                    name: 'idtipoinversionprograma'
                }, {
                    name: 'idestado'
                }, {
                    name: 'idobjetivo'
                }, {
                    name: 'idcumplimientoinversion'
                }, {
                    name: 'observaciones'
                }, {
                    name: 'analpostinversiones'
                }, {
                    name: 'iddatdesempenno'
                }, {
                    name: 'desempenno'
                }, {
                    name: 'idejercicio'
                }, {
                    name: 'idestructuracomun'
                }, {
                    name: 'estructura'
                }, {
                    name: 'idprograma'
                }, {
                    name: 'programa'
                }, {
                    name: 'cuadrada'
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
                },{
                    name: 'idcontenido'
                },{
                    name: 'cartera'
                },{
                    name: 'factibilidad'
                },{
                    name: 'idmedioambiente'
                },{
                    name: 'medioambiente'
                },{
                    name: 'nompreparacion'
                }, {
                    name: 'fechamax'
                }, {
                    name: 'fechamin'
                }, {
                    name: 'bloqueada'
                }])
            });
        _this.store_gestionar_componentes = new Ext.data.Store({
            url: ' cargarComponentes',
            reader: new Ext.data.JsonReader({
                root: "data",
                totalProperty: 'total',
                id: 'idetapa'
            }, [{
                    name: 'idinversion'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'estado'
                }, {
                    name: 'idflujotrabajo'
                }, {
                    name: 'idetapa'
                }, {
                    name: 'idcomponente'
                }, {
                    name: 'idestadosft'
                }, {
                    name: 'idestadoinicial'
                }, {
                    name: 'idestadofinal'
                }, {
                    name: 'idtransicion'
                }, {
                    name: 'orden'
                }, {
                    name: 'idestadoflujotrabajo'
                }
            ]),
            listeners: {
                beforeload: function(t, n) {
                    t.baseParams.identidad = idorganismo;
                    t.baseParams.idinversion = (vista.sm_inversiones.getSelections().length > 0) ? vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idinversion : 0;
                    t.baseParams.idejercicio = vista.cmbEjercicio.getValue();
                }
            }
        });

       /* _this.store_gestionar_nivelesactividad = new Ext.data.Store({
            url: 'listarActsNivAct',
            reader: new Ext.data.JsonReader({
                root: "data",
                totalProperty: 'total',
                id: 'codigo'
            }, [ {
                name: 'denominacion'
            }, {
                name: 'codigo'
            }, {
                name: 'nivelactividadinversion'
            }, {
                name: 'idetapainversionactespcomportamiento'
            }, {
                name: 'idactespcomportamiento'
            }
            ]),
            listeners: {
                beforeload: function(t, n) {
                    t.baseParams.identidad = idorganismo;
                    t.baseParams.idetapa = (vista.sm_componentes.getSelections().length > 0) ? vista.grid_gestionar_componentes.getSelectionModel().getSelected().data.idetapa : 0;
                    t.baseParams.idejercicio = vista.cmbEjercicio.getValue();
					t.baseParams.is_leaf = vista.isLeaf;
					t.baseParams.start= 0;
                    t.baseParams.limit= 20;

                }
            }
        });*/

        _this.store_gestionar_elementos = new Ext.data.Store({
            url: ' cargarElementos',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            }, [{
                    name: 'idelemento'
                }, {
                    name: 'docasociados'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'parametrosdinamicos'
                }, {
                    name: 'idcomponente'
                }, {
                    name: 'tipomodelo'
                }, {
                    name: 'documento'
                }, {
                    name: 'idetapa'
                }, {
                    name: 'idetapaelementoinversion'
                }, {
                    name: 'idetapainversion'
                }, {
                    name: 'iddocumentos'
                }, {
                    name: 'idcontenido'
                }
            ])
        });
        _this.store_gestionar_elementos_der = new Ext.data.Store({
            url: ' listarValor',
            reader: new Ext.data.JsonReader({
                root: "data",
                id: "idelementovalor"
            }, [{
                    name: 'idelementovalor'
                }, {
                    name: 'valor'
                }, {
                    name: 'moneda'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'idmonedaentidad'
                }, {
                    name: 'idelemento'
                }, {
                    name: 'pintar'
                }])
        });

        _this.store_gestionar_documentos = new Ext.data.Store({
            url: ' Verdocumento',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                id: 'idelementodoc'
            }, [{
                    name: 'idelementodoc'
                }, {
                    name: 'iddocumentos'
                }, {
                    name: 'idelementodocgestordoc'
                }, {
                    name: 'idetapaelementoinversion'
                }, {
                    name: 'idcontenido'
                }, {
                    name: 'denominacion'
                }])
        });

        _this.store_Tiposdocumentos_factibilidad = new Ext.data.Store({
            url: ' GetDocumentosFactibilidadByInversion',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                id: 'idinversionestfact'
            }, [{
                name: 'idinversionestfact'
            },{
                name: 'fechacreacion'
            },{
                name: 'idinversion'
            }, {
                name: 'idcontenido'
            }, {
                name: 'denominacion'
            }, {
                name: 'vigente'
            }])
        });

        _this.store_verdoc = new Ext.data.Store({
            url: ' verEspacioTrabajo',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                id: 'idelementodoc'
            }, [{
                    name: 'idelementodoc'
                }, {
                    name: 'iddocumentos'
                }, {
                    name: 'idelementodocgestordoc'
                }, {
                    name: 'idetapaelementoinversion'
                }, {
                    name: 'idcontenido'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'contenido'
                }])
        });

        _this.stUnidadMedida = new Ext.data.Store({
            url: 'listarUnidadmedida',
            reader: new Ext.data.JsonReader({
                id: 'idunidadmedida',
                root: 'data'
            },
            [{
                    name: 'denominacionunidadmedida'
                }, {
                    name: 'idunidadmedida'
                }])
        });
        _this.stCentroBalance = new Ext.data.Store({
            url: 'ListarComboCentrobalance',
            reader: new Ext.data.JsonReader({
                id: 'identidaddatosnomenclador',
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'identidaddatosnomenclador'
                }])
        });

        _this.stAdquisicion = new Ext.data.Store({
            url: 'listarComboAdquisicion',
            reader: new Ext.data.JsonReader({
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'idadquisicion'
                }])
        });

        _this.stComprar = new Ext.data.Store({
            url: 'listarComboComprar',
            reader: new Ext.data.JsonReader({
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'idcomprar'
                }])
        });
    }
};