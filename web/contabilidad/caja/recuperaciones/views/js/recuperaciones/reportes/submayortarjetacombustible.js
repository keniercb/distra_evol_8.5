Ext.namespace('Caja.Reportes.SubMayorTarjetaCombustible');
Caja.Reportes.SubMayorTarjetaCombustible = Ext.extend(Ext.Component,
    {
        abreviatura : undefined,
        idreporte : 7002,
        denominacion : 'SUBMAYOR DE TARJETA PREPAGADA DE COMBUSTIBLE',
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
            Caja.Reportes.SubMayorTarjetaCombustible.superclass.constructor.call(this);
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
                this.fBuildTarjeta(this.fObtenerParametros),
            ];
        },
        getParams: function () {
            var params = {};
            if (this.cbTarjeta && this.cbTarjeta.fSelect.values.length > 0) {
                params.tarjetas = '{' + this.cbTarjeta.fSelect.values.join(',') + '}';
            }
            if (this.cbCaja && this.cbCaja.getValue()) {
                params.idCaja = this.cbCaja.getValue();
            }
            if (this.cbTipoTarjeta && this.cbTipoTarjeta.getValue() !== 3) {
                params.idTipo = this.cbTipoTarjeta.getValue();
            }
            return params;
        },
        isValid: function () {
            var a = true;
            if (!this.cbTarjeta.isValid()) {
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
        generarReporte: function (param) {
            var params = Ext.apply(param, this.prepararParametros());
            var reporte = new LOG.util.Report({
                reports: [
                    {
                        dirReport: '/distra/contabilidad/caja/tarjetas/SubMayorTarjeta',
                        name: ' SUBMAYOR DE TARJETA PREPAGADA DE COMBUSTIBLE',
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
                            select: function (cb) {
                                if (Ext.getCmp('gptarjeta')) {
                                    Ext.getCmp('gptarjeta').getStore().load({
                                        params: {
                                            idCaja: cb.getValue(),
                                            idTipo: 3,
                                        }
                                    });
                                }
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

            this.fBuildTarjeta = function (fObtenerParametros) {
                this.cbTarjeta = new Ext.CONT.UIXCombo({
                    // invalidText: "Este campo es obligatorio.",
                    allowBlank: true,
                    // loaded: false,
                    fieldLabel: 'Tarjetas',
                }, {
                    identificador: 'tarjeta',
                    displayText: 'numero',
                    url: 'cargarTarjetasByIdCaja',
                    height: 400,
                    autoLoad: false,
                    singleSelect: false,
                    // baseParams: {
                    //     'arrayIdEstructurae': Ext.encode(scope.cbxEntidad.fSelect.values)
                    // },
                    reader: new Ext.data.JsonReader({
                        // root: 'data',
                        id: 'idtarjeta'
                    }, [{
                        name: '_parent'
                    }, {
                        name: '_is_leaf',
                        defaultValue: true
                    }, {
                        name: 'tarjeta',
                        mapping: 'numero'
                    }, {
                        name: 'text',
                        mapping: 'numero'
                    }, {
                        name: 'idtarjeta'
                    },{
                        name: 'id',
                        mapping: 'idtarjeta'
                    }, {
                        name: 'codigo',
                        mapping: 'numero'
                    }])
                });
                return this.cbTarjeta;
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

                this.cbTipoTarjeta.on({
                    select: function (cb) {
                        var idTipoTarjeta = cb.getValue();
                        if (Ext.getCmp('gptarjeta')) {
                            Ext.getCmp('gptarjeta').getStore().load({
                                params: {
                                    idTipo: idTipoTarjeta,
                                    idCaja: me.cbCaja.getValue()
                                }
                            });
                        }
                    }
                });

                return this.cbTipoTarjeta;
            };

            this.prepararParametros = function () {
                return this.getParams();
            };

        }
    });