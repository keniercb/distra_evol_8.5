Ext.ns('Ext.erp.Sources');
Ext.erp.Sourcesdistribucion = [{
    name: 'Cliente-Importe',
    sql:  "select coalesce(ncp.nombre,coalesce(de.denominacion,concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel))) as cliente, " +
    "((SELECT COALESCE(SUM(dmm.precio * m.cantidad),0) FROM mod_logistica.dat_movimiento m " +
    "INNER JOIN mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = m.idmovimiento "+
    "INNER JOIN mod_logistica.dat_documento dd on dd.iddocumento = m.iddocumento "+
    "INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento "+

    "INNER JOIN mod_logistica.dat_documentopadre ddp on df.idfactura = ddp.iddocumento "+
    "INNER JOIN mod_logdistribucion.dat_distribucion dist on dist.iddistribucion = ddp.idpadre "+
    "INNER JOIN mod_logistica.dat_documento dd1 on dd1.iddocumento = dist.iddistribucion " +

    "WHERE dd1.idestructuracomun = "+idestructura+" AND dmm.idmoneda= "+idmoneda+" "+
    "AND dd.estado = 4 and df.idcliente = ncp.idclientesproveedores) "+
    "+(SELECT COALESCE(SUM(ddcp.valorcalculo),0) FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp "+
    "INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura "+
    "INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dcpf.idfactura " +
    "INNER JOIN mod_logistica.dat_documento d on d.iddocumento = df.idfactura " +

    "INNER JOIN mod_logistica.dat_documentopadre ddp on df.idfactura = ddp.iddocumento " +
    "INNER JOIN mod_logdistribucion.dat_distribucion dist on dist.iddistribucion = ddp.idpadre " +
    "INNER JOIN mod_logistica.dat_documento dd1 on dd1.iddocumento = dist.iddistribucion " +

    "WHERE dd1.idestructuracomun = " + idestructura + " and ddcp.idmoneda = " + idmoneda + " " +
    " and ddcp.concepto = '+' and df.idcliente = ncp.idclientesproveedores) " +
    "-(SELECT COALESCE(SUM(ddcp.valorcalculo),0) FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp " +
    "INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura " +
    "INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dcpf.idfactura " +
    "INNER JOIN mod_logistica.dat_documento d on d.iddocumento = df.idfactura " +

    "INNER JOIN mod_logistica.dat_documentopadre ddp on df.idfactura = ddp.iddocumento " +
    "INNER JOIN mod_logdistribucion.dat_distribucion dist on dist.iddistribucion = ddp.idpadre " +
    "INNER JOIN mod_logistica.dat_documento dd1 on dd1.iddocumento = dist.iddistribucion " +

    "WHERE dd1.idestructuracomun = " + idestructura + " and ddcp.idmoneda = " + idmoneda + " " +
    " and ddcp.concepto = '-' and df.idcliente = ncp.idclientesproveedores)) as importecont, "+

    "((SELECT COALESCE(SUM(dmm.precio * m.cantidad),0) FROM mod_logistica.dat_movimiento m " +
    "INNER JOIN mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = m.idmovimiento " +
    "INNER JOIN mod_logistica.dat_documento dd on dd.iddocumento = m.iddocumento " +
    "INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento " +
    "INNER JOIN mod_logistica.dat_documentopadre ddp on df.idfactura = ddp.iddocumento " +
    "INNER JOIN mod_logdistribucion.dat_distribucion dist on dist.iddistribucion = ddp.idpadre " +
    "INNER JOIN mod_logistica.dat_documento dd1 on dd1.iddocumento = dist.iddistribucion " +
    "WHERE dd1.idestructuracomun = " + idestructura + " AND dmm.idmoneda= " + ((typeof idmonedaalternativa != 'undefined') ? idmonedaalternativa :-1) + " " +
    "AND dd.estado = 4 and df.idcliente = ncp.idclientesproveedores) " +
    "+(SELECT COALESCE(SUM(ddcp.valorcalculo),0) FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp " +
    "INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura " +
    "INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dcpf.idfactura " +
    "INNER JOIN mod_logistica.dat_documento d on d.iddocumento = df.idfactura " +
    "INNER JOIN mod_logistica.dat_documentopadre ddp on df.idfactura = ddp.iddocumento " +
    "INNER JOIN mod_logdistribucion.dat_distribucion dist on dist.iddistribucion = ddp.idpadre " +
    "INNER JOIN mod_logistica.dat_documento dd1 on dd1.iddocumento = dist.iddistribucion " +
    "WHERE dd1.idestructuracomun = " + idestructura + " and ddcp.idmoneda = " + ((typeof idmonedaalternativa != 'undefined') ? idmonedaalternativa : -1) + " " +
    " and ddcp.concepto = '+' and df.idcliente = ncp.idclientesproveedores) " +
    "-(SELECT COALESCE(SUM(ddcp.valorcalculo),0) FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp " +
    "INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf.idcategoriafactura = ddcp.idcategoriafactura " +
    "INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dcpf.idfactura " +
    "INNER JOIN mod_logistica.dat_documento d on d.iddocumento = df.idfactura " +
    "INNER JOIN mod_logistica.dat_documentopadre ddp on df.idfactura = ddp.iddocumento " +
    "INNER JOIN mod_logdistribucion.dat_distribucion dist on dist.iddistribucion = ddp.idpadre " +
    "INNER JOIN mod_logistica.dat_documento dd1 on dd1.iddocumento = dist.iddistribucion " +
    "WHERE dd1.idestructuracomun = " + idestructura + " and ddcp.idmoneda = " + ((typeof idmonedaalternativa != 'undefined') ? idmonedaalternativa : -1) + " " +
    " and ddcp.concepto = '-' and df.idcliente = ncp.idclientesproveedores)) as importealt "
    +"from mod_logistica.dat_documento dd inner join mod_logfacturacion.dat_docfactura ddf on ddf.idfactura = dd.iddocumento " +
    "inner join mod_logistica.dat_documentopadre ddp on ddf.idfactura = ddp.iddocumento "+
    "inner join mod_logdistribucion.dat_distribucion ddist on ddist.iddistribucion = ddp.idpadre "+
    "inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = ddist.iddistribucion "+
    "inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento left join mod_datosmaestros.nom_clientesproveedor ncp on ddc.idcliente = ncp.idclientesproveedores " +
    "left join mod_estructuracomp.dat_estructura de on de.idestructura = ncp.idestructura left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona " +
    "where dd.estado = 4 and dd1.idestructuracomun = " +idestructura+" "+
    "group by ncp.nombre,de.denominacion,dp.nombre,dp.snombre,dp.papel,dp.sapel,ncp.idclientesproveedores"
},{
    name: 'Pedidos-Facturas',
    sql: "select dped.iddocumento,count(dped.iddocumento) as cantpedidos " +
    ",coalesce(ncp.nombre,coalesce(de.denominacion,concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel))) as cliente, " +
    "   (select count(drp.idpedido) from mod_logdistribucion.dat_reclamopedido drp where drp.idpedido = dped.iddocumento) as cantreclamos, " +
    "    (select count(ddi.idpedido) from mod_logdistribucion.dat_distribucionpedido ddi where ddi.idpedido = dped.iddocumento) as cantdistribuidos, " +
    "    ( " +
    "	select count(df.idfactura) from mod_logfacturacion.dat_docfactura df " +
    "	inner join mod_logistica.dat_documento d on d.iddocumento = df.idfactura " +
    "	inner join mod_datosmaestros.dat_documentoprim dprm on dprm.iddoc = d.iddoc " +
    "	inner join mod_datosmaestros.nom_docprim ndprm on ndprm.iddocumentos = dprm.iddocumentos " +
    "	inner join mod_logistica.dat_documentopadre dpad on d.iddocumento = dpad.iddocumento " +
    "	inner join mod_logdistribucion.dat_distribucion dist on dist.iddistribucion = dpad.idpadre " +
    "	inner join mod_logistica.dat_documento d1 on d1.iddocumento = dist.iddistribucion " +
    "	inner join mod_logdistribucion.dat_distribucionpedido disp on dist.iddistribucion = disp.iddistribucion " +
    "	where disp.idpedido = dped.iddocumento and df.idcliente = ncp.idclientesproveedores and d.estado = 4 and d1.idestructuracomun = " + idestructura + " and ndprm.abreviatura = 'facturaLog' " +
    "   ) as cantfacturas  " +
    "    from mod_logistica.dat_documento dd  " +
    "    inner join mod_logdistribucion.dat_pedido dped on dped.iddocumento = dd.iddocumento  " +
    "    inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento  " +
    "    left join mod_datosmaestros.nom_clientesproveedor ncp on ddc.idcliente = ncp.idclientesproveedores  " +
    "    left join mod_estructuracomp.dat_estructura de on de.idestructura = ncp.idestructura  " +
    "    left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona  " +
    "    where dd.idestructuracomun = " + idestructura + " and dd.estado in(3, 9) group by ncp.idclientesproveedores,ncp.nombre,de.denominacion,dp.nombre,dp.snombre,dp.papel,dp.sapel,dped.iddocumento "
}/*,{
    name: 'Entregas perfectas',
    sql: "select * from mod_loginventario.f_entregaperfecta(" + idestructura + ",2016)"
}*/];
Ext.ns('Ext.erp.tcdistribucion');
Ext.erp.tcdistribucion.ci = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        Ext.erp.tcdistribucion.ci.superclass.constructor.call(this, config);
    },
    initComponent: function() {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcdistribucion.ci.superclass.initComponent.call(this);
        this.initDashboard();
    },
    initDashboard: function(){
        var arrayImport = [{
            name: 'Importe '+codigoiso,
            source: 'importecont'
        }];
        if(typeof idmonedaalternativa != 'undefined'){
            arrayImport.push({
                name: 'Importe ' + codigoisoalt,
                source: 'importealt'
            });
        }
        this.DashboardPanel.addChart({
            title: 'Cliente-Importe',
            allowTypes: ['line', 'column', 'spline', 'area'],
            chartType: 'column'
        }, Ext.erp.Sourcesdistribucion[0], {
            x: {
                label: 'Cliente',
                source: 'cliente'
            },
            y: {
                label: 'Importes',
                source: 'importes'
            }
        }, arrayImport);
        /*this.DashboardPanel.addChart({
            title: 'Cliente-Facturas',
            allowTypes: ['line', 'column', 'spline'],
            chartType: 'column'
        }, Ext.erp.Sourcesdistribucion[1],{
            x: {
                label: 'Cliente',
                source: 'cliente'
            },
            y: {
                label: 'Valor',
                source: 'valor'
            }
        },[{
            name: 'Cantidad de reclamos',
            source: 'cantreclamos'
        },{
            name: 'Cantidad distribuidos',
            source: 'cantdistribuidos'
        },{
            name: 'Cantidad de facturas',
            source: 'cantfacturas'
        },{
            name: 'Cantidad de pedidos',
            source: 'cantpedidos'
        }]);
        this.DashboardPanel.addChart({
            title: 'Indicador-Lotes Vencidos',
            allowTypes: ['line', 'column', 'spline'],
            chartType: 'spline'
        }, Ext.erp.Sourcesdistribucion[2],{
            x: {
                label: 'Indicador',
                source: 'denominacion'
            },
            y: {
                label: 'Valor',
                source: 'valor'
            }
        },[{
            name: 'Lotes Vencidos',
            source: 'cantlotesvencidos'
        },{
            name: 'Lotes por vencer',
            source: 'cantlotesproxvencer'
        }]);*/
    }
});

