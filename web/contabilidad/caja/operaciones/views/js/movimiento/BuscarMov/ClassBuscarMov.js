Ext.namespace('Ext.ClassBuscarMov');

Ext.ClassBuscarMov = Ext.extend(Ext.Component, {
    tipoMg: undefined,
    nombreClienteProveedor: undefined,
    url: undefined,
    confEspecialidad: undefined,
    constructor: function (etiquetas, params)
    {
        this.etiquetas = etiquetas;
        Ext.apply(this, params);
        this.tipoMg = params.tipoMg;
        this.confEspecialidad = params.confEspecialidad;
        scope = this;

        if (this.tipoMg == 1) {
            this.nombreClienteProveedor = scope.etiquetas.lbCliente;//'Cliente';
            this.nombreFecha = scope.etiquetas.lbFechaEntrega;//'Fecha de entrega';
        }
        else if (this.tipoMg == 2) {
            this.nombreClienteProveedor = scope.etiquetas.lbProveedor;//'Proveedor';
            this.nombreFecha = scope.etiquetas.lbFechaRecibo;//'Fecha de recibo';
        }
        else if (this.tipoMg == 3) {
            this.nombreClienteProveedor = scope.etiquetas.lbParrafoFiscal;//'ParrafoFiscal';
            this.nombreFecha = scope.etiquetas.lbFechaEntrega;//'Fecha de entrega';
        }
        else if (this.tipoMg == 4) {
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
                    name: 'iddoc'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'abreviatura'
                }
            ])
        });

        this.stBuscarNumeroContrato = new Ext.data.Store({
            url: this.url + 'loadDataContratos',
            sortInfo: {
                field: 'numerocontrato',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                id: 'idclien'
            }, [{
                    name: 'idcontrato',
                    mapping: 'idcontrato'
                }, {
                    name: 'numerocontrato',
                    mapping: 'numerocontrato'
                }
            ])
        });

        // this.stBuscarClienteProveedor = new Ext.data.Store({
        //     url: this.url + 'cargarcliente',
        //     sortInfo: {
        //         field: 'nombrecliente',
        //         direction: "ASC"
        //     },
        //     reader: new Ext.data.JsonReader({
        //         id: 'idclien'
        //     }, [{
        //             name: 'idcliente',
        //             mapping: 'idcliente'
        //         }, {
        //             name: 'nombrecliente',
        //             mapping: 'nombrecliente'
        //         }
        //     ])
        // });

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
            reader: new Ext.data.JsonReader({
            }, [{
                    name: 'idcomprobante',
                    mapping: 'idcomprobante'
                }, {
                    name: 'numcomprobante',
                    mapping: 'numcomprobante',
                    type: 'int'
                }
            ])
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

        var dataEstados = [[8, 'Guardado'], [5, 'Confirmado'], [6, 'Posteado'], [7, 'Cancelado']/*, [3, 'Reembolsado'], [4, 'Depositado']*/];

        this.stBuscarEstado = new Ext.data.SimpleStore({
            fields: ['idestado', 'estado']
        });
        this.stBuscarEstado.loadData(dataEstados);

        //this.stBuscarEstado = new Ext.data.Store({
        //    url: this.url + 'cargarestados',
        //    sortInfo: {
        //        field: 'idestado',
        //        direction: "ASC"
        //    },
        //    reader: new Ext.data.JsonReader({
        //    }, [{
        //            name: 'idestado',
        //            mapping: 'idestadodocumento'
        //        }, {
        //            name: 'estado',
        //            mapping: 'descripcion'
        //        }
        //    ])
        //});

        this.stBuscarTipoFecha = new Ext.data.SimpleStore({
            id: 'stBuscarTipoFecha',
            fields: ['idtipofecha', 'tipofecha'],
            data: [
                [1, (scope.tipoMg == 1) ? scope.etiquetas.lbFechaEntrega : scope.etiquetas.lbFechaRecibo], [2, scope.etiquetas.lbFechaEmision], /* [3, scope.etiquetas.lbFechaRecepcion],*/ [4, scope.etiquetas.lbFechaContabilizacion]]
        });

        this.stBuscarEjercicio = new Ext.data.Store({
            url: this.url + 'getEjercicios',
            sortInfo: {
                field: 'nombre',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
            }, [{
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
            id: 'idperiodo',
            sortInfo: {
                field: 'idperiodo',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
            }, [{
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

        this.wBuscarMov = new Ext.UIBuscarMov(this);
        this.initializeEvents(this);
        this.initializeFunctions(this);
        this.initializeKeyMap(this);

        Ext.Ajax.request({
            url: this.url + 'loadDataSearchMov',
            method: 'POST',
            params: {
                idCajaFondo: this.idCajaFondo
            },
            callback: function (options, success, response)
            {
                Ext.MessageBox.hide();
                var responseData = Ext.decode(response.responseText);
                scope.data = responseData;
                scope.fShowWindow();
                scope.loadDataComponent(responseData, this.action);
            }
        });

        return Ext.ClassBuscarMov.superclass.constructor.call(this);
    },
    loadDataComponent: function (data, action)
    {
        if (data.clienteProv)
            this.stBuscarClienteProveedor.loadData(data.clienteProv);
        if (data.contratos)
            this.stBuscarNumeroContrato.loadData(data.contratos);
        if (data.cuentas)
            this.stBuscarCuenta.loadData(data.cuentas);
        if (data.tipoDocumentos)
            this.stBuscarTipoDoc.loadData(data.tipoDocumentos);
        if (data.subsistemas)
            this.stBuscarSubsistema.loadData(data.subsistemas);
        if (data.numcomprobantes)
            this.stBuscarComprobante.loadData(data.numcomprobantes);
        if (data.estadosMg)
            this.stBuscarEstado.loadData(data.estadosMg);
        if (data.ejercicios)
            this.stBuscarEjercicio.loadData(data.ejercicios);
        if (data.periodos)
            this.stBuscarPeriodo.loadData(data.periodos);

        //CLIENTE-PROVEEDOR
        if (this.stBuscarClienteProveedor.getCount() == 1)
            scope.fLoadOneData(Ext.getCmp('cbBuscarClienteProveedor'), this.stBuscarClienteProveedor, 'idcliente', 'nombrecliente');
        else
            Ext.getCmp('cbBuscarClienteProveedor').enable();

        //CUENTA
        if (this.stBuscarCuenta.getCount() == 1)
            scope.fLoadOneData(Ext.getCmp('cbBuscarCuenta'), this.stBuscarCuenta, 'idcuenta', 'nombre');
        else
            Ext.getCmp('cbBuscarCuenta').enable();

        //TIPO DOCUMENTO
        if (this.stBuscarTipoDoc.getCount() == 1)
            scope.fLoadOneData(Ext.getCmp('cbBuscarTipoDoc'), this.stBuscarTipoDoc, 'iddocumentos', 'denominacion');
        else
            Ext.getCmp('cbBuscarTipoDoc').enable();

        //SUBSISTEMA
        if (this.stBuscarSubsistema.getCount() == 1)
            scope.fLoadOneData(Ext.getCmp('cbBuscarSubsistema'), this.stBuscarSubsistema, 'idsubsistema', 'nombre');
        else
            Ext.getCmp('cbBuscarSubsistema').enable();

        if (scope.confEspecialidad) {
            //ESPECIALIDAD
            if (this.stBuscarEspecialidad.getCount() == 1)
                scope.fLoadOneData(Ext.getCmp('cbBuscarEspecialidad'), this.stBuscarEspecialidad, 'idespecialidad', 'especialidad');
            else
                Ext.getCmp('cbBuscarEspecialidad').enable();
        }
        //EJERCICIO
        if (this.stBuscarEjercicio.getCount() == 1)
            scope.fLoadOneData(Ext.getCmp('cbBuscarEjercicio'), this.stBuscarEjercicio, 'idejercicio', 'nombre');
        else
            Ext.getCmp('cbBuscarEjercicio').enable();

        //PERIODO
        if (this.stBuscarPeriodo.getCount() == 1) {
            scope.fLoadOneData(Ext.getCmp('cbBuscarPeriodo'), this.stBuscarPeriodo, 'idperiodo', 'nombre');
            scope.fLoadDateInicioFin(data.periodos.inicio, data.periodos.fin);
        }
        else
            Ext.getCmp('cbBuscarPeriodo').enable();
    },
    loadMessageBox: function (msg)
    {
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
    initializeEvents: function (scope)
    {

        //---------
        scope.stBuscarEjercicio.on('load', function () {
            scope.cbBuscarEjercicio.setValue(scope.data.ejercicioActual);
        });

        scope.stBuscarPeriodo.on('load', function () {
            if(scope.data.periodoActual && (scope.stBuscarPeriodo.find('idperiodo', scope.data.periodoActual) !=-1)) {
                scope.cbBuscarPeriodo.setValue(scope.data.periodoActual);
                scope.cbBuscarPeriodo.fireEvent('select');
            }else {
                scope.cbBuscarPeriodo.reset();
            }
        });

        scope.cbBuscarPeriodo.on('select', function (combo) {
            var index = scope.stBuscarPeriodo.find('idperiodo', scope.cbBuscarPeriodo.getValue());
            var recordPeriodo = scope.stBuscarPeriodo.getAt(index);
            if(recordPeriodo) {
                scope.dfBuscarDesde.setValue(recordPeriodo.data.inicio);
                scope.dfBuscarDesde.clearInvalid();
                scope.dfBuscarHasta.setValue(recordPeriodo.data.fin);
                scope.dfBuscarHasta.clearInvalid();
            }
        });

        scope.cbBuscarTipoDoc.on('keypress', function (t, e) {
            scope.fClearValue(e, this);
        });

        scope.cbBuscarClienteProveedor.on('keypress', function (t, e) {
            scope.fClearValue(e, this);
        });

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

        //scope.cbBuscarPeriodo.on('select', function (combo, record, index) {
        //    scope.fLoadDateInicioFin(record.get('inicio'), record.get('fin'));
        //});

        this.addEvents('closeBuscar');
        this.addEvents('buscarMg');

        this.btnBuscarCerrar.on('click', function (component)
        {
            scope.wBuscarMov.close();
            scope.fireEvent('closeBuscar', true);
        });

        this.btnBuscarAceptar.on('click', function (component)
        {
            if (!scope.cbBuscarTipoFecha.getValue())
                scope.cbBuscarTipoFecha.setValue(1);

           //scope.loadMessageBox(scope.etiquetas.lbMsgLoadData);//'Buscando...');
            scope.wBuscarMov.close();
            scope.fireEvent('buscarMov', {
                numerodocumento: scope.tfBuscarNumeroDocumento.getValue(),
                idestadodoc: scope.cbBuscarEstado.getValue(),
                importe: scope.tfBuscarImporte.getValue(),
                numCO: scope.cbBuscarComprobante.getRawValue(),
                fechainicio: scope.dfBuscarDesde.getRawValue(),
                fechafin: scope.dfBuscarHasta.getRawValue(),
                idPeriodo: scope.cbBuscarPeriodo.getValue(),
                idcliente: scope.cbBuscarClienteProveedor.getValue()
            });
        });
    },
    initializeFunctions: function (scope)
    {
        this.fShowWindow = function ()
        {
            scope.wBuscarMov.show(Ext.getBody(), function ()
            {
                scope.wBuscarMov.doLayout(true);
                if (Ext.MessageBox)
                    Ext.MessageBox.hide();
            });
        };

        this.fLoadOneData = function (combo, store, id, name)
        {
            combo.disable();
            combo.setValue(store.getAt(0).get(id));
            combo.setRawValue(store.getAt(0).get(name));
        };

        this.fLoadDateInicioFin = function (inicio, fin)
        {
            scope.dfBuscarDesde.setRawValue(inicio);
            scope.dfBuscarDesde.setMinValue(inicio);
            scope.dfBuscarDesde.setMaxValue(fin);

            scope.dfBuscarHasta.setRawValue(fin);
            scope.dfBuscarHasta.setMinValue(inicio);
            scope.dfBuscarHasta.setMaxValue(fin);
        };

        this.fClearValue = function (e, combo, rango)
        {
            if ((e.getKey() == 8) || (e.getKey() == 46)) // para el suprimir y borrar
            {
                combo.clearValue();
                if (rango == 'Ejercicio') {
                    scope.cbBuscarPeriodo.clearValue();
                    scope.fLoadDateInicioFin('', '');
                }
                else if (rango == 'Periodo') {
                    scope.fLoadDateInicioFin('', '');
                }
            }
        };
    },
    initializeKeyMap: function (scope) {
        var keyMapSearch = new Ext.KeyMap(document, [
            {
                key: Ext.EventObject.ESC,//ESCAPE Cerrar ventana
                alt: false,
                fn: function () {
                    scope.wBuscarMov.close();
                    scope.fireEvent('closeBuscar', true);
                    keyMapSearch.disable();
                }
            }
        ]);
    }
});