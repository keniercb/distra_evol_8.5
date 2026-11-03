<?php

/**
 * Clase dominio de Acciones.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class PgClass extends BasePgClass
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'PgNamespace',
            array('local' => 'relnamespace', 'foreign' => 'oid')
        );
    }

}