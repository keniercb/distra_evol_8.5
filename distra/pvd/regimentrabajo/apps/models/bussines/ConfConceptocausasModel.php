<?php

class ConfConceptocausasModel extends ZendExt_Model
{
    protected $ConfConceptocausas;
    protected $ConfTipocontratosituacion;
    protected $NomCausa;

    function __construct()
    {
        $this->ConfConceptocausas = new ConfConceptocausas();
        $this->ConfTipocontratosituacion = new ConfTipocontratosituacion();
        $this->NomCausa = new NomCausa();
    }

    public function setUp()
    {
        parent::ZendExt_Model();

    }

    public function getlistadoCausas()
    {
        $result = $this->NomCausa->GetLeafs();
        $causasbyconcepto = $this->ConfConceptocausas->getCausas();
        if (!empty($causasbyconcepto)) {
            foreach ($result as $key => $causa) {
                foreach ($causasbyconcepto as $k => $causabyconc) {
                    if ($causa['idcausa'] == $causabyconc['idcausa']) {
                        $result[$key]['check'] = 1;
                        break;
                    } else
                        $result[$key]['check'] = 0;
                }
            }
        }
        return $result;
    }

    public function addConceptocausas($idscausas)
    {
        $this->ConfConceptocausas->DelCausa();
        foreach ($idscausas as $v) {
            $obj = new ConfConceptocausas();
            $obj->idcausa = $v;
            $obj->save();
        }
        return true;
    }

    public function gettipocontrato($idconcepto)
    {
        $tipocontrato = $this->ConfTipocontratosituacion->gettipocontrato();
        $tipocontratsit = $this->ConfTipocontratosituacion->gettipocontratosituacionbyconcepto($idconcepto);
        if (!empty($tipocontratsit)) {
            foreach ($tipocontrato as $key => $val) {
                foreach ($tipocontratsit as $k => $v) {
                    if ($val['idtipocontrato'] == $v['idtipocontrato']) {
                        $tipocontrato[$key]['check'] = 1;
                        break;
                    } else
                        $tipocontrato[$key]['check'] = 0;
                }
            }
        }
        return $tipocontrato;
    }


    public function getsituacion($idconcepto)
    {
        $situacion = $this->ConfTipocontratosituacion->getsituacion();
        $tipocontratsit = $this->ConfTipocontratosituacion->gettipocontratosituacionbyconcepto($idconcepto);
        if (!empty($tipocontratsit)) {
            foreach ($situacion as $key => $val) {
                foreach ($tipocontratsit as $k => $v) {
                    if ($val['idsituacion'] == $v['idsituacion']) {
                        $situacion[$key]['check'] = 1;
                        break;
                    } else
                        $situacion[$key]['check'] = 0;
                }
            }
        }
        return $situacion;
    }

    public function addTipocontratoSituacion($idconcepto, $tiposcontratos, $situaciones)
    {
        if (!empty($idconcepto)) {
            $this->ConfTipocontratosituacion->Delete($idconcepto);
            foreach ($tiposcontratos as $v) {
                if (!empty($situaciones)) {
                    foreach ($situaciones as $d) {
                        $obj = new ConfTipocontratosituacion();
                        $obj->idconcepto = $idconcepto;
                        $obj->idtipocontrato = $v;
                        $obj->idsituacion = $d;
                        $obj->save();
                    }
                } else {
                    $obj = new ConfTipocontratosituacion();
                    $obj->idconcepto = $idconcepto;
                    $obj->idtipocontrato = $v;
                    $obj->save();
                }
            }
        }
        return true;
    }

}
