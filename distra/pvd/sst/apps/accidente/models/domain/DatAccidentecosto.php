<?php
class DatAccidentecosto extends BaseDatAccidentecosto
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idaccidentecosto)
    {
        return Doctrine::getTable('DatAccidentecosto')->find($idaccidentecosto);
    }

    public function getCostos($idaccidente, $filtro, $inicio, $limite)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatAccidentecosto m')
            ->where("m.idaccidente = '$idaccidente'")
            ->orderBy('m.fregistro DESC');
        if ($filtro) {
            $queryObj->addWhere("m.denominacion ilike '%$filtro%'");
        }
        if (!empty($inicio) && !empty($limite)) {
            $queryObj->start($inicio)->limit($limite);
        }
        return $queryObj->fetchArray();
    }

    public function cantCostos($idaccidente, $filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatAccidentecosto m')
            ->where("m.idaccidente = '$idaccidente'");
        if ($filtro) {
            $queryObj->addWhere("m.denominacion ilike '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function obtenerCostosPorAccidente($idestructra)
    {
        $sql = "SELECT
                    da.idaccidente,
                    nta.denominacion || ' (' || da.fecha || ' ' || da.hora || ')' AS denominacion,
                    sum(dac.importe) AS total
                FROM mod_sstaccidente.dat_accidente AS da
                INNER JOIN mod_sstaccidente.nom_tipoaccidente AS nta ON (da.idtipoaccidente = nta.idtipoaccidente)
                LEFT JOIN mod_sstaccidente.dat_accidentecosto AS dac ON (da.idaccidente = dac.idaccidente)";
        $sql = $sql."GROUP BY da.idaccidente, nta.denominacion";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}