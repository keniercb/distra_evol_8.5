<?php

include_once('../../../seguridad/models/domain/SegRol.php');
include_once('../../../seguridad/models/domain/SegUsuario.php');

class DatOfertaDictamen extends BaseDatOfertaDictamen
{
    private $_subqueryParams;

    public function setUp()
    {
        parent::setUp();
        $this->HasOne('NomEstado', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasOne('SegRol', array('local' => 'idrol', 'foreign' => 'idrol'));
        $this->hasOne('SegUsuario', array('local' => 'idusuario', 'foreign' => 'idusuario'));
    }

    public function getByParams($params, $torray = true)
    {
        $where = $this->getFilter($params);
        $query = new Doctrine_Query();
        $query->from('DatOfertaDictamen dd')
            ->innerJoin('dd.NomEstado ne')
            ->leftJoin('dd.SegRol sr')
            ->leftJoin('dd.SegUsuario su');

        if ($where) {
            $query->where($where);
        }
        $result = $query->execute();
        return $torray ? $result->toArray() : $result;
    }

    public function getFilter($params, $implode = true)
    {
        $filter = [];
        foreach ($params as $key => $value) {
            if (is_array($value)) {
                $field = $value['field'];
                $type = $value['data']['type'];
                $comparison = $value['data']['comparison'];
                $value = $value['data']['value'] ? $value['data']['value'] : $value;
            }
            if ($field && $type && ($value || $value == 0)) {
                switch ($type) {
                    case 'numeric':
                        $filter[] = $this->getNumericFilter($field, $comparison, $value);
                        break;
                }
            } else {
                $filter[] = $key . '=' . $value;
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
            $query->update('DatOfertaDictamen')->set('activo=?', 0)
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
            $query = 'select a.idoferta from (' . $query . ')a';
            $query .= $this->getQueryWhere($params);
            return $execute ? $this->executeQuery($query) : $query;
        } catch (Exception $e) {
            throw $e;
        }
    }


    public function getCantidadVotos($cant, $execute = true)
    {
        try {
            $query = "select a.idoferta from (select dd.idoferta,count(dd.iddictamen) as cantidadvotos
                from mod_crmcontratacion.dat_ofertadictamen dd
                inner join mod_crmcontratacion.dat_ofertanegocio dc on dd.idoferta = dc.idoferta
                where  ( dd.activo = 1 )  group by dd.idoferta order by dd.idoferta)a
                where  ( cantidadvotos = $cant )";
            return $execute ? $this->executeQuery($query) : $query;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function getSubQuerySelect()
    {
        $querydays = $this->getQueryDays();
        return "select dd.idoferta,dd.idestado,count(dd.iddictamen) as cantidadvotos,($querydays) as cantidaddias from mod_crmcontratacion.dat_ofertadictamen dd
                inner join mod_crmcontratacion.dat_ofertanegocio dc on dd.idoferta = dc.idoferta
		        inner join mod_crmcontratacion.dat_ofertanegocioestado doe on dc.idoferta = doe.idoferta and doe.fechafin ISNULL";
    }

    private function getParams($params, $subquery = false)
    {
        $excluded = $this->_subqueryParams;
        $result = [];
        if ($subquery) {
            $result[] = array('field' => 'activo', 'data' => array('type' => 'numeric', 'value' => 1));
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
                    $diasautomatico = str_replace(
                        'cantidaddiasautomatico', 'cantidaddias', $v
                    );
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
        return ' group by dd.idoferta,dd.idestado,doe.fechainicio';
    }

    private function getOrderBy()
    {
        return ' order by dd.idoferta';
    }

    public function getQueryDays($date = null)
    {
        $date = $date ? "'" . $date . "'" : "doe.fechainicio";
        return "select count(i::date) as cant
                from generate_series($date, '" . date('d-m-Y') . "', '1 day'::interval) i
                where date_part('isodow', i::date) in (1,2,3,4,5)";
    }

    public function getByTime($params){
        $filters=array();
        if($params['estadoinicial'])$filters[]='doe.idestado IN ('.implode(',',$params['estadoinicial']).')';
        if($params['reglaTime'])$filters[]='('.$this->getQueryDays().') > '.$params['reglaTime']['data']['value'];
        foreach($params['reglas'] as $regla){
            if(in_array($regla['field'], array('cliente')))
                $filters[]=$regla['field'].'='.$regla['data']['value'];
        }
        $where='';
        if(count($filters))$where=' WHERE '.implode(' AND ', $filters);
        $query="SELECT dc.idoferta
                FROM mod_crmcontratacion.dat_ofertanegocio dc
		        inner join mod_crmcontratacion.dat_ofertanegocioestado doe on dc.idoferta = doe.idoferta and doe.fechafin ISNULL
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
