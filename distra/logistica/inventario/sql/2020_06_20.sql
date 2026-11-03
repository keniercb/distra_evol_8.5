create table mod_loginventario.dat_movinventario
(
	idmovimiento numeric(19) not null
		constraint dat_movinventario_pk
			primary key
		constraint dat_movinventario_dat_movimiento_idmovimiento_fk
			references mod_logistica.dat_movimiento
				on delete cascade,
	existenciaactual numeric(19,6) default 0,
	importeactual numeric(19,2) default 0,
	importealtactual numeric(19,2) default 0
);

comment on table mod_loginventario.dat_movinventario is 'Tabla que almacena el estado actual del producto en el momento de creacion de la hoja de inventario';

comment on column mod_loginventario.dat_movinventario.idmovimiento is 'Llave foranea que proviene de la tabla mod_logistica.dat_movimiento';

comment on column mod_loginventario.dat_movinventario.existenciaactual is 'Existencia actual del producto en el momento de genracion de la hoja de inevtario';

comment on column mod_loginventario.dat_movinventario.importeactual is 'Importe contable actual';

comment on column mod_loginventario.dat_movinventario.importealtactual is 'Importe alternativo actual';

alter table mod_loginventario.dat_movinventario
	add iddocumento numeric(19) not null;

comment on column mod_loginventario.dat_movinventario.iddocumento is 'Identificar del documento de inventario';

alter table mod_loginventario.dat_movinventario
	add constraint dat_movinventario_iddocumento_fk
		foreign key (iddocumento) references mod_logistica.dat_documento
			on delete cascade;

create or replace function mod_loginventario.f_generarajuste(p_iddocumento numeric, p_idorigen numeric, p_signo character varying) returns void
    language plpgsql
as
$$
declare
begin
 insert into mod_logistica.dat_movimiento (iddocumento, idproducto, cantidad, preciocontable, importecontable,precioalternativo,importealternativo,
 signo, idunidadmedida,diferencia)
 select distinct $1, p.idproducto,
