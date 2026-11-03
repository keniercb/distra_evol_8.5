<?php

/**
 * Class EstructuraController
 * Roberto
 */
class EstructuraController extends SubordinacionController
{
    private $_usuario;
    private $_perfil;

    function init()
    {
        parent::init();
        $this->_perfil = Util::getPerfilGlobal();
        $this->_usuario = $this->_perfil->idusuario;
    }

    /**
     * Controlador de la clase
     */
    function gestionarEstructuraAction()
    {
        $this->view->arrayJs = MetadatosServices::getInstance()->dameUIControllers();
        $this->render();
    }

    /**FUNCIONES PARA EL SERVICIO DE ESTRUCTURA VENTANA*/
    function buscarHijosIUAction()
    {
        /**
         * PARAMETROS POST
         */
        $idEstructura = $this->_request->getPost('node');
        $idRoot = $this->_request->getPost('root');
        $checker = json_decode($this->_request->getPost('checker'));
        $marcar = json_decode($this->_request->getPost('marcar'));
        $includeCargos = json_decode($this->_request->getPost('cargos'));
        $disponibilidad = json_decode($this->_request->getPost('disponibilidad'));

        $excludeConceptos = json_decode(stripslashes($this->_request->getPost('excluirConceptos')));
        $excludeConceptos = (count($excludeConceptos) == 0) ? false : $excludeConceptos;


        $buscar = $this->_getParam('buscar', false);
        $proyecto = $this->_getParam('proyecto', 0);
        $modelEstructura = new EstructuraModel();
        if (!is_numeric($idEstructura) && is_numeric($idRoot)) {

            $resultado = $modelEstructura->dameDatosEstructura($idRoot, $proyecto, true);
            if ($checker) {
                $resultado[0]['checked'] = false;
            }
            echo(Zend_Json::encode($resultado));
        } else {

            if (!is_numeric($idEstructura)) {
                $idEstructura = false;
            }
            $arrayData = $modelEstructura->dameHijosEstructura(
                $idEstructura, false, false, $proyecto, $includeCargos, false, $excludeConceptos, $disponibilidad
            );
            $resultado = array();
            if (count($arrayData) > 0) {
                /**CONSTRUCCION DE LOS ELEMENTOS RESTANTES DE LAS ESTRUCTURAS*/
                foreach ($arrayData as $key => $value) {
                    /**HTML DEL TOOLTIP DE LAS ESTRUCTURAS*/
                    $value['html'] = $this->verDetallesValoresAction(
                        $value['id'], $value['idconcepto'], $value['idproyecto'], true
                    );
                    $resultado [] = $value;
                    /**SI CONTIENEN CHECKBOX*/
                    if ($checker) {
                        /**SI ES UN ARREGLO DE CONCEPTOS A ANADIRLES LOS CHECKBOX*/
                        if (is_array($checker)) {
                            /**SE RECORREN LOS CONCEPTOS*/
                            foreach ($checker as $idconcepto) {
                                /**SI COINCIDE EL CONCEPTO DE LA ESTRUCTURA CON EL SELECCIONADO*/
                                if ($value['idconcepto'] == $idconcepto) {
                                    /**SI SE MARCARAN LOS ELEMENTOS*/
                                    if ($marcar) {
                                        $resultado [$key] = self::marcarElemento($value, $marcar);
                                    } else {
                                        /**SI NO SE MARCARAN LOS ELEMENTOS ENTONCES SE LE ANNADE EL CHECKBOX PERO SIN
                                         * SELECCION*/
                                        $resultado [$key]['checked'] = false;
                                    }
                                    break;
                                }
                            }
                        } else {
                            if ($marcar) {
                                $resultado [$key] = self::marcarElemento($value, $marcar);
                            } else {
                                /**SI NO SE MARCARAN LOS ELEMENTOS ENTONCES SE LE ANNADE EL CHECKBOX PERO SIN
                                 * SELECCION*/
                                $resultado [$key]['checked'] = false;
                            }
                        }
                    }
                    if (is_string($buscar) && $buscar != '') {
                        $have = $modelEstructura->verificarHijosEstructura(
                            $buscar, 0, $value['id'], $value['parent_path'], $includeCargos
                        );
                        if (count($have) > 0) {
                            $resultado[$key]['tiene'] = true;
                            $es = $modelEstructura->verificarHijosEstructura(
                                $buscar, 0, $value['id'], false, $includeCargos
                            );
                            if (count($es) > 0 && $es[0]['es'] == true) {
                                $resultado[$key]['es'] = true;
                            }
                        }
                    }
                }
            }
            echo(Zend_Json::encode($resultado));
        }
    }

    static function marcarElemento($estructura, $marcar)
    {
        /**SI SU VALOR ES BOOLEANO ENTONCES ES TRUE Y SE MARCARAN TODOS*/
        if (is_bool($marcar)) {
            /**SELECCIONAR EL ELEMENTO*/
            $estructura['checked'] = true;
        } else {
            /**SI SU VALOR NO ES BOOLEANO ENTONCES ES QUE ES UN OBJETO QUE
             * CONTIENE IDENTIFICADORES Y CONCEPTOS*/
            $conceptos = $marcar->concepto;
            $ids = $marcar->id;
            /**VARIABLE DE CONTROL DE CHECKEO*/
            $checkear = false;
            /**SI HAY ELEMENTOS A CHECKEAR EN CONCEPTOS*/
            if (count($conceptos) > 0) {
                /**SE RECORREN LOS CONCEPTOS*/
                foreach ($conceptos as $concepto) {
                    /**SI HAY ELEMENTOS A CHECKEAR EN IDS*/
                    if (count($ids) > 0) {
                        /**SE RECORREN LOS IDS*/
                        foreach ($ids as $id) {
                            /**SI LA ESTRUCTURA COINCIDE CON EL CONCEPTO O EL ID SE CHECKEA*/
                            if ($estructura['idconcepto'] == $concepto || $estructura['id'] == $id) {
                                $checkear = true;
                                break;
                            }
                        }
                    } else {
                        /**SI NO TIENE IDS ENTONCES ES QUE TIENE SOLO CONCEPTOS,
                         * SI COINCIDE SOLO CON EL CONCEPTO SE CHECKEA ENTONCES*/
                        if ($estructura['idconcepto'] == $concepto) {
                            $checkear = true;
                            break;
                        }
                    }
                }
            } else {
                /**SI NO TIENE CONCEPTOS ENTONCES ES QUE TIENE SOLO IDS,
                 * SE RECORREN LOS VALORES Y SI COINCIDE SE CHECKEA ENTONCES*/
                foreach ($ids as $id) {
                    if ($estructura['id'] == $id) {
                        $checkear = true;
                        break;
                    }
                }
            }
            /**SE SETEA EL VALOR DEL CHECKER PARA EL ELEMENTO*/
            $estructura['checked'] = $checkear;
        }

        return $estructura;
    }

    /**
     * Devuelve el listado de todos los iconos existentes con sus denominaciones
     * e iconos de una direccion especificada
     *
     * @author    : Ing.Osvaldo Gonzalez
     * @internal  param $icon
     * @return array Retorna un arreglo con todos los iconos existentes
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarIconosAction()
    {
        $tipo = $this->_request->getPost('parametros');
        $model = new NomIconoModel();
        $datos = $model->dameIconosPorTipo($tipo);
        $mostrar = array('datos' => $datos);
        echo(json_encode($mostrar));
    }

    /**
     * Devuelve el listado de todos los proyectos asignados al usuario conectado
     *
     * @author    : Ing.Osvaldo Gonzalez
     * @internal  param $icon
     * @return array Retorna un arreglo con todos los proyectos existentes
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarProyectosAction()
    {
        $datos = DatProyectoModel::dameProyectosPorUsuario($this->_usuario);
        $mostrar = array('datos' => $datos);
        echo(json_encode($mostrar));
    }

    /**
     * Construye el icono fisico de la direccion especificada para mostrarlo
     * en el componente iconcombo
     *
     * @author    : Ing.Osvaldo Gonzalez
     * @internal  param $img
     * @copyright Copyright (c) 2013 xetid
     */
    function getIconAction()
    {
        header('Content-type: image/gif');
        $img = imagecreatefromgif($_GET ['icon']);
        imagepng($img);
    }

    /**
     * Inserta un nuevo cargo en la estructura
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @internal  param   int : $idNomCargo
     * @internal  param    : $cantidad
     * @internal  param    : $idGrupoComplejidad
     * @internal  param    : $idSalario
     * @internal  param    : $idPreparacion
     * @internal  param    : $idPadre
     * @internal  param    : $idConcepto
     * @internal  param    : $idGrado
     * @internal  param    : $idCategoria
     * @return mixed Retorna mensaje correspondiente
     * @copyright Copyright (c) 2013 xetid
     */
    function insertarCargoAction()
    {
        $idNomCargo = (int)$this->_getParam('idnomcargo', "0");
        $cantidad = (int)$this->_getParam('cantidad', "1");
        $idSalario = (int)$this->_getParam('idsalario', "0");
        $idEspecialidadPreparacion = $this->_getParam('idespecialidad_preparacion', 1);
        $idEspecialidadEmpleo = $this->_getParam('idespecialidad_empleo', 1);
        $idPreparacion = (int)$this->_getParam('idpreparacion', "0");
        $idPadre = $this->_request->getPost('idnodo');
        $idConcepto = (int)$this->_getParam('idconcepto', "7");
        $idGrado = $this->_getParam('idgrado');
        $idCategoria = $this->_getParam('idcategocup');
        $idtipoescala = (int)$this->_getParam('idtipoescala', "0");
        $idsector = (int)$this->_getParam('idsector');
        $idfacultado = (int)$this->_getParam('idfacultado');
        $principal = $this->_getParam('principal', 0);
        $jefebrigada = $this->_getParam('jefebrigada', 0);
        $idnivelcargo = (int)$this->_getParam('idnivelcargo');
        $decisorio = $this->_getParam('decisorio');
        $tipoCargo = explode(',', $this->_getParam('idtipo', array()));
        $temporal = (in_array('1', $tipoCargo)) ? 1 : 0;
        $directo = (in_array('2', $tipoCargo)) ? 0 : 1;
        $proyecto = (int)$this->_getParam('proyecto', 0);
        $alias = $this->_getParam('alias');
        $objectFila = new FilaModel();

        $idFila = $objectFila->insertar($idConcepto, $idPadre);
        $objectModel = new DatCargoModel();
        $datos = array(
            'cantidad' => $cantidad, 'idEspecialidad_preparacion' => $idEspecialidadPreparacion,
            'idEspecialidad_empleo' => $idEspecialidadEmpleo, 'idNomCargo' => $idNomCargo,
            'idPreparacion' => $idPreparacion, 'idSalario' => $idSalario, 'temporal' => $temporal,
            'directo' => $directo, 'idCategoria' => $idCategoria, 'idGrado' => $idGrado,
            'idtipoescala' => $idtipoescala, 'idsector' => $idsector,
            'idfacultado' => $idfacultado, 'decisorio' => $decisorio
        , 'idnivelcargo' => $idnivelcargo, 'alias' => $alias
        , 'principal' => $principal,
            'jefebrigada' => $jefebrigada,);

        $objectModel->insertarCargo($idFila, $datos, $proyecto);
        if ($idCategoria != null) {
            $objectModel = new DatCargoCivilModel();
            $objectModel->insertarCargoCivil($idFila, $datos, $proyecto);
        } else {
            $objectModel = new DatCargoMilitarModel();
            $objectModel->insertarCargomilitar($idFila, $datos, $proyecto);
        }
        if ($proyecto != 0) {
            DatProyectoModel::setModificar($proyecto);
            DatProyectoUsuarioModel::actualizar($proyecto, $this->_usuario);
        }
        echo("{'codMsg':1,'mensaje': 'El cargo ha sido adicionado satisfactoriamente.'}");
    }

