<?php

class DatPrioridadcentrobalance extends BaseDatPrioridadcentrobalance
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'DatEntidaddatosnomenclador', array('local'   => 'idcentrobalance',
                                                'foreign' => 'identidaddatosnomenclador')
        );
    }

    public function actualizarPrioridad($idespecialidad, $prioridad,
        $centrobalance
    )
    {
        $arrayParams = array();
        $arrayParams[] = $prioridad;
        $arrayParams[] = $idespecialidad;
        $arrayParams[] = $centrobalance;
        $conn = Doctrine_Manager::connection();
        $sqlQuery
            = "UPDATE  mod_planificacion.dat_prioridadcentrobalance
        SET prioridad =?
        WHERE idespecialidad =? AND idcentrobalance=?";
        $res = $conn->execute($sqlQuery, $arrayParams); //$array_parametros
        $res = $res->fetchAll(PDO::FETCH_ASSOC);
    }

}
