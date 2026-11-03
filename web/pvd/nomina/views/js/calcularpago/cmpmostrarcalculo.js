/**
 * Created by shonder on 08/05/2015.
 */
/**
 * Created by shonder on 30/04/2015.
 */

Ext.ns('Pvd.Nomina.CalculoPagoResultado');
/**
 * Autor: Beatriz Selema Alvarez
 */

Pvd.Nomina.CalculoPagoResultado.mostrarresultado = Ext.extend(Ext.Panel, {
    layout: 'border',
    initComponent: function () {

        this.btnBuscar = new Ext.Button({
            disabled: false,
            id: 'btnBuscar',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar en el pago',
            handler: function () {
                this.filtrarDatos();
            }.createDelegate(this)
        });
        this.checkB = new Ext.form.Checkbox({
            boxLabel: 'Personas'
        });
        this.btnReCalcular = new Ext.Button({
            text: 'Recalcular',
            tooltip: 'Recalcular',
            iconCls: 'calcular',
            disabled: true
        });

        this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            text: 'Exportar',
            tooltip: 'btnExportar',
            iconCls: 'exportar',
            //disabled: true
        });
        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            emptyText: 'Criterio a buscar...',
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã¼Ã‘\d\s]+ ?[a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã¼Ã‘\d\s]*)+$/,
            anchor: '90%',
            name: 'tfbuscador',
            prevTab: '',
            nextTab: ''
        });
        this.tfbuscar.on('specialkey', function (t, e) {
            if (e.keyCode == 13) {
                this.filtrarDatos();
            }
        }, this);
        this.storeGridMostrar = new Ext.data.GroupingStore({
            reader: new Ext.data.JsonReader({
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "iddatossbc"
                },
                [{name: 'iddatossbc'}
                    , {name: 'idpersona'}
                    , {name: 'ci'}
                ]),
            sortInfo: {field: 'nombreapellido', direction: "ASC"},
            groupField: 'area'
        });
        this.storeDetalles = new Ext.data.GroupingStore({
            reader: new Ext.data.JsonReader({
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "id"
                },
                [{name: 'id'}
                    , {name: 'denominacion'}
                    , {name: 'valor'}
                    , {name: 'tipodatos'}
                ]),
            sortInfo: {field: 'denominacion', direction: "ASC"},
            groupField: 'tipodatos'
        });
        this.gridMostarPagosResultados = new Ext.grid.GridPanel({
            frame: true,
            tbar: ['Denominaci&oacute;n', this.tfbuscar, '', this.btnBuscar, '', this.checkB, '->', this.btnExportar, this.btnReCalcular],
            region: 'center',
            title: Pvd.Nomina.CalculoPagoResultado.Idioma.lbTitGridMostrarPago,
            disabled: false,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            split: true,
            autoScroll: true,
            stripeRows: true,
            store: this.storeGridMostrar,
            columns: [{header: "Tipo de pago ", id: 'idexpadir', dataIndex: 'dentipopago'},
                {header: 'Referencia', dataIndex: 'referencia', width: 100}]
        });
        this.gridMostarPersonasNoPago = new Ext.grid.GridPanel({
            frame: true,
            region: 'south',
            height: 100,
            title: Pvd.Nomina.CalculoPagoResultado.Idioma.lbTitGridPersonasNoPago,
            disabled: false,
            closable: true,
            collapsible: true,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            split: true,
            autoScroll: true,
            stripeRows: true,
            store: this.storeGridMostrar,
            columns: [{header: "Tipo de pago ", id: 'idexpadir', dataIndex: 'dentipopago'},
                {header: 'Referencia', dataIndex: 'referencia', width: 100}]
        });
        //Extendiendo la clase   Ext.grid.PropertyColumnModel para cambiar el name y el value.
        Ext.extend(Ext.grid.PropertyColumnModel, Ext.grid.ColumnModel, {
            nameText: 'Propiedad',
            valueText: 'Valor',
            dateFormat: 'd/m/Y',
            renderDate: function (A) {
                return A.dateFormat(this.dateFormat)
            },
            renderBool: function (A) {
                return A
            },
            getRenderer: function (A) {
                return A == 1 ? this.renderCellDelegate : this.renderPropDelegate
            },
            renderProp: function (A) {
                return this.getPropertyName(A)
            },
            renderCell: function (A) {
                var B = A;
                if (Ext.isDate(A)) {
                    B = this.renderDate(A)
                } else {
                    if (typeof A == "boolean") {
                        B = this.renderBool(A)
                    }
                }
                return Ext.util.Format.htmlEncode(B)
            },
            getPropertyName: function (B) {
                var A = this.grid.propertyNames;
                return A && A[B] ? A[B] : B
            }

        });
        this.gridResumen222 = new Ext.grid.PropertyGrid({
            title: 'Datos resumenes',
            closable: true,
            collapsible: true,
            region: 'west',
            enableColumnHide: true,
            width: 300,
            source: {
                // "Cant. personas": "",
                // "Cant. personas pago": "",
                // "Cant. personas no pago": "",
                // "Monto total repartido": "",
                // //"Diferencia": "",
                // "Mayor salario": "",
                // "Menor salario": ""
            }
        });
        this.gridResumen = new Ext.grid.GridPanel({
            region: 'west',
            title: 'Datos resumenes',
            enableColumnHide: true,
            closable: true,
            collapsible: true,
            width: 500,
            split: true,
            autoScroll: true,
            stripeRows: true,
            columns: [
                {header: "id", dataIndex: 'id', width: 20, hidden: true},
                {header: "Indicador", dataIndex: 'denominacion', width: 200},
                {header: 'Valor', dataIndex: 'valor', width: 100},
                {header: 'Datos', dataIndex: 'tipodatos', width: 20, hidden: true}
            ],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{text}'
            }),
            store: this.storeDetalles
        });
        this.items = [this.gridMostarPagosResultados, this.gridResumen, this.gridMostarPersonasNoPago];
        Pvd.Nomina.CalculoPagoResultado.mostrarresultado.superclass.initComponent.call(this);
    },
    limpiarStores: function () {
    },
    fnDenomIndicadorDetalles: function (val) {
        var arr = val.split("---");
        return ((arr[0].substring(0, 1) == "a") ?
                '<span style="color:#00AA33;">' + arr[1] + '</span>' :
                '<span style="color:#0b2aff;">' + arr[1] + '</span>'
        );
    },
    fnValorIndicadorDetalles: function (val) {
        return '<span style="font-weight: bold;">' + val + '</span>';
    },
    fnColorDiferencia: function (val) {
        if (val > 1)
            return '<span style="font-weight: bold; color: #8b0000">' + val + '</span>';
        else
            return val;
    },
    crearGridDinamico: function (respuesta) {
        //Grid de detalles ********************************************************************************************
        var columns = new Array();
        var indexs = new Array();
        columns.push(
            {
                dataIndex: 'id',
                sortable: true,
                hidden: true,
                header: 'idindicador',
                width: 20
            },
            {
                dataIndex: 'denominacion',
                sortable: true,
                header: 'Indicador',
                width: 150,
                renderer: this.fnDenomIndicadorDetalles
            },
            {
                dataIndex: 'valor',
                sortable: true,
                header: 'Valor',
                width: 50,
                //renderer: this.fnValorIndicadorDetalles
            }, {
                dataIndex: 'montototal',
                sortable: true,
                header: 'Monto total',
                width: 50,
                //renderer: this.fnValorIndicadorDetalles
            }, {
                dataIndex: 'montoreal',
                sortable: true,
                header: 'Monto real',
                width: 50,
                //renderer: this.fnValorIndicadorDetalles
            }, {
                dataIndex: 'diferencia',
                sortable: true,
                header: 'Diferencia',
                width: 50,
                renderer: this.fnColorDiferencia
            },
            {
                dataIndex: 'tipodatos',
                sortable: true,
                hidden: true,
                header: 'Datos',
                width: 20
            }
        );
        detalles = respuesta.detalles;
        indexs.push({name: 'id'}, {name: 'denominacion'}, {name: 'valor'}, {name: 'montototal'}, {name: 'montoreal'}, {name: 'diferencia'}, {name: 'tipodatos'});
        var cm = new Ext.grid.ColumnModel(columns);
        var record = new Ext.data.Record.create(indexs);
        var reader = new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos"
        }, record);
        var datosGrid = {
            'datos': detalles,
            'cantidad': detalles.length
        };
        var storeGrid = new Ext.data.GroupingStore({
            reader: reader,
            sortInfo: {field: 'denominacion', direction: "ASC"},
            groupField: 'tipodatos'
        });
        storeGrid.loadData(datosGrid);
        this.gridResumen.reconfigure(storeGrid, cm);

        //Reconfigurando el Grid de personas que acceden al pago*******************************************************
        this.fnReconfigurarGridDinamico(respuesta.indicadorespago, respuesta.pago, this.gridMostarPagosResultados);

        //Reconfigurando el Grid de personas que no acceden al pago****************************************************
        this.fnReconfigurarGridDinamico(respuesta.indicadoresnopago, respuesta.nopago, this.gridMostarPersonasNoPago);

        return;
    },
    fnReconfigurarGridDinamico: function (col, datospersonas, grid) {
        var columns = new Array();
        var indexs = new Array();
        columns.push({
                dataIndex: 'nombreapellido',
                sortable: true,
                header: 'Nombre y apellidos',
                width: 300
            },
            {
                dataIndex: 'area',
                sortable: true,
                hidden: true,
                header: 'Area',
                width: 300
            }
        );
        indexs.push({name: 'nombreapellido'}, {name: 'idarea'}, {name: 'area'});
        Ext.each(col, function (value) {
            columns.push({
                dataIndex: "" + value.denominacion + "",
                sortable: true,
                header: value.denominacion,
                width: 100
            });
            indexs.push({name: '' + value.denominacion + ''});
        });
        var cm = new Ext.grid.ColumnModel(columns);
        var record = new Ext.data.Record.create(indexs);
        var reader = new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos"
        }, record);
        var datosGrid = {
            'datos': datospersonas,
            'cantidad': datospersonas.length

        };
        var storeGrid = new Ext.data.GroupingStore({
            reader: reader,
            sortInfo: {field: 'nombreapellido', direction: "ASC"},
            groupField: 'area'
        });
        storeGrid.loadData(datosGrid);
        grid.reconfigure(storeGrid, cm);
    },
    filtrarDatos: function () {
        if (this.tfbuscar.getValue() != '') {
            if (this.checkB.getValue()) {
                /*Filtro del grouping store para plantillas nominales*/
                this.gridMostarPagosResultados.getStore().filter('nombreapellido', this.tfbuscar.getValue(), true, false);
            } else
                this.gridMostarPagosResultados.getStore().filter('area', this.tfbuscar.getValue(), true, false);
        } else {
            this.gridMostarPagosResultados.getStore().clearFilter();
        }
    }
});



