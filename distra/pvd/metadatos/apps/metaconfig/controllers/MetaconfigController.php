<?php

/**
 * Clase controladora encargada de la gestion de los permisos de los conceptos existentes
 * para la gestion de los restantes conceptos en la estructura
 *
 * @author    : Ing.Osvaldo Gonzalez
 * @copyright Copyright (c) 2013 xetid
 */
class MetaconfigController extends NomencladorController
{

    /**
     * @var
     */
    private $perfil;
    /**
     * @var
     */
    private $usuario;

    /**
     *
     */
    function init()
    {

        parent::init();
        $this->perfil = Util::getPerfilGlobal();
        $this->usuario = $this->perfil->idusuario;
    }

    /**
     *
     */
    function metaConfigAction()
    {
        $this->render();
    }

    /**
     * Inserta un nuevo permiso a un concepto especificado
     *
     * @author    : Ing.Osvaldo Gonzalez
     * @internal  param $idPadre
     * @internal  param $idHijo
     * @return bool Retorna 1/0 en caso de realizar correctamente la inserción
     * @copyright Copyright (c) 2013 xetid
     */
    function insertarPermisosAction()
    {
        $idPadre = $this->_request->getPost('idpadre');
        $idHijo = $this->_request->getPost('idhijo');
        $model = new NomRelacionModel();
        if ($model->insertar($idPadre, $idHijo)) {
            echo("{'codMsg':1,'mensaje': 'El permiso ha sido adicionado satisfactoriamente.'}");
        } else {
            echo("{'codMsg':6,'mensaje': 'Ha ocurrido un error al adicionar el permiso.'}");
        }
    }

    /**
     * Elimina un permiso existente en un concepto especificado
     *
     * @author    : Ing.Osvaldo Gonzalez
     * @internal  param $idRelacion
     * @return bool Retorna 1/0 en caso de realizar correctamente la eliminación
     * @copyright Copyright (c) 2013 xetid
     */
    function eliminarPermisosAction()
    {
        $idRelacion = $this->_request->getPost('idrelacion');
        $model = new NomRelacionModel();
        if ($model->eliminar($idRelacion)) {
            echo("{'codMsg':1,'mensaje': 'El permiso ha sido eliminado satisfactoriamente.'}");
        } else {
            echo("{'codMsg':6,'mensaje': 'Ha ocurrido un error al eliminar el permiso.'}");
        }
    }

    /**
     * Obtiene la lista de todos los conceptos existentes
     *
     * @author    : Ing.Osvaldo Gonzalez
     * @return array Retorna un arreglo con todos los datos de los conceptos
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarConceptosAction()
    {
        $idFuncionalidad = $this->_request->getPost('idfuncionalidad');
        
        $datos = NomConcepto::dameTodos();
        $total = count($datos) - 1;

        $global = ZendExt_GlobalConcept::getInstance();
        $identidad = $global->Estructura->idestructura;
        $certificado = Zend_Registry::get('session')->certificado;
        $integrator = ZendExt_IoC::getInstance();
        $acciones = $integrator->seguridad->ObtenerAcciones($certificado, $idFuncionalidad, $identidad);

        $accionesByAbreviatura = [];
        foreach ($acciones as $accion) {
            $accionesByAbreviatura[$accion['abreviatura']] = true;
        }
        
        $respuesta = [];

        foreach ($datos as $key => $value) {
            $value['leaf'] = true;
            if ($accionesByAbreviatura['ct'] || $accionesByAbreviatura['ct-concepto'] || $accionesByAbreviatura[$value['idconcepto']]) {
                $respuesta[] = $value;
            }
        }
        echo(json_encode($respuesta));
    }

    /**
     * Modifica de un concepto determinado el icono correspondiente y su propiedad
     * de graficable
     *
     * @author    : Ing.Osvaldo Gonzalez
     * @internal  param $idConcepto
     * @internal  param $dirIcono
     * @internal  param $esGrafica
     * @return bool Retorna 1/0 en caso de modificar correctamente o no
     * @copyright Copyright (c) 2013 xetid
     */
    function modificarConceptoAction()
    {
        $idConcepto = $this->_request->getPost('idconcepto');
        $idIcono = $this->_request->getPost('idicono');
        $esGrafica = $this->_request->getPost('grafica');
        $model = new NomConceptoModel();
        if ($model->modificar($idConcepto, $idIcono, $esGrafica)) {
            echo("{'codMsg':1,'mensaje': 'El concepto ha sido modificado satisfactoriamente.'}");
        } else {
            echo("{'codMsg':6,'mensaje': 'Ha ocurrido un error al modificar el concepto.'}");
        }
    }

