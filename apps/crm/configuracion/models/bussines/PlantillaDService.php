<?php

/**
 * PlantillaDService
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */
class PlantillaDService extends ZendExt_Model
{
    private $_plantillaRepository;
    private $_plantillaestrucDS;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_plantillaRepository = new PlantillaRepository();
        $this->_plantillaestrucDS = new PlantillaEstructuraDService();
    }

    public function getPlantilla($filtersParam)
    {
        $filters = array('equalIdentidad' => $this->getIdEntidad());
        if(!empty($filtersParam))
            $filters['equalDenom'] = '%'.$filtersParam[0]['value'].'%';

        $datos = $this->_plantillaRepository->getPlantillas($filters);

        foreach($datos as &$value){
            $value['estructura'] = $value['PlantillaEstructura'];
            unset($value['PlantillaEstructura']);
        }

        return $datos;
    }

    public function getModel()
    {
        return $this->_plantillaRepository->getRecord(array('equalIdentidad' => $this->getIdEntidad()));
    }

    public function insertPlantilla($values)
    {
        $values['identidad']  = $this->getIdEntidad();

        $validationFilters = array(
            'equalDenom'=> $values['denominacion'],
            'equalIdentidad' => $this->getIdEntidad()
        );
        $this->validateSavePlantilla($validationFilters);

        $idplantilla = $this->_plantillaRepository->insertRecord($values);

        $this->_plantillaestrucDS->insertEstructura($idplantilla, $values['estructura']);
    }

    public function updatePlantilla($values)
    {
        $validationFilters = array(
            'equalDenom'=> $values['denominacion'],
            'equalIdentidad' => $this->getIdEntidad(),
            'distinctId' => $values['idplantilla']
        );
        $this->validateSavePlantilla($validationFilters);
        $this->_plantillaRepository->updateRecord($values);

        $this->_plantillaestrucDS->updateEstructura($values['idplantilla'], $values['estructura']);
    }

    public function deletePlantilla($values)
    {
        $this->_plantillaRepository->deleteRecords($values);
    }

    private function getIdEntidad()
    {
        return  $this->global->Estructura->idestructura;
    }

    private function validateSavePlantilla($filters)
    {
        if( $this->_plantillaRepository->getCountRecords($filters) != 0 )
            throw new DuplicationValuesException(null, 1);
    }
}