Ext.ns('Ext.Person');
Ext.ns('Ext.components');

Ext.Person.ColumnNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
    focus: Ext.emptyFn, //prevent odd scrolling behavior

    renderElements: function (n, a, targetNode, bulkRender) {
        this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

        var t = n.getOwnerTree();
        var cols = t.columns;
        var bw = t.borderWidth;
        var c = cols[0];
        var buf = [
            '<li class="x-tree-node">' +
            '<div ext:tree-node-id="', n.id, '" class="x-tree-node-el x-tree-node-leaf ', a.cls, '">',
            '<div class="x-tree-col" style="width:', c.width - bw, 'px;">',
            '<span class="x-tree-node-indent">', this.indentMarkup, "</span>",
            '<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow">',
            '<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon', (a.icon ? " x-tree-node-inline-icon" : ""), (a.iconCls ? " " + a.iconCls : ""), '" unselectable="on">',
            '<a hidefocus="on" class="x-tree-node-anchor" href="', a.href ? a.href : "#", '" tabIndex="1" ',
            a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "", '>',
            '<span unselectable="on">', n.text || (c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]), "</span></a>",
            "</div>"];
        var arrIds = [];
        for (var i = 1, len = cols.length; i < len; i++) {
            c = cols[i];
            var id = Ext.id();
            if (a[c.dataIndex]) {
                arrIds.push({
                    id: id,
                    campo: c.dataIndex,
                    value: (c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex])
                });
            }
            buf.push('<div class="x-tree-col ', (c.cls ? c.cls : ''), '" style="width:', c.width - bw, 'px;">',
                '<div id="', id, '" class="x-tree-col-text"></div>',
                "</div>");
        }
        buf.push(
            '<div class="x-clear"></div></div>',
            '<ul class="x-tree-node-ct" style="display:none;"></ul>',
            "</li>");
        if (bulkRender !== true && n.nextSibling && n.nextSibling.ui.getEl()) {
            this.wrap = Ext.DomHelper.insertHtml("beforeBegin",
                n.nextSibling.ui.getEl(), buf.join(""));
        } else {
            this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf.join(""));
        }

        Ext.each(arrIds, function (obj) {
            n.ui[obj.campo] = new Ext.form.Checkbox({
                campo: obj.campo,
                hideLabel: true,
                disabled: obj.value.disabled || false,
                renderTo: document.getElementById(obj.id),
                checked: obj.value.checked || false,
                scope: this,
                handler: this.handlerCheck
            });
        }, this);

        this.elNode = this.wrap.childNodes[0];
        this.ctNode = this.wrap.childNodes[1];
        var cs = this.elNode.firstChild.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        this.iconNode = cs[2];
        this.anchor = cs[3];
        this.textNode = cs[3].firstChild;
    },
    handlerCheck: function (obj) {
        this.fireEvent('check', obj, obj.checked);
        this.node.attributes[obj.campo] = obj.checked;
        this.node.isDirty = true;
    }
});

Ext.components.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent: function () {
        Ext.components.SearchField.superclass.initComponent.call(this);

        this.on('render', function () {
            this.hiddenPkgs = [];
        }, this);

        this.on('specialkey', function (f, e) {
            if (e.getKey() == e.ENTER) {
                this.onTrigger2Click();
            }
        }, this);

        this.on('keydown', this.onTrigger2Click, this, {buffer: 350});
    },

    validationEvent: false,
    validateOnBlur: false,
    trigger1Class: 'x-form-clear-trigger',
    trigger2Class: 'x-form-search-trigger',
    hideTrigger1: true,
    width: 180,
    hasSearch: false,
    paramName: 'query',

    onTrigger1Click: function () {
        if (this.hasSearch) {
            this.el.dom.value = '';
            this.filterTree();
            this.triggers[0].hide();
            this.hasSearch = false;
            this.focus();
        }
    },

    onTrigger2Click: function () {
        var v = this.getRawValue();
        if (v.length < 1) {
            this.onTrigger1Click();
            return;
        }
        this.filterTree();
        this.hasSearch = true;
        this.triggers[0].show();
        this.focus();
    },

    filterTree: function () {
        var self = this;
        var text = this.getRawValue();

        Ext.each(this.hiddenPkgs, function (n) {
            n.ui.show();//muestro todos los nodos que se habian ocultado
        });
        if (!text) {
            this.filtro.clear();
            return;
        }
        this.tree.expandAll();

        var re = new RegExp(Ext.escapeRe(text), 'i');
        this.filtro.filterBy(function (n) {
            return !n.isLeaf() || re.test(n.text);
        });

        // hide empty packages that weren't filtered
        this.hiddenPkgs = [];
        this.tree.root.cascade(function (n) {
            if (!n.isLeaf() && n.ui.ctNode.offsetHeight < 3) {
                n.ui.hide();
                self.hiddenPkgs.push(n);
            }
        });
    }
});

