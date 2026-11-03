<?php
class DatPlanificacionvacaciones extends BaseDatPlanificacionvacaciones
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('DatPlanificacionvacaciones')->find($id);
    }

    public function getPlanvacaciones()
    {
        $query = Doctrine_Query::create()
            ->select('vac.*')
            ->from('DatPlanificacionvacaciones vac');
        return $query->execute()->toArray();
    }

    public function getPlanvacacionesIdPersona($idpersona,$anno)
    {
        $query = Doctrine_Query::create()
            ->select('vac.*')
            ->from('DatPlanificacionvacaciones vac')
            ->where('vac.idpersona = ?',$idpersona)
            ->andWhere('vac.anno = ?',$anno)
            ->orderBy("vac.mes asc");
        return $query->execute()->toArray();
    }

    public function getPlanvacacionesIdPersonacondatos($idspersona,$anno)
    {
        $query = Doctrine_Query::create()
            ->select('vac.*')
            ->from('DatPlanificacionvacaciones vac')
            ->where('vac.idpersona in (' . implode(',', $idspersona) . ')')
            ->andWhere('vac.anno = ?',$anno)
            ->andWhere('vac.priquincena is not null or vac.segquincena is not null')
            ->orderBy("vac.mes asc");
        return $query->execute()->toArray();
    }

    public function sumPlanvacacionesIdPersona($idpersona,$anno)
    {
        $query = Doctrine_Query::create()
            ->select('sum(vac.priquincena) as sumpriquincena,sum(vac.segquincena) as sumsegquincena')
            ->from('DatPlanificacionvacaciones vac')
            ->where('vac.idpersona = ?',$idpersona)
            ->andWhere('vac.anno = ?',$anno);
        //print_r($query->getSqlQuery());die;
        return $query->execute()->toArray();
    }

    public function deletePlanVacacionesPersona($idpersona, $anno)
    {
        try{
            $query = new Doctrine_Query ();
            $result = $query->delete('DatPlanificacionvacaciones ')
                ->where("idpersona = ?",$idpersona)
                ->andWhere("anno = ?", $anno);
            $result->execute();
            return true;
        }
        catch(Exception $e)
        {
            throw $e;
        }
    }
}
?>
