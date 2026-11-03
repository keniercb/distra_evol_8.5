create sequence mod_datosmaestros.sec_trazamp_seq
    maxvalue 9999999999;

create table mod_datosmaestros.seg_trazamp
(
    actionid smallint,
    dato     text,
    userid   bigint not null,
    objectid bigint not null,
    fecha    date,
    id       bigint default nextval('mod_datosmaestros.sec_trazamp_seq'::regclass)
        constraint nom_trazamp_pk
            primary key
);

comment on column mod_datosmaestros.seg_trazamp.actionid is 'Ambito en el cual se usara la variable
0- Carga inicial 1 - Adicionar 2 - Modificar 3 - Eliminar 4 - Habilita/Deshabilitar 5 - Aprobar/Desaprobar 6 - Nivel Plan';

insert into mod_datosmaestros.seg_trazamp(actionid, dato, userid, objectid, fecha)
select 0, '', -1, i.idindicador, now() ::date
from mod_datosmaestros.nom_indicador i;