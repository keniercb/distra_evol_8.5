--Fase 2 implementada el 31/10/2023
--Integridad referencial de la ubicación en el taller.
ALTER TABLE IF EXISTS mod_logtaller.dat_ordentrabajo
    ADD CONSTRAINT fk_ubicaciontall_ordentrabajo_idubicaciontall FOREIGN KEY (ubicacionactual)
    REFERENCES mod_logtaller.nom_ubicaciontall (idubicaciontall) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL
    NOT VALID;
COMMENT ON CONSTRAINT fk_ubicaciontall_ordentrabajo_idubicaciontall ON mod_logtaller.dat_ordentrabajo
    IS 'Referencia del nomenclador mod_logtaller.nom_ubicaciontall.';
CREATE INDEX IF NOT EXISTS idx_ordentrabajo_idubicaciontall
    ON mod_logtaller.dat_ordentrabajo(ubicacionactual);

--Órdenes de trabajo abiertas.
with ordenes_trabajo_abiertas as ( select idordentrabajo from mod_logtaller.dat_ubicaciontallorden
									group by idordentrabajo having count(idordentrabajo) = 1
								 )
update mod_logtaller.dat_ordentrabajo as ot
	set ubicacionactual=1
	from ordenes_trabajo_abiertas as ota
	where ot.idordentrabajo = ota.idordentrabajo;

--Órdenes de trabajo cerradas
with ordenes_trabajo_cerradas as ( select uto.idordentrabajo from mod_logtaller.dat_ubicaciontallorden as uto
								  	inner join mod_logistica.dat_documento as doc on (doc.iddocumento = uto.idordentrabajo)
									where doc.estado = 9 --cerrada
								  		and uto.idubicaciontall in (2) 
								  		and uto.idordentrabajo in (select idordentrabajo from mod_logtaller.dat_ubicaciontallorden
																group by idordentrabajo having count(idordentrabajo) = 2)								 
								 )
update mod_logtaller.dat_ordentrabajo as ot
	set ubicacionactual=2
	from ordenes_trabajo_cerradas as otc
	where ot.idordentrabajo = otc.idordentrabajo;

--Obtener las órdenes de trabajo y registrar la asignación por entidades a todas generando dos tuplas
--una para la ubicación 1- Taller y 2- Entregado al cliente.
with ordenes_trabajo_entidad as ( select distinct doc.idestructuracomun
									from mod_logistica.dat_documento as doc
									inner join mod_logtaller.dat_ordentrabajo as ordtrab on (doc.iddocumento = ordtrab.idordentrabajo)
								)
--1- Taller
insert into mod_logtaller.dat_ubicaciontallentidad(idubicaciontall, idestructuracomun)
(select 1,idestructuracomun from ordenes_trabajo_entidad);

--Obtener las órdenes de trabajo y registrar la asignación por entidades a todas generando dos tuplas
with ordenes_trabajo_entidad as ( select distinct doc.idestructuracomun
									from mod_logistica.dat_documento as doc
									inner join mod_logtaller.dat_ordentrabajo as ordtrab on (doc.iddocumento = ordtrab.idordentrabajo)
								)
--2- Entregado al cliente.								
insert into mod_logtaller.dat_ubicaciontallentidad(idubicaciontall, idestructuracomun)
(select 2,idestructuracomun from ordenes_trabajo_entidad);

