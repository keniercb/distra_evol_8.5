update mod_logistica.dat_documentocliente as dc
set idcondicionpago = (select df.idcondicionpago from mod_logfacturacion.dat_docfactura df
where df.idfactura = dc.iddocumento)
where dc.iddocumento in (
select df1.idfactura from mod_logfacturacion.dat_docfactura df1
inner join mod_logistica.dat_documentocliente dcc on dcc.iddocumento = df1.idfactura
where dcc.idcondicionpago is null
) and dc.idcondicionpago is null