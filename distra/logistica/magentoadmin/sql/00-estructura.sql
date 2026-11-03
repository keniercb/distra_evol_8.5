create schema mod_logfacmagentoadmin;

create table mod_logfacmagentoadmin.dat_mgtorders
(
    id             varchar(100) not null
        constraint dat_mgtorders_pk
            primary key,
    fct            date,
    fcb            date,
    estadoov       integer default 1,
    direccion      text,
    entregar       varchar(100),
    importe        double precision,
    idueb          integer,
    mercancia      double precision,
    transportacion double precision,
    esatdofac      integer default 1,
    fechaentrega   date,
    transferido    integer default 0,
    idfactura      numeric(19)
);

alter table mod_logfacmagentoadmin.dat_mgtorders
    owner to zeolides;

create table mod_logfacmagentoadmin.dat_mgtorderitems
(
    orderid          varchar(100) not null
        constraint dat_mgtorderitems_dat_mgtorders_id_fk
            references mod_logfacmagentoadmin.dat_mgtorders
            on delete cascade,
    productid        numeric(19)  not null,
    cantidad         double precision,
    precio           double precision,
    importe          double precision,
    storageproductid numeric(19),
    id               serial
        constraint dat_mgtorderitems_pk
            primary key
);

comment on table mod_logfacmagentoadmin.dat_mgtorderitems is 'Tabla que almacena los productos facturados en una orde';

comment on column mod_logfacmagentoadmin.dat_mgtorderitems.cantidad is 'Cantidad del producto comprado';

comment on column mod_logfacmagentoadmin.dat_mgtorderitems.precio is 'Precio de venta del producto';

comment on column mod_logfacmagentoadmin.dat_mgtorderitems.importe is 'Importe de venta';

alter table mod_logfacmagentoadmin.dat_mgtorderitems
    owner to zeolides;
