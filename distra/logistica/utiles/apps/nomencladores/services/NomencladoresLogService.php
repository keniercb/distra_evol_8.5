<?php

/*
 * Clase que contiene los servicios de los nomencladores
 */

/**
 * Description of NomencladoresLogServices
 *
 * @author Maricet Estevez
 */
class NomencladoresLogService extends ZendExt_Model
{

    public function getQueryCategoriaPrecio()
    {
        return NomCategoriaprecio::getQueryCategoriaPrecio();
    }


    public function getQueryConceptoImporte()
    {
        return NomConceptoimporte::getQueryConceptoImporte();
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna el id de la categoria por defecto que exista en la
     *         configuracion de inventario
     *
     */
    public function getCategoriaDefecto()
    {
        return NomCategoriasproductoModel::getCategoriaPorDefecto();
    }

    public function getCondicionpagoDefecto()
    {
        return NomCondicionpagoModel::getCondicionPagoPorDefecto();
    }

    public function devolverCondicionpagoEntidad($idestructura)
    {
        return NomCondicionpagoModel::devolverCondicionpagoEntidad($idestructura);
    }

    public function innerJoinNomCategoria($query, $alias, $aliasNomCat = 'nc')
    {
        $nomcat = new NomCategoriasproductoModel();
        return $nomcat->innerJoinNomCategoria($query, $alias, $aliasNomCat);
    }

    public function innerJoinNomCondicionpago($query, $alias, $aliasNomCat = 'ncp')
    {
        $nomcond = new NomCondicionpagoModel();
        return $nomcond->innerJoinNomCondicionpago($query, $alias, $aliasNomCat);
    }

    public function devolverTipoPrecio($params, $devolvequery = false)
    {
        $nomencladoresModel = new NomencladoresModel();
        return $nomencladoresModel->buscarEntidad($params, $devolvequery);
    }

    public function buscarEntidad($params, $devolvequery = false)
    {
        $nomencladoresModel = new NomencladoresModel();
        return $nomencladoresModel->buscarEntidad($params, $devolvequery);
    }

    /**
     * Servicios del nomenclador de clasificacion contable
     */
    public function obtenerClasificacionContable($idClasificacion = null)
    {        
        return NomClasificacioncontableModel::getInstance()->obtenerClasificacion($idClasificacion);
    }

    public function addSelectClasificacionContable(Doctrine_Query $dql, $alias, $idCampo = 'idclasificacioncontable')
    {
        if (JSONComponent::__init()->getComponent('log.lb.comprobante', true)) {
            NomClasificacioncontableModel::getInstance()->addSelectClasificacion($dql, $alias, $idCampo);
        }
    }
    /**
     * Metodo para unirse con Clasificacion contable y obtener la denominacion
     * @param Doctrine_Query $dql
     * @param type $aliasE (alias de la tabla que se relaciona con clasificacion)
     * @param type $join (tipo de join[left o right])
     * @param type $aliasI (alias de la tabla clasificacion contable)
     */
    public function getJoinClasificacionCont(Doctrine_Query $dql, $aliasE, $join= 'left', $aliasI='cc')
    {
        if (JSONComponent::__init()->getComponent('log.lb.comprobante', true)) {
            NomClasificacioncontableModel::getInstance()->getJoinClasificacionCont($dql, $aliasE, $join, $aliasI);
        }
    }

    public function getSeriesDocumento($parametros)
    {
        $model = new NomSeriedocumentoModel();
        return $model->buscarAux($parametros);
    }

    public function getJoinLineaProducto($dql, $aliasE, $join= 'left', $aliasI='nlpf')
    {
        return (new NomencladoresFarmaciaService())->getJoinLineaProducto($dql,$aliasE,$join,$aliasI);
    }

     public function getQueryConceptoByParams($query, $alias, $aliasNomCon = 'nc')
    {
        $model = new NomConceptoModel();
        return $model->getQueryConceptoByParams($query, $alias, $aliasNomCon);
    }
}
