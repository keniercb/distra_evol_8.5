/**
 * Componente para la seguridad de los campos en el recuperador complejo
 * @author Javier Rodriguez Lopez
 */

Ext.ns('Ext.Person');
Ext.ns('Ext.components.CmpReccomplejas');

Ext.components.CmpReccomplejas.ComboBoxNomenclador = Ext.extend(Ext.form.ComboBox, {
    modal: true,
    closeAction: 'destroy',
    displayField: 'denom',
    hiddenName: 'idvalor',
    valueField: 'idvalor',
    tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    selectOnFocus: true,
    width: 280,
    initComponent: function () {
        var self = this;
        this.emptyText = 'Seleccione...';
        self.store = new Ext.data.Store({
            url: '/reccomplejas/index.php/reccomplejas/cargarValoresNomenclador',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            }, [
                {
                    name: 'idvalor'
                },
                {
                    name: 'denom'
                }
            ])
        });
        self.store.load({
            params: {
                idconfiguracion: self.idconfiguracion,
                idcampo: self.idcampo,
                tipo: self.tipo
            }
        });
        this.on('blur', function (cb, nVal, oVal) {
            if (this.store instanceof Ext.data.Store) {
                if (Ext.isEmpty(this.getValue())) {
                    this.clearValue();
                }
            }
        });
        Ext.components.CmpReccomplejas.ComboBoxNomenclador.superclass.initComponent.call(this);
    }
});

Ext.Person.ColumnNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
    focus: Ext.emptyFn, // prevent odd scrolling behavior

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
            '<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon', (a.icon ? " x-tree-node-inline-icon" : ""), (a.iconCls ? ' ' + a.iconCls : ""), '" unselectable="on">',
            '<a hidefocus="on" class="x-tree-node-anchor" href="', a.href ? a.href : "#", '" tabIndex="1" ',
            a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "", '>',
            '<span unselectable="on">', n.text || (c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]), "</span></a>",
            "</div>"];
        var arrIds = [];
        for (var i = 1, len = cols.length; i < len; i++) {
            c = cols[i];
            var id = Ext.id();
            if (!Ext.isEmpty(a[c.dataIndex])) {
                arrIds.push({
                    id: id,
                    campo: c.dataIndex,
                    value: (c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex])
                });
            }
            buf.push('<div class="x-tree-col"', (c.cls ? c.cls : ''), '" style="width:', c.width - bw, 'px;">',
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
            n[obj.campo] = new Ext.form.Checkbox({
                campo: obj.campo,
                hideLabel: true,
                disabled: n.disabled,
                renderTo: document.getElementById(obj.id),
                checked: obj.value,
                scope: this,
                handler: this.handlerCheck,
                listeners: {
                    check: function (cmp, checked) {
                        n.isDirty = true;
                        n.attributes[cmp.campo] = cmp.campo;
                        this.fireEvent('check', n, checked);
                    }.createDelegate(this)
                }
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
    }
});

