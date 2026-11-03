Ext.namespace('Caja.Reportes.ArqueoEfectivoCaja');
Caja.Reportes.ArqueoEfectivoCaja = Ext.extend(Ext.Component,
    {
        abreviatura : undefined,
        idreporte : 14007,
        denominacion : 'ARQUEO DEL EFECTIVO EN CAJA',
        url : '',
        busyRequest: {},
        tipoReporte: 'normal',//jasper, normal
        drawGrid: true,//pa mostrar el grid
        constructor : function()
        {
            this.crearFunciones();
            Caja.Reportes.ArqueoEfectivoCaja.superclass.constructor.call(this);
        },
        getRecord: function () {
            return {idreporte: this.idreporte, denominacion: this.denominacion};
        },
        crearFilterComponents: function (getEstructuras, getFechaInicio, getFechaFin) {
            //getFechaInicio, getFechaFin, getEstructuras, getEjercicio, getPeriodo, getIdcaja
            this.lMask();
            var fObtenerParametros = {
                getEstructuras: getEstructuras,
                getFechaInicio: getFechaInicio,
                getFechaFin: getFechaFin,
            };
            return [
                this.fBuildCaja(fObtenerParametros),
                this.fBuildFondo(fObtenerParametros),
                this.fBuildEstado(fObtenerParametros),
                this.fBuildDocumentos(fObtenerParametros),
            ];
        },
        getParams: function () {
            var params = {};
            if (this.cbFondo && this.cbFondo.getValue()) {
                params.idCajaFondo = this.cbFondo.getValue();
                params.nomFondo = this.cbFondo.getRawValue();
            }
            if (this.cbxEstado && this.cbxEstado.fSelect.values.length > 0) {
                params.idEstado = Ext.encode(this.cbxEstado.fSelect.values);
            }
            if (this.cbxDocumentos && this.cbxDocumentos.fSelect.values.length > 0) {
                params.documentos = Ext.encode(this.cbxDocumentos.fSelect.values);
            }
            return params;
        },
        isValid: function () {
            var a = true;

            if (!this.cbFondo.isValid()) {
                a = false;
            } else if (!this.cbxEstado.isValid()) {
                a = false;
            } else if (!this.cbxDocumentos.isValid()) {
                a = false;
            } else if (!this.cbCaja.isValid()) {
                a = false;
            }
            return a;
        },
        crearStoreGrid: function (viewdata) {
            var fields = [
                {name: 'nombreentidad'},
                {name: 'nombrefondo'},
                {name: 'numeroarqueo', type: 'int'},
                {name: 'fecha'},
                {name: 'importetotalarqueado'},
                {name: 'fondosasignados'},
                {name: 'diferencia'},
                {name: 'observacion'},
                {name: 'nomestado'}
            ];

            var reader = new Ext.data.JsonReader({
                fields: fields
            });

            return new Ext.data.GroupingStore({
                reader: reader,
                data: viewdata,
                sortInfo: {field: 'numeroarqueo', direction: "ASC"},
                groupField: 'nombreentidad'
            });
        },
        crearColumnModel: function () {
            var columnModel = [{
                header: 'Número',
                dataIndex: 'numeroarqueo',
                align: 'left',
                width: 20
                //width : '25%'
            }, {
                header: 'Fondo',
                dataIndex: 'nombrefondo',
                align: 'left',
                width: 50
                //width : '25%'
            }, {
                header: 'Fecha',
                dataIndex: 'fecha',
                align: 'centar',
                width: 20
                //width : '25%'
            }, {
                header: 'Estado',
                dataIndex: 'nomestado',
                align: 'left',
                width: 20
                //width : '25%'
            }, {
                header: 'Total arqueado',
                dataIndex: 'importetotalarqueado',
                align: 'right',
                width: 20
            }, {
                header: 'Monto del fondo',
                dataIndex: 'fondosasignados',
                align: 'right',
                width: 20
            }, {
                header: 'Diferencia',
                dataIndex: 'diferencia',
                align: 'right',
                width: 20,
                renderer: formatoMoneda
            }, {
                header: 'Comentario',
                dataIndex: 'observacion',
                align: 'left',
                width: 100,
            }, {
                header: 'Entidad',
                dataIndex: 'nombreentidad',
                sortable: true,
                hidden: true,
                hideable: false
            }];

            return new Ext.grid.ColumnModel(columnModel);
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
                                me.cbFondo.getStore().load();
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

            this.fBuildFondo = function (fObtenerParametros) {

                me.cbFondo = new Caja.Reportes.CbFondo(
                    {
                        listeners: {
                            select: function (cb) {
                                me.idCajaFondo = cb.getValue();
                                if (me.cbxEstado) {
                                    me.cbxEstado.enable();
                                }
                                if (Ext.getCmp('gpDocumentos')) {
                                    Ext.getCmp('gpDocumentos').getStore().load({
                                        params: {
                                            // arrayIdEstructura: Ext.encode(scope.fObtenerListaEstructura(scope.fObtenerListaEstructuraConsolidan())),
                                            arrayIdEstructura: Ext.encode(fObtenerParametros.getEstructuras()),
                                            idCajaFondo: me.idCajaFondo,
                                            fechainicio: fObtenerParametros.getFechaInicio(),
                                            fechafin: fObtenerParametros.getFechaFin(),
                                            idReporte: me.idreporte,
                                            idEstado: null
                                        }
                                    });
                                }
                            }
                        }
                    },
                    {
                        listeners: {
                            beforeload: function (store, options) {
                                // me.busyRequest.Fondo = true;
                                me.cbFondo.clearValue();
                                store.baseParams.idCaja = me.cbCaja.getValue();
                                store.baseParams.idReporte = me.idreporte;
                                if (me.cbxEstado) {
                                    me.cbxEstado.disable();
                                }
                            },
                            load: function (store, records, options) {
                                me.cbFondo.enable();
                                // delete me.busyRequest.Fondo;
                                // if (!Object.keys(me.busyRequest).length) {
                                // }
                                me.loadMask.hide();
                                //----------
                                if (records.length == 1) {
                                    me.cbFondo.setValue(records[0].data.idcajafondo);
                                    me.cbFondo.fireEvent('select', me.cbFondo);
                                    if (me.cbxEstado) {
                                        me.cbxEstado.enable();
                                    }
                                }
                            }
                        }
                    }
                );

                return me.cbFondo;
            };

            this.fBuildEstado = function (fObtenerParametros) {

                var arrayFilter = [8, 5, 6, 7];

                me.cbxEstado = new Caja.Reportes.CbEstados(arrayFilter, {
                    change: function () {
                        if (Ext.getCmp('gpDocumentos')) {
                            if (Ext.getCmp('gpDocumentos').rendered) {
                                Ext.getCmp('gpDocumentos').getSelectionModel().clearSelections();
                            }
                            Ext.getCmp('gpDocumentos').getStore().load({
                                params: {
                                    arrayIdEstructura: Ext.encode(fObtenerParametros.getEstructuras()),
                                    idCajaFondo: me.idCajaFondo,
                                    fechainicio: fObtenerParametros.getFechaInicio(),
                                    fechafin: fObtenerParametros.getFechaFin(),
                                    idReporte: me.idreporte,
                                    idEstado: Ext.encode(me.cbxEstado.fSelect.values)
                                }
                            });
                        }
                    }
                });

                return me.cbxEstado;
            };

            this.fBuildDocumentos = function (fObtenerParametros) {
                var lis = {
                    load: function (store, records, options) {
                        // delete me.busyRequest.documentos;
                        // if (!Object.keys(me.busyRequest).length) {
                        // }
                        me.loadMask.hide();
                    }
                };

                me.cbxDocumentos = new Caja.Reportes.CbDocumentos(lis);

                return me.cbxDocumentos;
            };

        }
    });