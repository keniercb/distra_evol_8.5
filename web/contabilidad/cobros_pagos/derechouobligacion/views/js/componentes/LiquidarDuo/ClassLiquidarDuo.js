Ext.namespace('Ext.ClassLiquidarDuo');
Ext.ClassLiquidarDuo= Ext.extend(Ext.Component, {
    etiquetas: undefined,
    // scope: this,
    constructor: function(etiquetas, params, tipoduo, tipoContabilizacion, fechaContable, desde, hasta)
    {
        // this.etiquetas = etiquetas;
        Ext.apply(this, params);
        var scope = this;
        this.tipoDuo = tipoduo;
        this.tipoContabilizacion = tipoContabilizacion;
        this.fechaContable = fechaContable;
        this.desde = desde;
        this.hasta = hasta;
        if (!document.getElementById('etiqueta')) {
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/LiquidarDuo/etiquetas/es/liquidar.etiquetas", "etiqueta", function () {
                scope.init(scope);
            });
        } else {
            scope.init(scope);
        }

        return Ext.ClassLiquidarDuo.superclass.constructor.call(this);
    },
    init: function (scope) {
        scope.etiquetas = scope.etiquetasPorTipoDuo(scope);
        scope.wLiquidarDuo= new Ext.UILiquidarDuo(scope);
        scope.initializeEvents(scope);
        scope.initializeFunctions(scope);
        scope.loadDataComponent(scope);
    },
    loadDataComponent: function(scope)
    {
        if (scope.tipoContabilizacion === 1) {
            scope.fShowWindow();
            scope.stLiquidarOperacion.load();
            scope.tfImporteRestante.setValue(scope.pendienteliq);
        } else if (scope.tipoContabilizacion === 2) {
            // scope.gpLiquidarDuo.suspendEvents();
            // var mask = Ext.LoadMask(scope.gpLiquidarDuo, {msg: 'Cargando...'});
            // mask.show();
            Ext.Ajax.request({
                url: 'loadDataLiquidaciones',
                method: 'POST',
                params: {
                    idderechouobligacion: scope.idderechouobligacion
                },
                callback: function(options, success, response)
                {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.cantidad > 0) {
                        scope.fShowWindow();
                        scope.stLiquidar.loadData(responseData.arrayLiq);
                        // scope.tfImporteRestante.setValue(responseData.totalLiq);
                        scope.tfImporteRestante.setValue(0);
                        scope.gpLiquidarDuo.suspendEvents();
                    }
                    else {
                        mostrarMensaje(1, 'La liquidaci&oacute;n que desea cancelar no fue realizada desde esta interfaz');
                    }
                    // mask.hide();
                }
            });
        }
    },
    loadJs: function (jsSrc, id = null, onload = function () {}) {
        if (jsSrc != null) {
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            if (id != null) {
                tagScript.setAttribute("id", id);
            }
            tagScript.setAttribute("src", jsSrc + ".js");
            tagScript.onload = onload;
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    },
    etiquetasPorTipoDuo: function(scope) {
        if (scope.tipoDuo == 1) {
            return etiqueta.cobro;
        } else if (scope.tipoDuo == 2) {
            return etiqueta.pago;
        } else if (scope.tipoDuo == 3) {
            return etiqueta.cobroAnticipado;
        } else if (scope.tipoDuo == 4) {
            return etiqueta.pagoAnticipado;
        }
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
        var me = this;
        this.addEvents('closeLiquidar');
        this.wLiquidarDuo.on('close', function () {
            scope.fireEvent('closeLiquidar', true);
        });

        this.wLiquidarDuo.on('show', function () {
            scope.fpCancelarAnticipo.getForm().isValid();
        });

        scope.stLiquidar.on('load', function () {
            // scope.smLiquidar.selectAll();
        });
        
        this.btnCancelar.on('click', function(component)
        {
            scope.wLiquidarDuo.close();
            scope.fireEvent('closeLiquidar', true);
        });
        
        this.stLiquidarOperacion.on('load', function (store, records, opt) {
            if (records.length <= 0){
                mostrarMensaje(1, me.etiquetas.lbMsgNoOperaciones);
            } else if (records.length === 1) {
                scope.cbLiquidarOperacion.setValue(records[0].get('idnomoperaciones'));
                scope.cbLiquidarOperacion.fireEvent('select', null, records[0], 0);
                scope.cbLiquidarOperacion.disable();
            } else {
                scope.cbLiquidarOperacion.enable();
            }
        });

        this.cbLiquidarOperacion.on('select', function (combo, record, index) {
            me.cbLiquidarCuenta.reset();
            var modelo = me.stLiquidarOperacion.data.items[index].json.modelo;
            var idcuenta = [];
            if (modelo) {
                for (var i = 0; i < modelo.length; i++) {
                    if (modelo[i].cuentas) {
                        var temp = Ext.decode(modelo[i].cuentas);
                        idcuenta.push(temp.idcuenta);
                    }

                }
                if (idcuenta.length > 0) {
                    me.stLiquidarCuenta.baseParams.arrayIdCuenta = Ext.encode(idcuenta);
                    me.cbLiquidarCuenta.load();
                    Ext.getCmp('btnAdd').enable();
                    me.cbLiquidarCuenta.enable();
                } else {
                    mostrarMensaje(1, me.etiquetas.lbMsgIncorrectasOperaciones);
                }
            } else {
                mostrarMensaje(1, me.etiquetas.lbMsgNoModelosOperaciones);
                me.cbLiquidarCuenta.disable();
            }
        });

        this.addEvents('Liquidar');
        this.btnAceptar.on('click', function(component)
        {
            if (scope.cbLiquidarOperacion.isValid() && scope.tfImporteRestante.getValue() >= 0 &&
                scope.gpLiquidarDuo.getStore().getCount() > 0 && !scope.Estadoeditando && (scope.smLiquidar.id != 'row' ? scope.smLiquidar.hasSelection() : true))
            {
                scope.fLiquidar();
            }
            else {
                if (scope.gpLiquidarDuo.getStore().getCount() === 0) {
                    mostrarMensaje(1, me.etiquetas.lbMsgNoCuentasLiq);
                } else if (scope.tfImporteRestante.getValue() < 0) {
                    mostrarMensaje(1, me.etiquetas.lbMsgCuentasLiqImporteNegativo);
                } else if (scope.Estadoeditando) {
                    mostrarMensaje(1,'Termine de editar la liquidaci&oacute;n antes de proceder');
                } else if (scope.smLiquidar.id != 'row' && !scope.smLiquidar.hasSelection()) {
                    mostrarMensaje(1,'Debe seleccionar al menos una liquidacion para cancelar');
                } else {
                    mostrarMensaje(1, me.etiquetas.lbMsgNoOperacionSeleccionada);
                }
            }
        });

        // this.tfImporteLiquidar.on('keyup', function (textfield, event) {
        //     var valorrestante = me.pendienteliq - textfield.getValue();
        //     me.tfImporteRestante.setValue(Math.ceil(valorrestante * 100)/100);
        // });

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
            scope.cbLiquidarOperacion.disable();
        });

        this.stLiquidar.on('remove', function (store, records, index) {
            if (store.getCount() === 0) {
                scope.cbLiquidarOperacion.enable();
                scope.tfImporteRestante.setValue(scope.pendienteliq);
            }
        });

        scope.smLiquidar.on('rowselect', function (selmodel, index, record) {
            scope.saldo(selmodel);
        });

        scope.smLiquidar.on('rowdeselect', function (selmodel, index, record) {
            scope.saldo(selmodel);
        });

        this.roweditor.on({
            afteredit: function (editor, grid, changes, record, rowIndex) {
                scope.Estadoeditando = false;
                scope.btnAceptar.enable();
                record.data.nomcuenta = scope.cbLiquidarCuenta.displayFieldTemp;
                var importeTotal = 0;
                for (var i = 0; i < scope.gpLiquidarDuo.getStore().getCount(); i++) {
                    importeTotal += parseFloat(Math.abs(scope.gpLiquidarDuo.getStore().getAt(i).data.importemo));
                }
                scope.labelTotal.setText(formatoMoneda(importeTotal));
                scope.tfImporteRestante.setValue(parseFloat(scope.pendienteliq - importeTotal).toFixed(2));
            },
            beforeedit: function (roweditor, grid, record, rowIndex) {
                scope.cbLiquidarCuenta.setValue(record.data.idcuenta, record.data.nomcuenta);
                scope.Estadoeditando = true;
            },
            canceledit: function (roweditor, grid, record, rowIndex) {
                scope.Estadoeditando = false;
            }
        });
        
    },
    initializeFunctions: function(scope)
    {
        this.fLiquidar = function()
        {
            var data = scope.tipoContabilizacion === 1 ? scope.gpLiquidarDuo.getStore().getRange() : scope.gpLiquidarDuo.getSelectionModel().getSelections();
            var TotalLiq = 0;
            var arrayCuentas = [];
            var arrayIdDuo = [];
            for (var i = 0; i < data.length; i++) {
                TotalLiq += data[i].get('importemo');
                arrayCuentas.push({
                    idcuenta: data[i].get('idcuenta'),
                    importemo: data[i].get('importemo'),
                    idliquidacion: data[i].get('idliquidacion'),
                });
            }
            // var parametros = {
            //     tipoDuo: scope.tipoDuo,
			// 	importeliquidar: TotalLiq,
            //     arrayCuentas: Ext.encode(arrayCuentas),
			// 	idoperacion: scope.cbLiquidarOperacion.getValue(),
			// 	idcuentaorigen: scope.idcuenta,
            //     idderechouobligacion: scope.idderechouobligacion,
            //     tipoContabilizacion: scope.tipoContabilizacion,
            //     comentario: scope.tfComentario.getValue() ? scope.tfComentario.getValue() : scope.comentario,
            //     numero: scope.numero,
            //     idmoneda: scope.idmoneda,
            //     idcuenta: scope.idcuenta,
            //     idcliente: scope.idcliente,
            //     idperiodo: scope.idperiodo,
            //     iddoc: scope.iddoc,
            //     numeroInst: scope.tfNumeroInst.getValue(),
			// };
            arrayIdDuo.push({
                arrayCuentas: arrayCuentas,
                importeliquidar: TotalLiq,
                idderechouobligacion: scope.idderechouobligacion
            });
            var parametros = {
                tipoDuo: scope.tipoDuo,
				// importeliquidar: TotalLiq,

                // arrayCuentas: Ext.encode(arrayCuentas),
                arrayIdDuo: Ext.encode(arrayIdDuo),
                fecha: scope.dateFieldLiq.getValue(),

				idoperacion: scope.cbLiquidarOperacion.getValue(),
				// idcuentaorigen: scope.idcuenta,

                // idderechouobligacion: scope.idderechouobligacion,

                tipoContabilizacion: scope.tipoContabilizacion,
                comentario: scope.tfComentario.getValue() ? scope.tfComentario.getValue() : scope.comentario,
                // numero: scope.numero,
                // idmoneda: scope.idmoneda,
                // idcuenta: scope.idcuenta,
                // idcliente: scope.idcliente,
                // idperiodo: scope.idperiodo,
                // iddoc: scope.iddoc,
                numeroInst: scope.tfNumeroInst.getValue(),
			};
			actionContabiliza = 'Liquidar';
			scope.fireEvent('Liquidar', parametros);
        };

        this.saldo = function (selmodel) {
            if (scope.tipoContabilizacion === 2) {
                var sum = 0;
                var records = selmodel.getSelections();
                for (var i = 0; i < records.length; i++) {
                    sum += records[i].get('importemo');
                }
                scope.tfImporteRestante.setValue(parseFloat(sum).toFixed(2));
                scope.labelTotal.setText(formatoMoneda(sum));
            }
        };

        this.fShowWindow = function()
        {
            scope.wLiquidarDuo.show(Ext.getBody(), function()
            {
                scope.wLiquidarDuo.doLayout(true);
                if (Ext.MessageBox)
                    Ext.MessageBox.hide();
            });
        };

        this.closeLiquidar = function () {
            scope.wLiquidarDuo.close();
            scope.fireEvent('closeLiquidar', true);
        };

        this.deleteLiquidar = function () {
            var seleccionado = this.gpLiquidarDuo.getSelectionModel().getSelected();
            var texto = scope.labelTotal.text;
            texto = texto.replace(',', '');
            scope.tfImporteRestante.setValue(scope.tfImporteRestante.getValue() + seleccionado.get('importemo'));
            scope.labelTotal.setText(formatoMoneda(parseFloat(texto) - seleccionado.get('importemo')));
            this.gpLiquidarDuo.getStore().remove(seleccionado);
            if (this.gpLiquidarDuo.getStore().getCount() == 0)
                this.btnAceptar.disable();
            else this.btnAceptar.enable();
        }
    }
});
