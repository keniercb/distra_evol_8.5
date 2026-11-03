<?php 
class DatCausasreporteausencia extends BaseDatCausasreporteausencia
 { 
   public function setUp() 
    {   parent::setUp();
        $this->hasOne('NomCausa', array('local' => 'idcausa', 'foreign' => 'idcausa'));
    }

    public function eliminarCausasreporteausencia($idvariablesconfreportescertificaciones)
    {
        $queryObj = Doctrine_Query::create()
            ->delete()
            ->from('DatCausasreporteausencia')
            ->where('idvariablesconfreportescertificaciones = ?', $idvariablesconfreportescertificaciones);
        return $queryObj->execute();
    }

    public function existeCausasreporteausencia($idvariablesconfreportescertificaciones){

        $queryObj = Doctrine_Query::create()
            ->select('idvariablesconfreportescertificaciones')
            ->from('DatCausasreporteausencia')
            ->where('idvariablesconfreportescertificaciones = ?',$idvariablesconfreportescertificaciones);
        return $queryObj->fetchArray();
    }

    public function getCausasByIdreporteausencia($idvariablesconfreportescertificaciones){
        $queryObj = Doctrine_Query::create()
            ->select('idcausa')
            ->from('DatCausasreporteausencia')
            ->where('idvariablesconfreportescertificaciones = ?',$idvariablesconfreportescertificaciones);
        return $queryObj->fetchArray();
    }

    public function getCausasReporteAusencia(){
        $query = Doctrine_Query::create()
                ->select('ca.*,nc.abreviatura as abreviatura')
                        ->from('DatCausasreporteausencia ca')
                        ->innerJoin('ca.NomCausa nc on ca.idcausa = nc.idcausa');
        return $query->execute()->toArray();
    }

    public function existeCausa($idcausa){

        $queryObj = Doctrine_Query::create()
            ->select('idcausa')
            ->from('DatCausasreporteausencia')
            ->where('idcausa = ?',$idcausa);

        return $queryObj->fetchArray();
    }

    public function eliminarCausa($idcausa)
    {
        $queryObj = Doctrine_Query::create()
            ->delete()
            ->from('DatCausasreporteausencia')
            ->where('idcausa = ?', $idcausa);
        return $queryObj->execute();
    }



}//fin clase 
?>


