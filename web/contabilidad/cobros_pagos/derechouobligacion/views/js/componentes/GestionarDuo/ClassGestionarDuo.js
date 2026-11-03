//CONFIGURACIONES PARA MOSTRAR LOS COMPONENTES EN DERECHOS U OBLIGACIONES
//ESPECIALIDAD (confEspecialidad) -> TRAERLO DE CONFIGURACION GENERAL
// INCOBRABLE -> FUNCIONA SOLAMENTE EN DERECHO DE COBRO Y DERECHO FISCAL

Ext.namespace('Ext.ClassGestionarDuo');

Ext.ClassGestionarDuo = Ext.extend(Ext.Component, {
    etiquetas: undefined,
    objWindowsDuo: '',
    tipoDuo: undefined,
    nombreCliente: undefined,
    nombreFecha: undefined,
    nombreComponente: undefined,
    mascPrincipal: undefined,
    inicio: true,
    arrayValuesSelections: new Array(),
    arrayValues: new Array(),
    contabilizarVentana: false,
    fechaContable: undefined,
    contabilizar: false, // opcion para contabilizar en la vista del comprobante...
    tipoDuoTexto: undefined,
    confEspecialidad: true, //true si lleva Especialidad
    confCancelarContabilizado: true, //true si se puede cancelar un documento cancelado en el btnCancelarDuo
    confFechaRecepcion: true,
    artDuoTexto: undefined,
    tipoDuoTextoPlural: undefined,
    artDuoTextoP: undefined,
    confNotaCredito: false, //true si lleva la funcionalidad de Nota de credito
    periodo: undefined,
    estructura: undefined,
    desde: undefined,
    hasta: undefined,
    lMask: undefined,
    url: '/contabilidad/cobros_pagos/derechouobligacion/index.php/gestionarduofn/',
    constructor: function (params, aperturado) {
        this.tipoDuo = params;
        this.aperturado = aperturado;

        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        perfil = window.parent.perfil;

        if (!document.getElementById('idAnexoGasto'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/AnexoGasto/AnexoGasto", 'AnexoGasto');

        if (!document.getElementById('UIGestionarDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/GestionarDuo/UIGestionarDuo", 'UIGestionarDuo');

        if (!document.getElementById('ClassAdicionarDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/AdicionarDuo/ClassAdicionarDuo", 'ClassAdicionarDuo');

        if (!document.getElementById('ClassLiquidarDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/LiquidarDuo/ClassLiquidarDuo", 'ClassLiquidarDuo');

        if (!document.getElementById('UILiquidarDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/LiquidarDuo/UILiquidarDuo", 'UILiquidarDuo');

        if (!document.getElementById('UIAdicionarDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/AdicionarDuo/UIAdicionarDuo", 'UIAdicionarDuo');

        if (!document.getElementById('ClassBuscarDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/BuscarDuo/ClassBuscarDuo", 'ClassBuscarDuo');

        if (!document.getElementById('UIBuscarDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/BuscarDuo/UIBuscarDuo", 'UIBuscarDuo');

        if (!document.getElementById('ClassCancelarDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/CancelarDuo/ClassCancelarDuo", 'ClassCancelarDuo');

        if (!document.getElementById('UICancelarDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/CancelarDuo/UICancelarDuo", 'UICancelarDuo');

        if (!document.getElementById('ClassVerDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/VerDuo/ClassVerDuo", 'ClassVerDuo');

        if (!document.getElementById('UIVerDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/VerDuo/UIVerDuo", 'UIVerDuo');

        if (!document.getElementById('ClassTraspasoDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/TraspasoDuo/ClassTraspasoDuo", 'ClassTraspasoDuo');

        if (!document.getElementById('UITraspasoDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/TraspasoDuo/UITraspasoDuo", 'UITraspasoDuo');

        if (!document.getElementById('ClassTraspasoAvanzadoDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/TraspasoAvanzadoDuo/ClassTraspasoAvanzadoDuo", 'ClassTraspasoAvanzadoDuo');

        if (!document.getElementById('UITraspasoAvanzadoDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/TraspasoAvanzadoDuo/UITraspasoAvanzadoDuo", 'UITraspasoAvanzadoDuo');

        if (!document.getElementById('ClassIncobrableDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/IncobrableDuo/ClassIncobrableDuo", 'ClassIncobrableDuo');

        if (!document.getElementById('UIIncobrableDuo'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/IncobrableDuo/UIIncobrableDuo", 'UIIncobrableDuo');

        if (!document.getElementById('ClassLiquidarPorCliente'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/LiquidarDuoPorCliente/ClassLiquidarPorCliente", 'ClassLiquidarPorCliente');

        if (!document.getElementById('UILiquidarPorCliente'))
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/LiquidarDuoPorCliente/UILiquidarPorCliente", 'UILiquidarPorCliente');

        if (!document.getElementById('FormValidation'))
            this.loadJs("/contabilidad/comun/js/FormValidation", 'FormValidation');

        if (!document.getElementById('CICancelacionController'))
            this.loadJs("/contabilidad/comun/componentes/CargaInicialCancelacion/CICancelacionController", 'CICancelacionController');

        if (!document.getElementById('WindowMotivoCancelacion'))
            this.loadJs("/contabilidad/comun/js/Util/WinMotivoCancelacion/winMotivoCancelacion", 'WindowMotivoCancelacion');

        /* Notificacion */
        if (!document.getElementById('Notification')) {
            this.loadJs("/contabilidad/comun/componentes/Notification/js/Ext.Cont.Notification", 'Notification');
        }

        if (!document.getElementById('addliqduocon')) {
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/LiquidarDuoPorCliente/adicionar/AddLiqDuoController", 'addliqduocon');
        }

        if (!document.getElementById('expduocontroller')) {
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/ExpedienteDuo/ExpDuoController", 'expduocontroller');
        }

        if (!document.getElementById('expduoview')) {
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/ExpedienteDuo/ExpDuoView", 'expduoview');
        }

        if (!document.getElementById('expduogest')) {
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/ExpedienteDuo/ExpDuoGest", 'expduogest');
        }

        if (!document.getElementById('expduomodel')) {
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/ExpedienteDuo/ExpDuoModel", 'expduomodel');
        }

        if (!document.getElementById('addexpduocontroller')) {
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/ExpedienteDuo/AddExpDuo/AddExpDuoController", 'addexpduocontroller');
        }

        if (!document.getElementById('addexpduoview')) {
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/ExpedienteDuo/AddExpDuo/AddExpDuoView", 'addexpduoview');
        }

        if (!document.getElementById('addexpduogest')) {
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/ExpedienteDuo/AddExpDuo/AddExpDuoGest", 'addexpduogest');
        }

        if (!document.getElementById('addexpduomodel')) {
            this.loadJs("/contabilidad/cobros_pagos/derechouobligacion/views/js/componentes/ExpedienteDuo/AddExpDuo/AddExpDuoModel", 'addexpduomodel');
        }

        this.stGestionarDuo = new Ext.data.GroupingStore({
            url: this.url + 'loadDataDuo',
            baseParams: {
                tipoduo: this.tipoDuo,
                aperturado: this.aperturado,
                limit: 20,
                params: undefined
            },
            reader: new Ext.data.JsonReader({
                id: 'idderechouobligacion',
                totalProperty: 'cantidad',
                root: 'datos'
            }, [{
                name: 'idderechouobligacion'
            }, {
                name: 'idcontrato'
            }, {
                name: 'numerocontrato'
            }, {
                name: 'excepcional'
            }, {
                name: 'fechaemision'
            }, {
                name: 'fechaentrega'
            }, {
                name: 'fecharecepcion'
            }, {
                name: 'cargainicial'
            }, {
                name: 'idtipodocumento'
            }, {
                name: 'estadodescripcion'
            }, {
                name: 'comentario'
            }, {
                name: 'numero'
            }, {
                name: 'importemb',
                type: 'float'
            }, {
                name: 'pendienteliq',
                type: 'float'
            }, {
                name: 'pagadomb',
                type: 'float'
            }, {
                name: 'liquidadomb',
                type: 'float'
            }, {
                name: 'idestadodocumento'
            }, {
                name: 'idestadodcop'
            }, {
                name: 'estadodcop'
            }, {
                name: 'idcondicionpago'
            }, {
                name: 'idtipo'
            }, {
                name: 'iddoc'
            }, {
                name: 'idperiodo'
            }, {
                name: 'version'
            }, {
                name: 'id'
            }, {
                name: 'idcuenta'
            }, {
                name: 'idnaturaleza'
            }, {
                name: 'text'
            }, {
                name: 'abreviatura'
            }, {
                name: 'idcliente'
            }, {
                name: 'nombrecliente'
            }, {
                name: 'concatcta'
            }, {
                name: 'cancelar'
            }, {
                name: 'denominacion'
            }, {
                name: 'numcomprobante',
                type: 'string'
            }, {
                name: 'especialidad'
            }, {
                name: 'idespecialidad'
            }, {
                name: 'idsubsistema'
            }, {
                name: 'nombresubsistema'
            }, {
                name: 'documentoexterno'
            }, {
                name: 'fechacontable'
            }, {
                name: 'codigoiso'
            }, {
                name: 'edad'
            }, {
                name: 'idestructuracomun'
            }, {
                name: 'estructuracomun'
            }, {
                name: 'idestructuraorigen'
            }, {
                name: 'idcondicionpago'
            }, {
                name: 'condicionpago'
            }, {
                name: 'estructuraorigen'
            }, {
                name: 'tipoCuentaPrimerNivel'
            }, {
                name: 'plazo'
            }, {
                name: 'idclienteproveedorcobropago'
            }, {
                name: 'idtipoderechouobligacion'
            }, {
                name: 'vence'
            }, {
                name: 'iddocorigen'
            }, {
                name: 'idMonedaContable'
            }, {
                name: 'idMonedaAlternativa'
            }, {
                name: 'idmoneda'
            }, {
                name: 'vencido'
            }, {
                name: 'operacionDenom'
            }, {
                name: 'showcomprobante'
            }, {
                name: 'importeOrigen',
            }, {
                name: 'monedaOrigen',
            }
            ]),
            sortInfo: {
                field: "idsubsistema",
                direction: "ASC"
            },
            groupField: 'nombresubsistema'
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
    loadMessageBox: function (msg) {
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
    loadMask: function (message) {
        new Ext.LoadMask(Ext.getBody(), {
            msg: message
        }).show();
    },
    loadDataComponent: function (scope) {
        Ext.Ajax.request({
            method: "POST",
            url: this.url + "cargaretiquetas",
            callback: function (options, success, response) {
                scope.etiquetas = Ext.decode(response.responseText);
                if (scope.tipoDuo == 1) // (1) DERECHO DE COBRO
                {
                    scope.nombreCliente = scope.etiquetas.lbCliente; //'Cliente';
                    scope.nombreFecha = scope.etiquetas.lbFechaEntrega; //'Fecha entrega';
                    scope.nombreComponente = scope.etiquetas.lbVpTituloDerecho;//'Gestionar derecho de cobro';
                    scope.mascPrincipal = scope.etiquetas.lbCargandoDerecho;//'Cargando derechos de cobro...'
                    scope.tipoDuoTexto = scope.etiquetas.lbDerechoCobro;
                    scope.tipoDuoTextoPlural = scope.etiquetas.lbDerechoCobroP;
                    scope.artDuoTexto = scope.etiquetas.artFem;
                    scope.artDuoTextoP = scope.etiquetas.artFemP;
                } else if (scope.tipoDuo == 2) // (2) OBLIGACION DE PAGO
                {
                    scope.nombreCliente = scope.etiquetas.lbProveedor; //'Proveedor';
                    scope.nombreFecha = scope.etiquetas.lbFechaRecibo; //'Fecha recibo';
                    scope.nombreComponente = scope.etiquetas.lbVpTituloObligacion;//'Gestionar obligaci&oacute;n de pago';
                    scope.mascPrincipal = scope.etiquetas.lbCargandoObligacion;//'Cargando obligaciones de pago...'
                    scope.tipoDuoTexto = scope.etiquetas.lbObligacionPago;
                    scope.tipoDuoTextoPlural = scope.etiquetas.lbObligacionPagoP;
                    scope.artDuoTexto = scope.etiquetas.artFem;
                    scope.artDuoTextoP = scope.etiquetas.artFemP;
                } else if (scope.tipoDuo == 3) // (3) DERECHO FISCAL
                {
                    scope.nombreCliente = scope.etiquetas.lbParrafoFiscal; //'Proveedor';
                    scope.nombreComponente = scope.etiquetas.lbVpTituloDerechoF;//'Gestionar derecho fiscal';
                    scope.nombreFecha = scope.etiquetas.lbFechaEntrega; //'Fecha entrega';
                    scope.mascPrincipal = scope.etiquetas.lbCargandoDerechoF;//'Cargando derechos fiscales...'
                    scope.tipoDuoTexto = scope.etiquetas.lbDerechoFiscal;
                    scope.tipoDuoTextoPlural = scope.etiquetas.lbDerechoFiscalP;
                    scope.artDuoTexto = scope.etiquetas.artMas;
                    scope.artDuoTextoP = scope.etiquetas.artMasP;
                } else if (scope.tipoDuo == 4) // (4) OBLIGACION FISCAL
                {
                    scope.nombreCliente = scope.etiquetas.lbParrafoFiscal; //'Proveedor';
                    scope.nombreComponente = scope.etiquetas.lbVpTituloObligacionF;//'Gestionar obligaci&oacute;n fiscal';
                    scope.nombreFecha = scope.etiquetas.lbFechaRecibo; //'Fecha recibo';
                    scope.mascPrincipal = scope.etiquetas.lbCargandoObligacionF;//'Cargando obligaciones fiscales...'
                    scope.tipoDuoTexto = scope.etiquetas.lbObligacionFiscal;
                    scope.tipoDuoTextoPlural = scope.etiquetas.lbObligacionFiscalP;
                    scope.artDuoTexto = scope.etiquetas.artMas;
                    scope.artDuoTextoP = scope.etiquetas.artMasP;
                }
                Ext.Ajax.request({
                    url: '/contabilidad/cobros_pagos/configuracion/index.php/gestconfcolumncopa/cargarDatosColumn',
                    method: 'POST',
                    callback: function(options, success, response)
                    {
                        scope.gridColumns = Ext.decode(response.responseText);
                        scope.loadMessageBox(scope.mascPrincipal);
                        scope.initializeClass();
                    }
                });

            }
        });
    },
    initializeClass: function () {
        this.ViewPort = new Ext.UIGestionarDuo.ViewPort(this, {
            items: [this.pnlContenedor = new Ext.UIGestionarDuo.pnlContenedor(this, this.nombreComponente)]
        });
        this.initializeDataIni(this);
        this.initializeEvents(this);
        this.initializeFunctions(this);
        this.initializeKeyMap(this);

        return Ext.ClassGestionarDuo.superclass.constructor.call(this);
    },
    initializeDataIni: function (scope) {
        Ext.Ajax.request({
            method: "POST",
            url: scope.url + "loadDataDuo",
            params: {
                tipoduo: scope.tipoDuo,
                aperturado: scope.aperturado,
                limit: 20,
                fechaperiodo: 1,
                params: undefined
            },
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var responseData = Ext.decode(response.responseText);
                scope.fechaContable = responseData.fechaContable;
                scope.desde = responseData.inicio;
                scope.hasta = responseData.fin;
                scope.lfdPeriodo.setText('Per\u00EDodo actual: ' + responseData.periodo + '. ' + ' Desde ' + responseData.inicio + ' Hasta ' + responseData.fin + '. ');
                if (scope.fechaContable != null)
                    scope.lfdFechaContable.setText(((scope.aperturado == 0) ? ' Carga inicial: ' : ' Fecha contable: ') + scope.fechaContable);
                else scope.lfdFechaContable.setText('');
                if (responseData.aperturado != scope.aperturado) {//0=ci, 1=aperturado
                    scope.objWindowsDuo = 'duo';
                    mostrarMensaje(1, ((scope.aperturado) ? scope.etiquetas.lbNoOperCI : scope.etiquetas.lbOperCI), function () {
                        Ext.getCmp('gpGestionarDuo').disable();
                    });
                } else {
                    scope.btnAdicionarDuo.enable();
                    scope.btnBuscarDuo.enable();
                    scope.btnConfirmarDuo.disable();
                    scope.btnCancelarDuo.disable();
                    scope.btnContabilizarDuo.disable();
                    if (responseData.cantidad > 0) {
                        scope.btnVerDuo.enable();
                        scope.btnGraficarDuo.enable();
                        scope.btnBuscarDuo.enable();
                        scope.stGestionarDuo.loadData(responseData);
                    } else {
                        var message = (scope.stGestionarDuo.baseParams.searching) ? scope.etiquetas.msgNoMatchingData : ((scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.etiquetas.msgNoDataDuoToShowF.replace('<#tipoDuo>', scope.tipoDuoTextoPlural.toLowerCase()) : scope.etiquetas.msgNoDataDuoToShowM.replace('<#tipoDuo>', scope.tipoDuoTextoPlural.toLowerCase()));
                    }
                }
                scope.btnAdicionarDuo.focus();
            }
        });
    },
    initializeEvents: function (scope) {
        this.btnFecha.setHandler(function () {
            scope.Fecha();
        }, scope);

        this.dateMenu.on({
            select: function (picker, date) {
                mostrarMensaje(2, '¿Est&aacute; seguro que quiere pasar fecha?', function (btnPress) {
                    if (btnPress === 'ok') {
                        scope.pasarFecha(picker, date);
                    }
                });
            }
        });

        this.stGestionarDuo.on({
            beforeload: function () {
                scope.loadMask('Cargando...');
            },
            load: function (store, records, options) {
                Ext.getBody().unmask();
                scope.btnModificarDuo.disable();
                scope.btnEliminarDuo.disable();
                scope.smGestionarDuo.selectFirstRow();
                if (records.length == 0) {
                    var message = (scope.stGestionarDuo.baseParams.searching) ? scope.etiquetas.msgNoMatchingData : ((scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.etiquetas.msgNoDataDuoToShowF.replace('<#tipoDuo>', scope.tipoDuoTextoPlural.toLowerCase()) : scope.etiquetas.msgNoDataDuoToShowM.replace('<#tipoDuo>', scope.tipoDuoTextoPlural.toLowerCase()));
                }
            }
        });
        this.btnAdicionarDuo.setHandler(function () {
            scope.fShowAdicionarDuo(1);
        }, scope);

        this.btnModificarDuo.setHandler(function () {
            scope.fShowAdicionarDuo(2, scope.gpRegistroDuo.getSelectionModel().getSelected());
        }, scope);

        this.btnEliminarDuo.setHandler(function () {
            var selects = scope.fGetSelectionsOnPaging();
            scope.fShowEliminarDuo(selects);
        }, scope);

        this.btnCancelarDuo.setHandler(function () {
            scope.fShowCancelarDuo();
        }, scope);

        this.btnConfirmarDuo.setHandler(function () {
            var selects = scope.fGetSelectionsOnPaging();
            scope.fShowConfirmarDuo(selects);
        }, scope);

        this.btnContabilizarDuo.setHandler(function () {
            var selects = scope.fGetSelectionsOnPaging();
            scope.fShowContabilizarDuo(selects);
        }, scope);

        this.btnLiquidarDuo.setHandler(function () {
            var selects = scope.fGetSelectionsOnPaging();
            scope.fShowLiquidarDuo(selects, 1);
        }, scope);

        this.btnLiquidar2Duo.setHandler(function () {
            var selects = scope.fGetSelectionsOnPaging();
            if (selects[0] ? (selects[0].pendienteliq !== 0) : true) {
                scope.fLiquidar2Duo(1, selects[0]);
            } else {
                mostrarMensaje(1, 'La obligación esta liquidada totalmente.');
            }
        }, scope);

        this.btnCancelarLiquidacionByClienteProveedorDuo.setHandler(function () {
            var selects = scope.fGetSelectionsOnPaging();
            if (selects[0] ? (selects[0].liquidadomb !== 0) : true) {
                scope.fLiquidar2Duo(2, selects[0]);
            } else {
                mostrarMensaje(1, 'El ' + (scope.tipoDuo === 1 ? 'Cliente' : 'Proveedor') + ' no tiene liquidaciones para cancelar.');
            }
        }, scope);

        this.btnCancelarLiquidacionDuo.setHandler(function () {
            var selects = scope.fGetSelectionsOnPaging();
            // scope.fShowCancelarLiquidarDuo(selects);
            scope.fShowLiquidarDuo(selects, 2);
        }, scope);

        this.btnTraspasoDuo.setHandler(function () {
            scope.fTest();
        }, scope);

        this.btnTraspasoAvanzadoDuo.setHandler(function () {
            scope.fShowTraspasoAvanzadoDuo();
        }, scope);

        this.btnIncobrableDuo.setHandler(function () {
            scope.fShowIncobrableDuo();
        }, scope);

        this.btnNotaCreditoDuo.setHandler(function () {
            scope.fShowNotaCreditoDuo();
        }, scope);

        this.btnVerDuo.setHandler(function () {
            scope.fShowVerDuo();
        }, scope);

        this.btnExpDuo.setHandler(function () {
            scope.fShowExpDuo();
        }, scope);

        this.btnBuscarDuo.setHandler(function () {
            scope.fShowBuscarDuo();
        }, scope);

        this.btnDocOrigen.setHandler(function () {
            scope.fShowDocOrigen();
        }, scope);

        this.btnGraficarDuo.setHandler(function () {
            scope.fGraphDuo();
        }, scope);

        this.menuItemMod.on({
            click: function () {
                scope.btnModificarDuo.handler.call();
            }
        });
        this.menuItemDel.on({
            click: function () {
                scope.btnEliminarDuo.handler.call();
            }
        });
        this.menuItemConfirm.on({
            click: function () {
                scope.btnConfirmarDuo.handler.call();
            }
        });
        this.menuItemDocOrigen.on({
            click: function () {
                scope.btnDocOrigen.handler.call();
            }
        });
        this.menuItemContab.on({
            click: function () {
                scope.btnContabilizarDuo.handler.call();
            }
        });
        this.menuItemLiquidar.on({
            click: function () {
                scope.btnLiquidarDuo.handler.call();
            }
        });

        this.menuItemLiquidarCancelar.on({
            click: function () {
                scope.btnCancelarLiquidacionDuo.handler.call();
            }
        });
        this.menuItemTrasp.on({
            click: function () {
                scope.fShowTraspasoDuo();
            }
        });
        this.menuItemNotaCredito.on({
            click: function () {
                scope.btnNotaCreditoDuo.handler.call();
            }
        });
        this.menuItemIncobrable.on({
            click: function () {
                scope.btnIncobrableDuo.handler.call();
            }
        });

        /* Menu contextual */
        scope.gpRegistroDuo.on({
            // rowcontextmenu: function (grid, rowIndex, eventObject) {
            //     eventObject.stopEvent();
            //     grid.getSelectionModel().selectRow(rowIndex);
            //     scope.menuItemMod.setVisible(!scope.btnModificarDuo.disabled);
            //     scope.menuItemDel.setVisible(!scope.btnEliminarDuo.disabled);
            //     scope.menuItemCancel.setVisible((scope.aperturado) ? !scope.btnCancelarDuo.disabled : false);
            //     scope.menuItemConfirm.setVisible((scope.aperturado) ? !scope.btnConfirmarDuo.disabled : false);
            //     scope.menuItemContab.setVisible((scope.aperturado) ? !scope.btnContabilizarDuo.disabled : false);
            //     scope.menuItemLiquidar.setVisible((scope.aperturado) ? !scope.btnLiquidarDuo.disabled : false);
            //     scope.menuItemLiquidarCancelar.setVisible((scope.aperturado) ? !scope.btnCancelarLiquidacionDuo.disabled : false);
            //     scope.menuItemTrasp.setVisible(!scope.btnTraspasoDuo.disabled);
            //     scope.menuItemNotaCredito.setVisible(!scope.btnNotaCreditoDuo.disabled);
            //     scope.menuItemIncobrable.setVisible(!scope.btnIncobrableDuo.disabled);
            //     scope.menuItemDocOrigen.setVisible(!scope.btnDocOrigen.disabled);
            //
            //     scope.menuContextual.showAt(eventObject.getXY());
            // },
            rowdblclick: function (grid, row, event) {
                var record = grid.getStore().getAt(row);
                if (record) {
                    var estado = record.get('idestadodocumento');
                    var idsub = record.get('idsubsistema');
                    if (idsub == 6) {
                        if (estado == 2) {
                            scope.fShowAdicionarDuo(2, record);
                        } else {
                            scope.fShowAdicionarDuo(3, record);
                        }
                    }
                }
            }
        });

        this.ptRegistroDuo.on('beforechange', function () {
            instance = new PagingToolbarSelections({
                'selections': scope.gpRegistroDuo.getSelectionModel().getSelections(),
                'activePage': this.getPageData().activePage
            });
            instance.saveSelectionsOnPage(scope.arrayValues);
        });

        this.ptRegistroDuo.on('change', function () {
            instance = new PagingToolbarSelections({
                'activePage': this.getPageData().activePage
            });
            instance.setSelectionsOnPage(scope.arrayValues, scope.gpRegistroDuo);
        });

        this.rowaction.on({
            scope: this,
            action: function (grid, recordarray, icon, rowindex, colindex) {
                this.fShowReporteComprobante();
            },
            beforeaction: function (grid, rowIndex) {
            }
        });
    },
    initializeFunctions: function (scope) {
        this.fShowReporteComprobante = function () {
            // Ext.Msg.wait(scope.etiquetas.lbCargando, scope.etiquetas.lbEspere);
            Ext.Msg.wait('Cargando...', 'Espere');
            var arrayIdCmp = [];
            var arrayId = this.gpGestionarDuo.getSelectionModel().getSelected().json.arrayIdCmp;
            for (var i = 0; i < arrayId.length; i++) {
                arrayIdCmp.push({
                    idcomprobante: arrayId[i],
                    // iddocucomprobante: this.gpGestionarDuo.getSelectionModel().getSelected().json.iddoc
                });
            }

            // Ext.Ajax.request({
            //     url: "/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/registrodecomprobantes/" + 'obtenerDatosImprimirReporte',
            //     params: {
            //         reporteParams: Ext.encode(arrayIdCmp)
            //     },
            //     callback: function (options, success, response) {
            //         var responseData = Ext.decode(response.responseText);
            //         if (responseData.dataSources.length > 0) {
            //             fOpenWindowReportCmp({
            //                 datoGeneral: {
            //                     reporte: '100',
            //                     titulo: 'Comprobante de operaciones',
            //                 },
            //                 datoCuerpo: responseData.dataSources
            //             });
            //         }
            //         Ext.MessageBox.hide();
            //     }
            // });
            Ext.MessageBox.hide();
            fOpenWindowReportCmp({
                datoGeneral: {
                    reporte: '100',
                    titulo: 'Comprobante de operaciones',
                },
                datoCuerpo: [],
                datoParametros: arrayIdCmp
            });
        };

        fOpenWindowReportCmp = function (datosReporte) {
            defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
            var printView = new SCFPrintView(datosReporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
            printView.show();
        };

        this.fNroDocConcatenados = function (glue, selects) {
            var glue = (glue) ? glue : ', ';
            var arrayDuoText = [];
            var arrayDuo = (selects) ? ((!Ext.isArray(selects)) ? [selects] : selects) : scope.fGetSelectionsOnPaging();
            for (var v = 0; v < arrayDuo.length; v++) {
                arrayDuoText.push(arrayDuo[v].numero);
            }

            return arrayDuoText.join(glue);
        };

        this.fShowConfirmarDuo = function (arregloselect) {
            arregloselect = (!Ext.isArray(arregloselect)) ? [arregloselect] : arregloselect;
            scope.objWindowsDuo = arregloselect;

            var msg = scope.etiquetas.lbConfirmConf;
            msg = (scope.tipoDuo == 1 || scope.tipoDuo == 2) ? ((arregloselect.length > 1) ? msg.replace("<#artDuo>", scope.artDuoTextoP.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelFP) : msg.replace("<#artDuo>", scope.artDuoTexto.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelF)) :
                ((arregloselect.length > 1) ? msg.replace("<#artDuo>", scope.artDuoTextoP.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelMP) : msg.replace("<#artDuo>", scope.artDuoTexto.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelM));

            mostrarMensaje(2, msg, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.fConfirmarDuo(arregloselect);
                } else {
                    scope.objWindowsDuo = '';
                    scope.btnAdicionarDuo.focus();
                }
            });
        };

        this.fShowEliminarDuo = function (arregloselect) {
            arregloselect = (!Ext.isArray(arregloselect)) ? [arregloselect] : arregloselect;
            scope.objWindowsDuo = arregloselect;

            var msg = scope.etiquetas.lbConfirmDel;
            msg = (scope.tipoDuo == 1 || scope.tipoDuo == 2) ? ((arregloselect.length > 1) ? msg.replace("<#artDuo>", scope.artDuoTextoP.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelFP) : msg.replace("<#artDuo>", scope.artDuoTexto.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelF)) :
                ((arregloselect.length > 1) ? msg.replace("<#artDuo>", scope.artDuoTextoP.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelMP) : msg.replace("<#artDuo>", scope.artDuoTexto.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelM));

            if (scope.tipoDuo == 1) {
                msgDel = (arregloselect.length > 1) ? 'Eliminando datos de las cuentas por cobrar.' : 'Eliminando datos de la cuenta por cobrar.';
            } else if (scope.tipoDuo == 2) {
                msgDel = (arregloselect.length > 1) ? 'Eliminando datos de las cuentas por pagar.' : 'Eliminando datos de la cuenta por pagar.';
            } else if (scope.tipoDuo == 3) {
                msgDel = (arregloselect.length > 1) ? 'Eliminando datos de los cobros fiscales.' : 'Eliminando datos del cobro fiscal.';
            } else if (scope.tipoDuo == 4) {
                msgDel = (arregloselect.length > 1) ? 'Eliminando datos de los pagos fiscales.' : 'Eliminando datos del pago fiscal.';
            }

            mostrarMensaje(2, msg, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.fEliminarDuo(arregloselect);
                } else {
                    scope.objWindowsDuo = '';
                }
            });
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

        this.fShowDocOrigen = function () {
            selection = scope.gpGestionarDuo.getSelectionModel().getSelected().data;

            this.tipoReportes = new LOG.util.Report({
                reports: [
                    {
                        dirReport: scope.tipoDuo == 2 ? '/distra/logistica/inventario/entrada/recepcion/RecepcionDualModelo'
                            : '/distra/logistica/facturacion/facturacion/FacturacionDualModelo',
                        name: scope.tipoDuo == 2 ? 'RecepcionDualModelo' : 'FacturacionDualModelo',
                        description: scope.tipoDuo == 2 ? 'RecepcionDualModelo' : 'FacturacionDualModelo',
                        isList: false,
                        params: {
                            hasSign: false,
                            hasCategoria: (true) ? 'true' : 'false',
                            iddocumento: selection.iddocorigen,
                            idestructuracomun: selection.idestructuracomun,
                            monedacontable: selection.idMonedaContable,
                            monedaalternativa: selection.idMonedaAlternativa
                        }
                    }
                ]
            });
            this.tipoReportes.view();
        };

        this.fShowBuscarDuo = function () {
            parametros = {
                tipoDuo: scope.tipoDuo,
                url: scope.url,
                confEspecialidad: scope.confEspecialidad,
                textDuo: scope.tipoDuoTexto,
                textDuoPlural: scope.tipoDuoTextoPlural,
                artTexto: scope.artDuoTexto,
                artTextoP: scope.artDuoTextoP,
                params: scope.stGestionarDuo.baseParams
            };

            scope.loadMask('Cargando...');
            if (!this.objWindowsDuo)
                this.objWindowsDuo = new Ext.ClassBuscarDuo(scope.etiquetas, parametros);

            this.objWindowsDuo.addListener('closeBuscar', function (cancel, infoAgrupada, params) {
                scope.objWindowsDuo = '';
                scope.btnAdicionarDuo.focus();
            });

            this.objWindowsDuo.addListener('buscarDuo', function (params) {
                scope.clearFiltersGridDuo();
                scope.objWindowsDuo = '';
                var baseParams = {
                  start: '',
                  limit: '',
                  aperturado: scope.aperturado,
                  searching: 1,
                  tipoduo: scope.tipoDuo
                };
                if (params.numero)
                    baseParams.numero = params.numero;
                if (params.numerocontrato)
                    baseParams.numerocontrato = params.numerocontrato;
                if (params.idcuenta)
                    baseParams.idcuenta = params.idcuenta;
                if (params.idsubsistema)
                    baseParams.idsubsistema = params.idsubsistema;
                if (params.iddoc)
                    baseParams.iddoc = params.iddoc;
                if (params.idestadodocumento)
                    baseParams.idestadodocumento = params.idestadodocumento;
                if (params.importe)
                    baseParams.importe = params.importe;
                if (params.idcliente)
                    baseParams.idcliente = params.idcliente;
                if (params.numcomprobante)
                    baseParams.numcomprobante = params.numcomprobante;
                if (scope.confEspecialidad && params.idespecialidad)
                    baseParams.idespecialidad = params.idespecialidad;
                if (params.tipofecha)
                    baseParams.tipofecha = params.tipofecha;
                if (params.fechainicio)
                    baseParams.fechainicio = params.fechainicio;
                if (params.fechafin)
                    baseParams.fechafin = params.fechafin;
                if (params.idrango) {
                    if (params.idrango == 1) {
                        baseParams.rangoDesde = 0;
                        baseParams.rangoHasta = 30;
                    } else if (params.idrango == 2) {
                        baseParams.rangoDesde = 31;
                        baseParams.rangoHasta = 60;
                    } else if (params.idrango == 3) {
                        baseParams.rangoDesde = 61;
                        baseParams.rangoHasta = 90;
                    } else if (params.idrango == 4) {
                        baseParams.rangoDesde = 91;
                        baseParams.rangoHasta = 120;
                    } else if (params.idrango == 5) {
                        baseParams.rangoDesde = 120;
                        baseParams.rangoHasta = 10000;
                    }
                }
                scope.stGestionarDuo.baseParams = baseParams;
                scope.stGestionarDuo.load({
                    callback: function (records, options, success) {
                        if (!records.length) {
                            mostrarMensaje(1, scope.etiquetas.msgNoMatchingData);
                        }
                        scope.btnAdicionarDuo.focus();
                    }
                });
            });
        };

        this.clearFiltersGridDuo = function () {
            scope.stGestionarDuo.baseParams = {};
            scope.stGestionarDuo.baseParams.tipoduo = scope.tipoDuo;
        };

        this.fShowCancelarDuo = function () {
            var arrayIdDuo = [];
            var cInicial = '';
            var estadoDoc = '';
            var arrayDuo = new Array();
            var msg = '';

            arrayDuo = scope.fGetSelectionsOnPaging();
            var fechaDocMayor = arrayDuo[0].fechaemision;

            if (arrayDuo.length == 1) {
                msg = '¿Está seguro que quiere cancelar la factura seleccionada?';
            } else {
                msg = '¿Está seguro que quiere cancelar las facturas seleccionadas?';
            }

            for (var i = 0; i < arrayDuo.length; i++) {
                arrayIdDuo.push(arrayDuo[i].idderechouobligacion);
                facturas += arrayDuo[i].numero;
                if (i < arrayDuo.length - 1)
                    facturas += ';  ';
                if (arrayDuo[i].fechaemision > fechaDocMayor) {
                    fechaDocMayor = arrayDuo[i].fechaemision;
                }
            }
            var facturas = scope.fNroDocConcatenados();
            var cInicial = arrayDuo[0].cargainicial;
            var estadoDoc = arrayDuo[0].idestadodocumento;
            var idMoneda = arrayDuo[0].idmoneda;

            parametros = {
                arrayIdDuo: arrayIdDuo, //id de las facturas que voy a cancelar
                cInicial: cInicial, // Recorrer todos los seleccionados y si todos son de CI mandar 1 y si no mandar 0
                tipoDuo: scope.tipoDuo, //1, 2, 3, 4
                arrayNumCancelar: facturas, //MANDAR TODOS LOS NUMEROS DE LAS FACTURAS SELECCIONADAS PARA CANCELAR
                estadoDoc: estadoDoc,
                url: scope.url,
                textDuo: scope.tipoDuoTexto,
                textDuoP: scope.tipoDuoTextoPlural,
                artTexto: scope.artDuoTexto,
                artTextoP: scope.artDuoTextoP,
                fechaContable: scope.fechaContable,
                fechaInicial: scope.desde,
                fechaFin: scope.hasta,
                fechaDoc: fechaDocMayor,
            };

            if (scope.fDifEstados())
                scope.fShowMessageDifStatus();
            else {
                mostrarMensaje(2, msg, function (btnPress) {
                    if (btnPress === 'ok') {
                        scope.loadMask('Cargando...');

                        if (!scope.objWindowsDuo)
                            scope.objWindowsDuo = new Ext.ClassCancelarDuo(scope.etiquetas, parametros);

                        scope.objWindowsDuo.addListener('closeCancelar', function (cancel, infoAgrupada, params) {
                            scope.objWindowsDuo = '';
                            scope.btnAdicionarDuo.focus();
                        });

                        scope.objWindowsDuo.addListener('cancelarContabilizado', function (params) {
                            if (params.parametros.cInicial == 0) {
                                scope.fShowComprobanteCancelarDuo(params);
                            } else if (params.parametros.cInicial == 1) {
                                var vc = new Ext.CICancelacion.Controller({
                                    idMoneda: idMoneda,
                                    idSubsistema: 6,
                                    funcionalidad: 1,//1-obligacion 2-anticipo
                                    arrayIdObj: arrayIdDuo
                                });

                                vc.on({
                                    scope: this,
                                    cancelar: function (responseData) {
                                        var temp = {
                                            datos: responseData,
                                            codM: responseData.codM
                                        };
                                        scope.fCallBackComprobante(temp, arrayIdDuo, 2);
                                    }
                                });
                            }
                        });

                        scope.objWindowsDuo.addListener('cancelarDuo', function () {
                            scope.stGestionarDuo.reload({
                                callback: function (options, success, response) {
                                    scope.objWindowsDuo = '';
                                    Ext.MessageBox.hide();
                                    var msg = (arrayDuo.length > 1) ? scope.etiquetas.msgActionSuccessP.replace('<#artDuo>', scope.artDuoTextoP).replace('<#tipoDuo>', scope.tipoDuoTextoPlural.toLowerCase()).replace('<#accion>', (scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.etiquetas.actCancFP.toLowerCase() : scope.etiquetas.actCancMP.toLowerCase()) :
                                        scope.etiquetas.msgActionSuccess.replace('<#artDuo>', scope.artDuoTexto).replace('<#tipoDuo>', scope.tipoDuoTexto.toLowerCase()).replace('<#accion>', (scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.etiquetas.actCancF.toLowerCase() : scope.etiquetas.actCancM.toLowerCase());
                                    mostrarMensaje(1, msg);
                                    scope.btnAdicionarDuo.focus();
                                }
                            });
                        });
                    } else {
                        scope.objWindowsDuo = '';
                        scope.btnAdicionarDuo.focus();
                    }
                });

            }
        };

        this.Fecha = function () {
            var fechaMin = new Date();
            fechaMin = Date.parseDate(scope.fechaContable, "d/m/Y");
            scope.btnFecha.menu.picker.minDate = fechaMin;
            var fechaMax = new Date();
            fechaMax = Date.parseDate(scope.hasta, "d/m/Y");
            scope.btnFecha.menu.picker.maxDate = fechaMax;
            var fechaActual = Date.parseDate(scope.fechaContable, "d/m/Y");
            scope.btnFecha.menu.picker.setValue(fechaActual);
        };

        this.pasarFecha = function (picker, fecha) {
            scope.loadMessageBox('Cambiando fecha.');
            Ext.Ajax.request({
                method: "POST",
                url: "pasarDia",
                params: {
                    fechaActual: fecha.format('d/m/Y')
                },
                callback: function (options, success, response) {
                    Ext.Msg.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.fechaActual == 'actual') {
                        mostrarMensaje(1, scope.etiquetas.misfechaPasarDia);
                    }
                    else {
                        var fechaMinActual = new Date();
                        fechaMinActual = Date.parseDate(responseData.fechaActual, "d/m/Y");
                        scope.btnFecha.menu.picker.minDate = fechaMinActual;
                        scope.btnFecha.menu.picker.setValue(fechaMinActual);
                        scope.btnFecha.menu.picker.setMinDate(fechaMinActual);
                        scope.lfdFechaContable.setText(((scope.aperturado == 0) ? ' Carga inicial: ' : ' Fecha contable: ') + fechaMinActual.format('d/m/Y'));
                        scope.stGestionarDuo.reload();
                    }
                }
            });
        };

        this.fShowAdicionarDuo = function (action, dataDoc) {
            parametros = {
                tipoDuo: scope.tipoDuo,
                aperturado: scope.aperturado,
                action: action, // 1 EN CASO DE ADICIONAR, 2 EN CASO DE MODIFICAR Y 3 EN CASO DE MOSTRAR
                actionText: (action == 2) ? ((scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.etiquetas.actModF : scope.etiquetas.actModM) : ((scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.etiquetas.actAddF : scope.etiquetas.actAddM),
                url: scope.url,
                confEspecialidad: scope.confEspecialidad,
                confFechaRecepcion: scope.confFechaRecepcion,
                textDuo: scope.tipoDuoTexto,
                textDuoPlural: scope.tipoDuoTextoPlural,
                artTexto: scope.artDuoTexto,
                artTextoP: scope.artDuoTextoP
            };
            if (dataDoc) {
                parametros.idDuo = dataDoc.data.idderechouobligacion;
                parametros.dataDoc = dataDoc;
            }

            scope.loadMask('Cargando...');

            if (!this.objWindowsDuo)
                this.objWindowsDuo = new Ext.ClassAdicionarDuo(scope.etiquetas, parametros);
            this.objWindowsDuo.arrAnexoOperaciones = [];

            this.objWindowsDuo.addListener('closeAdicionar', function (cancel, adiciono, infoAgrupada, params) {
                if (adiciono) {
                    scope.loadMask('Cargando...');
                    scope.stGestionarDuo.reload({
                        callback: function () {
                            Ext.getBody().unmask();
                        }
                    })
                }
                scope.objWindowsDuo = '';
            });

            this.objWindowsDuo.addListener('contabilizarDuo', function (idDuo, idcuenta, concatcta) {
                scope.fShowContabilizarDuo(idDuo, idcuenta, concatcta);
            });
        };

        this.fShowTraspasoDuo = function () {
            this.loadMessageBox(scope.etiquetas.lbMsgLoadData);
            var cuentas = Array();
            var idcuentas = Array();
            var numerosDoc = Array();
            var arrayIdDuo = Array();
            var arrayDuoTraspaso = Array();
            var flag = false;

            var arrayDuo = new Array();
            arrayDuo = scope.fGetSelectionsOnPaging();

            for (var i = 0; i < arrayDuo.length; i++) {
                if (arrayDuo[i].idestadodocumento == 4) {
                    numerosDoc += arrayDuo[i].numero;
                    arrayIdDuo.push(arrayDuo[i].idderechouobligacion);
                    arrayDuoTraspaso.push(arrayDuo[i]);
                    if (i < arrayDuo.length - 1)
                        numerosDoc += ';  ';
                }

                if (idcuentas.length > 0) {
                    for (var j = 0; j < idcuentas.length; j++)
                        (arrayDuo[i].idcuenta != idcuentas[j]) ? flag = true : flag = false;

                    if (flag && arrayDuo[i].idestadodocumento == 4) {
                        idcuentas.push(arrayDuo[i].idcuenta);
                        cuentas += '<br>' + '- ' + arrayDuo[i].text;
                        flag = false;

                        if (i < idcuentas.length - 1)
                            cuentas += '<br>';
                    }
                }
                else {
                    if (arrayDuo[i].idestadodocumento == 4) {
                        idcuentas.push(arrayDuo[i].idcuenta);
                        cuentas += '- ' + arrayDuo[i].text;
                    }
                }
            }

            parametros = {
                tipoDuo: scope.tipoDuo,
                url: scope.url,
                cuentas: cuentas,
                idcuentas: idcuentas,
                numerosDoc: numerosDoc,
                arrayIdDuo: arrayIdDuo,
                arrayDuoTraspaso: arrayDuoTraspaso,
                fechaContable: scope.fechaContable
            };

            if (!this.objWindowsDuo)
                this.objWindowsDuo = new Ext.ClassTraspasoDuo(scope.etiquetas, parametros);

            this.objWindowsDuo.addListener('closeTraspaso', function (cancel, infoAgrupada, params) {
                scope.objWindowsDuo = '';
            });

            this.objWindowsDuo.addListener('contabilizar', function (params) {
                scope.fShowComprobante(params.actionContabiliza, params.dataComprobante, params.idObjeto, params.detalle, params.observacion, params.tipoContabilizacion, params.parametros);
            });
        };

        this.fShowTraspasoAvanzadoDuo = function () {
            this.loadMessageBox(scope.etiquetas.lbMsgLoadData);

            parametros = {
                tipoDuo: scope.tipoDuo,
                url: scope.url
            };

            if (!this.objWindowsDuo)
                this.objWindowsDuo = new Ext.ClassTraspasoAvanzadoDuo(scope.etiquetas, parametros);

            this.objWindowsDuo.addListener('closeTraspasoAvanzado', function (cancel, infoAgrupada, params) {
                scope.stGestionarDuo.reload({
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        scope.objWindowsDuo = '';
                        scope.btnAdicionarDuo.focus();
                    }
                });
            });

            this.objWindowsDuo.addListener('contabilizar', function (params) {
                scope.fShowComprobante(params.actionContabiliza, params.dataComprobante, params.idObjeto, params.detalle, params.observacion, params.tipoContabilizacion, params.parametros);
            });
        };

        this.fShowNotaCreditoDuo = function () {
            var arrayDuo = new Array();
            arrayDuo = scope.fGetSelectionsOnPaging();

            scope.objWindowsDuo = 'duo';
            if (scope.fDifEstados())
                scope.fShowMessageDifStatus();
            else {
                var facturas = '';
                var arrayIdDuo = [];
                for (var v = 0; v < arrayDuo.length; v++) {
                    facturas += arrayDuo[v].numero;
                    arrayIdDuo.push(arrayDuo[v].idderechouobligacion);
                    if (v < arrayDuo.length - 1)
                        facturas += ';  ';
                }
                facturas += '<br>' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                title = scope.etiquetas.lbBtnNotaCredito;
                messageAction = scope.etiquetas.lbActionNotaCredito + '<br><br>' + facturas;
                functionAction = scope.fShowComprobanteNotaCreditoDuo;
                scope.fShowMessage(title, messageAction, functionAction);
            }
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

        this.fShowIncobrableDuo = function () {
            var arrayIdDuo = [];
            var arrayDuo = new Array();
            var facturas = '';
            arrayDuo = scope.fGetSelectionsOnPaging();

            for (var i = 0; i < arrayDuo.length; i++) {
                arrayIdDuo.push(arrayDuo[i].idderechouobligacion);
                facturas += arrayDuo[i].numero;
                if (i < arrayDuo.length - 1)
                    facturas += ';  ';
            }

            parametros = {
                arrayIdDuo: arrayIdDuo, //id de las facturas que voy a cancelar
                tipoDuo: scope.tipoDuo, //1, 2, 3, 4
                arrayNumDoc: facturas, //MANDAR TODOS LOS NUMEROS DE LAS FACTURAS SELECCIONADAS PARA CANCELAR
                url: scope.url
            };

            this.loadMessageBox(scope.etiquetas.lbMsgLoadData);

            if (!this.objWindowsDuo)
                scope.objWindowsDuo = new Ext.ClassIncobrableDuo(scope.etiquetas, parametros);

            this.objWindowsDuo.addListener('closeIncobrable', function (cancel, infoAgrupada, params) {
                scope.stGestionarDuo.reload({
                    callback: function (options, success, response) {
                        scope.objWindowsDuo = '';
                        Ext.MessageBox.hide();
                    }
                });
            });

            this.objWindowsDuo.addListener('incobrableDuo', function (params) {
                scope.fShowComprobanteIncobrableDuo(params);
            });
        };

        this.fShowComprobanteIncobrableDuo = function (parametros) {
            tipoContabilizacion = 2; //1 contabilizar doc confirmado | 2 revertir comprobante contabilizado
            actionContabiliza = 'incobrable';
            idEstadoDocumento = 6;
            idEstadodcop = 4;
            url = 'addIncobrableDuo';
            scope.fLoadDataComprobante(tipoContabilizacion, idEstadoDocumento, idEstadodcop, actionContabiliza, url, '', parametros);
        };

        this.fShowComprobanteNotaCreditoDuo = function (btn) {
            if (btn == 'ok') {
                tipoContabilizacion = 2; //1 contabilizar doc confirmado | 2 revertir comprobante contabilizado
                actionContabiliza = 'notaCredito';
                idEstadoDocumento = 1;
                idEstadodcop = 4;
                url = 'addNotaCreditoDuo';

                scope.fLoadDataComprobante(tipoContabilizacion, idEstadoDocumento, idEstadodcop, actionContabiliza, url);
            } else {
                scope.objWindowsDuo = '';
            }
        };

        this.fShowLiquidarDuo = function (arregloselect, tipoContabilizacion = 2) {
            arregloselect = (!Ext.isArray(arregloselect)) ? [arregloselect] : arregloselect;
            scope.objWindowsDuo = arregloselect;

            var msg = tipoContabilizacion === 1 ? scope.etiquetas.lbConfirmConl : scope.etiquetas.lbConfirmCanl;
            msg = (scope.tipoDuo == 1 || scope.tipoDuo == 2) ? ((arregloselect.length > 1) ? msg.replace("<#artDuo>", scope.artDuoTextoP.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelFP) : msg.replace("<#artDuo>", scope.artDuoTexto.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelF)) :
                ((arregloselect.length > 1) ? msg.replace("<#artDuo>", scope.artDuoTextoP.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelMP) : msg.replace("<#artDuo>", scope.artDuoTexto.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelM));

            mostrarMensaje(2, msg, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.fLiquidarDuo(arregloselect, tipoContabilizacion);
                } else {
                    scope.objWindowsDuo = '';
                    scope.btnAdicionarDuo.focus();
                }
            });
        };

        this.fLiquidarDuo = function (arregloselect, tipoContabilizacion) {
            this.objWindowsDuo = new Ext.ClassLiquidarDuo(scope.etiquetas, parametros = arregloselect[0], scope.tipoDuo, tipoContabilizacion, scope.fechaContable, scope.desde, scope.hasta);//tipo de contabilizacion, 1 liquidar 2 cancelar liquidacion
            this.objWindowsDuo.addListener('closeLiquidar', function () {
                scope.objWindowsDuo = '';
            });
            this.objWindowsDuo.addListener('Liquidar', function (parametros) {
                if (actionContabiliza === 'Liquidar') {
                    Ext.Msg.wait(scope.etiquetas.lbMsgCargando, scope.etiquetas.lbMsgEspere);
                    scope.fShowLiquidar(parametros);
                }
            });
        };

        this.fLiquidar2Duo = function (tipoContabilizacion, select = undefined) {
            this.objWindowsDuo = new Ext.ClassLiquidarPorCliente({
                etiquetas: scope.etiquetas,
                tipoDuo: scope.tipoDuo,
                tipoContabilizacion: tipoContabilizacion,
                fechaContable: scope.fechaContable,
                desde: scope.desde,
                hasta: scope.hasta,
                parametros: select
            });//tipo de contabilizacion, 1 liquidar 2 cancelar liquidacion
            this.objWindowsDuo.addListener('closeWinLiquidarAll', function () {
                scope.objWindowsDuo = '';
            });

            this.objWindowsDuo.addListener('LiquidarAll', function (parametros) {
                Ext.Msg.wait(scope.etiquetas.lbMsgCargando, scope.etiquetas.lbMsgEspere);
                scope.fShowLiquidar(parametros);
            });
        };

        this.fShowLiquidar = function (parametros) {
            Ext.Ajax.request({
                url: scope.url + 'loadDataComprobanteLiquidacion',
                method: 'POST',
                params: parametros,
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    // if (responseData.codM == 3) {
                    //     Ext.MessageBox.hide();
                    //     mostrarMensaje(1, 'La(s) operaci&oacute;n(s) de la cuenta por cobrar seleccionada no tiene(n) modelo(s) configurado(s).');
                    // }
                    if (responseData.codM == 1) {
                        Ext.MessageBox.hide();
                        mostrarMensaje(1, 'La liquidación parcial o cancelación parcial que desea hacer sobrepasa el importe del cobro o pago.');
                        scope.objWindowsDuo.getWindow().gridPanelObligaciones.getStore().load();
                    } else if (responseData.codM == 2) {
                        Ext.MessageBox.hide();
                        mostrarMensaje(1, 'El estado del cobro o pago es incorrecto.');
                        scope.objWindowsDuo.getWindow().gridPanelObligaciones.getStore().load();
                    } else if (responseData.codM == 3) {
                        Ext.MessageBox.hide();
                        mostrarMensaje(1, 'El cobro o pago no se encuentra posteado por lo tanto no se puede efectuar la acción solicitada.');
                        scope.objWindowsDuo.getWindow().gridPanelObligaciones.getStore().load();
                    }
                    else {
                        // var win = Ext.Cont.Comprobante.init(6, responseData.datos.detalle, responseData.datos.descripcion, parametros.fecha, responseData.datos.dataComprobante, 3, 1, 1/*, null, null, null, scope.url + 'ActualizarDuo', parametros*/);
                        var win = Ext.Cont.Comprobante.setIdSubsistema(6)
                            .setDetalle(responseData.datos.detalle)
                            .setObservacion(responseData.datos.descripcion)
                            .setFechaEmision(parametros.fecha)
                            .setAnotaciones(responseData.datos.dataComprobante)
                            .setIdTipoComprante(3)
                            .setTipoCont(1)
                            .setAccion(1)
                            .setAnulado(1)
                            .iniciar();
                        win.onSaved(function (idComprobant, numComprobant, fecha) {
                            // Ext.MessageBox.hide();
                            scope.objWindowsDuo.closeLiquidar();
                            scope.loadMessageBox();
                            if (idComprobant) {
                                Ext.Ajax.request({
                                    url: scope.url + 'ActualizarDuo',
                                    method: 'POST',
                                    params: {
                                        arrayIdDuo: parametros.arrayIdDuo,
                                        tipoDuo: parametros.tipoDuo,
                                        idcomprobante: idComprobant,
                                        numerocomprobante: numComprobant,
                                        fecha: fecha,
                                        tipoContabilizacion: parametros.tipoContabilizacion,
                                        comentario: responseData.datos.descripcion,
                                        // numero: !parametros.numeroInst ? (parametros.tipoContabilizacion === 1 ? 'LIQUIDACION' : 'CANCELACION LIQUIDACION') : parametros.numeroInst,
                                        numero: parametros.numeroInst,
                                    },
                                    callback: function (options, success, response) {
                                        scope.stGestionarDuo.reload({
                                            callback: function (records, options, success) {
                                                scope.objWindowsDuo = '';
                                            }
                                        });
                                        Ext.MessageBox.hide();
                                        if (parametros.tipoContabilizacion == 2) {
                                            mostrarMensaje(1, 'Cancelaci&oacute;n satisfactoria registrada en el comprobante ' + numComprobant + '.');
                                        } else {
                                            mostrarMensaje(1, 'Liquidaci&oacute;n satisfactoria registrada en el comprobante ' + numComprobant + '.');
                                        }
                                    }
                                });
                            }
                        }).onClose(function () {
                            Ext.MessageBox.hide();
                            // scope.objWindowsDuo = '';
                        });
                    }
                }
            });
        };

        this.fShowContabilizarDuo = function (idDuo, idcuenta, concatcta) {
            if (scope.fDifEstados()) {
                scope.fShowMessageDifStatus();
            } else {
                var arregloselect = (!Ext.isArray(idDuo)) ? [idDuo] : idDuo;
                scope.objWindowsDuo = arregloselect;

                var msg = scope.etiquetas.lbConfirmCont;
                msg = (scope.tipoDuo == 1 || scope.tipoDuo == 2) ? ((arregloselect.length > 1) ? msg.replace("<#artDuo>", scope.artDuoTextoP.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelFP) : msg.replace("<#artDuo>", scope.artDuoTexto.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelF)) :
                    ((arregloselect.length > 1) ? msg.replace("<#artDuo>", scope.artDuoTextoP.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelMP) : msg.replace("<#artDuo>", scope.artDuoTexto.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelM));
                if (Ext.isArray(idDuo)) {
                    mostrarMensaje(2, msg, function (btnPress) {
                        if (btnPress === 'ok') {
                            scope.fShowComprobanteContabilizarDuo();
                        } else {
                            scope.objWindowsDuo = '';
                        }
                    });

                } else { // si lo que viene es un identificador
                    tipoContabilizacion = 1; //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
                    actionContabiliza = 'contabilizar';
                    idEstadoDocumento = 4;
                    idEstadodcop = 1;
                    scope.fLoadDataComprobante(tipoContabilizacion, idEstadoDocumento, idEstadodcop, actionContabiliza, 'contabilizarDuo', idDuo/*, idcuenta, concatcta*/);
                }
            }
        };

        this.fShowComprobanteContabilizarDuo = function () {
            tipoContabilizacion = 1; //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
            actionContabiliza = 'contabilizar';
            idEstadoDocumento = 4;
            idEstadodcop = 1;
            url = 'contabilizarDuo';
            scope.fLoadDataComprobante(tipoContabilizacion, idEstadoDocumento, idEstadodcop, actionContabiliza, url);
        };

        this.fShowComprobanteCancelarDuo = function (parametros) {
            tipoContabilizacion = 2; //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
            actionContabiliza = 'contabilizar';
            idEstadoDocumento = 1;
            idEstadodcop = 4;
            url = 'cancelarDuo';
            scope.fLoadDataComprobante(tipoContabilizacion, idEstadoDocumento, idEstadodcop, actionContabiliza, url, '', parametros);
        };

        this.fLoadDataComprobante = function (tipoContabilizacion, idEstadoDocumento, idEstadodcop, actionContabiliza, url, idDuo, /*idcuenta, concatcta, */params) {
            this.loadMessageBox(scope.etiquetas.lbLoadDataComprobante);
            var arrayIdDuo = [];
            var arrayCuenta = [];
            var adicionarDuo = false;

            if (idDuo) {
                arrayIdDuo.push(idDuo);
                adicionarDuo = true;

                arrayCuenta.push({
                    idderechouobligacion: idDuo
                });
            } else {
                var arrayDuo = new Array();
                var arrayCuenta = new Array();
                arrayDuo = scope.fGetSelectionsOnPaging();
                for (var v = 0; v < arrayDuo.length; v++) {
                    arrayIdDuo.push(arrayDuo[v].idderechouobligacion);

                    arrayCuenta.push({
                        idderechouobligacion: arrayDuo[v].idderechouobligacion
                    });
                }
            }

            var parametros = {
                url: url,
                arrayIdDuo: arrayIdDuo,
                idEstadoDocumento: idEstadoDocumento,
                idEstadodcop: idEstadodcop,
                adicionarDuo: adicionarDuo
            };

            if (params) {
                parametros.idoperacion = params.parametros.idoperacion;
                parametros.motivo = params.parametros.motivo;
                parametros.nomMotivo = params.parametros.nomMotivo;
                parametros.fecha = params.parametros.fecha;
            }
            Ext.Ajax.request({
                url: scope.url + 'loadDataComprobante',
                method: 'POST',
                params: {
                    arrayIdDuo: Ext.encode(arrayIdDuo),
                    tipoDuo: scope.tipoDuo,
                    idOpContable: (params) ? params.parametros.idoperacion : '',
                    tipoContabilizacion: tipoContabilizacion,
                    arrayCuenta: Ext.encode(arrayCuenta),
                    nomMotivoCancelacion: parametros.nomMotivo,
                    fecha: parametros.fecha,
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    scope.fCallBackComprobante(responseData, arrayIdDuo, tipoContabilizacion);
                    // if (responseData.codM == 3) {
                    //     Ext.MessageBox.hide();
                    //     mostrarMensaje(1, 'La(s) operaci&oacute;n(s) de la cuenta por cobrar seleccionada no tiene(n) modelo(s) configurado(s).');
                    // } else if (responseData.codM == 4) {
                    //     Ext.MessageBox.hide();
                    //     mostrarMensaje(1, 'No se puede realizar esta acción porque el estado del documento ha sido cambiado');
                    //     scope.stGestionarDuo.reload({
                    //         callback: function (records, options, success) {
                    //             scope.objWindowsDuo = '';
                    //         }
                    //     });
                    // }
                    // else {
                    //     var win = Ext.Cont.Comprobante.init(6, responseData.datos.detalle, responseData.datos.descripcion, responseData.datos.fechaCont, responseData.datos.dataComprobante, 3, 1, 1);
                    //     win.onSaved(function (idComprobant, numComprobant, fecha) {
                    //         if (idComprobant) {
                    //             Ext.Ajax.request({
                    //                 url: scope.url + 'cambiarEstadoDuo',
                    //                 method: 'POST',
                    //                 params: {
                    //                     arrayIdDuo: Ext.encode(arrayIdDuo),
                    //                     idcomprobante: idComprobant,
                    //                     numerocomprobante: numComprobant,
                    //                     fecha: fecha,
                    //                     tipoContabilizacion: tipoContabilizacion
                    //                 },
                    //                 callback: function (options, success, response) {
                    //                     if (!parametros.adicionarDuo) {
                    //                         scope.stGestionarDuo.reload({
                    //                             callback: function (records, options, success) {
                    //                                 scope.objWindowsDuo = '';
                    //                             }
                    //                         });
                    //                         mostrarMensaje(1, 'Posteo satisfactorio registrado en el comprobante ' + numComprobant + '.');
                    //                     } else {
                    //                         mostrarMensaje(1, 'Posteo satisfactorio registrado en el comprobante ' + numComprobant + '.');
                    //                         Ext.getCmp('btnAddContabilizar').disable();
                    //                     }
                    //                 }
                    //             });
                    //         }
                    //     }).onClose(function () {
                    //         scope.objWindowsDuo = '';
                    //     });
                    // }
                }
            });
        };

        this.fCallBackComprobante = function (responseData, arrayIdDuo, tipoContabilizacion) {

            if (responseData.codM == 3) {
                Ext.MessageBox.hide();
                mostrarMensaje(1, 'La(s) operaci&oacute;n(s) de la cuenta por cobrar seleccionada no tiene(n) modelo(s) configurado(s).');
            } else if (responseData.codM == 4) {
                Ext.MessageBox.hide();
                mostrarMensaje(1, 'No se puede realizar esta acción porque el estado del documento ha sido cambiado');
                scope.stGestionarDuo.reload({
                    callback: function (records, options, success) {
                        scope.objWindowsDuo = '';
                    }
                });
            }
            else {
                var win = Ext.Cont.Comprobante.init(6, responseData.datos.detalle, responseData.datos.descripcion, responseData.datos.fechaCont, responseData.datos.dataComprobante, 3, 1, 1);
                win.onSaved(function (idComprobant, numComprobant, fecha) {
                    if (idComprobant) {
                        scope.loadMessageBox('Cargando...');
                        Ext.Ajax.request({
                            url: scope.url + 'cambiarEstadoDuo',
                            method: 'POST',
                            params: {
                                arrayIdDuo: Ext.encode(arrayIdDuo),
                                idcomprobante: idComprobant,
                                numerocomprobante: numComprobant,
                                fecha: fecha,
                                tipoContabilizacion: tipoContabilizacion
                            },
                            callback: function (options, success, response) {
                                Ext.MessageBox.hide();
                                if (!parametros.adicionarDuo) {
                                    scope.stGestionarDuo.reload({
                                        callback: function (records, options, success) {
                                            scope.objWindowsDuo = '';
                                        }
                                    });
                                    mostrarMensaje(1, 'Posteo satisfactorio registrado en el comprobante ' + numComprobant + '.');
                                } else {
                                    mostrarMensaje(1, 'Posteo satisfactorio registrado en el comprobante ' + numComprobant + '.');
                                    Ext.getCmp('btnAddContabilizar').disable();
                                }
                            }
                        });
                    }
                }).onClose(function () {
                    scope.objWindowsDuo = '';
                });
            }
        };

        //construir y mostrar el comprobante
        this.fShowComprobante = function (actionContabiliza, dataComprobante, idObjeto, detalle, observacion, tipoContabilizacion, parametros) {
            var idSubsistema = 6;
            var idTipoComprobante = 3;
            var arrayAnotaciones = [];
            var anexos = [];

            observacion = scope.etiquetas.contabilizando + ' ' + observacion;

            if (dataComprobante.length > 0) {
                var anexos = [];
                for (i = 0; i < dataComprobante.length; i++) {
                    if (dataComprobante[i].anexo > 0) {
                        anexos = [];
                        for (var k = 0; k < dataComprobante[i].anexo.length; k++) {
                            anexos.push(new Ext.Cont.Comprobante.Anexo({
                                idcentronivel: dataComprobante[i].anexo[k].idcentronivel,
                                centronivel: dataComprobante[i].anexo[k].centronivel,
                                idelementouobjeto: dataComprobante[i].anexo[k].idelementouobjeto,
                                elementouobjeto: dataComprobante[i].anexo[k].elementouobjeto,
                                importe: dataComprobante[i].anexo[k].importe
                            }));
                        }
                    }

                    objAnotacion = new Ext.Cont.Comprobante.Anotacion({
                        numero: dataComprobante[i].numero,
                        iddocumento: dataComprobante[i].iddocumento,
                        cuenta: dataComprobante[i].concatcta,
                        idcuenta: dataComprobante[i].idcuenta,
                        moneda: dataComprobante[i].moneda,
                        idmoneda: dataComprobante[i].idmoneda,
                        idtasa: dataComprobante[i].idtasa,
                        idoperacion: dataComprobante[i].idoperacion,
                        tipo: dataComprobante[i].contabilidadAdicional //DETERMINA SI ES  CONTABILIDAD ADICIONAL 0|1
                    });
                    if (dataComprobante[i].debito)
                        objAnotacion.data.debito = dataComprobante[i].debito;
                    if (dataComprobante[i].credito)
                        objAnotacion.data.credito = dataComprobante[i].credito;

                    if (dataComprobante[i].anexo > 0)
                        objAnotacion.data.anexos = anexos;

                    arrayAnotaciones.push(objAnotacion);
                }
            }

            //Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, idTipoComprobante, detalle, observacion, scope.fechaContable, arrayAnotaciones, idObjeto).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                scope.loadMessageBox(scope.mascPrincipal);

                if (actionContabiliza == 'traspaso')
                    scope.fAddTraspasoDuo(idComprobante, numComprobante, fechaComprobante, parametros, detalle, observacion);
                else if (actionContabiliza == 'traspasoavanzado')
                    scope.fAddTraspasoAvanzadoDuo(idComprobante, numComprobante, fechaComprobante, parametros, detalle, observacion);
                else if (actionContabiliza == 'incobrable' || actionContabiliza == 'notaCredito' || actionContabiliza == 'contabilizar')
                    scope.fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, parametros);

            }).onClose(function () {
                if (!parametros.adicionarDuo)
                    scope.objWindowsDuo = '';
            });
        };

        this.fGuardarComprobante = function (idComprobante, numeroComprobante, fechaComprobante, parametros) {
            Ext.Ajax.request({
                method: "POST",
                url: scope.url + parametros.url,
                params: {
                    tipoDuo: scope.tipoDuo,
                    arrayIdDuo: Ext.encode(parametros.arrayIdDuo),
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    idEstadoDocumento: parametros.idEstadoDocumento,
                    idEstadodcop: parametros.idEstadodcop,
                    fecha: parametros.fecha,
                    idoperacion: parametros.idoperacion,
                    motivo: parametros.motivo,
                    estadoDoc: 4
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (parametros.adicionarDuo) {
                        Ext.getCmp('btnAddContabilizar').disable();
                        Ext.MessageBox.hide();
                        mostrarMensaje(1, scope.etiquetas.lbMsgContabilizado + ' ' + responseData.numeroComprobante + '.');
                    } else {
                        scope.stGestionarDuo.reload({
                            callback: function (options, success, response) {
                                Ext.MessageBox.hide();
                                mostrarMensaje(1, scope.etiquetas.lbMsgContabilizado + ' ' + responseData.numeroComprobante + '.', function () {
                                    if (!parametros.adicionarDuo)
                                        scope.objWindowsDuo = '';
                                });
                            }
                        });
                    }
                }
            });
        };

        this.fAddTraspasoDuo = function (idComprobante, numeroComprobante, fechaComprobante, parametros, detalle, descripcion) {
            Ext.Ajax.request({
                method: "POST",
                url: scope.url + parametros.url,
                params: {
                    tipoDuo: scope.tipoDuo,
                    arrayIdDuo: Ext.encode(parametros.arrayIdDuo),
                    arrayIdCuenta: Ext.encode(parametros.idcuentas),
                    idEstructuraDestino: parametros.idEstructuraDestino,
                    fechaTraspaso: scope.fechaContable,
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    detalleComprobante: detalle,
                    observacionComprobante: descripcion,
                    tipoContabilizacion: parametros.tipoContabilizacion
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.traspasado == true) {

                        Ext.Ajax.request({
                            method: "POST",
                            url: scope.url + 'contabilizarDuo',
                            params: {
                                tipoDuo: scope.tipoDuo,
                                arrayIdDuo: Ext.encode(responseData.arrayNewIdDuo),
                                idComprobante: responseData.idComprobanteTrasp,
                                numeroComprobante: responseData.numComprobanteTrasp,
                                fechaComprobante: responseData.fechaComprobanteTrasp
                            },
                            callback: function (options, success, response) {
                                scope.stGestionarDuo.reload({
                                    callback: function (options, success, response) {
                                        Ext.MessageBox.hide();
                                        mostrarMensaje(1, scope.etiquetas.lbMsgContabilizado + ' ' + numeroComprobante + '.', function () {
                                            scope.objWindowsDuo = '';
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        Ext.MessageBox.hide();
                        mostrarMensaje(1, scope.etiquetas.lbDocNoTraspasado);
                    }
                }
            });
        };

        this.fAddTraspasoAvanzadoDuo = function (idComprobante, numeroComprobante, fechaComprobante, parametros, detalle, descripcion) {
            Ext.Ajax.request({
                method: "POST",
                url: scope.url + parametros.url,
                params: {
                    tipoDuo: scope.tipoDuo,
                    arrayIdDuo: Ext.encode(parametros.arrayIdDuo),
                    arrayIdCuenta: Ext.encode(parametros.idcuentas),
                    idEstructuraDestino: parametros.idEstructuraDestino,
                    fechaTraspaso: scope.fechaContable,
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    detalleComprobante: detalle,
                    observacionComprobante: descripcion,
                    tipoContabilizacion: parametros.tipoContabilizacion
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.traspasado == true) {
                        Ext.Ajax.request({
                            method: "POST",
                            url: scope.url + 'salvarComprobanteDuoTraspasado',
                            params: {
                                idEstadoDocumento: (parametros.idEstructuraActual == parametros.idEstructuraDestino) ? 1 : 4,
                                idEstadodcop: 1,
                                arrayDataComprobanteIdDuo: Ext.encode(responseData.arrayDataComprobanteIdDuo)
                            },
                            callback: function (options, success, response) {
                                mostrarMensaje(1, scope.etiquetas.lbMsgContabilizado + ' ' + numeroComprobante + '.');
                            }
                        });
                    }
                    else {
                        Ext.MessageBox.hide();
                        mostrarMensaje(1, scope.etiquetas.lbDocNoTraspasado);
                    }
                }
            });
        };

        this.fGraphDuo = function () {
            scope.loadMask('Cargando...');
            Ext.Ajax.request({
                url: scope.url + 'graficarPorEstados',
                method: 'POST',
                params: {
                    tipoduo: scope.tipoDuo
                },
                callback: function (options, success, response) {
                    Ext.getBody().unmask();
                    w_graficar = new Ext.Window({
                        title: scope.etiquetas.titleGraphDuo,
                        closable: true,
                        height: 400,
                        html: '<div id="container" style="width: 630px; height: 370px; margin: 0 auto"></div>',
                        layout: 'fit',
                        modal: true,
                        resizable: false,
                        constrain: true,
                        width: 630,
                        listeners: {
                            close: function () {
                                scope.btnAdicionarDuo.focus();
                            }
                        }
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

        scope.gpRegistroDuo.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('idestadodocumento') == 1)
                return 'FilaRoja';
            else if (record.get('vencido') && record.get('vencido') == 1)
                return 'FilaMasRoja';
            else if (record.get('idestadodocumento') == 4)
                return 'FilaVerde';
        };

        this.RowClick = function (sm, indiceFila, record) {
            var arrayDuo = new Array();
            // arrayDuo = scope.fGetSelectionsOnPaging();
            arrayDuo = sm.getSelections();

            scope.btnModificarDuo.disable();
            scope.btnEliminarDuo.disable();
            scope.btnCancelarDuo.disable();
            scope.btnExpDuo.disable();
            scope.btnCancelarLiquidacionDuo.disable();
            scope.btnConfirmarDuo.disable();
            scope.btnContabilizarDuo.disable();
            scope.btnLiquidarDuo.disable();
            scope.btnTraspasoDuo.disable();
            scope.btnIncobrableDuo.disable();
            scope.btnNotaCreditoDuo.disable();
            scope.btnDocOrigen.disable();

            if (arrayDuo.length > 0 && !scope.fDifEstados()) {
                if (arrayDuo[0].data.idsubsistema == 6) {
                    if (arrayDuo[0].data.idestadodocumento != 1 && arrayDuo[0].data.idestadodocumento != 5 && arrayDuo[0].data.idestadodocumento != 6) {
                        if (arrayDuo[0].data.idestadodocumento != 2 && arrayDuo[0].data.idestadodocumento != 3 && arrayDuo[0].data.liquidadomb == 0)
                            scope.btnCancelarDuo.enable();
                        //btnModificarDuo
                        if (arrayDuo.length == 1 && (arrayDuo[0].data.idestadodocumento == 2/* || arrayDuo[0].idestadodocumento == 3*/) && arrayDuo[0].data.idsubsistema == 6)
                            scope.btnModificarDuo.enable();

                        //btnEliminarDuo (Ver en que estado llegan los documentos de subsistemas externos)
                        //en caso de que sean de subsistemas externos y si llegan en estado GUARDADO ver si se pueden eliminar o modificar
                        if (arrayDuo[0].data.idestadodocumento == 2) {
                            scope.btnEliminarDuo.enable();
                            scope.btnConfirmarDuo.enable();
                        }

                        if (arrayDuo[0].data.idestadodocumento == 3/* && arrayDuo.length == 1*/) {
                            // scope.btnEliminarDuo.enable();
                            // scope.btnModificarDuo.enable();
                            scope.btnCancelarDuo.enable();
                            scope.btnContabilizarDuo.enable();
                        }

                        if (arrayDuo[0].data.idestadodocumento == 4) {
                            scope.btnTraspasoDuo.enable();
                            scope.btnIncobrableDuo.enable();
                            scope.btnNotaCreditoDuo.enable();
                            if (!scope.confCancelarContabilizado)
                                scope.btnCancelarDuo.disable();
                        }
                    }
                } else {
                    // (arrayDuo.length == 1) ? scope.btnDocOrigen.enable() : scope.btnDocOrigen.disable();
                }
                if (arrayDuo[0].data.idestadodocumento == 4 && arrayDuo.length == 1 && (parseFloat(arrayDuo[0].data.importemb) - parseFloat(arrayDuo[0].data.liquidadomb)) > 0) {
                    scope.btnLiquidarDuo.enable();
                }
                if (arrayDuo[0].data.liquidadomb > 0 && arrayDuo.length == 1) {
                    scope.btnCancelarLiquidacionDuo.enable();
                }
                if (arrayDuo.length == 1) {
                    scope.btnExpDuo.enable();
                }
            }

            return;
        };

        this.fDifEstados = function () {
            var flagDifEstados = false;
            var arrayDuo = new Array();
            // arrayDuo = scope.fGetSelectionsOnPaging();
            arrayDuo = Ext.getCmp('gpGestionarDuo').getSelectionModel().getSelections();
            for (var i = 0; i < arrayDuo.length; i++) {
                for (var j = 0; j < arrayDuo.length; j++) {
                    /*if (arrayDuo[j].idestadodocumento == 4 && arrayDuo[j].pagadomb > 0) {
                        flagDifEstados = true;
                        break;
                    }
                    else*/ if (arrayDuo[i].data.idestadodocumento == 4 && arrayDuo[j].data.idestadodocumento == 4 && arrayDuo[i].data.cargainicial != arrayDuo[j].data.cargainicial) {
                        flagDifEstados = true;
                        break;
                    }
                    else if (arrayDuo[i].data.idestadodocumento != arrayDuo[j].data.idestadodocumento) {
                        flagDifEstados = true;
                        break;
                    }
                }
            }
            return flagDifEstados;
        };

        this.fAceptar = function (btn) {
            if (btn == 'ok') {
                scope.smGestionarDuo.clearSelections();
                scope.arrayValues = new Array();
            }
            scope.objWindowsDuo = '';
        };

        this.fEliminarDuo = function (arreglomandar) {
            scope.loadMessageBox(msgDel);
            var arrayIdDuo = [];
            var arrayNumDoc = [];

            for (var i = 0; i < arreglomandar.length; i++) {
                arrayIdDuo.push(arreglomandar[i].idderechouobligacion);
                arrayNumDoc.push(arreglomandar[i].numero);
            }

            Ext.Ajax.request({
                url: scope.url + 'eliminarDuo',
                method: 'POST',
                params: {
                    arrayIdDuo: Ext.encode(arrayIdDuo)
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    respuesta = responseData;
                    if (parseInt(respuesta) == 1) {

                        var msg = (scope.tipoDuo == 1 || scope.tipoDuo == 2) ? ((arreglomandar.length > 1) ? scope.etiquetas.msgActionSuccessP.replace("<#artDuo>", scope.artDuoTextoP).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase() /*+ " " + scope.etiquetas.lbSelFP*/).replace("<#accion>", scope.etiquetas.actDelFP.toLowerCase()) : scope.etiquetas.msgActionSuccess.replace("<#artDuo>", scope.artDuoTexto).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase() /*+ " " + scope.etiquetas.lbSelF*/).replace("<#accion>", scope.etiquetas.actDelF.toLowerCase())) :
                            ((arreglomandar.length > 1) ? scope.etiquetas.msgActionSuccessP.replace("<#artDuo>", scope.artDuoTextoP).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase() /*+ " " + scope.etiquetas.lbSelMP*/).replace("<#accion>", scope.etiquetas.actDelM.toLowerCase()) : scope.etiquetas.msgActionSuccess.replace("<#artDuo>", scope.artDuoTexto).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase() /*+ " " + scope.etiquetas.lbSelM*/).replace("<#accion>", scope.etiquetas.actDelM.toLowerCase()));

                        scope.stGestionarDuo.reload({
                            callback: function () {
                                Ext.MessageBox.hide();
                                mostrarMensaje(1, msg);
                                scope.arrayValues = new Array();
                                scope.smGestionarDuo.clearSelections();
                                scope.objWindowsDuo = '';
                                scope.btnAdicionarDuo.focus();
                            }
                        });
                    }
                    else {
                        mostrarMensaje(1, scope.etiquetas.lbError);
                        scope.btnAdicionarDuo.focus();
                    }
                }
            });
        };

        this.fConfirmarDuo = function (arreglomandar) {
            scope.loadMessageBox(scope.etiquetas.lbConfirmando);
            var arrayIdDuo = [];
            var arrayNumDoc = [];

            for (var i = 0; i < arreglomandar.length; i++) {
                arrayIdDuo.push(arreglomandar[i].idderechouobligacion);
                arrayNumDoc.push(arreglomandar[i].numero);
            }

            Ext.Ajax.request({
                url: scope.url + 'confirmarDuo',
                method: 'POST',
                params: {
                    arrayIdDuo: Ext.encode(arrayIdDuo)
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    respuesta = responseData;
                    if (parseInt(respuesta) == 1) {

                        var msg = (scope.tipoDuo == 1 || scope.tipoDuo == 2) ? ((arreglomandar.length > 1) ? scope.etiquetas.msgActionSuccessP.replace("<#artDuo>", scope.artDuoTextoP).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase() /*+ " " + scope.etiquetas.lbSelFP*/).replace("<#accion>", scope.etiquetas.actConfirFP.toLowerCase()) : scope.etiquetas.msgActionSuccess.replace("<#artDuo>", scope.artDuoTexto).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase() /*+ " " + scope.etiquetas.lbSelF*/).replace("<#accion>", scope.etiquetas.actConfirF.toLowerCase())) :
                            ((arreglomandar.length > 1) ? scope.etiquetas.msgActionSuccessP.replace("<#artDuo>", scope.artDuoTextoP).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase() /*+ " " + scope.etiquetas.lbSelMP*/).replace("<#accion>", scope.etiquetas.actConfirMP.toLowerCase()) : scope.etiquetas.msgActionSuccess.replace("<#artDuo>", scope.artDuoTexto).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase() /*+ " " + scope.etiquetas.lbSelM*/).replace("<#accion>", scope.etiquetas.actConfirM.toLowerCase()));

                        scope.stGestionarDuo.reload({
                            callback: function () {
                                Ext.MessageBox.hide();
                                mostrarMensaje(1, msg);
                                scope.arrayValues = new Array();
                                scope.smGestionarDuo.clearSelections();
                                scope.objWindowsDuo = '';
                                scope.btnAdicionarDuo.focus();
                            }
                        });
                    }
                    else
                        mostrarMensaje(1, scope.etiquetas.lbError);
                }
            });
        };

        this.createToolTip = function (v, m, r) {
            var numContrato = (r.data.numerocontrato) ? r.data.numerocontrato : scope.etiquetas.lbExcepcional;
            m.attr = ' ext:qtip="';
            if (!Ext.isEmpty(r.data.denominacion))
                m.attr += '<b>' + scope.etiquetas.lbTipoDoc + ': </b>' + r.data.denominacion + '</br>';
            if (!Ext.isEmpty(r.data.numero))
                m.attr += '<b>' + scope.etiquetas.lbNumDocumento + ': </b>' + r.data.numero + '</br>';
            m.attr += '<b>' + scope.etiquetas.lbNumContrato + ': </b>' + numContrato + '</br>';
            if (!Ext.isEmpty(r.data.fechaentrega))
                m.attr += '<b>' + scope.nombreFecha + ': </b>' + r.data.fechaentrega + '</br>';
            if (!Ext.isEmpty(r.data.fechaemision))
                m.attr += '<b>' + scope.etiquetas.lbFechaEmision + ': </b>' + r.data.fechaemision + '</br>';
            if (!Ext.isEmpty(r.data.fecharecepcion) && scope.confFechaRecepcion)
                m.attr += '<b>' + scope.etiquetas.lbFechaRecepcion + ': </b>' + r.data.fecharecepcion + '</br>';
            if (!Ext.isEmpty(r.data.nombrecliente))
                m.attr += '<b>' + scope.nombreCliente.replace(/"/gi, '') + ': </b>' + r.data.nombrecliente.replace(/"/gi, '') + '</br>';
            if (!Ext.isEmpty(r.data.text))
                m.attr += '<b>' + scope.etiquetas.lbCuenta + ': </b>' + r.data.text + '</br>';
            if (!Ext.isEmpty(r.data.tipoCuentaPrimerNivel))
                m.attr += '<b>' + 'Tipo de cuenta' + ': </b>' + r.data.tipoCuentaPrimerNivel + '</br>';
            if (!Ext.isEmpty(r.data.comentario))
                m.attr += '<b>' + scope.etiquetas.lbDetalle + ': </b>' + r.data.comentario + '</br>';
            if (!isNaN(parseFloat(r.data.importemb)))
                m.attr += '<b>' + scope.etiquetas.lbImporte + ': </b>' + r.data.importemb + '</br>';
            if (!isNaN(parseFloat(r.data.liquidadomb)))
                m.attr += '<b>' + 'Liquidado' + ': </b>' + r.data.liquidadomb + '</br>';
            if (!Ext.isEmpty(r.data.especialidad) && scope.confEspecialidad)
                m.attr += '<b>' + scope.etiquetas.lbEspecialidad + ': </b>' + r.data.especialidad + '</br>';
            if (!Ext.isEmpty(r.data.numcomprobante))
                m.attr += '<b>' + scope.etiquetas.lbNoComprobante + ': </b>' + r.data.numcomprobante + '</br>';
            if (!Ext.isEmpty(r.data.vence))
                m.attr += '<b>' + 'Vence' + ': </b>' + r.data.vence + ' d&iacute;as' + '</br>';
            m.attr += '"';
            return v;
        };

        this.fGetSelectionsOnPaging = function () {
            // instance = new PagingToolbarSelections({
            //     'selections': Ext.getCmp('gpGestionarDuo').getSelectionModel().getSelections(),
            //     'activePage': Ext.getCmp('gpGestionarDuo').getBottomToolbar().getPageData().activePage
            // });
            // return instance.getSelectionsOnArray(scope.arrayValues);
            var selections = Ext.getCmp('gpGestionarDuo').getSelectionModel().getSelections();
            var temp = [];
            selections.forEach(function (element, index, arr) {
                temp.push(element.data);
            });
            return temp;
        };

        this.fShowVerDuo = function () {
            scope.loadMask('Cargando...');
            var arrayDuo = new Array();
            arrayDuo = scope.fGetSelectionsOnPaging();

            parametros = {
                tipoDuo: scope.tipoDuo,
                arrayDuo: arrayDuo,
                url: scope.url,
                confEspecialidad: scope.confEspecialidad,
                textDuo: scope.tipoDuoTexto,
                textDuoP: scope.tipoDuoTextoPlural,
                artTexto: scope.artDuoTexto,
                artTextoP: scope.artDuoTextoP
            };

            if (!this.objWindowsDuo)
                this.objWindowsDuo = new Ext.ClassVerDuo(scope.etiquetas, parametros);

            this.objWindowsDuo.addListener('closeVer', function (cancel, infoAgrupada, params) {
                scope.objWindowsDuo = '';
                scope.btnAdicionarDuo.focus();
            });
        };

        this.fShowExpDuo = function () {
            var arrayDuo = scope.fGetSelectionsOnPaging();
            var idestado = 0;
            if (arrayDuo[0].idestadodocumento == 4 && arrayDuo[0].pendienteliq != 0) {
                idestado = 1;
            }
            var win = new Ext.ExpDuo.Gest({
                idderechouobligacion: arrayDuo[0].idderechouobligacion,
                idestadoduo: idestado,
                fechaActual: scope.fechaContable,
                fechaFin: scope.hasta
            });
            win.show();
        };

        /**
         * Funcion que muestra una notifico
         */
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
    },
    initializeKeyMap: function (scope) {

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
            if (scope.objWindowsDuo == '' && !scope.btnAdicionarDuo.disabled  && !scope.btnAdicionarDuo.hidden)
                scope.btnAdicionarDuo.handler.call();
        }, Ext.getBody());

        //MODIFICAR
        this.map.accessKey({
            key: 'm',
            alt: true
        }, function () {
            if (scope.objWindowsDuo == '' && !scope.btnModificarDuo.disabled  && !scope.btnModificarDuo.hidden)
                if (scope.smGestionarDuo.getSelected() /*&& scope.smGestionarDuo.getSelected().data.idestadodocumento == 2 */ && scope.smGestionarDuo.getSelected().data.idsubsistema == 6)
                    scope.btnModificarDuo.handler.call();
        }, Ext.getBody());

        //ELIMINAR
        this.map.accessKey({
            key: Ext.EventObject.DELETE
        }, function () {
            if (scope.objWindowsDuo == '' && !scope.btnEliminarDuo.disabled  && !scope.btnEliminarDuo.hidden)
                if (scope.fGetSelectionsOnPaging().length > 0 && (scope.smGestionarDuo.getSelected().data.idestadodocumento == 2 || scope.smGestionarDuo.getSelected().data.idestadodocumento == 3) && scope.smGestionarDuo.getSelected().data.idsubsistema == 6)
                    scope.btnEliminarDuo.handler.call();
        }, Ext.getBody());

        //CANCELAR
        this.map.accessKey({
            key: 'x',
            alt: true
        }, function () {
            if (scope.aperturado) {
                if (scope.objWindowsDuo == '' && !scope.btnCancelarDuo.disabled  && !scope.btnCancelarDuo.hidden)
                    if (scope.fGetSelectionsOnPaging().length > 0 && scope.smGestionarDuo.getSelected().data.idestadodocumento == 4)
                        scope.btnCancelarDuo.handler.call();
            }
        }, Ext.getBody());

        //CONFIRMAR
        this.map.accessKey({
            key: 'f',
            alt: true
        }, function () {
            if (scope.aperturado) {
                if (scope.objWindowsDuo == '' && !scope.btnConfirmarDuo.disabled  && !scope.btnConfirmarDuo.hidden)
                    if (scope.fGetSelectionsOnPaging().length > 0 && scope.smGestionarDuo.getSelected().data.idestadodocumento == 2)
                        scope.btnConfirmarDuo.handler.call();
            }
        }, Ext.getBody());

        //CONTABILIZAR
        this.map.accessKey({
            key: 't',
            alt: true
        }, function () {
            if (scope.aperturado) {
                if (scope.objWindowsDuo == '' && !scope.btnContabilizarDuo.disabled  && !scope.btnContabilizarDuo.hidden)
                    if (scope.fGetSelectionsOnPaging().length > 0 && scope.smGestionarDuo.getSelected().data.idestadodocumento == 3) //NO DEBE SER ESTA VALIDACION CON RESPECTO AL SMGESTIONARDUO
                        scope.btnContabilizarDuo.handler.call();
            }
        }, Ext.getBody());

        //LIQUIDAR
        this.map.accessKey({
            key: 'l',
            alt: true
        }, function () {
            if (scope.aperturado) {
                if (scope.objWindowsDuo == '' && !scope.btnLiquidarDuo.disabled  && !scope.btnLiquidarDuo.hidden)
                    if (scope.fGetSelectionsOnPaging().length == 1 && scope.smGestionarDuo.getSelected().data.idestadodocumento == 4 && scope.smGestionarDuo.getSelected().data.pendienteliq > 0)
                        scope.btnLiquidarDuo.handler.call();
            }
        }, Ext.getBody());

        //LIQUIDAR MULTIPLE
        this.map.accessKey({
            key: 'l',
            ctrl: true
        }, function () {
            if (scope.aperturado) {
                if (scope.objWindowsDuo == '' && !scope.btnLiquidar2Duo.disabled  && !scope.btnLiquidar2Duo.hidden)
                    // if (scope.fGetSelectionsOnPaging().length == 1 && scope.smGestionarDuo.getSelected().data.idestadodocumento == 4 && scope.smGestionarDuo.getSelected().data.pendienteliq > 0)
                        scope.btnLiquidar2Duo.handler.call();
            }
        }, Ext.getBody());

        //CANCELAR LIQUIDACION
        this.map.accessKey({
            key: 'x',
            ctrl: true
        }, function () {
            if (scope.aperturado) {
                if (scope.objWindowsDuo == '' && !scope.btnCancelarLiquidacionByClienteProveedorDuo.disabled  && !scope.btnCancelarLiquidacionByClienteProveedorDuo.hidden)
                    // if (scope.fGetSelectionsOnPaging().length == 1 && scope.smGestionarDuo.getSelected().data.idestadodocumento == 4 && scope.smGestionarDuo.getSelected().data.liquidadomb > 0) {
                    scope.btnCancelarLiquidacionByClienteProveedorDuo.handler.call();
                    // }
            }
        }, Ext.getBody());

        //VER
        this.map.accessKey({
            key: 'v',
            alt: true
        }, function () {
            if (scope.objWindowsDuo == '' && !scope.btnVerDuo.disabled  && !scope.btnVerDuo.hidden)
                scope.btnVerDuo.handler.call();
        }, Ext.getBody());

        //GRAFICAR
        this.map.accessKey({
            key: 'g',
            alt: true
        }, function () {
            if (scope.objWindowsDuo == '' && !scope.btnGraficarDuo.disabled  && !scope.btnGraficarDuo.hidden)
                scope.btnGraficarDuo.handler.call();
        }, Ext.getBody());

        //BUSCAR
        this.map.accessKey({
            key: 'b',
            alt: true
        }, function () {
            if (scope.objWindowsDuo == '' && !scope.btnBuscarDuo.disabled  && !scope.btnBuscarDuo.hidden)
                scope.btnBuscarDuo.handler.call();
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
            if (document.activeElement.tabIndex == 14)
                scope.objWindowsDuo.cbAddTipoDoc.focus(true, 10);
            else if (document.activeElement.tabIndex == 108)
                scope.objWindowsDuo.cbBuscarTipoDoc.focus(true, 10);
            else if (document.activeElement.tabIndex == 1)
                scope.objWindowsDuo.btnAddConfirmar.focus();
            else if (document.activeElement.tabIndex == 100)
                scope.objWindowsDuo.btnBuscarAceptar.focus();
        }, Ext.getBody());

    }
});
