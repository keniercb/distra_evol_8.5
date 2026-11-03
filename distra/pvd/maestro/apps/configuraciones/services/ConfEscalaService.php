<?php
/**
 * @name ConfEscalaService - Clase de servicios para la configuracion de las escalas.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConfEscalaService extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @method obtenerEscalas - Servicio que obtiene las escalas.
     * @return Array - Arreglo de datos de las escalas.
     * @author Yaricel Guerra Velazquez.
     */
    public function obtenerEscalas($tipo)
    {
        $arr_res = Array();
        $arr_res = ConfEscalaModel::getEscalasActivas($tipo);
        return  $arr_res;
    }

    /**
     * @method obtenerEscalasPorId - Servicio que obtiene la escala dado id.
     * @return Array - Arreglo de datos de la escala dado el id.
     * @author Yaricel Guerra Velazquez.
     */
    public function obtenerEscalasPorId($idescala)
    {
        $arr_res = Array();
        $arr_res = ConfEscala::getById($idescala);
        return  $arr_res;
    }

    /**
     * @method getValoresByEscala - Servicio que obtiene los valores dado idescala.
     * @return Array - Arreglo de valores de la escala dado el idescala.
     * @author Yaricel Guerra Velazquez.
     */
    public function getValoresByEscala($idescala)
    {
        $arr_res = Array();
        $arr_res = ConfEscalaModel::getValoresByEscala($idescala);
        return  $arr_res;
    }

    /**
     * @method getDenomValorByIdEscalaIdValor - Servicio que obtiene la denominación del valor dado idescala e idvalor.
     * @return string - Denominación del valor de la escala.
     * @author Yaricel Guerra Velazquez.
     */
    public function getDenomValorByIdEscalaIdValor($idescala, $idvalor)
    {
        $valor = ConfEscalaModel::getDenomValorByIdEscalaIdValor($idescala, $idvalor);
        return  $valor;
    }

    /**
     * @method getValorByIdEscalaIdValor - Servicio que obtiene el obj valor dado idescala e idvalor.
     * @return string - Obj del valor de la escala.
     * @author Yaricel Guerra Velazquez.
     */
    public function getValorByIdEscalaIdValor($idescala, $idvalor)
    {
        $valor = ConfEscalaModel::getValorByIdEscalaIdValor($idescala, $idvalor);
        return  $valor;
    }
}