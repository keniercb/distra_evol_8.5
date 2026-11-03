<?php
class NomTipocontrato extends BaseNomTipocontrato
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idtipocontrato)
    {
        return Doctrine::getTable('NomTipocontrato')->find($idtipocontrato);
    }

    public function getActiveTiposContrato()
    {
        $sql = "SELECT
                tc.idtipocontrato
				, tc.denominacion
				, tc.determinado
				, tc.descripcion
				FROM mod_fuerzatrabajo.nom_tipocontrato AS tc";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->fetchAll($sql);
    }

    public function getTiposContrato($denom, $inicio, $limit)
    {
        $sql = "SELECT
		          tc.idtipocontrato
				, tc.denominacion
				, tc.descripcion
				, tc.determinado
				, tc.plantilla
				, tc.gestion
				FROM mod_fuerzatrabajo.nom_tipocontrato AS tc";
        if ($denom) {
            $sql = $sql.' '."WHERE tc.denominacion ilike '%$denom%'";
        }
        $sql = $sql.' '."LIMIT $limit OFFSET $inicio";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->fetchAll($sql);
    }

    public function getPlantilla($idtipocontrato, $identidad)
    {
        $sql = "SELECT
				p.idplantilladoc AS idplantilla
				FROM mod_fuerzatrabajo.dat_plantillatipocontrato AS ptc
				INNER JOIN mod_rrhhmaestro.dat_plantilladoc AS p
				  ON (p.idplantilladoc = ptc.idplantilla AND p.identidad = $identidad)
				  WHERE ptc.idtipocontrato = '$idtipocontrato'";

        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->fetchAll($sql);
    }

    public function cantTiposContrato($denom)
    {
        $sql = "SELECT
		          tc.idtipocontrato
				FROM mod_fuerzatrabajo.nom_tipocontrato AS tc";
        if ($denom) {
            $sql = $sql.' '."WHERE tc.denominacion ilike '%$denom%'";
        }
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return count($cnx->fetchAll($sql));
    }

    public function getPlantillasByIdTipoplantilla($identidad, $idconfiguracion)
    {
        if (empty($idconfiguracion)) {
            $where = "cast(m2.idconfiguracion AS VARCHAR) ILIKE '2%'";
        } else {
            $where = "m2.idconfiguracion = '$idconfiguracion'";
        }
        $sql = "SELECT
				  p.denominacion as plantilla
				, p.idplantilladoc as idplantilla
				FROM mod_rrhhmaestro.dat_plantilladoc p
				INNER JOIN mod_rrhhmaestro.conf_plantillafuncionalidad as m2 ON (p.idplantilladoc = m2.idplantilla)
				WHERE ".$where." and p.identidad = $identidad and p.fdesde <= now()
				  AND ((p.fhasta > now()) OR (p.fhasta IS NULL))";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->fetchAll($sql);
    }

    public function getTipoPlantillaPadres()
    {
        $sql = "SELECT
				  p.denominacion
				, p.idtipoplantilladoc AS idtipoplantilla
				, p.idpadre
				FROM mod_rrhhmaestro.nom_tipoplantilladoc p
				WHERE p.idtipoplantilladoc = p.idpadre";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->fetchAll($sql);
    }

    public function getTipoPlantillaHijos($idpadre)
    {
        $sql = "SELECT
				  p.denominacion
				, p.idtipoplantilladoc AS idtipoplantilla
				, p.idpadre
				FROM mod_rrhhmaestro.nom_tipoplantilladoc p
				WHERE p.idpadre = $idpadre AND p.idtipoplantilladoc <> p.idpadre";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->fetchAll($sql);
    }

    public function existeDenom($denom)
    {
        $denom = strtoupper($denom);
        $queryObj = Doctrine_Query::create()
            ->select('m.denominacion')
            ->from('NomTipocontrato m')
            ->where("UPPER(TRIM(m.denominacion)) = UPPER(TRIM('$denom'))");
        return $queryObj->fetchArray();
    }
}