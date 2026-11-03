<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2017 xetid
   */
class DatPersonaproceso extends BaseDatPersonaproceso
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($id)
    {
        return Doctrine::getTable('DatPersonaproceso')->find($id);
    }

    public function getPersonasByProceso($idproceso, $filtro, $start, $limit)
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
				, pi.*
				FROM mod_idoneidad.dat_personaproceso AS pi
				INNER JOIN mod_persona.dat_persona AS dp ON (pi.idpersona = dp.idpersona)
				INNER JOIN mod_persona.dat_personaentidad AS pe ON (pi.idpersona = pe.idpersona)
				INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))";
        if ($idproceso != null) {
            $sql .= " WHERE pi.idproceso = '$idproceso'";
        }
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' or ident.numero ilike '%$filtro%'
                or dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
        }
        if (!empty($start) && !empty($limit)) {
            $sql = $sql . " AND dp.feliminado IS NULL OFFSET $start LIMIT $limit";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantPersonasByProceso($idproceso, $filtro)
    {
        $sql = "SELECT
				  DISTINCT pe.idpersonaentidad, pi.*
				FROM mod_idoneidad.dat_personaproceso AS pi
				INNER JOIN mod_persona.dat_persona AS dp ON (pi.idpersona = dp.idpersona)
				INNER JOIN mod_persona.dat_personaentidad AS pe ON (pi.idpersona = pe.idpersona)
				INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))";
        if ($idproceso != null) {
            $sql .= " WHERE pi.idproceso = '$idproceso'";
        }
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' or ident.numero ilike '%$filtro%'
                or dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
        }
        $sql = $sql . " AND dp.feliminado IS NULL";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return count($conn->fetchAll($sql));
    }


    public function existe($idproceso, $idpersona)
    {
        try {
            $select = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatPersonaproceso dd')
                ->where("dd.idproceso = '$idproceso' AND dd.idpersona = '$idpersona'");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}