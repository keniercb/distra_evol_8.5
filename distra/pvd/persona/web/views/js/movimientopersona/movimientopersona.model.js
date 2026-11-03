Ext.QuickTips.init();
Ext.ns('Ext.Persona');

Ext.Persona.Model = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function () {

        this.stListPersonas = new Ext.data.GroupingStore({
            url: 'getPersonasInCargo',
            reader: new Ext.data.JsonReader({
                totalProperty: "quantity",
                root: "data"
            }, [
                {
                    name: 'idsituacionlaboralp', type: 'int'
                },
                {
                    name: 'idpersonaentidad', type: 'int'
                },
                {
                    name: 'idpersona', type: 'int'
                },
                {
                    name: 'identidad', type: 'int'
                },
                {
                    name: 'idcargo', type: 'int'
                },
                {
                    name: 'idarea', type: 'int'
                },
                {
                    name: 'denomentidad', mapping: 'entidad'
                },
                {
                    name: 'denomarea', mapping: 'area'
                },
                {
                    name: 'denomcargo', mapping: 'cargo'
                },
                {
                    name: 'falta'
                },
                {
                    name: 'fbaja'
                },
                {
                    name: 'fdesde'
                },
                {
                    name: 'fhasta'
                },
                {
                    name: 'ruta'
                },
                {
                    name: 'rutaids'
                },
                {
                    name: 'salario'
                },
                {
                    name: 'categoria'
                },
                {
                    name: 'grupocomplejidad'
                },
                {
                    name: 'numid'
                },
                {
                    name: 'nombreapellidos'
                },
                {
                    name: 'sexo', type: 'int'
                },
                {
                    name: 'foto'
                },
                {
                    name: 'idsituacion', type: 'int'
                },
                {
                    name: 'denomsituacion'
                },
                {
                    name: 'color'
                },
                {
                    name: 'idprocedenciasocial', type: 'int'
                },
                {
                    name: 'denomprocedenciasocial'
                },
                {
                    name: 'idmotivobaja', type: 'int'
                },
                {
                    name: 'denommotivobaja'
                }
            ]),
            sortInfo: {field: 'idcargo', direction: "DESC"},
            groupField: 'ruta'
        });

        this.stListPersonasHist = new Ext.data.GroupingStore({
            url: 'getHistorico',
            reader: new Ext.data.JsonReader({
                totalProperty: "quantity",
                root: "data"
            }, [
                {
                    name: 'idsituacionlaboralp', type: 'int'
                },
                {
                    name: 'idpersonaentidad', type: 'int'
                },
                {
                    name: 'idpersona', type: 'int'
                },
                {
                    name: 'identidad', type: 'int'
                },
                {
                    name: 'idcargo', type: 'int'
                },
                {
                    name: 'idarea', type: 'int'
                },
                {
                    name: 'denomentidad', mapping: 'entidad'
                },
                {
                    name: 'denomarea', mapping: 'area'
                },
                {
                    name: 'denomcargo', mapping: 'cargo'
                },
                {
                    name: 'falta'
                },
                {
                    name: 'fbaja'
                },
                {
                    name: 'fdesde'
                },
                {
                    name: 'fhasta'
                },
                {
                    name: 'numid'
                },
                {
                    name: 'nombreapellidos'
                },
                {
                    name: 'sexo', type: 'int'
                },
                {
                    name: 'foto'
                },
                {
                    name: 'idsituacion', type: 'int'
                },
                {
                    name: 'denomsituacion'
                },
                {
                    name: 'color'
                },
                {
                    name: 'idprocedenciasocial', type: 'int'
                },
                {
                    name: 'denomprocedenciasocial'
                },
                {
                    name: 'idmotivobaja', type: 'int'
                },
                {
                    name: 'denommotivobaja'
                }
            ]),
            sortInfo: {field: 'idpersona', direction: "DESC"},
            groupField: 'idpersona'
        });

        this.stListadoPersonaAlta = new Ext.data.Store({
            url: 'getPersonasInCargo',
            baseParams: {
                acciones: 1
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "quantity",
                root: "data",
                id: "idpersona"
            }, [
                {
                    name: 'idpersona'
                },
                {
                    name: 'nombreapellidos'
                },
                {
                    name: 'sexo', type: 'int'
                },
                {
                    name: 'denomsexo'
                },
                {
                    name: 'numid'
                },
                {
                    name: 'foto'
                },
                {
                    name: 'fechanacimiento'
                },
                {
                    name: 'annos', type: 'int'
                }
            ])
            //sortInfo: {field: 'idreservacargo', direction: "DESC"},
            //groupField: 'idreservacargo'
        });

        this.stRegisterAlta = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'id', type: 'int'
                },
                {
                    name: 'numid', type: 'string'
                },
                {
                    name: 'nombreapellidos', type: 'string'
                },
                {
                    name: 'denomsituacion', type: 'string'
                },
                {
                    name: 'denomcargo', type: 'string'
                },
                {
                    name: 'fdesde'
                },
                {
                    name: 'fhasta'
                },
                {
                    name: 'idprocedenciasocial'
                },
                {
                    name: 'denomprocedenciasocial'
                },
                {
                    name: 'idmotivobaja'
                },
                {
                    name: 'denommotivobaja'
                },
                {
                    name: 'ruta'
                }
            ]
        });

        this.stPersonaReserva = new Ext.data.GroupingStore({
            url: 'getReservaCargo',
            reader: new Ext.data.JsonReader({
                totalProperty: "quantity",
                root: "data"
            }, [
                {
                    name: 'idpersona', type: 'int'
                },
                {
                    name: 'idreservacargo', type: 'int'
                },
                {
                    name: 'nombreapellidos'
                },
                {
                    name: 'sexo', type: 'int'
                },
                {
                    name: 'denomsexo'
                },
                {
                    name: 'numid'
                },
                {
                    name: 'foto'
                },
                {
                    name: 'fdesde'
                },
                {
                    name: 'fhasta'
                },
                {
                    name: 'idcargo'
                },
                {
                    name: 'denomcargo'
                },
                {
                    name: 'ruta'
                },
                {
                    name: 'annos', type: 'int'
                }
            ]),
            sortInfo: {field: 'nombreapellidos', direction: "DESC"},
            groupField: 'ruta'
        });
    }
};