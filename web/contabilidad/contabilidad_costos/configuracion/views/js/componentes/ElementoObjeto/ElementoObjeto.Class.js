Ext.namespace('Ext.Costo.Procesos.Nomencladores.Componentes');
Ext.Costo.Procesos.Nomencladores.Componentes.CCEOG = Ext.extend(Ext.Component,
        {
            constructor: function(params) {
                var scope = this;
                scope.url = '/contabilidad/contabilidad_costos/configuracion/index.php/elementoobjeto/';
                scope.method = 'loadDataComponent';
                scope.extending = 0;
                /**
                 * Define si es necesario cargar los js y css necesarios para el componentes notifico
                 */
                scope.loadHelpersFiles = true;
                scope.perfil = window.parent.perfil;
                /**
                 * Define si se va mostrar el boton de busqueda avanzada y el recargar
                 */
                scope.hideSearch = false;
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
                scope.rootText = "<b>ELEMENTOS Y OBJETOS DE GASTO</b>";
                scope.longitudTotal = 20;

                Ext.apply(this, params || {});
                this.addEvents('initialize');
                scope.addEvents('checkchange');
                scope.addEvents('click');
                scope.addEvents('dblclick');
                scope.addEvents('load');
                scope.addEvents('searchClose');

                var scope = this;
                scope.loadJs("/contabilidad/comun/js/Ext.Cont.SearchField", 'SearchField');
                scope.loadCss(".inactivo a span{cursor: not-allowed;color:#8d8d8d !important;font-style:italic;font-weight:bold;}");
                Ext.Ajax.request({
                    method: "POST",
                    url: this.url + "cargaretiquetas",
                    callback: function(options, success, response) {
                        scope.etiquetas = Ext.decode(response.responseText);
                        scope.rootText = (scope.types.length == 2) ? scope.etiquetas.rootText : ((scope.types[0] == 1) ? scope.etiquetas.rootTextElementos : scope.etiquetas.rootTextObjetos);
                        if (!document.getElementById('Notification') && scope.loadHelpersFiles)
                            scope.loadJs("/contabilidad/comun/componentes/Notification/js/Ext.Cont.Notification", 'Notification');
                        if (scope.loadHelpersFiles)
                            scope.loadCss(".x-tree-node a:hover,.x-dd-drag-ghost a:hover{color:black;font:bold 12px arial,tahoma,helvetica,sans-serif;}");

                        scope.tpCCEOG = new Ext.Costo.Procesos.Nomencladores.Componentes.UI.CCEOG(scope);
                        scope.initializeEvents(scope);
                        scope.initializeFunctions(scope);
                        scope.fireEvent('initialize', scope, scope.tpCCEOG);
                    }
                });

                return Ext.Costo.Procesos.Nomencladores.Componentes.CCEOG.superclass.constructor.call(this);
            },
            loadJs: function(jsSrc, id) {
                if (jsSrc != null) {
                    var tagScript = document.createElement("script");
                    tagScript.setAttribute("type", "text/javascript");
                    tagScript.setAttribute("id", id);
                    tagScript.setAttribute("src", jsSrc + ".js");
                    document.getElementsByTagName("body")[0].appendChild(tagScript);
                }
            },
            loadCss: function(css) {
                var tag = document.createElement("style");
                tag.type = "text/css";
                tag.rel = "stylesheet";
                if (tag.styleSheet)
                    tag.styleSheet.cssText = css;
                else
                    tag.appendChild(document.createTextNode(css));
                document.getElementsByTagName("head")[0].appendChild(tag);
            },
            initializeEvents: function(scope) {
                scope.tLoaderEOG.on({
                    beforeload: function(treeLoader, node) {
                        scope.tpCCEOG.loadMask(scope.etiquetas.loading);
                        this.baseParams.typeSelection = scope.typeSelection;
                        this.baseParams.type = Ext.encode(scope.types);
                        this.baseParams.extending = scope.extending;
                        scope.busyRequest = true;
                        scope.rootText = (scope.types.length == 2) ? scope.etiquetas.rootText : ((scope.types[0] == 1) ? scope.etiquetas.rootTextElementos : scope.etiquetas.rootTextObjetos);
                        scope.rootCCEOG.setText(scope.rootText.toUpperCase());
                    },
                    load: function(object, node, callback) {
                        scope.tpCCEOG.mask.hide();
                        if (callback.responseText == -1) {
                            
                            mostrarMensaje(1, scope.etiquetas.msgEntidadRectora);
                            
                            var tieneHijos = (scope.rootCCEOG.childNodes.length == 0) ? false : true;
                            scope.fireEvent('load', scope, tieneHijos, true);
                            
                        } else {
                            scope.busyRequest = false;
                            var msg = (this.baseParams.filter) ? scope.etiquetas.MsgInformacionSinResultadoSearch : scope.etiquetas.MsgInformacionSinResultado;
                            this.baseParams = {};
                            
                            var tieneHijos = (scope.rootCCEOG.childNodes.length == 0) ? false : true;
                            if (!tieneHijos) {
                                mostrarMensaje(1, msg);
                                
                                scope.fireEvent('load', scope, tieneHijos);
                                
                            } else {
                                if (scope.tpCCEOG.getRootNode().firstChild.attributes.longitudconcat)
                                    scope.longitudTotal = scope.tpCCEOG.getRootNode().firstChild.attributes.longitudconcat;
                                scope.fireEvent('load', scope, scope.rootCCEOG.hasChildNodes());
                            }
                            scope.tpCCEOG.el.unmask();
                            if (scope.menuEOG.items.length == 0) {
                                scope.menuEOG.add(scope.itemreload);
                                scope.menuEOG.add(scope.miMarcar);
                                scope.menuEOG.add(scope.miDesmarcar);
                            }
                        }
                        if (node.childNodes) {
                            var nodoshijos = node.childNodes;
                            var length = nodoshijos.length;
                            for (var i = 0; i < length; i++) {
                                if (nodoshijos[i].attributes.directivo == true) {
                                    nodoshijos[i].getUI().addClass('letrazul');
                                } else if (nodoshijos[i].attributes.idestado == 2) {
                                    nodoshijos[i].getUI().addClass('inactivo');
                                }
                            }
                        }
                    }
                });

                scope.tpCCEOG.on({
                    afterlayout: function(c) {
                        scope.hideSearch ? scope.sfBuscarEOG.setWidth(scope.toolbarEOG.el.getWidth() - 4) : scope.sfBuscarEOG.setWidth(scope.toolbarEOG.el.getWidth() - 165);
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
                        scope.menuEOG.showAt(e.getXY());
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

                scope.busquedaAvanzEOG.on('click', function() {
                    var position = scope.tpCCEOG.getPosition();
                    scope.tpCCEOG.loadMask(scope.etiquetas.wait);
                    scope.tpCCEOG.createWindowsSearch(scope, position[0] + ((scope.tpCCEOG.getSize().width - 310) / 2));
                    
                    scope.ventanaSearch.on({
                        close: function() {
                            scope.fireEvent('searchClose', scope);
                        }
                    });
                    
                    scope.stEstadoSearch.load({
                        callback: function() {
                            scope.tpCCEOG.mask.hide();
                            scope.ventanaSearch.show();
                        }
                    });
                    EventroBuscar();
                });
                function EventroBuscar() {
                    scope.btnCancelarSearch.on('click', function() {
                        scope.ventanaSearch.close();
                    });
                    scope.btnAceptarSearch.on('click', function() {
                        searchAction();
                    });
                    // eventos texfield codigo
                    scope.tfCodigoSearch.on({
                        keypress: function(field, event) {
                            if (event.getKey() === event.ENTER && !Ext.isEmpty(field.getValue()))
                                searchAction();
                        },
                        keyup: function(field, event) {
                            if ((field.getValue().length > 0 || !Ext.isEmpty(scope.txaDescripcionSearch.getValue()) || !Ext.isEmpty(scope.cbEstadoSearch.getValue())) && scope.panelGestSearch.getForm().isValid())
                                scope.btnAceptarSearch.enable();
                            else
                                scope.btnAceptarSearch.disable();
                        }
                    });
                    // eventos texfield descripcion
                    scope.txaDescripcionSearch.on({
                        keypress: function(field, event) {
                            if (event.getKey() === event.ENTER && !Ext.isEmpty(field.getValue()))
                                searchAction();
                        },
                        keyup: function(field, event) {
                            if ((field.getValue().length > 0 || !Ext.isEmpty(scope.tfCodigoSearch.getValue()) || !Ext.isEmpty(scope.cbEstadoSearch.getValue())) && scope.panelGestSearch.getForm().isValid())
                                scope.btnAceptarSearch.enable();
                            else
                                scope.btnAceptarSearch.disable();
                        }
                    });
                    scope.cbEstadoSearch.on({
                        beforeselect: function(combo, record, index) {
                            if (combo.getValue() != record.data.idestado && scope.panelGestSearch.getForm().isValid()) // cambio de seleccion
                                scope.btnAceptarSearch.enable();
                        }
                    });
                }

                function searchAction() {
                    if (scope.panelGestSearch.getForm().isValid()) {
                        if (scope.txaDescripcionSearch.getValue() != '' || scope.tfCodigoSearch.getValue() != '' || scope.cbEstadoSearch.getValue() != '') {
                            var encode = Ext.encode({
                                descripcion: scope.txaDescripcionSearch.getValue(),
                                concat: scope.tfCodigoSearch.getValue(),
                                idestado: scope.cbEstadoSearch.getValue()
                            });
                            scope.fFindNodesContained(encode);
                            scope.ventanaSearch.close();
                        } else {
                            mostrarMensaje(1, scope.etiquetas.msgNotCriterioBuscar);
                        }
                    } else {
                        mostrarMensaje(1, scope.etiquetas.msgInvalidForm);
                    }
                }

                this.miMarcar.on('click', function() {
                    scope.fToggleCheck(scope.tpCCEOG.getSelectionModel().getSelectedNode(), true);
                });

                this.miDesmarcar.on('click', function() {
                    scope.fToggleCheck(scope.tpCCEOG.getSelectionModel().getSelectedNode(), false);
                });

                this.itemreload.on('click', function() {
                    var nodeSelected = scope.tpCCEOG.getSelectionModel().getSelectedNode();
                    if (nodeSelected.attributes.id == 0)
                        scope.reload();
                    else
                        scope.reload(nodeSelected.attributes.id);
                });

                this.on({
                    initialize: function() {
                        if (scope.renderIn != undefined) {
                            scope.tpCCEOG.setHeight(scope.renderIn.getSize().height);
                            scope.renderIn.on({
                                bodyresize: function(component, width, height) {
                                    if (height != undefined)
                                        scope.tpCCEOG.setHeight(height)
                                }
                            })
                            scope.renderIn.add(scope.tpCCEOG);
                            scope.renderIn.doLayout();
                        }
                    }
                });
                this.validaFormulario = function() {
                    flag = true;
                    if (!view.panelGest.getForm().isValid())
                        flag = false;
                    return flag;
                }
            },
            initializeFunctions: function(scope) {
                scope.sfBuscarEOG.fnOnSearch = function() {
                    if (!scope.busyRequest)
                        scope.fFindNodesContained(scope.sfBuscarEOG.getRawValue());
                }
                scope.sfBuscarEOG.fnOnClear = function() {
                    if (!scope.busyRequest)
                        scope.fLoadTreeLoader();
                }
                scope.fGetSelections = function() {
                    return (this.typeSelection == 0) ? this.tpCCEOG.getSelectionModel().getSelectedNode() : this.tpCCEOG.getChecked();
                };
                scope.reload = function(idnode) {
                    if (idnode) {
                        // actualizando un nodo en especifico
                        // Mando a recargar le padre y luego a expandir el hijo que se selecciono
                        this.tpCCEOG.getLoader().load(this.tpCCEOG.getNodeById(idnode).parentNode, function(component, node) {
                            node.expand();
                            if (node.findChild("id", idnode))
                                node.findChild("id", idnode).expand();
                            scope.tpCCEOG.mask.hide();
                        });
                    } else {
                        // actualizando el nodo raiz
                        this.tpCCEOG.getLoader().load(this.tpCCEOG.getRootNode(), function() {
                            scope.tpCCEOG.mask.hide();
                        });
                        this.tpCCEOG.expandAll();
                    }
                };

                this.fFindNodesContained = function(filter) {
                    scope.tLoaderEOG.baseParams.filter = filter;
                    this.fLoadTreeLoader();
                };

                this.fLoadTreeLoader = function() {
                    scope.tLoaderEOG.load(scope.rootCCEOG, function() {
                        scope.tpCCEOG.mask.hide();
                        scope.rootCCEOG.expand();
                        scope.sfBuscarEOG.focus(true);
                    });
                };

                this.fGetCountCheckedNodes = function(node, checked) {
                    count = 0;
                    node.cascade(function(n) {
                        if (n.attributes.checked == checked)
                            count++;
                    })
                    return count;
                };

                this.fGetCountNodes = function(node) {
                    count = 0;
                    node.cascade(function(n) {
                        if (n.attributes.checked == true || n.attributes.checked == false)
                            count++;
                    })
                    return count;
                };

                this.fToggleCheck = function(node, checked) {
                    node.cascade(function(n) {
                        if (n.attributes.checked == true || n.attributes.checked == false)
                            n.getUI().toggleCheck(checked);
                    })
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

                this.getTitle = function(node) {
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
                    return scope.tpCCEOG;
                };
            }
        });

