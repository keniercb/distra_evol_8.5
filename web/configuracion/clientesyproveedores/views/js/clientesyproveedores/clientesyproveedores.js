/*
 * Gestionar clientes y proveedores.
 *
 * @author Ing. Maikel Garcia Valdes.
 * @author Ing. Alberto Mesa Martínez.
 * @package ERP-Cuba.
 * @subpackage Configuraci&oacute;n General.
 * @namespace Ext.DatMaest.ClientProveed
 * @copyright XETID.
 * @version 1.0-0
 */
Ext.namespace('Ext.DatMaest.ClientProveed');
Ext.DatMaest.ClientProveed.ClienteProveedor = Ext.extend(Ext.Component, {
    perfil: window.parent.UCID.portal.perfil,
    etiquetas: 'undefined',
    iddpa: null,
    constructor: function () {
        Ext.QuickTips.init();
        _this = this;
        this.keys = 'undefined';
        this.activeWindow = '';
        this.arrContactos = new Array();
        var idioma = window.parent.perfil.idioma;
        var idioma = 'es';
        var text = (idioma === 'es') ? 'Cargando...' : 'Loading...';
        var title = (idioma === 'es') ? 'Por favor espere...' : 'Please wait...';
        this.onloadMessageBox(title, text);

        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            params: {
                vista: 'clientesyproveedores'
            },
            callback: function (options, success, response) {
                _this.etiquetas = Ext.decode(response.responseText);
                _this.required = '<span style="color:red;font-weight:bold" qtip="Obligatorio">*</span>';
                _this.actualizado = '<text style="color:#CC6600;font-weight:bold" ' +
                    'qtip="Valor obtenido del cliente al que se subordina">!</text>';
                _this.cargarInterfaz(_this.perfil, _this.etiquetas);

                Ext.MessageBox.hide();
                _this.keyMap = new Ext.KeyMap(Ext.getBody(), [
                    {
                        key: "i",
                        alt: true,
                        scope: this,
                        fn: function () {
                            var btn = _this.pClienteProveedor.btnAdicionar;
                            if (btn && !btn.disabled && !btn.hidden) {
                                btn.handler.call();
                            }
                        }
                    }, {
                        key: "m",
                        alt: true,
                        scope: this,
                        fn: function () {
                            var btn = _this.pClienteProveedor.btnModificar;
                            if (btn && !btn.disabled && !btn.hidden) {
                                btn.handler.call();
                            }
                        }
                    }, {
                        key: Ext.EventObject.DELETE,
                        scope: this,
                        fn: function () {
                            var btn = _this.pClienteProveedor.btnEliminar;
                            if (btn && !btn.disabled && !btn.hidden && Ext.get(document.activeElement).id != 'sfClienteProveedor') {
                                btn.handler.call();
                            }
                        }
                    }, {
                        key: "r",
                        alt: true,
                        shift: true,
                        scope: this,
                        fn: function () {
                            var btn = _this.pClienteProveedor.btnVista;
                            if (btn && !btn.disabled && !btn.hidden) {
                                btn.handler.call();
                            }
                        }
                    }, {
                        key: "l",
                        alt: true,
                        ctrl: true,
                        scope: this,
                        fn: function () {
                            var btn = _this.pClienteProveedor.btnVerMapa;
                            if (btn && !btn.disabled && !btn.hidden) {
                                btn.handler.call();
                            }
                        }
                    }, {
                        key: "b",
                        alt: true,
                        scope: this,
                        fn: function () {
                            var filter = _this.pClienteProveedor.sfClienteProveedor;
                            if (filter.getValue()) {
                                filter.onTrigger2Click();
                            } else {
                                filter.focus();
                            }
                        }
                    }, {
                        key: "l",
                        alt: true,
                        scope: this,
                        fn: function () {
                            var filter = _this.pClienteProveedor.sfClienteProveedor;
                            if (filter.getValue()) {
                                filter.onTrigger1Click();
                            }
                        }
                    }
                ]);

                Ext.Ajax.request({
                    url: 'cargaracciones',
                    method: 'POST',
                    params: {
                        idfuncionalidad: window.frameElement.id
                    },
                    callback: function (opts, success, response) {
                        if (success) {
                            _this.grantedActions = Ext.decode(response.responseText);

                            var codMsg = _this.grantedActions.codMsg;

                            if (!codMsg) {
                                _this.showGrantedActions();
                            }
                            // var text2 = (idioma === 'es') ? 'Calculando deudas...' : 'Loading...';
                            // _this.onloadMessageBox(title, text2);
                            // Ext.Ajax.request({
                            //     method: "POST",
                            //     url:  "/configuracion/clientesyproveedores/index.php/clientesyproveedores/checkearDeudas",
                            //     params: {
                            //         // vista: 'clientesyproveedores'
                            //     },
                            //     scope: this,
                            //     callback: function () {
                            //         Ext.MessageBox.hide();
                            //     }
                            // })

                            if(_this.tabdatosadicionales &&
                                _this.pClienteProveedor.config['enviarcorreoaviso'] === 'on')
                                Ext.Ajax.request({
                                    url: "comprobarPeriodoVencimiento",
                                    params: {
                                        diasaviso: _this.pClienteProveedor.config['diasaviso']
                                    },
                                    callback: function (options, success, response) {
                                        if(success) {
                                            let respuesta = Ext.decode(response.responseText);
                                            if(respuesta.success) {
                                                let total = respuesta.data.length, cont = 0, successCorreos = [];
                                                respuesta.data.forEach(x => {
                                                    let tipo = (x.tipo == '3' ? 'cliente/proveedor' : x.tipo == '1' ? 'cliente' : 'proveedor');
                                                    // var msg=mostrarMensaje(5, 'Enviando correo... No cierre la aplicación por favor.');
                                                    Ext.Ajax.request({
                                                        url: '/crm/application/index.php/main/enviarCorreo',
                                                        params: {
                                                            destinatarios: Ext.encode([_this.pClienteProveedor.config['correoaviso']]),
                                                            asunto: 'Vencimiento de ' + tipo + ' ' + x.codigo,
                                                            cuerpo: 'El ' + tipo + ' nombrado <b style="color:#3158a0">' + x.nombre + '</b> con el código <b style="color:#3158a0">'
                                                                + x.codigo + '</b> está por vencer el día <b style="color:#3158a0">' + x.fechafin + '</b>. ' +
                                                                'Le quedan <b style="color:#3158a0">' + x.diasrestantes + '</b> días para el vencimiento.'
                                                        },
                                                        callback: function (options, success, response) {
                                                            var respuesta = Ext.decode(response.responseText);
                                                            console.log(respuesta)
                                                            // msg.ghost("b", {remove: true});
                                                            if (respuesta.success) {
                                                                successCorreos.push(x.idclientesproveedores);
                                                                // mostrarMensaje(1, 'Se ha enviado un correo de aviso satisfactoriamente.');
                                                            } else {

                                                            }
                                                            cont++;
                                                            if(cont === total && successCorreos.length>0)
                                                                Ext.Ajax.request({
                                                                    url: "marcarCorreoEnviado",
                                                                    params: {
                                                                        ids: Ext.encode(successCorreos)
                                                                    },
                                                                    callback: function (options, success, response) {
                                                                        if (success) {
                                                                            let respuesta = Ext.decode(response.responseText);
                                                                        }
                                                                    }
                                                                });
                                                        }
                                                    })
                                                })
                                            }
                                        }
                                    }
                                })

                        }
                    }
                });
            }
        });

    },
    showGrantedActions: function () {
        var _this = this;
        for (k in this.grantedActions) {
            var id = this.grantedActions[k].abreviatura,
                cmp = Ext.getCmp(id);
            if (cmp) {
                cmp.show();
            }
            if (id == 'idcontabilidad') {
                _this.addcontabilidad = true;
            }
            if (id == 'idcobrospagos') {
                _this.addcobrospago = true;
            }
            if (id == 'tabcontact') {
                _this.addcontactos = true;
            }
            if (id == 'tabvehiculos') {
                _this.addvehiculos = true;
            }
            if (id == 'idlineas') {
                _this.addlineas = true;
            }
			if (id == 'nombrecodigo') {
                _this.shownombrecodigo = true;
            }
            if (id == 'tabdatosadicionales') {
                _this.tabdatosadicionales = true;
            }
            // if (id == 'tabadjuntos') {
                _this.tabadjuntos = true;
            // }
        }
    },
    onloadMessageBox: function (agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl,
            msg: agMsg,
            width: 300,
            wait: true,
            waitConfig: {interval: 300},
            progress: true,
            closable: false
        });
    },
    cargarInterfaz: function (perfil, etiquetas) {

        this.pClienteProveedor = new Ext.DatMaest.ClientProveed.Panel({
            etiquetas: this.etiquetas,
            toolbar: true
        });

        this.vpPrincipal = new Ext.Viewport({
            layout: 'fit',
            id: 'vpGlobal'
        });

        this.pClienteProveedor.on({
            scope: this,
            ready: function () {
                this.vpPrincipal.add(this.pClienteProveedor);
                this.vpPrincipal.doLayout();
                this.pClienteProveedor.store.load();

                if (this.pClienteProveedor.toolbar) {
                    this.pClienteProveedor.btnAdicionar.setHandler(function () {
                        _this.winSeleccionarCliente();
                        // _this.winGestionar('Add');
                    });
                    this.pClienteProveedor.btnModificar.setHandler(function () {
                        _this.winGestionar('Mod');
                    });
                    this.pClienteProveedor.btnEliminar.setHandler(function () {
                        _this.winFpRegistrar('Del');
                    });
                    this.pClienteProveedor.btnAyuda.setHandler();
                    this.pClienteProveedor.btnVerMapa.setHandler(function () {
                        _this.crearMapa();
                    });
                    this.pClienteProveedor.btnVista.setHandler(function () {
                        fObtenerDatosImprimirReporte();
                    });
                    this.pClienteProveedor.btnUsarEntidad.setHandler(function () {
                        _this.winFpRegistrar('Usar');
                    });
                    this.pClienteProveedor.btnNoUsarEntidad.setHandler(function () {
                        _this.winFpRegistrar('NoUsar');
 });
                    this.pClienteProveedor.btnHabilitar.setHandler(function () {
                        _this.habilitar(true, 1);
                    });
                    this.pClienteProveedor.btnDeshabilitar.setHandler(function () {
                        _this.habilitar(true, 0);
                    });
                    this.pClienteProveedor.btnVerArgumento.setHandler(function () {
                        _this.habilitar(false, null);
                    });
                    this.pClienteProveedor.btnVerDeudas.setHandler(function () {
                        _this.verDeudas();
                    });
                    this.pClienteProveedor.btnEspacioTrabajo.setHandler(function () {
                        _this.configurarEspacioTrabajo();
                    });
                    this.pClienteProveedor.btnConfigCorreo.setHandler(function () {
                        console.log('handler configurarcorreo')
                        _this.configurarCorreo();
                    });
                }
                if (this.pClienteProveedor.pDetalles) {
                    this.pClienteProveedor.pSubordinadas.on('dblclick', function () {
                        _this.winGestionar('Det');
                    })
                }
            }
        });

        function fObtenerDatosImprimirReporte() {
            _this.keyMap.disable();
            _this.onloadMessageBox(_this.etiquetas.lbEsperando, _this.etiquetas.lbCargando);
            Ext.Ajax.request({
                url: 'obtenerDatosImprimirReporte',
                method: 'POST',
                callback: function (options, success, response) {
                    Ext.MessageBox.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.datoCuerpo.length > 0)
                         exportarAexcel(responseData)//fOpenWindowReport(responseData);
                    else
                        mostrarMensaje(1, etiquetas.msgNoDatosReporte);
                }
            });
        }

        function fOpenWindowReport(requestDataSources) {
            printView = new SCFPrintView(requestDataSources, "/configuracion/reportes/", {
                paperSize: "FOLIO",
                orientation: "Horizontal",
                reportType: "HTML",
                listeners: {
                    close: function () {
                        _this.keyMap.enable();
                    }
                }
            });
            printView.show();
  }

        function exportarAexcel(requestDataSources) {
            window.open('http://' + window.location.host + '/configuracion/clientesyproveedores/index.php/clientesyproveedores/exportarExcel')
            // Ext.Ajax.request({
            //     url: 'exportarExcel',
            //     method: 'POST',
            //     params: requestDataSources,
            //     callback: function (options, success, response) {
            //
            //     }
            // })
        
        }

        function salvarRecords(records, idcliente) {
            _this.arrContactos[idcliente] = new Array();
            _this.arrContactos[idcliente] = records;
        }

        Ext.EventManager.on(this.vpPrincipal.el, 'keydown', function (e) {
            if (e.getKey() == Ext.EventObject.TAB) {
                var target = e.getTarget();
                while (target && target.nodeType === 1 && target !== document.body) {
                    var cmp = Ext.getCmp(target.id);
                    if (cmp && (cmp.text == 'Cancelar' || cmp.text == 'Cancel')) {
                        var dialog = Ext.MessageBox.getDialog(),
                            btncancel = dialog.buttons[3],
                            btnacept = dialog.buttons[0];
                        if (cmp.id == btncancel.id) {
                            e.preventDefault();
                            btnacept.focus();
                        }
                        break;
                    }
                    target = target.parentNode;
                }
            }
        });

    },
    initTemplates: function () {
        _this.thumbTemplate = new Ext.XTemplate(
            '<div class="dv-contactos">',
            '<tpl for=".">',
            '<div class="panel-contacto">',
            '<div class="panel-side">',
            '<img class="photo-principal" src="{foto}">',
            '</div>',
            '<div class="details-info-contacto">',
            '<table>',
            '<tr>',
            '<td>',
            '<div class="details-info-item-contacto">',
            '<span class="nombre-contacto">{nombre}</span>',
            '</div>',
            '</td>',
            '</tr>',
            '<tr>',
            '<td>',
            '<div class="details-info-item-contacto">',
            '<b>NI:</b>',
            '<span>{numeroidentidad}</span>',
            '</div>',
            '</td>',
            '</tr>',
            '<tr>',
            '<td>',
            '<div class="details-info-item-contacto">',
            '<b>Usuario:</b>',
            '<span>{nombreusuario}</span>',
            '</div>',
            '</td>',
            '</tr>',
            '<tr>',
            '<td>',
            '<div class="details-info-item-contacto">',
            '<b>Cargo:</b>',
            '<span>{cargo}</span>',
            '</div>',
            '</td>',
            '</tr>',
            '<tr>',
            '<td>',
            '<div class="details-info-item-contacto">',
            '<b>Tel&eacute;fono:</b>',
            '<span>{telefono}</span>',
            '</div>',
            '</td>',
            '</tr>',
            '<tr>',
            '<td>',
            '<div class="details-info-item-contacto">',
            '<b>M&oacute;vil:</b>',
            '<span>{movil}</span>',
            '</div>',
            '</td>',
            '</tr>',
            '<tr>',
            '<td>',
            '<div class="details-info-item-contacto">',
            '<b>Correo:</b>',
            '<span>{correocontacto}</span>',
            '</div>',
            '<div class="details-info-item-contacto">',
            '<b>DPA:</b>',
            '<span>{descripciondpa}</span>',
            '</div>',
            '</td>',
            '</tr>',
            '<tr>',
            '<td>',
            '<div class="details-info-item-contacto">',
            '<b>Direcci&oacute;n:</b>',
            '<span>{direccion}</span>',
            '</div>',
            '<div class="details-info-item-contacto">',
            '<tpl if="totalfacultades &gt; 0">',
            '<b>Tipos de facultades:</b><br/>',
            '<tpl for="facultades">',
            '<span>{denominacion}</span><br/>',
            '</tpl>',
            '</tpl>',
            '</div>',
            '</td>',
            '</tr>',
            '</table>',
            '</div>',
            '</div>',
            '</tpl>',
            '</div>'
        );
        _this.thumbTemplate.compile();


        _this.detailsTemplate = new Ext.XTemplate(
            '<div class="details">',
            '<tpl for=".">',
            '<div class="panel-title">',
            '<img src="{foto}" height="20%" width="60%">',
            '</div>',
            '<div class="details-info">',
            '<span class="details-name">{nombre}</span>',
            '<b>C&oacute;digo:</b>',
            '<span>{codigo}</span>',
            '<b>Abreviatura:</b>',
            '<span>{abreviatura}</span>' +
            '<b>Tel&eacute;fono:</b>',
            '<span>{telefono}</span>' +
            '<b>Correo:</b>',
            '<span>{correo}</span>' +
            '<b>DPA:</b>',
            '<span>{descripciondpa}</span>' +
            '<b>Direcci&oacute;n:</b>',
            '<span>{direccion}</span>' +
            '<b>Descripci&oacute;n:</b>',
            '<span>{descripcion}</span>' +
            '</div>',
            '</tpl>',
            '</div>'
        );
        _this.detailsTemplate.compile();
    },
    seleccionarEstructura: function () {
        _this.pGestEstructura = new Ext.estructura.panel.PanelEstructura({
            border: false
        });

        _this.pGestEstructura.tree.getSelectionModel().on({
            beforeselect: function (sm, node) {
                var validconcept = ["1", "3", '5'];
                if (validconcept.indexOf(node.attributes.idconcepto) == -1) {
                    Ext.getCmp('btnAceptarEstruc').disable();
                } else {
                    Ext.getCmp('btnAceptarEstruc').enable();
                }
            }
        });

        _this.winEstructuras = new Ext.Window({
            modal: true,
            constrain: true,
            title: 'Seleccionar estructura',
            closeAction: 'hide', layout: 'fit',
            width: 400,
            height: 400,
            defaultButton: 'btnCancelarEstruc',
            items: [_this.pGestEstructura],
            buttons: [
                {
                    xtype: 'button',
                    id: 'btnCancelarEstruc',
                    text: _this.etiquetas.lbBtnCancelar,
                    tooltip: _this.etiquetas.lbTtCancelar,
                    iconCls: 'cancelar',
                    handler: function () {
                        _this.winEstructuras.hide();
                    }
                }, {
                    xtype: 'button',
                    id: 'btnAceptarEstruc',
                    disabled: true,
                    text: _this.etiquetas.lbBtnAceptar,
                    tooltip: _this.etiquetas.lbTtAceptar,
                    iconCls: 'aceptar',
                    handler: function () {
                        if (_this.pGestEstructura.tree.getSelectionModel().getSelectedNode()) {
                            var nodeSelected = _this.pGestEstructura.tree.getSelectionModel().getSelectedNode();
                            if (nodeSelected.attributes.id != 'Estructuras') {
                                var data = nodeSelected.attributes;
                                _this.desabilitarCampos(false, true);
                                Ext.getCmp('idestructura').setValue(data.id);
                                _this.nombre.setValue(data.denominacion);
                                _this.codigo.setValue(data.codigo);
                                if(!_this.codigo.getValue()){
                                    _this.codigo.enable();
                                }
                                if (data.abreviatura)
                                    _this.abreviatura.setValue(data.abreviatura);
                                if (data.direccion)
                                    _this.direccion.setValue(data.direccion);
                                if (data.text)
                                    _this.taDescipcion.setValue(data.text);
                                if (data.correo)
                                    _this.correo.setValue(data.correo);
                                if (data.telefono)
                                    _this.telefono.setValue(data.telefono);
                                if (data.iddpt) {
                                    _this.iddpa = data.iddpt;
                                    _this.dpa.setValue(data.dpa[data.dpa.length - 1]);
                                }
                               // if (_this.subordinada)
                               //     _this.subordinada.setDisabled(true);
                                if (data.icon)
                                    _this.setImagen(data.icon);
                                var action = 'Add';
                                if (Ext.getCmp('idModAcept')) {
                                    var window = Ext.getCmp('winMod');
                                    action = 'Mod';
                                } else {
                                    var window = Ext.getCmp('winAdd');
                                }
                                _this.checkWindow(action, _this.fpClienteProveedor, window, 'idestructura', data.id);
                                _this.winEstructuras.close();
                            } else {
                                mostrarMensaje(1, _this.etiquetas.lbTtEstrAdic);
                            }
                        }
                        else {
                            mostrarMensaje(1, _this.etiquetas.lbTtEstrAdic);
                        }
                    }
                }
            ]
        });

        _this.winEstructuras.show();

        _this.winEstructuras.doLayout();
    },
    mostrarBusquedaPersona: function () {
        if (!_this.winBusPer) {
            _this.winBusPer = new Ext.Window({
                modal: true,
                constrain: true,
                title: 'Seleccionar persona',
                closeAction: 'hide',
                layout: 'fit',
                defaultButton: 'btnCancelarP',
                width: 700,
                height: 500,
                items: [_this.panelBusPer = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                    seguridad: 0,
                    listeners: {
                        'personaselecionada': function () {
                            Ext.getCmp('btnAceptarP').enable();
                        },
                        'personadeselecionada': function () {
                            Ext.getCmp('btnAceptarP').disable();
                        }
                    },
                    limit: 15,
                    start: 0
                })],
                buttons: [
                    {
                        xtype: 'button',
                        id: 'btnCancelarP',
                        text: _this.etiquetas.lbBtnCancelar,
                        tooltip: _this.etiquetas.lbTtCancelar,
                        iconCls: 'cancelar',
                        handler: function () {
                            _this.winBusPer.hide();
                        }
                    }, {
                        xtype: 'button',
                        id: 'btnAceptarP',
                        disabled: true,
                        text: _this.etiquetas.lbBtnAceptar,
                        tooltip: _this.etiquetas.lbTtAceptar,
                        iconCls: 'aceptar',
                        handler: function () {
                            if (_this.panelBusPer.getSeleccion()) {
                                var data = _this.panelBusPer.getSeleccion().data;
                                if (data.numid) {
                                    Ext.getCmp('idpersona').setValue(data.idpersona);
                                    _this.nombre.setValue(data.nombreyapellidos);
                                    _this.pnombre.setValue(data.nombre);
                                    _this.snombre.setValue(data.snombre);
                                    _this.papellido.setValue(data.papel);
                                    _this.sapellido.setValue(data.sapel);
                                    _this.codigo.setValue(data.numid);
                                    if (data.foto != null) {
                                        _this.setImagen(data.foto);
                                    } else {
                                        _this.setClasificacionTipo(true);
                                    }
                                    _this.desabilitarCampos(true, true);
                                    var action = 'Add';
                                    if (Ext.getCmp('idModAcept')) {
                                        action = 'Mod';
                                        var window = Ext.getCmp('winMod');
                                    } else {
                                        var window = Ext.getCmp('winAdd');
                                    }
                                    _this.checkWindow(action, _this.fpClienteProveedor, window, 'idpersona', data.idpersona);
                                    _this.winBusPer.hide();
                                }
                                else
                                    mostrarMensaje(1, _this.etiquetas.lbTtpersonaNotCI);
                            }
                            else {
                                mostrarMensaje(1, _this.etiquetas.lbTtpersonaAdic);
                            }
                        }
                    }
                ]
            });
        }
        _this.winBusPer.show();
    },
    winSeleccionarCliente: function () {
        console.log('pppammna8')
        var elstore=new Ext.data.Store({
            url: '/configuracion/clientesyproveedores/index.php/clientesyproveedores/cargarclientesproveedor',
            baseParams: {
                start: 0,
                limit: 20,
                enuso: 'false'
            },
            reader: new Ext.data.JsonReader({
                    totalProperty: 'cantidad',
                    root: 'datos',
                    id: 'idclientesproveedores'
                },
                [
                    {name: 'idclientesproveedores'},
                    {name: 'foto'},
                    {name: 'codigo'},
                    {name: 'nombre'},
                    {name: 'abreviatura'},
                    {name: 'telefono'},
                    {name: 'correo'},
                    {name: 'dpa'},
                    {name: 'descripciondpa'},
                    {name: 'direccion'},
                    {name: 'idtipo'},
                    {name: 'idclasificacioncontable'},
                    {name: 'idclasificacion'},
                    {name: 'enuso'},
                    {name: 'descripcion'},
                    {name: 'idestructura'},
                    {name: 'idpersona'},
                    {name: 'idestructuracomun'},
                    {name: 'registrado'},
                    {name: 'entidad'},
                    {name: 'idcuentasacobrar'},
                    {name: 'cuentasacobrar'},
                    {name: 'idcuentasapagar'},
                    {name: 'cuentasapagar'},
                    {name: 'credito'},
                    {name: 'fechainicio'},
                    {name: 'fechafin'},
                    {name: 'idusuario'},
                    {name: 'nombreusuario'},
                    {name: 'idmapa'},
                    {name: 'codigonit'},
                    {name: 'certificourl'},
                    {name: 'idpadre'},
                    {name: 'nombrepadre'},
                    {name: 'organismo'},
                    {name: 'idorganismo'},
                    {name: 'pais'},
                    {name: 'idpais'},
                    {name: 'sector'},
                    {name: 'idsector'},
                    {name: 'idclienteproveedorentidad'},
                    'identificadores','totalidentificadores', 'idespaciotrabajo',
                    'idclienteproveedorentidad',  'habilitado', 'argumento', 'argumentousuario', 'deuda', 'nombre_json'
                ]
            )
        }),
            nuevo=new Ext.Button({
                text: 'Crear nuevo',
                tooltip: 'Crear nuevo cliente/proveedor',
                iconCls: 'adicionar',
                // disabled: true,
                handler: function () {
                    _this.windowSeleccionarCliente.close();
                    _this.winGestionar('Add');
                }
            }),
            agregar=new Ext.Button({
                text: 'Agregar',
                tooltip: 'Agregar cliente/proveedor',
                iconCls: 'seleccion',
                disabled: true,
                handler: function () {
                    // _this.winGestionar('Add');
                    // _this.pClienteProveedor.store.reload();
                    _this.winFpRegistrar('Usar');
                    _this.windowSeleccionarCliente.close();
                }
            }),
            cerrar=new Ext.Button({
                text: 'Cerrar',
                tooltip: 'Cerrar',
                iconCls: 'cerrar',
                handler: function () {
                    _this.windowSeleccionarCliente.close();
                }
            });
        var filters=new Ext.grid.GridFilters({
            filtersText: this.etiquetas.lbFiltro,
            filters: [
                {type: 'string', dataIndex: 'codigo'},
                {type: 'string', dataIndex: 'codigonit'},
                {type: 'string', dataIndex: 'nombre'},
                {type: 'string', dataIndex: 'abreviatura'},
                {type: 'string', dataIndex: 'organismo'},
                {type: 'string', dataIndex: 'sector'},
                {
                    type: 'list',
                    dataIndex: 'idtipo',
                    options: [[1, this.etiquetas.lbCliente], [2, this.etiquetas.lbProveedor]]
                },
                {type: 'boolean', dataIndex: 'enuso'},
                {type: 'boolean', dataIndex: 'habilitado', yesText: _this.etiquetas.lbHabilitado,
                    noText: _this.etiquetas.lbDeshabilitado},
            ]
        });
        var search = new Ext.Cont.SearchField({
            id: 'buscarPorCodigoYNombre',
            width: 250,
            emptyText: 'Introduzca código o nombre',
            searchTooltip: this.etiquetas.tooltipbuscar,
            regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\,\-]+$/,
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\,\-]+$/,
            regexText: _this.etiquetas.regexTextNombre,
            validationEvent: true,
            maxLength: 255,
            fnOnSearch: function () {
                var filtro = search.getValue();
                // filters.getFilter('nombre').setValue(filtro);
                // filters.getFilter('nombre').setActive(true);
                // if (elstore.baseParams.limit && elstore.baseParams.start != 0) {
                //     elstore.baseParams.start = 0;
                //     elstore.baseParams.limit = 30;
                // }
                elstore.baseParams.start = 0;
                elstore.baseParams.limit = 30;
                elstore.baseParams.filtronomb = filtro;
                elstore.load();
                nuevo.enable();
            },
            fnOnClear: function () {
                // filters.getFilter('nombre').setValue('');
                // filters.getFilter('nombre').setActive(false);
                // if (elstore.baseParams.limit && elstore.baseParams.start != 0) {
                //     elstore.baseParams.start = 0;
                //     elstore.baseParams.limit = 30;
                // }
                elstore.baseParams.start = 0;
                elstore.baseParams.limit = 30;
                elstore.baseParams.filtronomb = null;
                delete elstore.baseParams.filtronomb;
                elstore.load();
            }
        });
        _this.gridSeleccionarCliente=new Ext.grid.GridPanel({
            loadMask: _this.etiquetas.lbCargando || 'Cargando...',
            frame: false,
            border: false,
            autoExpandColumn: 'expandir',
            store: elstore,
            sm: new Ext.grid.CheckboxSelectionModel({
                listeners:{
                    selectionchange: function(sm, records){
                        agregar.setDisabled(sm.getSelections().length==0);
                    }
                }
            }),
            filters: filters,
            plugins: filters,
            columns:[
                {
                    header: _this.etiquetas.lbCodigo,
                    width: 100,
                    dataIndex: 'codigo',
                    sortable: true,
                    fixed: true
                },
                {
                    header: this.etiquetas.lbCodigoNit,
                    width: 100,
                    dataIndex: 'codigonit',
                    sortable: true,
                    fixed: true
                },
                {
                    header: this.etiquetas.lbNombre,
                    id: 'expandir',
                    dataIndex: 'nombre',
                    sortable: true,
                    renderer: function (value, metaData, record) {
                        return '<span qtip="'+value+'">'+value+'</span>';
                    }
                },
                {
                    header: 'Sector',
                    width: 150,//140
                    dataIndex: 'sector',
                    sortable: true
                },
                {
                    header: this.etiquetas.lbAbreviatura,
                    width: 150,//100
                    dataIndex: 'abreviatura',
                    renderer: function (value, metaData, record) {
                        return '<span qtip="'+value+'">'+value+'</span>';
                    }
                },
                {
                    header: this.etiquetas.lbClasificacion,
                    dataIndex: 'idtipo',
                    width: 80, //100
                    align: 'center',
                    sortable: true,
                    renderer: function (value, metaData, record) {
                        var imagen = _this.getImagen(record.data.idtipo, record.data.idclasificacion, true);
                        return '<img qtip="<b>' + imagen.qtip + '</b>" src=' + imagen.ruta + '>';
                    }
                },
                // {
                //     header: this.etiquetas.lbEnUso,
                //     dataIndex: 'enuso',
                //     width: 50, //50
                //     sortable: true,
                //     renderer: function (value, metaData, record) {
                //         if (value == 1) {
                //             metaData.attr = 'ext:qtip="<p>' + _this.etiquetas.lbUsado + '</p>"';
                //             metaData.css = 'icondistra-usarentidad verde';
                //
                //         } else {
                //             metaData.attr = 'ext:qtip="<p>' + _this.etiquetas.lbNoUsado + '</p>"';
                //             metaData.css = 'icondistra-usarentidad rojo';
                //         }
                //     }
                // },
                {
                    header: 'Habilitado',
                    dataIndex: 'habilitado',
                    width: 60,
                    sortable: true,
                    hidden: true,
                    renderer: function (value, metaData, record) {
                        if (value == 1 || value == 2) {
                            metaData.attr = 'ext:qtip="<p>' + _this.etiquetas.lbHabilitado + '</p>"';
                            metaData.css = 'icondistra-true verde';
                        } else {
                            metaData.attr = 'ext:qtip="<p>' + _this.etiquetas.lbDeshabilitado + '</p>"';
                            metaData.css = 'icondistra-false rojo';
                        }
                    }
                },
            ],
            tbar: ['->', search],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 30,
                displayInfo: true,
                displayMsg: _this.etiquetas.lbDisplayMsg,
                emptyMsg: _this.etiquetas.lbNoResults,
                store: elstore,
                firstText: _this.etiquetas.lbPrimeraPagina || 'Primera P&aacute;gina',
                lastText: _this.etiquetas.lbUltimaPagina || '&Uacute;ltima P&aacute;gina',
                listeners: {
                    render: function (cmp) {
                        this.addButton({
                            iconCls: 'limpiar',
                            tooltip: 'Limpiar filtros',
                            handler: function () {
                                _this.gridSeleccionarCliente.filters.clearFilters();
                                // var filter = search;
                                // if (filter.getValue()) {
                                //     filter.onTrigger1Click();
                                // }
                            }
                        })
                    }
                }
            })
        });
        _this.windowSeleccionarCliente = new Ext.Window({
            modal: true,
            constrain: true,
            closeAction: 'close',
            // maximized: Ext.lib.Dom.getViewWidth() - 1000 < 30 ? true : false,
            layout: 'fit',
            title: 'Seleccionar clientes/provedorees',
            width: window.innerWidth*0.9,
            height: window.innerHeight*0.95,
            items: [
                _this.gridSeleccionarCliente
            ],
            buttons:[
                nuevo, agregar, cerrar
            ]
        })
        _this.windowSeleccionarCliente.show();
        elstore.load();

    },
    winGestionar: function (opcion) {
        this.activeWindow = 'cliente';
        this.cuentabancoDel = new Array();
        this.identificadoresDel = new Array();
        this.lineasDel = new Array();
        this.cuentaPagarCobrarDel = new Array();
        this.contactoDel = new Array();
        this.seleccionado = {};
        this.firstEdited = false;
        this.cont = 0;
        this.keyMap.disable();
        var winVentAsig;
        var _this = this;
        this.existeCont = (function () {
            //this, corresponde al objeto global window
            return true;
            // return this.existe_cont;
        })();

        this.checkcliente = new Ext.form.Checkbox({
            boxLabel: _this.etiquetas.lbCliente,
            id: 'idcheckcliente',
            name: 'cbCliente',
            hideLabel: true,
            tabIndex: 1,
            listeners: {
                check: function (check) {
                    _this.setClasificacionTipo(false);
                    var form = _this.fpClienteProveedor;
                    var idtipo = _this.getTipo();
                    _this.checkWindow(opcion, form, winVentAsig, 'idtipo', idtipo);
                    if (check.checked) {
                        _this.credito.enable();
                        _this.gpTabPago.enable();
                        _this.checkMayorista.setDisabled(false);
                    } else {
                        _this.checkMayorista.setValue(false);
                        _this.checkMayorista.setDisabled(true);
                        _this.credito.disable();
                        _this.credito.reset();
                        if (!_this.checkproveedor.checked) {
                            _this.checkproveedor.setValue(true);
                        } else {
                            _this.gpTabPago.disable();
                            _this.gpTabPago.getStore().removeAll();
                            if (_this.tpdDtalles.getActiveTab().id == 'gpTabPago') {
                                _this.tpdDtalles.activate('iddescipcion');
                            }
                        }
                    }
                }
            }
        });

        this.checkproveedor = new Ext.form.Checkbox({
            boxLabel: _this.etiquetas.lbProveedor,
            id: 'idcheckproveedor',
            hideLabel: true,
            name: 'cbProveedor',
            tabIndex: 2,
            listeners: {
                check: function (check) {
                    console.log('proveedor',check.checked)
                    _this.setClasificacionTipo(false);
                    var form = _this.fpClienteProveedor;
                    var idtipo = _this.getTipo();
                    _this.checkWindow(opcion, form, winVentAsig, 'idtipo', idtipo);
                    if (check.checked) {
                        if (!_this.checkcliente.checked) {
                            _this.gpTabPago.disable();
                            _this.gpTabPago.getStore().removeAll();
                            if (_this.tpdDtalles.getActiveTab().id == 'gpTabPago') {
                                _this.tpdDtalles.activate('iddescipcion');
                            }
                        } else {
                            _this.gpTabPago.enable();
                        }
                    } else {
                        if (!_this.checkcliente.checked) {
                            _this.checkcliente.setValue(true);
                        }
                    }
                }
            }
        });

        this.checkEntidad = new Ext.form.Checkbox({
            boxLabel: _this.etiquetas.lbEntidad,
            id: 'idcheckEntidad',
            name: 'cbEntidad',
            hideLabel: true,
            tabIndex: 3,
            listeners: {
                scope: this,
                check: function (check, newValue, oldValue) {
                    console.log('CHEK persona juridica',check.checked)
                    this.modificado = true;
                    this.habilitarCampos();
                    var form = this.fpClienteProveedor;
                    //this.subordinada.setDisabled(!check.checked);
                    if (check.checked) {
                        this.checkWindow(opcion, form, winVentAsig, 'idclasificacion', 1);
                        // this.pContactos.enable();
                        this.cmbUsuario.setValue('');
                        this.cmbUsuario.disable();
                        if (Ext.getCmp('idpersona').getValue()) {
                            this.setearCampos();
                            this.setClasificacionTipo(true);
                        }
                        this.fpClienteProveedor.find('itemId', 'nombrepersonajuridica')[0].setVisible(true);
                        this.fpClienteProveedor.find('itemId', 'nombrepersonajuridica')[0].enable();
                        this.nombre.allowBlank=false;
                        this.nombre.validate();
                        _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, _this.nombre, _this.nombre.getValue());
                        this.fpClienteProveedor.find('clase', 'nombrepersonanatural').forEach(function(x) {
                            x.setVisible(false);
                            x.disable();
                            if(x.items.get(0).name!='snombre' && x.items.get(0).fieldLabel!=undefined) {
                                x.items.get(0).allowBlank = true;
                                x.items.get(0).validate();
                                _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, x.items.get(0), x.items.get(0).getValue());
                            }
                        });
                        // this.nombre.setVisible(true);
                        // this.pnombre.disable();
                        // this.snombre.disable();
                        // this.papellido.disable();
                        // this.sapellido.disable();
                    }
                    else if (!check.checked) {
                        this.subordinada.reset();
                        datosSubordinada(false);
                        this.cmbUsuario.enable();
                        var trigger = document.getElementsByClassName("x-form-trigger x-form-search-trigger");
                        trigger[1].qtip = this.etiquetas.lbBuscarPersona;

                        this.checkWindow(opcion, form, winVentAsig, 'idclasificacion', 2);
                        // this.pContactos.disable();
                        if (this.tpdDtalles.getActiveTab().id == 'images-view') {
                            this.tpdDtalles.activate('iddescipcion');
                        }
                        if (Ext.getCmp('idestructura').getValue()) {
                            this.setearCampos();
                            this.setClasificacionTipo(true);
                        }
                        this.fpClienteProveedor.find('itemId', 'nombrepersonajuridica')[0].setVisible(false);
                        this.fpClienteProveedor.find('itemId', 'nombrepersonajuridica')[0].disable();
                        this.nombre.allowBlank=true;
                        this.nombre.validate();
                        _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, _this.nombre, _this.nombre.getValue());
                        this.fpClienteProveedor.find('clase', 'nombrepersonanatural').forEach(function(x) {
                            x.setVisible(true);
                            x.enable();
                            // console.log(x.items.get(0).fieldLabel);
                            if(x.items.get(0).name!='snombre' && x.items.get(0).fieldLabel!=undefined) {
                                x.items.get(0).allowBlank = false;
                                x.items.get(0).validate();
                                _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, x.items.get(0), x.items.get(0).getValue());
                            }
                        });
                        // this.nombre.disable();
                        // this.pnombre.enable();
                        // this.snombre.enable();
                        // this.papellido.enable();
                        // this.sapellido.enable();
                    }
                    // console.log(this.fpClienteProveedor.find('#nombrepersonajuridica'))
                    this.setClasificacionTipo(false);
                }
            }
        });

        this.checkMayorista = new Ext.form.Checkbox({
            boxLabel: _this.etiquetas.lbMayorista,
            id: 'idcheckMayorista',
            name: 'cbMayorista',
            hideLabel: true,
            tabIndex: 4,
            disabled: true,
            listeners: {
                scope: this,
                check: function (check) {
                    this.modificado = true;
                    this.habilitarCampos();
                    var form = this.fpClienteProveedor;
                    console.info('javier')
                    if (check.checked) {
                        this.checkWindow(opcion, form, winVentAsig, 'mayorista', 1);
                    } else {
                        this.checkWindow(opcion, form, winVentAsig, 'mayorista', 0);
                    }
                }
            }
        });

        this.firstElement = this.nombre = new Ext.form.TriggerField({
            anchor: '99%',
            id: 'tfNombre',
            name: 'nombre',
            labelSeparator: '',
            blankText: _this.etiquetas.textCampoObligatorio,
            triggerClass: 'x-form-search-trigger',
            trigger2Class: 'x-form-clear-trigger',
            allowBlank: false,
 //           regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\,\-]+$/,
 //           maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\,\-]+$/,
            maxLength: 255,
            regexText: _this.etiquetas.regexTextNombre,
            fieldLabel: _this.etiquetas.lbNombre + ':' + _this.required,
            enableKeyEvents: true,
            tabIndex: 5,
            listeners: {
                keyup: function (textfield, event) {
                    if (event.getKey() != 13) {
                        var form = _this.fpClienteProveedor;
                        _this.checkWindow(opcion, form, winVentAsig, textfield.name, textfield.getValue());
                    }
                },
                disable: function () {
                    this.wrap.removeClass(this.disabledClass);
                    this.wrap.dom.firstChild.classList.add(this.disabledClass);
                },
                enable: function () {
                    this.wrap.dom.firstChild.classList.remove(this.disabledClass);
                }
            }
        });

        this.nombre.onTriggerClick = function () {
            if (_this.checkEntidad.checked) {
                _this.seleccionarEstructura();
            } else {
                _this.mostrarBusquedaPersona();
            }
        }

        this.pnombre = new Ext.form.TextField({
            fieldLabel: 'Nombre' + ':' + _this.required,
            name: 'pnombre',
            anchor: '99%',
            labelSeparator: '',
            allowBlank: false,
            blankText: _this.etiquetas.textCampoObligatorio,
            maxLength: 100,
            regexText: _this.etiquetas.regexTextNombre,
            tabIndex: 4,
            enableKeyEvents: true,
            listeners: {
                keyup: function (textfield, event) {
                    if (event.getKey() != 13) {
                        var form = _this.fpClienteProveedor;
                        _this.checkWindow(opcion, form, winVentAsig, textfield.name, textfield.getValue());
                    }
                }
            }
        });

        this.snombre = new Ext.form.TextField({
            fieldLabel: 'Segundo nombre',
            name: 'snombre',
            anchor: '99%',
            labelSeparator: '',
            blankText: _this.etiquetas.textCampoObligatorio,
            maxLength: 100,
            regexText: _this.etiquetas.regexTextNombre,
            tabIndex: 4,
            enableKeyEvents: true,
            listeners: {
                keyup: function (textfield, event) {
                    if (event.getKey() != 13) {
                        var form = _this.fpClienteProveedor;
                        _this.checkWindow(opcion, form, winVentAsig, textfield.name, textfield.getValue());
                    }
                }
            }
        });

        this.papellido = new Ext.form.TextField({
            fieldLabel: 'Primer apellido' + ':' + _this.required,
            name: 'papellido',
            anchor: '99%',
            labelSeparator: '',
            allowBlank: false,
            blankText: _this.etiquetas.textCampoObligatorio,
            maxLength: 100,
            regexText: _this.etiquetas.regexTextNombre,
            tabIndex: 4,
            enableKeyEvents: true,
            listeners: {
                keyup: function (textfield, event) {
                    if (event.getKey() != 13) {
                        var form = _this.fpClienteProveedor;
                        _this.checkWindow(opcion, form, winVentAsig, textfield.name, textfield.getValue());
                    }
                }
            }
        });

        this.sapellido = new Ext.form.TextField({
            fieldLabel: 'Segundo apellido' + ':' + _this.required,
            name: 'sapelido',
            anchor: '99%',
            labelSeparator: '',
            allowBlank: false,
            blankText: _this.etiquetas.textCampoObligatorio,
            maxLength: 100,
            regexText: _this.etiquetas.regexTextNombre,
            tabIndex: 4,
            enableKeyEvents: true,
            listeners: {
                keyup: function (textfield, event) {
                    if (event.getKey() != 13) {
                        var form = _this.fpClienteProveedor;
                        _this.checkWindow(opcion, form, winVentAsig, textfield.name, textfield.getValue());
                    }
                }
            }
        });

        this.botonBuscar=new Ext.Button({
            iconCls: 'buscar',
            tooltip: 'Buscar persona natural',
            // disabled: true,
            handler: function () {
                _this.mostrarBusquedaPersona();
            }
        });

        this.stUsuario = new Ext.data.Store({
            url: 'cargarUsuarios',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cant',
                root: 'datos',
                id: 'idusuario'
            }, [
                {
                    name: 'idusuario'
                },
                {
                    name: 'nombreusuario'
                }
            ]),
            listeners: {
                scope: this,
                load: function (store) {
                    var idusario = this.cmbUsuario.getValue();
                    if (idusario) {
                        this.selectById(idusario, 'idusuario', store, this.smUsuario);
                    }
                }
            }
        });

        this.smUsuario = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
            listeners: {
                scope: this,
                selectionchange: function (sm) {
                    var cant = sm.getCount();
                    if (cant == 1) {
                        var data = sm.getSelected().data;
                        this.cmbUsuario.setValue(data.idusuario);
                        this.cmbUsuario.setRawValue(data.nombreusuario);
                        this.cmbUsuario.fireEvent('select', _this.cmbUsuario, data);
                        this.cmbUsuario.collapse();
                    } else {
                        this.cmbUsuario.setValue('');
                        this.cmbUsuario.setRawValue('');
                        this.cmbUsuario.fireEvent('select', _this.cmbUsuario);
                    }
                }
            }
        });

        this.sfUsuario = new Ext.Cont.SearchField({
            width: 217,
            emptyText: this.etiquetas.lbCriterioBuscar,
            searchTooltip: this.etiquetas.tooltipbuscarusuario,
            fnOnSearch: function () {
                _this.searchConcept(_this.stUsuario, _this.sfUsuario);
            },
            fnOnClear: function () {
                _this.clearField(_this.stUsuario);
            }
        });

        this.gpUsuario = new Ext.grid.GridPanel({
            loadMask: this.etiquetas.lbCargando,
            height: 200,
            frame: false,
            border: false,
            stripeRows: true,
            autoExpandColumn: 'expandir',
            store: this.stUsuario,
            sm: this.smUsuario,
            enableColumnHide: true,
            floating: false,
            hideHeaders: true,
            viewConfig: {
                forceFit: true
            },
            columns: [
                this.smUsuario,
                {
                    hidden: true,
                    dataIndex: 'idusuario',
                    hideable: false
                },
                {
                    id: 'expandir',
                    dataIndex: 'nombreusuario',
                    sortable: true
                }
            ],
            tbar: [this.sfUsuario],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                displayInfo: false,
                store: this.stUsuario
            })
        });

        this.cmbUsuario = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: [{name: 'idusuario'}, {name: 'nombreusuario'}],
                data: [[]]
            }),
            editable: false,
            triggerAction: 'all',
            disabled: true,
            fieldLabel: this.etiquetas.lbUsuario,
            anchor: '98%',
            emptyText: this.etiquetas.emptyText,
            displayField: 'nombreusuario',
            valueField: 'idusuario',
            name: 'idusuario',
            mode: 'local',
            tpl: '<div id = \"ctUsuario\" style = \"height:200px; !important;\"></div>',
            tabIndex: 6,
            listeners: {
                scope: this,
                expand: function (combo) {
                    this.gpUsuario.render('ctUsuario');
                    setTimeout(function () {
                        _this.sfUsuario.focus();
                    }, 5);
                    if (this.stUsuario.getCount() == 0) {
                        this.stUsuario.load({
                            params: {
                                start: 0,
                                limit: 20
                            }
                        });
                    } else {
                        var id = combo.getValue();
                        this.selectById(id, 'idusuario', this.stUsuario, this.smUsuario);
                    }

                },
                select: function (cmb, data) {
                    var form = _this.fpClienteProveedor;
                    _this.checkWindow(opcion, form, winVentAsig, cmb.name, cmb.getValue());
                }
            }
        });
		
		//Esto es para poner el organismo en cliente y proveedores...
		
