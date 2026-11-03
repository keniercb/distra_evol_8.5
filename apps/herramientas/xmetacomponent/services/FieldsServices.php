<?php

class FieldsServices extends ZendExt_Model
{

    function __construct()
    {
        $this->campoModel = new CampoModel();
        $this->campoDomain = new DatCampo();
        $this->standard = new ZendExt_ClassStandard();
    }

    public function getDataTypes()
    {
        return $this->standard->ArrayObject(
            $this->campoModel->cargarTiposDatos()
        );
    }

    public function addAttribute($arrParams)
    {
        return $this->campoModel->adicionarCampo(
            $arrParams['denominacion'],
            $arrParams['idtabla'],
            $arrParams['tipodato'],
            $arrParams['longitud']
        )->toArray();
    }

    public function deleteAttribute($idcampo)
    {
        return $this->campoModel->eliminarCampo($idcampo);
    }

    public function getRegularsExpressions()
    {
        return $this->standard->ArrayObject(
            $this->campoModel->cargarExpresionesRegulares()
        );
    }

    public function obtenerCamposDadoTabla($idtabla)
    {
        return $this->standard->ArrayObject(
            $this->campoModel->cargarCmbCampos($idtabla)
        );
    }

    public function obtenerCamposConRepresentacion($idtabla)
    {
        return $this->standard->ArrayObject(
            $this->campoDomain->obtenerCamposConRepresentacion($idtabla)
        );
    }

}