    /**
     * Modifica un cargo de la estructura
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @internal  param   int : $idNomCargo
     * @internal  param    : $cantidad
     * @internal  param    : $idGrupoComplejidad
     * @internal  param    : $idSalario
     * @internal  param    : $idPreparacion
     * @internal  param    : $idPadre
     * @internal  param    : $idConcepto
     * @internal  param    : $idGrado
     * @internal  param    : $idCategoria
     * @return mixed Retorna mensaje correspondiente
     * @copyright Copyright (c) 2013 xetid
     */
    function modificarCargoAction()
    {

        $proyecto = (int)$this->_getParam('proyecto');
        $idNomCargo = (int)$this->_getParam('idnomcargo', "0");
        $cantidad = (int)$this->_getParam('cantidad', "1");
        $idEspecialidadPreparacion = $this->_getParam('idespecialidad_preparacion', 1);
        $idEspecialidadEmpleo = $this->_getParam('idespecialidad_empleo', 1);
        $idSalario = (int)$this->_getParam('idsalario', "1");
        $idPreparacion = (int)$this->_getParam('idpreparacion', "0");
        $idGrado = $this->_getParam('idgrado', null);
        $idCategoria = $this->_getParam('idcategocup', null);
        $tipoCargo = explode(',', $this->_getParam('idtipo', array()));
        $temporal = (in_array('1', $tipoCargo)) ? 1 : 0;
        $directo = (in_array('2', $tipoCargo)) ? 0 : 1;
        $idtipoescala = (int)$this->_getParam('idtipoescala', "0");
        $idFila = (int)$this->_getParam('idnodo');
        $idsector = (int)$this->_getParam('idsector');
        $idfacultado = (int)$this->_getParam('idfacultado');
        $idnivelcargo = (int)$this->_getParam('idnivelcargo');
        $principal = $this->_getParam('principal', 0);
        $jefebrigada = $this->_getParam('jefebrigada', 0);
        $decisorio = $this->_getParam('decisorio');
        $alias = $this->_getParam('alias');
        $datos = array(
            'cantidad' => $cantidad, 'idEspecialidad_preparacion' => $idEspecialidadPreparacion,
            'idEspecialidad_empleo' => $idEspecialidadEmpleo, 'idNomCargo' => $idNomCargo, 'temporal' => $temporal,
            'directo' => $directo, 'idPreparacion' => $idPreparacion, 'idSalario' => $idSalario,
            'idCategoria' => $idCategoria, 'idGrado' => $idGrado, 'idtipoescala' => $idtipoescala,
            'idsector' => $idsector, 'idfacultado' => $idfacultado, 'decisorio' => $decisorio
        , 'idnivelcargo' => $idnivelcargo, 'alias' => $alias
        , 'principal' => $principal,
            'jefebrigada' => $jefebrigada,);
        $objectModel = new DatCargoModel();
        $objectModel->modificarCargo($idFila, $datos, $proyecto);

        if ($idCategoria != null) {
            $objectModel = new DatCargoCivilModel();
            $objectModel->modificarCargoCivil($idFila, $datos, $proyecto);
        } else {
            $objectModel = new DatCargoMilitarModel();
            $objectModel->modificarCargoMilitar($idFila, $datos, $proyecto);
        }
        if ($proyecto != 0) {
            DatProyectoModel::setModificar($proyecto);
            DatProyectoUsuarioModel::actualizar($proyecto, $this->_usuario);
        }
        echo("{'codMsg':1,'mensaje': 'El cargo ha sido modificado satisfactoriamente.'}");
    }

    /**
     * Busca los hijos de una estructura especificada
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @internal  param   int : $idEstructura
     * @internal  param       : $nOrganica
     * @internal  param array : $buscar
     * @return array Retorna un arreglo con los datos de la estructura hija
     */
    function buscarHijosAction()
    {
        /** @var $idEstructura TYPE_NAME */
        $idEstructura = $this->_request->getPost('node');
        $proyecto = $this->_getParam('proyecto', 0);
        $nOrganica = $this->_getParam('noorganica', false);
        $buscar = $this->_getParam('buscar', false);
        if (!is_numeric($idEstructura)) {
            $idEstructura = false;
        }
        $modelEstructura = new EstructuraModel();
        $arrayData = $modelEstructura->dameHijosEstructura($idEstructura, $nOrganica, false, $proyecto);

        $resultado = array();
        if (count($arrayData) > 0) {
            foreach ($arrayData as $key => $value) {
                $value['html'] = $this->verDetallesValoresAction(
                    $value['id'], $value['idconcepto'], $value['idproyecto'], true
                );
                $resultado [] = $value;
                $ajuste = $this->_request->getPost('ajuste');
                if ($ajuste == 'true' && $value['estado'] != 3) {
                    $resultado [$key]['checked'] = false;
                }
                if (is_string($buscar) && $buscar != '') {
                    $have = $modelEstructura->verificarHijosEstructura(
                        $buscar, $proyecto, $value['id'], $value['parent_path']);
                    if (count($have) > 0) {
                        $resultado[$key]['tiene'] = true;
                        $es = $modelEstructura->verificarHijosEstructura(
                            $buscar, $proyecto, $value['id']
                        );
                        if (count($es) > 0 && $es[0]['es'] == true) {
                            $resultado[$key]['es'] = true;
                        }
                    }
                }
            }
        }

        echo(Zend_Json::encode($resultado));
    }

