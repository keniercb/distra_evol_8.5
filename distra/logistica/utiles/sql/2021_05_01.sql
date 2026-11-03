alter table mod_logistica.dat_estadoalmacen
    add idperiodo numeric(19);

alter table mod_logistica.dat_estadoalmacen
    add fecha date;

create index dat_estadoalmacen_idx1
    on mod_logistica.dat_estadoalmacen (idperiodo);

create index dat_estadoalmacen_idx2
    on mod_logistica.dat_estadoalmacen (fecha);