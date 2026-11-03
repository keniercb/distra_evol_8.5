<?php

class NomSerieDocumento extends BaseNomSerieDocumento
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomSerieDocumento',
            array(
            'local' => 'idseriedocentidad',
            'foreign' => 'idseriedocumento'
            )
        );
        if (class_exists('DatSerieDocumentoEntidad')) {
            $this->hasOne(
                'DatSerieDocumentoEntidad',
                array(
                'local' => 'idseriedocumento',
                'foreign' => 'idseriedocumento'
                )
            );
        }
        if (class_exists('DatDocumentoprim')) {
            $this->hasOne(
                'DatDocumentoprim',
                array(
                'local' => 'iddoc',
                'foreign' => 'iddoc'
                )
            );
            $array[] = array(
                'cardinalidad' => 'many',
                'relation' => 'NomSeriedocumento',
                'properties' => array(
                    'foreign' => 'iddoc',
                    'local' => 'iddoc'
                )
            );
            $NomSeriedocumento = new DatDocumentoprim();
            UtilesDoctrineModel::tryInyectRelactions($NomSeriedocumento, $array);
        }
    }
}
