Ext.namespace('Ext.ClassGestSellos');
Ext.ClassGestSellos= Ext.extend(Ext.Component, {
    url: undefined,
    ventata: undefined,
    flag: true,
    data: '',
    constructor: function(params = undefined)
    {
        // Ext.apply(this, params);

        this.url = params.url;
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        perfil = window.parent.perfil;

        if (!document.getElementById('SCFPrintView'))
            this.loadJs("/contabilidad/comun/SCFPrintView/views/js/SCFPrintView", 'SCFPrintView');

        if (!document.getElementById('SCFPrintData'))
            this.loadJs("/contabilidad/comun/SCFPrintView/views/js/SCFPrintData", 'SCFPrintData');

        if (!document.getElementById('linkedCombo'))
            this.loadJs("/contabilidad/comun/componentes/LinkedCombo/linkedCombo", 'linkedCombo');

        if (!document.getElementById('RowEditor'))
            this.loadJs("/contabilidad/comun/componentes/RowEditor/RowEditor", 'RowEditor');

        if (!document.getElementById('UIGestSellos'))
            this.loadJs("/contabilidad/caja/sellos/views/js/gestsellos/UIGestSellos", 'UIGestSellos');

        if (!document.getElementById('ClassVentanaGestSellos'))
            this.loadJs("/contabilidad/caja/sellos/views/js/componentes/VentanasGestSellos/ClassVentanaGestSellos", 'ClassVentanaGestSellos');

        // if (!document.getElementById('Comprobante.Class'))
        //     this.loadJs("/contabilidad/contabilidad_financiera/componentes/Nucleos/Comprobante/Comprobante.Class", 'Comprobante.Class');
        //
        // if (!document.getElementById('Comprobante.UI'))
        //     this.loadJs("/contabilidad/contabilidad_financiera/componentes/Nucleos/Comprobante/Comprobante.UI", 'Comprobante.UI');
        //
        // if (!document.getElementById('Comprobante.Tool'))
        //     this.loadJs("/contabilidad/contabilidad_financiera/componentes/Nucleos/Comprobante/Comprobante.Tool", 'Comprobante.Tool');


        this.stSellos = new Ext.data.GroupingStore({
            url: 'loadSellos',
            // baseParams: undefined,
            autoload: true,
            sortInfo: {
                field: "tipo",
                direction: "ASC"
            },
            groupField: 'tipo',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                idProperty: 'idmovimientosello',
            }, [
                {
                    name: 'idmovimientosello'
                },
                {
                    name: 'tipo'
                },
                {
                    name: 'nomtipo'
                },
                {
                    name: 'idoperacion'
                },
                {
                    name: 'importemo'
                },
                {
                    name: 'importemb'
                },
                {
                    name: 'comentario'
                },
                {
                    name: 'idpersona'
                },
                {
                    name: 'idcajafondo'
                },
                {
                    name: 'iddocumento'
                },
                {
                    name: 'nompersona'
                },
                {
                    name: 'tipodoc'
                },
                {
                    name: 'numerodocumento', type: 'int'
                },
                {
                    name: 'fecha'
                },
                {
                    name: 'idestadodoc'
                },
                {
                    name: 'estadodoc'
                },
                {
                    name: 'numcomprobante'
                },
                {
                    name: 'showCmp'
                },
                {
                    name: 'arrayIdCmp'
                },
            ]),
        });

        this.stEntrada = new Ext.data.GroupingStore({
            url: 'loadSellosEntrada',
            // baseParams: undefined,
            autoload: false,
            sortInfo: {
                field: "tipoentrada",
                direction: "ASC"
            },
            // groupField: 'tipoentrada',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                idProperty: 'identradasello',
            }, [
                {
                    name: 'identradasello'
                },
                {
                    name: 'idliquidacion'
                },
                {
                    name: 'idanticipo'
                },
                {
                    name: 'idmovimientosello'
                },
                {
                    name: 'tipoentrada'
                },
                {
                    name: 'nomtipoentrada'
                },
                {
                    name: 'idoperacion'
                },
                {
                    name: 'importemo'
                },
                {
                    name: 'importemb'
                },
                {
                    name: 'idcajafondo'
                },
                {
                    name: 'iddocumento'
                },
                {
                    name: 'iddocumentoinst'
                },
                {
                    name: 'tipodoc'
                },
                {
                    name: 'tipo'
                },
                {
                    name: 'numerodocumento', type: 'int'
                },
                {
                    name: 'numerodocumentoinst', type: 'int'
                },
                {
                    name: 'fecha'
                },
                {
                    name: 'idestadodoc'
                },
                {
                    name: 'estadodoc'
                },
                {
                    name: 'numcomprobante'
                },
                {
                    name: 'showCmp'
                },
                {
                    name: 'arrayIdCmp'
                },
            ]),
        });

        this.stProveedorEntrada = new Ext.data.Store({//PASARLE EL BEFORELOAD DEL ORIGINAL
            url: 'getProveedores',
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data'
            }, [{
                name: 'nombre'
            }, {
                name: 'idclientesproveedores'
            }
            ]),
            autoLoad: false
        });

        this.stCuentaProveedorEntrada = new Ext.data.Store({
            url: 'cargarcuentas',
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcuenta'},
                {name: 'text'},
                {name: 'idmoneda'},
                {name: 'codigo'}
            ])
        });

        this.loadDataComponent(this);
        return Ext.ClassGestSellos.superclass.constructor.call(this);
    },
    loadJs: function (jsSrc, id) {
        if (jsSrc != null) {
            var tagScript = document.createElement("script");
            tagScript.setAttribute("type", "text/javascript");
            tagScript.setAttribute("id", id);
            tagScript.setAttribute("src", jsSrc + ".js");
            document.getElementsByTagName("body")[0].appendChild(tagScript);
        }
    },
    loadMessageBox: function (msg = 'Cargando...', title = 'Por favor espere...') {
        Ext.MessageBox.show({
            title: title,
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
    },//manera de ocultarlo Ext.MessageBox.hide();
    loadMask: function (message) {
        new Ext.LoadMask(Ext.getBody(), {
            msg: message
        }).show();
    },
    loadDataComponent: function(scope)
    {
        Ext.Ajax.request({
            method: "POST",
            url: this.url + "cargaretiquetas",
            callback: function (options, success, response) {
                scope.etiquetas = Ext.decode(response.responseText);
                scope.MuestraWindow_cajafondo(scope);
                // scope.initializeClass();
            }
        });
    },
    MuestraWindow_cajafondo: function (scope) {
        this.loadMessageBox();
        var objCajaFondo = scope.objCajaFondo = new Caja.CajaFondo.WindowCajaFondo({
            showCbMov: false,
            showWinMod: (scope.idFondo != undefined) ? true : false,
            tipoMov: [7] //7-Sellos
        });
        objCajaFondo.on({
            scope: this,
            loadData: function () {
                scope.idCaja = objCajaFondo.idCaja;
                scope.idFondo = objCajaFondo.idFondo;
                scope.idCajaFondo = objCajaFondo.idCajaFondo;
                scope.tipoFondo = objCajaFondo.tipoFondo;//1-Salida 2-Entrada,  3-Entrada/Salida
                scope.tipoMovimiento = objCajaFondo.tipoMovimiento;//1-Salida 2-Entrada
                scope.idMoneda = objCajaFondo.idMoneda;
                scope.valueCbCaja = objCajaFondo.nomCaja;
                scope.valueCbFondo = objCajaFondo.nomFondo;
                scope.nomMoneda = objCajaFondo.nomMoneda;
                scope.idFormaPago = objCajaFondo.idFormaPago;

                scope.initializeClass();
                Ext.MessageBox.hide();
            },
            close: function () {
                scope.objCajaFondo = '';
                Ext.MessageBox.hide();
            }
        });
    },
    initializeClass: function () {
        this.ViewPort = new Ext.UIGestSellos.ViewPort(this, {
           items: [this.pnlContenedor = new Ext.UIGestSellos.PanelContenedor(this)]
        });
        this.stProveedorEntrada.load();
        this.initializeDataIni(this);
        this.initializeEvents(this);
        this.initializeFunctions(this);
        this.initializeKeyMap(this);

        return Ext.ClassGestSellos.superclass.constructor.call(this);
    },
    initializeDataIni: function (scope) {
        if (scope.valueCbFondo != undefined)
            scope.tfFondoActual.setRawValue(scope.valueCbFondo);

        Ext.Ajax.request({
            scope: this,
            method: "POST",
            timeout: 30000,
            params: undefined,
            url: this.url + "buscarfechacontable",
            callback: function (options, success, response) {
                var buscarfechacontable = Ext.decode(response.responseText);
                scope.lbPeriodo.setText('Fecha contable: ' + buscarfechacontable.fecha);
                scope.fechaInicioPeriodo = buscarfechacontable.fechai;
                scope.fechaContablePeriodo = buscarfechacontable.fecha;
                scope.fechaFinPeriodo = buscarfechacontable.fechafin;
            }
        });

        scope.stSellos.baseParams = {
            idcajafondo: scope.idCajaFondo
        };
        scope.stSellos.load();

        scope.stEntrada.baseParams = {
            idcajafondo: scope.idCajaFondo
        };
        scope.stEntrada.load();
    },
    initializeEventsSellos: function(scope){
        scope.btnAdicionarAnticipo.setHandler(function () {
            var ventanaliq = scope.llamarVentana('add', 2);
            ventanaliq.on('success', function (datos) {
                scope.stSellos.reload();
            });
        });

        scope.btnAdicionarLiquidacion.setHandler(function () {
            var ventanaliq = scope.llamarVentana('add', 3);
            ventanaliq.on('success', function (datos) {
                scope.stSellos.reload();
            });
        });

        scope.btnModificarSello.setHandler(function () {
            var ventanaliq = scope.llamarVentana('mod', 2);
            ventanaliq.on('success', function (datos) {
                scope.stSellos.reload();
            });
        });

        scope.btnCancelarSello.setHandler(function () {
            var record = scope.selModelSellos.getSelected();
            var tipo = record.get('tipo');
            var estado = record.get('idestadodoc');
            if (estado == 8 || estado == 5) {// para los guardados o confirmados
                mostrarMensaje(2, scope.etiquetas.lbMsgCancelarSello, function (btnPress) {//
                    if (btnPress === 'ok') {
                        scope.cancelarSello(scope.selModelSellos);
                    }
                });
            } else if (tipo == 2 && estado == 6) {
                mostrarMensaje(2, scope.etiquetas.lbMsgCancelarSello, function (btnPress) {//anticipo posteado
                    if (btnPress === 'ok') {
                        scope.postearSello(scope.selModelSellos, 2);
                    }
                });
            } else if (tipo == 3 && estado == 9) {
                mostrarMensaje(2, scope.etiquetas.lbMsgCancelarSello, function (btnPress) {//liquidacion liquidada
                    if (btnPress === 'ok') {
                        scope.postearSello(scope.selModelSellos, 2);//presuntamente 4
                    }
                });
            } else if (tipo == 2 && (estado == 9 || estado == 10)) {//anticipo liquidado o liquidado parcial
                mostrarMensaje(2, scope.etiquetas.lbMsgCancelarSello, function (btnPress) {
                    if (btnPress === 'ok') {
                        scope.postearSello(scope.selModelSellos, 4);
                    }
                });
            } else {
                return false;
            }
        });

        scope.btnConfirmarSello.setHandler(function () {
            mostrarMensaje(2, scope.etiquetas.lbMsgConfirmarSello, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.confirmarSello(scope.selModelSellos);
                }
            });
        });

        scope.btnPostearSello.setHandler(function () {
            var record = scope.selModelSellos.getSelected();
            var tipo = record.get('tipo');
            if (tipo == 2) {
                scope.postearSello(scope.selModelSellos);//posteo anticipo
            } else if (tipo == 3) {
                scope.postearSello(scope.selModelSellos, 1);//posteo liquidacion directa
            }
        });

        scope.btnLiquidarSello.setHandler(function () {
            var record = scope.selModelSellos.getSelected();
            var tipo = record.get('tipo');
            if (tipo == 2) {
                var ventanaliq = scope.llamarVentana('liq', 2);
                ventanaliq.on('success', function (datos) {
                    scope.postearSello(scope.selModelSellos, 3, datos.arrayCuentas, datos.importe, datos.idoperacion);
                });
            }
        });

        scope.selModelSellos.on('selectionchange', function (sm) {
            scope.btnModificarSello.disable();
            scope.btnCancelarSello.disable();
            scope.btnConfirmarSello.disable();
            scope.btnPostearSello.disable();
            scope.btnLiquidarSello.disable();
            if (sm.hasSelection()) {
                var record = sm.getSelected();
                var estado = record.get('idestadodoc');
                var tipo = record.get('tipo');
                if (estado == 8) { // 8-guardado
                    scope.btnModificarSello.enable();
                    scope.btnCancelarSello.enable();
                    scope.btnConfirmarSello.enable();
                } else if (estado == 5) {//5- confirmado
                    scope.btnCancelarSello.enable();
                    scope.btnPostearSello.enable();
                } else if (estado == 6) {//6-posteado
                    scope.btnCancelarSello.enable();
                    if (tipo == 2) {
                        scope.btnLiquidarSello.enable();
                    }
                } else if (estado == 9) {//9-
                    // if (tipo == 2) {
                    scope.btnCancelarSello.enable();
                    // }
                }
            }
        });
    },
    initializeEventsEntrada: function (scope){

        scope.btnAdicionarEntradaAnticipo.setHandler(function () {
            var ventanaliq = scope.llamarVentana('add', 1);
            ventanaliq.on('success', function (datos) {
                scope.stEntrada.reload();
            });
        });

        scope.btnModificarEntrada.setHandler(function () {
            var ventanaliq = scope.llamarVentana('mod', 1);
            ventanaliq.on('success', function (datos) {
                scope.stEntrada.reload();
            });
        });

        scope.btnCancelarEntrada.setHandler(function () {
            var record = scope.selModelEntrada.getSelected();
            var tipo = record.get('tipoentrada');
            var estado = record.get('idestadodoc');
            if (estado == 8 || estado == 5) {// para los guardados o confirmados
                mostrarMensaje(2, scope.etiquetas.lbMsgCancelarEntradaSello, function (btnPress) {//
                    if (btnPress === 'ok') {
                        scope.cancelarSello(scope.selModelEntrada);
                    }
                });
            } else if (tipo == 1 && estado == 6) {
                mostrarMensaje(2, scope.etiquetas.lbMsgCancelarEntradaSello, function (btnPress) {//anticipo posteado
                    if (btnPress === 'ok') {
                        scope.postearSelloEntrada(scope.selModelEntrada, 2);
                    }
                });
            } else {
                return false;
            }
        });

        scope.btnConfirmarEntrada.setHandler(function () {
            mostrarMensaje(2, scope.etiquetas.lbMsgConfirmarEntradaSello, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.confirmarSello(scope.selModelEntrada);
                }
            });
        });

        scope.btnPostearEntrada.setHandler(function () {
            var record = scope.selModelEntrada.getSelected();
            var tipo = record.get('tipo');
            scope.postearSelloEntrada(scope.selModelEntrada);//posteo anticipo
        });

        scope.selModelEntrada.on('selectionchange', function (sm) {
            scope.btnModificarEntrada.disable();
            scope.btnCancelarEntrada.disable();
            scope.btnConfirmarEntrada.disable();
            scope.btnPostearEntrada.disable();
            if (sm.hasSelection()) {
                var record = sm.getSelected();
                var estado = record.get('idestadodoc');
                var tipo = record.get('tipoentrada');
                if (estado == 8) { // 8-guardado
                    scope.btnModificarEntrada.enable();
                    scope.btnCancelarEntrada.enable();
                    scope.btnConfirmarEntrada.enable();
                } else if (estado == 5) {//5- confirmado
                    scope.btnCancelarEntrada.enable();
                    if (tipo == 1)
                        scope.btnPostearEntrada.enable();
                } else if (estado == 6) {//6-posteado
                    scope.btnCancelarEntrada.enable();
                }
            }
        });

    },
    initializeEvents: function(scope)
    {
        scope.initializeEventsSellos(scope);
        scope.initializeEventsEntrada(scope);

        scope.btnDefinirFondo.setHandler(function () {
            scope.MuestraWindow_cajafondo(scope);
        });

        scope.cbxCuentaProevedor.on({
            scope: this,
            blur: function (store, record, options) {
                Ext.Msg.wait('Guardando...', 'Por favor espere...');
                Ext.Ajax.request({
                    url: 'saveProveedor',
                    method: 'POST',
                    scope: this,
                    params: {
                        idProveedor: scope.cbProveedorEntrada.getValue(),
                        arrCuentas: Ext.encode(scope.cbxCuentaProevedor.getValue())
                    },
                    callback: function (options, success, response) {
                        if (success) {
                            response = Ext.decode(response.responseText);
                            Ext.Msg.hide();
                        }
                    }
                });
            }
        });

        scope.stProveedorEntrada.on({
            scope: this,
            load: function () {
                var respuesta = scope.stProveedorEntrada.reader.jsonData;
                // this.aperturaTarjeta = respuesta.aperturaTarjeta;
                // // this.panelTarjeta.gpTarjeta.getColumnModel().setHidden(this.panelTarjeta.gpTarjeta.getColumnModel().getIndexById('idColumCuenta'), !this.aperturaTarjeta);
                // this.panelTarjeta.gpTarjeta.getColumnModel().setHidden(this.panelTarjeta.gpTarjeta.getColumnModel().getIndexById('idColumSaldoContab'), !this.aperturaTarjeta);

                if (respuesta.proveedor.cobrospagos && this.flag) {
                    scope.cbProveedorEntrada.setValue(respuesta.proveedor.idclientesproveedores);
                    scope.cbProveedorEntrada.setRawValue(respuesta.proveedor.nombre);

                    var datos = [];
                    for (var i = 0; i < respuesta.proveedor.cobrospagos.length; i++) {
                        if (respuesta.proveedor.cobrospagos[i].idclasificacion == 4) { // 4 es pago anticipado
                            datos.push(respuesta.proveedor.cobrospagos[i].idcuenta);
                        }
                    }
                    scope.data = Ext.decode(respuesta.proveedor.data_cuenta);
                    if (!(datos.length === 0)) {
                        scope.stCuentaProveedorEntrada.baseParams.arrayIdCuenta = Ext.encode(datos);
                        scope.cbxCuentaProevedor.reload();
                        scope.cbxCuentaProevedor.enable();
                    } else {
                        scope.cbxCuentaProevedor.disable();
                    }
                } else {
                    scope.flag = false;
                }
            }
        });

        this.cbProveedorEntrada.on({
            scope: this,
            select: function (cb, record, index) {
                if (scope.cbxCuentaProevedor.getValue()) {
                    scope.cbxCuentaProevedor.clearValue();
                }
                var datos = [];
                for (var i = 0; i < record.json.cobrospagos.length; i++) {
                    if (record.json.cobrospagos[i].idclasificacion == 4) { // 4 es pago anticipado
                        datos.push(record.json.cobrospagos[i].idcuenta);
                    }
                }
                scope.data = undefined;
                if (!(datos.length === 0)) {
                    scope.stCuentaProveedorEntrada.baseParams.arrayIdCuenta = Ext.encode(datos);
                    scope.cbxCuentaProevedor.reload();
                    scope.cbxCuentaProevedor.enable();
                } else {
                    scope.cbxCuentaProevedor.disable();
                }
            }
        });

        scope.cbxCuentaProevedor.on(
            {
                scope: this,
                load: function () {

                    var tree = scope.cbxCuentaProevedor.tree;
                    var data = scope.data;
                    if (!tree.getLoader().isLoading() && data) {
                        Ext.each(data, function (item) {
                            if (tree.getNodeById(item)) {
                                tree.getNodeById(item).getUI().toggleCheck(true);
                            }
                        }, scope)
                    }
                    if (scope.flag && data) {
                        var temp = '';
                        for (var i = 0; i < scope.stCuentaProveedorEntrada.data.items.length; i++) {
                            if (data.includes(scope.stCuentaProveedorEntrada.data.items[i].json.idcuenta)) temp = temp + scope.stCuentaProveedorEntrada.data.items[i].json.concatcta + ', ';
                        }
                        temp = temp.slice(0, -2);
                        scope.cbxCuentaProevedor.setRawValue(temp);
                        scope.flag = false;
                    }
                },
                beforeload: function () {
                    scope.cbxCuentaProevedor.getStore().removeAll();
                }
            });

    },
    initializeFunctions: function(scope)
    {
        scope.llamarVentana = function (accion, ventana = 0, url = '') {
            var record = undefined;
            if ((accion === 'mod' || accion === 'liq') && scope.selModelSellos.hasSelection() && ventana !== 1) {
                record = scope.selModelSellos.getSelected();
            } else if (accion === 'mod' && ventana === 1) {
                record = scope.selModelEntrada.getSelected();
            }

            scope.ventana = new Ext.ClassVentanaGestSellos({
                url: url,
                tipoVentana: accion === 'mod' ? parseInt(record.get('tipo')) : ventana,
                etiquetas: scope.etiquetas,
                tipoAccion: accion,//-add o -mod
                idCajaFondo: scope.idCajaFondo,
                datosAMod: record,
                idmoneda: scope.idMoneda,
                idproveedor: scope.cbProveedorEntrada.getValue(),
                fechainicioperiodo: scope.fechaInicioPeriodo,
                fechafinperiodo: scope.fechaFinPeriodo,
                fechacontableperiodo: scope.fechaContablePeriodo,
            });

            return scope.ventana;
            // scope.ventana.on('success', function (successful) {
            //     if (successful) {
            //         scope.stSellos.reload();
            //     }
            // });
        };

        scope.cancelarSello = function (sm) {//pa saber si es de entrada
            if (sm.hasSelection()) {
                var record = sm.getSelected();
                scope.loadMessageBox();
                Ext.Ajax.request({
                    method: "POST",
                    params: {
                        idmovimientosello: record.get('idmovimientosello'),
                        idanticipo: record.get('idanticipo') ? record.get('idanticipo') : undefined,
                        importe: record.get('idanticipo') ? record.get('importemo') : undefined,
                    },
                    url: this.url + "cancelarSello",
                    callback: function (options, success, response) {
                        var cancelarSello = Ext.decode(response.responseText);
                        if (cancelarSello.codMg == 1) {
                            if (record.get('identradasello')) {
                                scope.stEntrada.reload();
                            } else {
                                scope.stSellos.reload();
                            }
                            mostrarMensaje(1, 'La entrada se ha cancelado satisfactoriamente.');
                        } else {
                            mostrarMensaje(1, 'La entrada no ha podido ser cancelada.');
                        }
                        Ext.MessageBox.hide();
                    }
                });
            }
        };

        scope.confirmarSello = function (sm) {
            if (sm.hasSelection()) {
                var record = sm.getSelected();
                scope.loadMessageBox();
                Ext.Ajax.request({
                    method: "POST",
                    params: {
                        iddocumento: record.get('iddocumento'),
                    },
                    url: this.url + "confirmarSello",
                    callback: function (options, success, response) {
                        var cancelarSello = Ext.decode(response.responseText);
                        if (cancelarSello.codMg == 1) {
                            if (record.get('identradasello')) {
                                scope.stEntrada.reload();
                            } else {
                                scope.stSellos.reload();
                            }
                            mostrarMensaje(1, 'La entrada ha sido confirmada satisfactoriamente.');
                        } else {
                            mostrarMensaje(1, 'La entrada no pudo ser confirmada.');
                        }
                        Ext.MessageBox.hide();
                    }
                });
            }
        };

        scope.postearSello = function (sm, tipoContabilizacion = 1, cuentaGasto = null, importeLiquidado = 0, idoperacion = null) {//1-postear 2-cancelar 3-liquidar 4-cancelar liquidacion
            if (sm.hasSelection()) {
                scope.loadMessageBox();
                var record = sm.getSelected();
                var arrayIdDoc = [];
                arrayIdDoc[0] = record.get('iddocumento');
                Ext.Ajax.request({
                    url: scope.url + 'loadDataComprobante',
                    method: 'POST',
                    params: {
                        arrayIdDoc: Ext.encode(arrayIdDoc),
                        idCajaFondo: scope.idCajaFondo,
                        tipoContabilizacion: tipoContabilizacion,
                        idmovimientosello: record.get('idmovimientosello'),
                        // idcuentaGasto: idcuentaGasto,
                        cuentaGastos: Ext.encode(cuentaGasto),
                        importeLiquidado: importeLiquidado,
                        idoperacion: idoperacion,
                        fecha: record.get('fecha'),
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codMg == -2) {
                            Ext.MessageBox.hide();
                            mostrarMensaje(1, 'No existen operaciones contables configuradas para realizar esta operación.');
                        } else if (responseData.codMg == -3) {
                            Ext.MessageBox.hide();
                            mostrarMensaje(1, 'Por favor, verifique la configuración del modelo contable.');
                        }
                        else {
                            var win = Ext.Cont.Comprobante.init(14, responseData.detalle, responseData.descripcion, responseData.fechaCont, responseData.dataComprobante, 3, 1, 1);
                            win.onSaved(function (idComprobant, numComprobant, fecha) {
                                if (idComprobant) {
                                    scope.loadMessageBox();
                                    Ext.Ajax.request({
                                        url: scope.url + 'cambiarEstado',
                                        method: 'POST',
                                        params: {
                                            idmovimientosello: record.get('idmovimientosello'),
                                            arrayIdDoc: Ext.encode(arrayIdDoc),
                                            idcomprobante: idComprobant,
                                            numerocomprobante: numComprobant,
                                            fecha: fecha,
                                            idCajaFondo: scope.idCajaFondo,
                                            idoperacion: idoperacion,
                                            // idcuentaGasto: idcuentaGasto,
                                            tipoContabilizacion: tipoContabilizacion,
                                            importerestante: responseData.importerestante,
                                            // idliquidacionsello: responseData.idliquidacionsello,
                                            cuentaGastos: Ext.encode(cuentaGasto),
                                            tipo: record.get('tipo'),
                                            importe: record.get('importemo'),
                                        },
                                        callback: function (options, success, response) {
                                            var responseData = Ext.decode(response.responseText);
                                            if (responseData.codMg == 1) {
                                                scope.stSellos.reload();
                                                mostrarMensaje(1, 'Posteo satisfactorio registrado en el comprobante ' + numComprobant + '.');
                                            }
                                            Ext.MessageBox.hide();
                                        }
                                    });
                                }
                            }).onClose(function () {
                                Ext.MessageBox.hide();
                            });
                        }
                    }
                });
            }
        };

        scope.postearSelloEntrada = function (sm, tipoContabilizacion = 1) {
            if (sm.hasSelection()) {
                scope.loadMessageBox();
                var record = sm.getSelected();
                var arrayIdDoc = [];
                arrayIdDoc[0] = record.get('iddocumento');
                Ext.Ajax.request({
                    url: scope.url + 'loadDataComprobanteEntrada',
                    method: 'POST',
                    params: {
                        arrayIdDoc: Ext.encode(arrayIdDoc),
                        idCajaFondo: scope.idCajaFondo,
                        tipoContabilizacion: tipoContabilizacion,
                        identradasello: record.get('identradasello'),
                        iddocanticipo: record.get('iddocumentoinst'),
                        importe: record.get('importemo'),
                        fecha: record.get('fecha'),
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codMg == -1) {
                            Ext.MessageBox.hide();
                            mostrarMensaje(1, 'No tiene suficiente saldo en el fondo(' + responseData.FondoCaja + ') para cancelar la entrada('+ responseData.Importe +').');
                        }
                        else {
                            var win = Ext.Cont.Comprobante.init(14, responseData.detalle, responseData.descripcion, responseData.fechaCont, responseData.dataComprobante, 3, 1, 1);
                            win.onSaved(function (idComprobant, numComprobant, fecha) {
                                if (idComprobant) {
                                    scope.loadMessageBox();
                                    Ext.Ajax.request({
                                        url: scope.url + 'cambiarEstadoEntrada',
                                        method: 'POST',
                                        params: {
                                            arrayIdDoc: Ext.encode(arrayIdDoc),
                                            idcomprobante: idComprobant,
                                            numerocomprobante: numComprobant,
                                            fecha: fecha,
                                            idCajaFondo: scope.idCajaFondo,
                                            tipoContabilizacion: tipoContabilizacion,
                                            // identradasello: record.get('identradasello'),
                                            // iddocanticipo: record.get('iddocumentoinst'),
                                            idanticipo: record.get('idanticipo'),
                                            importe: record.get('importemo'),
                                        },
                                        callback: function (options, success, response) {
                                            var responseData = Ext.decode(response.responseText);
                                            if (responseData.codMg == 1) {
                                                Ext.MessageBox.hide();
                                                mostrarMensaje(1, 'Posteo satisfactorio registrado en el comprobante ' + numComprobant + '.');
                                                scope.stEntrada.reload();
                                            }
                                            Ext.MessageBox.hide();

                                        }
                                    });
                                }
                            }).onClose(function () {
                                Ext.MessageBox.hide();
                            });
                        }
                    }
                });
            }
        };

    },
    initializeKeyMap: function(scope)
    {
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
//            if ()
//                scope.btn.handler.call();
        }, Ext.getBody());

        //MODIFICAR
        this.map.accessKey({
            key: 'm',
            alt: true
        }, function () {

        }, Ext.getBody());

        //ELIMINAR
        this.map.accessKey({
            key: Ext.EventObject.DELETE
        }, function () {

        }, Ext.getBody());

        //CANCELAR
        this.map.accessKey({
            key: 'x',
            alt: true
        }, function () {

        }, Ext.getBody());

        //CANCELAR LIQUIDACION
        this.map.accessKey({
            key: 'x',
            ctrl: true
        }, function () {

        }, Ext.getBody());

        //CONFIRMAR
        this.map.accessKey({
            key: 'f',
            alt: true
        }, function () {

        }, Ext.getBody());

        //CONTABILIZAR
        this.map.accessKey({
            key: 't',
            alt: true
        }, function () {

        }, Ext.getBody());

        //LIQUIDAR
        this.map.accessKey({
            key: 'l',
            alt: true
        }, function () {

        }, Ext.getBody());

        //VER
        this.map.accessKey({
            key: 'v',
            alt: true
        }, function () {

        }, Ext.getBody());

        //GRAFICAR
        this.map.accessKey({
            key: 'g',
            alt: true
        }, function () {

        }, Ext.getBody());

        //BUSCAR
        this.map.accessKey({
            key: 'b',
            alt: true
        }, function () {

        }, Ext.getBody());

        //AYUDA
        this.map.accessKey({
            key: 'h',
            alt: true
        }, function () {

        }, Ext.getBody());

        //TAB
        this.map.accessKey({
            key: Ext.EventObject.TAB
        }, function () {
//            if (document.activeElement.tabIndex == 14)
//                scope.objWindowsDuo.cbAddTipoDoc.focus(true, 10);
//            else if (document.activeElement.tabIndex == 108)
//                scope.objWindowsDuo.cbBuscarTipoDoc.focus(true, 10);
//            else if (document.activeElement.tabIndex == 1)
//                scope.objWindowsDuo.btnAddConfirmar.focus();
//            else if (document.activeElement.tabIndex == 100)
//                scope.objWindowsDuo.btnBuscarAceptar.focus();
        }, Ext.getBody());

    }
});
new Ext.ClassGestSellos({url: '/contabilidad/caja/sellos/index.php/gestsellos/'});