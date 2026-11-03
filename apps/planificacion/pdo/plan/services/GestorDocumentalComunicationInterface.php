<?php

/**
 * SeguridadComunicatorService
 *
 * Esta clase sirve como capa de abstracción
 * para la comunicación con el subsistema de seguridad.
 *
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Rodain Terrer Molina
 * @copyright (c) 2015, XETID
 * @version       1.0
 */
class GestorDocumentalComunicationInterface extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function saveDocument($idnodo)
    {
        try {
            if ($this->testGD()) {
                $documentos = [];
				
                foreach ($_FILES as $file) {
                  if ($file['name']) {
					    
                        $file['realname'] = $file['realname'] ? $file['realname'] : $file['name'];

                        $result=$this->alfresco->adicionarDocumento(
                            $idnodo, $file['realname'], $file['type'], [],$file,$file['realname'],null, null, null
                        );

                        if ($result->id) {
                            $documentos[] = array('id' => $result->id, 'name' => $file['name']);
                        } else {
                            return;
                        }
                    }
					else
					{
                           $documentos[] = array('id' =>1, 'name' =>'sadasdasdsa');
                    }
                }
                return $documentos;
            }
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function editDocument($idnodo, $parametros)
    {
        try {
            if($this->testGD()) {
                $nombre = $parametros['nombre'];
                $descripcion = $parametros['descripcion'] ? $parametros['descripcion'] : $nombre;
                $result = $this->alfresco->modificarDocumento($idnodo, $nombre, $descripcion, array());
                if (!$result['success']) {
                    throw new Exception('Ocurrio un error editando el documento', 336);
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getFile($params)
    {
        try {
            if ($this->testGD()) {
                return $this->alfresco->abrirdocumento($params['iddocument']);
            }
            return array('code' => 333, 'success' => false);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }
 public function getFileReales($params)
    {
		//print_r('asdasdas');die;
        try {
            if ($this->testGD()) {
				$ddd = explode(';',$params)[0];
				
                return $this->alfresco->downloadFile($ddd);
            }
           // return array('code' => 333, 'success' => false);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function getArchivo($idnodo)
    {
        try {
            if ($this->testGD()) {
                return $this->alfresco->devolverdocumento($idnodo);
            }
            return array('code' => 333, 'success' => false);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function delFile($idfile)
    {
        try {
            if ($this->testGD()) {
                return $this->alfresco->eliminarElementosContenido($idfile);
            }
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function testGD()
    {
        try {
            $dir2 = split("web", $_SERVER['DOCUMENT_ROOT']);
            $gcontserviceurl = '' . $dir2[0] .  'apps/alfresco/GestioncontenidoService.php';
            $apialfrescourl = '' . $dir2[0] .  'apps/alfresco/APIAlfresco.php';
            
            $d=file_exists($gcontserviceurl);
            $c=file_exists($apialfrescourl);
            
            if (file_exists($gcontserviceurl) && file_exists($apialfrescourl)) {
                require_once($gcontserviceurl);
                require_once($apialfrescourl);
                $this->alfresco = new GestioncontenidoService();
                return true;
            }
            return false;
        } catch (Exception $e) {
            return $e;
        }
    }

    public function devolverJSContenido()
    {
        if ($this->testGD()) {
            return $this->alfresco->devolverJSContenido();
        }
        return "";
    }

    public function CreateWorkSpace($idnodo, $nombre)
    {
        try {
            if($this->testGD()) {
                $nombre = $this->formatName($nombre);
                $result = $this->alfresco->adicionarEspacioTrabajo($idnodo, $nombre, $nombre, array());
                if (count($result['identificadorNodoPadre'])) {
                    $datoidespacio=gettype($result['identificadorNodoPadre'])=='array'?
                        $result['identificadorNodoPadre']['id']:
                        $result['identificadorNodoPadre']->id;
                    $idnodo = explode('/', $datoidespacio);
                    $idnodo = $idnodo[count($idnodo) - 1];
                }
                return $idnodo;
            }
            return array('code' => 333, 'success' => false);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getWorkSpace($node)
    {
        try {
            if($this->testGD()) {
                if ($node == '0') {
                    $node = 'raiz';
                }

                return $this->alfresco->obtenerContenidos(array('id' => $node));
            }
            return array('code' => 333, 'success' => false);
        } catch (Exception $e) {
            return array();
        }
    }

    public function getContenido($params)
    {
        try {
            $resultado = array();
            if($this->testGD()) {
                if ($params['idespaciotrabajo']) {
                    $params["id"] = $params['idespaciotrabajo'];
                    $params["tipoContenido"] = "contenidos";
                    $params["buscar"] = false;
                    $domain = $_SERVER['SERVER_NAME'];
                    $path = getcwd().'/*';
                    $pathnoborrar = getcwd().'/';
                    $files = glob($path); // get all file names
                    $archivonoborrar= $pathnoborrar.'index.php';
                    foreach($files as $file){
                     //print_r($file);die;
                    if(is_file($file))
                       
                       if($file != $archivonoborrar)
                       unlink($file); // delete file
                    }
                    $contenido = $this->alfresco->obtenerContenidos($params)->objectList;
                    foreach ($contenido as $doc) {
                        if ($doc->properties['cmis:objectTypeId'] == 'cmis:document') {
                            $temp=explode('/', $doc->id);
                            $params['iddocument'] = explode(';',$temp[count($temp)-1])[0];
                            //$result = $this->getFile($params);
                            $resultado[] = array(
                                'nombre' => $doc->properties['cmis:name'],
                                 'url'    => $doc->id,
                                'idnodo' => $temp[count($temp)-1],
                                'local'  => 0
                            );
                        }
                    }
                }
                return $resultado;
            }else{
                return array('code' => 333, 'success' => false);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }
 public function getContenidoDocuemtos($idespaciotrabajo)
    {
        try {
            
			//die('dsfdssdf');
            $resultado = array();
            if($this->testGD()) {
                if ($idespaciotrabajo) {
                    $params["id"] = $idespaciotrabajo;
                    $params["tipoContenido"] = "contenidos";
                    $params["buscar"] = false;
					$domain = $_SERVER['SERVER_NAME'];
                    $path = getcwd().'/*';
                    $pathnoborrar = getcwd().'/';
                    $files = glob($path); // get all file names
                    $archivonoborrar= $pathnoborrar.'index.php';
                    foreach($files as $file){
                     //print_r($file);die;
                    if(is_file($file))
                       
                       if($file != $archivonoborrar)
                       unlink($file); // delete file
                    }
                    //print_r($params);die;
                    $contenido = $this->alfresco->obtenerContenidos($params)->objectList;
                    //print_r($contenido);die;
                    foreach ($contenido as $doc) {
                        if ($doc->properties['cmis:objectTypeId'] == 'cmis:document') {
                            $temp=explode('/', $doc->id);
                            
                            $params['iddocument'] = explode(';',$temp[count($temp)-1])[0];
                            //$result = $this->getFile($params);
                            $resultado[] = array(
                                'nombre' => $doc->properties['cmis:name'],
                                'url'    => $doc->id,
                                'idnodo' => $temp[count($temp)-1],
                                'local'  => 0
                            );
                        }
                    }
                }
                //print_r($resultado);die;
                return $resultado;
            }else{
                return array('code' => 333, 'success' => false);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    private function formatName($nombre)
    {
        $conservar = '0-9a-z\_\s'; // juego de caracteres a conservar
        $regex = sprintf('~[^%s]++~i', $conservar); // case insensitive
        return preg_replace($regex, '', $nombre);
    }
}