<?php

/**
 * Genera imagenes basadas en palabras aleatorias.
 *
 * @category   ZendExt
 * @package    ZendExt_Captcha
 * @copyright  Equipo de seguridad UCID.
 */
class ZendExt_Captcha_Image extends Zend_Captcha_Word
{

    /**
     * Directorio de generacion de la imagen
     *
     * @var string
     */
    protected $_imgDir = "./images/captcha/";
    /**
     * URL de acceso a la imagen
     *
     * @var string
     */
    protected $_imgUrl = "/images/captcha/";
    /**
     * Contenido de la etiqueta alt de imagen.
     *
     * @var string
     */
    protected $_imgAlt = "";
    /**
     * Sufijo de la imagen.
     *
     * @var string
     */
    protected $_suffix = ".png";
    /**
     * Ancho de la imagen
     *
     * @var int
     */
    protected $_width = 200;
    /**
     * Altura de la imagen
     *
     * @var int
     */
    protected $_height = 50;
    /**
     * Tamaño de la fuente
     *
     * @var int
     */
    protected $_fsize = 24;
    /**
     * Fichero de fuente para la creacion de la imagen
     *
     * @var string
     */
    protected $_font;
    /**
     * Imagen a usar como punto de partida
     * Por defecto es la imagen en blanco. Si existe, debe ser imagen PNG.
     *
     * @var string
     */
    protected $_startImage;
    /**
     * Cuan frecuente sera ejecutado el recolector de basura.
     *
     * @var int
     */
    protected $_gcFreq = 10;
    /**
     * Tiempo de expiracion de la imagen
     *
     * @var int
     */
    protected $_expiration = 600;
    /**
     * Número de puntos de ruido en la imagen
     * Se utiliza dos veces - antes y después de transformar
     *
     * @var int
     */
    protected $_dotNoiseLevel = 100;
    /**
     * Número de líneas de ruido en la imagen
     * Se utiliza dos veces - antes y después de transformar
     *
     * @var int
     */
    protected $_lineNoiseLevel = 5;
    /**
     * Color de las lineas de ruido en la imagen
     *
     * @var int
     */
    protected $_lineNoiseColor = array(80, 100, 150);
    /**
     * Color de los puntos de ruido en la imagen
     *
     * @var int
     */
    protected $_dotNoiseColor = array(190, 100, 60);
    /**
     * Color de fondo de la imagen
     *
     * @var int
     */
    protected $_bgColor = array(255, 255, 255);
    /**
     * Color de fondo de la imagen
     *
     * @var int
     */
    protected $_textColor = array(0, 0, 0);

    /**
     * @return string
     */
    public function getImgAlt()
    {
        return $this->_imgAlt;
    }

    /**
     * @return string
     */
    public function getStartImage()
    {
        return $this->_startImage;
    }

    /**
     * @return int
     */
    public function getDotNoiseLevel()
    {
        return $this->_dotNoiseLevel;
    }

    /**
     * @return int
     */
    public function getLineNoiseLevel()
    {
        return $this->_lineNoiseLevel;
    }

    /**
     * Devuelve la caducidad del captcha.
     *
     * @return int
     */
    public function getExpiration()
    {
        return $this->_expiration;
    }

    /**
     * Devuelve la frecuencia del recolector de basura.
     *
     * @return int
     */
    public function getGcFreq()
    {
        return $this->_gcFreq;
    }

    /**
     * Devuelve la fuente a utilizar al generar el Captcha
     *
     * @return string
     */
    public function getFont()
    {
        return $this->_font;
    }

    /**
     * Devuelve el tamaño de la fuente.
     *
     * @return int
     */
    public function getFontSize()
    {
        return $this->_fsize;
    }

    /**
     * Devuelve la altura de la imagen Captcha.
     *
     * @return int
     */
    public function getHeight()
    {
        return $this->_height;
    }

    /**
     * Devuelve el directorio donde se almacena la imagen Captcha.
     *
     * @return string
     */
    public function getImgDir()
    {
        return $this->_imgDir;
    }

    /**
     * Devuelve la url base de la imagen Captcha.
     *
     * @return string
     */
    public function getImgUrl()
    {
        return $this->_imgUrl;
    }

