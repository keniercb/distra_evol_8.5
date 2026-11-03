<?php

/**
 * DatDestino
 *
 *
 * @ author Drisis Silvia Díaz Rodriguez
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class DatDestino extends BaseDatDestino {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomActividad', array('local' => 'idactividad', 'foreign' => 'idactividad')
        );
        $this->hasOne(
                'NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
    }

}
