<?php

/**
 *
 */
class ConfparametrosgeneralesController extends ZendExt_Controller_Secure
{
    protected $_confPGModel;
    protected $_sConfgeneral;

    /**
     *
     */
    function init()
    {
        parent:: init();
        $this->_confPGModel = new ConfparametrosgeneralesModel();

        $this->_sConfgeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->sSeguridad = ServiciosSeguridadHelper::__init();
    }

    /**
     *
     */
    function confparametrosgeneralesAction()
    {
        $this->render();
    }

    /**
     *
     */
    public function cargarconfiguracionAction()
    {
        $classEstructura = 'Estructura';
        $acciones = json_decode($this->_request->getPost('acciones'));


        echo json_encode($this->_confPGModel->getConfiguracionPG(
                $this->global->$classEstructura->idestructura, $this->_request->getPost('tipo'), $acciones)
        );
    }

    /**
     *
     */
    public function guardarparametrosAction()
    {
        $classEstructura = 'Estructura';

        $parametros = new stdClass();
        $parametros->idestructura = $this->global->$classEstructura->idestructura;
        $parametros->deprecia = $this->_request->getPost('deprecia');
        $parametros->codigooperacion = json_decode($this->_request->getPost('codigoperacion'));

        if ($parametros->deprecia == 1) {
            $parametros->explotacionadquisicion = $this->_request->getPost(
                'explotacionadquisición'
            );
        }
        $parametros->generacomprobante = $this->_request->getPost(
            'generacomprobante'
        );
        $parametros->maxunidarrastporremolcadoras = $this->_request->getPost(
            'cantidad'
        );

        $parametros->explotacionadquisicion = $this->_request->getPost('explotacionadquisición');
        $parametros->fechaadquisicion = $this->_request->getPost('fechaadquisicion');

        $paramAll = $this->_request->getPost();

        $objconfPGModel = new ConfparametrosgeneralesModel();
        $r = $objconfPGModel->updateParametros($parametros, $paramAll);
        echo json_encode($r);
        
        
            // try {
            //     $this->_confPGModel->updateParametros($parametros, $paramAll);
            //     echo("{'CodMsg': ".true."}");
            // } catch (Doctrine_Exception $e) {
            //     echo $e->getMessage();
            // }
    }

    /**
     *
     */
    public function cargarconfignaturalezaAction()
    {
        $parametros = new stdClass();
        $parametros->tipo = $this->_request->getPost('tipo');

        $config = new ConfTipomedionaturaleza();
        $datos = $config->getConfigNaturaleza($parametros);
        $total = $config->getCountConfigNaturaleza($parametros);

        echo json_encode(array('total' => $total, 'datos' => $datos));
    }

    /**
     *
     */
    public function cargararbolnaturalezaAction()
    {
        $post['node'] = $this->_request->getPost('node');
        $datos = $this->_sConfgeneral->obtenerDatosArbolNaturaleza(
            $post
        );

        foreach ($datos as &$value) {
            $value['checked'] = false;
        }

        echo json_encode($datos);
    }

    /**
     *
     */
    public function adicionarnaturalezaAction()
    {
        try {
            $datos = json_decode($this->_request->getPost('datos'));
            $mTipoMedNaturaleza = new ConfTipomedionaturalezaModel();
            $mTipoMedNaturaleza->insertar($datos);

            echo("{'CodMsg': '1'}");
        } catch (Doctrine_Exception $e) {

            if ($e->getCode() == '23505') {
                echo("{'CodMsg': '2'}");
            } else {
                echo("{'CodMsg': '3'}");
            }
        }
    }

    /**
     *
     */
    public function eliminarnaturalezaAction()
    {
        try {
            $id = $this->_request->getPost('id');
            $mTipoMedNaturaleza = new ConfTipomedionaturalezaModel();
            $mTipoMedNaturaleza->eliminar($id);

            echo("{'CodMsg': '1'}");
        } catch (Doctrine_Exception $e) {
            echo("{'CodMsg': '3'}");
        }
    }

    /**
     *
     */
    public function cargarestadosAction()
    {
        $objEstatusTecnico = new NomEstatustecnico();
        echo json_encode($objEstatusTecnico->getEstatusTecnicos());
    }

