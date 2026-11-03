<?php

/**
 *
 *
 * @author         Ing. Lisvany Alonso Martinez
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Models/Domain
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class DatTipoContrato extends BaseDatTipoContrato
{

    private $_result;
    private $_alias;

    public function setUp()
    {
        $this->hasMany('DatProforma', array('local' => 'idtipocontrato', 'foreign' => 'idtipocontrato'));
        $this->hasMany('DatTipoContratoEntidad', array('local' => 'idtipocontrato', 'foreign' => 'idtipocontrato'));
        parent::setUp();
    }

    public function cargartipocontrato($idestructura, $filter)
    {
        $result = $this->getDataTipoContrato($idestructura, $filter);
        //print_r($result);die;
        return $result;
    }

    /**
     * @param $query
     *
     * @return array
     * @throws Doctrine_Connection_Exception
     */
    private function executeQuery($query)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();

        return $conexionActual->fetchAll($query);
    }

    /**
     * @param $idestructura
     *
     * @return array
     */
   public function getDataTipoContrato($idestructura, $filter)
    {
//        print('getDataTipoContrato');
//        print_r($idestructura);
//        $where = (($filter) ?
//                " WHERE (tc.denominacion ilike '%" . $filter . "%'  OR tc.tipo = 0 OR tc.editable = 0)" : "");
        $filters=$this->getFilters($filter);
//        print_r($filters);die;
        $where="";
        if(count($filters))$where=" WHERE ".implode(' AND ', $filters);
        $q = "SELECT tc.*,true as leaf, (tce.idestructuracomun=$idestructura) as enuso,
             (CASE WHEN tce.idestructuracomun=$idestructura THEN '/crm/application/views/images/comprobar.png'
              ELSE '/crm/application/views/images/eliminar.png' END) as icon
              FROM mod_crmcontratacion.dat_tipocontrato tc
              LEFT JOIN mod_crmcontratacion.dat_tipocontratoentidad tce ON
	      (tce.idtipocontrato=tc.idtipocontrato AND tce.idestructuracomun = $idestructura)
              $where ORDER BY denominacion";
//        print($q);die;
        $result = self::executeQuery($q);
        return $result;
    }

