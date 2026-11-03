<?php

/*
 * Este fichero es parte del paquete del portal.
 *Roberto
 * Autor: Liván Alejandro Capote Valdés.
 * <lacapote@xetid.cu>
 */

class AparienciaModel extends ZendExt_Model
{
    public function AparienciaModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * @name    listadeImagenes
     * @author    Liván A Capote Valdés
     * @access    public
     *
     * @param
     *
     * @return
     * @uses      Método para listar las imágenes
     */
    function listadeImagenes($direccion)
    {
        $validExts = array(".gif", ".jpg", ".jpeg", ".png", ".ico");
        // image list
        $list = array();
        // create handle for images directory        
        $dir = opendir($direccion);
        // loop through each entry in the directory
        while ($fileName = readdir($dir)) {
            // exclude sub directories
            if (is_file($direccion . $fileName)) {
                // exclude files that aren't images
                if (in_array(
                    strtolower(strrchr($fileName, ".")),
                    $validExts
                )) {
                    // get the image dimensions
                    list($width, $height) = getimagesize(
                        $direccion . $fileName
                    );
                    // get the image size
                    $size = filesize($direccion . $fileName);
                        $list[] = array(
                            "name" => $fileName,
                            "width" => $width,
                            "height" => $height,
                            "size" => $size,
                            "url" => '/portal/views/js/portal/apariencia/imagen/' . 'wallpapers/' . urlencode($fileName)
                        );
                }
            }
        }
        // close the directory service
        closedir($dir);

        // output the image list as json
        return $list;
    }

    function listadeIconos($direccion)
    {
        $validExts = array(".gif", ".jpg", ".jpeg", ".png");
        // image list
        $list = array();
        // create handle for images directory        
        $dir = opendir($direccion);
        // loop through each entry in the directory
        while ($fileName = readdir($dir)) {
            // exclude sub directories
            if (is_file($direccion . $fileName)) {
                // exclude files that aren't images
                if (in_array(
                    strtolower(strrchr($fileName, ".")),
                    $validExts
                )) {
                    // get the image dimensions
                    list($width, $height) = getimagesize(
                        $direccion . $fileName
                    );
                    // get the image size
                    $size = filesize($direccion . $fileName);
                    // append to the image list					
                    $list[] = array(
                        "name" => $fileName,
                        "width" => $width,
                        "height" => $height,
                        "size" => $size,
                        "url" => '/portal/views/js/portal/apariencia/imagen/' . 'Icons/' . urlencode($fileName)
                    );
                }
            }
        }
        // close the directory service
        closedir($dir);

        // output the image list as json
        return $list;
    }

    function listadeIconosMenu($direccion)
    {
        $validExts = array(".gif", ".jpg", ".jpeg", ".png");
        // image list
        $list = array();
        // create handle for images directory
        $dir = opendir($direccion);
        // loop through each entry in the directory
        while ($fileName = readdir($dir)) {
            // exclude sub directories
            if (is_file($direccion . $fileName)) {
                // exclude files that aren't images
                if (in_array(
                    strtolower(strrchr($fileName, ".")),
                    $validExts
                )) {
                    // get the image dimensions
                    list($width, $height) = getimagesize(
                        $direccion . $fileName
                    );
                    // get the image size
                    $size = filesize($direccion . $fileName);
                    // append to the image list
                    $list[] = array(
                        "name" => $fileName,
                        "width" => $width,
                        "height" => $height,
                        "size" => $size,
                        "url" => '/lib/ExtJS/temas/default/images/iconos/' . $fileName
                    );
                }
            }
        }
        // close the directory service
        closedir($dir);

        // output the image list as json
        return $list;
    }
}
