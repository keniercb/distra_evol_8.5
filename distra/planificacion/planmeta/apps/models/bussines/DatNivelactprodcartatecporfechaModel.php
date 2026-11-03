<?php

class DatNivelactprodcartatecporfechaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatNivelactprodcartatecporfecha($datNivelactprodcartatecporfecha
    )
    {
        $datNivelactprodcartatecporfecha->save();
    }

    public function modificardatNivelactprodcartatecporfecha($datNivelactprodcartatecporfecha
    )
    {
        $datNivelactprodcartatecporfecha->save();
    }

    public function eliminardatNivelactprodcartatecporfecha($datNivelactprodcartatecporfecha
    )
    {
        $datNivelactprodcartatecporfecha->delete();
    }
}


