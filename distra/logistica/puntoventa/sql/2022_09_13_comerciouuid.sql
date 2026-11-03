alter table mod_logpuntoventa.dat_caja add column  if not exists ezmerchantuuid varchar(100);
alter table mod_logpuntoventa.dat_caja add column  if not exists tmmerchantsource varchar(100);
alter table mod_logpuntoventa.dat_caja add column  if not exists consumersecret varchar(100);
alter table mod_logpuntoventa.dat_caja add column  if not exists consumerkey varchar(100);