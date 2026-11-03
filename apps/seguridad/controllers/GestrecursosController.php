<?php

/**
 * @name GestrecursosController - Clase controladora de 
 * configuración de recursos.
 * @package   seguridad
 * @copyright UCID
 * @author    Darien García Tejo.
 * @version   2.0-0
 */
class GestrecursosController extends ZendExt_Controller_Secure
{

    /**
     * @method init() - Constructor de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * @method gestrecursosAction() - Función principal de la clase, 
     * encargada de resderiai la vista correspondiente.
     * @return void
     */
    public function gestrecursosAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method cargarsistfuncAction - Función usada para cargar el árbol de 
     * sistemas hasta nivel de funcionalidad.
     * @return json
     */
    public function cargarsistfuncAction()
    {
        $idnodo = $this->_request->getPost('node');
        $idsistema = $this->_request->getPost('idsistema');
        if ($idnodo == 0) {
            $sistemas = DatSistema::cargarsistema($idnodo);
        } else {
            $sistemas = DatSistema::cargarsistema($idsistema);
        }
        $contador = 0;
        $sistemafunArr = array();
        if (count($sistemas) > 0) {
            foreach ($sistemas as $valores => $valor) {
                $sistemafunArr[$contador]['id'] = $valor->id . '_' . $idnodo;
                $sistemafunArr[$contador]['idsistema'] = $valor->id;
                $sistemafunArr[$contador]['text'] = $valor->text;
                $contador++;
            }
        }
        $funcionalidad = DatFuncionalidad::cargarfuncionalidades(
            $idsistema, 0, 0
        );
        if (count($funcionalidad) > 0) {
            foreach ($funcionalidad as $valores => $valor) {
                $sistemafunArr[$contador]['id'] = $valor->id . '_' . $idnodo;
                $sistemafunArr[$contador]['idfuncionalidad'] = $valor->id;
                $sistemafunArr[$contador]['text'] = $valor->text;
                $sistemafunArr[$contador]['leaf'] = true;
                $contador++;
            }
        }
        echo json_encode($sistemafunArr);
    }

    /**
     * @method insertarRecursosAction - Función usada para 
     * adicionar un recurso.
     */
    public function insertarRecursosAction()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $abreviatura = $this->_request->getPost('abreviatura');
        $descripcion = $this->_request->getPost('descripcion');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $arrayNodesChecked = json_decode(
            stripslashes($this->_request->getPost('arrayNodesChecked'))
        );
        $iddominio = $this->global->Perfil->iddominio;
        $objRecurso = new DatRecursoModel();
        $idrecurso = $objRecurso->insertarRecurso(
            $denominacion, 
            $abreviatura, 
            $descripcion, 
            $idfuncionalidad, 
            $iddominio
        );
        foreach ($arrayNodesChecked as $checked) {
            foreach ($checked->acciones as $acciones) {
                $obj = new DatFuncionalidadDatAccion();
                $obj->idaccion = $acciones;
                $obj->idfuncionalidadasociada = 
                    $checked->idfuncionalidadasociada;
                $obj->idrecurso = $idrecurso;
                $obj->save();
            }
        }
        $this->showMessage('El recurso ha sido adicionado satisfactoriamente.');
    }

    /**
     * @method modificarRecursosAction - Función usada 
     * para modificar un recurso.
     */
    public function modificarRecursosAction()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $abreviatura = $this->_request->getPost('abreviatura');
        $descripcion = $this->_request->getPost('descripcion');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $idrecurso = $this->_request->getPost('idrecurso');
        $arrayNodesChecked = json_decode(
            stripslashes($this->_request->getPost('arrayNodesChecked'))
        );
        $arrayNodesElim = json_decode(
            stripslashes($this->_request->getPost('arrayNodesElim'))
        );
        if (count($arrayNodesElim) > 0) {
            $objacc = $arrayNodesElim[0]->acciones;
            DatSistemaSegRolDatFuncionalidadDatAccion::eliminarPermisosRecursos(
                $idrecurso, $idfuncionalidad, $objacc
            );
            DatFuncionalidadDatAccion::eliminarRecursosAccion(
                $idrecurso, $arrayNodesElim[0]->acciones
            );
        }
        $objRecurso = new DatRecursoModel();
        $objRecurso->modificarRecurso(
            $idrecurso, 
            $denominacion, 
            $abreviatura, 
            $descripcion, 
            $idfuncionalidad
        );
        if (count($arrayNodesChecked) > 0) {
            foreach ($arrayNodesChecked as $values) {
                $objFunAsoc = $values->idfuncionalidadasociada;
                $arrayAcc = DatFuncionalidadDatAccion::getArrayAccionesByIdFunc(
                    $objFunAsoc, $idrecurso
                );
                $arrayAcc = SegUtil::convertToUnidimensional(
                    $arrayAcc, 'idaccion'
                );
                $arrayAccInsertar = array_diff(
                    $values->acciones, $arrayAcc
                );
                $arrayAccEliminar = array_diff(
                    $arrayAcc, $values->acciones
                );
                if (count($arrayAccInsertar) > 0) {
                    foreach ($arrayAccInsertar as $acciones) {
                        $obj = new DatFuncionalidadDatAccion();
                        $obj->idaccion = $acciones;
                        $obj->idfuncionalidadasociada = 
                            $values->idfuncionalidadasociada;
                        $obj->idrecurso = $idrecurso;
                        $arrayObjectInsert[] = $obj;
                    }
                }
                if (count($arrayAccEliminar) > 0) {
                    DatFuncionalidadDatAccion::eliminarRecursosFuncAccion(
                        $idrecurso, $objFunAsoc, $arrayAccEliminar
                    );
                }
            }
            $objRecurso->actualizarPermisos(
                $arrayObjectInsert, $idrecurso, $idfuncionalidad
            );
        }
        $this->showMessage('El recurso ha sido modificado satisfactoriamente.');
    }

    /**
     * @method eliminarRecursosAction - Función usada 
     * para eliminar una colección de recursos.
     */
    public function eliminarRecursosAction()
    {
        $arrayRecursosElim = json_decode(
            stripslashes($this->_request->getPost('arrayRecursosElim'))
        );
        $objRecursosModel = new DatRecursoModel();
        $objRecursosModel->eliminarRecursos($arrayRecursosElim);
        $this->showMessage(
            'El(Los) recurso(s) ha(n) sido eliminado(s) satisfactoriamente.'
        );
    }

    /**
     * @method cargargridgruposAction - Función usada para 
     * retornar un listado de recursos.
     */
    public function cargargridgruposAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $denominacion = $this->_request->getPost('buscar');
        $datos = array();
        if ($denominacion) {
            $datos = DatRecurso::buscarRecursos(
                $idfuncionalidad, $denominacion, $limit, $start
            );
            $canfilas = DatRecurso::obtenercantRecursosBuscados(
                $idfuncionalidad, $denominacion
            );
        } else {
            $datos = DatRecurso::buscarRecursos(
                $idfuncionalidad, '', $limit, $start
            );
            $canfilas = DatRecurso::obtenercantRecursosBuscados(
                $idfuncionalidad, ''
            );
        }
        echo json_encode(
            array('cantidad_filas' => $canfilas, 'datos' => $datos)
        );
    }

    /**
     * @method cargarSistFuncAccAction - Función usada para cargar 
     * el árbol de sistemas hasta bivel de acciones.
     */
    public function cargarSistFuncAccAction()
    {
        $obj = new DatRecursoModel();
        echo json_encode($obj->cargarSistFuncAcc($this->_request->getParams()));
    }

}