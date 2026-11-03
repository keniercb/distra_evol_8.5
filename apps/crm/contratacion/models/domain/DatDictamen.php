<?php

include_once('../../../seguridad/models/domain/SegRol.php');
include_once('../../../seguridad/models/domain/SegUsuario.php');

class DatDictamen extends BaseDatDictamen
{
    private $_subqueryParams;

    public function setUp()
    {
        parent::setUp();
        $this->HasOne(
            'NomEstado', array('local' => 'idestado', 'foreign' => 'idestado')
        );
        $this->hasOne(
            'SegRol', array('local' => 'idrol', 'foreign' => 'idrol')
        );
        $this->hasOne(
            'SegUsuario',
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
    }

    public function getByParams($params, $torray = true)
    {
        $where = $this->getFilter($params);
        $query = new Doctrine_Query();
        $query->from('DatDictamen dd')
            ->innerJoin('dd.NomEstado ne')
            ->leftJoin('dd.SegRol sr') // ->innerJoin('dd.SegRol sr')
            ->leftJoin('dd.SegUsuario su') // ->innerJoin('dd.SegUsuario su')
            ->orderBy('dd.fecha,dd.idrol');

        if ($where) {
            $query->where($where);
        }
        $result = $query->execute();
        return $torray ? $result->toArray() : $result;
    }

    public function getFilter($params, $implode = true)
    {
        $filter = [];
        foreach ($params as $key => $v) {
            if (is_array($v)) {
                $field = $v['field'];
                $type = $v['data']['type'];
                $comparison = $v['data']['comparison'];
                $value = $v['data']['value'] || $v['data']['value'] == 0
                    ? $v['data']['value'] : $v;
            }
            if ($field && $type && ($value || $value == 0)) {
                switch ($type) {
                    case 'numeric':
                        $filter[] = $this->getNumericFilter(
                            $field, $comparison, $value
                        );
                        break;
                }
            } else {
                $filter[] = $key . '=' . $v;
            }
        }
        return $implode ? implode(' AND ', $filter) : $filter;
    }

    private function getNumericFilter($field, $comparison, $value)
    {
        if ($comparison == 'lt') {
            return $field . " < " . $value;
        }
        if ($comparison == 'lte') {
            return $field . " <= " . $value;
        }
        if ($comparison == 'gt') {
            return $field . " > " . $value;
        }
        if ($comparison == 'gte') {
            return $field . " >= " . $value;
        }
        if (is_array($value)) {
            return $field . " in( " . implode(' , ', $value) . ")";
        } else {
            return $field . " = " . $value;
        }
    }

    public function deleteByParams($params)
    {
        try {
            $where = $this->getFilter($params);
            $query = new Doctrine_Query();
            $query->update('DatDictamen')->set('activo=?', 0)
                ->where($where);
            $query->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getByRules($params, $execute = true)
    {
        try {
            if (!count($params)) {
                return;
            }
            $this->_subqueryParams = array('idrol', 'cliente');
            $query = $this->getSubQuerySelect();
            $query .= $this->getQueryWhere($params, true);
            $query .= $this->getGruopBy();
            $query .= $this->getOrderBy();
            $query = 'select a.idcontrato from (' . $query . ')a';
            $query .= $this->getQueryWhere($params);
//            print($query);
            return $execute ? $this->executeQuery($query) : $query;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function setStateByRules($params, $idstate)
    {
        try {
            $query = $this->getByRules($params, false);
            $query = $this->getQueryUpdate($query, $idstate);
            return $this->executeQuery($query);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getCantidadVotos($cant, $execute = true)
    {
        try {
            $query = "select a.idcontrato from (select dd.idcontrato,count(dd.iddictamen) as cantidadvotos
                from mod_crmcontratacion.dat_dictamen dd
                inner join mod_crmcontratacion.dat_contrato dc on dd.idcontrato = dc.idcontrato
                where  ( dd.activo = 1 )  group by dd.idcontrato order by dd.idcontrato)a
                where  ( cantidadvotos = $cant )";
            return $execute ? $this->executeQuery($query) : $query;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function getSubQuerySelect()
    {
        $querydays = $this->getQueryDays();
        return "select dd.idcontrato,dd.idestado,count(dd.iddictamen) as cantidadvotos,($querydays) as cantidaddias from mod_crmcontratacion.dat_dictamen dd
                inner join mod_crmcontratacion.dat_contrato dc on dd.idcontrato = dc.idcontrato 
                LEFT JOIN mod_crmcontratacion.dat_contratoestado ce ON (ce.idcontrato=dd.idcontrato AND ce.fechafin IS NULL)";
//        return "select dd.idcontrato,dd.idestado,count(dd.iddictamen) as cantidadvotos,($querydays) as cantidaddias from mod_crmcontratacion.dat_dictamen dd
//                inner join mod_crmcontratacion.dat_contrato dc on dd.idcontrato = dc.idcontrato
//                LEFT JOIN mod_crmcontratacion.dat_contratoestado ce ON (ce.idcontrato=dd.idcontrato AND ce.fechafin IS NULL)";
    }

    private function getQueryUpdate($querySelect, $idstate)
    {
        return "update mod_crmcontratacion.dat_contrato set idestado = $idstate where idcontrato in ($querySelect)";
    }

    private function getParams($params, $subquery = false)
    {
        $excluded = $this->_subqueryParams;
        $result = [];
        if ($subquery) {
            $result[] = array('field' => 'dd.activo',
                              'data'  => array('type' => 'numeric',
                                               'value' => 1));
        }
        foreach ($params as $key => $value) {
            $inArray = in_array($value['field'], $excluded);
            $condition = $subquery ? $inArray : !$inArray;
            if ($condition) {
                $result[] = $value;
            }
        }
        return $result;
    }

    private function getQueryWhere($params, $subquery = false)
    {
        $params = $this->getParams($params, $subquery);
        $filter = $this->getFilter($params, false);
        $where = '';
        if (count($filter)) {
            foreach ($filter as $key => $v) {
                if (strpos($v, 'cantidaddiasautomatico') !== false) {
                    if($subquery){
                        $diasautomatico = '(('.$this->getQueryDays().'))';
                    }else {
                        $diasautomatico = str_replace(
                            'cantidaddiasautomatico', 'cantidaddias', $v
                        );
                    }
                    unset($filter[$key]);
                }
            }
            $where = ' ( ' . implode(' AND ', $filter) . ' ) ';
            $where .= $diasautomatico ? ' OR ' . $diasautomatico : '';
            $where = ' where ' . $where;
        }
        return $where;
    }

    private function getGruopBy()
    {
        return ' group by dd.idcontrato,dd.idestado,ce.fechainicio';
    }

    private function getOrderBy()
    {
        return ' order by dd.idcontrato';
    }

    public function getQueryDays($date = null)
    {
        $date = $date ? "'" . $date . "'" : "ce.fechainicio";
        return "select count(i::date) as cant
                from generate_series($date, '" . date('d-m-Y') . "', '1 day'::interval) i
                where date_part('isodow', i::date) in (1,2,3,4,5)";
    }

    public function getByTime($params){
        $filters=array();
        if($params['estadoinicial'])$filters[]='ce.idestado IN ('.implode(',',$params['estadoinicial']).')';
        if($params['reglaTime'])$filters[]='('.$this->getQueryDays().') > '.$params['reglaTime']['data']['value'];
        foreach($params['reglas'] as $regla){
            if(in_array($regla['field'], array('cliente')))
                $filters[]=$regla['field'].'='.$regla['data']['value'];
        }
        $where='';
        if(count($filters))$where=' WHERE '.implode(' AND ', $filters);
        $query="SELECT dc.idcontrato
                FROM mod_crmcontratacion.dat_contrato dc
                LEFT JOIN mod_crmcontratacion.dat_contratoestado ce ON (ce.idcontrato = dc.idcontrato AND ce.fechafin IS NULL)
                $where ";
        return $this->executeQuery($query);
    }

    public function executeQuery($query)
    {
        try {
            $doctrine = Doctrine_Manager::getInstance();
            $conexion = $doctrine->getCurrentConnection();
            return $conexion->fetchAll($query);
        } catch (Exception $e) {
            throw $e;
        }
    }

}
