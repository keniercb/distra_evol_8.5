------------------Nota
/*Todo el proceso debe hacerse con un super usuario
Incluir la verdadera funcion*/
----------------------TYPOS DE RETORNOS
CREATE TYPE td_cid AS (
 schemaname name,
 tablename name
 );
CREATE TYPE td_return AS (
  oidtg   oid,
 oidproc oid,
 usename name,
 client_addr inet,
 client_port integer,
 tta timestamp with time zone,
 tcce timestamp with time zone, 
 mip timestamp with time zone
 );
------------------FUNCIÓN PARA APLICAR LOS MECANISMOS DE CID
CREATE FUNCTION ft_cidet()
  RETURNS SETOF public.td_return  AS
$BODY$
DECLARE
tablaexiste public.td_cid;
resultado public.td_return;
contador integer;
BEGIN
-------Se activa el parámetro track_activities: garantiza el monitoreo de las transacciones.
set track_activities='on';
--------Identifica si el procedimiento del trigger esta creado, en caso  negativo lo crea.
contador:=(SELECT count(proname) FROM pg_proc where proname='ft_cid');
IF contador=0 THEN
/*EXECUTE 'CREATE FUNCTION ft_cid()
  RETURNS trigger AS
''$libdir/libpsqlCID.so'', ''cAccDto''
  LANGUAGE c VOLATILE
  COST 1';*/
EXECUTE 'CREATE OR REPLACE FUNCTION ft_cid()
  RETURNS trigger AS
$'||'BODY'||'$
BEGIN	  
		RETURN NEW;
		END;
		$'||'BODY'||'$
  LANGUAGE plpgsql VOLATILE
  COST 100';
END IF; 
----------------Obtiene las entidades de la BD que no presenta el trigger creado y lo crea.
FOR tablaexiste IN SELECT n.nspname AS schemaname, c.relname AS tablename
   FROM pg_class c
   LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
   LEFT JOIN pg_tablespace t ON t.oid = c.reltablespace
  WHERE c.relkind = 'r'::"char" and n.nspname not in ('pg_toast','pg_catalog','information_schema')
   and c.oid not in (
   SELECT c.oid
   FROM pg_class c
   LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
   LEFT JOIN pg_tablespace t ON t.oid = c.reltablespace
   left JOIN pg_trigger tg on tg.tgrelid = c.oid
  WHERE c.relkind = 'r'::"char" and n.nspname not in ('pg_toast','pg_catalog','information_schema')
   and  tg.tgname  in ('t_cid')
)
LOOP
EXECUTE 'CREATE TRIGGER t_cid BEFORE INSERT ON ' ||tablaexiste.schemaname||'.'||tablaexiste.tablename|| ' FOR EACH ROW EXECUTE PROCEDURE ft_cid()';
END LOOP; 
-------------Obtiene el oid del trigger,procedimiento asociado,usuario,dirección de conexión, puerto de conexión y las fechas relacionadas con el inicio y fin de las transaciones
FOR resultado IN SELECT tg.oid as oidtg,
p.oid as oidproc,
(select usename from pg_stat_activity where procpid=pg_backend_pid()) as usename,
(select client_addr from pg_stat_activity where procpid=pg_backend_pid()) as client_addr,
(select client_port from pg_stat_activity where procpid=pg_backend_pid()) as client_port,
(select backend_start  from pg_stat_activity where procpid=pg_backend_pid()) as tta,
(select xact_start from pg_stat_activity where procpid=pg_backend_pid()) as tcce,
(select query_start from pg_stat_activity where procpid=pg_backend_pid()) as  mip
   FROM pg_class c
   LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
   LEFT JOIN pg_tablespace t ON t.oid = c.reltablespace
   left JOIN pg_trigger tg on tg.tgrelid = c.oid
   left JOIN pg_proc p on p.oid = tg.tgfoid
   left JOIN pg_database bd on bd.oid = tg.tgfoid
  WHERE c.relkind = 'r'::"char" and n.nspname not in ('pg_toast','pg_catalog','information_schema') and (tg.tgname = 't_cid')
order by(oidtg) asc
LOOP
RETURN NEXT resultado;
END LOOP;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

----EJECUTAR FUNCIÓN----
 Select * from ft_cidet();
---ELIMINAR  MECANISMOS------
DROP FUNCTION ft_cidet();
DROP type td_cid;
DROP type td_return;
