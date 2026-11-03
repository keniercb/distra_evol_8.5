Ext.ns('Gestionar.planinversiones');

UCID.portal.cargarEtiquetas('gestplaninversiones', function(perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;

    var modelo = Gestionar.planinversiones.Modelo;
    modelo.init();

    var vista = Gestionar.planinversiones.Vista;
    vista.init(idioma, modelo);

    var acciones, reporte = 0;
    var iddpt = 0;


    Gestionar.planinversiones.Controlador.init(idioma, vista, modelo);
});

Gestionar.planinversiones.Controlador = {
    init: function(idioma, vista, modelo) {
        this.BarraProgreso = new BarraEstado();
        var desgloses = Gestplaninversiones.desglosePlanInversiones.Class;
        Ext.Ajax.timeout = 1000000000;
        _this = this;
        var ejercicio = 0;
        this.idinversion = 0;
        this.plan_mp1_globall = 0;
        this.plan_mp2_globall = 0;
        this.plan_mp3_globall = 0;
        this.plan_mp4_globall = 0;

        this.plan_mp1_globalll = 0;
        this.plan_mp2_globalll = 0;
        this.plan_mp3_globalll = 0;
        this.plan_mp4_globalll = 0;
        _this.mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: idioma.lbCargando
        });
        _this.mymask.show();
        map = new Ext.KeyMap(Ext.getDoc(), [{
                key: 'Mm',
                alt: true,
                fn: function() {
                    levantarBtnadd();
                }
            },
            {
                key: 'Ll',
                alt: true,
                fn: function() {
                    vista.filtrosinv.clearFilters();
                }
            },
            {
                key: 'Dd',
                alt: true,
                fn: function() {
                    Ext.getCmp('btnVerDetalles').fireEvent('click');
                }
            }
        ]);

        vista.tpPlanInversion.on('click', function(node, evento) {
            idorganismo = node.id;
            vista.entidadSeleccionada = node;
            if (vista.smInversiones.getSelected()) {
                inversion = vista.gpInversiones.getSelectionModel().getSelected().data.idinversion;
            } else {
                inversion = 0;
            }
            vista.gpInversiones.getStore().reload({
                params: {
                    start: 0,
                    limit: 20,
                    identidad: node.id,
                    check: 0,
                    idejercicio: vista.cmbEjercicio.getValue()
                }
            });

            modelo.stMonedas.reload({
                params: {
                    identidad: idorganismo
                }
            });
            vista.btnGraficoInversion.enable();
            vista.btnGraficas.actualizarParametros(node, vista.cmbEjercicio.getValue(), vista.cmbEjercicio.getRawValue());
        });

        vista.btnAdicionarErogacion.on('click', function() {
            var record = new Ext.data.Record({
                valor: '',
                moneda: ''

            });
            modelo.store_Erogacion.add(record);
        });
        vista.btnEliminarErogacion.on({
            click: function() {
                mostrarMensaje(2, '¿Est&aacute; seguro de que quiere eliminar el l&iacute;quido seleccionado?', function(btnPress) {
                    if (btnPress === 'ok') {
                        Ext.Ajax.request({
                            method: "POST",
                            url: '/planificacion/planmeta/index.php/inversiones/eliminarLiquidos',
                            params: {
                                iderogacionliquido: vista.sm_erogacion.getSelected().data.iderogacionliquido

                            },
                            callback: function(options, success, response) {
                                mostrarMensaje(1, 'El liquido se ha eliminado satisfactoriamente');
                                modelo.store_Erogacion.reload();
                            }
                        });
                    }
                });
            }
        });
        Ext.getCmp('idfiltroent').on({
            specialkey: function(t, e) {
                if (e.getKey() == '13') {
                    //  _this.mymask.show();
                    arbol = vista.tpPlanInversion;
                    if (arbol.getSelectionModel().getSelectedNode() != undefined) {
                        if (!arbol.getSelectionModel().getSelectedNode().leaf) {
                            arbol.getSelectionModel().getSelectedNode().reload({
                                params: {
                                    valor: Ext.getCmp('idfiltroent').getValue()
                                },
                                callback: function() {
                                    // _this.mymask.hide();
                                }
                            });
                        }
                    } else {
                        arbol.root.reload({
                            params: {
                                valor: Ext.getCmp('idfiltroent').getValue()
                            },
                            callback: function() {
                                // _this.mymask.hide();
                            }
                        });
                    }
                }
            }
        });
        modelo.stIinversiones.on('beforeload', function(st, record, ob) {
            st.baseParams.identidad = (vista.tpPlanInversion.getSelectionModel().getSelectedNode() != null) ? vista.tpPlanInversion.getSelectionModel().getSelectedNode().id : null;
            st.baseParams.idejercicio = vista.cmbEjercicio.getValue();
            st.baseParams.check = (vista.ChConsolidarr.getValue() == true) ? 1 : 0;
            st.baseParams.vigente = (vista.ChVigente.getValue() == true) ? 1 : 0;
            st.baseParams.cuadrada = 1;
            vista.btnModificarPlaninversion.disable();
            vista.btnVerDetalles.disable();
            vista.btnVerCuadre.disable();
            vista.btnVerFinaciamiento.disable();
            vista.btndesgloses.disable();
        });

        vista.tpPlanInversion.on({
            click: function() {
                recarga(modelo.stIinversiones, 20);
            }
        });

        modelo.stEquipos.on('beforeload', function(st, record, ob) {
            if (vista.smInversiones.getSelected()) {
                st.baseParams.idinversion = vista.gpInversiones.getSelectionModel().getSelected().data.idinversion;
            } else {
                st.baseParams.idinversion = 0;
            }
        });
        modelo.stEquipos.on('load', function(t, n, e) {
            if (t.reader.jsonData.data.length > 0) {
                componente = t.reader.jsonData.data[0].idetapa;
            } else {
                componente = 0;
            }
        });
        modelo.stCbejercicio.on({
            load: function(t, n, e) {
                ejercicio = t.reader.jsonData.idejercicioactual;
                vista.cmbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
            }
        });
        modelo.loaderTreeinversiones.on({
            load: function() {
                _this.mymask.hide();
            }
        });
        vista.gpInversiones.getSelectionModel().on({
            rowselect: function(g, r, e) {
                _this.idinversion = vista.gpInversiones.getSelectionModel().getSelected().data.idinversion;
                if (vista.gpInversiones.getSelectionModel().getSelected().data.equipos === 1) {
                    Ext.getCmp('tabEquipo').expand(true);
                    recargae(modelo.stEquipos, 10);
                } else {
                    Ext.getCmp('tabEquipo').collapse(true);
                    recargae(modelo.stEquipos, 10);
                }
                if (vista.smInversiones.getSelections().length > 0) {
                    vista.btndesgloses.enable();
                } else {
                    vista.btndesgloses.disable();
                }

            }, rowdeselect: function(sm, row, record) {
                if (vista.smInversiones.getSelections().length > 0) {
                    vista.btndesgloses.enable();
                } else {
                    vista.btndesgloses.disable();
                }
            }
        });
        vista.cmbEjercicio.on('select', function(combo, record) {
            recarga(modelo.stIinversiones, 20);
            ejercicio = record.data;

            vista.btnGraficas.actualizarParametros(vista.entidadSeleccionada, combo.getValue(), combo.getRawValue());
        });

        vista.btndesgloses.on('click', function() {
            desgloses.init(ejercicio, idorganismo, idioma, vista.gpInversiones.getSelectionModel().getSelected(), componente);
        });

        vista.tpPlanInversion.on('click', function(node, evento) {
            idorganismo = node.id;
            recarga(modelo.stIinversiones, 20);
            modelo.stMonedas.reload({
                params: {
                    identidad: idorganismo
                }
            });
            vista.ChConsolidarr.enable();
            vista.ChVigente.enable();
        });
        vista.cbReporte.on('select', function(combo, record) {
            if (record.data.idreporte != 17) {
                //    _this.mymask.show();
                modelo.stOrganismo.reload({
                    callback: function() {
                        //   _this.mymask.hide();
                    }
                });
            }
            switch (record.data.idreporte) {
                case 1:
                    {
                        vista.winReportePlan.show();
                        vista.winReportePlan.setTitle('Reporte Viviendas');
                        reporte = 1;
                    }
                    break;
                case 2:
                    {
                        vista.winReporteDemandaEquipos.show();
                        vista.winReporteDemandaEquipos.setTitle('Reporte Demanda de Equipos');
                        reporte = 2;
                    }
                    break;
                case 3:
                    {
                        modelo.stMoneda.reload();
                        modelo.stCredito.reload();
                        vista.winReporteAcreedor.show();
                        vista.winReporteAcreedor.setTitle('Reporte Acreedor Inversi\xF3n');
                        reporte = 3;
                    }
                    break;
                case 4:
                    {
                        modelo.stCredito.reload();
                        modelo.stMoneda.reload();
                        vista.winReporteAcreedor.show();
                        vista.winReporteAcreedor.setTitle('Reporte Inversi\xF3n Acreedor');
                        reporte = 4;
                    }
                    break;
                case 5:
                    {
                        vista.winReporteResumenInv.show();
                        vista.winReporteResumenInv.setTitle('Reporte Resumen de Inversi\xF3n');
                        reporte = 5;
                    }
                    break;
                case 6:
                    {
                        vista.ObservacionEmision.setValue('Se faculta al Ministro de los OACE o al Presidente de las OSDE, de los CAP y del CAM Isla de la Juventud, a decidir sobre la desagregación de las inversiones no nominales, sin exceder el total autorizado.');
                        vista.tfaprobadoEmision.setValue('Marino Murillo Jorge');
                        vista.winReporteEmision.show();
                        vista.winReporteEmision.setTitle('Reporte Emisi\xF3n Inversi\xF3n en MP');
                        reporte = 6;
                    }
                    break;
                case 7:
                    {
                        modelo.stConstructor.reload();
                        modelo.stProvinciaConstructor.reload();
                        vista.winReporteConstructorM.show();
                        vista.winReporteConstructorM.setTitle('Reporte Cosntrucci\xF3n y Montaje por Constructor');
                        reporte = 7;
                    }
                    break;
                case 8:
                    {
                        modelo.stConstructor.reload();
                        modelo.stProvinciaConstructor.reload();
                        vista.winReporteConstructorMC.show();
                        vista.winReporteConstructorMC.setTitle('Reporte Cosntrucci&oacute;n y Montaje');
                        reporte = 8;
                    }
                    break;
                case 9:
                    {
                        vista.ObservacionAuto.setValue('La Cantidad total de Equipos por Reposición e Incremento y el Valor Total constituyen indicadores Directivos Máximos. Los Organismos Rectores MITRANS, MICONS, MINDUS y MINAG están facultados para modificar las clasificaciones por tipo de equipos.');
                        vista.tfaprobadoAuto.setValue('Marino Murillo Jorge');
                        vista.winReporteAutomotor.show();
                        modelo.stComprarPlan.reload();
                        vista.winReporteAutomotor.setTitle('Reporte equipos automotores');
                        reporte = 9;
                    }
                    break;
                case 10:
                    {
                        vista.winReporteResumenInv.show();
                        vista.winReporteResumenInv.setTitle('Reporte Resumen de Inversi\xF3n en MUSD');
                        reporte = 10;
                    }
                    break;
                case 11:
                    {
                        vista.winReporteMaqueta.show();
                        vista.winReporteMaqueta.setTitle('Reporte Maqueta');
                        reporte = 11;
                    }
                    break;
                case 12:
                    {
                        vista.ObservacionAuto.setValue('');
                        vista.winReporteAutomotor.show();
                        modelo.stComprarPlan.reload();
                        vista.winReporteAutomotor.setTitle('Reporte equipos automotores');
                        reporte = 12;
                    }
                    break;
                case 13:
                    {
                        modelo.stConstructor.reload();
                        modelo.stProvinciaConstructor.reload();
                        vista.winReporteConstructorM.show();
                        vista.winReporteConstructorM.setTitle('Reporte Cosntrucci\xF3n y Montaje por Constructor');
                        reporte = 13;
                    }
                    break;
                case 14:
                    {
                        vista.winReporteAutomotorexcel.show();
                        modelo.stComprarPlan.reload();
                        modelo.stAdquirirexcel.reload();
                        modelo.stFormapropiedad.reload();
                        modelo.stOrganosatisface.reload();
                        reporte = 14;
                    }
                    break;
                case 15:
                    {
                        vista.winReporteCMExcel.show();
                        reporte = 15;
                    }
                    break;
                case 16:
                    {
                        vista.winRptComponente.show();
                        reporte = 16;
                    }
                    break;
                case 17:
                    {
                        vista.winReporteBalanceAutomor.show();
                        modelo.storgSatisface.reload();
                        vista.winReporteBalanceAutomor.setTitle('Reporte balance automotor');
                        reporte = 17;
                    }
                    break;
                case 18:
                    {
                        vista.winReporteResumenInv.show();
                        vista.winReporteResumenInv.setTitle('Reporte Resumen de Inversi\xF3n');
                        reporte = 18;
                    }
                    break;
                case 19:
                    {
                        vista.winRptComponente.show();
                        reporte = 19;
                    }
                    break;
                default:
                    {
                        vista.winReportePlan.show();
                        vista.winReportePlan.setTitle('Reporte Habitaci\xF3n');
                        reporte = 0;
                    }
            }
        });

        vista.cbOrganismoComponente.on({
            select: function(combo, record) {
                //   _this.mymask.show();
                modelo.stEntidad.reload({
                    params: {
                        idorganismo: Ext.encode(vista.CmbOrganismo.getCheckedValue())
                    },
                    callback: function(options, success, response) {
                        vista.cbEntComponente.enable();
                        //     _this.mymask.hide();
                        vista.btnAceptarComponente.enable();
                    }
                });
            }
        });
        vista.CmbOrganismo.on('select', function(combo, record) {
            comboorganismo = vista.CmbOrganismo.getCheckedValue();
            var organismos = Ext.encode(comboorganismo);
            //  _this.mymask.show();
            modelo.stEntidad.reload({
                params: {
                    idorganismo: organismos
                },
                callback: function(options, success, response) {
                    _this.mymask.hide();
                }
            });
        }),
                vista.CmbOrganismoC.on('select', function(combo, record) {
            //  _this.mymask.show();
            comboorganismoA = vista.CmbOrganismoC.getCheckedValue();
            var organismos = Ext.encode(comboorganismoA);

            modelo.stEntidad.reload({
                params: {
                    idorganismo: organismos
                },
                callback: function(options, success, response) {
                    _this.mymask.hide();
                }
            });
        }),
                /*  vista.CmbOrganismoCC.on('select', function(combo, record) {
                 _this.mymask.show();
                 modelo.stEntidad.reload({
                 params: {
                 idorganismo: vista.CmbOrganismoCC.getValue()
                 },
                 callback: function(options, success, response) {
                 _this.mymask.hide();
                 }
                 });
                 }),*/
                vista.CmbOrganismoA.on('select', function(combo, record) {
            _this.mymask.show();
            comboorganismoA = vista.CmbOrganismoA.getCheckedValue();
            var organismos = Ext.encode(comboorganismoA);
            modelo.stEntidad.reload({
                params: {
                    idorganismo: organismos
                },
                callback: function(options, success, response) {
                    _this.mymask.hide();
                }
            });
        }),
                vista.CmbOrganismoE.on('select', function(combo, record) {
            comboorganismoA = vista.CmbOrganismoE.getCheckedValue();
            //  var organismos = Ext.encode(comboorganismoA);

        }),
                vista.CmbOrganismoAuto.on('select', function(combo, record) {
            _this.mymask.show();
            comboorganismoA = vista.CmbOrganismoAuto.getCheckedValue();
            var organismos = Ext.encode(comboorganismoA);
            _this.mymask.hide();
        }),
                vista.CmbOrganismoAexcel.on('select', function(combo, record) {
            _this.mymask.show();
            comboorganismoA = vista.CmbOrganismoAexcel.getCheckedValue();
            var organismos = Ext.encode(comboorganismoA);
            modelo.stEntidad.reload({
                params: {
                    idorganismo: organismos
                },
                callback: function(options, success, response) {
                    _this.mymask.hide();
                }
            });
            vista.CmbEntidadAexcel.enable();
            _this.mymask.hide();
        }),
                vista.CmbOrganismoRD.on('select', function(combo, record) {
            organismo = vista.CmbOrganismoRD.getCheckedValue();
            var organismos = Ext.encode(organismo);
            _this.mymask.show();
            modelo.stEntidad.reload({
                params: {
                    idorganismo: organismos
                },
                callback: function(options, success, response) {
                    _this.mymask.hide();
                }
            });
            vista.CmbEntidadRD.enable();
            vista.btnAceptarRD.enable();
        }),
                ///*********
                vista.btnAdicionarPresupuesto.on('click', function() {
            var record = new Ext.data.Record({
                valor: '',
                moneda: ''
            });
            modelo.stPresupuesto.add(record);
        });

        vista.btnAdicionarFinan.on('click', function() {
            var record = new Ext.data.Record({
                valor: '',
                moneda: '',
                financi: '',
                tipo: '',
                plazoamortizacion: 0,
                porcientointeres: 0,
                gracia: 0
            });
            modelo.store_Financiamiento.add(record);
        });

        vista.btnEliminar.on({
            click: function() {
                mostrarMensaje(2, "¿Est&aacute; seguro de que quiere eliminar el presupuesto seleccionado?", function(btnPress) {
                    if (btnPress === 'ok') {
                        // this.mymask.show();
                        Ext.Ajax.request({
                            method: "POST",
                            url: "eliminarPlanPresupuesto",
                            params: {
                                idpresanteproy: vista.grid_PresupuestoP.getSelectionModel().getSelected().data.idpresanteproy
                            },
                            callback: function(options, success, response) {
                                mostrarMensaje(1, 'El presupuesto de antiproyecto se ha eliminado satisfactoriamente.');
                                modelo.stPresupuesto.reload();
                            }
                        });
                    }
                });
            }

        });

        vista.btnEliminarFinan.on({
            click: function() {
                mostrarMensaje(2, "¿Est&aacute; seguro de que quiere eliminar el financiamiento seleccionado?", function(btnPress) {
                    if (btnPress === 'ok') {
                        if (vista.smInversiones.getSelected()) {
                            selecti = vista.gpInversiones.getSelectionModel().getSelected().data.idinversion;
                        } else {
                            selecti = 0;
                        }
                        Ext.Ajax.request({
                            method: "POST",
                            url: "eliminarFinanciamiento",
                            params: {
                                idfinanciamiento: vista.grid_FinanciamientoP.getSelectionModel().getSelected().data.idfinanciamiento,
                                identidad: idorganismo,
                                idejercicio: vista.cmbEjercicio.getValue(),
                                idinversion: selecti ? selecti : 0
                            },
                            callback: function(options, success, response) {
                                //  _this.mymask.hide();
                                mostrarMensaje(1, 'El financiamiento se ha eliminado satisfactoriamente.');
                                modelo.store_Financiamiento.reload();
                            }
                        });
                    }
                });
            }

        });

        Ext.getCmp('btnAceptarAddinversion').on({
            click: function() {
                if (Ext.getCmp('btnAceptarAddinversion').enable()) {
                    modificarPlanInversiones();
                    vista.win_add_inversiones.hide();
                    recarga(modelo.stIinversiones, 20);

                }
            }
        });
        Ext.getCmp('btnAplicarAddinversion').on({
            click: function() {
                if (Ext.getCmp('btnAplicarAddinversion').enable()) {
                    modificarPlanInversiones();

                }
            }
        });
        vista.tfProvincia.on({
            focus: function() {
                vista.ventanaDpt.show();
            }
        });
        vista.ventanaDpt.on('dameseleccion', function(obj, data) {
            vista.iddpt = data.get('iddpt');
            vista.tfProvincia.setValue(data.get('denominacion'));
            vista.ventanaDpt.hide();
        });
        vista.btnModificarPlaninversion.on({
            click: function() {
                // vista.win_add_inversiones.show();
                //vista.treeDatosNomencl.root.reload();
                addmod = true;
                levantarBtnadd(addmod);
            }
        });

        vista.btnVerDetalles.on('click', function() {
            ReportesContratos();
        });

        vista.btnVerCuadre.on('click', function() {
            VerCuadre();
        });

        vista.btnAceptarR.on('click', function() {


            verReportes();
        });
        vista.btnAceptarA.on('click', function() {
            verReportesAcredorInversion();

        });
        vista.btnAceptarBalanceAutomor.on('click', function() {
            verReporteBalance();
        });
        vista.btnAceptarCosnt.on('click', function() {
            verReportesConstruct();
        });
        vista.btnAceptarCosntC.on('click', function() {
            verReportesConstructorC();
        });
        vista.btnAceptarE.on('click', function() {
            verReportesEmisionInv();
            vista.winReporteEmision.hide();
        });
        vista.btnAplicarE.on('click', function() {
            verReportesEmisionInv();
        });
        vista.btnAceptarAuto.on('click', function() {
            if (reporte == 9)
                verReportesEquiposAutomotores();
            else
                exportarEquiposAutomotroesExcel();
        });
        vista.btnAceptarAutoExcel.on('click', function() {
            exportarEquiposExcel();
        });
        vista.winReporteAutomotorexcel.on({
            'hide': function() {
                vista.fmreporteAutomotorexcel.getForm().reset();
                vista.cbReporte.clearValue();
            }
        });
        function levantarBtnadd(addmod) {
            modelo.stFinancista.reload();
            modelo.stTipoFinan.reload();
            if (vista.smInversiones.getSelected()) {
                var selecti = vista.gpInversiones.getSelectionModel().getSelected().data.idinversion;
            }
            Ext.Ajax.request({
                method: "POST",
                url: "cargarDatosModificar",
                params: {
                    idinversion: vista.smInversiones.getSelected().data.idinversion
                },
                callback: function(options, success, response) {
                    //  _this.mymask.hide();
                    // vista.btn_aplicar_formato.hide();
                    var responseData = Ext.decode(response.responseText);
                    vista.tfdenominacion.setValue(responseData.data[0].denominacion);
                    vista.tfFechaInicio.setValue(responseData.data[0].fechainicio);
                    vista.tfFechaFin.setValue(responseData.data[0].fechafin);
                    vista.tfProvincia.setValue(responseData.data[0].provincia.nombreprovincia);
                    vista.cmbClasificacion.setValue(responseData.data[0].tipoinversion.idtipoinversion);
                    vista.CmbCaracteristica.setValue(responseData.data[0].caracteristica.idcaracteristica);
                    vista.cmbMedioAmbiente.setValue(responseData.data[0].medioambiente.idmedioambiente);
                    vista.CmbTipoInversion.setValue(responseData.data[0].programa.idtipoinversionprograma);
                    vista.CmbFormaDePropiedad.setValue(responseData.data[0].forma.idformapropiedad);
                    vista.CmbObjetivo.setValue(responseData.data[0].objetivo.idobjetivo);
                    vista.CmbEfectoEnComercio.setValue(responseData.data[0].comercio.idefectocomercial);
                    vista.tfAnalisis.setValue(responseData.data[0].analisis);
                    vista.CmbDesempenno.setValue(responseData.data[0].desempeno.iddatdesempenno);
                    vista.CmbProgramadaP.setValue(responseData.data[0].programaa.idprograma);
                    if (responseData.data[0].fasttrack === 1) {
                        vista.ChkFastTrack.checked = 1;
                    } else {
                        vista.ChkFastTrack.checked = 0;
                    }
                    vista.win_add_inversiones.show();
                    modelo.stPresupuesto.reload({
                        params: {
                            start: 0,
                            limit: 20,
                            identidad: idorganismo,
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: selecti ? selecti : 0
                        }
                    });

                    modelo.store_Financiamiento.reload({
                        params: {
                            start: 0,
                            limit: 20,
                            identidad: idorganismo,
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: selecti ? selecti : 0
                        }
                    });
                    modelo.store_Erogacion.reload({
                        params: {
                            start: 0,
                            limit: 20,
                            identidad: idorganismo,
                            idejercicio: vista.cmbEjercicio.getValue(),
                            idinversion: selecti ? selecti : 0
                        }
                    });
                }
            });

        }
        ;

        function modificarPlanInversiones() {
            var fechacreacion = vista.tfFechaInicio.getValue().format('d/m/Y');
            var fechafin = vista.tfFechaFin.getValue().format('d/m/Y');
            var chequeado = vista.ChkFastTrack.getValue();
            //  var record = vista.grid_Presupuesto.getStore().getAt();
            //form.getForm().loadRecord(record);
            arraypresupuesto = new Array();
            records = modelo.stPresupuesto.getModifiedRecords();
            array = new Array();
            modelo.stPresupuesto.commitChanges();
            for (var i = 0; i < records.length; i++) {
                arraypresupuesto.push(records[i].data);
            }
            arrayfin = new Array();
            recordsfinan = modelo.store_Financiamiento.getModifiedRecords();
            modelo.store_Financiamiento.commitChanges();
            for (var i = 0; i < recordsfinan.length; i++) {
                arrayfin.push(recordsfinan[i].data);
            }
            arrayliq = new Array();
            recordsliq = modelo.store_Erogacion.getModifiedRecords();
            modelo.store_Erogacion.commitChanges();
            for (var i = 0; i < recordsliq.length; i++) {
                arrayliq.push(recordsliq[i].data);
            }
            if (chequeado == true) {
                fasttrack = 1;
            }
            else {
                fasttrack = 0;
            }
            if (vista.smInversiones.getSelected()) {
                var selecti = vista.gpInversiones.getSelectionModel().getSelected().data.idinversion;
            }
            Ext.Ajax.request({
                url: 'modificarPlanInversiones',
                params: {
                    idinversion: selecti ? selecti : 0,
                    idtipoinversion: vista.cmbClasificacion.getValue(),
                    denominacion: vista.tfdenominacion.getValue(),
                    idefectocomercial: vista.CmbEfectoEnComercio.getValue(),
                    idobjetivo: vista.CmbObjetivo.getValue(),
                    idformapropiedad: vista.CmbFormaDePropiedad.getValue(),
                    idtipoinversionprograma: vista.CmbTipoInversion.getValue(),
                    fechainicio: fechacreacion,
                    idcaracteristica: vista.CmbCaracteristica.getValue(),
                    idmedioambiente: vista.cmbMedioAmbiente.getValue(),
                    fechafin: fechafin,
                    idprovincia: vista.iddpt,
                    fasttrack: fasttrack,
                    analpostinversiones: vista.tfAnalisis.getValue(),
                    iddatdesempenno: vista.CmbDesempenno.getValue(),
                    idprograma: vista.CmbProgramadaP.getValue(),
                    presupuesto: Ext.encode(arraypresupuesto),
                    financiamiento: Ext.encode(arrayfin),
                    liquidos: Ext.encode(arrayliq)

                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgP == 1) {
                        mostrarMensaje(1, 'El plan de inversiones se ha modificado satifactoriamente.');

                        vista.tabAbajo.setActiveTab(0);


                    } else if (responseData.codMsgP == 2) {
                        mostrarMensaje(1, 'Por favor verifique,existe alguna moneda que se encuentra repetida.');
                    } else if (responseData.codMsgP == 3) {
                        mostrarMensaje(1, 'Por favor verifique,existe el financista.');
                    } else if (responseData.codMsgP == 4) {
                        mostrarMensaje(1, 'Por favor verifique,existe el tipo de financista.');
                    }

                }
            });

        }

        function verReportes() {
            record = modelo.stEntidad.getRange();
            array = new Array();
            arrayDen = new Array();
            for (var i = 0; i < record.length; i++) {
                array.push(record[i].data.identidad);
                arrayDen.push(record[i].data.entidad);
            }

            // if (vista.CmbOrganismo.getValue() != "" && vista.tfaprobadoHV.getValue() != "" && vista.tfelaboradoVH.getValue() != "") {
            if (vista.fmreportePlan.getForm().isValid() == true || (vista.CmbOrganismo.getValue() != "" && vista.tfaprobadoHV.getValue() != "" && vista.tfelaboradoVH.getValue() != "")) {
                _this.BarraProgreso.show('Cargando datos');
                Ext.Ajax.request({
                    url: 'reporteViviendaHabitacion',
                    params: {
                        idorganismo: vista.CmbOrganismo.getValue(),
                        identidad: vista.CmbEntidad.getValue(),
                        aprobadopor: vista.tfaprobadoHV.getValue(),
                        elaboradopor: vista.tfelaboradoVH.getValue(),
                        idejercicio: vista.cmbEjercicio.getValue(),
                        idejercicioden: vista.cmbEjercicio.getRawValue(),
                        organismoden: vista.CmbOrganismo.getRawValue(),
                        observacion: vista.ObservacionR.getValue(),
                        reporte: reporte,
                        identiDen: vista.CmbEntidad.getRawValue(),
                        entidadeshijas: Ext.encode(array),
                        entidadesDen: Ext.encode(arrayDen)

                    },
                    callback: function(options, success, response) {
                        var cuerporeporte = Ext.decode(response.responseText);
                        var winreporte = window.open('', '', 'scrollbars = yes,toolbar = yes,location = yes,resizable = yes, menubar = yes, status = yes');
                        winreporte.document.write("<HTML><HEAD><TITLE>Vista previa del reporte</TITLE></HEAD><BODY>" + cuerporeporte + "</BODY></HTML>");
                        reporte = 0;
                        _this.BarraProgreso.hide();
                        vista.fmreportePlan.getForm().reset();
                        vista.CmbEntidad.clearValue();
                        vista.cbReporte.clearValue();
                        vista.winReportePlan.hide();
                    }

                });
            } else {
                mostrarMensaje(1, "Existe(n) alg&uacute;n(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");
            }

        }

        function verReportesResumenInversion() {
            if (vista.CmbOrganismoResumenInv.getCheckedValue() != "") {
                var idorganismo = vista.CmbOrganismoResumenInv.getCheckedValue();
                var identidad = vista.CmbEntidadResumenInv.getValue();
                var elaboradopor = vista.tfelaboradoResumenInv.getValue();
                var aprobadopor = vista.tfaprobadoResumenInv.getValue();
                var idejercicio = vista.cmbEjercicio.getValue();
                var idejercicioden = vista.cmbEjercicio.getRawValue();
                var organismoden = vista.CmbOrganismoResumenInv.getRawValue();
                var entidadesden = vista.CmbEntidadResumenInv.getRawValue();
                var observacion = vista.ObservacionResumenInv.getValue();
                var reporte = reporte;
//                var identiDen = vista.CmbEntidad.getRawValue();
//                var entidadeshijas = Ext.encode(array);
//                var entidadesDen = Ext.encode(arrayDen);
                var win = window.open('reporteResumenInversion?idorganismo=' + idorganismo + '&identidad=' + identidad + '&aprobadopor=' + aprobadopor + '&idejercicio=' +
                        idejercicio + '&elaboradopor=' + elaboradopor + '&idejercicioden=' + idejercicioden + '&organismoden=' + organismoden +
                        '&observacion=' + observacion + '&reporte=' + vista.cbReporte.getValue() + '&idinversion=' +
                        /*vista.cbDenomInv.getValue() + '&identiDen=' + identiDen + '&entidadeshijas=' + entidadeshijas + */'&entidadesDen=' + entidadesden);
                vista.winReporteResumenInv.hide();
                vista.fmreporteResumenInv.getForm().reset();
                vista.cbReporte.clearValue();
            }
            else {
                mostrarMensaje(1, "Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");
            }
        }

        function verReportesAcredorInversion() {
            if (vista.fmreporteAcreedor.getForm().isValid() == true || vista.CmbOrganismoA.getValue() != "" && vista.tfelaboradoA.getValue() != "" && vista.tfaprobadoA.getValue() != ""
                    && vista.CmbMoneda.getValue() != "") {
                var idorganismo = vista.CmbOrganismoA.getValue();
                var identidad = vista.CmbEntidadA.getValue();
                var moneda = vista.CmbMoneda.getValue();
                var credito = vista.CmbCredito.getValue();
                var elaboradopor = vista.tfelaboradoA.getValue();
                var aprobadopor = vista.tfaprobadoA.getValue();
                var interes = vista.tfinteres.getValue();
                var amorti = vista.tfamortizacion.getValue();
                var gracia = vista.tfgracia.getValue();
                var idejercicio = vista.cmbEjercicio.getValue();
                var idejercicioden = vista.cmbEjercicio.getRawValue();
                var organismoden = vista.CmbOrganismoA.getRawValue();
                var observacion = vista.ObservacionA.getValue();
                var reporte = reporte;
                var identiDen = vista.CmbEntidadA.getRawValue();
                var win = window.open('reporteAcredorInversion?idorganismo=' + idorganismo + '&identidad=' + identidad + '&aprobadopor=' + aprobadopor + '&idejercicio=' +
                        idejercicio + '&elaboradopor=' + elaboradopor + '&identiDen=' + identiDen + '&idejercicioden=' + idejercicioden + '&organismoden=' + organismoden +
                        '&observacion=' + observacion + '&reporte=' + vista.cbReporte.getValue()
                        + '&moneda=' + moneda + '&credito=' + credito + '&interes=' + interes + '&amorti=' + amorti + '&gracia=' + gracia);
                vista.winReporteAcreedor.hide();

                vista.fmreporteAcreedor.getForm().reset();
                vista.CmbOrganismoA.clearValue();
                vista.CmbEntidadA.clearValue();
                vista.CmbMoneda.clearValue();
                vista.CmbCredito.clearValue();
                vista.cbReporte.clearValue();
            }
            else {
                mostrarMensaje(1, "Existe(n) alg&uacute;n(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");
            }
        }
        /*var win = window.open('reporteBalanceV');
         //  vista.winRptBalance.show();
         reporte = 17; verReporteBalance*/
        function verReporteBalance() {
            if (vista.fmreporteBalanceAutomor.getForm().isValid()) {
                var orgRector = vista.cmbOrganoS.getValue();
                var win = window.open('reporteBalanceV?idorgrector=' + orgRector);

                vista.winReporteBalanceAutomor.hide();
                vista.fmreporteBalanceAutomor.getForm().reset();
            }
            else {
                mostrarMensaje(1, "Existe(n) alg&uacute;n(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");

            }
        }

        function verReportesEmisionInv() {
            if (vista.fmreporteEmision.getForm().isValid() == true || vista.CmbOrganismoE.getValue() != "" && vista.CmbFormaEmision.getValue() != "" && vista.tfelaboradoEmision.getValue() != "" && vista.tfaprobadoEmision.getValue() != "") {
                var idorganismo = vista.CmbOrganismoE.getValue();

                var elaboradopor = vista.tfelaboradoEmision.getValue();
                var aprobadopor = vista.tfaprobadoEmision.getValue();
                var idejercicio = vista.cmbEjercicio.getValue();
                var forma = vista.CmbFormaEmision.getValue();
                var formaden = vista.CmbFormaEmision.getRawValue();
                var idejercicioden = vista.cmbEjercicio.getRawValue();
                var organismoden = vista.CmbOrganismoE.getRawValue();
                var observacion = vista.ObservacionEmision.getValue();
                var win = window.open('reporteEmisionInversion?idorganismo=' + idorganismo + '&forma=' + forma + '&aprobadopor=' + aprobadopor + '&idejercicio=' +
                        idejercicio + '&elaboradopor=' + elaboradopor + '&idejercicioden=' + idejercicioden + '&organismoden=' + organismoden +
                        '&observacion=' + observacion + '&reporte=' + vista.cbReporte.getValue() +
                        '&forma=' + vista.CmbFormaEmision.getValue() + '&formaden=' + formaden);
                vista.fmreporteEmision.getForm().reset();
                vista.CmbOrganismoE.clearValue();
                vista.CmbFormaEmision.clearValue();
                vista.cbReporte.clearValue();
            }
            else {
                mostrarMensaje(1, "Existe(n) alg&uacute;n(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");

            }
        }

        function verReportesConstruct() {
            var cheque = vista.ChekCon.getValue();
            if (cheque == true) {
                chequeado = 1;
            }
            else {
                chequeado = 0;
            }
            if (vista.fmreporteConstructorInv.getForm().isValid() == true || vista.CmbOrganismoC.getValue() != "" && vista.tfelaboradoC.getValue() != "" && vista.tfaprobadoC.getValue() != "") {
                var idorganismo = vista.CmbOrganismoC.getValue();
                var elaboradopor = vista.tfelaboradoC.getValue();
                var aprobadopor = vista.tfaprobadoC.getValue();
                var idejercicio = vista.cmbEjercicio.getValue();
                var constructor = vista.CmbConstructores.getValue();
                var idejercicioden = vista.cmbEjercicio.getRawValue();
                var organismoden = vista.CmbOrganismoC.getRawValue();
                var observacion = vista.ObservacionC.getRawValue();
                var formac = vista.CmbformaPropiedad.getValue();
                var formadenc = vista.CmbformaPropiedad.getRawValue();
                var provincia = vista.CmbProvinciaConstructor.getValue();
                var chequeado = chequeado;
                var construc = Ext.encode(constructor);
                if (reporte == 7) {
                    var win = window.open('reporteXCosntructor?idorganismo=' + idorganismo + '&constructor=' + constructor
                            + '&arrayconstructor=' + construc + '&aprobadopor=' + aprobadopor + '&idejercicio=' +
                            idejercicio + '&elaboradopor=' + elaboradopor + '&idejercicioden=' + idejercicioden
                            + '&formaden=' + formac + '&forma=' + formadenc + '&organismoden=' + organismoden +
                            '&observacion=' + observacion + '&reporte=' + vista.cbReporte.getValue() +
                            '&constructor=' + vista.CmbConstructores.getValue() + '&provincia=' + provincia + '&idpt=' + vista.iddpt + '&chequeado=' + chequeado);
                } else {


                    var win = window.open('reporteXCosntructorExcel?idorganismo=' + idorganismo + '&constructor=' + constructor
                            + '&arrayconstructor=' + construc + '&aprobadopor=' + aprobadopor + '&idejercicio=' +
                            idejercicio + '&elaboradopor=' + elaboradopor + '&idejercicioden=' + idejercicioden + '&organismoden=' + organismoden
                            + '&formaden=' + formac + '&forma=' + formadenc
                            + '&observacion=' + observacion + '&reporte=' + vista.cbReporte.getValue() +
                            '&constructor=' + vista.CmbConstructores.getValue() + '&provincia=' + provincia + '&idpt=' + vista.iddpt + '&chequeado=' + chequeado);
                }

            }
            else {
                mostrarMensaje(1, "Existe(n) alg&uacute;n(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");
            }
            vista.winReporteConstructorM.hide();
            vista.fmreporteConstructorInv.getForm().reset();
            vista.CmbOrganismoC.clearValue();
            vista.CmbConstructores.clearValue();
            vista.cbReporte.clearValue();
        }

        function verReportesConstructorC() {
            var cheque1 = vista.ChekCons.getValue();
            if (cheque1 == true) {
                chequeado1 = 1;
            }
            else {
                chequeado1 = 0;
            }

            if (vista.fmreporteConstructorInvCons.getForm().isValid() == true || vista.CmbOrganismoCC.getValue() != "" && vista.tfelaboradoCC.getValue() != "" && vista.tfaprobadoCC.getValue() != "") {
                var idorganismo = vista.CmbOrganismoCC.getValue();
                var elaboradopor = vista.tfelaboradoCC.getValue();
                var aprobadopor = vista.tfaprobadoCC.getValue();
                var idejercicio = vista.cmbEjercicio.getValue();
                var constructor = vista.CmbConstructoresCC.getValue();
                var idejercicioden = vista.cmbEjercicio.getRawValue();
                var organismoden = vista.CmbOrganismoCC.getRawValue();
                var observacion = vista.ObservacionCC.getRawValue();
                var provincia = vista.CmbProvinciaConstructorCC.getValue();
                var formac = vista.CmbformaPropiedad.getValue();
                var formadenc = vista.CmbformaPropiedad.getRawValue();
                var chequeado1 = chequeado1;
                var construc = Ext.encode(constructor);
                var win = window.open('reporteXCosntructor?idorganismo=' + idorganismo + '&constructor=' + constructor
                        + '&arrayconstructor=' + construc + '&aprobadopor=' + aprobadopor + '&idejercicio=' +
                        idejercicio + '&elaboradopor=' + elaboradopor + '&idejercicioden=' + idejercicioden
                        + '&formaden=' + formac + '&forma=' + formadenc
                        + idejercicioden + '&organismoden=' + organismoden +
                        '&observacion=' + observacion + '&reporte=' + vista.cbReporte.getValue() +
                        '&constructor=' + vista.CmbConstructoresCC.getValue() + '&provincia=' + provincia + '&idpt=' + vista.iddpt + '&chequeado1=' + chequeado1);


            }
            else {
                mostrarMensaje(1, "Existe(n) alg&uacute;n(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");
            }
            vista.winReporteConstructorMC.hide();
            vista.fmreporteConstructorInvCons.getForm().reset();
            vista.CmbOrganismoCC.clearValue();
            vista.CmbConstructoresCC.clearValue();
            vista.cbReporte.clearValue();
        }

        function verReportesConstructorCExcel() {
            var cheque1 = vista.ChekCons.getValue();
            if (cheque1 == true) {
                chequeado1 = 1;
            }
            else {
                chequeado1 = 0;
            }

            if (vista.fmreporteConstructorInvCons.getForm().isValid() == true || vista.CmbOrganismoCC.getValue() != "" && vista.tfelaboradoCC.getValue() != "" && vista.tfaprobadoCC.getValue() != "") {
                var idorganismo = vista.CmbOrganismoCC.getValue();
                var elaboradopor = vista.tfelaboradoCC.getValue();
                var aprobadopor = vista.tfaprobadoCC.getValue();
                var idejercicio = vista.cmbEjercicio.getValue();
                var constructor = vista.CmbConstructoresCC.getValue();
                var idejercicioden = vista.cmbEjercicio.getRawValue();
                var organismoden = vista.CmbOrganismoCC.getRawValue();
                var observacion = vista.ObservacionCC.getRawValue();
                var provincia = vista.CmbProvinciaConstructorCC.getValue();
                var chequeado1 = chequeado1;
                var construc = Ext.encode(constructor);

                /*     var win = window.open('reporteXCosntructorExcel?idorganismo=' + idorganismo + '&constructor=' + constructor
                 + '&arrayconstructor=' + construc + '&aprobadopor=' + aprobadopor + '&idejercicio=' +
                 idejercicio + '&elaboradopor=' + elaboradopor + '&idejercicioden=' + idejercicioden + '&organismoden=' + organismoden +
                 '&observacion=' + observacion + '&reporte=' + vista.cbReporte.getValue() +
                 '&constructor=' + vista.CmbConstructoresCC.getValue() + '&provincia=' + provincia + '&idpt=' + vista.iddpt + '&chequeado1=' + chequeado1);
                 */

                vista.winReporteConstructorMC.hide();
                vista.fmreporteConstructorInvCons.getForm().reset();
                vista.CmbOrganismoCC.clearValue();
                vista.CmbConstructoresCC.clearValue();
                vista.cbReporte.clearValue();
            }
            else {
                mostrarMensaje(1, "Existe(n) alg&uacute;n(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");
            }
        }

        function verReportesEquiposAutomotores() {
            if (vista.fmreporteAutomotor.getForm().isValid() == true || vista.CmbOrganismoAuto.getValue() != ""
                    && vista.CmbMonedaAuto.getValue() != "" && vista.CmbFormaEquipos.getValue() != ""
                    && vista.tfaprobadoAuto.getValue() != "" && vista.Cmbcompra.getValue() != ""
                    && vista.tfelaboradoAuto.getValue() != "") {

                var idorganismo = vista.CmbOrganismoAuto.getValue();
                var elaboradopor = vista.tfelaboradoAuto.getValue();
                var aprobadopor = vista.tfaprobadoAuto.getValue();
                var idejercicio = vista.cmbEjercicio.getValue();
                var idforma = vista.CmbFormaEquipos.getValue();
                var formaden = vista.CmbFormaEquipos.getRawValue();
                var idejercicioden = vista.cmbEjercicio.getRawValue();
                var organismoden = vista.CmbOrganismoAuto.getRawValue();
                var observacion = vista.ObservacionAuto.getRawValue();
                var idmoneda = vista.CmbMonedaAuto.getValue();
                var idcompra = vista.Cmbcompra.getValue();
                var identiDen = vista.CmbOrganismoAuto.getRawValue();
                var comprarden = vista.Cmbcompra.getRawValue();
                var win = window.open('reporteEquiposAutomotores?idorganismo=' + idorganismo + '&forma=' + idforma + '&aprobadopor=' + aprobadopor + '&idejercicio=' +
                        idejercicio + '&elaboradopor=' + elaboradopor + '&idejercicioden=' + idejercicioden + '&organismoden=' + organismoden + '&identiDen=' + identiDen +
                        '&observacion=' + observacion + '&reporte=' + vista.cbReporte.getValue() +
                        '&forma=' + vista.CmbFormaEquipos.getValue() + '&formaden=' + formaden + '&idmoneda=' + idmoneda + '&idcompra=' + idcompra + '&comprarden=' + comprarden);
                vista.winReporteAutomotor.hide();
                vista.fmreporteAutomotor.getForm().reset();
                vista.CmbOrganismoAuto.clearValue();
                vista.CmbFormaEquipos.clearValue();
                vista.cbReporte.clearValue();
            }
            else {
                mostrarMensaje(1, "Existe(n) alg&uacute;n(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");

            }
        }

        function exportarEquiposAutomotroesExcel() {
            if (vista.fmreporteAutomotor.getForm().isValid() == true || vista.CmbOrganismoAuto.getValue() != ""
                    && vista.CmbMonedaAuto.getValue() != "" && vista.CmbFormaEquipos.getValue() != ""
                    && vista.tfaprobadoAuto.getValue() != "" && vista.Cmbcompra.getValue() != ""
                    && vista.tfelaboradoAuto.getValue() != "") {

                var idorganismo = vista.CmbOrganismoAuto.getValue();
                var elaboradopor = vista.tfelaboradoAuto.getValue();
                var aprobadopor = vista.tfaprobadoAuto.getValue();
                var idejercicio = vista.cmbEjercicio.getValue();
                var idforma = vista.CmbFormaEquipos.getValue();
                var formaden = vista.CmbFormaEquipos.getRawValue();
                var idejercicioden = vista.cmbEjercicio.getRawValue();
                var organismoden = vista.CmbOrganismoAuto.getRawValue();
                var observacion = vista.ObservacionAuto.getRawValue();
                var idmoneda = vista.CmbMonedaAuto.getValue();
                var idcompra = vista.Cmbcompra.getValue();
                var identiDen = vista.CmbOrganismoAuto.getRawValue();
                var comprarden = vista.Cmbcompra.getRawValue();
                var win = window.open('exportarEquiposAutomotroesExcel?idorganismo=' + idorganismo + '&forma=' + idforma + '&aprobadopor=' + aprobadopor + '&idejercicio=' +
                        idejercicio + '&elaboradopor=' + elaboradopor + '&idejercicioden=' + idejercicioden + '&organismoden=' + organismoden + '&identiDen=' + identiDen +
                        '&observacion=' + observacion + '&reporte=' + vista.cbReporte.getValue() +
                        '&forma=' + vista.CmbFormaEquipos.getValue() + '&formaden=' + formaden + '&idmoneda=' + idmoneda + '&idcompra=' + idcompra + '&comprarden=' + comprarden);
                vista.winReporteAutomotor.hide();
                vista.fmreporteAutomotor.getForm().reset();
                vista.CmbOrganismoAuto.clearValue();
                vista.CmbFormaEquipos.clearValue();
                vista.cbReporte.clearValue();
            }
            else {
                mostrarMensaje(1, "Existe(n) alg&uacute;n(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");

            }
        }

        function exportarEquiposExcel() {

            if (vista.fmreporteAutomotorexcel.getForm().isValid() == true || vista.CmbOrganismoAexcel.getValue() != ""
                    && vista.CmbEntidadAexcel.getValue() != "" && vista.Cmborganorector.getValue() != ""
                    && vista.CmbformaPropiedadExcel.getValue() != "" && vista.Cmbadquirirexcel.getValue() != ""
                    && vista.Cmbcomprarexcel.getValue() != "") {

                var idorganismo = vista.CmbOrganismoAexcel.getValue();
                var identidad = vista.CmbEntidadAexcel.getValue();
                var idorgano = vista.Cmborganorector.getValue();
                var adquirir = vista.Cmbadquirirexcel.getValue();
                var formaE = vista.cmbFormaPropExcel.getValue();
                var formaEden = vista.cmbFormaPropExcel.getRawValue();
                var organismoden = vista.CmbOrganismoAexcel.getRawValue();
                var entidadden = vista.CmbEntidadAexcel.getRawValue();
                var idcompra = vista.Cmbcomprarexcel.getValue();
                var win = window.open('exportarEquiposExcel?idorganismo=' + idorganismo + '&adquirir=' + adquirir + '&FormaProp=' + formaE
                        + '&formaEden=' + formaEden + '&organismoden=' + organismoden + '&identiDen=' + entidadden + '&identidad=' + identidad +
                        '&idorgano=' + idorgano + '&idcompra=' + idcompra);
                vista.winReporteAutomotorexcel.hide();
                vista.fmreporteAutomotorexcel.getForm().reset();
                vista.CmbOrganismoAexcel.clearValue();
                vista.CmbEntidadAexcel.clearValue();
                vista.Cmborganorector.clearValue();
                vista.Cmbcomprarexcel.clearValue();
                vista.Cmbadquirirexcel.clearValue();
                vista.cbReporte.clearValue();
            }
            else {
                mostrarMensaje(1, "Existe(n) alg&uacute;n(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");

            }
        }

        function ReportesContratos() {
            // if (vista.cmInversiones.getSelected()) {
            var selecti = vista.smInversiones.getSelected().data.idinversion;
            var datos = vista.gpInversiones.getSelectionModel().getSelected().data;
            // }
            Ext.MessageBox.show({
                title: 'Por favor espere...',
                width: 300,
                wait: true,
                progress: true,
                closable: false,
                animEl: 'mb6',
                msg: 'Configurando el reporte.'
            });
            Ext.Ajax.request({
                url: 'mostrarVerDetalles',
                params: {
                    idinversion: selecti,
                    identidad: idorganismo,
                    datosinv: Ext.encode(datos),
                    idejercicio: vista.cmbEjercicio.getValue()

                },
                callback: function(options, success, response) {
                    var cuerporeporte = Ext.decode(response.responseText);
                    var winreporte = window.open('', '', 'scrollbars = yes,toolbar = yes,location = yes,resizable = yes, menubar = yes, status = yes');
                    winreporte.document.write("<HTML><HEAD><TITLE>Vista previa del reporte</TITLE></HEAD><BODY>" + cuerporeporte + "</BODY></HTML>");
                    winreporte.document.close();
                }

            });

            Ext.MessageBox.hide();
            ;
        }


        function VerCuadre() {

            var selecti = vista.smInversiones.getSelected().data.idinversion;
            var datos = vista.gpInversiones.getSelectionModel().getSelected().data;

            Ext.MessageBox.show({
                title: 'Por favor espere...',
                width: 300,
                wait: true,
                progress: true,
                closable: false,
                animEl: 'mb6',
                msg: 'Cargando.'
            });
            Ext.Ajax.request({
                url: 'mostrarCuadre',
                params: {
                    idinversion: selecti,
                    identidad: idorganismo,
                    datosinv: Ext.encode(datos),
                    idejercicio: vista.cmbEjercicio.getValue()

                },
                callback: function(options, success, response) {
                    var $cuerpocuadre = Ext.decode(response.responseText);
                    var winreporte = window.open('', '', 'scrollbars = yes,toolbar = yes,location = yes,resizable = yes, menubar = yes, status = yes');
                    winreporte.document.write("<HTML><HEAD><TITLE>Vista del Cuadre</TITLE></HEAD><BODY>" + $cuerpocuadre + "</BODY></HTML>");
                    winreporte.document.close();
                }

            });

            Ext.MessageBox.hide();
            ;
        }

        function verFinanciamientoPlan() {

            Ext.MessageBox.show({
                title: 'Por favor espere...',
                width: 300,
                wait: true,
                progress: true,
                closable: false,
                animEl: 'mb6',
                msg: 'Configurando el reporte.'
            });
            Ext.Ajax.request({
                url: 'verFinanciamientoPlan',
                params: {
                    identidad: idorganismo,
                    idinversion: vista.gpInversiones.getSelectionModel().getSelected().data.idinversion,
                    idejercicio: vista.cmbEjercicio.getValue()

                },
                callback: function(options, success, response) {
                    var cuerporeporte = Ext.decode(response.responseText);
                    var winreporte = window.open('', '', 'scrollbars = yes,toolbar = yes,location = yes,resizable = yes, menubar = yes, status = yes');
                    winreporte.document.write("<HTML><HEAD><TITLE>Vista previa del reporte</TITLE></HEAD><BODY>" + cuerporeporte + "</BODY></HTML>");
                    winreporte.document.close();
                }

            });
            Ext.MessageBox.hide();
        }

        function validarMoneda(data, addmod) {
            aux = false;
            if (data.items[1]) {
                for (var i = 0; i < data.length - 1; i++) {
                    if (!addmod) {
                        var pre = (data.items[i].data.idmonedaentidad != undefined) ? data.items[i].data.idmonedaentidad : data.items[i].data.moneda;
                    } else {
                        var pre = (data.items[i].data.moneda != undefined) ? data.items[i].data.moneda : data.items[i].data.idmonedaentidad;
                    }
                    for (var j = i + 1; j < data.length; j++) {
                        if (!addmod) {
                            var pre1 = (data.items[j].data.idmonedaentidad != undefined) ? data.items[j].data.idmonedaentidad : data.items[j].data.moneda;
                        } else {
                            var pre1 = (data.items[j].data.moneda != undefined) ? data.items[j].data.moneda : data.items[j].data.idmonedaentidad;

                        }
                        if (pre == pre1) {
                            aux = true;
                            break;
                        }
                    }
                    if (aux == true) {
                        break;
                    }
                }
            }
            return aux;
        }

        Ext.getCmp('btnCancelarAddinversion').on('click', function() {
            vista.win_add_inversiones.hide();
            vista.win_add_inversiones.doLayout();
            vista.tabAbajo.setActiveTab(0);
            //  vista.fmAdicionarInversion.getForm().doLayout();

        });
        vista.btnCancelarBalanceAutomor.on('click', function() {
            vista.winReporteBalanceAutomor.hide();
            vista.cmbOrganoS.clearValue();
        });

        vista.btnLimpiarInversiones.on('click', function() {
            vista.filtrosinv.clearFilters();
        });
        vista.btnLimpiarEquipo.on('click', function() {
            vista.filtrosEquipos.clearFilters();
            recarga(modelo.stEquipos, 10);
        });
        vista.btnLimpiarfinanciamiento.on('click', function() {
            vista.filtrosFinanciamineto.clearFilters();
        });

        vista.btnLimpiarPresupuesto.on('click', function() {
            vista.filtrosPresupuesto.clearFilters();
        });

        /*Equipo*/
        vista.btnCancelar.on({
            click: function() {
                vista.winAddEquipos.hide();
            }
        });
        vista.btnCancelarR.on({
            click: function() {
                vista.winReportePlan.hide();
                vista.fmreportePlan.getForm().reset();
                vista.CmbEntidad.clearValue();
                vista.cbReporte.clearValue();
            }
        });
        vista.winReportePlan.on({
            'hide': function() {
                vista.fmreportePlan.getForm().reset();
                vista.cbReporte.clearValue();
            }
        });
        vista.btnCancelarA.on({
            click: function() {
                vista.winReporteAcreedor.hide();
                vista.fmreporteAcreedor.getForm().reset();
                vista.CmbOrganismoA.clearValue();
                vista.CmbEntidadA.clearValue();
                vista.CmbMoneda.clearValue();
                vista.CmbCredito.clearValue();
                vista.cbReporte.clearValue();
            }
        });
        vista.winReporteAcreedor.on({
            'hide': function() {
                vista.fmreporteAcreedor.getForm().reset();
                vista.cbReporte.clearValue();
            }
        });
        vista.btnCancelarResumenInv.on({
            click: function() {
                vista.winReporteResumenInv.hide();
                vista.fmreporteResumenInv.getForm().reset();
                vista.cbReporte.clearValue();
            }
        });
        vista.winReporteResumenInv.on({
            'hide': function() {
                vista.fmreporteResumenInv.getForm().reset();
                vista.cbReporte.clearValue();
            }
        });
        vista.btnAceptarResumenInv.on({
            click: function() {
                verReportesResumenInversion();
            }
        });
        vista.btnCancelarE.on({
            click: function() {
                vista.winReporteEmision.hide();
                vista.fmreporteEmision.getForm().reset();
                vista.CmbOrganismoE.clearValue();
                vista.CmbFormaEmision.clearValue();
                vista.cbReporte.clearValue();
            }
        });
        vista.winReporteEmision.on({
            'hide': function() {
                vista.fmreporteEmision.getForm().reset();
                vista.cbReporte.clearValue();
            }
        });
        vista.btnCancelarConst.on({
            click: function() {
                vista.cbReporte.clearValue();
                vista.cbReporte.clearValue();
                vista.winReporteConstructorM.hide();
                vista.fmreporteConstructorInv.getForm().reset();
                vista.CmbOrganismoC.clearValue();
                vista.CmbConstructores.clearValue();

            }
        });
        vista.winReporteConstructorM.on({
            'hide': function() {
                vista.fmreporteConstructorInv.getForm().reset();
                vista.cbReporte.clearValue();
            }
        });
        vista.btnCancelarConstC.on({
            click: function() {
                vista.cbReporte.clearValue();
                vista.winReporteConstructorMC.hide();
                vista.fmreporteConstructorInvCons.getForm().reset();
                vista.CmbOrganismoCC.clearValue();
                vista.CmbConstructoresCC.clearValue();

            }
        });
        vista.winReporteConstructorMC.on({
            'hide': function() {
                vista.fmreporteConstructorInvCons.getForm().reset();
                vista.cbReporte.clearValue();
            }
        });
        vista.btnCancelarAuto.on({
            click: function() {
                vista.winReporteAutomotor.hide();
                vista.fmreporteAutomotor.getForm().reset();
                vista.CmbOrganismoAuto.clearValue();
                vista.cbReporte.clearValue();
            }
        });
        vista.winReporteAutomotor.on({
            'hide': function() {
                vista.fmreporteAutomotor.getForm().reset();
                vista.cbReporte.clearValue();
            }
        });
        vista.btnCancelarAutoExcel.on({
            click: function() {
                vista.cbReporte.clearValue();
                vista.winReporteAutomotorexcel.hide();
                vista.fmreporteAutomotorexcel.getForm().reset();
                vista.CmbOrganismoAexcel.clearValue();
                vista.Cmbcomprarexcel.clearValue();
                vista.CmbEntidadAexcel.clearValue();
                vista.Cmborganorector.clearValue();
                vista.cmbFormaPropExcel.clearValue();
                vista.Cmbadquirirexcel.clearValue();
            }
        });
        vista.winReporteAutomotorexcel.on({
            'hide': function() {
                vista.fmreporteAutomotorexcel.getForm().reset();
                vista.cbReporte.clearValue();
            }
        });
        vista.smEquipos.on({
            rowselect: function(sm, row, record) {
                if (sm.getSelections().length == 1) {
                    vista.btnEliEquipos.enable();
                } else if (sm.getSelections().length > 1) {
                    vista.btnEliEquipos.enable();
                } else if (sm.getSelections().length == 0) {
                    vista.btnEliEquipos.disable();
                }
            },
            rowdeselect: function(sm, row, record) {
                if (sm.getSelections().length == 1) {
                    vista.btnEliEquipos.enable();
                } else if (sm.getSelections().length > 1) {
                    vista.btnEliEquipos.enable();
                } else if (sm.getSelections().length == 0) {
                    vista.btnEliEquipos.disable();
                }
            }
        });

        vista.btnVerFinaciamiento.on({
            click: function() {
                verFinanciamientoPlan();
                /* _this.mymask.show();
                 modelo.stVerfinan.load({
                 params: {
                 identidad: vista.tpPlanInversion.getSelectionModel().getSelectedNode().id,
                 idejercicio: vista.cmbEjercicio.getValue(),
                 idinversion: vista.smInversiones.getSelected().data.idinversion,
                 limit: 20,
                 start: 0
                 },
                 callback: function() {
                 vista.winVerfinan.show();
                 _this.mymask.hide();
                 }
                 });*/
            }

        });

        vista.btnCerrarVerfinan.on({
            click: function() {
                vista.winVerfinan.hide();
            }
        });

        function recarga(store, limit) {
            store.reload({
                params: {
                    start: 0,
                    limit: limit != undefined ? limit : 20
                }
            })
        }

        function recargae(store, limit) {
            store.reload({
                params: {
                    start: 0,
                    limit: limit != undefined ? limit : 10
                }
            })
        }


        vista.btnEliEquipos.on({
            click: function() {
                mostrarMensaje(2, perfil.etiquetas.tlDelVal, function(btnPress) {
                    if (btnPress === 'ok') {
                        var valores = vista.gpEquipo.getSelectionModel().getSelections();
                        var arreglo = [];
                        for (i = 0; i < valores.length; i++) {
                            arreglo[i] = valores[i].data.idetapaequipos;
                        }
                        Ext.Ajax.request({
                            method: "POST",
                            url: '/planificacion/planmeta/index.php/inversiones/eliminarEquipos',
                            params: {
                                idetapaequipos: Ext.encode(arreglo)
                            },
                            callback: function(options, success, response) {
                                //modelo.stEquipos.reload(); 
                                recarga(modelo.stEquipos, 10);
                                mostrarMensaje(1, 'El(Los) equipo(s) se ha(n) eliminado correctamente.');
                            }
                        });
                    }
                });
            }
        });

        /* vista.CmbOrganismoRD.on({
         'select': function() {
         vista.CmbEntidadRD.enable();
         modelo.stEntidad.baseParams.idorganismo = vista.CmbOrganismoRD.getValue();
         modelo.stMonedaRD.baseParams.identidad = vista.CmbOrganismoRD.getValue();
         modelo.stMonedaRD.load();
         modelo.stEntidad.reload();
         }
         });*/
        vista.CmbOrganismoResumenInv.on({
            'select': function() {
                vista.CmbEntidadResumenInv.enable();
                vista.CmbEntidadResumenInv.reset();
//                vista.cbDenomInv.enable();
//                vista.cbDenomInv.reset();
                modelo.stEntidad.baseParams.idorganismo = Ext.encode(vista.CmbOrganismoResumenInv.getCheckedValue());
                modelo.stMonedaRD.baseParams.identidad = Ext.encode(vista.CmbOrganismoResumenInv.getCheckedValue());
//                modelo.stDenomInversion.baseParams.idejercicio = vista.cmbEjercicio.getValue();
//                modelo.stDenomInversion.baseParams.identidad = vista.CmbOrganismoResumenInv.getCheckedValue();
//                _this.mymask.show();
                modelo.stEntidad.reload();
//                modelo.stEntidad.reload({
//                    callback: function(options, success, response) {
//                        _this.mymask.hide();
////                        modelo.stDenomInversion.reload({
////                            callback: function(options, success, response) {
////                            }
////                        });
//                    }
//                });
            }
        });
        vista.CmbEntidadResumenInv.on({
            'select': function() {
//                modelo.stDenomInversion.baseParams.idejercicio = vista.cmbEjercicio.getValue();
//                modelo.stDenomInversion.baseParams.identidad = vista.CmbEntidadResumenInv.getValue();
//                _this.mymask.show();
//                modelo.stDenomInversion.reload({
//                    callback: function(options, success, response) {
//                        _this.mymask.hide();
//                    }
//                });
            }
        });
        vista.btnCancelarRD.on({
            'click': function() {
                vista.fmreporteDemandaE.getForm().reset();
                vista.winReporteDemandaEquipos.hide();
                vista.cbReporte.clearValue();
            }
        });
        vista.winReporteDemandaEquipos.on({
            'hide': function() {
                vista.fmreporteDemandaE.getForm().reset();
                vista.cbReporte.clearValue();
            }
        });
        vista.btnAceptarRD.on({
            'click': function() {
                exportarDemandaEquipos();

            }
        });

        function exportarDemandaEquipos() {
            var checkDemanda = vista.Chkdemanda.getValue();
            tolOrg = (checkDemanda) ? 1 : 0;
            if (vista.fmreporteDemandaE.getForm().isValid() == true || vista.CmbOrganismoRD.getValue() != ""
                    && vista.CmbMonedaRD.getValue() != ""
                    && vista.CmbNivelesRD.getValue() != "" && vista.tfelaborado.getValue() != ""
                    && vista.tfaprobado.getValue() != "") {
                var organismoden = vista.CmbOrganismoRD.getRawValue();
                var win = window.open('reporteDemandaEquipos?checkD=' + tolOrg + '&idejercicio=' + vista.cmbEjercicio.getValue() + '&idorganismo=' + vista.CmbOrganismoRD.getValue()
                        + '&identidad=' + vista.CmbEntidadRD.getValue() + '&idmoneda=' + vista.CmbMonedaRD.getValue() + '&idnivel=' + vista.CmbNivelesRD.getValue()
                        + '&organismo=' + vista.CmbOrganismoRD.getRawValue() + '&entidad=' + vista.CmbEntidadRD.getRawValue() + '&moneda=' + vista.CmbMonedaRD.getRawValue()
                        + '&nivel=' + vista.CmbNivelesRD.getRawValue() + '&aprobado=' + vista.tfaprobado.getValue()
                        + '&elaborado=' + vista.tfelaborado.getValue() + '&organismoden=' + organismoden + '&observaciones=' + vista.taObservaciones.getValue());

                vista.fmreporteDemandaE.getForm().reset();
                vista.winReporteDemandaEquipos.hide();
                vista.cbReporte.clearValue();
            } else {
                mostrarMensaje(1, "Existe(n) alg&uacute;n(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");
            }
        }


        vista.btnCancelarMaqueta.on({
            click: function() {
                vista.winReporteMaqueta.hide();
                vista.CmbOrganismoMaqueta.reset();
                vista.cmbFormaPropRepMaqueta.reset();
                vista.cmbCompRepMaqueta.reset();
                vista.tfaprobadoMaqueta.reset();
                vista.tfelaboradoMaqueta.reset();
                vista.ObservacionMaqueta.reset();
            }

        })
        vista.winReporteMaqueta.on({
            'hide': function() {
                vista.fmreporteMaqueta.getForm().reset();
                vista.cbReporte.clearValue();
            }
        });

        vista.btnAceptarMaqueta.on({
            click: function() {
                exportarRepMaqueta();
                vista.CmbOrganismoMaqueta.reset();
                vista.cmbFormaPropRepMaqueta.reset();
                vista.cmbCompRepMaqueta.reset();
                vista.tfaprobadoMaqueta.reset();
                vista.tfelaboradoMaqueta.reset();
                vista.ObservacionMaqueta.reset();
            }

        })
        function ArrayElemtLovCombo(elementos1, elementos2) {
            arreglo1 = [];
            arreglo2 = [];
            arreglo1 = elementos1.split(",");
            arreglo2 = elementos2.split(",");
            for (i = 0; i < arreglo2.length; i++) {
                for (j = 0; j < arreglo1.length; j++) {
                    if (arreglo2[i] == arreglo1[j]) {
                        arreglo2.splice(i, 1);
                    }
                }
            }
            return arreglo2;
        }

        function exportarRepMaqueta() {


            if (vista.CmbOrganismoMaqueta.getValue() != '' /*&& vista.ObservacionMaqueta.getValue() != '' && vista.tfaprobadoMaqueta.getValue() != '' && vista.tfelaboradoMaqueta.getValue() != ''*/) {

                organismo = vista.CmbOrganismoMaqueta.getCheckedValue();

                var organismoden = vista.CmbOrganismoMaqueta.getRawValue();
                var win = window.open('reporteMaqueta?idejercicio=' + vista.cmbEjercicio.getValue() + '&ejercicioden=' + vista.cmbEjercicio.getRawValue() +
                        /* '&identiDen=' + entidadesDen + '&entidadeshijas=' + entidadeshijas +*/ '&idorganismo=' + organismo + '&organismoden=' + organismoden
                        + '&idforma=' + vista.cmbFormaPropRepMaqueta.getValue() + '&aprobado=' + vista.tfaprobadoMaqueta.getValue() + '&elaborado=' + vista.tfelaboradoMaqueta.getValue()
                        + '&observaciones=' + vista.ObservacionMaqueta.getValue() + '&idetapa=' + vista.cmbCompRepMaqueta.getValue())

                vista.winReporteMaqueta.hide();

            } else {
                mostrarMensaje(1, "Existe(n) alg�n(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");
            }

        }

        vista.cmbFormaPropRepMaqueta.on({
            select: function() {

                vista.cmbFormaPropRepMaqueta.enable();
                modelo.stComponentes.reload({
                    params: {
                        idorganismo: Ext.encode(vista.CmbOrganismoMaqueta.getCheckedValue()),
                        idejercicio: vista.cmbEjercicio.getValue(),
                        idforma: Ext.encode(vista.cmbFormaPropRepMaqueta.getCheckedValue())
                    }
                });

            }
        });

        vista.CmbOrganismoMaqueta.on({
            select: function() {
                vista.cmbCompRepMaqueta.reset();
                modelo.stComponentes.reload({
                    params: {
                        idorganismo: Ext.encode(vista.CmbOrganismoMaqueta.getCheckedValue()),
                        idejercicio: vista.cmbEjercicio.getValue(),
                        idforma: Ext.encode(vista.cmbFormaPropRepMaqueta.getCheckedValue())
                    }
                });

            }
        });

        vista.btnCancelarCMExcel.on({
            click: function() {
                vista.cbReporte.clearValue();
                vista.winReporteCMExcel.hide();
                vista.CmbOrganismoCMExcel.reset();
                vista.CmbEntidadCMExcel.reset();
                vista.CmbEntidadCMExcel.disable();
                vista.CmbformaPropiedadExcel.reset();
            }
        });

        vista.CmbOrganismoCMExcel.on('select', function(combo, record) {
            vista.CmbEntidadCMExcel.enable();
            comboorganismo = vista.CmbOrganismoCMExcel.getCheckedValue();
            var organismos = Ext.encode(comboorganismo);
            _this.mymask.show();
            modelo.stEntidad.reload({
                params: {
                    idorganismo: organismos
                },
                callback: function(options, success, response) {
                    _this.mymask.hide();
                }
            });
        });

        vista.btnAceptarCMExcel.on({
            click: function() {
                vista.cbReporte.clearValue();
                exportarConstrMontajeExcel();
                vista.winReporteCMExcel.hide();
                vista.CmbOrganismoCMExcel.reset();
                vista.CmbEntidadCMExcel.reset();
                vista.CmbEntidadCMExcel.disable();
                vista.CmbformaPropiedadExcel.reset();

            }
        });
        vista.winReporteCMExcel.on({
            'hide': function() {
                vista.fmreporteCMExcel.getForm().reset();
                vista.cbReporte.clearValue();
            }
        });

        function exportarConstrMontajeExcel() {
            Ext.Ajax.timeout = 600000000;
            var idorganismo = vista.CmbOrganismoCMExcel.getValue();
            var identidad = vista.CmbEntidadCMExcel.getValue();
            var formaE = vista.CmbformaPropiedadExcel.getValue();
            var win = window.open('exportarConstMontajeExcel?idorganismo=' + idorganismo + '&identidad=' + identidad + '&forma=' + formaE);
//            mascaraExportar(perfil.etiquetas.lbExportandoInversiones, perfil.etiquetas.lbEsperePorFavor, win);
//            vista.winReporteCMExcel.hide();
        }

        vista.btnCancelaComponente.on({
            'click': function() {
                vista.winRptComponente.hide();
            }
        });

        vista.btnAceptarComponente.on({
            'click': function() {
                generalPdfComponentes();
            }
        });

        vista.winRptComponente.on({
            'hide': function() {
                vista.fmRptComponente.getForm().reset();
                vista.cbReporte.clearValue();
            }
        });
        function generalPdfComponentes() {
            var mostrarInv = (vista.ChekComponente.getValue()) ? 1 : 0;
            /*  if (vista.fmreporteDemandaE.getForm().isValid() == true || vista.CmbOrganismoRD.getValue() != ""
             && vista.CmbMonedaRD.getValue() != ""
             && vista.CmbNivelesRD.getValue() != "" && vista.tfelaborado.getValue() != ""
             && vista.tfaprobado.getValue() != "") {*/
            var organismoden = vista.CmbOrganismoRD.getRawValue();
            var win = window.open('rptComponentes?mostrarinv=' + mostrarInv + '&idejercicio=' + vista.cmbEjercicio.getValue()
                    + '&idorganismo=' + vista.cbOrganismoComponente.getValue() + '&identidad=' + vista.cbEntComponente.getValue()
                    + '&organismo=' + vista.cbOrganismoComponente.getRawValue() + '&reporte=' + vista.cbReporte.getValue()+
                    '&ejercicioden=' + vista.cmbEjercicio.getRawValue()+ '&entidad=' + vista.cbEntComponente.getRawValue());

//                vista.fmreporteDemandaE.getForm().reset();
//                vista.winReporteDemandaEquipos.hide();
//                vista.cbReporte.clearValue();
            /*  } else {
             mostrarMensaje(1, "Existe(n) alg&uacute;n(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");
             }*/
        }
        ;
    }
};
