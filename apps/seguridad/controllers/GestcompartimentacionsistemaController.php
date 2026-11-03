<?php

/**
 * @name GestcompartimentacionsistemaController - Clase controladora de 
 * compartimentación de sistemas.
 * @package   Acaxia
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestcompartimentacionsistemaController extends ZendExt_Controller_Secure
{

    /**
     * @name init() - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    /**
     * @name gestcompartimentacionsistemaAction() - Función principal de la 
     * clase, encargada de renderiar la vista
     * correspondiente.
     * @return void
     */
    function gestcompartimentacionsistemaAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method gestaccionAction - Función usada para cargar el 
     * árbol de dominios compartimentado.
     */
    public function cargarArbolDominiosAction()
    {
        $arrayDominio = SeguridadECProxy::getInstance()->cargarArbolDominios(
            $this->_request->getPost('node')
        );
        $arrayDominioSinChecked = array();
        foreach ($arrayDominio as $dominio) {
            unset($dominio['checked']);
            $arrayDominioSinChecked[] = $dominio;
        }
        echo json_encode($arrayDominioSinChecked);
    }

    /**
     * @method cargarSistFuncAccAction - Función usada para cargar el 
     * árbol de sistemas hasta nivel de recurso.
     */
    public function cargarSistFuncAccAction()
    {
        $idnodo = $this->_request->getPost('node');
        $idsistema = $this->_request->getPost('idsistema');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $iddominio = $this->_request->getPost('iddominio');
        if ($idnodo == 0) {
            $sistemas = DatSistema::cargarsistema($idnodo);
        } elseif ($idsistema) {
            $sistemas = DatSistema::cargarsistema($idsistema);
        }
        $contador = 0;
        $sistemafunArr = array();
        if (isset($sistemas) && $sistemas->count()) {
            foreach ($sistemas as $valor) {
                $sistemafunArr[$contador]['id'] = $valor->id . '_' . $idnodo;
                $sistemafunArr[$contador]['idsistema'] = $valor->id;
                $sistemafunArr[$contador]['text'] = $valor->text;
                $contador++;
            }
        }
        if ($idsistema) {
            $func = DatFuncionalidad::cargarFuncionalidadesRecursosCompart(
                $idsistema, $iddominio
            );
            if (count($func) > 0) {
                foreach ($func as $valor) {
                    $sistemafunArr[$contador]['id'] = $valor->id . '_' .$idnodo;
                    $sistemafunArr[$contador]['idfuncionalidad'] = $valor->id;
                    $sistemafunArr[$contador]['text'] = $valor->text;
                    $datFunComp = $valor->DatFuncionalidadCompartimentacion;
                    $sistemafunArr[$contador]['checked'] = 
                        (count($datFunComp) > 0) ? true : false;
                    $contador++;
                }
            }
        }
        if ($idfuncionalidad) {
            $func = DatRecurso::cargarRecursosCompartimentacion(
                $idfuncionalidad, $iddominio
            );
            if (count($func) > 0) {
                foreach ($func as $valor) {
                    $sistemafunArr[$contador]['id'] = 
                        $valor->idrecurso . '_' . $idnodo;
                    $sistemafunArr[$contador]['idrecurso'] = $valor->idrecurso;
                    $sistemafunArr[$contador]['text'] = $valor->denominacion;
                    $sistemafunArr[$contador]['leaf'] = true;
                    $datRecComp = $valor->DatRecursoCompartimentacion;
                    $sistemafunArr[$contador]['checked'] = 
                        (count($datRecComp) > 0) ? true : false;
                    $contador++;
                }
            }
        }
        echo json_encode($sistemafunArr);
    }

    /**
     * @method insertarCompartimentacionSistFuncAccAction - Función usada para 
     * gestionar de manera general los sistemas
     * que pueden ser usados para crear roles en los dominios determinados.
     */
    public function insertarCompartimentacionSistFuncAccAction()
    {
        $iddominio = $this->_request->getPost('iddominio');
        //Arreglo de funcionalidades marcadas sin desplegar.
        $arrayPadres = json_decode(
            stripslashes($this->_request->getPost('arrayPadres'))
        );
        //Arreglo de funcionalidades desmarcados sin desplegar.
        $arrayPadresEliminar = json_decode(
            stripslashes($this->_request->getPost('arrayPadresEliminar'))
        );
        //sistemas chekeados.
        $arraySistemas = json_decode(
            stripslashes($this->_request->getPost('arraySistemas'))
        );
        //Arreglo de funcionalidades chequeadas.
        $arrayFuncionalidades = json_decode(
            stripslashes($this->_request->getPost('arrayFuncionalidades'))
        );
        //Arreglo de recursos chequeados.
        $arrayRecursos = json_decode(
            stripslashes($this->_request->getPost('arrayRecursos'))
        );
        //Arreglo de sistemas a eliminar.
        $arraySistEliminar = json_decode(
            stripslashes($this->_request->getPost('arraySistEliminar'))
        );
        //Arreglo de funcionalidades a eliminar.
        $arrayFuncEliminar = json_decode(
            stripslashes($this->_request->getPost('arrayFuncEliminar'))
        );
        //Arreglo de recursos a eliminar.
        $arrayRecursosEl = json_decode(
            stripslashes($this->_request->getPost('arrayAccEliminar'))
        );
        $sistemasIns = array();
        $funcionalidadesIns = array();
        $recursosIns = array();
        $sistemasIns = DatSistemaCompartimentacion::obtenerSistemasByIddominio(
            $iddominio
        );
        $sistemasIns = SegUtil::convertToUnidimensional($sistemasIns, 'id');
        if (count($sistemasIns)) {
            $arraySistemas = array_diff($arraySistemas, $sistemasIns);
            $arraySistEliminar = array_intersect(
                $arraySistEliminar, $sistemasIns
            );
        } else {
            $arraySistEliminar = array();
        }
        $funcionalidadesIns = DatFuncionalidadCompartimentacion::
            obtenerfuncionalidadesByIddominio($iddominio);
        $funcionalidadesIns = SegUtil::convertToUnidimensional(
            $funcionalidadesIns, 'id'
        );
        if (count($funcionalidadesIns)) {
            $arrayFuncionalidades = array_diff(
                $arrayFuncionalidades, $funcionalidadesIns
            );
            $arrayFuncEliminar = array_intersect(
                $arrayFuncEliminar, $funcionalidadesIns
            );
        } else {
            $arrayFuncEliminar = array();
        }
        if (count($arrayPadres)) {
            $arrayRecursosHijas =DatRecurso::cargarRecursosDominioByArrayIdFunc(
                $arrayPadres
            );
            $arrayRecursosHijas = SegUtil::convertToUnidimensional(
                $arrayRecursosHijas, 'id'
            );
            if (count($arrayRecursosHijas)) {
                $arrayRecursos = array_merge(
                    $arrayRecursos, $arrayRecursosHijas
                );
            }
        }
        $recursosIns = DatRecursoCompartimentacion::obtenerRecursosByIddominio(
            $iddominio
        );
        $recursosIns = SegUtil::convertToUnidimensional($recursosIns, 'id');
        if (count($recursosIns)) {
            $arrayRecursos = array_diff($arrayRecursos, $recursosIns);
            $arrayRecursosEl = array_intersect($arrayRecursosEl, $recursosIns);
        } else {
            $arrayRecursosEl = array();
        }
        if (count($arrayPadresEliminar)) {
            $arrayRecHijosEliminar = DatRecurso::cargarRecursosByArrayIdFunc(
                $arrayPadresEliminar
            );
            $arrayRecHijosEliminar = SegUtil::convertToUnidimensional(
                $arrayRecHijosEliminar, 'id'
            );
            if (count($arrayRecHijosEliminar)) {
                $arrayRecursosEl = array_merge(
                    $arrayRecursosEl, $arrayRecHijosEliminar
                );
            }
        }
        if (!count($arraySistemas) 
            && !count($arrayFuncionalidades) 
            && !count($arrayRecursos)
            && !count($arraySistEliminar)
            && !count($arrayFuncEliminar)
            && !count($arrayRecursosEl)
        ) {
            echo "{'success':false}";
        } else {
            $model = new CompartimentacionsistemaModel();
            $model->gestionarSistemasFuncAcc(
                $arraySistemas, 
                $arrayFuncionalidades, 
                $arrayRecursos, 
                $arraySistEliminar, 
                $arrayFuncEliminar,
                $arrayRecursosEl, 
                $iddominio
            );
            echo "{'success':true}";
        }
    }

}