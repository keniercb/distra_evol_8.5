//Empaquetando el componente Ctabancaria.
Ext.ns('Banco.Ctabancaria');
//Controller del componente Ctabancaria.
Banco.Ctabancaria.Controller = {
    /**
     *Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param view Vista del componente Banco.Ctabancaria
     * @param model Modelo de la vista del componente Banco.Ctabancaria
     *
     */
    init: function(idioma, view, model) {
        this.actionbtn = '';
        this.arrcuentasloaded = new Array();

        //Esto saca la diferencia entre dos arreglos lineales
        Array.prototype.diff = function(a) {
            return this.filter(function(i) {
                return a.indexOf(i) < 0;
            });
        };

        controller = this;
        //evento al cargar el tipo cta
        model.stTipocuenta.on('load', function() {
            if (!model.stTipocuenta.getCount()) {
                mostrarMensaje('1', idioma.lbMsgSinTipoConf);
                view.cbTipocuenta.markInvalid(idioma.lbMsgReq);
            }
            controller.cargarUnicovalor(model.stTipocuenta, view.cbTipocuenta, 'idtipocuenta');
        });
        //evento  para seleccionar en la ventana principal, la primera fila del  grid
        model.stCtabancaria.on('load', function() {
            view.gpCtabancaria.getSelectionModel().selectFirstRow();
        });
        //evento al cargar la moneda
        model.stMoneda.on('load', function() {
            if (!model.stMoneda.getCount()) {
                mostrarMensaje('1', idioma.lbMsgSinMonedaConf);
                view.cbMoneda.markInvalid(idioma.lbMsgReq);
            }
            controller.cargarUnicovalor(model.stMoneda, view.cbMoneda, 'idmoneda');
        });
        //evento al cargar el banco
        model.stBanco.on('load', function() {
            if (!model.stBanco.getCount()) {
                mostrarMensaje('1', idioma.lbMsgSinBancoConf);
                view.cbBanco.markInvalid(idioma.lbMsgReq);
            }
            else {
                controller.cargarUnicovalor(model.stBanco, view.cbBanco, 'idbanco');

                if (view.cbBanco.getValue()) {
                    model.stSucursalbanc.removeAll();
                    model.stSucursalbanc.load({
                        params: {
                            idbanco: view.cbBanco.getValue()
                        },
                        callback: function() {
                            if (controller.actionbtn != 'mod') {
                                view.cbSucursalbanc.reset();
                                if (model.stSucursalbanc.getCount()) {
                                    view.cbSucursalbanc.setDisabled(false);
                                    view.cbSucursalbanc.setValue(model.stSucursalbanc.getAt(0).data.idsucursal);
//                            controller.cargarUnicovalor(model.stSucursalbanc, view.cbSucursalbanc, 'idsucursal');
                                } else {
                                    view.cbSucursalbanc.setDisabled(true);
                                    mostrarMensaje(1, idioma.lbMsgSinSucursal);
                                }
                            }
                        }
                    });
                }
            }
        });

        //evento al seleccionar ctas banc de la ventana principal
        view.gpCtabancaria.getSelectionModel().on('rowselect', function(sm, rowIndex, r) {
            view.gpCtabancaria.getView().addRowClass(rowIndex, 'negrita');
            view.btnVer.enable();
            if (view.gpCtabancaria.getSelectionModel().getCount() == 1) {
                var selected = view.gpCtabancaria.getSelectionModel().getSelected();
                if ((selected.data.idlog == selected.data.idestructuracomun) && (selected.data.cerrada != 1) && (selected.data.activada == 1)) {
                    view.btnModificar.enable();
                    view.btnEliminar.enable();
                } else {
                    view.btnModificar.disable();
                    view.btnEliminar.disable();
                }
            } else if (view.gpCtabancaria.getSelectionModel().getCount() > 1) {
                view.btnModificar.disable();
                view.btnEliminar.disable();
            }
        }, this);
        //evento al deseleccionar ctas banc de la ventana principal
        view.gpCtabancaria.getSelectionModel().on('rowdeselect', function(sm, rowIndex, r) {
            view.gpCtabancaria.getView().removeRowClass(rowIndex, "negrita");
            var selected = view.gpCtabancaria.getSelectionModel().getSelected();
            if (view.gpCtabancaria.getSelectionModel().getCount() == 1 && selected.data.activada == 1) {
                view.btnModificar.enable();
                view.btnEliminar.enable();
            } else {
                view.btnModificar.disable();
                view.btnEliminar.disable();
            }
            if (view.gpCtabancaria.getSelectionModel().getCount() == 0) {
                view.btnVer.disable();
            }
        }, this);
        // Evento para mostrar el saldo disponible y las operaciones de la cta banc
        // view.gpCtabancaria.on('rowdblclick', function(sm, rowIndex, r) {
        //     controller.loadDataDbclick();
        // });
        view.gpCtabancaria.on({
            rowdblclick: function (sm, rowIndex, r) {
                controller.loadDataDbclick();
            },
            rowcontextmenu: function (grid, rowIndex, eventObject) {
                eventObject.preventDefault();
                var selModel = this.getSelectionModel();
                selModel.selectRow(rowIndex);
                Ext.getCmp('menuAbrir').setVisible(selModel.getSelected().data.cerrada == 1);
                Ext.getCmp('menuCerrar').setVisible(selModel.getSelected().data.cerrada == 0);
                view.contextMenu.showAt(eventObject.getXY());
            },
        });

        // Ext.getCmp('menuAbrir').on({
        //     click: function () {
        //         console.log('lololool');
        //     }
        // });
        //
        // Ext.getCmp('menuCerrar').on({
        //     click: function () {
        //         console.log('lololool');
        //     }
        // });

        Ext.getCmp('menuAbrir').setHandler(function () {

            this.abrirCuentaBancaria(view.gpCtabancaria.getSelectionModel().getSelected().data.idcuentabancaria);
        }, this);

        Ext.getCmp('menuCerrar').setHandler(function () {
            console.log('ahhhh')
            this.cerrarCuentaBancaria(view.gpCtabancaria.getSelectionModel().getSelected().data.idcuentabancaria);
        }, this);

        //accion de btn adicionar ctaBancaria
        view.btnAdicionar.on('click', function() {
            if (!view.windowopen) {
                controller.openCtaBancaria('add');
            }
        });
        //accion de btn modificar ctaBancaria
        view.btnModificar.on('click', function() {
            if (!view.windowopen) {
                controller.openCtaBancaria('mod');
            }
        });
        //accion de btn eliminar ctaBancaria
        view.btnEliminar.on('click', function() {
            if (!view.windowopen) {
                controller.showMsgEliminar();
            }
        });
        //accion de btn ver ctaBancaria
        view.btnVer.on('click', function() {
            if (!view.windowopen) {
                controller.configurarPreView();
            }
        });
        //accion de btn ayuda ctaBancaria
        view.btnAyuda.on('click', function() {
            //help.show(idioma.lbtextTitleHelp, 'confin/banco/configuracion/ctabancaria');
        });
        //teclas de acceso rapido
        //adicionar Cta bancaria
        view.globalKeyMap.accessKey({
            key: 'i',
            alt: true
        }, function() {
            if (!view.windowopen && !view.viewPort.disabled) {
                controller.openCtaBancaria('add');
            }
        }, Ext.getBody()
                );
        //modificar Cta bancaria
        view.globalKeyMap.accessKey({
            key: 'm',
            alt: true
        }, function() {
            if (!view.windowopen && !view.btnModificar.disabled && !view.viewPort.disabled) {
                controller.openCtaBancaria('mod');
            }
        }, Ext.getBody());
        //eliminar Cta bancaria
        view.globalKeyMap.accessKey({
            key: Ext.EventObject.DELETE
        }, function() {
            if (!view.windowopen && !view.btnEliminar.disabled && !view.viewPort.disabled) {
                if (view.gpCtabancaria.getSelectionModel().getSelected()) {
                    controller.showMsgEliminar();
                }
            }
        }, Ext.getBody());
        //ver detalles Cta bancaria
        view.globalKeyMap.accessKey({
            key: 'd',
            alt: true
        }, function() {
            if (!view.windowopen && !view.viewPort.disabled) {
                controller.configurarPreView();
            }
        }, Ext.getBody());
        //ayuda de  Cta bancaria
        view.globalKeyMap.accessKey({
            key: 'h',
            alt: true
        }, function() {
            if (!view.viewPort.disabled)
                help.show(idioma.lbTooltipAyudaCtaBancaria, 'confin/banco/configuracion/ctabancaria');
        }, Ext.getBody());
        //accion de btn aceptar en la ventana Adicionar/Modificar cta bancaria
        view.btnCancelar.on('click', function() {
            view.winCtabancaria.hide();
        });
        view.btnAplicar.on('click', function() {
            controller.addCtaBancaria('apl'); // adicionarCuentaBancaria
        });
        view.btnAceptar.on('click', function() {
            if (controller.actionbtn == 'add') {
                controller.addCtaBancaria('acp'); // adicionarCuentaBancaria
            }
            else {
                controller.modCtaBancaria(); // modificarCuentaBancaria
            }
        });
//evento chekeado  del  sobregiro
        /*view.ckbsobregiro.on('check', function(ckb,checked){
         if(checked){
         model.stCtacontableSG.load({
         callback:function(){
         if((controller.accion == 1)&&(view.gpCtabancaria.getSelectionModel().getSelected().data.sobregiro==1)){
         var mo = model.stCtacontableSG.find('idcuentasg',view.gpCtabancaria.getSelectionModel().getSelected().data.idcuentasg);

         if(mo > -1){
         view.cbCtacontableSG.reset();
         view.cbCtacontableSG.setValue(view.gpCtabancaria.getSelectionModel().getSelected().data.idcuentasg);
         view.cbCtacontableSG.setRawValue(model.stCtacontableSG.getAt(mo).get('nombrecuenta'));
         }else{
         mostrarMensaje('1',idioma.lbConfTipoCta);
         }
         }
         }
         });
         view.tabs.unhideTabStripItem(2);

         view.cbCtacontableSG.focus(true,100);
         view.cbCtacontableSG.enable();
         view.tfContratoSG.enable();
         view.tfLimiteSG.enable();
         view.dfFechaInicioSG.enable();
         view.dfFechaFinSG.enable();
         if(controller.accion == 0){
         controller.limpiarsobregiro();
         }else if((controller.accion == 1)&&(view.gpCtabancaria.getSelectionModel().getSelected().data.sobregiro==0)){
         controller.limpiarsobregiro();
         }


         }else{
         view.tabs.hideTabStripItem(2);

         view.cbCtacontableSG.disable();
         view.tfContratoSG.disable();
         view.tfLimiteSG.disable();
         view.dfFechaInicioSG.disable();
         view.dfFechaFinSG.disable();
         view.tabs.setActiveTab(0);

         }

         });
         */

        //ventana adicionar o modificar cta bancaria
        //evento al ocultarse
        view.winCtabancaria.on('hide', function() {
            view.windowopen = false; // no  esta abierta la ventana
            view.fpCtabancaria.getForm().reset();
            view.globalKeyMap.enable();//habilitar keyMap

            //Limpiando el grid de cuentas contables
            view.grideditorCuentasContables.deleteAllRows();
        });
        //evento al mostrarse
        view.winCtabancaria.on('show', function() {

            view.btnAceptar.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    stopEvent: true,
                    fn: function() {
                        view.cbTipocuenta.focus(true, true);
                    }
                }
            ]);

            view.cbTipocuenta.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    shift: true,
                    stopEvent: true,
                    fn: function() {
                        view.btnAceptar.focus();
                    }
                }
            ]);

            view.dfApertura.getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    shift: true,
                    stopEvent: true,
                    fn: function() {
                        view.tfNctabancaria.focus(true, true);
                    }
                }
            ]);

            view.windowopen = true;
            view.cbTipocuenta.focus(false, 100);
            view.tabs.activate(1); //se ativan los dos para que renderice ambos componentes
            view.tabs.activate(0);
            model.stUnidadcontable.removeAll();
            controller.habilitarCampos();
            if (controller.actionbtn == 'add')
                controller.loadDataCtaBancaria();
            else
                controller.loadDataModCtaBancaria();
            view.globalKeyMap.disable();//deshabilitar keyMap
        });
        //eventos de la ventana Ver detalles de seleccion
        //evento al ocultarse
        view.winVerdetalles.on('hide', function() {
            view.windowopen = false;
        });
        //evento al mostrarse
        view.winVerdetalles.on('show', function() {
            view.windowopen = true;
        });
        //accion de btn cerrar en ventana Ver detalles
        view.btnCerrar.on('click', function() {
            view.winVerdetalles.hide();
        });
        // eventos con select
        view.cbTipocuenta.on('select', function() {
            view.tfNctabancaria.focus(true, 100);
        });
