<?php
/**
 * @version 5.0
 */
class DatSerieDocumentoEntidad extends BaseDatSeriedocEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomSerieDocumento',
            array(
            'local' => 'idseriedocumento',
            'foreign' => 'idseriedocumento'
            )
        );
    }

}
