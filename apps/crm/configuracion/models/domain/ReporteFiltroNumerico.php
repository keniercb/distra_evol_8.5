<?php
/**
 * ReporteFiltroNumerico
 *
 * @package Domain.
 * @subpackage Entity.
 * @copyright UCID
 * @version 1.0
 */
class ReporteFiltroNumerico extends DatReporteFiltroNumericoMapper implements IReporteFiltroType
{
    public function setUp()
    {
        $this->hasOne('ReporteFiltro', array('local' => 'idfiltro', 'foreign' => 'idfiltro'));
    }

    public function formatFilterValues($values)
    {
        return array(
            'valorminimo' => ($values['valorminimo'])?$values['valorminimo']: null,
            'valormaximo' => $values['valormaximo'],
        );
    }
}