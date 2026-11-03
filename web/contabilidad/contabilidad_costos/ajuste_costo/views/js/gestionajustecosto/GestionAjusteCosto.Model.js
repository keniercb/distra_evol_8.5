Ext.ns('Costo.Procesos.Asociacion.Cuenta');
Costo.Procesos.Asociacion.Cuenta.Model={
    init : function(){
        
         this.storeAjustes = new Ext.data.JsonStore({
            url:'cargarAjustes', 
            root:'data',
            autoLoad:true,
            totalProperty: "total",
            fields : [
            {
                name : 'idajustecosto'
            },{
                name : 'numero'
            },{
                name : 'descripcion'
            }, {
                name : 'estado'
            },{
                name : 'numerocomprobante'
            }]
        });
        
        this.storeCentros = new Ext.data.JsonStore({
            url:'cargarCentros', 
            root:'datos',
            autoLoad:true,
            totalProperty: "total",
            fields : [
            {
                name : 'idcentrogrupo'
            },{
                name : 'concat'
            }, {
                name : 'descripcion'
            },{
                name : 'idcentrogrupoentidad'
            }]
        });
        
         this.storeCuentasProceso = new Ext.data.JsonStore({
            url:'cargarCuentasProceso', 
            root:'datos',
            totalProperty: "total",
            fields : [
            {
                name : 'idcuenta'
            },{
                name : 'concat'
            }, {
                name : 'descripcion'
            }]
        });
        
         this.storeCuentasTerminada = new Ext.data.JsonStore({
            url:'cargarCuentasTerminadas', 
            root:'datos',
            totalProperty: "total",
            fields : [
            {
                name : 'idcuenta'
            },{
                name : 'concat'
            }, {
                name : 'descripcion'
            }]
        });
        
         this.storeCuentasVendida = new Ext.data.JsonStore({
            url:'cargarCuentasVendida', 
            root:'datos',
            totalProperty: "total",
            fields : [
            {
                name : 'idcuenta'
            },{
                name : 'concat'
            }, {
                name : 'descripcion'
            }]
        });
        
        this.stEstados = new Ext.data.JsonStore({
            fields: [
            {
                name: 'idestado'
            },
            {
                name: 'descripcion'
            }
            ]
        });
        var data=[{
            idestado:'0',
            descripcion:'No ejecutado'
        },{
            idestado:'1',
            descripcion:'Ejecutado'
        }];
        this.stEstados.loadData(data);

    }
}