//        view.cbMoneda.on('select', function() {
//            var mo = model.stMoneda.find('idmoneda', view.cbMoneda.getValue());
//            if (mo > -1) {
//                if (model.stMoneda.getAt(mo).data.idtasa > -1) {
//                    view.tfNombre.focus(true, 100);
//                }
//                else {
//                    view.cbMoneda.reset();
//                    view.cbMoneda.focus(true, 100);
//                    mostrarMensaje(1, idioma.lbMsgSinTasa);
//                }
//            }
//        });
        //accion de cbx cbBanco  sobre  cbSucursalbanc
        view.cbBanco.on('select', function() {
            controller.MostrarMensaje(idioma.lbTextCargandoSB);
            model.stSucursalbanc.removeAll();
            model.stSucursalbanc.load({
                params: {
                    idbanco: view.cbBanco.getValue()
                },
                callback: function() {
                    view.cbSucursalbanc.reset();
                    loadMask.hide();
                    if (model.stSucursalbanc.getCount()) {
                        view.cbSucursalbanc.setDisabled(false);
                        controller.cargarUnicovalor(model.stSucursalbanc, view.cbSucursalbanc, 'idsucursal');
                        view.cbSucursalbanc.focus(true, 100);
                    } else {
                        view.cbSucursalbanc.setDisabled(true);
                        view.cbBanco.focus(true, 100);
                        mostrarMensaje(1, idioma.lbMsgSinSucursal);
                    }
                }
            });
        });
        // eventos con blur
        view.tfNombre.on({
            scope: this,
            blur: function(cmp) {
                if (cmp.getValue().length > 0) {
                    var vtext = cmp.getValue().trim();
                    cmp.setValue(vtext);
                }
            }
        });

        view.tfSaldiniBanco.on('blur', function(field, event) {
            if (!view.tfSaldiniBanco.getValue() || view.tfSaldiniBanco.getValue() == 0) {
                view.tfSaldiniBanco.setValue(formatoMoneda(0));
                view.tfSaldactualBanco.setValue(formatoMoneda(0));
            }
            else if (view.tfSaldiniBanco.isValid()) {
                var saldo = parseFloat(cleanComa(view.tfSaldiniBanco.getValue()));
                if (isNaN(saldo)) {
                    view.tfSaldiniBanco.setValue(formatoMoneda(0));
                    view.tfSaldactualBanco.setValue(formatoMoneda(0));
                }
                else {
                    view.tfSaldiniBanco.setValue(formatoMoneda(parseFloat(cleanComa(view.tfSaldiniBanco.getValue()))));
                    view.tfSaldactualBanco.setValue(formatoMoneda(parseFloat(cleanComa(view.tfSaldiniBanco.getValue()))));
                }
            }
            if (view.apertura) { // Apertura = 1 que no esta en carga inicial
                view.tfSaldactualBanco.setDisabled(false);
            }
        });
        view.tfSaldactualBanco.on('blur', function(field, event) {
            if (this.actionbtn == 'add' && view.apertura) {
                if (view.tfSaldactualBanco.isValid()) {
                    view.tfSaldactualBanco.setValue(formatoMoneda(parseFloat(cleanComa(view.tfSaldactualBanco.getValue()))));
                }
            }
        });
        /*	 // eventos con blur  del  SOBREGIRO
         view.tfLimiteSG.on('blur', function(field,event){
         if(view.tfLimiteSG.isValid()){
         view.tfLimiteSG.setRawValue(saldo(view.tfLimiteSG.getValue()));
         }
         });

         // eventos con keypress  del  SOBREGIRO
         view.tfLimiteSG.on('keypress', function(tf,e){
         if(e.getKey() != 8){
         var value = new String(tf.getValue());
         var position = value.indexOf(".", 0);
         if(position > -1 && (e.getKey() == 37 || e.getKey() ==39)){// Para que no permita desplazarse hacia izq o der
         e.stopEvent();
         }
         if(position > -1 && e.getKey() == 46){// Para que solo permita un punto
         e.stopEvent();
         }
         if(position > -1 && (value.length - position) > 2){// Para que solo permita 2 lugares decimales
         e.stopEvent();
         }
         if(position == -1 && value.length>=16 &&  e.getKey() != 46){// Para que escriba solo 16 caracteres antes del '.'
         e.stopEvent();
         }
         if (value.length>=19){// Para que escriba solo 19 caracteres
         e.stopEvent();
         }
         }
         });

         */

        // eventos con enter
        view.cbTipocuenta.on('keypress', function(field, event) {
            if (event.getKey() == 13) {
                if (!view.cbTipocuenta.getRawValue()) {
                    view.cbTipocuenta.setValue(model.stTipocuenta.getAt(0).get('idtipocuenta'));
                    view.cbTipocuenta.fireEvent('select', this);
                }
                else if (view.cbTipocuenta.validateValue(view.cbTipocuenta.getValue())) {
                    view.cbTipocuenta.fireEvent('select', this);
                }
            }

            if (event.getKey() == 8) {
                field.clearValue();
            }
        });
        view.tfNctabancaria.on('keypress', function(field, event) {
            if ((event.getKey() == 13) && (view.tfNctabancaria.getValue() != '')) {
                view.dfApertura.focus(true, 100);
            }
        });

        view.tfNctabancaria.on({
            scope: this,
            blur: function(cmp) {
                if (cmp.getValue().length > 0) {
                    var vtext = cmp.getValue().trim();
                    cmp.setValue(vtext);
                }
            }
        });

        view.dfApertura.on('keypress', function(field, event) {
            if ((event.getKey() == 13)) {
                if (!view.dfApertura.getValue()) {
                    date = view.dfApertura.minValue;
                    if (!view.dfApertura.getValue()) {
                        view.dfApertura.setValue(date);
                    }
                }
//                view.cbMoneda.focus(true, 100);
                view.tfNombre.focus(true, 100);
            }
        });

        view.dfApertura.on({
            scope: this,
            specialkey: function(datefield, event) {
                if (event.getKey() == 9) {
//                    view.cbMoneda.focus(true, true);
                    view.tfNombre.focus(true, true);
                }
            }
        });

