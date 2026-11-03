Ext.namespace('Ext.ClassDesgloseXNivel')
Ext.ClassDesgloseXNivel = Ext.extend(Ext.Component, 
{
    constructor : function(globalScope, params)
    {
        this.globalScope = globalScope;
        this.params = params;
        this.url = '/contabilidad/contabilidad_financiera/cuentacontable/index.php/desglosexnivel/';
        Ext.ClassDesgloseXNivel.superclass.constructor.call(this);
        this.cargarPerfil(this);
    },
    cargarPerfil : function(scope)
    {
        Ext.Ajax.request({
            method : "POST", 
            url : scope.url + "cargaretiquetas",
            callback : function(options, success, response)
            {
                scope.etiquetas = Ext.decode(response.responseText);
                return scope;
            }
        });
    },
    loadData : function(params)
    {
        if(this.lMask == undefined)
            this.lMask = this.frmPanel.loadMask(this.globalScope);
        this.lMask.show();
        scope = this;
        Ext.Ajax.request({
            method : "POST", 
            params : {
                cuenta : params, 
                idSubsistema : 4
            },
            url : this.url + "cargarselectivo",
            callback : function(options, success, response)
            {
                scope.response = Ext.decode(response.responseText);
                if(scope.response.conceptos != undefined)
                    if(scope.response.conceptos.length > 0)
                        scope.AfterLoadSelectivo();
                scope.lMask.hide();
            }
        });
    },
    loadComponent : function()
    {
        this.frmPanel = new Ext.FrmDesgloseXNivel.Panel(this, this.params);
        this.initializeEvents(this);
        this.initializeFunctions(this);
        return this.frmPanel;
    },
    initializeEvents : function(scope)
    {
        this.frmPanel.addEvents('collapsed');
        this.frmPanel.addEvents('lastComponent');
        
        this.frmPanel.getComponent(0).on('add', function(container, component){
            scope.frmPanel.doLayout(true);
            if(scope.frmPanel.getComponent(0).collapsed)
                scope.frmPanel.getComponent(0).expand();
            else
                scope.fFireEvents(scope.frmPanel.getComponent(0)); 
        })
        
        this.frmPanel.getComponent(0).on('remove', function(container, component){
            if(this.items.length == 0)
                this.collapse();
            else
            {
                scope.frmPanel.doLayout(true);
                scope.fFireEvents(this);
            }
        })
           
        this.frmPanel.getComponent(0).on('collapse', function(component){
            if(scope.innerHeight > 0)
                scope.frmPanel.fireEvent('collapsed', true);
        })
        
        this.frmPanel.getComponent(0).on('expand', function(component){
            scope.innerHeight = component.getInnerHeight();
            if(scope.innerHeight > 0)
                scope.frmPanel.fireEvent('collapsed', false, scope.innerHeight);            
            scope.frmPanel.getComponent(0).getComponent(0).getComponent(0).focus(true, 10); 
        })
    },
    initializeFunctions : function(scope)
    {
        this.fFireEvents = function(component)
        {
            innerHeightCopy = component.getInnerHeight();
            if(this.innerHeight != innerHeightCopy)
                scope.frmPanel.fireEvent('collapsed', false, innerHeightCopy);
        } 
         
        this.AfterLoadSelectivo = function()
        {
            if(this.response.conceptos.length > 1)
            {
                this.window = new Ext.FrmDesgloseXNivel.Window(this, this.response.conceptos, {});
                this.window.show(Ext.getBody(), function(){
                    scope.lMask.hide();
                })
                this.window.on('show', function(){
                    this.doLayout();
                    scope.cbxWindow.focus(true, 10);
                }) 
                this.window.getComponent(0).on('keypress', function (t, e){
                    if(scope.cbxWindow.isValid())
                    {
                        scope.window.close();
                        scope.fFindRecordsByValue(scope.cbxWindow.getValue())
                    } 
                })         
                this.btnCancelarWindow.on('click', function(){
                    scope.window.close()
                })
                this.btnAceptarWindow.on('click', function(){
                    if(scope.cbxWindow.isValid())
                    {
                        scope.window.close();
                        scope.fFindRecordsByValue(scope.cbxWindow.getValue())
                    }    
                })
            }else
                this.AddComponentInForm(this.response.conceptos[0], this.response.aperturas);
        }
        
        this.fFindRecordsByValue = function(value)
        {
            this.lMask.show();
            apertura = this.response.aperturas;
            length = apertura.length;
            listAperturas = new Array();
            for(i = 0; i < length; i++)
                if(apertura[i].concepto.valuefield == value)
                    listAperturas.push(apertura[i])
            this.AddComponentInForm(listAperturas[0].concepto, listAperturas);
        }
       
        this.AddComponentInForm = function(fieldComponent, data)
        {
            this.cbxComponent = this.frmPanel.createComboBox(fieldComponent.valuefield, fieldComponent.displayfield, this.frmPanel.createStore(fieldComponent.valuefield, data));
            this.frmPanel.getComponent(0).add(new Ext.FrmDesgloseXNivel.layoutForm({
                items:this.cbxComponent
            }));  
            this.cbxComponent.focus(true, 10);
            this.cbxComponent.addListener({
                select:{
                    fn: function(combo, record, index){
                        scope.onSelect(combo, record, index)
                    },
                    scope: this
                }
            });
            this.lMask.hide();
        }
        
        this.onSelect = function(combo, record, index)
        {
            this.deleteComponent(this.frmPanel.getComponent(0), combo);
            if(!record.data.leaf)
            {
                this.frmPanel.fireEvent('lastComponent', null, false);    
                this.loadData(record.data.idcuenta);
            }else{
                this.frmPanel.fireEvent('lastComponent', record, true); 
            }  
        }
        
        this.deleteComponent = function(fp, element)
        {
            var ac,acol,del = false, arrdel = new Array();
            element.findParentBy(function(ac1){
                ac = ac1;
                return ac;
            });	
            ac.findParentBy(function(ac1){
                acol = ac1;
                return acol;
            });	
            acol.cascade(function(ael){	
                if (del && ael.getXType()!='combo')	
                    arrdel.push(ael);	
                if (ael.getId() == ac.getId())	
                    del = true;	
                return true;	
            })	
            for(var i = 0; i < arrdel.length; i++)	
                fp.remove(arrdel[i]);	
        } 
    }
})