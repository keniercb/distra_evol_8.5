<?php

class DatContenido extends BaseDatContenido
{
    public function setUp()
    {
        parent::setUp();
        $this->HasOne(
            'DatSistemaContent',
            array('local' => 'idcontenido', 'foreign' => 'idcontenido')
        );
        $this->HasOne(
            'DatEmailContent',
            array('local' => 'idcontenido', 'foreign' => 'idcontenido')
        );
        $this->HasOne(
            'DatJabberContent',
            array('local' => 'idcontenido', 'foreign' => 'idcontenido')
        );
        $this->hasOne(
            'NomTipocontenido',
            array('local' => 'idtipocont', 'foreign' => 'idtipocont')
        );
        $this->HasOne(
            'DatSmstextContent',
            array('local' => 'idcontenido', 'foreign' => 'idcontenido')
        );
        $this->HasMany(
            'DatAvisoDestinatarioViaContenido',
            array('local' => 'idcontenido', 'foreign' => 'idcontenido')
        );
    }


}