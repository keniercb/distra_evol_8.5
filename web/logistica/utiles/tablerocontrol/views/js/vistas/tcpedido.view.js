Ext.ns('Ext.erp.Sources');
Ext.erp.Sourcespedido = [{
    name: 'Pedido-Cliente',
    sql: sqlpedido
},{
    name: 'Productos pedidos por clientes',
    sql:  sqlprodpedcliente
},{
    name: 'Cumplimiento del pedido',
    sql: "select distinct coalesce(c.nombre, coalesce(de.denominacion,concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel))) as cliente,  " +
    "(select count(pe1.iddocumento)  " +
    "from mod_logdistribucion.dat_pedido pe1  " +
    "inner join mod_logistica.dat_documentocliente dc1 on dc1.iddocumento = pe1.iddocumento  " +
    "inner join mod_logistica.dat_documento d1 on d1.iddocumento = pe1.iddocumento  " +
    "where dc.idcliente = dc1.idcliente and d1.estado in (3,9)) as total_pedidos,  " +
    "(select count(pe1.iddocumento) from mod_logdistribucion.dat_pedido pe1   " +
    "inner join mod_logistica.dat_documentocliente dc1 on dc1.iddocumento = pe1.iddocumento  " +
    "inner join mod_logistica.dat_documento d1 on d1.iddocumento = pe1.iddocumento  " +
    "where d1.estado in (3,9) and dc.idcliente = dc1.idcliente and (select count (pp1.idproducto) from mod_logdistribucion.dat_productopedido pp1  " +
    "where pp1.idpedido = pe1.iddocumento) = (select count (pp2.idproducto) from mod_logdistribucion.dat_productopedido pp2  " +
    "where pp2.idpedido = pe1.iddocumento and pp2.estado = 4)) as total_cumplimentados,  " +
    "(select count(pe1.iddocumento) from mod_logdistribucion.dat_pedido pe1 inner join mod_logistica.dat_documentocliente dc1 on dc1.iddocumento = pe1.iddocumento  " +
    "inner join mod_logistica.dat_documento d1 on d1.iddocumento = pe1.iddocumento  " +
    "where d1.estado in (3,9) and dc.idcliente = dc1.idcliente and (select count (pp1.idproducto) from mod_logdistribucion.dat_productopedido pp1 where pp1.idpedido = pe1.iddocumento)  " +
    "= (select count (pp2.idproducto) from mod_logdistribucion.dat_productopedido pp2 where pp2.idpedido = pe1.iddocumento and pp2.estado = 4)) * 100 /(select count(pe1.iddocumento)  " +
    "from mod_logdistribucion.dat_pedido pe1 inner join mod_logistica.dat_documentocliente dc1 on dc1.iddocumento = pe1.iddocumento  " +
    "inner join mod_logistica.dat_documento d2 on d2.iddocumento = pe1.iddocumento  " +
    "where dc.idcliente = dc1.idcliente and d2.estado in (3,9)) as porciento, " +
    "d.fechacontable, e.inicio, e.fin  " +
    "from mod_logdistribucion.dat_pedido pe inner join mod_logistica.dat_documento d on d.iddocumento = pe.iddocumento  " +
    "inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = pe.iddocumento  " +
    "left join mod_datosmaestros.nom_clientesproveedor c on dc.idcliente = c.idclientesproveedores  " +
    "left join mod_estructuracomp.dat_estructura de on de.idestructura = c.idestructura  " +
    "left join mod_persona.dat_persona dp on dp.idpersona = c.idpersona  " +
    "left join mod_estructuracomp.dat_estructuraop co on dc.idcliente = co.idestructuraop  " +
    "inner join mod_datosmaestros.dat_documentoprim dprm on dprm.iddoc = d.iddoc  " +
    "inner join mod_datosmaestros.dat_cierre ci on ci.idestructurasubsist = dprm.idestructurasubsist " +
    "inner join mod_datosmaestros.dat_ejerciciocontable e on e.idejercicio = ci.idejercicioactual where d.estado in (3,9)"
},{
    name: 'Pedidos sin reclamods',
    sql: "select distinct coalesce(c.nombre, coalesce(de.denominacion,concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel))) as cliente, " +
    "(select count(pe1.iddocumento) from mod_logdistribucion.dat_pedido pe1  " +
    "inner join mod_logistica.dat_documentocliente dc1 on dc1.iddocumento = pe1.iddocumento  " +
    "inner join mod_logistica.dat_documento d on d.iddocumento = pe1.iddocumento  " +
    "where d.estado in (3,9) and dc.idcliente = dc1.idcliente) as total_pedidos,  " +
    "(select count(pe1.iddocumento) from mod_logdistribucion.dat_pedido pe1  " +
    "inner join mod_logistica.dat_documentocliente dc1 on dc1.iddocumento = pe1.iddocumento  " +
    "inner join mod_logistica.dat_documento d on d.iddocumento = pe1.iddocumento  " +
    "where d.estado in (3,9) and dc.idcliente = dc1.idcliente and  " +
    "pe1.iddocumento not in (select r1.idpedido from mod_logdistribucion.dat_reclamopedido r1)) as total_sin_reclamos,  " +
    "(select count(pe1.iddocumento) from mod_logdistribucion.dat_pedido pe1 inner join mod_logistica.dat_documentocliente dc1 on dc1.iddocumento = pe1.iddocumento  " +
    "inner join mod_logistica.dat_documento d on d.iddocumento = pe1.iddocumento  " +
    "where d.estado in (3,9) and dc.idcliente = dc1.idcliente and pe1.iddocumento in (select r1.idpedido from mod_logdistribucion.dat_reclamopedido r1)) as total_con_reclamos, " +
    "(select count(pe1.iddocumento) from mod_logdistribucion.dat_pedido pe1  " +
    "inner join mod_logistica.dat_documentocliente dc1 on dc1.iddocumento = pe1.iddocumento  " +
    "inner join mod_logistica.dat_documento d on d.iddocumento = pe1.iddocumento  " +
    "where d.estado in (3,9) and dc.idcliente = dc1.idcliente and pe1.iddocumento not in (select r1.idpedido from mod_logdistribucion.dat_reclamopedido r1)) * 100 /(select count(pe1.iddocumento)  " +
    "from mod_logdistribucion.dat_pedido pe1 inner join mod_logistica.dat_documentocliente dc1 on dc1.iddocumento = pe1.iddocumento  " +
    "inner join mod_logistica.dat_documento d on d.iddocumento = pe1.iddocumento  " +
    "where d.estado in (3,9) and dc.idcliente = dc1.idcliente) as porciento_sin_reclamo, " +
    "d.fechacontable, e.inicio, e.fin  " +
    "from mod_logdistribucion.dat_pedido pe inner join mod_logistica.dat_documento d on d.iddocumento = pe.iddocumento  " +
    "inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = pe.iddocumento  " +
    "left join mod_datosmaestros.nom_clientesproveedor c on dc.idcliente = c.idclientesproveedores  " +
    "left join mod_estructuracomp.dat_estructura de on de.idestructura = c.idestructura  " +
    "left join mod_persona.dat_persona dp on dp.idpersona = c.idpersona  " +
    "left join mod_estructuracomp.dat_estructuraop co on dc.idcliente = co.idestructuraop  " +
    "inner join mod_datosmaestros.dat_documentoprim dprm on dprm.iddoc = d.iddoc  " +
    "inner join mod_datosmaestros.dat_cierre ci on ci.idestructurasubsist = dprm.idestructurasubsist  " +
    "inner join mod_datosmaestros.dat_ejerciciocontable e on e.idejercicio = ci.idejercicioactual where d.estado in (3,9)"
}];
Ext.ns('Ext.erp.tcpedido');
Ext.erp.tcpedido.tpp = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        Ext.erp.tcpedido.tpp.superclass.constructor.call(this, config);
    },
    initComponent: function() {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcpedido.tpp.superclass.initComponent.call(this);
        this.initDashboard();
    },
    initDashboard: function(){
        this.DashboardPanel.addChart({
            title: 'Total de productos pedidos por cliente',
            allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
            chartType: 'column'
        }, /*[{data: [{cliente:'javier', cantidadprod: 35, denominacion: 'producto', cantidad:10}]}]*/Ext.erp.Sourcespedido[0], {
            x: {
                label: 'Cliente',
                source: 'cliente'
            },
            y: {
                label: 'Total producto pedido',
                source: 'cantidadprod'
            }
        },[{
            name: 'Total producto pedido',
            source: 'cantidadprod'
        }],[{///////// Filtros
             name: 'Cliente',
             value: 'cliente',
             multiselect: true,
             serialize: true
        },{ 
            name: 'Producto registrados en pedidos',
            value: 'denominacion',
            multiselect: true
        }],{//////Lista de criterios de serializacion
                'Producto registrados en pedidos': {
                        x: {
                            name: 'Producto',
                            source: 'denominacion'
                        },
                        y: [{
                            name: 'Cantidad producto pedido',
                            source: 'cantidad'
                        }]
                    }
                }
        );
        
        /*this.DashboardPanel.addChart({
            title: 'Cumplimiento-Pedido',
            allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
            chartType: 'line'
        }, Ext.erp.Sourcespedido[2],{
            x: {
                label: 'Cliente',
                source: 'cliente'
            },
            y: {
                label: 'Porciento cumplimiento',
                source: 'porciento'
            }
        },[{
            name: 'Porciento cumplimiento',
            source: 'porciento'
        }],[{
            name: 'Nombre cliente',
            source: 'cliente'
        },{
            name: 'Total cumplidos',
            source: 'total_cumplimentados'
        }],{
        Cumplimiento:[{
            name: 'Total pedidos',
            source: 'total_pedidos'
         },
         {
            name: 'Total cumplidos',
            source: 'total_cumplimentados'
        }
        ]});
     this.DashboardPanel.addChart({
            title: 'Pedidos con/sin reclamos',
            allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
            chartType: 'line'
        }, Ext.erp.Sourcespedido[3],{
            x: {
                label: 'Cliente',
                source: 'cliente'
            },
            y: {
                label: 'Total pedidos',
                source: 'total_pedidos'
            }
        },[{
            name: 'Total pedidos',
            source: 'total_pedidos'
        }],[{
            name: 'Nombre cliente',
            source: 'cliente'
        }],{
        Reclamos:[
        {
            name: 'Total pedidos',
            source: 'total_pedidos'
        },{
            name: 'Total sin reclamos',
            source: 'total_sin_reclamos'
         },
         {
            name: 'Total con reclamos',
            source: 'total_con_reclamos'
        }]});*/
        
    }
});

