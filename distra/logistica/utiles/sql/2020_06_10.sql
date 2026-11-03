drop index mod_logistica.idx_movimiento;

create unique index idx_movimiento
	on mod_logistica.dat_movimiento (iddocumento, idproducto, idclasificacion);