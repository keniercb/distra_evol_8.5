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
            'multipleseleccion' => ($values['multipleseleccion'])?$values['multipleseleccion']: 0,
            'paginado' => ($values['paginado'])?$values['paginado']: 0,
        );
    }

    public function getNomencladorData($query)
    {
        if($this->tipofuentedatos)
            return $this->getNomencladorDataService();
        return $this->getNomencladorDataSql($query);
    }

    private function getNomencladorDataService()
    {
        $result = '';
        eval('$result = '.$this->nomservicio.';');
        return $result;
    }

    private function getNomencladorDataSql($query)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql = trim($this->sentenciasql);
        if($sql[strlen($sql)-1]==';'){
            $sql=substr($sql, 0, strlen($sql)-1);
        }
//        print($sql);
//        print('/*uh uh uh '.stripos($sql, ' p ').'*/');
        if($query && stripos($sql, ' p ')!=false){
//            print('/*wiiiii*/');
            $where=stripos($sql, ' WHERE ')==false?' WHERE ':' AND ';
//            $alias=$this->getAlias($sql);
            $alias='p.';
            $sql.= "$where $alias".$this->nomdenominacion." ILIKE '%".$query."%' ";
        }
        if ($this->paginado && !is_null($_REQUEST['start']) && !is_null($_REQUEST['limit'])) {
            $sql.= " OFFSET ". $_REQUEST['start']." LIMIT ".$_REQUEST['limit'];
        }
        return $conn->fetchAll($sql);
    }

    public function getNomencladorDataSqlCount($query)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql=$this->sentenciasql;
        if($query && stripos($sql, ' p ')!=false){
//            print('/*wiiiii*/');
            $where=stripos($sql, ' WHERE ')==false?' WHERE ':' AND ';
//            $alias=$this->getAlias($sql);
            $alias='p.';
            $sql.= "$where $alias".$this->nomdenominacion." ILIKE '%".$query."%' ";
        }
        $final=stristr($sql, 'FROM');
        $sql = 'SELECT count(*) '.$final;
        return $conn->fetchAll($sql)[0]['count'];
    }

    private function getAlias($sql){
        $temp1=stristr($sql, ' FROM ');
        $temp2=stristr(substr($temp1, 6), ' ');
        $temp3=stristr(trim($temp2), ' ', true);
        $temp3=trim($temp3);
//        print($sql);
//        print('2:'.$temp1.'//');
//        print('3:'.$temp2.'//');
//        print('4:'.$temp3.'//');die;
        if(!in_array($temp3, ['WHERE', 'LEFT', 'INNER', 'RIGHT', 'OFFSET', '', ' ', 'where', 'left', 'inner'])){
            return $temp3.'.';
        }
        return '';
    }
}