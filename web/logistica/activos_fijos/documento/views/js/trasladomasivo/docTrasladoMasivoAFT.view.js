Ext.ns('LOG.aft.trasladomasivo');
LOG.aft.trasladomasivo.View = Ext.extend(LOG.aft.documento.View, {
    tipo_area_seleccionada: 'entidad',
    movimientoWindow: false,
    constructor: function(config) {
        var _this = this;
        this.masivo = 1;
        config.dirController = '/logistica/activos_fijos/documento/index.php/gesttrasladomasivo';
        LOG.aft.trasladomasivo.View.superclass.constructor.call(this, config);
        this.model = new LOG.aft.documento.Model({
            idioma: config.idioma,
            scope: _this
        });
        _this.model.cargarEntidadComboArea({
            fnEntidad: _this.cargarDatosNecesarios
        });
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

        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: 'iddocumentoaft'
        }));
    },
    render: function(config) {
        Ext.apply(this, config);
        var vista = LOG.aft.trasladomasivo.View.superclass.render.call(this);
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

            this.formFields = new LOG.aft.trasladomasivo.TabPanelWinGestionar({
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

            this.winGestionarDocumento = new LOG.aft.trasladomasivo.winDocAdd({
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
});
