<?php
class ConfInventarioExt extends BaseConfInventarioExt
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('ConfInventario', array('local' => 'idestructuracomun', 'foreign' => 'idestructuracomun'));
    }

    public function existeConfiguracion($idestructuracomun)
    {
        $res = Doctrine::getTable('ConfInventarioExt')
            ->find($idestructuracomun);
        if ($res->idestructuracomun) {
            return true;
        } else {
            return false;
        }
    }

}
