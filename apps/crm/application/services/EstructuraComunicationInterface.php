<?php

/**
 * EstructuraComunicationInterface
 *
 * Esta clase sirve como capa de abstracción
 * para la comunicación con el subsistema estructura y composicion.
 *
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Alberto Mesa martínez
 * @copyright (c) 2017, XETID
 * @version       1.0
 */
class EstructuraComunicationInterface extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function getEstructura($idpadre)
    {
        try {
            $result = array();
            $data = $this->integrator->metadatos->DameHijosEstructura($idpadre);
            foreach ($data as $dat) {
                if ($dat->idconcepto != 7) {
                    $dat->qtip = $dat->text;
                    $result[] = $dat;
                }
            }
            return $result;
        } catch (Exception $e) {
            return array();
        }
    }

    public function getEstructuraById($id)
    {
        try {
            return $this->integrator->metadatos->DameEstructura($id);
        } catch (Exception $e) {
            return array();
        }
    }

    public function obtenerCargosEstructura($params)
    {
        try {
            $cargos = $this->integrator->metadatos->obtenerCargosEstructura($params['idestructura'], null, false);
            $cargos = $this->formatearResultado($cargos);
            return $cargos;
        } catch (Exception $e) {
            return array();
        }
    }

    public function formatearResultado($cargos)
    {
        $resultado = array();
        foreach ($cargos as $v) {
            $resultado[] = $v['idcargo'];
        }
        return $resultado;
    }

    public function obtenerHijos($idestructura)
    {
        try {
            return $this->integrator->metadatos->buscarHijosEstructurasLineal(
                false, $idestructura, false, false, array(7,6,2,9)
            );
        } catch (Exception $e) {
            throw $e;
        }
    }
}