Ext.namespace('Ext.ColumnGridUtil');
Ext.ColumnGridUtil = Ext.extend(Ext.Component, {
    url: '/contabilidad/cobros_pagos/configuracion/index.php/gestconfcolumncopa/cargarDatosColumn',
    origen: undefined,
    gridColumns: undefined,
    constructor: function (params) {
        this.origen = params.origen;
        Ext.ColumnGridUtil.superclass.constructor.call(this);
        this.addEvents('columnasCargadas');
    },
    cargarColumnas: function () {
        Ext.Ajax.request({
            scope: this,
            url: this.url,
            method: 'POST',
            params: {
                origen: this.origen
            },
            callback: function(options, success, response)
            {
                this.gridColumns = Ext.decode(response.responseText);
                this.fireEvent('columnasCargadas', this.gridColumns);
            }
        });
    },
    prepararColumnas: function (funciones, gridColumns) {
        if (!gridColumns) {
            gridColumns = this.gridColumns;
        }
        var columnas = [];
        var tiposfilter = [];
        var autoexpand = undefined;
        for (var i = 0; i < gridColumns.length; i++) {
            var obj = {
                header: gridColumns[i].header,
                width: parseInt(gridColumns[i].width),
                dataIndex: gridColumns[i].dataindex,
                align: gridColumns[i].align,
                sortable: gridColumns[i].sortable == 1 ? true : false,
                hidden: gridColumns[i].hidden == 1 ? true : false,
                hideable: gridColumns[i].hideable == 1 ? true : false,
                renderer: this.getRendereFunc(gridColumns[i].render, funciones),
            };
            if (gridColumns[i].identificador) {
                obj.id = gridColumns[i].identificador;
            }
            if (gridColumns[i].filtrar == 1) {
                tiposfilter.push({
                    type: gridColumns[i].type,
                    dataIndex: gridColumns[i].dataindex,
                });
            }
            columnas.push(obj);

            if (gridColumns[i].autoexpandir == 1 && gridColumns[i].identificador) {
                autoexpand = gridColumns[i].identificador;
            }
        }
        return {
            columnas: columnas,
            tiposfilter: tiposfilter,
            autoexpand: autoexpand,
        };
    },
    getRendereFunc: function (nombre, funciones = {}) {
        if (this.funcionesEstandar(nombre)) {
            return this.funcionesEstandar(nombre);
        } else if (typeof funciones[nombre] === "function") {
            return funciones[nombre];
        } else {
            return undefined;
        }
    },
    funcionesEstandar: function (nombre) {
        if (nombre === 'formatoMonedaABS') {
            return formatoMonedaABS;
        } else {
            return false;
        }
    }
});