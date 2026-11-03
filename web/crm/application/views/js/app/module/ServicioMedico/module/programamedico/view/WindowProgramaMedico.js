Ext.define('ProgramaMedico.view.WindowProgramaMedico', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.windowprogramamedico',
    autoScroll: true,
    autoHeight: true,
    width: 950,
    height: 450,
    maximizable: false,
    layout: 'fit',
    defaultFocus: 'nombre',
    initComponent: function () {
        var me=this, cont=1;

        me.createObjects();

        me.items=Ext.create('Ext.ux.CustomForm',{
            bodyStyle: 'background:#DFE9F6;',
            layout: 'fit',
            items:[
                Ext.create('Ext.tab.Panel', {
                    layout: 'fit',
                    items:[
                        {
                            title: 'Información general',
                            bodyStyle: 'background:#DFE9F6;',
                            layout: 'column',
                            defaults:{
                                labelAlign: 'top',
                                margin: '2 3 2 3',
                            },
                            items:[
                                {
                                    xtype: 'hiddenfield',
                                    name: 'idprogramamedico'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Nombre programa',
                                    itemId: 'nombre',
                                    name: 'nombre',
                                    allowBlank: false,
                                    first: true,
                                    maxLength: 255,
                                    columnWidth: 0.7
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Número',
                                    name: 'numero',
                                    allowBlank: false,
                                    // regexText: me.etiquetas.vNumDomain.replace('<#dominio#>', 'enteros'),
                                    columnWidth: 0.3
                                },
                                {
                                    xtype: 'hiddenfield',
                                    name: 'idpaciente'
                                },
                                Ext.create('Ext.ux.CmbSelectField', {
                                    fieldLabel: 'Paciente',
                                    name: 'paciente',
                                    mapping: 'NomClienteproveedor.nombre',
                                    localId: 'idpaciente',
                                    module: 'TipoContrato',
                                    noactions: true,
                                    allowBlank: false,
                                    filters: {
                                        idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun,
                                        idclasificacion: 2
                                    },
                                    columnWidth: 0.5
                                }),
                                // {
                                //     xtype: 'numberfield',
                                //     fieldLabel: 'Edad',
                                //     name: 'edad',
                                //     minValue: 0,
                                //     allowDecimals: false,
                                //     allowExponential: false,
                                //     columnWidth: 0.1
                                // },
                                {
                                    xtype: 'datefield',
                                    fieldLabel: 'Nacimiento',
                                    name: 'fechanacimiento',
                                    columnWidth: 0.1
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: 'Acompañantes',
                                    name: 'acompannantes',
                                    minValue: 0,
                                    allowDecimals: false,
                                    allowExponential: false,
                                    columnWidth: 0.1
                                },
                                // {
                                //     xtype: 'textfield',
                                //     fieldLabel: 'País',
                                //     name: 'pais',
                                //     allowBlank: false,
                                //     maxLength: 255,
                                //     columnWidth: 0.3
                                // },
                                {
                                    xtype: 'hiddenfield',
                                    name: 'idpais',
                                },
                                Ext.create('Nomencladores.view.CmbPaises', {
                                    fieldLabel: 'País',
                                    name: 'pais',
                                    allowBlank: false,
                                    maxLength: 255,
                                    columnWidth: 0.3
                                }),
                                {
                                    xtype: 'datefield',
                                    fieldLabel: 'Fecha de solicitud',
                                    name: 'fechasolicitud',
                                    allowBlank: false,
                                    value: new Date(),
                                    columnWidth: 0.25
                                },
                                {
                                    xtype: 'hiddenfield',
                                    name: 'idtipocontacto'
                                },
                                {
                                    xtype: 'combobox',
                                    fieldLabel: 'Tipo de contacto',
                                    name: 'tipocontacto',
                                    localId: 'idtipocontacto',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: [
                                            {name: 'idtipomediocontacto'},
                                            {name: 'denominacion'}
                                        ],
                                        proxy: {
                                            type: 'ajax',
                                            url: UtilsFn.buildUrl({action: 'getTipoContacto'}, ModuleMgr.get('ProgramaMedico')),
                                            reader: {
                                                idProperty: 'idtipomediocontacto',
                                                type: 'json',
                                                root: 'data',
                                                totalProperty: 'count'
                                            }
                                        }
                                    }),
                                    displayField: 'denominacion',
                                    valueField: 'denominacion',
                                    allowBlank: false,
                                    columnWidth: 0.25
                                },
                                {
                                    xtype: 'hiddenfield',
                                    name: 'idemisor'
                                },
                                {
                                    xtype: 'combobox',
                                    fieldLabel: 'Emisor',
                                    name: 'emisor',
                                    localId: 'idemisor',
                                    pageSize: 20,
                                    store: me.storeresponsable,
                                    valueField: 'nombreapellidos',
                                    displayField: 'nombreapellidos',
                                    queryParam: 'nombreapellidos',
                                    columnWidth: 0.5
                                },
                                // {
                                //     xtype: 'combobox',
                                //     fieldLabel: 'Tipo de programa',
                                //     name: 'tipoprograma',
                                //     // allowBlank: false,
                                //     columnWidth: 0.25
                                // },
                                {
                                    xtype: 'hiddenfield',
                                    name: 'idtipoprograma'
                                },
                                Ext.create('Ext.ux.CmbSelectField', {
                                    fieldLabel: 'Tipo de programa',
                                    name: 'tipoprograma',
                                    mapping: 'NomTipoPrograma.denominacion',
                                    localId: 'idtipoprograma',
                                    module: 'Nomencladores',
                                    noactions: false,
                                    allowBlank: true,
                                    filters: {},
                                    flex: 1,
                                    columnWidth: 0.25
                                }),
                                {
                                    xtype: 'hiddenfield',
                                    name: 'idespecialidad'
                                },
                                {
                                    xtype: 'combobox',
                                    fieldLabel: 'Especialidad',
                                    name: 'especialidad',
                                    localId: 'idespecialidad',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: [
                                            {name: 'idespecialidad'},
                                            {name: 'denespecialidad'}
                                        ],
                                        proxy: {
                                            type: 'ajax',
                                            url: UtilsFn.buildUrl({action: 'getEspecialidades'}, ModuleMgr.get('ProgramaMedico')),
                                            reader: {
                                                idProperty: 'idespecialidad',
                                                type: 'json',
                                                root: 'data',
                                                totalProperty: 'cant'
                                            }
                                        }
                                    }),
                                    displayField: 'denespecialidad',
                                    valueField: 'denespecialidad',
                                    queryParam: 'denominacion',
                                    allowBlank: false,
                                    columnWidth: 0.25
                                },
                                // {
                                //     xtype: 'hiddenfield',
                                //     name: 'idmedico'
                                // },
                                // {
                                //     xtype: 'combobox',
                                //     fieldLabel: 'Médico que realiza el programa',
                                //     name: 'medico',
                                //     localId: 'idmedico',
                                //     pageSize: 20,
                                //     store: me.storeresponsable,
                                //     valueField: 'nombreapellidos',
                                //     displayField: 'nombreapellidos',
                                //     queryParam: 'nombreapellidos',
                                //     allowBlank: false,
                                //     columnWidth: 0.5
                                // },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Historia clínica',
                                    name: 'historiaclinica',
                                    maxLength: 255,
                                    columnWidth: 0.25
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Habitación',
                                    name: 'habitacion',
                                    maxLength: 255,
                                    columnWidth: 0.25
                                },
                                {
                                    xtype: 'datefield',
                                    fieldLabel: 'Fecha de entrada',
                                    name: 'fechaentrada',
                                    columnWidth: 0.25
                                },
                                {
                                    xtype: 'datefield',
                                    fieldLabel: 'Fecha de salida prevista',
                                    name: 'fechasalida',
                                    columnWidth: 0.25
                                },
                                {
                                    xtype: 'hiddenfield',
                                    name: 'idarea'
                                },
                                Ext.create('GestionContratoImportacion.view.CmbArea', {
                                    fieldLabel: 'Área',
                                    name: 'area',
                                    localId: 'idarea',
                                    // allowBlank: false,
                                    editable: false,
                                    columnWidth: 0.5
                                }),
                                // {
                                //     xtype: 'hiddenfield',
                                //     name: 'idresponsable'
                                // },
                                // {
                                //     xtype: 'combobox',
                                //     fieldLabel: 'Responsable',
                                //     name: 'responsable',
                                //     allowBlank: false,
                                //     pageSize: 20,
                                //     autoExpand: false,
                                //     store: me.storeresponsable,
                                //     valueField: 'nombreapellidos',
                                //     displayField: 'nombreapellidos',
                                //     queryParam: 'nombreapellidos',
                                //     localId: 'idresponsable',
                                //     hidden: true,
                                //     hideMode: 'visibility',
                                //     columnWidth: 0.5
                                // },
                                {
                                    xtype: 'textarea',
                                    fieldLabel: 'Motivo de solicitud',
                                    name: 'motivosolicitud',
                                    height: 120,
                                    columnWidth: 0.5
                                },
                                {
                                    xtype: 'textarea',
                                    fieldLabel: 'Descripción',
                                    name: 'descripcion',
                                    height: 120,
                                    columnWidth: 0.5
                                },
                            ]
                        },
                        {
                            title: 'Cobro',
                            itemId: 'tabCobro',
                            bodyStyle: 'background:#DFE9F6;',
                            layout: 'column',
                            defaults:{
                                labelAlign: 'top',
                                margin: '2 3 2 3',
                            },
                            items:[
                                Ext.create('Ext.ux.MoneyField', {
                                    // xtype: 'numberfield',
                                    fieldLabel: 'Monto total',
                                    name: 'montototal',
                                    readOnly: true,
                                    columnWidth: 0.34
                                }),
                                {
                                    xtype: 'hiddenfield',
                                    name: 'idcondicionpago'
                                },
                                Ext.create('Ext.ux.CmbSelectField', {
                                    fieldLabel: 'Medio de pago',
                                    name: 'mediopago',
                                    mapping: 'NomMedioPago.nombre',
                                    localIdMulti: 'idmediopago',
                                    module: 'Nomencladores',
                                    noactions: false,
                                    allowBlank: true,
                                    filters: {},
                                    flex: 1,
                                    multiSelect: true,
                                    columnWidth: 0.33,
                                    pageSize: null
                                }),
                                {
                                    xtype: 'hiddenfield',
                                    name: 'idcondicionpago'
                                },
                                {
                                    xtype: 'combobox',
                                    fieldLabel: 'Condición de pago',
                                    name: 'condicionpago',
                                    localId: 'idcondicionpago',
                                    pageSize: 15,
                                    store: Ext.create('Ext.data.Store', {
                                        pageSize: 15,
                                        fields: [
                                            {name: 'idespecialidad'},
                                            {name: 'nombre'}
                                        ],
                                        proxy: {
                                            type: 'ajax',
                                            url: UtilsFn.buildUrl({action: 'getCondicionesPago'}, ModuleMgr.get('GestionContratoImportacion')),
                                            reader: {
                                                idProperty: 'idcondicionpago',
                                                type: 'json',
                                                root: 'data',
                                                totalProperty: 'count'
                                            }
                                        }
                                    }),
                                    displayField: 'nombre',
                                    valueField: 'nombre',
                                    queryParam: 'denominacion',
                                    columnWidth: 0.33
                                },
                                {
                                    xtype: 'hiddenfield',
                                    name: 'validgrid'
                                },
                                {
                                    xtype: 'grid',
                                    itemId: 'gridservicios',
                                    title: 'Servicios',
                                    height: 262,
                                    columnWidth: 1,
                                    margin: '5 3 2 3',
                                    selType: 'checkboxmodel',
                                    store: Ext.create('Ext.data.Store',{
                                        fields: [
                                            'idprogramamedicoservicio', 'idprogramamedico', 'idindicador', 'nombre', 'denominacion',
                                            'cantidad', 'descuento', 'codigo', 'idservicio', 'codigoproveedor',
                                            {name: 'total', type: 'float', defaultValue: 0}, 'facturado'],
                                        data:[],
                                        listeners:{
                                            update: function(store){
                                                console.log('update:')
                                                var total=0, totalesmonedas={};
                                                store.getRange().forEach(function(x){
                                                    total+=parseFloat(x.get('total'));
                                                    if(me.monedas_entidad){
                                                        me.monedas_entidad.forEach(function(field){
                                                            var index='montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda;
                                                            if(totalesmonedas[index]){
                                                                totalesmonedas[index]+=parseFloat(x.get(index))*parseFloat(x.get('cantidad'));
                                                            }else{
                                                                totalesmonedas[index]=parseFloat(x.get(index))*parseFloat(x.get('cantidad'));
                                                            }
                                                            // suma+=parseFloat(record.get('montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda));
                                                            // importe+=parseFloat(record.get('montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda))*parseFloat(record.get('cantidad'));
                                                        })
                                                    }
                                                })
                                                me.down('form').getForm().findField('montototal').setValue(total);
                                                Ext.Object.each(totalesmonedas, function(key, value){
                                                    if(me.down('form').getForm().findField(key))
                                                        me.down('form').getForm().findField(key).setValue(value);
                                                })
                                            },
                                            datachanged: function(store){
                                                console.log('Datachanged:', me.rendered, store, cont)
                                                if(me.rendered && me.down('form').getForm().findField('validgrid')) {
                                                    me.down('form').getForm().findField('validgrid').setValue(store.getRange().toString());
                                                    if (cont == 1)me.down('form').getForm().findField('validgrid').resetOriginalValue();
                                                    cont++;
                                                }

                                            }
                                        }
                                    }),
                                    plugins:[
                                        new Ext.grid.plugin.CellEditing({
                                            clicksToEdit: 1
                                        })
                                    ],
                                    columns:[
                                        {
                                            // text: 'F',
                                            dataIndex: 'facturado',
                                            width: 40,
                                            align: 'center',
                                            renderer: function(value, metaData){
                                                metaData.innerCls = value === '1' ? "icondistra-true verde" : "icondistra-false rojo";
                                                metaData.tdAttr = 'data-qtip="' + (value === '1'? 'Facturado' : 'No facturado') + '"';
                                            }
                                        },
                                        {
                                            text: 'Nombre', dataIndex: 'denominacion', flex: 1, renderer: me.renderTooltip
                                        },
                                        {
                                            text: 'Cantidad', dataIndex: 'cantidad', width: 65, align: 'right', renderer: me.renderMoney,
                                            editor: {
                                                xtype: 'numberfield',
                                                allowBlank: false,
                                                minValue: 0,
                                                decimalPrecision: 9,
                                                maxLength: 19,
                                                decimalSeparator: '.',
                                                allowDecimals:false,
                                                allowExponential:false
                                            },
                                        },
                                        {
                                            text: 'Descuento', dataIndex: 'descuento', width: 72, align: 'right', renderer: me.renderMoney
                                        },
                                        {
                                            text: 'Total', dataIndex: 'total', width: 90, align: 'right', renderer: function (value, meta, record) {
                                                var suma = 0, importe = 0;
                                                if(me.monedas_entidad){
                                                    me.monedas_entidad.forEach(function(field){
                                                        suma+=parseFloat(record.get('montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda));
                                                        importe+=parseFloat(record.get('montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda))*parseFloat(record.get('cantidad'));
                                                    })
                                                }
                                                record.set('total', importe);
                                                importe=Ext.util.Format.number(importe, '0.000,00/i');
                                                // console.log('/',importe,'/',record.get('total'),'/', value)
                                                meta.tdAttr = 'data-qtip="' + importe  + '"';
                                                return importe;
                                            }
                                        },
                                        // {
                                        //     text: 'Facturado',
                                        //     dataIndex: 'facturado',
                                        //     width: 40,
                                        //     align: 'center',
                                        //     renderer: function(value, metaData){
                                        //         console.log('renderer facturado:', value, metaData)
                                        //         // metaData.innerCls = value ? "icondistra-true verde" : "icondistra-false rojo";
                                        //         // metaData.tdAttr = 'data-qtip="' + (value ? 'Facturado' : 'No facturado') + '"';
                                        //         return value ? 'Si': 'No'
                                        //     }
                                        // }
                                    ],
                                    tbar:[
                                        {
                                            text: 'Adicionar',
                                            tooltip: 'Adicionar servicio',
                                            iconCls: 'adicionar',
                                            action: 'addwindowservicio'
                                        },
                                        {
                                            text: 'Eliminar',
                                            tooltip: 'Eliminar servicio',
                                            iconCls: 'eliminar',
                                            action: 'deleteservicio'
                                        },
                                        {
                                            text: 'Aplicar descuento',
                                            tooltip: 'Aplicar descuento',
                                            iconCls: 'porciento',
                                            action: 'aplicardescuento'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Observaciones',
                            bodyStyle: 'background:#DFE9F6;',
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'textarea',
                                    name: 'observaciones'
                                }
                            ]
                        },
                        Ext.create('GestionContratoImportacion.view.AreasPermitidas', {
                            title: 'Áreas permitidas'
                        })
                    ]
                })
            ]
        });

        this.callParent();
        me.defaultFocus= 'nombre';
    },
    createObjects: function(){
        var me=this;
        me.storeresponsable = Ext.create('Ext.data.Store', {
            pageSize: 20,
            fields: [
                {name: 'idpersona'},
                {name: 'numid'},
                {name: 'nombreapellidos'}
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getListadoPersonas'}, ModuleMgr.get('ProgramaMedico')),
                reader: {
                    idProperty: 'idpersona',
                    type: 'json',
                    root: 'data',
                    totalProperty: 'cant'
                }
            }
        });
    },
    renderMoney: function (value, meta, record) {
        if (Ext.isEmpty(value))
            value = 0;
        value = Ext.util.Format.number(value, '0.000,00/i');
        meta.tdAttr = 'data-qtip="' + value  + '"';
        return value;
    },
    renderTooltip: function (value, meta, record) {
        if (!Ext.isEmpty(value))
            meta.tdAttr = 'data-qtip="' + value  + '"';
        return value;
    },
    calcularTotal: function(store){
        var me=this, total=0;
        store.getRange().forEach(function(x){
            total+=parseFloat(x.get('total'));
        })
        me.down('#montototal').setValue(total);
    }
})