    /**
     * Devuelve el sufijo del archivo de imagen Captcha.
     *
     * @return string
     */
    public function getSuffix()
    {
        return $this->_suffix;
    }

    /**
     * Devuelve el ancho de la imagen Captcha.
     *
     * @return int
     */
    public function getWidth()
    {
        return $this->_width;
    }

    /**
     * Devuelve el color de linea de la imagen Captcha.
     *
     * @return array
     */
    public function getLineNoiseColor()
    {
        return $this->_lineNoiseColor;
    }

    /**
     * Devuelve el color de los puntos de la imagen Captcha.
     *
     * @return array
     */
    public function getDotNoiseColor()
    {
        return $this->_dotNoiseColor;
    }

    /**
     * Devuelve el color de fondo de la imagen Captcha.
     *
     * @return array
     */
    public function getBgColor()
    {
        return $this->_bgColor;
    }

    /**
     * Devuelve el color de fuente de la imagen Captcha.
     *
     * @return array
     */
    public function getTextColor()
    {
        return $this->_textColor;
    }

    /**
     * @param string $startImage
     */
    public function setStartImage($startImage)
    {
        $this->_startImage = $startImage;
        return $this;
    }

    /**
     * @param int $dotNoiseLevel
     */
    public function setDotNoiseLevel($dotNoiseLevel)
    {
        $this->_dotNoiseLevel = $dotNoiseLevel;
        return $this;
    }

    /**
     * @param int $lineNoiseLevel
     */
    public function setLineNoiseLevel($lineNoiseLevel)
    {
        $this->_lineNoiseLevel = $lineNoiseLevel;
        return $this;
    }

    /**
     * Cambia la caducidad del Captcha
     *
     * @param int $expiration
     * @return Zend_Captcha_Image
     */
    public function setExpiration($expiration)
    {
        $this->_expiration = $expiration;
        return $this;
    }

    /**
     * Cambia la frecuencia del recolector de basura.
     *
     * @param int $gcFreq
     * @return Zend_Captcha_Image
     */
    public function setGcFreq($gcFreq)
    {
        $this->_gcFreq = $gcFreq;
        return $this;
    }

    /**
     * Cambia la fuente del Captcha.
     *
     * @param  string $font
     * @return Zend_Captcha_Image
     */
    public function setFont($font)
    {
        $this->_font = $font;
        return $this;
    }

    /**
     * Cambia el tamaño de la fuente de la imagen Captcha.
     *
     * @param  int $fsize
     * @return Zend_Captcha_Image
     */
    public function setFontSize($fsize)
    {
        $this->_fsize = $fsize;
        return $this;
    }

    /**
     * Cambia el alto de la imagen Captcha.
     *
     * @param  int $height
     * @return Zend_Captcha_Image
     */
    public function setHeight($height)
    {
        $this->_height = $height;
        return $this;
    }

    /**
     * Cambia el directorio de almacenamiento de la imagen Captcha.
     *
     * @param  string $imgDir
     * @return Zend_Captcha_Image
     */
    public function setImgDir($imgDir)
    {
        $this->_imgDir = rtrim($imgDir, "/\\") . '/';
        return $this;
    }

    /**
     * Cambia la URL base de la imagen Captcha.
     *
     * @param  string $imgUrl
     * @return Zend_Captcha_Image
     */
    public function setImgUrl($imgUrl)
    {
        $this->_imgUrl = rtrim($imgUrl, "/\\") . '/';
        return $this;
    }

    /**
     * @param string $imgAlt
     */
    public function setImgAlt($imgAlt)
    {
        $this->_imgAlt = $imgAlt;
        return $this;
    }

    /**
     * Cambia el sufijo del fichero de imagen Captcha
     *
     * @param  string $suffix
     * @return Zend_Captcha_Image
     */
    public function setSuffix($suffix)
    {
        $this->_suffix = $suffix;
        return $this;
    }

    /**
     * Cambia el ancho de la imagen Captcha.
     *
     * @param  int $width
     * @return Zend_Captcha_Image
     */
    public function setWidth($width)
    {
        $this->_width = $width;
        return $this;
    }

