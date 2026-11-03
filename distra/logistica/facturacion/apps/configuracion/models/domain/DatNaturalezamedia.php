<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatNaturalezamedia extends BaseDatNaturalezamedia
{

    public function setUp()
    {
        parent::Setup();
    }

    public function addNaturalezaMedia($naturalezas, $idestructura)
    {
        $collection = new Doctrine_Collection('DatNaturalezamedia');
        $collectionDel = new Doctrine_Collection('DatNaturalezamedia');
        foreach ($naturalezas as $value) {
            $obj = new DatNaturalezamedia();
            if($value->idnaturalezamedia){
                $obj->assignIdentifier($value->idnaturalezamedia);
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
