Ext.ns("Ext.ux.form");

Ext.ux.form.FieldGrid = Ext.extend(Ext.form.TriggerField, {
	//Separador para los valores a mostrar.
	separetor : '/',
	
	//Ancho mínimo de la lista de valores.
	minWidth : 70,

	maxHeight: 300,
	
	minHeight: 90,
	
	//Arreglo de valores iniciales.
	valInicial : null,
	
    initComponent: function () {
        Ext.ux.form.FieldGrid.superclass.initComponent.call(this);
		
		//Inicializa el store de elementos
		if(!this.store){
			this.store = new Ext.data.SimpleStore({
				fields: ['llave','valor', 'initvalor'],
			});
			
			this.valueField = 'llave';
			this.displayField = 'valor';
		}
    },
	
	onRender : function(ct, position){
        Ext.ux.form.FieldGrid.superclass.onRender.call(this, ct, position);
        // if(this.hiddenName){
            // this.hiddenField = this.el.insertSibling({tag:'input', type:'hidden', name: this.hiddenName,
                    // id: (this.hiddenId||this.hiddenName)}, 'before', true);

            ////prevent input submission
            // this.el.dom.removeAttribute('name');
        // }
        if(Ext.isGecko){
            this.el.dom.setAttribute('autocomplete', 'off');
        }
		this.initGrid();
		//Este elemento es de solo lectura.
		this.el.dom.setAttribute('readOnly', true);
		this.el.on('mousedown', this.onTriggerClick,  this);
    },
	
	//Función inicializadora del componente del grid.
	initGrid : function(){
		this.grid = new Ext.grid.EditorGridPanel({
			store: this.store,
			clicksToEdit : 1,
			columns: [
				{header: "", width : this.width, sortable: false, menuDisabled : true, dataIndex: this.displayField, editor : this.editorField || new Ext.form.NumberField},
			],
			viewConfig: { forceFit: true},
			floating: true,
			autoHeight: true,
			alignTo: function(el, pos) {
				this.setPagePosition(this.el.getAlignToXY(el, pos));
			},
			listeners: {
				render: function(grid) {
					grid.getView().el.select('.x-grid3-header').setStyle('display', 'none');
				},
				afteredit : this.onGridEdit,
				scope: this
			}
		});
		
		this.insertRecord(0);	
	},
	
	//Función que se ejecuta cuando se edita el grid.
	onGridEdit : function(opts){
		//En caso de introducir un nuevo valor se inserta el final del store.
		if(opts.value != '' && opts.row == 0){
			opts.record.set('valor', null);
			this.insertRecord( 	this.store.getCount(), new Ext.data.Record({ llave : 'add', valor : opts.value, initvalor : null}) );
		}
		
		//Se limpia el css de cambios.
		this.store.commitChanges();
		
		//En caso de ser vacío el valor se elimina del store.
		if(opts.value == '' && opts.row != 0){
			this.store.remove(opts.record);
			this.resizeColumGrid();
		}
		
		Ext.ux.form.FieldGrid.superclass.setValue.call(this, this.getTextValue());
		
	},
	
	//Función para inserta un record vacío en el store.
	insertRecord : function(pos, record){
		this.store.insert(pos, record || new Ext.data.Record({
			llave : 'add-'+Ext.id() ,
			valor : null,
			initvalor : null,
		}));
	},
	
	//Función para eliminar un record.
	deleteEmptyRecord : function(pos){
		this.store.remove();
	},
	
	//Función para establecer el ancho del column model del grid. 
	resizeColumGrid : function(){
		if(this.grid.rendered){
			this.grid.syncSize();
			this.grid.getColumnModel().setColumnWidth(0, this.el.getWidth());
		}
	},
	
	//Función para establecer el arreglo de valores.
	setValue : function(v){
		//Se estable el arreglo inicial de valores.
		this.valInicial = v;
		
		//Se limpia el store.
		this.store.removeAll();
		
		//Se inserta una registro en blanco y a continuación todos los elemtos entrados.
		this.insertRecord(0);
		if(v){
			var arrayRecord = new Array();
			Ext.each(v, function(elem, count){
				arrayRecord.unshift(new Ext.data.Record({ llave : elem[0], valor : elem[1], initvalor : elem[1]}));	
			});	
			this.insertRecord(1, arrayRecord);
		}
		
		Ext.ux.form.FieldGrid.superclass.setValue.call(this, this.getTextValue());
		
		//Se recalcula la longitud de la columna.
		this.resizeColumGrid();
    },
	
	//Función para devolver el valor del field en forma de texto.
	getTextValue : function(){
		return this.getArrayValue().join(this.separetor);
	},
	
	//Función para devolver el valor del field en forma de array.
	getArrayValue : function(llave){
		var value = new Array();
		this.store.each(function(record){
			if(record.get('valor') &&  record.get('valor') != ''){
					value.push((llave)?record.data:record.get('valor'));
			}	
		});
		return value;
	},
	
	//Función para devolver los cambios.
	getChangeValue : function(action){
		//Se declara el objeto resultante.
		var result = {
			add : new Array(),
			mod : new Array(),
			elm : new Array(),
		};
		//Se declara el arreglo de llaves.
		var key = new Array();
		
		//Se obtienen los valores a adicionar, modificar y las llaves del valor inicial.
		this.store.each(function(elem){
			if(elem.get('llave') == 'add'){ //Se obtienen los valores a añadir.
				result.add.push(elem.get('valor'));
			}else if(elem.get('valor') != elem.get('initvalor') && elem.get('valor') != ''){
				result.mod.push({ llave : elem.get('llave'), valor : elem.get('valor')});
			}
			if(elem.get('llave') != 'add' && elem.get('valor')){
				key.push(elem.get('llave'));
			}
		})
		
		//Si existe el valor inicial se comprueban las llaves que se eliminaron.
		if(this.valInicial){
			Ext.each(this.valInicial, function(elem){
				if(key.indexOf(elem[0]) == -1)
					result.elm.push(elem[0]);
			});
		}
		
		//Se retorna los elementos solicitados.
		if(action){
			switch(action){
				case 'add' : return (result.add.length)? result.add : null;break;
				case 'mod' : return (result.mod.length)? result.mod : null;break;
				case 'elm' : return (result.elm.length)? result.elm : null;break;
			}
		}else{
			return (result.add.length||result.mod.length||result.elm.length)?result:null;
		}
	},
	
	expand: function() {
		if (!this.grid.rendered) {
			this.grid.render(document.body);
			this.grid.setWidth(this.el.getWidth());
			this.grid.hide();
			this.resizeColumGrid();
		}
		this.el.focus();
		if(this.isExpanded() || !this.hasFocus){
            return;
        }
		
        this.grid.alignTo(this.wrap, this.listAlign);
        this.grid.show();
		
		Ext.getDoc().on('mousewheel', this.collapseIf, this);
        Ext.getDoc().on('mousedown', this.collapseIf, this);
	},
	
	isExpanded : function(){
        return this.grid && this.grid.isVisible();
    },
	
	collapse : function(){
        if(!this.isExpanded()){
            return;
        }
        this.grid.hide();
        Ext.getDoc().un('mousewheel', this.collapseIf, this);
        Ext.getDoc().un('mousedown', this.collapseIf, this);
        this.fireEvent('collapse', this);
    },
	
	collapseIf : function(e){
        if(!e.within(this.wrap) && !e.within(this.grid.el)){
            this.collapse();
        }
    },
	
	onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.isExpanded()){
            this.collapse();
            this.el.focus();
        }else {
            this.onFocus({});
            this.expand();
            this.el.focus();
        }
    }
	
});
