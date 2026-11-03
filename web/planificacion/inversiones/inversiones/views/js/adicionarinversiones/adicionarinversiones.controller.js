Utilidades.Cmp.controllerVentanaInversiones =  function(opciones) {
    var _this = this;
    this.addmod = opciones.addmod;
    this.idioma = opciones.idioma;
    this.objci = opciones.objci;
    this.vistaInversionesSelectionModel = opciones.vistaInversiones;
    this.gridInversiones = opciones.gridInversiones;
    this.storeInversiones = opciones.storeInversiones;
    this.ventanaProvincia = opciones.ventanaProvincia;
    this.comboEjercicio = opciones.comboEjercicio;
    this.panelComponentes = (opciones.panelComponentes != 'undefined')? opciones.panelComponentes : '';
    this.gridIsSelected = opciones.gridIsSelected;
    this.idInversionSelected = (this.gridIsSelected == true) ? this.gridInversiones.getSelectionModel().getSelected().data.idinversion : 0;
    this.idOrganismo = opciones.idOrganismo;
    this.iddpt = 0;
    this.nomencladoresInversiones = opciones.nomencladoresInversiones;

    this.mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });

    this.modeloVentanaInversiones = new Utilidades.Cmp.modeloVentanaInversiones({
        idOrganismo: this.idOrganismo
    });
    this.modeloVentanaInversiones.init();

    this.vistaVentanaInversiones = new Utilidades.Cmp.vistaVentanaInversiones({
        modelo: this.modeloVentanaInversiones,
        idioma: this.idioma,
        objci: this.objci,
        vistaInversionesSelectionModel: this.vistaInversionesSelectionModel,
        gridInversiones: this.gridInversiones,
        idOrganismo: this.idOrganismo,
        idInversionSelected: this.idInversionSelected,
        comboEjercicio: this.comboEjercicio,
        idOrganismo: this.idOrganismo,
        addmod : opciones.addmod


    });
    this.vistaVentanaInversiones.init();



    this.init = function () {

        /*modelo.store_gestionar_inversiones.on('beforeload', function() {
            modelo.store_gestionar_inversiones.baseParams.idNomInversion = idorganismo ? idorganismo : 0;
        });*/

        this.vistaVentanaInversiones.tfProvincia.on({
            focus: function() {
                //vista.ventanaDpt.show();
                _this.vistaVentanaInversiones.ventanaDpt.show();

            }
        });

        this.vistaVentanaInversiones.ventanaDpt.on('dameseleccion', function(obj, data) {
            _this.iddpt = data.get('iddpt');
            _this.vistaVentanaInversiones.tfProvincia.setValue(data.get('denominacion'));
            _this.vistaVentanaInversiones.ventanaDpt.hide();
        });

        //Validar campo fecha
        this.vistaVentanaInversiones.tfFechaFin.on('change', function() {
            _this.vistaVentanaInversiones.tfFechaFin.setMinValue(_this.vistaVentanaInversiones.tfFechaInicio.getValue());
        });

        this.vistaVentanaInversiones.btnAdicionarImpor.on('click', function() {
            var record = new Ext.data.Record({
                valor: 0,
                moneda: ''


            });
            _this.modeloVentanaInversiones.stImportacion.add(record);
        });

       /* this.vistaVentanaInversiones.btnEliminarImpor.on({
            click: function() {
                mostrarMensaje(2, perfil.etiquetas.tlDelLiqui, function(btnPress) {
                    if (btnPress === 'ok') {
                        Ext.Ajax.request({
                            method: "POST",
                            url: '/planificacion/planmeta/index.php/inversiones/eliminarLiquidos',
                            params: {
                                iderogacionliquido: _this.vistaVentanaInversiones.sm_importacion.getSelected().data.iderogacionliquido

                            },
                            callback: function(options, success, response) {
                                mostrarMensaje(1, perfil.etiquetas.tlDelSatisLiq);
                                _this.modeloVentanaInversiones.stImportacion.reload();
                            }
                        });
                    }
                });
            }

        });*/

        this.vistaVentanaInversiones.btnAdicionarPresupuesto.on('click', function() {

            var record = new Ext.data.Record({
                valor: '',
                moneda: ''
            });
            _this.modeloVentanaInversiones.stPresupuesto.add(record);
        });

        this.vistaVentanaInversiones.btnEliminar.on('click', function(){


             Ext.Ajax.request({
             method: "POST",
             url: '/planificacion/inversiones/index.php/inversiones/eliminarPresupuesto',
             params: {
             idpresanteproy: _this.vistaVentanaInversiones.grid_Presupuesto.getSelectionModel().getSelected().data.idpresanteproy
             },
             callback: function(options, success, response) {
             mostrarMensaje(1, perfil.etiquetas.tlDelSatisPlanP);
             _this.modeloVentanaInversiones.stPresupuesto.reload();
             }

             });



        });
        function eliminarPlanP(btnPresionado) {
            if (btnPresionado == 'ok') {
                console.info('entra');
            }
        }

        this.vistaVentanaInversiones.btnAdicionarFinan.on('click', function() {
            var record = new Ext.data.Record({
                valor: '',
                moneda: '',
                financi: '',
                tipo: '',
                plazoamortizacion: 0,
                porcientointeres: 0,
                gracia: 0

            });
            _this.modeloVentanaInversiones.store_Financiamiento.add(record);
        });

        this.vistaVentanaInversiones.btnEliminarFinan.on({
            click: function() {
//                mostrarMensaje(2, perfil.etiquetas.tlDelFinan, function(btnPress) {
//                    if (btnPress === 'ok') {
                        Ext.Ajax.request({
                            method: "POST",
                            url: "eliminarFin",
                            params: {
                                idfinanciamiento: _this.vistaVentanaInversiones.sm_financiamiento.getSelected().data.idfinanciamiento,
                                identidad: idorganismo,
                                idejercicio: _this.comboEjercicio.getValue(),
                                idinversion: _this.idInversionSelected
                            },
                            callback: function(options, success, response) {
                                mostrarMensaje(1, perfil.etiquetas.tlDelSatisPres);
                                _this.modeloVentanaInversiones.store_Financiamiento.reload();
                            }
                        });
//                    }
//                });
            }
        });

        this.vistaVentanaInversiones.grid_Importacion.getSelectionModel().on({
            rowselect: function(g, r, e) {
                _this.vistaVentanaInversiones.btnEliminarImpor.enable();
            },
            rowdeselect: function(g, r, e) {
                _this.vistaVentanaInversiones.btnEliminarImpor.disable();
            }
        });

        this.modeloVentanaInversiones.stImportacion.reload({
            params: {
                start: 0,
                limit: 20,
                identidad: idorganismo,
                idejercicio: this.comboEjercicio.getValue(),
                idinversion: this.idInversionSelected
            }
        });

        this.vistaVentanaInversiones.btnEliminarImpor.on({
            click: function() {

                        Ext.Ajax.request({
                            method: "POST",
                            url: '/planificacion/inversiones/index.php/inversiones/eliminarLiquidos',
                            params: {
                                iderogacionliquido: _this.vistaVentanaInversiones.sm_importacion.getSelected().data.iderogacionliquido
                            },
                            callback: function(options, success, response) {
                                mostrarMensaje(1, perfil.etiquetas.tlDelSatisLiq);
                                _this.modeloVentanaInversiones.stImportacion.reload();
                            }
                        });

            }

        });

        this.vistaVentanaInversiones.grid_Importacion.getSelectionModel().on({
            rowselect: function(g, r, e) {
                _this.vistaVentanaInversiones.btnEliminarImpor.enable();
            },
            rowdeselect: function(g, r, e) {
                _this.vistaVentanaInversiones.btnEliminarImpor.disable();
            }
        });



        this.vistaVentanaInversiones.grid_Presupuesto.getSelectionModel().on({
            rowselect: function(g, r, e) {
                _this.vistaVentanaInversiones.btnEliminar.enable();
            },
            rowdeselect: function(g, r, e) {
                _this.vistaVentanaInversiones.btnEliminar.disable();
            }
        });

        this.vistaVentanaInversiones.grid_Financiamiento.getSelectionModel().on({
            rowselect: function(g, r, e) {
                _this.vistaVentanaInversiones.btnEliminarFinan.enable();
            },
            rowdeselect: function(g, r, e) {
                _this.vistaVentanaInversiones.btnEliminarFinan.disable();
            }
        });

        Ext.getCmp('btnaplicar').on({
            click: function() {
                if (_this.vistaVentanaInversiones.fmAdicionarInversion.getForm().isValid() == true) {
                    Ext.getCmp('btnaplicar').enable();
                    _this.adicionarInversion(true);
                }
                else {
                    mostrarMensaje(1, idioma.msgError);
                }
            }
        });

        Ext.getCmp('btnaceptar').on({
            click: function() {
                if (_this.vistaVentanaInversiones.fmAdicionarInversion.getForm().isValid() == true) {
                    Ext.getCmp('btnaceptar').enable();
                    _this.adicionarInversion(false);
                }
                else {
                    mostrarMensaje(1, idioma.msgError);
                }
            }
        });





    }



    this.getModeloVentanaInversiones = function () {

        return this.modeloVentanaInversiones;
    }

    this.getVistaVentanaInversiones = function () {

        return this.vistaVentanaInversiones;
    }


    this.adicionarInversion = function (aplicar) {

        arraypresupuesto = new Array();
        records = _this.modeloVentanaInversiones.stPresupuesto.getModifiedRecords();
        _this.modeloVentanaInversiones.stPresupuesto.commitChanges();
        var changeClasif = false;
        for (var i = 0; i < records.length; i++) {
            arraypresupuesto.push(records[i].data);
        }
        arrayfin = new Array();
        recordsfinan = _this.modeloVentanaInversiones.store_Financiamiento.getModifiedRecords();


        //comprobar que exista financiamiento en el store de financiamiento
        if (_this.modeloVentanaInversiones.store_Financiamiento.getCount() > 0) {

            //comprobar que en el store de financiamiento existan los valores: quien financia, como se financia, valor y moneda
            _this.modeloVentanaInversiones.store_Financiamiento.commitChanges();
            var valFinanciamientoVacios = false;
            for (var i = 0; i < recordsfinan.length; i++) {
                arrayfin.push(recordsfinan[i].data);

                if (recordsfinan[i].data.financi == false || recordsfinan[i].data.valor == false || recordsfinan[i].data.moneda == false || recordsfinan[i].data.tipo == false) {
                    valFinanciamientoVacios = true;
                    break;
                }
            }



            if (this.addmod == true) {
                if (arrayfin.length != 0)
                    comprobacion = true;
                else
                    comprobacion = false;
            }
            else
                comprobacion = true;

            if (valFinanciamientoVacios == false && comprobacion == true) {
                arrayliquido = new Array();
                recordliqui = _this.modeloVentanaInversiones.stImportacion.getModifiedRecords();
                _this.modeloVentanaInversiones.stImportacion.commitChanges();
                for (var i = 0; i < recordliqui.length; i++) {
                    arrayliquido.push(recordliqui[i].data);
                }
                if (this.vistaInversionesSelectionModel.getSelected()) {
                    var selecti = this.gridInversiones.getSelectionModel().getSelected().data.idinversion;
                    if(this.panelComponentes!= '')
                        this.panelComponentes.expand(true);

                    if (this.vistaVentanaInversiones.cmbClasificacion.getValue() != this.gridInversiones.getSelectionModel().getSelected().data.idtipoinversion && this.addmod == false) {
                        changeClasif = true;
                    } else {
                        changeClasif = false;
                    }
                }
                if (this.addmod == false && this.vistaInversionesSelectionModel.getSelected()) {
                    idclasfAntes = this.gridInversiones.getSelectionModel().getSelected().data.idtipoinversion
                } else {
                    idclasfAntes = null;
                }
                if (this.vistaVentanaInversiones.ChkFastTrack.getValue() == true) {
                    fasttrack = 1;
                } else {
                    fasttrack = 0;
                }
                if (_this.iddpt) {
                    provincia = _this.iddpt;
                } else {
                    provincia = this.gridInversiones.getSelectionModel().getSelected().data.idprovincia;
                }

                monedaP = this.validarMoneda(this.modeloVentanaInversiones.stPresupuesto.data, this.addmod);
                monedaF = this.validarMoneda(this.modeloVentanaInversiones.store_Financiamiento.data, this.addmod);

                monedaErog = this.validarMoneda(this.modeloVentanaInversiones.stImportacion.data, this.addmod);
                if (monedaP || monedaErog) {
                    mostrarMensaje(1, "Existe alguna moneda que se encuentra repetida.");
                }
                else {

                    _this.mymask.show();
                    Ext.Ajax.request({
                        url: '/planificacion/inversiones/index.php/inversiones/adicionarInversiones',
                        params: {
                            idespecialidad: idorganismo,
                            idinversion: (selecti && !this.addmod) ? selecti : 0,
                            denominacion: this.vistaVentanaInversiones.tfdenominacion.getValue(),
                            idclasificacion: this.vistaVentanaInversiones.cmbClasificacion.getValue(),
                            idejercicio: this.comboEjercicio.getValue(),
                            ejercicio: this.comboEjercicio.getRawValue(),
                            idtipoinversion: this.vistaVentanaInversiones.CmbTipoInversion.getValue(),
                            idprogramada: this.vistaVentanaInversiones.CmbProgramada.getValue(),
                            idcaracteristica: this.vistaVentanaInversiones.CmbCaracteristica.getValue(),
                            idforma: this.vistaVentanaInversiones.CmbFormaDePropiedad.getValue(),
                            idefecto: this.vistaVentanaInversiones.CmbEfectoEnComercio.getValue(),
                            idmedioambiente: this.vistaVentanaInversiones.cmbMedioAmbiente.getValue(),
                            idobjetivo: this.vistaVentanaInversiones.CmbObjetivo.fSelect.values,
                            iddatdesempenno: this.vistaVentanaInversiones.CmbDesempeno.getValue(),
                            fasttrack: fasttrack,
                            preparacion: (this.vistaVentanaInversiones.ChkPreparacion.getValue()== true)? 1:0,
                            presupuesto: Ext.encode(arraypresupuesto),
                            financiamiento: Ext.encode(arrayfin),
                            liquido: Ext.encode(arrayliquido),
                            provincia: provincia,
                            fechainicio: this.vistaVentanaInversiones.tfFechaInicio.getValue().format('d/m/Y'),
                            fechafin: this.vistaVentanaInversiones.tfFechaFin.getValue().format('d/m/Y'),
                            analpostinversiones: this.vistaVentanaInversiones.tfanalisis.getValue(),
                            observaciones: Ext.getCmp('idobservacionN').getValue(),
                            idgrupoobra: this.vistaVentanaInversiones.CmbGrupoObra.getValue(),
                            idestadoplan: this.vistaVentanaInversiones.CmbEstado.getValue(),
                            idsectorestrategico: this.vistaVentanaInversiones.CmbSectorEstrategico.getValue(),
                            changeClasif: changeClasif,
                            idclasfAntes: idclasfAntes,
                            addmod: this.addmod

                        },
                        callback: function(options, success, response) {

                            if (_this.addmod == true) {
                                mostrarMensaje(1, perfil.etiquetas.tlADDInver);
                                _this.storeInversiones.reload();
                            } else {

                                mostrarMensaje(1, perfil.etiquetas.tlADDInverMod);
                                _this.storeInversiones.reload();
                            }
                            _this.mymask.hide();
                        }
                    });
                    if (aplicar == false) {
                        this.vistaVentanaInversiones.win_add_inversiones.close();
                    }else{
                        this.vistaVentanaInversiones.CmbFormaDePropiedad.clearValue();
                        this.vistaVentanaInversiones.CmbObjetivo.clearValue();
                        this.vistaVentanaInversiones.tfdenominacion.reset();
                        this.vistaVentanaInversiones.tfFechaFin.reset();
                        this.vistaVentanaInversiones.tfProvincia.reset();
                        this.vistaVentanaInversiones.tfFechaInicio.reset();
                        this.vistaVentanaInversiones.cmbClasificacion.clearValue();
                        this.vistaVentanaInversiones.CmbEfectoEnComercio.clearValue();
                        this.vistaVentanaInversiones.cmbMedioAmbiente.clearValue();
                        this.vistaVentanaInversiones.CmbTipoInversion.clearValue();
                        this.vistaVentanaInversiones.CmbProgramada.clearValue();
                        this.vistaVentanaInversiones.CmbCaracteristica.clearValue();
                        this.vistaVentanaInversiones.CmbDesempeno.clearValue();
                        this.vistaVentanaInversiones.tfanalisis.reset();
                        Ext.getCmp('idobservacionN').reset();
                        this.vistaVentanaInversiones.CmbSectorEstrategico.clearValue();
                        this.vistaVentanaInversiones.CmbEstado.clearValue();

                        _this.modeloVentanaInversiones.stImportacion.removeAll();
                        _this.modeloVentanaInversiones.stPresupuesto.removeAll();
                        _this.modeloVentanaInversiones.store_Financiamiento.removeAll();
                    }

                }
            } else {
                mostrarMensaje(1, "Los valores: Qui�n financia, C�mo se financia, Valor y Moneda son necesarios en el Financiamiento ");
            }
        } else {
            mostrarMensaje(1, "La inversi�n debe tener un financiamiento."); //perfil.etiquetas.msgError
        }
    }

    this.validarMoneda = function (data, addmod) {
        aux = false;
        //console.info(data);
        if (data.length != 0) {
            for (var i = 0; i < data.length - 1; i++) {
//console.info(data.items[i].data)
                if (data.items[i].data.pintar == 0) {


                    if (data.items[i].data.moneda != "USD" && data.items[i].data.moneda != "CUP") {
                        var pre = data.items[i].data.moneda;
                    } else {
                        if (!addmod || data.items[i].data.idpresanteproy == "") {
                            var pre = (data.items[i].data.idmonedaentidad != undefined) ? data.items[i].data.idmonedaentidad : data.items[i].data.moneda;
                        } else {
                            var pre = (data.items[i].data.moneda != undefined) ? data.items[i].data.moneda : data.items[i].data.idmonedaentidad;
                        }
                    }

                    for (var j = i + 1; j < data.length; j++) {
                        if (data.items[j].data.moneda != "USD" && data.items[j].data.moneda != "CUP")
                            var pre1 = data.items[j].data.moneda;
                        else {
                            if (!addmod || data.items[i].data.idpresanteproy == "") {
                                var pre1 = (data.items[j].data.idmonedaentidad != undefined) ?
                                    data.items[j].data.idmonedaentidad : data.items[j].data.moneda;
                            } else {
                                var pre1 = (data.items[j].data.moneda != undefined) ?
                                    data.items[j].data.moneda : data.items[j].data.idmonedaentidad;
                            }
                        }

                        if (pre == pre1) {
                            aux = true;
                            break;
                        }
                    }
                }
                if (aux == true) {
                    break;
                }
            }
        }
        return aux;
    }


}
