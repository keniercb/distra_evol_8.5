Ext.namespace('Configuracion.Unificacion');
Configuracion.Unificacion.PanelInformacion = Ext.extend(Ext.Panel, {
    constructor: function (params) {
        this.btnAyudaUnificacion = new Ext.Button({
            id: 'btnAyudaUnificacion',
            text: params.idioma.lbbtnayuda,
            tooltip: params.idioma.tooltipayuda,
            iconCls: 'ayuda'
        });
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            labelAlign: 'top',
            buttonAlign: 'right',
            title: this.idioma.lbTitleInformacion,
            idioma: params.idioma,
            perfil: params.perfil,
            tbar : ['->',this.btnAyudaUnificacion]
        });
        this.createGridPanelCobroPago();
        this.createGridPanelCaja();
        this.createGridPanelContabilidad();
        this.createGridPanelBanco();
        this.createTabPanel();
        this.initEventsInformacion();
        Configuracion.Unificacion.PanelInformacion.superclass.constructor.call(this);
    },
    initEventsInformacion: function () {
        this.stDerechosObigaciones.on({
            beforeload: function(store, options) {
                store.removeAll();
            },
            load: function (st, records, options) {
                if(this.reader.jsonData.unificado){
                    this.scope.btnUnificarCobroPago.disable();
                }
                else {
                    // this.scope.btnUnificarCobroPago.enable();
                }
            }
        });

        this.stContabilidad.on({
            load: function (st, records, options) {
                // this.scope.btnUnificarContabilidad.enable();
            }
        });

        this.btnUnificarCobroPago.on({
            scope: this,
            click: function () {
                if (!this.scope.PanelConfiguracion.cbTasaUnificar.isValid()) {
                    mostrarMensaje(1, this.idioma.msgSinTasa);
                }
                else {
                    //seleccionar por cada idderechouobligacion el idcuenta que esta asociado a la cuenta de la factura
                    var records = [];
                    var recordsAux = [];
                    var recordsCuentas = [];
                    var recIdCuenta = [];
                    flagExiste = false;
                    // for (var j = 0; j < this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getCount(); j++) {
                    //     recordsCuentas.push({
                    //         idCuentaOrigen: this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getAt(j).data.idcuenta,
                    //         idCuentaDestino: this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getAt(j).data.idcuentadestino
                    //     });
                    // }

                    //Agrupando cuentas por cobrar, pagar, pago anticipado y cobro anticipado
                    var allDerechosObligaciones = this.stDerechosObigaciones.getRange();
                    var arrAuxAgrupadoObj = [];
                    var arrAux = [];
                    allDerechosObligaciones.forEach(function(value, index, allItems){
                        if(index == 0) {
                            arrAuxAgrupadoObj.push({
                                idDuo: value.data.idderechouobligacion,
                                idTipoDoc: value.data.idtipodocumento,
                                idCuentaDuo: value.data.idcuenta,
                                importe: Math.abs(parseFloat(value.data.importemb) - parseFloat(value.data.liquidadomb))
                            });

                            arrAux.push(value.data.idcuenta);
                        }
                        else {
                            var ix = arrAux.indexOf(value.data.idcuenta);
                            if(ix > -1) {
                                //Esto significa que encontró el elemento, se modifica
                                arrAuxAgrupadoObj[ix].importe += Math.abs(parseFloat(value.data.importemb) - parseFloat(value.data.liquidadomb));
                            }
                            else {
                                //Esto significa que no lo encontró, se agrega nueva
                                arrAuxAgrupadoObj.push({
                                    idDuo: value.data.idderechouobligacion,
                                    idTipoDoc: value.data.idtipodocumento,
                                    idCuentaDuo: value.data.idcuenta,
                                    importe: Math.abs(parseFloat(value.data.importemb) - parseFloat(value.data.liquidadomb))
                                });

                                arrAux.push(value.data.idcuenta);
                            }
                        }
                    });

                    var cantarrAuxAgrupadoObj = arrAuxAgrupadoObj.length;
                    for (var i = 0; i < cantarrAuxAgrupadoObj; i++) {
                        for (var j = 0; j < this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getCount(); j++) {
                            if (arrAuxAgrupadoObj[i].idCuentaDuo == this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getAt(j).data.idcuenta) {
                                recordsAux.push({
                                    idDuo: arrAuxAgrupadoObj[i].idDuo,
                                    idTipoDoc: arrAuxAgrupadoObj[i].idTipoDoc,
                                    idCuentaDuo: arrAuxAgrupadoObj[i].idCuentaDuo,
                                    idCuentaDestino: this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getAt(j).data.idcuentadestino,
                                    importe: arrAuxAgrupadoObj[i].importe
                                });
                                break;
                            }
                        }
                    }

                    for (var i = 0; i < this.stDerechosObigaciones.getCount(); i++) {
                        for (var j = 0; j < this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getCount(); j++) {
                            if (this.stDerechosObigaciones.getAt(i).data.idcuenta == this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getAt(j).data.idcuenta) {
                                records.push({
                                    idDuo: this.stDerechosObigaciones.getAt(i).data.idderechouobligacion,
                                    idTipoDoc: this.stDerechosObigaciones.getAt(i).data.idtipodocumento,
                                    idCuentaDuo: this.stDerechosObigaciones.getAt(i).data.idcuenta,
                                    idCuentaDestino: this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getAt(j).data.idcuentadestino,
                                    importe: this.stDerechosObigaciones.getAt(i).data.importemb - this.stDerechosObigaciones.getAt(i).data.liquidadomb
                                });
                                break;
                            }
                        }
                    }

                    var params = {
                        idsubsistema: 6,
                        // arrayData: Ext.encode(records),
                        // arrayDataAux: Ext.encode(recordsAux),
                        // arrayDataCtas: Ext.encode(recordsCuentas),
                        idmoneda: this.scope.PanelConfiguracion.cbMonedaUnificar.getValue(),
                        moneda: this.scope.PanelConfiguracion.cbMonedaUnificar.getRawValue(),
                        idcuenta: this.scope.PanelConfiguracion.cbCuentas.getValue(),
                        idtasa: this.scope.PanelConfiguracion.cbTasaUnificar.getValue(),
                        factordeconversion: this.scope.PanelConfiguracion.stTasaUnificar.getAt(
                            this.scope.PanelConfiguracion.stTasaUnificar.find('idtasa', this.scope.PanelConfiguracion.cbTasaUnificar.getValue())).data.factordeconversion,
                    }

                    var stDerechosObigaciones = this.stDerechosObigaciones;
                    var context = this;
                    mostrarMensaje(2, this.idioma.quiereRealizarUnificacion, function(btn) {
                        if (btn == 'ok') {
                            context.onloadMessageBox('Por favor espere...', 'Cargando comprobante');
                            Ext.Ajax.request({
                                url: 'loadDataComprobante',
                                method: 'POST',
                                params: params,
                                callback: function (options, success, response) {
                                    Ext.MessageBox.hide();
                                    respData = Ext.decode(response.responseText);
                                    if(respData.comprobantes.length > 0){
                                        mostrarMensaje(1, 'No se puede reallizar el proceso de unificación ya que existen comprobantes sin asentar.');
                                    } else if(respData.unificaSinCmp) {
                                        mostrarMensaje(1, 'El subsistema ha unificado satisfactoriamente.');
                                    } else if(respData.todosUnificados == false) {
                                        mostrarMensaje(1, 'Existen subsistemas que no han unificado.');
                                    }  else if(respData.copaunif == true) {
                                        mostrarMensaje(1, 'Ya cobros y pagos a unificado.');
                                    } else {
                                        var win = Ext.Cont.Comprobante.init(4, respData.detalle, respData.descripcion, respData.fechaCont, respData.dataComprobante, 3, 1, 1);
                                        win.onSaved(function (idCmp, numCmp, fecha) {
                                            if (idCmp) {
                                                params.idcomprobante = idCmp;
                                                params.numcomprobante = numCmp;
                                                params.fechacomprobante = fecha;
                                                context.onloadMessageBox('Por favor espere...', 'Unificando');
                                                Ext.Ajax.request({
                                                    url: 'unificar',
                                                    params: params,
                                                    callback: function (options, success, response) {
                                                        var respuesta = Ext.decode(response.responseText);
                                                        mostrarMensaje(1, "La unificaci&oacute;n monetaria ha sido realizada satisfactoriamente.");
                                                        stDerechosObigaciones.reload();
                                                        Ext.MessageBox.hide();
                                                    }
                                                });
                                            }
                                        }).onClose(function () {
                                            // scope.objWindowsDuo = '';
                                        });
                                    }
                                }

                            });
                        }
                    })
                }
            }
        });

        this.btnUnificarContabilidad.on({
            scope: this,
            click: function () {
                //seleccionar por cada idderechouobligacion el idcuenta que esta asociado a la cuenta de la factura
                var records = [];
                var recordsCuentas = [];
                var recIdCuenta = [];
                flagExiste = false;
                for (var j = 0; j < this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getCount(); j++) {
                    recordsCuentas.push({
                        idCuentaOrigen: this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getAt(j).data.idcuenta,
                        idCuentaDestino: this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getAt(j).data.idcuentadestino
                    });
                }

                for (var i = 0; i < this.stDerechosObigaciones.getCount(); i++) {
                    for (var j = 0; j < this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getCount(); j++) {
                        if (this.stDerechosObigaciones.getAt(i).data.idcuenta == this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getAt(j).data.idcuenta) {
                            records.push({
                                idDuo: this.stDerechosObigaciones.getAt(i).data.idderechouobligacion,
                                idTipoDoc: this.stDerechosObigaciones.getAt(i).data.idtipodocumento,
                                idCuentaOrigen: this.stDerechosObigaciones.getAt(i).data.idcuenta,
                                idCuentaDestino: this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getAt(j).data.idcuentadestino
                            });
                            break;
                        }
                    }
                }

                var params = {
                    idsubsistema: 4,
                    arrayData: Ext.encode(records),
                    arrayDataCtas: Ext.encode(recordsCuentas),
                    idmoneda: this.scope.PanelConfiguracion.cbMonedaUnificar.getValue(),
                    moneda: this.scope.PanelConfiguracion.cbMonedaUnificar.getRawValue(),
                    idcuenta: this.scope.PanelConfiguracion.cbCuentas.getValue(),
                    idtasa: this.scope.PanelConfiguracion.cbTasaUnificar.getValue(),
                    factordeconversion: this.scope.PanelConfiguracion.stTasaUnificar.getAt(
                        this.scope.PanelConfiguracion.stTasaUnificar.find('idtasa', this.scope.PanelConfiguracion.cbTasaUnificar.getValue())).data.factordeconversion,
                }
                var context = this;
                mostrarMensaje(2, this.idioma.quiereRealizarUnificacion, function(btn) {
                    if (btn == 'ok') {
                        context.onloadMessageBox('Por favor espere...', 'Cargando comprobante');
                        Ext.Ajax.request({
                            url: 'loadDataComprobante',
                            method: 'POST',
                            params: params,
                            callback: function (options, success, response) {
                                respData = Ext.decode(response.responseText);
                                if(respData.comprobantes.length > 0){
                                    mostrarMensaje(1, 'No se puede reallizar el proceso de unificación ya que existen comprobantes sin asentar.');
                                } else if(respData.todosUnificados == false) {
                                    mostrarMensaje(1, 'Existen subsistemas que no han unificado.');
                                } else {
                                    var win = Ext.Cont.Comprobante.init(4, respData.detalle, respData.descripcion, respData.fechaCont, respData.dataComprobante, 3, 1, 1);
                                    win.onSaved(function (idCmp, numCmp, fecha) {
                                        Ext.Ajax.request({
                                            url: 'unificar',
                                            params: params,
                                            callback: function (options, success, response) {
                                                var respuesta = Ext.decode(response.responseText);
                                                Ext.MessageBox.hide();
                                                mostrarMensaje(1, this.idioma.unificacionSatisfactoria);
                                            }
                                        });
                                    }).onClose(function () {
                                        // scope.objWindowsDuo = '';
                                    });
                                }
                            }

                        });
                    }
                })
            }
        });

        this.stUnificarCaja.on({
           load: function (st, records, options) {
              this.scope.lbTexCajaunificada.show();
              if( this.reader.jsonData.unificado){
                   this.scope.lbSiCaja.show();
              }
              else{
                  this.scope.lbNoCaja.show();
                  // this.scope.btnUnificarCaja.enable();
              }
           }
        });

        this.btnUnificarCaja.on({
            scope: this,
            click: function (btnUnificarCaja) {
                var problemasResueltos = true;
                this.stUnificarCaja.each(function (record) {
                    if (record.data.idgrupo != 'dietasdivisa') {
                        problemasResueltos = false;
                        return false;
                    }
                }, this.scope);
                /*var arrayCajaFondo = [];
                var fondosSinAsignar = 0;
                this.stFondosUnificar.each(function (record) {
                    if (!record.data.idcajafondoDestino) {
                        fondosSinAsignar += 1;
                    } else {
                        var arrayFondo = [];
                        this.store.scope.stUnificarCaja.each(function (recordCaja) {
                            if (recordCaja.data.idcajafondo == record.data.idcajafondo && recordCaja.data.idgrupo == 'dietasdivisa') {
                                arrayFondo.push(recordCaja.data.iddocumento);
                            }
                        }, this.scope);
                        arrayCajaFondo.push({
                            'origen': record.data.idcajafondo,
                            'destino': record.data.idcajafondoDestino,
                            'documentos': arrayFondo
                        });
                    }
                });*/

                if (problemasResueltos /*&& !fondosSinAsignar*/) {
                    if(this.scope.PanelConfiguracion.cbTasaUnificar.isValid()){
                        mostrarMensaje(2, this.idioma.lbMessageBoxIniciarUnificacion, function (btn) {
                            if (btn == 'ok') {
                                Ext.Msg.wait(this.idioma.lbUnificando, this.idioma.lbEspere);
                                var params = {
                                    idMoneda: this.scope.PanelConfiguracion.cbMonedaUnificar.getValue(),
                                    //idTasa: this.scope.PanelConfiguracion.cbTasaUnificar.getValue(),
                                    //arrayCajaFondo: Ext.encode(arrayCajaFondo)
                                };

                                Ext.Ajax.request({
                                    url: 'unificarcaja',
                                    method: 'POST',
                                    params: params,
                                    callback: function (options, success, response) {
                                        mostrarMensaje(1, this.idioma.msgCajaUnificadoSatif);
                                        btnUnificarCaja.disable();
                                        this.lbSiCaja.show();
                                        this.lbNoCaja.hide();
                                        this.stUnificarCaja.reload();
                                        //this.scope.PanelInformacion.stFondosUnificar.reload();
                                        Ext.MessageBox.hide();
                                    }.bind(this)

                                });
                            }
                        }.bind(this));
                    }
                    else{
                        mostrarMensaje(1, this.idioma.lbMessageBoxFaltanProblemas);
                    }
                }
                /*else if (fondosSinAsignar>0) {
                    if (fondosSinAsignar>1){
                        mostrarMensaje(1, this.idioma.lbMessageBoxFondosSinAsignar);
                    }
                    else{
                        mostrarMensaje(1, this.idioma.lbMessageBoxFondoSinAsignar);
                    }
                }*/
                else {
                    mostrarMensaje(1, this.idioma.lbMessageBoxFaltanProblemas);
                    this.stUnificarCaja.baseParams = {'idMoneda' : this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.baseParams.idMoneda};
                    this.stUnificarCaja.load();
                }
            }
        });
    },
    onloadMessageBox: function(agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl,
            msg: agMsg,
            width: 300,
            wait: true,
            waitConfig: {interval: 300},
            progress: true,
            // closable: false
        });
    },
    createTabPanel: function () {
        this.PanelCaja = new Ext.Panel({
            id: "caja",
            title: this.idioma.lbCaja,
            // disabled: true,
            border: false,
            frame: false,
            tbar: [this.btnUnificarCaja, '->', this.lbTexCajaunificada,' ',this.lbSiCaja , this.lbNoCaja, ' '],
            layout: 'border',
            items: [
                /*{
                    xtype: 'panel',
                    layout: 'fit',
                    region: 'south',
                    height: 200,
                    title: this.idioma.lbFondoUnificar,
                    border: false,
                    split: true,
                    items: this.gpFondoUnificar
                },*/ {
                    xtype: 'panel',
                    layout: 'fit',
                    region: 'center',
                    title: this.idioma.lbTitlePanelCaja,
                    border: false,
                    items: this.gpCaja
                }
            ]
        });

        this.tabPanel = new Ext.TabPanel({
            activeTab: 0,
            frame: true,
            //   width:600,
            //   height:250,
            ///plain:true,
            defaults: {autoScroll: true},
            items: [
                this.PanelCaja,
                this.panelUnifBanco,
                this.gpDerechosObigaciones,
                {
                    xtype: 'panel',
                    id: 'panelTabContabilidad',
                    layout: 'fit',
                    region: 'center',
                    // disabled: true,
                    title: this.idioma.lbContabilidad,
                    border: false,
                    tbar: [this.btnUnificarContabilidad],
                    items: this.gpContabilidad
                }
            ]
        });
        this.items = [this.tabPanel];

    },
    createGridPanelCobroPago: function () {
        var me = this;

        this.btnUnificarCobroPago = new Ext.Button({
            icon: '/contabilidad/comun/images/unificacionmonetaria.png',
            iconCls: 'btn',
            text: this.idioma.lbUnificar,
            tooltip: this.idioma.lbToolUnificar,
            disabled: true
        });

        this.stDerechosObigaciones = new Ext.data.GroupingStore({
            url: 'loadDataDuo',
            id: 'stDerechosObigaciones',
            scope: this,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idderechouobligacion'},
                {name: 'numero'},
                {name: 'idcuenta'},
                {name: 'idtipodocumento'},
                {name: 'concatcta'},
                {name: 'text'},
                {name: 'idtipo'},
                {name: 'tipoDuo'},
                {name: 'importemb'},
                {name: 'liquidadomb'},
                {name: 'idsubsistema'},
                {name: 'importependiente'}

            ]),
            sortInfo: {field: 'idderechouobligacion', direction: "ASC"},
            groupField: 'tipoDuo'
        });

        this.gpDerechosObigaciones = new Ext.grid.GridPanel({
            scope: me,
            title: this.idioma.lbCobroPago,
            border: false,
            // disabled: true,
            split: true,
            collapsible: false,
            animCollapse: false,
            loadMask: true,
            frame: false,
            arrayPaginSelect: new Array(),
            layout: 'fit',
            autoExpandColumn: 'text',
            store: this.stDerechosObigaciones,
            sm: this.smDerechosObigaciones = new Ext.grid.RowSelectionModel({
                singleSelect: false
            }),
            columns: [
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idderechouobligacion'
                }, {
                    hidden: true,
                    hideable: false,
                    header: 'Documentos',
                    dataIndex: 'tipoDuo'
                }, {
                    hidden: true,
                    hideable: false,
                    header: this.idioma.lbSubsistema,
                    id: 'idsubsistema',
                    dataIndex: 'idsubsistema'
                }, {
                    sortable: true,
                    width: 5,
                    header: this.idioma.lbNumero,
                    hideable: true,
                    id: 'numero',
                    dataIndex: 'numero'
                }, {
                    sortable: true,
                    width: 10,
                    header: this.idioma.lbCuentaInformacion,
                    hideable: true,
                    id: 'text',
                    dataIndex: 'text',
                }, {
                    sortable: true,
                    width: 10,
                    header: this.idioma.lbImportePendiente,
                    hideable: true,
                    id: 'importependiente',
                    dataIndex: 'importependiente',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        return formatoMoneda(record.data.importemb - record.data.liquidadomb);
                    }
                }],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            forceFit: true,
            tbar: [this.btnUnificarCobroPago]
        });
    },
    createGridPanelContabilidad: function () {
        var me = this;

        this.btnUnificarContabilidad = new Ext.Button({
            icon: '/contabilidad/comun/images/unificacionmonetaria.png',
            iconCls: 'btn',
            text: this.idioma.lbUnificar,
            tooltip: this.idioma.lbToolUnificar,
            disabled: true
        });

        this.stContabilidad = new Ext.data.GroupingStore({
            url: 'cargarContabilidad',
            scope: this,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcomprobante'},
                {name: 'numerocomprobante'},
                {name: 'idsubsistema'},
				{name: 'fechaemision'},
                {name: 'subsistema'}

            ]),
            sortInfo: {field: 'idcomprobante', direction: "ASC"},
            groupField: 'subsistema'
        });

        this.gpContabilidad = new Ext.grid.GridPanel({
            scope: me,
            title: this.idioma.lbCmpSinAsentar,
            border: false,
            split: true,
            collapsible: false,
            animCollapse: false,
            loadMask: true,
            frame: false,
            arrayPaginSelect: new Array(),
            layout: 'fit',
            autoExpandColumn: 'numerocomprobante',
            store: this.stContabilidad,
            sm: this.smContabilidad = new Ext.grid.RowSelectionModel({
                singleSelect: false
            }),
            columns: [
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcomprobante'
                }, {
                    sortable: true,
                    width: 5,
                    header: this.idioma.lbNroCmp,
                    hideable: true,
                    id: 'numerocomprobante',
                    dataIndex: 'numerocomprobante'
                }, {
                    hidden: true,
                    sortable: true,
                    width: 5,
                    header: this.idioma.lbSubsistema,
                    hideable: true,
                    id: 'subsistema',
                    dataIndex: 'subsistema'
                }, {
                    sortable: true,
                    width: 5,
                    header: this.idioma.headerFecha,
                    hideable: true,
                    id: 'fechaemision',
                    dataIndex: 'fechaemision'
                }, {
                    hidden: true,
                    hideable: false,
                    header: this.idioma.lbSubsistema,
                    id: 'idsubsistema',
                    dataIndex: 'idsubsistema',
                }],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            forceFit: true,
        });
    },
    createGridPanelCaja: function () {
        var me = this;

        this.lbTexCajaunificada = new Ext.form.Label({
            hidden: true,
            text: this.idioma.lbTexCajaunificada,
            style: 'font-weight:bold'
        });

        this.lbSiCaja = new Ext.form.Label({
            hidden: true,
            text: this.idioma.lbSi,
            style: 'font-weight:bold;color:green;'
        });

        this.lbNoCaja = new Ext.form.Label({
            hidden: true,
            text: this.idioma.lbNo,
            style: 'font-weight:bold;color:red;'
        });

        this.btnUnificarCaja = new Ext.Button({
            icon: '/contabilidad/comun/images/unificacionmonetaria.png',
            iconCls: 'btn',
            text: this.idioma.lbUnificar,
            tooltip: this.idioma.lbToolUnificar,
            disabled: true
        });

        this.stUnificarCaja = new Ext.data.GroupingStore({
            url: 'cargarcaja',
            scope: this,
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'descripcion'},
                {name: 'grupo'},
                {name: 'idgrupo'},
                {name: 'importe'},
                {name: 'nomcaja'},
                {name: 'idcajafondo'},
                {name: 'iddocumento'},

            ]),
            sortInfo: {field: 'nomcaja', direction: "ASC"},
            groupField: 'grupo'
        });

        this.gpCaja = new Ext.grid.GridPanel({
            scope: me,
            border: false,
            split: true,
            collapsible: false,
            animCollapse: false,
            loadMask: true,
            frame: false,
            arrayPaginSelect: new Array(),
            layout: 'fit',
            autoExpandColumn: 'caja',
            store: this.stUnificarCaja,
            sm: this.smUnificarCaja = new Ext.grid.RowSelectionModel({
                singleSelect: false
            }),
            columns: [
                {
                    hidden: true,
                    header: this.idioma.lbCaja,
                    hideable: false,
                    dataIndex: 'grupo'
                }, {
                    sortable: true,
                    width: 5,
                    header: this.idioma.lbDescripcion,
                    hideable: true,
                    id: 'descripcion',
                    dataIndex: 'descripcion'
                }, {
                    sortable: true,
                    width: 10,
                    header: this.idioma.lbImporte,
                    hideable: true,
                    id: 'importe',
                    dataIndex: 'importe',
                }, {
                    sortable: true,
                    width: 10,
                    header: this.idioma.lbCaja,
                    hideable: true,
                    id: 'nomcaja',
                    dataIndex: 'nomcaja',
                }],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{[values.rs[0].data.grupo]} ({[values.rs.length]})'
            }),
            forceFit: true,
        });

