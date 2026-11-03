/*@descripcion: Funcion que pone un qtip en la celda con el valor de la misma
 *@parametros: valor,metadata
 **/

/*function getQtip(v,m,r) {
 m.attr = 'ext:qtip="' + ' ' + '"ext:qtitle="'+v+'"';
 return v;
 }*/
function getQtip(v, m, r) {//target: 'track-tip
    m.attr = 'ext:qtip="' + '<b>Fecha: </b>' + r.data.fechacreacion.format('d/m/Y') + '</br>'
            + '<b>No. documento: </b>' + r.data.numerodocumento + '</br>'
            + '<b>Tipo operación: </b>' + r.data.tipooperacion + '</br>'
            + '<b>Tipo documento: </b>' + r.data.denominacion + '</br>'
            + '<b>Importe: </b>' + formatoMonedaABS(r.data.importemo) + '</br>'
            + '<b>Estado: </b>' + r.data.estado + '</br>'
            + '<b>Beneficiario: </b>' + r.data.beneficiario.replace(/"/gi, '') + '</br>'
            + '<b>Especialidad: </b>' + r.data.descripcionespecialidad + '</br>'
            + '<b>Comentario: </b>' + r.data.comentario + '</br>'
            + '<b>No. CO: </b>' + r.data.numcomprobante + '"';
    return v;
}

var global_printer = null;  // it has to be on the index page or the generator page  always
function printmygridGO(obj) {
    global_printer.printGrid(obj);
}

function loadDataIni() {
    lMask.show();
    Ext.Ajax.request({
        url: 'loadDataIni',
        method: 'POST',
        params: {
            start: 0,
            limit: Ext.getCmp('gpinstrumentobanc').getBottomToolbar().pageSize
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.aperturado == 0) {//0=ci, 1=aperturado
                noWindow = false;//se pone en false para indicar que la ventana fue abierta
                mostrarMensaje(1, 'Banco no ha cerrado las operaciones de la carga inicial.', function(btn) {
                    if (btn == 'ok' || btn == 'cancel') {
                        Ext.getCmp('vpInstrumento').setDisabled(true);
                        gpinstrumentobanc.setDisabled(true);
                        Ext.getCmp('poperaciones').setDisabled(true);
                    }
                });
            }
            else {
                stinstrumentobanc.loadData(responseData.instrumentos);

                var msg = 'Período actual: ' + responseData.periodo.nombre;
                msg += ' desde ' + responseData.periodo.inicio + ' hasta ' + responseData.periodo.fin + ' | Fecha contable: ' + responseData.periodo.fechacontable;
                labelPeriodo.setText(msg);

                //Delimitando la fecha máxima para el campo fecha del buscar en la ventana
                //de liquidación
                // tffecha.setMaxValue(responseData.periodo.fechacontable);
                // tffechaFin.setMaxValue(responseData.periodo.fechacontable);
                // tffechaInicio.setMaxValue(responseData.periodo.fechacontable);

                if (!stinstrumentobanc.getCount()) {
                    mostrarMensaje(1, 'No existen datos que mostrar.');
                }

                //Cargar el id del cheque nominativo para luego poder saber
                //si se va a certificar
                idChequeNominativo();
            }

            btnAdicionar.focus();
            lMask.hide();
        }//callback
    });
}

/******************** funciones de Instrumento ************************/
//funcion para buscar instrumentos
function buscarInstrumento() {
    noWindow = false;//se pone en false para indicar que la ventana fue abierta
    lMaskBuscar = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    lMaskBuscar.show();
    if (!winbuscarinstrumento) {
        winbuscarinstrumento = new Ext.Window({
            autoValidate: false,
            constrain: true,
            modal: true,
            id: 'winbuscarinstrumento',
            labelAlign: 'top',
            frame: true,
            resizable: true,
            bodyStyle: 'padding:5px 5px 5px',
            border: false,
            closeAction: 'hide',
            layout: 'fit',
            title: 'Buscar instrumento bancario',
            width: 653,
            items: Ext.getCmp('fpbuscarinstrumento'),
//            height: 325,
            height: 290,
            buttons: [
                {
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
//                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    handler: function() {
                        winbuscarinstrumento.hide();
                    }
                }, {
                    text: 'Aceptar',
//                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function() {
//                        MostrarEtiquetas(Ext.getBody(), 'Buscando instrumento bancario...');
                        buscar();
                        /*stinstrumentobanc.reload({
                         params: {
                         start: 0,
                         limit: 20
                         },
                         callback: function(r, options, success) {
                         winbuscarinstrumento.hide();
                         if (stinstrumentobanc.getCount() === 0) {
                         mostrarMensaje(1, "No existen datos que se correspondan con los criterios de b\xFAsqueda especificados.", function() {
                         });
                         }
                         }
                         });*/
                    }
                }],
            listeners: {
                hide: function() {
                    noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                },
                show: function(window) {
                    var btnAcceptBus = window.buttons[1];
                    btnAcceptBus.getEl().addKeyMap([
                        {
                            key: Ext.EventObject.TAB,
                            stopEvent: true,
                            fn: function() {
                                tfbuscarnum.focus(true, true);
                            }
                        }
                    ]);

                    tfbuscarnum.getEl().addKeyMap([
                        {
                            key: Ext.EventObject.TAB,
                            shift: true,
                            stopEvent: true,
                            fn: function() {
                                btnAcceptBus.focus();
                            }
                        }
                    ]);
                }
            }
        });
        winbuscarinstrumento.show();//se muestra la ventana
        winbuscarinstrumento.center();
        //se cargan los valores por defecto
        comboEstado.setValue(stEstado.getAt(0).data.idestado);
        comboEstado.setRawValue(stEstado.getAt(0).data.estado);

        if (sttipodocbuscar.getCount() === 0 || stEjercicio.getCount() === 0 || stcuentabancbuscar.getCount() === 0 || stnumerocomprobantebuscar.getCount() === 0) {
            Ext.Ajax.request({
                url: 'loadDataBuscar',
                method: 'POST',
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.cuentas.datos.lenght === 0) {
                        lMaskBuscar.hide();
                        mostrarMensaje(1, "No se pudieron cargar las cuentas bancarias por las siguientes razones:<br>- No existen cuentas bancarias configuradas para el subsistema.<br>- Las cuentas bancarias configuradas para el subsistema est&aacute;n cerradas.", function(btn) {
                            winbuscarinstrumento.hide();
                            return;
                        });
                    } else {
                        stcuentabancbuscar.loadData(responseData.cuentas);
                    }
                    if (responseData.ejercicios.results.lenght === 0) {
                        lMaskBuscar.hide();
                        mostrarMensaje(1, "No se pudieron cargar los ejercicios contables.", function(btn) {
                            winbuscarinstrumento.hide();
                            return;
                        });
                    } else {
                        stEjercicio.loadData(responseData.ejercicios);
                    }
                    if (responseData.tiposdoc.datos.lenght === 0) {
                        lMaskBuscar.hide();
                        mostrarMensaje(1, "No se pudieron cargar los tipos de documentos.", function(btn) {
                            winbuscarinstrumento.hide();
                            return;
                        });
                    } else {
                        sttipodocbuscar.loadData(responseData.tiposdoc);
                    }
                    if (responseData.numcomp.datos.lenght === 0) {
                        lMaskBuscar.hide();
                        mostrarMensaje(1, "No se pudieron cargar los números de comprobante.", function(btn) {
                            // winbuscarinstrumento.hide();
                            // return;
                        });
                    } else {
                        stnumerocomprobantebuscar.loadData(responseData.numcomp);
                    }
                    if (responseData.periodo.idperiodo !== 0) {
                        dffechainicio.setRawValue(responseData.periodo.inicio);
                        dffechainicio.setMinValue(responseData.periodo.inicio);
                        dffechainicio.setMaxValue(responseData.periodo.fin);
                        dffechafin.setRawValue(responseData.periodo.fin);
                        dffechafin.setMinValue(responseData.periodo.inicio);
                        dffechafin.setMaxValue(responseData.periodo.fin);
                    }
                    else {
                        lMaskBuscar.hide();
                        mostrarMensaje(1, "No se pudieron cargar los per&iacute;odos contables.", function(btn) {
                            winbuscarinstrumento.hide();
                            return;
                        });
                    }

                    lMaskBuscar.hide();
                }
            });
        }
    }
    else {
        winbuscarinstrumento.show();//se muestra la ventana
        winbuscarinstrumento.center();
        lMaskBuscar.hide();
    }
    //se le da el foco al campo numero
    tfbuscarnum.focus(false, 10);
}

//estas lineas pertenecen al evento de seleccion del grid
//me permiten habilitar los botones del grid segun el estado del instrumento
function RowClick(sm, indiceFila, record) {
    idgridI = indiceFila;
    var arreglocant = sm.getSelections(); //= new Array();
    var cantsel = arreglocant.length;

    if (cantsel > 0) {

        //Si se ha seleccionado uno solo
        if (cantsel === 1) {
            /*caso en que fue certificado, se deshabilita todo*/
            if (arreglocant[0].data.fuecertificado) {
                btnModificar.setDisabled(true);
                btnCancelar.setDisabled(true);
                btnConfirmar.setDisabled(true);
                btnCertificar.setDisabled(true);
                btnContabilizar.setDisabled(true);
            }
            else if (arreglocant[0].data.estadocuenta) {
                //caso en el que la operacion bancaria esta cargada por estado de cuenta
                btnModificar.setDisabled(true);
                btnCancelar.setDisabled(true);
                btnConfirmar.setDisabled(true);
                btnCertificar.setDisabled(true);
                btnContabilizar.setDisabled(true);
            }
            else if (arreglocant[0].data.idestadodoccomunfinanzas == 1) { // Terminado
                btnModificar.setDisabled(false);
                btnConfirmar.setDisabled(false);
                btnCancelar.setDisabled(false);
                btnContabilizar.setDisabled(true);
                btnCertificar.setDisabled(true);

                if (arreglocant[0].data.tienecertificado) {
                    btnModificar.setDisabled(true);
                }

                if (arreglocant[0].data.tienenominativocertificado) {
                    btnCertificar.setDisabled(true);
                    btnModificar.setDisabled(true);
                }
            }
            else if (arreglocant[0].data.idestadodoccomunfinanzas == 5) { // Confirmado
                btnModificar.setDisabled(true);
                btnContabilizar.setDisabled(false);
                btnCancelar.setDisabled(false);
                btnConfirmar.setDisabled(true);
                btnCertificar.setDisabled(true);
            }
            else if (arreglocant[0].data.idestadodoccomunfinanzas == 6) { // Contabilizado
                btnModificar.setDisabled(true);
                btnCancelar.setDisabled(false);
                btnContabilizar.setDisabled(true);
                btnConfirmar.setDisabled(true);
//                btnCertificar.setDisabled(true);
                if (arreglocant[0].data.tienecertificado) {
                    /*se deshabilita el btn certificar*/
                    btnCertificar.setDisabled(true);
                }
                else if (arreglocant[0].data.tienenominativocertificado) {
                    btnCertificar.setDisabled(true);
                }
                else if (arreglocant[0].data.tienedoccertifica) {
                    //esto es cuando el instrumento tiene asociado el tipo de documento
                    //que se definió para certificar, en el componente de (Instrumento de pago)
                    btnCertificar.setDisabled(false);
                }
                else if (arreglocant[0].data.idtipodocumento == chequenominativo) {
                    btnCertificar.setDisabled(false);
                }
                else {
                    btnCertificar.setDisabled(true);
                }
            }
            else {
                btnModificar.setDisabled(true);
                btnConfirmar.setDisabled(true);
                btnContabilizar.setDisabled(true);
                btnCancelar.setDisabled(true);
                btnCertificar.setDisabled(true);
            }

            if (arreglocant[0].data.idmetodocertificacion != 0 && arreglocant[0].data.idmetodocertificacion != 1) {
                btnCertificar.setDisabled(true);
            }

        }
        else if (cantsel > 1) {
            var mismoEstado = true;
            var anycargadobyEstadoCuenta = false;
            var fuecertificado = false;
            //se deshabilita el botón modificar
            btnModificar.setDisabled(true);
            //se desahabilita el botón certificar pues no se debe certificar
            //dos instrumentos al mismo tiempo.
            btnCertificar.setDisabled(true);

            for (var i = 0; i < cantsel - 1; i++) {
                if (arreglocant[i].data.idestadodoccomunfinanzas != arreglocant[i + 1].data.idestadodoccomunfinanzas) {
                    mismoEstado = false;
                    //break;
                }
                if (arreglocant[i].data.estadocuenta || arreglocant[cantsel - 1].data.estadocuenta) {
                    anycargadobyEstadoCuenta = true;
                    //break;
                }
                if (arreglocant[i].data.fuecertificado || arreglocant[cantsel - 1].data.fuecertificado) {
                    fuecertificado = true;
                    //break;
                }
                if (!mismoEstado || anycargadobyEstadoCuenta || fuecertificado) {
                    break;
                }
            }

            //Si no tienen el mismo estado se inabilita todo
            // o si alguno de los seleccionado tiene estado de cuenta asociado
            //o si alguno de los seleccionados fue certificado
            if (!mismoEstado || anycargadobyEstadoCuenta || fuecertificado) {
                btnModificar.setDisabled(true);
                btnConfirmar.setDisabled(true);
                btnContabilizar.setDisabled(true);
                btnCancelar.setDisabled(true);
                btnCertificar.setDisabled(true);
            }
            else {

                if (mismoEstado && arreglocant[0].data.idestadodoccomunfinanzas == 7) {
                    btnModificar.setDisabled(true);
                    btnConfirmar.setDisabled(true);
                    btnContabilizar.setDisabled(true);
                    btnCancelar.setDisabled(true);
                    btnCertificar.setDisabled(true);
                }
                else {

                    var anyestado = (arreglocant[0].data.idestadodoccomunfinanzas == 1 ||
                            arreglocant[0].data.idestadodoccomunfinanzas == 5 ||
                            arreglocant[0].data.idestadodoccomunfinanzas == 6);
                    //si tiene el mismo estado y viene cualquiera
                    if (mismoEstado && anyestado) {
                        btnCancelar.setDisabled(false);
                    }

                    if (mismoEstado && arreglocant[0].data.idestadodoccomunfinanzas == 1) {
                        btnConfirmar.setDisabled(false);
                        btnContabilizar.setDisabled(true);
                    }
                    else if (mismoEstado && arreglocant[0].data.idestadodoccomunfinanzas == 5) {
                        btnConfirmar.setDisabled(true);
                        btnContabilizar.setDisabled(false);
                    }
                    else if (mismoEstado && arreglocant[0].data.idestadodoccomunfinanzas == 6) {
                        btnConfirmar.setDisabled(true);
                        btnContabilizar.setDisabled(true);
                    }

                }
            }
        }
    }
    else {
        btnModificar.setDisabled(true);
        btnConfirmar.setDisabled(true);
        btnContabilizar.setDisabled(true);
        btnCancelar.setDisabled(true);
        btnCertificar.setDisabled(true);
    }
}

function RowDblClick(sm, indiceFila, record) {
    idgridI = indiceFila;
    idanterior = idinstbancario;
    idinstbancario = stinstrumentobanc.data.items[idgridI].get('idinstrumentobancario');
    tipooperacionbnk = stinstrumentobanc.data.items[idgridI].get('tipooperacionbnk');
    var selection = sm.getSelections(); //= new Array();

    iddoc = selection[0].data.iddocumento;

    if (selection[0].data.fuecertificado) {
        if (!(Ext.getCmp('poperaciones').collapsed)) {
            Ext.getCmp('poperaciones').collapse(true);
        }
    }
    else {
        Ext.getCmp('poperaciones').expand(true);
        /*se expande el panel de las operaciones*/
        if (idanterior != idinstbancario) {
            // Limpiar valores de los Grid de mostrar
            stliq.removeAll();
            stpagoant.removeAll();
            streemblso.removeAll();
            stotras.removeAll();
            if (tipooperacionbnk == 1)//liquidacion
            {
                tpcuenta.activate(tpcuenta.getItem('tab1'));
                //stliq.load();
            }
            else if (tipooperacionbnk == 2)//anticipo
            {
                tpcuenta.activate(tpcuenta.getItem('tab2'));
                //stpagoant.load();
            }
            else if (tipooperacionbnk == 4)//otras operaciones
            {
                tpcuenta.activate(tpcuenta.getItem('tab4'));
                //stotras.load();
            }
        }
    }

}

function datosdeOperac(op) {
    instance = new PagingToolbarSelections({
        'selections': Ext.getCmp('gpinstrumentobanc').getSelectionModel().getSelections(),
        'activePage': Ext.getCmp('gpinstrumentobanc').getBottomToolbar().getPageData().activePage
    });
    arreglocant = instance.getSelectionsOnArray(arrayValues);

    var valuesestados = new Array();
    var valuestipodoc = new Array();
    var valuesiddocum = new Array();
    var valuesdocargainicial = new Array();

    var guardar = new Array();
    if (arreglocant.length > 0) {
        for (var i = 0; i < arreglocant.length; i++) {
            if (arreglocant[i].cargainicial == 1) {
                //mostrarMensaje(1,'No se pueden '+op+' los instrumentos seleccionados. <br>En la selecci&oacute;n hay instrumentos que fueron generados en la carga inicial.</br>');
                valuesdocargainicial[i] = {
                    'iddocumentocargainicial': arreglocant[i].iddocumento,
                    'idtipodocumento': arreglocant[i].idtipodocumento,
                    'importemb': arreglocant[i].importemb,
                    'importemo': arreglocant[i].importemo,
                    'idmoneda': arreglocant[i].idmoneda,
                    'idtasa': arreglocant[i].idtasa,
                    'idcuentabancaria': arreglocant[i].idcuentabancaria
                };
            }

            valuesiddocum[i] = arreglocant[i].iddocumento;
            valuesestados[i] = arreglocant[i].idestadodoccomunfinanzas;
            valuestipodoc[i] = arreglocant[i].idtipodocumento;
        }
        guardar[0] = [{
                'idestado': valuesestados
            }, {
                'idtipodocumento': valuestipodoc
            }, {
                'iddocumento': valuesiddocum
            }, {
                'documentocargainicial': valuesdocargainicial
            }];
        guardar[1] = arreglocant.length;
    }
    else {
        mostrarMensaje(1, 'Debe seleccionar el instrumento a ' + op);
    }
    return guardar;
}
//funcion para buscar la moneda
function buscarmoneda() {
    if (cbtipodoc.getValue() && cbcuentabanc.getValue()) {
        stmonedatasa.load({
            params: {
                idcta: cbcuentabanc.getValue()
            },
            callback: function(options, success, response) {
                if (!response)
                    lMasktemp.hide();
                if (stmonedatasa.getCount() == 0) {
                    lMasktemp.hide();
                    mostrarMensaje(1, 'La tasa actual de la moneda asociada a la cuenta bancaria ha excedido su per\u00edodo de vigencia. <br> Por favor seleccione otra cuenta bancaria.</br>');
                    cbcuentabanc.clearValue();
                    tfnumerodoc.reset(); // Quitado lo del focus por no conformidad de calidad
                }
            }
        });
    }
}

//funcion para buscar el trabajador en el subsistema Capital Humano
function buscarTrabajador() {

    vCasoUso = new Ext.UCID.WinIframe({// las propiedades
        title: 'Buscar trabajador' /*perfil.etiquetas.lbvctrabajador*/,
        id: 'winprueba',
        idIframe: 'iframepruebawin',
        url: 'buscarTrabajador', // accion buscarAction(){
        // $this->pIntegrator->trabajador->buscartrab(); }
        params: {
            idx: 'idparametrox',
            idy: 'idparametroy'
        },
        width: 700,
        height: 450,
        closeAction: 'hide',
        onLoad: function(st) {
            cargagridnew = st;
        },
        doAction: function() {
            procesarResultados();
        },
        buttons: [{
                handler: function() {
                    vCasoUso.hide();
                },
                text: 'Cancelar', //perfil.etiquetas.lbBtnCancelarTrab ,
                tooltip: 'Cerrar ventana sin guardar los datos',
//            icon: perfil.dirImg + 'cancelar.png'
                iconCls: 'cancelar'
            }, {
                handler: function() {
                    procesarResultados();
                },
                text: 'Aceptar', //perfil.etiquetas.lbBtnAceptarTrab,
                tooltip: 'Guardar datos y cerrar ventana',
//            icon: perfil.dirImg + 'aceptar.png'
                iconCls: 'aceptar'

            }]
    });
    //paneldatosactuales.getForm().load({url:'mostracargo'});
    vCasoUso.doLayout();
    vCasoUso.show();
} // Del buscar trabajador

//funcion para procesar los resultados obtenidos en la ventana de buscar trabajador (instrumento)
function procesarResultados() {
    // lo que tu quieras accedes a los campos de la fila selecionada utilizando:
    vCasoUso.hide();
    if (!cbrecibidopor.disabled) {
        iddepositado = vCasoUso.dataIframe[0].data.id;
        cbrecibidopor.setValue(vCasoUso.dataIframe[0].data.nombre + " " + vCasoUso.dataIframe[0].data.papel + " " + vCasoUso.dataIframe[0].data.sapel);
    }
}

// funcion para limpiar los datos del formulario de instrumento
function limpiardatos(parcial, accAplicar) {
    stgridanticipo.removeAll();
    stgridoperaciones.removeAll();
    operaciondeliq = '';
    if (Ext.isEmpty(cbmovimientoliq)) {
        cbmovimientoliq.clearValue();
    }
    if (!accAplicar || accAplicar == 1) { //caso en que se presiona el btn aceptar
        cbEspecialidad2.reset();
        cbcuentabanc.reset();
        cbxbeneficiario.reset();
        cbxtipobeneficiario.reset();
        cbrecibidopor.reset();
        cbxtiporecibidopor.reset();
//        cbtipodoc.reset();
        tfimporte.reset();
        tacomentario.reset();
        tfnumerodoc.reset();
        tfvalidarnodocumento.reset();
        tfpagado.reset();
        tfresto.reset();
        dfemision.reset();
        dfvencimiento.reset();
        dfaceptacion.reset();

        tfimporteletras.reset();
        //fpliquidacion.getForm().reset();
        fppagoanticipado.getForm().reset();
        fpreembolso.getForm().reset();
        fpoperaciones.getForm().reset();
        stliquidar.removeAll();
        //deshabilito los campos
        deshabilitarCampos(parcial);
        soloLectura = false;
        abrioperacion = false;
        abrirventanaope = 0;
        idoperacionliq = 0;
        idoperacionremb = 0;
        valoresEnVentRe = 0, valoresEnVentLiq = 0, valoresEnVentPa = 0, valoresEnVentOp = 0;
    }
    else {//caso en que se presiona el btn aplicar
        //cbcuentabanc.reset();
        //cbxbeneficiario.reset();
        tfimporte.reset();
        //tacomentario.reset();
        tfnumerodoc.reset();
        tfvalidarnodocumento.reset();
        tfpagado.reset();
        tfresto.reset();
        //dfemision.reset();
        //dfvencimiento.reset();
        dfaceptacion.reset();
        //cbrecibidopor.reset();
        tfimporteletras.reset();
        //fpliquidacion.getForm().reset();
        fppagoanticipado.getForm().reset();
        fpreembolso.getForm().reset();
        fpoperaciones.getForm().reset();
        stliquidar.removeAll();

        //deshabilito los campos
        deshabilitarCampos(parcial, 1);

        //Verficar los elementos del tipo de documento en el aplicar
        selectcasetipodoc(0, 0);

        soloLectura = false;
        abrioperacion = false;
        abrirventanaope = 0;
        idoperacionliq = 0;
        idoperacionremb = 0;
        valoresEnVentRe = valoresEnVentLiq = valoresEnVentPa = valoresEnVentOp = 0;
        buscarnumerotalonario();//permite volver a cargar el combo de cuenta bancaria
    }
}

function deshabilitarCampos(parcial, acAplicar) {
    if (!parcial)
        cbtipodoc.setDisabled(true);

    if (!acAplicar) {
        cbcuentabanc.setDisabled(true);
        cbxbeneficiario.setDisabled(true);
        btnbeneficiario.setDisabled(true);
        tfimporte.setDisabled(true);
        //tfimporteletras.setDisabled(true);
        // tacomentario.setDisabled(true);
        tfresto.setDisabled(true);
        btnventana.setDisabled(true);
        Ext.getCmp('taboper1').setDisabled(true);
        Ext.getCmp('taboper2').setDisabled(true);
        Ext.getCmp('taboper3').setDisabled(true);
        tfpagado.setDisabled(true);
        rckbtnavalada.setDisabled(true);
        tfnumerodoc.setDisabled(true);
        dfemision.setDisabled(true);
        dfvencimiento.setDisabled(true);
        dfaceptacion.setDisabled(true);
        btnrecibidopor.setDisabled(true);
        //cbrecibidopor.setDisabled(true);

        //Desactivar los botones de aumentar o disminuir No. Talonario
        Ext.getCmp('btnchequeanterior').disable();
        Ext.getCmp('btncancelarcheque').disable();
        Ext.getCmp('btnchequesiguiente').disable();
    }
    else {
        //cbcuentabanc.setDisabled(true);
        //cbxbeneficiario.setDisabled(true);
        btnbeneficiario.setDisabled(true);
        //tfimporte.setDisabled(true);
        //tfimporteletras.setDisabled(true);
        // tacomentario.setDisabled(true);
        tfresto.setDisabled(true);

        //btnventana.setDisabled(true);

        tfpagado.setDisabled(true);
        rckbtnavalada.setDisabled(true);
        tfnumerodoc.setDisabled(true);
        //dfemision.setDisabled(true);
        dfvencimiento.setDisabled(true);
        dfaceptacion.setDisabled(true);
        //btnrecibidopor.setDisabled(true);
        //cbrecibidopor.setDisabled(true);

        //Desactivar los botones de aumentar o disminuir No. Talonario
        Ext.getCmp('btnchequeanterior').disable();
        Ext.getCmp('btncancelarcheque').disable();
        Ext.getCmp('btnchequesiguiente').disable();

    }
}

//verificar si las ventanas de operaciones tienen valores
function verificarVentana() {
    if (valoresEnVentLiq)
        return true;
    if (valoresEnVentPa)
        return true;
    if (valoresEnVentRe)
        return true;
    if (valoresEnVentOp)
        return true;
    return false;
}

//funcion para verificar lo que ha pagado
function pagado() {
    var suma = 0;
    if (arroperliquidacion.length > 0) {
        for (var i = 0, longi = arroperliquidacion.length; i < longi; i++) {
            suma += parseFloat(arroperliquidacion[i][2]);
        }

//        if ((tempRL != tfimportetotalliq.getValue()) && valoresEnVentLiq) {//si se realizaron liquidaciones se obtiene el saldo afectado
//            tempRL = parseFloat(tfimportetotalliq.getValue());
//            suma += parseFloat(tfimportetotalliq.getValue());
//        }
    }
    if (arroanticipoinst.length > 0) {
        for (var i in arroanticipoinst) {
            if (i < arroanticipoinst.length)
                suma += parseFloat(arroanticipoinst[i][4]);
        }
    }
    if (arroperacioninst.length > 0) {
        for (var i in arroperacioninst) {
            if (i < arroperacioninst.length) {
                suma += parseFloat(arroperacioninst[i][6]);
            }
        }

    }

    tfresto.setRawValue(saldoformateado(parseFloat(tfimporte.getValue()) - suma));

    //Poner la suma total de las operaciones
    lfImporteTotalAllOperaciones.setText(saldoformateado(parseFloat(suma)));
}


/*para calcular el resto de las operaciones*/
function pagadoOper(est) {
    // if(acc == 'ins'){
    var suma = 0.00;
    if (arroperliquidacion.length > 0) {//si se realizaron liquidaciones se obtiene el saldo afectado
        for (var i = 0, longi = arroperliquidacion.length; i < longi; i++) {
            suma += parseFloat(arroperliquidacion[i][2]);
        }
    }

    //si se realizaron operaciones se obtiene el saldo afectado
    if (stgridoperaciones.getCount() > 0/* && est === 'op'*/) {
        for (var i in stgridoperaciones.data.items) {
            if (i < stgridoperaciones.getCount()) {
                suma += parseFloat(stgridoperaciones.getAt(i).data.importe);
            }
        }
    }
    else if(stgridoperaciones.getCount() == 0 && arroperacioninst.length == 1) {
        suma += 0.00;
    }
    else if (arroperacioninst.length > 0) {
        for (var i in arroperacioninst) {
            if (i < arroperacioninst.length) {
                suma += parseFloat(arroperacioninst[i][6]);
            }
        }
    }

    //si se realizaron pagos anticipados se obtiene el saldo afectado
    if (stgridanticipo.getCount() > 0/* && est === 'pa'*/) {
        for (var i in stgridanticipo.data.items) {
            if (i < stgridanticipo.getCount()) {
                suma += parseFloat(stgridanticipo.getAt(i).data.importe);
            }
        }
    }
    else if(stgridanticipo.getCount() == 0 && arroanticipoinst.length == 1) {
        suma += 0.00;
    }
    else if (arroanticipoinst.length > 0) {
        for (var i in arroanticipoinst) {
            if (i < arroanticipoinst.length) {
                suma += parseFloat(arroanticipoinst[i][4]);
            }
        }
    }
    //if (valoresEnVentRe)//si se realizaron reembolsos se obtiene el saldo afectado
    tfrestoliq.setValue(saldoformateado(parseFloat(tfimporte.getValue()) - suma));//para q tome el  valor del  resto  en la ventana de liquidacion
    tfrestooper.setValue(saldoformateado(parseFloat(tfimporte.getValue()) - suma));//para q tome el  valor del  resto  en la ventana de operaciones
    tfrestopaa.setValue(saldoformateado(parseFloat(tfimporte.getValue()) - suma));//para q tome el  valor del  resto  en la ventana de anticipos
//tfrestorev(saldoformateado(parseFloat(tfimporte.getValue()) - suma));  FALTA DECLARAR EN CREAR INSTRUMENTO//para q tome el  valor del  resto  en la ventana de liquidacion
}

//funcion para buscar y habilitar o no el numero de talonario
function buscarnumerotalonario() {
    if (cbtipodoc.getValue() && cbcuentabanc.getValue() /*&& !soloLectura*/) {
        MostrarEtiquetas(Ext.getBody(), 'Buscando n&uacute;mero de documento...');
        var index = sttipodoc.find('iddoc', cbtipodoc.getValue());//Busco y encuentro el iddoc segun el tipodoc seleccionado
        tfvalidarnodocumento.setDisabled(false);
        if (index > -1) {  //Si lo encuentro
            nomtipodoc = sttipodoc.getAt(index).data;		 //Nomenclador del tipo de documento
//            if (nomtipodoc.tienetalonario == 0 || (cbtipoOpInstr.getValue() == 1 && (nomtipodoc.tienetalonario == 0 || nomtipodoc.tienetalonario == 2)) || (cbtipoOpInstr.getValue() == 2 && (nomtipodoc.tienetalonario == 2 || nomtipodoc.tienetalonario == 1))) { //no tiene talonario
            if (nomtipodoc.tienetalonario === 0 || (cbtipoOpInstr.getValue() === 1 && nomtipodoc.tienetalonario === 2) || (cbtipoOpInstr.getValue() === 2 && nomtipodoc.tienetalonario === 1)) { //no tiene talonario
                tfnumerodoc.enable();
                tfnumerodoc.focus();//si no tiene talonario se le da el foco a no documento
                //Activar el boton cancelar cheque y desabilitar los demas
                Ext.getCmp('btncancelarcheque').enable();
                Ext.getCmp('btnchequeanterior').disable();
                Ext.getCmp('btnchequesiguiente').disable();
                lMasktemp.hide();
            }
            else { //Cobro y Pago con talonario   (tiene talonario)
                Ext.Ajax.request({
                    url: 'buscarNoDocumento',
                    method: 'POST',
                    params: {
                        iddoc: cbtipodoc.getValue(),
                        idcuenta: cbcuentabanc.getValue()
                    },
                    callback: function(options, success, response) {
                        var response = Ext.decode(response.responseText);
                        responseData = response.generado;

                        //En esta variable se almacenan los números de documentos que se han usado
                        //por la cuenta bancaria y el documentos especificado
                        noDocUsados = response.usados;
                        generado = response.generado;
                        if (noDocUsados.length == 0) {
                            Ext.getCmp('btnchequeanterior').disable();
                            Ext.getCmp('btnchequesiguiente').disable();
                        }
                        else {
                            Ext.getCmp('btnchequeanterior').enable();
                            Ext.getCmp('btnchequesiguiente').enable();
                        }

                        if (responseData[1]) {
                            tfnumerodoc.setValue(responseData[1]);
                            tfnumerodoc.disable();
                            tfvalidarnodocumento.validate();
                            idTalonario = responseData[0];
                            dfemision.focus();//si tiene talonario le da el foco a fecha emision
                            //Activar los botones de aumentar o disminuir No. Talonario
                            // Ext.getCmp('btnchequeanterior').enable();
                            Ext.getCmp('btncancelarcheque').enable();
                            tfnumerodoc.maxLength = responseData[3];//se le setea el tamanno maximo
                            // Ext.getCmp('btnchequesiguiente').enable();
                        }
                        else {
                            mostrarMensaje(1, 'No se pudo generar un n&uacute;mero de documento para el tipo de documento y cuenta seleccionados. No tiene talonario asociado o el mismo se ha agotado.');
                            if (!tfnumerodoc.disabled)
                                tfnumerodoc.markInvalid('Este campo es obligatorio.');
                            else {
                                cbcuentabanc.reset();
                                tfnumerodoc.reset(); // Quitado lo del focus por no conformidad de calidad
                                tfvalidarnodocumento.reset();
                            }
                            //Desactivar los botones de aumentar o disminuir No. Talonario
                            Ext.getCmp('btnchequeanterior').disable();
                            Ext.getCmp('btncancelarcheque').disable();
                            Ext.getCmp('btnchequesiguiente').disable();
                        }
                        lMasktemp.hide();
                    }
                });
            }
        }
    }
}
//funcion para buscar el # talonario de la certificacion
//@ind=flujo significa que es dentro del flujo normal
function buscarNotalonarioCertf(tipooperacion, ind) {
    if (cbtipodoccertf.getValue() && cbcuentabanccertf.getValue()) {
        MostrarEtiquetas(Ext.getBody(), 'Buscando n&uacute;mero de documento...');
        var index = sttipodoccertf.find('iddoc', cbtipodoccertf.getValue());//se busca el iddoc segun el tipodoc seleccionado
        if (index > -1) {  //Si lo encuentro
            nomtipodoc = sttipodoccertf.getAt(index).data;//Nomenclador del tipo de documento
            if (nomtipodoc.tienetalonario == 0 || (tipooperacion == 'Entrada' && nomtipodoc.tienetalonario != 1) || (tipooperacion == 'Salida' && nomtipodoc.tienetalonario != 2)) { //no tiene talonario
                tfnumerodoccertf.enable();
                tfnumerodoccertf.focus();//si no tiene talonario se le da el foco a no documento
                //Activar el boton cancelar cheque y desabilitar los demas
                Ext.getCmp('btncancelarchequecertf').enable();
                Ext.getCmp('btnchequeanteriorcertf').disable();
                Ext.getCmp('btnchequesiguientecertf').disable();
                lMasktemp.hide();
            }
            else { //Cobro y Pago con talonario   (tiene talonario)
                Ext.Ajax.request({
                    url: 'buscarNoDocumento',
                    method: 'POST',
                    params: {
                        iddoc: cbtipodoccertf.getValue(),
                        idcuenta: cbcuentabanccertf.getValue()
                    },
                    callback: function(options, success, response) {
                        var response = Ext.decode(response.responseText);
                        responseData = response.generado;

                        //En esta variable se almacenan los números de documentos que se han usado
                        //por la cuenta bancaria y el documentos especificado
                        noDocUsadosCertf = response.usados;
                        generadoCertf = response.generado;
                        if (noDocUsadosCertf.length == 0) {
                            Ext.getCmp('btnchequeanteriorcertf').disable();
                            Ext.getCmp('btnchequesiguientecertf').disable();
                        }
                        else {
                            Ext.getCmp('btnchequeanteriorcertf').enable();
                            Ext.getCmp('btnchequesiguientecertf').enable();
                        }

                        if (responseData[1]) {
                            if (ind) {//caso en que es denro del flujo normal
                                //si es el mismo tipo documento se coge el 2do numero
                                if (cbtipodoc.getValue() == cbtipodoccertf.getValue()) {
                                    tfnumerodoccertf.setValue(responseData[2]);
                                } else {//si el tipo documento es diferente se coge el 1er numero
                                    tfnumerodoccertf.setValue(responseData[1]);
                                }
                            }
                            else {//caso en que es por el btncertificar
                                tfnumerodoccertf.setValue(responseData[1]);
                            }
                            tfnumerodoccertf.disable();
                            tfnumerodoccertf.maxLength = responseData[3];//se le setea el tamanno maximo
                            idTalonariocertf = responseData[0];
                            //dfemision.focus();//si tiene talonario le da el foco a fecha emision
                            //Activar los botones de aumentar o disminuir No. Talonario
                            // Ext.getCmp('btnchequeanteriorcertf').enable();
                            Ext.getCmp('btncancelarchequecertf').enable();
                            // Ext.getCmp('btnchequesiguientecertf').enable();
                        }
                        else {
                            mostrarMensaje(1, 'No se pudo generar un n&uacute;mero de documento para el tipo de documento y cuenta seleccionados. No tiene talonario asociado o el mismo se ha agotado.');
                            if (!tfnumerodoccertf.disabled)
                                tfnumerodoccertf.markInvalid('Este campo es obligatorio.');
                            /* else {
                             cbcuentabanc.reset();
                             tfnumerodoc.reset(); // Quitado lo del focus por no conformidad de calidad
                             }*/
                            //Desactivar los botones de aumentar o disminuir No. Talonario
                            Ext.getCmp('btnchequeanteriorcertf').disable();
                            Ext.getCmp('btncancelarchequecertf').disable();
                            Ext.getCmp('btnchequesiguientecertf').disable();
                        }
                        lMasktemp.hide();
                    }
                });
            }
            ;
        }
    }
}

