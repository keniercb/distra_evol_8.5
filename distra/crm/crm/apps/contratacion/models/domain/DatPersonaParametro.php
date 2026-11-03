<?php

define('APP_HOME', realpath(dirname(__FILE__)) . '/');

include_once(APP_HOME . '../../../pvd/persona/models/domain/generated/BaseDatPersona.php');
include_once(APP_HOME . '../../../pvd/persona/models/domain/DatPersona.php');


class DatPersonaParametro extends BaseDatPersonaParametro
{
    private $_result;
    private $_alias;

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
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

        return array('cant' => $this->_result->count(), 'data' => $result);
    }

    public function getDqlRelations()
    {
        $this->_result->addSelect('per.idpersona')->innerJoin('a.DatPersona per on per.idpersona = a.idpersona');
        $this->_result->addSelect(
            "(CASE WHEN per.snombre IS NOT NULL THEN per.nombre||' '|| per.snombre||' '|| per.papel||' '||  per.sapel
            ELSE per.nombre||' '|| per.papel||' '||  per.sapel END) as nombre");
    }

    public function applyFilter($agFiltre)
    {
        $where = array();

        foreach ($agFiltre as $value) {

            if($value['field']=='nombre'){
                $where[] = "deop.denominacion ILIKE '%".$value['data']['value']."%'";
                $where[] = "de.denominacion ILIKE '%".$value['data']['value']."%'";
            }
        }

        $this->_result->addWhere(implode(' OR ', $where));
    }

    public function getPersonasParametro($params){
        try{
            $params[0] = $params['start'] ? $params['start'] : 0;
            $params[1] = $params['limit'] ? $params['limit'] : 1000;
            $params[2] = '';
            $params[3] = 'ASC';
            $params[4] = $params['filter'] ? $params['filter'] : '';
            return $this->getModelData($params);
        }catch (Doctrine_Exception $e){
            throw $e;
        }
    }
}