    /**
     * Busca todos los tipos de medios existentes
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con los datos de los tipos de medio
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarTipoMedioAction()
    {
        $idconcepto = $this->_getParam('idconcepto', 9);
        $restriccion = DatUsuarioConcepto::tieneRestriccionesTipos($idconcepto);
        if (count($restriccion) > 0) {
            $restriccion = $restriccion[0]['tipo'];
        } else {
            $restriccion = false;
        }
        $resultado = NomTipomedio::dameTodos(false, false, 1000, 0, $restriccion);
        echo(Zend_Json::encode(array('datos' => $resultado)));
    }

    /**
     * Busca todas las especialidades hijas de una especialidad dada
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con los datos de las especialidades hijas
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarEspecialidadesAction()
    {
        $busqueda = $this->_getParam('buscar', false);
        $idespecialidad = $this->_request->getPost('node');
        if (!is_numeric($idespecialidad)) {
            $idespecialidad = 0;
        }
        $buscar = (is_string($busqueda) && $busqueda != '') ? 1 : 0;
        $tablas = MetadatosServices::getInstance()->dameArbolEspecialidad($idespecialidad, $buscar, $busqueda);
        echo(json_encode($tablas));
    }

    /**
     * Busca todas las paises del componente dpt
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con los datos
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarPaisesAction()
    {
        $data = MetadatosServices::getInstance()->damePaises();
        echo json_encode(array('datos' => $data));
    }

    /**
     * Busca todos los datos de organos segun el tipo de concepto especificado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @internal  param int $idConcepto
     * @return array Retorna un arreglo con todos los tipos de organos
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarTipoOrganoAction()
    {
        $idConcepto = $this->_request->getPost('idconcepto');
        $data = array();
        if (is_numeric($idConcepto)) {
            $restriccion = DatUsuarioConcepto::tieneRestriccionesTipos($idConcepto);
            if (count($restriccion) > 0) {
                $restriccion = $restriccion[0]['tipo'];
            } else {
                $restriccion = false;
            }
            $data = NomOrgano::dameOrganoPorTipo($idConcepto, false, 8000, 0, $restriccion);
        }
        echo(Zend_Json::encode(array('datos' => $data)));
    }

    function mostrarTipoEscalaAction()
    {
        $model = new NomTipoEscala();
        echo(Zend_Json::encode(array('datos' => $model->dameTodosVisiblesInEscalaSalarial())));
    }

    /**
     * Busca todos los datos de los cargos existentes o filtra los mismos en caso de filtrarlos
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @internal  param $denominacion
     * @internal  param $limit
     * @internal  param $start
     * @return array Retorna un arreglo con todos los datos de los cargos
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarCargosAction()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $idescala = $this->_getParam('idescala', false);
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $modelNomCargo = new NomCargo();
        $total = $modelNomCargo->cantidadInEscala($denominacion, $idescala);
        $tablas = NomCargo::buscarCargoEscala($limit, $start, $denominacion, $idescala);
        $mostrar = array('cant' => $total, 'datos' => $tablas);
        echo(json_encode($mostrar));
    }

    /**
     * Busca todos los datos de los medios existentes
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @internal  param $busqueda
     * @internal  param $idMedio
     * @return array Retorna un arreglo con todos los datos de los medios
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarMediosAction()
    {
        $busqueda = $this->_getParam('buscar', false);
        $idMedio = $this->_request->getPost('node');
        $modelNomEsp = new NomMedioModel();
        $tablas = $modelNomEsp->buscar($idMedio);
        foreach ($tablas as $index => $t) {
            $haveIt = $modelNomEsp->tieneHijos($t['lft'], $t['rgt'], $busqueda);
            $tablas[$index]['tiene'] = $haveIt;
            if ($busqueda) {
                $coincide = explode(strtolower($busqueda), strtolower($t['text']));
                if (count($coincide) > 1) {
                    $tablas[$index]['es'] = true;
                } else {
                    $tablas[$index]['es'] = false;
                }
            } else {
                $tablas[$index]['es'] = false;
            }
        }
        echo(json_encode($tablas));
    }

    /**
     * Busca todos los datos de los grupos de complejidad visibles existentes
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con todos los datos de los grupos de complejidad
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarGrupoComplejidadAction()
    {
        $data = NomGrupocomplejidad::dameTodosVisibles();
        echo(Zend_Json::encode(array('datos' => $data)));
    }

    /**
     * Busca todos los datos de los salarios segun el grupo de complejidad, visibles existentes
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con todos los datos de los salarios
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarSalarioAction()
    {
        $idtipoescala = (int)$this->_getParam('escala', 0);
        $idgrupos = $this->_request->getPost('grupocomplejidad');
        $data = NomSalario::dameTodosVisiblesInEscalaSalarial($idtipoescala, $idgrupos);
        foreach ($data as $index => $row) {
            if ($row['NomEscalaSalarial'][0]['NomTipoEscala']['abreviatura']) {
                $data[$index]['salario'] = $row['NomEscalaSalarial'][0]['NomTipoEscala']['abreviatura'] . ' - ' .
                    $row['NomGrupocomplejidad']['abreviatura'] . ' - ' . $row['salario'];
            }
        }
        echo(Zend_Json::encode(array('datos' => $data)));
    }

    /**
     * Busca todos los datos de los preparaciones visibles existentes
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con todos los datos de las preparaciones
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarPreparacionAction()
    {
        $data = NomPreparacion::dameTodosVisibles();
        echo(Zend_Json::encode(array('datos' => $data)));
    }

    /**
     * Busca todos los datos de los grados visibles existentes
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con todos los datos de los grados
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarGradoAction()
    {
        $data = NomGrado::dameTodosVisibles();
        echo(Zend_Json::encode(array('datos' => $data)));
    }

    /**
     * Busca todos los datos de las categorias visibles existentes
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con todos los datos de las categorias
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarCategoriaAction()
    {
        $data = NomCategocup::dameTodosVisibles();
        echo(Zend_Json::encode(array('cantidad' => count($data), 'datos' => $data)));
    }

    /**
     * Construye el menu correspondiente a un concepto determinado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @internal  param $tipo
     * @return array Retorna un arreglo con todos los datos del menu asociado
     * @copyright Copyright (c) 2013 xetid
     */
    function construirCamposGridAction()
    {
        $tipo = $this->_request->getPost('tipo');
        $identificador = $this->_request->getPost('identificador');
        $proyecto = $this->_request->getPost('proyecto');
        $modelTabla = new TablaModel();
        if (is_numeric($identificador) && $identificador != 0) {
            $arregloRetorno = array('modificado' => EstructuraModel::tieneModificado($identificador, $proyecto));
        } else {
            $arregloRetorno = array();
        }
        $modelPermisos = new DatUsuarioConcepto();
        $permisos = $modelPermisos->obtenerPermisosByConcepto($tipo);
        if (is_array($permisos)) {
            $arregloRetorno [3] ['restringe'] = 1;
            if (count($permisos)) {
                $arregloRetorno [3] ['ver'] = $permisos[0]['ver'];
                $arregloRetorno [3] ['adicionar'] = $permisos[0]['adicionar'];
                $arregloRetorno [3] ['modificar'] = $permisos[0]['modificar'];
                $arregloRetorno [3] ['eliminar'] = $permisos[0]['eliminar'];
                $arregloRetorno [3] ['editar'] = $permisos[0]['editar'];
                $arregloRetorno [3] ['deshacer'] = $permisos[0]['deshacer'];
            } else {
                $arregloRetorno [3] ['ver'] = 0;
                $arregloRetorno [3] ['adicionar'] = 0;
                $arregloRetorno [3] ['modificar'] = 0;
                $arregloRetorno [3] ['eliminar'] = 0;
                $arregloRetorno [3] ['editar'] = 0;
                $arregloRetorno [3] ['deshacer'] = 0;
            }
        } else {
            $arregloRetorno [3] ['restringe'] = 0;
        }
        $arregloRetorno [2] ['menu'] = $modelTabla->buscarConexiones($tipo);
        $arregloRetorno [2] ['escala'] = 0;
        if (is_numeric($identificador)) {
            $model = new EstructuraModel();
            $datos = $model->buscarEntidadPorEstructura(
                $identificador, $this->global->Perfil->iddominio, $proyecto
            );
            $arregloRetorno [2] ['idsector'] = $datos[0]['idsector'];
            $arregloRetorno [2] ['sector'] = $datos[0]['sector'];
            $arregloRetorno [2] ['escala'] = $this->dameEscalaAction($identificador, $proyecto);
            $arregloRetorno [2] ['escala'] = $datos[0]['idtipoescala'];
            $arregloRetorno [2] ['tipoescala'] = $datos[0]['tipoescala'];
        }
        echo(json_encode($arregloRetorno));
    }

    /**
     * Inserta los valores de la estructura exceptuando los cargos
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return mixed Retorna el mensaje correspondiente
     * @copyright Copyright (c) 2013 xetid
     */
    function insertaValoresAction()
    {
        $idConcepto = $this->_request->getPost('idconcepto');
        $idPadre = $this->_request->getPost('idnodo');
        $proyecto = $this->_request->getPost('proyecto');
        if (!is_numeric($idPadre)) {
            $idPadre = false;
        }
        $idespecialidad = $this->_getParam('idespecialidad', 1);
        $idOrgano = (int)$this->_getParam('idorgano', '0');
        $denominacion = $this->_request->getPost('denominacion');
        $alias = $this->_getParam('alias', "");
        $abreviatura = $this->_getParam('abreviatura', "");
        $codigo = (string)$this->_getParam('codigo', '');
        $fax = $this->_getParam('fax', "");
        $icono = (int)$this->_getParam('icono', '0');
        $telefono = $this->_getParam('telefonos', "");
        $idDpt = (int)$this->_getParam('iddpt', '1');
        $direccion = (string)$this->_getParam('direccion', '');
        $objetosocial = (string)$this->_getParam('objetosocial', '');
        $funcioneslegales = (string)$this->_getParam('funcioneslegales', '');
        $correo = $this->_getParam('correo', "");
        $idtipoescala = $this->_getParam('idtipoescala', 0);
        $codigonit = $this->_getParam('codigonit');
        $codigonirc = $this->_getParam('codigonirc');
        $objectFila = new FilaModel();
        $idfila = $objectFila->insertar($idConcepto, $idPadre);
        /*Buscar la existencia del organo seleccionado*/
        if ($this->verificaConcepto($idConcepto)) {
            $model = new NomOrganoModel();
            $organo = $model->obtenerOrgano($idOrgano, $idConcepto, true);
            if (count($organo) == 0) {
                /*si no existe se adiciona un nuevo organo con los mismos elementos*/
                $organo = $model->obtenerOrgano($idOrgano, $idConcepto);
                $data = array(
                    1 => $idConcepto, 2 => array(
                        'denominacion' => $organo[0]['denominacion'], 'abreviatura' => $organo[0]['abreviatura'],
                        'actual' => 1, 'visible' => 1));
                $model->insertar($data, $organo[0]['idorgano']);
            }
        }
        if ($idConcepto <= 4) {
            $objectEstructura = new EstructuraModel();
            $datos = array(
                'idtipoescala' => $idtipoescala, 'idespecialidad' => $idespecialidad, 'idOrgano' => $idOrgano,
                'denominacion' => $denominacion, 'abreviatura' => $abreviatura, 'codigo' => $codigo, 'fax' => $fax,
                'telefono' => $telefono, 'idDpt' => $idDpt, 'direccion' => $direccion, 'correo' => $correo,
                'objetosocial' => $objetosocial, 'funcioneslegales' => $funcioneslegales, 'icono' => $icono
            , 'codigonit' => $codigonit, 'alias' => $alias, 'codigonirc' => $codigonirc);

            $objectEstructura->insertarEstructura($idfila, $idConcepto, $datos, $proyecto);
        } else {
            if ($idConcepto == 9) {
                $objectEstructura = new DatMedioModel();
                $idtipomedio = $this->_getParam('idtipomedio', '0');
                $idnommedio = $this->_getParam('idnommedio', '1');
                $cantidad = $this->_getParam('cantidad', '1');
                if ($icono == '') {
                    $icono = null;
                }
                $datos = array(
                    'idtipomedio' => $idtipomedio, 'idnommedio' => $idnommedio, 'cantidad' => $cantidad,
                    'icono' => $icono);
                $objectEstructura->insertar($idfila, $proyecto, $datos);
            } else {
                $objectEstructuraI = new EstructuraopModel();
                $datos = array(
                    'idOrgano' => $idOrgano, 'denominacion' => $denominacion, 'abreviatura' => $abreviatura,
                    'codigo' => $codigo, 'idespecialidad' => $idespecialidad, 'fax' => $fax,
                    'telefono' => $telefono, 'idDpt' => $idDpt, 'direccion' => $direccion, 'correo' => $correo,
                    'objetosocial' => $objetosocial, 'funcioneslegales' => $funcioneslegales, 'icono' => $icono, 'codigonit' => $codigonit, 'codigonirc' => $codigonirc);
                $objectEstructuraI->insertarEstructuraop($idfila, $idConcepto, $datos, $proyecto);
            }
        }
        if ($proyecto != 0) {
            DatProyectoModel::setModificar($proyecto);
            DatProyectoUsuarioModel::actualizar($proyecto, $this->_usuario);
        }
        echo(json_encode(array("codMsg" => "1", "mensaje" => UtilModel::getMessage('insertar', $idConcepto))));
    }

