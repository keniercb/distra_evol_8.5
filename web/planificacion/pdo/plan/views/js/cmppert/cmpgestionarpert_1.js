//Ext.chart.Chart.CHART_URL = '../../../comun/recursos/charts.swf';
Utilidades.Cmp.Cmpgestionarpert = function(opcionesConfig) {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.idcmp = 'cmpPert_'+opcionesConfig.idcmp;
    this.BarraProgreso = new BarraEstado();
    Ext.apply(Ext.form.VTypes, {
        daterange: function(val, field) {
            var date = field.parseDate(val);
            if (!date) {
                return;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = Ext.getCmp(field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            return true;
        }
    });
   
    
    
    
    
    
    this.fechaInicio = new Ext.form.DateField({
        fieldLabel: 'Fecha de inicio',
        format: 'd/m/Y',
        name: 'fechainipert',
        id: 'fechainipert_'+_this.idcmp,
        value: new Date().format('d/m/Y'),
        endDateField: 'fechafinpert',
        allowBlank: true,
        vtype: 'daterange',
        anchor: '90%',
        width: 100,
        menuListeners: {
            select: function(df, date) {
                _this.fechaInicio.setValue(date);
                /* _this.CargarCmpPert(_this.cbPlanes.getValue(),
                 _this.fechaInicio.getValue().format('Y-m-d'),
                 _this.fechaFin.getValue().format('Y-m-d'));*/
            }
        }
    });
    this.fechaFin = new Ext.form.DateField({
        fieldLabel: 'Fecha de fin',
        disabled: false,
        format: 'd/m/Y',
        name: 'fechafinpert',
        id: 'fechafinpert',
        value: new Date().format('d/m/Y'),
        vtype: 'daterange',
        anchor: '90%',
        width: 100,
        menuListeners: {
            select: function(df, date) {
                _this.fechaFin.setValue(date);
                /*_this.CargarCmpPert(_this.cbPlanes.getValue(),
                 _this.fechaInicio.getValue().format('Y-m-d'),
                 _this.fechaFin.getValue().format('Y-m-d'));*/
            }
        }
    });

    this.btnLimpiar = new Ext.Button({
        iconCls: 'limpiar',
        disabled: false,
        handler: function() {
            _this.cbPlanes.reset();
            _this.fechaInicio.reset();
            _this.fechaFin.reset();
        },
        tooltip: 'Limpiar filtros',
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });


    this.btnGenerarPert = new Ext.Button({
        iconCls: 'graficar',
        disabled: false,
        handler: function() {
            _this.CargarCmpPert();
            _this.cbPlanes.reset();
            _this.fechaInicio.reset();
            _this.fechaFin.reset();
        },
        tooltip: 'Generar diagrama de Pert',
        key: {
            ctrl: true,
            key: 'G'
        },
        scope: this
    });
    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaPert',
        text: 'Ayuda',
        iconCls: 'ayuda',
        disabled: false,
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });
    this.stcbcbPlanes = new Ext.data.Store({
        url: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/cargarComboPlanes',
        //url: '/planificacion/pdo/plan/index.php/cmppareto/cargarComboPlanes',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'idplan',
            root: "data"
        }, [{
                name: 'idplan'
            }, {
                name: 'denominacion'
            }])
    });
    this.cbPlanes = new Ext.form.ComboBox({
        store: _this.stcbcbPlanes,
        displayField: 'denominacion',
        valueField: 'idplan',
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        width: 100,
        emptyText: 'Seleccione',
        listeners: {
            expand: function(combo) {
                _this.stcbcbPlanes.reload();
            },
            select: function(cb, record, index) {
                _this.CargarCmpPert(cb.value,
                        _this.fechaInicio.getValue().format('Y-m-d'),
                        _this.fechaFin.getValue().format('Y-m-d'));
            }
        }
    });
    this.PanelGeneralPert = new Ext.Panel({
        id: 'container',
        layout: 'fit',
        html: '<div id="myDiagram" style=" width:100%; height:100%"></div>'
    });
    this.WinPrincipal = new Ext.Window({
        layout: 'fit',
        closable: false,
        graggable: false,
        maximized: true,
        modal: true,
        tbar: [_this.btnGenerarPert, '-', 'Planes :', _this.cbPlanes, '-', 'Fecha de inicio : ', _this.fechaInicio,
            '-', 'Fecha de fin : ', _this.fechaFin, '-', _this.btnLimpiar,
            '->', _this.btnAyuda],
        usarKeymap: true,
        botonesKeymap: [_this.btnGenerarPert, _this.btnLimpiar, _this.btnAyuda],
        items: _this.PanelGeneralPert
    });
    //funcion donde se procede a cargar la plantilla
    this.CargarCmpPert = function(idplan, fechaIni, fechaFin) {
        _this.WinPrincipal.show();

        function init() {
            var $ = go.GraphObject.make;  // for more concise visual tree definitions
            //console.log(window);
            myDiagram =
                    $(go.Diagram, "myDiagram",
                    {
                        initialAutoScale: go.Diagram.Uniform,
                        initialContentAlignment: go.Spot.Center,
                        layout: $(go.LayeredDigraphLayout)
                    });

            // The node template shows the activity name in the middle as well as
            // various statistics about the activity, all surrounded by a border.
            // The border's color is determined by the node data's ".critical" property.
            // Some information is not available as properties on the node data,
            // but must be computed -- we use converter functions for that.
            myDiagram.nodeTemplate =
                    $(go.Node, "Auto",
                    $(go.Shape, "Rectangle", // the border
                    {fill: "white"},
            new go.Binding("stroke", "critical",
                    function(b) {
                        return (b ? "red" : "blue");
                    }), new go.Binding("stroke", "es",
                    function(b) {
                        return (b ? "#55d822" : "");
                    })
                    ),
                    $(go.Panel, "Table",
                    {padding: 0.5},
            $(go.RowColumnDefinition, {column: 1, separatorStroke: "black"}),
            $(go.RowColumnDefinition, {column: 2, separatorStroke: "black"}),
            $(go.RowColumnDefinition, {row: 1, separatorStroke: "black", background: "white", coversSeparators: true}),
            $(go.RowColumnDefinition, {row: 2, separatorStroke: "black"}),
            $(go.TextBlock,
                    new go.Binding("text", "earlyStart"),
                    {row: 0, column: 0, margin: 5, textAlign: "center"}),
            $(go.TextBlock,
                    new go.Binding("text", "length"),
                    {row: 0, column: 1, margin: 5, textAlign: "center"}),
            $(go.TextBlock, // earlyFinish
                    new go.Binding("text", "",
                    function(d) {
                        return (d.earlyStart + d.length).toFixed(2);
                    }),
                    {row: 0, column: 2, margin: 5, textAlign: "center"}),
            $(go.TextBlock,
                    new go.Binding("text", "text"),
                    {row: 1, column: 0, columnSpan: 3, margin: 5,
                        textAlign: "center", font: "bold 14px sans-serif"}),
            $(go.TextBlock, // lateStart
                    new go.Binding("text", "",
                    function(d) {
                        return (d.lateFinish - d.length).toFixed(2);
                    }),
                    {row: 2, column: 0, margin: 5, textAlign: "center"}),
            $(go.TextBlock, // slack
                    new go.Binding("text", "",
                    function(d) {
                        return (d.lateFinish - (d.earlyStart + d.length)).toFixed(2);
                    }),
                    {row: 2, column: 1, margin: 5, textAlign: "center"}),
            $(go.TextBlock,
                    new go.Binding("text", "lateFinish"),
                    {row: 2, column: 2, margin: 5, textAlign: "center"})
                    )  // end Table Panel
                    );  // end Node

            // The link data object does not have direct access to both nodes
            // (although it does have references to their keys: .from and .to).
            // This conversion function gets the GraphObject that was data-bound as the second argument.
            // From that we can get the containing Link, and then the Link.fromNode or .toNode,
            // and then its node data, which has the ".critical" property we need.
            //
            // But note that if we were to dynamically change the ".critical" property on a node data,
            // calling myDiagram.model.updateTargetBindings(nodedata) would only update the color
            // of the nodes.  It would be insufficient to change the appearance of any Links.
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

            // The color of a link (including its arrowhead) is red only when both
            // connected nodes have data that is ".critical"; otherwise it is blue.
            // This is computed by the binding converter function.
            myDiagram.linkTemplate =
                    $(go.Link,
                    $(go.Shape,
                    new go.Binding("stroke", "", linkColorConverter)),
                    $(go.Shape, // arrowhead
                    {toArrow: "Standard", stroke: null},
            new go.Binding("fill", "", linkColorConverter))
                    );

            // here's the data defining the graph
            var nodeDataArray = [
                {key: 1, text: "Start", length: 0, earlyStart: 0, lateFinish: 0, critical: true},
                {key: 2, text: "a", length: 4, earlyStart: 0, lateFinish: 4, critical: true},
                {key: 3, text: "b", length: 5.33, earlyStart: 0, lateFinish: 9.17, critical: false},
                {key: 4, text: "c", length: 5.17, earlyStart: 4, lateFinish: 9.17, critical: true},
                {key: 5, text: "d", length: 6.33, earlyStart: 4, lateFinish: 15.01, critical: false},
                {key: 6, text: "e", length: 5.17, earlyStart: 9.17, lateFinish: 14.34, critical: true, es: true},
                {key: 7, text: "f", length: 4.5, earlyStart: 10.33, lateFinish: 19.51, critical: false},
                {key: 8, text: "g", length: 5.17, earlyStart: 14.34, lateFinish: 19.51, critical: true},
                {key: 9, text: "Finish", length: 0, earlyStart: 19.51, lateFinish: 19.51, critical: true}
            ];
            var linkDataArray = [
                {from: 1, to: 2},
                {from: 1, to: 3},
                {from: 2, to: 4},
                {from: 2, to: 5},
                {from: 3, to: 6},
                {from: 4, to: 6},
                {from: 5, to: 7},
                {from: 6, to: 8},
                {from: 7, to: 9},
                {from: 8, to: 9}
            ];
            myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

            // create an unbound Part that acts as a "legend" for the diagram
            myDiagram.add(
                    $(go.Node, "Auto",
                    $(go.Shape, "Rectangle", // the border
                    {fill: "lightblue"}),
            $(go.Panel, "Table",
                    $(go.RowColumnDefinition, {column: 1, separatorStroke: "black"}),
            $(go.RowColumnDefinition, {column: 2, separatorStroke: "black"}),
            $(go.RowColumnDefinition, {row: 1, separatorStroke: "black", background: "lightblue", coversSeparators: true}),
            $(go.RowColumnDefinition, {row: 2, separatorStroke: "black"}),
            $(go.TextBlock, "Early Start",
                    {row: 0, column: 0, margin: 5, textAlign: "center"}),
            $(go.TextBlock, "Length",
                    {row: 0, column: 1, margin: 5, textAlign: "center"}),
            $(go.TextBlock, "Early Finish",
                    {row: 0, column: 2, margin: 5, textAlign: "center"}),
            $(go.TextBlock, "Activity Name",
                    {row: 1, column: 0, columnSpan: 3, margin: 5,
                        textAlign: "center", font: "bold 14px sans-serif"}),
            $(go.TextBlock, "Late Start",
                    {row: 2, column: 0, margin: 5, textAlign: "center"}),
            $(go.TextBlock, "Slack",
                    {row: 2, column: 1, margin: 5, textAlign: "center"}),
            $(go.TextBlock, "Late Finish",
                    {row: 2, column: 2, margin: 5, textAlign: "center"})
                    )  // end Table Panel
                    ));
        }
        init();
    }

};
