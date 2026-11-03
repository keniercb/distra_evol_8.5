<?php

class DatProductocmplto extends BaseDatProductocmplto
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto'));
    }

    public function GetLLave()
    {
        $query = new Doctrine_Query();
        $result = $query->select('MAX(idproducntocmplto)')->from('DatProductocmplto')->execute();
        $arr = $result->toArray();

        return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1);
    }

    public function Buscar($idmovimiento)
    {
        return Doctrine::getTable('DatProductocmplto')->find($idmovimiento);
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatProductocmplto')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatProductocmplto')->limit($limite)->offset($inicio)->execute();
        return $result->toArray();
    }
}
