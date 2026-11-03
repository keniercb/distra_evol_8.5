<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of RegistroOperativoService
 *
 * @author kenier
 */

if (!class_exists('BaseModel')) {
    $dirAFT = Zend_Registry::getInstance()->get('config')
            ->dir_aplication . '/logistica/activos_fijos/comun/config.php';
    include_once $dirAFT;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class RegistroOperativoService extends ZendExt_Model
{
    private $connection, $registroModel;

    public function __construct()
    {
        parent::__construct();
        $this->connection = Doctrine_Manager::connection();
        $this->registroModel = new RegistroActivoModel();
        $this->registroModel->loadPluginsFromFile('listaplugins')->buildRelations();
    }

    public function devolverRegistrosEstructura($idAreaResp, $idIndicador, $limit = false, $start = false)
    {
        if(!is_array($idAreaResp)){
            $idAreaResp  = array($idAreaResp);
        }
        $idAreaResp = implode(',', $idAreaResp);
        $sqlQuery = "select i.codigo || ' '||i.denominacion || ' '|| coalesce(drn.nroserie,'') as textdenom, 
            drna.nroinventario as nroinventario, drn.idregnumerico as id from mod_logistica.dat_producto dp
            inner join mod_logactivofijotangible.dat_registronumerico drn on drn.idproducto = dp.idproducto
            inner join mod_logactivofijotangible.dat_regnumericoactivo drna
                on drna.idregnumerico = drn.idregnumerico
            inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador";
        if ($idIndicador) {
            $sqlQuery.= " where i.idindicador in ({$this->getArrayIndicadoresHijos($idIndicador)}) "
                ."AND drna.idarearesp in ({$idAreaResp})";
        } else {
            $sqlQuery.= " where drna.idarearesp in ({$idAreaResp})";
        }
        $sqlQuery.= " and drna.plantilla = 1";
        if($limit){
            $sqlQuery.= " limit {$limit}";
        }
        if($start){
            $sqlQuery.= " offset {$start}";
        }
        //print_r($sqlQuery);die;

        return $this->connection->fetchAll($sqlQuery);
    }

    public function getArrayIndicadoresHijos($idIndicador)
    {
        $sqlQuery = "select idindicador from mod_datosmaestros.nom_indicador "
            ."where idarbol = {$this->getSqlCampoIndicador('idarbol', $idIndicador)} "
            ."and ordenizq >= {$this->getSqlCampoIndicador('ordenizq', $idIndicador)}"
            ."and ordender <= {$this->getSqlCampoIndicador('ordender', $idIndicador)}";
        return $sqlQuery;
    }

    private function getSqlCampoIndicador($campo, $idIndicador)
    {
        return "(select i.{$campo} from mod_datosmaestros.nom_indicador i where i.idindicador = {$idIndicador})";
    }
    
    public function deleteRegistros($arrIdsRegistros){
        
    }

    public function  cargarRegistroOperativos($parametros)
    {
       return $this->registroModel->cargarRegistroOperativos($parametros);
    }
}
