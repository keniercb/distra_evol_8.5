<?php

class DatElementosDocumento extends BaseDatElementosDocumento
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($iddocumento)
    {
        return Doctrine::getTable('DatElementosDocumento')->find($iddocumento)
            ->toArray();
    }

    public function cargarDocumentosAsociadosElementos($idelemento)
    {

    }


}

