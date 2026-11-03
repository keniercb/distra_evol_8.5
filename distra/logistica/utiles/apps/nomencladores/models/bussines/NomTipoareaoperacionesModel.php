<?php

class NomTipoareaoperacionesModel extends NomencladoresModel
{

    private $serviciosConfiguracionGeneral;

    public function __construct()
    {
        parent::__construct();
        $this->serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    public function buscar($obj, $arrIdsInsertados, $returnobj = false)
    {
        if ($obj['join']) {
            $var = json_decode($obj['filtro'])[0];
            $query = new Doctrine_Query();
            $query->select('tao.idtipoareaoperaciones, tao.idoperacion, tao.idnomtipoareaentidad')
                ->from('NomTipoareaoperaciones tao')
                ->where('tao.idnomtipoareaentidad =?', $var->idnomtipoareaentidad);            
            $arreglo = array(
                'datos' => $query->offset($obj['start'] ? $obj['start'] : 0
                )->limit($obj['limit'] ? $obj['limit'] : 5)->fetchArray(),
                'cantidad' => $query->count());
            $pos = 0;
            foreach ($arreglo['datos'] as $pos => $respuesta) {
                $result = $this->serviciosConfiguracionGeneral->obtenerOperaciones(
                    $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV, null,
                    $respuesta['idoperacion']
                );
                $arreglo['datos'][$pos]['denominacion'] = $result[0]['denominacion'];
            }
        } else {
            $operaciones = $this->serviciosConfiguracionGeneral->obtenerOperaciones(
                $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV, null, null,
                $obj['start'] ? $obj['start'] : 0, $obj['limit'] ? $obj['limit'] : 5
            );
            $arreglo = array('datos' => $operaciones['data'],'cantidad' => $operaciones['cant']);
        }

        return $arreglo;
    }

    public function insertarNomenclador($params)
    {

        if ($params['operaciones_eliminadas']) {
            $operacionesEliminadas = explode(
                ',', $params['operaciones_eliminadas']
            );
            Doctrine_Query::create()
                ->delete()
                ->from('NomTipoareaoperaciones')
                ->whereIn('idtipoareaoperaciones', $operacionesEliminadas)
                ->execute();
        }
        if ($params['naturalezas_eliminadas']) {
            $naturalezasEliminadas = explode(
                ',', $params['naturalezas_eliminadas']
            );
            Doctrine_Query::create()
                ->delete()
                ->from('NomTipoareatipoproducto')
                ->where("idtipoareaentidad = ?", $params['idtipoareaentidad'])
                ->whereIn('idnaturaleza', $naturalezasEliminadas)
                ->execute();
        }
        if ($params['operaciones_adicionadas']) {
            $operaciones = explode(',', $params['operaciones_adicionadas']);
            $datos = array('idnomtipoareaentidad' => $params['idtipoareaentidad']);
            foreach ($operaciones as $pos => $idoperacion) {
                $datos['idoperacion'] = $idoperacion;
                $operacionesAsociadas = new NomTipoareaoperaciones();
                $operacionesAsociadas->synchronizeWithArray($datos);
                $operacionesAsociadas->save();
            }
        }
        if ($params['naturalezas_adicionadas']) {
            $naturalezas = explode(',', $params['naturalezas_adicionadas']);
            $datos = array('idtipoareaentidad' => $params['idtipoareaentidad']);
            foreach ($naturalezas as $pos => $idnaturaleza) {
                $datos['idnaturaleza'] = $idnaturaleza;
                $naturalezasAsociadas = new NomTipoareatipoproducto();
                $naturalezasAsociadas->synchronizeWithArray($datos);
                $naturalezasAsociadas->save();
            }
        }
        return true;
    }

}
