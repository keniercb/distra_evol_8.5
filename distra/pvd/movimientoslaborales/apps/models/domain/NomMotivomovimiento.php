<?php
class NomMotivomovimiento extends BaseNomMotivomovimiento
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($idmotivom)
    {
        return Doctrine::getTable('NomMotivomovimiento')->find($idmotivom);
    }

    public function getMotivosActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'v.idmotivomovimiento,
                v.idmotivomovimiento as id,
                v.denominacion,
                v.denominacion as text,
                v.fdesde,
                v.fhasta,
                v.descripcion,
                v.idpadre'
            )
            ->from('NomMotivomovimiento v')
            ->where('v.fdesde <= now() and (now() <= v.fhasta or v.fhasta is null)');
        return $queryObj->fetchArray();
    }

    public function getMotivosAll()
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'v.idmotivomovimiento as id,
                v.idmotivomovimiento,
                v.denominacion,
                v.idpadre as _parent,
                v.descripcion,
                v.fdesde,
                v.fhasta'
            )
            ->from('NomMotivomovimiento v');
        return $queryObj->fetchArray();
    }

    public function getMotivosPadres($denom, $fdesde, $fhasta)
    {
        $queryObj = Doctrine_Query::create()
            ->select('v.idmotivomovimiento as id, v.denominacion as text, v.*')
            ->from('NomMotivomovimiento v')
            ->where("v.idmotivomovimiento = v.idpadre");
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

    public function getMotivosHijos($idp)
    {
        $queryObj = Doctrine_Query::create()
            ->select('v.idmotivomovimiento as id, v.denominacion as text, v.*')
            ->from('NomMotivomovimiento v')
            ->where("v.idmotivomovimiento <> v.idpadre and v.idpadre = '$idp'");
        return $queryObj->fetchArray();
    }

    public function existeDenom($denom)
    {
        $denom = strtoupper($denom);
        $queryObj = Doctrine_Query::create()
            ->select('m.denominacion')
            ->from('NomMotivomovimiento m')
            ->where("UPPER(TRIM(m.denominacion)) = UPPER(TRIM('$denom'))");
        return $queryObj->fetchArray();
    }
    public function getDenomById($idmotivomovimiento)
    {
        $queryObj = Doctrine_Query::create()
            ->select('v.denominacion')
            ->from('NomMotivomovimiento v')
            ->where("v.idmotivomovimiento = $idmotivomovimiento");

        return $queryObj->fetchArray();
    }

}