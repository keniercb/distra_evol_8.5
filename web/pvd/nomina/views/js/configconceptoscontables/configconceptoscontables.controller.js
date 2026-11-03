Ext.ns('Pvd.Nomina.Configuracion.ConceptosContables');

//Controlador de la vista del componente Configurar conceptos contables.
Pvd.Nomina.Configuracion.ConceptosContables.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Configurar modelo nomina (Tipo: Pvd.Nomina.Configuracion.ConceptosContables.Vista)
     * @param modelo Modelo de la vista del componente Configurar modelo nomina (Tipo: Pvd.Nomina.Configuracion.ConceptosContables.Modelo)
     */
    init: function (idioma, vista, modelo) {
        this.nodosseleccionados = new Array();
        /**
         *Variables generales.
         */
        var variables = {
            cambio: 0,
            accion: 'ADD',
            idconceptoscontables: 0,
            contador: 0,
            idestructuramodelodomina: 0,
            denominacionestructuranomina: 0,
            aceptar: 0,
            identidad: null,
            idtiponomina: null,
            nodosseleccionados: new Array()
        };

        modelo.storeParrafoFiscal.load();

        vista.pobjestructura.on('estructuraselecionada', function (sm, nodo) {
            //if (nodo.attributes.tipoestructura == 3) {
            vista.btnAceptarEntidad.enable();
            variables.identidad = nodo.id;
            //}
        }.createDelegate(this));

        vista.btnAceptarEntidad.setHandler(function () {
            modelo.storeConceptosContables.removeAll();
            vista.winMostrarConceptosContables.show();
            //Cargando los datos de los tipos de nominas
            modelo.storeTiponomina.load();
            //Cargando los datos de la configuracion
            modelo.storeConceptosContables.load({params: {idestructura: variables.identidad, start:0, limit: 1000}});
        });

        modelo.storeConceptosContables.on('beforeload', function(){
            modelo.storeConceptosContables.baseParams.idestructura = variables.identidad;
        });

        //Evento del btn add
        vista.btnAdicionarConceptosContables.setHandler(function () {
            mostrarVentanaAdicionarConceptosContables();
        });

        //Evento del btn mod
        vista.btnModificarConceptosContables.setHandler(function () {
            if (vista.gpConceptosContables.getSelectionModel().hasSelection()) {
                mostrarVentanaModificarConceptosContables();
            } else {
                mostrarMensaje(3, 'Debe seleccionar un concepto contable');
            }

        });

        //Evento del btn mod
        vista.btnEliminarConceptosContables.setHandler(function () {
            if (vista.gpConceptosContables.getSelectionModel().hasSelection()) {
                var cont = 0;
                var arridcc = new Array();
                records = vista.gpConceptosContables.getSelectionModel().getSelections();
                for (var i = 0; i < records.length; i++) {
                    arridcc[cont] = records[i].data.idconceptoscontables;
                    cont++;
                }
                eliminarDatosConceptosContables(arridcc);
            } else {
                mostrarMensaje(3, 'Debe seleccionar un concepto contable');
            }
        });

        //Evento del btn para asociar los conceptos contables
        vista.btnElementosGasto.on('click', function () {
            //modelo.storeElementosdelGasto.load();
            vista.ventanaElementosdelGasto.show();
        });

        vista.btnSync.on('click', function () {
            sincronizarConceptosContablesDuplicadosEstructura();
        });

        vista.btnSyncValoresContables.on('click', function () {
            sincronizarValoresContables();
        });

        //Eventos de campo de denominacion.
        vista.tfDenomConceptosContables.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        //Eventos de campo de denominacion.
        vista.tfObligacion.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        //Eventos de campo de tipo nomina.
        vista.cbTipoNomina.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        vista.cbParrafoFiscal.on('change', function(){
            variables.cambio = 1;
        });

        vista.cbClienteProvCobrosPagos.on('change', function(){
            variables.cambio = 1;
        });

        vista.cbCobrosPagos.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        vista.cbTipoOperacionCobrosPagos.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        vista.cbTipoSustitucionCobrosPagos.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        vista.cbCobrosPagos.on('select', function (combo, n, o) {
            var cobrosypagos = n.data.idtienecobrospagos;
            //Si se integra con el modulo de cobros y pagos
            if(cobrosypagos == 1){
                vista.cbTipoOperacionCobrosPagos.enable();
            }else{
                vista.cbTipoOperacionCobrosPagos.setValue(null);
                vista.cbTipoOperacionCobrosPagos.disable();
                vista.cbTipoSustitucionCobrosPagos.setValue(null);
                vista.cbTipoSustitucionCobrosPagos.disable();
                vista.cbParrafoFiscal.setValue(null);
                vista.cbParrafoFiscal.disable();
                vista.cbClienteProvCobrosPagos.setValue(null);
                vista.cbClienteProvCobrosPagos.disable();
                vista.cuentacontable.setValue(null);
                vista.cbxcuenta.setValue(null);
                vista.cbxcuenta.disable();
            }
        });

        vista.cbTipoOperacionCobrosPagos.on('select', function (combo, n, o) {
            vista.cbTipoSustitucionCobrosPagos.enable();
        });

        vista.cbTipoSustitucionCobrosPagos.on('select', function (combo, n, o) {
            var idtipointegracioncobrospagos = n.data.idtipointegracioncobrospagos;
            //Si es una sustitucion global
            if(idtipointegracioncobrospagos == 2){
                vista.cbxcuenta.disable();
                vista.cbParrafoFiscal.enable();
                vista.cbxcuenta.setValue(null);
            //Por personas
            }else{
                vista.cbxcuenta.enable();
                vista.cbParrafoFiscal.disable();
                vista.cbParrafoFiscal.setValue(null);
                vista.cbClienteProvCobrosPagos.setValue(null);
            }
        });

        vista.cbxcuenta.on(
            {
                scope: this,

                select: function (combo, record, rowIndex) {
                    // var recordCmb = vista.cmbtipocta.store.getAt(vista.cmbtipocta.store.find('tipocuenta', vista.cmbtipocta.getValue()));
                    vista.cbxcuenta.tipocta = 2;
                    vista.cuentacontable.setValue(record.data.idcuenta);
                },
                expand: function () {
                    /*var recordGrid = this.gridAsiento.getStore().getAt(this.gridAsiento.rowEditing);*/
                    //   modelo.stcuenta.load({ baseParams: { tipocta: 2,  idsubsistema:71 }});
                    var tree = vista.cbxcuenta.tree;
                    if (Ext.isEmpty(vista.cbxcuenta.getValue())) {
                        tree.getSelectionModel().clearSelections();
                    } else {
                        tree.getSelectionModel().select(tree.getNodeById(vista.cbxcuenta.getValue()));
                    }
                }
            }
        );

        vista.cbxcuenta.tree.getLoader().on(
            {
                beforeload: function () {
                    //Antes de realizar cualquier peticion se verifica si
                    //actulamente el treeLoader está realizando una petición,
                    //y casi simultaneamente se realizó otra, en ese caso
                    //se aborta la petición anterior y se continua con la última
                    //realizada.
                    //  modelo.stcuenta.load({Params: { tipocta: 2,  idsubsistema:71 }});
                    if (this.isLoading()) {
                        Ext.Ajax.abort(this.transId);
                    }
                }
            }
        );

        vista.cbxcuenta.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        vista.cbxcuenta.tree.getLoader().on(
            {
                beforeload: function () {
                    //Antes de realizar cualquier peticion se verifica si
                    //actulamente el treeLoader está realizando una petición,
                    //y casi simultaneamente se realizó otra, en ese caso
                    //se aborta la petición anterior y se continua con la última
                    //realizada.
                    //  modelo.stcuenta.load({Params: { tipocta: 2,  idsubsistema:71 }});
                    if (this.isLoading()) {
                        Ext.Ajax.abort(this.transId);
                    }
                }
            }
        );

        //Eventos de campo
        vista.cbMostrarDescuento.on('check', function (tf, n, o) {
            variables.cambio = 1;
        });

        vista.cbParrafoFiscal.on('select', function(combo, n, o){
            var idparrafofiscal =  n.data.idparrafofiscal;
            modelo.storeClienteProvCobrosPagos.load({params:{idparrafofiscal:idparrafofiscal}});
            vista.cbClienteProvCobrosPagos.enable();
        });

        vista.cbTipoNomina.on('select', function (cb, record, index) {
            variables.idtiponomina = record.data.idtiponomina;
            vista.cbCampoLiquidarObligacion.setValue(null);
            vista.cbEstructuraNomina.setValue(null);
            modelo.storeEstructuraNomina.load({
                params: {
                    idestructura: variables.identidad,
                    idtiponomina: variables.idtiponomina
                }
            });
            modelo.storeCampoLiquidarObligacion.load({
                params: {
                    idestructura: variables.identidad,
                    idtiponomina: variables.idtiponomina
                }
            });
        });

        //Eventos de campo de estructura de la nomina.
        vista.cbEstructuraNomina.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        //Eventos de campo de finicio.
        vista.dfFInicioConceptosContables.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        //Eventos de campo de ffin.
        vista.dfFFinConceptosContables.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        //Eventos de campo de descripcion.
        vista.tfDescripConceptosContables.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        //Evento del btn cancelar
        vista.btnCancelarConceptosContables.setHandler(function () {

            vista.ventanaConceptosContables.hide();
            vista.formularioConceptosContables.getForm().reset();
            //vista.cbPartidagasto.reset();

        });

        vista.checkLiquidaObligacion.on('check', function (checkbox, checked) {
            if (checked == true) {
                vista.cbTipoOperacionCobrosPagos.disable();
                vista.cbTipoOperacionCobrosPagos.setValue(null);
                vista.cbTipoSustitucionCobrosPagos.disable();
                vista.cbTipoSustitucionCobrosPagos.setValue(null);
                vista.cbParrafoFiscal.disable();
                vista.cbParrafoFiscal.setValue(null);
                vista.cbClienteProvCobrosPagos.disable();
                vista.cbClienteProvCobrosPagos.setValue(null);
                vista.cuentacontable.disable();
                vista.cbxcuenta.disable();
                vista.cbxcuenta.setValue(null);
                vista.cbCobrosPagos.disable();
                vista.cbCobrosPagos.setValue(null);
                vista.cbCampoLiquidarObligacion.enable();
                modelo.storeCampoLiquidarObligacion.load({
                    params: {
                        idestructura: variables.identidad,
                        idtiponomina: variables.idtiponomina
                    }
                });
            }else{
                vista.cbCobrosPagos.enable();
                vista.cbCampoLiquidarObligacion.setValue(null);
                vista.cbCampoLiquidarObligacion.disable();
            }
            variables.cambio = 1;
        });

        //Evento del btn aceptar
        vista.btnAceptarConceptosContables.setHandler(function () {
            actualizarDatosConfiguracion(1);
        });

        vista.btnAplicarConceptosContables.setHandler(function () {
            actualizarDatosConfiguracion(0);
        });

        vista.smConceptosContables.on('rowselect', function (sm, index, record) {
            vista.btnreplicar.enable();
            variables.idconceptoscontables = record.data.idconceptoscontables;
            vista.btnModificarConceptosContables.enable();
            vista.btnEliminarConceptosContables.enable();
            vista.btnElementosGasto.enable();
        });

        //Cancelar elementos del gasto
        vista.btnCancelarElementosdelGasto.setHandler(function () {
            vista.ventanaElementosdelGasto.hide();
        });

        //Cancelar elementos del gasto
        vista.btnAceptarElementosdelGasto.setHandler(function () {
            asociarElementoGasto();
        });

        /*******************************Replicar conceptos contables**************************************/
        vista.pobjestructurareplicar.on('uncheckednode', function (sm, nodo) {
            if (nodo.attributes.id != this.identidad) {
                var index = variables.nodosseleccionados.indexOf(nodo.attributes.id);
                if (index > -1) {
                    variables.nodosseleccionados.splice(index, 1);
                }
            }
        }.createDelegate(this));

        vista.pobjestructurareplicar.on('checkednode', function (sm, nodo) {
            if (nodo.attributes.id != this.identidad) {
                vista.btnAceptarEntidadreplicar.enable();
                variables.nodosseleccionados.push(nodo.attributes.id);
            }
        }.createDelegate(this));


        /*vista.pobjestructurareplicar.on('estructuraselecionada', function (sm, nodo) {
         if (nodo.attributes.tipoestructura == 3) {
         vista.btnAceptarEntidadreplicar.enable();
         variables.nodosseleccionados.push(nodo.attributes.id);
         }
         }.createDelegate(this));*/

        vista.btnreplicar.setHandler(function () {
            vista.winEstructuraReplicar.show();
            //mostrarMensaje(3, 'Debe guardar la configuraci&oacute;n .');

        }.createDelegate(this));

        vista.btnAceptarEntidadreplicar.on('click', function () {
            if (variables.nodosseleccionados.length > 0) {
                //var id = vista.gpConceptosContables.getSelectionModel().getSelected().data.idconceptoscontables;
                var arridconceptoscontables = new Array();
                var datos = vista.gpConceptosContables.getSelectionModel().getSelections();
                Ext.each(datos, function (rec) {
                    arridconceptoscontables.push({
                        id: rec.get('idconceptoscontables'),
                        obligacion: rec.get('obligacion')
                    });
                });
                PVD.mostrarMascara('replicconc', 'Por favor espere...', 'Enviando datos');
                Ext.Ajax.request({
                    url: 'replicardatos',
                    method: 'POST',
                    params: {
                        arridconceptos: (datos.length > 0 ? Ext.encode(arridconceptoscontables) : null),
                        identidad: Ext.encode(variables.nodosseleccionados)
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('replicconc');
                        var respuesta = Ext.decode(response.responseText);
                        var msg = (respuesta['genero'] == 1) ? 'El concepto contable se adicion&oacute; satisfactoriamente.' :
                            'Los conceptos contables se adicionaron satisfactoriamente.';
                        if (respuesta.codigo == 'ADD-1') {
                            mostrarMensaje(1, msg);
                        }
                        vista.winEstructuraReplicar.hide();
                    }.createDelegate(this)
                });
            } else {
                mostrarMensaje(3, 'Por favor seleccione la(s) entidad(es) a la(s) que desea replicar la configuraci&oacute;n.');
            }
        });

        vista.btnBuscar.on('click', function () {
            modelo.storeConceptosContables.load({
                params: {
                    idestructura: variables.identidad,
                    start:0,
                    limit: 1000,
                    criterio: vista.tfbuscar.getValue()
                }
            });

        });

        /*******************************FIN REPLICAR********************************************/

        vista.winEstructura.show();

        function mostrarVentanaAdicionarConceptosContables() {
            variables.accion = 'ADD';
            // vista.cbPartidagasto.clearValue();
            vista.ventanaConceptosContables.setTitle('Adicionar conceptos contables');
            vista.ventanaConceptosContables.show();
            vista.cbCobrosPagos.setValue(2);
            vista.cbTipoOperacionCobrosPagos.disable();
            vista.cbTipoSustitucionCobrosPagos.disable();
            vista.cbParrafoFiscal.disable();
            vista.cbClienteProvCobrosPagos.disable();
            vista.cuentacontable.disable();
            vista.cbxcuenta.disable();
        }

        function mostrarVentanaModificarConceptosContables() {
            variables.accion = 'MOD';

            var liquidacobrosypagos = vista.gpConceptosContables.getSelectionModel().getSelected().get('liquidacobrosypagos');
            var idtienecobrospagos = vista.gpConceptosContables.getSelectionModel().getSelected().get('idtienecobrospagos');
            var idtipointegracioncobrospagos = vista.gpConceptosContables.getSelectionModel().getSelected().get('idtipointegracioncobrospagos');
            if(liquidacobrosypagos == 1){
                vista.cbCampoLiquidarObligacion.enable();
            }else{
                vista.cbCampoLiquidarObligacion.setValue(null);
                vista.cbCampoLiquidarObligacion.disable();
            }
            if(idtienecobrospagos == 1){
                vista.cbTipoOperacionCobrosPagos.enable();
                vista.cbTipoSustitucionCobrosPagos.enable();
                if(idtipointegracioncobrospagos == 1){
                    vista.cuentacontable.enable();
                    vista.cbxcuenta.enable();
                    vista.cbParrafoFiscal.disable();
                    vista.cbClienteProvCobrosPagos.disable();
                }else if(idtipointegracioncobrospagos == 2){
                    vista.cuentacontable.disable();
                    vista.cbxcuenta.disable();
                    vista.cbParrafoFiscal.enable();
                    vista.cbClienteProvCobrosPagos.enable();
                }
            }else{
                vista.cbTipoOperacionCobrosPagos.disable();
                vista.cbTipoSustitucionCobrosPagos.disable();
                vista.cbParrafoFiscal.disable();
                vista.cbClienteProvCobrosPagos.disable();
                vista.cuentacontable.disable();
                vista.cbxcuenta.disable();
                vista.cbCobrosPagos.setValue(2);

            }

            vista.ventanaConceptosContables.setTitle('Modificar conceptos contables');
            vista.ventanaConceptosContables.show();
            vista.btnAplicarConceptosContables.hide();
            vista.tfDenomConceptosContables.focus(true, 500);
            vista.formularioConceptosContables.getForm().loadRecord(vista.gpConceptosContables.getSelectionModel().getSelected());
            vista.cbEstructuraNomina.setValue(vista.gpConceptosContables.getSelectionModel().getSelected().get('idestructuramodelodomina'));
            vista.cbEstructuraNomina.setRawValue(vista.gpConceptosContables.getSelectionModel().getSelected().get('denominacionestructuranomina'));
            if (vista.gpConceptosContables.getSelectionModel().getSelected().get('mostrardescuento') == 1) {
                vista.cbMostrarDescuento.setValue(true);
            } else {
                vista.cbMostrarDescuento.setValue(false);
            }

            //vista.ventanaConceptosContables.maximize();
        }

        function asociarElementoGasto() {
            //Se muestra la máscara de espera.
            PVD.mostrarMascara('idmaskasocelemgasto', 'Por favor espere...', 'Enviando datos');
            vista.ventanaElementosdelGasto.hide();
            //Enviando datos al servidor.
            Ext.Ajax.request({
                url: 'asociarElementosGasto',
                method: 'POST',
                params: {
                    idconceptocontable: vista.gpConceptosContables.getSelectionModel().getSelected().get('idconceptoscontables'),
                    idelementogasto: vista.idelementosgasto,
                    idconceptcontabelemtgasto: vista.gpConceptosContables.getSelectionModel().getSelected().get('idconceptcontabelemtgasto')
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);

                    //Ocultando máscara de enviar datos.
                    PVD.ocultarMascara('idmaskasocelemgasto');
                    modelo.storeConceptosContables.load({params: {idestructura: variables.identidad, start:0,limit:1000}});
                }
            });
        }

        function sincronizarConceptosContablesDuplicadosEstructura(){
            //Se muestra la máscara de espera.
            PVD.mostrarMascara('idmasksync', 'Por favor espere...', 'Enviando datos');
            visible = (vista.cbMostrarDescuento.checked == true) ? 1 : 0;
            //Enviando datos al servidor.
            Ext.Ajax.request({
                url: 'sincronizarConceptosContables',
                method: 'POST',
                params: {
                    idestructura: variables.identidad
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    //Ocultando máscara de enviar datos.
                    PVD.ocultarMascara('idmasksync');
                    if(responseData == 'ok'){
                        mostrarMensaje(1, 'Los conceptos contables duplicados en la misma estructura fueron eliminados satisfactoriamente');
                    }
                }
            });
        }

        function sincronizarValoresContables(){
            //Si estan seleccionados los conceptos contables
            if(vista.gpConceptosContables.getSelectionModel().hasSelection()){
                mostrarMensaje(2, 'Est&aacute; seguro que desea sincronizar los Conceptos Contables como Valores Contables', function (btn) {
                    if(btn == 'ok'){
                        var arrayidconcont = new Array();
                        var arrayconcontsel = vista.gpConceptosContables.getSelectionModel().getSelections();
                        for(var i = 0; i < arrayconcontsel.length; i++){
                            arrayidconcont[i] = arrayconcontsel[i].data.idconceptoscontables;
                        }
                        //Se muestra la máscara de espera.
                        PVD.mostrarMascara('idmasksyncvalorescontables', 'Por favor espere...', 'Enviando datos');
                        //Enviando datos al servidor.
                        Ext.Ajax.request({
                            url: 'sincronizarValoresContables',
                            method: 'POST',
                            params: {
                                idestructura: variables.identidad,
                                arrayidconcont: Ext.encode(arrayidconcont)
                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                //Ocultando máscara de enviar datos.
                                PVD.ocultarMascara('idmasksyncvalorescontables');
                                if(responseData == 'ok'){
                                    mostrarMensaje(1, 'Los valores contables fueron sincronizados satisfactoriamente');
                                }
                            }
                        });
                    }
                })
            }else{
                mostrarMensaje(3, 'Por favor seleccione los Conceptos Contables a sincronizar como Valores Contables');
            }

        }

        function actualizarDatosConfiguracion($var) {
            //Se verifica si el formulario es válido y si el campo sueldo contiene un valor
            if (vista.formularioConceptosContables.getForm().isValid()) {
                var addmod = 0;
                if (variables.accion == 'ADD') {
                    addmod = 1;
                } else if (variables.accion == 'MOD') {
                    if (variables.cambio == 1) {
                        addmod = 2;
                    }
                }
                var idparrafofiscal = vista.cbParrafoFiscal.getValue();
                var idclienteproveedorcobropago = vista.cbClienteProvCobrosPagos.getValue();
                var idtienecobrospagos = vista.cbCobrosPagos.getValue();
                var idtipocobrospagos = vista.cbTipoOperacionCobrosPagos.getValue();
                var tipointegracioncobrospagos = vista.cbTipoSustitucionCobrosPagos.getValue();
                var cuentacontable = vista.cuentacontable.getValue();
                var liquidaobligacion = vista.checkLiquidaObligacion.getValue();
                var idcampoliquidaobligacion = vista.cbCampoLiquidarObligacion.getValue();
                //Si el concepto contable fija cuentas por cobrar o pagar
                if(idtienecobrospagos == 1){
                    //Si no tiene tipo operacion cobros y pagos
                    if(!idtipocobrospagos){
                        mostrarMensaje(3, 'Por favor seleccione la operaci&oacute;n a realizar en el m&oacute;dulo de cobros y pagos');
                        return;
                    }
                    //Si no tiene tipo de sustitucion
                    if(!tipointegracioncobrospagos){
                        mostrarMensaje(3, 'Por favor seleccione el tipo de sustituci&oacute;n.');
                        return;
                    }else{
                        //Si tiene tipo de sustitucion pero no se selecciono de la persona
                        if(tipointegracioncobrospagos == 1){
                            if(!cuentacontable){
                                mostrarMensaje(3, 'Por favor seleccione la cuenta contable de la persona.');
                                return;
                            }
                            //Si tiene tipo de sustitucion pero no se selecciono el cliente proveedor
                        }else if(tipointegracioncobrospagos == 2){
                            if(!idparrafofiscal){
                                mostrarMensaje(3, 'Por favor seleccione el cliente o proveedor.');
                                return;
                            }
                            if(!idclienteproveedorcobropago){
                                mostrarMensaje(3, 'Por favor seleccione la cuenta contable del cliente o proveedor.');
                                return;
                            }
                        }
                    }
                }
                //Se muestra la máscara de espera.
                PVD.mostrarMascara('idmaskaddmodconfconceptoscontables', 'Por favor espere...', 'Enviando datos');
                visible = (vista.cbMostrarDescuento.checked == true) ? 1 : 0;
                //Enviando datos al servidor.
                Ext.Ajax.request({
                    url: 'actualizarConfigConceptosContables',
                    method: 'POST',
                    params: {
                        idconceptoscontables: variables.idconceptoscontables,
                        denominacion: vista.tfDenomConceptosContables.getValue(),
                        obligacion: vista.tfObligacion.getValue(),
                        mostrardescuento: visible,
                        idestructura: variables.identidad,
                        idtiponomina: vista.cbTipoNomina.getValue(),
                        idestructuranomina: vista.cbEstructuraNomina.getValue(),
                        fechainicio: vista.dfFInicioConceptosContables.getRawValue(),
                        fechafin: vista.dfFFinConceptosContables.getRawValue(),
                        descripcion: vista.tfDescripConceptosContables.getValue(),
                        idparrafofiscal        : idparrafofiscal,
                        idclienteproveedorcobropago        : idclienteproveedorcobropago,
                        idtienecobrospagos        : idtienecobrospagos,
                        idtipocobrospagos        : idtipocobrospagos,
                        tipointegracioncobrospagos        : tipointegracioncobrospagos,
                        cuentacontable        : cuentacontable,
                        liquidacobrosypagos        : liquidaobligacion,
                        idcampoliquidaobligacion        : idcampoliquidaobligacion,
                        //idpartidagasto : vista.cbPartidagasto.getValue(),
                        addmod: addmod
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);

                        //Ocultando máscara de enviar datos.
                        PVD.ocultarMascara('idmaskaddmodconfconceptoscontables');

                        mostrarMensaje(1, (responseData == 'ADD') ? 'El concepto contable ha sido adicionado satisfactoriamente.' : 'El concepto contable ha sido modificado satisfactoriamente. ', function (btn) {
                            if (btn == 'ok') {
                                modelo.storeConceptosContables.load({params: {idestructura: variables.identidad, start:0, limit: 1000}});
                            }
                        });
                        variables.cambio == 0;
                        if ($var == 1) {
                            vista.ventanaConceptosContables.hide();
                        }
                        //vista.ventanaConceptosContables.hide();
                        vista.btnModificarConceptosContables.disable();
                        vista.btnEliminarConceptosContables.disable();
                        vista.btnElementosGasto.disable();
                        vista.formularioConceptosContables.getForm().reset()
                    }
                });
            } else {
                mostrarMensaje(3, 'Por favor verifique los campos incorrectos');
            }
        }

        function eliminarDatosConceptosContables(arridcc) {
            mostrarMensaje(2, '¿Está seguro que desea eliminar el(los) concepto(s) contable(s) seleccionado(s)? ', function (btn) {
                if (btn == 'ok') {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskdeleteconceptoscontables', 'Por favor espere...', 'Enviando datos');

                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: 'eliminarConfigConceptosContables',
                        method: 'POST',
                        params: {
                            identidad: variables.identidad,
                            idconceptoscontables: Ext.encode(arridcc),
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskdeleteconceptoscontables');

                            mostrarMensaje(1, (responseData == 'DEL') ? 'El concepto contable ha sido eliminado satisfactoriamente. ' : 'El concepto contable no pudo ser eliminado', function (btn) {
                                if (btn == 'ok') {
                                    modelo.storeConceptosContables.load({params: {idestructura: variables.identidad, start:0, limit: 1000}});
                                }
                            });
                            vista.btnModificarConceptosContables.disable();
                            vista.btnEliminarConceptosContables.disable();
                            vista.btnElementosGasto.disable();
                            vista.formularioConceptosContables.getForm().reset()
                        }
                    });
                }
            });
        }

        this.keyMap = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imh',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 73: { //i para adicionar.
                        if (!vista.btnAdicionarConceptosContables.disabled && !vista.ventanaConceptosContables.isVisible()) {
                            mostrarVentanaAdicionarConceptosContables();
                        }
                        break;
                    }
                    case 77: { //m para modificar .
                        if (!vista.btnModificarConceptosContables.disabled && !vista.ventanaConceptosContables.isVisible()) {
                            mostrarVentanaModificarConceptosContables();
                        }
                        break;
                    }
                    case 72: { //h para ayuda.
                        if (!vista.ventanaConceptosContables.isVisible()) {
                            vista.btnAyudaConceptosContables.focus();
                            vista.btnAyudaConceptosContables.fireEvent('click');
                        }
                        break;
                    }
                }
            }
        }, {
            key: 46,//del para eliminar.
            fn: function () {
                if (!vista.btnEliminarConceptosContables.disabled && !vista.ventanaConceptosContables.isVisible()) {
                    if (vista.gpConceptosContables.getSelectionModel().hasSelection()) {
                        var cont = 0;
                        var arridcc = new Array();
                        records = vista.gpConceptosContables.getSelectionModel().getSelections();
                        for (var i = 0; i < records.length; i++) {
                            arridcc[cont] = records[i].data.idconceptoscontables;
                            cont++;
                        }
                        eliminarDatosConceptosContables(arridcc);
                    } else {
                        mostrarMensaje(3, 'Debe seleccionar un concepto contable');
                    }
                }
            }
        }]);

    }
};