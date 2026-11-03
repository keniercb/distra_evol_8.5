Utilidades.Cmp.Cmpgestionarpert = function (opcionesConfig) {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    //identificador para los elementos de la vista
    this.idcmp = 'cmpPert_' + opcionesConfig.idcmp;

    //objetos de otros componentes
    this.BarraProgreso = new BarraEstado();

    //objeto del componente "relaciones"
    this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();

    //objeto CRUD del componente "actividades"
    _this.objCmpCrudActividad = opcionesConfig.objCmpCrudActividad;

    //objeto del componente "Reporte"
    this.objreporte = new Utilidades.Cmp.Cmpreportes(
        {
            noUsarModificar: false,
            noUsarEliminar: false,
            noUsarActivar: false,
            noUsarDesactivar: false,
            noUsarCerrarWinP: false,
            noUsarSeleccionarWinP: true,
            maxWinPrincipal: false,
            noUsarCbAprob: false,
            noUsarGestObser: false,
            noMostrarColumObser: false,
            singlemodoSeleccionGridPlanes: false,
            noUsarMenuGrid: false,
            closableWinPrincipal: true,
            titleWinPrincipal: 'Reportes',
            excluirPlan: 1
        });

    //variables auxiliares
    this.idTipoElemento = 0;
    this.elemento = [];
    this.opcionesConfig = opcionesConfig;
    this.vistaAmpliada = null;


    /*
     *
     * Funciones
     *
     * */


    this.ConstruirComponentesVisuales = function () {

        if (_this.WinPrincipal) {
            _this.WinPrincipal.destroy();
        }

        //composicion de la vista

        //botones
        _this.btnAyuda = new Ext.Button({
            text: 'Ayuda',
            iconCls: 'ayuda',
            disabled: false,
            key: {
                alt: true,
                key: 'H'
            },
            scope: this
        });
        if (_this.winDatosPlan) {
            _this.winDatosPlan.destroy();
        }
        _this.btnVerInformacion = new Ext.Button({
            iconCls: 'verficha',
            id: this.idcmp + '_btnVerInformacion',
            tooltip: 'Mostrar los datos asociados al diagrama',
            listeners: {
                click: function (btn, event) {
                    _this.posicicionXVentanaDatosPlan = event.getPageX();
                    _this.posicicionYVentanaDatosPlan = event.getPageY();
                }
            },
            handler: function () {
                _this.ConstruirVentanaDatosPlan();
            }
        });
        _this.btnVerReporteObjetivos = new Ext.Button({
            iconCls: 'crearreporte',
            tooltip: 'Crear el reporte con los objetivos estratégicos',
            handler: function () {
                _this.objreporte.GenerarReporte('vp',
                    {
                        planObjetivos: 1,
                        idplan: _this.elemento.idelemento
                    }
                );
            }
        });
        _this.btnVerVistaAmpliada = new Ext.Button({
            iconCls: 'buscar',
            tooltip: 'Habilitar vista ampliada sobre el diagrama',
            handler: function () {
                _this.MostrarVistaAmpliada();
            }
        });

        //combo para seleccionar la unidad de tiempo
        _this.stcbUnidadTiempo = new Ext.data.SimpleStore({
            fields: ['idunidad', 'denominacion'],
            data: [
                ['Y', 'Annos'],
                ['m', 'Meses'],
                ['w', 'Semanas'],
                ['d', 'Dias'],
                ['H', 'Horas'],
                ['i', 'Minutos'],
                ['all', 'Todas las combinaciones']
            ]
        });
        _this.cbUnidadTiempo = new Ext.form.ComboBox({
            store: _this.stcbUnidadTiempo,
            displayField: 'denominacion',
            value: 'i',
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            valueField: 'idunidad',
            width: 150,
            emptyText: '--Seleccione la unida de tiempo--',
            listeners: {
                select: function (combo, record, index) {
                    // _this.CargarConceptoAGraficar(combo.getValue());
                }
            }
        });


        //panel que contiene el diagrama(ubicado al centro)
        _this.PanDiagramaPrincipal = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            width: '100%',
            border: false,
            tbar: [/*'-','Ver duracion en ',' ', _this.cbUnidadTiempo,'-',' ',*/' ', _this.btnVerInformacion, _this.btnVerReporteObjetivos/*,_this.btnVerVistaAmpliada*/, '->', _this.btnAyuda],
            html: '<div id="contenedorDiagramaPert" style=" width:100%; height:100%;position: relative;">' +
            '<div id="diagramaPert" style=" width:100%; height:100%">' +
            '</div>' +
            '<div id="capaVistaAmpliada"></div>' +
            '</div>'
        });

        //panel principal de la vista
        _this.PanPrincipal = new Ext.Panel({
            layout: 'border',
            items: [_this.PanDiagramaPrincipal]

        });

        //ventana principal de la vista
        _this.WinPrincipal = new Ext.Window({
            title: _this.opcionesConfig.titleWinPrincipal,
            layout: 'fit',
            closable: !_this.opcionesConfig.noUsarCerrarWinP,
            closeAction: 'destroy',
            draggable: false,
            maximized: _this.opcionesConfig.maxWinPrincipal,
            noTitle: _this.opcionesConfig.maxWinPrincipal,
            modal: true,
            width: 1000,
            height: 510,
            items: _this.PanPrincipal,
            listeners: {
                destroy: function (win) {
                    if (_this.winDatosPlan) {
                        _this.winDatosPlan.destroy();
                    }
                }
            },
            buttons: [
                {
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana',
                    hidden: opcionesConfig.noUsarCerrarWinP,
                    iconCls: 'cerrar',
                    handler: function () {
                        _this.WinPrincipal.destroy();

                    }
                }
            ]
        });


    }


    this.ConstruirVentanaDatosPlan = function () {

        if (_this.winDatosPlan) {
            _this.winDatosPlan.destroy();
        }
        var duracionPlanMinutos = 0;
        //html donde se muestran los datos del camino critico
        var html = '<div style="font-size:16px;padding:20px 0px;float:left;text-align:center;margin-top:20px;border-top:1px solid #DEDEDE;width:98%;">';
        for (var i = 0; i < _this.elemento.caminoCritico.length; i++) {
            //console.log(_this.elemento.caminoCritico);
            html += '<label style="font-weight: bold;color: red">RC</label> = ';
            var camino = _this.elemento.caminoCritico[i].camino;
            var duracion = parseFloat(camino[0].tiempoestimado) * 60;  //
            for (var j = 0; j < camino.length; j++) {
                if (j > 0) {
                    duracion = duracion + (parseFloat(camino[j].tiempoestimado) * 60);
                }
                var signo = ' + ';
                if (j == (camino.length - 1)) {
                    signo = '';
                }
                html += '<label>' + camino[j].numero + '</label>';

                html += '<label>(' + parseInt(duracion) /*camino[j].duracion*/ + ' minutos)</label>';
                html += signo;
            }

            html += '<label style="font-weight: bold;color: red"> = </label>';

            var duracionMinutos = _this.elemento.caminoCritico[i].duracion;
            html += '<label>' + parseInt(duracion)/*duracionMinutos*/ + ' minutos</label>';

            var equivalenciaHoras = duracion /*duracionMinutos*/ / (60);
            html += '<label style="font-weight: bold;color: red"> &tilde;</label>';
            html += '<label>' + equivalenciaHoras + ' horas</label>';
            duracionPlanMinutos = duracion;
            var duracionPlanTotal = _this.MostrarDuracionPlan(duracionPlanMinutos);

        }

        html += '</div>';
        //panel para mostrar los datos del plan
        _this.pDatosPlan = new Ext.Panel({
            layout: 'fit',
            html: "<div style='width: 100%;float:left;height: 100%;font: Arial;padding:10px;'>" +
            "<div style='width:100%;height:30px ;float:left;text-align: center;font-size:13px; text-decoration: underline;color: black;'>" +
            _this.elemento.denominacion +
            "</div>" +
            "<div style='width:33%;height:30px ;float:left;text-align: right;font-size:13px; '>" +
            "<label style='text-decoration: underline;color: black;font-weight: bold;'>Inicia </label> : " +
            "<label style='color: black;'>" + _this.elemento.fechainicio + "</label>" +
            "</div>" +
            "<div style='width:33%;height:30px ;float:left;text-align: center;font-size:13px; '>" +
            "<label style='text-decoration: underline;color: black;font-weight: bold;'>Termina </label> : " +
            "<label style='color: black;'>" + _this.elemento.fechafin + "</label>" +
            "</div>" +
            "<div style='width:33%;height:30px ;float:left;text-align: left;font-size:13px; '>" +
            "<label style='text-decoration: underline;color: black;font-weight: bold;'>Duracion </label> : " +
            "<label style='color: black;'>" + parseInt(duracionPlanMinutos)/*_this.elemento.duracionPlan*/ + " minutos</label> " +
            "<label style='color: black;'>( " + duracionPlanTotal /*_this.elemento.duracionPlanTotal*/ + " )</label> " +
            "</div>" +
            html +
            "</div> "
        });
        //ventana para mostrar los datos del plan
        _this.winDatosPlan = new Ext.Window({
            layout: 'fit',
            title: 'Datos del Plan',
            closable: true,
            closeAction: 'destroy',
            draggable: true,
            resizable: true,
            width: '75%',
            height: 400,
            modal: false,
            border: false,
            animateTarget: this.idcmp + '_btnVerInformacion',
            x: _this.posicicionXVentanaDatosPlan,
            y: (_this.posicicionYVentanaDatosPlan + 15),
            collapsible: true,
            items: [_this.pDatosPlan],
            listeners: {}
        });
        _this.winDatosPlan.show();
    }


    this.CargarCmpPert = function (idTipoElemento, elemento) {

        _this.idTtipoElemento = idTipoElemento;
        _this.elemento = elemento;

        _this.ConstruirComponentesVisuales();
        _this.ObtenerDatosDiagrama('Generando diagrama...');

        if (_this.opcionesConfig.tipoComponente == 'panel') {
            return _this.PanPrincipal;
        } else {
            _this.WinPrincipal.show();
        }

    }


    this.ObtenerDatosDiagrama = function (mensajeEspera) {
        _this.BarraProgreso.show(mensajeEspera);
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpdiagramapert/obtenerActividadesPert',
            params: {
                idTipoElemento: _this.idTtipoElemento,
                elemento: Ext.encode(_this.elemento)
            },
            callback: function (options, success, response) {
                //_this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                var actividadesPert = responseData.actividadesPert;
                var relacionesPert = responseData.relacionesPert;
                var duracionPlan = responseData.duracionPlan;
                var duracionPlanTotal = responseData.duracionPlanTotal;
                var caminoCritico = responseData.caminoCritico;
                _this.elemento.duracionPlan = duracionPlan;
                _this.elemento.duracionPlanTotal = duracionPlanTotal;
                _this.elemento.caminoCritico = caminoCritico;
                _this.ConstruirDiagrama(actividadesPert, relacionesPert);
                if (actividadesPert.length == 0) _this.btnVerInformacion.disable();
                else _this.btnVerInformacion.enable();
                _this.BarraProgreso.hide();
            }
        });
    }


    this.ConstruirDiagrama = function (actividadesPert, relacionesPert) {

        /*
         *  primero se genera el diagrama principal
         * */
        var $ = go.GraphObject.make;
        _this.diagramaPert =
            $(go.Diagram, "diagramaPert",
                {
                    initialAutoScale: go.Diagram.Uniform,
                    initialContentAlignment: go.Spot.Center,
                    layout: $(go.LayeredDigraphLayout)
                }
            );


        function nodeInfo(d) {  // Tooltip info for a node data object
            var str = d.text + "\n" + "" + d.fechainicio + "\n" + "" + d.fechafin + "\n" + "Duracion : " + d.tiempoestimado + " minutos"; //
            return str;
        }

        _this.diagramaPert.nodeTemplate =
            $(go.Node, "Auto",
                $(go.Shape, "Rectangle", // the border
                    {fill: "white"},
                    new go.Binding("stroke", "critical",
                        function (b) {
                            return (b ? "red" : "blue");
                        }), new go.Binding("stroke", "es",
                        function (b) {
                            return (b ? "#55d822" : "");
                        })
                ),
                $(go.Panel, "Table",
                    {padding: 0.5},
                    $(go.RowColumnDefinition, {
                        column: 0,
                        separatorStroke: "black",
                        background: "lightblue",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {column: 1, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {column: 2, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {column: 3, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {
                        row: 0,
                        separatorStroke: "black",
                        background: "white",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {row: 1, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {
                        row: 2,
                        separatorStroke: "black",
                        background: "white",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {row: 3, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {
                        row: 4,
                        separatorStroke: "black",
                        background: "white",
                        coversSeparators: true
                    }),
                    $(go.TextBlock,
                        new go.Binding("text", "numero"),
                        {row: 2, column: 0, margin: 5, textAlign: "center", font: " bold 20px arial"}),
                    $(go.TextBlock,
                        new go.Binding("text", "earlyStart"),
                        {row: 1, column: 1, margin: 5, textAlign: "center"}),
                    $(go.TextBlock,
                        new go.Binding("text", "length"),
                        {row: 1, column: 2, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, // earlyFinish
                        new go.Binding("text", "tiempoestimado"  //,
                            /*function(d) {
                             return (d.earlyStart + d.length).toFixed(2);
                             }*/),
                        {row: 1, column: 3, margin: 5, textAlign: "center"}),
                    $(go.TextBlock,
                        new go.Binding("text", "text"),
                        {
                            row: 2, column: 1, columnSpan: 3, margin: 5,
                            textAlign: "center", font: "bold 14px sans-serif"
                        }),
                    $(go.TextBlock, // lateStart
                        new go.Binding("text", "",
                            function (d) {
                                return (d.lateFinish - d.length).toFixed(2);
                            }),
                        {row: 3, column: 1, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, // slack
                        new go.Binding("text", "",
                            function (d) {
                                return (d.lateFinish - (d.earlyStart + d.length)).toFixed(2);
                            }),
                        {row: 3, column: 2, margin: 5, textAlign: "center"}),
                    $(go.TextBlock,
                        new go.Binding("text", "lateFinish"),
                        {row: 3, column: 3, margin: 5, textAlign: "center"}),
                    $(go.TextBlock,
                        new go.Binding("text", "fechainicio"),
                        {
                            row: 0, column: 0, columnSpan: 4, margin: 5,
                            textAlign: "center"
                        }),
                    $(go.TextBlock,
                        new go.Binding("text", "fechafin"),
                        {
                            row: 4, column: 0, columnSpan: 4, margin: 5,
                            textAlign: "center"
                        })
                ),
                {// this tooltip Adornment is shared by all nodes
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, {fill: "#FFFFCC"}),
                        $(go.TextBlock, {margin: 4}, // the tooltip shows the result of calling nodeInfo(data)
                            new go.Binding("text", "", nodeInfo))
                    )
                },
                {
                    doubleClick: function (e, node) {

                        var arrayIdElementos = [];
                        arrayIdElementos[0] = node.data.key;


                        _this.objCmpCrudActividad.CrearWinCrudActividades(
                            new Date().format('d/m/Y'),
                            new Date().format('d/m/Y'),
                            _this.horainicio,
                            _this.horafin,
                            'Modificar',
                            _this.ActualizarDiagrama,
                            arrayIdElementos,
                            node.data.idautor,
                            eshija = 0, permisomodificar = 1,
                            permisoeliminar = 1,
                            [],
                            null,
                            null, null,
                            node.data.porcientocumpl,
                            null,
                            null);
                    }
                }
            );  // end Node

        function linkColorConverter(linkdata, elt) {
            var link = elt.part;
            if (!link)
                return "blue";
            var f = link.fromNode;
            if (!f || !f.data || !f.data.critical)
                return "blue";
            var t = link.toNode;
            if (!t || !t.data || !t.data.critical)
                return "blue";
            return "red";  // when both Link.fromNode.data.critical and Link.toNode.data.critical
        }


        _this.diagramaPert.linkTemplate =
            $(go.Link,
                $(go.Shape,
                    new go.Binding("stroke", "", linkColorConverter)),
                $(go.Shape, // arrowhead
                    {toArrow: "Standard", stroke: null},
                    new go.Binding("fill", "", linkColorConverter))
            );

        _this.diagramaPert.model = new go.GraphLinksModel(actividadesPert, relacionesPert);

    }


    this.ActualizarDiagrama = function () {

        document.getElementById("contenedorDiagramaPert").removeChild(document.getElementById("diagramaPert"));
        document.getElementById("contenedorDiagramaPert").innerHTML = '<div id="diagramaPert" style=" width:100%; height:100%"></div><div id="capaVistaAmpliada"></div>';
        _this.ObtenerDatosDiagrama('Actualizando diagrama...');

    }


    this.MostrarVistaAmpliada = function () {

        var capaVistaAmpliada = document.getElementById("capaVistaAmpliada");
        if (_this.vistaAmpliada === null || capaVistaAmpliada.style.display === "none") {
            alert(1);
            // show DIV
            capaVistaAmpliada.style.display = "inline";
            capaVistaAmpliada.style.height = "200";
            capaVistaAmpliada.style.width = "200";


            // create Overview
            _this.vistaAmpliada =
                go.GraphObject.make(go.Overview, capaVistaAmpliada, // the HTML DIV element for the Overview
                    {
                        observed: _this.diagramaPert, // tell it which Diagram to show
                        // disable normal Overview functionality to make it act as a magnifying glass:
                        initialScale: 1, // zoom in even more than normal
                        autoScale: go.Diagram.None, // don't show whole observed Diagram
                        hasHorizontalScrollbar: false, // don't show any scrollbars
                        hasVerticalScrollbar: false
                    });

            // disable all mouse-down tools
            _this.vistaAmpliada.toolManager.mouseDownTools.each(function (t) {
                t.isEnabled = false;
            });

            // handle mouse moves within the Overview by redirecting the events to the _this.diagramaPert
            _this.vistaAmpliada.doMouseMove = function () {
                var pt = _this.vistaAmpliada.lastInput.documentPoint.copy();
                var e = _this.diagramaPert.lastInput;
                e.documentPoint = pt;
                e.viewPoint = _this.diagramaPert.transformDocToView(e.documentPoint);
                _this.diagramaPert.toolManager.doMouseMove();
            };

            // implement the magnifying glass functionality, to have the Overview show part of the Diagram where the mouse is
            _this.diagramaPert.toolManager.doMouseMove = function () {
                go.ToolManager.prototype.doMouseMove.call(_this.diagramaPert.toolManager);
                var capaVistaAmpliada = document.getElementById("capaVistaAmpliada");
                if (capaVistaAmpliada.style.display !== "none") {
                    var e = _this.diagramaPert.lastInput;
                    var osize = _this.vistaAmpliada.viewportBounds.size;
                    _this.vistaAmpliada.position = new go.Point(e.documentPoint.x - osize.width / 2, e.documentPoint.y - osize.height / 2);
                    capaVistaAmpliada.style.left = (e.viewPoint.x - capaVistaAmpliada.scrollWidth / 2) + "px";
                    capaVistaAmpliada.style.top = (e.viewPoint.y - capaVistaAmpliada.scrollHeight / 2) + "px";
                }
            };
        } else {
            // hide DIV
            capaVistaAmpliada.style.display = "none";
        }
    }

    this.MostrarDuracionPlan = function (equivalenciaMinutos) {

        var restoAnos = equivalenciaMinutos % (525600);
        var equivalenciaAnos = equivalenciaMinutos / (525600);
        var restoMeses = restoAnos % (44640);
        var equivalenciaMeses = restoAnos / (44640);
        var restoDias = restoMeses % (1440);
        var equivalenciaDias = restoMeses / (1440);
        var restoHoras = restoDias % (60);
        var equivalenciaHoras = restoDias / (60);
        var restoMinutos = restoDias % (60);
        var duracionPlanTotal = parseInt(equivalenciaAnos) + ' años - ' + parseInt(equivalenciaMeses) + ' meses - ' + parseInt(equivalenciaDias) + ' dias - ' + parseInt(equivalenciaHoras) + ' horas - ' + parseInt(restoMinutos) + ' minutos';
        return duracionPlanTotal;
    }


};
