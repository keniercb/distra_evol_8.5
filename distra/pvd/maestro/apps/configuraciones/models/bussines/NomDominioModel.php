<?php
/**
 * @name NomDominioModel - Clase modelo del componente de configuración "Dominios de solución".
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 * @date 07/11/2017 Ing. Orestes Rodríguez Lorenzo
 * @version 1.0.0
 */

class NomDominioModel extends ZendExt_Model
{
    /**
     * @author Ing. Orestes Rodríguez Lorenzo
     * @date 07/11/2017
     */
    public function __construct()
    {
    }

    public function obtenerDominios() {
        try {
            $obj = new NomDominio();
            return $obj->getDominiosAll();
        } catch (Exception $e) {
            return array('resultado' => false, 'error' => $e);
        }
    }
}