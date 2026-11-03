create sequence mod_logistica.sec_nomvariableglobal_seq
    maxvalue 100000;

alter sequence mod_logistica.sec_nomvariableglobal_seq owner to zeolides;

create table mod_logistica.nom_variableglobal
(
    nombre varchar(100),
    valor varchar(100),
    id bigint default nextval('mod_logistica.sec_nomvariableglobal_seq'::regclass)
        constraint nom_variableglobal_pk
            primary key
);

create unique index nom_variableglobal_nombre_uindex
    on mod_logistica.nom_variableglobal (nombre);

alter table mod_logistica.nom_variableglobal
    add activo int default 1;

alter table mod_logistica.nom_variableglobal
    add ambito int default 1;

comment on column mod_logistica.nom_variableglobal.ambito is 'Ambito en el cual se usara la variable
1 - IU
2 - LN
3 - IU LN';
comment on column mod_logistica.nom_variableglobal.id is 'Identificador de la variable';
comment on column mod_logistica.nom_variableglobal.nombre is 'Nombre de la variable';
comment on column mod_logistica.nom_variableglobal.valor is 'Valor de la variable';
comment on column mod_logistica.nom_variableglobal.activo is 'Define si la variable esta activa o no';

alter table mod_logistica.nom_variableglobal alter column valor set default ''::character varying;
alter table mod_logistica.nom_variableglobal
    add datatype int default 2;
comment on column mod_logistica.nom_variableglobal.datatype is 'Tipo de dato de la variable 1 Numeros 2 Texto';
/**
  DATOS INICIALES
 */
INSERT INTO mod_logistica.nom_variableglobal (nombre, valor, id, activo, ambito, datatype) VALUES ('certificarGastos', 'false', 12, 1, 1, 2);
INSERT INTO mod_logistica.nom_variableglobal (nombre, valor, id, activo, ambito, datatype) VALUES ('comboentidad', 'false', 3, 1, 1, 2);
INSERT INTO mod_logistica.nom_variableglobal (nombre, valor, id, activo, ambito, datatype) VALUES ('centrobalance', 'false', 13, 1, 1, 2);
INSERT INTO mod_logistica.nom_variableglobal (nombre, valor, id, activo, ambito, datatype) VALUES ('development', 'true', 2, 1, 1, 2);
INSERT INTO mod_logistica.nom_variableglobal (nombre, valor, id, activo, ambito, datatype) VALUES ('OPRE_REC_TRANS_CG_CE', '1', 17, 1, 1, 2);
INSERT INTO mod_logistica.nom_variableglobal (nombre, valor, id, activo, ambito, datatype) VALUES ('OPRE_REC_TRANS_INT', '1', 16, 1, 1, 2);
INSERT INTO mod_logistica.nom_variableglobal (nombre, valor, id, activo, ambito, datatype) VALUES ('OPRE_REC_OP', '1', 19, 1, 1, 2);
INSERT INTO mod_logistica.nom_variableglobal (nombre, valor, id, activo, ambito, datatype) VALUES ('OPRE_REC_TRANS_CE_CG', '1', 18, 1, 1, 2);
INSERT INTO mod_logistica.nom_variableglobal (nombre, valor, id, activo, ambito, datatype) VALUES ('OPRE_REC_TRANS', '1', 15, 1, 1, 2);
INSERT INTO mod_logistica.nom_variableglobal (nombre, valor, id, activo, ambito, datatype) VALUES ('OPRE_REC_FAC', '1', 14, 1, 1, 2);
INSERT INTO mod_logistica.nom_variableglobal (nombre, valor, id, activo, ambito, datatype) VALUES ('melfi', 'false', 20, 1, 1, 2);



