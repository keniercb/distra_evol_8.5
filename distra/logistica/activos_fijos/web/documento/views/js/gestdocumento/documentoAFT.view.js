/**
 * Created by yoendy on 10/27/2015.
 */
Ext.ns('LOG.aft.documento');
LOG.aft.documento.View = Ext.extend(LOG.util.UITemplate, {
    tipo_area_seleccionada: 'entidad',
    movimientoWindow: false,
    constructor: function(config) {
        var _this = this;
        config.urlBusquedaGridPrincipal = 'cargardocumentos';
        config.dirController = config.dirController || '/logistica/activos_fijos/documento/index.php/gestdocumento';
        config.arregloUsuarios = Array();
        config.arregloOperaciones = Array();
        config.arregloDocumentosAFT = Array();
        config.winAvanzada = false;
        config.autoLoad = false;
        config.vantanaTras = null;
        config.modoSeleccion = 1;

        _this.idNodoSeleccionado = null;
        _this.denomNodoSeleccionado = null;
        _this.caminoNodoSeleccionado = null;
        _this.idPadreNodoSeleccionado = null;
        _this.denomPadreNodoSeleccionado = null;
        _this.tipo = (config.tipo == 1) ? config.tipo : 0;
        _this.concepto = config.idioma.concepto;
        _this.idarearesp = Array();

        Ext.MessageBox.wait(config.idioma.lbConfIncial, config.idioma.lbEspere || '...');

        LOG.util.UIManager.apply(config.idioma, LOG.lb.documento.Idioma);
        /*config.model = new LOG.inv.ajuste.Model({
         idioma: config.idioma
         });
         this.modelo = new LOG.inv.ajuste.Model({
         idioma: config.idioma
         });
         this.concepto = config.idioma.concepto;
         this.listaAjustes = new Array();
         this.cargarAjustes();*/
        config.doActionEstructura = function() {
            _this.cargarDatosNecesarios(
                    {
                        fn: function() {

                            /*_this.winAvanzada.idarearesp = _this.idPadreNodoSeleccionado;
                             if (_this.idPadreNodoSeleccionado == _this.idNodoSeleccionado) {
                             _this.winAvanzada.storeTipoDoc.baseParams.areaseleccionada = 'entidad';
                             } else {
                             _this.winAvanzada.storeTipoDoc.baseParams.areaseleccionada = 'arearesp';
                             }
                             
                             _this.winAvanzada.comboTipoDoc.store.load();
                             _this.winAvanzada.comboAutor.store.load();*/
                        }
                    }
            );
        };
        LOG.aft.documento.View.superclass.constructor.call(this, config);
        this.model = new LOG.aft.documento.Model({
            idioma: config.idioma,
            scope: _this
        });
        _this.model.cargarEntidadComboArea({
            fnEntidad: _this.cargarDatosNecesarios
        });
    },
    initDefaultColumns: function() {
        var _this = this;
        function renderGetuser(value) {
                if (value != null && value != "") {
                    for (var i = 0; i < _this.arregloUsuarios.length; i++) {
                        if (_this.arregloUsuarios[i].idusuario == value) {
                            return _this.arregloUsuarios[i].nombreusuario;
                        }
                    }
                    if (perfil)
                        return perfil.usuario;
                }
        }
        /*function renderGetuserAprobado(value) {
            if (value != "") {
                for (var i = 0; i < _this.arregloUsuarios.length; i++) {
                    if (_this.arregloUsuarios[i].idusuario == value) {
                        return _this.arregloUsuarios[i].nombreusuario;
                    }
                }
                if (perfil)
                    return perfil.usuario;
            }
        }*/
        this.addGridColumn({
            header: '',
            width: 45,
            hideable: false,
            dataIndex: 'idoperacion',
            align: 'center',
            renderer: function(value, metaData) {
                var i = 0;
                while (i < _this.arregloOperaciones.length) {
                    if (_this.arregloOperaciones[i].idoperacion == value) {
                        metaData.css = _this.arregloOperaciones[i].icono;
                        return;
                    }
                    i += 1;
                }
            },
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.hdNroDoc,
            width: 90,
            align: 'right',
            dataIndex: 'nrodoc',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.hdNroRef,
            width: 90,
            align: 'right',
            dataIndex: 'numeroref',
            default: true
        });

        this.addGridColumn({
            header: "Observaciones",
            dataIndex: 'observaciones',
            width: 90,
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.hdTipoDoc,
            width: 120,
            dataIndex: 'iddoc',
            renderer: function(value) {
                var i = 0;
                while (i < _this.arregloDocumentosAFT.length) {
                    if (_this.arregloDocumentosAFT[i].iddoc == value) {
                        return _this.arregloDocumentosAFT[i].denominacion;
                    }
                    i += 1;
                }
            },
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.hdOperacion,
            width: 120,
            dataIndex: 'idoperacion',
            autoExpand: false,
            renderer: function(value) {
                var i = 0;
                while (i < _this.arregloOperaciones.length) {
                    if (_this.arregloOperaciones[i].idoperacion == value) {
                        return _this.arregloOperaciones[i].denominacion;
                    }
                    i += 1;
                }
            },
            default: true
        });
        /* this.addGridColumn({
         header: _this.idioma.lbEntidad,
         width: 120,
         align: 'left',
         dataIndex: 'estructura',
         default: true
         });*/
        this.addGridColumn({
            header: _this.idioma.lbCmAreaResp,
            width: 150,
            align: 'left',
            dataIndex: 'arearesp',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.hdYear,
            width: 60,
            align: 'center',
            dataIndex: 'anno',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.hdFecha,
            width: 75,
            align: 'center',
            dataIndex: 'fechacontable',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.hdEstado,
            width: 60,
            dataIndex: 'estado',
            renderer: function(v) {
                return LOG.lb.documento.Estado[v];
            },
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.hdMedios,
            width: 85,
            align: 'right',
            dataIndex: 'cant_medios',
            default: true
        });
        this.addGridColumn({
            header: 'Importe',
            width: 85,
            align: 'right',
            dataIndex: 'importe',
            default: true,
            renderer: function(v) {
                var num = parseFloat(v);
                return num.toFixed(2);
            }
        });

        this.addGridColumn({
            header: _this.idioma.hdCreador,
            width: 110,
            // dataIndex: 'idusuario',
            dataIndex: 'usuariocreador',
//            renderer: renderGetuser,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.hdAprobador,
            width: 110,
            // dataIndex: 'aprobadopor',
            dataIndex: 'usuarioaprobador',
           // renderer: renderGetuser,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'numerocomprobante',
            default: false
        });
        this.addGridColumn({
            header: _this.idioma.hdDestino,
            width: 110,
            dataIndex: 'destino',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'iddocumento',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'icondoc',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'tipodoc',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'operacion',
            default: false
        });

        this.addGridColumn({
            dataIndex: 'idcentrocosto',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idestructuradocgenerado',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idcentrocostodocgenerado',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'denomestructuradocgenerado',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'tipo_interfaz',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'entidad',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'direccion',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'iddestinofinal',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'informetecnico',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'iddestinofinalBajadesarme',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'informetecnicoBajadesarme',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'entidadBajadesarme',
            default: false
        });
        /*this.addGridColumn({
         dataIndex: 'entidadAlquiler',
         default: false
         });
         this.addGridColumn({
         dataIndex: 'direccionAlquiler',
         default: false
         });*/
        this.addGridColumn({
            dataIndex: 'fechainicio',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'fechafin',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'nrocontrato',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'codigooperacion',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idnaturalezasInventario',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idpersonasIventarioParcial',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'mediosInventario',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'naturalezasInventario',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'personasInventario',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idmediosInventario',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'mensualInventario',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'iddocinventario',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idareasInventario',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idespecialidadesInventario',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'areasInventario',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'especialidadesInventario',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idcliente',
            default: false
        });

        this.addGridColumn({
            dataIndex: 'idclientesproveedores',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idpersona',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idclientesproveedoresprestamo',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'denompersonaprestamo',
            default: false
        });

        this.addGridColumn({
            dataIndex: 'idestructuracomun',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'estructuracomun',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idarearesp',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'arearesp',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idestructura',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'estructura',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'clave',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'fecha',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'numero',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idnodo',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'controlfirma',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idclientesproveedoresenvrep',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'identidaddestinoenvrep',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'denomestructuradocenvrep',
            default: false
        });



        this.addGridColumn({
            dataIndex: 'idclientealquiler',
            default: false
        });

        this.addGridColumn({
            dataIndex: 'nrocontratoalquiler',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'fechainicioalquiler',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'fechafinalquiler',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'direccionalquiler',
            default: false
        });



        this.addGridColumn({
            dataIndex: 'idclientealusuf',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'nrocontratousuf',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'fechainiciousuf',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'fechafinusuf',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'direccionusuf',
            default: false
        });

        this.addGridColumn({
            dataIndex: 'idclientearr',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'nrocontratoarr',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'fechainicioarr',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'fechafinarr',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'direccionarr',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'nrofactura',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idclientesproveedoresbajaventa',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idcondicionpago',
            default: false
        });

        this.addGridColumn({
            dataIndex: 'idareadestino',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idresponsabledestino',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idcentrocostodestino',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'nombreresponsabledestino',
            default: false
        });

        this.addGridColumn({
            dataIndex: 'firmado',
            default: false
        });

        this.addGridColumn({
            dataIndex: 'idcomprobante',
            default: false
        });



        /* 
         this.addGridColumn({
         dataIndex: 'idclientearr',
         default: false
         });
         this.addGridColumn({
         dataIndex: 'nrocontratoarr',
         default: false
         });
         this.addGridColumn({
         dataIndex: 'fechainicioarr',
         default: false
         });     
         this.addGridColumn({
         dataIndex: 'fechafinarr',
         default: false
         });        
         this.addGridColumn({
         dataIndex: 'direccionarr',
         default: false
         });
         */

    },
    initDefaultButtons: function() {
        var _this = this;

        this.adicionarBtn = new LOG.util.Prototipos.botonAdicionar({
            tooltip: _this.idioma.lbTtBtnAdicionar,
            handler: function() {
                if (procesorevaluacion == 'true') {
                    mostrarMensaje(3, _this.idioma.msgProcesoRevaluacion);
                } else
                    _this.model.cargarEncabezado();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('idAdicionarBtn')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.adicionarBtn);

        this.btnTraslados = LOG.util.UIManager.createBtn({
            iconCls: 'recepcion',
            disabled: false,
            text: _this.idioma.lbBtnTraslados,
            tooltip: _this.idioma.lbTtBtnTraslados,
            key: {
                alt: true,
                ctrl: true,
                shift: false,
                key: 'T'
            },
            handler: function() {

                if (procesorevaluacion == 'true') {
                    mostrarMensaje(3, _this.idioma.msgProcesoRevaluacion);
                } else {
                    Ext.MessageBox.wait(_this.idioma.lbConfIncial, _this.idioma.lbEspere || '...');
                    _this.model.cargarDatComboDeposito(function(datConf) {
                        for (var i = 0; i < datConf[0].datos.length; i++) {
                            _this.idarearesp.push(datConf[0].datos[i].iddeposito);
                        }

                        var WinCont = new LOG.aft.documento.winRecepciones({
                            idioma: _this.idioma,
                            nodoPadre: {
                                attributes: {
                                    text: _this.denomPadreNodoSeleccionado,
                                    id: _this.idPadreNodoSeleccionado
                                }
                            },
                            idarearesp: _this.idarearesp, //_this.idNodoSeleccionado,
                            arearesp: _this.caminoNodoSeleccionado,
                            idestructuraEntidad: _this.idPadreNodoSeleccionado,
                            storeDocumento: _this.storePrincipal,
                            fn: function(parametros) {
                                _this.mostrarWinAdicionarDoc(parametros);
                            }
                        });
                        WinCont.fireEvent = WinCont.fireEvent.createSequence(function(e) {
                            if (e == 'show') {
                                Ext.MessageBox.hide();
                            }
                        });
                        _this.vantanaTras = WinCont;
                        WinCont.show();
                        WinCont.doLayout();
                    });
                }

            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('idRecepcionBtn')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.btnTraslados);

        this.modificarBtn = new LOG.util.Prototipos.botonModificar({
            tooltip: _this.idioma.lbTtBtnModificar,
            disabled: true,
            handler: function() {
                if (procesorevaluacion == 'true') {
                    mostrarMensaje(3, _this.idioma.msgProcesoRevaluacion);
                } else
                    _this.model.cargarEncabezado('modificar', _this.getSmPrincipal().getSelected());
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('idModificarBtn')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.modificarBtn);

        this.eliminarBtn = new LOG.util.Prototipos.botonEliminar({
            tooltip: _this.idioma.lbTtBtnEliminar,
            disabled: true,
            handler: function() {
                var record = _this.gpPrincipal.getSelectionModel().getSelected();
                if ((record.get('codigooperacion') == "OPER_AJUSTE_SOBRANTE") || (record.get('codigooperacion') == "OPER_AJUSTE_FALTANTE")) {
                    _this.model.getExisteDocAjustesInventario(record.get('iddocumento'));
                } else {
                    _this.model.eliminarDocumento();
                }

            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('idEliminarBtn')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.eliminarBtn);

        this.movimientoBtn = LOG.util.UIManager.createBtn({
            iconCls: 'activosfijos',
            disabled: true,
            text: _this.idioma.lbBtnMovimiento,
            tooltip: _this.idioma.lbTtBtnMovimiento,
            /* key: {
             alt: true,
             ctrl: true,
             shift: false,
             key: 'A'
             },*/
            handler: function() {              
                _this.mostrarWinMovimiento();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('idMovimientoBtn')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.movimientoBtn);

        this.confirmarBtn = new LOG.util.Prototipos.botonConfirmar({
            tooltip: _this.idioma.lbTtBtnConfirmar,
            disabled: true,
            key: {
                ctrl: true,
                alt: true,
                shift: false,
                key: 'F'
            },
            handler: function() {
                var record = _this.gpPrincipal.getSelectionModel().getSelected();               
                var params = {
                    iddocumento: record.get('iddocumento'),
                    signo: (record.get('tipo_interfaz') == "entrada") ? "+" : "-"
                };
                _this.model.confirmarDoc(params);
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('idConfirmarBtn')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.confirmarBtn);

        this.aprobarBtn = new LOG.util.Prototipos.botonAprobar({
            tooltip: _this.idioma.lbTtBtnAprobar,
            key: {
                key: "Q",
                shift: false,
                alt: true,
                ctrl: false
            },
            disabled: true,
            handler: function() {
                var record = _this.gpPrincipal.getSelectionModel().getSelected();
                var operacion = '';

                for (var i = 0; i < _this.arregloOperaciones.length; i++) {
                    if (_this.arregloOperaciones[i].idoperacion == record.get('idoperacion')) {
                        operacion = _this.arregloOperaciones[i].denominacion;
                    }
                }

                var params = {
                    iddocumento: record.get('iddocumento'),
                    idoperacion: record.get('idoperacion') ? record.get('idoperacion') : -1,
                    observacion: operacion + ' #' + record.get('nrodoc') + ' - ' + _this.denomNodoSeleccionado,
                    idarea: _this.idNodoSeleccionado,
                    identidadpadre: _this.idPadreNodoSeleccionado
                };
                if (record.get('codigooperacion') == "OPER_INV_TOTAL" || record.get('codigooperacion') == "OPER_INV_PAR_MENSUAL" ||
                        record.get('codigooperacion') == "OPER_INV_PARCIAL") {
                    params.inventario = 2;
                }

                if (record.get('codigooperacion') == "OPER_INV_PARCIAL" || record.get('codigooperacion') == "OPER_INV_PAR_MENSUAL") {
                    params.parcial = 2;
                }

                _this.model.aprobarDoc(params);
            },
            controlFn: function(b, _caller) {

                if (_caller.grantedAction('idAprobarBtn') && (!cargaInicial || !integradoCont)) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }
            }
        });
        _this.addToolbarButton(_this.aprobarBtn);

        this.cancelEstatusBtn = new LOG.util.Prototipos.botonAnularEstado({
            text: _this.idioma.lbCancelarEstatusBtn,
            tooltip: _this.idioma.lbTtBtnAnularEstatus,
            disabled: true,
            handler: function() {
                var record = _this.gpPrincipal.getSelectionModel().getSelected();
                var params = {
                    iddocumento: record.get('iddocumento')

                };
                if ((record.get('codigooperacion') == "OPER_INV_TOTAL"
                        || record.get('codigooperacion') == "OPER_INV_PAR_MENSUAL")
                        && (_this.gpPrincipal.getSelectionModel().getSelected().get('estado') == '2')) {
                    params.inventario = 2;
                }
                _this.model.cancelarEstadoDoc(params);
            },
            controlFn: function(b, _caller) {

                if (_caller.grantedAction('idCancelEstatusBtn')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.cancelEstatusBtn);

        this.desaprobarBtn = LOG.util.UIManager.createBtn({
            iconCls: 'cancelar',
            text: 'Desaprobar',
            tooltip: 'Desaprobar documento',
            iconCls: 'activosfijos',
            disabled: true,
            handler: function() {
                var record = _this.gpPrincipal.getSelectionModel().getSelected();
                var params = {
                    iddocumento: record.get('iddocumento')
                };
                _this.model.desaprobarDoc(params);
            },
            controlFn: function(b, _caller) {

                if (_caller.grantedAction('idDesaprobarBtn')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        _this.addToolbarButton(_this.desaprobarBtn);

        this.printModeloBtn = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.lbImprimirModelBtn,
            iconCls: 'imprimir',
            isList: false,
            disabled: true,
            handler: function() {

                var operacion;
                var nodoPadre = {
                    attributes: {
                        text: _this.denomPadreNodoSeleccionado,
                        id: _this.idPadreNodoSeleccionado
                    }
                };

                for (var i = 0; i < _this.arregloOperaciones.length; i++) {
                    if (_this.arregloOperaciones[i].idoperacion == _this.gpPrincipal.getSelectionModel().getSelected().get('idoperacion')) {
                        operacion = _this.arregloOperaciones[i].denominacion;
                        break;
                    }
                }

                var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                var aprobadopor = record.get('aprobadopor');
                var idoperacion = record.get('idoperacion');
                var iddocumento = record.get('iddocumento');

                /*  var report = new LOG.util.Report({
                 sm: _this.getGridPrincipal().getSelectionModel(),
                 useFirma: (usarPki && typeof pki == 'object'),
                 idioma: _this.idioma,
                 modelo: _this.modelo,
                 st: _this.storePrincipal,
                 reports: [
                 {
                 name: 'Vista principal',
                 typeView: 1,
                 record: record,
                 status: LOG.lb.documento.Estado,
                 limit: 3,
                 isList: false, //btn.isList,
                 params: {
                 hasFirma: true, //(usarPki && typeof pki == 'object') ? 'true' : 'false',
                 iddocumento: iddocumento,
                 iddoc: record.get("iddoc"),
                 idnodo: record.get("idnodo"),
                 iddir: (idespaciotrabajo && idespaciotrabajo != undefined) ? idespaciotrabajo : null,
                 aprobadopor: (aprobadopor) ? LOG.aft.documento.utf8_encode(aprobadopor) : '',
                 operacion: (operacion) ? LOG.aft.documento.utf8_encode(operacion) : '',
                 idestructura: nodoPadre.attributes.id,
                 entidad_direccion: (_this.entidadSeleccionada.entidadDireccion) ? LOG.aft.documento.utf8_encode(_this.entidadSeleccionada.entidadDireccion) : '',
                 codigo_entidad: _this.entidadSeleccionada.entidadCodigo
                 
                 },
                 dirReport: '/distra/logistica/activofijo/documento/MovimientoActivoFijoTangible',
                 detailFirma: {}
                 }
                 ]
                 });
                 report.view();*/
                _this.winTiposReportes = new LOG.aft.documento.VentanaTipoReporte({
                    etiquetas: _this.idioma,
                    idoperacion: _this.gpPrincipal.getSelectionModel().getSelected().get('idoperacion'),
                    iddocumento: _this.gpPrincipal.getSelectionModel().getSelected().get('iddocumento'),
                    aprobadopor: _this.gpPrincipal.getSelectionModel().getSelected().get('aprobadopor'),
                    entidad: nodoPadre.attributes.text,
                    identidad: nodoPadre.attributes.id,
                    scope: _this,
                    entidadSeleccionada: _this.entidadSeleccionada,
                    operacion: operacion
                });
                _this.winTiposReportes.show();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('idPrintModeloBtn')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }
                _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    var seleccion = _this.getGridPrincipal().getSelectionModel().getSelected();
                    if (e == "selectionchange") {
                        if (seleccion && (seleccion.data.estado == '1' || seleccion.data.estado == '5')) {
                            b.disable();

                        } else {
                            b.enable();
                        }
                    }
                });

            }
        });

        this.printListadoBtn = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.lbImprimirListaBtn,
            isList: false,
            iconCls: 'imprimir',
            handler: function() {
                _this.Listado();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('idPrintListadoBtn')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        });

        this.printBtn = LOG.util.UIManager.createBtn({
            text: _this.idioma.lbImprimirBtn,
            tooltip: _this.idioma.lbTtImprimirListaBtn,
            iconCls: 'imprimir',
            disabled: true,
            menu: [_this.printModeloBtn, _this.printListadoBtn],
            controlFn: function(b, _caller) {
                _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    var seleccion = _this.getGridPrincipal().getSelectionModel().getSelected();
                    if (e == "selectionchange") {
                        if (seleccion) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        });

        _this.addToolbarButton(_this.printBtn);

        this.exportarConsoBtn = LOG.util.UIManager.createBtn({
                text: 'Exportar CONSO',
                tooltip: 'Exportar CONSO',
                iconCls: 'exportar',
                disabled: false,
                handler: function (){     
                   _this.onExportar();
                }, 
               
            });

            _this.addToolbarButton(this.exportarConsoBtn);
       
        
            this.fechaInicioconso = new Ext.form.DateField({
                width: 100,
                fieldLabel:'Fecha inicio',
                vtype: 'daterange',
                name: 'fechainicio', 
                id: 'fechainicio',
                endDateField: 'fechafin',
                editable: false,
                maxValue: new Date()
            });

            this.fechaFinConso = new Ext.form.DateField({
                width: 100,
                fieldLabel:'Fecha fin',
                editable: false,
                vtype: 'daterange',
                startDateField: 'fechainicio',
                name: 'fechafin',
                id: 'fechafin',
                maxValue: new Date(),
               
            });

        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: 'iddocumentoaft'
        }));
    },
    render: function(config) {
        Ext.apply(this, config);
        var vista = LOG.aft.documento.View.superclass.render.call(this);
        var _this = this;
        _this.operacionesBuscar = new LOG.aft.documento.cmbBuscarOperaciones(_this);
        _this.cmbBuscarEstado = new LOG.aft.documento.cmbBuscarEstado(_this);

        _this.getStorePrincipal().on({
            'beforeload': function(st) {
                st.initBaseParams.idestructuracomun = _this.idNodoSeleccionado;
                st.initBaseParams.idoperacion = (_this.operacionesBuscar.getValue()) ? _this.operacionesBuscar.getValue() : Ext.util.JSON.encode(_this.arregloIDSOperaciones);
                // if (_this.arregloIDSOperaciones.length)
                //  st.initBaseParams.idoperacion = Ext.util.JSON.encode(_this.arregloIDSOperaciones);
                //  Id de la estructura padre del area de responsabilidad
                st.initBaseParams.idestructurapadre = _this.idPadreNodoSeleccionado;
                st.initBaseParams.ejecutar_validacion_centrocosto = (_this.tipo_area_seleccionada == 'arearesp') ? 1 : 0;
                st.initBaseParams.limit = _this.gpPrincipal.getBottomToolbar().pageSize;
                Ext.MessageBox.hide();
            },
            'load': function(st) {
                if (st.getCount() == 0) {
                    mostrarMensaje(1, _this.idioma.msgNoExistDatos);
                }

                var i = 0;
                while (i < _this.arregloOperaciones.length) {
                    var j = 0;
                    while (j < st.getCount()) {
                        if (_this.arregloOperaciones[i].idoperacion == st.getAt(j).get('idoperacion')) {
                            st.getAt(j).data.codigooperacion = _this.arregloOperaciones[i].codigo_operacion;
                            st.getAt(j).data.operacion = _this.arregloOperaciones[i].denominacion;
                            st.getAt(j).data.tipo_interfaz = _this.arregloOperaciones[i].tipo_interfaz;
                        }
                        j += 1;
                    }
                    i += 1;
                }

                //_this.HabDesBotones();

                Ext.getBody().unmask();
            }
        });
        _this.getSmPrincipal().on({
            'rowselect': function(sm, rowIndex, record) {
                _this.HabDesBotones();
            },
            'rowdeselect': function(sm, rowIndex, record) {
                _this.HabDesBotones();
            }
        });
        _this.gridFilter.btnLimpiar.handler = function() {
            var scope = _this.gridFilter;
            if (scope.btnLimpiar.disabled) {
                return;
            }
            scope.tfBusqueda.setValue('');
            _this.cmbBuscarEstado.reset();
            _this.cmbBuscarOperaciones.reset();
            scope.store.initBaseParams.idoperacion = "";
            scope.store.initBaseParams.idestado = "";
            scope.tfBusqueda.blur();
            var params = {};
            Ext.apply(params, scope.store.limitParams);
            params.criterio = '';
            scope.store.filtrado = false;
            scope.store.reload({
                params: params
            });
        };
        _this.gridFilter.btnFiltar.handler = function() {
            var scope = _this.gridFilter;
            if (scope.btnFiltar.disabled) {
                return;
            }
            if (_this.operacionesBuscar.isDirty() || _this.cmbBuscarEstado.isDirty()) {
                if (_this.operacionesBuscar.isValid() && _this.cmbBuscarEstado.isValid()) {
                    var params = {};
                    scope.store.initBaseParams.filtrado = true;
                    if (_this.operacionesBuscar.getValue()) {
                        scope.store.initBaseParams.idoperacion = _this.operacionesBuscar.getValue();
                    }
                    if (_this.cmbBuscarEstado.getValue()) {
                        scope.store.initBaseParams.idestado = _this.cmbBuscarEstado.getValue();
                    }

                    Ext.apply(params, scope.store.initBaseParams);
                    Ext.apply(params, scope.store.limitParams);

                    scope.store.load({
                        params: params
                    });
                }
            }

        };

        _this.gridFilter.tfBusqueda.setVisible(false);
        _this.getGridPrincipal().getTopToolbar().insert(2, '-', {xtype: 'tbtext', text: _this.idioma.hdOperacion + ':'}, _this.operacionesBuscar/*LOG.aft.documento.cmbBuscarOperaciones(_this)*/, '-', {xtype: 'tbtext', text: _this.idioma.hdEstado + ':'}, _this.cmbBuscarEstado);

        return vista;
    },
    Listado: function() {
        var _this = this;

        Ext.Ajax.request({
            url: 'iddocsPorSubsistemaEntidad',
            method: 'POST',
            params: {
                idestructuraop: _this.idNodoSeleccionado
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                var params = {
                    idestructura: _this.idNodoSeleccionado,
                    idDocs: "{" + rd.datos + "}",
                    entidad:  _this.denomNodoSeleccionado
                };

                if( _this.operacionesBuscar.getValue()){
                    params.idoperacion = _this.operacionesBuscar.getValue();
                };
                if( _this.cmbBuscarEstado.getValue()){
                    params.idestado = _this.cmbBuscarEstado.getValue();
                };
                if(_this.storePrincipal.baseParams.aprobadopor)
                    params.aprobadopor = _this.storePrincipal.baseParams.aprobadopor;

                if(_this.storePrincipal.baseParams.desde)
                    params.desde = _this.storePrincipal.baseParams.desde.format('d/m/Y');

                if(_this.storePrincipal.baseParams.idusuario)
                    params.idusuario = _this.storePrincipal.baseParams.idusuario;

                if(_this.storePrincipal.baseParams.nrodoc)
                    params.nrodoc = _this.storePrincipal.baseParams.nrodoc;

                if(_this.storePrincipal.baseParams.iddoc)
                    params.tipodoc = _this.storePrincipal.baseParams.iddoc;

                if(_this.storePrincipal.baseParams.hasta)
                    params.hasta = _this.storePrincipal.baseParams.hasta.format('d/m/Y');


                 if(_this.storePrincipal.baseParams.idarearesp)
                              params.idarearesp = _this.storePrincipal.baseParams.idarearesp;
                var report = new LOG.util.Report({
                    reports: [
                        {
                            name: 'Vista principal',
                            params: params,
                            dirReport: '/distra/logistica/activofijo/documento/ReporteListadoImprimir',
                            detailFirma: {}
                        }
                    ]
                }).view();

            }
        });

    },
    cargarDatosNecesarios: function(params) {
        var _this = this;
        _this.arregloOperaciones = Array();
        _this.arregloIDSOperaciones = Array();
        _this.arregloDocumentosAFT = Array();
        Ext.Ajax.request({
            method: 'POST',
            url: 'cargarnecesario',
            params: {
                idestructura: _this.idPadreNodoSeleccionado,
                idfuncionalidad: _this.idfuncionalidad,
                usuarios: (_this.arregloUsuarios.length == 0) ? 'cargausuarios' : 'nocargausuarios'
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);

                _this.idNodoSeleccionado = rd.identidad;
                _this.denomNodoSeleccionado = rd.entidad;
                _this.idPadreNodoSeleccionado = rd.identidad;
                _this.denomPadreNodoSeleccionado = rd.entidad;

                _this.entidadSeleccionada = {
                    entidadCodigo: rd.entidadCodigo,
                    entidadDireccion: rd.entidadDireccion
                };

                if (rd.documentos && rd.documentos.length > 0) {
                    _this.arregloDocumentosAFT = rd.documentos;
                }
                if (rd.operaciones.length > 0) {
                    var records = Array();
                    var i = 0;
                    while (i < rd.operaciones.length) {

                        var obj = {
                            idoperacion: rd.operaciones[i].idoperacion,
                            denominacion: rd.operaciones[i].denominacion,
                            idconcepto: rd.operaciones[i].idconcepto,
                            operacioncontable: rd.operaciones[i].operacioncontable,
                            idcuenta: rd.operaciones[i].idcuenta,
                            icono: rd.operaciones[i].icono,
                            tipo_interfaz: rd.operaciones[i].tipo,
                            codigo_operacion: rd.operaciones[i].codigo
                        };
                        _this.arregloOperaciones.push(obj);
                        _this.arregloIDSOperaciones.push(rd.operaciones[i].idoperacion);

                        //  Para llenar el combo operaciones general
                        record = new Ext.data.Record({});
                        record.data = {
                            idoperacion: rd.operaciones[i].idoperacion,
                            denominacion: rd.operaciones[i].denominacion,
                            idconcepto: rd.operaciones[i].idconcepto,
                            operacioncontable: rd.operaciones[i].operacioncontable,
                            idcuenta: rd.operaciones[i].idcuenta
                        };
                        records.push(record);

                        i += 1;
                    }
                    _this.stOperaciones.add(records);
                }
                if (rd.usuarios.length > 0) {
                    _this.arregloUsuarios = rd.usuarios;
                }
                _this.storePrincipal.load({
                    baseParams: {
                        start: 0,
                        limit: _this.gpPrincipal.getBottomToolbar().cbPageSize.getValue()
                    }
                });
                if (typeof params !== 'undefined' && typeof params.fn === 'function') {
                    params.fn();
                }
            }
        });
    },
    getStoreOperaciones: function(params) {
        this.stOperaciones = new Ext.data.SimpleStore({
            fields: ['idoperacion', 'denominacion', 'idconcepto', 'operacioncontable', 'idcuenta'],
            data: [],
            autoLoad: false
        });
        return this.stOperaciones;
    },
    /**
     * Funcionalidad para la accion de adicionar
     */
    onBtnAdicionarClick: function(modificar, record, dat_fs, desabilitado, datos_traslado) {
        var _this = this;

        if (!this.ventanaActivos || !this.ventanaActivos.isVisible()) {

            var _this = this;
            /*
             * idoperacion y iddoc son para el caso de un traslado entre entidades
             * y son el tipo y la operacion del tipo de documento que se
             * configuro para relizar una recepcion de traslado entre entidades
             */
            var idoperacion = null;
            var iddoc = null;
            if (datos_traslado != undefined) {
                idoperacion = datos_traslado.idoperacion;
                iddoc = datos_traslado.iddoc;
                _this.operacionSeleccionada = datos_traslado.idoperacion;
            }
            var desabilitar_cmp = (modificar && record.get('estado') != 1) ? true : false;

            this.formFields = new LOG.aft.documento.TabPanelWinGestionar({
                idioma: this.idioma,
                idarea_seleccionada: _this.idNodoSeleccionado,
                datos: record,
                disable_comp: desabilitar_cmp,
                modificar: modificar,
                idoperacion: idoperacion,
                area_seleccinada: _this.tipo_area_seleccionada,
                iddoc: iddoc,
                nodoPadre: {
                    attributes: {
                        text: _this.denomPadreNodoSeleccionado,
                        id: _this.idPadreNodoSeleccionado
                    }
                },
                cmpGeneral: _this,
                iddocrecepcion: (datos_traslado) ? datos_traslado.datos[0].iddocumento : null,
                smGrid: this.gpPrincipal.getSelectionModel().getSelected(),
                idestructuracomun: _this.idPadreNodoSeleccionado,
                datos_traslado: datos_traslado
            });
        }
        if ((!_this.winGestionarDocumento || !_this.winGestionarDocumento.isVisible()) && (!_this.comboDeposito || _this.idNodoSeleccionado != '')) {

            //  Para insertar dentro de un array en una posicion x. Para construir el formulario Gestionar
            Array.prototype.injectArray = function(idx, arr) {
                return this.slice(0, idx).concat(arr).concat(this.slice(idx));
            };

            var fields = [
                _this.getObservacionesAddDoc(modificar, record, dat_fs, desabilitado),
                {
                    xtype: 'hidden',
                    name: 'iddocumento',
                    value: (modificar == 'modificar') ? record.get('iddocumento') : ''
                }
            ];

            if (this.formFields) {
                fields = fields.injectArray(0, this.formFields);
            }

            var tituloADD = _this.idioma.lbTitleWinAddDocumento;
            var tituloMOD = _this.idioma.lbTitleWinModDocumento;

            this.winGestionarDocumento = new LOG.aft.documento.winDocAdd({
                title: (modificar == 'modificar') ? tituloMOD : tituloADD,
                idioma: _this.idioma,
                datos_traslado: datos_traslado,
                modificar: modificar,
                dat_fs: dat_fs,
                fields: fields,
                scope: _this

            });
            _this.winGestionarDocumento.show();

            var heigthfpGestionarDoc = _this.winGestionarDocumento.fpGestionarDoc.getSize();
            var heigthfieldSet = _this.winGestionarDocumento.fieldSet.getSize();
            var totalheigth = (heigthfpGestionarDoc.height + heigthfieldSet.height) + 100;
            if (totalheigth > 500) {
                totalheigth = 500;
            }
            _this.winGestionarDocumento.setHeight(totalheigth);

        }
    },
    getObservacionesAddDoc: function(modificar, record, dat_fs, desabilitado) {
        return {};
    },
    onAceprtarAdicionarDocumento: function(cerrarWin, modificar, datos_traslado) {
        var _this = this;
        if (!_this.winGestionarDocumento.fpGestionarDoc.getForm().isValid()) {
            mostrarMensaje(3, _this.idioma.msgFaltanDatos);
            return;
        } else if (!_this.operacionSeleccionada && !datos_traslado.recepcion == "recepcion") {
            mostrarMensaje(3, _this.idioma.msgFaltanDatos);
            return;
        }
        else if (!_this.formFields.comboAreaResp.getValue() &&
                !(
                    _this.operacionSeleccionada && (_this.operacionSeleccionada == 'OPER_INV_PARCIAL'
                    || _this.operacionSeleccionada == 'OPER_INV_PAR_MENSUAL'
                    || _this.operacionSeleccionada == 'OPER_INV_PARCIAL_UH'
                    || _this.operacionSeleccionada == 'OPER_INV_PAR_MEN_UH'
                ))) {
            mostrarMensaje(2, _this.idioma.areanull);
            return;
        } else {
            if (Ext.aft.panelAlquiler) {
                if (!_this.formFields.cmpGeneral.ValidarCamposDatosEspesificos()) {
                    mostrarMensaje(3, _this.idioma.msgFaltanDatos);
                    return;
                }
            }
        }

        var iddeposito = (LOG.aft.documento.comboAreaRespAdd.getValue()) ? LOG.aft.documento.comboAreaRespAdd.getValue() : null;
        var parametros = {
            iddeposito: iddeposito, //_this.deposito == true ? _this.idNodoSeleccionado : null,
            identidad: _this.idPadreNodoSeleccionado,
            entidadpadre: (_this.cmpAreaRespWin) ? _this.cmpAreaRespWin.dameNodoEntidadPertenece(_this.idNodoSeleccionado).id : LOG.aft.documento.comboAreaRespAdd.getValue(),
        };
        if (_this.operacionSeleccionada == 'OPER_INV_PAR_MENSUAL' || _this.operacionSeleccionada == 'OPER_INV_PAR_MEN_UH')
        {
            parametros.mensual = 1;
        }
     
        if (LOG.aft.documento.camposInventarios && modificar != 'modificar') {
            _this.camposInventarios = (LOG.aft.documento.camposInventarios) ? LOG.aft.documento.camposInventarios : null;
            if (_this.camposInventarios.iddocinventario.getValue() && _this.camposInventarios.numero.getValue()) {
                parametros.iddocinventario = _this.camposInventarios.iddocinventario.getValue();
                // parametros.clave = (_this.camposInventarios.clave.getValue()) ? _this.camposInventarios.clave.getValue() : null;
                parametros.numero = (_this.camposInventarios.numero.getValue()) ? _this.camposInventarios.numero.getValue() : null;
                parametros.fecha = (_this.camposInventarios.fecha.value) ? _this.camposInventarios.fecha.value : null;
                parametros.iddocumentoinv = (_this.camposInventarios.iddocumentoInventario.getValue()) ? _this.camposInventarios.iddocumentoInventario.getValue() : null;
                parametros.idEstructuraOrigenDocSalida = (_this.camposInventarios.idEstructuraOrigenDocSalida.getValue()) ? _this.camposInventarios.idEstructuraOrigenDocSalida.getValue() : null;
            }
            //LOG.aft.documento.camposInventarios = false;

        }
        if (LOG.aft.documento.regNumAReparar.scope != null && LOG.aft.documento.regNumAReparar.scope.smGridPrincipal.selections.items.length > 0) {
            if (_this.operacionSeleccionada == 'OPER_REPGENERAL' || _this.operacionSeleccionada == 'OPER_REPMENOR' || _this.operacionSeleccionada == 'OPER_REPMEDIA'
                    || _this.operacionSeleccionada == 'OPER_REPIMPREV' || _this.operacionSeleccionada == 'OPER_MANTENIMIENTO' || _this.operacionSeleccionada == 'OPER_REMODELACION') {
                var smenvrep = LOG.aft.documento.regNumAReparar.scope.smGridPrincipal.selections;
                var envmantenimiento = new Array();
                for (var i = 0; i < smenvrep.items.length; i++) {
                    envmantenimiento.push(smenvrep.items[i].data);
                }
                parametros.envmantenimiento = Ext.encode(envmantenimiento);
            }
        }
        /*var loadMask = new Ext.LoadMask(_this.winGestionarDocumento.getEl(), {msg: _this.idioma.MaskGuardarDocumento}, {msgCls: 'mask-css'});
         loadMask.show();*/
        if (modificar == 'modificar') {
            Ext.MessageBox.wait('Modificando documento', _this.idioma.msgEspere);
            var parametros = {
                iddeposito: _this.formFields.smGrid.data.idarearesp, //_this.deposito == true ? _this.comboDeposito.getValue() : null,
                idoperacion: _this.formFields.smGrid.data.idoperacion,
                identidad: _this.formFields.smGrid.data.idarearesp,
                modificar: 2
            }
        } else {
            Ext.MessageBox.wait('Adicionando documento', _this.idioma.msgEspere);
        }
        if (datos_traslado) {
            var arrayDatos = new Array();
            for (var i = 0; i < datos_traslado.datos.length; i++) {
                arrayDatos[i] = {
                    idregnumerico: datos_traslado.datos[i].idregnumerico,
                    iddocumentoOld: datos_traslado.datos[i].iddocumento,
                    idproducto: datos_traslado.datos[i].idproducto,
                    idmovimiento: datos_traslado.datos[i].idmovimiento,
                    idmovregnumerico: datos_traslado.datos[i].idmovregnumerico,
                    idestructuracomunOld: datos_traslado.datos[i].idestructuracomun,

                    idprod: datos_traslado.datos[i].idprod
                }
            }
            parametros = {
                iddeposito: iddeposito, //_this.deposito == true ? _this.idNodoSeleccionado : null,
                datosTraslado: Ext.encode(arrayDatos),
                idoperacion: datos_traslado.idoperacion,
                iddoc: datos_traslado.iddoc,
                identidad: _this.idPadreNodoSeleccionado,
                identidadorigen: datos_traslado.datos[0].idestructuraorigen
            }
        }
        if (_this.masivo) {
            parametros.masivo = 1;
        }
        _this.winGestionarDocumento.fpGestionarDoc.getForm().submit({
            timeout: 300000,
            url: 'adicionardocumento',
            method: 'POST',
            params: parametros,
            success: function() {

                Ext.getBody().unmask();
                Ext.MessageBox.hide();
                //loadMask.hide();
                LOG.aft.documento.regNumAReparar.scope = null;
                if (modificar == 'modificar') {
                    mostrarMensaje(1, _this.idioma.msgModificarDocCorrecta);
                } else {
                    mostrarMensaje(1, _this.idioma.msgAdicionCorrecta);
                }

                _this.gpPrincipal.getStore().load({
                    callback: function() {
                        Ext.getBody().unmask();
                        _this.mostrarWinMovimiento();
                    }
                });

                if (cerrarWin == 'close') {
                    //_this.winGestionarDocumento.close();
                    _this.winGestionarDocumento.destroy();
                } else {
                    if (Ext.aft.panelAlquiler) {
                        //  Documento origen
                        var camposInventarios = LOG.aft.documento.camposInventarios;
                        if (camposInventarios) {

                            if (camposInventarios.fecha) {
                                camposInventarios.fecha.reset();
                            }
                            if (camposInventarios.numero) {
                                camposInventarios.numero.reset();
                            }
                            if (camposInventarios.clave) {
                                camposInventarios.clave.reset();
                            }
                        }
                        // _this.formFields.cmpGeneral.limpiarCamposDatosEspesificos();
                        _this.winGestionarDocumento.fpGestionarDoc.getForm().reset();
                    } else {
                        _this.winGestionarDocumento.fpGestionarDoc.getForm().reset();
                        // Documento origen
                        var camposInventarios = LOG.aft.documento.camposInventarios;
                        if (camposInventarios) {
                            if (camposInventarios.fecha) {
                                camposInventarios.fecha.reset();
                            }
                            if (camposInventarios.numero) {
                                camposInventarios.numero.reset();
                            }
                            if (camposInventarios.clave) {
                                camposInventarios.clave.reset();
                            }
                        }
                    }
                }
            },
            failure: function() {
                Ext.getBody().unmask();
                Ext.MessageBox.hide();
                LOG.aft.documento.regNumAReparar.scope = null;
                if (modificar == 'modificar') {
                    mostrarMensaje(3, _this.idioma.msgFaltanDatos);
                }
            }
        });
    },
    ValidarCamposDatosEspesificos: function() {
        var resultado = true;
        var tabSec = (this.formFields.tabSecundario) ? this.formFields.tabSecundario.getItems() : Array();
        if (tabSec.length > 0) {
            for (var i = 0; i < tabSec.length; i++) {
                if (!tabSec[i].getValue()) {
                    resultado = false;
                }
            }
        }
        return resultado;
    },
    onGridDobleClick: function() {
        var _this = this;
        if (_this.gpPrincipal.getSelectionModel().getSelected().get('estado') != 5) {
            _this.mostrarWinMovimiento();
        }
    },
    HabDesBotones: function() {
            this.modificarBtn.disable();
            this.eliminarBtn.disable();
            this.movimientoBtn.disable();
            this.confirmarBtn.disable();
            this.aprobarBtn.disable();
            this.cancelEstatusBtn.disable();

        if (this.gpPrincipal.getSelectionModel().getSelected()) {

            var record = this.gpPrincipal.getSelectionModel().getSelected();

            switch (this.gpPrincipal.getSelectionModel().getSelected().get('estado')) {
                case '1':
                    {
                        this.modificarBtn.enable();
                        this.eliminarBtn.enable();
                        this.movimientoBtn.enable();
                        this.confirmarBtn.enable();
                        this.aprobarBtn.disable();
                        this.cancelEstatusBtn.disable();

                        if ((record.get('codigooperacion') == "OPER_INV_PARCIAL") ||
                                (record.get('codigooperacion') == "OPER_INV_PAR_MENSUAL") ||
                                (record.get('codigooperacion') == "OPER_INV_TOTAL")) {
                            this.confirmarBtn.disable();
                        }
                        if (this.desaprobarBtn)
                            this.desaprobarBtn.disable();
                    }
                    break;
                case '2':
                    {
                        this.modificarBtn.enable();
                        this.eliminarBtn.disable();
                        this.movimientoBtn.enable();
                        this.confirmarBtn.disable();
                        this.aprobarBtn.enable();
                        this.cancelEstatusBtn.enable();
                        this.desaprobarBtn.disable();
                    }
                    break;
                case '3':
                    {
                        this.desaprobarBtn.enable();
                    }
                break;
                case '5':
                    {
                        this.modificarBtn.disable();
                        this.eliminarBtn.disable();
                        this.movimientoBtn.disable();
                        this.desaprobarBtn.disable();
                    }
                    break;
                default :
                    {
                        this.modificarBtn.enable();
                        this.eliminarBtn.disable();
                        this.movimientoBtn.enable();
                        this.confirmarBtn.disable();
                        this.aprobarBtn.disable();
                        this.cancelEstatusBtn.disable();
                        this.desaprobarBtn.disable();
                    }
            }

            if ((record.get('codigooperacion') == "OPER_AJUSTE_SOBRANTE") ||
                    (record.get('codigooperacion') == "OPER_AJUSTE_FALTANTE")) {
                // this.eliminarBtn.disable();
                this.modificarBtn.disable();
            }
            if (this.tipo_area_seleccionada != 'arearesp') {
                // this.btnTraslados.disable();
            }
        }

        this.adicionarBtn.enable();


    },
    mostrarWinMovimiento: function(data) {
        var _this = this;
        if (_this.movimientoWindow == false || !_this.movimientoWindow.getVistaPrincipal().isVisible()) {

            // Ext.getBody().mask(_this.idioma.lbMsgCargandoDatos, 'x-mask-loading');
            var record = _this.getSmPrincipal().getSelected();
            var nodoPadre = {
                attributes: {
                    text: _this.caminoNodoSeleccionado,
                    id: _this.idNodoSeleccionado
                }
            };                      
            var datos = {
                iddocumento: record.get('iddocumento'),
                idoperacion: record.get('idoperacion'),
                idestado: record.get('estado'),
                idcentrocosto: record.get('idcentrocosto'),
                tipodoc: record.get('tipodoc'),
                nrodoc: record.get('nrodoc'),
                fecha: record.get('fechacontable'),
                estado: LOG.lb.documento.Estado[record.get('estado')],
                idarearesp: record.get('idarearesp'),
                identidadpadre: nodoPadre.attributes.id,
                codigooperacion: record.get('codigooperacion'),
                arearesp: record.get('arearesp'),
                natobjobraP: natobjobraP,
                natinmuebleP: natinmuebleP,
                // natactivosP: natactivosP,
                tipo_interfaz: record.get('tipo_interfaz'),                
                idestructurapadre: _this.idPadreNodoSeleccionado, //record.get('idestructura'),
                iddocinventario: (record.get('iddocinventario')) ? record.get('iddocinventario') : false
            };
            if (record.get('codigooperacion') == "OPER_INV_TOTAL"
                || record.get('codigooperacion') == "OPER_INV_TOTAL_UH"
            ) {
                datos.inventarioTotal = true;
                datos.arregloOperaciones = _this.arregloOperaciones;

            } else if (record.get('codigooperacion') == "OPER_INV_PARCIAL"
                || record.get('codigooperacion') == "OPER_INV_PAR_MENSUAL"
                || record.get('codigooperacion') == "OPER_INV_PARCIAL_UH"
                || record.get('codigooperacion') == "OPER_INV_PAR_MEN_UH"
            ) {
                datos.inventarioParcial = true;
                datos.idmediosInventario = record.get('idmediosInventario');
                datos.idnaturalezasInventario = record.get('idnaturalezasInventario');
                datos.idareasInventario = record.get('idareasInventario');
                datos.idespecialidadesInventario = record.get('idespecialidadesInventario');
                datos.mensualInventario = record.get('mensualInventario');
                if (record.get('codigooperacion') == "OPER_INV_PAR_MENSUAL" || record.get('codigooperacion') == "OPER_INV_PAR_MEN_UH") {
                    datos.inventarioParcialMensual = true;
                }
            }

            if ((record.get('codigooperacion') == "OPER_AJUSTE_FALTANTE") || (record.get('codigooperacion') == "OPER_AJUSTE_SOBRANTE")) {
                Ext.Ajax.request({
                    url: 'getExisteDocAjustesInventario',
                    method: 'POST',
                    params: {
                        iddocumento: record.get('iddocumento')
                    },
                    callback: function(options, success, response) {
                        var rd = Ext.decode(response.responseText);
                        if (rd.datos == 1) {
                            datos.operacionAjuste = false;
                        } else {
                            datos.operacionAjuste = true;
                        }
                        fireEvent.createSequence
                    }
                });
            }
           _this.movimientoWindow = new LOG.aft.movimiento/*Ext.aft.movActivosFijos*/({
                datos: datos,
                tipo: _this.tipo,
                masivo: _this.masivo,
                listeners: {
                    'hide': function() {
                        _this.movimientoWindow = false;
                        //_this.teclasCalientes();
                    },
                    'close': function() {
                        _this.movimientoWindow = false;
                        //  _this.teclasCalientes();
                    }
                },
                _parent: _this
            });

            _this.movimientoWindow.init();
            _this.movimientoWindow.getVistaPrincipal().maximized = true;
            _this.movimientoWindow.view();
        }
    },
    mostrarWinAdicionarDoc: function(parametros) {
        this.model.cargarEncabezado('', null, parametros);
    },
    onExportar: function () {
        var _this = this;
        var form;
        var win = new LOG.util.Window({
            title: 'Seleccione la fecha en la que desea exportar',
            width: 500,
            height: 145,
            usarAplicar: false,
            resizable: false,
            constrain: true,
            modal: true,
            autoScroll: true,
            closeAction: 'hide',
            items: form = new Ext.FormPanel({
                frame: true,
                itemId: 'form',
                labelAlign: 'right',
                labelWidth: 85,
                height: 320,
                autoHeight: true,
                bodyStyle: 'padding: 5px',
                defaults: {
                    anchor: '0'
                },
                region: 'center',
                 items: [  
                    _this.fechaInicioconso,
                    _this.fechaFinConso
                    
                ]
                
            }),
            cancelarFn : function (close) {
                _this.fechaInicioconso.reset();
                _this.fechaFinConso.reset();
               
                return close;
            },
           aceptarFn: function (close) {
                   Ext.MessageBox.wait(LOG.util.Idioma.msgExportando, LOG.util.Idioma.msgEspere);          
                    Ext.Ajax.request({
                        url:'/logistica/activos_fijos/documento/index.php/gestdocumento/fBalanceExportarConso',
                        method: 'POST',
                        params: {
                             fechainicio:(_this.fechaInicioconso.getValue()> 0)?_this.fechaInicioconso.getValue().format('d-m-Y'):null  ,
                             fechafin:(_this.fechaFinConso.getValue()> 0)?_this.fechaFinConso.getValue().format('d-m-Y'):null 
                        },
                        callback: function (options, success, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            var bolb = new Blob([resp.datos], {type: 'text/plain'});
                            var url = URL.createObjectURL(bolb);
                            var save = document.createElement('a');
                            save.href = url;                    
                            save.target = '_blank';
                            save.download = 'activofijoCONSO.txt';
                            var clickEvent = new MouseEvent('click', {
                                'view': window,
                                'bubbles': true,
                                'cancelable': true
                            });
                            save.dispatchEvent(clickEvent);
                            URL.revokeObjectURL(url);
                        }.createDelegate(this)
                    });
                 _this.fechaInicioconso.reset();
                _this.fechaFinConso.reset();
               
                return close;
            }
        });
        win.show();
    }
   
});
