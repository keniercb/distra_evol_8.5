<?php

/**
 * Created by PhpStorm.
 * User: yOaN
 * Date: 18/03/2015
 * Time: 10:09
 */
class NomencladoresPersonaService
{

    public function getNomTipoDocumentoIdentidad($start, $limit, $filtro)
    {
        try {
            $obj = new NomTipodocidentidadModel();

            return $obj->getTipoDocIdentidadActivo($start, $limit, $filtro);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idtipodocidentidad
     *
     * @throws Exception
     */
    public function getDatosNomTipoDocById($idtipodocidentidad)
    {
        try {
            $obj = new NomTipodocidentidadModel();

            return $obj->getDatosNomTipoDocById($idtipodocidentidad);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idcategoria
     *
     * @throws Exception
     */
    public function getNomCategoriaById($idcategoria)
    {
        try {
            $obj = new NomCategoriapersonaModel();

            return $obj->getNomCategoriaById($idcategoria);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @throws Exception
     */
    public function getNomCategorias()
    {
        try {
            $obj = new NomCategoriapersonaModel();

            return $obj->getCategorias();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getNomCategoriasPadres()
    {
        try {
            $obj = new NomCategoriapersonaModel();

            return $obj->getCategoriasPadres();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getSituacionByIds($id, $limit = null, $start = 0)
    {
        try {
            $obj = new NomSituacion();
            $res->data = $obj->getSituacionByParams($id, $limit, $start);

            return $res;
        } catch (Exception $e) {
            throw $e;
        }
    }
}