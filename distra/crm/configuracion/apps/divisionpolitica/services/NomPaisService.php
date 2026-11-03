<?php

/**
 * Servicios para usar los pa&iacute;ses del nomenclador.
 *
 * @author     migue
 * @copyright  XETID
 * @package    Servicios
 * @subpackage Configuración/DivisiónPolítica
 * @version    1.0
 */
class NomPaisService extends ZendExt_Model
{

    function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Devuelve los datos de todos los países
     *
     * @param array $argFilterSql Arreglo de condiciones
     *
     * @return array
     */
    function obtenerPaises($argFilterSql)
    {
        return NomPais::obtenerNomPaises($argFilterSql);
    }

    /**
     * Devuelve un pais dado el id
     *
     * @param mixed $agIdPais
     *
     * @return array
     */
    function obtenerPais($agIdPais)
    {
        return NomPais::getPais($agIdPais);
    }

    /**
     * Obtiene los pa&iacute; del nomenclador
     * @param array $arrCond Utilizado para la busqueda en la forma array('nombrepais' => 'miPais')
     * @param int $start Inicio inferior
     * @param int $limit L&iacute;mite superior
     *
     * @author Ing. Lisvany Alonso Martinez
     * @return array Devuelve un arreglo con la estructura array('cant' => $cantMonedas, 'datos' => $resultMonedas)
     */
    function getPaises($arrCond = array(), $start = 0, $limit = 0)
    {
        return NomPais::getPaisesService($arrCond, $start, $limit);
    }

}
