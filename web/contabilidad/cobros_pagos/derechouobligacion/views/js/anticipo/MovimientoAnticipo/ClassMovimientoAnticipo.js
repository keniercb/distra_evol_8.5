Ext.namespace('Ext.ClassCancelarAnticipo');
Ext.ClassMovimientoAnticipo = Ext.extend(Ext.Component, {
    etiquetas: undefined,
    cInicial: undefined,
	
    tipoAnticipo: undefined,
	
	url: undefined,
    numero: undefined,
	importe: '',
    constructor: function(etiquetas, params)
    {
        this.etiquetas = etiquetas;
        // scope = this;
        Ext.apply(this, params);
		this.importe = params.importe;
		this.numero = params.numero;
        // this.cInicial = params.cInicial;
        // this.arrayIdAnticipo = params.arrayIdAnticipo;
        // this.numeros = params.arrayNumCancelar;
        // this.tipoAnticipo = params.tipoAnticipo;
        // this.estadoDoc = params.estadoDoc;
        this.tipoDuo = params.tipoAnticipo;
        this.url = params.url;
		
        // Ext.apply(this);
		this.cInicial = '';
        this.arrayIdAnticipo = '';
        this.numeros = '';
        this.estadoDoc = '';


        // this.stCancelarMotivo = new Ext.data.Store({
            // url: scope.url + 'cargarmotivocancelacion',
            // sortInfo: {
                // field: 'descripcion',
                // direction: "ASC"
            // },
            // reader: new Ext.data.JsonReader({
                // id: 'idmotivocancelacion'
            // }, [{
                    // name: 'idmotivocancelacion'
                // },
                // {
                    // name: 'descripcion'
                // }
            // ])
        // });

		this.stMovimientoOperacion = new Ext.data.Store({
		   url: scope.url + 'cargaroperacioncancelacion',
		   reader: new Ext.data.JsonReader({
			   id: 'idnomoperaciones'
		   }, [{
				   name: 'idnomoperaciones'
			   },
			   {
				   name: 'denominacion'
			   }
		   ])
		});

        this.wMovimientoAnticipo = new Ext.UIMovimientoAnticipo(this);
        this.initializeEvents(this);
        this.initializeFunctions(this);
		this.loadDataComponent(this);

        return Ext.ClassMovimientoAnticipo.superclass.constructor.call(this);
    },
    loadDataComponent: function(scope)
    {
        scope.fShowWindow();
		scope.tfImporteMovimiento.setValue(scope.importe);
		Ext.Ajax.request({
            url: scope.url + 'loadDataOperacionCancelacion',
            method: 'POST',
            params: {
                tipoDuo: scope.tipoDuo,
                idmoneda: scope.idmoneda,
            },
            callback: function(options, success, response)
            {
				// scope = this;
                Ext.getBody().unmask();
                responseData = Ext.decode(response.responseText);
                if (responseData.cantidad > 0) {
					scope.stMovimientoOperacion.loadData(responseData.operacion);
				}
                else {
                    mostrarMensaje(1, 'No existen operaciones configuradas para el movimiento de un anticipo');
				}
					// scope.loadDataComponent(scope, responseData);
            }
        });
//        this.stMovimientoOperacion.loadData(data.operaciones);
        // this.stCancelarMotivo.loadData(data.motivos);

        // //Motivos de cancelacion
        // if (this.stCancelarMotivo.getCount() == 1) {
            // scope.cbCancelarMotivo.disable();
            // scope.cbCancelarMotivo.setValue(this.stCancelarMotivo.getAt(0).get('idmotivocancelacion'));
            // scope.cbCancelarMotivo.setRawValue(this.stCancelarMotivo.getAt(0).get('descripcion'));
        // }
        // else
            // scope.cbCancelarMotivo.enable();

        //Operaciones de cancelacion
//        if (this.stMovimientoOperacion.getCount() == 1) {
//            scope.cbMovimientoOperacion.disable();
//            scope.cbMovimientoOperacion.setValue(this.stMovimientoOperacion.getAt(0).get('idoperacion'));
//            scope.cbMovimientoOperacion.setRawValue(this.stMovimientoOperacion.getAt(0).get('denominacion'));
//        }
//        else
//            scope.cbMovimientoOperacion.enable();

        /*if (!scope.cbCancelarMotivo.disabled)
            scope.cbCancelarMotivo.focus(true, 1000);
        else
            scope.dfMovimientoFecha.focus(true, 1000);*/
    },
    loadMessageBox: function(msg)
    {
        Ext.MessageBox.show({
            title: 'Cargando...',
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function(v) {
            return function() {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    },
    initializeEvents: function(scope)
    {
        this.addEvents('closeCancelar');
        this.btnMovimientoCerrar.on('click', function(component)
        {
            scope.wMovimientoAnticipo.close();
        });

        scope.wMovimientoAnticipo.on('close', function () {
            scope.fireEvent('closeCancelar', true);
        });

        this.addEvents('cancelarContabilizado');
        // this.btnMovimientoAceptar.on('click', function(component)
        // {
        //     if (scope.cbMovimientoOperacion.isValid() && scope.tfImporteMovimiento.getValue() > 0)
        //     {
        //         scope.fMovimientoAnticipo();
        //     }
        //     else
        //         mostrarMensaje(1, scope.etiquetas.lbValIncorrectos);
        // });

        this.stMovimientoOperacion.on('load', function (store, records, opt) {
            if (records.length <= 0){
                mostrarMensaje(1, scope.etiquetas.lbMsgNoOperaciones);
            } else if (records.length === 1) {
                scope.cbMovimientoOperacion.setValue(records[0].get('idnomoperaciones'));
                scope.cbMovimientoOperacion.fireEvent('select', null, records[0], 0);
                scope.cbMovimientoOperacion.disable();
            } else {
                scope.cbMovimientoOperacion.enable();
            }
        });

        this.cbMovimientoOperacion.on('select', function (combo, record, index) {
            scope.cbLiquidarCuenta.reset();
            var modelo = scope.stMovimientoOperacion.data.items[index].json.modelo;
            var idcuenta = [];
            if (modelo) {
                for (var i = 0; i < modelo.length; i++) {
                    if (modelo[i].cuentas) {
                        var temp = Ext.decode(modelo[i].cuentas);
                        idcuenta.push(temp.idcuenta);
                    }

                }
                if (idcuenta.length > 0) {
                    scope.stLiquidarCuenta.baseParams.arrayIdCuenta = Ext.encode(idcuenta);
                    scope.cbLiquidarCuenta.load();
                    Ext.getCmp('btnAdd').enable();
                    scope.cbLiquidarCuenta.enable();
                } else {
                    mostrarMensaje(1, scope.etiquetas.lbMsgIncorrectasOperaciones);
                    scope.cbLiquidarCuenta.disable();
                    Ext.getCmp('btnAdd').disable();
                }
            } else {
                mostrarMensaje(1, scope.etiquetas.lbMsgNoModelosOperaciones);
                scope.cbLiquidarCuenta.disable();
                Ext.getCmp('btnAdd').disable();
            }
        });

        this.rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    mostrarMensaje(2, scope.etiquetas.lbPregEliminar, function (btnPress) {
                        if (btnPress === 'ok') {
                            scope.deleteLiquidar();
                        }
                    });
                    break;
            }
        });

        this.stLiquidar.on('add', function (store, records, index) {
            scope.cbMovimientoOperacion.disable();
        });

        this.stLiquidar.on('remove', function (store, records, index) {
            if (store.getCount() === 0) {
                scope.cbMovimientoOperacion.enable();
                scope.tfImporteMovimiento.setValue(scope.importe);
            }
        });

        // scope.smLiquidar.on('rowselect', function (selmodel, index, record) {
        //     scope.saldo(selmodel);
        // });
        //
        // scope.smLiquidar.on('rowdeselect', function (selmodel, index, record) {
        //     scope.saldo(selmodel);
        // });

        this.roweditor.on({
            afteredit: function (editor, grid, changes, record, rowIndex) {
                scope.Estadoeditando = false;
                scope.btnMovimientoAceptar.enable();
                record.data.nomcuenta = scope.cbLiquidarCuenta.displayFieldTemp;
                var importeTotal = 0;
                for (var i = 0; i < scope.gpLiquidarDuo.getStore().getCount(); i++) {
                    importeTotal += parseFloat(Math.abs(scope.gpLiquidarDuo.getStore().getAt(i).data.importemo));
                }
                scope.tfImporteMovimiento.setValue(parseFloat(scope.importe - importeTotal).toFixed(2));
            },
            beforeedit: function (roweditor, grid, record, rowIndex) {
                scope.cbLiquidarCuenta.setValue(record.data.idcuenta, record.data.nomcuenta);
                scope.Estadoeditando = true;
            },
            canceledit: function (roweditor, grid, record, rowIndex) {
                scope.Estadoeditando = false;
            }
        });

        this.btnMovimientoAceptar.on('click', function(component)
        {
            if (scope.cbMovimientoOperacion.isValid() && scope.tfImporteMovimiento.getValue() >= 0 && scope.gpLiquidarDuo.getStore().getCount() > 0 && !scope.Estadoeditando)
            {
                scope.fMovimientoAnticipo();
            }
            else {
                if (scope.gpLiquidarDuo.getStore().getCount() === 0) {
                    mostrarMensaje(1, scope.etiquetas.lbMsgNoCuentasLiq);
                } else if (scope.tfImporteMovimiento.getValue() < 0) {
                    mostrarMensaje(1, scope.etiquetas.lbMsgCuentasLiqImporteNegativo);
                } else if (scope.Estadoeditando) {
                    mostrarMensaje(1,'Termine de editar la liquidaci&oacute;n antes de proceder');
                } else {
                    mostrarMensaje(1, scope.etiquetas.lbMsgNoOperacionSeleccionada);
                }
            }
        });
        
        // scope.cbCancelarMotivo.on('select', function(t, e) {
        //     scope.btnMovimientoAceptar.enable();
        // });
        //
        // scope.cbCancelarMotivo.on('keypress', function(t, e) {
        //     if (e.getKey() == 13) {
        //         if (!scope.dfMovimientoFecha.disabled)
        //             scope.dfMovimientoFecha.focus(true, 10);
        //     }
        // });
    },
    //CREAR EN GESTIONARAnticipo FUNCTION PARA GUARDAR CANCEL
//            Ext.Ajax.request({
//                                            url: scope.url + 'cancelarAnticipo',
//                                            method: 'POST',
//                                            params: {
//                                                motivo: scope.cbCancelarMotivo.getValue(),
//                                                cInicial: scope.cInicial,
//                                                arrayIdAnticipo: Ext.encode(scope.arrayIdAnticipo),
//                                                tipoAnticipo: scope.tipoAnticipo,
//                                                estadoDoc: scope.estadoDoc,
//                                                fecha: scope.dfMovimientoFecha.getRawValue(),
//                                                idoperacion: scope.cbMovimientoOperacion.getValue(),
//                                                descripcion: descripcion_comprobante,
//                                                detalle: detalle,
//                                                fechaCO: fecha_comprobante
//                                            },
//                                            callback: function(options, success, response)
//                                            {
//                                                responseData = Ext.decode(response.responseText);
//                                                respuesta = responseData.valor;
//                                                arrayNumCO = responseData.numCO;
//                                                if (respuesta == 1 || respuesta == '1')
//                                                    scope.fireEvent('cancelarAnticipo', arrayNumCO);
//                                            }
//                                        });
    initializeFunctions: function(scope)
    {
        this.fMovimientoAnticipo = function()
        {
            scope.wMovimientoAnticipo.close();

            var data = scope.gpLiquidarDuo.getStore().getRange();
            var TotalLiq = 0;
            var arrayCuentas = [];
            for (var i = 0; i < data.length; i++) {
                TotalLiq += data[i].get('importemo');
                arrayCuentas.push({
                    idcuenta: data[i].get('idcuenta'),
                    importemo: data[i].get('importemo'),
                });
            }

			parametros = {
				url: "cancelarAnticipo",
				tipoAnticipo: scope.tipoAnticipo,
				importe: TotalLiq,
				arrCuentas: Ext.encode(arrayCuentas),
				idoperacion: scope.cbMovimientoOperacion.getValue(),
				comentario: scope.tfComentario.getValue(),
			};
			tipoContabilizacion = 2;
			actionContabiliza = 'cancelarContabilizado';
			scope.fireEvent('cancelarContabilizado', {actionContabiliza: actionContabiliza, tipoContabilizacion: tipoContabilizacion, parametros: parametros});
        };

        this.fShowWindow = function()
        {
            scope.wMovimientoAnticipo.show(Ext.getBody(), function()
            {
                scope.wMovimientoAnticipo.doLayout(true);
                if (Ext.MessageBox)
                    Ext.MessageBox.hide();
            });
        };

        this.deleteLiquidar = function () {
            var seleccionado = scope.gpLiquidarDuo.getSelectionModel().getSelected();
            scope.tfImporteMovimiento.setValue(scope.tfImporteMovimiento.getValue() + seleccionado.get('importemo'));
            this.gpLiquidarDuo.getStore().remove(seleccionado);
            if (this.gpLiquidarDuo.getStore().getCount() == 0)
                this.btnMovimientoAceptar.disable();
            else this.btnMovimientoAceptar.enable();
        }

        // this.saldo = function (selmodel) {
        //     if (scope.tipoContabilizacion === 2) {
        //         var sum = 0;
        //         var records = selmodel.getSelections();
        //         for (var i = 0; i < records.length; i++) {
        //             sum += records[i].get('importemo');
        //         }
        //         scope.tfImporteRestante.setValue(parseFloat(sum).toFixed(2));
        //         scope.labelTotal.setText(formatoMoneda(sum));
        //     }
        // };
    }
});
