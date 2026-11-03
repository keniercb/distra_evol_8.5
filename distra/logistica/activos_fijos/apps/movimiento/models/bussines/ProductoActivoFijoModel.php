<?php

/**
 *
 */
class ProductoActivoFijoModel extends LogisticaProductoModel
{

    /**
     *
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     *
     */
    public function actualizarCantidadMedios($idDocumento, $signo)
    {
        $query = new Doctrine_Query();
        /*  $result = $query->select("p.idproducto, (p.cantidad {$signo} m.cantidad) as cantidad")
          ->from('DatProductoLogistica p')
          ->innerJoin('p.DatMovimientos m')
          ->where('iddocumento = ?', array($idDocumento))
          ->fetchArray(); */
        /* $query->update()
          ->from('DatProductoLogistica p')
          ->set('p.cantidad', "p.cantidad $signo (SELECT m2.cantidad "
          . "FROM DatProductoLogistica p2 "
          . "INNER JOIN p2.DatMovimientos m2 "
          . "INNER JOIN m2.DatDocumento dd "
          . "WHERE dd.iddocumeto = $idDocumento AND p2.idproducto = p.idproducto)"
          );

          if ($signo == '+') {
          $query->set(
          'p.disponible', "p.disponible $signo (
          SELECT m2.cantidad FROM DatProductoLogistica p2
          INNER JOIN p2.DatMovimientos m2
          INNER JOIN m2.DatDocumento d2
          WHERE d2.iddocumeto = $idDocumento AND p2.idproducto = p.idproducto
          )"
          );
          }

          $query->whereIn(
          'p.idproducto', "
          SELECT p2.idproducto FROM DatProductoLogistica p2
          INNER JOIN p2.DatMovimientos m2
          INNER JOIN m2.DatDocumento d2
          WHERE d2.iddocumeto = $idDocumento
          "
          ); */

        $sql = "UPDATE mod_logistica.dat_producto p SET cantidad = (cantidad $signo (
            SELECT m2.cantidad 
            FROM mod_logistica.dat_producto p2
            INNER JOIN mod_logistica.dat_movimiento m2 on m2.idproducto = p2.idproducto
            WHERE m2.iddocumento = $idDocumento AND p2.idproducto = p.idproducto))";

        if ($signo == '+') {

            $sql .= ", disponible = (p.disponible " . $signo . " (
                     SELECT m2.cantidad FROM mod_logistica.dat_producto p2
                    INNER JOIN mod_logistica.dat_movimiento m2 on m2.idproducto = p2.idproducto
                    WHERE m2.iddocumento = $idDocumento AND p.idproducto = p2.idproducto)
            )";
        }
        $sql .= " WHERE p.idproducto IN (
                 SELECT p2.idproducto FROM mod_logistica.dat_producto p2
                    INNER JOIN mod_logistica.dat_movimiento m2 on m2.idproducto = p2.idproducto                    
                    WHERE m2.iddocumento = $idDocumento
        )";
        //print_r($sql);die;
        $conn = Zend_Registry::get('conexion');
        $query = $conn->prepare($sql);
        return $query->execute();
    }

    /**
     *
     */
    public function modDisponibilidadMedios($idProducto, $cantidad, $signo)
    {
        if ($signo == '+' || $signo == '-') {

            $prod = Doctrine::getTable('DatProductoLogistica')
                ->find($idProducto);
            if($signo == '+')
                $prod->disponible = $prod->disponible + $cantidad;
            if ($signo == '-')
                $prod->disponible = $prod->disponible - $cantidad;
            $prod->save();

            /*$cantidad += 0;


            $query = new Doctrine_Query();

            $query->update('DatProductoLogistica p')
                ->set("p.disponible", "p.disponible $signo $cantidad")
                ->where('p.idproducto = ?', $idProducto)
                ->execute();*/
        } else {
            throw new Exception(
                'El método no puede actualizar la disponibilidad del producto si el parámetro $signo'
                . ' no poseé valores (+) ó (-).'
            );
        }
    }

    public function modCantidadMedios($idProducto, $cantidad, $signo)
    {
        if ($signo == '+' || $signo == '-') {
            $cantidad += 0;
            $query = new Doctrine_Query();
            $query->update('DatProductoLogistica p')
                ->set("p.cantidad", "p.cantidad $signo $cantidad")
                ->where('p.idproducto = ?', $idProducto)
                ->execute();
        } else {
            throw new Exception(
                'El método no puede actualizar la disponibilidad del producto si el parámetro $signo' .
                ' no poseé valores (+) ó (-).'
            );
        }
    }

    public function modCantidadDisponiblieMedios($idProducto, $cantidad, $signo)
    {
        if ($signo == '+' || $signo == '-') {
            $cantidad += 0;
            $query = new Doctrine_Query();
            $query->update('DatProductoLogistica p')
                ->set("p.disponible", "p.disponible $signo $cantidad")
                ->set("p.cantidad", "p.cantidad $signo $cantidad")
                ->where('p.idproducto = ?', $idProducto)
                ->execute();
        } else {
            throw new Exception(
                'El método no puede actualizar la disponibilidad del producto si el parámetro $signo' .
                ' no poseé valores (+) ó (-).'
            );
        }
    }

}
