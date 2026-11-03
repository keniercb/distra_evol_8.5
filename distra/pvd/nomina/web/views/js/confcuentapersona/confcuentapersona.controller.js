Ext.ns('Pvd.Nomina.Configuracion.Confcuentapersona');


Pvd.Nomina.Configuracion.Confcuentapersona.Controlador= {

    init: function(idioma, vista, modelo) {

        var variables = {
            cambio: 0
        };

        //vista.winEstructura.show();
       // vista.winMostrarCuentaPersona.show();
        modelo.stConfcuentapersona.load({callback: function (options, success, response) { vista.winMostrarCuentaPersona.show();}});
        modelo.stcuenta.load();

        vista.pobjestructura.on('estructuraselecionada', function (sm, nodo) {
            //if (nodo.attributes.tipoestructura == 3) {
                vista.btnAceptarEntidad.enable();
                vista.idEstructura = nodo.id;
            //}
        }.createDelegate(this));

        vista.btnAceptarEntidad.setHandler(function () {

            modelo.stConfcuentapersona.load({params:{idestructura: vista.idEstructura}, callback: function (options, success, response) { vista.winMostrarCuentaPersona.show();}});
            modelo.stcuenta.load();
        });

        this.seleccionconfiguracioncuentapaerturapersona = null;
        var arrayConceptos = new Array();

        vista.gpCuentaPersona.getSelectionModel().on('rowselect', function (t, index, r) {
            this.seleccionconfiguracioncuentapaerturapersona = r;
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
            vista.btnReplicar.enable();
            var id = r.id;
            var indiceFila = vista.filasSelecionadas.indexOf(id);
            if (indiceFila == -1) {
                vista.filasSelecionadas.push(id);
            }
            arrayConceptos = vista.filasSelecionadas;

        }.createDelegate(this));


        vista.gpCuentaPersona.getSelectionModel().on('rowdeselect', function (sm, index, rec) {

            var id = rec.id;
            var indiceFila = vista.filasSelecionadas.indexOf(id);
            vista.filasSelecionadas.remove(id);
            if (vista.filasSelecionadas == 0) {
                vista.btnModificar.disable();
                vista.btnEliminar.disable();
                vista.btnReplicar.disable();
            }
            arrayConceptos = vista.filasSelecionadas;
        }.createDelegate(this));

        vista.btnReplicar.on('click', function(){
            this.accion = 'ADD';
            mostrarMensaje(1, 'Replicar en contrucci&oacuten');
           // this.MostrarADDMODConfCuentaPersona (this.accion);
        }.createDelegate(this));

        vista.btnAyuda.on('click', function(){
            this.accion = 'ADD';
            mostrarMensaje(1, 'Ayuda en contrucci&oacuten');
           // this.MostrarADDMODConfConceptosGenerales (this.accion);
        }.createDelegate(this));

        vista.btnAdicionar.on('click', function(){
            this.accion = 'ADD';
            //mostrarMensaje(1, 'Adicionar en contrucci&oacuten');
           this.MostrarADDMODConfCuentaPersona (this.accion);
        }.createDelegate(this));

        vista.btnModificar.on('click', function(){
            this.accion = 'MOD';
        //    mostrarMensaje(1, 'Modificar en contrucci&oacuten');
            this.MostrarADDMODConfCuentaPersona (this.accion);
        }.createDelegate(this));

        vista.cbxcuenta.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });
        vista.taReferencia.on('change', function (tf, n, o) {
            variables.cambio = 1;
        });

        vista.rbTodasPersonas.on('change', function (_this, newValue, oldValue) {
            variables.cambio = 1;
        });

        vista.rbPersonasCentroCosto.on('change', function (_this, newValue, oldValue) {
            variables.cambio = 1;
        });

        vista.btnEliminar.setHandler(function () {
            this.accion = 'DEL';
            if (this.seleccionconfiguracioncuentapaerturapersona) {
                mostrarMensaje(2, ' ¿Está seguro que desea eliminar la configuración de la cuenta de apertura de la persona seleccionada?', function (btn) {
                    if (btn == 'ok') {
                        this.ADDMODDELConfiguracionCuentaPersona(this.accion, 'ACEPTAR', this.DatosCuenta(this.accion));
                    } else return;
                }.createDelegate(this));
            } else {
                mostrarMensaje(1, 'Eliminar en contrucci&oacuten');
        }
        }.createDelegate(this));



        vista.btnAceptar.setHandler(function () {

            if (vista.cbxcuenta.value != "" && vista.taReferencia.getValue() != "") {
                //this.accion == 'ADD';
                console.log(variables.cambio);
                if(variables.cambio == 1){
                    this.ADDMODDELConfiguracionCuentaPersona(this.accion, 'ACEPTAR',this.DatosCuenta(this.accion));
                }
                else{
                    vista.winCuentapersona.hide();
                }

            }
        }.createDelegate(this));

        vista.btnAplicar.setHandler(function () {

            if (vista.cbxcuenta.getValue() != "" && vista.taReferencia.getValue() != "") {
                this.accion == 'ADD';
                this.ADDMODDELConfiguracionCuentaPersona(this.accion, 'APLICAR', this.DatosCuenta(this.accion));
            }
        }.createDelegate(this));

        vista.btnCancelar.setHandler(function () {
            vista.winCuentapersona.hide();
        }.createDelegate(this));


        this.limpiarFormularioConfCuentaPersona = function () {
            vista.fpConfCuentaPersona.getForm().reset();
        }.createDelegate(this);

        this.MostrarADDMODConfCuentaPersona = function (boton) {
            var titulo = '';
           // vista.rbPersonasCentroCosto.reset();
            //vista.rbTodasPersonas.reset();
            this.limpiarFormularioConfCuentaPersona();
            if (this.accion == 'ADD') {
                titulo = 'Adicionar configuraci&oacute;n de cuenta de la persona';

                vista.cbxcuenta.setValue("");
                vista.taReferencia.setValue("");
                vista.btnAplicar.setVisible(true);
                vista.cbxcuenta.enable();
            } else {
                titulo = 'Modificar configuraci&oacute;n de cuenta de la persona';
                var datos =vista.fpConfCuentaPersona.getForm().loadRecord(vista.gpCuentaPersona.getSelectionModel().getSelected());
               // console.info(datos);
                vista.cbxcuenta.setValue(vista.gpCuentaPersona.getSelectionModel().getSelected().get('idcuenta'));
                vista.taReferencia.setValue(vista.gpCuentaPersona.getSelectionModel().getSelected().get('descripcion'));
               // console.info(vista.gpCuentaPersona.getSelectionModel().getSelected().get('tipoapertura'));

                vista.btnAplicar.setVisible(false);
                vista.cbxcuenta.disable();

            }
            vista.winCuentapersona.setTitle(titulo);
           // vista.cbConceptosGenerales.focus(true, 500);
            vista.winCuentapersona.show();

            if(vista.gpCuentaPersona.getSelectionModel().getSelected().get('tipoapertura') == 1){
                vista.rbPersonasCentroCosto.setValue(false);
                vista.rbTodasPersonas.setValue(true);
            }else{
                vista.rbTodasPersonas.setValue(false);
                vista.rbPersonasCentroCosto.setValue(true);
            }
        }.createDelegate(this);

        vista.cbxcuenta.on(
            {
                scope: this,

                select: function (combo, record, rowIndex) {
                   // var recordCmb = vista.cmbtipocta.store.getAt(vista.cmbtipocta.store.find('tipocuenta', vista.cmbtipocta.getValue()));
                    vista.cbxcuenta.tipocta = 2;
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
        this.DatosCuenta = function (accion) {

            if (accion == 'ADD') {
                //console.info(vista.tipoapertura);return;
                return {
                    idcuenta: vista.cbxcuenta.value,
                    tipoapertura: vista.tipoapertura,
                    descripcion: vista.taReferencia.getValue(),
                    idestructura:vista.idEstructura
                };
            }
            else if (accion == 'MOD') {
                return {
                    idcuentaaperturapersona: this.seleccionconfiguracioncuentapaerturapersona.data.idcuentaaperturapersona,
                    idcuenta: vista.cbxcuenta.value,
                    tipoapertura: vista.tipoapertura,
                    descripcion: vista.taReferencia.getValue(),
                    idestructura:vista.idEstructura
                };
            } else if (accion == 'DEL') {
                return {
                    idcuentaaperturapersona: this.seleccionconfiguracioncuentapaerturapersona.data.idcuentaaperturapersona
                };
            }
        }.createDelegate(this);


        this.ADDMODDELConfiguracionCuentaPersona = function (accion, boton, datos) {

            var url = '';
            if (accion == 'ADD') {
                url = 'adicionarconfiguracionescuentasaperturapersona';
                PVD.mostrarMascara('idmaskadicionarconfiguracionesconceptosgeneralesnomina', 'Por favor espere...', 'Adicionando datos de la configuraci&oacute;n');
            } else if (accion == 'MOD') {
               url = 'modificarconfiguracionescuentasaperturapersona';
                PVD.mostrarMascara('idmaskmodificarconfiguracionesconceptosgeneralesnomina', 'Por favor espere...', 'Modificando datos de la configuraci&oacute;n');
            } else if (accion == 'DEL') {
                url = 'eliminarconfiguracionescuentasaperturapersona';
                PVD.mostrarMascara('idmaskeliminarconfiguracionesconceptosgeneralesnomina', 'Por favor espere...', 'Eliminando datos de la configuraci&oacute;n');
            }
            if (vista.fpConfCuentaPersona.getForm().isValid()) {
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    params: {
                        idcuenta: (datos.idcuenta ? datos.idcuenta : null),
                        descripcion: (datos.descripcion ? datos.descripcion : null),
                        tipoapertura:(datos.tipoapertura ? datos.tipoapertura : null),
                      //  idestructura: (datos.idestructura ? datos.idestructura : null),
                        idcuentaaperturapersona: (datos.idcuentaaperturapersona ? datos.idcuentaaperturapersona : null)


                    },
                    callback: function (options, success, response) {
                        if (accion == 'ADD') {
                            PVD.ocultarMascara('idmaskadicionarconfiguracionesconceptosgeneralesnomina');
                        } else if (accion == 'MOD') {
                            PVD.ocultarMascara('idmaskmodificarconfiguracionesconceptosgeneralesnomina');
                        } else if (accion == 'DEL') {
                            PVD.ocultarMascara('idmaskeliminarconfiguracionesconceptosgeneralesnomina');
                        }
                        var respuesta = Ext.decode(response.responseText);
                        if (respuesta.codigo == 'EXISTE') {
                            mostrarMensaje(3, 'La configuraci&oacute;n de conceptos generales de n&oacute;mina existe.');
                            return;
                        }
                        if (respuesta.codigo == 'ADD-1') {
                            mostrarMensaje(1, 'La configuraci&oacute;n de cuentas de apertura de la persona se adicion&oacute; satisfactoriamente.');

                        } else if (respuesta.codigo == 'MOD-1') {
                            mostrarMensaje(1, 'La configuraci&oacute;n de cuentas de apertura de la persona se modific&oacute; satisfactoriamente.');
                        }
                        else if (respuesta.codigo == 'DEL-1') {
                            mostrarMensaje(1, 'La configuraci&oacute;n de cuentas de apertura de la persona se elimin&oacute; satisfactoriamente.');
                        }
                        if (boton == 'APLICAR' && accion == 'ADD') {
                            this.limpiarFormularioConfCuentaPersona();
                        } else if (boton == 'ACEPTAR' && accion != 'DEL') {
                            vista.winCuentapersona.hide();
                        }
                        if (accion == 'MOD' || accion == 'DEL') {
                            vista.btnModificar.disable();
                            vista.btnEliminar.disable();
                        }
                        modelo.stConfcuentapersona.load({params:{idestructura: vista.idEstructura}});
                    }.createDelegate(this)
                });
            }
        };


    }
}