//funcion para saber que campos debo habilitar segun el tipo de documento
function selectcasetipodoc(resetear, accionApl) {
    if (!soloLectura) {
        var index = sttipodoc.find('iddoc', cbtipodoc.getValue());
        if (index > -1) {
            segunTipoDoc(sttipodoc.getAt(index).data.iddocumentos, resetear, accionApl);
        }
    }
}

//funcion para habilitar y deshabilitar campos del formulario instrumento
//segun el tipo de documento
function segunTipoDoc(tipo, resetear, accionApl) {
    if (acc != 'mod') {
        if (resetear) {
            limpiardatos(1);//limpio los campos
            deshabilitarCampos(1);// deshabilito campos
            cbcuentabanc.setDisabled(false);//habilito los default
            tfimporte.setDisabled(false);
            btnventana.setDisabled(false);
        }
        if (accionApl) {//deshabilitar los tab
            Ext.getCmp('taboper1').setDisabled(true);
            Ext.getCmp('taboper2').setDisabled(true);
            Ext.getCmp('taboper3').setDisabled(true);
            //Ext.getCmp('tpoperInstrumento').setActiveTab(0);
        }
    }
    //segun el tipo de documento (habilito los campos)
    var x = parseInt(tipo);
    switch (x) {
        case 14: //Pagare
            cbxbeneficiario.setDisabled(false);
            btnbeneficiario.setDisabled(false);
            dfemision.setDisabled(false);
            btnrecibidopor.setDisabled(false);
            cbrecibidopor.setDisabled(false);
            Ext.getCmp('taboper1').setDisabled(false);
            Ext.getCmp('taboper2').setDisabled(false);
            Ext.getCmp('taboper3').setDisabled(false);
            break;
        case 18: //Transferencia Bancaria
            cbxbeneficiario.setDisabled(false);
            btnbeneficiario.setDisabled(false);
            dfemision.setDisabled(false);
            Ext.getCmp('taboper1').setDisabled(false);
            Ext.getCmp('taboper2').setDisabled(false);
            Ext.getCmp('taboper3').setDisabled(false);
            break;
        case 34: //Cheque Nominativo
            cbxbeneficiario.setDisabled(false);
            btnbeneficiario.setDisabled(false);
            dfemision.setDisabled(false);
            //btnrecibidopor.setDisabled(false);
            cbrecibidopor.setDisabled(false);
            Ext.getCmp('taboper1').setDisabled(false);
            Ext.getCmp('taboper2').setDisabled(false);
            Ext.getCmp('taboper3').setDisabled(false);
            break;
        case 35: //Cheque Certificado
            cbxbeneficiario.setDisabled(false);
            btnbeneficiario.setDisabled(false);
            dfemision.setDisabled(false);
            btnrecibidopor.setDisabled(false);
            cbrecibidopor.setDisabled(false);
            Ext.getCmp('taboper1').setDisabled(false);
            Ext.getCmp('taboper2').setDisabled(false);
            Ext.getCmp('taboper3').setDisabled(false);
            break;
        case 36: //Cheque Voucher
            cbxbeneficiario.setDisabled(false);
            btnbeneficiario.setDisabled(false);
            dfemision.setDisabled(false);
            btnrecibidopor.setDisabled(false);
            cbrecibidopor.setDisabled(false);
            Ext.getCmp('taboper1').setDisabled(false);
            Ext.getCmp('taboper2').setDisabled(false);
            Ext.getCmp('taboper3').setDisabled(false);
            break;
        case 37: //Cheque Gerencia
            cbxbeneficiario.setDisabled(false);
            btnbeneficiario.setDisabled(false);
            dfemision.setDisabled(false);
            btnrecibidopor.setDisabled(false);
            cbrecibidopor.setDisabled(false);
            Ext.getCmp('taboper1').setDisabled(false);
            Ext.getCmp('taboper2').setDisabled(false);
            Ext.getCmp('taboper3').setDisabled(false);
            break;
        case 40: //Carta de credito local
            cbxbeneficiario.setDisabled(false);
            btnbeneficiario.setDisabled(false);
            dfemision.setDisabled(false);
            cbrecibidopor.setDisabled(false);
            btnrecibidopor.setDisabled(false);
            Ext.getCmp('taboper1').setDisabled(false);
            Ext.getCmp('taboper2').setDisabled(false);
            Ext.getCmp('taboper3').setDisabled(false);
            tfnumerodoc.setDisabled(false);  // Habilitar el numero para mandar insertarlo sin talonario
            break;
        case 41: //Modelo de la ONAT
            btnrecibidopor.setDisabled(false);
            cbrecibidopor.setDisabled(false);
            dfemision.setDisabled(false);
            Ext.getCmp('taboper1').setDisabled(false);
            break;
        case 67: //Orden de Pago
            cbxbeneficiario.setDisabled(false);
            btnbeneficiario.setDisabled(false);
            dfemision.setDisabled(false);
            btnrecibidopor.setDisabled(false);
            cbrecibidopor.setDisabled(false);
            Ext.getCmp('taboper1').setDisabled(false);
            Ext.getCmp('taboper2').setDisabled(false);
            Ext.getCmp('taboper3').setDisabled(false);
            break;
        case 68: //Letra de cambio para pagar o avalada
            cbxbeneficiario.setDisabled(false);
            btnbeneficiario.setDisabled(false);
            tfpagado.setDisabled(false);
            rckbtnavalada.setDisabled(false);
            dfemision.setDisabled(false);
            //dfvencimiento.setDisabled(false);
            dfaceptacion.setDisabled(false);
            btnrecibidopor.setDisabled(false);
            cbrecibidopor.setDisabled(false);
            Ext.getCmp('taboper1').setDisabled(false);
            Ext.getCmp('taboper3').setDisabled(false);
            tfnumerodoc.setDisabled(false);  // Habilitar el numero para mandar insertarlo sin talonario
            break;
        case 69: //Letra de cambio
            cbxbeneficiario.setDisabled(false);
            btnbeneficiario.setDisabled(false);
            tfpagado.setDisabled(false);
            rckbtnavalada.setDisabled(false);
            dfemision.setDisabled(false);
            //dfvencimiento.setDisabled(false);
            dfaceptacion.setDisabled(false);
            btnrecibidopor.setDisabled(false);
            cbrecibidopor.setDisabled(false);
            Ext.getCmp('taboper1').setDisabled(false);
            Ext.getCmp('taboper3').setDisabled(false);
            tfnumerodoc.setDisabled(false);  // Habilitar el numero para mandar insertarlo sin talonario
            break;
        case 74: // Otros Pagos
            cbxbeneficiario.setDisabled(false);
            btnbeneficiario.setDisabled(false);
            dfemision.setDisabled(false);
            Ext.getCmp('taboper1').setDisabled(false);
            Ext.getCmp('taboper2').setDisabled(false);
            Ext.getCmp('taboper3').setDisabled(false);
            break;
        case 120: //Modelo de operaciones con creditos (o debitos revisar)
            dfemision.setDisabled(false);
            Ext.getCmp('taboper1').setDisabled(false);
            Ext.getCmp('taboper3').setDisabled(false);
            break;
        case 123: // Modelo de cobro Automatico
            cbxbeneficiario.setDisabled(false);
            btnbeneficiario.setDisabled(false);
            dfemision.setDisabled(false);
            Ext.getCmp('taboper3').setDisabled(false);
            tfnumerodoc.setDisabled(false);  // Habilitar el numero para mandar insertarlo sin talonario
            break;
        case 125: //Modelo de pago automatico
            cbxbeneficiario.setDisabled(false);
            btnbeneficiario.setDisabled(false);
            dfemision.setDisabled(false);
            Ext.getCmp('taboper3').setDisabled(false);
            break;
        default:  // Falta validar la tarjeta plastica, estos son otros documentos que no estan en la resolucion
            cbxbeneficiario.setDisabled(false);
            btnbeneficiario.setDisabled(false);
            tfpagado.setDisabled(true);
            rckbtnavalada.setDisabled(true);
            dfemision.setDisabled(false);
            btnrecibidopor.setDisabled(false);
            cbrecibidopor.setDisabled(false);
            Ext.getCmp('taboper1').setDisabled(false);
            Ext.getCmp('taboper2').setDisabled(false);
            Ext.getCmp('taboper3').setDisabled(false);
            tfnumerodoc.setDisabled(false);  // Habilitar el numero para mandar insertarlo sin talonario
            break;
    }
}

function verificaSaldo(valor) {
    if (!abrirventanaope) {
//        mostrarMensaje(1, 'No ha seleccionado la operaci&oacute;n que quiere realizar.');
        mostrarMensaje(1, 'No hay operaciones asociadas al instrumento bancario.');
    }
    else {
        muestraWinOperac(valor);
    }
}


function muestraWinOperac(valor) {
    var band = true;
    if (abrirventanaope == 3 && (valoresEnVentLiq || valoresEnVentPa || valoresEnVentOp))
        mostrarMensaje(1, 'No se pueden hacer reembolsos teniendo otras operaciones ya realizadas.');
    else {
        if (acc == 'mod') {
            if (cbxbeneficiario.getValue()) {
                switch (abrirventanaope) {
                    case 1:  // liquidacion
                        /*if (stbeneficiario.getAt(0).get('tipo') != 1 && stbeneficiario.getAt(0).get('tipo') != '2') {
                            mostrarMensaje(1, 'Al beneficiario seleccionado no se deben asociar liquidaciones.<br> Seleccione un cliente o proveedor.</br>');
                            return;
                        }*/
                        break;
                    case 2:  // Pagos anticipados
                        if (stbeneficiario.getAt(0).get('tipo') != 1 && stbeneficiario.getAt(0).get('tipo') != 2 /*&& stbeneficiario.getAt(0).get('tipo') != 4*/) {
                            mostrarMensaje(1, 'Al beneficiario seleccionado no se deben asociar cobros o pagos anticipados.<br> Seleccione un cliente, proveedor.</br>');
                            return;
                        }
                        break;
                    case 4:  // Operaciones
                        break;
                }
            }
        }
        else {   // el recibidior no es un campo obligatorio... alejandro 11/08/11
            /*if (!cbrecibidopor.disabled  && !cbrecibidopor.getValue()){
             cbrecibidopor.markInvalid('Este campo es obligatorio.');
             band = false;
             }*/
            if (!cbxbeneficiario.disabled && !cbxbeneficiario.getValue() && (abrirventanaope == 2 || abrirventanaope == 4)) {  // 2 Pago anticipado y 4 otras operaciones
                cbxbeneficiario.markInvalid('Este campo es obligatorio.'/*perfil.etiquetas.lbtfMarkproveedor*/);
                band = false;
            }
            if (!tfnumerodoc.getValue()) {
                if (!tfnumerodoc.disabled)
                    tfnumerodoc.markInvalid('Este campo es obligatorio.');
                else {
                    cbcuentabanc.reset();
                    tfnumerodoc.reset(); // Quitado lo del focus por no conformidad de calidad
                }
                band = false;
            }
        }
        if (band) {
            if ((soloLectura && importedisponible) || acc == 'mod') {
                seguntipoOperacion(abrirventanaope);
            }
            else {
                if (cbtipoOpInstr.getValue() == 2) { // Se verifica solo si es de salida de efectivo
                    var value = parseFloat(valor);
                    MostrarEtiquetas(Ext.getBody(), 'Verificando saldo disponible de cuenta seleccionada...' /*perfil.etiquetas.lbMsgmaskTemp*/);
                    Ext.Ajax.request({
                        url: 'verificasaldo',
                        method: 'POST',
                        params: {
                            idcta: cbcuentabanc.getValue()
                        },
                        callback: function(options, success, response) {
                            if (success) {
                                importedisponible = true;
                                var result = Ext.decode(response.responseText);
                                if (value > parseFloat(result)) {
                                    var msg = 'El importe introducido es mayor que el efectivo disponible en la cuenta bancaria seleccionada. Seleccione otra cuenta o introduzca otro importe.<br><br>Disponibilidad de efectivo es de: ' + '<b>' + formatoMoneda(result) + '</b>.';
                                    mostrarMensaje(1, msg);
                                    tfimporte.markInvalid('El importe supera al efectivo disponible de la cuenta bancaria seleccionada.');
                                    cbcuentabanc.focus(true, true);
                                    lMasktemp.hide();
                                }
                                else {
                                    seguntipoOperacion(abrirventanaope);
                                }
                            }
                            else
                                lMasktemp.hide();
                        }
                    });
                } else
                    seguntipoOperacion(abrirventanaope);
            }
        }
        else {
            if (acc != 'mod')
//                mostrarMensaje(1, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                mostrarMensaje(1, 'Por favor verifique nuevamente que hay campos con valores incorrectos.');
        }
    }
}

function RangoImporte(Valor) {

    importemax = sttipodoc.getAt(sttipodoc.find('iddoc', cbtipodoc.getValue())).data.importemax;
    importemin = sttipodoc.getAt(sttipodoc.find('iddoc', cbtipodoc.getValue())).data.importemin;
    var value = parseFloat(Valor);
    if (value == 0) {
        tfimporte.focus();
        tfimporte.markInvalid('El importe no puede ser 0.00.');
        mostrarMensaje(1, 'El importe no puede ser 0.00.');
        return false;
    } else if (value > importemax) {
        tfimporte.focus();
        mostrarMensaje(1, 'El importe introducido es mayor que $' + importemax + '.<br>El importe debe ser un valor entre $' + importemin + ' y $' + importemax + '.</br>');
        if (acc == 'mod')
            devolverValorImpResto();
        else {
            tfimporte.reset();
            tfimporte.markInvalid();
        }

        return false;
    } else if (value < importemin) {
        tfimporte.focus();
        mostrarMensaje(1, 'El importe introducido es menor que $' + importemin + '.<br>El importe debe ser un valor entre $' + importemin + ' y $' + importemax + '.</br>');
        if (acc == 'mod')
            devolverValorImpResto();
        else {
            tfimporte.reset();
            tfimporte.markInvalid();
        }
        return false;
    }
    return true;
}

function devolverValorImpResto() {

    var num = stinstrumentobanc.data.items[idgridI].get('importemo');
    tfimporte.setValue(parseFloat(num));
    tfresto.setRawValue('0.00');
    if (tfimporte.isValid())
        tfimporteletras.setValue(convertir_a_letras(num));
}

//esta funcion es para saber cual fue el radio button de operaciones seleccionado
function tipoventana() {
    /* if (!cbrecibidopor.getValue()){ 24/02/2014 actualmente no es obligatorio Adolfo
     cbrecibidopor.markInvalid('Este campo es obligatorio.');
     cbrecibidopor.clearInvalid();
     }*/

    //liquidaciones
    if (Ext.getCmp('tpoperInstrumento').getActiveTab().id == 'taboper1' && !Ext.getCmp('taboper1').disabled) {
        if (cbxbeneficiario.getValue()) {
            if (stbeneficiario.getAt(0).get('tipo') == 1 || stbeneficiario.getAt(0).get('tipo') == 2 || stbeneficiario.getAt(0).get('tipo') == 5 || stbeneficiario.getAt(0).get('tipo') == 4 || stbeneficiario.getAt(0).get('tipo') == 6) {
                abrirventanaope = 1;
                //return;
            }
            else {
                mostrarMensaje(1, 'Al beneficiario seleccionado no se deben asociar liquidaciones.<br> Seleccione un cliente, proveedor o trabajador.</br>');
                Ext.getCmp('taboper1').setDisabled(true);
                Ext.getCmp('tpoperInstrumento').activate('taboper2');
                //return;
            }
        }
        else {
            cbxbeneficiario.clearInvalid();
            abrirventanaope = 1;
            //return;
        }
    }
    //anticipos
    else if (Ext.getCmp('tpoperInstrumento').getActiveTab().id == 'taboper2' && !Ext.getCmp('taboper2').disabled) {
        if (acc == 'mod') {
            if (cbxbeneficiario.getValue()) {
                if (stbeneficiario.getAt(0).get('tipo') == 1 || stbeneficiario.getAt(0).get('tipo') == 2/* || stbeneficiario.getAt(0).get('tipo') == 4*/) {
                    abrirventanaope = 2;
                    //return;
                }
                else {
                    mostrarMensaje(1, 'Al beneficiario seleccionado no se deben asociar cobros o pagos anticipados.<br> Seleccione un cliente o proveedor.</br>');
                    Ext.getCmp('taboper2').setDisabled(true);
                    Ext.getCmp('tpoperInstrumento').activate('taboper4');
                }
            }
            else if (cbxbeneficiario.disabled && cbxbeneficiario.getRawValue()) {
                cbxbeneficiario.clearInvalid();
                abrirventanaope = 2;
                //return;
            }
        }
        else {
            if (!cbxbeneficiario.getValue()) {
                cbxbeneficiario.markInvalid('Este campo es obligatorio.');
                abrirventanaope = 2;
                return;
            }
            else if (stbeneficiario.getAt(0).get('tipo') == 1 || stbeneficiario.getAt(0).get('tipo') == 2/* || stbeneficiario.getAt(0).get('tipo') == 4*/) {
                cbxbeneficiario.clearInvalid();
                abrirventanaope = 2;
                //return;
            }
            else {
                mostrarMensaje(1, 'Al beneficiario seleccionado no se deben asociar cobros o pagos anticipados.<br> Seleccione un cliente o proveedor.</br>');
                Ext.getCmp('taboper2').setDisabled(true);
                Ext.getCmp('tpoperInstrumento').activate('taboper4');
                //return;
            }
        }
    }
    //Radio button Reembolso
    else if (Ext.getCmp('tpoperInstrumento').getActiveTab().id == 'taboper4' /*&& Ext.getCmp('taboper2').enable*/) { // Ya esta inabilitado el combo del Beneficiario
        abrirventanaope = 3;
        //return;
    }
    else {//operaciones
        if (Ext.getCmp('tpoperInstrumento').getActiveTab().id == 'taboper3' && !Ext.getCmp('taboper3').disabled) {
            if (!cbxbeneficiario.getValue()) {
                cbxbeneficiario.markInvalid('Este campo es obligatorio.');
                abrirventanaope = 4;
                //return;
            }
            else
                abrirventanaope = 4;
        }
    }

    var tabPanel = Ext.getCmp('tpoperInstrumento');
    if(stbeneficiario.getAt(0)) {
        if(stbeneficiario.getAt(0).get('tipo') > 2 && tabPanel.getActiveTab().id == 'taboper2') {
            //Se activa el primer tab pues siempre va a estar activo.
            tabPanel.activate('taboper1');
        }
    }
}

//funcion para abrir las ventanas pertinentes segun el tipo de operacion
//o movimiento seleccionando
function seguntipoOperacion(tipo) {
    x = parseInt(tipo);
    textEspecialidad = (cbEspecialidad2.getRawValue()) ? '<br> Especialidad: ' + cbEspecialidad2.getRawValue() : '';
    switch (x) {
        case 1:	//liquidacion
            if (acc === 'ins') {
                tfnumero.reset();
                cbfiltrotipodoc.reset();
                tffechaInicio.reset();
                tffechaFin.reset();
                stliquidar.baseParams.numero = '';
                stliquidar.baseParams.tipodoc = '';
                stliquidar.baseParams.testado = '';
                stliquidar.baseParams.fecha = '';
                stliquidar.baseParams.fechainicio = '';
                stliquidar.baseParams.fechafin = '';

                if (cbtipoOpInstr.getRawValue() === 'Entrada')//cobro
                    abrirVentana('Adicionar liquidaciones de cobro' + ' | Beneficiario: ' + cbxbeneficiario.getRawValue() + '<br> Especialidad: ' + cbEspecialidad2.getRawValue()/*perfil.etiquetas.lbWinliquidacionIns*/, 'liq');
                else
                    abrirVentana('Adicionar liquidaciones de pago' + ' | Beneficiario: ' + cbxbeneficiario.getRawValue() + '<br> Especialidad: ' + cbEspecialidad2.getRawValue()/*perfil.etiquetas.lbWinliquidacionIns*/, 'liq');
                stfiltrotipodoc.load({
                    params: {
                        entrada: cbtipoOpInstr.getValue()
                    }
                });
            } else {
                if (cbtipoOpInstr.getRawValue() === 'Entrada')//cobro
                    abrirVentana('Modificar liquidaciones de cobro' + ' | Beneficiario: ' + cbxbeneficiario.getRawValue() + '<br> Especialidad: ' + cbEspecialidad2.getRawValue()/*perfil.etiquetas.lbWinliquidacionMod*/, 'liq');
                else
                    abrirVentana('Modificar liquidaciones de pago' + ' | Beneficiario: ' + cbxbeneficiario.getRawValue() + '<br> Especialidad: ' + cbEspecialidad2.getRawValue()/*perfil.etiquetas.lbWinliquidacionMod*/, 'liq');
            }
            break;
        case 2: //pago anticipado
            if (acc === 'ins') {
                if (cbtipoOpInstr.getRawValue() === 'Entrada')//cobro
                    abrirVentana('Adicionar cobro anticipado' + ' | Beneficiario: ' + cbxbeneficiario.getRawValue() + textEspecialidad/*perfil.etiquetas.lbWinpagoanticipadoIns*/, 'pa');
                else
                    abrirVentana('Adicionar pago anticipado' + ' | Beneficiario: ' + cbxbeneficiario.getRawValue() + textEspecialidad/*perfil.etiquetas.lbWinpagoanticipadoIns*/, 'pa');
            } else {
                if (cbtipoOpInstr.getRawValue() === 'Entrada')//cobro
                    abrirVentana('Modificar cobro anticipado' + ' | Beneficiario: ' + cbxbeneficiario.getRawValue() + textEspecialidad/*perfil.etiquetas.lbWinpagoanticipadoMod*/, 'pa');
                else
                    abrirVentana('Modificar pago anticipado' + ' | Beneficiario: ' + cbxbeneficiario.getRawValue() + textEspecialidad/*perfil.etiquetas.lbWinpagoanticipadoMod*/, 'pa');
            }
            break;
        case 3: //Reembolso
            if (acc == 'ins')
                abrirVentana('Adicionar reembolsos' + ' | Beneficiario: ' + cbxbeneficiario.getRawValue() + textEspecialidad/*perfil.etiquetas.lbWinreembolsoIns*/, 're');
            else
                abrirVentana('Modificar reembolsos' + ' | Beneficiario: ' + cbxbeneficiario.getRawValue() + textEspecialidad/*perfil.etiquetas.lbWinreembolsoMod*/, 're');
            break;
        case 4: //Operaciones
            if (acc === 'ins') {
                if (cbtipoOpInstr.getRawValue() === 'Entrada')//cobro
                    abrirVentana('Adicionar operaciones de cobro' + ' | Beneficiario: ' + cbxbeneficiario.getRawValue() + textEspecialidad/*perfil.etiquetas.lbWinoperacionesIns*/, 'op');
                else
                    abrirVentana('Adicionar operaciones de pago' + ' | Beneficiario: ' + cbxbeneficiario.getRawValue() + textEspecialidad/*perfil.etiquetas.lbWinoperacionesIns*/, 'op');
            } else {
                if (cbtipoOpInstr.getRawValue() === 'Entrada')//cobro
                    abrirVentana('Modificar operaciones de cobro' + ' | Beneficiario: ' + cbxbeneficiario.getRawValue() + textEspecialidad/*perfil.etiquetas.lbWinoperacionesMod*/, 'op');
                else
                    abrirVentana('Modificar operaciones de pago' + ' | Beneficiario: ' + cbxbeneficiario.getRawValue() + textEspecialidad/*perfil.etiquetas.lbWinoperacionesMod*/, 'op');
            }
            break;
    }
}

//funcion para agregar un nuevo instrumento
//@accaplicar indica si se presiono el bt aplicar
//@indcertf indica si se esta certificando durante el flujo normal (trae los datos)
function adicionarinstbanc(accaplicar, indcertf) {
    loadMessageBox('Guardando datos del instrumento bancario');
    // Para buscar el tipo d documento segun el nomenclador
    var dat = sttipodoc.getAt(sttipodoc.find('iddoc', cbtipodoc.getValue())).data;

    // Beneficiarios
    var a = new Array();
    var b = new Array();
    var aux = new Array();
    if (cbxbeneficiario.getValue()) {
        //Esto no funcionaba by furet
        //a[0] = stbeneficiario.getAt(0).get('id'); //328; //cbxbeneficiario.getValue();
        //a[1] = stbeneficiario.getAt(0).get('tipo'); // 1
        //a[2] = 1; // 1-idcliente, 2-idrecibe, 3-identrega
        //Esta es la nueva solucion furet
        a[0] = cbxbeneficiario.getValue();
        a[1] = cbxtipobeneficiario.getValue();
        a[2] = 1; // 1-idcliente, 2-idrecibe, 3-identrega
        aux.push(a);   // El beneficiario: antiguamente proveedor
    }
    if (cbrecibidopor.getValue()) {
        //Esto no funcionaba by furet
        //b[0] = strecibidopor.getAt(0).get('id'); //cbrecibidopor.getValue(),   // 1
        //b[1] = strecibidopor.getAt(0).get('tipo'); //cbrecibidopor.getValue(),   // 4
        //b[2] = 2; // 1-idcliente, 2-idrecibe, 3-identrega
        //Esta es la nueva solucion furet
        b[0] = cbrecibidopor.getValue();
        b[1] = cbxtiporecibidopor.getValue();
        b[2] = 2; // 1-idcliente, 2-idrecibe, 3-identrega
        aux.push(b);   // El recibidopor
    }

    //caso en que no se esta certificando durante el flujo normal
    if (!indcertf) {
        Ext.Ajax.request({
            url: 'adicionarinstbancario',
            method: 'POST',
            params: {
                idcuentabancaria: cbcuentabanc.getValue(),
                tipobeneficiario: cbxtipobeneficiario.getValue(),
                iddoc: cbtipodoc.getValue(),
                nomtipodoc: parseInt(dat.iddocumentos),
                idbeneficiario: cbxbeneficiario.getValue(), // Cliente o proveedor casi siempre
                tfpagado: tfpagado.getValue(),
                tfnumerodoc: tfnumerodoc.getValue(),
                tfimporte: tfimporte.getValue(),
                dfemision: dfemision.getRawValue(),
                dfaceptacion: dfaceptacion.getRawValue(),
                dfvencimiento: dfvencimiento.getRawValue(),
                //idsolicitud     : tfnumsolicitud.getValue(),
                idrecibidopor: cbrecibidopor.getValue(),
                tiporecibidopor: cbxtiporecibidopor.getValue(),
                tacomentario: tacomentario.getValue(),
                idtalonario: idTalonario,
                entradasalida: cbtipoOpInstr.getValue(),
                idespecialidad: cbEspecialidad2.getValue(),
//                idespecialidad: comboIframe1.fSelect.values[0],
                descripcionespecialidad: cbEspecialidad2.getRawValue(),
                idmoneda: stmonedatasa.getAt(0).get('idmoneda'), //idmonedaV,
                tipo: verLetra(), // Devuelve 1 si es leetra y 0 sino es
                movimiento: Ext.encode(getDatosOperacion()), // Busca los datos asociados a los movimeintos asociados (liquid, reembolso, pagos antic)
                beneficiario: Ext.encode(aux),
                operaciondeliq: (Ext.isEmpty(operaciondeliq)) ? '' : operaciondeliq
            },
            callback: function(options, success, response) {
                Ext.MessageBox.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData == undefined)
                    mostrarMensaje(1, 'El instrumento bancirio no se pudo adicionar porque ocurrieron errores durante la operaci&oacute;n solicitada.');
                else {
                    if (responseData.codMsg != undefined)
                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                    else {
                        var result = eval(Ext.decode(response.responseText));
                        switch (responseData.success) {
                            case -1:

                                limpiardatos(1, accaplicar);
                                //borrar valores del radio button
                                /*rbtnliquidar.setValue(false);
                                 rbtnpagoant.setValue(false);
                                 rbtnreembolso.setValue(false);
                                 rbtnoperacion.setValue(false);*/
                                Ext.getCmp('taboper1').setDisabled(true);
                                Ext.getCmp('taboper2').setDisabled(true);
                                Ext.getCmp('taboper3').setDisabled(true);
//                                if (!accaplicar) {
//                                    wininstbanc.hide();
//                                    stinstrumentobanc.reload({
//                                        callback: function (options, success, response) {
//                                            mostrarMensaje(1, 'El instrumento bancario ha sido adicionado satisfactoriamente.');
//                                        }
//                                    });
//                                } else {
//                                    stinstrumentobanc.reload({
//                                        callback: function(options, success, response) {
//                                            mostrarMensaje(1, 'El instrumento bancario ha sido adicionado satisfactoriamente.');
//                                        }
//                                    });
//                                }
                                if (presionandobtnaplicar == true) {
                                    //Aquí se presiona el botón Aplicar
                                    despuesdeAplicar();
                                }
                                else {
                                    //Aquí se presiona el botón Aceptar
                                    wininstbanc.hide();
                                }

                                stinstrumentobanc.reload({
                                    callback: function(options, success, response) {
                                        mostrarMensaje(1, 'El instrumento bancario ha sido adicionado satisfactoriamente.');
                                    }
                                });

                                cbtipodoc.reset();

                                arroperliquidacion = new Array();//se limpia el array de operaciones de la liquidacion
                                arroperacioninst = new Array();//se limpia el array para las operaciones del instrumento
                                arroanticipoinst = new Array();//se limpia el array para los anticipos del instrumento

                                sttaboperaciones.removeAll(); // se limpia el grid info de las operaciones realizadas
                                sttabanticipo.removeAll(); // se limpia el grid info de los anticipos realizadas
                                sttabliquidar.removeAll(); // se limpia el grid info de las liquidaciones realizadas
                                arrtabliquidacion = new Array(); //se limpia el arreglo del tab de las liquidaciones
                                break;
                            case -2 :
                                mostrarMensaje(1, 'No se puede insertar con este n&uacute;mero de talonario.');
                                break;
                            case -3 :
                                mostrarMensaje(1, 'No se pudo guardar el instrumento bancario debido a la ocurrencia de errores cuando se gener&oacute; el n&uacute;mero de talonario.');
                                break;
                            case -4 :
                                mostrarMensaje(1, 'No se encontrad&oacute; moneda para cuenta seleccionada.');
                                break;
                            case -5 :
                                mostrarMensaje(1, 'Ocurrieron errores en el env&iacute;o de datos de las liquidaciones del instrumento.');
                                break;
                            case -6 :
                                mostrarMensaje(1, 'No se puede guardar el instrumento bancario. El n&uacute;mero de documento est&aacute; actualmente en uso <br>por otro instrumento para el tipo de documento y cuenta seleccionados.</br>');
                                tfnumerodoc.setDisabled(false);
                                soloLectura = false;
                                tfnumerodoc.focus();
                                break;
                            case -7 :
                                mostrarMensaje(1, 'No se puede guardar el instrumento bancario. No se encontr&oacute; la operaci&oacute;n contable de lo que se quiere liquidar.');
                                break;
                            case -8 :
                                mostrarMensaje(1, 'No se puede guardar el instrumento bancario. No se encontr&oacute; la operaci&oacute;n asociada a la cuenta de ingreso.');
                                break;
                            case -9 :
                                mostrarMensaje(1, 'No se puede guardar el instrumento bancario. No se encontr&oacute; la operaci&oacute;n asociada a la cuenta de gasto.');
                                break;
                            default :
//                                mostrarMensaje(1, 'El instrumento bancario ha sido guardado satisfactoriamente con el n&uacute;mero: ' + tfnumerodoc.getValue() + '.');
                                mostrarMensaje(1, 'El instrumento bancario ha sido adicionado satisfactoriamente.');

                                if (presionandobtnaplicar == true) {
                                    //Aquí se presiona el botón Aplicar
                                    despuesdeAplicar();
                                }
                                else {
                                    //Aquí se presiona el botón Aceptar
                                    wininstbanc.hide();
                                }

                                limpiardatos(1, accaplicar);
                                //borrar valores del radio button
                                Ext.getCmp('taboper1').setDisabled(true);
                                Ext.getCmp('taboper2').setDisabled(true);
                                Ext.getCmp('taboper3').setDisabled(true);
                                //cbtipodoc.reset();
                                stinstrumentobanc.reload();
                                break;
                        }
                    }
                }
            }
        });
    }
    //caso en que se esta certificando durante el flujo normal
    else {
        Ext.Ajax.request({
            url: 'adicionarinstbancariocertif',
            method: 'POST',
            params: {
                idcuentabancaria: cbcuentabanc.getValue(),
                tipobeneficiario: cbxtipobeneficiario.getValue(),
                //tipobeneficiario: cbxbeneficiario.getValue() ? stbeneficiario.getAt(0).get('tipo') : 0,
                iddoc: cbtipodoc.getValue(),
                nomtipodoc: parseInt(dat.iddocumentos),
                idbeneficiario: cbxbeneficiario.getValue(), // Cliente o proveedor casi siempre
                tfpagado: tfpagado.getValue(),
                tfnumerodoc: tfnumerodoc.getValue(),
                tfimporte: tfimporte.getValue(),
                dfemision: dfemision.getRawValue(),
                dfaceptacion: dfaceptacion.getRawValue(),
                dfvencimiento: dfvencimiento.getRawValue(),
                //idsolicitud     : tfnumsolicitud.getValue(),
                idrecibidopor: cbrecibidopor.getValue(),
                tiporecibidopor: cbxtiporecibidopor.getValue(),
                tacomentario: tacomentario.getValue(),
                idtalonario: idTalonario,
                entradasalida: cbtipoOpInstr.getValue(),
                idespecialidad: cbEspecialidad2.getValue(),
//                idespecialidad: comboIframe1.fSelect.values[0],
                descripcionespecialidad: cbEspecialidad2.getRawValue(),
                idmoneda: stmonedatasa.getAt(0).get('idmoneda'),
                tipo: verLetra(), // Devuelve 0 si es leetra y 1 sino es
                movimiento: Ext.encode(getDatosOperacion()), // Busca los datos asociados a los movimeintos asociados (liquid, reembolso, pagos antic)
                beneficiario: Ext.encode(aux),
                datacertf: Ext.encode(indcertf), //contiene los datos para certificar flujo normal
                operaciondeliq: (Ext.isEmpty(operaciondeliq)) ? '' : operaciondeliq
            },
            callback: function(options, success, response) {
                Ext.MessageBox.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData == undefined)
                    mostrarMensaje(1, 'El instrumento bancario no se pudo adicionar porque ocurrieron errores durante la operaci&oacute;n solicitada.');
                else {
                    if (responseData.codMsg != undefined)
                        mostrarMensaje(responseData.codMsg, responseData.mensaje);

                    else {
                        var result = responseData.success;
                        switch (result) {
                            case 0:
                                mostrarMensaje(1, 'Los instrumentos bancarios han sido adicionados '
                                        + 'satisfactoriamente </br> con los n&uacute;meros:</br>'
                                        + responseData.numeroinstorigen + ' y ' + responseData.numeroinst);
                                Ext.getCmp('winCertificar').hide();

                                if (presionandobtnaplicar == true) {
                                    //Aquí se presiona el botón Aplicar
                                    despuesdeAplicar();
                                }
                                else {
                                    //Aquí se presiona el botón Aceptar
                                    wininstbanc.hide();
                                }

                                limpiardatos(1, accaplicar);
                                //borrar valores del radio button
                                Ext.getCmp('taboper1').setDisabled(true);
                                Ext.getCmp('taboper2').setDisabled(true);
                                Ext.getCmp('taboper3').setDisabled(true);
                                stinstrumentobanc.reload();
                                //cbtipodoc.reset();
                                break;
                            case -2 :
                                mostrarMensaje(1, 'No se puede adicionar con este n&uacute;mero de talonario.');
                                break;
                            case -3 :
                                mostrarMensaje(1, 'No se pudo adicionar el instrumento debido a la ocurrencia de errores cuando se gener&oacute; el n&uacute;mero de talonario.');
                                break;
                            case -4 :
                                mostrarMensaje(1, 'No se encontrad&oacute; moneda para cuenta seleccionada.');
                                break;
                            case -5 :
                                mostrarMensaje(1, 'Ocurrieron errores en el env&iacute;o de datos de las liquidaciones del instrumento.');
                                break;
                            case -6 :
                                mostrarMensaje(1, 'No se puede adicionar el instrumento. El n&uacute;mero de documento est&aacute; actualmente en uso <br>por otro instrumento para el tipo de documento y cuenta seleccionados.</br>');
                                break;
                            case -7 :
                                mostrarMensaje(1, 'No se puede adicionar el instrumento. No se encontr&oacute; la operaci&oacute;n contable de lo que se quiere liquidar.');
                                break;
                            case -8 :
                                mostrarMensaje(1, 'No se puede adicionar el instrumento. No se encontr&oacute; la operaci&oacute;n asociada a la cuenta de ingreso.');
                                break;
                            case -9 :
                                mostrarMensaje(1, 'No se puede adicionar el instrumento. No se encontr&oacute; la operaci&oacute;n asociada a la cuenta de gasto.');
                                break;
                            default :
//                                mostrarMensaje(1, 'El instrumento ha sido guardado satisfactoriamente con el n&uacute;mero: ' + result + '.');
                                mostrarMensaje(1, 'El instrumento bancario ha sido adicionado satisfactoriamente.');
                                limpiardatos(1, accaplicar);
                                //borrar valores del radio button
                                Ext.getCmp('taboper1').setDisabled(true);
                                Ext.getCmp('taboper2').setDisabled(true);
                                Ext.getCmp('taboper3').setDisabled(true);
                                //cbtipodoc.reset();
                                stinstrumentobanc.reload();
                                break;
                        }
                    }
                }
            }
        });
    }

}

