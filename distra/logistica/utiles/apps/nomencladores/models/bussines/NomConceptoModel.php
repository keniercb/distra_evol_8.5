<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of NomConceptoModel
 *
 * @author administrador
 */
class NomConceptoModel extends NomencladoresModel
{
    private $serviciosConfiguracionGeneral;
    //put your code here
    public function __construct()
    {
        parent::__construct();
        $this->serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    public function buscar($obj, $arrIdsInsertados, $returnobj = false)
    {
        $resultados = parent::buscar($obj, $arrIdsInsertados, $returnobj);
        $cacheConceptos = array();
        foreach ($resultados['datos'] as &$conceptos) {
            if (!array_key_exists($conceptos['idnomoperaciones'], $cacheConceptos)) {
                $cacheConceptos[$conceptos['idnomoperaciones']] = ServiciosConfiguracionGeneralHelper::__init()
                    ->obtenerOperaciones($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV, null,
                        $conceptos['idnomoperaciones']);
            }
            if (!array_key_exists($conceptos['iddoc'], $cacheConceptos)) {
                $cacheConceptos[$conceptos['iddoc']] = ServiciosConfiguracionGeneralHelper::__init()
                    ->getTipoDocumentoById($conceptos['iddoc']);
            }
            $conceptos['denomoperaciones'] = $cacheConceptos[$conceptos['idnomoperaciones']][0]['denominacion'];
            $conceptos['denomtipodoc'] = $cacheConceptos[$conceptos['iddoc']]->denominacion;
        }
        return $resultados;
    }

    public function insertarNomenclador($array, $returnobj = false)
    {
        $obj = parent::insertarNomenclador($array, true);

        if (is_object($obj)) {
            if ($array['adicionados']) {
                $adicionados = explode(',', $array['adicionados']);
                foreach ($adicionados as $value) {
                    $o = new NomConcepto();
                    $o->iddoc = $value['iddoc'];
                    $o->idnomoperaciones = $value['idnomoperaciones'];
                    $obj->NomTipotransfinternaarea[] = $o;
                    unset($o);
                }
            }
            $obj->save();
            return true;
        }
        return false;
    }

    public function modificarNomenclador($array, $returnobj = false)
    {
        $obj = parent::modificarNomenclador($array, true);
        if ($obj != -1 && $obj != -2) {
            $obj->save();
            if ($array['eliminados']) {
                Doctrine_Query::create()
                    ->delete()
                    ->from('NomConcepto')
                    ->where(
                        "idnomconcepto = ?", array($array['idnomconcepto'])
                    )
                    ->execute();
            }

            if ($array['adicionados']) {
                $adicionados = explode(',', $array['adicionados']);
                foreach ($adicionados as $value) {
                    $o = new NomConcepto();
                    $o->iddoc = $value['idoc'];
                    $o->idnomoperaciones = value['idnomoperaciones'];
                    $obj->NomConcepto[] = $o;
                    unset($o);
                }

            }
            $obj->save();
            return true;
        } else {
            return $obj;
        }
    }

    public function habilitarDesabiltarEntidad($array)
    {
        $arr = (!is_array($array['idnom'])) ? json_decode(
            stripslashes($array['idnom'])
        ) : $array['idnom'];
        $qNomConcepto = Doctrine_Query::create()->select('nc.idnomconcepto')
            ->from('NomConcepto nc')
            ->whereIn('nc.idnomconcepto', $arr)
            ->fetchArray();
        $arrIdNomConcepto = array();
        foreach ($qNomConcepto as $nNomConcepto) {
            array_push($arrIdNomConcepto, $nNomConcepto['idnomconcepto']);
        }
        if ($array['habilitarentidad'] == 1) {
            parent::habilitarDesabiltarEntidad(
                array(
                    'idnom' => $arrIdNomConcepto,
                    'habilitarentidad' => 1,
                    'modelo' => 'NomConcepto',
                    'pkid' => 'idnomconcepto'
                )
            );
        }
        return parent::habilitarDesabiltarEntidad($array);
    }

    public function getQueryConceptoByParams($query, $aliasinterno, $aliasNomCon)
    {
        return $query->addselect("{$aliasNomCon}.denominacion as denominacion")
            ->leftJoin("{$aliasinterno}.NomConcepto {$aliasNomCon}")
            ->leftJoin("{$aliasNomCon}.DatConceptoEntidad dce");
    }
}
