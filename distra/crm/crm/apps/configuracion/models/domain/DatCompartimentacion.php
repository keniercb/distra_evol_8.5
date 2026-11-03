<?php

/**
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @copyright (c) 2015, XETID
 */
class DatCompartimentacion extends BaseDatCompartimentacion
{
    private $_query;
    private $_result;

    public function setUp()
    {
        parent::setUp();
    }

    public function getCompartimentacion($params)
    {
        try {
            $doctrine = Doctrine_Manager::getInstance();
            $conexion = $doctrine->getCurrentConnection();
            $query = $this->getMainQuery($params);
//            print_r($params);die;
            $filters = $this->getFilters($params['filter']);
            if (count($filters)) {
                $where = " AND " . implode(" AND ", $filters);
                $query .= $where;
            }
//            $query .= $this->getSortQuery($params['sort']);
            if (!is_null($params['start']) && !is_null($params['limit'])) {
                $query .= " offset " . $params['start'] . " limit "
                    . $params['limit'];
            }
            $result = $conexion->fetchAll($query);
            $count = count($result) ? $result[0]['count'] : 0;

            return array('data' => $result, 'count' => $count);
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function getMainQuery($params)
    {
        $where='';
//        print_r($params['modelName']);die;
        if($params['modelName']){
            $where=" WHERE dc.modulo='".$params['modelName']."'";
        }
        return "SELECT dc.*,sr.denominacion as nombrerol,count(dc.*) over() 
                FROM mod_crmadministracion.dat_compartimentacion dc
                INNER JOIN mod_seguridad.seg_rol sr ON sr.idrol = dc.idrol".$where;
    }

    private function getSortQuery($sort)
    {
        if ($sort) {
            $sort = json_decode($sort);
            $query = " ORDER BY";
            $result = [];
            foreach ($sort as $field) {
                $result[] = " $field->property $field->direction";
            }
            return $query . implode(',', $result);
        }
    }

    public function getFilters($params)
    {
        $isstring = array('string', 'character varying', 'varchar');
        $isnumeric = array('numeric', 'int');
        $fields = array('nombrerol' => 'sr.denominacion',
                        'idrol'     => 'dc.idrol');
        $filter = array();
        foreach ($params as $param) {
            $field = $fields[$param['field']] ? $fields[$param['field']]
                : $param['field'];
            $type = $param['data']['type'];
            $value = $param['data']['value'];
            $comparison = $param['data']['comparison'];

            if (in_array($type, $isstring)) {
                $result = $this->getStringFilter($field, $value);
                if ($result) {
                    $filter[] = $result;
                }
            }

            if (in_array($type, $isnumeric)) {
                $result = $this->getNumericFilter($field, $value);
                if ($result) {
                    $filter[] = $result;
                }
            }
        }
        return $filter;
    }

    private function getStringFilter($field, $value)
    {
        if ($value) {
            return "$field ILIKE '%" . $value . "%'";
        }
    }

    private function getNumericFilter($field, $value)
    {
        if ($value) {
            if (is_array($value)) {
                return $field . " in( " . implode(' , ', $value) . ")";
            } else {
                return $field . " = " . $value;
            }
        }

    }

}