    /**
     * Modifica los valores de la estructura exceptuando los cargos
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return mixed Retorna el mensaje correspondiente
     * @copyright Copyright (c) 2013 xetid
     */
    function modificarValoresAction()
    {
        $proyecto = $this->_request->getPost('proyecto');
        $idNodo = $this->_request->getPost('idnodo');
        $idConcepto = $this->_request->getPost('idconcepto');
        $idespecialidad = $this->_getParam('idespecialidad', 1);
        $idOrgano = (int)$this->_getParam('idorgano', '0');
        $denominacion = $this->_request->getPost('denominacion');
        $alias = $this->_getParam('alias', "");
        $abreviatura = $this->_getParam('abreviatura', "");
        $codigo = (string)$this->_getParam('codigo', '');
        $fax = $this->_getParam('fax', "");
        $telefono = $this->_getParam('telefonos', "");
        $idDpt = (int)$this->_getParam('iddpt', '1');
        $direccion = (string)$this->_getParam('direccion', '');
        $correo = $this->_getParam('correo', "");
        $objetosocial = (string)$this->_getParam('objetosocial', '');
        $funcioneslegales = (string)$this->_getParam('funcioneslegales', '');
        $idtipomedio = $this->_getParam('idtipomedio', '0');
        $idnommedio = $this->_getParam('idnommedio', '0');
        $cantidad = $this->_getParam('cantidad', '1');
        $icono = (int)$this->_getParam('icono', '0');
        $idtipoescala = $this->_getParam('idtipoescala', 0);
        $idsector = $this->_getParam('idsector', 0);
        $codigonit = $this->_getParam('codigonit');
        $codigonirc = $this->_getParam('codigonirc');
        if ($icono == '') {
            $icono = null;
        }
        $datos = array(
            'idespecialidad' => $idespecialidad, 'idtipoescala' => $idtipoescala, 'idOrgano' => $idOrgano,
            'denominacion' => $denominacion, 'abreviatura' => $abreviatura, 'codigo' => $codigo, 'fax' => $fax,
            'telefono' => $telefono, 'idDpt' => $idDpt, 'direccion' => $direccion, 'correo' => $correo,
            'objetosocial' => $objetosocial, 'funcioneslegales' => $funcioneslegales, 'idtipomedio' => $idtipomedio,
            'idnommedio' => $idnommedio, 'cantidad' => $cantidad, 'icono' => $icono, 'idsector' => $idsector,
            'codigonit' => $codigonit, 'alias' => $alias,'codigonirc' => $codigonirc);
        if ($this->verificaConcepto($idConcepto)) {
            $model = new NomOrganoModel();
            $organo = $model->obtenerOrgano($idOrgano, $idConcepto, true);
            if (count($organo) == 0) {
                /*si no existe se adiciona un nuevo organo con los mismos elementos*/
                $organo = $model->obtenerOrgano($idOrgano, $idConcepto);
                $valores = array();
                $valores[] = false;
                $valores[] = $idConcepto;
                $valores[] = array(
                    'denominacion' => $organo[0]['denominacion'], 'abreviatura' => $organo[0]['abreviatura'],
                    'actual' => 1, 'visible' => 1);
                $model->insertar($valores, $organo[0]['idorgano']);
            }
        }
        if ($idConcepto <= 4) {
            $objectEstructura = new EstructuraModel();

            $objectEstructura->modificarEstructura($idNodo, $idConcepto, $datos, $proyecto);
        } else {
            if ($idConcepto == 9) {
                $objectEstructura = new DatMedioModel();
                $objectEstructura->modificar($idNodo, $proyecto, $datos);
            } else {
                $objectEstructuraI = new EstructuraopModel();
                $objectEstructuraI->modificarEstructura($idNodo, $idConcepto, $datos, $proyecto);
            }
        }
        if ($proyecto != 0) {
            DatProyectoModel::setModificar($proyecto);
            DatProyectoUsuarioModel::actualizar($proyecto, $this->_usuario);
        }
        echo(Zend_Json::encode(
            array("codMsg" => "1", "mensaje" => UtilModel::getMessage('modificar', $idConcepto))
        ));
    }

    /**
     * Elimina los valores de la estructura exceptuando los cargos
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return mixed Retorna el mensaje correspondiente
     * @copyright Copyright (c) 2013 xetid
     */
    function eliminarValoresAction()
    {
        $proyecto = $this->_request->getPost('proyecto');
        $idFila = $this->_request->getPost('idfila');
        $idConcepto = $this->_request->getPost('idconcepto');
        $modelFila = new FilaModel();
        $sepuedeeliminar=$modelFila->eliminarFila($idFila, $proyecto);
        if($sepuedeeliminar){
            if ($proyecto != 0) {
                DatProyectoModel::setModificar($proyecto);
                DatProyectoUsuarioModel::actualizar($proyecto, $this->_usuario);
            }
            echo(Zend_Json::encode(
                array("codMsg" => "1", "mensaje" => UtilModel::getMessage('eliminar', $idConcepto))
            ));
        }else{
            echo(Zend_Json::encode(
                array("codMsg" => "7", "mensaje" => 'La estructura no puede ser eliminada porque está en uso.')
            ));
        }

    }

    /**
     * Carga de los datos de los valores para la construccion del formulario de
     * modificación
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con los datos de la estructura
     * @copyright Copyright (c) 2013 xetid
     */
    function cargarDatosAction()
    {
        $identificador = $this->_request->getPost('identificador');
        $idConcepto = $this->_request->getPost('idconcepto');
        $proyecto = $this->_request->getPost('proyecto');
        $model = new EstructuraModel();
        $resultado = $model->obtenerDatos($identificador, $idConcepto, $proyecto);
        // print_r($resultado);die;
        echo json_encode(array('success' => 'true', 'datos' => array($resultado)));
    }

    /**
     * ACTUALIZACION DEL ORDEN DE UNA ESTRUCTURA EN CASO DE MODIFICACION
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @return mixed Retorna el mensaje correspondiente
     * @copyright Copyright (c) 2013 xetid
     */
    function cambiarOrdenAction()
    {
        $identificador = $this->_request->getPost('nodoid');
        $nextorden = $this->_request->getPost('nextorden');
        $proyecto = $this->_request->getPost('idproyecto');
        $objectModel = new FilaModel();
        if ($proyecto != 0) {
            $objectModel->desplazarOrdenProyecto($identificador, $nextorden,$proyecto);
            DatProyectoModel::setModificar($proyecto);
            DatProyectoUsuarioModel::actualizar($proyecto, $this->_usuario);
        }else{
            $objectModel->desplazarOrden($identificador, $nextorden);
        }
        echo json_encode(array('success' => 'true'));
    }

    /**
     * Mover una estructura
     *
     * @author    : Ing. Roberto León Socarrás
     * @
     * @return mixed Retorna el mensaje correspondiente
     * @copyright Copyright (c) 2013 xetid
     */
    function moverArbolAction()
    {
        // print_r($this->_request->getPost());die;
        $identificador = $this->_request->getPost('nodoid');
        $idpadreoriginal = $this->_request->getPost('idpadreoriginal');
        $idpadrenuevo = $this->_request->getPost('idpadrenuevo');
        $idproyecto = $this->_request->getPost('proyecto');
        $objectModel = new FilaModel();
        $idpadreoriginal = (is_numeric($idpadreoriginal) ? $idpadreoriginal : $identificador);
        $idpadrenuevo = (is_numeric($idpadrenuevo) ? $idpadrenuevo : $identificador);

        $objectModel->moverArbol($identificador, $idpadreoriginal, $idpadrenuevo, $idproyecto);
        echo json_encode(array('success' => 'true'));
    }

    /**
     * Mover una estructura
     *
     * @author    : Ing. Roberto León Socarrás
     * @
     * @return mixed Retorna el mensaje correspondiente
     * @copyright Copyright (c) 2013 xetid
     */
    function buscarSubordinacionVisibleAction()
    {
        //print_r($this->_request->getPost());die;

        $objectModel = new NomSubordinacionModel();
        $result = $objectModel->buscarSubordinacionesVisibles(array(10, 0));

        echo json_encode(array('datos' => $result, 'cant' => count($result)));
    }

    /**
     * GESTION DE LOS RESUMENES DE LAS ESTRUCTURAS
     *
     * @author    : Ing. Osvaldo Gonzalez
     * @return string Retorna el html correspondiente al resumen
     * @copyright Copyright (c) 2013 xetid
     */
    function dameHTMLResumenAction()
    {
        $identificador = $this->_request->getPost('identificador');
        $idproyecto = $this->_request->getPost('idproyecto');
        $htmlPersonal = $this->dameHTMLPersonal($identificador, $idproyecto);
        $htmlMedios = $this->dameHTMLMedios($identificador, $idproyecto);
        if ($htmlPersonal || $htmlMedios) {
            echo(json_encode(array('personal' => $htmlPersonal, 'medio' => $htmlMedios)));
        } else {
            echo 0;
        }
    }

