Ext.define('GestionContratoImportacion.view.CmbArea', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.cmbareaimportacion',
    validateOnBlur: true,
    enableKeyEvents: true,
    // multiSelect: false,
    multiSelect: true,
    autoExpand: false,
    navigateKeys: [9, 27, 35, 36, 36, 37, 38, 39, 40],
    fieldLabel: 'Area',
    displayField: 'text',
    valueField: 'text',
    requires: ['GestionContratoImportacion.store.Areas'],
    checkBoxTree: false,
    initComponent: function () {
        var me = this;
        console.log('CmbArea 2')
        var selModel = Ext.create('Ext.selection.RowModel');
        if (me.checkBoxTree) {
            this.store = Ext.create('GestionContratoImportacion.store.Areas', {
                filters: [{property: 'checkbox', value: true}]
            });
            selModel = Ext.create('Ext.selection.CheckboxModel', {
                mode: 'MULTI'
            });
        } else {
            this.store = Ext.create('GestionContratoImportacion.store.Areas');
        }

        selModel.on({
            scope: this,
            selectionchange: this.onSelectionChange
        });

        this.tree = Ext.create('Ext.tree.Panel', {
            cls: 'crm-icon-tree',
            name: 'areatree',
            store: this.store,
            rootVisible: false,
            autoScroll: true,
            selModel: selModel,
            listeners:{
                beforeitemexpand: function(node){
                    console.log('beforeitemexpand', node)
//                     node.data.loading=true;
                    me.setLoading('');
                    me.tree.setLoading('Cargando')
                },
                afteritemexpand: function(node){
                    console.log('afteritemexpand 1')
                    me.setLoading(false);
                    console.log('DDDDDD')
//                     node.data.loading=false;
                    me.tree.setLoading(false)
                    console.log('eeeeee')
                    console.log('me.isExpanded()',me.isExpanded)
                    if(!me.isExpanded)me.expand();
                }
            }
        });

        this.panel = Ext.create('Ext.panel.Panel', {
            items: this.tree,
            layout: 'fit',
            floating: true,
            height: 250
        });

        this.callParent();
    },
    createPicker: function () {
        return this.panel;
    },
    onSelectionChange(smtree, records) {
        var idAreas = [], nombreAreas = [];

        records.forEach(function (x) {
            if (this.valueField && this.displayField) {
                idAreas.push(parseInt(x['data'][this.valueField]));
                nombreAreas.push(x['data'][this.displayField]);
            }
        }, this);
        this.idValue = idAreas;
        this.nameValue = nombreAreas;

        this.setValue(this.nameValue.join(','));
//         console.log('this.checkBoxTree:', this.checkBoxTree)
        if (!this.checkBoxTree) {
            this.collapse();
        }

        if (this.nameValue.length != 0) {
            if(this.tip){
                this.tip.destroy();
            }
            this.tip = Ext.create('Ext.tip.ToolTip', {
                target: this.getEl(),
                html: this.nameValue.join(', '),
                autoDestroy: true
            });
            this.tip.showBy(this.getEl());
        }
        this.fireEvent('select', this, records);

    }
});
