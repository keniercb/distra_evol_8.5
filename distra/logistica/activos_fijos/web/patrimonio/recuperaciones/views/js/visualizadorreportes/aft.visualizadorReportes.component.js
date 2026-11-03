
Ext.ns('aft.visualizadorReportes');
aft.visualizadorReportes.component = Ext.extend(Ext.Viewport, {
    constructor: function(config) {
        Ext.apply(this, config);		
        var _this = this;         
        this.layout = 'border';
		this.frame = true;
		
		
		Ext.apply(Ext.form.VTypes, {
			daterange : function(val, field) {
				var date = field.parseDate(val);

				if(!date){
					return;
				}
				if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
					var start = Ext.getCmp(field.startDateField);
					start.setMaxValue(date);
					start.validate();
					this.dateRangeMax = date;
				} 
				else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
					var end = Ext.getCmp(field.endDateField);
					end.setMinValue(date);
					end.validate();
					this.dateRangeMin = date;
				}        
				return true;
			},
			dateRangeText : 'Range not valid!'
		});
		
        this.dfFechaStart = new Ext.form.DateField({
            fieldLabel: 'Fecha inicio',
			anchor: '70%',
			id: 'startdt',
			vtype: 'daterange',
			endDateField: 'enddt',
            name: 'dffechastart'
        });
		
        this.dfFechaEnd = new Ext.form.DateField({
            fieldLabel: 'Fecha fin',
			anchor: '70%',
			id: 'enddt',
			vtype: 'daterange',
			startDateField: 'startdt',
            name: 'dffechaend'
        });        

        this.storeEntidad = new Ext.data.Store({
            url: 'getEntidad',
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data'
            }, [
                {
                    name: 'idpais'
                },
                {
                    name: 'nombrepais'
                }
            ])
        });

        
        this.comboEntidad = new Ext.form.ComboBox({
            anchor: '70%',
            fieldLabel: 'Entidad',
			//fieldLabel: _this.idioma.lbCmNacionalidad,
            name: 'idpais',
            valueField: 'idpais',
            displayField: 'nombrepais',
            tpl: '<tpl for="."><div ext:qtip="{nombrepais}" class="x-combo-list-item">{nombrepais}</div></tpl>',
            store: _this.storeEntidad,
            listWidth: 300,
            pageSize: 10,
            minChars: 0,
            resizable: true,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            emptyText: _this.idioma.lbCbVacio,
            mode: 'local',
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });
		
		 this.storeReportes = new Ext.data.Store({
            url: 'getReportes',
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data'
            }, [
                {
                    name: 'idpais'
                },
                {
                    name: 'nombrepais'
                }
            ])
        });
		this.comboReportes = new Ext.form.ComboBox({
            anchor: '70%',
            fieldLabel: 'Reportes',
            name: 'idpais',
            valueField: 'idpais',
            displayField: 'nombrepais',
            tpl: '<tpl for="."><div ext:qtip="{nombrepais}" class="x-combo-list-item">{nombrepais}</div></tpl>',
            store: _this.storeReportes,
            listWidth: 300,
            pageSize: 10,
            minChars: 0,
            resizable: true,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            emptyText: _this.idioma.lbCbVacio,
            mode: 'local',
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.buttons[2].handler();
                    }
                }
            }
        });		
		this.btnImprimir = { tooltip:'Imprimir',iconCls:'print', handler: function(btn){			
			_this.fVisualizador( 'Imprimir' );
		}};
		this.btnPDF = { tooltip:'PDF', iconCls:'pdf', handler: function(){			
			_this.fVisualizador('PDF');
		}};
		this.btnHTML = { tooltip:'HTML', iconCls:'html',  handler: function(){			
			_this.fVisualizador('HTML');
		}};
		this.btnExcel = { tooltip:'Excel', iconCls:'excel', handler: function(){			
			_this.fVisualizador('Excel');
		}};			
		this.btnVisualizador = {  tooltip:'Visualizar reporte', iconCls:'visualizador', handler: function(){			
			_this.fVisualizador('Visualizador');
		}};
		
		this.panel = new Ext.Panel({         
			region:'center',					
			tbar:[ _this.btnImprimir , '-' , _this.btnPDF , '-' , _this.btnHTML, '-' , _this.btnExcel , '-' ]		
		});		
		this.report = new Ext.ux.panel.PDF({           
			region:'south',
			split:true,
            height: 440,                     
			bodyStyle:'padding:10px;',
			margins:'5px 5px 10px 5px',
			width: 200,
            pageScale: 0.75,			
			src      : 'http://localhost/ext_ux_pdf_panel-master/web.pdf'			
        });
		/*this.report = new Ext.Panel({       
			region:'south',
			split:true,
            height: 440,                     
			bodyStyle:'padding:10px;',
			margins:'5px 5px 10px 5px',
			width: 200, 			
			bodyCfg: {
				tag: 'center',
				cls: 'x-panel-body',
				html: '<iframe width="100%" height="100%" src="http://directorio.uci.cu/"></iframe>'
			}
		});	*/
		
        _this.crearFormulario();
        this.items = [_this.form , _this.panel ,this.report];
        aft.visualizadorReportes.component.superclass.constructor.apply(this, arguments);
    },
	fVisualizador: function( type ){
	    var _this = this;
		_this.data = {
        name: 'Jack Slocum',
        company: 'Ext JS, LLC',
        address: '4 Red Bulls Drive',
        city: 'Cleveland',
        state: 'Ohio',
        zip: '44102',
        kids: [{
            name: 'Sara Grace',
            age:3
        },{
            name: 'Zachary',
            age:2
        },{
            name: 'John James',
            age:0
        }]
    };
		var tpl = new Ext.Template(
			'<p>Name: '+ type +'</p>',
			'<p>Name: {name}</p>',
			'<p>Company: {company} </p>',
			'<p>Address: {address}</p>',
			'<p>Location: {city},{state}</p>'			
		);				
		tpl.overwrite(_this.report.body, _this.data);
		_this.report.body.highlight('#c3daf9', {block:true});//#c3daf9	
	},
    crearFormulario: function() {+6
        var _this = this;		
        this.form = new Ext.FormPanel({
            frame: true,
			region:'north',        
			tbar:['->',{text:'Ayuda'/*,tooltip:_this.lbTtBtnAyudaTransp*/}],
			split:true,
            height: 130,		
            minSize: 130,
            maxSize: 150,              
            margins:'0 0 0 0',
            items: [
                {
                    layout: 'column',
                    border: false,
					bodyStyle:'padding:5px;margins:5px 5px 5px 5px',
                    defaults: {
                        columnWidth: '.5',
                        border: false
                    },
                    items: [
                        {
                            layout: 'form',
                           // labelAlign: 'top',                            
                            items: [
                                _this.comboReportes, _this.dfFechaStart,
                               
                            ]
                        },
                        {
                            layout: 'form',
                           // labelAlign: 'top',                           
                            items: [
                                _this.comboEntidad, _this.dfFechaEnd
                            ]
                        }
                    ]
                }
            ],
			bbar:[ '->','-',_this.btnVisualizador ]
        });
    }    
})

