<?php

class DatDocumentoPadre extends BaseDatDocumentoPadre {

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasMany('DatDocumento', array('local' => 'idpadre', 'foreign' => 'iddocumento'));
    }

    public function eliminar($idfacturas)
    {
        return Doctrine_Query::create()
                        ->delete()
                        ->from('DatDocumentoPadre')
                        ->whereIn('iddocumento', $idfacturas)
                        ->execute();
    }

    public function verificarExiste($iddocumentos)
    {
        $result = Doctrine_Query::create()
                ->select('count(dp.idpadre)')
                ->from('DatDocumentoPadre dp')
                ->whereIn('dp.iddocumento', $iddocumentos)
                ->fetchArray();
        return ($result[0]['count'] > 0) ? true : false;
    }

    public function verificarGeneradoHijo($iddocumentos)
    {
        $conn = Zend_Registry::get('conexion');
        return $conn->execute(
                        "SELECT dp.idpadre as iddocumento FROM dat_documentopadre dp "
                        . "WHERE dp.idpadre in ($iddocumentos)"
                )->fetchAll(PDO::FETCH_COLUMN);
    }
    
    public function verificarRelacionPadreHijo($iddocumento, $idpadre)
    {
        $result = Doctrine_Query::create()
                ->select('count(dp.idpadre)')
                ->from('DatDocumentoPadre dp')
                ->where('dp.iddocumento = ? and dp.idpadre = ?', array($iddocumento, $idpadre))
                ->fetchArray();
        return ($result[0]['count'] > 0) ? true : false;
    }

}