Ext.components.CmpReccomplejas.SegCampo = Ext.extend(Ext.tree.ColumnTree, {
    rootVisible: false,
    autoScroll: true,
    lines: true,
    columns: [
        {
            header: 'Campos',
            width: 550,
            dataIndex: 'text'
        },
        {
            header: 'Acceso',
            width: 60,
            dataIndex: 'acceso'
        }
    ],
    initComponent: function () {
        var self = this;

        this.btnSave = new Ext.Button({
            text: 'Guardar',
            tooltip: 'Guardar permisos <b>(Alt+G)</b>',
            iconCls: 'guardar',
            disabled: true,
            scope: this,
            handler: this.saveChange
        });

        /**
         * Boton para expandir el arbol
         * @type {Button}
         */
        this.btnExpandAll = new Ext.Button({
            tooltip: 'Expandir',
            iconCls: 'expandir',
            scope: this,
            handler: function () {
                this.expandAll();
            }
        });

        /**
         * Boton para contraer el arbol
         * @type {Button}
         */
        this.btnCollapseAll = new Ext.Button({
            tooltip: 'Contraer',
            iconCls: 'contraer',
            scope: this,
            handler: function () {
                this.collapseAll();
            }
        });

        this.loader = new Ext.tree.TreeLoader({
            dataUrl: 'getSegCampos',
            uiProviders: {
                'col': Ext.Person.ColumnNodeUI
            },
            listeners: {
                beforeload: function (tl, n) {

                    if (tl.isLoading()) {
                        return false;
                    } else {
                        if (Ext.isEmpty(this.idrol) || Ext.isEmpty(this.config)) {
                            return false;
                        } else {
                            tl.baseParams.idrol = this.idrol;
                            tl.baseParams.idconfiguracion = this.config.data.idconfiguracion;
                        }
                    }
                }.createDelegate(this)
            }
        });

        this.root = new Ext.tree.AsyncTreeNode({
            id: 'root',
            text: 'Campos'
        });

        this.tbar = [this.btnSave, '->', this.btnExpandAll, this.btnCollapseAll];

        Ext.components.CmpReccomplejas.SegCampo.superclass.initComponent.call(this);

        this.on('check', function (node, checked) {
            this.btnSave.setDisabled(false);
            this.setTreeCheckNode(node, checked);
        }, this);
    },
    setTreeCheckNode: function (node, checked) {
        if (checked) {
            //Cuando seleccione un nodo chequea todos sus ancestros.
            if (node.parentNode && node.parentNode.acceso) {
                node.parentNode.acceso.setValue(true);
                this.setTreeCheckNode(node.parentNode, checked);
            }
        } else {

        }
    },
    saveChange: function () {
        var arrAdd = new Array();
        var arrDel = new Array();
        for (var p in this.nodeHash) {
            if (this.nodeHash[p].isDirty && this.nodeHash[p].id != 'root') {
                if (this.nodeHash[p].attributes.idsegcampo && !this.nodeHash[p].acceso.getValue()) {
                    arrDel.push(this.nodeHash[p].attributes.idsegcampo);
                } else if (this.nodeHash[p].acceso.getValue() && Ext.isEmpty(this.nodeHash[p].attributes.idsegcampo)) {
                    arrAdd.push({
                        idrol: this.idrol,
                        idcampo: this.nodeHash[p].attributes.idcampo
                    });
                }
            }
        }

        if (arrAdd.length == 0 && arrDel.length == 0) {
            mostrarMensaje(1, 'No hay ning&uacute;n campo para modificar.');
        } else {
            Ext.Ajax.request({
                url: 'setCompartimentacion',
                params: {
                    arrAdd: Ext.encode(arrAdd),
                    arrDel: Ext.encode(arrDel)
                },
                success: function (response, options) {
                    var response = Ext.decode(response.responseText);
                    if (response.success) {
                        mostrarMensaje(1, 'La compartimentaci&oacute;n se ha guardado satisfactoriamente.');
                        this.getLoader().load(this.getRootNode());
                    } else {
                        mostrarMensaje(3, response.errorMsg);
                    }
                }.createDelegate(this)
            });
        }
    }
});