/*funcion para adicionar un instrumento cancelado desde el origen
 *@flujocertf (true | false) indica que se quiere cancelar desde el origen
 *una certificacion
 */
function adicionarinstcancelado(flujocertf, param) {

    loadMessageBox('Guardando datos del instrumento bancario');
    if (!flujocertf) {// Para buscar el tipo d documento segun el nomenclador
        var dat = sttipodoc.getAt(sttipodoc.find('iddoc', cbtipodoc.getValue())).data;
    }
    else {// se obtiene el tipo de documento del certf
        dat = sttipodoccertf.getAt(sttipodoccertf.find('iddoc', cbtipodoccertf.getValue())).data;
    }

    Ext.Ajax.request({
        url: 'cancelarinstdesdeorigen',
        method: 'POST',
        params: {
            idcuentabancaria: (!flujocertf) ? cbcuentabanc.getValue() : cbcuentabanccertf.getValue(),
            iddoc: (!flujocertf) ? cbtipodoc.getValue() : cbtipodoccertf.getValue(),
            nomtipodoc: parseInt(dat.iddocumentos),
            tfnumerodoc: (!flujocertf) ? tfnumerodoc.getValue() : tfnumerodoccertf.getValue(),
            dfemision: (!flujocertf) ? dfemision.getRawValue() : dfemisioncertf.getRawValue(),
            dfaceptacion: (!flujocertf) ? dfaceptacion.getRawValue() : dfemisioncertf.getRawValue(),
            dfvencimiento: (!flujocertf) ? dfvencimiento.getRawValue() : dfemisioncertf.getRawValue(),
            idtalonario: (!flujocertf) ? idTalonario : idTalonariocertf,
            entradasalida: (!flujocertf) ? cbtipoOpInstr.getValue() : param[0].tipooperacion,
            idmoneda: (!flujocertf) ? stmonedatasa.getAt(0).get('idmoneda') : param[0].idmoneda, //idmonedaV,
            tipo: verLetra(), // Devuelve 0 si es leetra y 1 sino es
            comentario: cbmotivocancel.getRawValue() //carga el motivo de cancelacion
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            Ext.MessageBox.hide();
            winMotivoCancelacion.hide();
            if (responseData == undefined)
                mostrarMensaje(1, 'El instrumento no se pudo adicionar porque ocurrieron errores durante la operaci&oacute;n solicitada.');
            else {
                switch (responseData.success) {
                    case -1:
                        if (!flujocertf) {
                            limpiardatos(1, 'accaplicar');
                        }
                        else {
                            buscarNotalonarioCertf(param[0].tipooperacion);
                        }
                        mostrarMensaje(1, 'El instrumento bancario ha sido adicionado satisfactoriamente.');
                        stinstrumentobanc.reload();
                        break;
                    case -2 :
                        mostrarMensaje(1, 'No se puede adicionar con este n&uacute;mero de talonario.');
                        break;
                    case -3 :
                        mostrarMensaje(1, 'No se pudo adicionar el instrumento debido a la ocurrencia de errores cuando se gener&oacute; el n&uacute;mero de talonario.');
                        break;
                    case -4 :
                        mostrarMensaje(1, 'No se encontrad&oacute; moneda para cuenta seleccionada.');
                        break;
                    case -5 :
                        mostrarMensaje(1, 'Ocurrieron errores en el env&iacute;o de datos de las liquidaciones del instrumento.');
                        break;
                    case -6 :
                        mostrarMensaje(1, 'No se puede guardar el instrumento. El n&uacute;mero de documento est&aacute; actualmente en uso <br>por otro instrumento para el tipo de documento y cuenta seleccionados.</br>');
                        break;
                    case -7 :
                        mostrarMensaje(1, 'No se puede guardar el instrumento. No se encontr&oacute; la operaci&oacute;n contable de lo que se quiere liquidar.');
                        break;
                    case -8 :
                        mostrarMensaje(1, 'No se puede guardar el instrumento. No se encontr&oacute; la operaci&oacute;n asociada a la cuenta de ingreso.');
                        break;
                    case -9 :
                        mostrarMensaje(1, 'No se puede guardar el instrumento. No se encontr&oacute; la operaci&oacute;n asociada a la cuenta de gasto.');
                        break;
                    default :
                        if (!flujocertf) {
                            limpiardatos(1, 'accaplicar');
                        }
                        else {
                            buscarNotalonarioCertf(param[0].tipooperacion);
                        }
//                        mostrarMensaje(1, 'El instrumento ha sido guardado satisfactoriamente con el n&uacute;mero: ' + responseData.numeroinst + '.');
                        mostrarMensaje(1, 'El instrumento bancario ha sido adicionado satisfactoriamente.');
                        stinstrumentobanc.reload();
                        break;
                }
            }
        }
    });
}

/*muestra la ventana para el motivo de cancelacion
 *@flujocertf (true | false) indica que se quiere cancelar desde el origen
 *una certificacion
 *(param) contiene los datos necesarios para la certificacion
 */
function MuestraWinMotivoCancelacion(flujocertf, param) {
    stmotivo.load();
    if (!winMotivoCancelacion) {
        winMotivoCancelacion = new Ext.Window
                ({
                    autoValidate: false,
                    constrain: true,
                    title: 'Motivo de cancelaci&oacute;n',
                    modal: true,
                    resizable: false,
                    layout: 'fit',
                    closeAction: 'hide',
                    id: 'winMotivoCancelacion',
                    autoHeight: true,
                    border: false,
                    width: 300,
                    height: 200,
                    buttons: [{
//                icon: perfil.dirImg + 'cancelar.png',
                            iconCls: 'cancelar',
                            text: 'Cancelar',
                            tooltip: 'Cerrar ventana sin guardar los datos',
                            handler: function() {
                                winMotivoCancelacion.hide();
                                cbmotivocancel.reset();
                            }
                        },
                        {
//                    icon: perfil.dirImg + 'aceptar.png',
                            iconCls: 'aceptar',
                            text: 'Aceptar',
                            tooltip: 'Guardar datos y cerrar ventana',
                            handler: function() {
                                if (cbmotivocancel.isValid()) {
                                    adicionarinstcancelado(flujocertf, param);
                                    cbmotivocancel.reset();
                                }

                            }
                        }],
                    listeners: {
                        show: function() {
                            winMotivoCancelacion.center();
                        }
                    }
                });
        winMotivoCancelacion.add(cbmotivocancel);
        winMotivoCancelacion.doLayout();
        winMotivoCancelacion.show();
        winMotivoCancelacion.center();
    }
    else {
        winMotivoCancelacion.add(cbmotivocancel);
        winMotivoCancelacion.doLayout();
        winMotivoCancelacion.show();
        winMotivoCancelacion.center();
    }
}
/**muestra el msg para confirmar la cancelacion
 *@flujocertf (true | false) indica que se quiere cancelar desde el origen
 *una certificacion
 *(param) manda los parametros de la certificacion para el caso que sea por
 *el btn o dentro de flujo normal
 */
function mensajeCancelacion(flujocertf, param) {

    if (!flujocertf) {//caso en que no es una certificacion
        msg = 'La acci&oacute;n registrar&aacute; el instrumento ' + tfnumerodoc.getValue() + ' en estado Cancelado.</br> &iquest;Est&aacute; seguro que quiere continuar?';
    }
    else {//caso en que es una certifiacion
        msg = 'La acci&oacute;n registrar&aacute; el instrumento ' + tfnumerodoccertf.getValue() + ' en estado Cancelado.</br> &iquest;Est&aacute; seguro que quiere continuar?';
    }
    mostrarMensaje(2, msg, function(btn) {
        if (btn == 'ok')
            MuestraWinMotivoCancelacion(flujocertf, param);
    });

}

//funcion para cargar los datos seleccionados del grid a modificar
function cargardatosmodificarinst() {
    MostrarEtiquetas(Ext.getBody(), 'Cargando...'/*etiquetas.lbMsgCargando*/);

    Ext.Ajax.request({
        url: 'loadDataModInstrumento',
        params: {
            iddocumento: stinstrumentobanc.data.items[idgridI].get('iddocumento'),
            idctabancaria: stinstrumentobanc.data.items[idgridI].get('idcuentabancaria'),
            idtipooperacion: sminstbanc.getSelected().data.registrado
        },
        callback: function(options, success, response) {

            tfnumero.setDisabled(true);
            cbfiltrotipodoc.setDisabled(true);
            tffechaInicio.setDisabled(true);
            tffechaFin.setDisabled(true);
            Ext.getCmp('btBuscar').setDisabled(true);
            Ext.getCmp('btnLimpiarLiquidar').setDisabled(true);

            var responseData = Ext.decode(response.responseText);
//          para que llene los datos del panel 1 (operacion, tipodoc, ctabanc, noDoc)
            datosPanel_1_InstBancario(responseData.documentos);
            //se carga la moneda
            if (responseData.moneda.datos.length == 0) {
                lMasktemp.hide();
                mostrarMensaje(1, 'La tasa actual de la moneda asociada a la cuenta bancaria ha excedido su per\u00edodo de vigencia. <br> Por favor seleccione otra cuenta bancaria.</br>');
                cbcuentabanc.clearValue();
                tfnumerodoc.reset();
            } else {
                stmonedatasa.loadData(responseData.moneda);
                idmonedainstmod = responseData.moneda.datos[0].idmoneda;
            }
//          datos del panel 2 (las fechas)
            datosPanel_2_InstBancario(responseData.globals);
//          datos del panel 2 (los importes)
            datosPanel_3_InstBancario();
//          datos del panel 4 (beneficiario, recibido, especialidad, comentario)
            datosPanel_4_InstBancario();
//          carga tabPanel de las operaciones para el modificar instrumento
            datosTabPanel_Oper_InstBancario(responseData.operaciones);
            lMasktemp.hide();

            if (acc == 'mod') {
                cbxbeneficiario.setDisabled(true);
            }
        }
    });
}

/**
 * para que llene los datos del panel 1 (operacion, tipodoc, ctabanc, noDoc)
 */
function datosPanel_1_InstBancario(documentos) {
    cbtipoOpInstr.setValue((stinstrumentobanc.data.items[idgridI].get('importeor') > 0) ? 1 : 2);
    cbtipoOpInstr.setDisabled(true);
    //se cargan los documentos
    sttipodoc.loadData(documentos);
    cbtipodoc.setValue(stinstrumentobanc.data.items[idgridI].get('idtipodocumento'));
    cbtipodoc.setRawValue(stinstrumentobanc.data.items[idgridI].get('denominacion'));
    selectcasetipodoc(1);//se ejecuta desp del sttipodoc.loadData()
    cbtipodoc.setDisabled(true);
    cbcuentabanc.setValue(stinstrumentobanc.data.items[idgridI].get('idcuentabancaria'));
    cbcuentabanc.setRawValue(stinstrumentobanc.data.items[idgridI].get('cuentabancaria'));
    cbcuentabanc.setDisabled(true);
    tfnumerodoc.setValue(stinstrumentobanc.data.items[idgridI].get('numerodocumento'));
    tfvalidarnodocumento.setDisabled(true);
}

/**
 * para que llene los datos del panel 2 (las fechas)
 */
function datosPanel_2_InstBancario(globals) {
    dfemision.setDisabled(false);
    dfaceptacion.setDisabled(false);
    dfvencimiento.setDisabled(false);
    //datos globales de las fechas
    if (globals.datos.fechai) {
        dfemision.setMaxValue(globals.datos.fechafin);  //No se restringe la fecha de fin
        dfemision.setMinValue(globals.datos.fechai);
        dfaceptacion.setMaxValue(globals.datos.fechafin);
        dfaceptacion.setMinValue(globals.datos.fechai);
    } else {
        lMasktemp.hide();
        mostrarMensaje(1, 'No encontrada fecha de inicio del per&iacute;odo.');
    }

    dfemision.setValue(stinstrumentobanc.data.items[idgridI].get('fechaemision'));
    dfaceptacion.setValue(stinstrumentobanc.data.items[idgridI].get('fecharecepcion'));
    dfvencimiento.setValue(stinstrumentobanc.data.items[idgridI].get('fechavencimiento'));
    dfaceptacion.setDisabled(true);
    dfvencimiento.setDisabled(true);
}

/**
 * para que llene los datos del panel 2 (los importes)
 */
function datosPanel_3_InstBancario() {
    tfimporte.setValue(stinstrumentobanc.data.items[idgridI].get('importemo'));
    tfresto.setRawValue('0.00');
    tfimporte.setRawValue(saldo(tfimporte.getValue()));
    tfimporte.setDisabled(false);
    tfimporteletras.setValue(convertir_a_letras(tfimporte.getValue()));
    lfImporteTotalAllOperaciones.setText(saldo(tfimporte.getValue()));
}

/**
 * para que llene los datos del panel 4 (beneficiario, recibido, especialidad, comentario)
 */
function datosPanel_4_InstBancario() {
    //cargar datos del  panel 3 en la ventana Add/mod inst
    var recordTemp = Ext.data.Record.create([
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'tipo',
            type: 'int'
        },
        {
            name: 'denominacion',
            type: 'string'
        }
    ]);

    //if (!cbrecibidopor.disabled) {
    if (stinstrumentobanc.data.items[idgridI].get('idrecibido')) {
        var p = new recordTemp({
            id: stinstrumentobanc.data.items[idgridI].get('idrecibido'),
            idtipo: stinstrumentobanc.data.items[idgridI].get('tiporecibe'),
            //nombre: stinstrumentobanc.data.items[idgridI].get('recibe').split('-')[1]
            nombre: stinstrumentobanc.data.items[idgridI].get('recibe')
        });
        strecibidopor.add(p);

        cbxtiporecibidopor.setValue(stinstrumentobanc.data.items[idgridI].get('tiporecibe'));
        cbrecibidopor.setValue(stinstrumentobanc.data.items[idgridI].get('idrecibido'));
        cbrecibidopor.setDisabled;

    }
    //}
    if (stinstrumentobanc.data.items[idgridI].get('idbeneficiario')) {
        var pp = new recordTemp({
            id: stinstrumentobanc.data.items[idgridI].get('idbeneficiario'),
            tipo: stinstrumentobanc.data.items[idgridI].get('tipobeneficiario'),
            //nombre: stinstrumentobanc.data.items[idgridI].get('beneficiario').split('-')[1]
            nombre: stinstrumentobanc.data.items[idgridI].get('beneficiario')
        });
        stbeneficiario.add(pp);

        cbxtipobeneficiario.setValue(stinstrumentobanc.data.items[idgridI].get('tipobeneficiario'));
        cbxbeneficiario.setValue(stinstrumentobanc.data.items[idgridI].data.idbeneficiario);
        cbxtipobeneficiario.setDisabled(true);
        cbxbeneficiario.setDisabled(true);
    } else {
        cbxbeneficiario.setDisabled(true);
        cbxbeneficiario.setValue('');
    }
    cbEspecialidad2.setValue(stinstrumentobanc.data.items[idgridI].get('idespecialidad'), stinstrumentobanc.data.items[idgridI].get('descripcionespecialidad'));
//                comboIframe1.fSelect.values.push(stinstrumentobanc.data.items[idgridI].get('idespecialidad'));
//                comboIframe1.fSelect.display.push(stinstrumentobanc.data.items[idgridI].get('descripcionespecialidad'));
    //cbEspecialidad2.setRawValue(stinstrumentobanc.data.items[idgridI].get('descripcionespecialidad'));
    idespecialidad = '';
    idespecialidad = stinstrumentobanc.data.items[idgridI].get('idespecialidad');
    oldvalue = idespecialidad;//se almacena el valor viejo de la especialidad para comparar si se modifico
    tacomentario.setValue(stinstrumentobanc.data.items[idgridI].get('comentario'));

    tfpagado.setDisabled(true);
    rckbtnavalada.setDisabled(true);
}

/**
 * carga los datos en el tabPanel de las operaciones para el modificar instrumento
 */
function datosTabPanel_Oper_InstBancario(responseData) {
    idoperacionliq = 0;
    idoperacionoper = 0;
    //  liquid ={};
    if (responseData.succes != 0) {
        btnventana.setDisabled(false);
        //habilitando los tabpanels pertinentes
        if (responseData.liquidacion.length > 0) {
            sttabliquidar.removeAll();
            arrtabliquidacion = new Array();
            //liqmod = responseData.liquidacion;

            var operliq = responseData.liquidacion[0].idoperacioncontalternativa;
            operaciondeliq = (Ext.isEmpty(operliq)) ? '' : operliq;

            //se crea el objeto record de la liquidacion y se inserta en el grid liquidaciones
            recLiq = new Ext.data.Record.create([{
                    name: 'id'
                }, {
                    name: 'idderecho'
                }, {
                    name: 'nro'
                }, {
                    name: 'fecha'
                }, {
                    name: 'tipodoc'
                }, {
                    name: 'docdenomin'
                }, {
                    name: 'estado'
                }, {
                    name: 'comentario'
                }, {
                    name: 'origen'
                }, {
                    name: 'fechavencimiento'
                }, {
                    name: 'edad'
                }, {
                    name: 'impliquidar'
                }, {
                    name: 'liquidarimp'
                }, {
                    name: 'idoperacion'
                }, {
                    name: 'descoperacion'
                }
            ]);
            var resliq = 0;

            var newoperliquidada;
            var arrTemp = [];
            for (var i = 0; i < responseData.liquidacion.length; i++) {

                newoperliquidada = new Array();
                newoperliquidada[0] = responseData.liquidacion[i].id;//idoperacion
                newoperliquidada[1] = responseData.liquidacion[i].nro;//numero
                newoperliquidada[2] = responseData.liquidacion[i].docdenomin;//tipo documento
                newoperliquidada[3] = responseData.liquidacion[i].estado;//estado del documento
                newoperliquidada[4] = responseData.liquidacion[i].origen;//origen del documento
                newoperliquidada[5] = responseData.liquidacion[i].edad;//edad del documento
                newoperliquidada[6] = responseData.liquidacion[i].comentario;//comentario del documento
                newoperliquidada[7] = responseData.liquidacion[i].impliquidar;//impliquidar del documento
                newoperliquidada[8] = responseData.liquidacion[i].liquidarimp;//liquidarimp del documento
                newoperliquidada[9] = responseData.liquidacion[i].idoperacion;// operaciones del formulario liquidar
                newoperliquidada[10] = responseData.liquidacion[i].descoperacion;// operaciones del formulario liquidar

                arrtabliquidacion.push(newoperliquidada);

                //se crea el record de la liquidacion
                resliq += parseFloat(responseData.liquidacion[i].impliquidar);
                newRec = new recLiq({
                    id: responseData.liquidacion[i].idliquidacion,
                    idderecho: responseData.liquidacion[i].idderecho,
                    nro: responseData.liquidacion[i].nro,
                    fecha: responseData.liquidacion[i].fecha,
                    tipodoc: responseData.liquidacion[i].tipodoc,
                    docdenomin: responseData.liquidacion[i].docdenomin,
                    estado: responseData.liquidacion[i].estado,
                    comentario: responseData.liquidacion[i].comentario,
                    origen: responseData.liquidacion[i].origen,
                    fechavencimiento: responseData.liquidacion[i].fechavencimiento,
                    edad: responseData.liquidacion[i].edad,
                    impliquidar: responseData.liquidacion[i].impliquidar,
                    liquidarimp: responseData.liquidacion[i].liquidarimp,
                    idoperacion: responseData.liquidacion[i].idoperacion,
                    descoperacion: responseData.liquidacion[i].descoperacion
                });
                //se inserta el record de la liquidacion en el tab liquidaciones
                arrTemp.push(newRec);
                // sttabliquidar.add(newRec);
            }
            sttabliquidar.add(arrTemp);
            cargaInfoEnArrayLiquidaciones(responseData.liquidacion);//llena el array de las liquidaciones
            tfimportetotalliq.setValue(saldoformateado(resliq));//para q tome el  valor del  importe total  en la ventana de liquidaciones
            tempRL = tfimportetotalliq.getValue();
            valoresEnVentLiq = 1;
        }
        else {
            //Desactiva el tab de liquidaciones
            Ext.getCmp('taboper1').setDisabled(true);
        }

        if (responseData.anticipo.length) {
            Ext.getCmp('taboper2').setDisabled(false);
            sttabanticipo.removeAll();
            // pamod = responseData.anticipo;
            //  arroanticipoinst = responseData.anticipo;

            //se crea el objeto record del anticipo y se inserta en el grid anticipo
            recAnt = new Ext.data.Record.create([{
                    name: 'nocontrato'
                }, {
                    name: 'idctacontable'
                }, {
                    name: 'ctacontable'
                }, {
                    name: 'comentario'
                }, {
                    name: 'importe'
                }, {
                    name: 'idoperacionpa'
                }, {
                    name: 'descoperacionpa'
                }, {
                    name: 'idmovimiento'
                }, {
                    name: 'idctacontrapartida'
                }, {
                    name: 'nombrectacontrapartida'
                }
            ]);
            var respa = 0;

            for (var a = 0; a < responseData.anticipo.length; a++) {
                //se crea el record de la anticipo
                respa += parseFloat(responseData.anticipo[a].importe);
                newReca = new recAnt({
                    nocontrato: responseData.anticipo[a].nocontrato,
                    idctacontable: responseData.anticipo[a].idctacontable,
                    ctacontable: responseData.anticipo[a].ctacontable,
                    comentario: responseData.anticipo[a].comentario,
                    importe: responseData.anticipo[a].importe,
                    idoperacionpa: responseData.anticipo[a].idoperacionpa,
                    descoperacionpa: responseData.anticipo[a].descoperacionpa,
                    idctaoperacionpa: responseData.anticipo[a].idctaoperacionpa,
                    idmovimiento: responseData.anticipo[a].idmovimiento,
                    idctacontrapartida: responseData.anticipo[a].idctacontrapartida,
                    nombrectacontrapartida: responseData.anticipo[a].ctacontrapartida

                });
                //se inserta el record del anticipo en el tab anticipo
                sttabanticipo.add(newReca);
            }
            arroanticipoinst = creaDataAnticipos(sttabanticipo.data);//se actualiza el array con los datos del grid

            tfimportetotalant.setValue(saldoformateado(respa));//para q tome el  valor del  importe total  en la ventana de anticipos
            tempRA = tfimportetotalant.getValue();
            valoresEnVentPa = 1;
        }
        /* if (responseData.reembolso.length){
         rbtnreembolso.setDisabled(false);
         idoperacionremb = responseData.reembolso[0].idoperacioncontable;//guardando el id operacion de operacion
         }*/

        if (responseData.otros.length) {
            //otrosmod = responseData.otros;
            Ext.getCmp('taboper3').setDisabled(false);
            sttaboperaciones.removeAll();
            //se crea el objeto record de la otra oper y se inserta en el grid operaciones
            recLiq = new Ext.data.Record.create([{
                    name: 'idoperacion'
                }, {
                    name: 'descoperacion'
                }, {
                    name: 'idctacontable'
                }, {
                    name: 'ctacontable'
                }, {
                    name: 'ctabancaria'
                }, {
                    name: 'importe'
                }, {
                    name: 'idctaoperacion'
                }, {
                    name: 'idmovimiento'
                }, {
                    name: 'signo'
                }, {
                    name: 'idctacontrapartida'
                }, {
                    name: 'ctacontrapartida'
                }, {
                    name: 'idmovimientocaja'
                }, {
                    name: 'idfechacierrenomina'
                },{
                    name: 'idanticipo'
                },{
                    name: 'idclienteproveedor'
                },{
                    name: 'clienteproveedor'
                },{
                    name: 'numerosoperenzona'
                }
            ]);
            var reso = 0;
            for (var o = 0; o < responseData.otros.length; o++) {
                //se crea el record de la oper
                reso += parseFloat(responseData.otros[o].importe);
                newReco = new recLiq({
                    idoperacion: responseData.otros[o].idoperacion,
                    descoperacion: responseData.otros[o].descoperacion,
                    idctacontable: responseData.otros[o].idctacontable,
                    ctacontable: responseData.otros[o].ctacontable,
                    ctabancaria: responseData.otros[o].ctabancaria,
                    importe: responseData.otros[o].importe,
                    idctaoperacion: responseData.otros[o].idctaoperacion,
                    moneda: stinstrumentobanc.data.items[idgridI].get('moneda'),
                    idmovimiento: responseData.otros[o].idmovimiento,
                    signo: responseData.otros[o].signo,
                    idctacontrapartida: responseData.otros[o].idctacontrapartida,
                    ctacontrapartida: responseData.otros[o].ctacontrapartida,
                    idmovimientocaja: responseData.otros[o].idmovimientocaja,
                    idfechacierrenomina: responseData.otros[o].idfechacierrenomina,
                    idanticipo: responseData.otros[o].idanticipo,
                    idclienteproveedor: responseData.otros[o].idclienteproveedor,
                    clienteproveedor: responseData.otros[o].clienteproveedor,
                    numerosoperenzona: responseData.otros[o].numerosoperenzona
                });
                //se inserta el record de la oper en el tab operaciones
                sttaboperaciones.add(newReco);

                //se insertan los anticipos que aparezcan para el modificar
                if(!Ext.isEmpty(responseData.otros[o].idanticipo)) {
                    arridsanticiposMod.push(responseData.otros[o].idanticipo)
                }
                if(!Ext.isEmpty(responseData.otros[o].idclienteproveedor)) {
                    mostrarClienteProveedorOper();
                }
            }
            console.log(sttaboperaciones.data);
            arroperacioninst = creaDataOperaciones(sttaboperaciones.data);//se actualiza el array con los datos del grid

            tfimportetotaloper.setValue(saldoformateado(reso));//para q tome el  valor del  importe total  en la ventana de operaciones
            tempRO = tfimportetotaloper.getValue();
            valoresEnVentOp = 1;
        }

        //Activando los tab que tengan datos en caso de que no haya liquidaciones
        if (responseData.liquidacion.length == 0) {
            if (responseData.anticipo.length > 0) {
                //Caso en que el anticipo trae datos
                Ext.getCmp('tpoperInstrumento').setActiveTab('taboper2');
                abrirventanaope = 2;
            }
            else {
                //Caso en que otras operaciones trae datos
                Ext.getCmp('tpoperInstrumento').setActiveTab('taboper3');
                abrirventanaope = 4;
            }
        }
        else {
            //Caso en que las liquidaciones traen datos
            Ext.getCmp('tpoperInstrumento').setActiveTab('taboper1');
            abrirventanaope = 1;
        }
    }
}
//funcion para modificar un instrumento
function modificarinstbanc(accaplicarmod) {
    if (cambio || cbEspecialidad2.getValue() != oldvalue) {
        // Recibe
        var aux = new Array(); // El recibidopor
        if (cbxbeneficiario.getValue()) {
            aux.push({
                id: cbxbeneficiario.getValue(),
                tipo: cbxtipobeneficiario.getValue()
            });
        }

        if (cbrecibidopor.getValue()) {
            aux.push({
                id: cbrecibidopor.getValue(),
                tipo: cbxtiporecibidopor.getValue()
            });
        }
        loadMessageBox('Guardando datos del instrumento bancario');
        Ext.Ajax.request({
            url: 'modificarinstbancario',
            method: 'POST',
            params: {
                idinstrumentobancario: stinstrumentobanc.data.items[idgridI].get('idinstrumentobancario'),
                idcuentabancaria: stinstrumentobanc.data.items[idgridI].get('idcuentabancaria'),
                idtipodocumento: stinstrumentobanc.data.items[idgridI].get('idtipodocumento'),
                numerodocumento: stinstrumentobanc.data.items[idgridI].get('numerodocumento'),
                dfemision: dfemision.getRawValue(),
                dfaceptacion: dfaceptacion.getRawValue(),
                dfvencimiento: dfvencimiento.getRawValue(),
                tacomentario: tacomentario.getValue(),
                idespecialidad: cbEspecialidad2.getValue(),
                descripcionespecialidad: cbEspecialidad2.getRawValue(),
                idrecibidopor: cbrecibidopor.getValue(), //?cbrecibidopor.getValue():0,  //idrecibido
                idbeneficiario: cbxbeneficiario.getValue(), //stinstrumentobanc.data.items[idgridI].get('idclienteproveedores'),  // No se manda pq no se debe modificar
                tipo: verLetra(), // Devuelve 0 si es letra y 1 sino es
                //liquidadomo           : stinstrumentobanc.data.items[idgridI].get('liquidadomo'),
                importemo: tfimporte.getValue(),
                tfpagado: tfpagado.getValue(),
                idmoneda: stmonedatasa.getAt(0).get('idmoneda'),
                movimiento: Ext.encode(getDatosOperacion()),
                iddoc: cbtipodoc.getValue(),
                entradasalida: cbtipoOpInstr.getValue(),
                beneficiario: Ext.encode(aux),
                operaciondeliq: (Ext.isEmpty(operaciondeliq)) ? '' : operaciondeliq
            },
            callback: function(options, success, response) {
                var result = eval(Ext.decode(response.responseText));
                Ext.MessageBox.hide();
                switch (result) {
                    case -2 :
                        mostrarMensaje(1, 'No se puede modificar con este n&uacute;mero el talonario.');
                        break;
                    case -3 :
                        mostrarMensaje(1, 'Ocurrieron errores cuando se gener&oacute; el n&uacute;mero de talonario.'/*perfil.etiquetas.lbMsgmodificainst3*/);
                        break;
                    case -4 :
                        mostrarMensaje(1, 'No se encontrad&oacute; moneda para cuenta seleccionada'/*perfil.etiquetas.lbMsgmodificainst4*/);
                        break;
                    case -5 :
                        mostrarMensaje(1, 'Ocurri&oacute; un error al guardar el instrumento...'/*perfil.etiquetas.lbMsgmodificainst5*/);
                        break;
                    default :
                        mostrarMensaje(1, 'El instrumento bancario ha sido modificado satisfactoriamente.');

                }
                limpiardatos(1, accaplicarmod);
                Ext.getCmp('taboper1').setDisabled(true);
                Ext.getCmp('taboper2').setDisabled(true);
                Ext.getCmp('taboper3').setDisabled(true);
                //cbtipodoc.reset();
                stinstrumentobanc.reload();
            }
        });
        return true;
    }
    else {
        mostrarMensaje(1, perfil.etiquetas.lbMsgcambio/*perfil.etiquetas.lbMsgcambio*/);
        return false;
    }
}


