<?php

class DatConfiguracionimportar extends BaseDatConfiguracionimportar
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatColumnaconcepto',
            array('local' => 'idconfiguracion', 'foreign' => 'idconfiguracion')
        );
        $this->hasOne(
            'NomConceptoimportar',
            array('local' => 'idconcepto', 'foreign' => 'idconcepto')
        );
        $this->hasMany(
            'DatConfiguraciontipoaccion',
            array('local' => 'idconfiguracion', 'foreign' => 'idconfiguracion')
        );
    }

    public static function obtenerConfigImportarDadoIdConf($idconfiguracion)
    {
        $configimportar = Doctrine::getTable('DatConfiguracionimportar')->find(
            $idconfiguracion
        );
        return array('DatConfiguracionimportar ' => $configimportar);
    }

}

//fin clase 