//-------Grid Configuracion------------
        /*var stFondos = new Ext.data.Store({
            url: 'cargarfondos',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcajafondo'},
                {name: 'descripcion'},
                {name: 'nomcaja'}
            ])
        });

        this.stFondosUnificar = new Ext.data.Store({
            url: 'cargarfondos',
            scope: this,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcajafondo'},
                {name: 'idcajafondoDestino'},
                {name: 'descripcion'},
                {name: 'nomcaja'}

            ])
        });

        //-----EditorGridPanel CuentasMonedaUnificar
        this.gpFondoUnificar = new Ext.grid.EditorGridPanel({
            scope: me,
            border: false,
            clicksToEdit: 1,
            split: true,
            loadMask: true,
            frame: false,
            arrayPaginSelect: new Array(),
            layout: 'fit',
            autoExpandColumn: 'nombreCuentaUnificar',
            store: this.stFondosUnificar,
            sm: this.smFondoUnificar = new Ext.grid.RowSelectionModel({
                singleSelect: false
            }),
            columns: [
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcajafondo'
                }, {
                    sortable: true,
                    width: 20,
                    header: this.idioma.lbFondoUnificar,
                    hideable: true,
                    id: 'descripcion',
                    dataIndex: 'descripcion',
                }, {
                    scope: me,
                    header: this.idioma.lbFondoFinal,
                    id: "idcajafondoDestino",
                    dataIndex: 'idcajafondoDestino',
                    width: 20,
                    editor: new Ext.contabilidad.util.linkedCombo({
                        id: 'combofondos',
                        store: stFondos,
                        displayField: 'descripcion',
                        valueField: 'idcajafondo',
                        listHeight: 200,
                        lazyRender: true,
                        fnCreateNew: Ext.emptyFn
                    }),
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (!Ext.isEmpty(value)) {
                            var store = stFondos;
                            if (store) {
                                var index = store.find('idcajafondo', value);
                                if (index >= 0) {
                                    var newValue = store.getAt(index).data.descripcion;
                                    return newValue;
                                }

                            }

                        }
                    }
                }],
            viewConfig: {
                forceFit: true
            },
            forceFit: true
        });*/
    },
    createGridPanelBanco: function () {
        this.panelUnifBanco = new Ext.Cont.PanelUnificacionBanco({
            id: 'panelUnificacionBanco',
            idioma: this.idioma,
            perfil: this.perfil,
            title: this.idioma.lbBanco,
            cbMoneda: this.scope.PanelConfiguracion.cbMonedaUnificar,
            cbTasa: this.scope.PanelConfiguracion.cbTasaUnificar
        });
    }
});