/*************************************************************************/
/////////////////  funciones del formulario Liquidar ////////////////////
/*************************************************************************/
//formar el arreglo a enviar con los valores seleccionados del grid
function arrayrecordliq() {
    var seleccion = smliquidar.getSelections();
    var records = new Array();
    var j = 0;
    for (var i = 0; i < seleccion.length; i++) {
        if (seleccion[i].data.liquidarimp)
            liq = seleccion[i].data.liquidarimp;
        else
            liq = seleccion[i].data.impliquidar;

        records[j] = [
            {
                'id': seleccion[i].data.id
            },
            {
                'tipodoc': seleccion[i].data.tipodoc
            },
            {
                'importemb': seleccion[i].data.impliquidar
            },
            {
                'liquidar': liq
            },
            {
                'idliquidacion': seleccion[i].data.idliquidacion
            },
            {
                'idderecho': seleccion[i].data.idderecho
            }
        ];
        j++;
    }
    return records;
}

//formar el arreglo a enviar con los valores seleccionados del grid
function arrayreembolsar() {
    var selected = smreembolsar.getSelections();
    reembasocc = new Array();
    for (var i = 0; i < selected.length; i++) {
        reembasocc.push(selected[i].data.idsolicitudr);
    }
    return;
}

function fiscal() {
    if (cbxbeneficiario.getValue())
        tffiscalliq.setValue('No');
    else
        tffiscalliq.setValue('Si');
}

//funcion para buscar los datos a llenar en el grid liquidar
function cagarliquidacion() {
    stliquidar.load({
        callback: function(r, options, success) {/*para escribir el importe a liquidar que se habia almacenado*/
            stliquidaciones.removeAll();//se limpia el grid de las liquidaciones
            if (stliquidar.getCount() && arroperliquidacion.length > 0) {/*si cargaron los datos y ademas habia info almacenada */
                for (var i = 0; i < stliquidar.getCount(); i++) {//se recorren las filas cargadas
                    for (var j = 0; j < arroperliquidacion.length; j++) {/*se recorre la info almacenada para mostrar el importe liquidado*/
                        if (stliquidar.data.items[i].data.id == arroperliquidacion[j][0]) {//si son iguales se carga el importe
                            record = stliquidar.data.items[i];//se obtiene el record
                            record.data.liquidarimp = arroperliquidacion[j][2];//se le pone el importe
                            record.data.idcuentacontable = arroperliquidacion[j][4][0][0];//se le pone el importe
                            record.data.ctacontable = arroperliquidacion[j][4][0][1];//se le pone el importe
                            stliquidar.remove(stliquidar.data.items[i]);//elimina el que estaba
                            stliquidar.insert(i, record);//adiciona la nueva fila con el importe actualizado

                            smliquidar.selectRow(i, true);
                        }
                    }
                }
            }
            else if (stliquidar.getCount() == 0) {
                var msgLiq = (cbtipoOpInstr.getValue() == 1) ? 'derechos de cobro' : 'obligaciones de pago';
                mostrarMensaje(1, 'No se encontraron ' + msgLiq + ' pendientes por liquidar.');
            }

            importeLiquidacion();
            pagadoOper();//se actualiza el resto
        }
    });
    Ext.getCmp('btnliquidar').disable();//se deshabilita el btn liquidar
    //se limpian los campos del filtro
    tfnumero.reset();
    cbfiltrotipodoc.reset();
    tffechaInicio.reset();
    tffechaFin.reset();
    tffechaFin.setValue(dfemision.getValue());
    tffechaFin.setMaxValue(dfemision.getValue());
    tffechaInicio.setMaxValue(dfemision.getValue());
}

//sumar la columna de importe del grid liquidar
function sumarimporteliq() {
    var suma = 0, valor;
    var seleccion = smliquidar.getSelections();
    //obtener los registros seleccionados
    for (i = 0; i < smliquidar.getCount(); i++) {
        if (seleccion[i].data.liquidarimp)
            valor = seleccion[i].data.liquidarimp;
        else
            valor = seleccion[i].data.impliquidar;
        suma += valor;
    }
    tfimportetotalliq.setValue(suma);
    tfimportetotalliq.setRawValue(saldo(tfimportetotalliq.getValue()));
}


//sumar la columna de importe del grid liquidar
function sumarimportereembolsar() {
    var suma = 0, valor;
    var seleccion = smreembolsar.getSelections();
    //obtener los registros seleccionados
    for (i = 0; i < smreembolsar.getCount(); i++) {
        valor = seleccion[i].data.importe;
        suma += valor;
    }
    tfimporterev.setValue(suma);
    tfimporterev.setRawValue(saldo(tfimporterev.getValue()));
}
/*************************************************************************/
/////////////////  funciones del formulario Reembolso ////////////////////
/*************************************************************************/

//Funcion para habilitar los campos de reembolso y recargar sus valores
function BuscarValoresReembolso() {
    //if (cbcajero.getValue() && cbmovimientorev.getValue()){  // Ya se debe verificar antes de hacer esta llamada
    cbxfcajarev.setDisabled(true);
    tffondorev.setDisabled(false);
    // tfmonedarev.setDisabled(false);
    // tfimporterev.setDisabled(false);
    gpreembolso.setDisabled(false);
    streembolso.removeAll();

    //	MostrarEtiquetas(Ext.getBody(), 'Buscando cajeros de caja seleccionada...'); // Mostrar mensaje de espera
    //cargar la caja, fondo y la moneda
    streembolso.load({
        params: {//328; //cbxbeneficiario.getValue(); //idmonedaV,
            start: 0,
            limit: 10
        },
        callback: function(r, options, success) {
            if (streembolso.getCount()) {
                if (acc == 'mod') {  // Verificar esto despues. El modificar
                    smreembolsar.selectAll();
                    sumarimportereembolso();
                    /*  llamar para cargar los datos de los campos
                     var result = r;
                     if (result[0]) {
                     cbxfcajarev.setValue(result['caja']);
                     tffondorev.setValue(result['fondo']);
                     tfmonedarev.setValue(result['moneda']);
                     */
                }
            }
            else {
                cbxfcajarev.focus(true, true);
                mostrarMensaje(1, 'No se encontraron solicitudes de reembolsos.'/*perfil.etiquetas.lbMsgreembolsoNo*/);
            }
        }
    });
}

//verifica que el importe de reembolso y instrumento son iguales, para
//abrir la ventana diferencia en caso de que no sea asi
function verificarimportereembolso() {
    if (tfimporterev.getValue()) {
        if (tfimporterev.getValue() != tfimporte.getValue()) {
            //lleno los campos de la diferencia
            tfimporteinst.setValue(tfimporte.getValue());
            return false;
        }
        else
            return true;
    }
    else
        return false;
}

//sumar la columna de importe del grid reembolso
function sumarimportereembolso() {
    var suma = 0;
    for (i = 0; i < streembolso.getCount(); i++) {
        suma += parseFloat(streembolso.data.items[i].get('importe'));
    }
    tfimporterev.setValue(suma);
    tfimporterev.setRawValue(saldo(tfimporterev.getValue()));
}

/*************************************************************************/
/////////////////  funciones del formulario pago anticipado ////////////////////
/*************************************************************************/

//verifica que el importe de pago anticipado y el de instrumento son iguales, para
//abrir la ventana diferencia en caso de que no sea asi
function verificarimportePagoA() {
    if (cbtipodoc.getValue() && cbcuentabanc.getValue()) {
        if (tfmonedarev.getValue() != tfmonedarev.getValue()) {
            //lleno los campos de la diferencia
            tfimporteinst.setValue(tfimporte.getValue());
            return false;
        }
        else
            return true;
    }
}

function habilitarcomentario() {
    if (cbmovimientopaa.getValue())
        tacomentariopa.setDisabled(false);
    else {
        tacomentariopa.reset();
        tacomentariopa.setDisabled(false);
    }

}

//funcion para buscar la moneda contable
function buscarMonedaCont() {
    var tasacompra = parseFloat(stmonedatasa.getAt(0).get('tasacompra'));
    var factorconvers = parseFloat(stmonedatasa.getAt(0).get('factordeconversion'));
    var val = parseFloat(tfimporteorig.getValue());
    result = val * tasacompra / factorconvers;
    tfimportecont.setValue(result);
    tfimportecont.setRawValue(saldo(result));
    cbmovimientopaa.setDisabled(false);
    return;
}


/*************************************************************************/
/////////////////  funciones del formulario Operacion ////////////////////
/*************************************************************************/
//buscar la cuentas bancarias de la operacion
function buscarcuentaoperacion(v, p, objopersel) {
    idfechacierrenomina = '';
    if (Ext.getCmp('idtfimporteletrasoper').columnWidth == 0.4) {
        ocultarClienteProveedorOper();
    }
    //Esto es para cargar los reembolsos y abrir la ventana respectiva
    if (p == 'oper' && objopersel.signo && (objopersel.signo == 19 || objopersel.signo == 43)) {
        MostrarEtiquetas(Ext.getBody(), 'Cargando...');

        var storecuenta = cbcuentabanc.store;
        var index = storecuenta.find('idcuentabancaria', cbcuentabanc.getValue());
        var idmoneda = (storecuenta.getAt(index)) ? storecuenta.getAt(index).data.idmoneda : idmonedainstmod;

        //Mandar los idmovimiento de caja(se relaciona con el reembolso) para no tener que cargar nuevamente
        //ese reembolso
        if (stgridoperaciones.getCount() > 0) {
            stgridoperaciones.each(function(record) {
                var founded = false;
                for (var i = 0, long = arrIdmovsCajaToSend.length; i < long; i++) {
                    if (arrIdmovsCajaToSend[i] == record.data.idmovimientocaja) {
                        founded = true;
                        break;
                    }
                }

                if (!founded && record.data.idmovimientocaja) {
                    arrIdmovsCajaToSend.push(record.data.idmovimientocaja);
                }
            });
        }

        var title = (objopersel.signo == 19) ? 'Solicitudes de reembolso' : 'Extracci&oacute;n de efectivo para n&oacute;mina';

        new Ext.Cont.Banco.WindowReembolso({
            title: title,
            idmoneda: idmoneda,
            fechaFin: dfemision.getRawValue(),
            idmovimientoscaja: Ext.encode(arrIdmovsCajaToSend),
            signo: objopersel.signo,
            listeners: {
                loadend: function(records, window) {
                    lMasktemp.hide();

                    if (records.length == 0) {
                        tfimporteoper.setDisabled(false);
                        cbmovimientooper.setValue('');
                        cbmovimientooper.focus(true, true);
                        var msg = (objopersel.signo == 19) ? 'No hay reembolsos que mostrar.' : 'No hay extracciones de efectivo que mostrar.';
                        mostrarMensaje(1, msg);

                        return false;//Cerrar ventana
                    }
                    else {
                        window.gpreembolso.getColumnModel().setRenderer(4, function(value, metadata, record, rowIndex, colIndex, store) {
                            var idmovimientocaja = record.data.idmovimientocaja;
                            var index = stgridoperaciones.find('idmovimientocaja', idmovimientocaja);

                            var estadopos = (objopersel.signo == 19) ? 'Reembolsado' : 'Extra&iacute;do';
                            var estadoneg = (objopersel.signo == 19) ? 'No reembolsado' : 'No extra&iacute;do';

                            if (index > -1) {
                                record.data.reembolsado = 1;
                                return '<span style="color:green;">' + estadopos + '</span>';
                            }
                            else {
                                record.data.reembolsado = 0;
                                return '<span style="color:red;">' + estadoneg + '</span>';
                            }
                        });

                        return true;//Abrir ventana
                    }
                },
                valselected: function(valselected) {

                    if (valselected.reembolsado) {
                        var msg = (objopersel.signo == 19) ? 'La solicitud de reembolso est&aacute; cargada.' : 'La extracci&oacute;n de efectivo para n&oacute;mina est&aacute; cargada.';
                        mostrarMensaje(1, msg);
                        return false;
                    }
                    else {
                        var obj = {
                            datos: [{
                                    idcuenta: valselected.idcuenta,
                                    text: valselected.cuenta,
                                    idmovimientocaja: valselected.idmovimientocaja
                                }]
                        };
                        cbcuentaacreditaroper.getStore().loadData(obj);

                        cbcuentaacreditaroper.reset();
                        cbcuentaacreditaroper.setValue(valselected.idcuenta, valselected.cuenta);
                        cbcuentaacreditaroper.setDisabled(true);

                        tfimporteoper.setValue(valselected.importemo);
                        tfimporteoper.setDisabled(true);
                        tfimporteletrasoper.setValue(convertir_a_letras(tfimporteoper.getValue()));
                        activateAddCPAnticipado('op');
                        cbcuentadebitar.focus(true, true);
                        return true;
                    }
                },
                close: function() {
                    if (Ext.isEmpty(cbcuentaacreditaroper.getValue())) {
                        cbmovimientooper.setValue('');
                    }
                }
            }
        });
        tfimporteoper.maxValue = undefined;
        tfimporteoper.clearInvalid();
    }
    else if (p == 'oper' && objopersel.signo && (objopersel.signo == 41 || objopersel.signo == 42)) {
        MostrarEtiquetas(Ext.getBody(), 'Cargando...');

        var storecuenta = cbcuentabanc.store;
        var index = storecuenta.find('idcuentabancaria', cbcuentabanc.getValue());
        var idmoneda = (storecuenta.getAt(index)) ? storecuenta.getAt(index).data.idmoneda : idmonedainstmod;

        var title = (cbtipoOpInstr.getValue() == 1) ? 'Pagos anticipados pendientes' : 'Cobros anticipados pendientes';
        var msgAux = (cbtipoOpInstr.getValue() == 1) ? 'pagos anticipados pendientes' : 'cobros anticipados pendientes';

        var iddocumento = (acc == 'ins') ? '' : stinstrumentobanc.data.items[idgridI].get('iddocumento');

        new Ext.Cont.Banco.WindowAnticipo({
            id: 'wanticipo',
            title: title,
            idmoneda: idmoneda,
            fechaFin: dfemision.getRawValue(),
            idcliente: cbxbeneficiario.getValue(),
            tipooperacion: cbtipoOpInstr.getValue(),
            iddocumento: iddocumento,
            arridsanticiposMod: arridsanticiposMod,
            listeners: {
                loadend: function (records, window) {
                    lMasktemp.hide();

                    if (records.length == 0) {
                        tfimporteoper.setDisabled(false);
                        cbmovimientooper.setValue('');
                        cbmovimientooper.focus(true, true);

                        mostrarMensaje(1, 'No hay ' + msgAux + ' que mostrar.');

                        return false;//Cerrar ventana
                    }
                    else {
                        window.gpanticipo.getColumnModel().setRenderer(5, function (value, metadata, record, rowIndex, colIndex, store) {
                            var idanticipo= record.data.idanticipo;
                            var index = stgridoperaciones.find('idanticipo', idanticipo);

                            if (index > -1) {
                                record.data.cargado = 1;
                                return '<span style="color:green;">Cargado</span>';
                            }
                            else {
                                record.data.cargado = 0;
                                return '<span style="color:red;">No cargado</span>';
                            }
                        });

                        return true;//Abrir ventana
                    }
                },
                valselected: function (valselected) {

                    if (valselected.cargado) {
                        var textAnt = (cbtipoOpInstr.getValue() == 1) ? 'El pago anticipado seleccionado est&aacute; cargado.' : 'El cobro anticipado seleccionado est&aacute; cargado.';
                        mostrarMensaje(1, textAnt);
                        return false;
                    }
                    else {
                        var obj = {
                            datos: [{
                                idcuenta: valselected.idcuenta,
                                text: valselected.nombrecuenta,
                                idanticipo: valselected.idanticipo
                            }]
                        };
                        cbcuentaacreditaroper.getStore().loadData(obj);

                        cbcuentaacreditaroper.reset();
                        cbcuentaacreditaroper.setValue(valselected.idcuenta, valselected.nombrecuenta);
                        cbcuentaacreditaroper.setDisabled(true);

                        tfimporteoper.setValue(valselected.pendientemo);
                        tfimporteoper.setValue(valselected.pendientemo);
                        tfimporteoper.maxValue = valselected.pendientemo;
                        tfimporteoper.clearInvalid();
                        // tfimporteoper.setDisabled(true);
                        tfimporteletrasoper.setValue(convertir_a_letras(tfimporteoper.getValue()));
                        activateAddCPAnticipado('op');
                        cbcuentadebitar.focus(true, true);
                        return true;
                    }
                },
                close: function () {
                    if (Ext.isEmpty(cbcuentaacreditaroper.getValue())) {
                        cbmovimientooper.setValue('');
                    }
                }
            }
        });
    }
    else {
        cbcuentaacreditaroper.reset();
        cbcuentaacreditaroper.clearValue();
        cbcuentaacreditaroper.setDisabled(false);
        tfimporteoper.setDisabled(false);

        var idmoneda = (acc == 'ins') ? stmonedatasa.getAt(0).get('idmoneda') : stinstrumentobanc.data.items[idgridI].get('idmoneda');

        var params = {
            idoperacion: v,
            tipoOperacion: cbtipoOpInstr.getValue(),
            idmoneda: idmoneda,
            signo: objopersel.signo
        };
        cbcuentaacreditaroper.setBaseParams(params);

        if (cbcuentaacreditaroper.tree.rendered) {
            cbcuentaacreditaroper.load();
        }

        if (objopersel.signo == 40) {
            new Ext.Cont.Banco.WindowCierreNomina({
                title: 'Pago de n&oacute;mina',
                idmoneda: idmoneda,
                accion: (acc == 'ins') ? 'add' : 'mod',
                listeners: {
                    loadend: function(records, window) {
                        if (records.length == 0) {
                            mostrarMensaje(2, 'No hay solicitud para el pago de n&oacute;mina en esta moneda.<br/>¿Desea realizar el pago manual?', function(btn){
                                if (btn == 'ok') {
                                    tfimporteoper.setDisabled(false);
                                    tfimporteoper.setValue('');
                                    tfimporteoper.focus(true, true);
                                }
                                else {
                                    tfimporteoper.setDisabled(false);
                                    cbmovimientooper.setValue('');
                                    cbmovimientooper.focus(true, true);
                                }
                            });

                            return false;//Cerrar ventana
                        }
                        else {
                            window.gpfechacierre.getColumnModel().setRenderer(2, function(value, metadata, record, rowIndex, colIndex, store) {
                                var idfechacierrenomina = record.data.idfechacierrenomina;
                                var index = stgridoperaciones.find('idfechacierrenomina', idfechacierrenomina);

                                if (index > -1) {
                                    record.data.cargado = 1;
                                    return '<span style="color:green;">Cargado</span>';
                                }
                                else {
                                    record.data.cargado = 0;
                                    return '<span style="color:red;">No cargado</span>';
                                }
                            });

                            return true;//Abrir ventana
                        }
                    },
                    valselected: function(valselected) {
                        if (valselected.cargado) {
                            mostrarMensaje(1, 'La solicitud de pago para n&oacute;mina seleccionada est&aacute; cargada.');
                            return false;
                        }
                        else {
                            idfechacierrenomina = valselected.idfechacierrenomina;

                            tfimporteoper.setValue(valselected.importe);
                            tfimporteoper.setDisabled(true);
                            tfimporteletrasoper.setValue(convertir_a_letras(tfimporteoper.getValue()));
                            activateAddCPAnticipado('op');
                            cbcuentadebitar.focus(true, true);
                            return true;
                        }
                    },
                    close: function() {
                        if (Ext.isEmpty(idfechacierrenomina)) {
                            cbmovimientooper.setValue('');
                        }
                    }
                }
            });
        }
        if (objopersel.signo == 101) {
            mostrarClienteProveedorOper();
        }
        tfimporteoper.maxValue = undefined;
        tfimporteoper.clearInvalid();
    }
}


/*************************************************************************/
/////////////////  funciones Generales////////////////////////////////////
/*************************************************************************/

//Función para activa/desactivar el botón adicionar del cobro o pago anticipado
function activateAddCPAnticipado(operacion) {
    //cpa -> cobro o pago anticipado
    if (operacion == 'cpa') {
        var validcpa = cbmovimientopaa.isValid() && cbcuentadebitarpa.isValid() && tfimportepa.isValid()
                && tfnocontrato.isValid() && tacomentariopa.isValid();

        Ext.getCmp('btnadicionaranticipo').setDisabled(!validcpa);
    }
    else if (operacion == 'op') {
        //op -> otras operaciones
        var validop = cbmovimientooper.isValid() && cbcuentadebitar.isValid() && tfimporteoper.isValid();

        Ext.getCmp('btnadicionaroper').setDisabled(!validop);
    }
}


//  funcion para abrir las ventanas pertinentes, asi como carga de sus datos
function abrirVentana(titulo, op) {
    noWindow = false;//se pone en false para que no permita abrir otra ventana sobre la actual
    switch (op) {
        case 'liq'://Liquidacion
            //  if (!valoresEnVentLiq) { //probar
            // fpliquidacion.getForm().reset();
            //cbmovimientoliq.clearValue();
            // stliquidar.removeAll();
            MostrarEtiquetas(Ext.getBody(), 'Cargando...' /*perfil.etiquetas.lbMsgCargando*/);
            stmovimientoliq.load({
                params: {
                    familia: 1,
                    iddoc: cbtipodoc.getValue(),
                    tipo: cbtipoOpInstr.getValue() ? cbtipoOpInstr.getValue() : 0, // 1-Entrada 2-Salida
                    tipoOperacion: cbtipoOpInstr.getValue()
                            // Tipo:   1->'Cliente', 2->'Proveedor',3->'Persona externa',4->'Trabajador'
                },
                callback: function(r, options, success) {
//                    if (stmovimientoliq.getCount()) {
                    // importe_Y = tfimportetotalliq.getValue(); //duda
                    winliquidacion.setTitle(titulo);
                    winliquidacion.show();
                    winliquidacion.center();
                    winliquidacion.doLayout();
                    winliquidacion.maximize();

                    //Se cargan las liquidaciones de la operación bancaria
                    tfimportetotalliq.setValue('0.00');
                    // tffechaFin.setValue(dfemision.getValue());
                    // tffechaFin.setRawValue(dfemision.getRawValue());

                    tffechaliq.setValue(dfemision.getRawValue());
                    tfmonedaliq.setValue(stmonedatasa.getAt(0).get('moneda'));
                    cagarliquidacion();

                    //para que seleccione por defecto en el caso que contenga un solo elemento
                       if (stmovimientoliq.getCount() == 1) {
                           Ext.getCmp('cbmovimientoliq').setValue(stmovimientoliq.data.items[0].data.idoperacion);
//                            Ext.getCmp('cbmovimientoliq').setRawValue(stmovimientoliq.data.items[0].data.denominacion);
//                            Ext.getCmp('cbmovimientoliq').fireEvent('select', this);
//                            /*se dispara el evento que carga el grid*/
                       }

                    //cbmovimientoliq.focus(false, 10);//se le da el foco al combo de las operaciones

                    stcuentacontliqui.load({
                        params: {
                            idctabancaria: cbcuentabanc.getValue()
                        },
                        callback: function(r, options, success) {
                            //para que seleccione por defecto en el caso que contenga un solo elemento
                            if (stcuentacontliqui.getCount() == 1) {
                                // Ext.getCmp('cbcuentacontliqui').setValue(stcuentacontliqui.data.items[0].data.idcuenta);
                                // Ext.getCmp('cbcuentacontliqui').setRawValue(stcuentacontliqui.data.items[0].data.text);
                            }
                        }
                    });

//                        fiscal();

//                        pagadoOper();//se actualiza el resto
                    //stliquidar.removeAll();// se limpia el grid de las operaciones a liquidar
                    // stliquidaciones.removeAll();//se limpia el grid de las liquidaciones
                    // cbmovimientoliq.reset();//se el combo operaciones
                    //  cbcuentacontliqui.reset();//se limpia el combo cuenta contable
                    //  tfsaldoliquidar.reset();//se limpia el campo saldo a liquidar

//                    }
//                    else {
//                        mostrarMensaje(1, 'No se han configurado operaciones para el tipo de documento seleccionado. Debe seleccionar otro tipo de documento.');
//                        lMasktemp.hide();
//                    }
                }
            });
            lMasktemp.hide();
            break;
        case 'pa'://Pago Anticipado
            cbxbeneficiario.clearInvalid();
            Ext.getCmp('btnadicionaranticipo').setDisabled(true);
            fppagoanticipado.getForm().reset();
            MostrarEtiquetas(Ext.getBody(), 'Cargando...' /*perfil.etiquetas.lbMsgCargando*/);
            stmovimientopa.load({
                params: {
                    familia: 2,
                    iddoc: cbtipodoc.getValue(),
                    tipo: cbtipoOpInstr.getValue() ? cbtipoOpInstr.getValue() : 0, // 1->'Cliente', 2->'Proveedor',3->'Persona externa',4->'Trabajador'
                    tipoOperacion: cbtipoOpInstr.getValue()

                },
                callback: function(r, options, success) {
                    if (stmovimientopa.getCount()) {
                        winpanticipado.setTitle(titulo);
                        winpanticipado.show();
                        winpanticipado.center();
                        winpanticipado.maximize();
                        winpanticipado.doLayout();

                        //para que seleccione por defecto en el caso que contenga un solo elemento
                        if (stmovimientopa.getCount() == 1) {
                            Ext.getCmp('cbmovimientopaa').setValue(stmovimientopa.data.items[0].data.idoperacion);
                            Ext.getCmp('cbmovimientopaa').setRawValue(stmovimientopa.data.items[0].data.denominacion);
                            Ext.getCmp('cbmovimientopaa').fireEvent('select', this);
                            /*se dispara el evento que carga el grid*/
                        }
                        tfimportetotalant.setValue('0.00');
                        //se le da el foco al combo de la operacion
                        cbmovimientopaa.focus(false, 10);
                        //  pagadoOper();//se actualiza el resto /duda
                        if (acc == 'ins')
                            tfmoneda.setValue(stmonedatasa.getAt(0).get('moneda'));

                        //se cargan las ctas contables asociadas a la cuenta bancaria
                        stcuentadebitarpa.load({
                            params: {
                                idctabancaria: cbcuentabanc.getValue()
                            },
                            callback: function(r, options, success) {
                                //para que seleccione por defecto en el caso que contenga un solo elemento
                                if (stcuentadebitarpa.getCount() == 1) {
                                    Ext.getCmp('cbcuentadebitarpa').setValue(stcuentadebitarpa.data.items[0].data.idcuenta);
                                    Ext.getCmp('cbcuentadebitarpa').setRawValue(stcuentadebitarpa.data.items[0].data.text);
                                }
                            }
                        });

                        //Se cargan las cuentas contables de cobro o pago anticipado asociadas a los clientes o
                        //proveedores respectivamente
                        stcuentaacreditarpa.load({
                            params: {
                                tipooperacion: cbtipoOpInstr.getValue(),
                                idmoneda: stmonedatasa.getAt(0).get('idmoneda'),
                                idclienteproveedor: cbxbeneficiario.getValue()
                            },
                            callback: function(r, options, success) {
                                //para que seleccione por defecto en el caso que contenga un solo elemento
                                if (stcuentaacreditarpa.getCount() == 0) {
                                    var textc = (cbtipoOpInstr.getValue() == 2) ? 'El proveedor seleccionado' : 'El cliente seleccionado';
                                    var textcp = (cbtipoOpInstr.getValue() == 2) ? 'Pago Anticipado con la moneda ' : 'Cobro Anticipado con la moneda ';
                                    mostrarMensaje(1, textc + ' no tiene asociada la cuenta contable de ' + textcp + stmonedatasa.getAt(0).get('moneda'));
                                }
                                else if (stcuentaacreditarpa.getCount() == 1) {
                                    Ext.getCmp('cbcuentaacreditarpa').setValue(stcuentaacreditarpa.data.items[0].data.idcuenta);
                                    Ext.getCmp('cbcuentaacreditarpa').setRawValue(stcuentaacreditarpa.data.items[0].data.text);
                                }
                            }
                        });

                        if (acc === 'mod') {
                            cargargridPanticipado();
                            pagadoOper('pa');//se actualiza el resto
                            tfmoneda.setValue(stinstrumentobanc.data.items[idgridI].get('moneda'));
                        }

                        lMasktemp.hide();
                        //actualiza el campo importe total de los anticipos
                        importeTotalAnticipos();
                        // pagadoOper();
                    }
                    else {
                        mostrarMensaje(1, 'No se han configurado operaciones para el tipo de documento seleccionado. Debe seleccionar otro tipo de documento.');
                        lMasktemp.hide();
                    }
                }
            });
            break;
        case 're'://Reembolso
            if (!valoresEnVentRe) {
                fpreembolso.getForm().reset();
                MostrarEtiquetas(Ext.getBody(), 'Cargando...' /*perfil.etiquetas.lbMsgCargando*/);
                stmovimientoliq.load({
                    params: {
                        familia: 3,
                        iddoc: cbtipodoc.getValue(),
                        tipo: cbtipoOpInstr.getValue() ? cbtipoOpInstr.getValue() : 0,
                        tipoOperacion: cbtipoOpInstr.getValue()

                    },
                    callback: function(r, options, success) {
                        if (stmovimientoliq.getCount()) {
                            if (acc == 'mod') {
                                // Buscar los datos para el modificar...pendiente!!!
                                lMasktemp.hide();
                            }
                            else {
                                if (cbrecibidopor.getValue()) {
                                    cbxfcajarev.setDisabled(true);
                                    tffondorev.setDisabled(true);
                                    tfmonedarev.setDisabled(true);
                                    tfimporterev.setDisabled(true);
                                    gpreembolso.setDisabled(true);
                                    tfimporterev.reset();
                                    tffondorev.reset();
                                    cbxfcajarev.reset();
                                    streembolso.removeAll();
                                    tfmonedarev.setValue(stmonedatasa.getAt(0).get('moneda'));

                                    if (cbrecibidopor.getValue()) {
                                        if (strecibidopor.getAt(0).get('tipo') == 5) {
                                            stcaja.load({
                                                callback: function(r, options, success) {
                                                    tfimporterev.setValue('0.00');
                                                    if (stcaja.getCount()) {
                                                        //cbxfcajarev.enable();
                                                        cbxfcajarev.setValue(cbrecibidopor.getValue());
                                                        cbxfcajarev.fireEvent('select', this.cbxfcajarev);
                                                    }
                                                    else
                                                        mostrarMensaje(1, 'No existen cajas para la entidad seleccionada.');
                                                }

                                            });
                                        } else {
                                            mostrarMensaje(1, 'Debe seleccionar una caja para que reciba el reembolso.');
                                            lMasktemp.hide();
                                            return;
                                        }
                                    }
                                    lMasktemp.hide();
                                    importe_Y = tfimporterev.getValue();
                                    winreembolso.setTitle(titulo);
                                    winreembolso.show();
                                    winreembolso.center();
                                }
                            }
                        }
                        else {
                            mostrarMensaje(1, 'No se han configurado operaciones para el tipo de documento seleccionado. Debe seleccionar otro tipo de documento.');
                            lMasktemp.hide();
                        }
                    }
                });
            }
            else {
                stmovimientoliq.load({
                    params: {
                        familia: 3,
                        iddoc: cbtipodoc.getValue(),
                        tipo: cbtipoOpInstr.getValue() ? cbtipoOpInstr.getValue() : 0, // 1->'Cliente', 2->'Proveedor',3->'Persona externa',4->'Trabajador'
                        tipoOperacion: cbtipoOpInstr.getValue()
                    }
                });
                importe_Y = tfimporterev.getValue();
                winreembolso.setTitle(titulo);
                lMasktemp.hide();
                winreembolso.show();
                winreembolso.center();
            }
            break;
        case 'op'://Operaciones
            //if (!valoresEnVentOp){
            //fpoperaciones.getForm().reset();
            Ext.getCmp('btnadicionaroper').setDisabled(true);
            MostrarEtiquetas(Ext.getBody(), 'Cargando...');
            stmovimientooper.reload({
                params: {
                    familia: 4,
                    iddoc: cbtipodoc.getValue(),
                    tipo: cbtipoOpInstr.getValue() ? cbtipoOpInstr.getValue() : 0,
                    tipoOperacion: cbtipoOpInstr.getValue()
                },
                callback: function(r, options, success) {
                    if (stmovimientooper.getCount()) {
                        winoperaciones.setTitle(titulo);
                        winoperaciones.show();
                        winoperaciones.maximize();
                        winoperaciones.doLayout();

                        //para que seleccione por defecto en el caso que contenga un solo elemento
                        if (stmovimientooper.getCount() == 1) {
                            Ext.getCmp('cbmovimientooper').setValue(stmovimientooper.data.items[0].data.idoperacion);
                            Ext.getCmp('cbmovimientooper').setRawValue(stmovimientooper.data.items[0].data.denominacion);
                            Ext.getCmp('cbmovimientooper').fireEvent('select', this);//se dispara el evento que carga el grid
                        }
                        cbmovimientooper.focus(false, 10); //se le da el foco al combo de las operaciones
                        tfimportetotaloper.setValue('0.00');
                        if (acc == 'ins') {
                            tfmonedaoper.setValue(stmonedatasa.getAt(0).get('moneda'));
                            tfimporteoper.setDisabled(false);
                            cargargridOper();
                        }
                        else if (acc === 'mod') {  // Buscar los datos para el modificar
                            cargargridOper();
                            pagadoOper('op');//se actualiza el resto
                            //importeTotalOperaciones();
                            tfmonedaoper.setValue(stinstrumentobanc.data.items[idgridI].get('moneda'));
                        }
                        lMasktemp.hide();
                        importeTotalOperaciones();
                        //pagadoOper();
                    }
                    else {
                        mostrarMensaje(1, 'No se han configurado operaciones para el tipo de documento seleccionado. Debe seleccionar otro tipo de documento.');
                        lMasktemp.hide();
                    }
                } // calback
            });
            stcuentadebitar.load({//se cargan las ctas contables
                params: {
                    idctabancaria: cbcuentabanc.getValue()
                },
                callback: function(r, options, success) {
                    /*para que seleccione por defecto en el caso que contenga un solo elemento*/
                    if (stcuentadebitar.getCount() == 1) {
                        Ext.getCmp('cbcuentadebitar').setValue(stcuentadebitar.data.items[0].data.idcuenta);
                        //Ext.getCmp('cbcuentadebitar').setRawValue(stcuentadebitar.data.items[0].data.text);
                    }
                }
            });
            break;
        case 'inst':
            wininstbanc.setTitle(titulo);
            cbEspecialidad2.reset();//se limpia el combo especialidad
            prepareGrids();//se borran los datos de todos los grids estaticos
//            Ext.getCmp('tpoperInstrumento').setActiveTab('taboper2');
//            Ext.getCmp('tpoperInstrumento').setActiveTab('taboper1');
            if (acc == 'mod') {
                cargardatosmodificarinst();
            }
            else {
                Ext.getCmp('tpoperInstrumento').setActiveTab('taboper1');
            }
            wininstbanc.show();
            wininstbanc.maximize();
            wininstbanc.doLayout();
            wininstbanc.center();
            // new Ext.FormSteps(fpadicionarinst.items.items, wininstbanc.buttons);
            break;
    }
}
function cargargridOper() {
    stgridoperaciones.removeAll();
    //se crea el objeto record de la otra oper y se inserta en el grid operaciones
    recOper = new Ext.data.Record.create([{
            name: 'idoperacion'
        }, {
            name: 'descoperacion'
        }, {
            name: 'idctacontable'
        }, {
            name: 'ctacontable'
        }, {
            name: 'ctabancaria'
        }, {
            name: 'importe'
        }, {
            name: 'idctaoperacion'
        }, {
            name: 'signo'
        }, {
            name: 'idctacontrapartida'
        }, {
            name: 'ctacontrapartida'
        }, {
            name: 'idmovimientocaja'
        }, {
            name: 'idfechacierrenomina'
        }, {
            name: 'idanticipo'
        },{
            name: 'idclienteproveedor'
        },{
            name: 'clienteproveedor'
        },{
            name: 'numerosoperenzona'
        }
    ]);
    arroperacioninst = creaDataOperaciones(sttaboperaciones.data);//se actualiza el array con los datos del grid

    var moneda = (acc == 'mod') ? stinstrumentobanc.data.items[idgridI].get('moneda') : stmonedatasa.getAt(0).get('moneda');
    for (var o = 0; o < arroperacioninst.length; o++) {
        //se crea el record de la oper
        newReco = new recOper({
            idoperacion: arroperacioninst[o][0],
            descoperacion: arroperacioninst[o][1],
            idctacontable: arroperacioninst[o][2],
            ctacontable: arroperacioninst[o][3],
            ctabancaria: arroperacioninst[o][4],
            importe: arroperacioninst[o][6],
            idctaoperacion: arroperacioninst[o][7],
            signo: arroperacioninst[o][9],
            idctacontrapartida: arroperacioninst[o][10],
            ctacontrapartida: arroperacioninst[o][11],
            moneda: moneda,
            idmovimientocaja: arroperacioninst[o][12],
            idfechacierrenomina: arroperacioninst[o][13],
            idanticipo: arroperacioninst[o][14],
            idclienteproveedor: arroperacioninst[o][15],
            clienteproveedor: arroperacioninst[o][16],
            numerosoperenzona: arroperacioninst[o][17]
        });
        //se inserta el record de la oper en el tab operaciones
        stgridoperaciones.add(newReco);
    }
}

