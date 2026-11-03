Ext.namespace('Ext.FrmDesgloseXNivel');
Ext.FrmDesgloseXNivel.Panel = Ext.extend(Ext.Panel, {
    constructor:function(scope, params)
    {
        Ext.applyIf(params || this, {
            id:'FrmDesgloseXNivel',
            bodyStyle : 'padding:0 5px 0 5px', 
            border:false,
            hideBorders:true,
            bodyBorder:false,
            layout: 'fit', 
            shadow: true,
            items:[{
                labelAlign : 'top', 
                title:' ', 
                autoHeight: true,
                border:false,
                hideBorders:true,
                bodyBorder:false,
                collapsed: true,
                collapsible: true,
                collapseFirst: true,
                layout:'column'
            }]
        });
        return Ext.FrmDesgloseXNivel.Panel.superclass.constructor.call(this, params);
    }, 
    createComboBox : function(idComponent, fieldLabel, store)
    {
        return new Ext.form.ComboBox({
            id: 'cbx'+idComponent,
            fieldLabel : fieldLabel,
            tabIndex:10,
            displayField : 'text',
            valueField : 'idcuenta',
            hiddenName : 'idcuenta',
            enableKeyEvents : true,
            editable : true,
            forceSelection : true,
            selectOnFocus : true,
            typeAhead : true,
            allowBlank : false,
            triggerAction : 'all',
            mode : 'local',
            anchor : '100%',
            tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>',
            store : store
        });
    },
    createStore:function(idComponent, data)
    {
        return new Ext.data.JsonStore({
            id:'st'+idComponent,
            data : data,
            fields : [{
                name : 'idcuenta'
            }, {
                name : 'text'
            }, {
                name : 'gasto'
            },{
                name : 'leaf'
            }]
        });
    }, 
    loadMask : function(scope)
    {
        return new Ext.LoadMask(Ext.getBody(), {
            msg:scope.etiquetas.lMask
        });
    }
    
})

Ext.FrmDesgloseXNivel.layoutForm = Ext.extend(Ext.Panel, {
    constructor: function(params)
    {
        Ext.applyIf(this, {
            columnWidth : .25,
            layout : 'form',
            bodyStyle : 'padding:0 10px 0 0', 
            labelAlign : 'top'    
        });
        return Ext.FrmDesgloseXNivel.layoutForm.superclass.constructor.call(this, params);
    }
});

Ext.FrmDesgloseXNivel.Window = Ext.extend(Ext.Window, {
    constructor: function(scope, data, params)
    {
        scope.btnCancelarWindow = new Ext.Button({
            text : scope.etiquetas.btnCancelar,
            tooltip : scope.etiquetas.tpCancelar,
            icon:perfil.dirImg+'cancelar.png',
            iconCls:'btn',
            scope : this	
        });
        scope.btnAceptarWindow = new Ext.Button({
            text : scope.etiquetas.btnAceptar,
            tooltip : scope.etiquetas.tpAceptar,
            icon:perfil.dirImg+'aceptar.png',
            iconCls:'btn',
            scope : this	
        });
        Ext.applyIf(params, {
            title: scope.etiquetas.titleWindow,
            autoHeight:true,
            constrain: true,
            defaultButton: 0,
            plain : true,
            monitorResize : true,
            closable : false,
            modal : true,
            resizable  : false, 
            items: scope.cbxWindow = this.createComboBox(data),
            buttons :[scope.btnCancelarWindow, scope.btnAceptarWindow]
        });
        return Ext.FrmDesgloseXNivel.Window.superclass.constructor.call(this, params);
    },
    createComboBox : function(data)
    {
        return new Ext.form.ComboBox({
            id: 'cbxWindow',
            displayField : 'displayfield',
            valueField : 'valuefield',
            hiddenName : 'valuefield',
            tabIndex:21,	
            enableKeyEvents : true,
            forceSelection : true,
            selectOnFocus : true,
            typeAhead : true,
            mode : 'local',
            allowBlank : false,
            triggerAction : 'all',
            anchor : '100%',
            tpl: '<tpl for="."><div ext:qtip="{displayfield}" class="x-combo-list-item">{displayfield}</div></tpl>',
            store : this.createStore(data)
        });
    },
    createStore:function(data)
    {
        return new Ext.data.JsonStore({
            id:'stBoxWindow',
            data : data,
            fields : [{
                name : 'displayfield'
            }, {
                name : 'valuefield'
            }]
        });
    }
});


