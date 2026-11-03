Ext.define("Msg.util",{
    statics:{
        MostrarMsg : function(code,title,text,fn,scope){
            /*Ext.Msg.INFO // 1
             Ext.Msg.WARNING		//2
             Ext.Msg.ERROR  //3
             Ext.Msg.QUESTION  //4*/
            if(fn == null){var func = function(){msg.close()};}
            else{func = fn;}
            var  band = 0;
            var idCancel, idAcept;
            idCancel = Ext.id();
            idAcept = Ext.id();

            var btn_cancelar = {
                type:'button',
                id:idCancel,
                text:'Cancelar',
                iconCls: 'cancelar',
                prevTab: idAcept,
                handler: function(){
                    Ext.bind(func,scope)('NO');
                    acept.destroy();
                    cancel.destroy();
                    msg.close()

                },
                scope: this
            };
            /* var cut = new Ext.KeyMap(Ext.getBody(), {
             key:Ext.EventObject.ENTER , // or Ext.EventObject.ENTER
             fn: function(){
             Ext.bind(func,scope)();
             msg.close();

             },
             scope: this
             });*/

            var btn_aceptar = {
                type:'button',
                id:idAcept,
                text:'Aceptar',
                iconCls: 'aceptar',
                nextTab: idCancel,
                handler:function(){
                    Ext.bind(func,scope)('YES');
                    acept.destroy();
                    cancel.destroy();
                    msg.close();

                } ,

                scope: this
            };
            if(code == 1){
                var	option = [btn_aceptar];
                var icon = Ext.Msg.INFO;
            }
            if(code == 2){
                var	option = [btn_aceptar];
                var icon = Ext.Msg.WARNING;
            }
            if(code == 3){
                var	option = [btn_aceptar];
                var icon = Ext.Msg.ERROR;
            }
            if(code == 4){
                var	option = [btn_cancelar,btn_aceptar];
                var icon = Ext.Msg.QUESTION;
            }



            var msg = new Ext.window.MessageBox({
                buttons: option,
                buttonAlign : 'center'

            }).show({
                    title: title,
                    msg: text,
                    scope : scope,
                    icon: icon
                });
            var acept = new Ext.util.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.ENTER , // or Ext.EventObject.ENTER
                fn: function(){
                    Ext.bind(func,scope)('YES');
                    msg.close();
                    acept.destroy();
                    cancel.destroy();
                },
                scope:this

            });
            var cancel = new Ext.util.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.X,
                alt: true,
                fn: function(){
                    Ext.bind(func,scope)('NO');
                    msg.close();
                    acept.destroy();
                    cancel.destroy();
                },
                scope:this

            });

        },
        createBox: function (code,t, s){
            var resp = '';
            if(code == 3){resp ='<div class="msg"><div id="imgError"></div><h3>' + t + '</h3><p>' + s + '</p></div>';}
            if(code == 1){resp ='<div class="msg"><div id="imgOk"></div><h3>' + t + '</h3><p>' + s + '</p></div>';}

            return resp
        },
        msg : function(code,title, format){
            var msgCt ;
            if(!msgCt){
                if(code == 1) msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
                if(code == 3) msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-error'}, true);

                var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 2));
                var m = Ext.DomHelper.append(msgCt, this.createBox(code,title, s), true);
                m.hide();
                m.slideIn('t').ghost("t", { delay: 3000, remove: true});
            }

        }
    }

});/**
 * Add basic filtering to Ext.tree.Panel. Add as a mixin:
 * mixins: {
* treeFilter: 'MyApp.lib.TreeFilter'
* }
 */
Ext.define('Packed.lib.TreeFilter', {
    filterByText: function(text) {
        this.filterBy(text, 'text');
    },


    /**
     * Filter the tree on a string, hiding all nodes expect those which match and their parents.
     * @param The term to filter on.
     * @param The field to filter on (i.e. 'text').
     */
    filterBy: function(text, by) {

        this.clearFilter();

        var view = this.getView(),
            me = this,
            nodesAndParents = [];

// Find the nodes which match the search term, expand them.
// Then add them and their parents to nodesAndParents.
        this.getRootNode().cascadeBy(function(tree, view){
            var currNode = this;

            if(currNode && currNode.data[by] && currNode.data[by].toString().toLowerCase().indexOf(text.toLowerCase()) > -1) {
                me.expandPath(currNode.getPath());

                do {
                    nodesAndParents.push(currNode.id);
                    currNode = currNode.parentNode;
                } while (currNode);
            }
        }, null, [me, view]);

// Hide all of the nodes which aren't in nodesAndParents
        this.getRootNode().cascadeBy(function(tree, view){
            var uiNode = view.getNodeByRecord(this);

            if(uiNode && !Ext.Array.contains(nodesAndParents, this.id)) {
                Ext.get(uiNode).setDisplayed('none');
            }
        }, null, [me, view]);
        if(nodesAndParents.length == 0){
           mostrarMensaje(1, this.emptyText);
        }
    },


    clearFilter: function() {
        var view = this.getView();

        this.getRootNode().cascadeBy(function(tree, view){
            var uiNode = view.getNodeByRecord(this);

            if(uiNode) {
                Ext.get(uiNode).setDisplayed('table-row');
            }
        }, null, [this, view]);
    }
});
Ext.define("Packed.model.dependencias", {
    extend : 'Ext.data.Model',
    fields  : [
        {name : 'name'},
        {name : 'nameTags'},
        {name : 'url'}
    ]
});Ext.define("Packed.model.packs", {
    extend : 'Ext.data.Model',
    fields  : [
        {name : 'name'},
        {name : 'version'},
        {name : 'description'}
    ]
});Ext.define('Packed.store.dependencias', {
    require : [
        'Ext.data.Store'
    ],
    extend  : 'Ext.data.Store',
    model: 'Packed.model.dependencias',
    proxy   : {
        type   : 'ajax',
        url : 'getRequireIsNotPackages',
        reader : {
            type          : 'json',
            root          : 'datos',
            totalProperty : 'cantidad'
        }

    }

});

Ext.define('Packed.store.pack', {
    require : [
        'Ext.data.Store'
    ],
    extend  : 'Ext.data.Store',
    model: 'Packed.model.packs',

    proxy   : {
        type   : 'ajax',
        url : 'getListPackages',
        reader : {
            type          : 'json',
            root          : 'datos',
            totalProperty : 'cantidad'
        }

    },
    autoLoad: true,

    listeners:{
        load:function(){
            //console.log(this.data.length);
            Ext.getCmp('btnElimPack').setDisabled(true);
            Ext.getCmp('btnPublicar').setDisabled(true);
            if(this.data.length==0 && !Ext.getCmp('textfieldBuscarTree').isDisabled()){
                    mostrarMensaje(1,'No existen datos que se correspondan con los criterios de búsqueda especificados.');
            }
        }
    }
});
/**
 * Created by adrian on 3/11/14.
 */
