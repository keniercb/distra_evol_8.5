<?php
class DatNivelactprodcartatecporfecharealModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardat_nivelactprodcartatecporfechareal($dat_nivelactprodcartatecporfechareal)
    {
        $dat_nivelactprodcartatecporfechareal->save();
    }

    public function modificardat_nivelactprodcartatecporfechareal($dat_nivelactprodcartatecporfechareal)
    {
        $dat_nivelactprodcartatecporfechareal->save();
    }

    public function eliminardat_nivelactprodcartatecporfechareal($dat_nivelactprodcartatecporfechareal)
    {
        $dat_nivelactprodcartatecporfechareal->delete();
    }
}

?> 
