
ALTER TABLE IF EXISTS mod_logtaller.nom_ubicaciontall
    ADD CONSTRAINT ak_denominacion UNIQUE (denominacion);

COMMENT ON CONSTRAINT ak_denominacion ON mod_logtaller.nom_ubicaciontall
    IS 'Restricción sobre la columna denominación para que no se repitan los nombres de las ubicaciones.';

INSERT INTO mod_logtaller.nom_ubicaciontall(idubicaciontall, denominacion, fechainicio, estado, inicial, final) 
VALUES (1, 'En taller', now()::date, 1, 1, 2) ON CONFLICT (denominacion) DO NOTHING;

INSERT INTO mod_logtaller.nom_ubicaciontall(idubicaciontall, denominacion, fechainicio, estado, inicial, final) 
VALUES (2, 'Entregado al cliente', now()::date, 1, 2, 1) ON CONFLICT (denominacion) DO NOTHING;

--Para los casos en que tenga valor ya el nomenclador (entorno de desarrollo).
UPDATE mod_logtaller.nom_ubicaciontall SET inicial=2, final=2 WHERE idubicaciontall NOT IN (1,2);

--Asignar a todas las órdenes de trabajo una ubicación inicial.

--Obtener las órdenes de trabajo y registrar una ubicación inicial (En taller) a todas.
WITH ordenes_trabajo AS ( SELECT doc.iddocumento, doc.idestructuracomun, ordtrab.fechainicio
							FROM mod_logistica.dat_documento AS doc
							INNER JOIN mod_logtaller.dat_ordentrabajo AS ordtrab 
						 		ON (doc.iddocumento = ordtrab.idordentrabajo)
						)
INSERT INTO mod_logtaller.dat_ubicaciontallorden(idubicaciontall, idestructuracomun, idordentrabajo, fechainicio)
SELECT 1, idestructuracomun, iddocumento, fechainicio FROM ordenes_trabajo;--INSERT 0 110043 in 8 secs 624 msec.

--Otorgar una estadia_calculada para la ubicación (En taller) para las órdenes de trabajo cerradas. estado = 9 del documento.
WITH ordenes_trabajo_cerradas AS ( SELECT doc.iddocumento, doc.idestructuracomun, ordtrab.fechacierre, 
								  			ubtord.fechainicio as fechainicioubicacioninicial, 
								  			(ordtrab.fechacierre-ubtord.fechainicio) as estadia_calculada,
								  			ubtord.idubicaciontallorden
							FROM mod_logistica.dat_documento AS doc
							INNER JOIN mod_logtaller.dat_ordentrabajo AS ordtrab 
						 		ON (doc.iddocumento = ordtrab.idordentrabajo)
							INNER JOIN mod_logtaller.dat_ubicaciontallorden AS ubtord
								ON (ubtord.idordentrabajo = ordtrab.idordentrabajo and ubtord.idubicaciontall = 1)
						 	WHERE doc.estado = 9 --cerrada
						 )
UPDATE mod_logtaller.dat_ubicaciontallorden AS uto
	SET fechafin=otc.fechacierre, estadia=otc.estadia_calculada
	FROM ordenes_trabajo_cerradas AS otc
	WHERE uto.idubicaciontallorden = otc.idubicaciontallorden;--UPDATE 106106 in 2 secs 836 msec.

--Obtener las órdenes de trabajo cerradas y registrar una ubicación final (Entregado al cliente) a todas.
WITH ordenes_trabajo_cerradas AS ( SELECT doc.iddocumento, doc.idestructuracomun, ordtrab.fechacierre
							FROM mod_logistica.dat_documento AS doc
							INNER JOIN mod_logtaller.dat_ordentrabajo AS ordtrab 
						 		ON (doc.iddocumento = ordtrab.idordentrabajo)
							WHERE doc.estado = 9 --cerrada
						 )
INSERT INTO mod_logtaller.dat_ubicaciontallorden(idubicaciontall, idestructuracomun, idordentrabajo, fechainicio, fechafin, estadia)
SELECT 2, idestructuracomun, iddocumento, fechacierre, fechacierre, 0 FROM ordenes_trabajo_cerradas;--INSERT 0 106106 in 6 secs 836 msec.
