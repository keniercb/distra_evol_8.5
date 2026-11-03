<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of DatRescostoactividad
 *
 * @author roberto
 */
class DatRescostoactividad extends BaseDatRescostoactividad
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'NomActividad', array('local' => 'idactividadquegenera', 'foreign' =>
                'idactividad')
        );
        $this->hasOne(
            'NomEjercicioplanificacion', array('local' => 'idejercicio',
                'foreign' => 'idejercicio')
        );
    }

}