Ext.define("Packed.views.PanelCenter", {
    require: [
        "Ext.panel.Panel"
    ],
    extend: "Ext.panel.Panel",
    alias: "widget.panelCenter",
    //title: 'Navigation',
    region: 'center',
    layout: 'fit',
    width: 880,
    margins: '5 0 0 0',
    //collapsible: true,
    //collapseMode: 'mini',
    split: true,

    initComponent: function () {
        this.storeGridPacked = Ext.create('Packed.store.pack');

        this.items = [
            Ext.create('Ext.grid.Panel', {
                anchor: '100%',
                //height: 430,
                name: 'gridPacked',
                id: 'gridPacked',
                frame: true,
                multiSelect : true,
                store: this.storeGridPacked,
                //iconCls: 'icon-user',
                viewConfig: {
                    loadingText: Zeolides.etiquetas.textCargando
                },
                columns: [{
                    header: Zeolides.etiquetas.headerNamePack,
                    width: 200,
                    sortable: true,
                    dataIndex: 'name'
                }, {
                    text: Zeolides.etiquetas.headerVersionPack,
                    width: 200,
                    sortable: true,
                    dataIndex: 'version',
                    renderer: function(value, metaData, record){
                        var type = record.raw.typeVersion;
                        return value.substring(1) + '-' + type;
                    }

                }, {
                    text: Zeolides.etiquetas.headerDescripPack,
                    //width: 450,
                    sortable: true,
                    dataIndex: 'description',
                    flex: 1

                }], dockedItems: [{
                    xtype: 'toolbar',
                    items: [Zeolides.etiquetas.namePack, {
                        xtype: 'textfield',
                        name: 'searchFieldPack',
                        id: 'searchFieldPack',
                        emptyText : Zeolides.etiquetas.emptyTextSearch,
                        hideLabel: true,
                        width: 200

                    }, {
                        text: Zeolides.etiquetas.btnBuscar,
                        iconCls: 'buscar',
                        disabled:true,
                        tooltip : Zeolides.etiquetas.tooltipBtnBuscar,
                        name: 'textfieldBuscarTree',
                        id: 'textfieldBuscarTree',
                        action: 'filtrarGridPack'

                    }, {

                        text: Zeolides.etiquetas.btnLimpiar,
                        id: 'clearFiltroGridPack',
                        disabled:true,
                        iconCls: "limpiar",
                        scope: this,
                        tooltip : Zeolides.etiquetas.tooltipBtnLimpiar,
                        action: 'limpiarFiltroGridPack'

                    }]
                }],
                bbar: Ext.create('Ext.PagingToolbar', {
                    store: this.storeGridPacked,
                    displayInfo: true,
                    emptyMsg: Zeolides.etiquetas.emptyMsgToolbar,
                    displayMsg: Zeolides.etiquetas.displayMsgToolbar,
                    beforePageText: Zeolides.etiquetas.beforePageTextToolbar,
                    afterPageText: Zeolides.etiquetas.afterPageTextToolbar,
                    firstText: Zeolides.etiquetas.firstTextToolbar,
                    prevText:  Zeolides.etiquetas.prevTextToolbar,
                    nextText: Zeolides.etiquetas.nextTextToolbar,
                    lastText: Zeolides.etiquetas.lastTextToolbar,
                    refreshText: Zeolides.etiquetas.refreshTextToolbar

                })
            })
        ];
        // this.storeGrid = Ext.create('Packed.store.packs');
        this.callParent(arguments);
    }
});
/**
 * Created by adrian on 3/11/14.
 */
Ext.define("Packed.views.PanelEast", {
    require: [
        "Ext.panel.Panel"
    ],
    extend: "Ext.panel.Panel",
    alias: "widget.panelEast",


    initComponent:function(){
        this.title =  Zeolides.etiquetas.titlePanelEast,
        this.width = 300,
        this.region = 'east',
        this.id = 'panelDetalles',
        this.name = 'panelDetalles',
        this.html = "<h3  style= 'padding: 10px 5px 5px 5px;'> No hay ningún elemento seleccionado ...</h3>",
        this.collapsible = true,
        this.collapseMode = 'mini',
        this.collapsed = true,
        this.split = true,

        this.callParent(arguments);
    }
});
/**
 * Created by adrian on 19/11/14.
 */
Ext.define('Packed.view.treeRepositorio', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.treeRepo',
    mixins: {
        treeFilter: 'Packed.lib.TreeFilter'
    },

    initComponent: function () {

        this.treeStore = Ext.create('Ext.data.TreeStore', {

            proxy: {
                type: 'ajax',
                url: 'getRepositories'

            },
            root: {
                text: Zeolides.etiquetas.textRootTreeRepo,
                id: 'src',
                expanded: false,
                children: []
            },
            folderSort: true,
            sorters: [{
                property: 'text',
                direction: 'ASC'
            }]
        });

        this.id = 'treeSvn',
        this.name = 'treeSvn',
        this.width = 485,
        this.height = 310,
        this.emptyText = 'No existen datos que mostrar.',
        this.store = this.treeStore,
        this.viewConfig = {
                loadingText: Zeolides.etiquetas.textCargando
            },
        this.dockedItems = [
            {
            xtype: 'toolbar',
            items:[{ xtype: 'textfield',
                name: 'filtroTree',
                id: 'filtroTree',
                emptyText : Zeolides.etiquetas.emptyTextSearch,
                width: 153

            }, {
                //text: 'Buscar',
                iconCls: 'limpiar',
                disabled: true,
                tooltip: 'Limpiar filtro <b>(Alt+L)</b>',
                name: 'btnLimpiarTree',
                id: 'btnLimpiarTree',
                action: 'limpiarFiltroTree'
            }/*, {
             text: 'Limpiar',
             iconCls: 'limpiar',
             tooltip: 'Limpiar filtro <b>(Alt+L)</b>',
             name: 'btnLimpiarTree',
             id: 'btnLimpiarTree',
             action: 'limpiarFiltroTree'
             }*/]}
            ];

        this.callParent(arguments);
    }
});/**
 * Created by adrian on 3/11/14.
 */
