<?php
class ConfPlantilladocrecModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function addConfigPlantillaRec($configuraciones, $idplantilla)
    {
        ConfPlantilladocrec::deleteByIdPlantilla($idplantilla);
        foreach ($configuraciones as $v) {
            $obj = new ConfPlantilladocrec();
            $obj->idplantilladoc = $idplantilla;
            $obj->idconfiguracion = $v;
            $obj->save();
        }
        return true;
    }

    public function getConfiguracionesByIdPlantilla($idplantilla)
    {
        try {
            $resp = ConfPlantilladocrec::getConfigByIdplantilla($idplantilla);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }
}