//        (CASE WHEN tce.idestructuracomun=$idestructura THEN 'icondistra-usarentidad verde'
//        ELSE 'icondistra-usarentidad rojo' END) as iconCls

    public function getFilters($filters){
//        $filters=json_decode($filters);
//        print_r($filters);die;
        $where=array();
        foreach($filters as $filt){
            if($filt->property=='denominacion'){
                $where[]="(tc.denominacion ilike '%" . $filt->value . "%'  OR tc.tipo = 0 OR tc.editable = 0)";
            }else if($filt->property=='estructura'){
                $where[]="tce.idestructuracomun=".$filt->value;
            }
        }
        return $where;
    }

    public function getModelData($params)
    {
//        print('getModelData');
        $agFiltre = $params[4];
        $this->createQuery($params);

        if (isset($agFiltre) && $agFiltre != '' && is_array($agFiltre)) {
            $this->applyFilter($agFiltre);
        }
        $result = $this->_result->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return array('cant' => $this->_result->count(), 'data' => $result);
    }

    public function applyFilter($agFiltre)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $idestructura = $global->Estructura->idestructura;

        //Adicionando el condiciones a la consulta
        $where = ['tce.idestructuracomun = ' . $idestructura, 'a.tipo = 1', 'a.editable = 1'];

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

    /**
     * @param $comparison
     *
     * @return string
     */
    private function getOperator($comparison)
    {
        $operator = " = ";
        if ($comparison) {
            if ($comparison === 'lt') {
                $operator = " < ";
                return $operator;
            } else {
                if ($comparison === 'gt') {
                    $operator = " > ";
                    return $operator;
                }
                return $operator;
            }
        }
        return $operator;
    }

    /**
     * @param $params
     *
     * @return array
     */
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
//        $this->_result = $q->select('a.' . $strIColumns)->from($modelName . ' a ')
        $this->_result = $q->select('a.denominacion, a.idtipocontrato, a.idespaciotrabajo')
            ->from('DatTipoContrato a ')->leftJoin('a.DatTipoContratoEntidad tce')
            ->orderby($agOrder . ' ' . $agOrderDirect)->offset($agStart)->limit($agLimit)->innerJoin('');
    }

    /**
     * @param $arrayClientes
     * @param $arrayTmpClientes
     * @param $array
     *
     * @return mixed
     */
    private function addToClientes($arrayClientes, $arrayTmpClientes, $array)
    {
        $arrayClientes[1]['expanded'] = 1;
        $arrayClientes[1]['leaf'] = 0;
        $arrayClientes[1]['children'] = $arrayTmpClientes;
        $array[0]['denominacion'] = 'Cliente';
        $array[0]['tipo'] = 1;
        $array[0]['editable'] = 0;
        $array[0]['expanded'] = 1;
        $array[0]['cliente'] = 1;
        $array[0]['leaf'] = 0;
        $array[0]['children'] = $arrayClientes;
        return $array;
    }

    /**
     * @param $arrayProveedores
     * @param $arrayTmpProveedores
     * @param $array
     *
     * @return mixed
     */
    private function addToProveedores($arrayProveedores, $arrayTmpProveedores, $array)
    {
        $arrayProveedores[1]['expanded'] = 1;
        $arrayProveedores[1]['leaf'] = 0;
        $arrayProveedores[1]['children'] = $arrayTmpProveedores;
        $array[1]['denominacion'] = 'Proveedor';
        $array[1]['tipo'] = 1;
        $array[1]['editable'] = 0;
        $array[1]['expanded'] = 1;
        $array[1]['cliente'] = 0;
        $array[1]['leaf'] = 0;
        $array[1]['children'] = $arrayProveedores;
        return $array;//print_r($array);die;
    }

    /**
     * @param $tc
     * @param $arrayClientes
     * @param $arrayProveedores
     * @param $arrayTmpClientes
     * @param $arrayTmpProveedores
     *
     * @return array
     */
    private function clasificar($tc)
    {
        $arrayClientes = array();
        $arrayTmpClientes = array();
        $arrayTmpProveedores = array();
        $arrayProveedores = array();
        if (!$tc['tipo'] && !$tc['editable']) {
            $tc['leaf'] = 1;
            if ($tc['cliente']) {
                $arrayClientes[0] = $tc;
            } else {
                $arrayProveedores[0] = $tc;
            }
        }
        if ($tc['tipo'] && !$tc['editable']) {
            if ($tc['cliente']) {
                $arrayClientes[1] = $tc;
            } else {
                $arrayProveedores[1] = $tc;
            }
        }
        if ($tc['tipo'] && $tc['editable']) {
            $tc['leaf'] = 1;
            if ($tc['cliente']) {
                $arrayTmpClientes[] = $tc;
                return array($arrayClientes, $arrayProveedores, $arrayTmpClientes, $arrayTmpProveedores);
            } else {
                $arrayTmpProveedores[] = $tc;
                return array($arrayClientes, $arrayProveedores, $arrayTmpClientes, $arrayTmpProveedores);
            }
        }
        return array($arrayClientes, $arrayProveedores, $arrayTmpClientes, $arrayTmpProveedores);
    }

    /**
     * @param $type
     * @param $valueField
     * @param $operator
     * @param $value
     * @param $where
     *
     * @return array
     */
    private function addToWhere($type, $valueField, $value, $operator)
    {
        if ($type === 'numeric') {
            return $valueField . "" . $operator . "" . $value['data']['value'];
        } else {
            if ($type === 'date') {
                list($moth, $day, $year) = explode('/', $value['data']['value']);
                return $valueField . "" . $operator . "'$day/$moth/$year'";
            } else {
                return $valueField . " ILIKE '%" . $value['data']['value']. "%'";
            }
        }
    }
}
