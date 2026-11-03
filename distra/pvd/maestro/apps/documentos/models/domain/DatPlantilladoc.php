<?php
class DatPlantilladoc extends BaseDatPlantilladoc
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idplantilladoc)
    {
        return Doctrine::getTable('DatPlantilladoc')->find($idplantilladoc);
    }

    public function  getContenidoByIdPlantilla($idplantilladoc)
    {
        $queryObj = Doctrine_Query::create()
            ->select('v.contenido')
            ->from('DatPlantilladoc v')
            ->where("v.idplantilladoc = '$idplantilladoc'");
        return $queryObj->fetchArray()[0];
    }

    public function getDocActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('v.idplantilladoc, v.idtipoplantilladoc, v.denominacion, v.fdesde, v.fhasta, v.descripcion')
            ->from('DatPlantilladoc v')
            ->where('v.fdesde <= now() and (now() <= v.fhasta or v.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getDocAll($denom, $fdesde, $fhasta, $identidad, $inicio, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'v.idplantilladoc,
                 v.denominacion,
                 v.descripcion,
                 v.fdesde,
                 v.fhasta,
                v.identidad,
                v.contenido'
            )
            ->from('DatPlantilladoc v')
            ->where("v.identidad = '$identidad'")
            ->limit($limit)
            ->offset($inicio);
        if ($denom) {
            $queryObj->addWhere("v.denominacion ilike '%$denom%'");
        }
        if ($fdesde) {
            $queryObj->addWhere("v.fdesde = '$fdesde'");
        }
        if ($fhasta) {
            $queryObj->addWhere("v.fhasta = '$fhasta'");
        }
        return $queryObj->fetchArray();
    }

    public function cantDocAll($denom, $fdesde, $fhasta, $identidad)
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'v.idplantilladoc,
                 v.denominacion,
                 v.contenido,
                 v.descripcion,
                 v.fdesde,
                 v.fhasta'
            )
            ->from('DatPlantilladoc v')
            ->where("v.identidad = '$identidad'");
        if ($denom) {
            $queryObj->addWhere("v.denominacion ilike '%$denom%'");
        }
        if ($fdesde) {
            $queryObj->addWhere("v.fdesde = '$fdesde'");
        }
        if ($fhasta) {
            $queryObj->addWhere("v.fhasta = '$fhasta'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion, $identidad)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('m.denominacion')
            ->from('DatPlantilladoc m')
            ->where("UPPER(TRIM(m.denominacion)) = UPPER(TRIM('$denominacion')) and m.identidad = '$identidad'");
        return $queryObj->fetchArray();
    }

    public function getConfiguraciones()
    {
        $sql = "SELECT c.idconfiguracion, c.denominacion FROM mod_reccomplejas2.nom_configuracion c";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getConfiguracionesPorPlantilla($idplantilla)
    {
        $sql = "SELECT c.denominacion FROM mod_reccomplejas2.nom_configuracion c
                INNER JOIN mod_rrhhmaestro.conf_plantilladocrec pr ON (c.idconfiguracion = pr.idconfiguracion)
                WHERE pr.idplantilladoc = '$idplantilla'";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getConfigAsigByIdplantilla($idplantilladoc)
    {
        $sql = "SELECT c.idconfiguracion as id FROM mod_rrhhmaestro.conf_plantillafuncionalidad c
                WHERE c.idplantilla = '$idplantilladoc'";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

}