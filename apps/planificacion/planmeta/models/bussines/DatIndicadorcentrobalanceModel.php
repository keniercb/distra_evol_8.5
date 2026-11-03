<?php

class DatIndicadorcentrobalanceModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatIndicadorcentrobalance $DatIndicadorcentrobalance
    )
    {
        $DatIndicadorcentrobalance->save();
    }

    public function Actualizar(DatIndicadorcentrobalance $DatIndicadorcentrobalance
    )
    {
        $DatIndicadorcentrobalance->save();
    }

    public function Eliminar($DatIndicadorcentrobalance)
    {
        $DatIndicadorcentrobalance->delete();
    }

}

//fin clase

