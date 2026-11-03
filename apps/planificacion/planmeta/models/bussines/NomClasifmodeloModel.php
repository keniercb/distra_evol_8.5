<?php

class NomClasifmodeloModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(NomClasifmodelo $NomClasifmodelo)
    {
        $NomClasifmodelo->save();
    }

    public function Actualizar(NomClasifmodelo $NomClasifmodelo)
    {
        $NomClasifmodelo->save();
    }

    public function Eliminar($NomClasifmodelo)
    {
        $NomClasifmodelo->delete();
    }
}

