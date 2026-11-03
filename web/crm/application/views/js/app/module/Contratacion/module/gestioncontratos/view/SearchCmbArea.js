Ext.define('GestionContrato.view.SearchCmbArea', {
    extend: 'GestionContrato.view.CmbArea',
    alias: 'widget.searchcmbarea',
    trigger2Cls: 'x-form-clear-trigger',
    trigger3Cls: 'x-form-search-trigger',
    clearTooltip: 'Limpiar filtro',
    searchTooltip: 'Buscar elementos',
    clearButton: true,
    searchButton: true,
    emptyText: 'Criterio a buscar...',
    idValue: null,
    nameValue: null,
    checkBoxTree:true,
    multiSelect:true,
    valueField: 'id',
    displayField: 'text',
    initComponent: function () {
        var self=this;
        this.callParent();
        this.tree.getSelectionModel().on('selectionchange', 
            function(a,r){self.markSelection(r);});
        this.on({
            render: function () {
                this.triggers = this.triggerEl.elements;

                Ext.create('Ext.tip.ToolTip', {
                    target: this.getTriggerCmp(this.triggers[1]).dom,
                    html: this.clearTooltip
                });

                Ext.create('Ext.tip.ToolTip', {
                    target: this.getTriggerCmp(this.triggers[2]).dom,
                    html: this.searchTooltip
                });

                this.hideTrigger2();
                this.hideTrigger2(2);
            },
            select: function (f, r) {
                // console.log('SELECT')
                var me=this;
                this.isValid();
                if (r.length > 0) {
                    if(me.clearButton)this.showTrigger2();
                    if(me.searchButton)this.showTrigger2(2);
                }
                this.markSelection(r);
            },
            onclick2: this.onClick2,
            onclick3: this.onClick3
        });
    },
    onTrigger2Click: function () {
        this.setValue();
        this.idValue = null;
        this.nameValue = null;
        if(this.searchButton)this.hideTrigger2(2);
        this.fireEvent('onclick2', this);
    },
    onTrigger3Click: function () {
        this.fireEvent('onclick3', this);
    },
    onClick2: function () {
        // console.log('onclick2')
        this.focus();

        if(this.clearButton)this.hideTrigger2();
        if (this.hasSearch) {
            this.el.dom.value = '';
            this.reset();
            if (typeof (this.fnOnClear) == 'function') {
                this.fnOnClear();
            }
            this.fireEvent('clear', this);
            this.hasSearch = false;
        } else {
            this.el.dom.value = '';
            this.reset();
        }
        this.collapse();
    },
    onClick3: function () {
        // console.log('onclick3')
        var v = this.getRawValue();
        if (v.length < 1) {
            this.onTrigger2Click();
            return;
        }

        this.hasSearch = true;
        if(this.clearButton)this.showTrigger2();
        this.setValue(this.getValue().trim());
        if (typeof (this.fnOnSearch) == 'function') {
            this.fnOnSearch();
        }
        this.collapse();
        this.fireEvent('search', this);
    },
    hideTrigger2: function (pos) {
        if (!pos) {
            pos = 1;
        }
        if (this.triggers[pos].dom.offsetParent) {
            Ext.get(this.triggers[pos].dom.offsetParent).hide();
            this.triggers[pos].dom.offsetParent.setAttribute('style', 'width: 17px; visibility: hidden;position:absolute');
        }
    },
    showTrigger2: function (pos) {
        if (!pos) {
            pos = 1;
        }
        Ext.get(this.triggers[pos].dom.offsetParent).show();
        this.triggers[pos].dom.offsetParent.setAttribute('style', 'width: 17px;');
    },
    getTriggerCmp: function (el) {
        return Ext.get(el.dom.offsetParent);
    },
    reset: function () {
        // console.log(' reset original', this)
        var self=this;
        if(self.clearButton)self.hideTrigger2(1);
        if(self.searchButton)self.hideTrigger2(2);
        // console.log('this.tree:', self.tree)
        // console.log('this.tree getSelectionModel:', self.tree.getSelectionModel())
        // console.log('this.tree getLastSelected:', self.tree.getSelectionModel().getLastSelected())
        if(self.tree && self.tree.getSelectionModel() && self.tree.getSelectionModel().getLastSelected())
            self.tree.getSelectionModel().deselectAll(true);
        self.idValue=null;
        self.setValue('');
        // this.callParent();
    },
    markSelection: function(nodo){
        var me = this;
        var seleccionActual=me.tree.getSelectionModel().getLastSelected();
        /*console.log('seleccionActual:', seleccionActual)
        if(seleccionActual){
            console.log('expanded:', seleccionActual.data.expanded, 'expandable:', seleccionActual.data.expandable,
            'loaded:', seleccionActual.get('loaded'),'loading:', seleccionActual.get('loading'),
             'dept:', seleccionActual.get('dept'), 'leaf:', seleccionActual.get('leaf'));
            if(!seleccionActual.get('expanded') && !seleccionActual.get('leaf')){
                seleccionActual.expandChildren(false, function(){
                    console.log('ha terminado');
                    console.log('me.isExpanded()',me.isExpanded)
                    if(!me.isExpanded)me.expand();
                    me.selectAllChild(seleccionActual);
                });
                console.log('kdgjdsgdfbgjbdfjdnfjnd',me.isExpanded)
                if(!me.isExpanded)me.expand();
            }else{
                me.selectAllChild(seleccionActual);
            }
            me.onSelectionChange(me.tree.getSelectionModel(), me.tree.getSelectionModel().getSelection());
        }*/
    },
    selectAllChild: function(nodo){
        var me = this;
        if(nodo.hasChildNodes()){
            nodo.eachChild(function(x){
                me.tree.getSelectionModel().select(x, true, true);
            });
        }
    }
});