Ext.define('Packed.view.addPack', {
    extend: 'Ext.window.Window',
    alias: 'widget.newPack',

    initComponent: function () {

        Ext.regModel('TypeVersion', {
            fields: [
                {type: 'string', name: 'type'}

            ]
        });
        this.constrain = true,

            this.states = [
                {"name": "Release-Candidate"},
                {"name": "Alfa"},
                {"name": "Beta"}
            ];

        this.storeCombo = Ext.create('Ext.data.Store', {
            model: 'TypeVersion',
            data: this.states
        });

        this.storeGridDependencias = Ext.create('Packed.store.dependencias');

        this.treeRepo = Ext.widget('treeRepo');

        this.gridDependencias = Ext.create('Ext.grid.Panel', {
            store: this.storeGridDependencias,
            columns: [
                {
                    text     : Zeolides.etiquetas.textColumComponente,
                    width    : 80,
                    sortable : false,
                    dataIndex: 'name'
                },
                {
                    text     :  Zeolides.etiquetas.textColumEtiqueta,
                    width    : 165,
                    sortable : true,
                    dataIndex: 'nameTags'
                },
                {
                    text     :  Zeolides.etiquetas.textColumUrl,
                    width    : 210,
                    sortable : true,
                    dataIndex: 'url'
                }],
            height: 277,
            layout: 'fit',
            name: 'gridDependencias',
            id: 'gridDependencias',
            focusOnToFront : false,
            viewConfig: {
                loadMask : false
            }
        });

        this.title = Zeolides.etiquetas.titleCrearPack,
            this.layout = 'fit',
            this.autoShow = true,
            //this.autoHeight = true,
            this.width = 1024,
            this.modal = true,
            this.resizable = false,
            this.closable = true,
            this.closeAction = 'destroy',
            this.id = 'winAddPack',
            this.name = 'winAddPack',

            this.items = [{
                xtype: 'container',
                //layout: 'fit',
                items: [{
                    xtype: 'form',
                    height: 385,
                    //title: 'Formualrio',
                    autoScroll: true,
                    frame: true,
                    //bodyStyle: 'padding:2px 2px 0',
                    //width: 600,

                    items: [{
                        xtype: 'container',
                        //anchor: '98%',
                        layout: 'column',
                        items: [{
                            xtype: 'container',
                            columnWidth: .5,
                            layout: 'anchor',
                            items: [{
                                xtype: 'form',
                                anchor: '97%',
                                //frame: true,
                                tbar:[{
                                    text: Zeolides.etiquetas.textAddRepo,
                                    iconCls: 'adicionar',
                                    tooltip : Zeolides.etiquetas.tooltipAddRepo,
                                    action: 'addRepositorio'
                                },{
                                    text: Zeolides.etiquetas.textModRepo,
                                    iconCls: 'modificar',//'icon-adicionar',
                                    name: 'btnModRepo',
                                    id: 'btnModRepo',
                                    tooltip : Zeolides.etiquetas.tooltipModRepo,
                                    disabled : true,
                                    action: 'modRepositorio'
                                },{
                                    text: Zeolides.etiquetas.textElimRepo,
                                    iconCls: 'eliminar',
                                    name: 'btnElimRepo',
                                    id: 'btnElimRepo',
                                    disabled : true,
                                    tooltip : Zeolides.etiquetas.tooltipElimRepo,
                                    action: 'elimRepositorio'
                                }],
                                items: [this.treeRepo]
                            }]
                        }, {
                            xtype: 'tabpanel',
                            name: 'tabCreatePack',
                            id: 'tabCreatePack',

                            columnWidth: .5,
                            items: [{
                                xtype: 'panel',
                                title: Zeolides.etiquetas.titleFormPack,
                                layout: 'anchor',
                                //frame: true,
                                items: [{
                                    xtype: 'form',
                                    id: 'formPack',
                                    name: 'formPack',
                                    autoScroll: true,
                                    height: 315,
                                    //anchor: '80%',
                                    layout: 'anchor',
                                    frame: true,
                                    bodyStyle: 'padding:5px 15px 0',
                                    //width: 585,
                                    fieldDefaults: {
                                        labelAlign: 'top',
                                        msgTarget: 'side',
                                        anchor: '90%',
                                        disabled : true

                                    }, items: [{
                                        xtype: 'textfield',
                                        fieldLabel: Zeolides.etiquetas.lbNameProd,
                                        name: 'nameprod',
                                        id: 'nameprod',
                                        //anchor: '100%',
                                        allowBlank: false,
                                        blankText: Zeolides.etiquetas.blankText,
                                        //maskRe:/^[áéíóúÁÉÍÓÚa-zA-Z0-9_\- ]$/,
                                        regex:/(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\s\-]*))$/,
                                        regexText:Zeolides.etiquetas.alfanumerico
                                    }, {
                                        xtype: 'textarea',
                                        fieldLabel: Zeolides.etiquetas.lbDescrip,
                                        name: 'descrip',
                                        id: 'descrip',
                                        //anchor: '100%',
                                        allowBlank: false,
                                        blankText: Zeolides.etiquetas.blankText,
                                        //maskRe:/^[áéíóúÁÉÍÓÚa-zA-Z0-9\.\, ]$/
                                        //regex:/(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\.]*))$/,
                                        //regexText:Zeolides.etiquetas.alfanumericopto
                                    },{
                                        xtype: 'textfield',
                                        fieldLabel: Zeolides.etiquetas.lbAutor,
                                        name: 'autor',
                                        id: 'autor',
                                        //anchor: '97%',
                                        allowBlank: false,
                                        blankText:  Zeolides.etiquetas.blankText,
                                        // maskRe:/^[áéíóúÁÉÍÓÚa-zA-Z ]$/,
                                        regex:/(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\s\.]*))$/,
                                        regexText:Zeolides.etiquetas.alfanumerico,
                                        maxLength : 100,
                                        maxLengthText:Zeolides.etiquetas.maxLengthTextAutor
                                    }, {
                                        xtype: 'container',
                                        anchor: '90%',
                                        layout: 'column',
                                        items: [{
                                            xtype: 'container',
                                            columnWidth: .55,
                                            layout: 'anchor',
                                            items: [ {
                                                xtype: 'filefield',
                                                fieldLabel: Zeolides.etiquetas.lbP12,
                                                name: 'p12',
                                                id: 'p12',
                                                anchor: '95%',
                                                msgTarget: 'side',
                                                buttonText: '',
                                                allowBlank: false,
                                                blankText: Zeolides.etiquetas.blankText,
                                                editable : false,
                                                buttonConfig: {
                                                    iconCls: 'buscar'
                                                }
                                            }/*{
                                             xtype: 'textfield',
                                             fieldLabel: 'Versi&oacute;n',
                                             name: 'version',
                                             anchor: '97%',
                                             allowBlank: false,
                                             blankText: 'Este campo es requerido.',
                                             maskRe: /^([0-9.])/,
                                             regex: /^(([1-9]([0-9])*.([1-9]([0-9])*|0).([1-9]([0-9])*|0).([1-9]([0-9])*|0)))+$/,
                                             regexText:'Solo admite números y el carácter especial "." con el formato "*.*.*" .'
                                             }*/]
                                        }, {
                                            xtype: 'container',
                                            layout: 'anchor',
                                            columnWidth: .45,
                                            items: [{
                                                xtype: 'combobox',
                                                fieldLabel: Zeolides.etiquetas.lbTipoV,
                                                name: 'tipoV',
                                                id: 'tipoV',
                                                emptyText: Zeolides.etiquetas.emptyTextTipoV,
                                                anchor: '100%',
                                                displayField: 'name',
                                                store: this.storeCombo,
                                                queryMode: 'local',
                                                typeAhead: true,
                                                allowBlank: false,
                                                blankText: Zeolides.etiquetas.blankText,
                                                editable : false

                                            }]
                                        }]
                                    },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: Zeolides.etiquetas.lbFrase,
                                            name: 'frase',
                                            id: 'frase',
                                            inputType: 'password',
                                            //anchor: '100%',
                                            allowBlank: false,
                                            blankText: Zeolides.etiquetas.blankText,
                                            regexText: Zeolides.etiquetas.alfanumerico
                                        }],
                                    buttons: [{
                                        name: 'validate',
                                        id: 'btnValidate',
                                        hidden : true,
                                        formBind: true
                                    }]
                                }]
                            },{
                                title: Zeolides.etiquetas.titleDependencia,
                                disabled: true,
                                id:'panel2TabDepen',
                                name:'panel2TabDepen',
                                items: [this.gridDependencias],
                                bbar: Ext.create('Ext.PagingToolbar', {
                                    store: this.storeGridDependencias,
                                    displayInfo: true,
                                    displayMsg: Zeolides.etiquetas.displayMsgToolbar,
                                    emptyMsg: Zeolides.etiquetas.emptyMsgToolbar,
                                    beforePageText: Zeolides.etiquetas.beforePageTextToolbar,
                                    afterPageText: Zeolides.etiquetas.afterPageTextToolbar,
                                    firstText: Zeolides.etiquetas.firstTextToolbar,
                                    prevText: Zeolides.etiquetas.prevTextToolbar,
                                    nextText: Zeolides.etiquetas.nextTextToolbar,
                                    lastText: Zeolides.etiquetas.lastTextToolbar,
                                    refreshText: Zeolides.etiquetas.refreshTextToolbar

                                })
                            }]

                        }]
                    }]
                }
                ]}
            ],
            this.buttons = [{
            text: Zeolides.etiquetas.textCancelar,
            iconCls: 'cancelar',
            tooltip : Zeolides.etiquetas.tooltipCancelar,
            action: 'closeWin'
        },{
            text: Zeolides.etiquetas.textAplicar,
            iconCls: 'aplicar',
            name: 'btnAplicarPack',
            id: 'btnAplicarPack',
            tooltip : Zeolides.etiquetas.tooltipAplicar,
            action: 'submitFormCreatePack',
            formBind: true
        },{
            text: Zeolides.etiquetas.textAceptar,
            iconCls: 'aceptar',
            name: 'btnAceptarPack',
            id: 'btnAceptarPack',
            formBind: true,
            tooltip : Zeolides.etiquetas.tooltipAceptar,
            action: 'submitFormCreatePack'
        }];


        this.callParent(arguments);
    }
});/**
 * Created by adrian on 11/11/14.
 */

