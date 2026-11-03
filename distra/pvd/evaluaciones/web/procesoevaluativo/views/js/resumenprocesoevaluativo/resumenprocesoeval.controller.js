Ext.ns('Pvd.Evaluaciones.Resumenprocesoevaluativo');

//Controlador de la vista del Resumen del proceso evaluativo.
Pvd.Evaluaciones.Resumenprocesoevaluativo.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     *
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del modulo Resumen del proceso evaluativo (Tipo: Pvd.Evaluaciones.Resumenprocesoevaluativo.Vista)
     * @param modelo Modelo de la vista del modulo Resumen del proceso evaluativo (Tipo: Pvd.Evaluaciones.Resumenprocesoevaluativo.Modelo)
     */
    init: function (idioma, vista, modelo) {
        /**
         *Variables generales.
         */
        var variables = {};
        var idestructura;
        var idestructuranodo;
        var nombrenodo;
        var nombrenodoevaluativo;
        var bool;
        var boole;
        var arrFilaCol;
        var msgWait;
        var est = new Array();
        /**
         *Mostrando la ventana de listado de procesos evaluativos una ves que se ha iniciado la funcionalidad.
         */
        vista.gpListProces.getStore().load({
            params: {
                idpreprocesoevaluativo: vista.idpreprocesoevaluativo,
                idestructura: vista.idestructura,
                limit: 8,
                start: 0
            }
        });
        vista.pEstructEval.getSelectionModel().on('selectionchange', function (sm, nodo) {
            nombrenodoevaluativo = nodo.attributes.text;
            var arrIds = new Array();
            est = new Array();
            if (!Ext.isEmpty(nodo)) {
                if (nodo.isRoot) {
                    nodo.cascade(function (n) {
                        if (!isNaN(n.id)) {
                            arrIds.push(n.id);
                            est.push(n.id);
                        }

                    }, this);
                } else if (nodo.childNodes.length == 0 && nodo.expanded) {

                    arrIds.push(nodo.id);
                    est.push(nodo.id);
                } else {
                    nodo.cascade(function (n) {
                        if (!isNaN(n.id)) {
                            arrIds.push(n.id);
                            est.push(n.id);
                        }

                    }, this);
                    arrIds.shift();
                    est.shift();
                }
            }

            vista.gpResumenProcEval.getStore().load({
                params: {
                    idpreprocesoevaluativo: vista.gpListProces.getSelectionModel().getSelected().get('idpreprocesoevaluativo'),
                    idperiodoproceso: vista.gpListProces.getSelectionModel().getSelected().get('idperiodoproceso'),
                    idestructura: Ext.encode(arrIds),
                    bool: 1,
                    limit: 8,
                    start: 0
                }
            });

        });

        ////////////////////////////////////////////////////////
        vista.pEstructCompcion.on('estructuraselecionada', function (sm, nodo) {
            modelo.stResumenProcEval.on('load', function (st) {

                var dataCantPersonEval = new Array();
                var dataEvalByPerson = new Array();
                var dataEvalByPersonPromedio = new Array();
                var dataPromedioevaluado = new Array();
                var average = st.reader.jsonData.average;
                var promedio = st.reader.jsonData.average.real;

                Ext.each(st.reader.jsonData.graficoDispersion, function (obj) {
                    var aux = new Array();
                    aux[0] = parseInt(obj.valor);
                    aux[1] = parseInt(obj.cantidad);
                    dataCantPersonEval.push(aux);
                });
                var xCategories = new Array();

                Ext.each(st.reader.jsonData.evalByPersonDispersion, function (obj) {
                    var aux = new Array();
                    aux[0] = obj.idpersona;
                    aux[1] = parseInt(obj.valor);
                    aux['sexo'] = parseInt(obj.sexo)

                    if (obj.foto) {
                        aux['extension'] = obj.foto;
                    }

                    dataEvalByPerson.push(aux);
                    xCategories.push(obj.nombre + ' ' + obj.papel + ' ' + obj.sapel);
                });

                Ext.each(st.reader.jsonData.evalByPersonDispersion, function (obj) {
                    var aux = new Array();
                    aux[0] = obj.idpersona;
                    aux[1] = promedio;
                    aux['sexo'] = parseInt(obj.sexo);
                    aux['promedio'] = parseInt(promedio);
                    if (obj.foto) {
                        aux['extension'] = obj.foto;
                    }
                    dataEvalByPersonPromedio.push(aux);
                    xCategories.push(obj.nombre + ' ' + obj.papel + ' ' + obj.sapel);
                });

                var suma =0;
                Ext.each(st.reader.jsonData.evalByPersonDispersion, function (obj) {
                    suma= suma + parseInt(obj.valor);
                });

                var promedioevaluado = 0;

                promedioevaluado = suma/dataEvalByPerson.length;

                Ext.each(st.reader.jsonData.evalByPersonDispersion, function (obj) {
                    var aux = new Array();
                    aux[0] = obj.idpersona;
                    aux[1] = promedioevaluado;
                    aux['sexo'] = parseInt(obj.sexo)
                    aux['promedioevaluado'] = parseInt(promedioevaluado);

                    dataPromedioevaluado.push(aux);
                    xCategories.push(obj.nombre + ' ' + obj.papel + ' ' + obj.sapel);
                });

                vista.dispersionChart.chart.xAxis[0].setCategories(xCategories);
                vista.dispersionChart.chart.series[0].setData(dataEvalByPerson);
                vista.dispersionChart.chart.series[1].setData(dataEvalByPersonPromedio);
                vista.dispersionChart.chart.series[2].setData(dataPromedioevaluado);

            });
          if(nodo.attributes.id!='idraiz'){
              vista.pContenedor.enable();
              vista.pContenedorP.enable();

                  modelo.tlIndicadores.baseParams.idpreprocesoevaluativo =vista.gpListProces.getSelectionModel().getSelected().get('_parent');
                  modelo.tlIndicadores.baseParams.idnodo = -1;
                  modelo.tlIndicadores.baseParams.idestructuranodo = idestructuranodo,
                  modelo.tlIndicadores.load(vista.tpProceso.getRootNode());

                  modelo.tlIndicadores.load(vista.tpProcesoPP.getRootNode());

                  modelo.tlIndicadoresP.baseParams.idnodo = -1;
                  modelo.tlIndicadoresP.baseParams.idperiodoproceso =vista.gpListProces.getSelectionModel().getSelected().get('idperiodoproceso');
                  modelo.tlIndicadoresP.load(vista.tpProcesoP.getRootNode());

          }

            idestructuranodo = nodo.id;
            nombrenodo = nodo.attributes.text;
            vista.gpResumenProcEval.getStore().load({
                params: {
                    idpreprocesoevaluativo: vista.gpListProces.getSelectionModel().getSelected().get('idpreprocesoevaluativo'),
                    idperiodoproceso: vista.gpListProces.getSelectionModel().getSelected().get('idperiodoproceso'),
                    idestructuranodo: nodo.id,
                    bool: 0,
                    limit: 8,
                    start: 0
                }
            });

        });
        /////////////////////////////////////////////////////////
        modelo.loaderEstrucEval.on('beforeload', function (tloader, node, response) {
            tloader.baseParams.idperiodoproceso = vista.gpListProces.getSelectionModel().getSelected().get('idperiodoproceso');
            if (node.attributes.idpersonaevaluado) {
                tloader.baseParams.idpersona = node.attributes.idpersona;
            }
            msgWait = (Ext.isEmpty(msgWait))
                ? new Ext.LoadMask(vista.pEstructEval.el.dom, {msg: "Cargando..."})
                : msgWait;
            msgWait.show();
        }, this);
        modelo.loaderEstrucEval.on('load', function (obj, node, response) {
            msgWait.hide();
            node.expand(true);
        }, this);

        vista.gpListProces.on('rowdblclick', showResumen);

        vista.gpListProces.on('rowclick', function (gp, rowIndex, e) {
            if (gp.getSelectionModel().getSelected().get('_is_leaf')) {
                modelo.tlIndicadoresP.baseParams.idnodo = -1;
                modelo.tlIndicadoresP.baseParams.idperiodoproceso =vista.gpListProces.getSelectionModel().getSelected().get('idperiodoproceso');
                modelo.tlIndicadoresP.load(vista.tpProcesoP.getRootNode());
                vista.btnSelProcEval.enable();
                vista.btnOrganigrama.enable();
            }
            else {
                vista.btnSelProcEval.disable();
                vista.btnOrganigrama.disable();
            }
        }, this);

        vista.gpListProces.store.on('load', function () {
            vista.btnSelProcEval.disable();
            vista.btnOrganigrama.disable();
        }, this);

        vista.btnSelProcEval.setHandler(showResumen);
        vista.btnOrganigrama.setHandler(showOrganigrama);

        function showResumen() {
            if (vista.gpListProces.getSelectionModel().getSelected().get('_is_leaf')) {
                vista.winResumenProcEval.setTitle(idioma.lbWinResumenProcEval + ": " + vista.gpListProces.getSelectionModel().getSelected().get('denominacion'));
                vista.winResumenProcEval.show();
                vista.winResumenProcEval.maximize();
                vista.winResumenProcEval.doLayout();
                modelo.stResumenProcEval.baseParams.idperiodoproceso = vista.gpListProces.getSelectionModel().getSelected().get('idperiodoproceso');
                vista.pEstructEval.getRootNode().attributes.idperiodoproceso = vista.gpListProces.getSelectionModel().getSelected().get('idperiodoproceso');
                modelo.loaderEstrucEval.load({
                    idperiodoproceso: vista.gpListProces.getSelectionModel().getSelected().get('idperiodoproceso')
                });
                //modelo.loaderEstrucEval.load(vista.pEstructEval.getRootNode());
                //modelo.stResumenProcEval.load(); //Solo se debe cargar cuando se seleccione un nodo.
            }
        }

        function showOrganigrama() {
            var win = new Ext.Window({
                title: idioma.lbWinOrganigrama,
                layout: 'fit',
                plain: true,
                items: [
                    new Ext.components.OrgChart({
                        region: 'center',
                        idperiodoproceso: vista.gpListProces.getSelectionModel().getSelected().get('idperiodoproceso')
                    })
                ]
            });
            win.show();
            win.maximize();
        }

        function showHeader() {
            var arrHeader = new Array();
            var cant = vista.gpResumenProcEval.getColumnModel().getColumnCount();
            for (var i = 0; i < cant; i++) {
                arrHeader[i] = vista.gpResumenProcEval.getColumnModel().getColumnHeader(i);
            }
            return arrHeader;
        }

        function showWinListPersona(url, params) {
            var win = new Ext.Window({
                modal: true,
                width: '75%',
                height: 500,
                layout: 'border',
                title: 'Listado de personas evaluadas',
                items: [
                    new Pvd.Evaluaciones.cmpGpListPersona({
                        url: url,
                        region: 'center',
                        margins: '5 5 5 5',
                        params: params
                    })
                ],
                buttons: [
                    {
                        text: 'Cerrar',
                        tooltip: 'Cerrar ventana <b>(Ctrl+Alt+X)</b>',
                        iconCls: 'cancelar',
                        handler: function () {
                            win.close();
                        }
                    }
                ],
                keys: [
                    {
                        ctrl: true,
                        alt: true,
                        key: 'x',
                        fn: function () {
                            win.close();
                        }
                    }
                ]
            });
            win.show();
        }


        function showWinListPersonaGestor(url, params) {
            var win = new Ext.Window({
                modal: true,
                width: '75%',
                height: 500,
                layout: 'border',
                title: 'Listado de personas evaluadas',
                items: [
                    new Pvd.Evaluaciones.cmpGpListPersonaGestor({
                        url: url,
                        region: 'center',
                        margins: '5 5 5 5',
                        params: params
                    })
                ],
                buttons: [
                    {
                        text: 'Cerrar',
                        tooltip: 'Cerrar ventana <b>(Ctrl+Alt+X)</b>',
                        iconCls: 'cancelar',
                        handler: function () {
                            win.close();
                        }
                    }
                ],
                keys: [
                    {
                        ctrl: true,
                        alt: true,
                        key: 'x',
                        fn: function () {
                            win.close();
                        }
                    }
                ]
            });
            win.show();
        }

        vista.gpResumenProcEval.on('celldblclick', function () {
            var arr = vista.gpResumenProcEval.getSelectionModel().getSelectedCell();
            var record = vista.gpResumenProcEval.getStore().getAt(arr[0]);  // Get the Record
            var fieldName = vista.gpResumenProcEval.getColumnModel().getDataIndex(arr[1]); // Get field name
            var data = record.get(fieldName);
            if (vista.winResumenProcEval.items.items[0].getActiveTab().id == 'estructuraeval') {
                if (isNaN(data) == false && data > 0) {
                    showWinListPersona('showListadoPersonas', {
                        idperiodoproceso: vista.gpListProces.getSelectionModel().getSelected().get('idperiodoproceso'),
                        idestadodesarrollo: record.get('idestadodesarrollo'),
                        //idestructura: vista.gpResumenProcEval.getSelectionModel().getSelected().get('idestructura'),//idestructura,
                        idestructura: Ext.encode(est),
                        nocolumna: arr[1],
                        boole: 1,
                        fechafin: vista.gpListProces.getSelectionModel().getSelected().get('fechafin'),
                        fechainicio: vista.gpListProces.getSelectionModel().getSelected().get('fechainicio')
                    });
                }
            }
            else {
                if (isNaN(data) == false && data > 0) {
                    showWinListPersona('showListadoPersonas', {
                        idperiodoproceso: vista.gpListProces.getSelectionModel().getSelected().get('idperiodoproceso'),
                        idestadodesarrollo: record.get('idestadodesarrollo'),
                        idestructuranodo: idestructuranodo,
                        nocolumna: arr[1],
                        boole: 0,
                        fechafin: vista.gpListProces.getSelectionModel().getSelected().get('fechafin'),
                        fechainicio: vista.gpListProces.getSelectionModel().getSelected().get('fechainicio')
                    });
                }
            }

        });



        vista.btnExportProcEval.on('showExportar', function () {
            var idperiodoproceso = vista.gpListProces.getSelectionModel().getSelected().get('idperiodoproceso');
            var estruct = idestructuranodo;

            if (vista.winResumenProcEval.items.items[0].getActiveTab().id == 'estructuraeval') {
                var win = new Ext.components.winReporte({
                    params: {
                        url: 'obtenerReporte',
                        tiporeporte: 'resumen',
                        columns: showHeader(),
                        params: {
                            idperiodoproceso: idperiodoproceso,
                            idestructura: Ext.encode(est),
                            boole: 1,
                            start: 0,
                            limit: 8
                        }
                    }

                });
                win.show();

            }
            else {
                var win = new Ext.components.winReporte({
                    params: {
                        url: 'obtenerReporte',
                        tiporeporte: 'resumen',
                        columns: showHeader(),
                        params: {
                            idperiodoproceso: idperiodoproceso,
                            idestructuranodo: idestructuranodo,
                            boole: 0,
                            start: 0,
                            limit: 8
                        }
                    }

                });
                win.show();

            }


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
                nombrex[0] = nombrenodoevaluativo + '<br></br><b>' +'Estado de desarrollo: Sin estado'+'</b>';//nombrenodo;

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
                            estructura:estruct,
                            idperiodoproceso:idperiodoproceso,
                            bool:bool,
                            nombrenodo:Ext.encode(nombre),
                            idestructura : Ext.encode(est)
                        },
                        callback: function (options, success, response) {

                            var series = Ext.util.JSON.decode(response.responseText);

                            while(vista.chartEvaluaciones.chart.series.length > 0){
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
            else
            {
                var arrNodos = nombrenodo;
                var nombre = new Array();
                var nombrex = new Array();
                var bool = 0
                nombre = nombrenodo;
                nombrex[0] = nombrenodo + '<br></br><b>' +'Estado de desarrollo: Sin estado'+'</b>';//nombrenodo;

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
                            estructura:estruct,
                            idperiodoproceso:idperiodoproceso,
                            bool:bool,
                            nombrenodo:Ext.encode(nombre),
                            idestructura : Ext.encode(est)
                        },
                        callback: function (options, success, response) {

                            var series = Ext.util.JSON.decode(response.responseText);

                            while(vista.chartEvaluaciones.chart.series.length > 0){
                                vista.chartEvaluaciones.chart.series[0].remove(true);
                            }
                            Ext.each(series, function (serie) {
                                console.info(serie);
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

        vista.btnGraficarDispersion.on('graficardispersion',function(){
            var arrNodos = vista.tpProceso.getChecked();
            if (arrNodos.length > 0) {
                var ticks = new Array();
                var arrIds = new Array();
                var xCategories = new Array();
//                //Se prepara la columna y que muestra los nombres de los indicadores
                for (var i = 0; i < arrNodos.length; i++) {
                    var aux = [i + 1, arrNodos[i].text];
                    arrIds[i] = parseInt(arrNodos[i].id);
                    ticks.push(aux)
                    xCategories.push(arrNodos[i].text);
                }

                vista.pChart.chart.xAxis[0].setCategories(xCategories);
                var arrIdpersonaevaluacion = new Array();
                PVD.mostrarMascara('loadresultados', 'Por favor espere...', 'Cargando resultados de los periodos');
                Ext.Ajax.request({
                    url: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/getpersonas',
                    method: 'POST',
                    params: {
                        arrInd: Ext.encode(arrIds),
                        idestructuranodo: idestructuranodo
                    },
                    success: function (response, opt, notification) {
                        persona = Ext.decode(response.responseText);
                        for (var i = 0; i < persona.datos.length; i++) {
                            arrIdpersonaevaluacion.push(persona.datos[i].idpersona);
                        }

                        Ext.Ajax.request({
                            url: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/getserieperiodo',
                            method: 'POST',
                            params: {
                                arrInd: Ext.encode(arrIds),
                                arrIdpersonaevaluacion: Ext.encode(arrIdpersonaevaluacion)

                            },
                            callback: function (options, success, response) {
                                var series = Ext.util.JSON.decode(response.responseText);

                                while(vista.pChart.chart.series.length > 0){
                                    vista.pChart.chart.series[0].remove(true);
                                }

                                Ext.each(series, function (serie) {
                                    vista.pChart.chart.addSeries(serie);

                                });

                                PVD.ocultarMascara('loadresultados');
                            }
                        });
                    }
                });




            }
            else {
                mostrarMensaje(1, 'Debe seleccionar al menos un periodo.');
            }

        });

        vista.btnGraficarDispersionP.on('graficardispersionP',function(){
            var idperiodoproceso = vista.gpListProces.getSelectionModel().getSelected().get('idperiodoproceso');
            var arrNodos = vista.tpProcesoP.getChecked();
            var arrNodosP = vista.tpProcesoPP.getChecked();

            if (arrNodos.length > 0 && arrNodosP.length>0) {
                var ticks = new Array();
                var arrIds = new Array();
                var xCategories = new Array();
//                //Se prepara la columna y que muestra los nombres de los indicadores
               for (var i = 0; i < arrNodos.length; i++) {
                    var aux = [i + 1, arrNodos[i].text];
                    arrIds[i] = parseInt(arrNodos[i].id);
                    ticks.push(aux)
                    xCategories.push(arrNodos[i].text);
                }

                var ticksP = new Array();
                var arrIdsP = new Array();
                var xCategoriesP = new Array();
                for (var i = 0; i < arrNodosP.length; i++) {
                    var aux = [i + 1, arrNodosP[i].text];
                    arrIdsP[i] = parseInt(arrNodosP[i].id);
                    ticksP.push(aux)
                    xCategoriesP.push(arrNodosP[i].text);
                }

                vista.pChartP.chart.xAxis[0].setCategories(xCategoriesP);

                PVD.mostrarMascara('loadresultados', 'Por favor espere...', 'Cargando resultados de las personas');

                        Ext.Ajax.request({
                            url: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/getseriepersonadispersion',
                            method: 'POST',
                            params: {
                                arrInd: Ext.encode(arrIds),
                                idperiodoproceso:  Ext.encode(arrIdsP)

                            },
                            callback: function (options, success, response) {
                                var series = Ext.util.JSON.decode(response.responseText);

                                while(vista.pChartP.chart.series.length > 0){
                                    vista.pChartP.chart.series[0].remove(true);
                                }

                                Ext.each(series, function (serie) {
                                    vista.pChartP.chart.addSeries(serie);

                                });

                                PVD.ocultarMascara('loadresultados');
                            }
                        });

            }
            else {
                mostrarMensaje(1, 'Debe seleccionar al menos una persona.');
            }

        });

        vista.btnVerPersonasEvaluadas.on('ver',function(){
            showWinListPersonaGestor('showListadoPersonasGestor', {
                idperiodoproceso: vista.gpListProces.getSelectionModel().getSelected().get('idperiodoproceso'),
                idestructuranodo: idestructuranodo,
                fechafin: vista.gpListProces.getSelectionModel().getSelected().get('fechafin'),
                fechainicio: vista.gpListProces.getSelectionModel().getSelected().get('fechainicio')
            });

        });




    }
};
