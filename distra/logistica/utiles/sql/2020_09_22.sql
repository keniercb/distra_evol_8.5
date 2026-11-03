alter table mod_logistica.dat_documento
    add qrdocumento text;

comment on column mod_logistica.dat_documento.qrdocumento is 'Codigo QR que sirve para identificar el documento';

alter table mod_logistica.dat_documento
    add qrpago text;

comment on column mod_logistica.dat_documento.qrpago is 'Codigo QR que sirver para efectual el pago de ducumento por enzona';

alter table mod_datosmaestros.nom_indicador add idfabricante numeric(19);

