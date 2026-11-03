<?php
/**
 * DatNomina
 * 
 * @author Ing. Yadir Martinez Vergara.
 * @package Pvd.
 * @subpackage Nomina - Pago.
 * @copyright UCID
 * @descripcion Clase que se encarga de generar las nominas con sus valores
 * @version 1.0
 */
class DatPartidagasto extends BaseDatPartidagasto {


    public static function existe($identidad,$tipo) {
        return Doctrine_Query::create()->select('COUNT(*) AS cantidad')
            ->from('DatPartidagasto')
            ->where('idestructura = ?and cajacajero = ? ', array($identidad,$tipo))
            ->fetchOne()
            ->cantidad;
    }

    public static function DeleteAll($identidad,$tipo) {
        return Doctrine_Query::create()
            ->delete()
            ->from('DatPartidagasto')
            ->where('idestructura = ? and cajacajero = ?', array($identidad,$tipo))
            ->execute();
    }



   }/*FIN DE LA CLASE*/
