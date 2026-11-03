<?php
class NomMotivobaja extends BaseNomMotivobaja
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idmotivobaja)
    {
        return Doctrine::getTable('NomMotivobaja')->find($idmotivobaja);
    }

    public function getMotivosActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'v.idmotivobaja,
                v.idmotivobaja as id,
                v.denominacion,
                v.denominacion as text,
                v.fdesde, v.fhasta,
                v.descripcion,
                v.idpadre,
                v.gestion,
                v.fluctuacion'
            )
            ->from('NomMotivobaja v')
            ->where('v.fdesde <= now() and (now() <= v.fhasta or v.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getMotivosAll()
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'v.idmotivobaja as id,
                v.idmotivobaja,
                v.denominacion,
                v.idpadre as _parent,
                v.descripcion,
                v.fdesde,
                v.fhasta,
                v.gestion,
                v.fluctuacion'
            )
            ->from('NomMotivobaja v');
        return $queryObj->fetchArray();
    }

    public function getMotivosPadres($denom, $fdesde, $fhasta)
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'v.idmotivobaja as id, 
                v.denominacion as text, 
                v.gestion, 
                v.*'
            )
            ->from('NomMotivobaja v')
            ->where("v.idmotivobaja = v.idpadre");
        if ($denom) {
            $queryObj->addWhere("v.denominacion ilike '%$denom%'");
        }
        if ($fdesde) {
            $queryObj->addWhere("v.fdesde >= '$fdesde'");
        }
        if ($fhasta) {
            $queryObj->addWhere("v.fhasta <= '$fhasta'");
        }
        return $queryObj->fetchArray();
    }

    public function getMotivosHijos($idpadre)
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'v.idmotivobaja as id,
                 v.denominacion as text, v.gestion,
                  v.*'
            )
            ->from('NomMotivobaja v')
            ->where("v.idmotivobaja <> v.idpadre and v.idpadre = '$idpadre'");
        return $queryObj->fetchArray();
    }

    public function existeDenom($denom)
    {
        $denom = strtoupper($denom);
        $queryObj = Doctrine_Query::create()
            ->select('m.denominacion')
            ->from('NomMotivobaja m')
            ->where("UPPER(TRIM(m.denominacion)) = UPPER(TRIM('$denom'))");
        return $queryObj->fetchArray();
    }
}