<?php

/**
 *  Clase encargada de implementar los servicios del componente de bÃºsqueda de documentos en Alfresco
 *
 * @author    Dalian Sanchez
 * @package   gesdoc
 * @copyright UCID Cuba
 * @version   1.0-0
 */
class GestioncontenidoService
{
    private $_contenidoModel = false;
    private $_subversionModel = false;
    private $_repositoryConection = false;
    /**
     * Contructor de la clase
     */
    function GestioncontenidoService()
    {
        $this->_repositoryConection=$this->obtenerConexionGD('yismel','yismel.2019');
        return $this;
    }
    function probar()
    {
 	return $this->adicionarEspacioTrabajo('11453d89-f08c-4afc-ad11-324cd300b7f6','ContrataciÃ³n','Contratos',array());
    }	
    function obtenerConexionGD($user=null,$pass=null){
	try{
        if(!isset($user))
          $user =$_SESSION ['Quarseg'] ['usuario'];
        if(!isset($pass))
        {
          $RSA = new ZendExt_RSA_Facade ();
          $pass = $RSA->decrypt($_SESSION ['Quarseg'] ['passw']);
        }
        $datAlf = parse_ini_file('conf.ini');
        $secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 's' : '';
        $conexion = new APIAlfresco();
        $url = "http://" . $datAlf["ALF_IP"] . ':' . $datAlf["ALF_PORT"] . '/alfresco/cmisatom';	
        $conexion->connect($url, $user, $pass);
        return $conexion;
	}
	catch(Exception $e)
	{
	  throw $e;
	}
    }
    function getContenidoModel()
    {
        if ($this->_contenidoModel === false) {
            return $this->_contenidoModel = new GestioncontenidoModel();
        }
        return $this->_contenidoModel;
    }
    function obtenerBase64Documento($identificadorNodo) {
         return  $this->getContenidoModel()->obtenerBase64Documento($identificadorNodo);
    }
    function getContent($identificadorNodo) {
        return  $this->getContenidoModel()->getContent($identificadorNodo);
    }
    function getSubversionModel()
    {
        if ($this->_subversionModel === false) {
            return $this->_subversionModel = new SubversionModel();
        }
        return $this->_subversionModel;
    }

    function devolverJSContenido()
    {
        $path='apps/gestordocumental/gestionArchivo/gestionContenido/views/scripts/gestioncontenido/gestioncontenido5.2.phtml';
        $dir_abs_mt = str_replace('//','/', dirname($_SERVER['DOCUMENT_ROOT'] . '..') . '/');
        $dirPHTML = $dir_abs_mt . $path;
	try
	   {
		if(file_exists($dirPHTML))
		{
          	   $myfile = fopen($dirPHTML, "r") or die("Unable to open file!");
		   $content=fread($myfile,filesize($dirPHTML));
		   fclose($myfile);
		   return $content;
		}
		else 
	   	return "El fichero o plantilla $dirPHTML no existe o no se puede leer.";
	   }
	 catch(Exception $e)
	 {
	   return $e->getMessage();
	 }
    }
    function obtenerAutenticacion($user,$pass)
    {
        return false;
    }
    function estaAutenticadoUsuarioActual()
    {
        return true;
    }
    function pingAlfrescoServices()
    {
        return true;
    }

    function obtenerPropiedadesTipoDocumento($tituloTipo)
    {
        return array();
    }

    function obtenerNodo($identificadorNodo)
    {
        return array();
    }
    function obtenerContenidos($parametros, $idDominio=null, $idEstructura=null)
    {
        $id=$parametros['id'];	
	if($id=='raiz')
	{
	  $arrayInfoRepo = $this->_repositoryConection->repository->workspace->repositoryInfo;
          $id = $arrayInfoRepo["cmis:rootFolderId"];
	}
	return $this->_repositoryConection->getChildrenId($id);
    }

    /**
     * Obtiene los Temas del Foro
     *
     * @return json
     */
    function obtenerTemas($idNodo, $peticion, $start, $limit)
    {
        return array();
    }

    /**
     * Obtiene los Mensajes de un tema
     *
     * @return json
     */
    function obtenerMensajes($idTema, $start, $limit)
    {
        return array();
    }

    /**
     * Gestionar un foro
     *
     * @return json
     */
    function gestionarForo($idNodo, $nombreForo, $nombreTema, $mensaje, $peticion)
    {
        return array();
    }

    /**
     * Ejecuta las acciones de un flujo de trabajo
     *
     * @return json
     */
    function ejecutarAccionesFlujo($idnodo, $arrayAcciones)
    {
        return array();
    }

    /**
     * Resetea todas las categorias de un Nodo
     *
     * @param id $_POST
     *            - Id del Nodo
     *
     * @return json
     */
    function actualizarCategoriasNodo($arrayAcciones, $idnodo)
    {
        return array();
    }

    /**
     * Elimina un elemento de contenido del sistema (Espacios de trabajo o
     * documento)
     *
     * @param array $_POST
     *            - Datos enviados del cliente
     *
     * @return json
     */
    function eliminarElementosContenido($contenidos)
    {
        return $this->_repositoryConection->eliminarContenido($contenidos);
    }

    /**
     * Pega todo el contenido del portapapeles en el espacio de trabajo
     * correspondiente.
     *
     * @param array $_POST
     *            - Datos enviados del cliente
     *
     * @return json
     * @throws ZendExt_Exception (GESDOCFT01, GESDOCFT02)
     */
    public function pegarTodo($identificadorNodoPadre, $nodosPegar)
    {
        return array();
    }

