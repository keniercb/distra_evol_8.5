<?php
class DatNecesidad extends BaseDatNecesidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomNecesidaddecapacitacion',
            array('local' => 'idnecesidad', 'foreign' => 'idnecesidad')
        );
        $this->hasOne(
            'NomModoformacion',
            array('local' => 'idmodoformacion', 'foreign' => 'idmodoformacion')
        );
    }

    public function getById($iddnecesidad)
    {
        return Doctrine::getTable('DatNecesidad')->find($iddnecesidad);
    }

    /**
     * @param int $idpersona
     * @param null $limit
     * @param int $start
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getNecesidadesByPersona($activo, $idpersona, $limit = null, $start = 0)
    {
        try {
            $select = "dd.*, dd.idnecesidad,n.idnecesidad as idnecesidad, n.denominacion as necesidad,
                 , dd.idmodoformacion,mf.idmodoformacion as idmodoformacion, mf.denominacion as modoformacion, (CASE
                WHEN (now() <= dd.fhasta or dd.fhasta is null)
                THEN 1
                ELSE 0
                END) AS historico";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatNecesidad dd')
                ->innerJoin('dd.NomNecesidaddecapacitacion n')
                ->innerJoin('dd.NomModoformacion mf')
                ->where("dd.idpersona = '$idpersona'");
            if ($activo == 1) {
                $query->addWhere('dd.fhasta >= now() OR dd.fhasta IS NULL');
            } else {
                $query->addWhere('dd.fhasta < now()');
            }
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param int $idpersona
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantNecesidadesByPersona($activo, $idpersona)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('DatNecesidad dd')
                ->where("dd.idpersona = '$idpersona'");
            if ($activo == 1) {
                $query->addWhere('dd.fhasta >= now() OR dd.fhasta IS NULL');
            } else {
                $query->addWhere('dd.fhasta < now()');
            }
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $idpersona
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getNecesidadesByArrayPersona(array $idspersona)
    {
        try {
            $select
                = "dd.*, dd.idnecesidad,n.idnecesidad as idnecesidad, n.denominacion as necesidad,
                 , dd.idmodoformacion,mf.idmodoformacion as idmodoformacion, mf.denominacion as modoformacion,";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatNecesidad dd')
                ->innerJoin('dd.NomNecesidaddecapacitacion n')
                ->innerJoin('dd.NomModoformacion mf')
                ->where("dd.fhasta >= now() OR dd.fhasta IS NULL")
                ->whereIn('dd.idpersona', $idspersona)
                ->orderBy('dd.idpersona,dd.idnecesidad ASC');
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getNecesidadesByAccionPersonaTodos($idaccion, $idpersona)
    {
        try {
            $select = "nn.*, nn.denominacion as necesidad, dn.iddnecesidad as iddnecesidad, dn.fhasta as fvencida, 
                dn.fregistro as fregistro, dn.idpersona as idpersona";
            $query = Doctrine_Query::create()->select($select)
                ->from('NomNecesidaddecapacitacion nn')
                ->innerJoin("nn.DatAccionnecesidad an ON an.idnecesidad = nn.idnecesidad AND an.idaccion = '$idaccion'")
                ->innerJoin("nn.DatNecesidad dn ON dn.idnecesidad = nn.idnecesidad AND dn.idpersona = '$idpersona'");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param int $idpersona
     * @param int $idnecesidad
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function existeNec($idpersona, $idnecesidad)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatNecesidad dd')
                ->where("dd.idpersona = '$idpersona' and dd.idnecesidad = '$idnecesidad'");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getPersonasActivas($filtro, $start, $limit, $reciengraduado)
    {
        $sql = "SELECT DISTINCT
				  dp.idpersona
				, sl.idcargo
				, sl.idarea
				, pe.identidad
				, ident.numero AS numid
				, con.orden as orden
				, CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
						  THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
						  THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombreyapellidos
                , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.nombre || ' ' || dp.papel
                         WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
                          THEN dp.nombre || ' ' || dp.snombre || ' ' || dp.papel
                         WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
                          THEN dp.nombre || ' ' || dp.papel || ' ' || dp.sapel
                         ELSE dp.nombre || ' ' || dp.snombre || ' ' || dp.papel || ' ' || dp.sapel
                    END AS nombreyapellidosorden
				FROM mod_persona.dat_persona AS dp
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				LEFT JOIN mod_persona.dat_personaentidad AS pe
				  ON (dp.idpersona = pe.idpersona AND (pe.fhasta > now() OR pe.fhasta IS NULL))
				LEFT JOIN mod_persona.dat_situacionlaboral AS sl
				  ON (pe.idpersonaentidad = sl.idpersonaentidad AND sl.principal = 1
				    AND (sl.fhasta > now() OR sl.fhasta IS NULL))
				LEFT JOIN mod_estructuracomp.dat_estructura AS est ON (est.idestructura = dp.idestructura)
				LEFT JOIN mod_estructuracomp.nom_concepto AS con ON (con.idconcepto = est.idconcepto)
				WHERE dp.feliminado is null";
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' or ident.numero ilike '%$filtro%'
                or dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
        }
        if ($reciengraduado != null) {
            $sql .= " AND dp.idpersona NOT IN (SELECT rg.idpersona FROM mod_capacitacion.dat_reciengraduado rg
            WHERE rg.fhastass IS NULL OR rg.fhastass >= now())";
        }
        $sql = $sql . " ORDER BY sl.idarea OFFSET $start LIMIT $limit";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantPersonasActivas($filtro, $reciengraduado)
    {
        $sql = "SELECT
				  dp.idpersona
				FROM mod_persona.dat_persona AS dp
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				LEFT JOIN mod_persona.dat_personaentidad AS pe
				  ON (dp.idpersona = pe.idpersona AND (pe.fhasta > now() OR pe.fhasta IS NULL))
				LEFT JOIN mod_persona.dat_situacionlaboral AS sl
				  ON (pe.idpersonaentidad = sl.idpersonaentidad AND (sl.fhasta > now() OR sl.fhasta IS NULL))
				WHERE dp.feliminado is null";
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' or ident.numero ilike '%$filtro%'
                or dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
        }
        if ($reciengraduado != null) {
            $sql .= " AND dp.idpersona NOT IN (SELECT rg.idpersona FROM mod_capacitacion.dat_reciengraduado rg
            WHERE rg.fhastass IS NULL OR rg.fhastass >= now())";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return count($conn->fetchAll($sql));
    }

    public function getSituacionByIdCargo($cargos, $filtro, $reciengraduado, $start, $limit)
    {
        $sql = "SELECT DISTINCT
				 dp.idpersona
				, sl.idcargo
				, ident.numero AS numid
				, CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.nombre || ' ' || dp.papel
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
						  THEN dp.nombre || ' ' || dp.snombre || ' ' || dp.papel
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
						  THEN dp.nombre || ' ' || dp.papel || ' ' || dp.sapel
						 ELSE dp.nombre || ' ' || dp.snombre || ' ' || dp.papel || ' ' || dp.sapel
					END AS nombreyapellidosorden
				FROM mod_persona.dat_situacionlaboral AS sl
				INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
				LEFT JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				WHERE dp.feliminado is null";

        if (count($cargos) > 0) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ") AND sl.estado = 0";
        }
        if ($reciengraduado != null) {
            $sql .= " AND dp.idpersona NOT IN (SELECT rg.idpersona FROM mod_capacitacion.dat_reciengraduado rg
            WHERE rg.fhastass IS NULL OR rg.fhastass >= now())";
        }
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%' or ident.numero ilike '%$filtro%'
                or dp.nombre ilike '%$filtro%' or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
        }
        if (!empty($limit) && !empty($limit)) {
            $sql = $sql . " OFFSET $start LIMIT $limit";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantSituacionByIdCargo($cargos, $filtro, $reciengraduado)
    {
        $sql = "SELECT DISTINCT
				 dp.idpersona
				, sl.idcargo
				, ident.numero AS numid
				, CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.nombre || ' ' || dp.papel
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
						  THEN dp.nombre || ' ' || dp.snombre || ' ' || dp.papel
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
						  THEN dp.nombre || ' ' || dp.papel || ' ' || dp.sapel
						 ELSE dp.nombre || ' ' || dp.snombre || ' ' || dp.papel || ' ' || dp.sapel
					END AS nombreyapellidosorden
				FROM mod_persona.dat_situacionlaboral AS sl
				INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
				LEFT JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				WHERE dp.feliminado is null";

        if (count($cargos) > 0) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ") AND sl.estado = 0";
        }
        if ($reciengraduado != null) {
            $sql .= " AND dp.idpersona NOT IN (SELECT rg.idpersona FROM mod_capacitacion.dat_reciengraduado rg
            WHERE rg.fhastass IS NULL OR rg.fhastass >= now())";
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
}