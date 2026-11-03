<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of LogisticaImagenHelper
 *
 * @author kenier
 */
class LogisticaImagenHelper implements ISingletonClass
{

    const DIR_IMG = '/logistica/utiles/tmpimg';
    const EXT_JPG = '.jpg';
    const EXT_PNG = '.png';

    //put your code here
    /**
     * Instancia para garantizar el acceso singleton a la clase
     *
     * @var LogisticaImagenHelper
     */
    private static $instance = null;

    /**
     *
     * @var type 
     */
    private $dbConnection;

    /**
     * Constructor de la clase
     */
    private function __construct()
    {
        $this->dbConnection = LogisticaDoctrineHelper::__init()->getConnection();
    }

    /**
     * Metodo que devuelve la
     */
    public static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new LogisticaImagenHelper;
        }
        return self::$instance;
    }

    public function getTmpDirIMG()
    {
        return $_SERVER['DOCUMENT_ROOT'] . '' . self::DIR_IMG;
    }

    /*
     * Permite guardar una imagen en DB.     
     *
     * @param string    Camino al archivo, si es de un archivo subido es algo como /tmp/phpWa32dz y se obtiene dentro de $_FILES.
     * @param string    Tabla en la que se guardará la imagen. Incluir el esquema.
     * @param string    Nombre del campo que guarda la imagen, debe ser de tipo bytea.
     * @param array     Otros datos que deben guardarse i.e array('campox' => 'valorx')
     * @author  Lester González
     * @author Rafael Espinosa (QUIMEFA)
     */

    public function insertarImagenDb($filename, $tabla = false, $campoimagen = false, $otrosdatos = array(),
        $idtabla = false, $secuencia = false, $icono = false
    )
    {
        $tamanno = getimagesize($filename);
        if ($tamanno['mime'] == image_type_to_mime_type(IMAGETYPE_JPEG)) {
            $imagen = $valores = $campos = $checksum = '';
            $this->getDatosFromImagen($filename, $icono, $otrosdatos, $imagen, $campos, $valores, $checksum);
            $tabla = ($tabla === false) ? 'mod_logistica.nom_imagen' : $tabla;
            $id = ($idtabla === false) ? 'idimagen' : $idtabla;
            $campoimagen = ($campoimagen === false) ? 'imagen' : $campoimagen;
            //$this->dbConnection = LogisticaDoctrineHelper::__init()->getConnection();
            $sql = "SELECT $id FROM $tabla WHERE checksum = '$checksum'";
            $query = $this->dbConnection->execute($sql);
            $idimagen = $query->fetchAll(PDO::FETCH_COLUMN);
            $idimagen = $idimagen[0];
            if (empty($idimagen)) {
                $sql = "INSERT INTO $tabla (checksum, $campoimagen $campos) VALUES ('$checksum', '$imagen' $valores)";
                $this->dbConnection->execute($sql);
                $sec = ($secuencia === false) ? 'mod_logistica.sec_nomimagen' : $secuencia;
                $idimagen = $this->dbConnection->lastInsertId($sec);
            }
            return array('idimagen' => $idimagen, 'imagen' => 'data:image/jpg;base64,' . $imagen);
        } else {
            // Extenciones validas, extenciones invalidas
            $mime = explode('\/', $tamanno['mime']);
            return array('jpeg', $mime[1]); //   jpeg | png
        }
    }

    private function getDatosFromImagen($fileName, $icono, $otroDatos, &$imagen, &$campos, &$valores, &$checksum)
    {
        $file = $this->resize(imagecreatefromjpeg($fileName), ($icono) ? 400 : 500, 400);
        imagejpeg($file, $fileName);
        $fp = fopen($fileName, "r");
        $contents = file_get_contents($fileName);
        $checksum = hash_hmac_file('sha256', $fileName, 's3cr3tk3y');
        fclose($fp);
        @unlink($fileName);
        $imagen = base64_encode($contents);
        $campos = '';
        $valores = '';
        if (!empty($otroDatos)) {
            $campoimagen = $campoimagen . ',';
            $campos = implode(array_keys($otroDatos));
            $valores = implode(array_values($otroDatos));
            $valores = ',' . $valores;
        }
    }

    public function resize($image, $width, $height)
    {
        $new_image = imagecreatetruecolor($width, $height);
        imagecopyresampled($new_image, $image, 0, 0, 0, 0, $width, $height, imagesx($image), imagesy($image));

        return $new_image;
    }

    public function obtenerImagenDb($idimagen, $tabla = false, $campoImagen = false, $idImagen = false)
    {
        $tb = ($tabla === false) ? 'mod_logistica.nom_imagen' : $tabla;
        $cmp = ($idImagen === false) ? 'idimagen' : $idImagen;
        $cmpImg = ($campoImagen === false) ? 'imagen' : $campoImagen;
        //$this->dbConnection = LogisticaDoctrineHelper::__init()->getConnection();
        $sql = "SELECT $cmpImg FROM $tb WHERE $cmp = $idimagen";
        $pdo = $this->dbConnection->execute($sql);
        $result = $pdo->fetchAll(PDO::FETCH_COLUMN);
        $Base64Img = 'data:image/jpg;base64,' . $result[0];
        return $Base64Img;
    }

    public function forceDownload($filename = '', $data = '')
    {
        if ($filename == '' OR $data == '') {
            return false;
        }
        // Try to determine if the filename includes a file extension.
        // We need it in order to set the MIME type
        if (false === strpos($filename, '.')) {
            return false;
        }
        // Grab the file extension
        $x = explode('.', $filename);
        $extension = end($x);
        // Set a default mime if we can't find it
        $mime = false;
        $mimes = false;

        if (!$mime) {
            $mime = 'image/jpeg';
        } else {
            $mime = (is_array($mimes[$extension])) ? $mimes[$extension][0] : $mimes[$extension];
        }

        // Generate the server headers
        if (strpos($_SERVER['HTTP_USER_AGENT'], "MSIE") !== false) {
            header('Content-Type: ' . $mime);
            header('Content-Disposition: attachment; filename=' . $filename);
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header("Content-Transfer-Encoding: binary");
            header('Pragma: public');
            header("Content-Length: " . strlen($data));
        } else {
            header('Content-Type: ' . $mime);
            header('Content-Disposition: attachment; filename=' . $filename);
            header("Content-Transfer-Encoding: binary");
            header('Expires: 0');
            header('Pragma: no-cache');
            header("Content-Length: " . strlen($data));
        }

        echo $data;
    }

    public function getImagenesIndicador($arrayImagenes, &$cacheImagenes)
    {
        $resultImagenes = array();
        foreach ($arrayImagenes as $nodo) {
            $cacheImagenes[$nodo['imagen']] = array_key_exists($cacheImagenes, $nodo['imagen']) ?
                $cacheImagenes[$nodo['imagen']] : $this->obtenerImagenDb($nodo['idimagen']);
            array_push(
                $resultImagenes,
                array(
                'idimagen' => $nodo['idimagenindicador'],
                'url' => $cacheImagenes[$nodo['imagen']]
                )
            );
        }
        return $resultImagenes;
    }

    public function buscarIconoEntidad($idEstructura)
    {
        $dirSeparator = '/';
        $sql = "select i.idicono, i.icono as imagen from mod_estructuracomp.nom_icono i 
                    inner join mod_estructuracomp.dat_estructura e on e.idicono = i.idicono 
                    where e.idestructura = {$idEstructura}";
        $pdoImagen = $this->dbConnection->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $pdoImagen = $pdoImagen[0];
        list($tipo, $base64Img) = explode(';', $pdoImagen['imagen']);
        list(, $base64Img) = explode(',', $base64Img);
        list(, $tipo) = explode('/', $tipo);
        mkdir($this->getTmpDirIMG());
        $fichero = $this->getTmpDirIMG() . $dirSeparator . $pdoImagen['idicono'] . '.' . $tipo;
		
        if (!file_exists($fichero)) {
            $base64Img = base64_decode($base64Img);
            file_put_contents($fichero, $base64Img);
        }
		$dirFile = LogisticaImagenHelper::DIR_IMG . $dirSeparator . $pdoImagen['idicono'] . '.' . $tipo;
		$sqlSelect = "select count(idestructura) as cant from mod_logistica.conf_general where urllogo = '{$dirFile}' "
            . "and idestructura = {$idEstructura}";
		$cantidad = $this->dbConnection->execute($sqlSelect)->fetchAll(PDO::FETCH_COLUMN);
		if($cantidad[0] == 0){
			$sqlUpdate = "update mod_logistica.conf_general set urllogo = '{$dirFile}' "
            . "where idestructura = {$idEstructura}";
			$this->dbConnection->execute($sqlUpdate);
		}
    }

    public function eliminarImagen($arrId,$idindicador){
        $arrId = implode(',',$arrId);
        $sql = "DELETE FROM mod_datosmaestros.dat_imagenindicador 
                WHERE idindicador = {$idindicador} 
                and idimagenindicador in ({$arrId})";
        $this->dbConnection->execute($sql);
        return true;
    }

}
