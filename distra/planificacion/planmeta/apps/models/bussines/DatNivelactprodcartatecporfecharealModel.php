<?php

class DatNivelactprodcartatecporfecharealModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatNivelactprodcartatecporfechareal($datNivelactprodcartatecporfechareal
    )
    {
        $datNivelactprodcartatecporfechareal->save();
    }

    public function modificardatNivelactprodcartatecporfechareal($datNivelactprodcartatecporfechareal
    )
    {
        $datNivelactprodcartatecporfechareal->save();
    }

    public function eliminardatNivelactprodcartatecporfechareal($datNivelactprodcartatecporfechareal
    )
    {
        $datNivelactprodcartatecporfechareal->delete();
    }
}


