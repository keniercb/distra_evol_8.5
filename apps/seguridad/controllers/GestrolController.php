<?php

/**
 * @name GestrolController - Clase controladora de gestión de roles.
 * @package   seguridad.
 * @copyright UCID.
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestrolController extends SeguridadController
{

    /**
     * @method init - Constructor de la clase.
     * @return void
     */
    function init()
    {
        parent::init();
    }

    /**
     * @method gestrolAction - Acción principal de la clase 
     * encargada de levantar la vista correspondiente.
     * @return void
     */
    public function gestrolAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @author Darien García Tejo.
     * @method insertarAction - Función usada para adicionar un nuevo rol.
     * @return string
     */
    public function insertarAction()
    {
        $denominacion = ($this->_request->getPost('denominacion'));
        $descripcion = $this->_request->getPost('descripcion');
        $abreviatura = $this->_request->getPost('abreviatura');
        $arraySistemas = $this->_request->getPost('arraysist');
        $type = $this->_request->getPost('type');
        $arrayFunc = json_decode(
            stripslashes($this->_request->getPost('arraysistfun'))
        );
        $arraySistemas = json_decode(
            stripslashes($this->_request->getPost('arraysist'))
        );        
        $class = $this->_request->getPost('clase') . 'Model';
        $arrayInsert = array(
            $denominacion, $descripcion, $abreviatura, 
            $arrayFunc, $arraySistemas, $arrayInsert
        );
        //call_user_func_array(array($class, 'insertar'), $arrayConfg);
        call_user_func_array(array($class, 'insertar'), $arrayInsert);
        $this->showMessage("El $type ha sido adicionado satisfactoriamente.");
    }

    /**
     * @author Darien García Tejo.
     * @method modificarAction - Función usada para modificar 
     * el rol seleccionado.
     * @return string
     */
    public function modificarAction()
    {
        $idrol = $this->_request->getPost('idrol');
        $denominacion = $this->_request->getPost('denominacion');
        $abreviatura = $this->_request->getPost('abreviatura');
        $descripcion = $this->_request->getPost('descripcion');
        $type = $this->_request->getPost('type');
        $sistfun = json_decode(
            stripslashes($this->_request->getPost('arraysistfun'))
        );
        $sistemas = json_decode(
            stripslashes($this->_request->getPost('arraysist'))
        );
        $arrayeliminar = json_decode(
            stripslashes($this->_request->getPost('arrayeliminar'))
        );
        $arrayGrupos = ($type == 'rol') 
            ? json_decode(
                stripslashes($this->_request->getPost('arrayGrupo'))
            ) : array();
        $arrayGruposAdd = json_decode(
            stripslashes($this->_request->getPost('arrayGruposAdd'))
        );
        $arrayGruposDel = json_decode(
            stripslashes($this->_request->getPost('arrayGruposDel'))
        );
        $class = $this->_request->getPost('clase') . 'Model';
        $arrayModf = array(
            $idrol, $denominacion, $descripcion, 
            $abreviatura, $sistfun, $sistemas, $arrayeliminar,
            $arrayGrupos, $arrayGruposAdd, $arrayGruposDel
        );
        call_user_func_array(array($class, 'modificar'), $arrayModf);
        $this->showMessage("El $type ha sido modificado satisfactoriamente.");
    }

    /**
     * @author Darien García Tejo.
     * @method eliminarAction - Función usada para eliminar uno o varios roles.
     * @return string
     */
    public function eliminarAction()
    {
        $arrayDel = json_decode(
            stripslashes($this->_request->getPost('arrayRolesElim'))
        );
        $class = $this->_request->getPost('clase') . 'Model';
        $resp = call_user_func(array($class, 'eliminar'), $arrayDel);
        if ($resp == 'Alg&uacute;n(os) rol(es) seleccionado(s) no se puede(n) '
            . 'eliminar debido a que est&aacute;(n) en uso.'
        ) {
            $this->showErrorMessage($resp);
        } else {
            $this->showMessage($resp);
        }
    }

    /**
     * @author Darien García Tejo.
     * @method cargarrolAction - Función usada para cargar el 
     * listado de roles compartimentados por dominio.
     * @ignore Actualizada en la versión 2.0.
     * @return json
     */
    public function cargarrolAction()
    {
        $start = $this->_request->getPost("start");
        $limit = $this->_request->getPost("limit");
        $denominacion = $this->_request->getPost("denrol");
        $type = $this->_request->getPost("type");
        echo json_encode(
            SegRolModel::loadGrid($start, $limit, $denominacion, $type)
        );
    }

    /**
     * @author Darien García Tejo.
     * @method cargarGrupoAction - Función usada para listar 
     * los grupos compartimentados.
     * @return json
     */
    public function cargarGrupoAction()
    {
        $start = $this->_request->getPost("start");
        $limit = $this->_request->getPost("limit");
        $denominacion = $this->_request->getPost("denGrupo");
        $type = $this->_request->getPost("type");
        echo json_encode(
            SegRolModel::loadGrid($start, $limit, $denominacion, $type)
        );
    }

    /**
     * @author Darien García Tejo.
     * @method cargarGridGruposAction - Función usada para listar 
     * los grupos compartimentados.
     * @return json
     */
    public function cargarGridGruposAction()
    {
        $objstart = $this->_request->getPost("start");
        $objlimit = $this->_request->getPost("limit");
        $objidrol = $this->_request->getPost("idrol");
        echo json_encode(
            SegGrupoModel::cargarGridGrupos($objstart, $objlimit, $objidrol)
        );
    }

    /**
     * @method cargarsistemafuncionalidadesAction -
     * Función usada para cargar el árbol de sistemas 
     * hasta nivel de funcionalidades.
     * Este árbol es usado a la hora de adicionar 
     * y modificar los accesos del rol.
     *
     * @ignore Actualizada en la versión 2.0.
     * @return void
     */
    public function cargarsistemafuncionalidadesAction()
    {
        $idnodo = $this->_request->getPost('node');
        $idsistema = $this->_request->getPost('idsistema');
        $rol = $this->_request->getPost('idrol');
        $index = 0;
        $sistFunArr = array();
        if ($idnodo == 0) {
            $sistemas = DatSistema::cargarArbolSistemasCompartimentacion(
                $idnodo
            );
            if (!count($sistemas)) {
                echo json_encode(array());

                return;
            }
        } else {
            $sistemas = DatSistema::cargarArbolSistemasCompartimentacion(
                $idsistema
            );
        }
        if (count($sistemas)) {
            foreach ($sistemas as $valor) {
                $sistFunArr[$index]['id'] = $valor->id . '_' . $idnodo;
                $sistFunArr[$index]['idsistema'] = $valor->id;
                $sistFunArr[$index]['text'] = $valor->text;
                if (DatSistemaSegRolDatFuncionalidad::tieneFuncionalidad(
                    $rol, $valor->id
                ) > 0) {
                    $sistFunArr[$index]['tiene'] = true;
                } else {
                    $sistFunArr[$index]['tiene'] = false;
                }
                if ($valor->leaf) {
                    if (!DatFuncionalidad::obtenerCantFuncRecursosCompart(
                        $valor->id
                    )) {
                        $sistFunArr[$index]['leaf'] = true;
                    } else {
                        $sistFunArr[$index]['leaf'] = false;
                    }
                } else {
                    $sistFunArr[$index]['leaf'] = false;
                }
                $index++;
            }
        }
        if ($idsistema != 0) {
            $funcionalidad = DatFuncionalidad::cargarFuncionalidadesRecursos(
                $idsistema
            );
            if (count($funcionalidad) > 0) {
                foreach ($funcionalidad as $valor) {
                    if (count($valor['DatRecurso']) > 0) {
                        $sistFunArr[$index]['id'] = $valor ['id'].'_' . $idnodo;
                        $sistFunArr[$index]['idfuncionalidad'] = $valor ['id'];
                        $sistFunArr[$index]['text'] = $valor['text'];
                        $sistFunArr[$index]['leaf'] = true;
                        if ($rol) {
                            $chequear = self::chequear(
                                $valor ['id'], $rol, $idsistema
                            );
                            if ($chequear) {
                                $sistFunArr[$index]['checked'] = true;
                            } else {
                                $sistFunArr[$index]['checked'] = false;
                            }
                        } else {
                            $sistFunArr[$index]['checked'] = false;
                        }
                        $index++;
                    }
                }
            }
        }
        echo json_encode($sistFunArr);

        return;
    }

    /**
     * @author Darien García Tejo.
     * @method cargaraccionesquetieneAction - Función usada para listar 
     * todos los recursos a los que un rol
     *         tiene acceso.
     * @return void
     */
    public function cargaraccionesquetieneAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $idrol = $this->_request->getPost('idrol');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $datos = DatRecurso::cargarRecursosPermitidos(
            $idsistema, $idrol, $idfuncionalidad, $limit, $start
        );
        $cantfilas = DatRecurso::cantRecursosPermitidos(
            $idsistema, $idrol, $idfuncionalidad
        );
        echo json_encode(
            array('cantidad_filas' => $cantfilas, 'datos' => $datos)
        );

        return;
    }

    /**
     * @author Darien García Tejo.
     * @method cargaraccionesquenotieneAction - Función usada para listar 
     * todos los recursos registrados a los
     *         que el rol no tiene acceso.
     * @return void
     */
    public function cargaraccionesquenotieneAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $idrol = $this->_request->getPost('idrol');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $acciones = DatRecurso::obtenerRecursosPermitidos(
            $idsistema, $idrol, $idfuncionalidad
        );
        $arrayRecursos = SegUtil::convertToUnidimensional(
            $acciones, 'idrecurso'
        );
        $accionesNoTiene = DatRecurso::obtenerRecursosNoPermitidos(
            $idfuncionalidad, $arrayRecursos, $limit, $start
        );
        $cantidad = DatRecurso::cantidadRecursosNoPermitidos(
            $idfuncionalidad, $arrayRecursos
        );
        echo json_encode(
            array('cantidad_filas' => $cantidad, 'datos' => $accionesNoTiene)
        );
    }

    /**
     * @method cargarsistemafuncAction -
     * Función usada para cargar el árbol de sistemas hasta 
     * nivel de funcionalidad.
     * Esta acción es usada para gestionar a partir de ella 
     * los recursos que tiene o no
     * asignado una funcionalidad.
     *
     * @return void
     */
    public function cargarsistemafuncAction()
    {
        $idnodo = $this->_request->getPost('node');
        $idsistema = ($this->_request->getPost('idsistema') != 'undefined') 
            ? $this->_request->getPost('idsistema') : 0;
        $rol = $this->_request->getPost('idrol');
        $index = 0;
        if ($idnodo == 0) {
            $sistemas = DatSistema::cargarsistemasdelrol($idnodo, $rol);
        } else {
            $sistemas = DatSistema::cargarsistemasdelrol($idsistema, $rol);
        }
        if (count($sistemas)) {
            foreach ($sistemas as $valor) {
                $sistemaArr[$index]['id'] = $valor['id'] . '_' . $idnodo;
                $sistemaArr[$index]['idsistema'] = $valor['id'];
                $sistemaArr[$index]['text'] = $valor['text'];
                $index++;
            }
            if ($idsistema != 0) {
                $funcionalidad = DatSistemaSegRolDatFuncionalidad::
                    cargarsist_funcionalidades($idsistema, $rol);
                if (count($funcionalidad) > 0) {
                    foreach ($funcionalidad as $valor) {
                        if (count($valor['DatRecurso']) > 0) {
                            $sistemaArr[$index]['id'] = $valor->id.'_'. $idnodo;
                            $sistemaArr[$index]['idfuncionalidad'] = $valor->id;
                            $sistemaArr[$index]['text'] = $valor->text;
                            $sistemaArr[$index]['idsistema'] =$valor->idsistema;
                            $sistemaArr[$index]['leaf'] = true;
                            $index++;
                        }
                    }
                }
            }
            echo json_encode($sistemaArr);

            return;
        } else {
            $funcionalidad = DatSistemaSegRolDatFuncionalidad::
                cargarsist_funcionalidades($idsistema, $rol);
            if (count($funcionalidad) > 0) {
                foreach ($funcionalidad as $valor) {
                    $funcionalidadArr[$index]['id'] =$valor->id . '_' . $idnodo;
                    $funcionalidadArr[$index]['idfuncionalidad'] = $valor->id;
                    $funcionalidadArr[$index]['text'] = $valor->text;
                    $funcionalidadArr[$index]['idsistema'] = $valor->idsistema;
                    $funcionalidadArr[$index]['leaf'] = true;
                    $index++;
                }
                echo json_encode($funcionalidadArr);

                return;
            } else {
                $func = $funcionalidad->toArray();
                echo json_encode($func);

                return;
            }
        }
    }

    /**
     * @author Darien García Tejo.
     * @method adicionaraccionAction - Función usada para 
     * adicionar recursos a un rol.
     * @return void
     */
    public function adicionaraccionAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $idrol = $this->_request->getPost('idrol');
        $arrayRecursos = json_decode(
            stripslashes($this->_request->getPost('idrecurso'))
        );
        $arrayRecAcc = DatFuncionalidadDatAccion::
            obtenerAccionesByArrayIdsRecursos($idfuncionalidad, $arrayRecursos);
        foreach ($arrayRecAcc as $recursos) {
            $recurso = new DatSistemaSegRolDatFuncionalidadDatAccion();
            $recurso->idsistema = $idsistema;
            $recurso->idfuncionalidad = $idfuncionalidad;
            $recurso->idrol = $idrol;
            $recurso->idaccion = $recursos['idaccion'];
            $recurso->idrecurso = $recursos['idrecurso'];
            $arrayObjRecursos[] = $recurso;
        }
        $model = new SegRolModel();
        $model->adicionaRecursos($arrayObjRecursos);
        echo "{'tiene':1}";
    }

    /**
     * @method eliminaraccionAction - Función usada 
     * para eliminar recursos de un rol.
     * @return void
     */
    public function eliminaraccionAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $idrol = $this->_request->getPost('idrol');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $arrayRecursos = json_decode(
            stripslashes($this->_request->getPost('idrecurso'))
        );
        DatSistemaSegRolDatFuncionalidadDatAccion::eliminaraccion(
            $idsistema, $idfuncionalidad, $idrol, $arrayRecursos
        );
        echo "{'tiene':1}";
    }

    private static function chequear($id, $rol, $idsistema)
    {
        $arreglo = DatSistemaSegRolDatFuncionalidad::obtenerfunrol(
            $rol, $idsistema
        );
        foreach ($arreglo as $val) {
            if ($val['idfuncionalidad'] == $id) {
                return true;
            }
        }

        return false;
    }

}
