alter table mod_logfacmagentoadmin.dat_mgtorderitems
    add id serial;
alter table mod_logfacmagentoadmin.dat_mgtorderitems
    add constraint dat_mgtorderitems_pk
        primary key (id);

