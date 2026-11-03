Ext.namespace('Ext.ClassLiquidarPorCliente.AddLiq');
Ext.ClassFiltrarObligaciones.Model = Ext.extend(Ext.Component, {
    constructor: function(params)
    {
        Ext.apply(this, params);
        this.initializeModel();
        Ext.ClassFiltrarObligaciones.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
        this.initializeAjaxCalls();
    },
    initializeRecords: function () {

        this.dataRecordd = [{
            name: 'ndocumentos',
            mapping: 'numero'
        }, {
            name: 'ipendientes',
            mapping: 'importeapagar',
            type: 'float'
        }, {
            name: 'comentarios',
            mapping: 'comentario'
        }, {
            name: 'ipagar',
            type: 'float',
            mapping: 'importemo'
        }, {
            name: 'importemo',
            type: 'float'
        }, {
            name: 'idoperacion'
        }, {
            name: 'idoperacioncont'
        }, {
            name: 'idcuenta'
        }, {
            name: 'idduo'
        }, {
            name: 'iva',
            type: 'float'
        }, {
            name: 'liquidadomb',
            type: 'float'
        }, {
            name: 'retencion',
            type: 'float'
        }, {
            name: 'idcompretenciones'
        }, {
            name: 'idliquidacionfnz'
        }, {
            name: 'numerocomprobante'
        }, {
            name: 'ivaventa',
            type: 'float'
        }, {
            name: 'impuestomunicipal',
            type: 'float'
        }, {
            name: 'impuestorenta',
            type: 'float'
        }, {
            name: 'observacionretencion'
        }, {
            name: 'importeImpuestoRenta'
        }, {
            name: 'importeIvaEnVenta'
        }, {
            name: 'idtipodocumento'
        }, {
            name: 'tipodoc'
        }, {
            name: 'fecha'
        }, {
            name: 'concatcta'
        }, {
            name: 'noperacionenzona'
        }
        ];

        this.recordLiquidar = Ext.data.Record.create(this.dataRecordd);
        this.recordBuscarLiquidar = Ext.data.Record.create(this.dataRecordd);

    },
    initializeReaders: function () {

        this.rdGridBuscarLiquidar = new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad_filas',
                id: 'reader',
            },
            this.recordBuscarLiquidar
        );

        this.rdGridLiquidar = new Ext.data.JsonReader({
                // root: 'datos',
                // totalProperty: 'cantidad_filas'
                id: 'reader',
            },
            this.recordLiquidar
        );

    },
    initializeStores: function () {

        this.stBuscarLiquidar = new Ext.data.Store({
            url: '/contabilidad/cobros_pagos/derechouobligacion/index.php/anticipo/cargarinstrumentoscobro',
            baseParams: this.baseParams,
            // groupField: 'clienteproveedor',
            reader: this.rdGridBuscarLiquidar,
            // sortInfo: {field: 'fechaemision', direction: 'ASC'},
            // autoLoad: true
            // sortInfo: {field: 'idderechouobligacion', direction: 'ASC'}
        });

        this.stLiquidar = new Ext.data.Store({
            // url: 'loadDataDuoByClienteProveedor',
            // baseParams: {
            //     tipoDuo: this.tipoDuo
            // },
            reader: this.rdGridLiquidar,
            // sortInfo: {field: 'fechaemision', direction: 'ASC'}
        });

    },
    initializeGetFn: function () {

        this.getStoreGridLiquidar = function () {
            return this.stLiquidar;
        };

        this.getStoreGridBuscarLiquidar = function () {
            return this.stBuscarLiquidar;
        };

    },
    initializeAjaxCalls: function () {

        this.cargarOperacionYCuentas = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: "cargarOperaciones",
                callback: callbackFunction //options, success, response
            };
            this.ajaxCall(parametros, parametrosAdicionales);
        };

    },
    ajaxCall: function (parametros, parametrosAdicionales) {
        if (typeof parametrosAdicionales === 'object') {
            Ext.applyIf(parametros, parametrosAdicionales);
        }
        Ext.Ajax.request(parametros);
    }
});
