<?php
class DatMovtransferenciaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatMovtransferencia $datMovtransferencia)
    {
        $datMovtransferencia->save();
    }

    public function Actualizar(DatMovtransferencia $datMovtransferencia)
    {
        $datMovtransferencia->save();
    }

    public function Eliminar($datMovtransferencia)
    {
        $datMovtransferencia->delete();
    }
}

