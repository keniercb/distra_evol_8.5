Ext.ns('Pvd.ControlAsistencia.PlanificacionVacaciones');
//Controlador de la vista del componente
Pvd.ControlAsistencia.PlanificacionVacaciones.Controlador = {

    init: function (idioma, vista, modelo) {
        var scope = this;
        this.idestructura = perfil.idestructuracomun;
        this.idconcepto = null;
        var idtipo = null;

        this.variables = {
            idpersona: -1,
            personaseleccionada: 0,
            nombrepersona: '',
            cargopersona: ''
        };

        this.variablesSS = {
            idpersona: -1,
            personaseleccionada: 0,
            nombrepersona: '',
            cargopersona: ''
        };

        this.variablesRevisadopor = {
            idpersona: -1,
            personaseleccionada: 0,
            nombrepersona: '',
            cargopersona: ''
        };

        this.variablesAprobadopor = {
            idpersona: -1,
            personaseleccionada: 0,
            nombrepersona: '',
            cargopersona: ''
        };

        vista.estructura.tree.root.on('expand', function (nodo) {
            vista.estructura.tree.getSelectionModel().select(nodo.childNodes[0]);
            scope.idtipo = nodo.childNodes[0].attributes.idtipo;
            modelo.fuenteDatosListado.baseParams.idestructura = vista.estructura.inicial;
            modelo.fuenteDatosListado.baseParams.idconcepto = scope.idtipo;
            modelo.fuenteDatosListado.baseParams.anno = vista.comboYear.getValue();
            modelo.fuenteDatosListado.load({params: {start: 0, limit: 20}});
        });

        vista.estructura.on('dameseleccion', function (obj, data) {
            if (data == false) {
                this.idestructura = vista.estructura.inicial;
                this.idconcepto = scope.idtipo;
            }
            else {
                this.idestructura = data.id;
                this.idconcepto = data.attributes.idconcepto;
            }

            modelo.fuenteDatosListado.baseParams.idestructura = this.idestructura;
            modelo.fuenteDatosListado.baseParams.idconcepto = this.idconcepto;
            modelo.fuenteDatosListado.baseParams.anno = vista.comboYear.getValue();
            modelo.fuenteDatosListado.load({params: {start: 0, limit: 20}});
        }, this);

        vista.btnLimpiar.on('click', function () {
            vista.tfbuscar.reset();
            vista.comboYear.setValue(vista.fecha.getFullYear());
            modelo.fuenteDatosListado.load({params: {start: 0, limit: 20}, anno: vista.comboYear.getValue()});
        });

        vista.btnBuscar.on('click', function () {
            modelo.fuenteDatosListado.modified = [];
            modelo.fuenteDatosListado.baseParams.anno = vista.comboYear.getValue();
            modelo.fuenteDatosListado.baseParams.idestructura = scope.idestructura;
            modelo.fuenteDatosListado.load({
                params: {
                    filtro: vista.tfbuscar.getValue(),
                    start: 0,
                    limit: 20,
                    anno: vista.comboYear.getValue()
                }
            });
        });

        this.years = new Array();
        var x = 2014;
        while (x <= vista.fecha.getFullYear() + 1) {
            var year = [x, x];
            this.years.push(year);
            x++;
        }
        modelo.storeYear.loadData(this.years);

        vista.btnGuardar.on('click', function () {
            guardarplanvacaciones();
        }, this);

        function guardarplanvacaciones() {
            var datos = new Array();
            if (modelo.fuenteDatosListado.modified.length > 0) {
                Ext.each(modelo.fuenteDatosListado.modified, function (recs) {
                    datos.push(recs.data);
                });
                PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Enviando datos...');
                Ext.Ajax.request({
                    url: 'guardarPlanVacaciones',
                    method: 'POST',
                    params: {
                        datos: Ext.encode(datos),
                        anno: vista.comboYear.getValue()
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('mascaraEnviarDatos');
                        var responseData = Ext.decode(response.responseText);

                        if (responseData.cod == 1) {
                            mostrarMensaje(1, idioma.lbMsgGuardarExito);
                            modelo.fuenteDatosListado.modified = [];
                            modelo.fuenteDatosListado.load({
                                params: {
                                    start: 0,
                                    limit: 20,
                                    anno: vista.comboYear.getValue()
                                }
                            });
                        } else {
                            mostrarMensaje(3, idioma.lbMsgErrorGuardar);
                            modelo.fuenteDatosListado.modified = [];
                        }

                    }
                });
            } else {
                mostrarMensaje(1, idioma.MsgLLenarDatos);
            }
        }

        ///////////////////////////////////MODELO DE VACACIONES///////////////////////////////////
        vista.listadoModeloVac.on('beforeedit', function (e) {
            if(e.record.data.origen == 1){
                if (e.record.data.idmes <= 9)
                    var mes = '0' + e.record.data.idmes;
                else
                    var mes = e.record.data.idmes;
                var diasmes = diasEnUnMes(mes, e.record.data.anno);

                var hoy = new Date().getTime();
                var primerdia = new Date('01/' + mes + '/' + e.record.data.anno).getTime();
                var datequince = new Date(e.record.data.anno + '-' + mes + '-15').getTime();

                if (new Date().getDate() <= 9)
                    var date = '0' + new Date().getDate();
                else
                    var date = new Date().getDate();

                if (e.record.data.quincena == '1ra') {
                    //if (hoy > primerdia && mes == new Date().getMonth() + 1)
                    //vista.desde.setMinValue(date + '/' + mes + '/' + e.record.data.anno);
                    //else
                    vista.desde.setMinValue('01/' + mes + '/' + e.record.data.anno);
                    vista.desde.setMaxValue('15/' + mes + '/' + e.record.data.anno);
                } else if (e.record.data.quincena == '2da') {
                    //if (hoy > datequince && mes == new Date().getMonth() + 1)
                    //vista.desde.setMinValue(date + '/' + mes + '/' + e.record.data.anno);
                    //else
                    vista.desde.setMinValue('15/' + mes + '/' + e.record.data.anno);
                    vista.desde.setMaxValue(diasmes + '/' + mes + '/' + e.record.data.anno);
                }
                if (e.field == 'fhasta') {
                    var fdesde = e.record.data.fdesde;
                    var dias = e.record.data.diasnaturales; // Número de días a agregar
                    var suma = parseInt(fdesde.getDate()) + parseInt(dias) - 1;
                    var y = fdesde.format('Y');
                    if (suma > diasmes) {
                        var m = parseInt(fdesde.format('m')) + 1;
                        if(m == '13'){
                            m = '1';
                            y = y + 1;
                        }
                        var d = suma - diasmes;
                        if (parseInt(m) <= 9)
                            var m = '0' + m;
                        else
                            var m = m;
                        if (d <= 9)
                            var dia = '0' + d;
                        else
                            var dia = d;
                    } else {
                        var m = fdesde.format('m');
                        var dia = suma;
                    }
                    var fhasta = dia + '/' + m + '/' + y;
                    e.record.set('fhasta', fhasta);

                    Ext.Ajax.request({
                        url: 'diasHabiles',
                        params:{fdesde:e.record.data.fdesde.format('d/m/Y'),fhasta:e.record.data.fhasta,idpersona:e.record.data.idpersona},
                        method: "POST",
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            if(responseData != 0){
                                e.record.set('diashabiles', responseData);
                            }else{
                                mostrarMensaje(3, 'La persona no tiene calendario planificado en este período');
                                e.record.set('fdesde', '');
                                e.record.set('fhasta', '');
                                vista.btnGenerar.disable();
                            }
                        }
                    });
                    return false;
                }
                /*if (e.field == 'diasnaturales') {
                    var fdesde = e.record.data.fdesde;
                    var fhasta = e.record.data.fhasta;
                    var fechaInicio = new Date(fdesde.format('Y-m-d')).getTime();
                    var fechaFin = new Date(fhasta.format('Y-m-d')).getTime();
                    var diff = fechaFin - fechaInicio;
                    e.record.set('diasnaturales', diff / (1000 * 60 * 60 * 24));
                    return false;
                }*/
                if (e.field == 'fdesde') {
                    if (e.record.data.bandera == 1) {
                        return false;
                    } else {
                        if (e.record.data.quincena == '1ra' && e.record.data.origen == 1) {
                            //if (hoy < datequince) {
                            /*if (hoy > primerdia && mes == new Date().getMonth() + 1)
                                e.record.set('fdesde', date + '/' + mes + '/' + e.record.data.anno);
                            else*/
                            e.record.set('fdesde', '01/' + mes + '/' + e.record.data.anno);
                            /* } else {
                                 mostrarMensaje(8, 'Ha usted no se le puede generar el modelo de vacaciones debido a que esa quinsena ya pasó.');
                                 return false;
                             }*/
                        } else if (e.record.data.quincena == '2da' && e.record.data.origen == 1) {
                            /*if (hoy > datequince && mes == new Date().getMonth() + 1)
                                e.record.set('fdesde', date + '/' + mes + '/' + e.record.data.anno);
                            else*/
                            e.record.set('fdesde', '15/' + mes + '/' + e.record.data.anno);
                        }
                    }
                }
            }else{
                return false;
            }
        });

        function diasEnUnMes(mes, año) {
            return new Date(año, mes, 0).getDate();
        }

        vista.listadoModeloVac.getSelectionModel().on('rowselect', function (sm, numb, rec) {
            if (rec.data.bandera == 1) {
                vista.btnGenerar.disable();
                vista.btnEliminar.enable();
            } else {
                if (!Ext.isEmpty(rec.data.fdesde) && !Ext.isEmpty(rec.data.fhasta)) {
                    vista.btnEliminar.enable();
                    vista.btnGenerar.enable();
                } else {
                    vista.btnEliminar.enable();
                    vista.btnGenerar.enable();
                }
            }
        }, this);

        vista.listadoModeloVac.getSelectionModel().on('rowdeselect', function (sm, numb, rec) {

        }, this);

        vista.btnBuscarVac.on('click', function () {
            buscarpersona();
        }, this);

        buscarpersona = function () {
            var tVal = vista.tfbuscarVac.getRawValue().toLowerCase();
            var cant = modelo.fuenteDatosListadoModeloVac.getCount();
            var listpersonas = modelo.fuenteDatosListadoModeloVac.getRange(0, cant);
            var cont = 0;
            var conicidencias = new Array();
            if (tVal != ' ') {
                Ext.each(listpersonas, function (rec) {
                    var tStr = rec.data.nombreapellidos.toString().toLowerCase();
                    if (tStr.indexOf(tVal) != -1) {
                        conicidencias.push(new modelo.recQrElement({
                            idplanvacaciones: rec.data.idplanvacaciones,
                            idpersona: rec.data.idpersona,
                            noidentidad: rec.data.noidentidad,
                            idarea: rec.data.idarea,
                            nombreapellidos: rec.data.nombreapellidos,
                            vacacumuladas: rec.data.vacacumuladas,
                            quincena: rec.data.quincena,
                            diashabiles: rec.data.diashabiles,
                            fdesde: rec.data.fdesde,
                            fhasta: rec.data.fhasta,
                            diasnaturales: rec.data.diasnaturales,
                            idmes: rec.data.idmes,
                            mes: rec.data.mes,
                            anno: rec.data.anno,
                            bandera: rec.data.bandera
                        }));
                    }
                });
                modelo.fuenteDatosListadoModeloVac.removeAll();
                vista.listadoModeloVac.getStore().add(conicidencias);

                if (conicidencias.length == 0) {
                    mostrarMensaje(1, idioma.MsgNoResultMostrar);
                    vista.btnGenerar.disable();
                }
            }
        }

        vista.btnLimpiarVac.on('click', function () {
            vista.tfbuscarVac.reset();
            modelo.fuenteDatosListadoModeloVac.removeAll();
            var idestructura = vista.estructura.tree.getSelectionModel().getSelectedNode().id;
            var idpersonas = new Array();
            var seleccionados = vista.listado.getSelectionModel().getSelections();
            if (seleccionados.length > 0) {
                Ext.each(seleccionados, function (rec) {
                    idpersonas.push(rec.data.idpersona);
                });
            }
            modelo.fuenteDatosListadoModeloVac.load({
                params: {
                    idpersonas: Ext.encode(idpersonas),
                    anno: vista.comboYear.getValue(), idestructura: idestructura
                }
            });
        });

        vista.btnEliminar.on('click', function () {
            eliminarVacaciones();
        }, this);

        function eliminarVacaciones() {
            var datos = new Array();
            var seleccionados = vista.listadoModeloVac.getSelectionModel().getSelections();

            if (seleccionados.length > 0) {
                Ext.each(seleccionados, function (rec) {
                    var params = {
                        idpersona: rec.data.idpersona,
                        fdesde: rec.data.fdesde,
                        fhasta: rec.data.fhasta
                    };
                    datos.push(params);
                });
            }
            PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Eliminando vacaciones...');
            Ext.Ajax.request({
                url: 'eliminarVacaciones',
                method: 'POST',
                params: {
                    datos: Ext.encode(datos)
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('mascaraEnviarDatos');
                    var responseData = Ext.decode(response.responseText);
                    if (responseData == true) {
                        mostrarMensaje(1, idioma.lbMsgEliminarExito);
                        modelo.fuenteDatosListadoModeloVac.modified = [];
                    }
                    var idestructura = vista.estructura.tree.getSelectionModel().getSelectedNode().id;
                    var idpersonas = new Array();
                    var seleccionados = vista.listado.getSelectionModel().getSelections();
                    if (seleccionados.length > 0) {
                        Ext.each(seleccionados, function (rec) {
                            idpersonas.push(rec.data.idpersona);
                        });
                    }
                    modelo.fuenteDatosListadoModeloVac.load({
                        params: {
                            idpersonas: Ext.encode(idpersonas),
                            anno: vista.comboYear.getValue(), idestructura: idestructura
                        }
                    });
                }
            });
        }

        vista.btnCerrar.on('click', function () {
            vista.ventanaGestion.hide();
        }, this);

        vista.btnCancelar.on('click', function () {
            vista.ventanaRadios.hide();
        }, this);

        vista.btnGenerar.on('click', function () {
            vista.ventanaRadios.show();
            vista.cbRevisadopor.setValue('');
            vista.cbRevisadopor.setRawValue('');
            vista.cbAprobadopor.setValue('');
            vista.cbAprobadopor.setRawValue('');
            scope.variablesRevisadopor.idpersona = -1;
            scope.variablesRevisadopor.nombrepersona = '';
            scope.variablesRevisadopor.cargopersona = '';
            scope.variablesRevisadopor.personaseleccionada = 0;
            scope.variablesAprobadopor.idpersona = -1;
            scope.variablesAprobadopor.nombrepersona = '';
            scope.variablesAprobadopor.cargopersona = '';
            scope.variablesAprobadopor.personaseleccionada = 0;
        }, this);

        vista.gpRevisadopor.getSelectionModel().on('rowselect', function (sm, numb, rec) {
            vista.btnAceptarRevisadopor.enable();
            scope.variablesRevisadopor.nombrepersona = rec.data.nombreapellidos;
            scope.variablesRevisadopor.idpersona = rec.data.idpersona;
            scope.variablesRevisadopor.cargopersona = rec.data.denomcargo;
            scope.variablesRevisadopor.personaseleccionada = 1;
        }, this);

        vista.gpRevisadopor.getSelectionModel().on('rowdeselect', function (sm, numb, rec) {
            vista.btnAceptarRevisadopor.disable();
            scope.variablesRevisadopor.personaseleccionada = 0;
        }, this);

        vista.cbRevisadopor.on('focus', function () {
            scope.variablesRevisadopor.nombrepersona = '';
            scope.variablesRevisadopor.cargopersona = '';
            scope.variablesRevisadopor.idpersona = -1;
            scope.variablesRevisadopor.personaseleccionada = 0;
            vista.tfbuscarRevisadopor.reset();
            modelo.storeRevisadopor.removeAll();
            vista.winRevisadopor.show();
            modelo.storeRevisadopor.baseParams.idestructura = vista.estructura.inicial;
            modelo.storeRevisadopor.load({
                params: {
                    start: 0,
                    limit: 15,
                    filtro: vista.tfbuscarRevisadopor.getValue(),
                }, callback: function (r, opt, suc) {
                }
            });
        });

        vista.btnLimpiarRevisadopor.on('click', function () {
            vista.tfbuscarRevisadopor.reset();
            modelo.storeRevisadopor.removeAll();
            modelo.storeRevisadopor.baseParams.idestructura = vista.estructura.inicial;
            modelo.storeRevisadopor.load({
                params: {
                    start: 0,
                    limit: 15,
                    filtro: vista.tfbuscarRevisadopor.getValue(),
                }, callback: function (r, opt, suc) {
                }
            });
        });

        vista.btnBuscarRevisadopor.on('click', function () {
            modelo.storeRevisadopor.baseParams.idestructura = vista.estructura.inicial;
            modelo.storeRevisadopor.load({
                params: {
                    start: 0,
                    limit: 15,
                    filtro: vista.tfbuscarRevisadopor.getValue(),
                }, callback: function (r, opt, suc) {
                }
            });
        });

        vista.btnCancelarRevisadopor.setHandler(function () {
            vista.winRevisadopor.hide();
        });

        vista.btnAceptarRevisadopor.on('click', function () {
            vista.cbRevisadopor.setRawValue(scope.variablesRevisadopor.idpersona);
            vista.cbRevisadopor.setValue(scope.variablesRevisadopor.nombrepersona);
            vista.winRevisadopor.hide();
        });

        vista.gpAprobadopor.getSelectionModel().on('rowselect', function (sm, numb, rec) {
            vista.btnAceptarAprobadopor.enable();
            scope.variablesAprobadopor.nombrepersona = rec.data.nombreapellidos;
            scope.variablesAprobadopor.idpersona = rec.data.idpersona;
            scope.variablesAprobadopor.cargopersona = rec.data.denomcargo;
            scope.variablesAprobadopor.personaseleccionada = 1;
        }, this);

        vista.gpAprobadopor.getSelectionModel().on('rowdeselect', function (sm, numb, rec) {
            vista.btnAceptarAprobadopor.disable();
            scope.variablesAprobadopor.personaseleccionada = 0;
        }, this);

        vista.cbAprobadopor.on('focus', function () {
            scope.variablesAprobadopor.nombrepersona = '';
            scope.variablesAprobadopor.cargopersona = '';
            scope.variablesAprobadopor.idpersona = -1;
            scope.variablesAprobadopor.personaseleccionada = 0;
            vista.tfbuscarAprobadopor.reset();
            modelo.storeAprobadopor.removeAll();
            vista.winAprobadopor.show();
            modelo.storeAprobadopor.baseParams.idestructura = vista.estructura.inicial;
            modelo.storeAprobadopor.load({
                params: {
                    start: 0,
                    limit: 15,
                    filtro: vista.tfbuscarAprobadopor.getValue(),
                }, callback: function (r, opt, suc) {
                }
            });
        });

        vista.btnLimpiarAprobadopor.on('click', function () {
            vista.tfbuscarAprobadopor.reset();
            modelo.storeAprobadopor.removeAll();
            modelo.storeAprobadopor.baseParams.idestructura = vista.estructura.inicial;
            modelo.storeAprobadopor.load({
                params: {
                    start: 0,
                    limit: 15,
                    filtro: vista.tfbuscarAprobadopor.getValue(),
                }, callback: function (r, opt, suc) {
                }
            });
        });

        vista.btnBuscarAprobadopor.on('click', function () {
            modelo.storeAprobadopor.baseParams.idestructura = vista.estructura.inicial;
            modelo.storeAprobadopor.load({
                params: {
                    start: 0,
                    limit: 15,
                    filtro: vista.tfbuscarAprobadopor.getValue(),
                }, callback: function (r, opt, suc) {
                }
            });
        });

        vista.btnCancelarAprobadopor.setHandler(function () {
            vista.winAprobadopor.hide();
        });

        vista.btnAceptarAprobadopor.setHandler(function () {
            vista.cbAprobadopor.setRawValue(scope.variablesAprobadopor.idpersona);
            vista.cbAprobadopor.setValue(scope.variablesAprobadopor.nombrepersona);
            vista.winAprobadopor.hide();
        });

        vista.btnAceptar.on('click', function () {
            vista.ventanaRadios.hide();
            vista.cbRevisadopor.setValue('');
            vista.cbRevisadopor.setRawValue('');
            vista.cbAprobadopor.setValue('');
            vista.cbAprobadopor.setRawValue('');
            ExportarModeloVac();
            scope.variablesRevisadopor.idpersona = -1;
            scope.variablesRevisadopor.nombrepersona = '';
            scope.variablesRevisadopor.cargopersona = '';
            scope.variablesRevisadopor.personaseleccionada = 0;
            scope.variablesAprobadopor.idpersona = -1;
            scope.variablesAprobadopor.nombrepersona = '';
            scope.variablesAprobadopor.cargopersona = '';
            scope.variablesAprobadopor.personaseleccionada = 0;
        }, this);

        function ExportarModeloVac() {
            var idestructura = vista.estructura.tree.getSelectionModel().getSelectedNode().id;
            var fecha = new Date();
            var idpersonas = new Array();
            var idpersonasplanvac = new Array();
            var result = new Array();
            var resultado = new Array();
            var seleccionadosplanvac;
            // console.info(modelo.fuenteDatosListadoModeloVac.data.items);            
            if(vista.smPersonaVac.getCount() == 0)
                 seleccionadosplanvac = modelo.fuenteDatosListadoModeloVac.data.items;
            else
                 seleccionadosplanvac = vista.smPersonaVac.getSelections();
            if (seleccionadosplanvac.length > 0) {
                Ext.each(seleccionadosplanvac, function (rec) {					
                    recpersonasplanvac = {
                        idpersona: rec.data.idpersona,
                        diasnaturales: rec.data.diasnaturales,
                        fdesde: rec.data.fdesde,
                        fhasta: rec.data.fhasta,
                        idmes: rec.data.idmes
                    };
                    idpersonasplanvac.push(recpersonasplanvac);
                });
            }

            var seleccionados = vista.listadoModeloVac.getSelectionModel().getSelections();
            if (seleccionados.length > 0) {
                Ext.each(seleccionados, function (rec) {
                    idpersonas.push(rec.data.idpersona);
                });
            }

            Ext.each(idpersonasplanvac, function (record) {
                Ext.each(idpersonas, function (rec) {
                    if (record.idpersona == rec) {
                        result.push(record);
                    }
                });
            });

            if (seleccionados.length == 0) {
                resultado = idpersonasplanvac;
            } else {
                resultado = result;
            }

            var revisadopor = ({
                idpersona:(scope.variablesRevisadopor.idpersona == -1) ? null : scope.variablesRevisadopor.idpersona,
                nombrepersona:(scope.variablesRevisadopor.nombrepersona == '') ? null : scope.variablesRevisadopor.nombrepersona,
                cargopersona:(scope.variablesRevisadopor.cargopersona == '') ? null : scope.variablesRevisadopor.cargopersona,
            });
            var aprobadopor = ({
                idpersona:(scope.variablesAprobadopor.idpersona == -1) ? null : scope.variablesAprobadopor.idpersona,
                nombrepersona:(scope.variablesAprobadopor.nombrepersona == '') ? null : scope.variablesAprobadopor.nombrepersona,
                cargopersona:(scope.variablesAprobadopor.cargopersona == '') ? null : scope.variablesAprobadopor.cargopersona,
            });
            var params = {
                anno: vista.comboYear.getValue(),
                idestructura: idestructura,
                idpersonasplanvac: resultado,
                fecha: fecha.format('d/m/Y'),
                datos: vista.formulario.getForm().items.items[0].getValue(),
                revisadopor: revisadopor,
                aprobadopor: aprobadopor
            };
            var idIframe = Ext.id();
            PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Generando modelos...');
            Ext.Ajax.request({
                url: 'recibirParametrosExportarModeloCVacaciones',
                method: 'POST',
                params: {
                    params: Ext.encode(params)
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('mascaraEnviarDatos');
                    var responseData = Ext.decode(response.responseText);
                    modelo.fuenteDatosListadoModeloVac.modified = [];
                    if (responseData == true) {
                        new Ext.Window({
                            title: 'Modelo SC-404 Vacaciones',
                            width: 800,
                            height: 500,
                            id: 'winregistro',
                            maskDisabled: false,
                            animCollapse: false,
                            maximizable: true,
                            constrainHeader: true,
                            border: false,
                            modal: true,
                            items: {
                                xtype: 'component',
                                autoEl: {
                                    tag: 'iframe',
                                    id: idIframe,
                                    style: 'height: 100%; width: 100%; border: none',
                                    src: document.location.protocol + '//' + document.location.host +
                                    '/pvd/regimentrabajo/index.php/planificacionvacaciones/exportarmodeloscvacaciones'
                                }
                            }
                        }).show();
                        Ext.getCmp('winregistro').maximize();
                        PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte.');
                        document.getElementById(idIframe).onload = function () {
                            PVD.ocultarMascara('rep01');
                        }
                    }
                }
            });
        }
        ///////////////////////////////////MODELO DE VACACIONES///////////////////////////////////

        ///////////////////////////////////ACTA DE POSPOSICON DE VACACIONES///////////////////////////////////
        vista.gpPersonas.getSelectionModel().on('rowselect', function (sm, numb, rec) {
            vista.btnAceptarPersonas.enable();
            scope.variables.nombrepersona = rec.data.nombreapellidos;
            scope.variables.idpersona = rec.data.idpersona;
            scope.variables.cargopersona = rec.data.denomcargo;
            scope.variables.personaseleccionada = 1;
        }, this);

        vista.gpPersonas.getSelectionModel().on('rowdeselect', function (sm, numb, rec) {
            vista.btnAceptarPersonas.disable();
            scope.variables.personaseleccionada = 0;
        }, this);

        vista.cbPersona.on('focus', function () {
            vista.tfbuscarPersWin.reset();
            modelo.storePersona.removeAll();
            vista.winPersonas.show();
            modelo.storePersona.baseParams.idestructura = scope.idestructura;
            modelo.storePersona.load({
                params: {
                    start: 0,
                    limit: 15,
                    filtro: vista.tfbuscarPersWin.getValue(),
                }, callback: function (r, opt, suc) {
                }
            });
        });

        vista.btnLimpiarPersWin.on('click', function () {
            vista.tfbuscarPersWin.reset();
            modelo.storePersona.removeAll();
            modelo.storePersona.baseParams.idestructura = scope.idestructura;
            modelo.storePersona.load({
                params: {
                    start: 0,
                    limit: 15,
                    filtro: vista.tfbuscarPersWin.getValue(),
                }, callback: function (r, opt, suc) {
                }
            });
        });

        vista.btnBuscarPersWin.on('click', function () {
            modelo.storePersona.baseParams.idestructura = scope.idestructura;
            modelo.storePersona.load({
                params: {
                    start: 0,
                    limit: 15,
                    filtro: vista.tfbuscarPersWin.getValue(),
                }, callback: function (r, opt, suc) {
                }
            });
        });

        vista.btnCancelarPersonas.on('click', function () {
            vista.winPersonas.hide();
        });

        vista.btnAceptarPersonas.on('click', function () {
            vista.cbPersona.setRawValue(scope.variables.idpersona);
            vista.cbPersona.setValue(scope.variables.nombrepersona);
            vista.winPersonas.hide();
        });

        vista.gpPersonasSS.getSelectionModel().on('rowselect', function (sm, numb, rec) {
            vista.btnAceptarPersonasSS.enable();
            scope.variablesSS.nombrepersona = rec.data.nombreapellidos;
            scope.variablesSS.idpersona = rec.data.idpersona;
            scope.variablesSS.cargopersona = rec.data.denomcargo;
            scope.variablesSS.personaseleccionada = 1;
        }, this);

        vista.gpPersonasSS.getSelectionModel().on('rowdeselect', function (sm, numb, rec) {
            vista.btnAceptarPersonasSS.disable();
            scope.variablesSS.personaseleccionada = 0;
        }, this);

        vista.cbPersonaSS.on('focus', function () {
            vista.tfbuscarPersWinSS.reset();
            modelo.storePersonaSS.removeAll();
            vista.winPersonasSS.show();
            modelo.storePersonaSS.baseParams.idestructura = scope.idestructura;
            modelo.storePersonaSS.load({
                params: {
                    start: 0,
                    limit: 15,
                    filtro: vista.tfbuscarPersWinSS.getValue(),
                }, callback: function (r, opt, suc) {
                }
            });
        });

        vista.btnLimpiarPersWinSS.on('click', function () {
            vista.tfbuscarPersWinSS.reset();
            modelo.storePersonaSS.removeAll();
            modelo.storePersonaSS.baseParams.idestructura = scope.idestructura;
            modelo.storePersonaSS.load({
                params: {
                    start: 0,
                    limit: 15,
                    filtro: vista.tfbuscarPersWinSS.getValue(),
                }, callback: function (r, opt, suc) {
                }
            });
        });

        vista.btnBuscarPersWinSS.on('click', function () {
            modelo.storePersonaSS.baseParams.idestructura = scope.idestructura;
            modelo.storePersonaSS.load({
                params: {
                    start: 0,
                    limit: 15,
                    filtro: vista.tfbuscarPersWinSS.getValue(),
                }, callback: function (r, opt, suc) {
                }
            });
        });

        vista.btnCancelarPersonasSS.on('click', function () {
            vista.winPersonasSS.hide();
        });

        vista.btnAceptarPersonasSS.on('click', function () {
            vista.cbPersonaSS.setRawValue(scope.variablesSS.idpersona);
            vista.cbPersonaSS.setValue(scope.variablesSS.nombrepersona);
            vista.winPersonasSS.hide();
        });

        vista.btnCancelarPieFirma.setHandler(function () {
            vista.ventanaPieFirma.hide();
        });

        vista.btnAceptarPieFirma.on('click', function () {
            ExportarPosposicionVac();
            vista.ventanaPieFirma.hide();
            vista.cbPersona.setValue('');
            vista.cbPersona.setRawValue('');
            vista.cbPersonaSS.setValue('');
            vista.cbPersonaSS.setRawValue('');
            scope.variables.idpersona = -1;
            scope.variables.nombrepersona = '';
            scope.variables.cargopersona = '';
            scope.variables.personaseleccionada = 0;
            scope.variablesSS.idpersona = -1;
            scope.variablesSS.nombrepersona = '';
            scope.variablesSS.cargopersona = '';
            scope.variablesSS.personaseleccionada = 0;
        }, this);

        function ExportarPosposicionVac() {
            var denomestructura = vista.estructura.tree.getSelectionModel().getSelectedNode().text;
            var idestructura = vista.estructura.tree.getSelectionModel().getSelectedNode().id;
            var fecha = new Date();
            var idpersonas = new Array();
            var seleccionados = vista.listado.getSelectionModel().getSelections();
            if (seleccionados.length > 0) {
                Ext.each(seleccionados, function (rec) {
                    idpersonas.push(rec.data.idpersona);
                });
            }
            var director = ({
                idpersona:(scope.variables.idpersona == -1) ? null : scope.variables.idpersona,
                nombrepersona:(scope.variables.nombrepersona == '') ? null : scope.variables.nombrepersona,
                cargopersona:(scope.variables.cargopersona == '') ? null : scope.variables.cargopersona,
            });
            var seccionsindical = ({
                idpersona:(scope.variablesSS.idpersona == -1) ? null : scope.variablesSS.idpersona,
                nombrepersona:(scope.variablesSS.nombrepersona == '') ? null : scope.variablesSS.nombrepersona,
                cargopersona:(scope.variablesSS.cargopersona == '') ? null : scope.variablesSS.cargopersona,
            });
            var params = Ext.urlEncode({
                anno: vista.comboYear.getValue(),
                estructura: denomestructura,
                idestructura: idestructura,
                idpersonas: Ext.encode(idpersonas),
                fecha: fecha.format('d/m/Y'),
                filtro: vista.tfbuscar.getValue(),
                director: Ext.encode(director),
                seccionsindical: Ext.encode(seccionsindical)
            });
            var idIframe = Ext.id();
            new Ext.Window({
                title: 'Acta de Posposición de Vacaciones',
                width: 800,
                height: 500,
                id: 'winregistro',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrainHeader: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                        '/pvd/regimentrabajo/index.php/planificacionvacaciones/exportaractaposposicionvacaciones?' + params
                    }
                }
            }).show();
            Ext.getCmp('winregistro').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte.');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        }
        ///////////////////////////////////ACTA DE POSPOSICON DE VACACIONES///////////////////////////////////

        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'blge',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 66: { //b para buscar
                        // if(vista.winReporteNominal.isVisible()){
                        //
                        // }
                        modelo.fuenteDatosListado.modified = [];
                        modelo.fuenteDatosListado.baseParams.anno = vista.comboYear.getValue();
                        modelo.fuenteDatosListado.load({
                            params: {
                                filtro: vista.tfbuscar.getValue(),
                                start: 0,
                                limit: 20,
                                anno: vista.comboYear.getValue()
                            }
                        });
                        break;
                    }
                    case 76: { //l para limpiar
                        vista.tfbuscar.reset();
                        vista.comboYear.setValue(vista.fecha.getFullYear());
                        modelo.fuenteDatosListado.load({
                            params: {start: 0, limit: 20},
                            anno: vista.comboYear.getValue()
                        });
                        break;
                    }
                    case 71: { //g para guardar
                        guardarplanvacaciones();
                        break;
                    }
                    case 69: { //e para exportar
                        Exportar();
                        break;
                    }
                }
            }
        }, {
            key: 13,//Enter para buscar
            fn: function () {
                modelo.fuenteDatosListado.modified = [];
                modelo.fuenteDatosListado.baseParams.anno = vista.comboYear.getValue();
                modelo.fuenteDatosListado.baseParams.idestructura = scope.idestructura;
                modelo.fuenteDatosListado.load({
                    params: {
                        filtro: vista.tfbuscar.getValue(),
                        start: 0,
                        limit: 20,
                        anno: vista.comboYear.getValue()
                    }
                });
            }
        }]);
    }
}