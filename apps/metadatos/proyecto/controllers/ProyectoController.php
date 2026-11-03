<?php

/***
 * Class ProyectoController
 * Descripción de la clase: Clase encargada de la gestión de los proyectos
 *
 * @modify    : Ing. Osvaldo M. Gonzalez
 * @copyright Copyright (c) 2013 xetid
 */
class ProyectoController extends EstructuraController
{
    /**
     * @var
     */
    private $_perfil;
    /**
     * @var
     */
    private $_usuario;
    /**
     * @var
     */
    private $fecha;

    /**
     *
     */
    function init()
    {
        parent::init();
        $this->_perfil = Util::getPerfilGlobal();
        $this->_usuario = $this->_perfil->idusuario;
        $date = getdate();
        $this->fecha = $date['year'] . '-' . $date['mon'] . '-' . $date['mday'];
    }

    /**
     * Controlador de la clase
     */
    function gestionarProyectoAction()
    {
        $this->view->arrayJs = MetadatosServices::getInstance()->dameUIControllers();
        $this->render();
    }

    /**
     * Descripción del método: Gestiona todas las acciones sobre los proyectos,
     * incluye los adicionar, modificar, eliminar, desactivar y activar los
     * proyectos
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    function gestionarAccionesAction()
    {
        $clase = $this->_request->getPost('clase');
        $accion = $this->_request->getPost('accion');
        $params = json_decode(stripslashes($this->_request->getPost('parametros')));
        $evento = self::getClass($clase, $accion);
        $accionError = $accion;
        $valores = array();
        $valores['parametros'] = $params;
        $valores['usuario'] = $this->_usuario;
        $valores['fecha'] = $this->fecha;
        if ($accion == 'insertar') {
            $accionError = 'adicionar';
        }
        $arrayGenero = array(
            'asignar' => 'asignado', 'insertar' => 'adicionado', 'modificar' => 'modificado',
            'eliminar' => 'eliminado', 'desactivar' => 'desactivado', 'activar' => 'activado',
            'cancelar' => 'cancelado', 'aprobar' => 'aprobado', 'fusionar' => 'fusionados');
        if (call_user_func_array($evento, array($valores))) {
            if ($accion == 'fusionar') {
                echo("{'codMsg':1, 'mensaje' : 'Los proyectos han sido $arrayGenero[$accion] satisfactoriamente.'}");
            } else {
                echo("{'codMsg':1, 'mensaje' : 'El proyecto ha sido $arrayGenero[$accion] satisfactoriamente.'}");
            }
        } else {
            if ($accion == 'fusionar') {
                echo("{'codMsg':6, 'mensaje' : 'Ha ocurrido un error al $accionError los proyectos.' }");
            } else {
                if ($accion == 'aprobar') {
                    $msg = 'No es posible aprobar el proyecto, debido a que no se han actualizado';
                    $msg .= '<br> los cargos afectados por los nuevos tipos de escala de la entidad.';
                    echo(json_encode(array('codMsg' =>3, 'mensaje' => $msg )));
                } else {
                    echo(json_encode(array('codMsg' =>6, 'mensaje' => 'Ha ocurrido un error al $accionError el proyecto.' )));
                }
            }
        }
    }

    /**
     * Descripción del método: Encargada de mostrar los elementos de los grid de todos
     * los nomencladores segun los parametros insertados
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarValoresAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $clase = $this->_request->getPost('clase');
        $params = json_decode(stripslashes($this->_request->getPost('parametros')));
        $valores = array($params, 'usuario' => $this->_usuario);
        $evento = self::getClass($clase, 'cantidad');
        $cantidad = call_user_func_array($evento, array($valores));

        $evento = self::getClass($clase, 'buscar');

        $valores = array($limit, $start, $params, 'usuario' => $this->_usuario);

        $datos = call_user_func_array($evento, array($valores));

        $mostrar = array('cant' => $cantidad, 'datos' => $datos);

        echo(json_encode($mostrar));
    }

    /**
     *
     */
    function cargarUsuariosAction()
    {
        $idproyecto = $this->_request->getPost('idproyecto');
        $usuariosAsignados = DatProyectoUsuarioModel::dameUsuariosPorProyecto($idproyecto, $this->_usuario);
        $idUsuarioPerfil = $this->_usuario;
        $modelDominio = new DominioModel();
        $dominios = $modelDominio->BuscarIdDominioHijos();
        $dominios = Util::getArrayByField($dominios, 'iddominio');
        $dominios[] = $this->_perfil->iddominio;
        $referencia = 'metadatos/proyecto/index.php/proyecto/gestionarProyecto';
        $model = new DatProyectoUsuarioModel();
        $responsables = $model->dameAsignacionesPorProyectoUsuario($idUsuarioPerfil, $idproyecto);
        $responsables = Util::getArrayByField($responsables, 'idresponsable');
        $responsables [] = $idUsuarioPerfil;
        $usuarioAjuste = $this->dameUsuariosPorFuncionalidad(
            $dominios, $referencia, 'btnRealizarAjuste', $responsables
        );
        $usuarioVigor = $this->dameUsuariosPorFuncionalidad(
            $dominios, $referencia, 'btnPonerVigor', $responsables
        );
        $usuarios = array();
        foreach ($usuarioAjuste as $value) {
            $value['ajusta'] = 1;
            $value['aprueba'] = is_numeric(Util::existeIdInArray($usuarioVigor, $value['idusuario'])) ? 1 : 0;
            $usuarios[] = $value;
        }
        foreach ($usuarioVigor as $value) {
            $value['ajusta'] = 0;
            $value['aprueba'] = 1;
            if (!is_bool(Util::existeIdInArray($usuarios, $value['idusuario']))) {
                $usuarios[] = $value;
            } else {
                if (count($usuarios) > 0)
                    foreach ($usuarios as $key => $u) {
                        if ($value['idusuario'] == $u['idusuario']) {
                            $usuarios[$key]['aprueba'] = 1;
                        }
                    }
            }
        }
        $disponibles = array();
        $asignados = array();
        foreach ($usuarios as $value) {
            if (is_numeric(Util::existeIdInArray($usuariosAsignados, $value['idusuario']))) {
                $asignados[] = $value;
            } else {
                $disponibles[] = $value;
            }
        }
        echo(json_encode(
            array(
                'disponibles' => $disponibles, 'total_disponibles' => count($disponibles),
                'total_asignados' => count($asignados), 'asignados' => $asignados)
        ));
    }

