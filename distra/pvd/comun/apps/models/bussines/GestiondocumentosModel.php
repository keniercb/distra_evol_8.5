<?php
$dirwww = $_SERVER['DOCUMENT_ROOT'];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirrelmt = '/';
//Direccion absoluta del marco de trabajo
$dirabsmt = str_replace('//', '/', dirname($dirwww . '..') . '/' . $dirrelmt);
$config['include_path'] = get_include_path();

$d = explode('web/',$dirabsmt);
$config['include_path'].= ''. PATH_SEPARATOR . $d[0] . 'apps/pvd/comun/recursos/alfrescoAPI';
set_include_path($config['include_path']);

class GestiondocumentosModel extends ZendExt_Model
{
    private $alfresco;


    public function __construct()
    {
       // $this->apiAlfresco = new APIAlfresco();
        $datAlf = parse_ini_file('configAlfresco.ini');
        $secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 's' : '';
        $this->alfresco = new APIAlfresco();
        $url = "http".$secure."://" . $datAlf["ALF_IP"] . ':' . $datAlf["ALF_PORT"] . '/alfresco/cmisatom';
        $this->alfresco->connect($url, $datAlf["ALF_USER"], $datAlf["ALF_PASS"]);
    }

    public function setUp()
    {
        parent::ZendExt_Model();

    }

    private function clearDirectory($directory)
    {
//       try{
            $files = glob($directory.'/*'); //obtenemos todos los nombres de los ficheros
            foreach($files as $file){
                if(is_file($file))
                    unlink($file); //elimino el fichero
            }
            return true;
//       }
//       catch(Exception $e){
//           print_r($e->getMessage());die;
//       }
    }

//    private function extractSpecialCharacters($word)
//    {
//        $word = trim($word);
//
//        $word = str_replace(
//            array('á', 'à', 'ä', 'â', 'ª', 'Á', 'À', 'Â', 'Ä'),
//            array('a', 'a', 'a', 'a', 'a', 'A', 'A', 'A', 'A'),
//            $word
//        );
//
//        $word = str_replace(
//            array('é', 'è', 'ë', 'ê', 'É', 'È', 'Ê', 'Ë'),
//            array('e', 'e', 'e', 'e', 'E', 'E', 'E', 'E'),
//            $word
//        );
//
//        $word = str_replace(
//            array('í', 'ì', 'ï', 'î', 'Í', 'Ì', 'Ï', 'Î'),
//            array('i', 'i', 'i', 'i', 'I', 'I', 'I', 'I'),
//            $word
//        );
//
//        $word = str_replace(
//            array('ó', 'ò', 'ö', 'ô', 'Ó', 'Ò', 'Ö', 'Ô'),
//            array('o', 'o', 'o', 'o', 'O', 'O', 'O', 'O'),
//            $word
//        );
//
//        $word = str_replace(
//            array('ú', 'ù', 'ü', 'û', 'Ú', 'Ù', 'Û', 'Ü'),
//            array('u', 'u', 'u', 'u', 'U', 'U', 'U', 'U'),
//            $word
//        );
//
//        $word = str_replace(
//            array('ñ', 'Ñ', 'ç', 'Ç'),
//            array('n', 'N', 'c', 'C'),
//            $word
//        );
//
//        $word = str_replace(
//            array('\\', '¨', 'º', '~',
//                '#', '@', '|', '!', '"',
//                '$', '%', '&', /*'/',*/
//                '(', ')', '?', "'", '¡',
//                '¿', '[', '^', '`', ']',
//                '+', '}', '{', '¨', '´',
//                '>', '< ', ';', ',', ':', '-', '·', '¬', '_'),
//            '',
//            $word
//        );
//        $word = str_replace(' ', '%20', $word); //HTTP request accept blank spaces as '%20' symbol. Literal blank space is invalid
//
//        return $word;
//    }

    private function moveDocumentFromTemp($tmpFile, $fileName, $temporalDirectory = '/pvd/comun/documentos')
    {
        $directorioImportar = str_replace('web', 'apps', $_SERVER['DOCUMENT_ROOT']) . $temporalDirectory;

        if(!file_exists($directorioImportar))
        {
            mkdir($directorioImportar, 0777, true);
        }

        try{
           $this->clearDirectory($directorioImportar);
        }
        catch(Exception $e){
           throw new CleanDirectoryException('Error al limpiar el directorio.', 2);
        }

        try{
            $name = utf8_decode($fileName);
            $targetFile = $directorioImportar . DIRECTORY_SEPARATOR . $name;
            move_uploaded_file($tmpFile, $targetFile);
            return utf8_encode($targetFile);
        }
        catch(Exception $e){
            throw new DocumentMoveException('Error al mover el documento desde la ubicación temporal en el servidor.', 3);
        }


    }

