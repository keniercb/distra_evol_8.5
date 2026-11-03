<?php
/**
 * PlantillaEstructuraRepository
 *
 * @package Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright UCID
 * @version 1.0
 */
class PlantillaEstructuraRepository extends BaseRepository
{
    public function  __construct()
    {
        $filters = array(
            'distinctId' => array('statement'=>'pe.idestructura <> ?'),
            'equalPlantilla'=> array('statement'=>'pe.idplantilla = ?'),
        );
        parent::__construct('PlantillaEstructura', 'pe', 'idestructura', $filters);
    }

    public function aux($idplantilla, $values)
    {
        $aux = $this->getRecords(array('equalPlantilla'=>$idplantilla), true);
        $aux->synchronizeWithArray($values);
        $aux->save();
    }
}