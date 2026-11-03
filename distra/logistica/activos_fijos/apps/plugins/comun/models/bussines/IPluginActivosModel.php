<?php

/**
 * @author Gerardo
 */
interface IPluginActivosModel extends ICompositeModel
{

    public function beforeSaveMov(Doctrine_Record $model, $parametros = array());

    public function beforeDeleteMov($identifier);

    public function crearMovRegNumericoDesdeRegNumerico(Doctrine_Record $modelo, $idMovimiento, $arrIdesRegNumericos);

    public function preBeforeSaveMov($parametros);

    public function initBaseMovRelation(Doctrine_Record $modelo);

    public function clonarMovimiento($idMovRegNumClonar, $idMovRegNumClonado);

    public function getDatRegnumericoActivoplugin($idRegNumerico);

    public function leftJoinDatAlternosRegNumerico($alias, $query);
    
    public function clonePluginsData($arrRegNumOld, $arrRegNumNew);
    
    public function replicarMovrnToRn($conn, $iddocumento);
}
