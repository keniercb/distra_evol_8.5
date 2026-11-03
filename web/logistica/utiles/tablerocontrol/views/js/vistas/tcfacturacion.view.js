Ext.ns('Ext.erp.Sources');
Ext.erp.Sourcesfacturacion = [{
    name: 'Cliente-Facturas',
    sql:  "select distinct c.idclientesproveedores, " +
"coalesce(c.nombre, coalesce(e.denominacion, concat(p.nombre, ' ', p.snombre, ' ', p.papel, ' ', p.sapel))) as cliente, " +
"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and f1.oferta = 0) as total, " +

"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and d1.estado = 1 and f1.oferta = 0) as elaboracion, " +

"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and d1.estado = 2 and f1.oferta = 0) as preparado, " +

"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and d1.estado = 7 and f1.oferta = 0) as cancelado, " +

"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and d1.estado = 4 and f1.oferta = 0) as contabilizado, " +

"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and d1.estado = 4 and f1.oferta = 0) * 100 / " +
"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and f1.oferta = 0) as porciento_contabilizado " +

"from mod_datosmaestros.nom_clientesproveedor c " +
"inner join mod_logfacturacion.dat_docfactura f on f.idcliente = c.idclientesproveedores " +
"inner join mod_logistica.dat_documento d on d.iddocumento = f.idfactura " +
"left join mod_estructuracomp.dat_estructura e on e.idestructura = c.idestructura " +
"left join mod_persona.dat_persona p on p.idpersona = c.idpersona where d.estado in (1, 2, 4, 7) and f.oferta = 0 "+
"and d.idestructuracomun = "+idestructura
},{
    name: 'Ofertas-Cliente',
    sql:  "select distinct c.idclientesproveedores, " +
"coalesce(c.nombre, coalesce(e.denominacion, concat(p.nombre, ' ', p.snombre, ' ', p.papel, ' ', p.sapel))) as cliente, " +
"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and f1.oferta = 1) as total, " +

"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and d1.estado = 1 and f1.oferta = 1) as elaboracion, " +

"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and d1.estado = 2 and f1.oferta = 1) as preparado, " +

"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and d1.estado = 3 and f1.oferta = 1) as aprobado, " +


"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and d1.estado = 3 and f1.oferta = 1 " +
"and d1.iddocumento in (select dp.idpadre from mod_logistica.dat_documentopadre dp " +
"inner join mod_logdistribucion.dat_pedido df on df.iddocumento = dp.iddocumento " +
"inner join mod_logistica.dat_documento dd on dd.iddocumento = df.iddocumento " +
"where dd.estado = 3)) as cant_en_factura " +

"from mod_datosmaestros.nom_clientesproveedor c " +
"inner join mod_logfacturacion.dat_docfactura f on f.idcliente = c.idclientesproveedores " +
"inner join mod_logistica.dat_documento d on d.iddocumento = f.idfactura " +
"left join mod_estructuracomp.dat_estructura e on e.idestructura = c.idestructura " +
"left join mod_persona.dat_persona p on p.idpersona = c.idpersona " +
"where d.estado in (1, 2, 3) and f.oferta = 1 and d.idestructuracomun = " + idestructura
},{
    name: 'Cliente-Notas',
    sql:  "select distinct c.idclientesproveedores, " +
"coalesce(c.nombre, coalesce(e.denominacion, concat(p.nombre, ' ', p.snombre, ' ', p.papel, ' ', p.sapel))) as cliente, " +
"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and f1.esnota = 1) as total, " +

"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and d1.estado = 1 and f1.esnota = 1) as elaboracion, " +

"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and d1.estado = 2 and f1.esnota = 1) as preparado, " +

"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and d1.estado = 7 and f1.esnota = 1) as cancelado, " +

"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and d1.estado = 4 and f1.esnota = 1) as contabilizado, " +

"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and d1.estado = 4 and f1.esnota = 1) * 100 / " +
"(select count(*) from mod_logistica.dat_documento d1 " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = d1.iddocumento " +
"where f1.idcliente = f.idcliente and f1.esnota = 1) as porciento_contabilizado " +

"from mod_datosmaestros.nom_clientesproveedor c " +
"inner join mod_logfacturacion.dat_docfactura f on f.idcliente = c.idclientesproveedores " +
"inner join mod_logistica.dat_documento d on d.iddocumento = f.idfactura " +
"left join mod_estructuracomp.dat_estructura e on e.idestructura = c.idestructura " +
"left join mod_persona.dat_persona p on p.idpersona = c.idpersona where d.estado in (1, 2, 4, 7) and f.esnota = 1 " +
"and d.idestructuracomun = "+idestructura
},{
    name: 'Cliente-Importes',
    sql:  "select distinct c.idclientesproveedores, " +
"coalesce(c.nombre, coalesce(e.denominacion, concat(p.nombre, ' ', p.snombre, ' ', p.papel, ' ', p.sapel))) as cliente, " +

"(select coalesce (sum (round (mm.precio * m.cantidad, 2)), 0) from mod_logistica.dat_movmoneda mm " +
"inner join mod_datosmaestros.nom_moneda nm on nm.idmoneda = mm.idmoneda " +
"inner join mod_logistica.dat_movimiento m on m.idmovimiento = mm.idmovimiento " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = m.iddocumento " +
"where f1.idcliente = c.idclientesproveedores and nm.codigoiso = 'CUP')+ " +
"(select coalesce (sum (round (de.preciotarifa * ef.cantidad, 2)), 0) from mod_logfacturacion.dat_desgloselemento de " +
"inner join mod_datosmaestros.nom_moneda nm on nm.idmoneda = de.idmoneda " +
"inner join mod_logfacturacion.dat_elementosfactura ef on ef.idelementofactura = de.idelementofactura " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = ef.idfactura " +
"where f1.idcliente = c.idclientesproveedores and nm.codigoiso = 'CUP')  as importecup, " +

"(select coalesce (sum (round (mm.precio * m.cantidad, 2)), 0) from mod_logistica.dat_movmoneda mm " +
"inner join mod_datosmaestros.nom_moneda nm on nm.idmoneda = mm.idmoneda " +
"inner join mod_logistica.dat_movimiento m on m.idmovimiento = mm.idmovimiento " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = m.iddocumento " +
"where f1.idcliente = c.idclientesproveedores and nm.codigoiso = 'CUC')+ " +
"(select coalesce (sum (round (de.preciotarifa * ef.cantidad, 2)), 0) from mod_logfacturacion.dat_desgloselemento de " +
"inner join mod_datosmaestros.nom_moneda nm on nm.idmoneda = de.idmoneda " +
"inner join mod_logfacturacion.dat_elementosfactura ef on ef.idelementofactura = de.idelementofactura " +
"inner join mod_logfacturacion.dat_docfactura f1 on f1.idfactura = ef.idfactura " +
"where f1.idcliente = c.idclientesproveedores and nm.codigoiso = 'CUC') as importecuc " +

"from mod_datosmaestros.nom_clientesproveedor c " +
"inner join mod_logfacturacion.dat_docfactura f on f.idcliente = c.idclientesproveedores " +
"inner join mod_logistica.dat_documento d on d.iddocumento = f.idfactura " +
"left join mod_estructuracomp.dat_estructura e on e.idestructura = c.idestructura " +
"left join mod_persona.dat_persona p on p.idpersona = c.idpersona where d.estado = 4 "+
"and d.idestructuracomun = " + idestructura
}
];
Ext.ns('Ext.erp.tcfacturacion');
Ext.erp.tcfacturacion.cf = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        Ext.erp.tcfacturacion.cf.superclass.constructor.call(this, config);
    },
    initComponent: function() {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcfacturacion.cf.superclass.initComponent.call(this);

        this.initDashboard();
    },
    initDashboard: function(){
        this.DashboardPanel.addChart({
            title: 'Cliente-Facturas',
            allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
            chartType: 'column',
            legend: {
                align: 'center',
                borderWidth: 1,
            }
        }, Ext.erp.Sourcesfacturacion[0], {
            x: {
                label: 'Cliente',
                source: 'cliente'
            },
            y: {
                label: 'Cantidad facturas',
                source: 'total'
            }
         },[{
            name: 'Cantidad facturas',
            source: 'total'
        }],[{
            name: 'Nombre cliente',
            source: 'cliente'
        }],{
        Documento:[
        {
            name: 'Facturas elaboracion',
            source: 'elaboracion'
        },{
            name: 'Facturas preparadas',
            source: 'preparado'
         },
         {
            name: 'Facturas canceladas',
            source: 'cancelado'
        },{
            name: 'Facturas contabilizadas',
            source: 'contabilizado'
        }
    ]});

       /*this.DashboardPanel.addChart({
            title: 'Cliente-Ofertas',
            allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
            chartType: 'area'
        }, Ext.erp.Sourcesfacturacion[1], {
            x: {
                label: 'Cliente',
                source: 'cliente'
            },
            y: {
                label: 'Cantidad ofrertas',
                source: 'total'
            }
         },[{
            name: 'Cantidad ofertas',
            source: 'total'
        }],[{
            name: 'Nombre cliente',
            source: 'cliente'
        }],{
        Documento:[
        {
            name: 'Facturas elaboracion',
            source: 'elaboracion'
        },{
            name: 'Facturas preparadas',
            source: 'preparado'
         },
         {
            name: 'Facturas aprobadas',
            source: 'aprobado'
        }
    ]});

       this.DashboardPanel.addChart({
            title: 'Cliente-Notas',
            allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
            chartType: 'line'
        }, Ext.erp.Sourcesfacturacion[2], {
            x: {
                label: 'Cliente',
                source: 'cliente'
            },
            y: {
                label: 'Cantidad notas',
                source: 'total'
            }
         },[{
            name: 'Cantidad notas',
            source: 'total'
        }],[{
            name: 'Nombre cliente',
            source: 'cliente'
        }],{
        Documento:[
        {
            name: 'Facturas elaboracion',
            source: 'elaboracion'
        },{
            name: 'Facturas preparadas',
            source: 'preparado'
         },
         {
            name: 'Facturas contabilizadas',
            source: 'contabilizado'
        },{
            name: 'Facturas canceladas',
            source: 'cancelado'
        }

    ]});

      this.DashboardPanel.addChart({
            title: 'Cliente-Importes',
            allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
            chartType: 'pie'
        }, Ext.erp.Sourcesfacturacion[3], {
            x: {
                label: 'Cliente',
                source: 'cliente'
            },
            y: {
                label: 'Importe en CUP',
                source: 'importecup'
            }
         },[{
            name: 'Importe en CUP',
            source: 'importecup'
        }],[{
            name: 'Nombre cliente',
            source: 'cliente'
        }],{
        Importes:[
        {
            name: 'Importe en CUP',
            source: 'importecup'
        },{
           name: 'Importe en CUC',
            source: 'importecuc'
         }

    ]});*/

    }
});

