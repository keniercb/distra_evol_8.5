<?php

class MetadatasServices extends ZendExt_Model
{

    function __construct()
    {
        $this->metadataModel = new MetadataModel();
    }

    public function getUserInterfaces($idtabla)
    {
        return $this->metadataModel->obtenerConfigFormulario($idtabla);
    }

    public function getGridInterfaces($idtabla)
    {
        return $this->metadataModel->obtenerConfigGridPanel($idtabla);
    }

    public function insertIntoMetadata($idtabla, $values)
    {
        return $this->metadataModel->insertarEnMetadatos($idtabla, $values);
    }

}

