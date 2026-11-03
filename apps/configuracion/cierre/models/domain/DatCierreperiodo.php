<?php

class DatCierreperiodo extends BaseDatCierreperiodo
{

    public function setUp()
    {
        parent::setUp();
//        $this->hasOne('DatEstructurasubsist', array('local' => 'idestructurasubsist', 'foreign' => 'idestructurasubsist'));
//        $this->hasOne('DatPeriodocontable', array('local' => 'idperiodo', 'foreign' => 'idperiodo'));
    }

    public function buscarPorId($idcierreperiodo)
    {
        $temp = $this->conn->getTable('DatCierreperiodo')->find($idcierreperiodo);
        return $temp->toArray();
    }

    public function getTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatCierreperiodo')->execute();
        return $result->toArray();
    }

    public function ObtenerCierre($idestrucutrasubsit, $idperiodo)
    {
        try{
            $query = new Doctrine_Query ();
            $result = $query->from('DatCierreperiodo')
                ->where('idestructurasubsist=? AND idperiodo=?', array($idestrucutrasubsit, $idperiodo))
                ->execute();
            return $result->toArray();
        }catch (Exception $e){
            throw $e;
        }
    }

}

?>


