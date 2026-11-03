<?php
class ConfMotivosbajaModel extends ZendExt_Model
{
    protected $_objDomain;
    public function __construct()
    {
        $this->_objDomain = new ConfMotivosbaja();
    }
    
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function addConfig($idconfmotivobaja, $idmotivobaja)
    {
        try {
            $objmb = new ConfMotivosbaja();
            $obj = $objmb->getById($idconfmotivobaja);
            $obj->idmotivobaja = $idmotivobaja;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
}
