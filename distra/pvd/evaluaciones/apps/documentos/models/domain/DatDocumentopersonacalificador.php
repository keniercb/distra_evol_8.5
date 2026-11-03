<?php

class DatDocumentopersonacalificador extends BaseDatDocumentopersonacalificador
{


    public function setUp()
    {
        parent :: setUp();
    }

    public function getById($iddocumentopersonacalificador)
    {
        return Doctrine::getTable('DatDocumentopersonacalificador')->find($iddocumentopersonacalificador);
    }
    
}

