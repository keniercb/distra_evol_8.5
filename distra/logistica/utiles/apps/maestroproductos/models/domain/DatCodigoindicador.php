<?php

class DatCodigoindicador extends BaseDatCodigoindicador
{

    public function setUp()
    {
        $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));

        parent::setUp();
    }

    public function getDatosbyIndicador($params)
    {
        $query = new Doctrine_Query();
        $query->addSelect(
            'dci.*'
        )->from('DatCodigoindicador dci')
            ->where('dci.idindicador =?', $params['idindicador']);
        $total = $query->count();
        $result = $query->limit($params['limit'])
            ->offset($params['start'])
            ->fetchArray();
        return array('cantidad' => $total, 'datos' => $result);
    }

    public function verifExisteCodigoNombre($codigo, $idindicador) {
        if ($codigo) {
            $resultcod = Doctrine::getTable('DatCodigoindicador')->findByDql("upper(codigo) =? and idindicador =?", array(strtoupper($codigo), $idindicador))->getFirst();
        }
        $value = ($resultcod) ? true : false;
        return array('valor'=> $value, 'atributo'=> ($resultcod) ? 'codigo' : '');
    }

    public function verifExisteNombre($nombre) {
        $nombre = Doctrine::getTable('DatCodigoindicador')->findByDql("upper(nombre) =?", array(strtoupper($nombre)))->getFirst();
        $nombre = ($nombre) ? true : false;
        return $nombre;
    }
}
