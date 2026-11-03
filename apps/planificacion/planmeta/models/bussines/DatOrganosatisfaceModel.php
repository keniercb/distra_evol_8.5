<?php

class DatOrganosatisfaceModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatOrganosatisface $DatOrganosatisface)
    {
        $DatOrganosatisface->save();
    }

    public function Actualizar(DatOrganosatisface $DatOrganosatisface)
    {
        $DatOrganosatisface->save();
    }

    public function Eliminar($DatOrganosatisface)
    {
        $DatOrganosatisface->delete();
    }

}

//fin clase

