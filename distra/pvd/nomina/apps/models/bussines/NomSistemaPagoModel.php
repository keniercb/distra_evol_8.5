<?php

/**
 * Modelo de negocio para gestionar los sistemas de pago.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomSistemaPago, Entidad sistema de pago (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomSistemaPagoModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomSistemaPagoModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los sistemas de pago dado un identificador de forma de pago.
     * 
     * @param int $idformapago  Identificador de la forma de pago.
     * @param int $inicio       Inicio de la busqueda.
     * @param int $limite       Limite maximo de la busqueda.
     * @return array Listado de sistemas de pago.
     */
    public function obtenerListadoSistemasPago($idformapago, $inicio = 0, $limite = 10) {

        //Retornando el listado de sistemas de pago.
        return NomSistemaPago::obtenerListadoSistemasPago($inicio, $limite, $idformapago);
    }

    /**
     * Obtener la cantidad total de sistemas de pago dado un identificador de forma de pago.
     *
     * @param int $idformapago  Identificador de la forma de pago.
     * @return int Cantidad total de sistemas de pago.
     */
    public function obtenerCantidadTotalSistemasPago($idformapago) {

        //Retornando la cantidad total de sistemas de pago.
        return NomSistemaPago::obtenerCantidadTotalSistemasPago($idformapago);
    }

    /**
     * Insertar un sistema de pago.
     * 
     * @param string $denom     Denominacion del sistema de pago.
     * @param string $finicio   Fecha de inicio de creacion del sistema de pago.
     * @param string $ffin      Fecha de fin de uso del sistema de pago.
     * @param string $descrip   Descripcion del sistema de pago.
     * @param string $idform    Identificador de la forma de pago.
     */
    public function adicionarSistemaPago($denom, $finicio, $ffin, $descrip, $idform) {

        //Se crea el objeto del sistema de pago.
        $objSistemaPago = new NomSistemaPago();

        //Insertando los datos del sistema de pago.
        $objSistemaPago->denominacion = $denom;
        $fecha=split('/',$finicio); 
        $objSistemaPago->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $fecha=split('/',$ffin);   
        $objSistemaPago->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $objSistemaPago->descripcion = $descrip;
        $objSistemaPago->idformapago = $idform;

        //Guardando los datos.
        $objSistemaPago->save();
    }

    /**
     * Modificar un sistema de pago.
     * 
     * @param int $idsistema    Identificador del sistema de pago.
     * @param string $denom     Denominacion del sistema de pago.
     * @param string $finicio   Fecha de inicio de creacion del sistema de pago.
     * @param string $ffin      Fecha de fin de uso del sistema de pago.
     * @param string $descrip   Descripcion del sistema de pago.
     */
    public function modificarSistemaPago($idsistema, $denom, $finicio, $ffin, $descrip) {

        //Obteniendo el sistema de pago a modificar.
        $objSistemaPago = NomSistemaPago::obtenerObjSistemaPagoDadoId($idsistema);

        //Modificando los datos del sistema de pago.
        $objSistemaPago->denominacion = $denom;
        $fecha=split('/',$finicio); 
        $objSistemaPago->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $fecha=split('/',$ffin);   
        $objSistemaPago->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $objSistemaPago->descripcion = $descrip;

        //Guardando los datos.
        $objSistemaPago->save();
    }

    /**
     * Eliminar un sistema de pago.
     * 
     * @param int $idsistema    Identificador del sistema de pago.
     */
    public function eliminarSistemaPago($idsistema) {

        try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomSistemaPago')
				->where('idsistemapago = ?', $idsistema)
				->execute();
			return $r;
		}
        catch (Exception $e){
            if($e->getCode() == 23503){//Code for foreignKeyViolation
                return 2;
            }else{
                return 1;
            }
        }
    }
}