Ext.define('Packed.view.addRepo', {
    extend: 'Ext.window.Window',
    alias: 'widget.newRepo',

    initComponent: function () {

        this.formAddRepo = Ext.create('Ext.form.Panel', {

            frame: true,
            width: 290,
            bodyPadding: 5,
            waitMsgTarget: true,

            fieldDefaults: {
                labelAlign: 'top',
                width: 260
            },

            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: Zeolides.etiquetas.textDirUrlRepo,
                    name: 'dirurlRepo',
                    id: 'dirurlRepo',
                    allowBlank: false,
                    emptyText: Zeolides.etiquetas.emptyTextDirUrl,
                    padding :'5 0 0 0',
                    blankText: Zeolides.etiquetas.blankText,
                    regex : /(((^https?)|(^ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i,
                    regexText : Zeolides.etiquetas.urlText,
                    nextTab:'cancelarRepo',
                    prevTab:'aceptarRepo'
                }
            ],

            buttons: [{
                text: Zeolides.etiquetas.textCancelar,
                iconCls: 'cancelar',
                id: 'cancelarRepo',
                tooltip : Zeolides.etiquetas.tooltipCancelarAddRepo,
                action:'closeWin',
                nextTab:'',
                prevTab:'dirurlRepo'
            },{
                text: Zeolides.etiquetas.textAplicar,
                iconCls: 'aplicar',
                name: 'aplicarRepo',
                id: 'aplicarRepo',
                formBind: true,
                tooltip : Zeolides.etiquetas.tooltipAplicarAddRepo,
                action:'comprobarUrl',
                nextTab:'aceptarRepo',
                prevTab:'cancelarRepo'
            },{
                text: Zeolides.etiquetas.textAceptar,
                iconCls: 'aceptar',
                name: 'aceptarRepo',
                id: 'aceptarRepo',
                formBind: true,
                tooltip : Zeolides.etiquetas.tooltipAceptarAddRepo,
                action:'comprobarUrl',
                nextTab:'dirurlRepo',
                prevTab:''
            }]
        });

        this.title =  Zeolides.etiquetas.titleWinAddRepo,
        //this.layout = 'fit',
        //this.autoShow = true,
        this.height = 135,
        this.width = 305,
        this.modal = true,
        this.resizable = false,
        this.closable = true,
        this.closeAction = 'destroy',
        this.id = 'winAddRepo',
        this.name = 'winAddRepo',
        this.items = [this.formAddRepo],
        this.constrain = true,


        this.callParent(arguments);
    }
});/**
 * Created by adrian on 3/11/14.
 */
Ext.define("Packed.views.Autentication", {
    extend: 'Ext.window.Window',
    alias : 'widget.autentication',

    initComponent:function(){

        this.formPanel = Ext.create('Ext.form.Panel', {

            frame: true,
            width: 340,
            bodyPadding: 5,
            waitMsgTarget: true,

            fieldDefaults: {

                labelWidth: 85,
                msgTarget: 'side'
            },

            items: [{
                xtype: 'fieldset',
                defaultType: 'textfield',
                defaults: {
                    width: 275
                },
                items: [{
                    fieldLabel:  Zeolides.etiquetas.lbUsuario,
                    emptyText: Zeolides.etiquetas.emptyTextUser,
                    name: 'user',
                    id: 'user',
                    allowBlank: false,
                    padding :'5 0 0 0',
                    blankText:  Zeolides.etiquetas.blankText,
                    maxLength: 30,
                    maxLengthText: Zeolides.etiquetas.maxLengthText,
                    regex:/(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\@\-]*))$/,
                    regexText: Zeolides.etiquetas.textValidacion,
                    nextTab: 'pass',
                    prevTab: 'aceptar'
                }, {
                    fieldLabel:  Zeolides.etiquetas.lbPass,
                    emptyText: Zeolides.etiquetas.emptyTextPass,
                    inputType: 'password',
                    allowBlank: false,
                    name: 'pass',
                    id: 'pass',
                    blankText: Zeolides.etiquetas.blankText,
                    maxLength: 30,
                    maxLengthText:Zeolides.etiquetas.maxLengthText,
                    nextTab: 'cancelar',
                    prevTab: 'user'
                }
                ]
            }],

            buttons: [{
                text: Zeolides.etiquetas.textCancelar,
                iconCls: 'cancelar',
                id: 'cancelar',
                tooltip : Zeolides.etiquetas.tooltipCancelar,
                action:'closeWin',
                nextTab: 'aceptar',
                prevTab: 'pass'
            },{
                text: Zeolides.etiquetas.textAceptar,
                iconCls: 'aceptar',
                id: 'aceptar',
                formBind: true,
                tooltip : Zeolides.etiquetas.tooltipAceptar,
                action:'submitFormAutentic',
                nextTab: 'user',
                prevTab: 'cancelar'
            }]
        });

        this.title = Zeolides.etiquetas.titleWinAutentication,
        this.id = 'winAutentication',
        this.name = 'winAutentication',
        this.width = 350,
        this.height = 145,
        this.layout = 'fit',
        this.modal = true,
        this.resizable = false,
        this.autoShow = true,
        this.constrain = true,
        this.items = [
            this.formPanel
        ],
        this.callParent(arguments);
    }
});

