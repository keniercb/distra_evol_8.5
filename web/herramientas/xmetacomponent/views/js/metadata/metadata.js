Ext.ns("Ucid");
Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = {};

Ucid.nomTreeConcepts = Ext.extend(Ext.tree.TreePanel, {
    autoScroll: true,
    enableDD: false,
    border: false,
    region: "west",
    height: 120,
    minHeight: 120,
    width: 150,
    id: 'west-region-container',
    layout: 'fit',
    rootVisible: false,
    split: true,    
    loader: new Ext.tree.TreeLoader({
        dataUrl: 'cargarnom'
    }),
    root: new Ext.tree.AsyncTreeNode({
        text: 'Nomencladores',
        draggable: false,
        id: '0',
        hidden: true
    }),
    initComponent: function() {
        Ucid.nomTreeConcepts.superclass.initComponent.apply(this, arguments);
    },
    initnomTreeConceptsEvent: function() {

    }
});




Ucid.nomTreeNotation = Ext.extend(Ext.tree.TreePanel, {
    autoScroll: true,
    enableDD: false,
    border: false,
    height: 120,
    minHeight: 120,
    width: 150,
    baseParams: {
        vale: "todo"
    },
    initComponent: function() {
        Ext.apply(this, {
            root: new Ext.tree.AsyncTreeNode({
                text: 'Nomencladores',
                draggable: false,
                id: '0'
            }),
            loader: new Ext.tree.TreeLoader({
                dataUrl: 'crudtree',
                clearOnLoad: true,
                baseParams: this.baseParams
            })
        });
        Ucid.nomTreeConcepts.superclass.initComponent.apply(this, arguments);
    },
    setBaseParam: function(value) {
        this.getLoader().baseParams = value;
    },
    initnomTreeConceptsEvent: function() {
    }
});
//******************BEGIN CLASS******************************************************
Ucid.dinamicGrid = Ext.extend(Ext.grid.GridPanel, {
    initComponent: function() {
        this.store = new Ext.data.Store();
        Ext.apply(this, {
            loadMask: 'Cargando datos del grid...',
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: this.store,
                displayInfo: true
            }),
            frame: true,            
            viewConfig: {
                forceFit: true
            },
            cm: new Ext.grid.ColumnModel({}),
            sm: new Ext.grid.RowSelectionModel({singleSelect:true})
        });
        Ucid.dinamicGrid.superclass.initComponent.apply(this, arguments);
    },
    loadGridConfig: function(params) {
        Ext.Ajax.request({
            url: this.config_url,
            params: params,
            callback: this.configLoaded.createDelegate(this)
        });
    },
    configLoaded: function(options, success, response) {
        responseData = Ext.decode(response.responseText);
        if (responseData.rd && responseData.cm) {
            this.reconfigureGrid(responseData);
        }
    },
    reconfigureGrid: function(configuration) {
        var store = new Ext.data.JsonStore({
            url: "crud",
            baseParams: {
                "comand": "load"
            },
            totalProperty: "total",
            root: "data",
            fields: configuration.rd
        });
        Ext.apply(store.baseParams, this.params);
        this.reconfigure(store, new Ext.grid.ColumnModel(configuration.cm));
        this.fireEvent("ready", this);
    }
});