//        view.cbMoneda.on('keypress', function(field, event) {
//            if (event.getKey() == 13) {
//                if (!view.cbMoneda.getRawValue()) {
//                    view.cbMoneda.setValue(model.stMoneda.getAt(0).get('idmoneda'));
//                    view.cbMoneda.setRawValue(model.stMoneda.getAt(0).get('codigoiso'));
//                    view.cbMoneda.fireEvent('select', this);
//                }
//                else if (view.cbMoneda.validateValue(view.cbMoneda.getValue())) {
//                    view.cbMoneda.fireEvent('select', this);
//                }
//            }
//
//            if (event.getKey() == 8) {
//                field.clearValue();
//            }
//        });
        view.tfNombre.on('keypress', function(field, event) {
            if ((event.getKey() == 13) && (view.tfNombre.getValue() != '')) {
                view.tfSaldiniBanco.focus(true, 100);
            }
        });
        view.tfSaldiniBanco.on('keypress', function(field, event) {
            if ((event.getKey() == 13) && (view.tfSaldiniBanco.getValue() != '')) {
                if (view.tfSaldiniBanco.getValue() == 0) {
                    view.tfSaldiniBanco.setValue(formatoMoneda(0));
                    view.tfSaldactualBanco.setValue(formatoMoneda(0));
                } else {
                    view.tfSaldiniBanco.setValue(formatoMoneda(parseFloat(cleanComa(view.tfSaldiniBanco.getValue()))));
                    view.tfSaldactualBanco.setValue(formatoMoneda(parseFloat(cleanComa(view.tfSaldiniBanco.getValue()))));
                }
                view.cbBanco.focus(true, 100);
            }
            /* if (event.getKey() != 8) {
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
             }*/
        });
        view.cbBanco.on('keypress', function(field, event) {
            if (event.getKey() == 13) {
                if (!view.cbBanco.getRawValue()) {
                    view.cbBanco.setValue(model.stBanco.getAt(0).get('idbanco'));
                    view.cbBanco.fireEvent('select', this);
                }
                else if (view.cbBanco.validateValue(view.cbBanco.getValue())) {
                    view.cbBanco.fireEvent('select', this);
                }
            }

            if (event.getKey() == 8) {
                field.clearValue();
                view.cbSucursalbanc.clearValue();
            }
        });
        view.cbSucursalbanc.on('keypress', function(field, event) {
            if (event.getKey() == 13) {
                if (!view.cbSucursalbanc.getRawValue()) {
                    view.cbSucursalbanc.setValue(model.stSucursalbanc.getAt(0).get('idsucursal'));
                    view.cbSucursalbanc.setRawValue(model.stSucursalbanc.getAt(0).get('numdir'));
                } else {
                    view.cbSucursalbanc.validateValue(view.cbSucursalbanc.getValue());
                }

                view.grideditorCuentasContables.btnadd.focus();
            }

            if (event.getKey() == 8) {
                field.clearValue();
            }
        });

        //Llamada al evento afterrowedit para aumentar los campos de los saldos en libros
        view.grideditorCuentasContables.on({
            scope: this,
            afterrowedit: function(grideditor, alldatos, record) {

                if (controller.actionbtn == 'add') {
                    var cant = alldatos.length;
                    var saldo = 0;
                    for (var i = 0; i < cant; i++) {
                        if (alldatos[i].data.saldo != 0) {
                            saldo += parseFloat(cleanComa(alldatos[i].data.saldo.toString()));
                        }
                    }

                    //Transformando el campo del saldo inicial en libro
                    view.tfSaldiniLibro.setValue(formatoMoneda(cleanComa(saldo.toString())));
                    //Transformando el campo del saldo inicial en banco
                    view.tfSaldiniBanco.setValue(formatoMoneda(cleanComa(saldo.toString())));

                    view.tfSaldLibro.setValue(formatoMoneda(cleanComa(saldo.toString())));
                    view.tfSaldactualBanco.setValue(formatoMoneda(cleanComa(saldo.toString())));
                }

                if (controller.actionbtn == 'mod' && record.data.ctacontlibre) {
                    var cant = alldatos.length;
                    var cantctacontlibre = 0;
                    alldatos.forEach(function(item, index, allItems) {
                        //Esto significa que la cuenta contable asociada esta libre, o sea que no hay operaciones
                        //realizadas con ella
                        if (item.data.ctacontlibre == true) {
                            cantctacontlibre++;
                        }
                    }, this);

                    if (cant == cantctacontlibre) {
                        //Esto es que todas las cuentas contables asociadas están libres,
                        //no tienen operaciones asociadas ninguna
                        var saldo = 0;
                        for (var i = 0; i < cant; i++) {
                            if (alldatos[i].data.saldo != 0) {
                                saldo += parseFloat(cleanComa(alldatos[i].data.saldo.toString()));
                            }
                        }

                        //Transformando el campo del saldo inicial en libro
                        view.tfSaldiniLibro.setValue(formatoMoneda(cleanComa(saldo.toString())));
                        //Transformando el campo del saldo inicial en banco
                        view.tfSaldiniBanco.setValue(formatoMoneda(cleanComa(saldo.toString())));

                        view.tfSaldLibro.setValue(formatoMoneda(cleanComa(saldo.toString())));
                        view.tfSaldactualBanco.setValue(formatoMoneda(cleanComa(saldo.toString())));
                    }
                    else {
                        //Esto es que alguna cuenta tiene operaciones asociada
                        var saldolibro = 0.0;
                        var saldobanco = 0.0;
                        if (!Ext.isEmpty(view.tfSaldLibro.getValue())) {
                            saldolibro = parseFloat(cleanComa(view.tfSaldLibro.getValue()));
                        }

                        if (!Ext.isEmpty(view.tfSaldactualBanco.getValue())) {
                            saldobanco = parseFloat(cleanComa(view.tfSaldactualBanco.getValue()));
                        }

                        if (!record.data.saldo) {
                            record.data.saldo = '0.00';
                        }

                        saldolibro += parseFloat(cleanComa(record.data.saldo.toString()));
                        saldobanco += parseFloat(cleanComa(record.data.saldo.toString()));

                        view.tfSaldLibro.setValue(formatoMoneda(cleanComa(saldolibro.toString())));
                        view.tfSaldactualBanco.setValue(formatoMoneda(cleanComa(saldobanco.toString())));
                    }
                }

                if (controller.actionbtn == 'mod' && !record.data.ctacontlibre) {
                    var saldolibro = 0.0;
                    var saldobanco = 0.0;
                    if (!Ext.isEmpty(view.tfSaldLibro.getValue())) {
                        saldolibro = parseFloat(cleanComa(view.tfSaldLibro.getValue()));
                    }

                    if (!Ext.isEmpty(view.tfSaldactualBanco.getValue())) {
                        saldobanco = parseFloat(cleanComa(view.tfSaldactualBanco.getValue()));
                    }

                    if (!record.data.saldo) {
                        record.data.saldo = '0.00';
                    }

                    saldolibro += parseFloat(cleanComa(record.data.saldo.toString()));
                    saldobanco += parseFloat(cleanComa(record.data.saldo.toString()));

                    view.tfSaldLibro.setValue(formatoMoneda(cleanComa(saldolibro.toString())));
                    view.tfSaldactualBanco.setValue(formatoMoneda(cleanComa(saldobanco.toString())));
                }
            },
            afterrowdeleted: function(grideditor, record) {

                if (!record.data.saldo) {
                    record.data.saldo = '0.00';
                }

                if (controller.actionbtn == 'add' || (controller.actionbtn == 'mod' && record.data.ctacontlibre)) {
                    var alldatos = grideditor.getStore().getRange();
                    var cant = alldatos.length;
                    var cantctacontlibre = 0;
                    alldatos.forEach(function(item, index, allItems) {
                        //Esto significa que la cuenta contable asociada esta libre, o sea que no hay operaciones
                        //realizadas con ella
                        if (item.data.ctacontlibre == true) {
                            cantctacontlibre++;
                        }
                    }, this);

                    //Esto es que todas las cuentas contables asociadas están libres,
                    //no tienen operaciones asociadas ninguna
                    if (cant == cantctacontlibre) {
                        //Transformando el campo saldo inicial en libro cuando elimina la cuenta contable
                        var saldo1 = (view.tfSaldiniLibro.getValue()) ? view.tfSaldiniLibro.getValue() : '0.00';
                        var saldoIniLibro = parseFloat(cleanComa(saldo1));
                        saldoIniLibro -= parseFloat(cleanComa(record.data.saldo.toString()));
                        view.tfSaldiniLibro.setValue(formatoMoneda(saldoIniLibro));

                        //Transformando el campo saldo inicial en banco cuando elimina la cuenta contable
                        var saldo2 = (view.tfSaldiniBanco.getValue()) ? view.tfSaldiniBanco.getValue() : '0.00';
                        var saldoIniBanco = parseFloat(cleanComa(saldo2));
                        saldoIniBanco -= parseFloat(cleanComa(record.data.saldo.toString()));
                        view.tfSaldiniBanco.setValue(formatoMoneda(saldoIniBanco));
                    }
                }

                var saldo3 = (view.tfSaldLibro.getValue()) ? view.tfSaldLibro.getValue() : '0.00';
                var saldoLibro = parseFloat(cleanComa(saldo3));
                saldoLibro -= parseFloat(cleanComa(record.data.saldo.toString()));
                view.tfSaldLibro.setValue(formatoMoneda(saldoLibro));

                var saldo4 = (view.tfSaldactualBanco.getValue()) ? view.tfSaldactualBanco.getValue() : '0.00';
                var saldoBanco = parseFloat(cleanComa(saldo4));
                saldoBanco -= parseFloat(cleanComa(record.data.saldo.toString()));
                view.tfSaldactualBanco.setValue(formatoMoneda(saldoBanco));
            },
            beforerowedit: function(grideditor, records, record) {
                if (controller.actionbtn == 'mod' && record.data.ctacontlibre == false && record.data.loaded == true) {
                    return false;
                }
                return true;
            }
        });

