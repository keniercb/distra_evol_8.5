/**
 *@autor Lester
 * Componente para proveer los reportes a los procesos
 *
 **/
//if (!Ext.LOG.COMUN)
    Ext.ns('Ext.LOG.COMUN');

Ext.LOG.COMUN.Reportes = Ext.extend(Ext.Window, {
    
    constructor         :function (config) {
        config = config || {};
		this.title = 'Seleccionar reportes a imprimir.';
		this.width = config.width || 500;
        this.height = config.height || 130;
        this.minWidth =300;
        this.minHeight = 130;
        this.layout= 'fit';
        this.plain=true;
        this.bodyStyle='padding:5px;';
        this.id = 'win_reportes_';
        this.closable = config.closable || true;
        this.stFormatos = new Ext.data.JsonStore({
			url         :'/logistica/comun/views/js/formatosreportes.json',
			fields      :[
							{name:'idformato', type:'string'},
							{name:'formato', type:'string'}
						]
		});		
		this.cbFormatos = new Ext.form.ComboBox({
			scope:this,
			id           :'idcbFormatos',
			hiddenName   :'Formatos',
			valueField   :'idformato',
			displayField :'formato',
			store        :this.stFormatos,
			autoCreate   :true,
			typeAhead    :true,
			triggerAction:'all',
			readOnly     :true,
			mode         :'local',
			anchor:'100%',
			fieldLabel :'Formatos'
		});
		this.stFormatos.load();
		this.stReportes = new Ext.data.JsonStore({
		scope:this,
		fields:[
			   {name: 'idreporte'},
			   {name: 'denominacion'},
			   {name: 'url'}
			],
			listeners:{
			load:{
			scope:this,
				fn:function(){
					if(this.stReportes.getCount() == 1){
						this.cbReportes.setValue(this.stReportes.getAt(0).data.url);
						this.cbReportes.disable();
					}
					else
						this.cbReportes.enable();
				
				}
			}
		}
		});
		this.cbReportes = new Ext.form.ComboBox({
			scope:this,
			id           :'idcbReportes',
			hiddenName   :'reportes',
			valueField   :'url',
			displayField :'denominacion',
			store        :this.stReportes,
			autoCreate   :true,
			typeAhead    :true,
			triggerAction:'all',
			readOnly     :true,
			mode         :'local',
			anchor:'100%',
			fieldLabel :'Reportes'
		});
		this.stReportes.loadData(config.reportes);
		this.buttons = [
                {
                    scope  :this,
                    text   :'Aceptar',
                    iconCls:'aceptar',
                    handler:function () {
					url = this.cbReportes.getValue();

					params=(this.parametros)?this.parametros : {};
						this.doAction(url,this.cbFormatos.value,params);
                        this.close();
                    }
                }
		];
		
		
		
        this.closeAction = config.closeAction || 'close';	
		this.fpReportes = new Ext.FormPanel({	
			scope:this,
			baseCls: 'x-plain',
			labelWidth: 55,
			items:[this.cbFormatos ,this.cbReportes]
		});
		this.items = [this.fpReportes];
		Ext.applyIf(this, config);
        Ext.LOG.COMUN.Reportes.superclass.constructor.call(this, config);
		this.stFormatos.on(
		{
			'load':{
				scope:this,
				fn   :function (Store,records) {
					this.cbFormatos.setValue('pdf');
				}
			}
		});
    }
});
