<?php

class DatClientecodigo extends BaseDatClientecodigo
{

    public function setUp()
    {
        $this->hasOne('DatCodigoindicador', array('local' => 'idcodigoindicador', 'foreign' => 'idcodigoindicador'));
        $this->hasMany('NomClienteproveedor', array('local' => 'idclientesproveedores', 'foreign' => 'idclientesproveedores'));

        parent::setUp();
    }

    public function getDatosByCodigoIndicador($params)
    {
        $query = new Doctrine_Query();
        $query->select('dcc.idclientecodigo, dcc.idclientesproveedores as idcliente')
            ->from('DatClientecodigo dcc')
            ->whereIn('dcc.idcodigoindicador', $params['idcodigoindicador']);
        $total = $query->count();
        $result = $query->limit($params['limit'])
            ->offset($params['start'])
            ->fetchArray();
        return array('cantidad' => $total, 'datos' => $result);
    }

    public function verifExisteClienteCodigo($idclientesproveedores, $idindicador)
    {
        $query = new Doctrine_Query();
        $objDatCantComp = $query->from('DatClientecodigo dcc')
            ->innerJoin('dcc.DatCodigoindicador dci')
            ->where('dcc.idclientesproveedores = ? and dci.idindicador = ?', array($idclientesproveedores, $idindicador))
            ->fetchArray();
        $clientcod = ($objDatCantComp) ? true : false;
        return $clientcod;
    }
}
