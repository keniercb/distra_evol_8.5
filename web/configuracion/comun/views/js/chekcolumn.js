//~ 

  Ext.grid.CheckColumn = function(config) {
	this.align = 'center';
	this.addEvents({
		beforecheked : true,
		checked : true,
		disable : true,
		unchecked : true,
		click: true
	});

	Ext.grid.CheckColumn.superclass.constructor.call(this);
    
    Ext.apply(this, config, {
			header : "",
			width : 20,
			sortable : false,
			fixed : true,
			dataIndex : '',

			init : function(grid) {
			    this.grid = grid;
				this.grid.on('render', function() {
							var view = this.grid.getView();
							view.mainBody.on('mousedown', this.onMouseDown,
									this);
						}, this);
			},

			onMouseDown : function(e, t) {
			 	var index = this.grid.getView().findRowIndex(t);
                if (t.id == (index + 'x-grid3')) {
					e.stopEvent();
					var record = this.grid.store.getAt(index);
					if (!this.fireEvent("beforecheked", this, index, record, t))
						this.toggleCheck(t, record, index);
					this.toggleCheck(t, record, index);
				}
			},

			toggleCheck : function(t, record, index) {
			    this.fireEvent("click", this, index, record, t);
			},

			isDisable : function(rec) {
				return true;
			},
            isCheked : function(rec) {
				return rec.getValue();
			},
			checkRow : function() {
			},
			
			unCheckRow : function(element) {
			},

			renderer : function(v, p, record, rowIndex) {
			 	var esdisable = (v != null)?0:1;
				if(v == 0 || v == null)
					v = null;
				else
					v = 1
				var disable = (esdisable ? "disabled='true'" : "");
				if (disable)
					this.fireEvent("disable", this, rowIndex, record);
				return '<div><input ' + (v ? " checked " : " ") + disable
						+ '" type="checkbox" id="' + (rowIndex)
						+ 'x-grid3" /></div>';
			},

			getRowChecked : function() {
				var a = [];
				for (var i = 0; i < this.grid.store.getCount(); i++) {
					var rec = this.grid.store.getAt(i);
					if (rec.data[this.dataIndex]) {
						a.push(rec);
					}
				}
				return a;
			},
			getRowUnchecked : function() {
				var a = [];
				for (var i = 0; i < this.grid.store.getCount(); i++) {
					var rec = this.grid.store.getAt(i);
					if (!rec.data[this.dataIndex]) {
						a.push(rec);
					}
				}
				return a;
			},
			DisableiAllif : function(t) {
				hd = Ext.fly(t.parentNode);
			}
		});
		
		if (!this.id) {
			this.id = Ext.id();
		}
		
		this.renderer = this.renderer.createDelegate(this);
		this.isDisable = config.isDisable || this.isDisable.createDelegate(this);
	};
 
Ext.extend(Ext.grid.CheckColumn, Ext.util.Observable);
