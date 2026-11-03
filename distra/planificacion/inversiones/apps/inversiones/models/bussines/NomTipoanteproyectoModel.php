<?php
class NomTipoanteproyectoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarnom_tipoanteproyecto($nom_tipoanteproyecto)
    {
        $nom_tipoanteproyecto->save();
    }

    public function modificarnom_tipoanteproyecto($nom_tipoanteproyecto)
    {
        $nom_tipoanteproyecto->save();
    }

    public function eliminarnom_tipoanteproyecto($nom_tipoanteproyecto)
    {
        $nom_tipoanteproyecto->delete();
    }
}

?> 
