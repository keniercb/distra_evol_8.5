<?php

class DatSubsistemaConfDoc extends BaseDatSubsistemaConfDoc
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'ConfDoc', array('local' => 'idtipodoc', 'foreign' => 'idtipodoc')
        );
        $this->hasOne(
            'DatSubsistema',
            array('local' => 'idsubsistema', 'foreign' => 'idsubsistema')
        );
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatSubsistemaConfDoc')->execute();
        return $result->toArray();

    }

    public function GetPorLimite($limite = 1, $inicio = 10)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatSubsistemaConfDoc')->limit($limite = 1)
            ->offset($inicio = 10)->execute();
        return $result->toArray();

    }

    public function EliminarSub($idtdoc)
    {
        $conn = Zend_Registry::get('conexion');
        $conn->execute(
            "DELETE FROM mod_flujotrabajo.dat_subsistema_conf_doc as d 
                WHERE d.idtipodoc = '$idtdoc';"
        );
        return true;
    }
}//fin clase 



