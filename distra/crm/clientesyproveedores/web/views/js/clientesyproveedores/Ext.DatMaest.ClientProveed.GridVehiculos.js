/**
 * @class Ext.DatMaest.ClientProveed
 * @extends Ext.panel
 * @author Ing. Pulga
 */
Ext.ns('Ext.DatMaest.ClientProveed');
Ext.DatMaest.ClientProveed.GridVehiculos = Ext.extend(Ext.Panel, {
    vehiculosDel: [],
    layout: 'border',
    constructor: function (params) {
        var me = this;
        this.etiquetas = params.etiquetas || {};
        me.title = me.etiquetas.lbVehiculo;

        me.columns = [
            {
                header: me.etiquetas.lbDenominacion,
                dataIndex: 'denominacion',
                width: 220,
                flex: 1
            },
            {
                header: me.etiquetas.lbMatricula,
                dataIndex: 'matricula',
                width: 170,
                flex: 1
            },
            {
                header: me.etiquetas.lbMarca,
                dataIndex: 'marca',
                width: 170,
                flex: 1,
                renderer: function(value, meta, record){
                    meta.attr = 'ext:qtip="<p>' + value + '</p>"';
                    return value+(record.get('codigo')?' ('+record.get('codigo')+')':'');
                }
            },
            {
                header: me.etiquetas.lbModelo,
                dataIndex: 'modelo',
                width: 170,
                flex: 1
            },
            {
               header: me.etiquetas.lbSerie,
                dataIndex: 'serie',
                width: 170,
                flex: 1
            },
            {
                header: me.etiquetas.lbAnno,
                dataIndex: 'ano',
                width: 50,
                flex: 1
            }
        ];
        me.store = new Ext.data.SimpleStore({
            fields: [
                {name: 'denominacion', mapping: 'denominacion'},
                {name: 'marca', mapping: 'marca'},
                {name: 'codigo', mapping: 'codigo'},
                {name: 'modelo', mapping: 'modelo'},
                {name: 'provincia', mapping: 'provincia'},
                {name: 'idmarca', mapping: 'idmarca'},
                {name: 'idmodelo', mapping: 'idmodelo'},
                {name: 'nacionalidad', mapping: 'nacionalidad'},
                {name: 'idindicador', mapping: 'idindicador'},
                {name: 'idvehiculocontrato', mapping: 'idvehiculocontrato'},
                {name: 'chapa', mapping: 'chapa'},
                {name: 'matricula', mapping: 'matricula'},
                {name: 'serie', mapping: 'serie'},
                {name: 'tipo', mapping: 'tipo'},
                {name: 'ano', mapping: 'ano'},
                {name: 'reasignar'},
                {name: 'tipomedio', mapping: 'tipomedio'},
                {name: 'datos_json', mapping: 'datos_json'}
            ],
            listeners: {
                scope: this,
                remove: function (store, record) {
                    if (!Ext.isEmpty(record.data.idindicador)) {
                        me.vehiculosDel.push(record.data.idindicador);
                    }
                }
            }
        });
        me.sm = new Ext.grid.RowSelectionModel({
            listeners: {
                selectionchange: function (yo) {
                    me.btnDel.setDisabled(yo.getSelections().length == 0);
                }
            }
        });

        me.btnAdd = new Ext.Button({
            xtype: 'button',
            text: me.etiquetas.lbBtnAdicionar,
            iconCls: 'adicionar',
            tooltip: me.etiquetas.lbAdicionarVehiculo,
            handler: function () {
                /* es pasado, se fue, ya esta
                var winProd = new Ext.DatMaest.ClientProveed.WindowProducto({
                    gridvehiculo: me.grid,
                    etiquetas: me.etiquetas
                });
                winProd.show();
                winProd.store.load();
                */
                // alert('ooororr')

                
                me.textTipoVehiculo=new Ext.form.ComboBox({
                    fieldLabel: 'Tipo',
                    columnWidth: 1,
                    margin: '5 5 5 5',
                    allowBlank: false,
                    anchor: '100%',
                    name: 'tipo',
                    enableKeyEvents: true,
                    valueField: 'idtipovehiculo',
                    displayField: 'denominacion',
                    triggerAction: 'all',
                    queryParam: 'denominacion',
                    loadingText: me.etiquetas.lbCargando,
                    forceSelection: true,
                    store: new Ext.data.Store({
                        url: 'getTiposVehiculos',
                        reader: new Ext.data.JsonReader({
                            totalProperty: 'cant',
                            root: 'data',
                        }, [
                            {name: 'idtipovehiculo'},
                            {name: 'denominacion'}
                        ]),
                    }),
                    listeners: {
                        select: function(combo, record){
                            me.checkValid();
                        },
                    }
                });
                me.textDenominacion=new Ext.form.TextField({
                    // fieldLabel: _this.etiquetas.lbNombre,
                    fieldLabel: me.etiquetas.lbDenominacion,
                    columnWidth: 1,
                    margin: '10 5 5 10',
                    allowBlank: false,
                    anchor: '100%',
                    name: 'denominacion',
                    enableKeyEvents: true,
                    listeners: {
                        keyup: function (textfield, event) {
                            me.checkValid();
                        }
                    }
                    // labelSeparator: ':' + _this.required,
                });
                me.textMatricula=new Ext.form.TextField({
                    // fieldLabel: _this.etiquetas.lbNombre,
                     fieldLabel: me.etiquetas.lbMatricula,
                    columnWidth: .5,
                    margin: '10 10 5 5',
                    allowBlank: false,
                    anchor: '100%',
                    name: 'matricula',
                    enableKeyEvents: true,
                    listeners: {
                        keyup: function (textfield, event) {
                            me.checkValid();
                        }
                    }
                    // labelSeparator: ':' + _this.required,
                });
                me.textMarca=new Ext.form.ComboBox({
                    // fieldLabel:'marca1',
                    fieldLabel: me.etiquetas.lbMarca,
                    columnWidth: .5,
                    margin: '5 5 5 5',
                    allowBlank: false,
                    anchor: '100%',
                    name: 'marca',
                    enableKeyEvents: true,
                    valueField: 'idmarca',
                    displayField: 'denominacion',
                    triggerAction: 'all',
                    queryParam: 'denominacion',
                    loadingText: me.etiquetas.lbCargando,
                    forceSelection: true,
                    minChars: 2,
                    store: new Ext.data.Store({
                        url: 'getMarcasVehiculo',
                        reader: new Ext.data.JsonReader({
                            totalProperty: 'cant',
                            root: 'data',
                        }, [
                            {name: 'idmarca'},
                            {name: 'denominacion'},
                            {name: 'codigo'}
                        ]),
                    }),
                    tpl: '<tpl for="."><div  class="x-combo-list-item" ' +
                        'qtip="{denominacion}">' +
                        '{denominacion} <tpl if="codigo">({codigo})</tpl></div></tpl>',
                    listeners: {
                        select: function(combo, record){
                            me.textModelo.reset();
                            me.textModelo.store.baseParams['idmarca']=record.get('idmarca');
                            me.textModelo.store.load();
                            me.textModelo.setDisabled(false);
                            me.checkValid();
                        },
                        keydown: function (combo, e) {
                            // console.log('keydown', e)
                            if (e.getKey() == e.BACKSPACE || e.getKey() == e.DELETE) {
                                setTimeout(function () {
                                    if (!combo.getRawValue() || combo.getRawValue()=='') {
                                        me.checkValid();
                                        delete me.textModelo.store.baseParams['idmodelo'];
                                        me.textModelo.reset();
                                        me.textModelo.store.removeAll();
                                        me.textModelo.setDisabled(true);
                                    }
                                }, 100);
                            }
                        }
                    }
                    // labelSeparator: ':' + _this.required,
                });
                me.textModelo=new Ext.form.ComboBox({
                    fieldLabel: me.etiquetas.lbModelo,
                    columnWidth: .5,
                    margin: '5 10 5 5',
                    allowBlank: false,
                    anchor: '100%',
                    name: 'modelo',
                    enableKeyEvents: true,
                    valueField: 'idmodelo',
                    displayField: 'denominacion',
                    triggerAction: 'all',
                    queryParam: 'denominacion',
                    loadingText: me.etiquetas.lbCargando,
                    disabled:true,
                    forceSelection: true,
                    minChars: 2,
                    store: new Ext.data.Store({
                        url: 'getModelosVehiculo',
                        reader: new Ext.data.JsonReader({
                            totalProperty: 'cant',
                            root: 'data',
                        }, [
                            {name: 'idmodelo'},
                            {name: 'denominacion'}
                        ]),
                    }),
                    listeners: {
                        select: function(combo, record){
                            me.checkValid();
                        },
                        // keyup: function (textfield, event) {
                        //     me.checkValid();
                        // }
                    }
                    // labelSeparator: ':' + _this.required,
                });
                me.textSerie=new Ext.form.TextField({
                    fieldLabel: me.etiquetas.lbSerie,
                    columnWidth: .5,
                    margin: '5 5 10 5',
                    allowBlank: false,
                    anchor: '100%',
                    name: 'serie',
                    enableKeyEvents: true,
                    listeners: {
                        keyup: function (textfield, event) {
                            me.checkValid();
                        }
                    }
                    // labelSeparator: ':' + _this.required,
                });
                me.textAnno=new Ext.form.NumberField({
                    fieldLabel: me.etiquetas.lbAnnoFabric,
                    columnWidth: .5,
                    margin: '5 10 10 5',
                    // allowBlank: false,
                    anchor: '100%',
                    name: 'ano',
                    // maskRe: /0-9/,
                    regex: /[0-9]{4}/,
                    regexText: 'Sólo se admiten números.',
                    maxLength: 4,
                    maxLengthText: 'Sólo se admiten números.',
                    enableKeyEvents: true,
                    listeners: {
                        keyup: function (textfield, event) {
                            me.checkValid();
                        }
                    }
                    // labelSeparator: ':' + _this.required,
                });
                me.formWin=new Ext.FormPanel({
                    frame: true,
                    layout: 'column',
                    labelAlign: 'top',
                    border: false,
                    bodyStyle: 'padding:5px',
                    items:[
                        {
                            columnWidth: 1,
                            layout: 'form',
                            style: 'margin:0 0 0 0',
                            items: me.textTipoVehiculo,
                        },
                        {
                            columnWidth: 0.5,
                            layout: 'form',
                            style: 'margin:0 0 0 0',
                            items: me.textDenominacion,
                        },
                        {
                            columnWidth: 0.5,
                            layout: 'form',
                            style: 'margin:0 0 0 5',
                            items: me.textMatricula,
                        },
                        {
                            columnWidth: 0.5,
                            layout: 'form',
                            style: 'margin:0 0 0 0',
                            items: me.textMarca,
                        },
                        {
                            columnWidth: 0.5,
                            layout: 'form',
                            style: 'margin:0 0 0 5',
                            items: me.textModelo,
                        },
                        {
                            columnWidth: 0.5,
                            layout: 'form',
                            style: 'margin:0 0 0 0',
                            items: me.textSerie,
                        },
                        {
                            columnWidth: 0.5,
                            layout: 'form',
                            style: 'margin:0 0 0 5',
                            items: me.textAnno,
                        }
                        // me.textMatricula,
                        // me.textMarca,
                        // me.textModelo,
                        // me.textSerie
                    ]
                });
                me.btnAceptar = new Ext.Button({
                    text: _this.etiquetas.lbBtnAceptar,
                    tooltip: _this.etiquetas.lbTtAceptar,
                    iconCls: 'aceptar',
                    disabled: true,
                    handler: function () {
                        var datos=me.formWin.getForm().getValues();
                        var index=me.textMarca.store.find('idmarca', me.textMarca.getValue());
                        if(index!=-1)datos['codigo']=me.textMarca.store.getAt(index).get('codigo');
                        me.store.loadData([datos], true);
                        win.close();
                    }
                });
                me.btnCancelar = new Ext.Button({
                    text: _this.etiquetas.lbBtnCancelar,
                    tooltip: _this.etiquetas.lbTtCancelar,
                    iconCls: 'cancelar',
                    handler: function () {
                        win.close();
                    }
                });
                var win=new Ext.Window({
                    title: me.etiquetas.lbAdicionarVehiculo,
                    resizable: false,
                    modal: true,
                    width: 500,
                    items:[
                        me.formWin
                    ],
                    buttons:[
                        me.btnCancelar,
                        me.btnAceptar
                    ]
                });
                win.show();
            }
        });
        me.btnDel = new Ext.Button({
            xtype: 'button',
            text: me.etiquetas.lbBtnEliminar,
            iconCls: 'eliminar',
            disabled: true,
            tooltip: me.etiquetas.lbEliminarVehiculo,
            handler: function () {
                mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar los veh&iacute;culos seleccionados?',
                    function (response) {
                        if (response === 'ok') {
                            me.sm.getSelections().forEach(function (x) {
                                me.store.remove(x);
                            })
                            me.store.fireEvent('datachange', me.store);
                        }
                    }
                );
            }
        });

        me.btnImportar = new Ext.Button({
            xtype: 'button',
            text: me.etiquetas.lbImportar,
            iconCls: 'importar',
            tooltip: me.etiquetas.qtipImportar,
            handler: function () {
                me.fileimport = new Ext.form.FileUploadField({
                    width: '100%',
                    emptyText: me.etiquetas.emptyTextExcel,
                    fieldLabel: me.etiquetas.lbArchivo,
                    regex: /.+\.(xls)/i,
                    regexText: me.etiquetas.regexTextExcel,
                    name: 'excel',
                    buttonCfg: {
                        iconCls: 'icondistra-buscar',
                        text: '',
                        tooltip: 'Buscar archivo',
                        qtip: 'Buscar archivo'
                    },
                    listeners: {
                        scope: this,
                        fileselected: function () {
                            win.buttons[1].setDisabled(!me.formWinArchivo.getForm().isValid());
                        }
                    }
                });

                me.fieldsetimport=new Ext.form.FieldSet({
                    title: 'Formato del documento a importar',
                    anchor: '100%',
                    height: 135,
                    items: [new Ext.Panel({
                        // id: 'p-photo-container',
                        border: false,
                        autoShow: true,
                        html: '<div><center><img src="/configuracion/comun/views/images/formatoImportarVehiculos.png" ALT="""/></center></div>'
                        // html: '<div><div style="background: url(/configuracion/comun/views/images/formatoImportarVehiculos.png) no-repeat center center fixed";></div></div>'
                    })]
                });

                // me.radiogroup

                me.formWinArchivo = new Ext.FormPanel({
                    fileUpload: true,
                    frame: true,
                    border: false,
                    layout: 'form',
                    labelWidth: 50,
                    // buttonAlign: 'right',
                    // labelWidth: 30,
                    items: [me.fieldsetimport, me.fileimport],
                });

                var win=new Ext.Window({
                    title: me.etiquetas.qtipImportar,
                    //resizable: false,
                    modal: true,
                    width: 600,
                    items:[
                        me.formWinArchivo
                    ],
                    buttons:[
                        {
                            text: _this.etiquetas.lbBtnCancelar,
                            tooltip: _this.etiquetas.lbTtCancelar,
                            iconCls: 'cancelar',
                            handler: function () {
                                win.close();
                            }
                        },
                        {
                            text: _this.etiquetas.lbBtnAceptar,
                            tooltip: _this.etiquetas.lbTtAceptar,
                            iconCls: 'aceptar',
                            disabled: true,
                            handler: function () {
                                // me.store.add(me.formWin.getForm().getValues());
                                // me.store.loadData([me.formWin.getForm().getValues()], true);
                                Ext.MessageBox.show({
                                    title: me.etiquetas.lbEsperando,
                                    msg: me.etiquetas.lbCargando,
                                    width: 300,
                                    wait: true,
                                    waitConfig: {interval: 300},
                                    progress: true,
                                    closable: false
                                });
                                me.formWinArchivo.getForm().submit({
                                    method: "POST",
                                    url: 'importarVehiculos',
                                    // params: {
                                    //     datos: Ext.encode(data)
                                    // },
                                    success: function (form, action) {
                                        Ext.MessageBox.hide();
                                        var response = Ext.decode(action.response.responseText);
                                        if(response.count>0){
                                            me.store.loadData(response.data);
                                            // me.store.fireEvent('update', me.store);
                                        }
                                        win.close();
                                    }
                                })
                            }
                        }
                    ]
                });
                win.show();
            }
        });

        me.tbar = [
            me.btnAdd,
            me.btnDel,
            me.btnImportar
        ];

        me.grid = new Ext.grid.GridPanel({
            region: 'center',
            store: me.store,
            sm: me.sm,
            columns: me.columns,
            loadMask: this.etiquetas.lbCargando || 'Cargando...'
        });

        me.items = [me.grid];

        Ext.DatMaest.ClientProveed.GridVehiculos.superclass.constructor.call(this, params);

    },
    checkValid: function(){
        var me=this;
        me.btnAceptar.setDisabled(!me.formWin.getForm().isValid());
    }
});