//sobregiro
        /*
         view.cbCtacontableSG.on('keypress', function(field,event){
         if(event.getKey()==13){
         if(!view.cbCtacontableSG.getValue()){
         view.cbCtacontableSG.setValue(model.stCtacontableSG.getAt(0).get('idcuentasg'));
         }
         if((view.cbCtacontableSG.getValue()!='') && view.cbCtacontableSG.isValid()){
         view.dfFechaInicioSG.focus(true,100);// se le da el foco al campo No.cuenta
         }
         }
         });

         view.dfFechaInicioSG.on('keypress', function(field,event){
         if(event.getKey()==13){
         date = view.dfFechaInicioSG.minValue;
         if(!view.dfFechaInicioSG.getValue()){
         view.dfFechaInicioSG.setValue(date);
         view.dfFechaInicioSG.focus(true,100);
         }
         if((view.dfFechaInicioSG.getValue()) && (view.dfFechaInicioSG.isValid()) ){
         view.tfContratoSG.focus(true,100);
         }
         }
         });

         view.tfContratoSG.on('keypress', function(tf,e){
         if(e.getKey() != 8 && e.getKey() !=46){ // Para que permita borrar
         var value = new String(tf.getValue());
         if(value.length>=16) e.stopEvent();  // Para que no escriba m�s de 16 caracteres
         }
         if(e.getKey() == 13){
         if(view.tfContratoSG.getValue()){
         view.dfFechaFinSG.focus(true,100);
         }

         }
         });

         view.dfFechaFinSG.on('keypress', function(field,event){
         if(event.getKey()==13){
         date = view.dfFechaFinSG.maxValue;
         if(!view.dfFechaFinSG.getValue()){
         view.dfFechaFinSG.setValue(date);
         view.dfFechaFinSG.focus(true,100);
         }
         if((view.dfFechaFinSG.getValue()) && (view.dfFechaFinSG.isValid()) ){
         view.tfLimiteSG.focus(true,100);
         }
         }
         });
         */


