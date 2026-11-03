Ext.define('OfertaNegocio.view.WindowOfertaNegocio', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.windowofertanegocio',
    autoScroll: true,
    autoHeight: true,
    width: 1100,
    height: 450,
    maximizable: false,
    resizable: true,
    layout: 'fit',
    requires: ['GestionContrato.view.DocumentosAdicionales'],
    initComponent: function () {
        this.createInitialConfig();
        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;

        this.refhelp = this.action + "_dat_contrato";

        me.etiquetas=LangMgr.getLang(me);

        me.hftipo=Ext.create('Ext.form.field.Hidden', {
            name: 'tipo',
            value: me.tipo
        });

        me.idoferta=Ext.create('Ext.form.field.Hidden', {
            name: 'idoferta'
        });

        me.hfsolicitudnegocio = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowsolicitud'
        });
        me.sfsolicitudnegocio = Ext.create('Ext.form.field.ComboBox', {
            name: 'idsolicitud',
            fieldLabel: me.etiquetas.lbSolicitudNegocio,
            valueField:'idsolicitud',
            displayField:'nombre',

            queryMode: 'remote',
            queryDelay: 400,
            minChars: 1,
            pageSize: 20,
            listLoadingText: 'Cargando...',
            listEmptyText: 'No existen datos que mostrar.',

            store: Ext.create('Ext.data.Store',{
                // autoLoad:true,
                proxy:{
                    type: 'ajax',
                    actionMethods: {read: 'POST'},
                    url:UtilsFn.buildUrl({action: 'getSolicitudesNegocio'}, ModuleMgr.get('OfertaNegocio')),
                    reader: {
                        idProperty: 'idsolicitud',
                        type: 'json',
                        root: 'data',
                        totalProperty: 'count'
                    },
                    extraParams:{  //me.idestadosolicitud
                        'filter[0][field]': 'estado',
                        'filter[0][data][type]': 'list',
                        'filter[0][data][value]': '['+me.idestadosolicitud+']',
                        'filter[1][field]': 'cliente',
                        'filter[1][data][type]': 'list',
                        'filter[1][data][value]': '['+(me.context == 'cliente' ? 1 : 2)+']',
                        // me.context == 'cliente' ? 1 : 2
                    }
                },
                fields:[
                    'idsolicitud', 'nombre', 'idclienteproveedor', 'idsector', 'sector', 'idarearesponsable',
                    'descripcion', 'arearesponsable', 'idarea', 'area', 'clienteproveedor', 'idproveedores'
                ],
            }),
            flex: 1
        });
        // if(me.action=='add')me.sfsolicitudnegocio.getStore().load();

        me.numero = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbNumber,
            name: 'numero',
            allowBlank: false,
            maxLength:10,
            regex:/^[0-9\/\-]*$/,
            maskRe:/^[0-9\/\-]$/,
            regexText:me.etiquetas.vNumDomain.replace('<#dominio#>', 'enteros'),
            flex: 1
        });


        me.nombre = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbName,
            name: 'nombre',
            allowBlank: false,
            first: true,
            maxLength: 255,
            flex: 1,
            enableKeyEvents:true
        });

        me.hftipocontrato = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowcontrato',
            name: 'idtipocontrato'
        });

        me.sftipocontrato = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbTypeContract,
            name: 'tipocontrato',
            mapping: 'DatTipoContrato.denominacion',
            localId: 'idtipocontrato',
            module: 'TipoContrato',
            noactions: true,
            context: 'gestioncontratomainwindowcontrato',
            allowBlank: false,
            controller: 'gestioncontratomainwindow',
            flex: 1
        });

        me.hfcontratomarco = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowcontratomarco',
            name: 'idcontratomarco'
        });

        me.sfcontratomarco = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbContratoMarco,
            name: 'denominacioncontratomarco',
            mapping: 'DatContrato.numero',
            localId: 'idcontratomarco',
            module: 'TipoContrato',
            disabled: true,
            context: 'gestioncontratomainwindowcontratomarco',
            noactions: true,
            controller: 'gestioncontratomainwindow',
            filters: {
                contratomarco: 1
            },
            flex: 1
        });

        me.hfproforma = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowproforma',
            name: 'idproforma'
        });

        me.sfproforma = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbproforma,
            name: 'proforma',
            mapping: 'DatProforma.denominacion',
            localId: 'idproforma',
            module: 'Proformas',
            gen: 'f',
            filters: {},
            disabled: true,
            context: 'gestioncontratomainwindowproforma',
            controller: 'gestioncontratomainwindow',
            flex: 0.5
        });

        me.hfclienteproveedor = Ext.create('Ext.form.field.Hidden', {
            context: 'changeclienteproveedor',
            name: 'idclienteproveedor'
        });

        me.sfclienteproveedor = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.context=='cliente'?me.etiquetas.lbCliente:me.etiquetas.lbProveedor,
            // fieldLabel: me.etiquetas.lbClientProveedor,
            name: 'clienteproveedor',
            mapping: 'NomClienteproveedor.nombre',
            localId: 'idclienteproveedor',
            module: 'TipoContrato',
            noactions: true,
            allowBlank: false,
            context: 'gestioncontratomainwindowclienteproveedor',
            filters: {
                idtipo: me.context == 'cliente' ? 1 : 2,
                idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun
            },
            controller: 'gestioncontratomainwindow',
            flex: 1
        });

        me.hfsector = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowsector',
            name: 'idsector'
        });

        me.sfsector = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.textNomSector,
            // fieldLabel: me.context == "proveedor" ? me.etiquetas.lbOrganismo:me.etiquetas.lbEsquema,
            name: 'sector',
            mapping: 'NomSector.denominacion',
            localId: 'idsector',
            module: 'Nomencladores',
            allowBlank: false,
            gen: 'm',
            filters: {},
            //disabled: true,
            context: 'gestioncontratomainwindowsector',
            flex: 1
        });

        me.objeto = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: me.etiquetas.lbObjeto,
            //enableVar: false,
            allowBlank: true,
            height: 180,
            margin: '0 10 0 0',
            //enableSourceEdit: false,
            name: 'objeto',
            flex: 1
        });

        me.descripcion = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: me.etiquetas.lbDescripcion,
            name: 'descripcion',
            allowBlank: true,
            height: 180,
            flex: 1
        });

        me.fechafirma = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.etiquetas.lbFechaFirma,
            name: 'fechafirma',
            flex: 1
        });

        me.fechaFin = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.etiquetas.lbFechaFin,
            name: 'fechafin',
            readOnly: true,
            emptyText: ' ',
            hidden: true
        });

        me.formaPago = Ext.create('GestionContrato.view.FormaPago.FormaPago', {
            _this:me._this,
            columnWidth: 1, context:me.context,
            hidden: me.tipocontrato == 'contratoMarco',
            dataMedioPago: me.dataMedioPago,
            valueCheckHitoPago: me.valueCheckHitoPago,
            extrafields: me.extrafields,
            planificacion: me.planificacion,
            hitoStoreId: 'hitoStoreOferta',
            indicadorStoreId: 'indicadorStoreOferta',
        });

        me.fileupload = new Ext.create('Ext.form.field.File', {
            fieldLabel: me.etiquetas.lbContratoAdjunto,
            columnWidth: 1,
            name: 'file',
            buttonText: '',
            buttonConfig: {
                iconCls: 'icondistra-subirfichero icon-fileupload'
            }
        });

        me.btnShowFile = new Ext.create('Ext.Button', {
            tooltip: me.etiquetas.lbVerDocumento,
            iconCls: 'icondistra-descargar icon-medium',
            action: 'showfile',
            hidden: true,
            margin: '18 0 0 2',
            style: {
                borderWidth: '1px !important;'
            }
        });

        me.btnDelFile = new Ext.create('Ext.Button', {
            tooltip: me.etiquetas.lbEliminarDocumento,
            iconCls: 'icondistra-eliminar icon-medium',
            action: 'delfile',
            hidden: true,
            margin: '18 0 0 2',
            style: {
                borderWidth: '1px !important;'
            }
        });

        me.storeUnidadTiempo = Ext.create('Ext.data.Store', {
            fields: ['idunidadtiempo', 'denominacion'],
            data: [
                {"idunidadtiempo": 1, "denominacion": me.etiquetas.lbUTDay},
                {"idunidadtiempo": 2, "denominacion": me.etiquetas.lbUTMonth}
            ]
        });

        me.unidadTiempo = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '',
            hideLabel: true,
            store: me.storeUnidadTiempo,
            value:1,
            queryMode: 'local',
            valueField: 'idunidadtiempo',
            displayField: 'denominacion',
            flex: 1,
            name: 'unidadtiempo',
            editable: false,
            allowBlank: false
        });

        me.vigencia = Ext.create('Ext.form.field.Number', {
            fieldLabel: me.etiquetas.lbVigencia,
            name: 'vigencia',
            flex: 1,
            allowBlank: false,
            maxValue: 999,
            minValue: 1,
            allowDecimals: false,
            allowExponential: false,
            nanText: me.etiquetas.msgErrorValorVigencia,
            maxText: me.etiquetas.msgErrorValorVigencia,
            minText: me.etiquetas.msgErrorValorVigencia
        });

        me.stresponsable = Ext.create('Ext.data.Store', {
            pageSize: 10,
            fields: [
                {name: 'idpersona'},
                {name: 'numid'},
                {name: 'nombreapellidos'}
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getListadoPersonas'}, ModuleMgr.get('GestionContrato')),
                reader: {
                    idProperty: 'idpersona',
                    type: 'json',
                    root: 'data',
                    totalProperty: 'count'
                }
            }
        });

        me.hfresponsable = Ext.create('Ext.form.field.Hidden', {
            name: 'idpersona'
        });

        me.cmbreponsable = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbResponsableContrato,
            name: 'nombreresponsable',
            mode: 'remote',
            minChars: 0,
            pageSize: 10,
            flex: 1,
            autoExpand: false,
            store: me.stresponsable,
            valueField: 'nombreapellidos',
            displayField: 'nombreapellidos',
            queryParam: 'nombreapellidos',
            localId: 'idpersona',
            allowBlank: false
        });

        me.hfarea = Ext.create('Ext.form.field.Hidden', {
            name: 'idarea'
        });

        me.cmbarea = Ext.create('GestionContrato.view.CmbArea', {
            localId: 'idarea',
            name: 'arearesponsable',
            fieldLabel: me.etiquetas.lbArea,
            flex: 1,
            allowBlank: false,
            editable:false
        });

        me.formDynamic = Ext.create('Ext.ux.CustomForm', {
            bodyStyle: 'background:#DFE9F6;',
            columnWidth: 1,
            autoScroll: true,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: ['->', {
                    xtype: 'label',
                    text: me.etiquetas.lbElementosProforma,
                    style: 'font-weight:bold;color:#04468c;text-transform:uppercase'
                }, '->']
            }, {
                xtype: 'toolbar',
                dock: 'bottom',
                items: ['->', {
                    xtype: 'button',
                    iconCls: 'icondistra-adicionar icon-medium',
                    action: 'addSection',
                    tooltip: me.etiquetas.lbAddSeccion,
                    width: 21,
                    height: 21,
                    margin: '0 5 0 0'
                }]
            }]
        });

        me.validezMontos=Ext.create('Ext.form.field.Text',{
            allowBlank:false, value:'valido', hidden:true
        });

        me.customForm = Ext.create('Ext.ux.CustomForm', {
            bodyStyle: 'background:#DFE9F6;',
            // columnWidth: 1,
            layout: 'column',
            defaults: {
                bodyStyle: 'background:#DFE9F6;',
                margin: '0 5 0 5',
                columnWidth: 0.5,
                layout: 'hbox',
                border: false
            },
            autoScroll: true,
            title: 'Informaci&oacuten general',
            items: [
                {xtype: 'hidden', name: 'idespaciotrabajo', value: 0},
                me.validezMontos,
                {
                    items:[me.hftipo, me.idoferta]
                },
                {
                    items: [me.sfsolicitudnegocio, me.hfsolicitudnegocio]
                } ,
                {
                    items: me.nombre
                },
                {
                    items: [me.sfclienteproveedor, me.hfclienteproveedor]
                },
                {
                    items: [me.sfsector, me.hfsector]
                },
                {
                    columnWidth: 0.25,
                    items: [me.numero]
                },
                {
                    columnWidth: 0.25,
                    margin: '0 5 0 0',
                    items: [me.fechafirma]
                },
                {
                    columnWidth: 0.25,
                    items: [me.vigencia]
                }, {
                    columnWidth: 0.25,
                    margin: '18 5 0 0',
                    items: [me.unidadTiempo]
                },
                {
                    columnWidth: 0.25,
                    items: [me.fechaFin]
                },
                {
                    items: [me.hfarea, me.cmbarea]
                },
                {
                    items: [me.hfresponsable, me.cmbreponsable]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    columnWidth: 1,
                    defaults: {
                        flex:1
                    },
                    items: [
                        me.objeto,
                        me.descripcion
                    ]
                }
            ]
        });

        me.docForm = Ext.create('GestionContrato.view.DocumentosAdicionales', {
            hidden: !me.gestordocumental
        });

        me.mainTabpanel = Ext.create('Ext.tab.Panel', {
            border: false,
            items: [me.customForm, me.formaPago, me.docForm]
        });

        me.items = [me.mainTabpanel];
    },
    setOriginalValue: function(store){
        var temp=[];
        Ext.each(store.getRange(), function (record) {
            //se marcan como dirty para adcionarselos al suplemento del contrato
            if (this.getWinEditOferta().addsuplemento) {
                record.dirty = true;
            }
            temp.push(record.data);
        }, this);
        store.originalValue = Ext.encode(temp);
    },
    checkChangeStore: function(store){
        var temp=[];
        Ext.each(store.getRange(), function (record) {
            temp.push(record.data);
        }, this);
        var actualValue = Ext.encode(temp);
        if (this.originalValue && this.originalValue != actualValue) {
            store.isDirty = true;
        } else {
            store.isDirty = false;
        }
    },
    encodeValue: function(){

    }
});
