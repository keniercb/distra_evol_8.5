/**
 Modelo que contiene los Stores
 Autor: Danilo Milán Araujo
 **/
Ext.ns('Logistica.lecturamedidor');

Logistica.lecturamedidor.Modelo = function () {
    this.listadoDocumentos = new Ext.data.JsonStore({
        url: 'listarDocumentos',
        root: "datos",
        totalProperty: "cantidad",
        fields: [
            {name: 'iddocumento'},
            {name: 'nrodoc'},
            {name: 'servicio'},
            {name: 'idservicio'},
            {name: 'codigocontrato'},
            {name: 'titular'},
            {name: 'clientes'},
            {name: 'producto'},
            {name: 'anno'},
            {name: 'fechacontable', type: 'date', dateFormat: 'd/m/Y'},
            {name: 'rutas'},
            {name: 'estado'},
            {name: 'precio'},
            {name: 'idestado'},
            {name: 'observaciones'},
            {name: 'nofactura'}
        ]
    });

    this.storeStatus = new Ext.data.JsonStore({
        url: 'listarStatus',
        root: "datos",
        fields: [
            {name: 'idstatus', mapping: 'idestatus'},
            {name: 'status', mapping: 'denominacion'}
        ]
    });
    this.storeContratos = new Ext.data.JsonStore({
        url: 'listarContratos',
        root: "datos",
        fields: [
            {name: 'idcontrato', mapping: 'idcontrato'},
            {name: 'contrato', mapping: 'contrato'}
        ]
    });
    this.storeClientes = new Ext.data.JsonStore({
        url: 'listarClientes',
        root: "datos",
        totalProperty: 'cantidad',
        fields: [
            {name: 'idmedicioncliente', mapping: 'idmedicioncliente'},
            {name: 'codigocliente', mapping: 'codigocliente'},
            {name: 'codigocontrato', mapping: 'codigocontrato'},
            {name: 'idcontrato', mapping: 'idcontrato'},
            {name: 'cliente', mapping: 'cliente'},
            {name: 'idcliente', mapping: 'idcliente'},
            {name: 'tipocontrato', mapping: 'tipocontrato'},
            {name: 'contrato', mapping: 'denominacion'},
            {name: 'numerocontrato', mapping: 'numerocontrato'}
        ]
    });
    this.storeProductos = new Ext.data.JsonStore({
        url: 'listarProductos',
        root: "datos",
        fields: [
            {name: 'idproducto', mapping: 'idindicador'},
            {name: 'producto', mapping: 'denominacion'},
            {name: 'descripcionmarcamodelo', mapping: 'descripcionmarcamodelo'}
        ]
    });

    this.storeTitular = new Ext.data.JsonStore({
        url: 'listarTitular',
        root: "datos",
        fields: [
            {name: 'idtitular', mapping: 'idtitular'},
            {name: 'titular', mapping: 'titular'}
        ]
    });
};