    /**
     * Obtiene el listado de todos los permisos existentes que posee un concepto
     * especificado
     *
     * @author    : Ing.Osvaldo Gonzalez
     * @internal  param $idConcepto
     * @return array Retorna un arreglo con todos los datos de los permisos
     * @copyright Copyright (c) 2013 xetid
     */
    function damePermisosAction()
    {
        $idConcepto = $this->_request->getPost('idconcepto');
        $permisos = NomRelacion::dameTodos($idConcepto);
        $mostrar = array('cant' => count($permisos), 'datos' => $permisos);
        echo(json_encode($mostrar));
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
     *
     */
    function dameUsuariosRestriccionesAction()
    {
        $buscar = $this->_request->getPost('query');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idUsuarioPerfil = $this->usuario;
        $excluir = array($idUsuarioPerfil);
        $modelDominio = new DominioModel();
        $dominios = $modelDominio->BuscarIdDominioHijos();
        $dominios = Util::getArrayByField($dominios, 'iddominio');
        $dominios[] = $this->perfil->iddominio;
        $referenciaProyecto = 'metadatos/proyecto/index.php/proyecto/gestionarProyecto';
        $usuariosProyectos = MetadatosServices::getInstance()->dameUsuariosPorFuncionalidad(
                                              $dominios, $referenciaProyecto, 'des', $excluir
        );
        $referenciaEstructura = 'metadatos/estructura/index.php/estructura/gestionarEstructura';
        $usuariosEstructura = MetadatosServices::getInstance()->dameUsuariosPorFuncionalidad(
                                               $dominios, $referenciaEstructura, 'des', $excluir
        );
        $datos = array_merge($usuariosProyectos, $usuariosEstructura);


        $usuarios = array();
        foreach ($datos as $ussers) {
            if (!Util::existeIdInArray($usuarios, $ussers, 'idusuario')) {
                $usuarios[] = $ussers;
            }
        }
        $busqueda = Util::getGridData($usuarios, 100, 0, $buscar, 'usuario');
//        print_r($busqueda);die;
        $cantidad = ($buscar) ? count($busqueda) : count($usuarios);
        $mostrar = array('cant' => $cantidad, 'datos' => $busqueda);
        echo(json_encode($mostrar));
    }

    /**
     *
     */
    function dameConceptosRestriccionesAction()
    {
        $idusuario = $this->_request->getPost('idusuario');
        $model = new DatUsuarioConcepto();
        $conceptos = $model->dameTodos($idusuario);
        $mostrar = array('cant' => count($conceptos), 'datos' => $conceptos);
        echo(json_encode($mostrar));
    }

    /**
     *
     */
    function gestionarRestriccionesAction()
    {
        $idusuario = $this->_request->getPost('idusuario');
        $conceptos = json_decode(stripslashes($this->_request->getPost('parametros')));
        $modelRestricciones = new DatUsuarioConcepto();
        $modelRestricciones->eliminar($idusuario);
        $result = $modelRestricciones->insertar($idusuario, $conceptos);
        if ($result) {
            $msg = "'Las restricciones para el usuario han sido guardadas satisfactoriamente.'";
            echo("{'codMsg':1, 'mensaje' : $msg }");
        } else {
            echo("{'codMsg':6, 'mensaje' : 'Ha ocurrido un error al guardar las restricciones del usuario.' }");
        }
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
        $limit = $this->_request->getPost('limit');
        $offset = $this->_request->getPost('start');
        if (is_numeric($idConcepto) && $idConcepto != 9) {
            $data = NomOrgano::dameOrganoPorTipo($idConcepto, false, $limit, $offset);
            $cant = NomOrgano::dameCantOrganoPorTipo($idConcepto);
        } else {
            $data = NomTipomedio::dameTodos();
            $cant = NomTipomedio::dameCantTodos();
        }
        echo(Zend_Json::encode(array('cant' => $cant, 'datos' => $data)));
    }

    public function importarXMLAction()
    {
        $respuesta = new stdClass();
        $respuesta->codMsg = 1;
        $dirFile = $_FILES['fileUpload']['tmp_name'];
        //print_r($_FILES);die;
        if ($_FILES['fileUpload']['type'] == 'text/xml') {
            if (file_exists($dirFile)) {
                $contenido = file_get_contents($dirFile);
                $contenido = ltrim($contenido);

                if ($obj = simplexml_load_string($contenido)) {
                    $xmlcargado = $obj;

                    try {
                        //Grupo complejidad
                        foreach ($xmlcargado->grupocomplejidad as $grupocomplejidad) {
                            $ngcomplejidad = Doctrine::getTable('NomGrupocomplejidad')
                                ->find($grupocomplejidad['idgrupocomplejidad']);

                            //print_r($ngcomplejidad);

                            if (is_object($ngcomplejidad)) {

                                $ngcomplejidad->denominacion = (string) $grupocomplejidad['denominacion'];
                                $ngcomplejidad->abreviatura  = (string) $grupocomplejidad['abreviatura'];
                                $ngcomplejidad->actual       = (int)$grupocomplejidad['actual'];
                                $ngcomplejidad->visible      = (int)$grupocomplejidad['visible'];

                                $ngcomplejidad->save();
                            }else{

                                $ngcomplejidad = new NomGrupocomplejidad();
                                $ngcomplejidad->idgrupocomplejidad = (int)$grupocomplejidad['idgrupocomplejidad'];
                                $ngcomplejidad->denominacion = (string) $grupocomplejidad['denominacion'];
                                $ngcomplejidad->abreviatura  = (string) $grupocomplejidad['abreviatura'];
                                $ngcomplejidad->actual       = (int)$grupocomplejidad['actual'];
                                $ngcomplejidad->visible      = (int)$grupocomplejidad['visible'];
                                $ngcomplejidad->save();
                            }


                        }
                        //Salario
                        foreach ($xmlcargado->salario as $salarioarray) {
                            $salario = Doctrine::getTable('NomSalario')
                                ->find($salarioarray['idsalario']);

                            if (is_object($salario)) {

                                $salario->salario = (double)$salarioarray['salario'];
                                $salario->actual       = (int)$salarioarray['idgrupocomplejidad'];
                                $salario->actual       = (int)$salarioarray['actual'];
                                $salario->visible      = (int)$salarioarray['visible'];

                                $salario->save();
                            }else{

                                $salario = new NomSalario();
                                $salario->idsalario = (int)$salarioarray['idsalario'];
                                $salario->idgrupocomplejidad = (int)$salarioarray['idgrupocomplejidad'];
                                $salario->salario = (double)$salarioarray['salario'];
                                $salario->actual       = (int)$salarioarray['actual'];
                                $salario->visible      = (int)$salarioarray['visible'];
                                $salario->save();
                            }
                        }
                        //Tipo escala
                        foreach ($xmlcargado->tipoescala as $tipoescala) {
                                $tescala = Doctrine::getTable('NomTipoEscala')
                                    ->find($tipoescala['idtipoescala']);

                                if (is_object($tescala)) {

                                    $tescala->denominacion = (string)$tipoescala['denominacion'];
                                    $tescala->abreviatura = (string)$tipoescala['abreviatura'];
                                    $tescala->actual       = (int)$tipoescala['actual'];
                                    $tescala->visible      = (int)$tipoescala['visible'];
                                    $tescala->save();
                                }else{

                                    $tescala = new NomTipoEscala();
                                    $tescala->idtipoescala = (int)$tipoescala['idtipoescala'];
                                    $tescala->denominacion = (string)$tipoescala['denominacion'];
                                    $tescala->abreviatura = (string)$tipoescala['abreviatura'];
                                    $tescala->actual       = (int)$tipoescala['actual'];
                                    $tescala->visible      = (int)$tipoescala['visible'];
                                    $tescala->save();
                                }

                        }
                        //Escala salarial
                        foreach ($xmlcargado->escala as $escala) {
                            $escalasalarial = Doctrine::getTable('NomEscalaSalarial')
                                ->find($escala['idescalasalarial']);

                            if (is_object($escalasalarial)) {

                                $escalasalarial->idtipoescala = (int)$escala['idtipoescala'];
                                $escalasalarial->idsalario = (int)$escala['idsalario'];
                                $escalasalarial->actual       = (int)$escala['actual'];
                                $escalasalarial->visible      = (int)$escala['visible'];
                                $escalasalarial->save();
                            }else{

                                $escalasalarial = new NomEscalaSalarial();
                                $escalasalarial->idescalasalarial = (int)$escala['idescalasalarial'];
                                $escalasalarial->idtipoescala = (int)$escala['idtipoescala'];
                                $escalasalarial->idsalario = (int)$escala['idsalario'];
                                $escalasalarial->actual       = (int)$escala['actual'];
                                $escalasalarial->visible      = (int)$escala['visible'];
                                $escalasalarial->save();
                            }
                        }

                        $respuesta->mensaje = 'El xml ha sido importado satisfactoriamente.';
                        $respuesta->success = 'true';
                        echo json_encode($respuesta);
                        return;

                    } catch (Exception $exc) {
                        /*print_r('<pre/>');
                        print_r($exc);die;*/
                        $respuesta->codMsg = 3;
                        $respuesta->mensaje = 'El archivo introducido'
                            . ' no es válido.';
                        $respuesta->failure = 'true';

                        echo json_encode($respuesta);
                    }
                } else {
                    $respuesta->codMsg = 3;
                    $respuesta->mensaje = 'El archivo introducido'
                        . ' no es válido.';
                    $respuesta->failure = 'true';

                    echo json_encode($respuesta);
                }
            }
        } else {
            $respuesta->codMsg = 3;
            $respuesta->mensaje = 'El archivo introducido'
                . ' no es válido.';
            $respuesta->failure = 'true';

            echo json_encode($respuesta);
        }
    }

}