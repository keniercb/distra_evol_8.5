<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatSectormedia extends BaseDatSectormedia
{

    public function setUp()
    {
        parent::Setup();
    }

    public function addSectorMedia($naturalezas, $idestructura)
    {
        $collection = new Doctrine_Collection('DatSectormedia');
        $collectionDel = new Doctrine_Collection('DatSectormedia');
        foreach ($naturalezas as $value) {
            $obj = new DatSectormedia();
            if($value->idsectormedia){
                $obj->assignIdentifier($value->idsectormedia);
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
