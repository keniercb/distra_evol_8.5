Ext.ns('Pvd.Nomina.Pagos.GestionarCargosOcupados');

//Modelo de la vista del componente Gestionar cargos ocupados.
Pvd.Nomina.Pagos.GestionarCargosOcupados.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function () {
        //Store del listado de cargos ocupados.
        this.stCargosOcupados = new Ext.data.Store({
            url: 'obtenerCargosOcupados',
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                    id: "idcargosocupados"
                },
                [{name: 'idcargosocupados'}, {name: 'idpersona'}, {name: 'idcargo'}, {name: 'identidad'}, {name: 'fecharegistro'}, {name: 'fechaaplicacion'}, {name: 'fechavencimiento'}, {name: 'observaciones'}, {name: 'idsituacionlaboral'}, {name: 'denomcargo'}, {name: 'denomcargoiconos'}, {name: 'caminocargo'}, {name: 'denomsituacionlaboral'}, {name: 'path'}, {name: 'idcajacajero'}, {name: 'idplantillanominal'}
                    //,{name: 'idcentrogrupo'}
                    , {name: 'denomcentrocosto'}, {name: 'idpersonacuentabancariamn'}, {name: 'cuentabancariamn'}, {name: 'idpersonacuentabancariacuc'}, {name: 'cuentabancariacuc'}, {name: 'cuentabancariacuc'}, {name: 'numerocontable'}, {name: 'idcentrocosto'}, {name: 'denomccosto'}, {name: 'plantilla'}

                ])
        });

        //Store del listado de cargos ocupados historico.
        this.stCargosOcupadosHistorico = new Ext.data.Store({
            url: 'obtenerHistorialCargosOcupados',
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                    id: "idhiscargosocupados"
                },
                [{name: 'idhiscargosocupados'}, {name: 'idpersona'}, {name: 'idcargo'}, {name: 'identidad'}, {name: 'fecharegistro'}, {name: 'fechaaplicacion'}, {name: 'fechavencimiento'}, {name: 'observaciones'}, {name: 'idsituacionlaboral'}, {name: 'denomcargo'}, {name: 'caminocargo'}, {name: 'denomsituacionlaboral'}, {name: 'idcajacajero'}, {name: 'idplantillanominal'}, {name: 'denomcentrocosto'}, {name: 'idpersonacuentabancaria'}
                ])
        });

        this.stCuentaBanc = new Ext.data.GroupingStore({
            url: '/pvd/nomina/index.php/gestionarcargosocupados/obtenerCuentaBanc',
            groupField: 'denomtipomoneda',
            sortInfo: {field: 'tipomoneda', direction: "DESC"},
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    root: "datos",
                    id: "idpersonacuentabancaria"
                },
                [{name: 'idpersonacuentabancaria'},
                    {name: 'denomtipomoneda'},
                    {name: 'numerocuenta'},
                    {name: 'tipomoneda'},
                    {name: 'idtipoacreditacionsalario'},
                    {name: 'denomcodtipoid'},

                ])
        });

        // this.storeCodTipoId = new Ext.data.SimpleStore({
        //     fields: [
        //         {name: 'codtipoid'}
        //         ,
        //         {name: 'denomcodtipoid'}
        //     ],
        //     data  : [
        //         [1, 'CI'],
        //         [2, 'CM'],
        //         [3, 'CP']
        //     ]
        //
        // });

        this.storeCodTipoId = new Ext.data.Store({
            url: '/pvd/nomina/index.php/gestionarcargosocupados/getCodigo',

            reader: new Ext.data.JsonReader({
                    root: "datos",
                    autoLoad: true,
                    totalProperty: "cantidad",
                    id: "idtipoacreditacionsalario"
                },
                [{name: 'idtipoacreditacionsalario'}, {name: 'denomcodtipoid'}
                ])

        });

        this.stNumerocontable = new Ext.data.GroupingStore({
            url: '/pvd/nomina/index.php/gestionarcargosocupados/getNumeroContable',
            //groupField:'denomtipomoneda',
            //sortInfo:{field: 'tipomoneda', direction: "DESC"},
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    root: "datos",
                    id: "idpersonacdgocontable"
                },
                [{name: 'idpersonacdgocontable'}, {name: 'cdgocontable'}

                ])
        });

        this.storeTipoPago = new Ext.data.Store({
            url: '/pvd/nomina/index.php/gestionarcargosocupados/obtTiposPago',
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                    id: "idtiponomina"
                },
                [{name: 'idtiponomina'}, {name: 'denominacion'}, {name: 'tipomoneda'}
                ])
        });

        //Store del combobox situacion laboral.
        this.stSituacionLaboral = new Ext.data.SimpleStore({
            fields: [{name: 'idsituacionlaboral'}, {name: 'denominacion'}, {name: 'descripcion'}, {name: 'asociadoalcargo'}]
        });

        //Store del combobox cuenta de la persona.
        this.stcbCuenta = new Ext.data.Store({
            url: 'obtenerCuentasPersona',
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                    id: "idpersonacuentabancaria"
                },
                [{name: 'idpersonacuentabancaria'}, {name: 'checked'}, {name: 'numerocuenta'}, {name: 'descripcion'}
                ])
        });

        //Store dale grid de las  plantillas nominales.
        this.stcbPlantillasNominales = new Ext.data.Store({
            url: 'obtenerPlantillasNominales',
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                    id: "idplantillanominal"
                },
                [{name: 'idplantillanominal'}, {name: 'denominacion'}
                ])
        });

        //Store de las personas de las plantillas nominales.
        this.stcbPersonasPlantillasNominales = new Ext.data.GroupingStore({
            url: 'obtenerPersonasPlantillasNominales',
            groupField: 'denominacionplantilla',
            baseParams: {tipo: this.tipo, idelemento: -1},
            sortInfo: {field: 'nombreyapellidos', direction: "DESC"},
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idpersona"
            }, [{name: 'idpersona'}, {name: 'nombreyapellidos'}, {name: 'denominacionplantilla'}, {name: 'numerocontablepersona'}
            ])
        });

        //Store del combobox tipo de pago de la persona.
        this.stcbCajaCajero = new Ext.data.Store({
            url: 'obtenerTipoPago',
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                    id: "idcajacajero"
                },
                [{name: 'idcajacajero'}, {name: 'denominacion'}
                ])
        });
        this.stcbCajaCajero.load();

        //Store del combobox plantilla nominal en el cual esa persona va a formar parte de acuerdo a la situacion laboral que tiene.
        this.stcbPlantillaNominal = new Ext.data.Store({
            url: 'obtenerplantillasnominal',
            params: {identidad: null},
            reader: new Ext.data.JsonReader({
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idplantillanominal"
                },
                [{name: 'idplantillanominal'}, {name: 'denomcentrocosto'}
                ])
        });

        //Store del combobox plantilla nominal en el cual esa persona va a formar parte de acuerdo a la situacion laboral que tiene.
        this.stcbCentroCosto = new Ext.data.Store({
            url: 'obtenerCentrocosto',
            params: {identidad: null},
            reader: new Ext.data.JsonReader({
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idcentrocosto"
                },
                [{name: 'idcentrocosto'}, {name: 'denomccosto'}
                ])
        });

        this.CargarPlantillasNominal = function (pidentidad) {
            this.stcbPlantillaNominal.baseParams.identidad = pidentidad;
            this.stcbPlantillaNominal.baseParams.sistema = 'minfar';
            this.stcbPlantillaNominal.load();
        }

        this.CargarCentrocosto = function (pidentidad) {
            this.stcbCentroCosto.baseParams.identidad = pidentidad;
            //this.stcbPlantillaNominal.baseParams.sistema = 'minfar';
            this.stcbCentroCosto.load();
        }

        this.cargarModelo = function (model) {
            var a = new Array();
            for (var i = 0; i < model.length; i++) {
                var t = new Array();
                t[0] = model[i].idsituacionlaboral;
                t[1] = model[i].denominacion;
                t[2] = model[i].descripcion;
                t[3] = model[i].asociadoalcargo;
                a[i] = t;
            }
            this.stSituacionLaboral.loadData(a);
        }
    }
};