    /**
     *
     */
    public function cargarArbolAction()
    {
        $iddeposito = $this->_request->getPost('node');
        $nivel = ($this->_request->getPost('nivel')) ? $this->_request->getPost('nivel') : -1;
        //$tipo = ($this->_request->getPost('tipo') == 1) ? "1": "0";       
        if ($iddeposito == 0) {
            echo json_encode($this->_confPGModel->getAreaById($iddeposito, $this->_request->getPost('tipo')));
//            echo json_encode($this->_confPGModel->getAreaById(0));
        } else {
            echo json_encode($this->_confPGModel->getEstructurasUbicacion($iddeposito, $nivel));
        }
    }

    /**
     *
     */
    public function asociarAction()
    {
        echo json_encode(array('cod' => $this->_confPGModel->asociarResponsable($this->_request->getPost())));
    }

    /**
     *
     */
    public function eliminarAsociacionAction()
    {
        $respuesta = $this->_confPGModel->eliminarReponsableAsociado(
            $this->_request->getPost('idarearesp'), $this->_request->getPost('tipo')
        );

        if ($respuesta) {
            echo json_encode(array('cod' => $respuesta));
        }
    }

    /**
     *
     */
    public function cargarPersonasAction()
    {
        if (!ComunAFTModel::integradoPersona()) {
            echo json_encode($this->_confPGModel->getPersonasLocal());
        } else {
            echo json_encode(array());
        }
    }

    /**
     *
     */
    public function verificarCmpPersonaAction()
    {
        echo json_encode(array('integrado' => ComunAFTModel::integradoPersona()));
    }

    /**
     *
     */
    public function cargarRolesAction()
    {
        echo json_encode(array('datos' => $this->sSeguridad->getTodosRoles()));
    }

    /**
     *
     */
    public function cargarUsuariosRolAction()
    {
        $cantUsuarios = $this->sSeguridad->cantObtenerTodosLosUsuarios();
        $idusuario = $this->sSeguridad->obtenerTodosUsuarios($cantUsuarios, 0);

        $respuesta = array();
        foreach ($idusuario as $index => $valor) {

            $datos = $this->sSeguridad->obtenerNombresUsuarios(array($valor['idusuario']));
            $especialidad = ConfparametrosgeneralesModel::getEspecialidadByIdUser($valor['idusuario']);

            if ($especialidad) {
                $especialidad = $this->_sConfgeneral->obtenerEspecialidadPorId($especialidad['idespecialidad']);
                $respuesta[$index]['denespecialidad'] = $especialidad[0]->denespecialidad;
            }

            $respuesta[$index]['nombreusuario'] = $datos[0]['nombreusuario'];
            $respuesta[$index]['idusuario'] = $valor['idusuario'];
        }

        echo json_encode(array('datos' => $respuesta));
    }

    /**
     *
     */
    public function cargarEspecialidadUsuarioAction()
    {
        echo json_encode(array('datos' => $this->_sConfgeneral->ObtenerEspecialidadesHojas()));
    }

    /**
     *
     */
    public function guardarUsuariosEspAction()
    {
        $parametros = json_decode(stripcslashes($this->_request->getPost('parametros')));

        try {
            $this->_confPGModel->setUsuarioPorEspecialidad($parametros);
            echo("{'CodMsg': ".true."}");
        } catch (Doctrine_Exception $e) {
            echo("{'CodMsg': '3'}");
        }
    }

    /**
     *
     */
    public function eliminarAsociacionUsuariosEspAction()
    {
        $parametros = json_decode(stripcslashes($this->_request->getPost('parametros')));

        try {
            $this->_confPGModel->delAsocUsuarioEspecialidad($parametros);
            echo("{'CodMsg': ".true."}");
        } catch (Doctrine_Exception $e) {
            echo("{'CodMsg': '3'}");
        }
    }

    public function cargaroperacionescontableAction()
    {
        $parametros = $this->_request->getPost();
        $datos = $this->_confPGModel->cargaroperacionescontable($parametros);
        echo json_encode($datos);
    }

    public function leerXmlConfiguracionAction()
    {
        $datos = $this->_confPGModel->leerXmlConfiguracion();
        echo json_encode(array('datos' => $datos));
    }

    public function eliminarCodigoOperacionAction()
    {
        try {
            $codigooperacion = json_decode($this->_request->getPost('codigooperacion'));
            $this->_confPGModel->eliminarCodigoOperacion($codigooperacion);
            echo("{'codMsg': '1'}");
        } catch (Doctrine_Exception $e) {
            echo("{'codMsg': '3'}");
        }
    }

