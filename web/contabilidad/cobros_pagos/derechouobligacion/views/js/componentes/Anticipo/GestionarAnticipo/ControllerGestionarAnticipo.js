Ext.namespace('Ext.GestionarAnticipo');
Ext.GestionarAnticipo.Controller = Ext.extend(Ext.Component, {
    lmask: undefined,
    url: '',
    loadJs: undefined,
    loadJsArray: undefined,
    loadJsSync: undefined,
    Model: undefined,
    View: undefined,
    flujoNormal: undefined,
    tipoDuo: undefined,
    FechaContable: undefined,
    fechaPeriodoInicio: undefined,
    fechaPeriodoFin: undefined,
    busquedaAnt: undefined,
    constructor: function(params)
    {
        Ext.apply(this, params);
        perfil = window.parent.perfil;
        //Dependencias
        requireJS.loadJsArray([
            {
                url: "/contabilidad/comun/componentes/SearchField/SearchField.min",
                id: 'SearchField',
                async: false
            },
            {
                url: "/contabilidad/comun/componentes/LinkedCombo/linkedCombo",
                id: 'linkedCombo'
            },
            {
                url: "/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/MotivoCancelacion/ClassMotivoCancelacion",
                id: 'ClassMotivoCancelacion'
            },
            {
                url: "/contabilidad/cobros_pagos/cargainicial/views/js/componentes/BuscarAnticipo/BuscarAnticipo",
                id: 'BuscarAnticipo'
            },
            {
                url: "/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/Anticipo/AdicionarAnticipo/ClassAdicionarAnticipo",
                id: 'ClassAdicionarAnticipo'
            },
            {
                url: "/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/Anticipo/AdicionarAnticipo/UIAdicionarAnticipo",
                id: 'UIAdicionarAnticipo'
            },
            {
                url: "/contabilidad/comun/componentes/RowActionColumn/Ext.grid.RowActions",
                id: 'RowActions',
                async: false
            },
            {
                url: "/contabilidad/cobros_pagos/cargainicial/views/js/componentes/CmpAction/cmpaction",
                id: 'cmpaction',
                async: false
            },
            {
                url: "/contabilidad/comun/js/FormSteps",
                id: 'FormSteps'
            }
        ]);

        requireJS.loadJs(
            "/contabilidad/comun/componentes/CargaInicialCancelacion/CICancelacionController",
            'CICancelacionController'
        );

        requireJS.loadJs(
            "/contabilidad/comun/js/Util/WinMotivoCancelacion/winMotivoCancelacion",
            'WindowMotivoCancelacion'
        );

        this.loadDataComponent();

        Ext.GestionarAnticipo.Controller.superclass.constructor.call(this);
    },
    loadMessageBox: function (msg = 'Cargando...', title = 'Por favor espere...') {
        Ext.MessageBox.show({
            title: title,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });//manera de ocultarlo Ext.MessageBox.hide();
        var f = function (v) {
            return function () {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    },
    loadMask: function (message = 'Cargando...') {
        this.lmask = new Ext.LoadMask(Ext.getBody(), {
            msg: message
        });
        this.lmask.show();
    },
    loadDataComponent: function()
    {
        // Ext.Ajax.request({
        //     scope: this,
        //     method: "POST",
        //     url: "cargaretiquetas",
        //     callback: function (options, success, response) {
        //         this.etiquetas = Ext.decode(response.responseText);
        this.initializeClass();
        //     }
        // });
    },
    initializeClass: function () {
        this.Model = new Ext.GestionarAnticipo.Model({tipoDuo: this.tipoDuo});
        this.View = new Ext.GestionarAnticipo.View({tipoDuo: this.tipoDuo, etiquetas: this.etiquetas}, this.Model);
        this.initializeDataIni();
        this.initializeEvents();
        this.initializeFunctions();
        this.initializeKeyMap();
    },
    initializeDataIni: function () {
        this.loadMessageBox();
        Ext.Ajax.request({
            scope: this,
            url: 'buscarfechacontable',
            method: 'POST',
            params: {},
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var responseData = Ext.decode(response.responseText);
                this.FechaContable = responseData.fecha;
                this.fechaPeriodoInicio = responseData.fechai;
                this.fechaPeriodoFin = responseData.fechafin;

                if (responseData.aperturado == 0)
                    this.View.lfdFechaContable.setText('Carga inicial: ' + this.FechaContable);
                else this.View.lfdFechaContable.setText('Fecha contable: ' + this.FechaContable);

                if (this.flujoNormal != responseData.aperturado) {
                    this.View.btnadicionar.disable();
                    this.View.btnmodificar.disable();
                    this.View.btnContabilizar.disable();
                    this.View.btnContabilizar.hide();
                    this.View.btnCancelarContabilizar.disable();
                    this.View.btnCancelarContabilizar.hide();
                    this.View.btnConfirmar.disable();
                    this.View.btnConfirmar.hide();
                    this.View.btnBuscar.disable();
                } else {
                    if (this.flujoNormal == 1 && responseData.aperturado == 1) {
                        this.View.btnContabilizar.show();
                        this.View.btnCancelarContabilizar.show();
                        this.View.btnConfirmar.show();
                    }

                    this.Model.stgrid.load({
                        params: {
                            start: 0,
                            limit: 20
                        }
                    });
                }

                if (this.flujoNormal == 0 && responseData.aperturado == 1) {
                    mostrarMensaje(1, 'Cobros y pagos ha cerrado las operaciones de la carga inicial.', function () {
                        this.View.gpgrid.disable();
                    }.bind(this));
                } else if (this.flujoNormal == 1 && responseData.aperturado == 0) {
                    mostrarMensaje(1, 'Cobro y pago se encuentra realizando las operaciones de la carga inicial.', function () {
                        this.View.gpgrid.disable();
                    }.bind(this));
                } else if (this.flujoNormal == 1 && responseData.aperturado == 1) {
                    this.View.btnContabilizar.show();
                    this.View.btnCancelarContabilizar.show();
                }
            }
        });
    },
    initializeEvents: function () {
        var me = this;

        this.View.btnadicionar.setHandler(function (btn) {
            this.adicionarAnt();
        }, this);

        this.View.btnmodificar.setHandler(function (btn) {
            this.modificarAnt();
        }, this);

        this.View.btneliminar.setHandler(function (btn) {
            this.eliminarAnt();
        }, this);

        this.View.btnConfirmar.setHandler(function (btn) {
            this.confirmarAnticipo();
        }, this);

        this.View.btnContabilizar.setHandler(function (btn) {
            this.contabilizarAnt(btn);
        }, this);

        this.View.btnCancelarContabilizar.setHandler(function (btn) {
            this.cancelarAnt();
        }, this);

        this.View.btnConfiguracion.setHandler(function (btn) {
            this.configurarAnt();
        }, this);

        this.View.btnBuscar.setHandler(function (btn) {
            this.map.disable();
            if (!(this.busquedaAnt instanceof Ext.BuscarAnticipo.WindowBuscarAnticipo)) {
                this.busquedaAnt = new Ext.BuscarAnticipo.WindowBuscarAnticipo({
                    tipoDuo: this.tipoDuo,
                    store: this.Model.stgrid
                });
            }
            this.busquedaAnt.on({
                scope: this,
                close: function () {
                    this.map.enable();
                },
                hide: function () {
                    this.map.enable();
                }
            });
            this.busquedaAnt.show();
            // if (!this.busquedaAnt.cargado) {
            //     this.busquedaAnt.cargado = true;
            this.busquedaAnt.loadStores();
            // }
        }, this);

        Ext.apply(this.View.searchField, {
            fnOnSearch: function () {
                me.View.pagingBar.changePage(0);
                me.Model.stgrid.baseParams.numero = me.View.searchField.getRawValue();
                me.Model.stgrid.load();
            },
            fnOnClear: function () {
                me.Model.stgrid.baseParams.numero = null;
                me.Model.stgrid.load();
            }
        });

        this.Model.stgrid.on({
            scope: this,
            load: function () {
                this.View.btnadicionar.enable();
                this.View.btnBuscar.enable();
            }, beforeload: function () {
                this.View.btnContabilizar.disable();
                this.View.btnConfirmar.disable();
                this.View.btneliminar.disable();
                this.View.btnCancelarContabilizar.disable();
                this.View.btnmodificar.disable();
                this.View.btnBuscar.disable();
                this.View.btnadicionar.disable();
            }
        });

        this.Model.stgrid.on({
            scope: this,
            load: function () {
                this.View.btnadicionar.enable();
                this.View.btnBuscar.enable();
                this.View.smgrid.selectFirstRow();
            }, beforeload: function () {
                this.View.btnContabilizar.disable();
                this.View.btnConfirmar.disable();
                this.View.btneliminar.disable();
                this.View.btnCancelarContabilizar.disable();
                this.View.btnmodificar.disable();
                this.View.btnBuscar.disable();
                this.View.btnadicionar.disable();
            }
        });

        this.View.pagingBar.on({
            scope: this,
            beforechange: function () {
                this.Model.stgrid.baseParams.tipoDuo = this.tipoDuo;
            }
        });

        this.View.smgrid.on({
            scope: this,
            selectionchange: function (sm) {
                // btnmodificar.setDisabled(!this.hasSelection() || sm.getCount() > 1);
                // btneliminar.setDisabled(!this.hasSelection());
                // labelcuenta.setText('Cuenta de pago anticipado:  ' + smgrid.getSelected().data.text);
                if (sm.hasSelection()) {
                    var seleccionados = sm.getSelections();
                    var primero = seleccionados[0].get('idestado');
                    if (!this.distintosPorPropiedad(seleccionados, 'idestado')) {
                        if (primero == 8) // 8 es guardado
                        {
                            this.View.btnmodificar.setDisabled(!sm.hasSelection() || sm.getCount() > 1);
                            this.View.btneliminar.enable();
                            this.View.btnConfirmar.enable();
                            this.View.btnContabilizar.disable();
                            this.View.btnCancelarContabilizar.disable();
                        } else if (primero == 5) { // 5 es confirmado
                            this.View.btnContabilizar.enable();
                            this.View.btnConfirmar.disable();
                            this.View.btneliminar.disable();
                            this.View.btnCancelarContabilizar.enable();
                        } else if (primero == 6) {// 6 es posteado
                            this.View.btnContabilizar.disable();
                            this.View.btnConfirmar.disable();
                            this.View.btneliminar.disable();
                            if (/*seleccionados[0].get('cargainicial') != 1 && */seleccionados[0].get('liquidadomb') == 0 && seleccionados.length == 1) {
                                this.View.btnCancelarContabilizar.enable();
                            } else {
                                this.View.btnCancelarContabilizar.disable();
                            }
                        } else {
                            this.View.btnContabilizar.disable();
                            this.View.btnConfirmar.disable();
                            this.View.btnmodificar.disable();
                            this.View.btneliminar.disable();
                            this.View.btnCancelarContabilizar.disable();
                        }
                    } else {
                        this.View.btnContabilizar.disable();
                        this.View.btnConfirmar.disable();
                        this.View.btnmodificar.disable();
                        this.View.btneliminar.disable();
                        this.View.btnCancelarContabilizar.disable();
                    }

                } else {
                    this.View.btnmodificar.setDisabled(!sm.hasSelection());
                    this.View.btneliminar.setDisabled(!sm.hasSelection());
                    this.View.btnContabilizar.disable();
                    this.View.btnConfirmar.disable();
                    this.View.btnCancelarContabilizar.disable();
                }
            },
            rowselect: function (smodel, rowIndex, record) {
                this.View.gpgrid.getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
                this.View.gpgrid.getView().removeRowClass(rowIndex, "negrita");
            },
        });

        this.View.gpgrid.getView().getRowClass = function (record, index, rowParams, store) {
            // if (record.get('vencido') && record.get('vencido') == 1)
            //     return 'FilaMasRoja';
            if (record.get('idestado') == 6) {
                return 'FilaVerde';
            } else if (record.get('idestado') == 7) {
                return 'FilaRoja';
            }
        };

        this.View.gpgrid.on({
            scope: this,
            rowdblclick: function (grid, row, event) {
                var record = grid.getStore().getAt(row);
                if (record) {
                    var estado = record.get('idestado');
                    var idsub = record.get('idsubsistema');
                    if (idsub == 6) {
                        if (estado == 8) {
                            this.crearVentanaAddMod('mod', record);
                        } else {
                            this.crearVentanaAddMod('ver', record);
                        }
                    }
                }
            }
        });


        // this.View.searchField.setHandler(function (btn) {
        //
        // }, this);
        //
        // this.View.pagingBar.setHandler(function (btn) {
        //
        // }, this);
        //
        // this.View.smgrid.setHandler(function (btn) {
        //
        // }, this);

    },
    initializeFunctions: function () {

        this.distintosPorPropiedad = function (arrSeleccionados, propiedad) {
            var primero = arrSeleccionados[0].get(propiedad);
            for (var i = 0; i < arrSeleccionados.length; i++) {
                if (arrSeleccionados[i].get('idsubsistema') == 6) {
                    if (arrSeleccionados[i].get(propiedad) != primero) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
            return false;
        };

        this.crearVentanaAddMod = function (modo, record) {

            var parametros = {
                tipoDuo: this.tipoDuo,
                flujoNormal: this.flujoNormal,
                fechaContable: this.FechaContable,
                fechaPeriodoFin: this.fechaPeriodoFin,
                fechaPeriodoInicio: this.fechaPeriodoInicio
            };

            if (modo === 'add') {
                Ext.apply(parametros, {
                    tipoAccion: modo
                });
            } else if (modo === 'mod') {
                Ext.apply(parametros, {
                    tipoAccion: modo,
                    idant: record.get('idanticipo'),
                    iddoc: record.get('iddocanticipado'),
                    recordAnt: record
                });
            } else if (modo === 'ver') {//este modo es informativo solamente
                Ext.apply(parametros, {
                    tipoAccion: modo,
                    idant: record.get('idanticipo'),
                    iddoc: record.get('iddocanticipado'),
                    recordAnt: record
                });
            }

            var windowAdicionarAnticipo = new Ext.ClassAdicionarAnticipo(parametros);

            windowAdicionarAnticipo.on({
                scope: this,
                recargar: function () {
                    this.Model.stgrid.reload();
                },
                confirmar: function (idant, fn) {
                    this.confirmarAnt([idant], false, fn);
                },
                postear: function (idant, fn) {
                    this.postearr([idant], 1, null, false, fn);
                }
            });
            windowAdicionarAnticipo.getWindow().on({
                scope: this,
                show: function () {
                    this.map.disable();
                },
                close: function () {
                    this.map.enable();
                }
            });
        };

        this.confirmarAnticipo = function () {
            this.map.disable();
            var selecciones = this.View.smgrid.getSelections();
            var mensaje = '';
            if (selecciones.length > 1) {
                mensaje = '¿Est&aacute; seguro que quiere confirmar los anticipos seleccionados?';
            } else {
                mensaje = '¿Est&aacute; seguro que quiere confirmar el anticipo seleccionado?';
            }
            mostrarMensaje(2, mensaje, function (btn) {
                if (btn === 'ok') {

                    var arrIdAnticipo = [];
                    for (var i = 0; i < selecciones.length; i++) {
                        arrIdAnticipo.push(selecciones[i].get('idanticipo'));
                    }
                    this.confirmarAnt(arrIdAnticipo);
                } else {
                    this.map.enable();
                }
            }.bind(this));
        };

        this.confirmarAnt = function (arrIdAnticipo, recargar = true, fnCallBack = undefined) {
            var mensaje = '';
            if (arrIdAnticipo.length === 1) {
                mensaje = this.tipoDuo == 3 ? 'Confirmando el Cobro anticipado.' : 'Confirmando el Pago anticipado.';
            } else if (arrIdAnticipo.length > 1) {
                mensaje = this.tipoDuo == 3 ? 'Confirmando los Cobros anticipados.' : 'Confirmando los Pagos anticipados.';
            }
            Ext.Msg.wait(this.tipoDuo == 3 ? 'Confirmando el Cobro anticipado.' : 'Confirmando el Pago anticipado.', 'Por favor espere...');
            Ext.Ajax.request({
                scope: this,
                url: 'Confirmar',
                method: 'POST',
                params: {
                    arridanticipo: Ext.encode(arrIdAnticipo),
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codM == -1) {
                        Ext.Msg.hide();
                        if (arrIdAnticipo.length === 1) {
                            mostrarMensaje(1, 'El anticipo no ha sido confirmado satisfactoriamente');
                        } else {
                            mostrarMensaje(1, 'Los anticipos no han sido confirmados satisfactoriamente');
                        }
                    } else {
                        if (arrIdAnticipo.length === 1) {
                            mostrarMensaje(1, 'El anticipo ha sido confirmado satisfactoriamente');
                        } else {
                            mostrarMensaje(1, 'Los anticipos han sido confirmados satisfactoriamente');
                        }
                        Ext.Msg.hide();
                        if (recargar) {
                            this.Model.stgrid.reload();
                            this.map.enable();
                        }
                        if (typeof fnCallBack === 'function') {
                            fnCallBack.call();
                        }
                    }
                }
            });
        };

        this.adicionarAnt = function () {
            this.crearVentanaAddMod('add');
        };

        this.modificarAnt = function () {
            var record = this.View.smgrid.getSelected();
            this.crearVentanaAddMod('mod', record);
        };

        this.cancelarAnt = function () {
            this.map.disable();
            var selecciones = this.View.smgrid.getSelections();
            var mensaje = '';
            var me = this;
            var fechaMayor = '';
            if (selecciones.length > 1) {
                mensaje = '¿Est&aacute; seguro que quiere cancelar los anticipos seleccionados?';
            } else {
                mensaje = '¿Est&aacute; seguro que quiere cancelar el anticipo seleccionado?';
            }
            for (var i = 0; i < selecciones.length; i++) {
                if (i === 0) {
                    fechaMayor = selecciones[0].get('fecha');
                } else if(selecciones[0].get('fecha') > fechaMayor) {
                    fechaMayor = selecciones[0].get('fecha')
                }
            }
            // var motivo = new Ext.ClassMotivoCancelacion({
            //     url: '',
            //     pregunta: mensaje,
            //     numero: numero,
            // });
            mostrarMensaje(2, mensaje, function (btnPress) {
                if (btnPress === 'ok') {
                    var motivo = new CON.Util.WindowMotivoCancelacion({
                        fechaDoc: fechaMayor,
                        fechaFin: me.fechaPeriodoFin,
                        fechaContable: me.FechaContable,
                        fechaInicial: me.fechaPeriodoInicio,
                    });

                    motivo.on({
                        scope: this,
                        'close': function () {
                            me.map.enable();
                        },
                        'CerrarVentana': function () {

                        },
                        'AceptarMotivo': function (idmotivo, motivo, fecha) {
                            var record = me.View.smgrid.getSelected();
                            var estado = record.get('idestado');
                            var ci = record.get('cargainicial');
                            var idMoneda = record.get('idmoneda');
                            var idanticipo = record.get('idanticipo');
                            if (estado == 6) {
                                if (ci == 0) {
                                    me.postearAnt(2, idmotivo, fecha);
                                } else if (ci == 1) {
                                    var vc = new Ext.CICancelacion.Controller({
                                        idMoneda: idMoneda,
                                        idSubsistema: 6,
                                        funcionalidad: 2,//1-obligacion 2-anticipo
                                        arrayIdObj: [idanticipo]
                                    });

                                    vc.on({
                                        scope: this,
                                        cancelar: function (responseData) {
                                            var temp = {
                                                datos: responseData,
                                                codM: responseData.codM
                                            };
                                            me.fCallBackComprobante(temp, [idanticipo], 2, idmotivo, recargar = true, undefined);
                                        }
                                    });
                                }

                            } else if (estado == 5) {
                                me.cancelarConfirmado(idmotivo);
                            }
                        }
                    });
                    motivo.show();
                } else {
                    me.map.enable();
                }
            }, this);
            // motivo.on('motivocancelacion', function (idmotivo, motivo) {
            //     var record = this.View.smgrid.getSelected();
            //     var estado = record.get('idestado');
            //     var ci = record.get('cargainicial');
            //     var idMoneda = record.get('idmoneda');
            //     var idanticipo = record.get('idanticipo');
            //     if (estado == 6) {
            //         if (ci == 0) {
            //             this.postearAnt(2, idmotivo);
            //         } else if (ci == 1) {
            //             var vc = new Ext.CICancelacion.Controller({
            //                 idMoneda: idMoneda,
            //                 idSubsistema: 6,
            //                 funcionalidad: 2,//1-obligacion 2-anticipo
            //                 arrayIdObj: [idanticipo]
            //             });
            //
            //             vc.on({
            //                 scope: this,
            //                 cancelar: function (responseData) {
            //                     var temp = {
            //                         datos: responseData,
            //                         codM: responseData.codM
            //                     };
            //                     this.fCallBackComprobante(temp, [idanticipo], 2, idmotivo, recargar = true, undefined);
            //                 }
            //             });
            //         }
            //
            //     } else if (estado == 5) {
            //         this.cancelarConfirmado(idmotivo);
            //     }
            // }, this);
        };

        this.contabilizarAnt = function (btnCont) {
            this.map.disable();
            mostrarMensaje(2, '¿Est&aacute; seguro que quiere postear el anticipo seleccionado?', function (btn) {
                if (btn === 'ok') {
                    // btnCont.disable();
                    this.postearAnt(1);
                } else {
                    this.map.enable();
                }
            }.bind(this));
        };

        this.postearAnt = function (tipoContabilizacion, idmotivo = null, fecha = '') {
            var seleccionados = this.View.smgrid.getSelections();
            var arranticipo = [];
            // var arrIdDoc = [];
            for (var i = 0; i < seleccionados.length; i++) {
                // arranticipo.push({
                //     idanticipo: seleccionados[i].get('idanticipo'),
                //     importe: seleccionados[i].get('importe'),
                //     idcuenta: seleccionados[i].get('idcuenta'),
                //     numero: seleccionados[i].get('numero'),
                //     idOperacion: seleccionados[i].get('idoperacion'),
                //     idCuentaOperacion: seleccionados[i].get('idcuentaoperacion'),
                //     // idestado: seleccionados[i].get('idestado'),
                //     // iddocumento: seleccionados[i].get('iddocanticipado')
                // });
                arranticipo.push(seleccionados[i].get('idanticipo'));
                // arrIdDoc.push(seleccionados[i].get('iddocanticipado'));
            }
            this.postearr(arranticipo, tipoContabilizacion, idmotivo, true, undefined, fecha);
        };

        this.postearr = function (arranticipo, tipoContabilizacion, idmotivo, recargar = true, fnCallBack = undefined, fecha) {
            Ext.Msg.wait('Cargando el comprobante.', 'Por favor espere...');
            Ext.Ajax.request({
                scope: this,
                url: 'loadDataCmpContabAnticipo',
                method: 'POST',
                params: {
                    tipo: this.tipoDuo == 3 ? 1 : 2,
                    tipoContabilizacion: tipoContabilizacion,
                    arranticipo: Ext.encode(arranticipo),
                    fecha: fecha
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    this.fCallBackComprobante(responseData, arranticipo, tipoContabilizacion, idmotivo, recargar, fnCallBack);
                }
            });
        };

        this.fCallBackComprobante = function (responseData, arranticipo, tipoContabilizacion, idmotivo, recargar, fnCallBack) {
            if (responseData.codM == -1) {
                Ext.Msg.hide();
                mostrarMensaje(1, 'No existen tasas configuras para la moneda contable.');
            } else if (responseData.codM == -2) {
                Ext.Msg.hide();
                mostrarMensaje(1, 'No existen operaciones contables configuradas para realizar esta operación');
            } else if (responseData.codM == -3) {
                Ext.Msg.hide();
                mostrarMensaje(1, 'La operaci&oacute;n del anticipo seleccionado no tiene modelo configurado.');
            } else if (responseData.codM == -4) {
                Ext.Msg.hide();
                mostrarMensaje(1, 'No se puede realizar esta acción porque el estado del documento ha sido cambiado.');
                this.Model.stgrid.reload();
            } else {

                var win = Ext.Cont.Comprobante.init(6, responseData.datos.detalle, responseData.datos.descripcion, responseData.datos.fechaCont, responseData.datos.dataComprobante, 3, 1, 1);
                win.onSaved(function (idComprobante, numComprobante, fecha) {
                    this.loadMessageBox();
                    Ext.Ajax.request({
                        scope: this,
                        url: 'contabilizaranticipo',
                        method: 'POST',
                        params: {
                            // arrIdDoc: Ext.encode(arrIdDoc),
                            arrIdDoc: responseData.datos.arrIdDoc,
                            idcmp: idComprobante,
                            numcmp: numComprobante,
                            fecha: fecha,
                            tipoContabilizacion: tipoContabilizacion,
                            idmotivo: idmotivo
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            if (recargar) {
                                this.Model.stgrid.reload();
                                this.map.enable();
                            }
                            if (typeof fnCallBack === 'function') {
                                fnCallBack.call();
                            }
                            if (idComprobante) {
                                var msg = 'Posteo satisfactorio registrado en el comprobante ' + numComprobante + '.';
                                mostrarMensaje(responseData.codMsg, msg);
                            }
                            Ext.MessageBox.hide();
                        }
                    });
                }.bind(this)).onClose(function () {
                    if (recargar) {
                        this.map.enable();
                    }
                    Ext.Msg.hide();
                }.bind(this));
            }
        };

        this.cancelarConfirmado = function (idmotivo) {
            var seleccionados = this.View.smgrid.getSelections();
            var mensaje;
            if (seleccionados.length > 1) {
                mensaje = this.tipoDuo == 3 ? 'Cancelando el Cobro anticipado.' : 'Cancelando el Pago anticipado.';
            } else {
                mensaje = this.tipoDuo == 3 ? 'Cancelando los Cobros anticipados.' : 'Cancelando los Pagos anticipados.';
            }
            Ext.Msg.wait(mensaje, 'Por favor espere...');
            var arrIdDoc = [];
            for (var i = 0; i < seleccionados.length; i++) {
                arrIdDoc.push(seleccionados[i].get('iddocanticipado'));
            }
            Ext.Ajax.request({
                scope: this,
                url: 'cancelarAnticipoConfirmado',
                method: 'POST',
                params: {
                    arriddocumento: Ext.encode(arrIdDoc),
                    idmotivo: idmotivo,
                    fecha: this.FechaContable,
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codM == 1) {
                        if (seleccionados.length > 1) {
                            mostrarMensaje(1, 'Los anticipos han sido cancelados satisfactoriamente.');
                        } else {
                            mostrarMensaje(1, 'El anticipo ha sido cancelado satisfactoriamente.');
                        }
                    } else if (responseData.codM == -1) {
                        mostrarMensaje(1, 'El anticipo no se puede cancelar.');
                    }
                    Ext.Msg.hide();
                    this.Model.stgrid.reload();
                    this.map.enable();
                }
            });
        };

        this.eliminarAnt = function () {
            var selecteds = this.View.smgrid.getSelections();

            if (selecteds.length > 1) {
                var question = this.tipoDuo == 3 ? '&iquest;Est&aacute; seguro que quiere eliminar los cobros anticipados seleccionados?' : '&iquest;Est&aacute; seguro que quiere eliminar los pagos anticipados seleccionados?';
                var msgDel = this.tipoDuo == 3 ? 'Eliminando cobros anticipados.' : 'Eliminando pagos anticipados.';
            } else {
                var question = this.tipoDuo == 3 ? '&iquest;Est&aacute; seguro que quiere eliminar el cobro anticipado seleccionado?' : '&iquest;Est&aacute; seguro que quiere eliminar el pago anticipado seleccionado?';
                var msgDel = this.tipoDuo == 3 ? 'Eliminando cobro anticipado.' : 'Eliminando pago anticipado.';
            }
            this.map.disable();

            Ext.Msg.show({
                title: 'Eliminar',
                msg: question,
                buttons: Ext.Msg.OKCANCEL,
                icon: Ext.MessageBox.QUESTION,
                scope: this,
                fn: function (btn, text) {
                    if (btn == 'ok') {
                        var arrayData = [];

                        for (var i = 0; i < selecteds.length; i++)
                            arrayData.push(selecteds[i].data.idanticipo);

                        Ext.Msg.wait(msgDel, 'Por favor espere...');
                        Ext.Ajax.request({
                            scope: this,
                            url: 'eliminarcypa',
                            params: {
                                arrayId: Ext.encode(arrayData),
                                tipoDuo: this.tipoDuo,
                            },
                            callback: function (options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                if (responseData.v == 1) {
                                    mostrarMensaje(1, responseData.d);
                                    this.Model.stgrid.reload();
                                    Ext.Msg.hide();
                                } else {
                                    Ext.Msg.hide();
                                }
                                this.map.enable();
                            }
                        });
                        this.View.btnmodificar.disable();
                        this.View.btneliminar.disable();
                    } else {
                        this.map.enable();
                    }
                    this.View.btnadicionar.focus();
                }
            });
        };

        this.configurarAnt = function () {
            var lol = new Ext.ConfiguracionTV.Controller({tipoDuo: this.tipoDuo, etiquetas: this.etiquetas});
            // lol.show();
        };

    },
    initializeKeyMap: function () {
        var me = this;
        //para las teclas de acceso rapido
        this.map = new Ext.KeyMap(document);
        this.map.accessKey = function (key, handler, scope) {
            var h = function (n, e) {
                e.preventDefault();
                handler.call(scope || this, n, e);
            };
            this.on(key, h, scope);
        };

        //ADICIONAR
        this.map.accessKey({
            key: 'i',
            alt: true
        }, function () {
            if (!me.View.btnadicionar.disabled  && !me.View.btnadicionar.hidden) {
                me.View.btnadicionar.handler.call(me);
            }
        }, Ext.getBody());

        //MODIFICAR
        this.map.accessKey({
            key: 'm',
            alt: true
        }, function () {
            if (!me.View.btnmodificar.disabled  && !me.View.btnmodificar.hidden) {
                me.View.btnmodificar.handler.call(me);
            }
        }, Ext.getBody());

        //ELIMINAR
        this.map.accessKey({
            key: Ext.EventObject.DELETE
        }, function () {
            if (!me.View.btneliminar.disabled  && !me.View.btneliminar.hidden) {
                me.View.btneliminar.handler.call(me);
            }
        }, Ext.getBody());

        //CANCELAR
        this.map.accessKey({
            key: 'x',
            alt: true
        }, function () {
            if (!me.View.btnCancelarContabilizar.disabled  && !me.View.btnCancelarContabilizar.hidden) {
                me.View.btnCancelarContabilizar.handler.call(me);
            }
        }, Ext.getBody());

        //CANCELAR LIQUIDACION
        // this.map.accessKey({
        //     key: 'x',
        //     ctrl: true
        // }, function () {
        //
        // }, Ext.getBody());

        //CONFIRMAR
        this.map.accessKey({
            key: 'f',
            alt: true
        }, function () {
            if (!me.View.btnConfirmar.disabled  && !me.View.btnConfirmar.hidden) {
                me.View.btnConfirmar.handler.call(me);
            }
        }, Ext.getBody());

        //CONTABILIZAR
        this.map.accessKey({
            key: 't',
            alt: true
        }, function () {
            if (!me.View.btnContabilizar.disabled  && !me.View.btnContabilizar.hidden) {
                me.View.btnContabilizar.handler.call(me);
            }
        }, Ext.getBody());

        //LIQUIDAR
        // this.map.accessKey({
        //     key: 'l',
        //     alt: true
        // }, function () {
        //
        // }, Ext.getBody());

        //VER
        // this.map.accessKey({
        //     key: 'v',
        //     alt: true
        // }, function () {
        //
        // }, Ext.getBody());

        //GRAFICAR
        // this.map.accessKey({
        //     key: 'g',
        //     alt: true
        // }, function () {
        //
        // }, Ext.getBody());

        //BUSCAR
        this.map.accessKey({
            key: 'b',
            alt: true
        }, function () {
            if (!me.View.btnBuscar.disabled  && !me.View.btnBuscar.hidden) {
                me.View.btnBuscar.handler.call(me);
            }
        }, Ext.getBody());

        //AYUDA
        // this.map.accessKey({
        //     key: 'h',
        //     alt: true
        // }, function () {
        //
        // }, Ext.getBody());

        //TAB
//         this.map.accessKey({
//             key: Ext.EventObject.TAB
//         }, function () {
// //            if (document.activeElement.tabIndex == 14)
// //                scope.objWindowsDuo.cbAddTipoDoc.focus(true, 10);
// //            else if (document.activeElement.tabIndex == 108)
// //                scope.objWindowsDuo.cbBuscarTipoDoc.focus(true, 10);
// //            else if (document.activeElement.tabIndex == 1)
// //                scope.objWindowsDuo.btnAddConfirmar.focus();
// //            else if (document.activeElement.tabIndex == 100)
// //                scope.objWindowsDuo.btnBuscarAceptar.focus();
//         }, Ext.getBody());

    }
});