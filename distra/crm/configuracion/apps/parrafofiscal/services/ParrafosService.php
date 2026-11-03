<?php

/**
 * Clase de servicios de P\xE1rrafo Fiscal
 * 
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Servicios
 * @subpackage Configuración/P\xE1rrafoFiscal
 * @copyright  XETID
 * @version    1.0-0
 */
class ParrafosService extends ZendExt_Model
{

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtiene un p\xE1rrafo fiscal a partir de su identificador
     * 
     * @param mixed $idparrafofiscal Identificador de p\xE1rrafo fiscal
     * 
     * @return Object P\xE1rrafo fiscal
     */
    public function BuscarPorId($idparrafofiscal)
    {
        $model = new ParrafofiscalModel();
        $result = $model->BuscarPorId($idparrafofiscal);
        $standart = new ZendExt_ClassStandard();
        return $standart->Object($result);
    }

    /**
     * Obtiene el \xE1rbol de p\xE1rrafos fiscales
     * 
     * @return void Realiza una redirección hacia el controlador
     */
    public function ArbolParrafos()
    {
        $dirController = '/configuracion/parrafofiscal/index.php/arbolparrafofiscal/arbolparrafofiscal';
        header("Location: $dirController");
    }

    /**
     * Obtiene p\xE1rrafos fiscales por estructur común
     * 
     * @param int $idestructuracomun Identificador de estructura común
     * @param int $idnode Identificador del nodo
     *
     * @return array P\xE1rrafos fiscales
     */
    public function obtenerIngresosEntidad($idestructuracomun, $idnode)
    {
        $model = new ParrafofiscalModel();
        $result = $model->buscarPorEntidad($idestructuracomun, $idnode);
        $standart = new ZendExt_ClassStandard();
        return $standart->ArrayObject($result);
    }

}
