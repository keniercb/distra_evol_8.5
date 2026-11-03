<?php

class DatAjusteentidadcentrobalanceModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatAjusteentidadcentrobalance $DatAjusteentidadcentrobalance
    )
    {
        $DatAjusteentidadcentrobalance->save();
    }

    public function Actualizar(DatAjusteentidadcentrobalance $DatAjusteentidadcentrobalance
    )
    {
        $DatAjusteentidadcentrobalance->save();
    }

    public function Eliminar($DatAjusteentidadcentrobalance)
    {
        $DatAjusteentidadcentrobalance->delete();
    }

    public function BuscarIdAjuste($idajusteentidad)
    {
        $datos = DatAjusteentidadcentrobalance::BuscarId($idajusteentidad);
        if ($datos[0]['idajusteentidad'] != null) {
            return true;
        } else {
            return false;
        }

    }

}

//fin clase

