<?php

class DatDocumentopersona extends BaseDatDocumentopersona
{


    public function setUp()
    {
        parent :: setUp();
    }

    public function getById($iddocumentopersona)
    {
        return Doctrine::getTable('DatDocumentopersona')->find($iddocumentopersona);
    }
    
}

