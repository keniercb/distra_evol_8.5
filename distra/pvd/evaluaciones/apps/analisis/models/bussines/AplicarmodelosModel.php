<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AplicarmodelosModel
 *
 * @author dominick
 */
class AplicarmodelosModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function aplicarModelosMatematicosByProceso($idpreprocesoevaluativo, $idmodelo) {
        $arrEvaluados = $this->pIntegrator->evaluar->getEvaluadosByProceso($idpreprocesoevaluativo, null, null);
        $arrEvaluadosAux = array();
        foreach ($arrEvaluados as $evaluado) {
            if ($evaluado['estado'] != '2') {   //Filtro  todas las personas excepto las que no han sido evaluadas
                $arrEvaluadosAux[] = $evaluado;
            }
        }
        if ($arrEvaluadosAux) {
            $personas = $this->getDatosPersonasByArrEvaluados($arrEvaluadosAux);
            foreach ($personas as &$persona) {
                $persona['resultado'] = $this->aplicarModelosMatematicosByPersona($persona['idpersonaevaluacion'], $idmodelo);
            }
            return $personas;
        }
        return array();
    }

    public function getIndicadoresEvalTextByPersona($idpersonaevaluacion, $arrIndicadores) {
        $query = Doctrine_Manager::getInstance();
        $sql = " SELECT
            (
                select vn.denom
                from mod_evaluaciones.dat_evalescalarangonumerico rn
                inner join mod_evaluaciones.nom_evalvaloresnumericos vn ON(rn.idescalarangonumerico = vn.idescalarangonumerico)
                where rn.idescala = ie.idescala and vn.idvaloresnumericos = ie.idvalor
            ) as valor, ie.idindicadorplanilla, indt.denom, indt.descripcion, ie.complementotextual
            FROM mod_evaluaciones.dat_evalindicadoresevaluacion ie
            INNER JOIN mod_evaluaciones.dat_evalindicadoresplanilla inp ON(ie.idindicadorplanilla = inp.idindicadorplanilla)
            INNER JOIN mod_evaluaciones.nom_evalindicadortexto indt ON(inp.idindicador = indt.idindicadortexto)
            WHERE ie.idpersonaevaluacion = {$idpersonaevaluacion} and tipo = true and ie.idindicadorplanilla IN ({$arrIndicadores})";
        $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    private function getDatosPersonasByArrEvaluados($arrEvaluados) {
        $arrIdPersonas = array();
        foreach ($arrEvaluados as $evaluado) {
            $arrIdPersonas[] = $evaluado['idrecurso'];
        }
        $personas = $this->pIntegrator->persona->GetPrincipalesDatosPersonaById($arrIdPersonas);
        foreach ($arrEvaluados as &$evaluado) {
            foreach ($personas as $personaAux) {
                if ($evaluado['idrecurso'] == $personaAux->idpersona) {
                    $evaluado['numid'] = $personaAux->numid;
                    $evaluado['nombre'] = $personaAux->nombre;
                    $evaluado['snombre'] = $personaAux->snombre;
                    $evaluado['papel'] = $personaAux->papel;
                    $evaluado['sapel'] = $personaAux->sapel;
                    $evaluado['sexo'] = $personaAux->sexo;
                    $evaluado['idfoto'] = $personaAux->idfoto;
                    $evaluado['extension'] = $personaAux->extension;
                    $evaluado['categoria'] = $personaAux->categoria;
                    $evaluado['fechanacimiento'] = $personaAux->fechanacimiento;
                    $evaluado['entidad'] = $this->global->Estructura->denominacion; //Modificar mas adelante para cojer la entidad segun el evaluado
                    $objAux = $this->pIntegrator->persona->obtenerCargoPersona($evaluado['idrecurso']);
                    $evaluado['cargo'] = $objAux[0]->cargo;
                    /*if ($personaAux->idfoto && $personaAux->foto && $personaAux->extension) {
                        $this->SincronizarImgBDconFicheroServer($personaAux->idfoto, $personaAux->foto, $personaAux->extension);
                    }*/
                }
            }
        }
        return $arrEvaluados;
    }

    private function aplicarModelosMatematicosByPersona($idpersonaevaluacion, $idmodelo) {
        $arrIndicadores = $this->getIndicadoresTextByPersonaAplicar($idpersonaevaluacion);
        $arrHechos = $this->pIntegrator->evaluaciones->getHechosByModelo($idmodelo);
        $result = '';
        foreach ($arrHechos as $hecho) {
            $aux = $this->pIntegrator->comun->EvaluarExpresionMatematica($hecho['idexpresionmatematica'], $arrIndicadores);
            if ($aux->codigo == 1 && $aux->booleana == 1 && $aux->valor == 1) {
                $result = $hecho['denom'];
                break;
            }
        }
        if ($result == '') {
            $result = 'No conocido';
        }
        return $result;
    }

    public function getIndicadoresTextByPersonaAplicar($idpersonaevaluacion) {
        $query = Doctrine_Manager::getInstance();
        $sql = "SELECT inp.idindicador,
            (
                select vn.denom
                from mod_evaluaciones.dat_evalescalarangonumerico rn
                inner join mod_evaluaciones.nom_evalvaloresnumericos vn ON(rn.idescalarangonumerico = vn.idescalarangonumerico)
                where rn.idescala = ie.idescala and vn.idvaloresnumericos = ie.idvalor
            ) as valor
            FROM mod_evaluaciones.dat_evalindicadoresevaluacion ie
            INNER JOIN mod_evaluaciones.dat_evalindicadoresplanilla inp ON(ie.idindicadorplanilla = inp.idindicadorplanilla)
            INNER JOIN mod_evaluaciones.nom_evalindicadortexto indt ON(inp.idindicador = indt.idindicadortexto)
            INNER JOIN mod_evaluaciones.dat_evalescala dee ON(ie.idescala = dee.idescala and dee.tipoescala = 0)
            WHERE ie.idpersonaevaluacion = {$idpersonaevaluacion} and inp.tipo = true";
        $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function cargarModelosMatematicos($idpreprocesoevaluativo, $idmodelo) {
        $DatEvalpersonaevaluacionfinal = new DatEvalpersonaevaluacionfinal();
        $arrEvaluados = $DatEvalpersonaevaluacionfinal->getResultadosByProcesoModelo($idpreprocesoevaluativo, $idmodelo);
        if ($arrEvaluados) {
            foreach ($arrEvaluados as $evaluado) {
                $arrIdPersonas[] = $evaluado['idrecurso'];

            }
            $personas = $this->pIntegrator->persona->GetPrincipalesDatosPersonaById($arrIdPersonas);

            foreach ($arrEvaluados as &$evaluado) {
                foreach ($personas as $personaAux) {
                    if ($evaluado['idrecurso'] == $personaAux->idpersona) {
                        $evaluado['numid'] = $personaAux->numid;
                        $evaluado['nombre'] = $personaAux->nombre;
                        $evaluado['snombre'] = $personaAux->snombre;
                        $evaluado['papel'] = $personaAux->papel;
                        $evaluado['sapel'] = $personaAux->sapel;
                        $evaluado['sexo'] = $personaAux->sexo;
                        $evaluado['idfoto'] = $personaAux->idfoto;
                        $evaluado['extension'] = $personaAux->extension;
                        $evaluado['categoria'] = $personaAux->categoria;
                        $varAux = split("-", $personaAux->fechanacimiento);
                        $evaluado['edad'] = date('Y') - $varAux[0];
                        $evaluado['fechanacimiento'] = $personaAux->fechanacimiento;
                        $evaluado['entidad'] = $this->global->Estructura->denominacion; //Modificar mas adelante para cojer la entidad segun el evaluado
                        $objAux = $this->pIntegrator->persona->obtenerCargoPersona($evaluado['idrecurso']);
                        $evaluado['cargo'] = $objAux[0]->cargo;
                        /*if ($personaAux->idfoto && $personaAux->foto && $personaAux->extension) {
                            $this->SincronizarImgBDconFicheroServer($personaAux->idfoto, $personaAux->foto, $personaAux->extension);
                        }*/
                    }
                }
            }
        }
        return $arrEvaluados;
    }


}