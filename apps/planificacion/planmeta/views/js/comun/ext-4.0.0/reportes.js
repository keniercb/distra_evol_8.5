    store1 = Ext.create('Ext.data.JsonStore', {
        fields: ['name', 'data1'],
         data: [{name:'Enero',data1:35},{name:'Febrero',data1:35},{name:'Marzo',data1:15},{name:'Abril',data1:90},
				{name:'Mayo',data1:30},{name:'Junio',data1:30},{name:'Julio',data1:0},{name:'Agosto',data1:0},
				{name:'Septiembre',data1:0},{name:'Octubre',data1:0},{name:'Noviembre',data1:20},{name:'Diciembre',data1:20},
		 ]
    });
		
	 store2 = Ext.create('Ext.data.JsonStore', {
        fields: ['name', 'data1'],
        data: [{name:'Boniato',data1:30},{name:'Papa',data1:30},{name:'Frijol',data1:15},{name:'Vacio',data1:90}]
    });
    
    store = Ext.create('Ext.data.TreeStore', {
        fields: ['name', 'data1'],
        data: [{name:'Boniato',data1:30},{name:'Papa',data1:30},{name:'Frijol',data1:15},{name:'Vacio',data1:90}]
    });

     tree = Ext.create('Ext.tree.Panel', {
        store: new Ext.tree.TreeLoader({dataUrl:'cargarEntidades',
            preloadChildren: false,
            listeners:{               
                beforeload:function(tree,node,res){
                   // tree.baseParams.valor=Ext.getCmp('idfiltroentidad').getValue();
                } 
                  
            }
            }),
        rootVisible: false,
        useArrows: true,
        frame: true,
        title: 'Check Tree',
        renderTo: 'tree-div',
        width: 200,
        height: 250,
        dockedItems: [{
            xtype: 'toolbar',
            items: {
                text: 'Get checked nodes',
                handler: function(){
                    var records = tree.getView().getChecked(),
                        names = [];
                    
                    Ext.Array.each(records, function(rec){
                        names.push(rec.get('text'));
                    });
                    
                    Ext.MessageBox.show({
                        title: 'Selected Nodes',
                        msg: names.join('<br />'),
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }]
    });
Ext.create('Ext.container.Viewport', {
    layout: 'fit',
    items: [{
		layout: 'border',
        region: 'west',
        title: 'Reporte',        
		items:[{
				region: 'west',
				collapsible: true,
				xtype:'panel',
				title: 'Entidades',
				width: 240,
				items:tree
					
			},{
				region: 'center',
				xtype: 'tabpanel', // TabPanel itself has no title
				activeTab: 0,      // First tab active by default
				items: [{
						title: 'Plan de rotacion y siembra'						
					},{
						title: 'Plan de produccion'
					},{
						title: 'Aprovechamiento de los suelos',
						items: {
							id: 'chartCmp',
							xtype: 'chart',
							width: 800,
							height: 800,
							style: 'background:#fff',
							animate: true,
							shadow: true,
							store: store1,
							axes: [{
								type: 'Numeric',
								position: 'left',
								fields: ['data1'],
								label: {
									renderer: Ext.util.Format.numberRenderer('0,0')
								},
								title: 'Areas',
								grid: true,
								minimum: 0,								
							}, {
								type: 'Category',
								position: 'bottom',
								fields: ['name'],
								title: 'Meses'
							}],
							series: [{
								type: 'column',
								axis: 'left',
								highlight: true,
								tips: {
								  trackMouse: true,
								  width: 140,
								  height: 50,
								  renderer: function(storeItem, item) {
									this.setTitle(  'Area: ' + storeItem.get('data1') + ' ha');
								  }
								},
								label: {
								  display: 'insideEnd',
								  'text-anchor': 'middle',
									field: 'data1',
									renderer: Ext.util.Format.numberRenderer('0'),
									orientation: 'vertical',
									color: '#333'
								},
								xField: 'name',
								yField: 'data1'
							}]
						}
					},{
						title: 'Productos por campos',
						items:{
							xtype: 'chart',
							width: 800,
							height: 800,
							id: 'chartCmp',
							animate: true,
							store: store2,
							shadow: true,
							legend: {
								position: 'right'
							},
							insetPadding: 60,
							theme: 'Base:gradients',
							series: [{
								type: 'pie',
								field: 'data1',
								showInLegend: true,
								donut: 10,
								tips: {
								  trackMouse: true,
								  width: 140,
								  height: 28,
								  renderer: function(storeItem, item) {
										this.setTitle(storeItem.get('name') + ': ' +storeItem.get('data1')+' ha');
								  }
								},
								highlight: {
								  segment: {
									margin: 20
								  }
								},
								label: {
									field: 'name',
									display: 'rotate',
									contrast: true,
									font: '18px Arial'
								}
							}]
						}
					   
				}]
			}]
        // could use a TreePanel or AccordionLayout for navigational items
    }]
});
