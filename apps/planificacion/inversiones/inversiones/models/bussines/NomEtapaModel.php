<?php
class NomEtapaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarnom_etapa($nom_etapa)
    {
        $nom_etapa->save();
    }

    public function modificarnom_etapa($nom_etapa)
    {
        $nom_etapa->save();
    }

    public function eliminarnom_etapa($nom_etapa)
    {
        $nom_etapa->delete();
    }

    public function listarEtapas()
    {
        return NomEtapa::listarEtapas();
    }
}

?> 
