/**
 * GestionarAnticipoDienta.Controller
 *
 * @author Ing. Roberto Linares Zamora
 * @version 1.0
 */

Ext.ns('Caja.DietaNacional');
Caja.DietaNacional.Model = {
    init: function (cargainicial) {
        this.stAnticipos = new Ext.data.Store({
            url: 'cargaranticipos',
            baseParams: {cargainicial: cargainicial},
            reader: new Ext.data.JsonReader({
                id: 'idrgrid',
                root: 'results',
                totalProperty: 'cantidad_filas'
            }, [{
                name: 'idanticipoviajenacional',
                mapping: 'idmovimiento'
            }, {
                name: 'nombreyapellidos',
                mapping: 'fullname'
            }, {
                name: 'numero'
            }, {
                name: 'idmovimientocaja'
            }, {
                name: 'fechaanticipo'
            }, {
                name: 'numcomprobante',
            }, {
                name: 'idpersona'
            }, {
                name: 'clasificacion'
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
                name: 'fechasalidaLiq'
            }, {
                name: 'horaestimadasalida',
                mapping: 'horaviaje'
            }, {
                name: 'diasestimadoviaje'
            }, {
                name: 'diasestimadoviajeLiq'
            }, {
                name: 'diasestimadohospedado'
            }, {
                name: 'diasestimadohospedadoLiq'
            }, {
                name: 'fechaemision'
            }, {
                name: 'tipodieta'
            }, {
                name: 'nomtipodieta'
            }, {
                name: 'idoperacion'
            }, {
                name: 'operacion'
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
                name: 'estadoAnt'
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
            },{
                name: 'showCmp'
            },{
                name: 'importeTotalGatosIslaAzul'
            },
            ])
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
            data: [[8, 'Guardado'], [5, 'Confirmado'], [6, 'Posteado'], [9, 'Liquidado'], [3, 'Reembolsado'], [7, 'Cancelado']]
        });

        this.stcbclasificacion = new Ext.data.SimpleStore({
            fields: ['idclasificacion', 'nombre'],
            data: [[1, 'Fuera de la localidad'], [2, 'Dentro de la localidad']/*, [3, 'Fijas']*/]
        });

        this.stOperaciones = new Ext.data.Store({
            url: 'cargarOperaciones',
            scope: this,
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
            },
                {
                    name: 'motivo',
                    mapping: 'descripcion'
                }
            ]),
            sortInfo: {
                field: 'motivo',
                direction: 'ASC'
            }
        });
    }
};