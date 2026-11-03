<?php

class DatDesgviaadquisorgsatModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatDesgviaadquisorgsat($datDesgviaadquisorgsat)
    {
        $datDesgviaadquisorgsat->save();
    }

    public function modificardatDesgviaadquisorgsat($datDesgviaadquisorgsat)
    {
        $datDesgviaadquisorgsat->save();
    }

    public function eliminardatDesgviaadquisorgsat($datDesgviaadquisorgsat)
    {
        $datDesgviaadquisorgsat->delete();
    }


}


