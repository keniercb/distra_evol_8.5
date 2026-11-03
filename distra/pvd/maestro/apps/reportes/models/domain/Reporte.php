<?php
/**
 * Reporte
 *
 * @package Domain.
 * @subpackage Entity.
 * @copyright UCID
 * @version 1.0
 */
class Reporte extends DatReporteMapper
{
    public function setUp()
    {
        $this->hasOne('Module', array('local' => 'idmodulo', 'foreign' => 'idmodulo'));
        $this->hasMany('ReporteFiltro', array('local' => 'idreporte', 'foreign' => 'idreporte'));
    }

    public function fromArray($values)
    {
        parent::fromArray($this->formatValues($values));
    }

    public function synchronizeWithArray($values)
    {
        parent::synchronizeWithArray($this->formatValues($values));
    }

    private function formatValues($values)
    {
        $values['idpadre'] = ( $values['idpadre'] )? $values['idpadre'] : null;
        $values['identificador'] = ( $values['identificador'] )? $values['identificador'] : null;
        $values['general'] = ( $values['general'] || $values['general'] == 0)? $values['general'] : null;
        $values['tipocontenido'] = ( $values['tipocontenido'] )? $values['tipocontenido'] : null;
        $values['recurso'] = ( $values['recurso'] )? $values['recurso'] : null;
        $values['url'] = ( $values['url'] )? $values['url'] : null;
        $values['nombrecomponente'] = ( $values['nombrecomponente'] )? $values['nombrecomponente'] : null;
        $values['otroformato'] = ( $values['otroformato'] || $values['otroformato'] == 0)? $values['otroformato'] : null;
		
        return $values;
    }
}