Ext.erp.tcfacturacion.co = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        Ext.erp.tcfacturacion.co.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcfacturacion.co.superclass.initComponent.call(this);

        this.initDashboard();
    },
    initDashboard: function () {
        this.DashboardPanel.addChart({
         title: 'Cliente-Ofertas',
         allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
         chartType: 'area',
            legend: {
                align: 'center'
            }
         }, Ext.erp.Sourcesfacturacion[1], {
         x: {
         label: 'Cliente',
         source: 'cliente'
         },
         y: {
         label: 'Cantidad ofrertas',
         source: 'total'
         }
         },[{
         name: 'Cantidad ofertas',
         source: 'total'
         }],[{
         name: 'Nombre cliente',
         source: 'cliente'
         }],{
         Documento:[
         {
         name: 'Facturas elaboracion',
         source: 'elaboracion'
         },{
         name: 'Facturas preparadas',
         source: 'preparado'
         },
         {
         name: 'Facturas aprobadas',
         source: 'aprobado'
         }
         ]});
    }
});

Ext.erp.tcfacturacion.cn = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        Ext.erp.tcfacturacion.cn.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcfacturacion.cn.superclass.initComponent.call(this);

        this.initDashboard();
    },
    initDashboard: function () {
         this.DashboardPanel.addChart({
         title: 'Cliente-Notas',
         allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
         chartType: 'line',
             legend: {
                 align: 'center'
             }
         }, Ext.erp.Sourcesfacturacion[2], {
         x: {
         label: 'Cliente',
         source: 'cliente'
         },
         y: {
         label: 'Cantidad notas',
         source: 'total'
         }
         },[{
         name: 'Cantidad notas',
         source: 'total'
         }],[{
         name: 'Nombre cliente',
         source: 'cliente'
         }],{
         Documento:[
         {
         name: 'Facturas elaboracion',
         source: 'elaboracion'
         },{
         name: 'Facturas preparadas',
         source: 'preparado'
         },
         {
         name: 'Facturas contabilizadas',
         source: 'contabilizado'
         },{
         name: 'Facturas canceladas',
         source: 'cancelado'
         }

         ]});

         /*this.DashboardPanel.addChart({
         title: 'Cliente-Importes',
         allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
         chartType: 'pie'
         }, Ext.erp.Sourcesfacturacion[3], {
         x: {
         label: 'Cliente',
         source: 'cliente'
         },
         y: {
         label: 'Importe en CUP',
         source: 'importecup'
         }
         },[{
         name: 'Importe en CUP',
         source: 'importecup'
         }],[{
         name: 'Nombre cliente',
         source: 'cliente'
         }],{
         Importes:[
         {
         name: 'Importe en CUP',
         source: 'importecup'
         },{
         name: 'Importe en CUC',
         source: 'importecuc'
         }

         ]});*/

    }
});

Ext.erp.tcfacturacion.ci = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        Ext.erp.tcfacturacion.ci.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcfacturacion.ci.superclass.initComponent.call(this);

        this.initDashboard();
    },
    initDashboard: function () {
        this.DashboardPanel.addChart({
         title: 'Cliente-Importes',
         allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
         chartType: 'pie',
            legend: {
                align: 'left',
                layout: 'vertical',
                verticalAlign: 'top',
            }
         }, Ext.erp.Sourcesfacturacion[3], {
         x: {
         label: 'Cliente',
         source: 'cliente'
         },
         y: {
         label: 'Importe en CUP',
         source: 'importecup'
         }
         },[{
         name: 'Importe en CUP',
         source: 'importecup'
         }],[{
         name: 'Nombre cliente',
         source: 'cliente'
         }],{
         Importes:[
         {
         name: 'Importe en CUP',
         source: 'importecup'
         },{
         name: 'Importe en CUC',
         source: 'importecuc'
         }

         ]});

    }
});