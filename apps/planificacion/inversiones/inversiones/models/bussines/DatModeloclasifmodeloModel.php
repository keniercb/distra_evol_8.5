<?php
class DatModeloclasifmodeloModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatModeloclasifmodelo $DatModeloclasifmodelo)
    {
        return $DatModeloclasifmodelo->save();
    }

    public function Actualizar(DatModeloclasifmodelo $DatModeloclasifmodelo)
    {
        $DatModeloclasifmodelo->save();
    }

    public function Eliminar($DatModeloclasifmodelo)
    {
        $DatModeloclasifmodelo->delete();
    }
}

//fin clase

?>