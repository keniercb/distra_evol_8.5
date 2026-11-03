<?php

/**
 * @class      DatUnidadSaludDispensacion
 * @package    Farmacia
 * @subpackage Configuracion
 * @author     Daniel Arias espinosa
 * @copyright  XETID
 * @version    1.0
 */
class DatUnidadSaludDispensacion extends BaseDatUnidadSaludDispensacion
{

    public function setUp()
    {
        $this->hasOne('ConfCuadroBasico', array('local' => 'idcuadrobasico', 'foreign' => 'idcuadrobasico'));
        parent:: setUp();
    }

}
