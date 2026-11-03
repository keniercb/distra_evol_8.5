<?php

/**
 * Class DominioService
 */
class DominioService extends ZendExt_Model
{
    /**
     * Enter description here...
     *
     * @var DominioModel
     */
    var $dominio;

    /**
     * Constructor de la interfaz, destinado a reservar para objetos de tipo model
     *
     * @return \DominioService
     */
    function __construct()
    {
        $this->dominio = new DominioModel();
    }

    /**
     * Inserta un dominio nuevo
     *
     * @autor Seguridad
     *
     * @param string $nombre
     * @param        $descripcion
     * @param        $arrayEstructuras
     *
     * @return id dominio.
     */
    function InsertarDominio($nombre, $descripcion, $arrayEstructuras)
    {
        return $this->dominio->InsertarDominio($nombre, $descripcion, $arrayEstructuras);
    }

    /**
     * Inserta un dominio nuevo
     *
     * @autor Seguridad
     *
     * @param        $iddominio
     * @param string $nombre
     * @param        $descripcion
     * @param        $arrayEstructuras
     *
     * @return id dominio.
     */
    function ModificarDominio($iddominio, $nombre, $descripcion, $arrayEstructuras)
    {
        return $this->dominio->ModificarDominio($iddominio, $nombre, $descripcion, $arrayEstructuras);
    }

    /**
     * Elimina un dominio
     *
     * @autor Seguridad
     *
     * @param int $iddominio
     *
     * @return bool
     */
    function EliminarDominio($iddominio)
    {
        return $this->dominio->EliminarDominio($iddominio);
    }

    /**
     * Lista todos los dominios existentes en un rango especificado
     *
     * @autor Seguridad
     *
     * @param int $limint
     * @param int $start
     *
     * @return array
     */
    function BuscarDomios($limint, $start)
    {
        $hijos = $this->arregloToUnidimensional($this->dominio->BuscarIdDominioHijos());
        $padre = $this->arregloToUnidimensional($this->dominio->BuscarIdDominioPadre());
        $arrayResult = array_merge($hijos, $padre);

        return $this->dominio->BuscarDomios($limint, $start, $arrayResult);
    }

    /**
     * Cargar el combo de los dominios
     *
     * @autor Seguridad
     *
     * @param $filtroDominio
     *
     * @return array
     */
    function cargarComboDominioBuscar($filtroDominio)
    {
        return $this->dominio->cargarComboDominioBuscar($filtroDominio);
    }

    /**
     * Convertir arreglo
     *
     * @autor Seguridad
     *
     * @param $array
     *
     * @return array
     */
    function arregloToUnidimensional($array)
    {
        $result = array();
        foreach ($array as $iddominio) {
            $result[] = $iddominio['iddominio'];
        }

        return $result;
    }

    /**
     * Lista todos los dominios existentes en un rango especificado
     *
     * @autor Seguridad
     *
     * @param     $limint
     * @param int $start
     *
     * @return array
     */
    function BuscarDominios($limint, $start)
    {
        return $this->dominio->BuscarDominios($limint, $start);
    }

    /**
     * Lista todos los dominios existentes segun el nombre de dominio
     *
     * @autor Seguridad
     *
     * @param     $limit
     * @param int $start
     * @param     $nombredominio
     *
     * @return array
     */
    public function BuscarDomioDadoNombre($limit, $start, $nombredominio)
    {
        $iddominiopadre =  Zend_Registry::getInstance()->session->perfil['iddominio'];
        $cant = NomDominio::cantNomDominioDadoNombre($iddominiopadre, $nombredominio);
        $result = NomDominio::buscarDominioPorNombre($iddominiopadre, $limit, $start, $nombredominio);

        return array('cant' => $cant, 'datos' => $result);
    }

    /**
     * Verifica si la estructura existe
     *
     * @author    : Seguridad
     *
     * @param $iddominio
     *
     * @return mixed
     */
    function existeEstructura($iddominio)
    {
        return $this->dominio->existeEstructura($iddominio);
    }

    /**
     * Verifica si el dominio existe
     *
     * @author    : Seguridad
     *
     * @param $nombredominio , nombre del dominio
     * @param $iddominio     , id del elemento a saber si esta en uso
     *
     * @return int : mixed, Retorna true o false en correspondencia si esta en uso o no
     */
    public function existeNombreDominio($nombredominio, $iddominio)
    {
        return NomDominio::existeNombreDominio($nombredominio, $iddominio);
    }

    /**
     * Retorna los datos del dominio
     *
     * @author    : Seguridad
     *
     * @param $iddominio , id del elemento a saber si esta en uso
     *
     * @return array : mixed
     */
    function DatosDominioDadoID($iddominio)
    {
        $arraydominio = $this->dominio->DatosDominioDadoID($iddominio);

        return $arraydominio;
    }

    /**
     * Retorna los datos del dominio
     *
     * @author    : Seguridad
     * @return array : mixed
     */
    function BuscarIdDominioSeguridad()
    {
        return $this->dominio->BuscarIdDominioSeguridad();
    }

    /**
     * Extrae una extructura de un dominio
     *
     * @author    : Seguridad
     *
     * @param int $iddominio
     * @param int $idestructura
     *
     * @return bool
     */
    function ExtraerEstructura($iddominio, $idestructura)
    {
        return $this->dominio->ExtraerEstructura($iddominio, $idestructura);
    }

    /**
     * Verificar si esta la estructura en un dominio dado
     *
     * @author    : Seguridad
     *
     * @param int $iddominio
     * @param int $idestructura
     *
     * @return bool
     */
    function EstaEstructuraEnDominio($iddominio, $idestructura)
    {
        return $this->dominio->perteneceEstructura($iddominio, $idestructura);
    }

    /**
     * Devuelve los dominios en los que esta contenido una estructura pasada por parametro
     *
     * @author    : Seguridad
     *
     * @param int $idestructura
     *
     * @return array
     */
    function DominiosPorEstructura($idestructura)
    {
        return $this->dominio->DominiosPorEstructura($idestructura);
    }

    /**
     * Devuelve los id de las estructuras que pertenecen al dominio
     *
     * @author    : Seguridad
     *
     * @param $iddominio
     *
     * @internal  param int $idestructura
     * @return array
     */
    function IdEstructurasDominio($iddominio)
    {
        return $this->dominio->arregloEstructuras($iddominio);
    }
}


