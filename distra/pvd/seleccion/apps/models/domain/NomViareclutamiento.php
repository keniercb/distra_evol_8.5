<?php
class NomViareclutamiento extends BaseNomViareclutamiento
{
	public function setUp()
    {
        parent :: setUp();
    }

    public function getViasReclutamientoActivas()
    {
        $queryObj = Doctrine_Query::create()
            ->select('v.idviareclutamiento, v.denominacion, v.fdesde, v.fhasta, v.descripcion')
            ->from('NomViareclutamiento v')
            ->where('v.fdesde <= now() and (now() <= v.fhasta or v.fhasta is null)');;
        return $queryObj->fetchArray();
    }
	
	public function getViasReclutamientoAll($denom, $fdesde, $fhasta, $inicio, $limite)
	{
        $denominacion = strtoupper($denom);
        $queryObj = Doctrine_Query::create()
            ->select('v.idviareclutamiento, v.denominacion, v.fdesde, v.fhasta, v.descripcion, v.gestion')
            ->from('NomViareclutamiento v')
            ->limit($limite)
            ->offset($inicio);
        if(!empty($denominacion)){
            $queryObj->addWhere("v.denominacion ilike '%$denominacion%'");
        }
        if(!empty($fdesde)){
            $queryObj->addWhere('v.fdesde = ?', $fdesde);
        }
        if(!empty($fhasta)){
            $queryObj->addWhere('v.fhasta = ?', $fhasta);
        }

        return $queryObj->fetchArray();
	}

    public function cantViasReclutamientoAll($denom, $fdesde, $fhasta)
    {
            $denominacion = strtoupper($denom);
            $queryObj = Doctrine_Query::create()
                ->select()
                ->from('NomViareclutamiento v');
            if(!empty($denominacion)){
                $queryObj->addWhere("v.denominacion ilike '%$denominacion%'");
            }
            if(!empty($fdesde)){
                $queryObj->addWhere('v.fdesde = ?', $fdesde);
            }
            if(!empty($fhasta)){
                $queryObj->addWhere('v.fhasta = ?', $fhasta);
            }
            $datos = $queryObj->fetchArray();
            return count($datos);
    }
	
	public function getById($idviareclutamiento)
    {
        return Doctrine::getTable('NomViareclutamiento')->find($idviareclutamiento);
    }

    public function existeDenom($denominacion){

        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('m.denominacion')
            ->from('NomViareclutamiento m')
            ->where("UPPER(TRIM(m.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}