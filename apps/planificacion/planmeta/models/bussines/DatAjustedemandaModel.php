<?php

class DatAjustedemandaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatAjustedemanda $DatAjustedemanda)
    {
        $DatAjustedemanda->save();
    }

    public function Actualizar(DatAjustedemanda $DatAjustedemanda)
    {
        $DatAjustedemanda->save();
    }

    public function Eliminar($DatAjustedemanda)
    {
        $DatAjustedemanda->delete();
    }

}

//fin clase

