<?php

class DatConceptoimporterecep extends BaseDatConceptoimporterecep
{
    private $logisticaDoctrine;

    public function setUp()
    {
        parent::setUp();
        $this->logisticaDoctrine = LogisticaDoctrineHelper::__init();
        $this->hasOne(
            'DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->hasOne(
            'DatRecepcion', array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->hasMany(
            'NomConceptoimporte', array('local' => 'idconceptoimporte', 'foreign' => 'idconceptoimporte')
        );
        $this->hasMany(
            'NomCategoriaprecio', array('local' => 'idconceptoimporte', 'foreign' => 'idcategoriaprecio')
        );
    }
}
