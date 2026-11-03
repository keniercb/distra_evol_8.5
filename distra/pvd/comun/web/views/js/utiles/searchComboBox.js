Ext.ns("Ext.app");

Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    toolTipTrigger1: 'Limpiar datos <b>(Alt+L)<b>',
    toolTipTrigger2: 'Buscar datos <b>(Alt+B)</b>',
    maxLength: 255,
    initComponent: function () {
		var scope = this;
        this.configFiltro[0] = (this.configFiltro[0])?this.configFiltro[0]:'remote';
        this.configFiltro[1] = (this.configFiltro[1])?this.configFiltro[1]:'all';
        this.configFiltro[2] = (this.configFiltro[2] == 'tree')?this.configFiltro[2]:'notree';

		this.teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
		key: 'lb',
		alt: true,
		stopEvent: true, 
		handler: function(k, e) {
			switch(k) {
				 case 76:{ //l para limpiar
				 scope.onTrigger1Click();
				 break;
			}
			case 66:{ //b para buscar
				 scope.onTrigger2Click();
				 break;
			}
		}     
	}}]);	
		
        this.on('specialkey', function (f, e) {
            if (e.getKey() == e.ENTER ) {
                this.onTrigger2Click();
            }else if(e.getKey() == e.ESC){
                this.onTrigger1Click();
            }
        }, this);
        if(this.configFiltro[2] == 'tree'){
            this.filtro = new Ext.tree.TreeFilter(this.treeStore, {
                clearBlank: true,
                autoClear: true
            });
        }
	    Ext.app.SearchField.superclass.initComponent.call(this);
        this.triggerConfig.cn[0].qtip = this.toolTipTrigger1;
        this.triggerConfig.cn[1].qtip = this.toolTipTrigger2;
    },

    //validationEvent: false,
    //validateOnBlur: false,
    trigger1Class: 'x-form-clear-trigger',
    trigger2Class: 'x-form-search-trigger',
    hideTrigger1: true,
    width: 180,
    hasSearch: false,
    paramName: 'query',
    configFiltro:[],
    hiddenRecords:[],

    onTrigger1Click: function () {
        if (this.hasSearch) {
            if(this.configFiltro[0] == 'local'){
                if(this.configFiltro[2] == 'notree'){
                    this.store.clearFilter();
                }else if(this.configFiltro[2] == 'tree'){
                    var text = this.getRawValue();
                    Ext.each(this.hiddenRecords, function(n){
                        n.ui.show();//muestro todos los nodos que se habian ocultado
                    });
                    if(!text){
                        this.filtro.clear();
                        return;
                    }
                }
                this.el.dom.value = '';
                this.triggers[0].hide();
                this.hasSearch = false;
            }else if(this.configFiltro[0] == 'remote'){
                this.el.dom.value = '';
                if(this.configFiltro[2] == 'tree'){
                    this.treeStore.getLoader().baseParams = this.treeStore.getLoader().baseParams || {};
                    this.treeStore.getLoader().baseParams.query = '';
                    this.treeStore.getLoader().load(this.treeStore.getRootNode());
                }else{
                    var o = {start: 0, limit: (this.pageSize)?this.pageSize:15};
                    this.store.baseParams = this.store.baseParams || {};
                    this.store.baseParams[this.paramName] = '';
                    this.store.reload({params: o});
                }
                this.triggers[0].hide();
                this.hasSearch = false;
            }
        }
    },

    onTrigger2Click: function () {
        if(this.configFiltro[0] == 'local'){
            if(this.configFiltro[2] == 'notree'){
                if(this.configFiltro[1] == 'all'){

                }else{
                    this.store.filter(this.configFiltro[1],this.getRawValue(),true,true);
					this.hasSearch = true;
					this.triggers[0].show();
                }
            }else if(this.configFiltro[2] == 'tree'){
                var text = this.getRawValue();
                Ext.each(this.hiddenRecords, function(n){
                    n.ui.show();//muestro todos los nodos que se habian ocultado
                });
                if(!text){
                    this.filtro.clear();
                    return;
                }
                //this.treeStore.expandAll();

                var re = new RegExp(Ext.escapeRe(text), 'i');
                this.filtro.filterBy(function(n){
                    return !n.isLeaf() || re.test(n.text);
                });

                // hide empty packages that weren't filtered
                this.hiddenRecords = [];
                this.treeStore.root.cascade(function(n){
                    if(!n.isLeaf() && n.ui.ctNode.offsetHeight < 3){
                        n.ui.hide();
                        this.hiddenRecords.push(n);
                    }
                },this);
                this.hasSearch = true;
                this.triggers[0].show();
            }
        }else if(this.configFiltro[0] == 'remote'){
            var v = this.getRawValue();
            if (v.length < 1) {
                this.onTrigger1Click();
                return;
            }
            if(this.configFiltro[2] == 'tree'){
                var o = {start: 0, limit: (this.pageSize)?this.pageSize:15};
                this.treeStore.getLoader().baseParams = this.treeStore.getLoader().baseParams || {};
                this.treeStore.getLoader().baseParams.query = v;
                this.treeStore.getLoader().load(this.treeStore.getRootNode());
            }else{
                var o = {start: 0, limit: (this.pageSize)?this.pageSize:15};
                this.store.baseParams = this.store.baseParams || {};
                this.store.baseParams.query = v;
                this.store.reload({params: o});
            }
            this.hasSearch = true;
            this.triggers[0].show();
        }
    }
});
