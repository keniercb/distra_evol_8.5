Ext.ns("Ext.components.CmpReccomplejas");
Ext.components.CmpReccomplejas.TreeComboBox = Ext.extend(Ext.form.ComboBox, {
    tree: null,
    treeId: 0,
    callbackClick:null,
    getTreeId:function(text){
       return this.treeId;
    },
    initComponent: function(){
        var tplwidth = '';
        this.treeId = Ext.id();
        this.focusLinkId = Ext.id();
        this.emptyText = 'Seleccione';
        if(this.width){
            tplwidth = 'width:'+this.width;
        }
        var height = (this.height)?this.height:'200px';
        Ext.apply(this, {
            store:new Ext.data.SimpleStore({
                fields:[],
                data:[[]]
            }),
            editable:false,
            shadow:false,
            fieldLabel:'Causas',
            mode: 'local',
            triggerAction:'all',
            maxHeight: 200,
            tpl: '<tpl for="."><div style="height:'+height+';'+tplwidth+'" id="'+this.treeId+'"><a href="#" class="x-grid3-focus" id="'+this.focusLinkId+'" tabIndex="-1"/></div></tpl>',
            selectedClass:'',
            onSelect: Ext.emptyFn,
            valueField: 'id'
        });
        
        var treeConfig = {
            border:false
        };
                
        Ext.apply(treeConfig, this.treeConfig);
        
        if (!treeConfig.root) {
            treeConfig.root = new Ext.tree.AsyncTreeNode({
                text: 'treeRoot',
                id:'0'
            }); 
        }
        
        this.tree = new Ext.tree.TreePanel(treeConfig);
        
        this.on('expand', this.onExpand);
        this.tree.on('click', this.onClick, this);
        
        Ext.components.CmpReccomplejas.TreeComboBox.superclass.initComponent.call(this);
        
    },
    onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.isExpanded()){
            this.collapse();
        }else {
            this.onFocus({});
            if(this.triggerAction == 'all') {
                this.doQuery(this.allQuery, true);
            } else {
                this.doQuery(this.getRawValue());
            }
        }
    },/*
    onFocus : function () {
        Ext.components.CmpReccomplejas.TreeComboBox.superclass.onFocus.call(this);
        var elem = Ext.get(this.focusLinkId)
        if(elem)
            elem.focus();
    },*/
    onClick: function (node) {
        this.valueNotFoundText = node.text;
        this.setValue(node.text); //this.setValue(node.id);
        this.collapse();
        if(this.callbackClick)this.callbackClick(node);
    },
    onExpand: function(){
        this.tree.render(this.treeId);
        this.tree.focus();
        var firstParent = Ext.get(this.treeId).dom.parentNode;
        var secondParent = firstParent.parentNode;
        firstParent.style.width = '100%';
        secondParent.style.width = this.width;
    }
});
Ext.reg("CmpReccomplejas_TreeComboBox", Ext.components.CmpReccomplejas.TreeComboBox);
