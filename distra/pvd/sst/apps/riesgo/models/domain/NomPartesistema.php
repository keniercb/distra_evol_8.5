<?php
class NomPartesistema extends BaseNomPartesistema
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomSistema', array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
    }

    public function getById($idpartesistema)
    {
        return Doctrine::getTable('NomPartesistema')->find($idpartesistema);
    }

    public function getPartesistemasActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('ne.*, ne.denominacion as vento')
            ->from('NomPartesistema ne')
            ->where('ne.fdesde <= now() and (now() <= ne.fhasta or ne.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getPartesistemas($filtro, $start, $limit, $idsistema)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ne.*, s.denominacion as sistema')
            ->from('NomPartesistema ne')
            ->innerJoin('ne.NomSistema s')
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("ne.denominacion ILIKE '%$filtro%' OR ne.descripcion ILIKE '%$filtro%'");
        }
        if ($idsistema) {
            $queryObj->addWhere("ne.idsistema = '$idsistema'");
        }
        return $queryObj->fetchArray();
    }

    public function cantPartesistemas($filtro, $idsistema)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ne.idpartesistema')
            ->from('NomPartesistema ne');
        if ($filtro) {
            $queryObj->addWhere("ne.denominacion ILIKE '%$filtro%' OR ne.descripcion ILIKE '%$filtro%'");
        }
        if ($idsistema) {
            $queryObj->addWhere("ne.idsistema = '$idsistema'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('ne.denominacion')
            ->from('NomPartesistema ne')
            ->where("UPPER(TRIM(ne.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}