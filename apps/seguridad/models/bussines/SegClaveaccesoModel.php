<?php

/**
 * @name SegClaveaccesoModel - Clase de negocio para la gestión de
 *  expiración de claves de usuario.
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class SegClaveaccesoModel extends ZendExt_Model
{

    private $_caduca = 0;

    /**
     * @method SegClaveaccesoModel() - Constructor de la clase.
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_caduca = self::expirationDays();
    }

    /**
     * @author Darien García Tejo.
     * @method insertar($idusuario, $passw) - Función usada para almacenar 
     * en base de datos tiempo de vigencia de la nueva clave
     * @param integer $idusuario - Identificador de usuario.
     * @param string $passw - Contraseña del usuario (md5).
     * @return integer - Días de valides de la cuenta.
     */
    public function insertar($idusuario, $passw)
    {
        $objClaves = new SegClaveacceso();
        $objClaves->idusuario = $idusuario;
        $objClaves->valor = true;
        $objClaves->fechafin = self::fechaFin();
        $objClaves->clave = $passw;
        $objClaves->save();
        return $this->_caduca;
    }

    /**
     * @author Darien García Tejo.
     * @method fechaFin() - Función usada para obtener la fecha final 
     * a partir del día actual y un plazo de tiempo determinado.
     * @return Date - Fecha.
     */
    private function fechaFin()
    {
        $fechainicio = date('d-m-Y');
        $date = new DateTime($fechainicio);
        $cadena = "+" . $this->_caduca . " day";
        $date->modify($cadena);
        return $date->format("d-m-Y");
    }

    /**
     * @author Darien García Tejo.
     * @method expirationDays() - Retorna los días de vigencia configurados 
     * en la restricción de la clave.
     * @return integer - Días de vigencia de la clave.
     */
    private static function expirationDays()
    {
        $query = SegRestricclaveacceso::cargarclave(0, 0);
        return $query[0]['diascaducidad'];

    }

    /**
     * @author Darien García Tejo.
     * @method changeDateEnd()- Usada para actualizar la fecha de fin 
     * de las claves una vez actualizado el tiempo de valides en la 
     * restricción.
     * @param integer $expirationDays - Días de valides de la restricción
     *  de clave.
     * @return void.
     */
    static public function changeDateEnd($expirationDays)
    {
        $records = SegClaveacceso::getActiveRestrictions();
        foreach ($records as $row) {
            $endDate = self::getEndDate($row['fechainicio'], $expirationDays);
            SegClaveacceso::updateKey($endDate, $row['pkidclaveacceso']);
        }
    }

    /**
     * @author Darien García Tejo.
     * @method getEndDate($date, $expirationDays) - Función que retorna a 
     * partir de la fecha inicial y
     *                                              el tiempo de valides, 
     * la fecha final de valides de la clave.
     * @param date $date - Fecha inicial en que se generó la clave.
     * @param integer $expirationDays - Días de valides.
     * @return date - Fecha final de valides de la clave.
     */
    private static function getEndDate($date, $expirationDays)
    {
        $fechainicio = date(implode('-', split('[/.-]', $date)));
        $date = new DateTime($fechainicio);
        $cadena = "+" . $expirationDays . " day";
        $date->modify($cadena);
        return $date->format("d-m-Y");
    }
}