<?php

class DatCierreejercicio extends BaseDatCierreejercicio
{

    public function setUp()
    {
        parent::setUp();
//        $this->hasOne('DatEjerciciocontable', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
    }

    public function buscarPorId($idcierreejercicio)
    {
        $temp = $this->conn->getTable('DatCierreejercicio')->find($idcierreejercicio);
        return $temp->toArray();
    }

    public function getTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatCierreejercicio')->execute();
        return $result->toArray();
    }

}
?>


