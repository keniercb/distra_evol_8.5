Ext.grid.CheckColumn = function(config){
    this.EVENT_MANAGER = new Ext.util.Observable();
    this.EVENT_MANAGER.addEvents({
        "checkchange"	:true
    });
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype ={

	//Especificar si se desea en la cabecera una check para marcar todos.
	columnHeaderCheckbox: false,
	
	//Especificar si se desea que se seleccione el grid cuando ocurran cambios.
	selectGrid : false,

	//Especificar la posición del check.
	posicionHeaderCheckbox : 'left',
	
    init : function(grid){
		var me  = this;
		
        this.grid = grid;
        
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
			if(me.columnHeaderCheckbox){
				Ext.fly(view.innerHd).on('mousedown', this.onHdMouseDown, this);
			}
        }, this);
		
		if(me.columnHeaderCheckbox){
			me.sortable = false;
			me.menuDisabled = true;
			var storeGrid = this.grid.getStore();
			
			storeGrid.on("datachanged", function(){
				me.updateColumnHeaderCheckbox(me);
			});
			
			storeGrid.on("update", function(){
				me.updateColumnHeaderCheckbox(me);
			});
			
			switch(me.posicionHeaderCheckbox){
				case 'top': {
					me.header = '<div width = "30" id = "'+me.id+'-div-check" class="x-grid3-check-col">&#160;</div>'+(me.header?me.header:'');
					break;
				}
				case 'button': {
					me.header = (me.header?me.header:'')+'<div width = "30" id = "'+me.id+'-div-check" class="x-grid3-check-col">&#160;</div>';
					break;
				}
				case 'right': {
					me.header = (me.header?me.header:'')+'<span width = "30" id = "'+me.id+'-div-check" class="x-grid3-check-col">&#160;&#160;&#160;&#160;&#160;&#160;&#160;</span>';
					break;
				}
				default:{
					me.header = '<span width = "30" id = "'+me.id+'-div-check" class="x-grid3-check-col">&#160;&#160;&#160;&#160;&#160;&#160;&#160;</span>'+(me.header?me.header:'');
				}
			}
		}
		
    },
	
	onHdMouseDown : function(e, t){//Se ejecuta cuando se hace click en header.
		var me = this;
        if(t.className.trim() == 'x-grid3-check-col' || t.className.trim() == 'x-grid3-check-col-on'){
            e.stopEvent();
            var hd = Ext.fly(t);
            var isChecked = hd.hasClass('x-grid3-check-col-on');
            if(isChecked){
				me.changeColumnHeaderCheckbox(t, false);
				if(me.selectGrid){
					 this.grid.getSelectionModel().clearSelections();
				}
            }else{
				me.changeColumnHeaderCheckbox(t, true);
				if(me.selectGrid){
					 this.grid.getSelectionModel().selectAll();
				}
            }
			me.toggleSortState();
        }
    },
	
	changeColumnHeaderCheckbox:	function(headerCheck, check){
		var hd = Ext.fly(headerCheck);
		if(check){
			hd.removeClass('x-grid3-check-col');
			hd.addClass('x-grid3-check-col-on');
		}else{
			hd.removeClass('x-grid3-check-col-on');
			hd.addClass('x-grid3-check-col');
		}
	},
	
	updateColumnHeaderCheckbox: function(column){
		//Se obtiene si se han seleccionado todos.
        var allTrue = this.getStoreIsAllChecked(column.grid.getStore(), column.dataIndex);
		//Se obtiene el div del check.
		var headerChek = Ext.getDom(column.id+'-div-check');
		//Se actualiza el check del header.
		column.changeColumnHeaderCheckbox(headerChek, allTrue);
    },
	
	getStoreIsAllChecked: function(store, dataIndex){//Devuelve true si todos los registros estan seleccionados.
        var allTrue = true;
        store.each(function(record){
            if(!record.get(dataIndex))
                allTrue = false;
        });
        return allTrue;
    },
	
	toggleSortState: function(){
        var me = this;
        if(me.columnHeaderCheckbox){
            var store = me.grid.getStore();
            var allTrue = this.getStoreIsAllChecked(store, me.dataIndex);
			
            store.each(function(record){
                record.set(me.dataIndex, !allTrue);
                record.commit();
				me.EVENT_MANAGER.fireEvent('checkchange', record, record.data[this.dataIndex]);
            });
        }else
            me.callParent(arguments);
    },
	
    onMouseDown : function(e, t){
		var me = this;
        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
			record.commit();
			if(me.selectGrid){
				 this.grid.getSelectionModel().selectRecords([record]);
			}
            this.EVENT_MANAGER.fireEvent('checkchange',record,record.data[this.dataIndex]);
        }
    },

    on:function(evt_name,fn,scope){
        this.EVENT_MANAGER.on(evt_name,fn,scope);
    },

    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td'; 
        return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
    }
};