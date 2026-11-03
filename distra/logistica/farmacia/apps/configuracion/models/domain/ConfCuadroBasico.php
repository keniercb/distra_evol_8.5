<?php

/**
 * @class      ConfCuadroBasico
 * @package    Farmacia
 * @subpackage Configuracion
 * @author     Daniel Arias espinosa
 * @copyright  XETID
 * @version    1.0
 */
class ConfCuadroBasico extends BaseConfCuadroBasico
{

    public function setUp()
    {
        $this->hasMany('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('DatUnidadSaludDispensacion', array('local' => 'idcuadrobasico', 'foreign' => 'idcuadrobasico'));
        parent:: setUp();
    }
}