Ext.components.CmpReccomplejas.Compartimentacion = Ext.extend(Ext.Panel, {
    layout: 'border',
    title: 'Compartimentaci&oacute;n',

    initComponent: function () {
        var self = this;
        this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;

        this.condiciones = {
            TEXTO: [
                ['=', 'Igual'],
                ['<>', 'Distinto'],
                ['%x%', 'Contiene'],
                ['x%', 'Comienza con'],
                ['%x', 'Termina con'],
                ['IS NULL', 'Es nulo'],
                ['IS NOT NULL', 'No nulo']
            ],
            NUMERO: [
                ['=', 'Igual'],
                ['<>', 'Distinto'],
                ['>', 'Posterior a'],
                ['<', 'Anterior a'],
                ['>=', 'Posterior o igual a'],
                ['<=', 'Anterior o igual a'],
                ['IN', 'Contenido en'],
                ['NOT IN', 'No contenido en'],
                ['IS NULL', 'Es nulo'],
                ['IS NOT NULL', 'No nulo']
            ],
            FECHA: [
                ['=', 'Igual'],
                ['<>', 'Distinto'],
                ['>', 'Posterior a'],
                ['<', 'Anterior a'],
                ['>=', 'Posterior o igual a'],
                ['<=', 'Anterior o igual a'],
                ['IS NULL', 'Es nulo'],
                ['IS NOT NULL', 'No nulo']
            ],
            NOMENCLADOR: [
                ['=', 'Igual'],
                ['<>', 'Distinto'],
                ['IN', 'Contenido en'],
                ['NOT IN', 'No contenido en']
            ],
            ARBOL: [
                ['=', 'Igual'],
                ['<>', 'Distinto'],
                ['IN', 'Contenido en'],
                ['NOT IN', 'No contenido en']
            ]
        };

        this.btnAdd = new Ext.Button({
            iconCls: 'adicionar',
            text: 'Adicionar',
            handler: function () {
                var totalRecord = self.stFilters.getCount();
                if (totalRecord > 0) {
                    var temp = self.stFilters.getAt(totalRecord - 1);
                    temp.set('logico', 'AND');
                }
                self.stFilters.add(new Ext.data.Record({
                    idcampo: self.tpSeguridad.getSelectionModel().getSelectedNode().attributes.idcampo,
                    idrol: self.cbRol.getValue(),
                    condicion: '',
                    valor: '',
                    logico: '',
                    orden: totalRecord + 1
                }));
            }
        });

        this.btnDel = new Ext.Button({
            disabled: true,
            iconCls: 'eliminar',
            text: 'Eliminar',
            handler: function () {
                if (self.smFilters.hasSelection()) {
                    var totalRecord = self.stFilters.getCount();
                    var rec = self.gpFilters.getSelectionModel().getSelected();
                    var node = self.tpSeguridad.getSelectionModel().getSelectedNode();
                    if (rec.get('idfiltro')) {
                        mostrarMensaje(2, 'Esta seguro que desea eliminar el filtro seleccionado?', function (btn) {
                            if (btn == "ok") {
                                PVD.mostrarMascara('mskdelfilter', self.idioma.MsgWait, 'Eliminando datos del filtro');
                                Ext.Ajax.request({
                                    url: 'delFiltro',
                                    params: {
                                        idfiltro: rec.get('idfiltro')
                                    },
                                    success: function (response, options) {
                                        PVD.ocultarMascara('mskdelfilter');
                                        node.attributes.SegFiltro.splice(rec.get('id'), 1);
                                        self.stFilters.remove(rec);
                                        totalRecord = self.stFilters.getCount()
                                        if (totalRecord > 0) {
                                            self.stFilters.getAt(totalRecord - 1).set('logico', '');
                                        }
                                        self.btnDel.disable();
                                    }
                                });
                            }
                        });
                    } else {
                        node.attributes.SegFiltro.splice(rec.get('id'), 1);
                        self.stFilters.remove(rec);
                        self.btnDel.disable();

                        if (totalRecord > 0) {
                            self.stFilters.getAt(totalRecord - 2).set('logico', '');
                        }
                    }
                }
            }
        });

        this.btnUp = new Ext.Button({
            disabled: true,
            icon: perfil.dirImg + 'arriba.png',
            iconCls: 'arriba',
            handler: subirCondicion
        });

        this.btnDown = new Ext.Button({
            disabled: true,
            iconCls: 'abajo',
            tooltip: 'Bajar filtro',
            handler: bajarCondicion
        });

        this.stLogico = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'logico'
                }
            ],
            data: [
                ['AND'],
                ['OR']
            ]
        });

        this.cbLogico = new Ext.form.ComboBox({
            store: this.stLogico,
            displayField: 'logico',
            hiddenName: 'logico',
            valueField: 'logico',
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            listClass: 'x-combo-list-small',
            forceSelection: true,
            selectOnFocus: true,
            listWidth: 50,
            msgTarget: 'qtip',
            listeners: {
                select: function (combo, record, index) {
                    var totalFilter = self.stFilters.getCount();
                    var selectedRecord = self.smFilters.getSelected();
                    var pos = self.stFilters.indexOf(selectedRecord);

                    if ((totalFilter - pos) == 1) {
                        self.gpFilters.stopEditing();
                        selectedRecord.set('logico', '');
                        return false;
                    }
                }
            }
        });

        this.stCbCondicion = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'condicion'
                },
                {
                    name: 'descripcion'
                }
            ]
        });

        this.cbCondicion = new Ext.form.ComboBox({
            store: this.stCbCondicion,
            modal: true,
            closeAction: 'destroy',
            displayField: 'condicion',
            hiddenName: 'condicion',
            tpl: '<tpl for="."><div ext:qtip="{descripcion}</p> " class="x-combo-list-item">{condicion}</div></tpl>',
            valueField: 'condicion',
            mode: 'local',
            allowBlank: false,
            typeAhead: true,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '90%'
        });

        this.actions = new Ext.ux.grid.RowActions({
            header: '',
            tooltip: 'Guardar cambios',
            autoWidth: false,
            width: 30,
            actions: [
                {
                    iconCls: 'rowSave',
                    tooltip: 'Guardar'
                }
            ],
            listeners: {
                action: function (grid, record, action, row, col) {
                    if ((record.get('condicion') != '' && record.get('valor') != '') ||
                        (record.get('condicion') == 'IS NULL' || record.get('condicion') == 'IS NOT NULL')
                    ) {
                        PVD.mostrarMascara('msksavefilter', self.idioma.MsgWait, 'Guardando filtro');
                        var node = self.tpSeguridad.getSelectionModel().getSelectedNode();
                        Ext.Ajax.request({
                            url: 'saveFiltro',
                            params: {
                                idfiltro: record.get('idfiltro'),
                                idrol: self.cbRol.getValue(),
                                idcampo: node.attributes.idcampo,
                                condicion: record.get('condicion'),
                                valor: record.get('valor'),
                                valormostrar: record.get('valormostrar'),
                                logico: record.get('logico'),
                                orden: record.get('orden')
                            },
                            success: function (response, options) {
                                PVD.ocultarMascara('msksavefilter');
                                var response = Ext.decode(response.responseText);
                                if (response.success) {
                                    mostrarMensaje(1, 'El filtro ha sido guardado satisfactoriamente.');
                                    //Caso en que tenia que modificar
                                    if (record.get('idfiltro')) {
                                        var obj = node.attributes.SegFiltro[record.get('id')];
                                        obj.condicion = record.get('condicion');
                                        obj.valor = record.get('valor');
                                        obj.valormostrar = record.get('valormostrar');
                                        obj.logico = record.get('logico');
                                    } else {
                                        record.set('idfiltro', response.idfiltro);
                                        //Caso de adicionar
                                        node.attributes.SegFiltro.push({
                                            idfiltro: response.idfiltro,
                                            idrol: self.cbRol.getValue(),
                                            idcampo: node.attributes.idcampo,
                                            condicion: record.get('condicion'),
                                            valor: record.get('valor'),
                                            valormostrar: record.get('valormostrar'),
                                            logico: record.get('logico')
                                        });
                                    }
                                } else {
                                    mostrarMensaje(3, response.errorMsg);
                                }
                            }.createDelegate(this)
                        });
                    }
                }
            }
        });

        this.stFilters = new Ext.data.SimpleStore({
            fields: [
                {name: 'idfiltro'},
                {name: 'condicion'},
                {name: 'valor'},
                {name: 'valormostrar'},
                {name: 'logico'},
                {name: 'orden'}
            ],
            sortInfo: {field: 'id', direction: 'DESC'}
        });

        this.smFilters = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function (sm) {
                    if (sm.hasSelection()) {
                        this.btnDel.enable();
                    } else {
                        this.btnDel.disable();
                    }
                }.createDelegate(this),
                beforerowselect: function (S, rowIndex, keepExisting, rec) {
                    recordCondiciones = rec;
                    self.rowIndex = rowIndex;
                    if (rowIndex == 0) {
                        self.btnUp.disable();
                    } else {
                        self.btnUp.enable();
                    }
                    if (rowIndex + 1 == self.stFilters.getCount()) {
                        self.btnDown.disable();
                    } else {
                        self.btnDown.enable();
                    }
                }
            }
        });

        this.cmFilters = [
            new Ext.grid.RowNumberer(),
            {
                header: 'Condici&oacute;n',
                width: 120,
                sortable: false,
                fixed: true,
                dataIndex: 'condicion',
                menuDisabled: true,
                editor: this.cbCondicion
            },
            {
                id: 'value' + this.id,
                header: 'Valor',
                width: 230,
                sortable: false,
                fixed: true,
                dataIndex: 'valormostrar',
                menuDisabled: true,
                editor: new Ext.form.TextField({
                    allowBlank: false
                })
            },
            {
                header: 'L&oacute;gico',
                width: 50,
                sortable: false,
                fixed: true,
                dataIndex: 'logico',
                menuDisabled: true,
                editor: this.cbLogico
            },
            this.actions
        ];

        this.gpFilters = new Ext.grid.EditorGridPanel({
            title: 'Listado de filtros',
            disabled: true,
            tbar: [this.btnAdd, this.btnDel, '->', this.btnUp, this.btnDown],
            region: 'east',
            clicksToEdit: 1,
            store: this.stFilters,
            columns: this.cmFilters,
            sm: this.smFilters,
            plugins: [this.actions],
            autoExpandColumn: 'value' + this.id,
            stripeRows: true,
            margins: '5 5 5 0',
            width: '45%',
            listeners: {
                cellclick: function (grid, rowIndex, columnIndex, e) {
                    var record = grid.getStore().getAt(rowIndex);
                    var fieldType = self.tpSeguridad.getSelectionModel().getSelectedNode().attributes.tipodato;
                    var editor;

                    if (columnIndex == 2) {
                        switch (fieldType) {
                            case 'NUMERO':
                                editor = new Ext.form.TextField({
                                    allowBlank: false,
                                    regex: /(^(\{php\}){1}(\w*)+|[\d*])$/
                                });
                                break;
                            case 'bool':
                                editor = new Ext.form.TextField({
                                    allowBlank: false
                                });
                                break;
                            case 'FECHA':
                                editor = new Ext.form.DateField({
                                    format: 'd/m/Y',
                                    readOnly: (record.get('condicion') === 'IS NULL' || record.get('condicion') === 'IS NOT NULL'),
                                    disabled: (record.get('condicion') === 'IS NULL' || record.get('condicion') === 'IS NOT NULL')
                                });
                                break;
                            case 'HORA':
                                editor = new Ext.form.TimeField({
                                    minValue: '0:00am',
                                    maxValue: '11:59pm',
                                    typeAhead: true,
                                    mode: 'local',
                                    triggerAction: 'all',
                                    selectOnFocus: true,
                                    increment: 30,
                                    listeners: {
                                        valid: function (field) {
                                            self.smFilters.getSelected().set('valor', field.getValue());
                                            self.smFilters.getSelected().set('valormostrar', field.getRawValue());
                                        }
                                    }
                                });
                                break;
                            case 'NOMENCLADOR':
                            case 'NOMENCLADORCOMPLEJO':
                            case 'MULTIPLESVALORES':
                                var cbNomenclador = new Ext.components.CmpReccomplejas.ComboBoxNomenclador({
                                    valueField: 'denom',
                                    parent: self,
                                    idconfiguracion: self.config.data.idconfiguracion,
                                    idcampo: record.get('idcampo'),
                                    tipo: fieldType,
                                    listeners: {
                                        'select': function (combo, record, index) {
                                            self.smFilters.getSelected().set('valor', record.get('idvalor'));
                                            self.smFilters.getSelected().set('valormostrar', record.get('denom'));
                                        }
                                    }
                                });
                                editor = cbNomenclador;
                                break;
                            case 'ARBOL':
                                var cbTreeArbol = new Ext.components.CmpReccomplejas.TreeComboBox({
                                    anchor: "98%",
                                    treeConfig: {
                                        rootVisible: false,
                                        loader: new Ext.tree.TreeLoader({
                                            dataUrl: '/reccomplejas/index.php/reccomplejas/cargarValoresArbol',
                                            preloadChildren: false,
                                            listeners: {
                                                beforeload: function(treeLoader, node, response) {
                                                    treeLoader.baseParams.idconfiguracion = self.config.data.idconfiguracion;
                                                    treeLoader.baseParams.idcampo = record.get('idcampo');
                                                }
                                            }
                                        }),
                                        border: false,
                                        autoScroll: true,
                                        root: new Ext.tree.AsyncTreeNode({
                                            id: '-1',
                                            text: 'Arbol',
                                            animate: false,
                                            draggable: false,
                                            expanded: false
                                        }),
                                        listeners: {
                                            click: function(node, e) {
                                                self.smFilters.getSelected().set('valor', node.id);
                                            }
                                        }
                                    }
                                });
                                editor = cbTreeArbol;
                                break;
                            default:
                                editor = new Ext.form.TextField({
                                    allowBlank: false,
                                    maxLength: 255
                                });
                                break;
                        }
                        self.cmFilters[columnIndex].editor = editor;
                        grid.reconfigure(self.stFilters, new Ext.grid.ColumnModel(self.cmFilters));
                    }
                },
                afteredit: function (object) {
                    var fieldType = self.tpSeguridad.getSelectionModel().getSelectedNode().attributes.tipodato;

                    if (object.column == 1 && fieldType == 'FECHA' && object.record.get('condicion') == 'IS NULL') {
                        object.record.set('valor', '');
                        object.record.set('valormostrar', '');
                    }
                    if (object.column == 2 && (fieldType == 'TEXTO' || fieldType == 'NUMERO' || fieldType == 'HORA')) {
                        self.smFilters.getSelected().set('valor', object.value);
                    }
                    if (object.column == 2 && fieldType == 'FECHA') {
                        if (object.record.get('condicion') === 'IS NULL' || object.record.get('condicion') === 'IS NOT NULL') {
                            self.smFilters.getSelected().set('valor', '');
                            self.smFilters.getSelected().set('valormostrar', '');
                        } else {
                            self.smFilters.getSelected().set('valor', object.value.dateFormat('d/m/Y'));
                            object.record.set('valormostrar', object.value.dateFormat('d/m/Y'));
                        }
                    }
                }
            }
        });

        this.tpSeguridad = new Ext.components.CmpReccomplejas.SegCampo({
            title: 'Campos',
            config: this.config,
            parent: self,
            region: 'center',
            margins: '5 5 5 5',
            width: '55%',
            listeners: {
                click: function (n, e) {
                    this.gpFilters.setDisabled(!n.isLeaf());
                }.createDelegate(this)
            }
        });

        this.stRol = new Ext.data.Store({
            autoLoad: true,
            url: 'getRoles',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'denominacion'},
                {name: 'idrol'}
            ])
        });

        this.cbRol = new Ext.form.ComboBox({
            store: this.stRol,
            emptyText: 'Seleccione...',
            width: 250,
            displayField: 'denominacion',
            valueField: 'idrol',
            hiddenName: 'idrol',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            listeners: {
                select: function (cb, rec) {
                    self.gpFilters.idrol = rec.get('idrol');
                    self.tpSeguridad.idrol = rec.get('idrol');
                    self.tpSeguridad.getLoader().load(self.tpSeguridad.getRootNode());
                }.createDelegate(this)
            }
        });

        this.tpSeguridad.getSelectionModel().on('selectionchange', function (sm, n) {
            this.stFilters.removeAll();
            if (n) {
                this.gpFilters.setDisabled(!n.isLeaf());
                if (n.isLeaf()) {
                    if (n.attributes.SegFiltro) {
                        for (var i = 0; i < n.attributes.SegFiltro.length; i++) {
                            var filter = n.attributes.SegFiltro[i];
                            filter.id = i;
                            this.stFilters.add(new Ext.data.Record(filter));
                        }
                    }
                    //Carga las condiciones en funcion del tipo de dato del nodo seleccionado
                    this.stCbCondicion.loadData(this.condiciones[n.attributes.tipodato]);
                }
            } else {
                this.gpFilters.disable();
            }
        }, this);

        this.tbar = ['Seleccione el rol: ', this.cbRol];
        this.items = [this.tpSeguridad, this.gpFilters];
        Ext.components.CmpReccomplejas.Compartimentacion.superclass.initComponent.call(this);

        function subirCondicion() {
            var recordSeleccionado = self.smFilters.getSelected();
            var recordAnterior = self.stFilters.getAt(self.rowIndex - 1);
            var pos = self.stFilters.indexOf(recordSeleccionado);
            var recordAux = recordSeleccionado;
            self.stFilters.remove(recordSeleccionado);
            self.stFilters.insert(pos - 1, recordAux);
            self.smFilters.selectPrevious(false);

            recordSeleccionado.set('orden', self.rowIndex);
            recordAnterior.set('orden', self.rowIndex + 1)

            if ((pos + 1) == self.stFilters.getCount()) {
                var temp = self.stFilters.getAt(pos);
                var valorLogico = temp.get('logico');
                temp.set('logico', '');
                var temp1 = self.stFilters.getAt(pos - 1);
                temp1.set('logico', valorLogico);
            }
        }

        function bajarCondicion() {
            var recordSeleccionado = self.smFilters.getSelected();
            var ordenSelec = recordSeleccionado.get('orden');
            var recordSiguiente = self.stFilters.getAt(self.rowIndex + 1);
            var pos = self.stFilters.indexOf(recordSeleccionado);
            var recordAux = recordSeleccionado;
            self.stFilters.remove(recordSeleccionado);
            self.stFilters.insert(pos + 1, recordAux);

            recordSeleccionado.set('orden', recordSiguiente.get('orden'));
            recordSiguiente.set('orden', ordenSelec);

            if ((pos + 2) == self.stFilters.getCount()) {
                var temp = self.stFilters.getAt(pos + 1);
                var valorLogico = temp.get('logico');
                temp.set('logico', '');
                var temp1 = self.stFilters.getAt(pos);
                temp1.set('logico', valorLogico);
            }
            self.smFilters.selectNext(false);
        }
    }
});