Ext.ns('Ext.Person');

/**
 * Componente para editar los atributos de los conceptos y campos
 * @type {extend|*|void|extend|extend|extend}
 * @author Ing. Javier Rodriguez Lopez y Ing.Yoan Uría Rodríguez
 */

Ext.Person.ConceptProperty = Ext.extend(Ext.Panel, {
    layout: 'border',
    initComponent: function ()
    {
        var self = this;

        /**
         * Boton para limpiar las propiedades
         * @type {Button}
         */
        this.btnClear = new Ext.Button({
            text: this.lang.lbBtnClear,
            tooltip: this.lang.ttpBtnClearProperty,
            iconCls: 'limpiar'
        });

        /**
         * Boton para guardar la configuracion del concepto
         * @type {Button}
         */
        this.btnSave = new Ext.Button({
            text: this.lang.lbBtnGuardar,
            tooltip: this.lang.ttpBtnGuardar,
            iconCls: 'guardar',
            handler: function ()
            {
                self.saveConceptConfig();
            }
        });

        /**
         * Store del comboBox de componentes
         * @type {Store}
         */
        this.stCmpt = new Ext.data.Store({
            autoLoad: true,
            url: 'getDenomComponent',
            reader: new Ext.data.JsonReader({
                root: "datos"
            }, [
                {name: 'denom'},
                {name: 'xtype'},
                {name: 'url'},
                {name: 'cmp'}
            ])
        });

        /**
         * ComboBox del listado de componentes
         * @type {ComboBox}
         */
            //this.cbCmpt = new Ext.form.ComboBox({
        this.cbCmpt = new Ext.form.ComboBoxBtn({
            fieldLabel: this.lang.lbTipo,
            name: 'xtype',
            disabled: true,
            store: this.stCmpt,
            displayField: 'denom',
            valueField: 'xtype',
            hiddenName: 'xtype',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            trigger1Class: 'x-form-refresh-trigger',
            allowBlank: false,
            scope: this,
            handler: function ()
            {
                this.stCmpt.reload();
            }
        });

        /**
         * TriggerField para seleccionar el icono
         * @type {TriggerField}
         */
        this.tfIconCls = new Ext.form.TriggerField({
            fieldLabel: 'Icono',
            emptyText: 'Seleccione...',
            name: 'iconcls',
            allowBlank: true,
            readOnly: true,
            triggerClass: 'x-form-search-trigger'
        });

        /**
         * Componente visor de imagenes
         * @type {GestionarImagenes}
         */
        this.dvIconView = new Ext.Component.Catalogoimagenes.GestionarImagenes({
            url: 'getIcons',
            autoCarga: true,
            buttons: [
                {
                    iconCls: 'cerrar',
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana  <b>(Crtl+Alt+X)</b>',
                    handler: function ()
                    {
                        this.dvIconView.hide();
                    }.createDelegate(this)
                },
                {
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    tooltip: 'Guardar datos y cerrar ventana<b>(Enter)</b>',
                    handler: function ()
                    {
                        this.dvIconView.hide();
                    }.createDelegate(this)
                }
            ]
        });

        /**
         * OnClick para mostrar el visor de imagenes
         */
        this.tfIconCls.onTriggerClick = function ()
        {
            self.dvIconView.show();
        };

        /**
         * Formulario para lso datos basicos del concepto
         * @type {FormPanel}
         */
        this.fpBasicData = new Ext.FormPanel({
            layout: 'form',
            bodyStyle: 'padding:4px 4px 0',
            defaults: {
                anchor: '100%'
            },
            disabled: true,
            frame: true,
            defaultType: 'textfield',
            items: [
                {
                    fieldLabel: this.lang.lbDenom,
                    name: 'denominacion',
                    allowBlank: false
                },
                {
                    fieldLabel: this.lang.lbDescripcion,
                    name: 'descripcion'
                },
                this.tfIconCls,
                this.cbCmpt,
                {
                    name: 'idproyectoconcepto',
                    xtype: 'hidden'
                },
                {
                    name: 'idpadre',
                    xtype: 'hidden'
                }
            ],
            region: 'north',
            margins: '5 5 5 5',
            autoHeight: true
        });

        /**
         * Parametros de comboBox booleano
         * @type {object}
         */
        this.cbBool = {
            name: 'valor',
            store: new Ext.data.SimpleStore({
                fields: [
                    {name: 'valor'}
                ],
                data: [
                    ['true'],
                    ['false']
                ]
            }),
            displayField: 'valor',
            valueField: 'valor',
            hiddenName: 'valor',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            editable: false,
            allowBlank: false
        };

        this.codeEditor = new Ext.components.CodeEditor({});
        this.codeEditor.on('save', function (cEditor, code)
        {
            var cell = this.tbpAdvancedData.getActiveTab().getSelectionModel().getSelectedCell();
            this.tbpAdvancedData.getActiveTab().getStore().getAt(cell[0]).set('valor', code);
        }, this);

        this.btnExpandRows = new Ext.Button({
            iconCls: 'expandir',
            tooltip: 'Expandir',
            handler: function ()
            {
                this.viewOptionsConfig.expandAllGroups();
            }.createDelegate(this)
        });

        this.btnCollapseRows = new Ext.Button({
            iconCls: 'contraer',
            tooltip: 'Contraer',
            handler: function ()
            {
                this.viewOptionsConfig.collapseAllGroups();
            }.createDelegate(this)
        });

        /**
         * Store del grid de propiedades
         * @type {Store}
         */
        this.stOptionsConfig = new Ext.data.GroupingStore({
            url: 'getPropertys',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                { name: 'denom' }
                ,
                { name: 'type'}
                ,
                { name: 'valor'}
                ,
                { name: 'origen'}
            ]),
            groupField: 'type',
            sortInfo: {
                field: 'denom',
                direction: "ASC"
            },
            listeners: {
                load: function (st, rec)
                {

                    this.btnSave.enable();
                }.createDelegate(this),
                beforeload: function (st)
                {
                    this.btnSave.disable();
                }.createDelegate(this)
            }
        });

        /**
         * Column Model del grid de propiedades
         * @type {Array}
         */
        this.cmOptionsConfig = [
            {
                header: 'Denominaci&oacute;n',
                sortable: false,
                dataIndex: 'denom',
                menuDisabled: true
            },
            {
                header: 'Valor',
                sortable: false,
                dataIndex: 'valor',
                menuDisabled: true,
                editor: new Ext.form.TextField({
                    allowBlank: false
                })
            },
            {
                header: 'Tipo',
                hidden: true,
                sortable: false,
                dataIndex: 'type',
                menuDisabled: true
            }
        ];

        /**
         * View del grid de propiedades
         * @type {GroupingView}
         */
        this.viewOptionsConfig = new Ext.grid.GroupingView({
            groupTextTpl: '{text}',
            forceFit: true
        });

        /**
         * Grid editable para las propiedades del componente
         * @type {EditorGridPanel}
         */
        this.egpOptionsConfig = new Ext.grid.EditorGridPanel({
            title: 'Propiedades',
            columns: this.cmOptionsConfig,
            store: this.stOptionsConfig,
            clicksToEdit: 1,
            loadMask: {store: this.stOptionsConfig},
            stripeRows: true,
            view: this.viewOptionsConfig,
            tbar: [new Ext.app.SearchField({
                store: this.stOptionsConfig,
                width: 200,
                configFiltro: ['local', 'denom'],
                emptyText: 'Criterio a buscar'
            }), '-', '->', this.btnExpandRows, this.btnCollapseRows]
        });
        this.egpOptionsConfig.on('cellclick', function (grid, rowIndex, columnIndex)
        {
            var cm = grid.getColumnModel();
            var record = grid.getStore().getAt(rowIndex);
            var type = record.get('type');
            var editor;
            if (columnIndex == 1) {
                switch (type) {
                    case 'bool':
                        editor = new Ext.form.ComboBox(this.cbBool);
                        break;
                    case 'string':
                        editor = new Ext.form.TextField({
                            allowBlank: true
                        });
                        break;
                    case 'number':
                        editor = new Ext.form.NumberField({
                            allowBlank: true,
                            allowNegative: true
                        });
                        break;
                    case 'function':
                    case 'array':
                    case 'object':
                        editor = new Ext.form.TextField({
                            listeners: {
                                focus: function (cmp)
                                {
                                    self.codeEditor.show();
                                    self.codeEditor.setValue(record.get('valor') || '');
                                    self.codeEditor.setCmp(self.getCmpByChilds(self.nodeConcept));
                                }
                            }
                        });
                        break;
                    default:
                        break;
                }
                this.cmOptionsConfig[columnIndex].editor = editor;
                grid.reconfigure(grid.getStore(), new Ext.grid.ColumnModel(this.cmOptionsConfig));
            }
        }, this);

        /**
         * Store del grid de eventos del componente
         * @type {Store}
         */
        this.stEventos = new Ext.data.Store({
            url: 'getEvents',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                { name: 'denom' }
                ,
                { name: 'type'}
                ,
                { name: 'valor'}
            ]),
            sortInfo: {
                field: 'denom',
                direction: "ASC"
            },
            listeners: {
                load: function (st, rec)
                {
                    this.btnSave.enable();
                }.createDelegate(this),
                beforeload: function (st)
                {
                    this.btnSave.disable();
                }.createDelegate(this)
            }
        });

        /**
         * Column Model del grid de eventos del componente
         * @type {Array}
         */
        this.cmEventos = [
            {
                header: 'Denominaci&oacute;n',
                sortable: false,
                dataIndex: 'denom',
                menuDisabled: true
            },
            {
                header: 'Valor',
                sortable: false,
                dataIndex: 'valor',
                menuDisabled: true,
                editor: new Ext.form.TextField({
                    allowBlank: false
                })
            }
        ];

        /**
         * Grid editable para definir los eventos del componente
         * @type {EditorGridPanel}
         */
        this.egpEventos = new Ext.grid.EditorGridPanel({
            title: 'Eventos',
            columns: this.cmEventos,
            store: this.stEventos,
            clicksToEdit: 1,
            stripeRows: true,
            loadMask: {store: this.stEventos},
            viewConfig: {
                forceFit: true
            }
        });
        this.egpEventos.on('cellclick', function (grid, rowIndex, columnIndex)
        {
            var cm = grid.getColumnModel();
            var record = grid.getStore().getAt(rowIndex);
            var type = record.get('type');
            var editor;
            if (columnIndex == 1) {
                switch (type) {
                    case 'function':
                    case 'array':
                    case 'object':
                        editor = new Ext.form.TextField({
                            listeners: {
                                focus: function (cmp)
                                {
                                    self.codeEditor.show();
                                    self.codeEditor.setValue(record.get('valor') || '');
                                    self.codeEditor.setCmp(self.getCmpByChilds(self.nodeConcept));
                                }
                            }
                        });
                        break;
                    default:
                        break;
                }
                this.cmEventos[columnIndex].editor = editor;
                grid.reconfigure(grid.getStore(), new Ext.grid.ColumnModel(this.cmEventos));
            }
        }, this);

        this.tbpAdvancedData = new Ext.TabPanel({
            region: 'center',
            disabled: true,
            margins: '0 5 5 5',
            activeTab: 0,
            items: [this.egpOptionsConfig, this.egpEventos]
        });

        this.bbar = ['->', this.btnClear, this.btnSave];
        this.items = [this.fpBasicData, this.tbpAdvancedData];
        Ext.Person.ConceptProperty.superclass.initComponent.call(this);

        this.cbCmpt.on('select', function (cb, record)
            {
                var params = {
                    cmp: record.get('denom'),
                    idproyectoconcepto: this.node.attributes.idproyectoconcepto
                };
                this.stOptionsConfig.load({
                    params: params
                });
                this.stEventos.load({
                    params: params
                });
            }, this
        );
    },

    /**
     * Cargar los componentes registrados
     */
    loadCbCompt: function ()
    {
        this.stCmpt.load();
    },

    /**
     * Actualiza el panel de propiedades con la informacion del concepto
     * @param node
     */
    updateConceptConfig: function (node)
    {
        if (node && node.attributes.idproyectoconcepto != 'root') {
            this.node = node;
            this.fpBasicData.enable();
            this.cbCmpt.enable();
            this.btnClear.enable();
            this.btnSave.enable();
            this.loadFormBasicData(node);
            this.loadCmpType(node);
            this.tbpAdvancedData.setDisabled(node.attributes.tipo != 0 ? false : true);
           
            this.tfIconCls.setValue(node.attributes.iconCls);
            this.nodeConcept = this.getConcetpByNode(node);
        } else {
            this.fpBasicData.disable();
            this.fpBasicData.getForm().reset();
            this.btnClear.disable();
            this.btnSave.disable();
            this.tbpAdvancedData.disable();
            this.clearPropertys();
            this.nodeConcept = null;
        }
    },

    /**
     * Carga el formulario de datos basicos del componenete
     * @param data
     */
    loadFormBasicData: function (data)
    {
        this.fpBasicData.getForm().findField('idproyectoconcepto').setValue(data.attributes.idproyectoconcepto);
        this.fpBasicData.getForm().findField('idpadre').setValue(data.attributes.idpadre);
        this.fpBasicData.getForm().findField('denominacion').setValue(data.text);
        this.fpBasicData.getForm().findField('descripcion').setValue(data.attributes.qtip);
    },

    /**
     * Carga el comboBox de typo de componente
     * @param data
     */
    loadCmpType: function (data)
    {
        this.cbCmpt.setDisabled(data.attributes.tipo != 0 ? false : true);
        var propiedades = Ext.decode(data.attributes.propiedades) || {};
        if (!Ext.isEmpty(propiedades.xtype)) {
            this.cbCmpt.setValue(propiedades.xtype);
            this.cbCmpt.fireEvent('select', this.cbCmpt, this.cbCmpt.findRecord(this.cbCmpt.valueField, propiedades.xtype));
        } else {
            this.cbCmpt.reset();
            this.clearPropertys();
        }
    },

    /**
     * Guarda la configuracion del concepto
     */
    saveConceptConfig: function ()
    {
        PVD.mostrarMascara('mskaddfield', 'Por favor espere...', 'Guardano datos');
        if (this.fpBasicData.getForm().isValid()) {
            var params = this.fpBasicData.getForm().getValues();
            params.tipo = this.node.attributes.tipo;
            params.idproyecto = this.idproyecto;
            switch (params.tipo) {
                case '1':
                case '2':
                case '3':
                    var allPropertys = this.getPropertys();
                    params.propiedades = Ext.encode(allPropertys.propertys);
                    params.funcionesyeventos = Ext.encode(allPropertys.functionsyevents);
                    params.cmpempleado = Ext.encode(this.cbCmpt.findRecord(this.cbCmpt.valueField, this.cbCmpt.getValue()).get('cmp'));
                    break;
                default :
                    params.propiedades = {};
                    params.funcionesyeventos = {};
                    params.cmpempleado = {};
            }
            Ext.Ajax.request({
                url: 'saveConcept',
                method: 'POST',
                params: params,
                callback: function (options, success, response)
                {
                    PVD.ocultarMascara('mskaddfield');
                    var responseData = Ext.decode(response.responseText);
                    this.fireEvent('propertySaved');
                }.createDelegate(this)
            });
        } else {
            this.fpBasicData.body.stopFx();
            this.fpBasicData.body.highlight();
        }
    },

    /**
     * Obtiene la configuracion de propiedades hechas sobre el componente
     */
    getPropertys: function ()
    {
        var allPropertys = {}, propertys = {}, functionsyevents = {}, listeners = {};
        if (this.cbCmpt.getValue()) {
            propertys.xtype = this.cbCmpt.getValue();
        }
        this.stOptionsConfig.clearFilter();
        Ext.each(this.stOptionsConfig.getRange(), function (rec)
        {
            switch (rec.get('type')) {
                case 'object':
                case 'array':
                case 'function':
                    functionsyevents[rec.get('denom')] = rec.get('valor');
                    break;
                default :
                    propertys[rec.get('denom')] = rec.get('valor');
                    break;
            }
        });

        Ext.each(this.stEventos.getRange(), function (rec)
        {
            listeners[rec.get('denom')] = rec.get('valor');
        });
        functionsyevents.listeners = listeners;

        allPropertys.propertys = propertys;
        allPropertys.functionsyevents = functionsyevents;
        return allPropertys
    },

    clearPropertys: function ()
    {
        this.stOptionsConfig.removeAll();
        this.stEventos.removeAll();
    },

    getConcetpByNode: function (node)
    {
        if (node.attributes.tipo == '1') {
            return node;
        } else {
            return this.getConcetpByNode(node.parentNode);
        }
    },

    getCmpByChilds: function (node)
    {
        var arr = [];
        node.cascade(function (n)
        {
            var tmp = [n.text, n.id]
            arr.push(tmp);
        }, this);
        return arr;
    }

});