    public function uploadDocument($tmpFile, $fileName, $idRootWorkSpace, $denomRootWorkSpace, $documentSavePath, $temporalDirectory)
    {
        $targetFile = $this->moveDocumentFromTemp($tmpFile, $fileName, $temporalDirectory);

        $arrDocumentSavePath = explode('/', $documentSavePath);
        if($arrDocumentSavePath[0] == $denomRootWorkSpace)
            array_shift($arrDocumentSavePath);
        $folderPath = '/'.$denomRootWorkSpace;
        if($denomRootWorkSpace != $documentSavePath)
        {
            $folderPath .= '/'.implode('/',$arrDocumentSavePath);
//print_r();die;
            $idworkspaceActual = $idRootWorkSpace;
            foreach($arrDocumentSavePath as $k => $folder){
                $workspace = $this->alfresco->adicionarEspacioTrabajo($idworkspaceActual,$folder,'', array());
                if(is_array($workspace['identificadorNodoPadre']))
                    $idworkspaceActual = $this->extractId($workspace['identificadorNodoPadre']['id']);
                else
                    $idworkspaceActual = $this->extractId($workspace['identificadorNodoPadre']->id);
            }
        }

//        print_r( $this->alfresco->parentFolder->properties['cmis:path']);
//        print_r('-----');
//        print_r($documentSavePath);
//        print_r('-----');
//        print_r( $folderPath);
//        die;
        if($this->alfresco->parentFolder->properties['cmis:path'] != $folderPath){
//            print_r('ENTRO');die;
            $this->alfresco->setFolderByPath($folderPath,array());
        }
            

        try{
            $document = $this->alfresco->uploadFile($targetFile);
        }
        catch(CmisConstraintException $e){
           throw new DocumentExistsException('El documento ya existe.', 4);
        }
        catch (Exception $e)
        {
            throw new Exception('El documento ya existe 1.', 4);
        }

        return array('nombredocumento' => $fileName, 'iddocumento' => $this->extractId($document->id));
//        if($res){
//
//        }
//        else{
//            return $res;//error al
//        }
    }

    private function extractId($workspace)
    {
        return explode('//SpacesStore/', $workspace)[1];
    }

    private function extractType($cmisObjectTypeId)
    {
        return explode(':', $cmisObjectTypeId)[1];
    }

    public function viewDocument($id)
    {
        return $this->alfresco->abrirdocumento($id);

    }

    public function deleteDocument($arrIds, $elementtype)
    {

        try{
            foreach ($elementtype as $k => $item) {
                if($item == 'folder'){
                    $this->alfresco->eliminarTreeContenido(array(0 => $arrIds[$k]));
                }
                else
                    if($item == 'document')
                    {
                        $this->alfresco->eliminarContenido(array(0 => $arrIds[$k]));
                    }
            }
            return true;
        }
        catch(Exception $e){
            throw new Exception('Error al eliminar fichero o directorio.', 4);
        }
    }

    public function browseFolder($folderPath)
    {

       try{
           $this->alfresco->setFolderByPath($folderPath);
            $folderFiles = $this->alfresco->getChildrenFolder();
       }
       catch(CmisObjectNotFoundException $w){
          return array();
       }
       catch(Exception $e){
          return array();
       }
//print_r($folderFiles);die;
        $folderFilesView = array();
        if(is_array($folderFiles->objectList)){
            foreach ($folderFiles->objectList as $folderFile) {
                $type = $this->extractType($folderFile->properties['cmis:objectTypeId']);
                $imageurl = '';
                switch ($type){
                    case 'folder':
                        $imageurl = '/pvd/comun/views/js/gestiondocumentoscomp/images/folder1.png';
                        break;
                    default:
                        switch ($folderFile->properties['cmis:contentStreamMimeType']){
                            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                                $imageurl = '/pvd/comun/views/js/gestiondocumentoscomp/images/xsl.png';
                                break;
                            case 'image/png':
                                $imageurl = '/pvd/comun/views/js/gestiondocumentoscomp/images/png.png';
                                break;
                            case 'image/jpeg':
                                $imageurl = '/pvd/comun/views/js/gestiondocumentoscomp/images/jpg.png';
                                break;
                            case 'application/msword':
                                $imageurl = '/pvd/comun/views/js/gestiondocumentoscomp/images/doc.png';
                                break;
                            case 'application/x-rar':
                                $imageurl = '/pvd/comun/views/js/gestiondocumentoscomp/images/rar.png';
                                break;
                            case 'audio/mpeg':
                                $imageurl = '/pvd/comun/views/js/gestiondocumentoscomp/images/mp3.png';
                                break;
                             case 'application/pdf':
                                $imageurl = '/pvd/comun/views/js/gestiondocumentoscomp/images/pdf.png';
                                break;
                            default:
                                $imageurl = '/pvd/comun/views/js/gestiondocumentoscomp/images/file.png';
                                break;
                        }
                       // $imageurl = '/pvd/comun/views/js/gestiondocumentoscomp/images/file.png';
                        break;
                }

                $tempArray = array(
                    'iddocumento' => $this->extractId($folderFile->id),
                    'nombredocumento' => $folderFile->properties['cmis:name'],
                    'type' => $type,
                    'imageurl' => $imageurl
                );
                array_push($folderFilesView, $tempArray);
            }
        }
        return $folderFilesView;
    }

    public function renameDocument($id, $newname)
    {
        try{
            $this->alfresco->modificarContenido($id, $newname);
            return true;
        }
        catch(Exception $e){
            throw new Exception('Error al modificar el nombre del fichero o directorio.', 4);
        }
    }

}