<?php

/**
 * PlantillaEstructuraDService
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */
class PlantillaEstructuraDService extends ZendExt_Model
{
    private $_plantillaEstructuraRepository;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_plantillaEstructuraRepository = new PlantillaEstructuraRepository();
    }

    public function insertEstructura($idplantilla, $values)
    {
        foreach($values as $key => &$value){
            $value['idplantilla'] = $idplantilla;
        }

        $this->_plantillaEstructuraRepository->insertRecordCollection($values);
    }

    public function updateEstructura($idplantilla, $values)
    {
        $data = $this->_plantillaEstructuraRepository->getRecords(array('equalPlantilla'=>$idplantilla), true);
        $indexVal = array();
        foreach($values as $val){
            if(strpos($val['idestructura'], 'new') !== false){
                $val['idplantilla'] = $idplantilla;
                $elem = new PlantillaEstructura();
                $elem->fromArray($val);
                $elem->save();
            }else
                $indexVal[$val['idestructura']] = $val;
        }

        foreach($data as $key => &$record){
            if(array_key_exists($record->idestructura, $indexVal))
                $record->synchronizeWithArray($indexVal[$record->idestructura]);
            else
                $data->remove($key);
        }

        $data->save();
    }
}