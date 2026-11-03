<?php
class  NomMotivoseguimiento extends BaseNomMotivoseguimiento
{
	public function setUp()
    {
        parent :: setUp();
    }

    public function getMotivosSeguimientoActivos()
    {
        $queryObj = Doctrine_Query::create()
            ->select('v.idmotivoseguimiento, v.denominacion, v.fdesde, v.fhasta, v.descripcion')
            ->from('NomMotivoseguimiento v')
            ->where('v.fdesde <= now() and (now() <= v.fhasta or v.fhasta is null)');;
        return $queryObj->fetchArray();
    }
	
	public function getMotivosSeguimientoAll($denom, $fdesde, $fhasta, $inicio, $limite)
	{
        $denominacion = strtoupper($denom);
        $queryObj = Doctrine_Query::create()
            ->select('v.idmotivoseguimiento, v.denominacion, v.fdesde, v.fhasta, v.descripcion, v.gestion')
            ->from('NomMotivoseguimiento v')
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

    public function cantMotivosSeguimientoAll($denom, $fdesde, $fhasta)
    {
            $denominacion = strtoupper($denom);
            $queryObj = Doctrine_Query::create()
                ->select()
                ->from('NomMotivoseguimiento v');
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
	
	public function getById($idmotivoseguimiento)
    {
        return Doctrine::getTable('NomMotivoseguimiento')->find($idmotivoseguimiento);
    }

    public function existeDenom($denominacion)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('m.denominacion')
            ->from('NomMotivoseguimiento m')
            ->where("UPPER(TRIM(m.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}
