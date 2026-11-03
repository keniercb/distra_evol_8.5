Ext.OrderChangePanel = Ext.extend(Ext.Panel, {
	frame: true,
	layout: 'border',		
	/*
	*  begin custom public properties
	*/
	orderColumnHeaderText: 'Orden',
	
	gridStore: {},
	
	gridColumns: [],
	
	gridDragable:true,
	
	gridDDText: '1 elemento seleccionado.',
	
	minHeight: 215,
	
	textBtnAccept:'Aceptar',
	
	textBtnCancel:'Cancelar',	
	
	/*
	*  end custom public properties
	*/
	
	//private 
	overwriteGridColumns: function(){
		var cm = this.gridColumns;
		var gc = new Array();
		gc[0] = new Ext.grid.RowNumberer({header:this.orderColumnHeaderText, width:40}); 
		for(var i = 0; i < cm.length; i++)
			if(!(cm[i] instanceof Ext.grid.RowNumberer))
				gc.push(cm[i]);
		return gc;	        
	},
	
	//private
	gridSm: new Ext.grid.RowSelectionModel({singleSelect: true}),
	
	//private
	innerGrid:{},
	
	//private
	hasTitle:false,
	
	//private
	growH:25,
	
	constructor: function(config) {    	    			
		Ext.OrderChangePanel.superclass.constructor.apply(this, arguments);							
	},	
	
	onRender : function(ct, position){	    
	    this.hasTitle = (typeof(this.title) != 'undefined');	    
        Ext.OrderChangePanel.superclass.onRender.apply(this, arguments);
		this.innerGrid = new Ext.grid.GridPanel({
			store:    (this.gridStore)?(this.gridStore):new Ext.data.Store({}),
			columns:  this.overwriteGridColumns(),
			sm:       this.gridSm,
			viewConfig: {
				forceFit: true
			},
			split: true,
			region: 'center'	
		});
		
		if(this.gridDragable){
		    var plugin = new Ext.ux.dd.GridDragDropRowOrder({});
			this.innerGrid.plugins = [plugin];
			this.innerGrid.ddText = (this.gridDDText)?this.gridDDText:'';
			plugin.init(this.innerGrid);
			plugin.on('afterrowmove',function(gDTarget, rsource, rtarget, sel){
				var allRecs = new Array(), i, len = this.store.data.length;
				for(i = 0; i < len; i++){
					allRecs.push(this.store.getAt(i));														
				}					
				this.store.removeAll();
				this.store.add(allRecs);
				this.getSelectionModel().selectRecords(new Array(this.store.getAt(rtarget)));				
			},this.innerGrid);
		}
		
		this.btnUp = new Ext.Button({
		    iconCls:'order-btn-up',						
			disabled:true,
			handler: function(btn, e){
			    var lastRecords = new Array(), i, newSelected;
				var sm = this.innerGrid.getSelectionModel();
				var store = this.innerGrid.getStore();
				var recSel = sm.getSelected();                		
				if(sm.hasPrevious()){					
					store.remove(store.getAt(store.indexOf(recSel)));					
					sm.selectPrevious();
					newSelected = sm.getSelected();
					lastRecords.push(recSel);	
					for(i = store.indexOf(newSelected); i < store.data.length; i++){
						lastRecords.push(store.getAt(i));
						store.remove(store.getAt(i--));						
					}						
					store.add(lastRecords);		
					sm.selectRecords(new Array(recSel));						
				}				
			},
			scope:this
		});
		
		this.btnDown = new Ext.Button({
			iconCls:'order-btn-down',			
			disabled:true,
			handler: function(btn, e){
			    var firstRecords = new Array(), i, newSelected;
				var sm = this.innerGrid.getSelectionModel();
				var store = this.innerGrid.getStore();
				var recSel = sm.getSelected();     
				for(i = 0; i < store.indexOf(recSel); i++)
					firstRecords.push(store.getAt(i));						
				firstRecords.push(store.getAt(i+1));
				firstRecords.push(recSel);i++;
				while(i < store.getCount())
					firstRecords.push(store.getAt(i++));
				store.removeAll();
				store.add(firstRecords);
				sm.selectRecords(new Array(recSel));
			},
			scope:this
		});		
		
		this.updownBtnsCtn = {
            xtype:'panel',		
			region: 'east',
			width: 30,						
			bodyStyle:'padding:'+(((this.innerGrid.store.data.length > 0)?(this.innerGrid.store.data.length*this.growH)/2:this.minHeight/2)-30)+'px 5px 0',			
			items:[this.btnUp,this.btnDown]
		};		
		
		this.innerGrid.getSelectionModel().on('selectionchange',function(sm){			
			if(sm.hasNext() && sm.hasPrevious()){
				this.btnDown.enable();	
				this.btnUp.enable();	
			}
			else if(sm.hasNext() && !sm.hasPrevious()){
				this.btnDown.enable();	
				this.btnUp.disable();	
			}
			else if(!sm.hasNext() && sm.hasPrevious()){
				this.btnDown.disable();	
				this.btnUp.enable();	
			}
			else{
				this.btnDown.disable();	
				this.btnUp.disable();	
			}
		},this);		
		this.add(this.innerGrid,this.updownBtnsCtn);		
		(
			function(me){		
				var possibleH = (me.innerGrid.store.data.length + me.hasTitle)*me.growH;					
				me.setSize(400,(me.minHeight && possibleH > me.minHeight)?possibleH:me.minHeight);
			}
		)(this);
    }    
});
