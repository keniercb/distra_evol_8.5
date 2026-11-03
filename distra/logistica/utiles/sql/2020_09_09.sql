alter table mod_datosmaestros.nom_indicadorhoja
    add isuh numeric(1) default 0;

update mod_datosmaestros.nom_indicadorhoja
set isuh = 1 where idindicador in(
    select idindicador from mod_datosmaestros.nom_indicador where idnaturaleza = -5
);

alter table mod_logistica.dat_documento
    add idbloqueousuario numeric(19);

comment on column mod_logistica.dat_documento.idbloqueousuario is 'Identificador del usuario que bloquea el documento.';

create index idx_dat_documento_idbloqueousuario
    on mod_logistica.dat_documento (idbloqueousuario);

alter table mod_logistica.dat_documento
    add constraint fk_bloqueousuario_documento
        foreign key (idbloqueousuario) references mod_seguridad.seg_usuario;

