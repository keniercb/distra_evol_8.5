<?php
class NomMotivoexclusion extends BaseNomMotivoexclusion
{
	public function setUp()
    {
        parent :: setUp();
    }

    public function getMotivoExclusionActivas()
    {
        $queryObj = Doctrine_Query::create()
            ->select('v.idmotivoexclusion, v.denominacion, v.fdesde, v.fhasta, v.descripcion')
            ->from('NomMotivoexclusion v')
            ->where('v.fdesde <= now() and (now() <= v.fhasta or v.fhasta is null)');;
        return $queryObj->fetchArray();
    }
	
	public function getMotivoExclusion($denom, $fdesde, $fhasta, $inicio, $limite)
	{
        $denominacion = strtoupper($denom);
        $queryObj = Doctrine_Query::create()
            ->select('v.idmotivoexclusion, v.denominacion, v.fdesde, v.fhasta, v.descripcion, v.gestion')
            ->from('NomMotivoexclusion v');
        if(!empty($denominacion)){
            $queryObj->addWhere("v.denominacion ilike '%$denominacion%'");
        }
        if(!empty($fdesde)){
            $queryObj->addWhere('v.fdesde = ?', $fdesde);
        }
        if(!empty($fhasta)){
            $queryObj->limit($limite)->offset($inicio);
        }
        if(!empty($inicio) && !empty($limite)){
            $queryObj->addWhere('v.fhasta = ?', $fhasta);
        }
        return $queryObj->fetchArray();
	}

    public function cantMotivoExclusion($denom, $fdesde, $fhasta)
    {
            $denominacion = strtoupper($denom);
            $queryObj = Doctrine_Query::create()
                ->select()
                ->from('NomMotivoexclusion v');
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
	
	public function getById($idmotivoexclusion)
    {
        return Doctrine::getTable('NomMotivoexclusion')->find($idmotivoexclusion);
    }

    public function existeDenom($denominacion){

        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('m.denominacion')
            ->from('NomMotivoexclusion m')
            ->where("UPPER(TRIM(m.denominacion)) = UPPER(TRIM('$denominacion'))");
        return $queryObj->fetchArray();
    }
}