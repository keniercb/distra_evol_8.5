/**
 * GestionarReembolso.Controller
 *
 * @author Ing. Roberto Linares Zamora
 * @version 1.0
 */

Ext.ns('Caja.Operaciones.Reembolso');
Caja.Operaciones.Reembolso.Model = {
    init: function() {
        this.stReembolso = new Ext.data.Store({
            url: 'cargarReembolso',
            reader: new Ext.data.JsonReader({
                    root: 'datos',
                    id: 'iddocumento',
                    totalProperty: 'cant'
                },
                [{
                    name: 'fecha'
                }, {
                    name: 'idtipodocumento'
                }, {
                    name: 'tipodoc'
                }, {
                    name: 'numero'
                }, {
                    name: 'iddocumento'
                }, {
                    name: 'idmovimientocaja'
                }, {
                    name: 'idmovimiento'
                }, {
                    name: 'importemo'
                }, {
                    name: 'elaboradopor'
                }, {
                    name: 'idestado'
                }, {
                    name: 'estadoEnBanco'
                }, {
                    name: 'estado'
                }, {
                    name: 'comentario'
                }, {
                    name: 'numcomprobante'
                }, {
                    name: 'showCmp'
                }, {
                    name: 'idcuentacontable'
                }
                ])
        });

        this.stDocumento = new Ext.data.Store({
            url: 'cargarDocumentos',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                name: 'fecha'
            }, {
                name: 'numero'
            }, {
                name: 'iddoc'
            }, {
                name: 'idtipodoc'
            }, {
                name: 'marcar'
            }, {
                name: 'tipodoc'
            }, {
                name: 'importe'
            }, {
                name: 'idestado'
            }
            ])
        });

        this.stEstado = new Ext.data.SimpleStore({
            fields: ['idestado', 'estado'],
            data: [
                [8, 'Guardado'],
                [5, 'Confirmado'],
                /*[3, 'Reembolsado'],*/
                [7, 'Cancelado'],
            ]
        });

        this.stMotivo = new Ext.data.Store({
            url: 'cargarMotivocanCelacion',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idmotivocancelacion',
            }, [{
                name: 'idmotivocancelacion',
                mapping: 'idmotivocancelacion'
            }, {
                name: 'motivo',
                mapping: 'descripcion'
            }
            ])
        });
    }
};