    public function prepararDatosAction()
    {
        // Seleccionar el usuario y la contraseña del usuario logueado
        $arr_usuario = array();
        // Seleccoinar todos las areas de responsabilidad a las que tenga permiso el usuario en la entidad
        $arr_areas = array();
        // Seleccionar todos los activos de esas areas de responsabilidad
        $arr_activos = array();
        // Seleccionar los inventarios pendientes en elaboracion, con los activos que se suponen que deben contar
        $arr_conteospendientes = array();
        $arr_conteosactivos = array();

        $arr_consolidador = array(
            'dat_usuario' => $arr_usuario,
            'dat_area' => $arr_areas,
            'dat_activo' => $arr_activos,
            'dat_conteopendiente' => $arr_conteospendientes,
            'dat_conteoactivo' => $arr_conteosactivos
        );

        $arr_consolidador = $this->_confPGModel->selectDataForScriptApk($arr_consolidador);

        $insertStatetmatn = " INSERT INTO @table (@fields) VALUES (@data);";
        $solidInsert = "";
        $insertStatement = "";
        foreach ($arr_consolidador as $tableName => $tableData)
        {
            $temp = str_replace("@table", $tableName, $insertStatetmatn);
            $datas = array();
            foreach ($tableData as $row)
            {
                $fields = array();
                $auxdata = array();
                foreach ($row as $field => $data)
                {
                    array_push($fields, $field);
                    array_push($auxdata, $data);
                }
                $strdata[] = "(".implode(',', $auxdata).")";
                $temp = str_replace("@fields", implode(',', $fields), $temp);

            }
            $temp = str_replace("@data", implode(',', $strdata), $temp);

            $insertStatement .= str_replace('@data', $temp, $temp);
        }

        print_r($insertStatement);
        die;



        // Script create schema
        $create_sintax = "CREATE TABLE @table
                            (
                              id numeric(19,0),
                              @fields
                            )";
        $create_dat_activo = str_replace("@table", "dat_activo", $create_sintax);
        $create_dat_activo = str_replace("@field", " codigo character varying(50),
                denominacion character varying(150),
                marca character varying(50),
                modelo character varying(50),
                nroserie character varying(50),
                nroinventario character varying(50),
                responsable character varying(150),
                ubicacion character varying(150),
                estado character varying(50),
                campoident character varying(50),
                datoident character varying(50),
                idarea numeric(19,0)"
            , $create_dat_activo);

        $create_dat_area = str_replace("@table", "dat_area", $create_sintax);
        $create_dat_area = str_replace("@field", " nombre character varying(150),
	            responsable character varying(150)"
            , $create_dat_area);

        $create_dat_conteoactivo = str_replace("@table", "dat_conteoactivo", $create_sintax);
        $create_dat_conteoactivo = str_replace("@field", " idconteo numeric(19,0),                
	            idactivo numeric(19,0)"
            , $create_dat_conteoactivo);

        $create_dat_conteopendiente = str_replace("@table", "dat_conteopendiente", $create_sintax);
        $create_dat_conteopendiente = str_replace("@field", " nrodocumento numeric(9,0),
                tipodoc character varying(50),
                fechainicio date,
                fechafin date"
            , $create_dat_conteopendiente);

        $create_dat_usuario = str_replace("@table", "dat_usuario", $create_sintax);
        $create_dat_usuario = str_replace("@field", " usuario character varying(50),
	            contrasenna character varying(50)"
            , $create_dat_usuario);

        $sql_scrpt_create_structure = $create_dat_activo . $create_dat_area . $create_dat_conteoactivo . $create_dat_conteopendiente . $create_dat_usuario;
        print_r($sql_scrpt_create_structure);
        print_r($sql_scrpt_create_structure);

        die();























        // -------------------------------------------------------------- old code --------------------------------------------------

        /*if ( !extension_loaded ( 'sqlite3' ) ) {
            die('Debe instalar la extensi&oacute;n sqlite3 de php');
        }
        
        $idestructura = $this->global->Estructura->idestructura;
        $idpersona = json_decode($this->_request->getPost('idpersona'));
        if(!$idpersona)
            $idpersona = $this->global->Perfil->idpersona;// id de la persona para la que se genera la base de datos sqlite
        if(!$idpersona)
            die("El usuario autenticado no tiene asignado una persona");
        
        // EJECUTAR FUNCION QUE REALIZA LA TRANSFORMACION DE LOS DATOS EN LA TABLA POSTGRES
        $conn = Zend_Registry::get('conexion');
        $conn->fetchAll("select mod_logactivofijotangible.f_tablasqlite($idestructura, $idpersona, 0)");
        echo("{'codMsg': '1'}");
*/
        // ------------------------------------------------------------- end old code ------------------------------------------------
    }
    
