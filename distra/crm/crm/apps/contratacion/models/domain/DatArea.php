<?php

define('APP_HOME', realpath(dirname(__FILE__)) . '/');

include_once(APP_HOME . '../../../metadatos/estructura/models/domain/generated/BaseNomFilaestruc.php');
include_once(APP_HOME . '../../../metadatos/estructura/models/domain/NomFilaestruc.php');
include_once(APP_HOME . '../../../metadatos/estructura/models/domain/generated/BaseDatEstructura.php');
include_once(APP_HOME . '../../../metadatos/estructura/models/domain/DatEstructura.php');
include_once(APP_HOME . '../../../metadatos/estructura/models/domain/generated/BaseDatEstructuraop.php');
include_once(APP_HOME . '../../../metadatos/estructura/models/domain/DatEstructuraop.php');


class DatArea extends BaseDatArea
{
    private $_result;
    private $_alias;

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomFilaestruc', array('local' => 'idestructura', 'foreign' => 'idfila'));
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
        $this->_result->addSelect('nf.idfila')->innerJoin('a.NomFilaestruc nf on nf.idfila = a.idestructura');
        $this->_result->leftJoin('nf.DatEstructuraop deop on nf.idfila = deop.idestructuraop');
        $this->_result->leftJoin('nf.DatEstructura de on nf.idfila = de.idestructura');
        $this->_result->addSelect('COALESCE(deop.denominacion, de.denominacion) as nombre');
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

    public function getAreas($params){
        try{
            $params[0] = $params['start'] ? $params['start'] : 0;
            $params[1] = $params['limit'] ? $params['limit'] : 25;
            $params[2] = '';
            $params[3] = 'ASC';
            $params[4] = $params['filter'] ? $params['filter'] : '';
            return $this->getModelData($params);
        }catch (Doctrine_Exception $e){
            throw $e;
        }
    }
}
