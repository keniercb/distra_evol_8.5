Ext.namespace('Ext.ClassBuscarDuo');

Ext.ClassBuscarDuo = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    nombreClienteProveedor: undefined,
    url: undefined, //'/finanzas/cobros_pagos/derechouobligacion/index.php/GestionarDuo/',
    confEspecialidad: undefined,
    constructor: function (etiquetas, params) {
        this.etiquetas = etiquetas;
        Ext.apply(this, params);
        this.tipoDuo = params.tipoDuo;
        this.confEspecialidad = params.confEspecialidad;
        scope = this;

        if (this.tipoDuo == 1) {
            this.nombreClienteProveedor = scope.etiquetas.lbCliente;//'Cliente';
            this.nombreFecha = scope.etiquetas.lbFechaEntrega;//'Fecha de entrega';
        } else if (this.tipoDuo == 2) {
            this.nombreClienteProveedor = scope.etiquetas.lbProveedor;//'Proveedor';
            this.nombreFecha = scope.etiquetas.lbFechaRecibo;//'Fecha de recibo';
        } else if (this.tipoDuo == 3) {
            this.nombreClienteProveedor = scope.etiquetas.lbParrafoFiscal;//'ParrafoFiscal';
            this.nombreFecha = scope.etiquetas.lbFechaEntrega;//'Fecha de entrega';
        } else if (this.tipoDuo == 4) {
            this.nombreClienteProveedor = scope.etiquetas.lbParrafoFiscal;//'ParrafoFiscal';
            this.nombreFecha = scope.etiquetas.lbFechaRecibo;//'Fecha de recibo';
        }

        this.stBuscarTipoDoc = new Ext.data.Store({
            url: this.url + 'cargarcomboGridDocumento',
            sortInfo: {
                field: 'denominacion',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'iddoc'
            }, [{
                name: 'iddoc',
                mapping: 'idtipodocumento'
            }, {
                name: 'denominacion'
            }, {
                name: 'abreviatura'
            }])
        });

        this.stBuscarClienteProveedor = new Ext.data.Store({
            url: this.url + 'cargarcliente',
            sortInfo: {
                field: 'nombrecliente',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'idclient'
            }, [{
                name: 'idcliente',
                mapping: 'idcliente'
            }, {
                name: 'nombrecliente',
                mapping: 'nombre'
            }])
        });

        this.stBuscarEspecialidad = new Ext.data.Store({
            url: this.url + 'cargarespecialidadbuscar',
            sortInfo: {
                field: 'especialidad',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'idclien'
            }, [{
                name: 'idespecialidad'
            }, {
                name: 'especialidad'
            }
            ])
        });

        this.stBuscarComprobante = new Ext.data.Store({
            url: this.url + 'cargarnumcomp',
            sortInfo: {
                field: 'numcomprobante',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({}, [{
                name: 'idcomprobante',
                mapping: 'idcomprobante'
            }, {
                name: 'numcomprobante',
                mapping: 'numcomprobante',
                type: 'int'
            }
            ])
        });

        this.stBuscarEstado = new Ext.data.Store({
            url: this.url + 'cargarestados',
            sortInfo: {
                field: 'idestado',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({}, [{
                name: 'idestado',
                mapping: 'idestadodocumento'
            }, {
                name: 'estado',
                mapping: 'descripcion'
            }
            ])
        });

        this.stBuscarTipoFecha = new Ext.data.SimpleStore({
            id: 'stBuscarTipoFecha',
            fields: ['idtipofecha', 'tipofecha'],
            data: [
                [1, (scope.tipoDuo == 1) ? scope.etiquetas.lbFechaEntrega : scope.etiquetas.lbFechaRecibo], [2, scope.etiquetas.lbFechaEmision], [3, scope.etiquetas.lbFechaRecepcion], [4, scope.etiquetas.lbFechaContabilizacion]]
        });

        this.stBuscarRangoFecha = new Ext.data.SimpleStore({
            id: 'stBuscarRangoFecha',
            fields: ['idrango', 'nombreRango'],
            data: [
                [1, '0 a 30'], [2, '31 a 60'], [3, '61 a 90'], [4, '91 a 120'], [5, 'Más de 120']]
        });

        this.stBuscarEjercicio = new Ext.data.Store({
            url: this.url + 'getEjercicios',
            sortInfo: {
                field: 'nombre',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({}, [{
                name: 'idejercicio'
            }, {
                name: 'nombre'
            }, {
                name: 'inicio'
            }, {
                name: 'fin'
            }
            ])
        });

        this.stBuscarPeriodo = new Ext.data.Store({
            url: this.url + 'loadDataPeriodo',
            sortInfo: {
                field: 'idperiodo',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({}, [{
                name: 'idperiodo'
            }, {
                name: 'nombre'
            }, {
                name: 'inicio'
            }, {
                name: 'fin'
            }
            ])
        });

        this.stBuscarCuenta = new Ext.data.Store({
            url: this.url + 'cargarcuentasbuscar',
            sortInfo: {
                field: 'nombre',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'idcuenta'
            }, [{
                name: 'idcuenta',
                mapping: 'idcuenta'
            }, {
                name: 'nombre',
                mapping: 'nombre'
            }
            ])
        });

        this.stBuscarSubsistema = new Ext.data.Store({
            url: this.url + 'cargarsubsistemasbuscar',
            sortInfo: {
                field: 'nombre',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'idsubsistema'
            }, [{
                name: 'idsubsistema',
                mapping: 'idsubsistema'
            }, {
                name: 'nombre',
                mapping: 'nombre'
            }
            ])
        });

        this.wBuscarDuo = new Ext.UIBuscarDuo(this);
        this.initializeEvents(this);
        this.initializeFunctions(this);
        //this.initWindow(this);

        Ext.Ajax.request({
            url: this.url + 'loadDataSearchDuo',
            method: 'POST',
            params: {
                tipoduo: this.tipoDuo
            },
            callback: function (options, success, response) {
                Ext.getBody().unmask();
                responseData = Ext.decode(response.responseText);
                scope.fShowWindow();
                scope.loadDataComponent(responseData, this.action);
            }
        });

        return Ext.ClassBuscarDuo.superclass.constructor.call(this);
    },
    loadDataComponent: function (data, action) {
        if (data.clienteProv)
            this.stBuscarClienteProveedor.loadData(data.clienteProv);
        if (data.cuentas)
            this.stBuscarCuenta.loadData(data.cuentas);
        if (data.tipoDocumentos)
            this.stBuscarTipoDoc.loadData(data.tipoDocumentos);
        if (data.subsistemas)
            this.stBuscarSubsistema.loadData(data.subsistemas);
        if (data.numcomprobante)
            this.stBuscarComprobante.loadData(data.numcomprobante);
        if (data.estadosDuo)
            this.stBuscarEstado.loadData(data.estadosDuo);
        if (scope.confEspecialidad && data.especialidades)
            this.stBuscarEspecialidad.loadData(data.especialidades);
        if (data.ejercicios)
            this.stBuscarEjercicio.loadData(data.ejercicios);
        if (data.periodos)
            this.stBuscarPeriodo.loadData(data.periodos);

        /* SETEANDO LOS FILTROS ACTUALES DE BUSQUEDA */
        if (scope.params.numero) {
            scope.tfBuscarNumeroDocumento.setValue(scope.params.numero);
        }
        if (scope.params.numerocontrato) {
            scope.tfBuscarNumeroContrato.setValue(scope.params.numerocontrato);
        }
        if (scope.params.iddoc) {
            scope.cbBuscarTipoDoc.setValue(scope.params.iddoc);
        }
        if (scope.params.idestadodocumento) {
            scope.cbBuscarEstado.setValue(scope.params.idestadodocumento);
        }
        if (scope.params.subsistema) {
            scope.cbBuscarSubsistema.setValue(scope.params.subsistema);
        }
        if (scope.params.idcuenta) {
            scope.cbBuscarCuenta.setValue(scope.params.idcuenta);
        }
        if (scope.params.importe) {
            scope.tfBuscarImporte.setValue(scope.params.importe);
        }
        if (scope.params.idcliente) {
            scope.cbBuscarClienteProveedor.setValue(scope.params.idcliente);
        }
        if (scope.params.numcomprobante) {
            scope.cbBuscarComprobante.setValue(scope.params.numCO);
        }
        if (scope.params.idespecialidad) {
            scope.cbBuscarEspecialidad.setValue(scope.params.idespecialidad);
        }
        if (scope.params.tipofecha) {
            scope.cbBuscarTipoFecha.setValue(scope.params.tipofecha);
        }
        if (scope.params.fechainicio) {
            scope.dfBuscarDesde.setValue(scope.params.fechainicio);
        }
        if (scope.params.fechafin) {
            scope.dfBuscarHasta.setValue(scope.params.fechafin);
        }

        //CLIENTE-PROVEEDOR
//        if (this.stBuscarClienteProveedor.getCount() == 1)
//            scope.fLoadOneData(Ext.getCmp('cbBuscarClienteProveedor'), this.stBuscarClienteProveedor, 'idestructuracliente', 'nombrecliente');
//        else
//            Ext.getCmp('cbBuscarClienteProveedor').enable();
//
//        //CUENTA
//        if (this.stBuscarCuenta.getCount() == 1)
//            scope.fLoadOneData(Ext.getCmp('cbBuscarCuenta'), this.stBuscarCuenta, 'idcuenta', 'nombre');
//        else
//            Ext.getCmp('cbBuscarCuenta').enable();
//
//        //TIPO DOCUMENTO
//        if (this.stBuscarTipoDoc.getCount() == 1)
//            scope.fLoadOneData(Ext.getCmp('cbBuscarTipoDoc'), this.stBuscarTipoDoc, 'iddocumentos', 'denominacion');
//        else
//            Ext.getCmp('cbBuscarTipoDoc').enable();
//
//        //SUBSISTEMA
//        if (this.stBuscarSubsistema.getCount() == 1)
//            scope.fLoadOneData(Ext.getCmp('cbBuscarSubsistema'), this.stBuscarSubsistema, 'idsubsistema', 'nombre');
//        else
//            Ext.getCmp('cbBuscarSubsistema').enable();
//
//        //NUMERO COMPROBANTE
////        if (this.stBuscarComprobante.getCount() == 1)
////            scope.fLoadOneData(Ext.getCmp('cbBuscarComprobante'), this.stBuscarComprobante, 'idcomprobante', 'numcomprobante');
////        else
////            Ext.getCmp('cbBuscarComprobante').enable();
//
//        if (scope.confEspecialidad) {
//            //ESPECIALIDAD
//            if (this.stBuscarEspecialidad.getCount() == 1)
//                scope.fLoadOneData(Ext.getCmp('cbBuscarEspecialidad'), this.stBuscarEspecialidad, 'idespecialidad', 'especialidad');
//            else
//                Ext.getCmp('cbBuscarEspecialidad').enable();
//        }
//        //EJERCICIO
//        if (this.stBuscarEjercicio.getCount() == 1)
//            scope.fLoadOneData(Ext.getCmp('cbBuscarEjercicio'), this.stBuscarEjercicio, 'idejercicio', 'nombre');
//        else
//            Ext.getCmp('cbBuscarEjercicio').enable();
//
//        //PERIODO
//        if (this.stBuscarPeriodo.getCount() == 1) {
//            scope.fLoadOneData(Ext.getCmp('cbBuscarPeriodo'), this.stBuscarPeriodo, 'idperiodo', 'nombre');
//            scope.fLoadDateInicioFin(data.periodos.inicio, data.periodos.fin);
//        }
//        else
//            Ext.getCmp('cbBuscarPeriodo').enable();
    },
    loadMessageBox: function (msg) {
        Ext.MessageBox.show({
            title: scope.etiquetas.lbMsgEspere,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function (v) {
            return function () {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    },
    initWindow: function (scope) //CARGAR TODOS LOS COMBOS DEL BUSCAR
    {
        scope.fShowWindow();
    },
    initializeEvents: function (scope) {
        scope.cbBuscarTipoDoc.on('keypress', function (t, e) {
            scope.fClearValue(e, this);
        });

        // scope.cbBuscarClienteProveedor.on('keypress', function(t, e) {
        //     scope.fClearValue(e, this);
        // });

        scope.cbBuscarDocFiscales.on('keypress', function (t, e) {
            scope.fClearValue(e, this);
        });

        scope.cbBuscarEspecialidad.on('keypress', function (t, e) {
            scope.fClearValue(e, this);
        });

        scope.cbBuscarComprobante.on('keypress', function (t, e) {
            scope.fClearValue(e, this);
        });

        scope.cbBuscarEstado.on('keypress', function (t, e) {
            scope.fClearValue(e, this);
        });

        scope.cbBuscarTipoFecha.on('keypress', function (t, e) {
            scope.fClearValue(e, this);
        });

        scope.cbBuscarCuenta.on('keypress', function (t, e) {
            scope.fClearValue(e, this);
        });

        scope.cbBuscarSubsistema.on('keypress', function (t, e) {
            scope.fClearValue(e, this);
        });

        scope.cbBuscarEjercicio.on('keypress', function (t, e) {
            scope.fClearValue(e, this, 'Ejercicio');
        });

        scope.cbBuscarEjercicio.on('select', function (combo, record, index) {
            scope.stBuscarPeriodo.baseParams = {
                idejercicio: record.get('idejercicio')
            };
            scope.stBuscarPeriodo.load();
            scope.fLoadDateInicioFin(record.get('inicio'), record.get('fin'));
            scope.cbBuscarPeriodo.clearValue();
        });

        scope.cbBuscarPeriodo.on('keypress', function (t, e) {
            scope.fClearValue(e, this, 'Periodo');
        });

        scope.cbBuscarPeriodo.on('select', function (combo, record, index) {
            scope.fLoadDateInicioFin(record.get('inicio'), record.get('fin'));
        });

        this.addEvents('closeBuscar');
        this.addEvents('buscarDuo');

        this.btnBuscarCerrar.on('click', function (component) {
            scope.wBuscarDuo.close();
            scope.fireEvent('closeBuscar', true);
        });

        scope.wBuscarDuo.on('close', function () {
            scope.wBuscarDuo.close();
            scope.fireEvent('closeBuscar', true);
        });

        this.btnBuscarAceptar.on('click', function (component) {
            if (!scope.cbBuscarTipoFecha.getValue())
                scope.cbBuscarTipoFecha.setValue(1);

            scope.wBuscarDuo.close();
            scope.fireEvent('buscarDuo', {
                //tipoDuo: scope.tipoDuo,
                numero: scope.tfBuscarNumeroDocumento.getValue(),
                numerocontrato: scope.tfBuscarNumeroContrato.getValue(),
                idcuenta: scope.cbBuscarCuenta.getValue(),
                idsubsistema: scope.cbBuscarSubsistema.getValue(),
                iddoc: scope.cbBuscarTipoDoc.getValue(),
                idestadodocumento: scope.cbBuscarEstado.getValue(),
                importe: scope.tfBuscarImporte.getValue(),
                idcliente: scope.cbBuscarClienteProveedor.getValue(),
                numcomprobante: scope.cbBuscarComprobante.getValue(),
                idespecialidad: scope.cbBuscarEspecialidad.getValue(),
                tipofecha: scope.cbBuscarTipoFecha.getValue(),
                fechainicio: scope.dfBuscarDesde.getRawValue(),
                idrango: scope.cbBuscarRangoFecha.getValue(),
                fechafin: scope.dfBuscarHasta.getRawValue()
            });
        });
    },
    initializeFunctions: function (scope) {
        this.fShowWindow = function () {
            scope.wBuscarDuo.show(Ext.getBody(), function () {
                scope.wBuscarDuo.doLayout(true);
                if (Ext.MessageBox)
                    Ext.MessageBox.hide();
                FormValidationjs(scope.fpBuscarDuo, [scope.btnBuscarAceptar]);
            });
        };

        this.fLoadOneData = function (combo, store, id, name) {
            combo.disable();
            combo.setValue(store.getAt(0).get(id));
            combo.setRawValue(store.getAt(0).get(name));
        };

        this.fLoadDateInicioFin = function (inicio, fin) {
            scope.dfBuscarDesde.setRawValue(inicio);
            scope.dfBuscarDesde.setMinValue(inicio);
            scope.dfBuscarDesde.setMaxValue(fin);

            scope.dfBuscarHasta.setRawValue(fin);
            scope.dfBuscarHasta.setMinValue(inicio);
            scope.dfBuscarHasta.setMaxValue(fin);
        };

        this.fClearValue = function (e, combo, rango) {
            if ((e.getKey() == 8) || (e.getKey() == 46)) // para el suprimir y borrar
            {
                combo.clearValue();
                if (rango == 'Ejercicio') {
                    scope.cbBuscarPeriodo.clearValue();
                    scope.fLoadDateInicioFin('', '');
                } else if (rango == 'Periodo') {
                    scope.fLoadDateInicioFin('', '');
                }
            }
        };
    }
});
