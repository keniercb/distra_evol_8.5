Ext.define('SolicitudNegocioImportacion.view.WinEditSolicitud', {
    extend: 'Ext.window.Window',
    alias: 'widget.wineditsolicitudimportacion',
    frame: false,
    margin: false,
    border: false,
    width: 800,
    closable: true,
    closeAction: 'destroy',
    modal: true,
    actionInsert: true,
    resizable: false,
    defaultFocus:'nombre',
    initComponent: function () {
        var me = this;

        Ext.util.Format.decimalSeparator = ',';
        Ext.util.Format.thousandSeparator = '.';
        Ext.util.Format.currencyPrecision = 2;
        Ext.util.Format.currencySign = ' ';

        me.etiquetas = LangMgr.getLang(me);

        me.initBody();

        me.initButtons();

        me.callParent();

        function cambioGrid() {
            me.gridAreasValido.setValue('valido')
        }

        function cambioGridPS() {
            me.gridProductosValido.setValue('valido')
        }

        me.gpareasimpl.getStore().on('add', cambioGrid)
        me.gpareasimpl.getStore().on('remove', cambioGrid)
        me.gpareasimpl.getStore().on('update', cambioGrid)
        me.gridProductoServicios.getStore().on('add', cambioGridPS)
        me.gridProductoServicios.getStore().on('remove', cambioGridPS)
        me.gridProductoServicios.getStore().on('update', cambioGridPS)

        me.down('form').on('validitychange', function (yo) {
            me.checkValidez();
        });
        me.down('form').on('dirtychange', function (yo) {
            me.checkValidez();
        });
        me.down('form[tabId=datosadicionales]').on('validitychange', function () {
            me.checkValidez();
        });
        me.down('form[tabId=datosadicionales]').on('dirtychange', function (yo) {
            me.checkValidez();
        });
        me.down('#objeto').on('change', function (yo) {
            me.checkValidez();
        });
        if(me.down('#multiDemandas')){
            me.down('#multiDemandas').on('validitychange', function (yo) {
                me.checkValidez();
            });
            me.down('#multiDemandas').on('dirtychange', function (yo) {
                me.checkValidez();
            });
        }

        // me.down('#objeto').on('dirtychange', function (yo) {
        //     me.checkValidez();
        // });
        // me.down('#descripcion').on('dirtychange', function (yo) {
        //     me.checkValidez();
        // });
        // Ext.TaskManager.start({
        //     run: this.checkWindow.bind(me),
        //     interval: 100,
        //     scope: this
        // });
    },
    checkValidez: function () {
        var me = this,
            form = me.down('form').getForm(),
            formDA = me.down('form[tabId=datosadicionales]').getForm(),
            formM = me.down('#objeto').getValue(),
            invalid = form.hasInvalidField() || formDA.hasInvalidField() || !me.down('#objeto').isValid(),
            dirty = form.isDirty() || formDA.isDirty() || me.down('#descripcion').isDirty() || me.down('#objeto').isDirty();
        if(me.down('#multiDemandas')){
            // console.log('entra:', invalid, dirty, me.validoGridProductoOferta.getValue(), me.down('#multiDemandas').hasInvalidField(), me.down('#multiDemandas').getValues())
            invalid=invalid || me.down('#multiDemandas').hasInvalidField();
            dirty=dirty || me.sflineaSelect.isDirty();
        }
        // console.info('checkValidez', invalid, dirty)
        if (me.action == 'addsolicitud') {
            me.down('button[action=aplicar]').setDisabled(invalid);
            me.down('button[action=aceptar]').setDisabled(invalid);
        } else {
            // console.log('invalid',invalid)
            // console.log('!dirty',!dirty)
            me.down('button[action=aplicar]').setDisabled(invalid || !dirty);
            me.down('button[action=aceptar]').setDisabled(invalid || !dirty);
        }
    },
    initBody: function () {
        var me = this;

        me.docAdicionales = Ext.create('OfertaNegocioImportacion.view.DocumentosAdicionales', {
            tabId: 'datosadicionales', height: me.height - 87, hidden: me.gestordocumentalactivo == 0
        });

        var elementos=[
            me.getFormDatosGenerales(),
            // me.getFormDescripcion(),
            me.docAdicionales,
            me.getProductoServicioTab(),
            me.getMotivosTab()
        ]
        if(me.tipo==4)elementos.push(me.getMultiDemandaTab())
        me.items = [{
            xtype: 'tabpanel',
            deferredRender: false,
            border: false,
            items: elementos
        }];


    },
    getFormDatosGenerales: function () {
        var me = this;
        // me.hfsolicituddemanda = Ext.create('Ext.form.field.Hidden', {
        //     context: 'gestioncontratomainwindowsolicitud'
        // });
        me.sfsolicituddemanda = Ext.create('Ext.form.field.ComboBox', {
            name: 'idpadre',
            fieldLabel: me.etiquetas.lbSolicitudDemanda,
            valueField: 'idsolicitud',
            displayField: 'nombre',
            queryMode: 'remote',
            queryDelay: 400,
            minChars: 1,
            pageSize: 20,
            listLoadingText: 'Cargando...',
            listEmptyText: 'No existen datos que mostrar.',
            flex:1,
            allowBlank: true,
            hidden: true,
            // hidden: me.tipo!=4,
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
                        'filter[0][field]': 'cliente',
                        'filter[0][data][type]': 'list',
                        'filter[0][data][value]': '[3]',
                        'filter[1][field]': 'estado',
                        'filter[1][data][type]': 'list',
                        'filter[1][data][value]': '['+me.idestadosolicitud+']',

                        // me.context == 'cliente' ? 1 : 2
                    }
                },
                fields:[
                    'idsolicitud', 'nombre', 'idclienteproveedor', 'idsector', 'sector', 'idarearesponsable',
                    'descripcion', 'arearesponsable', 'idarea', 'area', 'clienteproveedor', 'idproveedores',
                    'idlinea', 'idtipolinea'
                ],
            }),
            // listeners:{
            //     select: function(yo, records){
            //         console.log('select', records)
            //
            //         if(records.length>0){
            //             me.cmbarea.setValue(records[0].data.arearesponsable);
            //             me.hfarea.setValue(records[0].data.idarearesponsable);
            //             me.tfNombre.setValue(records[0].data.nombre);
            //             // me.hflinea.setValue(records[0].data.idlinea);
            //             me.sflinea.setValue(records[0].data.linea);
            //             // me.hftipolinea.setValue(records[0].data.idtipolinea);
            //             me.sftipolinea.setValue(records[0].data.tipolinea);
            //             // me.down('form').getForm().loadRecord(records[0]);
            //         }
            //
            //
            //     }
            // }
        });

        me.tfNumero = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbFieldNumero,
            name: 'numero',
            readOnly: true,
            anchor: '100%',
            // regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ,\(-.\)]+(\d*)?)+$/,
            // regexText: me.etiquetas.validationNombreSolicitud,
            maxLength: 150,
            width: 100,
            flex:1,
            maxLengthText: me.etiquetas.validationMaxLength_150,
            // allowBlank: me.tipo!=4,
            // hidden: me.tipo!=4 && me.tipo!=3,
            blankText: me.etiquetas.vBlankText,

        });

        me.fechainicio = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.etiquetas.lbFechaInicio,
            name: 'fechacreada',
            hidden: me.tipo!=4,
            width: 100,
            flex: 1,
            margin: '0 0 0 6'
        });

        me.fechafin = Ext.create('Ext.form.field.Date', {
            fieldLabel: me.etiquetas.lbFechaFin,
            name: 'fechafin',
            hidden: me.tipo!=4,
            width: 100,
            flex: 1,
            margin: '0 0 0 6'
        });

        me.tfNombre = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbFieldNombre,
            name: 'nombre',
            anchor: '100%',
            flex:1,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ,\(-.\)]+(\d*)?)+$/,
            regexText: me.etiquetas.validationNombreSolicitud,
            maxLength: 150,
            maxLengthText: me.etiquetas.validationMaxLength_150,
            allowBlank: false,
            blankText: me.etiquetas.vBlankText
        });

        me.hfsector = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowsector',
            name: 'idsector'
        });

        me.sfsector = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbFieldSector,
            name: 'sector',
            mapping: 'NomSector.denominacion',
            localId: 'idsector',
            module: 'Nomencladores',
            allowBlank: me.tipo==4,
            hidden: me.tipo==4,
            gen: 'm',
            filters: {},
            context: 'gestioncontratomainwindowsector',
            flex:1,
            columnWidth: 0.50,
            // margin: '0 0 10 0',
        });

        me.hfarea = Ext.create('Ext.form.field.Hidden', {
            name: 'idarea'
        });

        me.cmbarea = Ext.create('GestionContratoImportacion.view.CmbArea', {
            fieldLabel: me.etiquetas.lbAreaResponsable,
            localId: 'idarea',
            name: 'arearesponsable',
            allowBlank: me.tipo==3 || me.tipo==4,
            emptyText: me.etiquetas.lbSeleccione,
            flex:1,
            columnWidth: 0.50,
            // margin: '0 0 10 5',
            editable: false
        });

        me.hfclienteproveedor = Ext.create('Ext.form.field.Hidden', {
            name: 'idclientesproveedores'
        });

        me.sfclienteproveedor = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbFieldCliente,
            name: 'clienteproveedor',
            mapping: 'NomClienteproveedor.nombre',
            localId: 'idclientesproveedores',
            queryParam: 'clienteproveedor',
            module: 'TipoContrato',
            noactions: true,
            anchor: '100%',
            flex:1,
            allowBlank: me.context=='proveedor',
            hidden: me.context=='proveedor',
            context: 'gestioncontratomainwindowclienteproveedor',
            filters: {
                idtipo: 1,
                idestructuracomun: window.parent.UCID.portal.perfil.idestructuracomun
            },
            controller: 'gestioncontratomainwindow',
            listeners:{
                select: function(yo, records){
                    // console.log('change cliente:', records, yo.getValue())
                    // if(me.tipo==3) {
                    //     me.sflinea.setDisabled(records.length != 1);
                    //     if (records.length != 1) {
                    //         me.sflinea.getStore().proxy.extraParams = {};
                    //         me.sftipolinea.getStore().proxy.extraParams.idclienteproveedor = null;
                    //     } else {
                    //         me.sflinea.getStore().proxy.extraParams = {
                    //             'idclienteproveedor': records[0].get('idclientesproveedores'),
                    //             'soloLineas': true
                    //         }
                    //         me.sftipolinea.getStore().proxy.extraParams.idclienteproveedor = records[0].get('idclientesproveedores');
                    //     }
                    //     me.sflinea.setValue('');
                    //     me.sflinea.getStore().load();
                    // }
                },
                change: function(yo){
                    // if(me.tipo==3) {
                    //     var record = yo.findRecordByValue(yo.getValue());
                    //     // console.log('change:', record)
                    //     if (!record) {
                    //         me.sflinea.setValue('');
                    //         me.sftipolinea.setValue('');
                    //         me.sflinea.getStore().proxy.extraParams = {};
                    //         me.sftipolinea.getStore().proxy.extraParams = {};
                    //         me.sflinea.setValue('');
                    //         me.sftipolinea.setValue('');
                    //         me.sflinea.setDisabled(true);
                    //     }
                    // }
                }
            }
        });

        // me.hflinea = Ext.create('Ext.form.field.Hidden', {
        //     context: 'gestioncontratomainwindowlinea',
        //     name: 'idlinea2'
        // });

        // me.sflinea = Ext.create('Ext.ux.CmbSelectField', {
        me.sflinea = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbBtnLinea,
            name: 'idlinea',
            allowBlank: true,
            // mapping: 'NomSector.denominacion',
            // localId: 'idlinea',
            // module: 'Nomencladores',
            flex: 1,
            // allowBlank: me.tipo==1 || me.tipo==2,
            hidden: me.tipo==1 || me.tipo==2,
            // gen: 'm',
            // filters: {},
            // context: 'gestioncontratomainwindowlinea',
            columnWidth: 0.50,
            // valueField:'idlinea',
            // displayField:'linea',
            valueField:'idindicador',
            displayField:'denominacion',
            queryParam:'linea',
            disabled: me.tipo==1 || me.tipo==2,
            emptyText: (me.tipo==4)?'Seleccione la demanda...':'Seleccione...',
            listConfig: {
                loadingText: me.etiquetas.msgCargando,
                emptyText: '<div class="x-grid-empty">' + me.etiquetas.listEmptyText + '</div>'
            },
            readOnly: me.tipo==4,
            // queryMode: 'local',
            // editable:false,
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '<div class="x-boundlist-item" data-qtip="{codigo} - {denominacion}">' +
                '{denominacion}' +
                '</div>',
                '</tpl>'
            ),
            store: Ext.create('SolicitudNegocioImportacion.store.Linea'),
            // tpl: '<tpl for="."><div  class="x-combo-list-item" ' +
            // 'qtip="{linea}">{linea} </div></tpl>',

            // store: Ext.create('Ext.data.Store',{
            //     // remoteFilter: false,
            //     // requires: 'SolicitudNegocioImportacion.model.Linea',
            //     // model: 'SolicitudNegocioImportacion.model.Linea',
            //     fields: [
            //         {name: 'idlinea'},
            //         {name: 'idtipolinea'},
            //         {name: 'linea'},
            //         {name: 'tipolinea'},
            //         {name: 'idnaturaleza'},
            //         {name: 'denominacion'},
            //         {name: 'idindicador'}
            //     ],
            //     storeId: 'Linea',
            //     // remoteFilter: true,
            //     // remoteSort: true,
            //     // pageSize: 25,
            //     proxy: {
            //         type: 'ajax',
            //         url: UtilsFn.buildUrl({action: 'cargarLineas'}, ModuleMgr.get('SolicitudNegocioImportacion')),
            //         // url: UtilsFn.buildUrl({action: (me.tipo==4)?'getLineasClientes':'cargarLineas'}, ModuleMgr.get('SolicitudNegocioImportacion')),
            //         actionMethods: {read: 'POST'},
            //         reader: {
            //             root: 'datos',
            //             totalProperty: 'cantidad',
            //             successProperty: 'success'
            //         }
            //     }
            // }),
            listeners:{
                select: function(yo, records){
                    if(me.tipo==3) {
                        me.sftipolinea.setDisabled(!yo.getValue());
                        // console.log('records', records)
                        if(yo.getValue()){
                            me.sftipolinea.getStore().proxy.extraParams.idlinea = yo.getValue();
                            // esto es para cargar luego los productos
                            me.filtros = {
                                'idnaturaleza': me.idnaturaleza,
                                'node': yo.getValue()
                            }
                        }else {
                            me.sftipolinea.getStore().proxy.extraParams.idlinea = null;
                            me.filtros = {'idnaturaleza': me.idnaturaleza,}
                        }
                        me.sftipolinea.setValue('');
                        me.sftipolinea.getStore().load();
                    }
                },
                change: function(yo){
                    if(me.tipo==3) {
                        var pos = yo.store.findExact('idindicador', yo.getValue());
                        // var record = yo.findRecordByValue(yo.getValue());
                        // console.log('change:', pos, yo.getValue())
                        me.sftipolinea.setDisabled(pos == -1);
                        if (pos != -1) {
                        } else {
                            me.sftipolinea.getStore().proxy.extraParams.idlinea = null;
                            me.filtros = {'idnaturaleza': me.idnaturaleza,}
                            me.sftipolinea.getStore().load();
                        }
                    }
                }
            }
            // margin: '0 0 10 0',
        });
        if(me.tipo==4)
            me.sflinea.getStore().proxy.extraParams = {'soloLineas': true}
        // me.hftipolinea = Ext.create('Ext.form.field.Hidden', {
        //     context: 'gestioncontratomainwindowtipo',
        //     name: 'idtipolinea'
        // });

        me.sftipolinea = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbBtnTipo,
            name: 'idtipolinea',
            valueField: 'idtipolinea',
            displayField: 'tipolinea',
            queryParam:'tipolinea',
            // allowBlank: me.tipo!=3,
            // mapping: 'NomTipoLinea.denominacion',
            // localId: 'idtipolinea',
            // module: 'Nomencladores',
            flex: 1,
            // allowBlank: me.tipo==1 || me.tipo==2,
            hidden: me.tipo==1 || me.tipo==2,
            // gen: 'm',
            // filters: {},
            // context: 'gestioncontratomainwindowtipo',
            emptyText: (me.tipo==4)?'Seleccione la demanda...':'Seleccione...',
            columnWidth: 0.50,
            disabled: me.tipo!=4,
            readOnly: me.tipo==4,
            editable: me.tipo==3,
            // store: Ext.create('SolicitudNegocioImportacion.store.Linea'),
            store: Ext.create('Ext.data.Store',{
                // remoteFilter: false,
                // requires: 'SolicitudNegocioImportacion.model.Linea',
                // model: 'SolicitudNegocioImportacion.model.Linea',
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
                // remoteFilter: true,
                // remoteSort: true,
                // pageSize: 25,
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
                loadingText: me.etiquetas.msgCargando,
                emptyText: '<div class="x-grid-empty">' + me.etiquetas.listEmptyText + '</div>'
            },
            listeners:{
                change: function(){
                    //  si no esta esto al dar click al campo se desplega la lista
                }
            }
            // margin: '0 0 10 5',
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
            fieldLabel: me.etiquetas.lbResponsable,
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
            // allowBlank: me.tipo==1 || me.tipo==2,
            hidden: me.tipo==1 || me.tipo==2,
            // margin: '0 0 10 5',
        });

        me.descripcion=Ext.create('Ext.form.field.TextArea',{
            fieldLabel: me.etiquetas.lbTitleTabDDescripcion,
            itemId: 'descripcion',
            name: 'descripcion',
            anchor: '100%',
            height: 70,
        })

        me.panelProveedores = null;
        if (me.context=='proveedor') {
            me.panelProveedores = Ext.create('Nomencladores.view.GridToGrid', {
                closeAction: 'destroy',
                margin: '10 0 0 0',
                anchor: '100%',
                allowBlank: me.context=='cliente',
                preventMark: true,
                defineEvents: function () {
                    var _this = this;
                    this.rightGrid.getSelectionModel().on({
                        scope: this,
                        selectionchange: function () {
                            this.enableButtons(this.rightGrid);
                        }
                    });
                    this.leftGrid.getSelectionModel().on({
                        scope: this,
                        selectionchange: function () {
                            this.enableButtons(this.leftGrid);
                        }
                    });
                    this.stRight.on({
                        scope: this,
                        datachanged: function () {
                            this.enableButtons(this.rightGrid);
                            if (_this.rightGrid.cargandoServidor)
                                _this.resetOriginalValue();
                            me.down('form').fireEvent('validitychange', me.down('form'))
                            this.isValid();
                            if (this.stRight.data.items.length > 0)
                                _this.preventMark = false;
                            _this.originalValue=this.stRight.data.items;
                            //     var ids=[];
                            //     this.stRight.getRange().forEach(function(x){
                            //         ids.push(x.get('idclientesproveedores'))
                            //     })
                            //     me.sflinea.getStore().proxy.extraParams.idclientesproveedores=ids.toString();
                            // }else{
                            //     me.sflinea.getStore().proxy.extraParams.idclientesproveedores=null;
                            //     me.sflinea.getStore().proxy.extraParams.idlinea=null;
                            //     me.sflinea.setValue('');
                            //     me.sftipolinea.setValue('');
                            // }
                            // me.sflinea.setDisabled(this.stRight.data.items.length == 0)
                            // me.sflinea.getStore().load();
                        }
                    });
                    this.stLeft.on({
                        scope: this,
                        datachanged: function () {
                            this.enableButtons(this.leftGrid);
                            if (this.leftLoaded) {
                                this.isValid();
                            }
                        }
                    });
                },
                getRoles: function () {
                    null;
                },
                createBody: function () {
                    var _this = this,
                        columns = [
                            {
                                text: 'Nombre', flex: 1, dataIndex: 'nombre',
                                renderer: function (value, meta) {
                                    if (value) meta.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            },
                        ];

                    this.btnMoveAllRight = Ext.create('Ext.button.Button', {
                        tooltip: 'Adicionar todos',
                        iconCls: 'desplazardoblederecha',
                        handler: _this.allMoveRight.bind(_this),
                        disabled: true
                    });

                    this.btnMoveRight = Ext.create('Ext.button.Button', {
                        tooltip: 'Adicionar seleccionados',
                        iconCls: 'siguiente',
                        handler: _this.moveRight.bind(_this),
                        disabled: true
                    });

                    this.btnMoveLeft = Ext.create('Ext.button.Button', {
                        tooltip: 'Quitar seleccionados',
                        iconCls: 'anterior',
                        handler: _this.moveleft.bind(_this),
                        disabled: true
                    });

                    this.btnMoveAllLeft = Ext.create('Ext.button.Button', {
                        tooltip: 'Quitar todos',
                        iconCls: 'desplazardobleizq',
                        handler: _this.allMoveleft.bind(_this),
                        disabled: true
                    });

                    Ext.define('proveedor', {
                        extend: 'Ext.data.Model',
                        fields: [
                            {name: 'idsolicitudnegocioproveedor'},
                            {name: 'idclientesproveedores'},
                            {name: 'nombre'},
                        ]
                    });

                    this.stRight = Ext.create('Ext.data.Store', {
                        originals: [],
                        idsOriginals: [],
                        cargandoServidor: false,
                        model: 'proveedor',
                        proxy: {
                            type: 'ajax',
                            actionMethods: {read: 'POST'},
                            url: UtilsFn.buildUrl({action: 'cargarProveedoresSolicitud'}, ModuleMgr.get('SolicitudNegocioImportacion')),
                            reader: {
                                root: 'datos',
                                totalProperty: 'cantidad',
                                successProperty: 'success'
                            },
                            extraParams: {
                                'idsolicitud': me.idsolicitud,
                            }
                        },
                        listeners: {
                            beforeload: function () {
                                _this.rightGrid.mascara = new Ext.LoadMask(_this.rightGrid.el, {
                                    msg: me.etiquetas.msgLoading
                                });
                                _this.rightGrid.mascara.show();
                                _this.rightGrid.cargandoServidor = true;
                            },
                            load: function (store, records, success) {
                                _this.rightGrid.cargandoServidor = false;
                                _this.rightGrid.setLoading(false);
                                if (_this.rightGrid.mascara) _this.rightGrid.mascara.hide();

                                _this.resetOriginalValue();
                                if (success) {
                                    if (store.data.items.length > 0)
                                        store.data.items.forEach(function (x) {
                                            _this.stRight.idsOriginals.push(x.get('idclientesproveedores'));
                                            _this.stRight.originals.push(x.data);
                                        });
                                }
                            }
                        }
                    });

                    this.stLeft = Ext.create('Ext.data.Store', {
                        model: 'proveedor',
                        remoteFilter: true,
                        proxy: {
                            type: 'ajax',
                            actionMethods: {read: 'POST'},
                            url: UtilsFn.buildUrl({action: 'cargarProveedores'}, ModuleMgr.get('SolicitudNegocioImportacion')),
                            reader: {
                                type: 'json',
                                root: 'datos',
                                totalProperty: 'cantidad',
                                successProperty: 'success'
                            },
                            extraParams: {
                                'idsolicitud': me.idsolicitud,
                                'idlinea': me.idlinea,
                            }
                        },
                        listeners: {
                            beforeload: function () {
                                _this.leftGrid.mascara = new Ext.LoadMask(_this.leftGrid.el, {
                                    msg: me.etiquetas.msgLoading
                                });
                                _this.leftGrid.mascara.show();
                            },
                            load: function () {
                                if (_this.leftGrid.mascara) _this.leftGrid.mascara.hide();
                                if (_this.stRight.data.items.length > 0) {
                                    var seleccionados = [], toRemove = [];
                                    _this.stRight.data.items.forEach(function (x) {
                                        seleccionados.push(x.get('idclientesproveedores'));
                                    });
                                    _this.stLeft.data.items.forEach(function (x) {
                                        if (seleccionados.indexOf(x.get('idclientesproveedores')) != -1)
                                            toRemove.push(x);
                                    });
                                    _this.stLeft.remove(toRemove);
                                }
                            }
                        }
                    });

                    this.leftGrid = Ext.create('Ext.grid.Panel', {
                        flex: 1,
                        selType: 'checkboxmodel',
                        viewConfig: {
                            plugins: {
                                ptype: 'gridviewdragdrop'
                            },
                            listeners: {
                                drop: function () {
                                    _this.isValid();
                                }
                            }
                        },
                        tbar: [
                            Ext.create('Ext.ux.SearchField', {
                                itemId: 'searchfield',
                                flex: 1,
                                fnOnClear: _this.remoteClear,
                                fnOnSearch: _this.remoteSearch,
                                clearTooltip: _this.etiquetas.qtipLimpiar,
                                searchTooltip: _this.etiquetas.qtipBuscarRolDisponible
                            })
                        ],
                        store: _this.stLeft,
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: _this.stLeft,
                            dock: 'bottom'
                        },
                        columns: columns,
                        title: 'Listado de proveedores',
                        plugins: [
                            Ext.create('SolicitudPago.view.MarcarFiltroPlugin', {
                                extraParams: true,
                                campos: [{
                                    'itemId': 'searchfield',
                                    'dataIndex': ['nombre'],
                                    'extraParams': 'nombre'
                                }]
                            })
                        ]
                    });

                    this.rightGrid = Ext.create('Ext.grid.Panel', {
                        flex: 1,
                        id: 'rightgrid',
                        selType: 'checkboxmodel',
                        tbar: [
                            Ext.create('Ext.ux.SearchField', {
                                flex: 1,
                                fnOnClear: _this.clear,
                                fnOnSearch: _this.search,
                                clearTooltip: _this.etiquetas.qtipLimpiar,
                                searchTooltip: _this.etiquetas.qtipBuscarRolAutorizado
                            })
                        ],
                        viewConfig: {
                            plugins: {
                                ptype: 'gridviewdragdrop'
                            },
                            listeners: {
                                drop: function () {
                                    _this.isValid();
                                }
                            }
                        },
                        store: _this.stRight,
                        columns: columns,
                        title: 'Proveedores seleccionados' + '<span style="color:red;font-weight:bold" data-qtip="Obligatorio">*</span>'
                    });

                    var items = [
                        _this.leftGrid,
                        {
                            xtype: 'panel',
                            frame: true,
                            layout: {
                                type: 'vbox',
                                pack: 'center'
                            },
                            items: [{
                                xtype: 'toolbar',
                                dock: 'right',
                                border: false,
                                items: [
                                    this.btnMoveAllRight,
                                    this.btnMoveRight,
                                    this.btnMoveLeft,
                                    this.btnMoveAllLeft
                                ]
                            }],
                        },
                        _this.rightGrid];
                    // console.log('Normal:', 515, 213 , 515-302, ':::', me.maxHeight, me.height, me.height-302)
                    this.bodyContainer = Ext.create('Ext.container.Container', {
                        flex: 1,
                        height: me.height<me.maxHeight?me.height-302:me.maxHeight-302,
                        // height: 213,
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: items
                    });

                },
                search: function () {
                    var store = this.up('gridpanel').getStore(),
                        value = this.getValue().toLowerCase();

                    store.filterBy(function (record) {
                        if (record.get('nombre'))
                            return record.get('nombre').toLowerCase().indexOf(value) != -1;
                    });
                },
                remoteSearch: function () {
                    var store = this.up('gridpanel').getStore(),
                        value = this.getValue();
                    store.proxy.extraParams['nombre'] = value;
                    store.load();
                },
                remoteClear: function () {
                    var store = this.up('gridpanel').getStore();
                    store.proxy.extraParams['nombre'] = '';
                    store.load();
                },
                getValue: function () {
                    var store = this.stRight,
                        cant = store.getCount(),
                        value = new Array();
                    if (cant) {
                        var range = store.getRange(0, cant - 1);
                        Ext.each(range, function (record) {
                            value.push(record.get('idclienteproveedor'));
                        });

                    }
                    return value;
                },
                // isDirty: function(){
                //     console.log('DIRTY')
                //     return false;
                // }
            });
        }
        me.gpareasimpl = Ext.create('SolicitudNegocioImportacion.view.GpAreasImplicadas', {
            title: me.etiquetas.lbAreasImplicadas,
            margin: '10 0 0 0', height: 140,
            hidden: me.tipo==3 || me.tipo==4
        });

        me.gridAreasValido = Ext.create('Ext.form.field.Hidden', {
            allowBlank: false, value: me.action == 'addsolicitud' ? 'valido' : ''
        });

        me.gridProductosValido = Ext.create('Ext.form.field.Hidden', {
            allowBlank: false, value: me.action == 'addsolicitud' ? 'valido' : ''
        });

        return {
            title: me.etiquetas.lbTitleTabDatosGenerales,
            xtype: 'form',
            trackResetOnLoad: true,
            bodyStyle: {
                padding: '5px 10px 10px 10px',
                background: '#DFE9F6'
            },
            fieldDefaults: {labelAlign: 'top'},
            defaults:{
                // bodyStyle: 'background:#DFE9F6;',
                defaults: {margin: '0 3 0 3'}
            },
            items: [
                {
                    layout: 'hbox',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    hidden: true,
                    items: [
                        me.sfsolicituddemanda,
                        // me.tfNumero
                    ]
                },
                {
                    layout: 'hbox',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    // anchor: '50%',
                    items: [
                        me.tfNombre,
                        me.tfNumero,
                        // {
                        //     layout:'hbox',
                        //     border:false,
                        //     bodyStyle: 'background:#DFE9F6;',
                        //     flex:1,
                        //     hidden: me.tipo!=4 && me.tipo!=3,
                        //     // margin:'0 0 0 0',
                        //     // defaults: {margin: '0 3 0 3'},
                        //     items:[
                        //         me.tfNumero, me.fechainicio, me.fechafin,
                        //     ]
                        // }
                    ]
                },

                {
                    xtype: 'hidden',
                    name: 'idsolicitud',
                    value: 0
                },
                {
                    xtype: 'hidden',
                    name: 'idespaciotrabajo'
                },
                {
                    layout: 'hbox',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    items:[
                        me.hfclienteproveedor, me.sfclienteproveedor,
                        // me.hflinea, me.hftipolinea,
                        me.sflinea, me.sftipolinea,
                    ]

                },
                {
                    layout: 'hbox',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    items: [
                        me.hfsector, me.sfsector,

                        me.fechainicio, me.fechafin,me.hfarea, me.cmbarea, me.hfresponsable, me.cmbreponsable,
                    ]
                },

                me.descripcion,
                me.panelProveedores,
                me.gpareasimpl, me.gridAreasValido, me.gridProductosValido
            ]
        };
    },
    getFormDescripcion: function () {
        var me = this;

        return Ext.create('SolicitudNegocioImportacion.view.TinyHtmlEditor', {
            title: me.etiquetas.lbTitleTabDDescripcion,
            itemId: 'descripcion',
            name: 'descripcion',
            anchor: '100%',
            border: false,
            bodyBorder: false,
            height: me.height - 87
        });
    },
    getProductoServicioTab: function () {
        var me = this;
        me.gridProductoServicios = Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto', {
            title: me.etiquetas.lbProductoServicio,
            layout: 'fit',
            height: me.height - 87,
            buttonImp: me.tipo==3,
            totales: true,
            hidden: me.tipo==4,
            monedasentidad: me.monedasentidad,
            // context:'cliente'
        });
        me.gridProductoServicios.getStore().removeItems = [];
        me.gridProductoServicios.getStore().on('remove', function (store, records) {
            me.gridProductoServicios.getStore().removeItems.push(records);
        });
        me.gridProductoServicios.columns.forEach(function (x) {
            if (['unidadmedida', 'precio', 'preciodivisa'].indexOf(x.dataIndex) != -1) {
                x.hideable = false;
                x.hidden = true;
            }
        });
        return me.gridProductoServicios;
    },
    getMotivosTab: function(){
        var me=this;

        return {
            xtype:'panel',
            itemId: 'panelobjeto',
            title: 'Motivo'+
            ' <span style="color:red" data-qtip="Este campo es obligatorio">*</span>',
            layout:'fit',
            hidden: !me.verMotivo,
            disabled: !me.verMotivo,
            // hidden: me.action != 'crearcontrademanda',
            // disabled: me.action != 'crearcontrademanda',
            items:[
                {
                    xtype: 'textarea',
                    itemId: 'objeto',
                    name: 'objeto',
                    allowBlank: false,
                    height: me.height - 87
                }
            ]
        }
    },
    getMultiDemandaTab: function(){
        var me=this;
        me.validoGridProductoOferta = Ext.create('Ext.form.field.Text', {
            hidden:true,
            allowBlank: false, name: 'validoproductooferta',
            value: ''// value: me.action == 'addsolicitud' ? 'valido' : ''
        });
        me.sflineaSelect = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbBtnLinea,
            labelWidth: 50,
            // width: 350,
            name: 'idlineaselect',
            allowBlank: false,
            flex: 1,
            // anchor: '100%',
            // valueField: 'idindicador',
            valueField: 'idnaturaleza',
            displayField: 'denominacion',
            queryParam: 'denominacion',
            emptyText:  'Seleccione...',
            margin: '0 10 5 0',
            listConfig: {
                loadingText: me.etiquetas.msgCargando,
                emptyText: '<div class="x-grid-empty">' + me.etiquetas.listEmptyText + '</div>'
            },
            pageSize: 25,
            // queryMode: 'local',
            // editable:false,
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '<div class="x-boundlist-item" data-qtip="{codigo} - {denominacion}">' +
                '{denominacion}' +
                '</div>',
                '</tpl>'
            ),
            store: Ext.create('SolicitudNegocioImportacion.store.Linea', {storeId: 'lineasSelect'}),
            // listeners:{
            //     select: function(yo, records){
            //         if(yo.getValue()){
            //             // win.sflinea.setValue(yo.getValue());
            //             if(me.gridProductoServiciosFinal.getStore().getCount()>0){
            //                 mostrarMensaje(2, me.etiquetas.msgElimSolicitud, function (response) {
            //                     if (response === 'ok') {
            //                         me.changeLinea(yo.getValue());
            //                     } else if (response == 'cancel') {
            //                         return false;
            //                     }
            //                 });
            //             }else{
            //                 me.changeLinea(yo.getValue());
            //             }
            //         }
            //     }
            // }
        });
        me.sftipolineaSelect = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbBtnTipo,
            labelWidth: 80,
            name: 'idtipolineaselect',
            valueField: 'idtipolinea',
            displayField: 'tipolinea',
            queryParam:'tipolinea',
            flex: 1,
            emptyText: 'Seleccione...',
            disabled: true,
            margin: '0 0 5 0',
            store: Ext.create('Ext.data.Store',{
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
                loadingText: me.etiquetas.msgCargando,
                emptyText: '<div class="x-grid-empty">' + me.etiquetas.listEmptyText + '</div>'
            },
            // margin: '0 0 10 5',
        });
        /*me.sfsolicituddemandaSelect = Ext.create('Ext.form.field.ComboBox', {
            name: 'idpadre',
            fieldLabel: me.etiquetas.lbSolicitudDemanda,
            valueField:'idsolicitud',
            displayField:'nombre',
            queryMode: 'remote',
            queryDelay: 400,
            minChars: 1,
            pageSize: 20,
            listLoadingText: 'Cargando...',
            listEmptyText: 'No existen datos que mostrar.',
            flex:1,
            allowBlank: me.tipo!=4,
            hidden: me.tipo!=4,
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
                        'filter[0][field]': 'cliente',
                        'filter[0][data][type]': 'list',
                        'filter[0][data][value]': '[3]',
                        'filter[1][field]': 'estado',
                        'filter[1][data][type]': 'list',
                        'filter[1][data][value]': '['+me.idestadosolicitud+']',

                        // me.context == 'cliente' ? 1 : 2
                    }
                },
                fields:[
                    'idsolicitud', 'nombre', 'idclienteproveedor', 'idsector', 'sector', 'idarearesponsable',
                    'descripcion', 'arearesponsable', 'idarea', 'area', 'clienteproveedor', 'idproveedores',
                    'idlinea', 'idtipolinea'
                ],
            }),
        });*/

        me.gridDemandas=Ext.create('Ext.grid.Panel',{
            title:'Demandas',
            itemId: 'griddemandas',
            disabled:true,  //TEMP SI
            columns:[
                {text:'Nombre', dataIndex: 'nombre', flex:1,
                    renderer: function (value, meta, record) {
                        if (!Ext.isEmpty(value)) meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }},
                {xtype: 'booleancolumn', dataIndex: 'seleccionado', align: 'center', width: 40,
                    resizable: false, hideable:false,
                    renderer: function (value, meta) {
                        if(value)meta.innerCls = "icondistra-ok verde";
                    }}
            ],
            store: Ext.create('Ext.data.Store',{
                onlyOneLoad: true,
                proxy:{
                    type: 'ajax',
                    // actionMethods: {read: 'POST'},
                    url: UtilsFn.buildUrl({action: 'getDemandas'}, ModuleMgr.get('Demanda')),
                    reader: {
                        idProperty: 'idsolicitud',
                        type: 'json',
                        root: 'datos',
                        totalProperty: 'cant'
                    },
                    extraParams:{  //me.idestadosolicitud
                        'filter[0][field]': 'cliente',
                        'filter[0][data][type]': 'list',
                        'filter[0][data][value]': '[3]',
                        'filter[1][field]': 'estado',
                        'filter[1][data][type]': 'list',
                        'filter[1][data][value]': '['+me.idestadosolicitud+']',
                        // me.context == 'cliente' ? 1 : 2
                    }
                },
                fields:[
                    'idsolicitud', 'nombre', 'idclienteproveedor', 'idsector', 'sector', 'idarearesponsable',
                    'descripcion', 'arearesponsable', 'idarea', 'area', 'clienteproveedor', 'idproveedores',
                    'idlinea', 'idtipolinea', 'numero', {name: 'seleccionado', defaultValue: false}
                ],
            }),
            selModel: {
                xtype:'rowmodel',
            },
            flex:1,
            minWidth: 200,
            maxWidth: 330,
            // resizable:true
        });
        // me.gridDemandas.getStore().load() //TEMP NO

        me.gridProductoServiciosSelect = Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto', {
            title: 'Productos',
            border:true,
            disabled:true,
            layout: 'fit',
            // height: me.height - 87,
            totales: true,
            flex:2,
            editGrid: false,
            sinToolbar: true,
            sinAcciones: true,
            monedasentidad: me.monedasentidad,
            // margin:'0 0 0 5',
            visibleColumns: ['codigo', 'denominacion', 'cantidad', 'total','importe', 'tipo', 'monedas'],
            // context:'cliente'
        });

        me.gridProductoServiciosFinal = Ext.create('GestionContratoImportacion.view.FormaPago.Producto.GridProducto', {
            title: me.etiquetas.lbProductoServicio+' <span style="color:red" data-qtip="Este campo es obligatorio">*</span>',
            // disabled:true,
            layout: 'fit',
            region: 'south',
            // minHeight: 100,
            // maxHeight: 350,
            // collapsible: true,
            // collapsed:true,
            // resizable: true,
            // height: me.height - 87,
            editGrid:false,
            totales: true,
            flex:2,
            sinAcciones: true,
            height: me.height<me.maxHeight?(me.height-152)*0.5:(me.maxHeight-152)*0.5,
            // height: me.height<me.maxHeight?me.height-315:me.maxHeight-315,
            // height: 200,
            monedasentidad: me.monedasentidad,
            // collapsible: true,
            visibleColumns: ['codigo', 'denominacion', 'cantidad', 'total','importe', 'tipo', 'monedas'],
            // context:'cliente'
        });
        function cambioStore(store){
            me.validoGridProductoOferta.setValue((store.getCount()>0?'valido':''));
        }
        me.gridProductoServiciosFinal.getStore().on('add', cambioStore);
        me.gridProductoServiciosFinal.getStore().on('remove', cambioStore);
        me.gridProductoServiciosFinal.getStore().on('update', cambioStore);
        me.gridProductoServiciosFinal.getStore().on('datachanged', cambioStore);
        return  {
            xtype: 'form',
            title: 'Demandas'+' <span style="color:red" data-qtip="Este campo es obligatorio">*</span>',
            itemId: 'multiDemandas',
            bodyStyle: {
                padding: '5px 5px 5px 5px',
                // margin: 5,
                background: '#DFE9F6'
            },
            // layout: 'border',
            // defaults:{
            //     margin: '5 5 0 5'
            // },
            items:[
                {
                    xtype: 'container',
                    region: 'north',
                    layout:{
                        type: 'hbox',
                        align:'stretch'
                    },
                    items:[
                        me.validoGridProductoOferta,
                        me.sflineaSelect,
                        me.sftipolineaSelect
                    ]
                },

                {
                    xtype: 'container',
                    region: 'center',
                    layout:{
                        type: 'hbox',
                        align:'stretch'
                    },
                    height: me.height<me.maxHeight?(me.height-152)*0.5:(me.maxHeight-152)*0.5,
                    // height: me.height<me.maxHeight?me.height-345:me.maxHeight-345,
                    // height: 163,
                    items:[me.gridDemandas, me.gridProductoServiciosSelect]
                },
                {
                    xtype:'toolbar',
                    region: 'south',
                    // margin: '0 5 5 5',
                    items:[
                        {
                            text: 'Agregar',
                            iconCls: 'icondistra-adicionar icon-medium',
                            action: 'agregardemanda',
                            itemId: 'agregardemanda',
                            disabled:true,
                            tooltip: 'Agregar a la seleccion',
                            // handler: function(){
                            //     var storeFinal=me.gridProductoServiciosFinal.getStore(),
                            //         storeOriginal=me.gridProductoServicios.getStore(),
                            //         select=me.gridDemandas.getSelectionModel().getSelection()[0];;
                            //     select.set('seleccionado', true);
                            //     me.gridProductoServiciosSelect.getStore().getRange().forEach(function(x){
                            //         var hallado=false;
                            //         storeFinal.getRange().forEach(function(y){
                            //             if(x.get('idindicador')==y.get('idindicador')){
                            //                 hallado=true;
                            //                 y.set('cantidad', parseFloat(y.get('cantidad'))+parseFloat(x.get('cantidad')));
                            //             }
                            //         });
                            //         if(!hallado){storeFinal.add(x);storeOriginal.add(x);}
                            //     });
                            //     me.validateButtons(select);
                            // }
                        },
                        {
                            text: 'Quitar',
                            iconCls: 'icondistra-eliminar icon-medium',
                            action: 'quitardemanda',
                            itemId: 'quitardemanda',
                            disabled:true,
                            tooltip: 'Quitar de la seleccion',
                            // handler: function () {
                            //     var storeFinal=me.gridProductoServiciosFinal.getStore(),
                            //         storeOriginal=me.gridProductoServicios.getStore(),
                            //         select=me.gridDemandas.getSelectionModel().getSelection()[0];
                            //     select.set('seleccionado', false)
                            //     me.gridProductoServiciosSelect.getStore().getRange().forEach(function(x){
                            //         cont=0;
                            //         storeFinal.getRange().forEach(function(y){
                            //             if(x.get('idindicador')==y.get('idindicador')){
                            //                 if(x.get('cantidad')==y.get('cantidad')){
                            //                     storeFinal.remove(y);
                            //                     storeOriginal.remove(y);
                            //                 }else if(y.get('cantidad')>x.get('cantidad')){
                            //                     var cant=y.get('cantidad');
                            //                     y.set('cantidad', parseFloat(cant)-parseFloat(x.get('cantidad')));
                            //                     storeOriginal.getAt(cont).set('cantidad', parseFloat(cant)-parseFloat(x.get('cantidad')));
                            //                 }
                            //             }
                            //             cont++;
                            //         })
                            //     })
                            //     me.validateButtons(select);
                            // }
                        },
                        '->',
                        {
                            xtype: 'text',
                            itemId: 'textodemandas',
                            hidden: true,
                            tpl: '{seleccionado} demandas seleccionadas de {total}',
                        }
                    ]
                },
                me.gridProductoServiciosFinal
            ]
        }
    },
    initButtons: function () {
        var me = this;

        me.buttons = [
            {
                text: me.etiquetas.lbBtnCancel,
                iconCls: 'icondistra-cancelar',
                tooltip: me.etiquetas.qtipCancel,
                handler: function () {
                    me.close();
                }
            }, {
                text: me.etiquetas.lbBtnApply,
                iconCls: 'icondistra-aplicar',
                tooltip: me.etiquetas.qtipApply,
                disabled: true,
                action: 'aplicar'
            }, {
                text: me.etiquetas.lbBtnAccept,
                iconCls: 'icondistra-aceptar',
                tooltip: me.etiquetas.qtipAccept,
                disabled: true,
                action: 'aceptar'
            }
        ];
    },
    initState: function () {
        var me = this;
        me.down('button[action=aplicar]').setVisible(me.actionInsert);
        me.items.first().setActiveTab(0);
    },
    resetComponents: function () {
        var me = this,
            form = me.down('form'),
            formDA = me.down('form[tabId=datosadicionales]'),
            formDemandas=me.down('#multiDemandas');

        if(me.gpareasimpl)me.gpareasimpl.getStore().removeAll();
        if(me.gridProductoServicios)me.gridProductoServicios.getStore().removeAll();
        if(me.gridDemandas)me.gridDemandas.getStore().removeAll();
        if(me.gridProductoServiciosSelect)me.gridProductoServiciosSelect.getStore().removeAll();
        if(me.gridProductoServiciosFinal)me.gridProductoServiciosFinal.getStore().removeAll();

        form.getForm().reset();
        if(formDemandas)formDemandas.getForm().reset();
        if(me.down('#descripcion'))me.down('#descripcion').setValue('');
        if(formDA){
            formDA.removeAllRow();
            formDA.insertRow();
        }
        if (me.panelProveedores) {
            me.panelProveedores.rightGrid.getStore().removeAll();
            me.panelProveedores.leftGrid.getStore().load();
        }
        // form.down('field:first').focus(false, 500);
    },
    loadValues: function (val) {
        var me = this,
            formDA = me.down('form[tabId=datosadicionales]');

        me.down('form').loadRecord(val);
    },
    getValues: function () {
        var me = this,
            areasimplicadas = new Array(),
            values;

        me.gpareasimpl.getStore().each(function (record) {
            areasimplicadas.push(record.getData());
        }, this);

        values = me.down('form').getForm().getValues();
        values.areasimplicadas = areasimplicadas;
        // values.descripcion = me.down('solicitudtinyhtmleditor').getValue();

        return values;
    },
    setActionInsert: function (action) {
        this.actionInsert = !!action;
    },
    getActionInsert: function () {
        return this.actionInsert;
    },
    show: function () {
        var me = this;

        me.initState();

        me.callParent();

        me.resetComponents();
    },
    checkWindow: function () {
        var me = this,
            form = me.down('form').getForm(),
            formDA = me.down('form[tabId=datosadicionales]').getForm(),
            invalid = form.hasInvalidField() || formDA.hasInvalidField(),
            dirty = form.isDirty() || formDA.isDirty();
        invalidGrid = false;
        if (me.panelProveedores)
            invalidGrid = !me.panelProveedores.isValid();
        if (me.action == 'addsolicitud') {
            me.down('button[action=aplicar]').setDisabled(invalid || invalidGrid);
            me.down('button[action=aceptar]').setDisabled(invalid || invalidGrid);
        } else {
            me.down('button[action=aplicar]').setDisabled(invalid || invalidGrid || !dirty);
            me.down('button[action=aceptar]').setDisabled(invalid || invalidGrid || !dirty);
        }

    },
    changeLinea: function(idlinea){
        var me = this;
        me.sflinea.mask = new Ext.LoadMask(me.sflinea, {msg: this.etiquetas.msgLoading});
        me.sflinea.mask.show();
        me.sflinea.getStore().load({callback: function(records, operation, success){
            me.sflinea.mask.hide();
            if(success)me.sflinea.setValue(idlinea);
        }})
        me.gridDemandas.setDisabled(false);
        me.gridDemandas.getStore().proxy.extraParams['filter[2][field]']='idlinea';
        me.gridDemandas.getStore().proxy.extraParams['filter[2][data][type]']='idlinea';
        me.gridDemandas.getStore().proxy.extraParams['filter[2][data][value]']=idlinea;
        me.gridDemandas.getStore().load();
        me.gridProductoServiciosSelect.getStore().removeAll();
        me.gridProductoServiciosFinal.getStore().removeAll();
        me.gridProductoServicios.getStore().removeAll();
        me.gridProductoServiciosSelect.setTitle('Productos de la demanda');
        me.gridProductoServiciosSelect.setDisabled(true);
    },
    validateButtons: function(selected){
        var me=this;
        me.down('#agregardemanda').setDisabled(selected.get('seleccionado'));
        me.down('#quitardemanda').setDisabled(!selected.get('seleccionado'));
    }
});