function cargargridPanticipado() {
    stgridanticipo.removeAll();
    //se crea el objeto record del anticipo y se inserta en el grid anticipo
    recAnt = new Ext.data.Record.create([{
            name: 'nocontrato'
        }, {
            name: 'idctacontable'
        }, {
            name: 'ctacontable'
        }, {
            name: 'comentario'
        }, {
            name: 'importe'
        }, {
            name: 'idoperacionpa'
        }, {
            name: 'descoperacionpa'
        }, {
            name: 'idctacontrapartida'
        }, {
            name: 'nombrectacontrapartida'
        }
    ]);
    //se actualiza el array con los datos del grid
    arroanticipoinst = creaDataAnticipos(sttabanticipo.data);
    for (var a = 0; a < arroanticipoinst.length; a++) {
        //se crea el record de la anticipo
        newReca = new recAnt({
            //            nocontrato: arroanticipoinst[a].nocontrato,
            //            idctacontable:arroanticipoinst[a].idctacontable,
            //            ctacontable:arroanticipoinst[a].ctacontable,
            //            comentario:arroanticipoinst[a].comentario,
            //            importe:arroanticipoinst[a].importe,
            //            idoperacionpa:arroanticipoinst[a].idoperacionpa,
            //            descoperacionpa:arroanticipoinst[a].descoperacionpa,
            //            idctaoperacionpa:arroanticipoinst[a].idctaoperacionpa
            nocontrato: arroanticipoinst[a][0],
            idctacontable: arroanticipoinst[a][1],
            ctacontable: arroanticipoinst[a][2],
            comentario: arroanticipoinst[a][3],
            importe: arroanticipoinst[a][4],
            idoperacionpa: arroanticipoinst[a][5],
            descoperacionpa: arroanticipoinst[a][6],
            idctaoperacionpa: arroanticipoinst[a][7],
            idctacontrapartida: arroanticipoinst[a][9],
            nombrectacontrapartida: arroanticipoinst[a][10]
        });
        stgridanticipo.add(newReca);
    }
}

//estafuncion es para recoger los datos de cada ventana en un arreglo
function getDatosOperacion() {
    var cant = -1;//saber la cantidad de array que se generan
    var arrMovimiento = new Array();
    if (arroperliquidacion.length) {
        var arrOp = new Array();//almacena las operaciones realizadas
        arrOp[0] = 1;//tipo de operacion (liquidacion)
        //arrOp[1] = cbmovimientoliq.getValue();// operaciones del formulario liquidar
        arrOp[2] = tfimportetotalliq.getValue();//suma todos los campos del importe a liquidar
        arrOp[3] = arroperliquidacion; //arreglo con los valores de los registro del grid liquidar
        cant += 1;
        arrMovimiento[cant] = arrOp;//se agrega la liquidacion al array de operaciones
    }

    if (arroanticipoinst.length) {
        var arrOp = new Array();//almacena las operaciones realizadas
        arrOp[0] = 2;   //tipo de operacion (anticipo)
        // arrOp[1] = cbmovimientopaa.getValue();// movimiento del pago anticipado
        arrOp[2] = arroanticipoinst;//operaciones de anticipos realizados
        cant += 1;
        arrMovimiento[cant] = arrOp;
    }

    if (arroperacioninst.length) {
        var arrOp = new Array();//almacena las operaciones realizadas
        arrOp[0] = 4;//tipo de operacion (operaciones)
        //arrOp[1] = cbmovimientooper.getValue();//id  operacion a realizar
        arrOp[2] = arroperacioninst;//operaciones realizadas
        cant += 1;
        arrMovimiento[cant] = arrOp;
    }
    return arrMovimiento;
}

function cargarOperac() {
    MostrarEtiquetas(Ext.getBody(), 'Cargando...' /*perfil.etiquetas.lbMsgCargando*/); // Mostrar mensaje de espera
}

/*
 * limpia todos los grids antes de adicionar o modificar
 * @returns void
 */
function prepareGrids() {
    arrliquidacion = new Array();
    arroperliquidacion = new Array();
    arroperliquidacionaux = new Array();
    arrtabliquidacion = new Array();
    arroperacioninst = new Array();
    arroanticipoinst = new Array();
}

//deshabilita las operaciones segun el importe distribuido
function habilitaroperacion(habilitar) {
//    if (valoresEnVentLiq || valoresEnVentPa || valoresEnVentOp || valoresEnVentRe) {
//        cbxbeneficiario.setDisabled(true);
//
//        btnbeneficiario.setDisabled(true);
//    }
//    else {
//        cbxbeneficiario.setDisabled(false);
//        btnbeneficiario.setDisabled(false);
//    }
    /* if(habilitar){
     if(valoresEnVentRe)
     {
     /* rbtnliquidar.setDisabled(true);
     rbtnpagoant.setDisabled(true);
     rbtnoperacion.setDisabled(true);
     rbtnreembolso.setDisabled(false);*/
    /*    Ext.getCmp('taboper1').setDisabled(true);
     Ext.getCmp('taboper2').setDisabled(true);
     Ext.getCmp('taboper3').setDisabled(true);
     //Ext.getCmp('tpoperInstrumento').setActiveTab(0);
     }
     else
     {
     /* rbtnreembolso.setDisabled(true);
     rbtnliquidar.setDisabled(false);
     rbtnpagoant.setDisabled(false);
     rbtnoperacion.setDisabled(false);*/
    /*      Ext.getCmp('taboper1').setDisabled(false);
     Ext.getCmp('taboper2').setDisabled(false);
     Ext.getCmp('taboper3').setDisabled(false);
     //Ext.getCmp('tpoperInstrumento').setActiveTab(0);
     }
     }
     else
     {
     if(valoresEnVentLiq || valoresEnVentPa || valoresEnVentOp)
     {
     /*rbtnliquidar.setDisabled(false);
     rbtnpagoant.setDisabled(false);
     rbtnoperacion.setDisabled(false);
     rbtnreembolso.setDisabled(true);*/
    /*       Ext.getCmp('taboper1').setDisabled(false);
     Ext.getCmp('taboper2').setDisabled(false);
     Ext.getCmp('taboper3').setDisabled(false);
     //Ext.getCmp('tpoperInstrumento').setActiveTab(0);
     }
     else
     {
     soloLectura=false;
     /*rbtnreembolso.setDisabled(false);
     rbtnliquidar.setDisabled(false);
     rbtnpagoant.setDisabled(false);
     rbtnoperacion.setDisabled(false);*/
    /*      Ext.getCmp('taboper1').setDisabled(false);
     Ext.getCmp('taboper2').setDisabled(false);
     Ext.getCmp('taboper3').setDisabled(false);
     //Ext.getCmp('tpoperInstrumento').setActiveTab(0);
     }
     }*/
}

function desabilitaBeneficiario() {
    if (!valoresEnVentRe && !cbxbeneficiario.disabled /*&& rbtnreembolso.getValue()*/)  // habilitado y vacio  : pongo disable
    {
        //Inabilitando campos
        cbxbeneficiario.setDisabled(true);
        btnbeneficiario.setDisabled(true);
        cbxbeneficiario.clearInvalid();
        cbxbeneficiario.clearValue();
        stbeneficiario.removeAll();
    }
    return;
}


//devuelve si es letra o no
function verLetra() {
    var cadena = cbtipodoc.getRawValue();
    var letra = cadena.substr(0, 5);
    if (letra == "Letra")
        return 1;
    else
        return 0;
}

//carga los tipos de documentos segun entrada/salida
function cargadatosiniciales(entradasalida) {
    limpiardatos();
    cbtipodoc.reset();
    MostrarEtiquetas(Ext.getBody(), 'Cargando tipos de documento...');// Mostrar mensaje de espera
    sttipodoc.load({
        params: {
            entrada: (entradasalida) ? entradasalida : cbtipoOpInstr.getValue()
        }, // 1-Entrada(cobro) 2-Salida(pago)
        callback: function(r, options, success) {
            lMasktemp.hide();  // Ocultar mensaje
            if (sttipodoc.getCount() == 0) {
                if (cbtipoOpInstr.getValue() == 1)
                    mostrarMensaje(1, "No se puede adicionar un instrumento bancario porque no existen documentos de entrada configurados para el subsistema.");
                else
                    mostrarMensaje(1, "No se puede adicionar un instrumento bancario porque no existen documentos de salida configurados para el subsistema.");
                cbtipoOpInstr.clearValue();
                cbtipoOpInstr.focus();
                return false;
            }
            else {
                cbtipodoc.enable();
                cbtipodoc.focus();
                cbtipodoc.isValid();
                tacomentario.isValid();
            }
            if (sttipodoc.getCount() == 1) {// para que carge por defecto  si  tiene un solo  elemento
                Ext.getCmp('cbtipodoc').setValue(sttipodoc.data.items[0].data.iddoc);
                Ext.getCmp('cbtipodoc').setRawValue(sttipodoc.data.items[0].data.denominacion);
                Ext.getCmp('cbtipodoc').fireEvent('select', this);
                /*se dispara el evento que carga el grid*/
            }
        }
    });
}

/**
 * Se obtienen los datos necsarios para configurar el preView
 **/
function configurarPreView() {

    lMaskcont = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    lMaskcont.show();
    instance = new PagingToolbarSelections({
        'selections': Ext.getCmp('gpinstrumentobanc').getSelectionModel().getSelections(),
        'activePage': Ext.getCmp('gpinstrumentobanc').getBottomToolbar().getPageData().activePage
    });
    arreglocant = instance.getSelectionsOnArray(arrayValues);
    //se valida que existan elementos seleccionados
    if (arreglocant.length > 0) {
        //Cuentas contables****************
        var ctascontables;
        var arridctasbancarias = new Array();
        var responsectascontables;
        for (i = 0; i < arreglocant.length; i++) {
            arridctasbancarias.push(arreglocant[i].idcuentabancaria);
        }
        arridctasbancarias = Ext.encode(arridctasbancarias);

        Ext.Ajax.request({
            url: 'cargarctascontver',
            method: 'POST',
            params: {
                arridctasbancarias: arridctasbancarias
            },
            callback: function(options, success, response) {
                lMaskcont.hide();
                if (response.responseText) {
                    responsectascontables = Ext.decode(response.responseText);

                    var preview = new Array();
                    if (arreglocant.length > 0) {
                        for (var i = 0; i < arreglocant.length; i++) {
                            ctascontables = responsectascontables[i].contables;

                            preview.push([
                                {
                                    'numero': arreglocant[i].numerodocumento
                                }, // 0

                                {
                                    'tipodoc': arreglocant[i].denominacion
                                }, // 1

                                {
                                    'fecha': arreglocant[i].fechacreacion.format('d/m/Y')
                                }, // 2

                                {
                                    'estado': arreglocant[i].estado
                                }, // 3

                                {
                                    'importemo': formatoMonedaABS(arreglocant[i].importemo)
                                }, // 4

                                {
                                    'moneda': arreglocant[i].moneda
                                }, // 5

                                {
                                    'cuentab': arreglocant[i].cuentabancaria
                                }, // 6

                                {
                                    'solicitud': rendereame(arreglocant[i].idsolicitud, 1)
                                }, // 7

                                {
                                    'cargainicial': rendereame(arreglocant[i].cargainicial)
                                }, // 8

                                {
                                    'recibe': arreglocant[i].recibe
                                }, // 9     Este hay que analizarlo porque no es obligado en algunos casos

                                {
                                    'comentario': arreglocant[i].comentario
                                }, // 10

                                {
                                    'estadocuenta': arreglocant[i].estadocuenta
                                }, // 11

                                {
                                    'numeroestadocuenta': arreglocant[i].numeroestadocuenta
                                }, // 12

                                {
                                    'fechaestadocuenta': arreglocant[i].fechaestadocuenta
                                }, // 13
                                {
                                    'descripcionespecialidad': arreglocant[i].descripcionespecialidad
                                            //14
                                },
                                {
                                    'ctascontables': ctascontables
                                            //15
                                },
                                {
                                    'beneficiario': arreglocant[i].beneficiario
                                            //16
                                },
                                {
                                    'tipooperacion': arreglocant[i].tipooperacion
                                            //17
                                }
                            ]);
                        }
                        //configuramos la informacion Html que queremos mostrar
                        HTMlConfigPreView(preview);
                    } else
                        mostrarMensaje(1, 'Debe seleccionar un instrumento para ver sus detalles.');
                }
                else
                    mostrarMensaje(1, 'Ha ocurrido un error en el sistema.');
            }
        });
        //**************************************
    }

    //se oculta la mascara
    else {
        lMaskcont.hide();
        mostrarMensaje(1, 'Debe seleccionar al menos un instrumento para ver sus detalles.');
    }

}

/**
 *Se configura la informacion Html que se va a mostrar
 **/

var gpImprimir;

function HTMlConfigPreView(previewHTML) {
    var infoHTML = '';

    /*Imprimir*/
    var reader = new Ext.data.ArrayReader({}, [
        {
            name: 'fechacreacion',
            dateFormat: 'erpFecha'
        },
        {
            name: 'numerodocumento',
            type: 'string'
        },
        {
            name: 'denominacion',
            type: 'string'
        }, // Tipo documento
        {
            name: 'importemo',
            type: 'float'
        }, {
            name: 'importemb',
            type: 'float'
        },
        {
            name: 'comentario',
            type: 'string'
        },
        {
            name: 'idsolicitud'
        },
        {
            name: 'fecharecepcion'
        },
        {
            name: 'fechaemision'
        },
        {
            name: 'idelaboradopor'
        },
        {
            name: 'idestadodoccomunfinanzas'
        },
        {
            name: 'estado',
            type: 'string'
        },
        {
            name: 'idcuentabancaria',
            type: 'int'
        },
        {
            name: 'cuentabancaria',
            type: 'string'
        },
        {
            name: 'idmoneda'
        },
        {
            name: 'moneda',
            type: 'string'
        },
        {
            name: 'idtipodocumento'
        },
        {
            name: 'iddocumento',
            type: 'string'
        },
        {
            name: 'idinstrumentobancario',
            type: 'string'
        },
        {
            name: 'cargainicial'
        },
        {
            name: 'idbeneficiario',
            type: 'int'
        },
        {
            name: 'beneficiario',
            type: 'string'
        },
        {
            name: 'tipobeneficiario'
        },
        {
            name: 'idrecibido',
            type: 'int'
        },
        {
            name: 'recibe',
            type: 'string'
        },
        {
            name: 'tiporecibe'
        },
        {
            name: 'estadocuenta',
            type: 'boolean'
        },
        {
            name: 'numeroestadocuenta'
        },
        {
            name: 'fechaestadocuenta'
        }
    ]);

    var stImprimir = new Ext.data.Store({
        id: 'stImprimir',
        reader: reader
    });

    var colModel = new Ext.grid.ColumnModel([
        {
            header: 'FECHA',
            width: 100,
            sortable: true,
            dataIndex: 'fechacreacion'
        },
        {
            header: 'NO. DOCUMENTO',
            width: 100,
            sortable: true,
            dataIndex: 'numerodocumento'
        },
        {
            header: 'TIPO DOCUMENTO',
            width: 200,
            sortable: true,
            dataIndex: 'denominacion'
        },
        {
            header: 'IMPORTE',
            width: 100,
            sortable: true,
            dataIndex: 'importemo',
            align: 'right'
        },
        {
            header: 'ESTADO',
            width: 120,
            sortable: true,
            dataIndex: 'estado',
            align: 'center'
        },
        {
            header: 'COMENTARIO',
            width: 100,
            sortable: true,
            dataIndex: 'comentario'
        },
        {
            header: 'MONEDA',
            width: 100,
            sortable: true,
            dataIndex: 'moneda'
        },
        {
            header: 'CUENTA BANCARIA',
            width: 100,
            sortable: true,
            dataIndex: 'cuentabancaria'
        },
        /*{
            header: 'RECIBIDO POR',
            width: 100,
            sortable: true,
            dataIndex: 'recibe'
        },*/
        {
            header: 'ACREEDOR/DEUDOR',
            width: 100,
            sortable: true,
            dataIndex: 'beneficiario'
        }
    ]);

    gpImprimir = new Ext.grid.GridPanel({
        id: 'gpImprimir',
        frame: true,
        layout: 'fit',
        autoScroll: false,
        iconCls: 'icon-grid',
        region: 'center',
        store: stImprimir, //Este formato se establece en printer.js => style: "font-size: 9px; font-family:arial, sans-serif;",
        cm: colModel
    });

    for (var i = 0; i < previewHTML.length; i++) {

        var record = Ext.data.Record.create([
            {
                name: 'fechacreacion'
            },
            {
                name: 'numerodocumento'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'importemo'
            },
            {
                name: 'estado'
            },
            {
                name: 'comentario'
            },
            {
                name: 'moneda'
            },
            {
                name: 'cuentabancaria'
            },
            {
                name: 'recibe'
            },
            {
                name: 'estadocuenta'
            },
            {
                name: 'numeroestadocuenta'
            },
            {
                name: 'fechaestadocuenta'
            },
            {
                name: 'beneficiario'
            }
            ]);

        var valores = new record({
            fechacreacion: previewHTML[i][2]['fecha'],
            numerodocumento: previewHTML[i][0]['numero'],
            denominacion: previewHTML[i][1]['tipodoc'],
            importemo: previewHTML[i][4]['importemo'],
            estado: previewHTML[i][3]['estado'],
            comentario: previewHTML[i][10]['comentario'],
            moneda: previewHTML[i][5]['moneda'],
            cuentabancaria: previewHTML[i][6]['cuentab'],
            //recibe: previewHTML[i][9]['recibe'],
            recibe: previewHTML[i][16]['beneficiario'],
            estadocuenta: previewHTML[i][11]['estadocuenta'],
            numeroestadocuenta: previewHTML[i][12]['numeroestadocuenta'],
            fechaestadocuenta: previewHTML[i][13]['fechaestadocuenta'],
            beneficiario: previewHTML[i][16]['beneficiario']
        });

        stImprimir.add(valores);


        infoHTML += '<div style="padding:12px; background:#E7F1FE"; "font-size: 12pt";><p>'
                + '<b>N&uacute;mero : </b> ' + previewHTML[i][0]['numero'] + "&nbsp;&nbsp;&nbsp;&nbsp;"
                + '<b>Tipo documento: </b> ' + previewHTML[i][1]['tipodoc'] + "&nbsp;&nbsp;&nbsp;&nbsp;"
                + '<b>Fecha creaci&oacute;n: </b>' + previewHTML[i][2]['fecha'] + '</p></div>';

        infoHTML += '<div style="padding:11px;background:#F1F1F1";"font-size: 11pt";><p><b>'
                + 'Otros datos: ' + '</b></p></div>';

        infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- <b>Estado: </b>" + previewHTML[i][3]['estado'] + '</p></div>';
        infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- <b>Importe: </b>" + previewHTML[i][4]['importemo'] + '</p></div>';
        infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- <b>Moneda: </b>" + previewHTML[i][5]['moneda'] + '</p></div>';
        infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- <b>Cuenta Bancaria: </b>" + previewHTML[i][6]['cuentab'] + '</p></div>';
        //infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- <b>Solicitud asociada: </b>" + previewHTML[i][7]['solicitud'] + '</p></div>';
        infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- <b>Tipo operaci&oacute;n: </b>" + previewHTML[i][17]['tipooperacion'] + '</p></div>';
        infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- <b>De carga inicial: </b>" + previewHTML[i][8]['cargainicial'] + '</p></div>';
        //infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- <b>Recibido por: </b>" + previewHTML[i][9]['recibe'] + '</p></div>';
        infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- <b>Acreedor/Deudor: </b>" + previewHTML[i][16]['beneficiario'] + '</p></div>';
        infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- <b>Especialidad: </b>" + previewHTML[i][14]['descripcionespecialidad'] + '</p></div>';
        infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- <b>Comentario: </b>" + previewHTML[i][10]['comentario'] + '</p></div>';
        if (previewHTML[i][11]['estadocuenta']) {
            infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- <b>N&uacute;mero estado de cuenta: </b>" + previewHTML[i][12]['numeroestadocuenta'] + '</p></div>';
            infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- <b>Fecha estado de cuenta: </b>" + previewHTML[i][13]['fechaestadocuenta'] + '</p></div>';
        }
        //Cuentas contables********************************
        infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- <b>Cuentas contables: </b>" + '</p></div>';
        var cuentascontables = previewHTML[i][15]['ctascontables'];
        if (cuentascontables)
            for (var k = 0; k < cuentascontables.length; k++)
                infoHTML += '<div  style="font-size: 10pt;margin-left:20px;"><p>' + "&nbsp;&nbsp;- " + cuentascontables[k] + '</p></div>';
        else
            infoHTML += '<div  style="font-size: 10pt;margin-left:20px;"><p>' + "&nbsp;&nbsp;- " + 'No tiene cuentas contables' + '</p></div>';
    }
    /*creamos la ventana pasandole la informacion a mostrar Html*/
    crearPreView(infoHTML);
}

var winVerInstrumentos, pPreView;
/**
 *Se crean los componentes del preView que se van a mostrar
 Para Imprimir tambien
 **/
function crearPreView(infoHtml) {
    noWindow = false;//se pone en false para indicar que la ventana fue abierta
    //---------------------- Ventana 2 --------------------------------------------------//
    if (!winVerInstrumentos) {
        //------------------- botones preview ----------------------------------------------------//
        btnImprimir = new Ext.Button({
            disabled: false,
            id: 'btnImprimir',
//            icon: perfil.dirImg + 'imprimir.png',
            iconCls: 'vistaprevia',
            text: 'Vista previa',
            tooltip: 'Vista previa',
            handler: function() {
                //basic_printGrid();
                cargaDatosGlobales();
            }
        });

        btnCerrar2 = new Ext.Button({
            disabled: false,
            id: 'btnCerrar2',
//            icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            handler: function() {
                winVerInstrumentos.hide();
            }
        });
        //-----------------------------------------------------------------------------------------//

        //------------------- panel preview ----------------------------------------------------//

        pPreView = new Ext.Panel({
            region: 'center',
            id: "panelreporte",
            html: infoHtml,
            autoScroll: true
        });

        //-----------------------------------------------------------------------------------------//
        winVerInstrumentos = new Ext.Window({
            autoValidate: false,
            constrain: true,
            title: 'Detalles de selecci&oacute;n',
            id: 'winVerInstrumentos',
            layout: 'border',
            width: '60%',
            height: 500,
            modal: true,
            closeAction: 'hide',
            resizable: true,
            tbar: [btnImprimir],
            items: [pPreView],
            buttons: [btnCerrar2],
            listeners: {
                hide: function(Grid, rowIndex, e) {
                    noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                }
            }

        });

    }
    winVerInstrumentos.show();
    winVerInstrumentos.center();
    //alert(infoHtml);

    templaterep = new Ext.XTemplate(infoHtml);
    templaterep.overwrite(Ext.getCmp('panelreporte').body, {});
// overwrite(panel.body, data);
// winVerInstrumentos.doLayout();
}

// example of custom renderer function
function rendereame(val, solicitud) {
    if (solicitud == 1) {
        if (val > 0)
            return val;
        else
            return '<span style="color:green;"><b> No </b></span>';
    }
    else {
        if (val < 1) {
            return '<span style="color:green;"><b> No </b></span>';
        } else if (val == 1) {
            return '<span style="color:red;"><b> Si </b></span>';
        }
    }
}

//funcion para que busque al dar ENTER sobre los campos del formulario buscar
function BuscarconEnter(eventoObject) {
    if (eventoObject === 13)
        buscar();
}

//busca los instrumentos segun los criterios especificados en el formulario de busqueda
function buscar() {
    clearFilter = false;
    stinstrumentobanc.reload({
        params: {
            start: 0,
            limit: 20
        },
        callback: function(r, options, success) {
            Ext.getCmp('winbuscarinstrumento').hide();
            lMaskBuscar.hide();
            if (stinstrumentobanc.getCount() === 0) {
                mostrarMensaje(1, "No existen datos que se correspondan con los criterios de b\xFAsqueda especificados.");
            }
        }
    });
}


function cargaDatosGlobales() {
    Ext.Ajax.request({
        url: 'buscarDatosGlobales',
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.datos['fecha']) {
                fechaactual = responseData.datos['fecha'];
                //dfemision.setMaxValue(responseData.fechafin);  //No se restringe la fecha de fin
                //dfemision.setMinValue(responseData.fechai);
                nameperiodo = responseData.datos['periodo'];
                nameentidad = (responseData.datos['denomentidad']) ? responseData.datos['denomentidad'] : 'No definido';
                usuario = responseData.datos['usuario'];
                nombreusuario = responseData.datos['nombreuser'];
                cargo = responseData.datos['cargo'];
                namejerc = responseData.datos['ejercicio'];
                v_fechainicio = responseData.datos['fechai'];
                v_fechafin = responseData.datos['fechafin'];
                telf = (responseData.datos['telefonoentidad']) ? responseData.datos['telefonoentidad'] : 'No tiene';
                direc = (responseData.datos['direccionentidad']) ? responseData.datos['direccionentidad'] : 'No tiene';
                email = (responseData.datos['correoentidad']) ? responseData.datos['correoentidad'] : 'No tiene';
                logo = responseData.datos['logo'];
                basic_printGrid();
            } else
                mostrarMensaje(1, 'No se encontraron datos del per&iacute;odo para la entidad seleccionada.');
            return true;
        }
    }); // ajax request fecha y datos globales
}

//impresionvc
var fecha = new Date();
var dia = fecha.getDate();
var mes = fecha.getMonth() + 1;
var anno = fecha.getFullYear();

function contex() {

    //var estruct = stestadofinanciero.getAt(0).data.oneentidad +' - '+stestadofinanciero.getAt(0).data.entidad;
    /** Cosas que tengo globales **/
    // fechaactual, nameperiodo, nameentidad, usuario
    telf = 'Tel. ' + telf;
    direc = 'Dir. ' + direc;
    email = 'Correo-e. ' + email;
    nameentidad = nameentidad.toUpperCase();
    tabla_cabeza = '<table style="font-size: 9px; font-family:arial, sans-serif;" width="98%"  border="0"  cellpadding="0" align="center" cellspacing="0">' +
            '<tr>' +
            '<td rowspan="4" width="135" align="center"><img src="data:image/jpg;base64,' + logo + '" alt="No tiene" width="135" height="54" style="padding-right:2px;border-right-style:solid;border-right-width:1px;border-right-color:#000000;"></td>' +
            '<td width="150"><strong>' + nameentidad + '</strong></td>' +
            '</tr>' +
            '<tr>' +
            '<td width="250">' + direc + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td width="150">' + telf + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td width="200">' + email + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="center"></td>' +
            '<td align="center"></td>' +
            '<td width="250" align="right"></td>' +
            '<td width="250" align="left"><strong>PER&Iacute;ODO desde:&nbsp;&nbsp;&nbsp;</strong>' + v_fechainicio + ' al ' + v_fechafin + '</td>' +
            '<td align="right"><strong>IMPRESI&Oacute;N:&nbsp;&nbsp;&nbsp;</strong>' + dia + '/' + mes + '/' + anno + '</td>' +
            '<td align="left"></td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="6"><strong>VISTA PREVIA DE INSTRUMENTOS BANCARIOS</strong></td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="6">&nbsp;</td>' +
            '</tr>' +
            '<tr>' +
            '<td><strong>EJERCICIO:&nbsp;&nbsp;&nbsp;</strong>' + namejerc + '</td>' +
            '<td width="250" align="left"><strong>NOMBRE PER&Iacute;ODO:&nbsp;&nbsp;&nbsp;</strong>' + nameperiodo + '</td>' +
            '<td></td>' +
            '<td></td>' +
            '<td>&nbsp;</td>' +
            '<td>&nbsp;</td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="6">&nbsp;</td>' +
            '</tr>' +
            '</table>';

    // CONFECCIONADO POR: + usuario
    tabla_pie = '<table style="font-size: 9px; font-family:arial, sans-serif;" width="98%" align="center" cellpadding="0" cellspacing="0" cols="12">' +
            '<tr>' +
            '<td colspan="7"> &nbsp; </td>' +
            '</tr>' +
            '<tr>' +
            //'<td width="250"><strong>NOMBRE Y APELLIDOS:</strong></td>' +
            '<td width="250"><strong>NOMBRE Y APELLIDOS:&nbsp;&nbsp;</strong>' + nombreusuario + '</td>' +
            '<td colspan="5" rowspan="4"><div align="left">CERTIFICAMOS QUE LOS DATOS CONTENIDOS EN ESTE ESTADO FINANCIERO SE CORRESPONDEN CON LAS ANOTACIONES CONTABLES DE ACUERDO CON LAS REGULACIONES VIGENTES </div></td>' +
            '</tr>' +
            '<tr>' +
            '<td> </td>' +
            '<td> </td>' +
            '</tr>' +
            '<tr>' +
            //'<td><strong>CARGO:</strong></td>' +
            '<td><strong>CARGO:&nbsp;&nbsp;</strong>' + cargo + ' </td>' +
            '</tr>' +
            '<tr>' +
            '<td </td>' +
            '<td> </td>' +
            '</tr>' +
            '<tr>' +
            //'<td><strong>FIRMA:</strong></td>' +
            '<td><strong>FIRMA:</strong></td>' +
            '<td width="50"><div align="center"><strong>D</strong></div></td>' +
            '<td width="50"><div align="center"><strong>M</strong></div></td>' +
            '<td width="50"><div align="center"><strong>A</strong></div></td>' +
            '<td width="80">&nbsp;</td>' +
            '<td width="80">&nbsp;</td>' +
            '</tr>' +
            '<tr>' +
            '<td>&nbsp;</td>' +
            '<td>&nbsp;</td>' +
            '<td width="50"><div align="center">' + dia + '</div></td>' +
            '<td width="50"><div align="center">' + mes + '</div></td>' +
            '<td width="50"><div align="center">' + anno + '</div></td>' +
            '<td colspan="2">&nbsp;</td>' +
            '</tr>' +
            '</table>';
}

