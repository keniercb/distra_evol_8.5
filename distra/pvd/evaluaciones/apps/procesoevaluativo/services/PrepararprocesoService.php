<?php

class PrepararprocesoService extends ZendExt_Model
{

    public function getProcesoEvalPreparados($limit, $start)
    {
        $objProc = new DatEvalpreprocesoevaluativo();
        $result = $objProc->getProcesoEvalPreparados($limit, $start);

        return ZendExt_ClassStandard::ArrayObject($result);
    }

    public function getCantTotalProcPrep()
    {
        $result = DatEvalpreprocesoevaluativo::GetCantTotal();

        return $result;
    }

    public function getIdEvaluadorProceso($idpersona, $idpreprocesoevaluativo)
    {
        $objAux = new DatEvalprocesoevaluadores();
        $result = $objAux->getIdEvaluadorProceso($idpersona, $idpreprocesoevaluativo);

        return ZendExt_ClassStandard::ArrayObject($result);
    }

    public function adicionarEvaluado($idpersona, $idpreprocesoevaluativo, $idprocesoevaluadores)
    {
        $objAux = new DatEvalprocesoevaluados();
        $objAux->idpersona = $idpersona;
        $objAux->idpreprocesoevaluativo = $idpreprocesoevaluativo;
        $objAux->idprocesoevaluadores = $idprocesoevaluadores;
        $objAuxModel = new DatEvalprocesoevaluadosModel();
        $objAuxModel->Insertar($objAux);

        return true;
    }

    public function eliminarEvaluado($idpersona, $idprocesoevaluadores, $idpreprocesoevaluativo)
    {
        $objAuxModel = new DatEvalprocesoevaluadosModel();
        $aux = $objAuxModel->getTablaEvaluados($idpersona, $idprocesoevaluadores, $idpreprocesoevaluativo);
        $objAuxModel->Eliminar($aux);

        return true;
    }

    public function getScriptFichaProcesoEval()
    {
        $dirJS
            = '<script type="text/javascript" src="/pvd/evaluaciones/procesoevaluativo/views/js/prepararproceso/pFichaProcesoEval.js"></script>';
        $dirCss
            = '<link rel="stylesheet" type="text/css" href="/pvd/evaluaciones/procesoevaluativo/views/css/fichaProcesoEvaluativo.css" />';

        return $dirCss . $dirJS;
    }

    /**
     * Servicio que brinda los ficheros necesarios para la UI de Lista de Periodos evaluativos
     *
     * @return string
     */
    public function getUIPeriodosEvaluativos()
    {
        $dirs = '<script language="javascript" type="text/javascript">importarCSS("/pvd/comun/views/css/TreeGrid.css");</script>';
        $dirs .= '<script language="javascript" type="text/javascript">importarCSS("/pvd/evaluaciones/procesoevaluativo/views/css/iconos.css");</script>';
        $dirs .= '<script type="text/javascript" src="/pvd/comun/views/js/treegrid/TreeGrid.js"></script>';
        $dirs .= '<script type="text/javascript" src="/pvd/evaluaciones/procesoevaluativo/views/js/prepararproceso/ListProcesoEvaluativo.js"></script>';

        return $dirs;
    }

}