<?php

/**
 * Description of NomProductoservicio
 *
 * @author Kenier
 */
class NomProductoservicio extends BaseNomProductoservicio
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomIndicador', array('local' => 'idnomproducto', 'foreign' => 'idindicador'));
        $this->hasOne('NomIndicador', array('local' => 'idservicio', 'foreign' => 'idindicador'));
    }

}
