--entidad/area: v_get_estructuras
CREATE OR REPLACE VIEW mod_estructuracomp.v_get_estructuras
 AS
 SELECT fila.idfila AS idestructura,
        CASE
            WHEN estructura.denominacion::text <> ''::text THEN estructura.denominacion
            WHEN estructuraop.denominacion::text <> ''::text THEN estructuraop.denominacion
            ELSE NULL::character varying
        END AS denominacion
   FROM mod_estructuracomp.nom_filaestruc fila
     JOIN mod_estructuracomp.nom_concepto nomeav ON fila.idconcepto = nomeav.idconcepto
     LEFT JOIN mod_estructuracomp.dat_estructura estructura ON estructura.idestructura = fila.idfila AND (estructura.idestado = 0::numeric OR estructura.idproyecto = 0::numeric)
     LEFT JOIN mod_estructuracomp.nom_organo orgest ON orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto
     LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop ON estructuraop.idestructuraop = fila.idfila AND (estructuraop.idestado = 0::numeric OR estructuraop.idproyecto = 0::numeric)
     LEFT JOIN mod_estructuracomp.nom_organo orgestop ON orgestop.idorgano = estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto
  WHERE fila.fechafin IS NULL AND (estructura.denominacion::text <> ''::text OR estructuraop.denominacion::text <> ''::text);
ALTER TABLE mod_estructuracomp.v_get_estructuras OWNER TO zeolides;

--cargos: v_get_cargos
CREATE OR REPLACE VIEW mod_estructuracomp.v_get_cargos
 AS
SELECT nfe.idfila as idcargo, nfe.idconcepto, nc.denominacion
	FROM mod_estructuracomp.nom_filaestruc as nfe
	inner join mod_estructuracomp.nom_concepto nomeav ON nfe.idconcepto = nomeav.idconcepto     
	inner join mod_estructuracomp.dat_cargo as dc on (nfe.idfila = dc.idcargo and dc.idproyecto = 0)
	inner join mod_estructuracomp.nom_cargo as nc on (nc.idnomcargo = dc.idnomcargo)
	where (nfe.fechafin is null) and (nc.fechafin is null);
ALTER TABLE mod_estructuracomp.v_get_cargos OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_fuerzatrabajo.f_personas_nombradas_por_arrayidcargo (p_idcargos numeric[]) 
    RETURNS TABLE (
    idpersona numeric,
    nombre text,
	snombre text,
	papel text,
	spapel text,
	nombrecompleto text,
	entidad character varying,
	area character varying,
	cargo character varying (100)
) 
AS $$
BEGIN
    RETURN QUERY
select
	-- personal data
	p.idpersona as idpersona, 
	initcap(p.nombre) as nombre,
	initcap(p.snombre) as snombre,
	initcap(p.papel) as papel,
	initcap(p.sapel) as spapel,
	initcap(replace(concat( trim(p.nombre),' ', trim(p.snombre),' ', trim(p.papel),' ', trim(p.sapel) ), '  ', ' ')) as nombrecompleto
	-- employment data
	, vgs_e.denominacion as entidad
	, vgs_a.denominacion as area
	, vgp_c.denominacion as cargo
from mod_persona.dat_persona as p
inner join mod_persona.dat_personaentidad as pe using (idpersona)
inner join mod_persona.dat_situacionlaboral as sl using (idpersonaentidad)
inner join mod_estructuracomp.v_get_estructuras as vgs_e on (vgs_e.idestructura = pe.identidad)
inner join mod_estructuracomp.v_get_cargos as vgp_c on (vgp_c.idcargo = sl.idcargo)
left join mod_estructuracomp.v_get_estructuras as vgs_a on (vgs_a.idestructura = sl.idarea)

where 
	(vgp_c.idcargo = any (p_idcargos))	
	and ( p.feliminado is null or p.feliminado::date > now()::date )
	and ( pe.fhasta is null or pe.fhasta::date > now()::date )
	and ( sl.fhasta is null or sl.fhasta::date > now()::date )
	and ( sl.principal = 1 and sl.estado = 0);
END; $$ 

LANGUAGE 'plpgsql';
ALTER FUNCTION mod_fuerzatrabajo.f_personas_nombradas_por_arrayidcargo(numeric[]) OWNER TO zeolides;
