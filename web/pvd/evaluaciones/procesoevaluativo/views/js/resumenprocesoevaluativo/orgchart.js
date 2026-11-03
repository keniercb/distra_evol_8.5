/**
 * @author Ing. Javier Rodriguez Lopez
 * @package PVD Comun
 * @version 1.0
 * @description Componente para representar estructuras gerarquicas.
 */
Ext.ns('Ext.components');
Ext.components.OrgChart = Ext.extend(Ext.Panel, {
    layout: 'fit',
    initComponent: function () {
        var self = this;
        this.graph = null;
        //console.info(self);return;
        this.stEvaluados = new Ext.data.Store({
            url: 'getEvaluados',
            baseParams: {
                idperiodoproceso: this.idperiodoproceso
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: 'idpersona'
            }, [
                {name: 'idpersona'},
                {name: 'foto'}, //Extension de la foto
                {name: 'numid'},
                {name: 'fullname'},
                {name: 'evaluacion'}
            ]),
            listeners: {
                load: function (st, records, options) {
                    if (records.length == 0) {
                        Ext.Notification.show({
                            title: 'Informaci&oacute;n',
                            msg: 'No existen personas para mostrar.',
                            time: 3
                        });
                    }
                }
            }
        });

        this.cbEvaluados = new Ext.form.ComboBox({
            store: this.stEvaluados,
            typeAhead: false,
            displayField: 'fullname',
            valueField: 'idpersona',
            minChars: 3,
            width: 400,
            pageSize: 10,
            triggerClass: 'x-form-search-trigger',
            loadingText: 'Cargando...',
            emptyText: 'Criterio a buscar',
            tpl: '<tpl for="."><div ext:qtip="{fullname} (<b>{evaluacion}</b>)" class="x-combo-list-item">{fullname}</div></tpl>',
            listeners: {
                select: function (cb, record) {
                    self.paint(record);
                }
            }
        });

        this.btnClear = new Ext.Button({
            tooltip: 'Limpiar',
            iconCls: 'limpiar',
            handler: function () {
                self.clearAll();
            }
        });
        this.btnZoomIn = new Ext.Button({
            iconCls: 'zoom_in',
            tooltip: 'Acercar',
            handler: function () {
                self.graph.zoomIn();
            }
        });
        this.btnZoomOut = new Ext.Button({
            iconCls: 'zoom_out',
            tooltip: 'Alejar',
            handler: function () {
                self.graph.zoomOut();
            }
        });
        this.btnZoomActual = new Ext.Button({
            iconCls: 'zoom_actual',
            tooltip: 'Estable tama&ntilde;o real',
            handler: function () {
                self.graph.zoomActual();
            }
        });
        this.btnZoomFit = new Ext.Button({
            iconCls: 'fit',
            tooltip: 'Ajustar al &aacute;rea de la pantalla',
            handler: function () {
                self.graph.fit();
            }
        });
        this.btnPrint = new Ext.Button({
            iconCls: 'print',
            tooltip: 'Imprimir',
            handler: function () {
                var preview = new mxPrintPreview(self.graph, 1);
                preview.open();
            }
        });

        this.tbar = [this.cbEvaluados, this.btnClear, '->', this.btnZoomIn, this.btnZoomOut, this.btnZoomActual, this.btnZoomFit, this.btnPrint];
        Ext.components.OrgChart.superclass.initComponent.call(this);
        this.on('render', function () {
            this.initializeMxGraph(this.body.dom);
        }, this);
    },
    initializeMxGraph: function (container) {
        if (!mxClient.isBrowserSupported()) {
            // Displays an error message if the browser is not supported.
            mxUtils.error('Browser is not supported for the library MxGraph!', 200, false);
        } else {
            mxEvent.disableContextMenu(container);

            // Creates the graph inside the given container
            this.graph = new mxGraph(container);

            // Creates the outline (navigator, overview) for moving
            // around the graph in the top, right corner of the window.
            this.createOutLine(container);

            // Set some stylesheet options for the visual appearance of vertices
            this.configureStylesheet();

            // Used for HTML labels that use up the complete vertex space (see
            // graph.cellRenderer.redrawLabel below for syncing the size)
            this.graph.stylesheet.getDefaultVertexStyle()[mxConstants.STYLE_OVERFLOW] = 'fill';

            // Enables automatic sizing for vertices after editing and
            // panning by using the left mouse button.
            this.graph.setCellsMovable(false);
            this.graph.setAutoSizeCells(true);
            this.graph.setPanning(true);
            this.graph.panningHandler.useLeftButtonForPanning = true;

            // Displays a popupmenu when the user clicks
            // on a cell (using the left mouse button) but
            // do not select the cell when the popup menu
            // is displayed
            this.graph.panningHandler.selectOnPopup = false;

            // Stops editing on enter or escape keypress
            var keyHandler = new mxKeyHandler(this.graph);

            // Enables automatic layout on the graph and installs
            // a tree layout for all groups who's children are
            // being changed, added or removed.
            var layout = new mxCompactTreeLayout(this.graph, false);
            layout.useBoundingBox = false;
            layout.levelDistance = 40;
            layout.nodeDistance = 8;

            // Allows the layout to move cells even though cells
            // aren't movable in the graph
            layout.isVertexMovable = function (cell) {
                return true;
            };

            var layoutMgr = new mxLayoutManager(this.graph);

            layoutMgr.getLayout = function (cell) {
                if (cell.getChildCount() > 0) {
                    return layout;
                }
            };

            // Installs a popupmenu handler using local function (see below).
            this.graph.panningHandler.factoryMethod = function (menu, cell, evt) {
                return this.createPopupMenu(menu, cell, evt);
            }.createDelegate(this);

            // Fix for wrong preferred size
            var oldGetPreferredSizeForCell = this.graph.getPreferredSizeForCell;
            this.graph.getPreferredSizeForCell = function (cell) {
                var result = oldGetPreferredSizeForCell.apply(this, arguments);
                if (result != null) {
                    result.width = Math.max(120, result.width - 40);
                }
                return result;
            };


            // Columns are dynamically created HTML labels
            this.graph.isHtmlLabel = function (cell) {
                return !this.isSwimlane(cell) && !this.model.isEdge(cell);
            };

            // Creates a dynamic HTML label for column fields
            this.graph.getLabel = function (cell) {
                if (this.isHtmlLabel(cell) && this.getModel().isVertex(cell)) {
					var srcImg = 'data:image/png;base64,' + cell.value.extension;
					
                    var html = '<table width="90%" border="0" cellspacing="0" cellpadding="1" style="text-align: center;' +
                    ' font-size: 11px">' + '<tr>' + '<td>' + '<table width="100%" border="0" cellspacing="0" cellpadding="4">' + '<tr>' + '<td width="10%" style="text-align: center; ' +
                    'vertical-align: top">' + '<img src="' + srcImg + '" width="80" height="80" border="0" style="padding-right: 4px;padding-bottom: 3px">' + '</td>' + '</tr>' + '</table>' + '</td>' + '</tr></table>';
                    
                    var label = '<div style="padding-left:10px;"><div style="float:left;padding-right:5px;padding-bottom:3px;">'
                    + html +'</div>';
                    label += '<p class="pOrg" style="margin-top:10px;">' + cell.value.fullname + '</p>';
                    label += '<p class="pOrg">' + cell.value.numid + '</p>';
                    label += '<p class="pOrg"><b';

                    //Pregunta si la evaluacion lleva algun color
                    if(cell.value.evalColor){
                        label += ' style="color:' + cell.value.evalColor+'"';
                    }
                    label += '>' + cell.value.evaluacion + '</b></p>';

                    return label + '</div>';
                }
                return mxGraph.prototype.getLabel.apply(this, arguments);
            };

//            var label = (this.labelsVisible) ? this.convertValueToString(cell) : '';
//            var geometry = this.model.getGeometry(cell);
//
//            if (!this.model.isCollapsed(cell) && geometry != null && (geometry.offset == null ||
//                    (geometry.offset.x == 0 && geometry.offset.y == 0)) && this.model.isVertex(cell) &&
//                    geometry.width >= 2){
//                    var style = this.getCellStyle(cell);
//                    var fontSize = style[mxConstants.STYLE_FONTSIZE] || mxConstants.DEFAULT_FONTSIZE;
//                    var max = geometry.width / (fontSize * 0.625);
//
//                    if (max < label.length)
//                    {
//                            return label.substring(0, max) + '...';
//                    }
//            }

            // Edges are not editable
            this.graph.isCellEditable = function (cell) {
                return false;
            };
        }
    },
    createOutLine: function (container) {
//        var outline = document.createElement('div');
//        outline.style.position = 'absolute';
//        outline.style.overflow = 'hidden';
//        outline.style.bottom = '7px';
//        outline.style.right = '7px';
//        outline.style.width = '160px';
//        outline.style.height = '120px';
//        outline.style.background = 'transparent';
//        outline.style.zIndex = '1';
//        outline.style.borderStyle = 'solid';
//        outline.style.borderColor = 'lightgray';
//        container.appendChild(outline);
//        document.body.appendChild(outline);
//        var outln = new mxOutline(this.graph, outline);
    },
    configureStylesheet: function () {
        var style = this.graph.getStylesheet().getDefaultVertexStyle();
//        style[mxConstants.STYLE_SHAPE] = 'label';
//
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
        style[mxConstants.STYLE_SPACING_LEFT] = 70;

////        style[mxConstants.STYLE_GRADIENTCOLOR] = '#7d85df';
////        style[mxConstants.STYLE_STROKECOLOR] = '#5d65df';
//        style[mxConstants.STYLE_FILLCOLOR] = '#adc5ff';

        style[mxConstants.STYLE_FONTCOLOR] = '#1d258f';
        style[mxConstants.STYLE_FONTFAMILY] = 'Verdana';
        style[mxConstants.STYLE_FONTSIZE] = '12';
        style[mxConstants.STYLE_FONTSTYLE] = '1';

        style[mxConstants.STYLE_SHADOW] = '1';
        style[mxConstants.STYLE_ROUNDED] = '1';
        style[mxConstants.STYLE_GLASS] = '1';

//        style[mxConstants.STYLE_IMAGE] = '/pvd/repositorio_persona/persona/personaimgs/persona.jpg';
//        style[mxConstants.STYLE_IMAGE_WIDTH] = '60';
//        style[mxConstants.STYLE_IMAGE_HEIGHT] = '60';
//
//        // Sets the default style for edges
//        style = this.graph.getStylesheet().getDefaultEdgeStyle();
//        style[mxConstants.STYLE_ROUNDED] = true;
//        style[mxConstants.STYLE_STROKEWIDTH] = 2;
//        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom;
//
//        // Changes the default style for edges and vertices "in-place"
        var style = this.graph.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom;

        var style = this.graph.getStylesheet().getDefaultVertexStyle();
        style[mxConstants.STYLE_SPACING] = 8;
    },
    createPopupMenu: function (menu, cell, evt) {
        var model = this.graph.getModel();

        if (cell != null) {
            if (model.isVertex(cell)) {
                menu.addItem('Add child', 'editors/images/overlays/check.png', function () {
                    this.addChild(cell);
                }.createDelegate(this));
            }

            menu.addItem('Edit label', 'editors/images/text.gif', function () {
                this.graph.startEditingAtCell(cell);
            }.createDelegate(this));

            if (cell.id != 'treeRoot' && model.isVertex(cell)) {
                menu.addItem('Delete', 'editors/images/delete.gif', function () {
                    this.deleteSubtree(cell);
                }.createDelegate(this));
            }

            menu.addSeparator();
        }

        menu.addItem('Fit', 'editors/images/zoom.gif', function () {
            this.graph.fit();
        });

        menu.addItem('Actual', 'editors/images/zoomactual.gif', function () {
            this.graph.zoomActual();
        }.createDelegate(this));

        menu.addSeparator();

        menu.addItem('Print', 'editors/images/print.gif', function () {
            var preview = new mxPrintPreview(this.graph, 1);
            preview.open();
        }.createDelegate(this));
    },
    addOverlays: function (cell, addDeleteIcon) {
        var overlay = new mxCellOverlay(new mxImage('/pvd/evaluaciones/procesoevaluativo/views/images/add.png', 22, 22), 'Add child');
        overlay.cursor = 'hand';
        overlay.align = mxConstants.ALIGN_CENTER;
        overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt) {
            this.addChild(cell);
        }.createDelegate(this)));

        this.graph.addCellOverlay(cell, overlay);

        if (addDeleteIcon) {
            overlay = new mxCellOverlay(new mxImage('/pvd/evaluaciones/procesoevaluativo/views/images/close.png', 28, 28), 'Delete');
            overlay.cursor = 'hand';
            overlay.offset = new mxPoint(-4, 8);
            overlay.align = mxConstants.ALIGN_RIGHT;
            overlay.verticalAlign = mxConstants.ALIGN_TOP;
            overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function (sender, evt) {
                this.deleteSubtree(cell);
            }.createDelegate(this)));

            this.graph.addCellOverlay(cell, overlay);
        }
    },
    addChild: function (cell, filtro) {
        var model = this.graph.getModel();
        var parent = this.graph.getDefaultParent();
        PVD.mostrarMascara('mskloadeval', 'Por favor espere', 'Cargando personas evaluadas');
        Ext.Ajax.request({
            url: 'getEvaluados',
            method: 'POST',
            params: {
                idpersonaEvaluador: cell.value.idpersona,
                idperiodoproceso: this.idperiodoproceso
            },
            callback: function (o, s, r) {
                var rpta = Ext.decode(r.responseText);
				
                PVD.ocultarMascara('mskloadeval');
                if (rpta.datos.length == 0) {
                    Ext.Notification.show({
                        title: 'Informaci&oacute;n',
                        msg: 'No existen personas para mostrar.',
                        time: 3
                    });
                } else {
                    model.beginUpdate();
                    try {
                        Ext.each(rpta.datos, function (persona) {						
                            var objPersona = {
                                idpersona: persona.idpersona,
                                numid: persona.numero,
                                fullname: persona.fullname,
                                evaluacion: persona.evaluacion ? persona.evaluacion : '',
                                evalColor: persona.evalColor,								
                            };
							
                            var vertex = this.graph.insertVertex(parent, null, objPersona);
                            var geometry = model.getGeometry(vertex);
                            var size = this.graph.getPreferredSizeForCell(vertex);
                            //Modifico el ancho de la celda para que se ajuste al ancho del texto
							//console.info(persona.fullname);return;
                            size.width += persona.fullname.length + 50;
                            geometry.width = size.width;
                            geometry.height = size.height;
                            var edge = this.graph.insertEdge(parent, null, '', cell, vertex);
                            edge.geometry.x = 1;
                            edge.geometry.y = 0;
                            edge.geometry.offset = new mxPoint(0, -20);

                            this.addOverlays(vertex, true);
                        }.createDelegate(this));
                    }
                    finally {
                        model.endUpdate();
                    }
                }
            }.createDelegate(this)
        });
    },
    deleteSubtree: function (cell) {
        // Gets the subtree from cell downwards
        var cells = [];
        this.graph.traverse(cell, true, function (vertex) {
            cells.push(vertex);
            return true;
        });
        this.graph.removeCells(cells);
    },
    paint: function (record) {
        this.clearLienzo();
        var parent = this.graph.getDefaultParent();
        this.graph.getModel().beginUpdate();
        try {
            var w = this.graph.container.offsetWidth;
            var objPersona = {
                idpersona: record.get('idpersona'),
                extension: record.get('foto'),
                numid: record.get('numid'),
                fullname: record.get('fullname'),
                evaluacion: record.get('evaluacion') ? record.get('evaluacion') : ''
            };
            var v = this.graph.insertVertex(parent, null, objPersona, w / 2 - 100, 10, 140, 60);

            var geometry = this.graph.getModel().getGeometry(v);
            var size = this.graph.getPreferredSizeForCell(v);
            //Modifico el ancho de la celda para que se ajuste al ancho del texto
            size.width += record.get('fullname').length + 50;
            geometry.width = size.width;
            geometry.height = size.height;
            this.addOverlays(v, false);
        }
        finally {
            this.graph.getModel().endUpdate();
        }
    },
    clearAll: function () {
        this.cbEvaluados.reset();
        this.clearLienzo();
    },
    clearLienzo: function () {
        this.graph.selectAll();
        this.graph.removeCells();
    }
});
