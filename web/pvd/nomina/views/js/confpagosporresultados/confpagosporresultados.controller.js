Ext.ns('Pvd.Nomina.Confpagoxresultados');

Pvd.Nomina.Confpagoxresultados.Controlador = {
    init: function (idioma, vista, modelo) {
        this.nodosseleccionados = new Array();
        var self = this;
        var orden;
        var cambioorden;
        var variables = {
            accion: 'Add',
            arrayindicadores: new Array(),
            arrayidsexpresionmatematica: new Array(),
            orden: -1
        };
        //vista.winMostrarConfPagoResultados.maximize();

        vista.btnEliminarpagos.disable();
        vista.btnAdicionarIndicadores.disable();
        vista.btnModificarIndicadores.disable();
        vista.btnEliminarIndicadores.disable();
        vista.btnEliminarCargos.disable();
        vista.btnAdicionarCargos.disable();
        vista.btnSubirfila.disable();
        vista.btnBajarfila.disable();


        modelo.stPagosxresultados.load({params:{start:0, limit:1000}});
        
        vista.cbtipovalor.on('select', function (f, n, o) { //1-Campos de la nómina; 2-Reportes de entrada; 3-Calculable
            //Habilitar y deshabilitar los tab panel

            if (n.data.idtipovalor == 2) {
                vista.tpEntradasalida.activate('entrada');
                vista.tpEntradasalida.getComponent('entrada').enable();
            } else if (n.data.idtipovalor == 1 || n.data.idtipovalor == 3) {
                vista.tpEntradasalida.activate('salida');
                vista.tpEntradasalida.getComponent('entrada').disable();
            }
            //Habilitar el treecombo Campos de las nominas
            if (n.data.idtipovalor == 1) {
                vista.treeComboCamposNomina.enable();

            } else {
                vista.treeComboCamposNomina.disable();
                vista.treeComboCamposNomina.clearValue();
                //vista.treeComboCamposNomina.reset();
                // vista.treeComboCamposNomina.setValue('');
            }
        });

        vista.btnAdicionarpagos.setHandler(function () {
            vista.winAddtipopago.setTitle('Adicionar tipo de pago');
            vista.btnAplicar.show();
            vista.winAddtipopago.show();
        });

        vista.btnreplicar.setHandler(function () {
            vista.winEstructurareplicar.show();
        }.createDelegate(this));

        vista.btnAdicionarCargos.on('click', function () {
            vista.winAddcargosporarea.setTitle('Adicionar cargos al pago');
            vista.btnAplicarcargos.show();
            vista.winAddcargosporarea.show();
        });

        vista.btnCancelar.setHandler(function () {
            vista.winAddtipopago.hide();
        });

        vista.btnAplicar.setHandler(function () {

        });

        vista.btnAceptar.setHandler(function () {

            AddorUp();
        });

        vista.tpAreas.on('checkchange', function (nodo, e) {

            var seleccionados = new Array();
            var a = vista.tpAreas.getChecked();

            for (i = 0; i < a.length; i++) {
                seleccionados.push(a[i].id);
            }

            modelo.stArea.load({params: {idarea: Ext.encode(seleccionados), idpagoporresultado: vista.smPagosxresultados.getSelected().data.idpagoporresultado}});


        });

        vista.smPagosxresultados.on('rowselect', function (nodo, e, row) {
            vista.taFormulaIndicador.disable();
            vista.taFormulaSumatoria.disable();
            vista.btnGuardarOrdenInd.enable();
            var pagos = new Array();
            pagos = vista.smPagosxresultados.getSelections();
            // console.info(pagos.length);
            var arraypagos = new Array();
            for (i = 0; i < pagos.length; i++) {
                arraypagos.push({
                    idpagoporresultado: pagos[i].data.idpagoporresultado
                });

            }
            if(arraypagos.length>0){
                vista.btnreplicar.enable();
            }else{
                vista.btnreplicar.enable();
            }

            if (row.data.estado == 2) {
                vista.btnEliminarpagos.disable();
                vista.btnAdicionarIndicadores.disable();
                vista.btnModificarIndicadores.disable();
                vista.btnEliminarIndicadores.disable();
                vista.btnAdicionarCargos.disable();
                vista.btnEliminarCargos.disable();

            } else if (row.data.estado == 1) {
                if (pagos.length == 0) {

                    vista.btnEliminarpagos.disable();
                    vista.btnAdicionarIndicadores.disable();
                    vista.btnModificarIndicadores.disable();
                    vista.btnEliminarIndicadores.disable();
                    vista.btnAdicionarCargos.disable();
                    vista.btnEliminarCargos.disable();
                } else {
                    vista.btnEliminarpagos.enable();
                    vista.btnAdicionarIndicadores.enable();
                    vista.btnAdicionarCargos.enable();
                }

            }
            modelo.stAreaI.load({params: {idpagoporresultado: Ext.encode(arraypagos)}});
            modelo.stIndicadores.load({params: {idpagoporresultado: Ext.encode(arraypagos)}});

            //Cargando los indicadores
            Ext.Ajax.request({
                url: 'obtenerIndicadoresFormulas',
                method: 'POST',
                params: {
                    idpagoporresultado: Ext.encode(arraypagos)
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    variables.arrayindicadores = responseData.indicadores;
                }.createDelegate(this)
            });
        });

        //Replicar
        vista.pobjestructurareplicar.on('uncheckednode', function (sm, nodo) {
            if(nodo.attributes.id!=this.identidad){
                var index = this.nodosseleccionados.indexOf(nodo.attributes.id);
                if (index > -1) {
                    this.nodosseleccionados.splice(index, 1);
                }
            }


        }.createDelegate(this));

        vista.pobjestructurareplicar.on('checkednode', function (sm, nodo) {
            if(nodo.attributes.id!=this.identidad){
                this.nodosseleccionados.push(nodo.attributes.id);
            }

        }.createDelegate(this));

        vista.btnAceptarEntidadreplicar.on('click', function () {
            var arrEntidades = new Array();
            var s = vista.pobjestructurareplicar.getSeleccionados();
            if(s.length <= 0){
                mostrarMensaje(3, 'Debe seleccionar una entidad.');
                return;
            }

            for(var i = 0; i < s.length; i++){
                if(s[i].id != this.identidad){
                    arrEntidades.push(s[i].id);
                }
            }


            if(self.nodosseleccionados.length>0){
                var arridpagoporresultado = new Array();
                var arridtipopago = new Array();
                var datos = vista.gpPagosxresultados.getSelectionModel().getSelections();
                Ext.each(datos, function (rec) {
                    arridpagoporresultado.push(rec.get('idpagoporresultado'));
                });
                Ext.each(datos, function (rec) {
                    arridtipopago.push(rec.get('idtipopago'));
                });
                //
                var winload = new Ext.PVD.comun.window.winLoad({
                    title: 'Por favor espere...',
                    mensaje: 'Replicando datos'
                });
                winload.showMask();
                Ext.Ajax.request({
                    url: 'replicar',
                    method: 'POST',
                    params: {
                        arridpagoporresultado: (datos.length > 0 ? Ext.encode(arridpagoporresultado) : null),
                        arrEntidades: Ext.encode(arrEntidades),
                        arridtipopago: Ext.encode(arridtipopago)
                    },
                    callback: function (options, success, response) {
                        winload.hideMask();
                        var respuesta = Ext.decode(response.responseText);

                        if (respuesta == 'ADD-1') {
                            mostrarMensaje(1, 'La configuraci&oacute;n del pago por resultados fue replicada satisfactoriamente.');
                        }
                        vista.winEstructurareplicar.hide();
                    }.createDelegate(this)
                });
            }else{
                mostrarMensaje(3, 'Por favor seleccione la(s) entidad(es) a la(s) que desea replicar la configuraci&oacute;n.');
            }
        }.createDelegate(this));

        vista.smPagosxresultados.on('rowdeselect', function (nodo, e, row) {
            vista.btnEliminarpagos.disable();
            vista.btnGuardarOrdenInd.disable();
            vista.btnAdicionarIndicadores.disable();
            vista.btnModificarIndicadores.disable();
            vista.btnEliminarIndicadores.disable();
            vista.btnAdicionarCargos.disable();
            vista.btnEliminarCargos.disable();
            var arraypagos = new Array();
            modelo.stAreaI.load({params: {idpagoporresultado: Ext.encode(arraypagos)}});
            modelo.stIndicadores.load({params: {idpagoporresultado: Ext.encode(arraypagos)}});
        });

        var areasseleccionadas = new Array();
        var contentidades = 0;
        vista.tpAreas.on('checkchange', function (nodo, sel) {
            contentidades += (nodo.attributes.composicion == 2) ? 1 : 0;
            if (nodo.attributes.checked)
                areasseleccionadas.push(nodo.attributes.id);
            else {
                var indice = areasseleccionadas.indexOf(nodo.attributes.id);
                areasseleccionadas.splice(indice, 1);
            }
            vista.btnAceptarcargos.disable()
        });

        vista.smArea.on('rowselect', function (nodo, pos, row) {
            var cantcargossel = vista.smArea.getSelections().length;
            (cantcargossel > 0) ?
                //Validando que en el caso que la composicion sea 2 (entidad) solo se pueda seleccionar un area
                ((contentidades > 1 && areasseleccionadas.length > 1) ?
                    vista.btnAceptarcargos.disable() :
                    vista.btnAceptarcargos.enable()) :
                vista.btnAceptarcargos.disable();
        });

        vista.smArea.on('rowdeselect', function (nodo, pos, row) {
            var cantcargossel = vista.smArea.getSelections().length;
            (cantcargossel > 0) ?
                //Validando que en el caso que la composicion sea 2 (entidad) solo se pueda seleccionar un area
                ((contentidades > 1 && areasseleccionadas.length > 1) ?
                    vista.btnAceptarcargos.disable() :
                    vista.btnAceptarcargos.enable()) :
                vista.btnAceptarcargos.disable();
        });

        vista.smIndicadores.on('selectionchange', function (nodo, e) {
            var Indicadores = new Array();
            Indicadores = vista.smIndicadores.getSelections();

            if (vista.smPagosxresultados.getSelected().data.estado == 2) {
                vista.btnEliminarpagos.disable();
                vista.btnAdicionarIndicadores.disable();
                vista.btnModificarIndicadores.disable();
                vista.btnEliminarIndicadores.disable();
                vista.btnAdicionarCargos.disable();
                vista.btnEliminarCargos.disable();
            } else {
                if (Indicadores.length == 0) {
                    vista.btnEliminarIndicadores.disable();
                    vista.btnModificarIndicadores.disable();
                    vista.btnSubirfila.disable();
                    vista.btnBajarfila.disable();
                } else {
                    vista.btnEliminarIndicadores.enable();
                    vista.btnModificarIndicadores.enable();
                    //vista.btnSubirfila.enable();
                    //vista.btnBajarfila.enable();
                }
            }
        });

        vista.smIndicadores.on('rowselect', function (sm, row, rec) {
            filaHecho = row;
            vista.btnSubirfila.enable();
            vista.btnBajarfila.enable();
            if (row == 0)
                vista.btnSubirfila.disable();
            if (row + 1 == modelo.stIndicadores.getCount())
                vista.btnBajarfila.disable();
            //Cargando los ids de las formulas
            Ext.Ajax.request({
                url: 'obtenerIdsFormulas',
                method: 'POST',
                params: {
                    idindicadorpagoresultado: sm.getSelected().id
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    variables.arrayidsexpresionmatematica = responseData;
                    variables.orden = responseData.orden;
                    (responseData.tipovalor != 3) ? vista.taFormulaIndicador.disable() : vista.taFormulaIndicador.enable();
                    (responseData.tipovalor != 3) ? vista.taFormulaIndicador.setValue('') : vista.taFormulaIndicador.setValue(responseData.textoformulaindicador);
                    (responseData.tipovalor != 3) ? vista.taFormulaSumatoria.disable() : vista.taFormulaSumatoria.enable();
                    (responseData.tipovalor != 3) ? vista.taFormulaSumatoria.setValue('') : vista.taFormulaSumatoria.setValue(responseData.textoformulasumatoria);
                }.createDelegate(this)
            });

        });

        vista.smAreaI.on('selectionchange', function (nodo, e) {

            var areaI = new Array();
            areaI = vista.smAreaI.getSelections();
            if (vista.smPagosxresultados.getSelected().data.estado == 2) {
                vista.btnEliminarpagos.disable();
                vista.btnAdicionarIndicadores.disable();
                vista.btnModificarIndicadores.disable();
                vista.btnEliminarIndicadores.disable();
                vista.btnAdicionarCargos.disable();
                vista.btnEliminarCargos.disable();
            } else {
                if (areaI.length == 0) {

                    vista.btnEliminarCargos.disable();
                } else {
                    vista.btnEliminarCargos.enable();
                }
            }
        });

        vista.btnCancelarindicadores.setHandler(function () {
            vista.winIndicadores.hide();
        });

        vista.btnAplicarindicadores.setHandler(function () {

        });

        vista.btnSubirfila.on('click', function () {

            var pagos = new Array();
            pagos = vista.smPagosxresultados.getSelections();
            var arraypagos = new Array();
            for (i = 0; i < pagos.length; i++) {
                arraypagos.push({
                    idpagoporresultado: pagos[i].data.idpagoporresultado
                });
            }

            Ext.Ajax.request({
                url: 'OrdenarASc',
                params: {
                    idindicadorespagoresultado: vista.smIndicadores.getSelected().data.idindicadorespagoresultado,
                    idpagoporresultado: vista.smIndicadores.getSelected().data.idpagoporresultado
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    moverFilaArriba();
                    //Ext.getBody().unmask();
                    // vista.winAddtipopago.hide();
                    // mostrarMensaje(1,'El(Los) tipo(s) de pagos ha(n) sido eliminado(s) satisfactoriamente.');
                    modelo.stIndicadores.load({params: {idpagoporresultado: Ext.encode(arraypagos)}});

                }.createDelegate(this)
            });

        });

        vista.btnBajarfila.on('click', function () {
            // moverFilaAbajo();
            var pagos = new Array();
            pagos = vista.smPagosxresultados.getSelections();
            var arraypagos = new Array();
            for (i = 0; i < pagos.length; i++) {
                arraypagos.push({
                    idpagoporresultado: pagos[i].data.idpagoporresultado
                });
            }
            Ext.Ajax.request({
                url: 'OrdenarDes',
                params: {
                    idindicadorespagoresultado: vista.smIndicadores.getSelected().data.idindicadorespagoresultado,
                    idpagoporresultado: vista.smIndicadores.getSelected().data.idpagoporresultado
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    moverFilaAbajo();
                    //Ext.getBody().unmask();
                    // vista.winAddtipopago.hide();
                    // mostrarMensaje(1,'El(Los) tipo(s) de pagos ha(n) sido eliminado(s) satisfactoriamente.');
                    modelo.stIndicadores.load({params: {idpagoporresultado: Ext.encode(arraypagos)}});

                }.createDelegate(this)
            });

        });

        vista.btnAceptarindicadores.setHandler(function () {
            AddIndicadores();
        });

        vista.btnCancelarcargos.setHandler(function () {
            vista.winAddcargosporarea.hide();
        });

        vista.btnAplicarcargos.setHandler(function () {

        });

        vista.btnAceptarcargos.setHandler(function () {
            AddCargos();

        });

        vista.btnModificarpagos.setHandler(function () {
            vista.winAddtipopago.setTitle('Modificar tipo de pago');
            vista.btnAplicar.hide();
            vista.winAddtipopago.show();
        });

        vista.btnEliminarpagos.setHandler(function () {

            var tipospagos = new Array();
            tipospagos = vista.smPagosxresultados.getSelections();
            //console.info(tipospagos);
            var arraytipospagos = new Array();
            for (i = 0; i < tipospagos.length; i++) {
                arraytipospagos.push({
                    idpagoporresultado: tipospagos[i].data.idpagoporresultado
                });

            }
            mostrarMensaje(2, '&iquest;Est&aacute; seguro que desea eliminar el(los) tipo(s) de pago(s) seleccionado(s)?', function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Por favor espere... Eliminando tipo de pagos');
                    Ext.Ajax.request({
                        url: 'DelTiposdepagos',
                        params: {
                            idpagoporresultado: Ext.encode(arraytipospagos)
                        },
                        callback: function (options, success, response) {
                            var respuesta = Ext.decode(response.responseText);
                            Ext.getBody().unmask();
                            // vista.winAddtipopago.hide();
                            mostrarMensaje(1, 'El tipo de pago ha sido eliminado satisfactoriamente.');
                            modelo.stPagosxresultados.load({params:{start: 0, limit: 1000}});
                            modelo.stIndicadores.reload();

                        }.createDelegate(this)
                    });
                }

            });

        });

        vista.btnGuardar.setHandler(function () {
            var cargos = modelo.stAreaI.getTotalCount();
            var indicadores = modelo.stIndicadores.getTotalCount();

            if (cargos == 0 || indicadores == 0) {
                var text = '';
                if (cargos == 0 && indicadores == 0) {
                    text = 'El pago debe incluir cargos e indicadores.';
                } else if (indicadores == 0 && cargos > 0) {
                    text = ' El pago debe incluir indicadores.';
                } else if (cargos == 0 && indicadores > 0) {
                    text = 'El pago debe incluir cargos.';
                }

                mostrarMensaje(3, text, function (btnPresionado) {
                });
            } else {
                Ext.getBody().mask('Por favor espere... ');
                Ext.Ajax.request({
                    url: 'Guardar',
                    params: {
                        referencia: vista.smPagosxresultados.getSelected().data.referencia,
                        idpagoporresultado: vista.smPagosxresultados.getSelected().data.idpagoporresultado
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);
                        Ext.getBody().unmask();
                        // vista.winAddtipopago.hide();
                        mostrarMensaje(1, 'El tipo de pago ha sido aprobado satisfactoriamente.');
                        modelo.stPagosxresultados.load({params:{start: 0, limit: 1000}});
                    }.createDelegate(this)
                });
            }
        });

        vista.btnDesaprobar.setHandler(function () {

            if (vista.smPagosxresultados.getSelected().data.estado == 1) {
                mostrarMensaje(3, 'El pago no ha sido aprobado.', function (btnPresionado) {

                });

            } else {
                mostrarMensaje(3, '¿Est&aacute; seguro que desea desaprobar el tipo de pago seleccionado?', function (btnPresionado) {
                    if (btnPresionado == 'ok') {
                        Ext.getBody().mask('Por favor espere... ');
                        Ext.Ajax.request({
                            url: 'Desaprobar',
                            params: {
                                referencia: vista.smPagosxresultados.getSelected().data.referencia,
                                idpagoporresultado: vista.smPagosxresultados.getSelected().data.idpagoporresultado
                            },
                            callback: function (options, success, response) {
                                var respuesta = Ext.decode(response.responseText);
                                Ext.getBody().unmask();
                                // vista.winAddtipopago.hide();
                                mostrarMensaje(1, 'El tipo de pago ha sido desaprobado satisfactoriamente.');
                                modelo.stPagosxresultados.load({params:{start: 0, limit: 1000}});


                            }.createDelegate(this)
                        });
                    }
                });
            }
        });

        vista.btnEliminarCargos.setHandler(function () {

            var cargosI = new Array();
            cargosI = vista.smAreaI.getSelections();
            // console.info(tipospagos);
            var arraycargosI = new Array();
            for (i = 0; i < cargosI.length; i++) {
                arraycargosI.push({
                    idcargopagoresultado: cargosI[i].data.idcargopagoresultado
                });

            }

            var pagos = new Array();
            pagos = vista.smPagosxresultados.getSelections();

            var arraypagos = new Array();
            for (i = 0; i < pagos.length; i++) {

                arraypagos.push({
                    idpagoporresultado: pagos[i].data.idpagoporresultado
                });

            }
            var msg = new Array();
            var msgMask = new Array();
            var msgAcp = new Array();

            if (cargosI.length == 1) {
                msg = '&iquest;Est&aacute; seguro que desea eliminar el cargo seleccionado?';
                msgMask = 'Por favor espere... Eliminando cargo';
                msgAcp = 'El cargo  ha sido eliminado satisfactoriamente.';

            } else {
                msg = '&iquest;Est&aacute; seguro que desea eliminar los cargos seleccionados?';
                msgMask = 'Por favor espere... Eliminando cargos';
                msgAcp = 'Los cargos han sido eliminado satisfactoriamente.';
            }
            mostrarMensaje(2, msg, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(msgMask);
                    Ext.Ajax.request({
                        url: 'DelCargosapagosporresultados',
                        params: {
                            idcargopagoresultado: Ext.encode(arraycargosI)
                        },
                        callback: function (options, success, response) {
                            var respuesta = Ext.decode(response.responseText);
                            Ext.getBody().unmask();
                            // vista.winAddtipopago.hide();
                            mostrarMensaje(1, msgAcp);
                            modelo.stAreaI.load({params: {idpagoporresultado: Ext.encode(arraypagos)}});

                        }.createDelegate(this)
                    });
                }
            });
        });

        vista.btnGuardarOrdenInd.on('click', function(){
            if (modelo.stIndicadores.getModifiedRecords().length > 0) {
                var arrayidindicadores = new Array();
                var arrayorden = new Array();
                var datosmodificados = modelo.stIndicadores.getModifiedRecords();
                for(var i = 0; i < datosmodificados.length; i++){
                    arrayidindicadores[i] = datosmodificados[i].data.idindicadorespagoresultado;
                    arrayorden[i] = datosmodificados[i].data.orden;
                }
                PVD.mostrarMascara('updtorden', 'Por favor espere...', 'Enviando datos');
                Ext.Ajax.request({
                    url: 'actualizarOrden',
                    params: {
                        arrayidindicadores: Ext.encode(arrayidindicadores),
                        arrayorden: Ext.encode(arrayorden)
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('updtorden');
                        var respuesta = Ext.decode(response.responseText);
                        mostrarMensaje(1, 'El orden fue actualizado satisfactoriamente.');
                        modelo.stIndicadores.reload();

                    }.createDelegate(this)
                });

            }
        });

        vista.btnAdicionarIndicadores.setHandler(function () {
            vista.winIndicadores.setTitle('Adicionar indicadores');
            vista.btnAplicarindicadores.show();
            variables.accion = 'Add';
            vista.tfDenominacion.setValue('');
            vista.tfDenominacion.reset();
            vista.cbtipovalor.reset();
            vista.treeComboCamposNomina.reset();
            vista.winIndicadores.show();
        });

        vista.btnModificarIndicadores.setHandler(function () {
            vista.winIndicadores.setTitle('Modificar indicadores');
            variables.accion = 'Mod';
            vista.winIndicadores.on('beforeshow', function () {
                vista.fpIndicadores.getForm().loadRecord(vista.gpIndicadores.getSelectionModel().getSelected());
            });
            vista.winIndicadores.show();

            if (vista.gpIndicadores.getSelectionModel().getSelected().data.tipovalor == 1) {
                var idestructuramodelonomina = vista.gpIndicadores.getSelectionModel().getSelected().data.idestructuramodelonomina;
                vista.cbtipovalor.setValue(1);
                vista.treeComboCamposNomina.enable();
                vista.treeComboCamposNomina.setValue(vista.gpIndicadores.getSelectionModel().getSelected().data.denomcampoestmodnom);

            } else {
                (vista.gpIndicadores.getSelectionModel().getSelected().data.tipovalor == 2) ? vista.cbtipovalor.setValue(2) : vista.cbtipovalor.setValue(3);
                vista.treeComboCamposNomina.disable();
                vista.treeComboCamposNomina.reset('');
                //vista.treeComboCamposNomina.setValue('');
            }

            if (vista.gpIndicadores.getSelectionModel().getSelected().data.idreporteentrada) {
                vista.tpEntradasalida.activate('entrada');
                vista.tpEntradasalida.getComponent('entrada').enable();

                Ext.each(modelo.stSalida.getRange(), function (rec) {
                    if (rec.data.idvariablesconfreportescertificaciones == vista.gpIndicadores.getSelectionModel().getSelected().data.idreporteentrada) {
                        var indice = modelo.stSalida.indexOf(rec);
                        vista.gpSalida.on(' beforeshow ', function () {
                            vista.smSalida.selectRow(indice);
                        });
                    }
                })
            } else if (vista.gpIndicadores.getSelectionModel().getSelected().data.idreportesalida) {
                vista.tpEntradasalida.activate('salida');
                vista.tpEntradasalida.getComponent('entrada').disable();

                Ext.each(modelo.stEntrada.getRange(), function (rec) {
                    if (rec.data.idvariablesconfreportescertificaciones == vista.gpIndicadores.getSelectionModel().getSelected().data.idreporteentrada) {
                        var indiceS = modelo.stEntrada.indexOf(rec);
                        vista.gpEntrada.on(' beforeshow ', function () {
                            vista.smEntrada.selectRow(indiceS);
                        });
                    }
                })
            }
        });

        vista.btnEliminarIndicadores.setHandler(function () {

            var indicador = new Array();
            indicador = vista.smIndicadores.getSelections();
            //console.info(tipospagos);
            var arrayindicador = new Array();
            for (i = 0; i < indicador.length; i++) {
                arrayindicador.push({
                    idindicadorespagoresultado: indicador[i].data.idindicadorespagoresultado
                });
            }

            var pagos = new Array();
            pagos = vista.smPagosxresultados.getSelections();
            //console.info(tipospagos);
            var arraypagos = new Array();
            for (i = 0; i < pagos.length; i++) {
                arraypagos.push({
                    idpagoporresultado: pagos[i].data.idpagoporresultado
                });
            }

            mostrarMensaje(2, '&iquest;Est&aacute; seguro que desea eliminar el indicador seleccionado?', function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Por favor espere... Eliminando indicador ');
                    Ext.Ajax.request({
                        url: 'DelIndicadorespagosporresultados',
                        params: {
                            idindicadorespagoresultado: Ext.encode(arrayindicador)
                        },
                        callback: function (options, success, response) {
                            var respuesta = Ext.decode(response.responseText);
                            Ext.getBody().unmask();
                            // vista.winAddtipopago.hide();
                            mostrarMensaje(1, 'El indicador ha sido eliminado satisfactoriamente.');
                            modelo.stIndicadores.load({params: {idpagoporresultado: Ext.encode(arraypagos)}});
                        }.createDelegate(this)
                    });
                }
            });
        });

        //Acciones de las Formulas de los indicadores
        vista.taFormulaIndicador.on('focus', function () {
            var idindicadorespagoresultado = variables.arrayidsexpresionmatematica.idindicadorespagoresultado;
            var idformulaindicador = variables.arrayidsexpresionmatematica.formulaindicador;
            mostrarFormulaIndicadores(idindicadorespagoresultado, idformulaindicador, 1);
        });

        vista.taFormulaSumatoria.on('focus', function () {
            var idindicadorespagoresultado = variables.arrayidsexpresionmatematica.idindicadorespagoresultado;
            var idformulasumatoria = variables.arrayidsexpresionmatematica.formulasumatoria;
            mostrarFormulaIndicadores(idindicadorespagoresultado, idformulasumatoria, 2);
        });

        //Funciones
        function AddorUp() {
            var tipospagos = new Array();
            tipospagos = vista.smNomTipopago.getSelections();

            var arraytipospagos = new Array();
            for (i = 0; i < tipospagos.length; i++) {
                arraytipospagos.push({
                    idtipopago: tipospagos[i].data.idtipopago,
                    referencia: tipospagos[i].data.referencia
                });
            }
            // console.info(arraytipospagos);
            Ext.getBody().mask('Por favor espere.');
            Ext.Ajax.request({
                url: 'AddTiposdepagos',
                params: {
                    idtipopago: Ext.encode(arraytipospagos)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);

                    Ext.getBody().unmask();
                    var cont = 0;
                    var denm = [];
                    if (respuesta.datos == 0) {
                        msg = 'El tipo de pago se adicion&oacute satisfactoriamente.';
                        mostrarMensaje('1', msg);

                    } else {
                        Ext.each(respuesta.datos, function (obj) {
                            denm += obj + ',';
                            cont++;

                        });
                        if (cont > 1) {
                            msg = 'Los tipos de pago que desea adicionar ' + denm + ' ya existen.';
                        } else {
                            msg = 'El tipo de pago que desea adicionar  ' + denm + ' ya existe.';
                        }
                        mostrarMensaje(3, msg);
                    }
                    vista.winAddtipopago.hide();
                    modelo.stPagosxresultados.load({params:{start: 0, limit: 1000}});
                }.createDelegate(this)
            });
        }

        function AddCargos() {
            var cargosarea = new Array();
            cargosarea = vista.smArea.getSelections();
            //console.info(tipospagos);
            var arraycargosarea = new Array();
            for (i = 0; i < cargosarea.length; i++) {
                arraycargosarea.push({
                    idcargo: cargosarea[i].data.idcargo,
                    idarea: cargosarea[i].data.idarea
                });
            }

            var pagos = new Array();
            pagos = vista.smPagosxresultados.getSelections();
            //console.info(tipospagos);
            var arraypagos = new Array();
            for (i = 0; i < pagos.length; i++) {
                arraypagos.push({
                    idpagoporresultado: pagos[i].data.idpagoporresultado
                });
            }

            Ext.getBody().mask('Por favor espere.');
            Ext.Ajax.request({
                url: 'AddCargosapagosporresultados',
                params: {
                    idcargo: Ext.encode(arraycargosarea),
                    idpagoporresultado: Ext.encode(arraypagos),
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    Ext.getBody().unmask();
                    vista.winAddcargosporarea.hide();
                    modelo.stAreaI.load({params: {idpagoporresultado: Ext.encode(arraypagos)}});
                }.createDelegate(this)
            });
        }

        function AddIndicadores() {
            var pagos = new Array();
            pagos = vista.smPagosxresultados.getSelections();
            var arraypagos = new Array();
            for (i = 0; i < pagos.length; i++) {
                arraypagos.push({
                    idpagoporresultado: pagos[i].data.idpagoporresultado
                });
            }
            var url = 'AddIndicadorespagosporresultados';
            var idindicadorespagoresultado = [];

            if (variables.accion == 'Mod') {
                url = 'ModIndicadorespagosporresultados';
                idindicadorespagoresultado = vista.smIndicadores.getSelected().data.idindicadorespagoresultado;
            }
            if (vista.cbtipovalor.getValue() == 2) {
                if (vista.smEntrada.getCount() == 0) {
                    mostrarMensaje('3', 'Tiene que seleccionar una entrada.');
                    return;
                }
            }

            //Para que no existan campos vacios en caso de que sea tipo de valor
            if (vista.cbtipovalor.getValue() == 1) {
                if (!vista.hoja) {
                    mostrarMensaje('2', 'Tiene que seleccionar un campo de n&oacute;mina v&aacute;lido.');
                    return;
                }
            }

            Ext.getBody().mask('Por favor espere.');
            Ext.Ajax.request({
                url: url,
                params: {
                    idreporteentrada: (vista.smEntrada.getCount() > 0) ? vista.smEntrada.getSelected().data.idvariablesconfreportescertificaciones : [],
                    idindicadorespagoresultado: idindicadorespagoresultado,
                    idreportesalida: (vista.gpSalida.getSelectionModel().getSelections().length)?vista.smSalida.getSelected().data.idvariablesconfreportescertificaciones : null,
                    idpagoporresultado: Ext.encode(arraypagos),
                    denominacion: vista.tfDenominacion.getValue(),
                    tipovalor: vista.cbtipovalor.getValue(),
                    idestructuramodelonomina: (vista.treeComboCamposNomina.getValue()) ? vista.treeComboCamposNomina.getValue() : '',
                    lugaresdecimales: vista.nfieldLugaresDecimales.getValue(),
                    obligatorio: (vista.cbObligatorio.checked ? 1 : 0),
                    recalculable: (vista.cbRecalculable.checked ? 1 : 0),
                    resultadofinal: (vista.cbResultadoFinal.checked ? 1 : 0),
                    sumadestajo: (vista.cbSumaDestajo.checked ? 1 : 0)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    Ext.getBody().unmask();
                    vista.winIndicadores.hide();

                    if (respuesta.codMsg == 100) {
                        msg = (variables.accion == 'Add') ? 'El indicador se ha adicionado satisfactoriamente.' : 'El indicador se ha modificado satisfactoriamente.';
                        mostrarMensaje('1', msg);

                    } else {
                        msg = 'La denominaci&oacute;n especificada ya existe, para este tipo de pago.';
                        mostrarMensaje('3', msg);
                    }

                    vista.tfDenominacion.reset();
                    vista.cbtipovalor.reset();
                    vista.treeComboCamposNomina.reset();
                    modelo.stIndicadores.load({params: {idpagoporresultado: Ext.encode(arraypagos)}});
                }.createDelegate(this)
            });
        }

        function moverFilaArriba() {
            cambioorden = true;
            var recordSeleccionado = vista.smIndicadores.getSelected();
            var recordAnterior = modelo.stIndicadores.getAt(filaHecho - 1);
            var recordAux = recordSeleccionado;
            modelo.stIndicadores.remove(recordSeleccionado);
            recordSeleccionado.set('ordenmostrar', filaHecho);
            recordAnterior.set('ordenmostrar', filaHecho + 1);
            vista.smIndicadores.selectPrevious();
        }

        function moverFilaAbajo() {
            cambioorden = true;
            var recordSeleccionado = vista.smIndicadores.getSelected();
            var ordenSelec = recordSeleccionado.get('ordenmostrar');
            var recordSiguiente = modelo.stIndicadores.getAt(filaHecho + 1);
            var recordAux = recordSeleccionado;
            modelo.stIndicadores.remove(recordSeleccionado);
            modelo.stIndicadores.insert(filaHecho + 1, recordAux);
            recordSeleccionado.set('ordenmostrar', recordSiguiente.get('ordenmostrar'));
            recordSiguiente.set('ordenmostrar', ordenSelec);
            vista.smIndicadores.selectNext();
        }

        function mostrarFormulaIndicadores(idindicadorespagoresultado, idexpresionmatematica, tipo) {
            //Cargo los indicadores con un nivel inferior al seleccionado y el campo sumatoria
            var ind = new Array();
            for (var i = 0; i < variables.arrayindicadores.length; i++) {
                var a = new Array();
                if (parseInt(variables.arrayindicadores[i].orden) < parseInt(variables.orden)) {
                    a[0] = variables.arrayindicadores[i].idindicador;
                    a[1] = variables.arrayindicadores[i].indicador;
                    a[2] = variables.arrayindicadores[i].tipo;
                    ind.push(a);
                }
            }
            //console.info(variables.arrayindicadores);console.info(ind);return;
            //El campo sumatoria va a aparecer en el text area de indicadores, solo si existen fórmulas en el text area de sumatorias
            if (tipo == 1) {
                //Arreglo del campo monto.
                var b = new Array();
                b[0] = 'MONTO_0';
                b[1] = 'Monto';
                b[2] = 'Montos';
                ind.push(b);

                if (variables.arrayidsexpresionmatematica.formulasumatoria != -1) {
                    //Arreglo del campo sumatoria solo si tiene una formula de sumatoria configurada.
                    var c = new Array();
                    c[0] = 'SUMATAREA_0';
                    c[1] = 'Sumatoria Area';
                    c[2] = 'Sumatorias';
                    ind.push(c);

                    var e = new Array();
                    e[0] = 'SUMATENT_0';
                    e[1] = 'Sumatoria Entidad';
                    e[2] = 'Sumatorias';
                    ind.push(e);
                }

                //Arreglo del campo cantidad de personas total.
                var f = new Array();
                f[0] = 'SPC_0';
                f[1] = 'Salario Escala';
                f[2] = 'Salario Escala';
                ind.push(f);


                //Arreglo del campo cantidad de personas del area.
                var d = new Array();
                d[0] = 'CANTPERSAREA_0';
                d[1] = 'Cantidad de personas del &Aacute;rea';
                d[2] = 'Personas';
                ind.push(d);

                //Arreglo del campo cantidad de personas total.
                var d = new Array();
                d[0] = 'CANTPERSONAS_0';
                d[1] = 'Cantidad de personas';
                d[2] = 'Personas';
                ind.push(d);
            }
            this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: idexpresionmatematica,
                indicadores: ind,
                agrupado: 1,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,
                mostrarCondicionales: (tipo == 1) ? true : false,
                //operadoresMostrar: ['+', '-', '*', '/', 'pa', 'pc', 's', 'p'],
                mostrarDenominacion: false
            });

            this.objExpMat.on('expresionsalvada', function (arr) {
                salvarExpresionMatematica(idindicadorespagoresultado, arr.idexpresionmatematica, tipo);
                this.objExpMat.close();
            }.createDelegate(this));

            this.objExpMat.show();
        }

        function salvarExpresionMatematica(idindicadorespagoresultado, idexpresionmatematica, tipoexpresion) {
            PVD.mostrarMascara('idmaskformula', 'Por favor espere...', 'Enviando datos');
            Ext.Ajax.request({
                url: 'adicionarFormulas',
                params: {
                    idindicadorespagoresultado: idindicadorespagoresultado,
                    idexpresionmatematica: idexpresionmatematica,
                    tipoexpresion: tipoexpresion
                },
                callback: function (options, succes, response) {
                    PVD.ocultarMascara('idmaskformula');
                    respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'ok') {
                        mostrarMensaje(1, 'La expresi&oacute;n matem&aacute;tica se adicion&oacute; satisfactoriamente.');
                        vista.smIndicadores.clearSelections();
                        vista.btnLimpiarFormulas.disable();
                        vista.taFormulaIndicador.disable();
                        vista.taFormulaIndicador.setValue('');
                        vista.taFormulaSumatoria.disable();
                        vista.taFormulaSumatoria.setValue('');
                    } else {
                        mostrarMensaje(3, 'La expresi&oacute;n matem&aacute;tica no se pudo adicionar.');
                    }

                }
            });
        }

        function limpiarFormulasRetencion() {
            //Mostrando el mensaje para aceptar la eliminar.
            mostrarMensaje(2, idioma.lbTitleLimpiarFormulas, function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmasklimpiarformulas', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgLimpiarFormulas);

                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url: 'limpiarFormulasIndicadores',
                        method: 'POST',
                        params: {
                            idtiponomina: vista.gpTiposNominas.getSelectionModel().getSelected().id
                        },
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmasklimpiarformulas');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg == 1) {
                                //Mostrando el mensaje de que se ha eliminado.
                                mostrarMensaje(1, idioma.lbMsgCorrectoLimpiarFormulas, function (btn) {
                                    vista.btnLimpiarFormulas.disable();
                                    vista.taCondicionRetenciones.enable();
                                    vista.taLimiteMaximo.disable();
                                    vista.taCondicionRetenciones.setValue('');
                                    vista.taLimiteMaximo.setValue('');
                                });
                            }
                        }
                    });
                }
            });
        }

        /*
         var variables = {
         identidad : -1,
         idarea:-1,
         idperiodopago: -1,
         idtipopago: -1,
         denominacionentidad: '',
         idelaborarpagos: -1,
         iddatossbc: 0,
         idpersona: 0,
         sbc1: 0,
         sbc2: 0,
         sbc3: 0,
         sbct: 0,
         cambiosbc1: 0,
         cambiosbc2: 0,
         cambiosbc3: 0,
         cambiomodificar: 0,
         };

         //Mostrar interfaz para selecionar entidad.
         vista.winEstEntidades.show();

         //Eventos del objeto del ábol de entidades.
         vista.pEstEntidades.on('estructuraselecionada', function(o, nodo){
         if(nodo.attributes.tipoestructura == 3){
         variables.identidad = nodo.id;
         variables.denominacionentidad = nodo.text;
         vista.btnAceptarEntidades.enable();
         }else{
         variables.identidad = null;
         variables.denominacionentidad = '';
         vista.btnAceptarEntidades.disable();
         }
         });

         vista.objListarPeriodosPagos.on('periodopagoseleccionado', function(record){
         if(vista.objListarPeriodosPagos.modoview == 2){
         vista.objListarPeriodosPagos.btnAddGridExportarVarios.enable();
         vista.objListarPeriodosPagos.btnDelGridExportarVarios.disable();
         vista.recordperiodopagoseleccionado = record;
         }
         })

         vista.objListarPeriodosPagos.on('periodopagoexportarseleccionado', function(record){
         if(vista.objListarPeriodosPagos.modoview == 2){
         vista.objListarPeriodosPagos.btnAddGridExportarVarios.disable();
         vista.objListarPeriodosPagos.btnDelGridExportarVarios.enable();
         vista.recordperiodopagoexportarseleccionado = record;
         }
         })

         vista.objListarPeriodosPagos.btnAddGridExportarVarios.on('click', function(btn){
         if(vista.objListarPeriodosPagos.modoview == 2){
         vista.objListarPeriodosPagos.stPeriodosPagoExportar.add(vista.recordperiodopagoseleccionado);
         vista.objListarPeriodosPagos.stPeriodosPago.remove(vista.recordperiodopagoseleccionado);
         //vista.objListarPeriodosPagos.stPeriodosPago.removeAll();
         btn.disable();

         }
         })

         vista.objListarPeriodosPagos.btnDelGridExportarVarios.on('click', function(btn){
         if(vista.objListarPeriodosPagos.modoview == 2){
         vista.objListarPeriodosPagos.stPeriodosPagoExportar.remove(vista.recordperiodopagoexportarseleccionado);
         vista.objListarPeriodosPagos.stPeriodosPago.add(vista.recordperiodopagoexportarseleccionado);
         btn.disable();
         }
         })

         vista.btnAceptarEntidades.on('click', function(){
         if(variables.identidad != null){
         vista.objListarPeriodosPagos.CambiarEntidad(variables.identidad);
         var titulo = vista.winPeriodosPagos.title + ' -  ' + variables.denominacionentidad;
         vista.winPeriodosPagos.setTitle(titulo);
         vista.winPeriodosPagos.show();
         }
         });

         vista.objListarPeriodosPagos.on('periodopagoseleccionado', function(fila){
         vista.btnAceptarPeriodosPagos.enable();
         variables.idtipopago = fila.data.idtipopago;
         variables.idperiodopago = fila.data.idperiodopago;
         variables.idelaborarpagos = fila.data.idelaborarpagos;
         });

         vista.btnAceptarPeriodosPagos.on('click', function(){
         var contador =vista.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
         var range = vista.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0, contador);
         for (var i =  0; i<contador; i++) {
         vista.arrayidelaborarpagos[i] = range[i].data.idelaborarpagos;
         }
         if(variables.identidad != null){
         //window.open(document.location.protocol + '//' + window.location.host + '/pvd/nomina/index.php/exportarsbc/exportarSalarioBaseCalculo?idelaborarpagos='+Ext.encode(vista.arrayidelaborarpagos)+'&identidad='+variables.identidad);
         PVD.mostrarMascara('idmaskenviar','Por favor espere...','Calculando los salarios base de c&aacute;lculo');
         Ext.Ajax.request({
         // url: '/pvd/nomina/index.php/exportarsbc/exportarSalarioBaseCalculo',
         timeout : 50000000,
         method: 'POST',
         params: {
         idelaborarpagos: Ext.encode(vista.arrayidelaborarpagos),
         identidad: variables.identidad
         },
         callback: function (options,success,response){
         var respuesta = Ext.decode(response.responseText);
         PVD.ocultarMascara('idmaskenviar');
         if(respuesta == "Ok"){

         Ext.Ajax.request({
         // url: 'getDatosPlantillaXTP',
         method:'POST',
         params:{},
         callback: function (options,success,response){
         responseData = Ext.decode(response.responseText);
         reescribirPanel(responseData);
         }
         });


         vista.winExportarSBC.show();
         vista.winExportarSBC.maximize();
         // recargar el grid luego d elos periodos de pago ahoara soloc uando se selecciona una plantilla
         modelo.stPlantillaNAreas.load();
         var seleccionados = new Array();
         modelo.stExportarSBC.load({params:{limit:600, start:0,plantillas: Ext.encode(seleccionados)}});
         }
         }.createDelegate(this)
         });
         }
         vista.btnActualizarReporte.enable();

         });

         function reescribirPanel(responseData){
         //var elDatos = vista.pDatosPeriodoPago.getEl();
         vista.plantillaDatos1.overwrite(vista.pDatosPeriodoPago.body, responseData);
         }

         vista.btnBuscar.on('click', function(){
         var seleccionados = new Array();
         var rowselc = vista.smAreas.getSelections();
         for (i = 0; i < rowselc.length; i++) {
         seleccionados.push(rowselc[i].id);
         }
         modelo.stExportarSBC.load({params:{limit:600, start:0,textoabuscar:vista.tfBuscar.getValue(), plantillas: Ext.encode(seleccionados),identidad:variables.identidad}});
         // modelo.stExportarSBC.load({params:{limit:600, start:0, textoabuscar:vista.tfBuscar.getValue()}});
         });


         /*vista.smAreas.on('rowselect', function(){
         var seleccionados = new Array();
         var rowselc = vista.smAreas.getSelections();
         //console.info(selc);
         for (i = 0; i < rowselc.length; i++) {
         seleccionados.push(rowselc[i].id);
         }

         modelo.stExportarSBC.load({params:{limit:600, start:0, plantillas: Ext.encode(seleccionados),identidad:variables.identidad}});
         });*/
        /*   vista.smAreas.on('selectionchange', function(){
         var seleccionados = new Array();
         var rowselc = vista.smAreas.getSelections();
         for (i = 0; i < rowselc.length; i++) {
         seleccionados.push(rowselc[i].id);
         }
         modelo.stExportarSBC.load({params:{limit:600, start:0, plantillas: Ext.encode(seleccionados),identidad:variables.identidad}});
         });

         /*vista.gpAreas.on('afteredit', function(){
         var cont = 0;
         var auxid =new Array();
         var auxarrayDatos =new Array();
         var flag = 0;

         var cont = modelo.stPlantillaNAreas.getTotalCount();
         var todoselementos = modelo.stPlantillaNAreas.getRange();

         for (var i =  0; i<cont; i++) {
         console.info(todoselementos[i].data);
         if(todoselementos[i].data.valor == " "){
         flag = 1;
         break;
         }
         }
         if(flag == 1){
         vista.btnActualizarReporte.disable();
         }else{
         vista.btnActualizarReporte.enable();
         }

         });*/
        /*
         vista.btnActualizarReporte.on('click', function(){
         //console.info('actualizando pagos');
         var seleccionados = new Array();
         var rowselc = vista.smAreas.getSelections();
         for (i = 0; i < rowselc.length; i++) {
         seleccionados.push(rowselc[i].id);
         }

         var cont = modelo.stPlantillaNAreas.getTotalCount();
         var todoselementos = modelo.stPlantillaNAreas.getRange(0,cont-1);
         //console.info(todoselementos);
         var flag = 0;
         for (var i =  0; i<cont; i++) {
         if(!todoselementos[i].data.valor){
         flag = 1;
         break;
         }
         }
         if(flag==1){
         mostrarMensaje(3,'Por favor complete los montos en el listado de &aacute;reas.');
         }else{

         var arrayareamonto = new Array();
         Ext.each(modelo.stPlantillaNAreas.getRange(), function (rec) {
         arrayareamonto.push({
         monto: rec.data.valor,
         idarea: rec.data.idarea,
         area:rec.data.area

         });
         });
         PVD.mostrarMascara('idmaskactualizarreporte','Por favor espere...','Actualizando el reporte de pago por resultados');
         Ext.Ajax.request({
         timeout : 50000000,
         url: '/pvd/nomina/index.php/exportarsbc/actualizarReportePagoPorResultados',
         method: 'POST',
         params: {
         montototal: Ext.encode(arrayareamonto),
         identidad: variables.identidad
         },
         callback: function (options,success,response){
         modelo.stExportarSBC.load({params:{limit:600, start:0, plantillas: Ext.encode(seleccionados),identidad:variables.identidad}});
         vista.btnActualizarReporte.disable();
         variables.cambiomodificar = 1;
         var respuesta = Ext.decode(response.responseText);
         PVD.ocultarMascara('idmaskactualizarreporte');
         //mostrarMensaje(1, 'El monto a repartir coincide con la cantidad distribuida mediante la f&oacute;rmula aplicada.');
         if(respuesta.sumacontrol == 0){
         mostrarMensaje(1, 'El monto a repartir coincide con la cantidad distribuida mediante la f&oacute;rmula aplicada.');
         }else {
         var menosValor = '';
         var masValor = '';
         var cambiomas = 0;
         var cambiomenos = 0;
         //console.info(respuesta.sumacontrol);

         for(i=0; i <  respuesta.sumacontrol.length; i++){
         //console.info(respuesta.sumacontrol[i].diferencia);
         if(respuesta.sumacontrol[i].diferencia >0){
         //menosValor = 'en el area' + respuesta.sumacontrol[i].area +' de '+ respuesta.sumacontrol[i].diferencia + ',';
         menosValor = 'De los <b>'+respuesta.sumacontrol[i].monto+'</b> pesos a repartir en el &aacute;rea <b>'+respuesta.sumacontrol[i].area+'</b> se repartieron <b>'+respuesta.sumacontrol[i].montorepartido+'</b> hay un d&eacute;ficit de: <b>'+respuesta.sumacontrol[i].diferencia+'</b> pesos. ';
         cambiomas = 1;
         }else if(respuesta.sumacontrol[i].diferencia < 0){
         //masValor = 'en el area' + respuesta.sumacontrol[i].area +' de '+ respuesta.sumacontrol[i].diferencia + ',';
         masValor = 'De los <b>'+respuesta.sumacontrol[i].monto+'</b> pesos a repartir en el &aacute;rea <b>'+respuesta.sumacontrol[i].area+'</b> se repartieron <b>'+respuesta.sumacontrol[i].montorepartido+'</b> hay un exceso de: <b>'+respuesta.sumacontrol[i].diferencia+'</b> pesos. ';
         cambiomenos = 1;
         }

         }

         if(cambiomas){
         mostrarMensaje(3,' '+menosValor+' ');
         }if(cambiomenos){
         mostrarMensaje(3,' '+ masValor + '');
         }



         }
         //console.info(menosValor);
         /*else if(respuesta.controldiferencia > 0){
         mostrarMensaje(3, 'Los <b>'+respuesta.sumacontrol+'</b> pesos distribuidos mediante la f&oacute;rmula aplicada no coinciden con el monto a repartir. <b>(SRD)</b>', function(btn){
         if(btn=='ok'){
         mostrarMensaje(3, 'Hay un d&eacute;ficit de: <b>'+respuesta.controldiferencia+'</b> pesos.');
         }
         });
         }else{
         mostrarMensaje(3, 'Los <b>'+respuesta.sumacontrol+'</b> pesos distribuidos mediante la f&oacute;rmula aplicada no coinciden con el monto a repartir. <b>(SRD)</b>', function(btn){
         if(btn=='ok'){
         mostrarMensaje(3, 'Hay un exceso de: <b>'+Math.abs(respuesta.controldiferencia)+'</b> pesos.');
         }
         });
         }**/
        /*          }.createDelegate(this)
         });
         }


         /* var montototal = vista.nfMontoTotal.getValue();
         if(montototal){
         PVD.mostrarMascara('idmaskactualizarreporte','Por favor espere...','Actualizando el reporte de pago por resultados');
         Ext.Ajax.request({
         timeout : 50000000,
         url: '/pvd/nomina/index.php/exportarsbc/actualizarReportePagoPorResultados',
         method: 'POST',
         params: {
         montototal: montototal,
         identidad: variables.identidad
         },
         callback: function (options,success,response){
         var respuesta = Ext.decode(response.responseText);
         PVD.ocultarMascara('idmaskactualizarreporte');
         if(respuesta.controldiferencia == 0){
         mostrarMensaje(1, 'El monto a repartir coincide con la cantidad distribuida mediante la f&oacute;rmula aplicada.');
         }else if(respuesta.controldiferencia > 0){
         mostrarMensaje(3, 'Los <b>'+respuesta.sumacontrol+'</b> pesos distribuidos mediante la f&oacute;rmula aplicada no coinciden con el monto a repartir. <b>(SRD)</b>', function(btn){
         if(btn=='ok'){
         mostrarMensaje(3, 'Hay un d&eacute;ficit de: <b>'+respuesta.controldiferencia+'</b> pesos.');
         }
         });
         }else{
         mostrarMensaje(3, 'Los <b>'+respuesta.sumacontrol+'</b> pesos distribuidos mediante la f&oacute;rmula aplicada no coinciden con el monto a repartir. <b>(SRD)</b>', function(btn){
         if(btn=='ok'){
         mostrarMensaje(3, 'Hay un exceso de: <b>'+Math.abs(respuesta.controldiferencia)+'</b> pesos.');
         }
         });
         }
         }.createDelegate(this)
         });
         }else{
         mostrarMensaje(3, 'Por favor introduzca un monto a repartir correcto.');
         }	*/
        /*   });

         vista.gpExportarSBC.selModel.on('rowselect', function(sm, index, store){
         if(variables.cambiomodificar == 1){
         vista.btnModificarSBC.disable();
         }else{
         vista.btnModificarSBC.enable();
         }

         variables.iddatossbc = sm.getSelected().get('iddatossbc');
         variables.idpersona = sm.getSelected().get('idpersona');
         variables.idarea = sm.getSelected().get('idarea');
         variables.sbc1 = sm.getSelected().get('sbc1');
         variables.sbc2 = sm.getSelected().get('sbc2');
         variables.sbc3 = sm.getSelected().get('sbc3');
         variables.sbct = sm.getSelected().get('sbct');
         // console.info(sm.getSelected().get('sbct'));
         });

         vista.btnModificarSBC.on('click', function(){
         vista.ventanaCausaModSBC.show();
         vista.nfcambiosbc1.setValue(variables.sbc1);
         vista.nfcambiosbc2.setValue(variables.sbc2);
         vista.nfcambiosbc3.setValue(variables.sbc3);
         vista.tfDescripModSBC.setValue("");
         });

         vista.btnCancelarModSBC.on('click', function(){
         vista.ventanaCausaModSBC.hide();
         });

         vista.nfcambiosbc1.on('change', function(){
         variables.cambiosbc1 = 1;
         });

         vista.nfcambiosbc2.on('change', function(){
         variables.cambiosbc2 = 1;
         });

         vista.nfcambiosbc3.on('change', function(){
         variables.cambiosbc3 = 1;
         });

         vista.btnAceptarModSBC.on('click', function(){
         if(variables.cambiosbc1 == 0 && variables.cambiosbc2 == 0 && variables.cambiosbc3 == 0){
         vista.ventanaCausaModSBC.hide();
         }else{
         if(vista.formularioModSBC.getForm().isValid()){
         PVD.mostrarMascara('idmasksbc', 'Por favor espere...', 'Modificando datos');
         Ext.Ajax.request({
         url: '/pvd/nomina/index.php/exportarsbc/modificarSBC',
         method: 'POST',
         params: {
         iddatossbc: variables.iddatossbc,
         idarea: variables.idarea,
         idpersona: variables.idpersona,
         sbc1: vista.nfcambiosbc1.getValue(),
         sbc2: vista.nfcambiosbc2.getValue(),
         sbc3: vista.nfcambiosbc3.getValue(),
         descripcion: vista.tfDescripModSBC.getValue()

         },
         callback: function (options,success,response){
         PVD.ocultarMascara('idmasksbc');
         var respuesta = Ext.decode(response.responseText);
         variables.cambiosbc1 = 0;
         variables.cambiosbc2 = 0;
         variables.cambiosbc3 = 0;
         if(respuesta == "Ok"){
         mostrarMensaje(1, 'El sbc se actualizó correctamente.');
         }
         vista.ventanaCausaModSBC.hide();
         var seleccionados = new Array();
         var rowselc = vista.smAreas.getSelections();
         for (i = 0; i < rowselc.length; i++) {
         seleccionados.push(rowselc[i].id);
         }
         modelo.stExportarSBC.load({params:{limit:600, start:0, plantillas: Ext.encode(seleccionados),identidad:variables.identidad}});
         }.createDelegate(this)
         });
         }
         }
         });*/
    }
};
