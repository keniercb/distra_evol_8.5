Ext.ns('Ext.components');

/**
 * TreeConcept
 * Componente para listar los conceptos que se pueden gestionar de la persona
 * XETID
 * @author: Ing. Javier Rodriguez Lopez
 *
 * Ultima modificacion: Diciembre 2013
 * @type TreePanel
 */
Ext.components.TreeConcept = Ext.extend(Ext.tree.TreePanel, {
    title: 'Conceptos de la persona',
    split: true,
    expanded: true,
    autoScroll: true,
    disabled: false,
    rootVisible: false,
    titleCollapse: true,
    initComponent: function () {
        var self = this;

        this.on('render', function () {
            this.hiddenPkgs = new Array();//arreglo para guardar los nodos que no se van a mostrar
            this.myMask = new Ext.LoadMask(this.body.dom, {
                msg: "Cargando..."
            });
        }, this);

       /* this.tools = [
            {
                id: 'help',
                qtip: 'Ayuda del árbol de conceptos',
                handler: function (e, target, panel) {
                    alert('Ayuda');//panel.ownerCt.ownerCt.removeConcept(panel, true);
                }
            }
        ];*/

        /**
         * Componente de busqueda
         * @type {TriggerField}
         */
      /*  this.searchField = new Ext.form.TriggerField({
            emptyText: 'Criterio a buscar...',
            width: 180,
            enableKeyEvents: true,
            triggerClass: 'x-form-search-trigger'
        });*/
        this.searchField = new Ext.form.TwinTriggerField({
            emptyText: 'Criterio a buscar...',
            width: 180,
            enableKeyEvents: true,
            enableKeyEvents: true,
            trigger2Class: 'x-form-search-trigger',
            listeners:{
                render:function(cmp){
                    cmp.triggers[0].hide();
                }
            }
        });
        this.searchField.triggerConfig.cn[1].qtip = 'Buscar concepto(s)';
        this.searchField.on('keydown', filterTree, this, {buffer: 350});


        /**
         * Boton para recargar el arbol
         * @type {Button}
         */
        this.btnReload = new Ext.Button({
            iconCls: 'actualizar',
            tooltip: 'Actualizar',
            handler: function () {
                this.getLoader().load(this.getRootNode());
                this.getRootNode().expand(false, true);
            }.createDelegate(this)
        });

        /**
         * Boton para expandir el arbol
         * @type {Button}
         */
        this.btnExpand = new Ext.Button({
            tooltip: 'Expandir <b>(Alt+Abajo)</b>',
            iconCls: 'expandir',
            handler: function () {
                this.expandAll();
            }.createDelegate(this)
        });

        /**
         * Boton para contraer el arbol
         * @type {Button}
         */
        this.btnCollapse = new Ext.Button({
            tooltip: 'Contraer <b>(Alt+Arriba)</b>',
            iconCls: 'contraer',
            handler: function () {
                this.collapseAll();
            }.createDelegate(this)
        });

        /**
         * Filtro del tree
         * @type {TreeFilter}
         */
        this.filtro = new Ext.tree.TreeFilter(this, {
            clearBlank: true,
            autoClear: true
        });

        this.tbar = [this.searchField, '->', this.btnExpand, this.btnCollapse/*this.btnReload*/];

        this.loader = new Ext.tree.TreeLoader({
            dataUrl: 'loadTreeConcept',
            baseParams: {idproyecto: this.idproyecto || ''},
            listeners: {
                beforeload: function () {
                    this.myMask.show();
                }.createDelegate(this),
                load: function (tl, n) {
                    n.expand(true);
                    this.myMask.hide();
                }.createDelegate(this)
            }
        });

        this.root = new Ext.tree.AsyncTreeNode({
            text: 'Conceptos',
            draggable: false,
            expandable: true,
            expanded: true,
            id: 'root'
        });

        this.keys = [
            {
                key: 38,
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnCollapse.disabled) {
                        self.btnCollapse.handler();
                    }

                }
            },
            {
                key: 40,
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnExpand.disabled) {
                        self.btnExpand.handler();
                    }

                }
            }
        ];

        Ext.components.TreeConcept.superclass.initComponent.call(this);

        function filterTree(e) {
            var text = e.getRawValue();
            Ext.each(self.hiddenPkgs, function (n) {
                n.ui.show();//muestro todos los nodos que se habian ocultado
            });
            if (!text) {
                self.filtro.clear();
                return;
            }
            self.expandAll();

            var re = new RegExp(Ext.escapeRe(text), 'i');
            self.filtro.filterBy(function (n) {
                return !n.isLeaf() || re.test(n.text);
            });

            // hide empty packages that weren't filtered
            self.hiddenPkgs = [];
            self.root.cascade(function (n) {
                if (!n.isLeaf() && n.ui.ctNode.offsetHeight < 3) {
                    n.ui.hide();
                    self.hiddenPkgs.push(n);
                }
            });
        }
    },
    getNodeByIdConceptoProyecto: function (id) {
        for (var p in this.nodeHash) {
            if (this.nodeHash[p].attributes.idproyectoconcepto == id) {
                return this.nodeHash[p];
            }
        }
    }
});