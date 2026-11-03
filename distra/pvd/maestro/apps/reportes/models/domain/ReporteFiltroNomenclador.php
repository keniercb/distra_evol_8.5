<?php
/**
 * ReporteFiltroNomenclador
 *
 * @package Domain.
 * @subpackage Entity.
 * @copyright UCID
 * @version 1.0
 */
class ReporteFiltroNomenclador extends DatReporteFiltroNomencladorMapper implements IReporteFiltroType
{
    public function setUp()
    {
        $this->hasOne('ReporteFiltro', array('local' => 'idfiltro', 'foreign' => 'idfiltro'));
    }

    public function formatFilterValues($values)
    {
        return array(
            'nomidentificador' => $values['nomidentificador'],
            'nomdenominacion' => $values['nomdenominacion'],
            'tipofuentedatos' => $values['tipofuentedatos'],
            'sentenciasql' => ($values['sentenciasql'])?$values['sentenciasql']: null,
            'nomservicio' => ($values['nomservicio'])?$values['nomservicio']: null,
        );
    }

    public function getNomencladorData()
    {
        if($this->tipofuentedatos)
            return $this->getNomencladorDataService();
        return $this->getNomencladorDataSql();
    }

    private function getNomencladorDataService()
    {
        $result = '';
        eval('$result = '.$this->nomservicio.';');
        return $result;
    }

    private function getNomencladorDataSql()
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        return $conn->fetchAll($this->sentenciasql);
    }
}