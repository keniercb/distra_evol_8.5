/**
 * Controlador para configurar proyectos
 *
 * @author Ing. Javier Rodríguez López
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */
Ext.ns('Ext.pvd.persona.nomenclador');
Ext.pvd.persona.nomenclador.Controller = {

    init: function (perfil, lang, view, model)
    {

        view.tfSearch.on('keydown', filterTree, this, {buffer: 350});
        var filtro = new Ext.tree.TreeFilter(view.tpNomenclador, {
            clearBlank: true,
            autoClear: true
        });


        var hiddenPkgs = new Array();

        function filterTree(e)
        {
            var text = e.getRawValue();
            Ext.each(hiddenPkgs, function (n)
            {
                n.ui.show();//muestro todos los nodos que se habian ocultado
            });

            if (!text) {
                filtro.clear();
                model.storeInicio.clearFilter();
                return;
            }


            view.tpNomenclador.expandAll();
            model.storeInicio.filter('denominacion', text, true);
            var re = new RegExp(Ext.escapeRe(text), 'i');
            filtro.filterBy(function (n)
            {
                return !n.isLeaf() || re.test(n.text);
            });
            // hide empty packages that weren't filtered
            hiddenPkgs = [];
            view.tpNomenclador.root.cascade(function (n)
            {
                if (!n.isLeaf() && n.ui.ctNode.offsetHeight < 3) {
                    n.ui.hide();
                    hiddenPkgs.push(n);
                }
            });
        }

        view.tpNomenclador.on('enter-key', function (tree)
        {
            var node = tree.getSelectionModel().getSelectedNode();
            if (node.leaf) {
                if (!node.ui.isChecked()) {
                    ActivateTab(node, true);
                    checkNodo(node, true);
                } else {
                    view.tbpCenter.remove('_' + node.id);
                }
                selActiveTab(node);
            } else {
                !node.isExpanded() ? node.expand() : node.collapse();
            }
        });

        view.tpNomenclador.on('checkchange', ActivateTab);

        model.tlNomenclador.on('load', function (store, n)
        {
            var arr = [];
            Ext.each(n.childNodes, function (rec)
            {
                arr.push([
                    rec.attributes.id,
                    rec.attributes.text,
                    rec.attributes.src,
                    !Ext.isEmpty(rec.attributes.descripcion)
                        ? rec.attributes.descripcion
                        : 'Sin descripción',
                    !Ext.isEmpty(rec.attributes.imagen)
                        ? 'data:image/jpg;base64,' + rec.attributes.imagen
                        : '../../views/images/nomenclador/nom_default.jpg'
                ]);
            });
            model.storeInicio.loadData(arr);
            view.dvInicio.refresh();

        });

        /**
         * Activa el panel relacionado con el nodo
         */
        view.tpNomenclador.on('beforeclick', function(n){
            if(n.attributes.leaf == true) {
                if (!n.ui.isChecked()) {
                    checkNodo(n, true);
                    ActivateTab(n, true);
                } else {
                    selActiveTab(n);
                }

            }
        });

        /**
         * Desmarca el nodo chequeado en el arbol
         */
        view.tbpCenter.on('remove', function (container, cmp)
        {
            view.tpNomenclador.getNodeById(cmp.id.substring(1)).getUI().toggleCheck(false);
        });

        /**
         * Selecciona el nodo segun panel activo
         */
        view.tbpCenter.on('tabchange', function (tbPanel, newTab)
        {
            view.tpNomenclador.getSelectionModel().clearSelections();
            if (newTab.id != 'home') {
                view.tpNomenclador.getSelectionModel().select(view.tpNomenclador.getNodeById(newTab.id.substring(1)));

                if (typeof tbPanel.getActiveTab().enfocar == 'function') {
                    tbPanel.getActiveTab().enfocar();
                } else
                    tbPanel.getActiveTab().items.items[0].enfocar();
            }
        });

        view.dvInicio.on('beforeclick', function (cm, rowIndex, n, e)
        {
            var rec = cm.getRecord(n);
            var node = view.tpNomenclador.getNodeById(rec.get('idnomenclador'));
            if(node.attributes.leaf == '') {
                node.expand();
            } else {
                if (!node.ui.isChecked()) {
                    ActivateTab(node, true);
                    checkNodo(node, true);
                }
                selActiveTab(node);
            }
        });

        function selActiveTab(node)
        {
            if (view.tbpCenter.getItem('_' + node.id)) {
                view.tbpCenter.activate('_' + node.id);
            }
        }

        function ActivateTab(node, checked)
        {
            if (checked) {
                PVD.mostrarMascara('mskactiveItem', 'Por favor espere...', 'Abriendo nomenclador...');
                yepnope({
                    load: Ext.decode(node.attributes.src),
                    callback: (function ()
                    {
                        PVD.ocultarMascara('mskactiveItem');
                        if (!view.tbpCenter.getItem('_' + node.id)) {
                            var Class = eval(node.attributes.name);

                            view.tbpCenter.add({
                                title: node.text,
                                id: '_' + node.id,
                                tabTip: node.text,
                                height: '100%',
                                closable: true,
                                layout: 'fit',
                                items: [new Class()],
                                listeners: {
                                    activate: function (p)
                                    {
                                        p.doLayout();
                                        //                                    p.getComponent(0).keyMap.enable();
                                    },
                                    deactivate: function (p)
                                    {
                                        //                                    p.getComponent(0).keyMap.disable();
                                    }
                                }
                            });
                        }

                        //Activa el panel creado
                        view.tbpCenter.activate('_' + node.id);
                    }).defer(500)
                });
            } else {
                //Cierra el panel cuando se desmarca el nodo
                view.tbpCenter.remove('_' + node.id);
            }
        }

        function checkNodo(n, bool)
        {
            if (!Ext.isEmpty(n)) {
                var nodeUI = n.ui;
                nodeUI.checked = bool;
                nodeUI.checkbox.checked = bool;
                nodeUI.checkbox.defaultChecked = bool;
                n.attributes.checked = bool;
            }
        }

    }
}