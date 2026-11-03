/**
 * GestionarAnticipoDienta.Controller
 *
 * @author Ing. Roberto Linares Zamora
 * @version 1.0
 */

Ext.ns('Caja.DietaExt');
Caja.DietaExt.Model = {
    init: function (cargainicial) {
        this.stAnticipos = new Ext.data.Store({
            url: 'cargaranticipos',
            baseParams: {cargainicial: cargainicial},
            reader: new Ext.data.JsonReader({
                id: 'idrgrid',
                root: 'results',
                totalProperty: 'cantidad_filas'
            }, [{
                name: 'idanticipoviajeextranjero',
                mapping: 'idmovimiento',
            }, {
                name: 'nombreyapellidos',
                mapping: 'fullname'
            }, {
                name: 'numero'
            }, {
                name: 'idmovimientocaja'
            }, {
                name: 'idanticipoviajeextranjero'
            }, {
                name: 'idanticipoviajeextranjeropais'
            }, {
                name: 'idmoneda'
            }, {
                name: 'idtasa'
            }, {
                name: 'idpais'
            }, {
                name: 'nompais'
            }, {
                name: 'fechaanticipo'
            }, {
                name: 'numcomprobante',
            }, {
                name: 'idpersona'
            }, {
                name: 'importemo'
            }, {
                name: 'importemb'
            }, {
                name: 'importeLiqmo'
            }, {
                name: 'idcajero'
            }, {
                name: 'cajero'
            }, {
                name: 'fechasalida'
            }, {
                name: 'fechaemision'
            }, {
                name: 'idoperacion'
            }, {
                name: 'operacion'
            }, {
                name: 'horaestimadasalida',
                mapping: 'horaviaje'
            }, {
                name: 'diasestimadoviaje'
            }, {
                name: 'diasestimadohospedado',
            }, {
                name: 'laborarealizar'
            }, {
                name: 'alimentacion'
            }, {
                name: 'hospedaje'
            }, {
                name: 'desayunoyotros'
            }, {
                name: 'transporte'
            }, {
                name: 'idautoriza'
            }, {
                name: 'autoriza'
            }, {
                name: 'idestado'
            }, {
                name: 'estado'
            }, {
                name: 'iddocumento'
            }, {
                name: 'idanota'
            }, {
                name: 'anota'
            }, {
                name: 'idarea'
            }, {
                name: 'area'
            }, {
                name: 'idcargo'
            }, {
                name: 'cargo'
            }, {
                name: 'fechavencimiento'
            }, {
                name: 'numeroMostrar'
            }, {
                name: 'cargainicial'
            }, {
                name: 'idcentrocosto'
            }, {
                name: 'centrocosto'
            }])
        });

        this.stnombreapell = new Ext.data.Store({
            reader: new Ext.data.DataReader({
                id: 'stnombreapell'
            }, [{
                name: 'idnombreyapellidos'
            }, {
                name: 'persona'
            }
            ])
        });

        this.stEstado = new Ext.data.SimpleStore({
            fields: ['idestado', 'estado'],
            data: [[8, 'Guardado'], [2, 'Aprobado'], [6, 'Posteado'], [7, 'Cancelado'], [1, 'Terminado'], [9, 'Liquidado']]
        });

        this.stcbclasificacion = new Ext.data.SimpleStore({
            fields: ['idclasificacion', 'nombre'],
            data: [[1, 'Fuera de la localidad'], [2, 'Dentro de la localidad'], [3, 'Fijas']]
        });

        this.stOperaciones = new Ext.data.Store({
            url: 'cargarOperaciones',
            reader: new Ext.data.JsonReader({}, [
                {
                    name: 'idnomoperaciones'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'cuentagasto'
                }
            ]),
            autoLoad: false
        });

        this.stPersona = new Ext.data.Store({
            url: 'cargarPersona',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            }, [
                {
                    name: 'idpersona'
                },
                {
                    name: 'nombre'
                },
                {
                    name: 'tipo'
                },
                {
                    name: 'denomtipo'
                }
            ])
        });

        this.stAutoriza = new Ext.data.Store({
            url: 'personaautoriza',
            reader: new Ext.data.JsonReader({
                //root: 'datos',
                //totalProperty: 'cantidad'
            }, [
                {
                    name: 'idpersona'
                },
                {
                    name: 'nombre'
                }
            ]),
            autoLoad: true
        });

        this.stMotivo = new Ext.data.Store({
            url: 'cargarmotivocancelacion',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idmotivocancelacion'
            }, [{
                name: 'idmotivocancelacion',
                mapping: 'idmotivocancelacion',
                type: 'string'
            }, {
                name: 'motivo',
                mapping: 'descripcion'
            }
            ]),
            sortInfo: {
                field: 'motivo',
                direction: 'ASC'
            }
        });

        this.stPais = new Ext.data.Store({
            url: 'obtenerPaises',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idpais'
            }, [{
                name: 'idpais',
                type: 'int'
            }, {
                name: 'siglas',
                type: 'string'
            }, {
                name: 'nombrepais',
                type: 'string'
            }
            ]),
            sortInfo: {
                field: 'nombrepais',
                direction: 'ASC'
            },
            autoLoad: true
        });

        this.stInstrumento = new Ext.data.Store({
            url: 'obtenerInstrumentosBanco',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                name: 'iddocumento',
                type: 'string'
            }, {
                name: 'nominstrumento',
                type: 'string'
            }, {
                name: 'importe',
                type: 'float'
            }
            ]),
            sortInfo: {
                field: 'nominstrumento',
                direction: 'ASC'
            },
            // autoLoad: true
        });

    }
};