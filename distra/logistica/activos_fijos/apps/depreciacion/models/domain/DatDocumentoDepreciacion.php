<?php

/**
 * Jorge Luis Cuellar Mondeja
 * 03/03/13
 */
class DatDocumentoDepreciacion extends BaseDatDocumentodepreciacion
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatDocumentogeneral', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
    }

    /**
     *
     */
    public function getDocumento($idEstructura, $fecha)
    {
        $query = new Doctrine_Query();
        $query->from('DatDocumentoDepreciacion dd')
            ->innerJoin('dd.DatDocumentogeneral dg')
            ->where('dg.idestructuracomun = ? AND dd.fecha = ?', array($idEstructura, $fecha));

        return $query->fetchArray();
    }

}
