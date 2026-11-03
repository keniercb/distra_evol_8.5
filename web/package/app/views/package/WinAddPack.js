/**
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
});