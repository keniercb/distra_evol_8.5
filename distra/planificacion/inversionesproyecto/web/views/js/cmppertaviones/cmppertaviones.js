/**
 * Created by Ariel on 28/09/2016.
 */

Utilidades.Cmp.PertAviones = function(){
var _this = this;

    this.BarraProgreso = new BarraEstado();
    this.objNodeJS = new Utilidades.Cmp.ServerPortNodeJS();
    this.socketEvents = new io.connect(_this.objNodeJS.ip_servidor, {port: _this.objNodeJS.port_servidor});
    _this.socketEvents.on('connect', function () {});
    _this.socketEvents.on('actualizarPorcientoCumplimiento', function (data) {
        _this.paintPlane(data);
        _this.objCmpPert.actualizarDiagramaTareasCumplidas(data);

    });


    this.cargarInterfaz = function(params){

        _this.objCmpPert = new Utilidades.Cmp.Cmpgestionarpert(
            {
                noUsarCerrarWinP: true,
                noUsarSeleccionarWinP: true,
                maxWinPrincipal: false,
                tipoComponente: 'panel',
                idcmp: 001 + "planes",
                //criticas:false,
                noAutoload: false,
                titleWinPrincipal: 'Diagrama de Pert',
                noUsarAyuda: true,
                generarDiagramaDesde: 'Proyecto'
            });



        _this.PanelPrincipal = new Ext.Panel({
            //layout:'fit',
            region:'center',
            //tbar:[btncambiar, btnPruebaX, btnPruebaY],
            // bodyStyle:" background-image: url(\"/planificacion/inversionesproyecto/views/images/aires.png\");background-repeat:no-repeat;background-size:contain;background-position: center;"
            html: '<div id="contenedorDiagramaPertAviones" style=" width:100%; height:100%;position: relative;">' +
            '<div id="diagramaPertAviones" style=" width:100%; height:100%">' +
            '</div>' +
            '<div id="capaVistaAmpliadaAviones"></div>' +
            '</div>'
        });

        _this.winCrudActividades = new Ext.Window({
            modal: true,
            closable: false,
            maximized: true,
            noTitle:true,
            layout:'border',
            items: [_this.PanelPrincipal],
            listeners: {
                beforeshow: function (w) {
                    Ext.Ajax.request({
                        url: 'getProyectosvivos',
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            _this.BarraProgreso.hide();
                            _this.cmpVisual({
                                datos:responseData
                            });
                        }
                    });

                }
            }
        });
    };

    this.mostrarVentana = function(params){
        _this.BarraProgreso.show('Cargando datos');
        _this.winCrudActividades.show();
    };

    this.cmpVisual = function (params) {
        var $ = go.GraphObject.make;
        _this.diagramaPert =
            $(go.Diagram, "diagramaPertAviones",
                {
                    "toolManager.hoverDelay": 100,
                    initialAutoScale: go.Diagram.Uniform,
                    initialContentAlignment: go.Spot.Left,
                    //layout: $(go.LayeredDigraphLayout)
                    layout: $(go.GridLayout)
                }
            );
        function nodeInfo(d) {  // Tooltip info for a node data object
            var str =  d.text + "\n" + "Inicia: " + d.fechainicio + "\n" + "Termina: " + d.fechafin + "\n"; //
            return str;
        }

        _this.diagramaPert.model.nodeDataArray = params.datos;

        var detailedTemp =
            $(go.Node, "Auto",
                $(go.Shape, "RoundedRectangle", {fill: "#DBE7F6",name: "SHAPE"}),
                $(go.Panel, "Table", {padding: 1},
                    $(go.RowColumnDefinition, {column: 0, separatorStroke: "black",width:70}),
                    $(go.RowColumnDefinition, {column: 1, separatorStroke: "black",width:70}),
                    $(go.RowColumnDefinition, {column: 2, separatorStroke: "black",width:70}),
                    $(go.RowColumnDefinition, {column: 3, separatorStroke: "black",width:70}),
                    $(go.RowColumnDefinition, {row: 0, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, new go.Binding('background', 'atraso',atraso),{row: 1, separatorStroke: "black", coversSeparators: true}),
                    $(go.RowColumnDefinition, {row: 2, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {row: 3, separatorStroke: "black", background: "#DDF4FF", coversSeparators: true}),
                    $(go.RowColumnDefinition, {row: 4, separatorStroke: "black", background: "#DDF4FF", coversSeparators: true}),

                    $(go.TextBlock, textStyle(),  // the name
                        {
                            row: 1, column: 1, columnSpan: 3,name: "TEXT",margin: 5, textAlign: "center",wrap: go.TextBlock.WrapFit,maxSize: new go.Size(200, NaN),
                        },
                        new go.Binding("text", "text").makeTwoWay()),
                    $(go.Picture,
                        {
                            name: 'fotoavion',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 1, column: 0,
                        },
                        new go.Binding("source", "fotoavion", fotoAvion)),
                    $(go.Picture,
                        {
                            name: 'Espacio1',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 0, column: 0,
                        },{
                            mouseEnter: mouseEnterEspacio,
                        },
                        new go.Binding("source", "space1", espacios)),

                    $(go.Picture,
                        {
                            name: 'Espacio2',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 0, column: 1,
                        },{
                            mouseEnter: mouseEnterEspacio,
                        },
                        new go.Binding("source", "space2", espacios)),
                    $(go.Picture,
                        {
                            name: 'Espacio3',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 0, column: 2,
                        },{
                            mouseEnter: mouseEnterEspacio,
                        },
                        new go.Binding("source", "space3", espacios)),
                    $(go.Picture,
                        {
                            name: 'Espacio4',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 0, column: 3,
                        },{
                            mouseEnter: mouseEnterEspacio,
                        },
                        new go.Binding("source", "space4", espacios)),
                    $(go.Picture,
                        {
                            name: 'Espacio5',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 2, column: 0,
                        },{
                            mouseEnter: mouseEnterEspacio,
                        },
                        new go.Binding("source", "space5", espacios)),
                    $(go.Picture,
                        {
                            name: 'Espacio6',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 2, column: 1,
                        },{
                            mouseEnter: mouseEnterEspacio,
                        },
                        new go.Binding("source", "space6", espacios)),
                    $(go.Picture,
                        {
                            name: 'Espacio7',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 2, column: 2,
                        },{
                            mouseEnter: mouseEnterEspacio,
                        },
                        new go.Binding("source", "space7", espacios)),
                    $(go.Picture,
                        {
                            name: 'Espacio8',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 2, column: 3,
                        },{
                            mouseEnter: mouseEnterEspacio,
                        },
                        new go.Binding("source", "space8", espacios)),
                    $(go.Picture,
                        {
                            name: 'progreso',
                            desiredSize: new go.Size(279, NaN),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 3, column: 0, columnSpan: 4
                        },
                        new go.Binding("source", "gradocumplimiento", progreso)),
                    $(go.TextBlock, textStyleProgress(),  // the name
                        {
                            row: 3, column: 2, margin: 0, textAlign: "left",
                        },
                        new go.Binding("text", "gradocumplimiento",porciento)),
                    $(go.TextBlock, textStyleProgress(),  // the name
                        {
                            text:"Real:", row: 3, column: 1, margin: 1, textAlign: "left",
                        }),
                    $(go.Picture,
                        {
                            name: 'progresoPlan',
                            desiredSize: new go.Size(279, NaN),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 4, column: 0, columnSpan: 4
                        },
                        new go.Binding("source", "plan", progreso)),
                    $(go.TextBlock, textStyleProgress(),  // the name
                        {
                            row: 4, column: 2, margin: 1, textAlign: "left",
                        },
                        new go.Binding("text", "plan",porciento)),
                    $(go.TextBlock, textStyleProgress(),  // the name
                        {
                            text:"Plan:", row: 4, column: 1, margin: 1, textAlign: "left",
                        })


                ),$("Button",
                    { alignment: new go.Spot(1,0,0,0)   },
                    $(go.Picture,
                        {
                            name: 'detalles',
                            desiredSize: new go.Size(22, 22),
                            source:'/planificacion/inversionesproyecto/views/images/detalles.png'
                        }),
                    { click: verDetalles },{// this tooltip Adornment is shared by all nodes
                        toolTip: $(go.Adornment, "Auto",
                            $(go.Shape, {fill: "#FFFFCC"}),
                            $(go.TextBlock, {margin: 4,text:'Ver detalles'})
                        )
                    }),$("Button",
                    { alignment: new go.Spot(1,0,0,30)},
                    $(go.Picture,
                        {
                            name: 'pert',
                            desiredSize: new go.Size(22, 22),
                            source:'/planificacion/inversionesproyecto/views/images/pert.png'
                        }),
                    { click: verPert },{// this tooltip Adornment is shared by all nodes
                        toolTip: $(go.Adornment, "Auto",
                            $(go.Shape, {fill: "#FFFFCC"}),
                            $(go.TextBlock, {margin: 4,text:'Ver diagrama de Pert'})
                        )
                    }),
                {// this tooltip Adornment is shared by all nodes
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, {fill: "#FFFFCC"}),
                        $(go.TextBlock, {margin: 4}, // the tooltip shows the result of calling nodeInfo(data)
                            new go.Binding("text", "", nodeInfo))
                    )
                },
                {
                    doubleClick: function(e, node) {
                        verPert(e,node);
                    },
                    mouseEnter: mouseEnter,
                    mouseLeave: mouseLeave
                });


        var simpleTemp =
            $(go.Node, "Auto",
                $(go.Shape, "RoundedRectangle", {fill: "#DBE7F6",name: "SHAPE"}),
                $(go.Panel, "Table", {padding: 1},
                    $(go.RowColumnDefinition, {column: 0, separatorStroke: "black",width:70}),
                    $(go.RowColumnDefinition, {column: 1, separatorStroke: "black",width:70}),
                    $(go.RowColumnDefinition, {column: 2, separatorStroke: "black",width:70}),
                    $(go.RowColumnDefinition, {column: 3, separatorStroke: "black",width:70}),
                    $(go.RowColumnDefinition, {row: 0, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, new go.Binding('background', 'atraso',atraso),{row: 1, separatorStroke: "black", coversSeparators: true}),
                    $(go.RowColumnDefinition, {row: 2, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {row: 3, separatorStroke: "black", background: "#DDF4FF", coversSeparators: true}),
                    $(go.RowColumnDefinition, {row: 4, separatorStroke: "black", background: "#DDF4FF", coversSeparators: true}),

                    $(go.TextBlock, textStyle(),  // the name
                        {
                            row: 1, column: 1, columnSpan: 3,name: "TEXT",margin: 5, textAlign: "center",wrap: go.TextBlock.WrapFit,maxSize: new go.Size(200, NaN),
                        },
                        new go.Binding("text", "text").makeTwoWay()),
                    $(go.Picture,
                        {
                            name: 'fotoavion',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 1, column: 0,
                        },
                        new go.Binding("source", "fotoavion", fotoAvion)),
                    $(go.Picture,
                        {
                            name: 'Espacio1',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 0, column: 0,
                        },
                        new go.Binding("source", "space1", espacios)),

                    $(go.Picture,
                        {
                            name: 'Espacio2',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 0, column: 1,
                        },
                        new go.Binding("source", "space2", espacios)),
                    $(go.Picture,
                        {
                            name: 'Espacio3',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 0, column: 2,
                        },
                        new go.Binding("source", "space3", espacios)),
                    $(go.Picture,
                        {
                            name: 'Espacio4',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 0, column: 3,
                        },
                        new go.Binding("source", "space4", espacios)),
                    $(go.Picture,
                        {
                            name: 'Espacio5',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 2, column: 0,
                        },
                        new go.Binding("source", "space5", espacios)),
                    $(go.Picture,
                        {
                            name: 'Espacio6',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 2, column: 1,
                        },
                        new go.Binding("source", "space6", espacios)),
                    $(go.Picture,
                        {
                            name: 'Espacio7',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 2, column: 2,
                        },
                        new go.Binding("source", "space7", espacios)),
                    $(go.Picture,
                        {
                            name: 'Espacio8',
                            desiredSize: new go.Size(50, 50),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 2, column: 3,
                        },
                        new go.Binding("source", "space8", espacios)),
                    $(go.Picture,
                        {
                            name: 'progreso',
                            desiredSize: new go.Size(279, NaN),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 3, column: 0, columnSpan: 4
                        },
                        new go.Binding("source", "gradocumplimiento", progreso)),
                    $(go.TextBlock, textStyleProgress(),  // the name
                        {
                            row: 3, column: 2, margin: 0, textAlign: "left",
                        },
                        new go.Binding("text", "gradocumplimiento",porciento)),
                    $(go.TextBlock, textStyleProgress(),  // the name
                        {
                           text:"Real:", row: 3, column: 1, margin: 1, textAlign: "left",
                        }),
                    $(go.Picture,
                        {
                            name: 'progresoPlan',
                            desiredSize: new go.Size(279, NaN),
                            margin: new go.Margin(3, 3, 3, 3),
                            row: 4, column: 0, columnSpan: 4
                        },
                        new go.Binding("source", "plan", progreso)),
                    $(go.TextBlock, textStyleProgress(),  // the name
                        {
                            row: 4, column: 2, margin: 1, textAlign: "left",
                        },
                        new go.Binding("text", "plan",porciento)),
                    $(go.TextBlock, textStyleProgress(),  // the name
                        {
                            text:"Plan:", row: 4, column: 1, margin: 1, textAlign: "left",
                        })


            ),{// this tooltip Adornment is shared by all nodes
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, {fill: "#FFFFCC"}),
                        $(go.TextBlock, {margin: 4}, // the tooltip shows the result of calling nodeInfo(data)
                            new go.Binding("text", "", nodeInfo))
                    )
                },
                {
                    doubleClick: function(e, node) {
                        verPert(e,node);
                    },
                    mouseEnter: mouseEnter,
                    mouseLeave: mouseLeave
                });

        var templmap = new go.Map("string", go.Node);
        templmap.add("simple", simpleTemp);
        templmap.add("detailed", detailedTemp);
        _this.diagramaPert.nodeTemplateMap = templmap;

    };



    this.paintPlane = function (params) {
        var datos = [];
        for(var i=0;i<params.length;i++){
            var tarea = params[i];
            for(var j=0;j<_this.diagramaPert.model.nodeDataArray.length;j++){
                var nodo = _this.diagramaPert.model.nodeDataArray[j];
               if(nodo.tareas.indexOf(tarea.id.toString()) !== -1){
                   datos.push({
                       tarea:tarea,
                       proyecto:nodo
                   });
               }
            }
        }
        _this.pintarevento(datos);
       // _this.diagramaPert.model.setDataProperty(_this.diagramaPert.model.findNodeDataForKey(2), 'space8', 'flight_30822');
    };


    function fotoAvion(key) {
        return "/planificacion/inversionesproyecto/views/images/flight_30822.png"; // There are only 16 images on the server
    }

    function espacios(key,pos) {
        var elemento = pos.cc;
        if(!key || key=='' || key=='vacio')
        return "/planificacion/inversionesproyecto/views/images/vacio.png";

        return "/planificacion/inversionesproyecto/views/images/"+key+".png";
    }

    function porciento(key){
        return key + ' %';
    }

    function progreso(key,pos) {
        var elemento = pos.cc;
       var key1 = 0;
        var div = Math.floor(key/10);
        key1 = div;
        if(div == 0 && key > 0)
        {
            key1 = 1;
        }


        if(elemento == 'progreso')
        return "/planificacion/inversionesproyecto/views/images/p"+key1+".png";
        else
        return "/planificacion/inversionesproyecto/views/images/a"+key1+".png";
    }

    function textStyle() {
        return { font: "bold 15px arial"};
    }

    function textStyleProgress() {
        return { font: "15px arial"};
    }

    function mouseEnter(e, obj) {
        changeCategory(e,obj);
        var shape = obj.findObject("SHAPE");
        /*var txt = obj.findObject("TEXTO");
        console.log(txt);*/
        shape.fill = "#9ABBE8";
        shape.stroke = "black";
        var text = obj.findObject("TEXT");
        text.stroke = "black";
    }
    function mouseLeave(e, obj) {
        changeCategory(e,obj);
        var shape = obj.findObject("SHAPE");
        // Return the Shape's fill and stroke to the defaults
        shape.fill = "#DBE7F6";
        shape.stroke = "black";
        // Return the TextBlock's stroke to its default
        var text = obj.findObject("TEXT");
        text.stroke = "black";
    }
    function atraso(v){
        if(v == 1)
        return "#FF8786";
        return "#FFFFFF";
    }

    function changeCategory(e, obj) {
        var node = obj.part;
        if (node) {
            var diagram = node.diagram;
            diagram.startTransaction("changeCategory");
            var cat = diagram.model.getCategoryForNodeData(node.data);
            if (cat === "simple")
                cat = "detailed";
            else
                cat = "simple";
            diagram.model.setCategoryForNodeData(node.data, cat);
            diagram.commitTransaction("changeCategory");
        }
    }


    function verDetalles(e,obj){
       var data = obj.part.data;
        var idproyecto = data.key;
        _this.mostrarVentanaDetalles({
            idproyecto:idproyecto,
            nombreproyecto:data.text
        });
    }

    function verPert(e,node){
        if(node.data == null)
        node = node.part;

        var data = node.data;

        var elemento =
        {idelemento:data.key, denominacion:data.text,activo:data.activo,fechainicio:data.fechainicio,fechafin:data.fechafin,fechacreacion:data.fechacreacion,
            _parent:null,_is_leaf:false,idestadoaprob:data.idestadoaprob
            ,nombreestadoaprob:"",estadocumplimiento:data.estadocumplimiento,nombreautor:"administrador",subordinado
            :"",superior:"",observaciones:"0",gradocumplimiento:data.gradocumplimiento,textocumplimiento:"Sin cumplir",tipoelemento
            :data.idtipoelemento,modificar:"",eliminar:"",idautor:data.idusuariocrea,tiporepeticion:"",tienedependencias:""
            ,actualizarporciento:data.actualizarporciento,duracionreal:data.duracionreal,duracionestimada:data.duracionestimada,horainicio:"",plantilla:"0"
            ,origen:"",identificador:data.identificador,idprioridad:data.idprioridad};

        _this.PanelPert = _this.objCmpPert.CargarCmpPert(10,elemento);
        _this.PanelPert.region = 'center';
        //_this.PanelPert.setHeight(400);
        _this.winPert = new Ext.Window({
            modal: true,
            closeAction:'destroy',
            title:data.text,
            //closable: false,
            maximized: true,
            //noTitle:true,
            layout:'border',
            width:400,
            height:400,
            items: [_this.PanelPert],
            listeners: {

            }
        });

        _this.winPert.show();
    }


    this.pintarevento = function(params){
         var espacios = 8;
        for(var t = 0;t<params.length;t++){
            var nodeData = _this.diagramaPert.model.findNodeDataForKey(params[t].proyecto.key);
            if(params[t].tarea.gradocumplimiento > 0 && params[t].tarea.gradocumplimiento < 100){
                var out = false;
                for(var k = espacios;k>0;k--){
                    if(!out){
                        if(nodeData['space'+k] == params[t].tarea.evento){
                            out = true;
                        }
                    }
                }
                for(var k = espacios;k>0;k--){
                    if(!out){
                        if(nodeData['space'+k] == undefined || nodeData['space'+k] == 'vacio'){
                            out = true;
                            _this.diagramaPert.model.setDataProperty(nodeData, 'space'+k, params[t].tarea.evento);
                        }
                    }
                }
            }
            else {
                var out = false;
                for(var k = espacios;k>0;k--){
                    if(!out){
                        if(nodeData['space'+k] == params[t].tarea.evento){
                            out = true;
                            _this.diagramaPert.model.setDataProperty(nodeData, 'space'+k, 'vacio');
                        }
                    }
                }
            }
        }

    }

    this.mostrarVentanaDetalles = function(params){

        //ELEMENTOS DEL GRID DE ACTIVIDADES EJECUTADAS
        _this.smgpEjecutadas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {

                },
                rowdeselect: function (sm, indiceFila, record) {

                }
            }
        });

        _this.ejecutadasreader = new Ext.data.JsonReader(
            {
                id: 'idelemento',
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'idelemento'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'horainicio'
            }, {
                name: 'gradocumplimiento'
            },  {
                name: 'denelemento'
            }]);
        _this.stgpEjecutadas = new Ext.data.Store({
            url:'verDetalles',
            autoLoad:true,
            reader: _this.ejecutadasreader,
            listeners:{
                beforeload:function(st){
                    st.baseParams.ejecutadas = 1;
                    st.baseParams.idproyecto = params.idproyecto;
                }
            }
        });

        this.gpEjecutadas = new Ext.grid.GridPanel({
            store: _this.stgpEjecutadas,
            title:'Actividades ejecutadas',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            sm: _this.smgpEjecutadas,
            margins: '3 3 3 3',
            loadMask: {
                msg: 'Cargando datos'
            },
            columns: [_this.smgpEjecutadas,  {
                header: 'CAR',
                dataIndex: 'idelemento',
                width: 80,
                tooltip: 'Código de Acceso Rápido',
                sortable: true
                },
                {
                    header: "Denominaci&oacute;n",
                    id: 'expandir',
                    dataIndex: 'denelemento',
                    sortable: true,
                    renderer: MostrarImagenTipoElementoDenominacion
                },{
                    header: 'Fecha de inicio',
                    dataIndex: 'fechainicio',
                    width: 115,
                    tooltip: 'Fecha de inicio',
                    sortable: true
                }, {
                    header: 'Fecha de fin',
                    dataIndex: 'fechafin',
                    width: 115,
                    tooltip: 'Fecha de fin',
                    sortable: true
                },{
                    header: 'Hora de inicio',
                    dataIndex: 'horainicio',
                    width: 100,
                    tooltip: 'Hora de inicio',
                    sortable: true
                }
                /*,{
                    header: "% de cumplimiento",
                    dataIndex: 'gradocumplimiento',
                    width: 100,
                    sortable: true,
                    align: 'rigth',
                    tooltip: 'Porciento de cumplimiento',
                    renderer: function(a) {
                        return a + ' %'
                    }
                }*/
                ]
        });
        //FIN ELEMENTOS DEL GRID DE ACTIVIDADES EJECUTADAS


        //ELEMENTOS DEL GRID DE ACTIVIDADES EJECUTADAS
        _this.smgpPorEjecutar = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {

                },
                rowdeselect: function (sm, indiceFila, record) {

                }
            }
        });

        _this.porejecutarreader = new Ext.data.JsonReader(
            {
                id: 'idelemento',
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'idelemento'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'horainicio'
            }, {
                name: 'gradocumplimiento'
            },  {
                name: 'denelemento'
            },{
                name: 'atrasada'
            }]);
        _this.stgpPorEjecutar = new Ext.data.Store({
            url:'verDetalles',
            autoLoad:true,
            reader: _this.porejecutarreader,
            listeners:{
                beforeload:function(st){
                    st.baseParams.ejecutadas = 0;
                    st.baseParams.idproyecto = params.idproyecto;
                }
            }
        });

        this.gpPorEjecutar = new Ext.grid.GridPanel({
            store: _this.stgpPorEjecutar,
            title:'Actividades por ejecutar',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            sm: _this.smgpPorEjecutar,
            margins: '3 3 3 3',
            loadMask: {
                msg: 'Cargando datos'
            },
            columns: [_this.smgpPorEjecutar,  {
                header: 'CAR',
                dataIndex: 'idelemento',
                width: 80,
                tooltip: 'Código de Acceso Rápido',
                sortable: true
            },
                {
                    header: "Denominaci&oacute;n",
                    id: 'expandir',
                    dataIndex: 'denelemento',
                    sortable: true,
                    renderer: MostrarImagenTipoElementoDenominacion
                },{
                    header: 'Fecha de inicio',
                    dataIndex: 'fechainicio',
                    width: 115,
                    tooltip: 'Fecha de inicio',
                    sortable: true
                }, {
                    header: 'Fecha de fin',
                    dataIndex: 'fechafin',
                    width: 115,
                    tooltip: 'Fecha de fin',
                    sortable: true
                },{
                    header: 'Hora de inicio',
                    dataIndex: 'horainicio',
                    width: 100,
                    tooltip: 'Hora de inicio',
                    sortable: true
                },{
                    header: "% de cumplimiento",
                    dataIndex: 'gradocumplimiento',
                    width: 100,
                    sortable: true,
                    align: 'rigth',
                    tooltip: 'Porciento de cumplimiento',
                    renderer: function(a) {
                        return a + ' %'
                    }
                }
            ]
        });

        _this.gpPorEjecutar.getView().getRowClass = function (ri, n) {
            if (ri.data.atrasada == 1)
                return "superior";
            else
                return "";
        };
        //FIN ELEMENTOS DEL GRID DE ACTIVIDADES EJECUTADAS

        _this.winDetalles = new Ext.Window({
            modal: true,
            closeAction:'destroy',
            title:params.nombreproyecto,
            maximized: true,
            items: [
                { layout: 'column',
                    items: [
                        {
                            columnWidth: 0.5,
                            //layout: 'form',
                            items: [_this.gpEjecutadas]
                        }, {
                            columnWidth: 0.5,
                            //layout: 'form',
                            items: [_this.gpPorEjecutar]
                        }
                    ]
                }],
            listeners: {
                beforeshow: function (w) {
                    _this.gpEjecutadas.setHeight(w.el.dom.offsetHeight - 10);
                    _this.gpPorEjecutar.setHeight(w.el.dom.offsetHeight - 10);
                    _this.gpEjecutadas.doLayout();
                    _this.gpPorEjecutar.doLayout();

                }
            }
        });

        _this.winDetalles.show();
    }

    function mouseEnterEspacio(e, obj) {
        var espacio = obj.cc;
        espacio = espacio.split('Espacio')[1];
        var data = obj.part.data;
        var actividad = data['space'+espacio];
    }

    function MostrarImagenTipoElementoDenominacion(valor) {
        return '<span class="icondistra-actividades sipac-azul">' + ' ' + valor + '</span>';
    }

};



