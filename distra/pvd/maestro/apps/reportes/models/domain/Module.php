<?php
/**
 * Module
 *
 * @package Domain.
 * @subpackage Entity.
 * @copyright UCID
 * @version 1.0
 */
class Module extends DatModuleMapper
{
    public function setUp()
    {
        $this->hasMany('Reporte', array('local' => 'idmodulo', 'foreign' => 'idmodulo'));
    }
}