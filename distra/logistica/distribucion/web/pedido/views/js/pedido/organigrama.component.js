/**
 * @author Ing.Yoandi Díaz Ramos
 * @package Xetid
 * @version 1.0
 * @description Componente para representar modulos en vista de organigramas.
 */
Ext.ns('Ext.LOG.Organigrama');

Ext.LOG.Organigrama = Ext.extend(Ext.Panel, {
    border: false,
    bodyBorder: false,
    layout: 'fit',
    initComponent: function(config) {
        var self = this;
        this.graph = null;
        this.mxTooTip = null;
        this.myMask = new Ext.LoadMask(Ext.getBody(), {msg: 'Cargando...'});
        this.idioma = this.etiq;

        this.btnZoomIn = new Ext.Button({
            iconCls: 'icondistra-ampliarimagen',
            tooltip: 'Acercar',
            handler: function() {
                self.graph.zoomIn();
            }
        });
        this.btnZoomOut = new Ext.Button({
            iconCls: 'icondistra-reducirimagen',
            tooltip: 'Alejar',
            handler: function() {
                self.graph.zoomOut();
            }
        });
        this.btnZoomActual = new Ext.Button({
            iconCls: 'revisar',
            tooltip: 'Establecer tama&ntilde;o real',
            handler: function() {
                self.graph.zoomActual();
            }
        });
        this.btnZoomFit = new Ext.Button({
            iconCls: 'ajustar',
            tooltip: 'Ajustar al &aacute;rea de la pantalla',
            handler: function() {
                self.graph.fit();
            }
        });

        this.labelcantdias = new Ext.form.Label(
            {
                html:'<span style="color:#006BFF"><b>' + 'Cantidad de dias: ' + '</b></span>',
                hidden:true
            }
        );

        this.valores = [
            [1,'Fecha de creación del documento','FCR'],
            [2,'Fecha de confirmación del documento','FC'],
            [3,'Fecha de cierre del documento','FCI'],
            [4,'Fecha de aprobación del documento','FA'],
            [5,'Fecha de contabilización del documento','FCO'],
            [6,'Orden de trabajo','OT'],
            [7,'Citas','C'],
            [8,'Oferta','OF'],
            [9,'ABC','ABC'],
            [10,'Pedido','P'],
            [11,'Balanceo de pedido','BP'],
            [12,'Distribución','D'],
            [13,'Transferencia','T'],
            [14,'Informe de recepción','IR'],
            [15,'Vale de entrega','VE'],
            [16,'Agencia','A'],
        ]

        this.storeValores = new Ext.data.SimpleStore({
            fields:[{name:'idvalor'},{name:'denominacion'},{name:'abreviatura'}]
        });
        this.storeValores.loadData(this.valores);

        this.leyenda = new Ext.grid.GridPanel({
            id: 'gridLeyenda',
            store: this.storeValores,
            autoScroll: true,
            loadMask: 'Cargando...',
            stripeRows: true,
            columns: [
                {header: 'No.', width: 50, hideable: false, dataIndex: 'idvalor'},
                {header: 'Valor', width: 230, hideable: false, dataIndex: 'denominacion'},
                {header: 'Abreviatura', width: 70, hideable: false, dataIndex: 'abreviatura'},
            ]
        });

        this.btnCerrar = new Ext.Button({
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: 'Cerrar',
            handler: function() {
                self.ventanaLeyenda.hide();
            }
        });

        this.ventanaLeyenda = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: true,
            constrain: true,
            layout: 'fit',
            title: 'Leyenda',
            width: 420,
            height: 450,
            items: [this.leyenda],
            buttons: [
                this.btnCerrar
            ]
        });

        this.btnleyenda = new Ext.Button({
            iconCls: 'talonario',
            text: 'Leyenda',
            tooltip: 'Leyenda',
            handler: function() {
                self.ventanaLeyenda.show();
            }
        });

        this.tbar = ['->',this.labelcantdias,' ','-',this.btnleyenda,'-', this.btnZoomIn, this.btnZoomOut, this.btnZoomActual, this.btnZoomFit];
        Ext.LOG.Organigrama.superclass.initComponent.call(this, arguments);
        this.on('render', function() {
            this.initializeMxGraph(this.body.dom);
            this.paint();
        }, this);
    },
    initializeMxGraph: function(container) {
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error('Browser is not supported for the library MxGraph!', 200, false);
        } else {
            mxEvent.disableContextMenu(container);
            // Creates the graph inside the given container
            this.graph = new mxGraph(container);

            ///Inicializando el obj para ponerle Tooltip al nodo
            this.graph.setTooltips(true);
            //console.info(this.mxTooTip);

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

                    var imagen = '<img style="box-shadow: 2px 2px 5px #999;" src="/logistica/utiles/ubicacion/views/images/imagen.jpg" width="60" height="60" style="border-bottom-style: outset"/>';
//
//                    for (var i = 0; i < cell.value.imagenes.length; i++) {
//                        var imagenBody = document.createElement('img');
//                        imagenBody.setAttribute('style', 'visibility: hidden');
//                        imagenBody.setAttribute('src', 'getImagenes?idimagen=' + cell.value.imagenes[i]);
//                        imagenBody.setAttribute('id', 'getImagenes?idimagen=' + cell.value.imagenes[i]);
//                        document.body.appendChild(imagenBody);
//                    }
// 
                    if (cell.value.imagenes && cell.value.imagenes.length > 0) {
                        imagen = '<img style="box-shadow: 2px 2px 5px #999;" src="getImagenes?idimagen=' + cell.value.imagenes[0] + '" width="60" height="60" />';
                    }
                    var label = '<div style="padding-left: 15px; "><div style="float:left; padding-right: 15px; padding-bottom: 3px;">' + imagen + '</div>';
                    label += '<p class="x-window-header-text" style="margin-top: 10px; font-size: 10px !important;">' + cell.value.denomestructuraubicacion + '</p>';
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

                // style[mxConstants.STYLE_GRADIENTCOLOR] = '#7d85df';
                // style[mxConstants.STYLE_STROKECOLOR] = '#5d65df';
                // style[mxConstants.STYLE_FILLCOLOR] = '#adc5ff';

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
    addOverlays: function(cell, addDeleteIcon, addInsertIcon) {
        var _this = this;
        if (addInsertIcon) {
//            Ext.getCmp('idnombre').reset();
//            Ext.getCmp('idestado').reset();
            var overlay = new mxCellOverlay(new mxImage("/logistica/distribucion/pedido/views/images/adicionar.png", 18, 18), 'Add child');
            overlay.cursor = 'hand';
            overlay.align = mxConstants.ALIGN_CENTER;
            overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt) {
                var _this = this;
                var iddoc = cell.value.iddoc;
                var organigrama = Ext.getCmp('idorganigrama');
//                 organigrama.getStore().on({
//                 'beforeload': function(st) {
//                 st.baseParams.idestructuraubicacion =idestructuraubicacion;
//            }
//        });
                _this.panel.show();
                _this.panel.expand();
                _this.st.on({
                    beforeload: function() {
                        Ext.apply(this.baseParams, {
                            iddoc: iddoc,
                            start: 0,
                            limit: this.limitParams.limit || this.baseParams.limit || 30
                        });
//                        console.info(this);
                        Ext.apply(this.initBaseParams, this.baseParams);
                    }
                });
                _this.st.load();
//                Ext.getBody().mask('Cargando...', 'x-mask-loading');
//                Ext.Ajax.request({
//                    url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarComboUbicacion',
//                    method: 'POST',
//                    params: {node: idubicacion},
//                    callback: function(opt, success, response) {
//                        respMsg = Ext.decode(response.responseText);
//                        console.info(respMsg);
                        Ext.getCmp('idnombre').setValue(cell.value.denomestructuraubicacion);
//                        //Ext.getCmp('idestado').setValue('20%');
//                        Ext.getBody().unmask();
//                    }
//                });
            }.createDelegate(this)));
            this.graph.addCellOverlay(cell, overlay);
        }
        if (addDeleteIcon) {
            overlay = new mxCellOverlay(new mxImage('/logistica/activos_fijos/modulo/views/images/modulo-close.png', 18, 18), 'Delete');
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
    },
    addChild: function(cell, filtro) {
        var _this = this;
        var model = this.graph.getModel();
        var parent = this.graph.getDefaultParent();
        this.myMask.show();
        Ext.Ajax.request({
            url: '/logistica/distribucion/pedido/index.php/pedido/cargarTrazabilidad',
            method: 'POST',
            params: {
                node: this.moduloRaiz.idestructuraubicacion
            },
            callback: function(o, s, r) {
                var rpta = Ext.decode(r.responseText);
                var cantdias = rpta.cantdias;
                rpta = rpta.datos;
                modulo = rpta[0];
                _this.myMask.hide();
                model.beginUpdate();
                try {
                    var text = modulo.text;
                    var objUbicacion = {
                        idestructuraubicacion: modulo.id,
                        denomestructuraubicacion: modulo.text,
                        iddoc: modulo.iddoc
                    };

                    this.labelcantdias.show();
                    this.labelcantdias.setText('<span style="color:#2d8efd"><b>' + 'Cantidad de dias: '+ cantdias + '</b></span>',false);

                    var vertex = this.graph.insertVertex(parent, null, objUbicacion);
                    var geometry = model.getGeometry(vertex);
                    var size = this.graph.getPreferredSizeForCell(vertex);

                    //Modifico el ancho de la celda para que se ajuste al ancho del texto
                    size.width += modulo.text.length + 50;
                    geometry.width = size.width;
                    geometry.height = size.height;
                    if(modulo.iddoc != -1)
                        this.addOverlays(vertex, false, true);
                    else
                        this.addOverlays(vertex, false, false);
                    if (modulo.hijos.length != 0) {
                        this.addChilds(modulo.hijos, vertex, model, parent);
                     }//else{
                    //     var style = this.graph.getStylesheet().getDefaultVertexStyle();
                    //     style[mxConstants.STYLE_GRADIENTCOLOR] = '#7d85df';
                    //     style[mxConstants.STYLE_STROKECOLOR] = '#5d65df';
                    //     style[mxConstants.STYLE_FILLCOLOR] = '#adc5ff';
                    // }
                } finally {
                    model.endUpdate();
                }
            }.createDelegate(this)
        });
    },
    addChilds: function (rpta, cell, model, parent) {
        Ext.each(rpta, function(modulo) {
            //nombre del hijo y se crea
            var text = modulo.text;
            var objUbicacion = {
                idestructuraubicacion: modulo.id,
                denomestructuraubicacion: modulo.text,
                iddoc: modulo.iddoc
            };
            var vertex = this.graph.insertVertex(parent, null, objUbicacion);
            var geometry = model.getGeometry(vertex);
            var size = this.graph.getPreferredSizeForCell(vertex);

            //Modifico el ancho de la celda para que se ajuste al ancho del texto
            size.width += modulo.text.length + 50;
            geometry.width = size.width;
            geometry.height = size.height;
            var edge = this.graph.insertEdge(parent, null, '', cell, vertex);
            edge.geometry.x = 1;
            edge.geometry.y = 0;
            edge.geometry.offset = new mxPoint(0, -20);
            if(modulo.iddoc != -1)
                this.addOverlays(vertex, false, true);
            else
                this.addOverlays(vertex, false, false);
              if (modulo.hijos.length != 0) {
                  this.addChilds(modulo.hijos, vertex, model, parent);
               }//else{
              //     var style = this.graph.getStylesheet().getDefaultVertexStyle();
              //     style[mxConstants.STYLE_GRADIENTCOLOR] = '#7d85df';
              //     style[mxConstants.STYLE_STROKECOLOR] = '#5d65df';
              //     style[mxConstants.STYLE_FILLCOLOR] = '#adc5ff';
              // }
        }.createDelegate(this));
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
            // var v = this.graph.insertVertex(parent, null, this.moduloRaiz, w / 2 - 50, 10, 140, 60);//w / 2 + 350, 10, 140, 30);

            //  Adds tooltip information using an overlay icon
            //  adiciona a la celda un mensaje de alerta en la esquina inferior derecha cuando se da clic
            //  this.graph.addCellOverlay(v, this.createOverlay(this.graph.warningImage, 'State: ' + v.value.text));

            // var geometry = this.graph.getModel().getGeometry(v);
            // var size = this.graph.getPreferredSizeForCell(v);

            //  Modifico el ancho de la celda para que se ajuste al ancho del texto
            // size.width += this.moduloRaiz.denomestructuraubicacion.length + 50;

            // geometry.width = size.width;
            // geometry.height = size.height;

            // this.addOverlays(v, false, false);

        } finally {
            this.graph.getModel().endUpdate();
        }
        this.addChild(null);
    },
    clearAll: function() {
        this.clearLienzo();
    },
    clearLienzo: function() {
        this.graph.selectAll();
        this.graph.removeCells();
    },
    onMostrarImagen: function(cell) {
        var arreglo = [];
        var imagenes = cell.value.imagenes;
        for (var i = 0; imagenes.length > i; i++) {
            arreglo.push('getImagenes?idimagen=' + imagenes[i]);
        }
        if (arreglo.length > 0) {
            visorImagenes(arreglo, arreglo[0]);
        }
    },
    onEliminarModulo: function(cell) {
        var _this = this;
        mostrarMensaje(2, _this.idioma.lbMsgEliminar2, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                var myMask = new Ext.LoadMask(Ext.getBody(), {msg: _this.idioma.labEliminando});
                var datosModulos = new Array();
                datosModulos[0] = {
                    idregnumerico: cell.value.idregnumerico,
                    ordenizq: cell.value.ordenizq,
                    ordender: cell.value.ordender,
                    esmodulo: cell.value.esmodulo
                }
                myMask.show();
                Ext.Ajax.request({
                    url: 'eliminarModulo',
                    method: 'POST',
                    params: {
                        datosModulos: Ext.encode(datosModulos)
                    },
                    callback: function(options, success, response) {
                        response = Ext.util.JSON.decode(response.responseText);
                        myMask.hide();
                        if (response.Msg == 3)
                            mostrarMensaje(response.Msg, _this.idioma.MsgEliminarModuloError);
                        else
                            mostrarMensaje(1, _this.idioma.MsgEliminarModuloOK);

                        _this.deleteSubtree(cell);
                    }
                });
            }
        }
    }
});


