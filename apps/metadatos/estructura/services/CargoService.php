<?php

/**
 * Class CargoService
 */
class  CargoService extends ZendExt_Model
{
    /**
     * @var DatCargoModel
     */
    var $cargo;

    /**
     *
     */
    function __construct()
    {
        $this->cargo = new DatCargoModel();
    }

    /**
     * @param bool $militares
     * @param int  $limit
     * @param int  $start
     *
     * @return array
     */
    function obtenerDenominacionesCargos($militares = false, $limit = 50, $start = 0)
    {
        $datos = $this->cargo->dameIdCargosEspecificos($militares, $limit, $start);

        return $datos;
    }

    /**
     * Obtiene los datos de un cargo
     *
     * @author      : Ing. Daymel Machado
     *
     * @param $arrIdscargos
     *
     * @return array|null
     */
    function obtenerDatosCargoServices($arrIdscargos)
    {
        $arrayData = $this->cargo->obtenerDatosCargo($arrIdscargos);

        return $arrayData;
    }

    /**
     * @param $idCargo
     * @param $cantidad
     *
     * @return bool
     */
    function actualizarCantidadReal($idCargo, $cantidad)
    {
        return $this->cargo->actualizarCantidadRealCargo($idCargo, $cantidad);
    }

    /**
     * @param $idnomcargo
     * @param $dominio
     * @param $datos
     *
     * @return array
     */
    function dameCargosXIdNomCargo($idnomcargo, $dominio, $datos)
    {
        $arrayData = $this->cargo->dameCargosXIdNomCargo($idnomcargo, $dominio, $datos);

        return $arrayData;
    }

    /**
     * Descripcion del metodo: Agrega al objeto de Doctrine_Query
     * las tablas y los datos a seleccionar (DatCargo, DatCargocivil, DatCargomilitar)
     *
     * @param Doctrine_Query $objDoctrineQuery
     * @param string         $aliasTablaReferencia
     * @param string         $aliasTabla
     * @param string         $relation
     * @param string|bool    $includeDqlSelect
     *
     * @throws Exception
     * @return \Doctrine_Query
     */
    public function agregarDqlDatosCargoServices(
        Doctrine_Query $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $relation = 'leftJoin',
        $includeDqlSelect = false
    )
    {
        try{
            return $this->cargo->agregarDqlDatosCargo(
                               $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $relation, $includeDqlSelect
            );
        } catch (Exception $e){
            throw $e;
        }
    }
}
