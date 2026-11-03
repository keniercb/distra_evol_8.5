Ext.namespace('Ext.Costo.Procesos.Nomencladores.Componentes')
Ext.Costo.Procesos.Nomencladores.Componentes.CCNAE = Ext.extend(Ext.Component,
        {
            constructor: function(params) {
                var scope = this;
                scope.url = '/contabilidad/contabilidad_costos/configuracion/index.php/centronivel/';
                scope.method = 'loadDataComponent';
                scope.hideSearch = false;
                scope.extending = 0;
                scope.showFullTree = false;
                scope.showCuenta = (params.showCuenta) ? true : false;
                /**
                 * Define si es necesario cargar los js y css necesarios para el componentes notifico
                 */
                scope.loadHelpersFiles = true;
                scope.perfil = window.parent.perfil;
                /**
                 * 0 permite una sola selección(default)
                 * 1 selección solo a nivel de hoja
                 * 2 selección a cualquier nivel
                 */
                scope.typeSelection = 0;
                /**
                 * 1: Patrimonial o Empresarial
                 * 2: Presupuestario
                 * 3: Mixto
                 */
                scope.types = [1, 2];
                /**
                 * Define el componente donde se va a renderizar
                 */
                scope.renderIn = undefined;
                scope.rootText = 'CENTROS DE COSTOS Y NAE';
                scope.longitudTotal = 20;

                /*
                 * Entidad pasada por parámetro opcionalmente
                 */
                scope.idestructuraOpcional = -1;

                Ext.apply(this, params || {});
                scope.addEvents('initialize');
                scope.addEvents('checkchange');
                scope.addEvents('click');
                scope.addEvents('dblclick');
                scope.addEvents('load');
                scope.addEvents('searchClose');
                // sto soloo es para asegurarse que cuando se muestre el arbol completo no se
                // seleccionen los nodos que representas las Estructuras Economicas
                if (scope.showFullTree) {
                    scope.typeSelection = 2;
                }
                scope.loadJs("/contabilidad/comun/js/Ext.Cont.SearchField", 'SearchField');
                scope.loadCss(".inactivo a span{cursor: not-allowed;color:#8d8d8d !important;font-style:italic;font-weight:bold;}");
                Ext.Ajax.request({
                    method: "POST",
                    url: this.url + "cargaretiquetas",
                    callback: function(options, success, response) {
                        scope.etiquetas = Ext.decode(response.responseText);
                        scope.rootText = (scope.types.length == 2) ? scope.etiquetas.rootText : ((scope.types[0] == 1) ? scope.etiquetas.rootTextCentro : scope.etiquetas.rootTextNAE);
                        if (!document.getElementById('Notification') && scope.loadHelpersFiles)
                            scope.loadJs("/contabilidad/comun/componentes/Notification/js/Ext.Cont.Notification", 'Notification');
                        if (scope.loadHelpersFiles)
                            scope.loadCss(".x-tree-node a:hover,.x-dd-drag-ghost a:hover{color:black;font:bold 12px arial,tahoma,helvetica,sans-serif;}");
                        scope.tpCCNAEOG = new Ext.Costo.Procesos.Nomencladores.Componentes.UI.CCNAE(scope);
                        scope.initializeEvents(scope);
                        scope.initializeFunctions(scope);
                        scope.fireEvent('initialize', scope, scope.tpCCNAEOG);
                    }
                });
                return Ext.Costo.Procesos.Nomencladores.Componentes.CCNAE.superclass.constructor.call(this);
            },
            loadJs: function(jsSrc, id) {
                if (jsSrc != null) {
                    var tagScript = document.createElement("script");
                    tagScript.setAttribute("type", "text/javascript");
                    tagScript.setAttribute("id", id);
                    tagScript.setAttribute("src", jsSrc + ".js");
                    Ext.DomQuery.selectNode("body").appendChild(tagScript);
                }
            },
            loadCss: function(css) {
                var tag = document.createElement("style");
                tag.type = "text/css";
                if (tag.styleSheet)
                    tag.styleSheet.cssText = css;
                else
                    tag.appendChild(document.createTextNode(css));
                document.getElementsByTagName("head")[0].appendChild(tag);
            },
            initializeEvents: function(scope) {
                scope.tLoader.on({
                    beforeload: function(treeLoader, node) {
                        scope.tpCCNAEOG.loadMask(scope.etiquetas.loading);
                        this.baseParams.typeSelection = scope.typeSelection;
                        this.baseParams.type = Ext.encode(scope.types);
                        this.baseParams.extending = scope.extending;
                        this.baseParams.showFullTree = scope.showFullTree;
                        this.baseParams.showCuenta = scope.showCuenta;
                        this.baseParams.idestructura = (!node.isRoot) ? node.attributes.idestructura : -1;
                        this.baseParams.idestructuraOpcional = (scope.idestructuraOpcional) ? scope.idestructuraOpcional : -1;
                        scope.busyRequest = true;
                        scope.rootText = (scope.types.length == 2) ? scope.etiquetas.rootText : ((scope.types[0] == 1) ? scope.etiquetas.rootTextCentro : scope.etiquetas.rootTextNAE);
                        scope.rootCCNAEOG.setText(scope.rootText.toUpperCase());
                    },
                    load: function(object, node, callback) {
                        scope.tpCCNAEOG.mask.hide();
                        if (callback.responseText == -1) {
                            mostrarMensaje(1, scope.etiquetas.msgEntidadRectora);
                            
                            var tieneHijos = (scope.rootCCNAEOG.childNodes.length == 0) ? false : true;
                            scope.fireEvent('load', scope, tieneHijos, true);
                            
                        } else {
                            scope.tpCCNAEOG.mask.hide();
                            scope.busyRequest = false;
                            var msg = (this.baseParams.filter) ? scope.etiquetas.MsgInformacionSinResultadoSearch : scope.etiquetas.MsgInformacionSinResultado;
                            this.baseParams = {};
                            
                            var tieneHijos = (scope.rootCCNAEOG.childNodes.length == 0) ? false : true;
                            if (!tieneHijos) {
                                mostrarMensaje(1, msg);
                                scope.fireEvent('load', scope, tieneHijos);
                            }
                            else {
                                if (scope.tpCCNAEOG.getRootNode().firstChild.attributes.longitudconcat)
                                    scope.longitudTotal = scope.tpCCNAEOG.getRootNode().firstChild.attributes.longitudconcat;
                                scope.fireEvent('load', scope, scope.rootCCNAEOG.hasChildNodes());
                            }
                            scope.tpCCNAEOG.el.unmask();
                            if (scope.menu.items.length == 0) {
                                scope.menu.add(scope.itemreload);
                                scope.menu.add(scope.miMarcar);
                                scope.menu.add(scope.miDesmarcar);
                            }
                        }
                        
                        if (node.childNodes) {
                            var nodoshijos = node.childNodes;
                            var length = nodoshijos.length;
                            for (var i = 0; i < length; i++) {
                                if (nodoshijos[i].attributes.idestado == 2) {
                                    nodoshijos[i].getUI().addClass('inactivo');
                                }
                            }
                        }
                    }
                });

                scope.tpCCNAEOG.on({
                    afterlayout: function(c) {
                        scope.hideSearch ? scope.sfBuscar.setWidth(scope.toolbar.el.getWidth() - 4) : scope.sfBuscar.setWidth(scope.toolbar.el.getWidth() - 165);
                        scope.showFullTree ? scope.toolbar.hide() : scope.toolbar.show()
                    },
                    checkchange: function(node, checked) {
                        if (checked)
                            node.select();
                        else
                            node.unselect();
                        scope.fireEvent('checkchange', scope, scope.fGetSelections(), node, checked);
                    },
                    contextmenu: function(node, e) {
                        var textreaload = (node.id == 0) ? scope.etiquetas.reloadTree : scope.etiquetas.reload;
                        if (!node.attributes.leaf && node.isExpanded()) {
                            node.select();
                            var count = scope.fGetCountNodes(node);
                            var marcados = scope.fGetCountCheckedNodes(node, true);
                            var desmarcados = scope.fGetCountCheckedNodes(node, false);

                            if ((desmarcados < count && desmarcados > 0) || (desmarcados == count)) {
                                scope.miMarcar.show();
                                scope.miDesmarcar.hide();
                            } else if (marcados == count) {
                                scope.miMarcar.hide();
                                scope.miDesmarcar.show();
                            } else {
                                scope.miMarcar.show();
                                scope.miDesmarcar.show();
                            }
                            scope.itemreload.setText(textreaload);
                            scope.itemreload.show();
                        } else {
                            node.select();
                            scope.itemreload.setText(textreaload);
                            scope.itemreload.show();
                            scope.miMarcar.hide();
                            scope.miDesmarcar.hide();
                        }
                        scope.menu.showAt(e.getXY());
                    },
                    beforeclick: function(node, eventObject) {
                        // si la seleccion es solo a nivel de hojas y el nodo no es hoja cancelar el evento click
                        if (scope.typeSelection == 1 && !node.isLeaf()) {
                            return false;
                        }
                        var selections = scope.fGetSelections();
                        if (Ext.isArray(selections) && selections.length > 0) {
                            for (var i = 0; i < selections.length; i++) {
                                if (node.id != selections[i].id) { // controlando si se da click nuevamente en el mismo nodo
                                    selections[i].getUI().toggleCheck();
                                }
                            }
                        }
                    },
                    click: function(node) {
                        if (node.id != 0) {
                            node.getUI().toggleCheck(true);
                            scope.fireEvent('click', scope, node);
                        }
                    },
                    dblclick: function(node) {
                        if (node.id != 0) {
                            node.getUI().toggleCheck(true);
                            scope.fireEvent('dblclick', scope, node);
                        }
                    }
                });
                scope.btnReload.on({
                    scope: scope,
                    click: function() {
                        this.reload();
                    }
                });
                scope.busquedaAvanz.on('click', function() {
                    var position = scope.tpCCNAEOG.getPosition();
                    scope.tpCCNAEOG.loadMask(scope.etiquetas.wait);
                    scope.tpCCNAEOG.createWindowsSearch(scope, position[0] + ((scope.tpCCNAEOG.getSize().width - 310) / 2)); // creando la ventana 300 en el ancho del form panel
                    
                    scope.ventanaSearchCCNAE.on({
                        close: function() {
                            scope.fireEvent('searchClose', scope);
                        }
                    });
                    
                    scope.stEstadoSearchCCNAE.load({
                        callback: function() {
                            scope.tpCCNAEOG.mask.hide();
                            scope.ventanaSearchCCNAE.show();
                        }
                    });
                    EventosBuscar();
                });

                function EventosBuscar() {
                    scope.btnCancelarSearchCCNAE.on('click', function() {
                        scope.ventanaSearchCCNAE.close();
                    });
                    scope.btnAceptarSearchCCNAE.on('click', function() {
                        searchAction();
                    });
                    // eventos texfield codigo
                    scope.tfCodigoSearchCCNAE.on({
                        keypress: function(field, event) {
                            if (event.getKey() === event.ENTER && !Ext.isEmpty(field.getValue()))
                                searchAction();
                        },
                        keyup: function(field, event) {
                            if ((field.getValue().length > 0 || !Ext.isEmpty(scope.txaDescripcionSearchCCNAE.getValue()) || !Ext.isEmpty(scope.cbEstadoSearchCCNAE.getValue())) && scope.panelGestSearchCCNAE.getForm().isValid())
                                scope.btnAceptarSearchCCNAE.enable();
                            else
                                scope.btnAceptarSearchCCNAE.disable();
                        }
                    });
                    // eventos texfield descripcion
                    scope.txaDescripcionSearchCCNAE.on({
                        keypress: function(field, event) {
                            if (event.getKey() === event.ENTER && !Ext.isEmpty(field.getValue()))
                                searchAction();
                        },
                        keyup: function(field, event) {
                            if ((field.getValue().length > 0 || !Ext.isEmpty(scope.tfCodigoSearchCCNAE.getValue()) || !Ext.isEmpty(scope.cbEstadoSearchCCNAE.getValue())) && scope.panelGestSearchCCNAE.getForm().isValid())
                                scope.btnAceptarSearchCCNAE.enable();
                            else
                                scope.btnAceptarSearchCCNAE.disable();
                        }
                    });
                    scope.cbEstadoSearchCCNAE.on({
                        beforeselect: function(combo, record, index) {
                            if (combo.getValue() != record.data.idestado && scope.panelGestSearchCCNAE.getForm().isValid()) // cambio de seleccion
                                scope.btnAceptarSearchCCNAE.enable();
                        }
                    });
                }

                function searchAction() {
                    if (scope.panelGestSearchCCNAE.getForm().isValid()) {
                        if (scope.txaDescripcionSearchCCNAE.getValue() != '' || scope.tfCodigoSearchCCNAE.getValue() != '' || scope.cbEstadoSearchCCNAE.getValue() != '') {
                            var encode = Ext.encode({
                                descripcion: scope.txaDescripcionSearchCCNAE.getValue(),
                                concat: scope.tfCodigoSearchCCNAE.getValue(),
                                idestado: scope.cbEstadoSearchCCNAE.getValue()
                            });
                            scope.fFindNodesContained(encode);
                            scope.ventanaSearchCCNAE.close();
                        } else {
                            mostrarMensaje(1, scope.etiquetas.msgNotCriterioBuscar);
                        }
                    } else {
                        mostrarMensaje(1, scope.etiquetas.msgInvalidForm);
                    }
                }

                this.miMarcar.on('click', function() {
                    scope.fToggleCheck(scope.tpCCNAEOG.getSelectionModel().getSelectedNode(), true);
                });

                this.miDesmarcar.on('click', function() {
                    scope.fToggleCheck(scope.tpCCNAEOG.getSelectionModel().getSelectedNode(), false);
                });

                this.itemreload.on('click', function() {
                    var nodeSelected = scope.tpCCNAEOG.getSelectionModel().getSelectedNode();
                    if (nodeSelected.attributes.id == 0)
                        scope.reload();
                    else
                        scope.reload(nodeSelected.attributes.id);
                });

                this.on({
                    initialize: function() {
                        if (scope.renderIn != undefined) {
                            scope.tpCCNAEOG.setHeight(scope.renderIn.getSize().height);
                            scope.renderIn.on({
                                bodyresize: function(component, width, height) {
                                    if (height != undefined)
                                        scope.tpCCNAEOG.setHeight(height)
                                }
                            })
                            scope.renderIn.add(scope.tpCCNAEOG);
                            scope.renderIn.doLayout();
                        }
                    }
                });
            },
            initializeFunctions: function(scope) {
                scope.sfBuscar.fnOnSearch = function() {
                    if (!scope.busyRequest)
                        scope.fFindNodesContained(scope.sfBuscar.getRawValue());
                };
                scope.sfBuscar.fnOnClear = function() {
                    if (!scope.busyRequest)
                        scope.fLoadTreeLoader();
                };
                scope.fGetSelections = function() {
                    return (this.typeSelection == 0) ? this.tpCCNAEOG.getSelectionModel().getSelectedNode() : this.tpCCNAEOG.getChecked();
                };

                scope.reload = function(idnode) {
                    if (idnode) {
                        // actualizando un nodo en especifico
                        this.tpCCNAEOG.getLoader().load(this.tpCCNAEOG.getNodeById(idnode).parentNode, function(component, node) {
                            node.expand();
                            if (node.findChild("id", idnode))
                                node.findChild("id", idnode).expand();
                            scope.tpCCNAEOG.mask.hide();
                        });
                    } else {
                        // actualizando el nodo raiz
                        this.tpCCNAEOG.getLoader().load(this.tpCCNAEOG.getRootNode(), function() {
                            scope.tpCCNAEOG.mask.hide();
                        });
                        this.tpCCNAEOG.expandAll();
                    }
                };

                this.fFindNodesContained = function(filter) {
                    scope.tLoader.baseParams.filter = filter;
                    this.fLoadTreeLoader();
                };

                this.fLoadTreeLoader = function() {
                    scope.tLoader.load(scope.rootCCNAEOG, function() {
                        scope.tpCCNAEOG.mask.hide();
                        scope.rootCCNAEOG.expand();
                        scope.sfBuscar.focus(true);
                    });
                };

                this.fGetCountCheckedNodes = function(node, checked) {
                    count = 0;
                    node.cascade(function(n) {
                        if (n.attributes.checked == checked)
                            count++;
                    });
                    return count;
                };

                this.fGetCountNodes = function(node) {
                    count = 0;
                    node.cascade(function(n) {
                        if (n.attributes.checked == true || n.attributes.checked == false)
                            count++;
                    });
                    return count;
                };
                this.fToggleCheck = function(node, checked) {
                    node.cascade(function(n) {
                        if (n.attributes.checked == true || n.attributes.checked == false)
                            n.getUI().toggleCheck(checked);
                    });
                };
                this.unCheckByType = function(type) {
                    var selections = scope.fGetSelections();
                    Ext.each(selections, function(node, index, allitems) {
                        if (node.attributes.idtipo != type) {
                            node.getUI().toggleCheck(false);
                        }
                    });
                };
                this.hasDiferentType = function(type) {
                    var flag = false;
                    var selections = scope.fGetSelections();
                    if (scope.typeSelection != 0) {
                        if (selections.length > 0) {
                            var initType = (type) ? type : selections[0].attributes.idtipo;
                            Ext.each(selections, function(node, index, allitems) {
                                if (node.attributes.idtipo != initType) {
                                    flag = true;
                                    return false;
                                }
                            });
                        }
                    } else {
                        flag = (type && selections.attributes.idtipo != type) ? true : false;
                    }
                    return flag;
                };
                this.unCheckNode = function(node) {
                    scope.fToggleCheck(node, false);
                };
                this.hasSelection = function() {
                    var selections = scope.fGetSelections();
                    if (scope.typeSelection != 0) {
                        return (selections.length !== 0) ? true : false;
                    } else {
                        return (!Ext.isEmpty(selections)) ? true : false;
                    }
                };
                this.getTitle = function() {
                    return scope.rootText;
                };

                this.hasNodesHeredadosSelected = function() {
                    var selections = scope.fGetSelections();
                    for (var i = 0; i < selections.length; i++) {
                        if (selections[i].attributes.heredado) {
                            return true;
                        }
                    }
                    return false;
                };

                this.getTree = function() {
                    return scope.tpCCNAEOG;
                };
            }
        });