Ucid.dinamicForm = Ext.extend(Ext.FormPanel, {
    config_url: "formconfig",
    comand: "create",
    staticForm: {},
    initComponent: function() {
        this.form_reader = new Ext.data.JsonReader();
        Ext.apply(this, {
            labelAlign: 'top',
            frame: true,
            reader: this.form_reader,
            autoHeight: 50,
            bodyStyle: 'padding:5px 5px 0'
        });
        Ucid.dinamicForm.superclass.initComponent.apply(this, arguments);
        this.loadFormConfig(this.params);
    },
    loadFormConfig: function(params) {
        Ext.Ajax.request({
            url: this.config_url,
            params: params,
            callback: this.formConfigLoaded.createDelegate(this)
        });
    },
    formConfigLoaded: function(options, success, response) {
        responseData = Ext.decode(response.responseText);
        if (responseData.items) {
            this.createDinamicColumn(responseData);
        }
    },
    /**
     * Generating form UI dinamically
     * @param {} data
     */
    createDinamicColumn: function(data) {
        var h2 = 0, h3 = 0;

        this.dinamic = this.add({
            xtype: "panel",
            layout: "column",
            autoHeight: true,
            items: this.dameArrayItems(data.items, this.columnCount)
        });
        if (this.staticForm) {
            this.generateStaticForm();
        }
        this.fireEvent("formcreated", this);
    },
    generateStaticForm: function() {
        var array = [];
        if (this.staticForm) {
            this.StaticContainer = new Ext.ComponentMgr.create(this.staticForm.containerConfig, this.staticForm.container)
            var elements = this.staticForm.elements;
            for (var i = 0; i < this.staticForm.cantCol; i++) {
                if (elements.length = this.staticForm.cantCol) {
                    array.push(this.generateColumnstatic(this.staticForm.cantCol, elements[i]))
                }
                this.StaticContainer.add({
                    layout: "column",
                    autoHeight: true,
                    items: array
                })

            }
            this.add(this.StaticContainer);
        }
    },
    generateColumnstatic: function(noCol, elements) {
        if (noCol == 1)
            return {
                columnWidth: 1,
                layout: 'form',
                items: elements
            };
        if (noCol == 2)
            return {
                columnWidth: .5,
                layout: 'form',
                items: elements
            };
    },
    dameArrayItems: function(objitems, columnCount) {
        var cantidad = objitems.length;
        var cantcol = objitems.length;

        for (var i = 0; i < cantidad; i++) {
            if (objitems[i].xtype == 'hidden')
                cantcol--;
            if (objitems[i].store)
                objitems[i].store = Ext.decode(objitems[i].store);
            if (objitems[i].regex)
                objitems[i].regex = eval(objitems[i].regex);
            if(objitems[i].xtype == 'datefield'){
                objitems[i].invalidText = 'Formato: dd/mm/aa';
            }
        }
        var arrayItems = new Array();
        for (var i = 0; i < cantidad; i++) {
            if (objitems[i].xtype == "combo") {
                objitems[i].tpl = '<tpl for="."><div ext:qtip="{' + objitems[i].displayField + '}" class="x-combo-list-item">{' + objitems[i].displayField + '}</div></tpl>';
            }
            if (objitems[i].xtype == "textarea") {
                arrayItems.push(this.configureColumn(1, objitems[i]));
            }
            else {
                arrayItems.push(this.configureColumn(cantcol, objitems[i]));
            }
        }
        return arrayItems;
    },
    configureColumn: function(noCol, objitems) {
        if (noCol == 1)
            return {
                columnWidth: 1,
                layout: 'form',
                items: objitems
            };
        if (noCol == 2)
            return {
                columnWidth: .5,
                layout: 'form',
                items: objitems
            };
        return {
            columnWidth: .33,
            layout: 'form',
            items: objitems
        };
    },
    send: function() {
        var scope = this;
        if (this.getForm().isValid()) {
            this.getForm().submit({
                url: "crud",
                waitMsg: 'Salvando datos ...',
                params: this.params,
                failure: function(form, action) {
                    if (action.result.codMsg == 1 || action.result.codMsg == 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje)
                        scope.getForm().reset();
                        scope.fireEvent("sended", scope);
                    }
                }
            });
        }
        else
            mostrarMensaje(6, 'Los campos indicados son obligatorios.');
    }
});

//---------------------------------END CLASS-------------------------------------------

