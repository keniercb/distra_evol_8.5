<?php
/**
 * ReporteFiltroTexto
 *
 * @package Domain.
 * @subpackage Entity.
 * @copyright UCID
 * @version 1.0
 */
class ReporteFiltroTexto extends DatReporteFiltroTextoMapper implements IReporteFiltroType
{
    public function setUp()
    {
        $this->hasOne('ReporteFiltro', array('local' => 'idfiltro', 'foreign' => 'idfiltro'));
    }

    public function formatFilterValues($values)
    {
        return array(
            'longitudminima' => ($values['longitudminima'])?$values['longitudminima']: null,
            'longitudmaxima' => $values['longitudmaxima'],
        );
    }
}