function basic_printGrid() {
    if (winVerInstrumentos) {
        contex();
        global_printer = new Ext.grid.XPrinter({
            //grid:gpinstrumentobanc,  // grid object
            grid: gpImprimir, // grid object
            pathPrinter: 'printer', // relative to where the Printer folder resides
            //logoURL: perfil.dirImg+'cedrux.jpg', // relative to the html files where it goes the base printing
            pdfEnable: true, // enables link PDF printing (only save as)
            hasrowAction: false,
            localeData: {
                Title: 'Instrumentos Bancarios',
                subTitle: tabla_cabeza,
                footerText: tabla_pie,
                pageNo: 'P&aacute;gina No.', //page label
                printText: 'Imprimir', //print document action label
                closeText: 'Cerrar', //close window action label
                pdfText: 'PDF'
            },
            useCustom: {// in this case you leave null values as we dont use a custom store and TPL
                custom: false,
                customStore: null,
                columns: [],
                alignCols: [],
                pageToolbar: null,
                useIt: false,
                showIt: false
                        //location: 'bbar'
            },
            showdate: true, // show print date
            showdateFormat: 'Y-F-d H:i:s', //
            showFooter: true, // if the footer is shown on the pinting html
            styles: 'default' // wich style youre gonna use
        });
        global_printer.prepare(); // prepare the document
    }
}

function Antiguedad(fechavencimiento) {
    //calculo timestam de la fecha de emision del instrumento
    var fechainstrumento = dfemision.getValue();
    timestamp = Math.floor(fechainstrumento.getTime() / 1000);

    if (timestamp <= fechavencimiento)
        return 0;
    else {
        //resto a una fecha la otra
        var segundos_diferencia = fechavencimiento - timestamp;
        //convierto segundos en d�as
        var dias_diferencia = segundos_diferencia / (60 * 60 * 24);
        //obtengo el valor absoulto de los d�as (quito el posible signo negativo)
        dias_diferencia = Math.abs(dias_diferencia);
        //quito los decimales a los d�as de diferencia
        dias_diferencia = Math.floor(dias_diferencia);
        return dias_diferencia;
    }
    return 2;
}

function idChequeNominativo() {
    Ext.Ajax.request({
        url: 'chequeNominativo',
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            chequenominativo = responseData.chequenominativo;
        }
    });
}

function NroDocNeto(valor) {
    for (i = 0; i < valor.length; i++) {
        if (valor.charAt(i) == 0)
            continue;
        return valor.substring(i, valor.length);
    }
    return '';
}

/**********************adiciona las liquidaciones al grid *********************************/
function addfilaliquidacion(ind, record) {
    Ext.getCmp('btneliminarliquidacion').setDisabled(true);
    Ext.getCmp('btnmodificarliq').setDisabled(true);

    var newrT = '';
    // var index = stliquidaciones.find('idcuentacontable', cbcuentacontliqui.getValue());
    //almacena el index
    var recordT = Ext.data.Record.create([{
            name: 'idcuentacontable'
        }, {
            name: 'ctacontable'
        }, {
            name: 'importe'
        }]);
    if (/*cbcuentacontliqui.isValid() && tfsaldoliquidar.isValid() && */cbmovimientoliq.isValid()) {//si los campos son validos
        if (ind == 'Add') {//si se esta adicionando se valida el importe disponible
            //si el importe a adicionar es menor o igual que el disponible de la factura
            // if ((parseFloat(smliquidar.getSelected().data.impliquidar) - parseFloat(smliquidar.getSelected().data.liquidarimp)) >= parseFloat(tfsaldoliquidar.getValue())) {
            // var temp = smliquidar.getSelected();
            newrT = new recordT({
                idcuentacontable: record.get('idcuentacontable'),
                ctacontable: record.get('ctacontable'),
                importe: record.get('liquidarimp')
            });
            stliquidaciones.removeAll()
            stliquidaciones.add(newrT);//adiciona la nueva fila

            actualizarimporteliquidar(record);//se actualiza el importe a liquidar de la operacion
                //cbcuentacontliqui.reset();//se limpia el combo cuenta contable
                //tfsaldoliquidar.reset();//se limpia el campo saldo a liquidar
            // }
            // else {
            //     mostrarMensaje(1, 'El importe a liquidar es mayor que el disponible en la factura.');
            // }
        }
        // else {
        //     //si el importe a modificar es menor o igual que el disponible de la factura
        //     if ((parseFloat(smliquidar.getSelected().data.impliquidar) - parseFloat(smliquidar.getSelected().data.liquidarimp) + parseFloat(stliquidaciones.getAt(index).data.importe)) >= parseFloat(tfsaldoliquidar.getValue())) {
        //         newrT = new recordT({
        //             idcuentacontable: cbcuentacontliqui.getValue(),
        //             ctacontable: cbcuentacontliqui.getRawValue(),
        //             importe: tfsaldoliquidar.getValue()
        //         });
        //         stliquidaciones.remove(stliquidaciones.getAt(index));//elimina el que estaba
        //         stliquidaciones.insert(index, newrT);//adiciona la nueva fila con el importe actualizado
        //         actualizarimporteliquidar();//se actualiza el importe a liquidar de la operacion
        //     }
        //     else {
        //         mostrarMensaje(1, 'El importe a liquidar es mayor que el disponible en la factura.');
        //     }
        // }
    }
}

/**********************ELIMINAR LIQUIDACION DEL GRID*********************************/
function delfilaliquidacion() {
    mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar la liquidaci&oacute;n seleccionada?', function(btn) {
        if (btn == 'ok') {
            Ext.getCmp('btneliminarliquidacion').setDisabled(true);
            Ext.getCmp('btnmodificarliq').setDisabled(true);

            if (smliquidaciones.getSelected()) {
                var index = stliquidaciones.find('idcuentacontable', smliquidaciones.getSelected().data.idcuentacontable);
                stliquidaciones.remove(stliquidaciones.getAt(index));
                actualizarimporteliquidar();//se actualiza el importe a liquidar de la operacion
                cbcuentacontliqui.reset();//se limpia el combo cuenta contable
                tfsaldoliquidar.reset();//se limpia el campo saldo a liquidar
            }
        }
    });
}
/*******FUNCION CARGAR DATOS DEL MODIFICAR LIQUIDACION*********************************************/
function cargardatosmodfilaliquidacion() {
    Ext.getCmp('cbcuentacontliqui').setValue(smliquidaciones.getSelected().data.idcuentacontable);
    Ext.getCmp('cbcuentacontliqui').setRawValue(smliquidaciones.getSelected().data.ctacontable);
    Ext.getCmp('tfsaldoliquidar').setValue(smliquidaciones.getSelected().data.importe);
    Ext.getCmp('tfsaldoliquidar').setRawValue(saldo(Ext.getCmp('tfsaldoliquidar').getValue()));
}
//actualiza el importe a liquidar de las operaciones
function actualizarimporteliquidar(record) {
    // var index = stliquidar.find('id', smliquidar.getSelected().data.id);//se obtiene el index de la operacion seleccionada
    // var record = stliquidar.getAt(index);//se obtiene el record seleccionado

    // var importe = 0;
    // for (var i = 0; i < stliquidaciones.getCount(); i++) {
    //     importe += parseFloat(stliquidaciones.data.items[i].data.importe);
    // }
    // record.data.liquidarimp = importe;
    // stliquidar.remove(stliquidar.getAt(index));//elimina el que estaba
    // stliquidar.insert(index, record);//adiciona la nueva fila con el importe actualizado
    guardaroperacionesliquidadas(record);//se actualizan los datos de la liquidacion de operaciones
//pagadoOper();//se actualiza el pagado
}

//guarda la operacion y sus liquidaciones asociadas en un array
function guardaroperacionesliquidadas(r) {
    var operacionliquidada = new Array();//almacena el formato de la nueva operacion
    if (arroperliquidacion.length > 0) {//si el array ya tiene operaciones se busca si ya existe la que se quiere guardar
        flagFound = false;//bandera true si encuentra el elemento
        for (var i = 0; i < arroperliquidacion.length; i++) {
            if (arroperliquidacion[i][0] === r.data.id) {//si existe lo actualizo
                arroperliquidacion[i][1] = r.data.impliquidar;//importe
                arroperliquidacion[i][2] = r.data.liquidarimp;//importe total liquidacion (a liquidar)
                arroperliquidacion[i][4] = creaData(stliquidaciones.data);//se le asigna lo que tiene el store liquidaciones
                arroperliquidacion[i][5] = cbmovimientoliq.getValue();// operaciones del formulario liquidar
                if (arroperliquidacion[i][4].length === 0)//si no tiene datos es que se debe eliminar la operacion del array
                    arroperliquidacion.remove(arroperliquidacion[i]);
                flagFound = true;
                break;
            }
        }
        //si flagFound= false es porque no encontro la operacion y se adiciona
        if (!flagFound) {
            for (var j = 0; j < 4; i++) {
                operacionliquidada[j] = r.data.id;//idoperacion
                operacionliquidada[j + 1] = r.data.impliquidar;//importe
                operacionliquidada[j + 2] = r.data.liquidarimp;//importe total liquidacion (a liquidar)
                operacionliquidada[j + 3] = r.data.idderecho;//idderechouobligacion
                operacionliquidada[j + 4] = creaData(stliquidaciones.data);//se le asigna lo que tiene el store liquidaciones
                operacionliquidada[j + 5] = cbmovimientoliq.getValue();// operaciones del formulario liquidar
                j += 4;
            }
            arroperliquidacion.push(operacionliquidada);
        }
    } else {//si no se han adicionado operaciones se adiciona la primera
        for (var k = 0; k < 4; i++) {
            operacionliquidada[k] = r.data.id;//idoperacion
            operacionliquidada[k + 1] = r.data.impliquidar;//importe
            operacionliquidada[k + 2] = r.data.liquidarimp;//importe total liquidacion (a liquidar)
            operacionliquidada[k + 3] = r.data.idderecho;//idderechouobligacion
            operacionliquidada[k + 4] = creaData(stliquidaciones.data);//se le asigna lo que tiene el store liquidaciones
            operacionliquidada[k + 5] = cbmovimientoliq.getValue();// operaciones del formulario liquidar
            operacionliquidada[k + 6] = r.data.idliquidacion ? r.data.idliquidacion : undefined;// operaciones del formulario liquidar
            k += 4;
        }
        arroperliquidacion.push(operacionliquidada);
    }
    Ext.getCmp('btnliquidar').disable();//se deshabilita el btn liquidar
    // smliquidar.selectRecords([r]);//se selecciona la fila nuevamente
    importeLiquidacion();//se actualiza el importe total de la liquidacion
    pagadoOper();//se actualiza el pagado
    guardaInfoTabLiquidaciones(r);//se manda a llenar el array del tab info liquidaciones
}

//carga las liquidaciones en el grid dada la operacion
function cargarLiquidaciones() {
    banderadelete = false;//borrar store
    stliquidaciones.removeAll();//se eliminan los que estaban
    tfsaldoliquidar.enable();//se habilita el campo inporte a liquidar

    if (arroperliquidacion.length > 0) {//si el array ya tiene operaciones se busca si ya existe la que se quiere guardar
        for (var i = 0; i < arroperliquidacion.length; i++) {
            if (arroperliquidacion[i][0] == smliquidar.getSelected().data.id) {//si existe muestro sus datos en el grid liquidaciones
                for (var j = 0; j < arroperliquidacion[i][4].length; j++) {
                    stliquidaciones.insert(j, creaRecord(arroperliquidacion[i][4][j]));//se cargan los datos corresp al dereuobli seleccionado
                }
                banderadelete = true;
                break;
            }
        }
        //se deshabilita el combo de las operaciones
        /* cbmovimientoliq.disable(); habilitar aqui*/
    }
    /*else{//se habilita el combo de las operaciones
     cbmovimientoliq.enable();
     }habilitar aqui*/
    //si el importe disponible de la factura es mayor que cero
    if ((parseFloat(smliquidar.getSelected().data.impliquidar) - parseFloat(smliquidar.getSelected().data.liquidarimp)) > 0) {
        tfsaldoliquidar.reset();//se limpia el campo saldo a liquidar
        cbcuentacontliqui.reset();//se limpia el combo cuenta contable
        tfsaldoliquidar.setValue(parseFloat(smliquidar.getSelected().data.impliquidar) - parseFloat(smliquidar.getSelected().data.liquidarimp));
        tfsaldoliquidar.setRawValue(saldo(tfsaldoliquidar.getValue()));
        Ext.getCmp('btnliquidar').enable();//se habilita el btn liquidar
    }
    else {
        Ext.getCmp('btnliquidar').disable();//se deshabilita el btn liquidar
        cbcuentacontliqui.reset();//se limpia el combo cuenta contable
        tfsaldoliquidar.reset();//se limpia el campo saldo a liquidar
    }
}
function creaRecord(arr) {
    arrRecord = new Array();
    recordT = Ext.data.Record.create([{
            name: 'idcuentacontable'
        }, {
            name: 'ctacontable'
        }, {
            name: 'importe'
        }]);
    newrT = new recordT({
        idcuentacontable: arr[0],
        ctacontable: arr[1],
        importe: arr[2]
    });
    arrRecord.push(newrT);

    return arrRecord;
}
//crea un array con los datos del store
function creaData(st) {
    arrData = new Array();
    for (var i = 0; i < st.getCount(); i++) {
        arraytmp = new Array();
        arraytmp[0] = st.items[i].data.idcuentacontable;
        arraytmp[1] = st.items[i].data.ctacontable;
        arraytmp[2] = parseFloat(st.items[i].data.importe);
        arrData.push(arraytmp);
    }
    return arrData;
}
//actualiza el importe total de la liquidacion
function importeLiquidacion() {
    tfimportetotalliq.setValue('0.00');
    if (arroperliquidacion.length > 0) {//si el array ya tiene operaciones se calcula el importe total
        for (var i = 0; i < arroperliquidacion.length; i++) {
            for (var j = 0; j < arroperliquidacion[i][4].length; j++) {
                tfimportetotalliq.setValue(parseFloat(tfimportetotalliq.getValue()) + parseFloat(arroperliquidacion[i][4][j][2]));
                tfimportetotalliq.setRawValue(saldo(tfimportetotalliq.getValue()));
            }
        }
    }
}
//liquida varias facturas a la vez --se le pasa como parametro un array con los ids de las filas seleccionadas
function liquidarVariasFacturas(arrayIds) {
    Ext.getCmp('btneliminarliquidacion').setDisabled(true);
    Ext.getCmp('btnmodificarliq').setDisabled(true);

    // tmpidctacontable = cbcuentacontliqui.getValue();//id de la cta cont
    // tmpdescctacontable = cbcuentacontliqui.getRawValue();//descripcion de la cta cont
    for (i = 0; i < arrayIds.length; i++) {//se recorren las filas seleccionadas
        var index = stliquidar.find('id', arrayIds[i]);//se obtiene el index de la operacion seleccionada
        var record = stliquidar.getAt(index);//se obtiene el record seleccionado
        // record.data.liquidarimp = record.data.impliquidar;//se liquida totalmente
        // stliquidar.remove(stliquidar.getAt(index));//elimina el que estaba
        // stliquidar.insert(index, record);//adiciona la nueva fila con el importe actualizado
        //se crea el objeto record de la liquidacion y se inserta en el grid liquidaciones
        recordT = new Ext.data.Record.create([{
                name: 'idcuentacontable'
            }, {
                name: 'ctacontable'
            }, {
                name: 'importe'
            }]);
        //se crea el record de la liquidacion
        newrT = new recordT({
            idcuentacontable: record.data.idcuentacontable, //id de la cta cont
            ctacontable: record.data.ctacontable, //descripcion de la cta cont
            importe: record.data.liquidarimp//importe a liquidar -se liquida total
        });
        stliquidaciones.removeAll();//se eliminan los record que estaban
        stliquidaciones.add(newrT);//se inserta el record de la liquidacion en el grid liquidaciones
        guardaroperacionesliquidadas(record);//se actualizan los datos de la liquidacion de operaciones
    }
    tfsaldoliquidar.enable();
}
//guarda la informacion del grid info de las liquidaciones
function guardaInfoTabLiquidaciones(rec) {

    var newoperliquidada = new Array();//almacena el formato de la nueva operacion liquidada
    if (arrtabliquidacion.length > 0) {//si el array ya tiene operaciones se busca si ya existe la que se quiere guardar
        flagFound = false;//bandera true si encuentra el elemento
        for (var i = 0; i < arrtabliquidacion.length; i++) {
            if (arrtabliquidacion[i][0] == rec.data.id) {//si existe lo actualizo
                if (stliquidaciones.data.length == 0) {//si no tiene datos se debe eliminar la operacion del array
                    arrtabliquidacion.remove(arrtabliquidacion[i]);
                    flagFound = true;
                    break;
                }
                arrtabliquidacion[i][1] = rec.data.nro;//numero
                arrtabliquidacion[i][2] = rec.data.docdenomin;//tipo documento
                arrtabliquidacion[i][3] = rec.data.estado;//estado del documento
                arrtabliquidacion[i][4] = rec.data.origen;//origen del documento
                arrtabliquidacion[i][5] = rec.data.edad;//edad del documento
                arrtabliquidacion[i][6] = rec.data.comentario;//comentario del documento
                arrtabliquidacion[i][7] = rec.data.impliquidar;//impliquidar del documento
                arrtabliquidacion[i][8] = rec.data.liquidarimp;//liquidarimp del documento
                arrtabliquidacion[i][9] = rec.data.idoperacion;// operaciones del formulario liquidar
                arrtabliquidacion[i][10] = rec.data.descoperacion;// operaciones del formulario liquidar

                flagFound = true;
                break;
            }
        }
        //si flagFound= false es porque no encontro la operacion y se adiciona
        if (!flagFound) {
            newoperliquidada[0] = rec.data.id;//idoperacion
            newoperliquidada[1] = rec.data.nro;//numero
            newoperliquidada[2] = rec.data.docdenomin;//tipo documento
            newoperliquidada[3] = rec.data.estado;//estado del documento
            newoperliquidada[4] = rec.data.origen;//origen del documento
            newoperliquidada[5] = rec.data.edad;//edad del documento
            newoperliquidada[6] = rec.data.comentario;//comentario del documento
            newoperliquidada[7] = rec.data.impliquidar;//impliquidar del documento
            newoperliquidada[8] = rec.data.liquidarimp;//liquidarimp del documento
            newoperliquidada[9] = rec.data.idoperacion;// operaciones del formulario liquidar
            newoperliquidada[10] = rec.data.descoperacion;// operaciones del formulario liquidar

            arrtabliquidacion.push(newoperliquidada);
        }
    } else {//si no se han adicionado operaciones se adiciona la primera
        newoperliquidada[0] = rec.data.id;//idoperacion
        newoperliquidada[1] = rec.data.nro;//numero
        newoperliquidada[2] = rec.data.docdenomin;//tipo documento
        newoperliquidada[3] = rec.data.estado;//estado del documento
        newoperliquidada[4] = rec.data.origen;//origen del documento
        newoperliquidada[5] = rec.data.edad;//edad del documento
        newoperliquidada[6] = rec.data.comentario;//comentario del documento
        newoperliquidada[7] = rec.data.impliquidar;//impliquidar del documento
        newoperliquidada[8] = rec.data.liquidarimp;//liquidarimp del documento
        newoperliquidada[9] = rec.data.idoperacion;// operaciones del formulario liquidar
        newoperliquidada[10] = rec.data.descoperacion;// operaciones del formulario liquidar

        arrtabliquidacion.push(newoperliquidada);
    }

    return;
}

//actualiza el grid info de las liquidaciones
function actualizaInfoTabLiquidaciones() {

    sttabliquidar.removeAll();

    //se crea el objeto record de la liquidacion y se inserta en el grid liquidaciones
    recLiq = new Ext.data.Record.create([{
            name: 'id'
        }, {
            name: 'nro'
        }, {
            name: 'docdenomin'
        }, {
            name: 'estado'
        }, {
            name: 'origen'
        }, {
            name: 'edad'
        }, {
            name: 'comentario'
        }, {
            name: 'impliquidar'
        }, {
            name: 'liquidarimp'
        }, {
            name: 'idoperacion'
        }, {
            name: 'descoperacion'
        }
    ]);

    var arrTemp = [];

    if (arrtabliquidacion.length > 0) {
        for (var i = 0; i < arrtabliquidacion.length; i++) {
            //se crea el record de la liquidacion
            newRec = new recLiq({
                id: arrtabliquidacion[i][0],
                nro: arrtabliquidacion[i][1],
                docdenomin: arrtabliquidacion[i][2],
                estado: arrtabliquidacion[i][3],
                origen: arrtabliquidacion[i][4],
                edad: arrtabliquidacion[i][5],
                comentario: arrtabliquidacion[i][6],
                impliquidar: arrtabliquidacion[i][7],
                liquidarimp: arrtabliquidacion[i][8],
                idoperacion: arrtabliquidacion[i][9],
                descoperacion: arrtabliquidacion[i][10]
            });
            // arrTemp.push({
            //     id: arrtabliquidacion[i][0],
            //     nro: arrtabliquidacion[i][1],
            //     docdenomin: arrtabliquidacion[i][2],
            //     estado: arrtabliquidacion[i][3],
            //     origen: arrtabliquidacion[i][4],
            //     edad: arrtabliquidacion[i][5],
            //     comentario: arrtabliquidacion[i][6],
            //     impliquidar: arrtabliquidacion[i][7],
            //     liquidarimp: arrtabliquidacion[i][8],
            //     idoperacion: arrtabliquidacion[i][9],
            //     descoperacion: arrtabliquidacion[i][10]
            // });
            arrTemp.push(newRec);
            //se inserta el record de la liquidacion en el tab liquidaciones
            // sttabliquidar.add(newRec);
        }
        sttabliquidar.add(arrTemp);
        // sttabliquidar.loadData({datos: arrTemp, cantidad: arrtabliquidacion.length});
    }
    return;
}

//guarda la operacion y sus liquidaciones asociadas en un array
function cargaInfoEnArrayLiquidaciones(array) {
//    var operacionliquidada = new Array();//almacena el formato de la nueva operacion
//    si no se han adicionado operaciones se adiciona la primera
    var operacionliquidada;
    for (var i = 0, longi = array.length; i < longi; i++) {
        operacionliquidada = new Array();//almacena el formato de la nueva operacion
        operacionliquidada[0] = array[i].id;//idoperacion
        operacionliquidada[1] = array[i].impliquidar;//importe
        operacionliquidada[2] = array[i].liquidarimp;//importe total liquidacion (a liquidar)
        operacionliquidada[3] = array[i].idderecho;//idderechouobligacion
        arrData = new Array();
        for (var j = 0, longj = array[i].movbancarioCta.length; j < longj; j++) {
            arraytmp = new Array();
            //if (array[i].movbancarioCta.length < j) {
            arraytmp[0] = array[i].movbancarioCta[j].idcuentacontable;
            arraytmp[1] = array[i].movbancarioCta[j].ctacontable;
            arraytmp[2] = parseFloat(array[i].movbancarioCta[j].importemo);
            arraytmp[3] = array[i].movbancarioCta[j].idmovimientobancariocta; //Esto viene cuado se esta modificando el instrumento
            arrData.push(arraytmp);
            //}
        }
        operacionliquidada[4] = arrData;
        operacionliquidada[5] = array[i].idoperacion;// operaciones del formulario liquidar
        operacionliquidada[6] = array[i].idliquidacion;//idliquidacion, esto toma valor cuando se cargan los datos al modificar
        operacionliquidada[7] = array[i].idmovimiento;//idmovimiento, esto toma valor cuando se cargan los datos al modificar
        arroperliquidacion.push(operacionliquidada);
    }
}
/****************************************************************************************************/
/*****************************ADICIONAR FILA OPERACIONES*********************************************/
/****************************************************************************************************/
function addfilaoperaciones(ind) {
    var newrT = '';
    var a = '';//almacena el index encontrado
    var recordT = Ext.data.Record.create([
        {
            name: 'idoperacion'
        }, {
            name: 'descoperacion'
        }, {
            name: 'idctacontable'
        }, {
            name: 'ctacontable'
        }, {
            name: 'ctabancaria'
        }, {
            name: 'moneda'
        }, {
            name: 'importe'
        }, {
            name: 'idctaoperacion'
        }, {
            name: 'signo'
        }, {
            name: 'idctacontrapartida'
        }, {
            name: 'ctacontrapartida'
        }, {
            name: 'idmovimientocaja'
        }, {
            name: 'idfechacierrenomina'
        }, {
            name: 'idanticipo'
        }, {
            name: 'idclienteproveedor'
        }, {
            name: 'clienteproveedor'
        }, {
            name: 'numerosoperenzona'
        }
    ]);
    //idctacontrapartida
    //ctacontrapartida
    //idcontrapartidaoper
    if (tfimporteletrasoper.isValid() && tfimporteoper.isValid() && tfmonedaoper.isValid() && cbcuentadebitar.isValid() && cbcuentaacreditaroper.isValid() && cbmovimientooper.isValid()) {//si los campos son validos

        var stmovoper = cbmovimientooper.store;
        var index = stmovoper.find('idoperacion', cbmovimientooper.getValue());
        var objmovoper = stmovoper.getAt(index).data;

        var storecuentacontrap = cbcuentaacreditaroper.getStore();

        Ext.each(cbcuentaacreditaroper.getValue(), function(idcuentacontrapartida, ix, allIdCuentas) {
            var index = storecuentacontrap.find('idcuenta', idcuentacontrapartida);

            var idmovimientocaja = (index > -1) ? storecuentacontrap.getAt(index).data.idmovimientocaja : '';

            var idanticipo = (index > -1) ? storecuentacontrap.getAt(index).data.idanticipo : '';

            var textctacontrapartida = '';
            if(index > -1 && Array.isArray(cbcuentaacreditaroper.getValue())) {
                textctacontrapartida = storecuentacontrap.getAt(index).data.text;
            }
            else {
                textctacontrapartida = cbcuentaacreditaroper.getRawValue();
            }

            var idctaoperacion = cbmovimientooper.getValue() + cbcuentadebitar.getValue() + idcuentacontrapartida + idmovimientocaja + idanticipo + idfechacierrenomina;

            var idclienteproveedor = Ext.getCmp('cbxclienteprov').getValue();
            var clienteproveedor = Ext.getCmp('cbxclienteprov').getRawValue();
            var numerosoperenzona = '';

            //si ya estaba en el grid actualizo el importe
            if ((a = stgridoperaciones.find('idctaoperacion', idctaoperacion)) > -1) {
                if (ind == 'Add') {
                    newrT = new recordT({
                        idoperacion: cbmovimientooper.getValue(),
                        descoperacion: cbmovimientooper.getRawValue(),
                        idctacontable: cbcuentadebitar.getValue(),
                        ctacontable: cbcuentadebitar.getRawValue(),
                        ctabancaria: cbcuentaacreditaroper.getRawValue(),
                        moneda: tfmonedaoper.getValue(),
                        importe: Math.abs(parseFloat(stgridoperaciones.getAt(a).data.importe)) + parseFloat(tfimporteoper.getValue()),
                        idctaoperacion: idctaoperacion,
                        signo: objmovoper.signo,
                        idctacontrapartida: idcuentacontrapartida,
                        ctacontrapartida: textctacontrapartida,
                        idmovimientocaja: idmovimientocaja,
                        idfechacierrenomina: idfechacierrenomina,
                        idanticipo: idanticipo,
                        idclienteproveedor: idclienteproveedor,
                        clienteproveedor: clienteproveedor,
                        numerosoperenzona: numerosoperenzona
                    });
                }
                else {
                    var actRecord = stgridoperaciones.getAt(a);
                    newrT = new recordT({
                        idoperacion: cbmovimientooper.getValue(),
                        descoperacion: cbmovimientooper.getRawValue(),
                        idctacontable: cbcuentadebitar.getValue(),
                        ctacontable: cbcuentadebitar.getRawValue(),
                        ctabancaria: cbcuentaacreditaroper.getRawValue(),
                        moneda: tfmonedaoper.getValue(),
                        importe: parseFloat(tfimporteoper.getValue()),
                        idctaoperacion: idctaoperacion,
                        signo: objmovoper.signo,
                        idctacontrapartida: idcuentacontrapartida,
                        ctacontrapartida: textctacontrapartida,
                        idmovimientocaja: idmovimientocaja,
                        idfechacierrenomina: idfechacierrenomina,
                        idanticipo: idanticipo,
                        idclienteproveedor: idclienteproveedor,
                        clienteproveedor: clienteproveedor,
                        numerosoperenzona: actRecord.get('numerosoperenzona')
                    });
                }
                stgridoperaciones.remove(actRecord);//elimina el que estaba
                stgridoperaciones.insert(a, newrT);//adiciona la nueva fila con el importe actualizado
            }
            else {
                //si no esta lo adiciono
                newrT = new recordT({
                    idoperacion: cbmovimientooper.getValue(),
                    descoperacion: cbmovimientooper.getRawValue(),
                    idctacontable: cbcuentadebitar.getValue(),
                    ctacontable: cbcuentadebitar.getRawValue(),
                    ctabancaria: cbcuentaacreditaroper.getRawValue(),
                    moneda: tfmonedaoper.getValue(),
                    importe: tfimporteoper.getValue(),
                    idctaoperacion: idctaoperacion,
                    signo: objmovoper.signo,
                    idctacontrapartida: idcuentacontrapartida,
                    ctacontrapartida: textctacontrapartida,
                    idmovimientocaja: idmovimientocaja,
                    idfechacierrenomina: idfechacierrenomina,
                    idanticipo: idanticipo,
                    idclienteproveedor: idclienteproveedor,
                    clienteproveedor: clienteproveedor
                });
                //adiciona la nueva fila
                stgridoperaciones.add(newrT);
                //actualizarimporteliquidar();//se actualiza el importe a liquidar de la operacion
            }
        });

        //arroperacioninst = creaDataOperaciones(stgridoperaciones.data);//se actualiza el array con los datos del grid
        //se deshabilita el btn eliminar
        Ext.getCmp('btneliminaroper').disable();
        Ext.getCmp('btnmodificaroper').disable();
        /*para que no se resetee si  tiene un solo elemento*/
        if (stcuentadebitar.getCount() > 1) {
            Ext.getCmp('cbcuentadebitar').reset();//se limpia el combo cuenta contable a debitar
        }

        Ext.getCmp('cbcuentaacreditaroper').reset();
        Ext.getCmp('cbcuentaacreditaroper').getStore().removeAll();
        Ext.getCmp('cbcuentaacreditaroper').clearValue();

        cbmovimientooper.setValue('');

        //se limpia el campo importe de la operacion
        Ext.getCmp('tfimporteoper').reset();
        //se limpia el campo importe letras de la operacion
        Ext.getCmp('tfimporteletrasoper').reset();

        Ext.getCmp('cbxclienteprov').reset();
        Ext.getCmp('cbxclienteprov').clearValue();
        importeTotalOperaciones();
        pagadoOper('op');//se actualiza el pagado
    }
    //se le da el foco al combo de las operaciones
    cbmovimientooper.focus(false, 10);
}

