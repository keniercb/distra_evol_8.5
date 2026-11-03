<?php
class DatPlantillatipocontratoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    //Función para adicionar
    public function add($idplantilla, $idtcontrato)
    {
        try {
            $identidad = $this->global->Estructura->idestructura;
            $objPlantContrato = new DatPlantillatipocontrato();
            $objPlantContrato->eliminarByTipocontrato($idtcontrato, $identidad);
            $obj = new DatPlantillatipocontrato();
            $obj->idtipocontrato = $idtcontrato;
            $obj->idplantilla = $idplantilla;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function getContenidoPlantillaFicha()
    {
        try {
            $objPlantContrato = new DatPlantillatipocontrato();
            $identidad = $this->global->Estructura->idestructura;
            $idplant = $objPlantContrato->getPlantillaByConfig(201, $identidad);
            return $idplant;
        } catch (Exception $e) {
            return false;
        }
    }
}