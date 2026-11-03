<?php

class NomTipoPenalidad extends BaseNomTipoPenalidad
{

    private $query;
    private $cont;
    private $_alias;
    public function setUp()
    {
        parent::setUp();
    }

    public function getModelData($params)
    {
        try {
//            print_r($params);die;
            $this->query = Doctrine_Query::create()->select('*')->from('NomTipoPenalidad');
            $this->cont = Doctrine_Query::create()->from('NomTipoPenalidad');
            $agFiltre=$params[4];
            if (isset($agFiltre) && $agFiltre != '' && is_array($agFiltre)) {
                $this->applyFilter($agFiltre);
            }
            $result = $this->query->offset($params[0]?:0)->limit($params[1])->fetchArray();
            foreach ($result as &$r) {
                $r['porciento']=(float)$r['porciento'];
                if ($r['idtipocontrato']) {
                    $tiposcontrato = array();
//                    print($r['nombre']);
                    foreach (explode(',', $r['idtipocontrato']) as $t) {
                        $tipo = Doctrine::getTable('DatTipoContrato')->find($t);
//                        print('$t:'.$t . $tipo['denominacion']);
                        if($tipo)
                            $tiposcontrato[] = $tipo['denominacion'];
                    }
//                    $r['denominaciontipocontrato'] = $tiposcontrato;
                    $r['tipocontrato'] = $tiposcontrato;
                }
            }
            return array('cant' => $this->cont->count(), 'data' => $result);
        } catch (Exception $e) {
            print($e->getMessage());die;
            return $e->getMessage();
        }
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

        $this->query->addWhere(implode(' AND ', $where));
        $this->cont->addWhere(implode(' AND ', $where));
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
}