function addOperEnzona(datos) {
    var newrT = '';
    var recordT = Ext.data.Record.create([
        {
            name: 'idoperacion'
        }, {
            name: 'descoperacion'
        }, {
            name: 'idctacontable'
        }, {
            name: 'ctacontable'
        }, {
            name: 'ctabancaria'
        }, {
            name: 'moneda'
        }, {
            name: 'importe'
        }, {
            name: 'idctaoperacion'
        }, {
            name: 'signo'
        }, {
            name: 'idctacontrapartida'
        }, {
            name: 'ctacontrapartida'
        }, {
            name: 'idmovimientocaja'
        }, {
            name: 'idfechacierrenomina'
        }, {
            name: 'idanticipo'
        }, {
            name: 'idclienteproveedor'
        }, {
            name: 'clienteproveedor'
        }, {
            name: 'numerosoperenzona'
        }
    ]);
    //idctacontrapartida
    //ctacontrapartida
    //idcontrapartidaoper
    stgridoperaciones.removeAll();
    for (var i = 0; i < datos.length; i++) {
        var idctaoperacion = cbmovimientooper.getValue() + cbcuentadebitar.getValue() + datos[i].idcuentacontrapartida;
        var stmovoper = cbmovimientooper.store;
        var index = stmovoper.find('idoperacion', cbmovimientooper.getValue());
        var objmovoper = stmovoper.getAt(index).data;
        newrT = new recordT({
            idoperacion: cbmovimientooper.getValue(),
            descoperacion: cbmovimientooper.getRawValue(),
            idctacontable: cbcuentadebitar.getValue(),
            ctacontable: cbcuentadebitar.getRawValue(),
            ctabancaria: cbcuentaacreditaroper.getRawValue(),
            moneda: tfmonedaoper.getValue(),
            importe: datos[i].importetotal,
            idctaoperacion: idctaoperacion,
            signo: objmovoper.signo,
            idctacontrapartida: datos[i].idcuentacontrapartida,
            ctacontrapartida: datos[i].textcuentacontrapartida,
            idmovimientocaja: '',
            idfechacierrenomina: '',
            idanticipo: '',
            idclienteproveedor: datos[i].idclientesproveedores,
            clienteproveedor: datos[i].clienteproveedor,
            numerosoperenzona: datos[i].numerosoperenzona
        });
        //adiciona la nueva fila
        stgridoperaciones.add(newrT);

    }

    //arroperacioninst = creaDataOperaciones(stgridoperaciones.data);//se actualiza el array con los datos del grid
    //se deshabilita el btn eliminar
    Ext.getCmp('btneliminaroper').disable();
    Ext.getCmp('btnmodificaroper').disable();
    /*para que no se resetee si  tiene un solo elemento*/
    Ext.getCmp('cbcuentadebitar').reset();//se limpia el combo cuenta contable a debitar

    Ext.getCmp('cbcuentaacreditaroper').reset();
    Ext.getCmp('cbcuentaacreditaroper').getStore().removeAll();
    Ext.getCmp('cbcuentaacreditaroper').clearValue();

    cbmovimientooper.setValue('');

    //se limpia el campo importe de la operacion
    Ext.getCmp('tfimporteoper').reset();
    //se limpia el campo importe letras de la operacion
    Ext.getCmp('tfimporteletrasoper').reset();

    Ext.getCmp('cbxclienteprov').reset();
    Ext.getCmp('cbxclienteprov').clearValue();
    importeTotalOperaciones();
    pagadoOper('op');//se actualiza el pagado
    //se le da el foco al combo de las operaciones
    cbmovimientooper.focus(false, 10);
}
/**********************ELIMINAR OPERACIONES DEL GRID*********************************/
function delfilaoperaciones() {
    if (smgridoperaciones.getSelected()) {
        var index = stgridoperaciones.find('idctaoperacion', smgridoperaciones.getSelected().data.idctaoperacion);

        if (arrIdmovsCajaToSend.length > 0) {
            for (var i = 0, long = arrIdmovsCajaToSend.length; i < long; i++) {
                if (smgridoperaciones.getSelected().data.idmovimientocaja != arrIdmovsCajaToSend[i]) {
                    arrIdmovsCajaToSend.push(stgridoperaciones.getAt(index).data.idmovimientocaja);
                }
                else {
                    break;
                }
            }
        }

        stgridoperaciones.remove(stgridoperaciones.getAt(index));


        // arroperacioninst = creaDataOperaciones(stgridoperaciones.data);//se actualiza el array con los datos del grid
        Ext.getCmp('btneliminaroper').disable();//se deshabilita el btn eliminar
        Ext.getCmp('btnmodificaroper').disable();//se deshabilita el btn eliminar
        /*para que no se resetee si  tiene un solo elemento*/
        if (stcuentadebitar.getCount() > 1) {
            Ext.getCmp('cbcuentadebitar').reset();//se limpia el combo cuenta contable a debitar
        }

        Ext.getCmp('tfimporteoper').reset();//se limpia el campo importe de la operacion
        Ext.getCmp('tfimporteoper').setDisabled(false);//se activa el campo importe de la operacion
        Ext.getCmp('cbmovimientooper').clearValue();
        Ext.getCmp('cbcuentaacreditaroper').reset();
        Ext.getCmp('tfimporteletrasoper').reset();//se limpia el campo importe letras de la operacion
        Ext.getCmp('cbxclienteprov').reset();
        Ext.getCmp('cbxclienteprov').clearValue();
        importeTotalOperaciones();
        pagadoOper('op');//se actualiza el pagado

        if (tfrestooper.getValue() == tfimportetotaloper.getValue() && tfrestooper.getValue() == '0.00') {
            tfrestooper.setValue(saldoformateado(tfimporte.getValue()));
        }
    }
    //se le da el foco al combo de las operaciones
    cbmovimientooper.focus(false, 10);
}
/*******FUNCION CARGAR DATOS DEL MODIFICAR OPERACIONES*********************************************/
function cargardatosmodfilaoperaciones() {
    Ext.getCmp('cbmovimientooper').setValue(smgridoperaciones.getSelected().data.idoperacion);
    Ext.getCmp('cbmovimientooper').setRawValue(smgridoperaciones.getSelected().data.descoperacion);
    Ext.getCmp('cbcuentadebitar').setValue(smgridoperaciones.getSelected().data.idctacontable);
    Ext.getCmp('cbcuentadebitar').setRawValue(smgridoperaciones.getSelected().data.ctacontable);
    Ext.getCmp('tfimporteoper').setValue(saldo(Math.abs(smgridoperaciones.getSelected().data.importe)));
    Ext.getCmp('tfimporteletrasoper').setValue(convertir_a_letras(smgridoperaciones.getSelected().data.importe));
    Ext.getCmp('cbxclienteprov').setValue(smgridoperaciones.getSelected().data.idclienteproveedor);
    Ext.getCmp('cbxclienteprov').setRawValue(smgridoperaciones.getSelected().data.clienteproveedor);

    Ext.getCmp('cbcuentaacreditaroper').reset();
    Ext.getCmp('cbcuentaacreditaroper').getStore().removeAll();

    var signo = smgridoperaciones.getSelected().data.signo;

    if (signo != 19 && signo != 43 && signo != 41 && signo != 42) {
        var idmoneda = (acc == 'ins') ? stmonedatasa.getAt(0).get('idmoneda') : stinstrumentobanc.data.items[idgridI].get('idmoneda');
        var params = {
            idoperacion: smgridoperaciones.getSelected().data.idoperacion,
            tipoOperacion: cbtipoOpInstr.getValue(),
            idmoneda: idmoneda,
            signo: smgridoperaciones.getSelected().data.signo
        };
        Ext.getCmp('cbcuentaacreditaroper').setBaseParams(params);
        Ext.getCmp('cbcuentaacreditaroper').reset();
        Ext.getCmp('cbcuentaacreditaroper').load();
    }
    else {
        var objacreditar = {
            datos: [{
                    idcuenta: smgridoperaciones.getSelected().data.idctacontrapartida,
                    text: smgridoperaciones.getSelected().data.ctacontrapartida,
                    idmovimientocaja: smgridoperaciones.getSelected().data.idmovimientocaja,
                    idanticipo: smgridoperaciones.getSelected().data.idanticipo
                }]
        };
        Ext.getCmp('cbcuentaacreditaroper').getStore().loadData(objacreditar);
    }

    Ext.getCmp('cbcuentaacreditaroper').setValue(smgridoperaciones.getSelected().data.idctacontrapartida, smgridoperaciones.getSelected().data.ctacontrapartida);

    //desactivar el campo importe en caso de que la operacion sea de reembolso, devolución de cobro anticipado y reintegro de pago anticipado
    if (signo == 19 || signo == 43 || signo == 41 || signo == 42) {
        tfimporteoper.setDisabled(true);
        Ext.getCmp('cbcuentaacreditaroper').setDisabled(true);
    }
    else if(signo == 40) {
        tfimporteoper.setDisabled(true);
        Ext.getCmp('cbcuentaacreditaroper').setDisabled(false);
        idfechacierrenomina = smgridoperaciones.getSelected().data.idfechacierrenomina;
    }
    else {
        tfimporteoper.setDisabled(false);
        Ext.getCmp('cbcuentaacreditaroper').setDisabled(false);
    }
}
//crea un array con los datos del store operaqciones debitadas
function creaDataOperaciones(st) {
    arrData = new Array();
    for (var i = 0; i < st.getCount(); i++) {
        arraytmp = new Array();
        arraytmp[0] = st.items[i].data.idoperacion;//idoperacion
        arraytmp[1] = st.items[i].data.descoperacion;//descoperacion
        arraytmp[2] = st.items[i].data.idctacontable;//idctacontable
        arraytmp[3] = st.items[i].data.ctacontable;//ctacontable
        arraytmp[4] = st.items[i].data.ctabancaria;//ctabancaria
        arraytmp[5] = st.items[i].data.moneda;//moneda
        arraytmp[6] = parseFloat(st.items[i].data.importe);//importe
        arraytmp[7] = st.items[i].data.idctaoperacion;//idctaoperacion
        arraytmp[8] = (Ext.isEmpty(st.items[i].data.idmovimiento)) ? '' : st.items[i].data.idmovimiento;
        arraytmp[9] = st.items[i].data.signo;//signo
        arraytmp[10] = st.items[i].data.idctacontrapartida;//idctacontrapartida
        arraytmp[11] = st.items[i].data.ctacontrapartida;//ctacontrapartida
        arraytmp[12] = st.items[i].data.idmovimientocaja;//idmovimientocaja
        arraytmp[13] = st.items[i].data.idfechacierrenomina;//idfechacierrenomina
        arraytmp[14] = st.items[i].data.idanticipo;//idanticipo
        arraytmp[15] = st.items[i].data.idclienteproveedor;
        arraytmp[16] = st.items[i].data.clienteproveedor;
        arraytmp[17] = st.items[i].data.numerosoperenzona;
        arrData.push(arraytmp);
    }
    //importeTotalOperaciones();//se actualiza el importe total de las operaciones
    return arrData;
}
/*Duda creo q no se usa Adriana
 //carga las operaciones del instrumento en el grid dada la operacion
 function cargaroperacionesInst() {
 stgridoperaciones.removeAll();//se limpia el store
 if (arroperacioninst.length > 0) {//si existen operaciones guardadas
 for (var i = 0; i < arroperacioninst.length; i++) {
 stgridoperaciones.insert(i, creaRecordOperaciones(arroperacioninst[i]));//se cargan los datos corresp al dereuobli seleccionado
 }
 //se deshabilita el combo de las operaciones
 // cbmovimientoliq.disable();
 }
 else {//se habilita el combo de las operaciones
 //cbmovimientoliq.enable();
 }
 importeTotalOperaciones();//se actualiza el importe total de las operaciones
 //Ext.getCmp('btnliquidar').enable();//se habilita el btn liquidar
 //cbcuentacontliqui.reset();//se limpia el combo cuenta contable
 //tfsaldoliquidar.reset();//se limpia el campo saldo a liquidar
 }*/
//da formato de recod a un array
function creaRecordOperaciones(arr) {
    arrRecord = new Array();
    recordT = Ext.data.Record.create([{
            name: 'idoperacion'
        }, {
            name: 'descoperacion'
        }, {
            name: 'idctacontable'
        }, {
            name: 'ctacontable'
        }, {
            name: 'ctabancaria'
        }, {
            name: 'moneda'
        }, {
            name: 'importe'
        }, {
            name: 'idctaoperacion'
        }, {
            name: 'signo'
        }, {
            name: 'idctacontrapartida'
        }, {
            name: 'ctacontrapartida'
        }, {
            name: 'idmovimientocaja'
        }, {
            name: 'idfechacierrenomina'
        }, {
            name: 'idanticipo'
        }, {
            name: 'idclienteproveedor'
        }, {
            name: 'clienteproveedor'
        }, {
            name: 'numerosoperenzona'
        }
    ]);
    newrT = new recordT({
        idoperacion: arr[0],
        descoperacion: arr[1],
        idctacontable: arr[2],
        ctacontable: arr[3],
        ctabancaria: arr[4],
        moneda: arr[5],
        importe: arr[6],
        idctaoperacion: arr[7],
        signo: arr[9],
        idctacontrapartida: arr[10],
        ctacontrapartida: arr[11],
        idmovimientocaja: arr[12],
        idfechacierrenomina: arr[13],
        idanticipo: arr[14],
        idclienteproveedor: arr[15],
        clienteproveedor: arr[16],
        numerosoperenzona: arr[17]
    });
    arrRecord.push(newrT);
    return arrRecord;
}
//actualiza el campo importe total de las operaciones
function importeTotalOperaciones() {
    if (stgridoperaciones.getCount() > 0) {//si hay elementos en el grid
        var importe = 0;//almacena el importe total de las oper
        for (var i = 0; i < stgridoperaciones.getCount(); i++) {
            importe += parseFloat(stgridoperaciones.data.items[i].data.importe);
        }
        tfimportetotaloper.setValue(saldo(importe));//se le pasa el importe total de las operaciones realizadas
    } else
        tfimportetotaloper.setValue(saldo(0));// si no tiene oper se le pasa cero
    pagadoOper();//se actualiza el pagado
}
//actualiza el grid info de las operaciones
function actualizaInfoTabOperaciones() {
    sttaboperaciones.removeAll();// se limpia el grid info de las operaciones realizadas
    if (arroperacioninst.length > 0) {//si existen operaciones guardadas
        for (var i = 0; i < arroperacioninst.length; i++) {
            sttaboperaciones.insert(i, creaRecordOperaciones(arroperacioninst[i]));//se cargan los datos corresp al dereuobli seleccionado
        }
    }
}
/*********************************************************************************************/
/*****************************ADICIONAR FILA ANTICIPOS*********************************************/
/*********************************************************************************************/
function addfilaanticipos(ind) {
    var recordT = '';
    var newrT = '';
    var a = '';//almacena el index encontrado
    recordT = Ext.data.Record.create([
        {
            name: 'nocontrato'
        }, {
            name: 'idctacontable'
        }, {
            name: 'ctacontable'
        }, {
            name: 'comentario'
        }, {
            name: 'importe'
        }, {
            name: 'idoperacionpa'
        }, {
            name: 'descoperacionpa'
        }, {
            name: 'idctaoperacionpa'
        }, {
            name: 'idctacontrapartida'
        }, {
            name: 'nombrectacontrapartida'
        }
    ]);

    //si los campos son validos
    if (tfnocontrato.isValid() && tacomentariopa.isValid() && tfmoneda.isValid() && cbmovimientopaa.isValid() && tfimportepa.isValid() && cbcuentadebitarpa.isValid() && cbcuentaacreditarpa.isValid()) {
        //si ya estaba en el grid actualizo el importe
        //cbcuentaacreditarpa
        var idctaoperacionpa = cbmovimientopaa.getValue() + cbcuentadebitarpa.getValue() + cbcuentaacreditarpa.getValue();
        if ((a = stgridanticipo.find('idctaoperacionpa', idctaoperacionpa)) > -1) {
            if (ind == 'Add') {
                newrT = new recordT({
                    nocontrato: tfnocontrato.getValue(),
                    idctacontable: cbcuentadebitarpa.getValue(),
                    ctacontable: cbcuentadebitarpa.getRawValue(),
                    comentario: tacomentariopa.getValue(),
                    importe: parseFloat(stgridanticipo.getAt(a).data.importe) + parseFloat(tfimportepa.getValue()),
                    idoperacionpa: cbmovimientopaa.getValue(),
                    descoperacionpa: cbmovimientopaa.getRawValue(),
                    idctaoperacionpa: idctaoperacionpa,
                    idctacontrapartida: cbcuentaacreditarpa.getValue(),
                    nombrectacontrapartida: cbcuentaacreditarpa.getRawValue()
                });
            }
            else {
                newrT = new recordT({
                    nocontrato: tfnocontrato.getValue(),
                    idctacontable: cbcuentadebitarpa.getValue(),
                    ctacontable: cbcuentadebitarpa.getRawValue(),
                    comentario: tacomentariopa.getValue(),
                    importe: parseFloat(tfimportepa.getValue()),
                    idoperacionpa: cbmovimientopaa.getValue(),
                    descoperacionpa: cbmovimientopaa.getRawValue(),
                    idctaoperacionpa: idctaoperacionpa,
                    idctacontrapartida: cbcuentaacreditarpa.getValue(),
                    nombrectacontrapartida: cbcuentaacreditarpa.getRawValue()
                });
            }
            stgridanticipo.remove(stgridanticipo.getAt(a));//elimina el que estaba
            stgridanticipo.insert(a, newrT);//adiciona la nueva fila con el importe actualizado
        }
        else {//si no esta lo adiciono
            newrT = new recordT({
                nocontrato: tfnocontrato.getValue(),
                idctacontable: cbcuentadebitarpa.getValue(),
                ctacontable: cbcuentadebitarpa.getRawValue(),
                comentario: tacomentariopa.getValue(),
                importe: parseFloat(tfimportepa.getValue()),
                idoperacionpa: cbmovimientopaa.getValue(),
                descoperacionpa: cbmovimientopaa.getRawValue(),
                idctaoperacionpa: idctaoperacionpa,
                idctacontrapartida: cbcuentaacreditarpa.getValue(),
                nombrectacontrapartida: cbcuentaacreditarpa.getRawValue()
            });
            stgridanticipo.add(newrT);//adiciona la nueva fila
        }
        //        arroanticipoinst = creaDataAnticipos(stgridanticipo.data);//se actualiza el array con los datos del grid
        Ext.getCmp('btneliminaranticipo').disable();//se deshabilita el btn eliminar
        Ext.getCmp('btnmodificaranticipo').disable();//se deshabilita el btn eliminar
        if (stcuentadebitarpa.getCount() > 1) {
            Ext.getCmp('cbcuentadebitarpa').reset();//se limpia el combo cuenta contable a debitar
        }
        if (stcuentaacreditarpa.getCount() > 1) {
            Ext.getCmp('cbcuentaacreditarpa').setValue('');
            Ext.getCmp('cbcuentaacreditarpa').setRawValue('');
        }
        Ext.getCmp('tfimportepa').reset();//se limpia el campo importe de la operacion
        Ext.getCmp('tfimporteletraspa').reset();//se limpia el campo importe letras de la operacion
        Ext.getCmp('tacomentariopa').reset();//se limpia el campo comentario

        //Ext.getCmp('cbmovimientopaa').reset();//se limpia el campo operacion
        //Ext.getCmp('tfnocontrato').reset();//se limpia el campo nocontrato
        importeTotalAnticipos(); //actualiza el campo importe total de los anticipos
        pagadoOper('pa');//se actualiza el pagado
    }
    //    importeTotalAnticipos(); //actualiza el campo importe total de los anticipos
    //se le da el foco al combo de la operacion
    cbmovimientopaa.focus(false, 10);
}
/**********************ELIMINAR ANTICIPOS DEL GRID*********************************/
function delfilaanticipos() {
    if (smgridanticipo.getSelected()) {
        var index = stgridanticipo.find('idctaoperacionpa', smgridanticipo.getSelected().data.idctaoperacionpa);
        stgridanticipo.remove(stgridanticipo.getAt(index));
        //        arroanticipoinst = creaDataAnticipos(stgridanticipo.data);//se actualiza el array con los datos del grid
        Ext.getCmp('btneliminaranticipo').disable();//se deshabilita el btn eliminar
        Ext.getCmp('btnmodificaranticipo').disable();//se deshabilita el btn eliminar
        Ext.getCmp('cbcuentadebitarpa').reset();//se limpia el combo cuenta contable a debitar
        Ext.getCmp('tfimportepa').reset();//se limpia el campo importe de la operacion
        Ext.getCmp('tfimporteletraspa').reset();//se limpia el campo importe letras de la operacion
        Ext.getCmp('tacomentariopa').reset();//se limpia el campo comentario
        Ext.getCmp('tfnocontrato').reset();//se limpia el campo nocontrato
        importeTotalAnticipos(); //actualiza el campo importe total de los anticipos
        pagadoOper('pa');//se actualiza el pagado

        if (tfrestopaa.getValue() == tfimportetotalant.getValue() && tfrestopaa.getValue() == '0.00') {
            tfrestopaa.setValue(saldoformateado(tfimporte.getValue()));
        }
    }
    //        importeTotalAnticipos(); //actualiza el campo importe total de los anticipos
    //se le da el foco al combo de la operacion
    cbmovimientopaa.focus(false, 10);
}
/*******FUNCION CARGAR DATOS DEL MODIFICAR ANTICIPO*********************************************/
function cargardatosmodfilaanticipos() {
    Ext.getCmp('tfnocontrato').setValue(smgridanticipo.getSelected().data.nocontrato);
    Ext.getCmp('cbcuentadebitarpa').setValue(smgridanticipo.getSelected().data.idctacontable);
    Ext.getCmp('cbcuentadebitarpa').setRawValue(smgridanticipo.getSelected().data.ctacontable);
    Ext.getCmp('tacomentariopa').setValue(smgridanticipo.getSelected().data.comentario);
    Ext.getCmp('tfimportepa').setValue(saldo(smgridanticipo.getSelected().data.importe));
    Ext.getCmp('tfimporteletraspa').setValue(convertir_a_letras(smgridanticipo.getSelected().data.importe));
    Ext.getCmp('cbmovimientopaa').setValue(smgridanticipo.getSelected().data.idoperacionpa);
    Ext.getCmp('cbmovimientopaa').setRawValue(smgridanticipo.getSelected().data.descoperacionpa);
    Ext.getCmp('cbcuentaacreditarpa').setValue(smgridanticipo.getSelected().data.idctacontrapartida);
    Ext.getCmp('cbcuentaacreditarpa').setRawValue(smgridanticipo.getSelected().data.nombrectacontrapartida);
}
//crea un array con los datos del store operaqciones debitadas
function creaDataAnticipos(st) {
    arrData = new Array();
    for (var i = 0; i < st.getCount(); i++) {
        arraytmp = new Array();
        arraytmp[0] = st.items[i].data.nocontrato;//nocontrato
        arraytmp[1] = st.items[i].data.idctacontable;//idctacontable
        arraytmp[2] = st.items[i].data.ctacontable;//ctacontable
        arraytmp[3] = st.items[i].data.comentario;//comentario
        arraytmp[4] = parseFloat(st.items[i].data.importe);//importe
        arraytmp[5] = Ext.isEmpty(st.items[i].data.idoperacionpa) ? '' : st.items[i].data.idoperacionpa;//id de la operacion
        arraytmp[6] = st.items[i].data.descoperacionpa;//texto de la operacion
        arraytmp[7] = st.items[i].data.idctaoperacionpa;//id cta operacion
        arraytmp[8] = Ext.isEmpty(st.items[i].data.idmovimiento) ? '' : st.items[i].data.idmovimiento;//id cta operacion
        arraytmp[9] = st.items[i].data.idctacontrapartida;//id cta de contrapartida
        arraytmp[10] = st.items[i].data.nombrectacontrapartida;//nombre del cta de contrapartida
        arrData.push(arraytmp);
    }
    return arrData;
}
//carga las operaciones del anticipo en el grid
function cargaranticiposInst() {
    stgridanticipo.removeAll();//se limpia el store
    if (arroanticipoinst.length > 0)//si existen operaciones guardadas
        for (var i = 0; i < arroanticipoinst.length; i++)
            stgridanticipo.insert(i, creaRecordAnticipos(arroanticipoinst[i]));//se cargan los datos corresp al dereuobli seleccionado
    importeTotalAnticipos(); //actualiza el campo importe total de los anticipos
}
//da formato de recod a un array
function creaRecordAnticipos(arr) {
    arrRecord = new Array();
    recordT = Ext.data.Record.create([
        {
            name: 'nocontrato'
        }, {
            name: 'idctacontable'
        }, {
            name: 'ctacontable'
        }, {
            name: 'comentario'
        }, {
            name: 'importe'
        }, {
            name: 'idoperacionpa'
        }, {
            name: 'descoperacionpa'
        }, {
            name: 'idctaoperacionpa'
        }, {
            name: 'idctacontrapartida'
        }, {
            name: 'nombrectacontrapartida'
        }
    ]);
    newrT = new recordT({
        nocontrato: arr[0],
        idctacontable: arr[1],
        ctacontable: arr[2],
        comentario: arr[3],
        importe: arr[4],
        idoperacionpa: arr[5], //id de la operacion
        descoperacionpa: arr[6], //texto de la operacion
        idctaoperacionpa: arr[7], //id cta operacion
        idctacontrapartida: arr[9],
        nombrectacontrapartida: arr[10]
    });
    arrRecord.push(newrT);
    return arrRecord;
}
//actualiza el campo importe total de los anticipos
function importeTotalAnticipos() {
    if (stgridanticipo.getCount() > 0) {//si hay elementos en el grid
        var importe = 0;//almacena el importe total de las oper
        for (var i = 0; i < stgridanticipo.getCount(); i++) {
            importe += parseFloat(stgridanticipo.data.items[i].data.importe);
        }
        tfimportetotalant.setValue(saldo(importe));//se le pasa el importe total de los anticipos realizados
    } else
        tfimportetotalant.setValue(saldo(0));// si no tiene anticipos se le pasa cero
    pagadoOper();//se actualiza el pagado
}
//actualiza el grid info de los anticipos
function actualizaInfoTabAnticipos() {
    sttabanticipo.removeAll();// se limpia el grid info de los anticipos realizadas
    if (arroanticipoinst.length > 0) {//si existen anticipos guardadas
        for (var i = 0; i < arroanticipoinst.length; i++) {
            sttabanticipo.insert(i, creaRecordAnticipos(arroanticipoinst[i]));//se cargan los datos corresp al dereuobli seleccionado
        }
    }
}
/******************************************************************************/
/**********************************FIN ANTICIPOS*******************************/
/******************************************************************************/

//realiza la validacion de dos cadenas iguales
Ext.apply(Ext.form.VTypes, {
    cadvalidator: function(val, field) {
        if (field.initialValField) {
            var cadvalidator = Ext.getCmp(field.initialValField);
            return (val == cadvalidator.getValue());
        }
        return true;
    },
    cadvalidatorText: 'Los n&uacute;meros de documentos no coinciden.'
});

//pone etiquetas a los componentes
function fToolTipShow(component, text) {
    if (!component.ttp)
        component.ttp = new Ext.ToolTip({
            target: component.getEl(),
            autoHeight: true,
            autoWidth: true,
            autoHide: true,
            maxWidth: 200,
            anchor: 'left',
            title: text,
            trackMouse: true
        });
    else
        component.ttp.setTitle(text);
}
/******************************************************************************/
/*************para mostrar la ventana de certificacion*************************/
// Combox "Tipo de Documento"
var sttipodoccertf = new Ext.data.Store({
    url: 'cargartipoDocumento',
    reader: new Ext.data.JsonReader(
            {
                root: 'datos'
            }, [
        {
            name: 'iddoc'
        },
        {
            name: 'diasvigencia'
        },
        {
            name: 'importemin'
        },
        {
            name: 'importemax'
        },
        {
            name: 'tienetalonario'
        },
        {
            name: 'iddocumentos'
        },
        {
            name: 'denominacion'
        }
    ])
});
var cbtipodoccertf = new Ext.form.ComboBox({
    fieldLabel: 'Tipo documento',
    disabledClass: 'disabled-component',
    id: 'cbtipodoccertf',
    mode: 'local',
    resizable: true,
    hideTrigger: true,
    readOnly: true,
    emptyText: 'Seleccione...',
    store: sttipodoccertf,
    valueField: 'iddoc',
    displayField: 'denominacion',
    forceSelection: true,
    anchor: '100%',
    triggerAction: 'all',
    allowBlank: false,
    listeners: {
        render: function(component) {
            /*component.getEl().on('mouseover', function () {
             if (Ext.getCmp('cbtipodoccertf').getValue() != 'Seleccione...' && Ext.getCmp('cbtipodoccertf').getValue().length > 0)
             fToolTipShow(Ext.getCmp('cbtipodoccertf'), Ext.getCmp('cbtipodoccertf').getRawValue());
             });*/
        }
    }
});

// Combox "Cuenta Bancaria"
var stcuentabanccertf = new Ext.data.Store({
    url: 'cargarcuentabancaria',
    reader: new Ext.data.JsonReader({
        root: 'datos'
    }, [
        {
            name: 'idcuentabancaria',
            type: 'string'
        },
        {
            name: 'nombrecuentabancaria',
            type: 'string'
        }
    ])
});
var cbcuentabanccertf = new Ext.form.ComboBox({
    fieldLabel: 'Cuenta bancaria',
    disabledClass: 'disabled-component',
    id: 'cbcuentabanccertf',
    listWidth: 300,
    hideTrigger: true,
    resizable: true,
    readOnly: true,
    mode: 'local',
    emptyText: 'Seleccione...',
    store: stcuentabanccertf,
    valueField: 'idcuentabancaria',
    displayField: 'nombrecuentabancaria',
    allowBlank: false,
    anchor: '100%',
    triggerAction: 'all',
    typeAhead: true,
    listeners: {
        render: function(component) {
            /*component.getEl().on('mouseover', function () {
             if (Ext.getCmp('cbcuentabanccertf').getValue() != 'Seleccione...' && Ext.getCmp('cbcuentabanccertf').getValue().length > 0)
             fToolTipShow(Ext.getCmp('cbcuentabanccertf'), Ext.getCmp('cbcuentabanccertf').getRawValue());
             });*/
        }/*,
         focus :function(f)
         {
         buscarNotalonarioCertf(param[0].tipooperacion);//se manda a cargar el numero talonario
         }*/
    }
});

// TextField "Numero de Documento"
var tfnumerodoccertf = new Ext.form.TextField({
    fieldLabel: 'No. documento', //perfil.etiquetas.lbtfnrodocumento,
    disabled: true,
    disabledClass: 'disabled-component',
    id: 'tfnumerodoccertf',
    style: 'text-align:right',
    editable: true,
    regex: /^\w*$/,
    maskRe: /^\w*$/, // Cualquier car?cter alfanum?rico, incluido el de subrayado. Equivalente a [A-Za-z0-9_].
    maxLength: 16,
    minLength: 1,
    allowBlank: false,
    blankText: 'Este campo es obligatorio.',
    anchor: '100%'
});

//btn chequeanterior
var btnchequeanteriorcertf = new Ext.Button({
    tooltip: 'No. documento anterior',
    style: 'margin:-10 0 -10 0',
    disabled: true,
    id: 'btnchequeanteriorcertf',
//    icon: perfil.dirImg + 'anterior.png',
    iconCls: 'anterior',
    handler: function() {
        docSiquienteAnteriorCertf(false);
    }
});

//btn chequesiguiente
var btnchequesiguientecertf = new Ext.Button({
    tooltip: 'No. documento siguiente',
    style: 'margin:-10 2 -10 0',
    disabled: true,
    id: 'btnchequesiguientecertf',
//    icon: perfil.dirImg + 'siguiente.png',
    iconCls: 'siguiente',
    handler: function() {
        docSiquienteAnteriorCertf(true);
    }
});

//btn cancelarcheque
var btncancelarchequecertf = new Ext.Button({
    tooltip: 'Cancelar cheque',
    style: 'margin:-10 0 -10 0',
    disabled: true,
    id: 'btncancelarchequecertf',
//    icon: perfil.dirImg + 'cancelar.png',
    iconCls: 'cancelar',
    handler: function() {
        if (Ext.getCmp('pcertif').getForm().isValid()) {
            /*se le pasa a mensajeCancelacion()=true para indicar que se esta
             *cancelando desde origen una certificacion
             */
            mensajeCancelacion(true, paramcertificacion);
        }
    }
});

//panel primera fila
var ppanelcertf1 = new Ext.Panel({
    id: 'ppanelcertf1',
    frame: true,
    labelAlign: 'top',
    autoHeight: true,
    items: [{
            layout: 'column',
            items: [{
                    style: 'margin:0 0 0 5',
                    layout: 'form',
                    columnWidth: .30,
                    items: [cbtipodoccertf]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .39,
                    items: [cbcuentabanccertf]
                }, {
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    columnWidth: .30,
                    items: [tfnumerodoccertf]
                }]
        }],
    buttonAlign: 'right',
    buttons: [btnchequeanteriorcertf, btncancelarchequecertf, btnchequesiguientecertf]
});
//tf para validar el nodocumento
var tfvalidarnodocumentocertf = new Ext.form.TextField({
    fieldLabel: 'Validar no. documento',
    id: 'tfvalidarnodocumentocertf',
    style: 'text-align:right',
    disabledClass: 'disabled-component',
    enableKeyEvents: true,
    allowBlank: false,
    anchor: '100%',
    vtype: 'cadvalidator',
    initialValField: 'tfnumerodoccertf',
    listeners: {
        keypress: function(t, e) {
            if (e.getKey() == 13) // Enter
            {
                //tfimporte.focus();
                //return;
            }
        }
    }
});
//  TextField "Importe"
var tfimportecertf = new Ext.form.NumberField({
    fieldLabel: 'Importe',
    disabledClass: 'disabled-component',
    disabled: true,
    id: 'tfimportecertf',
    style: 'text-align:right;',
    anchor: '100%',
    decimalLength: 2, //lugares dep de la coma
    maxLength: 16, // Maximo 13 elementos, y 2 decimales, porque con 19 no convierte bien, se va el entero
    maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerido es 19 caracteres.',
    maskRe: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
    regex: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
    regexText: 'Este campo solo permite n&uacute;meros.',
    allowBlank: false,
    blankText: 'Este campo es obligatorio.',
    msgTarget: 'qtip',
    selectOnFocus: true
});
//  DateField "Fecha Emision"
var dfemisioncertf = new Ext.form.DateField({
    fieldLabel: 'Fecha emisi&oacute;n',
    disabledClass: 'disabled-component',
    maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
    selectOnFocus: true,
    blankText: 'Este campo es obligatorio.',
    editable: true,
    invalidText: 'Formato: dd/mm/aaaa',
    id: 'dfemisioncertf',
    allowBlank: false,
    anchor: '100%',
    format: 'd/m/Y',
    listeners: {
        change: function(dfe, newValue, oldValue) {
            //se buscan los dias de vigencia
            //            var diasvigencia = sttipodoccertf.getAt(sttipodoccertf.find('iddoc', cbtipodoccertf.getValue())).data.diasvigencia;
            //            var fecha = dfemisioncertf.getValue();//se obtiene la fecha seleccionada
            //            fecha.setDate(fecha.getDate()+diasvigencia);//se le suma a la fecha los dias de vigencia de tipo doc
            //            dfvencimientocertf = fecha.format('d/m/Y');//se carga la fecha de vencimiento calculada
        }
    }
});
//  TextField Beneficiario
var tfbeneficiariocertf = new Ext.form.TextField({
    fieldLabel: 'Beneficiario', //perfil.etiquetas.lbtfimporteletras,
    id: 'tfbeneficiariocertf',
    disabledClass: 'disabled-component',
    anchor: '100%',
    disabled: true,
    readOnly: true,
    allowBlank: false,
    blankText: 'Este campo es obligatorio.'
});
//  text area comentario
var tacomentariocertf = new Ext.form.TextArea({
    fieldLabel: 'Comentario', //perfil.etiquetas.lbtfimporteletras,
    id: 'tacomentariocertf',
    disabledClass: 'disabled-component',
    anchor: '100%',
    //disabled: true,
    //readOnly : true,
    allowBlank: false,
    blankText: 'Este campo es obligatorio.'
});

//panel tercera fila
var ppanelcertf = new Ext.Panel({
    labelAlign: 'top',
    frame: true,
    id: 'ppanelcertf',
    autoHeight: true,
    items: [{
            layout: 'column',
            items: [{
                    style: 'margin:10 0 0 5',
                    layout: 'form',
                    columnWidth: .30,
                    items: [dfemisioncertf]
                }, {
                    style: 'margin:10 0 0 10',
                    layout: 'form',
                    columnWidth: .39,
                    items: [tfimportecertf]
                }, {
                    style: 'margin:10 0 0 10',
                    layout: 'form',
                    columnWidth: .30,
                    items: [tfvalidarnodocumentocertf]
                }]
        }, {
            style: 'margin:0 10 0 5',
            layout: 'form',
            items: [tfbeneficiariocertf]
        }, {
            style: 'margin:0 10 0 5',
            layout: 'form',
            items: [tacomentariocertf]
        }]
});
//
var pcertif = new Ext.FormPanel({
    frame: true,
    id: 'pcertif',
    autoHeight: true,
    items: [ppanelcertf1, ppanelcertf]
});

