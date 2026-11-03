--1
ALTER TABLE IF EXISTS mod_logtaller.dat_ubicaciontallorden DROP CONSTRAINT IF EXISTS fk_ordentrabajo_ubicaciontall;

ALTER TABLE mod_logtaller.dat_ubicaciontallorden
  ADD CONSTRAINT fk_ordentrabajo_ubicaciontall FOREIGN KEY (idordentrabajo)
    REFERENCES mod_logtaller.dat_ordentrabajo(idordentrabajo)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

INSERT INTO 
  mod_logistica.nom_variableglobal
(
  nombre,
  valor
)
VALUES (
  'usarubicaciontall',
  0
);

UPDATE 
  mod_logistica.nom_variableglobal 
SET 
  valor = 1
WHERE 
  nombre ilike ('usarubicaciontall')
;

--2
--Obtener las órdenes de trabajo y registrar una ubicación inicial (En taller) a todas y no tienen ubicación actual en dat_ordentrabajo (2322 filas)
WITH ordenes_trabajo AS ( SELECT doc.iddocumento, doc.idestructuracomun, ordtrab.fechainicio
							FROM mod_logistica.dat_documento AS doc
							INNER JOIN mod_logtaller.dat_ordentrabajo AS ordtrab 
						 		ON (doc.iddocumento = ordtrab.idordentrabajo)
						    where ordtrab.ubicacionactual is null
						)
INSERT INTO mod_logtaller.dat_ubicaciontallorden(idubicaciontall, idestructuracomun, idordentrabajo, fechainicio)
SELECT 1, idestructuracomun, iddocumento, fechainicio FROM ordenes_trabajo;--INSERT 0 110043 in 8 secs 624 msec.

--Otorgar una estadia_calculada para la ubicación (En taller) para las órdenes de trabajo cerradas. estado = 9 del documento. (1877 filas)
WITH ordenes_trabajo_cerradas AS ( SELECT doc.iddocumento, doc.idestructuracomun, ordtrab.fechacierre, 
								  			ubtord.fechainicio as fechainicioubicacioninicial, 
								  			(ordtrab.fechacierre-ubtord.fechainicio) as estadia_calculada,
								  			ubtord.idubicaciontallorden
							FROM mod_logistica.dat_documento AS doc
							INNER JOIN mod_logtaller.dat_ordentrabajo AS ordtrab 
						 		ON (doc.iddocumento = ordtrab.idordentrabajo)
							INNER JOIN mod_logtaller.dat_ubicaciontallorden AS ubtord
								ON (ubtord.idordentrabajo = ordtrab.idordentrabajo and ubtord.idubicaciontall = 1)
								 WHERE ordtrab.ubicacionactual is null and doc.estado = 9 --cerrada
						 )
UPDATE mod_logtaller.dat_ubicaciontallorden AS uto
	SET fechafin=otc.fechacierre, estadia=otc.estadia_calculada
	FROM ordenes_trabajo_cerradas AS otc
	WHERE uto.idubicaciontallorden = otc.idubicaciontallorden;--UPDATE 106106 in 2 secs 836 msec.

--Obtener las órdenes de trabajo cerradas y registrar una ubicación final (Entregado al cliente) a todas. (1876)
WITH ordenes_trabajo_cerradas AS ( SELECT doc.iddocumento, doc.idestructuracomun, ordtrab.fechacierre
							FROM mod_logistica.dat_documento AS doc
							INNER JOIN mod_logtaller.dat_ordentrabajo AS ordtrab 
						 		ON (doc.iddocumento = ordtrab.idordentrabajo)
							WHERE ordtrab.ubicacionactual is null and doc.estado = 9 --cerrada
						 )
INSERT INTO mod_logtaller.dat_ubicaciontallorden(idubicaciontall, idestructuracomun, idordentrabajo, fechainicio, fechafin, estadia)
SELECT 2, idestructuracomun, iddocumento, fechacierre, fechacierre, 0 FROM ordenes_trabajo_cerradas;--INSERT 0 106106 in 6 secs 836 msec.

--3

--Órdenes de trabajo abiertas.(4609 filas)
with ordenes_trabajo_abiertas as ( select idordentrabajo from mod_logtaller.dat_ubicaciontallorden
									group by idordentrabajo having count(idordentrabajo) = 1
								 )
update mod_logtaller.dat_ordentrabajo as ot
	set ubicacionactual=1
	from ordenes_trabajo_abiertas as ota
	where ot.idordentrabajo = ota.idordentrabajo;

--Órdenes de trabajo cerradas(110 378)
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

--4

--Obtener las órdenes de trabajo y registrar la asignación por entidades a todas generando dos tuplas
--una para la ubicación 1- Taller y 2- Entregado al cliente. (0,14)
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

