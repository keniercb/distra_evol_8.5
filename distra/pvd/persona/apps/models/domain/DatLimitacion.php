<?php

class DatLimitacion extends BaseDatLimitacion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('NomCausalimitacion', array('local' => 'idcausalimitacion', 'foreign' => 'idcausa'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idaptitudfisica
     *
     * @return Doctrine_Record
     */
    public function getById($idlimitacion)
    {
        return Doctrine::getTable('DatLimitacion')->find($idlimitacion);
    }

    public function getLimitacion($filtro = null, $limit = null, $start = 0, $cargos)
    {
        try {
            $sql = "SELECT
			      l.idcausa
			    , l.idlimitacion
			    , l.fdesde
			    , l.fhasta
			    , pe.identidad
				, l.idsituacionlaboral as idsituacionlaboralp
				, l.idpersona
				, sl.ueb
				, sl.idcargo
				, nc.denominacion as causa
				, ident.numero AS numid
				, CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
						  THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
						  THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombreyapellidos
				FROM mod_personaext.dat_limitacion AS l
				INNER JOIN mod_personaext.nom_causalimitacion AS nc ON (l.idcausa = nc.idcausalimitacion)
				INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (l.idsituacionlaboral = sl.idsituacionlaboralp)
				INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
				LEFT JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				LEFT JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion)
				WHERE sl.fdesde <= now() AND (now() < sl.fhasta OR sl.fhasta is null)";

            if ($filtro != null) {
                $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%'
                or ident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%'
                or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
            }
            if (count($cargos) > 0) {
                $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
            }
            $sql = $sql . " AND dp.feliminado IS NULL ORDER BY sl.idarea";
            if (isset($limite)) {
                $sql = $sql . "  OFFSET $start LIMIT $limit";
            }

            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            return $conn->fetchAll($sql);
        } catch (Doctrine_Exception $e) {
            print_r($e->getMessage());die;
            throw $e;
        }
      //  print_r('si');die;
    }

    /**
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantLimitacion($filtro = null, $cargos)
    {
        try {
            $sql = "SELECT l.idlimitacion
				FROM mod_personaext.dat_limitacion AS l
				INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (l.idsituacionlaboral = sl.idsituacionlaboralp)
				INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
				LEFT JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				LEFT JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion)
				WHERE sl.fdesde <= now() AND (now() < sl.fhasta OR sl.fhasta is null)";

            if ($filtro != null) {
                $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%'
                or ident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%'
                or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
            }
            if (count($cargos) > 0) {
                $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
            }
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            return count($conn->fetchAll($sql));
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getPersonasByIdCargo($filtro, $cargos, $inicio, $limite)
    {
        $sql = "SELECT
				  ns.denominacion as situacion
				, pe.identidad
				, sl.idsituacionlaboralp
				, dp.idpersona
				, sl.ueb
				, sl.idcargo
				, sl.idarea as idarea
				, ident.numero AS numid
				, CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
						  THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
						  THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombreyapellidos
				FROM mod_persona.dat_situacionlaboral AS sl
				INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
				LEFT JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				LEFT JOIN mod_persona.nom_situacion AS ns ON (sl.idsituacion = ns.idsituacion)
				 WHERE sl.fdesde <= now() AND (now() < sl.fhasta OR sl.fhasta is null)";

        if (count($cargos) > 0) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
        }
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%'
                or ident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%'
                or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
        }

        $sql = $sql . " AND dp.feliminado IS NULL ORDER BY sl.idarea";

        if (isset($limite)) {
            $sql = $sql . "  OFFSET $inicio LIMIT $limite";
        }

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantPersonasByIdCargo($filtro, $cargos)
    {
        $sql = "SELECT
				sl.idsituacionlaboralp
				FROM mod_persona.dat_situacionlaboral AS sl
				LEFT JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
				LEFT JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				WHERE sl.fdesde <= now() AND (now() < sl.fhasta OR sl.fhasta is null)";
        if (count($cargos) > 0) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
        }
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' or ident.numero ilike '%$filtro%'
            or dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
            or dp.sapel ilike '%$filtro%')";
        }
        $sql .= "AND dp.feliminado IS NULL";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return count($conn->fetchAll($sql));
    }
}