Ext.erp.tcpedido.cp = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        Ext.erp.tcpedido.cp.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcpedido.cp.superclass.initComponent.call(this);
        this.initDashboard();
    },
    initDashboard: function () {

        this.DashboardPanel.addChart({
         title: 'Porciento de cumplimiento de pedidos por cliente',
         allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
         chartType: 'line'
         }, Ext.erp.Sourcespedido[2],{
         x: {
         label: 'Cliente',
         source: 'cliente'
         },
         y: {
         label: 'Porciento cumplimiento',
         source: 'porciento'
         }
         },[{
         name: 'Porciento cumplimiento',
         source: 'porciento'
         }],[{
         name: 'Nombre cliente',
         source: 'cliente'
         },{
         name: 'Total cumplidos',
         source: 'total_cumplimentados'
         }],{
         'Cumplimiento de pedidos por cliente':[{
         name: 'Total pedidos',
         source: 'total_pedidos'
         },
         {
         name: 'Total cumplidos',
         source: 'total_cumplimentados'
         }
         ]});
         /*this.DashboardPanel.addChart({
         title: 'Pedidos con/sin reclamos',
         allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
         chartType: 'line'
         }, Ext.erp.Sourcespedido[3],{
         x: {
         label: 'Cliente',
         source: 'cliente'
         },
         y: {
         label: 'Total pedidos',
         source: 'total_pedidos'
         }
         },[{
         name: 'Total pedidos',
         source: 'total_pedidos'
         }],[{
         name: 'Nombre cliente',
         source: 'cliente'
         }],{
         Reclamos:[
         {
         name: 'Total pedidos',
         source: 'total_pedidos'
         },{
         name: 'Total sin reclamos',
         source: 'total_sin_reclamos'
         },
         {
         name: 'Total con reclamos',
         source: 'total_con_reclamos'
         }]});*/

    }
});

Ext.erp.tcpedido.csr = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        Ext.erp.tcpedido.csr.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcpedido.csr.superclass.initComponent.call(this);
        this.initDashboard();
    },
    initDashboard: function () {
        this.DashboardPanel.addChart({
         title: 'Total de pedidos',
         allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
         chartType: 'line'
         }, Ext.erp.Sourcespedido[3],{
         x: {
         label: 'Cliente',
         source: 'cliente'
         },
         y: {
         label: 'Total pedidos',
         source: 'total_pedidos'
         }
         },[{
         name: 'Total pedidos',
         source: 'total_pedidos'
         }],[{
         name: 'Nombre cliente',
         source: 'cliente'
         }],{
         'Pedidos con/sin reclamos':[
         {
         name: 'Total pedidos',
         source: 'total_pedidos'
         },{
         name: 'Total sin reclamos',
         source: 'total_sin_reclamos'
         },
         {
         name: 'Total con reclamos',
         source: 'total_con_reclamos'
         }]});

    }
});