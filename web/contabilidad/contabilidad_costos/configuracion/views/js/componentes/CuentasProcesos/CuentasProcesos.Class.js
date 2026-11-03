Ext.namespace('Ext.Costo.Procesos.Configuracion.Componentes')
Ext.Costo.Procesos.Configuracion.Componentes.CuentasProcesos = Ext.extend(Ext.Component,
    {
        constructor: function (params) {
            var scope = this;
            scope.url = '/contabilidad/contabilidad_costos/configuracion/index.php/cuentasprocesos/';
            scope.method = 'loadDataComponent';

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
             * Define el componente donde se va a renderizar
             */
            scope.renderIn = undefined;

            Ext.apply(this, params || {});
            scope.addEvents('initialize');
            scope.addEvents('load');
            scope.addEvents('buscar');
            scope.addEvents('limpiar');
            scope.addEvents('beforeload');
            // cargar el componente cuentas
            if (!document.getElementById('Cuentas.Class')) {
                scope.loadJs("/contabilidad/contabilidad_financiera/componentes/Nucleos/Cuentas/Cuentas.Class", 'Cuentas.Class');
            }
            if (!document.getElementById('Cuentas.UI')) {
                scope.loadJs("/contabilidad/contabilidad_financiera/componentes/Nucleos/Cuentas/Cuentas.UI", 'Cuentas.UI');
            }

            Ext.Ajax.request({
                method: "POST",
                url: this.url + "cargaretiquetas",
                callback: function (options, success, response) {
                    scope.etiquetas = Ext.decode(response.responseText);
                    if (!document.getElementById('Notification') && scope.loadHelpersFiles)
                        scope.loadJs("/contabilidad/comun/componentes/Notification/js/Ext.Cont.Notification", 'Notification');
                    if (scope.loadHelpersFiles)
                        scope.loadCss(".x-tree-node a:hover,.x-dd-drag-ghost a:hover{color:black;font:bold 12px arial,tahoma,helvetica,sans-serif;}");
                    scope.treePanel = new Ext.Costo.Procesos.Configuracion.Componentes.UI.CuentasProcesos(scope);
                    scope.initializeEvents(scope);
                    scope.initializeFunctions(scope);
                    scope.fireEvent('initialize', scope, scope.treePanel);
                }
            });

            return Ext.Costo.Procesos.Configuracion.Componentes.CuentasProcesos.superclass.constructor.call(this);
        },
        loadJs: function (jsSrc, id) {
            if (jsSrc != null) {
                var tagScript = document.createElement("script");
                tagScript.setAttribute("type", "text/javascript");
                tagScript.setAttribute("id", id);
                tagScript.setAttribute("src", jsSrc + ".js");
                Ext.DomQuery.selectNode("body").appendChild(tagScript);
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
        initializeEvents: function (scope) {
            scope.tLoader.on({
                beforeload: function (treeLoader, node) {
                    scope.treePanel.loadMask(scope.etiquetas.loading);
                    this.baseParams.typeSelection = scope.typeSelection;
                    scope.busyRequest = true;
                    scope.fireEvent('beforeload', treeLoader, node);
                },
                load: function (object, node, callback) {
                    scope.treePanel.mask.hide();
                    scope.busyRequest = false;
                    var msg = (this.baseParams.filter) ? scope.etiquetas.MsgInformacionSinResultadoSearch : scope.etiquetas.MsgInformacionSinResultado;
                    this.baseParams = {};
                    if (!scope.rootNode.hasChildNodes())
                        mostrarMensaje(1, msg);
                    scope.treePanel.el.unmask();
                    scope.menu.add(scope.itemreload);
                    scope.fireEvent('load', object, node, callback);
                }
            });

            scope.treePanel.on({
                afterlayout: function (c) {
                    scope.sfBuscar.setWidth(scope.toolbar.el.getWidth() - 4);
                },
                checkchange: function (node, checked) {
                    if (checked)
                        node.select();
                    else
                        node.unselect();
                },
                contextmenu: function (node, e) {
                    if (node.attributes.leaf) {
                        node.select();
                        scope.itemreload.show();
                        scope.menu.showAt(e.getXY());
                    }
                },
                click: function (node, e) {
                    // aki se comprueba lo del eliminar
                    if (node.id != 0) {
                        node.select();
                    } else {
                        scope.fToggleCheck(scope.treePanel.getSelectionModel().getSelectedNode(), false);
                    }
                }
            });

            /*scope.sfBuscar.on({
             specialkey: function(f, e) {
             if (e.getKey() == e.ENTER) {
             this.onTrigger2Click();
             }
             }
             });*/

            this.miMarcar.on('click', function () {
                scope.fToggleCheck(scope.treePanel.getSelectionModel().getSelectedNode(), true);
            });

            this.miDesmarcar.on('click', function () {
                scope.fToggleCheck(scope.treePanel.getSelectionModel().getSelectedNode(), false);
            });
            // Implementar la funcion de eliminar mediante click derecho
            this.itemreload.on('click', function () {
                scope.reload();
            });

            this.on({
                initialize: function () {
                    if (scope.renderIn != undefined) {
                        scope.treePanel.setHeight(scope.renderIn.getSize().height);
                        scope.renderIn.on({
                            bodyresize: function (component, width, height) {
                                if (height != undefined)
                                    scope.treePanel.setHeight(height)
                            }
                        })
                        scope.renderIn.add(scope.treePanel);
                        scope.renderIn.doLayout();
                    }
                }
            });
        },
        initializeFunctions: function (scope) {
            scope.sfBuscar.fnOnSearch = function () {
                if (!scope.busyRequest)
                    scope.fFindNodesContained(scope.sfBuscar.getRawValue());
            }
            scope.sfBuscar.fnOnClear = function () {
                if (!scope.busyRequest)
                    scope.fLoadTreeLoader();
            }
            scope.fGetSelections = function () {
                return (this.typeSelection == 0) ? this.treePanel.getSelectionModel().getSelectedNode() : this.treePanel.getChecked();
            };

            scope.reload = function (idnode) {
                if (idnode) {
                    // actualizando un nodo en especifico
                    this.treePanel.getLoader().load(this.treePanel.getNodeById(idnode).parentNode, function (component, node) {
                        node.expand();
                        node.findChild("id", idnode).expand();
                        scope.treePanel.mask.hide();
                    });
                } else {
                    // actualizando el nodo raiz
                    this.treePanel.getLoader().load(this.treePanel.getRootNode(), function () {
                        scope.treePanel.mask.hide();
                    });
                    this.treePanel.expandAll();
                }
            };

            /*scope.sfBuscar.onTrigger1Click = function() {
             if (scope.sfBuscar.hasSearch) {
             scope.sfBuscar.el.dom.value = '';
             scope.sfBuscar.hasSearch = false;
             scope.sfBuscar.triggers[0].hide();
             if (!scope.busyRequest)
             scope.fLoadTreeLoader();
             }
             };

             scope.sfBuscar.onTrigger2Click = function()
             {
             if (scope.sfBuscar.getRawValue().length < 1)
             this.onTrigger1Click();
             else
             {
             scope.sfBuscar.hasSearch = true;
             scope.sfBuscar.triggers[0].show();
             if (!scope.busyRequest)
             scope.fFindNodesContained(scope.sfBuscar.getRawValue());
             }
             };*/

            this.fFindNodesContained = function (filter) {
                scope.tLoader.baseParams.filter = filter;
                this.fLoadTreeLoader();
            };

            this.fLoadTreeLoader = function () {
                scope.tLoader.load(scope.rootNode, function () {
                    scope.treePanel.mask.hide();
                    scope.rootNode.expand();
                    scope.sfBuscar.focus(true);
                });
            };

            this.fGetCountCheckedNodes = function (node, checked) {
                count = 0;
                node.cascade(function (n) {
                    if (n.attributes.checked == checked)
                        count++;
                });
                return count;
            };

            this.fGetCountNodes = function (node) {
                count = 0;
                node.cascade(function (n) {
                    if (n.attributes.checked == true || n.attributes.checked == false)
                        count++;
                });
                return count;
            };
            this.fToggleCheck = function (node, checked) {
                node.cascade(function (n) {
                    if (n.attributes.checked == true || n.attributes.checked == false) {
                        n.getUI().toggleCheck(checked);
                    }
                });
                node.unselect();
            };
        }
    });

