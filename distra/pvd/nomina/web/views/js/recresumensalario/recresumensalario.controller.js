Ext.ns('Pvd.Nomina.Recuperacion.Resumensalario');

Pvd.Nomina.Recuperacion.Resumensalario.Controlador = {
    init: function (idioma, vista, modelo) {
        cargarTipoPagos();
        this.record = null;
        var self = this;
        vista.winExportarBanco.show();

        vista.winExportarBanco.maximize();

        vista.smTipoPagos.on('rowselect', function (sm, index, record) {
            var TiposPagos = dameTipoPagosSeleccionados();
            var seleccionIdTiposPagos = TiposPagos[0];
            buscarPeriodosDePago(seleccionIdTiposPagos);
        });

        vista.smTipoPagos.on('rowdeselect', function (sm, index, record) {
            var TiposPagos = dameTipoPagosSeleccionados();
            var seleccionIdTiposPagos = TiposPagos[0];
            if (seleccionIdTiposPagos.length > 0) {
                buscarPeriodosDePago(seleccionIdTiposPagos);
            } else {
                modelo.stPeriodosPago.removeAll();
            }

        });

        vista.smPeriodoPago.on('rowselect', function (sm, index, record) {
            var TiposPagos = dameTipoPagosSeleccionados();
            var seleccionIdTiposPagos = TiposPagos[0];
            var seleccionDenominacionesTiposPagos = TiposPagos[1];

            resumenSalarios(seleccionIdTiposPagos, seleccionDenominacionesTiposPagos);
        });

        vista.btnExportar.setHandler(function () {

            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });
            winload.showMask();
            //?identidad=' + self.idestructura + '&idpersona=' + self.idpersona
            var filas = arregloFilasExportar(vista.gpResumen);
            var encabezados = arregloEncabezadosGrid(vista.gpResumen);
            var fechainicioperiodo = vista.smPeriodoPago.getSelected().data.fechainicioperiodo;
            var fechafinperiodo = vista.smPeriodoPago.getSelected().data.fechafinperiodo;

            window.open(document.location.protocol + '//' + window.location.host
                + '/pvd/nomina/index.php/recresumensalario/exportarresumensalarial?filas=' + filas
                + '&encabezados=' + encabezados
                + '&fechainicioperiodo=' + fechainicioperiodo
                + '&fechafinperiodo=' + fechafinperiodo);
            winload.close();
        });

        vista.btnGraficar.on('graficar', function () {
            var idperiodoproceso = vista.gpListProces.getSelectionModel().getSelected().get('idperiodoproceso');
            var estruct = idestructuranodo;
            if (vista.winResumenProcEval.items.items[0].getActiveTab().id == 'estructuraeval') {
                var arrNodos = nombrenodoevaluativo;
                var nombre = new Array();
                var nombrex = new Array();
                var bool = 1
                nombre = nombrenodoevaluativo;
                nombrex[0] = nombrenodoevaluativo + '<br></br><b>' + 'Estado de desarrollo: Sin estado' + '</b>';//nombrenodo;

                if (arrNodos.length > 0) {
                    var ticks = new Array();
                    var arrIds = new Array();
                    var xCategories = new Array();

                    vista.chartEvaluaciones.chart.xAxis[0].setCategories(nombrex);

                    PVD.mostrarMascara('loadresultados', 'Por favor espere...', 'Cargando resultados de los periodos');
                    Ext.Ajax.request({
                        url: 'getserie',
                        method: 'POST',
                        params: {
                            estructura: estruct,
                            idperiodoproceso: idperiodoproceso,
                            bool: bool,
                            nombrenodo: Ext.encode(nombre),
                            idestructura: Ext.encode(est)
                        },
                        callback: function (options, success, response) {

                            var series = Ext.util.JSON.decode(response.responseText);

                            while (vista.chartEvaluaciones.chart.series.length > 0) {
                                vista.chartEvaluaciones.chart.series[0].remove(true);
                            }
                            Ext.each(series, function (serie) {
                                vista.chartEvaluaciones.chart.addSeries(serie);

                            });

                            PVD.ocultarMascara('loadresultados');
                        }
                    });
                }
                else {
                    mostrarMensaje(1, 'Debe seleccionar al menos una estructura.');
                }
            }
            else {
                var arrNodos = nombrenodo;
                var nombre = new Array();
                var nombrex = new Array();
                var bool = 0
                nombre = nombrenodo;
                nombrex[0] = nombrenodo + '<br></br><b>' + 'Estado de desarrollo: Sin estado' + '</b>';//nombrenodo;

                if (arrNodos.length > 0) {
                    var ticks = new Array();
                    var arrIds = new Array();
                    var xCategories = new Array();

                    vista.chartEvaluaciones.chart.xAxis[0].setCategories(nombrex);

                    PVD.mostrarMascara('loadresultados', 'Por favor espere...', 'Cargando resultados de los periodos');
                    Ext.Ajax.request({
                        url: 'getserie',
                        method: 'POST',
                        params: {
                            estructura: estruct,
                            idperiodoproceso: idperiodoproceso,
                            bool: bool,
                            nombrenodo: Ext.encode(nombre),
                            idestructura: Ext.encode(est)
                        },
                        callback: function (options, success, response) {

                            var series = Ext.util.JSON.decode(response.responseText);

                            while (vista.chartEvaluaciones.chart.series.length > 0) {
                                vista.chartEvaluaciones.chart.series[0].remove(true);
                            }
                            Ext.each(series, function (serie) {
                                vista.chartEvaluaciones.chart.addSeries(serie);

                            });

                            PVD.ocultarMascara('loadresultados');
                        }
                    });
                }
                else {
                    mostrarMensaje(1, 'Debe seleccionar al menos una estructura.');
                }
            }
        });

        vista.gpResumen.on('activate', function (p) {
            console.info(self.record);
            fnGrid(self.record.datos.st, vista.gpResumen);
        });
        vista.gpResumenMujeres.on('activate', function (p) {
            console.info(self.record);
            fnGrid(self.record.datos.stmujeres, vista.gpResumenMujeres);
        });
        vista.gpResumenHombres.on('activate', function (p) {
            fnGrid(self.record.datos.sthombres, vista.gpResumenHombres);
        });
         vista.tabPanelResumen.on('tabchange', function(tabPanel, newTab) {
       
            if (newTab.id === 'contenedorChart') {
                
                if (Highcharts.charts) {
                    for (var i = 0; i < Highcharts.charts.length; i++) {
                        var chart = Highcharts.charts[i];
                       
                        if (chart && chart.renderTo && chart.renderTo.id === 'chartpanel_0') {
                            chart.destroy(); 
                            break;
                        }
                    }
                }
                vista.chartResumen.doLayout();
            }
        });

        function fnGrid(respuesta, grid) {
            var camposStore = new Array();
            var camposGrid = new Array();
            camposGrid.push(new Ext.grid.RowNumberer());
            camposGrid.push({
                id: 'id',
                header: "ID",
                dataIndex: 'id',
                summaryType: 'count',
                sortable: true,
                hidden: true,
                hideable: false
            });
            camposGrid.push({
                header: 'Entidad',
                dataIndex: 'entidad',
                id: 'entidad',
                hidden: false,
                hideable: true,
                sortable: true,
                width: 500
            });

            camposStore.push({name: 'id'});
            camposStore.push({name: 'entidad'});
            for (var i = 0; i < respuesta.campos.length; i++) {
                camposStore.push({name: respuesta.campos[i]});
                camposGrid.push({
                    header: respuesta.campos[i],
                    dataIndex: respuesta.campos[i],
                    hidden: false,
                    hideable: true,
                    sortable: true,
                    width: 200
                });
            }

            var st = new Ext.data.Store({
                reader: new Ext.data.JsonReader({
                    fields: camposStore
                })
            });

            st.loadData(respuesta.valores);
            var cm = null;
            cm = new Ext.grid.ColumnModel(camposGrid);

            grid.reconfigure(st, cm);
            grid.doLayout();
        }

                 
        function resumenSalarios(seleccionIdTiposPagos, seleccionDenominacionesTiposPagos) {
            //Estructuras
            var Estructuras = dameEstructurasSeleccionadas();
            var seleccionIdEstructura = Estructuras[0];
            var seleccionDenominacionesEstructura = Estructuras[1];
            var seleccionIdConceptoEstructura = Estructuras[2];
            var fechainicioperiodo = vista.smPeriodoPago.getSelected().data.fechainicioperiodo;
            var fechafinperiodo = vista.smPeriodoPago.getSelected().data.fechafinperiodo;

            if ((seleccionIdEstructura.length > 0)) {
                if ((seleccionIdTiposPagos.length > 0)) {
                    PVD.mostrarMascara('idmaskresumen22', 'Por favor espere...', 'Cargando datos');
                    Ext.Ajax.request({
                        timeout: 500000,
                        url: '/pvd/nomina/index.php/recresumensalario/resumensalarios',
                        method: 'POST',
                        params: {
                            identidades: Ext.encode(seleccionIdEstructura),
                            denominacionesentidades: Ext.encode(seleccionDenominacionesEstructura),
                            idconceptosentidades: Ext.encode(seleccionIdConceptoEstructura),
                            idtipopagos: Ext.encode(seleccionIdTiposPagos),
                            denominacionestipopagos: Ext.encode(seleccionDenominacionesTiposPagos),
                            fechainicioperiodo: fechainicioperiodo,
                            fechafinperiodo: fechafinperiodo
                        },
                        callback: function (options, success, response) {
                            var respuesta = Ext.decode(response.responseText);
                            self.record = respuesta;
                            var tabActivo = vista.tabPanelResumen.getActiveTab().id;
                            switch (tabActivo) {
                                case 'idGpResumen'://Salario total
                                    fnGrid(respuesta.datos.st, vista.gpResumen);
                                    break;
                                case 'idGpResumenMujeres'://Salario total mujeres
                                    fnGrid(respuesta.datos.stmujeres, vista.gpResumenMujeres);
                                    break;
                                case 'idGpResumenHombres'://Salario total hombres
                                    fnGrid(respuesta.datos.sthombres, vista.gpResumenHombres);
                                    break;
                                case 'contenedorChart': // Gráfica
    
   
                                      var nuevosDatos = respuesta.datos.grafica ;
                                      var serie = vista.configChartResumen[0].series[0].datos;
                                      serie.length = 0;
                                      for (var i = 0; i < datos.length; i++) {
                                        serie.push({
                                                    y: nuevosDatos[i].y,
                                                    name: nuevosDatos[i].nombre,
                                                    color: nuevosDatos[i].color
                                                  });
                                              }
                                           if (vista.chartResumen && vista.chartResumen.chart) {
                                               vista.chartResumen.chart.series[0].setData(serie, true);
                                               }
                                       break;
                                            }

            

                            //Mask
                            PVD.ocultarMascara('idmaskresumen22');
                        }.createDelegate(this)
                    });
                } else {
                    mostrarMensaje(2, 'Debe elegir al menos una tipo de pago.');
                }
            } else {
                mostrarMensaje(2, 'Debe elegir al menos una entidad.');
            }
        }

        function dameEstructurasSeleccionadas() {
            var seleccionEstructura = vista.pEstEntidades.dameSeleccion();


            var seleccionIdEstructura = new Array();
            var seleccionIdConceptoEstructura = new Array();
            var seleccionDenominacionesEstructura = new Array();
            var estructurasFinal = new Array();

            for (var i = 0; i < seleccionEstructura.length; i++) {
                seleccionIdEstructura.push(seleccionEstructura[i].id);
                seleccionDenominacionesEstructura.push(seleccionEstructura[i].attributes.text);
                seleccionIdConceptoEstructura.push(seleccionEstructura[i].attributes.idconcepto);
            }

            estructurasFinal.push(seleccionIdEstructura);
            estructurasFinal.push(seleccionDenominacionesEstructura);
            estructurasFinal.push(seleccionIdConceptoEstructura);
            //.log(estructurasFinal);return;
            return estructurasFinal;
        }

        function dameTipoPagosSeleccionados() {
            var seleccionTipoPagos = vista.smTipoPagos.getSelections();


            var seleccionIdTipoPagos = new Array();
            var seleccionDenominacionesTipoPagos = new Array();
            var tipoPagosFinal = new Array();

            for (var i = 0; i < seleccionTipoPagos.length; i++) {
                seleccionIdTipoPagos.push(seleccionTipoPagos[i].id);
                seleccionDenominacionesTipoPagos.push(seleccionTipoPagos[i].data.denominacion);
            }

            tipoPagosFinal.push(seleccionIdTipoPagos);
            tipoPagosFinal.push(seleccionDenominacionesTipoPagos);
            // console.log(tipoPagosFinal);return;
            return tipoPagosFinal;
        }

        function buscarPeriodosDePago(seleccionIdTiposPagos) {
            //Estructuras
            var Estructuras = dameEstructurasSeleccionadas();
            var seleccionIdEstructura = Estructuras[0];

            modelo.CargarPeriodosPago(seleccionIdEstructura, seleccionIdTiposPagos, 1);
        }

        function cargarTipoPagos() {
            modelo.stTipoPago.load();
        }

        function arregloFilasExportar(gridPanel) {
            var i;
            var filas = new Array();
            for (i = 0; i < gridPanel.getStore().getCount(); i++) {
                var valor = gridPanel.getStore().getAt(i);
                filas.push(valor.data);
            }
            return Ext.encode(filas);
        }

        function arregloEncabezadosGrid(gridPanel) {
            var i;
            var encabezados = new Array();
            for (i = 0; i < gridPanel.getColumnModel().getColumnCount(); i++) {
                var valor = gridPanel.getColumnModel().getColumnHeader(i);
                encabezados.push(valor);
            }
            return Ext.encode(encabezados);
        }
    }
};