Ext.define('Packed.view.Principal', {
    /*require: [
        'Replica.view.ArbolAmbientes',
        'Replica.view.PanelNodos',
        'Ext.panel.Panel',
        'Ext.tab.Panel'
    ],*/
    extend: 'Ext.container.Viewport',
    alias: 'widget.principal',
    //border: 0,
    initComponent: function(){

        this.PanelCenter = Ext.widget('panelCenter');
        this.PanelEast = Ext.widget('panelEast');
        var _this = this;
        this.layout  = 'fit';
        this.items = [
            {
                xtype: 'panel',
                layout: 'border',
                dockedItems: [{
                    xtype: 'toolbar',
                    items: [{
                        text: perfil.etiquetas.textNuevoPack,
                        tooltip : perfil.etiquetas.tooltipNuevoPack,
                        //scope: this,
                        iconCls: 'nuevo',
                        action: 'createPack'

                    },{
                        text: perfil.etiquetas.textElimPack,
                        iconCls: "eliminar",
                        tooltip : perfil.etiquetas.tooltipElimPack,
                        disabled : true,
                        name: 'btnElimPack',
                        id: 'btnElimPack',
                        action: 'deletePack'
                    },{
                        text: perfil.etiquetas.textPublicar,
                        name: 'btnPublicar',
                        id: 'btnPublicar',
                        disabled : true,
                        action: 'publicarPack',
                        iconCls: "publicar",
                        tooltip: perfil.etiquetas.tooltiPublicar
                    },{
                        text:  perfil.etiquetas.textConfigurar,
                        name: 'btnConfigurar',
                        id: 'btnConfigurar',
                        action: 'configurarGestor',
                        iconCls: "config",
                        tooltip: perfil.etiquetas.tooltiConfigurar
                    },'->',{
                        text: perfil.etiquetas.textAyuda,
                        iconCls: "ayuda",
                        tooltip : perfil.etiquetas.tooltipAyuda,
                        name: 'btnAyuda',
                        id: 'btnAyuda'
                    }]
                }],
                items: [
                    this.PanelCenter,
                    this.PanelEast
                ]
            }
        ],
        this.callParent(arguments);
    }


});Ext.define('Packed.controller.keymap', {

    alias: 'widget.keymapController',

    init: function (){},

    pressAltN: function (_this) {

        this.newPack = new Ext.KeyMap(Ext.getBody(), {
            key: Ext.EventObject.N,
            alt: true,
            //  defaultEventAction:'stopEvent',
            fn: function () {
                _this.onClickNewPack();
            },
            scope: _this
        });
    },

    pressAltB: function (_this, win) {

        this.filtrar = new Ext.KeyMap(Ext.getBody(), {
            key: Ext.EventObject.B,
            alt: true,
            //  defaultEventAction:'stopEvent',
            fn: function () {
                switch (win.getId()) {
                    case 'winAddPack':
                        _this.filtrarTree();
                    break;
                    default:{
                        if(!Ext.getCmp('textfieldBuscarTree').isDisabled()) {
                            _this.filtrarGridPack();
                        }
                    }

                }

            },
            scope: _this
        });
    },

    pressAltL: function (_this, win) {

        this.limpiar = new Ext.KeyMap(Ext.getBody(), {
            key: Ext.EventObject.L,
            alt: true,
            //  defaultEventAction:'stopEvent',
            fn: function () {
                switch (win.getId()) {
                    case 'winAddPack':
                        _this.limpiarFiltroTree();
                        break;
                    default:
                    {
                        if(!Ext.getCmp('clearFiltroGridPack').isDisabled()) {
                            _this.limpiarFiltroGridPack();
                        }
                    }

                }
            },
            scope: _this
        });
    },
    pressAltP: function (_this, win) {

        if(typeof(this.publicpack) === "undefined"){
            this.publicpack = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.P, // or Ext.EventObject.ENTER
                shift: true,
                alt: true,
                fn: function () {
                    if(!Ext.getCmp('btnPublicar').isDisabled()) {
                            _this.onClickpublicarPack();
                    }

                },
                scope: _this
            });
        }
    },

    pressDelPack: function (_this) {

        if(typeof(this.delpack) === "undefined"){
            this.delpack = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.DELETE, // or Ext.EventObject.ENTER
                fn: function () {
                    if(!Ext.getCmp('btnElimPack').isDisabled()) {
                        _this.onClickDeletePack();
                    }
                },
                scope: _this
            });
        }

    },

    pressDelRepo: function(_this){
        if(typeof(this.delRepo) === "undefined"){
            this.delRepo = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.DELETE, // or Ext.EventObject.ENTER
                fn: function () {
                    if(!Ext.getCmp('btnElimRepo').isDisabled()){
                        _this.elimRepositorio();
                    }
                },
                scope: _this
            });
        }
    },

    pressAltI: function(_this){
        if(typeof(this.newRepo) === "undefined"){
            this.newRepo = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.I,
                alt: true,
                //  defaultEventAction:'stopEvent',
                fn: function () {
                    if(Ext.getCmp('winAddPack')){
                        _this.addRepositorio();
                    }
                },
                scope: _this
            });
        }

    },

    pressAltM: function(_this){
        if(typeof(this.modRepo) === "undefined"){
            this.modRepo = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.M,
                alt: true,
                  defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnModRepo').isDisabled()){
                        _this.addRepositorio(false);
                    }

                },
                scope: _this
            });
        }

    },

    pressAltX: function(_this, win){

            this.close = new Ext.KeyMap(win.getEl(), {
                key: Ext.EventObject.X,
                alt: true,
                //  defaultEventAction:'stopEvent',
                fn: function () {
                    win.close();
                },
                scope: _this
            });
    },

    pressEnter: function(_this, win){

        this.enter = new Ext.KeyMap(win.getEl(), {
            key: Ext.EventObject.ENTER,
            //  defaultEventAction:'stopEvent',
            fn: function () {
                switch (win.getId()) {
                    case 'winAddPack':
                        var btn = Ext.getCmp('btnAceptarPack');
                        if(!btn.isDisabled()){
                            _this.submitFormCreatePack(btn);
                        }
                    break;
                    case 'winAutentication':
                        _this.submitFormAutentic();
                    break;
                    case 'winAddRepo':
                        _this.onClickComprobar(Ext.getCmp('aceptarRepo'));
                    break;
                }

            },
            scope: _this
        });
    },

    pressCtrlAltP: function(_this, win){

        this.CtrlAltP = new Ext.KeyMap(win.getEl(), {
            key: Ext.EventObject.P,
            //  defaultEventAction:'stopEvent',
            alt: true,
            ctrl: true,
            fn: function () {
                switch (win.getId()) {
                    case 'winAddPack':
                        var btn = Ext.getCmp('btnAplicarPack');
                        if(!btn.isDisabled()){
                            _this.submitFormCreatePack(btn);
                        }
                    break;
                    case 'winAddRepo':
                        _this.onClickComprobar(Ext.getCmp('aplicarRepo'));
                        break;
                }

            },
            scope: _this
        });
    }

});
Ext.define('Packed.controller.Packs', {
    extend: 'Ext.app.Controller',
    require: [
        // 'Packed.model.packs',
        // 'Packed.store.packs'
    ],
    stores: [
        // 'packs'
    ],
    model: [
        // 'packs'
    ],
    views: [],
    refs: [{
        ref: 'principal',
        selector: 'principal'
    }, {
        ref: 'newPack',
        selector: 'newPack'
    }, {
        ref: 'autentication',
        selector: 'autentication'
    }, {
        ref: 'newRepo',
        selector: 'newRepo'
    }],

    init: function () {
        var _this = this;
        nodeSelected = '';
        nodeClick = '';

        _this.control({
            'principal': {
                render: _this.onRenderPrincipal
            },
            'principal button[action=createPack]': {
                click: _this.onClickNewPack
            },
            'principal button[action=deletePack]': {
                click: _this.onClickDeletePack
            },
            'principal grid[name=gridPacked]': {
                itemclick: _this.onItemClickGridPacked,
                render: _this.renderGridPacked
            },
            'principal button[action=filtrarGridPack]': {
                click: _this.filtrarGridPack
            },
            'principal button[action=limpiarFiltroGridPack]': {
                click: _this.limpiarFiltroGridPack
            },
            'principal button[action=publicarPack]': {
                click: _this.onClickpublicarPack
            },
            'principal button[action=configurarGestor]': {
                click: _this.onClickConfigurar
            },
            'principal textfield[name=searchFieldPack]': {
                change: _this.hablitarBotones
            },
            'newRepo button[action=comprobarUrl]': {
                click: _this.onClickComprobar
            },
            'newPack textfield[name=dirurl]': {
                dirtychange: _this.checkValueComprobar
            },
            'newPack textfield[name=filtroTree]': {
                change: _this.filtrarTree
            },
            'newPack button[action=closeWin]': {
                click: _this.closeWin
            },
            'newPack button[action=submitFormCreatePack]': {
                click: _this.submitFormCreatePack
            },
            'newPack button[action=addRepositorio]': {
                click: _this.addRepositorio
            },
            'newPack': {
                render: _this.onRenderAddPack,
                beforeclose: _this.onBeforecloseAddPack
            },
            'newPack treepanel[name=treeSvn]': {
                beforeitemexpand: _this.onExpandTreeSvn,
                //load: _this.onLoad
                /*beforeload: _this.onBeforeReloadTreeSvn,*/
                itemclick: _this.onItemclickTree,
                itemdblclick: _this.onItemdblclickTree,
                load: _this.onLoadTree

            },
            'newPack button[action=filtrarTree]': {
                click: _this.filtrarTree
            },
            'newPack button[action=limpiarFiltroTree]': {
                click: _this.limpiarFiltroTree
            },
            'newPack button[action=modRepositorio]': {
                click: _this.modRepositorio
            },
            'newPack button[action=elimRepositorio]': {
                click: _this.elimRepositorio
            },
            'newPack grid[name=gridDependencias]': {
                itemdblclick: _this.onItemdblclickGridDepend
            },
            'newPack button[name=validate]': {
                enable: _this.validationForm,
                disable: _this.validationForm
            },
            'autentication': {
                render: _this.onRenderAutentic,
                close: _this.onCloseAutentic
            },
            'autentication button[action=closeWin]': {
                click: _this.closeWin
            },
            'autentication button[action=submitFormAutentic]': {
                click: _this.submitFormAutentic
            },
            'newRepo': {
                render: _this.onRenderNewRepo,
                close: _this.onCloseAutentic,
                hide: _this.onCloseAutentic
            },
            'newRepo button[action=closeWin]': {
                click: _this.closeWin
            }
        });

        //console.log('Initialized Users! This happens before the Application launch function is called');
    },

    onRenderPrincipal: function (win) {

        this.keyMap = Ext.widget('keymapController');
        this.keyMap.pressAltN(this);
        myScope = this;
        this.keyMap.pressAltB(this, win);
        this.keyMap.pressAltL(this, win);

        myMask = new Ext.LoadMask(Ext.getBody(), {msg: Zeolides.etiquetas.msgLoandingMask});

    },

    onRenderAddPack: function (win) {

        var detailPanel = Ext.get('panelDetalles');

        win.treeRepo.getStore().load();
        this.keyMap.pressAltI(this);
        this.keyMap.pressAltM(this);
        this.keyMap.pressAltX(this, win);
        this.keyMap.pressEnter(this, win);
        this.keyMap.pressCtrlAltP(this, win);
        //this.keyMap.pressAltB(this, win);
        this.keyMap.pressAltL(this, win);

        win.gridDependencias.getStore().on('load', function (a, b) {
            if (b.length != 0) {
                Ext.getCmp('panel2TabDepen').setDisabled(false);
                Ext.getCmp('tabCreatePack').setActiveTab(1);
            }else{
                Ext.getCmp('panel2TabDepen').setDisabled(true);
                Ext.getCmp('tabCreatePack').setActiveTab(0);
            }
        });

        Ext.getCmp('btnAceptarPack').setDisabled(true);
        Ext.getCmp('btnAplicarPack').setDisabled(true);
    },

    onRenderNewRepo: function (win) {
        this.keyMap.pressAltX(this, win);
        this.keyMap.pressEnter(this, win);
        this.keyMap.pressCtrlAltP(this, win);
        Ext.getCmp('dirurlRepo').focus(false, 200);

        if(typeof(this.keyMap.delRepo) != "undefined"){

            this.keyMap.delRepo.setDisabled(true);
            this.keyMap.modRepo.setDisabled(true);
        }

    },

    onRenderAutentic: function (win) {
        this.keyMap.pressEnter(this, win);
        this.keyMap.pressAltX(this, win);
        Ext.getCmp('user').focus(false, 200);
        this.keyMap.delRepo.setDisabled(true);
        this.keyMap.modRepo.setDisabled(true);

    },

    onCloseAutentic: function(){
        if(typeof(this.keyMap.delRepo) != "undefined"){
            this.keyMap.delRepo.setDisabled(false);
            this.keyMap.modRepo.setDisabled(false);
        }
        this.keyMap.newRepo.setDisabled(false);

    },

    onBeforecloseAddPack: function () {
        //if (typeof(this.keyMap.delRepo) != "undefined") {
            //this.keyMap.delRepo.setDisabled(true);
            //this.keyMap.pressAltI.setDisabled(true);
            // }

    },

    onClickNewPack: function () {

        var win = Ext.getCmp('winAddPack');

        if (typeof(win) != "undefined") {
            if (!win.isVisible()) {
                win.show();
            }
        } else {
            Ext.widget('newPack');
        }
        Ext.getCmp('btnElimPack').setDisabled(true);
        this.keyMap.publicpack.setDisabled(true);

    },
    onClickpublicarPack:function(){
        var _this = this;
        var arraryRecord = Ext.getCmp('gridPacked').getSelectionModel().getSelection();
        if(arraryRecord.length == 1){
            Msg.util.MostrarMsg(4, Zeolides.etiquetas.titlePublicar, Zeolides.etiquetas.msgPublicar1, this.publicarPack, this);
        }
        else{
            Msg.util.MostrarMsg(4, Zeolides.etiquetas.titlePublicar, Zeolides.etiquetas.msgPublicar2, this.publicarPack, this);
        }

        _this.keyMap.newPack.setDisabled(true);
        _this.keyMap.delpack.setDisabled(true);

    },
    publicarPack :function(btn){
        var _this = this;
        if (btn == "YES") {
            var arrayDatos = [];
            var arraryRecord = Ext.getCmp('gridPacked').getSelectionModel().getSelection();
            Ext.each(arraryRecord, function(record, index){
                if(!record.raw.visible){arrayDatos.push(record.raw.id);}
            });

            myMask.show();
            Ext.Ajax.request({
                url: 'releasePackages',
                params: {
                    arrayDatos: Ext.encode(arrayDatos)
                },
                success: function (response) {

                    var text = Ext.decode(response.responseText);
                    myMask.hide();
                    if (text.success) {
                        Ext.getCmp('gridPacked').getStore().load();
                        Msg.util.msg(1, Zeolides.etiquetas.textInformacion, text.message);
                        Ext.getCmp('btnPublicar').setDisabled(true); //gridPacked
                        Ext.getCmp('btnElimPack').setDisabled(true);
                        var style = "<h3  style= 'padding: 10px 5px 5px 5px;'> No hay ningún elemento seleccionado ...</h3>";
                        var tpl = new Ext.Template(style);
                        var detailPanel = Ext.getCmp('panelDetalles');
                        detailPanel.collapse(true);
                        tpl.overwrite(detailPanel.body);

                        _this.keyMap.newPack.setDisabled(false);
                        _this.keyMap.delpack.setDisabled(false);

                    } else {
                        myMask.hide();

                        Msg.util.msg(3, Zeolides.etiquetas.textError, text.message);
                    }

                }

            });
        }
        else{
            _this.keyMap.newPack.setDisabled(false);
            _this.keyMap.delpack.setDisabled(false);
        }
    },

    onClickConfigurar:function(){
        Ext.Ajax.request({
            url: 'configurarGestor',
            success: function (response) {
                var text = Ext.decode(response.responseText);
                if (text.success) {
                    Msg.util.msg(1, Zeolides.etiquetas.textInformacion, text.message);
                } else {
                    Msg.util.msg(3, Zeolides.etiquetas.textError, text.message);
                }

            }
        });
    },

    onClickDeletePack: function () {
        var arraryRecord = Ext.getCmp('gridPacked').getSelectionModel().getSelection();
        if(arraryRecord.length == 1){
            Msg.util.MostrarMsg(4, Zeolides.etiquetas.titleElimpack, Zeolides.etiquetas.msgElimpack1, this.deletePack, this);
        }
        else{
            Msg.util.MostrarMsg(4, Zeolides.etiquetas.titleElimpack, Zeolides.etiquetas.msgElimpack2, this.deletePack, this);
        }

        this.keyMap.newPack.setDisabled(true);
        this.keyMap.publicpack.setDisabled(true);
    },

    deletePack: function (btn) {
        var _this = this;
        if(btn == "YES"){
            var arrayDatos = [];
            var arraryRecord = Ext.getCmp('gridPacked').getSelectionModel().getSelection();
            Ext.each(arraryRecord, function(record, index){
                if(!record.raw.visible){arrayDatos.push(record.raw.id);}
            });

            myMask.show();
            Ext.Ajax.request({
                url: 'deletePackageRepository',
                params: {
                    arrayDatos: Ext.encode(arrayDatos)
                },
                success: function (response) {
                    Ext.getCmp('btnElimPack').setDisabled(true); //gridPacked
                    Ext.getCmp('btnPublicar').setDisabled(true);
                    var text = Ext.decode(response.responseText);
                    //console.log('text',text);
                    myMask.hide();
                    if (text.success) {
                        Ext.getCmp('gridPacked').getStore().load();
                        Msg.util.msg(1, Zeolides.etiquetas.textInformacion, text.message);

                        var style = "<h3  style= 'padding: 10px 5px 5px 5px;'> No hay ningún elemento seleccionado ...</h3>";
                        var tpl = new Ext.Template(style);
                        var detailPanel = Ext.getCmp('panelDetalles');
                        detailPanel.collapse(true);
                        tpl.overwrite(detailPanel.body);

                        _this.keyMap.newPack.setDisabled(false);
                        _this.keyMap.publicpack.setDisabled(false);

                    } else {
                        myMask.hide();

                        Msg.util.msg(3, Zeolides.etiquetas.textError, text.message);
                    }

                }
            });
        }else{
            this.keyMap.newPack.setDisabled(false);
            this.keyMap.publicpack.setDisabled(false);
        }

    },

    onClickComprobar: function (a) {

        var urlAjax = 'pushRepositories';
        var lastUrl = '';
        var win = Ext.getCmp('winAddRepo');

        //var aplicar = (typeof(a) === "undefined") ? false : true;

        if (win.title.indexOf('Modificar') != -1) {
            urlAjax = 'modifyRepository';
            lastUrl = nodeClick.raw.url
        }
        var url = Ext.getCmp('dirurlRepo').getValue();
        var mymask = new Ext.LoadMask(Ext.getBody(), {msg:Zeolides.etiquetas.msgLoandingMask});
        mymask.show();
        Ext.Ajax.request({
            url: urlAjax,
            timeout: 180000,
            params: {
                newUrl: url,
                oldUrl: lastUrl
            },
            success: function (response) {
                mymask.hide();
                var text = Ext.decode(response.responseText);

                if (text.success) {

                    //reload tree
                    var store = Ext.getCmp('treeSvn').store;
                    store.setProxy({
                        type: 'ajax',
                        url: 'getRepositories'
                    });
                    store.load();

                    if (a.getId() != 'aplicarRepo') {
                        win.close();
                    } else {
                        win.show();
                        Ext.getCmp('dirurlRepo').reset();
                    }
                    Msg.util.msg(1, Zeolides.etiquetas.textInformacion, text.mensaje);

                    //a.setDisabled(true);
                } else {
                    //error
                    mymask.hide();
                    Ext.getCmp('dirurlRepo').reset() && win.show();
                    Msg.util.msg(3, Zeolides.etiquetas.textError, text.mensaje);
                }

            }
        });

    },
    checkValueComprobar: function (field, dirty) {

        var active = (field.getValue() !== ' ' && field.getValue() !== '') ? false : true;
        Ext.getCmp('comp').setDisabled(active);

    },
    closeWin: function (button) {
        if( button.up('window').id == 'winAddPack' && !Ext.getCmp('btnPublicar').isDisabled()){
            Ext.getCmp('btnElimPack').setDisabled(false);
        }
        else if(button.up('window').id == 'winAutentication'){
            this.keyMap.newRepo.setDisabled(false);
        }

        if(button.up('window').id == 'winAddPack'){
            this.keyMap.publicpack.setDisabled(false);
        }
           button.up('window').close();

    },
    submitFormCreatePack: function (button) {
        var _this = this;

        var fraseEncript = this.encryptRSA(Ext.getCmp('frase').getValue());
        var fraseClear = Ext.getCmp('frase').getValue();

        var btn = Ext.getCmp('btnValidate');
        var form = btn.up('form').getForm();
        //var form = Ext.getCmp('formPack').getForm();
        if (form.isValid()) {
            var objValues = form.getValues();
            //objValues.frase = fraseEncript;
            //form.setValues(objValues);

            form.submit({
                url: 'involvePackage',
                timeout : 60000,
                params: {
                    idpadre: nodeClick.parentNode.raw.id,
                    url: nodeClick.parentNode.raw.url,
                    nameTags: nodeClick.raw.text
                },
                waitTitle: Zeolides.etiquetas.msgLoandingMask,
                waitMsg: Zeolides.etiquetas.msgWait,

                success: function (form, action) {
                    //console.log(form);
                    var msg = action.result.message;
                        Ext.getCmp('gridPacked').getStore().load();


                        Msg.util.msg(1, Zeolides.etiquetas.textInformacion, msg);
                        form.reset();
                        //this.setDisabledFormAddPack();
                        Ext.getCmp('nameprod').setDisabled(true);
                        Ext.getCmp('descrip').setDisabled(true);
                        Ext.getCmp('autor').setDisabled(true);
                        Ext.getCmp('p12').setDisabled(true);
                        Ext.getCmp('tipoV').setDisabled(true);
                        Ext.getCmp('frase').setDisabled(true);

                        var nodo = Ext.getCmp('treeSvn').store.getNodeById(nodeClick.internalId);
                    //console.log('nodeo', nodo);
                        nodo.remove();

                    if (button.getId() == 'btnAceptarPack') {
                        _this.keyMap.publicpack.setDisabled(false);
                        button.up('window').close();
                    }

                },
                failure: function (form, action) {
                    var msg = action.result.message;
                    Ext.getCmp('frase').setValue(fraseClear);
                    //Ext.getCmp('frase').markInvalid(msg);
                    Msg.util.msg(3, Zeolides.etiquetas.textError, msg);
                }
            });

        }

    },
    onExpandTreeSvn: function (node, b, c) {

        if (!node.isRoot()) {

            nodeSelected = node;
            this.setProxyTreePanelSvn(node.raw.url, node.raw.id);

        }

    },

    setProxyTreePanelSvn: function (url, id, user, pass) {

        var mUser = (typeof(user) != "undefined") ? user : '';
        var mPass = (typeof(pass) != "undefined") ? user : '';

        Ext.getCmp('treeSvn').store.setProxy({
            type: 'ajax',
            url: 'getTagsRepositories',
            extraParams: {
                url: url,
                idpadre: id,
                user: mUser,
                password: mPass
            }
        });
    },

    submitFormAutentic: function (a, b, c) {

        var user = Ext.getCmp('user').getValue();
        var pass = Ext.getCmp('pass').getValue();
        //var encryptPass = this.encryptRSA(pass);
        //console.log('pas',encryptPass);
        var url = Ext.getCmp('winAutentication').nodeRecord.raw.url;
        var idpadre = Ext.getCmp('winAutentication').nodeRecord.raw.id;

        myMask.show();
        Ext.Ajax.request({
            url: 'authenticateCorrect',
            params: {
                url: url,
                user: user,
                //password: encryptPass,
                password: pass,
                idpadre: idpadre
            },
            success: function (response) {
                var text = Ext.decode(response.responseText);

                if (text.success) {

                    var nodo = Ext.getCmp('treeSvn').store.getNodeById(Ext.getCmp('winAutentication').nodeRecord.internalId);
                    nodo.set('iconCls', 'icon2-abajo');
                    nodo.set('leaf', false);

                    nodo.expand();
                    myMask.hide();
                    Ext.getCmp('winAutentication').close();

                } else {
                    myMask.hide();
                    Msg.util.msg(3, Zeolides.etiquetas.textError, text.message);
                    //Ext.widget('autentication', {idNode:node.raw.id});
                }

            }
        });

    },

    onItemclickTree: function (view, record, item) {

        if (!record.isRoot()) {
            nodeClick = record;
            if (record.raw.idtags == 'tags') {

                Ext.getCmp('formPack').setDisabled(false);

                Ext.getCmp('gridDependencias').getStore().load({
                    params: {
                        idpadre: record.parentNode.raw.id,
                        url: record.parentNode.raw.url,
                        nameTags: record.raw.text

                    }
                });

                Ext.getCmp('btnModRepo').setDisabled(true);
                Ext.getCmp('btnElimRepo').setDisabled(true);
                //this.keyMap.delRepo.setDisabled(true);
                //this.onBeforecloseAddPack();



            } else {
                Ext.getCmp('btnModRepo').setDisabled(false);
                Ext.getCmp('btnElimRepo').setDisabled(false);

                Ext.getCmp('btnAceptarPack').setDisabled(true);
                Ext.getCmp('btnAplicarPack').setDisabled(true);
                Ext.getCmp('formPack').getForm().reset();
                Ext.getCmp('gridDependencias').getStore().removeAll();

                Ext.getCmp('tabCreatePack').setActiveTab(0);
                Ext.getCmp('panel2TabDepen').setDisabled(true);
                this.setDisabledFormAddPack();

                //del treeSvn

                this.keyMap.pressDelRepo(this);
            }
        } else {
            Ext.getCmp('btnModRepo').setDisabled(true);
            Ext.getCmp('btnElimRepo').setDisabled(true);
        }

        /*console.log(record);
         console.log(view);
         if(!record.raw.autenticate){
         Ext.widget('autentication', {idNode:record.internalId});
         }*/
    },

    onItemdblclickTree: function (view, record, item) {
        if (!record.isRoot()) {
            if (!record.raw.authenticate && record.raw.idtags != 'tags') {
                this.keyMap.newRepo.setDisabled(true);
                Ext.widget('autentication', {nodeRecord: record});


            }
        }
    },

    onLoadTree: function(store, record, success){

        if(typeof(record.getChildAt(0)) == "undefined" && !record.isRoot()){

            Msg.util.msg(1, Zeolides.etiquetas.textInformacion,  Zeolides.etiquetas.textEmptyData);
        }

    },
    encryptRSA: function (text) {
        var key = RSA.getPublicKey(document.getElementById('publicKey').value);
        return RSA.encrypt(text, key);
    },

    addRepositorio: function (a) {
        var _a = (typeof(a) != "undefined") ? a : true;
        var winRepo = Ext.getCmp('winAddRepo');

        if (typeof(winRepo) != "undefined") {
            if (!winRepo.isVisible()) {
                Ext.getCmp('dirurlRepo').removeListener('change');
                Ext.getCmp('cancelarRepo').nextTab = 'aplicarRepo';
                Ext.getCmp('aceptarRepo').prevTab = 'aplicarRepo';
                winRepo.show();
            }
        } else {
            if (_a) {
                var n = Ext.widget('newRepo');
                Ext.getCmp('cancelarRepo').nextTab = 'aplicarRepo';
                Ext.getCmp('aceptarRepo').prevTab = 'aplicarRepo';
                Ext.getCmp('dirurlRepo').removeListener('change');
                n.show()
            } else {
                var newWin = Ext.widget('newRepo');
                Ext.getCmp('aceptarRepo').prevTab = 'cancelarRepo';
                Ext.getCmp('cancelarRepo').nextTab = 'aceptarRepo';
                newWin.setTitle(Zeolides.etiquetas.titleWinModifRepo);
                Ext.getCmp('dirurlRepo').setValue(nodeClick.raw.url);
                Ext.getCmp('aceptarRepo').setDisabled(true);
                var first = false, original = '';
                Ext.getCmp('dirurlRepo').addListener('change', function(t, nv, ov){
                    if(!first){
                        original = ov;
                        if(original != nv && t.isValid())
                            Ext.getCmp('aceptarRepo').setDisabled(false);
                        else
                            Ext.getCmp('aceptarRepo').setDisabled(true);
                        first = true;
                    }else{
                        if(original == nv)
                            Ext.getCmp('aceptarRepo').setDisabled(true);
                        else {
                            if(t.isValid())
                                Ext.getCmp('aceptarRepo').setDisabled(false);
                        }
                    }
                });
                Ext.getCmp('aplicarRepo').destroy();
                Ext.getCmp('cancelarRepo').nexTab = 'aceptarRepo';
                Ext.getCmp('aceptarRepo').prevTab = 'cancelarRepo';
                Ext.getCmp('aceptarRepo').setDisabled(true);
                Ext.getCmp('aceptarRepo').formBind = false;
                newWin.show();
            }

        }

    },

    modRepositorio: function () {
        this.addRepositorio(false);
    },

    elimRepositorio: function () {
        this.keyMap.newRepo.setDisabled(true);
        this.keyMap.modRepo.setDisabled(true);
        Msg.util.MostrarMsg(4, Zeolides.etiquetas.titleElimRepositorio,  Zeolides.etiquetas.msgElimRepositorio, this.ajaxElimRepositorio, this);

    },

    ajaxElimRepositorio: function (btn) {
        var _this = this;
        if(btn == "YES"){
            Ext.Ajax.request({
                url: 'deleteRepository',
                params: {
                    url: nodeClick.raw.url

                },
                success: function (response) {
                    var text = Ext.decode(response.responseText);
                    if (text.success) {
                        var store = Ext.getCmp('treeSvn').store;
                        //reload tree
                        var store = Ext.getCmp('treeSvn').store;
                        store.setProxy({
                            type: 'ajax',
                            url: 'getRepositories'
                        });
                        store.load();
                        Msg.util.msg(1, Zeolides.etiquetas.textInformacion, text.mensaje);
                    } else {
                        Msg.util.msg(3, Zeolides.etiquetas.textError, text.mensaje);
                    }
                    Ext.getCmp('treeSvn').getSelectionModel().select(Ext.getCmp('treeSvn').getRootNode());
                    Ext.getCmp('btnModRepo').setDisabled(true);
                    Ext.getCmp('btnElimRepo').setDisabled(true);
                    _this.keyMap.newRepo.setDisabled(false);
                    _this.keyMap.modRepo.setDisabled(false);
                    // Msg.util.msg();

                }
            });
        }
        else if(btn == 'NO'){
            this.keyMap.newRepo.setDisabled(false);
            this.keyMap.modRepo.setDisabled(false);
        }
    },

    onItemdblclickGridDepend:function(view, record){
        nodeClickDepend =  record.raw;
        Msg.util.MostrarMsg(4, Zeolides.etiquetas.textInformacion,  Zeolides.etiquetas.textMsgAddDependen, this.addDependenciaRepo, this);
    },

    addDependenciaRepo: function(btn){
        if(btn == "YES"){
            this.addRepositorio();
            Ext.getCmp('dirurlRepo').setValue(nodeClickDepend.url);
        }

    },

    renderGridPacked: function(grid,eOpts){

        this.keyMap.pressDelPack(this);
        this.keyMap.pressAltP(this);

    },

    onItemClickGridPacked: function (view, record, c, d, e) {

        itemClickGridPacked = record;
        if(!record.raw.visible){
            Ext.getCmp('btnPublicar').setDisabled(false);

            Ext.getCmp('btnElimPack').setDisabled(false);
        }else{
            Ext.getCmp('btnElimPack').setDisabled(true);
            Ext.getCmp('btnPublicar').setDisabled(true);
        }

        var cadena = '';

        var nombre = record.raw.nameProduct;
        var name = record.raw.name;
        var verssion = record.raw.version;
        var descrip = record.raw.description;
        var dependencia = record.raw.require;
        var autor = record.raw.autor;
        var logo = record.raw.logo;

        var type = record.raw.typeVersion;
        var versio_suxf = verssion.substring(1) + '-' + type;

        if (dependencia != null) {
            for (var key in dependencia) {

                var keysplit = dependencia[key].substring(2);
                var pcero = (dependencia[key].charAt(1) == '7') ? '-alfa' : (dependencia[key].charAt(1) == '8') ? '-beta' : '-rc';

                cadena += '<li style="list-style: none;">' + key+ '=' +keysplit + pcero + '</li>';
            }
        }

        var style = '<style>' +
            'p#logo { text-align: center; padding : 10 0 0 0px; }' +
            '.acercade{    font-size: 1.1em;} ' +
            '.txtprincipal{' +
            ' text-align: center;' +
            'font: bold 2.3em "Droid Sans",arial,sans-serif;' +
            'color: rgb(0, 155, 194);' +
            'text-shadow: 1px 1px 2px rgba(185, 185, 185, 0.84);' +
            '' +

            '}' +

            '</style>' +
            '<section id="infoApp">' +
            '<div style="border-bottom: solid 1px #eeeeee; box-shadow: 1px 1px 4px rgba(198, 198, 198, 0.44); text-align: center; padding-bottom: 10px; padding-top: 10px ">' +
            '<tpl if="this.logoContain(logo) == false">' +
            ' <img style="width: 50%;" src=' + logo + '>' +
            '</tpl>' +
            '</p>' +
            '<h1 style="font-size:  1.4em;" class="txtPrincipal">' + nombre + ' </h1>' +//---------------Nombre-------------------
            '<h5 style="font-size:  1.2em;color: rgb(0, 155, 194);" class=""> '+Zeolides.etiquetas.tplVersion + versio_suxf+ ' </h5>' +//------------Versión-----------------
            '</div>' +
            '<div class = "acercade" style="margin-bottom:20px;height:100%;overflow:auto; padding: 10px 5px 5px 5px;text-align: center; background-color: rgba(240, 240, 240, 0.18)">' +//-------------Container----------------
            '<h5>'+Zeolides.etiquetas.tplDescrip+'</h5>' +//------------------Desarrollado------------ -----
            '<label >' + descrip + '</label>' +//------------------Desarrollado------------ -----
            '<h5>'+Zeolides.etiquetas.tplDesarroll+'</h5>' +//------------------Desarrollado------------ -----
            '<label >' + autor + '</label>' +//------------------Desarrollado------------ -----
            '<h5 style="margin-top:10px">'+Zeolides.etiquetas.tplDependen+'</h5>' +//------------------Dependencias------------
            '<ul>' + cadena +
            '</ul>' +//-----------------------------------End Dependencias -----------
            '</br>' +
            '</div>' +//------------------------------------End Container-----------
            '<footer style=" bottom:0; position:absolute;width: 100%; height:15;text-align: center;background-color:rgb(0, 155, 194);color: white ">' +//------------------------------------Footer-----------
            '<h5>2011-2015 © Copyright XETID </h5>' +//------------------------------------Footer-----------
            '</footer>' +//------------------------------------End Footer-----------
            '</section>';

        var tpl = new Ext.Template(style);
        var detailPanel = Ext.getCmp('panelDetalles');
        detailPanel.expand(true);
        tpl.overwrite(detailPanel.body, e);

    },

    setDisabledFormAddPack: function () {
        Ext.getCmp('nameprod').setDisabled(true);
        Ext.getCmp('descrip').setDisabled(true);
        Ext.getCmp('autor').setDisabled(true);
        Ext.getCmp('p12').setDisabled(true);
        //Ext.getCmp('logo').setDisabled(true);
        Ext.getCmp('tipoV').setDisabled(true);
        Ext.getCmp('frase').setDisabled(true);
    },

    hablitarBotones: function(){
        if(Ext.getCmp('searchFieldPack').getValue() != ''){
            Ext.getCmp('clearFiltroGridPack').enable();
            Ext.getCmp('textfieldBuscarTree').enable();
        }
        else{
            Ext.getCmp('clearFiltroGridPack').disable();
            Ext.getCmp('textfieldBuscarTree').disable();
        }
    },

    filtrarGridPack: function (textfield, value) {

        var store = Ext.getCmp('gridPacked').getStore();
        var filtro = Ext.getCmp('searchFieldPack').getValue();
        store.load({params: {
            filtro: filtro
        }});
        Ext.getCmp('clearFiltroGridPack').setDisabled(false);

        /*Ext.getCmp('gridPacked').getStore().filter("name", filtro);
        store.filter([
            Ext.create('Ext.util.Filter', {
                filterFn: function (item) {

                    if (item.data.name.indexOf(value) != -1) {
                        return item;
                    }
                },
                root: 'data'
            })
        ]);*/

    },

    limpiarFiltroGridPack: function () {
        Ext.getCmp('searchFieldPack').reset();
        Ext.getCmp('gridPacked').getStore().load();
        Ext.getCmp('clearFiltroGridPack').setDisabled(true);
    },

    filtrarTree: function(textfield, value){
        var tree = Ext.getCmp('treeSvn');
        tree.filterBy(value, "text");
        if(value != ''){
            Ext.getCmp('btnLimpiarTree').enable();
        }
        else{
            Ext.getCmp('btnLimpiarTree').disable();
        }
    },

    limpiarFiltroTree: function () {
        Ext.getCmp('filtroTree').setValue('');
        var tree = Ext.getCmp('treeSvn');
        tree.clearFilter();
    },

    resetProxyTree: function(){
        var store = Ext.getCmp('treeSvn').store;
                        store.setProxy({
                        type: 'ajax',
                        url: 'getRepositories'
                        });
        store.load();
    },

    validationForm : function(a){
      Ext.getCmp('btnAplicarPack').setDisabled(a.disabled);
      Ext.getCmp('btnAceptarPack').setDisabled(a.disabled);
    }


});Ext.Loader.setConfig({
    enabled: true,
    paths: {
        Packed: "app"
    }
});

Zeolides.App({
    modulo: "package",
    name: "Packed",
    controllers : [
        'Packs'
    ],

    launch: function () {
        /*console.log('perfi', perfil);
        Packed.idioma = Ext.widget('idiomaES').idioma;*/
        Ext.widget ( 'principal' );

    }
});


