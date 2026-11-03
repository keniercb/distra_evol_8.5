<?php

/**
 * Interfaz para implementacion de los modelos de negocio usando
 * el patron de
 * dise&ntilde;o Repository. Brinda la coleccion de metodos que
 * deben ser implementados
 * en los modelos de negocio
 *
 * @author Kenier Cumba Bueno
 */
interface IEntityRepository
{

    /**
     *
     */
    public function insertar($arrayObj);

    /**
     *
     */
    public function eliminar($arrayId);

    /**
     *
     */
    public function obtener($identificador);

    /**
     *
     */
    public function obtenerTodos($params = array());

    /**
     *
     */
    public function getQueryAsRoot($alias = '');

    /**
     *
     */
    public function getSelectFields($alias = '');

    /**
     *
     */
    public function getSelectFieldsAS($alias = '');

    /**
     *
     */
    public function joinDQLQuery(Doctrine_Query $query, $alias = '', $foreign = '', $join = '', $on = '');

    /**
     *
     */
    public function addQueryFilters(Doctrine_Query $query, $filters = array());
}
