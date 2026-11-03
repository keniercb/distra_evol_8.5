<?php

class ConfMotivosbaja extends BaseConfMotivosbaja
{
    public function setUp()
    {
        parent :: setUp();
    }

    public function getById($id)
    {
        return Doctrine::getTable('ConfMotivosbaja')->find($id);
    }

    public function getConfiguraciones()
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfMotivosbaja m');
        return $queryObj->fetchArray();
    }

}
