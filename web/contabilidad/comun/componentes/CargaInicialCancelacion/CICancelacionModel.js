Ext.namespace('Ext.CICancelacion');
Ext.CICancelacion.Model = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    constructor: function(params)
    {
        this.initializeModel();
        Ext.CICancelacion.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
    },
    initializeRecords: function () {

        // this.recordGridRecargaFincimex = new Ext.data.Record.create([
        //     {name: 'idsync', mapping: 'idsync'},//de aka tengo los id tarjeta de los dos
        //     {name: 'idrecargafincimexsync', mapping: 'idrecargafincimexsync'},//una tabla que va a tener una relacion con el idsync y las recargas
        //     {name: 'idoperacionrecarga', mapping: 'idoperacionrecarga'},
        //     {name: 'numtarjetafincimex', mapping: 'numtarjetafincimex'},
        //     {name: 'fechacaducidadfincimex', mapping: 'fechacaducidadfincimex'},
        //     {name: 'fecha', mapping: 'fecha'},
        //     {name: 'importefincimex', mapping: 'importe'},
        //     {name: 'chip', mapping: 'chip'},
        //     {name: 'idmovimiento', mapping: 'idmovimiento', defaultValue: -1}//pa modificar las recargas porque con eso lo hacen
        // ]);

        this.recordOperacion = Ext.data.Record.create([{
            name: 'idnomoperaciones'
        },
            {
                name: 'denominacion'
            }
        ]);

        this.recordCuenta = Ext.data.Record.create([{
            name: 'idcuenta'
        },
            {
                name: 'text'
            }
        ]);

    },
    initializeReaders: function () {

        // this.rdGridRecargaFincimex = new Ext.data.JsonReader({
        //         // root: 'datos',
        //         // totalProperty: 'cantidad_filas'
        //     },
        //     this.recordGridRecargaFincimex
        // );
        this.rdOperacion = new Ext.data.JsonReader({
                id: 'idnomoperaciones'
            },
            this.recordOperacion
        );

        this.rdCuenta = new Ext.data.JsonReader({
                root: 'datos'
            },
            this.recordCuenta
        );

    },
    initializeStores: function () {

        // this.stGridRecargaFincimex = new Ext.data.Store({
        //     url: 'cargarDatosRecargaFincimex',
        //     method: 'POST',
        //     reader: this.rdGridRecargaFincimex,
        //     autoLoad: false
        // });



        this.stOperacion = new Ext.data.Store({
            // url: '/contabilidad/cobros_pagos/derechouobligacion/index.php/gestionarduofn/CargarOperacionsCancelacion',
            url: '/contabilidad/comun/componentes/index.php/componentes/CargarOperacionsCancelacion',
            autoLoad: false,
            reader: this.rdOperacion,
            // baseParams: {
            //     tipoduo: this.tipoDuo,
            // }
        });


        this.stCuenta = new Ext.data.Store({
            url: '/contabilidad/comun/componentes/index.php/componentes/loadDataCuenta',
            autoLoad: false,
            reader: this.rdCuenta
        });

    },
    initializeGetFn: function () {

        this.getStoreCuenta = function () {
            return this.stCuenta;
        };
        this.getStoreOperacion = function () {
            return this.stOperacion;
        };

    }
});
