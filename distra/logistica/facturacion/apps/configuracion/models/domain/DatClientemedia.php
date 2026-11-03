<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatClientemedia extends BaseDatClientemedia
{

    public function setUp()
    {
        parent::Setup();
    }

    public function addClienteMedia($clientes, $idestructura)
    {
        $collection = new Doctrine_Collection('DatClientemedia');
        $collectionDel = new Doctrine_Collection('DatClientemedia');
        foreach ($clientes as $value) {
            $obj = new DatClientemedia();
            if($value->idclientemedia){
                $obj->assignIdentifier($value->idclientemedia);
            }
            $obj->synchronizeWithArray($value);
            //$obj->idestructura = $idestructura;
            if ($value->media == 0 || $value->media == null) {
                $collectionDel->add($obj);
            } else {
                $collection->add($obj);
            }
        }
        $collection->save();
        $collectionDel->delete();
    }

}
