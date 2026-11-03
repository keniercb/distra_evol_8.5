<?php
class NomMotreincorporacion extends BaseNomMotreincorporacion
{
	public function setUp()
    {
        parent :: setUp();
    }

/*    public function getMotReincorporacion()
    {
        $queryObj = Doctrine_Query::create()
            ->select('v.idmotivoreicorporacion, v.denominacion, v.fdesde, v.fhasta, v.descripcion')
            ->from('NomMotreincorporacion v')
            ->where('v.fdesde <= now() and (now() <= v.fhasta or v.fhasta is null)');

        return $queryObj->fetchArray();
    }*/
	
	public function getMotReincorporacion($denom, $fdesde, $fhasta, $inicio, $limite)
	{
        $denominacion = strtoupper($denom);
        $queryObj = Doctrine_Query::create()
            ->select('v.idmotivoreicorporacion, v.denominacion, v.fdesde, v.fhasta, v.descripcion, v.gestion')
            ->from('NomMotreincorporacion v');
        if(!empty($denominacion)){
            $queryObj->addWhere("v.denominacion ilike '%$denominacion%'");
        }
        if(!empty($fdesde)){
            $queryObj->addWhere('v.fdesde = ?', $fdesde);
        }
        if(!empty($fhasta)){
            $queryObj->addWhere('v.fhasta = ?', $fhasta);
        }
        if(!empty($inicio) && !empty($limite)){
            $queryObj->addWhere('v.fhasta = ?', $fhasta);
        }
        return $queryObj->fetchArray();
	}

    public function getCantMotReincorporacion($denom, $fdesde, $fhasta)
    {

            $denominacion = strtoupper($denom);
            $queryObj = Doctrine_Query::create()
                ->select()
                ->from('NomMotreincorporacion v');
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

	public function getById($idmotivoreicorporacion)
    {
        return Doctrine::getTable('NomMotreincorporacion')->find($idmotivoreicorporacion);
    }

    public function existeDenom($denominacion){

        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('m.denominacion')
            ->from('NomMotreincorporacion m')
            ->where("UPPER(TRIM(m.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}