<?php
class DatAccionparticipante extends BaseDatAccionparticipante
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatAccionn',
            array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
    }

    public function getById($idaccionparticipante)
    {
        return Doctrine::getTable('DatAccionparticipante')->find($idaccionparticipante);
    }

    public function getParticipantesByAccion($idaccion, $start, $limit)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccionparticipante dd');
            if (!empty($idaccion)) {
                $query->addWhere("dd.idaccion = $idaccion");
            }
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function cantAcciones($idaccion)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccionparticipante dd');
            if (!empty($idaccion)) {
                $query->addWhere("dd.idaccion = $idaccion");
            }
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getAccionesByPersona($activo, $idpersona, $fdesde, $fhasta, $start, $limit)
    {
        try {
            $select = "da.*, ap.idaccionparticipante as idaccionparticipante, ap.terminado as terminado, 
                ap.resultado as resultado, mf.denominacion as modoformacion";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccionn da')
                ->innerJoin('da.DatAccionparticipante ap')
                ->innerJoin('da.NomModoformacion mf');
            if (!empty($idpersona)) {
                $query->addWhere("ap.idpersona = $idpersona");
            }
            if ($activo == 1) {
                $query->addWhere('(da.frhasta > now() OR da.frhasta IS NULL)');
            } else {
                $query->addWhere('da.frhasta <= now()');
            }
            if (!empty($fdesde) && !empty($fhasta)) {
                $query->addWhere("da.fdesde >= '$fdesde' AND (da.fhasta <= '$fhasta' OR da.fhasta IS NULL)");
            }
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function cantAccionesByPersona($activo, $idpersona, $fdesde, $fhasta)
    {
        try {
            $select = "da.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccionn da')
                ->innerJoin('da.DatAccionparticipante ap');
            if (!empty($idpersona)) {
                $query->addWhere("ap.idpersona = $idpersona");
            }
            if ($activo == 1) {
                $query->addWhere('da.frhasta > now() OR da.frhasta IS NULL');
            } else {
                $query->addWhere('da.frhasta <= now()');
            }
            if (!empty($fdesde) && !empty($fhasta)) {
                $query->addWhere("da.fdesde >= '$fdesde' AND (da.fhasta <= '$fhasta' OR da.fhasta IS NULL)");
            }
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getAccionesNecByPersona($idpersona, $fdesde, $fhasta)
    {
        try {
            $select = "da.*, an.*, aa.*, na.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccionn da')
                ->innerJoin("da.DatAccionparticipante ap on da.idaccion = ap.idaccion AND ap.idpersona = '$idpersona'")
                ->leftJoin('da.DatAccionnecesidad an')
                ->leftJoin('da.DatAccionaseguramiento aa')
                ->leftJoin('aa.NomAseguramiento na');
            if (!empty($idpersona)) {
                $query->addWhere("ap.idpersona = $idpersona");
            }
            if (!empty($fdesde) && !empty($fhasta)) {
                $query->addWhere("da.fdesde >= '$fdesde' AND (da.fhasta <= '$fhasta' OR da.fhasta IS NULL)");
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function existe($idaccion, $idpersona)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccionparticipante dd')
                ->where("dd.idaccion = '$idaccion' AND dd.idpersona = '$idpersona'");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getPersonasByIdcargoIdnecesidad($filtro, $cargos, $necesidades, $inicio, $limite)
    {
        $sql = "SELECT
				  pe.identidad
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
				INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				WHERE sl.estado = 0 AND dp.feliminado IS NULL AND dp.idpersona in (SELECT
				n.idpersona FROM mod_capacitacion.dat_necesidad AS n WHERE n.idnecesidad in (" . implode(',', $necesidades) . "))";

        if (count($cargos) > 0) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
        }
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%'
                or ident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%'
                or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
        }
        $sql = $sql . " ORDER BY sl.idcargo";
        if (!empty($limite)) {
            $sql = $sql . " OFFSET $inicio LIMIT $limite";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantPersonasByIdcargoIdnecesidad($filtro, $cargos, $necesidades)
    {
        $sql = "SELECT
				sl.idsituacionlaboralp
				FROM mod_persona.dat_situacionlaboral AS sl
				LEFT JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
				INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				WHERE sl.estado = 0 AND dp.feliminado IS NULL 
				AND dp.idpersona in (SELECT n.idpersona FROM mod_capacitacion.dat_necesidad AS n 
				WHERE n.idnecesidad in (" . implode(',', $necesidades) . "))";

        if (count($cargos) > 0) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
        }
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%'
                or ident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%'
                or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return count($conn->fetchAll($sql));
    }

    public function getParticipantesByEstructuras($filtro, $estructuras, $inicio, $limite)
    {
        $sql = "SELECT
				  pe.identidad
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
				INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				WHERE sl.estado = 0 AND dp.feliminado IS NULL AND dp.idpersona in (SELECT
                        ap.idpersona FROM mod_capacitacion.dat_accion AS da
                        INNER JOIN mod_capacitacion.dat_accionparticipante AS ap ON (da.idaccion = ap.idaccion)
                        WHERE da.idestructura in (" . implode(',', $estructuras) . "))";
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%'
                or ident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%'
                or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
        }
        $sql = $sql . " ORDER BY sl.idcargo";
        if (!empty($limite)) {
            $sql = $sql . " OFFSET $inicio LIMIT $limite";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantParticipantesByEstructuras($filtro, $estructuras)
    {
        $sql = "SELECT
				sl.idsituacionlaboralp
				FROM mod_persona.dat_situacionlaboral AS sl
				LEFT JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
				INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				WHERE sl.estado = 0 AND dp.feliminado IS NULL AND dp.idpersona in (SELECT
                        ap.idpersona FROM mod_capacitacion.dat_accion AS da
                        INNER JOIN mod_capacitacion.dat_accionparticipante AS ap ON (da.idaccion = ap.idaccion)
                        WHERE da.idestructura in (" . implode(',', $estructuras) . "))";

        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%'
                or ident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%'
                or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return count($conn->fetchAll($sql));
    }
}