    public function dameUsuariosPorFuncionalidad(
        $iddominios,
        $referencia,
        $recurso,
        $excluir = array(),
        $limit = 1000,
        $offset = 0
    )
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $dominios = implode(',', $iddominios);

        $whereExclude = '';
        if (count($excluir) > 0) {
            $idUsuarios = implode(',', $excluir);
            $whereExclude = "AND u.idusuario NOT IN ($idUsuarios)";
        }
        $sql = "Select distinct(u.idusuario), u.nombreusuario as usuario, 
            u.iddominio,r.abreviatura
    from mod_seguridad.seg_usuario u
    INNER JOIN mod_seguridad.dat_entidadusuariorol eur 
    ON (u.idusuario = eur.idusuario)
    INNER JOIN mod_seguridad.seg_rol rol 
    ON (rol.idrol = eur.idrol)
    INNER JOIN mod_seguridad.dat_sistemarolfuncionalidadaccion da 
    ON (rol.idrol = da.idrol)
    INNER JOIN mod_seguridad.dat_recurso r 
    ON (da.idfuncionalidad = r.idfuncionalidad)
    INNER JOIN mod_seguridad.dat_sistemarolfuncionalidad rf 
    ON (rf.idfuncionalidad = da.idfuncionalidad)
    INNER JOIN mod_seguridad.dat_funcionalidad f 
    ON (rf.idfuncionalidad = f.idfuncionalidad)
    Where 
    u.iddominio IN($dominios)  
    $whereExclude
    AND f.referencia ILIKE ('$referencia') AND
    r.abreviatura ILIKE ('$recurso')
    AND u.activo = true
    LIMIT $limit  OFFSET $offset";