// 		 this.hfOrganismo=new Ext.form.Hidden({
//             name:'idorganismo',
//         });

        this.stOrganismo = new Ext.data.Store({
            url: 'obtenerOrganismos',
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                // id: 'idterminodepago'
            }, [
                {name: 'nombre'},
                {name: 'idorganismo'},
            ]),
        });

        this.organismo = new Ext.form.ComboBox({
            name: 'organismo',
            id: 'idorganismo',
            fieldLabel:'Organismo',
            emptyText: this.etiquetas.emptyText,
            store: this.stOrganismo,
            typeAhead: false,
            pageSize: 15,
            displayField: 'nombre',
            valueField: 'idorganismo',
            // valueField: 'idorganismo',
            queryParam: 'denominacion',
            loadingText: this.etiquetas.lbCargando,
            queryDelay: 400,
            minChars: 0,
            // value:1,
            // allowBlank: false,
//             forceSelection: true,
            triggerAction: 'all',
            anchor: '98%',
            enableKeyEvents: true,
            listeners:{
                select: function(yo, record){
                    var form = _this.fpClienteProveedor;
                    _this.checkWindow(opcion, form, winVentAsig, yo.name, yo.getValue());
//                     _this.hfOrganismo.setValue(record.get('idorganismo'));
                },
                keydown: function(yo){
                    setTimeout(function () {
//                         console.info('key yeeeee 100',yo.getValue(), '--', yo.getRawValue())
                        if(yo.getRawValue()=='')
                           yo.reset();
                    },100);
                    var form = _this.fpClienteProveedor;
                    _this.checkWindow(opcion, form, winVentAsig, yo.name, yo.getValue());

                },
//                 change: function(yo){
//                     var form = _this.fpClienteProveedor;
//                     _this.checkWindow(opcion, form, winVentAsig, yo.name, yo.getValue());
//                     if(!yo.getValue()){
//                         _this.hfOrganismo.setValue('');
//                     }
//                 }
            }
        });
		
		
		//poner el sector en cliente y proveedores.
		
		  this.stSector = new Ext.data.Store({
            url: 'obtenerSector',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cant',
                root: 'data',
                // id: 'idterminodepago'
            }, [
			     {name: 'idsector'},
                {name: 'sector'}
               
            ]),
        });

        this.sector = new Ext.form.ComboBox({
            name: 'sector',
            id: 'idsector',
            fieldLabel:'Sector',
            emptyText: this.etiquetas.emptyText,
            store: this.stSector,
			allowBlank: true,
            typeAhead: false,
            pageSize: 15,
            displayField: 'sector',
            valueField: 'idsector',
            queryParam: 'sector',
            loadingText: this.etiquetas.lbCargando,
            queryDelay: 400,
            minChars: 0,
            // value:1,
            // allowBlank: false,
//             forceSelection: true,
            triggerAction: 'all',
            anchor: '98%',
            enableKeyEvents: true,
            listeners:{
                select: function(yo, record){
                    var form = _this.fpClienteProveedor;
                    _this.checkWindow(opcion, form, winVentAsig, yo.name, yo.getValue());
                },
                keydown: function(yo){
                    setTimeout(function () {
//                         console.info('key yeeeee 100',yo.getValue(), '--', yo.getRawValue())
                        if(yo.getRawValue()=='')
                           yo.reset();
                    },100);
                    var form = _this.fpClienteProveedor;
                    _this.checkWindow(opcion, form, winVentAsig, yo.name, yo.getValue());

                },
//                 change: function(yo){
//                     var form = _this.fpClienteProveedor;
//                     _this.checkWindow(opcion, form, winVentAsig, yo.name, yo.getValue());
//                     if(!yo.getValue()){
//                         _this.hfOrganismo.setValue('');
//                     }
//                 }
            }
        });
		
		

        this.codigo = new Ext.form.TextField({
            name: 'codigo',
            id: 'idcodigo',
            labelSeparator: '',
            fieldLabel: _this.etiquetas.lbCodigo + ':' + _this.required,
            allowBlank: false,
//            regex: /^[a-zA-Z0-9\.]+$/,
//            maskRe: /^[a-zA-Z0-9\.]+$/,
            maxLength: 30,
            regexText: _this.etiquetas.regexTextCodigo,
            anchor: '98%',
            enableKeyEvents: true,
            tabIndex: 7,
            listeners: {
                keyup: function (textfield, event) {
                    if (event.getKey() != 13) {
                        var form = _this.fpClienteProveedor;
                        _this.checkWindow(opcion, form, winVentAsig, textfield.name, textfield.getValue());
                    }
                }
            }
        });

        this.codigoNit = new Ext.form.TextField({
            name: 'codigonit',
            id: 'codigonit',
            labelSeparator: '',
            fieldLabel: _this.etiquetas.lbCodigoNit + ':',
//            regex: /^[a-zA-Z0-9]+$/,
//            maskRe: /^[a-zA-Z0-9]+$/,
            maxLength: 30,
            regexText: _this.etiquetas.regexTextCodigo,
            anchor: '98%',
            enableKeyEvents: true,
            tabIndex: 8,
            listeners: {
                keyup: function (textfield, event) {
                    if (event.getKey() != 13) {
                        var form = _this.fpClienteProveedor;
                        _this.checkWindow(opcion, form, winVentAsig, textfield.name, textfield.getValue());
                    }
                }
            }
        });

        this.abreviatura = new Ext.form.TextField({
            name: 'abreviatura',
            fieldLabel: _this.etiquetas.lbAbreviatura , // + ':',
//            regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\,\-]+$/,
//            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\,\-]+$/,
            regexText: _this.etiquetas.regexTextNombre,
            maxLength: 255,
            anchor: '98%',
            enableKeyEvents: true,
            tabIndex: 9,
            listeners: {
                keyup: function (textfield, event) {
                    if (event.getKey() != 13) {
                        var form = _this.fpClienteProveedor;
                        _this.checkWindow(opcion, form, winVentAsig, textfield.name, textfield.getValue());
                    }
                }
            }
        });

        this.telefono = new Ext.form.TextField({
            fieldLabel: _this.etiquetas.lbTelefono + ':',
            labelSeparator: '',
            minLength: 6,
            maxLength: 30,
            regex: /^(\([0-9]{2,4}\)\s?|[0-9]{2,4}[\-\s]?)?[0-9]{6,}(\,(\([0-9]{2,4}\)\s?|[0-9]{2,4}[\-\s]?)?[0-9]{6,})*$/,
            maskRe: /^[0-9\s\(\)\-\,]+$/,
            regexText: _this.etiquetas.regexTextTelefono,
            width: '98%',
            name: 'telefono',
            enableKeyEvents: true,
            tabIndex: 10,
            listeners: {
                keyup: function (textfield, event) {
                    if (event.getKey() != 13) {
                        var form = _this.fpClienteProveedor;
                        _this.checkWindow(opcion, form, winVentAsig, textfield.name, textfield.getValue());
                    }
                }
            }
        });

        this.correo = new Ext.form.TextField({
            maxLength: 50,
            maxLengthText: _this.etiquetas.maxLengthTextCorreo,
            fieldLabel: _this.etiquetas.lbCorreo + ":",
            labelSeparator: '',
            vtype: 'email',
            vtypeText: _this.etiquetas.regexTextCorreo,
            width: '98%',
            name: 'correo',
            enableKeyEvents: true,
            tabIndex: 11,
            listeners: {
                keyup: function (textfield, event) {
                    if (event.getKey() != 13) {
                        var form = _this.fpClienteProveedor;
                        _this.checkWindow(opcion, form, winVentAsig, textfield.name, textfield.getValue());
                    }
                }
            }
        });

        this.stPais = new Ext.data.Store({
            url: 'obtenerPaises',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cant',
                root: 'datos',
                // id: 'idterminodepago'
            }, [
                {name: 'nombrepais'},
                {name: 'idpais'},
                {name: 'codigo'},
            ]),
        });

        this.pais = new Ext.form.ComboBox({
            name: 'pais',
            fieldLabel: 'Pais',
            emptyText: this.etiquetas.emptyText,
            store: this.stPais,
            typeAhead: false,
            pageSize: 15,
            displayField: 'nombrepais',
            valueField: 'idpais',
            queryParam: 'nombrepais',
            loadingText: this.etiquetas.lbCargando,
            queryDelay: 400,
            minChars: 0,
            // value:1,
            // allowBlank: false,
//             forceSelection: true,
            triggerAction: 'all',
            anchor: '98%',
            enableKeyEvents: true,
            listeners:{
                select: function(yo, record){
                    var form = _this.fpClienteProveedor;
                    _this.checkWindow(opcion, form, winVentAsig, yo.name, yo.getValue());
                },
                keydown: function(yo){
                    setTimeout(function () {
//                         console.info('key yeeeee 100',yo.getValue(), '--', yo.getRawValue())
                        if(yo.getRawValue()=='')
                            yo.reset();
                    },100);
                    var form = _this.fpClienteProveedor;
                    _this.checkWindow(opcion, form, winVentAsig, yo.name, yo.getValue());

                },
//                 change: function(yo){
//                     var form = _this.fpClienteProveedor;
//                     _this.checkWindow(opcion, form, winVentAsig, yo.name, yo.getValue());
//                     if(!yo.getValue()){
//                         _this.hfOrganismo.setValue('');
//                     }
//                 }
            }
        });

        this.dpa = new Ext.form.TextField({
            fieldLabel: _this.etiquetas.lbDpa + ':',
            labelSeparator: '',
            anchor: '98%',
            name: 'dpa',
            enableKeyEvents: true,
            tabIndex: 12,
            emptyText: 'Clic para seleccionar',
            listeners: {
                focus: function () {
                    _this.winDpa();
                },
                changedDpa: function (textfield, valueField, displayField) {
                    _this.changeDpaAddress();
                    var form = _this.fpClienteProveedor;
                    _this.checkWindow(opcion, form, winVentAsig, textfield.name, valueField);
                }
            }
        });

        this.dpa.addEvents('changedDpa');

        this.direccion = new Ext.form.TextField({
            name: 'direccion',
            fieldLabel: _this.etiquetas.lbDireccion + ':',
            labelSeparator: '',
            maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\.\#\/\s\,\%\-]+$/,
            regex: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\.\#\/\s\,\%\-]+$/,
            regexText: _this.etiquetas.regexTextDireccion,
            maxLength: 255,
            anchor: '99%',
            enableKeyEvents: true,
            tabIndex: 13,
            margin: '0 0 0 30',
            listeners: {
                keyup: function (textfield, event) {
                    if (event.getKey() != 13) {
                        var form = _this.fpClienteProveedor;
                        _this.checkWindow(opcion, form, winVentAsig, textfield.name, textfield.getValue());
                    }
                },
                change: function () {
                    _this.changeDpaAddress();
                }
            }
        });

        _this.datosSubordinada = [
            {'campo': _this.nombre, 'deshabilitar': false},
            {'campo': _this.codigo, 'deshabilitar': false},
            {'campo': _this.codigoNit, 'deshabilitar': true},
            {'campo': _this.abreviatura, 'deshabilitar': false},
            {'campo': _this.telefono, 'deshabilitar': false},
            {'campo': _this.correo, 'deshabilitar': false},
            {'campo': _this.dpa, 'deshabilitar': false},
            {'campo': _this.direccion, 'deshabilitar': false},
        ];

        function datosSubordinada(activada, records) {
            Ext.each(_this.datosSubordinada, function (valor) {
                var campo = valor['campo'];
                if (activada) {
                    if (!campo.getValue()) {
                        campo.valorSubordinada = records.get(campo.name);
                        campo.setValue(records.get(campo.name));
                        if (campo.name == 'dpa') {
                            campo.valorSubordinada = records.get('descripciondpa');
                            campo.setValue(records.get('descripciondpa'));
                            _this.iddpa = records.get(campo.name);
                        }
                    }
                } else {
                    if (campo.valorSubordinada) {
                        campo.reset();
                        campo.valorSubordinada = null;
                        if (campo.name == 'dpa') _this.iddpa = null;
                    }
                }
                if (valor['deshabilitar']) campo.setDisabled(activada);
            })
        }

        this.stSubordinada = new Ext.data.Store({
            url: 'cargarclientesproveedor',
            baseParams: {'idclasificacion': 1},
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
                id: 'idterminodepago'
            }, [
                {
                    name: 'idclientesproveedores'
                },
                {
                    name: 'nombre'
                },
                'abreviatura', 'direccion', 'codigo',
                'codigonit', 'correo', 'telefono', 'dpa', 'descripciondpa'
            ]),
            listeners: {
                load: function (yo, records, options) {
                    if (records && winVentAsig.id == 'winMod') {
                        records.forEach(function (obj) {
                            if (obj.get('idclientesproveedores') ==
                                _this.pClienteProveedor.smClienteProveedor.getSelected().data.idclientesproveedores) {
                                _this.stSubordinada.remove(obj);
                            }
                        })
                    }
                }
            }
        });

        this.subordinada = new Ext.form.ComboBox({
            name: 'subordinada',
            fieldLabel: _this.etiquetas.lbSubordinada,
            store: this.stSubordinada,
            typeAhead: false,
            pageSize: 20,
            displayField: 'nombre',
            valueField: 'idclientesproveedores',
            queryParam: 'nombre',
            loadingText: this.etiquetas.lbCargando,
            queryDelay: 400,
            triggerAction: 'all',
            regexText: _this.etiquetas.regexTextDireccion,
            minChars: 0,
            maxLength: 255,
            anchor: '99%',
            enableKeyEvents: true,
            tabIndex: 13,
            tpl: '<tpl for="."><div  class="x-combo-list-item" ' +
                'qtip="{nombre} <tpl if="abreviatura">({abreviatura})</tpl>">' +
                '{nombre} </div></tpl>',
            listeners: {
                keydown: function (yo, e) {
//                     console.info('keydown')
                    
                    if (e.getKey() == e.BACKSPACE || e.getKey() == e.DELETE) {
                        setTimeout(function () {
                            if (yo.getRawValue() == '') {
                                datosSubordinada(false);
                                _this.codigo.setDisabled(false);
                                yo.reset();
                                if (_this.tpdDtalles.getComponent('idcontabilidad')) {
                                    _this.gpTabContabilidad.getStore().removeAll();
                                    _this.tpdDtalles.getComponent('idcontabilidad').setTitle(
                                        _this.etiquetas.lbContabilidad
                                    )
                                }
                            }

                        }, 100);
                    }
                    var form = _this.fpClienteProveedor;
                    _this.checkWindow(opcion, form, winVentAsig, yo.name, yo.getValue());
                },
                select: function (yo, record) {
                    if (winVentAsig.id == 'winAdd') {
                        datosSubordinada(true, record);
                        if (_this.tpdDtalles.getComponent('idcontabilidad')) {
                            _this.gpTabContabilidad.getStore().load({
                                params: {idcliente: record.get('idclientesproveedores')},
                                callback: function (records, options, success) {
                                    if (success) {
                                        if (_this.checkEntidad.checked == true) {
                                            if (records.length > 0) {
                                                _this.tpdDtalles.setActiveTab('idcontabilidad');
                                            }
                                            _this.tpdDtalles.getComponent('idcontabilidad').setTitle(
                                                _this.etiquetas.lbContabilidad +
                                                (records.length > 0 ? ' ' + _this.actualizado : '')
                                            )
                                        } else {
                                            _this.gpTabContabilidad.getStore().removeAll();
                                        }
                                    }
                                }
                            });
                        }
                    }
                    var form = _this.fpClienteProveedor;
                    _this.checkWindow(opcion, form, winVentAsig, yo.name, yo.getValue());
                },
            }
        });

        this.dfInicio = new Ext.form.DateField({
            id: 'fechainicio',
            name: 'fechainicio',
            format: 'd/m/Y',
            allowBlank: false,
            vtype: 'daterange',
            value: new Date(),
            selectOnFocus: true,
            anchor: '98%',
            endDateField: 'fechafin',
            fieldLabel: _this.etiquetas.lbFechaInicio,
            maxText: _this.etiquetas.lbMaxText,
            invalidText: _this.etiquetas.lbInvalidTextFormatFecha,
            enableKeyEvents: true,
            tabIndex: 14,
            listeners: {
                change: function () {
                },
                keyup: function (field) {
                    if (Ext.isEmpty(field.getValue())) {
                        _this.dfFin.clearInvalid();
                    }
                }
            }
        });

        this.dfFin = new Ext.form.DateField({
            id: 'fechafin',
            name: 'fechafin',
            format: 'd/m/Y',
            anchor: '98%',
            vtype: 'daterange',
            selectOnFocus: true,
            startDateField: 'fechainicio',
            fieldLabel: _this.etiquetas.lbFechaFin,
            minText: _this.etiquetas.lbMinText,
            invalidText: _this.etiquetas.lbInvalidTextFormatFecha,
            enableKeyEvents: true,
            tabIndex: 15,
            listeners: {
                keyup: function (field) {
                    if (Ext.isEmpty(field.getValue())) {
                        _this.dfInicio.clearInvalid();
                    }
                }
            }
        });
        //
        // this.sflinea = new Ext.form.ComboBox({
        //     fieldLabel: 'Linea',
        //     name: 'idlinea',
        //     // gen: 'm',
        //     // filters: {},
        //     // context: 'gestioncontratomainwindowlinea',
        //     valueField: 'id',
        //     displayField: 'text',
        //     queryParam: 'denominacion',
        //     typeAhead: false,
        //     triggerAction: 'all',
        //     loadingText: this.etiquetas.lbCargando,
        //     // queryMode: 'local',
        //     // editable:false,
        //     store: new Ext.data.Store({
        //         // remoteFilter: false,
        //         // fields: ['id', 'text', 'idnaturaleza'],
        //         url: 'getLineas',
        //         reader: new Ext.data.JsonReader({
        //             totalProperty: 'total',
        //             root: 'data',
        //             // id: 'idterminodepago'
        //         }, [
        //             {name: 'id'},
        //             {name: 'text'},
        //             {name: 'idnaturaleza'},
        //         ]),
        //     }),
        // });

        this.certifico = new Ext.form.FileUploadField({
            width: '97%',
            fieldLabel: _this.etiquetas.lbCertifico,
            name: 'certifico',
            id: 'certifico',
            buttonCfg: {
                iconCls: 'icondistra-subirfichero',
                text: ''
            },
            listeners: {
                scope: this,
                fileselected: function (field, value, storeloaded) {
                    var buttons = winVentAsig.buttons;
                    //si existe la propiedad url y el valor del campo proviene del
                    // store del grid principal y no de un fichero cargado
                    if (field.url && storeloaded) {
                        this.btnDescargar.enable();
                    } else {
                        if (opcion != 'Mod') {
                            buttons[2].enable();
                        }
                        buttons[1].enable();
                        this.btnDescargar.disable();
                    }
                }
            }
        });

        this.btnDescargar = new Ext.Button({
            iconCls: 'descargar',
            tooltip: 'Descargar certifico',
            disabled: true,
            handler: function () {
                var url = _this.certifico.url;
                if (url) {
                    window.open(url);
                }
            }
        });

        // cosa de tab

        this.taDescipcion = new Ext.form.TextArea({
            anchor: '100%',
            name: 'descripcion',
            maxLength: 255,
            enableKeyEvents: true,
            tabIndex: 16,
            listeners: {
                keyup: function (textfield, event) {
                    var form = _this.fpClienteProveedor;
                    _this.checkWindow(opcion, form, winVentAsig, textfield.name, textfield.getValue());
                }
            }
        });

        this.stClasificacionCont = new Ext.data.Store({
            url: 'cargarclasificacioncont',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cant',
                root: 'datos',
                id: 'idclasificacioncontable'
            }, [
                {
                    name: 'idclasificacioncontable'
                },
                {
                    name: 'descripcioncontable'
                }
            ])
        });

        this.clasificacionCont = new Ext.form.ComboBox({
            emptyText: _this.etiquetas.emptyText,
            store: _this.stClasificacionCont,
            fieldLabel: _this.etiquetas.lbClasCont,
            anchor: '98%',
            name: 'idclasificacioncontable',
            resizable: true,
            forceSelection: true,
            triggerAction: 'all',
            editable: true,
            typeAhead: true,
            displayField: 'descripcioncontable',
            valueField: 'idclasificacioncontable',
            mode: 'local',
            tabIndex: 17,
            listeners: {
                select: function (combo) {
                    var form = _this.fpClienteProveedor;
                    _this.checkWindow(opcion, form, winVentAsig, combo.name, combo.getValue());
                }
            }
        });

        this.credito = new Ext.form.NumberField({
            id: 'idcredito', fieldLabel: _this.etiquetas.lbCredito,
            enableKeyEvents: true,
            regex: /^(0\.|[1-9]+\.)?[0-9]+$/,
            regexText: _this.etiquetas.regexTextNumReales,
            maxLength: 19,
            width: '96%',
            name: 'credito',
            enableKeyEvents: true,
            tabIndex: 18,
            listeners: {
                keyup: function (textfield, event) {
                    if (event.getKey() != 13) {
                        var form = _this.fpClienteProveedor;
                        _this.checkWindow(opcion, form, winVentAsig, textfield.name, textfield.getValue());
                    }
                }
            }
        });

        this.stTabContabilidad = new Ext.data.Store({
            url: 'obtenerDatosAdicionales',
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [
                {name: 'id', mapping: 'idcuentabancliente'},
                {name: 'numerocuenta', mapping: 'numerocuenta'},
                {name: 'nombrecuenta', mapping: 'nombrecuenta'},
                {name: 'nombrebanco', mapping: 'nombrebanco'},
                {name: 'idbanco', mapping: 'idbanco'},
                {name: 'numerosucursal', mapping: 'numerosucursal'},
                {name: 'idsucursal', mapping: 'idsucursal'},
                {name: 'codigoiso', mapping: 'codigoiso'},
                {name: 'idmoneda', mapping: 'idmoneda'},
                {name: 'licenciabancaria', mapping: 'licenciabancaria'},
                {name: 'predeterminada', mapping: 'predeterminado'}
            ]),
            listeners: {
                scope: this,
                remove: function (store, record, index) {
                    if (!Ext.isEmpty(record.data.id)) {
                        this.cuentabancoDel.push(record.data.id);
                    }
                },
                update: function (store, record, operation) {
                    this.checkWindow(opcion, this.fpClienteProveedor, winVentAsig, '', true);
                    if (_this.tpdDtalles.getComponent('idcontabilidad').title = _this.etiquetas.lbContabilidad + ' ' + _this.actualizado)
                        _this.tpdDtalles.getComponent('idcontabilidad').setTitle(_this.etiquetas.lbContabilidad);
                },
                add: function (store, records, index) {
                    this.cmbSucursal.disable();
                    this.tflicenciabancaria.disable();
                    this.cmbSucursal.store.removeAll();
                }
            }
        });

        var checkColumn = new Ext.grid.CheckColumn({
            header: _this.etiquetas.lbPredeterminada,
            dataIndex: 'predeterminada',
            width: 90,
            align: 'center'
        });

        this.tfNumCuenta = new Ext.form.TextField({
            allowBlank: false,
            maskRe: /^[0-9\s\.\-]+$/,
            regex: /^([0-9]+([\s\.\-][0-9]+)?)+$/,
            maxLength: 30,
            maskReText: _this.etiquetas.regexNumCuenta,
            regexText: _this.etiquetas.NumCuentainvalido
        });

        this.tfNombCuenta = new Ext.form.TextField({
            allowBlank: false,
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\,\-]+$/,
            regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\,\-]+$/,
            maxLength: 255,
            regexText: _this.etiquetas.regexTextCodigo
        });

        this.stBanco = new Ext.data.Store({
            url: 'cargarBancos',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idbanco'
            }, [
                {
                    name: 'idbanco'
                },
                {
                    name: 'nombrebanco', mapping: 'nombre'
                }
            ])
        });

        this.cmbBanco = new Ext.form.ComboBox({
            store: this.stBanco,
            name: 'banco',
            resizable: true,
            forceSelection: true,
            triggerAction: 'all',
            editable: true,
            allowBlank: true, //noooo -> cambiar
            typeAhead: true,
            displayField: 'nombrebanco',
            valueField: 'idbanco',
            mode: 'local',
            tpl: '<tpl for="."><div  class="x-combo-list-item" ' +
                'qtip="{nombrebanco}">{nombrebanco} </div></tpl>',
            validator: function () {
                if (this.getValue()) {
                    return true;
                }
                return _this.etiquetas.msgBancoInvalido;
            },
            listeners: {
                scope: this,
                select: function (combo) {
                    var idbanco = combo.getValue();
                    this.cmbSucursal.enable();
                    this.cmbSucursal.setValue('');
                    this.cmbSucursal.setRawValue('');
                    this.loadSucursal(idbanco);
                }
            }
        });

        this.stBanco.load();

        this.stSucursal = new Ext.data.Store({
            url: 'cargarSucursales',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idsucursal'
            }, [
                {
                    name: 'idsucursal'
                },
                {
                    name: 'numerosucursal', mapping: 'numero'
                }
            ])
        });

        this.cmbSucursal = new Ext.form.ComboBox({
            store: this.stSucursal,
            name: 'sucursal',
            resizable: true,
            disabled: true,
            forceSelection: true,
            triggerAction: 'all',
            editable: true,
            typeAhead: true,
            allowBlank: true,
            validator: function () {
                if (this.getValue()) {
                    return true;
                }
                return _this.etiquetas.msgSucursalInvalida;
            },
            displayField: 'numerosucursal',
            valueField: 'idsucursal',
            mode: 'local',
            listeners: {
                scope: this,
                show: function (combo) {
                    var record = this.stTabContabilidad.getAt(this.indexEdited);
                    if (record) {
                        var nombre = record.data.numerosucursal;
                        var id = record.data.idsucursal;
                        var idbanco = record.data.idbanco;
                        if (combo.store.getCount() == 0 && idbanco) {
                            this.loadSucursal(idbanco);
                        }
                        if (nombre) {
                            this.setComboValue(combo, nombre, id);
                        }

                    }
                },
                enable: function (combo) {
                    if (!this.cmbSucursal.getValue()) {
                        combo.markInvalid();
                    }
                }
            }
        });

        this.stMoneda = new Ext.data.Store({
            url: 'cargarMonedas',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cant',
                root: 'datos',
                id: 'idmoneda'
            }, [
                {
                    name: 'idmoneda'
                },
                {
                    name: 'codigoiso'
                }
            ]),
            listeners: {
                scope: this,
                load: function () {
                    var field = this.gpTabContabilidad.getColumnModel().getCellEditor(4, this.indexEdited).field;
                    var idmoneda = field.getValue();
                    if (idmoneda) {
                        this.selectById(idmoneda, 'idmoneda', this.stMoneda, this.smMoneda);
                    }
                }
            }
        });

        this.smMoneda = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.sfMoneda = new Ext.Cont.SearchField({
            width: 191,
            emptyText: this.etiquetas.lbCriterioBuscar,
            searchTooltip: this.etiquetas.tooltipbuscar,
            regex: /([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+/,
            maskRe: /([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+/,
            fnOnSearch: function () {
                _this.searchConcept(_this.stMoneda, _this.sfMoneda);
            },
            fnOnClear: function () {
                _this.clearField(_this.stMoneda);
            }
        });

        this.gpMoneda = new Ext.grid.GridPanel({
            loadMask: this.etiquetas.lbCargando,
            height: 200,
            frame: false,
            border: false,
            stripeRows: true,
            autoExpandColumn: 'expandir',
            store: this.stMoneda,
            sm: this.smMoneda,
            enableColumnHide: true,
            floating: false,
            hideHeaders: true,
            viewConfig: {
                forceFit: true
            },
            columns: [
                {
                    hidden: true,
                    dataIndex: 'idmoneda',
                    hideable: false
                },
                {
                    id: 'expandir',
                    dataIndex: 'codigoiso',
                    sortable: true
                }
            ],
            tbar: [this.sfMoneda],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                displayInfo: false,
                store: this.stMoneda
            }),
            listeners: {
                scope: this,
                rowclick: function (grid, index, event) {
                    var cant = this.smMoneda.getCount();
                    var data = this.smMoneda.getSelected().data;
                    if (cant == 1) {
                        this.cmbMoneda.setValue(data.codigoiso);
                        this.cmbMoneda.value = data.idmoneda;
                        this.cmbMoneda.fireEvent('select', _this.cmbMoneda, data);
                        this.cmbMoneda.collapse();
                    }
                }
            }
        });

        this.cmbMoneda = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: [{name: 'idmoneda'}, {name: 'codigoiso'}],
                data: [[]]
            }),
            id: 'cmbMoneda',
            triggerAction: 'all',
            editable: false,
            allowBlank: false,
            displayField: 'codigoiso',
            valueField: 'idmoneda',
            mode: 'local',
            tpl: '<div id = \"ctMoneda\" style = \"height:200px; !important;\"></div>',
            listeners: {
                scope: this,
                select: function (yo, record) {
                    if (record['codigoiso'].toLowerCase() != 'cuc') {
                        _this.tflicenciabancaria.valorAnterior = _this.tflicenciabancaria.getValue();
                        _this.tflicenciabancaria.reset();
                    } else {
                        _this.tflicenciabancaria.setValue(_this.tflicenciabancaria.valorAnterior);
                    }
                     //_this.tflicenciabancaria.allowBlank = record['codigoiso'].toLowerCase() != 'cuc';
                      _this.tflicenciabancaria.validate();
                     _this.tflicenciabancaria.setDisabled(record['codigoiso'].toLowerCase() != 'cuc');
                },
                show: function (combo) {
                    var record = this.stTabContabilidad.getAt(this.indexEdited);
                    if (record) {
                        var nombre = record.data.codigoiso;
                        var id = record.data.idmoneda;
                        if (nombre) {
                            this.setComboValue(combo, nombre, id);
                        }
                    }
                },
                expand: function (combo) {
                    this.gpMoneda.render('ctMoneda');
                    setTimeout(function () {
                        _this.sfMoneda.focus();
                    }, 5);
                    if (this.stMoneda.getCount() == 0) {
                        this.stMoneda.load({
                            params: {
                                start: 0,
                                limit: 20
                            }
                        });
                    } else {
                        var id = combo.getValue();
                        this.selectById(id, 'idmoneda', this.stMoneda, this.smMoneda);
                    }

                }
            }
        });

        this.tflicenciabancaria = new Ext.form.TextField({
            allowBlank: true,
            maxLength: 255,
            regex: /^[A-Z][0-9]{10}$/,
            regexText: _this.etiquetas.regexTextLicenciaBancaria,
            listeners: {
                change: function (yo, valor) {
                    yo.setValue(valor.toUpperCase())
                }
            }
        });

        this.cmTabContabilidad = new Ext.grid.ColumnModel({
            columns: [
                {
                    header: this.etiquetas.lbNumCuenta,
                    dataIndex: 'numerocuenta',
                    width: 160,
                    editor: this.tfNumCuenta
                },
                {
                    header: this.etiquetas.lbNombCuenta,
                    dataIndex: 'nombrecuenta',
                    width: 170,
                    editor: this.tfNombCuenta
                },
                {
                    header: this.etiquetas.lbNomBanco,
                    dataIndex: 'idbanco',
                    width: 150,
                    editor: this.cmbBanco,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (!Ext.isEmpty(value)) {
                            return record.data.nombrebanco
                        }
                        return value;
                    }
                },
                {
                    header: this.etiquetas.lbNomSucursal,
                    dataIndex: 'idsucursal',
                    width: 120,
                    editor: this.cmbSucursal,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (!Ext.isEmpty(value)) {
                            return record.data.numerosucursal
                        }
                        return value;
                    }
                },
                {
                    header: this.etiquetas.lbNomMoneda,
                    dataIndex: 'idmoneda',
                    width: 140,
                    editor: this.cmbMoneda,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (!Ext.isEmpty(value)) {
                            return record.data.codigoiso
                        }
                        return value;
                    }
                },
                {
                    header: this.etiquetas.lbLicenciaBancaria,
                    dataIndex: 'licenciabancaria',
                    width: 110,
                    editor: this.tflicenciabancaria,
                },
                checkColumn
            ]
        });

        this.gpTabContabilidad = new Ext.Conf.ModContb.GridEditor({
            region: 'center',
            border: false,
            plugins: checkColumn,
            width: 964,
            store: _this.stTabContabilidad,
            cm: _this.cmTabContabilidad,
            saveText: this.etiquetas.lbBtnAceptar,
            saveTooltip: this.etiquetas.lbBtnAceptarRe,
            cancelText: this.etiquetas.lbBtnCancelar,
            cancelTooltip: this.etiquetas.lbBtnCancelarRe,
            iconSave: 'aceptar',
            textbtnadd: this.etiquetas.lbBtnAdicionar,
            tooltipbtnadd: this.etiquetas.lbTtAddCuenta,
            tooltipbtndel: this.etiquetas.lbTtDelCuenta,
            loadMask: true
        });

        this.gpTabContabilidad.on(
            {
                render: function () {
                    this.getView().mainBody.on('mousedown', function (e, t) {
                        _this.desmarcarCasillas(this, 'predeterminada', t);
                    }, this);
                }
            }
        );

        this.gpTabContabilidad.roweditor.on(
            {
                scope: this,
                validateedit: function (roweditor, grid, changes, record, rowIndex) {
                    var existe = this.existeRecord(grid.getStore(), record, changes, grid.getColumnModel());
                    if (existe) {
                        mostrarMensaje(1, this.etiquetas.lbExisteCuentaBanco);
                        return false;
                    }
                },
                afteredit: function (roweditor, grid, changes, record, rowIndex) {
                    this.setRecordValues(record, grid, rowIndex);
                    if (rowIndex == 0 && grid.getStore().getCount() == 1) {
                        record.set('predeterminada', true);
                    }
                },
                beforeedit: function (roweditor, grid, record, index) {
                    this.indexEdited = index;
                    _this.tflicenciabancaria.setDisabled(record.get('codigoiso') != 'CUC');
                }
            }
        );

        this.stCodigo = new Ext.data.Store({
            autoLoad: true,
            url: 'obtenerIdCodigos',
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data'
            }, [
                {name: 'idtipocodigo'},
                {name: 'denominacion'}
            ]),
            listeners: {
                load: function (store, records, success) {
                    var aux = new Array();
                    if (success) {
                        Ext.each(records, function (value) {
                            aux.push(value.data);
                        })
                    }
                    _this.stCodigo.arrayIdFiscales = aux;
                }
            }
        });

        this.cmbCodigo = new Ext.form.ComboBox({
            fieldLabel: _this.etiquetas.lbCredito,
            allowBlank: false,
            blankText: _this.etiquetas.textCampoObligatorio,
            emptyText: this.etiquetas.emptyText,
            name: 'idcodigo',
            store: _this.stCodigo,
            typeAhead: true,
            pageSize: 10,
            displayField: 'denominacion',
            valueField: 'idtipocodigo',
            queryParam: 'denominacion',
            loadingText: this.etiquetas.lbCargando,
            queryDelay: 400,
            minChars: 0,
            forceSelection: true,
            triggerAction: 'all',
            anchor: '98%',
            mode: 'local',
            validator: function () {
                if (this.getValue()) {
                    return true;
                }
                return _this.etiquetas.msgIdentificadorInvalido;
            },
        });

        this.tfCodigo = new Ext.form.TextField({
            allowBlank: false,
            maxLength: 50,
            maxText: _this.etiquetas.maxLengthTexCorreo
        });

        this.stIdentificadores = new Ext.data.Store({
            url: 'cargarCodigos',
            reader: new Ext.data.JsonReader({
                    root: 'data'
                },
                ['ididentificador', 'denominacion', 'idtipocodigo', 'codigonombre']),
            listeners: {
                remove: function (store, record, index) {
                    if (!Ext.isEmpty(record.data.ididentificador)) {
                        _this.identificadoresDel.push(record.data.ididentificador);
                    }
                    _this.modificarTituloCant(_this.identificadores, 'Identificadores', store.getCount());
                },
                update: function (store, record, operation) {
                    _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, '', true);
                    _this.modificarTituloCant(_this.identificadores, 'Identificadores', store.getCount());
                },
                datachanged: function(yo){
                    _this.modificarTituloCant(_this.identificadores, 'Identificadores', yo.getCount());
                }
            }
        });

        this.cmIdentificadores = new Ext.grid.ColumnModel({
            columns: [
                {
                    header: this.etiquetas.lbID,
                    dataIndex: 'idtipocodigo',
                    width: 430,
                    editor: this.cmbCodigo,
                    renderer: function (value, metaData, record) {
                        if (record.get('codigonombre') == undefined || record.get('codigonombre') == '') {
                            if (_this.stCodigo.arrayIdFiscales) {
                                for (var i in _this.stCodigo.arrayIdFiscales) {
                                    if (record.get('idtipocodigo') == _this.stCodigo.arrayIdFiscales[i]['idtipocodigo']) {
                                        record.set('codigonombre', _this.stCodigo.arrayIdFiscales[i]['denominacion']);
                                        break;
                                    }
                                }
                            }
                        }
                        return record.get('codigonombre');
                    }
                },
                {
                    header: this.etiquetas.lbCodigo,
                    dataIndex: 'denominacion',
                    width: 430,
                    editor: this.tfCodigo
                }
            ]
        });

        this.identificadores = new Ext.Conf.ModContb.GridEditor({
            title: 'Identificadores',
            region: 'center',
            border: false,
            width: 964,
            store: _this.stIdentificadores,
            cm: _this.cmIdentificadores,
            saveText: this.etiquetas.lbBtnAceptar,
            saveTooltip: this.etiquetas.lbBtnAceptarRe,
            cancelText: this.etiquetas.lbBtnCancelar,
            cancelTooltip: this.etiquetas.lbBtnCancelarRe,
            iconSave: 'aceptar',
            textbtnadd: this.etiquetas.lbBtnAdicionar,
            tooltipbtnadd: this.etiquetas.lbTtAddIdentificador,
            tooltipbtndel: this.etiquetas.lbTtDelIdentificador
        })

        if (this.existeCont) {
            this.cmpCuenta = new Ext.Cont.Cuentas({
                id: 'cmpCuenta'
            });
        }

        this.cmbCuentas = new Ext.form.ComboBox({
            name: 'cuenta',
            emptyText: _this.etiquetas.emptyText,
            store: new Ext.data.SimpleStore({
                fields: [{name: 'idcuenta'}, {name: 'nombrecuenta'}],
                data: [[]]
            }),
            editable: false,
            allowBlank: false,
            readOnly: true,
            lazyRender: true,
            resizable: true,
            valueField: 'idcuenta',
            displayField: 'nombrecuenta',
            triggerAction: 'all',
            mode: 'local',
            tpl: '<div id = \"cmbCuentas\" style = \"height:200px; !important;\"></div>',
//             tpl: '<tpl for="."><div  class="x-combo-list-item" ' +
//                 'qtip="{nombrecuenta}">{nombrecuenta} </div></tpl>',
            listeners: {
                show: function (combo) {
                    var record = _this.stCobrosPagos.getAt(_this.indexEdited);
                    if (record) {
                        var nombre = record.data.nombrecuenta;
                        var id = record.data.idcuenta;
                        if (nombre) {
                            _this.setComboValue(combo, nombre, id);
                        }
                    }
                },
                expand: function (combo) {
                    if (_this.existeCont) {
                        setTimeout(function () {
                            _this.cmpCuenta.sfBuscarCuentas.focus();
                        }, 5);
                        _this.cmpCuenta.tpCuentas.on({
                            render: function () {
                                this.getSelectionModel().on(
                                    {
                                        selectionchange: function (sm, node) {
                                            if (this.isSelected(node) && node.id != 0) {
                                                var idmoneda = node.attributes.idmoneda,
                                                    codigoiso = node.attributes.codigoiso;
                                                _this.cmbCuentas.setValue(node.attributes.id);
                                                _this.cmbCuentas.setRawValue(node.attributes.concatcta + ' ' + node.attributes.descripcion);
                                                _this.cmbCuentas.fireEvent('select', _this.cmbCuentas, node.attributes)
                                                _this.cmbCuentas.collapse();
                                                if (codigoiso && idmoneda) {
                                                    _this.cmbMonedaCuenta.setValue(idmoneda);
                                                    _this.cmbMonedaCuenta.setRawValue(codigoiso);
//                                                     _this.cmbMonedaCuenta.disable();
                                                }
                                            }
                                        }
                                    }
                                );
                            }
                        });

                        _this.cmpCuenta.tpCuentas.getLoader().on(
                            {
                                load: function () {
                                    _this.cmpCuenta.sfBuscarCuentas.onTrigger1Click = function () {
                                        this.triggers[0].hide();
                                        if (this.hasSearch) {
                                            this.el.dom.value = '';
                                            this.reset();
                                            this.hasSearch = false;
                                            if (!_this.cmpCuenta.busyRequest) {
                                                _this.cmpCuenta.fLoadTreeLoader();
                                                this.triggerBlur();
                                                this.blur();
                                            }
                                        } else {
                                            this.el.dom.value = '';
                                            this.reset();
                                            this.triggerBlur();
                                            this.blur();
                                            this.hasSearch = false;
                                        }
                                    }
                                    _this.cmpCuenta.sfBuscarCuentas.triggers[0].on(
                                        {
                                            click: function () {
                                                _this.cmpCuenta.sfBuscarCuentas.onTrigger1Click();
                                            }
                                        }
                                    );
                                }
                            }
                        );
                        _this.cmpCuenta.tpCuentas.setHeight(200);
                        _this.cmpCuenta.tpCuentas.render('cmbCuentas');
                    }
                },
                select: function (combo) {
                }
            }
        });

        this.cmbClasificacion = new Ext.form.ComboBox({
            name: 'clasificacion',
            allowBlank: false,
            emptyText: _this.etiquetas.emptyText,
            store: new Ext.data.SimpleStore({
                fields: ['idclasificacion', 'clasificacion'],
                data: [[1, _this.etiquetas.lbCtaCobrar], [2, _this.etiquetas.lbCtaPagar], [3, _this.etiquetas.lbCtaCobrarAnticipado], [4, _this.etiquetas.lbCtaPagarAnticipado], [5, _this.etiquetas.lbAdeudoPresupuesto], [6, _this.etiquetas.lbPagoFiscal]]
            }),
            displayField: 'clasificacion',
            valueField: 'idclasificacion',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            editable: false,
            tpl: '<tpl for="."><div  class="x-combo-list-item" ' +
                'qtip="{clasificacion}">{clasificacion} </div></tpl>',
            // listeners:{
            //     select: function(yo, record){
            //             _this.cmbOperacion.setDisabled(true);
            //             _this.cmbOperacion.reset();
            //             _this.stOperacion.baseParams['start']=0;
            //              _this.stOperacion.baseParams['limit']=10;
            //         if(record.data.idclasificacion == 1){
            //             _this.stOperacion.baseParams['idsubsistema']=13;
            //             _this.stOperacion.baseParams['iddocumento']=undefined;
            //             _this.stOperacion.baseParams['documento']=undefined;
            //         }else if(record.data.idclasificacion == 2){
            //             _this.stOperacion.baseParams['idsubsistema']=10;
            //             _this.stOperacion.baseParams['iddocumento']=99000736;
            //             _this.stOperacion.baseParams['documento']=1;
            //         }else{
            //             _this.stOperacion.baseParams['idsubsistema']=undefined;
            //             _this.stOperacion.baseParams['iddocumento']=undefined;
            //             _this.stOperacion.baseParams['documento']=undefined;
            //         }
            //         _this.stOperacion.idclasificacion=record.data.idclasificacion;
            //         _this.stOperacion.load();
            //     }
            // }
        });

        this.stMonedaCuenta = new Ext.data.Store({
            url: 'cargarMonedas',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cant',
                root: 'datos',
                id: 'idmoneda'
            }, [
                {
                    name: 'idmoneda'
                },
                {
                    name: 'codigoiso'
                }
            ])
        });

        this.cmbMonedaCuenta = new Ext.form.ComboBox({
            emptyText: this.etiquetas.emptyText,
            name: 'idterminodepago',
            store: this.stMonedaCuenta,
            typeAhead: true,
            displayField: 'codigoiso',
            valueField: 'idmoneda',
            loadingText: this.etiquetas.lbCargando,
            allowBlank: false,
            forceSelection: true,
            triggerAction: 'all',
            anchor: '100%',
            enableKeyEvents: true,
            listeners: {
                scope: this,
                show: function (combo) {
                    var record = _this.stCobrosPagos.getAt(_this.indexEdited);
                    if (record) {
                        var nombre = record.data.codigoiso;
                        var id = record.data.idmoneda;
                        if (nombre) {
                            _this.setComboValue(combo, nombre, id);
                        }
                    }
                }
            }
        });

        this.stCondicion = new Ext.data.Store({
            url: 'obtenerCondicionesPago',
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'idterminodepago'
            }, [
                {
                    name: 'idterminodepago'
                },
                {
                    name: 'nombreterminodepago', mapping: 'nombre'
                }
            ])
        });

        this.cmbCondicion = new Ext.form.ComboBox({
            emptyText: this.etiquetas.emptyText,
            name: 'idterminodepago',
            store: this.stCondicion,
            typeAhead: false,
            pageSize: 10,
            displayField: 'nombreterminodepago',
            valueField: 'idterminodepago',
            queryParam: 'denominacion',
            loadingText: this.etiquetas.lbCargando,
            queryDelay: 400,
            minChars: 0,
            allowBlank: false,
            forceSelection: true,
            triggerAction: 'all',
            anchor: '100%',
            enableKeyEvents: true,
            tpl: '<tpl for="."><div  class="x-combo-list-item" ' +
                'qtip="{nombreterminodepago}">{nombreterminodepago} </div></tpl>',
            // tpl: '<tpl for="."><div class="x-combo-list-item' + '{[values.checkedd ?" x-combo-seleccionado":""]}' + '">' +
            //     ' {denominacion}</div></tpl>',
            // onSelect: function (record, index, checked) {
            //     console.log('!!!!!onSelect condicion', record, index, checked)
            //     console.log('cmbCondicion', _this.cmbCondicion.getValue())
            //     if (this.fireEvent('beforeselect', this, record, index) !== false) {
            //         var field = this.valueField || this.displayField;
            //         if(_this.cmbCondicion.getValue()){
            //             console.log('index:', index)
            //             let record = _this.stCobrosPagos.getRange();
            //             console.log('record:', _this.stCobrosPagos.getCount(), record)
            //             // let newData = {...record.data, idterminodepago: record.data.idterminodepago }
            //             // console.log('newData:', newData)
            //             // _this.stCobrosPagos.add(newData);
            //         }else{
            //             this.setValue(record.data[field]);
            //         }
            //     }
            // },
            listeners: {
                scope: this,
                show: function (combo) {
                    var record = _this.stCobrosPagos.getAt(_this.indexEdited);
                    if (record) {
                        var nombre = record.data.nombreterminodepago;
                        var id = record.data.idterminodepago;
                        if (nombre) {
                            _this.setComboValue(combo, nombre, id);
                        }
                    }
                }
            }
        });

        // this.stOperacion = new Ext.data.Store({
        //     url: 'obtenerOperaciones',
        //     reader: new Ext.data.JsonReader({
        //         totalProperty: 'cant',
        //         root: 'data',
        //         id: 'idoperacion'
        //     }, [
        //         {
        //             name: 'idoperacionesentidad'
        //         },
        //         {
        //             name: 'nombreoperacion', mapping: 'denominacion'
        //         }
        //     ]),
        //     listeners:{
        //             load: function(yo){
        //                  _this.cmbOperacion.setDisabled(!(yo.idclasificacion == 1 || yo.idclasificacion == 2));
        //             }
        //     }
        // });

