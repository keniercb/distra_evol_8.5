Ext.namespace('Ext.Cont');
Ext.Cont.Cuentas = Ext.extend(Ext.Component,
    {
        constructor: function (params) {
            var scope = this;

            scope.url = '/contabilidad/contabilidad_financiera/cuentacontable/index.php/cuentas/';
            scope.perfil = window.parent.perfil;

            /**
             * 0 permite una sola selección(default)
             * 1 selección solo a nivel de hoja
             * 2 selección a cualquier nivel
             */
            scope.selectionType = 0;

            /** Filtrar por cuentas de
             * 8031 Ingresos
             * 8032 Gastos
             * 8033 Resultado
             * 8034 Orden
             * todas por default
             */
            scope.loadType = [8031, 8032, 8033, 8034];

            /**
             * variable a la que se le debe setear el componente donde la instancia se adicionará
             */
            scope.addIn = undefined;

            /**
             * levels = true, loadLeaf = false, carga las cuentas por niveles(default)
             * levels = false, loadLeaf = false, carga las cuentas nivel 1 que son padres
             * levels = false, loadLeaf = true, carga las cuentas hojas
             */
            scope.levels = true;

            scope.loadLeaf = false;

            Ext.apply(this, params || {});
            this.addEvents('initialize');

            Ext.Ajax.request({
                method: "POST",
                url: scope.url + "cargaretiquetas",
                callback: function (options, success, response) {
                    scope.etiquetas = Ext.decode(response.responseText);
                    if (!document.getElementById('Notification'))
                        scope.loadJs("/contabilidad/comun/componentes/Notification/js/Ext.Cont.Notification", 'Notification');
                    scope.loadCss(".x-tree-node a:hover,.x-dd-drag-ghost a:hover{color:black;font:bold 12px arial,tahoma,helvetica,sans-serif;}");
                    scope.tpCuentas = new Ext.Cont.UI.Cuentas(scope);
                    scope.initializeEvents(scope, params.allCuentas);
                    scope.initializeFunctions(scope);
                    scope.fireEvent('initialize', scope.tpCuentas);
                }
            });
            return Ext.Cont.Cuentas.superclass.constructor.call(scope);
        },
        loadJs: function (jsSrc, id) {
            if (jsSrc != null) {
                var tagScript = document.createElement("script");
                tagScript.setAttribute("type", "text/javascript");
                tagScript.setAttribute("id", id);
                tagScript.setAttribute("src", jsSrc + ".js");
                document.getElementsByTagName("body")[0].appendChild(tagScript);
            }
        },
        loadCss: function (css) {
            var tag = document.createElement("style");
            tag.type = "text/css";
            if (tag.styleSheet)
                tag.styleSheet.cssText = css;
            else
                tag.appendChild(document.createTextNode(css));
            document.getElementsByTagName("head")[0].appendChild(tag);
        },
        initializeEvents: function (scope, allCuentas) {
            scope.tlCuentas.on({
                beforeload: function (treeLoader, node) {
                    scope.tpCuentas.loadMask(scope.etiquetas.loading);
                    this.baseParams.levels = scope.levels;
                    this.baseParams.loadLeaf = scope.loadLeaf;
                    this.baseParams.selectionType = scope.selectionType;
                    this.baseParams.loadType = Ext.encode(scope.loadType);
                    this.baseParams.allCuentas = allCuentas;
                    scope.busyRequest = true;
                },
                load: function (object, node, response) {
                    scope.tpCuentas.mask.hide();
                    respuesta = Ext.decode(response.responseText);
                    if (respuesta.codigo) {
                        mostrarMensaje(1, respuesta.detalles);
                    } else {
                        scope.busyRequest = false;
                        this.baseParams = {};
                        if (!scope.rnCuentas.hasChildNodes()) {
                            if (scope.sfBuscarCuentas.getRawValue().length > 0) {
                                mostrarMensaje(1, scope.etiquetas.MsgInformacionNoDatos);
                            }
                            else {
                                scope.rnCuentas.setText(scope.etiquetas.MsgInformacionSinResultado);
//                                    mostrarMensaje(1, scope.etiquetas.MsgInformacionSinResultado);
                            }
                        }
                        else {
                            scope.rnCuentas.setText(scope.rootText ? scope.rootText : scope.etiquetas.rootText);
                        }
                        scope.tpCuentas.el.unmask();
                        scope.tpCuentas.menu.add(scope.miMarcar);
                        scope.tpCuentas.menu.add(scope.miDesmarcar);
                    }
                }
            });

            scope.tpCuentas.on({
                afterlayout: function (c) {
                    scope.sfBuscarCuentas.setWidth(scope.tbCuentas.el.getWidth() - 4);
                },
                checkchange: function (node, checked) {
                    if (checked)
                        node.select();
                    else
                        node.unselect();
                },
                contextmenu: function (node, e) {
                    if (!node.attributes.leaf && node.isExpanded()) {
                        node.select();
                        var count = scope.fGetCountNodes(node);
                        if (scope.fGetCountCheckedNodes(node, false) == count) {
                            scope.miMarcar.show();
                            scope.miDesmarcar.hide();
                        } else if (scope.fGetCountCheckedNodes(node, true) == count) {
                            scope.miMarcar.hide();
                            scope.miDesmarcar.show();
                        } else {
                            scope.miMarcar.show();
                            scope.miDesmarcar.show();
                        }
                        this.menu.showAt(e.getXY());
                    }
                }
            })

            scope.sfBuscarCuentas.on({
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER) {
                        scope.sfBuscarCuentas.onTrigger2Click();
                    }
                }
            })

            this.miMarcar.on('click', function () {
                scope.fToggleCheck(scope.tpCuentas.getSelectionModel().getSelectedNode(), true);
            });

            this.miDesmarcar.on('click', function () {
                scope.fToggleCheck(scope.tpCuentas.getSelectionModel().getSelectedNode(), false);
            });

            this.on({
                initialize: function () {
                    if (scope.addIn != undefined) {
                        scope.tpCuentas.setHeight(scope.addIn.getSize().height);
                        scope.addIn.on({
                            bodyresize: function (component, width, height) {
                                if (height != undefined)
                                    scope.tpCuentas.setHeight(height)
                            }
                        })
                        scope.addIn.add(scope.tpCuentas);
                        scope.addIn.doLayout();
                    }
                }
            })
        },
        initializeFunctions: function (scope) {
            scope.fGetSelections = function () {
                return (this.selectionType == 0) ? this.tpCuentas.getSelectionModel().getSelectedNode() : this.tpCuentas.getChecked();
            }

            scope.sfBuscarCuentas.onTrigger1Click = function () {
                if (this.hasSearch) {
                    this.hasSearch = false;
                    this.reset();
                    scope.sfBuscarCuentas.triggers[0].hide();
                    if (!scope.busyRequest)
                        scope.fLoadTreeLoader();
                }
            }

            scope.sfBuscarCuentas.onTrigger2Click = function () {
                if (scope.sfBuscarCuentas.getRawValue().length < 1)
                    scope.sfBuscarCuentas.onTrigger1Click();
                else {
                    this.hasSearch = true;
                    scope.sfBuscarCuentas.triggers[0].show();
                    if (!scope.busyRequest)
                        scope.fFindNodesContained(scope.sfBuscarCuentas.getRawValue())
                }
            }

            this.fFindNodesContained = function (filter) {
                scope.tlCuentas.baseParams.filter = filter;
                this.fLoadTreeLoader();
            }

            this.fLoadTreeLoader = function () {
                scope.tpCuentas.loadMask(scope.etiquetas.msgFiltrando);
                scope.tlCuentas.load(scope.rnCuentas, function () {
                    scope.tpCuentas.mask.hide();
                    scope.rnCuentas.expand();
                    scope.sfBuscarCuentas.focus(true);
                });
            }

            this.fGetCountCheckedNodes = function (node, checked) {
                var count = 0;
                node.cascade(function (n) {
                    if (n.attributes.checked == checked)
                        count++;
                })
                return count;
            }

            this.fGetCountNodes = function (node) {
                var count = 0;
                node.cascade(function (n) {
                    if (n.attributes.checked == true || n.attributes.checked == false)
                        count++;
                })
                return count;
            }
            this.fToggleCheck = function (node, checked) {
                node.cascade(function (n) {
                    if (n.attributes.checked == true || n.attributes.checked == false)
                        n.getUI().toggleCheck(checked);
                })
            }
            this.fReload = function (idnode) {
                scope.tpCuentas.loadMask("Recargando...");
                if (idnode) {
                    // actualizando un nodo en especifico
                    this.tpCuentas.getLoader().load(this.tpCuentas.getNodeById(idnode).parentNode, function (component, node) {
                        node.expand();
                        node.findChild("id", idnode).expand();
                        scope.tpCuentas.mask.hide();
                    });
                } else {
                    // actualizando el nodo raiz
                    this.tpCuentas.getLoader().load(this.tpCuentas.getRootNode(), function () {
                        scope.tpCuentas.mask.hide();
                    });
                    this.tpCuentas.expandAll();
                }
            }
        }
    })