    public function exportarDatosAction()
    {
        $conn = Zend_Registry::get('conexion');        
        $dbconnOptions = $conn->getOptions();
        preg_match('/host=(.[0-9]+.[0-9]+.[0-9]+.[0-9]+)/', $dbconnOptions['dsn'], $dbhost);
        preg_match('/port=(.[0-9]+)/', $dbconnOptions['dsn'], $dbport);
        preg_match('/dbname=(.*)/', $dbconnOptions['dsn'], $dbname);
        
        $dbhost = $dbhost[1]; // direccion de base de datos
        $dbport = $dbport[1]; // puerto de base de datos
        $dbname = $dbname[1]; // nombre base de datos
        $dbuser = $dbconnOptions['username']; // usuario postgres
        $dbpass = $dbconnOptions['password']; // contraseña usuario para la coneccion
        
        $dir_index = $_SERVER['SCRIPT_FILENAME'];
        $path = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'web/logistica/activos_fijos/configuracion/';
        
        //$path = str_replace('/', "\\", $path);
        
        $sqlite_base_file = "DSiMCAF_BASE.db";
        $sqlite_new_file = "DSiMCAF.db";
        $script_postgres_sql_temp = "script_db.sql";
        
        if(file_exists($path.$sqlite_new_file)){
            unlink($path.$sqlite_new_file);
        }
                
        // SE CREA UNA COPIA DEL FICHERO SQLITE BASE, EN EL CUAL SE INSERTARAN LOS DATOS
        //copy('D:\APP_ANDROID\DSiMCAF_BASE.db', 'D:\APP_ANDROID\DSiMCAF.db');        
        copy($path.$sqlite_base_file, $path.$sqlite_new_file);
        $sqlite = new SQLite3($path.$sqlite_new_file);
        // SE QUITA LA RESTRICCION DE LAS LLAVES PARA QUE NO DE PROBLEMA EL INSERT
        $sqlite->exec("PRAGMA foreign_keys = off;");      
                
        $arrinsertini[0] = "BEGIN;";
        $arrinsertend[0] = "END;";
        
        // SE REALIZA LA SALVA DE LOS DATOS A UTILIZAR EN UN FICHERO .SQL
        shell_exec('pg_dump --dbname=postgresql://'.$dbuser.':'.$dbpass.'@'.$dbhost.':'.$dbport.'/'.$dbname.' '
            . '-a -F p '
            . '-t "public.vs_persona" '
            . '-t "public.vs_entidad" '
            . '-t "public.vs_area" '
            . '-t "public.vs_responsables_area" '
            . '-t "public.vs_activo_fijo" '            
            . '-b -v --role "'.$dbuser.'" '
            . '--inserts --column-inserts -f "'.$path.$script_postgres_sql_temp.'"');
        
        // SE OBTIENEN EN ARREGLO EL SCRIPT DE DATOS DE LA BASE DE DATOS DISTRA PREVIAMENTE GENERADA
        $file2 = file($path.$script_postgres_sql_temp);
        
        // SE RECORRE Y SE COMENTAREAN LAS LINES QUE NO SON INTERPRETADAS POR EL PARSEADOR SQLITE PARA CORRER EL SCRIPT
        foreach ($file2 as $key => $row) {
            if(strpos($row, 'SET ')!==false){
                $file2[$key] = '-- ' . $row;
            }
        }
        
        // SE AÑANDEN "BEGIN;" Y "END;" PARA REALIZAR TODOS LOS UNA SOLA TRANSACCION Y MEJORAR RENDIMIENTO
        $arrinserts = array_merge($arrinsertini, $file2, $arrinsertend);
        
        // SE UNE EL ARREGLO EN UN SOLO STRING PARA SER EJECUTADO EL INSERT
        $sql_insert = implode("\n", $arrinserts);
        
        // SE EJECUTA EL SCRIPT DE DATOS EN LA BASE DE DATOS SQLITE        
        $sqlite->exec($sql_insert);
        $error_insert = $sqlite->lastErrorMsg();
        
        // SE CIERRA LA CONECCION CON LA BASE DE DATOS SQLITE
        $sqlite->close();
        
        // Elimino las tablas temporales de la base de datos
        $conn = Zend_Registry::get('conexion');
        $conn->fetchAll("select mod_logactivofijotangible.f_tablasqlite(0, 0, 1)");
        // Se borra el fichero sql generado por postgres
        unlink($path.$script_postgres_sql_temp);
        
        echo("{'codMsg': '1','url':'/logistica/activos_fijos/configuracion/".$sqlite_new_file."'}");
    }
 
}

