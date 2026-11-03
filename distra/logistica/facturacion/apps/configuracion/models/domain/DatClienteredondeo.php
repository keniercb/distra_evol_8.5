<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatClienteredondeo extends BaseDatClienteredondeo
{

    public function setUp()
    {
        parent::Setup();
    }

    public function addClienteRedondeo($clientes, $idestructura)
    {
        $collection = new Doctrine_Collection('DatClienteredondeo');
        $collectionDel = new Doctrine_Collection('DatClienteredondeo');
        foreach ($clientes as $value) {
            $obj = new DatClienteredondeo();
            if($value->idclienteredondeo){
                $obj->assignIdentifier($value->idclienteredondeo);
            }
            $obj->synchronizeWithArray($value);
            //$obj->idestructura = $idestructura;
            if ($value->redondear == -1 || $value->redondear == null) {
                $collectionDel->add($obj);
            } else {
                $collection->add($obj);
            }
        }
        $collection->save();
        $collectionDel->delete();
    }

}
