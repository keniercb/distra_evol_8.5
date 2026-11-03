<?php 
class NomTipodocidentidadModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(NomTipodocidentidad $NomTipodocidentidad)
    {
        $NomTipodocidentidad->save();
    }

    public function Actualizar(NomTipodocidentidad $NomTipodocidentidad)
    {
        $NomTipodocidentidad->save();
    }

    public function Eliminar($NomTipodocidentidad)
    {
        $NomTipodocidentidad->delete();
    }
}

