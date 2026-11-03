<?php

/**
 * @package ERP-Modelos de contabilizacion
 * @category Model
 * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @author Ing. Alejandro Mengana <amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class ClasificadoresModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtiene los subsistemas de la entidad comun que contabilizan.
     * 
     * @param array $request Arreglo con los datos enviados en la peticion 
     * @throws Doctrine_Exception
     * @return mixed Arreglo con los subsistemas
     */
    public function cargarsubsistemas($request)
    {
        $idestructura = $this->global->Estructura->idestructura;
        if ($request['idestructura']) {
            $idestructura = $request['idestructura'];
        }
        $subsistemas = array();
        if ($request['idsubsistema'] === '0') {
            $subsistemas = $this->integrator->datosmaestros->buscarSubsistemasEstructuraContabilizan($idestructura);
        } else {
            $subsistemas = $this->integrator->datosmaestros->buscarSubsistemasEstructuraContabilizan(
                    $idestructura, $request['idsubsistema']
                    );
        }
        return $subsistemas;
    }

    /**
     * Obtiene los Clasificadores de un subsistema.
     * 
     * @param array $post Arreglo con los datos enviados en la peticion 
     * (debe traer el subsistema en el índice 'ids')
     * @throws Doctrine_Exception
     * @return mixed Arreglo con los Clasificadores
     */
    public function load($post)
    {
//        $a = build_comprobante(78, array(100));
//        $a = $this->integrator->configuracion->getModeloContab(81);
//        print_r($a);die;
        $start = !empty($post['start']) ? $post['start'] : 0;
        $limit = !empty($post['limit']) ? $post['limit'] : 20;
        $utf = array("à" => "À", "è" => "È", "ì" => "Ì", "ò" => "Ò", "ù" => "Ù", "á" => "Á", "é" => "É", 
            "í" => "Í", "ó" => "Ó", "ú" => "Ú", "â" => "Â", "ê" => "Ê", "î" => "Î", "ô" => "Ô", "û" => "Û", 
            "ç" => "Ç");
        $data = array();
        //$paging = array();
        $estructura = $this->global->Estructura->idestructura;
        if ($post['idestructura']) {
            $estructura = $post['idestructura'];
        }
        $idsubsistema = (isset($post['idsubsistema']) && is_numeric($post['idsubsistema'])) ? 
                $post['idsubsistema'] : $this->global->Subsistema->idsubsistema;

        $conditions = array("idsubsistema = ? AND idestructuracomun = ?");
        $params = array($idsubsistema, $estructura);
        $total = NomClasificadores::TotalByField('idsubsistema', $idsubsistema);

        if (isset($post['filter']) && !empty($post['filter'])) {
            $filter = $post['filter'];
            $conditions[] = "lower(nombre) ILIKE lower('%$filter%')";
            $data = NomClasificadores::GetByCondition(implode(" AND ", $conditions), $params, TRUE, $start, 
                    $limit);
            /* Colocando un highlight al filtro */
            if (count($data)) {
                foreach ($data as &$clasificador) {
                    $clasificador['nombre'] = str_replace($filter
                            , "<span style=\"background-color: rgb(255, 255, 0);\">" . $filter .
                            "</span>", $clasificador['nombre']);
                }
            }
        } else {
            $data = NomClasificadores::GetByCondition(implode(" AND ", $conditions), $params, TRUE, $start, 
                    $limit);
        }

        $paging = array(
            'success' => true,
            'total' => $total,
            'data' => $data
        );
        return $paging;
    }

    /**
     * Eliminar uno o varios Clasificadores.
     * 
     * @param array $post Arreglo con los datos enviados en la peticion 
     * (almacena los ids de los clasificadores a eliminar en el índice 'ids')
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function delete($post)
    {
        //Si el arreglo de errors tiene valores es que ha habido
        //errores en el proceso
        $response = array('errors' => array(), 'success' => array());
        if (!empty($post['ids'])) {

            $ids = json_decode(stripslashes($post['ids']), TRUE);
            foreach ($ids as $idclasificador) {
                //Buscar los campos contables por el clasificador
                $campos = NomCamposContables::GetByCondition('idclasificador=?', array($idclasificador), TRUE);
                //Conformando un arreglo con los id de los campos
                $idscampos = array();
                foreach ($campos as $campo) {
                    $idscampos[] = $campo['idcampo'];
                }

                $asientos = array();
                if (count($idscampos) > 0) {
                    //Hacer implode con el arreglo de los ids de los campos
                    $idscamposimplode = implode(',', $idscampos);
                    $condition = "cuenta IN ($idscamposimplode)";
                    $asientos = DatAsientosContables::GetByCondition($condition, array(), TRUE);
                }
                //Verificar si existen asientos para esos campos contables
                if (count($asientos) > 0) {
                    //Si se cumple esta condicion no se puede eliminar el clasificador
                    $response['errors'][] = array('code' => 7, 'errorcmp' => 'clasificador', 'id' => 
                        $idclasificador);
                } else {
                    /* Eliminar los campos contables del clasificador */
                    NomCamposContables::EraseByCondition("idclasificador = ?", array($idclasificador));
                    $result = NomClasificadores::Erase($idclasificador);
                    if (!$result) {
                        /* An error was ocurred */
                        //Hubo un error al eliminar el clasificador
                        $response['errors'][] = array('code' => 6, 'errorcmp' => 'clasificador'
                            , 'id' => $idclasificador);
                    } else {
                        $response['success'][] = $idclasificador;
                    }
                }
            }
        } else {
            /* No data to delete */
            //No hay datos para eliminar
            $response['errors'][] = array('code' => 4, 'errorcmp' => 'clasificador', 'id' => $idclasificador);
        }
        return $response;
    }

    /**
     * Inserta un Clasificador.
     * 
     * @param array $post Arreglo con los datos del clasificador
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function add($post)
    {
        //Si el arreglo de errors tiene valores es que ha habido
        //errores en el proceso
        $response = array('errors' => array(), 'success' => array());

        if (!empty($post['nombre']) && !empty($post['ruta']) && !empty($post['referenciaclase']) &&
                !empty($post['idsubsistema']) && !empty($post['camposcontables'])) {
            $flagmodify = FALSE;
            $alreadyExist = FALSE;

            /* Si se esta modificando */
            if (!empty($post['id']) && is_numeric($post['id'])) {
                $objeto = Doctrine::getTable('NomClasificadores')->find($post['id']);
                $flagmodify = TRUE;
            } else {
                $objeto = new NomClasificadores();
            }

            $estructura = $this->global->Estructura->idestructura;
            if ($post['idestructura']) {
                $estructura = $post['idestructura'];
            }
            $idsubsistema = $post['idsubsistema'];

            $condition = array("idsubsistema = ? AND idestructuracomun = ? AND nombre=?");
            $params = array($idsubsistema, $estructura, $post['nombre']);

            if (!empty($post['id'])) {
                $condition[] = 'idclasificador!=?';
                $params[] = $post['id'];
            }

            $result = NomClasificadores::GetByCondition(implode(' AND ', $condition), $params, true);

            if(count($result)==0){
                //Reemplazar la ruta para dejar la ruta del componente
                $dirAplicaction = Zend_Registry::get('config')->dir_aplication;
                $rutaReemplazada = '/' . str_replace($dirAplicaction, '', $post['ruta']);
                $rutaReemplazada = str_replace('//', '/', $rutaReemplazada);

                if (!$flagmodify) {
                    $conditions = 'ruta= ? AND referenciaclase = ? AND idestructuracomun = ? AND idsubsistema = ?';
                    $params = array($rutaReemplazada, $post['referenciaclase'], $estructura, $post['idsubsistema']);

                    $check = NomClasificadores::GetByCondition($conditions, $params, TRUE);

                    $alreadyExist = count($check);
                }

                if (!$alreadyExist) {
                    $objeto->nombre = $post['nombre'];
                    $objeto->descripcion = isset($post['descripcion']) && !empty($post['descripcion']) ?
                        $post['descripcion'] : NULL;
                    $objeto->ruta = $rutaReemplazada;
                    $objeto->referenciaclase = $post['referenciaclase'];
                    $objeto->idsubsistema = $post['idsubsistema'];
                    $objeto->idestructuracomun = $estructura;

                    $clasificador = $objeto->persist();

                    if (!is_numeric($clasificador->idclasificador)) {
                        /* Ocurrio un error al insertar el clasificador */
                        $response['errors'][] = array('code' => 3, 'errorcmp' => 'clasificador'
                                                      , 'nombre' => $post['nombre']);
                    } else {
                        $camposcontables = json_decode(stripslashes($post['camposcontables']), TRUE);
                        $idscamposEliminados = json_decode($post['camposEliminados'], TRUE);
                        $this->addAccountingFields($camposcontables, $idscamposEliminados, $flagmodify
                            , $clasificador, $response);
                    }
                } else {
                    /* Ya existe un clasificador para esa clase en esa ruta */
                    $response['errors'][] = array('code' => 5, 'errorcmp' => 'clasificador');
                }
            }else{
                /* Ya existe un clasificador con este nombre */
                $response['errors'][] = array('code' => 8, 'errorcmp' => 'clasificador');
            }
        } else {
            /* Faltan datos para adicionar el clasificador */
            $response['errors'][] = array('code' => 2, 'errorcmp' => 'clasificador');
        }
        return $response;
    }

    /**
     * Registra los campos contables de un Clasificador.
     * 
     * @param array $campos Arreglo con los datos de los campos contables
     * @param int $idclasificador Identificador del clasificador
     * @param array $response Arreglo con la respuesta de la funcion
     * @throws Doctrine_Exception
     * @return void
     */
    private function addAccountingFields($campos, $idscamposEliminados, $flagmodify, $clasificador, &$response)
    {
        $idclasificador = $clasificador->idclasificador;
        //Si el arreglo de errors tiene valores es que ha habido
        //errores en el proceso
        $camposModel = new CamposModel();
        //Accion para eliminar los campos contables cuando se modifica
        //el clasificador
        $idscamposdel = json_decode(stripslashes($idscamposEliminados['ids']), TRUE);
        if (count($idscamposdel) > 0) {
            $responsedel = $camposModel->delete($idscamposEliminados);
            //Hubo un error al eliminar los campos contables
            //pertenecientes al clasificador que se esta modificando
            if (count($responsedel['errors']) > 0) {
                $response['errors'] = array_merge($response['errors'], $responsedel['errors']);
            }
        }

        foreach ($campos as $campo) {
            $res = $camposModel->add($campo, $idclasificador);
            if (count($res['errors']) > 0) {
                //Buscar el error 6 del adicionar del campo contable
                //<<<El clasificador ya posee este campo contable>>>
                //Si lo encuentra continúa la ejecución del adicionar
                //del clasificador, pues este ya existe, pero adicionado por campos
                //contables, si no encuentra el error 6 entonces se le adicionan los
                //errores a los errores de los clasificadores.
                foreach ($res['errors'] as $error) {
                    $search = array_search(6, $error);
                    if ($search === FALSE) {
                        /* Ocurrio un error al insertar los campos contables */
                        $response['errors'] = array_merge($response['errors'], $res['errors']);
                    } else {
                        //Encontró el error y se modifica el campo contable
                        $idcampo = $error['id'];
                        $campo['id'] = $idcampo;
                        $respuesta = $camposModel->add($campo, $idclasificador);
                        /* Ocurrio un error al insertar el campo */
                        $response['errors'] = array_merge($response['errors'], $respuesta['errors']);
                    }
                }
            }
        }
        $cantCamp = count($campos);
        $cantError = count($response['errors']);
        //Esta condicion se cumple nada mas cuando esta adicionando el clasificador
        if ($cantCamp === $cantError && !$flagmodify) {
            NomClasificadores::EraseByCondition('idclasificador = ?', $idclasificador);
        } else {
            //En este caso puede estar modificando o adicionando
            if (count($response['errors']) === 0) {
                $response['success']['clasificador'] = $clasificador->toArray();
            }
        }
    }

    /**
     * Carga los directorios del marco de trabajo, para poder cargar la clase
     * que mapea.
     * 
     * @param array $request Arreglo con la ruta del directorio a cargar
     * @return mixed Arreglo con los datos para cargar el árbol de directorios
     */
    public function cargardir($request)
    {
        $ruta = $request['node'];
        $arrtreedirectorios = array();
        $arrtreefiles = array();

        if ($ruta === '0') {
            $dirAplication = Zend_Registry::get('config')->dir_aplication;
            //toma la ruta de todos los directorios que hay en dir_aplication
            $arrdirectorios = glob($dirAplication . '*', GLOB_ONLYDIR);

            foreach ($arrdirectorios as $value) {
                $arrexplode = explode('/', $value);
                $cantexplode = count($arrexplode);
                $arrtreedirectorios[] = array(
                    'id' => $value,
                    'text' => $arrexplode[$cantexplode - 1],
                    'leaf' => FALSE
                );
            }
        } else {
            //toma la ruta de todos los directorios que hay en $ruta
            $arrdirectorios = glob($ruta . '/*', GLOB_ONLYDIR);
            //Ciclo que controla los directorios
            foreach ($arrdirectorios as $dir) {
                $explodedir = explode('/', $dir);
                $cantexplodedir = count($explodedir);

                if ($explodedir[$cantexplodedir - 1] === 'models' ||
                        $explodedir[$cantexplodedir - 1] === 'controllers') {

                    $arrphpfiles = glob($ruta . '/models/domain/*.php');
                    foreach ($arrphpfiles as $file) {
                        $arrclasesbyfile = get_class_name_from_file($file, TRUE);
                        foreach ($arrclasesbyfile as $class) {
                            $arrtreefiles[] = array(
                                'id' => $file,
                                'text' => $class,
                                'leaf' => TRUE
                            );
                        }
                    }
                    break;
                } else {
                    $arrtreedirectorios[] = array(
                        'id' => $dir,
                        'text' => $explodedir[$cantexplodedir - 1],
                        'leaf' => FALSE
                    );
                }
            }
        }
        return (!empty($arrtreefiles)) ? $arrtreefiles : $arrtreedirectorios;
    }

    /**
     * Carga las columnas de la tabla correspondiente a una modelo seleccionada
     * 
     * @param array $request Arreglo con los parámetros de le petición.
     * @return array Arreglo con los campos de la tabla
     * @throws Doctrine_Exception.
     */
    public function loadTableColumns($request)
    {
        $paging = array();
        if (!empty($request['path'])) {
            $path = $request['path'];
            $this->inludeDomainModel($path);
            $classes = get_class_name_from_file($path, TRUE);
            $data = array();
            if (is_array($classes) && !empty($classes)) {
                foreach ($classes as $i => $class) {
                    $obj = new $class();
                    $fields = $obj->getTable()->getColumnNames();
                    foreach ($fields as $j => $value) {
                        $data[] = array(
                            'idrecordcombo' => $i . $j,
                            'clase' => $class,
                            'campo' => $value
                        );
                    }
                }
            }
            $paging['success'] = TRUE;
            $paging['total'] = count($data);
            $paging['data'] = $data;
        }
        return $paging;
    }

    /**
     * Incluye un fichero y sus dependencias
     * 
     * @param string $path Ruta hasta el fichero.
     * @param string [$nameParentsClass] Nombre de las clases padres.
     * @return void
     */
    static public function inludeDomainModel($path, $nameParentsClass = NULL)
    {
        if (file_exists($path)) {
            $arraypath = explode('/', $path);
            /* Obtengo los nombres de las clases de las que hereda */
            $nameParentsClass = is_null($nameParentsClass) ? get_parents_from_file($path, TRUE) :
                    array($nameParentsClass);

            $pattern = implode('/', array_splice($arraypath, 0, count($arraypath) - 1));
            $pattern .= '/generated/*.php';
            /* Buscar las bases que sean necesaria para instanciar */
            foreach (glob($pattern) as $file) {
                /* Obtengo los nombre de las clases del fichero */
                $classesname = get_class_name_from_file($file, true);
                if ($classesname !== 0 && $classesname !== -1) {
                    /* encuentro los nombres de clases comunes entre cada fichero base y el domain */
                    if (!is_array($nameParentsClass)) {
                        $nameParentsClass = array();
                    }

                    /* Esto es para intersectar haciendo una comparacion de los nombres insensibles
                     * a mayúsculas y minúsculas  
                     */
                    $communClases = array_uintersect($classesname, $nameParentsClass, "strcasecmp");

                    if (count($communClases) > 0) {
                        /* incluyo la base */
                        include_once $file;
                    }
                }
            }
            /* incluyo la clase principal */
            include_once $path;
        }
    }

    /**
     * Carga los campos contables según el idclasificador
     * 
     * @param array $request arreglo que contiene los parámetros de la petición
     * @return array
     */
    public function cargarcampos($request)
    {
        $condition = "idclasificador = ?";
        $params = array($request['idclasificador']);
        $campos = NomCamposContables::GetByCondition($condition, $params, TRUE);

        //Agregar campo y clase al arreglo
        foreach ($campos as &$campo) {
            $arrexplode = explode('.', $campo['referencia']);
            $clase = $arrexplode[0];
            $nombcmapo = $arrexplode[1];
            $campo['clase'] = $clase;
            $campo['campo'] = $nombcmapo;
            $campo['valid'] = TRUE;
        }

        //Esta condición es para verificar si me pasan la ruta del archivo
        //Si no me pasan la ruta es porque cargar campos no necesita cargar los campos
        if (!empty($request['ruta'])) {
            //Cargar las columnas pertenecientes al fichero
            //Este arreglo que se obtiene pertenece al combo que carga la columnas
            $dirAplication = Zend_Registry::get('config')->dir_aplication;
            $path = $dirAplication . $request['ruta'];
            $path = str_replace('//', '/', $path);
            $columns = $this->loadTableColumns(array('path' => $path));
        }

        return array(
            'campos' => array('total' => count($campos), 'data' => $campos),
            'columnas' => (!empty($columns)) ? $columns : array()
        );
    }

    public function test($param)
    {
        return 'Hola Mundo ' . $param;
    }

}
