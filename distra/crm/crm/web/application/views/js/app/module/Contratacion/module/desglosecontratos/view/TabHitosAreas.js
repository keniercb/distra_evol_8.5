Ext.define('DesgloseContrato.view.TabHitosAreas', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.dc_tabhitoarea',
    itemId: 'tabpanelhitos',
    initComponent: function(){
        var me=this;
        this.etiquetas = LangMgr.getLang(this);
        if(!me.title)me.title= me.etiquetas.lbTitleHitoAreas;

        me.items=[
            Ext.create('DesgloseContrato.view.GridHitosAreas',{
                itemId: 'gridhitosareas',
                flex:1
            }),
            Ext.create('DesgloseContrato.view.GridHitosAreasMonedas',{
                itemId: 'gridhitosareasmonedas',
                flex:1,
                extrafields: me.extrafields
            })
        ];

        me.callParent();
    },
    listeners:{
        render: function(yo){
            yo.down('#gridhitosareas').getStore().on('load', function(store, records, success){
                if(success){
                    yo.down('#gridhitosareasmonedas').setDisabled(false);
                    if(records.length>0){
                        if(!records[0].raw.disribucionmonedas){
                            yo.setActiveTab('gridhitosareas');
                            yo.down('#gridhitosareasmonedas').setDisabled(true);
                        }else{
                            yo.setActiveTab('gridhitosareasmonedas');
                            yo.down('#gridhitosareasmonedas').getStore().load();
                        }
                    }
                }
            })
        }
    },
    establecerMontoTotal: function(montototal){
        this.down('#gridhitosareas').montototal=montototal;
        this.down('#gridhitosareasmonedas').montototal=montototal;
    },
    cargarGrids: function(idhito){
        var me=this,
            storehitoarea=me.down('#gridhitosareas').getStore(),
            storehitoareamonedas=me.down('#gridhitosareasmonedas').getStore();
        storehitoarea.filters.removeAtKey('idhito');
        storehitoareamonedas.filters.removeAtKey('idhito');
        storehitoareamonedas.filter({
            id: 'idhito',
            property: 'idhito',
            value: idhito
        });
        storehitoarea.filter({
            id: 'idhito',
            property: 'idhito',
            value: idhito
        });
    },
    configurarMonedasHito: function(record){
        var me=this,
            monedas={};
        if(me.extrafields){
            me.extrafields.forEach(function(x){
                monedas[x.codigoiso.toLowerCase()+'_'+x.idmoneda]=record.get('montomoneda_'+ x.codigoiso.toLowerCase()+'_'+x.idmoneda);
            })
        }
        // console.log('monedas:', monedas)
        me.down('#gridhitosareasmonedas').montosmonedas=monedas;
    },
})