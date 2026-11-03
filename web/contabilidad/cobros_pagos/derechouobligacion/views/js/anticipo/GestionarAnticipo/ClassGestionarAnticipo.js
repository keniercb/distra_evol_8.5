Ext.namespace('Ext.ClassGestionarAnticipo');

Ext.ClassGestionarAnticipo = new Ext.extend(Ext.Component, {
    etiquetas: undefined,
    objWindowsAnticipo: '',
    tipoAnticipo: undefined,
    nombreCliente: undefined,
    nombreFecha: undefined,
    nombreComponente: undefined,
    mascPrincipal: undefined,
    inicio: true,
    arrayValuesSelections: new Array(),
    arrayValues: new Array(),
    contabilizarVentana: false,
    fechaContable: undefined,
    contabilizar: false, //opcion para contabilizar en la vista del comprobante...
    tipoAnticipoTexto: undefined,
    confEspecialidad: false, //true si lleva Especialidad
    confCancelarContabilizado: true, //true si se puede cancelar un documento cancelado en el btnCancelarAnticipo
    confFechaRecepcion: false,
    artAnticipoTexto: undefined,
    tipoAnticipoTextoPlural: undefined,
    artAnticipoTextoP: undefined,
    idClienteAnticipo: undefined,
    importeAnticipoCliente: undefined,
    impTotalCxcLiquidar: undefined,
    tipo: undefined,
    url: '/contabilidad/cobros_pagos/derechouobligacion/index.php/anticipo/',
    constructor: function (params) {
        this.tipoAnticipo = params;
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        perfil = window.parent.perfil;

        if (!document.getElementById('CmpAction'))
            this.loadJs("/contabilidad/cobros_pagos/cargainicial/views/js/componentes/CmpAction/cmpaction", 'CmpAction');

        if (!document.getElementById('UIGestionarAnticipo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/anticipo/GestionarAnticipo/UIGestionarAnticipo", 'UIGestionarAnticipo');

        if (!document.getElementById('ClassMovimientoAnticipo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/anticipo/MovimientoAnticipo/ClassMovimientoAnticipo", 'ClassMovimientoAnticipo');

        if (!document.getElementById('UIMovimientoAnticipo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/anticipo/MovimientoAnticipo/UIMovimientoAnticipo", 'UIMovimientoAnticipo');

        if (!document.getElementById('SCFPrintView'))
            this.loadJs("/contabilidad/comun/SCFPrintView/views/js/SCFPrintView", 'SCFPrintView');

        if (!document.getElementById('MessageBox'))
            this.loadJs("/contabilidad/comun/componentes/MessageBox/MessageBox", 'MessageBox');

        if (!document.getElementById('ClassMotivoCancelacion'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/MotivoCancelacion/ClassMotivoCancelacion", 'ClassMotivoCancelacion');

        this.stTipo = new Ext.data.SimpleStore({
            fields: ['idtipo', 'descripcion'],
            data: [
                ['1', 'Cobros'],
                ['2', 'Pagos']
            ]
        });

        this.stGestionarAnticipo = new Ext.data.Store({//PASARLE EL BEFORELOAD DEL ORIGINAL
            url: this.url + 'cargarAnticiposPorCliente',
            baseParams: {
                tipoanticipo: this.tipoAnticipo,
                tipo: scope.tipo,
                limit: 20,
                params: undefined
            },
            reader: new Ext.data.JsonReader({
                id: 'reader',
                totalProperty: 'cantidad_filas',
                root: 'datos'
            }, [{
                name: 'tipo'
            }, {
                name: 'idcliente'
            }, {
                name: 'nombre'
            }, {
                name: 'importetotal',
                type: 'float'
            }, {
                name: 'importependiente',
                type: 'float'
            }
            ])
        });

        this.stDesgloseLiquidacion = new Ext.data.GroupingStore({//PASARLE EL BEFORELOAD DEL ORIGINAL
            url: this.url + 'cargardesgloseliquidaciones',
            baseParams: {
                tipoanticipo: this.tipoAnticipo,
                tipo: scope.tipo,
                limit: 20,
                params: undefined
            },
            reader: new Ext.data.JsonReader({
                id: 'reader',
                totalProperty: 'cantidad_filas',
                root: 'datos'
            }, [{
                name: 'idliquidacion'
            }, {
                name: 'idanticipo'
            }, {
                name: 'idcliente'
            }, {
                name: 'idoperacion'
            }, {
                name: 'numero'
            }, {
                name: 'idcuentaduo'
            }, {
                name: 'idcuentaanticipo'
            }, {
                name: 'idderechouobligacion'
            }, {
                name: 'numerodocumento'
            }, {
                name: 'fecha'
            }, {
                name: 'tipo'
            }, {
                name: 'idtasa'
            }, {
                name: 'idtipodocumento'
            }, {
                name: 'idtipodocumentoant'
            }, {
                name: 'idoperacioncontable'
            }, {
                name: 'numcomprobante'
            }, {
                name: 'showCmp'
            }, {
                name: 'importe',
                type: 'float'
            }
            ])
        });

        this.stDesgloseMovimiento = new Ext.data.Store({//PASARLE EL BEFORELOAD DEL ORIGINAL
            url: this.url + 'cargardesgloseMovimientos',
            baseParams: {
                tipoanticipo: this.tipoAnticipo,
                tipo: scope.tipo,
                limit: 20,
                params: undefined
            },
            reader: new Ext.data.JsonReader({
                id: 'reader',
                idProperty: 'idanticipocancelado',
                totalProperty: 'cantidad_filas',
                root: 'datos'
            }, [{
                name: 'idanticipocancelado'
            }, {
                name: 'idanticipo'
            }, {
                name: 'idoperacion'
            }, {
                name: 'numerodocumento'
            }, {
                name: 'arrcuentas'
            }, {
                name: 'comentario'
            }, {
                name: 'fecha'
            }, {
                name: 'numcomprobante'
            }, {
                name: 'showCmp'
            }, {
                name: 'importe',
                type: 'float'
            }
            ])
        });

        this.rowactionConfirmar = new Ext.grid.RowActions({
            id: 'rowactionConfirmar',
            //header: 'Conciliar',
            align: 'center',
            width: 100,
            actions: [
                {
                    id: 'confirmar',
                    tooltip: 'Cancelar liquidaci&oacute;n',//this.idioma.lbDelTalonario,
                    iconCls: 'cancelar',
                    width: 40
                }
            ]
        });

        this.rowactionConfirmarMov = new Ext.grid.RowActions({
            id: 'rowactionConfirmarMov',
            //header: 'Conciliar',
            align: 'center',
            width: 100,
            actions: [
                {
                    id: 'confirmarMov',
                    tooltip: 'Cancelar movimiento',//this.idioma.lbDelTalonario,
                    iconCls: 'cancelar',
                    hideIndex: '!arrcuentas',
                    width: 40
                }
            ]
        });

        this.rowactionCancelarAnticipo = new Ext.grid.RowActions({
            id: 'rowactionCancelarAnticipo',
            //header: 'Conciliar',
            align: 'center',
            width: 100,
            actions: [
                {
                    id: 'mover',
                    tooltip: 'Liquidar anticipo',//this.idioma.lbDelTalonario,
                    iconCls: 'traspaso',
                    width: 40
                }
            ]
        });

        this.rowactionContabAnticipo = new Ext.grid.RowActions({
            id: 'rowactionContabAnticipo',
            // header: 'Contabilizar',
            align: 'center',
            width: 100,
            actions: [
                {
                    id: 'contabAnticipo',
                    tooltip: 'Contabilizar anticipo',//this.idioma.lbDelTalonario,
                    iconCls: 'liquidar',
                    width: 40
                }
            ]
        });

        this.stDesgloseAnticipo = new Ext.data.GroupingStore({//PASARLE EL BEFORELOAD DEL ORIGINAL
            url: this.url + 'cargarpagoanticipado',
            baseParams: {
                // limit: 20,
                params: undefined
            },
            reader: new Ext.data.JsonReader({
                id: 'reader',
                totalProperty: 'cantidad_filas',
                root: 'datos'
            }, [{
                name: 'nInstrumento',
                mapping: 'numero'
            }, {
                name: 'iddocinstrumento'
            }, {
                name: 'idanticipo'
            }, {
                name: 'denominacioncliente'
            }, {
                name: 'fecha'
            }, {
                name: 'importe',
                type: 'float'
            }, {
                name: 'pendiente',
                type: 'float'
            }, {
                name: 'estado'
            }, {
                name: 'frecepcion'
            }, {
                name: 'femision'
            }, {
                name: 'comentario'
            }, {
                name: 'elaborado'
            }, {
                name: 'idcliente'
            }, {
                name: 'idmoneda'
            }, {
                name: 'moneda'
            }, {
                name: 'cuenta'
            }, {
                name: 'tipo'
            }, {
                name: 'idtasa'
            }, {
                name: 'denominaciontipo'
            }, {
                name: 'text'
            }, {
                name: 'concatcta'
            }, {
                name: 'idestadoanticipo'
            }, {
                name: 'activo'
            }, {
                name: 'idoperacion'
            }, {
                name: 'estadoliquidacion'
            }, {
                name: 'operacionesenzona'
            }
            ]),
            sortInfo: {field: 'pendiente', direction: "ASC"},
            groupField: 'idmoneda'
        });

        this.stTraspasoAnticipo = new Ext.data.GroupingStore({//PASARLE EL BEFORELOAD DEL ORIGINAL
            url: this.url + 'cargarpagoanticipado',
            baseParams: {
                limit: 20,
                params: undefined
            },
            reader: new Ext.data.JsonReader({
                id: 'reader',
                totalProperty: 'cantidad_filas',
                root: 'datos'
            }, [{
                name: 'nInstrumento',
                mapping: 'numero'
            }, {
                name: 'iddocinstrumento'
            }, {
                name: 'idanticipo'
            }, {
                name: 'denominacioncliente'
            }, {
                name: 'fecha'
            }, {
                name: 'importe',
                type: 'float'
            }, {
                name: 'pendiente',
                type: 'float'
            }, {
                name: 'estado'
            }, {
                name: 'frecepcion'
            }, {
                name: 'femision'
            }, {
                name: 'comentario'
            }, {
                name: 'elaborado'
            }, {
                name: 'idcliente'
            }, {
                name: 'idmoneda'
            }, {
                name: 'moneda'
            }, {
                name: 'cuenta'
            }, {
                name: 'tipo'
            }, {
                name: 'idtasa'
            }, {
                name: 'denominaciontipo'
            }, {
                name: 'text'
            }, {
                name: 'concatcta'
            }, {
                name: 'idestadoanticipo'
            }, {
                name: 'activo'
            }, {
                name: 'estadoliquidacion'
            }
            ]),
            sortInfo: {field: 'pendiente', direction: "ASC"},
            groupField: 'idmoneda'
        });

        this.recordLiquidarCxc = [{
            name: 'ndocumentos',
            mapping: 'numero'
        }, {
            name: 'ipendientes',
            mapping: 'importeapagar',
            type: 'float'
        }, {
            name: 'comentarios',
            mapping: 'comentario'
        }, {
            name: 'ipagar',
            mapping: 'importeapagar',
            type: 'float'
        }, {
            name: 'importemo',
            type: 'float'
        }, {
            name: 'idoperacion'
        }, {
            name: 'idoperacioncont'
        }, {
            name: 'idcuenta'
        }, {
            name: 'idduo'
        }, {
            name: 'iva',
            type: 'float'
        }, {
            name: 'liquidadomb',
            type: 'float'
        }, {
            name: 'retencion',
            type: 'float'
        }, {
            name: 'idcompretenciones'
        }, {
            name: 'idliquidacionfnz'
        }, {
            name: 'numerocomprobante'
        }, {
            name: 'ivaventa',
            type: 'float'
        }, {
            name: 'impuestomunicipal',
            type: 'float'
        }, {
            name: 'impuestorenta',
            type: 'float'
        }, {
            name: 'observacionretencion'
        }, {
            name: 'importeImpuestoRenta'
        }, {
            name: 'importeIvaEnVenta'
        }, {
            name: 'idtipodocumento'
        }, {
            name: 'tipodoc'
        }, {
            name: 'fecha'
        }, {
            name: 'concatcta'
        }, {
            name: 'noperacionenzona'
        }
        ];

        this.stLiquidarCxc = new Ext.data.Store({//PASARLE EL BEFORELOAD DEL ORIGINAL
            url: this.url + 'cargarinstrumentoscobro',
            reader: new Ext.data.JsonReader({
                id: 'reader',
                totalProperty: 'cantidad_filas',
                root: 'datos'
            }, Ext.data.Record.create(this.recordLiquidarCxc))
        });

        this.stClienteProv = new Ext.data.Store({//PASARLE EL BEFORELOAD DEL ORIGINAL
            url: this.url + 'cargarAnticiposPorCliente',
            reader: new Ext.data.JsonReader({
                // id: 'reader',
                totalProperty: 'cantidad_filas',
                root: 'datos'
            }, [
                {
                    name: 'idcliente'
                },
                {
                    name: 'nombre'
                }
            ])
        });
        this.loadDataComponent(this);
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
    loadMessageBox: function (msg = 'Cargando...') {
        Ext.MessageBox.show({
            title: this.etiquetas.lbMsgEspere,
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
    loadDataComponent: function (scope) {
        Ext.Ajax.request({
            method: "POST",
            url: this.url + "cargaretiquetas",
            callback: function (options, success, response) {
                scope.etiquetas = Ext.decode(response.responseText);
                scope.initializeClass();
            }
        });
    },
    initializeClass: function () {
        this.ViewPort = new Ext.UIGestionarAnticipo.ViewPort(this, {
            items: [this.pnlContenedor = new Ext.UIGestionarAnticipo.pnlContenedor(this, "this.nombreComponente")]
        });

        this.initializeDataIni(this);
        this.initializeEvents(this);
        this.initializeFunctions(this);
        this.initializeKeyMap(this);

        return Ext.ClassGestionarAnticipo.superclass.constructor.call(this);
    },
    initializeDataIni: function (scope) {
        //scope.cbTipo.setValue(scope.stTipo.data.items[0].data.idtipo);
        //scope.cbTipo.setRawValue(scope.stTipo.data.items[0].data.descripcion);
        scope.tipo = scope.cbTipo.getValue();

        Ext.Ajax.request({
            method: "GET",
            url: scope.url + "buscarfechacontable",
            callback: function (options, success, response) {
                var fecha = Ext.decode(response.responseText);
                scope.lfdFechaContable.setText('Fecha contable: ' + fecha.fecha);
            }
        });

        /*Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbMsgLoadData);
        Ext.Ajax.request({
            method: "POST",
            url: scope.url + 'cargarAnticiposPorCliente',
            params: {
                tipoanticipo: scope.tipoAnticipo,
                tipo: scope.tipo,
                limit: 20,
                params: undefined
            },
            callback: function(options, success, response) {
                //scope.btnLiquidar.focus();

                responseData = Ext.decode(response.responseText);
                scope.fechaContable = responseData.fechacontable;

                if (responseData.aperturado == 0) {//0=ci, 1=aperturado
                    scope.objWindowsAnticipo = 'anticipo';
                    mostrarMensaje(1, scope.etiquetas.lbCPInCargaInicial);
                    Ext.getCmp('gpGestionarAnticipo').disable();
                    Ext.getCmp('gpDesgloseAnticipo').disable();
                    Ext.getCmp('gpLiquidarCxc').disable();
                }
                else if (responseData.cantidad_filas > 0) {
                    scope.btnVerAnticipo.enable();
                    scope.btnGraficarAnticipo.enable();
                    scope.stGestionarAnticipo.loadData(responseData);
                }
                Ext.CONT.Componentes.HideBox('msgbIniciando');
            }
        });*/
    },
    initializeEvents: function (scope) {
        this.btnLiquidar.setHandler(function () {
            scope.fCargarCxcCliente();
        }, scope);

        this.gpGestionarAnticipo.on('rowdblclick', function (component) {
            scope.fCargarDesgloseAnticiposPorCliente();
        });

        this.gpDesgloseAnticipo.on('rowdblclick', function (component) {
            scope.fCargarCxcCliente();
        });

        this.btnComprobanteRetencion.setHandler(function () {
            scope.fShowComprobanteRetencion();
        }, scope);

        this.btnEliminarRetencion.setHandler(function () {
            scope.fEliminarRetencion();
        }, scope);

        this.btnDesactivarAnticipo.setHandler(function () {
            scope.fShowDesactivarAnticipo();
        }, scope);

        this.btnReporte.setHandler(function () {
            scope.getDataReporte();
        }, scope);

        this.btnLiquidarTodos.setHandler(function () {
            scope.fLiquidarTodos();
        }, scope);

        this.btnRegistrarLiquidacion.setHandler(function () {
            // if(scope.tfTotalLiquidar.getValue() <= scope.importeAnticipoCliente)
            // if (scope.smGestionarAnticipo.getSelected().data.importependiente - scope.tfTotalLiquidar.getValue() >= 0)
            scope.fActualizarTotalLiquidar();
            if (scope.smDesgloseAnticipo.getSelected().data.pendiente - scope.tfTotalLiquidar.getValue() >= 0)
                scope.fShowContabilizarAnticipo();
            else
                mostrarMensaje(1, scope.etiquetas.impLiqMayorAnticipo);
        }, scope);

        this.btnVerLiquidaciones.setHandler(function () {
            scope.stDesgloseLiquidacion.baseParams.idcliente = scope.idClienteAnticipo;
            scope.stDesgloseLiquidacion.load();
            // scope.gpDesgloseLiquidacion.show();
        }, scope);

        this.btnEliminarLiquidaciones.setHandler(function () {

            var sel = this.smDesgloseLiquidacion.getSelections();
            var arrtemp = [];

            sel.forEach(function (element, index) {
                arrtemp.push(element.data);
            });

            scope.fShowComprobanteCancelarLiquidacion(arrtemp);
        }, scope);

        this.btnEliminarMovimientos.setHandler(function () {

            var sel = this.smDesgloseMovimiento.getSelections();
            var arrtemp = [];
            var flag = true;

            sel.forEach(function (element, index) {
                arrtemp.push(element.get('numerodocumento'));
                if (!element.get('arrcuentas')) {
                    flag = false;
                }
            });
            if (flag) {
                var motivo = new Ext.ClassMotivoCancelacion({
                    url: '/contabilidad/cobros_pagos/cargainicial/index.php/cobroypagoanticipado/',
                    pregunta: '¿Est&aacute; seguro que quiere cancelar el movimiento?',
                    numero: arrtemp.join(", "),
                });
                motivo.on('motivocancelacion', function (idmotivo, motivo) {
                    scope.fShowComprobanteCancelarMovAnticipo(sel, idmotivo);
                });
            }
        }, scope);

        this.btnVerMovimiento.setHandler(function () {
            scope.stDesgloseMovimiento.baseParams.idcliente = scope.idClienteAnticipo;
            scope.stDesgloseMovimiento.load();
            // scope.gpDesgloseLiquidacion.show();
        }, scope);

        this.btnLimpiar.setHandler(function () {
            scope.fLimpiarGridCxc();
        }, scope);

        // Menu contextual
        this.gpLiquidarCxc.on({
            afteredit: function (conf) {
                var importependienteanticipo = scope.smDesgloseAnticipo.getSelected().data.pendiente;
                var sumTotalLiquidar = parseFloat(scope.obtenerSaldoTotalLiquidar()).toFixed(2);
                if (parseFloat(sumTotalLiquidar) > parseFloat(importependienteanticipo)) {
                    conf.record.set('ipagar', 0);
                    conf.record.commit();

                    var msg = (scope.cbTipo.getValue() == 1) ? scope.etiquetas.msgImporteMayorCobro : scope.etiquetas.msgImporteMayorPago;
                    mostrarMensaje(1, msg);
                } else if (parseFloat(conf.value) > parseFloat(conf.record.data.ipendientes)) {
                    // else if (conf.value > conf.record.data.ipendientes) {
                    conf.record.set('ipagar', conf.record.data.ipendientes);
                    conf.record.commit();

                    var msg = (scope.cbTipo.getValue() == 1) ? scope.etiquetas.msgILiquidarMayorIPendienteCobro : scope.etiquetas.msgILiquidarMayorIPendientePago;
                    mostrarMensaje(1, msg);
                }

                if (parseFloat(conf.value) == 0.00) {
                    conf.record.commit();
                }
                scope.fActualizarTotalLiquidar();
            },
            // render: function () {
            //     if (scope.gpLiquidarCxc.hasListener('rowmousedown')) {
            //         scope.gpLiquidarCxc.events['rowmousedown'].clearListeners();
            //     }
            // },
            // afteredit: function (conf) {
            //     var importependienteanticipo = scope.smDesgloseAnticipo.getSelected().data.pendiente;
            //     var sumTotalLiquidar = parseFloat(scope.stLiquidarCxc.sum('ipagar')).toFixed(2);
            //     if (parseFloat(sumTotalLiquidar) > parseFloat(importependienteanticipo)) {
            //         // if (scope.fSaldo(sumTotalLiquidar) > scope.fSaldo(importependienteanticipo)) {
            //         conf.record.set('ipagar', 0);
            //         conf.record.commit();
            //
            //         var msg = (scope.cbTipo.getValue() == 1) ? scope.etiquetas.msgImporteMayorCobro : scope.etiquetas.msgImporteMayorPago;
            //         mostrarMensaje(1, msg);
            //     } else if (parseFloat(conf.value) > parseFloat(conf.record.data.ipendientes)) {
            //         // else if (conf.value > conf.record.data.ipendientes) {
            //         conf.record.set('ipagar', 0);
            //         conf.record.commit();
            //
            //         var msg = (scope.cbTipo.getValue() == 1) ? scope.etiquetas.msgILiquidarMayorIPendienteCobro : scope.etiquetas.msgILiquidarMayorIPendientePago;
            //         mostrarMensaje(1, msg);
            //     }
            //
            //     if (parseFloat(conf.value) == 0.00) {
            //         conf.record.commit();
            //     }
            //     scope.fActualizarTotalLiquidar();
            // },
            beforeedit: function (obj) {
                // var setValorPendiente = false;
                // if (obj.field == 'ipagar') {
                //     if (Ext.isEmpty(obj.record.data.ipagar)) {
                //         setValorPendiente = true;
                //     } else if (!Ext.isEmpty(obj.record.data.ipagar)) {
                //         if (parseFloat(obj.record.data.ipagar) == 0) {
                //             setValorPendiente = true;
                //         }
                //     }
                //     if (setValorPendiente) {
                //         obj.record.set('ipagar', obj.record.get('ipendientes'));
                //         scope.fActualizarTotalLiquidar();
                //     }
                // }
                scope.smLiquidarCxc.selectRow(obj.row, true)
            },
            validateedit: function (obj) {
            }
        });

        scope.smLiquidarCxc.on({
            selectionchange: function (selModel) {
                // if (scope.gpLiquidarCxc.getStore().getCount() === selModel.getCount()) {
                //     scope.gpLiquidarCxc.getStore().each(function (record) {
                //         record.set('ipagar', record.get('ipendientes'));
                //     });
                //     // scope.fActualizarTotalLiquidar();
                // } else if (selModel.getCount() === 0) {
                //     scope.gpLiquidarCxc.getStore().suspendEvents();
                //     scope.gpLiquidarCxc.getStore().each(function (record) {
                //         record.set('ipagar', 0);
                //     });
                //     scope.gpLiquidarCxc.getStore().resumeEvents();
                //     scope.gpLiquidarCxc.getStore().commitChanges();
                //     // scope.fActualizarTotalLiquidar();
                // }
            },
            rowselect: function (smodel, rowIndex, record) {
                // var setValorPendiente = false;
                // if (Ext.isEmpty(record.data.ipagar)) {
                //     setValorPendiente = true;
                // } else if (!Ext.isEmpty(record.data.ipagar)) {
                //     if (parseFloat(record.data.ipagar) == 0) {
                //         setValorPendiente = true;
                //     }
                // }
                // if (setValorPendiente) {
                //     record.set('ipagar', record.get('ipendientes'));
                //     scope.fActualizarTotalLiquidar();
                // }

                scope.fActualizarTotalLiquidar();
                // record.set('ipagar', record.get('ipendientes'));
                // scope.actualizarSaldoTotalLiquidar(record.get('ipendientes'));
            },
            rowdeselect: function (smodel, rowIndex, record) {
                // record.set('ipagar', 0);
                // record.commit();
                scope.fActualizarTotalLiquidar();
                // scope.actualizarSaldoTotalLiquidar(record.get('ipendientes') * -1);
            },
        });

        scope.stGestionarAnticipo.on({
            beforeload: function () {
                Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbMsgLoadData);
                scope.stGestionarAnticipo.baseParams.tipo = scope.cbTipo.getValue();
                //Limpiando los store de los demas grid
                scope.stDesgloseAnticipo.removeAll();
                scope.stLiquidarCxc.removeAll();
                scope.fActualizarTotalLiquidar();
            },
            load: function () {
                Ext.CONT.Componentes.HideBox('msgbIniciando');
                var msg = (scope.cbTipo.getValue() == 1)
                    ? 'No existen deudores con cobros anticipados posibles a liquidar.'
                    : 'No existen acreedores con pagos anticipados posibles a liquidar.';
                if (this.getCount() == 0)
                    mostrarMensaje(1, msg);
            }
        });

        scope.stDesgloseAnticipo.on({
            beforeload: function () {
                if (scope.cbclienteprovee.getValue()) {
                    // scope.idClienteAnticipo = scope.smGestionarAnticipo.getSelected().data.idcliente;
                    scope.idClienteAnticipo = scope.cbclienteprovee.getValue();
                    scope.stDesgloseAnticipo.baseParams.idcliente = scope.idClienteAnticipo;
                    scope.stDesgloseAnticipo.baseParams.tipo = scope.cbTipo.getValue();
                    scope.stLiquidarCxc.removeAll();
                    scope.stDesgloseLiquidacion.removeAll();
                    scope.fActualizarTotalLiquidar();
                    return true;
                } else {
                    mostrarMensaje(1, scope.etiquetas.msgSeleccionarunUsuario);
                    return false;
                }
            }
        });

        scope.stDesgloseMovimiento.on({
            clear: function () {
                scope.btnEliminarMovimientos.disable();
            }
        });

        scope.stDesgloseLiquidacion.on({
            clear: function () {
                scope.btnEliminarLiquidaciones.disable();
            }
        });

        this.cbTipo.on({
            select: function () {
                scope.stLiquidarCxc.removeAll();
                scope.stDesgloseAnticipo.removeAll();
                var titulo = (scope.cbTipo.getValue() == 1)
                    ? 'Cargar cuentas por cobrar' : 'Cargar cuentas por pagar';
                // scope.menuItemClientProvee.setText(titulo);

                // scope.stGestionarAnticipo.baseParams = {};
                // scope.stGestionarAnticipo.baseParams.tipo = this.getValue();
                scope.btnLimpiar.hide();
                scope.cbclienteprovee.reset();
                // scope.stGestionarAnticipo.load({
                // callback: function (options, success, response) {
                // if (scope.stGestionarAnticipo.getCount() > 0)
                // scope.cbclienteprovee.enable();
                // else
                // scope.cbclienteprovee.disable();
                // }
                // });
                scope.cbclienteprovee.enable();
                var header = (scope.cbTipo.getValue() == 1) ? scope.etiquetas.headerCliente : scope.etiquetas.headerProveedor;
                // scope.gpGestionarAnticipo.getColumnModel().setColumnHeader(1, header);
            },
            change: function (cb, newV, oldV) {
                if (oldV != '') {
                    scope.stClienteProv.reload();
                }
            }
        });

        this.gpGestionarAnticipo.on({
            /*rowcontextmenu: function(grid, rowIndex, eventObject) {
             eventObject.stopEvent();
             scope.menuItemClientProvee.show();
             scope.menuItemDesgAnticipos.show();

             this.getSelectionModel().clearSelections();
             this.getSelectionModel().selectRow(rowIndex);
             scope.menuContextual.showAt(eventObject.getXY());

             record = scope.smGestionarAnticipo.getSelected();

             if(record) {
             if(record.data.importependiente != 0) {
             scope.menuItemClientProvee.show();
             } else {
             scope.menuItemClientProvee.hide();
             }
             }
             }*/
        });

        this.menuItemClientProvee.on('click', function () {
            scope.fCargarCxcCliente();
        });
        this.menuItemDesgAnticipos.on('click', function () {
            scope.fCargarDesgloseAnticiposPorCliente();
        });

        scope.stClienteProv.on({
            beforeload: function () {
                this.baseParams.tipo = scope.cbTipo.getValue();
                scope.stDesgloseMovimiento.removeAll();
                // this.baseParams.start = 0;
                // this.baseParams.limit = 10;
                // },
                // load: function() {
                //     if (this.getCount() > 0)
                //         scope.cbclienteprovee.enable();
                //     else
                //         scope.cbclienteprovee.disable();
            },
            load: function (r) {
            }
        });

        this.cbclienteprovee.on({
            select: function () {
                // scope.buscarClientProv();
                scope.stDesgloseMovimiento.removeAll();
                scope.idClienteAnticipo = scope.cbclienteprovee.getValue();
                scope.btnVerLiquidaciones.enable();
                scope.btnVerMovimiento.enable();
                scope.fCargarDesgloseAnticiposPorCliente();
            }
        });

        this.btnLimpiar.on({
            click: function () {
                scope.cbclienteprovee.reset();
                scope.stGestionarAnticipo.baseParams = {};
                scope.stGestionarAnticipo.baseParams.tipo = scope.cbTipo.getValue();
                scope.stGestionarAnticipo.load();
                this.hide();
            }
        });

        scope.btnFiltrarLiquidacion.on({
            click: function () {
                var storeLiq = scope.stLiquidarCxc;
                if (storeLiq.getCount() > 0) {
                    var add = new Ext.ClassFiltrarObligaciones.Controller({
                        loadMessageBox: scope.loadMessageBox,
                        tipo: scope.tipo,
                        etiquetas: scope.etiquetas,
                        parametrosBase: storeLiq.baseParams,
                        records: scope.smLiquidarCxc.getSelections(),
                        dataRecord: scope.recordLiquidarCxc
                    });

                    add.on({
                        adicionar: function (records) {
                            var storeLiq = scope.stLiquidarCxc;
                            storeLiq.removeAll();
                            storeLiq.add(records);
                            scope.smLiquidarCxc.selectAll();
                            // this.actualizarResto(this.smObligaciones);
                        }
                    });
                }
            }
        });

    },
    initializeFunctions: function (scope) {
        this.rowactionConfirmar.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'confirmar':
                    mostrarMensaje(2, '¿Est&aacute; seguro que quiere cancelar la liquidaci&oacute;n?', function (btn) {
                        if (btn === 'ok') {
                            scope.fShowComprobanteCancelarLiquidacion(new Array(record.data));
                        }
                    });
                    break;
            }
        });

        this.rowactionConfirmarMov.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'confirmarMov':
                    if (record.get('arrcuentas')) {
                        var motivo = new Ext.ClassMotivoCancelacion({
                            url: '/contabilidad/cobros_pagos/cargainicial/index.php/cobroypagoanticipado/',
                            pregunta: '¿Est&aacute; seguro que quiere cancelar el movimiento?',
                            numero: record.get('numerodocumento'),
                        });
                        motivo.on('motivocancelacion', function (idmotivo, motivo) {
                            scope.fShowComprobanteCancelarMovAnticipo(new Array(record), idmotivo);
                        });
                    }
                    break;
            }
        });

        this.rowactionCancelarAnticipo.on('action', function (grid, record, action, rowIndex, col, e) {
            mostrarMensaje(2, '¿Est&aacute; seguro que quiere liquidar el anticipo seleccionado?', function (btn) {
                scope.recordAnticipoSel = record;
                if (btn === 'ok') {
                    parametros = {
                        importe: record.data.pendiente,
                        numero: record.data.nInstrumento,
                        idmoneda: record.data.idmoneda,
                        // tipoAnticipo: scope.tipoAnticipo, //1, 2, 3, 4
                        tipoAnticipo: scope.cbTipo.getValue(), //1-Cobro Anticipado, 2-Pagos Anticipados
                        url: scope.url,
                    };

                    // scope.loadMask('Cargando...');

                    if (!scope.objWindowsAnticipo)
                        scope.objWindowsAnticipo = new Ext.ClassMovimientoAnticipo(scope.etiquetas, parametros);
                    // scope.objWindowsDuo = new Ext.ClassMovimientoAnticipo(scope.etiquetas);

                    scope.objWindowsAnticipo.addListener('closeCancelar', function (cancel, infoAgrupada, params) {
                        scope.objWindowsAnticipo = '';
                    });

                    scope.objWindowsAnticipo.addListener('cancelarContabilizado', function (params) {
                        scope.fShowComprobanteCancelarAnticipo(params);
                    });
                    // scope.fShowComprobanteCancelarLiquidacion(record.data);
                }
            });
        });

        this.fLiquidarTodos = function () {
            dataCxc = new Array();
            sumaImporte = '';
            totalImportePagar = scope.importeAnticipoCliente;
            for (var i = 0; i < scope.stLiquidarCxc.getCount(); i++) {
                if (totalImportePagar > 0) {
                    var rec = scope.stLiquidarCxc.getAt(i);
                    rec.data.ipagar = (rec.data.ipendientes <= totalImportePagar) ? rec.data.ipendientes : totalImportePagar;
                    scope.stLiquidarCxc.remove(scope.stLiquidarCxc.getAt(i));//elimina el que estaba
                    scope.stLiquidarCxc.insert(i, rec);
                    totalImportePagar -= rec.data.ipagar;
                    sumaImporte += rec.data.ipagar;
                }
            }
            scope.fActualizarTotalLiquidar();
        };

        this.fActualizarTotalLiquidar = function () {

            scope.impTotalCxcLiquidar = this.obtenerSaldoTotalLiquidar();

            scope.tfTotalLiquidar.setValue(scope.fSaldo(scope.impTotalCxcLiquidar));
            (scope.tfTotalLiquidar.getValue() > 0) ? scope.btnRegistrarLiquidacion.enable() : scope.btnRegistrarLiquidacion.disable();

            // scope.impTotalCxcLiquidar = scope.stLiquidarCxc.sum('ipagar');
            //
            // for (var i = 0; i < scope.stLiquidarCxc.getCount(); i++) {
            //     suma = parseFloat((scope.stLiquidarCxc.getAt(i).data.ipagar) ? scope.stLiquidarCxc.getAt(i).data.ipagar : 0) + parseFloat((scope.stLiquidarCxc.getAt(i).data.retencion) ? scope.stLiquidarCxc.getAt(i).data.retencion : 0);
            //     if (suma > scope.stLiquidarCxc.getAt(i).data.ipendientes) {
            //         var rec = scope.stLiquidarCxc.getAt(i);
            //         rec.data.ipagar = 0;
            //         scope.stLiquidarCxc.remove(scope.stLiquidarCxc.getAt(i));//elimina el que estaba
            //         scope.stLiquidarCxc.insert(i, rec);
            //     } else {
            //         scope.importeAnticipoCliente -= scope.stLiquidarCxc.getAt(i).data.ipagar;
            //     }
            //     if (scope.stLiquidarCxc.getAt(i).data.idliquidacionfnz == null || scope.stLiquidarCxc.getAt(i).data.idliquidacionfnz == '') {
            //         scope.impTotalCxcLiquidar = parseFloat((scope.impTotalCxcLiquidar > 0) ? scope.impTotalCxcLiquidar : 0) + parseFloat((scope.stLiquidarCxc.getAt(i).data.retencion > 0) ? scope.stLiquidarCxc.getAt(i).data.retencion : 0);
            //     }
            // }
            // scope.tfTotalLiquidar.setValue(scope.fSaldo((scope.impTotalCxcLiquidar > 0) ? scope.impTotalCxcLiquidar : 0));
            // //scope.tfTotalLiquidar.setValue(scope.fSaldo((importependienteanticipo > 0) ? importependienteanticipo : 0));
            // (scope.tfTotalLiquidar.getValue() > 0) ? scope.btnRegistrarLiquidacion.enable() : scope.btnRegistrarLiquidacion.disable();
        };

        this.obtenerSaldoTotalLiquidar = function () {
            var records = scope.smLiquidarCxc.getSelections();
            var impTotalCxcLiquidar = 0;

            for (var i = 0; i < records.length; i++) {
                var ipagar = parseFloat((records[i].data.ipagar) ? records[i].data.ipagar : 0);
                if (ipagar > records[i].data.ipendientes) {
                    records[i].set('ipagar', 0);
                    records[i].commit();
                } else {
                    scope.importeAnticipoCliente -= records[i].data.ipagar;
                }
                impTotalCxcLiquidar += records[i].get('ipagar');
            }
            return impTotalCxcLiquidar;
        };

        this.actualizarSaldoTotalLiquidar = function (importe) {
            scope.tfTotalLiquidar.setValue((parseFloat(scope.tfTotalLiquidar.getValue()) + importe).toFixed(2));
        };

        this.fNroDocConcatenados = function () {
            var arrayAnticipo = new Array();
            arrayAnticipo = scope.fGetSelectionsOnPaging();
            var facturas = '';
            for (var v = 0; v < arrayAnticipo.length; v++) {
                facturas += arrayAnticipo[v].numerodocumento;
                if (v < arrayAnticipo.length - 1)
                    facturas += ';  ';
            }
            facturas += '<br>' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            return facturas;
        };

        this.fShowConfirmarAnticipo = function (arregloselect) {
            arregloselect = (!Ext.isArray(arregloselect)) ? [arregloselect] : arregloselect;
            scope.objWindowsAnticipo = arregloselect;

            var msg = scope.etiquetas.lbConfirmConf;
            msg = (scope.tipoAnticipo == 1 || scope.tipoAnticipo == 2) ? ((arregloselect.length > 1) ? msg.replace("<#artAnticipo>", scope.artAnticipoTextoP.toLowerCase()).replace("<#tipoAnticipo>", scope.tipoAnticipoTextoPlural.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelFP) : msg.replace("<#artAnticipo>", scope.artAnticipoTexto.toLowerCase()).replace("<#tipoAnticipo>", scope.tipoAnticipoTexto.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelF)) :
                ((arregloselect.length > 1) ? msg.replace("<#artAnticipo>", scope.artAnticipoTextoP.toLowerCase()).replace("<#tipoAnticipo>", scope.tipoAnticipoTextoPlural.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelMP) : msg.replace("<#artAnticipo>", scope.artAnticipoTexto.toLowerCase()).replace("<#tipoAnticipo>", scope.tipoAnticipoTexto.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelM));

            Ext.Msg.confirm(scope.etiquetas.titleConfirm, msg, function (btnPress) {
                if (btnPress === 'yes') {
                    scope.fConfirmarAnticipo(arregloselect);
                } else {
                    scope.btnLiquidar.focus();
                    scope.objWindowsAnticipo = '';
                }
            });
        };

        this.fShowDesactivarAnticipo = function () {
            scope.objWindowsAnticipo = 'anticipo';
            title = scope.etiquetas.lbBtnDesactivar;
            messageAction = (scope.smDesgloseAnticipo.getSelected().data.activo == 1) ? scope.etiquetas.lbActionDesactivar : scope.etiquetas.lbActionActivar;
            functionAction = scope.fDesactivarAnticipo;
            scope.fShowMessage(title, messageAction, functionAction);
        };

        this.fDesactivarAnticipo = function (btn) {
            if (btn == 'ok') {
                Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbConfirmando);

                var arrayIdAnticipo = [];
                arrayIdAnticipo.push(scope.smDesgloseAnticipo.getSelected().data.idanticipo);
                argActivacion = (scope.smDesgloseAnticipo.getSelected().data.activo == 1) ? 0 : 1;
                Ext.Ajax.request({
                    url: scope.url + 'desactivaranticipos',
                    method: 'POST',
                    params: {
                        arrayIdAnticipo: Ext.encode(arrayIdAnticipo),
                        argActivacion: argActivacion
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        respuesta = responseData;

                        scope.stGestionarAnticipo.baseParams.tipo = scope.tipo;
                        scope.stGestionarAnticipo.reload({
                            callback: function () {
                                scope.stDesgloseAnticipo.reload({
                                    callback: function () {
                                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                                        mostrarMensaje(1, (argActivacion) ? scope.etiquetas.lbAnticipoActivado : scope.etiquetas.lbAnticipoDesactivado);
                                        scope.arrayValues = new Array();
                                        scope.objWindowsAnticipo = '';
                                        scope.btnLiquidar.focus();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        };

        this.fShowEliminarRetencion = function () {
            scope.objWindowsAnticipo = 'anticipo';
            var facturas = scope.fNroDocConcatenados();
            title = scope.etiquetas.lbBtnEliminarRetencion;
            messageAction = scope.etiquetas.lbActionDelRetencion + facturas;// + '</br>' + scope.etiquetas.lbContinuar;
            functionAction = scope.fEliminarRetencion;
            scope.fShowMessage(title, messageAction, functionAction);
        };

        this.fShowMessage = function (title, messageAction, functionAction) {
            Ext.Msg.show({
                title: scope.etiquetas.lbMessageConfirmacion,
                buttons: Ext.Msg.OKCANCEL,
                msg: messageAction,
                icon: Ext.MessageBox.QUESTION,
                fn: functionAction
            });
        };

        this.fShowComprobanteRetencion = function () {
            dataDuo = scope.smLiquidarCxc.getSelected().data;
            parametros = {
                idDuo: dataDuo.idduo,
                importeCxc: dataDuo.importemo,
                liquidadoCxc: dataDuo.liquidadomb,
                porcientoIVA: dataDuo.iva,
                url: scope.url
            };
            if (!this.objWindowsAnticipo)
                this.objWindowsAnticipo = new Ext.ClassComprobanteRetencion(scope.etiquetas, parametros);

            this.objWindowsAnticipo.addListener('closeRetencion', function () {
                scope.objWindowsAnticipo = '';
            });

            this.objWindowsAnticipo.addListener('retencionDuo', function (params) {
                noCoRetencion = params.numeroComprobante;
                impuestoRenta = params.impuestoRenta;
                ivaVentas = params.ivaVentas;
                impuestoMunicipal = params.impuestoMunicipal;
                observacionRetencion = params.observacion;
                retencion = {
                    noCoRetencion: noCoRetencion,
                    impuestoSobRent: impuestoRenta,
                    ivaVenta: ivaVentas,
                    impuestoMun: impuestoMunicipal,
                    observacion: observacionRetencion,
                    idderechouobligacion: params.idDuo,
                    totalRetencion: params.totalRetencion,
                    importeImpuestoRenta: params.importeImpuestoRenta,
                    importeIvaEnVenta: params.importeIvaEnVenta
                };
                scope.smLiquidarCxc.getSelected().data.arrayRetencion = retencion;
                scope.fActualizarGridLiquidarCxc(retencion);

                scope.objWindowsAnticipo.wComprobanteRetencion.close();
                scope.objWindowsAnticipo = '';
            });
        };

        this.fActualizarGridLiquidarCxc = function (params) {
            scope.smLiquidarCxc.getSelected().data.numerocomprobante = params.noCoRetencion;
            scope.smLiquidarCxc.getSelected().data.impuestorenta = params.impuestoSobRent;
            scope.smLiquidarCxc.getSelected().data.ivaventa = params.ivaVenta;
            scope.smLiquidarCxc.getSelected().data.impuestomunicipal = params.impuestoMun;
            scope.smLiquidarCxc.getSelected().data.observacionretencion = params.observacion;
            scope.smLiquidarCxc.getSelected().data.importeImpuestoRenta = params.importeImpuestoRenta;
            scope.smLiquidarCxc.getSelected().data.importeIvaEnVenta = params.importeIvaEnVenta;
            scope.smLiquidarCxc.getSelected().data.idliquidacionfnz = params.idliquidacionfnz;
            index = scope.stLiquidarCxc.find('idduo', params.idderechouobligacion);
            if (index > -1) {
                var rec = scope.stLiquidarCxc.getAt(index);
                rec.data.retencion = params.totalRetencion;
                diferencia = rec.data.ipendientes - rec.data.retencion;
                impRestante = (scope.importeAnticipoCliente < diferencia) ? scope.impTotalCxcLiquidar : diferencia;
                scope.importeAnticipoCliente -= imprestante;
                rec.data.ipagar = scope.fSaldo(impRestante);
                scope.stLiquidarCxc.remove(scope.stLiquidarCxc.getAt(index));//elimina el que estaba
                scope.stLiquidarCxc.insert(index, rec);
                scope.smLiquidarCxc.selectRecords([rec]);
            }
            scope.fActualizarTotalLiquidar();
        };

        this.fCargarCxcCliente = function () {
            var estadoliquidacion = scope.smDesgloseAnticipo.getSelected().data.estadoliquidacion;

            if (estadoliquidacion == 1) {
                //En este caso se sabe que es pago anticipado porque el estado es 1
                //lo cual significa que está pendiente a reintegrar y solo se reintegran los pagos anticipados
                mostrarMensaje(1, 'El pago anticipado seleccionado est&aacute; pendiente a reintegrar.');
            } else if (estadoliquidacion == 2) {
                //En este caso se sabe que es cobro anticipado porque el estado es 2
                //lo cual significa que está pendiente a devolver y solo se devuelven los cobros anticipados
                mostrarMensaje(1, 'El cobro anticipado seleccionado est&aacute; pendiente a devolver.');
            } else {
                var myMask = new Ext.LoadMask(scope.gpLiquidarCxc.getEl(), {msg: scope.etiquetas.lbCargando});
                myMask.show();
                // scope.idClienteAnticipo = scope.smGestionarAnticipo.getSelected().data.idcliente;
                scope.idClienteAnticipo = scope.cbclienteprovee.getValue();
                scope.stLiquidarCxc.baseParams.idcliente = scope.idClienteAnticipo;

                // scope.importeAnticipoCliente = scope.smDesgloseAnticipo.getSelected().data.pendiente;
                scope.importeAnticipoCliente = scope.stDesgloseAnticipo.getAt(scope.stDesgloseAnticipo.find('idanticipo', scope.smDesgloseAnticipo.getSelected().data.idanticipo)).data.pendiente;

                scope.stLiquidarCxc.baseParams.tipo = scope.cbTipo.getValue();
                if (scope.smDesgloseAnticipo.getSelected().data.concatcta.search(/^699/) === -1) {
                    scope.stLiquidarCxc.baseParams.idmoneda = scope.smDesgloseAnticipo.getSelected().data.idmoneda;
                }
                scope.stLiquidarCxc.baseParams.idanticipo = scope.smDesgloseAnticipo.getSelected().data.idanticipo;
                scope.stLiquidarCxc.baseParams.operacionesenzona = scope.smDesgloseAnticipo.getSelected().data.operacionesenzona;
                scope.stLiquidarCxc.baseParams.start = '';
                scope.stLiquidarCxc.baseParams.limit = '';
                scope.stLiquidarCxc.load({
                    callback: function (record, options, success) {

                        if (scope.stLiquidarCxc.getCount() > 0) {
                            scope.btnLiquidarTodos.enable();
                            scope.btnLimpiar.enable();
                        } else {
                            var jsonData = scope.stLiquidarCxc.reader.jsonData;
                            if (jsonData.codMsg == 1) {
                                var msg = (scope.cbTipo.getValue() == 1)
                                    ? 'El deudor seleccionado no tiene cuentas por cobrar pendientes a liquidar.'
                                    : 'El acreedor seleccionado no tiene cuentas por pagar pendientes a liquidar.';
                                mostrarMensaje(1, msg);
                            } else if (jsonData.codMsg == 2) {
                                var msgAnt = (scope.cbTipo.getValue() == 1)
                                    ? 'El cobro anticipado seleccionado est&aacute; pendiente a devolver.'
                                    : 'El pago anticipado seleccionado est&aacute; pendiente a reintegrar.';

                                mostrarMensaje(1, msgAnt);

                                scope.fCargarDesgloseAnticiposPorCliente();
                            }

                        }

                        scope.fActualizarTotalLiquidar();
                        myMask.hide();
                    }
                });
            }
        };

        this.fCargarDesgloseAnticiposPorCliente = function () {
//            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbMsgLoadData);
            var myMask = new Ext.LoadMask(scope.gpDesgloseAnticipo.getEl(), {msg: scope.etiquetas.lbCargando});
            myMask.show();

            var msg = (scope.cbTipo.getValue() == 1)
                ? 'El deudor seleccionado no tiene cobros anticipados posibles a liquidar.'
                : 'El acreedor seleccionado no tiene pagos anticipados posibles a liquidar.';

            scope.stDesgloseAnticipo.removeAll();
            scope.stDesgloseAnticipo.load({
                callback: function (response) {
                    myMask.hide();
                    if (response.length == 0)
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                }
            });
        };

        this.buscarClientProv = function () {
            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbMsgLoadData);
            var msg = 'No existen datos con el criterio de b&uacute;squeda especificado.';

            scope.stGestionarAnticipo.baseParams.start = 0;
            //  scope.stGestionarAnticipo.baseParams.tipo = scope.cbTipo.getValue();
            //scope.stGestionarAnticipo.baseParams.idclienteprov = scope.cbclienteprovee.getValue();
            scope.stGestionarAnticipo.load({
                params: {
                    tipo: scope.cbTipo.getValue(),
                    idclienteprov: scope.cbclienteprovee.getValue()
                },
                callback: function (options, success, response) {
                    Ext.CONT.Componentes.HideBox('msgbIniciando');
                    scope.btnLimpiar.show();
                    scope.btnLimpiar.enable();
                    if (scope.stGestionarAnticipo.getCount() == 0)
                        mostrarMensaje(1, msg);
                }
            });
        };

        //fShowReporte
        this.fShowReporte = function (idreporte) {
            var lMask = new Ext.LoadMask(Ext.getBody(), {
                msg: 'Cargando...'
            });
            lMask.show();
            var arrayIdAnticipo = [];
            var arrayAnticipo = scope.fGetSelectionsOnPaging();

            for (var i = 0; i < arrayAnticipo.length; i++) {
                arrayIdAnticipo.push(arrayAnticipo[i].idderechouobligacion);
            }

            if (arrayIdAnticipo.length > 0) {
                Ext.Ajax.request({
                    method: "POST",
                    url: 'cargarDatosReporte',
                    params: {
                        arrayidanticipo: Ext.encode(arrayIdAnticipo),
                        idreporte: idreporte
                    },
                    callback: function (options, success, response) {
                        lMask.hide();
                        var responseDataReporte = Ext.decode(response.responseText);
                        if (responseDataReporte.dataSources) {
                            var defaultComponentValues = {
                                paperSize: "A4",
                                orientation: "Horizontal",
                                reportType: "HTML"
                            };
                            var printView = new SCFPrintView(responseDataReporte.dataSources, "/contabilidad/comun/SCFPrintView/", defaultComponentValues);
                            printView.show();
                        } else {
                            mostrarMensaje(1, 'Para realizar esta acci&oacute;n debe seleccionar al menos una cuenta por cobrar.');
                        }

                    }
                });
            } else {

            }
        };

        this.notifyEvent = function (animateTarget, title, msg, icon, time, callback) {
            this.notification = new Ext.Cont.Notification({
                animateTarget: animateTarget,
                fnc: (callback) ? callback : Ext.emptyFn,
                iconbox: icon,
                iconCls: "icon-waiting",
                title: title,
                html: msg,
                hideDelay: (time) ? time : 5000
            });
            this.notification.box();
        };

        this.fShowMessageDifStatus = function () {
            Ext.Msg.show({
                title: scope.etiquetas.titleDifEstados,
                buttons: Ext.Msg.OKCANCEL,
                msg: scope.etiquetas.msgDifEstados,
                icon: Ext.MessageBox.QUESTION,
                fn: scope.fAceptar
            });
        };

        this.fLimpiarGridCxc = function () {
            scope.stLiquidarCxc.removeAll();
            scope.btnComprobanteRetencion.disable();
            scope.btnEliminarRetencion.disable();
            scope.btnLimpiar.disable();
            scope.btnRegistrarLiquidacion.disable();
            //los campos de informacion totales
        };

        this.fShowContabilizarAnticipo = function (idAnticipo) {
            title = scope.etiquetas.lbBtnContabilizar;
            messageAction = scope.etiquetas.lbActionContabilizar;
            functionAction = scope.fShowComprobanteContabilizarLiquidacion;
            scope.fShowMessage(title, messageAction, functionAction);
        };

        this.fShowComprobanteContabilizarLiquidacion = function (btn) {
            if (btn == 'ok') {
                tipoContabilizacion = 1; //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
                actionContabiliza = 'contabilizar';
                idEstadoDocumento = 4;
                idEstadodcop = 1;
                url = 'contabilizarAnticipo';
                scope.fLoadDataComprobante(tipoContabilizacion, idEstadoDocumento, idEstadodcop, actionContabiliza, url);
            } else {
                scope.objWindowsAnticipo = '';
                scope.btnLiquidar.focus();
            }
        };

        this.fShowComprobanteCancelarAnticipo = function (parametros) {
            tipoContabilizacion = 1; //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
            actionContabiliza = 'contabilizar';
            idEstadoDocumento = 1;
            idEstadodcop = 4;
            url = 'cancelarAnticipo';

            scope.fLoadDataComprobanteCancelAnticipo(tipoContabilizacion, new Array(parametros));
        };

        this.fShowComprobanteCancelarMovAnticipo = function (parametros, idmotivo = null) {
            tipoContabilizacion = 2; //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
            var params = [];
            parametros.forEach(function (element, index, arr) {
                params.push({
                    parametros: {
                        idanticipo: element.get('idanticipo'),
                        importe: element.get('importe'),
                        idoperacion: element.get('idoperacion'),
                        comentario: element.get('comentario'),
                        numerodocumento: element.get('numerodocumento'),
                        arrCuentas: element.json.arrcuentas,
                        idcuenta: element.json.idcuenta,
                        iddocinstrumento: element.json.iddocinstrumento,
                        idAnticipoCancelado: element.get('idanticipocancelado')
                    }
                });
            });
            scope.fLoadDataComprobanteCancelAnticipo(tipoContabilizacion, params, idmotivo);
        };

        this.fLoadDataComprobante = function (tipoContabilizacion, idEstadoDocumento, idEstadodcop, actionContabiliza, url, idAnticipo, params) {
            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbLoadDataComprobante);

            var datos = [];
            var total = 0;

            var records = scope.smLiquidarCxc.getSelections();

            for (var i = 0; i < records.length; i++) {
                var ipagar = parseFloat((records[i].data.ipagar) ? records[i].data.ipagar : 0);
                if (ipagar > 0) {
                    datos.push(records[i].data);
                    total += records[i].data.ipagar;
                }
            }

            // for (var i = 0; i < scope.stLiquidarCxc.getCount(); i++) {
            //     if (scope.stLiquidarCxc.getAt(i).data.ipagar > 0)
            //         datos.push(scope.stLiquidarCxc.getAt(i).data);
            // }
            //si se liquida todo lo que hab�a pendiente se env�a el estado de Liquidado
            estadoliq = 9;
            Ext.Ajax.request({
                url: 'loadDataComprobante',
                method: 'POST',
                params: {
                    datos: Ext.encode(datos),
                    total: total, //liquidar,
                    estadoliq: estadoliq,
                    idcliente: scope.cbclienteprovee.getValue(),
                    tipo: scope.cbTipo.getValue(),
                    idanticipo: scope.smDesgloseAnticipo.getSelected().data.idanticipo
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codM == -1) {
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        mostrarMensaje(1, 'No existen tasas configuras para la moneda contable.');
                    } else if (responseData.codM == -2) {
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        mostrarMensaje(1, 'No existen operaciones contables configuradas para realizar esta operación');
                    } else if (responseData.codM == -3) {
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        mostrarMensaje(1, 'La operaci&oacute;n de la cuenta por cobrar seleccionada no tiene modelo configurado.');
                    } else if (responseData.codM == 1) {
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        mostrarMensaje(1, 'La liquidación que desea hacer sobrepasa el importe del cobro o pago.');
                        scope.stLiquidarCxc.removeAll();
                        scope.stDesgloseAnticipo.reload();
                    } else if (responseData.codM == 2) {
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        mostrarMensaje(1, 'El estado del cobro o pago es incorrecto.');
                        scope.stLiquidarCxc.removeAll();
                        scope.stDesgloseAnticipo.reload();
                    } else if (responseData.codM == 3) {
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        mostrarMensaje(1, 'El cobro o pago no se encuentra posteado por lo tanto no se puede efectuar la acción solicitada.');
                        scope.stLiquidarCxc.removeAll();
                        scope.stDesgloseAnticipo.reload();
                    } else if (responseData.codM == 4) {
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        mostrarMensaje(1, 'El anticipo no se encuentra posteado o liquidado por lo tanto no se puede efectuar la acción solicitada.');
                        scope.stLiquidarCxc.removeAll();
                        scope.stDesgloseAnticipo.reload();
                    } else if (responseData.codM == 5) {
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        mostrarMensaje(1, 'La liquidación parcial que desea hacer sobrepasa el importe del anticipo.');
                        scope.stLiquidarCxc.removeAll();
                        scope.stDesgloseAnticipo.reload();
                    } else {
                        var win = Ext.Cont.Comprobante.init(6, responseData.datos.detalle, responseData.datos.descripcion, responseData.datos.fechaCont, responseData.datos.dataComprobante, 3, 1, 1);
                        win.onSaved(function (idComprobant, numComprobant, fecha) {
                            if (idComprobant) {
                                scope.fAceptarLiquidacion(idComprobant, numComprobant, fecha);
                            }
                        }).onClose(function () {
                            Ext.CONT.Componentes.HideBox('msgbIniciando');
                            scope.objWindowsAnticipo = '';
                        });
                    }
                }
            });
        };

        this.fAceptarLiquidacion = function (idComprobante, numComprobante, fechaComprobante) {
            // var liquidar = scope.stLiquidarCxc.sum('ipagar');
            var liquidar = 0;
            var datos = [];

            var records = scope.smLiquidarCxc.getSelections();

            for (var i = 0; i < records.length; i++) {
                var ipagar = parseFloat((records[i].data.ipagar) ? records[i].data.ipagar : 0);
                if (ipagar > 0) {
                    datos.push(records[i].data);
                    liquidar += records[i].data.ipagar;
                }
            }
            // for (var i = 0; i < scope.stLiquidarCxc.getCount(); i++) {
            //     if (scope.stLiquidarCxc.getAt(i).data.ipagar > 0) {
            //         datos.push(scope.stLiquidarCxc.getAt(i).data);
            //         liquidar += scope.stLiquidarCxc.getAt(i).data.ipagar;
            //     }
            // }

            Ext.Ajax.request({
                url: 'liquidarpagoanticipado',
                method: 'POST',
                params: {
                    datos: Ext.encode(datos),
                    total: liquidar,
                    idcliente: scope.idClienteAnticipo,
                    tipo: scope.cbTipo.getValue(),
                    idanticipo: scope.smDesgloseAnticipo.getSelected().data.idanticipo,
                    idComprobante: idComprobante,
                    numComprobante: numComprobante,
                    fechaComprobante: fechaComprobante
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    scope.stLiquidarCxc.removeAll();

                    scope.stDesgloseAnticipo.reload({
                        callback: function () {
                            Ext.CONT.Componentes.HideBox('msgbIniciando');
                            var msg = responseData.mensaje + scope.etiquetas.msgConfCompr + numComprobante + '.';
                            mostrarMensaje(responseData.codMsg, msg);
                        }
                    });
                }
            });
        };

        this.fShowComprobanteCancelarLiquidacion = function (record) {
            // if (btn == 'ok')
            // {
            record.tipoContabilizacion = 2; //1 contabilizar doc confirmado | 2 revertir comprobante contabilizado
            record.actionContabiliza = 'cancelarliq';
            // idEstadoDocumento = 4;
            // idEstadodcop = 1;
            record.url = 'contabilizarAnticipo';
            scope.fLoadDataComprobanteCancel(record);
            // } else {
            //     scope.objWindowsAnticipo = '';
            //     scope.btnLiquidar.focus();
            // }
        };

        this.fLoadDataComprobanteCancel = function (datos) {
            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbLoadDataComprobante);

            Ext.Ajax.request({
                url: 'loadDataComprobanteCancelLiq',
                method: 'POST',
                params: {
                    datos: Ext.encode(datos),
                    tipo: scope.cbTipo.getValue()
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);

                    var win = Ext.Cont.Comprobante.init(6, responseData.datos.detalle, responseData.datos.descripcion, responseData.datos.fechaCont, responseData.datos.dataComprobante, 3, 1, 1);
                    win.onSaved(function (idComprobant, numComprobant, fecha) {
                        if (idComprobant) {
                            scope.fCancelarLiquidacion(datos, idComprobant, numComprobant, fecha);
                        }
                    }).onClose(function () {
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        scope.objWindowsAnticipo = '';
                    });
                }
            });
        };

        this.fCancelarLiquidacion = function (datos, idComprobante, numComprobante, fechaComprobante) {
            Ext.Ajax.request({
                url: 'cancelarliquidacionanticipo',
                method: 'POST',
                params: {
                    datos: Ext.encode(datos),
                    idComprobante: idComprobante,
                    numComprobante: numComprobante,
                    fechaComprobante: fechaComprobante
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    scope.stLiquidarCxc.removeAll();
// recargar desgloseanticipo, limpiar grid de facturas y limpiar desglose de liquidacion

                    scope.stDesgloseAnticipo.reload({
                        callback: function () {
                            Ext.CONT.Componentes.HideBox('msgbIniciando');
                            var msg = 'Liquidaci&oacute;n cancelada en el comprobante ' + numComprobante + '.';
                            mostrarMensaje(1, msg);
                            scope.stLiquidarCxc.removeAll();
                            scope.stDesgloseLiquidacion.reload();
                        }
                    });
                }
            });
        };


        this.fLoadDataComprobanteCancelAnticipo = function (tipoContabilizacion, datos, idmotivo) {
            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbLoadDataComprobante);
//scope.smDesgloseAnticipo.getSelected().data.
            var params = {};
            var ant = false;
            if (tipoContabilizacion == 1) {
                var arrTemp = [];
                datos.forEach(function (item, index, arr) {
                    arrTemp.push({
                        datos: item,
                        anticipo: scope.recordAnticipoSel.data
                    })
                });
                params = {
                    // datos: Ext.encode(datos),
                    // anticipo: Ext.encode(scope.recordAnticipoSel.data),
                    dat: Ext.encode(arrTemp),
                    tipo: scope.cbTipo.getValue(),//scope.tipo,//scope.tipoAnticipo,
                    tipoContabilizacion: tipoContabilizacion
                }
            } else if (tipoContabilizacion == 2) {
                var arrTemp = [];
                datos.forEach(function (item, index, arr) {
                    ant = {
                        idanticipo: item.parametros.idanticipo,
                        cuenta: item.parametros.idcuenta,
                        nInstrumento: item.parametros.numerodocumento,
                        iddocinstrumento: item.parametros.iddocinstrumento,
                        idAnticipoCancelado: item.parametros.idAnticipoCancelado
                    };
                    arrTemp.push({
                        datos: item,
                        anticipo: ant
                    })

                });
                params = {
                    // datos: Ext.encode(datos),
                    // anticipo: Ext.encode(ant),
                    dat: Ext.encode(arrTemp),
                    tipo: scope.cbTipo.getValue(),//scope.tipo,//scope.tipoAnticipo,
                    tipoContabilizacion: tipoContabilizacion
                }
            }

            Ext.Ajax.request({
                url: 'loadDataComprobanteCancelAnticipo',
                method: 'POST',
                params: params,
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);

                    if (responseData.codM == 4) {
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        mostrarMensaje(1, 'El anticipo no se encuentra posteado o liquidado por lo tanto no se puede efectuar la acción solicitada.');
                        scope.stLiquidarCxc.removeAll();
                        scope.stDesgloseLiquidacion.removeAll();
                        scope.stDesgloseMovimiento.reload();
                    } else if (responseData.codM == 5) {
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        mostrarMensaje(1, 'La movimiento que desea hacer sobrepasa el importe pendiente del anticipo.');
                        scope.stLiquidarCxc.removeAll();
                        scope.stDesgloseLiquidacion.removeAll();
                        scope.stDesgloseMovimiento.reload();
                    } else {
                        var win = Ext.Cont.Comprobante.init(6, responseData.datos.detalle, responseData.datos.descripcion, responseData.datos.fechaCont, responseData.datos.dataComprobante, 3, 1, 1);
                        win.onSaved(function (idComprobant, numComprobant, fecha) {
                            if (idComprobant) {
                                scope.fCancelarAnticipo(arrTemp, idComprobant, numComprobant, fecha, tipoContabilizacion, idmotivo);
                            }
                        }).onClose(function () {
                            Ext.CONT.Componentes.HideBox('msgbIniciando');
                            scope.objWindowsAnticipo = '';
                        });
                    }
                }
            });
        };

        this.fCancelarAnticipo = function (datos, idComprobante, numComprobante, fechaComprobante, tipoContabilizacion, idmotivo) {
            Ext.Ajax.request({
                url: 'cancelaranticipo',
                method: 'POST',
                params: {
                    // datos: Ext.encode(datos),
                    // anticipo: tipoContabilizacion == 1 ? Ext.encode(scope.recordAnticipoSel.data) : Ext.encode(ant),
                    dat: Ext.encode(datos),
                    tipo: scope.tipoAnticipo,
                    idComprobante: idComprobante,
                    numComprobante: numComprobante,
                    fechaComprobante: fechaComprobante,
                    tipoContabilizacion: tipoContabilizacion,
                    idmotivo: idmotivo,
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    scope.stLiquidarCxc.removeAll();
                    scope.stDesgloseAnticipo.reload({
                        callback: function () {
                            Ext.CONT.Componentes.HideBox('msgbIniciando');
                            if (tipoContabilizacion == 1) {
                                var msg = 'Anticipo movido en el comprobante ' + numComprobante + '.';
                            } else {
                                var msg = 'Movimiento cancelado en el comprobante ' + numComprobante + '.';
                            }

                            mostrarMensaje(1, msg);
                            scope.stLiquidarCxc.removeAll();
                            scope.stDesgloseLiquidacion.removeAll();
                            scope.stDesgloseMovimiento.reload();
                            // scope.stDesgloseLiquidacion.remove(scope.smDesgloseLiquidacion.getSelected());
                        }
                    });
                }
            });
        };
        this.fShowComprobante = function (respData, tipoContabilizacion, parametros) {
            var idSubsistema = 14; //id de Caja
            var idTipoComprobante = 3; //comprobante tipo operaciones
            var arrayAnotaciones = []; //los pases
            var anexos = []; //los anexos (si tiene)
            var descripcion = 'Posteando ';
            descripcion = descripcion + respData.observacion;
            var detalle = respData.detalle;
            for (var i = 0; i < respData.dataComprobante.length; i++) {
                if (respData.dataComprobante[i].anexo > 0) {
                    anexos = [];
                    for (var k = 0; k < respData.dataComprobante[i].anexo.length; k++) {
                        anexos.push(new Ext.Cont.Comprobante.Anexo({
                            idcentronivel: respData.dataComprobante[i].anexo[k].idcentrogrupo,
                            centronivel: respData.dataComprobante[i].anexo[k].centrocosto,
                            idelementouobjeto: respData.dataComprobante[i].anexo[k].idelementogasto,
                            elementouobjeto: respData.dataComprobante[i].anexo[k].elementogasto,
                            importe: respData.dataComprobante[i].anexo[k].importemb
                        }));
                    }
                }

                var objAnotacion = new Ext.Cont.Comprobante.Anotacion({
                    numerodocumento: respData.dataComprobante[i].numero,
                    iddocumento: respData.dataComprobante[i].idtipodocumento,
                    cuenta: respData.dataComprobante[i].concatcta,
                    idcuenta: respData.dataComprobante[i].idcuenta,
                    moneda: respData.dataComprobante[i].moneda,
                    idmoneda: respData.dataComprobante[i].idmoneda,
                    idtasa: respData.dataComprobante[i].idtasa,
                    idoperacion: respData.dataComprobante[i].idoperacioncontable,
                    tipo: respData.dataComprobante[i].contabilidadAdicional //DETERMINA SI ES  CONTABILIDAD ADICIONAL 0|1
                });
                if (scope.fContDebitoCredito(respData.dataComprobante[i].debitoCredito, tipoContabilizacion))
                    objAnotacion.data.debito = respData.dataComprobante[i].importemb;
                else
                    objAnotacion.data.credito = respData.dataComprobante[i].importemb;
                arrayAnotaciones.push(objAnotacion);
            }

            //Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, idTipoComprobante, detalle, descripcion, respData.fechaCont, arrayAnotaciones, respData.idObjeto).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                scope.fAceptarLiquidacion(idComprobante, numComprobante, fechaComprobante);
            }).onClose(function () {
            });
        };

        this.fContDebitoCredito = function (debitoCredito, tipoContabilizacion) {
            var debCred = false;
            if (debitoCredito == 1)
                debCred = (tipoContabilizacion == 1) ? false : true
            else if (debitoCredito == 0)
                debCred = (tipoContabilizacion == 1) ? true : false
            return debCred;
        };

        this.fGuardarComprobante = function (idComprobante, numeroComprobante, fechaComprobante, parametros) {
            Ext.Ajax.request({
                method: "POST",
                url: scope.url + parametros.url,
                params: {
                    tipoAnticipo: scope.tipoAnticipo,
                    arrayIdAnticipo: Ext.encode(parametros.arrayIdAnticipo),
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    idEstadoDocumento: parametros.idEstadoDocumento,
                    idMotivo: parametros.idMotivo,
                    idEstadodcop: parametros.idEstadodcop
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (parametros.adicionarAnticipo) {
                        Ext.getCmp('btnAddContabilizar').disable();
                        Ext.CONT.Componentes.HideBox('msgbIniciando');
                        mostrarMensaje(1, scope.etiquetas.lbMsgContabilizado + ' ' + responseData.numeroComprobante + '.');
                    } else {
                        scope.stGestionarAnticipo.reload({
                            callback: function (options, success, response) {
                                Ext.CONT.Componentes.HideBox('msgbIniciando');
                                mostrarMensaje(1, scope.etiquetas.lbMsgContabilizado + ' ' + responseData.numeroComprobante + '.', function () {
                                    if (!parametros.adicionarAnticipo)
                                        scope.objWindowsAnticipo = '';
                                });
                            }
                        });
                    }
                }
            });
        };

        this.fGraphAnticipo = function () {
            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbMsgLoadGraficar);
            Ext.Ajax.request({
                url: scope.url + 'graficarPorEstados',
                method: 'POST',
                params: {
                    tipoanticipo: scope.tipoAnticipo
                },
                callback: function (options, success, response) {
                    Ext.CONT.Componentes.HideBox('msgbIniciando');
                    w_graficar = new Ext.Window({
                        title: scope.etiquetas.titleGraphAnticipo,
                        closable: true,
                        height: 400,
                        html: '<div id="container" style="width: 630px; height: 370px; margin: 0 auto"></div>',
                        layout: 'fit',
                        modal: true,
                        resizable: false,
                        width: 630
                    });
                    w_graficar.show();
                    chart = new Highcharts.Chart({
                        chart: {
                            renderTo: 'container',
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            formatter: function () {
                                return '<b>' + this.point.name + '</b>: ' + this.point.cant + '<br>' + this.point.y + ' %';
                            }
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    color: '#000000',
                                    connectorColor: '#000000',
                                    formatter: function () {
                                        return '<b>' + this.point.name + '</b>: ' + this.point.cant + '<br>' + this.point.y + ' %';
                                    }
                                }
                            }
                        },
                        series: [{
                            type: 'pie',
                            name: '',
                            data: Ext.decode(response.responseText)
                        }]
                    });
                }
            });
        };

        scope.gpDesgloseAnticipo.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('activo') == 0)
                return 'FilaRoja';
            if (record.get('pendiente') != record.get('importe') != 0)
                return 'FilaVerde';
        };

        this.RowClick = function (sm, indiceFila, record) {
            scope.stLiquidarCxc.removeAll();
            scope.stDesgloseAnticipo.removeAll();
            scope.btnDesactivarAnticipo.disable();
            scope.btnReporte.disable();
            var arrayAnticipo = new Array();

            arrayAnticipo = scope.smGestionarAnticipo.getSelected();//scope.fGetSelectionsOnPaging();
            scope.btnLiquidar.disable();
            if (arrayAnticipo) {
                if (arrayAnticipo.data.importependiente != 0) {
                    scope.btnLiquidar.enable();
                } else {
                    scope.btnLiquidar.disable();
                }
            }

            scope.fActualizarTotalLiquidar();
            return;
        };

        this.RowClickLiquidarCxc = function (sm, indiceFila, record) {
            if (scope.smLiquidarCxc.getSelected()) {
                if (scope.smLiquidarCxc.getSelected().data.idliquidacionfnz != null) {
                    scope.btnComprobanteRetencion.disable();
                } else {
                    scope.btnComprobanteRetencion.enable();
                }

                if (scope.smLiquidarCxc.getSelected().data.retencion > 0 && scope.smLiquidarCxc.getSelected().data.idliquidacionfnz == null) {
                    scope.btnEliminarRetencion.enable();
                } else {
                    scope.btnEliminarRetencion.disable();
                }
            }
            return;
        };

        this.RowClickDesgloseAnticipo = function (sm, indiceFila, record) {
            if (scope.smDesgloseAnticipo.getSelected()) {
                scope.btnDesactivarAnticipo.enable();
                scope.btnReporte.enable();
                if (scope.smDesgloseAnticipo.getSelected().data.activo == 0) {
                    scope.btnDesactivarAnticipo.setText(scope.etiquetas.lbBtnActivar);
                } else {
                    scope.btnDesactivarAnticipo.setText(scope.etiquetas.lbBtnDesactivar);
                }
            } else {
                scope.btnDesactivarAnticipo.disable();
                scope.btnReporte.disable();
                scope.stLiquidarCxc.removeAll();
            }
            scope.fActualizarTotalLiquidar();
            return;
        };

        this.fAceptar = function (btn) {
            if (btn == 'ok') {
                scope.smGestionarAnticipo.clearSelections();
                scope.arrayValues = new Array();
            }
            scope.objWindowsAnticipo = '';
        };

        this.fEliminarRetencion = function () {
            dataDuo = scope.smLiquidarCxc.getSelected().data;

            retencion = {
                noCoRetencion: "",
                impuestoSobRent: "",
                ivaVenta: "",
                impuestoMun: "",
                observacion: "",
                idderechouobligacion: dataDuo.idduo,
                totalRetencion: "",
                importeImpuestoRenta: "",
                importeIvaEnVenta: ""
            };

            scope.smLiquidarCxc.getSelected().data.arrayRetencion = "";
            scope.fActualizarGridLiquidarCxc(retencion);
        };

        this.createToolTip = function (v, m, r) {
            var numContrato = (r.data.numerocontrato) ? r.data.numerocontrato : scope.etiquetas.lbExcepcional;
            m.attr = ' ext:qtip="';
            if (!Ext.isEmpty(r.data.fechaentrega))
                m.attr += '<b>' + scope.nombreFecha + ': </b>' + r.data.fechaentrega + '</br>';
            if (!Ext.isEmpty(r.data.fechaemision))
                m.attr += '<b>' + scope.etiquetas.lbFechaEmision + ': </b>' + r.data.fechaemision + '</br>';
            if (!Ext.isEmpty(r.data.fecharecepcion) && scope.confFechaRecepcion)
                m.attr += '<b>' + scope.etiquetas.lbFechaRecepcion + ': </b>' + r.data.fecharecepcion + '</br>';
            if (!Ext.isEmpty(r.data.numerodocumento))
                m.attr += '<b>' + scope.etiquetas.lbNumDocumento + ': </b>' + r.data.numerodocumento + '</br>';
            m.attr += '<b>' + scope.etiquetas.lbNumContrato + ': </b>' + numContrato + '</br>';
            if (!Ext.isEmpty(r.data.text))
                m.attr += '<b>' + scope.etiquetas.lbCuenta + ': </b>' + r.data.text + '</br>';
            if (!isNaN(parseFloat(r.data.importemb)))
                m.attr += '<b>' + scope.etiquetas.lbImporte + ': </b>' + r.data.importemb + '</br>';
            if (!Ext.isEmpty(r.data.denominacion))
                m.attr += '<b>' + scope.etiquetas.lbTipoDoc + ': </b>' + r.data.denominacion + '</br>';
            if (!Ext.isEmpty(r.data.nombrecliente))
                m.attr += '<b>' + scope.nombreCliente + ': </b>' + r.data.nombrecliente + '</br>';
            if (!Ext.isEmpty(r.data.especialidad) && scope.confEspecialidad)
                m.attr += '<b>' + scope.etiquetas.lbEspecialidad + ': </b>' + r.data.especialidad + '</br>';
            if (!Ext.isEmpty(r.data.numcomprobante))
                m.attr += '<b>' + scope.etiquetas.lbNoComprobante + ': </b>' + r.data.numcomprobante + '</br>';
            if (!Ext.isEmpty(r.data.comentario))
                m.attr += '<b>' + scope.etiquetas.lbDetalle + ': </b>' + r.data.comentario + '</br>';
            m.attr += '"';
            return v;
        };

        this.fShowVerAnticipo = function () {
            Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.lbMsgLoadData);
            var arrayAnticipo = new Array();
            arrayAnticipo = scope.fGetSelectionsOnPaging();
            if (!this.objWindowsAnticipo)
                this.objWindowsAnticipo = new Ext.ClassVerAnticipo(scope.tipoAnticipo, scope.etiquetas, arrayAnticipo, scope.url, scope.confEspecialidad);

            this.objWindowsAnticipo.addListener('closeVer', function (cancel, infoAgrupada, params) {
                scope.objWindowsAnticipo = '';
                var lMask = new Ext.LoadMask(Ext.getBody(), {
                    msg: 'Cargando...'
                });
                lMask.show();

                scope.stGestionarAnticipo.reload({
                    callback: function () {
                        lMask.hide();
                        scope.btnLiquidar.focus();
                    }
                });
            });
        };

        this.fSaldo = function (v) {
            if (v == '')
                return '0.00';
            v = (Math.round((v - 0) * 100)) / 100;
            v = (v < 0) ? v * (-1) : v;
            if (isNaN(v))
                return '0.00';
            return v.toFixed(2);
        };

        this.getDataReporte = function () {
            var selection = scope.smDesgloseAnticipo.getSelected();
            var idAnticipo = selection.data.idanticipo;

            Ext.Ajax.request({
                method: "POST",
                url: 'getDataReporte',
                params: {
                    idanticipo: idAnticipo
                },
                callback: function (success, options, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.dataSources[0].datoCuerpo.length > 0)
                        scope.fOpenWindowReport(responseData.dataSources);
                    else {
                        mostrarMensaje(1, scope.etiquetas.msgNoExistenliquidaciones)
                    }

                }
            });
        };

        this.fOpenWindowReport = function (datosReporte) {
            defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Vertical",
                reportType: "HTML"
            };
            printView = new SCFPrintView(datosReporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
            printView.show();
        };
    },
    initializeKeyMap: function (scope) {
        this.map = new Ext.KeyMap(document, [
            {
                key: "i", //ADICIONAR
                alt: true,
                fn: function () {
                    if (scope.objWindowsAnticipo == '')
                        scope.btnLiquidar.handler.call();
                }
            }, {
                key: "m", //MODIFICAR
                alt: true,
                fn: function () {
                    if (scope.objWindowsAnticipo == '')
                        if (scope.smGestionarAnticipo.getSelected() && scope.smGestionarAnticipo.getSelected().data.idestadodocumento == 2 && scope.smGestionarAnticipo.getSelected().data.idsubsistema == 6)
                            scope.btnModificarAnticipo.handler.call();
                }
            }, {
                key: Ext.EventObject.DELETE, //ELIMINAR
                fn: function () {
                    if (scope.objWindowsAnticipo == '')
                        if (scope.fGetSelectionsOnPaging().length > 0 && scope.smGestionarAnticipo.getSelected().data.idestadodocumento == 2 && scope.smGestionarAnticipo.getSelected().data.idsubsistema == 6)
                            scope.btnEliminarAnticipo.handler.call();
                }
            }, {
                key: "c", //CANCELAR
                alt: true,
                fn: function () {
                    if (scope.objWindowsAnticipo == '')
                        if (scope.fGetSelectionsOnPaging().length > 0)
                            scope.btnCancelarAnticipo.handler.call();
                }
            }, {
                key: "f", //CONFIRMAR
                alt: true,
                fn: function () {
                    if (scope.objWindowsAnticipo == '')
                        if (scope.fGetSelectionsOnPaging().length > 0)
                            scope.btnConfirmarAnticipo.handler.call();
                }
            }, {
                key: "t", //CONTABILIZAR
                alt: true,
                fn: function () {
                    if (scope.objWindowsAnticipo == '')
                        if (scope.fGetSelectionsOnPaging().length > 0 && scope.smGestionarAnticipo.getSelected().data.idestadodocumento == 3)
                            scope.btnContabilizarAnticipo.handler.call();
                }
            }, {
                key: "v", //VER
                alt: true,
                fn: function () {
                    if (scope.objWindowsAnticipo == '')
                        scope.btnVerAnticipo.handler.call();
                }
            }, {
                key: "g", //GRAFICAR
                alt: true,
                fn: function () {
                    if (scope.objWindowsAnticipo == '')
                        scope.btnGraficarAnticipo.handler.call();
                }
            }, {
                key: "b", //BUSCAR
                alt: true,
                fn: function () {
                    if (scope.objWindowsAnticipo == '')
                        scope.btnBuscarAnticipo.handler.call();
                }
            }, {
                key: "h", //AYUDA
                alt: true,
                fn: function () {
                    scope.btnAyuda.handler.call();
                }
            }
        ]);
    }
});
