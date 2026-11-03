<?php
class DatComite extends BaseDatComite
{
	public function setUp()
    {
        parent :: setUp();
    }
	
	public function getPersByComite($idcomite, $estructura, $limit, $start, $filtro = null)
    {
		$sql = "SELECT
		              dc.idcomitep
					, dc.idcomite
					, dc.estructura
					, dc.idpersona
					, CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL) THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL) THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					  END AS nombre
					, di.numero AS numid
					, dp.sexo
					, CASE WHEN nc.denominacion IS NULL OR nc.denominacion = '' THEN 'NO CONOCIDO' ELSE nc.denominacion END AS cargo
				FROM mod_seleccion.dat_comite AS dc
				INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dc.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS di ON (dp.idpersona = di.idpersona AND di.principal = 1 AND (di.fhasta > now() OR di.fhasta IS NULL))
				LEFT JOIN mod_persona.dat_personaentidad AS doa ON (doa.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_situacionlaboral AS dsil ON (doa.idpersonaentidad = dsil.idpersonaentidad)
				LEFT JOIN mod_estructuracomp.nom_filaestruc AS nfe ON (nfe.idfila = dsil.idcargo)
				LEFT JOIN mod_estructuracomp.dat_cargo AS dcg ON (dcg.idcargo = nfe.idfila)
				LEFT JOIN mod_estructuracomp.nom_cargo AS nc ON (nc.idnomcargo = dcg.idnomcargo)
				WHERE dc.estructura = $estructura AND dc.idcomite = $idcomite";
		if($filtro) {
			$f = " AND ((cast(dc.idpersona AS VARCHAR) ILIKE '%$filtro%')
                     OR (di.numero ILIKE '%$filtro%')
					 OR (dp.nombre ILIKE '%$filtro%')
					 OR (dp.snombre ILIKE '%$filtro%')
					 OR (dp.papel ILIKE '%$filtro%')
					 OR (dp.sapel ILIKE '%$filtro%')
					 OR (nc.denominacion ILIKE '%$filtro%'))";
			$sql = $sql.$f;
		}
		$sql = $sql." LIMIT $limit OFFSET $start";
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
    }
	
	public function getCantPersByComite($idcomite, $estructura, $filtro = null)
    {
		$sql = "SELECT
		            count(dc.idcomitep)
				FROM mod_seleccion.dat_comite AS dc
				INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dc.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS di ON (dp.idpersona = di.idpersona AND di.principal = 1 AND (di.fhasta > now() OR di.fhasta IS NULL))
				LEFT JOIN mod_persona.dat_personaentidad AS doa ON (doa.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_situacionlaboral AS dsil ON (doa.idpersonaentidad = dsil.idpersonaentidad)
				LEFT JOIN mod_estructuracomp.nom_filaestruc AS nfe ON (nfe.idfila = dsil.idcargo)
				LEFT JOIN mod_estructuracomp.dat_cargo AS dcg ON (dcg.idcargo = nfe.idfila)
				LEFT JOIN mod_estructuracomp.nom_cargo AS nc ON (nc.idnomcargo = dcg.idnomcargo)
				WHERE dc.estructura = $estructura AND dc.idcomite = $idcomite";
		if($filtro) {
			$f = " AND ((cast(dc.idpersona AS VARCHAR) ILIKE '%$filtro%')
                     OR (di.numero ILIKE '%$filtro%')
					 OR (dp.nombre ILIKE '%$filtro%')
					 OR (dp.snombre ILIKE '%$filtro%')
					 OR (dp.papel ILIKE '%$filtro%')
					 OR (dp.sapel ILIKE '%$filtro%')
					 OR (nc.denominacion ILIKE '%$filtro%'))";
			$sql = $sql.$f;
		}
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
    }
	
	public function getComitesConPersonas($limit, $start)
	{
		$sql = "SELECT DISTINCT c.idcomite, c.estructura
                FROM mod_seleccion.dat_comite c
                LEFT JOIN mod_seleccion.nom_comite nc ON (nc.idcomite = c.idcomite)
                WHERE c.estructura = 1 OR (c.estructura = 0 AND nc.fdesde <= now() AND (nc.fhasta > now() OR nc.fhasta IS NULL))
				LIMIT $limit OFFSET $start";
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);	
	}
	
	public function cantComitesConPersonas()
	{
		$sql = "SELECT DISTINCT c.idcomite, c.estructura
                FROM mod_seleccion.dat_comite c
                LEFT JOIN mod_seleccion.nom_comite nc ON (nc.idcomite = c.idcomite)
                WHERE c.estructura = 1 OR (c.estructura = 0 AND nc.fdesde <= now() AND (nc.fhasta > now() OR nc.fhasta IS NULL)) ";
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return count($conn->fetchAll($sql));	
	}	
	
	/**
	 * Función para obtener un objeto de comité de ingreso
	 * @param $idcomitep Identificador del objeto del comité de ingreso.
	 * @return 
	**/
	public function getById($idcomitep)
    {
        return Doctrine::getTable('DatComite')->find($idcomitep);
    }
}