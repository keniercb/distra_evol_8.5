/**
 * @class Ext.contabilidad.util.linkedCombo
 * @extends Ext.form.ComboBox
 * Componente que renderiza las opciones de un combo tradional en una forma
 * diferente y permite ademas agregar botones como bbar dentro del combo
 * para relacionar el conteido de este componente con otros
 * @constructor
 * Crea un nuevo ComboBox.
 * @param {Object} config Opciones de configuracion
 * @category Componente
 * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @version 1.0
 */
Ext.namespace('Ext.contabilidad.util');
Ext.contabilidad.util.linkedCombo = Ext.extend(Ext.form.ComboBox,
    {
        constructor: function (params) {
            if (params.store && params.displayField && params.valueField) {
                /* DEFAULT CONFIG */
                this.i18n = {lbCreateBtn: 'Crear nuevo', loading: 'cargando...'};
                this.listHeight = 150;
                this.singleSelection = true;
                this.fieldLabel = 'Nombre';
                this.perfil = window.parent.perfil;
                this.allowBlank = false;
                this.forceSelection = true;
                this.typeAhead = true;
                this.mode = 'local';
                this.triggerAction = 'all';
                this.enableKeyEvents = true;
                this.anchor = '100%';
                this.onSelect = Ext.emptyFn;
                this.lazyRender = true;
                this.selectedClass = '';
                this.emptyText = 'Seleccione...';
                this.blankText = 'Este campo es obligatorio.';
                this.busyRequest = false;
                this.hideBbar = false;
                this.buttons = [];
                this.indexLastChild = 0;
                this.xtype = 'linkedcombo';
                this.customvalues = [];
                if (params.store)
                    this.url = params.store.url;
                /* END DEFAULT CONFIG */

                this.addEvents(
                    "beforeload",
                    "load",
                    "loadexception"
                );

                Ext.apply(this, params || {});
                /* Defiendo un id dinamico para el tpl */
                if (!this.id) {
                    var alreadyExist = Ext.DomQuery.select('div[id*=lnkcombo]');
                    this.idtpl = 'lnkcombo' + (alreadyExist.length + 1);
                } else {
                    this.idtpl = 'lnkcombo' + this.id;
                }

                this.editable = false;
                this.tpl = '<tpl for="."><div id = \"' + this.idtpl + '\" style = \"height:' + params.listHeight + 'px; !important;\"></div></tpl>';

                this.auxstore = this.store;
                this.store = new Ext.data.SimpleStore({
                    fields: [],
                    data: [[]]
                });

                /*this.loadJs("/configuracion/comun/views/js/Ext.Cont.SearchField", 'SearchField');
                 Ext.Ajax.request({
                 method: "POST",
                 url: "cargaretiquetas",
                 scope: this,
                 callback: function(options, success, response)
                 {
                 this.initialice();
                 this.initializeEvents();
                 this.initFunctions();
                 }
                 });*/

                //var me = this;
                //
                //this.loadJs('/configuracion/comun/views/js/Ext.Cont.SearchField', 'SearchField', function(){
                //    this.initialice();
                //    this.initializeEvents();
                //    this.initFunctions();
                //    return Ext.contabilidad.util.linkedCombo.superclass.constructor.call(me);
                //});

                this.initialice();
                this.initializeEvents();
                this.initFunctions();

                return Ext.contabilidad.util.linkedCombo.superclass.constructor.call(this);
            } else {
                // poner un mensaje
            }
        },

        loadJs: function (jsSrc, id, callback) {
            var me = this;
            if (jsSrc != null) {
                var tagScript = document.createElement("script");
                tagScript.setAttribute("type", "text/javascript");
                tagScript.setAttribute("id", id);
                tagScript.setAttribute("src", jsSrc + ".js");

                if(callback){
                    tagScript.onload = function() {
                        if (typeof callback === 'function') {
                            console.log('callback');
                            callback.call(me);
                        }
                    };
                }

                if (document.getElementById(id)) {
                    console.log('already exist');
                    return;
                }

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
        initialice: function () {
            var _me = this;

//                this.btnAdd = new Ext.Button({
//                    id: 'btnAdd',
//                    icon: this.perfil.dirImg + 'adicionar.png',
//                    iconCls: 'btn',
//                    tooltip: 'Adicionar un nuevo elemento',
//                    text: 'Crear nuevo'
//                });
            this.btnActualizar = new Ext.Button({
                id: 'btnActualizar',
                iconCls: 'actualizar',
                tooltip: 'Actualizar'
            });

            /* insertar en la posicion 0 de los botones definidos a btnActualiza y btnAdd */
            this.buttons.splice(0, 0, this.btnActualizar, '-');

            /* Tree */
            var baseAttrs = {
                leaf: true
            };

            if (!this.singleSelection) {
                baseAttrs.checked = false;
            }
            /* TREE LOADER */
            this.tLoader = new Ext.tree.TreeLoader({
                url: this.url,
                baseAttrs: baseAttrs
            });

            if (this.auxstore.baseParams) {
                this.tLoader.baseParams = this.auxstore.baseParams;
            }

            if (this.auxstore) {
                this.tLoader.processResponse = function (response, node, callback) {
//                        var data = eval("("+response.responseText+")");
                    if (_me.auxstore.reader) {
                        var dirData = _me.auxstore.reader.meta.root;
                        var fields = _me.auxstore.fields.items;
                    } else {
                        var dirData = _me.auxstore.root;
                        var fields = _me.auxstore.fields;
                    }
                    try {
                        var res = Ext.decode(response.responseText);
                        /* cargar los datos al grid auxiliar antes de parser la data. */
                        _me.auxstore.loadData(res, true); // el true es por si lo que se renderiza en un arbol hacer le un append a los datos
                        var data = _me.parseData(res[dirData], fields);
                        node.beginUpdate();
                        for (var i = 0, len = data.length; i < len; i++) {
                            var n = this.createNode(data[i]);
                            if (n) {
                                node.appendChild(n);
                            }
                        }
                        node.endUpdate();
                        if (typeof callback == "function") {
                            callback(this, node);
                        }
                    } catch (e) {
                        this.handleFailure(response);
                    }
                };
            }

            /* ROOT NODE*/
            this.root = new Ext.tree.AsyncTreeNode({
                text: '',
                draggable: false,
                id: '0',
                type: 0,
                expanded: true,
                icon: _me.perfil.dirImg + 'organigrama/empty.gif'
            });

            if (this.auxstore.autoload) {
                this.tLoader.load(this.root, function () {
                });
            }

            this.tree = new Ext.tree.TreePanel({
                layout: 'fit',
                rootVisible: false,
                containerScroll: true,
                autoScroll: true,
                ddScroll: true,
                trackMouseOver: true,
                bodyStyle: 'background-color:#fff;',
                shadow: true,
                animate: true,
                enableDD: false,
                lines: false,
                loader: _me.tLoader,
                root: this.root,
                tbar: _me.toolbar = new Ext.Toolbar({
                    items: [_me.sfBuscar = new Ext.Cont.SearchField({
                        maskRe: _me.maskRe,
                        regex: _me.regex,
                        maxLength: _me.maxLength,
                        fnOnSearch: function () {
                            if (!_me.busyRequest) {
                                _me.load(_me.sfBuscar.getRawValue());
                            }
                        },
                        fnOnClear: function () {
                            if (!_me.busyRequest) {
                                _me.load();
                            }
                        }
                    })]
                }),
                bbar: new Ext.Toolbar({
                    hidden: _me.hideBbar,
                    items: _me.buttons
                })
            });
        },
        parseData: function (data, fields) {
            var _me = this;
            this.realDisplay = undefined;
            this.realValue = undefined;
            /* buscando los valores contra los que se mapean valueField y displayField */
            fields.every(function (item) {
                if (item.name == _me.displayField) {
                    _me.realDisplay = item.mapping || item.name;
                } else if (item.name == _me.valueField) {
                    _me.realValue = item.mapping || item.name;
                }
                /* terminar la busqueda si ya encontro ambos valores */
                var check = !(!Ext.isEmpty(_me.realDisplay) && !Ext.isEmpty(_me.realValue));
                return check;
            });
            /* Creando los indices id y text a cada record del data */
            if (!Ext.isEmpty(_me.realDisplay) && !Ext.isEmpty(_me.realValue)) {
                /* Si trae la propiedad checked entonces defino que el tipo de seleccion no es singleSelection */
                if(Object.keys(data[0]).indexOf('checked') !== -1){
                    _me.singleSelection = false;
                }else{
                    _me.singleSelection = true;
                }
                for (var i = 0; i < data.length; i++) {
                    data[i]['id'] = data[i][_me.realValue];
                    data[i]['text'] = data[i][_me.realDisplay];
                    data[i]['qtip'] = data[i][_me.realDisplay];
                    data[i]['index'] = i;
                    _me.indexLastChild = i;
                }
            }
            return data;
        },
        setBaseParams:function(baseParams){
            this.tLoader.baseParams = baseParams;
        },
        initializeEvents: function () {
            var _me = this;

            this.on({
                scope: _me,
                expand: function (combo) {
                    this.tree.setHeight(this.listHeight);
                    this.sfBuscar.setWidth(this.getSize().width + 10);
                    setTimeout(function () {
                        _me.sfBuscar.focus();
                    }, 5);
                    if (!this.tree.rendered) {
                        this.tree.render(this.idtpl);
                    } /*else {
                        this.showSelection();
                    }*/
                }
            });

            this.tLoader.on({
                scope: _me,
                beforeload: function (treeLoader, node) {
                    this.busyRequest = true;
                    treeLoader.loaded = true;
                    this.loadMask(this.i18n.loading);
                    this.fireEvent("beforeload", treeLoader);
                },
                load: function (loader, node, response) {
                    this.busyRequest = false;
                    delete loader.baseParams.filter;
//                    this.showSelection();
                    if (this.mask) {
                        this.mask.hide();
                    }
                    this.fireEvent("load", response);
                },
                loadexception: function (loader, node, response) {
                    this.fireEvent("loadexception", response);
                }
            });

//                this.btnAdd.on({
//                    scope: _me,
//                    click: function() {
//                        if (typeof (this.fnCreateNew) == 'function') {
//                            var obj = this.fnCreateNew();
//                            obj = {descripcion: 'asdasd',
//                                idclasificador: "41",
//                                idestructuracomun: "100000532",
//                                idsubsistema: "4",
//                                nombre: "Confapertura111",
//                                referenciaclase: "Confapertura111"
//                            };
//                            this.addRecord(obj);
//                        }
//                    }
//                });
            this.btnActualizar.on({
                scope: _me,
                click: function () {
                    this.reset();
                    this.load();
                }
            });

            this.tree.getSelectionModel().on({
                scope: _me,
                selectionchange: function (sm, node) {
                    var selectionid = this.getSelections();
                    var selectiontext = this.getSelections(false, "text");
                    this.setValue(selectionid, selectiontext);
                    if (node) {
                        this.fireEvent('select', this, {data: node.attributes}, node.attributes.index);
                    }
                }
            });

            this.tree.on({
                scope: _me,
                checkchange: function (node, checked) {
                    if (this.fireEvent('beforeselect', {data: node.attributes}, node.attributes.index) !== false) {
//                        if (checked)
//                            node.select();
//                        else
//                            node.unselect();
                    var selectionid = this.getSelections();
                    var selectiontext = this.getSelections(false, "text");
                    this.setValue(selectionid, selectiontext);
                    } else {
                        this.unCheckNode(node);
                        return false;
                    }
                },
                beforeclick: function (node, eventObject) {
                    if (this.fireEvent('beforeselect', {data: node.attributes}, node.attributes.index) !== false) {
                        var selections = this.getSelections(true); //obteniendo los seleccionados en forma de nodo
                        if (Ext.isArray(selections) && selections.length > 0) {
                            for (var i = 0; i < selections.length; i++) {
                                if (node.id != selections[i].id) { // controlando si se da click nuevamente en el mismo nodo
                                    selections[i].getUI().toggleCheck();
                                }
                            }
                        }
                    } else {
                        return false;
                    }
                },
                click: function (node) {
                    if (node.id != 0) {
                        node.getUI().toggleCheck(true);
                        if(Ext.isEmpty(node.attributes.checked)){
                            this.collapse();
                        }
                        //this.fireEvent('select', this, {data: node.attributes}, node.attributes.index);
                    }
                },
                append: function (tree, nodeparent, node, index) {
                    /* Si se adiciono dinamicamente como resultado de la accion del Boton Crear nuevo */
                    if (node.attributes.dinamic) {
//                        this.auxstore. aki se debe agregar el nodo a auxstore
                        if (this.singleSelection) {
                            node.select();
                            this.fireEvent('select', this, {data: node.attributes}, node.attributes.index);
                        } else {
                            node.getUI().toggleCheck(true);
                            this.tree.fireEvent('checkchange', node, true);
                        }
                        this.collapse();
                    }
                }
            });
        },
        /* override */
        getValue: function () {
            if (this.customvalues.length) {
                return (this.singleSelection) ? this.customvalues[0] : this.customvalues;
            } else {
                return '';
            }
        },
        /* override */
        setValue: function (valueField, displayField) {
            this.customvalues = Ext.isArray(valueField) ? valueField : [valueField];
            if (displayField) {
                displayField = Ext.isArray(displayField) ? displayField.join(', ') : displayField;
                Ext.contabilidad.util.linkedCombo.superclass.setValue.call(this, displayField);
                this.value = valueField;
//                Ext.form.ComboBox.superclass.setValue.call(this, displayField);
            } else {
                /* implementar aki un autoload para cuando se haga el set x un valor 
                 * y el store no tenga nada */
                var index = this.auxstore.find(this.valueField, valueField);
                var value = Ext.isArray(valueField) ? valueField.join(', ') : valueField;
                if (index !== -1) {
                    var record = this.auxstore.getAt(index);
                    value = record.data[this.displayField];
                }
                Ext.contabilidad.util.linkedCombo.superclass.setValue.call(this, value);
                this.value = valueField;
//                Ext.form.ComboBox.superclass.setValue.call(this, value);

            }
        },
        /* override */
        reset: function () {
            this.customvalues = [];
            this.tree.getSelectionModel().clearSelections();
            Ext.contabilidad.util.linkedCombo.superclass.reset.call(this);
        },
        /* override */
        getStore: function () {
            return this.auxstore;
        },
        initFunctions: function () {
            var _me = this;
            this.load = function (filter, callback, scope) {
                if (filter) {
                    _me.tLoader.baseParams.filter = filter;
                    _me.sfBuscar.focus(true);
                }
                _me.tLoader.load(_me.root, function () {
                    _me.root.expand();
                    _me.sfBuscar.focus(true);
                    if (typeof callback == "function") {
                        (scope) ? callback.call(scope) : callback.call(_me);
                    }
                });
            };

            this.loadMask = function (msg) {
                if (_me.tree.body) {
                    _me.mask = new Ext.LoadMask(_me.tree.body, {
                        msg: msg
                    });
                    _me.mask.show();
                }
            };

            this.getSelections = function (asNode, attr) {
                if (asNode) {
                    return (_me.singleSelection) ? _me.tree.getSelectionModel().getSelectedNode() : _me.tree.getChecked();
                } else {
                    var atribute = (attr) ? attr : "id";
                    if (_me.singleSelection) {
                        var nodeSel = _me.tree.getSelectionModel().getSelectedNode();
                        if (nodeSel) {
                            return [nodeSel.attributes[atribute]];
                        }
                    } else {
                        var selection = _me.tree.getChecked(atribute);
                        return selection;
                    }
                }
            };

            this.addRecord = function(data) {
                if (data[_me.realValue] && data[_me.realDisplay]) {
                     data['id'] = data[_me.realValue];
                     data['text'] = data[_me.realDisplay];
                     data['qtip'] = data[_me.realDisplay];
                     data['index'] = ++_me.indexLastChild;
                     data['dinamic'] = true;
                     if (!_me.singleSelection) {
                        data['checked'] = true;
                     } 
                     /* adicionar el elemento al store auxiliar */
                     _me.addToStore(data);
                     _me.root.appendChild(new Ext.tree.TreeNode(data));
                    } else {
                        throw new Exception('No existen valores en el objeto para las propiedades \'id\' y \'text\'');
                    }
            };

            this.unCheckNode = function (node) {
                _me.toggleCheck(node, false);
            };

            this.toggleCheck = function (node, checked) {
                node.cascade(function (n) {
                    if (n.attributes.checked == true || n.attributes.checked == false)
                        n.getUI().toggleCheck(checked);
                });
            };

            this.showSelection = function (selection, initNode) {
                var sel = (selection) ? selection : this.getValue();
                if (Ext.isArray(sel) && !Ext.isEmpty(sel)) {
                    sel.every(function (itemid) {
                        var node = _me.tree.getNodeById(itemid);
                        if (node) {
                            (this.singleSelection) ? node.select() : node.getUI().toggleCheck(true);
                        }
                        return true;
                    });
                } else {
                    var node = _me.tree.getNodeById(sel);
                    if (node) {
                        (this.singleSelection) ? node.select() : node.getUI().toggleCheck(true);
                    }
                }
            };
//                this.showSelection = function(selection, initNode) {
//                    var sel = (selection) ? selection : this.getValue();
//                    var node = (initNode) ? initNode : _me.tree.getRootNode();
//                    if (!Ext.isEmpty(sel) && node.hasChildNodes()) {
//                        var cant = 0;
//                        var flagarray = Ext.isArray(sel);
//                        node.cascade(function(n) {
//                            if (n.attributes.id == sel || (flagarray && sel.indexOf(n.attributes.id) !== -1)) {
//                                (this.singleSelection) ? n.select() : n.getUI().toggleCheck(true);
//                                cant++;
//                                if (flagarray) {
//                                    if (sel.length === cant) {
//                                        return false;
//                                    }
//                                }
//                                return false;
//                            }
//                        }, _me);
//                    }
//                };

            this.hasSelection = function (returnSelection, asNode) {
                var selections = _me.getSelections(asNode);
                if (!_me.singleSelection) {
                    if (selections.length !== 0) {
                        return (returnSelection) ? selections : true;
                    } else {
                        return false;
                    }
                    return (selections.length !== 0) ? ((returnSelection) ? selections : true) : false;
                } else {
                    return (!Ext.isEmpty(selections)) ? ((returnSelection) ? selections : true) : false;
                }
            };

            this.getElementById = function (id) {
                if (!isNaN(id)) {
                    var node = _me.tree.getNodeById(id);
                    delete node.attributes.id;
                    delete node.attributes.text;
                    delete node.attributes.leaf;
                    delete node.attributes.index;
                    delete node.attributes.qtip;
                    return node.attributes;
                }
                return undefined;
            };

            this.setUrl = function (url) {
                _me.url = url;
                _me.tLoader.url = url;
            };

            this.setStore = function (newStore, defaultVal) {
                _me.auxstore = newStore;
                _me.setUrl(newStore.url);

                if (defaultVal) {
                    _me.setVal(defaultVal);
                }

                (_me.tree.rendered) ? _me.reload() : _me.reload(false, true);
            };

            this.reload = function (idnode, keepSelection, baseParams, callback) {
                var values = _me.getValue();
                if (baseParams) {
                    _me.tLoader.baseParams = baseParams;
                }
                if (idnode) {
                    // actualizando un nodo en especifico
                    this.tLoader.load(this.tree.getNodeById(idnode).parentNode, function (component, node) {
                        node.expand();
                        if (node.findChild("id", idnode))
                            node.findChild("id", idnode).expand();
                        if (keepSelection && !Ext.isEmpty(values)) {
                            _me.setValue(values);
                        }
                        /* Si se le define un callbak */
                        if (typeof callback == "function") {
                            callback.call(this);
                        }
                    });
                } else {
                    // actualizando el nodo raiz
                    this.tLoader.load(this.root, function () {
                        if (keepSelection && !Ext.isEmpty(values)) {
                            _me.setValue(values);
                        }
                        /* Si se le define un callbak */
                        if (typeof callback == "function") {
                            callback.call(this);
                        }
                    });
                    //this.tree.expandAll();
                }
            };

            this.listRendered = function () {
                return _me.tree.rendered;
            };

            this.setVal = function (defaultVal) {
                _me.customvalues = defaultVal;
            };
            
            this.addToStore =  function(data){
                /* crear el record para agregarlo al store */
                var fields = (_me.auxstore.reader) ? _me.auxstore.fields.items:
                        _me.auxstore.fields;
                var Record = Ext.data.Record.create(fields);
                
                var rec = new Record(data);
                _me.auxstore.add([rec]);
            };
        }
    });

//Ext.reg('linkedcbx');
