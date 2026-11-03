Ext.define('OfertaNegocioImportacion.view.WindowOferta', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.windowofertaimportacion',
    autoScroll: true,
    autoHeight: true,
    width: 900,
    height: 470,
    maximizable: false,
    // resizable: false,
    layout: 'fit',
    context: 'proveedor',
    requires: ['GestionContratoImportacion.view.DocumentosAdicionales'],
    initComponent: function () {
        this.createInitialConfig();
        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;

        this.refhelp = this.action + "_dat_contrato";

        me.etiquetas=LangMgr.getLang(me);

        me.addType=Ext.create('Ext.form.field.Hidden', {
            name: 'action',
            value: me.action
        });

        me.hftipo=Ext.create('Ext.form.field.Hidden', {
            name: 'tipo',
            value: me.tipo
        });

        me.idoferta=Ext.create('Ext.form.field.Hidden', {
            name: 'idoferta'
        });

        me.idofertanegociosolicitud=Ext.create('Ext.form.field.Hidden', {
            name: 'idofertanegociosolicitud'
        });

        me.hfsolicitudnegocio = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowsolicitud',
            name: 'idsolicitud'
        });
        me.sfsolicitudnegocio = Ext.create('Ext.form.field.ComboBox', {
            name: 'solicitud',
            fieldLabel: me.etiquetas.lbSolicitudOferta,
            allowBlank: false,
            valueField:'nombre',
            displayField:'nombre',
            localId: 'idsolicitud',
            queryMode: 'remote',
            queryDelay: 400,
            minChars: 1,
            pageSize: 20,
            listLoadingText: 'Cargando...',
            listEmptyText: 'No existen datos que mostrar.',
            forceSelection: true,
            store: Ext.create('Ext.data.Store',{
                // autoLoad:true,
                proxy:{
                    type: 'ajax',
                    actionMethods: {read: 'POST'},
                    url:UtilsFn.buildUrl({action: 'getSolicitudesNegocio'}, ModuleMgr.get('OfertaNegocioImportacion')),
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
                        'filter[1][data][value]': '[4]',
                        // me.context == 'cliente' ? 1 : 2
                    }
                },
                fields:[
                    'idsolicitud', 'nombre', 'idclienteproveedor', 'idsector', 'sector', 'idarearesponsable',
                    'descripcion', 'arearesponsable', 'idarea', 'area', 'clienteproveedor', 'idproveedores',
                    'linea', 'tipolinea', 'codigolinea'
                ],
            }),
            flex: 1
        });
        // if(me.action=='add')me.sfsolicitudnegocio.getStore().load();

        me.numero = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbNumber,
            name: 'numero',
            allowBlank: false,
            // maxLength: 10,
            readOnly:true,
            // regex: /^[0-9\/\-\.]*$/,
            // maskRe: /^[0-9\/\-\.]$/,
            regexText: me.etiquetas.vNumDomain.replace('<#dominio#>', 'enteros'),
            flex: 1
        });

        me.btnGenerarConsecutivo = Ext.create('Ext.button.Button', {
            iconCls: 'actualizar',
            tooltip: me.etiquetas.lbGenerarConsecutivo,
            action: 'generarnumero',
            hidden: true,
            ui: 'default-toolbar-small',
            margin: '18 2 0 0'
        });

        me.numeroContrato = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbNumberProveedor,
            name: 'numerocontrato',
            allowBlank: false,
            hidden: me.context == "proveedor" ? false : true,
            disabled: me.context == "proveedor" ? false : true,
            margin: '0 0 0 10',
            flex: 1,
            maxLength: 255,
            value: me.context == "proveedor" ? "" : "0"
        });

        me.nombre = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbName,
            name: 'nombre',
            allowBlank: false,
            first: true,
            maxLength: 255,
            flex: 1,
            enableKeyEvents: true
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

        // me.sfsector = Ext.create('Ext.ux.CmbSelectField', {
        //     fieldLabel: me.etiquetas.textNomSector,
        //     // fieldLabel: me.context == "proveedor" ? me.etiquetas.lbOrganismo:me.etiquetas.lbEsquema,
        //     name: 'sector',
        //     mapping: 'NomSector.denominacion',
        //     localId: 'idsector',
        //     module: 'Nomencladores',
        //     allowBlank: false,
        //     gen: 'm',
        //     filters: {},
        //     //disabled: true,
        //     context: 'gestioncontratomainwindowsector',
        //     flex: 1
        // });

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

        // me.fechafirma = Ext.create('Ext.form.field.Date', {
        //     fieldLabel: me.etiquetas.lbFechaFirma,
        //     name: 'fechafirma',
        //     flex: 1
        // });

        me.fechaFin = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.etiquetas.lbFechaFin,
            name: 'fechafin',
            readOnly: true,
            emptyText: ' ',
            hidden: true
        });

        me.fechaInicio = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.etiquetas.lbFechaInicio,
            name: 'fechainicio',
            readOnly: true,
            emptyText: ' ',
            flex:1,
            value: new Date()
            // hidden: true
        });

        me.hfidincoterms = Ext.create('Ext.form.field.Hidden', {
            name: 'idincoterm'
        });

        me.incoterms = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbIncoterms,
            name: 'incoterms',
            mapping: 'NomIncoterm.abreviatura',
            localIdMulti: 'idincoterm',
            multiSelect: true,
            module: 'TipoContrato',
            noactions: true,
            allowBlank: false,
            first: true,
            maxLength: 255,
            flex: 1,
            enableKeyEvents:true,
            queryParams: 'abreviatura',
            // valueToolTip: 'abreviatura',
            mensajeTooltip: '{abreviatura} - {nombre}',
            // listConfig: {
            //     getInnerTpl: function() {
            //         return '<div data-qtip="{abreviatura} - {nombre}">{nombre}</div>';
            //     }
            // }
        });

        // me.incoterms = Ext.create('Ext.form.field.ComboBox', {
        //     name: 'incoterms',
        //     fieldLabel: me.etiquetas.lbIncoterms,
        //     valueField: 'nombre',
        //     displayField: 'nombre',
        //     queryMode: 'local',
        //     queryDelay: 400,
        //     minChars: 1,
        //     pageSize: 20,
        //     listLoadingText: 'Cargando...',
        //     listEmptyText: 'No existen datos que mostrar.',
        //     flex:1,
        //     store: Ext.create('Ext.data.Store',{
        //         fields:['nombre'],
        //         data:[{'nombre': 'FOB'}]
        //     })
        // });

        me.storeCondicionPago =  Ext.create('Ext.data.Store', {
            pageSize: 10,
            fields: [
                {name: 'idcondicionpago', mapping: 'idterminodepago'},
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
        });

        // me.hfCondicionPago = Ext.create('Ext.form.field.Hidden', {
        //     name: 'idcondiciondepago'
        // });
        //
        // me.condicionDePago = Ext.create('Ext.form.field.ComboBox', {
        //     fieldLabel: me.etiquetas.lbCondicionPago,
        //     autoExpand: false,
        //     flex:1,
        //     store: me.storeCondicionPago,
        //     valueField: 'nombre',
        //     displayField: 'nombre',
        //     name: 'condiciondepago',
        //     columnWidth: 0.33,
        //     minChars: 0,
        //     pageSize: 10,
        //     mode: 'remote',
        //     queryParam: 'denominacion',
        //     localId: 'idcondiciondepago',
        //
        // });

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

        // me.unidadTiempo = Ext.create('Ext.form.ComboBox', {
        Ext.define('UnidadTiempo', {
            extend:'Ext.form.ComboBox',
            fieldLabel: '',
            hideLabel: true,
            store: me.storeUnidadTiempo,
            value:1,
            queryMode: 'local',
            valueField: 'idunidadtiempo',
            displayField: 'denominacion',
            flex: 1,
            // name: 'unidadtiempo',
            editable: false,
            allowBlank: false,
            margin: '18 0 0 5'
        });

        me.unidadTiempo = Ext.create('UnidadTiempo',{
            name: 'unidadtiempo'
        });

        me.unidadTiempoGarantia = Ext.create('UnidadTiempo',{
            name: 'garantiatiempo'
        });

        me.unidadTiempoEntrega = Ext.create('UnidadTiempo',{
            name: 'entregatiempo'
        });

        me.vigencia = Ext.create('Ext.form.field.Number', {
            fieldLabel: me.etiquetas.lbValidez,
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

        me.garantia = Ext.create('Ext.form.field.Number', {
            fieldLabel: me.etiquetas.lbPeriodoGarantia,
            name: 'garantia',
            flex: 1,
            // allowBlank: false,
            maxValue: 999,
            minValue: 1,
            allowDecimals: false,
            allowExponential: false,
            nanText: me.etiquetas.msgErrorValorVigencia,
            maxText: me.etiquetas.msgErrorValorVigencia,
            minText: me.etiquetas.msgErrorValorVigencia
        });

        me.tiempoEntrega = Ext.create('Ext.form.field.Number', {
            fieldLabel: me.etiquetas.lbTiempoEntrega,
            name: 'entrega',
            flex: 1,
            // allowBlank: false,
            maxValue: 999,
            minValue: 1,
            allowDecimals: false,
            allowExponential: false,
            nanText: me.etiquetas.msgErrorValorVigencia,
            maxText: me.etiquetas.msgErrorValorVigencia,
            minText: me.etiquetas.msgErrorValorVigencia
        });

        me.hftiempoentrega = Ext.create('Ext.form.field.Hidden', {
            name: 'idtiempoentrega'
        });

        me.sftiempoentrega = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbTiempoEntrega,
            name: 'tiempoentrega',
            mapping: 'NomTiempoEntrega.denominacion',
            localId: 'idtiempoentrega',
            module: 'Nomencladores',
            // noactions: true,
            allowBlank: false,
            first: true,
            maxLength: 255,
            flex: 1,
            enableKeyEvents:true
        });

        me.hforigen = Ext.create('Ext.form.field.Hidden', {
            name: 'idpuertoorigen'
        });

        me.origen = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbPuertoOrigen,
            name: 'puertoorigen',
            mapping: 'NomPuertoOrigen.denominacion',
            localIdMulti: 'idpuertoorigen',
            multiSelect: true,
            module: 'Nomencladores',
            // noactions: true,
            allowBlank: false,
            first: true,
            maxLength: 255,
            flex: 1,
            enableKeyEvents:true
        });

        me.hfpuertoEmbarque = Ext.create('Ext.form.field.Hidden', {
            name: 'idpuertodestino'
        });

        me.puertoEmbarque = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbPuertoEmbarque,
            name: 'puertodestino',
            mapping: 'NomPuertoDestino.denominacion',
            localIdMulti: 'idpuertodestino',
            multiSelect: true,
            module: 'Nomencladores',
            // noactions: true,
            allowBlank: false,
            first: true,
            maxLength: 255,
            flex: 1,
            enableKeyEvents:true
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
                url: UtilsFn.buildUrl({action: 'getListadoPersonas'}, ModuleMgr.get('GestionContratoImportacion')),
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

        me.cmbarea = Ext.create('GestionContratoImportacion.view.CmbArea', {
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

        me.linea = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbLinea,
            readOnly:true,
            // name: 'linea',
            flex: 1
        });

        me.tipolinea = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbTipoLinea,
            readOnly:true,
            // name: 'tipolinea',
            maxLength:10,
            flex: 1
        });

        me.hfembalaje = Ext.create('Ext.form.field.Hidden', {
            name: 'idembalaje'
        });

        me.embalaje = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbEmbalaje,
            name: 'embalaje',
            mapping: 'NomEmbalaje.denominacion',
            localId: 'idembalaje',
            module: 'Nomencladores',
            // noactions: true,
            allowBlank: false,
            first: true,
            maxLength: 255,
            flex: 1,
            enableKeyEvents:true
        });

        me.hfmediotransporte = Ext.create('Ext.form.field.Hidden', {
            name: 'idmediotransporte'
        });

        me.mediotransporte = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.textNomMedioTransporte,
            name: 'mediotransporte',
            mapping: 'NomMedioTransporte.denominacion',
            localId: 'idmediotransporte',
            module: 'Nomencladores',
            // noactions: true,
            allowBlank: false,
            first: true,
            maxLength: 255,
            flex: 1,
            enableKeyEvents:true
        });

        me.codigolinea = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbCodigolinea,
            hidden:true,
        });

        me.validezMontos = Ext.create('Ext.form.field.Text', {
            allowBlank: false, value: 'valido', hidden: true
        });

        me.formaPago1 = Ext.create('GestionContratoImportacion.view.FormaPago.FormaPago', {
            _this:me._this,
            columnWidth: 1, context:me.context,
            hidden: me.tipocontrato == 'contratoMarco',
            dataMedioPago: me.dataMedioPago,
            valueCheckHitoPago: me.valueCheckHitoPago,
            extrafields: me.extrafields,
            planificacion: me.planificacion,
            hitoStoreId: 'hitoStoreOfertaImportacion',
            indicadorStoreId: 'indicadorStoreOfertaImportacion',
            ocultarHitoPago: true,
            confAdicionalGridProductos:{
                visibleColumns: ['numero', 'codigo', 'denominacion', 'cantidad',
                    'precio', 'total', 'importe', 'monedas'],
                buttonImp: true,
                editGrid: true,
                buttonServ: false,
                buttonTasaCambio: true,
                monedasentidad: me.extrafields
            }
            // soloMonedas:true
        });

        me.formaPago1.topForm.query().forEach(function(x){
            // console.log(x, x.itemId, x.name)
            if(x.itemId && x.itemId.indexOf('montomoneda_')==0){
                x.setReadOnly(true);
            }
        });

        me.formaPago = Ext.create('OfertaNegocioImportacion.view.TabCobros', {
            extrafields: me.extrafields,
            indicadorStoreId: 'indicadorStoreOfertaImportacion',
        });

        me.customForm = Ext.create('Ext.ux.CustomForm', {
            bodyStyle: 'background:#DFE9F6;',
            // columnWidth: 1,
            layout: 'column',
            defaults: {
                bodyStyle: 'background:#DFE9F6;',
                margin: '0 5 0 5',
                columnWidth: 0.25,
                layout: 'hbox',
                border: false
            },
            autoScroll: true,
            title: 'Informaci&oacuten general',
            items: [
                {xtype: 'hidden', name: 'idespaciotrabajo', value: 0},
                me.validezMontos,
                {
                    items: [me.addType, me.hftipo, me.idoferta, me.idofertanegociosolicitud]
                },
                {
                    columnWidth: 0.5,
                    items: [me.sfsolicitudnegocio, me.hfsolicitudnegocio]
                },
                {
                    columnWidth: 0.5,
                    items: me.nombre
                },
                {
                    columnWidth: 0.5,
                    items: [me.sfclienteproveedor, me.hfclienteproveedor]
                },
                // {
                //     items: [me.sfsector, me.hfsector]
                // },
                {
                    columnWidth: 0.25,
                    items: [me.numero, me.btnGenerarConsecutivo]
                },

                // {
                //     items: [me.numero]
                // },
                {
                    margin: '0 5 0 0',
                    items: [me.fechaInicio]
                },
                // {
                //     margin: '0 5 0 0',
                //     items: [me.fechafirma]
                // },
                {
                    items: [me.vigencia, me.unidadTiempo]
                },
                // {
                //     margin: '18 5 0 0',
                //     items: [me.unidadTiempo]
                // },
                {
                    items: [me.garantia, me.unidadTiempoGarantia]
                },
                // {
                //     items: [me.tiempoEntrega, me.unidadTiempoEntrega]
                // },

                {
                    items: [me.linea]
                },
                {
                    items: [me.hfidincoterms, me.incoterms]
                },
                // {
                //     margin: '18 5 0 0',
                //     items: [me.unidadTiempoGarantia]
                // },
                {
                    items: [me.hforigen, me.origen]
                },
                {
                    margin: '0 5 0 0',
                    items: [me.hfpuertoEmbarque, me.puertoEmbarque]
                },

                // {
                //     margin: '0 5 0 0',
                //     items: [me.condicionDePago]
                // },
                // {
                //     items: [me.tiempoEntrega]
                // },
                // {
                //     margin: '18 5 0 0',
                //     items: [me.unidadTiempoEntrega]
                // },
                , {
                    columnWidth: 0.5,
                    items: [me.hfembalaje, me.embalaje]
                },{
                    items: [me.codigolinea]
                },
                {
                    columnWidth: 0.5,
                    items:[me.sftiempoentrega, me.hftiempoentrega]
                },
                {
                    columnWidth: 0.5,
                    items:[me.mediotransporte, me.hfmediotransporte]
                },

                // {
                //     items: [me.fechaFin]
                // },
                // {
                //     items: [me.hfarea, me.cmbarea]
                // },
                // {
                //     items: [me.hfresponsable, me.cmbreponsable]
                // },
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

        me.docForm = Ext.create('GestionContratoImportacion.view.DocumentosAdicionales', {
            hidden: !me.gestordocumental
        });

        me.tabDatosAdicionales=me.createTabDatosAdicionales();

        me.mainTabpanel = Ext.create('Ext.tab.Panel', {
            border: false,
            items: [me.customForm, me.formaPago, me.docForm, me.tabDatosAdicionales]
        });

        me.items = [me.mainTabpanel];
    },
    createTabDatosAdicionales: function(){
        var me=this;
        return {
            xtype: 'panel',
            bodyStyle: 'background:#DFE9F6;',
            title: 'Datos adicionales',
            items:[
                {
                    xtype: 'form',
                    itemId: 'formdatosadicionales',
                    bodyStyle: 'background:#DFE9F6;',
                    layout: {type: 'hbox', align: 'bottom'},
                    fieldDefaults:{
                        margin: '2 4 10 4'
                    },
                    margin: '4 4 0 4',
                    listeners:{
                        validitychange: function(yo, valid){
                            console.log('dirtychange', yo.findField('idtipocontenedor').getValue(), yo.findField('cantidad').getValue());
                            // var valid=yo.findField('idtipocontenedor').getValue()!='' && yo.findField('cantidad').getValue()!=null;
                            console.log(valid)
                            me.down('#adicionartipocontenedor').setDisabled(!valid);
                        }
                    },
                    items:[
                        Ext.create('Ext.form.field.Hidden', {
                            name: 'idtipocontenedor'
                        }),
                        Ext.create('Ext.ux.CmbSelectField', {
                            fieldLabel: me.etiquetas.lbTipoContenedor,
                            labelAlign: 'top',
                            name: 'tipocontenedor',
                            mapping: 'NomTipoContenedor.denominacion',
                            localId: 'idtipocontenedor',
                            module: 'Nomencladores',
                            // noactions: true,
                            maxLength: 255,
                            flex: 1,
                            enableKeyEvents:true,
                            allowBlank: false
                        }),
                        {
                            xtype: 'numberfield',
                            fieldLabel: 'Cantidad',
                            labelAlign: 'top',
                            name: 'cantidad',
                            width: 80,
                            minValue: 0,
                            allowDecimals: false,
                            allowBlank: false
                        },
                        {
                            xtype: 'button',
                            text: 'Adicionar',
                            tooltip: 'Adicionar tipo de contenedor',
                            itemId: 'adicionartipocontenedor',
                            iconCls: 'adicionar',
                            disabled: true,
                            margin: '0 2 2 0',
                            handler: function(){
                                var values=me.down('#formdatosadicionales').getForm().getValues();
                                if(me.down('#gridtiposcontenedores').getStore().findExact('idtipocontenedor', values['idtipocontenedor'])==-1){
                                    me.down('#gridtiposcontenedores').getStore().add(values);
                                    me.down('#formdatosadicionales').getForm().reset();
                                }else{
                                    mostrarMensaje(8, 'Ya se encuentra adicionado el tipo de contenedor seleccionado.')
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Eliminar',
                            tooltip: 'Eliminar tipo de contenedor',
                            itemId: 'eliminartipocontenedor',
                            iconCls: 'eliminar',
                            disabled: true,
                            margin: '0 2 2 0',
                            handler: function(){
                                me.down('#gridtiposcontenedores').getStore().remove(me.down('#gridtiposcontenedores').getSelectionModel().getSelection())
                            }
                        }
                    ]
                },
                {
                    xtype: 'grid',
                    title: 'Contenedores',
                    itemId: 'gridtiposcontenedores',
                    margin: '5 4 0 4',
                    height: 310,
                    columns: [
                        {
                            text: 'Tipo de contenedor', flex: 1, dataIndex: 'tipocontenedor',
                            renderer: function(value, meta) {
                                if (value)
                                    meta.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: 'Cantidad', width: 80, dataIndex: 'cantidad', align: 'right'
                        }
                    ],
                    store: Ext.create('Ext.data.Store',{
                        fields: ['idofertacontenedor', 'tipocontenedor', 'idtipocontenedor', 'cantidad'],
                        data: []
                    }),
                    selModel: Ext.create('Ext.selection.CheckboxModel', {
                        listeners:{
                            selectionchange:function(sm, records){
                                me.down('#eliminartipocontenedor').setDisabled(records.length==0);
                            }
                        }
                    })
                }

            ]
        };
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