Ext.erp.tcdistribucion.cf = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        Ext.erp.tcdistribucion.cf.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcdistribucion.cf.superclass.initComponent.call(this);
        this.initDashboard();
    },
    initDashboard: function () {
        this.DashboardPanel.addChart({
         title: 'Pedidos-Facturas',
         allowTypes: ['line', 'column', 'spline'],
         chartType: 'column'
         }, Ext.erp.Sourcesdistribucion[1],{
         x: {
         label: 'Cliente',
         source: 'cliente'
         },
         y: {
         label: 'Valor',
         source: 'valor'
         }
         },[{
         name: 'Cantidad de reclamos',
         source: 'cantreclamos'
         },{
         name: 'Cantidad de distribuciones',
         source: 'cantdistribuidos'
         },{
         name: 'Cantidad de facturas',
         source: 'cantfacturas'
         },{
         name: 'Cantidad de pedidos',
         source: 'cantpedidos'
         }]);
    }
});

Ext.erp.tcdistribucion.ep = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        var _this = this;
        this.date = new Date();
        this.anno = new LOG.util.YearField({
            fieldLabel: 'Año',
            emptyText: 'Año',
            name: 'anno',
            totalYears: 5,
            maxValue: _this.date.getFullYear(),
            minValue: _this.date.getFullYear() - 5,
            listeners: {
                'select': function (cmb) {
                    Ext.erp.Sourcesdistribucion[2] = {
                        name: 'Entregas perfectas',
                        sql: "select * from mod_loginventario.f_entregaperfecta(" + idestructura + ","+cmb.getValue()+")"
                    };
                    if (_this.DashboardPanel) {
                        _this.DashboardPanel.removeAll();
                    }

                    _this.initDashboard();
                }
            }
        });
        this.tbar = ['->', this.anno];
        Ext.erp.tcdistribucion.ep.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        var _this = this;
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcdistribucion.ep.superclass.initComponent.call(this);
        this.initDashboard();
        this.anno.setValue(_this.date.getFullYear());
        this.anno.fireEvent('select', _this.anno,
            _this.anno.getStore().getById(_this.date.getFullYear()),
            _this.anno.getStore().indexOfId(_this.date.getFullYear()));
    },
    initDashboard: function () {
         this.DashboardPanel.addChart({
         title: 'Entregas perfectas',
         allowTypes: ['line', 'column', 'spline'],
         chartType: 'spline'
         }, Ext.erp.Sourcesdistribucion[2],{
         x: {
         label: 'Meses',
         source: 'mes', notSort: true
         },
         y: {
         label: 'Cantidad',
         source: 'valor'
         }
         },[{
         name: 'Cantidad de pedidos',
         source: 'cantpedido'
         },{
         name: 'Cantidad de pedidos cumplimentados',
         source: 'cantcumplimentado'
         }, {
             name: 'Cantidad de entregas perfectas',
             source: 'cantperfecto'
         }]);
    }
});
