<?php

/**
 * @class      DatCuadrobasico
 *
 * @package    Inventario
 * @subpackage Configuracion
 * @author     Manuel Yhon Figueroa
 * @copyright  XETID
 * @version    2.0
 */
class DatCuadrobasico extends BaseDatCuadrobasico
{

    public function setUp()
    {
        parent:: setUp();
    }


    public function GetLLave()
    {
        $query = new Doctrine_Query();
        $result = $query->select('MAX(idcuadrobasico)')
            ->from('DatCuadrobasico')->execute();
        $arr = $result->toArray();
        return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1);

    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatCuadrobasico')->execute();
        return $result->toArray();
    }

    public function existeCategoria($idcategoria, $idestructura)
    {
        $res = Doctrine::getTable('DatCuadrobasico')->findByDql(
            'idcategoria = ? and idestructura = ?', array($idcategoria, $idestructura)
        );
        if ($res->idcategoria) {
            return true;
        } else {
            return false;
        }
    }
}