<?php

/**
 * Class SubordinacionService
 */
class SubordinacionService extends ZendExt_Model
{
    /**
     * Referencia al modelo para manejar las estructuras
     *
     * @var EstructurasbModel
     */
    var $subordinacion;

    /**
     * Constructor de la interfaz, destinado a reservar para objetos de tipo model
     *
     * @return \SubordinacionService
     */
    function __construct()
    {
        $this->subordinacion = new SubordinacionModel();
    }

    /**
     * Obtener los datos de padre del padre al cual se subordina.
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Daymel Machado
     *
     * @param $idHijo
     * @param $idSubordinacion
     *
     * @param $aExcluir
     *
     * @return array|null
     */
    function buscarPadreSubordinacion($idHijo, $idSubordinacion, $aExcluir)
    {
        return $this->subordinacion->dameDatos($idHijo, $idSubordinacion, $aExcluir, false);
    }

    /**
     * Devuelve un arreglo con los datos de las subordinaciones hijas
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     *
     * @param int $idEstructura
     * @param     $tipoSubordinacion
     *
     * @param     $aExcluir
     *
     * @return array
     */
    function DameHijosSubordinacion($idEstructura, $tipoSubordinacion, $aExcluir)
    {
        return $this->subordinacion->dameDatos($idEstructura, $tipoSubordinacion, $aExcluir, true);
    }

    function getHijosSubTree($idPadre, $idNom)
    {
        return $this->subordinacion->getChidLtree($idPadre, $idNom);
    }

    function getPadreTree($idhijo, $idNom)
    {
        return $this->subordinacion->getFatherLtree($idhijo, $idNom);
    }
}

