Ext.namespace('Ext.ClassGestionarMov');
lMask = new Ext.LoadMask(Ext.getBody(), {
    msg: 'Cargando...'
});
Ext.ClassGestionarMov = Ext.extend(Ext.Component, {
    etiquetas: undefined,
    objWindowsMov: '',
    tipoMov: undefined,
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
    tipoMovTexto: undefined,
    confFechaRecepcion: false,
    artMovTexto: undefined,
    tipoMovTextoPlural: undefined,
    artMovTextoP: undefined,
    tipo_mov: new Array(1, 2, 4),
    idCbCaja: undefined,
    valueCbFondo: undefined,
    objMiWin: undefined,
    windowFuncionalidad: undefined,
    cagarInicial: undefined,
    url: '/contabilidad/caja/operaciones/index.php/movimiento/',
    constructor: function (params) {
        this.tipoMov = params;
        this.cargaInicial = params;
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        perfil = window.parent.perfil;

        if (!document.getElementById('UIGestionarMov'))
            this.loadJs("../../views/js/movimiento/GestionarMov/UIGestionarMov", 'UIGestionarMov');

        if (!document.getElementById('ClassAdicionarMov'))
            this.loadJs("../../views/js/movimiento/AdicionarMov/ClassAdicionarMov", 'ClassAdicionarMov');

        if (!document.getElementById('UIAdicionarMov'))
            this.loadJs("../../views/js/movimiento/AdicionarMov/UIAdicionarMov", 'UIAdicionarMov');

        if (!document.getElementById('ClassBuscarMov'))
            this.loadJs("../../views/js/movimiento/BuscarMov/ClassBuscarMov", 'ClassBuscarMov');

        if (!document.getElementById('UIBuscarMov'))
            this.loadJs("../../views/js/movimiento/BuscarMov/UIBuscarMov", 'UIBuscarMov');
//
//        if (!document.getElementById('ClassVerMov'))
//            this.loadJs("../../views/js/VerMov/ClassVerMov", 'ClassVerMov');
//
//        if (!document.getElementById('UIVerMov'))
//            this.loadJs("../../views/js/VerMov/UIVerMov", 'UIVerMov');
//
//        if (!document.getElementById('SCFPrintView'))
//            this.loadJs("/contabilidad/comun/SCFPrintView/views/js/SCFPrintView", 'SCFPrintView');

        if (!document.getElementById('CICancelacionController'))
            this.loadJs("/contabilidad/comun/componentes/CargaInicialCancelacion/CICancelacionController", 'CICancelacionController');

        this.stGestionarMov = new Ext.data.Store({//PASARLE EL BEFORELOAD DEL ORIGINAL
            url: this.url + 'loadDataMovGen',
            id:'idMovimientoreset',
            baseParams: {
                limit: 20,
                cargaInicial: scope.cargaInicial,
                params: undefined
            },
            reader: new Ext.data.JsonReader({
                id: 'reader',
                totalProperty: 'cantidad',
                root: 'datos'
            }, [{
                name: 'numero'
            }, {
                name: 'comentario'
            }, {
                name: 'idfondo'
            }, {
                name: 'nomfondo'
            }, {
                name: 'cargainicial'
            }, {
                name: 'denominacion'
            }, {
                name: 'fecha'
            }, {
                name: 'importemo',
                type: 'string'
            }, {
                name: 'importefaltante'
            }, {
                name: 'numcomprobante',
            }, {
                name: 'importemb',
                type: 'string'
            }, {
                name: 'estado'
            }, {
                name: 'idPersonaCajero'
            }, {
                name: 'id' /*este campo lo usa para mantener las selecciones entre paginas*/
            }, {
                name: 'idmovimiento'
            }, {// id moviento Generico
                name: 'iddocumento'
            }, {// id documento Generico
                name: 'idtipodocumento'
            }, {
                name: 'tipoDocumento'
            }, {// id documento
                name: 'idperiodo'
            }, {
                name: 'nombre'//Nombre de la persona que recibe
            }, {
                name: 'nombreCajero'//Nombre del cajero que realizo el movimiento
            }, {
                name: 'idoperacion'
            }, {
                name: 'tipoPersona'
            }, {
                name: 'idPersona'
            }, {
                name: 'ingresoEgreso'
            }, {
                name: 'nombrePersona'
            }, {
                name: 'idestadodoc',
                type: 'int'
            }, {
                name: 'showCmp',
            }, {
                name: 'idsubsistema',
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
    loadMessageBox: function (msg) {
        Ext.MessageBox.show({
            title: this.etiquetas.lbMsgEspere,
            msg: msg,
            width: 250,
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
                scope.tipoMovTexto = scope.etiquetas.lbMov;
                scope.loadDataIni(scope);
            }
        });
    },
    loadDataIni: function (scope) {
        this.loadMessageBox(scope.etiquetas.lbCargando);
        Ext.Ajax.request({
            url: 'loadDataIni',
            method: 'POST',
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                fechaContable = responseData.dataFecha.fechacontable;
                periodoActual = responseData.dataFecha.nombre;
                fechaInicio = responseData.dataFecha.inicio;
                fechaFin = responseData.dataFecha.fin;
                ejercicioActual = responseData.ejercicio;

                scope.initializeClass();

                if (!responseData.fondosConfig) {
                    mostrarMensaje(1, 'No existen fondos configurados para su usuario.');
                    Ext.getCmp('idPanelGeneral').disable();
                    Ext.MessageBox.hide();
                    return;
                }

                if (responseData.aperturado == 1 && scope.cargaInicial == 1) {//0=ci, 1=aperturado
                    //Ext.getCmp('idPanelGeneral').disable();
                    mostrarMensaje(1, scope.etiquetas.lbCargaInicialCerrada, function (btn) {
                        //if (btn == 'ok' || btn == 'cencel')
                            Ext.getCmp('idPanelGeneral').disable();
                    });
                    return;
                }
                if (responseData.aperturado != 1 && scope.cargaInicial != 1) {//0=ci, 1=aperturado
                    //Ext.getCmp('idPanelGeneral').disable();
                    mostrarMensaje(1, scope.etiquetas.lbCargaInicial, function (btn) {
                        //if (btn == 'ok' || btn == 'cencel')
                            Ext.getCmp('idPanelGeneral').disable();
                    });
                    return;
                }

                scope.lfdPeriodo.setText('Fecha contable: ' + fechaContable);
                // scope.lfdPeriodo.setText('Per\u00EDodo actual: ' + periodoActual + ' desde ' + fechaInicio + ' hasta ' + fechaFin + '|' + 'Fecha contable: ' + fechaContable);
                scope.MuestraWi_cajafondo(scope);
            }
        });
    },
    MuestraWi_cajafondo: function (scope) {
        this.loadMessageBox(scope.etiquetas.lbCargando);
        var objCajaFondo = scope.objCajaFondo = new Caja.CajaFondo.WindowCajaFondo({
            showCbMov: true,
            showWinMod: (scope.idFondo != undefined) ? true : false,
            tipoMov: new Array(1, 2) //1-Egreso, 2-Ingreso
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

                scope.stGestionarMov.removeAll();
                scope.initializeDataIni(scope);
                Ext.MessageBox.hide();
            },
            close: function () {
                scope.objCajaFondo = '';
                Ext.MessageBox.hide();
            }
        });
    },
    initializeClass: function () {
        this.ViewPort = new Ext.UIGestionarMov.ViewPort(this, {
            items: [this.pnlContenedor = new Ext.UIGestionarMov.pnlContenedor(this, this.nombreComponente)]
        });
        //this.initializeDataIni(this);
        this.initializeEvents(this);
        this.initializeFunctions(this);
        this.initializeKeyMap(this);
        return Ext.ClassGestionarMov.superclass.constructor.call(this);
    },
    initializeDataIni: function (scope) {
        if (scope.valueCbFondo != undefined)
            this.tfFondoActual.setRawValue(scope.valueCbFondo);
        scope.stGestionarMov.baseParams.idcajafondo = scope.idCajaFondo;
        scope.ptRegistroMov.changePage(0);

        scope.btnAyuda.setVisible(!scope.cargaInicial);
        scope.btnAyudaCI.setVisible(scope.cargaInicial);
        if (scope.idFondo) {
            scope.btnAdicionarMov.setVisible(true);
            scope.btnModificarMov.setVisible(true);
            scope.btnCancelarMov.setVisible(true && !scope.cargaInicial);
            scope.btnEliminarMov.setVisible(scope.cargaInicial);
            scope.btnConfirmarMov.setVisible(true && !scope.cargaInicial);
            scope.btnContabilizarMov.setVisible(true && !scope.cargaInicial);
            // scope.gpGestionarMov.getColumnModel().setHidden(scope.gpGestionarMov.getColumnModel().getIndexById('fondoAsociado'), true);
            //scope.gpGestionarMov.getColumnModel().setHidden(scope.gpGestionarMov.getColumnModel().getIndexById('recibidoPor'), true);
        } else {
            scope.btnAdicionarMov.setVisible(false);
            scope.btnModificarMov.setVisible(false);
            scope.btnCancelarMov.setVisible(false);
            scope.btnEliminarMov.setVisible(false);
            scope.btnConfirmarMov.setVisible(false);
            scope.btnContabilizarMov.setVisible(false);
            // scope.gpGestionarMov.getColumnModel().setHidden(scope.gpGestionarMov.getColumnModel().getIndexById('fondoAsociado'), false);
            //scope.gpGestionarMov.getColumnModel().setHidden(scope.gpGestionarMov.getColumnModel().getIndexById('recibidoPor'), false);
        }
    },
    initializeEvents: function (scope) {
        this.btnDefinirFondo.setHandler(function () {
            scope.MuestraWi_cajafondo(scope);
        }, scope);

        this.btnAdicionarMov.setHandler(function () {
            scope.fShowAdicionarMov(1);
        }, scope);

        this.btnModificarMov.setHandler(function () {
            scope.fShowAdicionarMov(2, scope.gpRegistroMov.getSelectionModel().getSelected());
        }, scope);

        this.btnCancelarMov.setHandler(function () {
            scope.fShowCancelarMov();
        }, scope);

        this.btnEliminarMov.setHandler(function () {
            scope.fShowEliminarMov();
        }, scope);

        this.btnConfirmarMov.setHandler(function () {
            scope.fShowConfirmarMov();
        }, scope);

        this.btnContabilizarMov.setHandler(function () {
            scope.fShowContabilizarMov();
        }, scope);
        this.btnImportar.setHandler(function () {
            scope.fConfigurarImportar ();
        }, scope);

        this.btnReporte.setHandler(function () {
            scope.fShowReporte();
        }, scope);

        this.btnVerMov.setHandler(function () {
            scope.fShowVerMov();
        }, scope);

        this.btnBuscarMov.setHandler(function () {
            scope.fShowBuscarMov();
        }, scope);

        this.btnGraficarMov.setHandler(function () {
            scope.fGraphMov();
        }, scope);

        this.menuItemMod.on({
            click: function () {
                scope.btnModificarMov.handler.call();
            }
        });

        this.menuItemEliminar.on({
            click: function () {
                scope.btnEliminarMov.handler.call();
            }
        });

        this.menuItemCancel.on({
            click: function () {
                scope.btnCancelarMov.handler.call();
            }
        });
        this.menuItemConfirm.on({
            click: function () {
                scope.btnConfirmarMov.handler.call();
            }
        });

        this.menuItemContab.on({
            click: function () {
                scope.btnContabilizarMov.handler.call();
            }
        });

        this.menuItemVer.on({
            click: function () {
                scope.btnVerMov.handler.call();
            }
        });

        // Menu contextual
        this.gpRegistroMov.on({
            rowcontextmenu: function (grid, rowIndex, eventObject) {
                eventObject.stopEvent();
                grid.getSelectionModel().selectRow(rowIndex);
                scope.menuItemMod.setVisible(scope.idFondo && !scope.btnModificarMov.disabled);
                scope.menuItemCancel.setVisible(scope.idFondo && !scope.btnCancelarMov.disabled && !scope.cargaInicial);
                scope.menuItemEliminar.setVisible(scope.idFondo && !scope.btnEliminarMov.disabled && scope.cargaInicial);
                scope.menuItemConfirm.setVisible(scope.idFondo && !scope.btnConfirmarMov.disabled && !scope.cargaInicial);
                scope.menuItemContab.setVisible(scope.idFondo && !scope.btnContabilizarMov.disabled && !scope.cargaInicial);
                scope.menuItemVer.setVisible(!scope.btnVerMov.disabled);
                scope.menuContextual.showAt(eventObject.getXY());
            },
            rowdblclick: function (grid, rowIndex) {//Ver Informacion
                scope.fShowAdicionarMov(2, grid.getSelectionModel().getSelected());
            }
        });

        this.rowaction.on({
            action: function (grid, recordarray, icon, rowindex, colindex) {
                scope.fShowReporteComprobante();
            },
            beforeaction: function (grid, rowIndex) {
            }
        });

        // this.ptRegistroMov.on('beforechange', function () {
        //     instance = new PagingToolbarSelections({
        //         'selections': scope.gpRegistroMov.getSelectionModel().getSelections(),
        //         'activePage': this.getPageData().activePage
        //     });
        //     instance.saveSelectionsOnPage(scope.arrayValues);
        // });

        // this.ptRegistroMov.on('change', function () {
        //     instance = new PagingToolbarSelections({
        //         'activePage': this.getPageData().activePage
        //     });
        //     instance.setSelectionsOnPage(scope.arrayValues, scope.gpRegistroMov);
        // });
//-------------------------------------------
        Caja.Componentes.cbPeriodo.on({
            scope: this,
            select: function (cb, record) {
                // this.stGestionarMov.reload();
                this.ptRegistroMov.changePage(0);
            }
        });
//-------------------------------------------
        this.stGestionarMov.on({
            scope: this,
            beforeload: function () {
                //lMask.show();
                this.stGestionarMov.baseParams.idcajafondo = scope.idCajaFondo;
                this.stGestionarMov.baseParams.idPeriodo = Caja.Componentes.cbPeriodo.getValue();
                this.stGestionarMov.baseParams.cargaInicial = scope.cargaInicial;
                if (this.smGestionarMov.hasSelection())
                    this.idSelected = this.smGestionarMov.getSelected().data.idmovimiento;
                else this.idSelected = null;
                this.smGestionarMov.clearSelections();
            },
            load: function (options, records) {
                lMask.hide();
                if (!options.baseParams.numerodocumento)
                    this.tfNumero.reset();
                if (!options.baseParams.idestadodoc)
                    this.tfEstado.reset();
                if (!options.baseParams.idestadodoc && !options.baseParams.numerodocumento)
                    this.btnBuscar.disable();
                //Mensaje cuando no encuentra datos al buscar
                if (!records.length) {
                    if (options.baseParams.numero && options.baseParams.idestadodoc)
                        mostrarMensaje(1, scope.etiquetas.lbNoDatosPorCriterios);
                    else if (options.baseParams.numerodocumento || options.baseParams.idestadodoc)
                        mostrarMensaje(1, scope.etiquetas.lbNoDatosPorCriterio);
                    else mostrarMensaje(1, scope.etiquetas.lbNoDatos);
                    this.btnReporte.disable();
                }
                if (this.idSelected) {
                    var index = this.stGestionarMov.find('idmovimiento', this.idSelected);
                    this.smGestionarMov.selectRow(index);
                } else {
                    this.smGestionarMov.selectFirstRow();
                }
            }
        });

        //Evento para lso filtros de buscar
        this.tfNumero.on({
            scope: this,
            keypress: function (field, e) {
                if (e.getKey() == 13 && field.getValue() != '') {
                    this.btnBuscar.fireEvent('click');
                }
            },
            keyup: function (field, e) {
                if (field.getValue() == '' && !this.tfEstado.getValue()) {
                    this.btnBuscar.disable();
                    /*if ((e.getKey() == 46 || e.getKey() == 8)) {
                     this.stGestionarMov.baseParams = {};
                     this.stGestionarMov.load();
                     }*/
                } else this.btnBuscar.enable();
            }
        });

        this.tfEstado.on({
            scope: this,
            select: function () {
                this.btnBuscar.enable()
            },
            keypress: function (field, e) {
                if (e.getKey() == 46 || e.getKey() == 8) {
                    field.clearValue();
                    if (this.tfNumero.getValue() == '') {
                        this.btnBuscar.disable();
                        this.stGestionarMov.baseParams = {};
                        this.stGestionarMov.baseParams.idcajafondo = scope.idCajaFondo;
                        this.stGestionarMov.load();
                    }
                }
                if (e.getKey() == 13) {
                    this.btnBuscar.fireEvent('click');
                }
            }
        });

        this.btnBuscar.on({
            scope: this,
            click: function (tf, e) {
                this.stGestionarMov.baseParams = {
                    numerodocumento: this.tfNumero.getValue(),
                    idestadodoc: this.tfEstado.getValue()
                }
                this.stGestionarMov.reload();
            }
        });
        //------------------
    },
    initializeFunctions: function (scope) {
        this.fNroDocConcatenados = function () {
            var arrayMov = new Array();
            arrayMov = scope.fGetSelectionsOnPaging();
            var facturas = '';
            for (var v = 0; v < arrayMov.length; v++) {
                facturas += arrayMov[v].numerodocumento;
                if (v < arrayMov.length - 1)
                    facturas += ';  ';
            }
            facturas += '<br>' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            return facturas;
        };

        this.fShowConfirmarMov = function (idDocumento, fnConfirmar) {
            var arregloSelect = new Array();
            if (idDocumento) {
                arregloSelect.push({'iddocumento': idDocumento})
            } else {
                arregloSelect = scope.fGetSelectionsOnPaging();
            }
            arregloSelect = (!Ext.isArray(arregloSelect)) ? [arregloSelect] : arregloSelect;
            scope.objWindowsMov = arregloSelect;

            var arrayMov = scope.fGetSelectionsOnPaging();
            if (arrayMov.length > 1)
                var msg = scope.etiquetas.lbConfirmConfVarios;
            else
                var msg = scope.etiquetas.lbConfirmConfUno;

            keyMap.disable();
            mostrarMensaje(2, msg, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.fConfirmarMov(arregloSelect, fnConfirmar);
                } else {
                    scope.btnAdicionarMov.focus();
                    scope.objWindowsMov = '';
                }
                if (btnPress === 'cancel')
                    keyMap.enable();
            });
        };

        this.fShowMessage = function (title, messageAction, functionAction) {
            keyMap.disable();
            Ext.Msg.show({
                title: scope.etiquetas.lbMessageConfirmacion, //title,
                buttons: Ext.Msg.OKCANCEL,
                msg: messageAction,
                icon: Ext.MessageBox.QUESTION,
                fn: functionAction
            });
        };

        this.fShowBuscarMov = function () {
            parametros = {
                cargaInicial: scope.cargaInicial,
                idCajaFondo: scope.idCajaFondo,
                url: scope.url
            };

            this.loadMessageBox(scope.etiquetas.lbMsgLoadData);//'Cargando datos para b&uacute;squedas...');
            if (!this.objWindowsMov)
                this.objWindowsMov = new Ext.ClassBuscarMov(scope.etiquetas, parametros);

            this.objWindowsMov.addListener('closeBuscar', function (cancel, infoAgrupada, params) {
                scope.objWindowsMov = '';
                //lMask.show();
                scope.stGestionarMov.reload({
                    callback: function () {
                        lMask.hide();
                        scope.btnAdicionarMov.focus();
                    }
                });
            });

            this.objWindowsMov.addListener('buscarMov', function (params) {
                scope.objWindowsMov = '';
                scope.stGestionarMov.baseParams.start = '';
                scope.stGestionarMov.baseParams.limit = '';
                scope.stGestionarMov.baseParams.numerodocumento = params.numerodocumento;
                scope.stGestionarMov.baseParams.iddoc = params.iddoc;
                scope.stGestionarMov.baseParams.idestadodoc = params.idestadodoc;
                scope.stGestionarMov.baseParams.importe = params.importe;
                scope.stGestionarMov.baseParams.idcliente = params.idcliente;
                scope.stGestionarMov.baseParams.numCO = params.numCO;
                scope.stGestionarMov.baseParams.idespecialidad = params.idespecialidad;
                scope.stGestionarMov.baseParams.tipofecha = params.tipofecha;
                scope.stGestionarMov.baseParams.fechainicio = params.fechainicio;
                scope.stGestionarMov.baseParams.fechafin = params.fechafin;
                scope.stGestionarMov.baseParams.idPeriodo = params.idPeriodo;
                scope.stGestionarMov.removeAll();
                scope.stGestionarMov.load({
                    callback: function (options, success, response) {
                        /*mensaje = 'No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.';
                        title = 'Informaci&oacute;n';
                        if (scope.stGestionarMov.getCount() === 0)
                            mostrarMensaje(1, mensaje);*/
                        //scope.notifyEvent(Ext.getCmp('gpGestionarMov').body.dom, title, mensaje, 1, 3000);
                        scope.btnAdicionarMov.focus();
                    }
                });
            });
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

        this.fShowCancelarMov = function () {
            title = scope.etiquetas.lbBtnContabilizar;
            var arrayMov = scope.fGetSelectionsOnPaging();
            if (arrayMov.length > 1)
                messageAction = scope.etiquetas.lbActionCancelarVarios;
            else messageAction = scope.etiquetas.lbActionCancelarUno;

            functionAction = scope.fShowWindowCancelarMov;
            scope.fShowMessage(title, messageAction, functionAction);
        };

        this.fShowEliminarMov = function () {

            var arrayMov = scope.fGetSelectionsOnPaging();
            if (arrayMov.length > 1)
                var mensageEliminar = scope.etiquetas.lbActionEliminarVarios;
            else
                var mensageEliminar = scope.etiquetas.lbActionEliminarUno;

            mostrarMensaje(2, mensageEliminar, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.fEliminarMov();
                } else {
                    scope.btnAdicionarMov.focus();
                    scope.objWindowsMov = '';
                }
                if (btnPress === 'cancel')
                    keyMap.enable();
            });
        };

        this.fShowWindowCancelarMov = function (btn) {
            keyMap.disable();
            scope.btnCancelarMov.disable();
            if (btn == 'ok') {
                var windowCancelar = new Ext.UIGestionarMov.windowCancelar(scope, scope.gpRegistroMov.getSelectionModel().getSelected().data.fecha);
                windowCancelar.show();
            } else {
                scope.objWindowsMov = '';
                scope.btnAdicionarMov.focus();
            }
            if (btn === 'cancel') {
                keyMap.enable();
                scope.btnCancelarMov.enable();
            }
        };

        this.fShowAdicionarMov = function (action, dataDoc) {
            parametros = {
                cargaInicial: scope.cargaInicial, // AKI VA EL PARAMETRO QUE ENVIO DE ClassGestionarDerechoCobro CON EL VALOR DE LA INTERFAZ EN LA CUAL ESTOY TRABAJANDO (1, 2, 3, 4)
                action: action,//1 EN CASO DE ADICIONAR Y 2 EN CASO DE MODIFICAR
                url: scope.url,
                idFondo: scope.idFondo,
                idCaja: scope.idCaja,
                idCajaFondo: scope.idCajaFondo,
                idMoneda: scope.idMoneda,
                confFechaRecepcion: scope.confFechaRecepcion,
                textMov: scope.tipoMovTexto,
                textMovPlural: scope.tipoMovTextoPlural,
                artTexto: scope.artMovTexto,
                artTextoP: scope.artMovTextoP,
                verInfo: false//Vista Informativa
            };
            if (dataDoc) {
                parametros.idMovGen = dataDoc.data.idmovimiento;
                parametros.dataDoc = dataDoc;
                parametros.idDoc = dataDoc.data.iddocumento;
                parametros.tipoPersona = dataDoc.data.tipoPersona;
                parametros.idPersona = dataDoc.data.idPersona;
                parametros.verInfo = dataDoc.data.idestadodoc == 8 ? false : true;//Solo Vista Informativa
            }
            parametros.scopeGestionarMov = this;
            parametros.tipoMovimiento = scope.tipoMovimiento;
            parametros.idFormaPago = scope.idFormaPago;

            this.loadMessageBox(scope.etiquetas.lbMsgLoadData);//'Cargando...');

            if (!this.objWindowsMov)
                this.objWindowsMov = new Ext.ClassAdicionarMov(scope.etiquetas, parametros);

            this.objWindowsMov.addListener('closeAdicionar', function (cancel, infoAgrupada, params) {
                scope.objWindowsMov = '';
                //lMask.show();
                scope.stGestionarMov.cargaInicial = scope.cargaInicial;
                scope.stGestionarMov.reload({
                    callback: function (options, success, response) {
                        lMask.hide();
                        scope.btnAdicionarMov.focus();
                    }
                });
            });

            this.objWindowsMov.addListener('contabilizarMov', function (idMov) {
                scope.fShowContabilizarMov(idMov);
            });

        };

        this.fTest = function () {
            var comp = new Ext.aux.Multiselect({
                baseUrl: 'contabilidad/cobros_pagos/derechouobligacion/index.php/gestionarMov/',
                url: 'test',
                autoLoad: true
            });

            var w = new Ext.Window({
                modal: true,
                id: 'winTrasp',
                frame: true,
                border: false,
                resizable: false,
                layout: 'border',
                closable: false,
                title: 'Test',
                items: [comp]
            });

            w.show(Ext.getBody(), function () {
                this.maximize();
                this.doLayout();
            });
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

        this.fShowReporte = function () {
            keyMap.disable();
            Ext.Msg.wait(scope.etiquetas.lbCargando, scope.etiquetas.lbEspere);
            var data = scope.gpRegistroMov.getSelectionModel().getSelected().data;
            var arrayIdDoc = [];
            var arrayNumLetras = new Array();

            var arrayMov = scope.fGetSelectionsOnPaging();
            for (var v = 0; v < arrayMov.length; v++) {
                arrayIdDoc.push(arrayMov[v].iddocumento);
                var numIndex = arrayMov[v].importemo;
                var numImporte = convertir_a_letras(arrayMov[v].importemo);
                arrayNumLetras.push({importe: numIndex, numletra: numImporte});
            }

            Ext.Ajax.request({
                url: 'getDataReporte',
                method: 'POST',
                params: {
                    arrayIdDoc: Ext.encode(arrayIdDoc),
                    arrayNumLetras: Ext.encode(arrayNumLetras),
                    fecha: data.fecha,
                    ingresoEgreso: data.ingresoEgreso,
                    idCajaFondo: scope.idCajaFondo,
                    nomFondo: scope.valueCbFondo
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData) {
                        fOpenWindowReport(responseData);
                    } else {
                        keyMap.enable();
                    }
                    Ext.MessageBox.hide();
                }
            });
        };

        fOpenWindowReport = function (datosReporte) {
            defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
            datosReporte.datoCuerpo = scope.completeData(datosReporte.datoCuerpo);
            var printView = new SCFPrintView(datosReporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
            printView.on({
                close: function () {
                    keyMap.enable();
                }
            });
            printView.show();
        };

        this.fShowReporteComprobante = function () {
            Ext.Msg.wait(scope.etiquetas.lbCargando, scope.etiquetas.lbEspere);
            var arrayIdCmp = scope.gpRegistroMov.getSelectionModel().getSelected().json.arrayIdCmp;

            Ext.Ajax.request({
                url: "/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/registrodecomprobantes/" + 'obtenerDatosImprimirReporte',
                params: {
                    reporteParams: Ext.encode(arrayIdCmp)
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.dataSources.length > 0) {
                        fOpenWindowReportCmp({
                            datoGeneral: {
                                reporte: '100',
                                titulo: 'Comprobante de operaciones',
                            },
                            datoCuerpo: responseData.dataSources
                        });
                    }
                    Ext.MessageBox.hide();
                }
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

        this.completeData = function (data) {
            var totalALetras = 0;
            for (var i in data) {
                if (data[i].operacion === null)
                    totalALetras = data[i].importe;
            }
            var letras = convertir_a_letras(totalALetras);
            data[0].importeenletras = letras;
            return data;
        };
//-----------------
        this.fShowContabilizarMov = function (idDocumento, fnPostear) {
            keyMap.disable();
            scope.btnContabilizarMov.disable();
            //scope.objWindowsMov = 'Mov';

            if (scope.fDifEstados())
                scope.fShowMessageDifStatus();
            else {
                var arrayMov = scope.fGetSelectionsOnPaging();
                if (arrayMov.length > 1)
                    var mensageEliminar = scope.etiquetas.lbActionContabilizarVarios;
                else
                    var mensageEliminar = scope.etiquetas.lbActionContabilizarUno;

                mostrarMensaje(2, mensageEliminar, function (btnPress) {
                    if (btnPress === 'ok') {
                        scope.fShowComprobanteContabilizarMov(idDocumento, fnPostear);
                    } else {
                        scope.btnAdicionarMov.focus();
                        scope.objWindowsMov = '';
                    }
                    if (btnPress === 'cancel') {
                        keyMap.enable();
                        scope.btnContabilizarMov.enable();
                    }
                });
            }
        };
        this.fConfigurarImportar = function (){
            var self = this;
            //self.map.disable();
            if(scope.idFormaPago==2)
            {
                this.winImportCmp = new SCFPrintData(new Object(), "/contabilidad/comun/SCFPrintView/", {
                    reportType: "DISTRA_MOVIMIENTO",
                    typeAction: 'import',
                    idcajafondo:scope.idCajaFondo,
                    idcaja:scope.idCaja,
                    idtipoMovimiento: scope.tipoMovimiento,
                    idmoneda:scope.idMoneda
                });
            }
            else
            {
                this.winImportCmp = new SCFPrintData(new Object(), "/contabilidad/comun/SCFPrintView/", {
                    reportType: "DISTRA_MOVIMIENTO_EEFECTIVO",
                    typeAction: 'import',
                    idcajafondo:scope.idCajaFondo,
                    idcaja:scope.idCaja,
                    idtipoMovimiento: scope.tipoMovimiento,
                    idmoneda:scope.idMoneda
                });
            }

            this.winImportCmp.show();
            this.winImportCmp.doLayout();
            this.winImportCmp.on({
                'show': function() {
                    self.map.disable();
                },
                'close': function() {
                    //self.map.enable();
                    scope.stGestionarMov.load();
                }
            });
        };

        this.fShowComprobanteContabilizarMov = function (idDocumento, fnPostear) {
            parametros = {
                tipoContabilizacion: 1, //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
                actionContabiliza: 'contabilizar',
                url: 'addMovContabilizado',
                cargaInicial: scope.cargaInicial,
                idCajaFondo: scope.idCajaFondo,
                adicionarMov: 0,
                descripcion: 'Posteando movimiento: ',
                argainicial: 0,
                idDocumento: idDocumento,
                tipoMovimiento: scope.tipoMovimiento
            };
            scope.fLoadDataComprobante(parametros, fnPostear);
        };

        this.fShowComprobanteCancelarMov = function (idmotivo, fecha) {
            var arrayIdDoc = [];
            var arrayMov = new Array();
            arrayMov = scope.fGetSelectionsOnPaging();
            for (var v = 0; v < arrayMov.length; v++) {
                arrayIdDoc.push(arrayMov[v].iddocumento);
            }

            var params = {
                tipoContabilizacion: 2, //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
                actionContabiliza: 'contabilizar',
                url: 'cancelarMov',
                cargaInicial: scope.cargaInicial,
                idCajaFondo: scope.idCajaFondo,
                adicionarMov: 0,
                descripcion: 'Cancelando movimiento: ',
                idmotivo: idmotivo,
                fecha: fecha,
                tipoMovimiento: scope.tipoMovimiento
            };
            params.arrayIdDoc = arrayIdDoc;
            if (!this.fDifEstados() && arrayMov[0].idestadodoc == 6)
                scope.fLoadDataComprobante(params);
            else scope.fGuardarCancelOtros(params);
        };

        this.fLoadDataComprobante = function (params, fnPostear) {
            this.loadMessageBox(scope.etiquetas.lbLoadDataComprobante);
            var arrayIdDoc = [];
            if (params.idDocumento) {
                arrayIdDoc.push((params.idDocumento).toString());
            } else {
                var arrayMov = new Array();
                arrayMov = scope.fGetSelectionsOnPaging();
                for (var v = 0; v < arrayMov.length; v++)
                    arrayIdDoc.push(arrayMov[v].iddocumento);
            }
            params.arrayIdDoc = arrayIdDoc;
            if (params.tipoContabilizacion == 2 && arrayMov[0].cargainicial == 1) {
                Ext.MessageBox.hide();
                var vc = new Ext.CICancelacion.Controller({
                    idMoneda: scope.idMoneda,
                    idSubsistema: 14,
                    // funcionalidad: 2,//1-obligacion 2-anticipo
                    arrayIdObj: arrayIdDoc
                });

                vc.on({
                    scope: this,
                    cancelar: function (responseData) {
                        this.loadMessageBox(scope.etiquetas.lbLoadDataComprobante);
                        if (responseData.codM) {
                            if (responseData.codM == -1) {//Si tiene liquidaciones en el cobro anticipado que exista en algun instrumento
                                mostrarMensaje(1, String.format(scope.etiquetas.msgIsLiquidacionAnticipo, '<b>' + responseData.numDoc + '</b>'));
                                Ext.MessageBox.hide();
                            } else if (responseData.codM == -2) {
                                mostrarMensaje(1, scope.etiquetas.msgCambioEstado);
                                Ext.MessageBox.hide();
                            }
                        } else
                            scope.fShowComprobante(responseData, params);
                    }
                });

            } else {
                Ext.Ajax.request({
                    url: scope.url + 'loadDataComprobante',
                    method: 'POST',
                    params: {
                        arrayIdDoc: Ext.encode(arrayIdDoc),
                        tipoMovimiento: params.tipoMovimiento,
                        //idCajaFondo: params.idCajaFondo,
                        idCajaFondo: scope.idCajaFondo,
                        tipoContabilizacion: params.tipoContabilizacion,
                        idDocInst: params.idDocInst,
                        fecha: params.fecha
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codM) {
                            if (responseData.codM == -1) {//Si tiene liquidaciones en el cobro anticipado que exista en algun instrumento
                                mostrarMensaje(1, String.format(scope.etiquetas.msgIsLiquidacionAnticipo, '<b>' + responseData.numDoc + '</b>'));
                                Ext.MessageBox.hide();
                            } else if (responseData.codM == -2) {
                                mostrarMensaje(1, scope.etiquetas.msgCambioEstado);
                                Ext.MessageBox.hide();
                            }
                        } else
                            scope.fShowComprobante(responseData, params, fnPostear);
                    }
                });
            }

        };

        //Construir y mostrar el comprobante
        this.fShowComprobante = function (respData, params, fnPostear) {
            var idSubsistema = 14;//Caja
            var idTipoComprobante = 3;//comprobante tipo operaciones
            var descripcion = params.descripcion + respData.descripcion;
            var detalle = params.descripcion + respData.detalle;

            // Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                this.loadMessageBox(scope.etiquetas.lbGuardandoComprobante);
                if (params.tipoContabilizacion === 1)
                    this.fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, params, fnPostear);
                else
                    this.fGuardarComprobanteCancel(idComprobante, numComprobante, fechaComprobante, params);
            }.bind(this)).onClose(function () {
                noWindow = true;//para indicar que se cerro la ventana
                keyMap.enable();
                if (Ext.isEmpty(params.idDocInst)) {//Si no esta cancelando un instrumento
                    if (params.tipoContabilizacion === 1)//Posteando
                        scope.btnContabilizarMov.enable();
                    if (params.tipoContabilizacion === 2)//Cancelando
                        scope.btnCancelarMov.enable();
                }
            });
        };

        this.fGuardarComprobante = function (idComprobante, numeroComprobante, fechaComprobante, params, fnPostear) {
            Ext.Ajax.request({
                method: "POST",
                url: scope.url + parametros.url,
                params: {
                    cargaInicial: params.cargaInicial,
                    arrayIdDoc: Ext.encode(params.arrayIdDoc),
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    idDocInst: params.idDocInst
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (params.adicionarMov) {
                        Ext.getCmp('btnAddContabilizar').disable();
                        Ext.MessageBox.hide();
                        mostrarMensaje(1, scope.etiquetas.lbMsgContabilizado + ' ' + numeroComprobante + '.');
                    } else {
                        scope.stGestionarMov.reload({
                            callback: function (options, success, response) {
                                Ext.MessageBox.hide();
                                mostrarMensaje(1, scope.etiquetas.lbMsgContabilizado + ' ' + numeroComprobante + '.');
                                if (!params.adicionarMov)
                                    scope.objWindowsMov = '';
                            }
                        });
                    }
                    if (responseData.codM == 1) {
                        if (typeof fnPostear === 'function') {
                            fnPostear();
                        }
                    }
                }
            });
        };

        this.fGuardarComprobanteCancel = function (idComprobante, numeroComprobante, fechaComprobante, params) {
            Ext.Ajax.request({
                method: "POST",
                url: 'cancelMovContabilizado',
                params: {
                    arrayIdDoc: Ext.encode(params.arrayIdDoc),
                    idComprobante: idComprobante,
                    numComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    idCajaFondo: scope.idCajaFondo,
                    idmotivo: params.idmotivo,
                    fecha: params.fecha,
                    tipoMovimiento: scope.tipoMovimiento,
                    idDocInst: params.idDocInst
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codM == 1) {
                        if (params.idDocInst) {//Actualizar estado del instrumento que fue cancelado
                            params.record.set('hideCancel', true);
                            params.record.set('nomestado', 'Cancelado');
                            params.record.set('idestadodoc', 7);
                            mostrarMensaje(1, scope.etiquetas.lbMsgCancelComp + ' ' + numeroComprobante + '.');
                        } else {
                            scope.stGestionarMov.reload({
                                callback: function (options, success, response) {
                                    mostrarMensaje(1, scope.etiquetas.lbMsgCancelComp + ' ' + numeroComprobante + '.');
                                }
                            });
                        }
                    } else if (responseData.codM == -1) {
                        mostrarMensaje(1, scope.etiquetas.msgOcurrioUnError);
                    }
                    Ext.MessageBox.hide();
                }
            });
        };

        this.fGuardarCancelOtros = function (params) {
            Ext.Ajax.request({
                method: "POST",
                url: 'cancelarOtros',
                params: {
                    arrayIdDoc: Ext.encode(params.arrayIdDoc),
                    idmotivo: params.idmotivo,
                    fecha: params.fecha,
                    idCajaFondo: scope.idCajaFondo,
                    tipoMovimiento: scope.tipoMovimiento,
                    idDocInst: params.idDocInst
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    Ext.MessageBox.hide();
                    scope.stGestionarMov.reload({
                        callback: function (options, success, response) {
                            var arrayMov = scope.fGetSelectionsOnPaging();
                            if (arrayMov.length > 1)
                                mostrarMensaje(1, scope.etiquetas.lbMsgCancelVarios);
                            else
                                mostrarMensaje(1, scope.etiquetas.lbMsgCancelUno);
                        }
                    });
                    if (params.idDocInst) {//Actualizar estado del instrumento que fue cancelado
                        params.record.set('hideCancel', true);
                        params.record.set('nomestado', 'Cancelado');
                        params.record.set('idestadodoc', 7);
                    }
                }
            });
        };

        this.fGraphMov = function () {
            scope.loadMessageBox(scope.etiquetas.lbMsgLoadGraficar);//'Graficando por estados...');
            Ext.Ajax.request({
                url: scope.url + 'graficarPorEstados',
                method: 'POST',
                params: {
                    cargaInicial: scope.cargaInicial
                },
                callback: function (options, success, response) {
                    Ext.MessageBox.hide();
                    var w_graficar = new Ext.Window({
                        title: scope.etiquetas.titleGraphMov,
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

        scope.gpRegistroMov.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('idestadodoc') == 6)
                return 'FilaVerde';
            if (record.get('idestadodoc') == 7)
                return 'FilaRoja';
        };

        this.RowClick = function (sm, indiceFila, record) {
            var arrayMov = new Array();
            arrayMov = scope.fGetSelectionsOnPaging();

            scope.btnModificarMov.disable();
            scope.btnCancelarMov.disable();
            scope.btnConfirmarMov.disable();
            scope.btnContabilizarMov.disable();
            scope.btnEliminarMov.disable();
            scope.btnReporte.disable();
            if (arrayMov.length > 0) {
                if (!scope.fDifEstados()) {
                    if (arrayMov[0].idestadodoc != 7)
                        scope.btnReporte.enable();

                     // if (arrayMov[0].idestadodoc != 1 && arrayMov[0].idestadodoc != 7 && arrayMov[0].idestadodoc != 4 && arrayMov[0].idestadodoc != 3 && (arrayMov[0].cargainicial == 0 || scope.cargaInicial)) {
                     if ((arrayMov[0].idestadodoc != 1 && arrayMov[0].idestadodoc != 7 && arrayMov[0].idestadodoc != 4 && arrayMov[0].idestadodoc != 3) || scope.cargaInicial) {
                        scope.btnCancelarMov.enable();
                        scope.btnEliminarMov.enable();
                        if (arrayMov.length == 1 && arrayMov[0].idestadodoc == 8)
                            scope.btnModificarMov.enable();
                        if (arrayMov[0].idestadodoc == 8) {
                            scope.btnConfirmarMov.enable();
                        }
                        if (arrayMov[0].idestadodoc == 5)
                            scope.btnContabilizarMov.enable();
                    }
                }
            }
            return;
        };

        this.fDifEstados = function () {
            var flagDifEstados = false;
            var arrayMov = new Array();
            arrayMov = scope.fGetSelectionsOnPaging();
            for (var i = 0; i < arrayMov.length; i++) {
                for (var j = 0; j < arrayMov.length; j++) {
                    if (arrayMov[i].idestadodoc != arrayMov[j].idestadodoc || arrayMov[i].idsubsistema != 14) {
                        flagDifEstados = true;
                        break;
                    }
                }
            }
            return flagDifEstados;
        };

        this.fAceptar = function (btn) {
            if (btn == 'ok') {
                scope.sMovestionarMov.clearSelections();
                scope.arrayValues = new Array();
                keyMap.enable();
            }
            scope.objWindowsMov = '';
            if (btn === 'cancel')
                keyMap.enable();
        };

        /*this.fEliminarMov = function (btn) {
         if (btn == 'ok') {
         scope.loadMessageBox(scope.etiquetas.lbEliminando);
         var arrayIdMov = [];
         var arrayMov = new Array();
         arrayMov = scope.fGetSelectionsOnPaging();
         for (var i = 0; i < arrayMov.length; i++)
         arrayIdMov.push(arrayMov[i].idderechouobligacion);

         Ext.Ajax.request({
         url: scope.url + 'eliminarMov',
         method: 'POST',
         params: {
         arrayIdMov: Ext.encode(arrayIdMov)
         },
         callback: function (options, success, response) {
         responseData = Ext.decode(response.responseText);
         respuesta = responseData;//.valor;
         if (parseInt(respuesta) == 1) {
         scope.stGestionarMov.reload({
         callback: function () {
         Ext.MessageBox.hide();
         mostrarMensaje(1, scope.etiquetas.lbEliminadoSatisf);
         scope.arrayValues = new Array();
         scope.sMovestionarMov.clearSelections();
         scope.objWindowsMov = '';
         scope.btnAdicionarMov.focus();
         }
         });
         }
         else {
         mostrarMensaje(1, scope.etiquetas.lbError);
         Ext.MessageBox.hide();
         scope.btnAdicionarMov.focus();
         }
         }
         });
         }
         else {
         scope.objWindowsMov = '';
         scope.btnAdicionarMov.focus();
         }
         };*/

        this.fConfirmarMov = function (arreglomandar, fnConfirmar) {
            scope.loadMessageBox(scope.etiquetas.lbConfirmando);
            var arrayIdDoc = new Array();

            for (var i = 0; i < arreglomandar.length; i++) {
                arrayIdDoc.push((arreglomandar[i].iddocumento).toString());
            }

            Ext.Ajax.request({
                url: scope.url + 'confirmarmovimientogen',
                method: 'POST',
                params: {
                    arrayIdDoc: Ext.encode(arrayIdDoc)
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);

                    if (responseData.codM == 1) {
                        if (typeof fnConfirmar === 'function') {
                            fnConfirmar();
                            Ext.MessageBox.hide();
                            var arrayMov = scope.fGetSelectionsOnPaging();
                            if (arrayMov.length > 1)
                                mostrarMensaje(1, scope.etiquetas.lbConfirmVarios);
                            else
                                mostrarMensaje(1, scope.etiquetas.lbConfirmUno);
                        } else {
                            scope.stGestionarMov.reload({
                                callback: function () {
                                    Ext.MessageBox.hide();
                                    var arrayMov = scope.fGetSelectionsOnPaging();
                                    if (arrayMov.length > 1)
                                    mostrarMensaje(1, scope.etiquetas.lbConfirmVarios);
                                    else
                                    mostrarMensaje(1, scope.etiquetas.lbConfirmUno);
                                    scope.arrayValues = new Array();
                                    scope.smGestionarMov.clearSelections();
                                    scope.objWindowsMov = '';
                                    scope.btnAdicionarMov.focus();
                                }
                            });
                        }
                    } else {
                        mostrarMensaje(1, scope.etiquetas.lbError);
                        scope.btnAdicionarMov.focus();
                    }
                    keyMap.enable();
                }
            });
        };

        this.fEliminarMov = function () {
            scope.loadMessageBox(scope.etiquetas.lbEliminando);
            var arrayIdDoc = [];
            var arrayIdMov = [];
            arregloSelect = scope.fGetSelectionsOnPaging();

            for (var i = 0; i < arregloSelect.length; i++) {
                arrayIdDoc.push(arregloSelect[i].iddocumento);
                arrayIdMov.push(arregloSelect[i].idmovimiento);
            }

            Ext.Ajax.request({
                url: scope.url + 'eliminarMovimiento',
                method: 'POST',
                params: {
                    arrayIdDoc: Ext.encode(arrayIdDoc),
                    arrayIdMov: Ext.encode(arrayIdMov),
                    idCajaFondo: scope.idCajaFondo,
                    tipoMovimiento: scope.tipoMovimiento
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);

                    if (responseData.codM == 1) {
                        scope.stGestionarMov.reload({
                            callback: function () {
                                Ext.MessageBox.hide();
                                var arrayMov = scope.fGetSelectionsOnPaging();
                                if (arrayMov.length > 1)
                                    mostrarMensaje(1, scope.etiquetas.lbDeleteSatifVarios);
                                else
                                    mostrarMensaje(1, scope.etiquetas.lbDeleteSatifUno);

                                scope.arrayValues = new Array();
                                scope.smGestionarMov.clearSelections();
                                scope.objWindowsMov = '';
                                scope.btnAdicionarMov.focus();
                            }
                        });
                    } else {
                        mostrarMensaje(1, scope.etiquetas.lbError);
                        scope.btnAdicionarMov.focus();
                    }
                }
            });
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
            if (!Ext.isEmpty(r.data.numcomprobante))
                m.attr += '<b>' + scope.etiquetas.lbNoComprobante + ': </b>' + r.data.numcomprobante + '</br>';
            if (!Ext.isEmpty(r.data.comentario))
                m.attr += '<b>' + scope.etiquetas.lbDetalle + ': </b>' + r.data.comentario + '</br>';
            m.attr += '"';
            return v;
        };

        this.fGetSelectionsOnPaging = function () {
            instance = new PagingToolbarSelections({
                'selections': Ext.getCmp('gpGestionarMov').getSelectionModel().getSelections(),
                'activePage': Ext.getCmp('gpGestionarMov').getBottomToolbar().getPageData().activePage
            });
            return instance.getSelectionsOnArray(scope.arrayValues);
        };

        this.fShowVerMov = function () {
            this.loadMessageBox(scope.etiquetas.lbMsgLoadData);//'Cargando...');
            var arrayMov = new Array();
            arrayMov = scope.fGetSelectionsOnPaging();
            if (!this.objWindowsMov)
                this.objWindowsMov = new Ext.ClassVerMov(scope.cargaInicial, scope.etiquetas, arrayMov, scope.url);

            this.objWindowsMov.addListener('closeVer', function (cancel, infoAgrupada, params) {
                scope.objWindowsMov = '';
                lMask.show();
                scope.stGestionarMov.reload({
                    callback: function () {
                        lMask.hide();
                        scope.btnAdicionarMov.focus();
                    }
                });
            });
        };
    },
    initializeKeyMap: function (scope) {
        keyMap = new Ext.KeyMap(document, [
            {
                key: "i", //ADICIONAR
                alt: true,
                fn: function () {
                    if (scope.idFondo)
                        scope.btnAdicionarMov.handler.call();
                }
            }, {
                key: "m", //MODIFICAR
                alt: true,
                fn: function (n, e) {
                    e.preventDefault();
                    if (scope.idFondo && !scope.btnModificarMov.disabled)
                        scope.btnModificarMov.handler.call();
                }
            }, {
                key: "x", //CANCELAR
                alt: true,
                fn: function () {
                    if (scope.idFondo && !scope.btnCancelarMov.disabled && !scope.cargaInicial)
                        scope.btnCancelarMov.handler.call();
                }
            }, {
                key: Ext.EventObject.DELETE, //Eliminar
                fn: function () {
                    if (scope.idFondo && !scope.btnEliminarMov.disabled && scope.cargaInicial)
                        scope.btnCancelarMov.handler.call();
                }
            }, {
                key: "f", //CONFIRMAR
                alt: true,
                fn: function () {
                    if (scope.idFondo && !scope.btnConfirmarMov.disabled && !scope.cargaInicial)
                        scope.btnConfirmarMov.handler.call();
                }
            }, {
                key: "t", //CONTABILIZAR
                alt: true,
                fn: function () {
                    if (scope.idFondo && !scope.btnContabilizarMov.disabled && !scope.cargaInicial)
                        scope.btnContabilizarMov.handler.call();
                }
            }, {
                key: "v", //VER
                alt: true,
                fn: function () {
                    // scope.btnVerMov.handler.call();
                }
            }, {
                key: "g", //GRAFICAR
                alt: true,
                fn: function () {
                    // scope.btnGraficarMov.handler.call();
                }
            }, {
                key: "b", //BUSCAR
                alt: true,
                //shift: false,
                ctrl: false,
                fn: function () {
                    if (!scope.btnBuscar.disabled)
                        scope.btnBuscar.fireEvent('click');
                }
            }, {
                key: "b", //BUSCAR AVANZADO
                alt: true,
                //shift: true,
                ctrl: true,
                fn: function () {
                    if (!scope.cargaInicial)
                        scope.btnBuscarMov.handler.call();
                }
            }, {
                key: "r", //Vista Reporte
                alt: true,
                fn: function () {
                    if (!scope.btnReporte.disabled)
                        scope.btnReporte.handler.call();
                }
            }, {
                key: "h", //AYUDA
                alt: true,
                fn: function () {
                    //scope.btnAyuda.handler.call();
                }
            }
        ]);
    }
});
