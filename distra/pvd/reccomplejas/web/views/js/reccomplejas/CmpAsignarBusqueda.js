Ext.ns("Ext.components.CmpReccomplejas.");

Ext.components.CmpReccomplejas.ListUsuarioPersona = Ext.extend(Ext.grid.GridPanel, {
    
    initComponent: function() {
        var self = this;
        this.loadMask = {
            msg: this.idioma.lbGridLoadMask
        };
        
        this.columns = [{
            dataIndex: 'nombreusuario',
            sortable: true,
            header: this.idioma.lbUserName,
            width:100
        },{
            dataIndex: 'nombre',
            sortable: true,
            header: this.idioma.lbName,
            width:90
        },{
            dataIndex: 'snombre',
            sortable: true,
            header: this.idioma.lbSName,
            width:110
        },{
            dataIndex: 'papel',
            sortable: true,
            header: this.idioma.lbPapel,
            width:100
        },{
            dataIndex: 'sapel',
            sortable: true,
            header: this.idioma.lbSapel,
            width:110
        }];
    
        this.store = new Ext.data.Store({
            url: '/reccomplejas/index.php/reccomplejas/obtenerUsuarioPersonas',
            reader : new Ext.data.JsonReader({
                root : 'datos',
                totalProperty : 'cantidad'
            }, [{
                name: 'idusuario'
            },{
                name: 'nombreusuario'
            },{
                name: 'idpersona'
            },{
                name: 'nombre'
            },{
                name: 'snombre'
            },{
                name: 'papel'
            },{
                name: 'sapel'
            }
            ])
        });
        
        this.bbar = new Ext.PagingToolbar({
            pageSize: 15,
            store: this.store,
            displayInfo: true,
            displayMsg: this.idioma.lbDisplayMsgGrid,
            emptyMsg: this.idioma.lbEmptyMsg
        });
        
        Ext.components.CmpReccomplejas.ListUsuarioPersona.superclass.initComponent.call(this);
    }
});

Ext.components.CmpReccomplejas.CmpAsignarBusqueda = Ext.extend(Ext.Window, {
    layout:'fit',
    //layout:'border',
    modal: true,
    height:470,
    width:800,
    maximizable: true,
    title:'Gestionar b&uacute;squedas',
    
    initComponent: function() {
        this.title = this.idioma.lbWinAsignarBusqueda;
        var self = this;
        
        var gridAllUserPerson = new Ext.components.CmpReccomplejas.ListUsuarioPersona({
            margins: '5 5 5 5',
            region: 'center',
            //idbusqueda: this.idbusqueda,
            idioma: this.idioma
        });
        
        this.items = [gridAllUserPerson];
        Ext.components.CmpReccomplejas.CmpAsignarBusqueda.superclass.initComponent.call(this);
    }
});