//abrir ventana add o mod cta bancaria
        this.openCtaBancaria = function(action) {
            controller.MostrarMensaje(idioma.msgLoad);
            switch (action) {
                case 'add':
                    view.winCtabancaria.setTitle(idioma.lbTitleAddCtaBancaria);
                    controller.actionbtn = 'add';
                    view.winCtabancaria.show();
                    view.btnAplicar.show();
                    view.fpCtabancaria.getForm().isValid();
                    break;
                default:
                    view.btnAplicar.hide();
                    view.winCtabancaria.setTitle(idioma.lbTitleModCtaBancaria);
                    controller.actionbtn = 'mod';
                    view.winCtabancaria.show();
                    break;
            }
        };
        //carga los datos para adicionar la cta bancaria
        this.loadDataCtaBancaria = function() {
            Ext.Ajax.request({
                url: 'loadDataCta',
                callback: function(options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    model.stTipocuenta.loadData(responseData.tipoCta);
                    model.stMoneda.loadData(responseData.moneda);
                    model.stBanco.loadData(responseData.bancos);
                    model.stUnidadcontable.loadData(responseData.unidCont);
                    //view.tabs.activate(0);
                    loadMask.hide();
                }
            });
        };
        //carga los datos para modificar la cta bancaria
        this.loadDataModCtaBancaria = function() {
            Ext.Ajax.request({
                url: 'loadDataModCta',
                params: {
                    idmoneda: view.gpCtabancaria.getSelectionModel().getSelected().data.idmoneda,
                    idbanco: view.gpCtabancaria.getSelectionModel().getSelected().data.idbanco,
                    idcuentascontables: ((controller.actionbtn == 'mod') && (view.gpCtabancaria.getSelectionModel().hasSelection())) ? Ext.encode(controller.obtenerIDCtascontables()) : 0,
                    idcuentabancaria: view.gpCtabancaria.getSelectionModel().getSelected().data.idcuentabancaria
                },
                callback: function(options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    model.stTipocuenta.loadData(responseData.tipoCta);
                    model.stMoneda.loadData(responseData.moneda);
                    model.stBanco.loadData(responseData.bancos);
                    model.stSucursalbanc.loadData(responseData.sucursal);
                    model.stUnidadcontable.loadData(responseData.unidCont);

                    view.grideditorCuentasContables.getStore().loadData(responseData.ctasCont);
                    controller.arrcuentasloaded = responseData.ctasCont.datos;


                    controller.selectRows(view.gpUnidadcontable);
                    //si la cta no esta libre se deshabilitan varios campos
                    if (!responseData.libre) {
                        view.grideditorCuentasContables.cuentabancarialibre = false;
                        controller.deshabilitarCampos();
                    } else {
                        view.grideditorCuentasContables.cuentabancarialibre = true;
                        controller.habilitarCampos();
                    }

                    //se setea el tipo cta en el campo
                    if (model.stTipocuenta.getCount() > 0) {
                        var mo = model.stTipocuenta.find('idtipocuenta', view.gpCtabancaria.getSelectionModel().getSelected().data.idtipocuentabancaria);
                        if (mo > -1) {
                            var tipocuenta = model.stTipocuenta.getAt(mo);
                            view.cbTipocuenta.reset();
                            view.cbTipocuenta.setValue(tipocuenta.data.idtipocuenta);
//                            view.cbTipocuenta.setRawValue(tipocuenta.data.denom);
                            view.cbTipocuenta.collapse();
                        } else {
                            mostrarMensaje('1', idioma.lbConfTipoCta);
                        }
                    }

                    view.tfNctabancaria.setValue(view.gpCtabancaria.getSelectionModel().getSelected().data.nrocuenta);
                    view.tfNombre.setValue(view.gpCtabancaria.getSelectionModel().getSelected().data.nombrecuentabancaria);
                    view.cbMoneda.setValue(view.gpCtabancaria.getSelectionModel().getSelected().data.idmoneda);
                    view.cbBanco.setValue(view.gpCtabancaria.getSelectionModel().getSelected().data.idbanco);
                    view.cbBanco.setRawValue(view.gpCtabancaria.getSelectionModel().getSelected().data.nombrebanco);
                    view.dfApertura.setValue(view.gpCtabancaria.getSelectionModel().getSelected().data.fechaapertura);
                    view.tfSaldiniLibro.setValue(formatoMoneda(view.gpCtabancaria.getSelectionModel().getSelected().data.saldoinicialmo)); //aqui debe traer el saldo con que se creo la cuenta al principio
                    //view.tfSaldiniLibro.setValue(view.gpCtabancaria.getSelectionModel().getSelected().data.saldoinicialmo); //aqui debe traer el saldo con que se creo la cuenta al principio
                    view.tfSaldLibro.setValue(formatoMoneda(view.gpCtabancaria.getSelectionModel().getSelected().data.saldoactualctacontable)); //debe traer el saldo actual de la cuenta
                    //view.tfSaldLibro.setValue(view.gpCtabancaria.getSelectionModel().getSelected().data.saldoactualctacontable);//debe traer el saldo actual de la cuenta
                    view.tfSaldiniBanco.setValue(formatoMoneda(view.gpCtabancaria.getSelectionModel().getSelected().data.saldoinicialbancomo));
                    //view.tfSaldiniBanco.setValue(view.gpCtabancaria.getSelectionModel().getSelected().data.saldoinicialbancomo);
                    view.tfSaldactualBanco.setValue(formatoMoneda(view.gpCtabancaria.getSelectionModel().getSelected().data.saldoenbancomo));
                    //view.tfSaldactualBanco.setValue(view.gpCtabancaria.getSelectionModel().getSelected().data.saldoenbancomo);
                    view.tfNombre.setDisabled(false); //Permitir modificar el titular de la cuenta bancaria al modificar
                    view.chkbSobregiro.setValue(view.gpCtabancaria.getSelectionModel().getSelected().data.permitirsobregiro);
                    if (model.stSucursalbanc.getCount()) {
                        view.cbSucursalbanc.setDisabled(false); // Habilitar el combo
                        view.cbSucursalbanc.setValue(view.gpCtabancaria.getSelectionModel().getSelected().data.idsucursal);
                    } else {
                        view.cbSucursalbanc.reset();
                        view.cbSucursalbanc.setDisabled(true); // Deshabilitar el combo
                        mostrarMensaje(1, idioma.lbMsgSinSucursal);
                    }

                    //Dándole el foco al boton cancelar
                    view.btnCancelar.focus(true, 1000);
                    loadMask.hide();
                }
            });
        };
        //carga los datos iniciales y valida la apertura
        this.loadDataIni = function() {
            controller.MostrarMensaje(idioma.msgLoad);
            Ext.Ajax.request({
                url: 'loadDataIni',
                method: 'POST',
                params: {
                    start: 0,
                    limit: view.gpCtabancaria.getBottomToolbar().pageSize
                },
                callback: function(options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.aperturado != 0) {//Comprueba si es CI para habilitar o no campos especificos
                        view.apertura = 0; //no esta en carga inicial
                    }
                    if (responseData.fechaCont) {
                        view.dfApertura.setMaxValue(responseData.fechaCont.fecha);
//                        view.dfApertura.setMaxValue(responseData.fechaCont.fechafin);
//                        view.dfApertura.setMinValue(responseData.fechaCont.fechai);
                        view.dfApertura.setValue(responseData.fechaCont.fecha);
                    }
                    else {
                        mostrarMensaje(1, idioma.lbMsgSinFechaPeriodo);
                    }
//cargar el listado de los tipos de cuenta bancaria
                    model.stCtabancaria.loadData(responseData.gridCta);
                    //si la cta tiene operaciones asociadas no se debe dejar modificar sus saldos

                    view.btnAdicionar.focus();
                    loadMask.hide();
                }//callback
            });
        };
        //accion al hacer doble click sobre l;a bancaria
        this.loadDataDbclick = function() {
            controller.MostrarMensaje(idioma.msgLoad);
            view.lbDispEfectivo.setText(idioma.lbCalcuDisponibilidad);
            Ext.Ajax.request({
                url: ' loadDataDbclick',
                params: {
                    idcuentas: Ext.encode(controller.obtenerIDCtascontables()), //se envian los id de las contables asociadas
                    idcuentabancaria: view.gpCtabancaria.getSelectionModel().getSelected().data.idcuentabancaria,
                    idestructuracomun: view.gpCtabancaria.getSelectionModel().getSelected().data.idestructuracomun
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);

                    var objdata = view.gpCtabancaria.getSelectionModel().getSelected().data;

                    var saldoWithStyle = (responseData.saldoDisp < 0) ? '<span style="color: red;font-weight: bold;">' + formatoMoneda(responseData.saldoDisp) + '</span>' : '<span style="color: green;font-weight: bold;">' + formatoMoneda(responseData.saldoDisp) + '</span>';
                    var ctaBancWithStyle = '<span style="font-style: italic;font-weight: bold;">' + objdata.nrocuenta + ' ' + objdata.nombrecuentabancaria + ': ' + '</span>';

                    var text = '<span style="font-style: italic;font-weight: bold;text-decoration: underline;">' + idioma.lbDispEfectivo + '</span>' + ctaBancWithStyle + saldoWithStyle;

                    view.lbDispEfectivo.setText(text, false);

                    model.stUnidadesusuarias.loadData(responseData.unidCont);
                    model.stEstadocta.loadData(responseData.estCta);
                    model.stOperaciones.loadData(responseData.operEfec);
                    view.tpOperaciones.activate(view.tpOperaciones.getItem('tab1'));
                    view.pOperaciones.expand();
                    loadMask.hide();
                }
            });
        };
        //adiciona la cta bancaria
        this.addCtaBancaria = function(button) {
            var flag = true;
            if ((model.stSucursalbanc.getCount() && !view.cbSucursalbanc.getValue()) /*|| (view.tfSaldactualBanco.getValue() == 0) || (view.tfSaldiniBanco.getValue() == 0)*/)
                flag = false;
            if (view.fpCtabancaria.getForm().isValid() && flag) {
                //Verificar si el grid de cuentas contables tiene datos
                //Debe de tener al menos una cuenta contable adicionada
                var cant = view.grideditorCuentasContables.getStore().getCount();
                if (cant === 0 || !view.grideditorCuentasContables.gridValid()) {
                    view.grideditorCuentasContables.btnadd.focus();
                    mostrarMensaje(1, idioma.lbMsgIntruduzacaCtacontable);
                }
                else {
                    controller.loadMessageBox(idioma.lbMsgGuardando);
                    var arrCtacontable = controller.findElementsGridCtaCont(); //obtiene ctas contables

                    var temp = view.gpUnidadcontable.getSelectionModel().getSelections(); //obtiene unidades contables seleccionadas del  grid
                    var arrgridunidadctble = new Array();
                    for (var i = 0; i < temp.length; i++) {
                        arrgridunidadctble.push(temp[i].data);
                    }

                    var idmoneda = view.cbMoneda.getValue();
                    var store = view.cbMoneda.store;
                    var index = store.find('idmoneda', idmoneda);
                    var objmoneda = store.getAt(index).data;

                    Ext.Ajax.request({
                        url: 'adicionarCuentaBancaria',
                        params: {
                            idtipocuenta: view.cbTipocuenta.getValue(),
                            nrocuenta: view.tfNctabancaria.getValue(),
                            nombrecuentabancaria: view.tfNombre.getValue(),
                            idcuentascontables: Ext.encode(arrCtacontable),
                            idbanco: view.cbBanco.getValue(),
                            fechaapertura: view.dfApertura.getRawValue(),
                            idmoneda: objmoneda.idmoneda,
                            idtasa: objmoneda.idtasa,
                            idsucursal: view.cbSucursalbanc.getValue(),
                            saldoinicial: (view.tfSaldiniLibro.getValue()) ? parseFloat(cleanComa(view.tfSaldiniLibro.getValue())) : 0, // El saldo de la cuenta contable
                            saldoinicialbanco: (view.tfSaldiniBanco.getValue()) ? parseFloat(cleanComa(view.tfSaldiniBanco.getValue())) : 0, // Saldo inicial de la cuenta bancaria
                            saldoenbanco: (view.tfSaldactualBanco.getValue()) ? parseFloat(cleanComa(view.tfSaldactualBanco.getValue())) : 0, // Saldo actual de la cuenta bancaria = inicial al principio
                            estructurasseleccionadas: Ext.encode(arrgridunidadctble),
                            permitirsobregiro: view.chkbSobregiro.getValue() ?  1 : 0
                        },
                        callback: function(options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            Ext.MessageBox.hide();
                            switch (responseData.n_codMsg) {
                                case 1:
                                    if (button != 'apl') {
                                        view.winCtabancaria.hide();
                                        view.gpCtabancaria.getStore().reload();
                                        mostrarMensaje(1, idioma.lbMsgExitoAdd);
                                    }
                                    else {
                                        view.tfNctabancaria.setValue('');
                                        view.tfNombre.setValue('');
                                        view.tfSaldiniBanco.setValue('0.00');
                                        view.tfSaldactualBanco.setValue('0.00');
                                        view.tfSaldLibro.setValue('0.00');
                                        view.tfSaldiniLibro.setValue('0.00');
                                        view.gpUnidadcontable.getSelectionModel().clearSelections();
                                        model.stMoneda.fireEvent('load', model.stMoneda, true);
                                        //view.cbMoneda.fireEvent('select', this);
                                        model.stTipocuenta.fireEvent('load', model.stTipocuenta, true);
                                        //model.stBanco.fireEvent('load', model.stBanco, true);
                                        view.cbBanco.clearValue();
                                        view.cbSucursalbanc.clearValue();
                                        model.stSucursalbanc.removeAll();
                                        view.grideditorCuentasContables.deleteAllRows();

                                        view.cbMoneda.clearValue();
                                        view.cbTipocuenta.clearValue();
                                        view.cbTipocuenta.focus(true, true);

                                        view.gpCtabancaria.getStore().reload();
                                        mostrarMensaje(1, idioma.lbMsgExitoAdd);
                                    }
                                    view.cbSucursalbanc.setDisabled(true);
                                    view.btnModificar.disable();
                                    view.btnEliminar.disable();
                                    break;
                                case 3:
                                    mostrarMensaje(3, responseData.mensaje);
                                    break;
                                case 4:
                                    mostrarMensaje(1, idioma.lbMsgInfNombrerepetido);
                                    break;
                                case 5:
                                    mostrarMensaje(1, idioma.lbMsgInfNoctarepetido);
                                    break;
                                case 6:
                                    mostrarMensaje(1, idioma.lbMsgInfTipoctainexistente);
                                    model.stTipocuenta.reload({
                                        callback: function(r, options, success) {
                                            if (!model.stTipocuenta.getCount()) {
                                                view.winCtabancaria.hide();
                                                view.fpCtabancaria.getForm().reset();
                                                model.stSucursalbanc.removeAll();
                                                view.btnModificar.disable();
                                                view.btnEliminar.disable();
                                                view.gpCtabancaria.getStore().reload();
                                            } else {
                                                view.cbTipocuenta.markInvalid(idioma.lbMsgReq);
                                            }
                                        }
                                    });
                                    view.cbTipocuenta.clearValue();
                                    break;
                                case 8:
                                    if (arrCtacontable.length == 1)
                                        mostrarMensaje(1, idioma.lbMsgInfCtaCtableAsociada);
                                    else
                                        mostrarMensaje(1, idioma.lbMsgInfCtasCtablesAsociadas);
                                    break;
                                default:
                                    mostrarMensaje(3, idioma.lbMsgOtrosErrores);
                            }
                        }
                    });
                }
            }
            else {
                view.cbTipocuenta.focus(true, true);
                mostrarMensaje(1, idioma.lbMsgCamposVacios);
                if (model.stSucursalbanc.getCount() && !view.cbSucursalbanc.getValue())
                    view.cbSucursalbanc.markInvalid(idioma.lbMsgReq);
                if (view.tfSaldactualBanco.getValue() == '0.00')
                    view.tfSaldactualBanco.markInvalid(idioma.lbMsgSaldoActualcero);
                if (view.tfSaldiniBanco.getValue() == '0.00')
                    view.tfSaldiniBanco.markInvalid(idioma.lbMsgSaldoInicialcero);
            }
        };

        //modificar la cta bancaria
        this.modCtaBancaria = function() {
            if (controller.verificarCambio()) {
                var flag = true;
                if ((model.stSucursalbanc.getCount() && !view.cbSucursalbanc.getValue())/* || (view.tfSaldactualBanco.getValue() == 0.00) || (view.tfSaldiniBanco.getValue() == 0.00)*/) {
                    flag = false;
                }
                //falta condicion para sobregiro bancario aqui  abre llave
                if (view.fpCtabancaria.getForm().isValid() && flag) {
                    if (view.grideditorCuentasContables.getStore().getCount() === 0) {
                        mostrarMensaje(1, idioma.lbMsgSeleccionarCtactable);
                    } else {
                        controller.loadMessageBox(idioma.lbMsgGuardando);

                        //Se obtiene el arreglo de cuentas que se cargo para la cuenta bancaria antes de modificar
                        var arrcuentasloaded = controller.getArrIdCuentas(controller.arrcuentasloaded);
                        //Se obtiene el arrglo de cuentas que se modificó para poder modificar la cuenta bancaria
                        var arrcuentasupdated = controller.getArrIdCuentas(view.grideditorCuentasContables.getStore().getRange());

                        var idcuentaseli = arrcuentasloaded.diff(arrcuentasupdated);
                        var idcuentasmod = arrcuentasupdated.diff(arrcuentasloaded);

                        //obtiene elementos del store en unidades contables
                        var ucinicial = new Array();
                        var cant = model.stUnidadcontable.getCount();
                        if (cant > 0) {
                            for (i = 0; i < cant; i++) {
                                if (model.stUnidadcontable.getAt(i).data.marcado == true) {
                                    ucinicial.push(model.stUnidadcontable.getAt(i).data.idestructura);
                                }
                            }
                        }

                        //obtiene elementos del grid en unidades contables
                        var arreglomandar = view.gpUnidadcontable.getSelectionModel().getSelections();
                        var uc = new Array(); //unidad contable
                        for (var i = 0; i < arreglomandar.length; i++) {
                            uc.push(arreglomandar[i].data.idestructura);
                        }

                        var idmoneda = view.cbMoneda.getValue();
                        var store = view.cbMoneda.store;
                        var index = store.find('idmoneda', idmoneda);
                        var objmoneda = store.getAt(index).data;

                        Ext.Ajax.request({
                            url: 'modificarCuentaBancaria',
                            method: 'POST',
                            params: {
                                idcuentabancaria: view.gpCtabancaria.getSelectionModel().getSelected().data.idcuentabancaria,
                                idtipocuenta: view.cbTipocuenta.getValue(),
                                nrocuenta: view.tfNctabancaria.getValue(),
                                nombrecuentabancaria: view.tfNombre.getValue(),
                                idbanco: view.cbBanco.getValue(),
                                fechaapertura: view.dfApertura.getRawValue(),
                                idmoneda: objmoneda.idmoneda,
                                idtasa: objmoneda.idtasa,
                                saldoinicial: (view.tfSaldiniLibro.getValue()) ? parseFloat(cleanComa(view.tfSaldiniLibro.getValue())) : 0, // El saldo de la cuenta contable
                                saldoinicialbanco: (view.tfSaldiniBanco.getValue()) ? parseFloat(cleanComa(view.tfSaldiniBanco.getValue())) : 0, // Saldo inicial de la cuenta bancaria
                                saldoenbanco: (view.tfSaldactualBanco.getValue()) ? parseFloat(cleanComa(view.tfSaldactualBanco.getValue())) : 0, // Saldo actual de la cuenta bancaria = inicial al principio
                                idsucursal: view.cbSucursalbanc.getValue(),
                                idctascontadd: Ext.encode(idcuentasmod),
                                idctascontdel: Ext.encode(idcuentaseli), //para cta contables
                                estructurasadd: Ext.encode(uc),
                                estructurasdel: Ext.encode(ucinicial), //para unidades contables
                                saldolibro: (view.tfSaldLibro.getValue()) ? parseFloat(cleanComa(view.tfSaldLibro.getValue())) : 0, //Saldo de la cuenta contable
                                permitirsobregiro: view.chkbSobregiro.getValue() ?  1 : 0

                                        //datos del  sobregiro bancario
                                        /*
                                         chequeado: controller.verchequeado(),//**ver lo  de formulario  sobregitro  en la view.
                                         idcuentasg: view.cbCtacontableSG.getValue(),
                                         fechainicio: view.dfFechaInicioSG.getRawValue(),
                                         fechafin:  view.dfFechaFinSG.getRawValue(),
                                         limite: view.tfLimiteSG.getValue(),
                                         contrato:  view.tfContratoSG.getValue(),
                                         idsobregirobanc: view.gpCtabancaria.getSelectionModel().getSelected().data.idsobregirobanc//pero  si  hay sobregiro*/

                            },
                            callback: function(options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                Ext.MessageBox.hide();
                                switch (responseData.n_codMsg) {
                                    case 1:
                                        view.gpCtabancaria.getStore().reload();
                                        mostrarMensaje(1, idioma.lbMsgExitoMod);
                                        view.winCtabancaria.hide();
                                        view.fpCtabancaria.getForm().reset();
                                        view.btnModificar.disable();
                                        view.btnEliminar.disable();
                                        break;
                                    case 3:
                                        mostrarMensaje(3, responseData.mensaje);
                                        break;
                                    case 4:
                                        mostrarMensaje(1, idioma.lbMsgInfNoctarepetidoMod);
                                        break;
                                    case 5:
                                        mostrarMensaje(1, idioma.lbMsgInfNombrerepetidoMod);
                                        break;
                                    case 6:
                                        mostrarMensaje(1, idioma.lbMsgInfTipoctainexistente);
                                        model.stTipocuenta.load({
                                            callback: function(r, options, success) {
                                                view.cbTipocuenta.setValue(view.gpCtabancaria.getSelectionModel.getSelected().data.idtipocuentabancaria);
                                            }
                                        });
                                        break;
                                    case 7:
                                        mostrarMensaje(1, idioma.lbConfCtaB);
                                        view.winCtabancaria.hide();
                                        break;
                                    case 8:
                                        if (cc.length == 1)
                                            mostrarMensaje(1, idioma.lbMsgInfCtaCtableAsociada);
                                        else
                                            mostrarMensaje(1, idioma.lbMsgInfCtasCtablesAsociadas);
                                        break;
                                    default:
                                        mostrarMensaje(3, idioma.lbMsgOtrosErrores + responseData.mensaje);
                                }
                            }
                        });
                    }
                } else {
                    view.cbTipocuenta.focus(true, true);
                    mostrarMensaje(1, idioma.lbMsgCamposVacios);
                    if (model.stSucursalbanc.getCount() && !view.cbSucursalbanc.getValue()) {
                        view.cbSucursalbanc.markInvalid(idioma.lbMsgReq);
                    }
                    if (view.tfSaldactualBanco.getValue() == '0.00')
                        view.tfSaldactualBanco.markInvalid(idioma.lbMsgSaldoActualcero);
                    if (view.tfSaldiniBanco.getValue() == '0.00')
                        view.tfSaldiniBanco.markInvalid(idioma.lbMsgSaldoIniciocero);
                }
                //falta condicion para sobregiro  bancario aqui  cerrar llave
            }
        };

        //Función necesaria para sacr los id cuentas de un arreglo de objetos
        this.getArrIdCuentas = function(arrobj) {
            var cant = arrobj.length;
            var result = new Array();
            for (var i = 0; i < cant; i++) {
                if (arrobj[i].data) {
                    result.push(arrobj[i].data.idcuenta);
                }
                else {
                    result.push(arrobj[i].idcuenta);
                }
            }
            return result;
        };

