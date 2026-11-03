<?php

/**
 * DatNecesidaddesglose
 *
 *
 * @ author Drisis Díaz Rodríguez
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class DatNecesidaddesglose extends BaseDatNecesidaddesglose {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomIndicador', array('local' => 'idindicador', 'foreign' => 'idpadre')
        );
        $this->hasOne(
                'DatDesgloseentidad', array('local' => 'iddesgloseentidad',
            'foreign' => 'iddesgloseentidad')
        );
        $this->hasOne(
                'NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
    }

}
