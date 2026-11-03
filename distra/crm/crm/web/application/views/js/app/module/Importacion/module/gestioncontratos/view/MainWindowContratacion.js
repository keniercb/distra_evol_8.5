Ext.define('GestionContratoImportacion.view.MainWindowContratacion', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.co_mainwindowContratacionimportacion',
    autoScroll: true,
    autoHeight: true,
    width: 1000,
    height: 450,
    resizable: false,
    maximizable: false,
    layout: 'fit',
    tipo: 'checkbox',
    modulopersona: true,
    requires: ['GestionContratoImportacion.view.DocumentosAdicionales'],
    // onEsc: function(){
    //     var me = this;
    //     sessionStorage.removeItem('tipo');
    //     me.hide(true);
    // },
    // close:function(){
    //     var me = this;
    //     sessionStorage.removeItem('tipo');
    //     me.hide(true);
    //
    // },
    initComponent: function () {
        //this.height = Ext.getBody().dom.offsetHeight - 40;
        this.createInitialConfig();
        this.callParent();

    },
    createInitialConfig: function () {
        var me = this;
        var arrayContextos = ['proveedor', 'cliente', 'importacion'];
        console.log('me.tipocontrato:', me.tipocontrato);

        this.refhelp = this.action + "_dat_contrato";

        me.hfofertanegocio = Ext.create('Ext.form.field.Hidden', {
            name: 'idoferta'
        });

        me.sfofertanegocio = Ext.create('Ext.form.field.ComboBox', {
            name: 'nombreoferta',
            fieldLabel: me.etiquetas.lbOferta,
            valueField: 'nombre',
            displayField: 'nombre',
            localId: 'idoferta',
            queryMode: 'remote',
            queryDelay: 400,
            minChars: 1,
            pageSize: 20,
            listLoadingText: 'Cargando...',
            listEmptyText: 'No existen datos que mostrar.',
            hidden: me.tipocontrato == 'contratoMarco',
            // forceSelection: true,
            store: Ext.create('Ext.data.Store', {
                // autoLoad:true,
                proxy: {
                    type: 'ajax',
                    actionMethods: {read: 'POST'},
                    url: UtilsFn.buildUrl({action: 'getOfertasNegocio'}, ModuleMgr.get('OfertaNegocioImportacion')),
                    reader: {
                        idProperty: 'idsolicitud',
                        type: 'json',
                        root: 'datos',
                        totalProperty: 'cantidad'
                    },
                    extraParams: {  //me.idestadosolicitud
                        'filter[0][field]': 'estado',
                        'filter[0][data][type]': 'list',
                        'filter[0][data][value]': '[' + me.idestadoofertalisto + ']',
                        'filter[1][field]': 'cliente',
                        'filter[1][data][type]': 'list',
                        'filter[1][data][value]': '[' + arrayContextos.indexOf(me.context) + ']',
                        // me.context == 'cliente' ? 1 : 2
                    }
                },
                fields: [
                    'idoferta', 'nombre', 'idclienteproveedor', 'idsector', 'sector',
                    'idarearesponsable', 'descripcion', 'arearesponsable', 'idarea',
                    'area', 'clienteproveedor', 'idproveedores', 'linea', 'tipolinea',
                    'idlinea', 'idtipolinea', 'codigolinea', 'idincoterms', 'incoterms',
                    'idpersona', 'nombrearea', 'arearesponsable', 'nombreresponsable',
                    'nombrepersona', 'area', 'responsable', 'mediopago', 'idcondicionpago',
                    'condicionpago', 'objeto', 'idmediopago', 'idpuertoorigen',
                    'idpuertodestino', 'puertoorigen', 'puertodestino',
                ],
            }),
            flex: 1
        });

        me.numero = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbNumber,
            name: 'numero',
            allowBlank: false,
            readOnly: !me.numero_manual,
            flex: 1
        });

        me.numeroContrato = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbNumberProveedor,
            name: 'numerocontrato',
            allowBlank: true,
            hidden: me.context == "cliente" ? true : false,
            disabled: me.context == "cliente" ? true : false,
            margin: '0 0 0 5',
            flex: 1,
            maxLength: 255,
            value: me.context == "cliente" ? "0" : ""
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
            // forceSelection: true,
            flex: 1
        });

        me.hfcontratomarco = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowcontratomarco',
            name: 'idcontratomarco'
        });

        me.hfarea = Ext.create('Ext.form.field.Hidden', {
            name: 'idarea'
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
            flex: 1,
            margin: '0 5 0 0'
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
            fieldLabel: me.context == 'cliente' ? me.etiquetas.lbCliente : me.etiquetas.lbProveedor,
            name: 'clienteproveedor',
            mapping: 'NomClienteproveedor.nombre',
            localId: 'idclientesproveedor',
            module: 'TipoContrato',
            noactions: true,
            allowBlank: false,
            context: 'gestioncontratomainwindowclienteproveedor',
            filters: {
                idtipo: me.context == 'cliente' ? 1 : 2,
                idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun
            },
            controller: 'gestioncontratomainwindow',
            flex: 1,
            disabled: me.context == 'importacion',
            // forceSelection: true,
            onMore: this.onMore
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
            // forceSelection: true,
            flex: 1
        });

        me.objeto = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: me.etiquetas.lbObjeto,
            //enableVar: false,
            allowBlank: true,
            height: 150,
            margin: '0 10 0 0',
            //enableSourceEdit: false,
            name: 'objeto',
            flex: 1
        });

        me.descripcion = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: me.etiquetas.lbDescripcion,
            name: 'descripcion',
            //enableVar: false,
            allowBlank: true,
            //enableSourceEdit: false,
            height: 150,
            flex: 1
        });

        me.fechafirma = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.etiquetas.lbFechaFirma,
            name: 'fechafirma',
            flex: 1,
            maxValue: new Date(),
            // validator:function(value){
            //     if(me.formaPago.hitopago.getStore().getCount()>0){
            //         var hstore=me.formaPago.hitopago.getStore(),
            //             min=new Date(5000, 12, 30);
            //             // min=hstore.getAt(0).get('fechafin');
            //         // console.log('min',min)
            //         hstore.getRange(1, hstore.getCount()-1).forEach(function(x){
            //             // console.log('x:', x.get('descripcion'),x.get('fechafin'))
            //             if(x.get('fechafin')!=null)
            //                 if(min>x.get('fechafin')){
            //                     // console.info('entroo')
            //                     min=x.get('fechafin')
            //                 };
            //         });
            //         // console.log('min',min)
            //         // console.log('value',value)
            //         var minParts=min.split('/'),
            //             valueParts=value.split('/'),
            //             minDate=new Date(minParts[2], minParts[1], minParts[0]),
            //             valueDate=new Date(valueParts[2], valueParts[1], valueParts[0]);
            //         if(valueDate>minDate)
            //             return me.etiquetas.msgFechaFirmaMayorFechaestimada + ' ('+min+')';
            //     }
            //     return true;
            // }
        });

        me.fechaFin = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.etiquetas.lbFechaFin,
            name: 'fechafin',
            flex: 1,
            // editable:false,
            readOnly: true,
            emptyText: ' ',
            // hidden: true
            validator: function (value) {
                // console.log('value:', value)
                // console.log('me.fechaFin.getValue():', new Date(value))
                // console.log('me.fechafirma.getValue():', me.fechafirma.getValue())
                if (me.fechaFin.getValue())
                    if (me.fechaFin.getValue() < me.fechafirma.getValue())
                        return 'La fecha de fin no puede ser menor que la fecha de firma.'
                return true;
            }
        });

        me.formaPago = Ext.create('GestionContratoImportacion.view.FormaPago.FormaPago', {
            _this: me._this,
            columnWidth: 1, context: me.context,
            tipocontrato: me.tipocontrato,
            context: me.context,
            dataMedioPago: me.dataMedioPago,
            valueCheckHitoPago: me.valueCheckHitoPago,
            extrafields: me.extrafields,
            planificacion: me.planificacion,
            addsuplemento: me.addsuplemento,
            suplemento: me.suplemento,
            hidden: me.show_by_resource && !me.acciones['tabCobrosPagos'],
            mostrar_montototal: me.mostrar_montototal
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
                {"idunidadtiempo": 2, "denominacion": me.etiquetas.lbUTMonth},
                {"idunidadtiempo": 3, "denominacion": me.etiquetas.lbUTYear}
            ]
        });

        me.unidadTiempo = Ext.create('Ext.form.ComboBox', {
            fieldLabel: '',
            hideLabel: true,
            store: me.storeUnidadTiempo,
            queryMode: 'local',
            valueField: 'idunidadtiempo',
            displayField: 'denominacion',
            flex: 1,
            name: 'unidadtiempo',
            editable: false,
            autoExpand: false,
            allowBlank: false
        });

        me.vigencia = Ext.create('Ext.form.field.Number', {
            fieldLabel: me.etiquetas.lbVigencia,
            name: 'vigencia',
            flex: 1,
            margin: '0 5 0 0',
            allowBlank: false,
            maxValue: 999,
            minValue: 1,
            allowDecimals: false,
            allowExponential: false,
            nanText: me.etiquetas.msgErrorValorVigencia,
            maxText: me.etiquetas.msgErrorValorVigencia,
            minText: me.etiquetas.msgErrorValorVigencia
        });

        me.cumplimiento = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: me.etiquetas.lbCumplimiento,
            name: 'cumplimientoobligaciones',
            inputValue: 1,
            uncheckedValue: 0,
        })

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

        me.cmbreponsable = Ext.create('Ext.form.field.' + (me.modulopersona ? 'ComboBox' : 'Text'), {
            fieldLabel: me.etiquetas.lbResponsableContrato,
            name: 'nombrepersona',
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
            allowBlank: false,
            maxLength: 255,
            // forceSelection: true,
        });

        me.cmbarea = Ext.create('GestionContratoImportacion.view.CmbArea', {
            localId: 'idarea',
            name: 'nombrearea',
            fieldLabel: me.etiquetas.lbArea,
            flex: 1,
            allowBlank: false,
            editable: false,
        });

        me.stcategoria = Ext.create('Ext.data.Store', {
            pageSize: 10,
            fields: [
                {name: 'idcategoria'},
                {name: 'denominacion'}
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getCategorias'}, ModuleMgr.get('GestionContratoImportacion')),
                reader: {
                    idProperty: 'idcategoria',
                    type: 'json',
                    root: 'data',
                    totalProperty: 'count'
                }
            }
        });

        me.hfcategoria = Ext.create('Ext.form.field.Hidden', {
            name: 'idcategoria'
        });

        me.cmbcategoria = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbCategoria,
            name: 'categoria',
            mode: 'remote',
            minChars: 0,
            // pageSize: 10,
            flex: 1,
            autoExpand: false,
            store: me.stcategoria,
            valueField: 'denominacion',
            displayField: 'denominacion',
            queryParam: 'denominacion',
            localId: 'idcategoria',
            allowBlank: me.tipocontrato == 'contrato',
            // margin:'0 5 0 0',
            hidden: me.tipocontrato == 'contrato'
        });

        // me.fechafinvigencia = Ext.create('Ext.form.field.Date', {
        //     fieldLabel: me.etiquetas.lbFechaFirma,
        //     name: 'fechafirma',
        //     flex: 1,
        //     validator:function(value){
        //         if(me.formaPago.hitopago.getStore().getCount()>0){
        //             var hstore=me.formaPago.hitopago.getStore(),
        //                 min=hstore.getAt(0).get('fechafin');
        //             console.log('min',min)
        //             hstore.getRange(1, hstore.getCount()-1).forEach(function(x){
        //                 console.log('x:', x.get('descripcion'),x.get('fechafin'))
        //                 if(min>x.get('fechafin')){
        //                     console.info('entroo')
        //                     min=x.get('fechafin')
        //                 };
        //             });
        //             console.log('min',min)
        //             console.log('value',value)
        //             if(value>min)
        //                 return me.etiquetas.msgFechaFirmaMayorFechaestimada + ' ('+min+')';
        //         }
        //         return true;
        //     }
        // });

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

         me.formAreasImplicadas = Ext.create('GestionContratoImportacion.view.AreasPermitidas', {
            hidden: me.show_by_resource && !me.acciones['tabAreasImplicadas'],
            // disabled: true,
            title: 'Áreas permitidas'
        });

        // me.formAreasConPermiso = Ext.create('GestionContratoImportacion.view.GpAreaConPermiso', {
        //     title: 'Áreas con permiso a ver contrato'
        // });

        // me.formAreasConPermiso.store.on("add", function (store, records, index, eOpts) {
        //         if (records[0].data.idestructura == me.hfarea.getValue()) {
        //             console.log('records[0].data', records[0].data)
        //             mostrarMensaje(6, me.etiquetas.msgErrorAreaConPermisoEqualResponsable + ': ' + records[0].data.area);
        //             store.remove(records);
        //         }
        //     }
        // );

        me.formProforma = Ext.create('Ext.ux.CustomForm', {
            title: 'Proforma',
            autoScroll: true,
            hidden: me.show_by_resource && !me.acciones['tabProformas'],
            items: [{
                columnWidth: 1,
                layout: 'hbox',
                items: [me.hfproforma, me.sfproforma]
            }, me.formDynamic]
        });

        me.objetosuplemento = Ext.create('Ext.form.field.TextArea', {
            name: 'objetosuplemento',
            // maxLength: 500,
            allowBlank: !me.suplemento,
        });

        me.hforigen = Ext.create('Ext.form.field.Hidden', {
            name: 'idpuertoorigen'
        });

        me.origen = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbPuertoOrigen,
            name: 'puertoorigen',
            mapping: 'NomPuertoOrigen.denominacion',
            localId: 'idpuertoorigen',
            module: 'Nomencladores',
            // noactions: true,
            allowBlank: false,
            first: true,
            maxLength: 255,
            flex: 1,
            hidden: me.context != 'importacion',
            disabled: me.context != 'importacion',
            forceSelection: true,
            enableKeyEvents: true
        });

        me.hfpuertoEmbarque = Ext.create('Ext.form.field.Hidden', {
            name: 'idpuertodestino'
        });

        me.puertoEmbarque = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbPuertoEmbarque,
            name: 'puertodestino',
            mapping: 'NomPuertoDestino.denominacion',
            localId: 'idpuertodestino',
            module: 'Nomencladores',
            // noactions: true,
            allowBlank: false,
            first: true,
            maxLength: 255,
            flex: 1,
            hidden: me.context != 'importacion',
            disabled: me.context != 'importacion',
            forceSelection: true,
            enableKeyEvents: true
        });

        me.hfidincoterms = Ext.create('Ext.form.field.Hidden', {
            name: 'idincoterms'
        });

        me.incoterms = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbIncoterms,
            name: 'incoterm',
            mapping: 'NomIncoterm.nombre',
            localId: 'idincoterms',
            module: 'TipoContrato',
            noactions: true,
            allowBlank: false,
            first: true,
            maxLength: 255,
            flex: 1,
            enableKeyEvents: true,
            queryParams: 'abreviatura',
            // valueToolTip: 'abreviatura',
            mensajeTooltip: '{abreviatura} - {nombre}',
            hidden: me.context != 'importacion',
            disabled: me.context != 'importacion',
            forceSelection: true,
            // listConfig: {
            //     getInnerTpl: function() {
            //         return '<div data-qtip="{abreviatura} - {nombre}">{nombre}</div>';
            //     }
            // }
        });

        me.hflinea = Ext.create('Ext.form.field.Hidden', {
            name: 'idlinea'
        });

        me.sflinea = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbLinea,
            name: 'linea',
            allowBlank: false,
            flex: 1,
            localId: 'idlinea',
            columnWidth: 0.50,
            // valueField:'idindicador',
            valueField: 'denominacion',
            displayField: 'denominacion',
            queryParam: 'linea',
            forceSelection: true,
            emptyText: (me.tipo == 4) ? 'Seleccione la demanda...' : 'Seleccione...',
            listConfig: {
                loadingText: me.etiquetas.lbCargando,
                emptyText: '<div class="x-grid-empty">' + me.etiquetas.listEmptyText + '</div>'
            },
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '<div class="x-boundlist-item" data-qtip="{codigo} - {denominacion}">' +
                '{denominacion}' +
                '</div>',
                '</tpl>'
            ),
            hidden: me.context != 'importacion',
            disabled: me.context != 'importacion',
            store: Ext.create('SolicitudNegocioImportacion.store.Linea'),
            listeners: {
                select: function (yo, records) {
                    // console.log('records', records)
                    me.sftipolinea.setDisabled(!yo.getValue());
                    me.sfclienteproveedor.setDisabled(!yo.getValue());
                    if (yo.getValue()) {
                        me.sfclienteproveedor.filters = {
                            idtipo: me.context == 'cliente' ? 1 : 2,
                            idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun,
                            idlinea: records[0].get('idindicador')
                        };
                        me.sfclienteproveedor.getStore().load();
                        // me.sfclienteproveedor.getStore().proxy.extraParams.idlinea = records[0].get('idindicador');
                        // esto es para cargar luego los productos
                        me.sftipolinea.getStore().proxy.extraParams.idlinea = records[0].get('idindicador');
                        me.filtros = {
                            'idnaturaleza': me.idnaturaleza,
                            'node': records[0].get('idindicador')
                        }
                    } else {
                        me.sftipolinea.getStore().proxy.extraParams.idlinea = null;
                        me.filtros = {'idnaturaleza': me.idnaturaleza,}
                    }
                    me.sftipolinea.setValue('');
                    me.sftipolinea.getStore().load();
                },
                change: function (yo) {
                    var pos = yo.store.findExact('denominacion', yo.getValue());
                    // var record = yo.findRecordByValue(yo.getValue());
                    // console.log('change:', pos, yo.getValue())
                    me.sftipolinea.setDisabled(pos == -1);
                    me.sfclienteproveedor.setDisabled(pos == -1);
                    if (pos != -1) {
                    } else {
                        me.sfclienteproveedor.filters = {
                            idtipo: me.context == 'cliente' ? 1 : 2,
                            idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun,
                        };
                        me.sfclienteproveedor.getStore().removeAll();
                        me.sftipolinea.getStore().proxy.extraParams.idlinea = null;
                        me.filtros = {'idnaturaleza': me.idnaturaleza,}
                        me.sftipolinea.getStore().load();

                    }
                }
            }
            // margin: '0 0 10 0',
        });

        me.hftipolinea = Ext.create('Ext.form.field.Hidden', {
            name: 'idtipolinea'
        });

        me.sftipolinea = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbTipoLinea,
            name: 'tipolinea',
            valueField: 'tipolinea',
            displayField: 'tipolinea',
            queryParam: 'tipolinea',
            localId: 'idtipolinea',
            // allowBlank: me.tipo!=3,
            flex: 1,
            // allowBlank: me.tipo==1 || me.tipo==2,
            emptyText: (me.tipo == 4) ? 'Seleccione la demanda...' : 'Seleccione...',
            columnWidth: 0.50,
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'idlinea'},
                    {name: 'idtipolinea'},
                    {name: 'linea'},
                    {name: 'tipolinea'},
                    {name: 'idnaturaleza'},
                    {name: 'denominacion'},
                    {name: 'idindicador'}
                ],
                storeId: 'TipoLinea',
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'obtenerTiposLineas'}, ModuleMgr.get('SolicitudNegocioImportacion')),
                    // url: UtilsFn.buildUrl({action: (me.tipo==4)?'getLineasClientes':'obtenerTiposLineas'}, ModuleMgr.get('SolicitudNegocioImportacion')),
                    actionMethods: {read: 'POST'},
                    reader: {
                        root: 'datos',
                        totalProperty: 'cantidad',
                        successProperty: 'success'
                    }
                }
            }),
            listConfig: {
                loadingText: me.etiquetas.lbCargando,
                emptyText: '<div class="x-grid-empty">' + me.etiquetas.listEmptyText + '</div>'
            },
            hidden: me.context != 'importacion',
            disabled: true,
            listeners: {
                change: function () {
                    //  si no esta esto al dar click al campo se desplega la lista
                }
            }
            // margin: '0 0 10 5',
        });

        me.validezMontos = Ext.create('Ext.form.field.Text', {
            allowBlank: false, value: 'valido', hidden: true
        })
        me.customForm = Ext.create('Ext.ux.CustomForm', {
            bodyStyle: 'background:#DFE9F6;',
            // columnWidth: 1,
            layout: 'column',
            // padding:'0 0 0 5',
            bodyStyle: {
                padding: '0px 0px 0px 5px',
                background: '#DFE9F6'
            },
            defaults: {
                bodyStyle: 'background:#DFE9F6;',
                margin: '0 5 0 0',
                columnWidth: 0.5,
                layout: 'hbox',
                border: false
            },
            autoScroll: true,
            title: 'Informaci&oacuten general',
            items: [
                me.validezMontos,
                {
                    items: [me.sfofertanegocio, me.hfofertanegocio]
                },
                {
                    items: me.nombre
                },
                {
                    items: [me.numero, me.numeroContrato]
                }, ,
                // {
                //     items: [me.sflinea, me.hflinea, me.sftipolinea, me.hftipolinea]
                // },
                // {
                //     items: [me.sftipolinea, me.hftipolinea]
                // },
                {
                    items: [me.sfclienteproveedor, me.hfclienteproveedor]
                },
                {
                    // hidden: me.tipocontrato == 'contrato',
                    items: [me.cmbcategoria, me.hfcategoria]
                },
                {
                    items: me.tipocontrato == 'contratoMarco' ? [me.sftipocontrato, me.hftipocontrato] :
                        [me.sfcontratomarco, me.hfcontratomarco, me.sftipocontrato, me.hftipocontrato]
                },
                // {
                //     items: [me.sftipocontrato, me.hftipocontrato]
                // },
                {
                    items: [me.sfsector, me.hfsector]
                },
                // {
                //     columnWidth: 0.25,
                //     items:[me.origen, me.hforigen]
                // },
                // {
                //     columnWidth: 0.25,
                //     items:[me.puertoEmbarque, me.hfpuertoEmbarque]
                // },
                // {
                //     items:[me.incoterms, me.hfidincoterms]
                // },
                {
                    columnWidth: 0.25,
                    items: [me.fechafirma]
                },
                {
                    columnWidth: 0.25,
                    items: [me.fechaFin]
                }, {
                    columnWidth: 0.14,
                    items: [me.vigencia]
                }, {
                    columnWidth: 0.12,
                    margin: '18 5 0 0',
                    items: [me.unidadTiempo]
                },
                {
                    columnWidth: 0.24,
                    margin: '18 5 0 0',
                    items: [me.cumplimiento]
                },
                // {
                //     // hidden:true,
                //     columnWidth: 0.25,
                //     items: [me.fechaFin]
                // },
                {
                    items: [me.hfarea, me.cmbarea]
                }, {
                    items: [me.hfresponsable, me.cmbreponsable]
                },
                {
                    xtype: 'container',
                    //     labelAlign: 'top',
                    //     bodyStyle: 'background:#DFE9F6;',
                    //     layout: 'column',
                    layout: 'hbox',
                    columnWidth: 1,
                    //     border: false,
                    //     flex: 1,
                    defaults: {
                        flex: 1,
                        //         bodyStyle: 'background:#DFE9F6;',
                        //         columnWidth: 0.5,
                        //         layout: 'hbox',
                        //         border: false
                    },
                    items: [
                        me.objeto,
                        me.descripcion
                    ]
                },
                // {items:me.descripcion}
            ]
        });

        if(me.show_by_resource && !me.acciones['tabPrincipal']){
            me.customForm.query().forEach(function(x){
                if(Ext.isFunction(x.setReadOnly))
                    x.setReadOnly(true);
            })
        }

        me.docForm = Ext.create('GestionContratoImportacion.view.DocumentosAdicionales', {
            hidden: me.show_by_resource && (!me.gestordocumental || !me.acciones['tabDocs']),
            // documentosFijos: true,
            nombresDocumentosFijos: 'Contrato original',
        });

        me.tabVehiculos = Ext.create('GestionContratoImportacion.view.GridVehiculos', {
            title: me.etiquetas.lbVehiculos,
            hidden: !me.acciones['tabVehiculos'],
            // hidden: !me.gestordocumental
        });
        me.tabClientesAsociados = Ext.create('GestionContratoImportacion.view.GridClientesAsociados', {
            title: me.context == 'cliente' ? me.etiquetas.lbClientesAsociados : me.etiquetas.lbProveedoresAsociados,
            hidden: !me.acciones['tabClientesAsociados'],
            context: me.context,
            // idsAdicionados: [],
        });
        // recursos:
        // tabPrincipal
        // tabCobrosPagos
        // tabProformas
        // tabDocs
        // tabAreasImplicadas
        // tabClientesAsociados
        // tabVehiculos
        // tabHitosAdicionales
        me.mainTabpanel = Ext.create('Ext.tab.Panel', {
            border: false,
            items: [
                me.customForm, me.formaPago, me.docForm, me.formProforma,
                me.formAreasImplicadas, me.tabVehiculos, me.tabClientesAsociados]
        });

        if (me.suplemento) {
            me.mainTabpanel.add({
                title: me.etiquetas.lbObjetoSuplemento +
                    ' <span style="color:red" data-qtip="Este campo es obligatorio">*</span>',
                layout: 'fit',
                items: [me.objetosuplemento]
            })
        }
        if(me.acciones['tabHitosAdicionales'] /*&& !me.addsuplemento */&& me.action== 'edit'){
            me.mainTabpanel.add(Ext.create('GestionContratoImportacion.view.TabHitosAdicional'));
        }

        me.items = [me.mainTabpanel];
    },
    onMore: function (field) {
        Ext.create('GestionContratoImportacion.view.SelectWindowClienteProveedor', {
            selectfield: field
        }).show();
    }
});