//         this.cmbOperacion = new Ext.form.ComboBox({
//             emptyText: this.etiquetas.emptyText,
//             name: 'idoperacion',
//             store: this.stOperacion,
//             typeAhead: false,
//             pageSize: 10,
//             displayField: 'nombreoperacion',
//             valueField: 'idoperacionesentidad',
//             queryParam: 'denominacion',
//             loadingText: this.etiquetas.lbCargando,
//             queryDelay: 400,
//             minChars: 0,
// //             allowBlank: false,
//             forceSelection: true,
//             triggerAction: 'all',
//             anchor: '100%',
//             enableKeyEvents: true,
//             disabled:true,
//             tpl: '<tpl for="."><div  class="x-combo-list-item" ' +
//                 'qtip="{nombreoperacion}">{nombreoperacion} </div></tpl>',
//             listeners: {
//                 scope: this,
//                 show: function (combo) {
//                     var record = _this.stCobrosPagos.getAt(_this.indexEdited);
//                     if (record) {
//                         var nombre = record.data.nombreoperacion;
//                         var id = record.data.idoperacionesentidad;
//                         if (nombre) {
//                             _this.setComboValue(combo, nombre, id);
//                         }
//                     }
//                 }
//             }
//         });

        this.stCobrosPagos = new Ext.data.SimpleStore({
            fields: [
                {name: 'id', mapping: 'idclienteproveedorcobropago'},
                {name: 'idcuenta', mapping: 'idcuenta'},
                {name: 'nombrecuenta', mapping: 'nombrecuenta'},
                {name: 'idclasificacion', mapping: 'idclasificacion'},
                {name: 'idmoneda', mapping: 'idmoneda'},
                {name: 'codigoiso', mapping: 'codigoiso'},
                {name: 'idterminodepago', mapping: 'idterminodepago'},
                {name: 'nombreterminodepago', mapping: 'nombreterminodepago'},
                {name: 'idoperacionesentidad', mapping: 'idoperacionesentidad'},
                {name: 'nombreoperacion', mapping: 'nombreoperacion'},
            ],
            listeners: {
                scope: this,
                remove: function (store, record, index) {
                    if (!Ext.isEmpty(record.data.id)) {
                        this.cuentaPagarCobrarDel.push(record.data.id);
                    }
                    _this.modificarTituloCant(_this.gpCobrospagos, _this.etiquetas.lbCobrosPagos, store.getCount());
                },
                update: function (store, record, operation) {
                    this.checkWindow(opcion, this.fpClienteProveedor, winVentAsig, '', true);
                    _this.modificarTituloCant(_this.gpCobrospagos, _this.etiquetas.lbCobrosPagos, store.getCount());
                },
                add: function (store, records, index) {
                    // this.cmbOperacion.disable();
                },
                datachanged: function(yo){
                    _this.modificarTituloCant(_this.gpCobrospagos, _this.etiquetas.lbCobrosPagos, yo.getCount());
                }
            }
        });

        this.cmCobrosPagos = new Ext.grid.ColumnModel({
            columns: [
                {
                    header: this.etiquetas.lbCuenta,
                    dataIndex: 'idcuenta',
                    width: 190,
                    editor: this.cmbCuentas,
                    id: 'expandir',
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (!Ext.isEmpty(value)) {
                            return record.data.nombrecuenta
                        }
                        return value;
                    }
                },
                {
                    header: this.etiquetas.lbClasificacion,
                    dataIndex: 'idclasificacion',
                    width: 230,
                    editor: this.cmbClasificacion,
                    renderer: function (value) {
                        if (value) {
                            var index = _this.cmbClasificacion.store.find('idclasificacion', value);
                            if (index != -1) {
                                value = _this.cmbClasificacion.store.getAt(index).data.clasificacion;
                            }
                        }
                        return value;
                    }
                },
                {
                    header: this.etiquetas.lbNomMoneda,
                    dataIndex: 'idmoneda',
                    width: 100,
                    editor: this.cmbMonedaCuenta,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (!Ext.isEmpty(value)) {
                            return record.data.codigoiso
                        }
                        return value;
                    }
                },
                {
                    header: this.etiquetas.lbCondicionPago,
                    dataIndex: 'idterminodepago',
                    width: 250,
                    editor: this.cmbCondicion,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (!Ext.isEmpty(value)) {
                            return record.data.nombreterminodepago
                        }
                        return value;
                    }
                },
                // {
                //     header: this.etiquetas.lbOperacion,
                //     dataIndex: 'idoperacionesentidad',
                //     width: 180,
                //     editor: this.cmbOperacion,
                //     renderer: function (value, metaData, record, rowIndex, colIndex) {
                //         if (!Ext.isEmpty(value)) {
                //             return record.data.nombreoperacion
                //         }
                //         return value;
                //     }
                // }
            ]
        });

        this.gpCobrospagos = new Ext.Conf.ModContb.GridEditor({
            region: 'center',
            id: 'idcobrospagos',
            border: false,
            width: 964,
            store: _this.stCobrosPagos,
            cm: _this.cmCobrosPagos,
            saveText: this.etiquetas.lbBtnAceptar,
            saveTooltip: this.etiquetas.lbBtnAceptarRe,
            cancelText: this.etiquetas.lbBtnCancelar,
            cancelTooltip: this.etiquetas.lbBtnCancelarRe,
            iconSave: 'aceptar',
            textbtnadd: this.etiquetas.lbBtnAdicionar,
            tooltipbtnadd: this.etiquetas.lbTtAddCuentaPagarCobrar,
            tooltipbtndel: this.etiquetas.lbTtDelCuentaPagarCobrar,
            showduplicar: true,
            title: this.etiquetas.lbCobrosPagos,
            autoExpandColumn: 'expandir'
        });

        this.gpCobrospagos.roweditor.on(
            {
                scope: this,
                validateedit: function (roweditor, grid, changes, record, rowIndex) {
                    var existe = this.existeRecord(grid.getStore(), record, changes, grid.getColumnModel());
                    if (existe) {
                        mostrarMensaje(1, this.etiquetas.lbExisteCuentaPagarCobrar);
                        return false;
                    }
                    var existecondicionpago=this.validaCondPago(grid.getStore(), changes);
                    if(existecondicionpago){
                        mostrarMensaje(1, this.etiquetas.lbExisteConfiguracionCondPago);
                        return false;    
                    }

                },
                afteredit: function (roweditor, grid, changes, record, rowIndex) {
                    this.setRecordValues(record, grid, rowIndex);
                },
                beforeedit: function (roweditor, grid, record, index) {
                    this.indexEdited = index;
//                     _this.cmbOperacion.setDisabled(!(record.get('idclasificacion') == 1 || record.get('idclasificacion') == 2));
                }
            }
        );

        this.stTabPago = new Ext.data.Store({
            url: 'obtenerDatosAdicionales',
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [
                {name: 'id'},
                {name: 'pago'},
                {name: 'predeterminada'}
            ]),
            listeners:{
                remove: function(yo){
                    _this.modificarTituloCant(_this.gpTabPago, _this.etiquetas.lbTerPago, yo.getCount());
                },
                update: function(yo){
                    _this.modificarTituloCant(_this.gpTabPago, _this.etiquetas.lbTerPago, yo.getCount());
                },
                datachanged: function(yo){
                    _this.modificarTituloCant(_this.gpTabPago, _this.etiquetas.lbTerPago, yo.getCount());
                }
            }
        });

        var checkColumn1 = new Ext.grid.CheckColumn({
            header: _this.etiquetas.lbPredeterminada,
            dataIndex: 'predeterminada',
            width: 90,
            align: 'center'
        });

        this.cmTabPago = new Ext.grid.ColumnModel({
            columns: [
                {
                    header: _this.etiquetas.lbTerPago,
                    id: 'pago',
                    dataIndex: 'pago',
                    width: 300,
                    editor: this.tfPago = new Ext.form.TextField({
                        allowBlank: false
                    })
                },
                checkColumn1
            ]
        });

        this.gpTabPago = new Ext.Conf.ModContb.GridEditor({
            height: 125,
            id: 'gpTabPago',
            hidden: true,
            title: _this.etiquetas.lbTerPago,
            border: false,
            autoExpandColumn: 'pago',
            plugins: checkColumn1,
            width: 220,
            store: _this.stTabPago,
            cm: _this.cmTabPago
        });

        this.gpTabPago.on(
            {
                render: function () {
                    this.getView().mainBody.on('mousedown', function (e, t) {
                        _this.desmarcarCasillas(this, 'predeterminada', t);
                    }, this);
                }
            }
        );

        this.gpTabPago.roweditor.on(
            {
                validateedit: function (roweditor, grid, changes, record, rowIndex) {
                    var existe = _this.existeRecord(grid.getStore(), record, changes, grid.getColumnModel());
                    if (existe) {
                        mostrarMensaje(1, 'Esta fila ya existe en el grid');
                        return false;
                    }
                },
                afteredit: function (roweditor, grid, changes, record, rowIndex) {
                    if (rowIndex == 0 && grid.getStore().getCount() == 1) {
                        record.beginEdit();
                        record.set('predeterminada', true);
                        record.endEdit();
                    }
                },
                canceledit: function (roweditor, record, rowIndex) {
                    var store = _this.stTabPago;
                    if (Ext.isEmpty(record.data['pago'])) {
                        store.remove(store.getAt(rowIndex));
                    }
                }
            }
        );

        this.cmbLineas = new Ext.form.ComboBox({
            name: 'linea',
            emptyText: _this.etiquetas.emptyText,
            // store: new Ext.data.SimpleStore({
            //     fields: [{name: 'idlinea'}, {name: 'linea'}],
            //     data: [[ 1,  'Linea 1'],[ 2, 'Linea 2']]
            // }),
            store: new Ext.data.Store({
                // remoteFilter: false,
                // fields: ['id', 'text', 'idnaturaleza'],
                url: 'getLineas',
                reader: new Ext.data.JsonReader({
                    totalProperty: 'total',
                    root: 'datos',
                    id: 'idnaturaleza'
                }, [
                    {name: 'idlinea', mapping: 'id'},
                    {name: 'linea', mapping: 'text'},
                    // {name: 'id', mapping: 'idlinea'},
                    // {name: 'text', mapping: 'linea'},
                    {name: 'denominacion'},
                    {name: 'idnaturaleza'},
                    {name: 'checked', type: 'boolean', defaultValue: false}
                ])
            }),
            editable: false,
            allowBlank: false,
            readOnly: true,
            // lazyRender: true,
            // resizable: true,
            // displayField: 'linea',
            // valueField: 'idlinea',
            valueField: 'idnaturaleza',
            displayField: 'denominacion',
            triggerAction: 'all',
            loadingText: this.etiquetas.lbCargando,
            tpl: '<tpl for="."><div  class="x-combo-list-item '+'{[values.checked ?" x-combo-seleccionado":""]}'+'" ' +
            'qtip="{denominacion}">{denominacion} </div></tpl>',
            multiSelect: true,
            enableKeyEvents: true,
            checkField: 'checked',
            checkedClass: 'x-combo-checked',
            selectedClass: 'x-combo-selected',
            seleccionados: [],
            clearValue: function () {
                    console.log('ms clearValue')
                if (this.multiSelect) {
                    var v = this.value;
                    var field = this.valueField || this.displayField;
                    v = v && v.split(this.separator) || [];
                    this.store.clearFilter();
                    v.length && this.store.each(function (r) {
                        var idx;
                        if ((idx = v.indexOf(r.data[field])) != -1) {
                            r.set(this.checkField, false);
                            v.splice(idx, 1);
                            if (!v.length) {
                                return false;
                            }
                        }
                    }, this);
                }
                if (this.hiddenField) {
                    this.hiddenField.value = '';
                }
                this.setRawValue('');
                this.lastSelectionText = '';
                this.applyEmptyText();
                this.value = '';
            },
            onLoad: function () {
                    console.log('ms onLoad ->', this.seleccionados)
                var me = this;
                if (!this.hasFocus) {
                    return;
                }
                if (this.store.getCount() > 0) {
                    this.expand();
                    this.restrictHeight();
                    if (this.lastQuery == this.allQuery) {
                        if (this.editable) {
                            this.multiSelect ? this.selectText(this.getRawValue().length) : this.el.dom.select();
                        }
                        if (!this.selectByValue(this.value, true)) {
                            this.select(0, true);
                        }
                        if (this.multiSelect && Ext.isArray(this.value) && this.value.length != 0) {
                            this.seleccionados = [];
                            Ext.each(this.value, function (rec) {
                                if (rec.data) {
                                    rec.toString = () => {return rec.data[me.displayField]};
                                    var value = rec.data[this.valueField],
                                        index = this.store.findBy(function(r){
                                            return r.data[this.valueField] == value;
                                        },this);
                                    if (index != -1) {
                                        var record = this.store.getAt(index);
                                        this.onSelect(record, index, true);
                                    }
                                }
                            }, this);
                        }
                    } else {
                        this.selectNext();
                        if (this.typeAhead && this.lastKey != Ext.EventObject.BACKSPACE && this.lastKey != Ext.EventObject.DELETE) {
                            this.taTask.delay(this.typeAheadDelay);
                        }
                    }
                } else {
                    this.onEmptyResults();
                }
            },
            onSelect: function (record, index, checked) {
                console.log('ms onSelect', record.data.checked, record, index, checked)
                var me = this;
                if (this.fireEvent('beforeselect', this, record, index) !== false) {
                    var field = this.valueField || this.displayField;
                    record.toString = () => {return record.get(me.displayField)};
                    if (this.multiSelect) {
                        var val =  checked ||!record.get(this.checkField);
                        record.set(this.checkField, val);
                        var seleccionados = me.seleccionados, finded = undefined;
                        Ext.each(seleccionados, function (valor) {
                            if (valor.get(me.valueField) == record.get(me.valueField)) {
                                finded = valor;
                            }
                        });
                        finded == undefined ? seleccionados.push(record) : seleccionados.remove(finded);
                        var text = [];
                        Ext.each(seleccionados, function (valor) {
                            text.push(valor.get(me.displayField));
                        })
                        this.setValue(seleccionados);
                        // this.setValue(seleccionados.map(x=>x.idnaturaleza));
                        this.setRawValue(text.toString());
                        // display full list
                        if (this.store.isFiltered()) {
                            this.doQuery(this.allQuery);
                        }
                    }
                    else {
                        this.setValue(record.data[field]);
                        this.collapse();
                    }
                    this.fireEvent('select', this, record, index);
                }
            },
            listeners: {
                scope: this,
                select: function(yo, record){
                    _this.cmbTiposLineas.setDisabled(!yo.getValue());
                    _this.cmbTiposLineas.setValue('');
                    _this.cmbTiposLineas.store.baseParams['lineas']=record.get('idlinea');
                    _this.cmbTiposLineas.store.load();

                },
                show: function (combo) {
                    var record = _this.stLineas.getAt(_this.indexEdited);
                    if (record) {
                        var nombre = record.data.linea;
                        var id = record.data.idlinea;
                        if (nombre) {
                            _this.setComboValue(combo, nombre, id);
                        }
                    }
                },

            }
        });

        this.stTiposLineas = new Ext.data.Store({
            // autoLoad: true,
            url: 'obtenerTiposLineas',
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data'
            }, [
                {name: 'idtipolinea'},
                {name: 'tipolinea', mapping: 'denominacion'}
            ]),
            // listeners: {
                // load: function (store, records, success) {
                //     var aux = new Array();
                //     if (success) {
                //         Ext.each(records, function (value) {
                //             aux.push(value.data);
                //         })
                //     }
                //     _this.stCodigo.arrayIdFiscales = aux;
                // }
            // }
        });

        this.cmbTiposLineas = new Ext.form.ComboBox({
            disabled:true,
            name: 'tipolinea',
            hideOnSelect: false,
            anchor: '100%',
            store: this.stTiposLineas,
            triggerAction: 'all',
            valueField: 'idtipolinea',
            displayField: 'tipolinea',
            // mode: 'local',
            editable: false,
            // allowBlank: false,
            emptyText: _this.etiquetas.emptyText,
            loadingText: this.etiquetas.lbCargando,
            listeners:{
                show: function (combo) {
                    var record = _this.stLineas.getAt(_this.indexEdited);
                    if (record) {
                        var nombre = record.data.tipolinea;
                        var id = record.data.idtipolinea;
                        if (nombre) {
                            _this.setComboValue(combo, nombre, id);
                        }
                    }
                }
            }
            // tpl: '<tpl for="."><div ext:qtip="{tipo}" class="x-combo-list-item">{tipo}</div></tpl>',
            // tpl: '<div id = \"cmbCuentas\" style = \"height:200px; !important;\"></div>',
//             tpl: '<tpl for="."><div  class="x-combo-list-item" ' +
//                 'qtip="{nombrecuenta}">{nombrecuenta} </div></tpl>',
//             listeners: {}
        });

        this.stLineas = new Ext.data.Store({
            url: 'obtenerLineasClientes',
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [
                {name: 'idclienteproveedorlinea'},
                {name: 'idlinea'},
                {name: 'idnaturaleza'},
                {name: 'linea'},
                {name: 'text'},
                {name: 'denominacion'},
                {name: 'tipolinea'},
                {name: 'idtipolinea'},
                {name: 'predeterminada'}
            ]),
            listeners:{
                remove: function (store, record, index) {
                    if (!Ext.isEmpty(record.data.idclienteproveedorlinea)) {
                        _this.lineasDel.push(record.data.idclienteproveedorlinea);
                    }
                    _this.modificarTituloCant(_this.lineas, _this.etiquetas.lbTtLineas, store.getCount());
                },
                update: function (store, record, operation) {
                    _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, '', true);
                    _this.modificarTituloCant(_this.lineas, _this.etiquetas.lbTtLineas, store.getCount());
                },
                datachanged: function(yo){
                    _this.modificarTituloCant(_this.lineas, _this.etiquetas.lbTtLineas, yo.getCount());
                    // _this.lineas.setTitle(_this.etiquetas.lbTtLineas);
                    // if(yo.getCount()>0)
                    //     _this.lineas.setTitle(_this.etiquetas.lbTtLineas+' ('+yo.getCount()+')');
                },
                load: function(yo, records){
                    records.forEach(x=>{
                        x.data.idnaturaleza.forEach(item=>{
                             item.toString = () => {return item.data.denominacion};   
                         })
                    })
                }
                
            }
        });

        this.cmLineas = new Ext.grid.ColumnModel({
            columns: [
                {
                    header: this.etiquetas.lbTtLinea,
                    dataIndex: 'idnaturaleza',
                    // dataIndex: 'idlinea',
                    width: 430,
                    editor: this.cmbLineas,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (!Ext.isEmpty(value)) {
                            return record.data.denominacion
                        }
                        return value;
                    }
                },
                {
                    header: this.etiquetas.lbTtTipoLinea,
                    dataIndex: 'idtipolinea',
                    width: 430,
                    // editor: this.cmbMSTiposLineas,
                    editor: this.cmbTiposLineas,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (!Ext.isEmpty(value)) {
                            return record.data.tipolinea
                        }
                        return value;
                    }
                }
            ]
        });

        this.lineas = new Ext.Conf.ModContb.GridEditor({
            title: this.etiquetas.lbTtLineas + '',
            // title: 'qqqqqwewe1',
            region: 'center',
            border: false,
            width: 964,
            store: _this.stLineas,
            cm: _this.cmLineas,
            saveText: this.etiquetas.lbBtnAceptar,
            saveTooltip: this.etiquetas.lbBtnAceptarRe,
            cancelText: this.etiquetas.lbBtnCancelar,
            cancelTooltip: this.etiquetas.lbBtnCancelarRe,
            iconSave: 'aceptar',
            textbtnadd: this.etiquetas.lbBtnAdicionar,
            tooltipbtnadd: this.etiquetas.lbTtAddIdentificador,
            tooltipbtndel: this.etiquetas.lbTtDelIdentificador
        })

        this.lineas.roweditor.on(
            {
                validateedit: function (roweditor, grid, changes, record, rowIndex) {
                    // var existe = _this.existeRecord(grid.getStore(), record, changes, grid.getColumnModel());
                    var existe = _this.existeRecord(grid.getStore(), record, changes, grid.getColumnModel());
                    if (existe) {
                        mostrarMensaje(1, 'Esta fila ya existe en el grid.');
                        return false;
                    }
                },
                afteredit: function (roweditor, grid, changes, record, rowIndex) {
                    _this.setRecordValues(record, grid, rowIndex);
                },
                beforeedit: function (roweditor, grid, record, index) {
                    _this.indexEdited = index;
                    if(_this.cmbTiposLineas)
                        _this.cmbTiposLineas.setDisabled(!record.get('idtipolinea'));
//                     _this.cmbOperacion.setDisabled(!(record.get('idclasificacion') == 1 || record.get('idclasificacion') == 2));
                }
                // afteredit: function (roweditor, grid, changes, record, rowIndex) {
                //     if (rowIndex == 0 && grid.getStore().getCount() == 1) {
                //         record.beginEdit();
                //         record.set('predeterminada', true);
                //         record.endEdit();
                //     }
                // },
                // canceledit: function (roweditor, record, rowIndex) {
                //     var store = _this.stTabPago;
                //     if (Ext.isEmpty(record.data['pago'])) {
                //         store.remove(store.getAt(rowIndex));
                //     }
                // }
            }
        );

        this.fechaAprobacion = new Ext.form.DateField({
            fieldLabel: 'Fecha de aprobación',
            // labelWidth: 300,
            // labelStyle: 'width:140px',
            // style: 'width:180px',
            // width: 280,
            // id: 'fechaaprobacion',
            name: 'fechaaprobacion',
            format: 'd/m/Y',
            selectOnFocus: true,
            // minValue: new Date(),
            minText: _this.etiquetas.lbMinText,
            invalidText: _this.etiquetas.lbInvalidTextFormatFecha,
            anchor: '100%',
            enableKeyEvents: true,
            listeners:{
                change: function (yo) {
                    _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, yo.name, yo.getValue());
                }
            }
        });

        this.fechaVencimiento = new Ext.form.DateField({
            fieldLabel: 'Fecha de vencimiento',
            // labelWidth: 400,
            // labelStyle: 'width:140px',
            // style: 'width:240px',
            // width: 240,
            // id: 'fechafin',
            name: 'fechafin',
            format: 'd/m/Y',
            selectOnFocus: true,
            // minValue: this.fechaAprobacion.getValue() || new Date(),
            minText: _this.etiquetas.lbMinText,
            invalidText: _this.etiquetas.lbInvalidTextFormatFecha,
            anchor: '100%',
            listeners:{
                change: function (yo) {
                    _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, yo.name, yo.getValue());
                    _this.rgTipoProveedorTiempo.setValue(2);
                    _this.rgTipoProveedorTiempo.items.items[0].setDisabled(yo.getValue());
                }
            }
        });

        this.rgTipoProvedorProducto = new Ext.form.RadioGroup({
            columnWidth: 0.30,
            style: 'margin:5 10 0 20',
            columns: 1,
            name: 'tipoproveedorproducto',
            value:2,
            getValue: ()=>{return _this.rgTipoProvedorProducto.value}, 
            setValue: (value, yo)=>{
                _this.rgTipoProvedorProducto.value=value; 
                _this.rgTipoProvedorProducto.items[0].checked = value == 1;
                _this.rgTipoProvedorProducto.items[1].checked = value == 2;
            },
            items: [
                {boxLabel: 'Fabricante', name: 'tipoproveedorproducto', inputValue: 1, //setValue: (value)=>{},
                 listeners:{
                    check: function(yo, value){
                        _this.rgTipoProvedorProducto.value=value?1:2;
                        _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, yo.name, _this.rgTipoProvedorProducto.getValue());
                    }}
                },
                {boxLabel: 'Comercializador', name: 'tipoproveedorproducto', inputValue: 2, checked: true}
            ]
        });

        this.rgTipoProveedorTiempo = new Ext.form.RadioGroup({
            columnWidth: 0.30,
            style: 'margin:5 10 0 0',    
            columns: 1,
            name: 'tipoproveedortiempo',    
            value:1,
            getValue: ()=>{return _this.rgTipoProveedorTiempo.value},     
            setValue: (value, yo)=>{
                console.log('setValue:', value)
                _this.rgTipoProveedorTiempo.value=value; 
                console.log(_this.rgTipoProveedorTiempo)
                console.log(_this.rgTipoProveedorTiempo.items)
                console.log(_this.rgTipoProveedorTiempo.items[0])
                if(_this.rgTipoProveedorTiempo.items[0]){
                    _this.rgTipoProveedorTiempo.items[0].checked = value == 1;
                    _this.rgTipoProveedorTiempo.items[1].checked = value == 2;
                }else{
                    _this.rgTipoProveedorTiempo.items.items[0].setValue(value == 1);
                    _this.rgTipoProveedorTiempo.items.items[1].setValue(value == 2);
                }
                
            },
            items: [
                {boxLabel: 'Permanente', name: 'tipoproveedortiempo', inputValue: 1, checked: true, listeners:{
                    check:function(yo, value){
                        _this.rgTipoProveedorTiempo.value=value?1:2;
                        _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, yo.name, _this.rgTipoProveedorTiempo.getValue());
                    }}},
                {boxLabel: 'Excepcional', name: 'tipoproveedortiempo', inputValue: 2}
            ]       
        });
            
        this.tabDatosAdicionales = new Ext.Panel({
            title: 'Datos adicionales',
            layout: 'column',
            frame: true,
            defaults: {
                // margin: '10 5 10 5'
                labelAlign: 'top',
                style: 'margin:5 10 0 0',    
            },
            listeners: {
                render: function(yo){
                    // _this.rgTipoProveedorTiempo.items.items[0].setDisabled(_this.fechaVencimiento.getValue());
                    if(_this.rgTipoProveedorTiempo.items[0])
                        _this.rgTipoProveedorTiempo.items[0].disabled = _this.fechaVencimiento.getValue();
                    else
                        _this.rgTipoProveedorTiempo.items.items[0].setDisabled(_this.fechaVencimiento.getValue());
                }
            },
            items: [
                // this.fechaAprobacion,
                // this.fechaVencimiento
                {
                    columnWidth: 0.18,
                    layout: 'form',
                    // labelAlign: 'top',
                    // style: 'margin:5 10 0 0',
                    items:this.fechaAprobacion
                },
                {
                    columnWidth: 0.18,
                    layout: 'form',
                    // labelAlign: 'top',
                    style: 'margin:5 20 0 0',
                    items:this.fechaVencimiento
                },
                this.rgTipoProvedorProducto,
                this.rgTipoProveedorTiempo,
               
            ]
        })

        //**********************Panel Contactos********************************//

        /*
        Estructura del campo archivo
        {
            idfileupload:'' //identificador del fileupload en el formulario,
            namefile:''     //Nombre del archivo,
            idfile:''       //Identificador del archivo en alfresco
            url:''          //Direccion del archivo para descargar
        }
        * */
        this.stTabContactos = new Ext.data.JsonStore({
            url: 'obtenerDatosAdicionales',
            root: 'data',
            fields: [
                {
                    name: 'idcontacto'
                },
                {
                    name: 'nombre'
                },
                {
                    name: 'cargo'
                },
                {
                    name: 'correocontacto'
                },
                {
                    name: 'telefono'
                },
                {
                    name: 'movil'
                },
                {
                    name: 'direccionempresa'
                },
                {
                    name: 'dpa'
                },
                {
                    name: 'descripciondpa'
                },
                {
                    name: 'direccion'
                },
                {
                    name: 'idclientesproovedores'
                },
                {
                    name: 'foto'
                },
                {
                    name: 'idusuario'
                },
                {
                    name: 'nombreusuario'
                }, {
                    name: 'tiposfacultades', mapping: 'facultades'
                }, {
                    name: 'facultad'
                },
                {
                    name: 'facultades'
                },
                {
                    name: 'totalfacultades'
                },
                'numeroidentidad',
                'archivo'
            ],
            listeners: {
                remove: function (store, record, index) {
                    if (!Ext.isEmpty(record.data.idcontacto)) {
                        _this.contactoDel.push(record.data.idcontacto);
                    }
                    _this.modificarTituloCant(_this.pContactos, _this.etiquetas.lbContactos, store.getCount());
                },
                update: function (store, record, operation) {
                    _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, '', true);
                    _this.modificarTituloCant(_this.pContactos, _this.etiquetas.lbContactos, store.getCount());
                },
                datachanged: function(yo){
                    _this.modificarTituloCant(_this.pContactos, _this.etiquetas.lbContactos, yo.getCount());
                }
            }
        });

        this.initTemplates();

        this.dvTabContactos = new Ext.DataView({
            store: _this.stTabContactos,
            tpl: _this.thumbTemplate,
            autoWidth: true,
            autoHeight: true,
            frame: true,
            multiSelect: true,
            singleSelect: true,
            simpleSelect: false,
            itemSelector: 'div.panel-contacto',
            prepareData: function (data) {
                if (Ext.isEmpty(data.foto)) {
                    data.foto = '/configuracion/comun/views/images/contacto.png';
                }
                for (k in data) {
                    if (Ext.isEmpty(data[k]) && k != 'idcontacto'  && k!='argumento') {
                        data[k] = "<b style='color:#d9534f'>" + _this.etiquetas.lbEmpty + "</b>";
                    }
                }
                return data;
            },
            plugins: [
                new Ext.DataView.DragSelector()
            ],
            listeners: {
                selectionchange: function (dv, selections) {
                    if (selections.length == 1) {
                        _this.btnEditContacto.enable();
                        _this.btnDelContacto.enable();
                    } else if (selections.length > 1) {
                        _this.btnDelContacto.enable();
                        _this.btnEditContacto.disable();
                    } else {
                        _this.btnDelContacto.disable();
                        _this.btnEditContacto.disable();
                    }
                }
            }
        });

        this.btnAddContacto = new Ext.Button({
            iconCls: 'adicionar',
            text: _this.etiquetas.lbBtnAddContacto,
            tooltip: _this.etiquetas.lbTtAdicionarContacto,
            handler: function () {
                _this.winAddContacto('Add');
            }
        });

        this.btnEditContacto = new Ext.Button({
            disabled: true,
            iconCls: 'modificar',
            text: _this.etiquetas.lbBtnModContacto,
            tooltip: _this.etiquetas.lbTtModificarContacto,
            handler: function () {
                _this.winAddContacto('Mod');
            }
        });

        this.btnDelContacto = new Ext.Button({
            disabled: true,
            iconCls: 'eliminar',
            text: _this.etiquetas.lbBtnEliminar,
            tooltip: _this.etiquetas.lbTtEliminarContacto,
            handler: function () {
                _this.delContacto();
            }
        });

        this.pContactos = new Ext.Panel({
            title: _this.etiquetas.lbContactos,
            id: 'images-view',
            autoScroll: true,
            tbar: [_this.btnAddContacto, _this.btnEditContacto, _this.btnDelContacto],
            // disabled: true,
            resizeTabs: true,
            border: false,
            layout: 'fit',
            items: [_this.dvTabContactos],
            listeners: {
                scope: this,
                disable: function (panel) {
                    var store = this.dvTabContactos.store;
                    Ext.each(store.data.items, function (record) {
                        if (!Ext.isEmpty(record.data.idcontacto)) {
                            this.contactoDel.push(record.data.idcontacto);
                        }
                    }, this);
                    this.dvTabContactos.store.removeAll();
                }
            }
        });

        this.pAdjuntos = new Ext.Panel({
            title: 'Adjuntos',
            // id: 'tabAdjuntos',
            autoScroll: true,
            tbar: [
                {
                    iconCls: 'adicionar',
                    text: 'Agregar',
                    tooltip: 'Agregar adjunto',
                    handler: function () {
                        _this.pAdjuntos.nuevoAdjunto(Ext.id(null, 'archivo_'));
                        _this.pAdjuntos.doLayout();
                        // Ext.ComponentMgr.get('tabAdjuntos').doLayout();
                        // _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, '', true);
                    }
                }
            ],
            // disabled: true,
            resizeTabs: true,
            border: false,
            layout: 'anchor',
            removedAdjuntos: [],
            modifiedAdjuntos: [],
            listeners:{
                render: function(yo){
                    // console.log('RENDER1:', yo)
                    var loadMask = new Ext.LoadMask(yo.body);
                    loadMask.show();
                    setTimeout(()=>{
                        if(yo.savedAdjuntos){
                            yo.savedAdjuntos.forEach(x=>{
                                let idUnico = Ext.id(null, 'archivo_');
                                // console.log('Adj:', x.nombre, idUnico)
                                _this.pAdjuntos.nuevoAdjunto(idUnico);
                                // console.log(_this.pAdjuntos.items.length)
                                Ext.getCmp('nombre_'+idUnico).setValue(x.nombre);
                                Ext.getCmp('adjunto_'+idUnico).setValue(x.nombrearchivo);
                                Ext.getCmp('adjunto_'+idUnico).urlfile=x.url;
                                Ext.getCmp('adjunto_'+idUnico).setDisabled(true);
                                Ext.getCmp('adjunto_'+idUnico).buttonCfg.hidden = true;
                                Ext.getCmp('adjunto_'+idUnico).idfile=x.idnodo;
                                Ext.getCmp('descargar_'+idUnico).setVisible(true);
                                Ext.getCmp('descargar_'+idUnico).hidden = false;
                                // console.log(':', Ext.getCmp('nombre_'+idUnico).getValue())
                                // _this.pAdjuntos.doLayout();
                            })
                        }
                        // setTimeout(()=>{
                            loadMask.hide();
                            _this.pAdjuntos.doLayout();
                        // }, 1000)                        
                    }, 500)
                    // yo.doLayout();
                }
            },
            getModifiedAdjuntos: function(){
                console.log('PP:', _this.pAdjuntos.items)
                let modified = [];
                if(_this.pAdjuntos.items && _this.pAdjuntos.items.length)
                    _this.pAdjuntos.items.items.forEach((x)=>{
                        let text = Ext.getCmp('nombre_'+x.id), filefield = Ext.getCmp('adjunto_'+x.id);
                        // console.log('->', x.id, text.originalValue, text.getValue(), filefield.originalValue, filefield.getValue(),filefield.idfile)
                        if(x.id && Ext.getCmp(x.id) && filefield.idfile && text.originalValue != text.getValue())
                           modified.push({idnodo: filefield.idfile, nombre: text.getValue(), nombreArchivo: filefield.getValue()});
                    })
                return modified;
            },
            eliminarAdjunto: function(idUnico){
                let idfile = Ext.getCmp('adjunto_'+idUnico).idfile;
                if(idfile)_this.pAdjuntos.removedAdjuntos.push(idfile)
                _this.pAdjuntos.remove(Ext.getCmp(idUnico));
                _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, '', true);
            },
            nuevoAdjunto:function (idUnico){
                //console.log('Cant1:',_this.pAdjuntos.items.length)
                let nuevaEntrada = new Ext.Panel({
                    // xtype: 'panel',
                    // columnWidth: 1,
                    anchor: '98%',
                    id: idUnico,               
                    layout: 'table',
                    layoutConfig: {
                       columns: 4
                    },    
                    // height: 60,
                    style: 'margin:10',    
                    items: [
                        new Ext.form.TextField(
                        {
                            // xtype:'textfield',
                            id: 'nombre_'+idUnico,
                            name: 'nombre_'+idUnico,
                            allowBlank: false,
                            width: 400,
                            // columnWidth: 0.5,
                            // colspan: 1,
                            emptyText: 'Escriba el nombre...',
                            style: 'margin:0 10 0 0',
                            enableKeyEvents: true,
                            listeners:{
                                keyup: function(yo){
                                    _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, 'nombre_'+idUnico, yo.getValue());
                                }
                            }
                        }),
                                new Ext.form.FileUploadField({
                                // new Ext.form.TextField({
                                    id: 'adjunto_'+idUnico,
                                    name: 'adjunto_'+idUnico,
                                    allowBlank: false,
                                    buttonCfg: {
                                        iconCls: 'icondistra-subirfichero',
                                        text: ''
                                    },
                                    // anchor: '98%',
                                    width: 450,
                                    // columnWidth: 1,   
                                    // colspan: 1,
                                    emptyText: 'Seleccione el archivo...',
                                    // width: '95%',    
                                    style: 'margin:0 20 0 0',
                                    listeners:{
                                        fileselected: function(yo){
                                            // console.log('fileselected', yo.getValue())
                                            _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, 'adjunto_'+idUnico, yo.getValue());
                                        }
                                    }
                                }),
                            new Ext.Button({
                                // xtype: 'button',
                                id: 'descargar_'+idUnico,
                                iconCls: 'icondistra-descargar',
                                // columnWidth: 0.03,
                                // colspan: 1,
                                hidden: true,
                                tooltip: 'Descargar documento',
                                style: 'margin:0 0 0 5',
                                handler: function(){
                                    if(Ext.getCmp('adjunto_'+idUnico).urlfile)
                                        window.open('/crm/contratacion/index.php/gestioncontrato/getDocumentos?idnodo='+Ext.getCmp('adjunto_'+idUnico).idfile);
                                }
                            }),
                            new Ext.Button({
                                // xtype: 'button',
                                iconCls: 'icondistra-eliminar',
                                // columnWidth: 0.03,
                                // colspan: 1,
                                tooltip: 'Eliminar documento',
                                style: 'margin:0 0 0 5',
                                handler: function(){
                                    if(Ext.getCmp('adjunto_'+idUnico).getValue()){
                                        mostrarMensaje(2, '¿Está seguro que desea elminar el adjunto seleccionado?', function(btnPress){
                                            if(btnPress=='ok')_this.pAdjuntos.eliminarAdjunto(idUnico);
                                        });
                                    }else{
                                        _this.pAdjuntos.eliminarAdjunto(idUnico);
                                        // _this.pAdjuntos.remove(Ext.getCmp(idUnico));
                                    }
                                }
                            })
                    ]
                });
                _this.pAdjuntos.add(nuevaEntrada)
                
            }
            // items: [
            //     {
            //         xtype: 'label',
            //         text: 'Documentos a adjuntar',  
            //     }
            // ]
        });

        this.tpdDtalles = new Ext.TabPanel({
            activeTab: 0,
            region: 'center',
            border: false,
            tabWidth: 160,
            items: [{
                title: _this.etiquetas.lbDescripcion,
                id: 'iddescipcion',
                resizeTabs: true,
                layout: 'fit',
                height: 40,
                items: [{
                    id: 'fpDescipcion',
                    layout: 'fit',
                    border: false,
                    items: [_this.taDescipcion]
                }]
            },

            ]
        });

        if(_this.tabadjuntos)
            this.tpdDtalles.add(this.pAdjuntos);

        if (this.addcontabilidad) {
            this.tpdDtalles.add({
                title: _this.etiquetas.lbContabilidad,
                id: 'idcontabilidad',

                layout: 'border',
                items: [{
                    region: 'north',
                    layout: 'column',
                    hidden: true/*!this.existeCont*/,
                    height: 60,
                    frame: true,
                    items: [{
                        columnWidth: 0.30,
                        labelAlign: 'top',
                        layout: 'form',
                        items: _this.clasificacionCont
                    }, {
                        columnWidth: 0.20,
                        labelAlign: 'top',
                        layout: 'form',
                        items: _this.credito
                    }]
                }, _this.gpTabContabilidad]
            })
        }

        if (this.addcobrospago) {
            this.tpdDtalles.add(this.gpCobrospagos);
        }
        if (this.addcontactos) {
            this.tpdDtalles.add(this.pContactos);
        }
        this.tpdDtalles.add(this.identificadores);
        if(this.addvehiculos) {
            this.gridvehiculos = new Ext.DatMaest.ClientProveed.GridVehiculos({
                etiquetas: this.etiquetas
            });
            this.gridvehiculos.grid.getStore().on('update', function (store) {
                _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, '', true);
                _this.modificarTituloCant(_this.gridvehiculos, _this.etiquetas.lbVehiculo, store.getCount());
            })
            this.gridvehiculos.grid.getStore().on('datachanged', function (store) {
                _this.checkWindow(opcion, _this.fpClienteProveedor, winVentAsig, '', true);
                _this.modificarTituloCant(_this.gridvehiculos, _this.etiquetas.lbVehiculo, store.getCount());
            })
            this.gridvehiculos.grid.getStore().on('remove', function (store) {
                _this.modificarTituloCant(_this.gridvehiculos, _this.etiquetas.lbVehiculo, store.getCount());
            })
            this.tpdDtalles.add(this.gridvehiculos);
        }
        if(this.addlineas){
            this.tpdDtalles.add(this.lineas)
        }
        // console.log('allow:',this.tabdatosadicionales, this.addlineas)
        if(this.tabdatosadicionales){
            this.tpdDtalles.add(this.tabDatosAdicionales);
        }

        this.photo = new Ext.form.FileUploadField({
            width: '98%',
            emptyText: _this.etiquetas.emptyTextFoto,
            fieldLabel: _this.etiquetas.lbFoto,
            regex: /.+\.(jpg|png|jpeg)/i,
            regexText: _this.etiquetas.regexTextFoto,
            name: 'photoname',
            buttonCfg: {
                iconCls: 'icondistra-buscar',
                text: '',
                tooltip: 'Buscar imagen',
                qtip: 'Buscar imagen'
            },
            listeners: {
                scope: this,
                fileselected: function () {
                    this.formPwindow.buttons[1].setDisabled(!this.formPwindow.getForm().isValid());
                }
            }
        });

        this.formPwindow = new Ext.FormPanel({
            frame: true,
            border: false,
            buttonAlign: 'right',
            labelWidth: 30,
            items: _this.photo,
            buttons: [
                {
                    text: _this.etiquetas.lbBtnCancelar,
                    tooltip: _this.etiquetas.lbTtCancelar,
                    iconCls: 'cancelar',
                    handler: function () {
                        _this.photoWindow.hide();
                    }
                },
                {
                    text: _this.etiquetas.lbBtnAceptar,
                    tooltip: _this.etiquetas.lbTtAceptar,
                    iconCls: 'aceptar',
                    disabled: true,
                    handler: function () {
                        if (_this.photo.getRawValue() == '') {
                            mostrarMensaje(1, _this.etiquetas.lbMsgImagen);
                        } else {
                            if (window.File && window.FileReader && window.FileList && window.Blob) {
                                if (_this.photo.fileInput.dom.files.length) {
                                    var file = _this.photo.fileInput.dom.files[0];
                                    var reader = new FileReader();
                                    reader.onload = function (evt) {
                                        var fileData = evt.target.result;
                                        var bytes = new Uint8Array(fileData);
                                        var base64Img = Base64.encodeByteArray(bytes);
                                        _this.setImagen(base64Img);
                                        _this.photoWindow.hide();
                                    };
                                    reader.readAsArrayBuffer(file);
                                } else {
                                    mostrarMensaje(1, _this.etiquetas.lbMsgImagen);
                                }
                            } else {
                                mostrarMensaje(1, _this.etiquetas.msgFormatoInvalida);
                            }
                            _this.photo.reset();
                        }
                    }
                }]
        });

        this.photoWindow = new Ext.Window({
            plain: true,
            constrain: true,
            title: 'Seleccionar foto',
            autoHeight: true,
            border: false,
            closeAction: 'hide',
            modal: true,
            layout: 'form',
            width: 500,
            bodyStyle: 'padding: 5px',
            resizable: false,
            closable: false,
            items: _this.formPwindow,
            listeners: {
                beforeshow: function () {
                    var idpersona = Ext.getCmp('idpersona').getValue();
                    var idestructura = Ext.getCmp('idestructura').getValue();
                    if (_this.activeWindow == 'cliente' && (!Ext.isEmpty(idpersona) || !Ext.isEmpty(idestructura))) {
                        return false;
                    }
                },
                show: function () {
                    _this.formPwindow.buttons[1].disable();
                }
            }
        });

        this.delImg = new Ext.Button({
            icon: '/configuracion/comun/views/images/quitarfoto.png',
            text: '',
            iconCls: 'btn',
            style: 'position: absolute; bottom:3px; right: 60px;',
            tooltip: this.etiquetas.lbBtnEliminarImg,
            disabled: true,
            handler: function () {
                _this.setClasificacionTipo(true);
                var imagen = document.getElementById('photo-container').src
                var action = 'Add';
                if (Ext.getCmp('idModAcept')) {
                    var window = Ext.getCmp('winMod');
                    action = 'Mod';
                } else {
                    var window = Ext.getCmp('winAdd');
                }
                _this.checkWindow(action, _this.fpClienteProveedor, window, 'foto', imagen);
                this.disable();
            }
        });
        this.addImg = new Ext.Button({
            icon: '/configuracion/comun/views/images/establecerfoto.png',
            text: '',
            iconCls: 'btn',
            style: 'position: absolute; bottom:3px; right: 100px;',
            tooltip: this.etiquetas.lbBtnAdicionarImg,
            handler: function () {
                _this.photoWindow.show();
            }
        });

        this.fpClienteProveedor = new Ext.FormPanel({
            id: 'fpClienteProveedor',
            // region: 'north',
            fileUpload: true,
            // height: 300,
            layout: 'fit',
            labelAlign: 'top',
            // bodyStyle: 'padding:5px',
            items: [
                {
                    xtype: 'panel',
                    layout: 'border',
                    // frame: true,
                    items:[
                        {
                            xtype: 'panel',
                            region: 'north',
                            height: 300,
                            bodyStyle: 'padding:5px',
                            items:[

                                {
                                    id: 'fpBasicoClienteP',
                                    layout: 'column',
                                    items: [{
                                        columnWidth: .20,
                                        layout: 'form',
                                        margin: '10 0 0 0',
                                        items: [
                                            new Ext.form.FieldSet({
                                                title: _this.etiquetas.lbFoto,
                                                height: 187,
                                                items: [
                                                    new Ext.Panel({
                                                        id: 'p-photo-container',
                                                        border: false,
                                                        autoShow: true,
                                                        html: '<div><center><img qtip = "Foto de la entidad cliente" id="photo-container" src="/configuracion/comun/views/images/entidad_cliente.png" ALT="" onclick="_this.photoWindow.show()"/></center></div>'
                                                    })
                                                ]
                                            }
                                        )]
                                    },
                                        {
                                            style: 'margin:0 0 0 10',
                                            columnWidth: .80,
                                            layout: 'form',
                                            labelAlign: 'top',
                                            items: [{
                                                layout: 'column',
                                                items: [
                                                    {
                                                        columnWidth: 0.10,
                                                        layout: 'form',
                                                        style: 'margin:14 0 0 3',
                    									hidden: this.shownombrecodigo ? false : true,
                                                        items: this.checkcliente
                                                    },
                                                    {
                                                        columnWidth: 0.12,
                                                        layout: 'form',
                                                        style: 'margin:14 0 0 0',
                    									hidden: this.shownombrecodigo ? false : true,
                                                        items: this.checkproveedor
                                                    },
                                                    {
                                                        columnWidth: 0.20,
                                                        layout: 'form',
                                                        style: 'margin:14 0 0 0',
                    									hidden: this.shownombrecodigo ? false : true,
                                                        items: this.checkEntidad
                                                    },{
                                                        columnWidth: 0.2,
                                                        layout: 'form',
                                                        style: 'margin:14 0 0 0',
                                                        items: this.checkMayorista
                                                    },
                                                    {
                                                        columnWidth: 0.38,
                                                        layout: 'form',
                                                        style: 'margin:5 0 0 0',
                                                        items:this.cmbUsuario
                                                    }
                                                     ,
                                                    {
                                                        columnWidth: 1,
                                                       style: 'margin:5 0 0 0',
                                                        itemId: 'nombrepersonajuridica',
                                                        layout: 'form',
                    									hidden: this.shownombrecodigo ? false : true,
                                                        // hidden: true,
                                                        items: [this.nombre]
                                                    },
                                                    {
                                                        columnWidth: 0.24,
                                                        style: 'margin:5 2 0 2',
                                                        clase: 'nombrepersonanatural',
                                                        layout: 'form',
                                                        // hidden: true,
                                                        items: this.pnombre,
                                                    },
                                                    {
                                                        columnWidth: 0.24,
                                                        style: 'margin:5 2 0 2',
                                                        clase: 'nombrepersonanatural',
                                                        layout: 'form',
                                                        // hidden: true,
                                                        items: this.snombre,
                                                    },
                                                    {
                                                        columnWidth: 0.24,
                                                        style: 'margin:5 2 0 2',
                                                        clase: 'nombrepersonanatural',
                                                        layout: 'form',
                                                        // hidden: true,
                                                        items: this.papellido,
                                                    },
                                                    {
                                                        columnWidth: 0.24,
                                                        style: 'margin:5 2 0 2',
                                                        clase: 'nombrepersonanatural',
                                                        layout: 'form',
                                                        // hidden: true,
                                                        items: this.sapellido,
                                                    },
                                                    {
                                                        columnWidth: 0.04,
                                                        style: 'margin: 20 2 0 -2',
                                                        clase: 'nombrepersonanatural',
                                                        layout: 'form',
                                                        // hidden: true,
                                                        items: this.botonBuscar,
                                                    },
                                                    {
                                                        columnWidth: 0.34,
                                                        layout: 'form',
                                                        labelWidth: 130,
                    									hidden: this.shownombrecodigo ? false : true,
                                                        items: this.codigo
                                                    },
                                                    {
                                                        columnWidth: 0.33,
                                                        layout: 'form',
                    									items: this.codigoNit
                                                    },
                                                    {
                                                        columnWidth: 0.33,
                                                        layout: 'form',
                    									hidden: this.shownombrecodigo ? false : true,
                                                        items: this.abreviatura
                                                    },
                                                    {
                                                        columnWidth: 0.34,
                                                        layout: 'form',
                                                        // style: 'margin:5 0 0 0',
                                                        hidden: this.shownombrecodigo ? false : true,
                                                        items:this.sector
                                                    },
                                                    {
                                                        columnWidth: 0.33,
                                                        layout: 'form',
                                                        items: this.pais
                                                    },
                                                    {
                                                        columnWidth: 0.33,
                                                        layout: 'form',
                                                        items: this.dpa
                                                    },
                    
                    
                    
                                            ]
                                            }]
                                        }]
                                },
                                {
                                    layout: 'column',
                                    items: [
                
                                        {
                                            columnWidth: 0.34,
                                            layout: 'form',
                                            labelWidth: 130,
                                            hidden: this.shownombrecodigo ? false : true,
                                            items: this.organismo
                                        },
                                        {
                                            columnWidth: 0.33,
                                            layout: 'form',
                                            items: [
                                                this.subordinada
                                            ]
                                        },
                                        // {
                                        //     columnWidth: 0.20,
                                        //     layout: 'form',
                                        //     style: 'margin:0 0 0 10',
                                        //     items: this.cmbMSTiposLineas
                                        // },
                                        {
                                            columnWidth: 0.33,
                                            layout: 'form',
                                            // style: 'margin:0 0 0 10',
                                            hidden: this.shownombrecodigo ? false : true,
                                            items: this.direccion
                                        },
                                        {
                                            columnWidth: 0.34,
                                            layout: 'form',
                                            items: this.telefono
                                        },
                                        {
                                            columnWidth: 0.33,
                                            layout: 'form',
                                            items: this.correo
                                        },
                                        {
                                            columnWidth: 0.33,
                                            layout: 'form',
                                            items: [
                                                {
                                                    layout: 'column',
                                                    items: [
                                                        {
                                                            columnWidth: .9,
                                                            layout: 'form',
                											items: this.certifico
                                                        }, {
                                                            columnWidth: .1,
                                                            layout: 'form',
                                                            style: 'margin:18 0 0 0',
                											items: this.btnDescargar
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                
                                    ]
                                },
                                {
                                    xtype: 'hidden',
                                    id: 'idestructura'
                                }, 
                                {
                                    xtype: 'hidden',
                                    id: 'idpersona'
                                }
                                
                            ]
                        },
                        this.tpdDtalles
                    ]
                }
                
            ]
        });

        this.pGeneral = new Ext.Panel({
            layout: 'fit',
            frame: true,
            items: [this.fpClienteProveedor/*, this.tpdDtalles*/]
        })

        Ext.getCmp('p-photo-container').addEvents('setImagen');

        Ext.getCmp('p-photo-container').on(
            {
                setImagen: function (newImage) {
                    var form = _this.fpClienteProveedor;
                    if (!Ext.getCmp('idpersona').getValue() && !Ext.getCmp('idestructura').getValue()) {
                        _this.addImg.enable();
                        _this.delImg.enable();
                    } else {
                        _this.delImg.disable();
                        _this.addImg.disable();
                    }
                    _this.checkWindow(opcion, form, winVentAsig, 'foto', newImage);
                }
            }
        );
        this.keyMapCliente = new Ext.KeyMap(Ext.getBody(), [
            {
                key: Ext.EventObject.DELETE,
                fn: function () {
                    _this.btnDelContacto.handler.call();
                }
            },
            {
                key: "i",
                alt: true,
                scope: this,
                fn: function () {
                    if (this.tpdDtalles.getActiveTab()) {
                        var idtab = this.tpdDtalles.getActiveTab().id;
                        if (idtab == 'idcontabilidad') {
                            this.gpTabContabilidad.insertar();
                        } else if (idtab == 'images-view') {
                            this.btnAddContacto.handler.call(this);
                        } else if (idtab == 'idcobrospagos') {
                            this.gpCobrospagos.insertar();
                        }
                    }

                }
            }, {
                key: "m",
                alt: true,
                scope: this,
                fn: function () {
                    if (this.tpdDtalles.getActiveTab()) {
                        var idtab = this.tpdDtalles.getActiveTab().id
                        if (idtab == 'images-view' && !this.btnEditContacto.disabled) {
                            this.btnEditContacto.handler.call(this);
                        }
                    }
                }
            }
        ]);

        switch (opcion) {
            case 'Add':
                if (!winVentAsig) {
                    winVentAsig = new Ext.Window({
                        modal: true,
                        id: 'winAdd',
                        constrain: true,
                        closeAction: 'close',
                        maximized: Ext.lib.Dom.getViewWidth() - 1000 < 30 ? true : false,
                        layout: 'fit',
                        title: this.etiquetas.lbTtlAdicionar,
                        width: 1000,
                        keys: this.keyMapCliente,
                        defaultButton: 'idAddCancel',
                        height: 580,
                        resizable: false,
                        autoFocus: false,
                        buttons: [{
                            iconCls: 'cancelar',
                            id: 'idAddCancel',
                            text: this.etiquetas.lbBtnCancelar,
                            tooltip: this.etiquetas.lbTtCancelar,
                            handler: function () {
                                winVentAsig.close();
                            }
                        }, {
                            iconCls: 'aplicar',
                            id: 'idAddAply',
                            text: this.etiquetas.lbBtnAplicar,
                            disabled: true,
                            tooltip: this.etiquetas.lbTtAplicar,
                            handler: function () {
                                _this.winFpRegistrar('Add', true);
                            }
                        }, _this.lastElement = {
                            iconCls: 'aceptar',
                            id: 'idAddAcept',
                            disabled: true,
                            text: this.etiquetas.lbBtnAceptar,
                            tooltip: this.etiquetas.lbTtAceptar,
                            handler: function () {
                                _this.winFpRegistrar('Add', false);
                            }
                        }],
                        listeners: {
                            scope: this,
                            close: function () {
                                var btnAdd = this.pClienteProveedor.btnAdicionar;
                                if (btnAdd) {
                                    btnAdd.focus();
                                }
                                this.activeWindow = '';
                                this.keyMapCliente.disable();
                                this.keyMap.enable();
                                this.iddpa = null;
                            },
                            show: function () {
                                this.checkcliente.setValue(true);
                                this.checkEntidad.setValue(true);
                                this.dfFin.validate();
                                this.stClasificacionCont.load();
                            },
                            render: this.focusSiguiente
                        }
                    });
                }
                this.fpClienteProveedor.getForm().reset();
                winVentAsig.add(this.pGeneral);
                this.pGeneral.doLayout();
                winVentAsig.doLayout();
                winVentAsig.show();
                break;
            case 'Mod':
                if (!winVentAsig) {
                    winVentAsig = new Ext.Window({
                        modal: true,
                        id: 'winMod',
                        closeAction: 'close',
                        maximized: Ext.lib.Dom.getViewWidth() - 1000 < 30 ? true : false,
                        layout: 'fit',
                        constrain: true,
                        title: this.etiquetas.lbTtlModificar,
                        width: 1000,
                        keys: this.keyMapCliente,
                        defaultButton: 'idModCancel',
                        height: 580,
                        resizable: false,
                        autoFocus: false,
                        buttons: [
                            {
                                iconCls: 'cancelar',
                                id: 'idModCancel',
                                text: this.etiquetas.lbBtnCancelar,
                                tooltip: this.etiquetas.lbTtCancelar,
                                handler: function () {
                                    winVentAsig.close();
                                }
                            }, _this.lastElement = {
                                iconCls: 'aceptar',
                                id: 'idModAcept',
                                disabled: true,
                                text: this.etiquetas.lbBtnAceptar,
                                tooltip: this.etiquetas.lbTtAceptar,
                                handler: function () {
                                    _this.winFpRegistrar('Mod', false);
                                }
                            }],
                        listeners: {
                            scope: this,
                            close: function () {
                                var btnAdd = this.pClienteProveedor.btnAdicionar;
                                if (btnAdd) {
                                    btnAdd.focus();
                                }
                                this.activeWindow = '';
                                this.keyMapCliente.disable();
                                this.keyMap.enable();
                                this.iddpa = null;
                            },
                            show: function () {

                                let me=this;
                                var record = this.pClienteProveedor.smClienteProveedor.getSelected();
                                this.checkEntidad.fireEvent('check', this.checkEntidad, null, null);
                                var cont = 0;
                                this.seleccionado = record.data;
                                var loadMask = new Ext.LoadMask(winVentAsig.body);
                                loadMask.show();
                                this.dfFin.validate();
                                this.cargarDatosFijos(this.seleccionado);

                                Ext.Ajax.request({
                                    url: "obtenerDocumentos",
                                    params: {
                                        idcliente: _this.seleccionado.idclientesproveedores
                                    },
                                    callback: function (options, success, response) {
                                        if(success) {
                                            let respuesta = Ext.decode(response.responseText);
                                            if(respuesta.success && respuesta.data){
                                                // console.log('Documents:', respuesta);
                                                // respuesta.data.forEach(x=>{
                                                //     let idUnico = Ext.id(null, 'archivo_');
                                                //     console.log('Adj:', x.nombre, idUnico)
                                                //     me.pAdjuntos.nuevoAdjunto(idUnico);
                                                //     console.log(me.pAdjuntos.items.length)
                                                //     Ext.getCmp('nombre_'+idUnico).setValue(x.nombre);
                                                //     Ext.getCmp('adjunto_'+idUnico).setValue(x.nombrearchivo);
                                                //     Ext.getCmp('adjunto_'+idUnico).urlfile=x.url;
                                                //     Ext.getCmp('adjunto_'+idUnico).idfile=x.idnodo;
                                                //     Ext.getCmp('descargar_'+idUnico).setVisible(true);
                                                //     console.log(':', Ext.getCmp('nombre_'+idUnico).getValue())
                                                //     me.pAdjuntos.doLayout();
                                                // })
                                                me.pAdjuntos.savedAdjuntos = respuesta.data;
                                            }
                                        }
                                        cont++;
                                        hideMask();
                                    }
                                })
                                
                                if(this.addlineas)
                                    this.stLineas.load(
                                        {
                                            params: {
                                                idcliente: _this.seleccionado.idclientesproveedores
                                            },
                                            callback: function () {
                                                cont++;
                                                hideMask();
                                            }
                                        }
                                    );

                                this.stTabContabilidad.load(
                                    {
                                        params: {
                                            idcliente: _this.seleccionado.idclientesproveedores,
                                            contactos: false,
                                            vehiculo: _this.addvehiculos
                                        },
                                        callback: function () {
                                            var json = _this.stTabContabilidad.reader.jsonData,
                                                cuentas = json.cuentas,
                                                certifico = json.certifico,
                                                vehiculo = json.vehiculo;;
                                            _this.stCobrosPagos.loadData(cuentas);

                                            if (certifico) {
                                                _this.certifico.setValue(certifico.name);
                                                _this.certifico.url = certifico.url;
                                                if (!_this.certifico.url) {
                                                    mostrarMensaje(1, _this.etiquetas.msgNoCertifico);
                                                }
                                                _this.certifico.fireEvent('fileselected', _this.certifico, certifico.name, true);
                                            }
                                            if (vehiculo && _this.addvehiculos) {
                                                _this.gridvehiculos.grid.getStore().loadData(vehiculo);
                                                _this.gridvehiculos.grid.getStore().fireEvent('datachange', _this.gridvehiculos.grid.getStore())
                                            }
                                            cont++;
                                            hideMask();
                                        }
                                    }
                                );

                                //En caso que sea una entidad se cargan los contactos
                                if (this.seleccionado.idclasificacion == 1) {
                                    _this.stTabContactos.load({
                                        params: {
                                            idcliente: _this.seleccionado.idclientesproveedores,
                                            contactos: true
                                        },
                                        callback: function () {
                                            cont++;
                                            hideMask();
                                        }
                                    })
                                }

                                this.stClasificacionCont.load({
                                    callback: function () {
                                        var idclasificacioncontable = _this.seleccionado.idclasificacioncontable;
                                        if (idclasificacioncontable && idclasificacioncontable.indexOf("</b>") == -1) {
                                            _this.tpdDtalles.activate('idcontabilidad');
                                            _this.clasificacionCont.setValue(idclasificacioncontable);
                                            _this.tpdDtalles.activate('iddescipcion');
                                        }
                                        cont++;
                                        hideMask();
                                    }
                                });

                                this.stIdentificadores.load({
                                    params: {
                                        idclienteproveedor: _this.seleccionado.idclientesproveedores
                                    },
                                    callback: function () {
                                        var json = _this.stIdentificadores.reader.jsonData;
                                        cont++;
                                        hideMask();
                                    }
                                });

                                function hideMask() {
                                    // _this.tpdDtalles
                                    // if (cont == 4 && _this.seleccionado.idclasificacion != 1) {
                                    if (_this.tpdDtalles.items.length-2) {
                                        loadMask.hide();
                                    }
                                }
                            },
                            render: this.focusSiguiente
                        }
                    });
                }
                winVentAsig.add(this.pGeneral);
                this.pGeneral.doLayout();
                winVentAsig.doLayout();
                winVentAsig.show();
                break;
            case 'Det':
                if (!winVentAsig) {
                    winVentAsig = new Ext.Window({
                        modal: true,
                        readOnly: true,
                        editable: false,
                        id: 'winMod',
                        closeAction: 'close',
                        maximized: Ext.lib.Dom.getViewWidth() - 1000 < 30 ? true : false,
                        layout: 'fit',
                        constrain: true,
                        title: this.etiquetas.lbTtlModificar,
                        width: 1000,
                        keys: this.keyMapCliente,
                        defaultButton: 'idModCancel',
                        height: 520,
                        resizable: false,
                        autoFocus: false,
                        buttons: [
                            {
                                hidden: true,
                            },
                            {
                                iconCls: 'cancelar',
                                id: 'idModCancel',
                                hidden: true,
                                text: this.etiquetas.lbBtnCancelar,
                                tooltip: this.etiquetas.lbTtCancelar,
                                handler: function () {
                                    winVentAsig.close();
                                }
                            }, _this.lastElement = {
                                iconCls: 'aceptar',
                                id: 'idModAcept',
                                disabled: true,
                                hidden: true,
                                text: this.etiquetas.lbBtnAceptar,
                                tooltip: this.etiquetas.lbTtAceptar,
                                handler: function () {
                                    _this.winFpRegistrar('Mod', false);
                                }
                            }
                        ],
                        listeners: {
                            scope: this,
                            close: function () {
                                var btnAdd = this.pClienteProveedor.btnAdicionar;
                                if (btnAdd) {
                                    btnAdd.focus();
                                }
                                this.activeWindow = '';
                                this.keyMapCliente.disable();
                                this.keyMap.enable();
                                this.iddpa = null;
                            },
                            show: function () {


                                var record = _this.pClienteProveedor.pSubordinadas.selModel.getSelected();
                                var cont = 0;
                                this.seleccionado = record.data;
                                var loadMask = new Ext.LoadMask(winVentAsig.body);
                                loadMask.show();
                                this.dfFin.validate();
                                this.cargarDatosFijos(this.seleccionado);

                                _this.checkcliente.setDisabled(true);
                                _this.checkproveedor.setDisabled(true);
                                _this.checkEntidad.setDisabled(true);
                                _this.checkMayorista.setDisabled(true);
                                _this.nombre.setDisabled(true);
                                _this.nombre.trigger.setVisible(false);

                                _this.cmbUsuario.setDisabled(true);
                                _this.codigo.setDisabled(true);
                                _this.codigoNit.setDisabled(true);
                                _this.abreviatura.setDisabled(true);
                                _this.telefono.setDisabled(true);
                                _this.correo.setDisabled(true);
                                _this.dpa.setDisabled(true);
                                _this.direccion.setDisabled(true);
                                //_this.subordinada.setDisabled(true);
                                _this.certifico.setDisabled(true);
                                _this.certifico.button.setVisible(false);
                                _this.btnDescargar.setVisible(false);
                                _this.taDescipcion.setDisabled(true);

                                _this.gpTabContabilidad.btnadd.setVisible(false);
                                _this.gpTabContabilidad.btndel.setVisible(false);
                                _this.identificadores.btnadd.setVisible(false);
                                _this.identificadores.btndel.setVisible(false);
                                _this.gpCobrospagos.btnadd.setVisible(false);
                                _this.gpCobrospagos.btndel.setVisible(false);
                                _this.btnAddContacto.setVisible(false);
                                _this.btnEditContacto.setVisible(false);
                                _this.btnDelContacto.setVisible(false);

                                this.stTabContabilidad.load(
                                    {
                                        params: {
                                            idcliente: _this.seleccionado.idclientesproveedores,
                                            contactos: false
                                        },
                                        callback: function () {
                                            var json = _this.stTabContabilidad.reader.jsonData,
                                                cuentas = json.cuentas,
                                                certifico = json.certifico;
                                            _this.stCobrosPagos.loadData(cuentas);

                                            if (certifico) {
                                                _this.certifico.setValue(certifico.name);
                                                _this.certifico.url = certifico.url;
                                                if (!_this.certifico.url) {
                                                    mostrarMensaje(1, _this.etiquetas.msgNoCertifico);
                                                }
                                                _this.certifico.fireEvent('fileselected', _this.certifico, certifico.name, true);
                                            }
                                            cont++;
                                            hideMask();
                                        }
                                    }
                                );

                                //En caso que sea una entidad se cargan los contactos
                                if (this.seleccionado.idclasificacion == 1) {
                                    _this.stTabContactos.load({
                                        params: {
                                            idcliente: _this.seleccionado.idclientesproveedores,
                                            contactos: true
                                        },
                                        callback: function () {
                                            cont++;
                                            hideMask();
                                        }
                                    })
                                }

                                this.stClasificacionCont.load({
                                    callback: function () {
                                        var idclasificacioncontable = _this.seleccionado.idclasificacioncontable;
                                        if (idclasificacioncontable && idclasificacioncontable.indexOf("</b>") == -1) {
                                            _this.tpdDtalles.activate('idcontabilidad');
                                            _this.clasificacionCont.setValue(idclasificacioncontable);
                                            _this.tpdDtalles.activate('iddescipcion');
                                        }
                                        cont++;
                                        hideMask();
                                    }
                                });

                                this.stIdentificadores.load({
                                    params: {
                                        idclienteproveedor: _this.seleccionado.idclientesproveedores
                                    },
                                    callback: function () {
                                        var json = _this.stIdentificadores.reader.jsonData;
                                        cont++;
                                        hideMask();
                                    }
                                });

                                function hideMask() {
                                    if (cont == 3 && _this.seleccionado.idclasificacion != 1) {
                                        loadMask.hide();
                                    } else if (cont == 4) {
                                        loadMask.hide();
                                    }
                                }
                            },
                            render: this.focusSiguiente
                        }
                    });
                }
                winVentAsig.add(this.pGeneral);

                this.pGeneral.doLayout();
                winVentAsig.doLayout();
                winVentAsig.show();
                break;
        }
    },

    cargarDatosFijos: function (data) {
        var _this = this;
        console.log('data:', data)
        for (k in data) {
            if (typeof data[k] == 'string' && data[k].indexOf("</b>") != -1) {
                data[k] = '';
            }
        }
        if (data.idpadre && data.idpadre != null) {
            this.subordinada.store.load({
                params: {start: 0, limit: 20},
                callback: function (r, o, success) {
                    if (success) {
                        _this.subordinada.setValue(parseInt(data.idpadre));
                        _this.subordinada.setRawValue(data.nombrepadre);
                    }
                    ;
                }
            });
            this.codigo.setDisabled(true);
        }
        if (data.idusuario) {
            this.cmbUsuario.setValue(data.idusuario);
            this.cmbUsuario.setRawValue(data.nombreusuario);
        }
        if (data.codigo) {
            this.codigo.setValue(data.codigo);
        }

        if (data.nombre) {
            this.nombre.setValue(data.nombre);
        }
        if (data.pnombre)this.pnombre.setValue(data.pnombre);
        if (data.snombre)this.snombre.setValue(data.snombre);
        if (data.papellido)this.papellido.setValue(data.papellido);
        if (data.sapellido)this.sapellido.setValue(data.sapellido);

        if(data.idpais){
            _this.pais.setValue(parseInt(data.idpais));
            _this.pais.setRawValue(data.pais);
        }

		if(data.idorganismo){
            //thi.hfOrganismo.setValue(parseInt(data.idorganismo))
//             this.organismo.setValue(data.organismo);
            // win.organismo.setRawValue(data.organismo)
            _this.organismo.store.load({
                params:{start:0, limit:15},
                callback:function(r,o,success){
                    if(success){
                        _this.organismo.setValue(parseInt(data.idorganismo));
                        _this.organismo.setRawValue(data.organismo);
                    }
                }
            });
        }
		
		if(data.idsector){
            _this.sector.store.load({
                params:{start:0, limit:15},
                callback:function(r,o,success){
                    if(success){
                        _this.sector.setValue(parseInt(data.idsector));
                        _this.sector.setRawValue(data.sector);
                    }
                }
            });
        }
		
        if (data.abreviatura) {
            this.abreviatura.setValue(data.abreviatura);
        }
        if (data.telefono) {
            this.telefono.setValue(data.telefono);
        }
        if (data.correo) {
            this.correo.setValue(data.correo);
        }
        if (data.dpa) {
            this.dpa.setValue(data.descripciondpa);
            this.iddpa = data.dpa;
        } else {
            this.iddpa = '';
        }
        if (data.direccion) {
            this.direccion.setValue(data.direccion);
        }
        if (data.descripcion) {
            this.taDescipcion.setValue(data.descripcion);
        }
        if (data.credito && this.existeCont) {
            this.credito.setValue(data.credito);
        }
        if (data.fechainicio) {
            this.dfInicio.setValue(data.fechainicio);
        }
        if (data.fechafin) {
            this.dfFin.setValue(data.fechafin);
            this.fechaVencimiento.setValue(data.fechafin);
        }
        if (data.fechaaprobacion) {
            this.fechaAprobacion.setValue(data.fechaaprobacion);
        }
        if (data.tipoproveedorproducto) {

            this.rgTipoProvedorProducto.setValue(data.tipoproveedorproducto);
            
        }
        if (data.tipoproveedortiempo) {
            this.rgTipoProveedorTiempo.setValue(data.tipoproveedortiempo);
        }    
        if (data.idestructura) {
            Ext.getCmp('idestructura').setValue(data.idestructura);
            Ext.getCmp('idpersona').setValue('');
        } else if (data.idpersona) {
            Ext.getCmp('idpersona').setValue(data.idpersona);
            Ext.getCmp('idestructura').setValue('');
        } else {
            Ext.getCmp('idestructura').setValue('');
            Ext.getCmp('idpersona').setValue('');
        }
        /*--fnCargarDatos--*/
        if (data.foto) {
            var arrTemp = data.foto.split(',');
            if (arrTemp.length == 2) {
                this.setImagen(data.foto);
            }
        }
        this.checkMayorista.disable();
        if (data.mayorista == 1) {
            this.checkMayorista.setValue(true);
        } else {
            this.checkMayorista.setValue(false);
        }
        if (data.idtipo == 1) {
            this.checkcliente.setValue(true);
            this.checkproveedor.setValue(false);
        } else if (data.idtipo == 2) {
            this.checkcliente.setValue(false);
            this.checkproveedor.setValue(true);
        } else if (data.idtipo == 3) {
            this.checkcliente.setValue(true);
            this.checkproveedor.setValue(true);
        }
        if (data.idclasificacion == 1) {
            this.checkEntidad.setValue(true);
            this.desabilitarCampos(false);
        } else {
            this.checkEntidad.setValue(false);
            this.desabilitarCampos(true);
        }
        if (data.registrado == 0) {
            this.habilitarCampos();
        }
        if (data.codigonit) {
            this.codigoNit.setValue(data.codigonit);
        }
    },
    getTipo: function () {
        var idtipo = 1;
        if (_this.checkcliente.getValue() && _this.checkproveedor.getValue()) {
            idtipo = 3;
        } else if (_this.checkproveedor.getValue()) {
            idtipo = 2;
        }
        return idtipo;
    },
    winAddContacto: function (action) {
        var _this = this;
        this.activeWindow = 'contacto';

        this.btnCancelContacto = new Ext.Button({
            id: 'btnCancelContacto',
            iconCls: 'cancelar',
            minWidth: 75,
            text: _this.etiquetas.lbBtnCancelar,
            tooltip: _this.etiquetas.lbTtCancelar,
            handler: function () {
                _this.winContacto.destroy();
            }
        });

        this.btnAplyContacto = new Ext.Button({
            iconCls: 'aplicar',
            disabled: true,
            minWidth: 75,
            text: _this.etiquetas.lbBtnAplicar,
            tooltip: _this.etiquetas.lbTtAplicar,
            handler: function () {
                addContacto(false);
            }
        });

        this.btnAceptContacto = new Ext.Button({
            iconCls: 'aceptar',
            disabled: true,
            minWidth: 75,
            text: _this.etiquetas.lbBtnAceptar,
            tooltip: _this.etiquetas.lbTtAceptar,
            handler: function () {
                addContacto(true);
            }
        });

        this.delImgContacto = new Ext.Button({
            icon: '/configuracion/comun/views/images/quitarfoto.png',
            text: '',
            iconCls: 'btn',
            style: 'position: absolute; bottom:0; right: 45px;',
            tooltip: this.etiquetas.lbBtnEliminarImg,
            disabled: true,
            handler: function () {
                var imagen = "/configuracion/comun/views/images/contacto.png";
                document.getElementById('photo-contacto').src = imagen;
                document.getElementById('photo-contacto').base64img = "";
                _this.checkWindow(action, _this.fpContacto, _this.winContacto, 'foto', imagen);
                this.disable();
            }
        });
        this.addImgContacto = new Ext.Button({
            icon: '/configuracion/comun/views/images/establecerfoto.png',
            text: '',
            iconCls: 'btn',
            style: 'position: absolute; bottom:0; right: 90px;',
            tooltip: this.etiquetas.lbBtnAdicionarImg,
            handler: function () {
                _this.photoWindow.show();
            }
        });

        this.tfnombContacto = new Ext.form.TextField({
            anchor: '100%',
            name: 'nombre',
            allowBlank: false,
            labelSeparator: ':' + _this.required,
            regex: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
            maskRe: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
            maxLength: 255,
            regexText: _this.etiquetas.regexTextLetras,
            fieldLabel: _this.etiquetas.lbNombre,
            enableKeyEvents: true,
            listeners: {
                keyup: function (textfield, event) {
                    var form = _this.fpContacto;
                    var window = _this.winContacto;
                    _this.checkWindow(action, form, window, textfield.name, textfield.getValue())
                }
            }
        });

        this.stUsuarioContacto = new Ext.data.Store({
            url: 'cargarUsuarios',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cant',
                root: 'datos',
                id: 'idusuario'
            }, [
                {
                    name: 'idusuario'
                },
                {
                    name: 'nombreusuario'
                }
            ]),
            listeners: {
                scope: this,
                load: function (store) {
                    var idusuario = this.cmbUsuarioContacto.getValue();
                    if (idusuario) {
                        this.selectById(idusuario, 'idusuario', store, this.smUsuarioContacto);
                    }
                }
            }
        });

        this.smUsuarioContacto = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
            listeners: {
                scope: this,
                selectionchange: function (sm) {
                    var cant = sm.getCount();
                    if (cant == 1) {
                        var data = sm.getSelected().data;
                        this.cmbUsuarioContacto.setValue(data.idusuario);
                        this.cmbUsuarioContacto.setRawValue(data.nombreusuario);
                        this.cmbUsuarioContacto.fireEvent('select', _this.cmbUsuarioContacto, data);
                        this.cmbUsuarioContacto.collapse();
                    } else {
                        this.cmbUsuarioContacto.setValue('');
                        this.cmbUsuarioContacto.setRawValue('');
                        this.cmbUsuarioContacto.fireEvent('select', _this.cmbUsuarioContacto);
                    }
                }
            }
        });

        this.sfUsuarioContacto = new Ext.Cont.SearchField({
            width: 216,
            emptyText: this.etiquetas.lbCriterioBuscar,
            searchTooltip: this.etiquetas.tooltipbuscarusuario,
            regex: /([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+/,
            maskRe: /([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+/,
            fnOnSearch: function () {
                _this.searchConcept(_this.stUsuarioContacto, _this.sfUsuarioContacto);
            },
            fnOnClear: function () {
                _this.clearField(_this.stUsuarioContacto);
            }
        });

        this.gpUsuarioContacto = new Ext.grid.GridPanel({
            loadMask: this.etiquetas.lbCargando,
            height: 200,
            frame: false,
            border: false,
            stripeRows: true,
            autoExpandColumn: 'expandir',
            store: this.stUsuarioContacto,
            sm: this.smUsuarioContacto,
            enableColumnHide: true,
            floating: false,
            hideHeaders: true,
            viewConfig: {
                forceFit: true
            },
            columns: [
                this.smUsuarioContacto,
                {
                    hidden: true,
                    dataIndex: 'idusuario',
                    hideable: false
                },
                {
                    id: 'expandir',
                    dataIndex: 'nombreusuario',
                    sortable: true
                }
            ],
            tbar: [this.sfUsuarioContacto],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                displayInfo: false,
                store: this.stUsuarioContacto
            })
        });

        this.cmbUsuarioContacto = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: [{name: 'idusuario'}, {name: 'nombreusuario'}],
                data: [[]]
            }),
            editable: false,
            triggerAction: 'all',
            fieldLabel: this.etiquetas.lbUsuario,
            anchor: '98%',
            emptyText: this.etiquetas.emptyText,
            displayField: 'nombreusuario',
            valueField: 'idusuario',
            hiddenName: 'idusuario',
            name: 'idusuario',
            mode: 'local',
            tpl: '<div id = \"ctUsuarioContacto\" style = \"height:200px; !important;\"></div>',
            listeners: {
                scope: this,
                expand: function (combo) {
                    this.gpUsuarioContacto.render('ctUsuarioContacto');
                    setTimeout(function () {
                        _this.sfUsuarioContacto.focus();
                    }, 5);
                    if (this.stUsuarioContacto.getCount() == 0) {
                        this.stUsuarioContacto.load({
                            params: {
                                start: 0,
                                limit: 20
                            }
                        });
                    } else {
                        var id = combo.getValue();
                        this.selectById(id, 'idusuario', this.stUsuarioContacto, this.smUsuarioContacto);
                    }

                },
                select: function (cmb, data) {
                    var form = this.fpContacto;
                    var window = this.winContacto;
                    this.checkWindow(action, form, window, cmb.name, cmb.getValue());
                }
            }
        });

        this.tfcargoContacto = new Ext.form.TextField({
            name: 'cargo',
            fieldLabel: _this.etiquetas.lbCargo,
            regex: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
            maskRe: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
            maxLength: 50,
            regexText: _this.etiquetas.regexTextLetras,
            anchor: '98%',
            enableKeyEvents: true,
            listeners: {
                keyup: function (textfield) {
                    var form = _this.fpContacto;
                    var window = _this.winContacto;
                    _this.checkWindow(action, form, window, textfield.name, textfield.getValue())
                }
            }
        });

        this.tfnumeroidentidad = new Ext.form.TextField({
            name: 'numeroidentidad',
            fieldLabel: _this.etiquetas.lbNumeroIdentidad,
            maxLength: 11,
            maskRe: /^[0-9]$/,
            anchor: '98%',
            enableKeyEvents: true,
            listeners: {
                keyup: function (textfield) {
                    var form = _this.fpContacto;
                    var window = _this.winContacto;
                    _this.checkWindow(action, form, window, textfield.name, textfield.getValue())
                }
            },
            validator: function () {
                if (/^[0-9]{6}$/.test(this.getValue()) || /^[0-9]{11}$/.test(this.getValue()))
                    return true
                return _this.etiquetas.regexTextNumeroIdentidad
            }
        });

        this.tfemailContacto = new Ext.form.TextField({
            name: 'correocontacto',
            fieldLabel: _this.etiquetas.lbCorreo,
            vtype: 'email',
            vtypeText: _this.etiquetas.regexTextCorreo,
            maxLength: 50,
            anchor: '99%',
            enableKeyEvents: true,
            listeners: {
                keyup: function (textfield) {
                    var form = _this.fpContacto;
                    var window = _this.winContacto;
                    _this.checkWindow(action, form, window, textfield.name, textfield.getValue())
                }
            }
        });

        this.tftelContacto = new Ext.form.TextField({
            name: 'telefono',
            fieldLabel: _this.etiquetas.lbTelefono,
            maxLength: 255,
            minLength: 6,
            regex: /^(\([0-9]{2,4}\)\s?|[0-9]{2,4}[\-\s]?)?[0-9]{6,}(\,(\([0-9]{2,4}\)\s?|[0-9]{2,4}[\-\s]?)?[0-9]{6,})*$/,
            maskRe: /^[0-9\s\(\)\-\,]+$/,
            regexText: _this.etiquetas.regexTextTelefono,
            anchor: '98%',
            enableKeyEvents: true,
            listeners: {
                keyup: function (textfield) {
                    var form = _this.fpContacto;
                    var window = _this.winContacto;
                    _this.checkWindow(action, form, window, textfield.name, textfield.getValue())
                }
            }
        });

        this.tfmovilContacto = new Ext.form.TextField({
            fieldLabel: _this.etiquetas.lbMovil,
            width: '98%',
            name: 'movil',
            maxLength: 255,
            minLength: 8,
            regex: /^(\([0-9]{2,4}\)\s?|[0-9]{2,4}[\-\s]?)?[0-9]{6,}(\,(\([0-9]{2,4}\)\s?|[0-9]{2,4}[\-\s]?)?[0-9]{6,})*$/,
            maskRe: /^[0-9\s\(\)\-\,]+$/,
            regexText: _this.etiquetas.regexTextTelefono,
            enableKeyEvents: true,
            listeners: {
                keyup: function (textfield) {
                    var form = _this.fpContacto;
                    var window = _this.winContacto;
                    _this.checkWindow(action, form, window, textfield.name, textfield.getValue())
                }
            }
        });

        this.checkDirEmpresa = new Ext.form.Checkbox({
            boxLabel: _this.etiquetas.lbCheckDirEmpresa,
            name: 'direccionempresa',
            hideLabel: true,
            listeners: {
                check: function (checkbox, checked) {
                    var form = _this.fpContacto;
                    var window = _this.winContacto;
                    if (checked) {
                        _this.checkWindow(action, form, window, checkbox.name, 1);
                        _this.hfIdDpa.setValue('');
                        _this.tfdpa.setValue('');
                        _this.tfdireccion.setValue('');
                        if (_this.dpa.getValue()) {
                            _this.hfIdDpa.setValue(_this.iddpa);
                            _this.tfdpa.setValue(_this.dpa.getValue());
                        }
                        if (_this.direccion.getValue()) {
                            _this.tfdireccion.setValue(_this.direccion.getValue());
                        }
                        _this.tfdireccion.disable();
                        _this.tfdpa.disable();
                    } else {
                        _this.checkWindow(action, form, window, checkbox.name, 0);
                        _this.hfIdDpa.setValue('');
                        _this.tfdpa.setValue('');
                        _this.tfdpa.enable();
                        _this.tfdireccion.setValue('');
                        _this.tfdireccion.enable();
                    }
                }
            }
        });

        this.tfdireccion = new Ext.form.TextField({
            anchor: '98%',
            name: 'direccion',
            maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\.\#\/\s\,\%\-]+$/,
            regex: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\.\#\/\s\,\%\-]+$/,
            regexText: _this.etiquetas.regexTextDireccion,
            maxLength: 255,
            fieldLabel: _this.etiquetas.lbDireccion,
            enableKeyEvents: true,
            listeners: {
                keyup: function (textfield) {
                    var form = _this.fpContacto;
                    var window = _this.winContacto;
                    _this.checkWindow(action, form, window, textfield.name, textfield.getValue())
                }
            }
        });

        this.tfdpa = new Ext.form.TextField({
            anchor: '98%',
            name: 'descripciondpa',
            blankText: _this.etiquetas.textCampoObligatorio,
            editable: false,
            fieldLabel: _this.etiquetas.lbDpa,
            listeners: {
                'focus': function () {
                    _this.winDpa();
                },
                changedDpa: function (textfield, valueField, displayField) {
                    var form = _this.fpClienteProveedor;
                    var window = _this.winContacto;
                    _this.checkWindow(action, form, window, textfield.name, valueField);
                }
            }
        });

        this.stTiposFacultades = new Ext.data.Store({
            url: 'obtenerTiposFacultades',
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'idtipofacultad'
            }, [
                {name: 'idtipofacultad'},
                {name: 'denominacion'},
                {name: 'checkedd', type: 'boolean', defaultValue: false}
            ]),
        });

        this.tiposfacultades = new Ext.form.ComboBox({
            fieldLabel: _this.etiquetas.lbTipoFacultades,
            blankText: _this.etiquetas.textCampoObligatorio,
            emptyText: _this.etiquetas.emptyText,
            name: 'idtiposfacultades',
            store: _this.stTiposFacultades,
            typeAhead: false,
            pageSize: 20,
            displayField: 'denominacion',
            valueField: 'idtipofacultad',
            queryParam: 'denominacion',
            loadingText: this.etiquetas.lbCargando,
            queryDelay: 400,
            minChars: 0,
            triggerAction: 'all',
            anchor: '98%',
            enableKeyEvents: true,
            multiSelect: true,
            checkField: 'checkedd',
            checkedClass: 'x-combo-checked',
            selectedClass: 'x-combo-selected',
            triggerClass: 'x-form-arrow-trigger',
            separator: ',',
            defaultAutoCreate: {tag: "input", type: "text", size: "24", autocomplete: "off"},
            tpl: '<tpl for="."><div class="x-combo-list-item' + '{[values.checkedd ?" x-combo-seleccionado":""]}' + '">' +
                ' {denominacion}</div></tpl>',
            seleccionados: [],
            onLoad: function () {
                if (!this.hasFocus) {
                    return;
                }
                if (this.store.getCount() > 0) {
                    this.expand();
                    this.restrictHeight();
                    if (this.lastQuery == this.allQuery) {
                        if (this.editable) {
                            this.multiSelect ? this.selectText(this.getRawValue().length) : this.el.dom.select();
                        }
                        if (!this.selectByValue(this.value, true)) {
                            this.select(0, true);
                        }
                        if (this.multiSelect && Ext.isArray(this.value) && this.value.length != 0) {
                            this.seleccionados = [];
                            Ext.each(this.value, function (rec) {
                                if (rec.data) {
                                    var value = rec.data[this.valueField],
                                        index = this.store.findBy(function(r){
                                            return r.data[this.valueField] == value;
                                        },this);
                                    if (index != -1) {
                                        var record = this.store.getAt(index);
                                        this.onSelect(record, index, true);
                                    }
                                }
                            }, this);
                        }
                    } else {
                        this.selectNext();
                        if (this.typeAhead && this.lastKey != Ext.EventObject.BACKSPACE && this.lastKey != Ext.EventObject.DELETE) {
                            this.taTask.delay(this.typeAheadDelay);
                        }
                    }
                } else {
                    this.onEmptyResults();
                }
            },
            onSelect: function (record, index, checked) {
                if (this.fireEvent('beforeselect', this, record, index) !== false) {
                    var field = this.valueField || this.displayField;
                    if (this.multiSelect) {
                        var val =  checked ||!record.get(this.checkField);
                        record.set(this.checkField, val);
                        var seleccionados = this.seleccionados, finded = undefined;
                        Ext.each(seleccionados, function (valor) {
                            if (valor.get('idtipofacultad') == record.get('idtipofacultad')) {
                                finded = valor;
                            }
                        });
                        finded == undefined ? seleccionados.push(record) : seleccionados.remove(finded);
                        var text = [];
                        Ext.each(seleccionados, function (valor) {
                            text.push(valor.get('denominacion'));
                        })
                        this.setValue(seleccionados);
                        this.setRawValue(text.toString());
                        // display full list
                        if (this.store.isFiltered()) {
                            this.doQuery(this.allQuery);
                        }
                    }
                    else {
                        this.setValue(record.data[field]);
                        this.collapse();
                    }
                    this.fireEvent('select', this, record, index);
                }
            },
            clearValue: function () {
                if (this.multiSelect) {
                    var v = this.value;
                    var field = this.valueField || this.displayField;
                    v = v && v.split(this.separator) || [];
                    this.store.clearFilter();
                    v.length && this.store.each(function (r) {
                        var idx;
                        if ((idx = v.indexOf(r.data[field])) != -1) {
                            r.set(this.checkField, false);
                            v.splice(idx, 1);
                            if (!v.length) {
                                return false;
                            }
                        }
                    }, this);
                }
                if (this.hiddenField) {
                    this.hiddenField.value = '';
                }
                this.setRawValue('');
                this.lastSelectionText = '';
                this.applyEmptyText();
                this.value = '';
            },
            listeners: {
                select: function (textfield, event) {
                    var form = _this.fpContacto;
                    var window = _this.winContacto;
                    _this.checkWindow(action, form, window, textfield.name, textfield.getValue());
                    var firmcontra = textfield.getRawValue().toLowerCase().indexOf('firmar contratos') != -1;
                    _this.facultad.allowBlank = !firmcontra;
                    _this.facultad.fieldLabel =
                        (firmcontra ? _this.facultad.fieldLabel + _this.required :
                            _this.facultad.fieldLabel.replace(_this.required, ''));
                    _this.facultad.render();
                    _this.facultad.validate();
                }
            }
        });

        this.facultad = new Ext.form.TextArea({
            fieldLabel: _this.etiquetas.lbFacultades + ':',
            labelSeparator: '',
            anchor: '99%',
            name: 'facultad',
            maxLength: 255,
            enableKeyEvents: true,
            tabIndex: 16,
            listeners: {
                keyup: function (textfield, event) {
                    var form = _this.fpContacto;
                    var window = _this.winContacto;
                    _this.checkWindow(action, form, window, textfield.name, textfield.getValue())
                }
            }
        });

        this.tfdpa.addEvents('changedDpa');

        this.hfIdContacto = new Ext.form.Hidden({
            name: 'idcontacto'
        });
        this.hfIdDpa = new Ext.form.Hidden({
            name: 'dpa'
        });
        this.hfId = new Ext.form.Hidden({
            name: 'id'
        });

        this.anexoFacultades = new Ext.form.FileUploadField({
            width: '97%',
            fieldLabel: _this.etiquetas.lbAnexoFacultades,
            name: 'anexofacultades',
            id: 'anexofacultades',
            hidden:true,
            buttonCfg: {
                iconCls: 'icondistra-subirfichero',
                text: ''
            },
            listeners: {
                scope: this,
                fileselected: function (field, value, storeloaded) {
                    var buttons = this.winContacto.buttons;
                    //si existe la propiedad url y el valor del campo proviene del
                    // store del grid principal y no de un fichero cargado
                    this.btnDescargarAnexoFacultades.setDisabled(!(field.url && storeloaded));
                }
            }
        });

        this.btnDescargarAnexoFacultades = new Ext.Button({
            iconCls: 'descargar',
            tooltip: 'Descargar certifico',
            disabled: true,
            handler: function () {
                var url = _this.anexoFacultades.url;
                if (url) {
                    window.open(url);
                }
            }
        });

        this.fpContacto = new Ext.FormPanel({
            frame: true,
            border: false,
            bodyStyle: 'padding:10px 10px 0',
            labelAlign: 'top',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: .18,
                        layout: 'form',
                        items: [new Ext.form.FieldSet({
                            title: _this.etiquetas.lbFoto,
                            height: 138,
                            items: [new Ext.Panel({
                                id: 'p-photo-contacto',
                                border: true,
                                autoShow: true,
                                html: '<div><center><img ext:qtip = "Foto del contacto" id="photo-contacto" src="/configuracion/comun/views/images/contacto.png" ALT="" onclick="_this.photoWindow.show()"/></center></div>'
                            })]
                        })]
                    },
                    {
                        style: 'margin:5 0 0 10',
                        columnWidth: .82,
                        labelAlign: 'top',
                        layout: 'form',
                        items: [
                            {
                                layout: 'column',
                                items: [
                                    {
                                        columnWidth: .99,
                                        layout: 'form',
                                        items: [this.tfnombContacto]
                                    },
                                    {
                                        columnWidth: .36,
                                        layout: 'form',
                                        items: [this.tfnumeroidentidad]
                                    },
                                    {
                                        columnWidth: .34,
                                        layout: 'form',
                                        items: [this.cmbUsuarioContacto,]
                                    },
                                    {
                                        columnWidth: .3,
                                        layout: 'form',
                                        items: [this.tfcargoContacto]
                                    },
                                    {
                                        columnWidth: .36,
                                        layout: 'form',
                                        items: [this.tftelContacto]
                                    }, {
                                        columnWidth: .34,
                                        layout: 'form',
                                        items: [this.tfmovilContacto]
                                    }, {
                                        columnWidth: .3,
                                        layout: 'form',
                                        items: [this.tfemailContacto]
                                    }
                                ]
                            }
                        ]
                    }]
            },
                this.checkDirEmpresa,
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .3,
                            layout: 'form',
                            items: this.tfdpa
                        }, {
                            columnWidth: .7,
                            layout: 'form',
                            items: this.tfdireccion
                        }, {
                            columnWidth: .3,
                            layout: 'form',
                            items: this.tiposfacultades
                        }
                        //
                        // , {
                        //     columnWidth: .3,
                        //     layout: 'form',
                        //     items: this.cmbLineas
                        // }

                        , {
                            columnWidth: .3,
                            layout: 'form',
                            hidden: this.anexoFacultades.hidden,
                            items: this.anexoFacultades
                        }, {
                            columnWidth: .1,
                            layout: 'form',
                            style: 'margin:18 0 0 0',
                            hidden: this.anexoFacultades.hidden,
                            items: this.btnDescargarAnexoFacultades
                        }

                    ]
                },
                {
                    layout: 'form',
                    items: [
                        this.facultad
                    ]
                },
                this.hfIdContacto,
                this.hfId,
                this.hfIdDpa
            ]
        });

        Ext.getCmp('p-photo-contacto').addEvents('setImagen');
        Ext.getCmp('p-photo-contacto').on(
            {
                setImagen: function (newImage) {
                    var form = _this.fpClienteProveedor;
                    var window = _this.winContacto;
                    _this.checkWindow(action, form, window, 'foto', newImage);
                    _this.delImgContacto.enable();
                }
            }
        )
        var title = 'Adicionar contacto';
        var buttons = new Array();
        buttons.push(this.btnCancelContacto);
        if (action == 'Mod') {
            title = 'Modificar contacto';
        } else {
            buttons.push(this.btnAplyContacto);
        }
        buttons.push(this.btnAceptContacto);

        this.winContacto = new Ext.Window({
            modal: true,
            id: 'winContacto',
            closeAction: 'destroy',
            layout: 'fit',
            constrain: true,
            title: title,
            width: 850,
            defaultButton: 'btnCancelContacto',
            height: 450,
            resizable: false,
            items: _this.fpContacto,
            buttons: buttons,
            listeners: {
                destroy: function () {
                    _this.activeWindow = 'cliente';
                    _this.keyMapCliente.enable();
                    var win = Ext.getCmp('winAdd');
                    if (!win) {
                        win = Ext.getCmp('winMod');
                    }
                    win.focus();
                },
                show: function () {
                    _this.keyMapCliente.disable();
                    if ((Ext.isEmpty(_this.iddpa) || _this.iddpa == 0) && Ext.isEmpty(_this.direccion.getValue())) {
                        _this.checkDirEmpresa.setValue(false);
                        _this.checkDirEmpresa.disable();
                    }
                    if (action == 'Mod') {
                        var seleccionados = _this.dvTabContactos.getSelectedRecords();
                        var data = seleccionados[0].data;
                        for (k in data) {
                            if (typeof data[k] == 'string' && data[k].indexOf("</b>") != -1) {
                                data[k] = '';
                            }
                        }
                        _this.fpContacto.getForm().loadRecord(seleccionados[0]);
                        if (seleccionados[0].data.tiposfacultades.length) {
                            var mask = new Ext.LoadMask(_this.winContacto.getEl());
                            _this.tiposfacultades.store.baseParams.idcontacto = seleccionados[0].data.idcontacto;
                            mask.show();
                            _this.tiposfacultades.store.load({
                                params: {start: 0, limit: 20},
                                callback: function (r, o, success) {
                                    mask.hide();
                                    var marcados = [], final = [];
                                    _this.tiposfacultades.expand();
                                    seleccionados[0].data.tiposfacultades.forEach(function (valor) {
                                        _this.tiposfacultades.store.getRange().forEach(function (fac) {
                                            if (fac.get('idtipofacultad') == valor['idtipofacultad']) {
                                                _this.tiposfacultades.onSelect(fac, 0);
                                                _this.btnAceptContacto.setDisabled(true);
                                            }
                                        });
                                    });
                                }
                            });
                        }
                        _this.hfId.setValue(seleccionados[0].id);
                        if (!Ext.isEmpty(seleccionados[0].data.foto)) {
                            var arrTemp = seleccionados[0].data.foto.split(',');
                            if (arrTemp.length == 2) {
                                _this.setImagen(seleccionados[0].data.foto);
                            }
                        }
                        if (seleccionados[0].data.idusuario) {
                            _this.cmbUsuarioContacto.setRawValue(seleccionados[0].data.nombreusuario);
                        }
                    } else {
                        setTimeout(function () {
                            _this.tfnombContacto.focus();
                        }, 10);
                    }
                },
                render: _this.focusSiguiente.createDelegate(_this)
            }
        });

        this.winContacto.show();

        function addContacto(cerrar) {
            _this.tfnombContacto.setValue(_this.tfnombContacto.getValue().trim());
            _this.tfcargoContacto.setValue(_this.tfcargoContacto.getValue().trim());
            _this.tfdireccion.setValue(_this.tfdireccion.getValue().trim());
            if (_this.fpContacto.getForm().isValid()) {
                var contacto = _this.fpContacto.getForm().getValues(),
                    fileupload = _this.anexoFacultades;
                if (contacto.idusuario) {
                    var params = {};
                    var mask = new Ext.LoadMask(_this.winContacto.getEl());
                    params.idusuario = contacto.idusuario;
                    if (contacto.idcontacto) {
                        params.idcontacto = contacto.idcontacto;
                    }
                    if (_this.contactoDel.length != 0) {
                        params.eliminados = Ext.encode(_this.contactoDel);
                    }
                    var store = _this.stTabContactos;
                    var index = store.find('idusuario', contacto.idusuario);
                    if (index != -1 && store.getAt(index).id != _this.hfId.getValue()) {
                        mostrarMensaje(1, _this.etiquetas.msgExistUsuario);
                    } else {
                        mask.show();
                        Ext.Ajax.request({
                            url: 'existeUsuario',
                            params: params,
                            callback: function (options, success, response) {
                                mask.hide();
                                var responseData = Ext.decode(response.responseText);
                                if (responseData.code == -7) {
                                    mostrarMensaje(1, _this.etiquetas.msgExistUsuario);
                                } else {
                                    adicionar(contacto, cerrar,fileupload);
                                }
                            }
                        })
                    }
                } else {
                    contacto.nombreusuario = '';
                    adicionar(contacto, cerrar, fileupload);
                }
            } else {
                mostrarMensaje(1, _this.etiquetas.verificarCampos);
            }
        }

        function adicionar(contacto, cerrar, fileupload) {
            var tiposfacultades = [];
            _this.tiposfacultades.seleccionados.forEach(function (valor) {
                tiposfacultades.push(valor.data)
            });
            contacto.tiposfacultades = tiposfacultades;
            contacto.facultades = tiposfacultades;
            var foto;
            if (document.getElementById('photo-contacto').base64img) {
                foto = document.getElementById('photo-contacto').base64img
            } else {
                foto = null;
            }
            contacto.foto = foto;
            if (_this.checkDirEmpresa.getValue()) {
                contacto.direccionempresa = 1;
                contacto.dpa = _this.iddpa;
                contacto.descripciondpa = _this.dpa.getValue();
                contacto.direccion = _this.direccion.getValue();
            } else {
                contacto.direccionempresa = 0;
            }

            if (_this.cmbUsuarioContacto.getValue()) {
                contacto.nombreusuario = _this.cmbUsuarioContacto.getRawValue();
            }

            if (fileupload && fileupload.getValue()) {
                contacto.archivo = {
                    idfileupload: fileupload.id, //identificador del fileupload en el formulario
                    namefile: fileupload.getValue(),     //Nombre del archivo
                    idfile: '',       //Identificador del archivo en alfresco
                    url: ''          //Direccion del archivo para descargar
                };
                fileupload.hide();
                _this.fpClienteProveedor.add(fileupload);
            }

            var store = _this.stTabContactos;
            var record = {};
            if (action == 'Mod') {
                record = store.getById(_this.hfId.getValue());
                record.beginEdit();
                for (k in contacto) {
                    if(k=='tiposfacultades' || k=='facultades'){
                        record.data.tiposfacultades=contacto[k];
                        record.data.facultades=contacto[k];
                    }else{
                        record.set(k, contacto[k]);
                    }

                    // if(k=='tiposfacultades' || k=='facultades')record.set(k, contacto[k]);
                }
                record.endEdit();
            } else {
                record = _this.crearRecord(store, contacto, false);
                store.add(record);
                for (k in contacto) {
                    if (!Ext.isEmpty(contacto[k])) {
                        record.set(k, contacto[k]);
                    } else {
                        record.set(k, '');
                    }
                }
            }
            if (cerrar) {
                _this.winContacto.destroy();
            } else {
                document.getElementById('photo-contacto').src = "/configuracion/comun/views/images/contacto.png";
                document.getElementById('photo-contacto').base64img = "";
                _this.fpContacto.getForm().reset();
                _this.gpUsuarioContacto.getSelectionModel().clearSelections();
                _this.btnAceptContacto.disable();
                _this.btnAplyContacto.disable();
            }
        }
    },
    winDpa: function () {
        var nodo=new DPA();
        if(_this.pais.getValue())
            nodo.set('idpais', _this.pais.getValue());
        this.dpaWin = new Ext.secodena.comun.window.winSelectDPA({
            nodo: nodo,
            rootNodo: {
                id: 0,
                text: _this.pais.getRawValue() || 'Cuba'
            },
            sinTitulo: true,
            selPais: false,
            constrain: true
        });
        this.dpaWin.show();

        this.dpaWin.on({
            scope: this,
            hide: function () {
                if (this.activeWindow == 'cliente') {
                    this.direccion.focus(true);
                } else if (this.activeWindow == 'contacto') {
                    this.tfdireccion.focus(true);
                }
            },
            destroy: function () {
                if (this.activeWindow == 'cliente') {
                    this.direccion.focus(true);
                } else if (this.activeWindow == 'contacto') {
                    this.tfdireccion.focus(true);
                }
            }
        });

        this.dpaWin.on('dameseleccion', function (win, obj, btn) {
            if (obj) {
                if (_this.activeWindow == 'contacto') {
                    _this.hfIdDpa.setValue(obj.get('iddpt'));
                    _this.tfdpa.setValue(obj.get('denominacion'));
                    _this.tfdpa.fireEvent('changedDpa', _this.tfdpa, obj.get('iddpt'), obj.get('denominacion'));
                } else {
                    _this.iddpa = obj.get('iddpt');
                    _this.dpa.setValue(obj.get('denominacion'));
                    _this.dpa.fireEvent('changedDpa', _this.dpa, obj.get('iddpt'), obj.get('denominacion'));
                }

                win.destroy();
            }
        }.createDelegate(this));
    },
    delContacto: function () {
        var _this = this,
            seleccionados = _this.dvTabContactos.getSelectedRecords(),
            count = seleccionados.length;
        if (count != 0) {
            mostrarMensaje(2, count == 1 ? _this.etiquetas.lbConfiDelContactSingle : _this.etiquetas.lbConfiDelContactPlural, function (btn) {
                if (btn == 'ok') {
                    Ext.each(seleccionados, function (record) {
                        record.commit();
                        _this.stTabContactos.remove(record);
                    });
                }
            });
        }

    },

    fnValidarFormAdicionar: function () {
        console.log('validarrrrrrr fnValidarFormAdicionar function falso')
        //Se eliminan los espacios en blanco del final y principio de las cadenas
        _this.nombre.setValue(_this.nombre.getValue().trim());
        _this.codigo.setValue(_this.codigo.getValue().trim());
        if (_this.codigo.getValue() != '' && _this.codigo.isValid() && _this.nombre.getValue() != '' && _this.nombre.isValid()
        ) {
            if (_this.checkcliente.checked || _this.checkproveedor.checked) {
                var idtipo = 0;
                var idClasificacion = 0;
                var estructura = 0;
                var persona = 0;
                if (_this.checkcliente.checked && _this.checkproveedor.checked) {
                    idtipo = 3;
                } else if (_this.checkcliente.checked) {
                    idtipo = 1;
                } else
                    idtipo = 2;
                if (_this.checkEntidad.checked) {
                    idClasificacion = 1;
                    estructura = Ext.getCmp('idestructura').getValue();
                    persona = null;
                } else {
                    idClasificacion = 2;
                    persona = Ext.getCmp('idpersona').getValue();
                    estructura = null;
                }
                var datos = [];
                var cliente = {
                    foto: document.getElementById('photo-container').base64img || null,
                    idtipo: idtipo,
                    idClasificacion: idClasificacion,
                    idpersona: persona,
                    idestructura: estructura,
                    idclasificacioncontable: _this.clasificacionCont.getValue() || null,
                    credito: _this.credito.getValue() || null,
                    fechainicio: _this.dfInicio.getValue() || new Date(),
                    fechafin: _this.dfFin.getValue() || null,
                    idusuario: _this.cmbUsuario.getValue() || null,
                    idpadre: _this.subordinada.getValue() || null
                };
                if (estructura) {
                    cliente.registrado = 1;
                } else if (persona) {
                    cliente.registrado = 1;
                    cliente.abreviatura = _this.abreviatura.getValue() || null;
                    cliente.descripcion = _this.taDescipcion.getValue() || null;
                } else {
                    cliente.codigo = _this.codigo.getValue() || null;
                    cliente.codigonit = _this.codigoNit.getValue() || null;
                    cliente.abreviatura = _this.abreviatura.getValue() || null;
                    cliente.telefono = _this.telefono.getValue() || null;
                    cliente.idorganismo= _this.organismo.getValue() || null;
                    cliente.idpais= _this.pais.getValue() || null;
                    cliente.idsector= _this.sector.getValue() || null;
                    cliente.correo = _this.correo.getValue() || null;
                    cliente.dpa = _this.iddpa || null;
                    cliente.direccion = _this.direccion.getValue().trim() || null;
                    cliente.descripcion = _this.taDescipcion.getValue() || null;
                    cliente.registrado = 0;
                    cliente.nombre = _this.nombre.getValue().trim() || null;
                    cliente.pnombre = _this.pnombre.getValue().trim() || null;
                    cliente.snombre = _this.snombre.getValue().trim() || null;
                    cliente.papellido = _this.papellido.getValue().trim() || null;
                    cliente.sapellido = _this.sapellido.getValue().trim() || null;
                }
                datos.push(cliente);
                var modifIdents = getIdentsModificados(adicionar);
                datos[0].identificadores = {
                    modificados: modifIdents.length ? modifIdents : null,
                    eliminados: _this.identificadoresDel.length != 0 ? Ext.encode(_this.identificadoresDel) : null
                };
                var vehiculos = getVehiculos(adicionar),
                    vehiculos_eliminados = _this.gridvehiculos.vehiculosDel;
                datos[0].vehiculos = {
                    modificados: vehiculos.length != 0 ? Ext.encode(vehiculos) : null,
                    eliminados: vehiculos_eliminados.length != 0 ? Ext.encode(vehiculos_eliminados) : null
                }
                if (!adicionar) {
                    var cuentabanco = getCuentaBanco(adicionar),
                        eliminados = _this.cuentabancoDel,
                        cobrospagos = getCuentasCobrarPagar(adicionar),
                        lineas=getLineas();

                    datos[0].cuentabanco = {
                        modificados: cuentabanco.length != 0 ? Ext.encode(cuentabanco) : null,
                        eliminados: eliminados.length != 0 ? Ext.encode(eliminados) : null
                    };

                    eliminados = _this.cuentaPagarCobrarDel;
                    datos[0].cobrospagos = {
                        modificados: cobrospagos.length != 0 ? Ext.encode(cobrospagos) : null,
                        eliminados: eliminados.length != 0 ? Ext.encode(eliminados) : null
                    };
                    eliminados = _this.contactoDel;
                    datos[0].contactos = {};
                    datos[0].contactos.eliminados = eliminados.length != 0 ? Ext.encode(eliminados) : null
                    if (idClasificacion == 1) {
                        _this.changeDpaAddress();
                        var contactos = getContactos(adicionar);
                        datos[0].contactos.modificados = contactos.length != 0 ? Ext.encode(contactos) : null;
                    }
                    datos[0].lineas={
                        modificados: lineas.length != 0 ? Ext.encode(lineas) : null,
                        eliminados: _this.lineasDel
                    };
                    datos.push({
                        idclientesproveedores: _this.pClienteProveedor.smClienteProveedor.getSelected().data.idclientesproveedores
                    });
                } else {
                    var cuentabanco = getCuentaBanco(adicionar),
                        cobrospagos = getCuentasCobrarPagar(adicionar),
                        lineas=getLineas();

                    datos[0].cuentabanco = {
                        modificados: cuentabanco.length != 0 ? Ext.encode(cuentabanco) : null
                    };

                    datos[0].cobrospagos = {
                        modificados: cobrospagos.length != 0 ? Ext.encode(cobrospagos) : null
                    };

                    if (idClasificacion == 1) {
                        _this.changeDpaAddress();
                        var contactos = getContactos(adicionar);
                        datos[0].contactos = {
                            modificados: contactos.length != 0 ? Ext.encode(contactos) : null
                        }
                    }
                    datos[0].lineas={
                        modificados: lineas.length != 0 ? Ext.encode(lineas) : null,
                        eliminados: _this.lineasDel
                    };
                }
                return datos;
            } else
                return -2;
        } else
            return -1;
    },
    respuestaVehiculosMarcas: function(data, opcion, apl){
        console.log('respuestaVehiculosMarcas:',typeof data['marcas'],
            Object.keys(data['marcas']).length,Object.keys(data['marcas']), data, data['marcas'])
        console.log(data['vehiculos'].length, data['vehiculos'])
        if(Object.keys(data['marcas']).length>0){
            if(Ext.isArray(data['marcas'])) {
                mostrarMensaje(1, 'Las siguientes marcas no están registradas en el maestro de productos: ' + data['marcas'].join(', ') +
                    ' Debe ir al maestro de productos a insertarlas.');
            }else if(typeof data['marcas'] === 'object'){
                var comb='';
                Object.keys(data['marcas']).forEach(function(x){
                    comb+=x+': '+data['marcas'][x].join(', ')+',';
                })
                mostrarMensaje(1, 'Las siguientes combinaciones Marca-Modelo no existen: ' + comb +
                    ' Debe ir al maestro de productos a insertar el modelo a la marca específica.');
            }
        }else if(data['vehiculos'].length>0){
            // mostrarMensaje(1, 'Los vehiculos con numero de serie: '+responseData['data']['vehiculos'].join(', ')+
            //     ' ya se encuentran asignados a otro cliente.');
            Ext.Msg.show({
                title:'Confirmación',
                msg: 'Ya existen vehiculos con las series: '+data['vehiculos'].join(', ')+
                ' asociados a otros clientes.<br>' +
                '¿Desea reasignarlos a este cliente?<br>' +
                'Elegir Si asignará los vehiculos a este cliente y los quitará del anterior.<br>' +
                'Elegir No dejará los vehículos en los antiguos clientes y no los agregará a este.<br>' +
                'Elegir Cancelar cancelará la acción de guardar.',
                buttons: Ext.Msg.YESNOCANCEL,
                animEl: 'elId',
                icon: Ext.MessageBox.QUESTION,
                fn: function (btn) {
                    switch (btn) {
                        case 'yes':
                            data['vehiculos'].forEach(function(serie){
                                var store=_this.gridvehiculos.grid.getStore();
                                var index=store.find('serie', serie, 0, false, true)
                                if(index!=-1){
                                    store.getAt(index).set('reasignar', 1)
                                }
                            })
                            _this.winFpRegistrar(opcion, apl);

                            break;
                        case 'no':
                            data['vehiculos'].forEach(function(serie){
                                var store=_this.gridvehiculos.grid.getStore();
                                var index=store.find('serie', serie, 0, false, true)
                                if(index!=-1){
                                    store.remove(store.getAt(index));
                                }
                            })
                            _this.winFpRegistrar(opcion, apl);
                            break;
                        default :
                            break;
                    }
                },
            });
        }
        _this.keyMapCliente.enable();
    },
    addcliente: function (opcion, apl, data) {
        _this.onloadMessageBox(_this.etiquetas.lbEsperando, _this.etiquetas.msgWaitAdd);
        _this.fpClienteProveedor.getForm().submit({
            method: "POST",
            url: 'adicionar',
            params: {
                datos: Ext.encode(data)
            },
            success: function (form, action) {
                Ext.MessageBox.hide();
                var responseData = Ext.decode(action.response.responseText);
                switch (responseData.code) {
                    case -1:
                        mostrarMensaje(1, _this.etiquetas.msgAddok);
                        if (_this.pClienteProveedor.store.baseParams.limit && _this.pClienteProveedor.store.baseParams.limit != 0) {
                            _this.pClienteProveedor.store.baseParams.start = 0;
                            _this.pClienteProveedor.store.baseParams.limit = 20;
                        }
                        _this.pClienteProveedor.store.reload();
                        if (!apl) {
                            Ext.getCmp('winAdd').close();
                            _this.keyMapCliente.disable();
                        } else {
                            _this.keyMapCliente.enable();
                            _this.setearCampos();
                            _this.checkEntidad.setValue(true);
                            document.getElementById('photo-container').base64img = "";
                        }
                        break;
                    case -2:
                        _this.keyMapCliente.enable();
                        _this.dfFin.validate();
                        mostrarMensaje(1, _this.etiquetas.msgExistCodigo);
                        break;
                    case -3:
                        _this.keyMapCliente.enable();
                        _this.dfFin.validate();
                        mostrarMensaje(1, _this.etiquetas.msgExistUsuario);
                        break;
                    case -4:
                        _this.keyMapCliente.enable();
                        _this.dfFin.validate();
                        mostrarMensaje(1, _this.etiquetas.msgExistPersona);
                        break;
                    case -5:
                        _this.keyMapCliente.enable();
                        _this.dfFin.validate();
                        mostrarMensaje(1, _this.etiquetas.msgExistEstructura);
                        break;
                    case -6:
                        // console.log('quququqququ')
                        _this.respuestaVehiculosMarcas(responseData['data'], opcion, apl);
                        // if(responseData['data']['vehiculos'].length>0){
                        //     // mostrarMensaje(1, 'Los vehiculos con numero de serie: '+responseData['data']['vehiculos'].join(', ')+
                        //     //     ' ya se encuentran asignados a otro cliente.');
                        //     Ext.Msg.show({
                        //         title:'Confirmación',
                        //         msg: 'Ya existen vehiculos con las series: '+responseData['data']['vehiculos'].join(', ')+
                        //         ' asociados a otros clientes.<br>' +
                        //         '¿Desea reasignarlos a este cliente?<br>' +
                        //         'Elegir Si asignará los vehiculos a este cliente y los quitará del anterior.<br>' +
                        //         'Elegir No dejará los vehículos en los antiguos clientes y no los agregará a este.<br>' +
                        //         'Elegir Cancelar cancelará la acción de guardar.',
                        //         buttons: Ext.Msg.YESNOCANCEL,
                        //         animEl: 'elId',
                        //         icon: Ext.MessageBox.QUESTION,
                        //         fn: function (btn) {
                        //             switch (btn) {
                        //                 case 'yes':
                        //                     responseData['data']['vehiculos'].forEach(function(serie){
                        //                         var store=_this.gridvehiculos.grid.getStore();
                        //                         var index=store.find('serie', serie, 0, false, true)
                        //                         if(index!=-1){
                        //                             store.getAt(index).set('reasignar', 1)
                        //                         }
                        //                     })
                        //                     _this.winFpRegistrar(opcion, apl);
                        //
                        //                     break;
                        //                 case 'no':
                        //                     responseData['data']['vehiculos'].forEach(function(serie){
                        //                         var store=_this.gridvehiculos.grid.getStore();
                        //                         var index=store.find('serie', serie, 0, false, true)
                        //                         if(index!=-1){
                        //                             store.remove(store.getAt(index));
                        //                         }
                        //                     })
                        //                     _this.winFpRegistrar(opcion, apl);
                        //                     break;
                        //                 default :
                        //                     break;
                        //             }
                        //         },
                        //     });
                        // }
                        // _this.keyMapCliente.enable();
                        break;
                }
            },
            failure: function () {
                Ext.MessageBox.hide();
            }
        });
    },

    winFpRegistrar: function (opcion, apl) {
        switch (opcion) {
            case 'Add': {
                var data = fnValidarFormAdicionar(true);
                if (data != -1) {
                    if (data != -2) {
                        if (_this.subordinada.getValue() != null && _this.subordinada.getValue() != '' &&
                            _this.nombre.getValue() == _this.nombre.valorSubordinada) {
                            mostrarMensaje(2, _this.etiquetas.msgNombreSubordinadaIgualPadre,
                                function (btnPresionado) {
                                    if (btnPresionado == 'ok') {
                                        _this.addcliente(opcion, apl, data)
                                    }
                                });
                        } else {
                            _this.addcliente(opcion, apl, data);
                        }
                    } else {
                        _this.keyMapCliente.enable();
                        mostrarMensaje(1, _this.etiquetas.NoSelectClasificacion);
                    }
                } else {
                    _this.keyMapCliente.enable();
                    mostrarMensaje(1, _this.etiquetas.verificarCampos);
                }
                break;
            }

            case 'Mod': {
                var data = fnValidarFormAdicionar(false);
                if (data != -1) {
                    if (data != -2) {
                        _this.onloadMessageBox(_this.etiquetas.lbEsperando, _this.etiquetas.msgWaitAdd);
                        _this.fpClienteProveedor.getForm().submit({
                            method: "POST",
                            url: 'modificar',
                            params: {
                                datos: Ext.encode(data)
                            },
                            success: function (form, action) {
                                Ext.MessageBox.hide();
                                var responseData = Ext.decode(action.response.responseText);
                                switch (responseData.code) {
                                    case -1:
                                        mostrarMensaje(1, _this.etiquetas.msgModok);
                                        _this.pClienteProveedor.store.reload();
                                        if (_this.pClienteProveedor.store.baseParams.limit && _this.pClienteProveedor.store.baseParams.limit != 0) {
                                            _this.pClienteProveedor.store.baseParams.start = 0;
                                            _this.pClienteProveedor.store.baseParams.limit = 20;
                                        }
                                        _this.keyMapCliente.disable();
                                        Ext.getCmp('winMod').close();
                                        break;
                                    case -2:
                                        mostrarMensaje(1, _this.etiquetas.msgExistCodigo);
                                        _this.keyMapCliente.enable();
                                        break;
                                    case -3:
                                        mostrarMensaje(1, _this.etiquetas.msgExistUsuario);
                                        _this.keyMapCliente.enable();
                                        break;
                                    case -4:
                                        mostrarMensaje(1, _this.etiquetas.msgExistPersona);
                                        _this.keyMapCliente.enable();
                                        break;
                                    case -5:
                                        mostrarMensaje(1, _this.etiquetas.msgExistEstructura);
                                        _this.keyMapCliente.enable();
                                        break;
                                    case -6:
                                        console.log('quququqququ1')
                                        _this.respuestaVehiculosMarcas(responseData['data'], opcion, apl);
                                        break;
                                }
                            },
                            failure: function () {
                                Ext.MessageBox.hide();
                            }
                        });
                    } else {
                        _this.keyMapCliente.enable();
                        mostrarMensaje(1, _this.etiquetas.NoSelectClasificacion);
                    }
                } else {
                    _this.keyMapCliente.enable();
                    mostrarMensaje(1, _this.etiquetas.verificarCampos);
                }
            }
                break;
            case 'Del': {
                _this.keyMap.disable();
                if (!_this.pClienteProveedor.smClienteProveedor.getSelected()) {
                    mostrarMensaje(1, _this.etiquetas.lbSelectFilaElim);
                } else if (_this.pClienteProveedor.smClienteProveedor.getCount() == 1) {
                    mostrarMensaje(2, _this.etiquetas.lbConfiDelSingle, eliminar);
                } else {
                    mostrarMensaje(2, _this.etiquetas.lbConfiDelPlural, eliminar);
                }
            }
                break;
            case "Usar":
                this.keyMap.disable();
                this.usarEntidad();
                break;
            case "NoUsar":
                this.keyMap.disable();
                this.noUsarEntidad();
                break;
        }



        function fnValidarFormAdicionar(adicionar) {
            console.log('suelta function fnValidarFormAdicionar REAL')
            //Se eliminan los espacios en blanco del final y principio de las cadenas
            _this.nombre.setValue(_this.nombre.getValue().trim());
            _this.codigo.setValue(_this.codigo.getValue().trim());
            if (_this.codigo.getValue() != '' && _this.codigo.isValid() //&& _this.nombre.getValue() != '' && _this.nombre.isValid()
            ) {
                var mayorista = 0;
                if (_this.checkMayorista.checked) {
                    mayorista = 1;
                }
                if (_this.checkcliente.checked || _this.checkproveedor.checked) {
                    var idtipo = 0;
                    var idClasificacion = 0;
                    var estructura = 0;
                    var persona = 0;
                    if (_this.checkcliente.checked && _this.checkproveedor.checked) {
                        idtipo = 3;
                    } else if (_this.checkcliente.checked) {
                        idtipo = 1;
                    } else
                        idtipo = 2;
                    if (_this.checkEntidad.checked) {
                        idClasificacion = 1;
                        estructura = Ext.getCmp('idestructura').getValue();
                        persona = null;
                    } else {
                        idClasificacion = 2;
                        persona = Ext.getCmp('idpersona').getValue();
                        estructura = null;
                    }
                    var datos = [];
                    
                    var cliente = {
                        ..._this.fpClienteProveedor.getForm().getValues(),
                        foto: document.getElementById('photo-container').base64img || null,
                        idtipo: idtipo,
                        idClasificacion: idClasificacion,
                        idpersona: persona,
                        idestructura: estructura,
                        idclasificacioncontable: _this.clasificacionCont.getValue() || null,
                        credito: _this.credito.getValue() || null,
                        fechainicio: _this.dfInicio.getValue() || new Date(),
                        fechafin: _this.dfFin.getValue() || null,
                        idusuario: _this.cmbUsuario.getValue() || null,
                        idpadre: _this.subordinada.getValue() || null,
                        codigo : _this.codigo.getValue() || null,
                        codigonit: _this.codigoNit.getValue() || null,
                        // nombre: _this.nombre.getValue().trim() || null,
						idorganismo: _this.organismo.getValue() || null,
						idpais: _this.pais.getValue() || null,
						idsector: _this.sector.getValue() || null,
                        abreviatura: _this.abreviatura.getValue() || null,
                        telefono: _this.telefono.getValue() || null,
                        correo: _this.correo.getValue() || null,
                        dpa: _this.iddpa || null,
                        direccion: _this.direccion.getValue().trim() || null,
                        descripcion: _this.taDescipcion.getValue() || null,
                        registrado: (estructura || persona) ? 1 : 0,
                        mayorista: mayorista,
                        nombre: _this.nombre.getValue().trim() || null,
                        pnombre: _this.pnombre.getValue().trim() || null,
                        snombre: _this.snombre.getValue().trim() || null,
                        papellido: _this.papellido.getValue().trim() || null,
                        sapellido: _this.sapellido.getValue().trim() || null,
                        fechaaprobacion: _this.fechaAprobacion.getValue() || null,
                        fechafin: _this.fechaVencimiento.getValue() || null,
                        tipoproveedorproducto: _this.rgTipoProvedorProducto.getValue() || null,
                        tipoproveedortiempo: _this.rgTipoProveedorTiempo.getValue() || null,
                        removedAdjuntos: Ext.encode(_this.pAdjuntos.removedAdjuntos),
                        modifiedAdjuntos: Ext.encode(_this.pAdjuntos.getModifiedAdjuntos()),
                    };
                    // if(_this.tabadjuntos)
                    //     cliente = {...cliente, ...getDatosAdjuntos()};
                    datos.push(cliente);
                    var modifIdents = getIdentsModificados(adicionar);
                    datos[0].identificadores = {
                        modificados: modifIdents.length ? modifIdents : null,
                        eliminados: _this.identificadoresDel.length != 0 ? Ext.encode(_this.identificadoresDel) : null
                    };
					if(_this.addvehiculos)
			       {
                    var vehiculos = getVehiculos(adicionar),
                        vehiculos_eliminados = _this.gridvehiculos.vehiculosDel;
                    datos[0].vehiculos = {
                        modificados: vehiculos.length != 0 ? Ext.encode(vehiculos) : null,
                        eliminados: vehiculos_eliminados.length != 0 ? Ext.encode(vehiculos_eliminados) : null
                    };
					}
                    if (!adicionar) {
                        var cuentabanco = getCuentaBanco(adicionar),
                            eliminados = _this.cuentabancoDel,
                            cobrospagos = getCuentasCobrarPagar(adicionar),
                            lineas= getLineas(adicionar);

                        datos[0].cuentabanco = {
                            modificados: cuentabanco.length != 0 ? Ext.encode(cuentabanco) : null,
                            eliminados: eliminados.length != 0 ? Ext.encode(eliminados) : null
                        };

                        eliminados = _this.cuentaPagarCobrarDel;
                        datos[0].cobrospagos = {
                            modificados: cobrospagos.length != 0 ? Ext.encode(cobrospagos) : null,
                            eliminados: eliminados.length != 0 ? Ext.encode(eliminados) : null
                        };
                        eliminados = _this.contactoDel;
                        datos[0].contactos = {};
                        datos[0].contactos.eliminados = eliminados.length != 0 ? Ext.encode(eliminados) : null
                        if (idClasificacion == 1) {
                            _this.changeDpaAddress();
                            var contactos = getContactos(adicionar);
                            datos[0].contactos.modificados = contactos.length != 0 ? Ext.encode(contactos) : null;
                        }
                        datos[0].lineas={
                            modificados: lineas.length != 0 ? Ext.encode(lineas) : null,
                            eliminados: _this.lineasDel
                        };
                        datos.push({
                            idclientesproveedores: _this.pClienteProveedor.smClienteProveedor.getSelected().data.idclientesproveedores
                        });

                    } else {
                        var cuentabanco = getCuentaBanco(adicionar),
                            cobrospagos = getCuentasCobrarPagar(adicionar),
                            lineas= getLineas(adicionar);

                        datos[0].cuentabanco = {
                            modificados: cuentabanco.length != 0 ? Ext.encode(cuentabanco) : null
                        };

                        datos[0].cobrospagos = {
                            modificados: cobrospagos.length != 0 ? Ext.encode(cobrospagos) : null
                        };

                        if (idClasificacion == 1) {
                            _this.changeDpaAddress();
                            var contactos = getContactos(adicionar);
                            datos[0].contactos = {
                                modificados: contactos.length != 0 ? Ext.encode(contactos) : null
                            }
                        }
                        console.log('lineas:', lineas)
                        datos[0].lineas={
                            modificados: lineas.length != 0 ? Ext.encode(lineas) : null,
                            eliminados: _this.lineasDel
                        };
                    }
                    return datos;
                } else
                    return -2;
            } else
                return -1;
        }

        function eliminar(btnPresionado) {
            if (btnPresionado == 'ok') {
                if (_this.pClienteProveedor.smClienteProveedor.getCount() == 1)
                    _this.onloadMessageBox(_this.etiquetas.lbEsperando, _this.etiquetas.msgWaitDelSingle);
                else
                    _this.onloadMessageBox(_this.etiquetas.lbEsperando, _this.etiquetas.msgWaitDelPlural);
                var selection = _this.pClienteProveedor.smClienteProveedor.getSelections();
                var arrayIds = [];
                for (var i = 0; i < selection.length; i++) {
                    arrayIds.push(selection[i].data.idclientesproveedores);
                }
                Ext.Ajax.request({
                    url: 'eliminar',
                    method: 'POST',
                    params: {
                        arrayId: Ext.encode(arrayIds)
                    },
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        responseData = Ext.decode(response.responseText);
                        switch (responseData.codMsgg) {
                            case -1:
                                mostrarMensaje(1, _this.etiquetas.lbElimSingleOk);
                                break;
                            case -2:
                                mostrarMensaje(1, _this.etiquetas.lbElimPluralOk);
                                break;
                            case -3:
                                mostrarMensaje(1, _this.etiquetas.lbEsdeUso);
                                break;
                        }
                        if (_this.pClienteProveedor.store.baseParams.limit && _this.pClienteProveedor.store.baseParams.limit != 0) {
                            _this.pClienteProveedor.store.baseParams.start = 0;
                            _this.pClienteProveedor.store.baseParams.limit = 20;
                        }
                        _this.pClienteProveedor.store.load({
                            callback: function () {
                                _this.keyMap.enable();
                            }
                        });
                    }
                });
            } else {
                _this.keyMap.enable();
                var btnAdd = _this.pClienteProveedor.btnAdicionar;
                if (btnAdd) {
                    btnAdd.focus();
                }
            }
        }

        function getIdentsModificados(adicionar) {
            var stident = _this.identificadores.getStore(),
                respuesta = [],
                modificados = stident.data.items;
            if (!adicionar) {
                modificados = stident.getModifiedRecords();
            }
            Ext.each(modificados, function (item) {
                respuesta.push(item.data);
            });
            return respuesta;
        }

        function getCuentaBanco(adicionar) {
            var arrTemp = new Array();
            var store = _this.stTabContabilidad;
            var container = store.data.items;
            if (!adicionar) {
                container = store.getModifiedRecords();
            }
            Ext.each(container, function (item) {
                arrTemp.push(item.data);
            });
            return arrTemp;
        }

        function getVehiculos(adicionar) {
            var arrTemp = new Array();
		    if(_this.addvehiculos)
			{

                var store = _this.gridvehiculos.grid.getStore();
                var container = store.data.items;
                // if (!adicionar) {
                //     container = store.getModifiedRecords();
                // }
                Ext.each(container, function (item) {
                    if(item.get('idindicador')=='' || item.get('idindicador')==null)
                        arrTemp.push(item.data);
                });
			}
            return arrTemp;
        }

        function getContactos(adicionar) {
            var arrTemp = new Array();
            var store = _this.stTabContactos;
            var container = store.data.items;
            if (!adicionar) {
                container = store.getModifiedRecords();
            }
            Ext.each(container, function (item) {
                for (k in item.data) {
                    if (typeof item.data[k] == 'string' && item.data[k].indexOf("</b>") != -1) {
                        item.data[k] = null;
                    }
                }
                var foto = item.data.foto;
                var temp = foto ? foto.split(',') : [];
                if (temp.length != 2) {
                    item.data.foto = null;
                }
                if (Ext.isEmpty(item.data.dpa)) {
                    item.data.dpa = null;
                }
                arrTemp.push(item.data);
            });
            return arrTemp;
        }

        function getCuentasCobrarPagar(adicionar) {
            var arrTemp = new Array();
            var store = _this.stCobrosPagos;
            var container = store.data.items;
            if (!adicionar) {
                container = store.getModifiedRecords();
            }
            Ext.each(container, function (item) {
                arrTemp.push(item.data);
            });
            return arrTemp;
        }

        function getLineas(adicionar) {
            var arrTemp = new Array();
            var store = _this.stLineas;
            var container = store.data.items;
            if (!adicionar) {
                container = store.getModifiedRecords();
            }
            console.log('store.data.items:', store.data.items)
            console.log('store.getModifiedRecords():', store.getModifiedRecords())
            Ext.each(container, function (item) {
                var datos = item.data;
                datos.idnaturaleza = datos.idnaturaleza.map(x=>x.data.idnaturaleza).toString();
                arrTemp.push(datos);
            });
            console.log('arrTemp:', arrTemp)
            return arrTemp;
        }

        function getDatosAdjuntos(){
            console.log('getDatosAdjuntos',_this.pAdjuntos, _this.pAdjuntos.items)
            if(_this.pAdjuntos.items && _this.pAdjuntos.items.length){
                
            }
        }
    },
    setImagen: function (base64Img) {
        var panel = 'photo-container';
        if (_this.activeWindow == 'contacto') {
            panel = 'photo-contacto';
        } else if (_this.activeWindow == '') {
            panel = 'photo-cliente';
        }
        var arrTemp = base64Img.split(',');
        if (arrTemp.length == 1) {
            base64Img = 'data:image/jpg;base64,' + arrTemp[0];
        }
        document.getElementById(panel).src = base64Img;
        document.getElementById(panel).base64img = base64Img;
        Ext.getCmp('p-' + panel).fireEvent('setImagen', base64Img);
    },
    setClasificacionTipo: function (changePerson) {
        var cliente = _this.checkcliente.getValue()
        var proveedor = _this.checkproveedor.getValue();
        var entidad = _this.checkEntidad.getValue();
        var imagen = document.getElementById('photo-container').base64img;
        if (!imagen || changePerson) {
            var idtipo = 1, idclasificacion = 1;

            if (cliente && proveedor) {
                idtipo = 3;
            } else if (proveedor) {
                idtipo = 2;
            }

            if (!entidad) {
                idclasificacion = 2;
            } else {
                idclasificacion = 1;
            }
            var imagen = _this.pClienteProveedor.getImagen(idtipo, idclasificacion);
            document.getElementById('photo-container').src = imagen.ruta;
            document.getElementById('photo-container').qtip = "Foto de la " + imagen.qtip;
            document.getElementById('photo-container').base64img = '';
        }

        var trigger = document.getElementsByClassName("x-form-trigger x-form-search-trigger");
        if (entidad) {
            trigger[1].qtip = _this.etiquetas.lbBuscarEntidad;
        } else {
            trigger[1].qtip = _this.etiquetas.lbBuscarPersona;
        }
    },
    desabilitarCampos: function (persona, reset) {
        this.codigo.disable();
        this.nombre.disable();
        this.telefono.disable();
        this.correo.disable();
        this.dpa.disable();
        this.direccion.disable();
        if (!persona) {
            this.abreviatura.disable();
            this.taDescipcion.disable();
        } else {
            this.cmbUsuario.enable();
        }
        if (reset) {
            this.telefono.setValue('');
            this.correo.setValue('');
            this.dpa.setValue('');
            this.iddpa = null;
            this.direccion.setValue('');
            this.abreviatura.setValue('');
            this.taDescipcion.setValue('');
            this.cmbUsuario.setValue('');
        }
    },
    habilitarCampos: function () {
        this.codigo.enable();
        this.nombre.enable();
        this.abreviatura.enable();
        this.telefono.enable();
        this.correo.enable();
        this.dpa.enable();
        this.direccion.enable();
        this.taDescipcion.enable();
    },
    setearCampos: function () {
        this.fpClienteProveedor.getForm().reset();
        this.taDescipcion.setValue('');
        this.credito.setValue('');
        this.clasificacionCont.reset();
        Ext.getCmp('idestructura').setValue('');
        Ext.getCmp('idpersona').setValue('');
        this.setClasificacionTipo(false);
        this.stTabContabilidad.removeAll();
        this.stTabContactos.removeAll();
        this.stCobrosPagos.removeAll();
        this.tpdDtalles.activate('iddescipcion');
        if (this.gpUsuario.rendered) {
            this.gpUsuario.getSelectionModel().clearSelections();
        }
    },
    desmarcarCasillas: function (grid, campo, field) {
        var row = grid.getView().findRowIndex(field);
        var store = grid.getStore()
        var record = store.getAt(row);
        if (record.data[campo]) {
            Ext.each(store.data.items, function (item, index) {
                if (index != row && item.data[campo]) {
                    item.set(campo, false);
                    return false;
                }
            }, this);
        } else {
            store.getAt(0).set(campo, true);
        }
    },
    existeRecord: function (store, record, changes, cm) {
        var columns = cm.columns,
            existe = false,
            exclude = ['predeterminada'];
        Ext.each(store.data.items, function (item) {
            if (record.id != item.id) {
                var cont = 0,
                    columnCount = columns.length;
                Ext.each(columns, function (column) {
                    var key = column.dataIndex;
                    if (!Ext.isEmpty(key) && exclude.indexOf(key) == -1) {
                        if (item.data[key] == record.data[key] || item.data[key] == changes[key]) {
                            cont++;
                        }
                    } else {
                        columnCount--;
                    }

                });
                if (cont == columnCount) {
                    existe = true;
                    return false;
                }
            }
        }, this);
        return existe;
    },
    validaCondPago: function(store, record){
        var config=[];
        Ext.each(store.data.items, function (x) {
            config.push(x.get('idclasificacion')+'-'+x.get('idmoneda')+'-'+x.get('idterminodepago'));
        });
        return config.indexOf(record['idclasificacion']+'-'+record['idmoneda']+'-'+record['idterminodepago'])!=-1;
    },
    crearRecord: function (store, values, include) {
        var arrTemp = [];
        var objTemp = {};
        Ext.each(store.fields.keys, function (key) {
            arrTemp.push({name: key});
            if (include) {
                objTemp[key] = values[key];
            } else {
                objTemp[key] = '';
            }
        });
        var RecordDinamico = Ext.data.Record.create(arrTemp);
        return new RecordDinamico(objTemp);
    },
    changeDpaAddress: function () {
        var store = _this.stTabContactos;
        var total = store.getCount();
        if (total != 0) {
            Ext.each(store.data.items, function (item) {
                if (item.data.direccionempresa == 1) {
                    if (item.data.iddpa != _this.iddpa) {
                        item.set('dpa', _this.iddpa);
                        item.set('descripciondpa', _this.dpa.getValue());
                    }
                    if (item.data.direccion != _this.direccion.getValue()) {
                        item.set('direccion', _this.direccion.getValue());
                    }
                }
            });


        }
    },
    checkWindow: function (action, form, window, name, value) {
        var buttons = window.buttons;
        var idWindow = window.id;
        if (form.getForm().isValid()) {
            if (action == 'Mod' && this.changeValue(name, value, idWindow)) {
                buttons[1].enable();
            } else if (action != 'Mod') {
                buttons[1].enable();
                buttons[2].enable();
            } else {
                buttons[1].disable();
            }
        } else {
            if (action == 'Mod') {
                buttons[1].disable();
            } else {
                buttons[1].disable();
                buttons[2].disable();
            }
        }
    },
    changeValue: function (name, value, idWindow) {
        if (idWindow == 'winContacto') {
            var oldValue = _this.dvTabContactos.getSelectedRecords()[0].data[name];
        } else if (_this.seleccionado) {
            var oldValue = _this.seleccionado[name];
        }
        var change = false;
        if ((!Ext.isEmpty(oldValue) && !Ext.isEmpty(value)) ||
            (Ext.isEmpty(oldValue) && !Ext.isEmpty(value)) || (!Ext.isEmpty(oldValue) && Ext.isEmpty(value))) {
            if (oldValue != value) {
                change = true;
            }
        }
        return change;
    },
    cargarDatosPersonaEstructura: function (data, callback) {
        Ext.Ajax.request({
            method: "POST",
            url: 'obtenerDatosAuxCltProvd',
            params: {
                idestructura: data.idestructura,
                idpersona: data.idpersona
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData) {
                    _this.cargarDatosFijos(responseData);
                } else
                    mostrarMensaje(3, _this.etiquetas.msgDefaultError);
                if (callback && typeof callback == 'function') {
                    callback();
                }
            }
        });
    },
    obtenerDatosAdicionales: function (idcliente, contactos, callback) {
        var responseData = {};
        console.log('addvehiculos:', addvehiculos)
        Ext.Ajax.request({
            method: "POST",
            url: 'obtenerDatosAdicionales',
            params: {
                idcliente: idcliente,
                contactos: contactos,
                vehiculo: this.addvehiculos
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (callback && typeof callback == 'function') {
                    callback();
                }
            }
        });
        return responseData;
    },
    crearMapa: function () {
        this.map = new Ext.ComponentMap({
            titleWindow: this.etiquetas.titleLocalizar,
            readOnly: true,
            showWindow: true
        });
        var seleccionado = this.pClienteProveedor.smClienteProveedor.getSelected().data;
        var idtipo = seleccionado.idtipo;
        var idclasificacion = seleccionado.idclasificacion;

        var imagen = this.getImagen(idtipo, idclasificacion, false);

        this.map.createMap({
            name: seleccionado.nombre,
            icon: imagen.ruta
        });

        this.keyMap.disable();

        this.map.on(
            {
                scope: this,
                windowclose: function (window) {
                    if (Ext.isEmpty(this.activeWindow)) {
                        this.keyMap.enable();
                    }
                },
                capture: function (objeto) {
                    var seleccionado = this.pClienteProveedor.smClienteProveedor.getSelected().data;
                    if (typeof seleccionado.idmapa == 'string' && seleccionado.idmapa.indexOf("</b>") != -1) {
                        seleccionado.idmapa = '';
                    }
                    objeto.idmapa = seleccionado.idmapa;
                    objeto.idcliente = seleccionado.idclientesproveedores;
                    this.addPtoMapa(objeto);
                }
            }
        )
    },
    searchConcept: function (store, sf) {
        var filtro = sf.getValue();
        store.baseParams.filtro = filtro;
        store.load({
            params: {
                start: 0,
                limit: 20
            }
        });
    },
    clearField: function (store) {
        store.baseParams.filtro = '';
        store.load({
            params: {
                start: 0,
                limit: 20
            }
        });
    },
    setRecordValues: function (record, grid, rowIndex) {
        var count = grid.getColumnModel().columns.length;

        for (var i = 0; i < count; i++) {
            var editor = grid.getColumnModel().getCellEditor(i, rowIndex);
            if (editor) {
                var field = grid.getColumnModel().getCellEditor(i, rowIndex).field,
                    display = field.displayField;
                if (field.id != "cmbMoneda") {
                    var value = field.getRawValue();
                    record.set(display, value);
                } else {
                    var moneda = this.stMoneda.getById(field.getValue());
                    if (moneda) {
                        var value = moneda.data.codigoiso;
                        record.set(display, value);
                    }
                }
            }
        }
    },
    selectById: function (id, field, store, sm) {
        if (id) {
            var index = store.find(field, id);
            if (index != -1) {
                var record = store.getAt(index);
                sm.selectRow(index);
            } else {
                sm.clearSelections();
            }
        }
    },
    loadSucursal: function (idbanco) {
        this.stSucursal.baseParams.idbanco = idbanco;
        this.stSucursal.load({
            scope: this,
            callback: function (records, options, success) {
                if (records.length == 0) {
                    mostrarMensaje(1, this.etiquetas.msgNoSucursal);
                }
            }
        })
    },
    setComboValue: function (combo, nombre, id) {
        if (!this.firstEdited) {
            setTimeout(function () {
                combo.setValue(nombre);
                combo.value = id;
                combo.enable();
            }, 5)
            this.cont++;
            if (this.cont == 2) {
                this.firstEdited = true;
            }
        } else {
            combo.setValue(nombre);
            combo.value = id;
            combo.enable();
        }

    },
    getImagen: function (idtipo, idclasificacion, min) {
        var tipo = 'cliente';
        var qtipTipo = this.etiquetas.lbCliente;
        var clasificacion = 'entidad';
        var qtipClasificaion = this.etiquetas.lbEntidad;
        if (idtipo == 2) {
            tipo = "proveedor";
            qtipTipo = this.etiquetas.lbProveedor;
        } else if (idtipo == 3) {
            tipo = "cliente-proveedor";
            qtipTipo = this.etiquetas.lbClienteProveedor;
        }
        if (idclasificacion == 2) {
            clasificacion = "persona";
            qtipClasificaion = this.etiquetas.lbPersona;
        }
        var imagen = clasificacion + "_" + tipo;
        if (min) {
            imagen += '_min';
        }
        var ruta = "/configuracion/comun/views/images/" + imagen + ".png";
        var qtip = qtipClasificaion + ' ' + qtipTipo;
        return {ruta: ruta, qtip: qtip};
    },
    addPtoMapa: function (objeto) {
        var mask = new Ext.LoadMask(Ext.getBody());
        mask.show();
        Ext.Ajax.request({
            url: 'addPtoMapa',
            params: objeto,
            scope: this,
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                var seleccionado = this.pClienteProveedor.smClienteProveedor.getSelected();
                seleccionado.data.idmapa = response.idmapa;
                mask.hide();
                this.map.reloadMap();
            }
        })
    },
    focusSiguiente: function (window) {
        var _this = this;
        Ext.EventManager.on(window.el, 'keydown', function (e) {
            if (e.getKey() == Ext.EventObject.TAB || e.getKey() == 9) {
                var target = e.getTarget();
                while (target && target.nodeType === 1 && target !== document.body) {
                    var cmp = Ext.getCmp(target.id);
                    if (cmp) {
                        if (cmp === _this.taDescipcion) {
                            e.preventDefault();
                            window.focus();
                        }
                        if (cmp === _this.dfFin && _this.tpdDtalles.getActiveTab().id == 'images-view') {
                            e.preventDefault();
                            _this.btnAddContacto.focus();
                        }
                        if (cmp === _this.credito) {
                            e.preventDefault();
                            _this.gpTabContabilidad.btnadd.focus();
                        }
                        if (cmp === _this.credito) {
                            e.preventDefault();
                            _this.gpTabContabilidad.btnadd.focus();
                        }
                        if (_this.firstElement && _this.lastElement && target.id === _this.lastElement.id) {
                            e.preventDefault();
                            _this.firstElement.focus(true);
                        }
                        if (cmp === _this.btnAceptContacto) {
                            e.preventDefault();
                            _this.tfnombContacto.focus(true);
                        }
                        break;
                    }
                    target = target.parentNode;
                }
            }
        });
    },
    usarEntidad: function () {
        // var records = this.pClienteProveedor.smClienteProveedor.getSelections(),
        var _this = this,
            records = this.gridSeleccionarCliente.getSelectionModel().getSelections(),
            arrayIds = [],
            store = this.pClienteProveedor.stClienteProveedor;
        for (k in records) {
            if (records[k].data && records[k].data.enuso == 0) {
                arrayIds.push(records[k].data.idclientesproveedores);
            }
        }

        var msgConfirm = arrayIds.length == 1 ? this.etiquetas.msgConfirmUsarSingle : this.etiquetas.msgConfirmUsarPlural,
            msgwait = arrayIds.length == 1 ? this.etiquetas.msgWaitUsarSingle : this.etiquetas.msgWaitUsarPlural,
            msgok = arrayIds.length == 1 ? this.etiquetas.msgUsarOkSingle : this.etiquetas.msgUsarOkPlural;

        _this.onloadMessageBox(this.etiquetas.lbEsperando, msgwait);

        Ext.Ajax.request({
            url: 'usarEntidad',
            method: 'POST',
            params: {
                arrayId: Ext.encode(arrayIds)
            },
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                _this.keyMap.enable();
                var responseData = Ext.decode(response.responseText);
                if (responseData.code == -1) {
                    mostrarMensaje(1, msgok);
                }
                store.load();
            }
        });

        // mostrarMensaje(2, msgConfirm, function (btn) {
        //     if (btn == 'ok') {
        //         _this.onloadMessageBox(this.etiquetas.lbEsperando, msgwait);
        //
        //         Ext.Ajax.request({
        //             url: 'usarEntidad',
        //             method: 'POST',
        //             params: {
        //                 arrayId: Ext.encode(arrayIds)
        //             },
        //             callback: function (options, success, response) {
        //                 var responseData = Ext.decode(response.responseText);
        //                 if (responseData.code == -1) {
        //                     mostrarMensaje(1, msgok);
        //                 }
        //                 Ext.MessageBox.hide();
        //                 _this.keyMap.enable();
        //                 store.load();
        //             }
        //         });
        //     } else {
        //         _this.keyMap.enable();
        //     }
        // });

    },
    noUsarEntidad: function () {
        var records = this.pClienteProveedor.smClienteProveedor.getSelections(),
            arrayIds = [],
            _this = this
        store = this.pClienteProveedor.stClienteProveedor;

        for (k in records) {
            if (records[k].data && records[k].data.enuso == 1) {
                arrayIds.push(records[k].data.idclientesproveedores);
            }
        }

        var msgConfirm = arrayIds.length == 1 ? this.etiquetas.msgConfirmNoUsarSingle : this.etiquetas.msgConfirmNoUsarPlural,
            msgwait = arrayIds.length == 1 ? this.etiquetas.msgWaitNoUsarSingle : this.etiquetas.msgWaitNoUsarPlural,
            msgok = arrayIds.length == 1 ? this.etiquetas.msgNoUsarOkSingle : this.etiquetas.msgNoUsarOkPlural;

        mostrarMensaje(2, msgConfirm, function (btn) {
            if (btn == 'ok') {
                _this.onloadMessageBox(this.etiquetas.lbEsperando, msgwait);

                Ext.Ajax.request({
                    url: 'noUsarEntidad',
                    method: 'POST',
                    params: {
                        arrayId: Ext.encode(arrayIds)
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.code == -1) {
                            mostrarMensaje(1, msgok);
                        }
                        Ext.MessageBox.hide();
                        _this.keyMap.enable();
                        store.load();
                    }
                });
            } else {
                _this.keyMap.enable();
            }
        });
    },
    configurarEspacioTrabajo: function () {
        var store = this.pClienteProveedor.store,
            espaciotrabajo = store.reader.jsonData.espaciotrabajo,
            selectionmodel=this.pClienteProveedor.sm;
        this.winEspacionTrabajo = new Ext.DatMaest.ClientProveed.EspacioTrabajo({
            etiquetas: this.etiquetas,
            espaciotrabajo: espaciotrabajo,
            espaciostrabajoauxiliares: selectionmodel.getCount()>0?selectionmodel.getSelected().get('idespaciotrabajo'):null,
            idclienteproveedorentidad: selectionmodel.getCount()>0?selectionmodel.getSelected().get('idclienteproveedorentidad'):null,
            gridPrincipal:this.pClienteProveedor,
            listeners: {
                espaciotrabajoconfigurado: function () {
                    store.load();
                }
            }
        });
        this.winEspacionTrabajo.show();
    },
    configurarCorreo: function(){
        console.log('configurarCorreo')
        this.windowConfig = new Ext.DatMaest.ClientProveed.WindowConfig({
            etiquetas: this.etiquetas,
            gridPrincipal:this.pClienteProveedor,
        });
        this.windowConfig.show();
    },
    habilitar: function(guardar, habilitar){
        var _this=this;
        this.winWindowHabilitar = new Ext.DatMaest.ClientProveed.WindowHabilitar({
            etiquetas: this.etiquetas,
            gridclienteproveedor: this.pClienteProveedor,
            principal: _this,
            guardar: guardar,
            habilitar: habilitar,
            listeners:{
                show: function(){
                    if(!guardar){
                        _this.winWindowHabilitar.taArgumento.setValue(
                            _this.pClienteProveedor.smClienteProveedor.getSelections()[0].data.argumento);
                        _this.winWindowHabilitar.tfHabilitadoPor.setValue(
                            _this.pClienteProveedor.smClienteProveedor.getSelections()[0].data.argumentousuario);
                        _this.winWindowHabilitar.tfEstado.setValue(
                            _this.pClienteProveedor.smClienteProveedor.getSelections()[0].data.habilitado==1?
                                _this.etiquetas.lbHabilitado:_this.etiquetas.lbDeshabilitado
                        );
                    }
                }
            }
        });
        this.winWindowHabilitar.show();

        //     records = this.pClienteProveedor.smClienteProveedor.getSelections();
        // _this.onloadMessageBox(this.etiquetas.lbEsperando, 'Habilitando cliente/proveedor');
        // Ext.Ajax.request({
        //     url: 'habilitarClienteProveedor',
        //     method: 'POST',
        //     params: {
        //         idclienteproveedor: records[0].data.idclientesproveedores
        //     },
        //     callback: function (options, success, response) {
        //         var responseData = Ext.decode(response.responseText);
        //         if (responseData.code == -1) {
        //             mostrarMensaje(1, _this.etiquetas.msgHabilitadoClienteProveedor);
        //         }
        //         Ext.MessageBox.hide();
        //         _this.keyMap.enable();
        //         store.load();
        //     }
        // });
    },
    verDeudas: function(){
        var _this=this, records = this.pClienteProveedor.smClienteProveedor.getSelections();
        this.windowDeudas=new Ext.DatMaest.ClientProveed.WindowDeudas({
            idclienteproveedor: records[0].data.idclientesproveedores,
            etiquetas: _this.etiquetas
        });
        this.windowDeudas.show();
    },
    modificarTituloCant: function(tab, titulo, cant) {
        tab.setTitle(titulo);
        if(cant>0)
            tab.setTitle(titulo+' ('+cant+')');
    }
});
new Ext.DatMaest.ClientProveed.ClienteProveedor();

Ext.grid.CheckColumn = function (config) {
    Ext.apply(this, config);
    if (!this.id) {
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype = {
    init: function (grid) {
        this.grid = grid;
        this.grid.on('render', function () {
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },
    onMouseDown: function (e, t) {
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
            this.grid.getSelectionModel().selectRow(index);
            return record;
        }
    },
    renderer: function (v, p, record) {
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
    }
};

Ext.apply(Ext.form.VTypes, {
    daterange: function (val, field) {
        var date = field.parseDate(val);

        if (!date) {
            return;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        return true;
    }
});
