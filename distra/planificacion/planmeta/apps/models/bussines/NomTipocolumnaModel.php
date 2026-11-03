<?php

class NomTipocolumnaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(NomTipocolumna $NomTipocolumna)
    {
        $NomTipocolumna->save();
    }

    public function Actualizar(NomTipocolumna $NomTipocolumna)
    {
        $NomTipocolumna->save();
    }

    public function Eliminar($NomTipocolumna)
    {
        $NomTipocolumna->delete();
    }
}

