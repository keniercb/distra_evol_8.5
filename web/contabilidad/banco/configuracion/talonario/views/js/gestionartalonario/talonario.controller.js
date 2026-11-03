//Empaquetando el componente Talonario.
Ext.ns('Banco.Talonario');

//Controller del componente Documento.
Banco.Talonario.Controller = {
    /**
     *Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param view Vista del componente Banco.Documento
     * @param model Modelo de la vista del componente Banco.Documento
     */
    init: function(idioma, view, model) {

        //Objeto para ejecutar una tarea
        //esto me sirve para validar el formulario en el modificar
        this.runner = new Ext.util.TaskRunner();
        this.tarea;
        this.idinstpagoselectedold = '';

        this.selectionHasChanged = function() {
            if(!Ext.isEmpty(view.gptipodoc.getSelectionModel().getSelected())) {
                var idinstseleccionado = view.gptipodoc.getSelectionModel().getSelected().data.idtipodoctalonario;
                if(Ext.isEmpty(this.idinstpagoselectedold)) {
                    this.idinstpagoselectedold = idinstseleccionado;
                }

                if(this.idinstpagoselectedold != idinstseleccionado) {
                    return true;
                }
                else {
                    return false;
                }
            }
            return false;
        };

        this.startTaskValidation = function(form, accion, arrbotones) {
            this.tarea = {
                run: function() {
                    if (accion === 'add') {
                        if (form.isValid() && !Ext.isEmpty(view.gptipodoc.getSelectionModel().getSelected())) {
                            for (var i = 0, long = arrbotones.length; i < long; i++) {
                                arrbotones[i].setDisabled(false);
                            }
                        }
                        else {
                            for (var i = 0, long = arrbotones.length; i < long; i++) {
                                arrbotones[i].setDisabled(true);
                            }
                        }
                    }
                    else {
                        if (form.isValid() && (form.isDirty() || this.selectionHasChanged())) {
                            for (var i = 0, long = arrbotones.length; i < long; i++) {
                                arrbotones[i].setDisabled(false);
                            }
                        }
                        else {
                            for (var i = 0, long = arrbotones.length; i < long; i++) {
                                arrbotones[i].setDisabled(true);
                            }
                        }
                    }
                },
                interval: 300,
                scope: this
            };

            this.runner.start(this.tarea);
        };

        this.stopTaskValidation = function() {
            if (!Ext.isEmpty(this.tarea)) {
                this.runner.stop(this.tarea);
            }
        };

        view.btnAdicionar.focus();

        var controller = this;
        //cargar el listado de talonarios
        model.stTalonario.load();

        //accion de btn adicionar Talonario
        view.btnAdicionar.on('click', function() {
            if (!view.windowopen) {
                view.action = false;
                view.winTalonario.show();
            }
        });

        //accion de btn modificar Talonario
        view.btnModificar.on('click', function() {
            if (!view.windowopen) {
                view.action = true;
                view.winTalonario.show();
            }
        });

        //accion de btn eliminar Talonario
        view.btnEliminar.on('click', function() {
            if (!view.windowopen) {
//                if (view.tpTalonario.getSelectionModel().getSelectedNode()) {
                if (view.gpTalonario.getSelectionModel().getSelected()) {
                    controller.MsgEliminar();
                }
            }
        });

        //accion de btn graficar Talonario
        view.btnGraficar.on('click', function() {
            if (!view.windowopen) {
                controller.GraficarTalonarios();
            }
        });

        //accion de btn ayuda tipo  cta Talonario
        view.btnAyuda.on('click', function() {
            //help.show(idioma.textTitleHelp, 'confin/banco/configuracion/talonario');
        });

        //evento al cargar el arbol de talonario
        /* view.tlTalonario.on('load', function(Object, node, response){
         {
         view.btnModificar.setDisabled(true);
         view.btnEliminar.setDisabled(true);
         if (view.tnTalonario.isLeaf())
         mostrarMensaje(1, idioma.lbSMSsinTal);

         //si tiene hijos
         if (view.tpTalonario.getRootNode().hasChildNodes())
         { //se le cambia el icono a los que esten deshabilitados
         node.eachChild(function(child) {
         if (child.attributes.disabled1) {
         child.getUI().addClass('icon');
         }
         });
         }
         }
         });*/

        //evento al hacer click en el arbol de talonario
        /* view.tpTalonario.on('click', function(node, e) {
         if (node.id == 0 || (node.disabled == false && node.attributes.disabled1 == false)) {
         if (node.id == 0) {
         view.btnAdicionar.enable();
         view.btnModificar.disable();
         view.btnEliminar.disable();
         }
         else {
         view.btnAdicionar.disable();
         view.btnEliminar.enable();
         view.btnModificar.enable();
         }
         }
         else {
         view.btnAdicionar.disable();
         view.btnModificar.disable();
         view.btnEliminar.disable();
         }
         });*/

        //Evento  para seleccionar en la ventana principal, la primera fila del  grid
        model.stTalonario.on('load', function(store, records, options) {
            view.gpTalonario.getSelectionModel().selectFirstRow();
            view.btnAdicionar.focus();
        });

        //evento al seleccionar el talonario
        view.gpTalonario.getSelectionModel().on('rowselect', function(sm, rowIndex, r) {
            view.gpTalonario.getView().addRowClass(rowIndex, 'negrita');
            selector = view.gpTalonario.getSelectionModel().getSelected().data;
            if (selector.estado == 2) {//caso en que no se esta usando
                view.btnEliminar.enable();
                view.btnModificar.enable();
            } else {
                view.btnEliminar.disable();
                view.btnModificar.disable();
            }
        }, this);

        //evento al deseleccionar el talonario
        view.gpTalonario.getSelectionModel().on('rowdeselect', function(sm, rowIndex, r) {
            view.gpTalonario.getView().removeRowClass(rowIndex, 'negrita');
            view.btnEliminar.disable();
            view.btnModificar.disable();
        }, this);

        //eventos de la ventana Add y Mod Talonario
        //evento al ocultarse
        view.winTalonario.on('hide', function() {
            view.windowopen = false;
            view.globalKeyMap.enable();
//            view.fpTalonario.getForm().reset();
            this.limpiarFormTalonario();
            view.btnAdicionar.focus();

            this.idinstpagoselectedold = '';
            this.stopTaskValidation();
        }, this);

        //evento al mostrarse
        view.winTalonario.on('show', function() {

            view.btnAceptar.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    stopEvent: true,
                    fn: function() {
                        view.cbformato.focus(true, true);
                    }
                }
            ]);

            view.cbformato.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    shift: true,
                    stopEvent: true,
                    fn: function() {
                        view.btnAceptar.focus();
                    }
                }
            ]);

            view.winTalonario.center();
            view.windowopen = true;
            view.globalKeyMap.disable();
            if (view.action) {
                view.winTalonario.setTitle(idioma.lbTitMod);
                view.spinner.show();
                view.spinner.container.up('div.x-form-item').show();
                view.btnAplicar.setVisible(false);

                this.startTaskValidation(view.fpTalonario.getForm(), 'mod', [view.btnAceptar]);
            }
            else {
                view.winTalonario.setTitle(idioma.lbTitAdd);
                view.spinner.hide();
                view.spinner.container.up('div.x-form-item').hide();
                view.btnAplicar.setVisible(true);

                this.startTaskValidation(view.fpTalonario.getForm(), 'add', [view.btnAceptar, view.btnAplicar]);
            }
            controller.loadDataComponent(view.action);
        }, this);

        //evento al ocultarse
        view.winGraficar.on('show', function() {
            view.winGraficar.center();
            view.windowopen = true;
        });

        //evento al ocultarse
        view.winGraficar.on('hide', function() {
            view.windowopen = false;
        });

        //evento al seleccionar
        view.cbformato.on('select', function(combo, event) {
            var index = model.stformato.find('idparteformato', view.cbformato.getValue());
            if (index > -1) {
                var length = model.stformato.getAt(index).data.longitud;

                view.tfnuminicio.maxLength = length;//se cambia la longitud permitida
                view.tfnuminicio.minLength = length;
                view.tfnumfinal.maxLength = length;//se cambia la longitud permitida
                view.tfnumfinal.minLength = length;

                view.tfnuminicio.maxLengthText = idioma.maxLengthText.replace('<#>', length);
                view.tfnumfinal.maxLengthText = idioma.maxLengthText.replace('<#>', length);

                controller.formatTalonario(view.tfnuminicio);//se generan los numeros de inicio y fin
                controller.formatTalonario(view.tfnumfinal);//en correspondencia con el formato seleccionado
                controller.freeTalonario();//se recalculan los disponibles

                view.tfnuminicio.focus(false, 100);//(darle el foco a este campo)
            }
        });

        //evento para el ENTER
        view.cbformato.on('keypress', function(combo, event) {
            if (event.getKey() == 13)
                view.cbformato.fireEvent('select');
            else if (event.getKey() == 8 || event.getKey() == 46)
                view.cbformato.clearValue();
        });

        //evento al seleccionar
        view.cbcuentaBanc.on('select', function(combo, event) {
            if (!view.action) {//si es adicionando se cargan documentos
                controller.MostrarMensaje(idioma.lbCargandoDoc);
                //se cargan los tipo de documentos
                model.sttipodoc.load({
                    callback: function() {
                        if (model.sttipodoc.reader.jsonData.codMsg == -1) {
                            // mostrarMensaje(1, idioma.lbSMSRazones);
                            mostrarMensaje(1, 'No existen documentos para banco configurados.');
                        } else if (model.sttipodoc.reader.jsonData.codMsg == -2) {
                            mostrarMensaje(1, 'No existen instrumentos de pagos pendientes por asosiar a un talonario.');
                        }
                        loadMask.hide();
                    }
                });
            }
        });

        //evento para el store de los documentos
        model.sttipodoc.on('beforeload', function(s, options) {
            this.clearFilter(true);
            //this.baseParams.idtalonario = view.action ? view.tpTalonario.getSelectionModel().getSelectedNode().attributes.idtalonario : 0;
            this.baseParams.idtalonario = view.action ? view.gpTalonario.getSelectionModel().getSelected().data.idtalonario : 0;
            if (view.action)
                //this.baseParams.idcuentabancaria = view.tpTalonario.getSelectionModel().getSelectedNode().attributes.idcuentabancaria;
                this.baseParams.idcuentabancaria = view.gpTalonario.getSelectionModel().getSelected().data.idcuentabancaria;
            else if (view.cbcuentaBanc.getValue())
                this.baseParams.idcuentabancaria = view.cbcuentaBanc.getValue();
        });

        //evento para el store de los documentos
        model.sttipodoc.on('load', function(s, record, options) {
            if (view.action) {
                if (this.getCount()) {
                    for (var i = 0; i < this.getCount(); i++) {
                        if (this.getAt(i).data.marcado == true) {
                            view.gptipodoc.getSelectionModel().selectRow(i);
                        }
                    }
                }
            }
        });

        view.tfnuminicio.validator = function(value) {
            var valinicio = parseInt(value);
            var valfin = parseInt(view.tfnumfinal.getValue());
            if(!isNaN(valfin)) {
                if(valinicio > valfin) {
                    return idioma.lbSMSErrorComp;
                }
            }
            return true;
        };

        //evento para el ENTER
        view.tfnuminicio.on('keypress', function(tf, event) {
            if (event.getKey() != 8 && event.getKey() != 46) { // Para que permita borrar
                var value = new String(parseFloat(tf.getValue()));
                if (value.length >= 17)
                    event.stopEvent();  // Para que no escriba m?s de 17 caracteres
            }
            if (event.getKey() == 13) { // Enter
                view.tfnumfinal.focus(false, 100);//(darle el foco a este campo)
            }
        });

        //evento para el ENTER
        view.tfnuminicio.on('keyup', function(tf, event) {
            controller.formatTalonario(view.tfnuminicio);
            //se comprueba que el #inico sea mayor que el #fin
            if (parseFloat(view.tfnuminicio.getValue()) > parseFloat(view.tfnumfinal.getValue())) {
                view.tfdisponibles.setValue('');
                //view.tfnumfinal.markInvalid(idioma.lbSMSErrorComp);
            }
            else {
                controller.freeTalonario();//se recalculan los disponibles
            }
        });

        //evento para el ENTER
        view.tfnumfinal.on('keypress', function(tf, event) {
            if (event.getKey() != 8 && event.getKey() != 46) {// Para que permita borrar
                var value = new String(parseFloat(tf.getValue()));
                if (value.length >= 17)
                    event.stopEvent();  // Para que no escriba m?s de 17 caracteres
            }
            if (event.getKey() == 13) { // Enter
                view.cbcuentaBanc.focus(false, 100);//(darle el foco a este campo)
            }
        });

        //evento para el ENTER
        view.tfnumfinal.on('keyup', function(tf, event) {
            controller.formatTalonario(view.tfnumfinal);
            //se comprueba que el #inico sea mayor que el #fin
            if (parseFloat(view.tfnuminicio.getValue()) > parseFloat(view.tfnumfinal.getValue())) {
                view.tfdisponibles.setValue('');
                //this.markInvalid(idioma.lbSMSErrorComp);
            }
            else {
                controller.freeTalonario();//se recalculan los disponibles
            }
        });

        //accion de btn aplicar Talonario
        view.btnAplicar.on('click', function() {
            controller.adicionarTalonario('apl');
        });

        //accion de btn aceptar Talonario
        view.btnAceptar.on('click', function() {
            if (view.btnAplicar.isVisible())
                controller.adicionarTalonario('acept');
            else
                controller.modificarTalonario();
        });

        //accion de btn cancelar Talonario
        view.btnCancelar.on('click', function() {
            view.winTalonario.hide();
        });

        //teclas de acceso rapido
        //adicionar Talonario
        view.globalKeyMap.accessKey({
            key: 'i',
            alt: true
        }, function() {
            if (!view.windowopen && !view.btnAdicionar.disabled) {
                view.action = false;
                view.winTalonario.show();
            }
        }, Ext.getBody());

        //modificar Talonario
        view.globalKeyMap.accessKey({
            key: 'm',
            alt: true
        }, function() {
            if (!view.windowopen && !view.btnModificar.disabled) {
                view.action = true;
                view.winTalonario.show();
            }
        }, Ext.getBody());

        //eliminar Talonario
        view.globalKeyMap.accessKey({
            key: Ext.EventObject.DELETE
        }, function() {
            if (!view.windowopen && !view.btnEliminar.disabled) {
//                if (view.tpTalonario.getSelectionModel().getSelectedNode()) {
                if (view.gpTalonario.getSelectionModel().getSelected()) {
                    controller.MsgEliminar();
                }
            }
        }, Ext.getBody());

        //graficar Talonario
        view.globalKeyMap.accessKey({
            key: 'g',
            ctrl: true
        }, function() {
            if (!view.windowopen) {
                controller.GraficarTalonarios();
            }
        }, Ext.getBody());


        //ayuda Talonario
        view.globalKeyMap.accessKey({
            key: 'h',
            alt: true
        }, function() {
            help.show(idioma.textTitleHelp, 'confin/banco/configuracion/talonario');
        }, Ext.getBody());


        //carga los datos necesarios para add o mod talonario
        this.loadDataComponent = function(action) {

            /*controller.MostrarMensaje(idioma.lbCargandoTal);*/
            controller.MostrarMensaje(idioma.lbTextCargando);
            model.sttipodoc.removeAll();
            //flagMsg = 0;//

            if (!action) {
                Ext.Ajax.request({
                    url: 'loadDataAddTalonario',
                    callback: function(options, success, response) {
                        loadMask.hide();
                        responseData = Ext.decode(response.responseText);
                        if ((responseData.formatos.datos.length < 1) || (responseData.cuentas.datos.length < 1)) {
                            var mensaje = idioma.lbConfDatos;
                            if (responseData.formatos.datos.length < 1) {
                                mensaje += '</br>' + idioma.lbConfFormatos;
                            }
                            if (responseData.cuentas.datos.length < 1) {
                                mensaje += '</br>' + idioma.lbConfCuentas;
                            }
                            mostrarMensaje(1, mensaje);
                        }

                        model.stformato.loadData(responseData.formatos);
                        model.stctaBancaria.loadData(responseData.cuentas);
                        controller.loadDataMod(action);
                    }});
            }
            else {
                model.sttipodoc.clearFilter(true);
                Ext.Ajax.request({
                    url: 'loadDataModTalonario',
                    params: {
                        idtalonario: view.gpTalonario.getSelectionModel().getSelected().data.idtalonario,
                        idcuentabancaria: view.gpTalonario.getSelectionModel().getSelected().data.idcuentabancaria
                    },
                    callback: function(options, success, response) {
                        loadMask.hide();
                        responseData = Ext.decode(response.responseText);
                        if ((responseData.formatos.datos.length < 1) || (responseData.cuentas.datos.length < 1)) {
                            var mensaje = idioma.lbConfDatos;
                            if (responseData.formatos.datos.length < 1) {
                                mensaje += '</br>' + idioma.lbConfDatosMod;
                            }
                            if (responseData.cuentas.datos.length < 1) {
                                mensaje += '</br>' + idioma.lbConfCuentas;
                            }
                            mostrarMensaje(1, mensaje);
                        }
                        model.stformato.loadData(responseData.formatos);
                        model.stctaBancaria.loadData(responseData.cuentas);
                        model.sttipodoc.loadData(responseData.docs);
                        controller.loadDataMod(action);
                    }});
            }
            //se cargan los formatos
            /* model.stformato.load({
             callback: function() {
             if (model.stformato.getCount()) {
             if (action) {
             if (++flagMsg == 3) {
             controller.loadDataMod(action);
             }
             } else {
             if (++flagMsg == 2) {
             controller.loadDataMod(action);
             }
             }
             }
             else {
             mostrarMensaje(1, idioma.lbSMSsinFormatos);
             loadMask.hide();
             }
             }
             });

             //se cargan las ctas bancarias
             model.stctaBancaria.load({
             callback: function() {
             if (model.stctaBancaria.getCount()) {
             if (action) {
             if (++flagMsg == 3) {
             controller.loadDataMod(action);
             }
             } else {
             if (++flagMsg == 2) {
             controller.loadDataMod(action);
             }
             }
             }
             else {
             mostrarMensaje(1, idioma.lbSMSMasRazo);
             loadMask.hide();
             }
             }
             });

             //si se esta modificando se carga a la vez
             if (action) {
             //se cargan los tipo de documentos
             model.sttipodoc.load({
             callback: function() {
             if (model.sttipodoc.getCount()) {
             if (++flagMsg == 3) {
             controller.loadDataMod(action);
             }
             }
             else {
             mostrarMensaje(1, idioma.lbSMSRazones);
             loadMask.hide();
             }
             }
             });
             }*/
        };

        //carga los datos del mod talonario
        /*this.loadDataMod = function(action) {
         //caso del modificar
         if (action) {
         view.tfnuminicio.setValue(view.tpTalonario.getSelectionModel().getSelectedNode().attributes.numeroinicio);
         view.tfnumfinal.setValue(view.tpTalonario.getSelectionModel().getSelectedNode().attributes.numerofin);
         view.tfdisponibles.setValue(view.tpTalonario.getSelectionModel().getSelectedNode().attributes.disponible);
         view.cbcuentaBanc.setValue(view.tpTalonario.getSelectionModel().getSelectedNode().attributes.idcuentabancaria);

         //se carga el valor que tenia el original
         var index = model.stformato.find('idparteformato', view.tpTalonario.getSelectionModel().getSelectedNode().attributes.idparteformato);
         if (index > -1) {
         view.cbformato.setValue(view.tpTalonario.getSelectionModel().getSelectedNode().attributes.idparteformato);
         view.cbformato.setRawValue(model.stformato.getAt(index).data.nombre);
         }
         }
         view.cbformato.focus(true, 100);
         loadMask.hide();
         };*/

        //carga los datos del mod talonario
        this.loadDataMod = function(action) {
            //caso del modificar
            if (action) {

                //se carga el valor que tenia el original
                var index = model.stformato.find('idparteformato', view.gpTalonario.getSelectionModel().getSelected().data.idparteformato);

                var objModTaonario = {
                    cbformato: (index > -1) ? view.gpTalonario.getSelectionModel().getSelected().data.idparteformato : '',
                    tfnuminicio: view.gpTalonario.getSelectionModel().getSelected().data.numeroinicio,
                    tfnumfinal: view.gpTalonario.getSelectionModel().getSelected().data.numerofin,
                    tfdisponibles: view.gpTalonario.getSelectionModel().getSelected().data.disponible,
                    cbcuentaBanc: view.gpTalonario.getSelectionModel().getSelected().data.idcuentabancaria,
                    spinner: view.gpTalonario.getSelectionModel().getSelected().data.orden
                };
                view.fpTalonario.getForm().setValues(objModTaonario);

                if (index > -1) {
                    view.cbformato.fireEvent('select');
                }
            }
            view.cbformato.focus(true, 100);
            loadMask.hide();
        };

        //crea el formato del numero de talonario
        this.formatTalonario = function(component) {

            if (!component.getValue()) {//si la expresion esta vacia(NAN) se pone en 1
                firstVal = String(Math.pow(10, component.maxLength - 1));
                component.setValue(firstVal.split("").reverse().join(""));
            }
            else {
                var num = "" + parseFloat(component.getValue());//se obtiene la cadena numerica valida en formato string
                var cadConcat = "";//cadena de ceros a concatenar
                if (num.length <= 13) {//si la cadena numerica valida es menor que 13
                    for (i = 0; i < component.maxLength - num.length; i++) {
                        cadConcat += "0";
                    }
                    if (num.length == 1 && num.charAt(0) == 0) {//si la expresion esta en 0 se pone en 1
                        firstVal = String(Math.pow(10, component.maxLength - 1));
                        component.setValue(firstVal.split("").reverse().join(""));
                    }
                    else  //si no esta en cero se completa con ceros delante
                        component.setValue(cadConcat + parseFloat(component.getValue()));
                }
            }
        };

        //calcula los talonarios disponibles
        this.freeTalonario = function() {
            if (view.tfnuminicio.getValue() && view.tfnumfinal.getValue())
                if (parseFloat(view.tfnumfinal.getValue()) * 1 >= parseFloat(view.tfnuminicio.getValue()) * 1) {
                    view.tfdisponibles.setValue((parseFloat(view.tfnumfinal.getValue()) - parseFloat(view.tfnuminicio.getValue())) + 1);
                    return;
                }
            view.tfdisponibles.setValue('');
        };

        //realiza validacion de form talonario
        this.validaFormulario = function() {
            if (view.fpTalonario.getForm().isValid()) {
                if (!view.gptipodoc.getSelectionModel().hasSelection()) {
                    view.gptipodoc.getSelectionModel().selectFirstRow();
                    view.btnAceptar.focus();
                    mostrarMensaje('1', idioma.lbSMSsinSeleccion);
                    return false;//no es valido el componente
                }
                else if (parseFloat(view.tfnumfinal.getValue()) * 1 < parseFloat(view.tfnuminicio.getValue()) * 1) {
                    view.tfnumfinal.focus(true, true);
                    mostrarMensaje('1', idioma.lbSMSErrorComp);
                    view.tfnumfinal.setValue('');
                    view.tfnumfinal.markInvalid(idioma.lbMsgReq);
                    view.tfdisponibles.setValue('');
                    return false;//no es valido el componente
                }
                else {
                    return true;//es valido el componente
                }
            }
            else {//no es valido el componente
                if (!view.cbformato.isValid()) {
                    view.cbformato.focus(true, true);
                }
                else if (!view.cbcuentaBanc.isValid()) {
                    view.cbcuentaBanc.focus(true, true);
                }
                mostrarMensaje(1, idioma.lbMsgcampo);
                return false;
            }
        };

        //adiciona el talonario
        this.adicionarTalonario = function(action) {
            if (controller.validaFormulario()) {
                controller.progressBar(idioma.lbMsgGuardando);
                var TipodocumentosSeleccionados = view.gptipodoc.getSelectionModel().getSelections();
                var idtipodocumentos = new Array();
                if (TipodocumentosSeleccionados.length > 0) {
                    for (var i = 0; i < TipodocumentosSeleccionados.length; i++) {
                        idtipodocumentos[i] = TipodocumentosSeleccionados[i].data.idtipodoctalonario;
                    }
                }
                Ext.Ajax.request({
                    url: 'insertartalonario',
                    params: {
                        numinicio: parseFloat(view.tfnuminicio.getValue()),
                        numfinal: parseFloat(view.tfnumfinal.getValue()),
                        disponibles: view.tfdisponibles.getValue(),
                        idtipodocumentos: Ext.encode(idtipodocumentos),
                        idcuentabancaria: view.cbcuentaBanc.getValue(),
                        idparteformato: view.cbformato.getValue()
                    },
                    callback: function(options, success, response) {
                        Ext.MessageBox.hide();
                        if (!response.responseText) {
                            mostrarMensaje(3, idioma.lbMsgErrorInterno);
                        }
                        else {
                            var responseData = Ext.decode(response.responseText);
                            switch (responseData.n_codMsg) {
                                case 1:
                                    model.stTalonario.reload();
                                    mostrarMensaje(1, idioma.lbMsgExito);
                                    break;
                                case 2:
                                    mostrarMensaje(1, idioma.lbSMSErrorCta);
                                    break;
                                case 3:
                                    mostrarMensaje(3, responseData.mensaje);
                                    break;
                                case 4:
                                    if (idtipodocumentos.length == 1)
                                        mostrarMensaje(1, idioma.lbSMSErrorTipodoc);
                                    else
                                        mostrarMensaje(1, idioma.lbSMSErrorTiposdoc);
                                    model.sttipodoc.load({
                                        callback: function() {
                                            if (!model.sttipodoc.getCount()) {
                                                view.cbcuentaBanc.clearValue();
                                                model.stctaBancaria.load({
                                                    callback: function() {
                                                        if (!model.stctaBancaria.getCount()) {
                                                            view.winTalonario.hide();
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    break;
                                case 5:
                                    mostrarMensaje(1, idioma.lbSMSErrorTal);
                                    model.sttipodoc.load({
                                        callback: function() {
                                            if (!model.sttipodoc.getCount())
                                            {
                                                view.cbcuentaBanc.clearValue();
                                                model.stctaBancaria.load({
                                                    callback: function() {
                                                        if (!model.stctaBancaria.getCount()) {
                                                            view.winTalonario.hide();
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    break;
                                default:
                                    mostrarMensaje(3, idioma.lbMsgErrorInterno);
                                    break;
                            }
                        }

                        if (action != 'apl') {
                            view.winTalonario.hide();
                        }

//                        view.fpTalonario.getForm().reset();
                        controller.limpiarFormTalonario();
                        model.sttipodoc.removeAll();
                        view.btnModificar.setDisabled(true); // Inabilitar boton modificar
                        view.btnEliminar.setDisabled(true);
                        //model.stTalonario.reload();
                        /*view.tlTalonario.load(view.tnTalonario, function() {
                         view.tnTalonario.expand();
                         });*/
                    }
                });
            }
        };

        //verifica si se realizaron cambios
        this.cambioFormulario = function() {
            /* if (view.tpTalonario.getSelectionModel().getSelectedNode().attributes.numeroinicio != view.tfnuminicio.getValue())
             return true;
             if (view.tpTalonario.getSelectionModel().getSelectedNode().attributes.numerofin != view.tfnumfinal.getValue())
             return true;
             if (view.tpTalonario.getSelectionModel().getSelectedNode().attributes.idcuentabancaria != view.cbcuentaBanc.getValue())
             return true;
             */
            if (view.gpTalonario.getSelectionModel().getSelected().data.numeroinicio != view.tfnuminicio.getValue())
                return true;
            if (view.gpTalonario.getSelectionModel().getSelected().data.numerofin != view.tfnumfinal.getValue())
                return true;
            if (view.gpTalonario.getSelectionModel().getSelected().data.idcuentabancaria != view.cbcuentaBanc.getValue())
                return true;
            if (view.gpTalonario.getSelectionModel().getSelected().data.orden != view.spinner.getValue())
                return true;

            //los que fueron seleccionados para modificar
            var newSelections = view.gptipodoc.getSelectionModel().getSelections();
            var arrNewSelections = new Array();
            for (i = 0; i < newSelections.length; i++) {
                arrNewSelections.push(newSelections[i].data.idtipodoctalonario);
            }

            var arrOldSelections = new Array();
            for (i = 0; i < model.sttipodoc.getCount(); i++) {
                if (model.sttipodoc.getAt(i).data.marcado) {
                    arrOldSelections.push(model.sttipodoc.getAt(i).data.idtipodoctalonario);
                }
            }

            var modificado = new Array();//si contiene elementos es que se modifico algo
            modificado = array_diff(arrNewSelections, arrOldSelections);

            if (modificado.length > 0)
                return true;
            else
                return false;
        };

        //modifica el talonario
        this.modificarTalonario = function() {
            if (controller.validaFormulario()) {
                if (controller.cambioFormulario()) {
                    controller.progressBar(idioma.lbMsgGuardando);
                    var TipodocumentosSeleccionados = view.gptipodoc.getSelectionModel().getSelections();

                    var idtipodocumentos = new Array();
                    if (TipodocumentosSeleccionados.length > 0) {
                        for (var i = 0; i < TipodocumentosSeleccionados.length; i++) {
                            idtipodocumentos.push(TipodocumentosSeleccionados[i].data.idtipodoctalonario);
                        }
                    }
                    Ext.Ajax.request({
                        url: 'modificartalonario',
                        params: {
                            idtalonario: view.gpTalonario.getSelectionModel().getSelected().data.idtalonario,
                            numinicio: view.tfnuminicio.getValue(),
                            numfinal: view.tfnumfinal.getValue(),
                            disponibles: view.tfdisponibles.getValue(),
                            idtipodocumentos: Ext.encode(idtipodocumentos),
                            idcuentabancaria: view.cbcuentaBanc.getValue(),
                            idparteformato: view.cbformato.getValue(),
                            orden: view.spinner.getValue()
                        },
                        callback: function(options, success, response) {
                            Ext.MessageBox.hide();
                            if (!response.responseText) {
                                mostrarMensaje(3, idioma.lbMsgErrorInterno);
                            }
                            else {
                                var responseData = Ext.decode(response.responseText);
                                switch (responseData.n_codMsg) {
                                    case 1:
                                        model.stTalonario.reload();
                                        mostrarMensaje(1, idioma.lbMsgExitoMod);
                                        view.winTalonario.hide();
//                                        view.fpTalonario.getForm().reset();
                                        controller.limpiarFormTalonario();
                                        model.sttipodoc.removeAll();
                                        view.btnModificar.setDisabled(true); // Inabilitar boton modificar
                                        view.btnEliminar.setDisabled(true);
                                        break;
                                    case 2:
                                        mostrarMensaje(1, idioma.lbSMSErrorCta);
                                        break;
                                    case 3:
                                        mostrarMensaje(3, responseData.mensaje);
                                        break;
                                    case 4:
                                        if (modificar.length + adicionar.length == 1)
                                            mostrarMensaje(1, idioma.lbSMSErrorTipodoc);
                                        else
                                            mostrarMensaje(1, idioma.lbSMSErrorTiposdoc);
                                        break;
                                    case 5:
                                        mostrarMensaje(1, idioma.lbSMSErrorTal);
                                        break;
                                    case 6:
                                        mostrarMensaje(1, idioma.lbExisteOrdenTal);
                                        break;
                                    case 7:
                                        mostrarMensaje(1, idioma.lbFueraRangoTal);
                                        break;
                                    default:
                                        mostrarMensaje(3, idioma.lbMsgErrorInterno);
                                        break;
                                }
                            }
                            /*view.tlTalonario.load(view.tnTalonario, function() {
                             view.tnTalonario.expand();
                             });*/
                        }
                    });
                } else {
                    view.cbformato.focus(true, true);
                    mostrarMensaje(1, idioma.lbMsgCampossinMod);
                }
            }
        };

        //muestra msg question eliminar
        this.MsgEliminar = function() {
            Ext.Msg.show({
                title: idioma.lbMsgTitleConf,
                buttons: Ext.Msg.OKCANCEL,
                msg: idioma.lbTitMsgConfirmElim,
                icon: Ext.MessageBox.QUESTION,
                fn: function(btn) {
                    if (btn == 'ok') {
                        controller.EliminarTalonario();
                    }
                }
            });
        };

        this.EliminarTalonario = function() {
//            id = (view.tpTalonario.getSelectionModel().getSelectedNode()) ? view.tpTalonario.getSelectionModel().getSelectedNode().attributes.idpadre : 0;
//            if (!view.tpTalonario.getSelectionModel().getSelectedNode().attributes.asociado_caja)
            id = (view.gpTalonario.getSelectionModel().getSelected()) ? view.gpTalonario.getSelectionModel().getSelected().data.idpadre : 0;
            if (!view.gpTalonario.getSelectionModel().getSelected().data.asociado_caja)
            {
                controller.progressBar(idioma.lbMsgtitleEliminando);
                Ext.Ajax.request({
                    url: 'eliminartalonario',
                    params: {
                        idtalonario: view.gpTalonario.getSelectionModel().getSelected().data.idtalonario
                    },
                    callback: function(options, success, response) {
                        Ext.MessageBox.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData == 1) {
//                            view.fpTalonario.getForm().reset();
//                            controller.limpiarFormTalonario();
                            view.btnModificar.setDisabled(true); // Inabilitar boton modificar
                            view.btnEliminar.setDisabled(true); // Inabilitar boton eliminar
                            model.stTalonario.reload();
                            mostrarMensaje(1, idioma.lbDelTalonario);
                            /*view.tlTalonario.load(view.tnTalonario, function() {
                             view.tnTalonario.expand();
                             });*/

                        } else
                            mostrarMensaje(1, idioma.lbNoDelTalonario);
                    }
                });
            }
            else {
                mostrarMensaje(1, idioma.lbErrorFondo);
            }
        };

        //funcion para graficar los estados de los talonarios
        this.GraficarTalonarios = function() {
            controller.MostrarMensaje(idioma.lbTextCargando);
            Ext.Ajax.request({
                url: 'graficarEstadoTalonarios',
                method: 'POST',
                params: {
                    colors: Ext.encode(Highcharts.getOptions().colors)
                },
                callback: function(options, success, response){
                    responseData = Ext.decode(response.responseText);
                    if (responseData === false) {
                        mostrarMensaje(1, idioma.lbNoConf);
                        loadMask.hide();
                        return;
                    }
                    view.winGraficar.show();
                    loadMask.hide();

                    var colors = Highcharts.getOptions().colors,
                            categories = responseData.xAxis,
                            name = idioma.lbTextCargandoGraf,
                            data = responseData.data;

                    function setChart(name, categories, data, color) {
                        chart.xAxis[0].setCategories(categories);
                        chart.series[0].remove();
                        chart.addSeries({
                            name: name,
                            data: data,
                            color: color || 'white'
                        });
                    }

                    chart = new Highcharts.Chart({
                        chart: {
                            renderTo: 'container',
                            type: 'column'
                        },
                        title: {
                            //text: 'Browser market share, April, 2011'
                            text: ''
                        },
                        subtitle: {
                            //text: 'Click en las columnas para ver detalles. Click nuevamente para regresar.'
                            text: ''
                        },
                        xAxis: {
                            categories: categories,
                            labels: {
                                rotation: -30,
                                align: 'right',
                                style: {
                                    fontSize: '12px',
                                    fontFamily: 'Verdana, sans-serif'
                                }
                            }

                        },
                        yAxis: {
                            title: {
                                text: idioma.lbCantidadGraf
                            }
                        },
                        plotOptions: {
                            column: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function() {
                                            var drilldown = this.drilldown;
                                            if (drilldown) { // drill down
                                                setChart(drilldown.name, drilldown.categories, drilldown.data, drilldown.color);
                                            }
                                            else { // restore
                                                setChart(name, categories, data);
                                            }
                                        }
                                    }
                                },
                                dataLabels: {
                                    enabled: true,
                                    color: colors[0],
                                    style: {
                                        fontWeight: 'bold'
                                    },
                                    formatter: function() {
                                        return this.y;
                                    }
                                }
                            }
                        },
                        tooltip: {
                            formatter: function() {
                                var point = this.point,
                                        s = '<b>' + this.point.nameCta + '</b><br/>' + idioma.lbTotal + '<b>' + this.point.allTal + '</b><br/>' + idioma.lbUtil + '<b>' + this.point.usedTal + '</b><br/>' + idioma.lbDispon + '<b>' + this.point.freeTal + '</b><br/>';
                                if (point.drilldown) {
                                    s += idioma.lbClickGraf;
                                } else {
                                    s += idioma.lbClickPGraf;
                                }
                                return s;
                            }
                        },
                        series: [{
                                name: name,
                                data: data,
                                color: 'white'
                            }]
                    });
                }
            });
        };

        //muestra la mascara segun el msg
        this.MostrarMensaje = function(mensaje) {
            loadMask = new Ext.LoadMask(Ext.getBody(), {
                msg: mensaje
            });
            loadMask.show();
        };
        // barra de progreso
        this.progressBar = function(msg) {
            Ext.MessageBox.show({
                title: idioma.lbMsgEspere,
                msg: msg,
                width: 300,
                progress: true,
                closable: false
            });
            var f = function(v) {
                return function() {
                    var i = v / 11;
                    Ext.MessageBox.updateProgress(i/*, Math.round(100*i)+'% completado'*/);
                };
            };
            for (var i = 1; i < 12; i++) {
                setTimeout(f(i), i * 500);
            }
        };//fn de la funcion progressBar

        this.limpiarFormTalonario = function() {
            view.cbformato.clearValue();
            view.tfnuminicio.setValue('');
            view.tfnumfinal.setValue('');
            view.cbcuentaBanc.clearValue();
            view.tfdisponibles.setValue('');
        };

    }
};
