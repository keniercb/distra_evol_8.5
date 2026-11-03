<?php
class DatNivelactprodcartatecporfechaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardat_nivelactprodcartatecporfecha($dat_nivelactprodcartatecporfecha)
    {
        $dat_nivelactprodcartatecporfecha->save();
    }

    public function modificardat_nivelactprodcartatecporfecha($dat_nivelactprodcartatecporfecha)
    {
        $dat_nivelactprodcartatecporfecha->save();
    }

    public function eliminardat_nivelactprodcartatecporfecha($dat_nivelactprodcartatecporfecha)
    {
        $dat_nivelactprodcartatecporfecha->delete();
    }
}

?> 