//        verifica si  hay  cambios en los campos del  formulario
        this.verificarCambio = function() {
            if (view.cbTipocuenta.getValue() != view.gpCtabancaria.getSelectionModel().getSelected().data.idtipocuentabancaria) {
                return true;
            } else if (view.tfNctabancaria.getValue() != view.gpCtabancaria.getSelectionModel().getSelected().data.nrocuenta) {
                return true;
            } else if (view.dfApertura.getRawValue() != view.gpCtabancaria.getSelectionModel().getSelected().data.fechaapertura) {
                return true;
            } else if (view.cbMoneda.getValue() != view.gpCtabancaria.getSelectionModel().getSelected().data.idmoneda) {
                return true;
            } else if (view.tfNombre.getValue() != view.gpCtabancaria.getSelectionModel().getSelected().data.nombrecuentabancaria) {
                return true;
            } else if (parseFloat(cleanComa(view.tfSaldiniBanco.getValue())) != parseFloat(view.gpCtabancaria.getSelectionModel().getSelected().data.saldoinicialbancomo)) {
                return true;
            } else if (parseFloat(cleanComa(view.tfSaldactualBanco.getValue())) != parseFloat(view.gpCtabancaria.getSelectionModel().getSelected().data.saldoenbancomo)) {
                return true;
            } else if (view.cbBanco.getValue() != view.gpCtabancaria.getSelectionModel().getSelected().data.idbanco) {
                return true;
            } else if (view.cbSucursalbanc.getValue() != view.gpCtabancaria.getSelectionModel().getSelected().data.idsucursal) {
                return true;
            } else if (view.chkbSobregiro.getValue() != view.gpCtabancaria.getSelectionModel().getSelected().data.permitirsobregiro) {
                return true;
            }

            //Se obtiene el arreglo de cuentas que se cargo para la cuenta bancaria antes de modificar
            var arrcuentasloaded = controller.getArrIdCuentas(controller.arrcuentasloaded);
            //Se obtiene el arrglo de cuentas que se modificó para poder modificar la cuenta bancaria
            var arrcuentasupdated = controller.getArrIdCuentas(view.grideditorCuentasContables.getStore().getRange());

            var arrcuentasloadedeli = arrcuentasloaded.diff(arrcuentasupdated);
            var arrgridctactblemodified = arrcuentasupdated.diff(arrcuentasloaded);

            if (arrgridctactblemodified.length > 0 || arrcuentasloadedeli.length > 0) {
                return true;
            }

            // verifica si  hay  diferencias en el  tab Unidadcontable comparando  valores del  st con los del  grid
            var arrstunidadctble = controller.findMarcadosUnidCont(model.stUnidadcontable); //obtiene elementos del  store
            var arrgridunidadctble = controller.findElementsGridUnidCont(); //obtiene elementos seleccionados en el  grid

            // verifica si  hay  modificaciones en el  tab  unidad contable
            var valud = controller.obtenerDiferencias(arrstunidadctble, arrgridunidadctble);
            var resultanteunidadctble = new Array();
            if (valud.length > 0) {
                for (i = 0; i < valud.length; i++) {
                    if (valud[i] > 0)
                        resultanteunidadctble.push(valud[i]);
                }
                if (resultanteunidadctble.length > 0) {
                    return true;
                }
            }

            view.cbTipocuenta.focus(true, true);
            mostrarMensaje(1, idioma.lbMsgCampossinMod);
            return false;
        };
        //muestra msg question eliminar
        this.showMsgEliminar = function() {
            if (view.gpCtabancaria.getSelectionModel().getSelected().data.idlog == view.gpCtabancaria.getSelectionModel().getSelected().data.idestructuracomun) {
                view.windowopen = true; //   esta abierta la ventana
                Ext.Msg.show({
//title : 'Confirmaci&oacute;n',
                    title: idioma.lbMsgTitleConf,
                    buttons: Ext.Msg.OKCANCEL,
                    msg: String.fromCharCode(191) + idioma.lbMsgEliminar,
                    icon: Ext.MessageBox.QUESTION,
                    fn: function(btn) {
                        if (btn == 'ok') {
                            controller.delCtaBancaria();
                        } else {
                            view.windowopen = false; //  no esta abierta la ventana
                        }
                    }
                });
            } else {
                view.btnModificar.disable();
                mostrarMensaje('1', idioma.lbMsgNoEliminar);
            }
        };
        //elimina la cta bancaria seleccionada
        this.delCtaBancaria = function() {
            controller.loadMessageBox(idioma.lbMsgTextElim);
            Ext.Ajax.request({
                url: 'eliminarCuentaBancaria',
                params: {
                    idcuentabancaria: view.gpCtabancaria.getSelectionModel().getSelected().data.idcuentabancaria
                },
                callback: function(options, success, response) {
                    Ext.MessageBox.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData) {
                        switch (responseData) {
                            case 1 : //se elimino bien
                                view.gpCtabancaria.getStore().reload();
                                controller.limpiarTab();
                                view.lbDispEfectivo.setText(idioma.lbDispEfectivo);
                                view.btnModificar.disable();
                                view.btnEliminar.disable();

                                view.windowopen = false;
                                mostrarMensaje(1, idioma.lbMsgExitoElim);
                                break;
                            case 2 : //operaciones asociadas
                                view.windowopen = false;
                                mostrarMensaje(1, idioma.lbMsgInfNoEliminarporAsociacionO);
                                break;
                            case 3 :  //talonarios asociados
                                view.windowopen = false;
                                mostrarMensaje(1, idioma.lbMsgInfNoEliminarporAsociacionT);
                                break;
                            case 4 :
                                view.windowopen = false;
                                mostrarMensaje(1, idioma.lbMsgInfNoEliminarporAsociacionEC);
                                break;
                            case 5 :  //conciliaciones asociadas
                                view.windowopen = false;
                                mostrarMensaje(1, idioma.lbMsgInfNoEliminarporAsociacionC);
                                break;
                            case 6 :
                                view.windowopen = false;
                                mostrarMensaje(1, idioma.msgDepositosAsociados);
                                break;
                            case 7 :
                                view.windowopen = false;
                                mostrarMensaje(1, idioma.msgFacturasAsociados);
                                break;
                            default:
                                view.windowopen = false;
                                mostrarMensaje(3, idioma.lbMsgOtrosErrores);
                                break;
                        }
                    }
                }
            });
        };
        this.obtenerIDCtascontables = function() {
            var cuentascontables = view.gpCtabancaria.getSelectionModel().getSelected().data.cuentascontables;
            var idctascont = new Array();
            for (var i in cuentascontables)
                idctascont.push(cuentascontables[i]['idcuentacontable']);
            return idctascont;
        };
        // verifica si  hay  diferencias entre los dos arreglos
        this.obtenerDiferencias = function(arr1, arr2) {
            var val = (arr1.length > arr2.length) ? array_diff(arr1, arr2) : array_diff(arr2, arr1);
            var resultante = new Array();
            if (val.length > 0) {
                for (i = 0; i < val.length; i++) {
                    if (val[i] > 0) {
                        resultante.push(val[i]);
                    }
                }
            }
            return resultante;
        };
        // obtiene los elementos seleccionados del store unidades contables(para los  store del  tab )
        this.findMarcadosUnidCont = function(st) {
            var devolver = new Array();
            if (st.getCount() > 0) {
                for (i = 0; i < st.getCount(); i++) {
                    if (st.getAt(i).data.marcado == true) {
                        devolver.push(st.getAt(i).data.idestructura);
                    }
                }
            }
            return devolver;
        };
        //obtiene los  elementos marcados en el  grid Cta contable del  tabpanel
        this.findElementsGridCtaCont = function() {
            var temp = view.grideditorCuentasContables.getStore().getModifiedRecords();
            var arrgridctactble = new Array();
            var cantcuentas = temp.length;
            for (var i = 0; i < cantcuentas; i++) {
                arrgridctactble.push(temp[i].data.idcuenta);
            }
            return arrgridctactble;
        };
        //obtiene los  elementos marcados en el  grid unidad contable del  tabpanel
        this.findElementsGridUnidCont = function() {
            var temp = view.gpUnidadcontable.getSelectionModel().getSelections();
            var arrgridunidadctble = new Array();
            for (i = 0; i < temp.length; i++) {
                arrgridunidadctble.push(temp[i].data.idestructura);
            }
            return arrgridunidadctble;
        };
        //limpia el  tab de la ventana principal luego de eliminar una cuenta bancaria
        this.limpiarTab = function() {
            var array = new Array();
            model.stOperaciones.loadData({
                'cant': 0,
                'datos': array
            });
            model.stEstadocta.loadData({
                'cant': 0,
                'datos': array
            });
            model.stUnidadesusuarias.loadData({
                'cant': 0,
                'datos': array
            });
        };
        //selecciona el primer elemento del combo en caso de ser solo uno
        this.cargarUnicovalor = function(store, combox, valor) {
            if (store.getCount() == 1) {
                combox.setValue(store.getAt(0).get(valor));
            }
        };
        //selecciona las filas de un grid dado el grid y su store
        this.selectRows = function(gp) {
            if (gp.getStore().getCount() != 0) {
                var records = new Array();
                var cant = gp.getStore().getCount();
                for (var i = 0; i < cant; i++) {
                    if (gp.getStore().getAt(i).data.marcado == true) {
                        records.push(i);
                    }
                }
                gp.getSelectionModel().selectRows(records);
            }
        };
        // FLUJO  DEL  BOTON Ver detalles de selección  EN VENTANA PRINCIPAL
        //Se obtienen los datos necsarios para configurar el preView
        this.configurarPreView = function() {
            var arreglocant = view.gpCtabancaria.getSelectionModel().getSelections();
            var preview = new Array();
            if (arreglocant.length > 0) {
                for (var i = 0; i < arreglocant.length; i++) {
                    preview.push([
                        {
                            'entidad': arreglocant[i].data.entidad
                        }, // 0
                        {
                            'periodo': arreglocant[i].data.periodo
                        }, // 1
                        {
                            'numero': arreglocant[i].data.nrocuenta
                        }, // 2
                        {
                            'nombre': arreglocant[i].data.nombrecuentabancaria
                        }, // 3
                        {
                            'tipocuenta': arreglocant[i].data.nombretipocuentabancaria
                        }, // 4
                        {
                            'cuentascontables': arreglocant[i].data.cuentascontables
                        }, // 5
                        {
                            'saldoinicial': saldo(arreglocant[i].data.saldoinicialbancomo)
                        }, // 6
                        {
                            'moneda': arreglocant[i].data.nombremoneda
                        }, // 7
                        {
                            'banco': arreglocant[i].data.nombrebanco
                        }, // 8
                        {
                            'sucursal': arreglocant[i].data.nombreidsucursal
                        }, // 9
                        {
                            'unidContables': arreglocant[i].data.unidadcontable
                        }//10
                        /*,
                         {
                         'sobregiro':arreglocant[i].data.sobregiro
                         },// 10
                         {
                         'cuentasg':arreglocant[i].data.idcuentasg
                         },// 11
                         {
                         'contratosg':arreglocant[i].data.contrato
                         },// 12
                         {
                         'limitesg':arreglocant[i].data.limite
                         }// 13*/
                    ]);
                }

//configuramos la informacion Html que queremos mostrar
                controller.HTMlConfigPreView(preview);
            } else {
                mostrarMensaje(1, idioma.lbMsgVersinSeleccion);
            }
        };
        //Se configura la informacion Html que se va a mostrar
        this.HTMlConfigPreView = function(previewHTML) {
            var infoHTML = '';
            //var final_fila = '</p></div>';
            //var inicio_fila = '<div  style="font-size: 10pt"><p>&nbsp;&nbsp;';
            var espacios = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            for (var i = 0; i < previewHTML.length; i++) {
                infoHTML += '<div style="padding:10px; background:#E7F1FE"; "font-size: 14px";><p><b>'
                        + idioma.lbhtmlperiodo + previewHTML[i][1]['periodo'] + "&nbsp;&nbsp;&nbsp;&nbsp;"
                        + idioma.lbhtmlentidad + previewHTML[i][0]['entidad'] + "&nbsp;&nbsp;&nbsp;&nbsp;"
                        + '</b></p></div>';
                infoHTML += '<div style="padding:11px;background:#F1F1F1";"font-size: 11pt";><p><b>'
                        + idioma.lbhtmlTitleDatos + '</b></p></div>';
                infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- " + idioma.lbhtmlDatosNumero + previewHTML[i][2]['numero'] + '</p></div>';
                infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- " + idioma.lbhtmlDatosNombre + previewHTML[i][3]['nombre'] + '</p></div>';
                infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- " + idioma.lbhtmlDatosTipo + previewHTML[i][4]['tipocuenta'] + '</p></div>';
                infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- " + idioma.lbhtmlDatosSaldoInicial + previewHTML[i][6]['saldoinicial'] + '</p></div>';
                infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- " + idioma.lbhtmlDatosMoneda + previewHTML[i][7]['moneda'] + '</p></div>';
                infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- " + idioma.lbhtmlDatosBanco + previewHTML[i][8]['banco'] + '</p></div>';
                if (previewHTML[i][9]['sucursal'])
                    infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- " + idioma.lbhtmlDatosSucursal + previewHTML[i][9]['sucursal'] + '</p></div>';
                infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- " + idioma.lbhtmlDatosCtaCtable + '</p></div>';
                for (var j = 0; j < previewHTML[i][5]['cuentascontables'].length; j++)
                    infoHTML += '<div  style="font-size: 10pt"><p>' + espacios + previewHTML[i][5]['cuentascontables'][j]['nombrecuentacontable'] + '</p></div>';
                if (previewHTML[i][10]['unidContables']) {
                    infoHTML += '<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- " + idioma.lbhtmlDatosUnidContable + '</p></div>';
                    for (var j = 0; j < previewHTML[i][10]['unidContables'].length; j++)
                        infoHTML += '<div  style="font-size: 10pt"><p>' + espacios + previewHTML[i][10]['unidContables'][j]['denominacion'] + '</p></div>';
                }
                /*
                 if(previewHTML[i][10]['sobregiro'] == 1 ){
                 var mo = model.stCtacontableSG.find('idcuentasg',previewHTML[i][11]['cuentasg']);
                 if(mo > -1){
                 var temp = model.stCtacontableSG.getAt(mo).get('nombrecuenta');
                 }
                 //para separar la informacion del sobregiro
                 infoHTML += '<div  style="font-size: 7pt"><p>' + "&nbsp;" + final_fila;


                 //infoHTML += inicio_fila +"-<b>Datos del sobregiro asociado: </b>"+ final_fila;
                 infoHTML += inicio_fila +'<div  style="font-size: 10pt"><p>' + "&nbsp;&nbsp;- " + idioma.lbhtmlTitleSG + '</p></div>'+ final_fila;

                 infoHTML +=inicio_fila + espacios + idioma.lbhtmlCtableSobregiro + temp + '</p></div>';
                 infoHTML +=inicio_fila + espacios + idioma.lbhtmlContratoSobregiro + previewHTML[i][12]['contratosg'] + '</p></div>';
                 infoHTML +=inicio_fila + espacios +  idioma.lbhtmlLimiteSobregiro+ previewHTML[i][13]['limitesg'] + '</p></div>'+ final_fila;

                 }*/
            }
            view.pPreView.html = infoHTML; //se pasa la informacion a mostrar Html
            view.winVerdetalles.show();
            view.winVerdetalles.center();
            var templaterep = new Ext.XTemplate(infoHTML);
            templaterep.overwrite(view.pPreView.body, {});
        };
        this.deshabilitarCampos = function() {
//fecha apertura, moneda, saldos,grid ctas contables
            view.dfApertura.setDisabled(true);
//            view.cbMoneda.setDisabled(true);
            view.tfSaldiniBanco.setDisabled(true);
            view.cbTipocuenta.setDisabled(true);
            view.tfNctabancaria.setDisabled(true);
            view.tfNombre.setDisabled(true);
//            view.grideditorCuentasContables.setDisabled(true);
        };
        this.habilitarCampos = function() {
//fecha apertura, moneda, saldos,grid ctas contables
            view.dfApertura.setDisabled(false);
//            view.cbMoneda.setDisabled(false);
            view.tfSaldiniBanco.setDisabled(false);
            view.cbTipocuenta.setDisabled(false);
            view.tfNctabancaria.setDisabled(false);
            view.tfNombre.setDisabled(false);
//            view.grideditorCuentasContables.setDisabled(false);
        };
        //barra de progreso
        this.loadMessageBox = function(msg) {
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
                    Ext.MessageBox.updateProgress(i);
                };
            };
            for (var i = 1; i < 12; i++)
                setTimeout(f(i), i * 500);
        };
        //muestra la mascara segun el msg
        this.MostrarMensaje = function(mensaje) {
            loadMask = new Ext.LoadMask(Ext.getBody(), {
                msg: mensaje
            });
            loadMask.show();
        };

        this.abrirCuentaBancaria = function (idcuentabancaria) {
            this.loadMessageBox('Abriendo...');
            Ext.Ajax.request({
                method: "POST",
                url: "abrirCuentaBancaria",
                params: {
                    idcuentabancaria: idcuentabancaria
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    Ext.Msg.hide();
                    if (responseData.codmsg == 1) {
                        mostrarMensaje(1, 'La cuenta a sido abierta satisfactoriamente.');
                        model.stCtabancaria.reload();

                    } else {
                        mostrarMensaje(1, 'La cuenta no se pudo abrir.');
                    }
                }
            });
        };

        this.cerrarCuentaBancaria = function (idcuentabancaria) {
            this.loadMessageBox('Cerrando...');
            Ext.Ajax.request({
                method: "POST",
                url: "cerrarCuentaBancaria",
                params: {
                    idcuentabancaria: idcuentabancaria
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    Ext.Msg.hide();
                    if (responseData.codmsg == 1) {
                        mostrarMensaje(1, 'La cuenta a sido cerrada satisfactoriamente.');
                        model.stCtabancaria.reload();

                    } else {
                        mostrarMensaje(1, 'La cuenta no se pudo cerrar.');
                    }
                }
            });
        };
    }
};
