<?php
/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage Común/Models/Bussines
 * @version    1.0
 */
class ComunImagesModel extends ZendExt_Model
{

    public function __construct()
    {
    }

    /*
     * Permite guardar una imagen en DB.
     *
     * @param string    Camino al archivo, si es de un archivo subido es algo como /tmp/phpWa32dz y se obtiene
     * dentro de $_FILES.
     * @param string    Tabla en la que se guardar\xE1 la imagen. Incluir el esquema.
     * @param string    Nombre del campo que guarda la imagen, debe ser de tipo bytea.
     * @param array     Otros datos que deben guardarse i.e array('campox' => 'valorx')
     * @author  Lester Gonz\xE1lez
     * @author Rafael Espinosa (QUIMEFA)
     */

    public static function insertarImagenDb(
        $filename, $tabla, $campoimagen, $otrosdatos, $idtabla = false, $secuencia = false, $icono = false
    )
    {
        try {
            $tamanno = getimagesize($filename);
            if ($tamanno['mime'] == image_type_to_mime_type(IMAGETYPE_JPEG)) {
                $file = self::resize(imagecreatefromjpeg($filename), ($icono) ? 400 : 500, 400);
                imagejpeg($file, $filename);
                $fp = fopen($filename, "r");
                $contents = file_get_contents($filename);
                $checksum = hash_hmac_file('sha256', $filename, 's3cr3tk3y');
                fclose($fp);
                @unlink($filename);
                $imagen = pg_escape_bytea($contents);
                $campos = '';
                $valores = '';
                if (!empty($otrosdatos)) {
                    $campoimagen = $campoimagen . ',';
                    $campos = implode(array_keys($otrosdatos));
                    $valores = implode(array_values($otrosdatos));
                    $valores = ',' . $valores;
                }
                $id = self::isId($idtabla);
                $conn = Zend_Registry::get('conexion');
                $sql = "SELECT $id FROM $tabla WHERE checksum = '$checksum'";
                $query = $conn->execute($sql);
                $idimagen = $query->fetchAll(PDO::FETCH_COLUMN);
                $idimagen = $idimagen[0];
                if (empty($idimagen)) {
                    $sql = "INSERT INTO $tabla (checksum, $campoimagen $campos)
                            VALUES ('$checksum', '$imagen' $valores)";
                    $conn->execute($sql);
                    $sec = self::isSecuencia($secuencia);
                    $idimagen = $conn->lastInsertId($sec);
                }

                return $idimagen;
            } else {
                // Extenciones validas, extenciones invalidas
                $mime = explode('\/', $tamanno['mime']);

                return array('jpeg', $mime[1]); // validas jpeg | png
            }

        } catch (Exception $e) {
            echo $e;
            die('pepe');
        }
    }

    /**
     * Verifica la secuencia
     *
     * @param $secuencia
     *
     * @return string
     */
    private static function isSecuencia($secuencia)
    {
        $sec = ($secuencia === false) ? 'mod_logistica.sec_nomimagen' : $secuencia;
        return $sec;
    }

    /**
     * Verifica el ID
     *
     * @param int $idtabla Idnetificador de tabla
     *
     * @return string
     */
    private static function isId($idtabla)
    {
        $id = ($idtabla === false) ? 'idimagen' : $idtabla;
        return $id;
    }

    /**
     * Permite obtener una imagen de DB.
     *
     * @param int  $idimagen
     * @param bool $tabla
     * @param bool $campo
     *
     * @return  void
     * @author  Rafael Espinosa (QUIMEFA)
     * @author  Lester Gonz\xE1lez
     */
    public static function obtenerImagenDb($idimagen, $tabla = false, $campo = false)
    {
        $tb = ($tabla === false) ? 'mod_logistica.nom_imagen' : $tabla;
        $cmp = ($campo === false) ? 'idimagen' : $campo;
        $conn = Zend_Registry::get('conexion');
        $sql = "SELECT imagen FROM $tb WHERE $cmp = $idimagen";
        $pdo = $conn->execute($sql);
        $result = $pdo->fetchAll(PDO::FETCH_COLUMN);
        $result = $result[0];
        $filepath = ini_get('upload_tmp_dir');
        if ($filepath === false OR $filepath === '') {
            $filepath = sys_get_temp_dir();
        }
        $filename = md5(uniqid(time())); //die(get_cfg_var('upload_tmp_dir'));
        $fichero = $filepath . '/' . $filename . '.jpg';
        //print_r($fichero);die;
        file_put_contents($fichero, $result); //pg_unescape_bytea($result)
        $img = imagecreatefromjpeg($fichero);

        self::force_download($filename, imagejpeg($img));


        //imagejpeg($img);
        @unlink($fichero);
    }

    /**
     * Guarda la imagen en la base de datos
     * @param int    $idimagen Identificador de im\xE1gen
     * @param bool   $tabla
     * @param bool   $campo
     * @param string $nomfich
     */
    public static function guardarImagenDbApp($idimagen, $tabla = false, $campo = false, $nomfich = '')
    {
        $tb = ($tabla === false) ? 'mod_logistica.nom_imagen' : $tabla;
        $cmp = ($campo === false) ? 'idimagen' : $campo;
        $conn = Zend_Registry::get('conexion');
        $sql = "SELECT imagen FROM $tb WHERE $cmp = $idimagen";
        $pdo = $conn->execute($sql);
        $result = $pdo->fetchAll(PDO::FETCH_COLUMN);
        $result = $result[0];
        $filepath = $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $filepath = substr($dirindex, 0, strrpos($dirindex, 'logistica/'))
            . 'logistica/utiles/configuracion/views/images/configuraciongeneral';
        $fichero = $filepath . '/' . $nomfich;
        file_put_contents($fichero, $result);
    }

    /**
     * Permite dar escala a una imagen.
     *
     * @param   mixed $image  Recurso de imagen, retornado por ejemplo por la funcion imagecreatefromjpeg.
     * @param   int   $scale  Escala. Usar valores porcentuales relativos a 100 (El valor 50 reduce la imagen a la mitad).
     *
     * @return  mixed   Recurso de imagen a escala
     * @author  Rafael Espinosa (QUIMEFA)
     * @author  Lester Gonz\xE1lez
     */
    public static function scale($image, $scale)
    {
        $width = imagesx($image) * $scale / 100;
        $height = imagesy($image) * $scale / 100;

        return self::resize($image, $width, $height);
    }

    /**
     * Permite redimensionar una imagen.
     *
     * @param   mixed  $image  Recurso de imagen, retornado por ejemplo por la funcion imagecreatefromjpeg.
     * @param   double $width  Ancho
     * @param   double $height Alto
     *
     * @return  mixed   Recurso de imagen redimensionado
     * @author  Rafael Espinosa (QUIMEFA)
     * @author  Lester Gonz\xE1lez
     */
    public static function resize($image, $width, $height)
    {
        $newImage = imagecreatetruecolor($width, $height);
        imagecopyresampled($newImage, $image, 0, 0, 0, 0, $width, $height, imagesx($image), imagesy($image));

        return $newImage;
    }


    /**
     * Permite forzar la descarga de un fichero generado en memoria.
     *
     * @param   string $filename  Nombre del fichero generado (esto es para el buffer).
     * @param   mixed  $data      Objeto binario.
     *
     * @return  void
     * @author  Rafael Espinosa (QUIMEFA)
     * @author  Lester Gonz\xE1lez
     */
    public static function force_download($filename = '', $data = '')
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

}