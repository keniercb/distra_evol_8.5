//Empaquetando el componente estado de cuenta
Ext.ns('Banco.Estadocta');

//Controller del componente estado de cuenta.
Banco.Estadocta.Controller = {
    /**
     *Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param view Vista del componente Banco.Estadocta
     * @param model Modelo de la vista del componente Banco.Estadocta
     */
    init: function (idioma, view, model) {

        //this.arrayDiferencia = new Array();//arreglo  usado para guardar  las diferencias del  estado de cuenta que se crea --- un store temporal,
        this.arrayDifCtaB = new Array();//arreglo usado para guardar por cada cta bancaria un store temporal para diferencias
        //this.arrayOper = new Array();//arreglo  usado para guardar  las operaciones del  estado de cuenta que se crea --- un store temporal,
        this.arrayOperCtaB = new Array();//arreglo usado para guardar por cada cta bancaria su  a un store temporal, para operaciones
        this.saldofin = 0;//almacena el saldo final(calculable)
        this.saldofinmod = 0;//almacena el saldo final para caso modificar(calculable)
        this.saldoini = 0;//almacena el saldo inicio
        this.search = false;//para saber cuando se esta buscando
        this.firstLoadDeposito = true;//para saber cuando se modifica la primera carga de los depósitos
        controller = this;

        /*/cargar el listado de estados de cta
         model.stEstadocuenta.load({
         params: {
         start: 0,
         limit: 20
         }
         */


        model.stEstadocuenta.on({
            scope: this,
            beforeload: function (store) {
                if (view.dfFechaInicio.getRawValue() || view.dfFechaFin.getRawValue() || view.cbCtaBanc.getValue()) {
                    this.search = true;
                    store.baseParams.fechaIni = view.dfFechaInicio.getRawValue();
                    store.baseParams.fechaFin = view.dfFechaFin.getRawValue();
                    store.baseParams.idCuentaBanc = view.cbCtaBanc.getValue();
                }
            }
        });

        //evento al cargar el listado de estado de cta
        model.stEstadocuenta.on('load', function (store, records, options) {
            if (store.getCount() > 0) {
                view.gpEstadocuenta.getSelectionModel().selectFirstRow();
            } else {
                var msg = (this.search) ? idioma.msgEmptyDataSearch : idioma.msgEmptyData;
                mostrarMensaje(1, msg);
                view.btnModificar.setDisabled(true);
                view.btnEliminar.setDisabled(true);
            }
        }, this);

        //evento al cargar el listado de estado de cta
        model.stOperCargadas.on('beforeload', function (store, options) {
            store.clearFilter(true);
            if (view.gpEstadocuenta.getSelectionModel().getSelected()) {
                store.baseParams.idcuentabancaria = view.gpEstadocuenta.getSelectionModel().getSelected().data.idcuentabancaria;
                store.baseParams.idestadodecuenta = view.gpEstadocuenta.getSelectionModel().getSelected().data.idestadodecuenta;
            }
            store.baseParams.operacionescargadas = 1;
        });

        //evento al cargar el listado de estado de cta
        model.stCorrecBanco.on('beforeload', function (store, options) {
            store.clearFilter(true);
            if (view.gpEstadocuenta.getSelectionModel().getSelected()) {
                store.baseParams.idcuenta = view.gpEstadocuenta.getSelectionModel().getSelected().data.idcuentabancaria;
                store.baseParams.idestadocuenta = view.gpEstadocuenta.getSelectionModel().getSelected().data.idestadodecuenta;
            }
        });

        model.stTabDepositos.on({
            scope: this,
            beforeload: function (store, options) {
                store.clearFilter(true);
                if (view.gpEstadocuenta.getSelectionModel().getSelected()) {
                    store.baseParams.idestadocuenta = view.gpEstadocuenta.getSelectionModel().getSelected().data.idestadodecuenta;
                }
            }
        });

        //evento al seleccionar los estados de cta
        view.gpEstadocuenta.getSelectionModel().on('rowselect', function (sm, rowindex, record) {
            view.btnModificar.enable();
            view.btnEliminar.enable();
            //si es de carga inicial no se debe modificar
            if (model.stEstadocuenta.data.items[rowindex].get('saldoinical') == 'Carga inicial') {
                view.btnModificar.disable();
            } else {
                // var estcuentbycuent = view.gpEstadocuenta.getStore().query('idcuentabancaria', record.data.idcuentabancaria);
                // var lastestcuenta = true;
                //
                // if (estcuentbycuent.length > 1) {
                //     var estselected = record.data;
                //     var timestampselected = estselected.fecha.getTime();
                //     for (var i = 0; i < estcuentbycuent.length; i++) {
                //         if (timestampselected < estcuentbycuent.items[i].data.fecha.getTime()) {
                //             lastestcuenta = false;
                //             break;
                //         }
                //     }
                // }

                if (!record.json.ultimo) {
                    view.btnModificar.disable();
                    view.btnEliminar.disable();
                }
            }
            //Nuevo (Cuando se hacia la busqueda por fecha dejaba aliminar el estado de cuenta)
            // if(record.data.conciliado){
            //     view.btnModificar.disable();
            //     view.btnEliminar.disable();
            // }
            view.gpEstadocuenta.getView().addRowClass(rowindex, "negrita");
        });

        //evento al deseleccionar los estados de cta
        view.gpEstadocuenta.getSelectionModel().on('rowdeselect', function (sm, rowindex, record) {
            view.btnModificar.disable();
            view.btnEliminar.disable();
            view.gpEstadocuenta.getView().removeRowClass(rowindex, "negrita");

            model.stOperCargadas.removeAll();
            model.stCorrecBanco.removeAll();
            model.stTabDepositos.removeAll();
            //view.pOperaciones.collapse();
        });

        //evento al hacer dbclick en los estados de cta
        view.gpEstadocuenta.on('rowdblclick', function (grid, rowindex, record) {
            model.stOperCargadas.load();
            model.stCorrecBanco.load();
            model.stTabDepositos.load();
            view.pOperaciones.expand();
        });

        //evento al hacer click en el selection model del grid opraciones en tránsito
        view.gpaddoper.getSelectionModel().on({
            rowdeselect: function (selmodel, rowIndex, record) {
                if (selmodel.getCount() === 0) {
                    view.btnApliOper.setDisabled(true);
                    view.btnAcepOper.setDisabled(true);
                }
            },
            rowselect: function (selmodel, rowIndex, record) {
                view.btnApliOper.setDisabled(false);
                view.btnAcepOper.setDisabled(false);
            }
        });

        //accion de btn adicionar estadoCta
        view.btnAdicionar.on('click', function () {
            if (!view.windowopen) {
                controller.openEstadoCta('add');
            }
        });

        //accion de btn modificar estadoCta
        view.btnModificar.on('click', function () {
            if (!view.windowopen) {
                controller.openEstadoCta('mod');
            }
        });

        //accion de btn eliminar estadoCta
        view.btnEliminar.on('click', function () {
            if (!view.windowopen) {
                controller.eliminarEstadoCta();
            }
        });

        //accion de btn conciliar estadoCta
        view.btnConciliar.on('click', function () {
            if (!view.windowopen) {
                controller.openConciliaciones();
            }
        });

        //accion para el btn del botón buscar
        view.btnBuscar.on({
            click: function () {
                if (!view.windowopen) {
                    controller.buscarEstadoCuenta();
                }
            }
        });

        //acción para el botón de actualizar deposito
        view.btnActualizarDep.on({
            scope: this,
            click: function () {
                view.filters.clearFilters();
                this.cargarDepositos(true, view.actionbtn);
            }
        });

        view.smDepositos.on({
            scope: this,
            rowselect: function (sm, rowIndex, record) {
                if (!this.firstLoadDeposito) {
                    this.updateSaldoFinalWithDeposito('suma', record);
                }
                this.enableDisableFechaEC();
            },
            rowdeselect: function (sm, rowIndex, record) {
                if (!this.firstLoadDeposito) {
                    this.updateSaldoFinalWithDeposito('resta', record);
                }
                this.enableDisableFechaEC();
            }
        });

        view.dfFechaInicio.on({
            invalid: function () {
                view.btnBuscar.setDisabled(true);
            },
            valid: function () {
                view.btnBuscar.setDisabled(false);

                // if (view.dfFechaInicio.getRawValue() == '') {
                //     view.btnBuscar.setDisabled(true);
                // }
            },
            change: function (field, newVal, oldVal) {
                view.dfFechaFin.setMinValue(newVal);
            }
            // keyup: function (datefield, event) {
            //     if (event.getKey() == 13 && !view.btnBuscar.disabled && !view.windowopen) {
            //         controller.buscarEstadoCuenta();
            //     }
            // }
        });

        view.dfFechaFin.on({
            invalid: function () {
                view.btnBuscar.setDisabled(true);
            },
            valid: function () {
                view.btnBuscar.setDisabled(false);

                // if (view.dfFechaInicio.getRawValue() == '') {
                //     view.btnBuscar.setDisabled(true);
                // }
            },
            change: function (field, newVal, oldVal) {
                view.dfFechaInicio.setMaxValue(newVal);
            },
            // keyup: function (datefield, event) {
            //     if (event.getKey() == 13 && !view.btnBuscar.disabled && !view.windowopen) {
            //         controller.buscarEstadoCuenta();
            //     }
            // }
        });

        view.tfnumero.on({
            scope: this,
            blur: function (field) {
            }
        });

        view.paginToolbar.btnClearFilter.on({
            scope: this,
            click: function () {
                view.dfFechaInicio.reset();
                view.dfFechaFin.reset();
                view.cbCtaBanc.reset();
                this.search = false;
            }
        });

        //accion de btn ayuda estadoCta
        view.btnAyuda.on('click', function () {
            //help.show(idioma.lbTitleHelp, 'confin/banco/estado_de_cuenta');
        });

        //teclas de acceso rapido
        //adicionar EstadoC
        view.globalKeyMap.accessKey({
            key: 'i',
            alt: true
        }, function () {
            if (!view.windowopen) {
                controller.openEstadoCta('add');
            }
        }, Ext.getBody());

        //modificar EstadoC
        view.globalKeyMap.accessKey({
            key: 'm',
            alt: true
        }, function () {
            if (!view.windowopen && !view.btnModificar.disabled) {
                controller.openEstadoCta('mod');
            }
        }, Ext.getBody());

        //eliminar EstadoC
        view.globalKeyMap.accessKey({
            key: Ext.EventObject.DELETE
        }, function () {
            if (!view.windowopen && !view.btnEliminar.disabled) {
                if (view.gpEstadocuenta.getSelectionModel().getSelected()) {
                    controller.eliminarEstadoCta();
                }
            }
        }, Ext.getBody());

        //ayuda EstadoC
        view.globalKeyMap.accessKey({
            key: 'h',
            alt: true
        }, function () {
            if (!view.viewPort.disabled)
                help.show(idioma.lbTitleHelp, 'confin/banco/estado_de_cuenta');
        }, Ext.getBody());

        //Btn Conciliar
        view.globalKeyMap.accessKey({
            key: 'o',
            alt: true
        }, function () {
            if (!view.btnConciliar.disabled && !view.windowopen) {
                controller.openConciliaciones();
            }
        }, Ext.getBody());

        view.globalKeyMap.accessKey({
            key: 'b',
            alt: true
        }, function () {
            if (!view.btnBuscar.disabled && !view.windowopen) {
                controller.buscarEstadoCuenta();
            }
        }, Ext.getBody());

        //evento al ocultarse
        view.winEstadocta.on('hide', function () {
            view.windowopen = false;
            view.fpEstadoCta.getForm().reset();
            model.stOperaciones.removeAll();
            view.btnAddOperacion.disable();
            view.btnDelOperacion.disable();
            view.btnDifBanco.disable();

            model.stOperCargadas.removeAll();
            model.stCorrecBanco.removeAll();
            model.stTabDepositos.removeAll();
            view.pOperaciones.collapse();

            //Reiniciar las cosas de depósito
            model.stDepositos.removeAll();
            view.smDepositos.clearSelections();
            view.tfimportedepositos.setValue('0.00');
            //Poniendo el deposito en primera carga
            controller.firstLoadDeposito = true;
        });

        //evento al mostrarse
        view.winEstadocta.on('show', function (window) {
            view.windowopen = true;
            view.cbCuentaBanc.focus(false, 100);

            //Key map del inicio y fin del formulario
            var btnAccept = view.btnAceptar;
            btnAccept.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    stopEvent: true,
                    fn: function () {
                        view.cbCuentaBanc.focus(true, true);
                    }
                }
            ]);

            view.cbCuentaBanc.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    shift: true,
                    stopEvent: true,
                    fn: function () {
                        btnAccept.focus();
                    }
                }
            ]);
        });

        //accion de btn aplicar estadoCta
        view.btnAplicar.on('click', function () {
            controller.adicionarEstadoCta('apli');
        });

        //accion de btn aceptar estadoCta
        view.btnAceptar.on('click', function () {
            controller.adicionarEstadoCta('acept');
        });

        //accion de btn cancelar estadoCta
        view.btnCancelar.on('click', function () {
            view.winEstadocta.hide();
            controller.arrayOperCtaB = new Array();
            controller.arrayDifCtaB = new Array();
            model.stDiferencias.removeAll();
        });

        //evento para el select
        view.cbCuentaBanc.on('select', function (combo, record, index) {
            controller.onSelectCta(combo, record, index);
        });

        //evento para el ENTER
        view.cbCuentaBanc.on('keypress', function (field, event) {
            if (event.getKey() == 13) {
                if (!view.cbCuentaBanc.getValue()) {
                    //view.cbCuentaBanc.setValue(model.stCuentaBanc.getAt(0).get('idcuentabancaria'));
                    //view.cbCuentaBanc.fireEvent('select', this);
                    view.cbCuentaBanc.reset();
                    view.cbCuentaBanc.focus(true, true);
                }
            }
        });

        //evento para el ENTER
        view.dfEstadoCta.on({
            scope: this,
            keypress: function (field, event) {
                if (event.getKey() == 13) {
                    if (!view.dfEstadoCta.getValue()) {//si no tiene valor toma el minimo
                        view.dfEstadoCta.setValue(view.fechaCont);
                    }
                    //se cargan las operaciones
                    /*if (view.dfEstadoCta.getValue() && view.dfEstadoCta.isValid()) {
                     controller.cargarOperaciones();
                     }*/
                }
            },
            change: function (field, newValue, oldValue) {
                this.cargarDepositos(false, view.actionbtn);
            }
        });

        //accion de btn adicionar operacion
        view.btnAddOperacion.on('click', function () {
            controller.cargarOperaciones();
        });

        //accion de btn eliminar operacion
        view.btnDelOperacion.on('click', function () {
            controller.delOperTransito();
        });

        //accion de btn diferencias
        view.btnDifBanco.on('click', function () {
            if (view.dfEstadoCta.isValid()) {
                view.winDiferencias.show();
            } else {
                view.dfEstadoCta.focus(false, 100);
            }

            if (view.actionbtn == 'add') {
                view.btnCorregirDif.hide();
            } else {
                view.btnCorregirDif.show();
            }
        });

        //evento al seleccionar  o deseleccionaruna operacion
        view.gpOperaciones.on('rowclick', function (Grid, rowIndex, e) {
            if (view.gpOperaciones.getSelectionModel().getSelected())
                view.btnDelOperacion.enable();
            else
                view.btnDelOperacion.disable();
        });

        //evento para el store de las operaciones
        model.staddoper.on('beforeload', function (s, options) {
            model.staddoper.clearFilter(true);
            model.staddoper.baseParams.instseleccionados = Ext.encode(InstrumentosSeleccionados());
            model.staddoper.baseParams.fechaestadocuenta = view.dfEstadoCta.getRawValue();
            if (view.cbCuentaBanc.getValue()) {
                model.staddoper.baseParams.idcuentabancaria = view.cbCuentaBanc.getValue();
            }

            function InstrumentosSeleccionados() {
                var instseleccionados = new Array();
                if (model.stOperaciones.getCount()) {
                    for (var i = 0; i < model.stOperaciones.getCount(); i++) {
                        instseleccionados.push(model.stOperaciones.getAt(i).get('idinstrumentobancario'));
                    }
                }
                return instseleccionados;
            }
            view.btnApliOper.setDisabled(true);
            view.btnAcepOper.setDisabled(true);
        });

        //evento al ocultarse
        view.winOperaciones.on('hide', function () {
            model.staddoper.removeAll();
            view.pagintoolbaraddoper.changePage(0);
        });

        //evento al mostrarse
        view.winOperaciones.on('show', function () {
            view.winOperaciones.center();

            //Key map del inicio y fin del formulario
            var btnAccept = view.btnAcepOper;
            btnAccept.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    stopEvent: true,
                    fn: function () {
                        view.btnCancOper.focus(true, true);
                    }
                }
            ]);

            view.btnCancOper.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    shift: true,
                    stopEvent: true,
                    fn: function () {
                        btnAccept.focus();
                    }
                }
            ]);
        });

        //evento al hacer dbclick en una operacion
        view.gpaddoper.on('rowdblclick', function (Grid, rowIndex, e) {
            controller.addOperTransito('apli');
        });

        //accion de btn aplicar operaciones estadoCta
        view.btnApliOper.on('click', function () {
            controller.addOperTransito('apli');
        });

        //accion de btn aceptar operaciones estadoCta
        view.btnAcepOper.on('click', function () {
            controller.addOperTransito('acept');
        });

        //accion de btn cancelar operaciones estadoCta
        view.btnCancOper.on('click', function () {
            view.winOperaciones.hide();
        });

        //evento al mostrarse
        view.winDiferencias.on('show', function () {
            controller.loadDataDiferencias();
            view.winDiferencias.center();
            view.btnCorregirDif.disable();
            view.btnDelDif.disable();
            view.tfdebcred.focus(false, 100);

            //Key map del inicio y fin del formulario
            var btnAccept = view.btnAcepDif;
            btnAccept.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    stopEvent: true,
                    fn: function () {
                        view.tfdebcred.focus(true, true);
                    }
                }
            ]);

            view.tfdebcred.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    shift: true,
                    stopEvent: true,
                    fn: function () {
                        btnAccept.focus();
                    }
                }
            ]);
        });

        //evento al ocultarse
        view.winDiferencias.on('hide', function () {
            view.fpdifbanco.getForm().reset();
        });

        //accion de btn cancelar diferencias
        view.btnCancDif.on('click', function () {
            view.winDiferencias.hide();
        });

        //accion de btn aceptar diferencias
        view.btnAcepDif.on('click', function () {
            var stringDifAfterOpenWindow = controller.stringValuesDiferencias();

            if (stringDifAfterOpenWindow == controller.stringDifBeforeOpenWindow) {
                mostrarMensaje(1, idioma.msgsinCambios);
            } else {
                controller.saveDiferencias();
                view.winDiferencias.hide();
            }
        });

        //accion de btn adicionar diferencia
        view.btnAddDif.on('click', function () {
            if (view.fpdifbanco.getForm().isValid() && view.tfdebcred.getValue() != '0.00') {
                controller.crearFila();
            } else {
                mostrarMensaje(1, idioma.msgImporteCero);
            }
        });

        //accion de btn eliminar diferencia
        view.btnDelDif.on('click', function () {
            view.fpdifbanco.getForm().clearInvalid();
            //moddiferencias=true;

            mostrarMensaje(2, idioma.questionDelDif, function (btn) {
                if (btn == 'ok') {
                    if (view.gpDiferencias.getSelectionModel().getSelected()) {
                        controller.eliminarfiladif();
                    } else {
                        view.btnDelDif.disable();
                    }
                }
            });
        });

        //accion de btn corregir diferencia
        view.btnCorregirDif.on('click', function () {
            if (view.gpDiferencias.getSelectionModel().getSelected()) {
                view.winCorreccion.show();
            } else {
                view.btnCorregirDif.disable();
            }
        });

        view.tfdebcred.on({
            scope: this,
            // blur: function (field, event) {
            //     //evento para cuando pierde el foco
            //     if (field.isValid()) {
            //         field.setRawValue(formatoMoneda(controller.limpiarComa(field.getValue())));
            //     }
            // },
            keyup: function () {
                if (view.tfdebcred.isValid() && view.tacoment.isValid()) {
                    view.btnAddDif.setDisabled(false);
                } else {
                    view.btnAddDif.setDisabled(true);
                }
            },
            keypress: function (field, event) {
                //evento para el ENTER
                if (event.getKey() != 8 && event.getKey() != 9) {
                    var value = new String(field.getValue());
                    var position = value.indexOf(".", 0);
                    if (position > -1 && (event.getKey() == 37 || event.getKey() == 39)) {// Para que no permita desplazarse hacia izq o der
                        event.stopEvent();
                    }
                    if (position > -1 && event.getKey() == 46) {// Para que solo permita un punto
                        event.stopEvent();
                    }
                    if (position > -1 && (value.length - position) > 2) {// Para que solo permita 2 lugares decimales
                        event.stopEvent();
                    }
                    if (position == -1 && value.length >= 16 && event.getKey() != 46) {// Para que escriba solo 16 caracteres antes del '.'
                        event.stopEvent();
                    }
                    if (value.length >= 19) {// Para que escriba solo 19 caracteres
                        event.stopEvent();
                    }
                }
                if (event.getKey() == 13) {// Para que ese posicione en el campo  comentario
                    view.tacoment.focus();//(darle el foco a este combo);
                }
            }
        });

        //evento para el ENTER
        view.tacoment.on('keypress', function (field, event) {
            if (event.getKey() == event.ENTER)
                event.stopEvent();  // Para que no escriba ENTER

            if (event.getKey() == 13) {
                if (view.fpdifbanco.getForm().isValid() && view.tfdebcred.getValue() != '0.00') {
                    controller.crearFila();
                } else {
                    mostrarMensaje(1, idioma.msgImporteCero);
                }
            }
        });

        view.tacoment.on({
            keyup: function () {
                if (view.tfdebcred.isValid() && view.tacoment.isValid()) {
                    view.btnAddDif.setDisabled(false);
                } else {
                    view.btnAddDif.setDisabled(true);
                }
            }
        });

        //evento al marcarlo
        view.rbtndebito.on('check', function (thisc, chked) {
            if (chked) {
                view.tfdebcred.focus(false, 100);
            }
        });

        //evento al marcarlo
        view.rbtncredito.on('check', function (thisc, chked) {
            if (chked) {
                view.tfdebcred.focus(false, 100);//(darle el foco a este combo)
            }
        });

        //evento al seleccionar las diferencias
        view.gpDiferencias.getSelectionModel().on('rowselect', function (sm, rowindex, record) {
            view.fpdifbanco.getForm().clearInvalid();
            if (record.data.nuevo) {
                view.btnDelDif.enable();
                view.btnCorregirDif.disable();
            } else {
                view.btnDelDif.disable();
                view.btnCorregirDif.enable();
            }
        });

        //evento al deseleccionar las diferencias
        view.gpDiferencias.getSelectionModel().on('rowdeselect', function (sm, rowindex, record) {
            view.btnDelDif.disable();
            view.btnCorregirDif.disable();
        });

        //evento al mostrarse
        view.winCorreccion.on('show', function () {
            view.tfimportecorrec.reset();
            var dif = view.gpDiferencias.getSelectionModel().getSelections();
            if (dif[0].data.debitocredito) {
                view.tfimportedif.setValue(formatoMoneda(parseFloat(dif[0].data.debito) + parseFloat(dif[0].data.correccion)));
            } else {
                view.tfimportedif.setValue(formatoMoneda(parseFloat(dif[0].data.credito) + parseFloat(dif[0].data.correccion)));
            }
            if (dif[0].data.correccion)
                view.tfimportecorrec.setValue(formatoMoneda(dif[0].data.correccion));
            view.winCorreccion.center();
            view.tfimportecorrec.focus(false, 100);

            //Key map del inicio y fin del formulario
            var btnAccept = view.btnAcepCorrecc;
            btnAccept.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    stopEvent: true,
                    fn: function () {
                        view.tfimportecorrec.focus(true, true);
                    }
                }
            ]);

            view.tfimportecorrec.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    shift: true,
                    stopEvent: true,
                    fn: function () {
                        btnAccept.focus();
                    }
                }
            ]);
        });

        //evento al perder el foco
        view.tfimportecorrec.on('blur', function (field, event) {
            if (field.isValid())
                field.setRawValue(formatoMoneda(controller.limpiarComa(field.getValue())));
        });

        //evento para el ENTER
        view.tfimportecorrec.on('keypress', function (field, event) {
            if (event.getKey() == 13) {
                if ((field.getValue() == '0' || field.getValue() == '0.00') || !field.isValid()) {
                    field.markInvalid();
                    field.reset();
                } else if (field.isValid() && field.getValue() != '0.00') {
                    if (parseFloat(controller.limpiarComa(field.getValue())) > parseFloat(controller.limpiarComa(view.tfimportedif.getValue())))
                        mostrarMensaje(1, idioma.msgImporteCorregir);
                    else {
                        controller.ActualizarDiferencia(controller.limpiarComa(field.getValue()));
                        view.winCorreccion.hide();
                    }
                }
            }
        });

        //accion de btn cancelar correcciones
        view.btnCancCorrecc.on('click', function () {
            view.tfimportecorrec.reset();
            view.winCorreccion.hide();
        });

        //accion de btn aceptar correcciones
        view.btnAcepCorrecc.on('click', function () {
            if ((view.tfimportecorrec.getValue() == '0' || view.tfimportecorrec.getValue() == '0.00') || !view.tfimportecorrec.isValid()) {
                view.tfimportecorrec.markInvalid();
                view.tfimportecorrec.reset();
            }
            if (view.tfimportecorrec.isValid() && view.tfimportecorrec.getValue() != '0.00') {
                if (parseFloat(controller.limpiarComa(view.tfimportecorrec.getValue())) > parseFloat(controller.limpiarComa(view.tfimportedif.getValue())))
                    mostrarMensaje(1, idioma.msgImporteCorregir);
                else {
                    controller.ActualizarDiferencia(controller.limpiarComa(view.tfimportecorrec.getValue()));
                    view.winCorreccion.hide();
                }
            }
        });

        //carga los datos iniciales y valida la apertura
        this.loadDataIni = function () {
            controller.loadMensaje(idioma.msgLoad);
            Ext.Ajax.request({
                url: 'loadDataIni',
                method: 'POST',
                params: {
                    start: 0,
                    limit: view.gpEstadocuenta.getBottomToolbar().pageSize
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.aperturado == 0) {//0=ci, 1=aperturado

                        mostrarMensaje(1, idioma.msgNoCierreCi, function () {
                            view.viewPort.disable();
                            view.gpEstadocuenta.disable();
                            view.pOperaciones.disable();
                            view.windowopen = true;
                        });
                    } else {
                        //cargar el listado de estados de cta
                        model.stEstadocuenta.loadData(responseData.gridEstCta);
                        if (responseData.fechaCont) {
                            view.finicio = responseData.fechaCont.fechai;
                            view.ffin = responseData.fechaCont.fechafin;
                            view.fechaCont = responseData.fechaCont.fecha;

                            view.dfFechaInicio.setValue(view.finicio);
                            view.dfFechaFin.setValue(view.fechaCont);
                            view.dfFechaInicio.setMaxValue(view.fechaCont);
                            view.dfFechaFin.setMaxValue(view.ffin);
                            view.dfFechaFin.setMinValue(view.finicio);

                            view.dfEstadoCta.setMinValue(view.finicio);
                            view.dfEstadoCta.setValue(view.fechaCont);
                            view.dfEstadoCta.setMaxValue(view.ffin);  //No se restringe la fecha de fin

                            var msg = 'Período actual: ' + responseData.periodo.nombre;
                            msg += ' desde ' + responseData.periodo.inicio + ' hasta ' + responseData.periodo.fin + ' | Fecha contable: ' + responseData.periodo.fechacontable;
                            view.labelPeriodo.setText(msg);

                        } else {
                            mostrarMensaje(1, idioma.msgNoFechaContable);
                        }
                    }

                    view.btnAdicionar.focus();
                    loadMask.hide();
                }//callback
            });
        };

        //abrir ventana add o mod estado cta
        this.openEstadoCta = function (action) {
            controller.loadMensaje(idioma.msgLoad);
            switch (action) {
                case 'add':
                    model.stCuentaBanc.load({
                        callback: function (options, success, response) {
                            if (!model.stCuentaBanc.getCount()) {
                                mostrarMensaje(1, idioma.msgNoCtaBancariaConfig);
                            } else {
                                view.cbCuentaBanc.enable();
                                ArrayCorreciones = new Array();
                                view.dfEstadoCta.setMinValue(view.finicio);
                                view.dfEstadoCta.setMaxValue(view.ffin);
                                view.winEstadocta.setTitle(idioma.lbTitleAdd);
                                view.winEstadocta.show();
                                view.winEstadocta.maximize();
                                view.winEstadocta.doLayout();
                                view.fpEstadoCta.getForm().isValid();
                            }
                            loadMask.hide();
                        }
                    });
                    view.actionbtn = 'add';
                    view.btnAplicar.show();
                    break;
                default:
                    view.btnAplicar.hide();
                    Ext.Ajax.request({
                        url: 'ultimoEstadoCta',
                        method: 'POST',
                        params: {
                            idestado: view.gpEstadocuenta.getSelectionModel().getSelected().data.idestadodecuenta
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            switch (responseData.cod) {
                                case 1:
                                    mostrarMensaje(1, idioma.msgNoUltimoEstCta);
                                    loadMask.hide();
                                    break;
                                default:
                                    //se cargan los datos para la modificacion
                                    controller.loadDataModificar(responseData.fecha);
                                    break;
                            }
                            view.actionbtn = 'mod';
                        }
                    });
                    break;
            }
        };

        //carga los datos para la modificacion
        this.loadDataModificar = function (fechaanterior) {
            if (model.stCuentaBanc.getCount() < 1) {
                model.stCuentaBanc.load();
            }
            view.btnAddOperacion.enable();
            view.btnDelOperacion.disable();
            view.btnDifBanco.enable();
            view.cbCuentaBanc.disable();
            if (fechaanterior) {
                var arrFI = view.finicio.split('/');
                var arrDO = fechaanterior.split('/');
                var fechafi = new Date(+arrFI[2], arrFI[1] - 1, +arrFI[0]).setUTCHours(0, 0, 0, 0);
                var fechado = new Date(+arrDO[2], arrDO[1] - 1, +arrDO[0]);
                var fechadonext = fechado.setDate(fechado.getDate() + 1);
                if (fechafi > fechadonext) {
                    view.dfEstadoCta.setMinValue(view.finicio);
                } else {
                    view.dfEstadoCta.setMinValue(fechado);
                }
            } else {
                view.dfEstadoCta.setMinValue(view.finicio);
            }
            view.dfEstadoCta.setMaxValue(view.ffin);

            view.winEstadocta.setTitle(idioma.lbTitleMod);
            view.winEstadocta.show();
            view.winEstadocta.maximize();
            view.winEstadocta.doLayout();
            view.dfEstadoCta.focus(false, 10);//(darle el foco a este combo);

            controller.arrayOperCtaB = new Array();
            controller.arrayDifCtaB = new Array();

            view.cbCuentaBanc.setValue(view.gpEstadocuenta.getSelectionModel().getSelected().data.idcuentabancaria);
            view.cbCuentaBanc.setRawValue(view.gpEstadocuenta.getSelectionModel().getSelected().data.nrocuenta + ' ' + view.gpEstadocuenta.getSelectionModel().getSelected().data.nombrecuentab);
            view.tfnumero.setValue(view.gpEstadocuenta.getSelectionModel().getSelected().data.nroestado);
            view.dfEstadoCta.setValue(view.gpEstadocuenta.getSelectionModel().getSelected().data.fecha);
            controller.saldoini = view.gpEstadocuenta.getSelectionModel().getSelected().data.saldoinical;
            controller.saldofinmod = view.gpEstadocuenta.getSelectionModel().getSelected().data.saldofinal;
            controller.saldofin = view.gpEstadocuenta.getSelectionModel().getSelected().data.saldofinal;
            view.tfsaldoini.setValue(formatoMoneda(parseFloat(controller.saldoini)));
            view.tfsaldofin.setValue(formatoMoneda(parseFloat(controller.saldofinmod)));

            Ext.Ajax.request({
                url: 'buscarDatosModificar',
                method: 'POST',
                scope: this,
                params: {
                    idcuentabancaria: view.gpEstadocuenta.getSelectionModel().getSelected().data.idcuentabancaria,
                    idestadodecuenta: view.gpEstadocuenta.getSelectionModel().getSelected().data.idestadodecuenta
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);

                    view.tfdifdebito.setValue(formatoMonedaABS(responseData.dif.diferenDebito));
                    view.tfdifcredito.setValue(formatoMonedaABS(responseData.dif.diferenCredito));
                    cargargridoperacionesMod(responseData.oper.datos);

                    controller.sobregiro = responseData.sobregiro;
                    //*********************************************
                    //Variables para almacenar los valores cuando se carga el modificar del estado de cuenta
                    //para poder saber si hubo cambios, se caragarán fecha, saldo final, débito y crédito de los instrumentos
                    // y débito y crédito de las diferencias
                    controller.fechaOld = view.dfEstadoCta.getRawValue();
                    controller.saldofinalOld = view.tfsaldofin.getValue();
                    controller.debinstOld = view.tfdebito.getValue();
                    controller.creinstOld = view.tfcredito.getValue();
                    controller.credifOld = view.tfdifcredito.getValue();
                    controller.debdifOld = view.tfdifdebito.getValue();
                    controller.noestacuentaOld = view.tfnumero.getValue();
                    //***************************************************************************************

                    loadMask.hide();
                    controller.cargarDepositos(false, view.actionbtn);
                }
            });
        };

        //llena las operaciones del estado de cta en el modificar
        function cargargridoperacionesMod(datos) {
            //se crean los records a adicionar
            recordT = Ext.data.Record.create([{
                name: 'idinstrumentobancario'
            }, {
                name: 'nodocumento'
            }, {
                name: 'tipoinstrumento'
            }, {
                name: 'credito'
            }, {
                name: 'debito'
            }, {
                name: 'importemb'
            }, {
                name: 'fecha'
            }, {
                name: 'origen'
            }, {
                name: 'descripcion'
            }]);

            var debito = 0;
            var credito = 0;

            for (var i = 0; i < datos.length; i++) {
                //se crea el record a cargar
                newrT = new recordT({
                    idinstrumentobancario: datos[i].idinstrumentobancario,
                    nodocumento: datos[i].nodocumento,
                    tipoinstrumento: datos[i].tipoinstrumento,
                    credito: (datos[i].credito) ? datos[i].credito : 0,
                    debito: (datos[i].debito) ? datos[i].debito : 0,
                    importemb: datos[i].importemb,
                    fecha: datos[i].fecha,
                    origen: datos[i].origen,
                    descripcion: datos[i].descripcion
                });
                //se adiciona el record al grid de las operaciones cargadas
                model.stOperaciones.add(newrT);

                if (datos[i].debito) {
                    debito = debito + parseFloat(model.stOperaciones.getAt(i).data.debito);
                }
                if (datos[i].credito) {
                    credito = credito + parseFloat(model.stOperaciones.getAt(i).data.credito);
                }

                /*if (view.dfEstadoCta.minValue.format('d/m/Y') < datos[i].fecha)
                 view.dfEstadoCta.setMinValue(datos[i].fecha);*/
            }

            view.tfcredito.setValue(formatoMonedaABS(credito));
            view.tfdebito.setValue(formatoMonedaABS(debito));
        }

        //busca la fecha contable actual
        /* this.cargarFechaContable = function() {
         Ext.Ajax.request({
         url: 'buscarfechacontable',
         callback: function(options, success, response) {
         responseData = Ext.decode(response.responseText);
         if (responseData.fechai) {
         view.finicio = responseData.fechai;
         view.ffin = responseData.fechafin;

         view.dfEstadoCta.setMinValue(view.finicio);
         view.dfEstadoCta.setMaxValue(view.ffin);  //No se restringe la fecha de fin
         } else {
         mostrarMensaje(1, idioma.msgNoFechaContable);
         }
         return;
         }
         });
         };*/

        //accion al seleccionar una cta banc
        this.onSelectCta = function (combo, record, index) {
            controller.loadMensaje(idioma.msgLoad);
            if (!record) {
                index = model.stCuentaBanc.find('idcuentabancaria', view.cbCuentaBanc.getValue());
                if (index !== -1)
                    record = model.stCuentaBanc.getAt(index);
            }
            Ext.Ajax.request({
                url: 'buscarProximoEstadoCta',
                method: 'POST',
                scope: this,
                params: {
                    idcuenta: record.data.idcuentabancaria
                },
                callback: onResponse
            });

            function onResponse(options, success, response) {
                view.btnAddOperacion.enable();
                view.btnDifBanco.enable();
                cargarOper(record.data.idcuentabancaria);

                view.tfsaldofin.setValue('0.00');
                view.tfdebito.setValue('0.00');
                view.tfcredito.setValue('0.00');
                var r = Ext.decode(response.responseText);
                if (r.datos) {
                    view.dfEstadoCta.reset();
                    if (r.datos.fechaminima)
                        view.dfEstadoCta.setMinValue(r.datos.fechaminima);

//                    view.tfnumero.setValue(r.datos.nroestado);
//                    if (r.datos.nroestado == 1)
//                        view.tfnumero.enable();
//                    else
//                        view.tfnumero.disable();
                    view.tfsaldoini.setRawValue(formatoMoneda(r.datos.saldoincial));
                    view.tfdifdebito.setValue(formatoMonedaABS(r.datos.diferenDebito));  // Diferencias con el banco
                    view.tfdifcredito.setValue(formatoMonedaABS(r.datos.diferenCredito)); // Diferencias con el banco
                    controller.saldoini = r.datos.saldoincial;
                    controller.calcularSaldoFinal();
                }
                controller.sobregiro = r.sobregiro;
//                view.dfEstadoCta.focus();// darle foco  a fecha
                view.tfnumero.focus(true, true);
                loadMask.hide();

                this.cargarDepositos(false, view.actionbtn);
            }

            //si existen datos para la cta se cargan
            function cargarOper(idcta) {
                model.stOperaciones.removeAll();
                if (controller.arrayOperCtaB.length > 0) {
                    pos = controller.buscarOperIDctaB(idcta);
                    if (pos != -1) {
                        model.stOperaciones.loadData({
                            datos: controller.arrayOperCtaB[pos][1]
                        });
                    }
                }
            }
        };

        //busca si la cta ya tenia datos asociados
        this.buscarOperIDctaB = function (idcta) {
            var pos = -1;
            for (var i = 0; i < controller.arrayOperCtaB.length; i++) {
                if (controller.arrayOperCtaB[i][0] == idcta) {
                    return i;
                }
            }
            return pos;
        };

        //calcula el saldo final de la bancaria
        this.calcularSaldoFinal = function (arrinstradd) {

            if (view.actionbtn == 'add') {//cuando se adiciona un estado de cuenta
                var operDeb = 0;//se suma
                var operCred = 0;//se resta

                if (controller.arrayOperCtaB.length > 0) {//se calcula el importe de las operaciones
                    var pos = controller.buscarOperIDctaB(view.cbCuentaBanc.getValue());
                    if (pos != -1) {
                        for (var i = 0; i < controller.arrayOperCtaB[pos][1].length; i++) {
                            rec = controller.arrayOperCtaB[pos][1][i]; //se obtiene el record a analizar
                            if (rec.credito != '' || rec.credito) {
                                operCred += parseFloat(rec.credito);
                            } else {
                                operDeb += parseFloat(rec.debito);
                            }
                        }
                    }
                }

                var debeCorrec = 0;//se resta  | correccion por el debito
                var credCorrec = 0;//se suma   | correccion por el credito
                var debInsert = 0; //se suma  | diferencia por el debito
                var credInsert = 0;//se resta | diferencia por el credito
                var debInsertnew = 0; //se suma  | diferencia por el debito
                var credInsertnew = 0;//se resta | diferencia por el credito

                //se calcula el importe de las diferencias de la correccion
                if (controller.arrayDifCtaB.length > 0) {

                    //se busca si ya estaba
                    var pos = controller.buscarIDctaB(view.cbCuentaBanc.getValue());
                    //esta
                    if (pos != -1) {
                        for (var i = 0; i < controller.arrayDifCtaB[pos][1].length; i++) {

                            rec = controller.arrayDifCtaB[pos][1][i];

                            //debito
                            if (rec.debitocredito == true || rec.debitocredito == 1) {

                                if (rec.nuevo)
                                    debInsertnew += parseFloat(rec.debito);
                                else if (rec.correccion && rec.correccion != 0) {
                                    debeCorrec += parseFloat(rec.correccion);
                                    debInsert += parseFloat(rec.debito) + parseFloat(rec.correccion);

                                } else {
                                    debInsert += parseFloat(rec.debito);
                                }
                            } else {
                                if (rec.nuevo)
                                    credInsertnew += parseFloat(rec.credito);

                                else if (rec.correccion != 0) {
                                    credCorrec += parseFloat(rec.correccion);
                                    credInsert += parseFloat(rec.credito) + parseFloat(rec.correccion);


                                } else
                                    credInsert += parseFloat(rec.credito);

                            }
                        }

                        view.tfdifdebito.setRawValue(formatoMonedaABS(parseFloat(debInsertnew) + parseFloat(debInsert) - parseFloat(debeCorrec)));
                        view.tfdifcredito.setRawValue(formatoMonedaABS(parseFloat(credCorrec) - parseFloat(credInsertnew) - parseFloat(credInsert)));
                    }
                }

                //Registrar diferencia      Correccion
                //Debe(+)			Debe(-)
                //Haber(-)			Haber(+)
                // var correcDif = parseFloat(controller.saldoini) + parseFloat(operDeb) - parseFloat(operCred) - parseFloat(debeCorrec) + parseFloat(credCorrec) + parseFloat(debInsert) - parseFloat(credInsert);
                //caso adicionar
                if (view.actionbtn == 'add')
                    correcDif = parseFloat(controller.saldoini) + parseFloat(operDeb) - parseFloat(operCred) - parseFloat(debeCorrec) + parseFloat(credCorrec) + parseFloat(debInsertnew) - parseFloat(credInsertnew);
                else {
                    //caso modificar el modificar no funciona
                    correcDif = parseFloat(controller.saldofinmod) + parseFloat(operDeb) - parseFloat(operCred) - parseFloat(debeCorrec) + parseFloat(credCorrec) + parseFloat(debInsertnew) - parseFloat(credInsertnew);
                }

                //Comentariado porque cuando los debitos menos los creditos daban 0 ponia el saldo inicial
                /*if (parseFloat(correcDif) == 0) {
                   correcDif = parseFloat(controller.saldoini);
               }*/

                //Esta parte es valida para el adicionar y no para el modificar
                //pues en el adicionar correcDif se calcula en base a controller.saldoini
                //y en el modificar se calcula en base a controller.saldofinmod
                //Este controller.saldofinmod si se actualiza bien y en el modificar no hay problema
                //con los depósitos, el problema esta en el adicionar, por lo tanto las siguientes líneas de código
                var importeDepositosSeleccionados = controller.importeTotalDepSelected();
                correcDif += importeDepositosSeleccionados;

                view.tfsaldofin.setRawValue(formatoMoneda(parseFloat(correcDif)));
                controller.saldofin = parseFloat(correcDif);
                //se calculan los saldos
                view.tfdebito.setRawValue(formatoMonedaABS(parseFloat(operDeb)));
                view.tfcredito.setRawValue(formatoMonedaABS(parseFloat(operCred)));

                return parseFloat(correcDif);
            } else {//cuando se modifica un estado de cuenta

                var operDeb = 0;//se suma
                var operCred = 0;//se resta
                //se calcula el importe de las operaciones
                //esto es para actualizar los text fields de débito y crédito
                if (controller.arrayOperCtaB.length > 0) {
                    pos = controller.buscarOperIDctaB(view.cbCuentaBanc.getValue());
                    if (pos != -1) {
                        for (i = 0; i < controller.arrayOperCtaB[pos][1].length; i++) {
                            rec = controller.arrayOperCtaB[pos][1][i]; //se obtiene el record a analizar
                            if (rec.credito != '' || rec.credito) {
                                operCred += parseFloat(rec.credito);
                            } else {
                                operDeb += parseFloat(rec.debito);
                            }
                        }
                    }
                }

                var operDeb1 = 0;//se suma
                var operCred1 = 0;//se resta
                //se calcula el importe de las operaciones que se van insertando en el modificar
                //esto es para actualizar el importe final
                if (arrinstradd && arrinstradd.length > 0) {
                    for (var i = 0, long = arrinstradd.length; i < long; i++) {
                        if (arrinstradd[i].credito != '' || arrinstradd[i].credito) {
                            operCred1 += parseFloat(arrinstradd[i].credito);
                        } else {
                            operDeb1 += parseFloat(arrinstradd[i].debito);
                        }
                    }
                }

                var debeCorrec = 0;//se resta  | correccion por el debito
                var credCorrec = 0;//se suma   | correccion por el credito
                var debInsert = 0; //se suma  | diferencia por el debito
                var credInsert = 0;//se resta | diferencia por el credito
                var debInsertnew = 0; //se suma  | diferencia por el debito
                var credInsertnew = 0;//se resta | diferencia por el credito

                var difgeneraldeb = 0;
                var difgeneralcred = 0;
                var difgeneral = 0;

                //se calcula el importe de las diferencias de la correccion
                if (controller.arrayDifCtaB.length > 0) {
                    //se busca si ya estaba
                    pos = controller.buscarIDctaB(view.cbCuentaBanc.getValue());
                    if (pos != -1) {//esta
                        for (i = 0; i < controller.arrayDifCtaB[pos][1].length; i++) {
                            rec = controller.arrayDifCtaB[pos][1][i];
                            if (rec.debitocredito == true || rec.debitocredito == 1) {//debito

                                if (rec.nuevo) {
                                    debInsertnew += parseFloat(rec.debito);
                                } else if (rec.correccion && rec.correccion != 0) {
                                    debeCorrec += parseFloat(rec.correccion);
                                    debInsert += parseFloat(rec.debito) + parseFloat(rec.correccion);
                                } else {
                                    debInsert += parseFloat(rec.debito);
                                }
                            } else {
                                if (rec.nuevo) {
                                    credInsertnew += parseFloat(rec.credito);
                                } else if (rec.correccion != 0) {
                                    credCorrec += parseFloat(rec.correccion);
                                    credInsert += parseFloat(rec.credito) + parseFloat(rec.correccion);
                                } else {
                                    credInsert += parseFloat(rec.credito);
                                }

                            }
                        }

                        difgeneraldeb = parseFloat(debInsertnew) + parseFloat(debInsert) - parseFloat(debeCorrec);
                        difgeneralcred = parseFloat(credCorrec) - parseFloat(credInsertnew) - parseFloat(credInsert);
                        difgeneral = parseFloat(difgeneraldeb) + parseFloat(difgeneralcred);

                        difgeneral = difgeneral - parseFloat(cleanComa(view.tfdifdebito.getValue())) + parseFloat(cleanComa(view.tfdifcredito.getValue()));
                        view.tfdifdebito.setRawValue(formatoMonedaABS(difgeneraldeb));
                        view.tfdifcredito.setRawValue(formatoMonedaABS(difgeneralcred));
                    }
                }

                //Registrar diferencia      Correccion
                //Debe(+)			Debe(-)
                //Haber(-)			Haber(+)
                correcDif = parseFloat(controller.saldofinmod) + parseFloat(operDeb1) - parseFloat(operCred1) + difgeneral;

                //Comentariado porque cuando los debitos menos los creditos daban 0 ponia el saldo inicial
                /*if (parseFloat(correcDif) == 0) {
                    //correcDif = parseFloat(controller.saldoini);
                    correcDif = parseFloat(controller.saldofinmod);
                }*/

                view.tfsaldofin.setRawValue(formatoMoneda(parseFloat(correcDif)));
                controller.saldofin = parseFloat(correcDif);
                controller.saldofinmod = parseFloat(correcDif);
                //se calculan los saldos
                view.tfdebito.setRawValue(formatoMonedaABS(parseFloat(operDeb)));
                view.tfcredito.setRawValue(formatoMonedaABS(parseFloat(operCred)));

                return parseFloat(correcDif);
            }
        };

        //busca las operaciones en transito dada la cta
        this.cargarOperaciones = function () {
            if (view.dfEstadoCta.isValid() && view.cbCuentaBanc.isValid()) {
                //controller.loadMensaje(idioma.msgLoad);
                view.winOperaciones.show();
                model.staddoper.load({
                    params: {
                        start: 0,
                        limit: 20,
                        idestadodecuenta: (view.gpEstadocuenta.getSelectionModel().getSelected() && view.actionbtn == 'mod') ? view.gpEstadocuenta.getSelectionModel().getSelected().data.idestadodecuenta : 0
                    },
                    callback: function () {
                        if (model.staddoper.getCount() == 0) {
                            mostrarMensaje(1, idioma.msgCtaNoOperaciones);
                        } else {
                            //view.winOperaciones.show();
                            //view.gpaddoper.getSelectionModel().selectFirstRow();
                            view.btnApliOper.setDisabled(true);
                            view.btnAcepOper.setDisabled(true);
                        }
                        view.btnCancOper.focus();
                        //loadMask.hide();
                    }
                });
            } else {
                mostrarMensaje(1, idioma.msgModDataIncorrect);
                if (!view.dfEstadoCta.isValid()) {
                    view.dfEstadoCta.focus(false, 100);
                } else {
                    view.cbCuentaBanc.focus(true, true);
                }
            }
        };

        //adiciona las operaciones en transito
        this.addOperTransito = function (action) {
            instance = new PagingToolbarSelections({
                'selections': view.gpaddoper.getSelectionModel().getSelections(),
                'activePage': view.gpaddoper.getBottomToolbar().getPageData().activePage
            });

            //almacena los elementos seleccionados
            arregloselect = instance.getSelectionsOnArray(view.arrayValues);

            //Verificar que la suma entre los créditos y los débitos no sean mayor que el saldo final
            //que queda en el estado de cuenta, pues quedaría negativo este saldo.
            var saldofinEC = parseFloat(cleanComa(view.tfsaldofin.getRawValue()));
            var saldocreditoTemp = 0;
            var saldodebitoTemp = 0;
            arregloselect.forEach(function (item, index) {
                saldocreditoTemp += (item.credito) ? item.credito : 0;
                saldodebitoTemp += (item.debito) ? item.debito : 0;
            });

            if (!controller.sobregiro) {//Si no permite sobregiro
                var saldoCredBeb = parseFloat(saldodebitoTemp - saldocreditoTemp).toFixed(2);
                if (parseFloat(saldofinEC) + parseFloat(saldoCredBeb) < 0) {
                    var textSaldoEC = ' <b>Saldo actual:</b> ' + formatoMoneda(saldofinEC) + '<br>';
                    var textSaldoCredDeb = ' <b>Saldo operaciones (d&eacute;bito - cr&eacute;dito):</b> ' + formatoMoneda(saldoCredBeb) + '<br>';
                    var textSaldoFinal = ' <b>Saldo final:</b> ' + formatoMoneda(parseFloat(saldofinEC) + parseFloat(saldoCredBeb)) + '<br>';
                    /*var msgManyTemp = 'El saldo de las operaciones que desea adicionar es superior al saldo final.<br><br>' + textSaldoEC + textSaldoCredDeb;
                    var msgOneTemp = 'El saldo de la operaci&oacute;n que desea adicionar es superior al saldo final.<br><br>' + textSaldoEC + textSaldoCredDeb;*/
                    var msgManyTemp = 'El saldo final de las operaciones que desea adicionar no puede ser negativo.<br><br>' + textSaldoEC + textSaldoCredDeb + textSaldoFinal;
                    var msgOneTemp = 'El saldo final de la operaci&oacute;n que desea adicionar no puede ser negativo.<br><br>' + textSaldoEC + textSaldoCredDeb + textSaldoFinal;
                    var msgTemp = (arregloselect.length > 1) ? msgManyTemp : msgOneTemp;
                    mostrarMensaje(1, msgTemp);
                    return;
                }
            }

            //se crean los recods a adicionar
            recordT = Ext.data.Record.create([{
                name: 'idinstrumentobancario'
            }, {
                name: 'nodocumento'
            }, {
                name: 'tipoinstrumento'
            }, {
                name: 'credito'
            }, {
                name: 'debito'
            }, {
                name: 'importemb'
            }, {
                name: 'fecha'
            }, {
                name: 'origen'
            }, {
                name: 'descripcion'
            }]);

            //var arrfechas = new Array();
            for (var i = 0; i < arregloselect.length; i++) {
                //se crea el record a adicionar
                newrT = new recordT({
                    idinstrumentobancario: arregloselect[i].idinstrumentobancario,
                    nodocumento: arregloselect[i].nodocumento,
                    tipoinstrumento: arregloselect[i].tipoinstrumento,
                    credito: arregloselect[i].credito,
                    debito: arregloselect[i].debito,
                    importemb: arregloselect[i].importemb,
                    fecha: arregloselect[i].fecha,
                    origen: arregloselect[i].origen,
                    descripcion: arregloselect[i].descripcion
                });
                //se adiciona el record al grid de las operaciones afectadas
                model.stOperaciones.add(newrT);

                //arrfechas.push(arregloselect[i].fecha);
            }

            /*var arropercarg = model.stOperaciones.getRange();
             var cantopercarg = arropercarg.length;
             for (var i = 0; i < cantopercarg; i++) {
             arrfechas.push(arropercarg[i].data.fecha);
             }

             controller.definirFechaEC(arrfechas);*/
            controller.enableDisableFechaEC();

            controller.guardarOper();
            //el parámetro arregloselect se usa cuando se va a modificar
            controller.calcularSaldoFinal(arregloselect);//se calcula el saldo final

            if (action != 'apli') {
                view.winOperaciones.hide();
            } else {//si es aplicar se recarga el grid
                controller.cargarOperaciones();
                model.staddoper.removeAll();//se limpia el store de las operaciones en transito
                view.gpaddoper.getSelectionModel().clearSelections();//se limpia el sm de las operaciones en transito
            }
            view.arrayValues = new Array();

            var msgOne = 'La operaci&oacute;n ha sido adicionada satisfactoriamente.';
            var msgMany = 'Las operaciones han sido adicionadas satisfactoriamente.';
            var msgsuccess = (arregloselect.length > 1) ? msgMany : msgOne;
            mostrarMensaje(1, msgsuccess);
        };

        //elimina las operaciones en transito
        this.delOperTransito = function () {
            mostrarMensaje(2, '¿Est&aacute; seguro que quiere eliminar la operaci&oacute;n seleccionada?', function (btn) {
                if (btn == 'ok') {
                    if (view.gpOperaciones.getSelectionModel().getCount() > 0) {
                        controller.saldofinmod = parseFloat(controller.saldofinmod);
                        var records = view.gpOperaciones.getSelectionModel().getSelections();
                        for (var i = 0; i < records.length; i++) {
                            if (view.actionbtn == 'mod') {//caso modificar
                                if (records[i].data.credito != '' || records[i].data.credito) {
                                    controller.saldofinmod += parseFloat(records[i].data.credito);
                                } else {
                                    controller.saldofinmod -= parseFloat(records[i].data.debito);
                                }
                            }
                            model.stOperaciones.remove(records[i]);
                        }

                        mostrarMensaje(1, 'La operaci&oacute;n ha sido eliminada satisfactoriamente.');
                    }
                    view.btnDelOperacion.disable();
                    controller.guardarOper();
                    controller.calcularSaldoFinal();//se calcula el saldo final
                    view.gpOperaciones.getSelectionModel().clearSelections();//se limpia el sm de las operaciones

                    //Esto es para cuando elimine estos instrumentos se actualice el campo fecha
                    //del estado de cuenta
                    /*var arrnodel = model.stOperaciones.getRange();
                     var cantnodel = arrnodel.length;
                     var arrfechas = new Array();

                     for (var i = 0; i < cantnodel; i++) {
                     arrfechas.push(arrnodel[i].data.fecha);
                     }
                     controller.definirFechaEC(arrfechas);*/
                    controller.enableDisableFechaEC();
                }
            });
        };

        //adiciona la fila al grid de las diferencias
        this.crearFila = function () {
            // var cr = (view.rbtncredito.checked) ? parseFloat(controller.limpiarComa(view.tfdebcred.getValue())) : "";
            // var db = (view.rbtndebito.checked) ? parseFloat(controller.limpiarComa(view.tfdebcred.getValue())) : "";
            var cr = (view.rbtncredito.checked) ? view.tfdebcred.getValue() : "";
            var db = (view.rbtndebito.checked) ? view.tfdebcred.getValue() : "";
            var saldofinEC = parseFloat(cleanComa(view.tfsaldofin.getValue()));

            var diferenciasReg = model.stDiferencias.getRange();
            var creditoaux = 0.00;
            var debitoaux = 0.00;
            diferenciasReg.forEach(function (item, index, allItems) {
                if (item.debitocredito != true && item.data.credito) {
                    creditoaux += Math.abs(parseFloat(item.data.credito));
                }
                if (item.debitocredito == true && item.data.debito) {
                    debitoaux += Math.abs(parseFloat(item.data.debito));
                }
            });

            var aux = (debitoaux + parseFloat(db + 0)) - (creditoaux + parseFloat(cr + 0));
            if (saldofinEC + aux < 0) {
                mostrarMensaje(1, idioma.msgECmenor);
            } else {
                var record = Ext.data.Record.create([{
                    name: 'iddiferencia',
                    type: 'float'
                }, {
                    name: 'debito',
                    type: 'string'
                }, {
                    name: 'importe',
                    renderer: formatoMonedaABS
                }, {
                    name: 'credito'
                }, {
                    name: 'descripcion',
                    type: 'string'
                }, {
                    name: 'nuevo'
                }, {
                    name: 'gruopfield'
                }]);

                var id = buscarMayor(model.stDiferencias);
                newRecord = new record({
                    iddiferencia: parseFloat(id) + 1,
                    descripcion: view.tacoment.getValue(),
                    debito: db,
                    credito: cr,
                    debitocredito: view.rbtndebito.checked,
                    nuevo: true, //para saber que esta es una diferencia nueva o  propia del  estado que estoy  creando
                    //gruopfield:'Diferencias'
                    gruopfield: idioma.lbDiferencias
                });

                model.stDiferencias.add(newRecord);
                view.gpDiferencias.getSelectionModel().selectLastRow();
                view.fpdifbanco.getForm().reset();
                view.tfdebcred.focus(false, 100);

                //devuelve el mayor id de las diferencias
                function buscarMayor(st) {
                    if (st.getCount() > 0) {//si tiene datos
                        var mayor = st.getAt(0).data.iddiferencia;
                        for (var i = st.getCount() - 1; i > 0; i--) {
                            if (mayor <= st.getAt(i).data.iddiferencia) {
                                mayor = st.getAt(i).data.iddiferencia;
                            }
                        }
                    } else {
                        mayor = 0;
                    }
                    return mayor;
                }

                //Desactivar el boton de adicionar diferencia
                view.btnAddDif.setDisabled(true);
            }
        };

        //quita las 'coma' de una cadena
        this.limpiarComa = function (s) {
            return s = s.replace(/\,/g, '');
        };

        //permite eliminar la fila seleccionada en el  grid de diferencias
        this.eliminarfiladif = function () {
            if (view.gpDiferencias.getSelectionModel().getSelected()) {
                var index = model.stDiferencias.find('iddiferencia', view.gpDiferencias.getSelectionModel().getSelected().data.iddiferencia);
                model.stDiferencias.remove(model.stDiferencias.getAt(index));

                mostrarMensaje(1, idioma.msgDelDifSuccess);

                if (model.stDiferencias.getCount() > 0) {
                    view.gpDiferencias.getSelectionModel().selectFirstRow();
                } else {
                    view.btnDelDif.setDisabled(true);
                }
            }
        };

        //devolver un string con los valores del grid diferencias concatenados
        this.stringValuesDiferencias = function () {
            var data = model.stDiferencias.getRange();
            var arraux = [];

            if (data.length > 0) {
                data.forEach(function (item, index, allItems) {
                    arraux.push(item.data);
                });
            }

            return Ext.encode(arraux);
        };

        //carga las diferencias de un estado de cta
        this.loadDataDiferencias = function () {
            controller.loadMensaje(idioma.msgLoad);
            model.stDiferencias.removeAll();

            if (controller.arrayDifCtaB.length > 0) {
                pos = controller.buscarIDctaB(view.cbCuentaBanc.getValue());
                if (pos != -1) {
                    model.stDiferencias.loadData({
                        datos: controller.arrayDifCtaB[pos][1]
                    });

                    controller.stringDifBeforeOpenWindow = controller.stringValuesDiferencias();
                    loadMask.hide();
                } else {
                    model.stDiferencias.load({
                        params: {
                            idcuenta: view.cbCuentaBanc.getValue()
                        },
                        callback: function () {
                            controller.stringDifBeforeOpenWindow = controller.stringValuesDiferencias();
                            loadMask.hide();
                        }
                    });
                }
            } else {
                model.stDiferencias.load({
                    params: {
                        idcuenta: view.cbCuentaBanc.getValue()
                    },
                    callback: function () {
                        controller.stringDifBeforeOpenWindow = controller.stringValuesDiferencias();
                        loadMask.hide();
                    }
                });
            }

        };

        //Registrar diferencia      Correccion
        //Debe(+)		    Debe(-)
        //Haber(-)		    Haber(+)

        // actualiza el  valor de una diferencia corregida en la ventana adicionar diferencia
        this.ActualizarDiferencia = function (val) {
            var records = view.gpDiferencias.getSelectionModel().getSelections();
            if (val) {//correccion
                if (records[0].data.debitocredito) {//debe
                    records[0].set('debito', parseFloat(controller.limpiarComa(view.tfimportedif.getValue())) - parseFloat(val));
                } else {//haber
                    records[0].set('credito', parseFloat(controller.limpiarComa(view.tfimportedif.getValue())) - parseFloat(val));
                }
                mostrarMensaje(1, idioma.msgCorreccionSaveSucc);
            } else {//diferencia
                if (records[0].data.debitocredito) {//debe
                    records[0].set('debito', parseFloat(controller.limpiarComa(view.tfimportedif.getValue())));
                } else {//haber
                    records[0].set('credito', parseFloat(controller.limpiarComa(view.tfimportedif.getValue())));
                }
            }
            records[0].set('correccion', val);
        };

        //almacena las diferencias o correcciones registradas
        this.saveDiferencias = function () {
            if (model.stDiferencias.getCount() > 0) {
                var arrayDiferencia = new Array();
                controller.arrayDiferenciaPlus = new Array();

                for (i = 0; i < model.stDiferencias.getCount(); i++) {
                    arrayDiferencia.push(model.stDiferencias.getAt(i).data);
                    controller.arrayDiferenciaPlus.push(model.stDiferencias.getAt(i).data);
                }

                var record = new Array();
                record.push(view.cbCuentaBanc.getValue());
                record.push(arrayDiferencia);

                if (controller.arrayDifCtaB.length == 0) {
                    controller.arrayDifCtaB.push(record);
                } else {
                    pos = controller.buscarIDctaB(view.cbCuentaBanc.getValue());
                    if (pos != -1) {
                        controller.arrayDifCtaB[pos][1] = arrayDiferencia;
                    } else {
                        controller.arrayDifCtaB.push(record);
                    }
                }
                controller.calcularSaldoFinal();

                if (model.stDiferencias.getCount() == 1) {
                    mostrarMensaje(1, idioma.msgDifSaveSuccessOne);
                } else if (model.stDiferencias.getCount() > 1) {
                    mostrarMensaje(1, idioma.msgDifSaveSuccessMany);
                }
            } else {
                controller.arrayDifCtaB = new Array();
                view.tfdifdebito.setRawValue(formatoMonedaABS(0));
                view.tfdifcredito.setRawValue(formatoMonedaABS(0));

                if (controller.arrayDiferenciaPlus.length > 0) {
                    //Si no esta vacío es porque se eliminaron los datos y no se tuvieron en cuenta
                    //debito - debitocredito: true, credito - debitocredito: false

                    var saldofin = parseFloat(cleanComa(view.tfsaldofin.getValue()));
                    controller.arrayDiferenciaPlus.forEach(function (item, index, allItems) {
                        if (item.debitocredito == true) {
                            saldofin -= Math.abs(item.debito);
                        } else {
                            saldofin += Math.abs(item.credito);
                        }
                    });
                    view.tfsaldofin.setValue(formatoMonedaABS(saldofin));

                    controller.saldofin = saldofin;
                    controller.saldofinmod = saldofin;
                }

                controller.arrayDiferenciaPlus = new Array();


                mostrarMensaje(1, idioma.msgDifUpdateCeroSuccess);
            }
        };

        //busca si la cta ya fue procesada
        this.buscarIDctaB = function (id) {
            pos = -1;
            for (i = 0; i < controller.arrayDifCtaB.length; i++) {
                if (controller.arrayDifCtaB[i][0] == id) {
                    return i;
                }
            }
            return pos;
        };

        //guarda las operaciones cargadas en el  arreglo arrayOperCtaB
        this.guardarOper = function () {
            if (model.stOperaciones.getCount() > 0) {
                var arrayOper = new Array();

                for (i = 0; i < model.stOperaciones.getCount(); i++) {
                    arrayOper.push(model.stOperaciones.getAt(i).data);
                }

                var record = new Array();
                record.push(view.cbCuentaBanc.getValue());
                record.push(arrayOper);

                if (controller.arrayOperCtaB.length == 0) {
                    controller.arrayOperCtaB.push(record);
                } else {
                    pos = controller.buscarOperIDctaB(view.cbCuentaBanc.getValue());
                    if (pos != -1) {
                        controller.arrayOperCtaB[pos][1] = arrayOper;
                    } else {
                        controller.arrayOperCtaB.push(record);
                    }
                }
            } else {//caso en que se eliminaron todas
                pos = controller.buscarOperIDctaB(view.cbCuentaBanc.getValue());
                if (pos != -1) {
                    record = controller.arrayOperCtaB[pos];
                    controller.arrayOperCtaB.remove(record);
                }
            }
        };

        //Función necesaria para saber si los campos que varían cambiaron o no
        this.formChanges = function () {

            //Si la fecha cambió
            var fechaChanges = (controller.fechaOld != view.dfEstadoCta.getRawValue()) ? true : false;

            //Si el saldo final cambió
            var saldofinalChanges = (controller.saldofinalOld != view.tfsaldofin.getValue()) ? true : false;

            //Si el débito del instrumento cambió
            var debinstChanges = (controller.debinstOld != view.tfdebito.getValue()) ? true : false;

            //Si el crédito del instrumento cambió
            var creinstChanges = (controller.creinstOld != view.tfcredito.getValue()) ? true : false;

            //Si el crédito de la diferencia cambió
            var credifChanges = (controller.credifOld != view.tfdifcredito.getValue()) ? true : false;

            //Si el débito de la diferencia cambió
            var debdifChanges = (controller.debdifOld != view.tfdifdebito.getValue()) ? true : false;

            //Si el importe de los depósitos seleccionados cambió
            var importeDeposChanges = (controller.importeDeposOld != view.tfimportedepositos.getValue()) ? true : false;

            //Si el numero del estado de cuenta cambió
            var noestadocuentaChanges = (controller.noestacuentaOld != view.tfnumero.getValue()) ? true : false;

            return (fechaChanges || saldofinalChanges || debinstChanges || creinstChanges || credifChanges || debdifChanges || importeDeposChanges || noestadocuentaChanges);
        };

        //adiciona el estado de cta
        this.adicionarEstadoCta = function (aceptar) {
            //si el panel es valido
            if (view.fpEstadoCta.getForm().isValid()) {
                //Para insertar en la tabla que relaciona los instrumentos con el estado de cuenta
                var InstrumentosSel = new Array();
                for (var i = 0; i < model.stOperaciones.getCount(); i++) {
                    var rec = model.stOperaciones.getAt(i);
                    var importemo = 0;
                    importemo = (rec.data.debito > 0) ? rec.data.debito : (-1 * rec.data.credito);
                    var temmp = {
                        'idinstrumento': rec.data.idinstrumentobancario,
                        'origen': rec.data.origen,
                        'importemo': importemo,
                        'importemb': rec.data.importemb
                    };
                    InstrumentosSel.push(temmp);
                }
                //Para insertar las diferencias insertadas en el estado de cuentas y relacionarlas
                var Result = new Array();
                pos = controller.buscarIDctaB(view.cbCuentaBanc.getValue());
                if (pos != -1) {
                    model.stDiferencias.loadData({
                        datos: controller.arrayDifCtaB[pos][1]
                    });

                    for (i = 0; i < model.stDiferencias.getCount(); i++) {
                        var recTemp = model.stDiferencias.getAt(i);
                        if (recTemp.data.nuevo == true) {
                            var Temp = new Array();
                            Temp[0] = recTemp.data.descripcion;
                            Temp[1] = recTemp.data.debito;
                            Temp[2] = recTemp.data.credito;
                            Result.push(Temp);
                        }
                    }
                }
                //Para insertar las correcciones en el estado de cuentas y relacionarlas
                var ArrayCorreciones = new Array();
                var pos = controller.buscarIDctaB(view.cbCuentaBanc.getValue());
                if (pos != -1) {
                    model.stDiferencias.loadData({
                        datos: controller.arrayDifCtaB[pos][1]
                    });

                    for (i = 0; i < model.stDiferencias.getCount(); i++) {
                        var auxdif = model.stDiferencias.getAt(i);
                        if (auxdif.data.correccion) {
                            var ObjetoCorrec = new Array();
                            ObjetoCorrec[1] = auxdif.data.correccion;
                            ObjetoCorrec[0] = auxdif.data.iddiferencia;
                            ArrayCorreciones.push(ObjetoCorrec);
                        }
                    }
                }

                //Depósitos seleccionados
                var deposSelected = view.smDepositos.getSelections();
                var cantDeposSelected = deposSelected.length;

                //se manda a adicionar el estado de cta
                if (model.stOperaciones.getCount() != 0 || Result.length != 0 || ArrayCorreciones.length != 0 || cantDeposSelected > 0) {
                    //Estado de cuenta
                    var datestado = {
                        'numero': view.tfnumero.getValue(),
                        'diferenciacredito': parseFloat(view.tfdifcredito.getValue()),
                        'credito': parseFloat(view.tfcredito.getValue()),
                        'debito': parseFloat(view.tfdebito.getValue()),
                        'diferencia': parseFloat(view.tfdifdebito.getValue()),
                        'fecha': view.dfEstadoCta.getRawValue()
                    };

                    var index = model.stCuentaBanc.find('idcuentabancaria', view.cbCuentaBanc.getValue());
                    var idmoneda = model.stCuentaBanc.getAt(index).data.idmoneda;

                    //Cargando los datos de los depósitos para mandarlos por parámatros
                    var arrayDepositos = new Array();
                    for (var i = 0; i < cantDeposSelected; i++) {
                        arrayDepositos.push({
                            iddeposito: deposSelected[i].data.iddeposito,
                            importe: deposSelected[i].data.importe
                        });
                    }

                    if (view.actionbtn == 'add') {
                        controller.progressMessageBox(idioma.msgGuardando);
                        uri = 'addestadocta';
                        msg = idioma.msgAdd;
                        idEstEnviar = 0;
                    } else {
                        //Si no hubo cambios en el formulario cuando se modifica y se acepta
                        if (!controller.formChanges() && aceptar == 'acept') {
                            mostrarMensaje(1, idioma.msgNoChanges);
                            return;
                        }

                        controller.progressMessageBox(idioma.msgGuardando);
                        uri = 'modEstadoCta';
                        msg = idioma.msgModificado;
                        idEstEnviar = view.gpEstadocuenta.getSelectionModel().getSelected().data.idestadodecuenta;
                    }

                    Ext.Ajax.request({
                        url: uri,
                        method: 'POST',
                        params: {
                            idestado: idEstEnviar,
                            idcuentabancaria: view.cbCuentaBanc.getValue(),
                            arrayinstrumentos: Ext.encode(InstrumentosSel),
                            arraydiferencias: Ext.encode(Result),
                            ArrCorreciones: Ext.encode(ArrayCorreciones),
                            idmoneda: idmoneda,
                            estadocta: Ext.encode(datestado),
                            tfsaldofin: (view.actionbtn == 'add') ? parseFloat(controller.saldofin) : parseFloat(controller.saldofinmod),
                            tfsaldoini: parseFloat(controller.saldoini),
                            arrayDepositos: Ext.encode(arrayDepositos)
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            Ext.MessageBox.hide();
                            //en caso que adicione satisfactoriamente
                            if (responseData.n_codMsg == 1) {
                                mostrarMensaje(responseData.n_codMsg, msg);

                                view.cbCuentaBanc.focus(false, 100);
                                model.stEstadocuenta.reload();
                                view.dfEstadoCta.setMinValue(view.finicio);
                                view.dfEstadoCta.setMaxValue(view.ffin);
                                //view.tfnumero.disable();
                                controller.arrayDifCtaB = new Array();
                                controller.arrayOperCtaB = new Array();

                                if (aceptar == 'acept' || view.actionbtn == 'mod') {//caso aceptar
                                    view.winEstadocta.hide();
                                } else {//caso aplicar
                                    view.fpEstadoCta.getForm().reset();
                                    model.stOperaciones.removeAll();
                                    view.btnAddOperacion.disable();
                                    view.btnDelOperacion.disable();
                                    view.btnDifBanco.disable();
                                    model.stDepositos.removeAll();
                                }
                            } else if (responseData.n_codMsg == 7) {
                                // mostrarMensaje(1, idioma.msgYaexisteFechaEstAdd);
                                mostrarMensaje(1, "No puedes adicionar un estado de cuenta con fecha anterior o igual a " + responseData.fecha);
                                view.dfEstadoCta.focus();
                            } else if (responseData.n_codMsg == 8) {
                                mostrarMensaje(1, idioma.msgYaexisteNoEstMod);
                            } else {// caso  en que  da error
                                mostrarMensaje(3, idioma.msgErrorGuardando);
                            }
                        }
                    });
                } else {
                    mostrarMensaje(1, idioma.msgModNoDifCorrecc);
                }
            } else {
                mostrarMensaje(1, idioma.msgModDataIncorrect);
            }
        };

        //elimina el estado de cta
        this.eliminarEstadoCta = function () {
            view.windowopen = true;
            mostrarMensaje(2, idioma.msgDelQuestion, elimina);

            function elimina(btnPresionado) {
                if (btnPresionado == 'ok') {
                    controller.progressMessageBox(idioma.msgDel);
                    Ext.Ajax.request({
                        url: 'eliminarEstadoCta',
                        method: 'POST',
                        params: {
                            idestado: view.gpEstadocuenta.getSelectionModel().getSelected().data.idestadodecuenta
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            Ext.MessageBox.hide();
                            switch (responseData.n_codMsg) {
                                case 1:
                                    mostrarMensaje(1, idioma.msgDelSuccess);
                                    model.stEstadocuenta.reload();

                                    model.stOperCargadas.removeAll();
                                    model.stCorrecBanco.removeAll();
                                    model.stTabDepositos.removeAll();
                                    view.pOperaciones.collapse();
                                    break;
                                case 2:
                                    mostrarMensaje(1, idioma.msgNoDelConcAsociadas);
                                    break;
                                case 3:
                                    mostrarMensaje(1, idioma.msgNoDelEstadoCta);
                                    break;
                                case 4:
                                    mostrarMensaje(1, idioma.msgDelUltimoEstadoCta);
                                    break;
                                default:
                                    mostrarMensaje(3, idioma.msgErrorEliminando);
                                    break;
                            }
                            view.windowopen = false;
                        }
                    });
                } else {
                    view.windowopen = false;
                }
            }
        };

        //abre la ventana para gestionar las conciliaciones
        //esto se debe mejorar, hay que quitar el IFRAME
        this.openConciliaciones = function () {
//            url = "/contabilidad/banco/estadocuenta/index.php/conciliacionbancaria/conciliacionbancaria";
            url = "/contabilidad/banco/estadocuenta/index.php/conciliacionbancaria/conciliacionbancariaEC";
            var winIConciliacion = new Ext.Window({
                layout: 'form',
                width: view.viewPort.getSize().width - 200,
                title: idioma.lbTitleConciliacion,
                height: view.viewPort.getSize().height - 100,
                resizable: false,
                modal: true,
                html: '<iframe id="ifMarco" style="width:100%; height: 100%; border:none;"></iframe>',
                closeAction: 'close',
                buttons: [new Ext.Button({
//                        icon: perfil.dirImg + 'cerrar.png',
                    iconCls: 'cerrar',
                    text: idioma.lbBtnCerrar,
                    tooltip: idioma.textToolTipCerrar,
                    handler: function () {
                        winIConciliacion.close();
                    }
                })],
                listeners: {
                    show: function () {
                        view.windowopen = true;

                        document.getElementById('ifMarco').src = url;
                        winIConciliacion.maximize();
                        winIConciliacion.doLayout();
                    },
                    close: function () {
                        view.windowopen = false;
                    }
                }
            });
            winIConciliacion.show();
        };

        //Esta funcionalida va a servir para filtrar el estado de cuenta
        this.buscarEstadoCuenta = function () {
            var fechaIni = view.dfFechaInicio.getRawValue();
            var fechaFin = view.dfFechaFin.getRawValue();
            var idCuentaBanc = view.cbCtaBanc.getValue();

            model.stEstadocuenta.reload({
                params: {
                    fechaIni: fechaIni,
                    fechaFin: fechaFin,
                    idCuentaBanc: idCuentaBanc
                }
            });
        };

        //Método para definir la fecha mínima y máxima del datefield que define
        //la fecha del estado de cuenta, depende de los instrumentos en tránsito
        this.definirFechaEC = function (arrfechas) {
            var cant = arrfechas.length;
            var f = 'd/m/Y';

            var fechaPinicio = Date.parseDate(view.finicio, f);
            var fechaPfin = Date.parseDate(view.ffin, f);

            if (cant > 0) {
                var fechamin;
                var fechamax;
                if (cant === 1) {
                    fechamin = Date.parseDate(arrfechas[0], f);
                    fechamax = Date.parseDate(arrfechas[0], f);
                } else {
                    fechamin = Date.parseDate(arrfechas[0], f);
                    fechamax = Date.parseDate(arrfechas[0], f);

                    for (var i = 1; i < cant; i++) {
                        if (Date.parseDate(arrfechas[i], f) < fechamin) {
                            fechamin = Date.parseDate(arrfechas[i], f);
                        } else if (Date.parseDate(arrfechas[i], f) > fechamax) {
                            fechamax = Date.parseDate(arrfechas[i], f);
                        }
                    }
                }

                if (fechamax.getTime() == fechaPfin.getTime() && fechamin.getTime() == fechaPfin.getTime()) {
                    view.dfEstadoCta.setMinValue(fechamax);
                    view.dfEstadoCta.setMaxValue(fechamax);
                } else if (fechamax.getTime() == fechaPinicio.getTime() && fechamin.getTime() == fechaPinicio.getTime()) {
                    view.dfEstadoCta.setMinValue(fechamax);
                    view.dfEstadoCta.setMaxValue(fechamax);
                } else if (fechamax.getTime() == fechamin.getTime()) {
                    view.dfEstadoCta.setMinValue(fechamax);
                    view.dfEstadoCta.setMaxValue(fechamax);
                } else if (fechamax.getTime() != fechamin.getTime()) {
                    view.dfEstadoCta.setMinValue(fechamax);
                    view.dfEstadoCta.setMaxValue(fechamax);
                }
            } else {
                view.dfEstadoCta.setMinValue(fechaPinicio);
                view.dfEstadoCta.setMaxValue(fechaPfin);
            }

            var currentvalue = view.dfEstadoCta.getValue();
//            var currentminvalue = view.dfEstadoCta.minValue;
            var currentmaxvalue = view.dfEstadoCta.maxValue;

            if (currentvalue > currentmaxvalue) {
                view.dfEstadoCta.setValue(currentmaxvalue);
            }
        };

        //Metodo para activar odesactivar el campo fecha del estado de cuenta
        this.enableDisableFechaEC = function () {
            var gridoperacionesvalid = model.stOperaciones.getCount() > 0;

            var selections = view.smDepositos.getSelections();
            var griddepositosvalid = selections.length > 0;

            var generalvalid = gridoperacionesvalid || griddepositosvalid;

            view.dfEstadoCta.setDisabled(generalvalid);
        };

        //Funcion necesaria para poder cargar los depósitos de caja
        this.cargarDepositos = function (isbtnupdate, acc) {
            var valid = true;
            if (isbtnupdate) {
                if (view.cbCuentaBanc.isValid() && view.dfEstadoCta.isValid()) {
                    valid = true;
                } else {
                    valid = false;
                }

                if (acc == 'mod') {
                    this.firstLoadDeposito = true;
                }
            }

            if (valid) {
                var idcuentabancaria = view.cbCuentaBanc.getValue();
                var fecha = view.dfEstadoCta.getRawValue();

                this.loadMascara(idioma.msgLoad, view.gpDepositos.getEl());

                view.smDepositos.clearSelections();
                model.stDepositos.removeAll();
                Ext.Ajax.request({
                    url: 'cargarDepositos',
                    method: 'POST',
                    scope: this,
                    params: {
                        idcuentabancaria: idcuentabancaria,
                        fecha: fecha,
                        idestadodecuenta: (acc == 'mod') ? view.gpEstadocuenta.getSelectionModel().getSelected().data.idestadodecuenta : -1
                    },
                    callback: function (options, success, response) {
                        this.mascara.hide();
                        this.enableDisableFechaEC();
                        if (success) {
                            var response = Ext.decode(response.responseText);

                            model.stDepositos.loadData(response);

                            //Poniendo el first load del deposito en falso, para identificar
                            //que ya no esta en la primera carga
                            this.firstLoadDeposito = false;

                            if (acc == 'mod') {
                                //Esto es en el modificar
                                var importesel = this.importeTotalDepSelected();
                                view.tfimportedepositos.setValue(formatoMoneda(importesel));
                                controller.importeDeposOld = view.tfimportedepositos.getValue();
                            }
                        } else {
                            mostrarMensaje(3, idioma.msgErrorDepositos);
                        }
                    }
                });
            } else {
                mostrarMensaje(1, idioma.msgModDataIncorrect);
            }
        };

        //Funcion necesaria para calcular el importe total de los despositos
        //seleccionados
        this.importeTotalDepSelected = function () {
            var selections = view.smDepositos.getSelections();

            var importesel = 0.0;
            if (selections.length > 0) {
                for (var i = 0, long = selections.length; i < long; i++) {
                    importesel += parseFloat(selections[i].data.importe);
                }
            }
            return importesel;
        };

        //Funcion necesaria para actualizar el saldo final
        //con los depositos seleccionados o deseleccionados
        //Tambien actualiza el campo del total de importe de los depositos seleccionados
        this.updateSaldoFinalWithDeposito = function (operacion, record) {
            //Esto actualiza el campo que muestra el importe total de los depsositos seleccionados
            var importesel = this.importeTotalDepSelected();
            view.tfimportedepositos.setValue(formatoMoneda(importesel));

            //Influencia del elemento deseleccionado o seleccionado al saldo final
            // var saldofinal = parseFloat(cleanComa(view.tfsaldofin.getValue()));
            var saldofinal = parseFloat(controller.saldofin);
            var importe = parseFloat(record.data.importe);
            saldofinal = (operacion == 'suma') ? saldofinal + importe : saldofinal - importe;

            controller.saldofin = saldofinal;
            controller.saldofinmod = saldofinal;

            view.tfsaldofin.setValue(formatoMoneda(saldofinal));
        };

        //muestra la mascara segun el msg
        this.loadMensaje = function (mensaje, elementMask) {
            var bodyMask = (elementMask) ? elementMask : Ext.getBody();
            loadMask = new Ext.LoadMask(bodyMask, {
                msg: mensaje
            });
            loadMask.show();
        };

        this.loadMascara = function (mensaje, elementMask) {
            var bodyMask = (elementMask) ? elementMask : Ext.getBody();
            this.mascara = new Ext.LoadMask(bodyMask, {
                msg: mensaje
            });
            this.mascara.show();
        };

        this.progressMessageBox = function (msg) {
            Ext.MessageBox.show({
                title: idioma.msgEspere,
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
        };

    }
};