        return $conn->fetchAll($sql);
    }

    /**
     * Descripción del método: Gestiona todas las acciones sobre los proyectos,
     * incluye los adicionar, modificar, eliminar, desactivar y activar los
     * proyectos
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    function asignarUsuarioProyectoAction()
    {
        $idproyecto = $this->_request->getPost('idproyecto');
        $asignados = json_decode(stripslashes($this->_request->getPost('asignados')));
        $disponibles = json_decode(stripslashes($this->_request->getPost('disponibles')));
        $model = new DatProyectoModel();
        if ($model->asignarPermisos($this->_usuario, $idproyecto, $disponibles, $asignados)) {
            echo("{'codMsg':1, 'mensaje' : 'Los permisos al proyecto han sido actualizados satisfactoriamente.'}");
        } else {
            echo("{'codMsg':6, 'mensaje' : 'Ha ocurrido un error al actualizar los Los permisos al proyecto.'}");
        }
    }

    /**
     * Descripcion del metodo: Encargado de la creacion del arreglo con la clase y la accion segun los datos del
     * proyecto
     *
     * @author Ing.Osvaldo Manuel Gonzalez
     *
     * @param $clase
     * @param $accion
     *
     * @return array
     */
    private static function getClass($clase, $accion)
    {
        switch ($clase) {
            case 'proyecto':
                return array('DatProyectoModel', $accion);
            case 'proyectousuario':
                return array('DatProyectoUsuarioModel', $accion);
        }
    }

    function mostrarFirmaAction()
    {
        $iddominio = $this->global->Perfil->iddominio;
        $datos = NomFirma::dameTodos($iddominio);
        echo(Zend_Json::encode(array('datos' => $datos)));
    }

    function listarHistorialAction()
    {
        $iddominio = $this->global->Perfil->iddominio;

        //$idestructura = $this->_request->getPost('parametros')=>$idestructura;
        $parametros = json_decode($this->_request->getPost('parametros'));
        $idestructura = $parametros->idestructura;
        //print_r($idestructura);die;



        $sql = "SELECT idreporteplantilla, nombrereporte,  fechavigor, fechaderogacion, 
       nombreproyecto  FROM mod_estructuracomp.his_reporteplantilla
       WHERE idestructura=$idestructura;";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        $datos = $cnx->fetchAll($sql);
        echo(Zend_Json::encode(array('datos' => $datos,'success' => true)));
    }

    function mostrarReporteAction()
    {
        $iddominio = $this->global->Perfil->iddominio;
        $idreporteplantilla = $this->_request->get('idreporteplantilla');

        $sql = "SELECT  * FROM mod_estructuracomp.his_reporteplantilla
       where idreporteplantilla=$idreporteplantilla;";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();

        $datos = $cnx->fetchAll($sql);
        //$tamano = $datos[0]['tamano'];

        $tipo = 'pdf';
        $nombrereporte = $datos[0]['nombrereporte'].'.pdf';
        $content = $datos[0]['reporte'];
        $file_location = $_SERVER['DOCUMENT_ROOT'] . "/metadatos/proyecto/reportes/" . $nombrereporte ;



        if(!empty($nombrereporte) && file_exists($file_location)){
            header("Content-type: $tipo");
            //header("Content-length: $tamano");
            header('Content-Disposition: inline; filename="'.$nombrereporte.'"');
            header('Content-Transfer-Encoding: binary');
            header('Accept-Ranges: bytes');
            readfile($file_location);
            exit;
        }else{
            echo(Zend_Json::encode(array('codMsg' => 1,'mensaje' => 'El pdf ha sido borrado del servidor.')));
        }

    }

    function listarHistorialCambiosAction()
    {
        $iddominio = $this->global->Perfil->iddominio;


        $parametros = json_decode($this->_request->getPost('parametros'));
        $idproyecto = $parametros->idproyecto;
        //print_r($idestructura);die;


        $sql = "SELECT *  FROM mod_estructuracomp.his_reportecambios
       WHERE idproyecto=$idproyecto;";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        $datos = $cnx->fetchAll($sql);
        //print_r($datos);die;
        echo(Zend_Json::encode(array('datos' => $datos,'success' => true)));
    }

    function mostrarReporteCambiosAction()
    {
        $iddominio = $this->global->Perfil->iddominio;
        $idreporteplantilla = $this->_request->get('idreporteplantilla');

        $sql = "SELECT  * FROM mod_estructuracomp.his_reportecambios
       where idreportecambios=$idreporteplantilla;";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();

        $datos = $cnx->fetchAll($sql);
        //$tamano = $datos[0]['tamano'];

        $tipo = 'pdf';
        $nombrereporte = $datos[0]['nombrereporte'].'.pdf';
        $content = $datos[0]['reporte'];
        $file_location = $_SERVER['DOCUMENT_ROOT'] . "/metadatos/proyecto/reportescambios/" . $nombrereporte ;



        if(!empty($nombrereporte) && file_exists($file_location)){
            header("Content-type: $tipo");
            //header("Content-length: $tamano");
            header('Content-Disposition: inline; filename="'.$nombrereporte.'"');
            header('Content-Transfer-Encoding: binary');
            header('Accept-Ranges: bytes');
            readfile($file_location);
            exit;
        }else{
            echo(Zend_Json::encode(array('codMsg' => 1,'mensaje' => 'El pdf ha sido borrado del servidor.')));
        }
    }
    
    // Validacion para la eliminacion de un cargo mientras este ocupado ....Day
    function eliminarValoresAction()
    {
        $idnomcargo = $this->_request->getPost('cargo');
        $idFila = $this->_request->getPost('idfila');
        $proyecto = $this->_request->getPost('proyecto');
        $idConcepto = $this->_request->getPost('idconcepto');
        $modelFila = new FilaModel();
        $sepuedeeliminar=$modelFila->eliminarFila($idFila, $proyecto);
        
        if($sepuedeeliminar){
            if ($idnomcargo != 0) {
                DatProyectoModel::setModificar($idnomcargo);
                DatProyectoUsuarioModel::actualizar($idnomcargo, $this->_usuario);
            }
            echo(Zend_Json::encode(
                array("codMsg" => "1", "mensaje" => UtilModel::getMessage('eliminar', $idnomcargo))
            ));
        }else{
            echo(Zend_Json::encode(
                array("codMsg" => "7", "mensaje" => 'La estructura no puede ser eliminada porque está en uso.')
            ));
        }
    }

}
