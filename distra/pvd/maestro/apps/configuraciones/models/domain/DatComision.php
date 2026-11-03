<?php
class DatComision extends BaseDatComision
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatDominiocomision',
            array('local'=>'idcomision', 'foreign'=>'idcomision')
        );
    }

    public function getById($idcomision)
    {
        return Doctrine::getTable('DatComision')->find($idcomision);
    }

    public function getComisionesActivas($iddominio)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('DatComision c')
            ->innerJoin('c.DatDominiocomision dc')
            ->where('c.fdesde <= now() and (now() <= c.fhasta or c.fhasta is null)');
        if ($iddominio) {
            $queryObj->addWhere("dc.iddominio = '$iddominio'");
        }
        return $queryObj->fetchArray();
    }

    public function getComisiones($idestructura, $filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*, dc.*, nd.denominacion')
            ->from('DatComision c')
            ->innerJoin('c.DatDominiocomision dc')
            ->innerJoin('dc.NomDominio nd')
            ->where("c.identidad = '$idestructura'")
            ->limit($limit)
            ->offset($start);
        if ($filtro) {
            $queryObj->addWhere("c.denominacion ILIKE '%$filtro%' OR c.descripcion ILIKE '%$filtro%'");
        }
        return $queryObj->fetchArray();
    }

    public function cantComisiones($idestructura, $filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.idcomision')
            ->from('DatComision c')
            ->where("c.identidad = '$idestructura'");
        if ($filtro) {
            $queryObj->addWhere("c.denominacion ILIKE '%$filtro%' OR c.descripcion ILIKE '%$filtro%'");
        }
        return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion, $identidad)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('c.denominacion')
            ->from('DatComision c')
            ->where("UPPER(TRIM(c.denominacion)) = UPPER(TRIM('$denominacion')) AND c.identidad = '$identidad'");
        return $queryObj->fetchArray();
    }
}
