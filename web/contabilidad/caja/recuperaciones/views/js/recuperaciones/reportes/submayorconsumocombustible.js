Ext.namespace('Caja.Reportes.SubMayorConsumoCombustible');
Caja.Reportes.SubMayorConsumoCombustible = Ext.extend(Ext.Component,
    {
        abreviatura : 'subc',
        idreporte : 7001,
        denominacion : 'SUBMAYOR DE CONSUMO DE COMBUSTIBLE',
        url : '',
        busyRequest: {},
        tipoReporte: 'jasper',//jasper, normal
        drawGrid: false,//pa mostrar el grid
        //mensual para q se restrinja la fecha por mes,
        //rangoe para q se seleccione un rago de fecha dentro del anno
        //rango para q se seleccione un rago de fecha cualquiera
        //por defecto es mensual el q se selecciona
        // rangoFecha: 'rangoe',
        constructor : function()
        {
            this.crearFunciones();
            Caja.Reportes.SubMayorConsumoCombustible.superclass.constructor.call(this);
        },
        getRecord: function () {
            return {idreporte: this.idreporte, denominacion: this.denominacion};
        },
        crearFilterComponents: function (getEstructuras, getFechaInicio, getFechaFin) {
            //getFechaInicio, getFechaFin, getEstructuras, getEjercicio, getPeriodo, getIdcaja
            this.lMask();
            this.fObtenerParametros = {
                getEstructuras: getEstructuras,
                getFechaInicio: getFechaInicio,
                getFechaFin: getFechaFin,
            };
            return [
                this.fBuildCaja(this.fObtenerParametros),
                this.fBuildTipoTarjeta(this.fObtenerParametros),
                this.fBuildAgrupador(this.fObtenerParametros),
            ];
        },
        getParams: function () {
            var params = {};
            if (this.cbCaja && this.cbCaja.getValue()) {
                params.idcaja = this.cbCaja.getValue();
            }
            if (this.cbTipoTarjeta && this.cbTipoTarjeta.getValue() !== 3) {
                params.idTipo = this.cbTipoTarjeta.getValue();
            }
            return params;
        },
        isValid: function () {
            var a = true;
            if (!this.cbAgrupador.isValid()) {
                a = false;
            } else if (!this.cbCaja.isValid()) {
                a = false;
            }
            return a;
        },
        crearStoreGrid: function (viewdata) {
            var fields = [
                {name: 'codigo'},
                {name: 'nombreentidad', mapping: 'entidad'},
                {name: 'numerodocumento', mapping: 'numero', type: 'int'},
                {name: 'fechaemision', mapping: 'fecha'},
                {name: 'recibode', mapping: 'cliente'},
                {name: 'tipodocumento'},
                {name: 'operacion'},
                {name: 'importe'},
                {name: 'nomestado'}
            ];

            var reader = new Ext.data.JsonReader({
                fields: fields
            });

            return new Ext.data.GroupingStore({
                reader: reader,
                data: viewdata,
                sortInfo: {field: 'numerodocumento', direction: "ASC"},
                groupField: 'nombreentidad'
            });
        },
        crearColumnModel: function () {
            var columnModel = [
                {
                    header: 'N&uacute;mero',
                    dataIndex: 'numerodocumento',
                    align: 'left',
                    width: 50
                    //width : '25%'
                }, {
                    header: 'Fecha',
                    dataIndex: 'fechaemision',
                    align: 'center',
                    width: 50
                    //width : '25%'
                }, {
                    header: 'Tipo de documento',
                    dataIndex: 'tipodocumento',
                    align: 'left',
                    width: 100
                    //width : '25%'
                }, {
                    header: 'Recibido de',
                    dataIndex: 'recibode',
                    align: 'left',
                    width: 100
                    //width : '25%'
                }, {
                    header: 'Estado',
                    dataIndex: 'nomestado',
                    align: 'left',
                    width: 50
                    //width : '25%'
                }, {
                    header: 'Operación',
                    dataIndex: 'operacion',
                    align: 'left',
                    width: 250
                    //width : '25%'
                }, {
                    header: 'Importe',
                    dataIndex: 'importe',
                    align: 'right',
                    width: 50,
                    renderer: formatoMoneda
                }, {
                    header: 'Entidad',
                    dataIndex: 'nombreentidad',
                    sortable: true,
                    hidden: true,
                    hideable: false
                }];

            return new Ext.grid.ColumnModel(columnModel);
        },
        generarReporte: function (parametros) {
            var params = this.prepararParametros(parametros);
            var reporte = new LOG.util.Report({
                reports: [
                    {
                        dirReport: '/distra/contabilidad/caja/tarjetas/SubMayorConsumoCombustibleHR',
                        name: ' SUBMAYOR DE CONSUMO DE COMBUSTIBLE',
                        isList: true,
                        params: params
                    },
                ]
            });
            reporte.view();

        },
        cambioSeleccionEstructura: function (arrestructuras) {
            if (arrestructuras.length) {
                this.cbCaja.getStore().load({
                    params: {
                        arrayIdEstructura: Ext.encode(arrestructuras)
                    }
                });
            } else {
                this.cbCaja.getStore().removeAll();
            }
            this.cbCaja.clearValue();
        },
        crearFunciones: function () {
            var me = this;

            this.lMask = function (mensaje = 'Cargando...') {
                this.loadMask = new Ext.LoadMask(Ext.getBody(), {
                    msg: mensaje
                });
                this.loadMask.show();
            };

            this.fBuildCaja = function (fObtenerParametros) {
                me.cbCaja = new Caja.Reportes.CbCaja(
                    {
                        listeners: {
                            select: function () {
                                // me.cbFondo.getStore().load();
                            }
                        }
                    },
                    {

                    }
                );

                me.cbCaja.getStore().load({
                    params: {
                        arrayIdEstructura: Ext.encode(fObtenerParametros.getEstructuras())
                    },
                    callback: function () {
                        me.loadMask.hide();
                    }
                });

                return me.cbCaja;
            }

            this.fBuildAgrupador = function (fObtenerParametros) {
                var datos = [
                    [1, 'Hoja de ruta'],
                    [2, 'Indicativo'],
                    [3, 'Responsable'],
                ];

                var stAgrupador = new Ext.data.SimpleStore({
                    fields: ['id', 'agrupar'],
                    data: datos
                });

                this.cbAgrupador = new Ext.form.ComboBox({
                    fieldLabel: 'Agrupar',
                    store: stAgrupador,
                    valueField: 'id',
                    displayField: 'agrupar',
                    hiddenName: 'agrupador',
                    // tpl: '<tpl for="."><div ext:qtip="{id}" class="x-combo-list-item">{id}</div></tpl>',
                    anchor: '100%',
                    typeAhead: true,
                    mode: 'local',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Seleccione...',
                    selectOnFocus: true,
                    allowBlank: false,
                    // tabIndex: 102,
                    listeners: {
                        select: function(combo, record, index) {
                        }
                    }
                });
                return this.cbAgrupador;
            };

            this.fBuildTipoTarjeta = function () {
                this.cbTipoTarjeta = new Ext.form.ComboBox({
                    store: new Ext.data.SimpleStore({
                        fields: ['id', 'tipo'],
                        data: [
                            [1, 'Combustible'],
                            [2, 'Peaje'],
                            [3, 'Todas']
                        ]
                    }),
                    emptyText: 'Seleccionar...',
                    displayField: 'tipo',
                    triggerAction: 'all',
                    anchor: '100%',
                    value: 3,
                    valueField: 'id',
                    hiddenName: 'id',
                    fieldLabel: 'Tipo tarjeta',
                    mode: 'local',
                    typeAhead: true,
                    editable: false,
                    resizable: true,
                    forceSelection: true,
                    selectOnFocus: true
                });

                return this.cbTipoTarjeta;
            };

            this.prepararParametros = function (parametros = {}) {
                var a = this.cbAgrupador.getValue();
                var b = this.getParams();
                if (a === 1) {
                    parametros.agrupar = 'hruta';
                    parametros.titulo = 'Submayor de Consumo de Combustible por Hoja de Ruta';
                } else if (a === 2) {
                    parametros.agrupar = 'indicativo';
                    parametros.titulo = 'Submayor de Consumo de Combustible por Indicativo';
                } else if (a === 3) {
                    parametros.agrupar = 'responsable';
                    parametros.titulo = 'Submayor de Consumo de Combustible por Responsable';
                }
                return Ext.apply(parametros, b);
            };

        }
    });