Ucid.nom_xmetacomponent = Ext.extend(Ext.Panel, {
    layout: "border",
    columnCount: null,
    minHeight: 200,
    keys: [
                {
                    key: 'i',
                    alt: true,
                    ctrl: false,
                    shift: false,
                    handler: function (k, e) {
                      Ext.getCmp("btnAdd").fireEvent('click');
                    }
                },{
                    key: 'm',
                    alt: true,
                    ctrl: false,
                    shift: false,
                    handler: function (k, e) {
                      Ext.getCmp("btnUpd").fireEvent('click');
                    }
                },{
                    key: 46,
                    alt: false,
                    ctrl: false,
                    shift: false,
                    handler: function (k, e) {
                      Ext.getCmp("btnDel").fireEvent('click');
                    }
                }
            ],
    initComponent: function() {

        Ucid.nom_xmetacomponent.superclass.initComponent.apply(this, arguments);
        this.grid = new Ucid.dinamicGrid({
            config_url: "cargarcampos"          

        });
        this.treeNotation = new Ucid.nomTreeNotation();
        this.centerPanel = Ext.ComponentMgr.create({
            minHeight: 200,
            xtype: "panel",
            region: "center",
            id: 'center-region-container',
            activeItem: 0,
            
            tbar: this.createToolbar(),
            layout: "card",
            items: [{
                    xtype: "panel",
                    html: "Para ver el concepto haga clic en el"
                }, this.grid, this.treeNotation
            ],keys: [
                {
                    key: 'h',
                    alt: true,
                    ctrl: false,
                    shift: false,
                    handler: function (k, e) {
                        cargarAyuda();
                    }
                }
                
            ]

        });

        this.tree = new Ucid.nomTreeConcepts();
        this.add(this.tree);
        this.add(this.centerPanel);
        
        this.initNomMetacomponentEvents.call(this);
        

    },
    changeConcept: function(node) {
        var title = "";
        this.concept_active = node.id;
        Ext.getCmp("btnAdd").disable();
        Ext.getCmp("btnUpd").disable();
        Ext.getCmp("btnDel").disable();
        var scope = this;
        if (node.attributes.tree == 0) {
            this.state = "grid";
            //
            this.centerPanel.layout.setActiveItem(1);
            this.grid.loadGridConfig({
                node: node.id
            });
            this.loadMask('Cargando configuraci&oacute;n...', this.grid);
        }
        else {
            this.state = "tree";
            this.treeNotation.getRootNode().setText(node.attributes.alias);
            this.treeNotation.getRootNode().collapse();
            this.treeNotation.getRootNode().fireEvent("beforeload");
            this.treeNotation.getLoader().load(this.treeNotation.getRootNode(), function() {
                scope.treeNotation.getRootNode().expand();
            });
            this.centerPanel.layout.setActiveItem(2);
            this.loadMask('Cargando configuracion...', this.grid);
        }
    },
    initNomMetacomponentEvents: function() {

        this.tree.on("click", this.changeConcept, this);
        this.grid.on("ready", this.gridReady, this);
        this.on("beforedelete", function(obj, param) {
            if (this.state == "grid") {
                Ext.apply(param, this.record.data);
                Ext.apply(param, {
                    node: this.concept_active
                })
                param = Ext.encode(param);
            }
            else if (this.state == "tree") {
                for (prop  in this.recordTree.data) {
                    if (prop != "loader") {
                        param[prop] = this.recordTree.data[prop]
                    }
                }
                Ext.apply(param, {
                    node: this.concept_active
                })
                param = Ext.encode(param);
            }
        }, this);

        this.treeNotation.getRootNode().on("beforeload", function() {
            this.treeNotation.setBaseParam({
                nodeconcept: this.concept_active
            });
        }, this)

        this.treeNotation.on("click", function(n) {
            this.lastNode = n;
            var object = [];
            this.enableAddButton();
            Ext.getCmp("btnUpd").enable();
            Ext.getCmp("btnDel").enable();
            if (n.attributes) {
                this.updatetree = {};
                Ext.apply(this.updatetree, n.attributes)
                for (prop in this.updatetree) {
                    var json = {};
                    json["name"] = prop;
                    object.push(json);
                }
                var record = Ext.data.Record.create(object);
                this.recordTree = new record(this.updatetree);
            }
            this.denomNode = {};
            this.denomNode["idnodopadre"] = n.id;
        }, this)

        /*this.on("enableupdatebutton",this.enableUpdButton,this);
         this.on("enabledeletebutton",this.enableDelButton,this);
         
         this.winMetaCmp.on("beforeshow",function(win){
         var my_act = "";
         switch(this.action){
         case "create":
         my_act = "Adicionar ";
         break;
         case "update":
         my_act = "Modificar ";
         break;
         }
         //if(!this.title)this.title = "";
         win.setTitle(my_act+this.title);
         },this)*/
    },
    /**
     * Esta funcion se ejecuta luego que el grid se configura
     */
    gridReady: function(grid) {
        this.hideMask();
        Ext.apply(grid.store.baseParams, {
            start: 0,
            limit: 10
        });
        grid.store.load({
            params: {
                node: this.concept_active
            }
        });
        this.grid.getStore().on("load", function() {
            Ext.getCmp("btnAdd").enable();
        }, this)
        grid.getSelectionModel().on('rowselect', function(sm, ri, rd) {
            this.enableUpdButton();
            this.enableDelButton();
            this.record = rd;
        }, this);
    },
    initWindow: function(action, param) {
        var comand = (action == 'Adicionar') ? 'create' : 'update';
        var params = param || {
            comand: comand,
            node: this.concept_active
        };
        var form;
        var staticForm = this.staticForm || {};
        this.loadMask('Cargando interfaz din&aacute;mica...');

        this.btnCancelar = new Ext.Button({
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip:"Cancelar <b>(Alt+X)</b>",
            scope: this,
            handler: function() {
                this.winMetaCmp.close();
            }
        });        
        if(action != "Modificar"){            
            this.btnAplicar = new Ext.Button({
            //icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
            tooltip:"Aplicar  <b>(Ctrl+Alt+P)</b>",  
            text: 'Aplicar',
            scope: this,
            id:'btnAplicar',
            handler: function() {
                form.send();
            }
            });
        }
        this.btnAceptar = new Ext.Button({
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            text: 'Aceptar',
            scope: this,
            id:'btnAceptar',
            tooltip:"Aceptar <b>(Enter)</b>",
            handler: function() {
                form.send();
                form.on("sended", function() {
                    this.winMetaCmp.close();
                }, this);
            }
        })

        this.winMetaCmp = new Ext.Window({
            modal: true,
            closeAction: 'close',
            layout: 'fit',
            id:'winMetaCmp',
            title: action +' nomenclador' ,
            width: 500,
            //heigh:200,
            autoHeight: true,
            items: [form = new Ucid.dinamicForm({
                    columnCount: this.columnCount,
                    params: params,
                    staticForm: staticForm
                })],
            buttons:(action == "Modificar")?[this.btnCancelar,/*this.btnAplicar,*/ this.btnAceptar]:[this.btnCancelar,this.btnAplicar, this.btnAceptar],
            keys: [
                {
                    key: 'p',
                    alt: true,
                    ctrl: true,
                    shift: false,
                    handler: function () {                        
                       if(Ext.getCmp("btnAplicar").disabled == false){
                            form.send();
                        }

                    }
                },{
                    key: 13,
                    alt: false,
                    ctrl: false,
                    shift: false,
                    handler: function () {
                
                        if(Ext.getCmp("btnAceptar").disabled == false){
                            form.send();
                            form.on("sended", function() {
                                Ext.getCmp('winMetaCmp').close();
                            }, this)
                        }

                    }
                },{
                    key: 'x',
                    alt: true,
                    ctrl: false,
                    shift: false,
                    handler: function () {                 
                        Ext.getCmp('winMetaCmp').close();
                    }
                }

            ]
        });
        form.on("formcreated", function(form, panel) {
            this.winMetaCmp.show();
            this.hideMask();
            var object = [];
            if (action == 'Modificar') {
                if (this.state == "grid") {
                    form.getForm().loadRecord(this.record)
                }
                else if (this.state == "tree") {
                    form.getForm().loadRecord(this.recordTree);
                }
            }
            else
                form.getForm().reset();
            //this.winMetaCmp.setSize(size);
        }, this);

        form.on("sended", function() {
            var scope = this;
            if (this.state == "grid") {
                this.grid.store.reload();
            }
            else if (this.state == "tree") {
                if (action == 'Modificar')
                    this.lastNode = this.lastNode.parentNode;
                else {
                    this.lastNode.leaf = false;
                }
                var exp = this.lastNode;
                this.treeNotation.getLoader().load(this.lastNode, function() {
                    exp.expand()
                });
            }
            Ext.getCmp("btnUpd").disable();
            Ext.getCmp("btnDel").disable();
        }, this);
    },
    createToolbar: function() {
        var tbar = [{
            text: 'Ad<U>i</U>cionar',
                disabled: true,
                id: 'btnAdd',
                //icon: perfil.dirImg + 'adicionar.png',
                iconCls: 'adicionar',                
                tooltip:'Adicionar nomenclador<b>(Alt+I)</p>',
                listeners: {
                    click: {
                        scope: this,
                        fn: this.onBtnAddClick
                    }
                }
            }, {
                text: '<U>M</U>odificar',
                disabled: true,
                id: 'btnUpd',
                //icon: perfil.dirImg + 'modificar.png',
                iconCls: 'modificar',
               tooltip:'Modificar nomenclador<b>(Alt+M)</p>',
                listeners: {
                    click: {
                        scope: this,
                        fn: this.onBtnModClick
                    }
                }
            }, {
                text: 'Eliminar',
                disabled: true,
                id: 'btnDel',
                //icon: perfil.dirImg + 'eliminar.png',
                iconCls: 'eliminar',
                tooltip:'Eliminar nomenclador<b>(DEL)</p>',
                listeners: {
                    click: {
                        scope: this,
                        fn: this.onBtnDelClick
                    }
                }
            }, '->',this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            iconCls: 'ayuda',
            text: '<b>Ayuda</b>',
            disabled: false,
            toolTip: 'Ayuda <b>(Alt+H)</b>',
            //icon: perfil.dirImg + 'ayuda.png',
            nextTab: 'btn-adicionar-aviso',
            menu: new Ext.menu.Menu({
                id: 'mainMenu',
                items: [
                    {
                        handler: function () {
                           cargarAyuda();
                        },
                        text: 'Ayuda',
                        id: 'btnAyuRel',
                        //icon: perfil.dirImg + 'ayuda.png',
                        iconCls: 'ayuda',
                        tooltip: 'Ayuda del sistema'
                    },
                    {
                        text: 'Acerca de',
                        id: 'acercade',
                        //icon: perfil.dirImg  + 'info.png',
                        iconCls: 'info',
                        tooltip: "Acerca de <b>(Alt+...s)</b>",
                        handler: function () {

                            var uri = "herramientas/xmetacomponent";
                            acercaDe.show(uri);
                        }}
                ]
            })

        })
        ];        
        return tbar;
    },
    onBtnAddClick: function() {
        if (this.state == "grid")
            this.initWindow('Adicionar');
        else if (this.state == "tree") {
            var comand = 'create';
            var param = {
                comand: comand,
                node: this.concept_active
            };
            Ext.apply(param, this.denomNode);
            this.initWindow("Adicionar", param);
        }
    },
    onBtnModClick: function() {
        if (this.state == "grid")
            this.initWindow('Modificar');
        else if (this.state == "tree") {
            var comand = 'update';
            var param = {
                comand: comand,
                node: this.concept_active
            };
            Ext.apply(param, this.denomNode);
            this.initWindow("Modificar", param);
        }
    },
    onBtnDelClick: function() {
        mostrarMensaje(2, '¿Est&aacute; seguro que quiere eliminar el dato seleccionado?', elimina);
        var scope = this;
        var params = {
            "comand": "delete"
        };
        this.fireEvent("beforedelete", this, params);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                scope.loadMask('Eliminado los datos...');
                Ext.Ajax.request({
                    url: "crud",
                    params: params,
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1 || responseData.codMsg == 3) {
                            scope.hideMask();
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            if (scope.state == 'grid') {
                                scope.grid.getStore().reload();
                                scope.grid.getSelectionModel().clearSelections();
                            }
                            else {
                                scope.lastNode = scope.lastNode.parentNode;
                                var exp = scope.lastNode;
                                scope.treeNotation.getLoader().load(scope.lastNode, function() {
                                    exp.expand()
                                });
                            }

                            Ext.getCmp("btnUpd").disable();
                            Ext.getCmp("btnDel").disable();
                        }
                    }
                });
            }
        }
    },
    getSelect: function(multi) {
        var sm = this.grid.getSelectionModel();
        if (!multi)
            return sm.getSelected();
        else
            return sm.getSelections();
    },
    selectedRow: function(sm) {
        this.fireEvent('enableupdatebutton', this);
        this.fireEvent('enabledeletebutton', this);
    },
    enableUpdButton: function() {
        if (Ext.getCmp("btnUpd"))
            Ext.getCmp("btnUpd").enable();
    },
    enableAddButton: function() {
        if (Ext.getCmp("btnAdd"))
            Ext.getCmp("btnAdd").enable();
    },
    enableDelButton: function() {
        if (Ext.getCmp("btnDel"))
            Ext.getCmp("btnDel").enable();
    },
    loadMask: function(msj, cmp) {
        
        var componente = (!cmp) ? Ext.getBody() : cmp.body;
        this.lMask = new Ext.LoadMask(componente, {
            msg: msj
        });
        this.lMask.show();
    },
    hideMask: function() {
        this.lMask.hide();
    }
});
function cargarInterfaz() {

    var prueba = new Ucid.nom_xmetacomponent({
        columnCount: 2,
        staticForm: {
            cantCol: 2,
            container: "panel",
            containerConfig: {
                title: ""
            },
            elements: []
        }
    });
  
    vpIncidencia = new Ext.Viewport({
        layout: 'fit',
        items: prueba
    });
    
}
function cargarAyuda() {
    var title = 'Gestión de nomencladores';
    var referencia = 'nomenclador';
    help.show(title, referencia);
}
Ext.onReady(function() {

    /*var date = new Ext.form.DateField({fieldLabel:"fecha na"});
     var nombre = new Ext.form.TextField({fieldLabel:"Nombre"});
     var edad = new Ext.form.NumberField({fieldLabel:"Edad"})*/
    var prueba = new Ucid.nom_xmetacomponent({
        columnCount: 2,
        minHeight: 200,
        staticForm: {
            cantCol: 2,
            container: "panel",
            containerConfig: {
                title: ""
            },
            elements: []
        }
    });
    vpIncidencia = new Ext.Viewport({
        minHeight: 200,
        layout: 'fit',
        items: prueba
    });
    vpIncidencia.resize(this);
 
});

// cargarInterfaz();
//cargarInterfaz();
// cargarInterfaz();
