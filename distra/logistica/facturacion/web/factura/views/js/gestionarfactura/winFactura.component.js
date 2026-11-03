Ext.ns('LOG.fact');
LOG.fact.winFactura = Ext.extend(LOG.util.Window, {
    initComponent: function () {
        var _this = this;
        this.listaBotones.deleteAll();
        this.arrayCondiciones = new Array();
        this.arrayCondiciones.push([-1, 'S/D', 0]);
        if(!_this.datosComunes){
            this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
                text: this.idioma.btnCerrar,
                key: {
                    key: 'X',
                    ctrl: true,
                    alt: true
                },
                scope: this,
                handler: function () {
                    this.scope.close();
                }
            },true)));
            this.btnNuevo = new LOG.util.Prototipos.botonNuevo({
                tooltip: this.idioma.lbBtnAdicionarFact,
                handler: function(){
                    _this.functionBtnNuevo();
                    _this.habilitarBtn();
                },
                controlFn: function (b, called) {
                    if (_this.parent.grantedAction('CT') || _this.parent.grantedAction('RCRUD') || _this.parent.grantedAction('RAdicionar')) {
                        b.show();
                    } else {
                        b.hide();
                    }
                }
            });

            this.listaBotones.add(LOG.util.UIManager.reconfigureButton(this.btnNuevo));

            this.btnAceptar = new LOG.util.Prototipos.botonGuardar({
                tooltip: this.idioma.lbTtBtnGuardarFact,
                key:{
                    alt: true,
                    ctrl: false,
                    shift: false,
                    key: 'G'
                },
                handler: function() {
                    _this.guardarDatos(_this.accion, ((!_this.datosComunes)?true:null));
                },
                controlFn: function(b, called){
                    if (_this.parent.grantedAction('CT') || _this.parent.grantedAction('RCRUD') || _this.parent.grantedAction('RAdicionar')){
                        b.show();
                    }else{
                        b.hide();
                    }
                    if(_this.cmbCentroCosto) {
                        _this.cmbCentroCosto.fireEvent = _this.cmbCentroCosto.fireEvent.createSequence(function (e) {
                            if (e == "select") {
                                if (_this.documento && _this.documento.json && _this.documento.json.idcentrocosto != _this.cmbCentroCosto.getValue()) {
                                    if(_this.formularioBasico.getForm().isValid())
                                        b.enable();
                                }
                            }
                        });
                    }
                    if(_this.cmbOperacion) {
                        _this.cmbOperacion.fireEvent = _this.cmbOperacion.fireEvent.createSequence(function (e) {
                            if (e == "select") {
                                if (_this.documento && _this.documento.json && _this.documento.json.idoperacion != _this.cmbOperacion.getValue()) {
                                    if(_this.formularioBasico.getForm().isValid())
                                        b.enable();
                                }
                            }
                        });
                    }
                    if(_this.gpProd){
                        _this.gpProd.fireEvent = _this.gpProd.fireEvent.createSequence(function (e) {
                            if (e == "afteredit") {
                                if (_this.storeProd.getModifiedRecords().length > 0) {
                                    if(_this.formularioBasico.getForm().isValid())
                                        b.enable();
                                }
                            }
                        });
                        _this.storeProd.fireEvent = _this.storeProd.fireEvent.createSequence(function (e) {
                            if (e == "load") {
                                if (_this.storeProd.getModifiedRecords().length > 0) {
                                    if (_this.formularioBasico.getForm().isValid())
                                        b.enable();
                                }
                            }
                        });
                    }
                    if (_this.gpServ) {
                        _this.gpServ.fireEvent = _this.gpServ.fireEvent.createSequence(function (e) {
                            if (e == "afteredit") {
                                if (_this.storeServ.getModifiedRecords().length > 0) {
                                    if (_this.formularioBasico.getForm().isValid())
                                        b.enable();
                                }
                            }
                        });
                        _this.storeServ.fireEvent = _this.storeServ.fireEvent.createSequence(function (e) {
                            if (e == "load") {
                                if (_this.storeServ.getModifiedRecords().length > 0) {
                                    if (_this.formularioBasico.getForm().isValid())
                                        b.enable();
                                }
                            }
                        });
                    }
                    if (_this.gpConceptos) {
                        _this.gpConceptos.fireEvent = _this.gpConceptos.fireEvent.createSequence(function (e) {
                            if (e == "afteredit") {
                                if (_this.storeConceptos.getModifiedRecords().length > 0) {
                                    if (_this.formularioBasico.getForm().isValid())
                                        b.enable();
                                }
                            }
                            if (e == "checkcolumn") {
                                if (_this.storeConceptos.getModifiedRecords().length > 0) {
                                    if (_this.formularioBasico.getForm().isValid() && (_this.documento && _this.documento.json.estado == 1))
                                        b.enable();
                                }
                            }
                        });
                        _this.storeConceptos.fireEvent = _this.storeConceptos.fireEvent.createSequence(function (e) {
                            if (e == "load") {
                                if (_this.storeConceptos.getModifiedRecords().length > 0) {
                                    if (_this.formularioBasico.getForm().isValid())
                                        b.enable();
                                }
                            }
                        });
                    }
                    if (_this.gpProdServ) {
                        _this.gpProdServ.fireEvent = _this.gpProdServ.fireEvent.createSequence(function (e) {
                            if (e == "afteredit") {
                                if (_this.storeProdServ.getModifiedRecords().length > 0) {
                                    if (_this.formularioBasico.getForm().isValid())
                                        b.enable();
                                }
                            }
                        });
                        _this.storeProdServ.fireEvent = _this.storeProdServ.fireEvent.createSequence(function (e) {
                            if (e == "load") {
                                if (_this.storeProdServ.getModifiedRecords().length > 0) {
                                    if (_this.formularioBasico.getForm().isValid())
                                        b.enable();
                                }
                            }
                        });
                    }
                    if (_this.lote) {
                        _this.lote.getGridPrincipal().fireEvent = _this.lote.getGridPrincipal().fireEvent.createSequence(function (e) {
                            if (e == "afteredit") {
                                if (_this.lote.getGridPrincipal().getStore().getModifiedRecords().length > 0) {
                                    if (_this.formularioBasico.getForm().isValid())
                                        b.enable();
                                }
                            }
                        });
                        _this.lote.getGridPrincipal().getStore().fireEvent = _this.lote.getGridPrincipal().getStore().fireEvent.createSequence(function (e) {
                            if (e == "load") {
                                if (_this.lote.getGridPrincipal().getStore().getModifiedRecords().length > 0) {
                                    if (_this.formularioBasico.getForm().isValid())
                                        b.enable();
                                }
                            }
                        });
                    }
                }
            });
        }else{
            this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
                scope: this,
                key: {
                    key: 'X',
                    ctrl: false,
                    alt: true
                },
                handler: function () {
                    this.scope.close();
                }
            })));
            this.btnAceptar = new LOG.util.Prototipos.botonAceptar({
                tooltip: this.idioma.lbTtBtnGuardarFact,
                handler: function() {
                    _this.guardarDatos(_this.accion);
                },
                controlFn: function(b, called){
                    if (_this.gpConceptos) {
                        _this.gpConceptos.fireEvent = _this.gpConceptos.fireEvent.createSequence(function (e) {
                            if (e == "afteredit") {
                                if (_this.storeConceptos.getModifiedRecords().length > 0) {
                                    if (_this.formularioBasico.getForm().isValid())
                                        b.enable();
                                }
                            }
                        });
                        _this.storeConceptos.fireEvent = _this.storeConceptos.fireEvent.createSequence(function (e) {
                            if (e == "load") {
                                if (_this.storeConceptos.getModifiedRecords().length > 0) {
                                    if (_this.formularioBasico.getForm().isValid())
                                        b.enable();
                                }
                            }
                        });
                    }
                }
            });
        }
        this.modelo.addActionButton(this.btnAceptar);
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(this.btnAceptar));
        LOG.fact.winFactura.superclass.initComponent.call(this);
    },
    constructor: function(config) {
        var _this = this;
        this.idioma = config.idioma;
        //this.suministrador = config.suministrador ? config.suministrador : config.configFacturacion.suministrador;
        this.idsubsistema = config.idsubsistema;
        this.idoperacion = config.idoperacion;
        this.mayorista = config.mayorista;
        this.idcondicionpagodefault = config.idcondicionpagodefault;
        this.arrayOperaciones = config.arrayOperaciones;
        this.deshabilitarBotonesGrids = config.deshabilitarBotonesGrids;
        this.accion = config.accion;
        this.values = config.values;
        this.datosComunes = config.datosComunes;
        this.resizable = (this.datosComunes)?false:true;
        this.documento = config.documento;
        this.record = config.documento;
        this.idcontrato = (this.documento) ? (this.documento.json.idcontrato ? this.documento.json.idcontrato : undefined) : undefined;
        this.enterProd = false;
        this.enterServ = false;
        this.enterProdServ = false;
        this.enterConceptos = false;
        this.confFactura = config.configFacturacion;
        this.conceptoventa = null;
        this.valorconcepto = null;
        this.tipoconceptoventa = null;//1 porcentual, 0 no porcentual
        /*this.precioDefault = -1; //cargar en el encabezado
        this.tarifaDefault = -1; //cargar en el encabezado*/
        this.stDocumentos = config.stDocumentos;
        if(_this.datosComunes){
            this.height = config.height;
            this.width = config.width;
        }else{
            config.tbar = config.btn.getArray();
        }

        /**Tipo de documento(tipoDoc)
         * 1-Prefactura; 2-Factura manual; 3-Notas de entrega; 4-A partir de documentos(inv); 5-A partir de notas;
         * 6-A partie de la venta de AFT;7-A partir de pedido; 8 apartir de ordenes de talleres
         **/
        this.tipoDoc = (this.accion == 'add')?config.tipoDoc:((_this.documento.json.tipoDoc)?_this.documento.json.tipoDoc:
            ((_this.documento.json.oferta != 0)?1:(((_this.documento.json.esnota != 0)?3:2))));
        config.frame = true;
        if(_this.datosComunes){
            this.formularioBasico = LOG.util.UIManager.initForm({
                region: 'center',
                layout: 'border',
                items: [
                    this.createTbNorth(),
                    this.createTbCenter()
                ]
            });
        }
        config.items = (!_this.datosComunes)?[{
            xtype:'panel',
            region: 'north',
            layout: 'fit',
            height: (_this.documento && _this.documento.json.iddeposito) ? 250 : 250,
            collapsible: true,
            items: [this.createTbNorth()]
        },
            this.createTbCenter(),
            this.createTbSouth()
        ]:[
            this.formularioBasico
        ];
        LOG.fact.winFactura.superclass.constructor.call(this, config);
        this.modelo.bindForm(this.formularioBasico);
        this.on('show', function(w) {
            if (_this.accion != 'add') {
                this.modelo.loadRecord();
            }
            /*if(_this.documento)
                this.panelDatosDoc.getForm().loadRecord(new Ext.data.Record(_this.documento.json));*/
            this.listaBotones.each(function (b) {
                LOG.util.UIManager.applyKey(b, this);
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(this, [b, this]).call();
                }
            }, this);
            _this.aplicarControlFn();
            LOG.util.UIManager.applyKey(this.btnLotes, this);
            if (this.btnLotes && typeof this.btnLotes.controlFn == 'function') {
                this.btnLotes.controlFn.createDelegate(this, [this.btnLotes, this]).call();
            }
            LOG.util.UIManager.applyKey(this.btnNroSerie, this);
            if (this.btnNroSerie && typeof this.btnNroSerie.controlFn == 'function') {
                this.btnNroSerie.controlFn.createDelegate(this, [this.btnNroSerie, this]).call();
            }
            LOG.util.UIManager.applyKey(this.btnDesubicar, this);
            if (this.btnDesubicar && typeof this.btnDesubicar.controlFn == 'function') {
                this.btnDesubicar.controlFn.createDelegate(this, [this.btnDesubicar, this]).call();
            }
            LOG.util.UIManager.applyKey(this.btnCalcular, this);
            if (this.btnCalcular && typeof this.btnCalcular.controlFn == 'function') {
                this.btnCalcular.controlFn.createDelegate(this, [this.btnCalcular, this]).call();
            }
            LOG.util.UIManager.applyKey(this.btnCilindros, this);
            if (this.btnCilindros && typeof this.btnCilindros.controlFn == 'function') {
                this.btnCilindros.controlFn.createDelegate(this, [this.btnCilindros, this]).call();
            }

            //_this.panelDatosDoc.getForm().isValid();
            if(_this.listaBotones.arrayData.length == 3){
                _this.listaBotones.arrayData[2].disable();
            }
            _this.setTitulo();
            if (_this.accion == 'mod' || _this.accion == 'ver') {
                _this.listaBotones.arrayData[1].enable();
                _this.listaBotones.arrayData[2].disable();
                if(_this.documento.json.oferta == 0 && (_this.documento.json.idsubsistema == LOG.util.Subsistemas.inventario || _this.documento.json.idsubsistema == LOG.util.Subsistemas.activosfijos)){
                    _this.listaBotones.arrayData[1].hide();
                }
                /*LOG.fact.comboDeposito.depositoAreas = Array();
                for (var i = 0; i < _this.documento.json.depositoAreas.length; i++) {
                    LOG.fact.comboDeposito.depositoAreas.push(_this.documento.json.depositoAreas[i].idarea);
                }*/
                _this.hizoCambios = false;
                _this.cmbCentroCosto.getStore().load({
                    callback: function(st){
                        if(_this.accion != 'add'){
                            if(_this.documento && _this.documento.json && _this.documento.json.idcentrocosto){
                                _this.cmbCentroCosto.setValue(_this.documento.json.idcentrocosto);
                                _this.cmbCentroCosto.originalValue = _this.documento.json.idcentrocosto;
                                _this.cmbCentroCosto.fireEvent('select', _this.cmbCentroCosto,
                                    _this.cmbCentroCosto.getStore().getById(_this.documento.json.idcentrocosto),
                                    _this.cmbCentroCosto.getStore().indexOfId(_this.documento.json.idcentrocosto));
                                _this.cmbCentroCosto.setRawValue(_this.documento.json.centrocosto);
                            }
                        }
                    }
                });
                _this.cmbCliente.getStore().load({
                    params:{
                        limit: null,
						iddocumento : _this.documento.json.iddocumento
                    },
                    callback: function(st){
                        if(_this.accion != 'add'){
                            _this.cmbCliente.setValue(_this.documento.json.idcliente);
                            _this.cmbCliente.originalValue = _this.documento.json.idcliente;
                            _this.cmbCliente.fireEvent('select', _this.cmbCliente,
                                _this.cmbCliente.getStore().getById(_this.documento.json.idcliente),
                                _this.cmbCliente.getStore().indexOfId(_this.documento.json.idcliente));
                            _this.listaBotones.arrayData[2].disable();
                            _this.cmbCliente.setRawValue(_this.documento.json.cliente);
                        }
                    }
                });
                if(_this.cmbClienteaux) {
                    _this.cmbClienteaux.getStore().load({
                        params:{
                            limit: null,
                            clienteaux: 1,
                            iddocumento : _this.documento.json.iddocumento
                        },
                        callback: function(st){
                            if(_this.accion != 'add'){
                                _this.cmbClienteaux.setValue(_this.documento.json.idclienteauxiliar);
                                _this.cmbClienteaux.originalValue = _this.documento.json.idclienteauxiliar;
                                _this.cmbClienteaux.fireEvent('select', _this.cmbClienteaux,
                                    _this.cmbClienteaux.getStore().getById(_this.documento.json.idclienteauxiliar),
                                    _this.cmbClienteaux.getStore().indexOfId(_this.documento.json.idclienteauxiliar));
                                _this.listaBotones.arrayData[2].disable();
                            }
                        }
                    });
                }
                if(_this.cmbVendedor){
                    _this.cmbVendedor.getStore().load({
                        callback: function(st){
                            if(_this.accion != 'add'){
                                _this.cmbVendedor.setValue(_this.documento.json.idvendedor);
                                _this.cmbVendedor.originalValue = _this.documento.json.idvendedor;
                                _this.cmbVendedor.fireEvent('select', _this.cmbVendedor,
                                    _this.cmbVendedor.getStore().getById(_this.documento.json.idvendedor),
                                    _this.cmbVendedor.getStore().indexOfId(_this.documento.json.idvendedor));
                                _this.listaBotones.arrayData[2].disable();
                            }
                        }
                    });
                }

                if(_this.cmbFormaPago){
                    _this.cmbFormaPago.getStore().load({
                        callback: function(st){
                            if(_this.accion != 'add'){
                                _this.cmbFormaPago.setValue(_this.documento.json.idnomformapago);
                                _this.cmbFormaPago.originalValue = _this.documento.json.idnomformapago;
                                _this.cmbFormaPago.fireEvent('select', _this.cmbFormaPago,
                                    _this.cmbFormaPago.getStore().getById(_this.documento.json.idnomformapago),
                                    _this.cmbFormaPago.getStore().indexOfId(_this.documento.json.idnomformapago));
                                _this.listaBotones.arrayData[2].disable();
                            }
                        }
                    });
                }

                //_this.cmbContrato.setValue(_this.documento.json.idcontrato);
                //_this.cmbContrato.originalValue = _this.documento.json.idcontrato || null;
                _this.txtNroContrato.setValue(_this.documento.json.numero);
                _this.txtNroContrato.originalValue = _this.documento.json.numero || '';
                if (_this.txtFactorconversion) {
                    _this.txtFactorconversion.setValue(_this.documento.json.factorconvercion);
                    _this.txtFactorconversion.originalValue = _this.documento.json.factorconvercion || null;
                }
                _this.fechaContrato.setValue(_this.documento.json.fechafirma);
                _this.fechaContrato.originalValue = _this.documento.json.fechafirma || '';
                if(_this.cmbNroControl){
                    _this.cmbNroControl.setValue(_this.documento.json.nrocontrol);
                    _this.cmbNroControl.originalValue = _this.documento.json.nrocontrol || '';
                }
                _this.cmbNroFactura.originalValue = _this.documento.json.numdocumento || '';

                //_this.txtNroIdentidad.setValue(_this.documento.json.codigo);
                //_this.txtNroIdentidad.originalValue = _this.documento.json.codigo || '';
                //_this.txtNombre.setValue(_this.documento.json.cliente);
                if(_this.cmbDeposito){
                    _this.cmbDeposito.setValue(_this.documento.json.iddeposito);
                    _this.cmbDeposito.setRawValue(_this.documento.json.depositofactura);
                    if(_this.cmbDeposito.isValid() && _this.documento.json.iddeposito != null){
                        _this.habilitarIsValidDeposito();
                    }

                }
                if (_this.frmDatosContacto) {
                    _this.txtNombreContacto.setValue(_this.documento.json.nombrecontacto);
                    _this.txtCiContacto.setValue(_this.documento.json.cicontacto);
                    _this.txtTelefono.setValue(_this.documento.json.telfcontacto);
                }
                if(_this.frmDatosTransporte){
                    _this.txtfIdenConductor.setValue(_this.documento.json.identidadchofer);
                    _this.txtfMatriculaVehiculo.setValue(_this.documento.json.matriculavehiculo);
                    _this.txtfNombreConductor.setValue(_this.documento.json.nombrechofer);
                    _this.txtfCartaPorte.setValue(_this.documento.json.cartaporte);

                    _this.txtfBultos.setValue(_this.documento.json.bultos);
                    _this.txtfSellos.setValue(_this.documento.json.sellos);
                    _this.txtfOrden.setValue(_this.documento.json.nrorden);
                    _this.txtfContenedor.setValue(_this.documento.json.contenedor);
                    _this.txtfLicencia.setValue(_this.documento.json.licencia);

                    _this.txtfDestinoComercial.setValue(_this.documento.json.destinocomercial);
                    _this.txtfProdGenerico.setValue(_this.documento.json.prodgenerico);
                    _this.txtfPuertoDestino.setValue(_this.documento.json.puertodestino);
                    _this.txtfBL.setValue(_this.documento.json.bl);

                    _this.txtfIdenConductor.originalValue = _this.txtfIdenConductor.getValue();
                    _this.txtfMatriculaVehiculo.originalValue = _this.txtfMatriculaVehiculo.getValue();
                    _this.txtfNombreConductor.originalValue = _this.txtfNombreConductor.getValue();
                    _this.txtfCartaPorte.originalValue = _this.txtfCartaPorte.getValue();

                    _this.txtfBultos.originalValue = _this.txtfBultos.getValue();
                    _this.txtfSellos.originalValue = _this.txtfSellos.getValue();
                    _this.txtfOrden.originalValue = _this.txtfOrden.getValue();
                    _this.txtfContenedor.originalValue = _this.txtfContenedor.getValue();
                    _this.txtfDestinoComercial.originalValue = _this.txtfDestinoComercial.getValue();
                    _this.txtfProdGenerico.originalValue = _this.txtfProdGenerico.getValue();
                    _this.txtfPuertoDestino.originalValue = _this.txtfPuertoDestino.getValue();
                    _this.txtfBL.originalValue = _this.txtfBL.getValue();
                    _this.txtfLicencia.originalValue = _this.txtfLicencia.getValue();
                }

                _this.txtAObservaciones.setValue(_this.documento.json.observaciones);
                _this.txtAObservaciones.originalValue = _this.documento.json.observaciones || '';
                if(_this.cmbOrganTransp){
                    _this.cmbOrganTransp.setValue(_this.documento.json.nombretransp);
                    _this.cmbOrganTransp.originalValue = _this.documento.json.nombretransp;
                    _this.idproveedor = _this.documento.json.idproveedor;
                }
                if(_this.documento.json.estado == 1 && _this.cmbTipoPrecio){
                    _this.cmbTipoPrecio.getStore().load({
                        params:{
                            idcliente: _this.documento.json.idcliente,
                            idsubsistema: _this.idsubsistema,
                            promedio: (_this.tipoDoc == 1) ? 0 : 1,
                            oferta: (_this.tipoDoc == 1) ? 1 : 0,
                            tipo: 1
                        },
                        callback:function(st){
                            if(_this.tipoDoc != 5 && _this.tipoDoc != 4){
                                if(_this.accion != 'ver'){
                                    _this.habilitarBtnProductoServ();
                                }
                            }
                            _this.precioDefault = (st.length > 0) ? st[0].json.idtipoprecio : -2;
                        }
                    });
                    _this.cmbTipoPrecioAll.getStore().load({
                        params:{
                            idcliente: _this.documento.json.idcliente,
                            idsubsistema: _this.idsubsistema,
                            promedio: (_this.tipoDoc == 1) ? 0 : 1,
                            oferta: (_this.tipoDoc == 1) ? 1 : 0,
                            tipo: 1
                        }
                    });
                }
                if(_this.documento.json.estado == 1 && _this.cmbTipoTarifa){
                    _this.cmbTipoTarifa.getStore().load({
                        params:{
                            idcliente: _this.documento.json.idcliente,
                            idsubsistema: _this.idsubsistema,
                            promedio: 0,
                            tipo: 2
                        },
                        callback:function(st){
                            if(_this.tipoDoc != 8)
                                _this.habilitarBtnProductoServ();
                            _this.tarifaDefault = (st.length > 0) ? st[0].json.idtipoprecio : -2
                        }
                    });
                    _this.cmbTipoTarifaAll.getStore().load({
                        params:{
                            idcliente: _this.documento.json.idcliente,
                            idsubsistema: _this.idsubsistema,
                            promedio: 0,
                            tipo: 2
                        }
                    });
                }
                //if(_this.documento.json.estado != 1)
                    _this.habilitarBtn(_this.documento.json.estado);
            } else {
                _this.listaBotones.arrayData[1].disable();
                if(_this.listaBotones.arrayData.length == 3){
                    _this.listaBotones.arrayData[2].disable();
                }
                if (_this.values) {
                    if(!_this.datosComunes){
                        /*if(_this.values.cliente.depositoAreas && _this.values.cliente.depositoAreas.length > 0){
                            LOG.fact.comboDeposito.depositoAreas = _this.values.cliente.depositoAreas;
                        }*/
                        _this.cmbCliente.getStore().load({
                            params:{
                                limit: null
                            },
                            callback: function(st){
                                    _this.cmbCliente.setValue(_this.values.cliente.idcliente);
                                    _this.cmbCliente.setRawValue(_this.values.cliente.cliente);
                                    //_this.txtNroIdentidad.setValue(_this.values.cliente.codigo);
                                    _this.cmbCliente.fireEvent('select', _this.cmbCliente,
                                        _this.cmbCliente.getStore().getById(_this.values.cliente.idcliente),
                                        _this.cmbCliente.getStore().indexOfId(_this.values.cliente.idcliente));
                            }
                        });

                        if(_this.values.iddeposito){
                            _this.cmbDeposito.setValue(_this.values.iddeposito);
                            _this.cmbDeposito.setRawValue(_this.values.deposito);
                            _this.habilitarIsValidDeposito();
                        }
                    }
                }
            }

            /*this.cmbCBC.getStore().on('load', function() {
                var rd = _this.cmbCBC.getStore().data.items;
                Ext.each(rd, function(uno){
                    //uno.data.numerocuenta = uno.data.numerocuenta + " - " + uno.json.codigoiso;
                });
            });*/
            var tipo = (_this.tipoDoc == 3) ? 'conduce' : 'factura';
            if(_this.cmbSerie){
                if(_this.accion != 'add') {
                    _this.cmbSerie.setValue(_this.documento.json.idseriedocentidad);
                    _this.cmbSerie.setRawValue(_this.documento.json.denomserie);
                }
                _this.cmbSerie.getStore().load({
                    params:{
                        tipoDoc: tipo,
                        iddoc: (_this.values)?_this.values.iddoc:((_this.documento) ? _this.documento.json.iddoc : null)
                    },
                    callback: function(st){
                        if(_this.accion != 'add'){
                            /*_this.cmbSerie.setValue(_this.documento.json.idseriedocentidad);
                            _this.cmbSerie.setRawValue(_this.documento.json.denomserie);*/
                            _this.cmbSerie.originalValue = _this.documento.json.idseriedocentidad;
                            _this.cmbSerie.fireEvent('select', _this.cmbSerie,
                                _this.cmbSerie.getStore().getById(_this.documento.json.idseriedocentidad),
                                _this.cmbSerie.getStore().indexOfId(_this.documento.json.idseriedocentidad));
                            _this.listaBotones.arrayData[2].disable();
                        }
                    }
                });
            }
            _this.onActions();
            if (!_this.parent.grantedAction('RBIMP')) {
                _this.gpConceptos.getColumnModel().setHidden(4, true)
            }
            if (!_this.documento || _this.documento.json.pagoexterior != 1) {
                _this.gpConceptos.getColumnModel().setHidden(6, true)
            }
        });
        this.on('hide', function(w){
            if(_this.recargar)
                _this.parent.getGridPrincipal().getStore().reload();
            if(_this.txtfMatriculaVehiculo){
                _this.txtfMatriculaVehiculo.destroy();
            }
        });
    },
    aplicarControlFn: function(){
        var _this = this;
        if(_this.panelProd){
            LOG.util.UIManager.applyKey(_this.btnAdicionarProd, _this);
            if (typeof _this.btnAdicionarProd.controlFn == 'function') {
                _this.btnAdicionarProd.controlFn.createDelegate(_this, [_this.btnAdicionarProd, _this]).call();
            }
            LOG.util.UIManager.applyKey(_this.btnAdicionarProdAlm, _this);
            if (typeof _this.btnAdicionarProdAlm.controlFn == 'function') {
                _this.btnAdicionarProdAlm.controlFn.createDelegate(_this, [_this.btnAdicionarProdAlm, _this]).call();
            }
            LOG.util.UIManager.applyKey(_this.btnEliminarProd, _this);
            if (typeof _this.btnEliminarProd.controlFn == 'function') {
                _this.btnEliminarProd.controlFn.createDelegate(_this, [_this.btnEliminarProd, _this]).call();
            }
            LOG.util.UIManager.applyKey(_this.btnDesubicar, _this);
            if (typeof _this.btnDesubicar.controlFn == 'function') {
                _this.btnDesubicar.controlFn.createDelegate(_this, [_this.btnDesubicar, _this]).call();
            }
            LOG.util.UIManager.applyKey(_this.btnCalcular, _this);
            if (typeof _this.btnCalcular.controlFn == 'function') {
                _this.btnCalcular.controlFn.createDelegate(_this, [_this.btnCalcular, _this]).call();
            }
            LOG.util.UIManager.applyKey(_this.btnCilindros, _this);
            if (typeof _this.btnCilindros.controlFn == 'function') {
                _this.btnCilindros.controlFn.createDelegate(_this, [_this.btnCilindros, _this]).call();
            }
        }
        if (_this.panelServ) {
            LOG.util.UIManager.applyKey(_this.btnAdicionarServ, _this);
            if (typeof _this.btnAdicionarServ.controlFn == 'function') {
                _this.btnAdicionarServ.controlFn.createDelegate(_this, [_this.btnAdicionarServ, _this]).call();
            }
            if (typeof _this.btnEliminarServ.controlFn == 'function') {
                _this.btnEliminarServ.controlFn.createDelegate(_this, [_this.btnEliminarServ, _this]).call();
            }
            if (typeof _this.btnAdicionarProdServ.controlFn == 'function') {
                _this.btnAdicionarProdServ.controlFn.createDelegate(_this, [_this.btnAdicionarProdServ, _this]).call();
            }
            if (typeof _this.btnAdicionarAftServ.controlFn == 'function') {
                _this.btnAdicionarAftServ.controlFn.createDelegate(_this, [_this.btnAdicionarAftServ, _this]).call();
            }
            if (typeof _this.btnEliminarProdServ.controlFn == 'function') {
                _this.btnEliminarProdServ.controlFn.createDelegate(_this, [_this.btnEliminarProdServ, _this]).call();
            }
        }
    },
    onShowHandler: function() {
        this.btn.each(function(b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);
    },
    onActions: function() {
        var _this = this;
        if(_this.accion != 'add'){
            _this.setImporteTotal();
            if(_this.documento.json.estado != 1 && _this.documento.json.estado != 10){
                _this.distintoElaboracion();
            }
        }
        if(_this.tipoDoc == 5){
            _this.apartirNotaEntrega();
        }else if(_this.tipoDoc == 4){
            if(!_this.datosComunes)
                _this.apartirDistribucion();
        }else if(_this.tipoDoc == 7){
            if(!_this.datosComunes)
                _this.apartirPedido();
        }else if(_this.tipoDoc == 9){
            if(!_this.datosComunes)
                _this.apartirOferta();
        }
    },
    apartirNotaEntrega: function(){
        var _this = this;
        if(_this.panelProd){
            _this.btnAdicionarProd.disable();
            _this.btnAdicionarProdAlm.disable();
            _this.btnEliminarProd.disable();
        }
        if(_this.panelServ){
            _this.btnAdicionarServ.disable();
            _this.btnEliminarServ.disable();
            _this.btnAdicionarProdServ.disable();
            _this.btnAdicionarAftServ.disable();
            _this.btnEliminarProdServ.disable();
        }
        _this.cmbCliente.disable();
        if (_this.cmbClienteaux)
            _this.cmbClienteaux.disable();
        _this.cmbCentroCosto.disable();
        _this.cmbOperacion.disable();
        //_this.cmbCBC.disable();
        _this.deshabilitarBotonesGrids = true;
    },
    apartirDistribucion: function(){
        var _this = this;
        if(_this.btnAdicionarProd)
            _this.btnAdicionarProd.disable();
        if(_this.btnAdicionarProdAlm)
            _this.btnAdicionarProdAlm.disable();
        _this.cmbCliente.disable();
    },
    apartirPedido: function(){
        var _this = this;
        if(_this.panelProd){
            _this.btnAdicionarProd.disable();
            _this.btnAdicionarProdAlm.disable();
        }
        if(_this.panelServ){
            _this.btnAdicionarServ.disable();

        }
        _this.cmbCliente.disable();
    },
    apartirOferta: function(){
        var _this = this;
        if(_this.panelProd){
            _this.btnAdicionarProd.disable();
            _this.btnAdicionarProdAlm.disable();
        }
        if(_this.panelServ){
            _this.btnAdicionarServ.disable();

        }
        _this.cmbCliente.disable();
    },
    distintoElaboracion: function(){
        var _this = this;
        _this.accion = 'ver';
        _this.deshabilitarBotonesGrids = true;
        if(_this.btnEliminarProd){
            _this.btnEliminarProd.disable();
        }
        if (_this.btnEliminarServ) {
            _this.btnEliminarServ.disable();
        }
        if (_this.btnAdicionarProdServ) {
            _this.btnAdicionarProdServ.disable();
        }
        if (_this.btnAdicionarAftServ) {
            _this.btnAdicionarAftServ.disable();
        }
        if (_this.btnEliminarProdServ) {
            _this.btnEliminarProdServ.disable();
        }
        //_this.chxUtilizarGuia.disable();
        _this.cmbCliente.disable();
        if (_this.cmbClienteaux)
            _this.cmbClienteaux.disable();
        _this.cmbOperacion.enable();
        if (_this.documento && _this.documento.json && _this.documento.json.idcomprobante != null && _this.documento.json.idcomprobante != "") {
            _this.cmbCentroCosto.disable();
            _this.cmbOperacion.disable();
            _this.cmbCondicionPago.disable();
        } else {
            if (_this.tipoDoc != 8){
                _this.cmbCentroCosto.enable();
            }
            if (_this.documento && _this.documento.json && _this.documento.json.estado != 7)
            _this.cmbCondicionPago.enable();
        }
        _this.cmbCBC.disable();
        if(_this.cmbSerie)
            _this.cmbSerie.disable();
        _this.cmbMoneda.disable();
        if (_this.cmbContacto)
            _this.cmbContacto.disable();
        if (_this.cmbVendedor)
            _this.cmbVendedor.disable();
        if (_this.cmbFormaPago)
            _this.cmbFormaPago.disable();
        if (_this.cmbTasa)
            _this.cmbTasa.disable();
        //_this.cmbContrato.disable();
        _this.txtNroContrato.disable();
        _this.fechaContrato.disable();
        if(_this.frmDatosTransporte){
            _this.txtfIdenConductor.disable();
            _this.txtfMatriculaVehiculo.disable();
            _this.txtfCartaPorte.disable();
            _this.viaTransporte.disable();
            _this.txtfNombreConductor.disable();
            _this.cmbOrganTransp.disable();

            _this.txtfBultos.disable();
            _this.txtfSellos.disable();
            _this.txtfOrden.disable();
            _this.txtfContenedor.disable();
            _this.txtfDestinoComercial.disable();
            _this.txtfProdGenerico.disable();
            _this.txtfPuertoDestino.disable();
            _this.txtfBL.disable();
            _this.txtfLicencia.disable();
        }
        if (_this.frmDatosContacto) {
            _this.txtNombreContacto.disable();
            _this.txtCiContacto.disable();
            _this.txtTelefono.disable();
        }
        _this.txtAObservaciones.disable();
        if(_this.chxReservaPrecio){
            _this.chxReservaPrecio.disable();
        }
        if(_this.chxReservaDisponible){
            _this.chxReservaDisponible.disable();
        }
        if (_this.btnAplicarPrecio) {
            _this.btnAplicarPrecio.disable();
        }
        if (_this.btnAplicarTarifa) {
            _this.btnAplicarTarifa.disable();
        }
        if (_this.cmbTipoPrecioAll) {
            _this.cmbTipoPrecioAll.disable();
        }
        if (_this.cmbTipoTarifaAll) {
            _this.cmbTipoTarifaAll.disable();
        }
        if (_this.cmbMonedaProd) {
            _this.cmbMonedaProd.disable();
        }
        if (_this.txtFactorconversion) {
            _this.txtFactorconversion.disable();
        }
    },
    enNuevoElaboracion: function(accion){
        var _this = this;
        _this.accion = (accion)? accion : 'add';
        _this.deshabilitarBotonesGrids = (/*_this.tipoDoc != 8 &&*/ _this.tipoDoc != 6)?false:true;
        if(_this.gpProd && _this.gpProd.getSelectionModel().hasSelection()){
            if (_this.btnEliminarProd) {
                _this.btnEliminarProd.enable();
            }
        }
        var hayProd = false;
        var hayServ = false;
        if(_this.storeProd){
            if(_this.storeProd.getCount() > 0){
                hayProd = true;
            }
        }
        if(_this.storeServ){
            if(_this.storeServ.getCount() > 0){
                hayServ = true;
            }
        }
        if(hayProd || hayServ){
            if (_this.cmbClienteaux) {
                _this.cmbCliente.enable();
            } else {
                _this.cmbCliente.disable();
            }
        }else{
            _this.cmbCliente.enable();
        }
        if (_this.cmbClienteaux)
            _this.cmbClienteaux.enable();
        if(_this.tipoDoc != 8) {
            _this.cmbCentroCosto.enable();
        }

        if (_this.documento.json.iddoc != iddocnotadebito && _this.documento.json.iddoc != iddocnotacredito)
            _this.cmbCondicionPago.enable();
        if (_this.cmbContacto)
            _this.cmbContacto.enable();
        if (_this.cmbVendedor)
            _this.cmbVendedor.enable();
        if (_this.cmbFormaPago)
            _this.cmbFormaPago.enable();
        if (_this.cmbTasa)
            _this.cmbTasa.enable();
        //_this.cmbCBC.disable();
        //_this.cmbContrato.enable();
        _this.cmbOperacion.enable();
        _this.txtNroContrato.enable();
        if(!contratacion)
            _this.fechaContrato.enable();
        if(_this.cmbSerie){
            _this.cmbSerie.enable();
            _this.cmbCBC.enable();
        }
        _this.cmbMoneda.enable();
        if(_this.frmDatosTransporte){
            _this.txtfIdenConductor.enable();
            _this.txtfMatriculaVehiculo.enable();
            _this.txtfNombreConductor.enable();
            _this.cmbOrganTransp.enable();
            _this.txtfCartaPorte.enable();
            _this.viaTransporte.enable();
            _this.viaTransporte.setValue(4);
            _this.viaTransporte.originalValue = 4;

            _this.txtfBultos.enable();
            _this.txtfSellos.enable();
            _this.txtfBL.enable();
            _this.txtfLicencia.enable();
        }
        if (_this.frmDatosContacto) {
            _this.txtNombreContacto.enable();
            _this.txtCiContacto.enable();
            _this.txtTelefono.enable();
        }
        _this.txtAObservaciones.enable();
        if(!_this.panelProd){
            if (_this.idsubsistema == -1) {
                if (_this.manualproductos) {
                    _this.createPnProducto();
                    _this.tbCenter.insert(0, _this.panelProd);
                }
            } else if(_this.idsubsistema == LOG.util.Subsistemas.activosfijos){
                if (_this.documento.json.alquiler == 0){
                    _this.createPnProducto();
                    _this.tbCenter.insert(0, _this.panelProd);
                }
            }
            else {
                _this.createPnProducto();
                _this.tbCenter.insert(0, _this.panelProd);
            }
        }else{
            _this.tbCenter.unhideTabStripItem(0);
        }
        if(!_this.panelServ /*&& (_this.idsubsistema != LOG.util.Subsistemas.inventario || _this.tipoDoc == 1)*/){
            if (_this.idsubsistema == LOG.util.Subsistemas.activosfijos) {
                if (_this.documento.json.alquiler == 1){
                    _this.createPnServicio();
                    _this.tbCenter.insert(0, _this.panelServ);
                }
            }else{
                _this.createPnServicio();
                _this.tbCenter.insert(1, _this.panelServ);
            }
        }else{
            _this.tbCenter.unhideTabStripItem(1);
        }
        if (_this.btnAplicarPrecio) {
            _this.btnAplicarPrecio.enable();
        }
        if (_this.btnAplicarTarifa) {
            _this.btnAplicarTarifa.enable();
        }
        if (_this.cmbTipoPrecioAll) {
            _this.cmbTipoPrecioAll.enable();
        }
        if (_this.cmbTipoTarifaAll) {
            _this.cmbTipoTarifaAll.enable();
        }
        if (_this.cmbMonedaProd) {
            _this.cmbMonedaProd.enable();
        }
        if (_this.txtFactorconversion) {
            _this.txtFactorconversion.enable();
        }
        _this.onActions();
    },
    createTbNorth: function() {
        var _this = this;
        this.panelDatosDoc = LOG.util.UIManager.initPanel({
            title: (!_this.datosComunes)?this.idioma.tDatosDocumento:null,
            region: 'north',
            frame: true,
            height: (!_this.datosComunes)?null:90,
            items: this.createPnDatosDocumento()
        });
        if(!_this.datosComunes){
            var items = new Array();
            items.push(this.panelDatosDoc);
            _this.createPnTranspOtros();
            if(this.panelDatosTransp){
                items.push(this.panelDatosTransp);
            }
            this.tbNorth = new Ext.TabPanel({

                activeTab: 0,
                border: false,
                height: (_this.cmbDeposito)?225:225,
                tbar: (_this.cmbDeposito)?['-','->',new Ext.form.Label({text: 'Operaci\xf3n: '}), '&nbsp',
                        _this.cmbOperacion,'-',new Ext.form.Label({text: 'Centro de costo: '}), '&nbsp',
                    _this.cmbCentroCosto,'-',new Ext.form.Label({text: _this.idioma.lbDepositoPuntos}), '&nbsp',_this.cmbDeposito,'-']
                    :['-','->',new Ext.form.Label({text: 'Operaci\xf3n: '}), '&nbsp',
                        _this.cmbOperacion,'-',new Ext.form.Label({text: 'Centro de costo: '}), '&nbsp', _this.cmbCentroCosto],
                items: items
            });
            this.formularioBasico = LOG.util.UIManager.initForm({
                region: 'north',
                height: (_this.cmbDeposito) ? 225 : 225,
                items: this.tbNorth
            });
            return this.formularioBasico;
        }else{
            return this.panelDatosDoc;
        }
    },
    createPnTranspOtros: function(){
        var _this = this;
        var transporte = this.createPnDatosTransporte();
        if(transporte){
            this.panelDatosTransp = LOG.util.UIManager.initPanel({
                title: this.idioma.tOtros,
                region: 'north',
                frame: true,
                items:transporte
            });
        }
        return this.panelDatosTransp;
    },
    createPnDatosDocumento: function() {
        var _this = this;
        this.frmDatosDocumento = new LOG.util.ColumnForm({columnas:/*(_this.tipoDoc == 1)?1:2*/2});
        var disable = (this.accion == 'add') ? false : ((_this.documento.json.estado != 1)?true:false);

         /*this.cmbtipopedido = new LOG.util.ComboBox({
            fieldLabel: 'Tipo de pedido',
            url: '/logistica/distribucion/pedido/index.php/Pedido/cargarNomtipopedido',
            hiddenName: 'idnomconcepto',
            valueField: 'idnomconcepto',
            displayField: 'denomtipopedido',
            loadingText: this.idioma.lbCargando,
            disabled: _this.deshabilitarBotonesGrids,
            hideTrigger: false,
            readOnly: false,
            triggerAction: 'all',
            enableQtip: true,
            pageSize: 10,
            emptyText: this.idioma.lbSeleccione,
            minChars: 0,
            mode: 'remote'//,
        });*/

        this.cmbCliente = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCliente,
            autoLoad: false,
            url: 'cargarClientes',
            name: 'idcliente',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            loadingText: this.idioma.lbMCargando,
            disabled: _this.deshabilitarBotonesGrids,
            triggerAction: 'all',
            enableQtip: true,
            pageSize: 20,
            minChars: 0,
            mode: 'remote',
            emptyText: _this.idioma.cbEmtyText,
            anchor: '98%',
            //value: (this.values && !this.datosComunes) ? this.values.cliente.idcliente : null,
            allowBlank: false
        });

        this.cmbCliente.getStore().on('beforeload', function(st) {
            st.baseParams.mayorista = _this.mayorista;
            st.initBaseParams.mayorista = _this.mayorista;
            if (_this.cmbClienteaux) {
                st.baseParams.idclientepadre = _this.idclienteauxiliarpadre || null;
                st.initBaseParams.idclientepadre = _this.idclienteauxiliarpadre || null;
            }
        });
        if (_this.confFactura.utilizarbeneficiario == '1') {
            this.cmbClienteaux = new LOG.util.ComboBox({
                fieldLabel: 'Beneficiario',
                autoLoad: false,
                url: 'cargarClientes',
                name: 'idclienteaux',
                valueField: 'idclientesproveedores',
                displayField: 'nombre',
                loadingText: this.idioma.lbMCargando,
                disabled: _this.deshabilitarBotonesGrids,
                triggerAction: 'all',
                enableQtip: true,
                pageSize: 20,
                minChars: 0,
                mode: 'remote',
                emptyText: _this.idioma.cbEmtyText,
                anchor: '98%',
                //value: (this.values && !this.datosComunes) ? this.values.cliente.idcliente : null,
            });
            this.cmbClienteaux.getStore().on('beforeload', function(st) {
                if (_this.cmbClienteaux) {
                    st.baseParams.idclientepadre = null;
                    st.initBaseParams.idclientepadre = null;
                }
            });
        }

        var storeCBC = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'idcuentabancliente'
                },
                {
                    name: 'numerocuentaAux'
                },{
                    name: 'idmoneda'
                }
            ]
        });
        if (_this.confFactura.utilizarformapago == '1') {
            this.cmbFormaPago = new LOG.util.ComboBox({
                fieldLabel: 'Forma de pago',
                autoLoad: false,
                url: '/logistica/facturacion/facturacion/factura/index.php/gestionarfactura/cargarFormaPago',
                name: 'idnomformapago',
                valueField: 'idnomformapago',
                displayField: 'denominacion',
                loadingText: this.idioma.lbMCargando,
                disabled: _this.deshabilitarBotonesGrids,
                triggerAction: 'all',
                enableQtip: true,
                pageSize: 20,
                minChars: 0,
                mode: 'remote',
                emptyText: _this.idioma.cbEmtyText,
                anchor: '98%',
            });

            this.cmbFormaPago.on('select', function(cmb, rd, ix, p) {
                _this.conceptoventa = rd.json.recargodescuento;
                _this.valorconcepto = rd.json.valor;
                _this.tipoconceptoventa = rd.json.porcentual;
            });
        }

        this.cmbCBC = new LOG.util.LovCombo({
            fieldLabel: 'Cuenta bancaria',
            url: 'cargarCuentasCliente',
            name: 'idcuentabancliente',
            valueField: 'idcuentabancliente',
            displayField: 'numerocuentaAux',
            autoLoad: false,
            allowBlank: (_this.tipoDoc == 1) ? true : false,
            disabled: true,
            emptyText: _this.idioma.cbEmtyText,
            editable: true,
            forceSelection: false,
            enableKeyEvents: true,
            store: storeCBC,
            getXType: function(){
                return 'combobox';
            },
            listeners: {
                blur: function () {

                }
            }
        });

        this.cmbCliente.on('expand', function(cmb){
            cmb.pageTb.cbPageSize.on('select', function(cmb, rd){
                _this.cmbCliente.focus();
                _this.cmbCliente.fireEvent('expand', _this.cmbCliente);
            })
        });
        if (this.cmbClienteaux) {
            this.cmbClienteaux.on('expand', function(cmb){
                cmb.pageTb.cbPageSize.on('select', function(cmb, rd){
                    _this.cmbClienteaux.focus();
                    _this.cmbClienteaux.fireEvent('expand', _this.cmbClienteaux);
                })
            });
        }
        var storeCP = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'idcondicionpago'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'plazo'
                }
            ]
        });
        this.cmbCondicionPago = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCondicionPago,
            store: storeCP,
            autoLoad: false,
            name: 'idcondicionpago',
            valueField: 'idcondicionpago',
            displayField: 'denominacion',
            otherFields: ['plazo'],
            disabled: true,
            editable: true,
            typeAhead: true,
            emptyText: _this.idioma.cbEmtyText,
            //allowBlank: (_this.datosComunes || _this.tipoDoc == 1) ? true : false
        });
        var storeCont = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'idcontacto'
                },
                {
                    name: 'nombre'
                }
            ]
        });
        //if(_this.confFactura.utilizarvendedor == '1') {
            this.cmbVendedor = new LOG.util.ComboBox({
                fieldLabel: 'Vendedor',
                autoLoad: false,
                url: '/logistica/facturacion/facturacion/factura/index.php/gestionarfactura/cargarVendedor',
                name: 'idpersona',
                valueField: 'idpersona',
                displayField: 'nombreapellidos',
                loadingText: this.idioma.lbMCargando,
                disabled: _this.deshabilitarBotonesGrids,
                triggerAction: 'all',
                enableQtip: true,
                pageSize: 20,
                minChars: 0,
                mode: 'remote',
                emptyText: _this.idioma.cbEmtyText,
                anchor: '98%',
            });
        //} else {
            this.cmbContacto = new LOG.util.ComboBox({
                fieldLabel: 'Comprador',
                store: storeCont,
                autoLoad: false,
                name: 'idcontacto',
                valueField: 'idcontacto',
                displayField: 'nombre',
                disabled: true,
                editable: false,
                emptyText: _this.idioma.cbEmtyText
            });
        //}
        /*this.txtNroIdentidad = new LOG.util.Prototipos.inputTexto({
            name: 'nicliente',
            fieldLabel: this.idioma.lbCodigoREUP,//this.idioma.lbNroIdentidad,
            disabled: true
        });*/
		/*this.cmbContrato = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbContrato,
            autoLoad: false,
            url: '/logistica/facturacion/facturacion/factura/index.php/gestionarfactura/cargarContratos',
            name: 'idcontrato',
            valueField: 'idcontrato',
            displayField: 'numerocontrato',
            loadingText: this.idioma.lbMCargando,
            disabled: _this.deshabilitarBotonesGrids,
            triggerAction: 'all',
            enableQtip: true,
            pageSize: 20,
            minChars: 0,
            mode: 'remote',
            emptyText: _this.idioma.cbEmtyText,
            anchor: '98%',
        });
		    this.cmbContrato.getStore().on('beforeload', function(st,opts){
            st.baseParams.idclienteproveedor = _this.cmbCliente.getValue();
        });
         this.cmbContrato.getStore().on('load', function(st,records){
            if(_this.documento && _this.documento.json && _this.documento.json.idcontrato){
           _this.cmbContrato.fireEvent('select', _this.cmbContrato,
                                _this.cmbContrato.getStore().getById(_this.documento.json.idcontrato),
                                _this.cmbContrato.getStore().indexOfId(_this.documento.json.idcontrato));
            }
        });
        this.cmbContrato.on('valuechange', function(v){
            if(_this.cmbContrato.getValue()){
              console.log(_this.cmbContrato.getValue());
              console.log(_this.cmbContrato.getStore().getById(_this.cmbContrato.getValue()));
              _this.fechaContrato.setValue(_this.cmbContrato.getStore().getById(_this.cmbContrato.getValue()).json.fechafirma);
            }
        });*/
        this.txtNroContrato = (!contratacion) ? new LOG.util.Prototipos.inputTexto({
            name: 'numero',
            fieldLabel: this.idioma.lbNroContrato,
            maxLength: '100',
            minLength: '1',
            listeners: {
                keyup: function(){
                    if (!_this.txtNroContrato.isValid()) {
                        _this.listaBotones.arrayData[2].disable();
                        if(_this.btnAdicionarProd){
                            _this.btnAdicionarProd.disable();
                            _this.btnAdicionarProdAlm.disable();
                        }
                        if(_this.btnAdicionarServ){
                            _this.btnAdicionarServ.disable();
                        }
                    }
                }
            }
        }) : new Ext.form.TriggerField({
            fieldLabel: this.idioma.lbNroContrato,
            name: 'numero',
            triggerClass: 'x-form-cliente-trigger',
            editable: false,
            emptyText: _this.idioma.cbEmtyText,
            tabular:true,
            listeners: {
                onSelect: function(record) {
                    if (record.combo.isDirty())
                    {

                    }
                    else
                        record.combo.setValue("");
                }
            }
        });

        if(contratacion){
            this.txtNroContrato.onTriggerClick = function(e) {
                if (!_this.txtNroContrato.disabled)
                    _this.showContratos();//.Inicializar();
            };
        }

        this.fechaContrato = new Ext.form.DateField({
            fieldLabel: this.idioma.lbFechaContrato,
            name: 'fechacontrato',
            editable: false,
            disabled: true,
            format: 'd/m/Y'
        });
        if(_this.confFactura.utilizarserie == 1 && _this.tipoDoc != 1){
            this.cmbSerie = new LOG.util.ComboBox({
                fieldLabel: this.idioma.lbSerie,
                url: 'getSeries',
                name: 'idseriedocentidad',
                valueField: 'idseriedocentidad',
                displayField: 'denominacion',
                disabled: disable,
                autoLoad: false,
                anchor: '98%',
                emptyText: _this.idioma.cbEmtyText,
                editable: false,
                allowBlank: (_this.datosComunes) ? true : false
            });
        }
        if(_this.confFactura.utilizartasa == 1){
            this.txtFactorconversion = LOG.util.Prototipos.inputDecimal({
                fieldLabel: 'Tasa',
                name: 'factorconvercion',
                regexText: 'Tasa',
                enableKeyEvents: true,
                listeners: {
                    keyup: function(){
                        if (!_this.txtFactorconversion.isValid()) {
                            _this.listaBotones.arrayData[2].disable();
                            if(_this.btnAdicionarProd){
                                _this.btnAdicionarProd.disable();
                                _this.btnAdicionarProdAlm.disable();
                            }
                            if(_this.btnAdicionarServ){
                                _this.btnAdicionarServ.disable();
                            }
                        }
                    }
                }
            });
            /*this.stTasa = new Ext.data.Store({
                autoLoad: true,
                url: '/logistica/facturacion/facturacion/configuracion/index.php/conffacturacion/cargartipostasa',
                reader: new Ext.data.JsonReader({
                        id: "idtipotasa",
                        root: "datos"
                    },
                    [
                        {name: 'idtipotasa'},
                        {name: 'nombretipotasa'}
                    ]),
                listeners: {
                    load: function(){
                        if(_this.documento.json.idtipotasa){
                            _this.cmbTasa.setValue(_this.documento.json.idtipotasa);
                            _this.cmbTasa.originalValue = _this.documento.json.idtipotasa;
                        } else {
                            _this.cmbTasa.setValue(_this.confFactura.tipotasa);
                            _this.cmbTasa.originalValue = _this.confFactura.tipotasa;
                        }
                        _this.cmbTasa.fireEvent('select', _this.cmbTasa,
                            _this.cmbTasa.getStore().getById(_this.cmbTasa.getValue()),
                            _this.cmbTasa.getStore().indexOfId(_this.cmbTasa.getValue()), 1);
                    }
                }
            });

            this.cmbTasa = new LOG.util.ComboBox({
                store: this.stTasa,
                fieldLabel: 'Tipo tasa',
                hiddenName: 'idtipotasa',
                valueField: 'idtipotasa',
                displayField: 'nombretipotasa',
                editable: false,
                allowBlank: false,
                anchor: '20%',
                emptyText: 'Seleccione...',
                listeners: {
                    'select': function (cmb) {
                        _this.idtipotasa = cmb.getValue();
                        _this.cmbMoneda.reset();
                        _this.cmbMoneda.getStore().removeAll();
                        _this.cmbMoneda.getStore().load();

                    }
                }
            });*/
        }
        this.cmbMoneda = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbMoneda,
            url: 'cargarMonedaContable',
            name: 'idmoneda',
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            disabled: disable,
            anchor: '98%',
            autoLoad: (_this.cmbTasa) ? false : true,
            emptyText: _this.idioma.cbEmtyText
        });

        this.cmbMoneda.getStore().on('beforeload', function(st) {
            //Ext.MessageBox.wait('Cargando monedas', 'Espere' || '...');
            st.baseParams.tipotasa = (_this.documento && _this.documento.json.idtipotasa)
                ? (_this.idtipotasa ? _this.idtipotasa : _this.documento.json.idtipotasa)
                : (_this.idtipotasa ? _this.idtipotasa : _this.confFactura.tipotasa);
        });

        this.cmbMoneda.getStore().on('load', function() {
            var rd = _this.cmbMoneda.getStore().data.items;
            if (_this.accion != 'add') {
                for (var i = 0; i < rd.length; i++)
                {
                    if (rd[i].json.idmoneda == _this.documento.json.idmoneda)
                    {
                        _this.cmbMoneda.setValue(rd[i].data.idmoneda);
                        _this.cmbMoneda.originalValue = rd[i].data.idmoneda;
                        _this.cmbMoneda.setRawValue(rd[i].data.codigoiso);
                        _this.cmbMoneda.fireEvent('select', _this.cmbMoneda,
                            _this.cmbMoneda.getStore().getById(rd[i].data.idmoneda),
                            _this.cmbMoneda.getStore().indexOfId(rd[i].data.idmoneda), 1);
                        break;
                    }
                }
            }
            //Ext.MessageBox.hide();
        });

        this.cmbMoneda.on('select', function(cmb, rd, ix, p) {
            _this.monedaFactura = rd.json.codigoiso;
            if (_this.monedaFactura) {
                _this.lblImporteTotalMF.show();
            }
            if(rd.json.tasa == 0){
                mostrarMensaje(1, _this.idioma.msgNoTasaConfigurada);
                _this.cmbMoneda.setValue(_this.idmonedaanterior);
                if (_this.cmbTasa)
                    _this.cmbTasa.setValue((_this.documento && _this.documento.json.idtipotasa)
                        ? _this.documento.json.idtipotasa
                        : _this.confFactura.tipotasa);
            }else{
                if(_this.confFactura.dualidad == 1){
                    if(_this.panelProd){
                        _this.gpProd.getColumnModel().setColumnHeader(_this.gpProd.getColumnModel().getIndexById('palt'),
                            _this.idioma.cmPrecio+' '+rd.json.codigoiso);
                        _this.gpProd.getColumnModel().setColumnHeader(_this.gpProd.getColumnModel().getIndexById('ialt'),
                            _this.idioma.cmImporte+' '+rd.json.codigoiso);
                    }
                    if(_this.panelServ){
                        _this.gpServ.getColumnModel().setColumnHeader(_this.gpServ.getColumnModel().getIndexById('palt'),
                            _this.idioma.cmTarifa+' '+rd.json.codigoiso);
                        _this.gpServ.getColumnModel().setColumnHeader(_this.gpServ.getColumnModel().getIndexById('ialt'),
                            _this.idioma.cmTotal+' '+rd.json.codigoiso);
                    }
                    if (_this.panelProdServ) {
                        _this.gpProdServ.getColumnModel().setColumnHeader(_this.gpProdServ.getColumnModel().getIndexById('palt'),
                            _this.idioma.cmTarifa + ' ' + rd.json.codigoiso);
                        _this.gpProdServ.getColumnModel().setColumnHeader(_this.gpProdServ.getColumnModel().getIndexById('ialt'),
                            _this.idioma.cmTotal + ' ' + rd.json.codigoiso);
                    }
                    if (_this.pnConcp) {
                        _this.gpConceptos.getColumnModel().setColumnHeader(_this.gpConceptos.getColumnModel().getIndexById('valt'),
                            _this.idioma.cmValor + ' ' + rd.json.codigoiso);
                    }
                }else{
                    if(_this.panelProd){
                        _this.gpProd.getColumnModel().setColumnHeader(_this.gpProd.getColumnModel().getIndexById('pcont'),
                            _this.idioma.cmPrecio+' '+rd.json.codigoiso);
                        _this.gpProd.getColumnModel().setColumnHeader(_this.gpProd.getColumnModel().getIndexById('icont'),
                            _this.idioma.cmImporte+' '+rd.json.codigoiso);
                    }
                    if(_this.panelServ){
                        _this.gpServ.getColumnModel().setColumnHeader(_this.gpServ.getColumnModel().getIndexById('pcont'),
                            _this.idioma.cmTarifa+' '+rd.json.codigoiso);
                        _this.gpServ.getColumnModel().setColumnHeader(_this.gpServ.getColumnModel().getIndexById('icont'),
                            _this.idioma.cmTotal+' '+rd.json.codigoiso);
                    }
                    if (_this.panelProdServ) {
                        _this.gpProdServ.getColumnModel().setColumnHeader(_this.gpProdServ.getColumnModel().getIndexById('pcont'),
                            _this.idioma.cmTarifa + ' ' + rd.json.codigoiso);
                        _this.gpProdServ.getColumnModel().setColumnHeader(_this.gpProdServ.getColumnModel().getIndexById('icont'),
                            _this.idioma.cmTotal + ' ' + rd.json.codigoiso);
                    }
                    /*if (_this.pnConcp) {
                        _this.gpConceptos.getColumnModel().setColumnHeader(_this.gpConceptos.getColumnModel().getIndexById('vcont'),
                            _this.idioma.cmValor + ' ' + rd.json.codigoiso);
                    }*/
                }
                _this.idmoneda = rd.json.idmoneda;
                _this.tasacambio = rd.json.tasa[0].venta;
                if (_this.idmonedaanterior && _this.idmoneda != _this.idmonedaanterior) {
                    _this.factorconvercion = rd.json.tasa[0].factordeconversion;
                } else {
                    _this.factorconvercion = (_this.documento && _this.documento.json.factorconvercion) ? _this.documento.json.factorconvercion : rd.json.tasa[0].factordeconversion;

                }
                //_this.factorconvercion = (_this.documento && _this.documento.json.factorconvercion) ? _this.documento.json.factorconvercion : rd.json.tasa[0].factordeconversion;
                if (_this.txtFactorconversion) {
                    _this.txtFactorconversion.setValue(_this.factorconvercion);
                }
                if(p == undefined){
                    /*if(_this.panelProd && (_this.documento && _this.documento.json.productos > 0)){
                        _this.storeProd.load();
                    }
                    if(_this.panelServ && (_this.documento && _this.documento.json.servicios > 0)){
                        _this.storeServ.load();
                    }
                    if (_this.pnConcp && _this.documento) {
                        _this.storeConceptos.load();
                    }*/
                }
            }
        });

        this.cmbMoneda.on('beforeselect', function(cmb, rd, ix) {
            _this.idmonedaanterior = _this.idmoneda;
        });



        this.fsDatosCliente = new Ext.form.FieldSet({
            title: this.idioma.lbCliente,
            labelAlign: 'top',
            height: 130
            //defaults: {bodyStyle: 'padding:0px 0px 0px 0px'}
        });
        if(/*_this.tipoDoc != 1*/true){
            this.fsDatosGenrl = new Ext.form.FieldSet({
                title: this.idioma.tDocumento,
                labelAlign: 'top',
                height: 130
                //defaults: {bodyStyle: 'padding:0px 0px 0px 0px'}
            });
        }

        if(this.fsDatosGenrl){
            if((this.cmbSerie && !this.txtFactorconversion) || (!this.cmbSerie && this.txtFactorconversion)){
                this.frmMonedaSerie = new LOG.util.ColumnForm({columnas:2});
                if (this.cmbSerie)
                    this.frmMonedaSerie.addComponent(this.cmbSerie);
                else
                    this.frmMonedaSerie.addComponent(this.txtFactorconversion);
                this.frmMonedaSerie.addComponent(this.cmbMoneda);
                this.fsDatosGenrl.add(this.frmMonedaSerie);
            } else if (this.cmbSerie && this.txtFactorconversion) {
                this.frmMonedaSerie = new LOG.util.ColumnForm({columnas:3});
                this.frmMonedaSerie.addComponent(this.cmbSerie);
                this.frmMonedaSerie.addComponent(this.txtFactorconversion);
                this.frmMonedaSerie.addComponent(this.cmbMoneda);
                this.fsDatosGenrl.add(this.frmMonedaSerie);
            } else{
                this.fsDatosGenrl.add(this.cmbMoneda);
            }


        }

        this.frmDatosCliente = new LOG.util.ColumnForm({columnas: (_this.cmbClienteaux) ? 5 : 4});
        this.frmDatosCliente.addComponent(this.cmbCliente);
        if (_this.cmbClienteaux)
            this.frmDatosCliente.addComponent(this.cmbClienteaux);
        //this.frmDatosCliente.addComponent(this.cmbtipopedido);
        //if (this.cmbContacto)
        this.frmDatosCliente.addComponent(this.cmbContacto);
        //else
        this.frmDatosCliente.addComponent(this.cmbVendedor);
        this.frmDatosCliente.addComponent(this.cmbCondicionPago);


        /*fin probando*/
        this.cmbCondicionPago.on('select', function(cmb, rd){
            _this.dias = rd.data.plazo;
            if(_this.lblPlazo){
                var texto = _this.idioma.lblPlazo + ': ' + _this.dias + _this.idioma.lblDias;
                _this.lblPlazo.setText(texto);
            }
            if(_this.accion == 'mod'){
                var fecha = _this.documento.json.fechacontable.split('/');
                var fechaVenc = new Date(fecha[2], parseInt(fecha[1]) - 1, fecha[0]);
                fechaVenc.setSeconds(86400 * parseInt(_this.dias));
                _this.fechavencimiento = fechaVenc.format('d/m/Y');
            }
            _this.habilitarBtnProductoServ();
        });
        if(this.cmbSerie){
            this.cmbSerie.on('select', function(cmb, rd){
                _this.habilitarBtnProductoServ();
            });
        }

        if(!_this.datosComunes){
            disable = (this.documento)?((this.documento.json.estado != 1)?true:(this.documento.json.productos > 0)?true:false):false;
            var storeOperacion = new Ext.data.SimpleStore({
                fields: [
                    {
                        name: 'idoperacion'
                    },
                    {
                        name: 'denominacion'
                    }
                ]
            });
            this.cmbOperacion = new LOG.util.ComboBox({
                fieldLabel: 'Operaci\xf3n',
                store: storeOperacion,
                autoLoad: false,
                name: 'idoperacion',
                valueField: 'idoperacion',
                displayField: 'denominacion',
                disabled: true,
                editable: false,
                emptyText: _this.idioma.cbEmtyText,
                allowBlank: false
            });
            this.cmbOperacion.getStore().loadData(_this.arrayOperaciones[(_this.idsubsistema == -1) ? LOG.util.Subsistemas.facturacion : _this.idsubsistema]);
            this.cmbOperacion.setValue(_this.idoperacion);
            this.cmbCentroCosto = new LOG.util.ComboBox({
                url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarCentroCostos',
                hiddenName: 'idcliente',
                valueField: 'idcentrogrupo',
                displayField: 'text',
                mode: 'local',
                //autoLoad:true,
                pageSize: 20,
                resizable: true,
                disabled: (_this.tipoDoc == 8) ? true : false
            });
            //this.cmbCentroCosto.setDisabled(disable);
            if(_this.tipoDoc != 1 && _this.idsubsistema == LOG.util.Subsistemas.inventario){
                //this.cmbDeposito = LOG.fact.comboDeposito.combo(this.accion, this.documento, this.idioma, _this);
                this.cmbDeposito = new LOG.util.ComboBox({
                    fieldLabel: _this.idioma.lbDepositoPuntos,
                    editable: false,
                    url: 'cargarDepositos',
                    hiddenName: 'iddeposito',
                    valueField: 'iddeposito',
                    displayField: 'deposito',
                    tpl: '<tpl for="."><div style="color:{color}" class="x-combo-list-item"> <div><b>Dep\xf3sito:</b> {deposito}</div><div><b>Estado:</b> {denestado}</div> </div></tpl>',
                    otherFields: [{
                        name: 'codigo'
                    }, {
                        name: 'estado'
                    }, {
                        name: 'denestado'
                    }, {
                        name: 'color'
                    }, {
                        name: 'text'
                    }]
                });
                this.cmbDeposito.setDisabled(disable);
            }
            //this.frmDatosDocumento.addComponent(this.cmbCliente);
            this.cmbNroFactura = new LOG.util.Prototipos.inputEntero({
                fieldLabel: this.idioma.cmNoFactura,
                name: 'nrodocumento',
                disabled: true
            });
            this.frmDatosDocumento.addComponent(this.fsDatosCliente);
            this.frmDatosGNumeros = new LOG.util.ColumnForm({columnas:2});
            this.frmDatosGNumeros.addComponent(this.cmbNroFactura);

            if(_this.confFactura.factsistema == "1"){
                this.cmbNroControl = new LOG.util.Prototipos.inputTexto({
                    //autoLoad: (_this.tipoDoc == 2)?true:false,
                    fieldLabel: this.idioma.cmNoControl,
                    name: 'nrocontrol',
                    disabled: true
                });
                this.frmDatosGNumeros.addComponent(this.cmbNroControl);
            }
            if(this.fsDatosGenrl){
                this.fsDatosGenrl.add(this.frmDatosGNumeros);
                this.frmDatosDocumento.addComponent(this.fsDatosGenrl);
            }



            this.frmDatosCliente1 = new LOG.util.ColumnForm({columnas:4});
            this.frmDatosCliente1.addComponent(this.cmbCBC);
            //this.frmDatosCliente1.addComponent(this.cmbContrato);
            if (_this.cmbFormaPago)
                this.frmDatosCliente1.addComponent(this.cmbFormaPago);
            this.frmDatosCliente1.addComponent(this.txtNroContrato);
            this.frmDatosCliente1.addComponent(this.fechaContrato);
            this.fsDatosCliente.add(this.frmDatosCliente);
            this.fsDatosCliente.add(this.frmDatosCliente1);

            this.cmbCBC.on('select', function(cmb, rd){
                _this.cuentamonedacliente = new Array();
                var values = cmb.getCheckedValue().split(',');
                var storeValues = cmb.getStore().reader.arrayData;
                Ext.each(values, function(value){
                    for(var i = 0; i < storeValues.length; i++){
                        if(storeValues[i][0] == value){
                            _this.cuentamonedacliente.push({
                                idcuentacliente: value,
                                idmoneda:storeValues[i][2]
                            });
                            break;
                        }
                    }
                });

                _this.habilitarBtnProductoServ();
            });

            this.cmbCBC.on('keyup', function(cmb){
                cmb.originalValue = '';
                if (cmb.isValid()) {
                    _this.cuentamod = true;
                    _this.cuentamonedacliente = new Array();
                    _this.cuentamonedacliente.push({
                        idcuentacliente: -1,
                        idmoneda:-1,
                        cuenta: cmb.getRawValue()
                    });
                    _this.habilitarBtnProductoServ();
                }
            });

            /*this.cmbCliente.on('valuechange', function(v){
                _this.cmbContrato.getStore().load();
            });*/
            this.cmbCliente.on('select', function(cmb, rd){
                _this.idcliente = cmb.getValue();
                var condiciones = _this.getCondicionesPago(rd);
                _this.cmbCondicionPago.getStore().loadData(condiciones);
                if (_this.cmbContacto) {
                    var contactos = _this.getContactos(rd);
                    _this.cmbContacto.getStore().loadData(contactos);
                }
                var cuentas = new Array();
                if (rd) {
                    Ext.each(rd.json.cuentabancaria, function (cuenta) {
                        cuenta.numerocuentaAux = cuenta.numerocuenta + " - " + cuenta.codigoiso;
                        cuentas.push([ cuenta.idcuentabancliente,
                            cuenta.numerocuentaAux, cuenta.idmoneda
                        ]);
                    });
                } else {
                    let cuentasString = _this.documento.json.nrocuentacliente.substr(1, _this.documento.json.nrocuentacliente.length - 2).split(',');
                    Ext.each(cuentasString, function (cuenta) {
                        cuentas.push(cuenta.split('-'));
                    });
                }
                if(_this.documento == undefined /*&& _this.tipoDoc != 5*/){
                    _this.cmbCBC.reset();
                    _this.cmbCBC.enable();
                    _this.cmbCondicionPago.reset();
                    _this.cmbCondicionPago.enable();
                    if (condiciones.length > 0) {
                        let existeDefault = false;
                        if (_this.idcondicionpagodefault) {
                            Ext.each(condiciones, function (cp) {
                                if (cp[0] == _this.idcondicionpagodefault) {
                                    _this.cmbCondicionPago.setValue(_this.idcondicionpagodefault);
                                    existeDefault = true
                                }
                            })
                        }
                        if (!existeDefault)
                            _this.cmbCondicionPago.setValue(condiciones[0][0])
                    }
                    if (_this.cmbContacto){
                        _this.cmbContacto.reset();
                        _this.cmbContacto.enable();
                    }
                }else{
                    _this.cmbCBC.getStore().removeAll();
                    if(_this.documento.json.estado == 1)
                        _this.cmbCBC.enable();
                    if (_this.documento.json.idcliente == cmb.getValue()) {
                        if (_this.documento.json.cliente != 'undefined' && _this.documento.json.cliente){
                            cmb.setRawValue(_this.documento.json.cliente);
                        }
                        if (_this.documento.json.idcondicionpago) {
                            _this.cmbCondicionPago.setValue(_this.documento.json.idcondicionpago);
                            _this.cmbCondicionPago.originalValue = _this.documento.json.idcondicionpago;
                        } else {
                            if (condiciones.length > 0) {
                                let existeDefault = false;
                                if (_this.idcondicionpagodefault) {
                                    Ext.each(condiciones, function (cp) {
                                        if (cp[0] == _this.idcondicionpagodefault) {
                                            _this.cmbCondicionPago.setValue(_this.idcondicionpagodefault);
                                            existeDefault = true
                                        }
                                    })
                                }
                                if (!existeDefault)
                                    _this.cmbCondicionPago.setValue(condiciones[0][0])
                            }
                        }

                        if (_this.cmbContacto){
                            _this.cmbContacto.setValue(_this.documento.json.idcontacto);
                            _this.cmbContacto.originalValue = _this.documento.json.idcontacto;
                        }
                        _this.cmbCBC.originalValue = '';
                        _this.cmbCBC.reset();
                    } else {
                        _this.cmbCondicionPago.originalValue = '';
                        _this.cmbCondicionPago.reset();
                        if (condiciones.length > 0) {
                            let existeDefault = false;
                            if (_this.idcondicionpagodefault) {
                                Ext.each(condiciones, function (cp) {
                                    if (cp[0] == _this.idcondicionpagodefault) {
                                        _this.cmbCondicionPago.setValue(_this.idcondicionpagodefault);
                                        existeDefault = true
                                    }
                                })
                            }
                            if (!existeDefault)
                                _this.cmbCondicionPago.setValue(condiciones[0][0])
                        }
                        if (_this.cmbContacto){
                            _this.cmbContacto.originalValue = '';
                            _this.cmbContacto.reset();
                        }
                        _this.cmbCBC.originalValue = '';
                        _this.cmbCBC.reset();
                    }
                }
                _this.cmbCBC.getStore().loadData(cuentas);
                if(_this.accion != 'add'){
                    //if(_this.documento.json.idcuentacliente && cmb.getValue() == _this.documento.json.idcliente)
                    if (_this.documento.json.idcliente == cmb.getValue()){
                        _this.cmbCBC.setValue(_this.documento.json.idcuentabancliente.substr(1, _this.documento.json.idcuentabancliente.length - 2));
                        _this.cmbCBC.originalValue = _this.cmbCBC.getValue();
                        var cuentasDoc = _this.documento.json.idcuentabancliente.substr(1, _this.documento.json.idcuentabancliente.length - 2).split(',');
                        if (cuentasDoc.length > 0 && cuentasDoc[0] != ""){
                            if (cuentasDoc[0] == -1) {
                                _this.cmbCBC.getStore().removeAll();
                                let cuentasNum = _this.documento.json.numerocuenta.substr(1, _this.documento.json.numerocuenta.length - 2).split(',');
                                cuentas.push([ -1,
                                    cuentasNum[0], -1
                                ]);
                                _this.cmbCBC.getStore().loadData(cuentas);
                                _this.cmbCBC.setValue(-1);
                                _this.cmbCBC.setRawValue(cuentasNum[0]);
                                _this.cmbCBC.fireEvent('select', _this.cmbCBC,
                                    _this.cmbCBC.getStore().getById(-1),
                                    _this.cmbCBC.getStore().indexOfId(-1));
                            } else {
                                Ext.each(cuentasDoc, function (cuenta) {
                                    _this.cmbCBC.fireEvent('select', _this.cmbCBC,
                                        _this.cmbCBC.getStore().getById(cuenta),
                                        _this.cmbCBC.getStore().indexOfId(cuenta));
                                });
                            }
                        } else {
                            var idsCuentas = new Array();
                            Ext.each(cuentas, function (cuenta) {
                                idsCuentas.push(cuenta[0]);
                                _this.cmbCBC.fireEvent('select', _this.cmbCBC,
                                    _this.cmbCBC.getStore().getById(cuenta[0]),
                                    _this.cmbCBC.getStore().indexOfId(cuenta[0]));
                            });
                            _this.cmbCBC.setValue(idsCuentas);
                        }
                    }
                }else if(_this.values){
                    if(_this.values.cliente.idcuentabancliente)
                        _this.cmbCBC.setValue(_this.values.cliente.idcuentabancliente.substr(1,_this.values.cliente.idcuentabancliente.length-2));
                }else {
                    var idsCuentas = new Array();
                    Ext.each(cuentas, function (cuenta) {
                        idsCuentas.push(cuenta[0]);
                        _this.cmbCBC.fireEvent('select', _this.cmbCBC,
                            _this.cmbCBC.getStore().getById(cuenta[0]),
                            _this.cmbCBC.getStore().indexOfId(cuenta[0]));
                    });
                    _this.cmbCBC.setValue(idsCuentas);
                }
                /*_this.cmbCBC.getStore().load({
                    params:{
                        cuentas: Ext.encode(cuentas)
                    },
                    callback: function(){
                        if(_this.accion != 'add'){
                            //if(_this.documento.json.idcuentacliente && cmb.getValue() == _this.documento.json.idcliente)
                            if (_this.documento.json.idcliente == cmb.getValue()){
                                _this.cmbCBC.setValue(_this.documento.json.idcuentabancliente.substr(1, _this.documento.json.idcuentabancliente.length - 2));
                                _this.cmbCBC.originalValue = _this.cmbCBC.getValue();
                                var cuentas = _this.documento.json.idcuentabancaria.substr(1, _this.documento.json.idcuentabancaria.length - 2).split(',');
                                Ext.each(cuentas, function (cuenta) {
                                    _this.cmbCBC.fireEvent('select', _this.cmbCBC,
                                        _this.cmbCBC.getStore().getById(cuenta),
                                        _this.cmbCBC.getStore().indexOfId(cuenta));
                                });
                            }
                        }else if(_this.values){
                            if(_this.values.cliente.idcuentabancliente)
                                _this.cmbCBC.setValue(_this.values.cliente.idcuentabancliente.substr(1,_this.values.cliente.idcuentabancliente.length-2));
                        }
                    }
                });*/
                /*if (rd)
                    _this.txtNroIdentidad.setValue(rd.json.codigo);
*/
                if(_this.cmbTipoPrecio){
                    _this.cmbTipoPrecio.getStore().load({
                        params:{
                            idcliente: cmb.getValue(),
                            idsubsistema: _this.idsubsistema,
                            promedio: (_this.tipoDoc == 1) ? 0 : 1,
                            oferta: (_this.tipoDoc == 1) ? 1 : 0,
                            tipo: 1
                        },
                        callback:function(st){
                            if(_this.accion != 'ver'){
                                _this.habilitarBtnProductoServ();
                            }
                            _this.precioDefault = (st.length > 0) ? st[0].json.idtipoprecio: -2;
                        }
                    });
                    _this.cmbTipoPrecioAll.getStore().load({
                        params:{
                            idcliente: cmb.getValue(),
                            idsubsistema: _this.idsubsistema,
                            promedio: (_this.tipoDoc == 1) ? 0 : 1,
                            oferta: (_this.tipoDoc == 1) ? 1 : 0,
                            tipo: 1
                        }
                    });
                }
                if(_this.cmbTipoTarifa){
                    _this.cmbTipoTarifa.getStore().load({
                        params:{
                            idcliente: cmb.getValue(),
                            idsubsistema: _this.idsubsistema,
                            promedio: 0,
                            tipo: 2
                        },
                        callback:function(st){
                            if(_this.accion != 'ver') {
                                _this.habilitarBtnProductoServ();
                            }
                            _this.tarifaDefault = (st.length > 0) ? st[0].json.idtipoprecio: -2;
                        }
                    });
                    _this.cmbTipoTarifaAll.getStore().load({
                        params:{
                            idcliente: cmb.getValue(),
                            idsubsistema: _this.idsubsistema,
                            promedio: 0,
                            tipo: 2
                        }
                    });
                }
                _this.habilitarBtnProductoServ();
            });
            if (_this.cmbClienteaux) {
                this.cmbClienteaux.on('select', function(cmb, rd){
                    _this.idclienteauxiliar = cmb.getValue();
                    _this.idclienteauxiliarpadre = rd.json.idpadre;
                });
            }

        }else{
            if(this.cmbSerie)
                this.frmDatosDocumento.addComponent(this.cmbSerie);
        }
        //this.frmDatosDocumento.getColumn(0).columnWidth = 0.25;
        if(/*_this.tipoDoc == 1*/false){
            this.frmDatosDocumento.getColumn(0).columnWidth = 1;
        }else{
            if(!_this.datosComunes){
                this.frmDatosDocumento.getColumn(0).columnWidth = 0.75;
                this.frmDatosDocumento.getColumn(1).columnWidth = 0.25;
            }else{
                this.frmDatosDocumento.getColumn(0).columnWidth = 0.38;
            }
        }
        if(!_this.datosComunes){
            //this.frmDatosDocumento.getColumn(0).getComponent(0).anchor = '96%';
            if (_this.cmbClienteaux) {
                this.frmDatosCliente.getColumn(0).columnWidth = 0.30;
                this.frmDatosCliente.getColumn(1).columnWidth = 0.30;
                this.frmDatosCliente.getColumn(2).columnWidth = 0.15;
                this.frmDatosCliente.getColumn(3).columnWidth = 0.15;
                this.frmDatosCliente.getColumn(4).columnWidth = 0.10;

                this.frmDatosCliente.getColumn(0).getComponent(0).anchor = '97%';
                this.frmDatosCliente.getColumn(1).getComponent(0).anchor = '97%';
                this.frmDatosCliente.getColumn(2).getComponent(0).anchor = '95%';
                this.frmDatosCliente.getColumn(3).getComponent(0).anchor = '95%';
                this.frmDatosCliente.getColumn(4).getComponent(0).anchor = '95%';


            } else {
                this.frmDatosCliente.getColumn(0).columnWidth = 0.40;
                this.frmDatosCliente.getColumn(1).columnWidth = 0.20;
                this.frmDatosCliente.getColumn(2).columnWidth = 0.20;
                this.frmDatosCliente.getColumn(3).columnWidth = 0.20;
                this.frmDatosCliente.getColumn(0).getComponent(0).anchor = '97%';
                this.frmDatosCliente.getColumn(1).getComponent(0).anchor = '95%';
                this.frmDatosCliente.getColumn(2).getComponent(0).anchor = '95%';
                this.frmDatosCliente.getColumn(3).getComponent(0).anchor = '95%';
            }

            if (_this.cmbFormaPago) {
                this.frmDatosCliente1.getColumn(0).columnWidth = 0.30;
                this.frmDatosCliente1.getColumn(1).columnWidth = 0.25;
                this.frmDatosCliente1.getColumn(2).columnWidth = 0.25;
                this.frmDatosCliente1.getColumn(3).columnWidth = 0.20;
                this.frmDatosCliente1.getColumn(0).getComponent(0).anchor = '97%';
                this.frmDatosCliente1.getColumn(1).getComponent(0).anchor = '95%';
                this.frmDatosCliente1.getColumn(2).getComponent(0).anchor = '95%';
                this.frmDatosCliente1.getColumn(3).getComponent(0).anchor = '97%';
            } else {
                this.frmDatosCliente1.getColumn(0).columnWidth = 0.40;
                this.frmDatosCliente1.getColumn(1).columnWidth = 0.30;
                this.frmDatosCliente1.getColumn(2).columnWidth = 0.30;
                this.frmDatosCliente1.getColumn(0).getComponent(0).anchor = '97%';
                this.frmDatosCliente1.getColumn(1).getComponent(0).anchor = '95%';
                this.frmDatosCliente1.getColumn(2).getComponent(0).anchor = '97%';
            }

            if(_this.confFactura.factsistema == "1"){
                this.frmDatosGNumeros.getColumn(0).getComponent(0).anchor = '95%';
                this.frmDatosGNumeros.getColumn(1).getComponent(0).anchor = '97%';
            }else{
                this.frmDatosGNumeros.getColumn(0).columnWidth = 1;
            }
            if(this.frmMonedaSerie){
                this.frmMonedaSerie.getColumn(0).getComponent(0).anchor = '95%';
            }
        }else{
            //this.frmDatosDocumento.getColumn(0).getComponent(0).anchor = '96%';
            if(_this.confFactura.utilizarserie == 1)
                this.frmDatosDocumento.getColumn(0).getComponent(0).anchor = '97%';
        }


        this.pDatosDocumento = LOG.util.UIManager.initPanel({
            items: [
                this.frmDatosDocumento,
                {
                    layout: 'hbox',
                    labelWidth: 130,
                    items: _this.crearCheckBoxs()
                }
            ]
        });
        return this.pDatosDocumento;
    },
    getCondicionesPago: function(record){
        var _this = this;
        var arrayCond = new Array();
        if(record != undefined){
            if (record.json != undefined && record.json.cobrospagos) {
                Ext.each(record.json.cobrospagos, function (cond) {
                    if (cond.idterminodepago != null && parseInt(cond.idclasificacion) == 1 && !_this.estaTermino(cond.idterminodepago, arrayCond)) {
                        arrayCond.push([cond.idterminodepago, cond.nombreterminodepago, cond.plazo]);
                    }
                });
            }
        } else {
            if (_this.documento != undefined) {
                arrayCond.push([
                    _this.documento.json.idcondicionpago,
                    _this.documento.json.condicionpago,
                    _this.documento.json.dias]);
            }
        }
        arrayCond.push([-1, 'S/D', 0]);
        _this.arrayCondiciones = arrayCond;
        return arrayCond;
    },
    getContactos: function(record){
        var _this = this;
        var arrayCont = new Array();
        if (record != undefined) {
            if(record.json && record.json.contactos){
                Ext.each(record.json.contactos, function (cont) {
                    arrayCont.push([cont.idcontacto, cont.nombre]);
                });
            }
        }
        return arrayCont;
    },
    estaTermino: function(termino, array){
        for(var i = 0; i < array.length; i++){
           if(array[i][0] == termino){
               return true;
           }
        }
        return false;
    },
    createPnDatosTransporte: function() {
        var _this = this;
        var documentoOrigen = false
        if (this.tipoDoc == 4 ||
            this.tipoDoc == 5 ||
            this.tipoDoc == 7 ||
            this.tipoDoc == 8 || (this.documento && this.documento.json.docorigen)) {
            documentoOrigen = true;
        }
        this.frmTransporteOtros = (_this.tipoDoc != 1)
            ?((!_this.datosComunes)?new LOG.util.ColumnForm({columnas: ((documentoOrigen)?3:2)}):LOG.util.UIManager.initPanel({
             }))
            :new LOG.util.ColumnForm({
                columnas: 2
        });
        if(_this.tipoDoc != 1){
            var pos = (_this.datosComunes) ? 1 : 2;
            this.cmbOrganTransp = new Ext.form.TriggerField({
                fieldLabel: this.idioma.lbOrganizacionTransporte,
                name: 'nombretransp',
                triggerClass: 'x-form-cliente-trigger',
                editable: false,
                emptyText: _this.idioma.cbEmtyText,
                width: 50,
                tabular:true,
                listeners: {
                    onSelect: function(record) {
                        if (record.combo.isDirty())
                        {

                        }
                        else
                            record.combo.setValue("");
                    }
                }
            });
            this.txtfNombreConductor = LOG.util.Prototipos.inputTexto({
                fieldLabel: this.idioma.lbNombreConductor,
                name: 'nombreconductor',
                enableKeyEvents: true,
                regex: LOG.util.Regex.nombre,
                maxLength: '100',
                regexText: this.idioma.lbSoloLetras
            });
            this.txtfIdenConductor = LOG.util.Prototipos.inputTexto({
                fieldLabel: this.idioma.lbNroIdentidadConductor,
                name: 'identificadorconductor',
                maxLength: '11',
                minLength: '6',
                minLengthText: this.idioma.lbMinTexIdentidadConductor,
                maxLengthText: this.idioma.lbMaxTexIdentidadConductor,
                regex: /^([A-Z0-9]*)([-\s.]?[A-Z0-9])*$/,
                regexText: this.idioma.lbCIconductor,
                enableKeyEvents: true
            });

            this.cmbOrganTransp.onTriggerClick = function(e) {
                if (!_this.cmbOrganTransp.disabled)
                    _this.showClientesEstructuras();//.Inicializar();
            };

            this.viaTransporte = new LOG.util.ComboBox({
                fieldLabel: _this.idioma.lbCbViaTransporte,
                name: 'viatransporte',
                triggerAction: 'all',
                editable: false,
                mode: 'local',
                anchor: '98%',
                value: ((_this.accion == 'add')?4:_this.documento.json.viatransporte),
                originalValue: ((_this.accion == 'add')?4:_this.documento.json.viatransporte),
                store: new Ext.data.SimpleStore({
                    fields: ['viatransporte', 'nomb_viatransporte'],
                    data: [
                        [1, _this.idioma.lbStFerroviaria],
                        [2, _this.idioma.lbStMaritima],
                        [3, _this.idioma.lbStAerea],
                        [4, _this.idioma.lbStTerrestre]
                    ]
                }),
                valueField: 'viatransporte',
                displayField: 'nomb_viatransporte',
                allowBlank: false,
                listeners: {
                    select: function(cb, r, i){
                        if(cb.getValue() == 2){
                            _this.txtfCartaPorte.setVisible(false);
                            _this.txtfCartaPorte.setValue();
                            _this.txtfMatriculaVehiculo.setValue();
                            _this.changeLabel('idmatriculavehiculo', _this.idioma.lbNroEmbarque);
                        }else if(cb.getValue() == 3){
                            _this.txtfCartaPorte.setVisible(false);
                            _this.txtfCartaPorte.setValue();
                            _this.txtfMatriculaVehiculo.setValue();
                            _this.changeLabel('idmatriculavehiculo', _this.idioma.lbNroGuiaAerea);
                        }else if(cb.getValue() == 4){
                            _this.txtfCartaPorte.setVisible(true);
                            if(_this.documento)
                                _this.txtfCartaPorte.setValue(_this.documento.json.cartaporte);
                            else
                                _this.txtfCartaPorte.setValue();
                            _this.txtfMatriculaVehiculo.setValue();
                            _this.changeLabel('idmatriculavehiculo', _this.idioma.lbMatriculaVehiculo);
                        }else{
                            _this.txtfCartaPorte.setVisible(false);
                            _this.txtfCartaPorte.setValue();
                            _this.txtfMatriculaVehiculo.setValue();
                            _this.changeLabel('idmatriculavehiculo', _this.idioma.lbNroCasilla);
                        }
                    }
                }
            });

            this.txtfMatriculaVehiculo = LOG.util.Prototipos.inputTexto({
                name: 'matriculavehiculo',
                id: 'idmatriculavehiculo',
                fieldLabel: this.idioma.lbMatriculaVehiculo,
                enableKeyEvents: true,
                //maxLength: '10',
                minLength: '5',
                /*regex: /^[\w]+$/,
                regexText: this.idioma.lbAlfanumericos*/
            });

            this.txtfCartaPorte = LOG.util.Prototipos.inputTexto({
                fieldLabel: this.idioma.lbNroCartaPorte,
                name: 'cartaporte',
                /*maxLength: '10',*/
                minLength: '5',
                /*minLengthText: this.idioma.lbMinTexIdentidadConductor,
                maxLengthText: this.idioma.lbMaxTexIdentidadConductor,*/
                enableKeyEvents: true
            });

            this.txtfBultos = LOG.util.Prototipos.inputEntero({
                fieldLabel: 'Bultos',
                name: 'bultos',
                /*maxLength: '10',
                minLength: '5',*/
                /*minLengthText: this.idioma.lbMinTexIdentidadConductor,
                maxLengthText: this.idioma.lbMaxTexIdentidadConductor,*/
                enableKeyEvents: true
            });

            this.txtfSellos = LOG.util.Prototipos.inputTexto({
                name: 'sellos',
                fieldLabel: 'Sellos',
                enableKeyEvents: true,
                /*maxLength: '10',
                minLength: '5',
                regex: /^[\w]+$/,
                regexText: this.idioma.lbAlfanumericos*/
            });
            this.txtfOrden = LOG.util.Prototipos.inputTexto({
                name: 'nrorden',
                fieldLabel: 'Orden',
                enableKeyEvents: true,
                /*maxLength: '10',
                minLength: '5',
                regex: /^[\w]+$/,
                regexText: this.idioma.lbAlfanumericos*/
            });

            this.txtfContenedor = LOG.util.Prototipos.inputTexto({
                name: 'contenedor',
                fieldLabel: 'Contenedor',
                enableKeyEvents: true,
                /*maxLength: '10',
                minLength: '5',
                regex: /^[\w]+$/,
                regexText: this.idioma.lbAlfanumericos*/
            });

            this.txtfLicencia = LOG.util.Prototipos.inputTexto({
                name: 'licencia',
                fieldLabel: 'Licencia',
                enableKeyEvents: true,
                /*maxLength: '10',
                minLength: '5',
                regex: /^[\w]+$/,
                regexText: this.idioma.lbAlfanumericos*/
            });

            this.txtfDestinoComercial = LOG.util.Prototipos.inputTexto({
                name: 'destinocomercial',
                fieldLabel: 'Destino comercial',
                enableKeyEvents: true,
                /*maxLength: '10',
                minLength: '5',
                regex: /^[\w]+$/,
                regexText: this.idioma.lbAlfanumericos*/
            });

            this.txtfProdGenerico = LOG.util.Prototipos.inputTexto({
                name: 'prodgenerico',
                fieldLabel: 'Producto gen\xe9rico',
                enableKeyEvents: true,
                /*maxLength: '10',
                minLength: '5',
                regex: /^[\w]+$/,
                regexText: this.idioma.lbAlfanumericos*/
            });

            this.txtfPuertoDestino = LOG.util.Prototipos.inputTexto({
                name: 'puertodestino',
                fieldLabel: 'Puerto destino',
                enableKeyEvents: true,
                /*maxLength: '10',
                minLength: '5',
                regex: /^[\w]+$/,
                regexText: this.idioma.lbAlfanumericos*/
            });

            this.txtfBL = LOG.util.Prototipos.inputTexto({
                name: 'bl',
                fieldLabel: 'BL',
                enableKeyEvents: true,
                /*maxLength: '10',
                minLength: '5',
                regex: /^[\w]+$/,
                regexText: this.idioma.lbAlfanumericos*/
            });

            this.txtAObservaciones = new Ext.form.TextArea({
                fieldLabel: this.idioma.lbTextObservaciones,
                anchor: '100% -3',
                enableKeyEvents: true,
                //maxLength: '255',
                minLength: '2',
                height: 130
            });
            this.fsDatosTransporte = new Ext.form.FieldSet({
                title: this.idioma.tDatosTransportador,
                labelAlign: 'top',
                height: 150,
                autoScroll: true,
                defaults: {bodyStyle: 'padding:0px 0px 0px 0px'}
            });

            this.frmDatosTransporte = new LOG.util.ColumnForm({columnas: 5});

            this.frmDatosTransporte.addComponent(this.cmbOrganTransp);
            this.frmDatosTransporte.addComponent(this.txtfNombreConductor);
            this.frmDatosTransporte.addComponent(this.txtfIdenConductor);
            this.frmDatosTransporte.addComponent(this.txtfLicencia);
            this.frmDatosTransporte.addComponent(this.txtfContenedor);

            this.frmDatosTransporte.addComponent(this.viaTransporte);
            this.frmDatosTransporte.addComponent(this.txtfMatriculaVehiculo);
            this.frmDatosTransporte.addComponent(this.txtfCartaPorte);
            this.frmDatosTransporte.addComponent(this.txtfBultos);
            this.frmDatosTransporte.addComponent(this.txtfSellos);
            this.frmDatosTransporte.addComponent(this.txtfOrden);

            this.frmDatosTransporte.addComponent(this.txtfDestinoComercial);
            this.frmDatosTransporte.addComponent(this.txtfProdGenerico);
            this.frmDatosTransporte.addComponent(this.txtfPuertoDestino);
            this.frmDatosTransporte.addComponent(this.txtfBL);

            this.frmDatosTransporte.getColumn(0).columnWidth = 0.25;
            this.frmDatosTransporte.getColumn(1).columnWidth = 0.25;
            /*this.frmDatosTransporte.getColumn(2).columnWidth = 0.25;*/
            this.frmDatosTransporte.getColumn(3).columnWidth = 0.15;
            this.frmDatosTransporte.getColumn(4).columnWidth = 0.15;

            this.frmDatosTransporte.getColumn(2).getComponent(0).anchor = '97%';
            this.frmDatosTransporte.getColumn(2).getComponent(1).anchor = '97%';
            this.frmDatosTransporte.getColumn(3).getComponent(0).anchor = '97%';
            this.frmDatosTransporte.getColumn(3).getComponent(1).anchor = '97%';

            this.fsDatosTransporte.add(this.frmDatosTransporte);
            if(!_this.datosComunes){
                this.frmTransporteOtros.addComponent(this.fsDatosTransporte);
                if(documentoOrigen){
                    this.frmTransporteOtros.addComponent(_this.createPnDatosDocOrigen());
                }
                this.frmTransporteOtros.addComponent(this.txtAObservaciones);
                if(documentoOrigen){
                    this.frmTransporteOtros.getColumn(0).columnWidth = /*0.73*/0.46;
                    this.frmTransporteOtros.getColumn(1).columnWidth = 0.27;
                    this.frmTransporteOtros.getColumn(2).columnWidth = 0.27;

                    this.frmDatosTransporte.getColumn(1).getComponent(0).anchor = '97%';
                    this.frmDatosTransporte.getColumn(2).getComponent(0).anchor = '97%';
                }else{
                    this.frmTransporteOtros.getColumn(0).columnWidth = 0.60;
                    this.frmTransporteOtros.getColumn(1).columnWidth = 0.40;
                }
            }else{
                this.frmTransporteOtros.add(this.fsDatosTransporte);
            }
        }else{
            this.txtNombreContacto = LOG.util.Prototipos.inputTexto({
                name: 'nombrecontacto',
                fieldLabel: 'Nombre y apellidos',
                enableKeyEvents: true,
            });
            this.txtCiContacto = LOG.util.Prototipos.inputTexto({
                name: 'cicontacto',
                fieldLabel: 'C.Identidad',
                enableKeyEvents: true,
                maxLength: 11,
                regex: LOG.util.Regex.carnet,
                regexText: this.idioma.msgCarnetIncorrecto,
            });
            this.txtTelefono = LOG.util.Prototipos.inputTexto({
                name: 'telfcontacto',
                fieldLabel: 'Tel\xe9fono',
                enableKeyEvents: true,
                regex: /^[0-9,\-\s]+[0-9]$/,
                regexText: 'Solo se admiten n\xfameros separados por espacio, coma o gui\xf3n medio'
            });
            this.frmDatosContacto = new LOG.util.ColumnForm({columnas: 1});
            this.frmDatosContactoAux = new LOG.util.ColumnForm({columnas: 2});
            this.frmDatosContacto.addComponent(this.txtNombreContacto);
            this.frmDatosContactoAux.addComponent(this.txtCiContacto);
            this.frmDatosContactoAux.addComponent(this.txtTelefono);
            this.frmDatosContacto.addComponent(this.frmDatosContactoAux);

            this.fsDatosContacto = new Ext.form.FieldSet({
                title: 'Datos de contacto',
                labelAlign: 'top',
                height: 150,
                autoScroll: true,
                defaults: {bodyStyle: 'padding:0px 0px 0px 0px'}
            });

            this.fsDatosContacto.add(this.frmDatosContacto);

            this.txtAObservaciones = new Ext.form.TextArea({
                fieldLabel: this.idioma.lbTextObservaciones,
                anchor: '100% -3',
                enableKeyEvents: true,
                //maxLength: '255',
                minLength: '2',
                height: 130
            });
            this.frmTransporteOtros.addComponent(this.fsDatosContacto);
            this.frmTransporteOtros.addComponent(this.txtAObservaciones);

            this.frmDatosContacto.getColumn(0).columnWidth = 1.0;
            this.frmDatosContacto.getColumn(0).getComponent(0).anchor = '97%';

            this.frmTransporteOtros.getColumn(0).columnWidth = 0.3;
            this.frmTransporteOtros.getColumn(1).columnWidth = 0.7;
        }
        this.pDatosTransporteOtros = LOG.util.UIManager.initPanel({
            items: [
                this.frmTransporteOtros
            ]
        });
        return this.pDatosTransporteOtros;
    },
    changeLabel: function(id, newLabel){
        var _this = this;
        var label = Ext.DomQuery.select(String.format('label[for="{0}"]', id));
        if (label){
            label[0].childNodes[0].nodeValue = newLabel;
        }
    },
    createPnOtrosDatos: function(textArea) {
        var _this = this;
        this.txtAObservaciones = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbTextObservaciones,
            anchor: '100% 1',
            enableKeyEvents: true,
            //maxLength: '255',
            minLength: '2'
        });
        this.frmOtrosDatos = new Ext.form.FieldSet({
            height: 135,
            border: false,
            labelAlign: 'top',
            items: [this.txtAObservaciones]

        });

        return this.frmOtrosDatos;
    },
    createPnDatosDocOrigen: function() {
        var _this = this;
        var datosLabel = {};
        if(_this.accion == 'add'){
            if(_this.values.cliente && _this.values.cliente.documentos.length == 1){
                if(_this.tipoDoc == 4){
                    datosLabel.label1 = _this.idioma.lblTipoDocumento + LOG.lb.documento.TipoDistribucion[_this.values.cliente.tipoDocumento[0]];
                }else if(_this.tipoDoc == 5 || _this.tipoDoc == 7 || _this.tipoDoc == 8){
                    datosLabel.label1 = _this.idioma.lblTipoDocumento + _this.values.cliente.tipoDocumento[0];
                }
                datosLabel.label2 = _this.idioma.lblNumeroDocumento + _this.values.cliente.nroDocumento[0];
                datosLabel.label3 = _this.idioma.lblFechaEmision + _this.values.cliente.fechaDocumento[0];
            }else{
                var contador = 0;
                Ext.each(_this.values.cliente.tipoDocumento,function(sel){
                    switch (sel){
                        case '1':
                            if(!datosLabel.label1){
                                datosLabel.label1 = LOG.lb.documento.TipoDistribucion[1]+': '+ _this.values.cliente.nroDocumento[contador]+'('+_this.values.cliente.fechaDocumento[contador]+')';
                            }else{
                                datosLabel.label1 += ', '+_this.values.cliente.nroDocumento[contador]+'('+_this.values.cliente.fechaDocumento[contador]+')';
                            }
                            contador++;
                            break;
                        case '2':
                            if(!datosLabel.label2){
                                datosLabel.label2 = LOG.lb.documento.TipoDistribucion[2]+': '+_this.values.cliente.nroDocumento[contador]+'('+_this.values.cliente.fechaDocumento[contador]+')';
                            }else{
                                datosLabel.label2 += ', '+_this.values.cliente.nroDocumento[contador]+'('+_this.values.cliente.fechaDocumento[contador]+')';
                            }
                            contador++;
                            break;
                        case '3':
                            if(!datosLabel.label3){
                                datosLabel.label3 = LOG.lb.documento.TipoDistribucion[3]+': '+ _this.values.cliente.nroDocumento[contador]+'('+_this.values.cliente.fechaDocumento[contador]+')';
                            }else{
                                datosLabel.label3 += ', '+_this.values.cliente.nroDocumento[contador]+'('+_this.values.cliente.fechaDocumento[contador]+')';
                            }
                            contador++;
                            break;
                        default :
                            if(!datosLabel.label1){
                                datosLabel.label1 = _this.values.cliente.tipoDocumento[contador]+': '+ _this.values.cliente.nroDocumento[contador]+'('+_this.values.cliente.fechaDocumento[contador]+')';
                            }else{
                                datosLabel.label1 += ', '+_this.values.cliente.nroDocumento[contador]+'('+_this.values.cliente.fechaDocumento[contador]+')';
                            }
                            contador++;
                            break;

                    }
                })
            }
        }else{
            if(_this.documento.json.datosdocorigen){
                if(_this.documento.json.datosdocorigen.length == 1){
                    datosLabel.label1 = _this.idioma.lblTipoDocumento + ((_this.documento.json.tipodocorigen!=1)?_this.documento.json.tipodocorigen:_this.idioma.tipoDocOferta);
                    datosLabel.label2 = _this.idioma.lblNumeroDocumento + _this.documento.json.datosdocorigen[0].nrodoc;
                    datosLabel.label3 = _this.idioma.lblFechaEmision + _this.documento.json.datosdocorigen[0].fechaemision;
                    if (_this.documento.json.nombrecontacto && _this.documento.json.nombrecontacto.length > 1) {
                        datosLabel.label1 = _this.idioma.lblTipoDocumento + _this.documento.json.tipodocorigen
                            +' '+_this.idioma.lblNumeroDocumento + _this.documento.json.datosdocorigen[0].nrodoc+ ' '
                            +_this.idioma.lblFechaEmision + _this.documento.json.datosdocorigen[0].fechaemision;
                        datosLabel.label2 = 'Nombre y apellidos: '+_this.documento.json.nombrecontacto;
                        datosLabel.label3 = 'C. Identidad: '+_this.documento.json.cicontacto+' Tel\xe9fono: '+_this.documento.json.telfcontacto;
                    }
                }else{
                    var contador = 0;
                    Ext.each(_this.documento.json.datosdocorigen,function(sel){
                        //hay que implementar el caso de las distribuciones
                        switch (sel){
                            default :
                                if(!datosLabel.label1){
                                    datosLabel.label1 = _this.documento.json.tipodocorigen+': '+ _this.documento.json.datosdocorigen[contador].nrodoc+'('+_this.documento.json.datosdocorigen[contador].fechaemision+')';
                                }else{
                                    datosLabel.label1 += ', '+_this.documento.json.datosdocorigen[contador].nrodoc+'('+_this.documento.json.datosdocorigen[contador].fechaemision+')';
                                }
                                contador++;
                                break;

                        }
                    })
                }
            }
        }
        var arrayItems = new Array();
        if(datosLabel.label1){
            _this.label1 = {html: '<p style="padding-top: 0px">'+datosLabel.label1+'</p>'};
            arrayItems.push(_this.label1);
        }
        if(datosLabel.label2){
            _this.label2 = {html: '<p style="padding-top: 25px">'+datosLabel.label2+'</p>'};
            arrayItems.push(_this.label2);
        }
        if(datosLabel.label3){
            _this.label3 = {html: '<p style="padding-top: 25px">'+datosLabel.label3+'</p>'};
            arrayItems.push(_this.label3);
        }
        this.fieldsetDatosDocOrigen = new Ext.form.FieldSet({
            layout: 'column',
            title: _this.idioma.tDatosDocOrigen,
            height: 150,
            defaults: {
                border: false,
                layout: 'form'
            },
            items: [
                {
                    columnWidth:.80,
                    items: arrayItems
                }
            ]

        });

        return this.fieldsetDatosDocOrigen;
    }
    ,
    createTbCenter: function() {
        var _this = this;
        var items = new Array();
        if(_this.accion == 'add'){
            if(!_this.datosComunes){
                if(_this.values){
                    if(_this.values.productos > 0){
                        items.push(this.createPnProducto());
                    }
                    if((_this.values.servicios > 0 || _this.tipoDoc == 4) && (true/*_this.idsubsistema != LOG.util.Subsistemas.inventario*/ || _this.tipoDoc == 1)){
                        items.push(this.createPnServicio());
                    }
                }else{
                        if(_this.idsubsistema == -1){
                            if(_this.manualproductos){
                                items.push(this.createPnProducto());
                            }
                        }
                        else{
                            items.push(this.createPnProducto());
                        }
                        if(true/*_this.idsubsistema != LOG.util.Subsistemas.inventario*/ || _this.tipoDoc == 1)
                            items.push(this.createPnServicio());
                }
            }else{
                var itemsOtros = new Array();
                var pnTransp = this.createPnDatosTransporte();
                if(pnTransp){
                    itemsOtros.push({
                        layout:'fit',
                        region: 'center',
                        items:pnTransp
                    });
                }
                itemsOtros.push({
                    layout:'fit',
                    region: (pnTransp) ? 'south' : 'center',
                    items:this.createPnOtrosDatos()
                });
                this.panelDatosTransp = LOG.util.UIManager.initPanel({
                    title: this.idioma.tOtros,
                    frame: true,
                    layout: 'border',
                    items:itemsOtros
                });
                items = [this.panelDatosTransp];
            }
        }else{
            if(_this.documento.data.estado == 1){
                if (_this.idsubsistema == -1) {
                    if (_this.manualproductos) {
                        items.push(this.createPnProducto());
                    }
                } else if (_this.idsubsistema == LOG.util.Subsistemas.activosfijos) {
                    if(_this.documento.json.alquiler == 0)
                        items.push(this.createPnProducto());
                } else {
                    items.push(this.createPnProducto());
                }
                if(true/*_this.idsubsistema != LOG.util.Subsistemas.inventario*/ || _this.tipoDoc == 1){
                    if (_this.idsubsistema == LOG.util.Subsistemas.activosfijos) {
                        if (_this.documento.json.alquiler == 1)
                            items.push(this.createPnServicio());
                    }else{
                        items.push(this.createPnServicio());
                    }
                }
            }else{
                if(_this.documento.data.productos > 0)
                    items.push(this.createPnProducto());
                if(_this.documento.data.servicios > 0)
                    items.push(this.createPnServicio());
            }
        }
        this.tbCenter = new Ext.TabPanel({
            activeTab: (_this.accion == 'add')?0:
                ((_this.documento.data.productos == 0 && _this.documento.data.servicios > 0)?((_this.documento.data.estado == 1)?((_this.documento.json.alquiler == 0 && _this.manualproductos) ? 1 :0):0)
                    :0),
            region: 'center',
            border: false,
            items:items
        });
        this.listColConceptos = new LOG.util.List();

        this.listColConceptos.add({
            dataIndex: 'idcategoriafactura'
        });
        this.listColConceptos.add({
            dataIndex: 'idcategoriaprecio'
        });
        this.listColConceptos.add({
            header: this.idioma.cmConcepto,
            dataIndex: 'denominacion',
            default: true,
            width: 150
        });
        var codigosiso = new Array();

        _this.listColConceptos.add({
            dataIndex: 'valor' + _this.confFactura.monedas.codigoiso.toLowerCase(),
            header: _this.idioma.cmValor/* + ' ' + _this.confFactura.monedas.codigoiso*/,
            id: 'vcont',
            default: true,
            width: 100,
            align: 'right',
            editor: LOG.util.Prototipos.inputDecimal({
                listeners: {
                    focus: function(t) {
                        t.selectText(0, t.getValue().length);
                    }
                }
            }),
            renderer : function(value, metaData){
                if (value) {
                    return value;
                } else {
                    return 0;
                }
            }
        });

        _this.listColConceptos.add({
            dataIndex: 'isomoneda',
            header: 'Moneda',
            default: true,
            width: 60/*,
            renderer : function(value, metaData){
                if (value) {
                    return value;
                } else {
                    return 0;
                }
            }*/
        });

        if(alternativa){
            _this.listColConceptos.add({
                dataIndex: 'valor' + _this.confFactura.monedas.codigoisoalt.toLowerCase(),
                header: _this.idioma.cmValor + ' ' + _this.confFactura.monedas.codigoisoalt,
                id: 'valt',
                default: true,
                width: 60,
                editor: LOG.util.Prototipos.inputDecimal({
                    listeners: {
                        focus: function(t) {
                            t.selectText(0, t.getValue().length);
                        }
                    }
                }),
                renderer : function(value, metaData){
                    if (value) {
                        return value;
                    } else {
                        return 0;
                    }
                }
            });
        }
        _this.checkColumnBI = new LOG.grid.CheckColumn({
            header: 'BI',
            dataIndex: 'bi',
            width: 40,
            align: 'center',
            rowSelection: true,
            value: false
        });
        _this.listColConceptos.add(_this.checkColumnBI);
        _this.checkColumnApl = new LOG.grid.CheckColumn({
            header: 'Aplicar',
            dataIndex: 'aplicar',
            width: 80,
            align: 'center',
            rowSelection: true,
            value: false
        });
        _this.listColConceptos.add(_this.checkColumnApl);
        _this.checkNoExt = new LOG.grid.CheckColumn({
            header: 'Exento de pago exterior',
            dataIndex: 'noexterior',
            width: 120,
            align: 'center',
            rowSelection: true,
            value: false
        });
        _this.listColConceptos.add(_this.checkNoExt);
        /*Ext.each(_this.confFactura.monedas, function(dato){
            if(dato.contable || dato.alternativa) {
                if (!_this.in_array(dato.codigoiso, codigosiso, 'codigosiso')) {
                    _this.listColConceptos.add({
                        dataIndex: 'valor' + dato.codigoiso.toLowerCase(),
                        header: _this.idioma.cmValor + ' ' + dato.codigoiso,
                        id: (dato.contable) ? 'vcont' : 'valt',
                        default: true,
                        width: 60,
                        editor: LOG.util.Prototipos.inputDecimal({
                            listeners: {
                                focus: function(t) {
                                    t.selectText(0, t.getValue().length);
                                }
                            }
                        }),
                        renderer : function(value, metaData){
                            if (value) {
                                return value;
                            } else {
                                return 0;
                            }
                        }
                    });
                }
            }
        });*/
        this.listColConceptos.add({
            dataIndex: 'idcuenta'
        });
        this.listColConceptos.add({
            dataIndex: 'concepto'
        });
        this.listColConceptos.add({
            dataIndex: 'codigo'
        });
        this.listColConceptos.add({
            dataIndex: 'descripcion',
            header: this.idioma.Cuenta,
            default: true,
            width: 100,
            editor: new Ext.erp.comboNomenclador({
                controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
                modelo: 'NomClasificacioncontablelog',
                idnom: 'idclasificacioncontable',
                bussines: 'NomClasificacioncontableFactModel',
                name: 'denominacion',
                autoCargar: true,
                //allowBlank: false
            }),
            renderer: function(v, m, rd) {
                var cuentas = this.editor.getStore().data.items;
                if (v) {
                    if (this.editor.isDirty()) {
                        for (var i = 0; i < cuentas.length; i++) {
                            if (cuentas[i].data.idclasificacioncontable == this.editor.getValue()) {
                                rd.set('idcuenta', this.editor.getValue());
                                return cuentas[i].data.denominacion;
                            }
                        }
                    }
                }
                for (var i = 0; i < cuentas.length; i++) {
                    if (cuentas[i].data.idclasificacioncontable == rd.data.idcuenta) {
                        return cuentas[i].data.denominacion;
                    }
                }
                return '';
            }
        });
        this.listColConceptos.add({
            dataIndex: 'concepto'
        });
        this.listColConceptos.add({
            dataIndex: 'condicionpago',
            header: 'Condici\xf3n de pago',
            default: true,
            width: 150,
            editor: new LOG.util.ComboBox({
                store: new Ext.data.SimpleStore({
                    fields: [
                        {
                            name: 'idcondicionpago'
                        },
                        {
                            name: 'condicionpago'
                        },
                        {
                            name: 'plazo'
                        }
                    ]
                }),
                autoLoad: false,
                valueField: 'condicionpago',
                displayField: 'condicionpago',
                editable: false,
                listeners: {
                    select: function (cmb, rd) {
                        cmb.setValue(rd.data.condicionpago);
                        _this.gpConceptos.getSelectionModel().getSelected().data.idcondicionpago = rd.data.idcondicionpago;
                        _this.gpConceptos.getSelectionModel().getSelected().data.idcliente = _this.cmbCliente.getValue();
                    }
                }
            })
        });
        this.listColConceptos.add({
            dataIndex: 'idcondicionpago'
        });
        this.listColConceptos.add({
            dataIndex: 'idcliente'
        });
        this.listColConceptos.add({
            dataIndex: 'porciento',
            width: 80,
            header: this.idioma.cmPorcentual,
            renderer : function(value, metaData){
                if (value == 1) {
                    metaData.css = 'icondistra-aceptar verde';
                } else {
                    metaData.css = 'icondistra-cancelar rojo';
                }
            },
            default: true
        });
        this.smGridConceptos = LOG.util.UIManager.initSelectionModel(2, true);
        this.smGridConceptos.moveEditorOnEnter = false;

        var cls = LOG.util.UIManager.proccessColumns(this.listColConceptos);
        this.cmGridConceptos = new Ext.grid.ColumnModel(cls.columns);
        this.recStGridConceptos = Ext.data.Record.create(cls.fields);
        this.storeConceptos = new Ext.data.Store({
            autoLoad: true,
            url: 'cargarCategoriaPrecio',
            reader: new Ext.data.JsonReader({
                id: "idcategoriaprecio",
                root: "datos"
            }, this.recStGridConceptos),
            listeners: {
                beforeload: function(st){
                    st.initBaseParams.iddocumento = (!_this.documento) ? -1 : _this.documento.json.iddocumento;

                    st.baseParams.tipotasa = _this.confFactura.tipotasa;
                    st.initBaseParams.tipotasa = _this.confFactura.tipotasa;

                    st.initBaseParams.idmoneda = (!_this.idmoneda) ? ((_this.documento) ? _this.documento.json.idmoneda : null) : _this.idmoneda;
                    st.baseParams.idmoneda = (!_this.idmoneda) ? ((_this.documento) ? _this.documento.json.idmoneda : null) : _this.idmoneda;
                },
                load: function(st){
                    st.commitChanges();
                }
            }
        });
        this.gpConceptos = LOG.util.UIManager.initEditableGridPanel(this.cmGridConceptos, this.storeConceptos, this.smGridConceptos, {nobbar: false, _plugins: [_this.checkColumnBI, _this.checkColumnApl, _this.checkNoExt]});
        /*this.gpConceptos.view = new Ext.grid.GridView({
            forceFit: true
        });*/

        this.gpConceptos.on('teclaPresionada', function(event, e) {
            if (event.which == Ext.EventObject.ENTER && _this.enterConceptos == false)
            {
                _this.enterConceptos = true;
                _this.enterProd = true;
                _this.enterConceptos = false;
                _this.enterProd = false;
                if(_this.eC){
                    _this.eC = null;
                }
            }
        });

        this.gpConceptos.on('afteredit', function(e) {
            _this.eC = e;
            if(!e.record.data.datosValorMoneda){
                e.record.data.datosValorMoneda = new Array();
            }
            if(e.field.indexOf(_this.confFactura.monedas.codigoiso.toLowerCase()) != -1){
                var pos = _this.in_array(_this.confFactura.monedas.idmoneda, e.record.data.datosValorMoneda, 'idmoneda');
                if(pos == -1){
                    e.record.data.datosValorMoneda.push({
                        idmoneda: _this.confFactura.monedas.idmoneda,
                        valor: e.record.data['valor'+_this.confFactura.monedas.codigoiso.toLowerCase()],
                        idmonedacategoria: e.record.json.moneda
                    });
                }else{
                    e.record.data.datosValorMoneda[pos].valor = e.record.data['valor'+_this.confFactura.monedas.codigoiso.toLowerCase()];
                }
            }
            if(alternativa){
                if(e.field.indexOf(_this.confFactura.monedas.codigoisoalt.toLowerCase()) != -1){
                    var pos = _this.in_array(_this.confFactura.monedas.idmonedaalternativa, e.record.data.datosValorMoneda, 'idmoneda');
                    if(pos == -1){
                        e.record.data.datosValorMoneda.push({
                            idmoneda: _this.confFactura.monedas.idmonedaalternativa,
                            valor: e.record.data['valor'+_this.confFactura.monedas.codigoisoalt.toLowerCase()]
                        });
                    }else{
                        e.record.data.datosValorMoneda[pos].valor = e.record.data['valor'+_this.confFactura.monedas.codigoisoalt.toLowerCase()];
                    }
                }
            }

            document.onkeyup = function(event) {
                _this.gpConceptos.fireEvent('teclaPresionada', event, _this.eC);
            };

        });
        this.gpConceptos.on('checkcolumn', function (e) {
            if (_this.documento && _this.documento.json.estado == 1) {
                if (e.dataIndex == 'bi') {
                    if (!e.data.bi) {
                        e.data.bi = 0;
                        _this.gpConceptos.getView().refresh();
                    } else {
                        e.data.bi = 1;
                    }
                } else if (e.dataIndex == 'aplicar') {
                    if (!e.data.aplicar) {
                        e.data.aplicar = 0;
                        _this.gpConceptos.getView().refresh();
                    } else {
                        e.data.aplicar = 1;
                        if(!e.data.datosValorMoneda){
                            e.data.datosValorMoneda = new Array();
                        }

                        var pos = _this.in_array(_this.confFactura.monedas.idmoneda, e.data.datosValorMoneda, 'idmoneda');
                        if(pos == -1){
                            e.data.datosValorMoneda.push({
                                idmoneda: _this.confFactura.monedas.idmoneda,
                                valor: e.data['valor'+_this.confFactura.monedas.codigoiso.toLowerCase()],
                                idmonedacategoria: e.json.moneda
                            });
                        }else{
                            e.data.datosValorMoneda[pos].valor = e.data['valor'+_this.confFactura.monedas.codigoiso.toLowerCase()];
                        }
                        if(alternativa){

                            var pos = _this.in_array(_this.confFactura.monedas.idmonedaalternativa, e.data.datosValorMoneda, 'idmoneda');
                            if(pos == -1){
                                e.data.datosValorMoneda.push({
                                    idmoneda: _this.confFactura.monedas.idmonedaalternativa,
                                    valor: e.data['valor'+_this.confFactura.monedas.codigoisoalt.toLowerCase()]
                                });
                            }else{
                                e.data.datosValorMoneda[pos].valor = e.data['valor'+_this.confFactura.monedas.codigoisoalt.toLowerCase()];
                            }

                        }
                    }
                } else if (e.dataIndex == 'noexterior') {
                    if (!e.data.noexterior) {
                        e.data.noexterior = 0;
                        _this.gpConceptos.getView().refresh();
                    } else {
                        e.data.noexterior = 1;
                    }
                }
                _this.listaBotones.each(function (b) {
                    LOG.util.UIManager.applyKey(b, _this);
                    if (typeof b.controlFn == 'function') {
                        b.controlFn.createDelegate(_this, [b, _this]).call();
                    }
                }, _this);
                e.record = {
                    data: e.data
                };
            }
        }, this);

        this.gpConceptos.on('beforeedit', function(e) {
            if(_this.documento && _this.documento.json.estado != 1){
                if (e.field == 'descripcion') {
                  if(_this.documento.json.estado == 4 && (_this.documento.json.idcomprobante != null && _this.documento.json.idcomprobante != "")){
                      e.cancel = true;
                  }
                } else {
                  e.cancel = true;
                }
            } else if (e.field == 'valorcup' && e.record.json.aplicartodos == 1) {
                e.cancel = true;
            }
            if (e.field == 'condicionpago') {
                var condiciones = _this.arrayCondiciones;
                e.grid.getColumnModel().getCellEditor(e.column, e.row).field.getStore().loadData(condiciones);
            }
        });

        this.pnConcp = LOG.util.UIManager.initPanel({
            region:'east',
            width:(!_this.datosComunes)?800:450,
            layout: 'fit',
            frame: true,
            collapsible: true,
            title: this.idioma.tPConceptos,
            //collapseMode: 'mini',
            collapsed: true,
            split: true,
            bodyStyle: 'padding:21px 2px 0px',
            items: this.gpConceptos
        });

        this.center = LOG.util.UIManager.initPanel({
            region:'center',
            layout: 'border',
            items: [this.tbCenter, this.pnConcp]
        });
        return this.center;
    },
    inObject: function (obj, index) {
        return obj[index];
    },
    createTbSouth: function() {
        var _this = this;
        _this.lblImporteTotal = new Ext.form.Label({
            text: _this.idioma.lblImporteTotal+' '+ _this.confFactura.monedas.codigoiso+': ',
            style: 'padding: 10px 100px 0px 0px;font-weight: bolder;font-size: 12px;'
        });
        _this.lblImporteTotalMF = new Ext.form.Label({
            text: _this.idioma.lblImporteTotalMF+' '+ _this.monedaFactura+': ',
            style: 'padding: 10px 100px 0px 0px;font-weight: bolder;font-size: 12px;'
        });
        _this.lblImporteTotalMF.hide();

        if(alternativa){
            _this.lblImporteTotalAlt = new Ext.form.Label({
                text: _this.idioma.lblImporteTotal + ' ' + _this.confFactura.monedas.codigoisoalt + ': ',
                style: 'padding: 10px 100px 0px 0px;font-weight: bolder;font-size: 12px;'
            });
        } else {
            _this.lblImporteTotal = new Ext.form.Label({
                text: _this.idioma.lblImporteTotal+': ',
                style: 'padding: 10px 100px 0px 0px;font-weight: bolder;font-size: 12px;'
            });
        }
        var tbar = new Array('->');
        tbar.push(_this.lblImporteTotal);
        tbar.push(_this.lblImporteTotalMF);
        if(_this.lblImporteTotalAlt){
            tbar.push(_this.lblImporteTotalAlt);
        }
        this.panelSouth = new LOG.util.UIManager.initPanel({
            region: 'south',
            border: false,
            layout: 'form',
            tbar: tbar
        });
        return this.panelSouth;
    },
    grantedAction: function(idAccion) {
        var existe = false;
        Ext.each(acciones_reportes, function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    createPnProducto: function() {
        var _this = this;
        if (this.accion == 'add') {
            this.recordProd = [];
        }
        this.cmbMonedaProd = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbMoneda,
            url: 'cargarMonedaContable',
            name: 'idmoneda',
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            // disabled: disable,
            anchor: '98%',
            emptyText: _this.idioma.cbEmtyText
        });
        this.cmbMonedaProd.getStore().on('load', function() {
            let rd = _this.cmbMonedaProd.getStore().data.items;
            if (_this.documento.json.idmonedaprod) {
                for (var i = 0; i < rd.length; i++)
                {
                    if (rd[i].json.idmoneda == _this.documento.json.idmonedaprod)
                    {
                        _this.cmbMonedaProd.setValue(rd[i].data.idmoneda);
                        _this.cmbMonedaProd.originalValue = rd[i].data.idmoneda;
                        _this.cmbMonedaProd.setRawValue(rd[i].data.codigoiso);
                        _this.cmbMonedaProd.fireEvent('select', _this.cmbMonedaProd,
                            _this.cmbMonedaProd.getStore().getById(rd[i].data.idmoneda),
                            _this.cmbMonedaProd.getStore().indexOfId(rd[i].data.idmoneda), 1);
                        break;
                    }
                }
            }
            //Ext.MessageBox.hide();
        });

        this.cmbMonedaProd.on('select', function(cmb, rd, ix, p) {
            _this.monedaFactura = rd.json.codigoiso;
            if (_this.monedaFactura) {
                _this.lblImporteTotalMF.show();
            }
            if(rd.json.tasa == 0){
                mostrarMensaje(1, _this.idioma.msgNoTasaConfigurada);
            }else{
                if(_this.confFactura.dualidad == 1){
                    if(_this.panelProd){
                        _this.gpProd.getColumnModel().setColumnHeader(_this.gpProd.getColumnModel().getIndexById('palt'),
                            _this.idioma.cmPrecio+' '+rd.json.codigoiso);
                        _this.gpProd.getColumnModel().setColumnHeader(_this.gpProd.getColumnModel().getIndexById('ialt'),
                            _this.idioma.cmImporte+' '+rd.json.codigoiso);
                    }
                }else{
                    if(_this.panelProd){
                        _this.gpProd.getColumnModel().setColumnHeader(_this.gpProd.getColumnModel().getIndexById('pcont'),
                            _this.idioma.cmPrecio+' '+rd.json.codigoiso);
                        _this.gpProd.getColumnModel().setColumnHeader(_this.gpProd.getColumnModel().getIndexById('icont'),
                            _this.idioma.cmImporte+' '+rd.json.codigoiso);
                    }
                }
                _this.tasacambio = rd.json.tasa[0].venta;
                _this.factorconvercion = (_this.documento && _this.documento.json.factorconvercion) ? _this.documento.json.factorconvercion : rd.json.tasa[0].factordeconversion;
                if (_this.txtFactorconversion) {
                    _this.txtFactorconversion.setValue(_this.factorconvercion);
                }
            }
        });

        this.cmbTipoPrecioAll = new LOG.util.ComboBox({
            url: 'cargarTipoPrecio',
            hiddenName: 'idtipoprecio',
            valueField: 'idtipoprecio',
            displayField: 'denominacionPrecio',
            enableKeyEvents: true,
            autoLoad: false,
            editable: false
        });
        this.cmbTipoPrecio = new LOG.util.ComboBox({
            url: 'cargarTipoPrecio',
            hiddenName: 'idtipoprecio',
            valueField: 'denominacionPrecio',
            displayField: 'denominacionPrecio',
            enableKeyEvents: true,
            autoLoad: false,
            editable: false,
            listeners: {
                select: function(cmb, rd) {
                    LOG.fact.tipoprecio = {
                        data: rd.json
                    };
                }
            }
        });
        this.btnAdicionarProd = LOG.util.UIManager.createBtn({
            text: this.idioma.btnProductos,
            tooltip: this.idioma.msgAdicionarProdFact,
            iconCls: 'producto',
            disabled: true,
            handler: function() {
                if (_this.idcontrato == undefined)
                    _this.showWindowProducto(1);
                else
                    _this.showWinProdContrato();

            },
            controlFn: function(b, cl){
                if(_this.parent.grantedAction('CT') || _this.parent.grantedAction('RCRUD') || _this.parent.grantedAction('RAdicionar')){
                    b.show();
                }else{
                    b.hide();
                }
            }
        });
        this.btnAdicionarProdAlm = LOG.util.UIManager.createBtn({
            text: this.idioma.btnProductos+' almacenados',
            tooltip: this.idioma.msgAdicionarProdFact,
            iconCls: 'producto',
            disabled: true,
            handler: function() {
                if (_this.idcontrato == undefined)
                    _this.showWindowProductoAlm(1);
                else
                    _this.showWinProdContrato();

            },
            controlFn: function(b, cl){
                if((_this.parent.grantedAction('CT') || _this.parent.grantedAction('RCRUD') || _this.parent.grantedAction('RAdicionar')) && _this.tipoDoc == 1){
                    b.show();
                }else{
                    b.hide();
                }
            }
        });
        this.btnEliminarProd = LOG.util.Prototipos.botonEliminar({
            disabled: true,
            idioma: this.idioma,
            tooltip: this.idioma.msgEliminarProdFact,
            handler: function() {
                mostrarMensaje(2, _this.idioma.lbQuestProductosAEliminar, function(btn, text) {
                    if (btn === 'ok') {
                        var seleccion = _this.smGridProd.getSelections();
                        _this.eliminarProducto(seleccion);
                    }
                });
            },
            controlFn: function (b, cl) {
                if (_this.parent.grantedAction('CT') || _this.parent.grantedAction('RCRUD') || _this.parent.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        });
        this.btnLotes = LOG.util.UIManager.createBtn({
            text: _this.idioma.lotes,
            tooltip: '',
            iconCls: 'lote',
            disabled: true,
            handler: function () {
                if (_this.smGridProd.getSelections().length == 1 && _this.accion != 'add') {
                    var seleccion = _this.smGridProd.getSelected();
                    _this.showLotes(seleccion);
                }
            },
            controlFn: function(b, called){
                if(_this.accion == 'mod' || _this.accion == 'ver'){
                    _this.smGridProd.fireEvent = _this.smGridProd.fireEvent.createSequence(function (e) {
                        b.disable();
                        if (_this.smGridProd.getSelections().length == 1) {
                            if(_this.smGridProd.getSelected().json.tienelote == 1)
                                b.enable();
                        } else {
                            b.disable();
                        }
                    });
                    _this.storeProd.fireEvent = _this.storeProd.fireEvent.createSequence(function (e) {
                        if (e == "load") {
                            b.disable();
                            if (_this.smGridProd.getSelections().length == 1) {
                                if (_this.smGridProd.getSelected().json.tienelote == 1)
                                    b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                }else{
                    b.disable();
                }
            }
        });
        this.btnNroSerie = LOG.util.UIManager.createBtn({
            text: _this.idioma.nroserie,
            tooltip: '',
            iconCls: 'numeroserie',
            disabled: true,
            handler: function () {
                LOG.lb.numeroserie.Loader.init(function () {
                    var winNroSerie = new LOG.lb.numeroserie.Salida({
                        idestructura: _this.documento.json.iddeposito,
                        iddeposito: _this.documento.json.iddeposito,
                        producto: _this.smGridProd.getSelected().data,
                        documento: _this.documento.json,
                        sinlimite: (_this.confFactura.entregarrealordenado == "1") ? false : true,
                        salida: _this.documento.json.tipodocumento,
                        afecta: false,
                        existencia: true,
                        cerrarFn: function () {
                            _this.storeProd.reload({
                                callback: function(){
                                    _this.documento.json.importes = _this.storeProd.reader.jsonData.importes;
                                    _this.setImporteTotal();
                                }
                            });
                        }
                    });
                    winNroSerie.init();
                    winNroSerie.view();
                });
            },
            controlFn: function (b, called) {
                //if (_this.accion == 'mod') {
                    _this.smGridProd.fireEvent = _this.smGridProd.fireEvent.createSequence(function (e) {
                        b.disable();
                        if (_this.smGridProd.getSelections().length == 1) {
                            if (_this.smGridProd.getSelected().json.equipo == 1)
                                b.enable();
                        } else {
                            b.disable();
                        }
                    });
                    _this.storeProd.fireEvent = _this.storeProd.fireEvent.createSequence(function (e) {
                        if (e == "load") {
                            b.disable();
                            if (_this.smGridProd.getSelections().length == 1) {
                                if (_this.smGridProd.getSelected().json.equipo == 1)
                                    b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                /*} else {
                    b.disable();
                }*/
            }
        });
        this.btnCilindros = LOG.util.UIManager.createBtn({
            text: 'Cilindros',
            tooltip: 'Registrar cilindros',
            iconCls: 'cierre',
            hidden: (typeof CILINDROS === 'undefined' || CILINDROS == false) ? true : false,
            handler: function () {
                var title = 'Registrar cilindros';
                var ventanaCilindro = new LOG.fact.cilindros({
                    idindicador: _this.smGridProd.getSelections()[0].json.idindicador,
                    idelementofactura: _this.smGridProd.getSelections()[0].json.idelementofactura,
                    idmovimiento: _this.smGridProd.getSelections()[0].json.idmovimiento,
                    iddocumento: _this.documento.json.iddocumento,
                    estado: _this.documento.json.estado,
                    idioma: _this.idioma,
                    gpParent: _this.gpProd,
                    urlBusquedaGridPrincipal: 'cargarCilindros'
                });
                ventanaCilindro.init();

                ventanaCilindro.getVistaPrincipal().title = 'Listado de cilindros';
                ventanaCilindro.view();
                ventanaCilindro.getGridPrincipal().getStore().load();
                var botonAceptar = ventanaCilindro.getVistaPrincipal().listaBotones.getItem(2);
                botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
                    var records = ventanaCilindro.getGridPrincipal().getStore().getModifiedRecords();
                    var cilindroMod = new Array();
                    Ext.each(records, function(record){
                        cilindroMod.push(record.data);
                    });
                    Ext.MessageBox.wait('Guardando datos', 'Espere' || '...');
                    Ext.Ajax.request({
                        url: 'modificarCilindro',
                        method: 'POST',
                        params: {
                            cilindros: Ext.encode(cilindroMod),
                            iddocumento: ventanaCilindro.iddocumento,
                            idmovimiento: ventanaCilindro.idmovimiento || null,
                            idelementofactura: ventanaCilindro.idelementofactura || null,
                            idumedidaprod: _this.smGridProd.getSelections()[0].json.idumedida
                        },
                        callback: function(o, s, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            if (resp.success) {
                                mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente');
                                ventanaCilindro.gpParent.getStore().load();
                                _this.documento.json.importes = resp.importes;
                                _this.setImporteTotal();
                            } else {
                                mostrarMensaje(1, 'Ha ocurrido un error al guardar los datos');
                            }
                        }
                    });
                });

                /*Botones adicionar cilindro*/
                this.btnAddCil = LOG.util.Prototipos.botonAdicionar({
                    text:'Adicionar', tooltip: 'Adicionar cilindro',
                    //disabled: true,
                    handler: function() {
                        var ventanaNomCilindro = new LOG.fact.cilindros({
                            idindicador: _this.smGridProd.getSelections()[0].json.idindicador,
                            idelementofactura: _this.smGridProd.getSelections()[0].json.idelementofactura,
                            idmovimiento: _this.smGridProd.getSelections()[0].json.idmovimiento,
                            iddocumento: _this.documento.json.iddocumento,
                            estado: _this.documento.json.estado,
                            idioma: _this.idioma,
                            nomenclador: true,
                            gpParent: ventanaCilindro,
                            urlBusquedaGridPrincipal: 'cargarNomCilindros'
                        });
                        ventanaNomCilindro.init();

                        ventanaNomCilindro.getVistaPrincipal().title = 'Nomenclador de cilindros';
                        ventanaNomCilindro.view();
                        ventanaNomCilindro.getGridPrincipal().getStore().load();
                        var botonNomAceptar = ventanaNomCilindro.getVistaPrincipal().listaBotones.getItem(2);
                        botonNomAceptar.handler = botonNomAceptar.handler.createSequence(function (e) {
                            var recordsNom = ventanaNomCilindro.getGridPrincipal().getSelectionModel().getSelections();
                            var cilindros = Array();
                            Ext.each(recordsNom, function(r){
                                cilindros.push(r.data);
                            });
                            Ext.MessageBox.wait('Guardando datos', 'Espere' || '...');
                            Ext.Ajax.request({
                                url: 'adicionarCilindroFactura',
                                method: 'POST',
                                params: {
                                    cilindros: Ext.encode(cilindros),
                                    util: Ext.encode({
                                        idmovimiento: ventanaNomCilindro.idmovimiento || null,
                                        idelementofactura: ventanaNomCilindro.idelementofactura || null,
                                        idindicador: ventanaNomCilindro.idindicador || null,
                                        iddocumento: ventanaNomCilindro.iddocumento || null,
                                    })
                                },
                                callback: function(o, s, r) {
                                    Ext.MessageBox.hide();
                                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                    if (resp.success) {
                                        mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente');
                                        ventanaNomCilindro.gpParent.getStorePrincipal().load();
                                    } else {
                                        mostrarMensaje(1, 'Ha ocurrido un error al guardar los datos');
                                    }
                                }
                            });
                        });
                    },
                    controlFn: function(b, cl){
                        b.disable();
                        if (_this.documento.json.estado == 1) {
                            b.enable();
                        }
                    }
                });
                this.btnDelCil = LOG.util.Prototipos.botonEliminar({
                    text: 'Eliminar',
                    disabled: true,
                    tooltip: 'Eliminar cilindro',
                    handler: function() {
                        mostrarMensaje(2, _this.idioma.lbQuestCilindroEliminar, function(btn, text) {
                            if (btn === 'ok') {
                                var seleccion = ventanaCilindro.getGridPrincipal().getSelectionModel().getSelections();
                                var idDel = [];
                                Ext.each(seleccion, function(record) {
                                    idDel.push(record.data.idcilindrofactura)
                                })
                                Ext.MessageBox.wait(_this.idioma.msgEliminando, _this.idioma.msgEspere || '...');
                                Ext.Ajax.request({
                                    url: 'eliminarCilindro',
                                    method: 'post',
                                    params: {
                                        datos: Ext.encode(idDel)
                                    },
                                    success: function(rp) {
                                        let respuesta = Ext.decode(rp.responseText);
                                        _this.documento.json.importes = respuesta.importes;
                                        ventanaCilindro.getGridPrincipal().getStore().load();
                                        ventanaCilindro.gpParent.getStore().load();
                                        Ext.MessageBox.hide();
                                        _this.setImporteTotal();
                                    }
                                });
                            }
                        });
                    },
                    controlFn: function(b, cl){
                        ventanaCilindro.getGridPrincipal().getSelectionModel().fireEvent = ventanaCilindro.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                            b.disable();
                            if (ventanaCilindro.getGridPrincipal().getSelectionModel().getSelections().length >= 1 && _this.documento.json.estado == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        });
                    }
                });
                ventanaCilindro.getGridPrincipal().getTopToolbar().add([this.btnAddCil, this.btnDelCil]);
                if (this.btnAddCil && typeof this.btnAddCil.controlFn == 'function') {
                    this.btnAddCil.controlFn.createDelegate(this, [this.btnAddCil, this]).call();
                }
                if (this.btnDelCil && typeof this.btnDelCil.controlFn == 'function') {
                    this.btnDelCil.controlFn.createDelegate(this, [this.btnDelCil, this]).call();
                }
            },
            controlFn: function (b, called) {
                if (_this.parent.grantedAction('CT') || _this.parent.grantedAction('RCRUD') || _this.parent.grantedAction('RAdicionar')) {
                    b.disable();
                    _this.smGridProd.fireEvent = _this.smGridProd.fireEvent.createSequence(function (e) {
                        b.disable();
                        if (_this.smGridProd.getSelections().length == 1) {
                            if (_this.smGridProd.getSelections()[0].json.cilindro > 0 && _this.tipoDoc != 1
                            )
                                b.enable();
                        } else {
                            b.disable();
                        }
                    });
                    _this.storeProd.fireEvent = _this.storeProd.fireEvent.createSequence(function (e) {
                        if (e == "load") {
                            b.disable();
                            if (_this.smGridProd.getSelections().length == 1) {
                                if (_this.smGridProd.getSelections()[0].json.cilindro > 0 && _this.tipoDoc != 1
                                )
                                    b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.hide();
                }
            }
        });
        this.btnDesubicar = LOG.util.UIManager.createBtn({
            text: _this.idioma.desubicar,
            tooltip: '',
            iconCls: 'ajustar',
            disabled: true,
            handler: function () {
                LOG.inv.ubicacion.Loader.init(function () {
                    this.winUbicaciones = new LOG.lb.ubicacion.proceso({
                        cantidadAlternativa: true,
                        idioma: _this.idioma,
                        record: _this.smGridProd.getSelected().json,
                        desubicar: true
                    });
                    this.winUbicaciones.init();
                    this.winUbicaciones.view();
                });
            },
            controlFn: function (b, called) {
                if (_this.parent.grantedAction('CT') || _this.parent.grantedAction('RCRUD') || _this.parent.grantedAction('RAdicionar')) {
                    b.show();
                    b.disable();
                    if (_this.accion == 'mod') {
                        _this.smGridProd.fireEvent = _this.smGridProd.fireEvent.createSequence(function (e) {
                            b.disable();
                            if (_this.smGridProd.getSelections().length == 1) {
                                if (_this.smGridProd.getSelected().json.equipo == 0
                                    && _this.smGridProd.getSelected().json.tienelote == 0
                                    && _this.smGridProd.getSelected().json.municion == 0 && !_this.smGridProd.getSelected().json.ubicacionunica
                                )
                                    b.enable();
                            } else {
                                b.disable();
                            }
                        });
                        _this.storeProd.fireEvent = _this.storeProd.fireEvent.createSequence(function (e) {
                            if (e == "load") {
                                b.disable();
                                if (_this.smGridProd.getSelections().length == 1) {
                                    if (_this.smGridProd.getSelected().json.equipo == 0
                                        && _this.smGridProd.getSelected().json.tienelote == 0
                                        && _this.smGridProd.getSelected().json.municion == 0
                                        && !_this.smGridProd.getSelected().json.ubicacionunica
                                    )
                                        b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        });
                    } else {
                        b.disable();
                    }
                } else {
                    b.hide();
                }
            }
        });

        this.btnCalcular= LOG.util.UIManager.createBtn({
            text: 'Calcular',
            tooltip: 'Calcular factor de converci\xf3n',
            iconCls: 'unidadmedida',
            handler: function () {
                var win = new LOG.fact.calcular({
                    idioma: _this.idioma,
                    movimiento: _this.smGridProd.getSelections(),
                    storeProd: _this.storeProd
                });
                win.show();
            },
            controlFn: function (b, called) {
                if (_this.parent.grantedAction('CT') || _this.parent.grantedAction('RCRUD') || _this.parent.grantedAction('RAdicionar')) {
                    b.show();
                    b.disable();
                    if (_this.accion == 'mod') {
                        _this.smGridProd.fireEvent = _this.smGridProd.fireEvent.createSequence(function (e) {
                            b.disable();
                            if (_this.smGridProd.getSelections().length > 0) {
                                if (_this.smGridProd.getSelections()[0].json.idmovimiento
                                )
                                    b.enable();
                            } else {
                                b.disable();
                            }
                        });
                        _this.storeProd.fireEvent = _this.storeProd.fireEvent.createSequence(function (e) {
                            if (e == "load") {
                                b.disable();
                                if (_this.smGridProd.getSelections().length > 0) {
                                    if (_this.smGridProd.getSelections()[0].json.idmovimiento
                                    )
                                        b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        });
                    } else {
                        b.disable();
                    }
                } else {
                    b.hide();
                }
            }
        });
        this.btnAplicarPrecio= LOG.util.UIManager.createBtn({
            text: 'Aplicar',
            tooltip: 'Aplicar tipo de precio a todos los productos',
            iconCls: 'aplicar',
            handler: function () {
                _this.parent.modelo.aplicarTipoPrecio(
                    _this.cmbTipoPrecioAll.getValue(),
                    1,
                    _this.documento.json.iddocumento,
                    _this.cmbMonedaProd.getValue(),
                    _this.tasacambio,
                    ((_this.txtFactorconversion && _this.txtFactorconversion.isValid()) ? _this.txtFactorconversion.getValue() : _this.factorconvercion));
            },
            controlFn: function (b, called) {
                /*if (_this.parent.grantedAction('CT') || _this.parent.grantedAction('RCRUD') || _this.parent.grantedAction('RAdicionar')) {
                    b.show();
                    b.disable();
                    if (_this.accion == 'mod') {
                        _this.smGridProd.fireEvent = _this.smGridProd.fireEvent.createSequence(function (e) {
                            b.disable();
                            if (_this.smGridProd.getSelections().length > 0) {
                                if (_this.smGridProd.getSelections()[0].json.idmovimiento
                                )
                                    b.enable();
                            } else {
                                b.disable();
                            }
                        });
                        _this.storeProd.fireEvent = _this.storeProd.fireEvent.createSequence(function (e) {
                            if (e == "load") {
                                b.disable();
                                if (_this.smGridProd.getSelections().length > 0) {
                                    if (_this.smGridProd.getSelections()[0].json.idmovimiento
                                    )
                                        b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        });
                    } else {
                        b.disable();
                    }
                } else {
                    b.hide();
                }*/
            }
        });
        var columnas = _this.crearColumnasProd();
        this.smGridProd = LOG.util.UIManager.initSelectionModel(3, false);
        this.smGridProd.moveEditorOnEnter = false;
        this.smGridProd.on('selectionchange', function(sm) {
            if (sm.getSelections().length > 0){
                if(!_this.deshabilitarBotonesGrids){
                    _this.btnEliminarProd.enable();
                }
            }
            else
                _this.btnEliminarProd.disable();
        });
        var cls = LOG.util.UIManager.proccessColumns(columnas, this.smGridProd);
        this.cmGridProd = new Ext.grid.ColumnModel(cls.columns);
        this.storeProd = _this.crearStoreProd(null, cls);
        this.gpProd = LOG.util.UIManager.initEditableGridPanel(this.cmGridProd, this.storeProd, this.smGridProd, {nobbar: false,roweditor: false});
        this.gridFilter = new LOG.util.GridFilter({
            grid: _this.gpProd,
            concepto: _this.idioma.fdConcepto,
            searchTipText: _this.idioma.fdCriterio
        });
        /*this.gpProd.view = new Ext.grid.GridView({
            forceFit: true
        });*/
        this.gpProd.getSelectionModel().on('rowselect', function(sm, index, r) {
            _this.seleccionAnteriorP = index;
        });
        this.gpProd.on('teclaPresionada', function(event, e) {
            if(_this.e && _this.e.field == 'cantidad'){
                if (event.which == Ext.EventObject.ENTER && _this.enterProd == false)
                {
                    _this.enterProd = true;
                    if (_this.accion == 'add') {
                        _this.modifyGridProducto(_this.e, true);
                    }else{

                        var importeproducto = Math.round(_this.e.record.data.pcontable * _this.e.value * 100) / 100;
                        _this.e.record.data.impcontable = (importeproducto).toFixed(2);
                        var importealt = Math.round(_this.e.record.data.palternativo * _this.e.value * 100) / 100;
                        _this.e.record.data.impalternativo = (importealt).toFixed(2);
                        _this.gpProd.getView().refresh();
                        if (_this.smGridProd.hasNext()) {
                            _this.smGridProd.selectRow(_this.e.row + 1, false);
                            _this.gpProd.startEditing(_this.e.row + 1, _this.e.column);
                        } else {
                            _this.smGridProd.selectRow(0, false);
                            _this.gpProd.startEditing(0, _this.e.column);
                        }
                        _this.enterProd = false;
                    }
                    _this.e = null;
                }
            }
        });
        this.gpProd.on('afteredit', function(e) {
            _this.e = e;
            if(e.field == 'cantidad'){
                if(parseFloat(e.value) == parseFloat(e.originalValue)){
                    delete e.record.modified['cantidad'];
                    _this.gpProd.getView().refresh();
                    return;
                }
                if(!_this.verificarRealOrdenado(_this.e)){
                    return;
                }
                if(_this.e){
                    _this.modifyGridProducto(_this.e);
                }
            }else{
                if(_this.accion == 'add'){
                    _this.modifyGridProducto(e);
                }else if(e.field == 'pcontable' || e.field == 'palternativo' || e.field == 'impcontable' || e.field == 'impalternativo'){
                    if(!e.record.data.datosPrecioMoneda){
                        e.record.data.datosPrecioMoneda = new Array();
                    }

                    if(e.field == 'pcontable'){
                        var pos = _this.in_array(_this.confFactura.monedas.idmoneda, e.record.data.datosPrecioMoneda, 'idmoneda');
                        if (pos == -1) {
                            e.record.data.datosPrecioMoneda.push({
                                idmoneda: _this.confFactura.monedas.idmoneda,
                                precio: e.record.data.pcontable
                            });
                        } else {
                            e.record.data.datosPrecioMoneda[pos].precio = e.record.data.pcontable;
                        }
                        var importe = Math.round(e.record.data.pcontable * e.record.data.cantidad * 100) / 100;
                        e.record.data.impcontable = (importe).toFixed(2);
                    } else if (e.field == 'palternativo') {
                        var pos = _this.in_array(_this.confFactura.monedas.idmonedaalternativa, e.record.data.datosPrecioMoneda, 'idmoneda');
                        if (pos == -1) {
                            e.record.data.datosPrecioMoneda.push({
                                idmoneda: _this.confFactura.monedas.idmonedaalternativa,
                                precio: e.record.data.palternativo
                            });
                        } else {
                            e.record.data.datosPrecioMoneda[pos].precio = e.record.data.palternativo;
                        }
                        var importe = Math.round(e.record.data.palternativo * e.record.data.cantidad * 100) / 100;
                        e.record.data.impalternativo = (importe).toFixed(2);
                    } else if (e.field == 'impcontable') {
                        var pos = _this.in_array(_this.confFactura.monedas.idmoneda, e.record.data.datosPrecioMoneda, 'idmoneda');
                        if(_this.documento.json && _this.documento.json.iddoc == iddocnotacredito) {
                            e.record.data.cantidad = 0;
                        }
                        if (pos == -1) {
                            e.record.data.datosPrecioMoneda.push({
                                idmoneda: _this.confFactura.monedas.idmoneda,
                                precio: (_this.documento.json && _this.documento.json.iddoc == iddocnotacredito) ? -1 : e.record.data.impcontable/e.record.data.cantidad
                            });
                        } else {
                            e.record.data.datosPrecioMoneda[pos].precio = (_this.documento.json && _this.documento.json.iddoc == iddocnotacredito) ? -1 : e.record.data.impcontable/e.record.data.cantidad;
                        }
                        e.record.data.pcontable = (_this.documento.json && _this.documento.json.iddoc == iddocnotacredito) ? 0 : e.record.data.impcontable/e.record.data.cantidad;
                    } else {
                        var pos = _this.in_array(_this.confFactura.monedas.idmonedaalternativa, e.record.data.datosPrecioMoneda, 'idmoneda');
                        if (pos == -1) {
                            e.record.data.datosPrecioMoneda.push({
                                idmoneda: _this.confFactura.monedas.idmonedaalternativa,
                                precio: e.record.data.impalternativo/e.record.data.cantidad
                            });
                        } else {
                            e.record.data.datosPrecioMoneda[pos].precio = e.record.data.impalternativo/e.record.data.cantidad;
                        }
                        e.record.data.palternativo = e.record.data.impalternativo/e.record.data.cantidad;
                    }
                    e.record.data.denominacionPrecio = '-';
                    e.record.data.idtipoprecio = -2;
                    e.record.data.cambioTipoPrecio = 1;
                    _this.gpProd.getView().refresh();
                }else{
                    e.record.data.denominacionPrecio = LOG.fact.tipoprecio.data.denominacionPrecio;
                    e.record.data.idtipoprecio = LOG.fact.tipoprecio.data.idtipoprecio;
                    e.record.data.cambioTipoPrecio = 1;
                    _this.gpProd.getView().refresh();
                    Ext.Ajax.request({
                        url: 'getPrecioProducto',
                        method: 'post',
                        params: {
                            datos: Ext.encode(e.record.data)
                        },
                        success: function(rp) {
                            var value = Ext.decode(rp.responseText);
                            Ext.each(value.precio, function(precio){
                                if(precio.preciocontable != undefined){
                                    e.record.data.pcontable = precio.preciocontable;
                                    var importe = Math.round(precio.preciocontable * e.record.data.cantidad * 100) / 100;
                                    e.record.data.impcontable = (importe).toFixed(2);
                                }else{
                                    e.record.data.palternativo = precio.precioalternativo;
                                    var importe = Math.round(precio.precioalternativo * e.record.data.cantidad * 100) / 100;
                                    e.record.data.impalternativo = (importe).toFixed(2);
                                }
                            });
                            _this.gpProd.getView().refresh();
                        }
                    });
                }
            }
        });

        this.gpProd.on('beforeedit', function(e) {
            if(e.field == 'denominacionPrecio'){
                if(_this.cmbTipoPrecio.getStore().getCount() <= 1 && e.record.data.idtipoprecio != -2){
                    e.cancel = true;
                }
            }
            if(_this.accion == 'ver' || _this.tipoDoc == 5){
                e.cancel = true;
            }
            if(_this.accion == 'mod'){
                if (e.field == 'cantidad' && _this.documento.json.iddoc == iddocnotadebito) {
                    e.cancel = true;
                }
                else if(e.field == 'cantidad' && parseFloat(e.record.json.cantidad) >= 0 && _this.tipoDoc != 1 && _this.idsubsistema == LOG.util.Subsistemas.inventario){
                    if(e.record.json.tienelote == 1){
                        e.cancel = true;
                    }else if(e.record.json.equipo == 1){
                        e.cancel = true;
                    }
                }else if(e.field == 'cantidad'){
                    if((_this.idsubsistema == LOG.util.Subsistemas.activosfijos || _this.idsubsistema == LOG.util.Subsistemas.talleres) && _this.tipoDoc != 1){
                        e.cancel = true;
                    }
                }
                if(e.field == 'cantidad'){
                    if(e.record.json.cilindro == 1 && _this.tipoDoc != 1){
                        e.cancel = true;
                    }
                }
                if(e.field == 'pcontable' || e.field == 'palternativo' || e.field == 'impalternativo' || e.field == 'impcontable'){
                    if(_this.idsubsistema == LOG.util.Subsistemas.inventario || _this.idsubsistema == LOG.util.Subsistemas.activosfijos || _this.idsubsistema == LOG.util.Subsistemas.talleres){
                        if (!_this.parent.grantedAction('RPrecio') && (_this.documento.json.iddoc != iddocnotadebito && _this.documento.json.iddoc != iddocnotacredito)) {
                            e.cancel = true;
                        }
                    }
                }
            }
        });
        this.gpProd.on('rowclick', function(g) {
            if (_this.panelLotes && !_this.panelLotes.collapsed){
                if(!g.getSelectionModel().hasSelection() || g.getSelectionModel().getSelected().json.tienelote != 1)
                _this.panelLotes.collapse();
            }
        });

        var array_botones = ['-',
            this.btnAdicionarProd,this.btnAdicionarProdAlm,
            this.btnEliminarProd];
        if(_this.idsubsistema == LOG.util.Subsistemas.inventario && _this.tipoDoc != 1){
            array_botones = array_botones.concat([this.btnLotes,this.btnNroSerie,this.btnDesubicar, this.btnCalcular]);
        }
        if (this.cmbMonedaProd && _this.grantedAction('RMONEDAPRODUCTO')) {
            array_botones = array_botones.concat([
                this.btnCilindros,'->',
                new Ext.form.Label({text: _this.idioma.lbMoneda}), '&nbsp',_this.cmbMonedaProd, '-',
                new Ext.form.Label({text: _this.idioma.cmTipoPrecio}), '&nbsp',_this.cmbTipoPrecioAll, '-',_this.btnAplicarPrecio,'-'
            ]);
        } else {
            array_botones = array_botones.concat([this.btnCilindros,'->',new Ext.form.Label({text: _this.idioma.cmTipoPrecio}), '&nbsp',_this.cmbTipoPrecioAll, '-',_this.btnAplicarPrecio,'-']);
        }
        // array_botones = array_botones.concat([this.btnCilindros,'->',new Ext.form.Label({text: _this.idioma.cmTipoPrecio}), '&nbsp',_this.cmbTipoPrecioAll, '-',_this.btnAplicarPrecio,'-']);
        this.panelProd = LOG.util.UIManager.initPanel({
            title: this.idioma.tProducto,
            layout: 'border',
            region: 'center',
            tbar: array_botones,
            items: [this.gpProd]
        });
        if(_this.idsubsistema == LOG.util.Subsistemas.inventario && _this.tipoDoc != 1){
            this.panelProd.add(this.createPnLotes());
        }
        return this.panelProd;
    },
    crearColumnasProd: function(datos){
        var _this = this;
        let isFarmacia = typeof farmacia !== "undefined" && farmacia == 1;
        var columnas = new LOG.util.List();
        columnas.add({
            dataIndex: 'idmovimiento'
        });
        columnas.add({
            dataIndex: 'idelementofactura'
        });
        columnas.add({
            dataIndex: 'idproducto'
        });
        columnas.add({
            dataIndex: 'iddocumento'
        });
        columnas.add({
            dataIndex: 'idfactura'
        });
        columnas.add({
            dataIndex: 'idindicador'
        });
        columnas.add({
            dataIndex: 'idumedidacrc'
        });
        columnas.add({
            header: this.idioma.cmCodigo,
            dataIndex: 'codigo',
            default: true
        });
        if(isFarmacia == 1) {
            columnas.add({
                header: 'Nº. lote',
                width: 150,
                dataIndex: "numerolote",
                default: true,
                filter: {
                    type: "string",
                    emptyText: 'N\xfamero de lote',
                    dataIndex: "numerolote",
                },
            });

            columnas.add({
                header: 'Fecha vencimiento lote',
                width: 100,
                dataIndex: "fechavencelote",
                default: true
            });
        }
        if(_this.idsubsistema == LOG.util.Subsistemas.activosfijos){
            columnas.add({
                header: this.idioma.cmNumeroSerie,
                dataIndex: 'nroserie',
                default: true
            });
            columnas.add({
                dataIndex: 'idregnumerico'
            });
        }
        columnas.add({
            header: this.idioma.cmDenominacion,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true
        });
        columnas.add({
            header: this.idioma.cmNumPieza,
            dataIndex: 'codigoproveedor',
            default: true
        });
        columnas.add({
            header: this.idioma.cmUnidadMedida,
            dataIndex: 'umedida',
            width: 50,
            default: true
        });
        columnas.add({
            header: 'Naturaleza',
            dataIndex: 'naturaleza',
            width: 120,
            default: true
        });
        
        columnas.add(LOG.util.Prototipos.columnaCantidad({
            header: (_this.documento && _this.documento.json && _this.documento.json.iddoc == iddocnotacredito) ? this.idioma.cmEntregado : this.idioma.cmAutorizado,
            dataIndex: 'autorizado',
            align: 'right',
            default: true,
            hidden: ((_this.idsubsistema == LOG.util.Subsistemas.inventario || (_this.documento && _this.documento.json && _this.documento.json.iddoc == iddocnotacredito)) ? false : true)
        }));
        columnas.add(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cmPendiente,
            dataIndex: 'pendiente',
            align: 'right',
            default: true,
            hidden: (_this.idsubsistema == LOG.util.Subsistemas.inventario /*|| (_this.documento && _this.documento.json.docorigen)*/ ? false : true)
        }));
        columnas.add({
            dataIndex: 'endocumento'
        });
        columnas.add({
            dataIndex: 'diferencia'
        });
        columnas.add(LOG.util.Prototipos.columnaCantidad({
            header: (_this.documento && _this.documento.json && _this.documento.json.iddoc == iddocnotacredito) ? this.idioma.cmAEntregarDev : this.idioma.cmAEntregar,
            dataIndex: 'cantidad',
            align: 'right',
            default: true,
            editable: true,
            editor: LOG.util.Prototipos.inputDecimal({
                listeners: {
                    focus: function(t) {
                        t.selectText(0, t.getValue().length);
                    }
                }
            })
        }));
        columnas.add({
            header: this.idioma.cmTipoPrecio,
            dataIndex: 'denominacionPrecio',
            default: true,
            editable: true,
            editor: this.cmbTipoPrecio
        });
        columnas.add({
            dataIndex: 'idtipoprecio',
            hidden: true
        });

        columnas.add(LOG.util.Prototipos.columnaPrecio({
            header: _this.idioma.cmPrecio + ' '+_this.confFactura.monedas.codigoiso,
            dataIndex: 'pcontable',
            default: true,
            align: 'right',
            id: 'pcont',
            editor: LOG.util.Prototipos.inputDecimal({
                listeners: {
                    focus: function(t) {
                        t.selectText(0, t.getValue().length);
                    }
                }
            })
        }));
        columnas.add(LOG.util.Prototipos.columnaPrecio({
            header: 'Cr\xe9dito',
            dataIndex: 'credito',
            default: true,
            align: 'right',
            hidden: (_this.documento && _this.documento.json && _this.documento.json.iddoc == iddocnotacredito) ? false : true
        }));
        columnas.add(LOG.util.Prototipos.columnaPrecio({
            header: 'D\xe9bito',
            dataIndex: 'debito',
            default: true,
            align: 'right',
            hidden: (_this.documento && _this.documento.json && _this.documento.json.iddoc == iddocnotadebito) ? false : true
        }));
        columnas.add(LOG.util.Prototipos.columnaImporte({
            header: _this.idioma.cmImporte + ' '+_this.confFactura.monedas.codigoiso,
            dataIndex: 'impcontable',
            default: true,
            align: 'right',
            id: 'icont',
            renderer: _this.mostrarImporte,
            editor: LOG.util.Prototipos.inputDecimal({
                listeners: {
                    focus: function(t) {
                        t.selectText(0, t.getValue().length);
                    }
                }
            })
        }));

        if(alternativa){
            columnas.add(LOG.util.Prototipos.columnaPrecio({
                header: _this.idioma.cmPrecio + ' '+_this.confFactura.monedas.codigoisoalt,
                dataIndex: 'palternativo',
                default: true,
                align: 'right',
                id: 'palt',
                editor: LOG.util.Prototipos.inputDecimal({
                    listeners: {
                        focus: function(t) {
                            t.selectText(0, t.getValue().length);
                        }
                    }
                })
            }));
            columnas.add(LOG.util.Prototipos.columnaImporte({
                header: _this.idioma.cmImporte + ' '+_this.confFactura.monedas.codigoisoalt,
                dataIndex: 'impalternativo',
                default: true,
                align: 'right',
                id: 'ialt',
                renderer: _this.mostrarImporte,
                editor: LOG.util.Prototipos.inputDecimal({
                    listeners: {
                        focus: function(t) {
                            t.selectText(0, t.getValue().length);
                        }
                    }
                })
            }));
        }

        /*Ext.each(_this.confFactura.monedas, function(dato){
            if(dato.contable || dato.alternativa){
                columnas.add(LOG.util.Prototipos.columnaPrecio({
                    header: _this.idioma.cmPrecio + ' '+dato.codigoiso,
                    dataIndex: (dato.contable) ? 'pcontable' : 'palternativo',
                    default: true,
                    align: 'right',
                    id: (dato.contable) ? 'pcont': 'palt',
                    editor: LOG.util.Prototipos.inputDecimal({
                        listeners: {
                            focus: function(t) {
                                t.selectText(0, t.getValue().length);
                            }
                        }
                    })
                }));
                columnas.add(LOG.util.Prototipos.columnaImporte({
                    header: _this.idioma.cmImporte + ' '+dato.codigoiso,
                    dataIndex: (dato.contable) ? 'impcontable' : 'impalternativo',
                    default: true,
                    align: 'right',
                    id: (dato.contable) ? 'icont': 'ialt',
                    renderer: _this.mostrarImporte
                }));
            }
        });*/
        if (_this.idsubsistema == LOG.util.Subsistemas.inventario) {
            columnas.add({
                header: _this.idioma.cmAlmacenamiento,
                width: 100,
                dataIndex: 'especial',
                default: true,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {

                    if (record.get('municion') == 1) {
                        metaData.css = 'icondistra-partida';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmMunicion + '"';

                    } else if (record.get('equipo') == 1) {
                        metaData.css = 'icondistra-numeroserie';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmNorSerie + '"';

                    } else if (record.get('tienelote') == 1) {
                        metaData.css = 'icondistra-lote';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmLote + '"';

                    } else {
                        metaData.css = 'icondistra-producto';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmProducto + '"';

                    }

                }
            });
            columnas.add({
                dataIndex: 'equipo'
            });
            columnas.add({
                dataIndex: 'tienelote'
            });
            columnas.add({
                dataIndex: 'municion'
            });
            columnas.add({
                header: 'Costo CUP',
                width: 100,
                dataIndex: 'preciocontable',
                default: true
            });
            columnas.add({
                header: 'Costo CUC',
                width: 100,
                hidden: (alternativa) ? false : true,
                dataIndex: 'precioalternativo',
                default: true
            });
        }

        /*columnas.add({
            header: this.idioma.cmNacionalidad,
            dataIndex: 'nacionalidad',
            default: true
        });*/
        columnas.add({
            header: this.idioma.cmExistencia,
            dataIndex: 'existencia',
            default: true,
            hidden: (_this.idsubsistema != LOG.util.Subsistemas.inventario) ? true : false
        });
        columnas.add({
            header: this.idioma.cmGanancia,
            dataIndex: 'ganancia',
            default: true,
            hidden: (_this.idsubsistema != LOG.util.Subsistemas.inventario) ? true : false,
            renderer: _this.mostrarGanancia, 

        });
        columnas.add({
            dataIndex: 'disponible_area',
            default: true,
            hidden: true
        });
        columnas.add({
            dataIndex: 'docorigen',
            default: true,
            hidden: true
        });

        return columnas;
    },
    crearColumnasServ: function(datos){
        var _this = this;
        var columnas = new LOG.util.List();

        columnas.add({
            dataIndex: 'idelementofactura'
        });
        columnas.add({
            dataIndex: 'idindicador'
        });
        columnas.add({
            dataIndex: 'idactividad'
        });
        columnas.add({
            dataIndex: 'idfactura'
        });
        columnas.add({
            dataIndex: 'servicio'
        });
        columnas.add({
            header: this.idioma.cmCodigo,
            dataIndex: 'codigoproveedor',
            default: true
        });
        columnas.add({
            header: this.idioma.cmDenominacion,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true
        });
        columnas.add({
            header: 'Naturaleza',
            dataIndex: 'naturaleza',
            width: 120,
            default: true
        });
        columnas.add({
            header: this.idioma.cmProducto,
            dataIndex: 'productos',
            default: true
        });
        columnas.add(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cmCantidad,
            dataIndex: 'cantidad',
            default: true,
            editable: true,
            editor: LOG.util.Prototipos.inputDecimal({
                listeners: {
                    focus: function(t) {
                        t.selectText(0, t.getValue().length);
                    }
                }
            })
        }));
        columnas.add({
            header: this.idioma.cmTipoPrecio,
            dataIndex: 'denominacionPrecio',
            default: true,
            editable: true,
            editor: this.cmbTipoTarifa
        });
        columnas.add({
            dataIndex: 'idtipoprecio',
            hidden: true
        });
        columnas.add(LOG.util.Prototipos.columnaPrecio({
            header: _this.idioma.cmTarifa + ' ' + _this.confFactura.monedas.codigoiso,
            dataIndex: 'preciotarifacontable',
            default: true,
            id: 'pcont',
            editor: LOG.util.Prototipos.inputDecimal({
                listeners: {
                    focus: function (t) {
                        t.selectText(0, t.getValue().length);
                    }
                }
            })
        }));
        columnas.add(LOG.util.Prototipos.columnaImporte({
            header: _this.idioma.cmTotal + ' '+_this.confFactura.monedas.codigoiso,
            dataIndex: 'impcontable',
            default: true,
            id: 'icont',
            renderer: _this.mostrarImporte
        }));

        if(alternativa){
            columnas.add(LOG.util.Prototipos.columnaPrecio({
                header: _this.idioma.cmTarifa + ' ' + _this.confFactura.monedas.codigoisoalt,
                dataIndex: 'preciotarifaalternativo',
                default: true,
                id: 'palt',
                editor: LOG.util.Prototipos.inputDecimal({
                    listeners: {
                        focus: function (t) {
                            t.selectText(0, t.getValue().length);
                        }
                    }
                })
            }));
            columnas.add(LOG.util.Prototipos.columnaImporte({
                header: _this.idioma.cmTotal + ' '+_this.confFactura.monedas.codigoisoalt,
                dataIndex: 'impalternativo',
                default: true,
                id: 'ialt',
                renderer: _this.mostrarImporte
            }));
        }

        /*Ext.each(_this.confFactura.monedas, function(dato){
            if(dato.contable || dato.alternativa) {
                columnas.add(LOG.util.Prototipos.columnaPrecio({
                    header: _this.idioma.cmTarifa + ' ' + dato.codigoiso,
                    dataIndex: (dato.contable)? 'preciotarifacontable':'preciotarifaalternativo',
                    default: true,
                    id: (dato.contable) ? 'pcont': 'palt',
                    editor: LOG.util.Prototipos.inputDecimal({
                        listeners: {
                            focus: function (t) {
                                t.selectText(0, t.getValue().length);
                            }
                        }
                    })
                }));
                columnas.add(LOG.util.Prototipos.columnaImporte({
                    header: _this.idioma.cmTotal + ' '+dato.codigoiso,
                    dataIndex: (dato.contable) ? 'impcontable' : 'impalternativo',
                    default: true,
                    id: (dato.contable) ? 'icont': 'ialt',
                    renderer: _this.mostrarImporte
                }));
            }
        });*/

        return columnas;
    },
    in_array: function(valor,array, index){
        if(!index){
            for (var i = 0; i < array.length; i++) {
                if (array[i] == valor) {
                    return true;
                }
            }
        }else{
            for (var i = 0; i < array.length; i++) {
                if (array[i][index] == valor) {
                    return i;
                }
            }
        }
        return -1;
    },
    crearStoreProd: function(datos, cls){
        var _this = this;
        var recStGridProd = Ext.data.Record.create(cls.fields);
        var autoLoad = false;
        autoLoad = (_this.accion == 'add') ? ((_this.values) ? true : false) :
            ((_this.documento && _this.documento.json.productos == 0)
                ?false
                :true);

        var store = new Ext.data.Store({
            autoLoad: autoLoad,
            url: 'cargarProductos',
            reader: new Ext.data.JsonReader({
                id: (_this.idsubsistema == LOG.util.Subsistemas.inventario) ? "idproducto": 'idelementofactura',
                root: "datos"
            }, recStGridProd),
            listeners: {
                beforeload: function(st) {
                    st.initBaseParams.accion = _this.accion;
                    st.initBaseParams.idsubsistema = _this.idsubsistema;
                    st.initBaseParams.tipoDoc = _this.tipoDoc;

                    st.baseParams.accion = _this.accion;
                    st.baseParams.idsubsistema = _this.idsubsistema;

                    st.baseParams.tipotasa = _this.confFactura.tipotasa;
                    st.initBaseParams.tipotasa = _this.confFactura.tipotasa;

                    st.baseParams.tipoDoc = _this.tipoDoc;
                    if (_this.accion == 'add') {
                        if (_this.values) {
                            st.initBaseParams.docorigen = Ext.encode(_this.values.iddocumento);
                            st.initBaseParams.iddeposito = Ext.encode(parseInt(_this.values.iddeposito));
                            st.initBaseParams.idcliente = Ext.encode(parseInt(_this.values.cliente.idcliente));

                            st.baseParams.docorigen = Ext.encode(_this.values.iddocumento);
                            st.baseParams.iddeposito = Ext.encode(parseInt(_this.values.iddeposito));
                            st.baseParams.idcliente = Ext.encode(parseInt(_this.values.cliente.idcliente));

                            st.initBaseParams.idmoneda = _this.idmoneda;
                            st.baseParams.idmoneda = _this.idmoneda;

                            st.initBaseParams.iddocumento = null;
                            st.baseParams.iddocumento = null;

                            if(_this.primeraVezProd == undefined){
                                _this.primeraVezProd = 1;
                            }else{
                                _this.primeraVezProd = 0;
                            }
                            st.initBaseParams.primeravez = _this.primeraVezProd;
                            //st.initBaseParams.datosmoneda = (_this.primeraVezProd == 1)?Ext.encode(_this.cuentamonedasuministrador):null;
                            st.baseParams.primeravez = _this.primeraVezProd;
                            //st.baseParams.datosmoneda = (_this.primeraVezProd == 1)?Ext.encode(_this.cuentamonedasuministrador):null;
                        }
                        st.initBaseParams.idtipoprecio = _this.precioDefault;
                        st.initBaseParams.datos = Ext.encode(_this.recordProd);
                        st.baseParams.idtipoprecio = _this.precioDefault;
                        st.baseParams.datos = Ext.encode(_this.recordProd);
                    } else {
                        st.initBaseParams.idcliente = _this.documento.json.idcliente;
                        st.initBaseParams.iddocumento = _this.documento.json.iddocumento;

                        st.baseParams.idcliente = _this.documento.json.idcliente;
                        st.baseParams.iddocumento = _this.documento.json.iddocumento;

                        st.initBaseParams.idmoneda = (!_this.idmoneda)?_this.documento.json.idmoneda:_this.idmoneda;
                        st.baseParams.idmoneda = (!_this.idmoneda)?_this.documento.json.idmoneda:_this.idmoneda;
                    }
                },
                load: function(st) {
                   // _this.setImporteTotal();
                    if (_this.accion == 'add') {
                        var pos = 0;
                        Ext.each(st.reader.jsonData.datosAux, function(rec) {
                            rec.tipo = 1
                            _this.recordProd[pos] = rec;
                            pos++;
                        });
                    }else{
                        _this.documento.json.arrayProd = st.reader.jsonData.datosAux;
                        st.commitChanges();
                    }
                    if (st.getCount() > 0) {
                        if(_this.cmbDeposito)
                            _this.cmbDeposito.setDisabled(true);
                        if(_this.cmbCliente)
                            _this.cmbCliente.setDisabled(true);
                        if(_this.chxReservaDisponible){
                            _this.chxReservaDisponible.disable();
                        }
                        if(_this.accion != 'add'){
                            _this.habilitarBtn(_this.documento.json.estado);
                        }
                    } else {
                        if(_this.cmbDeposito && (!_this.documento || _this.documento.json.tienepadre == 0))
                            _this.cmbDeposito.setDisabled(false);
                        if(_this.cmbCliente && (!_this.documento || _this.documento.json.tienepadre == 0))
                            _this.cmbCliente.setDisabled(false);
                        if(_this.chxReservaDisponible){
                            _this.chxReservaDisponible.enable();
                        }
                    }
                }
            }
        });
        return store;
    },
    crearStoreServ: function(datos, cls){
        var _this = this;
        var recStGridServ = Ext.data.Record.create(cls.fields);
        var autoLoad = false;
        autoLoad = (this.accion == 'add') ? ((this.values) ? true : false) : ((_this.documento.json.servicios == 0)?false:true);
        var store = new Ext.data.Store({
            autoLoad: autoLoad,
            url: 'cargarServicios',
            reader: new Ext.data.JsonReader({
                id: "idservicio",
                root: "datos"
            }, recStGridServ),
            listeners: {
                beforeload: function(st) {
                    st.initBaseParams.accion = _this.accion;
                    st.initBaseParams.idsubsistema = _this.idsubsistema;

                    st.baseParams.accion = _this.accion;
                    st.baseParams.idsubsistema = _this.idsubsistema;

                    st.baseParams.tipotasa = _this.confFactura.tipotasa;
                    st.initBaseParams.tipotasa = _this.confFactura.tipotasa;
                    if (_this.accion == 'add') {
                        st.initBaseParams.iddocumento = null;
                        st.baseParams.iddocumento = null;
                        st.initBaseParams.tipoDoc = _this.tipoDoc;
                        st.baseParams.tipoDoc = _this.tipoDoc;
                        if (_this.values) {
                            st.initBaseParams.docorigen = Ext.encode(_this.values.iddocumento);
                            st.initBaseParams.iddeposito = Ext.encode(parseInt(_this.values.iddeposito));
                            st.initBaseParams.idcliente = Ext.encode(parseInt(_this.values.cliente.idcliente));
                            st.initBaseParams.idtipoprecio = _this.tarifaDefault;

                            st.baseParams.docorigen = Ext.encode(_this.values.iddocumento);
                            st.baseParams.iddeposito = Ext.encode(parseInt(_this.values.iddeposito));
                            st.baseParams.idcliente = Ext.encode(parseInt(_this.values.cliente.idcliente));
                            st.baseParams.idtipoprecio = _this.tarifaDefault;
                            if(_this.primeraVezServ){
                                _this.primeraVezServ = 0;
                            }else{
                                _this.primeraVezServ = 1;
                            }
                            st.initBaseParams.primeravez = _this.primeraVezServ;
                            st.baseParams.primeravez = _this.primeraVezServ;
                        }
                        st.baseParams.datos = Ext.encode(_this.recordServ);
                    } else {
                        st.initBaseParams.iddocumento = _this.documento.json.iddocumento;
                        st.baseParams.iddocumento = _this.documento.json.iddocumento;

                        st.initBaseParams.idmoneda = (!_this.idmoneda)?_this.documento.json.idmoneda:_this.idmoneda;
                        st.baseParams.idmoneda = (!_this.idmoneda)?_this.documento.json.idmoneda:_this.idmoneda;
                    }
                },
                load: function(st){
                   // _this.setImporteTotal();
                    if(_this.accion == 'add'){
                        var pos = 0;
                        Ext.each(st.reader.jsonData.datosAux, function(rec) {
                            rec.tipo = 2
                            _this.recordServ[pos] = rec;
                            pos++;
                        });
                    }else{
                        if(st.getCount()>0)
                            _this.habilitarBtn(_this.documento.json.estado);
                        _this.documento.json.arrayServ = st.reader.jsonData.datosAux;
                    }
                    if(_this.seleccionAnterior != undefined){
                        _this.gpServ.getSelectionModel().selectRow(_this.seleccionAnterior);
                        _this.llenarGridProductos(_this.gpServ.getSelectionModel().getSelected());
                    }
                    if(st.getCount() == 0){
                        if(_this.panelProdServ){
                            _this.panelProdServ.collapse();
                            _this.reloadGridprodServ();
                        }

                    }
                }
            }
        });
        return store;
    },
    verificarRealOrdenado: function(e, producto){
        var _this = this;
        if(_this.accion == 'add'){
            if (_this.tipoDoc == 4) {
                    if (parseFloat(e.record.data.autorizado) < (parseFloat(e.record.data.endocumento) + parseFloat(e.value))) {
                        if(parseFloat(e.record.data.cantidad) < parseFloat(e.value)){
                            e.record.data.cantidad = parseFloat(e.value);
                            e.record.data.diferencia = 0;
                        }else{
                            e.record.data.diferencia = parseFloat(e.value) - parseFloat(e.record.data.cantidad);
                        }
                        _this.gpProd.getView().refresh();
                        return false;
                    }
            }
        }else{
            if (_this.documento.json.tipoDoc == 4) {
                if (producto == undefined) {
                    if (_this.confFactura.entregarrealordenado == "1") {//arreglar
                        var cantN = parseFloat(e.value) - parseFloat(e.record.json.cantidad);
                        if (parseFloat(e.record.data.autorizado) < (parseFloat(e.record.data.endocumento) + cantN)) {
                            mostrarMensaje(3, _this.idioma.msgAutorizadaMenorEntregado);
                            e.record.data.cantidad = e.originalValue;
                            _this.gpProd.getView().refresh();
                            return false;
                        }
                    } else {
                        var cantN = parseFloat(e.value) - parseFloat(e.record.json.cantidad);
                        if (parseFloat(e.record.data.autorizado) < (parseFloat(e.record.data.endocumento) + cantN)) {
                            e.record.data.diferencia = (parseFloat(e.record.data.endocumento) + cantN)
                            - parseFloat(e.record.data.autorizado) - parseFloat(e.record.json.diferenciaauxiliar);
                        }else{
                            e.record.data.cantidad = parseFloat(e.value);
                            e.record.data.diferencia = 0;
                        }
                        _this.gpProd.getView().refresh();
                    }
                }else{
                    if (_this.confFactura.entregarrealordenado == "1") {
                        var cantN = _this.getCantidadLotes();
                        if (parseFloat(producto.data.autorizado) < (parseFloat(producto.data.endocumento) + cantN)) {
                            mostrarMensaje(3, _this.idioma.msgAutorizadaMenorEntregado);
                            e.record.data.cantidad = e.originalValue;
                            _this.lote.getGridPrincipal().getView().refresh();
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    },
    getCantidadLotes: function(){
        var _this = this;
        var modificados = _this.lote.getGridPrincipal().getStore().getModifiedRecords();
        var lotes = _this.lote.getGridPrincipal().getStore().reader.jsonData.datosAux;
        var cantidad = 0;
        Ext.each(modificados, function(r){
            cantidad += parseFloat(r.data.cantidad) - parseFloat(r.json.cantidad);
        });
        return cantidad;
    },
    estaEnArregloRecord: function (valor, arrayRecord, needle) {
        for (var i = 0; i < arrayRecord.length; i++) {
            if (valor == arrayRecord[i].data[needle]) {
                return i;
            }
        }
        return -1;
    },
    showLotes: function(producto){
        var _this = this;
        if(producto && producto.json.tienelote == 1){
            if(!_this.productoAnterior){
                _this.productoAnterior = producto;
                if(_this.panelLotes){
                    _this.crearGridLotes(function() {
                        _this.lote.iddeposito = _this.documento.json.iddeposito;
                    });
                }
            }else{
                if(_this.productoAnterior.data.idmovimiento != producto.data.idmovimiento){
                    _this.prodductoAnterior = producto;
                    if(_this.panelLotes){
                        _this.crearGridLotes(function() {
                            _this.lote.iddeposito = _this.documento.json.iddeposito;
                        });
                    }
                }
            }
            _this.panelLotes.doLayout();
            if(_this.panelLotes){
                if(_this.panelLotes.collapsed)
                    _this.panelLotes.expand();
                else
                    _this.panelLotes.collapse();
            }
        }else{
            _this.productoAnterior = null;
            if(_this.panelLotes){
                _this.panelLotes.collapse();
                _this.panelLotes.setDisabled(true);
            }
        }
    },
    crearGridLotes: function(_fn){
        var _this = this;
        if (!_this.lote){
            LOG.lb.lote.Loader.init(function() {
                _this.lote = new LOG.lb.lote.View({
                    formaVisualizacion: 'panel',
                    panelSuperior: false,
                    btnEliminar: true,
                    ayuda: false,
                    //panelBotonesVisible: false,
                    gridEditable: true,
                    ubicacion: true,
                    datos: {
                      iddocumento: _this.documento.json.iddocumento
                    },
                    sm: _this.smGridProd,
                    iddeposito: _this.documento.json.iddeposito,
                    afectaLote: true,
                    dirController: '/logistica/facturacion/facturacion/factura/index.php/gestionarfactura',
                    actualizarMov: true,
                    compraVenta: 1,
                    grantedAction: function(_p) {
                        return true;
                    },
                    _postEliminarFn: function(){
                        _this.storeProd.reload();
                    }
                });
                _this.lote.init();
                _this.lote.insertToolbarButton(LOG.util.UIManager.createBtn({
                    text: _this.idioma.lotes,
                    tooltip: '',
                    iconCls: 'lote',
                    handler: function () {
                        LOG.lb.lote.Loader.init(function () {
                            var winLote = new LOG.lb.lote.adicionarLote({
                                idproducto: _this.gpProd.getSelectionModel().getSelected().data.idproducto,
                                idmovimiento: _this.gpProd.getSelectionModel().getSelected().data.idmovimiento,
                                iddocumento: _this.documento.json.iddocumento,
                                afectaLote: true,
                                signo: _this.gpProd.getSelectionModel().getSelected().json.signo,
                                compraVenta: 1,
                                _postSalvarFn: function () {
                                    _this.storeProd.load({
                                        callback: function () {
                                            _this.gpProd.getSelectionModel().selectRow(_this.seleccionAnteriorP);
                                        }
                                    });
                                }
                            });
                            winLote.init();
                            winLote.view();
                        });
                    }
                }),0);
                Ext.apply(_this.lote.listaColumnas.getBy('dataIndex', 'cantidad'), {
                    editor: LOG.util.Prototipos.inputDecimal({
                        listeners: {
                            focus: function(t) {
                                t.selectText(0, t.getValue().length);
                            }
                        }
                    })
                });
                _this.panelLotes.add(_this.lote.view());
                _this.lote.getGridPrincipal().on({
                    'afteredit': function(e) {
                        e.record.data.cantidadVieja = e.record.json.cantidad;
                        if(!_this.verificarRealOrdenado(e, _this.gpProd.getSelectionModel().getSelected())){
                            return;
                        }
                    },
                    beforeedit: function(e) {
                        if((_this.documento && _this.documento.json.estado != 1) || _this.tipoDoc == 5)
                            e.cancel = true;
                    }
                });
                _this.panelLotes.setDisabled(false);
                _this.panelLotes.expand();
            });
        }else{
            _this.panelLotes.setDisabled(false);
            _this.panelLotes.expand();
        }
    },
    createPnLotes: function(){
        var _this = this;
        this.panelLotes = LOG.util.UIManager.initPanel({
            title: _this.idioma.lotes,
            layout: 'fit',
            collapsible: true,
            collapseMode: 'mini',
            collapsed: true,
            region: 'south',
            height: 200,
            split: true,
            listeners: {
                beforeexpand: function(p){
                    var seleccion = _this.gpProd.getSelectionModel().getSelections();
                    if(seleccion.length == 1){
                        if(seleccion[0].json.tienelote == 0){
                            return false;
                        }
                    }else
                        return false;
                },
                expand: function(p) {
                    p.setHeight(_this.panelProd.getSize().height / 2);
                }
            }
        });
        return this.panelLotes;
    },
    createPnServicio: function() {
        var _this = this;
        if(_this.accion == 'add'){
            this.recordServ = [];
        }
        this.btnAdicionarServ = LOG.util.UIManager.createBtn({
            text: this.idioma.btnServicios,
            tooltip: this.idioma.msgAdicionarServFact,
            iconCls: 'servicio',
            disabled: true,
            handler: function() {
                if (_this.idcontrato == undefined)
                    _this.showWinServicios();
                else
                    _this.showWinServContrato();
            },
            controlFn: function (b, cl) {
                if (_this.parent.grantedAction('CT') || _this.parent.grantedAction('RCRUD') || _this.parent.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        });
        this.btnEliminarServ = LOG.util.Prototipos.botonEliminar({
            disabled: true,
            idioma: this.idioma,
            tooltip: this.idioma.msgEliminarServFact,
            handler: function() {
                mostrarMensaje(2, _this.idioma.lbQuestServiciosAEliminar, function(btn, text) {
                    if (btn === 'ok') {
                        _this.eliminarServicio();
                    }
                });
            },
            controlFn: function (b, cl) {
                if (_this.parent.grantedAction('CT') || _this.parent.grantedAction('RCRUD') || _this.parent.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        });
        this.btnAdicionarProdServ = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnAddProdServ,
            iconCls: 'producto',
            disabled: true,
            tooltip: this.idioma.msgAddServProdFact,
            handler: function() {
                _this.showWindowProducto(1, _this.gpServ.getSelectionModel().getSelected());
            },
            controlFn: function (b, cl) {
                if (_this.parent.grantedAction('CT') || _this.parent.grantedAction('RCRUD') || _this.parent.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        });
        this.btnAdicionarAftServ = LOG.util.UIManager.createBtn({
            text: 'Activos',
            iconCls: 'activosfijos',
            disabled: true,
            hidden: (typeof MATERIALESAFT === 'undefined' || MATERIALESAFT == false) ? true : false,
            tooltip: '',
            handler: function() {
                _this.showWindowAft(1, _this.gpServ.getSelectionModel().getSelected());
            },
            controlFn: function (b, cl) {
                if (_this.parent.grantedAction('CT') || _this.parent.grantedAction('RCRUD') || _this.parent.grantedAction('RAdicionar')) {
                    (typeof MATERIALESAFT === 'undefined' || MATERIALESAFT == false) ? b.hide() : b.show();
                } else {
                    b.hide();
                }
            }
        });
        this.btnEliminarProdServ = LOG.util.Prototipos.botonEliminar({
            text: this.idioma.lbBtnDelProdServ,
            disabled: true,
            tooltip: this.idioma.msgEliminarProdFact,
            handler: function() {
                mostrarMensaje(2, _this.idioma.lbQuestProductosAEliminar, function(btn, text) {
                    if (btn === 'ok') {
                        _this.eliminarProdServicio();
                    }
                });
            },
            controlFn: function (b, cl) {
                if (_this.parent.grantedAction('CT') || _this.parent.grantedAction('RCRUD') || _this.parent.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        });
        this.btnAplicarTarifa= LOG.util.UIManager.createBtn({
            text: 'Aplicar',
            tooltip: 'Aplicar tipo de precio a todos los servicios',
            iconCls: 'aplicar',
            handler: function () {
                _this.parent.modelo.aplicarTipoPrecio(_this.cmbTipoTarifaAll.getValue(), 2, _this.documento.json.iddocumento);
            },
            controlFn: function (b, called) {
                /*if (_this.parent.grantedAction('CT') || _this.parent.grantedAction('RCRUD') || _this.parent.grantedAction('RAdicionar')) {
                    b.show();
                    b.disable();
                    if (_this.accion == 'mod') {
                        _this.smGridProd.fireEvent = _this.smGridProd.fireEvent.createSequence(function (e) {
                            b.disable();
                            if (_this.smGridProd.getSelections().length > 0) {
                                if (_this.smGridProd.getSelections()[0].json.idmovimiento
                                )
                                    b.enable();
                            } else {
                                b.disable();
                            }
                        });
                        _this.storeProd.fireEvent = _this.storeProd.fireEvent.createSequence(function (e) {
                            if (e == "load") {
                                b.disable();
                                if (_this.smGridProd.getSelections().length > 0) {
                                    if (_this.smGridProd.getSelections()[0].json.idmovimiento
                                    )
                                        b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        });
                    } else {
                        b.disable();
                    }
                } else {
                    b.hide();
                }*/
            }
        });
        this.cmbTipoTarifaAll = new LOG.util.ComboBox({
            url: 'cargarTipoPrecio',
            hiddenName: 'idtipoprecio',
            valueField: 'idtipoprecio',
            displayField: 'denominacionPrecio',
            enableKeyEvents: true,
            autoLoad: false,
            editable: false
        });
        this.cmbTipoTarifa = new LOG.util.ComboBox({
            url: 'cargarTipoPrecio',
            hiddenName: 'idtipoprecio',
            valueField: 'denominacionPrecio',
            displayField: 'denominacionPrecio',
            enableKeyEvents: true,
            autoLoad: false,
            editable: false,
            listeners: {
                select: function(cmb, rd) {
                    LOG.fact.tipotarifa = {
                        data: rd.json
                    };
                }
            }
        });

        var columnas = _this.crearColumnasServ(_this.confFactura.monedas);
        this.smGridServ = LOG.util.UIManager.initSelectionModel(3, false);
        this.smGridServ.moveEditorOnEnter = false;
        this.smGridServ.on('selectionchange', function(sm) {
            if (sm.getSelections().length > 0) {
                if (!_this.deshabilitarBotonesGrids) {
                    _this.btnEliminarServ.enable();
                    _this.btnAdicionarProdServ.enable();
                    _this.btnAdicionarAftServ.enable();
                }
            }
            else{
                _this.btnEliminarServ.disable();
                _this.btnAdicionarProdServ.disable();
                _this.btnAdicionarAftServ.disable();
            }
        });
        var cls = LOG.util.UIManager.proccessColumns(columnas, this.smGridServ);
        var cmGridServ = new Ext.grid.ColumnModel(cls.columns);
        this.storeServ = _this.crearStoreServ(null, cls);
        this.gpServ = LOG.util.UIManager.initEditableGridPanel(cmGridServ, this.storeServ, this.smGridServ, {nobbar: false, roweditor: false});

        this.gridFilter = new LOG.util.GridFilter({
            grid: _this.gpServ,
            concepto: _this.idioma.fdConceptoS,
            searchTipText: _this.idioma.fdCriterio
        });
        this.gpServ.view = new Ext.grid.GridView({
            forceFit: true
        });
        this.gpServ.on('teclaPresionada', function(event, e) {
            if(_this.eS){
                if (event.which == Ext.EventObject.ENTER && _this.enterServ == false)
                {
                    _this.enterServ = true;
                    if (_this.accion == 'add') {
                        _this.modifyGridServicio(_this.eS);
                    }else if(_this.accion == 'mod'){
                        if (e.field == 'cantidad') {
                            if (e.value == 0) {
                                mostrarMensaje(1, _this.idioma.msgCantidadCeroServ);
                                e.record.data.cantidad = e.originalValue;
                                _this.gpServ.getView().refresh();
                                _this.gpServ.startEditing(e.row, e.column);
                                return;
                            }
                        }
                    }
                    _this.enterServ = false;
                }
                _this.eS = null;
            }

        });
        this.gpServ.on('afteredit', function(e) {
            _this.eS = e;
            if(e.field == 'cantidad'){
                document.onkeyup = function(event) {
                    _this.gpServ.fireEvent('teclaPresionada', event, _this.eS);
                };
                if(_this.eS){
                    _this.modifyGridServicio(_this.eS);
                }
            }else{
                if(_this.accion == 'add'){
                    _this.modifyGridServicio(e);
                }if(e.field == 'preciotarifacontable' || e.field == 'preciotarifaalternativo') {
                    if (!e.record.data.datosPrecioMoneda) {
                        e.record.data.datosPrecioMoneda = new Array();
                    }
                    if(e.field == 'preciotarifacontable'){
                        var pos = _this.in_array(_this.confFactura.monedas.idmoneda, e.record.data.datosPrecioMoneda, 'idmoneda');
                        if (pos == -1) {
                            e.record.data.datosPrecioMoneda.push({
                                idmoneda: _this.confFactura.monedas.idmoneda,
                                precio: e.record.data.preciotarifacontable
                            });
                        } else {
                            e.record.data.datosPrecioMoneda[pos].precio = e.record.data.preciotarifacontable;
                        }

                        /*Ext.each(_this.confFactura.monedas, function (moneda) {
                            if (moneda.contable) {
                                var pos = _this.in_array(moneda.idmoneda, e.record.data.datosPrecioMoneda, 'idmoneda');
                                if (!pos) {
                                    e.record.data.datosPrecioMoneda.push({
                                        idmoneda: moneda.idmoneda,
                                        precio: e.record.data.preciotarifacontable
                                    });
                                } else {
                                    e.record.data.datosPrecioMoneda[pos].precio = e.record.data.preciotarifacontable;
                                }
                            }
                        });*/
                    }else{
                        var pos = _this.in_array(_this.confFactura.monedas.idmonedaalternativa, e.record.data.datosPrecioMoneda, 'idmoneda');
                        if (pos == -1) {
                            e.record.data.datosPrecioMoneda.push({
                                idmoneda: _this.confFactura.monedas.idmonedaalternativa,
                                precio: e.record.data.preciotarifaalternativo
                            });
                        } else {
                            e.record.data.datosPrecioMoneda[pos].precio = e.record.data.preciotarifaalternativo;
                        }
                        /*Ext.each(_this.confFactura.monedas, function (moneda) {
                            if (moneda.alternativa) {
                                var pos = _this.in_array(moneda.idmoneda, e.record.data.datosPrecioMoneda, 'idmoneda');
                                if (!pos) {
                                    e.record.data.datosPrecioMoneda.push({
                                        idmoneda: moneda.idmoneda,
                                        precio: e.record.data.preciotarifaalternativo
                                    });
                                } else {
                                    e.record.data.datosPrecioMoneda[pos].precio = e.record.data.preciotarifaalternativo;
                                }
                            }
                        });*/
                    }
                    e.record.data.denominacionPrecio = '-';
                    e.record.data.idtipoprecio = -2;
                    e.record.data.cambioTipoTarifa = 1;
                    _this.gpServ.getView().refresh();
                }else{
                    e.record.data.denominacionPrecio = LOG.fact.tipotarifa.data.denominacionPrecio;
                    e.record.data.idtipoprecio = LOG.fact.tipotarifa.data.idtipoprecio;
                    e.record.data.cambioTipoTarifa = 1;
                    _this.gpServ.getView().refresh();
                    Ext.Ajax.request({
                        url: 'getPrecioProducto',
                        method: 'post',
                        params: {
                            datos: Ext.encode(e.record.data)
                        },
                        success: function(rp) {
                            var value = Ext.decode(rp.responseText);

                            Ext.each(value.precio, function (precio) {
                                if (precio.preciocontable != undefined) {
                                    e.record.data.preciotarifacontable = precio.preciocontable;
                                    var importe = Math.round(precio.preciocontable * e.record.data.cantidad * 100) / 100;
                                    e.record.data.impcontable = (importe).toFixed(2);
                                } else {
                                    e.record.data.preciotarifaalternativo = precio.precioalternativo;
                                    var importe = Math.round(precio.precioalternativo * e.record.data.cantidad * 100) / 100;
                                    e.record.data.impalternativo = (importe).toFixed(2);
                                }
                            });
                            _this.gpServ.getView().refresh();
                        }
                    });
                }
            }
        });

        this.gpServ.on('beforeedit', function(e) {
            if(e.field == 'denominacionPrecio'){
                if(_this.cmbTipoTarifa.getStore().getCount() <= 1 && e.record.data.idtipoprecio != -2){
                    e.cancel = true;
                }
            }
            if (_this.accion == 'ver' || _this.tipoDoc == 5) {
                e.cancel = true;
            }
            if(e.record.data.idactividad){
                if (e.field == 'denominacionPrecio')
                    e.cancel = true;
            }
            if(e.field == 'cantidad' && _this.idsubsistema == LOG.util.Subsistemas.talleres && _this.in_array(e.record.json.idnaturaleza, idnaturaleza) == -1){
                e.cancel = true;
            }
            if(e.field == 'preciotarifacontable' || e.field == 'preciotarifaalternativo'){
                if(_this.idsubsistema == LOG.util.Subsistemas.inventario || _this.idsubsistema == LOG.util.Subsistemas.talleres){
                    if (!_this.parent.grantedAction('RPrecio')) {
                        e.cancel = true;
                    }
                }
            }
        });
        this.gpServ.on('rowclick', function(g) {
            var seleccion = g.getSelectionModel().getSelections();
            if (seleccion.length > 0){
                if(!_this.deshabilitarBotonesGrids){
                    _this.btnEliminarServ.enable();
                }
            }
            else
                _this.btnEliminarServ.disable();

            if(seleccion.length == 1){
                if(seleccion[0].json.productos > 0){
                    _this.panelProdServ.expand();
                    _this.reloadGridprodServ(_this.gpServ.getSelectionModel().getSelected());
                }
                else{
                    _this.btnEliminarProdServ.disable();
                    _this.panelProdServ.collapse();
                    _this.reloadGridprodServ();
                }
                if (_this.btnAdicionarProdServ.disabled){
                    if(!_this.deshabilitarBotonesGrids){
                        _this.btnAdicionarProdServ.enable();
                    }
                }
                if (_this.btnAdicionarAftServ.disabled){
                    if(!_this.deshabilitarBotonesGrids){
                        _this.btnAdicionarAftServ.enable();
                    }
                }
            }else{
                _this.panelProdServ.collapse();
                _this.btnAdicionarProdServ.disable();
                _this.btnAdicionarAftServ.disable();
                _this.reloadGridprodServ();
            }
        });
        this.gpServ.getSelectionModel().on('rowselect', function(sm, index, r) {
            _this.seleccionAnterior = index;
        });
        this.panelServ = LOG.util.UIManager.initPanel({
            title: this.idioma.tServicio,
            layout: 'border',
            region: 'center',
            tbar: ['-',
                this.btnAdicionarServ,
                this.btnEliminarServ,
                this.btnAdicionarProdServ,
                this.btnAdicionarAftServ,
                this.btnEliminarProdServ,
                '->',new Ext.form.Label({text: _this.idioma.cmTipoPrecio}), '&nbsp',_this.cmbTipoTarifaAll, '-',_this.btnAplicarTarifa,'-'],
            items: [this.gpServ]
        });
        this.panelServ.add(this.getPnProdServ());
        return this.panelServ;
    },
    reloadGridprodServ: function(servicio){
        var _this = this;
        if(servicio){
            if(!_this.servicioAnterior){
                _this.servicioAnterior = servicio;
                this.llenarGridProductos(servicio);
            }else{
                if(_this.servicioAnterior.data.idindicador){
                    if(_this.servicioAnterior.data.idindicador != servicio.data.idindicador){
                        _this.servicioAnterior = servicio;
                        this.llenarGridProductos(servicio);
                    }
                }else{
                    if(_this.servicioAnterior.data.idactividad != servicio.data.idactividad){
                        _this.servicioAnterior = servicio;
                        this.llenarGridProductos(servicio);
                    }
                }
            }
        }else{
            _this.servicioAnterior = null;
            _this.storeProdServ.removeAll();
        }

    },
    llenarGridProductos: function(servicio){
        var _this = this;
        if(servicio){
            _this.storeProdServ.initBaseParams.datos = Ext.encode(servicio.json.materiales);
            _this.storeProdServ.initBaseParams.idmoneda = _this.idmoneda;//(_this.accion == 'add') ? _this.idmoneda : _this.documento.json.idmoneda;
            if(servicio.json.materiales){
                servicio.data.productos = servicio.json.materiales.length;
                servicio.json.productos = servicio.json.materiales.length;
            }
            _this.gpServ.getView().refresh();
            if(_this.panelProdServ.collapsed && (servicio.json.materiales && servicio.json.materiales.length > 0)){
                _this.panelProdServ.expand();
            }else if((servicio.json.materiales && servicio.json.materiales.length == 0) || !servicio.json.materiales){
                _this.panelProdServ.collapse();
                _this.btnEliminarProdServ.disable();
            }
            if(servicio.json.materiales && servicio.json.materiales.length > 0)
                _this.storeProdServ.load({
                    callback: function(st){
                        if(_this.accion == 'add'){
                            _this.recordServ[_this.getPosDatRecord(_this.recordServ, servicio.data)].materiales = _this.storeProdServ.reader.jsonData.datosAux;
                        }
                    }
                });
        }
    },
    getPnProdServ: function() {
        var _this = this;
        this.listColProdServ = new LOG.util.List();
        this.listColProdServ.add({
            dataIndex: 'idprodservicio'
        });
        this.listColProdServ.add({
            dataIndex: 'idelementofactura'
        });
        this.listColProdServ.add({
            dataIndex: 'idindicador'
        });
        this.listColProdServ.add({
            header: this.idioma.cmCodigo,
            dataIndex: 'codigo',
            default: true
        });
        if (_this.idsubsistema == LOG.util.Subsistemas.activosfijos) {
            this.listColProdServ.add({
                header: this.idioma.cmNumeroSerie,
                dataIndex: 'nroserie',
                default: true
            });
        }
        this.listColProdServ.add({
            header: this.idioma.cmDenominacion,
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true
        });
        this.listColProdServ.add({
            header: this.idioma.cmUnidadMedida,
            dataIndex: 'umedida',
            default: true
        });
        this.listColProdServ.add(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cmCantidad,
            dataIndex: 'cantidad',
            default: true,
            editable: true,
            editor: LOG.util.Prototipos.inputEntero({
                listeners: {
                    focus: function(t) {
                        t.selectText(0, t.getValue().length);
                    }
                }
            })
        }));
        _this.listColProdServ.add(LOG.util.Prototipos.columnaPrecio({
            header: _this.idioma.cmPrecio + ' ' + _this.confFactura.monedas.codigoiso,
            dataIndex: 'preciocontable',
            default: true,
            id:'pcont',
            editor: LOG.util.Prototipos.inputDecimal({
                listeners: {
                    focus: function(t) {
                        t.selectText(0, t.getValue().length);
                    }
                }
            })
        }));
        _this.listColProdServ.add(LOG.util.Prototipos.columnaImporte({
            header: _this.idioma.cmImporte + ' ' + _this.confFactura.monedas.codigoiso,
            dataIndex: 'importecontable',
            default: true,
            id: 'icont',
            renderer: _this.mostrarImporte
        }));
        if(alternativa){
            _this.listColProdServ.add(LOG.util.Prototipos.columnaPrecio({
                header: _this.idioma.cmPrecio + ' ' + _this.confFactura.monedas.codigoisoalt,
                dataIndex: 'precioalternativo',
                default: true,
                id:'palt'
            }));
            _this.listColProdServ.add(LOG.util.Prototipos.columnaImporte({
                header: _this.idioma.cmImporte + ' ' + _this.confFactura.monedas.codigoisoalt,
                dataIndex: 'importealternativo',
                default: true,
                id: 'ialt',
                renderer: _this.mostrarImporte
            }));
        }
        this.listColProdServ.add({
            header: 'Descuento',
            dataIndex: 'descuento',
            renderer: _this.mostrarImporte,
            default: true
        });
        /*Ext.each(_this.confFactura.monedas, function (dato) {
            if (dato.contable || dato.alternativa) {
                _this.listColProdServ.add(LOG.util.Prototipos.columnaPrecio({
                    header: _this.idioma.cmPrecio + ' ' + dato.codigoiso,
                    dataIndex: (dato.contable) ? 'preciocontable' : 'precioalternativo',
                    default: true,
                    id: (dato.contable) ? 'pcont' : 'palt'
                }));
                _this.listColProdServ.add(LOG.util.Prototipos.columnaImporte({
                    header: _this.idioma.cmImporte + ' ' + dato.codigoiso,
                    dataIndex: (dato.contable) ? 'importecontable' : 'importealternativo',
                    default: true,
                    id: (dato.contable) ? 'icont' : 'ialt',
                    renderer: _this.mostrarImporte
                }));
            }
        });*/
        this.listColProdServ.add({
            header: 'Nro. inventario',
            dataIndex: 'nroinventario',
            default: true
        });
        this.listColProdServ.add({
            header: 'Matr\xedcula',
            dataIndex: 'matricula',
            default: true
        });
        this.listColProdServ.add({
            header: 'Indicativo',
            dataIndex: 'indicativo',
            default: true
        });
        this.listColProdServ.add({
            header: 'Centro costo',
            dataIndex: 'centrocosto',
            default: true
        });
        this.listColProdServ.add({
            header: 'Entidad',
            dataIndex: 'entidad',
            default: true
        });
        this.listColProdServ.add({
            header: this.idioma.cmNacionalidad,
            dataIndex: 'nacionalidad',
            default: true
        });
        this.smGridProdServ = LOG.util.UIManager.initSelectionModel(3, false);
        this.smGridProdServ.moveEditorOnEnter = false;
        var cls = LOG.util.UIManager.proccessColumns(this.listColProdServ, this.smGridProdServ);
        this.cmGridProdServ = new Ext.grid.ColumnModel(cls.columns);
        this.recStGridProdServ = Ext.data.Record.create(cls.fields);
        this.storeProdServ = new Ext.data.Store({
            url: 'cargarProductosServicios',
            reader: new Ext.data.JsonReader({
                id: "idproducto",
                root: "datos"
            }, this.recStGridProdServ),
            listeners: {
                beforeload: function(st) {
                },
                load: function(st){
                    if(!_this.gpProdServ.getSelectionModel().hasSelection()){
                        _this.btnEliminarProdServ.disable();
                    }
                }
            }
        });
        this.gpProdServ = LOG.util.UIManager.initEditableGridPanel(this.cmGridProdServ, this.storeProdServ, this.smGridProdServ, {nobbar: false});
        this.smGridProdServ.on('selectionchange', function(sm) {
            if (sm.getSelections().length > 0){
                if(!_this.deshabilitarBotonesGrids){
                    _this.btnEliminarProdServ.enable();
                }
            }
            else
                _this.btnEliminarProdServ.disable();
        });

        this.gpProdServ.on('rowclick', function(g) {
            if (g.getSelectionModel().getSelections().length > 0){
                if(!_this.deshabilitarBotonesGrids){
                    _this.btnEliminarProdServ.enable();
                }
            }
            else
                _this.btnEliminarProdServ.disable();
        });
        this.gpProdServ.on('beforeedit', function(e) {
            if(_this.accion == 'ver' || _this.idsubsistema == LOG.util.Subsistemas.activosfijos){
                e.cancel = true;
            }
        });
        this.gpProdServ.on('teclaPresionada', function(event, e) {
            if (event.which == Ext.EventObject.ENTER && _this.enterServ == false)
            {
                _this.enterServ = true;
                _this.enterProdServ = true;
                if (_this.accion == 'add') {
                    _this.modifyGridProdServicio(e);
                }else if(_this.accion == 'mod'){
                    var importeproducto = Math.round(e.record.data.precio * e.record.data.cantidad * 100) / 100;
                    e.record.data.importetotal = (importeproducto).toFixed(2);
                    _this.gpProdServ.getView().refresh();
                    if (_this.smGridProdServ.hasNext()) {
                        _this.smGridProdServ.selectRow(e.row + 1, false);
                        _this.gpProdServ.startEditing(e.row + 1, e.column);
                    } else {
                        _this.smGridProdServ.selectRow(0, false);
                        _this.gpProdServ.startEditing(0, e.column);
                    }

                }
                _this.enterServ = false;
                _this.enterProdServ = false;
            }
        });
        this.gpProdServ.on('afteredit', function(e) {
            document.onkeyup = function(event) {
                _this.gpProdServ.fireEvent('teclaPresionada', event, e);
            };
        });
        this.panelProdServ = LOG.util.UIManager.initPanel({
            title: _this.idioma.tProductosServicios,
            layout: 'fit',
            collapsible: true,
            collapseMode: 'mini',
            collapsed: true,
            region: 'south',
            height: 200,
            split: true,
            listeners: {
                beforeexpand: function(p){
                    var seleccion = _this.gpServ.getSelectionModel().getSelections();
                    if(seleccion.length == 1){
                        if(seleccion[0].json.productos == 0){
                            return false;
                        }
                    }else
                        return false;
                },
                expand: function(p) {
                    _this.reloadGridprodServ(_this.gpServ.getSelectionModel().getSelected());
                    p.setHeight(_this.panelServ.getSize().height / 2);
                }
            },
            items: [this.gpProdServ]
        });
        return this.panelProdServ;
    },
    habilitarBtnProductoServ: function(){
        var _this = this;
        if(_this.accion == 'add' || _this.accion == 'mod'){
            var producto = false;
            var servicio = false;
            if(
                (_this.cmbCliente && _this.cmbCliente.getValue() != '' && _this.cmbCliente.getValue() != null)/* &&
                (_this.cmbCBC && _this.cmbCBC.getValue() != '' && _this.cmbCBC.getValue() != null) &&
                (_this.cmbCondicionPago && _this.cmbCondicionPago.getValue() != '' && _this.cmbCondicionPago.getValue() != null)*/
            ){
                if(_this.tipoDoc != 1){
                    if(_this.cmbSerie){
                        if(_this.cmbSerie.getValue() != '' && _this.cmbSerie.getValue() != null){
                            servicio = true;
                            if(_this.cmbDeposito){
                                if(_this.cmbDeposito.getValue() != '' && _this.cmbDeposito.getValue() != null /*&& LOG.fact.comboDeposito.depositoAreas.length > 0*/){
                                    producto = true;
                                }else{
                                    producto = false;
                                }
                            }else{
                                producto = true;
                            }
                        }else{
                            servicio = false;
                        }
                    }else{
                        servicio = true;
                        if(_this.cmbDeposito){
                            if(_this.cmbDeposito.getValue() != '' && _this.cmbDeposito.getValue() != null/* && LOG.fact.comboDeposito.depositoAreas.length > 0*/){
                                producto = true;
                            }else{
                                producto = false;
                            }
                        }else{
                            producto = true;
                        }
                    }
                }else{
                    servicio = true;
                    if(_this.cmbDeposito){
                        if(_this.cmbDeposito.getValue() != '' && _this.cmbDeposito.getValue() != null/* && LOG.fact.comboDeposito.depositoAreas.length > 0*/){
                            producto = true;
                        }else{
                            producto = false;
                        }
                    }else{
                        producto = true;
                    }
                }
            }
            if(producto && _this.btnAdicionarProd && !_this.values && !_this.deshabilitarBotonesGrids){
                if (!_this.reservadisponible)
                    _this.btnAdicionarProd.enable();

            }else{
                if(_this.btnAdicionarProd)
                    _this.btnAdicionarProd.disable();
            }
            if(producto && _this.btnAdicionarProdAlm && !_this.values && !_this.deshabilitarBotonesGrids){
                _this.btnAdicionarProdAlm.enable();

            }else{
                if(_this.btnAdicionarProdAlm)
                    _this.btnAdicionarProdAlm.disable();
            }
            if(servicio && _this.btnAdicionarServ && !_this.values && !_this.deshabilitarBotonesGrids){
                _this.btnAdicionarServ.enable();
            }else{
                if(_this.btnAdicionarServ)
                    _this.btnAdicionarServ.disable();
            }
            if(_this.tipoDoc == 8) {
              _this.btnAdicionarServ.enable();
              _this.btnEliminarServ.enable();
            }
        }else{
            if(_this.btnAdicionarProd)
                _this.btnAdicionarProd.disable();
            if(_this.btnAdicionarProdAlm)
                _this.btnAdicionarProdAlm.disable();
            if(_this.btnAdicionarServ)
                _this.btnAdicionarServ.disable();
        }
        _this.onActions();
    },
    showWinServicios: function(){
        var _this = this;
        var idServSeleccionados = [];
        var idActSeleccionadas = [];
        if(_this.accion == 'add'){
            Ext.each(_this.recordServ, function(rec) {
                /*if(rec.idindicador)
                    idServSeleccionados.push(rec.idindicador);
                else
                    idServSeleccionados.push(rec.idactividad);*/
            });
        }else{
            if (_this.storeServ.reader.jsonData) {
                /*Ext.each(_this.storeServ.reader.jsonData.datosAux, function(rec) {
                    if(rec.idindicador)
                        idServSeleccionados.push(rec.idindicador);
                    else
                        idServSeleccionados.push(rec.idactividad);
                });*/
            }
        }

        _this.windowSA = new LOG.fact.winServActv({
            idioma: _this.idioma
        });
        _this.windowSA.addTabToTemplete(new LOG.fact.GridServActiv({
            idioma: _this.idioma,
            title: _this.idioma.tlServiciosNomenclador,
            idComponent: 0,
            tipoDoc: _this.tipoDoc,
            concepto: _this.idioma.conceptoServicios,
            idseleccionados: Ext.encode(idServSeleccionados),//(idServSeleccionados.length) ?Ext.encode(idServSeleccionados):null,
            textBusquedaSimple: _this.idioma.fdCriterio
        }));
        if(_this.confFactura.planificacion == 1){
            /*_this.windowSA.addTabToTemplete(new LOG.fact.GridServActiv({
                idioma: _this.idioma,
                title: _this.idioma.tlActividades,
                idComponent: 1,
                concepto: _this.idioma.conceptoActividades,
                idseleccionados: (idServSeleccionados.length) ? Ext.encode(idServSeleccionados) : null,
                iddocumento: (_this.documento) ? _this.documento.json.iddocumento : null,
                textBusquedaSimple: _this.idioma.fdCriterio
            }));*/
        }
        _this.windowSA.init();

        _this.winAddDocumento = _this.windowSA.view({
            title: _this.idioma.tlVentanaServicios,
            width: 800,
            height: 400,
            constrain: true
        });
        _this.winAddDocumento.show();
        _this.windowSA.on({
            'tabchange': function() {
                _this.windowSA.getSelectedTabIndex();
                _this.winAddDocumento.listaBotones.arrayData[1].disable();
                _this.winAddDocumento.listaBotones.arrayData[2].disable();
            }
        });
        _this.winAddDocumento.listaBotones.arrayData[1].disable();
        _this.winAddDocumento.listaBotones.arrayData[2].disable();

        _this.windowSA.getTemplateByIndex(0).getGridPrincipal().getSelectionModel().on('selectionchange', function(sm) {
            if(sm.getSelections().length > 0){
                _this.winAddDocumento.listaBotones.arrayData[1].enable();
                _this.winAddDocumento.listaBotones.arrayData[2].enable();
            }else{
                _this.winAddDocumento.listaBotones.arrayData[1].disable();
                _this.winAddDocumento.listaBotones.arrayData[2].disable();
            }
        });
        if(_this.confFactura.planificacion == 1){
        console.log(_this.windowSA.getTemplateByIndex(0));
        console.log(_this.windowSA.getTemplateByIndex(1));
            _this.windowSA.getTemplateByIndex(0).getGridPrincipal().getSelectionModel().on('selectionchange', function (sm) {
                if (sm.getSelections().length > 0) {
                    _this.winAddDocumento.listaBotones.arrayData[1].enable();
                    _this.winAddDocumento.listaBotones.arrayData[2].enable();
                } else {
                    _this.winAddDocumento.listaBotones.arrayData[1].disable();
                    _this.winAddDocumento.listaBotones.arrayData[2].disable();
                }
            });
        }
        _this.winAddDocumento.aceptarFn = function() {
            var seleccionServicios = _this.windowSA.getTemplateByIndex(0).getSmPrincipal().getSelections();
           /* var seleccionActividades = (_this.confFactura.planificacion == 1) ? _this.windowSA.getTemplateByIndex(1).getSmPrincipal().getSelections() : new Array();*/
            if (_this.windowSA.getSelectedTabIndex() == 0 && seleccionServicios.length > 0) {
                if (_this.accion == 'add') {
                    Ext.each(seleccionServicios, function(rec) {
                        rec.json.cantidad = 1;
                        rec.json.preciotarifa = rec.json.precio;
                        rec.json.preciotarifabase = rec.json.precio;
                        rec.json.productos = 0;
                        rec.json.idtipoprecio = _this.tarifaDefault;
                        _this.recordServ.push(rec.json);
                    });
                    _this.guardarDatos('add',true, _this.windowSA);
                }else {
                    _this.addServicioDocumento(seleccionServicios, _this.windowSA);

                }
            }else if (_this.windowSA.getSelectedTabIndex() == 1 && seleccionActividades.length > 0) {
                if (_this.accion == 'add') {
                    Ext.each(seleccionActividades, function(rec) {
                        rec.json.cantidad = 1;
                        rec.json.idactividad = rec.json.idactividad;
                        rec.json.materiales = new Array();
                        rec.json.preciotarifa = rec.json.costo;
                        rec.json.preciotarifabase = rec.json.costo;
                        Ext.each(rec.json.arraynorma, function(mat){
                            mat.cantidad = mat.cantplanif;
                            mat.importetotal = mat.cantplanif * mat.precio;
                            mat.preciobase = mat.precio;
                            mat.umedida = mat.abreviaturaunidadmedida;
                            rec.json.materiales.push(mat);
                        });
                        rec.json.productos = rec.json.materiales.length
                        _this.recordServ.push(rec.json);
                    });
                    _this.guardarDatos('add',true);
                }else {
                    _this.addServicioDocumento(seleccionActividades);

                }
            }
        };
    },
    showWinServContrato: function(){
        var _this = this;
        _this.windowServCont = new LOG.fact.contratos({
            idioma: _this.idioma,
            usarAplicar: false,
            title: _this.idioma.titleServiciosCOntrato,
            idcontrato: _this.idcontrato,
            servicios: 1,
            _parent: _this
        });

        _this.windowServCont.show();

        _this.windowServCont.aceptarFn = function() {
            var seleccionServicios = _this.windowServCont.pGdList.getSmPrincipal().getSelections();
            if (_this.accion == 'add') {
                Ext.each(seleccionServicios, function(rec) {
                    if(rec.json.idhito == undefined){
                        rec.json.cantidad = rec.json.cantidad;
                        rec.json.preciotarifa = rec.json.precio;
                        rec.json.preciotarifabase = rec.json.precio;
                        rec.json.productos = 0;
                        rec.json.idtipoprecio = _this.tarifaDefault;
                        _this.recordServ.push(rec.json);
                    }else{
                       Ext.each(rec.json.indicadoresservicios, function(s){
                           s.idhito = rec.json.idhito;
                           s.preciotarifa = s.precio;
                           s.preciotarifabase = s.precio;
                           s.productos = 0;
                           s.idtipoprecio = -2/*_this.tarifaDefault*/;
                           _this.recordServ.push(s);
                       });
                       /*Ext.each(rec.json.indicadoresproductos, function(p){
                           p.productos = 0;
                           p.idtipoprecio = -2;
                           _this.recordProd.push(p);
                       })*/
                    }
                });
                _this.guardarDatos('add',true, _this.windowServCont);
            }else {
                _this.addServicioDocumento(seleccionServicios, _this.windowServCont);

            }
        };
    },
    showWinProdContrato: function(){
        var _this = this;
        _this.windowProdCont = new LOG.fact.contratos({
            idioma: _this.idioma,
            usarAplicar: false,
            title: _this.idioma.titleProductosCOntrato,
            idcontrato: _this.idcontrato,
            productos: 1,
            _parent: _this
        });

        _this.windowProdCont.show();

        _this.windowProdCont.aceptarFn = function() {
            var seleccionProductos = _this.windowProdCont.pGdList.getSmPrincipal().getSelections();
            if (_this.accion == 'add') {
                Ext.each(seleccionProductos, function(rec) {
                    if(rec.json.idhito == undefined){
                        rec.json.cantidad = rec.json.cantidad;
                        rec.json.precio = rec.json.precio;
                        rec.json.preciobase = rec.json.precio;
                        rec.json.idtipoprecio = _this.precioDefault;
                        _this.recordProd.push(rec.json);
                    }else{
                        Ext.each(rec.json.indicadoresservicios, function(s){
                            s.idhito = rec.json.idhito;
                            s.preciotarifa = s.precio;
                            s.preciotarifabase = s.precio;
                            s.productos = 0;
                            s.idtipoprecio = _this.tarifaDefault;
                            _this.recordServ.push(s);
                        });
                        /*Ext.each(rec.json.indicadoresproductos, function(p){
                            p.productos = 0;
                            p.idtipoprecio = _this.precioDefault;
                            _this.recordProd.push(p);
                        })*/
                    }
                });
                _this.guardarDatos('add',true, _this.windowProdCont);
            }else {
                _this.addProductoDocumento(seleccionProductos, _this.windowProdCont);

            }
        };
    },
    showWindowProducto: function(tipo, servicio) {
        var _this = this;
        var idseleccionados = [];
        var parametros = {};
        parametros.iddocumento = null;
        if (tipo == 1 && !servicio) {
            if (_this.accion == 'add') {
                Ext.each(_this.recordProd, function(rec) {
                    idseleccionados.push(rec.idproducto);
                });
            } else {
                parametros.iddocumento = _this.documento.json.iddocumento;
                if (_this.storeProd.reader.jsonData) {
                    Ext.each(_this.storeProd.reader.jsonData.datosAux, function(rec) {
                        idseleccionados.push(rec.idproducto);
                    });
                }
            }
            parametros.tipo = tipo;
            //if(_this.cmbDeposito){
                //parametros.idestructura = _this.cmbDeposito.getValue();
            parametros.idseleccionados = Ext.encode(idseleccionados);
            parametros.idestructura = Ext.encode(depositos);
            parametros.conexistencia = 1;
            parametros.condisponible = 1;
            parametros.comprometida = true;
            //}
            var configProd = {
                idioma: _this.idioma,
                _parent: _this,
                usarFiltroArea: false,
                usarAplicar: true,
                parametros: parametros,
                usarFiltroDeposito: true,
                doAction: function(r) {
                    if (_this.accion == 'add') {
                        var disponible = true;
                        if (tipo == 1) {
                            Ext.each(r, function(rec) {
                                if(rec.json.disponible < 0){
                                    disponible = false;
                                }
                                rec.data.idtipoprecio = _this.precioDefault;
                                rec.data.idindicador = rec.json.idindicador;
                                rec.data.cantidad = 0;
                                _this.recordProd.push(rec.data);
                            });
                            if(disponible)
                                _this.guardarDatos('add',true);
                            else{
                                mostrarMensaje(3, _this.idioma.msgDisponibleNegativo);
                                _this.recordProd = [];
                            }
                        }
                    } else {
                        _this.addProductoDocumento(r);
                    }
                }
            };
            _this.p = new LOG.lb.documento.VentanaProductos(configProd);
            _this.p.init();
            _this.vistaProductos = _this.p.view();
            _this.vistaProductos.show();
        } else {
            if(servicio){
                Ext.each(servicio.json.materiales, function(rec) {
                    //idseleccionados.push(rec.idindicador);
                });
            }
            else
            {
                Ext.each(_this.recordServ, function(rec) {
                    //idseleccionados.push(rec.idindicador);
                });
            }
            parametros.idseleccionados = Ext.encode(idseleccionados);
            parametros.almacenado = 0;
            LOG.inv.maestroproductos.Loader.init(function() {
                var v = new LOG.lb.maestroproductos.UIProductos({
                    tipo: tipo,
                    constrain: true,
                    usarAplicar: true,
                    parametros: parametros,
                    doAction: function(r) {
                        if (_this.accion == 'add') {
                            if(tipo == 1){
                                Ext.each(r, function(rec) {
                                    rec.data.idtipoprecio = _this.precioDefault;
                                    rec.data.idindicador = rec.json.idindicador;
                                    if(!servicio.json.materiales)
                                        servicio.json.materiales = new Array();
                                    rec.data.preciobase = rec.data.precio;
                                    rec.data.importetotal = rec.data.cantidad * rec.data.precio;
                                    servicio.json.materiales.push(rec.data)

                                });
                                for (var i = 0; i < _this.recordServ.length; i++) {
                                    if (_this.recordServ[i].idindicador && _this.recordServ[i].idindicador == servicio.data.idindicador) {
                                        _this.recordServ[i].materiales = servicio.json.materiales;
                                        _this.recordServ[i].productos = servicio.json.materiales.length;
                                        break;
                                    }else{
                                        if (_this.recordServ[i].idactividad && _this.recordServ[i].idactividad == servicio.data.idactividad) {
                                            _this.recordServ[i].materiales = servicio.json.materiales;
                                            _this.recordServ[i].productos = servicio.json.materiales.length;
                                            break;
                                        }
                                    }
                                }
                                _this.llenarGridProductos(servicio);
                            }else{
                                Ext.each(r, function(rec) {
                                    rec.json.cantidad = 1;
                                    rec.json.preciotarifa = rec.json.precio;
                                    rec.json.preciotarifabase = rec.json.precio;
                                    rec.json.idtipoprecio = _this.tarifaDefault;
                                    _this.recordServ.push(rec.json);
                                });
                                _this.guardarDatos('add',true);
                            }
                        } else {
                            (tipo == 1)?_this.addProductoServicio(r, this):_this.addServicioDocumento(r);

                        }
                    }
                });
                v.show();
            })
        }
    },
    showWindowAft: function(tipo, servicio) {
        var _this = this;
        var idseleccionados = [];
        var parametros = {};
        parametros.iddocumento = null;
        parametros.idseleccionados = Ext.encode(idseleccionados);

        var idServSeleccionados = [];
        var idActSeleccionadas = [];

        _this.windowSAct = new LOG.fact.winServActv({
            idioma: _this.idioma
        });
        _this.windowSAct.addTabToTemplete(new LOG.fact.GridServActiv({
            idioma: _this.idioma,
            title: 'Listado de Activos Fijos',
            idComponent: 2,
            tipoDoc: _this.tipoDoc,
            concepto: '',
            idseleccionados: Ext.encode(idServSeleccionados),//(idServSeleccionados.length) ?Ext.encode(idServSeleccionados):null,
            textBusquedaSimple: _this.idioma.fdCriterio
        }));
        _this.windowSAct.init();

        _this.winAddDocumento = _this.windowSAct.view({
            title: 'Activos',
            width: 800,
            height: 400,
            constrain: true
        });
        _this.winAddDocumento.show();
        _this.windowSAct.on({
            'tabchange': function() {
                _this.windowSAct.getSelectedTabIndex();
                _this.winAddDocumento.listaBotones.arrayData[1].disable();
                _this.winAddDocumento.listaBotones.arrayData[2].disable();
            }
        });
        _this.winAddDocumento.listaBotones.arrayData[1].disable();
        _this.winAddDocumento.listaBotones.arrayData[2].disable();

        _this.windowSAct.getTemplateByIndex(0).getGridPrincipal().getSelectionModel().on('selectionchange', function(sm) {
            if(sm.getSelections().length > 0){
                _this.winAddDocumento.listaBotones.arrayData[1].enable();
                _this.winAddDocumento.listaBotones.arrayData[2].enable();
            }else{
                _this.winAddDocumento.listaBotones.arrayData[1].disable();
                _this.winAddDocumento.listaBotones.arrayData[2].disable();
            }
        });
        _this.winAddDocumento.aceptarFn = function() {
            var activos = _this.windowSAct.getTemplateByIndex(0).getSmPrincipal().getSelections();
            console.info(activos);
            if (_this.accion == 'add') {

            }else {
                _this.addProductoServicio(activos, this);

            }
        };

    },
    showWindowProductoAlm: function(tipo, servicio) {
        var _this = this;
        var idseleccionados = [];
        var parametros = {};
        parametros.iddocumento = null;
        if (tipo == 1 && !servicio) {
            if (_this.accion == 'add') {
                Ext.each(_this.recordProd, function(rec) {
                    idseleccionados.push(rec.idproducto);
                });
            } else {
                parametros.iddocumento = _this.documento.json.iddocumento;
                if (_this.storeProd.reader.jsonData) {
                    Ext.each(_this.storeProd.reader.jsonData.datosAux, function(rec) {
                        idseleccionados.push(rec.idproducto);
                    });
                }
            }
            parametros.tipo = tipo;
            //if(_this.cmbDeposito){
                //parametros.idestructura = _this.cmbDeposito.getValue();
            parametros.idseleccionados = Ext.encode(idseleccionados);
            parametros.idestructura = Ext.encode(depositos);
            parametros.conexistencia = 0;
            parametros.condisponible = 0;
            //parametros.comprometida = true;
            //}
            var configProd = {
                idioma: _this.idioma,
                _parent: _this,
                usarFiltroArea: false,
                usarAplicar: true,
                parametros: parametros,
                usarFiltroDeposito: true,
                doAction: function(r) {
                    if (_this.accion == 'add') {
                        var disponible = true;
                        if (tipo == 1) {
                            Ext.each(r, function(rec) {
                                if(rec.json.disponible < 0){
                                    disponible = false;
                                }
                                rec.data.idtipoprecio = _this.precioDefault;
                                rec.data.idindicador = rec.json.idindicador;
                                rec.data.cantidad = 0;
                                _this.recordProd.push(rec.data);
                            });
                            if(disponible)
                                _this.guardarDatos('add',true);
                            else{
                                mostrarMensaje(3, _this.idioma.msgDisponibleNegativo);
                                _this.recordProd = [];
                            }
                        }
                    } else {
                        _this.addProductoDocumento(r);
                    }
                }
            };
            _this.p = new LOG.lb.documento.VentanaProductos(configProd);
            _this.p.init();
            _this.vistaProductos = _this.p.view();
            _this.vistaProductos.show();
        } else {
            if(servicio){
                Ext.each(servicio.json.materiales, function(rec) {
                    idseleccionados.push(rec.idindicador);
                });
            }
            else
            {
                Ext.each(_this.recordServ, function(rec) {
                    idseleccionados.push(rec.idindicador);
                });
            }
            parametros.idseleccionados = Ext.encode(idseleccionados);
            parametros.almacenado = 0;
            LOG.inv.maestroproductos.Loader.init(function() {
                var v = new LOG.lb.maestroproductos.UIProductos({
                    tipo: tipo,
                    constrain: true,
                    usarAplicar: true,
                    parametros: parametros,
                    doAction: function(r) {
                        if (_this.accion == 'add') {
                            if(tipo == 1){
                                Ext.each(r, function(rec) {
                                    rec.data.idtipoprecio = _this.precioDefault;
                                    rec.data.idindicador = rec.json.idindicador;
                                    if(!servicio.json.materiales)
                                        servicio.json.materiales = new Array();
                                    rec.data.preciobase = rec.data.precio;
                                    rec.data.importetotal = rec.data.cantidad * rec.data.precio;
                                    servicio.json.materiales.push(rec.data)

                                });
                                for (var i = 0; i < _this.recordServ.length; i++) {
                                    if (_this.recordServ[i].idindicador && _this.recordServ[i].idindicador == servicio.data.idindicador) {
                                        _this.recordServ[i].materiales = servicio.json.materiales;
                                        _this.recordServ[i].productos = servicio.json.materiales.length;
                                        break;
                                    }else{
                                        if (_this.recordServ[i].idactividad && _this.recordServ[i].idactividad == servicio.data.idactividad) {
                                            _this.recordServ[i].materiales = servicio.json.materiales;
                                            _this.recordServ[i].productos = servicio.json.materiales.length;
                                            break;
                                        }
                                    }
                                }
                                _this.llenarGridProductos(servicio);
                            }else{
                                Ext.each(r, function(rec) {
                                    rec.json.cantidad = 1;
                                    rec.json.preciotarifa = rec.json.precio;
                                    rec.json.preciotarifabase = rec.json.precio;
                                    rec.json.idtipoprecio = _this.tarifaDefault;
                                    _this.recordServ.push(rec.json);
                                });
                                _this.guardarDatos('add',true);
                            }
                        } else {
                            (tipo == 1)?_this.addProductoServicio(r, this):_this.addServicioDocumento(r);

                        }
                    }
                });
                v.show();
            })
        }
    },
    showClientesEstructuras: function(){
        var _this = this;
        var window = new LOG.fact.winClientesEstructuras({
            idioma: _this.idioma,
            usarAplicar: false
        });
        /*window.addTabToTemplete(new LOG.fact.GridClientesEstructuras({
            idioma: _this.idioma,
            title: _this.idioma.tlEstructuras,
            idComponent: 0,
            concepto: _this.idioma.conceptoEstructuras,
            textBusquedaSimple: _this.idioma.fdEstructura
        }));*/
        window.addTabToTemplete(new LOG.fact.GridClientesEstructuras({
            idioma: _this.idioma,
            title: _this.idioma.tlClientes,
            idComponent: 1,
            concepto: _this.idioma.conceptoClientes,
            textBusquedaSimple: _this.idioma.fdCliente
        }));
        window.init();

        _this.winTransportadora = window.view({
            title: _this.idioma.tlOrgTransportadora,
            width: 600,
            height: 400,
            constrain: true
        });
        _this.winTransportadora.show();
        window.on({
            'tabchange': function() {
                window.getTemplateByIndex(window.getSelectedTabIndex()).getGridPrincipal().getSelectionModel().clearSelections();

                _this.winTransportadora.listaBotones.arrayData[2].disable();
            }
        });
        window.on({
            'beforetabchange': function() {
                window.getTemplateByIndex(window.getSelectedTabIndex()).getGridPrincipal().getSelectionModel().clearSelections();
            }
        });
        _this.winTransportadora.listaBotones.arrayData[1].hide();
        _this.winTransportadora.listaBotones.arrayData[2].disable();


        window.getTemplateByIndex(0).getGridPrincipal().on('rowclick', function(g) {
            if(g.getSelectionModel().getSelections().length > 0){
                _this.winTransportadora.listaBotones.arrayData[2].enable();
            }else{
                _this.winTransportadora.listaBotones.arrayData[2].disable();
            }
        });
        /*window.getTemplateByIndex(1).getGridPrincipal().on('rowclick', function(g) {
            if(g.getSelectionModel().getSelections().length > 0){
                _this.winTransportadora.listaBotones.arrayData[2].enable();
            }else{
                _this.winTransportadora.listaBotones.arrayData[2].disable();
            }
        });*/
        window.getTemplateByIndex(0).getGridPrincipal().on('rowdblclick', function(g) {
            _this.winTransportadora.aceptarFn();
            _this.winTransportadora.close();
        });
        /*window.getTemplateByIndex(1).getGridPrincipal().on('rowdblclick', function(g) {
            _this.winTransportadora.aceptarFn();
            _this.winTransportadora.close();
        });*/
        _this.winTransportadora.aceptarFn = function() {
            // var seleccionEstructuras = window.getTemplateByIndex(0).getSmPrincipal().getSelections();
            var seleccionClientes = window.getTemplateByIndex(0).getSmPrincipal().getSelections();
            /*if (window.getSelectedTabIndex() == 0 && seleccionEstructuras.length > 0) {
                _this.idproveedor = seleccionEstructuras[0].json.id;
                _this.cmbOrganTransp.setValue(seleccionEstructuras[0].json.id);
                _this.cmbOrganTransp.setRawValue(seleccionEstructuras[0].json.text);

                _this.cmbOrganTransp.fireEvent('change', _this.cmbOrganTransp,
                    seleccionEstructuras[0].json.id,
                    _this.cmbOrganTransp.originalValue);

                _this.tiporgtransp = 1;
            }else */if (window.getSelectedTabIndex() == 0 && seleccionClientes.length > 0) {
                _this.idproveedor = seleccionClientes[0].json.idclientesproveedores;
                _this.cmbOrganTransp.setValue(seleccionClientes[0].json.idclientesproveedores);
                _this.cmbOrganTransp.setRawValue(seleccionClientes[0].json.nombre);

                _this.cmbOrganTransp.fireEvent('change', _this.cmbOrganTransp,
                    seleccionClientes[0].json.idclientesproveedores,
                    _this.cmbOrganTransp.originalValue);

                _this.tiporgtransp = 0;
            } else {

            }
        };
    },showContratos: function(){
        var _this = this;
        _this.windowContratos = new LOG.fact.contratos({
            idioma: _this.idioma,
            usarAplicar: false,
            title: _this.idioma.titlecontrato,
            idcliente: _this.idcliente,
            _parent: _this
        });
        _this.windowContratos.pGdList.getGridPrincipal().on('rowdblclick', function(g) {
            _this.windowContratos.aceptarFn();
            _this.windowContratos.close();
        });
        _this.windowContratos.show();

        _this.windowContratos.aceptarFn = function() {
            var contrato = _this.windowContratos.pGdList.getSmPrincipal().getSelected();

            //_this.cmbCliente.setValue(contrato.json.idclienteproveedor);
            //_this.cmbCliente.setRawValue(contrato.json.clienteproveedor);
            _this.cmbCliente.getStore().load({
                params:{
                    limit: null
                },
                callback: function(st){
                    _this.cmbCliente.setValue(contrato.json.idclienteproveedor);
                    _this.cmbCliente.fireEvent('select', _this.cmbCliente,
                        _this.cmbCliente.getStore().getById(contrato.json.idclienteproveedor),
                        _this.cmbCliente.getStore().indexOfId(contrato.json.idclienteproveedor));
                }
            });
            _this.cmbCliente.setDisabled(true);
            _this.fechaContrato.setValue(contrato.json.fechafirma);
            _this.idcontrato = contrato.json.idcontrato;

            _this.txtNroContrato.setValue(contrato.json.numerocontrato);
            _this.txtNroContrato.setRawValue(contrato.json.numerocontrato);
            _this.txtNroContrato.fireEvent('change', _this.txtNroContrato,
                contrato.json.numerocontrato,
                _this.txtNroContrato.originalValue);

            /*var seleccionClientes = window.getTemplateByIndex(1).getSmPrincipal().getSelections();
            if (window.getSelectedTabIndex() == 0 && seleccionEstructuras.length > 0) {
                _this.idproveedor = seleccionEstructuras[0].json.id;
                _this.cmbOrganTransp.setValue(seleccionEstructuras[0].json.id);
                _this.cmbOrganTransp.setRawValue(seleccionEstructuras[0].json.text);

                _this.cmbOrganTransp.fireEvent('change', _this.cmbOrganTransp,
                    seleccionEstructuras[0].json.id,
                    _this.cmbOrganTransp.originalValue);

                _this.tiporgtransp = 1;
            }else if (window.getSelectedTabIndex() == 1 && seleccionClientes.length > 0) {
                _this.idproveedor = seleccionClientes[0].json.idclientesproveedores;
                _this.cmbOrganTransp.setValue(seleccionClientes[0].json.idclientesproveedores);
                _this.cmbOrganTransp.setRawValue(seleccionClientes[0].json.nombre);

                _this.cmbOrganTransp.fireEvent('change', _this.cmbOrganTransp,
                    seleccionClientes[0].json.idclientesproveedores,
                    _this.cmbOrganTransp.originalValue);

                _this.tiporgtransp = 0;
            } else {

            }*/
        };
    },
    aceptarFn: function() {

    },
    setImporteTotal: function(moneda) {
        var _this = this;
        var importe, importeAlt = 0;
        //var monedaFactura = -1;

        importe = _this.documento.json.importes.importecontable;
        importeCMC = _this.documento.json.importes.importeconceptocup;
        importe = Ext.util.Format.number(importe, '0,000.00');
        importeCMC = Ext.util.Format.number(importeCMC, '0,000.00');
        _this.lblImporteTotal.setText(_this.idioma.lblImporteTotal + ' ' + _this.confFactura.monedas.codigoiso + ': ' + importe);
        _this.lblImporteTotalMF.setText(_this.idioma.lblImporteTotalMF + ': ' + importeCMC);

        if(alternativa){
            importeAlt = _this.documento.json.importes.importealternativo;
            importeAlt = Ext.util.Format.number(importeAlt, '0,000.00');
            _this.lblImporteTotalAlt.setText(_this.idioma.lblImporteTotal+' '+ _this.confFactura.monedas.codigoisoalt + ': ' + importeAlt);
        } else {
            _this.lblImporteTotal.setText(_this.idioma.lblImporteTotal + ': ' + importe);
        }
        //ARREGLAR ESTO PARA LA MULTIMONEDA
        /*Ext.each(_this.confFactura.monedas, function (moneda) {
            if(_this.documento.json.idmoneda){
                if(moneda.idmoneda == _this.documento.json.idmoneda){
                    monedaFactura = moneda;
                }
            }
            if (moneda.contable) {
                importe = _this.documento.json.importes.importecontable;
                importe = Ext.util.Format.number(importe, '0,000.00');
                _this.lblImporteTotal.setText(_this.idioma.lblImporteTotal + ' ' + moneda.codigoiso + ': ' + importe);
            } else if (moneda.alternativa == '1') {
                importeAlt = _this.documento.json.importes.importealternativo;
                importeAlt = Ext.util.Format.number(importeAlt, '0,000.00');
                _this.lblImporteTotalAlt.setText(_this.idioma.lblImporteTotal+' '+ moneda.codigoiso + ': ' + importeAlt);
            }
        });
        if(monedaFactura != -1){
            if (_this.lblImporteTotalAlt == undefined){
                importe = (_this.documento.json.importes.importecontable / _this.documento.json.factorconvercion) * _this.documento.json.tasacambio;
                importe = Ext.util.Format.number(importe, '0,000.00');
                _this.lblImporteTotal.setText(_this.idioma.lblImporteTotal + ' ' + monedaFactura.codigoiso + ': ' + importe);
            }else{
                importeAlt = (_this.documento.json.importes.importealternativo / _this.documento.json.factorconvercion) * _this.documento.json.tasacambio;
                importeAlt = Ext.util.Format.number(importeAlt, '0,000.00');
                _this.lblImporteTotalAlt.setText(_this.idioma.lblImporteTotal + ' ' + monedaFactura.codigoiso + ': ' + importeAlt);
            }
        }*/
    },
    findProducto: function(producto, array) {
        for (var i = 0; i < array.length; i++) {
            if (producto == array[i].data.idproducto) {
                return true;
            }
        }
        return false;
    },
    findServicio: function(servicio, array) {
        for (var i = 0; i < array.length; i++) {
            if(array[i].data.idindicador){
                if (servicio == array[i].data.idindicador) {
                    return true;
                }
            }else if(array[i].data.idactividad){
                if (servicio == array[i].data.idactividad) {
                    return true;
                }
            }
        }
        return false;
    },
    mostrarGanancia: function(id,obj,dt) {
            var ganancia = '';
            if(dt.data.preciocontable != undefined && dt.data.pcontable != undefined && dt.data.cantidad != undefined && dt.data.preciocontable != ""){
                ganancia = (dt.data.pcontable - dt.data.preciocontable) * dt.data.cantidad;
                return Ext.util.Format.number(ganancia, '0,000.00');
            }else{
                ganancia = '-';
                return ganancia; 
            }
        },
    mostrarImporte: function(id, obj, dt) {
        var importe = (id) ? Math.round(id * 100) / 100 : 0;
        return (importe).toFixed(2);
    },
    mostrarImporteTotal: function(id, obj, dt) {
        var importe = (dt.data.importetotal) ? Math.round(dt.data.importetotal * 100) / 100 : 0;
        return (importe).toFixed(2);
    },
    modifyGridProducto: function(e, enter) {
        var _this = this;
        if(_this.accion == 'add' || _this.accion == 'mod'){
            if (e.field == 'cantidad') {
                var importeproducto = Math.round(_this.e.record.data.pcontable * e.value * 100) / 100;
                var importealt = Math.round(_this.e.record.data.palternativo * e.value * 100) / 100;
                if (parseFloat(e.value) > parseFloat(e.record.data.disponible_area)) {
                    mostrarMensaje(1, _this.idioma.msgNoDisponible);
                    e.record.data.cantidad = e.originalValue;
                    _this.gpProd.getView().refresh();
                    _this.gpProd.startEditing(e.row, e.column);
                    _this.enterProd = false;
                    return;
                } else {
                    e.record.data.impcontable = (importeproducto).toFixed(2);
                    e.record.data.impalternativo = (importealt).toFixed(2);
                    e.record.data.precio = e.record.json.precio;
                    e.record.set('impcontable', e.record.data.impcontable);
                    e.record.set('impalternativo', e.record.data.impalternativo);
                    _this.storeProd.getAt(e.row).data = e.record.data;
                    _this.gpProd.getView().refresh();
                    e.record.data.tipo = 1;
                    if(_this.accion == 'add')
                        e.record.commit();
                    if(_this.recordProd && _this.accion == 'add')
                        _this.recordProd[_this.getPosDatRecord(_this.recordProd, e.record.data)] = e.record.data;
                    if (_this.smGridProd.hasNext() && enter) {
                        _this.smGridProd.selectRow(e.row + 1, false);
                        _this.gpProd.startEditing(e.row + 1, e.column);
                    } else if(enter){
                        _this.smGridProd.selectRow(0, false);
                        _this.gpProd.startEditing(0, e.column);
                    }
                }
                _this.enterProd = false;
            } else if (e.field == 'denominacionPrecio') {
                e.record.data.denominacionPrecio = LOG.fact.tipoprecio.data.denominacionPrecio;
                e.record.data.idtipoprecio = LOG.fact.tipoprecio.data.idtipoprecio;
                e.record.commit();
                var pos = _this.getPosDatRecord(_this.recordProd, e.record.data);
                _this.recordProd[pos] = e.record.data;
                _this.storeProd.load({
                    callback: function(r, options, success) {
                        if (success) {
                            _this.gpProd.getSelectionModel().selectRow(_this.seleccionAnteriorP);
                            _this.gpProd.getView().refresh();
                            if (_this.smGridProd.hasNext()) {
                                _this.smGridProd.selectRow(e.row + 1, false);
                                _this.gpProd.startEditing(e.row + 1, e.column);
                            } else {
                                _this.smGridProd.selectRow(0, false);
                                _this.gpProd.startEditing(0, e.column);
                            }
                        }
                    }
                });

            }else{
                e.record.data.denominacionPrecio = '-';
                e.record.data.idtipoprecio = -2;
                e.record.data.precio = e.value;
                e.record.commit();
                var pos = _this.getPosDatRecord(_this.recordProd, e.record.data);
                _this.recordProd[pos] = e.record.data;
            }
        }
    },
    modifyGridServicio: function(e) {
        var _this = this;
        if (e.field == 'cantidad') {
            if (e.field == 'cantidad') {
                if (e.value == 0) {
                    mostrarMensaje(1, _this.idioma.msgCantidadCeroServ);
                    e.record.data.cantidad = e.originalValue;
                    _this.gpServ.getView().refresh();
                    _this.gpServ.startEditing(e.row, e.column);
                    return;
                }
            }
            var tarifacontable = Math.round(e.record.data.preciotarifa * e.record.data.cantidad * 100) / 100;
            e.record.data.importe = (tarifacontable).toFixed(2);
            _this.storeServ.getAt(e.row).data = e.record.data;
            e.record.set('importe', e.record.data.importe);
            if(_this.accion == 'add'){
                e.record.commit();
                var pos = _this.getPosDatRecord(_this.recordServ, e.record.data);
                var materiales = _this.recordServ[pos].materiales;
                _this.recordServ[pos] = e.record.data;
                _this.recordServ[pos].materiales = materiales;
                _this.recordServ[pos].tipo = 2;
            }
            _this.enterServ = false;
        }else if (e.field == 'denominacionPrecio') {
            e.record.data.denominacionPrecio = LOG.fact.tipotarifa.data.denominacionPrecio;
            e.record.data.idtipoprecio = LOG.fact.tipotarifa.data.idtipoprecio;
            e.record.commit();
            var pos = _this.getPosDatRecord(_this.recordServ, e.record.data);
            var materiales = _this.recordServ[pos].materiales;
            _this.recordServ[pos] = e.record.data;
            _this.recordServ[pos].materiales = materiales;
            _this.recordServ[pos].tipo = 2;
            _this.storeServ.load({
                callback: function(r, options, success) {
                    if (success) {
                        _this.gpServ.getSelectionModel().selectRow(_this.seleccionAnterior);
                        _this.gpServ.getView().refresh();
                        if (_this.smGridServ.hasNext()) {
                            _this.smGridServ.selectRow(e.row + 1, false);
                            _this.gpServ.startEditing(e.row + 1, e.column);
                        } else {
                            _this.smGridServ.selectRow(0, false);
                            _this.gpServ.startEditing(0, e.column);
                        }
                    }
                }
            });

        }
    },
    modifyGridProdServicio: function(e) {
        var _this = this;
        if (e.field == 'cantidad') {
            var importeproducto = Math.round(e.record.data.precio * e.record.data.cantidad * 100) / 100;
            e.record.data.importetotal = (importeproducto).toFixed(2);
            _this.storeProdServ.getAt(e.row).data = e.record.data;
            e.record.set('importetotal', e.record.data.importetotal);
            e.record.commit();
            var posServ = _this.getPosDatRecord(_this.recordServ, _this.gpServ.getSelectionModel().getSelected().data);
            var posMaterial = _this.getPosDatRecord(_this.recordServ[posServ].materiales, e.record.data);
            _this.recordServ[posServ].materiales[posMaterial] = e.record.data;
            _this.gpServ.getSelectionModel().getSelected().json.materiales = _this.recordServ[posServ].materiales;
            if (_this.smGridProdServ.hasNext()) {
                _this.smGridProdServ.selectRow(e.row + 1, false);
                _this.gpProdServ.startEditing(e.row + 1, e.column);
            } else {
                _this.smGridProdServ.selectRow(0, false);
                _this.gpProdServ.startEditing(0, e.column);
            }
        }
    },
    getPosDatRecord: function(record, data) {
        if (record[0].idproducto) {
            for (var i = 0; i < record.length; i++) {
                if (record[i].idproducto == data.idproducto) {
                    return i;
                }
            }
        }else if(record[0].idindicador){
            for (var i = 0; i < record.length; i++) {
                if (record[i].idindicador == data.idindicador) {
                    return i;
                }
            }
        }
        else if(record[0].idactividad){
            for (var i = 0; i < record.length; i++) {
                if (record[i].idactividad == data.idactividad) {
                    return i;
                }
            }
        }
        else {
            for (var i = 0; i < record.length; i++) {
                if (record[i].idservicio == data.idservicio) {
                    return i;
                }
            }
        }
    },
    addProductoDocumento: function(record, v) {
        var _this = this;
        var productos = [];
        var disponible = true;
        var idprod = [];
        Ext.each(record, function(rec) {
            if(rec.json.disponible < 0){
                disponible = false;
            }
            rec.data.idtipoprecio = _this.precioDefault;
            rec.data.idindicador = rec.json.idindicador;
            idprod.push(rec.json.idindicador);
            rec.data.cantidad = 0;
            productos.push(rec.data);
        });
        var datos = {
            productos: productos,
            documento: _this.documento.json.iddocumento,
            idsubsistema: _this.idsubsistema,
            idmoneda: _this.documento.json.idmoneda,
            oferta: ((_this.tipoDoc == 1)?1:null)
        };
        if(disponible){
            Ext.MessageBox.wait(_this.idioma.msgGuardando, _this.idioma.msgEspere || '...');
            Ext.Ajax.request({
                url: 'adicionarProducto',
                method: 'post',
                params: {
                    datos: Ext.encode(datos)
                },
                success: function(rp) {
                    Ext.MessageBox.hide();
                    _this.recargar = true;
                    _this.storeProd.reload({
                        callback: function(st){
                            if(st.length > 0){
                                _this.gpProd.getSelectionModel().selectFirstRow();
                            }
                        }
                    });
                    if(_this.p){
                        _this.p.storePrincipal.reload();
                    }else if(v.isVisible()){
                        v.parametros.idseleccionados = Ext.encode(Ext.decode(v.panelProductos.getStorePrincipal().baseParams.idseleccionados).concat(idprod));
                        v.panelProductos.getStorePrincipal().load({
                            params: {
                                start: v.panelProductos.getStorePrincipal().lastOptions.params.start,
                                limit: v.panelProductos.getStorePrincipal().lastOptions.params.limit
                            }
                        });
                    }
                }
            });
        }
        else{
            mostrarMensaje(3, _this.idioma.msgDisponibleNegativo);
        }
    },
    eliminarProducto: function(seleccion) {
        var _this = this;
        if (_this.accion == 'add') {
            var recorProdAux = [];
            for (var i = 0; i < seleccion.length; i++) {
                _this.storeProd.remove(seleccion[i]);
            }
            for (var i = 0; i < _this.recordProd.length; i++) {
                if (!_this.findProducto(_this.recordProd[i].idproducto, seleccion)) {
                    recorProdAux.push(_this.recordProd[i]);
                }
            }

            _this.recordProd = recorProdAux;
            if(_this.recordProd.length == 0){
                if(_this.chxReservaDisponible){
                    _this.chxReservaDisponible.enable();
                }
            }
            if(_this.cmbDeposito)
                _this.cmbDeposito.setDisabled(false);
            if(_this.cmbCliente)
                _this.cmbCliente.setDisabled(false);//reset los datos del panel(falta)
            _this.storeProd.reload();

        } else {
            var movimientos = new Array();
            Ext.each(seleccion, function(sel) {
                movimientos.push((sel.json.idmovimiento)?sel.json.idmovimiento:sel.json.idelementofactura);
            });
            Ext.MessageBox.wait(_this.idioma.msgEliminando, _this.idioma.msgEspere || '...');
            Ext.Ajax.request({
                url: 'eliminarProdFactura',
                method: 'post',
                params: {
                    datos: Ext.encode(movimientos),
                    idsubsistema: _this.idsubsistema,
                    iddocumento:seleccion[0].json.iddocumento || seleccion[0].json.idfactura
                },
                success: function(rp) {
                    var value = Ext.decode(rp.responseText);
                    _this.documento.json.importes = value.importes;
                    _this.setImporteTotal();
                    Ext.MessageBox.hide();
                    _this.recargar = true;
                    _this.storeProd.reload({
                        callback: function(st){
                            if(st.length > 0){
                                _this.gpProd.getSelectionModel().selectFirstRow();
                            }
                            mostrarMensaje(1, _this.idioma.lbMsgProductoEliminado);
                        }
                    });
                }
            });
        }
    },
    eliminarServicio: function(){
        var _this = this;
        var seleccion = _this.smGridServ.getSelections();
        if (_this.accion == 'add') {
            var recorServAux = [];
            for (var i = 0; i < seleccion.length; i++) {
                _this.storeServ.remove(seleccion[i]);
            }
            for (var i = 0; i < _this.recordServ.length; i++) {
                if(_this.recordServ[i].idindicador){
                    if (!_this.findServicio(_this.recordServ[i].idindicador, seleccion)) {
                        recorServAux.push(_this.recordServ[i]);
                    }
                }else if(_this.recordServ[i].idactividad){
                    if (!_this.findServicio(_this.recordServ[i].idactividad, seleccion)) {
                        recorServAux.push(_this.recordServ[i]);
                    }
                }
            }
            _this.recordServ = recorServAux;
            _this.storeServ.load();
        }else{
            var servicios = new Array();
            Ext.each(seleccion, function(sel) {
                servicios.push(sel.json.idelementofactura);
            });
            Ext.MessageBox.wait(_this.idioma.msgEliminando, _this.idioma.msgEspere || '...');
            Ext.Ajax.request({
                url: 'eliminarServFactura',
                method: 'post',
                params: {
                    datos: Ext.encode(servicios),
                    documento: seleccion[0].json.idfactura
                },
                success: function(rp) {
                    var value = Ext.decode(rp.responseText);
                    _this.documento.json.importes = value.importes;
                    _this.setImporteTotal();
                    Ext.MessageBox.hide();
                    _this.recargar = true;
                    _this.storeServ.reload({
                        callback: function(st){
                            mostrarMensaje(1, _this.idioma.lbMsgServicioEliminado);
                        }
                    });
                }
            });
        }
    },
    eliminarProdServicio: function(){
        var _this = this;
        var seleccion =  _this.gpProdServ.getSelectionModel().getSelections();
        if (_this.accion == 'add') {
            var posServ = _this.getPosDatRecord(_this.recordServ, _this.gpServ.getSelectionModel().getSelected().data);
            var recorProdServAux = [];
            for (var i = 0; i < seleccion.length; i++) {
                _this.storeProdServ.remove(seleccion[i]);
            }
            for (var i = 0; i < _this.recordServ[posServ].materiales.length; i++) {
                if (!_this.findServicio(_this.recordServ[posServ].materiales[i].idindicador, seleccion)) {
                    recorProdServAux.push(_this.recordServ[posServ].materiales[i]);
                }
            }
            _this.recordServ[posServ].materiales = recorProdServAux;
            _this.recordServ[posServ].productos = recorProdServAux.length;
            _this.storeServ.load();
            if(_this.seleccionAnterior){
                _this.gpServ.getSelectionModel().selectRow(_this.seleccionAnterior);
                _this.llenarGridProductos(_this.gpServ.getSelectionModel().getSelected());
            }
            if(_this.recordServ[posServ].productos == 0){
                _this.panelProdServ.collapse();
            }
        }else{
            var productos = new Array();
            Ext.each(seleccion, function(sel) {
                productos.push(sel.json.idprodservicio);
                _this.storeProdServ.remove(sel);
            });
            Ext.MessageBox.wait(_this.idioma.msgEliminando, _this.idioma.msgEspere || '...');
            Ext.Ajax.request({
                url: 'eliminarProdServicio',
                method: 'post',
                params: {
                    datos: Ext.encode(productos)
                },
                success: function(rp) {
                    var value = Ext.decode(rp.responseText);
                    _this.documento.json.importes = value.importes;
                    _this.setImporteTotal();
                    Ext.MessageBox.hide();
                    _this.storeServ.reload({
                        callback: function(){
                            _this.gpServ.getSelectionModel().selectRow(_this.seleccionAnterior);
                            _this.llenarGridProductos(_this.gpServ.getSelectionModel().getSelected());
                            mostrarMensaje(1, _this.idioma.lbMsgProductoEliminado);
                        }
                    });
                }
            });
        }
    },
    addServicioDocumento: function(record, v) {
        var _this = this;
        var servicios = [];
        var idprod = [];
        Ext.each(record, function(rec) {
            if(rec.json.idhito == undefined){
                rec.data.idindicador = rec.json.idindicador;
                idprod.push(rec.json.idindicador);
                rec.data.preciotarifa = rec.json.precio;
                rec.data.preciotarifabase = rec.json.precio;
                rec.data.tipo = 2;
                rec.data.cantidad = 1;
                rec.data.idtipoprecio = _this.tarifaDefault;
                rec.data.materiales = rec.json.arraynorma || Array();
                rec.data.productos = rec.data.materiales.length;
                servicios.push(rec.data);
            } else {
                Ext.each(rec.json.indicadoresservicios, function(s){
                    s.idhito = rec.json.idhito;
                    s.preciotarifa = s.precio;
                    s.preciotarifabase = s.precio;
                    s.productos = 0;
                    s.idtipoprecio = -2/*_this.tarifaDefault*/;
                    servicios.push(s);
                });
            }

        });
        var datos = {};
        datos.servicios = servicios;
        datos.documento = _this.documento.json.iddocumento;
        datos.idmoneda = _this.documento.json.idmoneda;
        datos.idcontrato = _this.idcontrato;
        Ext.MessageBox.wait(_this.idioma.msgGuardando, _this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'adicionarServicio',
            method: 'post',
            params: {
                datos: Ext.encode(datos)
            },
            success: function(rp) {
                var value = Ext.decode(rp.responseText);
                _this.documento.json.importes = value.importes;
                _this.setImporteTotal();
                Ext.MessageBox.hide();
                _this.recargar = true;
                _this.storeServ.reload();
                if(_this.windowSA){
                    if(_this.windowSA.getSelectedTabIndex() == 0){
                        if (v && v.isVisible()) {
                            var idsel = Ext.encode(Ext.decode(v.getTemplateByIndex(0).storePrincipal.baseParams.idseleccionados).concat(idprod));
                            /*v.getTemplateByIndex(0).storePrincipal.initBaseParams.idseleccionados = idsel;
                            v.getTemplateByIndex(0).storePrincipal.baseParams.idseleccionados = idsel;*/
                            v.getTemplateByIndex(0).storePrincipal.load({
                                params: {
                                    start: (v.getTemplateByIndex(0).storePrincipal.lastOptions.params) ? v.getTemplateByIndex(0).storePrincipal.lastOptions.params.start:0,
                                    limit: (v.getTemplateByIndex(0).storePrincipal.lastOptions.params) ? v.getTemplateByIndex(0).storePrincipal.lastOptions.params.limit : 30
                                }
                            });
                        }
                    }else if(_this.windowSA.getSelectedTabIndex() == 1){
                        _this.windowSA.getTemplateByIndex(1).storePrincipal.reload();
                    }
                }

            }
        });
    },
    addProductoServicio: function(record, v) {
        var _this = this;
        var productos = [];
        var idproductos = [];
        var servicio = _this.gpServ.getSelectionModel().getSelected();
        Ext.each(record, function(rec) {
            rec.data.idindicador = rec.json.idindicador;
            idproductos.push(rec.json.idindicador);
            //rec.data.preciotarifa = rec.json.precio;
            rec.data.cantidad = 1;
            rec.data.idelementofactura = servicio.data.idelementofactura;
            rec.data.idtipoprecio = servicio.data.idtipoprecio;
            productos.push(rec.data);
        });
        var datos = {};
        datos.productos = productos;
        datos.idmoneda = _this.documento.json.idmoneda;
        Ext.MessageBox.wait(_this.idioma.msgGuardando, _this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'adicionarProdServ',
            method: 'post',
            params: {
                datos: Ext.encode(datos)
            },
            success: function(rp) {
                var value = Ext.decode(rp.responseText);
                _this.documento.json.importes = value.importes;
                _this.setImporteTotal();
                Ext.MessageBox.hide();
                _this.storeServ.reload({
                    callback: function(){
                        _this.gpServ.getSelectionModel().selectRow(_this.seleccionAnterior);
                        _this.llenarGridProductos(_this.gpServ.getSelectionModel().getSelected());
                    }
                });
                if (v.isVisible()) {
                    //v.parametros.idseleccionados = Ext.encode(Ext.decode(v.panelProductos.getStorePrincipal().baseParams.idseleccionados).concat(idproductos));
                    v.panelProductos.getStorePrincipal().load({
                        params: {
                            start: v.panelProductos.getStorePrincipal().lastOptions.params.start,
                            limit: v.panelProductos.getStorePrincipal().lastOptions.params.limit
                        }
                    });
                }
            }
        });
    },
    guardarDatos: function(accion, apl, v) {
        var _this = this;
        if(_this.formularioBasico.getForm().isValid() && _this.txtAObservaciones.isValid()){
            if(_this.panelDatosTransp){
                //if(_this.panelDatosTransp.getForm().isValid()){
                    var datos = _this.crearObjDatos(accion);
                    if (datos) {
                        datos.accion = accion;
                        datos.idsubsistema = _this.idsubsistema;
                        datos.idoperacion = _this.idoperacion;
                        if (_this.hizoCambios == undefined || _this.hizoCambios == true) {
                            _this.recargar = (apl) ? true : false;
                            _this.enviarDatos(datos, apl, v);
                        }
                    }
            }else{
                var datos = _this.crearObjDatos(accion);
                if(datos){
                    datos.accion = accion;
                    datos.idsubsistema = _this.idsubsistema;
                    datos.idoperacion = _this.idoperacion;
                    if (_this.hizoCambios == undefined || _this.hizoCambios == true) {
                        _this.recargar = (apl) ? true : false;
                        _this.enviarDatos(datos, apl, v);
                    }
                }
            }
        }else{
            if(!_this.values){
                _this.recordProd = [];
                _this.recordServ = [];
            }
        }

    },
    crearObjDatos: function(accion) {
        var _this = this;
        var datos = null;
        if (accion == 'add') {
            datos = _this.datosAdd();
        } else {
            datos = _this.datosMod();
        }
        return datos;
    },
    datosMod: function() {
        var _this = this;
        var obj = {};
        obj.iddocumento = _this.documento.json.iddocumento;
        if(_this.cmbDeposito){
            if (_this.documento.json.iddeposito != _this.cmbDeposito.getValue() && _this.cmbDeposito.getValue() != '' && _this.cmbDeposito.getValue() != null) {
                obj.iddeposito = _this.cmbDeposito.getValue();
                _this.hizoCambios = true;
            }
        }
        if(_this.cmbCentroCosto){
            if (_this.documento.json.idcentrocosto != _this.cmbCentroCosto.getValue() && _this.cmbCentroCosto.getValue() != '' && _this.cmbCentroCosto.getValue() != null) {
                obj.idcentrocosto = _this.cmbCentroCosto.getValue();
                _this.hizoCambios = true;
            }
        }
        if(_this.cmbtipopedido && !_this.datosComunes){
            obj.tipopedido = _this.cmbtipopedido.getValue();
        }
        if(_this.cmbOperacion){
            if (_this.documento.json.idoperacion != _this.cmbOperacion.getValue() && _this.cmbOperacion.getValue() != '' && _this.cmbOperacion.getValue() != null) {
                obj.idoperacionmod = _this.cmbOperacion.getValue();
                _this.hizoCambios = true;
            }
        }
        if (_this.documento.json.idmoneda != _this.idmoneda || (_this.idtipotasa && _this.idtipotasa != _this.documento.json.idtipotasa)) {
            obj.idmoneda = _this.idmoneda;
            obj.tasacambio = _this.tasacambio;
            obj.factorconvercion = _this.factorconvercion;
            _this.hizoCambios = true;
        }
        obj.idcliente = _this.cmbCliente.getValue();
        if (_this.cmbCliente.getValue() != _this.documento.json.idcliente) {
            _this.hizoCambios = true;
        }
        if (_this.cmbClienteaux) {
            obj.idclienteauxiliar = _this.cmbClienteaux.getValue();
            if (_this.cmbClienteaux.getValue() != _this.documento.json.idclienteauxiliar) {
                _this.hizoCambios = true;
            }
        }
        if (_this.cmbSerie && _this.documento.json.idseriedocentidad != _this.cmbSerie.getValue() && _this.cmbSerie.getValue()) {
            obj.idseriedocentidad = _this.cmbSerie.getValue();
            _this.hizoCambios = true;
        }
        if(_this.cmbMoneda && !!_this.cmbMoneda.getValue() && _this.cmbMoneda.getValue() != _this.documento.json.idmoneda){
            obj.idmoneda = _this.cmbMoneda.getValue();
            _this.hizoCambios = true;
        }
        if(_this.cmbCBC && (_this.cuentamod || _this.cmbCBC.getValue() != _this.documento.json.idcuentabancliente.substr(1,_this.documento.json.idcuentabancliente.length-2))){
            obj.datoscuentacliente = _this.cuentamonedacliente;
            _this.hizoCambios = true;
        }

        /*if(_this.cmbContrato && (_this.cmbContrato.getValue() != _this.documento.json.idcontrato)){
            obj.idcontrato = _this.cmbContrato.getValue();
            _this.hizoCambios = true;
        }*/
        if(_this.txtNroContrato && (_this.txtNroContrato.getValue() != _this.documento.json.numero)){
            obj.numero = _this.txtNroContrato.getValue();
            _this.hizoCambios = true;
        }
        if(_this.txtFactorconversion && (_this.txtFactorconversion.getValue() != _this.documento.json.factorconvercion)){
            obj.factorconvercion = _this.txtFactorconversion.getValue();
            _this.hizoCambios = true;
        }
        if(_this.idcontrato && (_this.idcontrato != _this.documento.json.idcontrato)){
            obj.idcontrato = _this.idcontrato;
            _this.hizoCambios = true;
        }
        if(_this.fechaContrato && (_this.fechaContrato.getValue() != _this.documento.json.fecha)){
            obj.fecha = _this.fechaContrato.getValue();
            _this.hizoCambios = true;
        }

        if (_this.documento.json.idcondicionpago != _this.cmbCondicionPago.getValue()) {
            obj.idcondicionpago = _this.cmbCondicionPago.getValue();
            obj.fechavencimiento = _this.fechavencimiento;
            if (_this.dias > 0)
                obj.dias = _this.dias;
            _this.hizoCambios = true;
        }
        if (_this.cmbContacto){
            if (_this.documento.json.idcontacto != _this.cmbContacto.getValue()) {
                obj.idcontacto = _this.cmbContacto.getValue() || null;
                _this.hizoCambios = true;
            }
        }

        if (_this.cmbVendedor){
            if (_this.documento.json.idvendedor != _this.cmbVendedor.getValue()) {
                obj.idvendedor = _this.cmbVendedor.getValue() || null;
                _this.hizoCambios = true;
            }
        }
        if (_this.cmbFormaPago){
            if (_this.documento.json.idnomformapago != _this.cmbFormaPago.getValue()) {
                obj.idnomformapago = _this.cmbFormaPago.getValue() || null;
                obj.conceptoventa = _this.conceptoventa;
                obj.valorconcepto = _this.valorconcepto;
                obj.tipoconceptoventa = _this.tipoconceptoventa;
                _this.hizoCambios = true;
            }
        }
        if (_this.cmbTasa){
            if (_this.documento.json.idtipotasa != _this.cmbTasa.getValue()) {
                obj.idtipotasa = _this.cmbTasa.getValue() || null;
                _this.hizoCambios = true;
            }
        }

        if ((_this.reservaprecio != undefined) && _this.reservaprecio != _this.documento.json.reservaprecio) {
            obj.reservaprecio = _this.reservaprecio;
            _this.hizoCambios = true;
        }
        if ((_this.reservadisponible != undefined) && _this.reservadisponible != _this.documento.json.reservadisponible) {
            obj.reservadisponible = _this.reservadisponible;
            _this.hizoCambios = true;
        }

        if(_this.idproveedor){
            if (_this.documento.json.idproveedor != _this.idproveedor) {
                obj.idproveedor = _this.idproveedor;
                _this.hizoCambios = true;
                obj.tiporgtransp = _this.tiporgtransp;
            }

        }
        if(_this.frmDatosTransporte){
            if (_this.documento.json.identidadchofer != _this.txtfIdenConductor.getValue() && _this.txtfIdenConductor.getValue() != '') {
                obj.identidadchofer = _this.txtfIdenConductor.getValue();
                _this.hizoCambios = true;
            }
            if (_this.documento.json.nombrechofer != _this.txtfNombreConductor.getValue() && _this.txtfNombreConductor.getValue() != '') {
                obj.nombrechofer = _this.txtfNombreConductor.getValue();
                _this.hizoCambios = true;
            }
            if (_this.documento.json.matriculavehiculo != _this.txtfMatriculaVehiculo.getValue() && _this.txtfMatriculaVehiculo.getValue() != '') {
                obj.matriculavehiculo = _this.txtfMatriculaVehiculo.getValue();
                _this.hizoCambios = true;
            }
            if (_this.documento.json.cartaporte != _this.txtfCartaPorte.getValue() && _this.txtfCartaPorte.getValue() != '') {
                obj.cartaporte = _this.txtfCartaPorte.getValue();
                _this.hizoCambios = true;
            }
            if (_this.documento.json.viatransporte != _this.viaTransporte.getValue() && _this.viaTransporte.getValue() != '') {
                obj.viatransporte = _this.viaTransporte.getValue();
                _this.hizoCambios = true;
            }

            if (_this.documento.json.bultos != _this.txtfBultos.getValue() && _this.txtfBultos.getValue() != '') {
                obj.bultos = _this.txtfBultos.getValue();
                _this.hizoCambios = true;
            }
            if (_this.documento.json.sellos != _this.txtfSellos.getValue() && _this.txtfSellos.getValue() != '') {
                obj.sellos = _this.txtfSellos.getValue();
                _this.hizoCambios = true;
            }
            if (_this.documento.json.nrorden != _this.txtfOrden.getValue() && _this.txtfOrden.getValue() != '') {
                obj.nrorden = _this.txtfOrden.getValue();
                _this.hizoCambios = true;
            }
            if (_this.documento.json.contenedor != _this.txtfContenedor.getValue() && _this.txtfContenedor.getValue() != '') {
                obj.contenedor = _this.txtfContenedor.getValue();
                _this.hizoCambios = true;
            }
            if (_this.documento.json.bl != _this.txtfBL.getValue() && _this.txtfBL.getValue() != '') {
                obj.bl = _this.txtfBL.getValue();
                _this.hizoCambios = true;
            }
            if (_this.documento.json.destinocomercial != _this.txtfDestinoComercial.getValue() && _this.txtfDestinoComercial.getValue() != '') {
                obj.destinocomercial = _this.txtfDestinoComercial.getValue();
                _this.hizoCambios = true;
            }
            if (_this.documento.json.prodgenerico != _this.txtfProdGenerico.getValue() && _this.txtfProdGenerico.getValue() != '') {
                obj.prodgenerico = _this.txtfProdGenerico.getValue();
                _this.hizoCambios = true;
            }
            if (_this.documento.json.puertodestino != _this.txtfPuertoDestino.getValue() && _this.txtfPuertoDestino.getValue() != '') {
                obj.puertodestino = _this.txtfPuertoDestino.getValue();
                _this.hizoCambios = true;
            }
            if (_this.documento.json.licencia != _this.txtfLicencia.getValue() && _this.txtfLicencia.getValue() != '') {
                obj.licencia = _this.txtfLicencia.getValue();
                _this.hizoCambios = true;
            }

        }
        if (_this.frmDatosContacto) {
            if (_this.documento.json.nombrecontacto != _this.txtNombreContacto.getValue() && _this.txtNombreContacto.getValue() != '') {
                obj.nombrecontacto = _this.txtNombreContacto.getValue();
                _this.hizoCambios = true;
            }
            if (_this.documento.json.cicontacto != _this.txtCiContacto.getValue() && _this.txtCiContacto.getValue() != '') {
                obj.cicontacto = _this.txtCiContacto.getValue();
                _this.hizoCambios = true;
            }
            if (_this.documento.json.telfcontacto != _this.txtTelefono.getValue() && _this.txtTelefono.getValue() != '') {
                obj.telfcontacto = _this.txtTelefono.getValue();
                _this.hizoCambios = true;
            }
        }
        if (_this.documento.json.observaciones != _this.txtAObservaciones.getValue()) {
            if (_this.txtAObservaciones.getValue() == ''){
              obj.observaciones = '';
            } else {
              obj.observaciones = _this.txtAObservaciones.getValue();
            }
            _this.hizoCambios = true;
        }
        if(_this.storeProd){
            var recordModificados = _this.storeProd.getModifiedRecords();
            if(recordModificados.length > 0){
                _this.hizoCambios = true;
                var prodModificados = new Array();
                Ext.each(recordModificados, function(record){
                    record.data.tienelote = record.json.tienelote;
                    prodModificados.push(record.data);
                });
                obj.productos = prodModificados;
                //obj.datoscuentasuministrador = _this.cuentamonedasuministrador;
                if(_this.storeProd.lastOptions.params){
                    obj.paramsProd =  _this.storeProd.lastOptions.params;
                }else{
                    obj.paramsProd = {
                        start: 0,
                        limit: 30
                    }
                }
            }
        }
        if(_this.storeServ){
            var recServModificados = _this.storeServ.getModifiedRecords();
            if(recServModificados.length > 0){
                _this.hizoCambios = true;
                var servModificados = new Array();
                Ext.each(recServModificados, function(record){
                    servModificados.push(record.data);
                });
                obj.servicios = servModificados;
                obj.datoscuentasuministrador = _this.cuentamonedasuministrador;
                if(_this.storeServ.lastOptions.params){
                    obj.paramsServ =  _this.storeServ.lastOptions.params;
                }else{
                    obj.paramsServ = {
                        start: 0,
                        limit: 30
                    }
                }
            }
            var recProdServModificados = _this.storeProdServ.getModifiedRecords();
            if(recProdServModificados.length > 0){
                _this.hizoCambios = true;
                var prodServModificados = new Array();
                Ext.each(recProdServModificados, function(record){
                    prodServModificados.push(record.data);
                });
                obj.prodservicios = prodServModificados;
            }
        }
        var conceptos = _this.storeConceptos.getModifiedRecords();
        if(conceptos.length > 0){
            var conceptosModificados = new Array();
            var faltacuenta = false;
            Ext.each(conceptos, function(record){
                if (record.data.idcuenta.length === 0) {
                    faltacuenta = true;
                }
                conceptosModificados.push(record.data);
            });
            /*if(faltacuenta){
                mostrarMensaje(3, _this.idioma.msgFaltaCuenta);
                return false;
            }*/
            obj.conceptos = conceptosModificados;
        }
        if(_this.lote){
            var lotes = _this.lote.getGridPrincipal().getStore().getModifiedRecords();
            if(lotes.length > 0){
                var lotesModificados = new Array();
                Ext.each(lotes, function(record){
                    lotesModificados.push({
                        idmovlote: record.data.idmovlote,
                        idmovimiento: record.json.idmovimiento,
                        idlote: record.data.idlote,
                        cantidadVieja: record.data.cantidadVieja,
                        cantidad: record.data.cantidad
                    });
                });
                obj.lotes = lotesModificados;
                _this.lote.getGridPrincipal().getStore().commitChanges();
            }
        }
        return obj;
    },
    datosAdd: function() {
        var _this = this;
        var obj = {};
        obj.oferta = (_this.tipoDoc == 1) ? 1 : 0;
        obj.tipoDoc = _this.tipoDoc;
        if (_this.tipoDoc == 4) {
            obj.docorigen = _this.values.iddocumento;
            obj.iddoc = (_this.values) ? _this.values.iddoc : null;
        } else if (_this.tipoDoc == 5 || _this.tipoDoc == 7 || _this.tipoDoc == 8) {
            obj.docorigen = _this.values.iddocumento;
        } else if (_this.tipoDoc == 1) {
            if(_this.reservaprecio != undefined){
                obj.reservaprecio = _this.reservaprecio;
            }
            if(_this.reservadisponible != undefined){
                obj.reservadisponible = _this.reservadisponible;
            }
        }
        if (_this.cmbCliente && !_this.datosComunes) {
            obj.idcliente = _this.cmbCliente.getValue();
        }
        if (_this.cmbClienteaux) {
            if (_this.cmbClienteaux && !_this.datosComunes) {
                obj.idclienteauxiliar = _this.cmbClienteaux.getValue();
            }
        }
        if(_this.cmbtipopedido && !_this.datosComunes){
            obj.tipopedido = _this.cmbtipopedido.getValue();
        }
        if(_this.cmbSerie && !!_this.cmbSerie.getValue()){
            obj.idseriedocentidad = _this.cmbSerie.getValue();
        }
        if(_this.idmoneda){
            obj.idmoneda = _this.idmoneda;
            obj.tasacambio = _this.tasacambio;
            obj.factorconvercion = _this.factorconvercion;
        }
        if(_this.cmbCBC && !!_this.cmbCBC.getValue()){
            obj.datoscuentacliente = _this.cuentamonedacliente;
        }
        if(_this.idcontrato != undefined){
            obj.idcontrato = _this.idcontrato;
        }
        /*if(_this.cmbContrato && !!_this.cmbContrato.getValue()){
            obj.idcontrato = _this.cmbContrato.getValue();
        }*/
        if(_this.txtNroContrato && !!_this.txtNroContrato.getValue()){
            obj.numero = _this.txtNroContrato.getValue();
        }
        if(_this.txtFactorconversion && !!_this.txtFactorconversion.getValue()){
            obj.factorconvercion = _this.txtFactorconversion.getValue();
        }
        if(_this.fechaContrato && !!_this.fechaContrato.getValue()){
            obj.fecha = _this.fechaContrato.getValue();
        }
        if (_this.cmbDeposito && !!_this.cmbDeposito.getValue()/* && _this.cmbDeposito.getValue() != '' && _this.cmbDeposito.getValue() != null*/) {
            obj.iddeposito = _this.cmbDeposito.getValue();
        }
        if (_this.cmbCentroCosto && !!_this.cmbCentroCosto.getValue()/* && _this.cmbDeposito.getValue() != '' && _this.cmbDeposito.getValue() != null*/) {
            obj.idcentrocosto = _this.cmbCentroCosto.getValue();
        }
        if (_this.cmbOperacion && !!_this.cmbOperacion.getValue()/* && _this.cmbDeposito.getValue() != '' && _this.cmbDeposito.getValue() != null*/) {
            obj.idoperacionmod = _this.cmbOperacion.getValue();
        }
        if (_this.cmbCondicionPago && !!_this.cmbCondicionPago.getValue()/* != null && _this.cmbCondicionPago.getValue() != ''*/) {
            obj.idcondicionpago = _this.cmbCondicionPago.getValue();
            obj.dias = _this.dias;
        }
        if (_this.cmbContacto && !!_this.cmbContacto.getValue()/* != null && _this.cmbCondicionPago.getValue() != ''*/) {
            obj.idcontacto = _this.cmbContacto.getValue() || null;
        }
        if (_this.cmbVendedor && !!_this.cmbVendedor.getValue()/* != null && _this.cmbCondicionPago.getValue() != ''*/) {
            obj.idvendedor = _this.cmbVendedor.getValue() || null;
        }
        if (_this.cmbFormaPago && !!_this.cmbFormaPago.getValue()/* != null && _this.cmbCondicionPago.getValue() != ''*/) {
            obj.idnomformapago = _this.cmbFormaPago.getValue() || null;
            obj.conceptoventa = _this.conceptoventa;
            obj.valorconcepto = _this.valorconcepto;
            obj.tipoconceptoventa = _this.tipoconceptoventa;
        }
        if (_this.cmbTasa && !!_this.cmbTasa.getValue()/* != null && _this.cmbCondicionPago.getValue() != ''*/) {
            obj.idtipotasa = _this.cmbTasa.getValue() || null;
        }
        if (_this.idproveedor) {
            obj.idproveedor = _this.idproveedor;
            obj.tiporgtransp = _this.tiporgtransp;
        }
        if(_this.txtfIdenConductor && !!_this.txtfIdenConductor.getValue()){
            obj.identidadchofer = _this.txtfIdenConductor.getValue();
        }
        if(_this.txtfNombreConductor && !!_this.txtfNombreConductor.getValue()){
            obj.nombrechofer = _this.txtfNombreConductor.getValue();
        }
        if(_this.txtfMatriculaVehiculo && !!_this.txtfMatriculaVehiculo.getValue()){
            obj.matriculavehiculo = _this.txtfMatriculaVehiculo.getValue();
        }
        if(_this.viaTransporte && !!_this.viaTransporte.getValue()){
            obj.viatransporte = _this.viaTransporte.getValue();
        }
        if(_this.txtfCartaPorte && !!_this.txtfCartaPorte.getValue()/* && _this.txtfCartaPorte.getValue() != ''*/){
            obj.cartaporte = _this.txtfCartaPorte.getValue();
        }

        if(_this.txtfBultos && !!_this.txtfBultos.getValue()){
            obj.bultos = _this.txtfBultos.getValue();
        }
        if(_this.txtfSellos && !!_this.txtfSellos.getValue()){
            obj.sellos = _this.txtfSellos.getValue();
        }
        if(_this.txtfOrden && !!_this.txtfOrden.getValue()){
            obj.nrorden = _this.txtfOrden.getValue();
        }
        if(_this.txtfContenedor && !!_this.txtfContenedor.getValue()){
            obj.contenedor = _this.txtfContenedor.getValue();
        }
        if(_this.txtfDestinoComercial && !!_this.txtfDestinoComercial.getValue()){
            obj.destinocomercial = _this.txtfDestinoComercial.getValue();
        }
        if(_this.txtfProdGenerico && !!_this.txtfProdGenerico.getValue()){
            obj.prodgenerico = _this.txtfProdGenerico.getValue();
        }
        if(_this.txtfPuertoDestino && !!_this.txtfPuertoDestino.getValue()){
            obj.puertodestino = _this.txtfPuertoDestino.getValue();
        }
        if(_this.txtfBL && !!_this.txtfBL.getValue()){
            obj.bl = _this.txtfBL.getValue();
        }
        if(_this.txtfLicencia && !!_this.txtfLicencia.getValue()){
            obj.licencia = _this.txtfLicencia.getValue();
        }

        if (_this.txtAObservaciones) {
            obj.observaciones = _this.txtAObservaciones.getValue();
        }

        if (_this.frmDatosContacto) {
            if(_this.txtNombreContacto && !!_this.txtNombreContacto.getValue()){
                obj.nombrecontacto = _this.txtNombreContacto.getValue();
            }
            if(_this.txtCiContacto && !!_this.txtCiContacto.getValue()){
                obj.cicontacto = _this.txtCiContacto.getValue();
            }
            if(_this.txtTelefono && !!_this.txtTelefono.getValue()){
                obj.telfcontacto = _this.txtTelefono.getValue();
            }
        }
        var conceptos = _this.storeConceptos.getModifiedRecords();
        if(conceptos.length > 0){
            var conceptosModificados = new Array();
            var faltacuenta = false;
            Ext.each(conceptos, function(record){
                if(record.data.idcuenta.length === 0){
                    faltacuenta = true;
                }
                conceptosModificados.push(record.data);
            });
            /*if (faltacuenta) {
                mostrarMensaje(3, _this.idioma.msgFaltaCuenta);
                return false;
            }*/
            obj.conceptos = conceptosModificados;
        }
        if(!_this.datosComunes){
            if (_this.recordProd && _this.recordProd.length > 0) {
                obj.productos = _this.recordProd;
            }
            if (_this.recordServ &&_this.recordServ.length > 0) {
                obj.servicios = _this.recordServ;
            }
        }else{
            obj.datosComunes = 1;
            obj.cliente = _this.values.cliente;
            obj.iddeposito = _this.iddeposito;
            obj.idtipoprecio = _this.precioDefault;
            if(_this.alquiler){
                obj.alquiler = _this.alquiler;
                obj.servicios = _this.servicios;
            }
        }
        return obj;
    },
    loadRecord: function(nuevo){
        var _this = this;
        _this.formularioBasico.getForm().items.each(function (field) {
            field.originalValue = (nuevo) ? '' : field.getValue();
        });
    },
    enviarDatos: function(datos, apl, v) {
        var _this = this;
        if (apl) {
            datos.aplicar = apl;
        }
        Ext.MessageBox.wait(_this.idioma.msgGuardando, _this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'adicionarFactura',
            method: 'post',
            timeout: '240000',
            params: {
                datos: Ext.encode(datos)
            },
            success: function(rp) {
                Ext.MessageBox.hide();
                var value = Ext.decode(rp.responseText);
                if(value.codMsg && value.codMsg == 4){
                    _this.storeProd.load({
                        callback:function(){
                            _this.gpProd.getSelectionModel().selectRow(_this.seleccionAnteriorP);
                        }
                    });
                }else if (apl) {
                    if(_this.documento){
                        _this.documentoAnterior = _this.documento;
                    }
                    _this.documento = {
                        json: value.success.datos[0]
                    };
                    _this.record = {
                        data: value.success.datos[0]
                    };
                    if (_this.documento.json.pagoexterior == 1) {
                        _this.gpConceptos.getColumnModel().setHidden(6, false)
                    }
                    _this.loadRecord();
                    if(_this.p){
                        _this.p.storePrincipal.initBaseParams.iddocumento = _this.documento.json.iddocumento;
                        _this.p.storePrincipal.load();
                    }else if(_this.windowSA && v){
                        if(_this.windowSA.getSelectedTabIndex() == 0){
                            var idprod = [];
                            /*Ext.each(datos.servicios, function(serv){
                                idprod.push(serv.idindicador);
                            });*/
                            var idsel = Ext.encode(Ext.decode(v.getTemplateByIndex(0).storePrincipal.baseParams.idseleccionados).concat(idprod));
                            /*v.getTemplateByIndex(0).storePrincipal.initBaseParams.idseleccionados = idsel;
                            v.getTemplateByIndex(0).storePrincipal.baseParams.idseleccionados = idsel;*/
                            v.getTemplateByIndex(0).storePrincipal.load({
                                params: {
                                    start: (v.getTemplateByIndex(0).storePrincipal.lastOptions.params) ? v.getTemplateByIndex(0).storePrincipal.lastOptions.params.start : 0,
                                    limit: (v.getTemplateByIndex(0).storePrincipal.lastOptions.params) ? v.getTemplateByIndex(0).storePrincipal.lastOptions.params.limit : 30
                                }
                            });
                        }else if(_this.windowSA.getSelectedTabIndex() == 1){
                            _this.windowSA.getTemplateByIndex(1).storePrincipal.initBaseParams.iddocumento = _this.documento.json.iddocumento;
                            _this.windowSA.getTemplateByIndex(1).storePrincipal.load();
                        }
                    }else if (v && v.isVisible()) {
                        var idprod = [];
                        /*Ext.each(datos.productos, function (prod) {
                            idprod.push(prod.idindicador);
                        });*/
                        v.parametros.idseleccionados = Ext.encode(Ext.decode(v.panelProductos.getStorePrincipal().baseParams.idseleccionados).concat(idprod));
                        v.panelProductos.getStorePrincipal().load({
                            params: {
                                start: v.panelProductos.getStorePrincipal().lastOptions.params.start,
                                limit: v.panelProductos.getStorePrincipal().lastOptions.params.limit
                            }
                        });
                    }
                    mensage = (_this.accion=='add')?_this.idioma.msgAdicionarFact:_this.idioma.msgModificarFact;
                    mostrarMensaje(1, mensage);
                    if((_this.storeProd && datos.productos) || (_this.storeServ && (datos.servicios || datos.prodservicios))){
                        if(_this.storeProd && datos.productos){
                            _this.accion = 'mod';
                            _this.storeProd.commitChanges();//dudas aki
                            _this.storeProd.load({
                                callback:function(){
                                    _this.gpProd.getSelectionModel().selectRow(_this.seleccionAnteriorP);
                                }
                            });
                        }else{
                            if(_this.documentoAnterior)
                                _this.documento.json.arrayProd = _this.documentoAnterior.json.arrayProd;
                        }
                        if(_this.storeServ && (datos.servicios || datos.prodservicios)){
                            _this.accion = 'mod';
                            _this.storeServ.load({
                                callback: function(){
                                    _this.gpServ.getSelectionModel().selectRow(_this.seleccionAnterior);
                                }
                            });
                            if(datos.prodservicios){

                            }
                            _this.storeServ.commitChanges();
                            _this.storeProdServ.commitChanges();
                        }else{
                            if(_this.documentoAnterior)
                                _this.documento.json.arrayServ = _this.documentoAnterior.json.arrayServ;
                        }
                    }else if(_this.lote && datos.lotes){
                        _this.storeProd.load({
                            callback:function(){
                                _this.gpProd.getSelectionModel().selectRow(_this.seleccionAnteriorP);
                            }
                        });
                    }else if(datos.datoscuentasuministrador){
                        if(_this.storeProd)
                            _this.storeProd.reload();
                    } else if (datos.idmoneda || datos.factorconvercion) {
                        if (_this.storeProd) {
                            _this.storeProd.load({
                                callback:function(){
                                    _this.gpProd.getSelectionModel().selectRow(_this.seleccionAnteriorP);
                                }
                            });
                        }
                        if (_this.storeServ) {
                            _this.storeServ.load({
                                callback: function(){
                                    _this.gpServ.getSelectionModel().selectRow(_this.seleccionAnterior);
                                }
                            });
                        }
                    }
                    else{
                        _this.accion = 'mod';
                        if(_this.documentoAnterior){
                            _this.documento.json.arrayProd = _this.documentoAnterior.json.arrayProd;
                            _this.documento.json.arrayServ = _this.documentoAnterior.json.arrayServ;
                        }
                    }
                    if(datos.conceptos){
                        _this.storeConceptos.commitChanges();
                        _this.storeConceptos.reload();
                    }
                    if(_this.stDocumentos)
                        _this.stDocumentos.close();
                    _this.habilitarBtn(value.success.datos[0].estado);
                    _this.setTitulo();
                } else {
                    _this.close();
                    var mensage = '';
                    if(!_this.datosComunes){
                        _this.habilitarBtn(value.success.datos[0].estado);
                        mensage = (_this.accion=='add')?_this.idioma.msgAdicionarFact:_this.idioma.msgModificarFact;
                        mostrarMensaje(1, mensage);
                    }else{
                        mensage = _this.idioma.msgAdicionarFacturas;
                        mensage = mensage.replace('contador', value.respuesta.contador);
                        mensage = mensage.replace('fechadoc', value.respuesta.fecha);
                        mostrarMensaje(1, mensage);
                        _this.parent.pGdList.getGridPrincipal().getStore().reload();
                    }
                    _this.stFacturas.reload();
                }
                _this.focus();
            }
        });
    },
    crearCheckBoxs: function(){
        var _this = this;
        var items = Array();
        if(_this.tipoDoc == 1 || (_this.documento && _this.documento.json.oferta != 0)){
            this.chxReservaPrecio = new Ext.form.Checkbox({
                boxLabel: _this.idioma.lbRecervaPrecio,
                hideLabel: true,
                name: 'reservaprecio',
                listeners: {
                    check: function(check, ckecked) {
                        _this.reservaprecio = (ckecked) ? 1 : 0;
                    },
                    render: function (check) {
                        if (_this.accion != 'add')
                            if (_this.documento.json.reservaprecio == 1){
                                check.setValue(true);
                            }
                    }
                }
            });
            items.push(_this.chxReservaPrecio);
            if(_this.idsubsistema == LOG.util.Subsistemas.inventario){
                this.chxReservaDisponible = new Ext.form.Checkbox({
                    boxLabel: _this.idioma.lbReservarDisponibilidad,
                    hideLabel: true,
                    style: 'margin-left: 10px;',
                    name: 'reservadisponible',
                    listeners: {
                        check: function(check, ckecked) {
                            _this.reservadisponible = (ckecked) ? 1 : 0;
                            if (ckecked && _this.btnAdicionarProd) {
                                _this.btnAdicionarProd.disable();
                            } else if (_this.btnAdicionarProd) {
                                _this.btnAdicionarProd.enable();
                            }
                        },
                        render: function (check) {
                            if (_this.accion != 'add')
                                if (_this.documento.json.reservadisponible == 1){
                                    check.setValue(true);
                                }
                        }
                    }
                });
                items.push(_this.chxReservaDisponible);
            }
        }else{
            //items.push(_this.chxUtilizarGuia);
        }
        if(_this.tipoDoc != 1 || (_this.documento && _this.documento.json.oferta == 0)){
            this.lblPlazo = new Ext.form.Label({
                text: _this.idioma.lblPlazo + ': ' + ((_this.documento && _this.documento.json.dias) ? _this.documento.json.dias + _this.idioma.lblDias : '-'),
                style: 'font-size: 12px;',
                margins: '0'
            });
            if(!_this.datosComunes){
                items.push({
                    xtype: 'spacer',
                    width: '90%'
                });
                items.push(this.lblPlazo);
            }
        }
        return items;
    },
    setTitulo: function(){
        var _this = this;
        var titulo = _this.idioma.titleVentanaAdicionar;
        if(_this.accion == 'add'){
            titulo = (!_this.datosComunes)?_this.idioma.tAdicionarFactura:_this.idioma.tAdicionarComunes;
        }else{
            titulo = titulo.replace('tipo', (_this.documento.json.tipodocumento != 1)?_this.documento.json.tipodocumento:_this.idioma.tipoDocOferta);
            titulo = titulo.replace('num', _this.documento.json.numeroref);
            titulo = titulo.replace('fecha', _this.documento.json.fechacontable);
            titulo = titulo.replace('estado', LOG.lb.documento.Estado[_this.documento.json.estado]);
            if(_this.documento.json.estado == 4){
                titulo = titulo.replace('vencimiento', _this.documento.json.fechavencimiento);
            }else{
                titulo = titulo.replace('expira vencimiento', '');
            }
        }
        _this.setTitle(titulo);
    },
    habilitarIsValidDeposito: function(){
        var _this = this;
        if(_this.btnAdicionarProd && _this.cmbCliente.getValue()){
            if(_this.tipoDoc != 5 && _this.tipoDoc != 4){
                /*if(_this.accion != 'ver'){
                    *//*if(LOG.fact.comboDeposito.depositoAreas.length > 0)
                        _this.habilitarBtnProductoServ();*//*
                }*/
            }
        }
    },
    habilitarIsNotValidDeposito: function(){
        var _this = this;
        if(_this.btnAdicionarProd && _this.cmbCliente.getValue()){
            _this.btnAdicionarProd.disable();
        }
    },
    habilitarBtn: function(estado){
        var _this = this;
        Ext.each(_this.btn.arrayData, function(b){
            if(b.controlFn){
                if(b.menu){
                    Ext.each(b.menu.items.items, function(item){
                        if(item.controlFn){
                            item.controlFn(item);
                        }
                    })
                }
                b.controlFn(b);
            }
        });
        if(!estado){
            _this.btnEnNuevo();
        }
        else if(estado == 1){
            _this.btnEnElaboracion();
            _this.enNuevoElaboracion('mod');
        }else if(estado == 2){
            _this.btnEnPreparado();
        }else if(estado == 4){
            _this.btnEnContabilizado();
        }else if(estado == 7){
            _this.btnEnCancelado();
        }
        else if(estado == 10){
            //_this.btnEnPropuestoCancelar();

            _this.enNuevoElaboracion('mod');
        }
        _this.habilitarBtnProductoServ();
    },
    destruirPaneles: function(){
        var _this = this;
        if(_this.panelServ){
            _this.btnAdicionarServ.disable();
            if(_this.storeServ.getCount() == 0){
                _this.tbCenter.hideTabStripItem(1);
            }
        }
        if(_this.panelProd){
            _this.btnAdicionarProd.disable();
            _this.btnAdicionarProdAlm.disable();
            if(_this.storeProd.getCount() == 0){
                _this.tbCenter.hideTabStripItem(0);
            }
        }
    },
    btnEnNuevo: function(){
        var _this = this;
        _this.formularioBasico.getForm().isValid();
    },
    btnEnElaboracion: function(){
        var _this = this;
        _this.accion = 'mod';
        _this.listaBotones.arrayData[1].enable();
        if(!_this.formularioBasico.getForm().isDirty())
            _this.listaBotones.arrayData[2].disable();
    },
    btnEnPreparado: function(){
        var _this = this;
        _this.accion = 'ver'
        _this.distintoElaboracion();
        _this.listaBotones.arrayData[2].disable();
    },
    btnEnContabilizado: function(){
        var _this = this;
        _this.listaBotones.arrayData[2].disable();
    },
    btnEnCancelado: function(){
        var _this = this;
        _this.listaBotones.arrayData[2].disable();
    },
    functionBtnNuevo: function(){
        var _this = this;
        _this.loadRecord(true);
        _this.accion = 'add';
        _this.documento = null;
        _this.record = null;
        //_this.cmbMonedaContable.getStore().load();
        _this.cmbCondicionPago.reset();
        _this.cmbCliente.reset();
        if (_this.cmbClienteaux) {
            _this.cmbClienteaux.reset();
        }
        if (_this.txtNroContrato) {
            _this.txtNroContrato.reset();
            _this.fechaContrato.reset();
            _this.idcontrato = undefined;
        }
        _this.cmbCentroCosto.reset();
        _this.cmbCBC.reset();
        if(_this.cmbSerie)
            _this.cmbSerie.reset();
        if(_this.cmbNroControl){
            _this.cmbNroControl.reset();
        }

        _this.cmbNroFactura.reset();
        _this.cmbMoneda.reset();
        _this.idmoneda = null;
        if (_this.cmbContacto)
            _this.cmbContacto.reset();
        if (_this.cmbVendedor)
            _this.cmbVendedor.reset();
        if (_this.cmbFormaPago){
            _this.cmbFormaPago.reset();
            _this.conceptoventa = null;
            _this.valorconcepto = null;
            _this.tipoconceptoventa = null;
        }
        if (_this.cmbTasa){
            _this.idtipotasa = null;
            _this.cmbTasa.reset();
        }
        if (_this.txtFactorconversion){
            _this.factorconvercion = null;
            _this.txtFactorconversion.reset();
        }
        if(_this.storeProd){
            _this.recordProd = [];
            _this.storeProd.load();
            _this.btnAdicionarProd.disable();
            _this.btnAdicionarProdAlm.disable();            
        }
        if(_this.storeServ){
            _this.recordServ = [];
            _this.storeServ.load();
            _this.btnAdicionarServ.disable();
        }
        if(_this.storeConceptos){
            _this.storeConceptos.load();
        }
        if(_this.frmDatosTransporte){
            for(var i = 0; i < _this.frmDatosTransporte.columnas; i++)
                for(var j = 0; j < _this.frmDatosTransporte.getColumn(i).items.items.length; j++){
                    _this.frmDatosTransporte.getColumn(i).items.items[j].setValue();
                }

            _this.idproveedor = null;
            _this.tbNorth.setActiveTab(0);
        }
        if(_this.txtAObservaciones){
            _this.txtAObservaciones.reset();
        }
        _this.hizoCambios = true;
        _this.setTitulo();
        _this.enNuevoElaboracion();
        if(_this.tipoDoc == 1 || _this.tipoDoc == 2 || _this.tipoDoc == 3){
            _this.tipoDoc = _this.tipoDoc;
        }else{
            _this.tipoDoc = (_this.subsistema == LOG.util.Subsistemas.inventario)?3:2;
        }

        if(_this.fieldsetDatosDocOrigen){
            _this.panelDatosTransp.destroy();

            _this.tbNorth.insert(1, _this.createPnTranspOtros());

        }
    },
    functionBtnConfirmar: function(){
        var _this = this;
        _this.parent.modelo.funcionConfirmar(Array(_this.documento), true);
    },
    functionBtnFacturar: function(){
        var _this = this;
        _this.parent.modelo.contabilizarFactura(Array(_this.documento), true);
    },
    functionBtnAnularEstatus: function(){
        var _this = this;
        _this.parent.modelo.anularEstatus(Array(_this.documento), true);
    },
    functionBtnAnularDocumento: function(){
        var _this = this;
        _this.parent.modelo.confirmarAnularDocumento(Array(_this.documento), true);
    },
    functionBtnImprimirModelo: function(btn){
        var _this = this;
        if(_this.documento.json.nrocontrol != '' && _this.documento.json.nrocontrol != null){
            _this.parent.onReport(btn,_this.btn.arrayData[4]);
        }else{
            _this.parent.modelo.imprimirModelo(btn, Array({
                idfactura:_this.documento.json.iddocumento,
                estado: _this.documento.json.estado
            }),_this);
        }
    },
    isValidTransporte: function(){
        var _this = this;
        if(
            _this.cmbOrganTransp.getValue() != null && _this.cmbOrganTransp.getValue() != '' &&
            _this.txtfNombreConductor.getValue() != null && _this.txtfNombreConductor.getValue() != '' &&
            _this.txtfIdenConductor.getValue() != null && _this.txtfIdenConductor.getValue() != '' &&
            _this.txtfMatriculaVehiculo.getValue() != null && _this.txtfMatriculaVehiculo.getValue() != ''

        ){
            return true;
        }else
            return false;
    }
});
LOG.fact.comboDeposito = {
    iddeposito: null,
    depositoAreas: Array(),
    parent: null,
    combo: function(accion, factura, idioma, parent) {
        var _this = this;
        _this.parent = parent;
        var treeDeposito = new Ext.tree.TreePanel({
            rootVisible: false,
            loader: new Ext.tree.TreeLoader({
                dataUrl: 'cargarDepositos',
                preloadChildren: false,
                listeners: {
                    beforeload: function(node) {
                        if (node != '-1') {
                            _this.myMask = new Ext.LoadMask(Ext.getBody(), {msg: idioma.lbMsgCargandoAreas});
                            _this.myMask.show();
                        }
                    },
                    load: function(tree, node, rp) {
                        if (accion == 'add') {
                            if (node.childNodes.length > 0) {
                                _this.depositoAreas = new Array();
                                _this.iddeposito = node.childNodes[0].attributes.id;
                                if (!node.childNodes[0].attributes.leaf) {
                                    node.childNodes[0].getUI().toggleCheck(true);
                                    //node.childNodes[0].select();
                                } else {
                                    if (node.childNodes[0].parentNode.attributes.checked) {
                                        for (var i = 0; i < node.childNodes.length; i++) {
                                            node.childNodes[i].getUI().toggleCheck(true);
                                            _this.depositoAreas.push(node.childNodes[i].attributes.id);
                                        }
                                        _this.nodesChecked = node.childNodes;
                                    }
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < node.childNodes.length; i++) {
                                if (node.childNodes[i].attributes.id == factura.json.iddeposito && !node.childNodes[0].attributes.leaf) {
                                    node.childNodes[i].getUI().toggleCheck(true);
                                    node.childNodes[i].select();
                                }
                                else if (node.childNodes[i].parentNode.attributes.checked && node.childNodes[0].attributes.leaf) {
                                    if (factura.json.depositoAreas.length != 0 && node.childNodes[i].parentNode.attributes.id == factura.json.iddeposito) {
                                        for (var j = 0; j < factura.json.depositoAreas.length; j++) {
                                            if (factura.json.depositoAreas[j].idarea == node.childNodes[i].attributes.id) {
                                                node.childNodes[i].getUI().toggleCheck(true);
                                                break;
                                            }
                                        }
                                    }else if(factura.json.depositoAreas.length != 0){
                                        node.childNodes[i].getUI().toggleCheck(true);
                                    }else {
                                        for (var k = 0; k < node.childNodes.length; k++) {
                                            node.childNodes[i].getUI().toggleCheck(true);
                                        }
                                    }
                                }
                            }
                        }
                        if (_this.myMask) {
                            _this.myMask.hide();
                        }
                    }
                }
            }),
            border: false,
            autoScroll: false,
            root: new Ext.tree.AsyncTreeNode({
                text: idioma.lbDeposito,
                id: '-1',
                expanded: true,
                checked: false,
                animate: false,
                iconCls: 'logistica'
            }),
            listeners: {
                click: function(node) {
                    var check = treeDeposito.getChecked();

                    if (check.length > 0) {
                        _this.depositoAreas = _this.getAllChildrenChecked(check);
                        /*if(accion == 'mod'){
                         factura.json.depositoAreas = Array();
                         Ext.each(_this.depositoAreas, function(area){
                         factura.json.depositoAreas.push({idarea: area});
                         });
                         }*/
                        if (node.isSelected() && !node.attributes.checked) {
                            node.getUI().toggleCheck(true);
                        }
                        _this.comboDeposito.setValue((!node.leaf) ? node.parentNode.attributes.id : node.parentNode.attributes.id);
                        _this.comboDeposito.setRawValue((!node.leaf) ? node.parentNode.attributes.text : node.parentNode.attributes.text);

                        /*if(_this.comboDeposito.parent && _this.comboDeposito.parent.adicionarComponent
                         && _this.comboDeposito.parent.idcontrato && _this.comboDeposito.parent.operacion.getValue()
                         && _this.comboDeposito.parent.btnAdicionar.disabled){
                         _this.comboDeposito.parent.btnAdicionar.enable(false);
                         _this.comboDeposito.parent.btnDocumento.enable();
                         }
                         if(_this.comboDeposito.first)
                         _this.comboDeposito.first= false;*/
                        _this.comboDeposito.fireEvent('selectchange', _this.comboDeposito, _this.comboDeposito.getValue());
                    }
                    if(_this.comboDeposito.isValid()){
                        _this.parent.habilitarIsValidDeposito();
                    }
                    else{
                        _this.parent.habilitarIsNotValidDeposito();
                    }
                    _this.parent.habilitarBtnProductoServ();
                },
                checkchange: function(node, check) {
                    if(node){
                        if (node.leaf) {
                            if (check) {
                                if (!node.parentNode.attributes.checked) {
                                    node.parentNode.getUI().toggleCheck(check);
                                    node.parentNode.select();
                                }
                            }
                            else {
                                var checked = treeDeposito.getChecked().length - 1;
                                if (node.parentNode.attributes.checked && !checked) {
                                    node.parentNode.getUI().toggleCheck(check);
                                }
                            }
                        }
                        else {
                            var hasChild = _this.isChildSelected(node.childNodes);
                            if (check) {
                                node.expand();
                                _this.changeChecked(node);
                                if (!hasChild) {
                                    node.select();
                                    for (var i = 0; i < node.childNodes.length; i++) {
                                        node.childNodes[i].getUI().toggleCheck(check);
                                    }
                                }
                                if (accion == 'mod' || accion == 'ver')
                                    _this.nodesChecked = node.childNodes;
                            }
                            else {
                                for (var i = 0; i < node.childNodes.length; i++) {
                                    node.childNodes[i].getUI().toggleCheck(check);
                                }
                            }
                        }
                    }
                }
            }
        });
        this.comboDeposito = new LOG.fact.components.TreeComboBox({
            fieldLabel: idioma.lbDeposito,
            disabled: ((accion == 'mod') ? ((factura.data.productos > 0) ? true : false) : false),
            resizable: true,
            //dataUrl: 'listarDepositos',
            border: false,
            emptyText: idioma.cbEmtyText,
            autoScroll: false,
            width: (!_this.parent.listadoDocumentos)?300:false,
            //triggerAction: 'all',
            treeConfig: treeDeposito,
            beforeSelect: function(panel) {
                Ext.Ajax.request({
                    url: 'cargarDepositos',
                    method: 'post',
                    params: {
                        node: '1'
                    },
                    success: function(rp) {
                        _this.depositoAreas = [];
                        var value = Ext.decode(rp.responseText);
                        var id, text;
                        if (value.length > 0) {
                            id = value[0].id;
                            text = value[0].text;
                        } else {
                            id = value.id;
                            text = value.text;
                        }
                        _this.comboDeposito.setValue(id);
                        _this.comboDeposito.setRawValue(text);
                        _this.iddeposito = id;
                        _this.comboDeposito.fireEvent('selectchange', _this.comboDeposito, _this.comboDeposito.getValue());
                        for (var i = 0; i < value[0].areas.length; i++) {
                            _this.depositoAreas.push(value[0].areas[i].idarea);
                        }
                        if (_this.comboDeposito.isValid() && panel) {
                            panel.setDisabled(false);
                        }
                    }
                });
            },
            resetCombo: function(){
                _this.depositoAreas = Array();
                _this.comboDeposito.reset();
                treeDeposito.fireEvent('checkchange', treeDeposito.getChecked()[0], false);
                _this.iddeposito = null;
                treeDeposito.collapseAll();

            },
            listeners: {
                blur: function(cmb) {
                    var checked = treeDeposito.getChecked();
                    if (checked.length > 0) {
                        _this.depositoAreas = _this.getAllChildrenChecked(checked);
                        /*if(accion == 'mod'){
                         factura.json.depositoAreas = Array();
                         Ext.each(_this.depositoAreas, function(area){
                         factura.json.depositoAreas.push({idarea: area});
                         });
                         }*/
                        cmb.setValue(checked[0].attributes.id);
                        cmb.setRawValue(checked[0].attributes.text);
                        /*if(_this.comboDeposito.parent && _this.comboDeposito.parent.adicionarComponent
                         && _this.comboDeposito.parent.idcontrato && _this.comboDeposito.parent.operacion.getValue()
                         && _this.comboDeposito.parent.btnAdicionar.disabled){
                         _this.comboDeposito.parent.btnAdicionar.enable(false);
                         _this.comboDeposito.parent.btnDocumento.enable();
                         }*/
                        if(_this.parent){
                            _this.parent.habilitarIsValidDeposito();
                            _this.parent.habilitarBtnProductoServ();
                        }

                    } else {
                        cmb.setValue(null);
                        if(_this.parent) {
                            _this.parent.habilitarBtnProductoServ();
                            _this.parent.habilitarIsNotValidDeposito();
                        }
                    }
                }

            }
        });
        return this.comboDeposito;
    },
    isChildSelected: function(children) {
        for (var i = 0; i < children.length; i++)
            if (children[i].attributes.checked)
                return true;
        return false;
    },
    changeChecked: function(nodes) {
        if (nodes.attributes.idpadre == '-1') {
            for (var i = 0; i < nodes.parentNode.childNodes.length; i++) {
                if (nodes.parentNode.childNodes[i].attributes.checked
                    && nodes.parentNode.childNodes[i].attributes.id != nodes.attributes.id
                    && nodes.parentNode.childNodes[i].attributes.idpadre == '-1') {
                    nodes.parentNode.childNodes[i].getUI().toggleCheck(false);
                }
            }
        }
    },
    getAllChildrenChecked: function(check) {
        this.depositoAreas = Array();
        this.iddeposito = check[0].attributes.id;
        for (var i = 1; i < check.length; i++) {
            this.depositoAreas.push(check[i].attributes.id);
        }
        return this.depositoAreas;
    }
};
LOG.fact.gdGeneral = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.idioma = config.idioma;
        config.urlBusquedaGridPrincipal = '';
        config.autoLoad = false;
        config.busquedaBasica = true;
        this.cm = config.cm;
        this.type = config.type;
        LOG.fact.gdGeneral.superclass.constructor.call(this, config);
    },
    initDefaults: function() {
        this.initColumnsGd();
        this.initButtonsGd();
    },
    initColumnsGd: function() {
        for (var i = 0; i < this.cm.length; i++) {
            this.addGridColumn(this.cm[i]);
        }
    },
    initButtonsGd: function() {

    }
});
LOG.fact.gd = {
    editor: function(config) {
        this.cm = new Ext.grid.ColumnModel(config.cm);
        this.st = new Ext.data.Store(config.store);
        this.sm = LOG.util.UIManager.initSelectionModel(2);
        this.gdGeneral = LOG.util.UIManager.initEditableGridPanel(this.cm, this.st, this.sm);
        var tbarGd = this.gdGeneral.getTopToolbar();
        tbarGd.add(
            '-', new Ext.form.TextField({width: 200, emptyText: config.idioma.lbCriterioBuscar}),
            '-', LOG.util.Prototipos.botonBuscar({idioma: config.idioma}),
            '-', LOG.util.Prototipos.botonLimpiar({idioma: config.idioma})
        );
        this.pGdGeneral = LOG.util.UIManager.initPanel(config.panel);
        this.pGdGeneral.add(this.gdGeneral);
        this.pGdGeneral.doLayout();
        return this.pGdGeneral;
    }
};

LOG.fact.calcular =  Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        Ext.apply(config, {
            usarAplicar: false,
            title: 'Calcular factor de converci\xf3n',
            width: 400,
            height: 180
        });
        this.modelo = new LOG.util.Model({
            idioma: config.idioma,
            urlAccionGuardar: 'adicionarFactura',
            fields: [
                {
                    primary: true,
                    name: 'idmovimiento'
                }
            ]
        });
        var idmovimiento = Array();
        var productos = Array();
        Ext.each(config.movimiento, function(mov){
            idmovimiento.push(mov.json.idmovimiento)
            productos.push(mov.data)
        });
        this.modelo.idmovimiento = idmovimiento;
        this.modelo.productos = productos;
        LOG.fact.calcular.superclass.constructor.call(this, config);
    },
    /**
     *
     * @returns {undefined}
     */
    initComponent: function () {
        var _this = this;
        LOG.fact.calcular.superclass.initComponent.call(this);
        this.clsUMOrigen = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.cantOrigen = LOG.util.Prototipos.inputTexto({
            fieldLabel: 'UM Recepci\xf3n',
            disabled: true,
            value: _this.movimiento[0].json.umedida
        });
        this.clsUMOrigen.addComponent(this.cantOrigen);
        this.cantidadFactura = LOG.util.Prototipos.inputDecimal({
            fieldLabel: 'Cantidad en factura',
            allowBlank: false,
            name: 'factura'
        });
        this.clsUMOrigen.addComponent(this.cantidadFactura);
        this.clsUMDestino = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.UMC = LOG.util.Prototipos.inputTexto({
            fieldLabel: 'UM Calcular',
            disabled: true,
            value: _this.movimiento[0].json.umedidamatriz

        });
        this.clsUMDestino.addComponent(this.UMC);
        this.valorFact = LOG.util.Prototipos.inputDecimal({
            fieldLabel: 'Referencia',
            name: 'referencia'
        });
        this.clsUMDestino.addComponent(this.valorFact);
        this.panel = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [this.clsUMOrigen, this.clsUMDestino]
        });
        this.modelo.bindForm(this.panel);
        this.modelo.addActionButton(this.listaBotones.getItem(2));
        this.add(this.panel);
    },
    /**
     *
     * @returns {undefined}
     */
    aceptarFn: function () {
        var _this = this;
        this.modelo.salvar({}, function () {
            if (typeof _this.postSalvar == 'function') {
                _this.postSalvar.createDelegate(_this).call();
            }
        }, function(){}, 'Los datos han sido guardados satisfactoriamente');
    },
    postSalvar: function () {
      var _this = this;
      _this.storeProd.reload();
    }
});

LOG.fact.cilindros = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma = config.idioma;
        config.modoSeleccion = 3;
        config.autoLoad = false;
        config.formaVisualizacion = 'ventana';
        config.autoSelect = false;
        this.concepto = config.concepto;
        this.busquedaBasica = false;
        this.dataIndexPrincipal = config.dataIndexPrincipal;
        this.util = config.util;
        this.gpParent = config.gpParent;
        this.gridEditable = true;
        config = Ext.apply(_this, config);
        LOG.fact.cilindros.superclass.constructor.call(this, config);

    },
    init: function () {
        var _this = this;
        LOG.fact.cilindros.superclass.init.call(this);
        _this.getVistaPrincipal().width = 500;
        _this.getVistaPrincipal().height = 350;
        _this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).disable();


    },
    aceptarFn: function(){
        console.info('aceptar');
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idnomcilindro'
        });
        this.addGridColumn({
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            dataIndex: 'idumedida'
        });
        this.addGridColumn({
            dataIndex: 'idcilindrofactura'
        });
        this.addGridColumn({
            header: _this.idioma.cmDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: 'Capacidad',
            dataIndex: 'capacidad',
            align: 'right',
            default: true
        }));
        this.addGridColumn({
            header: 'U/M',
            width: 100,
            dataIndex: 'umedida',
            default: true
        });
        if (!this.nomenclador) {
            this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
                header: 'Cantidad',
                dataIndex: 'cantidad',
                align: 'right',
                default: true,
                editable: true,
                editor: LOG.util.Prototipos.inputDecimal({
                    listeners: {
                        focus: function(t) {
                            t.selectText(0, t.getValue().length);
                        }
                    }
                })
            }));
        }
    },
    render: function () {
        var _this = this;
        var p = LOG.fact.cilindros.superclass.render.call(this);
        if (!this.nomenclador) {
            _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(function (e) {
                if (e == "afteredit") {
                    if (_this.getStorePrincipal().getModifiedRecords().length > 0) {
                        _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                    }else{
                        _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                    }
                }
            });
            _this.getGridPrincipal().on({
                beforeedit: function(e) {
                    if (_this.estado != 1) {
                        console.info(e)
                        e.cancel = true;
                    }
                }
            });
            _this.getVistaPrincipal().maximize();
        } else {
            _this.getSmPrincipal().fireEvent = this.getSmPrincipal().fireEvent.createSequence(function(e) {
                if (e == 'selectionchange') {
                    if (this.getCount()> 0) {
                        _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                    }else{
                        _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                    }
                }
            });
        }
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                /*st.initBaseParams.tipocliente = _this.tipocliente;
                st.initBaseParams.idclientesproveedores = _this.idclientesproveedores;*/
                st.initBaseParams.idindicador = _this.idindicador;
                st.initBaseParams.iddocumento = _this.iddocumento;
                st.initBaseParams.idmovimiento = _this.idmovimiento || null;
                st.initBaseParams.idelementofactura = _this.idelementofactura || null;

                st.baseParams.start = 0;
                st.baseParams.limit = 30;
            }
        });
        return p;
    }
});
