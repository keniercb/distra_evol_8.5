Ext.ns('Ext.erp.Sources');
Ext.erp.Sourcespuntoventa = [{
    name: 'Cliente-Importe',
    sql:  "select count(ddf.idfactura), coalesce(ncp.nombre,coalesce(de.denominacion,concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel))) as cliente, " +
    "sum(ddf.importetotal) as importes from mod_logistica.dat_documento dd inner join mod_logfacturacion.dat_docfactura ddf on ddf.idfactura = dd.iddocumento " +
    "inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento left join mod_datosmaestros.nom_clientesproveedor ncp on ddc.idcliente = ncp.idclientesproveedores " +
    "left join mod_estructuracomp.dat_estructura de on de.idestructura = ncp.idestructura left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona " +
    "group by ddf.idfactura,ncp.nombre,de.denominacion,dp.nombre,dp.snombre,dp.papel,dp.sapel"
},{
    name: 'Cliente-Facturas',
    sql:  "select dped.iddocumento,count(dped.iddocumento) as cantpedidos,coalesce(ncp.nombre,coalesce(de.denominacion,concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel))) as cliente," +
    "(select count(drp.idpedido) from mod_logdistribucion.dat_reclamopedido drp where drp.idpedido = dped.iddocumento) as cantreclamos," +
    "(select count(ddi.idpedido) from mod_logdistribucion.dat_distribucionpedido ddi where ddi.idpedido = dped.iddocumento) as cantdistribuidos," +
    "(SELECT count(ddpad.iddocumento) from mod_logistica.dat_documentopadre ddpad where ddpad.iddocumento = dped.iddocumento) as cantfacturas " +
    "from mod_logistica.dat_documento dd inner join mod_logdistribucion.dat_pedido dped on dped.iddocumento = dd.iddocumento " +
    "inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento left join mod_datosmaestros.nom_clientesproveedor ncp on ddc.idcliente = ncp.idclientesproveedores " +
    "left join mod_estructuracomp.dat_estructura de on de.idestructura = ncp.idestructura left join mod_persona.dat_persona dp on dp.idpersona = ncp.idpersona " +
    "where dd.estado in(3) group by ncp.idclientesproveedores,ncp.nombre,de.denominacion,dp.nombre,dp.snombre,dp.papel,dp.sapel,dped.iddocumento"
},{
    name: 'Indicador-Lotes Vencidos',
    sql:  "select ni.denominacion,(select count(dl.idproducto) from mod_logistica.dat_lote dl where dl.idproducto = dprod.idproducto and dl.fechavencimiento > now()) as cantlotesvencidos," +
    "(select count(dl.idproducto) from mod_logistica.dat_lote dl where dl.idproducto = dprod.idproducto and dl.fechavencimiento > (dl.fechavencimiento - 15)) as cantlotesproxvencer " +
    "from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento " +
    "inner join mod_logistica.dat_producto dprod on dprod.idproducto = dm.idproducto inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador " +
    "group by ni.denominacion,dprod.idproducto"
}];
Ext.ns('Ext.erp.tcpuntoventa');
Ext.erp.tcpuntoventa = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        Ext.erp.tcpuntoventa.superclass.constructor.call(this, config);
    },
    initComponent: function() {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcpuntoventa.superclass.initComponent.call(this);
        this.initDashboard();
    },
    initDashboard: function(){
        this.DashboardPanel.addChart({
            title: 'Cliente-Importe',
            allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
            chartType: 'area'
        }, Ext.erp.Sourcespuntoventa[0], {
            x: {
                label: 'Cliente',
                source: 'cliente'
            },
            y: {
                label: 'Importes',
                source: 'importes'
            }
        });
        this.DashboardPanel.addChart({
            title: 'Cliente-Facturas',
            allowTypes: ['line', 'column', 'spline'],
            chartType: 'column'
        }, Ext.erp.Sourcespuntoventa[1],{
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
        }, Ext.erp.Sourcespuntoventa[2],{
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
        }]);
    }
});