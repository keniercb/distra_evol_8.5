<?php

/**
 * Created by PhpStorm.
 * User: Yoendy
 * Date: 6/08/14
 * Time: 15:26
 */
class DatResponsable extends BaseDatResponsable
{

    public function setUp()
    {
        parent:: setUp();
        if (class_exists('DatPersona')) {
            $this->hasOne(
                'DatPersona',
                array('local' => 'idpersona', 'foreign' => 'idpersona')
            );
        }
        $this->hasOne(
            'DatPersonaLocal',
            array('local' => 'idpersona', 'foreign' => 'idpersona')
        );

    }

} 