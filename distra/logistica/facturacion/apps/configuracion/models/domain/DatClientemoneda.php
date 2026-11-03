<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatClientemoneda extends BaseDatClientemoneda
{

    public function setUp()
    {
        parent::Setup();
    }

    public function addClienteMoneda($clientes, $idestructura)
    {
        $collection = new Doctrine_Collection('DatClientemoneda');
        $collectionDel = new Doctrine_Collection('DatClientemoneda');
        foreach ($clientes as $value) {
            $obj = new DatClientemoneda();
            if($value->idclientemoneda){
                $obj->assignIdentifier($value->idclientemoneda);
            }
            $obj->synchronizeWithArray($value);
            //$obj->idestructura = $idestructura;
            if ($value->idmoneda == -1 || $value->idmoneda == null) {
                $collectionDel->add($obj);
            } else {
                $collection->add($obj);
            }
        }
        $collection->save();
        $collectionDel->delete();
    }

}
