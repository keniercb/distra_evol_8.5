<?php

class DatAjusteentidadModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatAjusteentidad $DatAjusteentidad)
    {
        $DatAjusteentidad->save();
    }

    public function Actualizar(DatAjusteentidad $DatAjusteentidad)
    {
        $DatAjusteentidad->save();
    }

    public function Eliminar($DatAjusteentidad)
    {
        $DatAjusteentidad->delete();
    }

}

//fin clase