    /**
     * Cambia el color de linea de la imagen Captcha.
     * @param  string $lineColor
     * @return Zend_Captcha_Image
     */
    public function setLineNoiseColor($lineColor)
    {
        $lnColor = array();
        $lnColor = explode(' ', $lineColor);
        if (count($lnColor) == 3)
            $this->_lineNoiseColor = $lnColor;
        else
            $this->_lineNoiseColor = $this->getLineNoiseColor();
        return $this;
    }

    /**
     * Cambia el color de los puntos de la imagen Captcha.
     *
     * @param  string $dotColor
     * @return Zend_Captcha_Image
     */
    public function setDotNoiseColor($dotColor)
    {
        $dnColor = array();
        $dnColor = explode(' ', $dotColor);
        if (count($dnColor) == 3)
            $this->_dotNoiseColor = $dnColor;
        else
            $this->_dotNoiseColor = $this->getDotNoiseColor();
        return $this;
    }

    /**
     * Cambia el color de fondo de la imagen Captcha.
     *
     * @param  string $bgColor
     * @return Zend_Captcha_Image
     */
    public function setBgColor($bgColor)
    {
        $bgnColor = array();
        $bgnColor = explode(' ', $bgColor);
        if (count($bgnColor) == 3)
            $this->_bgColor = $bgnColor;
        else
            $this->_bgColor = $this->getBgColor();
        return $this;
    }

    /**
     * Cambia el color de fuente de la imagen Captcha.
     *
     * @param  string $textColor
     * @return Zend_Captcha_Image
     */
    public function setTextColor($textColor)
    {
        $tColor = array();
        $tColor = explode(' ', $textColor);
        if (count($tColor) == 3)
            $this->_textColor = $tColor;
        else
            $this->_textColor = $this->getTextColor();
        return $this;
    }

    /**
     * Genera una frecuencia aleatoria.
     *
     * @return float
     */
    protected function _randomFreq()
    {
        return mt_rand(700000, 1000000) / 15000000;
    }

    /**
     * Genera una frase aleatoria.
     *
     * @return float
     */
    protected function _randomPhase()
    {
        return mt_rand(0, 3141592) / 1000000;
    }

    /**
     * Genera el tamaño de los caracteres de forma aleatoria
     *
     * @return int
     */
    protected function _randomSize()
    {
        return mt_rand(300, 700) / 100;
    }

    /**
     * Genera el Captcha
     *
     * @return string captcha ID
     */
    public function generate()
    {
        $id = parent::generate();
        $tries = 5;
        while ($tries-- && file_exists($this->getImgDir() . $id . $this->getSuffix())) {
            $id = $this->_generateRandomId();
            $this->_setId($id);
        }
        $this->_generateImage($id, $this->getWord());

        if (mt_rand(1, $this->getGcFreq()) == 1) {
            $this->_gc();
        }
        return $id;
    }

