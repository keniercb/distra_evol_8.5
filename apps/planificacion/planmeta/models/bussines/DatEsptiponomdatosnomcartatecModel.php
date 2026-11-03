<?php

class DatEsptiponomdatosnomcartatecModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatEsptiponomdatosnomcartatec($datEsptiponomdatosnomcartatec
    )
    {
        $datEsptiponomdatosnomcartatec->save();
    }

    public function modificardatEsptiponomdatosnomcartatec($datEsptiponomdatosnomcartatec
    )
    {
        $datEsptiponomdatosnomcartatec->save();
    }

    public function eliminardatEsptiponomdatosnomcartatec($datEsptiponomdatosnomcartatec
    )
    {
        $datEsptiponomdatosnomcartatec->delete();
    }
}


