/**
 * Created by fidel on 22/05/14.
 */
Ext.ns("cein.views");


cein.views.TreeComboBox = Ext.extend(Ext.form.ComboBox, {
    tree: null,
    treeId: 0,
    callbackClick:null,
    getTreeId:function(text){
        return this.treeId;
    },
    initComponent: function(){
        var tplwidth = '';
        this.treeId = Ext.id();
        this.focusLinkId = this.treeId;
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
            mode: 'local',
            triggerAction:'all',
            //width:width,
            maxHeight: 200,
            tpl: '<tpl for="."><div style="height:'+height+';'+tplwidth+'" id="'+this.treeId+'"><a href="#" class="x-grid3-focus" id="'+this.focusLinkId+'" tabIndex="-1"/></div></tpl>',
            selectedClass:'',
            onSelect:Ext.emptyFn,
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

        cein.views.TreeComboBox.superclass.initComponent.call(this);

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
    },
    onFocus : function () {
        cein.views.TreeComboBox.superclass.onFocus.call(this);
        var elem = Ext.get(this.focusLinkId)
        if(elem)
            elem.focus(true,100);
    },
    onClick: function (node) {
        this.valueNotFoundText = node.text;
        this.setValue(node.id);
        this.collapse();
        this.focus(true,100);
        if(this.callbackClick)
            this.callbackClick(node);
    },
    onExpand: function(){
        this.tree.render(this.treeId);
        this.tree.focus();
        var firstParent = Ext.get(this.treeId).dom.parentNode;
        var secondParent = firstParent.parentNode;
        firstParent.style.width = '100%';
        secondParent.style.width = this.width;
    },

    clear: function(){
        this.valueNotFoundText = ' ';
        this.setValue(' ');
    }
});
if(majorVersion == 4) {
    Ext.preg("cein.treecombobox", cein.views.TreeComboBox);
} else {
    Ext.reg("cein.treecombobox", cein.views.TreeComboBox);
}