/**
 Uso:Componente para gestionar elementos de persona de reportes y certificaciones.

 * ---------------------------------------------

 * 28 de Marzo de 2013 |   Nomina
 *

 * @extends Ext.Panel
 * @xtype
 * @autor   Linea Capital Humano - Ing. Yadir Martinez Vergara
 * @autor                        - Ing. Frank Rodriguez Berroa
 * @version 1.0.0
 */
Ext.ns('Pvd.Nomina.ReportesyCertificaciones');
Ext.QuickTips.init();
Pvd.Nomina.ReportesyCertificaciones.Utils = function () {
    return {
        loadMask: function (msj, cmp) {
            var componente = (!cmp) ? Ext.getBody() : cmp.body;
            this.lMask = new Ext.LoadMask(componente, {
                msg: msj
            });
            this.lMask.show();
        },
        hideMask: function () {
            this.lMask.hide();
        }
    }
};
var utils = new Pvd.Nomina.ReportesyCertificaciones.Utils();

/*Componente*/
Pvd.Nomina.ReportesyCertificaciones.WinElementosPersona = Ext.extend(Ext.Window, {
    title: (this.title ? this.title : 'Elementos de persona'),
    closable: true,
    closeAction: 'hide',
    region: (this.region ? this.region : 'center'),
    layout: (this.layout ? this.layout : 'border'),
    width: 600,
    height: 400,
    autoScroll: true,
    maximizable: true,
    modal: true,
    idreportescertificaciones: (this.idreportescertificaciones ? this.idreportescertificaciones : -1),
    idconfreportescertificaciones: (this.idconfreportescertificaciones ? this.idconfreportescertificaciones : -1),
    idtipoconfreportescertificaciones: (this.idtipoconfreportescertificaciones ? this.idtipoconfreportescertificaciones : -1),
    comportamientoreportesc4: (this.comportamientoreportesc4 ? this.comportamientoreportesc4 : -1),
    cantidadPorPagina: (this.cantidadPorPagina ? this.cantidadPorPagina : 15),
    valoresVariables: (this.valoresVariables ? this.valoresVariables : null), /*Tipo - object*/
    btnacciones: (this.btnacciones ? this.btnacciones : null),
    idusuario: (this.idusuario ? this.idusuario : null),
    historico: (this.historico ? this.historico : null),
    idusuarioreporte: (this.idusuarioreporte ? this.idusuarioreporte : null),
    identidad: this.identidad,
    modo: (this.modo ? this.modo : 'VISTA'),
    estado: (this.estado ? this.estado : 1),
    initComponent: function () {
        var idperiodoproceso = 0;
        var idreportescertificacionesaux = 0;
        this.arreglo = new Array();
        this.recordperiodopagoexportarseleccionado = null;
        this.arrayidelaborarpagos = new Array();

        this.GuardarEliminarConformarElementos = function (accion, recDatos, aprobar, flag) {
            console.info(recDatos);

            if (recDatos.length > 0 || accion == 'CONFORMAR' || accion == 'APROBAR') {
                var url = '';
                var tipomodificacion = 0;
                var datos = new Array();
                var variables = new Array();
                if (accion == 'MOD' || accion == 'REC') {
                    url = 'modificarelementosreportescertificaciones';
                    tipomodificacion = 1;
                } else if (accion == 'DEL') {
                    url = 'eliminarelementosreportescertificaciones';
                } else {
                    url = 'modificarelementosreportescertificaciones';
                    tipomodificacion = 2;
                }
                if (flag == 0) {
                    for (var i = 0; i < recDatos.length; i++) {
                        if (accion == 'MOD' || accion == 'REC') {
                            if (aprobar == 1) {
                                datos[i] = {
                                    idelementosreportescertificaciones: recDatos[i].data.idelementosreportescertificaciones,
                                    aprobado: recDatos[i].data.aprobado
                                };
                            } else {
                                datos[i] = recDatos[i].data;
                            }

                        }
                        else {
                            datos[i] = recDatos[i].data.idelementosreportescertificaciones;
                        }
                    }
                } else {
                    datos = this.arreglo;
                }

                if (accion == 'MOD' || accion == 'REC') {
                    for (var i = 0; i < this.valoresVariables.length; i++) {
                        variables[i] = this.valoresVariables[i].idvariable;
                    }
                }
                var estado = 1;
                if ((accion == 'MOD' || accion == 'REC') && aprobar == 1) {
                    estado = 2;
                }
                else if (accion == 'CONFORMAR') {
                    estado = 2;
                }
                else if (accion == 'APROBAR') {
                    estado = 3;
                }
                var winload = new Ext.PVD.comun.window.winLoad({
                    title: 'Por favor espere...',
                    mensaje: 'Generando reporte'
                });

                winload.showMask();
                Ext.Ajax.request({
                    url: url,
                    timeout: 50000000,
                    method: 'POST',
                    params: {
                        idreportescertificaciones: this.idreportescertificaciones,
                        idtipoconfreportescertificaciones: this.idtipoconfreportescertificaciones,
                        identidad: this.identidad,
                        elementos: Ext.encode(datos),
                        variables: Ext.encode(variables),
                        estado: estado,
                        idconfreportescertificaciones: this.idconfreportescertificaciones,
                        aprobar: (accion == 'APROBAR' && aprobar != 1 ? 1 : -1),
                        conformar: (accion == 'CONFORMAR' && aprobar != 1 ? 1 : -1),
                        accion: accion
                    },
                    callback: function (options, success, response) {
                        winload.hideMask();
                        var respuesta = Ext.decode(response.responseText);
                        if (respuesta.codigo == 'MOD-1') {
                            mostrarMensaje(1, 'Los elementos de persona se guardaron satisfactoriamente.');
                        } else if (respuesta.codigo == 'DEL-1') {
                            mostrarMensaje(1, 'Los elementos de persona se eliminaron satisfactoriamente.');
                        } else if (respuesta.codigo == 'CONFORMAR-1') {
                            mostrarMensaje(1, 'El reporte y certificaci&oacute;n ha sido conformado satisfactoriamente.', function () {
                                this.fireEvent('reporteconformado', this);
                                this.close();
                                this.arreglo = new Array();
                            }.createDelegate(this));
                        } else if (respuesta.codigo == 'APROBAR-1') {
                            mostrarMensaje(1, 'El reporte y certificaci&oacute;n ha sido aprobado satisfactoriamente.', function () {
                                this.fireEvent('reporteaprobado', this);
                                this.close();
                                this.arreglo = new Array();
                            }.createDelegate(this));
                        }
                        this.stElementosPersona.commitChanges();
                        this.btnacciones[1].disable();
                        this.Cargar();
                    }.createDelegate(this)
                });


            } else {
                if (accion == 'DEL')
                    mostrarMensaje(1, 'Debe seleccionar un elemento.');
                return;
            }
        }
        /*Boton ADICIONAR*/
        this.btnacciones[0].setHandler(function () {
            if (this.estado == 1) {
                var btnAceptarBusPer = new Ext.Button({
                    id: 'btnAceptarBusPer' + this.id,
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    tooltip: 'Aceptar',
                    disabled: true,
                    handler: function () {
                        var persSel = pbuscarpersona.getSelectedRows();
                        var arrIdsEl = new Array();
                        for (var i = 0; i < persSel.length; i++)
                            arrIdsEl[i] = persSel[i].data.idpersona;
                        var winload = new Ext.PVD.comun.window.winLoad({
                            title: 'Por favor espere...',
                            mensaje: 'Adicionando datos'
                        });

                        winload.showMask();
                        Ext.Ajax.request({
                            url: 'adicionarelementosreportescertificaciones',
                            method: 'POST',
                            timeout: 500000000,
                            params: {
                                idreportescertificaciones: this.idreportescertificaciones,
                                elementos: Ext.encode(arrIdsEl),
                                identidad: this.identidad,
                                idconfreporte: this.idconfreportescertificaciones,
                                aprobado: 0
                            },
                            callback: function (options, success, response) {
                                var respuesta = Ext.decode(response.responseText);
                                winload.hideMask();
                                if (respuesta.codigo == 'ADD-1') {
                                    this.Cargar();
                                    mostrarMensaje(1, 'El elemento persona se adicion&oacute; satisfactoriamente.');
                                    winbuscarpersona.close();
                                    return;

                                } else {
                                    return;
                                }

                            }.createDelegate(this)
                        });

                    }.createDelegate(this)
                });

                var btnCancelarBusPer = new Ext.Button({
                    id: 'btnCancelarBusPer' + this.id,
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    tooltip: 'Cancelar',
                    handler: function () {
                        winbuscarpersona.close();
                    }
                });

                var pbuscarpersona = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                    id: 'pbuscarpersona' + this.id,
                    singleSelect: false,
                    height: '70%',
                    modulo: 'NOMINA',
                    funcionalidad: 'CESP',
                    identidad: this.identidad,
                    cantidadPorPaginas: 5000
                });

                pbuscarpersona.on('personaselecionada', function (fila) {
                    btnAceptarBusPer.enable();
                });

                pbuscarpersona.CambiarEntidad(this.identidad);
                pbuscarpersona.Buscar();


                var winbuscarpersona = new Ext.Window({
                    layout: 'border',
                    title: 'Buscar persona',
                    width: 600,
                    height: 400,
                    closeAction: 'hide',
                    closable: true,
                    constrain: true,
                    plain: false,
                    modal: true,
                    resizable: true,
                    items: [pbuscarpersona],
                    buttons: [btnCancelarBusPer, btnAceptarBusPer]
                });
                winbuscarpersona.show();

            } else {
                mostrarMensaje(1, 'El reporte y certificaci&oacute;n ha sido conformado.')
            }

        }.createDelegate(this));
        /*Boton ELIMINAR*/
        this.btnacciones[1].setHandler(function () {
            if (this.estado == 1) {
                this.GuardarEliminarConformarElementos('DEL', this.gpElementosPersona.getSelectionModel().getSelections(), 2, 0);
            } else {
                mostrarMensaje(1, 'El reporte y certificaci&oacute;n ha sido conformado.')
            }
        }.createDelegate(this));

        this.varificarElementoVacio = function (arrElem) {
            if (this.idconfreportescertificaciones == 24 || this.idconfreportescertificaciones == 25 || this.idconfreportescertificaciones == 26 || this.idconfreportescertificaciones == 27) {
                return null;
            }
            for (var i = 0; i < arrElem.length; i++) {
                for (var j = 0; j < this.valoresVariables.length; j++) {
                    if (!arrElem[i].get(this.valoresVariables[j].idvariable) && arrElem[i].get(this.valoresVariables[j].idvariable) != 0) {
                        return [i, 4 + j];
                    }
                }
            }
            //}
            return null;
        }.createDelegate(this);

        /*Boton Conformar*/
        this.btnacciones[2].setHandler(function () {
            if (this.stElementosPersona.getModifiedRecords().length <= 0) {
                var error = this.varificarElementoVacio(this.stElementosPersona.getRange(0, this.stElementosPersona.getTotalCount()));
                //if (!error) {
                    if (this.estado == 1) {
                        mostrarMensaje(2, 'Est&aacute; seguro que desea conformar el reporte y certificaci&oacute;n?', function (boton) {
                            if (boton == "ok") {
                                this.GuardarEliminarConformarElementos('APROBAR', new Array(), 2, 0);
                            }
                            return;
                        }.createDelegate(this));
                    } else {
                        mostrarMensaje(1, 'El reporte y certificaci&oacute;n ha sido conformado.');
                    }
                /*} else {
                    mostrarMensaje(1, 'Existen elementos que no se han completado.', function () {
                        this.gpElementosPersona.stopEditing();
                        this.gpElementosPersona.startEditing(error[0], error[1]);
                    }.createDelegate(this));
                }*/
            } else {
                mostrarMensaje(1, 'Debe guardar los cambios realizados antes de conformar el reporte.');
            }
        }.createDelegate(this));

        this.selModelGrid = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sel, i, r) {
                    this.btnacciones[1].enable();
                }.createDelegate(this)
            }
        })

        /*Boton APROBAR*/
        this.btnacciones[3].setHandler(function () {
            if (this.stElementosPersona.getModifiedRecords().length <= 0) {
                //if (this.estado == 2) {
                mostrarMensaje(2, 'Est&aacute; seguro que desea aprobar el reporte y certificaci&oacute;n?', function (boton) {
                    if (boton == "ok") {
                        var contador = this.stElementosPersona.getTotalCount();
                        var todoselementos = this.stElementosPersona.getRange(0, contador - 1);

                        var auxid = new Array();
                        var auxarrayDatos = new Array();
                        var contaux = 0;
                        for (var i = 0; i < contador; i++) {
                            if (todoselementos[i].data.aprobado == 1) {
                                contaux++;
                            }
                        }
                        // console.info(contaux);
                        // console.info(contador);
                        // console.info(todoselementos);

                        // if (contaux == 0) {
                        //     mostrarMensaje(3, 'No ha aprobado ningun elemento', function (boton) {
                        //     });
                        // } else if (contador > contaux) {
                        //     mostrarMensaje(2, 'Faltan elementos por aprobar. Esta seguro que desea aprobar el reporte?', function (boton) {
                        //         if (boton == "ok") {
                        //             this.GuardarEliminarConformarElementos('APROBAR', new Array(), 2, 0);
                        //         }
                        //     }.createDelegate(this));
                        // }
                        // else if (contador = contaux) {
                        this.GuardarEliminarConformarElementos('APROBAR', new Array(), 2, 0);
                        // }


                    }
                    return;
                }.createDelegate(this));
                /*} else {
                    mostrarMensaje(1, 'El reporte y certificaci&oacute;n no ha sido conformado.')
                }*/
            } else {
                mostrarMensaje(1, 'Debe guardar los cambios realizados antes de aprobar el reporte.');
            }
        }.createDelegate(this));
        /*Boton GUARDAR*/
        this.btnacciones[4].setHandler(function () {
            if (this.estado == 1) {
                this.GuardarEliminarConformarElementos('MOD', this.stElementosPersona.getModifiedRecords(), 2, 0);
            } else if (this.estado == 2) {
                this.GuardarEliminarConformarElementos('MOD', this.stElementosPersona.getModifiedRecords(), 1, 1);
            }

        }.createDelegate(this));

        //Componentes de la ventana para buscar en nominas y reportes
        this.objListarPeriodosPagos = new Pvd.Nomina.ElaborarPago.ListarPeriodosPago({
            identidad: this.identidad,
        });
        this.objListarPeriodosPagos.cbTipoPago.setSize(400, 10);

        this.stReportesCertificaciones = new Ext.data.GroupingStore({
            url: '/pvd/nomina/index.php/gestionarreportesycertificaciones/obtenerDatosReportesxConfReportes',
            sortInfo: {field: 'fechainicio', direction: "ASC"},
            groupField: 'confreportescertificaciones',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idreportescertificaciones"},
                [{name: 'idreportescertificaciones'}
                    , {name: 'idconfreportescertificaciones'}
                    , {name: 'confreportescertificaciones'}
                    , {name: 'nivel'}
                    , {name: 'fechainicio'}
                    , {name: 'fechafin'}
                    , {name: 'estado'}
                    , {name: 'identidad'}
                    , {name: 'idusuario'}
                ])
        });

        this.smreport = new Ext.grid.CheckboxSelectionModel();

        this.cmReportesCertificaciones = new Ext.grid.ColumnModel([
            this.smreport,
            {
                id: 'idreportescertificaciones',
                header: "idreportescertificaciones",
                dataIndex: 'idreportescertificaciones',
                hidden: true,
                hideable: false
            }, {
                header: "idconfreportescertificaciones",
                dataIndex: 'idconfreportescertificaciones',
                hidden: true,
                hideable: false
            }, {
                header: "Tipo",
                dataIndex: 'confreportescertificaciones',
                hidden: true,
                hideable: false
            }, {
                header: "Nivel",
                dataIndex: 'nivel',
                hidden: true,
                hideable: false
            }, {
                header: "Fecha de inicio",
                dataIndex: 'fechainicio',
                width: 100
            }, {
                header: "Fecha de fin",
                dataIndex: 'fechafin',
                width: 100
            }, {
                header: "Estado del reporte",
                dataIndex: 'estado',
                width: 150,
                hidden: true,
                hideable: false
            }, {
                header: "identidad",
                dataIndex: 'identidad',
                hidden: true,
                hideable: false
            }, {
                header: "idusuario",
                dataIndex: 'idusuario',
                hidden: true,
                hideable: false
            }
        ]);
        this.cmReportesCertificaciones.defaultSortable = true;
        this.gpReportesCertificaciones = new Ext.grid.GridPanel({
            title: 'Listado de reportes y certificaciones',
            store: this.stReportesCertificaciones,
            region: 'west',
            loadMask: {text: 'Cargando...'},
            width: '50%',
            cm: this.cmReportesCertificaciones,
            viewConfig: {
                forceFit: true
            },
            split: true,
            view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text}'}),
            sm: this.smreport
        });

        this.btnAceptarNominasReportes = new Ext.Button({
            id: 'btnAceptarNominasReportes',
            iconCls: 'aceptar',
            //disabled: true,
            // icon: perfil.dirImg + 'aceptar.png',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
        });

        this.btnCancelarNominasReportes = new Ext.Button({
            id: 'btnCancelarNominasReportes',
            iconCls: 'cancelar',
            disabled: false,
            icon: perfil.dirImg + 'cancelar.png',
            text: 'Cancelar',
            closeAction: 'hide',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
        });

        this.winNominasReportes = new Ext.Window({
            title: 'Listado de Per&iacute;odos de Pago  y Reportes',
            modal: true,
            height: 400,
            width: 1000,
            closable: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'border',
            items: [this.objListarPeriodosPagos, this.gpReportesCertificaciones],
            buttons: [this.btnCancelarNominasReportes, this.btnAceptarNominasReportes]
        });

        this.cantidadhistoricoreportes = 0;
        this.arrhistoricoreportes = 0;
        this.cantidadhistoriconominas = 0;
        this.arrhistoriconominas = 0;
        this.idelaborarpagos = null;

        this.objListarPeriodosPagos.on('periodopagoseleccionado', function (fila) {
            this.idelaborarpagos = fila.data.idelaborarpagos;
        }.createDelegate(this));

        this.btnCancelarNominasReportes.on('click', function (gp, n, r) {
            this.winNominasReportes.hide();
        }.createDelegate(this));

        this.btnAceptarNominasReportes.on('click', function (gp, n, r) {
            var _this = this;
            //Enviando los reportes, las personas y las nominas para evaluar las formulas
            var arrayhisreportes = this.gpReportesCertificaciones.getSelectionModel().getSelections();
            var arrayidreportes = new Array();
            for (var i = 0; i < arrayhisreportes.length; i++) {
                arrayidreportes[i] = arrayhisreportes[i].data.idreportescertificaciones;
            }
            PVD.mostrarMascara('idmaskobtenerdatosrepnominas', 'Por favor espere...', 'Enviando datos');
            Ext.Ajax.request({
                url: 'actualizarvalorespersonasnominasreportes',
                method: 'POST',
                params: {
                    arrayhisreportes: Ext.encode(arrayidreportes),
                    idelaborarpagos: this.idelaborarpagos,
                    idconfreporte: this.idconfreportescertificaciones,
                    idreportescertificaciones: this.idreportescertificaciones,
                    arrhistoricoconfreportes: Ext.encode(this.arrhistoricoreportes),
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmaskobtenerdatosrepnominas');
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'OK') {
                        mostrarMensaje(1, 'El reporte fue actualizado correctamente');
                    }
                    _this.idelaborarpagos = null;
                    _this.winNominasReportes.hide();
                    _this.stElementosPersona.reload();
                }
            });
        }.createDelegate(this));

        /*Boton GUARDAR*/
        this.btnacciones[17].setHandler(function () {
            var _this = this;
            //Obteniendo si hay un tipo de pago o un historico donde  buscar
            PVD.mostrarMascara('idmaskdatosrep', 'Por favor espere...', 'Enviando datos');
            Ext.Ajax.request({
                url: 'obtenerdatosnominasreportes',
                method: 'POST',
                params: {
                    idconfreportescertificaciones: this.idconfreportescertificaciones,
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmaskdatosrep');
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.confreportes.length > 0 || respuesta.estructurasnominas.length > 0) {
                        _this.stReportesCertificaciones.load({
                            params: {
                                identidad: _this.identidad,
                                arrconfreportes: Ext.encode(respuesta.confreportes)
                            }
                        });
                        _this.winNominasReportes.show();
                    }
                    _this.cantidadhistoricoreportes = respuesta.confreportes.length;
                    _this.arrhistoricoreportes = respuesta.confreportes;
                    _this.cantidadhistoriconominas = respuesta.estructurasnominas.length;
                    _this.arrhistoriconominas = respuesta.estructurasnominas;
                }
            });
            if (this.estado == 1) {
                
                var cont = this.stElementosPersona.getCount();
                var todos = this.stElementosPersona.getRange(0, cont - 1);
                console.log(todos)
                this.GuardarEliminarConformarElementos('REC', todos, 2, 0);
            }

        }.createDelegate(this));

        if (this.estado == 1) {
            this.btnacciones[5].hide();
        }
        /*Boton Elaborar*/
        this.btnacciones[5].setHandler(function () {
            PVD.mostrarMascara('idmaskchangeelab', 'Por favor espere...', 'Enviando datos');
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/gestionarreportesycertificaciones/cambiarestadoelaborado',
                method: 'POST',
                timeout: 50000000000000000,
                params: {
                    idreportescertificaciones: this.idreportescertificaciones,
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    PVD.ocultarMascara('idmaskchangeelab');
                    mostrarMensaje(1, 'El estado fue pasado a Elaborado satisfactoriamente.');
                    this.fireEvent('reporteelaborado', this);
                    this.close();
                    this.arreglo = new Array();


                }.createDelegate(this)
            });

        }.createDelegate(this));

        this.gpListProces = new Ext.PVD.Evaluaciones.ListProcesoEvaluativo({
            region: 'center',
            margins: '5 5 5 5',
            labels: 'Procesos evaluativos',
            url: '/pvd/evaluaciones/procesoevaluativo/index.php/prepararproceso/todospreprocesosevaluativos',
            listeners: {
                rowdblclick: function (grid, rowIndex, eventObj) {
                    if (grid.getSelectionModel().getSelected().get('_is_leaf')) {
                        this.btnAceptarProcesosEvaluativos.enable();
                        idperiodoproceso = grid.getSelectionModel().getSelected().get('idperiodoproceso');
                    } else {
                        this.btnAceptarProcesosEvaluativos.disable();
                    }
                }.createDelegate(this),
                cellclick: function (grid, rowIndex, columnIndex, eventObj) {
                    if (grid.getSelectionModel().getSelected().get('_is_leaf') == true) {
                        this.btnAceptarProcesosEvaluativos.enable();
                        idperiodoproceso = grid.getSelectionModel().getSelected().get('idperiodoproceso');
                    } else {
                        this.btnAceptarProcesosEvaluativos.disable();
                    }
                }.createDelegate(this)
            }
        });

        //Botones de la ventana de procesos evaluativos
        this.btnCancelarProcesosEvaluativos = new Ext.Button({
            id: 'btnProcesosEvaluativos',
            iconCls: 'btn',
            icon: perfil.dirImg + 'cancelar.png',
            text: 'Cancelar',
            tooltip: 'Cancelar',
        });

        this.btnAceptarProcesosEvaluativos = new Ext.Button({
            id: 'btnAceptarProcesosEvaluativos',
            iconCls: 'btn',
            disabled: true,
            icon: perfil.dirImg + 'aceptar.png',
            text: 'Aceptar',
            tooltip: 'Aceptar',
        });

        this.wingridProcesosEvaluativos = new Ext.Window({
            title: 'Procesos evaluativos',
            modal: true,
            height: 600,
            width: 800,
            closable: true,
            constrain: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            items: [this.gpListProces],
            buttons: [this.btnCancelarProcesosEvaluativos, this.btnAceptarProcesosEvaluativos]
        });

        this.btnCancelarProcesosEvaluativos.on('click', function () {
            this.wingridProcesosEvaluativos.hide();
            this.btnAceptarProcesosEvaluativos.disable();
        }.createDelegate(this));

        this.btnAceptarProcesosEvaluativos.on('click', function () {
            var variables = Array();
            for (var i = 0; i < this.valoresVariables.length; i++) {
                variables[i] = this.valoresVariables[i].idvariable;
            }
            PVD.mostrarMascara('idmaskenviareval', 'Por favor espere...', 'Actualizando el reporte de evaluaciones');
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/gestionarreportesycertificaciones/actualizarReporteEvaluaciones',
                timeout: 5000000000000000000,
                method: 'POST',
                params: {
                    idperiodoproceso: idperiodoproceso,
                    idreportescertificaciones: this.idreportescertificaciones,
                    idconfreportescertificaciones: this.idconfreportescertificaciones,
                    variables: variables[0]
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    this.wingridProcesosEvaluativos.hide();
                    mostrarMensaje(3, '<b>' + respuesta.personasnoevaluadas + '</b> faltan aun por ser evaluados', function (btn) {
                        if (btn == 'ok') {
                            this.stElementosPersona.reload();
                        }
                    }.createDelegate(this));

                    if (respuesta.error == "NO-CONFIG-NOMINA") {
                        mostrarMensaje(3, 'No existen campos configurados para este reporte en <b>Configurar reportes</b>.', function (btn) {
                            if (btn == 'ok') {
                                //this.stElementosPersona.reload();
                            }
                        }.createDelegate(this));
                    }
                    PVD.ocultarMascara('idmaskenviareval');

                }.createDelegate(this)
            });
        }.createDelegate(this));

        this.btnacciones[6].setHandler(function () {
            this.wingridProcesosEvaluativos.show();
            this.wingridProcesosEvaluativos.maximize();
        }.createDelegate(this));

        this.btnacciones[7].setHandler(function () {
            importarFileUploadField(this.idreportescertificaciones, 1, this.identidad);
        }.createDelegate(this));

        this.btnCancelarCargarReporte = new Ext.Button({
            id: 'btnCancelarCargarReporte',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)'
        });

        this.btnAceptarCargarReporte = new Ext.Button({
            id: 'btnAceptarCargarReporte',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>Enter</b>'

        });

        //Tree de vista previa.
        this.smDesdeReportes = new Ext.tree.DefaultSelectionModel({
            listeners: {
                click: function (node, e) {

                }
            }
        });

        this.storeDesdeReportes = new Ext.tree.TreeLoader({
            url: '/pvd/nomina/index.php/gestionarreportesycertificaciones/actualizarReporteDesdeReporte',
            baseParams: {identidad: this.identidad, idconfreportescertificaciones: this.idconfreportescertificaciones}
        });

        this.ArbolDesdeReportes = new Ext.tree.TreePanel({
            title: 'Listado de Reportes',
            region: 'center',
            width: '40%',
            split: false,
            border: true,
            rootVisible: false,
            autoScroll: true,
            layout: 'fit',
            loader: this.storeDesdeReportes,
            selModel: this.smDesdeReportes,
            root: new Ext.tree.AsyncTreeNode({
                text: 'Escala',
                // leaf:true,
                id: 'root'
            }),
            treeConfig: {
                listeners: {
                    click: function (node, e) {
                        console.info(node);
                    }
                }
            }
        });

        var nodosidreportesseleccionados = new Array();

        this.ArbolDesdeReportes.on('checkchange', function (node, checked) {
            if (!checked) {
                var index = nodosidreportesseleccionados.indexOf(node.attributes.id);
                if (index > -1) {
                    nodosidreportesseleccionados.splice(index, 1);
                }
            } else {
                nodosidreportesseleccionados.push(node.attributes.id);
            }

        }.createDelegate(this));

        this.btnAceptarCargarReporte.on('click', function () {
            PVD.mostrarMascara('idmaskactreporte', 'Por favor espere...', 'Enviando datos.');
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/gestionarreportesycertificaciones/actualizarReporteDesdeReportesAnteriores',
                timeout: 50000000,
                method: 'POST',
                params: {
                    idconfreporte: this.idconfreportescertificaciones,
                    idreportescertificaciones: this.idreportescertificaciones,
                    identidad: this.identidad,
                    nodosidreportesseleccionados: Ext.encode(nodosidreportesseleccionados)
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('idmaskactreporte');
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'ok') {
                        this.stElementosPersona.reload();
                    } else if (respuesta == 'error') {
                        mostrarMensaje(3, 'Por favor adicione personas al reporte');
                    }
                    this.ventanaDesdeReporte.hide();


                }.createDelegate(this)
            });


        }.createDelegate(this));

        this.btnacciones[13].setHandler(function () {
            cargarpanelReportes(this.identidad);
        }.createDelegate(this));

        this.btnacciones[15].setHandler(function () {
            importarFileUploadField(this.idreportescertificaciones, 2, this.identidad);
        }.createDelegate(this));

        this.btnacciones[16].setHandler(function () {
            this.winPeriodosPagos.show();
        }.createDelegate(this));

        var self = this;

        this.panelDesdeReporte = new Ext.Panel({
            region: 'center',
            height: 300,
            width: 300,
            split: true,
            layout: 'fit',
            items: [this.ArbolDesdeReportes]
        });

        this.ventanaDesdeReporte = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.panelDesdeReporte],
            buttons: [this.btnCancelarCargarReporte, this.btnAceptarCargarReporte]
        });

        function cargarpanelReportes(identidad) {
            self.ventanaDesdeReporte.show();
        }

        this.btnCancelarCargarReporte.on('click', function () {

            self.ventanaDesdeReporte.hide();

        });

        this.btnacciones[8].setHandler(function () {
            PVD.mostrarMascara('idmaskenviarcal', 'Por favor espere...', 'Calculando el acumulado de vacaciones, en d&iacute;as e importe');
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/gestionarreportesycertificaciones/calcularAcumuladoVacaciones',
                timeout: 5000000000,
                method: 'POST',
                params: {
                    idreportescertificaciones: this.idreportescertificaciones,
                    idconfreportescertificaciones: this.idconfreportescertificaciones,
                    identidad: this.identidad
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    PVD.ocultarMascara('idmaskenviarcal');
                    if (respuesta.cod == -1) {
                        mostrarMensaje(3, 'A <b>' + respuesta.personassinacumulado + '</b> no les da el acumulado en d&iacute;as', function (btn) {
                            if (btn == 'ok') {
                                this.stElementosPersona.reload();
                            }
                        }.createDelegate(this));
                    } else {
                        if (respuesta.cod == 1) {
                            mostrarMensaje(2, 'El importe fue calculado correctamente', function (btn) {
                                if (btn == 'ok') {
                                    this.stElementosPersona.reload();
                                }
                            }.createDelegate(this));
                        }

                    }
                }.createDelegate(this)
            });
        }.createDelegate(this));

        //Componente para buscar en los periodos de pago
        this.objListarPeriodosPagos = new Pvd.Nomina.ElaborarPago.ListarPeriodosPago({
            modoview: 2,
            identidad: this.identidad
        });

        this.btnAceptarPeriodosPagos = new Ext.Button({
            id: 'btnAceptarPeriodosPagos',
            text: 'Aceptar',
            tooltip: '',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.winPeriodosPagos = new Ext.Window({
            title: 'Per&iacute;odos de pago',
            modal: true,
            height: 400,
            width: 700,
            closable: true,
            constrain: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'border',
            items: [this.objListarPeriodosPagos],
            buttons: [this.btnAceptarPeriodosPagos]
        });

        //Elelementos de la cantidad de meses
        this.nfCantidadMeses = new Ext.form.NumberField({
            id: 'nfCantidadMeses',
            fieldLabel: 'Cantidad de meses',
            allowBlank: false
        });
        this.formularioCantidadMeses = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            region: 'center',
            height: 160,
            width: 190,
            items: [this.nfCantidadMeses]
        })

        this.btnAceptarCantidadMeses = new Ext.Button({
            id: 'btnAceptarCantidadMeses',
            text: 'Aceptar',
            tooltip: '',
            iconCls: 'aceptar'
        });

        this.btnCancelarCantidadMeses = new Ext.Button({
            id: 'btnCancelarCantidadMeses',
            text: 'Cancelar',
            tooltip: '',
            iconCls: 'cancelar'
        });

        this.winCantidadMeses = new Ext.Window({
            title: 'Cantidad de meses',
            modal: true,
            height: 160,
            width: 180,
            constrain: true,
            closable: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'border',
            items: [this.formularioCantidadMeses],
            buttons: [this.btnCancelarCantidadMeses, this.btnAceptarCantidadMeses]
        });

        this.btnCancelarCantidadMeses.on('click', function () {
            this.winCantidadMeses.hide();
        }.createDelegate(this));

        this.btnAceptarPeriodosPagos.on('click', function () {
            var contador = this.objListarPeriodosPagos.stPeriodosPagoExportar.getCount();
            var range = this.objListarPeriodosPagos.stPeriodosPagoExportar.getRange(0, contador);
            var arrayidelaborarpagos = new Array();
            if (contador > 0) {
                for (var i = 0; i < contador; i++) {
                    arrayidelaborarpagos[i] = range[i].data.idelaborarpagos;
                }
                PVD.mostrarMascara('idmaskenviar', 'Por favor espere...', 'B&uacute;scando los datos en las n&oacuteminas');
                Ext.Ajax.request({
                    url: 'buscarDatosSalarioNominas',
                    method: 'POST',
                    params: {
                        idconfreportescertificaciones: this.idconfreportescertificaciones,
                        idreportescertificaciones: this.idreportescertificaciones,
                        arridelaborarpagos: Ext.encode(arrayidelaborarpagos)
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);
                        if (respuesta == 'NO-VARIABLE-REPORTE') {
                            mostrarMensaje(3, 'Por favor configure el campo de este reporte que guardar&aacute; los campos de las n&oacuteminas');
                        } else if (respuesta == 'NO-CAMPO-NOMINA') {
                            mostrarMensaje(3, 'Por favor configure el campo de la n&oacuteminas que debe ser guardado en el reporte');
                        } else {
                            mostrarMensaje(1, 'El reporte ha sido actualizado satisfactoriamente');
                        }
                        PVD.ocultarMascara('idmaskenviar');
                        this.winPeriodosPagos.hide();
                        this.stElementosPersona.reload();
                    }.createDelegate(this)
                });

            } else {
                mostrarMensaje(3, 'Por favor adicione las nominas para la buscar el salario');
            }


        }.createDelegate(this));


        this.objListarPeriodosPagos.on('periodopagoseleccionado', function (record) {
            if (this.objListarPeriodosPagos.modoview == 2) {
                this.objListarPeriodosPagos.btnAddGridExportarVarios.enable();
                this.objListarPeriodosPagos.btnDelGridExportarVarios.disable();
                this.recordperiodopagoseleccionado = record;
            }
        }.createDelegate(this));

        this.objListarPeriodosPagos.on('periodopagoexportarseleccionado', function (record) {
            if (this.objListarPeriodosPagos.modoview == 2) {
                this.objListarPeriodosPagos.btnAddGridExportarVarios.disable();
                this.objListarPeriodosPagos.btnDelGridExportarVarios.enable();
                this.recordperiodopagoexportarseleccionado = record;
            }
        }.createDelegate(this));

        this.objListarPeriodosPagos.btnAddGridExportarVarios.on('click', function (btn) {
            if (this.objListarPeriodosPagos.modoview == 2) {
                this.objListarPeriodosPagos.stPeriodosPagoExportar.add(this.recordperiodopagoseleccionado);
                this.objListarPeriodosPagos.stPeriodosPago.remove(this.recordperiodopagoseleccionado);
                this.btnAceptarPeriodosPagos.enable();
                //vista.objListarPeriodosPagos.stPeriodosPago.removeAll();
                btn.disable();

            }
        }.createDelegate(this));

        this.objListarPeriodosPagos.btnDelGridExportarVarios.on('click', function (btn) {
            if (this.objListarPeriodosPagos.modoview == 2) {
                this.objListarPeriodosPagos.stPeriodosPagoExportar.remove(this.recordperiodopagoexportarseleccionado);
                this.objListarPeriodosPagos.stPeriodosPago.add(this.recordperiodopagoexportarseleccionado);
                btn.disable();
            }
        }.createDelegate(this));

        /*this.btnAceptarPeriodosPagos.on('click', function() {
         this.winCantidadMeses.show();
         }.createDelegate(this));*/

        //Store para cargar las personas que tienen una cantidad de meses inferior a la especificada.
        this.stPersonasMenosMeses = new Ext.data.Store({
            url: '/pvd/nomina/index.php/gestionarreportesycertificaciones/obtenerPersonasConMenosMeses',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idpersona"},
                [
                    {name: 'idpersona'},
                    {name: 'nombrecompleto'},
                    {name: 'semanas'}
                ])
        });

        this.stPersonasMenosMeses.on('load', function (st, record) {
            if (record.length == 0) {
                CalcularSalarioPromedioReportes(this);
            } else {
                this.winPersonasCantMenorMesesEspecificados.show();
            }
        }.createDelegate(this));

        //number field para especificar la cantidad de semanas
        this.nftPersonasMenosMeses = new Ext.form.NumberField({
            allowBlank: false,
            anchor: '100%',
            allowDecimals: false,
            //allowDecimals: true,
            allowNegative: false,
            maxValue: 999999,
            minValue: 1,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });

        //column model del grid "gpListPersonasCantMesesInferior"
        this.cmPersonasMenosMeses = new Ext.grid.ColumnModel([
            {
                header: "idpersona",
                dataIndex: 'idpersona',
                hidden: true,
                hideable: false,
                width: 50
            }, {
                header: "Nombre y apellidos",
                dataIndex: 'nombrecompleto',
                width: 250
            }, {
                header: "Cantidad de semanas",
                dataIndex: 'semanas',
                width: 120,
                editor: this.nftPersonasMenosMeses
            }
        ]);

        //Botones de la ventana winPersonasCantMenorMesesEspecificados
        this.btnCancelarPromedioPersonasMesesMenos = new Ext.Button({
            id: 'btnCancelarPromedioPersonasMesesMenos',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cancelar'
        });

        this.btnCancelarPromedioPersonasMesesMenos.on('click', function () {
            this.winPersonasCantMenorMesesEspecificados.hide();
        }.createDelegate(this));

        this.btnAceptarPromedioPersonasMesesMenos = new Ext.Button({
            id: 'btnAceptarPromedioPersonasMesesMenosss',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true
        });

        this.btnAceptarPromedioPersonasMesesMenos.on('click', function () {
            CalcularSalarioPromedioReportes(this);
            this.winPersonasCantMenorMesesEspecificados.hide();
        }.createDelegate(this));

        //Grid Panel que muestra las personas que tienen una cantidad de meses inferior a la especificada.
        this.gpListPersonasCantMesesInferior = new Ext.grid.EditorGridPanel({
            //region: 'center',
            layout: 'fit',
            split: true,
            store: this.stPersonasMenosMeses,
            autoScroll: true,
            stripeRows: true,
            cm: this.cmPersonasMenosMeses,
            width: 350,
            height: 250,
            border: false,
            hideBorders: true,
            loadMask: {msg: 'Cargando...'},
            listeners: {
                afteredit: function (obj) {
                    this.btnAceptarPromedioPersonasMesesMenos.disable();
                    var cantPersonasSinValorSemanas = 0;
                    for (var i = 0; i < this.gpListPersonasCantMesesInferior.getStore().data.items.length; i++) {
                        if (!this.gpListPersonasCantMesesInferior.getStore().data.items[i].data.semanas) {
                            cantPersonasSinValorSemanas++;
                        } else {
                            this.arrayCantSemanasXPersona[i] = this.gpListPersonasCantMesesInferior.getStore().data.items[i].data.semanas;
                            this.idspersonassinsemanas[i] = this.gpListPersonasCantMesesInferior.getStore().data.items[i].data.idpersona;
                        }
                    }
                    if (cantPersonasSinValorSemanas == 0) {
                        this.btnAceptarPromedioPersonasMesesMenos.enable();
                    } else {
                        this.btnAceptarPromedioPersonasMesesMenos.disable();
                    }
                }.createDelegate(this)
            }
        });

        //Panel para el Grid
        this.formPersonasCantMesesInferior = new Ext.FormPanel({
            region: 'center',
            layout: 'fit',
            border: false,
            frame: true,
            width: 400,
            height: 300,
            //autoHeight: true,
            items: [this.gpListPersonasCantMesesInferior]
        });

        //Ventana que muestra las personas que tienen una cantidad de meses inferior a la especificada.
        this.winPersonasCantMenorMesesEspecificados = new Ext.Window({
            title: 'Personas con una cantidad de meses inferior a la asignada',
            width: 400,
            height: 300,
            constrain: true,
            closable: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            items: [this.formPersonasCantMesesInferior],
            buttons: [this.btnCancelarPromedioPersonasMesesMenos, this.btnAceptarPromedioPersonasMesesMenos]
        });

        this.btnacciones[9].setHandler(function () {
            var totalstorepersonas = this.stElementosPersona.getCount();
            var rangepersonas = this.stElementosPersona.getRange(0, totalstorepersonas);
            var arrayidpersonas = new Array();
            if (totalstorepersonas > 0) {
                for (var j = 0; j < totalstorepersonas - 1; j++) {
                    arrayidpersonas[j] = rangepersonas[0].data.idelemento;
                }
            }
            if (this.idtipoconfreportescertificaciones == 3) {
                this.stPersonasMenosMeses.load({params: {arrayidpersonas: Ext.encode(arrayidpersonas)}});
            } else if (this.idtipoconfreportescertificaciones == 8) {
                CalcularSalarioPromedioReportes(this);
            } else if (this.idtipoconfreportescertificaciones == 9) {
                CalcularSalarioPromedioReportes(this);
            } else {

            }
        }.createDelegate(this));

        function CalcularSalarioPromedioReportes(self) {
            //var _this = this;
            var totalstorepersonas = self.stElementosPersona.getCount();
            var rangepersonas = self.stElementosPersona.getRange(0, totalstorepersonas);
            var arrayidpersonas = new Array();
            var arrayidelementosrep = new Array();

            if (totalstorepersonas > 0) {
                for (var j = 0; j < totalstorepersonas; j++) {
                    arrayidpersonas[j] = rangepersonas[j].data.idelemento;
                    arrayidelementosrep[j] = rangepersonas[j].data.idelementosreportescertificaciones;
                }

                if (self.identidad != null) {
                    PVD.mostrarMascara('idmaskenviar', 'Por favor espere...', 'Calculando los salarios promedios');
                    Ext.Ajax.request({
                        url: '/pvd/nomina/index.php/gestionarreportesycertificaciones/calcularSalarioPromedioSNC',
                        timeout: 50000000,
                        method: 'POST',
                        params: {
                            idconfreportescertificaciones: self.idconfreportescertificaciones,
                            arrayidelementosrep: Ext.encode(arrayidelementosrep),
                            idspersonas: Ext.encode(arrayidpersonas),
                            idspersonassinsemanas: Ext.encode(self.idspersonassinsemanas),
                            idreportescertificaciones: self.idreportescertificaciones,
                            arraycantsemanasxpersona: Ext.encode(self.arrayCantSemanasXPersona)
                        },
                        callback: function (options, success, response) {
                            var respuesta = Ext.decode(response.responseText);
                            if (respuesta.codigo == 'NOVARIABLETIPOSALARIOPROMEDIOCONFIGURADA') {
                                mostrarMensaje(3, 'Por favor configure la variable del reporte que es "Salario promedio".');
                            } else if (respuesta.codigo == 'CANTIDADMESESSEMANASNULL') {
                                mostrarMensaje(3, 'La cantidad de meses y de semanas deben tener un valor num&eacute;rico.');
                            } else if (respuesta.codigo == 'CANTIDADMESESNULL') {
                                mostrarMensaje(3, 'La cantidad de meses debe tener un valor num&eacute;rico.');
                            } else if (respuesta.codigo == 'CANTIDADSEMANASNULL') {
                                mostrarMensaje(3, 'La cantidad de semanas debe tener un valor num&eacute;rico.');
                            } else if (respuesta.codigo == 'NOCRMPAGOSALARIO') {
                                mostrarMensaje(3, 'Por favor configure cual concepto de la retribucion monetaria devenga la persona');
                            } else {
                                mostrarMensaje(1, 'El salario promedio fue calculado correctamente');
                            }
                            PVD.ocultarMascara('idmaskenviar');
                            self.stElementosPersona.reload();
                        }.createDelegate(this)
                    });
                }
            } else {
                mostrarMensaje(3, 'Por favor adicione las personas al reporte');
            }
        }//.createDelegate(this);

        function importarFileUploadField(idreportescertificaciones, accion, identidad) {
            var _this = this;
            var msg = function (title, msg) {
                Ext.Msg.show({
                    title: title,
                    msg: msg,
                    minWidth: 200,
                    modal: true,
                    icon: Ext.Msg.INFO,
                    buttons: Ext.Msg.OK
                });
            };

            var panel = new Ext.FormPanel({
                fileUpload: true,
                width: 500,
                frame: true,
                autoHeight: true,
                bodyStyle: 'padding: 10px 10px 0 10px;',
                labelWidth: 50,
                defaults: {
                    anchor: '95%',
                    allowBlank: false,
                    msgTarget: 'side'
                },
                items: [{
                    xtype: 'fileuploadfield',
                    id: 'subir',
                    name: 'fileUpload',
                    fieldLabel: 'Archivo',
                    emptyText: 'Seleccione el archivo',
                }]
            });

            /*var variables = Array();
             for(var i = 0; i < this.valoresVariables.length; i++){
             variables[i] = this.valoresVariables[i].idvariable;
             }*/

            var url = (accion == 1) ? '/pvd/nomina/index.php/gestionarreportesycertificaciones/importardatosreporteausencias' : '/pvd/nomina/index.php/gestionarreportesycertificaciones/importardatosreportedescuentosnoaplicados';

            var importar = new Ext.Window({
                title: 'Importar Reporte de Ausencias(T)',
                width: 500,
                layout: 'fit',
                constrain: true,
                modal: true,
                items: [panel],
                buttons: [{
                    iconCls: 'Cancelar',
                    icon: perfil.dirImg + 'cancelar.png',
                    text: 'Cancelar',
                    handler: function () {
                        importar.close();
                    }
                }, {
                    iconCls: 'Aceptar',
                    icon: perfil.dirImg + 'aceptar.png',
                    text: 'Aceptar',
                    handler: function () {
                        if (panel.getForm().isValid()) {
                            panel.getForm().submit({
                                url: url,
                                waitMsg: 'Guardando datos del archivo...',
                                success: function (fp, response) {
                                    var responseText = Ext.decode(response.response.responseText);//Ext.decode(response.responseText);
                                    importar.close();
                                    if (responseText.personasnomachean == true) {
                                        mostrarMensaje(3, 'Los siguientes # de identidad:<b>' + responseText.textpersonasnomachean + '</b> no coinciden con los asociados a las personas en el registro', function (btn) {
                                            self.stElementosPersona.reload();
                                        }.createDelegate(this));
                                        self.stElementosPersona.reload();
                                    } else {
                                        mostrarMensaje(1, 'El reporte de ausencias fue actualizado correctamente', function (btn) {
                                            self.stElementosPersona.reload();
                                        }.createDelegate(this));
                                    }

                                    self.stElementosPersona.reload();
                                }.createDelegate(this),
                                params: {
                                    idreportescertificaciones: idreportescertificaciones,
                                    identidad: identidad
                                },
                                failure: function (fp, response) {


                                }
                            });
                        } else {
                            mostrarMensaje(2, 'Datos vacios');
                        }
                    }.createDelegate(this)
                }]
            });
            importar.show();
        }//.createDelegate(this)

        this.btnacciones[10].setHandler(function () {
            /*PVD.mostrarMascara('idmaskausenciasservicio', 'Por favor espere...', 'Actualizando el reporte de ausencia');*/
            Ext.MessageBox.wait('Por favor espere...', 'Actualizando el reporte de ausencia');
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/gestionarreportesycertificaciones/actualizarReporteAusenciasServicio',
                method: 'POST',
                params: {
                    identidad: this.identidad,
                    idconfreporte: this.idconfreportescertificaciones,
                    idreportecertificaciones: this.idreportescertificaciones
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'OK') {
                        mostrarMensaje(1, 'El reporte de ausencias fue actualizado satisfactoriamente');
                    }
                    this.stElementosPersona.reload();
                    Ext.MessageBox.hide();
                    /**PVD.ocultarMascara('idmaskausenciasservicio');*/
                }.createDelegate(this)
            });
        }.createDelegate(this));

        this.btnacciones[20].setHandler(function () {
            Ext.MessageBox.wait('Por favor espere...', 'Actualizando el reporte de destajo');
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/gestionarreportesycertificaciones/actualizarReportePagoDestajo',
                method: 'POST',
                params: {
                    identidad: this.identidad,
                    idconfreportescertificaciones: this.idconfreportescertificaciones,
                    idreportecertificaciones: this.idreportescertificaciones
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'OK') {
                        mostrarMensaje(1, 'El reporte de pago destajo fue actualizado satisfactoriamente');
                    }
                    this.stElementosPersona.reload();
                    Ext.MessageBox.hide();
                }.createDelegate(this)
            });
        }.createDelegate(this));

        this.btnacciones[19].setHandler(function () {
            PVD.mostrarMascara('idmaskausenciasservicio', 'Por favor espere...', 'Actualizando el reporte de talleres');
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/gestionarreportesycertificaciones/actualizarReporteTalleres',
                timeout: 50000000,
                method: 'POST',
                params: {
                    identidad: this.identidad,
                    idconfreporte: this.idconfreportescertificaciones,
                    idreportecertificaciones: this.idreportescertificaciones
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'OK') {
                        mostrarMensaje(1, 'El reporte de talleres fue actualizado satisfactoriamente');
                    }
                    this.stElementosPersona.reload();
                    PVD.ocultarMascara('idmaskausenciasservicio');
                }.createDelegate(this)
            });
        }.createDelegate(this));

        //Ventana para escoger el formato a exportar el reporte
        this.btnAceptarExportar = new Ext.Button({
            id: 'btnAceptarExportar',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            disabled: true
        });

        this.btnCancelarExportar = new Ext.Button({
            id: 'btnCancelarExportar',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        this.tipodocumento = -1;
        
        this.formExportarReporte = new Ext.FormPanel({
            id: 'idformularioAsociasion',
            width: 400,
            autoHeight: true,
            frame: true,
            region: 'center',
            items: [{
                xtype: 'fieldset',
                id:'tiposdoc',
                title: 'Tipos de documentos',
                height: 150,
                width: '93%',
                region: 'center',
                items: [{
                items:[{
                    items:[{id: 'rbExcel',
                    xtype:'radio',        
                    boxLabel: 'Hojas de c&aacute;lculo <b>(EXCEL)</b>',
                    name: 'formato',
                    inputValue: 1,
                    listeners: {
                        'check': function (obj, ischeck) {
                            console.info(obj)
                            if (obj) {
                                self.tipodocumento = 1;
                                self.btnAceptarExportar.enable();
        
                            }
                        }
                    }},{id: 'rbPDF',
                    xtype:'radio', 
                    boxLabel: 'Formato de documento port&aacute;til <b>(PDF)</b>',
                    name: 'formato',
                    inputValue: 2,
                    listeners: {
                        'check': function (obj, ischeck) {
                            console.info(obj)
                            if (ischeck) {
                                self.tipodocumento = 2;
                                self.btnAceptarExportar.enable();
                            }
                        }
                    }}]
                    
            }]
                }                 
                ]
            }]
        });

        this.ventanaExportarReporte = new Ext.Window({
            region: 'center',
            title: 'Exportar reporte',
            layout: 'fit',
            modal: true,
            resizable: false,
            draggable: true,
            height: 200,
            width: 300,
            closeAction: 'hide',
            closable: true,
            items: [this.formExportarReporte],
            bbar: ['->', this.btnCancelarExportar, this.btnAceptarExportar]
        });

        //Ventana de tipo de Excel
        this.tipoexcel = -1;
       
        this.formTipoExcel = new Ext.FormPanel({
            id: 'idformularioformTipoExcel',
            width: 400,
            heigth: 300,
            autoHeight: true,
            frame: true,
            region: 'center',
            items: [{
                xtype: 'fieldset',
                title: 'Tipos de Excel',
                id:'tiposexc',
                height: 150,
                width: '99%',
                region: 'center',
                items: [{
                    items:[{id: 'rbExcelConForrmato',
                    xtype:'radio',
                    boxLabel: 'Con Encabezado',
                    name: 'tipoexcel',
                    inputValue: 1,
                    listeners: {
                    'check': function (obj, ischeck) {
                        if (ischeck) {
                            self.tipoexcel = 1;
                            self.btnAceptarTipoExcel.enable();
                        }
                    }
                }},
                {
                    id: 'rbExcelSinForrmato',
                    xtype:'radio',
                    boxLabel: 'Sin Encabezado',
                    name: 'tipoexcel',
                    inputValue: 2,
                    listeners: {
                    'check': function (obj, ischeck) {
                        if (ischeck) {
                            self.tipoexcel = 2;
                            self.btnAceptarTipoExcel.enable();
                        }
                    }.createDelegate(this)
                }

                }]
                    }
                    
                ]
            }]
        });

        this.btnAceptarTipoExcel = new Ext.Button({
            id: 'btnAceptarTipoExcel',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            disabled: true
        });

        this.btnCancelarTipoExcel = new Ext.Button({
            id: 'btnCancelarTipoExcel',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        this.ventanaTipoExcel = new Ext.Window({
            region: 'center',
            title: 'Exportar Excel',
            layout: 'fit',
            modal: true,
            resizable: false,
            draggable: true,
            height: 150,
            width: 300,
            closeAction: 'hide',
            closable: true,
            items: [this.formTipoExcel],
            bbar: ['->', this.btnCancelarTipoExcel, this.btnAceptarTipoExcel]
        });

        this.btnacciones[11].setHandler(function () {
            this.ventanaExportarReporte.show();
        }.createDelegate(this));

        this.btnAceptarExportar.setHandler(function () {
            //PDF
            if(this.tipodocumento == 2){
                Exportar();
            //Tipo Excel
            }else{
                this.ventanaTipoExcel.show();
                this.ventanaExportarReporte.hide();
            }

        }.createDelegate(this));

        this.btnAceptarTipoExcel.setHandler(function () {
            console.info('sssssss')
            Exportar();

        }.createDelegate(this));


        function Exportar(){
            
            window.open(
                document.location.protocol +
                '//' + window.location.host +
                '/pvd/nomina/index.php/gestionarreportesycertificaciones/Exportar?idconfreportescertificaciones=' +
                self.idconfreportescertificaciones + '&idreportescertificaciones=' +
                self.idreportescertificaciones + '&tipoelemento=' + 1 + '&historico=' +
                self.historico + '&identidad=' + self.identidad + '&tipodocumento=' + self.tipodocumento + '&tipoexcel=' + self.tipoexcel);

            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/gestionarreportesycertificaciones/Exportar',
                timeout: 50000,
                method: 'POST',
                params: {
                    idconfreportescertificaciones: self.idconfreportescertificaciones,
                    idreportescertificaciones: self.idreportescertificaciones,
                    tipoelemento: 1,
                    historico: self.historico,
                    tipoexcel: self.tipoexcel,
                    identidad: self.identidad
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'OK') {
                        mostrarMensaje(1, 'El reporte de ausencias fue actualizado satisfactoriamente');
                    }
                    PVD.ocultarMascara('idmaskausenciasservicio');
                    self.ventanaExportarReporte.hide();
                    self.ventanaTipoExcel.hide();
                }
            });
            self.ventanaExportarReporte.hide();
            self.ventanaTipoExcel.hide();
        }

        this.btnCancelarExportar.setHandler(function () {
            this.ventanaExportarReporte.hide();
        }.createDelegate(this));

        this.btnCancelarTipoExcel.setHandler(function () {
            this.ventanaTipoExcel.hide();
        }.createDelegate(this));


        //MODELO SC-4-04 NOTIFICACIÓN DE LICENCIAS Y SUBSIDIOS
        this.btnAceptarExportarSC_4_04 = new Ext.Button({
            id: 'btnAceptarExportarSC_4_04',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            disabled: true
        });

        this.btnCancelarExportarSC_4_04 = new Ext.Button({
            id: 'btnCancelarExportarSC_4_04',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        this.tipodocumentoSC_4_04 = -1;

        this.rbExcelSC_4_04 = new Ext.form.Radio({
            // id: 'rbExcelSC_4_04',
            boxLabel: 'Hojas de c&aacute;lculo <b>(EXCEL)</b>',
            name: 'formato',
            inputValue: 1,
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        this.tipodocumentoSC_4_04 = 1;
                        this.btnAceptarExportarSC_4_04.enable();
                    }
                }.createDelegate(this)
            }
        });

        this.rbPDFSC_4_04 = new Ext.form.Radio({
            // id: 'rbPDFSC_4_04',
            boxLabel: 'Formato de documento port&aacute;til <b>(PDF)</b>',
            name: 'formato',
            inputValue: 2,
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        this.tipodocumentoSC_4_04 = 2;
                        this.btnAceptarExportarSC_4_04.enable();
                    }
                }.createDelegate(this)
            }
        });

        this.rgTiposDocumentosSC_4_04 = new Ext.form.RadioGroup({
            //id: 'rgTiposDocumentosSC_4_04',
            region: 'center',
            width: '90%',
            hideLabel: true,
            columns: [1, 1],
            style: 'padding-left: 20px;',
            items: [this.rbExcelSC_4_04, this.rbPDFSC_4_04]
        });

        this.formExportarReporteSC_4_04 = new Ext.FormPanel({
            // id: 'idformExportarReporteSC_4_04',
            width: 400,
            heigth: 300,
            autoHeight: true,
            frame: true,
            region: 'center',
            items: [{
                xtype: 'fieldset',
                title: 'Tipos de documentos',
                height: 80,
                width: '99%',
                region: 'center',
                items: [
                    this.rgTiposDocumentosSC_4_04
                ]
            }]
        });

        this.ventanaExportarReporteSC_4_04 = new Ext.Window({
            // id: 'ventanaExportarReporteSC_4_04',
            region: 'center',
            title: 'Exportar Modelo SC-4-04',
            layout: 'fit',
            closeAction: 'hide',
            closable: true,
            modal: true,
            resizable: false,
            draggable: true,
            autoHeight: true,
            autoWidth: true,
            items: [this.formExportarReporteSC_4_04],
            bbar: ['->', this.btnCancelarExportarSC_4_04, this.btnAceptarExportarSC_4_04]
        });

        this.btnacciones[18].setHandler(function () {
            this.ventanaExportarReporteSC_4_04.show();
        }.createDelegate(this));

        this.btnAceptarExportarSC_4_04.setHandler(function () {
            window.open(
                document.location.protocol +
                '//' + window.location.host +
                '/pvd/nomina/index.php/gestionarreportesycertificaciones/ExportarModeloSC404?' +
                'idconfreportescertificaciones=' + this.idconfreportescertificaciones +
                '&idreportescertificaciones=' + this.idreportescertificaciones + '&tipoelemento=' + 1 +
                '&historico=' + this.historico + '&identidad=' + this.identidad + '&tipodocumento=' + this.tipodocumentoSC_4_04 +
                '&idpersona=' + this.gpElementosPersona.selModel.selections.items[0].data.idelemento);
        }.createDelegate(this));

        this.btnCancelarExportarSC_4_04.setHandler(function () {
            this.ventanaExportarReporteSC_4_04.hide();
        }.createDelegate(this));
        //END

        //Funcionalidad para actualizar el reporte de antiguedad
        this.btnacciones[12].setHandler(function () {
            PVD.mostrarMascara('idmaskantiguedad', 'Por favor espere...', 'Actualizando el reporte de antig&uuml;edad');
            Ext.Ajax.request({
                url: '/pvd/nomina/index.php/gestionarreportesycertificaciones/actualizarReporteAntiguedad',
                timeout: 5000000000000000000,
                method: 'POST',
                params: {identidad: this.identidad, idreportescertificaciones: this.idreportescertificaciones},
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta == 'ok') {
                        mostrarMensaje(1, 'El reporte de antig&uuml;edad fue actualizado satisfactoriamente');
                    }
                    this.stElementosPersona.reload();
                    PVD.ocultarMascara('idmaskantiguedad');

                }.createDelegate(this)
            });
        }.createDelegate(this));

        this.camposStore = new Array();
        this.camposStore[0] = {name: 'idelementosreportescertificaciones'};
        this.camposStore[1] = {name: 'idreportescertificaciones'};
        this.camposStore[2] = {name: 'idelemento'};
        this.camposStore[3] = {name: 'aprobado'};
        this.camposStore[4] = {name: 'nombreyapellidos'};
        this.camposStore[5] = {name: 'cdgocontable'};
        this.camposStore[6] = {name: 'plantilla'};
        
        this.camposStore[7] = {name: 'ordenunico'};
        this.camposStore[8] = {name: 'mesinicialsnc'};
        for (var i = 0; i < this.valoresVariables.length; i++) {
            this.camposStore[i + 9] = {name: this.valoresVariables[i].idvariable}
        }

        this.recCampos = Ext.data.Record.create(this.camposStore);
        //Store para cargar los tipos de reportes y certificaciones
        this.stElementosPersona = new Ext.data.GroupingStore({
            url: '/pvd/nomina/index.php/gestionarreportesycertificaciones/obtenerelementosreportescertificaciones',
            groupField: 'plantilla',
            sortInfo: {field: 'ordenunico', direction: "ASC"},
            baseParams: {
                idreportescertificaciones: this.idreportescertificaciones,
                tipoelemento: 1,
                historico: this.historico,
                identidad: this.identidad
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idelementosreportescertificaciones"
            }, this.recCampos)
        });

        this.arrObjCM = new Array();
        this.arrObjCM[0] = new Ext.grid.RowNumberer();
        this.arrObjCM[1] = this.selModelGrid;
        this.arrObjCM[2] = {
            id: 'idelementosreportescertificaciones',
            header: "idelementosreportescertificaciones",
            dataIndex: 'idelementosreportescertificaciones',
            hidden: true,
            hideable: false
        };

        this.arrObjCM[3] = {
            header: "C&oacute;digo",
            dataIndex: 'cdgocontable',
            width: 100,
            hideable: false,
            tooltip: 'C&oacute;digo'
        };

        this.arrObjCM[4] = {
            header: "Nombre y apellidos",
            dataIndex: 'nombreyapellidos',
            width: 300,
            hideable: false,
            tooltip: 'Nombre y apellidos'
        };

        this.arrObjCM[5] = {
            header: "idelemento",
            dataIndex: 'idelemento',
            width: 130,
            hidden: true,
            hideable: false
        };

        this.arrObjCM[6] = {
            header: "Plantilla nominal",
            dataIndex: 'plantilla',
            width: 100,
            hidden: true,
            hideable: false,
            renderer: function (val) {
                var arrval = val.split("-");
                return '<span style="color:green;">' + arrval[1] + '</span>';
            }
        };

        this.arrObjCM[7] = {
            header: "mesinicialsnc",
            dataIndex: 'mesinicialsnc',
            width: 130,
            hidden: true,
            hideable: false
        };

        this.listadoStores = new Array();

        //setColumnTooltip
        for (var i = 0; i < this.valoresVariables.length; i++) {
            var editor = null;
            var renderer = null;
            if (this.valoresVariables[i].tipovalor == 1 || this.valoresVariables[i].tipovalor == 5) {
                this.listadoStores[this.valoresVariables[i].idvariable] = new Ext.data.SimpleStore({fields: [{name: 'valor'}, {name: 'denominacion'}]});
                var a = new Array();
                for (var j = 0; j < this.valoresVariables[i].datosnomenclador.length; j++) {
                    var t = new Array();
                    t[0] = this.valoresVariables[i].datosnomenclador[j].valor;
                    t[1] = this.valoresVariables[i].datosnomenclador[j].denominacion;
                    a[j] = t;
                }
                this.listadoStores[this.valoresVariables[i].idvariable].loadData(a);
                editor = new Ext.form.ComboBox({
                    anchor: '100%',
                    triggerAction: 'all',
                    valueField: 'valor',
                    displayField: 'denominacion',
                    hiddenName: 'valor',
                    allowBlank: false,
                    mode: 'local',
                    blankText: 'Este campo es obligatorio.',
                    readOnly: true,
                    store: this.listadoStores[this.valoresVariables[i].idvariable]
                });

                renderer = function (valor, meta, rec, rI, cI, st) {
                    var dataindex = this.cmElementosPersona.getDataIndex(cI);
                    var indSt = this.listadoStores[dataindex].find('valor', valor);
                    if (indSt == -1) return valor;
                    else return this.listadoStores[dataindex].getAt(indSt).data.denominacion;
                }.createDelegate(this);

            } else if (this.valoresVariables[i].tipovalor == 2) {
                editor = new Ext.form.NumberField({
                    allowBlank: false,
                    anchor: '100%',
                    allowDecimals: true,
                    allowNegative: false,
                    maxValue: this.valoresVariables[i].max,
                    minValue: this.valoresVariables[i].min,
                    decimalPrecision: this.valoresVariables[i].lugaresdecimales,
                    nanText: 'Este valor es incorrecto.',
                    blankText: 'Este campo es obligatorio.'
                });
            } else if (this.valoresVariables[i].tipovalor == 3) {
                editor = new Ext.form.TextField({
                    allowBlank: false,
                    anchor: '100%',
                    blankText: 'Este campo es obligatorio.'

                });
            } else if (this.valoresVariables[i].tipovalor == 4) {
                editor = new Ext.form.DateField({
                    allowBlank: false,
                    format: 'd/m/Y',
                    editable: true,
                    readOnly: false,
                    value: new Date().format('d/m/Y'),
                    blankText: 'Este campo es obligatorio.',
                    invalidText: 'El formato es dd/mm/aaaa.',
                    anchor: '100%'
                });

                renderer = function (valor) {
                    if (valor) {
                        if ((typeof mivariable) == "Date")
                            return new Date(valor).format('d/m/Y');
                        else return valor;
                    } else return valor;
                }.createDelegate(this);
            }

            this.arrObjCM[i + 7] = {
                header: this.valoresVariables[i].variable,
                dataIndex: this.valoresVariables[i].idvariable,
                width: 150,
                hideable: false,
                editor: editor,
                renderer: renderer,
                tooltip: this.valoresVariables[i].descripcion
            };

        }

        Ext.grid.CheckColumn = function (config) {
            Ext.apply(this, config);
            if (!this.id) {
                this.id = Ext.id();
            }
            this.renderer = this.renderer.createDelegate(this);
        };

        Ext.grid.CheckColumn.prototype = {
            init: function (grid) {
                this.grid = grid;
                this.grid.on('render', function () {
                    var view = this.grid.getView();
                    view.mainBody.on('mousedown', this.onMouseDown, this);
                }, this);
            },

            onMouseDown: function (e, t) {
                if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
                    e.stopEvent();
                    var index = this.grid.getView().findRowIndex(t);
                    var record = this.grid.store.getAt(index);
                    var valor = (record.get(this.dataIndex) ? false : true);
                    record.set(this.dataIndex, valor);
                }

            },

            renderer: function (v, p, record) {
                p.css += ' x-grid3-check-col-td';
                return '<div class="x-grid3-check-col' + (v == 1 || v == '1' ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
            }
        };

        if (!this.btnacciones[3].hidden) {
            this.arrObjCM[5 + this.valoresVariables.length] = new Ext.grid.CheckColumn({
                header: "Aprobado",
                dataIndex: 'aprobado',
                width: 100,
                hideable: false,
                hidden: false
            });
        }


        this.cmElementosPersona = new Ext.grid.ColumnModel(this.arrObjCM);

        this.cmElementosPersona.defaultSortable = true;

        this.btnCancelar = new Ext.Button({
            text: 'Cancelar',
            tooltip: 'Cancelar',
            iconCls: 'cancelar'
        });

        //Boton Buscar Persona.
        this.btnBuscarP = new Ext.Button({
            id: 'btnBuscarP',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar persona(<b>Alt+B</b>)',
            iconCls: 'buscar',
            prevTab: 'idtfBuscarP',
            nextTab: 'btnLimpiar',
        });

        //Boton Limpiar.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar',
            iconCls: 'limpiar',
            prevTab: 'btnBuscarP',
            nextTab: 'idtfBuscarP',
        });

        this.tfBuscarP = new Ext.form.TextField({
            id: 'idtfBuscarP', tabIndex: 2, name: 'denominacion', allowBlank: true, anchor: '85%',
            prevTab: 'btnLimpiar', nextTab: 'btnBuscarP',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+(\d*)?)+$/,
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == 13) {
                        this.btnBuscarP.handler();
                    }
                }.createDelegate(this)
            }
            //regexText:idioma.lbDenomIncorr
            //blankText:idioma.lbErrorCampoVacio
        });

        self.btnBuscarP.setHandler(function () {
            self.stElementosPersona.load({params: {buscar: 1, textobuscar: self.tfBuscarP.getValue()}});

        }.createDelegate(this));

        this.btnCancelar.setHandler(function () {
            this.close();
        }.createDelegate(this));

        this.btnLimpiar.setHandler(function () {
            this.tfBuscarP.setValue('');
            this.stElementosPersona.load({params: {buscar: 1, textobuscar: self.tfBuscarP.getValue()}});

        }.createDelegate(this));

        this.gpElementosPersona = new Ext.grid.EditorGridPanel({
            region: 'center',
            layout: 'fit',
            split: true,
            store: this.stElementosPersona,
            autoScroll: true,
            stripeRows: true,
            cm: this.cmElementosPersona,
            tbar: [this.tfBuscarP, '-', this.btnBuscarP, '-', this.btnLimpiar],
            buttons: [this.btnCancelar],
            sm: this.selModelGrid, /*new Ext.grid.RowSelectionModel({
             singleSelect:false,
             listeners: {
             rowselect: function(sel, i, r){
             this.btnacciones[1].enable();
             }.createDelegate(this)
             }
             }),*/
            width: 600,
            height: 400,
            border: false,
            hideBorders: true,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            loadMask: {msg: 'Cargando...'},
            plugins: (!this.btnacciones[3].hidden ? this.arrObjCM[5 + this.valoresVariables.length] : null),
            clicksToEdit: 1,
            listeners: {
                afteredit: function (obj) {
                    var dataindex = this.cmElementosPersona.getDataIndex(obj.column);
                    var variable = null;
                    for (var i = 0; i < this.valoresVariables.length; i++) {
                        if (this.valoresVariables[i].idvariable == dataindex) {
                            variable = this.valoresVariables[i];
                            break;
                        }
                    }
                    var valor = null;
                    if (variable.tipovalor == 4) {
                        valor = new Date(obj.value).format('d/m/Y');
                        obj.record.set(dataindex, valor);
                    } else {
                        valor = obj.value;
                    }

                    if (variable.nivelaplicarvalor == 2) {
                        this.stElementosPersona.each(function (r) {
                            r.set(dataindex, valor);
                        });
                    } else {
                        obj.record.set(dataindex, valor);
                    }

                }.createDelegate(this)
            }
        });

        this.gpElementosPersona.selModel.on('rowselect', function (tf, n, o) {
            if (this.estado == 2) {
                var count = this.arreglo.length;
                this.arreglo[count] = {
                    idelementosreportescertificaciones: o.data.idelementosreportescertificaciones,
                    aprobado: 1
                };
            }

            //Habilitar el boton Exportar Modelo SC-4-04 si hay una persona seleccionada
            var cantpersonas = tf.selections.length;
            (cantpersonas == 1) ? this.btnacciones[18].enable() : this.btnacciones[18].disable();

        }.createDelegate(this));

        this.gpElementosPersona.selModel.on('rowdeselect', function (tf, n, o) {
            if (this.estado == 2) {
                var count = this.arreglo.length;
                this.arreglo[count] = {
                    idelementosreportescertificaciones: o.data.idelementosreportescertificaciones,
                    aprobado: 0
                };
            }

            //Habilitar el boton Exportar Modelo SC-4-04 si hay una persona seleccionada
            var cantpersonas = tf.selections.length;
            (cantpersonas == 1) ? this.btnacciones[18].enable() : this.btnacciones[18].disable();

        }.createDelegate(this));

        this.stElementosPersona.on('load', function (tf, n, o) {
            console.info(this.btnacciones);
            console.info(this.modo);
            console.info(this.modo);
            if (this.estado == 2) {
                var cont = this.stElementosPersona.getCount();
                var todos = this.stElementosPersona.getRange(0, cont - 1);
                var auxid = new Array();
                var auxarrayDatos = new Array();
                var contarraux = 0;
                for (var i = 0; i < cont - 1; i++) {
                    if (todos[i].data.aprobado == 1) {
                        auxid[contarraux] = todos[i].data.idelementosreportescertificaciones;
                        contarraux++;
                    }
                }
                for (var c = 0; c < auxid.length; c++) {
                    var data = this.stElementosPersona.getById(auxid[c]);
                    auxarrayDatos.push(data);
                }
                this.gpElementosPersona.getSelectionModel().selectRecords(auxarrayDatos);
            }
        }.createDelegate(this));

        if (this.estado == 2) {
            for (var i = 0; i < this.valoresVariables.length; i++)
                this.cmElementosPersona.setEditable(i + 4, false);
        }

        if (this.modo == 'VISTA' || this.estado == 3) {
            //this.gpElementosPersona.suspendEvents();
        }

        //Ver Modelo SC-4-04 Notificación de Licencias y Subsidios
        this.flagModeloSC404 = false;
        //Comportamientos de reportes de Licencias(3) y Subsidios(8)
        if ((this.comportamientoreportesc4 != 1)) {
            this.flagModeloSC404 = true;
        }

        //Mostrando los botones en el toolBar del componente de personas
        if (this.modo == 'EDICION' && this.estado != 3) {
            if (!this.btnacciones[0].hidden || !this.btnacciones[1].hidden || !this.btnacciones[2].hidden || !this.btnacciones[3].hidden || !this.btnacciones[4].hidden || !this.btnacciones[5].hidden || !this.btnacciones[6].hidden || !this.btnacciones[7].hidden || !this.btnacciones[8].hidden || !this.btnacciones[9].hidden || !this.btnacciones[10].hidden || !this.btnacciones[11].hidden || !this.btnacciones[12].hidden || !this.btnacciones[13].hidden || !this.btnacciones[15].hidden || !this.btnacciones[16].hidden || !this.btnacciones[17].hidden || !this.btnacciones[19].hidden|| !this.btnacciones[20].hidden) {
                this.tbar = [this.btnacciones[0], this.btnacciones[1], this.btnacciones[2], this.btnacciones[3], this.btnacciones[5], this.btnacciones[6], this.btnacciones[7], this.btnacciones[10], this.btnacciones[20],this.btnacciones[19], this.btnacciones[12], this.btnacciones[15], this.btnacciones[16], this.btnacciones[8], this.btnacciones[9], this.btnacciones[17], '->', this.btnacciones[13], this.btnacciones[11], this.btnacciones[4]];
                //Mostrando el boton Exportar Modelo SC-4-04 detras del boton Exportar
                if (this.flagModeloSC404) {
                    this.tbar = [this.btnacciones[0], this.btnacciones[1], this.btnacciones[2], this.btnacciones[3], this.btnacciones[5], this.btnacciones[6], this.btnacciones[7], this.btnacciones[10], this.btnacciones[20],this.btnacciones[19], this.btnacciones[12], this.btnacciones[15], this.btnacciones[16], this.btnacciones[8], this.btnacciones[9], this.btnacciones[17], '->', this.btnacciones[13], this.btnacciones[11], this.btnacciones[18], this.btnacciones[4]];
                }
            }
        } else {
            this.tbar = [this.btnacciones[5], this.btnacciones[11]];
            //Mostrando el boton Exportar Modelo SC-4-04 detras del boton Exportar
            if (this.flagModeloSC404) {
                this.tbar.push(this.btnacciones[18]);

            }
        }


        this.items = [this.gpElementosPersona];
        Pvd.Nomina.ReportesyCertificaciones.WinElementosPersona.superclass.initComponent.call(this);
    },
    Cargar: function () {
       // this.stElementosPersona.removeAll();
        this.stElementosPersona.load({params: {buscar: 1, textobuscar: this.tfBuscarP.getValue()}});
        //this.stElementosPersona.reload();
    }


});
