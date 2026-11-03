<?php

class NomIncoterm extends BaseNomIncoterm
{
    private $_result;
    private $_alias;

    public function setUp()
    {
        parent::setUp();

//        $this->HasMany('DatIncotermClausula', array('local' => 'idincoterm', 'foreign' => 'idincoterm'));
    }

    public function postInsertValues($out)
    {
        $clausulas = $out['params']['idclausulas'];
        $idincoterm = $out['model']->idincoterm;

        if (!empty($clausulas)) {
            $clausulas = explode(',', $clausulas);
            foreach ($clausulas as $clausula) {
                $model = new DatIncotermClausula();
                $model->idincoterm = $idincoterm;
                $model->idclausula = $clausula;
                $model->save();
            }
        }
    }

    public function postModifyValues($out)
    {
        $clausulas = $out['params']['idclausulas'];
        $idincoterm = $out['model']->idincoterm;

        $query = new Doctrine_Query();
//        $query->delete()->from('DatIncotermClausula dic')->where('dic.idincoterm=?', $idincoterm)->execute();

        if (!empty($clausulas)) {
            $clausulas = explode(',', $clausulas);
            foreach ($clausulas as $clausula) {
                $model = new DatIncotermClausula();
                $model->idincoterm = $idincoterm;
                $model->idclausula = $clausula;
                $model->save();
            }
        }
    }

    private function createQuery($params)
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
        }

        // Busar los elementos definidos dentro del inicio y limite ordenados
        $q = new Doctrine_Query();
        $this->_result = $q->select('a.' . $strIColumns)->from($modelName . ' a ')
            ->orderby($agOrder . ' ' . $agOrderDirect)->offset($agStart)
            ->limit($agLimit)->innerJoin('');
    }

    public function getModelData($params)
    {

        $agFiltre = $params[4];

        $this->createQuery($params);

        $this->getDqlRelations();
        if (isset($agFiltre) && $agFiltre != '' && is_array($agFiltre)) {
            $this->applyFilter($agFiltre);
        }

        $result = $this->_result->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        $result = $this->changeResponse($result);

        return array('cant' => $this->_result->count(), 'data' => $result);
    }

    public function getDqlRelations()
    {
        $this->_result->addSelect('nc.idclausula,nc.denominacion')
            ->leftJoin('dic.NomClausula nc on nc.idclausula = dic.idclausula');
    }

    public function applyFilter($agFiltre)
    {
        $where = array();

        foreach ($agFiltre as $value) {

            // Si el tipo de dato es booleano reformatearlo a 0 o 1
            $type = $value['data']['type'];
            if ($type === 'boolean') {
                $value['data']['value'] = $value['data']['value'] == 'true' ? 1 : 0;
            }
            // reformatear con el alias
            $elements = explode('.', $value['field']);
            $alia = '';
            if (isset($alias[$elements[0]])) {
                $alia = $alias[$elements[0]] . '.';
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
                return $valueField . " ILIKE '%" .$value['data']['value'] . "%'";
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
            foreach ($v['DatIncotermClausula'] as $w) {
                $result[$k]['idclausulas'][] = $w['NomClausula'][0]['idclausula'];
                $result[$k]['nombreclausulas'][] = $w['NomClausula'][0]['denominacion'];
            }
            unset($result[$k]['DatIncotermClausula']);
        }
        return $result;
    }
}
