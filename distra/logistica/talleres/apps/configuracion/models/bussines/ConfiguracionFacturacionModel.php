<?php

/**
 * @version 1.0
 */
class ConfiguracionFacturacionModel extends ZendExt_Model
{


    public function __construct()
    {
        parent::__construct();
    }

    public function getOperaciones() {
        $facServi = new FacturacionService();
        return array('datos'=>$facServi->getOperaciones(array('idsubsistema' => LogisticaGlobal::SUBSISTEMA_TALLERES)));
    }
    public function getOperacionesMay() {
        $facServi = new FacturacionService();
        return array('datos'=>$facServi->getOperaciones(array('idsubsistema' => LogisticaGlobal::SUBSISTEMA_TALLERES,'mayorista' => 1)));
    }

    public function guardarConfiguracion($parametros) {
        $conf = new ConfTallerFacturacion();
        $parametros['idestructuracomun'] = $this->global->Estructura->idestructura;
        $obj = Doctrine::getTable('ConfTallerFacturacion')->find($parametros['idestructuracomun']);
        if ($obj)
            $conf->assignIdentifier($parametros['idestructuracomun']);
        if (!is_numeric($parametros['idoperacion'])) {
            $parametros['idoperacion'] = null;
        }
        if (!is_numeric($parametros['idoperacionmayorista'])) {
            $parametros['idoperacionmayorista'] = null;
        }
        $conf->synchronizeWithArray($parametros);
        $conf->save();
        return true;
    }

    public function cargarConfFacturacion() {
        $obj = Doctrine::getTable('ConfTallerFacturacion')->find($this->global->Estructura->idestructura);
        return array('datos' => $obj->toArray());
    }

}