<?php

/**
 * Created by PhpStorm.
 * User: Yoendy
 * Date: 10/01/14
 * Time: 14:48
 */
class DatDocumentoOperacion extends BaseDatDocumentoOperacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
    }

    public function getDocumentosOPporIddocumento($iddocumento)
    {

        $query = new Doctrine_Query();
        $query->from('DatDocumentoOperacion dop')->where('dop.iddocumento =?', $iddocumento);
        return $query->fetchArray();
    }

}
