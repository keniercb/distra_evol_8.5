Ext.ns('LOG.fact');

LOG.fact.facturacionModel = Ext.extend(LOG.lb.documento.Model, {
    /**
     * 
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.parent = config.parent;
        config.fields = [{
            name: 'idcliente'
        },{
            name: 'idcontrato'
        }, {
            name: 'estado'
        }, {
            name: 'idcuentabancaria'
        }, {
            name: 'idcuentabancliente'
        }, {
            name: 'idmoneda'
        }, {
            name: 'idcondicionpago'
        }, {
            name: 'fecha'
        }, {
            name: 'numero'
        }, {
            name: 'idseriedocentidad'
        },{
            name: 'denomserie'
        }, {
            name: 'nrodocumento'
        }, {
            name: 'nrocontrol'
        },{
            name: 'nombretransp'
        },{
            name: 'nrorden'
        },{
            name: 'idcomprobante'
        }];

        LOG.fact.facturacionModel.superclass.constructor.call(this, config);
    },
    funcionConfirmar: function(seleccion, desdeAdd){
        var _this = this;
        //falta verificar bloqueo
        if(!desdeAdd){
            mostrarMensaje(2, _this.idioma.lbQuestFacturaConfirmada, function(btn, text) {
                if (btn === 'ok') {
                    var iddocumento = Array();
                    Ext.each(seleccion, function(sel){
                        iddocumento.push(sel.json.iddocumento);
                    });
                    var mascara = new Ext.LoadMask(Ext.getBody(), {
                        msg: _this.idioma.msjLoadVerificandoDatosDoc
                    });
                    mascara.show();
                    Ext.Ajax.request({
                        url: 'verificarDatosProductos',
                        params: {
                            iddocumento: Ext.encode(iddocumento),
                            subsistema: _this.parent.idsubsistema
                        },
                        success: function(response) {
                            mascara.hide();
                            var data = Ext.decode(response.responseText);
                            Ext.each(seleccion, function(sel){
                                sel.json.arrayProd = data.productos[sel.json.iddocumento];
                            });
                            _this.prepararConfirmar(seleccion);
                        }
                    });
                } /*else
                 Ext.getCmp('idvpFctauras').desbloqueardoc();*/
            });
        }else{
            mostrarMensaje(2, _this.idioma.lbQuestFacturaConfirmada1, function(btn, text) {
                if(btn === 'ok'){
                    Ext.MessageBox.wait(_this.idioma.msjLoadVerificandoDatosDoc, _this.idioma.msgEspere || '...');
                    var iddocumento = Array();
                    Ext.each(seleccion, function(sel){
                        iddocumento.push(sel.json.iddocumento);
                    });
                    Ext.Ajax.request({
                        url: 'verificarDatosProductos',
                        params: {
                            iddocumento: Ext.encode(iddocumento),
                            subsistema: _this.parent.idsubsistema
                        },
                        success: function(response) {
                            Ext.MessageBox.hide();
                            var data = Ext.decode(response.responseText);
                            Ext.each(seleccion, function(sel){
                                sel.json.arrayProd = data.productos[sel.json.iddocumento];
                            });
                            _this.prepararConfirmar(seleccion,true);
                        }
                    });
                }
            });
        }
    },
    prepararConfirmar: function(seleccion, desdeAdd) {
        var _this = this;
        var seleccion = seleccion;
        var numeros = '';
        var todosCero = '';
        var todosServCero = '';
        var algunosCero = '';
        var algunosServCero = '';
        var faltanDatos = '';
        var movimientos = [];
        var servicios = [];
        var iddocumentos = [];
        /*if (desdeAdd) {

         } else {*/
        var transporte = false;
        Ext.each(seleccion, function(uno) {
                if (uno.json.arrayProd && uno.json.arrayProd.length > 0) {
                    var precioCero = false;
                    var cantCero = 0;
                    Ext.each(uno.json.arrayProd, function(prod) {
                        if (parseFloat(prod.pcontable) == 0 && parseFloat(prod.palternativo) == 0 && uno.json.iddoc != iddocnotacredito) {
                            precioCero = true;
                        }
                        /*for(nombrePropiedad in prod){
                            if(nombrePropiedad.indexOf('preciocontable') != -1){
                                if(prod[nombrePropiedad] == 0){
                                    precioCero = true;
                                    break;
                                }
                            }
                        }*/
                        if (parseFloat(prod.cantidad) == 0 && uno.json.iddoc != iddocnotacredito) {
                            cantCero++;
                            movimientos.push((prod.idmovimiento) ? prod.idmovimiento : prod.idelementofactura);
                        }
                    });
                    if (precioCero) {
                        numeros += (numeros == '') ? uno.json.numeroref : ', ' + uno.json.numeroref;
                    } else {
                        if (cantCero == uno.json.arrayProd.length && cantCero > 0) {
                            todosCero += (todosCero == '') ? uno.json.numeroref : ', ' + uno.json.numeroref;
                        } else if (cantCero > 0 && cantCero < uno.json.arrayProd.length) {
                            algunosCero += (algunosCero == '') ? uno.json.numeroref : ', ' + uno.json.numeroref;
                        }
                    }
                    /*if (uno.json.oferta == 0 && uno.json.tipoDoc != 8) {
                        if (uno.json.idproveedor == null || uno.json.nombrechofer == null
                            || uno.json.identidadchofer == null || uno.json.matriculavehiculo == null
                            || uno.json.nombrechofer == ''
                            || uno.json.identidadchofer == '' || uno.json.matriculavehiculo == '') {
                            transporte = true;
                            if (!precioCero)
                                numeros += (numeros == '') ? uno.json.numeroref : ', ' + uno.json.numeroref;
                        }
                    }*/
                    //if (uno.json.guiaexpedicion == 0) {


                    //}
                }
                if(_this.parent.configFacturacion.utilizarserie == 1){
                    if(uno.json.oferta == 0 && (uno.json.idseriedocentidad == null || uno.json.idseriedocentidad == '')
                        //|| (uno.json.idcondicionpago == null || uno.json.idcondicionpago == '')
                        && ((uno.json.idcuentabancaria == null || uno.json.idcuentabancaria == '')
                            || (uno.json.idcuentabancliente == null || uno.json.idcuentabancliente == ''))){
                        faltanDatos += (faltanDatos == '') ? uno.json.numeroref : ', ' + uno.json.numeroref;
                    }
                }else{
                    if (uno.json.oferta == 0 /*&& (uno.json.idcondicionpago == null || uno.json.idcondicionpago == '')*/
                        && ((uno.json.idcuentabancaria == null || uno.json.idcuentabancaria == '')
                            || (uno.json.idcuentabancliente == null || uno.json.idcuentabancliente == ''))) {
                        faltanDatos += (faltanDatos == '') ? uno.json.numeroref : ', ' + uno.json.numeroref;
                    }
                }

                if(uno.json.arrayServ && uno.json.arrayServ.length > 0){
                    var cantServCero = 0;
                    var tarifaCero = false;
                    Ext.each(uno.json.arrayServ, function(serv) {
                        if (parseFloat(serv.preciotarifacontable) == 0 && parseFloat(serv.preciotarifaalternativo) == 0 && uno.json.iddoc != iddocnotacredito) {
                            tarifaCero = true;
                        }
                        if (parseFloat(serv.cantidad) == 0 && uno.json.iddoc != iddocnotacredito) {
                            cantServCero++;
                            servicios.push(serv.idelementofactura);
                        }
                    });
                    if (!precioCero && tarifaCero) {
                        numeros += (numeros == '') ? uno.json.numeroref : ', ' + uno.json.numeroref;
                    }else {
                        if (cantServCero == uno.json.arrayServ.length && cantServCero > 0) {
                            todosServCero += (todosServCero == '') ? uno.json.numeroref : ', ' + uno.json.numeroref;
                        } else if (cantServCero > 0 && cantServCero < uno.json.arrayServ.length) {
                            algunosServCero += (algunosServCero == '') ? uno.json.numeroref : ', ' + uno.json.numeroref;
                        }
                    }
                }

            iddocumentos.push(uno.json.iddocumento);

        });
        if (numeros != '') {
            var mensaje = '';
            if(!desdeAdd){
                mensaje = _this.idioma.lbMsgFaltanDatos;
                if(transporte){
                    mensaje += _this.idioma.lbMsgFaltanDatosTransp;
                }
                mensaje += _this.idioma.lbMsgFaltanDatosNoReg + "<b>" + numeros + "</b>";
                mostrarMensaje(1, mensaje);
            }else{
              mensaje = _this.idioma.lbMsgFaltanDatos;
                if(transporte){
                    mensaje += _this.idioma.lbMsgFaltanDatosTransp;
                }
                mensaje += _this.idioma.lbMsgFaltanDatosNoReg;
                mostrarMensaje(1, mensaje);
            }/*else{
                mensaje = _this.idioma.lbMsgFaltanDatos1 +((seleccion[0].json.oferta != 1)?_this.idioma.lbMsgFaltanDatosTransp:'')+ _this.idioma.lbMsgFaltanDatosNoReg
                mostrarMensaje(1, mensaje);
                if(_this.parent.winFactura.frmDatosTransporte){
                    if(!_this.parent.winFactura.isValidTransporte()
                        && seleccion[0].json.tipoDoc != 8
                        && (seleccion[0].json.arrayProd && seleccion[0].json.arrayProd.length > 0)){
                        _this.parent.winFactura.tbNorth.setActiveTab(1);
                        if(!_this.parent.winFactura.cmbOrganTransp.getValue())
                            _this.parent.winFactura.cmbOrganTransp.markInvalid(_this.idioma.msgInvalidTransporte);
                        if(_this.parent.winFactura.txtfNombreConductor.getValue() == '' || _this.parent.winFactura.txtfNombreConductor.getValue() == null)
                            _this.parent.winFactura.txtfNombreConductor.markInvalid(_this.idioma.msgInvalidTransporte);
                        if (_this.parent.winFactura.txtfIdenConductor.getValue() == '' || _this.parent.winFactura.txtfIdenConductor.getValue() == null)
                            _this.parent.winFactura.txtfIdenConductor.markInvalid(_this.idioma.msgInvalidTransporte);
                        if (_this.parent.winFactura.txtfMatriculaVehiculo.getValue() == '' || _this.parent.winFactura.txtfMatriculaVehiculo.getValue() == null)
                            _this.parent.winFactura.txtfMatriculaVehiculo.markInvalid(_this.idioma.msgInvalidTransporte);
                    }
                }
            }*/
        }else if(faltanDatos != ''){
            mensaje = _this.idioma.lbMsgFaltanDatosDoc;
            mensaje +=  "<b>" + faltanDatos + "</b>";
            mostrarMensaje(1, mensaje);
        }
        else if (todosCero != '' && _this.parent.winFactura.documento.json.iddoc != iddocnotacredito) {
            if(!desdeAdd) {
                mostrarMensaje(1, _this.idioma.lbMsgTodosCero + "<b>" + todosCero + "</b>");
            }else{
                mostrarMensaje(1, _this.idioma.lbMsgTodosCero1);
            }
        } else if (algunosCero != '' && _this.parent.winFactura.documento.json.iddoc != iddocnotacredito) {
            mostrarMensaje(2, _this.idioma.lbMsgCantidadCero1 + _this.idioma.lbMsgCantidadCero2, function(btn) {
                if (btn == 'ok') {
                    _this.eliminarProdFactura(movimientos, iddocumentos, desdeAdd);
                    //eliminar los servicios
                }
            });
        } else {
            _this.confirmarDocumentos(iddocumentos, desdeAdd);
        }
        // }

    },
    eliminarProdFactura: function(movimientos, documentos, desdeAdd) {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.msgEliminandoProductos, _this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'eliminarProdFactura',
            params: {
                datos: Ext.encode(movimientos),
                idsubsistema: _this.parent.idsubsistema,
                iddocumento: Ext.encode(documentos)
            },
            success: function(response) {
                Ext.MessageBox.hide();
                var data = Ext.decode(response.responseText);
                if (data.success == true) {
                    if(_this.parent.winFactura && _this.parent.winFactura.storeProd)
                        _this.parent.winFactura.storeProd.load();
                    _this.confirmarDocumentos(documentos, desdeAdd);
                    if(desdeAdd){
                        _this.parent.winFactura.recargar = true;
                    }
                }
            }
        });
    },
    confirmarDocumentos: function(documentos, desdeAdd) {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.msgConfirmandoObjeto, _this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'confirmarFactura',
            method: 'post',
            params: {
                documentos: Ext.encode(documentos)
            },
            success: function(rp) {
                Ext.MessageBox.hide();
                var value = Ext.decode(rp.responseText);
                if (value.codigoMsg && value.codigoMsg == 1) {
                    mostrarMensaje(1, (desdeAdd)?_this.idioma.lbMsgFacturaConfirmada1:_this.idioma.lbMsgFacturaConfirmada);
                    if(!desdeAdd)
                        _this.parent.getGridPrincipal().getStore().reload();
                    else{
                        _this.parent.winFactura.destruirPaneles();
                        _this.parent.winFactura.documento.json.estado = value.respuesta.estado;
                        _this.parent.winFactura.habilitarBtn(value.respuesta.estado);
                        _this.parent.winFactura.setTitulo();
                        _this.parent.winFactura.recargar = true;
                        if(_this.parent.winFactura.lote){
                            _this.parent.winFactura.lote.getPanelSuperior().getTopToolbar().items.items[1].disable();
                            _this.parent.winFactura.lote.getPanelSuperior().getTopToolbar().items.items[3].disable();
                        }
                    }
                }
            }
        });
    },
    anularEstatus: function(seleccion, desdeAdd){
        var _this = this;
        var documentos = Array();
        var estado = Array();
        var seleccion = seleccion;
        Ext.each(seleccion, function(sel) {
            documentos.push(sel.json.iddocumento);
            estado.push(sel.json.estado);
        });
        Ext.MessageBox.wait(_this.idioma.msgAnulandoEstadoObjeto, _this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'anularEstadoFactura',
            method: 'post',
            params: {
                documentos: Ext.encode(documentos),
                estado: Ext.encode(estado)
            },
            success: function(rp) {
                Ext.MessageBox.hide();
                var value = Ext.decode(rp.responseText);
                if(!desdeAdd){
                    _this.parent.getGridPrincipal().getStore().reload();
                    mostrarMensaje(1, _this.idioma.lbMsgEstadoAnulado);
                }
                else{
                    _this.parent.winFactura.documento.json.estado = value.respuesta.estado;
                    _this.parent.winFactura.habilitarBtn(value.respuesta.estado);
                    _this.parent.winFactura.setTitulo();
                    _this.parent.winFactura.recargar = true;
                }
            }
        });
    },
    contabilizarFactura: function(seleccion, desdeAdd){
        var _this = this;
        var documentos = Array();
        var infoDocumentos = Array();
        var seleccion = seleccion;
        Ext.each(seleccion, function(sel) {
            documentos.push(sel.json.iddocumento);
            infoDocumentos.push(sel.json);
        });  
        var mensaje = (desdeAdd) ? _this.idioma.lbQuestFacturaContabilizada1 : _this.idioma.lbQuestFacturaContabilizada;
        var objSubmit = {
            idComprobante: -1,
            id: Ext.encode(documentos)
        };
        mostrarMensaje(2, mensaje, function(btn, text) {
            if(btn == 'ok'){
                Ext.MessageBox.wait(_this.idioma.msgContabilizandoObjeto, _this.idioma.msgEspere || '...');
                Ext.Ajax.request({
                    url: 'contabilizarFactura',
                    method: 'post',
                    params: {
                        documentos: Ext.encode(documentos),
                        serie: _this.parent.configFacturacion.utilizarserie,
                        infoDoc: Ext.encode(infoDocumentos)
                    },
                    success: function(rp) {
                        var respuesta = Ext.decode(rp.responseText);
                        if (respuesta.datos == 1) {
                            mostrarMensaje(1, _this.idioma.lbMsgExistenciasNegativas)
                        } else {
                            if(respuesta.codMsg && respuesta.codMsg == 3){
                                return;
                            }
                            var mensajeExito = _this.idioma.lbMsgFacturaContabilizada;
                            if (respuesta.comprobante) {
                                if (respuesta.comprobante.codMsg) {
                                    mensajeExito = mensajeExito + "<br>No se ha podido generar el comprobante por descuadre en los importes";
                                } else {
                                    objSubmit.idComprobante = respuesta.comprobante.idComprobante;
                                    objSubmit.numComprobante = respuesta.comprobante.numComprobante;
                                    objSubmit.fechaComprobante = respuesta.comprobante.fechaComprobante;
                                    mensajeExito = mensajeExito + "<br>Se ha generado el comprobante numero: <b>"+respuesta.comprobante.numComprobante;
                                }
                            }
                            mostrarMensaje(1, mensajeExito);
                            if (objSubmit.idComprobante != -1) {
                                Ext.Ajax.request({
                                    url: '/logistica/facturacion/facturacion/comun_fact/index.php/comprobantefact/postCreateComprobanteAuto',
                                    method: 'POST',
                                    params: objSubmit,
                                    callback: function (o, s, r) {
                                        Ext.MessageBox.hide();
                                        if(!desdeAdd)
                                            _this.parent.getGridPrincipal().getStore().reload();
                                        /*if (s) {
                                            mostrarMensaje(1, _this.idioma.msgComprobanteGenerado + numComprobante + '.');
                                            _this.st.reload();
                                        }*/
                                    }.createDelegate(_this)
                                });
                            } else {
                                Ext.MessageBox.hide();
                            }
                            if(!desdeAdd) {
                                if (objSubmit.idComprobante == -1)
                                    _this.parent.getGridPrincipal().getStore().reload();
                            } else {
                                _this.parent.winFactura.documento.json.estado = respuesta.estado;
                                _this.parent.winFactura.documento.json.fechavencimiento = respuesta.fechavencimiento;
                                _this.parent.winFactura.habilitarBtn(respuesta.estado);
                                _this.parent.winFactura.cmbNroFactura.setValue(respuesta.nrofactura);
                                _this.parent.winFactura.setTitulo();
                                _this.parent.winFactura.recargar = true;
                            }
                        }
                    }
                });
            }
        });
    },
    confirmarAnularDocumento: function(seleccion, desdeAdd) {
        var _this = this;
        var anulObservaciones = new Ext.form.TextArea({
            fieldLabel: _this.idioma.lbTextObservacionesAnular,
            anchor: '99%',
            allowBlank: false,
            maxLength: '255',
            minLength: '2',
        });

        _this.anularDocumento = new Ext.Window({
            title: _this.idioma.lbConfirmacion,
            width: 440,
            height: 190,
            modal: true,
            resizable: false,
            constrain: true,
            items: new Ext.Panel({
                frame: true,
                autoHeight: true,
                autoWidth: true,
                bodyBorder: false,
                layout: 'form',
                labelAlign: 'top',
                items: [{
                    html: "<p><font size = '2'>" + _this.idioma.lbMsgConfirmacionAnularNumeroControl + "</font></p><br>"
                }, anulObservaciones]
            }),
            buttons: [{
                text: _this.idioma.lbBtnCancelar,
                //tooltip: _this.idioma.lbTxtBtnCancelar,
                iconCls: 'cancelar',
                handler: function () {
                    _this.anularDocumento.close();
                }
            }, {
                text: _this.idioma.lbBtnAceptar,
                //tooltip: _this.idioma.lbTxtBtnAAceptar,
                iconCls: 'aceptar',
                handler: function () {
                    if(anulObservaciones.isValid()){
                        var idsdocumentos = Array();
                        Ext.each(seleccion, function(uno) {
                            idsdocumentos.push(uno.json.iddocumento);
                        });
                        Ext.Ajax.request({
                            url: '/logistica/utiles/documento/index.php/documentologistica/getIdentificador',
                            params: {
                                iddocumento: Ext.encode(idsdocumentos),
                            },
                            success: function(response) {
                                var data = Ext.decode(response.responseText);
                                if (data.datos) {
                                    _this.anularFactura(anulObservaciones.getValue(),data.datos,desdeAdd);
                                    _this.anularDocumento.close();
                                }
                            }
                        });
                    }

                }
            }]
        });
        _this.anularDocumento.show();
        _this.anularDocumento.center();
    },
    anularFactura: function(text, seleccion, desdeAdd) {
        var _this = this;
            /*var idsdocumentos = Array();
            var seleccion = seleccion;
            Ext.each(seleccion, function(uno) {
                idsdocumentos.push(uno.json.iddocumento);
            });*/
            //Hay que verificar si tiene comprobante generado
            Ext.MessageBox.wait(_this.idioma.msjLoadAnular, _this.idioma.msgEspere || '...');
            Ext.Ajax.request({
                url: 'anularFactura',
                params: {
                    documentos: Ext.encode(seleccion),
                    observacion: text
                },
                success: function(response) {
                    var data = Ext.decode(response.responseText);
                    Ext.MessageBox.hide();
                    if (data.success === true) {
                        var message = _this.idioma.lbMsgFacturaAnulada;
                        if(!desdeAdd){
                            _this.parent.seleccionAnterior = Array();
                            _this.parent.getGridPrincipal().getStore().reload();
                        }
                        else{
                            _this.parent.winFactura.documento.json.estado = data.respuesta.estado;
                            _this.parent.winFactura.habilitarBtn(data.respuesta.estado);
                            _this.parent.winFactura.setTitulo();
                            _this.parent.winFactura.recargar = true;
                        }
                    }

                    mostrarMensaje(1, message);
                }
            });
    },
    imprimirModelo: function(btn, idsfacturas, desdeAdd){
        var _this = this;
        if(idsfacturas){
            var cantFacturas = idsfacturas.length,
                factSelected = idsfacturas;
                //isnotaentrega = 0;
        }else{
            var factSelected = _this.parent.getGridPrincipal().getSelectionModel().selections.items,
                cantFacturas = factSelected.length;
                //isnotaentrega = Ext.getCmp('idvpFctauras').gpFacturas.getSelectionModel().selections.items[0].data.isnotaentrega;
        }
        var factImprimir = [];
        for (var i = 0; i < cantFacturas; i++)
         {
            if(!idsfacturas){
                if (factSelected[i].data.nrocontrol != null && factSelected[i].data.nrocontrol != '' )
                    factImprimir.push(factSelected[i].data.nrocontrol);
            }
         }
        if(_this.parent.configFacturacion.factsistema == "0"){
            _this.parent.onReport(btn);
        }else{
            if((cantFacturas - factImprimir.length) == 0){
                _this.parent.onReport(btn);

            }else {
                if((!idsfacturas && factSelected[0].data.estado != 4) || (idsfacturas && idsfacturas[0].estado && idsfacturas[0].estado != 4)){
                    _this.parent.onReport(btn);
                }else{
                    var ventana = new LOG.fact.vAsignarNrosControl({
                        idioma: _this.idioma,
                        docFactura: _this.parent.getGridPrincipal().getStore(),
                        sm: _this.parent.getGridPrincipal().getSelectionModel(),
                        layout: 'fit',
                        cantFacturas: cantFacturas,
                        factImprimir: factImprimir,
                        idsfacturas: idsfacturas,
                        btn: btn,
                        vp: _this.parent,
                        desdeAdd: desdeAdd
                    });
                    ventana.show();
                }
            }
        }

    },
    enviarDatos: function(datos, apl) {
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
            success: function (rp) {
                Ext.MessageBox.hide();
                var value = Ext.decode(rp.responseText);
                var mensage = _this.idioma.msgAdicionarFacturas;
                mensage = mensage.replace('contador', value.respuesta.contador);
                mensage = mensage.replace('fechadoc', value.respuesta.fecha);
                mostrarMensaje(1, mensage);
                _this.parent.winFact.getGridPrincipal().getStore().initBaseParams.limit = _this.parent.winFact.getGridPrincipal().getBottomToolbar().cbPageSize.getValue();
                _this.parent.winFact.getGridPrincipal().getStore().load({
                    callback: function(st){
                        if(datos.abrir){
                            var index = _this.parent.winFact.getGridPrincipal().getStore().find('iddocumento', value.respuesta.documento.iddocumento);
                            var parametros = {};
                            parametros.title = _this.idioma.tAdicionarFactura;
                            parametros.configFacturacion = _this.parent.winFact.configFacturacion;
                            parametros.documento = _this.parent.winFact.getGridPrincipal().getStore().getAt(index);
                            parametros.accion = 'mod';
                            parametros.deshabilitarBotonesGrids = false;
                            _this.parent.winFact.createWinFactura(parametros);
                        }
                    }
                });
                if(datos.abrir){
                    _this.parent.close();
                } else {
                    _this.parent.pGdList.getGridPrincipal().getStore().reload({
                        callback: function(st){

                        }
                    });
                }
            }
        });
    },
    aplicarTipoPrecio: function(idtipoprecio, tipo, iddocumento, idmoneda, tasa, factor) {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.msgGuardando, _this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'aplicarTipoPrecio',
            params: {
                iddocumento: iddocumento,
                tipo: tipo,
                idtipoprecio: idtipoprecio,
                idmonedaprod: (tipo == 1) ? idmoneda : null,
                idmonedaserv: (tipo == 2) ? idmoneda : null,
                tasacambio: tasa || 1,
                factorconvercion: factor || 1,
            },
            success: function(response) {
                var data = Ext.decode(response.responseText);
                Ext.MessageBox.hide();
                if (data.success === true) {
                    _this.parent.winFactura.recargar = true;
                    if (tipo == 1) {
                      _this.parent.winFactura.storeProd.reload({
                          callback: function(){
                              _this.parent.winFactura.documento.json.importes = _this.parent.winFactura.storeProd.reader.jsonData.importes;
                              _this.parent.winFactura.setImporteTotal();
                          }
                      });
                    } else {
                      _this.parent.winFactura.storeServ.reload({
                            callback: function(){
                                _this.parent.winFactura.documento.json.importes = _this.parent.winFactura.storeServ.reader.jsonData.importes;
                                _this.parent.winFactura.setImporteTotal();
                            }
                      });
                    }
                }
                mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente');
            }
        });
    },
    exportarXml: function(documento) {

        var _this = this;

        this.txtfieldClave = new LOG.util.Prototipos.inputTexto({
            name: 'password',
            fieldLabel: 'Contrase\xf1a',
            anchor: '80%',
            editable: false,
            allowBlank: false,
            inputType: 'password'
        });

        this.cmbRecibe = new LOG.util.ComboBox({
            fieldLabel: 'Recibe',
            url: 'cargarContactos',
            autoLoad: false,
            name: 'idcontacto',
            valueField: 'idcontacto',
            displayField: 'nombre',
            editable: false,
            emptyText: _this.idioma.cbEmtyText
        });

        this.cmbRecibe.getStore().on('beforeload', function(st) {
            st.baseParams.idcliente = documento.data.idcliente;
            st.initBaseParams.idcliente = documento.data.idcliente;
        });

        this.frmDatosAux = new LOG.util.ColumnForm({columnas:2});
        this.frmDatosAux.addComponent(this.txtfieldClave);
        this.frmDatosAux.addComponent(this.cmbRecibe);

        this.fpP12 = LOG.util.UIManager.initForm({
            fileUpload: true,
            frame: true,
            bodyStyle: 'padding: 10px 10px 0 10px;',
            labelWidth: 50,
            region: 'center',
            defaults: {
                anchor: '95%',
                allowBlank: false
            },
            items: [
                {
                    xtype: 'fileupload',
                    emptyText: _this.idioma.lbSellecionArchivo,
                    fieldLabel: _this.idioma.lbArchivo,
                    name: 'file-path',
                    buttonCfg: {
                        text: '...',
                        // iconCls: _this.idioma.lbImportar
                    }
                },_this.frmDatosAux,
                {
                    xtype: 'hidden',
                    name: 'iddocumento'
                }
            ]
        });
        this.fpP12.getForm().setValues({iddocumento: documento.data.iddocumento});
        _this.exportarW = new Ext.Window({
            title: 'Factura digital',
            width: 600,
            height: 165,
            modal: true,
            resizable: false,
            constrain: true,
            items: [_this.fpP12],
            buttons: [{
                text: _this.idioma.lbBtnCancelar,
                //tooltip: _this.idioma.lbTxtBtnCancelar,
                iconCls: 'cancelar',
                handler: function () {
                    _this.exportarW.close();
                }
            }, {
                text: _this.idioma.lbBtnAceptar,
                //tooltip: _this.idioma.lbTxtBtnAAceptar,
                iconCls: 'aceptar',
                handler: function () {
                    if (!_this.fpP12.getForm().isValid()) {
                        mostrarMensaje(3, 'Mensaje de error');
                    }
                    else {
                        Ext.MessageBox.wait('Exportando a xml', _this.idioma.msgEspere || '...');
                        _this.fpP12.getForm().submit({
                            url: 'exportarXml',
                            success: function(form, action) {
                                Ext.MessageBox.hide();
                                /*if (!action.result.error) {
                                    mostrarMensaje(1, _this.idioma.msjImportar);
                                }
                                if (typeof _this.fn == 'function') {
                                    _this.fn.createDelegate(this, [action.result]).call();
                                }*/
                            },
                            failure: function(form, action) {
                                /*if (action.result.mensaje == 2) {
                                    mostrarMensaje(3, _this.idioma.msjNoFormato);
                                } else if (action.result.mensaje == 4) {
                                    mostrarMensaje(2, _this.idioma.msjError1);
                                } else {
                                    mostrarMensaje(3, _this.idioma.msjError2);
                                }*/
                            }
                        });
                    }

                    /*var objSubmit = {iddocumento: documento.data.iddocumento};
                    Ext.Ajax.request({
                        url: 'exportarXml',
                        method: 'POST',
                        params: objSubmit,
                        callback: function (o, s, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                            _this.apply(resp);
                            if (resp.success) {
                                if (resp.url) {
                                    var file_path = resp.url;
                                    var a = document.createElement('A');
                                    a.href = file_path;
                                    a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                }
                            } else {
                                if (typeof _fnfail == 'function') {
                                    _fnfail.createDelegate(_this, [resp]).call();
                                }
                            }
                        }.createDelegate(_this)
                    });*/
                }
            }]
        });
        _this.exportarW.show();
        _this.exportarW.center();
        this.cmbRecibe.getStore().load();
    },
    exportarCsv: function (documento) {
        var _this = this;
        var objSubmit = {iddocumento: documento.data.iddocumento};
        Ext.MessageBox.wait('Exportando a CSV', _this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'exportarCsv',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                _this.apply(resp);
                if (resp.success) {
                    if (resp.url) {
                        var file_path = resp.url;
                        var a = document.createElement('A');
                        a.href = file_path;
                        a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(_this, [resp]).call();
                    }
                }
            }.createDelegate(_this)
        });
    }
});