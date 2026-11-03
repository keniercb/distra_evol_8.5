<?php
class DatComisionmiembro extends BaseDatComisionmiembro
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomCargocomision', array('local' => 'idcargocomision', 'foreign' => 'idcargocomision'));
    }

    public function getById($idcomisionmiembro)
    {
        return Doctrine::getTable('DatComisionmiembro')->find($idcomisionmiembro);
    }

    public function existeMiembro($idpersona, $idcomision)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.idpersona')
            ->from('DatComisionmiembro c')
            ->where("c.idpersona = '$idpersona' AND c.idcomision = '$idcomision'");
        return $queryObj->fetchArray();
    }


    public function getMiembrosByComision($idcomision, $filtro, $start, $limit)
    {
        $identidad = $_SESSION['Zeolides']['entidad']->idestructura;
        $sql = "SELECT
                  cm.*
                , nc.denominacion as cargocomision
                , dc.denominacion as comision
				, dp.idpersona
				, ident.numero AS numid
				, CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
						  THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
						  THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombreyapellidos
				FROM mod_rrhhmaestro.dat_comisionmiembro AS cm
				INNER JOIN mod_rrhhmaestro.dat_comision AS dc ON (cm.idcomision = dc.idcomision)
				LEFT JOIN mod_rrhhmaestro.nom_cargocomision AS nc ON (cm.idcargocomision = nc.idcargocomision)
				INNER JOIN mod_persona.dat_persona AS dp ON (cm.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				WHERE dp.feliminado IS NULL";
        if ($idcomision != null) {
            $sql .= " AND cm.idcomision = '$idcomision'";
        } else {
            $sql .= " AND dc.identidad = '$identidad'";
        }
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%'
                or ident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%'
                or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
        }
        $sql = $sql . " ORDER BY cm.idcomisionpersona";
        if (!empty($limite)) {
            $sql = $sql . " OFFSET $start LIMIT $limit";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantPersonasByIdcargoIdnecesidad($idcomision, $filtro)
    {
        $sql = "SELECT
                  cm.idcomisionpersona
				FROM mod_rrhhmaestro.dat_comisionmiembro AS cm
				LEFT JOIN mod_rrhhmaestro.nom_cargocomision AS nc ON (cm.idcargocomision = nc.idcargocomision)
				INNER JOIN mod_persona.dat_persona AS dp ON (cm.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				WHERE cm.idcomision = '$idcomision' AND dp.feliminado IS NULL";


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
