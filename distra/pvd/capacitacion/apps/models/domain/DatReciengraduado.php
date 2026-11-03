<?php
class DatReciengraduado extends BaseDatReciengraduado
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idreciengraduado)
    {
        return Doctrine::getTable('DatReciengraduado')->find($idreciengraduado);
    }

    public function getRecienGraduadoById($idreciengraduado)
    {
        $sql = "SELECT
				  sl.idcargo
				, sl.idarea
				, rg.*
				FROM mod_capacitacion.dat_reciengraduado AS rg
				INNER JOIN mod_persona.dat_personaentidad AS pe ON (rg.idpersona = pe.idpersona AND (pe.fhasta > now()
				 OR pe.fhasta IS NULL))
				INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad AND
				 (sl.fhasta > now() OR sl.fhasta IS NULL))
				WHERE rg.idreciengraduado = '$idreciengraduado'";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getRecienGraduado($filtro, $cargos, $start, $limit)
    {
        $sql = "SELECT
				  dp.idpersona
				, sl.idcargo
				, sl.idarea
				, ident.numero AS numid
				, CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.nombre || ' ' || dp.papel
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
						  THEN dp.nombre || ' ' || dp.snombre || ' ' || dp.papel
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
						  THEN dp.nombre || ' ' || dp.papel || ' ' || dp.sapel
						 ELSE dp.nombre || ' ' || dp.snombre || ' ' || dp.papel || ' ' || dp.sapel
					END AS nombreyapellidos
				, rg.*
				FROM mod_capacitacion.dat_reciengraduado AS rg
				INNER JOIN mod_persona.dat_persona AS dp ON (rg.idpersona = dp.idpersona)
				INNER JOIN mod_persona.dat_personaentidad AS pe ON (rg.idpersona = pe.idpersona AND (pe.fhasta > now()
				 OR pe.fhasta IS NULL))
				INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad AND
				 (sl.fhasta > now() OR sl.fhasta IS NULL))
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))";
        if (count($cargos) > 0) {
            $sql .= " WHERE sl.idcargo in (" . implode(',', $cargos) . ") AND sl.estado = 0";
        }
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' or ident.numero ilike '%$filtro%'
                or dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
        }
        if (!empty($start) && !empty($limit)) {
            $sql = $sql . " AND dp.feliminado IS NULL ORDER BY sl.idcargo OFFSET $start LIMIT $limit";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantRecienGraduado($filtro, $cargos)
    {
        $sql = "SELECT
				  rg.*
				FROM mod_capacitacion.dat_reciengraduado AS rg
				INNER JOIN mod_persona.dat_persona AS dp ON (rg.idpersona = dp.idpersona)
				INNER JOIN mod_persona.dat_personaentidad AS pe ON (rg.idpersona = pe.idpersona)
				INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))";
        if (count($cargos) > 0) {
            $sql .= " WHERE sl.idcargo in (" . implode(',', $cargos) . ") AND sl.estado = 0";
        }
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' or ident.numero ilike '%$filtro%'
                or dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return count($conn->fetchAll($sql));
    }

    /**
     * @param int $idpersona
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function existe($idpersona)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatReciengraduado dd')
                ->where("dd.idpersona = '$idpersona'");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}