Ext.Person.CompartimentacionConceptos = Ext.extend(Ext.Panel, {
    title: 'Compartimentaci&oacute;n de conceptos',
    layout: 'fit',
    width: '570',
    initComponent: function () {
        this.stRol = new Ext.data.Store({
            autoLoad: true,
            url: 'getRoles',
            reader: new Ext.data.JsonReader({
                root: "datos"
            }, [
                {name: 'denominacion'},
                {name: 'idrol'}
            ]),
            listeners: {
                load: function (st, rec) {
                    this.cbRol.enable();
                }.createDelegate(this)
            }
        });

        this.cbRol = new Ext.form.ComboBox({
            store: this.stRol,
            name: 'rol',
            displayField: 'denominacion',
            valueField: 'idrol',
            hiddenName: 'idrol',
            typeAhead: true,
            mode: 'local',
            disabled: true,
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: false,
            listeners: {
                select: function (cb, rec) {
                    this.TreeConcept.getLoader().load(this.TreeConcept.getRootNode());
                }.createDelegate(this)
            }
        });

        this.initButtons();

        this.TreeConcept = new Ext.tree.ColumnTree({
            rootVisible: false,
            autoScroll: true,
            lines: true,
            border: false,
            tbar: ['Rol:', this.cbRol, '-', this.btnSave],
            columns: [
                {
                    header: 'Conceptos',
                    width: 400,
                    dataIndex: 'conceptos'
                },
                {
                    header: 'Visibilidad',
                    width: 70,
                    dataIndex: 'visibilidad'
                },
                {
                    header: 'Obligatorio',
                    width: 70,
                    dataIndex: 'obligatorio'
                },
                {
                    header: 'Adicionar',
                    width: 70,
                    dataIndex: 'add'
                },
                {
                    header: 'Modificar',
                    width: 70,
                    dataIndex: 'mod'
                },
                {
                    header: 'Eliminar',
                    width: 70,
                    dataIndex: 'del'
                }
            ],
            loader: new Ext.tree.TreeLoader({
                dataUrl: 'getTreeConceptByRol',
                uiProviders: {
                    'col': Ext.Person.ColumnNodeUI
                },
                listeners: {
                    beforeload: function (tl, n) {
                        if (tl.isLoading() || Ext.isEmpty(this.cbRol.getValue())) {
                            return false;
                        } else {
                            this.myMask.show();
                            tl.baseParams.idrol = this.cbRol.getValue();
                            tl.baseParams.idproyecto = this.idproyecto;
                        }
                    }.createDelegate(this)
                }
            }),

            root: new Ext.tree.AsyncTreeNode({
                text: 'Conceptos',
                id: ''
            })
        });

        this.TreeConcept.on('render', function (cmp) {
            this.myMask = new Ext.LoadMask(cmp.body.dom, {
                msg: "Cargando..."
            });
        }, this);

        this.TreeConcept.getLoader().on('load', function () {
            this.myMask.hide();
        }, this);

        this.TreeConcept.on('check', function (ckb, check) {
            this.btnSave.setDisabled(false);
        }, this);

        this.filtro = new Ext.tree.TreeFilter(this.TreeConcept, {
            clearBlank: true,
            autoClear: true
        });

        this.tgSearch = new Ext.components.SearchField({
            hideLabel: true,
            tree: this.TreeConcept,
            filtro: this.filtro,
            enableKeyEvents: true
        });

        this.TreeConcept.getTopToolbar().push('-', 'Filtro:', this.tgSearch, '-', this.btnExpand, this.btnCollapse, '-',
            this.btnVisibleAll, this.btnAddAll, this.btnModAll, this.btnElAll);

        this.items = this.TreeConcept;

        Ext.Person.CompartimentacionConceptos.superclass.initComponent.call(this);
    },
    initButtons: function () {
        this.btnExpand = new Ext.Button({
            tooltip: 'Expandir',
            iconCls: 'expandir',
            scope: this,
            handler: function () {
                this.TreeConcept.expandAll();
            }
        });

        this.btnCollapse = new Ext.Button({
            tooltip: 'Contraer',
            iconCls: 'contraer',
            scope: this,
            handler: function () {
                this.TreeConcept.collapseAll();
            }
        });

        this.btnVisibleAll = new Ext.Button({
            text: 'Visibilidad',
            enableToggle: true,
            tooltip: 'Marcar todos visibles',
            iconCls: 'marcartodos',
            scope: this,
            handler: function () {
            }
        });

        this.btnAddAll = new Ext.Button({
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Marcar todos adicionar',
            enableToggle: true,
            iconCls: 'marcartodos',
            scope: this,
            handler: function () {
            }
        });

        this.btnModAll = new Ext.Button({
            text: 'Modificar',
            tooltip: 'Marcar todos modificar',
            iconCls: 'marcartodos',
            enableToggle: true,
            scope: this,
            handler: function () {
            }
        });

        this.btnElAll = new Ext.Button({
            text: 'Eliminar',
            tooltip: 'Marcar todos eliminar',
            iconCls: 'marcartodos',
            enableToggle: true,
            scope: this,
            handler: function () {
            }
        });

        this.btnSave = new Ext.Button({
            text: 'Guardar',
            iconCls: 'guardar',
            disabled: true,
            scope: this,
            handler: this.saveChange
        });
    },
    saveChange: function () {
        var arr = [];
        for (var p in this.TreeConcept.nodeHash) {
            if (this.TreeConcept.nodeHash[p].isDirty) {
                arr.push({
                    idproyectorol: this.TreeConcept.nodeHash[p].attributes.idproyectorol,
                    idproyectoconcepto: this.TreeConcept.nodeHash[p].attributes.idproyectoconcepto,
                    activo: (typeof this.TreeConcept.nodeHash[p].attributes.visibilidad == 'object')
                        ? this.TreeConcept.nodeHash[p].attributes.visibilidad.checked
                        : this.TreeConcept.nodeHash[p].attributes.visibilidad,
                    obligatorio: (typeof this.TreeConcept.nodeHash[p].attributes.obligatorio == 'object')
                        ? this.TreeConcept.nodeHash[p].attributes.obligatorio.checked
                        : this.TreeConcept.nodeHash[p].attributes.obligatorio,
                    add: (typeof this.TreeConcept.nodeHash[p].attributes.add == 'object')
                        ? this.TreeConcept.nodeHash[p].attributes.add.checked
                        : this.TreeConcept.nodeHash[p].attributes.add,
                    mod: (typeof this.TreeConcept.nodeHash[p].attributes.mod == 'object')
                        ? this.TreeConcept.nodeHash[p].attributes.mod.checked
                        : this.TreeConcept.nodeHash[p].attributes.mod,
                    del: (typeof this.TreeConcept.nodeHash[p].attributes.del == 'object')
                        ? this.TreeConcept.nodeHash[p].attributes.del.checked
                        : this.TreeConcept.nodeHash[p].attributes.del
                });
            }
        }
        PVD.mostrarMascara(this.id + 'update', 'Por favor espere...', 'Guardando cambios...');
        Ext.Ajax.request({
            url: 'saveCompartimentacionByRol',
            params: {
                idrol: this.cbRol.getValue(),
                arrMod: Ext.encode(arr)
            },
            success: function (response, options) {
                var dataResponse = Ext.decode(response.responseText);
                PVD.ocultarMascara(this.id + 'update');
                switch (dataResponse.codigo) {
                    case 1:
                        mostrarMensaje(1, 'La compartimentaci&oacute;n se ha guardado satisfactoriamente.');
                        this.reload();
                        this.btnSave.disable();
                        break;
                    default :
                        break;
                }
            }.createDelegate(this)
        });

    },
    reload: function () {
        this.TreeConcept.getLoader().load(this.TreeConcept.getRootNode());
    }
});