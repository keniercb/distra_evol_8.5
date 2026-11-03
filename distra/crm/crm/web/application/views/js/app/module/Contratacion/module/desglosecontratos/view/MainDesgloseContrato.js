Ext.define('DesgloseContrato.view.MainDesgloseContrato', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dc_main',
    frame: false,
    margin: false,
    border: false,
    initComponent: function () {
        var me=this;
        this.etiquetas = LangMgr.getLang(this);
        this.title = this.etiquetas.moduleName;
        this.layout = 'border';
        this.closable = true;

        this.contratogrid = Ext.create('GestionContrato.view.gridContratos', {
            storeId: 'stGridContratosDesglose',
            frame: false,
            margin: false,
            border: false,
            split: true,
            title: this.etiquetas.lbTitleContrato,
            region: 'west',
            collapsible: true,
            resizable: true,
            minWidth: window.innerWidth*0.3,
            maxWidth: window.innerWidth*0.9,
            // width: window.innerWidth*0.4,
            flex:1,
            selType: 'rowmodel',
            lokedColumns: false,
            module: 'DesgloseContrato',
            columnasVisibles: [
                'numerocontrato', 'clienteproveedor', 'montototal', 'fechafirma',
                'estadoinicial', 'vigente'
                // 'nombrearea', 'sector', 'tipocontrato','fechainicio',
                // 'vigente', 'contratomarco', 'cliente', 'fechafin', 'numero',
            ],
           /* functionBeforeLoad: function(){
                console.log('esta correindo', me.contratogrid)
                console.log('esta correindo2', me.contratogrid.down('#fechainicio').getValue(),me.contratogrid.down('#fechainicio'))
                var fechainicio=me.contratogrid.down('#fechainicio').getValue(),
                    fechafin=me.contratogrid.down('#fechafin').getValue();
                if(!fechainicio){
                    var hoy=new Date(),
                        fechainicio=new Date(hoy.getFullYear(), hoy.getMonth(), 1),
                        fechafin=new Date(hoy.getFullYear(), hoy.getMonth()+1, 0);
                }
                with(me.contratogrid.store.proxy){
                    extraParams['filter[50][field]']='rangofechahito';
                    extraParams['filter[50][data][type]']='date';
                    extraParams['filter[50][data][comparison]']='gt';
                    extraParams['filter[50][data][value]']=fechainicio;
                    extraParams['filter[51][field]']='rangofechahito';
                    extraParams['filter[51][data][type]']='date';
                    extraParams['filter[51][data][comparison]']='lt';
                    extraParams['filter[51][data][value]']=fechafin;
                }
            },*/
              filtrosFijos: {
                // 'cliente': {'type': 'list', 'value': '[1]'},
                // 'vigente': {'type': 'list', 'value': '[1]'},
                // 'contratomarco': {'type': 'list', 'value': '[0]'},
                'cliente': {'type': 'boolean', 'value': true},
               // 'vigente': {'type': 'boolean', 'value': true},
                'contratomarco': {'type': 'boolean', 'value': false},
                'accion_estado': {'type': 'other', 'value': 'endedwork'},
                // 'filtrodetrabajoterminado': {'type': 'other', 'value': true},
//                 'montototal':{'type': 'numeric', 'value': 0, 'comparison': 'gt'}
            }
            // width: 300
        });
        this.contratogrid.down('#topBar').add(
            Ext.create('Ext.ux.RangoFechasFilter',{
               // buttonLimpiar: false,
               // buttonLimpiarCampos: false,
               // initialValue: 'mesActual',
                parametroFiltro: 'rangofechahito',
                grid: me.contratogrid
            })
            // Ext.create('Ext.ux.SelectAdvancedField',{
            //     // xtype: 'selectadvancedfield',
            //     valueField: 'id',
			      //       fieldLabel: 'Contratos con Hitos',
            //     emptyText: 'Seleccione el mes',
            //     width: 350,
                // fieldLabel: 'Mes',
                // editable: false,
            //    store: Ext.create('Ext.data.Store',{
            //        fields:['text', {name:'id', type: 'string'}],
            //        data:[
            //            {text: 'Enero', id: '01'},
            //            {text: 'Febrero', id: '02'},
            //            {text: 'Marzo', id: '03'},
            //            {text: 'Abril', id: '04'},
            //            {text: 'Mayo', id: '05'},
            //            {text: 'Junio', id: '06'},
            //            {text: 'Julio', id: '07'},
            //            {text: 'Agosto', id: '08'},
            //            {text: 'Septiembre', id: '09'},
            //            {text: 'Octubre', id: '10'},
            //            {text: 'Noviembre', id: '11'},
            //            {text: 'Diciembre', id: '12'},
            //        ]
            //    }),
            //    listeners:{
            //        search: function(field){
            //            with(me.contratogrid.getStore()) {
            //                proxy.extraParams['filter[120][field]'] = 'hitomes';
            //                proxy.extraParams['filter[120][data][type]'] = 'other';
            //                proxy.extraParams['filter[120][data][value]'] = field.getValue();
            //                load();
            //            }
            //        },
            //        clear: function(){
            //            with(me.contratogrid.getStore()) {
            //                delete proxy.extraParams['filter[120][field]'];
            //                delete proxy.extraParams['filter[120][data][type]'];
            //               delete proxy.extraParams['filter[120][data][value]'];
            //                load();
            //            }
             //       }
            //    }
           // })
        );
        this.contratogrid.down('#topBar').add(
            Ext.create('GestionContrato.view.SearchCmbArea', {
                name: 'filtroarea',
                hideLabel: true,
				fieldLabel: 'Buscar áreas',
                maxWidth: 250,
                minWidth: 150,
                flex:1,
                editable: false,
                searchTooltip: 'Buscar áreas',
                clearTooltip: 'Limpiar filtro',
                emptyText: 'Seleccione el \xE1rea...',
                listeners:{
                    onclick2: function(cmb){
                        var filter=me.contratogrid.filters.getFilter('idarea');
                        filter.setValue([]);
                        filter.setActive(false);
                        cmb.tree.selModel.deselectAll();
                    },
                    onclick3: function(cmb){
                        var filter=me.contratogrid.filters.getFilter('idarea');
                        filter.init();
                        filter.setValue(cmb.idValue);
                        filter.setActive(true);
                        filter.setActive(true);
                    }
                }
            })
        );

        // this.hitogrid = Ext.create('DesgloseContrato.view.GridHitos',{
        //    region:'center',
        //});

//         Ext.define("progressBarCustom", {
//             extend: 'Ext.ProgressBar',
//             alias: 'widget.progressBarCustom',
//             max: null,
//             ave: null,
//             min: null,
//             color: null,
//             animate: {
//                 from: {height: 20, width: 0},
//                 to: {height: 20, width: 30},
//                 duration: 200
//             },
//             initComponent: function () {
//                 var me = this;
//                 me.width = 150;
//                 me.margin = '5 5 0 5';
//                 me.text = me.texto;
//                 me.callParent(arguments);
//             },

//             listeners: {
//                 render: function (obj, val) {
//                     //if (this.max != null && this.ave != null && this.min != null) {
//                     //    if (val  <= this.min) {
//                     //        obj.getEl().child(".x-progress-bar", true).style.backgroundColor = "#32CD32";
//                     //        obj.getEl().child(".x-progress-bar", true).style.borderRightColor = "#32CD32";
//                     //        obj.getEl().child(".x-progress-bar", true).style.backgroundImage = "url('')";
//                     //    } else if (val  <= this.ave) {
//                     //        obj.getEl().child(".x-progress-bar", true).style.backgroundColor = "#FFD700";
//                     //        obj.getEl().child(".x-progress-bar", true).style.borderRightColor = "#FFD700";
//                     //        obj.getEl().child(".x-progress-bar", true).style.backgroundImage = "url('')";
//                     //    } else {
//                     //        obj.getEl().child(".x-progress-bar", true).style.backgroundColor = "#FF0000";
//                     //        obj.getEl().child(".x-progress-bar", true).style.borderRightColor = "#FF0000";
//                     //        obj.getEl().child(".x-progress-bar", true).style.backgroundImage = "url('')";
//                     //    }
//                     //} else
//                     if (this.color != null) {
//                         obj.getEl().child(".x-progress-bar", true).style.backgroundColor = this.color;
//                         obj.getEl().child(".x-progress-bar", true).style.borderRightColor = this.color;
//                         obj.getEl().child(".x-progress-bar", true).style.backgroundImage = "url('')";
//                     }
//                 }
//             }
//         });

        // this.hitoareasgrid = Ext.create('DesgloseContrato.view.GridHitosAreas',{
        //     title: me.etiquetas.lbTitleHitoAreas,
        //     itemId: 'mainhitosareas',
        //     region:'south',
        //     collapsible: true,
        //     flex:1
        // });

        // this.btnCheckIn = Ext.create('Ext.Button', {
        //     iconCls: 'detalles',
        //     action: 'checkin',
        //     selector: 'btnCheckIn',
        //     hidden: false,
        //     disabled: true,
        //     text: this.etiquetas.lbBtnCheckIn,
        //     tooltip: this.etiquetas.qtipCheckIn
        // });

        this.items = [
            this.contratogrid,
            {
                xtype: 'panel',
                region: 'center',
                layout: 'border',
                flex:1,
//                 resizable: true,
                items: [
                    Ext.create('DesgloseContrato.view.GridHitos',{
                        region:'center',
                        itemId: 'mainhitos',
                        module: 'DesgloseContrato',
                    }),
                    {
                        xtype: 'tabpanel',
                        title: me.etiquetas.lbTitleHitoAreas,
                        itemId: 'tabpanelmain',
                        region:'south',
                        collapsible: true,
                        flex:1,
                        items:[
                            Ext.create('DesgloseContrato.view.GridHitosAreas',{
                                itemId: 'mainhitosareas',
                                flex:1
                            }),
                            Ext.create('DesgloseContrato.view.GridHitosAreasMonedas',{
                                itemId: 'mainhitosareasmonedas',
                                flex:1
                            })
                        ]
                    }
                ]
            }
        ];

        this.callParent();
    }
});
