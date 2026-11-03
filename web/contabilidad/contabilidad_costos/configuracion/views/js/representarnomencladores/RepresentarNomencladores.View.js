Ext.ns('Costo.Procesos.Nomencladores');
Costo.Procesos.Nomencladores.View = {
    init: function(perfil, etiquetas, esRectora) {
        var scope = this;
        this.loadMessageBox = function() {
            Ext.MessageBox.show({
                title: etiquetas.lbMsgEspere,
                msg: etiquetas.msgLoading,
                width: 300,
                progress: true,
                closable: false
            });
            var f = function(v) {
                return function() {
                    var i = v / 11;
                    Ext.MessageBox.updateProgress(i);
                };
            };
            for (var i = 1; i < 12; i++) {
                setTimeout(f(i), i * 500);
            }
        };
        scope.loadMessageBox();
        
        this.lcodigo = new Ext.form.Label({
            id: 'lcodigo',
            width: '100%',
            text: etiquetas.lbCodigo
        });

        this.ldescripcion = new Ext.form.Label({
            id: 'ldescripcion',
            width: '100%',
            text: etiquetas.lbDescripcion
        });

        this.lactivo = new Ext.form.Label({
            id: 'lactivo',
            width: '100%',
            text: etiquetas.lbActivo
        });

        this.ldirectivo = new Ext.form.Label({
            id: 'ldirectivo',
            width: '100%',
            text: etiquetas.lbDirectivo
        });

        this.lcta = new Ext.form.Label({
            id: 'lcta',
            width: '100%',
            text: etiquetas.lbCta
        });

        this.panelAct = new Ext.form.FormPanel({
            id: 'idpanelAct',
            layout: 'border',
            items: [{
                    id: 'pepfghe'
                }]
        });

        this.arbol = new Ext.tree.TreePanel({
            region: 'center',
            split: true,
            title: etiquetas.lbTitArbol,
            width: 250,
            margins: '3 0 0 3',
            autoScroll: true,
            rootVisible: false,
            border: false,
            frame: false,
            root: new Ext.tree.TreeNode({
                draggable: false,
                expanded: true,
                id: '0'
            })
        });
        var aux = this;
        this.arbol.getRootNode().appendChild([new Ext.tree.TreeNode({
                text: etiquetas.lbTitNodoCentro,
                id: 'idcentro',
                listeners: {
                    'click': function(nodo, evento) {
                        aux.panelgest.setTitle(etiquetas.lbTitPanelGestionCentro);
                        scope.clearDetalles();
                        var objeto = new Costo.Procesos.Nomencladores.GestCCNAE.View({
                            type: '1',
                            etiquetas: etiquetas
                        });

                        new Ext.Costo.Procesos.Nomencladores.Componentes.CCNAE({
                            id: 'ccnae',
                            typeSelection: 2,
                            types: [1]
                        }).on({
                            initialize: function(componentClass, componentUI) {
                                componentClass.tLoader.on({
                                    beforeload: function(loader, node, callback) {
                                        Ext.ComponentMgr.get('btnMod').disable();
                                        Ext.ComponentMgr.get('btnEli').disable();
                                        scope.clearDetalles();
                                    }
                                });
                                componentUI.on({
                                    checkchange: function(node, checked) {
                                        if (checked) {
                                            scope.mostrarDetalles({
                                                codigo: node.attributes.codigo,
                                                descripcion: node.attributes.descripcion,
                                                activo: node.attributes.activo,
                                                nomcta: node.attributes.nomcta
                                            });
                                            Ext.ComponentMgr.get('btnMod').setDisabled(componentClass.fGetSelections().length > 1 ||
                                                    componentClass.hasNodesHeredadosSelected());
                                            Ext.ComponentMgr.get('btnAdic').setDisabled(componentClass.fGetSelections().length > 1
                                                    || parseInt(node.attributes.nivel) >= node.attributes.nivelespermitidos
                                                    || node.attributes.idestado == 2);
                                            Ext.ComponentMgr.get('btnEli').enable();
                                        } else {
                                            Ext.ComponentMgr.get('btnMod').setDisabled(componentClass.fGetSelections().length !== 1
                                                    || componentClass.hasNodesHeredadosSelected());
                                            Ext.ComponentMgr.get('btnAdic').setDisabled(componentClass.fGetSelections().length > 1);
                                            Ext.ComponentMgr.get('btnEli').setDisabled(componentClass.fGetSelections().length === 0);
                                            if (componentClass.fGetSelections().length === 0) {
                                                scope.clearDetalles();
                                            } else {
                                                var selections = componentClass.fGetSelections();
                                                scope.mostrarDetalles({
                                                    codigo: selections[selections.length - 1].attributes.codigo,
                                                    descripcion: selections[selections.length - 1].attributes.descripcion,
                                                    activo: selections[selections.length - 1].attributes.activo,
                                                    nomcta: selections[selections.length - 1].attributes.nomcta
                                                });
                                                selections[selections.length - 1].select();
                                            }
                                        }
                                    },
                                    click: function(node) {
                                        if (node.id != 0) {

                                            Ext.ComponentMgr.get('btnAdic').setDisabled(parseInt(node.attributes.nivel) >= node.attributes.nivelespermitidos
                                                    || node.attributes.idestado == 2);
                                            scope.mostrarDetalles({
                                                codigo: node.attributes.codigo,
                                                descripcion: node.attributes.descripcion,
                                                activo: node.attributes.activo,
                                                nomcta: node.attributes.nomcta
                                            });
                                        }
                                    },
                                    dblclick: function(node) {
                                        if (node.id != 0) {
                                            scope.mostrarDetalles({
                                                codigo: node.attributes.codigo,
                                                descripcion: node.attributes.descripcion,
                                                activo: node.attributes.activo,
                                                nomcta: node.attributes.nomcta
                                            });

                                            Ext.ComponentMgr.get('btnAdic').setDisabled(parseInt(node.attributes.nivel) >= node.attributes.nivelespermitidos
                                                    || node.attributes.idestado == 2);
                                        }
                                    }
                                });
                                componentUI.setHeight(objeto.getSize().height);
                                objeto.insert(0, componentUI);
                                objeto.doLayout(true);
                                objeto.crearMapadeTeclas();
                                objeto.btnAdicionar.focus();
                            },
                            searchClose: function() {
                                objeto.keys.enable();
                                objeto.btnAdicionar.focus();
                            }
                        });

                        aux.panelgest.insert(0, objeto);

                        var list = aux.panelgest.items.items;
                        for (var i = 0; i < list.length; i++)
                            if (list[i].getId() != objeto.getId())
                                aux.panelgest.remove(list[i]);

                        aux.panelgest.expand();
                        aux.panelgest.doLayout(true);
                    }
                }
            }), new Ext.tree.TreeNode({
                text: etiquetas.lbTitNodoNivel,
                id: 'idnae',
                listeners: {
                    'click': function(nodo, evento) {
                        aux.panelgest.setTitle(etiquetas.lbTitPanelGestionNivel);
                        scope.clearDetalles();
                        var objeto = new Costo.Procesos.Nomencladores.GestCCNAE.View({
                            type: '2',
                            etiquetas: etiquetas
                        });

                        new Ext.Costo.Procesos.Nomencladores.Componentes.CCNAE({
                            id: 'ccnae',
                            typeSelection: 2,
                            types: [2]
                        }).on({
                            initialize: function(componentClass, componentUI) {
                                componentClass.tLoader.on({
                                    beforeload: function(loader, node, callback) {
                                        Ext.ComponentMgr.get('btnMod').disable();
                                        Ext.ComponentMgr.get('btnEli').disable();
                                        scope.clearDetalles();
                                    }
                                });
                                componentUI.on({
                                    checkchange: function(node, checked) {
                                        if (checked) {
                                            scope.mostrarDetalles({
                                                codigo: node.attributes.codigo,
                                                descripcion: node.attributes.descripcion,
                                                activo: node.attributes.activo
                                            });
                                            Ext.ComponentMgr.get('btnMod').setDisabled(componentClass.fGetSelections().length > 1 ||
                                                    componentClass.hasNodesHeredadosSelected());
                                            Ext.ComponentMgr.get('btnAdic').setDisabled(componentClass.fGetSelections().length > 1
                                                    || parseInt(node.attributes.nivel) >= node.attributes.nivelespermitidos
                                                    || node.attributes.idestado == 2);
                                            Ext.ComponentMgr.get('btnEli').enable();
                                        } else {
                                            Ext.ComponentMgr.get('btnMod').setDisabled(componentClass.fGetSelections().length !== 1 ||
                                                    componentClass.hasNodesHeredadosSelected());
                                            Ext.ComponentMgr.get('btnAdic').setDisabled(componentClass.fGetSelections().length > 1);
                                            Ext.ComponentMgr.get('btnEli').setDisabled(componentClass.fGetSelections().length === 0);
                                            if (componentClass.fGetSelections().length === 0) {
                                                scope.clearDetalles();
                                            } else {
                                                var selections = componentClass.fGetSelections();
                                                scope.mostrarDetalles({
                                                    codigo: selections[selections.length - 1].attributes.codigo,
                                                    descripcion: selections[selections.length - 1].attributes.descripcion,
                                                    activo: selections[selections.length - 1].attributes.activo
                                                });
                                                selections[selections.length - 1].select();
                                            }
                                        }
                                    },
                                    click: function(node) {
                                        if (node.id != 0) {
                                            scope.mostrarDetalles({
                                                codigo: node.attributes.codigo,
                                                descripcion: node.attributes.descripcion,
                                                activo: node.attributes.activo
                                            });

                                            Ext.ComponentMgr.get('btnAdic').setDisabled(parseInt(node.attributes.nivel) >= node.attributes.nivelespermitidos
                                                    || node.attributes.idestado == 2);
                                        }
                                    },
                                    dblclick: function(node) {
                                        if (node.id != 0) {
                                            scope.mostrarDetalles({
                                                codigo: node.attributes.codigo,
                                                descripcion: node.attributes.descripcion,
                                                activo: node.attributes.activo
                                            });

                                            Ext.ComponentMgr.get('btnAdic').setDisabled(parseInt(node.attributes.nivel) >= node.attributes.nivelespermitidos
                                                    || node.attributes.idestado == 2);
                                        }
                                    }
                                });
                                componentUI.setHeight(objeto.getSize().height);
                                objeto.insert(0, componentUI);
                                objeto.doLayout(true);
                                objeto.crearMapadeTeclas();
                                objeto.btnAdicionar.focus();
                            },
                            searchClose: function() {
                                objeto.keys.enable();
                                objeto.btnAdicionar.focus();
                            }
                        });

                        aux.panelgest.insert(0, objeto);

                        var list = aux.panelgest.items.items;
                        for (var i = 0; i < list.length; i++)
                            if (list[i].getId() != objeto.getId())
                                aux.panelgest.remove(list[i]);

                        aux.panelgest.expand();
                        aux.panelgest.doLayout(true);
                    }
                }
            }), new Ext.tree.TreeNode({
                text: etiquetas.lbTitNodoElemento,
                id: 'idelemento',
                listeners: {
                    'click': function(nodo, evento) {
                        aux.panelgest.setTitle(etiquetas.lbTitPanelGestionElemento);
                        scope.clearDetalles();
                        var objeto = new Costo.Procesos.Nomencladores.GestEGOG.View({
                            type: "1",
                            etiquetas: etiquetas,
                            nodeSelected: 'elementogasto',
                            esRectora: esRectora
                        });
                        new Ext.Costo.Procesos.Nomencladores.Componentes.CCEOG({
                            id: 'eog',
                            typeSelection: 2,
                            types: [1]
                        }).on({
                            initialize: function(componentClass, componentUI) {
                                componentClass.tLoaderEOG.on({
                                    beforeload: function(loader, node, callback) {
                                        Ext.ComponentMgr.get('btnMod').disable();
                                        Ext.ComponentMgr.get('btnEli').disable();
                                        scope.clearDetalles();
                                    }
                                });
                                componentUI.on({
                                    checkchange: function(node, checked) {
                                        if (checked) {
                                            scope.mostrarDetalles({
                                                codigo: node.attributes.codigo,
                                                descripcion: node.attributes.descripcion,
                                                activo: node.attributes.activo,
                                                directivo: parseInt(node.attributes.directivo) == 1 ? "S&iacute;" : "No"
                                            });
                                            Ext.ComponentMgr.get('btnMod').setDisabled(componentClass.fGetSelections().length > 1 || componentClass.hasNodesHeredadosSelected());
                                            Ext.ComponentMgr.get('btnAdic').setDisabled(componentClass.fGetSelections().length > 1 || parseInt(node.attributes.nivel) >= node.attributes.nivelespermitidos
                                                    || node.attributes.idestado == 2);
                                            Ext.ComponentMgr.get('btnEli').enable();
                                            if (!esRectora && this.id === 'tpeog') {
                                                Ext.ComponentMgr.get('btnAdic').disable();
                                                Ext.ComponentMgr.get('btnMod').disable();
                                                Ext.ComponentMgr.get('btnEli').disable();
                                            }
                                        } else {
                                            Ext.ComponentMgr.get('btnMod').setDisabled(componentClass.fGetSelections().length !== 1 ||
                                                    componentClass.hasNodesHeredadosSelected());
                                            Ext.ComponentMgr.get('btnAdic').setDisabled(componentClass.fGetSelections().length > 1);
                                            Ext.ComponentMgr.get('btnEli').setDisabled(componentClass.fGetSelections().length === 0);
                                            if (componentClass.fGetSelections().length === 0) {
                                                scope.clearDetalles();
                                            } else {
                                                var selections = componentClass.fGetSelections();
                                                scope.mostrarDetalles({
                                                    codigo: selections[selections.length - 1].attributes.codigo,
                                                    descripcion: selections[selections.length - 1].attributes.descripcion,
                                                    activo: selections[selections.length - 1].attributes.activo,
                                                    directivo: parseInt(selections[selections.length - 1].attributes.directivo) == 1 ? "S&iacute;" : "No"
                                                });
                                                selections[selections.length - 1].select();
                                            }
                                            if (!esRectora && this.id === 'tpeog') {
                                                Ext.ComponentMgr.get('btnAdic').disable();
                                                Ext.ComponentMgr.get('btnMod').disable();
                                                Ext.ComponentMgr.get('btnEli').disable();
                                            }
                                        }
                                    },
                                    click: function(node) {
                                        if (node.id != 0) {
                                            scope.mostrarDetalles({
                                                codigo: node.attributes.codigo,
                                                descripcion: node.attributes.descripcion,
                                                activo: node.attributes.activo,
                                                directivo: parseInt(node.attributes.directivo) == 1 ? "S&iacute;" : "No"
                                            });
                                            Ext.ComponentMgr.get('btnAdic').setDisabled(parseInt(node.attributes.nivel) >= node.attributes.nivelespermitidos
                                                    || node.attributes.idestado == 2);
                                        }
                                        if (!esRectora && this.id === 'tpeog') {
                                            Ext.ComponentMgr.get('btnAdic').disable();
                                            Ext.ComponentMgr.get('btnMod').disable();
                                            Ext.ComponentMgr.get('btnEli').disable();
                                        }
                                    },
                                    dblclick: function(node) {
                                        if (node.id != 0) {
                                            scope.mostrarDetalles({
                                                codigo: node.attributes.codigo,
                                                descripcion: node.attributes.descripcion,
                                                activo: node.attributes.activo,
                                                directivo: parseInt(node.attributes.directivo) == 1 ? "S&iacute;" : "No"
                                            });
                                            Ext.ComponentMgr.get('btnAdic').setDisabled(parseInt(node.attributes.nivel) >= node.attributes.nivelespermitidos
                                                    || node.attributes.idestado == 2);
                                        }
                                        if (!esRectora && this.id === 'tpeog') {
                                            Ext.ComponentMgr.get('btnAdic').disable();
                                            Ext.ComponentMgr.get('btnMod').disable();
                                            Ext.ComponentMgr.get('btnEli').disable();
                                        }
                                    }
                                });
                                componentUI.setHeight(objeto.getSize().height);
                                objeto.insert(0, componentUI);
                                objeto.doLayout(true);
                                objeto.crearMapadeTeclas();
                                objeto.btnAdicionar.focus();
                            },
                            searchClose: function() {
                                objeto.keys.enable();
                                objeto.btnAdicionar.focus();
                            }
                        });

                        aux.panelgest.insert(0, objeto);

                        var list = aux.panelgest.items.items;
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].getId() != objeto.getId()) {
                                aux.panelgest.remove(list[i]);
                            }
                        }

                        aux.panelgest.expand();
                        aux.panelgest.doLayout(true);
                    }
                }
            // }), new Ext.tree.TreeNode({
            //     text: etiquetas.lbTitNodoActividades,
            //     id: 'idactividad',
            //     listeners: {
            //         'click': function(nodo, evento) {
            //             aux.panelgest.setTitle(etiquetas.lbTitPanelGestionActividades);
            //             scope.clearDetalles();
            //
            //             var objeto = new Costo.Procesos.Nomencladores.GestAct.View({
            //                 type: "1",
            //                 etiquetas: etiquetas,
            //                 nodeSelected: 'actividades'
            //             });
            //
            //             aux.panelgest.insert(0, objeto);
            //
            //             var list = aux.panelgest.items.items;
            //             for (var i = 0; i < list.length; i++)
            //                 if (list[i].getId() != objeto.getId())
            //                     aux.panelgest.remove(list[i]);
            //
            //             aux.panelgest.expand();
            //             aux.panelgest.doLayout(true);
            //         }
            //     }
            })
        ]);

        Ext.MessageBox.hide();

        //**************panel principal************************//

        this.panelgest = new Ext.form.FormPanel({
            title: etiquetas.lbTitDeaultPanelGestionar,
            id: 'idpanel',
            region: 'east',
            collapsed: true,
            collapsible: true,
            width: '75%',
            margins: '3 3 0 0',
            layout: 'fit',
            items: [{
                    id: 'pepe'
                }]
        });

        this.panelDetalles = new Ext.Panel({
            title: etiquetas.lbTitPanelDetalles,
            id: 'detalles',
            collapsed: true,
            collapsible: true,
            frame: 'true',
            margins: '0 3 3 3',
            region: 'south',
            height: 140,
            items: [{
                xtype: 'fieldset',
                height: 130,
                width: '98%',
                autoScroll: true,
                autoHeight: true,
                items: [
                    {
                        style: 'font-size:12px',
                        items: this.lcodigo
                    }, {
                        style: 'margin 20 0 20 0;font-size:12px',
                        items: this.ldescripcion
                    }, {
                        style: 'margin 0 0 20 0;font-size:12px',
                        items: this.lactivo
                    }, {
                        style: 'margin 0 0 20 0;font-size:12px',
                        items: this.ldirectivo
                    }, {
                        style: 'margin 0 0 20 0;font-size:12px',
                        items: this.lcta
                    }
                ]
            }]
        });

        this.panel = new Ext.Panel({
            layout: 'border',
            defaults: {
                split: true
            },
            items: [this.arbol, this.panelgest, this.panelDetalles]
        });
        new Ext.Viewport({
            layout: 'fit',
            items: [this.panel]
        });

        this.clearDetalles = function() {
            Ext.ComponentMgr.get('lcodigo').setText(etiquetas.lbCodigo, false);
            Ext.ComponentMgr.get('ldescripcion').setText(etiquetas.lbDescripcion, false);
            Ext.ComponentMgr.get('lactivo').setText(etiquetas.lbActivo, false);
            Ext.ComponentMgr.get('ldirectivo').setText(etiquetas.lbDirectivo, false);
            Ext.ComponentMgr.get('ldirectivo').hide();
            Ext.ComponentMgr.get('lcta').setText(etiquetas.lbCta, false);
            Ext.ComponentMgr.get('lcta').hide();
            Ext.ComponentMgr.get('detalles').collapse();
        };

        this.mostrarDetalles = function(objeto) {
            Ext.ComponentMgr.get('lcodigo').setText(etiquetas.lbCodigo + " " + objeto.codigo, false);
            Ext.ComponentMgr.get('ldescripcion').setText(etiquetas.lbDescripcion + " " + objeto.descripcion, false);
            Ext.ComponentMgr.get('lactivo').setText(etiquetas.lbActivo + " " + objeto.activo, false);
            if (objeto.directivo != undefined) {
                Ext.ComponentMgr.get('ldirectivo').show();
                Ext.ComponentMgr.get('ldirectivo').setText(etiquetas.lbDirectivo + " " + objeto.directivo, false);
            }
            if (objeto.nomcta != undefined) {
                Ext.ComponentMgr.get('lcta').show();
                Ext.ComponentMgr.get('lcta').setText(etiquetas.lbCta + " " + objeto.nomcta, false);
            }
            Ext.ComponentMgr.get('detalles').expand();
        };
    }
};

//Inicializando la vista.
Ext.QuickTips.init();
var perfil = window.parent.perfil;
perfil.etiquetas = Object();

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function(options, success, response) {
        var etiquetas = Ext.decode(response.responseText);
        Ext.Ajax.request({
            method: "POST",
            url: "esEntidadRectora",
            callback: function(optionss, successs, responses) {
                var esRectora = Ext.decode(responses.responseText);
                //Inicializar la vista.
                var view = Costo.Procesos.Nomencladores.View;
                view.init(perfil, etiquetas, esRectora);
            }
        });
        // //Inicializar la vista.
        // var view = Costo.Procesos.Nomencladores.View;
        // view.init(perfil, etiquetas);
    }
});
