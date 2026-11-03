<?php

/**
 * Esta interfaz
 *
 * @author Kenier Cumba Bueno
 */
interface ICompositeModel
{

    public function addJoinModel(Doctrine_Query $query, $aliasExterno, $aliasLocal, $includeSelect = true,
        $parametros = array()
    );

    public function addQueryFilters(Doctrine_Query $query, $aliasTabla, $parametros = array());

    public function initBaseRelation(Doctrine_Record $model);

    public function beforeSave(Doctrine_Record $model, $parametros = array());

    public function getQuerySelectFields($alias);

    public function beforeDelete($identifier);

}