    /**
     * Pega el nodo recibido en el espacio de trabajo correspondiente.
     *
     * @param array $_POST
     *            - Datos enviados del cliente
     *
     * @return json
     * @throws ZendExt_Exception (GESDOCFT01, GESDOCFT02)
     */
    public function pegar($identificadorNodo, $identificadorNodoPadre, $nombreNodo, $operacionOrigen)
    {
        return array();
    }

    /**
     * Modifica los datos de un espacio determinado.
     *
     * @param array $_POST
     *            - Datos enviados del cliente
     *
     * @return json
     */
    function modificarEspacio($identificadorNodo, $nombre, $descripcion)
    {
        return $this->_repositoryConection->modificarContenido($identificadorNodo,$nombre,$descripcion,array());       
    }
    
    function downloadFile($idnode)
    {
        return $this->_repositoryConection->downloadFile($idnode);       
    }

    function adicionarEspacioTrabajo(
        $identificadorNodoPadre, $nombre, $descripcion = '', $propiedadesAdicionales = array()
    )
    {
        return $this->_repositoryConection->adicionarEspacioTrabajo($identificadorNodoPadre,$nombre,$descripcion,$propiedadesAdicionales);
    }
    function searchOnRepository($query="SELECT * FROM cmis:document")
    {
	return $this->_repositoryConection->query($query);
    }
    function contentExists($id)
    {
      $documents=$this->searchOnRepository("SELECT * FROM cmis:document WHERE cmis:objectId=$id");
      $folders=$this->searchOnRepository("SELECT * FROM cmis:folder WHERE cmis:objectId=$id");
      return array_merge($documents,$folders);
    }
	
    /**
     * Modifica los datos de un documento
     *
     * @param array $_POST
     *            - Datos enviados del cliente
     *
     * @return json
     */
    function modificarDocumento($identificadorNodo, $nombre,$descripcion, $propiedadesAdicionales)
    {
        return $this->_repositoryConection->modificarContenido($identificadorNodo,$nombre,$descripcion,$propiedadesAdicionales);
    }
    /**
     * Firmar Documentos
     *
     * @param array $_POST
     *            - Datos enviados del cliente
     *
     * @return json
     */
    function firmarDocumentos($params, $versionar)
    {
        return array();
    }

    /**
     * Sube los documentos al sistema
     *
     * @param array $_POST
     *            - Datos enviados del cliente
     *
     * @return json
     */
    function adicionarDocumento(
        $identificadorNodo, $descripcion, $paramTipoDocumento, $paramPropiedadesTipoDocumento, $fichero,
        $nombreDocumento, $datosregistro, $procedencia, $numeroRegistro
    )
    {
        print('/*este adicionar*/');
        try {            
            $properties=$paramPropiedadesTipoDocumento;
            $type =isset($properties['type'])?$properties['type']:'application/octet-stream';
            $this->_repositoryConection->setFolderById($identificadorNodo);
            //print_r($fichero['tmp_name']);die;
            $content=file_get_contents($fichero['tmp_name']);
            return $this->_repositoryConection->createFile($nombreDocumento,$properties, $content, $type, array());
        } catch (Exception $ex) {
            return array("success" => false, 'msg' => $ex->getMessage());
        }
    }

    function descubrirExistenciaNodo($identificadorNodo)
    {
        return array();
    }

    /**
     * Devuelve todos los tipos mime del sistema
     *
     * @return json
     */
    function obtenerTiposMime()
    {
        return array();
    }

    /**
     * Devuelve todas las categorias a partir de una categoria como referencia
     *
     * @param array $_POST
     *            - Datos enviados del cliente
     *
     * @return json
     */
    function obtenerCategorias($identificadorCategoria)
    {
        return array();
    }

    /**
     * Abre un documento
     *
     * @param array $_POST
     *            - Datos enviados del cliente
     *
     * @return json
     * @throws ZendExt_Exception (GESDOCFT01, GESDOCFT02)
     */
    function abrirdocumento($identificadorNodo)
    {
       return $this->_repositoryConection->abrirdocumento($identificadorNodo);
    }

    /**
     * Devuelve los detalles de un contenido (espacios de trabajo o documentos)
     *
     * @param array $_POST
     *            - Datos enviados del cliente
     *
     * @return json
     * @throws ZendExt_Exception (GESDOCFT01, GESDOCFT02)
     */
    function obtenerDetallesContenido($identificadorNodo)
    {
        return $this->_repositoryConection->obtenerDetallesContenido($identificadorNodo);
    }

    /**
     * Devuelve los permisos de un usuario sobre un nodo
     *
     * @param array $_POST
     *            - Datos enviados del cliente
     *
     * @return json
     */
    function obtenerPermisosUsuarioSobreNodo($identificadorNodo)
    {
        return array();
    }

    /**
     * Devuelve un arreglo con los espacios de trabajo
     *
     * @param string $nodos
     *            - Identificador del nodo
     *
     * @return array
     */
    function obtenerEspaciosTrabajo($nodos)
    {
        return array();
    }

     /**
     * Verifica si un contenido (nodo) es un fuchero (documento)
     *
     * @param
     *            cNodo - Nodo de Alfresco
     *
     * @return bool
     */
    public function esFichero($nodo)
    {
        return true;
    }

    /**
     * Devuelve todos los nodos de tipo 'fichero'
     *
     * @param
     *            array cNodo - Nodos de Alfresco
     *
     * @return array cNodo
     */
    public function obtenerFicheros($nodos)
    {
        return array();
    }     
    public function obtenerTiposDocumentos()
    {
        return array();
    }

    function displayFile($identificadorNodo)
    {
        $this->_repositoryConection->displayFile($identificadorNodo);
    }
}
 

