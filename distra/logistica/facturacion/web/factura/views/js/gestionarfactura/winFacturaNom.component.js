Ext.ns('LOG.fact');
LOG.fact.winFacturaNom = Ext.extend(LOG.fact.winFactura, {
    constructor: function(config) {
        var _this = this;
        this.manualproductos = config.manualproductos;
        this.alquiler = config.alquiler;
        this.deshabilitarBotonesGrids = config.deshabilitarBotonesGrids;
        LOG.fact.winFacturaNom.superclass.constructor.call(this, config);
    },
    showWindowProducto: function(tipo, servicio) {
        var _this = this;
        var idseleccionados = [];
        var parametros = {};
        if(tipo == 1 && !servicio){
            if(_this.accion == 'add'){
                /*Ext.each(_this.recordProd, function(rec) {
                    idseleccionados.push(rec.idindicador);
                });*/
            }else{
                if (_this.storeProd.reader.jsonData) {
                    /*Ext.each(_this.storeProd.reader.jsonData.datosAux, function(rec) {
                        idseleccionados.push(rec.idindicador);
                    });*/
                }
            }
        }else if(servicio){
            /*Ext.each(servicio.data.materiales, function(rec) {
                idseleccionados.push(rec.idindicador);
            });*/
        }
        else
        {
            /*Ext.each(_this.recordServ, function(rec) {
                idseleccionados.push(rec.idindicador);
            });*/
        }
        //parametros.idseleccionados = Ext.encode(idseleccionados);
        //parametros.almacenado = 0;
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
                                if(!servicio){
                                    rec.data.cantidad = 0;
                                    _this.recordProd.push(rec.data)
                                }else{
                                    rec.data.cantidad = 1;
                                    rec.data.preciobase = rec.data.precio;
                                    rec.data.importetotal = rec.data.cantidad * rec.data.precio;
                                    if(!servicio.json.materiales)
                                        servicio.json.materiales = new Array();
                                    servicio.json.materiales.push(rec.data)
                                }
                            });
                            if(!servicio){
                                _this.guardarDatos('add',true,this);
                                //_this.storeProd.load();
                            }
                            else {
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
                            }
                        }else{
                            Ext.each(r, function(rec) {
                                rec.json.cantidad = 1;
                                rec.json.preciotarifa = rec.json.precio;
                                rec.json.preciotarifabase = rec.json.precio;
                                rec.json.idtipoprecio = _this.tarifaDefault;
                                _this.recordServ.push(rec.json);
                            });
                            _this.guardarDatos('add',true);
                            //_this.storeServ.load();
                        }
                    } else {
                        (tipo == 1)?((servicio)?_this.addProductoServicio(r, this):_this.addProductoDocumento(r, this)):_this.addServicioDocumento(r, this);

                    }

                }
            });
            v.show();
        })
    },
    /*createPnDatosTransporte: function() {
     return null;
     }*/
    eliminarProducto: function(seleccion) {
        var _this = this;
        if (_this.accion == 'add') {
            var recorProdAux = [];
            for (var i = 0; i < seleccion.length; i++) {
                _this.storeProd.remove(seleccion[i]);
            }
            for (var i = 0; i < _this.recordProd.length; i++) {
                if (!_this.findProducto(_this.recordProd[i].idindicador, seleccion)) {
                    recorProdAux.push(_this.recordProd[i]);
                }
            }

            _this.recordProd = recorProdAux;
            if(_this.recordProd.length == 0){
                /*_this.panelDatosTransp.setDisabled(true);
                 _this.chxUtilizarGuia.disable();*/
                if(_this.chxReservaDisponible){
                    _this.chxReservaDisponible.enable();
                }
            }
            if(_this.cmbCliente)
                _this.cmbCliente.setDisabled(false);//reset los datos del panel(falta)
            _this.storeProd.reload();

        } else {
            var movimientos = new Array();
            Ext.each(seleccion, function(sel) {
                movimientos.push(sel.json.idelementofactura);
            });
            Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
            Ext.Ajax.request({
                url: 'eliminarProdFactura',
                method: 'post',
                params: {
                    datos: Ext.encode(movimientos),
                    idsubsistema: _this.idsubsistema,
                    iddocumento:seleccion[0].json.idfactura
                },
                success: function(rp) {
                    var value = Ext.decode(rp.responseText);
                    _this.documento.json.importes = value.importes;
                    _this.setImporteTotal();
                    Ext.MessageBox.hide();
                    _this.recargar = true;
                    _this.storeProd.reload();
                }
            });
        }
    },
    findProducto: function(producto, array) {
        for (var i = 0; i < array.length; i++) {
            if (producto == array[i].data.idindicador) {
                return true;
            }
        }
        return false;
    },
    createPnDatosTransporte: function () {
        var _this = this;
        var documentoOrigen = false
        if (this.tipoDoc == 4 ||
            this.tipoDoc == 5 ||
            this.tipoDoc == 7 ||
            this.tipoDoc == 8 || (this.documento && this.documento.json.docorigen)) {
            documentoOrigen = true;
        }
        var formTransporte = (_this.tipoDoc == 1) ? false :
            ((_this.idsubsistema == -1) ? ((_this.manualproductos) ? true : false) :
                ((_this.idsubsistema == LOG.util.Subsistemas.activosfijos) ? ((!_this.datosComunes) ? ((_this.documento.json.alquiler == 0) ? true : false) : ((_this.alquiler) ? false : true)) : true));
        this.frmTransporteOtros = (_this.tipoDoc != 1)
            ? ((!_this.datosComunes) ? new LOG.util.ColumnForm({columnas: ((formTransporte) ? ((documentoOrigen) ? 3 : 2) : 2)}) : LOG.util.UIManager.initPanel({}))
            : new LOG.util.ColumnForm({
            columnas: 2
        });
        if (_this.tipoDoc != 1) {
            var pos = (_this.datosComunes) ? 1 : 2;
            this.cmbOrganTransp = new Ext.form.TriggerField({
                fieldLabel: this.idioma.lbOrganizacionTransporte,
                name: 'nombretransp',
                triggerClass: 'x-form-cliente-trigger',
                editable: false,
                emptyText: _this.idioma.cbEmtyText,
                width: 50,
                tabular: true,
                listeners: {
                    onSelect: function (record) {
                        if (record.combo.isDirty()) {

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

            this.cmbOrganTransp.onTriggerClick = function (e) {
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
                value: ((_this.accion == 'add') ? 4 : _this.documento.json.viatransporte),
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
                    select: function (cb, r, i) {

                        if (cb.getValue() == 2) {
                            _this.txtfCartaPorte.setVisible(false);
                            _this.txtfCartaPorte.setValue();
                            _this.txtfMatriculaVehiculo.setValue();
                            _this.changeLabel('idmatriculavehiculo', _this.idioma.lbNroEmbarque);
                        } else if (cb.getValue() == 3) {
                            _this.txtfCartaPorte.setVisible(false);
                            _this.txtfCartaPorte.setValue();
                            _this.txtfMatriculaVehiculo.setValue();
                            _this.changeLabel('idmatriculavehiculo', _this.idioma.lbNroGuiaAerea);
                        } else if (cb.getValue() == 4) {
                            _this.txtfCartaPorte.setVisible(true);
                            if (_this.documento)
                                _this.txtfCartaPorte.setValue(_this.documento.json.cartaporte);
                            else
                                _this.txtfCartaPorte.setValue();
                            _this.txtfMatriculaVehiculo.setValue();
                            _this.changeLabel('idmatriculavehiculo', _this.idioma.lbMatriculaVehiculo);
                        } else {
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
                /*maxLength: '10',
                minLength: '5',
                regex: /^[\w]+$/,
                regexText: this.idioma.lbAlfanumericos*/
            });

            this.txtfCartaPorte = LOG.util.Prototipos.inputTexto({
                fieldLabel: this.idioma.lbNroCartaPorte,
                name: 'cartaporte',
                /*maxLength: '10',*/
                minLength: '5',
                minLengthText: this.idioma.lbMinTexIdentidadConductor,
                maxLengthText: this.idioma.lbMaxTexIdentidadConductor,
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
            if (!_this.datosComunes) {
                if(formTransporte)
                    this.frmTransporteOtros.addComponent(this.fsDatosTransporte);
                if (documentoOrigen) {
                    this.frmTransporteOtros.addComponent(_this.createPnDatosDocOrigen());
                }
                this.frmTransporteOtros.addComponent(this.txtAObservaciones);
                if (documentoOrigen && formTransporte) {
                    this.frmTransporteOtros.getColumn(0).columnWidth = 0.46;
                    this.frmTransporteOtros.getColumn(1).columnWidth = 0.27;
                    this.frmTransporteOtros.getColumn(2).columnWidth = 0.27;

                    this.frmDatosTransporte.getColumn(1).getComponent(0).anchor = '97%';
                    this.frmDatosTransporte.getColumn(2).getComponent(0).anchor = '97%';
                } else {
                    if(formTransporte || documentoOrigen){
                        this.frmTransporteOtros.getColumn(0).columnWidth = 0.60;
                        this.frmTransporteOtros.getColumn(1).columnWidth = 0.40;
                    }else{
                        /*this.txtAObservaciones = new Ext.form.TextArea({
                            fieldLabel: this.idioma.lbTextObservaciones,
                            anchor: '100% -3',
                            enableKeyEvents: true,
                            maxLength: '255',
                            minLength: '2',
                            height: 130
                        });
                        this.frmTransporteOtros.addComponent(this.txtAObservaciones);*/
                        this.frmTransporteOtros.getColumn(0).columnWidth = 1;
                    }
                }
            } else {
                if(formTransporte)
                    this.frmTransporteOtros.add(this.fsDatosTransporte);
                else
                    return false;
            }
        } else {
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
    }
});
