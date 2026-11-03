<?php
/**
 * ReporteFiltro
 *
 * @package Domain.
 * @subpackage Entity.
 * @copyright UCID
 * @version 1.0
 */
class ReporteFiltro extends DatReporteFiltroMapper
{
    public function setUp()
    {
        $this->hasOne('Reporte', array('local' => 'idreporte', 'foreign' => 'idreporte'));
        $this->hasOne('ReporteFiltroNomenclador', array('local' => 'idfiltro', 'foreign' => 'idfiltro'));
        $this->hasOne('ReporteFiltroNumerico', array('local' => 'idfiltro', 'foreign' => 'idfiltro'));
        $this->hasOne('ReporteFiltroTexto', array('local' => 'idfiltro', 'foreign' => 'idfiltro'));
//        $this->hasOne('ReporteFiltroEstructura', array('local' => 'idfiltro', 'foreign' => 'idfiltro'));
    }

    public function fromArray($values)
    {
        parent::fromArray($this->formatValues($values));
    }

    public function synchronizeWithArray($values)
    {
        parent::synchronizeWithArray($this->formatValues($values));
    }

    public function formatValuesToLinealArray($values)
    {
        $result = array_merge(
            $values,
            (array)$values['ReporteFiltroTexto'],
            (array)$values['ReporteFiltroNumerico'],
            (array)$values['ReporteFiltroNomenclador']
//            (array)$values['ReporteFiltroEstructura']
        );
        unset($result['ReporteFiltroTexto'], $result['ReporteFiltroNumerico'],
            $result['ReporteFiltroNomenclador']);
        return $result;
    }

    private function formatValues($values)
    {
        $values['javatype'] = $this->getJavaTypeFilterType($values);

        $className = $this->getFilterTypeClassNameFactory($values['tipo']);
        if(!empty($className))
            $values[$className] = (new $className())->formatFilterValues($values);
//        print_r($values);die;
        return $values;
    }

    private function getJavaTypeFilterType($values)
    {
        switch($values['tipo']){
            case 1:
                return 'java.lang.String';
            case 2:
                return 'java.util.Date';
            case 5:
                return 'java.util.String';
            default:
                return $values['javatype'];
        }
    }

    private function getFilterTypeClassNameFactory($type)
    {
        switch($type){
            case 1:
                return 'ReporteFiltroTexto';break;
            case 3:
                return 'ReporteFiltroNumerico';break;
            case 4:
                return 'ReporteFiltroNomenclador';break;
            default:
                return '';
        }
    }
}