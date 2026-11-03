<?php

/**
 * @class      ConfiguracionFarmaciaModel
 * @package    Farmacia
 * @subpackage Configuracion
 * @author     Daniel Arias Espinosa
 * @copyright  XETID
 * @version    1.0
 */
class ConfGeneralModel extends ZendExt_Model
{



    public function __construct()
    {
        parent::ZendExt_Model();

    }

    public function cargardepositos($params)
    {
        $criterio= $params['criterio'] ? $params['criterio'] : false;
        $cEstructura = 'Estructura';
        $cEstructura = $this->global->$cEstructura->idestructura;
        $params['idpadre'] = $cEstructura;
        $sEstrComposicion = ServiciosEstructuraComposicionHelper::__init();
        $result = $sEstrComposicion->obtenerEstructurasNoFormales(
            $this->global->Perfil->certificado, $cEstructura, $criterio, null, null, null
        );

        return $result;
       // print_r($result);die;

        /*



        $conn = Zend_Registry::get('conexion');

        $select = " SELECT eo.*";
        $from = " FROM mod_estructuracomp.dat_estructuraop eo";
        $where = " WHERE eo.idconcepto = 8";

        if (count($params['excluir']) > 0) {

            $excluir = implode(',',$params['excluir']);
            $where .= " and eo.idestructuraop not In ($excluir)";
        }

        if ($params['limit']) {
            $limit = " offset({$params['start']}) limit({$params['limit']})";
        }

        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($select. $from. $where)
            ->fetchAll(PDO::FETCH_ASSOC);
        $datos = $conn->execute($select. $from. $where. $limit)->fetchAll(PDO::FETCH_ASSOC);
        return array($total, $datos);*/
    }


    public function getGuardarDatos($params)
    {
        $cEstructura = 'Estructura';
        $cEstructura = $this->global->$cEstructura->idestructura;
        $sqlDatos = " SELECT conf.idgeneralfm
        FROM mod_logfarmacia.conf_generalfm conf
        WHERE conf.idestructura = {$cEstructura}";

        $conn = Zend_Registry::get('conexion');
        $result = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);

        if (count($result) == 0) {
            $conf = new ConfGeneralFarm();
            $conf->synchronizeWithArray($params['datos']);
            $conf->ptoreposicion = ($params['datos']->ptoreposicion) ? 1 : 0;
            $conf->lotevencido = ($params['datos']->lotevencido) ? 1 : 0;
            $conf->save();
        } else {
            $conf = Doctrine::getTable('ConfGeneralFarm')->find($result[0]['idgeneralfm']);
            $conf->synchronizeWithArray($params['datos']);
            $conf->ptoreposicion = ($params['datos']->ptoreposicion) ? 1 : 0;
            $conf->lotevencido = ($params['datos']->lotevencido) ? 1 : 0;
            $conf->save();
        }

    }

    public function cargaInicial($params)
    {
        $sqlDatos = " SELECT conf.*
        FROM mod_logfarmacia.conf_generalfm conf
        WHERE conf.idestructura = {$params['idestructura']}";
        $conn = Zend_Registry::get('conexion');
        return $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
    }

}
