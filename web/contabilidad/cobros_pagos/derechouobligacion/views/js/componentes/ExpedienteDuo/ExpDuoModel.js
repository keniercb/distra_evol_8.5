Ext.namespace('Ext.ExpDuo');
Ext.ExpDuo.Model = Ext.extend(Ext.Component, {
    url: '/contabilidad/cobros_pagos/derechouobligacion/index.php/expduo/',
    constructor: function()
    {
        this.initializeModel();
        Ext.ExpDuo.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
        this.initializeGetFn();
        this.initializeAjaxCalls();
    },
    initializeRecords: function () {

        this.arrEstructuraExpDuo = [
            {name: 'id', mapping: 'idexpediente'},
            {name: 'idtipodoc', mapping: 'idtipodoc'},
            {name: 'descripcion', mapping: 'comentario'},
            {name: 'fecha', mapping: 'fecha'},
            {name: 'fechavencimiento', mapping: 'fechavencimiento'},
            {name: 'refdoc', mapping: 'idalfresco'},
            {name: 'nombreusuario', mapping: 'nombreusuario'}
        ];

        this.recordGridExpDuo = new Ext.data.Record.create(this.arrEstructuraExpDuo);

    },
    initializeReaders: function () {

        this.rdGridExpDuo = new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad_filas'
            },
            this.recordGridExpDuo
        );

    },
    initializeStores: function () {

        this.stGridExpDuo = new Ext.data.Store({
            url: this.url + 'cargarDatos',
            reader: this.rdGridExpDuo,
            autoLoad: false
        });

        // this.initializeTestDataExpDuo();

    },
    initializeGetFn: function () {

        this.getStoreExpDuo = function () {
            return this.stGridExpDuo;
        };

    },
    initializeTestDataExpDuo: function () {
        var data = [
            [1, 1, 'prueba', '12/10/2022', 'nose'],
            [1, 2, 'prueba1', '21/12/2022', 'nose1'],
            [1, 3, 'prueba2', '11/12/2022', 'nose2'],
        ];

        this.initializeTestData(
            this.stGridExpDuo,
            data,
            this.arrEstructuraExpDuo,
            'datos'
        );
    },
    initializeTestData: function (store, data, arrEstructura, root, totalProperty) {
        var datosFormateados = this.createTestData(
            data, arrEstructura, root, totalProperty
        );

        store.loadData(datosFormateados);
    },
    createTestData: function (datos, arrEstructura, root, totalProperty) {
        var datosprueba = [];
        var res = {};
        for (var i = 0; i < datos.length; i++) {
            var objetoo = {};
            for (var j = 0; j < arrEstructura.length; j++) {
                if (typeof datos[i][j] !== 'undefined') {
                    objetoo[
                        arrEstructura[j].mapping ? arrEstructura[j].mapping : arrEstructura[j].name
                        ] = datos[i][j];
                }
            }
            datosprueba.push(objetoo);
        }

        if (root) {
            res[root] = datosprueba;
            if (totalProperty) {
                res[totalProperty] = datosprueba.length;
            }
        } else {
            res = datosprueba;
        }
        // console.log(res);
        return res;
    },
    initializeAjaxCalls: function (parametros, parametrosAdicionales) {

        this.eliminarExp = function (parametrosAdicionales, callbackFunction) {
            var parametros = {
                method: "POST",
                url: this.url + "eliminarExp",
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