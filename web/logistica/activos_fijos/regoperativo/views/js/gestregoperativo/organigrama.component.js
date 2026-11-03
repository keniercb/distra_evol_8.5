/**
 * @author Ing. Gerardo Lopez Rodriguez
 * @package Registro operativo de medios
 * @version 1.0
 * @description Componente para representar modulos en vista de organigramas.
 */
Ext.ns('Ext.LOG.Organigrama');

Ext.LOG.Organigrama = Ext.extend(Ext.Panel, {
    border: false,
    region:'center',
    bodyBorder: false,
    layout: 'fit',
    initComponent: function(config) {
        var self = this;

        //this.arrimagenes = new Array();
        this.graph = null;
        this.mxTooTip = null;
        //this.myMask = new Ext.LoadMask(Ext.getBody(), {msg: 'Cargando...'});
        this.idioma = this.etiq;

        this.btnZoomIn = new Ext.Button({
            iconCls: 'modulo_zoom_in',
            tooltip: 'Acercar',
            handler: function() {
                self.graph.zoomIn();
            }
        });
        this.btnZoomOut = new Ext.Button({
            iconCls: 'modulo_zoom_out',
            tooltip: 'Alejar',
            handler: function() {
                self.graph.zoomOut();
            }
        });
        this.btnZoomActual = new Ext.Button({
            iconCls: 'modulo_zoom_original',
            tooltip: 'Establer tama&ntilde;o real',
            handler: function() {
                self.graph.zoomActual();
            }
        });
        this.btnZoomFit = new Ext.Button({
            iconCls: 'modulo_zoom_best',
            tooltip: 'Ajustar al &aacute;rea de la pantalla',
            handler: function() {
                self.graph.fit();
            }
        });

        this.btnPrint = new Ext.Button({
            iconCls: 'modulo_print',
            tooltip: 'Imprimir',
            handler: function() {
                var report = new Ext.aft.LogisticaReport({});
                var printView = report.showReport(false, {}, true, true, [
                    {id: 'A4', tipo: 'A4'},
                    {id: 'LETTER', tipo: 'CARTA'}
                ], function(tipoReporte, tipoHoja, orientacion) {

                    if (tipoHoja == 'A4') {
                        if (orientacion == 'Horizontal') {
                            self.graph.pageFormat = mxConstants.PAGE_FORMAT_A4_LANDSCAPE;
                        } else {
                            self.graph.pageFormat = mxConstants.PAGE_FORMAT_A4_PORTRAIT;
                        }

                    } else if (tipoHoja == 'LETTER') {
                        if (orientacion == 'Horizontal') {
                            self.graph.pageFormat = mxConstants.PAGE_FORMAT_LETTER_LANDSCAPE;
                        } else {
                            self.graph.pageFormat = mxConstants.PAGE_FORMAT_LETTER_PORTRAIT;
                        }
                    }

                    var preview = new mxPrintPreview(self.graph, null, null, 64);
                    preview.open();
                });
                printView.show();
            }
        });
        this.tbar = ['->', this.btnZoomIn, this.btnZoomOut, this.btnZoomActual, this.btnZoomFit, this.btnPrint];

        Ext.LOG.Organigrama.superclass.initComponent.call(this, arguments);

        this.on('render', function() {
            this.initializeMxGraph(this.body.dom);
            this.paint();
        }, this);
    },
    initializeMxGraph: function(container) {
        if (!mxClient.isBrowserSupported()) {
            // Displays an error message if the browser is not supported.
            mxUtils.error('Browser is not supported for the library MxGraph!', 200, false);
        } else {
            mxEvent.disableContextMenu(container);

            // Creates the graph inside the given container
            this.graph = new mxGraph(container);

            ///Inicializando el obj para ponerle Tooltip al nodo
            this.graph.setTooltips(true);

            // Creates the outline (navigator, overview) for moving
            // around the graph in the top, right corner of the window.
            this.createOutLine(container);

            // Set some stylesheet options for the visual appearance of vertices
            this.configureStylesheet();

            // Adds a highlight on the cell under the mousepointer resalta las celdas
            new mxCellTracker(this.graph, '#006BFF');//'#00FF00');

            // Used for HTML labels that use up the complete vertex space (see
            // graph.cellRenderer.redrawLabel below for syncing the size)
            this.graph.stylesheet.getDefaultVertexStyle()[mxConstants.STYLE_OVERFLOW] = 'fill';

            // Enables automatic sizing for vertices after editing and
            // panning by using the left mouse button.
            //new mxRubberband(this.graph);
            this.graph.setCellsMovable(true);
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
            layout.isVertexMovable = function(cell) {
                return true;
            };

            var layoutMgr = new mxLayoutManager(this.graph);

            layoutMgr.getLayout = function(cell) {
                if (cell.getChildCount() > 0) {
                    return layout;
                }
            };

            // Installs a popupmenu handler using local function (see below).
            this.graph.panningHandler.factoryMethod = function(menu, cell, evt) {
                return this.createPopupMenu(menu, cell, evt);
            }.createDelegate(this);

            // Fix for wrong preferred size
            var oldGetPreferredSizeForCell = this.graph.getPreferredSizeForCell;
            this.graph.getPreferredSizeForCell = function(cell) {
                var result = oldGetPreferredSizeForCell.apply(this, arguments);
                if (result != null) {
                    result.width = Math.max(120, result.width - 40);
                }
                return result;
            };

            // Columns are dynamically created HTML labels
            this.graph.isHtmlLabel = function(cell) {
                return !this.isSwimlane(cell) && !this.model.isEdge(cell);
            };

            // Creates a dynamic HTML label for column fields
            this.graph.getLabel = function(cell) {
                if (this.isHtmlLabel(cell) && this.getModel().isVertex(cell)) {
                    var imagen = '<img style="box-shadow: 2px 2px 5px #999;" src="/logistica/activos_fijos/utiles/views/images/sin_imagen_disponible.jpg" width="60" height="60" style="border-bottom-style: outset"/>';

                    for (var i = 0; i < cell.value.imagenes.length; i++) {
                        var imagenBody = document.createElement('img');
//                        imagenBody.setAttribute('style', 'visibility: hidden');
                        imagenBody.setAttribute.style = 'visibility: hidden';
//                        imagenBody.setAttribute('src', '"' + cell.value.imagenes[i].src + '"');
//                        imagenBody.setAttribute('id', '"' + cell.value.imagenes[i].idimagen + '"');
                        imagenBody.src = cell.value.imagenes[i].src;
                        imagenBody.id = cell.value.imagenes[i].idimagen;
                        document.body.appendChild(imagenBody);
                    }

                    if (cell.value.imagenes && cell.value.imagenes.length > 0) {
                        imagen = '<img style="box-shadow: 2px 2px 5px #999;" src="' + cell.value.imagenes[0].src + '" width="60" height="60" />';
                    }

                    var label = '<div style="padding-left: 15px; "><div style="float:left; padding-right: 15px; padding-bottom: 3px;">' + imagen + '</div>';
                    label += '<p class="x-window-header-text" style="margin-top: 10px; font-size: 10px !important;">' + cell.value.text + '</p>';

                    return label + '</div>';
                }
                return mxGraph.prototype.getLabel.apply(this, arguments);
            };

            // Edges are not editable
            this.graph.isCellEditable = function(cell) {
                return false;
            };
        }
    },
    createOutLine: function(container) {
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
    configureStylesheet: function() {
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
    addOverlays: function(cell, addDeleteIcon) {
        var _this = this;

        var overlay = new mxCellOverlay(new mxImage('/logistica/activos_fijos/regoperativo/views/images/modulo-add.png', 18, 18), 'Add child');
        overlay.cursor = 'hand';
        overlay.align = mxConstants.ALIGN_CENTER;
        overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt) {
            var _this = this;
            var ventanaAdicionarRegistro = new Ext.LOG.RegNumOperativo.VentataAdicionarRegistro({
                title: _this.idioma.lbTitleWInAdicionarRegistro,
                idioma: _this.idioma,
                closeAction: 'close',
                plantilla: false,
                treegrid: _this.treegrid,
                idregnumericoPadredesdeOrg: cell.value.idregnumerico,
                idarbol: cell.value.idarbol,
                //idarea: _this.idarea,
                fndelectCell: function() {
                    _this.clearAll();
                },
                fnaddChild: function() {
                    _this.paint();
                }
                //opcion: opcion
            });
            ventanaAdicionarRegistro.show();
            //this.addChild(cell);
        }.createDelegate(this)));

        this.graph.addCellOverlay(cell, overlay);

        if (addDeleteIcon) {

            overlay = new mxCellOverlay(new mxImage('/logistica/activos_fijos/regoperativo/views/images/modulo-close.png', 18, 18), 'Delete');
            overlay.cursor = 'hand';
            overlay.offset = new mxPoint(-4, 8);
            overlay.align = mxConstants.ALIGN_RIGHT;
            overlay.verticalAlign = mxConstants.ALIGN_TOP;
            overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt) {
                _this.onEliminarModulo(cell);
                //this.deleteSubtree(cell);
            }.createDelegate(this)));
            this.graph.addCellOverlay(cell, overlay);
        }

        if (cell.value.imagenes.length > 0) {

            overlay = new mxCellOverlay(new mxImage('/logistica/activos_fijos/regoperativo/views/images/mostrar-imagenes.png', 30, 30), 'Mostrar');
            overlay.cursor = 'hand';
            overlay.offset = new mxPoint(75, 83);
            overlay.align = mxConstants.ALIGN_LEFT;
            overlay.verticalAlign = mxConstants.ALIGN_TOP;
            overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt) {
                _this.onMostrarImagen(cell);
            }.createDelegate(this)));
            this.graph.addCellOverlay(cell, overlay);
        }
    },
    addChild: function(cell, filtro) {
        var _this = this;
        var model = this.graph.getModel();
        var parent = this.graph.getDefaultParent();
        //var myMask = new Ext.LoadMask(Ext.getBody(), {msg: _this.idioma.lbMsgCargandoDatos}, {msgCls: 'mask-css'}, {id: 'mask-css'});
        var LoadMask = new Ext.LoadMask(_this.getEl(), {msg: "Cargando..."});
        LoadMask.show();
        //myMask.show();

        Ext.Ajax.request({
            url: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/cargarRegNumOperativo',
            method: 'POST',
            params: {
                //idarearesp: _this.idarea,
                _id: cell.value.idregnumerico,
                //esmodulo: cell.value.esmodulo,
                ordenizq: cell.value.ordenizq,
                ordender: cell.value.ordender
            },
            callback: function(o, s, r) {
                var resultado = Ext.decode(r.responseText);
                var rpta = resultado.datos;
                //myMask.hide();
                LoadMask.hide();

                if (rpta.length == 0) {
                    mostrarMensaje(1, this.idioma.mserror);

                } else {
                    model.beginUpdate();
                    try {
                        Ext.each(rpta, function(modulo) {
                            var text = modulo.denominacion;

                            if (modulo.descripcionmarcamodelo != null) {
                                text += ' ' + modulo.descripcionmarcamodelo;
                            }

                            text += '</br>';

                            text += '</br>N.\xb0 inventario: ' + ((modulo.nroinventario != null) ? modulo.nroinventario : ' -');
                            text += '</br>N.\xb0 nroserie: ' + ((modulo.nroserie != null) ? modulo.nroserie : ' -');
                            var objModulo = {
                                idregnumerico: modulo.idregnumerico,
                                text: text,
                                denominacion: modulo.denominacion,
                                esmodulo: modulo.esmodulo,
                                idarbol: modulo.idarbol,
                                ordenizq: modulo.ordenizqmodulo,
                                idtabla: modulo.idtabla,
                                ordender: modulo.ordendermodulo,
                                idpadre: modulo.idpadremodulo,
                                imagenes: (modulo.imagenesRegistro) ? modulo.imagenesRegistro : modulo.imagenesIndicador
                                        // imagenes: modulo.imagenes
                            };
                            var vertex = this.graph.insertVertex(parent, null, objModulo);
                            var geometry = model.getGeometry(vertex);
                            var size = this.graph.getPreferredSizeForCell(vertex);

                            //Modifico el ancho de la celda para que se ajuste al ancho del texto
                            //size.width += modulo.text.length + 50;
                            size.width += objModulo.denominacion.length + 50;
                            geometry.width = size.width;
                            geometry.height = size.height;
                            var edge = this.graph.insertEdge(parent, null, '', cell, vertex);
                            edge.geometry.x = 1;
                            edge.geometry.y = 0;
                            edge.geometry.offset = new mxPoint(0, -20);
                            this.addOverlays(vertex, true);

                            if (objModulo.esmodulo == 2) {
                                this.addChild(vertex);
                            }
                        }.createDelegate(this));
                    } finally {
                        model.endUpdate();
                    }
                }
            }.createDelegate(this)
        });
    },
    deleteSubtree: function(cell, deletedge) {
        // Gets the subtree from cell downwards
        var cells = [];
        this.graph.traverse(cell, true, function(vertex) {
            cells.push(vertex);
            return true;
        });
        return this.graph.removeCells(cells);
    },
    paint: function() {
        this.clearLienzo();
        var parent = this.graph.getDefaultParent();
        this.graph.getModel().beginUpdate();

        try {
            var w = this.graph.container.offsetWidth;

            var v = this.graph.insertVertex(parent, null, this.moduloRaiz, w / 2 - 60, 10, 140, 60);///w / 2 + 350, 10, 140, 30);

            //  Adds tooltip information using an overlay icon
            //  adiciona a la celda un mensaje de alerta en la esquina inferior derecha cuando se da clic
            //  this.graph.addCellOverlay(v, this.createOverlay(this.graph.warningImage, 'State: ' + v.value.text));

            var geometry = this.graph.getModel().getGeometry(v);
            var size = this.graph.getPreferredSizeForCell(v);

            //  Modifico el ancho de la celda para que se ajuste al ancho del texto
            //size.width += this.moduloRaiz.text.length + 50;
            size.width += this.moduloRaiz.denominacion.length + 50;

            geometry.width = size.width;
            geometry.height = size.height;

            this.addOverlays(v, false);

        } finally {
            this.graph.getModel().endUpdate();
        }

        this.addChild(v);
    },
    clearAll: function() {
        this.clearLienzo();
    },
    clearLienzo: function() {
        this.graph.selectAll();
        this.graph.removeCells();
    },
    onMostrarImagen: function(cell) {
        var _this = this;
        var arreglo = new Array();
        var imagenes = cell.value.imagenes;

        for (var i = 0; imagenes.length > i; i++) {
            arreglo.push(imagenes[i].idimagen);
        }
        if (arreglo.length > 0) {
            var LoadMask = new Ext.LoadMask(_this.getEl(), {msg: "Cargando..."});
            LoadMask.show();
            var tamnnoInicialFijo = new Array();
            tamnnoInicialFijo[0] = 960;
            tamnnoInicialFijo[1] = 550.4;
            visorImagenes(arreglo, arreglo[0],/* '../../../../utiles/', */tamnnoInicialFijo, LoadMask);
        }

    },
    onEliminarModulo: function(cell) {
        var _this = this;
        mostrarMensaje(2, _this.idioma.lbMsgEliminar2, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                //var myMask = new Ext.LoadMask(Ext.getBody(), {msg: _this.idioma.labEliminando}, {msgCls: 'mask-css'});
                var LoadMask = new Ext.LoadMask(_this.getEl(), {msg: "Cargando..."});
                var datosModulos = new Array();console.info(cell.value);
                datosModulos[0] = {
                    idregnumerico: cell.value.idregnumerico,
                    idarbol: cell.value.idarbol,
                    ordenizq: cell.value.ordenizq,
                    ordender: cell.value.ordender,
                    esmodulo: cell.value.esmodulo,
                    idtabla: cell.value.idtabla
                }
                //myMask.show();
                LoadMask.show();
                Ext.Ajax.request({
                    url: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/eliminarRegNumOperativo',
                    method: 'POST',
                    params: {
                        datosModulos: Ext.encode(datosModulos)
                    },
                    callback: function(options, success, response) {
                        response = Ext.util.JSON.decode(response.responseText);
                        //myMask.hide();
                        LoadMask.hide();
                        if (response.codigoMsg == 3) {
                            mostrarMensaje(response.msg, _this.idioma.MsgEliminarModuloError);
                        }
                        else {
                            mostrarMensaje(1, _this.idioma.MsgEliminarModuloOK);
                            _this.deleteSubtree(cell);
                        }
                    }
                });
            }
        }
    }/*,
    clearImages: function() {
        var _this = this;
        for (var i = 0; i < _this.arrimagenes.length; i++) {
            _this.arrimagenes[i].parentNode.removeChild(_this.arrimagenes[i]);
        }

    }*/
});