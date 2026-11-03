<?php
/**
 * ModuloReporte
 *
 * @package Domain.
 * @subpackage Entity.
 * @copyright UCID
 * @version 1.0
 */
class ModuloReporte extends DatModuloReporteMapper
{
    public function setUp()
    {
        $this->hasMany('Reporte', array('local' => 'idmodulo', 'foreign' => 'idmodulo'));
    }
}