//mustra la ventana para certificar cheques por el metodo certificado (BANDEC)
//@button para flujo normal (indica 1=aceptar, 0=aplicar)
function MostrarWinCertificar(param, button) {
    noWindow = false;//se pone en false para indicar que la ventana fue abierta
    if (winCertificar) {
        winCertificar.buttons[1].setHandler(function() {
            if (Ext.getCmp('pcertif').getForm().isValid()) {
                //caso en que esta certificando por el flujo normal
                if (param[0].iddocumento == 0) {
                    //mensaje de informacion (se van a crear dos inst)
                    mostrarMensaje(2, 'La acci&oacute;n adicionar&aacute; los siguientes instrumentos bancarios:</br></br>'
                            + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + param[0].denominacion + ' ' + param[0].numerodocumento + '</br>'
                            + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + cbtipodoccertf.getRawValue() + ' ' + tfnumerodoccertf.getValue() + '</br></br>'
                            + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                            + '&iquest;Est&aacute; seguro que quiere continuar y realizar la certificaci&oacute;n?<br>', function(btn) {
                                if (btn == 'ok') {
                                    adicionarinstbanc(button, buildArrayFlujoNormal(param));
                                }
                            });
                }
                else {//se ejecuta la funcion para certificar fuera de flujo normal
                    certificaBandec();
                }
            }
        });

        //Funcionalidad del botón siguiente
        Ext.getCmp('btnchequesiguientecertf').setHandler(function() {
            docSiquienteAnteriorCertf(true);
        });

        //Funcionalidad del botón anterior
        Ext.getCmp('btnchequeanteriorcertf').setHandler(function() {
            docSiquienteAnteriorCertf(false);
        });
    }
    if (!winCertificar) {
        winCertificar = new Ext.Window({
            autoValidate: false,
            constrain: true,
            modal: true,
            id: 'winCertificar',
            labelAlign: 'top',
            frame: true,
            resizable: true,
            //bodyStyle : 'padding:5px 5px 5px',
            border: false,
            closeAction: 'hide',
            layout: 'fit',
            title: '',
            width: 650,
            items: pcertif,
            height: 370,
            buttons: [
                {
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
//                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    handler: function() {
                        Ext.getCmp('pcertif').getForm().reset();//se limpia el formulario
                        winCertificar.hide();//se oculta la ventana
                    }
                }, {
                    text: 'Aceptar',
                    tooltip: 'Guardar datos y cerrar ventana',
//                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    handler: function() {
                        if (Ext.getCmp('pcertif').getForm().isValid()) {
                            //caso en que esta certificando por el flujo normal
                            if (param[0].iddocumento == 0) {
                                //mensaje de informacion (se van a crear dos inst)
                                mostrarMensaje(2, 'La acci&oacute;n adicionar&aacute; los siguientes instrumentos bancarios:  </br>'
                                        + param[0].denominacion + ' ' + param[0].numerodocumento + '</br>'
                                        + cbtipodoccertf.getRawValue() + ' ' + tfnumerodoccertf.getValue() + '</br></br>'
                                        + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                                        + '&iquest;Est&aacute; seguro que quiere continuar y realizar la certificaci&oacute;n?<br>', function(btn) {
                                            if (btn == 'ok') {
                                                adicionarinstbanc(button, buildArrayFlujoNormal(param));
                                            }
                                        });
                            }
                            else {//se ejecuta la funcion para certificar fuera de flujo normal
                                certificaBandec();
                            }
                        }
                    }
                }],
            listeners: {
                hide: function(Grid, rowIndex, e) {
                    noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                    Ext.getCmp('pcertif').getForm().reset();//se resetea el formulario

                    Ext.getCmp('btnchequeanteriorcertf').disable();
                    Ext.getCmp('btnchequesiguientecertf').disable();
                },
                show: function(window) {
                    dfemisioncertf.focus(true, true);
                    //Key map del inicio y fin del formulario
                    var btnAccept = window.buttons[1];
                    btnAccept.getEl().addKeyMap([
                        {
                            key: Ext.EventObject.TAB,
                            stopEvent: true,
                            fn: function() {
                                dfemisioncertf.focus(true, true);
                            }
                        }
                    ]);

                    dfemisioncertf.getEl().addKeyMap([
                        {
                            key: Ext.EventObject.TAB,
                            shift: true,
                            stopEvent: true,
                            fn: function() {
                                btnAccept.focus();
                            }
                        }
                    ]);
                }
            }
        });
    }
    winCertificar.setTitle('Certificar ' + param[0].denominacion + ' ' + param[0].numerodocumento);
    winCertificar.show();
    winCertificar.center();
    //se cargan los datos de la ventana
    var recordcuenta = Ext.data.Record.create([
        {
            name: 'idcuentabancaria',
            type: 'string'
        },
        {
            name: 'nombrecuentabancaria',
            type: 'string'
        }]);
    var rcta = new recordcuenta({
        idcuentabancaria: param[0].idcuentabancaria,
        nombrecuentabancaria: param[0].cuentabancaria
    });
    stcuentabanccertf.addSorted(rcta);//se agrega el record al store
    cbcuentabanccertf.setValue(param[0].idcuentabancaria);//se le pasa el valor al combo
    //datos del tipo doc
    var recordtipodoc = Ext.data.Record.create([
        {
            name: 'iddoc'
        },
        {
            name: 'diasvigencia'
        },
        {
            name: 'importemin'
        },
        {
            name: 'importemax'
        },
        {
            name: 'tienetalonario'
        },
        {
            name: 'iddocumentos'
        },
        {
            name: 'denominacion'
        }
    ]);

    var rtipodoc = new recordtipodoc({
        iddoc: param[1].idtipodocumento,
        diasvigencia: param[1].diasvigencia,
        importemin: param[1].importemin,
        importemax: param[1].importemax,
        tienetalonario: param[1].tienetalonario,
        iddocumentos: param[1].iddocumentos,
        denominacion: param[1].denominacion
    });
    sttipodoccertf.addSorted(rtipodoc);//se agrega el record al store
    cbtipodoccertf.setValue(param[1].idtipodocumento);//se le pasa el valor al combo
    tfbeneficiariocertf.setValue(param[2].nombre);//beneficiario
    tacomentariocertf.setValue('Ampara ' + param[0].denominacion + ' ' + param[0].numerodocumento);//comentario
    tfimportecertf.setValue(param[0].importeor);//importe
    tfimportecertf.setRawValue(saldo(param[0].importeor));//importe
    if (param[0].iddocumento != 0) {//caso en que certifica desde el btn
        dfemisioncertf.setMinValue(param[0].fechacreacion.format('d/m/Y'));
        dfemisioncertf.setRawValue(param[0].fechacreacion.format('d/m/Y'));
        buscarNotalonarioCertf(param[0].tipooperacion);//se manda a cargar el numero talonario
    }
    else {
        //caso en que certifica desde el flujo normal
        dfemisioncertf.setMinValue(param[0].fechacreacion);
        dfemisioncertf.setRawValue(param[0].fechacreacion);
        buscarNotalonarioCertf(param[0].tipooperacion, 1);//se manda a cargar el numero talonario
    }
    //se buscan los dias de vigencia
    //    var diasvigencia = sttipodoccertf.getAt(sttipodoccertf.find('iddoc', cbtipodoccertf.getValue())).data.diasvigencia;
    //    var fecha = dfemisioncertf.getValue();//se obtiene la fecha seleccionada
    //    fecha.setDate(fecha.getDate()+diasvigencia);//se le suma a la fecha los dias de vigencia de tipo doc
    //    dfvencimientocertf = fecha.format('d/m/Y');//se carga la fecha de vencimiento calculada

    //certifica por el metodo BANDEC (Cheque certificado)
    function certificaBandec() {
        loadMessageBox('Certificando');
        if (tfbeneficiariocertf.getValue())
            var aux = [param[2].idbanco, 1, 1];
//        var arrayidinst = new Array();//almacena los id de los instrumentos a certificar
//        var arrayimportemo = new Array();//almacena el importe de los instrumentos a certificar
//        arrayidinst.push(param[0].iddocumento);
//        arrayimportemo.push(param[0].importemo);
        parametros = {
            beneficiario: aux,
            idcuentabancaria: cbcuentabanccertf.getValue(),
            iddoc: cbtipodoccertf.getValue(),
            desctipodoc: cbtipodoccertf.getRawValue(), //tipo doc
            desctipodocor: param[0].denominacion + ' ' + param[0].numerodocumento, //tipo doc origen
            tfnumerodoc: tfnumerodoccertf.getValue(),
            numinstorigen: param[0].numerodocumento,
            dfemision: dfemisioncertf.getRawValue(),
            dfaceptacion: dfemisioncertf.getRawValue(),
            dfvencimiento: dfemisioncertf.getRawValue(),
            idtalonario: idTalonariocertf, //se manda el id cargado para certificar
            entradasalida: param[0].tipooperacion,
            comentario: tacomentariocertf.getRawValue(), //carga el motivo de cancelacion
            idinstrumento: param[0].iddocumento/*arrayidinst*/,
            importemo: param[0].importemo/*arrayimportemo*/,
            tipo: verLetra(), // Devuelve 0 si es leetra y 1 sino es
            idestadodoccomunfinanzas: 6 //En el flujo normal ya va como Contabilizado
        };
        Ext.Ajax.request({
            url: 'certfcertificado',
            method: 'POST',
            params: {
                parametros: Ext.encode(parametros)
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                Ext.MessageBox.hide();
                winCertificar.hide();
                Ext.getCmp('pcertif').getForm().reset();
                if (responseData == undefined)
                    mostrarMensaje(1, 'El instrumento no se pudo adicionar porque ocurrieron errores durante la operaci&oacute;n solicitada.');
                else {
                    switch (responseData.success) {
                        case -1:
                            mostrarMensaje(1, 'El instrumento bancario ha sido certificado satisfactoriamente.');
                            limpiardatos(1, 'accaplicar');
                            stinstrumentobanc.reload();
                            break;
                        case -2 :
                            mostrarMensaje(1, 'No se puede certificar con este n&uacute;mero de talonario.');
                            break;
                        case -3 :
                            mostrarMensaje(1, 'No se pudo guardar el instrumento debido a la ocurrencia de errores cuando se gener&oacute; el n&uacute;mero de talonario.');
                            break;
                        case -4 :
                            mostrarMensaje(1, 'No se encontrad&oacute; moneda para cuenta seleccionada.');
                            break;
                        case -5 :
                            mostrarMensaje(1, 'Ocurrieron errores en el env&iacute;o de datos de las liquidaciones del instrumento.');
                            break;
                        case -6 :
                            mostrarMensaje(1, 'No se puede guardar el instrumento. El n&uacute;mero de documento est&aacute; actualmente en uso <br>por otro instrumento para el tipo de documento y cuenta seleccionados.</br>');
                            break;
                        case -7 :
                            mostrarMensaje(1, 'No se puede guardar el instrumento. No se encontr&oacute; la operaci&oacute;n contable de lo que se quiere liquidar.');
                            break;
                        case -8 :
                            mostrarMensaje(1, 'No se puede guardar el instrumento. No se encontr&oacute; la operaci&oacute;n asociada a la cuenta de ingreso.');
                            break;
                        case -9 :
                            mostrarMensaje(1, 'No se puede guardar el instrumento. No se encontr&oacute; la operaci&oacute;n asociada a la cuenta de gasto.');
                            break;
                        default :
//                            mostrarMensaje(1, 'El instrumento ha sido certificado satisfactoriamente con el n&uacute;mero: ' + responseData.numeroinst + '.');
                            mostrarMensaje(1, 'El instrumento bancario ha sido certificado satisfactoriamente.');
                            limpiardatos(1, 'accaplicar');
                            //stinstrumentobanc.reload();
                            break;
                    }
                }
                stinstrumentobanc.reload();
            }
        });//fin Ajax.request "certfcertificado"
    }

    //construye el array con los datos para certificar por el flujo normal
    function buildArrayFlujoNormal(param) {
        if (tfbeneficiariocertf.getValue())
            var aux = [param[2].idbanco, 1, 1];
        arrayData = {
            beneficiario: Ext.encode(aux),
            idcuentabancaria: cbcuentabanccertf.getValue(),
            iddoc: cbtipodoccertf.getValue(),
            desctipodoc: cbtipodoccertf.getRawValue(), /*tipo doc */
            desctipodocor: param[0].denominacion + ' ' + param[0].numerodocumento, /*tipo doc origen*/
            nomtipodoc: parseInt(param[1].iddocumentos),
            tfnumerodoc: tfnumerodoccertf.getValue(),
            dfemision: dfemisioncertf.getRawValue(),
            dfaceptacion: dfemisioncertf.getRawValue(),
            dfvencimiento: dfemisioncertf.getRawValue(),
            idtalonario: idTalonariocertf, //se manda el id cargado para certificar
            importemo: tfimportecertf.getValue(),
            entradasalida: param[0].tipooperacion,
            tipo: verLetra(), // Devuelve 0 si es leetra y 1 sino es
            comentario: tacomentariocertf.getRawValue(), //carga el motivo de cancelacion
            operaciondeliq: (Ext.isEmpty(operaciondeliq)) ? '' : operaciondeliq
        };
        data = new Array();
        data.push(arrayData);
        return data;
    }
}

//construye el array con los datos del instrmento
function buildArrayDataInst() {
    var dat = sttipodoc.getAt(sttipodoc.find('iddoc', cbtipodoc.getValue())).data;

    // Beneficiarios
    var a = new Array();
    var b = new Array();
    var aux = new Array();
    if (cbxbeneficiario.getValue()) {
        //Esto no funcionaba by furet
        //a[0] = stbeneficiario.getAt(0).get('id'); //328; //cbxbeneficiario.getValue();
        //a[1] = stbeneficiario.getAt(0).get('tipo'); // 1
        //a[2] = 1; // 1-idcliente, 2-idrecibe, 3-identrega
        //Esta es la nueva solucion furet
        a[0] = cbxbeneficiario.getValue();
        a[1] = cbxtipobeneficiario.getValue();
        a[2] = 1; // 1-idcliente, 2-idrecibe, 3-identrega
        aux.push(a);   // El beneficiario: antiguamente proveedor
    }
    if (cbrecibidopor.getValue()) {
        //Esto no funcionaba by furet
        //b[0] = strecibidopor.getAt(0).get('id'); //cbrecibidopor.getValue(),   // 1
        //b[1] = strecibidopor.getAt(0).get('tipo'); //cbrecibidopor.getValue(),   // 4
        //b[2] = 2; // 1-idcliente, 2-idrecibe, 3-identrega
        //Esta es la nueva solucion furet
        b[0] = cbrecibidopor.getValue();
        b[1] = cbxtiporecibidopor.getValue();
        b[2] = 2; // 1-idcliente, 2-idrecibe, 3-identrega
        aux.push(b);   // El recibidopor
    }

    arrayData = {
        idcuentabancaria: cbcuentabanc.getValue(),
        tipobeneficiario: cbxtipobeneficiario.getValue(),
        iddoc: cbtipodoc.getValue(),
        nomtipodoc: parseInt(dat.iddocumentos),
        idbeneficiario: cbxbeneficiario.getValue(), // Cliente o proveedor casi siempre
        tfpagado: tfpagado.getValue(),
        tfnumerodoc: tfnumerodoc.getValue(),
        tfimporte: tfimporte.getValue(),
        dfemision: dfemision.getRawValue(),
        dfaceptacion: dfaceptacion.getRawValue(),
        dfvencimiento: dfvencimiento.getRawValue(),
        //idsolicitud     : tfnumsolicitud.getValue(),
        idrecibidopor: cbrecibidopor.getValue(),
        tiporecibidopor: cbxtiporecibidopor.getValue(),
        tacomentario: tacomentario.getValue(),
        idtalonario: idTalonario,
        entradasalida: cbtipoOpInstr.getValue(),
        idespecialidad: cbEspecialidad2.getValue(),
//                idespecialidad: comboIframe1.fSelect.values[0],
        descripcionespecialidad: cbEspecialidad2.getRawValue(),
        idmoneda: stmonedatasa.getAt(0).get('idmoneda'), //idmonedaV,
        tipo: verLetra(), // Devuelve 0 si es leetra y 1 sino es
        movimiento: Ext.encode(getDatosOperacion()), // Busca los datos asociados a los movimeintos asociados (liquid, reembolso, pagos antic)
        beneficiario: Ext.encode(aux),
        operaciondeliq: (Ext.isEmpty(operaciondeliq)) ? '' : operaciondeliq
    };
    data = new Array();
    data.push(arrayData);
    return data;
}

//funcion para graficar los estados del instrumento
function GraficarEstadosInstrumento() {
    noWindow = false;//se pone en false para indicar que la ventana fue abierta
    lMaskBuscar = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    lMaskBuscar.show();

    Ext.Ajax.request({
        url: 'graficarEstadosInstrumento',
        method: 'POST',
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            var datos = responseData;

            if (datos.length > 0) {
                var w_graficar = new Ext.Window({
                    autoValidate: false,
                    constrain: true,
                    title: 'Estado de los instrumentos bancarios',
                    id: 'w_graficar',
                    closable: true,
                    height: 400,
                    html: '<div id="container" style="width: 630px; height: 370px; margin: 0 auto"></div>',
                    layout: 'fit',
                    modal: true,
                    resizable: false,
                    width: 630,
                    listeners: {
                        hide: function(Grid, rowIndex, e) {
                            noWindow = true;//se pone en true para indicar que la ventana fue cerrada
                        }
                    }
                });
                w_graficar.show();
                w_graficar.center();
                lMaskBuscar.hide();

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
                        formatter: function() {
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
                                formatter: function() {
                                    return '<b>' + this.point.name + '</b>: ' + this.point.cant + '<br>' + this.point.y + ' %';
                                }
                            }
                        }
                    },
                    series: [{
                            type: 'pie',
                            name: '',
                            data: datos
                        }]
                });
            }
            else {
                mostrarMensaje(1, 'No existen datos que mostrar.');
                lMaskBuscar.hide();
            }
        },
        params: {
            numero: Ext.getCmp('tfbuscarnum').getValue(),
            estado: Ext.getCmp('comboEstado').getValue(),
            idejercicio: Ext.getCmp('cmbEjercicio').getValue(),
            idperiodo: Ext.getCmp('cmbPeriodo').getValue(),
            fechainicio: Ext.getCmp('dffechainicio').getRawValue(),
            fechafin: Ext.getCmp('dffechafin').getRawValue(),
            importe: (Ext.getCmp('tfimportebuscar').getValue()) ? parseFloat(Ext.getCmp('tfimportebuscar').getValue()) : '',
            idtipodocumento: (Ext.getCmp('cbtipodocbuscar').getRawValue()) ? stinstrumentobanc.baseParams.idtipodocumento = Ext.getCmp('cbtipodocbuscar').getValue() : '',
            idbeneficiario: (Ext.getCmp('cbxbeneficiarioBuscar').getRawValue()) ? stinstrumentobanc.baseParams.idbeneficiario = Ext.getCmp('cbxbeneficiarioBuscar').getValue() : '',
            idrecibido: (Ext.getCmp('cbrecibidoporBuscar').getRawValue()) ? stinstrumentobanc.baseParams.idrecibido = Ext.getCmp('cbrecibidoporBuscar').getValue() : '',
            idcuentabancaria: (Ext.getCmp('cbcuentabancbuscar').getRawValue()) ? stinstrumentobanc.baseParams.idcuentabancaria = Ext.getCmp('cbcuentabancbuscar').getValue() : '',
            idespecialidad: (Ext.getCmp('cbEspecialidadBuscar').getRawValue()) ? stinstrumentobanc.baseParams.idespecialidad = Ext.getCmp('cbEspecialidadBuscar').getValue() : '',
            buscando: (stinstrumentobanc.baseParams.buscando) ? stinstrumentobanc.baseParams.buscando : 0
        }
    });

}

function calcularImporteTotalTab() {
    var suma = 0;
    if (sttabliquidar.getCount() >= 0) {
        for (var i = 0; i <= sttabliquidar.getCount() - 1; i++) {
            suma += parseFloat(sttabliquidar.data.items[i].data.impliquidar);
        }
    }

    if (sttabanticipo.getCount() >= 0) {
        for (var a = 0; a <= sttabanticipo.getCount() - 1; a++) {
            suma += parseFloat(sttabanticipo.data.items[a].data.importe);
        }
    }
    if (sttaboperaciones.getCount() >= 0) {
        for (var o = 0; o <= sttaboperaciones.getCount() - 1; o++) {
            suma += parseFloat(sttaboperaciones.data.items[o].data.importe);
        }
    }
    /*if(streemblso.getCount() >= 0){ // para cuando  este listo  reembolso
     for(var r = 0 ;r <= streemblso.getCount()-1;r++){
     suma  += parseFloat(streemblso.data.items[r].data.importemo);
     }
     }*/

    return suma;
}

//Función necesaria para llevar el múmmero del documento hacia delante y hacia detrás
function docSiquienteAnterior(siguiente) {
    var noDocactual = parseInt(tfnumerodoc.getValue());
    var usados = noDocUsados;

    //Filtrado por solo los números de documento
    var onlynoDocs = new Array();
    if (usados.length > 0) {
        Ext.each(usados, function(doc, index, allarr) {
            onlynoDocs.push(doc.numerodocumento);
        });
    }

    var longformato = generado[3];
    var inicio = generado[4];
    var fin = generado[5];
    if (siguiente) {
        //Esto pasa si presionó el botón siguiente
        if (noDocactual == fin) {
            mostrarMensaje(1, 'El n&uacute;mero de documento actual es el &uacute;ltimo del talonario.');
        }
        else {
            noDocactual++;
            var newDoc = cerosIzq(noDocactual, longformato);
            var index = onlynoDocs.indexOf(newDoc);
            if (index === -1) {
                //Esto quiere decir que no lo encontró, por tanto se setea el valor
                tfnumerodoc.setValue(newDoc);
            }
            else { //Si encontró el número de documento
                if (index === onlynoDocs.length - 1) {
                    //cuando la posición encontrada del documento es la última
                    //del arreglo
                    if (noDocactual == fin) {
                        mostrarMensaje(1, 'No hay disponibilidad de n&uacute;meros siguientes.');
                    }
                    else {
                        noDocactual++;
                        tfnumerodoc.setValue(cerosIzq(noDocactual, longformato));
                    }
                }
                else {
                    var flag = false;
                    for (var i = index + 1, long = onlynoDocs.length; i < long; i++) {
                        noDocactual++;
                        if (onlynoDocs.indexOf(cerosIzq(noDocactual, longformato)) === -1) {
                            tfnumerodoc.setValue(cerosIzq(noDocactual, longformato));
                            flag = true;
                            break;
                        }
                    }

                    if (!flag) {
                        if (noDocactual == fin) {
                            mostrarMensaje(1, 'No hay disponibilidad de n&uacute;meros siguientes.');
                        }
                        else {
                            noDocactual++;
                            tfnumerodoc.setValue(cerosIzq(noDocactual, longformato));
                        }
                    }
                }
            }
        }
    }
    else {
        //Esto pasa si presionó el botón anterior
        if (noDocactual == inicio) {
            mostrarMensaje(1, 'El n&uacute;mero de documento actual es el primero del talonario.');
        }
        else {
            noDocactual--;
            var newDoc = cerosIzq(noDocactual, longformato);
            var index = onlynoDocs.indexOf(newDoc);
            if (index === -1) {
                //Esto quiere decir que no lo encontró, por tanto se setea el valor
                tfnumerodoc.setValue(newDoc);
            }
            else { //Si encontró el número de documento
                if (index === 0) {
                    //cuando la posición encontrada del documento es la primera
                    //del arreglo
                    if (noDocactual == inicio) {
                        mostrarMensaje(1, 'No hay disponibilidad de n&uacute;meros anteriores.');
                    }
                    else {
                        noDocactual--;
                        tfnumerodoc.setValue(cerosIzq(noDocactual, longformato));
                    }
                }
                else {
                    var flag = false;
                    for (var i = index - 1; i >= 0; i--) {
                        noDocactual--;
                        if (onlynoDocs.indexOf(cerosIzq(noDocactual, longformato)) === -1) {
                            tfnumerodoc.setValue(cerosIzq(noDocactual, longformato));
                            flag = true;
                            break;
                        }
                    }

                    if (!flag) {
                        if (noDocactual == inicio) {
                            mostrarMensaje(1, 'No hay disponibilidad de n&uacute;meros anteriores.');
                        }
                        else {
                            noDocactual--;
                            tfnumerodoc.setValue(cerosIzq(noDocactual, longformato));
                        }
                    }
                }
            }
        }
    }

    //Validad el campo de confirmación
    tfvalidarnodocumento.validate();
}

//Función necesaria para llevar el múmmero del documento hacia delante y hacia detrás
//pero en la ventana del certificar
function docSiquienteAnteriorCertf(siguiente) {
    var noDocactual = parseInt(tfnumerodoccertf.getValue());
    var usados = noDocUsadosCertf;

    //Filtrado por solo los números de documento
    var onlynoDocs = new Array();
    if (usados.length > 0) {
        Ext.each(usados, function(doc, index, allarr) {
            onlynoDocs.push(doc.numerodocumento);
        });
    }

    var longformato = generadoCertf[3];
    var inicio = generadoCertf[4];
    var fin = generadoCertf[5];
    if (siguiente) {
        //Esto pasa si presionó el botón siguiente
        if (noDocactual == fin) {
            mostrarMensaje(1, 'El n&uacute;mero de documento actual es el &uacute;ltimo del talonario.');
        }
        else {
            noDocactual++;
            var newDoc = cerosIzq(noDocactual, longformato);
            var index = onlynoDocs.indexOf(newDoc);
            if (index === -1) {
                //Esto quiere decir que no lo encontró, por tanto se setea el valor
                tfnumerodoccertf.setValue(newDoc);
            }
            else { //Si encontró el número de documento
                if (index === onlynoDocs.length - 1) {
                    //cuando la posición encontrada del documento es la última
                    //del arreglo
                    if (noDocactual == fin) {
                        mostrarMensaje(1, 'No hay disponibilidad de n&uacute;meros siguientes.');
                    }
                    else {
                        noDocactual++;
                        tfnumerodoccertf.setValue(cerosIzq(noDocactual, longformato));
                    }
                }
                else {
                    var flag = false;
                    for (var i = index + 1, long = onlynoDocs.length; i < long; i++) {
                        noDocactual++;
                        if (onlynoDocs.indexOf(cerosIzq(noDocactual, longformato)) === -1) {
                            tfnumerodoccertf.setValue(cerosIzq(noDocactual, longformato));
                            flag = true;
                            break;
                        }
                    }

                    if (!flag) {
                        if (noDocactual == fin) {
                            mostrarMensaje(1, 'No hay disponibilidad de n&uacute;meros siguientes.');
                        }
                        else {
                            noDocactual++;
                            tfnumerodoccertf.setValue(cerosIzq(noDocactual, longformato));
                        }
                    }
                }
            }
        }
    }
    else {
        //Esto pasa si presionó el botón anterior
        if (noDocactual == inicio) {
            mostrarMensaje(1, 'El n&uacute;mero de documento actual es el primero del talonario.');
        }
        else {
            noDocactual--;
            var newDoc = cerosIzq(noDocactual, longformato);
            var index = onlynoDocs.indexOf(newDoc);
            if (index === -1) {
                //Esto quiere decir que no lo encontró, por tanto se setea el valor
                tfnumerodoccertf.setValue(newDoc);
            }
            else { //Si encontró el número de documento
                if (index === 0) {
                    //cuando la posición encontrada del documento es la primera
                    //del arreglo
                    if (noDocactual == inicio) {
                        mostrarMensaje(1, 'No hay disponibilidad de n&uacute;meros anteriores.');
                    }
                    else {
                        noDocactual--;
                        tfnumerodoccertf.setValue(cerosIzq(noDocactual, longformato));
                    }
                }
                else {
                    var flag = false;
                    for (var i = index - 1; i >= 0; i--) {
                        noDocactual--;
                        if (onlynoDocs.indexOf(cerosIzq(noDocactual, longformato)) === -1) {
                            tfnumerodoccertf.setValue(cerosIzq(noDocactual, longformato));
                            flag = true;
                            break;
                        }
                    }

                    if (!flag) {
                        if (noDocactual == inicio) {
                            mostrarMensaje(1, 'No hay disponibilidad de n&uacute;meros anteriores.');
                        }
                        else {
                            noDocactual--;
                            tfnumerodoccertf.setValue(cerosIzq(noDocactual, longformato));
                        }
                    }
                }
            }
        }
    }

    //Validad el campo de confirmación
    tfvalidarnodocumentocertf.validate();
}

//Función para poner los ceros en la isquierda de acuerdo a una longitud
function cerosIzq(num, long) {
    num = num.toString();
    return num.length < long ? cerosIzq("0" + num, long) : num;
}

//Función para validar el formulario principal de la ventana del instrumento
//para poder activar el boton para adicionar las operaciones
function validatePrincipalForm() {
    var valid = false;

    valid = (cbtipodoc.isValid() && cbcuentabanc.isValid() && dfemision.isValid() && tfvalidarnodocumento.isValid()
            && tfimporte.isValid() && cbxtipobeneficiario.isValid() && cbxbeneficiario.isValid() && cbxtiporecibidopor.isValid()
            && cbrecibidopor.isValid());

    btnventana.setDisabled(!valid);
    validateForms();
}

function validateForms() {
    fpadicionarinst.items.items.forEach(function (currentValue, index, array) {
        currentValue.getForm().isValid();
    });
}

//Función que sirve para limpiar los datos de las operaciones
function limpiarDatosOperaciones() {
    //Limpiar liquidaciones
    arroperliquidacionaux = new Array();
    arroperliquidacion = new Array();
    arrtabliquidacion = new Array();
    valoresEnVentLiq = 0;
    sttabliquidar.removeAll();
    stliquidar.removeAll();
    stliquidaciones.removeAll();
    cbmovimientoliq.reset();
    cbcuentacontliqui.reset();
    tfsaldoliquidar.reset();
    tfnumero.reset();
    cbfiltrotipodoc.reset();
    tffechaInicio.reset();
    tffechaFin.reset();

    //Limpiar cobros o pagos anticipados
    valoresEnVentPa = 0;
    arroanticipoinst = new Array();
    stgridanticipo.removeAll();
    sttabanticipo.removeAll();
    fppagoanticipado.getForm().reset();

    //Limpiar otras operaciones
    valoresEnVentOp = 0;
    fpoperaciones.getForm().reset();
    stgridoperaciones.removeAll();
    sttaboperaciones.removeAll();
    arroperacioninst = new Array();

    //Otras cosas necesaria para la limpieza
    abrioperacion = false;
    soloLectura = false;
    pagadoOper();
    pagado();
}

function despuesdeAplicar() {

    var currentValue = cbtipoOpInstr.getValue();

    //Borra las operaciones configuradas
    limpiarDatosOperaciones();

    //Datos iniciales
    cargadatosiniciales(currentValue);

    prepareGrids();

    cbtipoOpInstr.setValue(currentValue);
}

// Funcion general para usar por todos las interfaces
function MostrarEtiquetas(componente, mensaje) {
    lMasktemp = new Ext.LoadMask(componente, {
        msg: mensaje
    });
    lMasktemp.show();
}

function loadMessageBox(msg) {
    Ext.MessageBox.show({
        title: 'Por favor espere...',
        msg: msg,
        width: 300,
        progress: true,
        closable: false
    });
    var f = function(v) {
        return function() {
            var i = v / 11;
            Ext.MessageBox.updateProgress(i);
        };
    };
    for (var i = 1; i < 12; i++)
        setTimeout(f(i), i * 500);
}

function MessageBoxDialogs(type, msg, fn) {
    if (type == 1) {/*Si|No*/
        t = 'Confirmaci&oacute;n';//
        buttons = Ext.Msg.YESNO;
        icon = Ext.MessageBox.QUESTION;
    }
    if (type == 2) {/*Si|No*/
        t = 'Confirmaci&oacute;n';//
        buttons = Ext.MessageBox.OKCANCEL;
        icon = Ext.MessageBox.QUESTION;
    }
    if (type == 4) {/*Si|No|Cancelar*/
        t = 'Confirmaci&oacute;n';//
        buttons = Ext.Msg.YESNOCANCEL;
        icon = Ext.MessageBox.QUESTION;
    }
    Ext.Msg.show({
        title: t,
        buttons: buttons,
        msg: msg,
        icon: icon,
        fn: fn
    });


}

function btnLiquidarHandler(records) {
    // var records = smliquidar.getSelections();
    if (records.length > 1) {//si se selecciono mas de una fila y los campos cta contable e importe son validos
        var arrayIds = new Array();

        for (var i = 0; i < records.length; i++) {
            if (records[i].get('liquidarimp') > 0 && records[i].get('idcuentacontable')) {
                arrayIds.push(records[i].data.id);
            }
        }

        if (arrayIds.length >= 1)//si se selecciono mas de uno que no se ha liquidado
            liquidarVariasFacturas(arrayIds);
    } else {
        addfilaliquidacion('Add', records[0]); //se adiciona la unica fila
    }
}

function mostrarClienteProveedorOper() {
    Ext.getCmp('idtfimporteletrasoper').columnWidth = 0.4;
    Ext.getCmp('cbxbeneficia').show();
    Ext.getCmp('btnImportarEnzona').show();
    var cm = Ext.getCmp('gpoperaciones').getColumnModel();
    var index = cm.getIndexById('clienteproveedorrr');
    cm.setHidden(index, false);
    fpoperaciones.doLayout();
}

function ocultarClienteProveedorOper() {
    Ext.getCmp('idtfimporteletrasoper').columnWidth = 0.8;
    Ext.getCmp('cbxbeneficia').hide();
    Ext.getCmp('btnImportarEnzona').hide();
    var cm = Ext.getCmp('gpoperaciones').getColumnModel();
    var index = cm.getIndexById('clienteproveedorrr');
    cm.setHidden(index, true);
    fpoperaciones.doLayout();
}