    /**
     * Genera la imagen Captcha.
     *
     * @param string $id ID Captcha
     * @param string $word Palabra Captcha
     */
    protected function _generateImage($id, $word)
    {
        if (!extension_loaded("gd")) {
            throw new Exception("Imagen CAPTCHA requiere la extensión GD");
        }
        if (!function_exists("imagepng")) {
            throw new Exception("Imagen CAPTCHA requiere soporte PNG");
        }
        if (!function_exists("imageftbbox")) {
            throw new Exception("Imagen CAPTCHA requiere soporte para fuentes FT");
        }
        $font = $this->getFont();
        if (empty($font)) {
            throw new Exception("Imagen CAPTCHA requiere fuente");
        }

        $w = $this->getWidth();
        $h = $this->getHeight();
        $fsize = $this->getFontSize();

        $img_file = $this->getImgDir() . $id . $this->getSuffix();
        if (empty($this->_startImage)) {
            $img = imagecreatetruecolor($w, $h);
        } else {
            $img = imagecreatefrompng($this->_startImage);
            if (!$img) {
                throw new Exception("Can not load start image");
            }
            $w = imagesx($img);
            $h = imagesy($img);
        }
        // Se obtienen los colores de la fuente, lineas, puntos y de fondo de la imagen.
        $tColor = $this->getTextColor();
        $dnColor = $this->getDotNoiseColor();
        $lnColor = $this->getLineNoiseColor();
        $bgColor = $this->getBgColor();

        $text_color = imagecolorallocate($img, $tColor[0], $tColor[1], $tColor[2]);
        $dop_color = imagecolorallocate($img, $dnColor[0], $dnColor[1], $dnColor[2]);
        $line_color = imagecolorallocate($img, $lnColor[0], $lnColor[1], $lnColor[2]);
        $bg_color = imagecolorallocate($img, $bgColor[0], $bgColor[1], $bgColor[2]);
        imagefilledrectangle($img, 0, 0, $w - 1, $h - 1, $bg_color);
        $textbox = imageftbbox($fsize, 0, $font, $word);
        $x = ($w - ($textbox[2] - $textbox[0])) / 2;
        $y = ($h - ($textbox[7] - $textbox[1])) / 2;
        imagefttext($img, $fsize, 0, $x, $y, $text_color, $font, $word);

        // generando ruido
        for ($i = 0; $i < $this->_dotNoiseLevel; $i++) {
            imagefilledellipse($img, mt_rand(0, $w), mt_rand(0, $h), 2, 2, $dop_color);
        }
        for ($i = 0; $i < $this->_lineNoiseLevel; $i++) {
            imageline($img, mt_rand(0, $w), mt_rand(0, $h), mt_rand(0, $w), mt_rand(0, $h), $line_color);
        }

        // Aplicando transformaciones a la imagen
        $img2 = imagecreatetruecolor($w, $h);
        $bg_color = imagecolorallocate($img2, $bgColor[0], $bgColor[1], $bgColor[2]);
        imagefilledrectangle($img2, 0, 0, $w - 1, $h - 1, $bg_color);

        $freq1 = $this->_randomFreq();
        $freq2 = $this->_randomFreq();
        $freq3 = $this->_randomFreq();
        $freq4 = $this->_randomFreq();

        $ph1 = $this->_randomPhase();
        $ph2 = $this->_randomPhase();
        $ph3 = $this->_randomPhase();
        $ph4 = $this->_randomPhase();

        $szx = $this->_randomSize();
        $szy = $this->_randomSize();

        for ($x = 0; $x < $w; $x++) {
            for ($y = 0; $y < $h; $y++) {
                $sx = $x + (sin($x * $freq1 + $ph1) + sin($y * $freq3 + $ph3)) * $szx;
                $sy = $y + (sin($x * $freq2 + $ph2) + sin($y * $freq4 + $ph4)) * $szy;

                if ($sx < 0 || $sy < 0 || $sx >= $w - 1 || $sy >= $h - 1) {
                    continue;
                } else {
                    /* extraemos los colores actuales usando operadores bit a bit */
                    $color_x = imagecolorat($img, $sx, $sy) >> 16;
                    $color_y = imagecolorat($img, $sx, $sy) >> 8 & 0xFF;
                    $color_xy = imagecolorat($img, $sx, $sy) & 0xFF;
                }
                imagesetpixel($img2, $x, $y, imagecolorallocate($img2, $color_x, $color_y, $color_xy));
            }
        }

        imagepng($img2, $img_file);
        imagedestroy($img);
        imagedestroy($img2);
    }

    /**
     * Elimina los directorios temporales del directorio de la imagen.
     *
     */
    protected function _gc()
    {
        $expire = time() - $this->getExpiration();
        $imgdir = $this->getImgDir();
        if (!$imgdir || strlen($imgdir) < 2) {
            // safety guard
            return;
        }
        foreach (new DirectoryIterator($imgdir) as $file) {
            if (!$file->isDot() && !$file->isDir()) {
                if ($file->getMTime() < $expire) {
                    unlink($file->getPathname());
                }
            }
        }
    }

    /**
     * Muestra el Captcha
     *
     * @param Zend_View_Interface $view
     * @param mixed $element
     * @return string
     */
    public function render(Zend_View_Interface $view = null, $element = null)
    {
        return '<img width="' . $this->getWidth() . '" height="' . $this->getHeight() . '" alt="' . $this->getImgAlt() . '" src="' . $this->getImgUrl() . $this->getId() . $this->getSuffix() . '"/><br/>';
    }

}
