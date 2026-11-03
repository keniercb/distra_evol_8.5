<?php

class DatProforma extends BaseDatProforma
{
    private $_result;
    private $_alias;
    private $_relations;
    private $_where;

    public function setUp()
    {
        $this->hasOne('DatTipoContrato', array('local' => 'idtipocontrato', 'foreign' => 'idtipocontrato'));
        $this->hasMany('DatProformaClausula', array('local' => 'idproforma', 'foreign' => 'idproforma'));
        $this->hasOne('Plantilla', array('local' => 'idplantilla', 'foreign' => 'idplantilla'));
        parent::setUp();
    }

    public function preInsertValues($params)
    {
        $idestructura = ZendExt_GlobalConcept::getInstance(
        )->Estructura->idestructura;
        $params['idestructuracomun'] = $idestructura;
        return $params;
    }

    public function postInsertValues($out)
    {
        $clausulas = json_decode($out['params']['clausulas']);
        $idproforma = $out['model']->idproforma;

        if (!empty($clausulas)) {
            foreach ($clausulas as $cl) {
                $model = new DatProformaClausula();
                $model->idproforma = $idproforma;
                $model->idclausula = $cl->idclausula;
                $model->contenido = $cl->contenido;
                $model->orden = $cl->orden;
                $model->save();
            }
        }
    }

    public function postModifyValues($out)
    {
        $clausulas = json_decode($out['params']['clausulas']);
        $idproforma = $out['model']->idproforma;

        $query = new Doctrine_Query();
        $query->delete()->from('DatProformaClausula dcm')->where('dcm.idproforma=?', $idproforma)->execute();

        if (!empty($clausulas)) {
            foreach ($clausulas as $cl) {
                $model = new DatProformaClausula();
                $model->idproforma = $idproforma;
                $model->idclausula = $cl->idclausula;
                $model->contenido = $cl->contenido;
                $model->orden = $cl->orden;
                $model->save();
            }
        }
    }

    public function createQuery($params)
    {
        $agStart = $params[0];
        $agLimit = $params[1];
        $agOrder = $params[2];
        $agOrderDirect = $params[3];

        $modelName = get_class($this);
        $columsId = $this->getTable()->getIdentifierColumnNames();
        $strIdentifiesColumns = implode(', a.', $columsId);
        $columns = $this->getTable()->getColumnNames();
        $strIColumns = implode(', a.', $columns);

        // Verificar el orden de los datos
        if (!$agOrder) {
            $agOrder = $strIdentifiesColumns;
        } else {
            $temp = explode('.', $agOrder);
            if (count($temp) == 2) {
                $agOrder = $this->_relations[$temp[0]]['alias'] . '.' . $temp[1];
            }
        }

        // Busar los elementos definidos dentro del inicio y limite ordenados
        $q = new Doctrine_Query();
        $this->_result = $q->select('a.' . $strIColumns)->from($modelName . ' a ')
            ->orderby($agOrder . ' ' . $agOrderDirect)->offset($agStart)
            ->limit($agLimit);
    }

    public function getModelData($params)
    {
        $agFiltre = $params[4];

        $this->_relations = array(
            "DatProformaClausula" => array("alias" => "b2", "join" => "a", "leftjoin" => true),
            "NomClausula"         => array("alias" => "b3", "join" => "b2", "leftjoin" => true),
            "DatTipoContrato"     => array("alias" => "b4", "join" => "a", "leftjoin" => false),
            "Plantilla"           => array("alias" => "b5", "join" => "a", "leftjoin" => true),
        );

        $global = ZendExt_GlobalConcept::getInstance();
        $idestructura = $global->Estructura->idestructura;

        $this->_where = array('idestructuracomun = ' . $idestructura);

        $this->createQuery($params);

        $this->setDqlRelations();

        if (isset($agFiltre) && $agFiltre != '' && is_array($agFiltre)) {
            $this->applyFilter($agFiltre);
        } else {
            $this->_result->addWhere(implode(' AND ', $this->_where));
        }

        $result = $this->_result->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        $result = $this->changeResponse($result);

        return array('cant' => $this->_result->count(), 'data' => $result);
    }

    public function setDqlRelations()
    {
        foreach ($this->_relations as $clase => $properties) {
            $model = new $clase();
            $alias = $properties['alias'];
            $addselect[] = $alias . '.' . implode(',' . $alias . '.', $model->getTable()->getColumnNames());
            $join = $properties['leftjoin'] ? "leftJoin" : "innerJoin";
            $this->_result->$join($properties['join'] . '.' . $clase . ' ' . $alias);
        }
        $this->_result->addSelect(implode(',', $addselect));
    }

    public function applyFilter($agFiltre)
    {
        $where = $this->_where;

        foreach ($agFiltre as $value) {

            // Si el tipo de dato es booleano reformatearlo a 0 o 1
            $type = $value['data']['type'];
            if ($type === 'boolean') {
                $value['data']['value'] = $value['data']['value'] == 'true' ? 1 : 0;
                $type = 'numeric';
            }
            // reformatear con el alias
            $elements = explode('.', $value['field']);
            $alia = '';
            $relation = $this->_relations[$elements[0]];
            if (isset($relation['alias'])) {
                $alia = $relation['alias'] . '.';
                array_shift($elements);
            }

            if ($this->_alias[$value['field']]) {
                array_pop($elements);
                $elements[] = $this->_alias[$value['field']];
            }

            $valueField = $alia . implode('.', $elements);

            //Definiendo operador ha utilizar en la condicion
            $comparison = $value['data']['comparison'];
            $operator = $this->getOperator($comparison);
            $where[] = $this->addToWhere($type, $valueField, $value, $operator);
        }

        $this->_result->addWhere(implode(' AND ', $where));
    }

    private function addToWhere($type, $valueField, $value, $operator)
    {
        if ($type === 'numeric') {
            return $valueField . "" . $operator . "" . $value['data']['value'];
        } else {
            if ($type === 'date') {
                list($moth, $day, $year) = explode('/', $value['data']['value']);
                return $valueField . "" . $operator . "'$day/$moth/$year'";
            } else {
                return $valueField . " ILIKE '%" . $value['data']['value'] . "%'";
            }
        }
    }

    private function getOperator($comparison)
    {
        $operator = " = ";
        if ($comparison) {
            if ($comparison === 'lt') {
                $operator = " < ";
            } else {
                if ($comparison === 'gt') {
                    $operator = " > ";
                }
            }
        }
        return $operator;
    }

    public function changeResponse($result)
    {
        foreach ($result as $k => $v) {
            $element = $this->getElements($v);
            if (!empty($element)) {
                $result[$k] = array_merge($v, $element);
            }
            $clausulaproforma = $v['DatProformaClausula'];
            foreach ($clausulaproforma as $j => $w) {
                $result[$k]['clausulas'][$j] = $w;

                $element = $this->getElements($w);
                if (!empty($element)) {
                    $result[$k]['clausulas'][$j] = array_merge($w, $element);
                }

                $result[$k]['clausulas'][$j]['denominacion'] = $w['NomClausula']['denominacion'];
                unset($result[$k]['clausulas'][$j]['NomClausula']);
            }
            unset($result[$k]['DatProformaClausula']);
        }
        return $result;
    }

    private function getElements($contenido)
    {
        $result = array();
        foreach ($contenido as $k => $v) {
            if (!is_array($v)) {
                $pattern = '/idelemento\=\"(\d+)\"/i';
                preg_match_all($pattern, $v, $captura);
                if (!empty($captura[1])) {
                    $result[$k . '_elements'] = $captura[1];
                }
            }
        }
        return $result;
    }
}
