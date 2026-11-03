Ext.define('PRT.view.WindowAddModProrrateo', {
    extend: 'Ext.window.Window',
    alias: 'widget.windowaddmodprorrateo',

    idioma: PRT.language[lang],
    numberformat: CostoComun.NumberFormat,

    constrain: true,
    modal: true,
    resizable: false,
    autoShow: true,
    border: false,
    nivel: null,
    fechaObj: null,
    taskRunner: null,
    runner: null,

    requires: [
        'CostoComun.components.ComboTree'
    ],

    initComponent: function () {
        this.addEvents('addprorrateo');

        this.title = (this.action == 'add') ? this.idioma.titleWindowAddProrrateo : this.idioma.titleWindowModProrrateo;
        this.width = 750;
        this.height = 550;
        this.runner = new Ext.util.TaskRunner();

        this.cbOrigenBD = Ext.create('Ext.form.ComboBox', {
            name: 'origenbasedistributiva',
            anchor: '99%',
            forceSelection: true,
            labelStyle: 'margin: 0 0 5 0',
            fieldLabel: this.idioma.lbOrigenBD,
            labelAlign: 'top',
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'idorigenbasedistributiva'
                    },
                    {
                        name: 'origenbasedistributiva'
                    }
                ],
                data: [
                    {
                        idorigenbasedistributiva: 1,
                        origenbasedistributiva: this.idioma.lbUnidadesFisicas
                    },
                    {
                        idorigenbasedistributiva: 2,
                        origenbasedistributiva: this.idioma.lbMontoTotal
                    },
                    {
                        idorigenbasedistributiva: 3,
                        origenbasedistributiva: this.idioma.lbElementoGasto
                    }
                ]
            }),
            allowBlank: false,
            blankText: this.idioma.blankTextField,
            editable: false,
            queryMode: 'local',
            valueField: 'idorigenbasedistributiva',
            displayField: 'origenbasedistributiva',
            enforceMaxLength: true
        });

        this.cbInductor = Ext.create('Ext.form.ComboBox', {
            name: 'cbinductor',
            anchor: '100%',
            forceSelection: true,
            labelStyle: 'margin: 0 0 5 0',
            fieldLabel: this.idioma.lbInductor,
            labelAlign: 'top',
            hidden: true,
            store: Ext.create('Ext.data.Store', {
                autoLoad: false,
                pageSize: 10,
                fields: [
                    {
                        name: 'idinductor'
                    },
                    {
                        name: 'nominductor'
                    },
                    {
                        name: 'abreviatura'
                    },
                    {
                        name: 'textinductor',
                        convert: function (value, record) {
                            return record.data.nominductor + ' (' + record.data.abreviatura + ')';
                        }
                    }
                ],
                proxy: {
                    type: 'ajax',
                    url: 'getNomInductor',
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
            }),
            allowBlank: false,
            blankText: this.idioma.blankTextField,
            editable: false,
            queryMode: 'local',
            //pageSize: 1,
            valueField: 'idinductor',
            displayField: 'textinductor',
            enforceMaxLength: true,
            trigger2Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            trigger2tip: 'Limpiar el campo y recargar los datos',
            listeners: {
                render: function (c) {
                    c.triggerCell.elements[1].set({'data-qtip': c.trigger2tip});
                }
            },
            onTrigger2Click: function () {
                //Esto sirve para esconder el trigger especificado
                //this.triggerCell.item(1).setDisplayed(false);

                this.clearValue();
                this.expand();
                this.getStore().removeAll();
                this.getStore().load();
            }
        });

        this.cbElementoGastoProrratear = Ext.widget('combotree', {
            itemId: 'cmbEGProrratear',
            name: 'cmbEGProrratear',
            fieldLabel: this.idioma.lbElementoGastoProrratear,
            multiSelect: false,
            displayField: 'text',
            displayTextTree: 'text',
            valueField: 'idelementoobjeto',
            leafField: 'leaf',
            url: 'loadElementoGastoTraspaso',
            rootData: 'datos',
            selectParent: false,
            //bbar: [],
            showSearch: false,
            anchor: '100%',
            hidden: true/*,
            params: {
                idparteformato: this.nivel.idparteformatoorigen
            }*/
        });

        this.gridpanelReceptores = Ext.create('Ext.grid.Panel', {
            border: false,
            multiSelect: true,
            store: Ext.create('Ext.data.Store', {
                storeId: 'stReceptores',
                fields: [
                    {
                        name: 'id'
                    },
                    {
                        name: 'receptor'
                    },
                    {
                        name: 'idinductor'
                    },
                    {
                        name: 'valorinductor'
                    }
                ],
                proxy: {
                    type: 'ajax',
                    url: 'loadDataReceptores',
                    reader: {
                        type: 'json',
                        root: 'datos'
                    }
                }
            }),
            columns: [
                {
                    text: this.idioma.headerReceptor,
                    dataIndex: 'receptor',
                    hideable: false,
                    sortable: true,
                    flex: 1
                },
                {
                    itemId: 'columninductor',
                    text: this.idioma.lbInductor,
                    align: 'center',
                    hideable: false,
                    hidden: true,
                    sortable: false,
                    dataIndex: 'valorinductor',
                    scope: this,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        if (value) {
                            return this.numberformat.formatoMoneda(value);
                        }
                        return '0.00';
                    }
                },
                {
                    menuDisabled: true,
                    hideable: false,
                    sortable: false,
                    xtype: 'actioncolumn',
                    width: 30,
                    itemId: 'actioncolumngridreceptores',
                    align: 'center',
                    items: [
                        {
                            scope: this,
                            iconCls: 'icondistra-eliminar',
                            tooltip: this.idioma.lbEliminarReceptor,
                            handler: function (viewTable, rowIndex, colIndex, item, e, record) {
                                viewTable.getSelectionModel().select(record);

                                this.delReceptores([record]);
                            }
                        }
                    ]
                }
            ]
        });

        this.items = [
            {
                xtype: 'form',
                id: 'multiColumnFormProrrateo',
                frame: true,
                bodyPadding: '1 1 0 1',
                margin: '5 5 0 5',
                fieldDefaults: {
                    labelAlign: 'top',
                    labelStyle: 'margin: 0 0 5 0',
                    allowBlank: false
                },
                items: [
                    {
                        xtype: 'container',
                        anchor: '100%',
                        layout: 'column',
                        items: [
                            {
                                xtype: 'container',
                                columnWidth: 1,
                                layout: 'anchor',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        name: 'descripcion',
                                        itemId: 'tfdescripcionProrrateo',
                                        fieldLabel: this.idioma.lbDescripcionProrrateo,
                                        anchor: '100%',
                                        allowBlank: false,
                                        maxLength: 255,
                                        maxLengthText: this.idioma.maxLengthText.replace(/<#>/g, 255)
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        anchor: '100%',
                        layout: 'column',
                        items: [
                            {
                                xtype: 'container',
                                columnWidth: .50,
                                layout: 'anchor',
                                items: [
                                    {
                                        xtype: 'combotree',
                                        itemId: 'cmbTreeEmisor',
                                        name: 'cmbTreeEmisor',
                                        fieldLabel: this.idioma.lbTreeCmbEmisor,
                                        multiSelect: false,
                                        displayField: 'text',
                                        displayTextTree: 'text',
                                        valueField: 'id',
                                        leafField: 'leaf',
                                        url: 'loadCuentaParteFormato',
                                        rootData: 'datos',
                                        selectParent: false,
                                        bbar: [],
                                        showSearch: false,
                                        anchor: '99%',
                                        params: {
                                            idparteformato: this.nivel.idparteformatoorigen,
                                            receptor: 0,
                                            emisor: 1
                                        }
                                    },
                                    {
                                        xtype: 'container',
                                        anchor: '100%',
                                        layout: 'column',
                                        items: [
                                            {
                                                xtype: 'container',
                                                columnWidth: .30,
                                                layout: 'anchor',
                                                items: [{
                                                    xtype: 'datefield',
                                                    fieldLabel: this.idioma.lbFechaProrrateo,
                                                    allowBlank: false,
                                                    name: 'fechaprorrateo',
                                                    itemId: 'fechaprorrateo',
                                                    anchor: '98%',
                                                    minValue: this.fechaObj.fechaInicio,
                                                    maxValue: this.fechaObj.fechaFin,
                                                    value: this.fechaObj.fecha
                                                }]
                                            },
                                            {
                                                xtype: 'container',
                                                columnWidth: .70,
                                                layout: 'anchor',
                                                items: [this.cbOrigenBD]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'container',
                                columnWidth: .50,
                                layout: 'anchor',
                                itemId: 'itemf2c2',
                                items: [
                                    {
                                        xtype: 'combotree',
                                        itemId: 'cmbEGTraspaso',
                                        name: 'cmbEGTraspaso',
                                        fieldLabel: this.idioma.lbElementoGastoTraspaso,
                                        multiSelect: false,
                                        displayField: 'text',
                                        displayTextTree: 'text',
                                        valueField: 'idelementoobjeto',
                                        leafField: 'leaf',
                                        url: 'loadElementoGastoTraspaso',
                                        rootData: 'datos',
                                        selectParent: false,
                                        //bbar: [],
                                        showSearch: false,
                                        anchor: '100%'/*,
                                        params: {
                                            idparteformato: this.nivel.idparteformatoorigen
                                        }*/
                                    },
                                    this.cbInductor,
                                    this.cbElementoGastoProrratear
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        anchor: '100%',
                        layout: 'column',
                        items: [
                            {
                                xtype: 'container',
                                columnWidth: .15,
                                layout: 'anchor',
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: this.idioma.lbPorcientoTrasp,
                                        allowBlank: false,
                                        name: 'porcientoatraspasar',
                                        itemId: 'porcientoatraspasar',
                                        anchor: '97.5%',
                                        value: 100,
                                        minValue: 0.01,
                                        maxValue: 100,
                                        allowDecimals: true,
                                        decimalPrecision: 2,
                                        step: 0.01
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'panel',
                title: this.idioma.titleCentroReceptor,
                height: 281,
                margin: '5 5 0 5',
                frame: false,
                layout: 'fit',
                tbar: [
                    {
                        xtype: 'combotree',
                        itemId: 'cmbReceptores',
                        name: 'cmbReceptores',
                        //fieldLabel: this.idioma.titleCentroReceptor,
                        multiSelect: true,
                        displayField: 'codigo',
                        displayTextTree: 'text',
                        valueField: 'id',
                        leafField: 'leaf',
                        url: 'loadCuentaParteFormato',
                        rootData: 'datos',
                        selectParent: false,
                        bbar: [],
                        showSearch: false,
                        anchor: '100%',
                        width: 676,
                        disabled: true,
                        params: {
                            idparteformato: this.nivel.idparteformatodestino,
                            receptor: 1,
                            emisor: 0
                        }
                    },
                    {
                        xtype: 'button',
                        //text: this.idioma.lbbtnAdicionarReceptores,
                        iconCls: 'icondistra-adicionar',
                        tooltip: this.idioma.tooltipbtnaddreceptores,
                        itemId: 'btnadicionarreceptores',
                        disabled: true
                    },
                    {
                        xtype: 'button',
                        //text: this.idioma.lbbtnEliminarReceptores,
                        iconCls: 'icondistra-eliminar',
                        tooltip: this.idioma.tooltipbtndelreceptores,
                        itemId: 'btneliminarreceptores',
                        disabled: true
                    }
                ],
                items: [this.gridpanelReceptores]
            }
        ];

        if (this.action == 'add') {
            this.buttons = [
                {
                    text: this.idioma.lbbtnCancelar,
                    tooltip: this.idioma.tooltipbtnCancelar,
                    scope: this,
                    itemId: 'btnCancelarWinProrrateo',
                    handler: this.close
                },
                {
                    text: this.idioma.lbbtnAplicar,
                    tooltip: this.idioma.tooltipbtnAplicar,
                    itemId: 'btnAplicarWinProrrateo',
                    disabled: true
                },
                {
                    text: this.idioma.lbbtnAceptar,
                    tooltip: this.idioma.tooltipbtnAceptar,
                    itemId: 'btnAceptarWinProrrateo',
                    disabled: true
                }
            ];
        }
        else {
            this.buttons = [
                {
                    text: this.idioma.lbbtnCancelar,
                    tooltip: this.idioma.tooltipbtnCancelar,
                    scope: this,
                    itemId: 'btnCancelarWinProrrateo',
                    handler: this.close
                },
                {
                    text: this.idioma.lbbtnAceptar,
                    tooltip: this.idioma.tooltipbtnAceptar,
                    itemId: 'btnAceptarWinProrrateo',
                    disabled: true
                }
            ];
        }


        this.callParent();

        this.createRefsComponentes();
        this.inicializarEventos();
    },
    createRefsComponentes: function () {

        this.tfdescripcionProrrateo = this.down('form container textfield[itemId=tfdescripcionProrrateo]');
        this.cmbTreeEmisor = this.down('form container combotree[itemId=cmbTreeEmisor]');
        this.fechaprorrateo = this.down('form container datefield[itemId=fechaprorrateo]');
        this.cbcmbEGTraspaso = this.down('form container combotree[itemId=cmbEGTraspaso]');
        this.porcientoatraspasar = this.down('form container numberfield[itemId=porcientoatraspasar]');

        this.btnaddReceptores = this.down('panel toolbar button[itemId=btnadicionarreceptores]');
        this.btndelReceptores = this.down('panel toolbar button[itemId=btneliminarreceptores]');
        this.cbReceptores = this.down('panel toolbar combotree[itemId=cmbReceptores]');

        if (this.action == 'add') {
            this.btnAplicarWinProrrateo = this.down('button[itemId=btnAplicarWinProrrateo]');
        }
        this.btnAceptarWinProrrateo = this.down('button[itemId=btnAceptarWinProrrateo]');
    },
    inicializarEventos: function () {

        this.on({
            scope: this,
            show: function (cmp, eOpts) {
                var arrbtn = (this.action == 'add') ? [this.btnAplicarWinProrrateo, this.btnAceptarWinProrrateo] : [this.btnAceptarWinProrrateo];
                this.taskTemp = this.startTaskRunnerValidation(this.action, arrbtn);

                if (this.action == 'mod') {
                    /*Esto es necesario para saber cuando es la primera carga del modificar*/
                    this.firstLoadMod = true;
                    /*Este arreglo almacena los valores de los receptores a penas se carga el grid de receptores en el mdificar*/
                    this.arrReceptoresOld = [];

                    this.tfdescripcionProrrateo.setValue(this.objmodprorrateo.descripcion);
                    this.cmbTreeEmisor.setValueComboTree(this.objmodprorrateo.emisor);
                    this.cbcmbEGTraspaso.setValueComboTree(this.objmodprorrateo.elementogastotraspaso);
                    this.fechaprorrateo.setValue(this.objmodprorrateo.fecha);
                    this.porcientoatraspasar.setValue(this.objmodprorrateo.porcientotraspasar);

                    var storeBD = this.cbOrigenBD.getStore();
                    var indexBD = storeBD.find('idorigenbasedistributiva', this.objmodprorrateo.idorigenBD);
                    var recordBD = storeBD.getAt(indexBD);
                    this.cbOrigenBD.select(recordBD);

                    if (this.objmodprorrateo.idorigenBD == 1) {
                        //Unidades físicas
                        this.cbInductor.expand();
                        this.cbInductor.getStore().removeAll();
                        this.cbInductor.getStore().load({
                            scope: this,
                            callback: function (records, operation, success) {
                                //Cargar el inductor en cuestión
                                var recordfounded = records.find(function (item) {
                                    return item.data.idinductor == this.objmodprorrateo.idinductor;
                                }, this);
                                this.cbInductor.select(recordfounded);
                                this.cbInductor.collapse();

                                //Cargar los receptores
                                this.loadReceptores(this.objmodprorrateo.idinductor, this.objmodprorrateo.receptores, function (records, operation, success) {
                                    this.firstLoadMod = false;
                                    this.arrReceptoresOld = records;
                                });
                            }
                        });
                    }
                    else {
                        //Monto total o Elemento de gasto

                        if (this.objmodprorrateo.idorigenBD == 3) {
                            //Elemento de gasto
                            this.cbElementoGastoProrratear.setValueComboTree(this.objmodprorrateo.elementogastoaprorratear);
                        }

                        //Cargar los receptores
                        this.loadReceptores(this.objmodprorrateo.idinductor, this.objmodprorrateo.receptores, function (records, operation, success) {
                            this.firstLoadMod = false;
                            this.arrReceptoresOld = records;
                        });
                    }
                }
            },
            close: function (panel, eOpts) {
                if (this.taskTemp) {
                    this.runner.stop(this.taskTemp);
                    this.taskTemp = null;
                }
            }
        });

        this.cbOrigenBD.on({
            scope: this,
            change: function (combo, newValue, oldValue, eOpts) {
                if (newValue != oldValue) {
                    var objcolumninductor = this.gridpanelReceptores.down('gridcolumn[itemId=columninductor]');

                    this.cbInductor.clearValue();
                    this.cbElementoGastoProrratear.reset();
                    var cbReceptores = this.down('panel toolbar combotree[itemId=cmbReceptores]');

                    if (newValue == 1) {
                        //Unidades Físicas
                        this.cbInductor.show();
                        this.cbElementoGastoProrratear.hide();

                        objcolumninductor.show();
                        objcolumninductor.setText(this.idioma.lbBD);

                        cbReceptores.setDisabled(true);

                        if ((this.action == 'add') || (this.action == 'mod' && !this.firstLoadMod)) {
                            this.cbInductor.expand();
                            this.cbInductor.getStore().removeAll();
                            this.cbInductor.getStore().load();
                        }
                    }
                    else if (newValue == 3) {
                        //Elemento de gasto
                        this.cbInductor.hide();
                        this.cbElementoGastoProrratear.show();

                        objcolumninductor.hide();

                        cbReceptores.setDisabled(false);
                    }
                    else {
                        //Monto total
                        this.cbInductor.hide();
                        this.cbElementoGastoProrratear.hide();

                        objcolumninductor.hide();

                        cbReceptores.setDisabled(false);
                    }

                    //Limpiar receptores
                    this.clearReceptores();
                }
            }
        });

        this.cbInductor.on({
            scope: this,
            change: function (combo, newValue, oldValue, eOpts) {
                if (newValue && newValue != oldValue) {
                    var objcolumninductor = this.gridpanelReceptores.down('gridcolumn[itemId=columninductor]');

                    var abrInductor = combo.store.getAt(combo.store.find('idinductor', newValue));

                    objcolumninductor.setText(this.idioma.lbBD + '(' + abrInductor.data.abreviatura + ')');

                    //Limpiar receptores
                    this.clearReceptores();
                    this.cbReceptores.setDisabled(false);
                }
            }
        });

        this.cbReceptores.on({
            scope: this,
            selectcombotree: function (combotree, values) {
                this.btnaddReceptores.setDisabled(!(values.length > 0));
            }
        });

        this.btnaddReceptores.on({
            scope: this,
            click: function (button, e, eOpts) {
                button.setDisabled(true);

                var arrValuesComboTree = this.cbReceptores.getValueComboTree();

                this.loadReceptores(this.cbInductor.getValue(), arrValuesComboTree, function (records, operation, success) {
                    button.setDisabled(false);
                    this.cbReceptores.reset();
                });
            }
        });

        this.btndelReceptores.on({
            scope: this,
            click: function (button, e, eOpts) {
                var receptoresselected = this.gridpanelReceptores.getSelectionModel().getSelection();
                this.delReceptores(receptoresselected);
            }
        });

        this.gridpanelReceptores.getSelectionModel().on({
            scope: this,
            selectionchange: function (selmodel, selected, eOpts) {
                this.btndelReceptores.setDisabled(!(selected.length >= 2));
            }
        });

        this.btnAceptarWinProrrateo.on({
            scope: this,
            click: function (button, e, eOpts) {
                this.aceptarConfProrrateo(false);
            }
        });

        if (this.btnAplicarWinProrrateo) {
            this.btnAplicarWinProrrateo.on({
                scope: this,
                click: function (button, e, eOpts) {
                    this.aceptarConfProrrateo(true);
                }
            });
        }

    },
    /*
    * Función necesaria para limpiar los receptores
    * */
    clearReceptores: function () {
        this.cbReceptores.reset();
        this.gridpanelReceptores.getStore().removeAll();

        this.btnaddReceptores.setDisabled(true);
        this.btndelReceptores.setDisabled(true);
    },
    /*
    * Función necesaria para eliminar los receptores seleccionados
    * */
    delReceptores: function (arrRecordsReceptores) {
        this.gridpanelReceptores.getStore().remove(arrRecordsReceptores);
    },
    /*
    * Función necesaria para cargar los receptores
    * */
    loadReceptores: function (idinductor, arridreceptores, callback) {
        /*
        * arridreceptores => [{id:123}, {id:456}]
        * */

        this.gridpanelReceptores.getStore().removeAll();
        this.gridpanelReceptores.getStore().load({
            scope: this,
            params: {
                ctareceptores: Ext.encode(arridreceptores),
                idinductor: idinductor
            },
            callback: (callback) ? callback : function () {
            }
        });
    },
    /*
    * Función que verifica si los campos son válidos
    * */
    windowFormValid: function () {
        var origenBDValid = this.cbOrigenBD.isValid();
        var arrValid = [this.tfdescripcionProrrateo.isValid(), this.cmbTreeEmisor.isValid(),
            this.cbcmbEGTraspaso.isValid(), this.fechaprorrateo.isValid(), this.porcientoatraspasar.isValid(), origenBDValid];

        if (origenBDValid) {
            if (this.cbOrigenBD.getValue() == 1) {
                arrValid.push(this.cbInductor.isValid());
            }
            else if (this.cbOrigenBD.getValue() == 3) {
                arrValid.push(this.cbElementoGastoProrratear.isValid());
            }
        }

        arrValid.push(this.gridpanelReceptores.getStore().getCount() > 0);

        var index = arrValid.indexOf(false);
        return index === -1;
    },
    /*
    * Verifica si hubo cambios en el formulario
    * */
    windowFormHaveChanges: function () {
        var descripcionChanged = this.objmodprorrateo.descripcion != this.tfdescripcionProrrateo.getValue();
        var emisorChanged = this.objmodprorrateo.emisor[0].id != this.cmbTreeEmisor.getValueComboTree()[0].id;
        var gastotraspasoChanged = this.objmodprorrateo.elementogastotraspaso[0].id != this.cbcmbEGTraspaso.getValueComboTree()[0].id;
        var fechaChanged = this.objmodprorrateo.fecha != this.fechaprorrateo.getRawValue();
        var porcientoChanged = this.objmodprorrateo.porcientotraspasar != this.porcientoatraspasar.getValue();
        var origenBDChanged = this.objmodprorrateo.idorigenBD != this.cbOrigenBD.getValue();

        var gastoaprorratearChanged = false;
        if (!origenBDChanged && this.objmodprorrateo.idorigenBD == 3) {
            gastoaprorratearChanged = this.objmodprorrateo.elementogastoaprorratear[0].id != this.cbElementoGastoProrratear.getValueComboTree()[0].id;
        }

        var arrReceptoresOld = [];
        var arrReceptoresNew = [];
        this.arrReceptoresOld.forEach(function (item, index, AllItems) {
            arrReceptoresOld.push({id: item.data.id, value: item.data.valorinductor});
        }, this);
        this.gridpanelReceptores.getStore().getRange().forEach(function (item, index, AllItems) {
            arrReceptoresNew.push({id: item.data.id, value: item.data.valorinductor});
        });
        //Ordenando los arreglos para después codificarlos y comprarar los strings
        arrReceptoresOld.sort(function (a, b) {
            if (a.id > b.id) {
                return 1;
            }
            if (a.id < b.id) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });
        arrReceptoresNew.sort(function (a, b) {
            if (a.id > b.id) {
                return 1;
            }
            if (a.id < b.id) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });
        var receptoresChanged = Ext.encode(arrReceptoresOld) != Ext.encode(arrReceptoresNew);

        var changed = (descripcionChanged || emisorChanged || gastotraspasoChanged || fechaChanged || porcientoChanged || origenBDChanged || receptoresChanged || gastoaprorratearChanged);
        return changed;
    },
    /*
    * Función necesaria para iniciar la tarea que verfica la validación de los campos del formulario
    * También verifica si hubo cambios en el formaulario en caso de que se esté modificando
    * */
    startTaskRunnerValidation: function (action, arrbotones) {
        var task = {
            scope: this,
            run: function () {
                var activate = (action == 'add') ? this.windowFormValid() : (this.windowFormValid() && this.windowFormHaveChanges());

                arrbotones.forEach(function (item, index, allItems) {
                    item.setDisabled(!activate);
                }, this);
            },
            interval: 300
        };

        return this.runner.start(task);
    },
    /*
    * Función necesaria para adicionar la configuración del prorrateo (Aceptar o Aplicar)
    * */
    aceptarConfProrrateo: function (aplicar) {
        var resobj = {};

        resobj.idprorrateo = (this.action == 'add') ? null : this.objmodprorrateo.idprorrateo;

        resobj.idnivelprorrateo = this.nivel.idnivelprorrateo;

        resobj.descripcion = this.tfdescripcionProrrateo.getValue().trim();

        var emisor = this.cmbTreeEmisor.getValueComboTree();
        resobj.idcuentaemisor = emisor[0].id;
        resobj.cuentaemisor = emisor[0].value.trim();

        var elmgastoTrasp = this.cbcmbEGTraspaso.getValueComboTree();
        resobj.idelementogastotraspaso = elmgastoTrasp[0].id;
        resobj.elementogastotraspaso = elmgastoTrasp[0].value.trim();

        resobj.fecha = this.fechaprorrateo.getRawValue().trim();

        resobj.idorigenBD = this.cbOrigenBD.getValue();
        resobj.origenBD = this.cbOrigenBD.getRawValue().trim();

        if (resobj.idorigenBD == 1) {
            //Unidades Físicas
            resobj.idinductor = this.cbInductor.getValue();
            resobj.inductor = this.cbInductor.getRawValue().trim();
        }
        else if (resobj.idorigenBD == 3) {
            //Elemento de gasto a prorratear
            var egprorratear = this.cbElementoGastoProrratear.getValueComboTree();
            resobj.idelementogastoaprorratear = egprorratear[0].id;
            resobj.elementogastoaprorratear = egprorratear[0].value.trim();
        }

        resobj.porcientotraspasar = this.porcientoatraspasar.getValue();

        var arrreceptoresgrid = this.gridpanelReceptores.getStore().getRange();
        var arrreceptores = [];
        arrreceptoresgrid.forEach(function (item, index, allItems) {
            arrreceptores.push({
                idcuentareceptor: item.data.id,
                cuentareceptor: item.data.receptor,
                idinductor: (item.data.idinductor) ? item.data.idinductor : '',
                valorinductor: (item.data.valorinductor) ? item.data.valorinductor : ''
            });
        }, this);

        // resobj.receptores = Ext.encode(arrreceptores);
        resobj.receptores = arrreceptores;

        resobj.idestado = 1;
        resobj.nocomprobante = '';
        resobj.idcomprobante = '';

        this.fireEvent('addprorrateo', this, resobj, aplicar);

        if (aplicar) {
            //limpiar los campos y no cerrar la ventana
            this.tfdescripcionProrrateo.setValue('');
            this.cmbTreeEmisor.reset();
            this.cbcmbEGTraspaso.reset();

            this.cbOrigenBD.clearValue();
            this.cbInductor.clearValue();
            this.cbInductor.hide();
            this.cbElementoGastoProrratear.hide();

            var objcolumninductor = this.gridpanelReceptores.down('gridcolumn[itemId=columninductor]');
            if (!objcolumninductor.hidden) {
                objcolumninductor.hide();
            }

            this.cbReceptores.setDisabled(true);

            //Limpiar receptores
            this.clearReceptores();
        }
        else {
            //cerrar la ventana
            this.close();
        }
    }
});