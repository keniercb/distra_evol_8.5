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
    contabilizar: false, // opcion para contabilizar en la vista del comprobante...
    tipoDuoTexto: undefined,
    artDuoTexto: undefined,
    tipoDuoTextoPlural: undefined,
    artDuoTextoP: undefined,
    confEspecialidad: true,
    confFechaRecepcion: true,
    url: '/contabilidad/cobros_pagos/cargainicial/index.php/gestionarduo/',
    constructor: function (params) {
        //Ext.apply(this, params);
        this.tipoDuo = params;
        //this.classParams = params;

        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        perfil = window.parent.perfil;

        if (!document.getElementById('UIGestionarDuo'))
            this.loadJs("../../views/js/componentes/GestionarDuo/UIGestionarDuo", 'UIGestionarDuo');

        if (!document.getElementById('ClassAdicionarDuo'))
            this.loadJs("../../views/js/componentes/AdicionarDuo/ClassAdicionarDuo", 'ClassAdicionarDuo');

        if (!document.getElementById('UIAdicionarDuo'))
            this.loadJs("../../views/js/componentes/AdicionarDuo/UIAdicionarDuo", 'UIAdicionarDuo');

        if (!document.getElementById('ClassBuscarDuo'))
            this.loadJs("../../views/js/componentes/BuscarDuo/ClassBuscarDuo", 'ClassBuscarDuo');

        if (!document.getElementById('UIBuscarDuo'))
            this.loadJs("../../views/js/componentes/BuscarDuo/UIBuscarDuo", 'UIBuscarDuo');

        if (!document.getElementById('ClassCancelarDuo'))
            this.loadJs("../../views/js/componentes/CancelarDuo/ClassCancelarDuo", 'ClassCancelarDuo');

        if (!document.getElementById('UICancelarDuo'))
            this.loadJs("../../views/js/componentes/CancelarDuo/UICancelarDuo", 'UICancelarDuo');

        if (!document.getElementById('ClassVerDuo'))
            this.loadJs("../../views/js/componentes/VerDuo/ClassVerDuo", 'ClassVerDuo');

        if (!document.getElementById('UIVerDuo'))
            this.loadJs("../../views/js/componentes/VerDuo/UIVerDuo", 'UIVerDuo');

        /* Componente para importar */
        if (!document.getElementById('Ext.ux.UploadDialog.packed')) {
            this.loadJs("/contabilidad/comun/componentes/Upload/Ext.ux.UploadDialog.packed", 'Ext.ux.UploadDialog.packed');
        }

        /* Notificacion */
        if (!document.getElementById('Notification')) {
            this.loadJs("/contabilidad/comun/componentes/Notification/js/Ext.Cont.Notification", 'Notification');
        }

        this.stGestionarDuo = new Ext.data.Store({//PASARLE EL BEFORELOAD DEL ORIGINAL
            url: this.url + 'loadDataDuo',
            baseParams: {
                tipoduo: this.tipoDuo,
                limit: 20,
                params: undefined
            },
            reader: new Ext.data.JsonReader({
                id: 'reader',
                totalProperty: 'cantidad',
                root: 'datos'
            }, [{
                name: 'numero'
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
                name: 'comentario'
            }, {
                name: 'idderechouobligacion'
            }, {
                name: 'importemb',
                type: 'float'
            }, {
                name: 'pagadomb',
                type: 'float'
            }, {
                name: 'liquidadomb',
                type: 'float'
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
                name: 'idestructuracomun'
            }, {
                name: 'idperiodo'
            }, {
                name: 'version'
            }, {
                name: 'id'
            }, {
                name: 'idcuenta'
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
                name: 'estadodescripcion'
            }, {
                name: 'denominacion'
            }, {
                name: 'numcomprobante',
                type: 'int'
            }, {
                name: 'especialidad'
            }, {
                name: 'idespecialidad'
            }, {
                name: 'idsubsistema'
            }, {
                name: 'nombresubsistema'
            }, {
                name: 'fechacontable'
            }, {
                name: 'edad'
            }, {
                name: 'plazo',
            }, {
                name: 'idclienteproveedorcobropago',
            }, {
                name: 'cobrospagos',
                mapping: 'cuentasasociadascliente'
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
        //scope.objWindowsDuo = new Ext.MessageBox.show({
        //en cada window suscribirme a un evento pa levantar esta messagebox y otro evento para cerrarla para controlar el objWindowsDuo.
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
                }
                else if (scope.tipoDuo == 2) // (2) OBLIGACION DE PAGO
                {
                    scope.nombreCliente = scope.etiquetas.lbProveedor; //'Proveedor';
                    scope.nombreFecha = scope.etiquetas.lbFechaRecibo; //'Fecha recibo';
                    scope.nombreComponente = scope.etiquetas.lbVpTituloObligacion;//'Gestionar obligaci&oacute;n de pago';
                    scope.mascPrincipal = scope.etiquetas.lbCargandoObligacion;//'Cargando obligaciones de pago...'
                    scope.tipoDuoTexto = scope.etiquetas.lbObligacionPago;
                    scope.tipoDuoTextoPlural = scope.etiquetas.lbObligacionPagoP;
                    scope.artDuoTexto = scope.etiquetas.artFem;
                    scope.artDuoTextoP = scope.etiquetas.artFemP;
                }
                else if (scope.tipoDuo == 3) // (3) DERECHO FISCAL
                {
                    scope.nombreCliente = scope.etiquetas.lbParrafoFiscal; //'Proveedor';
                    scope.nombreComponente = scope.etiquetas.lbVpTituloDerechoF;//'Gestionar derecho fiscal';
                    scope.nombreFecha = scope.etiquetas.lbFechaEntrega; //'Fecha entrega';
                    scope.mascPrincipal = scope.etiquetas.lbCargandoDerechoF;//'Cargando derechos fiscales...'
                    scope.tipoDuoTexto = scope.etiquetas.lbDerechoFiscal;
                    scope.tipoDuoTextoPlural = scope.etiquetas.lbDerechoFiscalP;
                    scope.artDuoTexto = scope.etiquetas.artMas;
                    scope.artDuoTextoP = scope.etiquetas.artMasP;
                }
                else if (scope.tipoDuo == 4) // (4) OBLIGACION FISCAL
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
                    method: "POST",
                    url: 'loadTreeEspecialidad',
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        scope.confEspecialidad = (responseData.length > 0) ? true : false;

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
                limit: 20,
                params: undefined
            },
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.aperturado == 1) {//0=ci, 1=aperturado
                    scope.objWindowsDuo = 'ci';
                    mostrarMensaje(1, scope.etiquetas.lbOperCI);
                    Ext.getCmp('gpGestionarDuo').disable();
                }
                else if (responseData.cantidad > 0) {
                    scope.btnVerDuo.enable();
                    scope.stGestionarDuo.loadData(responseData);
                } else {
                    var message = (scope.stGestionarDuo.baseParams.searching) ? scope.etiquetas.msgNoMatchingData : ((scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.etiquetas.msgNoDataDuoToShowF.replace('<#tipoDuo>', scope.tipoDuoTextoPlural.toLowerCase()) : scope.etiquetas.msgNoDataDuoToShowM.replace('<#tipoDuo>', scope.tipoDuoTextoPlural.toLowerCase()));
                    //scope.notifyEvent(scope.gpRegistroDuo.body.dom, scope.etiquetas.titleInfo, message, 1, 3500);
                    mostrarMensaje(1, message);
                }
            }
        });
    },
    initializeEvents: function (scope) {
        this.stGestionarDuo.on({
            beforeload: function () {
                scope.loadMask('Cargando...');
            },
            load: function (store, records, options) {
                Ext.getBody().unmask();
                scope.btnModificarDuo.disable();
                scope.btnEliminarDuo.disable();
                if (records.length == 0) {
                    var message = (scope.stGestionarDuo.baseParams.searching) ? scope.etiquetas.msgNoMatchingData : ((scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.etiquetas.msgNoDataDuoToShowF.replace('<#tipoDuo>', scope.tipoDuoTextoPlural.toLowerCase()) : scope.etiquetas.msgNoDataDuoToShowM.replace('<#tipoDuo>', scope.tipoDuoTextoPlural.toLowerCase()));
                    //scope.notifyEvent(scope.gpRegistroDuo.body.dom, scope.etiquetas.titleInfo, message, 1, 3500);
                    mostrarMensaje(1, message);
                }
            }
        });
        this.btnAdicionarDuo.setHandler(function () {
            scope.fShowAdicionarDuo(1);
        });

        this.btnModificarDuo.setHandler(function () {
            scope.fShowAdicionarDuo(2, scope.gpRegistroDuo.getSelectionModel().getSelected().data.idderechouobligacion, scope.gpRegistroDuo.getSelectionModel().getSelected());
        });

        this.btnEliminarDuo.setHandler(function () {
            var selects = scope.fGetSelectionsOnPaging();
            scope.fShowEliminarDuo(selects);
        });

        this.btnVerDuo.setHandler(function () {
            scope.fShowVerDuo();
        });

        this.btnBuscarDuo.setHandler(function () {
            scope.fShowBuscarDuo();
        });

        this.btnImportarDuo.setHandler(function () {
            scope.fShowImportarDuo();
        });

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

//        this.menuItemVer.on({
//            click: function() {
//                scope.btnVerDuo.handler.call();
//            }
//        });

        /* Menu contextual */
        this.gpRegistroDuo.on({
            rowcontextmenu: function (grid, rowIndex, eventObject) {
                eventObject.stopEvent();
                grid.getSelectionModel().clearSelections();
                grid.getSelectionModel().selectRow(rowIndex);
                scope.menuItemMod.setVisible(!scope.btnModificarDuo.disabled);
                scope.menuItemDel.setVisible(!scope.btnEliminarDuo.disabled);
//                scope.menuItemVer.setVisible(!scope.btnVerDuo.disabled);

                scope.menuContextual.showAt(eventObject.getXY());
            }
        });

//        this.btnGraficarDuo.on('click', function()
//        {
//            scope.fGraphDuo();
//        });

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
    },
    initializeFunctions: function (scope) {
        this.fShowEliminarDuo = function (arregloselect) {
            arregloselect = (!Ext.isArray(arregloselect)) ? [arregloselect] : arregloselect;
            scope.objWindowsDuo = arregloselect;

            var msg = scope.etiquetas.lbConfirmDel;
            msg = (scope.tipoDuo == 1 || scope.tipoDuo == 2) ? ((arregloselect.length > 1) ? msg.replace("<#artDuo>", scope.artDuoTextoP.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelFP) : msg.replace("<#artDuo>", scope.artDuoTexto.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelF)) :
                ((arregloselect.length > 1) ? msg.replace("<#artDuo>", scope.artDuoTextoP.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelMP) : msg.replace("<#artDuo>", scope.artDuoTexto.toLowerCase()).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase()).replace("<#sel>", scope.etiquetas.lbSelM));

            if (scope.tipoDuo == 1) {
                msgDel = (arregloselect.length > 1) ? 'Eliminando datos de las Cuentas por cobrar.' : 'Eliminando datos de la Cuenta por cobrar.';
            }
            else if (scope.tipoDuo == 2) {
                msgDel = (arregloselect.length > 1) ? 'Eliminando datos de las Cuentas por pagar.' : 'Eliminando datos de la Cuenta por pagar.';
            }
            else if (scope.tipoDuo == 3) {
                msgDel = (arregloselect.length > 1) ? 'Eliminando datos de los Cobros fiscales.' : 'Eliminando datos del Cobro fiscal.';
            }
            else if (scope.tipoDuo == 4) {
                msgDel = (arregloselect.length > 1) ? 'Eliminando datos de los Pagos fiscales.' : 'Eliminando datos del Pago fiscal.';
            }

            mostrarMensaje(2, msg, function (btnPress) {
                if (btnPress === 'ok') {
                    scope.fEliminarDuo(arregloselect);
                } else {
                    scope.objWindowsDuo = '';
                }
            });
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

            //this.loadMessageBox(scope.etiquetas.lbMsgLoadData);//'Cargando datos para b&uacute;squedas...');
            scope.loadMask('Cargando...');

            if (!this.objWindowsDuo)
                this.objWindowsDuo = new Ext.ClassBuscarDuo(scope.etiquetas, parametros);
            //else //aki tengo que mostrar la interfaz del buscar pero con los datos que se selecciono en otro momento

            this.objWindowsDuo.addListener('closeBuscar', function (cancel, infoAgrupada, params) {
                scope.objWindowsDuo = '';
                /*scope.clearFiltersGridDuo();
                scope.stGestionarDuo.reload();*/
            });

            this.objWindowsDuo.addListener('buscarDuo', function (params) {
                scope.clearFiltersGridDuo();
                scope.objWindowsDuo = '';
                scope.stGestionarDuo.baseParams.start = '';
                scope.stGestionarDuo.baseParams.limit = '';
                scope.stGestionarDuo.baseParams.searching = 1;
                //scope.stGestionarDuo.baseParams.tipoDuo = params.tipoDuo;
                if (params.numero)
                    scope.stGestionarDuo.baseParams.numero = params.numero;
                if (params.idcontrato)
                    scope.stGestionarDuo.baseParams.idcontrato = params.idcontrato;
                if (params.idcuenta)
                    scope.stGestionarDuo.baseParams.idcuenta = params.idcuenta;
                if (params.subsistema)
                    scope.stGestionarDuo.baseParams.subsistema = params.subsistema;
                if (params.iddoc)
                    scope.stGestionarDuo.baseParams.iddoc = params.iddoc;
                if (params.idestadodocumento)
                    scope.stGestionarDuo.baseParams.idestadodocumento = params.idestadodocumento;
                if (params.importe)
                    scope.stGestionarDuo.baseParams.importe = params.importe;
                if (params.idcliente)
                    scope.stGestionarDuo.baseParams.idcliente = params.idcliente;
                if (params.numCO)
                    scope.stGestionarDuo.baseParams.numCO = params.numCO;
                if (scope.confEspecialidad && params.idespecialidad)
                    scope.stGestionarDuo.baseParams.idespecialidad = params.idespecialidad;
                if (params.tipofecha)
                    scope.stGestionarDuo.baseParams.tipofecha = params.tipofecha;
                if (params.fechainicio)
                    scope.stGestionarDuo.baseParams.fechainicio = params.fechainicio;
                if (params.fechafin)
                    scope.stGestionarDuo.baseParams.fechafin = params.fechafin;

                scope.stGestionarDuo.load(/*{
                    callback: function (records, success, response) {
                        Ext.MessageBox.hide();
                        if (!records.length) {
                            //scope.notifyEvent(Ext.getCmp('gpGestionarDuo').body.dom, scope.etiquetas.titleInfo, scope.etiquetas.msgNoMatchingData, 1, 3000);
                            mostrarMensaje(1, scope.etiquetas.msgNoMatchingData);
                        }
                    }
                }*/);
            });
        };

        this.clearFiltersGridDuo = function () {
            scope.stGestionarDuo.baseParams = {};
            scope.stGestionarDuo.baseParams.tipoduo = scope.tipoDuo;
        };

        this.fShowAdicionarDuo = function (action, idDuo, dataDoc) {
            parametros = {
                tipoDuo: scope.tipoDuo, // AKI VA EL PARAMETRO QUE ENVIO DE ClassGestionarDerechoCobro CON EL VALOR DE LA INTERFAZ EN LA CUAL ESTOY TRABAJANDO (1, 2, 3, 4)
                action: action, // 1 EN CASO DE ADICIONAR Y 2 EN CASO DE MODIFICAR
                actionText: (action == 2) ? ((scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.etiquetas.actModF : scope.etiquetas.actModM) : ((scope.tipoDuo == 1 || scope.tipoDuo == 2) ? scope.etiquetas.actAddF : scope.etiquetas.actAddM),
                idDuo: idDuo,
                dataDoc: dataDoc,
                url: scope.url,
                confEspecialidad: scope.confEspecialidad,
                confFechaRecepcion: scope.confFechaRecepcion,
                textDuo: scope.tipoDuoTexto,
                textDuoPlural: scope.tipoDuoTextoPlural,
                artTexto: scope.artDuoTexto,
                artTextoP: scope.artDuoTextoP
            };

            //this.loadMessageBox(scope.etiquetas.lbMsgLoadData);//'Cargando...');
            scope.loadMask('Cargando...');

            if (!scope.objWindowsDuo)
                scope.objWindowsDuo = new Ext.ClassAdicionarDuo(scope.etiquetas, parametros);

            scope.objWindowsDuo.addListener('closeAdicionar', function (cancel, adiciono, infoAgrupada, params) {
                if (adiciono) {
                    scope.loadMask('Cargando...');
                    scope.stGestionarDuo.reload({
                        callback: function (options, success, response) {
                            Ext.getBody().unmask();
                        }
                    });
                }
                scope.objWindowsDuo = '';
            });

            this.objWindowsDuo.addListener('contabilizarAdicionar', function (idDuo) {
                scope.fShowContabilizarDuo(idDuo);
            });
        };

        this.fShowImportarDuo = function (idDuo, dataDoc) {
            /* COMPONENTE NUEVO */
            var arraySuccess = [];
            var arrayFailed = [];
            this.dialog = new Ext.ux.UploadDialog.Dialog({
                url: 'importarXMLCargaInicial',
                reset_on_hide: false,
                allow_close_on_upload: true,
                //upload_autostart: true,
                modal: true,
                permitted_extensions: ['xml'],
                base_params: {reqaction: 'uploadfile', resptype: 'json'}
            });
            this.dialog.on({
                uploadsuccess: function (dialog, filename, data, record) {
                    arraySuccess.push(filename);
                },
                uploaderror: function (dialog, filename, data, record) {
                    arrayFailed.push(filename);
                },
                uploadfailed: function (dialog, filename, record) {
                    arrayFailed.push(filename);
                },
                uploadcomplete: function (dialog) {
                    var mensaje = "";
                    // No hubo errores
                    if (arrayFailed.length === 0 && arraySuccess.length > 0) {
                        if (arraySuccess.length === 1) {
                            mensaje = scope.etiquetas.msgImportResult.replace("<#ficheros>", arraySuccess.join(', ')).replace('<#error>', '');
                            arrayFailed = [];
                            arraySuccess = []
                        } else {
                            mensaje = scope.etiquetas.msgImportResultPlural.replace("<#ficheros>", arraySuccess.join(', ')).replace('<#error>', '');
                            arrayFailed = [];
                            arraySuccess = []
                        }
                    }
                    // Todo los archivos no pudiero ser importados
                    if (arrayFailed.length > 0 && arraySuccess.length === 0) {
                        if (arrayFailed.length === 1) {
                            mensaje = scope.etiquetas.msgImportResultFailed.replace("<#ficheros>", arrayFailed.join(', '));
                            arrayFailed = [];
                            arraySuccess = []
                        } else {
                            mensaje = scope.etiquetas.msgImportResultFailedPlural.replace("<#ficheros>", arrayFailed.join(', '));
                            arrayFailed = [];
                            arraySuccess = []
                        }
                    }
                    // Ocurrieron errores an algunos de los archivos
                    if (arrayFailed.length > 0 && arraySuccess.length > 0) {
                        if (arraySuccess.length === 1) {
                            mensaje = (arrayFailed.length === 1) ? scope.etiquetas.msgImportResult.replace("<#ficheros>", arraySuccess.join(', ')).replace('<#error>.', ', ' + scope.etiquetas.msgGlueImportFailed + " " + scope.etiquetas.msgImportResultFailed.toLowerCase().replace("<#ficheros>", arrayFailed.join(', '))) :
                                scope.etiquetas.msgImportResult.replace("<#ficheros>", arraySuccess.join(', ')).replace('<#error>.', ', ' + scope.etiquetas.msgGlueImportFailed + " " + scope.etiquetas.msgImportResultFailedPlural.toLowerCase().replace("<#ficheros>", arrayFailed.join(', ')));
                            arrayFailed = [];
                            arraySuccess = []
                        } else {
                            mensaje = (arrayFailed.length === 1) ? scope.etiquetas.msgImportResultPlural.replace("<#ficheros>", arraySuccess.join(', ')).replace('<#error>.', ', ' + scope.etiquetas.msgGlueImportFailed + " " + scope.etiquetas.msgImportResultFailed.toLowerCase().replace("<#ficheros>", arrayFailed.join(', '))) :
                                scope.etiquetas.msgImportResultPlural.replace("<#ficheros>", arraySuccess.join(', ')).replace('<#error>.', ', ' + scope.etiquetas.msgGlueImportFailed + " " + scope.etiquetas.msgImportResultFailedPlural.toLowerCase().replace("<#ficheros>", arrayFailed.join(', ')));
                            arrayFailed = [];
                            arraySuccess = []
                        }
                    }
                    mostrarMensaje(1, mensaje);
                },
                close: function (hasUploadSuccessFile) {
                    scope.objWindowsDuo = '';
                    if (hasUploadSuccessFile) {
                        //scope.loadMessageBox(scope.mascPrincipal);
                        scope.stGestionarDuo.reload(/*{
                            callback: function (options, success, response) {
                                Ext.MessageBox.hide();
                            }
                        }*/);
                    }
                }
            });
            this.objWindowsDuo = this.dialog;
            this.dialog.show();
        }

        scope.gpRegistroDuo.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('idestadodocumento') == 4)
                return 'FilaVerde';
            if (record.get('idestadodocumento') == 1)
                return 'FilaRoja';
        };

        this.RowClick = function (sm, indiceFila, record) {
            var arreglocant = sm.getSelections();
            scope.btnModificarDuo.setDisabled(arreglocant.length !== 1);
            scope.btnEliminarDuo.setDisabled(arreglocant.length === 0);
        };

        this.fDifEstados = function () {
            var flagDifEstados = false;
            var arraycanc = new Array();

            arraycanc = scope.fGetSelectionsOnPaging();

            for (var i = 0; i < arraycanc.length; i++) {
                for (var j = 0; j < arraycanc.length; j++) {
                    if (arraycanc[j].idestadodocumento == 4 && arraycanc[j].pagadomb > 0) {
                        flagDifEstados = true;
                        break;
                    }
                    else if (arraycanc[i].idestadodocumento == 4 && arraycanc[j].idestadodocumento == 4 && arraycanc[i].cargainicial != arraycanc[j].cargainicial) {
                        flagDifEstados = true;
                        break;
                    }
                    else if (arraycanc[i].idestadodocumento != arraycanc[j].idestadodocumento) // cuando no se va a contabilizar...
                    {
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
            scope.loadMessageBox(msgDel/*scope.etiquetas.lbEliminando*/);
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
                    respuesta = responseData;//.valor;
                    if (parseInt(respuesta) == 1) {

                        var msg = (scope.tipoDuo == 1 || scope.tipoDuo == 2) ? ((arreglomandar.length > 1) ? scope.etiquetas.msgActionSuccessP.replace("<#artDuo>", scope.artDuoTextoP).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase() + " " + scope.etiquetas.lbSelFP).replace("<#accion>", scope.etiquetas.actDelFP.toLowerCase()) : scope.etiquetas.msgActionSuccess.replace("<#artDuo>", scope.artDuoTexto).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase() + " " + scope.etiquetas.lbSelF).replace("<#accion>", scope.etiquetas.actDelF.toLowerCase())) :
                            ((arreglomandar.length > 1) ? scope.etiquetas.msgActionSuccessP.replace("<#artDuo>", scope.artDuoTextoP).replace("<#tipoDuo>", scope.tipoDuoTextoPlural.toLowerCase() + " " + scope.etiquetas.lbSelMP).replace("<#accion>", scope.etiquetas.actDelM.toLowerCase()) : scope.etiquetas.msgActionSuccess.replace("<#artDuo>", scope.artDuoTexto).replace("<#tipoDuo>", scope.tipoDuoTexto.toLowerCase() + " " + scope.etiquetas.lbSelM).replace("<#accion>", scope.etiquetas.actDelM.toLowerCase()));

                        scope.stGestionarDuo.reload({
                            callback: function () {
                                Ext.MessageBox.hide();
                                mostrarMensaje(1, msg);
                                scope.arrayValues = new Array();
                                scope.smGestionarDuo.clearSelections();
                                scope.objWindowsDuo = '';
                            }
                        });
                    }
                    else {
                        mostrarMensaje(1, scope.etiquetas.lbError);
                    }
                }
            });
        };

        this.createToolTip = function (v, m, r) {
            var numContrato = (r.data.numerocontrato) ? r.data.numerocontrato : scope.etiquetas.lbExcepcional;

            m.attr = ' ext:qtip="';
            if (!Ext.isEmpty(r.data.fechaentrega)) {
                m.attr += '<b>' + scope.nombreFecha + ': </b>' + r.data.fechaentrega + '</br>';
            }
            if (!Ext.isEmpty(r.data.fechaemision)) {
                m.attr += '<b>' + scope.etiquetas.lbFechaEmision + ': </b>' + r.data.fechaemision + '</br>';
            }
            if (!Ext.isEmpty(r.data.fecharecepcion) && scope.confFechaRecepcion) {
                m.attr += '<b>' + scope.etiquetas.lbFechaRecepcion + ': </b>' + r.data.fecharecepcion + '</br>';
            }
            if (!Ext.isEmpty(r.data.numero)) {
                m.attr += '<b>' + scope.etiquetas.lbNumDocumento + ': </b>' + r.data.numero + '</br>';
            }

            m.attr += '<b>' + scope.etiquetas.lbNumContrato + ': </b>' + numContrato + '</br>';

            if (!Ext.isEmpty(r.data.text)) {
                m.attr += '<b>' + scope.etiquetas.lbCuenta + ': </b>' + r.data.text + '</br>';
            }
            if (!isNaN(parseFloat(r.data.importemb))) {
                m.attr += '<b>' + scope.etiquetas.lbImporte + ': </b>' + r.data.importemb + '</br>';
            }
            if (!Ext.isEmpty(r.data.denominacion)) {
                m.attr += '<b>' + scope.etiquetas.lbTipoDoc + ': </b>' + r.data.denominacion + '</br>';
            }
            if (!Ext.isEmpty(r.data.nombrecliente)) {
                m.attr += '<b>' + scope.nombreCliente + ': </b>' + r.data.nombrecliente + '</br>';
            }
            if (!Ext.isEmpty(r.data.especialidad) && scope.confEspecialidad) {
                m.attr += '<b>' + scope.etiquetas.lbEspecialidad + ': </b>' + r.data.especialidad + '</br>';
            }
            if (!Ext.isEmpty(r.data.comentario)) {
                m.attr += '<b>' + scope.etiquetas.lbDetalle + ': </b>' + r.data.comentario + '</br>';
            }
            m.attr += '"';

            return v;
        };

        this.fGetSelectionsOnPaging = function () {
            instance = new PagingToolbarSelections({
                'selections': Ext.getCmp('gpGestionarDuo').getSelectionModel().getSelections(),
                'activePage': Ext.getCmp('gpGestionarDuo').getBottomToolbar().getPageData().activePage
            });
            return instance.getSelectionsOnArray(scope.arrayValues);
        };

        this.fShowVerDuo = function () {
            this.loadMessageBox(scope.etiquetas.lbMsgLoadData);//'Cargando...');
            var arrayDuo = scope.fGetSelectionsOnPaging();

            parametros = {
                tipoDuo: scope.tipoDuo, // AKI VA EL PARAMETRO QUE ENVIO DE ClassGestionarDerechoCobro CON EL VALOR DE LA INTERFAZ EN LA CUAL ESTOY TRABAJANDO (1, 2, 3, 4)
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
            //this.objWindowsDuo = new Ext.ClassVerDuo(scope.tipoDuo, scope.etiquetas, arrayDuo, scope.url, scope.confEspecialidad);

            this.objWindowsDuo.addListener('closeVer', function (cancel, infoAgrupada, params) {
                scope.objWindowsDuo = '';
            });
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
        this.map = new Ext.KeyMap(document, [
            {
                key: "i", //ADICIONAR
                alt: true,
                fn: function () {
                    if (scope.objWindowsDuo == '' && !Ext.EventObject.ctrlKey)
                        scope.btnAdicionarDuo.handler.call();
                }
            }, {
                key: "m", //MODIFICAR
                alt: true,
                fn: function () {
                    if (scope.objWindowsDuo == '' && !scope.btnModificarDuo.disabled) {
                        Ext.EventObject.stopEvent();
                        scope.btnModificarDuo.handler.call();
                    }
                }
            }, {
                key: Ext.EventObject.DELETE, //ELIMINAR
                fn: function () {
                    if (scope.objWindowsDuo == '' && !scope.btnEliminarDuo.disabled)
                        scope.btnEliminarDuo.handler.call();
                }
            }, {
                key: "v", //VER
                alt: true,
                fn: function () {
                    if (scope.objWindowsDuo == '')
                        scope.btnVerDuo.handler.call();
                }
            }, {
                key: "b", //BUSCAR
                alt: true,
                fn: function () {
                    if (scope.objWindowsDuo == '')
                        scope.btnBuscarDuo.handler.call();
                }
            }, {
                key: "i", //IMPORTAR
                alt: true,
                ctrl: true,
                fn: function () {
                    if (scope.objWindowsDuo == '' && scope.btnImportarDuo.rendered)
                        scope.btnImportarDuo.handler.call();
                }
            }, {
                key: "h", //AYUDA
                alt: true,
                fn: function () {
                    scope.btnAyuda.handler.call();
                }
            }, {
                key: Ext.EventObject.TAB, //TAB
                fn: function() {
                    if(document.activeElement.tabIndex == 115)
                        scope.objWindowsDuo.dfAddFechaEmision.focus(true, 10);
					else if(document.activeElement.tabIndex == 7)
                        scope.objWindowsDuo.cbBuscarTipoDoc.focus(true, 10);
                }
            }, {
                key: Ext.EventObject.TAB, //TAB
                shift: true,
                fn: function() {
                    if(document.activeElement.tabIndex == 100)
                        scope.objWindowsDuo.btnAddGuardar.focus(true);
					else if(document.activeElement.tabIndex == 1)
                        scope.objWindowsDuo.btnBuscarAceptar.focus(true);
                }
            }
        ]);
    }
});