    /**
     * GESTION DE LOS RESUMENES DEL PERSONAL
     *
     * @author    : Ing. Osvaldo Gonzalez
     *
     * @param      $identificador
     * @param      $idproyecto
     *
     * @return string Retorna el html correspondiente al personal
     * @copyright Copyright (c) 2013 xetid
     */
    function dameHTMLPersonal($identificador, $idproyecto = false)
    {
        $objectModel = new FilaModel();
        $datos = $objectModel->dameResumenPorEstructura($identificador, 7, $idproyecto);
        $html = false;
        $space = '&nbsp;&nbsp;';
        $spaceExtendido = $space . $space;
        if ($datos) {
            $civiles = "";
            $subCiviles = 0;
            $militares = "";
            $subMilitares = 0;
            foreach ($datos as $value) {
                if ($value['civil']) {
                    $civiles .= "<tr>";
                    $civiles .= "<td>$spaceExtendido $value[text] </td>";
                    $civiles .= "<td>$value[cantidad]$spaceExtendido $spaceExtendido&nbsp</td>";
                    $civiles .= "</tr>";
                    $subCiviles += $value['cantidad'];
                } else {
                    $militares .= "<tr>";
                    $militares .= "<td>$spaceExtendido $value[text] </td>";
                    $militares .= "<td>$value[cantidad]$spaceExtendido $spaceExtendido&nbsp</td>";
                    $militares .= "</tr>";
                    $subMilitares += $value['cantidad'];
                }
            }
            $total = $subCiviles + $subMilitares;
            $css
                = "
            background: -webkit-gradient(linear, left top, left bottom, from(#b7b7b7), to(#dfe8f6),
              color-stop(0.7, #dfe8f6));
            background: -moz-linear-gradient(top, #b7b7b7, #dfe8f6);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#b7b7b7', endColorstr='#dfe8f6fff');
            -ms-filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr='#b7b7b7', endColorstr='#dfe8f6fff')';
            background: -o-linear-gradient(top, #b7b7b7, #dfe8f6fff);
            height:20;
            ";
            if (count($datos) > 0) {
                $cantidadesDirectos = DatEstructura::dameCantidadCargosDirectos($identificador, $idproyecto);
                $cantidadDirectos = $cantidadesDirectos['directos'];
                $cantidadIndirectos = $cantidadesDirectos['total'] - $cantidadesDirectos['directos'];
                $porcientoDirecto = round(($cantidadDirectos * 100 / $cantidadesDirectos['total']), 1) . '%';
                $porcientoInDirecto = (100 - $porcientoDirecto) . '%';
                $html .= "<table style='font-size: 10' cellspacing = 0>";
                $html .= "<tr>";
                $html
                    .= "<td>
                <b>&nbspDIRECTOS$space <br/>$space $cantidadDirectos$space|$space $porcientoDirecto";
                $html .= "</td>";
                $html
                    .= "<td width='100%'><center>
                <progress text='probando' max='" . $cantidadesDirectos['total'] . "'value='" .
                    $cantidadesDirectos['directos'] . "'></progress>";
                $html .= "</td>";
                $html
                    .= "<td>
                <b>$space INDIRECTOS&nbsp<br/>$spaceExtendido $porcientoInDirecto$space|$space$cantidadIndirectos ";
                $html .= "</td>";
                $html .= "</tr>";
                $html .= "</table>";
                $html .= "<br/><hr>";
//                TABLA DE CONTENIDO
                $html .= "<table style='font-size: 10' cellspacing = 0>";
                /*CARGOS CIVILES*/
                $html .= "<tr>";
                $html .= "<td width='100%' valign='middle' style='height:20'><b>&nbsp;CLASIFICACIONES</b> </td>";
                $html .= "<td><b>CANTIDAD&nbsp;</b> </td>";
                $html .= "</tr>";
                $html .= "</table><hr>";
                $html .= "<table style='font-size: 10' cellspacing = 0>";
                if ($civiles != '') {
                    $html .= "<tr>";
                    $html .= "<td width='100%' valign='middle' style='$css'><b>&nbsp;&nbsp;CARGOS CIVILES</b> </td>";
                    $html .= "<td style='$css'><b><br><br></b> </td>";
                    $html .= "</tr>";
                    $html .= $civiles;
                    $html .= "<tr>";
                    $html
                        .= "<td width='270' valign='middle' style='color: #565656'>
                        <b><br>&nbsp;SUBTOTALES CIVILES</b> </td>";
                    $html .= "<td><b>$subCiviles </b></td>";
                    $html .= "</tr>";
                    $html .= '<tr><td>&nbsp;</td></tr>';
                }
                /*CARGOS MILITARES*/
                if ($militares != '') {
                    $html .= "<tr>";
                    $html .= "<td width='270' valign='middle' style='$css'><b>&nbsp;&nbsp;CARGOS MILITARES</b> </td>";
                    $html .= "<td style='$css'><b><br><br></b> </td>";
                    $html .= "</tr>";
                    $html .= $militares;
                    $html .= "<tr>";
                    $html
                        .= "<td width='270' valign='middle' style='color: #565656'><br>
                        <b>&nbsp;SUBTOTALES MILITARES</b> </td>";
                    $html .= "<td><b>$subMilitares</b> </td>";
                    $html .= "</tr>";
                    $html .= '<tr><td>&nbsp;</td></tr>';
                }
                $html .= "</table><hr>";
                $html .= "<table style='font-size: 10' cellspacing = 0>";
                $html .= "<tr>";
                $html .= "<td width='100%'>&nbsp;<b>TOTAL DEL PERSONAL</b> </td>";
                $html .= "<td style='font-size: 12px'><b>$total$spaceExtendido $spaceExtendido &nbsp</b> </td>";
                $html .= "</tr>";
                $html .= "</table>";
            }

            return $html;
        }

        return false;
    }

    /**
     * GESTION DE LOS RESUMENES DEL MEDIO
     *
     * @author    : Ing. Osvaldo Gonzalez
     *
     * @param $identificador
     * @param $idproyecto
     *
     * @return string Retorna el html correspondiente al medio
     * @copyright Copyright (c) 2013 xetid
     */
    function dameHTMLMedios($identificador, $idproyecto)
    {
        $objectModel = new FilaModel();
        $datosResumen = $objectModel->dameResumenPorEstructura($identificador, 9, $idproyecto);
        $html = false;
        if ($datosResumen) {
            $tipoMedios = '';
            foreach ($datosResumen as $value) {
                $pos = $this->buscarTipoMedio($tipoMedios, $value['tipomedio']);
                $html = "<tr>";
                $html .= "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $value[text] </td>";
                $html .= "<td style='text-align: center'>$value[cantidad] </td>";
                $html .= "</tr>";
                if (!is_bool($pos)) {
                    $total = $tipoMedios[$pos]['total'] + $value['cantidad'];
                    $tipoMedios[$pos]['html'] .= $html;
                    $tipoMedios[$pos]['total'] = $total;
                    $tipoMedios[$pos]['valores'][] = array(
                        'text' => $value['text'], 'cantidad' => $value['cantidad']);
                } else {
                    $tipoMedios [] = array(
                        'tipo' => $value['tipomedio'], 'html' => $html, 'total' => $value['cantidad'],
                        'valores' => array(array('text' => $value['text'], 'cantidad' => $value['cantidad'])));
                }
            }
            $total = 0;
            $tiposHTML = "";
            $css
                = "
            background: -webkit-gradient(linear, left top, left bottom, from(#b7b7b7), to(#dfe8f6),
              color-stop(0.7, #dfe8f6));
            background: -moz-linear-gradient(top, #b7b7b7, #dfe8f6);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#b7b7b7', endColorstr='#dfe8f6fff');
            -ms-filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr='#b7b7b7', endColorstr='#dfe8f6fff')';
            background: -o-linear-gradient(top, #b7b7b7, #dfe8f6fff);
            height:20;
            ";
            foreach ($tipoMedios as $value) {
                $tiposHTML .= "<tr>";
                $tiposHTML .= "<td width='100%' valign='middle' style='$css'><b>&nbsp;&nbsp;$value[tipo]</b> </td>";
                $tiposHTML .= "<td style='$css'><b></b> </td>";
                $tiposHTML .= "</tr>";
                $tiposHTML .= $value[html];
                $tiposHTML .= "<tr>";
                $tiposHTML .= "<td style='color: #565656'><br>&nbsp;<b>SUBTOTAL</b> </td>";
                $tiposHTML .= "<td style='text-align: center'><b> $value[total] </b></td>";
                $tiposHTML .= "</tr>";
                $tiposHTML .= '<tr><td>&nbsp;</td></tr>';
                $total += $value[total];
            }
            if (count($datosResumen) > 0) {
                $html = "<table style='font-size: 10' cellspacing = 0>";
                $html .= "<tr>";
                $html .= "<td width='100%' valign='middle' style=' height:20;'><b>&nbsp;CLASIFICACIONES</b> </td>";
                $html .= "<td><b>CANTIDAD&nbsp;</b> </td>";
                $html .= "</tr>";
                $html
                    .= "<tr>
                            <td><hr></td>
                            <td><hr></td>
                          </tr>";
                $html .= '<tr><td>&nbsp;</td></tr>';
                $html .= $tiposHTML;
                $html
                    .= "<tr>
                            <td><hr></td>
                            <td><hr></td>
                          </tr>";
                $html
                    .= "<tr>
                            <td valign='middle' style='color: #000;'><b>&nbsp;&nbsp;TOTAL DE MEDIOS</b> </td>";
                $html .= "<td valign='middle'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>$total</b> </td>";
                $html .= "</tr>";
                $html .= "</table>";
            }

            return $html;
        }

        return false;
    }

    /**
     * Busca un tipo de medio especifico dentro de una arreglo de estos elementos
     *
     * @author    : Ing. Osvaldo Gonzalez
     *
     * @param $tipos
     * @param $valor
     *
     * @return bool|int Retorna la posicion del tipo de medio o false en caso de no existir
     * @copyright Copyright (c) 2013 xetid
     */
    function buscarTipoMedio($tipos, $valor)
    {
        if (!is_string($tipos)) {
            foreach ($tipos as $index => $value) {
                if ($value[tipo] == $valor) {
                    return $index;
                }
            }
        }

        return false;
    }

    /**
     * Construye el html de los detalles de la estructura segun sus valores
     *
     * @author      : Ing. Javier Limonta
     * @modified    : Ing. Osvaldo Gonzalez
     *
     * @param bool|int $identificador
     * @param bool|int $idConcepto
     * @param bool|int $interna
     * @param int $proyecto
     *
     * @return string Retorna el html de los detalles de la estructura para los tooltips
     *                o vista de detalles
     * @copyright   Copyright (c) 2013 xetid
     */
    function verDetallesValoresAction(
        $identificador = false, $idConcepto = false, $proyecto = 0, $interna = false
    )
    {
        $space = '&nbsp;&nbsp;';
        if (!$interna) {
            $identificador = $this->_request->getPost('identificador');
            $idConcepto = $this->_request->getPost('idconcepto');
        }
        $model = new EstructuraModel();
        $resultado = $model->obtenerDatos($identificador, $idConcepto, $proyecto);
        /*CONSTRUCCION DE LOS HTML PARA LOS TIPOS DE CONCEPTO*/
        $cabecera = "font-size: 11;";
        $caracteres = 0;
        if ($idConcepto < 7 || $idConcepto == 8) {
            $model = new NomOrganoModel();
            $organo = $model->obtenerOrgano($resultado['idorgano'], $idConcepto);
            $tipoOrgano = $organo[0]['denominacion'];
        }
        if (array_search($idConcepto, array(0, 1, 2, 5, 6, 8))) {
            $html = $this->getDetallesOrgano($idConcepto, $interna, $cabecera, $space, $resultado, $tipoOrgano);
        } else {
            if ($idConcepto < 5) {
                list($html, $caracteres) = $this->getDetallesEntidadOrganizacion(
                    $idConcepto, $interna, $cabecera, $space, $resultado, $caracteres, $tipoOrgano
                );
            } else {
                if ($idConcepto == 7) {

                    list($html, $caracteres) = $this->getDetallesCargos(
                        $interna, $cabecera, $space, $resultado, $caracteres
                    );
                }
            }
        }
        if ($interna) {
            return $html;
        }
        /*print_r('<pre>');
        print_r($html);
        die;*/
        echo(json_encode(array('html' => $html, 'cantidad' => count($resultado), 'ancho' => $caracteres)));
    }

    function deshacerCambiosAction()
    {
        $identificador = $this->_request->getPost('identificador');
        $idProyecto = $this->_request->getPost('proyecto');
        $idConcepto = $this->_request->getPost('idConcepto');
        $idEstado = $this->_request->getPost('estado');
        if (DatProyectoModel::deshacerCambios($identificador, $idConcepto, $idProyecto, $idEstado)) {
            echo(Zend_Json::encode(
                array("codMsg" => "1", "mensaje" => "Los datos han sido corregidos a su estado anterior.")
            ));
        } else {
            $msg = "Ha ocurrido un error al deshacer los cambios. Por favor contacte al administrador.";
            echo(Zend_Json::encode(
                array(
                    "codMsg" => "6", "mensaje" => $msg)
            ));
        }
    }

    function dameEscalaAction($id, $proyecto)
    {
        if (!is_numeric($id)) {
            $id = $this->_request->getPost('identificador');
            $proyecto = $this->_request->getPost('proyecto');
        }
        $model = new EstructuraModel();
        $idDominio = $this->_perfil->iddominio;
        $datos = $model->buscarEntidadPorEstructura($id, $idDominio, $proyecto);
        if (is_numeric($id)) {
            return $datos[0]['idtipoescala'];
        } else {
            echo(Zend_Json::encode(array("escala" => $datos[0]['idtipoescala'])));
        }
    }

    /**
     * Descripción del método: Método que permite ralizar un reporte a pdf
     *
     * @autor     : Ing. Osvaldo M. Gonzalez
     * @return instance : devuelve una instancia en pdf del reporte cargos
     * @copyright Copyright (c) 2014 xetid
     */
    function reporteCargosAction()
    {
        
        $datosResumen['idproyecto'] = $this->_getParam('proyecto', 0);
        $datosResumen['formato'] = $this->_getParam('formato', 'A4');
        $datosResumen['civiles'] = $this->_getParam('civiles', 0);
        $datosResumen['militares'] = $this->_getParam('militares', 0);
        $datosResumen['infoProyecto'] = false;
        if ($datosResumen['idproyecto']) {
            $dataProyecto = Doctrine::getTable('DatProyecto')->find($datosResumen['idproyecto']);
            $datosResumen['proyecto'] = $dataProyecto->denominacion;
            $datosResumen['infoProyecto'] = true;
        }
        $idEstructuraComun = array($this->_perfil->idestructuracomun);
        $idestructuras = Zend_Json::decode($this->_getParam("idNodos", false));
        $idestructuras = ($idestructuras) ? $idestructuras : $idEstructuraComun;
        $instance = new ReporteCargos($datosResumen, $idestructuras);

        return $instance->createPDF();
    }

    function reportePlantillaAction()
    {

        $proyecto = json_decode($this->_getParam('proyecto', 0));
        $datosResumen['idproyecto'] = $proyecto;
        $dataA = ucfirst($this->_getParam('aprueba'));
        $dataE = ucfirst($this->_getParam('elabora'));
        $fecha = ucfirst($this->_getParam('fecha'));
        $aprueba = '';
        $elabora = '';
        if ($dataA) {
            $aprueba = $this->integrator->metadatos->dameFirma($dataA);
        }
        if ($dataE) {
            $elabora = $this->integrator->metadatos->dameFirma($dataE);
        }
        $datosResumen['aprueba'] = $aprueba;
        $datosResumen['elabora'] = $elabora;
        $historial = ($this->_getParam('historial') == 'true') ? 1 : 0;
        $datosResumen['formato'] = $this->_getParam('formato', 'A4');
        $datosResumen['ajustar'] = json_decode($this->_getParam('ajustar', false));
        $datosResumen['orientacion'] = $this->_getParam('orientacion', 'P');
        $datosResumen['anexoOrganigrama'] = json_decode($this->_getParam('anexoOrganigrama', false));
        $datosResumen['anexoOrganigrama'] = $datosResumen['anexoOrganigrama'] ? json_decode(
            $this->_getParam('organigrama', false)
        ) : false;
        $datosResumen['hoja'] = json_decode($this->_getParam('hoja', 1));
        $datosResumen['hoja'] = ($datosResumen['hoja']) ? $datosResumen['hoja'] : 1;
        $datosResumen['anexoResumen'] = json_decode($this->_getParam('anexoResumen', false));
        $datosResumen['anexoPlantilla'] = json_decode($this->_getParam('anexoPlantilla', false));
        $datosResumen['militares'] = json_decode($this->_getParam('militares', false));
        $fecha = $this->_getParam('fecha', '');
        $fechaArray = explode('/', $fecha);
        $resolucion = $this->_getParam('resolucion', '');
        //   Util::msg($fecha);
        $datosResumen['idresolucion'] = $this->_getParam('idresolucion', '');
        if ($datosResumen['idresolucion'] == 'GAE') {
            $datosResumen['reales'] = 1;
            $fechaString = Numeric::dateToString($fecha);
            $fechaString = explode('de', $fechaString);
            $fechaString = 'de' . $fechaString[1] . 'de' . $fechaString[2];
            $datosResumen['resolucion']
                = 'Resolución _____/' . $fechaArray[2] . ' de fecha _____' . $fechaString;
        } else {

            $datosResumen['reales'] = 0;
            $datosResolucion = explode('-', $resolucion); //[1]
            $datosFecha = explode('|', $datosResolucion[1]); //[1]
            $fechaResolucion = substr($datosFecha[1], 1, strlen($datosFecha[1]));

            $datosResumen['resolucion'] = $datosFecha[0] . ' de fecha ' . Numeric::dateToString($fecha);
            // Util::msg($datosResumen['resolucion']);
        }
        $datosResumen['civiles'] = 1;
        $datosResumen['infoProyecto'] = false;
        $idEstructuraComun = array($this->_perfil->idestructuracomun);
        $idestructuras = Zend_Json::decode($this->_getParam("idNodos", false));
        $idestructuras = ($idestructuras) ? $idestructuras : $idEstructuraComun;
        $instance = new ReportePlantilla($datosResumen);
        $modelDatEstructura = new DatEstructuraModel();
        $organigrama = $modelDatEstructura->dameDatosOrganigrama($proyecto, $datosResumen);
        $datos = array(
            'organigrama' => $organigrama, 'plantilla' => $idestructuras, 'resumen' => $idestructuras,
            'proyecto' => '');
        if ($proyecto) {
            $dataProyecto = Doctrine::getTable('DatProyecto')->find($proyecto);
            $datos['proyecto'] = $dataProyecto->denominacion;
            $datos['idproyecto'] = $proyecto;
            $datos['historial'] = $historial;
        }
        

        return $instance->createPDF($datos, $aprueba, $elabora);
    }

    function reporteEscalasSalarialesAction()
    {
        $idestructuras = Zend_Json::decode($this->_getParam("idsestructuras", false));
        $proyecto = $this->_getParam('idproyecto');
        $modelDatEstructura = new DatEstructuraModel();
        $datos = $modelDatEstructura->dameEscalasPorProyecto($proyecto,$idestructuras);//print_r($datos);die;
        $instance = new ReporteEscalas($datos);

        return $instance->createPDF();
    }

    /*FUNCIONES PARA LOS REPORTES*/
    /**
     * Descripción del método: Busca el padre de una estructura determinada
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @copyright Copyright (c) 2013 xetid
     */
    function buscarPadreTotalAction()
    {
        $modelEstructura = new EstructuraModel();
        $result = $modelEstructura->dameHijosEstructura(false);
        echo json_encode($result);
    }

    /**
     * Descripción del método: Devuelve los hijos de una estructura determinada
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @copyright Copyright (c) 2013 xetid
     */
    function dameHijosAction()
    {
        $idpadre = $_POST['idpadre'];
        $proyecto = $_POST['idproyecto'];
        $modelEstructura = new EstructuraModel();

        $result = $modelEstructura->dameHijosEstructura($idpadre, false, 0, $proyecto);
        echo json_encode($result);
    }

    /**
     * Descripción del método:Guarda los datos de la estructura para coformar el organigrama
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @copyright Copyright (c) 2013 xetid
     */

     //FUNCION MODIFICADA DONDE SE CAMBIO LA RUTA DE ACCESO A LA CARPETA DE GUARDADO MEDIANTE EL DIRECTOY_SEPARATOR Y SE LE DIO PERMISOS A LA CARPETA
    function guardarOrganigramaAction()
    {
        $nombre = $_POST ['nombre'];
        $datos = $_POST ['xml'];

        $fichero = $nombre.'.org';
        //DIRECTORY_SEPARATOR
        chdir('..');
        $nueva_ruta = getcwd().DIRECTORY_SEPARATOR.'comun'.DIRECTORY_SEPARATOR.'recursos'.DIRECTORY_SEPARATOR;
        $directorio = 'organigramas'.DIRECTORY_SEPARATOR;
        
        if(!is_dir($nueva_ruta.$directorio)){
            mkdir($nueva_ruta.$directorio,0777,false);
        }
        if (file_put_contents($nueva_ruta.$directorio.$nombre.'.org', $datos)) {
            die ("{'codMsg':1,'mensaje': 'El organigrama ha sido guardado satisfactoriamente. '}");
        } else {
            die ("{'codMsg':3,'mensaje': 'Error al guardar organigrama. '}");
        }
    }

    /**
     * Descripcion del metodo: Carga el organigrama deseado de la lista de organigramas
     * guardados
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    function recuperarOrganigramaAction()
    {
        $nombre = $_POST ['nombre'];
        echo json_encode(stripcslashes(file_get_contents('../comun/recursos/organigramas/' . $nombre . '.org')));
    }

    /**
     * Descripcion del metodo: Modifica el nombre del fichero del organigrama fisico salvado
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    function modificarOrganigramaAction()
    {
        $nombre = $_POST ['nombre'];
        $nuevoNombre = $_POST ['nuevoNombre'];
        if (rename(
            '../comun/recursos/organigramas/' . $nombre . '.org',
            '../comun/recursos/organigramas/' . $nuevoNombre . '.org'
        )) {
            die ("{'codMsg':1,'mensaje': 'El organigrama  ha sido modificado satisfactoriamente. '}");
        } else {
            die ("{'codMsg':3,'mensaje': 'Error al modificar nombre del organigrama. '}");
        }
    }

    /**
     * Descripcion del metodo: Elimina el fichero del organigrama existente en el servidor
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    function eliminarOrganigramaAction()
    {
        $nombre = $_POST ['nombre'];
        if (!file_exists('../comun/recursos/organigramas/' . $nombre . '.org')) {
            echo(Zend_Json::encode(
                array("codMsg" => "3", "mensaje" => 'No existe organigrama con ese nombre. ')
            ));

        }
        if (unlink('../comun/recursos/organigramas/' . $nombre . '.org')) {
            echo(Zend_Json::encode(
                array("codMsg" => "1", "mensaje" => 'El organigrama ha sido eliminado satisfactoriamente.')
            ));
        } else {
            echo(Zend_Json::encode(
                array("codMsg" => "3", "mensaje" => 'Error eliminando.')
            ));
        }
    }

    /**
     * Descripcion del metodo: Busca los identificadores de los padres de las estructuras deseadas
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    function buscarIdPadreAction()
    {
        $identificadores = json_decode($_POST ['id']);
        $model = new EstructuraModel();
        $valores = $model->dameIdPadre($identificadores);
        if ($valores) {
            $result = array();
            foreach ($valores as $value) {
                $result[$value[idfila]] = array(idpadre => $value[idpadre]);
            }
            echo json_encode($result);
        } else {
            echo 0;
        }
    }

    /**
     * Descripción del método:Devuelve el organigrama con toda la estructura conformada
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @copyright Copyright (c) 2014 xetid
     */
    function listarOrganigramasAction()
    {
        $inicio = $_POST ['start'];
        $fin = $_POST ['limit'];
        $d = dir('../comun/recursos/organigramas/');
        $archivos = array();
        $row = 0;
        while ($archivo = $d->read()) {
            if ($archivo != "." && $archivo != ".." && $archivo != ".svn") {
                $row++;
                if ($row > $inicio && $row < $inicio + $fin) {
                    $nombre = substr($archivo, 0, -4);
                    $archivos [] = array('idorganigrama' => $row, 'Nombre' => $nombre);
                }
            }
        }
        echo json_encode(array('cant_filas' => $row, 'filas' => ($archivos)));
        die();
    }

    function reporteInformeCambiosAction()
    {
        $proyecto = $this->_getParam('idproyecto');
        $modelDatProyecto = new DatProyectoModel();
        $datosPlantilla = $modelDatProyecto->dameReporteProyecto($proyecto);
        $instance = new ReporteProyecto($datosPlantilla);

        return $instance->createPDF($proyecto);
    }

    function copiarEstructuraAction()
    {
        $idNodo = $_POST['identificador'];
        $idPadre = $_POST['idpadre'];
        $proyecto = $_POST['proyecto'];
        $response = DatEstructuraModel::copiarEstructura($idNodo, $idPadre, $proyecto);
        if ($response) {
            $msg = 'La estructura ha sido duplicada satisfactoriamente.';
            echo(json_encode(array("codMsg" => "1", "mensaje" => $msg)));
        } else {
            $msg = 'Ha ocurrido un error mientras se duplicaba la estructura.';
            echo(json_encode(array("codMsg" => "6", "mensaje" => $msg)));
        }
    }

    function cortarEstructuraAction()
    {
        $idNodo = $_POST['identificador'];
        $idPadre = $_POST['idpadre'];
        $proyecto = $_POST['proyecto'];
        $response = DatEstructuraModel::cortarEstructura($idNodo, $idPadre, $proyecto);
        if ($response) {
            $msg = 'La estructura ha sido reubicada satisfactoriamente.';
            echo(json_encode(array("codMsg" => "1", "mensaje" => $msg)));
        } else {
            $msg = 'Ha ocurrido un error mientras se reubicaba la estructura.';
            echo(json_encode(array("codMsg" => "6", "mensaje" => $msg)));
        }
    }

    /**
     * Carga todas las configuraciones creadas por un usuario para los
     * organigramas de las plantillas de cargos
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarPlantillaOrganigramasAction()
    {
        $idproyecto = $this->_request->getPost('idproyecto');
        $data = DatPlantillaOrg::damePlantillas($this->_usuario, $idproyecto);
        echo(Zend_Json::encode(array('datos' => $data)));
    }

    /**
     * Descripción del método: Gestiona todas las acciones sobre las configuraciones,
     * de las plantillas de cargos
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    function gestionarPlantillasOrgAction()
    {
        $denominacion = $this->_request->getPost('denominacion', '');
        $idplantilla = $this->_request->getPost('idplantillaorg', 0);
        $idproyecto = $this->_request->getPost('idproyecto', 0);
        $ajustes = json_decode(stripslashes($this->_request->getPost('ajustes')));
        $accion = $this->_request->getPost('accion');
        $modelPlantilla = new DatPlantillaOrgModel();
        $flag = false;
        switch ($accion) {
            case 'eliminar';
                $flag = $modelPlantilla->eliminar($idplantilla);
                break;
            case 'insertar';
                $flag = $modelPlantilla->insertar($this->_usuario, $idproyecto, $denominacion, $ajustes);
                break;
            case 'modificar';
                $flag = $modelPlantilla->modificar($idplantilla, $denominacion, $ajustes);
                break;
        }
        $arrayGenero = array(
            'insertar' => 'adicionada', 'modificar' => 'modificada', 'eliminar' => 'eliminada');
        if ($flag) {
            echo(json_encode(
                array(
                    "codMsg" => "1", "mensaje" => 'La configuración del organigrama ha sido ' . $arrayGenero[$accion] .
                    ' satisfactoriamente.')
            ));
        } else {
            echo(json_encode(
                array(
                    "codMsg" => "3",
                    "mensaje" => 'Ha ocurrido un error al ' . $accion . ' la configuración del organigrama.')
            ));
        }
    }

    function buscarConfigPlantillaOrganigramaAction()
    {
        $idplantilla = (int)$this->_getParam('plantilla', 0);
        $modelConfigEstructura = new DatConfigPlantillaOrgModel();
        $datos = $modelConfigEstructura->dameConfigPlantillaOrganigrama($idplantilla);
        echo(Zend_Json::encode($datos));
    }

    /**
     * @param $idConcepto
     * @param $interna
     * @param $cabecera
     * @param $space
     * @param $resultado
     * @param $tipoOrgano
     *
     * @return string
     */
    private function getDetallesOrgano($idConcepto, $interna, $cabecera, $space, $resultado, $tipoOrgano)
    {
        if ($idConcepto == 1) {
            $nameOrgano = 'órgano';
        }
        if ($idConcepto == 5) {
            $nameOrgano = 'órgano interno';
        }
        if ($idConcepto == 2) {
            $nameOrgano = 'agrupación';
        }
        if ($idConcepto == 6) {
            $nameOrgano = 'agrupación interna';
        }
        if ($idConcepto == 8) {
            $nameOrgano = 'estructura no formal';
        }
        $html = "<br>";
        $html .= "<table width='100%' style='font-size: 13' cellspacing = 0>";
        if (!$interna) {
            $html .= "<tr>";
            $html .= "<td style='$cabecera' width=0><b>$space Denominación: $space <br><br></b></td>";
            $html .= "</tr>";
            $html .= "<tr>";
            $html .= "<td>$space $resultado[denominacion]<br><br></td>";
            $html .= "</tr>";
        }
        $html .= "<tr>";
        $html .= "<table width='100%'style='font-size: 13' cellspacing = 0>";
        if ($resultado['abreviatura'] != '') {
            $html .= "<tr>";
            $html .= "<td style='width: 150; $cabecera text-align: 'left';'><b>$space Abreviatura</b> </td>";
            $html .= "<td valign=top style='text-align: 'left';'>:$space $resultado[abreviatura]</td>";
            $html .= "</tr>";
        }
        if ($idConcepto == 8 && $resultado['codigo'] != '') {
            $html .= "<tr>";
            $html .= "<td style='width: 150; $cabecera text-align: 'left';'><b>$space Código</b> </td>";
            $html .= "<td valign=top style='text-align: 'left';'>:$space $resultado[codigo]</td>";
            $html .= "</tr>";
        }
        if ($idConcepto == 5 && $resultado['idespecialidad'] != '') {
            $html .= "<tr>";
            $html .= "<td style='width: 150; $cabecera text-align: 'left';'><b>$space Especialidad</b> </td>";
            $html .= "<td valign=top style='text-align: 'left';'>:$space $resultado[especialidad]</td>";
            $html .= "</tr>";
        }
        $html .= "<tr>";
        $html .= "<td style='$cabecera width: 200; text-align: 'left'><b>$space Tipo de $nameOrgano</b> </td>";
        $html .= "<td valign=top align='left'>:$space $tipoOrgano</td>";
        $html .= "</tr>";
        $html .= "</table>";
        $html .= "</tr>";
        $html .= "</table>";

        return $html;
    }

    /**
     * @param $idConcepto
     * @param $interna
     * @param $cabecera
     * @param $space
     * @param $resultado
     * @param $caracteres
     * @param $tipoOrgano
     *
     * @return array
     */
    private function getDetallesEntidadOrganizacion(
        $idConcepto, $interna, $cabecera, $space, $resultado, $caracteres, $tipoOrgano
    )
    {
        $nameConcepto = 'entidad';
        if ($idConcepto == 4) {
            $nameConcepto = 'organización';
        }
        $html = "<br>";
        $html .= "<table width='100%' style='font-size: 13' cellspacing = 0>";
        if (!$interna) {
            $html .= "<tr>";
            $html .= "<td style='$cabecera' width=0><b>$space Denominación: $space <br><br></b></td>";
            $html .= "</tr>";
            $html .= "<tr>";
            if (strlen($resultado['denominacion']) > $caracteres) {
                $caracteres = strlen($resultado['denominacion']);
            }
            $html .= "<td>$space $resultado[denominacion]<br><br></td>";
            $html .= "</tr>";
        }
        $html .= "<tr>";
        $html .= "<table width='100%'style='font-size: 13'>";
        if ($resultado['alias']) {
            $html .= "<tr>";
            $html .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'><b>$space Alias</b> </td>";
            $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
            if (strlen($resultado['alias']) > $caracteres) {
                $caracteres = strlen($resultado['alias']);
            }
            $html .= "<td valign=top style='text-align: justify;'>$resultado[alias]</td>";
            $html .= "</tr>";
            $html .= "<tr>$space </tr>";
        }
        if ($resultado['abreviatura'] != '') {
            $html .= "<tr >";
            $html
                .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>
                    <b>$space Abreviatura</b> </td>";
            $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
            if (strlen($resultado['abreviatura']) > $caracteres) {
                $caracteres = strlen($resultado['abreviatura']);
            }
            $html .= "<td valign=top style='text-align: 'left';'>$resultado[abreviatura]</td>";
            $html .= "</tr>";
        }
        $html .= "<tr>$space </tr>";
        $html .= "<tr>";
        $html
            .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>
                  <b>$space Tipo de $nameConcepto</b> </td>";
        $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
        if (strlen($tipoOrgano) > $caracteres) {
            $caracteres = count($tipoOrgano);
        }
        $html .= "<td valign=top style='text-align: 'left';'>$tipoOrgano</td>";
        $html .= "</tr>";
        $html .= "<tr>$space </tr>";
        $html .= "<tr>";
        $html
            .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>
                  <b>$space Especialidad</b> </td>";
        $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
        if (strlen($resultado['especialidad']) > $caracteres) {
            $caracteres = strlen($resultado['especialidad']);
        }
        $html .= "<td valign=top style='text-align: 'left';'>$resultado[especialidad]</td>";
        $html .= "</tr>";
        $html .= "<tr>$space </tr>";


        if ($resultado['codigo']) {
            $html .= "<tr>";
            $html .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'><b>$space Código</b> </td>";
            $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
            if (strlen($resultado['codigo']) > $caracteres) {
                $caracteres = strlen($resultado['codigo']);
            }
            $html .= "<td valign=top style='text-align: justify;'>$resultado[codigo]</td>";
            $html .= "</tr>";
            $html .= "<tr>$space </tr>";
        }
        if ($resultado['tipoescala']) {
            $html .= "<tr>";
            $html .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>";
            $html .= "<b>$space Tipo de escala</b></td>";
            $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
            if (strlen($resultado['tipoescala']) > $caracteres) {
                $caracteres = strlen($resultado['tipoescala']);
            }
            $html .= "<td valign=top style='text-align: justify;'>$resultado[tipoescala]</td>";
            $html .= "</tr>";
            $html .= "<tr>$space </tr>";
        }

        if (!$interna) {
            if ($resultado['direccion']) {
                $html .= "<tr>";
                $html
                    .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>
                        <b>$space Dirección</b> </td>";
                $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
                if (strlen($resultado[direccion]) > $caracteres) {
                    $caracteres = strlen($resultado[direccion]);
                }
                $html .= "<td valign=top style='text-align: justify;'>$resultado[direccion]</td>";
                $html .= "</tr>";
                $html .= "<tr>$space </tr>";
            }
            if ($resultado['telefonos']) {
                $html .= "<tr>";
                $html
                    .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>
                      <b>$space Teléfonos</b> </td>";
                $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
                if (strlen($resultado[telefonos]) > $caracteres) {
                    $caracteres = strlen($resultado[telefonos]);
                }
                $html .= "<td valign=top style='text-align: justify;'>$resultado[telefonos]</td>";
                $html .= "</tr>";
                $html .= "<tr>$space </tr>";
            }
            if ($resultado['fax']) {
                $html .= "<tr>";
                $html .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'><b>$space Fax</b> </td>";
                $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
                if (strlen($resultado[fax]) > $caracteres) {
                    $caracteres = strlen($resultado[fax]);
                }
                $html .= "<td valign=top style='text-align: justify;'>$resultado[fax]</td>";
                $html .= "</tr>";
                $html .= "<tr>$space </tr>";
            }
            if ($resultado['objetosocial']) {
                $html .= "<tr>";
                $html
                    .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>
                      <b>$space Objeto Social</b> </td>";
                $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
                if (strlen($resultado[objetosocial]) > $caracteres) {
                    $caracteres = strlen($resultado[objetosocial]);
                }
                $html .= "<td valign=top style='text-align: justify;'>$resultado[objetosocial]</td>";
                $html .= "</tr>";
                $html .= "<tr>$space </tr>";
            }
            if ($resultado['funcioneslegales']) {
                $html .= "<tr>";
                $html
                    .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>
                      <b>$space Funciones Legales</b> </td>";
                $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
                if (strlen($resultado[funcioneslegales]) > $caracteres) {
                    $caracteres = strlen($resultado[funcioneslegales]);
                }
                $html .= "<td valign=top style='text-align: justify;'>$resultado[funcioneslegales]</td>";
                $html .= "</tr>";
                $html .= "<tr>$space </tr>";
            }
            if ($resultado['correo']) {
                $html .= "<tr>";
                $html .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'><b>$space Correo</b> </td>";
                $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
                if (strlen($resultado[correo]) > $caracteres) {
                    $caracteres = strlen($resultado[correo]);
                }
                $html .= "<td valign=top style='text-align: justify;'>$resultado[correo]</td>";
                $html .= "</tr>";
                $html .= "<tr>$space </tr>";
            }
        }
        if ($resultado['ubicaciondpt']) {
            $html .= "<tr>";
            $html
                .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>
                      <b>$space Ubicación</b> </td>";
            $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
            if (strlen($resultado[ubicaciondpt]) > $caracteres) {
                $caracteres = strlen($resultado[ubicaciondpt]);
            }
            $html .= "<td valign=top style='text-align: justify;'>$resultado[ubicaciondpt]</td>";
            $html .= "</tr>";
            $html .= "<tr>$space </tr>";
        }
        if ($resultado['logo'] && ($idConcepto == 3 || $idConcepto == 4)) {
            $icono = $resultado['logo'];
            $html .= "<tr>";
            $html
                .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>
                      <b>$space Logo</b> </td>";
            $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
            $html .= "<tr>";
            $html
                .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>
                        <b>$space </b> </td>";
            $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>$space </b> </td>";
            $html .= "<td valign=top><img src='$icono' width='150px' style='padding-top: -20'/></td>";
            $html .= "</tr>";
            $html .= "<tr>$space </tr>";
        }
        $html .= "</table>";
        $html .= "</tr>";
        $html .= "</table>";

        return array($html, $caracteres);
    }

    /**
     * @param $interna
     * @param $cabecera
     * @param $space
     * @param $resultado
     * @param $caracteres
     *
     * @return array
     */
    private function getDetallesCargos($interna, $cabecera, $space, $resultado, $caracteres)
    {

        $html = "<br>";
        $html .= "<table width='100%' style='font-size: 13' cellspacing = 0>";
        if (!$interna) {
            $html .= "<tr>";
            $html .= "<td style='$cabecera' width=0><b>$space Denominación: $space <br><br></b></td>";
            $html .= "</tr>";
            $html .= "<tr>";
            if (strlen($resultado['denominacion']) > $caracteres) {
                $caracteres = strlen($resultado['denominacion']);
            }
            $html .= "<td>$space $resultado[denominacion]<br><br></td>";
            $html .= "</tr>";
        }
        $html .= "<tr>";
        $html .= "<table width='100%'style='font-size: 13'>";
        if ($resultado['temporal']) {
            $html .= "<tr>";
            $html .= "<td valign=top style='width: 50; $cabecera text-align: 'left';'>$space <span><b>TEMPORAL";
            if (!$resultado['directo']) {
                $html .= "<br><br></span></td></tr>";
            }
        }
        if ($resultado['directo']) {
            if ($resultado['temporal']) {
                $html .= "<tr>";
                $html
                    .= "<td valign=top style='width: 50; $cabecera text-align: 'left';'>$space
                            <span><b>INDIRECTO<br><br></span></td>";
                $html .= "</tr>";
            } ELSE {
                $html .= "$space $space |$space $space ";
                $html .= "INDIRECTO<br><br></span></td></tr>";
            }
        }
        $html .= "<tr>$space </tr>";
        $html .= "<tr>";
        $html .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'><b>$space Cantidad</b> </td>";
        $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
        $html .= "<td valign=top style='text-align: 'left';'>$resultado[cantidad]</td>";
        $html .= "</tr>";
        $html .= "<tr>$space </tr>";
        $html .= "<tr>";
        $html .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'><b>$space Ocupados</b> </td>";
        $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
        $html .= "<td valign=top style='text-align: 'left';'>$resultado[cantidad_real]</td>";
        $html .= "</tr>";
        $html .= "<tr>$space </tr>";
        $html .= "<tr>";
        $html
            .= "<td valign=top style='width: 180; $cabecera text-align: 'left';'>
                    <b>$space Especialidad de preparación</b> </td>";
        $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
        if (strlen($resultado['especialidad_preparacion']) > $caracteres) {
            $caracteres = strlen($resultado['especialidad_preparacion']);
        }
        $html .= "<td valign=top style='text-align: 'left';'>$resultado[especialidad_preparacion]</td>";
        $html .= "</tr>";
        $html .= "<tr>$space </tr>";
        $html .= "<tr>";
        $html
            .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>
                    <b>$space Especialidad de empleo</b> </td>";
        $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
        if (strlen($resultado['especialidad_empleo']) > $caracteres) {
            $caracteres = strlen($resultado['especialidad_empleo']);
        }
        $html .= "<td valign=top style='text-align: 'left';'>$resultado[especialidad_empleo]</td>";
        $html .= "</tr>";
        $html .= "<tr>$space </tr>";
        $html .= "<tr>";
        $html .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'><b>$space Salario</b> </td>";
        $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
        $html .= "<td valign=top style='text-align: 'left';'>$resultado[salario]</td>";
        $html .= "</tr>";
        $html .= "<tr>$space </tr>";
        $model = new NomPreparacion();
        $preparacion = $model->buscar($resultado['idpreparacion']);
        $preparacion = $preparacion[0][denominacion];
        $html .= "<tr>";
        $html
            .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>
                    <b>$space Preparación</b> </td>";
        $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
        if (strlen($preparacion) > $caracteres) {
            $caracteres = count($preparacion);
        }
        $html .= "<td valign=top style='text-align: 'left';'>$preparacion</td>";
        $html .= "</tr>";
        $html .= "<tr>$space </tr>";
        if ($resultado['idcategocup'] != NULL) {
            $categoria = $resultado['categocup'];
            $html .= "<tr>";
            $html
                .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>
                      <b>$space Categoría ocupacional</b> </td>";
            $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
            if (strlen($categoria) > $caracteres) {
                $caracteres = count($categoria);
            }

            $html .= "<td valign=top style='text-align: 'left';'>$categoria</td>";

            $html .= "</tr>";
            $html .= "<tr>$space </tr>";
        } else {
            if ($resultado['idgrado']) {
                $grado = $resultado['grado'];
                $html .= "<tr>";
                $html
                    .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>
                        <b>$space Grado militar</b> </td>";
                $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>:$space </b> </td>";
                if (strlen($grado) > $caracteres) {
                    $caracteres = count($grado);
                }
                $html .= "<td valign=top style='text-align: 'left';'>$grado</td>";
                $html .= "</tr>";
                $html .= "<tr>$space </tr>";
                /*ICONO DEL GRADO*/
                $icono = $resultado['icongrado'];
                $html .= "<tr>";
                $html
                    .= "<td valign=top style='width: 150; $cabecera text-align: 'left';'>
                        <b>$space </b> </td>";
                $html .= "<td valign=top style='width: 0; $cabecera text-align: 'left';'><b>$space </b> </td>";
                $html .= "<td valign=top><img src='$icono' width='64px'/></td>";
                $html .= "</tr>";
                $html .= "<tr>$space </tr>";
            }
        }
        $html .= "</table>";
        $html .= "</tr>";
        $html .= "</table>";

        return array($html, $caracteres);
    }

    /**
     * @param $idConcepto
     *
     * @return bool
     */
    private function verificaConcepto($idConcepto)
    {
        return $idConcepto != 7 && $idConcepto != 9;
    }

    function mostrarFirmaAction()
    {
        $iddominio = $this->global->Perfil->iddominio;
        $datos = NomFirma::dameTodos($iddominio);
        echo(Zend_Json::encode(array('datos' => $datos)));
    }

    function actualizararbolAction()
    {
        $objectEstructura = new EstructuraModel();
        $objectEstructura->Actualizartree();
        echo "{'success':true}";
    }

    function mostrarsectorAction()
    {
        $model = new NomSector();
        echo(Zend_Json::encode(array('datos' => $model->dameTodosVisibles())));
    }

    function mostrarcargosfacultadoAction()
    {
        $model = new NomCargo();
        echo(Zend_Json::encode(array('datos' => $model->buscarFacultados())));
    }

    function mostrarnivelcargoAction()
    {
        $model = new NomNivelCargo();
        echo(Zend_Json::encode(array('datos' => $model->dameTodosVisibles())));
    }
}