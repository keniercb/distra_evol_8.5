Ext.define('GestionContrato.view.ConfigPorDefectoWindow', {
    // extend: 'Ext.window.Window',
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.configpordefectowindow',
    margin: false,
    width: 450,
    minWidth: 400,
    // height: 350,
    // maxHeight: 500,
    closable: true,
    modal: true,
    resizable: false,
    initComponent: function () {
        var me=this;
        me.etiquetas = LangMgr.getLang(me);

        me.title=me.etiquetas.qtipPorDefecto;

        me.hfarea = Ext.create('Ext.form.field.Hidden', {
            name: 'idarea',
            context: 'gestioncontratomainwindowarea',
        });

        me.cmbarea = Ext.create('GestionContrato.view.CmbArea', {
            localId: 'idarea',
            name: 'nombrearea',
            fieldLabel: me.etiquetas.lbArea,
            labelAlign:'top',
            flex: 1,
            editable:false,
            context: 'gestioncontratomainwindowarea',
            listeners:{
                select:function(yo, records){
                    // console.log('select:', yo.getValue(), records)
                    if(me.cmbarea.getValue()){
                        me.hfarea.setValue(records[0].data['idarea'])
                    }
                },
                change:function(yo){
                    // console.log('change:', yo.getValue())
                    if(!me.cmbarea.getValue())
                        me.hfarea.reset();
                }
            }
        });

        me.hfareafiltro = Ext.create('Ext.form.field.Hidden', {
            name: 'idareafiltro',
            context: 'gestioncontratomainwindowarea',
        });

        me.cmbareafiltro = Ext.create('GestionContrato.view.CmbArea', {
            localId: 'idareafiltro',
            name: 'nombreareafiltro',
            fieldLabel: me.etiquetas.lbArea,
            labelAlign:'top',
            flex: 1,
            editable:false,
            context: 'gestioncontratomainwindowarea',
            listeners:{
                select:function(yo, records){
                    // console.log('select:', yo.getValue(), records)
                    if(me.cmbareafiltro.getValue()){
                        me.hfareafiltro.setValue(records[0].data['idarea'])
                    }
                },
                change:function(yo){
                    // console.log('change:', yo.getValue())
                    if(!me.cmbareafiltro.getValue())
                        me.hfareafiltro.reset();
                }
            }
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
            labelAlign:'top',
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
        });

        me.stresponsablefiltro = Ext.create('Ext.data.Store', {
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

        me.hfresponsablefiltro = Ext.create('Ext.form.field.Hidden', {
            name: 'idpersonafiltro'
        });

        me.cmbreponsablefiltro = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbResponsableContrato,
            labelAlign:'top',
            name: 'nombrepersonafiltro',
            mode: 'remote',
            minChars: 0,
            pageSize: 10,
            flex: 1,
            autoExpand: false,
            store: me.stresponsable,
            valueField: 'nombreapellidos',
            displayField: 'nombreapellidos',
            queryParam: 'nombreapellidos',
            localId: 'idpersonafiltro',
        });

        me.hfsector = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowsector',
            name: 'idsector'
        });

        me.sfsector = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.textNomSector,
            labelAlign:'top',
            // fieldLabel: me.context == "proveedor" ? me.etiquetas.lbOrganismo:me.etiquetas.lbEsquema,
            name: 'sector',
            mapping: 'NomSector.denominacion',
            localId: 'idsector',
            module: 'Nomencladores',
            gen: 'm',
            filters: {},
            //disabled: true,
            context: 'gestioncontratomainwindowsector',
            flex: 1
        });

        me.hfestadofiltro = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowsector',
            name: 'idestadofiltro'
        });

        me.sfestadofiltro = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbEstado,
            labelAlign:'top',
            // fieldLabel: me.context == "proveedor" ? me.etiquetas.lbOrganismo:me.etiquetas.lbEsquema,
            name: 'estadofiltro',
            mapping: 'NomEstado.nombre',
            localId: 'idestadofiltro',
            module: 'Nomencladores',
            gen: 'm',
            filters: {},
            //disabled: true,
            context: 'gestioncontratomainwindowsector',
            flex: 1
        });

        me.hftipocontrato = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowcontrato',
            name: 'idtipocontrato'
        });

        me.sftipocontrato = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbTypeContract,
            labelAlign:'top',
            name: 'tipocontrato',
            mapping: 'DatTipoContrato.denominacion',
            localId: 'idtipocontrato',
            module: 'TipoContrato',
            noactions: true,
            context: 'gestioncontratomainwindowcontrato',
            controller: 'gestioncontratomainwindow',
            flex: 1
        });

        me.hftipocontratofiltro = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowcontrato',
            name: 'idtipocontratofiltro'
        });

        me.sftipocontratofiltro = Ext.create('Ext.ux.CmbSelectField', {
            fieldLabel: me.etiquetas.lbTypeContract,
            labelAlign:'top',
            name: 'tipocontratofiltro',
            mapping: 'DatTipoContrato.denominacion',
            localId: 'idtipocontratofiltro',
            module: 'TipoContrato',
            noactions: true,
            context: 'gestioncontratomainwindowcontrato',
            controller: 'gestioncontratomainwindow',
            flex: 1
        });

        me.hfvigentefiltro = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowcontrato',
            name: 'idvigenciafiltro'
        });

        me.vigentefiltro=Ext.create('Ext.form.ComboBox',{
            fieldLabel: me.etiquetas.lbVigencia,
            labelAlign:'top',
            name:'vigenciafiltro',
            localId:'idvigenciafiltro',
            valueField: 'id',
            // valueField: 'denominacion',
            displayField: 'denominacion',
            editable:false,
            store:Ext.create('Ext.data.Store',{
                fields:['denominacion', 'idvigenciafiltro'],
                data:[
                    {'denominacion': 'Vigente', 'idvigenciafiltro':1},
                    {'denominacion': 'Fuera de vigencia', 'idvigenciafiltro':2}
                ]
            }),
            listeners:{
                select: function(combo, records){
                    me.hfvigentefiltro.setValue(records[0].data.idvigenciafiltro);
                }
            }
        });

        me.hfclientefiltro = Ext.create('Ext.form.field.Hidden', {
            context: 'gestioncontratomainwindowcontrato',
            name: 'idclientefiltro'
        });

        me.clientefiltro=Ext.create('Ext.form.ComboBox',{
            fieldLabel: me.etiquetas.lbCliente,
            labelAlign:'top',
            name:'clientefiltro',
            valueField: 'denominacion',
            displayField: 'denominacion',
            editable:false,
            store:Ext.create('Ext.data.Store',{
                fields:['denominacion', 'idclientefiltro'],
                data:[
                    {'denominacion': 'Contrato cliente', 'idclientefiltro':1},
                    {'denominacion': 'Contrato proveedor', 'idclientefiltro':0}
                ]
            }),
            listeners:{
                select: function(combo, records){
                    me.hfclientefiltro.setValue(records[0].data.idclientefiltro);
                }
            }
        });

        me.idconfig = Ext.create('Ext.form.field.Hidden', {
            name: 'idvalorespordefecto'
        });

        Ext.define('ContainerCampo',{
            extend: 'Ext.container.Container',
            margin:'3 10 3 10',
            layout:'hbox',
            defaults:{labelAlign:'top'},
            initComponent: function () {
                var self=this;

                self.callParent();
                self.items.items[0].on('change', function(yo, valor){
                    self.down('#boton_limpiar').setDisabled(!yo.getValue())
                });
                self.add(
                    {
                        xtype:'button',
                        tooltip:'Limpiar valor por defecto',
                        itemId:'boton_limpiar',
                        iconCls:'icondistra-limpiar icon-medium',
                        disabled: true,
                        margin: '18 0 5 0',
                        ui: 'default-toolbar-small',
                        handler:function(){
                            self.queryBy(function(x){
                                if(x.xtype!='button')
                                    if(Ext.isFunction(x.setValue))
                                        x.setValue('');
                            })
                        }
                    }
                );
            }
        });

        me.items=
            {
                xtype:'form',
                frame:true,
                trackResetOnLoad:true,
                defaults:{
                    anchor:'100%',
                    labelWidth:140,
                    layout:'anchor',
                    defaults:{
                        anchor:'100%',
                    }
                },
                items:[
                    {
                        xtype:'fieldset',
                        title:'Datos iniciales al adicionar',
                        items:[
                            Ext.create('ContainerCampo',{
                                items:[me.cmbarea, me.hfarea]
                            }),
                            // Ext.create('ContainerCampo',{
                            //     items:[me.cmbreponsable, me.hfresponsable]
                            // }),
                            Ext.create('ContainerCampo',{
                                items:[me.sfsector, me.hfsector]
                            }),
                            Ext.create('ContainerCampo',{
                                items:[me.sftipocontrato, me.hftipocontrato]
                            }),
                        ]
                    },
                    {
                        xtype:'fieldset',
                        title:'Filtros por defecto',
                        layout:'anchor',
                        defaults:{anchor:'100%'},
                        items:[
                            Ext.create('ContainerCampo',{
                                items:[me.cmbareafiltro, me.hfareafiltro]
                            }),
                            // Ext.create('ContainerCampo',{
                            //     items:[me.cmbreponsablefiltro, me.hfresponsablefiltro]
                            // }),
                            Ext.create('ContainerCampo',{
                                items:[me.sfestadofiltro, me.hfestadofiltro]
                            }),
                            Ext.create('ContainerCampo',{
                                items:[me.sftipocontratofiltro, me.hftipocontratofiltro]
                            }),
                            {
                                xtype: 'container',
                                anchor:'100%',
                                layout: {
                                    type: 'hbox',
                                    align: 'stretch'
                                },
                                // margin:'3 10 3 10',
                                items:[
                                    Ext.create('ContainerCampo',{
                                        margin:'0 10 0 10',
                                        flex:1,
                                        items:[me.hfvigentefiltro, me.vigentefiltro]
                                    }),
                                    Ext.create('ContainerCampo',{
                                        margin:'0 10 0 10',
                                        flex:1,
                                        items:[me.hfclientefiltro, me.clientefiltro]
                                    })
                                ]
                            }
                        ]
                    },

                    me.idconfig
                ]
        };

        me.callParent();
    }
});