(case when (l.idlote is null and dns.idnroserie is null and dpm.idproductomunic is null) then abs(dmi.existenciaactual - m.cantidad)  else 0 end),
 m.preciocontable,
 (case when l.idlote is null then abs(dmi.existenciaactual - m.cantidad) * m.preciocontable else 0 end),
  m.precioalternativo,
 (case when l.idlote is null then abs(dmi.existenciaactual - m.cantidad) * m.precioalternativo else 0 end),
 $3, p.idumedida,
 (case when (dns.idnroserie is not null or dpm.idproductomunic is not null) then abs(dmi.existenciaactual - m.cantidad) else 0 end)
 from mod_logistica.dat_producto p
 inner join mod_logistica.dat_movimiento m on m.idproducto = p.idproducto and m.iddocumento = $2
 inner join mod_loginventario.dat_movinventario dmi on m.idmovimiento = dmi.idmovimiento
 left join mod_logistica.dat_lote l on l.idproducto = p.idproducto
 left join mod_loginventario.dat_nroserie dns on dns.idproducto = m.idproducto
 left join mod_loginventario.dat_productomunic dpm on dpm.idproducto = m.idproducto
 where ($3 = '+'
 and dmi.existenciaactual < m.cantidad)
 or ($3 = '-'
 and dmi.existenciaactual > m.cantidad)
 or (l.idlote is not null
    and ($3 = '+'
        and (select sum(ml.cantidad) from mod_logistica.dat_movlote ml where ml.idlote = l.idlote
        and ml.idmovimiento = m.idmovimiento) > l.existencia
        or $3 = '-'
        and (select sum(ml2.cantidad) from mod_logistica.dat_movlote ml2 where ml2.idlote = l.idlote
        and ml2.idmovimiento = m.idmovimiento) < l.existencia));

 insert into mod_logistica.dat_movlote (idlote, idmovimiento, idubicacion, cantidad)
  select l.idlote, m2.idmovimiento, ul.idubicacion, abs(ul.cantidad - ml.cantidad)
   from mod_logistica.dat_movimiento m
   inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto
   inner join mod_logistica.dat_lote l on l.idproducto = m.idproducto
   inner join mod_logistica.dat_movlote ml on ml.idlote = l.idlote and ml.idmovimiento = m.idmovimiento
   inner join mod_logubicacion.dat_ubicacionlote ul on ul.idlote = l.idlote and ml.idubicacion = ul.idubicacion
   inner join mod_logistica.dat_movimiento m2 on m2.idproducto = m.idproducto and m2.iddocumento = $1
   where m.iddocumento = $2 and ($3 = '+' and ul.cantidad < ml.cantidad or $3 = '-' and ul.cantidad > ml.cantidad)
   group by m.idproducto, l.idlote, ul.cantidad, ml.cantidad, ul.idubicacion , m2.idmovimiento
   having ($3 = '+' and sum(ul.cantidad) < sum(ml.cantidad) or $3 = '-' and sum(ul.cantidad) > sum(ml.cantidad));

  update mod_logistica.dat_movimiento m
  set cantidad = (select sum(ml.cantidad) from mod_logistica.dat_movlote ml where ml.idmovimiento = m.idmovimiento),
  importecontable = (select (sum(ml2.cantidad) * m.preciocontable) from mod_logistica.dat_movlote ml2 where ml2.idmovimiento = m.idmovimiento)
  where m.iddocumento = $1 and m.idproducto in (select l.idproducto from mod_logistica.dat_lote l
  inner join mod_logistica.dat_movlote ml3 on ml3.idlote = l.idlote where ml3.idmovimiento = m.idmovimiento);

  insert into mod_logistica.dat_cantidadcomprometida (iddocumento, idproducto, cantidad)
  select $1 as iddocumento, m.idproducto as idproducto, m.cantidad as cantidad
  from mod_logistica.dat_movimiento m
  where m.iddocumento = $1 and m.signo = '-';

  insert into mod_logistica.dat_lotecomprometido(idlote,iddocumento,idubicacion,cantidad)
  select dml.idlote,$1,dml.idubicacion,dml.cantidad from mod_logistica.dat_movlote dml
  inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dml.idmovimiento
  where dm.iddocumento = $1;

  insert into mod_logubicacion.dat_ubicacioncomprometida(idubicacion,iddocumento,idproducto,cantidad)
  select dml.idubicacion,$1 as iddocumento,dm.idproducto,abs(dul.cantidad - dml.cantidad) as cantidad
  from mod_logistica.dat_movlote dml
  inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dml.idmovimiento
  inner join mod_logubicacion.dat_ubicacionlote dul on dul.idubicacion = dml.idubicacion and dul.idlote = dml.idlote
  where dm.iddocumento = $2;
end;
$$;

create or replace function mod_loginventario.f_actualizardifinventario(iddocumento numeric) returns void
    language plpgsql
as
$$
declare
begin
update mod_logistica.dat_movlote dml
    set cantidad = sub.cantidad
		from (
        select ml.idmovlote as idml,  ul.cantidad as cantidad
        from mod_logistica.dat_lote l
        inner join mod_logistica.dat_movlote ml on ml.idlote = l.idlote
        inner join mod_logistica.dat_movimiento m on m.idmovimiento = ml.idmovimiento
        inner join mod_logubicacion.dat_ubicacionlote ul on ul.idlote = l.idlote
        where m.iddocumento = $1 and ul.idubicacion = ml.idubicacion and m.cantidad = -1
    )as sub where sub.idml = dml.idmovlote;

    update mod_logistica.dat_movimiento
    set cantidad = q.cant,
    importecontable = q.importecont,
    importealternativo = q.importealt
    from (
        select m.idmovimiento as idmov, dmi.existenciaactual as cant, dmi.importealtactual as importealt, dmi.importeactual as importecont
            from mod_logistica.dat_movimiento m
            inner join mod_loginventario.dat_movinventario dmi on dmi.idmovimiento = m.idmovimiento
            where m.iddocumento = $1 and m.cantidad = -1

    )q where q.idmov = idmovimiento;
end;
$$;